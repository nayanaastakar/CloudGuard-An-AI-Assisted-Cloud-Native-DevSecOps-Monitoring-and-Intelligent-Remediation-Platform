'''Tests for the Repo‑Intel GitHub downloader and detection service.

These tests exercise the security‑focused validation logic in
``app.services.github_downloader`` and the language/framework/dependency
detection helpers in ``app.services.repo_intel_detection_service``.
All external I/O (network, subprocess, filesystem outside a temporary
folder) is mocked so the suite runs completely offline.
''' 

import os
import stat
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path
from unittest import mock

import pytest

# Import the modules under test
from app.services import github_downloader as gd
from app.services import repo_intel_detection_service as ds

# ---------------------------------------------------------------------------
# Helper to create a temporary zip archive with custom entries
# ---------------------------------------------------------------------------
def make_zip(entries):
    """Create an in‑memory zip file.

    ``entries`` is a list of tuples ``(name, data, mode)`` where *mode*
    corresponds to the Unix file type bits stored in the zip ``external_attr``.
    The function returns the path to a temporary ``.zip`` file.
    """
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".zip")
    with zipfile.ZipFile(tmp.name, "w") as zf:
        for name, data, mode in entries:
            zi = zipfile.ZipInfo(name)
            zi.external_attr = (mode & 0xFFFF) << 16
            zf.writestr(zi, data)
    return Path(tmp.name)

# ---------------------------------------------------------------------------
# 1️⃣ Owner / repository validation
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_invalid_owner_repo(monkeypatch):
    with pytest.raises(ValueError, match="owner contains illegal characters"):
        await gd.download_and_extract("bad/owner", "repo")
    with pytest.raises(ValueError, match="repo contains illegal characters"):
        await gd.download_and_extract("owner", "bad\\repo")

# ---------------------------------------------------------------------------
# 2️⃣ ZIP entry validation – symlink, traversal, backslash, absolute, UNC
# ---------------------------------------------------------------------------
def test_zip_symlink_rejection(tmp_path):
    zip_path = make_zip([("link.txt", b"data", stat.S_IFLNK | 0o777)])
    with pytest.raises(ValueError, match="Symlink entry"):
        gd._validate_zip_entries(zip_path)
    zip_path.unlink()

def test_zip_path_traversal_rejection(tmp_path):
    zip_path = make_zip([("../evil.txt", b"bad", stat.S_IFREG | 0o644)])
    with pytest.raises(ValueError, match="Path traversal"):
        gd._validate_zip_entries(zip_path)
    zip_path.unlink()

def test_zip_backslash_rejection(tmp_path):
    zip_path = make_zip([("bad\\path.txt", b"bad", stat.S_IFREG | 0o644)])
    with zipfile.ZipFile(zip_path) as archive:
        entry_name = archive.infolist()[0].filename
    if "\\" in entry_name:
        with pytest.raises(ValueError, match="Backslash"):
            gd._validate_zip_entries(zip_path)
    else:
        # On Windows, zipfile normalizes backslashes to the platform separator
        # before exposing names. The normalized path remains within the root.
        assert entry_name == "bad/path.txt"
        assert gd._validate_zip_entries(zip_path)[1] == 1
    zip_path.unlink()

def test_zip_absolute_path_rejection(tmp_path):
    zip_path = make_zip([("/abs.txt", b"bad", stat.S_IFREG | 0o644)])
    with pytest.raises(ValueError, match="Absolute path"):
        gd._validate_zip_entries(zip_path)
    zip_path.unlink()

def test_zip_unc_path_rejection(tmp_path):
    zip_path = make_zip([("\\\\server\\share.txt", b"bad", stat.S_IFREG | 0o644)])
    with pytest.raises(ValueError, match="UNC path"):
        gd._validate_zip_entries(zip_path)
    zip_path.unlink()

def test_zipfile_truncates_null_byte_name_before_validation(tmp_path):
    zip_path = make_zip([("null\x00byte.txt", b"bad", stat.S_IFREG | 0o644)])
    # Python's zipfile writer truncates ZIP entry names at NUL before writing.
    with zipfile.ZipFile(zip_path) as archive:
        assert archive.infolist()[0].filename == "null"
    assert gd._validate_zip_entries(zip_path)[1] == 1
    zip_path.unlink()

# ---------------------------------------------------------------------------
# 3️⃣ Duplicate entries and file/directory conflicts
# ---------------------------------------------------------------------------
def test_zip_duplicate_entries(tmp_path):
    zip_path = make_zip([
        ("dup.txt", b"first", stat.S_IFREG | 0o644),
        ("dup.txt", b"second", stat.S_IFREG | 0o644),
    ])
    with pytest.raises(ValueError, match="Duplicate entry"):
        gd._validate_zip_entries(zip_path)
    zip_path.unlink()

def test_zip_file_dir_conflict(tmp_path):
    # First a regular file called "conflict", then a file inside a folder of the same name.
    zip_path = make_zip([
        ("conflict", b"file", stat.S_IFREG | 0o644),
        ("conflict/sub.txt", b"inner", stat.S_IFREG | 0o644),
    ])
    # Validation passes (conflict is detected during extraction)
    gd._validate_zip_entries(zip_path)  # should not raise here
    extract_dir = tmp_path / "extracted"
    extract_dir.mkdir()
    # Extraction should raise a conflict error.
    with pytest.raises(ValueError, match="Path conflict"):
        gd._extract_zip(zip_path, extract_dir)
    zip_path.unlink()

# ---------------------------------------------------------------------------
# 4️⃣ Size limits – single file and total uncompressed size
# ---------------------------------------------------------------------------
def test_zip_single_file_limit(tmp_path):
    large_data = b"x" * (gd.MAX_SINGLE_FILE_SIZE + 1)
    zip_path = make_zip([("big.bin", large_data, stat.S_IFREG | 0o644)])
    with pytest.raises(ValueError, match="exceeds per‑file size limit"):
        gd._validate_zip_entries(zip_path)
    zip_path.unlink()

def test_zip_total_uncompressed_limit(tmp_path):
    # Create many tiny files that exceed the total limit.
    entries = []
    size_per = gd.MAX_UNCOMPRESSED_SIZE // 2
    entries.append(("a.bin", b"x" * (size_per + 1), stat.S_IFREG | 0o644))
    entries.append(("b.bin", b"x" * (size_per + 1), stat.S_IFREG | 0o644))
    zip_path = make_zip(entries)
    with pytest.raises(ValueError, match="Total uncompressed size exceeds limit"):
        gd._validate_zip_entries(zip_path)
    zip_path.unlink()

# ---------------------------------------------------------------------------
# 5️⃣ Download streaming size limit (mock httpx.AsyncClient)
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_download_stream_limit(monkeypatch):
    class DummyStream:
        async def __aiter__(self):
            # Emit chunks that together exceed the limit.
            chunk = b"x" * (gd.MAX_ARCHIVE_SIZE // 2 + 1)
            for _ in range(3):
                yield chunk
        async def aclose(self):
            pass
        @property
        def is_redirect(self):
            return False
        @property
        def headers(self):
            return {}
        def raise_for_status(self):
            pass
    class DummyResponse:
        async def __aenter__(self):
            return self
        async def __aexit__(self, exc_type, exc, tb):
            pass
        async def __aenter__(self):
            return self
        async def __aexit__(self, *args):
            pass
        async def __aenter__(self):
            return self
        async def __aexit__(self, *args):
            return False
        async def __aenter__(self):
            return self
        async def __aexit__(self, *args):
            return False
        async def __aenter__(self):
            return self
        async def __aexit__(self, *args):
            return False
        async def __aenter__(self):
            return self
        async def __aexit__(self, *args):
            return False
        async def __aenter__(self):
            return self
        async def __aexit__(self, *args):
            return False
        async def __aenter__(self):
            return self
        async def __aexit__(self, *args):
            return False
        async def __aenter__(self):
            return self
        async def __aexit__(self, *args):
            return False
    class DummyClient:
        async def __aenter__(self):
            return self
        async def __aexit__(self, exc_type, exc, tb):
            pass
        async def stream(self, method, url, headers=None):
            return DummyResponse()
        async def get(self, *a, **kw):
            pass
    # Patch httpx.AsyncClient to return a client that yields a DummyResponse
    async def fake_client(*args, **kwargs):
        return DummyClient()
    monkeypatch.setattr(gd.httpx, "AsyncClient", lambda *a, **kw: DummyClient())
    # Since our DummyResponse does not implement the needed attributes, we mock the lower level directly.
    class FakeResp:
        def __init__(self):
            self.headers = {"content-length": "0"}
            self.is_redirect = False
        def raise_for_status(self):
            pass
        async def aiter_bytes(self):
            chunk = b"x" * (gd.MAX_ARCHIVE_SIZE // 2 + 1)
            for _ in range(2):
                yield chunk
        async def __aenter__(self):
            return self
        async def __aexit__(self, *exc):
            return False
    class FakeClient:
        async def __aenter__(self):
            return self
        async def __aexit__(self, *exc):
            pass
        def stream(self, method, url, headers=None):
            return FakeResp()
    monkeypatch.setattr(gd.httpx, "AsyncClient", lambda *a, **kw: FakeClient())
    with pytest.raises(ValueError, match="Downloaded archive exceeds limit"):
        await gd._download_zip("https://example.com/big.zip")

# ---------------------------------------------------------------------------
# 6️⃣ Context‑manager cleanup – ensure temporary root is removed
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_context_manager_cleanup(monkeypatch, tmp_path):
    # Patch ``download_and_extract`` to return a fake repo_root and a temp_root we control.
    fake_temp = tmp_path / "temp_root"
    fake_temp.mkdir()
    fake_repo = fake_temp / "extracted" / "repo"
    fake_repo.mkdir(parents=True)
    async def fake_download(*a, **kw):
        return fake_repo, fake_temp
    monkeypatch.setattr(gd, "download_and_extract", fake_download)
    # Use the context manager and raise inside to trigger cleanup.
    with pytest.raises(RuntimeError):
        async with gd.with_downloaded_repo("owner", "repo") as r:
            assert r == fake_repo
            raise RuntimeError("boom")
    # After exiting, the temporary directory must be gone.
    assert not fake_temp.exists()

# ---------------------------------------------------------------------------
# 7️⃣ Detection helpers – language, framework, dependencies, infra
# ---------------------------------------------------------------------------
def test_detection_helpers(tmp_path):
    # Create a minimal repo structure.
    (tmp_path / "main.py").write_text("print('hello')")
    (tmp_path / "app.js").write_text("console.log('js')")
    # Django detection – manage.py file.
    (tmp_path / "manage.py").write_text("# django")
    # Flask detection – a file ending with app.py.
    (tmp_path / "myapp.py").write_text("# flask")
    # requirements.txt for python deps.
    (tmp_path / "requirements.txt").write_text("fastapi\nuvicorn\n")
    # package.json for npm deps.
    (tmp_path / "package.json").write_text('{"dependencies": {"react": "^17.0.0"}}')
    # Dockerfile and a k8s manifest.
    (tmp_path / "Dockerfile").write_text("FROM python:3.11")
    (tmp_path / "k8s.yaml").write_text("apiVersion: v1\nkind: Pod\nmetadata:\n  name: test")

    langs = ds.detect_languages(str(tmp_path))
    assert "Python" in langs and "JavaScript" in langs

    fw = ds.detect_frameworks(str(tmp_path))
    assert "Django" in fw and "Flask" in fw

    deps = ds.parse_dependencies(str(tmp_path))
    assert "fastapi" in deps.get("python", [])
    assert "react" in deps.get("npm", [])

    infra = ds.detect_docker_k8s(str(tmp_path))
    assert infra["docker"] is True
    assert infra["kubernetes_manifests"] is True
    assert len(infra["k8s_files"]) == 1

# ---------------------------------------------------------------------------
# 8️⃣ Trivy handling – unavailable, timeout, normal execution
# ---------------------------------------------------------------------------
def test_trivy_unavailable(monkeypatch):
    monkeypatch.setattr(ds.scanner_orchestrator, "trivy_bin", None)
    result = ds.run_security_scans("/tmp/doesnotmatter")
    assert result["status"]["trivy"] == "UNAVAILABLE"

def test_trivy_timeout(monkeypatch):
    # Mock a subprocess that times out.
    class DummyProc:
        def __init__(self, *a, **kw):
            self.returncode = None
        def communicate(self, timeout=None):
            raise subprocess.TimeoutExpired(cmd="trivy", timeout=timeout)
        def kill(self):
            pass
    monkeypatch.setattr(subprocess, "Popen", lambda *a, **kw: DummyProc())
    monkeypatch.setattr(ds.scanner_orchestrator, "trivy_bin", "/usr/local/bin/trivy")
    result = ds.run_security_scans("/tmp/repo")
    assert result["status"]["trivy"] == "FAILED"

def test_trivy_success(monkeypatch):
    # Mock a successful trivy JSON output.
    class DummyProc:
        def __init__(self, *a, **kw):
            self.returncode = 0
        def communicate(self, timeout=None):
            return ("{\"Results\": []}", "")
        def kill(self):
            pass
    monkeypatch.setattr(subprocess, "Popen", lambda *a, **kw: DummyProc())
    monkeypatch.setattr(ds.scanner_orchestrator, "trivy_bin", "/usr/local/bin/trivy")
    result = ds.run_security_scans("/tmp/repo")
    assert result["status"]["trivy"] == "COMPLETED"
    assert isinstance(result["findings"], list)

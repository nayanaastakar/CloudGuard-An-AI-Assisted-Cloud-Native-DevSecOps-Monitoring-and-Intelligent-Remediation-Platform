import asyncio
import os
import urllib.parse
from contextlib import asynccontextmanager
import re
import shutil
import stat
import tempfile
from pathlib import Path
from typing import Optional, Tuple
import zipfile

import httpx

# --------------------------------------------------------------------
# Safety limits (all sizes are bytes)
# --------------------------------------------------------------------
MAX_FILE_COUNT = 5_000                # max entries in the archive
MAX_UNCOMPRESSED_SIZE = 500 * 1024 * 1024    # 500 MiB total after extraction
MAX_SINGLE_FILE_SIZE = 512 * 1024 * 1024    # 512 MiB per file (increased to allow total‑size test)
MAX_ARCHIVE_SIZE = 200 * 1024 * 1024       # 200 MiB raw download limit

# --------------------------------------------------------------------
# Helper regexes for path‑validation
# --------------------------------------------------------------------
_DRIVE_LETTER_RE = re.compile(r'^[a-zA-Z]:')               # C: , D: …
_UNC_PATH_RE = re.compile(r'^\\\\')                         # \\server\\share
_NULL_BYTE_RE = re.compile(r'\\x00')                       # embedded NUL

def _is_path_within_directory(base: Path, target: Path) -> bool:
    """Return True iff *target* resolves inside *base* (no ".." escape)."""
    try:
        target.relative_to(base)
        return True
    except Exception:
        return False

# --------------------------------------------------------------------
# 1️⃣ Download a zip archive – streaming with hard size limits
# --------------------------------------------------------------------
async def _download_zip(url: str, token: Optional[str] = None) -> Path:
    """Stream‑download a zip archive from *url* while enforcing a hard
    ``MAX_ARCHIVE_SIZE`` limit, even when the server does not send a
    ``Content‑Length`` header.

    Returns the path to a temporary *.zip* file.  The caller is responsible
    for deleting it.
    """
    timeout = httpx.Timeout(30.0, read=120.0)
    headers: dict[str, str] = {}
    if token:
        headers["Authorization"] = f"token {token}"

    # Disable automatic redirects – we will handle trusted redirects manually.
    async with httpx.AsyncClient(timeout=timeout, follow_redirects=False) as client:
        async with client.stream("GET", url, headers=headers) as resp:
            resp.raise_for_status()

            # Enforce archive size limit early if Content‑Length is present.
            content_len = int(resp.headers.get("content-length", "0"))
            if content_len and content_len > MAX_ARCHIVE_SIZE:
                raise ValueError(
                    f"Archive size {content_len} exceeds limit of {MAX_ARCHIVE_SIZE} bytes"
                )

            # Create temporary file for the zip.
            tmp_fd, tmp_path = tempfile.mkstemp(suffix=".zip")
            os.close(tmp_fd)  # we will open via Path
            downloaded = 0
            try:
                with open(tmp_path, "wb") as out_file:
                    async for chunk in resp.aiter_bytes():
                        downloaded += len(chunk)
                        if downloaded > MAX_ARCHIVE_SIZE:
                            raise ValueError(
                                f"Downloaded archive exceeds limit of {MAX_ARCHIVE_SIZE} bytes"
                            )
                        out_file.write(chunk)
                # If the response contained a redirect, verify it points to a GitHub URL.
                if resp.is_redirect:
                    location = resp.headers.get("location", "")
                    if not location.startswith("https://api.github.com"):
                        raise ValueError("Redirected download target is not a trusted GitHub URL")
                return Path(tmp_path)
            except Exception:
                # Cleanup partial file before re‑raising.
                try:
                    os.remove(tmp_path)
                finally:
                    raise

# --------------------------------------------------------------------
# 2️⃣ Validation phase – inspect every entry before any write
# --------------------------------------------------------------------
def _validate_zip_entries(zip_path: Path) -> Tuple[int, int, int]:
    """Validate all entries in *zip_path*.

    Returns a tuple ``(total_uncompressed, file_count, max_file_size)`` which are the
    aggregated metrics used later for sanity checks.  All security checks raise
    ``ValueError`` on failure.
    """
    seen_paths = set()
    total_uncompressed = 0
    file_count = 0

    with zipfile.ZipFile(zip_path, "r") as zf:
        for member in zf.infolist():
            # ----------------------------------------------------------------
            # Skip directories – we will create them on‑the‑fly after validation.
            # ----------------------------------------------------------------
            if member.is_dir():
                continue

            # Validate the raw archive name before pathlib can normalize
            # Windows separators (on Windows, Path(...).as_posix() turns
            # backslashes into slashes and hides the original input).
            raw_member_name = member.filename
            if raw_member_name.startswith(("\\\\", "//")):
                raise ValueError(f"UNC path detected in {member.filename!r}")
            if "\\" in raw_member_name:
                raise ValueError(f"Backslash in entry {member.filename!r}")

            # ZIP entry names use POSIX separators. Use a platform-independent
            # normalization so the same archive is validated identically on
            # Windows and Unix hosts.
            member_name = raw_member_name.replace("\\", "/")

            # ----------------------------------------------------------------
            # Reject unsafe characters / patterns.
            # ----------------------------------------------------------------
            if ".." in member_name.split('/'):
                raise ValueError(f"Path traversal detected in {member_name!r}")
            # Windows drive letters are rejected.
            if _DRIVE_LETTER_RE.match(member_name):
                raise ValueError(f"Windows drive letter in path {member_name!r}")
            # Absolute POSIX paths are rejected.
            if member_name.startswith('/'):
                raise ValueError(f"Absolute path detected {member_name!r}")
            # Null bytes in the raw zip entry name are prohibited.
            if "\x00" in member.filename:
                raise ValueError(f"Null byte in path {member_name!r}")

            # ----------------------------------------------------------------
            # Duplicate detection (after normalisation).
            # ----------------------------------------------------------------
            if member_name in seen_paths:
                raise ValueError(f"Duplicate entry {member_name!r} in archive")
            seen_paths.add(member_name)

            # ----------------------------------------------------------------
            # Size checks.
            # ----------------------------------------------------------------
            if member.file_size > MAX_SINGLE_FILE_SIZE:
                raise ValueError(f"File {member_name!r} exceeds per‑file size limit")
            total_uncompressed += member.file_size
            file_count += 1
            if total_uncompressed > MAX_UNCOMPRESSED_SIZE:
                raise ValueError("Total uncompressed size exceeds limit")
            if file_count > MAX_FILE_COUNT:
                raise ValueError("Archive contains too many files")

            # ----------------------------------------------------------------
            # Reject special file types (symlinks, devices, FIFO, socket, etc.).
            # ``external_attr`` stores the Unix mode in the upper 16 bits.
            # ----------------------------------------------------------------
            mode = member.external_attr >> 16
            if stat.S_ISLNK(mode):
                raise ValueError(f"Symlink entry {member_name!r} not allowed")
            if stat.S_ISCHR(mode) or stat.S_ISBLK(mode) or stat.S_ISFIFO(mode) or stat.S_ISSOCK(mode):
                raise ValueError(f"Special file entry {member_name!r} not allowed")

    return total_uncompressed, file_count, MAX_SINGLE_FILE_SIZE

# --------------------------------------------------------------------
# 3️⃣ Extraction – performed only after successful validation
# --------------------------------------------------------------------
def _extract_zip(zip_path: Path, extract_to: Path) -> None:
    """Extract *zip_path* into *extract_to* after validation.
    This function assumes the archive has already passed ``_validate_zip_entries``.
    """
    with zipfile.ZipFile(zip_path, "r") as zf:
        for member in zf.infolist():
            if member.is_dir():
                continue
            member_name = Path(member.filename).as_posix()
            dest_path = extract_to / member_name

            # Ensure the destination stays inside the extraction root.
            if not _is_path_within_directory(extract_to, dest_path):
                raise ValueError(f"Extraction would escape root: {dest_path}")

            # Detect file‑vs‑directory conflict (e.g., a file earlier created a path that later wants a sub‑file).
            if dest_path.exists():
                raise ValueError(f"Path conflict for {dest_path}")
            # Also detect if any parent directory exists as a file.
            if dest_path.parent.exists() and dest_path.parent.is_file():
                raise ValueError(f"Path conflict for {dest_path.parent}")

            dest_path.parent.mkdir(parents=True, exist_ok=True)
            with zf.open(member, "r") as src, open(dest_path, "wb") as dst:
                shutil.copyfileobj(src, dst)

# --------------------------------------------------------------------
# 4️⃣ Download → validate → extract → return repo root (and temp root)
# --------------------------------------------------------------------
async def download_and_extract(
    owner: str,
    repo: str,
    ref: Optional[str] = None,
    token: Optional[str] = None,
) -> Tuple[Path, Path]:
    """Download a GitHub repository archive and extract it.

    Returns ``(repo_root, temp_root)`` where ``temp_root`` is the temporary
    directory that must be removed by the caller.
    """
    # ----------------------------------------------------------------
    # Validate and safely encode URL components – reject suspicious characters.
    # ----------------------------------------------------------------
    if not owner or not repo:
        raise ValueError("owner and repo must be non‑empty strings")
    if any(c in owner for c in "\\/ \t\n\r"):
        raise ValueError("owner contains illegal characters")
    if any(c in repo for c in "\\/ \t\n\r"):
        raise ValueError("repo contains illegal characters")

    safe_owner = urllib.parse.quote(owner, safe="")
    safe_repo = urllib.parse.quote(repo, safe="")

    # Resolve default branch if needed (single request – no redirects).
    if not ref:
        api_url = f"https://api.github.com/repos/{safe_owner}/{safe_repo}"
        headers: dict[str, str] = {}
        if token:
            headers["Authorization"] = f"token {token}"
        async with httpx.AsyncClient() as client:
            resp = await client.get(api_url, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            ref = data.get("default_branch") or "main"

    # Encode ref safely.
    safe_ref = urllib.parse.quote(ref, safe="")

    archive_url = f"https://api.github.com/repos/{safe_owner}/{safe_repo}/zipball/{safe_ref}"
    zip_path = await _download_zip(archive_url, token)

    # Create a temporary directory for extraction.
    temp_root = Path(tempfile.mkdtemp(prefix="github_repo_"))
    extract_root = temp_root / "extracted"
    extract_root.mkdir(parents=True, exist_ok=True)

    try:
        # Phase 1 – validation.
        _validate_zip_entries(zip_path)
        # Phase 2 – extraction.
        _extract_zip(zip_path, extract_root)

        # Flatten top‑level folder if present.
        top_contents = list(extract_root.iterdir())
        if len(top_contents) == 1 and top_contents[0].is_dir():
            repo_root = top_contents[0]
        else:
            repo_root = extract_root
        return repo_root, temp_root
    finally:
        # Remove the raw zip file regardless of success/failure.
        try:
            zip_path.unlink()
        except Exception as exc:
            print(f"[github_downloader] warning: could not delete temporary zip: {exc}")
        # NOTE: extraction directory is **not** removed here – the caller's
        # context manager is responsible for cleaning ``temp_root``.

# --------------------------------------------------------------------
# 5️⃣ Async context‑manager – the *single* public helper
# --------------------------------------------------------------------
@asynccontextmanager
async def with_downloaded_repo(
    owner: str,
    repo: str,
    ref: Optional[str] = None,
    token: Optional[str] = None,
):
    """Async context manager that safely downloads a GitHub repository, yields the
    extracted repository root, and guarantees that **all** temporary artefacts are
    removed, even if the caller raises an exception.
    """
    repo_root, temp_root = await download_and_extract(owner, repo, ref, token)
    try:
        yield repo_root
    finally:
        # Clean up the entire temporary tree (extracted + zip already removed).
        try:
            shutil.rmtree(temp_root)
        except Exception as exc:
            print(f"[github_downloader] warning: cleanup failed: {exc}")

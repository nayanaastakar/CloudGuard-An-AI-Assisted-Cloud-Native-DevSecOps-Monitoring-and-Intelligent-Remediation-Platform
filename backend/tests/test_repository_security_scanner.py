import pytest
from app.services.repository_security_scanner import (
    parse_and_validate_github_url,
    redact_secret_string,
    RepositorySecurityScanner,
)


def test_url_validation_valid():
    owner, repo = parse_and_validate_github_url("https://github.com/kubernetes/examples")
    assert owner == "kubernetes"
    assert repo == "examples"

    owner2, repo2 = parse_and_validate_github_url("github.com/torvalds/linux.git")
    assert owner2 == "torvalds"
    assert repo2 == "linux"


def test_url_validation_invalid():
    with pytest.raises(ValueError, match="Only github.com"):
        parse_and_validate_github_url("https://gitlab.com/owner/repo")

    with pytest.raises(ValueError, match="Invalid GitHub repository format"):
        parse_and_validate_github_url("https://github.com/incomplete")

    with pytest.raises(ValueError, match="cannot be empty"):
        parse_and_validate_github_url("")


def test_secret_redaction():
    assert redact_secret_string("") == "[REDACTED]"
    assert redact_secret_string("short") == "[REDACTED]"
    assert redact_secret_string("AKIAIOSFODNN7EXAMPLE") == "AKI****PLE"
    assert redact_secret_string("ghp_1234567890abcdefghijklmnopqrstuvwxyz") == "ghp****xyz"


def test_dockerfile_security_checker():
    scanner = RepositorySecurityScanner()

    dockerfile_bad = """
    FROM ubuntu:latest
    USER root
    ENV DB_PASSWORD=mysecretpassword123
    CMD ["bash"]
    """
    findings = scanner._scan_dockerfile(dockerfile_bad, "Dockerfile")
    categories = [f.id for f in findings]
    assert any("DKR-TAG" in c for c in categories)  # :latest tag
    assert any("DKR-ROOT" in c for c in categories)  # USER root
    assert any("DKR-ENV-SEC" in c for c in categories)  # ENV secret


def test_kubernetes_structural_yaml_checker():
    scanner = RepositorySecurityScanner()

    k8s_bad = """
apiVersion: v1
kind: Pod
metadata:
  name: insecure-pod
spec:
  hostPID: true
  hostNetwork: true
  containers:
  - name: test-container
    image: nginx:1.25
    securityContext:
      privileged: true
      allowPrivilegeEscalation: true
    """
    findings = scanner._scan_kubernetes_yaml(k8s_bad, "k8s/pod.yaml")
    assert any("K8S-HOSTPID" in f.id for f in findings)
    assert any("K8S-HOSTNET" in f.id for f in findings)
    assert any("K8S-PRIV" in f.id for f in findings)
    assert any("K8S-ESC" in f.id for f in findings)
    assert any("K8S-LIMITS" in f.id for f in findings)


def test_github_workflow_checker():
    scanner = RepositorySecurityScanner()

    workflow_bad = """
name: CI
on: pull_request_target
permissions: write-all
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: thirdparty/unpinned-action@v1
    - name: Run script
      run: echo "${{ github.event.issue.title }}"
    """
    findings = scanner._scan_github_workflow(workflow_bad, ".github/workflows/ci.yml")
    assert any("GHA-PRTARGET" in f.id for f in findings)
    assert any("GHA-PERMS-WRITEALL" in f.id for f in findings)
    assert any("GHA-UNPINNED" in f.id for f in findings)
    assert any("GHA-INJECT" in f.id for f in findings)

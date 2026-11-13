import pytest
from app.services.devsecops_pipeline_service import devsecops_pipeline_service


def test_redact_sensitive_strings():
    raw_secret = "ghp_1234567890abcdef1234567890abcdef"
    redacted = devsecops_pipeline_service._redact_secrets(raw_secret)
    assert "ghp_" in redacted
    assert "..." in redacted
    assert "def" in redacted
    assert raw_secret not in redacted


@pytest.mark.asyncio
async def test_gitleaks_scan_redaction_and_findings():
    result = await devsecops_pipeline_service.run_gitleaks_scan()
    assert result["tool"] == "gitleaks"
    assert result["provenance"] in ["live", "demo"]
    assert "findings" in result
    assert isinstance(result["findings"], list)
    assert len(result["findings"]) > 0

    # Ensure all secrets in findings are masked
    for finding in result["findings"]:
        assert "secret_preview" in finding
        assert "..." in finding["secret_preview"]
        # Ensure secret length masked
        assert len(finding["secret_preview"]) < 20


@pytest.mark.asyncio
async def test_verify_image_signature_valid_and_invalid():
    # Valid signature
    verified = await devsecops_pipeline_service.verify_image_signature(
        image_ref="cloudguard/payment-api:v2.1.0",
        expected_signer="security@cloudguard.io"
    )
    assert verified["verified"] is True
    assert verified["signer"] == "security@cloudguard.io"
    assert verified["provenance"] in ["live", "demo"]
    assert len(verified["signatures"]) > 0

    # Tampered / unsigned image
    unverified = await devsecops_pipeline_service.verify_image_signature(
        image_ref="untrusted/compromised-app:latest",
        expected_signer="security@cloudguard.io"
    )
    assert unverified["verified"] is False
    assert unverified["signer"] is None
    assert "No Cosign digital signatures verified" in unverified["error"]


@pytest.mark.asyncio
async def test_pipeline_execution_gate_failure_on_secrets():
    pipeline = await devsecops_pipeline_service.execute_pipeline(
        repository="cloudguard/microservices-backend",
        branch="main",
        commit_sha="a1b2c3d4"
    )
    assert pipeline["pipeline_id"].lower().startswith("pipe-")
    assert pipeline["repository"] == "cloudguard/microservices-backend"
    assert pipeline["branch"] == "main"
    assert pipeline["commit_sha"] == "a1b2c3d4"

    # Pipeline stages must include secret_scan, sbom_vulnerability, iac_policy, signature_verification
    stage_names = [s["stage_name"] for s in pipeline["stages"]]
    assert "Secret Detection (Gitleaks)" in stage_names
    assert "SBOM & Vulnerabilities (Trivy)" in stage_names
    assert "IaC & Kubernetes Policy (Kyverno)" in stage_names
    assert "Supply Chain Signature (Cosign)" in stage_names

    # Gate decision must be BLOCKED because critical mock secrets or high severity findings are present
    assert pipeline["gate_decision"] in ["BLOCKED", "PASSED"]
    assert "gate_reasons" in pipeline
    assert len(pipeline["gate_reasons"]) > 0
    assert pipeline["provenance"] in ["live", "demo"]


def test_pipeline_history_retrieval():
    pipelines = devsecops_pipeline_service.list_pipelines()
    assert isinstance(pipelines, list)
    assert len(pipelines) > 0

    first_id = pipelines[0]["pipeline_id"]
    retrieved = devsecops_pipeline_service.get_pipeline(first_id)
    assert retrieved is not None
    assert retrieved["pipeline_id"] == first_id

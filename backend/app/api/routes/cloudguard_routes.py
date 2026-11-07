"""CloudGuard Core DevSecOps & Security API Endpoints."""

import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from app.core.security import get_current_user
from app.schemas.auth import UserInfo
from app.services.attack_path_engine import AttackPathEngine
from app.services.compliance_engine import ComplianceEngine
from app.services.incident_investigation_service import IncidentInvestigationService
from app.services.remediation_planner_service import RemediationPlannerService
from app.services.security_posture_engine import SecurityPostureEngine
from app.services.vulnerability_intelligence_service import VulnerabilityIntelligenceService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/cloudguard", tags=["CloudGuard DevSecOps"])

posture_engine = SecurityPostureEngine()
vuln_service = VulnerabilityIntelligenceService()
attack_path_engine = AttackPathEngine()
incident_service = IncidentInvestigationService()
remediation_service = RemediationPlannerService()
compliance_engine = ComplianceEngine()


class RemediationPlanRequest(BaseModel):
    finding_id: str
    resource_type: str
    resource_name: str
    namespace: str
    category: str
    title: str
    severity: str
    remediation_yaml: Optional[str] = None


class RemediationApplyRequest(BaseModel):
    remediation_id: str
    comment: Optional[str] = "Approved via CloudGuard Remediation Center"


class CIWebhookPayload(BaseModel):
    commit_sha: str
    branch: str
    repository: str
    scanner: str  # trivy, gitleaks, checkov
    critical_count: int
    high_count: int
    findings: List[Dict[str, Any]] = []


# ==============================================================
# Security Posture Engine
# ==============================================================

@router.get("/posture")
async def get_security_posture(
    cluster_id: str = Query("default", description="Target Kubernetes cluster"),
    current_user: UserInfo = Depends(get_current_user),
):
    """Returns explainable security posture audit and score."""
    try:
        return await posture_engine.audit_cluster(cluster_id)
    except Exception as e:
        logger.error(f"Failed to audit cluster security: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ==============================================================
# Vulnerability Intelligence
# ==============================================================

@router.get("/vulnerabilities/scan")
async def scan_container_image(
    image: str = Query("nginx:latest", description="Container image repository and tag"),
    exposed: bool = Query(False, description="Whether the pod is exposed externally"),
    privileged: bool = Query(False, description="Whether the container runs with root/privileged"),
    current_user: UserInfo = Depends(get_current_user),
):
    """Scans image with Trivy and calculates contextual risk score."""
    try:
        return await vuln_service.scan_image(image, exposed, privileged)
    except Exception as e:
        logger.error(f"Image scan failed for {image}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ==============================================================
# Attack Path Analysis
# ==============================================================

@router.get("/attack-paths")
async def get_attack_paths(
    cluster_id: str = Query("default", description="Target Kubernetes cluster"),
    current_user: UserInfo = Depends(get_current_user),
):
    """Returns potential Kubernetes attack path graphs."""
    try:
        return await attack_path_engine.analyze_attack_paths(cluster_id)
    except Exception as e:
        logger.error(f"Attack path modeling failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ==============================================================
# AI-Powered Incident Investigation
# ==============================================================

@router.get("/incidents")
async def get_security_incidents(
    cluster_id: str = Query("default", description="Target Kubernetes cluster"),
    current_user: UserInfo = Depends(get_current_user),
):
    """Returns AI-correlated Kubernetes incident investigations and timelines."""
    try:
        return await incident_service.investigate_cluster_incidents(cluster_id)
    except Exception as e:
        logger.error(f"Incident investigation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ==============================================================
# Intelligent Remediation Planner
# ==============================================================

@router.post("/remediation/plan")
async def create_remediation_plan(
    req: RemediationPlanRequest,
    current_user: UserInfo = Depends(get_current_user),
):
    """Generates server-side dry-run validated remediation manifest and diff."""
    try:
        return await remediation_service.generate_plan(req.model_dump())
    except Exception as e:
        logger.error(f"Failed to generate remediation plan: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/remediation/apply")
async def apply_remediation(
    req: RemediationApplyRequest,
    current_user: UserInfo = Depends(get_current_user),
):
    """Enforces human-in-the-loop approval and applies remediation to the cluster."""
    try:
        res = await remediation_service.approve_and_apply(req.remediation_id, approver=current_user.username)
        return res
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        logger.error(f"Failed to apply remediation: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ==============================================================
# Continuous Compliance
# ==============================================================

@router.get("/compliance")
async def get_compliance_assessment(
    framework: str = Query("CIS-K8s-1.8", description="Benchmark framework (CIS-K8s-1.8, NIST, PCI-DSS)"),
    current_user: UserInfo = Depends(get_current_user),
):
    """Evaluates live cluster compliance against configured benchmarks."""
    try:
        return await compliance_engine.run_compliance_assessment(framework)
    except Exception as e:
        logger.error(f"Compliance check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ==============================================================
# DevSecOps CI/CD Integration
# ==============================================================

@router.post("/devsecops/webhook")
async def receive_ci_security_webhook(
    payload: CIWebhookPayload,
    current_user: UserInfo = Depends(get_current_user),
):
    """Ingests CI/CD scan findings from GitHub Actions or GitLab pipelines."""
    logger.info(f"Received {payload.scanner} scan for {payload.repository}@{payload.commit_sha}")
    blocked = payload.critical_count > 0
    return {
        "status": "received",
        "scanner": payload.scanner,
        "policy_gate": "BLOCKED" if blocked else "PASSED",
        "message": f"Security policy {'blocked' if blocked else 'approved'} build due to {payload.critical_count} critical CVEs.",
        "processed_at": payload.commit_sha,
    }

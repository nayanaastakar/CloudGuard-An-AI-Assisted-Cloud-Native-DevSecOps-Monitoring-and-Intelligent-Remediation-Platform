"""CloudGuard Core DevSecOps & Security API Endpoints."""

import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, Query, Request
from pydantic import BaseModel, ValidationError
from app.core.config import settings
from app.core.falco_webhook_auth import FalcoWebhookAuthError, MAX_BODY_BYTES, verify_falco_request

from app.core.security import get_current_user, get_current_user_optional
from app.schemas.auth import UserInfo
from app.services.asset_discovery_service import asset_discovery_service
from app.services.attack_path_engine import AttackPathEngine
from app.services.scanner_orchestrator_service import scanner_orchestrator
from app.services.compliance_engine import ComplianceEngine
from app.services.incident_investigation_service import IncidentInvestigationService
from app.services.remediation_planner_service import RemediationPlannerService
from app.services.security_posture_engine import SecurityPostureEngine
from app.services.vulnerability_intelligence_service import VulnerabilityIntelligenceService
from app.services.observability_service import observability_service
from app.services.runtime_threat_service import runtime_threat_service, FalcoWebhookPayload
from app.services.security_graph_service import security_graph_engine
from app.services.ai_investigation_engine import ai_investigation_engine
from app.services.remediation_engine import remediation_engine
from app.services.devsecops_pipeline_service import devsecops_pipeline_service
from app.services.repository_security_scanner import (
    repository_scanner,
    RepositoryScanResult,
)
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.repo_intel.repository import RepoIntelRepository, RepoIntelAnalysis

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


class AuditTriggerRequest(BaseModel):
    cluster_id: str = "default"


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
    refresh: bool = Query(False, description="Force a fresh audit bypassing cache"),
    current_user: Optional[Any] = Depends(get_current_user_optional),
):
    """Returns explainable security posture audit and score."""
    try:
        return await posture_engine.audit_cluster(cluster_id, force=refresh)
    except Exception as e:
        logger.error(f"Failed to audit cluster security: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/posture/audit")
async def trigger_security_audit(
    payload: AuditTriggerRequest = AuditTriggerRequest(),
    current_user: Optional[Any] = Depends(get_current_user_optional),
):
    """Triggers an immediate, cache-bypassing security posture audit and broadcasts the result."""
    try:
        result = await posture_engine.audit_cluster(payload.cluster_id, force=True)
        # Broadcast event via WebSocket manager if available
        try:
            from app.core.websocket_manager import ws_manager
            await ws_manager.broadcast_event(
                event_type="posture_update",
                data={
                    "cluster_id": payload.cluster_id,
                    "audit_run_id": result.get("audit_run_id"),
                    "audit_status": result.get("audit_status"),
                    "security_score": result.get("security_score"),
                    "total_findings": (result.get("security_score") or {}).get("total_findings"),
                    "audit_triggered_by": getattr(current_user, "username", "anonymous") if current_user else "anonymous",
                },
                cluster_id=payload.cluster_id,
            )
        except Exception as ws_err:
            logger.warning(f"WebSocket broadcast skipped: {ws_err}")
        return result
    except Exception as e:
        logger.error(f"Security audit trigger failed: {e}")
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
    """Generates a remediation manifest and diff with explicit dry-run status."""
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


# ==============================================================
# Module 1: Infrastructure & Asset Discovery Endpoints
# ==============================================================

@router.get("/assets/inventory")
async def get_asset_inventory(
    cluster_id: str = Query("default", description="Cluster ID"),
    current_user: UserInfo = Depends(get_current_user),
):
    """Returns cluster infrastructure hierarchy with explicit provenance metadata."""
    try:
        return await asset_discovery_service.get_infrastructure_inventory(cluster_id)
    except Exception as e:
        logger.error(f"Asset discovery failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ==============================================================
# Module 2: Scanner Health & SBOM Management Endpoints
# ==============================================================

@router.get("/scanners/health")
async def get_scanners_health(
    current_user: UserInfo = Depends(get_current_user),
):
    """Reports status of Trivy, Prowler, Kyverno, and Cosign security integrations."""
    return scanner_orchestrator.get_scanner_health()


@router.get("/sbom/packages")
async def get_sbom_packages(
    image: str = Query("nginx:latest", description="Target container image"),
    current_user: UserInfo = Depends(get_current_user),
):
    """Returns Software Bill of Materials (SBOM) for an image with provenance tracking."""
    return await scanner_orchestrator.get_sbom_packages(image)


# ==============================================================
# Module 3: Cloud-Native Monitoring & Observability Endpoints
# ==============================================================

@router.get("/monitoring/status")
async def get_monitoring_status(
    current_user: UserInfo = Depends(get_current_user),
):
    """Reports connectivity and operational health for Prometheus, Loki, Grafana, and OTel."""
    return await observability_service.get_observability_status()


from app.services.realtime_k8s_service import realtime_k8s_service, RealTimeClusterMonitoring

@router.get("/monitoring/realtime", response_model=RealTimeClusterMonitoring)
async def get_realtime_cluster_monitoring(
    current_user: Optional[Any] = Depends(get_current_user_optional),
):
    """Retrieves live Kubernetes cluster health, nodes, pod failure states, warnings, and native Metrics Server utilization."""
    return await realtime_k8s_service.get_realtime_metrics()


@router.get("/monitoring/metrics")
async def get_cluster_metrics(
    cluster_id: str = Query("default", description="Cluster ID"),
    current_user: UserInfo = Depends(get_current_user),
):
    """Fetches cluster CPU, memory, and workload utilization trends with explicit provenance."""
    return await observability_service.get_cluster_resource_metrics(cluster_id)


@router.get("/monitoring/logs")
async def query_loki_logs(
    query: str = Query('{app="payment-api"}', description="LogQL query"),
    limit: int = Query(50, ge=1, le=200, description="Maximum log records to return"),
    namespace: Optional[str] = Query(None, description="Namespace filter"),
    current_user: UserInfo = Depends(get_current_user),
):
    """Queries log aggregation pipeline with LogQL parameters, safety limits, and provenance."""
    return await observability_service.query_loki_logs(query=query, limit=limit, namespace=namespace)


# ==============================================================
# Module 4: Runtime Threat Detection (Falco / Falcosidekick)
# ==============================================================

@router.post("/runtime/falco/webhook")
async def receive_falco_webhook(
    request: Request,
    timestamp: Optional[str] = Header(None, alias="X-CloudGuard-Timestamp"),
    nonce: Optional[str] = Header(None, alias="X-CloudGuard-Nonce"),
    signature: Optional[str] = Header(None, alias="X-CloudGuard-Signature"),
):
    """Accept a timestamped HMAC-signed event from the configured Falco HTTP sender."""
    body_buffer = bytearray()
    async for chunk in request.stream():
        body_buffer.extend(chunk)
        if len(body_buffer) > MAX_BODY_BYTES:
            raise HTTPException(status_code=413, detail="Falco webhook payload exceeds the 1 MiB limit")
    body = bytes(body_buffer)
    try:
        await verify_falco_request(
            secret=settings.FALCO_WEBHOOK_SECRET,
            timestamp=timestamp or "",
            nonce=nonce or "",
            signature=signature or "",
            body=body,
        )
    except FalcoWebhookAuthError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail)
    try:
        payload = FalcoWebhookPayload.model_validate_json(body)
        return await runtime_threat_service.ingest_falco_event(payload)
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=f"Invalid Falco webhook payload: {e}")
    except Exception as e:
        logger.error(f"Failed to ingest Falco webhook: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid webhook payload: {e}")


@router.get("/runtime/events")
async def list_runtime_events(
    severity: Optional[str] = Query("ALL", description="Filter by severity (CRITICAL, HIGH, etc.)"),
    namespace: Optional[str] = Query(None, description="Filter by Kubernetes namespace"),
    search: Optional[str] = Query(None, description="Search keyword in rule, message, or pod"),
    limit: int = Query(50, ge=1, le=100, description="Max events to return"),
    current_user: UserInfo = Depends(get_current_user),
):
    """Lists runtime threat events with provenance tracking and summary statistics."""
    return runtime_threat_service.list_threat_events(
        severity=severity,
        namespace=namespace,
        search=search,
        limit=limit
    )


# ==============================================================
# Module 5: Security Intelligence & Attack Path Graph Endpoints
# ==============================================================

@router.get("/graph/data")
async def get_security_graph_data(
    entity_type: Optional[str] = Query("ALL", description="Filter nodes by entity type"),
    search: Optional[str] = Query(None, description="Search nodes by keyword"),
    limit: int = Query(100, ge=1, le=500, description="Max nodes to return"),
    current_user: UserInfo = Depends(get_current_user),
):
    """Returns connected security graph nodes and evidence-backed edges with provenance."""
    return security_graph_engine.get_graph_data(
        entity_type=entity_type,
        search=search,
        limit=limit
    )


@router.get("/graph/asset-context")
async def get_asset_security_context(
    asset_id: str = Query(..., description="Target asset ID or name"),
    current_user: UserInfo = Depends(get_current_user),
):
    """Returns 360-degree security intelligence context for an asset node."""
    res = security_graph_engine.get_asset_security_context(asset_id)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res


@router.get("/graph/attack-paths")
async def get_graph_attack_paths(
    max_depth: int = Query(5, ge=2, le=10, description="Maximum traversal hop depth"),
    limit: int = Query(10, ge=1, le=50, description="Max attack paths to return"),
    current_user: UserInfo = Depends(get_current_user),
):
    """Computes bounded, cycle-protected multi-hop attack paths from public entry points."""
    return security_graph_engine.compute_attack_paths(max_depth=max_depth, limit=limit)


# ==============================================================
# Module 6: AI-Assisted Incident Investigation Endpoints
# ==============================================================

class NewInvestigationRequest(BaseModel):
    target_type: str  # incident, finding, threat, vulnerability, attack_path, asset
    target_id: str
    user_notes: Optional[str] = None


@router.get("/investigations")
async def list_ai_investigations(
    current_user: UserInfo = Depends(get_current_user),
):
    """Lists all AI-assisted investigation dossiers and reports."""
    return ai_investigation_engine.list_investigations()


@router.get("/investigations/{investigation_id}")
async def get_ai_investigation(
    investigation_id: str,
    current_user: UserInfo = Depends(get_current_user),
):
    """Retrieves full investigation dossier including evidence bundle and AI findings."""
    inv = ai_investigation_engine.get_investigation(investigation_id)
    if not inv:
        raise HTTPException(status_code=404, detail=f"Investigation '{investigation_id}' not found.")
    return inv


@router.post("/investigations/analyze")
async def execute_ai_investigation(
    payload: NewInvestigationRequest,
    current_user: UserInfo = Depends(get_current_user),
):
    """Builds an evidence bundle and runs an analyst-only structured AI investigation."""
    try:
        return await ai_investigation_engine.execute_investigation(
            target_type=payload.target_type,
            target_id=payload.target_id,
            user_notes=payload.user_notes
        )
    except Exception as e:
        logger.error(f"Investigation execution failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ==============================================================
# Module 7: Intelligent Remediation & Controlled Automation
# ==============================================================

class CreateRemediationRequest(BaseModel):
    source_type: str
    source_id: str
    title: str
    target_resource: str
    namespace: str
    category: str
    current_yaml: str
    proposed_yaml: str
    is_sensitive: bool = False
    cluster_id: Optional[str] = None


class PlanApprovalRequest(BaseModel):
    comment: Optional[str] = "Approved after operational review"


class PlanRejectionRequest(BaseModel):
    reason: str


@router.get("/remediations/lifecycle-plans")
async def list_remediation_lifecycle_plans(
    status: Optional[str] = Query("ALL", description="Filter by lifecycle status"),
    current_user: UserInfo = Depends(get_current_user),
):
    """Lists remediation plans across all workflow states."""
    return remediation_engine.list_plans(status=status)


@router.get("/remediations/lifecycle-plans/{remediation_id}")
async def get_remediation_lifecycle_plan(
    remediation_id: str,
    current_user: UserInfo = Depends(get_current_user),
):
    """Retrieves full remediation plan details including diff, dry-run, and audit trail."""
    plan = remediation_engine.get_plan(remediation_id)
    if not plan:
        raise HTTPException(status_code=404, detail=f"Remediation plan '{remediation_id}' not found.")
    return plan


@router.post("/remediations/lifecycle-plans")
async def create_remediation_lifecycle_plan(
    payload: CreateRemediationRequest,
    current_user: UserInfo = Depends(get_current_user),
):
    """Creates a remediation plan with an attempted dry-run and explicit validation result."""
    try:
        return await remediation_engine.create_plan(
            source_type=payload.source_type,
            source_id=payload.source_id,
            title=payload.title,
            target_resource=payload.target_resource,
            namespace=payload.namespace,
            category=payload.category,
            current_yaml=payload.current_yaml,
            proposed_yaml=payload.proposed_yaml,
            created_by=current_user.email or current_user.username,
            is_sensitive=payload.is_sensitive,
            cluster_id=payload.cluster_id
        )
    except Exception as e:
        logger.error(f"Failed to create remediation plan: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/remediations/lifecycle-plans/{remediation_id}/approve")
async def approve_remediation_plan(
    remediation_id: str,
    payload: PlanApprovalRequest,
    current_user: UserInfo = Depends(get_current_user),
):
    """Approves plan with four-eyes enforcement: Creator cannot self-approve sensitive plans."""
    try:
        return remediation_engine.approve_plan(
            remediation_id=remediation_id,
            approver=current_user.email or current_user.username,
            role=current_user.role or "admin",
            comment=payload.comment or "Approved"
        )
    except PermissionError as pe:
        raise HTTPException(status_code=403, detail=str(pe))
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))


@router.post("/remediations/lifecycle-plans/{remediation_id}/reject")
async def reject_remediation_plan(
    remediation_id: str,
    payload: PlanRejectionRequest,
    current_user: UserInfo = Depends(get_current_user),
):
    """Rejects a pending remediation plan with recorded rationale."""
    try:
        return remediation_engine.reject_plan(
            remediation_id=remediation_id,
            reviewer=current_user.email or current_user.username,
            reason=payload.reason
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))


@router.post("/remediations/lifecycle-plans/{remediation_id}/execute")
async def execute_remediation_plan(
    remediation_id: str,
    current_user: UserInfo = Depends(get_current_user),
):
    """Executes an approved plan within controlled cluster admission boundaries."""
    try:
        return await remediation_engine.execute_plan(
            remediation_id=remediation_id,
            executor=current_user.email or current_user.username
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))


@router.post("/remediations/lifecycle-plans/{remediation_id}/rollback")
async def rollback_remediation_plan(
    remediation_id: str,
    current_user: UserInfo = Depends(get_current_user),
):
    """Reverts an applied remediation to its pre-change configuration snapshot."""
    try:
        return await remediation_engine.rollback_plan(
            remediation_id=remediation_id,
            operator=current_user.email or current_user.username
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))


# ==============================================================
# Module 8: DevSecOps CI/CD Security Pipeline Integration
# ==============================================================

class PipelineTriggerRequest(BaseModel):
    repository: Optional[str] = "cloudguard/microservices-backend"
    branch: Optional[str] = "feature/security-hardening"
    commit_sha: Optional[str] = None


@router.get("/devsecops/pipelines")
async def list_devsecops_pipelines(
    current_user: UserInfo = Depends(get_current_user),
):
    """Lists recent DevSecOps pipeline execution reports and gate decisions."""
    return devsecops_pipeline_service.list_pipelines()


@router.get("/devsecops/pipelines/{pipeline_id}")
async def get_devsecops_pipeline(
    pipeline_id: str,
    current_user: UserInfo = Depends(get_current_user),
):
    """Retrieves full pipeline stage timeline, tool outputs, and findings."""
    pipe = devsecops_pipeline_service.get_pipeline(pipeline_id)
    if not pipe:
        raise HTTPException(status_code=404, detail=f"Pipeline '{pipeline_id}' not found.")
    return pipe


@router.post("/devsecops/pipelines/trigger")
async def trigger_devsecops_pipeline(
    payload: PipelineTriggerRequest,
    current_user: UserInfo = Depends(get_current_user),
):
    """Triggers end-to-end DevSecOps pipeline check across Gitleaks, Trivy, Kyverno, and Cosign."""
    try:
        return await devsecops_pipeline_service.execute_pipeline(
            repository=payload.repository or "cloudguard/microservices-backend",
            branch=payload.branch or "main",
            commit_sha=payload.commit_sha
        )
    except Exception as e:
        logger.error(f"DevSecOps pipeline execution failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/devsecops/secrets/scan")
async def run_gitleaks_secret_scan(
    current_user: UserInfo = Depends(get_current_user),
):
    """Executes on-demand Gitleaks secret detection and returns redacted findings."""
    return await devsecops_pipeline_service.run_gitleaks_scan()


@router.get("/devsecops/signatures/verify")
async def verify_image_signature_endpoint(
    image: str = Query("cloudguard/payment-api:v2.1.0", description="Container image reference"),
    expected_signer: Optional[str] = Query("security@cloudguard.io", description="Expected signer identity"),
    current_user: UserInfo = Depends(get_current_user),
):
    """Verifies Cosign digital signature and signer certificate identity."""
    return await devsecops_pipeline_service.verify_image_signature(
        image_ref=image,
        expected_signer=expected_signer
    )


class RepositoryScanRequest(BaseModel):
    url: str


@router.post("/repository/scan", response_model=RepositoryScanResult)
async def scan_github_repository(
    request: RepositoryScanRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[Any] = Depends(get_current_user_optional),
):
    """Scans a public GitHub repository for DevSecOps and container security risks."""
    try:
        result = await repository_scanner.scan_repository(request.url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Repository scanning error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to scan repository: {str(e)}")

    # Safely persist scan history into RepoIntel models
    try:
        user_id = getattr(current_user, "id", None) if current_user else None
        if not user_id:
            from app.models.user import User
            admin_user_stmt = select(User.id).where(User.username == "admin").limit(1)
            admin_res = await db.execute(admin_user_stmt)
            user_id = admin_res.scalar_one_or_none() or "0e35f0f6-f453-473e-a3b9-3f03d6de77e7"

        owner = result.owner
        repo = result.repo

        # Check existing repo
        stmt = select(RepoIntelRepository).where(
            RepoIntelRepository.github_owner == owner,
            RepoIntelRepository.repo_name == repo,
            RepoIntelRepository.user_id == user_id
        )
        res = await db.execute(stmt)
        repo_record = res.scalars().first()

        if not repo_record:
            repo_record = RepoIntelRepository(
                user_id=user_id,
                github_owner=owner,
                repo_name=repo,
                github_url=result.repository_url,
                default_branch=result.default_branch,
            )
            db.add(repo_record)
            await db.flush()

        analysis_record = RepoIntelAnalysis(
            repository_id=repo_record.id,
            branch=result.default_branch,
            commit_sha=result.latest_commit_sha,
            status=result.scan_status,
            result=result.model_dump(),
        )
        db.add(analysis_record)
        await db.commit()
    except Exception as exc:
        logger.warning(f"Could not persist repository scan record: {exc}")
        await db.rollback()

    return result


@router.get("/repository/history")
async def get_repository_scan_history(
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[Any] = Depends(get_current_user_optional),
):
    """Retrieves recent repository scan analyses."""
    try:
        stmt = (
            select(RepoIntelAnalysis, RepoIntelRepository)
            .join(RepoIntelRepository, RepoIntelAnalysis.repository_id == RepoIntelRepository.id)
            .order_by(desc(RepoIntelAnalysis.created_at))
            .limit(limit)
        )
        res = await db.execute(stmt)
        rows = res.all()

        history = []
        for analysis, repo in rows:
            res_json = analysis.result or {}
            history.append({
                "analysis_id": analysis.id,
                "repository_url": repo.github_url,
                "owner": repo.github_owner,
                "repo": repo.repo_name,
                "branch": analysis.branch,
                "commit_sha": analysis.commit_sha,
                "status": analysis.status,
                "created_at": analysis.created_at.isoformat() if analysis.created_at else None,
                "critical_count": res_json.get("critical_count", 0),
                "high_count": res_json.get("high_count", 0),
                "medium_count": res_json.get("medium_count", 0),
                "low_count": res_json.get("low_count", 0),
                "total_findings": res_json.get("total_findings", 0),
            })
        return history
    except Exception as e:
        logger.error(f"Error fetching repository scan history: {e}")
        return []









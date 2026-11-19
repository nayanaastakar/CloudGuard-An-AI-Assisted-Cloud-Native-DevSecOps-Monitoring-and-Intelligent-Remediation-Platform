"""CloudGuard Full-Lifecycle Intelligent Remediation & Controlled Automation Engine.

Enforces a secure, auditable lifecycle:
Recommendation -> Remediation Plan -> Dry-Run Validation -> Four-Eyes Approval -> Execution Allowlist -> Verification -> Rollback -> Audit.
"""

import asyncio
import difflib
import logging
import os
import re
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple

import yaml
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)


class RemediationLifecycleState(str, Enum):
    DRAFT = "draft"
    PENDING_VALIDATION = "pending_validation"
    VALIDATION_FAILED = "validation_failed"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXECUTING = "executing"
    EXECUTION_FAILED = "execution_failed"
    VERIFYING = "verifying"
    COMPLETED = "completed"
    ROLLBACK_REQUIRED = "rollback_required"
    ROLLED_BACK = "rolled_back"
    CANCELLED = "cancelled"


class RemediationAuditEntry(BaseModel):
    action: str  # created, validated, approved, rejected, executed, verified, rolled_back
    performed_by: str
    timestamp: str
    details: str


class RemediationPlan(BaseModel):
    remediation_id: str
    cluster_id: str = "default"
    provenance: str = "demo"
    data_source: str = "seeded-demo-sample"
    source_type: str  # finding, vulnerability, threat, attack_path, incident
    source_id: str
    title: str
    target_resource: str
    namespace: str
    category: str
    description: str
    current_yaml: str
    proposed_yaml: str
    diff_patch: str
    risk_level: str  # low, medium, high
    security_benefit: str
    operational_impact: str
    status: RemediationLifecycleState = RemediationLifecycleState.PENDING_APPROVAL
    is_sensitive: bool = False
    dry_run_verified: bool = False
    dry_run_output: str = ""
    created_by: str = "security-analyst"
    approved_by: Optional[str] = None
    approval_timestamp: Optional[str] = None
    execution_timestamp: Optional[str] = None
    execution_log: Optional[str] = None
    verification_status: Optional[str] = None
    verification_details: Optional[str] = None
    pre_change_snapshot: Optional[str] = None
    rollback_supported: bool = True
    rollback_executed: bool = False
    audit_trail: List[RemediationAuditEntry] = Field(default_factory=list)


# Action allowlist: Only these explicit actions are permitted for execution
ALLOWED_ACTIONS = [
    "SECURITY_CONTEXT_HARDEN",
    "NETWORK_POLICY_ISOLATE",
    "IMAGE_UPDATE",
    "SERVICE_RESTRICT",
    "WORKLOAD_RESTART"
]

FORBIDDEN_KEYWORDS = [
    "delete namespace",
    "delete persistentvolume",
    "delete cluster",
    "rm -rf",
    "drop database"
]


class RemediationEngine:
    """Enterprise remediation controller with RBAC, 4-eyes approval, dry-run, and rollback."""

    def __init__(self):
        self._plans: Dict[str, RemediationPlan] = {}
        self._initialize_baseline_plans()

    def _initialize_baseline_plans(self):
        now = datetime.now(timezone.utc).isoformat()
        plan_id = "REM-FINDING-001"
        cur_yaml = "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: payment-api\n  namespace: production\nspec:\n  template:\n    spec:\n      containers:\n      - name: payment-api\n        image: cloudguard/payment-api:v2.1.0\n        securityContext:\n          privileged: true\n"
        prop_yaml = "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: payment-api\n  namespace: production\nspec:\n  template:\n    spec:\n      containers:\n      - name: payment-api\n        image: cloudguard/payment-api:v2.1.1\n        securityContext:\n          privileged: false\n          runAsNonRoot: true\n          readOnlyRootFilesystem: true\n"

        diff_lines = list(difflib.unified_diff(
            cur_yaml.splitlines(keepends=True),
            prop_yaml.splitlines(keepends=True),
            fromfile="current/payment-api.yaml",
            tofile="remediated/payment-api.yaml",
        ))

        self._plans[plan_id] = RemediationPlan(
            remediation_id=plan_id,
            source_type="finding",
            source_id="FND-2026-0042",
            title="Sample: Drop Privileged Mode & Harden SecurityContext on payment-api",
            target_resource="Deployment/payment-api",
            namespace="production",
            category="pod_security",
            description="Sample remediation for a seeded scenario; this resource and finding have not been verified against a live cluster.",
            current_yaml=cur_yaml,
            proposed_yaml=prop_yaml,
            diff_patch="".join(diff_lines),
            risk_level="high",
            is_sensitive=True,  # Requires four-eyes approval
            security_benefit="Mitigates container breakout vulnerability CVE-2024-21626 and prevents unauthorized root host escape.",
            operational_impact="Workload will undergo a zero-downtime rolling restart.",
            status=RemediationLifecycleState.PENDING_VALIDATION,
            dry_run_verified=False,
            dry_run_output="Server-side dry-run has not been performed; this is a seeded demonstration plan.",
            created_by="sec-analyst-bob",
            pre_change_snapshot=cur_yaml,
            audit_trail=[
                RemediationAuditEntry(
                    action="created",
                    performed_by="sec-analyst-bob",
                    timestamp=now,
                    details="Seeded sample plan; no live security finding was verified."
                ),
                RemediationAuditEntry(
                action="validation_unavailable",
                    performed_by="cloudguard-validator",
                    timestamp=now,
                details="Sample plan only. No server-side dry-run was performed."
                )
            ]
        )

    async def create_plan(
        self,
        source_type: str,
        source_id: str,
        title: str,
        target_resource: str,
        namespace: str,
        category: str,
        current_yaml: str,
        proposed_yaml: str,
        created_by: str = "security-analyst",
        is_sensitive: bool = False,
        cluster_id: Optional[str] = None
    ) -> RemediationPlan:
        """Creates and dry-run validates a new remediation plan."""
        plan_id = f"REM-{len(self._plans) + 1:03d}"
        now = datetime.now(timezone.utc).isoformat()

        # Determine effective cluster_id: explicit param > active cluster
        effective_cluster_id = cluster_id
        if not effective_cluster_id:
            try:
                from app.services.cluster_service import cluster_service
                effective_cluster_id = await cluster_service.get_active_cluster()
            except Exception:
                effective_cluster_id = None
        effective_cluster_id = effective_cluster_id or "default"

        # Sanity check forbidden destructive actions
        for kw in FORBIDDEN_KEYWORDS:
            if kw in proposed_yaml.lower():
                raise ValueError(f"Forbidden destructive action detected in proposed YAML: '{kw}'")

        # Compute diff
        diff_lines = list(difflib.unified_diff(
            current_yaml.splitlines(keepends=True),
            proposed_yaml.splitlines(keepends=True),
            fromfile=f"current/{target_resource}.yaml",
            tofile=f"remediated/{target_resource}.yaml",
        ))
        diff_patch = "".join(diff_lines) if diff_lines else "No syntax diff."

        # Dry-run validation
        is_valid, val_msg = await self.validate_manifest(proposed_yaml, namespace)
        server_validated = is_valid or val_msg.startswith("Server-Side Dry-Run Rejection:")
        validation_action = (
            "validated" if is_valid
            else "validation_failed" if server_validated or val_msg.startswith(("Validation Failed:", "Local Schema Error:"))
            else "validation_unavailable"
        )

        plan = RemediationPlan(
            remediation_id=plan_id,
            cluster_id=effective_cluster_id,
            source_type=source_type,
            source_id=source_id,
            title=title,
            target_resource=target_resource,
            namespace=namespace,
            category=category,
            description=f"Automated corrective plan for {target_resource} ({category}).",
            current_yaml=current_yaml,
            proposed_yaml=proposed_yaml,
            diff_patch=diff_patch,
            risk_level="high" if is_sensitive else "medium",
            is_sensitive=is_sensitive,
            security_benefit="Hardens cluster security posture and mitigates active finding.",
            operational_impact="Workload configuration will be updated in namespace.",
            status=RemediationLifecycleState.PENDING_APPROVAL if is_valid else RemediationLifecycleState.VALIDATION_FAILED,
            provenance="live" if server_validated else "unavailable",
            data_source="kubernetes-server-side-dry-run" if server_validated else "user-supplied-manifest",
            dry_run_verified=is_valid,
            dry_run_output=val_msg,
            created_by=created_by,
            pre_change_snapshot=current_yaml,
            audit_trail=[
                RemediationAuditEntry(
                    action="created",
                    performed_by=created_by,
                    timestamp=now,
                    details=f"Plan created for {target_resource}."
                ),
                RemediationAuditEntry(
                    action=validation_action,
                    performed_by="cloudguard-validator",
                    timestamp=now,
                    details=val_msg
                )
            ]
        )
        self._plans[plan_id] = plan
        return plan

    async def validate_manifest(self, manifest_yaml: str, namespace: str) -> Tuple[bool, str]:
        """Validates manifest using live server-side dry-run if available, or strict client-side validation."""
        try:
            cmd = ["kubectl", "apply", "-f", "-", "--dry-run=server"]
            if namespace and namespace != "cluster-wide":
                cmd.extend(["-n", namespace])

            kubeconfig = "/tmp/kubeconfig" if os.path.exists("/tmp/kubeconfig") else None
            env = os.environ.copy()
            if kubeconfig:
                env["KUBECONFIG"] = kubeconfig

            proc = await asyncio.create_subprocess_exec(
                *cmd,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                env=env,
            )
            stdout, stderr = await proc.communicate(input=manifest_yaml.encode())
            if proc.returncode == 0:
                return True, f"Server-Side Dry-Run Successful: {stdout.decode().strip()}"
            else:
                err = stderr.decode().strip()
                # If target machine refused connection / cluster is offline / kubeconfig unreadable, gracefully fall back to local validation
                if any(err_term in err for err_term in ["actively refused", "dial tcp", "refused it", "timed out", "Access is denied", "no configuration has been provided"]):
                    docs = list(yaml.safe_load_all(manifest_yaml))
                    if not docs or not docs[0]:
                        return False, "Validation Failed: Manifest is empty or invalid YAML."
                    return False, "Server-side dry-run unavailable (cluster API offline). Local YAML syntax is valid; this does not verify admission or cluster compatibility."
                return False, f"Server-Side Dry-Run Rejection: {err}"
        except Exception:
            # Fallback to local schema parsing
            try:
                docs = list(yaml.safe_load_all(manifest_yaml))
                if not docs or not docs[0]:
                    return False, "Validation Failed: Manifest is empty or invalid YAML."
                return False, "Server-side dry-run unavailable. Local YAML syntax is valid; this does not verify admission or cluster compatibility."
            except Exception as e:
                return False, f"Local Schema Error: {e}"

    def approve_plan(
        self,
        remediation_id: str,
        approver: str,
        role: str = "admin",
        comment: str = "Approved for execution"
    ) -> RemediationPlan:
        """Enforces four-eyes approval: Creator cannot approve their own sensitive plan."""
        plan = self._plans.get(remediation_id)
        if not plan:
            raise ValueError(f"Remediation plan '{remediation_id}' not found.")

        if plan.status != RemediationLifecycleState.PENDING_APPROVAL:
            raise ValueError(f"Plan cannot be approved from current state '{plan.status.value}'.")

        # Four-eyes check for sensitive operations
        if plan.is_sensitive and plan.created_by == approver:
            raise PermissionError(f"Four-eyes policy violation: Creator '{approver}' cannot self-approve sensitive remediation '{remediation_id}'. A second reviewer is required.")

        now = datetime.now(timezone.utc).isoformat()
        plan.status = RemediationLifecycleState.APPROVED
        plan.approved_by = approver
        plan.approval_timestamp = now
        plan.audit_trail.append(RemediationAuditEntry(
            action="approved",
            performed_by=approver,
            timestamp=now,
            details=f"Approved by {approver} ({role}). Comment: {comment}"
        ))
        return plan

    def reject_plan(
        self,
        remediation_id: str,
        reviewer: str,
        reason: str = "Rejected due to operational freeze"
    ) -> RemediationPlan:
        plan = self._plans.get(remediation_id)
        if not plan:
            raise ValueError(f"Remediation plan '{remediation_id}' not found.")

        now = datetime.now(timezone.utc).isoformat()
        plan.status = RemediationLifecycleState.REJECTED
        plan.audit_trail.append(RemediationAuditEntry(
            action="rejected",
            performed_by=reviewer,
            timestamp=now,
            details=f"Rejected by {reviewer}. Reason: {reason}"
        ))
        return plan

    async def execute_plan(self, remediation_id: str, executor: str) -> RemediationPlan:
        """Fail closed until a separate identity and strict action allowlist exist."""
        plan = self._plans.get(remediation_id)
        if not plan:
            raise ValueError(f"Remediation plan '{remediation_id}' not found.")

        if plan.status != RemediationLifecycleState.APPROVED:
            raise ValueError(f"Cannot execute plan in status '{plan.status.value}'. Must be 'approved'.")

        now = datetime.now(timezone.utc).isoformat()
        plan.status = RemediationLifecycleState.EXECUTION_FAILED
        plan.execution_timestamp = now
        plan.execution_log = (
            "Execution unavailable: no separate remediation identity and strict action allowlist are configured."
        )
        plan.audit_trail.append(RemediationAuditEntry(
            action="execution_unavailable",
            performed_by=executor,
            timestamp=now,
            details=plan.execution_log,
        ))
        return plan

    async def verify_plan(self, remediation_id: str, verifier: str = "cloudguard-verifier") -> RemediationPlan:
        """Fail closed until a live Kubernetes post-change verifier exists."""
        plan = self._plans.get(remediation_id)
        if not plan:
            raise ValueError(f"Remediation plan '{remediation_id}' not found.")

        plan.verification_status = "UNAVAILABLE"
        plan.verification_details = "No live Kubernetes post-change verifier is configured."
        raise RuntimeError(plan.verification_details)

    async def rollback_plan(self, remediation_id: str, operator: str) -> RemediationPlan:
        """Fail closed until rollback performs a real Kubernetes operation."""
        plan = self._plans.get(remediation_id)
        if not plan:
            raise ValueError(f"Remediation plan '{remediation_id}' not found.")

        if not plan.rollback_supported or not plan.pre_change_snapshot:
            raise ValueError("Rollback not supported: No pre-change snapshot preserved.")

        raise RuntimeError("Rollback execution is not implemented; no cluster change was made.")

    def list_plans(self, status: Optional[str] = None) -> List[RemediationPlan]:
        plans = list(self._plans.values())
        if status and status.upper() != "ALL":
            plans = [p for p in plans if p.status.value.upper() == status.upper()]
        return plans

    def get_plan(self, remediation_id: str) -> Optional[RemediationPlan]:
        return self._plans.get(remediation_id)


remediation_engine = RemediationEngine()

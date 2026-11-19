"""Unit & Integration tests for CloudGuard Module 7: Intelligent Remediation & Controlled Automation."""

import pytest
from unittest.mock import AsyncMock
from app.services.remediation_engine import (
    remediation_engine,
    RemediationLifecycleState,
    RemediationPlan,
)


@pytest.mark.asyncio
class TestRemediationEngine:
    async def test_baseline_plan_structure(self):
        plans = remediation_engine.list_plans()
        assert len(plans) >= 1
        plan = plans[0]
        assert plan.remediation_id.startswith("REM-")
        assert plan.status == RemediationLifecycleState.PENDING_VALIDATION
        assert plan.dry_run_verified is False
        assert plan.provenance == "demo"
        assert plan.data_source == "seeded-demo-sample"
        assert "not been performed" in plan.dry_run_output
        assert all(entry.action != "validated" for entry in plan.audit_trail)
        assert len(plan.diff_patch) > 0
        assert len(plan.audit_trail) >= 2

    async def test_create_plan_and_dry_run_validation(self):
        cur_yaml = "apiVersion: v1\nkind: Service\nmetadata:\n  name: payment-svc\n  namespace: default\nspec:\n  type: NodePort\n  ports:\n  - port: 80\n    targetPort: 8080\n"
        prop_yaml = "apiVersion: v1\nkind: Service\nmetadata:\n  name: payment-svc\n  namespace: default\nspec:\n  type: ClusterIP\n  ports:\n  - port: 80\n    targetPort: 8080\n"

        plan = await remediation_engine.create_plan(
            source_type="finding",
            source_id="FND-999",
            title="Restrict Public Service to ClusterIP",
            target_resource="Service/payment-svc",
            namespace="default",
            category="network_exposure",
            current_yaml=cur_yaml,
            proposed_yaml=prop_yaml,
            created_by="devops-alice",
            is_sensitive=True
        )

        assert plan.remediation_id.startswith("REM-")
        assert plan.dry_run_verified is False
        assert "ClusterIP" in plan.proposed_yaml
        assert plan.status == RemediationLifecycleState.VALIDATION_FAILED

    async def test_four_eyes_self_approval_prevention(self, monkeypatch):
        monkeypatch.setattr(remediation_engine, "validate_manifest", AsyncMock(return_value=(True, "Mock server-side dry-run succeeded")))
        # A creator of a sensitive remediation cannot self-approve
        cur_yaml = "apiVersion: v1\nkind: Service\nmetadata:\n  name: test-svc\n  namespace: default\nspec:\n  type: NodePort\n  ports:\n  - port: 80\n"
        prop_yaml = "apiVersion: v1\nkind: Service\nmetadata:\n  name: test-svc\n  namespace: default\nspec:\n  type: ClusterIP\n  ports:\n  - port: 80\n"
        plan = await remediation_engine.create_plan(
            source_type="finding",
            source_id="FND-100",
            title="Sensitive Root Remediation",
            target_resource="Service/test-svc",
            namespace="default",
            category="pod_security",
            current_yaml=cur_yaml,
            proposed_yaml=prop_yaml,
            created_by="creator-user@cloudguard.io",
            is_sensitive=True
        )

        with pytest.raises(PermissionError) as exc_info:
            remediation_engine.approve_plan(
                remediation_id=plan.remediation_id,
                approver="creator-user@cloudguard.io",
                role="admin"
            )
        assert "Four-eyes policy violation" in str(exc_info.value)

    async def test_approved_execution_is_unavailable_without_separate_executor(self, monkeypatch):
        monkeypatch.setattr(remediation_engine, "validate_manifest", AsyncMock(return_value=(True, "Mock server-side dry-run succeeded")))
        cur_yaml = "apiVersion: v1\nkind: Service\nmetadata:\n  name: test-svc-2\n  namespace: default\nspec:\n  type: NodePort\n  ports:\n  - port: 80\n"
        prop_yaml = "apiVersion: v1\nkind: Service\nmetadata:\n  name: test-svc-2\n  namespace: default\nspec:\n  type: ClusterIP\n  ports:\n  - port: 80\n"
        plan = await remediation_engine.create_plan(
            source_type="finding",
            source_id="FND-101",
            title="Safe Non-Root Remediation",
            target_resource="Service/test-svc-2",
            namespace="default",
            category="pod_security",
            current_yaml=cur_yaml,
            proposed_yaml=prop_yaml,
            created_by="creator-user@cloudguard.io",
            is_sensitive=True
        )

        # Second reviewer approves
        approved_plan = remediation_engine.approve_plan(
            remediation_id=plan.remediation_id,
            approver="independent-reviewer@cloudguard.io",
            role="security-officer"
        )
        assert approved_plan.status == RemediationLifecycleState.APPROVED
        assert approved_plan.approved_by == "independent-reviewer@cloudguard.io"

        async def forbidden_kubectl(*args, **kwargs):
            pytest.fail("Generic remediation must not invoke kubectl")

        monkeypatch.setattr("app.services.remediation_engine.asyncio.create_subprocess_exec", forbidden_kubectl)
        executed_plan = await remediation_engine.execute_plan(
            remediation_id=plan.remediation_id,
            executor="devops-engineer"
        )
        assert executed_plan.status == RemediationLifecycleState.EXECUTION_FAILED
        assert "separate remediation identity" in executed_plan.execution_log

    async def test_rollback_does_not_claim_success_without_cluster_operation(self):
        plans = remediation_engine.list_plans()
        plan = plans[0]
        original_status = plan.status
        with pytest.raises(RuntimeError, match="no cluster change was made"):
            await remediation_engine.rollback_plan(plan.remediation_id, operator="admin")
        assert plan.status == original_status
        assert plan.rollback_executed is False

    async def test_forbidden_destructive_action_rejected(self):
        cur_yaml = "apiVersion: v1\nkind: Pod\nmetadata:\n  name: pod\n"
        bad_yaml = "apiVersion: v1\nkind: Pod\nmetadata:\n  name: pod\n# delete namespace kube-system\n"

        with pytest.raises(ValueError) as exc:
            await remediation_engine.create_plan(
                source_type="finding",
                source_id="FND-BAD",
                title="Bad Action",
                target_resource="Pod/pod",
                namespace="default",
                category="destructive",
                current_yaml=cur_yaml,
                proposed_yaml=bad_yaml,
                created_by="attacker"
            )
        assert "Forbidden destructive action" in str(exc.value)

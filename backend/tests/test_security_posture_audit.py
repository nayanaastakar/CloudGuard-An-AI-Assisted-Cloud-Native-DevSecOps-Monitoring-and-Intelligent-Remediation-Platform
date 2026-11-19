"""Reliability tests for the CloudGuard Kubernetes posture audit."""

from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from kubernetes.client.rest import ApiException

from app.services import security_posture_engine as posture_module


def response(*items):
    return SimpleNamespace(items=list(items))


def api_set(*, pods=None, namespaces=None, network_policies=None, cluster_role_bindings=None,
            cluster_roles=None, roles=None, role_bindings=None):
    core = SimpleNamespace(
        api_client=object(),
        list_pod_for_all_namespaces=pods or (lambda **kwargs: response()),
        list_namespace=namespaces or (lambda **kwargs: response()),
    )
    rbac = SimpleNamespace(
        list_cluster_role_binding=cluster_role_bindings or (lambda **kwargs: response()),
        list_cluster_role=cluster_roles or (lambda **kwargs: response()),
        list_role_for_all_namespaces=roles or (lambda **kwargs: response()),
        list_role_binding_for_all_namespaces=role_bindings or (lambda **kwargs: response()),
    )
    net = SimpleNamespace(
        list_network_policy_for_all_namespaces=network_policies or (lambda **kwargs: response()),
    )
    return core, rbac, net


def install_api_set(monkeypatch, apis):
    core, rbac, net = apis
    monkeypatch.setattr(posture_module, "_get_k8s_client", lambda: core)
    monkeypatch.setattr(posture_module.client, "RbacAuthorizationV1Api", lambda api_client=None: rbac)
    monkeypatch.setattr(posture_module.client, "NetworkingV1Api", lambda api_client=None: net)


@pytest.mark.asyncio
async def test_partial_api_failure_keeps_successful_pod_findings(monkeypatch):
    risky_pod = SimpleNamespace(
        metadata=SimpleNamespace(namespace="app", name="risky"),
        spec=SimpleNamespace(host_pid=False, host_network=False,
                             containers=[SimpleNamespace(name="web", security_context=None)]),
    )

    def forbidden(**kwargs):
        raise ApiException(status=403, reason="Forbidden")

    apis = api_set(pods=lambda **kwargs: response(risky_pod), cluster_role_bindings=forbidden)
    install_api_set(monkeypatch, apis)

    result = await posture_module.SecurityPostureEngine().audit_cluster("partial-cluster", force=True)

    assert result["audit_status"] == "partial"
    assert result["checks"]["pods"]["status"] == "complete"
    assert result["checks"]["rbac"]["status"] == "partial"
    assert "HTTP 403" in result["checks"]["rbac"]["error"]
    assert result["security_score"] is None
    assert result["workloads_audited"] == 1
    assert any(finding["resource_name"] == "risky" for finding in result["findings"])


@pytest.mark.asyncio
async def test_rbac_errors_are_reported_individually(monkeypatch):
    def forbidden(**kwargs):
        raise ApiException(status=403, reason="Forbidden")

    install_api_set(monkeypatch, api_set(cluster_roles=forbidden))
    result = await posture_module.SecurityPostureEngine().audit_cluster("rbac-cluster", force=True)

    assert result["checks"]["cluster_roles"]["status"] == "failed"
    assert "HTTP 403" in result["checks"]["cluster_roles"]["error"]
    assert result["checks"]["rbac"]["status"] == "partial"


@pytest.mark.asyncio
async def test_unavailable_cluster_has_no_score_or_invented_data(monkeypatch):
    monkeypatch.setattr(posture_module, "_get_k8s_client", lambda: (_ for _ in ()).throw(RuntimeError("no kubeconfig")))

    result = await posture_module.SecurityPostureEngine().audit_cluster("offline", force=True)

    assert result["audit_status"] == "unavailable"
    assert result["provenance"]["state"] == "unavailable"
    assert result["security_score"] is None
    assert result["findings"] == []
    assert result["workloads_audited"] is None
    assert "no kubeconfig" in result["error"]


@pytest.mark.asyncio
async def test_live_empty_cluster_is_distinct_from_unavailable(monkeypatch):
    install_api_set(monkeypatch, api_set())

    result = await posture_module.SecurityPostureEngine().audit_cluster("empty-live", force=True)

    assert result["audit_status"] == "complete"
    assert result["provenance"]["state"] == "live"
    assert result["security_score"]["score"] == 100
    assert result["security_score"]["total_findings"] == 0
    assert result["workloads_audited"] == 0


@pytest.mark.asyncio
async def test_live_rbac_audit_inspects_roles_and_role_bindings(monkeypatch):
    wildcard_role = SimpleNamespace(
        metadata=SimpleNamespace(name="wide", namespace="app"),
        rules=[SimpleNamespace(verbs=["*"], resources=["pods"])],
    )
    binding = SimpleNamespace(
        metadata=SimpleNamespace(name="admin-access", namespace="app"),
        role_ref=SimpleNamespace(kind="ClusterRole", name="cluster-admin"),
        subjects=[SimpleNamespace(kind="ServiceAccount", name="default")],
    )
    install_api_set(monkeypatch, api_set(roles=lambda **kwargs: response(wildcard_role), role_bindings=lambda **kwargs: response(binding)))

    result = await posture_module.SecurityPostureEngine().audit_cluster("rbac-live", force=True)

    assert any(f["resource_type"] == "Role" and "wildcard" in f["title"] for f in result["findings"])
    assert any(f["resource_type"] == "RoleBinding" and f["severity"] == "critical" for f in result["findings"])


@pytest.mark.asyncio
async def test_audit_broadcast_includes_cluster_and_run_id(monkeypatch):
    from app.api.routes import cloudguard_routes

    audit = {
        "cluster_id": "cluster-a", "audit_run_id": "run-123", "audit_status": "complete",
        "security_score": {"total_findings": 0},
    }
    monkeypatch.setattr(cloudguard_routes.posture_engine, "audit_cluster", AsyncMock(return_value=audit))
    from app.core import websocket_manager
    broadcast = AsyncMock()
    monkeypatch.setattr(websocket_manager.ws_manager, "broadcast_event", broadcast)

    result = await cloudguard_routes.trigger_security_audit(
        cloudguard_routes.AuditTriggerRequest(cluster_id="cluster-a"),
        SimpleNamespace(username="auditor"),
    )

    assert result == audit
    broadcast.assert_awaited_once()
    kwargs = broadcast.await_args.kwargs
    assert kwargs["cluster_id"] == "cluster-a"
    assert kwargs["event_type"] == "posture_update"
    assert kwargs["data"]["audit_run_id"] == "run-123"


def test_audit_http_endpoint_returns_result_and_emits_posture_event(monkeypatch, test_client):
    from app.api.routes import cloudguard_routes
    from app.core import websocket_manager
    from app.core.security import get_current_user
    from app.main import app

    audit = {
        "cluster_id": "cluster-http", "audit_run_id": "run-http", "audit_status": "partial",
        "provenance": {"state": "live", "source": "kubernetes-security-audit"},
        "security_score": {"score": 92, "total_findings": 1}, "findings": [],
        "workloads_audited": 3, "checks": {"pods": {"status": "complete"}},
    }
    monkeypatch.setattr(cloudguard_routes.posture_engine, "audit_cluster", AsyncMock(return_value=audit))
    broadcast = AsyncMock()
    monkeypatch.setattr(websocket_manager.ws_manager, "broadcast_event", broadcast)
    app.dependency_overrides[get_current_user] = lambda: SimpleNamespace(username="audit-tester")
    try:
        response = test_client.post("/api/v1/cloudguard/posture/audit", json={"cluster_id": "cluster-http"})
    finally:
        app.dependency_overrides.pop(get_current_user, None)

    assert response.status_code == 200
    assert response.json()["audit_run_id"] == "run-http"
    assert response.json()["audit_status"] == "partial"
    broadcast.assert_awaited_once()
    assert broadcast.await_args.kwargs["cluster_id"] == "cluster-http"
    assert broadcast.await_args.kwargs["data"]["audit_run_id"] == "run-http"


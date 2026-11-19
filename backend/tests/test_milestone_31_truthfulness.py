"""Regression tests for truthful CloudGuard status and provenance."""

from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest


@pytest.mark.asyncio
async def test_legacy_posture_route_does_not_score_when_all_kubernetes_checks_fail(monkeypatch):
    from app.api.routes import security
    from app.services import security_posture_engine as posture_module

    monkeypatch.setattr(
        posture_module,
        "_get_k8s_client",
        lambda: (_ for _ in ()).throw(RuntimeError("no test kubeconfig")),
    )

    posture = await security.get_security_posture(
        "legacy-offline",
        SimpleNamespace(username="tester"),
        object(),
    )

    assert posture["audit_status"] == "unavailable"
    assert posture["security_score"] is None
    assert posture["provenance"]["state"] == "unavailable"


@pytest.mark.asyncio
async def test_legacy_security_route_reuses_unavailable_audit(monkeypatch):
    from app.api.routes import security

    expected = {
        "cluster_id": "offline",
        "audit_status": "unavailable",
        "security_score": None,
        "findings": [],
        "checks": {"pods": {"status": "unavailable", "error": "no cluster"}},
        "provenance": {"state": "unavailable", "source": "kubernetes-api"},
    }
    monkeypatch.setattr(security.security_posture_engine, "audit_cluster", AsyncMock(return_value=expected))

    posture = await security.get_security_posture("offline", SimpleNamespace(username="tester"), object())
    dashboard = await security.get_security_dashboard("offline", SimpleNamespace(username="tester"), object())

    assert posture["security_score"] is None
    assert dashboard["security_score"] is None
    assert dashboard["audit_status"] == "unavailable"
    assert dashboard["checks"]["pods"]["error"] == "no cluster"


@pytest.mark.asyncio
async def test_inventory_without_cluster_has_no_synthetic_counts(monkeypatch):
    from app.core.config import settings
    from app.services.asset_discovery_service import AssetDiscoveryService

    monkeypatch.setattr(settings, "DEMO_MODE", False)
    service = AssetDiscoveryService()
    monkeypatch.setattr(service, "_check_k8s_client", lambda: (None, None))

    inventory = await service.get_infrastructure_inventory("offline")

    assert inventory["provenance"]["state"] == "unavailable"
    assert inventory["summary"] == {
        "total_nodes": None, "total_namespaces": None,
        "total_workloads": None, "total_pods": None,
    }
    assert inventory["nodes"] == inventory["namespaces"] == inventory["workloads"] == inventory["pods"] == []


@pytest.mark.asyncio
async def test_inventory_live_request_error_is_not_reported_as_unavailable(monkeypatch):
    from app.core.config import settings
    from app.services.asset_discovery_service import AssetDiscoveryService

    class BrokenCoreApi:
        def list_node(self, **kwargs):
            raise RuntimeError("API request failed")

    monkeypatch.setattr(settings, "DEMO_MODE", False)
    service = AssetDiscoveryService()
    monkeypatch.setattr(service, "_check_k8s_client", lambda: (BrokenCoreApi(), object()))

    inventory = await service.get_infrastructure_inventory("error-cluster")

    assert inventory["status"] == "error"
    assert inventory["provenance"]["state"] == "error"
    assert "API request failed" in inventory["provenance"]["error_message"]


@pytest.mark.asyncio
async def test_inventory_labels_live_and_demo_responses(monkeypatch):
    from app.core.config import settings
    from app.services.asset_discovery_service import AssetDiscoveryService

    empty_response = lambda **kwargs: SimpleNamespace(items=[])
    core = SimpleNamespace(
        list_node=empty_response,
        list_namespace=empty_response,
        list_pod_for_all_namespaces=empty_response,
    )
    apps = SimpleNamespace(list_deployment_for_all_namespaces=empty_response)
    service = AssetDiscoveryService()
    monkeypatch.setattr(settings, "DEMO_MODE", False)
    monkeypatch.setattr(service, "_check_k8s_client", lambda: (core, apps))

    live = await service.get_infrastructure_inventory("live-cluster")
    assert live["status"] == "live"
    assert live["provenance"]["state"] == "live"

    monkeypatch.setattr(settings, "DEMO_MODE", True)
    monkeypatch.setattr(service, "_check_k8s_client", lambda: (None, None))
    demo = await service.get_infrastructure_inventory("demo-cluster")
    assert demo["status"] == "demo"
    assert demo["provenance"]["state"] == "demo"


@pytest.mark.asyncio
async def test_monitoring_without_cluster_services_reports_connection_error(monkeypatch):
    from app.core.config import settings
    from app.services.observability_service import ObservabilityService

    monkeypatch.setattr(settings, "DEMO_MODE", False)
    service = ObservabilityService()
    service.prometheus_url = "http://127.0.0.1:1"
    service.loki_url = "http://127.0.0.1:1"

    metrics = await service.get_cluster_resource_metrics("offline")
    logs = await service.query_loki_logs()

    assert metrics["status"] == "error"
    assert metrics["provenance"]["state"] == "error"
    assert metrics["summary"] is None
    assert metrics["workloads"] == []
    assert logs["status"] == "error"
    assert logs["provenance"]["state"] == "error"
    assert logs["total_returned"] == 0
    assert logs["logs"] == []


@pytest.mark.asyncio
async def test_monitoring_distinguishes_live_demo_unavailable_and_error(monkeypatch):
    import httpx
    from app.core.config import settings
    from app.services import observability_service as observability_module
    from app.services.observability_service import ObservabilityService

    class FakeResponse:
        def __init__(self, status_code, payload=None):
            self.status_code = status_code
            self.payload = payload or {}

        def json(self):
            return self.payload

    class FakeAsyncClient:
        status_code = 200
        failure = None
        empty_metric = None

        def __init__(self, **kwargs):
            pass

        async def __aenter__(self):
            return self

        async def __aexit__(self, *args):
            return None

        async def get(self, *args, **kwargs):
            if self.failure:
                raise self.failure
            if self.status_code != 200:
                return FakeResponse(self.status_code)
            query = kwargs["params"]["query"]
            metric_name = "memory" if "memory" in query else "cpu"
            if self.empty_metric == metric_name:
                return FakeResponse(200, {"data": {"result": []}})
            value = [1700000001, str(2 * 1024 ** 3)] if metric_name == "memory" else [1700000000, "0.5"]
            return FakeResponse(200, {"data": {"result": [{"value": value}]}})

    monkeypatch.setattr(observability_module.httpx, "AsyncClient", FakeAsyncClient)
    service = ObservabilityService()
    monkeypatch.setattr(settings, "DEMO_MODE", False)

    live = await service.get_cluster_resource_metrics("live")
    assert live["status"] == "live"
    assert live["provenance"]["state"] == "live"
    assert live["cpu_utilization_cores"] == 0.5
    assert live["memory_utilization_gb"] == 2
    assert live["timestamp"] == live["provenance"]["last_synced_at"].isoformat()

    FakeAsyncClient.empty_metric = "memory"
    missing_memory = await service.get_cluster_resource_metrics("missing-memory")
    assert missing_memory["status"] == "unavailable"
    assert "no memory metric result" in missing_memory["error"]
    FakeAsyncClient.empty_metric = None

    FakeAsyncClient.status_code = 404
    unavailable = await service.get_cluster_resource_metrics("missing")
    assert unavailable["status"] == "unavailable"
    assert unavailable["provenance"]["state"] == "unavailable"

    FakeAsyncClient.status_code = 500
    errored = await service.get_cluster_resource_metrics("error")
    assert errored["status"] == "error"
    assert errored["provenance"]["state"] == "error"

    FakeAsyncClient.status_code = 200
    FakeAsyncClient.failure = httpx.ConnectError("collector offline")
    monkeypatch.setattr(settings, "DEMO_MODE", True)
    demo = await service.query_loki_logs()
    assert demo["status"] == "demo"
    assert demo["provenance"]["state"] == "demo"
    assert demo["live_source_status"] == "error"
    assert demo["live_source_error"]


@pytest.mark.asyncio
async def test_monitoring_health_status_preserves_error_and_unavailable_states(monkeypatch):
    from app.services import observability_service as observability_module
    from app.services.observability_service import ObservabilityService

    class FakeResponse:
        def __init__(self, status_code):
            self.status_code = status_code

    class FakeAsyncClient:
        def __init__(self, **kwargs):
            pass

        async def __aenter__(self):
            return self

        async def __aexit__(self, *args):
            return None

        async def get(self, url):
            if "/-/healthy" in url:
                return FakeResponse(503)
            if "/ready" in url:
                return FakeResponse(404)
            return FakeResponse(200)

    monkeypatch.setattr(observability_module.httpx, "AsyncClient", FakeAsyncClient)
    result = await ObservabilityService().get_observability_status()

    assert result["services"]["prometheus"]["status"] == "error"
    assert result["services"]["loki"]["status"] == "unavailable"
    assert result["services"]["opentelemetry"]["status"] == "operational"


def test_seeded_runtime_graph_and_investigation_are_demo_provenance():
    from app.services.attack_path_engine import AttackPathEngine
    from app.services.ai_investigation_engine import ai_investigation_engine
    from app.services.runtime_threat_service import runtime_threat_service
    from app.services.security_graph_service import security_graph_engine

    events = runtime_threat_service.list_threat_events(limit=100)["events"]
    assert events
    assert all(event["provenance"]["state"] == "demo" for event in events if event["id"].startswith("evt_"))
    assert all(event["data_source"] == "seeded-demo-sample" for event in events if event["id"].startswith("evt_"))

    graph = security_graph_engine.get_graph_data()
    assert graph["provenance"]["state"] == "demo"
    assert all(node["provenance"] == "demo" for node in graph["nodes"])
    attack_graph_paths = security_graph_engine.compute_attack_paths()
    assert attack_graph_paths
    assert all(node["provenance"] == "demo" for path in attack_graph_paths for node in path.nodes)
    assert all(edge["provenance"] == "demo" for path in attack_graph_paths for edge in path.edges)

    investigation = ai_investigation_engine.get_investigation("INV-001")
    assert investigation is not None
    assert investigation.provenance == "demo"
    assert all(item.provenance != "live" for item in investigation.evidence_bundle.items)
    assert investigation.report.provider_metadata["execution_mode"] == "seeded-demo"
    assert all(item.source.startswith("demo-") for item in investigation.evidence_bundle.items)
    assert all("sample" in fact.lower() for fact in investigation.report.confirmed_facts)


@pytest.mark.asyncio
async def test_attack_path_fallback_marks_each_sample_node(monkeypatch):
    from app.services import attack_path_engine as attack_module
    from app.services.attack_path_engine import AttackPathEngine

    monkeypatch.setattr(
        attack_module,
        "_get_k8s_client",
        lambda: (_ for _ in ()).throw(RuntimeError("offline test")),
    )
    paths = await AttackPathEngine().analyze_attack_paths("offline")

    assert paths[0]["provenance"] == "demo"
    assert paths[0]["data_source"] == "seeded-demo-sample"
    assert all(node["provenance"] == "demo" for node in paths[0]["nodes"])


@pytest.mark.asyncio
async def test_remediation_planner_calls_fallback_manifest_a_sample(monkeypatch):
    from app.services import remediation_planner_service as planner_module

    async def no_kubectl(*args, **kwargs):
        raise FileNotFoundError("kubectl disabled in test")

    monkeypatch.setattr(planner_module.asyncio, "create_subprocess_exec", no_kubectl)
    service = planner_module.RemediationPlannerService()

    manifest, provenance = await service._fetch_current_manifest("Deployment", "sample", "default")
    valid, output, label = await service.validate_dry_run(
        "apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: sample\n",
        "default",
    )

    assert provenance == "demo"
    assert manifest.startswith("# SAMPLE ONLY:")
    assert valid is False
    assert label == "Server Validation Unavailable"
    assert "no server-side dry-run was performed" in output


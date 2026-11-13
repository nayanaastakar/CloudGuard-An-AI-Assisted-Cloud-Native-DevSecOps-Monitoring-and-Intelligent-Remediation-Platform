"""Unit & Integration tests for CloudGuard Module 3 (Observability) & Module 4 (Runtime Security)."""

import pytest
from app.services.observability_service import observability_service
from app.services.runtime_threat_service import runtime_threat_service, FalcoWebhookPayload


@pytest.mark.asyncio
class TestObservabilityService:
    async def test_observability_status_structure(self):
        status = await observability_service.get_observability_status()
        assert "timestamp" in status
        assert "services" in status
        services = status["services"]
        for svc in ["prometheus", "grafana", "loki", "opentelemetry"]:
            assert svc in services
            assert "status" in services[svc]
            assert "provenance" in services[svc]

    async def test_cluster_resource_metrics_provenance(self):
        metrics = await observability_service.get_cluster_resource_metrics("test-cluster")
        assert "cluster_id" in metrics
        assert "provenance" in metrics
        prov = metrics["provenance"]
        assert prov["state"] in ["live", "stale", "demo", "unavailable"]
        assert "summary" in metrics or "cpu_utilization_cores" in metrics

    async def test_loki_logs_query_bounds(self):
        logs_res = await observability_service.query_loki_logs(limit=10)
        assert "provenance" in logs_res
        assert "total_returned" in logs_res
        assert logs_res["provenance"]["state"] in ["live", "demo"]
        assert len(logs_res.get("logs", [])) <= 10


@pytest.mark.asyncio
class TestRuntimeThreatService:
    async def test_demo_runtime_events_initialization(self):
        res = runtime_threat_service.list_threat_events()
        assert res["total"] >= 3
        assert "summary" in res
        assert "CRITICAL" in res["summary"]
        assert "events" in res
        first_event = res["events"][0]
        assert "rule" in first_event
        assert "severity" in first_event
        assert "provenance" in first_event

    async def test_ingest_falco_webhook_and_deduplication(self):
        payload = FalcoWebhookPayload(
            rule="Terminal shell in container",
            priority="Critical",
            output="Spawning bash process inside container test-pod-unit",
            output_fields={
                "k8s.pod.name": "unit-test-pod-1",
                "container.name": "unit-test-container",
                "k8s.ns.name": "default"
            }
        )

        # Ingestion 1 -> should succeed as ingested
        res1 = await runtime_threat_service.ingest_falco_event(payload)
        assert res1["status"] == "ingested"
        assert res1["severity"] == "CRITICAL"
        assert res1["provenance"] == "live"

        # Ingestion 2 immediately after -> should be deduplicated
        res2 = await runtime_threat_service.ingest_falco_event(payload)
        assert res2["status"] == "deduplicated"
        assert "suppression window" in res2["message"]

    async def test_filter_threat_events_by_severity(self):
        crit_res = runtime_threat_service.list_threat_events(severity="CRITICAL")
        for ev in crit_res["events"]:
            assert ev["severity"] == "CRITICAL"

"""CloudGuard Observability & Logging Service.

Integrates with Prometheus, Grafana, Loki, and OpenTelemetry.
Provides resource utilization metrics, log exploration, and collector health checks
with explicit provenance tags (live, stale, demo, unavailable) and query safety.
"""

import asyncio
import logging
import os
import urllib.parse
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional

import httpx

from app.core.config import settings
from app.schemas.provenance import ProvenanceMetadata, ProvenanceState, determine_provenance

logger = logging.getLogger(__name__)


class ObservabilityService:
    """Provides monitoring queries across Prometheus, Grafana, Loki, and OpenTelemetry."""

    def __init__(self):
        self.prometheus_url = os.getenv("PROMETHEUS_URL", "http://localhost:9090")
        self.loki_url = os.getenv("LOKI_URL", "http://localhost:3100")
        self.grafana_url = os.getenv("GRAFANA_URL", "http://localhost:3000")
        self.otel_collector_url = os.getenv("OTEL_COLLECTOR_URL", "http://localhost:4318")

    async def get_observability_status(self) -> Dict[str, Any]:
        """Audits the connection status and availability of all observability endpoints."""
        async with httpx.AsyncClient(timeout=2.0) as client:
            async def probe(url: str, accepted_statuses: List[int]) -> Dict[str, Any]:
                try:
                    response = await client.get(url)
                except httpx.RequestError as exc:
                    logger.warning("Observability health probe failed for %s: %s", url, exc)
                    return {"status": "error", "provenance": "error", "error": str(exc)}
                if response.status_code in accepted_statuses:
                    return {"status": "operational", "provenance": "live"}
                state = "error" if response.status_code >= 500 else "unavailable"
                return {
                    "status": state,
                    "provenance": state,
                    "error": f"Health endpoint returned HTTP {response.status_code}",
                }

            prom_state = await probe(f"{self.prometheus_url}/-/healthy", [200])
            loki_state = await probe(f"{self.loki_url}/ready", [200])
            otel_state = await probe(f"{self.otel_collector_url}/v1/health", [200, 404])

        now = datetime.now(timezone.utc)
        return {
            "timestamp": now.isoformat(),
            "services": {
                "prometheus": {
                    "name": "Prometheus Metrics Server",
                    "url": self.prometheus_url,
                    **prom_state
                },
                "grafana": {
                    "name": "Grafana Visualization",
                    "url": self.grafana_url,
                    "status": "demo" if settings.DEMO_MODE else "unavailable",
                    "provenance": "demo" if settings.DEMO_MODE else "unavailable",
                    "error": None if settings.DEMO_MODE else "Grafana health checks are not configured",
                },
                "loki": {
                    "name": "Grafana Loki Log Aggregator",
                    "url": self.loki_url,
                    **loki_state
                },
                "opentelemetry": {
                    "name": "OpenTelemetry Collector (OTLP)",
                    "url": self.otel_collector_url,
                    **otel_state
                }
            }
        }

    async def get_cluster_resource_metrics(self, cluster_id: str = "default") -> Dict[str, Any]:
        """Fetches CPU and Memory utilization trends or provides deterministic telemetry."""
        live_status = "unavailable"
        live_error = "Prometheus is unavailable"
        live_provenance = ProvenanceState.UNAVAILABLE
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                query_url = f"{self.prometheus_url}/api/v1/query"
                queries = {
                    "cpu": "sum(rate(container_cpu_usage_seconds_total[5m]))",
                    "memory": "sum(container_memory_working_set_bytes)",
                }
                samples = {}
                for metric_name, query in queries.items():
                    response = await client.get(query_url, params={"query": query})
                    if response.status_code != 200:
                        live_error = f"Prometheus returned HTTP {response.status_code}"
                        if response.status_code >= 500:
                            live_status = "error"
                            live_provenance = ProvenanceState.ERROR
                        logger.warning("%s", live_error)
                        break

                    results = response.json().get("data", {}).get("result", [])
                    if not results:
                        live_error = f"Prometheus returned no {metric_name} metric result"
                        logger.warning("%s", live_error)
                        break

                    value = results[0].get("value")
                    if not isinstance(value, list) or len(value) < 2:
                        raise ValueError(f"Prometheus returned an invalid {metric_name} metric sample")
                    samples[metric_name] = (float(value[1]), float(value[0]))

                if len(samples) == len(queries):
                    sample_time = min(sample[1] for sample in samples.values())
                    timestamp = datetime.fromtimestamp(sample_time, timezone.utc).isoformat()
                    prov = ProvenanceMetadata(
                        state=ProvenanceState.LIVE,
                        source="prometheus",
                        is_fresh=True,
                        ttl_seconds=60,
                        last_synced_at=timestamp,
                    )
                    return {
                        "cluster_id": cluster_id,
                        "status": "live",
                        "provenance": prov.dict(),
                        "cpu_utilization_cores": samples["cpu"][0],
                        "memory_utilization_gb": samples["memory"][0] / (1024 ** 3),
                        "timestamp": timestamp,
                        "node_metrics": []
                    }
        except httpx.RequestError as exc:
            live_status = "error"
            live_provenance = ProvenanceState.ERROR
            live_error = f"Prometheus request failed: {exc}"
            logger.warning("%s", live_error)
        except (ValueError, KeyError, TypeError, IndexError, AttributeError) as exc:
            live_status = "error"
            live_provenance = ProvenanceState.ERROR
            live_error = f"Invalid Prometheus response: {exc}"
            logger.warning("%s", live_error)

        if not settings.DEMO_MODE:
            prov = ProvenanceMetadata(
                state=live_provenance,
                source="prometheus",
                is_fresh=False,
                ttl_seconds=60,
                last_synced_at=None,
                error_message=live_error,
            )
            status = "error" if live_status == "error" else "unavailable"
            return {"cluster_id": cluster_id, "status": status, "provenance": prov.dict(), "error": live_error, "summary": None, "timeline": [], "workloads": []}

        # Demo / simulated resource metrics when Prometheus is not deployed
        prov = determine_provenance(False, source_name="cloudguard-demo-telemetry", ttl_seconds=60)
        return {
            "cluster_id": cluster_id,
            "status": "demo",
            "provenance": prov.dict(),
            "live_source_status": live_status,
            "live_source_error": live_error,
            "summary": {
                "cpu_usage_percent": 42.5,
                "memory_usage_percent": 58.1,
                "network_io_mbps": 18.4,
                "pod_count": 14,
            },
            "timeline": [
                {"timestamp": "10:00", "cpu": 38, "memory": 52},
                {"timestamp": "10:15", "cpu": 45, "memory": 55},
                {"timestamp": "10:30", "cpu": 41, "memory": 57},
                {"timestamp": "10:45", "cpu": 49, "memory": 60},
                {"timestamp": "11:00", "cpu": 42, "memory": 58},
            ],
            "workloads": [
                {"name": "payment-api", "namespace": "production", "cpu": "180m", "memory": "240Mi", "status": "healthy"},
                {"name": "user-auth", "namespace": "production", "cpu": "95m", "memory": "180Mi", "status": "healthy"},
                {"name": "frontend-gw", "namespace": "production", "cpu": "310m", "memory": "320Mi", "status": "healthy"},
                {"name": "ingress-controller", "namespace": "ingress-nginx", "cpu": "120m", "memory": "190Mi", "status": "healthy"}
            ]
        }

    async def query_loki_logs(
        self,
        query: str = '{app="payment-api"}',
        limit: int = 50,
        namespace: Optional[str] = None
    ) -> Dict[str, Any]:
        """Queries Loki log streams with pagination and query safety limits."""
        live_status = "unavailable"
        live_error = "Loki is unavailable"
        live_provenance = ProvenanceState.UNAVAILABLE
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                query_url = f"{self.loki_url}/loki/api/v1/query_range"
                params = {"query": query, "limit": min(limit, 100)}
                res = await client.get(query_url, params=params)
                if res.status_code == 200:
                    raw_data = res.json()
                    prov = determine_provenance(True, source_name="loki", ttl_seconds=60)
                    return {
                        "query": query,
                        "status": "live",
                        "provenance": prov.dict(),
                        "streams": raw_data.get("data", {}).get("result", []),
                        "total_returned": len(raw_data.get("data", {}).get("result", []))
                    }
                live_error = f"Loki returned HTTP {res.status_code}"
                if res.status_code >= 500:
                    live_status = "error"
                    live_provenance = ProvenanceState.ERROR
                logger.warning("%s", live_error)
        except httpx.RequestError as exc:
            live_status = "error"
            live_provenance = ProvenanceState.ERROR
            live_error = f"Loki request failed: {exc}"
            logger.warning("%s", live_error)
        except (ValueError, KeyError, TypeError, AttributeError) as exc:
            live_status = "error"
            live_provenance = ProvenanceState.ERROR
            live_error = f"Invalid Loki response: {exc}"
            logger.warning("%s", live_error)

        if not settings.DEMO_MODE:
            prov = ProvenanceMetadata(
                state=live_provenance,
                source="loki",
                is_fresh=False,
                ttl_seconds=60,
                last_synced_at=None,
                error_message=live_error,
            )
            status = "error" if live_status == "error" else "unavailable"
            return {"query": query, "status": status, "provenance": prov.dict(), "error": live_error, "limit": limit, "total_returned": 0, "logs": []}

        # Deterministic sample logs with explicit DEMO provenance
        prov = determine_provenance(False, source_name="demo-loki-aggregator", ttl_seconds=60)
        now = datetime.now(timezone.utc)
        sample_logs = [
            {"timestamp": (now - timedelta(minutes=2)).isoformat(), "level": "INFO", "stream": "payment-api", "message": "POST /v1/checkout - 200 OK (duration: 38ms)"},
            {"timestamp": (now - timedelta(minutes=3)).isoformat(), "level": "WARN", "stream": "payment-api", "message": "High database connection pool latency: 120ms"},
            {"timestamp": (now - timedelta(minutes=5)).isoformat(), "level": "ERROR", "stream": "user-auth", "message": "Authentication token expired for user usr_9482"},
            {"timestamp": (now - timedelta(minutes=8)).isoformat(), "level": "INFO", "stream": "frontend-gw", "message": "GET /health - 200 OK"},
            {"timestamp": (now - timedelta(minutes=10)).isoformat(), "level": "WARN", "stream": "payment-api", "message": "JWT validation retry triggered for key rotation"}
        ]

        return {
            "query": query,
            "status": "demo",
            "provenance": prov.dict(),
            "live_source_status": live_status,
            "live_source_error": live_error,
            "limit": limit,
            "total_returned": len(sample_logs),
            "logs": sample_logs
        }


observability_service = ObservabilityService()

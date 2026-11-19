"""
Tests for health check endpoints.
"""
import pytest


@pytest.mark.asyncio
async def test_readiness_does_not_report_kubernetes_live_when_api_request_fails(monkeypatch):
    from app.api.routes import health
    from app.services.kubernetes_service import kubernetes_service

    def fail_read():
        raise RuntimeError("test API unavailable")

    monkeypatch.setattr(kubernetes_service, "_initialize", lambda: None)
    core = type("Core", (), {"list_namespace": lambda self, **kwargs: fail_read()})()
    monkeypatch.setattr(kubernetes_service, "_core_v1", core)
    monkeypatch.setattr(health.settings, "GEMINI_API_KEY", "")
    monkeypatch.setattr(health.settings, "ANTHROPIC_API_KEY", "")
    monkeypatch.setattr(health.settings, "GROQ_API_KEY", "")

    result = await health.readiness_check()

    assert result["checks"]["kubernetes"] is False
    assert result["check_details"]["kubernetes"]["status"] == "error"
    assert "test API unavailable" in result["check_details"]["kubernetes"]["error"]


@pytest.mark.asyncio
async def test_readiness_marks_missing_kubernetes_configuration_unavailable(monkeypatch):
    from app.api.routes import health
    from app.services.kubernetes_service import kubernetes_service
    from kubernetes.config.config_exception import ConfigException

    def missing_kubeconfig():
        raise ConfigException("no kubeconfig")

    monkeypatch.setattr(kubernetes_service, "_initialize", missing_kubeconfig)
    monkeypatch.setattr(health.settings, "GEMINI_API_KEY", "")
    monkeypatch.setattr(health.settings, "ANTHROPIC_API_KEY", "")
    monkeypatch.setattr(health.settings, "GROQ_API_KEY", "")

    result = await health.readiness_check()

    assert result["checks"]["kubernetes"] is False
    assert result["check_details"]["kubernetes"]["status"] == "unavailable"
    assert result["check_details"]["kubernetes"]["source"] == "kubernetes-api"


class TestHealthEndpoints:
    """Test suite for health check endpoints."""

    def test_root_endpoint(self, test_client):
        """Test the root endpoint returns app info."""
        response = test_client.get("/")
        assert response.status_code == 200

        data = response.json()
        assert "name" in data
        assert "version" in data
        assert "status" in data
        assert data["status"] == "operational"

    def test_health_check(self, test_client):
        """Test the health check endpoint."""
        response = test_client.get("/health")
        assert response.status_code == 200

        data = response.json()
        assert data["status"] == "healthy"

    def test_healthz_check(self, test_client):
        """Test the /healthz Kubernetes probe endpoint."""
        response = test_client.get("/healthz")
        assert response.status_code == 200

        data = response.json()
        assert data["status"] == "healthy"

    def test_ws_health_check(self, test_client):
        """Test the /api/v1/ws/health WebSocket health endpoint."""
        with test_client.websocket_connect("/api/v1/ws/health") as ws:
            msg = ws.receive_json()
            assert msg.get("status") == "healthy"
            assert "connections" in msg

    def test_readiness_check_dependencies(self, test_client):
        """Test that /ready verifies core CloudGuard dependencies and excludes legacy Jenkins."""
        response = test_client.get("/ready")
        assert response.status_code == 200

        data = response.json()
        assert "ready" in data
        assert "checks" in data
        checks = data["checks"]
        assert "api" in checks
        assert "kubernetes" in checks
        assert "ai" in checks
        assert "jenkins" not in checks, "Decoupled legacy Jenkins check must not be present in readiness"

    def test_health_check_response_time(self, test_client):
        """Test that health check responds quickly."""
        import time

        start = time.time()
        response = test_client.get("/health")
        elapsed = time.time() - start

        assert response.status_code == 200
        assert elapsed < 1.0  # Should respond in under 1 second


class TestAPIStructure:
    """Test API structure and documentation."""

    def test_openapi_docs_available(self, test_client):
        """Test that OpenAPI docs are available."""
        response = test_client.get("/openapi.json")
        assert response.status_code == 200

        data = response.json()
        assert "openapi" in data
        assert "info" in data
        assert "paths" in data

    def test_api_title_and_version(self, test_client):
        """Test API metadata is correctly set."""
        response = test_client.get("/openapi.json")
        data = response.json()

        assert data["info"]["title"] in ["CloudGuard", "CloudGuard Platform", "CloudGuard API", "KubeSight"]
        assert "version" in data["info"]

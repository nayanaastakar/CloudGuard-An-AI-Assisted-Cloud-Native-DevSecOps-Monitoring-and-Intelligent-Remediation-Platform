"""Tests for authenticated WebSocket event streaming and cluster filtering."""

import json
import pytest
from starlette.websockets import WebSocketDisconnect

from app.core.security import create_access_token


class TestWebSocketEvents:
    """Verify security controls on the /api/v1/ws/events endpoint."""

    def test_websocket_rejects_missing_auth(self, test_client):
        """Websocket should reject or close connection if auth handshake fails."""
        with test_client.websocket_connect("/api/v1/ws/events") as websocket:
            # Send invalid handshake
            websocket.send_text(json.dumps({"type": "invalid"}))
            msg = websocket.receive_json()
            assert msg.get("type") == "auth_error"

    def test_websocket_rejects_invalid_token(self, test_client):
        """Websocket should close with auth_error on invalid JWT token."""
        with test_client.websocket_connect("/api/v1/ws/events") as websocket:
            websocket.send_text(json.dumps({
                "type": "authenticate",
                "token": "invalid.jwt.token",
                "cluster_id": "default"
            }))
            msg = websocket.receive_json()
            assert msg.get("type") == "auth_error"
            assert "Invalid or expired" in msg.get("error", "")

    def test_websocket_authenticates_valid_token(self, test_client):
        """Websocket should accept connection upon valid in-band auth handshake."""
        valid_token = create_access_token({"sub": "test-user-id", "username": "sec-analyst", "role": "operator"})
        with test_client.websocket_connect("/api/v1/ws/events?cluster_id=default") as websocket:
            websocket.send_text(json.dumps({
                "type": "authenticate",
                "token": valid_token,
                "cluster_id": "default"
            }))
            msg = websocket.receive_json()
            assert msg.get("type") == "authenticated"
            assert msg.get("status") == "connected"
            assert msg.get("user") == "sec-analyst"

            # Verify heartbeat ping-pong
            websocket.send_text("ping")
            pong = websocket.receive_json()
            assert pong.get("type") == "pong"

            # Explicitly close so the server's receive loop exits via
            # WebSocketDisconnect; without this the test hangs waiting
            # for the module-scoped TestClient to drain the ASGI loop.
            websocket.close()

    @pytest.mark.asyncio
    async def test_websocket_delivers_event_to_authorized_cluster(self, test_client):
        """Authenticated subscriber should receive events broadcast to their cluster."""
        from app.core.websocket_manager import ws_manager

        valid_token = create_access_token({"sub": "analyst-1", "username": "analyst-1", "role": "viewer"})
        with test_client.websocket_connect("/api/v1/ws/events?cluster_id=staging-cluster") as websocket:
            websocket.send_text(json.dumps({
                "type": "authenticate",
                "token": valid_token,
                "cluster_id": "staging-cluster"
            }))
            auth_msg = websocket.receive_json()
            assert auth_msg.get("type") == "authenticated"
            assert auth_msg.get("cluster_id") == "staging-cluster"

            # Broadcast event targeting the subscriber's cluster
            event_data = {"rule": "Unauthorized Privileged Pod", "severity": "HIGH", "namespace": "prod"}
            await ws_manager.broadcast_event(
                event_type="runtime_threat",
                data=event_data,
                cluster_id="staging-cluster"
            )

            # Client should receive the broadcast event
            received = websocket.receive_json()
            assert received.get("type") == "runtime_threat"
            assert received.get("cluster_id") == "staging-cluster"
            assert received.get("data", {}).get("rule") == "Unauthorized Privileged Pod"
            assert received.get("data", {}).get("severity") == "HIGH"

            websocket.close()

    @pytest.mark.asyncio
    async def test_websocket_filters_unauthorized_cluster_events(self, test_client):
        """Subscriber limited to cluster-a should NOT receive events broadcast to cluster-b."""
        from app.core.websocket_manager import ws_manager

        # Role "viewer" is restricted to {cluster_id} only (not wildcard)
        valid_token = create_access_token({"sub": "analyst-2", "username": "analyst-2", "role": "viewer"})
        with test_client.websocket_connect("/api/v1/ws/events?cluster_id=cluster-alpha") as websocket:
            websocket.send_text(json.dumps({
                "type": "authenticate",
                "token": valid_token,
                "cluster_id": "cluster-alpha"
            }))
            auth_msg = websocket.receive_json()
            assert auth_msg.get("type") == "authenticated"

            # Broadcast event to a different cluster (cluster-beta)
            await ws_manager.broadcast_event(
                event_type="runtime_threat",
                data={"rule": "Secret Exfiltration", "severity": "CRITICAL"},
                cluster_id="cluster-beta"
            )

            # Now send ping; if cluster-beta event was withheld, the immediate next message is pong
            websocket.send_text("ping")
            next_msg = websocket.receive_json()
            # Must be pong, proving cluster-beta event was not forwarded to cluster-alpha subscriber
            assert next_msg.get("type") == "pong"

            websocket.close()


class TestWebSocketOriginValidation:
    """Verify WebSocket Origin validation controls across endpoints and environments."""

    def test_allowed_origin_in_production(self, test_client, monkeypatch):
        """WebSocket should connect when Origin matches configured production CORS_ORIGINS."""
        monkeypatch.setattr("app.api.routes.websocket.is_effective_production", lambda s=None: True)
        from app.core.config import settings
        monkeypatch.setattr(settings, "CORS_ORIGINS", ["https://cloudguard.azurewebsites.net"])

        with test_client.websocket_connect(
            "/api/v1/ws/health",
            headers={"Origin": "https://cloudguard.azurewebsites.net"}
        ) as ws:
            msg = ws.receive_json()
            assert msg.get("status") == "healthy"

    def test_disallowed_origin_in_production_rejected(self, test_client, monkeypatch):
        """WebSocket must be rejected with 1008 if Origin is not in CORS_ORIGINS in production."""
        monkeypatch.setattr("app.api.routes.websocket.is_effective_production", lambda s=None: True)
        from app.core.config import settings
        monkeypatch.setattr(settings, "CORS_ORIGINS", ["https://cloudguard.azurewebsites.net"])

        with pytest.raises(WebSocketDisconnect) as exc_info:
            with test_client.websocket_connect(
                "/api/v1/ws/health",
                headers={"Origin": "https://malicious-site.com"}
            ) as ws:
                ws.receive_json()
        assert exc_info.value.code == 1008

    def test_missing_origin_in_production_rejected(self, test_client, monkeypatch):
        """In production, browser WebSocket handshakes with missing Origin must be rejected."""
        monkeypatch.setattr("app.api.routes.websocket.is_effective_production", lambda s=None: True)
        from app.core.config import settings
        monkeypatch.setattr(settings, "CORS_ORIGINS", ["https://cloudguard.azurewebsites.net"])

        with pytest.raises(WebSocketDisconnect) as exc_info:
            with test_client.websocket_connect("/api/v1/ws/health") as ws:
                ws.receive_json()
        assert exc_info.value.code == 1008

    def test_wildcard_cors_rejected_in_production(self, test_client, monkeypatch):
        """Even if CORS_ORIGINS contains wildcard, production must reject arbitrary origins."""
        monkeypatch.setattr("app.api.routes.websocket.is_effective_production", lambda s=None: True)
        from app.core.config import settings
        monkeypatch.setattr(settings, "CORS_ORIGINS", ["*"])

        with pytest.raises(WebSocketDisconnect) as exc_info:
            with test_client.websocket_connect(
                "/api/v1/ws/health",
                headers={"Origin": "https://malicious-site.com"}
            ) as ws:
                ws.receive_json()
        assert exc_info.value.code == 1008

    def test_development_mode_allows_localhost_and_missing_origin(self, test_client, monkeypatch):
        """Development mode should allow localhost origins and missing origins for tooling."""
        monkeypatch.setattr("app.api.routes.websocket.is_effective_production", lambda s=None: False)
        from app.core.config import settings
        monkeypatch.setattr(settings, "CORS_ORIGINS", ["http://localhost:3000"])

        # Missing origin in dev
        with test_client.websocket_connect("/api/v1/ws/health") as ws:
            msg = ws.receive_json()
            assert msg.get("status") == "healthy"

        # Localhost origin in dev
        with test_client.websocket_connect(
            "/api/v1/ws/health",
            headers={"Origin": "http://localhost:5173"}
        ) as ws:
            msg = ws.receive_json()
            assert msg.get("status") == "healthy"

    def test_all_websocket_endpoints_enforce_origin(self, test_client, monkeypatch):
        """Verify origin validation is enforced across all WebSocket endpoint categories."""
        monkeypatch.setattr("app.api.routes.websocket.is_effective_production", lambda s=None: True)
        from app.core.config import settings
        monkeypatch.setattr(settings, "CORS_ORIGINS", ["https://cloudguard.azurewebsites.net"])

        endpoints = [
            "/api/v1/ws/health",
            "/api/v1/ws/events",
            "/api/v1/ws/pods/default/test-pod/logs",
            "/api/v1/ws/pods/default/test-pod/exec",
            "/api/v1/ws/pods/default/test-pod/debug",
        ]

        for ep in endpoints:
            with pytest.raises(WebSocketDisconnect) as exc_info:
                with test_client.websocket_connect(
                    ep,
                    headers={"Origin": "https://attacker.com"}
                ) as ws:
                    ws.receive_json()
            assert exc_info.value.code == 1008, f"Endpoint {ep} failed to reject unauthorized origin with 1008"

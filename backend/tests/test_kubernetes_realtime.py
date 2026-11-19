import pytest
from app.services.realtime_k8s_service import parse_quantity, RealtimeKubernetesMonitorService


def test_parse_quantity():
    # CPU quantities
    assert parse_quantity("500m") == 0.5
    assert parse_quantity("1000m") == 1.0
    assert parse_quantity("2") == 2.0
    assert parse_quantity("1000000n") == 0.001
    assert parse_quantity("1000u") == 0.001

    # Memory quantities
    assert parse_quantity("1Ki") == 1024
    assert parse_quantity("1Mi") == 1024 * 1024
    assert parse_quantity("2Gi") == 2 * 1024 * 1024 * 1024
    assert parse_quantity("1K") == 1000
    assert parse_quantity("1M") == 1000000
    assert parse_quantity("") == 0.0


def test_disconnected_state_generation():
    service = RealtimeKubernetesMonitorService()
    state = service._build_disconnected_state("Connection refused to 127.0.0.1:6443", "2026-11-19T00:00:00Z")

    assert state.connected is False
    assert "Connection refused" in state.connection_error
    assert state.provenance == "error"
    assert state.metrics_server_available is False
    assert state.cluster_cpu_used_cores is None
    assert state.cluster_memory_used_bytes is None
    assert len(state.nodes) == 0

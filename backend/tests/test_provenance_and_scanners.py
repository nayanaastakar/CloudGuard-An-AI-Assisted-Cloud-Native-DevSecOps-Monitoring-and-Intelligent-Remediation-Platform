"""Unit tests for Provenance and Scanner Orchestration in CloudGuard."""

import pytest
from datetime import datetime, timezone, timedelta
from app.schemas.provenance import (
    ProvenanceState,
    ProvenanceMetadata,
    determine_provenance,
)
from app.services.scanner_orchestrator_service import scanner_orchestrator
from app.services.asset_discovery_service import asset_discovery_service


class TestProvenanceSystem:
    """Test provenance calculation and state boundaries."""

    def test_live_source_within_ttl_is_live(self):
        now = datetime.now(timezone.utc)
        meta = determine_provenance(
            is_live_source=True,
            last_sync=now,
            ttl_seconds=120,
            source_name="kubernetes-api"
        )
        assert meta.state == ProvenanceState.LIVE
        assert meta.is_fresh is True
        assert meta.source == "kubernetes-api"

    def test_live_source_exceeding_ttl_is_stale(self):
        past = datetime.now(timezone.utc) - timedelta(seconds=200)
        meta = determine_provenance(
            is_live_source=True,
            last_sync=past,
            ttl_seconds=120,
            source_name="kubernetes-api"
        )
        assert meta.state == ProvenanceState.STALE
        assert meta.is_fresh is False

    def test_demo_source_is_explicitly_demo(self):
        meta = determine_provenance(
            is_live_source=False,
            source_name="demo-engine"
        )
        assert meta.state == ProvenanceState.DEMO
        assert meta.source == "demo-engine"
        assert meta.error_message is None

    def test_unavailable_system_reports_error(self):
        meta = determine_provenance(
            is_live_source=False,
            error="Connection refused on port 6443",
            source_name="cluster-control-plane"
        )
        assert meta.state == ProvenanceState.UNAVAILABLE
        assert "Connection refused" in meta.error_message


class TestScannerOrchestrator:
    """Test scanner orchestration and fallback normalization."""

    def test_scanner_health_structure(self):
        health = scanner_orchestrator.get_scanner_health()
        assert "scanners" in health
        assert "total_configured" in health
        assert health["total_configured"] == 4
        assert "trivy" in health["scanners"]
        assert "prowler" in health["scanners"]
        assert "kyverno" in health["scanners"]
        assert "cosign" in health["scanners"]

    @pytest.mark.asyncio
    async def test_trivy_sample_vulnerabilities(self):
        result = await scanner_orchestrator.scan_image_with_trivy("nginx:1.24")
        assert result["image"] == "nginx:1.24"
        assert "provenance" in result
        assert result["provenance"]["state"] in [ProvenanceState.LIVE.value, ProvenanceState.DEMO.value]
        assert result["total_vulnerabilities"] >= 0
        assert "findings" in result

    @pytest.mark.asyncio
    async def test_sbom_packages_extraction(self):
        sbom = await scanner_orchestrator.get_sbom_packages("redis:7-alpine")
        assert sbom["image"] == "redis:7-alpine"
        assert "packages" in sbom
        assert sbom["package_count"] > 0
        assert "provenance" in sbom


class TestAssetDiscovery:
    """Test asset discovery and hierarchy normalization."""

    @pytest.mark.asyncio
    async def test_inventory_structure_and_provenance(self):
        inv = await asset_discovery_service.get_infrastructure_inventory("default")
        assert "provenance" in inv
        assert inv["provenance"]["state"] in [s.value for s in ProvenanceState]
        assert "summary" in inv
        assert inv["summary"]["total_nodes"] > 0
        assert inv["summary"]["total_namespaces"] > 0
        assert inv["summary"]["total_workloads"] > 0
        assert len(inv["nodes"]) > 0

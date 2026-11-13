"""Unit and integration tests for CloudGuard Module 5: Security Intelligence & Attack Path Analysis."""

import pytest
from app.services.security_graph_service import security_graph_engine, GraphNode, GraphRelationship


class TestSecurityGraphEngine:
    def test_baseline_graph_nodes_and_edges(self):
        data = security_graph_engine.get_graph_data()
        assert data["total_nodes"] >= 8
        assert data["total_edges"] >= 6
        assert "nodes" in data
        assert "edges" in data
        assert "provenance" in data
        assert data["provenance"]["state"] in ["live", "demo"]

    def test_node_filter_by_entity_type(self):
        workload_data = security_graph_engine.get_graph_data(entity_type="Workload")
        for node in workload_data["nodes"]:
            assert node["entity_type"] == "Workload"

    def test_node_search_keyword(self):
        search_data = security_graph_engine.get_graph_data(search="payment")
        assert len(search_data["nodes"]) >= 1
        assert any("payment" in n["name"].lower() for n in search_data["nodes"])

    def test_prevent_duplicate_relationships(self):
        initial_edges = len(security_graph_engine.get_graph_data()["edges"])
        # Attempt to insert identical relationship
        duplicate_rel = GraphRelationship(
            source_node_id="net:ingress:public-gateway",
            target_node_id="net:svc:payment-api-svc",
            relationship_type="EXPOSES",
            evidence_reference="Duplicate edge test"
        )
        security_graph_engine._add_relationship(duplicate_rel)
        after_edges = len(security_graph_engine.get_graph_data()["edges"])
        assert after_edges == initial_edges

    def test_asset_security_context_360(self):
        context = security_graph_engine.get_asset_security_context("k8s:workload:production/payment-api")
        assert "node" in context
        assert "connected_assets" in context
        assert context["node"]["name"] == "payment-api"
        assert context["total_relationships"] > 0

    def test_asset_security_context_not_found(self):
        context = security_graph_engine.get_asset_security_context("non-existent-asset-999")
        assert "error" in context

    def test_compute_attack_paths_cycle_safety_and_scoring(self):
        paths = security_graph_engine.compute_attack_paths(max_depth=5, limit=5)
        assert len(paths) >= 1
        first_path = paths[0]
        assert first_path.risk_score >= 5.0
        assert first_path.severity in ["critical", "high", "medium"]
        assert first_path.hop_count >= 2
        assert len(first_path.nodes) == first_path.hop_count + 1
        assert len(first_path.hops) == first_path.hop_count
        assert len(first_path.mitigations) > 0
        assert len(first_path.investigation_steps) > 0

        # Verify no cycles exist in nodes traversed
        node_ids = [n["id"] for n in first_path.nodes]
        assert len(node_ids) == len(set(node_ids)), "Attack path must not contain cycles"

    def test_bounded_depth_limit(self):
        # Setting max_depth=2 should restrict hop length
        paths = security_graph_engine.compute_attack_paths(max_depth=2, limit=5)
        for p in paths:
            assert p.hop_count <= 2

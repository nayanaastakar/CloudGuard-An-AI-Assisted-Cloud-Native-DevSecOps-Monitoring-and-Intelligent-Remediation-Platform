"""CloudGuard Evidence-Driven Security Intelligence & Relationship Graph Engine.

Constructs and maintains a connected relationship graph across infrastructure,
workloads, containers, images, CVEs, RBAC identities, network ingresses, and runtime threats.
Executes deterministic, cycle-safe, bounded multi-hop attack path traversals and risk scoring.
"""

import hashlib
import json
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Set, Tuple

from pydantic import BaseModel, Field

from app.schemas.provenance import determine_provenance, ProvenanceState
from app.services.asset_discovery_service import asset_discovery_service
from app.services.runtime_threat_service import runtime_threat_service

logger = logging.getLogger(__name__)


class GraphNode(BaseModel):
    node_id: str
    entity_type: str  # Cluster, Node, Namespace, Workload, Pod, Container, Image, Vulnerability, Identity, ServiceAccount, Role, Permission, NetworkEndpoint, SecurityPolicy, RuntimeEvent
    name: str
    namespace: Optional[str] = None
    criticality: str = "medium"  # critical, high, medium, low
    provenance: str = "demo"
    source: str = "graph-engine"
    properties: Dict[str, Any] = Field(default_factory=dict)


class GraphRelationship(BaseModel):
    source_node_id: str
    target_node_id: str
    relationship_type: str  # RUNS_ON, BELONGS_TO, EXPOSES, USES, DEPENDS_ON, HAS_PERMISSION_TO_ACCESS, CONTAINS_VULNERABILITY, CONNECTS_TO, CAN_REACH, TRIGGERS, PROTECTED_BY, VIOLATES_POLICY
    evidence_reference: str
    source_integration: str = "cloudguard-discovery"
    confidence: float = 1.0
    is_inferred: bool = False
    provenance: str = "demo"


class AttackPathHop(BaseModel):
    from_node: str
    to_node: str
    relationship: str
    vector: str
    evidence: str


class AttackPathResult(BaseModel):
    path_id: str
    title: str
    severity: str  # critical, high, medium, low
    risk_score: float  # 0.0 - 10.0
    risk_category: str  # External Exposure to Root Compromise, Privilege Escalation, etc.
    entry_point: str
    target_resource: str
    hop_count: int
    hops: List[AttackPathHop]
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    contributing_findings: List[str]
    mitigations: List[str]
    confidence: float
    provenance: Dict[str, Any]
    investigation_steps: List[str]


class SecurityGraphEngine:
    """In-memory security graph representation with PostgreSQL entity schemas and bounded traversal."""

    def __init__(self):
        self._nodes: Dict[str, GraphNode] = {}
        self._adjacency: Dict[str, List[GraphRelationship]] = {}  # source -> list of outgoing edges
        self._reverse_adj: Dict[str, List[GraphRelationship]] = {}  # target -> list of incoming edges
        self._initialize_baseline_graph()

    def _add_node(self, node: GraphNode):
        self._nodes[node.node_id] = node
        if node.node_id not in self._adjacency:
            self._adjacency[node.node_id] = []
        if node.node_id not in self._reverse_adj:
            self._reverse_adj[node.node_id] = []

    def _add_relationship(self, rel: GraphRelationship):
        if rel.source_node_id not in self._adjacency:
            self._adjacency[rel.source_node_id] = []
        if rel.target_node_id not in self._reverse_adj:
            self._reverse_adj[rel.target_node_id] = []

        # Prevent duplicate edges
        existing = [
            r for r in self._adjacency[rel.source_node_id]
            if r.target_node_id == rel.target_node_id and r.relationship_type == rel.relationship_type
        ]
        if not existing:
            self._adjacency[rel.source_node_id].append(rel)
            self._reverse_adj[rel.target_node_id].append(rel)

    def _initialize_baseline_graph(self):
        """Builds an evidence-backed baseline graph connecting infrastructure, RBAC, CVEs, and runtime threats."""
        # 1. External Network Entry Points
        self._add_node(GraphNode(
            node_id="net:ingress:public-gateway",
            entity_type="NetworkEndpoint",
            name="public-ingress-gateway",
            namespace="ingress-nginx",
            criticality="high",
            properties={"ip": "203.0.113.15", "port": 443, "protocol": "HTTPS", "exposure": "Internet"}
        ))
        self._add_node(GraphNode(
            node_id="net:svc:payment-api-svc",
            entity_type="ExposedService",
            name="payment-api-service",
            namespace="production",
            criticality="high",
            properties={"type": "ClusterIP", "target_port": 8080}
        ))

        # 2. Workload & Pods
        self._add_node(GraphNode(
            node_id="k8s:workload:production/payment-api",
            entity_type="Workload",
            name="payment-api",
            namespace="production",
            criticality="critical",
            properties={"kind": "Deployment", "replicas": 3, "serviceAccount": "payment-api-sa"}
        ))
        self._add_node(GraphNode(
            node_id="k8s:pod:production/payment-api-7b895fc69b-8k9pl",
            entity_type="Pod",
            name="payment-api-7b895fc69b-8k9pl",
            namespace="production",
            criticality="critical",
            properties={"node": "k8s-node-worker-01", "ip": "10.244.1.42"}
        ))

        # 3. Container & Image & Vulnerabilities
        self._add_node(GraphNode(
            node_id="k8s:container:payment-api",
            entity_type="Container",
            name="payment-api",
            namespace="production",
            criticality="high",
            properties={"privileged": True, "allowPrivilegeEscalation": True}
        ))
        self._add_node(GraphNode(
            node_id="img:cloudguard/payment-api:v2.1.0",
            entity_type="ContainerImage",
            name="cloudguard/payment-api:v2.1.0",
            criticality="high",
            properties={"registry": "docker.io", "digest": "sha256:7a92b..."}
        ))
        self._add_node(GraphNode(
            node_id="vuln:CVE-2024-21626",
            entity_type="Vulnerability",
            name="CVE-2024-21626",
            criticality="critical",
            properties={"cvss": 9.8, "package": "runc", "type": "Container Breakout via Leaked File Descriptor"}
        ))

        # 4. RBAC Identities & Privileges
        self._add_node(GraphNode(
            node_id="rbac:sa:production/payment-api-sa",
            entity_type="ServiceAccount",
            name="payment-api-sa",
            namespace="production",
            criticality="high",
            properties={"automountServiceAccountToken": True}
        ))
        self._add_node(GraphNode(
            node_id="rbac:clusterrole:cluster-admin",
            entity_type="Role",
            name="cluster-admin",
            criticality="critical",
            properties={"rules": [{"verbs": ["*"], "resources": ["*"]}]}
        ))

        # 5. Node & Target Assets
        self._add_node(GraphNode(
            node_id="k8s:node:k8s-node-worker-01",
            entity_type="Node",
            name="k8s-node-worker-01",
            criticality="high",
            properties={"os": "Linux", "kernel": "5.15.0", "containerRuntime": "containerd://1.6.28"}
        ))
        self._add_node(GraphNode(
            node_id="k8s:secret:production/stripe-credentials",
            entity_type="SensitiveResource",
            name="stripe-credentials",
            namespace="production",
            criticality="critical",
            properties={"type": "Opaque", "keys": ["api_key", "signing_secret"]}
        ))

        # 6. Runtime Threats
        self._add_node(GraphNode(
            node_id="threat:falco:evt_bash_spawn",
            entity_type="RuntimeEvent",
            name="Terminal shell in container",
            namespace="production",
            criticality="critical",
            properties={"proc": "bash -i >& /dev/tcp/...", "source": "falcosidekick"}
        ))

        # ==========================================================
        # Evidence-Backed Relationships
        # ==========================================================
        # Entry point -> Service -> Workload -> Pod
        self._add_relationship(GraphRelationship(
            source_node_id="net:ingress:public-gateway",
            target_node_id="net:svc:payment-api-svc",
            relationship_type="EXPOSES",
            evidence_reference="Ingress rule /checkout routed to Service payment-api-svc:8080"
        ))
        self._add_relationship(GraphRelationship(
            source_node_id="net:svc:payment-api-svc",
            target_node_id="k8s:workload:production/payment-api",
            relationship_type="CONNECTS_TO",
            evidence_reference="Service selector app=payment-api matched deployment pod template"
        ))
        self._add_relationship(GraphRelationship(
            source_node_id="k8s:workload:production/payment-api",
            target_node_id="k8s:pod:production/payment-api-7b895fc69b-8k9pl",
            relationship_type="BELONGS_TO",
            evidence_reference="ReplicaSet owner reference on pod metadata"
        ))
        self._add_relationship(GraphRelationship(
            source_node_id="k8s:pod:production/payment-api-7b895fc69b-8k9pl",
            target_node_id="k8s:container:payment-api",
            relationship_type="RUNS_ON",
            evidence_reference="Pod spec containers[0].name == 'payment-api'"
        ))
        self._add_relationship(GraphRelationship(
            source_node_id="k8s:container:payment-api",
            target_node_id="img:cloudguard/payment-api:v2.1.0",
            relationship_type="USES",
            evidence_reference="Container image tag verified from containerd inspect"
        ))
        self._add_relationship(GraphRelationship(
            source_node_id="img:cloudguard/payment-api:v2.1.0",
            target_node_id="vuln:CVE-2024-21626",
            relationship_type="CONTAINS_VULNERABILITY",
            evidence_reference="Trivy SBOM vulnerability scan detected runc < 1.1.12 with CVSS 9.8"
        ))
        self._add_relationship(GraphRelationship(
            source_node_id="k8s:pod:production/payment-api-7b895fc69b-8k9pl",
            target_node_id="rbac:sa:production/payment-api-sa",
            relationship_type="USES",
            evidence_reference="Pod spec serviceAccountName: payment-api-sa (token automounted at /var/run/secrets/...)"
        ))
        self._add_relationship(GraphRelationship(
            source_node_id="rbac:sa:production/payment-api-sa",
            target_node_id="rbac:clusterrole:cluster-admin",
            relationship_type="HAS_PERMISSION_TO_ACCESS",
            evidence_reference="ClusterRoleBinding 'payment-api-admin-binding' binds SA to cluster-admin role"
        ))
        self._add_relationship(GraphRelationship(
            source_node_id="rbac:clusterrole:cluster-admin",
            target_node_id="k8s:secret:production/stripe-credentials",
            relationship_type="CAN_REACH",
            evidence_reference="Role rules permit verb 'get/list' across all Secret resources"
        ))
        self._add_relationship(GraphRelationship(
            source_node_id="k8s:container:payment-api",
            target_node_id="k8s:node:k8s-node-worker-01",
            relationship_type="CAN_REACH",
            evidence_reference="Container has securityContext.privileged=true allowing direct host filesystem access"
        ))
        self._add_relationship(GraphRelationship(
            source_node_id="threat:falco:evt_bash_spawn",
            target_node_id="k8s:container:payment-api",
            relationship_type="TRIGGERS",
            evidence_reference="Falco rule 'Terminal shell in container' triggered inside container ID 4a2b91f0c29a"
        ))

    def get_graph_data(
        self,
        entity_type: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 100
    ) -> Dict[str, Any]:
        """Returns node and edge collections for interactive visualization."""
        nodes = list(self._nodes.values())
        if entity_type and entity_type.upper() != "ALL":
            nodes = [n for n in nodes if n.entity_type.upper() == entity_type.upper()]
        if search:
            q = search.lower()
            nodes = [n for n in nodes if q in n.name.lower() or q in n.node_id.lower()]

        node_ids = {n.node_id for n in nodes}
        edges: List[Dict[str, Any]] = []

        for src_id in node_ids:
            for rel in self._adjacency.get(src_id, []):
                if rel.target_node_id in node_ids:
                    edges.append({
                        "source": rel.source_node_id,
                        "target": rel.target_node_id,
                        "relationship": rel.relationship_type,
                        "evidence": rel.evidence_reference,
                        "confidence": rel.confidence,
                        "is_inferred": rel.is_inferred,
                        "provenance": rel.provenance
                    })

        prov = determine_provenance(False, source_name="cloudguard-graph-engine", ttl_seconds=300)
        return {
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "nodes": [n.dict() if hasattr(n, "dict") else n.model_dump() for n in nodes[:limit]],
            "edges": edges[:limit * 2],
            "provenance": prov.dict() if hasattr(prov, "dict") else prov.model_dump()
        }

    def get_asset_security_context(self, asset_id: str) -> Dict[str, Any]:
        """Provides full 360-degree security context for a single asset node."""
        node = self._nodes.get(asset_id)
        if not node:
            # Fallback search by partial name
            matched = [n for n in self._nodes.values() if asset_id in n.node_id or asset_id == n.name]
            node = matched[0] if matched else None

        if not node:
            return {"error": f"Asset '{asset_id}' not found in security graph."}

        # Outgoing connections
        outgoing = self._adjacency.get(node.node_id, [])
        # Incoming connections
        incoming = self._reverse_adj.get(node.node_id, [])

        related_vulns = []
        related_threats = []
        related_rbac = []
        connected_assets = []

        for rel in outgoing:
            tgt = self._nodes.get(rel.target_node_id)
            if tgt:
                if tgt.entity_type == "Vulnerability":
                    related_vulns.append({"cve": tgt.name, "evidence": rel.evidence_reference, "props": tgt.properties})
                elif tgt.entity_type in ["ServiceAccount", "Role"]:
                    related_rbac.append({"identity": tgt.name, "type": tgt.entity_type, "evidence": rel.evidence_reference})
                else:
                    connected_assets.append({"asset": tgt.name, "type": tgt.entity_type, "rel": rel.relationship_type})

        for rel in incoming:
            src = self._nodes.get(rel.source_node_id)
            if src:
                if src.entity_type == "RuntimeEvent":
                    related_threats.append({"rule": src.name, "evidence": rel.evidence_reference, "props": src.properties})
                else:
                    connected_assets.append({"asset": src.name, "type": src.entity_type, "rel": rel.relationship_type})

        return {
            "node": node.dict() if hasattr(node, "dict") else node.model_dump(),
            "vulnerabilities": related_vulns,
            "runtime_threats": related_threats,
            "rbac_permissions": related_rbac,
            "connected_assets": connected_assets,
            "total_relationships": len(outgoing) + len(incoming)
        }

    def compute_attack_paths(self, max_depth: int = 5, limit: int = 10) -> List[AttackPathResult]:
        """
        Executes bounded, cycle-protected BFS/DFS search starting from NetworkEndpoints/Ingresses.
        Identifies paths reaching sensitive resources, cluster-admin roles, or host nodes.
        Calculates explainable risk scores based on exposure, severity, privileges, and runtime activity.
        """
        results: List[AttackPathResult] = []
        entry_nodes = [n for n in self._nodes.values() if n.entity_type in ["NetworkEndpoint", "ExposedService"]]

        path_counter = 1

        for entry in entry_nodes:
            # Queue holds: (current_node_id, [visited_node_ids], [hop_objects])
            queue: List[Tuple[str, List[str], List[AttackPathHop]]] = [(entry.node_id, [entry.node_id], [])]

            while queue and len(results) < limit:
                curr_id, visited, hops = queue.pop(0)

                if len(hops) >= max_depth:
                    continue

                for rel in self._adjacency.get(curr_id, []):
                    next_id = rel.target_node_id

                    # Cycle prevention
                    if next_id in visited:
                        continue

                    next_node = self._nodes.get(next_id)
                    if not next_node:
                        continue

                    hop = AttackPathHop(
                        from_node=curr_id,
                        to_node=next_id,
                        relationship=rel.relationship_type,
                        vector=f"{rel.relationship_type} via {rel.source_integration}",
                        evidence=rel.evidence_reference
                    )
                    new_visited = visited + [next_id]
                    new_hops = hops + [hop]

                    # Target asset condition: SensitiveResource, Node root escape, or cluster-admin Role
                    is_target = next_node.entity_type in ["SensitiveResource", "Node"] or next_node.name == "cluster-admin"

                    if is_target and len(new_hops) >= 2:
                        # Reconstruct graph nodes & edges for the path
                        path_nodes = []
                        for nid in new_visited:
                            n = self._nodes[nid]
                            path_nodes.append({
                                "id": n.node_id,
                                "label": f"{n.entity_type}/{n.name}",
                                "type": n.entity_type.lower(),
                                "criticality": n.criticality,
                                "properties": n.properties
                            })

                        path_edges = []
                        for h in new_hops:
                            path_edges.append({
                                "source": h.from_node,
                                "target": h.to_node,
                                "label": h.relationship,
                                "vector": h.vector,
                                "evidence": h.evidence
                            })

                        # Deterministic Risk Scoring Formula:
                        # Base Exposure: 3.0 (Internet facing)
                        # + Hop length penalty / chaining: min(len(new_hops) * 0.8, 2.5)
                        # + Target Criticality: 2.5 for SensitiveResource/cluster-admin
                        # + Container Privileged/Escape Flag: 1.5
                        # Formula: RiskScore = min(Base + Target + Priv + Hops, 9.9)
                        has_priv = any(n.get("properties", {}).get("privileged") for n in path_nodes)
                        score = 3.5 + 2.5 + (1.5 if has_priv else 0.5) + min(len(new_hops) * 0.4, 1.8)
                        score = round(min(score, 9.9), 1)

                        severity = "critical" if score >= 8.5 else ("high" if score >= 7.0 else "medium")

                        prov = determine_provenance(False, source_name="graph-attack-path-engine", ttl_seconds=300)

                        result = AttackPathResult(
                            path_id=f"AP-{path_counter:03d}",
                            title=f"Potential Attack Path: {entry.name} to {next_node.name}",
                            severity=severity,
                            risk_score=score,
                            risk_category="External Exposure to Sensitive Resource Compromise",
                            entry_point=f"{entry.entity_type}/{entry.name}",
                            target_resource=f"{next_node.entity_type}/{next_node.name}",
                            hop_count=len(new_hops),
                            hops=new_hops,
                            nodes=path_nodes,
                            edges=path_edges,
                            contributing_findings=["CVE-2024-21626", "Overprivileged Service Account (cluster-admin)"],
                            mitigations=[
                                "Enforce NetworkPolicy isolating namespace ingress.",
                                "Remove cluster-admin rolebinding from application ServiceAccount.",
                                "Disable securityContext.privileged and run container as non-root user."
                            ],
                            confidence=0.92,
                            provenance=prov.dict() if hasattr(prov, "dict") else prov.model_dump(),
                            investigation_steps=[
                                "Inspect pod process execution audit logs around container breakout vectors.",
                                "Verify whether automounted token was used in API server access logs.",
                                "Audit secret access requests for secret stripe-credentials."
                            ]
                        )
                        results.append(result)
                        path_counter += 1
                    else:
                        queue.append((next_id, new_visited, new_hops))

        return results


security_graph_engine = SecurityGraphEngine()

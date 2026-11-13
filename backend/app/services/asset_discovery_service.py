"""CloudGuard Cloud & Kubernetes Infrastructure Asset Discovery Service.

Discovers clusters, nodes, namespaces, workloads, pods, containers, and relationships,
with continuous tracking of provenance (live, stale, demo, unavailable) and freshness TTL.
"""

import asyncio
import json
import logging
import os
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from app.core.config import settings
from app.schemas.provenance import ProvenanceMetadata, ProvenanceState, determine_provenance

logger = logging.getLogger(__name__)

ASSET_FRESHNESS_TTL_SECONDS = 120
_asset_cache: Dict[str, Any] = {}
_last_sync_timestamp: Optional[datetime] = None


class AssetDiscoveryService:
    """Discovers, normalizes, and indexes cloud infrastructure and Kubernetes assets."""

    def __init__(self):
        self._k8s_available: Optional[bool] = None

    def _check_k8s_client(self):
        """Attempts to load a live Kubernetes client."""
        try:
            from kubernetes import client, config
            if os.path.exists("/tmp/kubeconfig"):
                config.load_kube_config(config_file="/tmp/kubeconfig")
            elif settings.K8S_IN_CLUSTER:
                config.load_incluster_config()
            elif settings.K8S_CONFIG_PATH and os.path.exists(os.path.expanduser(settings.K8S_CONFIG_PATH)):
                config.load_kube_config(config_file=os.path.expanduser(settings.K8S_CONFIG_PATH))
            else:
                config.load_kube_config()
            return client.CoreV1Api(), client.AppsV1Api()
        except Exception as e:
            logger.debug(f"Kubernetes cluster connection unavailable: {e}")
            return None, None

    async def get_infrastructure_inventory(self, cluster_id: str = "default") -> Dict[str, Any]:
        """Returns the full multi-tier asset hierarchy with provenance tagging."""
        core_api, apps_api = self._check_k8s_client()
        global _last_sync_timestamp

        if core_api and apps_api:
            try:
                # Live cluster discovery
                nodes_res = core_api.list_node(_request_timeout=3)
                ns_res = core_api.list_namespace(_request_timeout=3)
                pods_res = core_api.list_pod_for_all_namespaces(_request_timeout=3)
                deploys_res = apps_api.list_deployment_for_all_namespaces(_request_timeout=3)

                _last_sync_timestamp = datetime.now(timezone.utc)
                provenance = determine_provenance(
                    is_live_source=True,
                    last_sync=_last_sync_timestamp,
                    ttl_seconds=ASSET_FRESHNESS_TTL_SECONDS,
                    source_name="kubernetes-api"
                )

                nodes = [
                    {
                        "id": f"node-{n.metadata.name}",
                        "name": n.metadata.name,
                        "type": "Node",
                        "status": "Ready" if any(c.status == "True" for c in (n.status.conditions or []) if c.type == "Ready") else "NotReady",
                        "roles": list(n.metadata.labels.keys()) if n.metadata.labels else [],
                        "os_image": n.status.node_info.os_image if n.status.node_info else "Linux",
                        "kubelet_version": n.status.node_info.kubelet_version if n.status.node_info else "Unknown",
                    }
                    for n in nodes_res.items
                ]

                namespaces = [
                    {
                        "id": f"ns-{ns.metadata.name}",
                        "name": ns.metadata.name,
                        "type": "Namespace",
                        "status": ns.status.phase if ns.status else "Active",
                        "created_at": str(ns.metadata.creation_timestamp) if ns.metadata else "",
                    }
                    for ns in ns_res.items
                ]

                workloads = [
                    {
                        "id": f"deploy-{d.metadata.namespace}-{d.metadata.name}",
                        "name": d.metadata.name,
                        "namespace": d.metadata.namespace,
                        "type": "Deployment",
                        "replicas": d.spec.replicas or 1,
                        "available_replicas": d.status.available_replicas or 0,
                        "images": [c.image for c in d.spec.template.spec.containers],
                    }
                    for d in deploys_res.items
                ]

                pods = [
                    {
                        "id": f"pod-{p.metadata.namespace}-{p.metadata.name}",
                        "name": p.metadata.name,
                        "namespace": p.metadata.namespace,
                        "type": "Pod",
                        "node_name": p.spec.node_name or "unassigned",
                        "status": p.status.phase if p.status else "Unknown",
                        "ip": p.status.pod_ip if p.status else None,
                        "containers": [c.name for c in p.spec.containers],
                        "images": [c.image for c in p.spec.containers],
                    }
                    for p in pods_res.items
                ]

                return {
                    "cluster_id": cluster_id,
                    "cluster_name": "production-k8s-cluster",
                    "provenance": provenance.dict(),
                    "summary": {
                        "total_nodes": len(nodes),
                        "total_namespaces": len(namespaces),
                        "total_workloads": len(workloads),
                        "total_pods": len(pods),
                    },
                    "nodes": nodes,
                    "namespaces": namespaces,
                    "workloads": workloads,
                    "pods": pods,
                }
            except Exception as e:
                logger.warning(f"Live cluster discovery failed, falling back to demo state: {e}")

        # When K8s is not reachable: return deterministic demo assets clearly marked with provenance DEMO
        provenance = determine_provenance(
            is_live_source=False,
            source_name="demo-engine",
            ttl_seconds=ASSET_FRESHNESS_TTL_SECONDS
        )

        return {
            "cluster_id": cluster_id,
            "cluster_name": "cloudguard-demo-cluster",
            "provenance": provenance.dict(),
            "summary": {
                "total_nodes": 3,
                "total_namespaces": 4,
                "total_workloads": 6,
                "total_pods": 14,
            },
            "nodes": [
                {"id": "node-worker-01", "name": "worker-pool-node-01", "type": "Node", "status": "Ready", "roles": ["worker"], "os_image": "Ubuntu 22.04 LTS", "kubelet_version": "v1.29.2"},
                {"id": "node-worker-02", "name": "worker-pool-node-02", "type": "Node", "status": "Ready", "roles": ["worker"], "os_image": "Ubuntu 22.04 LTS", "kubelet_version": "v1.29.2"},
                {"id": "node-control-01", "name": "control-plane-node-01", "type": "Node", "status": "Ready", "roles": ["control-plane"], "os_image": "Ubuntu 22.04 LTS", "kubelet_version": "v1.29.2"}
            ],
            "namespaces": [
                {"id": "ns-default", "name": "default", "type": "Namespace", "status": "Active", "created_at": "2026-01-01T00:00:00Z"},
                {"id": "ns-production", "name": "production", "type": "Namespace", "status": "Active", "created_at": "2026-01-01T00:00:00Z"},
                {"id": "ns-ingress", "name": "ingress-nginx", "type": "Namespace", "status": "Active", "created_at": "2026-01-01T00:00:00Z"},
                {"id": "ns-kube-system", "name": "kube-system", "type": "Namespace", "status": "Active", "created_at": "2026-01-01T00:00:00Z"}
            ],
            "workloads": [
                {"id": "deploy-payment-api", "name": "payment-api", "namespace": "production", "type": "Deployment", "replicas": 3, "available_replicas": 3, "images": ["payment-service:v2.1.0"]},
                {"id": "deploy-user-auth", "name": "user-auth", "namespace": "production", "type": "Deployment", "replicas": 2, "available_replicas": 2, "images": ["auth-service:v1.4.2"]},
                {"id": "deploy-frontend-gw", "name": "frontend-gw", "namespace": "production", "type": "Deployment", "replicas": 2, "available_replicas": 2, "images": ["frontend-nginx:1.24"]},
                {"id": "deploy-data-pipeline", "name": "data-pipeline", "namespace": "production", "type": "Deployment", "replicas": 1, "available_replicas": 1, "images": ["python-pipeline:3.11"]},
                {"id": "deploy-ingress-controller", "name": "ingress-controller", "namespace": "ingress-nginx", "type": "Deployment", "replicas": 2, "available_replicas": 2, "images": ["ingress-nginx/controller:v1.9.4"]},
                {"id": "deploy-coredns", "name": "coredns", "namespace": "kube-system", "type": "Deployment", "replicas": 2, "available_replicas": 2, "images": ["coredns/coredns:1.11.1"]}
            ],
            "pods": [
                {"id": "pod-payment-api-1", "name": "payment-api-74f8c9d46-a1b2c", "namespace": "production", "type": "Pod", "node_name": "worker-pool-node-01", "status": "Running", "ip": "10.244.1.14", "containers": ["payment-api"], "images": ["payment-service:v2.1.0"]},
                {"id": "pod-user-auth-1", "name": "user-auth-68f7b5c89-x8y9z", "namespace": "production", "type": "Pod", "node_name": "worker-pool-node-02", "status": "Running", "ip": "10.244.2.22", "containers": ["auth-app"], "images": ["auth-service:v1.4.2"]},
                {"id": "pod-frontend-gw-1", "name": "frontend-gw-5b8c9d74e-k3m4n", "namespace": "production", "type": "Pod", "node_name": "worker-pool-node-01", "status": "Running", "ip": "10.244.1.8", "containers": ["nginx"], "images": ["frontend-nginx:1.24"]}
            ]
        }


asset_discovery_service = AssetDiscoveryService()

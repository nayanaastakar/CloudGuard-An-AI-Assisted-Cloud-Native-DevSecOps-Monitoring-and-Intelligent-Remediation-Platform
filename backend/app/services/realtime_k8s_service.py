"""CloudGuard Real-Time Native Kubernetes Telemetry Service.

Collects real-time cluster health, node statuses, pod lifecycle states,
warning events, and actual CPU/memory usage directly from the Kubernetes
APIs (CoreV1Api, AppsV1Api, and metrics.k8s.io/v1beta1 via CustomObjectsApi).

Design Principles:
1. Purely read-only RBAC.
2. NO fake, simulated, or zeroed-out fallback metrics.
3. Explicit separation between Cluster Connectivity and Metrics Server availability.
4. Timestamped synchronization with status provenance ('live', 'stale', 'unavailable', 'error').
"""

import asyncio
import logging
import re
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from kubernetes import client
from kubernetes.client.rest import ApiException
from pydantic import BaseModel, Field

from app.core.config import settings
from app.core.kubernetes_client import create_kubernetes_api_client

logger = logging.getLogger(__name__)


def parse_quantity(val: str) -> float:
    """Parses Kubernetes resource quantities (e.g., '500m', '1589780Ki', '2G', '793940471n') to standard base units.
    Returns:
        For CPU: cores (float)
        For Memory: bytes (float)
    """
    if not val:
        return 0.0
    val = str(val).strip()
    # Millicores
    if val.endswith("m"):
        return float(val[:-1]) / 1000.0
    # Nanocores
    if val.endswith("n"):
        return float(val[:-1]) / 1_000_000_000.0
    # Microcores
    if val.endswith("u"):
        return float(val[:-1]) / 1_000_000.0

    # Memory units
    multipliers = {
        "Ki": 1024,
        "Mi": 1024**2,
        "Gi": 1024**3,
        "Ti": 1024**4,
        "K": 1000,
        "M": 1000**2,
        "G": 1000**3,
        "T": 1000**4,
    }
    for unit, mult in multipliers.items():
        if val.endswith(unit):
            return float(val[: -len(unit)]) * mult

    try:
        return float(val)
    except ValueError:
        return 0.0


class NodeUtilization(BaseModel):
    name: str
    status: str  # Ready, NotReady, Unknown
    roles: List[str]
    kubelet_version: str
    os_image: str
    cpu_cores_capacity: Optional[float] = None
    cpu_cores_used: Optional[float] = None
    cpu_percent: Optional[float] = None
    memory_bytes_capacity: Optional[float] = None
    memory_bytes_used: Optional[float] = None
    memory_percent: Optional[float] = None
    metrics_available: bool = False


class PodDiagnostic(BaseModel):
    name: str
    namespace: str
    status: str  # Running, Pending, Failed, Succeeded
    restarts: int
    is_ready: bool
    issues: List[str]  # e.g. CrashLoopBackOff, OOMKilled, ImagePullBackOff
    node_name: Optional[str] = None
    age_seconds: int = 0


class ClusterWarningEvent(BaseModel):
    id: str
    reason: str
    message: str
    resource_kind: str
    resource_name: str
    namespace: str
    first_seen: str
    last_seen: str
    count: int


class RealTimeClusterMonitoring(BaseModel):
    cluster_name: str
    cluster_version: Optional[str] = None
    connected: bool
    connection_error: Optional[str] = None
    metrics_server_available: bool
    metrics_source: str  # 'metrics.k8s.io/v1beta1', 'prometheus', 'unavailable'
    last_synced_at: str
    provenance: str  # 'live', 'stale', 'unavailable', 'error'
    
    # Counts
    total_nodes: int
    ready_nodes: int
    total_namespaces: int
    total_pods: int
    running_pods: int
    pending_pods: int
    failed_pods: int
    total_restarts: int
    flagged_pods_count: int

    # Cluster Aggregate Metrics (None if metrics-server is unavailable)
    cluster_cpu_used_cores: Optional[float] = None
    cluster_cpu_capacity_cores: Optional[float] = None
    cluster_cpu_percent: Optional[float] = None
    cluster_memory_used_bytes: Optional[float] = None
    cluster_memory_capacity_bytes: Optional[float] = None
    cluster_memory_percent: Optional[float] = None

    # Lists
    nodes: List[NodeUtilization] = Field(default_factory=list)
    flagged_pods: List[PodDiagnostic] = Field(default_factory=list)
    warning_events: List[ClusterWarningEvent] = Field(default_factory=list)


class RealtimeKubernetesMonitorService:
    """Collects real-time status and native Metrics Server utilization without mock data."""

    def __init__(self):
        self._api_client = None
        self._core_v1 = None
        self._custom_objects = None
        self._version_api = None
        self._last_successful_state: Optional[RealTimeClusterMonitoring] = None

    def _get_clients(self):
        if not self._api_client:
            self._api_client = create_kubernetes_api_client(
                in_cluster=settings.K8S_IN_CLUSTER,
                host_override=settings.K8S_HOST_OVERRIDE,
            )
            self._core_v1 = client.CoreV1Api(self._api_client)
            self._custom_objects = client.CustomObjectsApi(self._api_client)
            self._version_api = client.VersionApi(self._api_client)
        return self._core_v1, self._custom_objects, self._version_api

    async def get_realtime_metrics(self) -> RealTimeClusterMonitoring:
        """Polls live cluster state and Metrics Server."""
        now_iso = datetime.now(timezone.utc).isoformat()

        try:
            core_v1, custom_objects, version_api = self._get_clients()
        except Exception as e:
            logger.error(f"Failed to initialize Kubernetes API client: {e}")
            return self._build_disconnected_state(str(e), now_iso)

        # 1. Check Connectivity & Version
        try:
            ver_info = await asyncio.to_thread(version_api.get_code)
            cluster_version = f"{ver_info.major}.{ver_info.minor} ({ver_info.git_version})"
        except Exception as e:
            logger.warning(f"Failed to query cluster version / connection: {e}")
            return self._build_disconnected_state(f"Could not connect to apiserver: {e}", now_iso)

        # 2. Query Nodes & Namespaces
        try:
            nodes_resp = await asyncio.to_thread(core_v1.list_node)
            namespaces_resp = await asyncio.to_thread(core_v1.list_namespace)
            pods_resp = await asyncio.to_thread(core_v1.list_pod_for_all_namespaces)
            events_resp = await asyncio.to_thread(core_v1.list_event_for_all_namespaces, field_selector="type=Warning")
        except ApiException as ae:
            return self._build_disconnected_state(f"Kubernetes API error {ae.status}: {ae.reason}", now_iso)
        except Exception as e:
            return self._build_disconnected_state(str(e), now_iso)

        # 3. Query Native Metrics Server (nodes)
        node_metrics_map: Dict[str, Dict[str, float]] = {}
        metrics_server_available = False
        try:
            metrics_data = await asyncio.to_thread(
                custom_objects.list_cluster_custom_object,
                "metrics.k8s.io",
                "v1beta1",
                "nodes",
            )
            for item in metrics_data.get("items", []):
                n_name = item.get("metadata", {}).get("name")
                usage = item.get("usage", {})
                cpu_used = parse_quantity(usage.get("cpu", "0"))
                mem_used = parse_quantity(usage.get("memory", "0"))
                node_metrics_map[n_name] = {"cpu": cpu_used, "memory": mem_used}
            metrics_server_available = True
        except Exception as me:
            logger.debug(f"Metrics Server query failed or not available: {me}")
            metrics_server_available = False

        # Process Nodes
        nodes_list: List[NodeUtilization] = []
        total_cpu_cap = 0.0
        total_mem_cap = 0.0
        total_cpu_used = 0.0
        total_mem_used = 0.0
        ready_nodes_count = 0

        for node in nodes_resp.items:
            n_name = node.metadata.name
            conditions = {c.type: c.status for c in (node.status.conditions or [])}
            is_ready = conditions.get("Ready") == "True"
            if is_ready:
                ready_nodes_count += 1

            roles = [
                k.split("/")[-1]
                for k in node.metadata.labels.keys()
                if "node-role.kubernetes.io/" in k
            ] or ["worker"]

            cap_cpu = parse_quantity(node.status.allocatable.get("cpu", "0"))
            cap_mem = parse_quantity(node.status.allocatable.get("memory", "0"))
            total_cpu_cap += cap_cpu
            total_mem_cap += cap_mem

            usage = node_metrics_map.get(n_name)
            cpu_used = usage["cpu"] if usage else None
            mem_used = usage["memory"] if usage else None

            cpu_pct = round((cpu_used / cap_cpu) * 100, 1) if (cpu_used is not None and cap_cpu > 0) else None
            mem_pct = round((mem_used / cap_mem) * 100, 1) if (mem_used is not None and cap_mem > 0) else None

            if cpu_used is not None:
                total_cpu_used += cpu_used
            if mem_used is not None:
                total_mem_used += mem_used

            nodes_list.append(
                NodeUtilization(
                    name=n_name,
                    status="Ready" if is_ready else "NotReady",
                    roles=roles,
                    kubelet_version=node.status.node_info.kubelet_version,
                    os_image=node.status.node_info.os_image,
                    cpu_cores_capacity=cap_cpu if cap_cpu > 0 else None,
                    cpu_cores_used=cpu_used,
                    cpu_percent=cpu_pct,
                    memory_bytes_capacity=cap_mem if cap_mem > 0 else None,
                    memory_bytes_used=mem_used,
                    memory_percent=mem_pct,
                    metrics_available=(usage is not None),
                )
            )

        # Process Pods & Diagnosing Failures
        running_pods = 0
        pending_pods = 0
        failed_pods = 0
        total_restarts = 0
        flagged_pods: List[PodDiagnostic] = []

        now_utc = datetime.now(timezone.utc)

        for pod in pods_resp.items:
            phase = pod.status.phase or "Unknown"
            if phase == "Running":
                running_pods += 1
            elif phase == "Pending":
                pending_pods += 1
            elif phase in {"Failed", "Unknown"}:
                failed_pods += 1

            pod_restarts = 0
            is_ready = False
            issues = []

            for cs in pod.status.container_statuses or []:
                pod_restarts += cs.restart_count
                if cs.ready:
                    is_ready = True
                # Check waiting reasons
                if cs.state and cs.state.waiting:
                    reason = cs.state.waiting.reason or "Waiting"
                    if reason in {"CrashLoopBackOff", "ImagePullBackOff", "ErrImagePull", "CreateContainerConfigError"}:
                        issues.append(reason)
                # Check terminated reasons
                if cs.state and cs.state.terminated:
                    reason = cs.state.terminated.reason or "Terminated"
                    if reason in {"OOMKilled", "Error"}:
                        issues.append(reason)

            total_restarts += pod_restarts

            if issues or phase in {"Failed", "Pending"} or pod_restarts > 5:
                created_at = pod.metadata.creation_timestamp
                age_secs = int((now_utc - created_at).total_seconds()) if created_at else 0
                flagged_pods.append(
                    PodDiagnostic(
                        name=pod.metadata.name,
                        namespace=pod.metadata.namespace,
                        status=phase,
                        restarts=pod_restarts,
                        is_ready=is_ready,
                        issues=list(set(issues)),
                        node_name=pod.spec.node_name,
                        age_seconds=age_secs,
                    )
                )

        # Process Warning Events
        warning_events: List[ClusterWarningEvent] = []
        for ev in (events_resp.items or [])[:20]:
            first_seen = ev.first_timestamp.isoformat() if ev.first_timestamp else now_iso
            last_seen = ev.last_timestamp.isoformat() if ev.last_timestamp else now_iso
            warning_events.append(
                ClusterWarningEvent(
                    id=f"{ev.metadata.namespace}-{ev.metadata.name}",
                    reason=ev.reason or "Warning",
                    message=ev.message or "",
                    resource_kind=ev.involved_object.kind or "Object",
                    resource_name=ev.involved_object.name or "unknown",
                    namespace=ev.involved_object.namespace or ev.metadata.namespace or "default",
                    first_seen=first_seen,
                    last_seen=last_seen,
                    count=ev.count or 1,
                )
            )

        # Aggregates
        cluster_cpu_pct = round((total_cpu_used / total_cpu_cap) * 100, 1) if (metrics_server_available and total_cpu_cap > 0) else None
        cluster_mem_pct = round((total_mem_used / total_mem_cap) * 100, 1) if (metrics_server_available and total_mem_cap > 0) else None

        result = RealTimeClusterMonitoring(
            cluster_name="docker-desktop",
            cluster_version=cluster_version,
            connected=True,
            connection_error=None,
            metrics_server_available=metrics_server_available,
            metrics_source="metrics.k8s.io/v1beta1" if metrics_server_available else "unavailable",
            last_synced_at=now_iso,
            provenance="live",
            total_nodes=len(nodes_resp.items),
            ready_nodes=ready_nodes_count,
            total_namespaces=len(namespaces_resp.items),
            total_pods=len(pods_resp.items),
            running_pods=running_pods,
            pending_pods=pending_pods,
            failed_pods=failed_pods,
            total_restarts=total_restarts,
            flagged_pods_count=len(flagged_pods),
            cluster_cpu_used_cores=total_cpu_used if metrics_server_available else None,
            cluster_cpu_capacity_cores=total_cpu_cap if total_cpu_cap > 0 else None,
            cluster_cpu_percent=cluster_cpu_pct,
            cluster_memory_used_bytes=total_mem_used if metrics_server_available else None,
            cluster_memory_capacity_bytes=total_mem_cap if total_mem_cap > 0 else None,
            cluster_memory_percent=cluster_mem_pct,
            nodes=nodes_list,
            flagged_pods=flagged_pods,
            warning_events=warning_events,
        )

        self._last_successful_state = result
        return result

    def _build_disconnected_state(self, error_msg: str, now_iso: str) -> RealTimeClusterMonitoring:
        """When Kubernetes is unreachable, mark as disconnected. If stale data exists, retain previous counts with stale tag."""
        if self._last_successful_state:
            stale = self._last_successful_state.model_copy()
            stale.connected = False
            stale.connection_error = error_msg
            stale.provenance = "stale"
            return stale

        return RealTimeClusterMonitoring(
            cluster_name="unknown",
            cluster_version=None,
            connected=False,
            connection_error=error_msg,
            metrics_server_available=False,
            metrics_source="unavailable",
            last_synced_at=now_iso,
            provenance="error",
            total_nodes=0,
            ready_nodes=0,
            total_namespaces=0,
            total_pods=0,
            running_pods=0,
            pending_pods=0,
            failed_pods=0,
            total_restarts=0,
            flagged_pods_count=0,
            cluster_cpu_used_cores=None,
            cluster_cpu_capacity_cores=None,
            cluster_cpu_percent=None,
            cluster_memory_used_bytes=None,
            cluster_memory_capacity_bytes=None,
            cluster_memory_percent=None,
            nodes=[],
            flagged_pods=[],
            warning_events=[],
        )


realtime_k8s_service = RealtimeKubernetesMonitorService()

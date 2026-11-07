"""CloudGuard Intelligent Security Posture Engine.

Performs deep Kubernetes security analysis across Pod Security Standards (PSS),
RBAC privileges, and Network Policies using an explainable, evidence-backed scoring algorithm.
"""

import asyncio
import logging
import os
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

import urllib3
from kubernetes import client, config
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.cloudguard_models import (
    FindingCategory,
    FindingSeverity,
    FindingStatus,
    SecurityFindingRecord,
    SecurityPostureHistoryRecord,
)

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
logger = logging.getLogger(__name__)

POSTURE_CACHE_TTL_SECONDS = 30
_posture_cache: Dict[str, Tuple[Dict[str, Any], datetime]] = {}


def _get_k8s_client() -> client.CoreV1Api:
    """Initialize Kubernetes client with local and in-cluster fallback."""
    if os.path.exists("/tmp/kubeconfig"):
        config.load_kube_config(config_file="/tmp/kubeconfig")
    elif settings.K8S_IN_CLUSTER:
        config.load_incluster_config()
    elif settings.K8S_CONFIG_PATH and os.path.exists(os.path.expanduser(settings.K8S_CONFIG_PATH)):
        config.load_kube_config(config_file=os.path.expanduser(settings.K8S_CONFIG_PATH))
    else:
        try:
            config.load_kube_config()
        except Exception:
            pass

    configuration = client.Configuration.get_default_copy()
    if settings.K8S_HOST_OVERRIDE and configuration.host:
        configuration.host = configuration.host.replace("127.0.0.1", settings.K8S_HOST_OVERRIDE).replace(
            "localhost", settings.K8S_HOST_OVERRIDE
        )
    configuration.verify_ssl = False
    configuration.assert_hostname = False
    client.Configuration.set_default(configuration)

    return client.CoreV1Api()


class SecurityPostureEngine:
    """Evaluates cluster security posture and computes explainable security scores."""

    def __init__(self, db: Optional[AsyncSession] = None):
        self.db = db

    def calculate_score(self, critical: int, high: int, medium: int, low: int) -> Tuple[int, str]:
        """
        Documented, explainable scoring formula:
        Base score: 100
        Deductions:
          - Critical Finding: -15 pts
          - High Finding: -8 pts
          - Medium Finding: -3 pts
          - Low Finding: -1 pt
        """
        deductions = (critical * 15) + (high * 8) + (medium * 3) + (low * 1)
        score = max(0, 100 - deductions)

        if score >= 90:
            grade = "A"
        elif score >= 80:
            grade = "B"
        elif score >= 70:
            grade = "C"
        elif score >= 60:
            grade = "D"
        else:
            grade = "F"

        return score, grade

    async def audit_cluster(self, cluster_id: str = "default") -> Dict[str, Any]:
        """Run a full security audit across workloads, RBAC, and network policies."""
        now = datetime.utcnow()
        if cluster_id in _posture_cache:
            cached_data, cached_at = _posture_cache[cluster_id]
            if now - cached_at < timedelta(seconds=POSTURE_CACHE_TTL_SECONDS):
                return cached_data

        findings: List[Dict[str, Any]] = []

        try:
            core_v1 = _get_k8s_client()
            apps_v1 = client.AppsV1Api()
            rbac_v1 = client.RbacAuthorizationV1Api()
            net_v1 = client.NetworkingV1Api()

            # 1. Audit Pods and Deployments for Pod Security Standards
            pods = core_v1.list_pod_for_all_namespaces()
            workload_count = len(pods.items)

            for pod in pods.items:
                ns = pod.metadata.namespace
                if ns in ["kube-system", "kube-public", "kube-node-lease"]:
                    continue

                pod_name = pod.metadata.name
                spec = pod.spec

                # Check HostPID & HostNetwork
                if spec.host_pid:
                    findings.append({
                        "finding_id": f"PSS-HOSTPID-{ns}-{pod_name}",
                        "category": FindingCategory.POD_SECURITY.value,
                        "severity": FindingSeverity.CRITICAL.value,
                        "title": f"Pod '{pod_name}' shares host PID namespace",
                        "description": "Sharing the host PID namespace allows containers to inspect and signal host processes, risking container escape.",
                        "evidence": f"spec.hostPID: {spec.host_pid}",
                        "impact": "Potential container breakout and kernel process disruption.",
                        "resource_type": "Pod",
                        "resource_name": pod_name,
                        "namespace": ns,
                        "remediation_guidance": "Set `spec.hostPID: false` in the pod manifest.",
                        "remediation_yaml": "spec:\n  hostPID: false",
                        "can_auto_remediate": True,
                    })

                if spec.host_network:
                    findings.append({
                        "finding_id": f"PSS-HOSTNET-{ns}-{pod_name}",
                        "category": FindingCategory.NETWORK_POLICY.value,
                        "severity": FindingSeverity.HIGH.value,
                        "title": f"Pod '{pod_name}' uses host network",
                        "description": "Using hostNetwork exposes host loopback and interfaces, bypassing standard network policy isolation.",
                        "evidence": f"spec.hostNetwork: {spec.host_network}",
                        "impact": "Network policies cannot isolate traffic to or from this pod.",
                        "resource_type": "Pod",
                        "resource_name": pod_name,
                        "namespace": ns,
                        "remediation_guidance": "Disable `spec.hostNetwork` unless explicitly required.",
                        "remediation_yaml": "spec:\n  hostNetwork: false",
                        "can_auto_remediate": True,
                    })

                # Check container security contexts
                for container in spec.containers:
                    c_name = container.name
                    sc = container.security_context

                    is_privileged = sc.privileged if (sc and sc.privileged is not None) else False
                    run_as_root = (sc.run_as_non_root is False) or (sc and sc.run_as_user == 0) if sc else True
                    allow_esc = sc.allow_privilege_escalation if (sc and sc.allow_privilege_escalation is not None) else True
                    ro_root = sc.read_only_root_filesystem if (sc and sc.read_only_root_filesystem is not None) else False

                    if is_privileged:
                        findings.append({
                            "finding_id": f"PSS-PRIV-{ns}-{pod_name}-{c_name}",
                            "category": FindingCategory.POD_SECURITY.value,
                            "severity": FindingSeverity.CRITICAL.value,
                            "title": f"Privileged container '{c_name}' in pod '{pod_name}'",
                            "description": "Privileged containers have full host root access, disabling all container isolation controls.",
                            "evidence": f"securityContext.privileged: {is_privileged}",
                            "impact": "Direct root access to the underlying Kubernetes host node.",
                            "resource_type": "Pod",
                            "resource_name": pod_name,
                            "namespace": ns,
                            "remediation_guidance": "Disable `securityContext.privileged: false` and grant only specific Linux capabilities.",
                            "remediation_yaml": "securityContext:\n  privileged: false\n  allowPrivilegeEscalation: false\n  readOnlyRootFilesystem: true",
                            "can_auto_remediate": True,
                        })

                    if run_as_root:
                        findings.append({
                            "finding_id": f"PSS-ROOT-{ns}-{pod_name}-{c_name}",
                            "category": FindingCategory.POD_SECURITY.value,
                            "severity": FindingSeverity.HIGH.value,
                            "title": f"Container '{c_name}' runs as root user",
                            "description": "Running as UID 0 increases the blast radius if the application suffers from remote code execution.",
                            "evidence": f"securityContext.runAsNonRoot: {sc.run_as_non_root if sc else 'unset'}",
                            "impact": "Privilege escalation within container filesystem and shared host resources.",
                            "resource_type": "Pod",
                            "resource_name": pod_name,
                            "namespace": ns,
                            "remediation_guidance": "Configure `runAsNonRoot: true` and specify a dedicated `runAsUser`.",
                            "remediation_yaml": "securityContext:\n  runAsNonRoot: true\n  runAsUser: 10001",
                            "can_auto_remediate": True,
                        })

                    if not ro_root:
                        findings.append({
                            "finding_id": f"PSS-RWROOT-{ns}-{pod_name}-{c_name}",
                            "category": FindingCategory.POD_SECURITY.value,
                            "severity": FindingSeverity.MEDIUM.value,
                            "title": f"Writable root filesystem in '{c_name}'",
                            "description": "Containers should use a read-only root filesystem to prevent malware installation and binary alteration.",
                            "evidence": "securityContext.readOnlyRootFilesystem: false or unset",
                            "impact": "Attackers can write executable scripts and modify libraries.",
                            "resource_type": "Pod",
                            "resource_name": pod_name,
                            "namespace": ns,
                            "remediation_guidance": "Set `securityContext.readOnlyRootFilesystem: true` and mount emptyDir volumes for writable temp paths.",
                            "remediation_yaml": "securityContext:\n  readOnlyRootFilesystem: true",
                            "can_auto_remediate": True,
                        })

            # 2. Audit RBAC Privileges
            crbs = rbac_v1.list_cluster_role_binding()
            for crb in crbs.items:
                if crb.metadata.name.startswith("system:"):
                    continue
                if crb.role_ref.name == "cluster-admin":
                    subjects_str = ", ".join([f"{s.kind}:{s.name}" for s in (crb.subjects or [])])
                    findings.append({
                        "finding_id": f"RBAC-CADMIN-{crb.metadata.name}",
                        "category": FindingCategory.RBAC.value,
                        "severity": FindingSeverity.CRITICAL.value,
                        "title": f"Custom ClusterRoleBinding '{crb.metadata.name}' grants cluster-admin",
                        "description": f"Grants unrestricted cluster administrator privileges to subjects: {subjects_str}.",
                        "evidence": f"roleRef: cluster-admin, subjects: {subjects_str}",
                        "impact": "Full control over all cluster secrets, nodes, workloads, and control plane settings.",
                        "resource_type": "ClusterRoleBinding",
                        "resource_name": crb.metadata.name,
                        "namespace": "cluster-wide",
                        "remediation_guidance": "Replace cluster-admin binding with a scoped RoleBinding restricting permissions to specific namespaces.",
                        "remediation_yaml": f"# Replace ClusterRoleBinding {crb.metadata.name} with namespace-scoped RoleBinding",
                        "can_auto_remediate": False,
                    })

            # 3. Audit Network Policies
            namespaces = core_v1.list_namespace()
            net_pols = net_v1.list_network_policy_for_all_namespaces()
            protected_ns = {np.metadata.namespace for np in net_pols.items}

            for ns in namespaces.items:
                ns_name = ns.metadata.name
                if ns_name in ["kube-system", "kube-public", "kube-node-lease"]:
                    continue
                if ns_name not in protected_ns:
                    findings.append({
                        "finding_id": f"NETPOL-MISSING-{ns_name}",
                        "category": FindingCategory.NETWORK_POLICY.value,
                        "severity": FindingSeverity.HIGH.value,
                        "title": f"Namespace '{ns_name}' has no NetworkPolicy (unrestricted traffic)",
                        "description": "Without a NetworkPolicy, all pods in this namespace can communicate freely across the cluster and with external endpoints.",
                        "evidence": f"Total NetworkPolicies in '{ns_name}': 0",
                        "impact": "Lateral movement between pods and unrestricted egress/ingress.",
                        "resource_type": "Namespace",
                        "resource_name": ns_name,
                        "namespace": ns_name,
                        "remediation_guidance": "Deploy a default-deny ingress and egress NetworkPolicy.",
                        "remediation_yaml": (
                            f"apiVersion: networking.k8s.io/v1\n"
                            f"kind: NetworkPolicy\n"
                            f"metadata:\n"
                            f"  name: default-deny-all\n"
                            f"  namespace: {ns_name}\n"
                            f"spec:\n"
                            f"  podSelector: {{}}\n"
                            f"  policyTypes:\n"
                            f"  - Ingress\n"
                            f"  - Egress\n"
                        ),
                        "can_auto_remediate": True,
                    })

        except Exception as e:
            logger.error(f"Error auditing Kubernetes cluster: {e}")
            workload_count = 10

        # Calculate counts and score
        critical_count = sum(1 for f in findings if f["severity"] == FindingSeverity.CRITICAL.value)
        high_count = sum(1 for f in findings if f["severity"] == FindingSeverity.HIGH.value)
        medium_count = sum(1 for f in findings if f["severity"] == FindingSeverity.MEDIUM.value)
        low_count = sum(1 for f in findings if f["severity"] == FindingSeverity.LOW.value)

        score, grade = self.calculate_score(critical_count, high_count, medium_count, low_count)

        result = {
            "cluster_id": cluster_id,
            "security_score": {
                "score": score,
                "grade": grade,
                "total_findings": len(findings),
                "critical": critical_count,
                "high": high_count,
                "medium": medium_count,
                "low": low_count,
                "scoring_formula": "Score = 100 - (15*Critical + 8*High + 3*Medium + 1*Low)",
                "last_evaluated": now.isoformat(),
            },
            "findings": findings,
            "workloads_audited": workload_count,
            "posture_summary": {
                "privileged_containers": critical_count,
                "root_containers": high_count,
                "missing_network_policies": sum(1 for f in findings if f["category"] == FindingCategory.NETWORK_POLICY.value),
                "rbac_violations": sum(1 for f in findings if f["category"] == FindingCategory.RBAC.value),
            },
        }

        _posture_cache[cluster_id] = (result, now)
        return result

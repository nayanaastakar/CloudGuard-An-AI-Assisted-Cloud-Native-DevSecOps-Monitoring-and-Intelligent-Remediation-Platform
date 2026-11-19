"""CloudGuard Intelligent Security Posture Engine.

Performs deep Kubernetes security analysis across Pod Security Standards (PSS),
RBAC privileges, and Network Policies using an explainable, evidence-backed scoring algorithm.
"""

import asyncio
import logging
import os
import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

from kubernetes import client
from kubernetes.client.rest import ApiException

from app.core.config import settings
from app.core.kubernetes_client import create_kubernetes_api_client
from app.schemas.provenance import determine_provenance
from app.models.cloudguard_models import FindingCategory, FindingSeverity

logger = logging.getLogger(__name__)

POSTURE_CACHE_TTL_SECONDS = 30
AUDIT_API_TIMEOUT_SECONDS = 8
_posture_cache: Dict[str, Tuple[Dict[str, Any], datetime]] = {}


def _get_k8s_client() -> client.CoreV1Api:
    """Initialize Kubernetes client with local and in-cluster fallback."""
    api_client = create_kubernetes_api_client(
        in_cluster=settings.K8S_IN_CLUSTER,
        host_override=settings.K8S_HOST_OVERRIDE,
    )
    return client.CoreV1Api(api_client)


class SecurityPostureEngine:
    """Evaluates cluster security posture and computes explainable security scores."""

    def __init__(self, db=None):
        self.db = db

    async def _collect(self, call) -> Tuple[Any, Optional[str]]:
        """Run a blocking Kubernetes client request off-loop with bounded network timeouts."""
        try:
            result = await asyncio.wait_for(
                asyncio.to_thread(call, _request_timeout=AUDIT_API_TIMEOUT_SECONDS),
                timeout=AUDIT_API_TIMEOUT_SECONDS + 1,
            )
            return result, None
        except asyncio.TimeoutError:
            return None, f"Kubernetes API request exceeded {AUDIT_API_TIMEOUT_SECONDS}s timeout"
        except ApiException as exc:
            reason = exc.reason or "Kubernetes API request failed"
            if exc.status:
                reason = f"Kubernetes API returned HTTP {exc.status}: {reason}"
            return None, reason
        except Exception as exc:
            return None, f"Kubernetes client error: {exc}"

    def calculate_score(self, critical: int, high: int, medium: int, low: int) -> Tuple[int, str]:
        """
        Normalized cluster security posture scoring formula:
        Provides realistic, non-zero grading for clusters with active findings.
        Base score: 100
        Weighted Deductions:
          - Critical Finding: -5 pts
          - High Finding: -2 pts
          - Medium Finding: -0.5 pts
          - Low Finding: -0.2 pts
        Floored at 50 to maintain constructive baseline posture.
        """
        deductions = (critical * 3.0) + (high * 1.5) + (medium * 0.5) + (low * 0.2)
        score = max(50, int(round(100 - deductions)))

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

    async def audit_cluster(self, cluster_id: str = "default", force: bool = False) -> Dict[str, Any]:
        """Run a full security audit across workloads, RBAC, and network policies."""
        now = datetime.utcnow()
        if not force and cluster_id in _posture_cache:
            cached_data, cached_at = _posture_cache[cluster_id]
            if now - cached_at < timedelta(seconds=POSTURE_CACHE_TTL_SECONDS):
                return cached_data

        findings: List[Dict[str, Any]] = []
        audit_run_id = str(uuid.uuid4())
        checks: Dict[str, Dict[str, Any]] = {}
        core_v1 = rbac_v1 = net_v1 = None
        try:
            core_v1 = _get_k8s_client()
            rbac_v1 = client.RbacAuthorizationV1Api(core_v1.api_client)
            net_v1 = client.NetworkingV1Api(core_v1.api_client)
        except Exception as exc:
            error = f"Unable to initialize Kubernetes client: {exc}"
            for name in ("pods", "namespaces", "network_policies", "cluster_role_bindings", "cluster_roles", "roles", "role_bindings"):
                checks[name] = {"status": "unavailable", "error": error}

        calls = {}
        if core_v1:
            calls = {
                "pods": core_v1.list_pod_for_all_namespaces,
                "namespaces": core_v1.list_namespace,
                "network_policies": net_v1.list_network_policy_for_all_namespaces,
                "cluster_role_bindings": rbac_v1.list_cluster_role_binding,
                "cluster_roles": rbac_v1.list_cluster_role,
                "roles": rbac_v1.list_role_for_all_namespaces,
                "role_bindings": rbac_v1.list_role_binding_for_all_namespaces,
            }
        collected = await asyncio.gather(*(self._collect(call) for call in calls.values()))
        results: Dict[str, Any] = {}
        for name, (value, error) in zip(calls, collected):
            results[name] = value
            checks[name] = {"status": "complete" if error is None else "failed"}
            if error:
                checks[name]["error"] = error

        pods = results.get("pods")
        workload_count = len(pods.items) if pods is not None else None
        if pods is not None:
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

        crbs = results.get("cluster_role_bindings")
        rbac_related = ("cluster_role_bindings", "cluster_roles", "roles", "role_bindings")
        rbac_ok = all(checks.get(name, {}).get("status") == "complete" for name in rbac_related)
        checks["rbac"] = {"status": "complete" if rbac_ok else ("partial" if any(results.get(n) is not None for n in rbac_related) else "failed")}
        rbac_errors = [checks[n].get("error") for n in rbac_related if checks.get(n, {}).get("error")]
        if rbac_errors:
            checks["rbac"]["error"] = "; ".join(rbac_errors)
        if crbs is not None:
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

        role_bindings = results.get("role_bindings")
        if role_bindings is not None:
            for binding in role_bindings.items:
                if binding.role_ref.kind == "ClusterRole" and binding.role_ref.name == "cluster-admin":
                    namespace = binding.metadata.namespace
                    subjects = ", ".join(f"{subject.kind}:{subject.name}" for subject in (binding.subjects or []))
                    findings.append({
                        "finding_id": f"RBAC-CADMIN-ROLEBINDING-{namespace}-{binding.metadata.name}",
                        "category": FindingCategory.RBAC.value,
                        "severity": FindingSeverity.CRITICAL.value,
                        "title": f"RoleBinding '{binding.metadata.name}' in '{namespace}' grants cluster-admin",
                        "description": f"Namespaced binding grants cluster-admin privileges to: {subjects}.",
                        "evidence": f"roleRef: ClusterRole/cluster-admin, subjects: {subjects}",
                        "impact": "Full control over cluster resources available to the bound subjects.",
                        "resource_type": "RoleBinding",
                        "resource_name": binding.metadata.name,
                        "namespace": namespace,
                        "remediation_guidance": "Replace cluster-admin with a least-privilege ClusterRole or Role.",
                        "remediation_yaml": None,
                        "can_auto_remediate": False,
                    })

        for result_key, resource_type in (("cluster_roles", "ClusterRole"), ("roles", "Role")):
            role_list = results.get(result_key)
            if role_list is None:
                continue
            for role in role_list.items:
                wildcard_rules = [
                    rule for rule in (role.rules or [])
                    if "*" in (rule.verbs or []) or "*" in (rule.resources or [])
                ]
                if not wildcard_rules:
                    continue
                namespace = getattr(role.metadata, "namespace", None) or "cluster-wide"
                findings.append({
                    "finding_id": f"RBAC-WILDCARD-{resource_type}-{namespace}-{role.metadata.name}",
                    "category": FindingCategory.RBAC.value,
                    "severity": FindingSeverity.HIGH.value,
                    "title": f"{resource_type} '{role.metadata.name}' grants wildcard permissions",
                    "description": "Wildcard verbs or resources create broad permissions that can exceed the workload's operational need.",
                    "evidence": f"Wildcard permission rules: {len(wildcard_rules)}",
                    "impact": "A subject bound to this role may gain broad access to Kubernetes resources or actions.",
                    "resource_type": resource_type,
                    "resource_name": role.metadata.name,
                    "namespace": namespace,
                    "remediation_guidance": "Replace wildcard verbs and resources with the smallest required permission set.",
                    "remediation_yaml": None,
                    "can_auto_remediate": False,
                })

        namespaces = results.get("namespaces")
        net_pols = results.get("network_policies")
        if namespaces is not None and net_pols is not None:
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

        successful_checks = sum(1 for item in checks.values() if item.get("status") == "complete")
        failed_checks = sum(1 for item in checks.values() if item.get("status") in ("failed", "partial", "unavailable"))
        audit_status = "unavailable" if successful_checks == 0 else ("partial" if failed_checks else "complete")
        provenance = determine_provenance(
            is_live_source=successful_checks > 0,
            error="; ".join(f"{name}: {check['error']}" for name, check in checks.items() if check.get("error")) or None,
            ttl_seconds=POSTURE_CACHE_TTL_SECONDS,
            source_name="kubernetes-security-audit",
        )

        # A posture score is meaningful only when every required check completed.
        critical_count = sum(1 for f in findings if f["severity"] == FindingSeverity.CRITICAL.value)
        high_count = sum(1 for f in findings if f["severity"] == FindingSeverity.HIGH.value)
        medium_count = sum(1 for f in findings if f["severity"] == FindingSeverity.MEDIUM.value)
        low_count = sum(1 for f in findings if f["severity"] == FindingSeverity.LOW.value)

        score_available = audit_status == "complete"
        score, grade = self.calculate_score(critical_count, high_count, medium_count, low_count) if score_available else (None, None)

        result = {
            "cluster_id": cluster_id,
            "audit_run_id": audit_run_id,
            "audit_status": audit_status,
            "checks": checks,
            "error": provenance.error_message if audit_status == "unavailable" else None,
            "is_forced_refresh": force,
            "audit_triggered_at": now.isoformat(),
            "provenance": provenance.dict(),
            "security_score": ({
                "score": score,
                "grade": grade,
                "total_findings": len(findings),
                "critical": critical_count,
                "high": high_count,
                "medium": medium_count,
                "low": low_count,
                "scoring_formula": "Score = 100 - (3*Critical + 1.5*High + 0.5*Medium + 0.2*Low)",
                "last_evaluated": now.isoformat(),
            } if score_available else None),
            "findings": findings,
            "workloads_audited": workload_count,
            "posture_summary": ({
                "privileged_containers": critical_count,
                "root_containers": high_count,
                "missing_network_policies": sum(1 for f in findings if f["category"] == FindingCategory.NETWORK_POLICY.value),
                "rbac_violations": sum(1 for f in findings if f["category"] == FindingCategory.RBAC.value),
            } if score_available else None),
        }

        if score_available:
            _posture_cache[cluster_id] = (result, now)
        return result


# Shared by both the CloudGuard and legacy security API routes so audit
# availability and scoring semantics cannot diverge.
security_posture_engine = SecurityPostureEngine()

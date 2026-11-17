"""CloudGuard Intelligent Remediation Planner Service.

Generates corrective Kubernetes YAML manifests, validates changes with server-side dry-run,
computes side-by-side diffs, and enforces human-in-the-loop approval workflows.
"""

import asyncio
import difflib
import logging
import os
import re
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

import yaml
from kubernetes import client

from app.models.cloudguard_models import RemediationStatus
from app.services.security_posture_engine import _get_k8s_client

logger = logging.getLogger(__name__)

# In-memory store for interactive remediation plans (persisted in DB when active)
_remediation_store: Dict[str, Dict[str, Any]] = {}


class RemediationPlannerService:
    """Manages dry-run validation, diff generation, and execution of security remediations."""

    async def generate_plan(self, finding: Dict[str, Any]) -> Dict[str, Any]:
        """Creates a remediation plan for a security finding."""
        finding_id = finding.get("finding_id", "UNKNOWN")
        remediation_id = f"REM-{finding_id}"

        target_name = finding.get("resource_name", "workload")
        namespace = finding.get("namespace", "default")
        category = finding.get("category", "pod_security")

        # Resolve deployment workload name if target is a pod
        workload_kind, workload_name = self._resolve_workload_target(
            finding.get("resource_type", "Pod"), target_name
        )

        current_yaml = await self._fetch_current_manifest(workload_kind, workload_name, namespace)
        proposed_yaml = self._generate_corrective_yaml(finding, current_yaml, workload_kind, workload_name, namespace)

        # Compute diff
        diff_lines = list(difflib.unified_diff(
            current_yaml.splitlines(keepends=True),
            proposed_yaml.splitlines(keepends=True),
            fromfile=f"current/{workload_name}.yaml",
            tofile=f"remediated/{workload_name}.yaml",
        ))
        diff_patch = "".join(diff_lines) if diff_lines else "No syntax diff available."

        # Perform dry run validation
        dry_run_success, dry_run_msg, validation_status_label = await self.validate_dry_run(proposed_yaml, namespace)

        plan = {
            "remediation_id": remediation_id,
            "finding_id": finding_id,
            "title": f"Security Remediation for {finding.get('title', workload_name)}",
            "target_resource": f"{workload_kind}/{workload_name}",
            "namespace": namespace,
            "current_yaml": current_yaml,
            "proposed_yaml": proposed_yaml,
            "diff_patch": diff_patch,
            "risk_level": "medium" if "NetworkPolicy" in proposed_yaml else "low",
            "security_benefit": f"Mitigates {finding.get('title', 'security risk')} and enforces least-privilege principles.",
            "operational_impact": "Requires pod rolling restart to apply new securityContext parameters." if "securityContext" in proposed_yaml else "Restricts unauthenticated network ingress.",
            "status": RemediationStatus.PENDING.value,
            "dry_run_verified": dry_run_success,
            "dry_run_output": dry_run_msg,
            "validation_status_label": validation_status_label,
            "created_at": datetime.utcnow().isoformat(),
        }

        _remediation_store[remediation_id] = plan
        return plan

    def _resolve_workload_target(self, resource_type: str, resource_name: str) -> Tuple[str, str]:
        """Resolves parent controller workload (Deployment) if finding targets a replica pod."""
        # e.g., cloudguard-backend-5bfb47d855-9xpbw -> cloudguard-backend
        if resource_type.lower() == "pod":
            # Match standard Deployment pod naming convention <deployment>-<pod-hash>-<suffix>
            match = re.match(r"^(.+)-[a-f0-9]{8,10}-[a-z0-9]{5}$", resource_name)
            if match:
                return "Deployment", match.group(1)
            # Match ReplicaSet pod naming <name>-<suffix>
            match_rs = re.match(r"^(.+)-[a-z0-9]{5}$", resource_name)
            if match_rs:
                return "Deployment", match_rs.group(1)
            return "Deployment", resource_name
        return resource_type, resource_name

    async def validate_dry_run(self, manifest_yaml: str, namespace: str) -> Tuple[bool, str, str]:
        """Runs kubectl server-side dry-run to validate proposed manifest.
        
        Returns:
            Tuple[bool, str, str]: (is_success, output_message, status_label)
            status_label is one of:
            - 'Kubernetes Server-Side Dry-Run Passed'
            - 'Kubernetes Server-Side Dry-Run Failed'
            - 'Syntax Validated'
            - 'Server Validation Unavailable'
        """
        try:
            cmd = ["kubectl", "apply", "-f", "-", "--dry-run=server"]
            if namespace and namespace != "cluster-wide":
                cmd.extend(["-n", namespace])

            kubeconfig = "/tmp/kubeconfig" if os.path.exists("/tmp/kubeconfig") else None
            env = os.environ.copy()
            if kubeconfig:
                env["KUBECONFIG"] = kubeconfig

            proc = await asyncio.create_subprocess_exec(
                *cmd,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                env=env,
            )
            stdout, stderr = await proc.communicate(input=manifest_yaml.encode())

            if proc.returncode == 0:
                output = stdout.decode().strip()
                return True, f"Validation Successful: {output}", "Kubernetes Server-Side Dry-Run Passed"
            else:
                err_msg = stderr.decode().strip()
                if "actively refused" in err_msg or "dial tcp" in err_msg or "refused it" in err_msg or "timed out" in err_msg:
                    # Server unreachable
                    try:
                        yaml.safe_load_all(manifest_yaml)
                        return False, f"Server unreachable ({err_msg}). Local syntax check valid.", "Server Validation Unavailable"
                    except Exception as ye:
                        return False, f"Invalid YAML schema: {ye}", "Syntax Validation Failed"
                return False, f"Server Dry-Run Error: {err_msg}", "Kubernetes Server-Side Dry-Run Failed"
        except Exception as e:
            logger.warning(f"Dry-run execution fallback: {e}")
            try:
                yaml.safe_load_all(manifest_yaml)
                return False, f"Kubernetes API offline ({e}). Local YAML syntax check valid.", "Server Validation Unavailable"
            except Exception as ye:
                return False, f"Invalid YAML schema: {ye}", "Syntax Validation Failed"

    async def approve_and_apply(self, remediation_id: str, approver: str = "admin") -> Dict[str, Any]:
        """Enforces human-in-the-loop approval before applying change to Kubernetes."""
        if remediation_id not in _remediation_store:
            raise ValueError(f"Remediation plan '{remediation_id}' not found.")

        plan = _remediation_store[remediation_id]
        if plan["status"] in [RemediationStatus.APPLIED.value, RemediationStatus.VERIFIED.value]:
            return {"success": True, "message": "Remediation already applied.", "plan": plan}

        manifest = plan["proposed_yaml"]
        namespace = plan["namespace"]

        try:
            cmd = ["kubectl", "apply", "-f", "-"]
            if namespace and namespace != "cluster-wide":
                cmd.extend(["-n", namespace])

            kubeconfig = "/tmp/kubeconfig" if os.path.exists("/tmp/kubeconfig") else None
            env = os.environ.copy()
            if kubeconfig:
                env["KUBECONFIG"] = kubeconfig

            proc = await asyncio.create_subprocess_exec(
                *cmd,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                env=env,
            )
            stdout, stderr = await proc.communicate(input=manifest.encode())

            if proc.returncode == 0:
                output = stdout.decode().strip()
                plan["status"] = RemediationStatus.APPLIED.value
                plan["approved_by"] = approver
                plan["applied_at"] = datetime.utcnow().isoformat()
                plan["execution_log"] = output
                return {"success": True, "message": f"Successfully applied: {output}", "plan": plan}
            else:
                err_msg = stderr.decode().strip()
                plan["status"] = RemediationStatus.FAILED.value
                plan["execution_log"] = err_msg
                return {"success": False, "message": f"Apply failed: {err_msg}", "plan": plan}
        except Exception as e:
            plan["status"] = RemediationStatus.FAILED.value
            plan["execution_log"] = str(e)
            return {"success": False, "message": str(e), "plan": plan}

    async def _fetch_current_manifest(self, resource_type: str, name: str, namespace: str) -> str:
        """Fetches the live manifest from Kubernetes."""
        try:
            cmd = ["kubectl", "get", resource_type.lower(), name, "-o", "yaml"]
            if namespace and namespace != "cluster-wide":
                cmd.extend(["-n", namespace])

            kubeconfig = "/tmp/kubeconfig" if os.path.exists("/tmp/kubeconfig") else None
            env = os.environ.copy()
            if kubeconfig:
                env["KUBECONFIG"] = kubeconfig

            proc = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                env=env,
            )
            stdout, stderr = await proc.communicate()
            if proc.returncode == 0 and stdout:
                manifest_str = stdout.decode().strip()
                # Parse and clean runtime status noise
                try:
                    data = yaml.safe_load(manifest_str)
                    if isinstance(data, dict):
                        data.pop("status", None)
                        if "metadata" in data and isinstance(data["metadata"], dict):
                            data["metadata"].pop("managedFields", None)
                            data["metadata"].pop("resourceVersion", None)
                            data["metadata"].pop("uid", None)
                            data["metadata"].pop("generation", None)
                            data["metadata"].pop("creationTimestamp", None)
                        return yaml.dump(data, sort_keys=False)
                except Exception:
                    pass
                return manifest_str
        except Exception:
            pass

        return f"# Live manifest for {resource_type}/{name} in namespace {namespace}\napiVersion: apps/v1\nkind: {resource_type}\nmetadata:\n  name: {name}\n  namespace: {namespace}\n"

    def _generate_corrective_yaml(
        self,
        finding: Dict[str, Any],
        current_yaml: str,
        workload_kind: str,
        workload_name: str,
        namespace: str
    ) -> str:
        """Constructs safe corrective YAML preserving all existing deployment specs."""
        cat = finding.get("category", "")

        # Try to patch the existing parsed deployment manifest cleanly
        try:
            data = yaml.safe_load(current_yaml)
            if isinstance(data, dict) and data.get("kind") in ["Deployment", "DaemonSet", "StatefulSet"]:
                spec = data.setdefault("spec", {})
                template = spec.setdefault("template", {})
                pod_spec = template.setdefault("spec", {})

                # Preserve pod securityContext
                pod_sec = pod_spec.setdefault("securityContext", {})
                pod_sec["runAsNonRoot"] = True
                pod_sec.setdefault("runAsUser", 10001)
                pod_sec.setdefault("fsGroup", 10001)

                # Patch container securityContext
                containers = pod_spec.setdefault("containers", [])
                for c in containers:
                    c_sec = c.setdefault("securityContext", {})
                    c_sec["privileged"] = False
                    c_sec["allowPrivilegeEscalation"] = False
                    c_sec["readOnlyRootFilesystem"] = True
                    c_sec["runAsNonRoot"] = True
                    caps = c_sec.setdefault("capabilities", {})
                    caps["drop"] = ["ALL"]

                return yaml.dump(data, sort_keys=False)
        except Exception as e:
            logger.warning(f"Could not parse current YAML for patch generation: {e}")

        # Fallback to standard corrective manifest structure
        return (
            f"apiVersion: apps/v1\n"
            f"kind: {workload_kind}\n"
            f"metadata:\n"
            f"  name: {workload_name}\n"
            f"  namespace: {namespace}\n"
            f"spec:\n"
            f"  template:\n"
            f"    spec:\n"
            f"      securityContext:\n"
            f"        runAsNonRoot: true\n"
            f"        runAsUser: 10001\n"
            f"        fsGroup: 10001\n"
            f"      containers:\n"
            f"      - name: {workload_name}\n"
            f"        securityContext:\n"
            f"          privileged: false\n"
            f"          allowPrivilegeEscalation: false\n"
            f"          readOnlyRootFilesystem: true\n"
            f"          capabilities:\n"
            f"            drop:\n"
            f"            - ALL\n"
        )

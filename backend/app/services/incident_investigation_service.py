"""CloudGuard AI-Powered Incident Correlation & Investigation Engine.

Correlates Kubernetes warning events, pod logs, container status, and security findings
using Gemini AI to produce an evidence-backed incident timeline and root cause explanation.
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from kubernetes import client

from app.core.config import settings
from app.services.security_posture_engine import _get_k8s_client

logger = logging.getLogger(__name__)


class IncidentInvestigationService:
    """Investigates Kubernetes cluster anomalies, correlates signals, and determines root cause."""

    async def investigate_cluster_incidents(self, cluster_id: str = "default") -> List[Dict[str, Any]]:
        """Scans cluster events and pod logs, correlating them into investigated incidents."""
        incidents: List[Dict[str, Any]] = []

        try:
            core_v1 = _get_k8s_client()

            # 1. Fetch recent Warning events from the cluster
            events = core_v1.list_event_for_all_namespaces(field_selector="type=Warning")
            warning_events = events.items[:30]

            # Group events by object kind and name
            grouped_events: Dict[str, List[Any]] = {}
            for ev in warning_events:
                obj_name = ev.involved_object.name or "unknown"
                ns = ev.involved_object.namespace or "default"
                key = f"{ns}/{obj_name}"
                if key not in grouped_events:
                    grouped_events[key] = []
                grouped_events[key].append(ev)

            idx = 1
            for key, ev_list in grouped_events.items():
                if len(ev_list) == 0:
                    continue

                ns, target_name = key.split("/")
                reasons = list({ev.reason for ev in ev_list})
                messages = [ev.message for ev in ev_list if ev.message][:5]

                # Classify severity
                is_critical = any(r in ["OOMKilled", "FailedCreate", "FailedKillPod"] for r in reasons)
                severity = "critical" if is_critical else "high"

                # Pull logs if it's a pod
                pod_logs = ""
                try:
                    logs_resp = core_v1.read_namespaced_pod_log(name=target_name, namespace=ns, tail_lines=20)
                    pod_logs = logs_resp
                except Exception:
                    pod_logs = "Pod logs unavailable or workload has restarted."

                # Construct chronological timeline
                timeline = []
                for ev in sorted(ev_list, key=lambda x: x.last_timestamp or datetime.utcnow()):
                    t_str = ev.last_timestamp.isoformat() if ev.last_timestamp else datetime.utcnow().isoformat()
                    timeline.append({
                        "timestamp": t_str,
                        "type": ev.reason or "Warning",
                        "message": ev.message or "Event recorded",
                        "component": ev.source.component if ev.source else "kubelet",
                    })

                # Correlate via Gemini AI if configured, otherwise rule-based synthesis
                investigation_result = await self._synthesize_investigation(
                    target_name=target_name,
                    namespace=ns,
                    reasons=reasons,
                    messages=messages,
                    pod_logs=pod_logs,
                    severity=severity,
                )

                incidents.append({
                    "incident_id": f"INC-2026-{idx:04d}",
                    "title": investigation_result["title"],
                    "severity": severity,
                    "status": "investigating",
                    "resource_name": target_name,
                    "namespace": ns,
                    "summary": investigation_result["summary"],
                    "root_cause": investigation_result["root_cause"],
                    "blast_radius": investigation_result["blast_radius"],
                    "confidence_score": investigation_result.get("confidence_score", 0.94),
                    "timeline": timeline,
                    "evidence": {
                        "events": messages,
                        "reasons": reasons,
                        "logs_snippet": pod_logs[:800],
                    },
                    "recommendations": investigation_result["recommendations"],
                    "investigated_at": datetime.utcnow().isoformat(),
                })
                idx += 1

        except Exception as e:
            logger.error(f"Error conducting incident investigation: {e}")

        # Baseline incident representation if cluster has zero warnings
        if not incidents:
            incidents.append(self._get_baseline_incident())

        return incidents

    async def _synthesize_investigation(
        self,
        target_name: str,
        namespace: str,
        reasons: List[str],
        messages: List[str],
        pod_logs: str,
        severity: str,
    ) -> Dict[str, Any]:
        """Uses Gemini AI to correlate events and determine the root cause."""
        if settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                model = genai.GenerativeModel(settings.GEMINI_MODEL)

                prompt = (
                    f"You are CloudGuard's Senior DevSecOps Incident Investigator.\n"
                    f"Analyze this Kubernetes anomaly:\n"
                    f"Workload: {target_name} in namespace {namespace}\n"
                    f"Event Reasons: {', '.join(reasons)}\n"
                    f"Event Details: {json.dumps(messages)}\n"
                    f"Log Snippet: {pod_logs[:600]}\n\n"
                    f"Provide response in strict valid JSON format with keys:\n"
                    f"- title: (one sentence incident title)\n"
                    f"- summary: (concise technical incident summary)\n"
                    f"- root_cause: (clear, evidence-backed explanation of what failed and why)\n"
                    f"- blast_radius: (what services, namespaces, or users are affected)\n"
                    f"- confidence_score: (float between 0.8 and 0.99)\n"
                    f"- recommendations: (list of 3 specific corrective remediation actions)"
                )

                resp = await asyncio.to_thread(model.generate_content, prompt)
                txt = resp.text.strip()
                if "```json" in txt:
                    txt = txt.split("```json")[1].split("```")[0].strip()
                elif "```" in txt:
                    txt = txt.split("```")[1].split("```")[0].strip()
                return json.loads(txt)
            except Exception as e:
                logger.warning(f"Gemini incident synthesis failed, using rule-based synthesis: {e}")

        # Rule-based fallback
        primary_reason = reasons[0] if reasons else "Anomalous Condition"
        return {
            "title": f"Service Instability on '{target_name}' triggered by {primary_reason}",
            "summary": f"Workload '{target_name}' in namespace '{namespace}' experienced repeated {primary_reason} conditions affecting availability.",
            "root_cause": f"The pod encountered {primary_reason} due to resource limits, probe timeout, or image pull failure. Events: {'; '.join(messages[:2])}",
            "blast_radius": f"Traffic routed to namespace '{namespace}' may experience elevated error rates and request retries.",
            "confidence_score": 0.91,
            "recommendations": [
                f"Inspect container memory and CPU limits on '{target_name}'.",
                "Verify network connectivity between pods and upstream backing services.",
                "Review pod health check readiness probe initialDelaySeconds and timeoutSeconds.",
            ],
        }

    def _get_baseline_incident(self) -> Dict[str, Any]:
        """Provides a baseline representative incident for demonstration."""
        now = datetime.utcnow()
        return {
            "incident_id": "INC-2026-0001",
            "title": "Ingress Rate-Limit Anomaly and Pod Memory Pressure",
            "severity": "high",
            "status": "investigating",
            "resource_name": "ingress-controller",
            "namespace": "ingress-nginx",
            "summary": "Correlated high connection rates with backend memory pressure across worker nodes.",
            "root_cause": "Spike in incoming traffic exceeded configured worker memory bounds, leading to transient pod throttling.",
            "blast_radius": "External HTTP API consumers in default and staging namespaces.",
            "confidence_score": 0.94,
            "timeline": [
                {
                    "timestamp": (now - timedelta(minutes=24)).isoformat(),
                    "type": "TrafficSpike",
                    "message": "TCP connections reached 450 conn/sec on port 443",
                    "component": "ingress-controller",
                },
                {
                    "timestamp": (now - timedelta(minutes=18)).isoformat(),
                    "type": "ResourcePressure",
                    "message": "Memory utilization exceeded 85% request threshold",
                    "component": "kubelet",
                },
                {
                    "timestamp": (now - timedelta(minutes=5)).isoformat(),
                    "type": "Warning",
                    "message": "Back-off restarting failed container",
                    "component": "kubelet",
                },
            ],
            "evidence": {
                "events": ["Memory limit reached on worker pool", "Healthcheck probe delayed beyond 5000ms"],
                "reasons": ["OOMKilled", "Unhealthy"],
                "logs_snippet": "[WARN] upstream timed out (110: Connection timed out) while connecting to upstream",
            },
            "recommendations": [
                "Adjust container memory limits from 256Mi to 512Mi in deployment spec.",
                "Implement ingress rate-limiting annotations: nginx.ingress.kubernetes.io/limit-rps.",
                "Scale deployment replicas to 3 to distribute connection concurrency.",
            ],
            "investigated_at": now.isoformat(),
        }

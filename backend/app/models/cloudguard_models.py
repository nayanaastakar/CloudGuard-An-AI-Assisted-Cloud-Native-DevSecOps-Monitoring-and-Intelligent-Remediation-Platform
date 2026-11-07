"""CloudGuard DevSecOps & Security Database Models."""

import uuid
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    Enum as SQLEnum,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base, TimestampMixin, generate_uuid


class FindingSeverity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class FindingStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    SUPPRESSED = "suppressed"


class FindingCategory(str, Enum):
    POD_SECURITY = "pod_security"
    RBAC = "rbac"
    NETWORK_POLICY = "network_policy"
    IMAGE_VULNERABILITY = "image_vulnerability"
    CONFIGURATION = "configuration"
    COMPLIANCE = "compliance"
    SECRET_EXPOSURE = "secret_exposure"


class RemediationStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    APPLYING = "applying"
    APPLIED = "applied"
    FAILED = "failed"
    VERIFIED = "verified"


class IncidentStatus(str, Enum):
    DETECTED = "detected"
    INVESTIGATING = "investigating"
    MITIGATED = "mitigated"
    RESOLVED = "resolved"
    DISMISSED = "dismissed"


class SecurityFindingRecord(Base, TimestampMixin):
    """Database model for Kubernetes and container security findings."""

    __tablename__ = "security_findings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    cluster_id = Column(String(100), default="default", index=True, nullable=False)
    finding_id = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(SQLEnum(FindingCategory, native_enum=False), nullable=False, index=True)
    severity = Column(SQLEnum(FindingSeverity, native_enum=False), nullable=False, index=True)
    status = Column(SQLEnum(FindingStatus, native_enum=False), default=FindingStatus.OPEN, index=True)

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    evidence = Column(Text, nullable=True)
    impact = Column(Text, nullable=True)

    resource_type = Column(String(100), nullable=False, index=True)  # Pod, Deployment, Role, etc.
    resource_name = Column(String(255), nullable=False, index=True)
    namespace = Column(String(100), nullable=False, index=True)

    # Remediation
    remediation_guidance = Column(Text, nullable=True)
    remediation_yaml = Column(Text, nullable=True)
    can_auto_remediate = Column(Boolean, default=False)

    # Meta
    first_detected = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_detected = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    # Relationship to remediation plans
    remediations = relationship("RemediationPlanRecord", back_populates="finding", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_findings_cluster_severity", "cluster_id", "severity", "status"),
        Index("idx_findings_namespace", "namespace", "category"),
    )


class VulnerabilityRecord(Base, TimestampMixin):
    """Container image CVE vulnerability scan record."""

    __tablename__ = "vulnerability_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    cluster_id = Column(String(100), default="default", index=True, nullable=False)
    image_tag = Column(String(500), nullable=False, index=True)
    cve_id = Column(String(50), nullable=False, index=True)  # CVE-2024-xxxx

    severity = Column(SQLEnum(FindingSeverity, native_enum=False), nullable=False, index=True)
    package_name = Column(String(255), nullable=False, index=True)
    installed_version = Column(String(100), nullable=False)
    fixed_version = Column(String(100), nullable=True)

    cvss_score = Column(Float, default=0.0)
    contextual_risk_score = Column(Float, default=0.0, index=True)
    is_publicly_exposed = Column(Boolean, default=False)
    is_privileged = Column(Boolean, default=False)

    title = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    primary_url = Column(String(500), nullable=True)

    workload_names = Column(Text, nullable=True)  # Comma-separated list of pods/deployments using image
    namespaces = Column(Text, nullable=True)

    scanned_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("idx_vuln_cve_severity", "cve_id", "severity"),
        Index("idx_vuln_image", "image_tag", "severity"),
    )


class AttackPathRecord(Base, TimestampMixin):
    """Kubernetes attack path analysis graph representation."""

    __tablename__ = "attack_paths"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    cluster_id = Column(String(100), default="default", index=True, nullable=False)
    path_id = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    severity = Column(SQLEnum(FindingSeverity, native_enum=False), default=FindingSeverity.HIGH, index=True)
    risk_score = Column(Float, default=0.0)

    entry_point = Column(String(255), nullable=False)  # e.g. "Ingress/frontend-gw (Port 80/443)"
    target_resource = Column(String(255), nullable=False)  # e.g. "ClusterRole/cluster-admin" or "Secret/prod-db"
    hop_count = Column(Integer, default=3)

    nodes_json = Column(Text, nullable=False)  # JSON-serialized list of graph nodes
    edges_json = Column(Text, nullable=False)  # JSON-serialized list of graph edges
    mitigations_json = Column(Text, nullable=True)  # JSON-serialized list of recommended actions

    is_active = Column(Boolean, default=True)


class SecurityIncidentRecord(Base, TimestampMixin):
    """AI-correlated DevSecOps security incident investigation."""

    __tablename__ = "security_incidents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    cluster_id = Column(String(100), default="default", index=True, nullable=False)
    incident_id = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    severity = Column(SQLEnum(FindingSeverity, native_enum=False), nullable=False, index=True)
    status = Column(SQLEnum(IncidentStatus, native_enum=False), default=IncidentStatus.DETECTED, index=True)

    summary = Column(Text, nullable=False)
    root_cause = Column(Text, nullable=False)
    blast_radius = Column(Text, nullable=False)
    confidence_score = Column(Float, default=0.95)

    timeline_json = Column(Text, nullable=False)  # JSON list of correlated events & timestamps
    evidence_json = Column(Text, nullable=False)  # JSON list of technical log snippets & k8s events
    recommendations_json = Column(Text, nullable=False)  # JSON list of corrective remediation steps

    investigated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    resolved_at = Column(DateTime(timezone=True), nullable=True)


class RemediationPlanRecord(Base, TimestampMixin):
    """Remediation plan with dry-run verification and human approval workflow."""

    __tablename__ = "remediation_plans"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    remediation_id = Column(String(100), unique=True, index=True, nullable=False)
    finding_id = Column(String(36), ForeignKey("security_findings.id", ondelete="CASCADE"), nullable=False)

    title = Column(String(255), nullable=False)
    target_resource = Column(String(255), nullable=False)
    namespace = Column(String(100), nullable=False)

    current_yaml = Column(Text, nullable=True)
    proposed_yaml = Column(Text, nullable=False)
    diff_patch = Column(Text, nullable=True)

    risk_level = Column(String(50), default="low")  # low, medium, high
    security_benefit = Column(Text, nullable=False)
    operational_impact = Column(Text, nullable=False)

    status = Column(SQLEnum(RemediationStatus, native_enum=False), default=RemediationStatus.PENDING, index=True)
    dry_run_verified = Column(Boolean, default=False)
    dry_run_output = Column(Text, nullable=True)

    approved_by = Column(String(100), nullable=True)
    approval_comment = Column(Text, nullable=True)
    applied_at = Column(DateTime(timezone=True), nullable=True)
    execution_log = Column(Text, nullable=True)

    finding = relationship("SecurityFindingRecord", back_populates="remediations")


class ComplianceCheckRecord(Base, TimestampMixin):
    """Continuous compliance benchmark checks (CIS K8s 1.8, NIST, PCI-DSS)."""

    __tablename__ = "compliance_checks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    cluster_id = Column(String(100), default="default", index=True, nullable=False)
    framework = Column(String(50), default="CIS-K8s-1.8", index=True, nullable=False)  # CIS-K8s-1.8, NIST-SP-800-190, PCI-DSS-4.0
    check_id = Column(String(50), nullable=False, index=True)  # e.g., 5.1.1, 5.2.2
    category = Column(String(100), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    status = Column(String(20), default="pass", index=True)  # pass, fail, warn

    severity = Column(SQLEnum(FindingSeverity, native_enum=False), default=FindingSeverity.MEDIUM)
    evidence = Column(Text, nullable=True)
    remediation_cmd = Column(Text, nullable=True)

    last_evaluated = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class SecurityPostureHistoryRecord(Base, TimestampMixin):
    """Hourly/Daily security score snapshots for trend analytics."""

    __tablename__ = "security_posture_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    cluster_id = Column(String(100), default="default", index=True, nullable=False)
    score = Column(Integer, nullable=False)
    grade = Column(String(5), nullable=False)  # A, B, C, D, F

    total_findings = Column(Integer, default=0)
    critical_count = Column(Integer, default=0)
    high_count = Column(Integer, default=0)
    medium_count = Column(Integer, default=0)
    low_count = Column(Integer, default=0)

    total_workloads_scanned = Column(Integer, default=0)
    compliance_percentage = Column(Float, default=0.0)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)

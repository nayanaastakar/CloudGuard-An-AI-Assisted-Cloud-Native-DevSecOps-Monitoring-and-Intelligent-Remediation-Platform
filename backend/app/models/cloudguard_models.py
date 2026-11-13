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


class ProvenanceType(str, Enum):
    LIVE = "live"
    STALE = "stale"
    DEMO = "demo"
    UNAVAILABLE = "unavailable"


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

    # Provenance tracking
    provenance = Column(SQLEnum(ProvenanceType, native_enum=False), default=ProvenanceType.DEMO, nullable=False, index=True)
    source = Column(String(100), default="cloudguard-engine", nullable=False)
    last_synced_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

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

    # Provenance tracking
    provenance = Column(SQLEnum(ProvenanceType, native_enum=False), default=ProvenanceType.DEMO, nullable=False, index=True)
    source = Column(String(100), default="trivy", nullable=False)
    last_synced_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

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


class DiscoveredAssetRecord(Base, TimestampMixin):
    """Inventory and metadata for discovered cloud infrastructure and workloads."""

    __tablename__ = "discovered_assets"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    cluster_id = Column(String(100), default="default", index=True, nullable=False)
    asset_id = Column(String(200), unique=True, index=True, nullable=False)
    resource_type = Column(String(50), nullable=False, index=True)  # Cluster, Node, Namespace, Workload, Pod, Container, Service
    name = Column(String(255), nullable=False, index=True)
    namespace = Column(String(100), nullable=True, index=True)

    status = Column(String(50), default="active", nullable=False)  # active, degraded, stopped, terminating
    provenance = Column(SQLEnum(ProvenanceType, native_enum=False), default=ProvenanceType.DEMO, nullable=False, index=True)
    source = Column(String(100), default="kubernetes-api", nullable=False)

    metadata_json = Column(Text, nullable=True)  # JSON metadata (labels, annotations, IP, version)
    relationships_json = Column(Text, nullable=True)  # JSON of related asset IDs (e.g., node -> pods)
    
    first_discovered = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_discovered = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    last_synced_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class SBOMPackageRecord(Base, TimestampMixin):
    """Software Bill of Materials (SBOM) component and dependency catalog."""

    __tablename__ = "sbom_packages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    cluster_id = Column(String(100), default="default", index=True, nullable=False)
    image_tag = Column(String(500), nullable=False, index=True)
    package_name = Column(String(255), nullable=False, index=True)
    version = Column(String(100), nullable=False)
    package_type = Column(String(50), default="os", index=True)  # os, npm, pypi, golang, maven
    license = Column(String(100), nullable=True)
    
    vulnerability_count = Column(Integer, default=0)
    has_critical_vuln = Column(Boolean, default=False)
    
    provenance = Column(SQLEnum(ProvenanceType, native_enum=False), default=ProvenanceType.DEMO, nullable=False)
    source = Column(String(100), default="trivy-sbom", nullable=False)
    scanned_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class GraphNodeRecord(Base, TimestampMixin):
    """Unified security relationship graph entity."""

    __tablename__ = "security_graph_nodes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    cluster_id = Column(String(100), default="default", index=True, nullable=False)
    node_id = Column(String(255), unique=True, index=True, nullable=False)  # Stable URI, e.g. "k8s:workload:production/payment-api"
    entity_type = Column(String(50), nullable=False, index=True)  # Cluster, Node, Namespace, Workload, Pod, Container, Image, Vulnerability, Identity, ServiceAccount, Role, Permission, NetworkEndpoint, SecurityPolicy, RuntimeEvent
    name = Column(String(255), nullable=False, index=True)
    namespace = Column(String(100), nullable=True, index=True)
    properties_json = Column(Text, nullable=True)  # Extra attributes (IP, severity, port, cve, score)
    criticality = Column(String(20), default="medium", index=True)  # critical, high, medium, low
    provenance = Column(SQLEnum(ProvenanceType, native_enum=False), default=ProvenanceType.DEMO, nullable=False, index=True)
    source = Column(String(100), default="graph-engine", nullable=False)
    first_observed = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_observed = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class GraphRelationshipRecord(Base, TimestampMixin):
    """Directed, evidenced relationship edge between security entities."""

    __tablename__ = "security_graph_relationships"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    cluster_id = Column(String(100), default="default", index=True, nullable=False)
    source_node_id = Column(String(255), nullable=False, index=True)
    target_node_id = Column(String(255), nullable=False, index=True)
    relationship_type = Column(String(50), nullable=False, index=True)  # RUNS_ON, BELONGS_TO, EXPOSES, USES, DEPENDS_ON, HAS_PERMISSION_TO_ACCESS, CONTAINS_VULNERABILITY, CONNECTS_TO, CAN_REACH, TRIGGERS, PROTECTED_BY, VIOLATES_POLICY
    
    evidence_reference = Column(Text, nullable=True)  # Explanation or reference pointer (e.g. "Ingress spec rules -> Service:443")
    source_integration = Column(String(100), default="cloudguard-discovery", nullable=False)
    confidence = Column(Float, default=1.0, nullable=False)  # 0.0 - 1.0 confidence score
    is_inferred = Column(Boolean, default=False, nullable=False)  # Confirmed vs Inferred
    provenance = Column(SQLEnum(ProvenanceType, native_enum=False), default=ProvenanceType.DEMO, nullable=False, index=True)
    
    first_observed = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_observed = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        Index("idx_graph_rel_src_tgt_type", "source_node_id", "target_node_id", "relationship_type", unique=True),
        Index("idx_graph_rel_tgt_type", "target_node_id", "relationship_type"),
    )


/**
 * CloudGuard DevSecOps & Security API Client
 */

import api from '../utils/axios';

export interface ProvenanceMetadata {
  state: 'live' | 'stale' | 'demo' | 'unavailable' | 'error';
  source: string;
  last_synced_at: string | null;
  is_fresh: boolean;
  ttl_seconds: number;
  error_message?: string;
}

export interface InfrastructureInventoryResponse {
  cluster_id: string;
  cluster_name: string | null;
  status: 'live' | 'demo' | 'unavailable' | 'error';
  provenance: ProvenanceMetadata;
  summary: {
    total_nodes: number | null;
    total_namespaces: number | null;
    total_workloads: number | null;
    total_pods: number | null;
  };
  nodes: Array<{ id: string; name: string; type: string; status: string; roles: string[]; os_image: string; kubelet_version: string }>;
  namespaces: Array<{ id: string; name: string; type: string; status: string; created_at: string }>;
  workloads: Array<{ id: string; name: string; namespace: string; type: string; replicas: number; available_replicas: number; images: string[] }>;
  pods: Array<{ id: string; name: string; namespace: string; type: string; node_name: string; status: string; ip?: string; containers: string[]; images: string[] }>;
}

export interface ScannerHealthResponse {
  scanners: Record<string, { name: string; installed: boolean; path: string; status: string; supported_capabilities: string[]; last_checked: string }>;
  total_configured: number;
  active_count: number;
  simulated_count: number;
  timestamp: string;
}

export interface SBOMResponse {
  image: string;
  format: string;
  provenance: ProvenanceMetadata;
  generated_at: string;
  package_count: number;
  packages: Array<{ name: string; version: string; type: string; license?: string; vulnerabilities: number; critical: boolean }>;
}

export interface SecurityScore {
  score: number;
  grade: string;
  total_findings: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  scoring_formula: string;
  last_evaluated: string;
}

export interface SecurityFinding {
  finding_id: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  evidence?: string;
  impact?: string;
  resource_type: string;
  resource_name: string;
  namespace: string;
  remediation_guidance?: string;
  remediation_yaml?: string;
  can_auto_remediate: boolean;
}

export interface SecurityPostureResponse {
  cluster_id: string;
  audit_run_id?: string;
  audit_status?: 'complete' | 'partial' | 'unavailable' | 'demo';
  checks?: Record<string, { status: string; error?: string }>;
  error?: string | null;
  provenance?: ProvenanceMetadata;
  security_score: SecurityScore | null;
  findings: SecurityFinding[];
  workloads_audited: number | null;
  posture_summary: {
    privileged_containers: number;
    root_containers: number;
    missing_network_policies: number;
    rbac_violations: number;
  } | null;
  is_forced_refresh?: boolean;
  audit_triggered_at?: string;
}

export interface VulnerabilityItem {
  cve_id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  package_name: string;
  installed_version: string;
  fixed_version?: string;
  has_fix: boolean;
  cvss_score: number;
  contextual_risk_score: number;
  title: string;
  description: string;
  primary_url?: string;
  target: string;
}

export interface VulnerabilityScanResponse {
  image_tag: string;
  scanned_at: string;
  total_vulnerabilities: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  fixable_count: number;
  is_publicly_exposed: boolean;
  is_privileged: boolean;
  vulnerabilities: VulnerabilityItem[];
}

export interface AttackPathNode {
  id: string;
  label: string;
  type: 'entry_point' | 'workload' | 'identity' | 'target';
  status: string;
  description: string;
  provenance?: string;
}

export interface AttackPathEdge {
  source: string;
  target: string;
  label: string;
  vector: string;
}

export interface AttackPath {
  path_id: string;
  provenance?: string;
  data_source?: string;
  title: string;
  severity: 'critical' | 'high' | 'medium';
  risk_score: number;
  entry_point: string;
  target_resource: string;
  hop_count: number;
  nodes: AttackPathNode[];
  edges: AttackPathEdge[];
  mitigations: string[];
}

export interface IncidentTimelineEvent {
  timestamp: string;
  type: string;
  message: string;
  component: string;
}

export interface SecurityIncident {
  incident_id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium';
  status: string;
  resource_name: string;
  namespace: string;
  summary: string;
  root_cause: string;
  blast_radius: string;
  confidence_score: number;
  timeline: IncidentTimelineEvent[];
  evidence: {
    events: string[];
    reasons: string[];
    logs_snippet: string;
  };
  recommendations: string[];
  investigated_at: string;
}

export interface RemediationPlan {
  remediation_id: string;
  finding_id: string;
  title: string;
  target_resource: string;
  namespace: string;
  manifest_provenance?: 'live' | 'demo';
  current_yaml: string;
  proposed_yaml: string;
  diff_patch: string;
  risk_level: string;
  security_benefit: string;
  operational_impact: string;
  status: string;
  dry_run_verified: boolean;
  dry_run_output: string;
  validation_status_label?: string;
  execution_available?: boolean;
  allowlist_configured?: boolean;
  policy_restriction_message?: string;
  created_at: string;
  applied_at?: string;
  execution_log?: string;
}

export interface ComplianceCheck {
  check_id: string;
  framework: string;
  category: string;
  title: string;
  status: 'pass' | 'fail' | 'warn';
  severity: string;
  evidence: string;
  remediation: string;
}

export interface ComplianceResponse {
  framework: string;
  compliance_percentage: number;
  total_checks: number;
  passed: number;
  failed: number;
  warnings: number;
  evaluated_at: string;
  checks: ComplianceCheck[];
}

export interface RepositoryFinding {
  id: string;
  category: 'dockerfile' | 'kubernetes' | 'workflow' | 'secret' | 'dependency' | string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  title: string;
  description: string;
  file_path: string;
  line_number?: number | null;
  evidence: string;
  remediation: string;
  status: string;
}

export interface RepositoryScanResult {
  repository_url: string;
  owner: string;
  repo: string;
  default_branch: string;
  latest_commit_sha?: string | null;
  latest_commit_author?: string | null;
  latest_commit_message?: string | null;
  scanned_at: string;
  total_findings: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  info_count: number;
  files_analyzed_count: number;
  findings: RepositoryFinding[];
  scan_status: string;
  notes: string[];
}

export interface RepositoryScanHistoryItem {
  analysis_id: number;
  repository_url: string;
  owner: string;
  repo: string;
  branch?: string;
  commit_sha?: string;
  status: string;
  created_at: string;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  total_findings: number;
}

export const cloudguardApi = {
  scanRepository: (url: string) =>
    api.post<RepositoryScanResult>('/cloudguard/repository/scan', { url }),

  getRepositoryScanHistory: (limit = 20) =>
    api.get<RepositoryScanHistoryItem[]>('/cloudguard/repository/history', { params: { limit } }),
  getSecurityPosture: (clusterId = 'default') =>
    api.get<SecurityPostureResponse>('/cloudguard/posture', { params: { cluster_id: clusterId } }),

  scanImage: (image: string, exposed = false, privileged = false) =>
    api.get<VulnerabilityScanResponse>('/cloudguard/vulnerabilities/scan', {
      params: { image, exposed, privileged },
    }),

  getAttackPaths: (clusterId = 'default') =>
    api.get<AttackPath[]>('/cloudguard/attack-paths', { params: { cluster_id: clusterId } }),

  getIncidents: (clusterId = 'default') =>
    api.get<SecurityIncident[]>('/cloudguard/incidents', { params: { cluster_id: clusterId } }),

  createRemediationPlan: (finding: Partial<SecurityFinding>) =>
    api.post<RemediationPlan>('/cloudguard/remediation/plan', finding),

  applyRemediation: (remediationId: string, comment?: string) =>
    api.post<{ success: boolean; message: string; plan: RemediationPlan }>(
      '/cloudguard/remediation/apply',
      { remediation_id: remediationId, comment }
    ),

  getCompliance: (framework = 'CIS-K8s-1.8') =>
    api.get<ComplianceResponse>('/cloudguard/compliance', { params: { framework } }),

  getInfrastructureInventory: (clusterId = 'default') =>
    api.get<InfrastructureInventoryResponse>('/cloudguard/assets/inventory', { params: { cluster_id: clusterId } }),

  getScannerHealth: () =>
    api.get<ScannerHealthResponse>('/cloudguard/scanners/health'),

  getSBOMPackages: (image = 'nginx:latest') =>
    api.get<SBOMResponse>('/cloudguard/sbom/packages', { params: { image } }),

  triggerSecurityAudit: (clusterId = 'default') =>
    api.post<SecurityPostureResponse>('/cloudguard/posture/audit', { cluster_id: clusterId }),

  getSecurityPostureForced: (clusterId = 'default') =>
    api.get<SecurityPostureResponse>('/cloudguard/posture', { params: { cluster_id: clusterId, refresh: true } }),
};

export default cloudguardApi;

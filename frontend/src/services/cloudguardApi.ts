/**
 * CloudGuard DevSecOps & Security API Client
 */

import api from '../utils/axios';

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
  security_score: SecurityScore;
  findings: SecurityFinding[];
  workloads_audited: number;
  posture_summary: {
    privileged_containers: number;
    root_containers: number;
    missing_network_policies: number;
    rbac_violations: number;
  };
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
}

export interface AttackPathEdge {
  source: string;
  target: string;
  label: string;
  vector: string;
}

export interface AttackPath {
  path_id: string;
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
  current_yaml: string;
  proposed_yaml: string;
  diff_patch: string;
  risk_level: string;
  security_benefit: string;
  operational_impact: string;
  status: string;
  dry_run_verified: boolean;
  dry_run_output: string;
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

export const cloudguardApi = {
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
};

export default cloudguardApi;

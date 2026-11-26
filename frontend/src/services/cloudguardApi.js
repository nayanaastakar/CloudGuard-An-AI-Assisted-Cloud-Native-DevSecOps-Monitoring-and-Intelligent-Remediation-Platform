/**
 * CloudGuard DevSecOps & Security API Client
 */

import api from '../utils/axios';





















































































































































































































































































export const cloudguardApi = {
  scanRepository: (url) =>
  api.post('/cloudguard/repository/scan', { url }),

  getRepositoryScanHistory: (limit = 20) =>
  api.get('/cloudguard/repository/history', { params: { limit } }),
  getSecurityPosture: (clusterId = 'default') =>
  api.get('/cloudguard/posture', { params: { cluster_id: clusterId } }),

  scanImage: (image, exposed = false, privileged = false) =>
  api.get('/cloudguard/vulnerabilities/scan', {
    params: { image, exposed, privileged }
  }),

  getAttackPaths: (clusterId = 'default') =>
  api.get('/cloudguard/attack-paths', { params: { cluster_id: clusterId } }),

  getIncidents: (clusterId = 'default') =>
  api.get('/cloudguard/incidents', { params: { cluster_id: clusterId } }),

  createRemediationPlan: (finding) =>
  api.post('/cloudguard/remediation/plan', finding),

  applyRemediation: (remediationId, comment) =>
  api.post(
    '/cloudguard/remediation/apply',
    { remediation_id: remediationId, comment }
  ),

  getCompliance: (framework = 'CIS-K8s-1.8') =>
  api.get('/cloudguard/compliance', { params: { framework } }),

  getInfrastructureInventory: (clusterId = 'default') =>
  api.get('/cloudguard/assets/inventory', { params: { cluster_id: clusterId } }),

  getScannerHealth: () =>
  api.get('/cloudguard/scanners/health'),

  getSBOMPackages: (image = 'nginx:latest') =>
  api.get('/cloudguard/sbom/packages', { params: { image } }),

  triggerSecurityAudit: (clusterId = 'default') =>
  api.post('/cloudguard/posture/audit', { cluster_id: clusterId }),

  getSecurityPostureForced: (clusterId = 'default') =>
  api.get('/cloudguard/posture', { params: { cluster_id: clusterId, refresh: true } })
};

export default cloudguardApi;
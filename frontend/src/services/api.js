import api from '../utils/axios';










































// Kubernetes API
export const kubernetesApi = {
  getHealth: () => api.get('/kubernetes/health'),
  getNamespaces: () => api.get('/kubernetes/namespaces'),
  getNamespacesWithDetails: () => api.get('/kubernetes/namespaces/details'),
  createNamespace: (request) =>
  api.post('/kubernetes/namespaces', request),
  deleteNamespace: (name) =>
  api.delete(`/kubernetes/namespaces/${name}`),
  getPods: (namespace) =>
  api.get('/kubernetes/pods', { params: { namespace } }),
  getDeployments: (namespace) =>
  api.get('/kubernetes/deployments', { params: { namespace } }),
  getDeployment: (namespace, name) =>
  api.get(`/kubernetes/deployments/${namespace}/${name}`),
  deleteDeployment: (namespace, name) =>
  api.delete(`/kubernetes/deployments/${namespace}/${name}`),
  getEvents: (namespace, limit = 100) =>
  api.get('/kubernetes/events', { params: { namespace, limit } }),
  getPodEvents: (namespace, podName) =>
  api.get(`/kubernetes/pods/${namespace}/${podName}/events`),
  getWorkloadEvents: (kind, namespace, name) =>
  api.get(`/kubernetes/workloads/${kind}/${namespace}/${name}/events`),
  scale: (namespace, deploymentName, replicas) =>
  api.post('/kubernetes/scale', { namespace, deployment_name: deploymentName, replicas }),
  restart: (namespace, deploymentName) =>
  api.post('/kubernetes/restart', { namespace, deployment_name: deploymentName }),
  deploy: (releaseId, environment, namespace, services) =>
  api.post('/kubernetes/deploy', {
    release_id: releaseId,
    environment,
    namespace,
    services
  }),
  rollback: (deploymentId, reason, targetVersion) =>
  api.post('/kubernetes/rollback', {
    deployment_id: deploymentId,
    target_version: targetVersion,
    reason
  }),
  // Nodes
  getNodes: () => api.get('/kubernetes/nodes'),
  getNode: (name) => api.get(`/kubernetes/nodes/${name}`),
  getPodsOnNode: (nodeName) => api.get(`/kubernetes/nodes/${nodeName}/pods`),
  // Metrics
  getClusterMetrics: () => api.get('/kubernetes/metrics'),
  getNodeMetrics: () => api.get('/kubernetes/metrics/nodes'),
  getPodMetrics: (namespace) =>
  api.get('/kubernetes/metrics/pods', { params: { namespace } }),
  // Logs
  getPodLogs: (
  namespace,
  podName,
  options) =>






  {
    // Build params object, excluding undefined/null values
    const params = {};
    if (options?.container) params.container = options.container;
    if (options?.tailLines) params.tail_lines = options.tailLines;
    if (options?.sinceSeconds) params.since_seconds = options.sinceSeconds;
    if (options?.timestamps) params.timestamps = options.timestamps;
    if (options?.previous) params.previous = options.previous;

    return api.get(`/kubernetes/pods/${namespace}/${podName}/logs`, { params });
  },
  // Exec
  execPodCommand: (namespace, podName, command, container) =>
  api.post(`/kubernetes/pods/${namespace}/${podName}/exec`, {
    namespace,
    pod_name: podName,
    command,
    container
  }),
  // Services
  getServices: (namespace) =>
  api.get('/kubernetes/services', { params: { namespace } }),
  createService: (request) =>
  api.post('/kubernetes/services', request),
  updateService: (namespace, name, request) =>
  api.put(`/kubernetes/services/${namespace}/${name}`, request),
  deleteService: (namespace, name) =>
  api.delete(`/kubernetes/services/${namespace}/${name}`),
  // Ingresses
  getIngresses: (namespace) =>
  api.get('/kubernetes/ingresses', { params: { namespace } }),
  createIngress: (request) =>
  api.post('/kubernetes/ingresses', request),
  updateIngress: (namespace, name, request) =>
  api.put(`/kubernetes/ingresses/${namespace}/${name}`, request),
  deleteIngress: (namespace, name) =>
  api.delete(`/kubernetes/ingresses/${namespace}/${name}`),
  // ConfigMaps
  getConfigMaps: (namespace) =>
  api.get('/kubernetes/configmaps', { params: { namespace } }),
  getConfigMap: (namespace, name) =>
  api.get(`/kubernetes/configmaps/${namespace}/${name}`),
  createConfigMap: (request) =>
  api.post('/kubernetes/configmaps', request),
  updateConfigMap: (namespace, name, request) =>
  api.put(`/kubernetes/configmaps/${namespace}/${name}`, request),
  deleteConfigMap: (namespace, name) =>
  api.delete(`/kubernetes/configmaps/${namespace}/${name}`),
  // Secrets
  getSecrets: (namespace) =>
  api.get('/kubernetes/secrets', { params: { namespace } }),
  getSecret: (namespace, name) =>
  api.get(`/kubernetes/secrets/${namespace}/${name}`),
  createSecret: (request) =>
  api.post('/kubernetes/secrets', request),
  updateSecret: (namespace, name, request) =>
  api.put(`/kubernetes/secrets/${namespace}/${name}`, request),
  deleteSecret: (namespace, name) =>
  api.delete(`/kubernetes/secrets/${namespace}/${name}`),
  // PVCs
  getPVCs: (namespace) =>
  api.get('/kubernetes/pvcs', { params: { namespace } }),
  createPVC: (request) =>
  api.post('/kubernetes/pvcs', request),
  updatePVC: (namespace, name, request) =>
  api.put(`/kubernetes/pvcs/${namespace}/${name}`, request),
  deletePVC: (namespace, name) =>
  api.delete(`/kubernetes/pvcs/${namespace}/${name}`),
  // PVs
  getPVs: () =>
  api.get('/kubernetes/pvs'),
  createPV: (request) =>
  api.post('/kubernetes/pvs', request),
  deletePV: (name) =>
  api.delete(`/kubernetes/pvs/${name}`),
  // StorageClasses
  getStorageClasses: () =>
  api.get('/kubernetes/storageclasses'),
  createStorageClass: (request) =>
  api.post('/kubernetes/storageclasses', request),
  deleteStorageClass: (name) =>
  api.delete(`/kubernetes/storageclasses/${name}`),
  // StatefulSets
  getStatefulSets: (namespace) =>
  api.get('/kubernetes/statefulsets', { params: { namespace } }),
  getStatefulSet: (namespace, name) =>
  api.get(`/kubernetes/statefulsets/${namespace}/${name}`),
  deleteStatefulSet: (namespace, name) =>
  api.delete(`/kubernetes/statefulsets/${namespace}/${name}`),
  scaleStatefulSet: (namespace, name, replicas) =>
  api.post(`/kubernetes/statefulsets/${namespace}/${name}/scale`, null, { params: { replicas } }),
  restartStatefulSet: (namespace, name) =>
  api.post(`/kubernetes/statefulsets/${namespace}/${name}/restart`),
  // DaemonSets
  getDaemonSets: (namespace) =>
  api.get('/kubernetes/daemonsets', { params: { namespace } }),
  getDaemonSet: (namespace, name) =>
  api.get(`/kubernetes/daemonsets/${namespace}/${name}`),
  deleteDaemonSet: (namespace, name) =>
  api.delete(`/kubernetes/daemonsets/${namespace}/${name}`),
  restartDaemonSet: (namespace, name) =>
  api.post(`/kubernetes/daemonsets/${namespace}/${name}/restart`),
  // Jobs
  getJobs: (namespace) =>
  api.get('/kubernetes/jobs', { params: { namespace } }),
  getJob: (namespace, name) =>
  api.get(`/kubernetes/jobs/${namespace}/${name}`),
  deleteJob: (namespace, name) =>
  api.delete(`/kubernetes/jobs/${namespace}/${name}`),
  // CronJobs
  getCronJobs: (namespace) =>
  api.get('/kubernetes/cronjobs', { params: { namespace } }),
  // HPAs
  getHPAs: (namespace) =>
  api.get('/kubernetes/hpas', { params: { namespace } }),
  // YAML Apply
  applyYAML: (request) =>
  api.post('/kubernetes/apply', request),
  // Kubectl
  executeKubectl: (request) =>
  api.post('/kubernetes/kubectl', request),
  // Shell
  executeShell: (request) =>
  api.post('/kubernetes/shell', request),
  // Deployment Revisions & Rollback
  getDeploymentRevisions: (namespace, deploymentName) =>
  api.get(`/kubernetes/deployments/${namespace}/${deploymentName}/revisions`),
  rollbackDeployment: (namespace, deploymentName, revision) =>
  api.post(`/kubernetes/deployments/${namespace}/${deploymentName}/rollback`, null, { params: { revision } }),
  // Resource YAML operations
  getResourceYAML: (request) =>
  api.post('/kubernetes/resource/yaml', request),
  updateResourceYAML: (yamlContent, namespace, dryRun = false) =>
  api.put('/kubernetes/resource/yaml', {
    yaml_content: yamlContent,
    namespace,
    dry_run: dryRun
  })
};

// Deployment Revision type











// Incidents API
export const incidentsApi = {
  list: (params) =>
  api.get('/incidents', { params }),
  get: (id) => api.get(`/incidents/${id}`),
  create: (data) => api.post('/incidents', data),
  update: (id, data) => api.patch(`/incidents/${id}`, data),
  analyze: (id, options) =>
  api.post(`/incidents/${id}/analyze`, {
    incident_id: id,
    include_k8s_context: options?.include_k8s_context ?? true,
    include_jenkins_context: true,
    additional_context: options?.additional_context
  }),
  getRunbook: (id) => api.post(`/incidents/${id}/runbook`),
  getTimeline: (id) => api.get(`/incidents/${id}/timeline`),
  delete: (id) => api.delete(`/incidents/${id}`)
};

// Timeline API
export const timelineApi = {
  list: (params) =>






  api.get('/timeline', { params }),
  create: (event) => api.post('/timeline', event),
  getStats: (hours = 24) => api.get('/timeline/stats', { params: { hours } }),
  correlate: (incidentId, incidentTimestamp) =>
  api.get(`/timeline/correlate/${incidentId}`, { params: { incident_timestamp: incidentTimestamp } })
};

// GitFlow API
export const gitflowApi = {
  getConfig: () => api.get('/gitflow/config'),
  getBranches: (branchType) =>
  api.get('/gitflow/branches', { params: { branch_type: branchType } }),
  createRelease: (version, sourceBranch = 'develop', changelog) =>
  api.post('/gitflow/releases', {
    version,
    source_branch: sourceBranch,
    changelog,
    auto_create_branch: true
  }),
  listReleases: (status, limit = 20) =>
  api.get('/gitflow/releases', { params: { status, limit } }),
  getRelease: (id) => api.get(`/gitflow/releases/${id}`),
  approveRelease: (id, approvedBy) =>
  api.post(`/gitflow/releases/${id}/approve`, null, { params: { approved_by: approvedBy } }),
  finishRelease: (id) => api.post(`/gitflow/releases/${id}/finish`),
  createHotfix: (version, description) =>
  api.post('/gitflow/hotfix', null, { params: { version, description } }),
  finishHotfix: (id) => api.post(`/gitflow/hotfix/${id}/finish`),
  getVersions: () => api.get('/gitflow/versions'),
  promote: (releaseId, fromEnv, toEnv) =>
  api.post('/gitflow/promote', {
    release_id: releaseId,
    from_environment: fromEnv,
    to_environment: toEnv
  })
};

// Self-Service API
export const selfServiceApi = {
  getCatalog: (namespace, environment) =>
  api.get('/selfservice/catalog', { params: { namespace, environment } }),
  getService: (namespace, serviceName) =>
  api.get(`/selfservice/catalog/${namespace}/${serviceName}`),
  getEnvironments: () => api.get('/selfservice/environments'),
  getQuickActions: () => api.get('/selfservice/quick-actions'),
  createAction: (action) =>
  api.post('/selfservice/actions', action),
  listActions: (status, limit = 50) =>
  api.get('/selfservice/actions', { params: { status, limit } }),
  getAction: (id) => api.get(`/selfservice/actions/${id}`),
  approveAction: (id, approvedBy) =>
  api.post(`/selfservice/actions/${id}/approve`, null, { params: { approved_by: approvedBy } }),
  rejectAction: (id, reason) =>
  api.post(`/selfservice/actions/${id}/reject`, null, { params: { reason } })
};

// Permission types












































// Auth API
























export const authApi = {
  login: (username, password) =>
  api.post('/auth/login', { username, password }),
  logout: (refreshToken) =>
  api.post('/auth/logout', { refresh_token: refreshToken }),
  refreshToken: (refreshToken) =>
  api.post('/auth/refresh', { refresh_token: refreshToken }),
  getCurrentUser: () => api.get('/auth/me'),
  getAuditLogs: (page = 1, limit = 50) =>
  api.get('/auth/audit', { params: { page, limit } }),
  changePassword: (data) =>
  api.post('/auth/me/password', data),
  listUsers: () => api.get('/auth/users'),
  createUser: (data) =>
  api.post('/auth/users', data),
  updateUser: (userId, data) =>
  api.patch(`/auth/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/auth/users/${userId}`),
  resetUserPassword: (userId, data) =>
  api.post(`/auth/users/${userId}/reset-password`, data),
  // Permission management
  getAvailablePermissions: () =>
  api.get('/auth/permissions/available'),
  getUserPermissions: (userId) =>
  api.get(`/auth/users/${userId}/permissions`),
  setUserPermissions: (userId, data) =>
  api.put(`/auth/users/${userId}/permissions`, data),
  getRoleDefaultPermissions: () =>
  api.get('/auth/roles/permissions')
};

// Cluster test connection response type











// Clusters API
export const clustersApi = {
  list: () => api.get('/clusters'),
  getActive: () => api.get('/clusters/active'),
  setActive: (clusterId) => api.put('/clusters/active', { cluster_id: clusterId }),
  get: (clusterId) => api.get(`/clusters/${clusterId}`),
  getHealth: (clusterId) => api.get(`/clusters/${clusterId}/health`),
  getContexts: () => api.get('/clusters/contexts'),
  create: (data) =>
  api.post('/clusters', data),
  update: (clusterId, data) =>
  api.put(`/clusters/${clusterId}`, data),
  delete: (clusterId) => api.delete(`/clusters/${clusterId}`),
  testConnection: (clusterId) => api.post(`/clusters/${clusterId}/test`)
};

// Helm API
export const helmApi = {
  // Releases
  listReleases: (namespace, allNamespaces = true) =>
  api.get('/helm/releases', {
    params: { namespace, all_namespaces: allNamespaces }
  }),
  getRelease: (namespace, name) =>
  api.get(`/helm/releases/${namespace}/${name}`),
  getReleaseHistory: (namespace, name) =>
  api.get(`/helm/releases/${namespace}/${name}/history`),
  getReleaseValues: (namespace, name, allValues = false) =>
  api.get(`/helm/releases/${namespace}/${name}/values`, {
    params: { all_values: allValues }
  }),
  getManifest: (namespace, name) =>
  api.get(`/helm/releases/${namespace}/${name}/manifest`),
  installRelease: (request) =>
  api.post('/helm/releases', request),
  upgradeRelease: (namespace, name, request) =>
  api.put(`/helm/releases/${namespace}/${name}`, request),
  rollbackRelease: (namespace, name, revision, options) =>
  api.post(`/helm/releases/${namespace}/${name}/rollback`, {
    revision,
    ...options
  }),
  uninstallRelease: (namespace, name, keepHistory = false, dryRun = false) =>
  api.delete(`/helm/releases/${namespace}/${name}`, {
    params: { keep_history: keepHistory, dry_run: dryRun }
  }),
  testRelease: (namespace, name, timeout = 300) =>
  api.post(`/helm/releases/${namespace}/${name}/test`, null, {
    params: { timeout }
  }),
  getReleaseHealth: (namespace, name) =>
  api.get(


























    `/helm/releases/${namespace}/${name}/health`),

  // Repositories
  listRepositories: () => api.get('/helm/repositories'),
  addRepository: (name, url) =>
  api.post('/helm/repositories', null, { params: { name, url } }),
  removeRepository: (name) =>
  api.delete(`/helm/repositories/${name}`),
  updateRepositories: () =>
  api.post('/helm/repositories/update'),

  // Charts
  searchCharts: (query, repository) =>
  api.get('/helm/charts/search', {
    params: { query, repository }
  }),
  getChartInfo: (chart, repository) =>
  api.get(`/helm/charts/${chart}/info`, {
    params: { repository }
  }),
  getChartValues: (chart, repository) =>
  api.get(`/helm/charts/${chart}/values`, {
    params: { repository }
  }),
  getChartVersions: (chart, repository) =>
  api.get(`/helm/charts/${chart}/versions`, {
    params: { repository }
  }),

  // AI Analysis
  analyzeConfig: (valuesYaml, chartName, namespace) =>
  api.post(















    '/ai/helm/analyze-config', {
      values_yaml: valuesYaml,
      chart_name: chartName,
      namespace: namespace
    }),
  troubleshoot: (releaseName, namespace, healthData, manifest) =>
  api.post(









    '/ai/helm/troubleshoot', {
      release_name: releaseName,
      namespace: namespace,
      health_data: healthData,
      manifest: manifest
    })
};

// ArgoCD API
export const argocdApi = {
  // Configuration
  configure: (config) =>
  api.post('/argocd/config', config),
  getStatus: () =>
  api.get('/argocd/config/status'),
  disconnect: () =>
  api.delete('/argocd/config'),

  // Applications
  listApplications: (project, selector) =>
  api.get('/argocd/applications', {
    params: { project, selector }
  }),
  getApplication: (name) =>
  api.get(`/argocd/applications/${name}`),
  createApplication: (request) =>
  api.post('/argocd/applications', request),
  deleteApplication: (name, cascade = true) =>
  api.delete(`/argocd/applications/${name}`, { params: { cascade } }),

  // Sync Operations
  syncApplication: (name, request) =>
  api.post(`/argocd/applications/${name}/sync`, request || {}),
  refreshApplication: (name) =>
  api.post(`/argocd/applications/${name}/refresh`),
  terminateOperation: (name) =>
  api.delete(`/argocd/applications/${name}/operation`),

  // History & Rollback
  getApplicationHistory: (name) =>
  api.get(`/argocd/applications/${name}/history`),
  rollbackApplication: (name, request) =>
  api.post(`/argocd/applications/${name}/rollback`, request),

  // Events & Resources
  getApplicationEvents: (name) =>
  api.get(`/argocd/applications/${name}/events`),
  getResourceTree: (name) =>
  api.get(`/argocd/applications/${name}/resource-tree`),

  // Projects
  listProjects: () =>
  api.get('/argocd/projects'),

  // Deployment Management (install/manage ArgoCD itself)
  getDeploymentStatus: (namespace = 'argocd', releaseName = 'argocd') =>
  api.get('/argocd/deployment/status', {
    params: { namespace, release_name: releaseName }
  }),
  deployArgoCD: (request) =>
  api.post('/argocd/deployment/deploy', request, { timeout: 180000 }),
  upgradeArgoCD: (namespace = 'argocd', releaseName = 'argocd', version) =>
  api.post('/argocd/deployment/upgrade', null, {
    params: { namespace, release_name: releaseName, version },
    timeout: 180000
  }),
  uninstallArgoCD: (namespace = 'argocd', releaseName = 'argocd', deleteNamespace = false) =>
  api.delete('/argocd/deployment/uninstall', {
    params: { namespace, release_name: releaseName, delete_namespace: deleteNamespace },
    timeout: 120000
  }),
  getAdminPassword: (namespace = 'argocd') =>
  api.get('/argocd/deployment/password', {
    params: { namespace }
  })
};

// Cost API
export const costApi = {
  getDashboard: () => api.get('/cost/dashboard'),
  getNamespaceCosts: () => api.get('/cost/namespaces'),
  getPodCosts: (limit = 10) => api.get('/cost/pods', { params: { limit } }),
  getCostTrends: (days = 30) => api.get('/cost/trends', { params: { days } }),
  getRecommendations: () => api.get('/cost/recommendations'),
  getEfficiencyMetrics: () => api.get('/cost/efficiency')
};

// Optimization API
export const optimizationApi = {
  getDashboard: (namespace) =>
  api.get('/optimization/dashboard', { params: { namespace } }),
  getSummary: (namespace) =>
  api.get('/optimization/summary', { params: { namespace } }),
  getNamespaces: () =>
  api.get('/optimization/namespaces'),
  getRecommendations: (namespace, severity, limit = 50) =>
  api.get('/optimization/recommendations', {
    params: { namespace, severity, limit }
  }),
  getWastefulPods: (namespace, limit = 10) =>
  api.get('/optimization/wasteful', { params: { namespace, limit } }),
  getUnderprovisionedPods: (namespace, limit = 10) =>
  api.get('/optimization/underprovisioned', { params: { namespace, limit } }),
  getIdleResources: (namespace, limit = 10) =>
  api.get('/optimization/idle', { params: { namespace, limit } }),
  getPodOptimization: (namespace, podName) =>
  api.get(`/optimization/pods/${namespace}/${podName}`),
  applyOptimization: (request) =>
  api.post('/optimization/apply', request),
  previewOptimization: (request) =>
  api.post('/optimization/preview', request),
  getYamlPatch: (params) =>








  api.get('/optimization/yaml-patch', { params }),
  getAIAnalysis: (request) =>
  api.post('/ai/optimization/analyze', request)
};

// Health API
export const healthApi = {
  check: () => api.get('/health'),
  ready: () => api.get('/ready'),
  live: () => api.get('/live')
};

// AI Chat API



































export const aiApi = {
  chat: (request) =>
  api.post('/ai/chat', request),
  yamlReview: (request) =>
  api.post('/ai/yaml-review', request),
  analyzeWorkload: (request) =>




  api.post('/ai/workload/analyze', request),
  getProactiveInsights: () =>
  api.get('/ai/insights/proactive'),
  summarizeLogs: (namespace, timeWindowMinutes = 10) =>
  api.post('/ai/summarize-logs', {
    namespace,
    time_window_minutes: timeWindowMinutes
  })
};

// Settings & Integrations API





















































































export const settingsApi = {
  // Integrations
  listIntegrations: () =>
  api.get('/settings/integrations'),
  getIntegration: (id) =>
  api.get(`/settings/integrations/${id}`),
  createIntegration: (data) =>








  api.post('/settings/integrations', data),
  updateIntegration: (id, data) =>






  api.put(`/settings/integrations/${id}`, data),
  deleteIntegration: (id) =>
  api.delete(`/settings/integrations/${id}`),
  connectIntegration: (id, data) =>
  api.post(`/settings/integrations/${id}/connect`, data),
  disconnectIntegration: (id) =>
  api.post(`/settings/integrations/${id}/disconnect`),
  checkIntegrationStatus: (id) =>
  api.get(`/settings/integrations/${id}/status`),
  checkAllIntegrationsStatus: () =>
  api.get('/settings/integrations/status/all'),

  // API Tokens
  listTokens: () =>
  api.get('/settings/tokens'),
  createToken: (data) =>
  api.post('/settings/tokens', data),
  revokeToken: (id) =>
  api.post(`/settings/tokens/${id}/revoke`),
  deleteToken: (id) =>
  api.delete(`/settings/tokens/${id}`),

  // User Settings (Preferences)
  getUserSettings: () =>
  api.get('/settings/settings'),
  updateUserSettings: (data) =>














  api.put('/settings/settings', data),
  resetUserSettings: () =>
  api.post('/settings/settings/reset'),

  // User Management (Admin)
  listUsers: () =>
  api.get('/settings/users'),
  getUser: (id) =>
  api.get(`/settings/users/${id}`),
  createUser: (data) =>





  api.post('/settings/users', data),
  updateUser: (id, data) =>




  api.put(`/settings/users/${id}`, data),
  deleteUser: (id) =>
  api.delete(`/settings/users/${id}`),
  toggleUserStatus: (id) =>
  api.post(`/settings/users/${id}/toggle-status`)
};

// Security API
export const securityApi = {
  getDashboard: (clusterId = 'default') =>
  api.get('/security/dashboard', { params: { cluster_id: clusterId } }),
  getPosture: (clusterId = 'default') =>
  api.get('/security/posture', { params: { cluster_id: clusterId } }),
  getFindings: (params) =>
  api.get('/security/findings', { params }),
  getScore: (clusterId = 'default') =>
  api.get('/security/score', { params: { cluster_id: clusterId } }),
  triggerScan: (clusterId = 'default') =>
  api.post('/security/scan', null, { params: { cluster_id: clusterId } }),
  getPodSecurityChecks: (params) =>
  api.get('/security/pod-security', { params }),
  getComplianceChecks: (params) =>
  api.get('/security/compliance', { params }),
  getImageScans: (clusterId = 'default') =>
  api.get('/security/image-scans', { params: { cluster_id: clusterId } }),
  getRBACAnalysis: () =>
  api.get('/security/rbac'),
  getRBACDetailed: () =>
  api.get('/security/rbac/detailed'),
  getRBACSummary: () =>
  api.get('/security/rbac/summary'),
  getNetworkPolicyCoverage: () =>
  api.get('/security/network-policies'),
  getNetworkPoliciesDetailed: () =>
  api.get('/security/network-policies/detailed'),
  getNetworkPolicySummary: () =>
  api.get('/security/network-policies/summary'),
  getTrends: (days = 30) =>
  api.get('/security/trends', { params: { days } }),
  getTrendsDetailed: (days = 30) =>
  api.get('/security/trends/detailed', { params: { days } }),
  getTrendsSummary: () =>
  api.get('/security/trends/summary'),
  getRecommendations: (clusterId = 'default') =>
  api.get('/security/recommendations', { params: { cluster_id: clusterId } }),
  getRiskyNamespaces: (clusterId = 'default', limit = 10) =>
  api.get('/security/namespaces/risky', { params: { cluster_id: clusterId, limit } }),
  getAIRemediation: (request) =>









  api.post('/security/ai-remediate', request)
};

export default api;
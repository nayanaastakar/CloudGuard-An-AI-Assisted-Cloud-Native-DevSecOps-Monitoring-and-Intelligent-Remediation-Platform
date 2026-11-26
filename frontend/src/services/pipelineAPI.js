// services/pipelineAPI.ts
// Pipeline API - Real backend integration

import api from '../utils/axios';
import { pipelineLogger as logger } from '../utils/logger';

// ============================================
// TYPE DEFINITIONS
// ============================================

























































































































































// Note: All mock data has been removed. This service now uses only real backend API.

// ============================================
// HELPER FUNCTIONS
// ============================================

// Transform backend response to frontend format
function transformPipeline(backendPipeline) {
  // Handle both snake_case and camelCase from backend
  // Ensure name has a proper fallback - use ID if name is missing
  const name = backendPipeline.name || backendPipeline.id || 'Unnamed Pipeline';

  return {
    id: backendPipeline.id,
    name,
    description: backendPipeline.description || '',
    branch: backendPipeline.branch || 'main',
    status: (backendPipeline.status || backendPipeline.last_run_status || 'pending').toLowerCase(),
    lastRun: backendPipeline.lastRun || backendPipeline.last_run_at || 'Never',
    duration: backendPipeline.duration || backendPipeline.last_run_duration || '-',
    trigger: backendPipeline.trigger || 'manual',
    successRate: backendPipeline.successRate || backendPipeline.success_rate || 0,
    yaml: backendPipeline.yaml || backendPipeline.yaml_config, // Handle both field names
    repository: backendPipeline.repository,
    provider: backendPipeline.provider,
    execution_mode: backendPipeline.execution_mode,
    executionMode: backendPipeline.execution_mode || backendPipeline.executionMode,
    createdAt: backendPipeline.createdAt || backendPipeline.created_at,
    updatedAt: backendPipeline.updatedAt || backendPipeline.updated_at
  };
}

function transformPipelineRun(backendRun) {
  // Handle both dict and object responses
  const run = backendRun || {};

  // Extract stages - handle various formats
  let stages = [];
  if (run.stages && Array.isArray(run.stages)) {
    stages = run.stages.map((s) => {
      const stage = typeof s === 'object' ? s : {};
      return {
        id: stage.id || stage.stage_id || String(Math.random()),
        name: stage.name || stage.stage_name || 'Unknown',
        status: (stage.status || 'pending')?.toLowerCase() || 'pending',
        startedAt: stage.started_at || stage.startedAt,
        completedAt: stage.finished_at || stage.completed_at || stage.finishedAt || stage.completedAt,
        duration: stage.duration_seconds ? `${Math.round(stage.duration_seconds)}s` : stage.duration || '-',
        logs: stage.logs ? Array.isArray(stage.logs) ? stage.logs : [stage.logs] : [],
        requiresApproval: stage.requiresApproval || stage.requires_approval || false,
        approvalStatus: stage.approvalStatus || stage.approval_status,
        requiredApprovers: stage.requiredApprovers || stage.required_approvers || 1,
        approverRoles: stage.approverRoles || stage.approver_roles || []
      };
    });
  }

  // Calculate duration
  let duration = backendRun.duration || '-';
  if (backendRun.started_at && backendRun.finished_at) {
    const start = new Date(backendRun.started_at);
    const end = new Date(backendRun.finished_at);
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor(durationMs % 60000 / 1000);
    duration = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }

  return {
    id: backendRun.id,
    pipelineId: backendRun.pipeline_id,
    pipelineName: backendRun.pipeline_name,
    status: backendRun.status?.toLowerCase() || 'pending',
    branch: backendRun.branch || 'main',
    commit: backendRun.commit_sha || backendRun.commit || '',
    trigger: backendRun.triggered_by || 'manual',
    startedAt: backendRun.started_at,
    completedAt: backendRun.finished_at,
    duration,
    stages,
    artifacts: backendRun.artifacts || [],
    triggeredBy: backendRun.triggered_by
  };
}

// ============================================
// PIPELINE CRUD
// ============================================

export const getPipelines = async () => {
  try {
    const response = await api.get('/pipelines');
    const pipelines = response.data.pipelines || response.data || [];
    return pipelines.map(transformPipeline);
  } catch (error) {
    logger.error('Failed to fetch pipelines', error);
    throw error;
  }
};

export const getPipeline = async (id) => {
  try {
    const response = await api.get(`/pipelines/${id}`);
    if (!response.data) {
      throw new Error(`Pipeline ${id} not found - no data returned`);
    }
    return transformPipeline(response.data);
  } catch (error) {
    logger.error('Failed to fetch pipeline', error);
    if (error.response?.status === 404) {
      throw new Error(`Pipeline ${id} not found`);
    }
    throw error;
  }
};

export const createPipeline = async (data) => {
  try {
    const payload = {
      name: data.name,
      description: data.description,
      repository: data.repository || '',
      branch: data.branch || 'main',
      file_path: '.kubesight/pipeline.yaml',
      provider: data.provider || 'manual',
      is_active: true,
      tags: [],
      yaml: data.yaml
    };
    const response = await api.post('/pipelines', payload);
    return transformPipeline(response.data);
  } catch (error) {
    logger.error('Failed to create pipeline', error);
    throw error;
  }
};

export const updatePipeline = async (id, data) => {
  try {
    const response = await api.patch(`/pipelines/${id}`, data);
    return transformPipeline(response.data);
  } catch (error) {
    logger.error('Failed to update pipeline', error);
    throw error;
  }
};

export const deletePipeline = async (id) => {
  try {
    await api.delete(`/pipelines/${id}`);
  } catch (error) {
    logger.error('Failed to delete pipeline', error);
    throw error;
  }
};

// ============================================
// PIPELINE RUNS
// ============================================

export const getPipelineRuns = async (pipelineId) => {
  try {
    const response = await api.get(`/pipelines/${pipelineId}/runs`);
    const runs = response.data.runs || response.data || [];
    return runs.map(transformPipelineRun);
  } catch (error) {
    logger.error('Failed to fetch pipeline runs', error);
    throw error;
  }
};

export const getPipelineRun = async (pipelineId, runId) => {
  try {
    const response = await api.get(`/pipelines/${pipelineId}/runs/${runId}`);
    if (!response.data) {
      throw new Error(`Run ${runId} not found - no data returned`);
    }
    return transformPipelineRun(response.data);
  } catch (error) {
    logger.error('Failed to fetch pipeline run', error);
    throw error;
  }
};

export const getRunReport = async (runId) => {
  const response = await api.get(`/testing/runs/${runId}/report`);
  return response.data;
};

export const triggerPipeline = async (pipelineId, branch) => {
  try {
    const response = await api.post(`/pipelines/${pipelineId}/runs`, {
      pipeline_id: pipelineId,
      branch: branch || 'main',
      variables: {},
      dry_run: false
    });
    return transformPipelineRun(response.data);
  } catch (error) {
    logger.error('Failed to trigger pipeline', error);
    throw error;
  }
};

export const retryRun = async (pipelineId, runId) => {
  try {
    const response = await api.post(`/pipelines/${pipelineId}/runs/${runId}/retry`);
    return transformPipelineRun(response.data);
  } catch (error) {
    logger.error('Failed to retry run', error);
    throw error;
  }
};

export const cancelRun = async (pipelineId, runId) => {
  try {
    await api.post(`/pipelines/${pipelineId}/runs/${runId}/cancel`);
  } catch (error) {
    logger.error('Failed to cancel run', error);
    throw error;
  }
};

// ============================================
// LOGS
// ============================================

export const getRunLogs = async (
pipelineId,
runId,
stageId) =>
{
  try {
    const params = {};
    if (stageId) params.stage_id = stageId;

    const response = await api.get(`/pipelines/${pipelineId}/runs/${runId}/logs`, { params });
    const logData = response.data;

    // Handle different response formats
    if (Array.isArray(logData.logs)) {
      return logData.logs.map((l) =>
      typeof l === 'string' ? l : `[${l.timestamp}] ${l.stage}: ${l.message}`
      );
    }
    if (typeof logData.logs === 'string') {
      return logData.logs.split('\n');
    }
    return [];
  } catch (error) {
    logger.error('Failed to fetch logs', error);
    throw error;
  }
};

// Stream logs via SSE
export const streamRunLogs = (
pipelineId,
runId,
onLog,
onError) =>
{
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  // Get auth token for query parameter (EventSource doesn't support custom headers)
  const token = localStorage.getItem("kubesight_token") ||
  localStorage.getItem("nextsight_token") ||
  localStorage.getItem("access_token") ||
  localStorage.getItem("token");
  const url = `${baseUrl}/pipelines/${pipelineId}/runs/${runId}/logs/stream${token ? `?token=${encodeURIComponent(token)}` : ''}`;

  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onLog(data.message || data);
    } catch {
      onLog(event.data);
    }
  };

  eventSource.onerror = (error) => {
    if (onError) onError(error);
    eventSource.close();
  };

  // Return cleanup function
  return () => eventSource.close();
};

// ============================================
// YAML EDITOR
// ============================================

export const getPipelineYaml = async (pipelineId) => {
  try {
    const response = await api.get(`/pipelines/${pipelineId}/yaml`);
    return response.data.yaml || response.data || '';
  } catch (error) {
    logger.error('Failed to fetch YAML', error);
    // Return default YAML if not found
    return `name: my-pipeline
description: A new pipeline

triggers:
  - push:
      branches: [main]

stages:
  - name: Build
    steps:
      - run: echo "Building..."

  - name: Test
    steps:
      - run: echo "Testing..."

  - name: Deploy
    needs: [Build, Test]
    steps:
      - run: echo "Deploying..."
`;
  }
};

export const updatePipelineYaml = async (pipelineId, yaml) => {
  try {
    await api.put(`/pipelines/${pipelineId}/yaml`, { yaml });
  } catch (error) {
    logger.error('Failed to update YAML', error);
    throw error;
  }
};

// ============================================
// VARIABLES
// ============================================

export const getVariables = async (pipelineId) => {
  try {
    const params = pipelineId ? { pipeline_id: pipelineId } : {};
    const response = await api.get('/pipelines/variables', { params });
    return response.data.variables || response.data || [];
  } catch (error) {
    logger.error('Failed to fetch variables', error);
    return [];
  }
};

export const createVariable = async (
variable,
pipelineId) =>
{
  try {
    const payload = { ...variable, pipeline_id: pipelineId };
    const response = await api.post('/pipelines/variables', payload);
    return response.data;
  } catch (error) {
    logger.error('Failed to create variable', error);
    throw error;
  }
};

export const updateVariable = async (
id,
variable) => {
  try {
    const response = await api.patch(`/pipelines/variables/${id}`, variable);
    return response.data;
  } catch (error) {
    logger.error('Failed to update variable', error);
    throw error;
  }
};

export const deleteVariable = async (id) => {
  try {
    await api.delete(`/pipelines/variables/${id}`);
  } catch (error) {
    logger.error('Failed to delete variable', error);
    throw error;
  }
};

// ============================================
// SECRETS
// ============================================

export const getSecrets = async (pipelineId) => {
  try {
    const params = pipelineId ? { pipeline_id: pipelineId } : {};
    const response = await api.get('/pipelines/secrets', { params });
    return response.data.secrets || response.data || [];
  } catch (error) {
    logger.error('Failed to fetch secrets', error);
    return [];
  }
};

export const createSecret = async (
secret,
pipelineId) =>
{
  try {
    const payload = { ...secret, pipeline_id: pipelineId };
    const response = await api.post('/pipelines/secrets', payload);
    return response.data;
  } catch (error) {
    logger.error('Failed to create secret', error);
    throw error;
  }
};

export const updateSecret = async (
id,
secret) => {
  try {
    const response = await api.patch(`/pipelines/secrets/${id}`, secret);
    return response.data;
  } catch (error) {
    logger.error('Failed to update secret', error);
    throw error;
  }
};

export const deleteSecret = async (id) => {
  try {
    await api.delete(`/pipelines/secrets/${id}`);
  } catch (error) {
    logger.error('Failed to delete secret', error);
    throw error;
  }
};

// ============================================
// TRIGGERS
// ============================================

export const getTriggers = async (pipelineId) => {
  try {
    const response = await api.get(`/pipelines/${pipelineId}/triggers`);
    return response.data.triggers || response.data || [];
  } catch (error) {
    logger.error('Failed to fetch triggers', error);
    return [];
  }
};

export const createTrigger = async (
pipelineId,
trigger) =>
{
  try {
    const response = await api.post(`/pipelines/${pipelineId}/triggers`, trigger);
    return response.data;
  } catch (error) {
    logger.error('Failed to create trigger', error);
    throw error;
  }
};

export const updateTrigger = async (
pipelineId,
triggerId,
trigger) =>
{
  try {
    const response = await api.patch(`/pipelines/${pipelineId}/triggers/${triggerId}`, trigger);
    return response.data;
  } catch (error) {
    logger.error('Failed to update trigger', error);
    throw error;
  }
};

export const deleteTrigger = async (pipelineId, triggerId) => {
  try {
    await api.delete(`/pipelines/${pipelineId}/triggers/${triggerId}`);
  } catch (error) {
    logger.error('Failed to delete trigger', error);
    throw error;
  }
};

// ============================================
// STATISTICS
// ============================================

export const getPipelineStatistics = async (pipelineId) => {
  try {
    const response = await api.get(`/pipelines/${pipelineId}/statistics`);
    const stats = response.data;

    return {
      trends: stats.trends || stats.last_30_days_stats?.trends || [],
      successRate: stats.success_rate * 100 || stats.successRate || 0,
      avgDuration: stats.average_duration_seconds || stats.avgDuration || 0,
      totalRuns: stats.total_runs || stats.totalRuns || 0,
      stageBottlenecks: stats.stage_bottlenecks || stats.stageBottlenecks || []
    };
  } catch (error) {
    logger.error('Failed to fetch statistics', error);
    throw error;
  }
};

// ============================================
// AI ASSISTANT
// ============================================

export const aiChatPipeline = async (pipelineId, message) => {
  try {
    const response = await api.post(`/pipelines/${pipelineId}/ai/chat`, { message });
    return response.data.response || response.data;
  } catch (error) {
    logger.error('AI chat failed', error);
    throw error;
  }
};

export const aiOptimizePipeline = async (pipelineId) => {
  try {
    const response = await api.post(`/pipelines/${pipelineId}/ai/optimize`);
    return response.data;
  } catch (error) {
    logger.error('AI optimize failed', error);
    throw error;
  }
};

export const aiAnalyzeFailure = async (
pipelineId,
runId) =>
{
  try {
    const response = await api.post(`/pipelines/${pipelineId}/runs/${runId}/ai/analyze`);
    return response.data;
  } catch (error) {
    logger.error('AI analyze failed', error);
    throw error;
  }
};

export const aiGenerateFix = async (
pipelineId,
runId) =>
{
  try {
    const response = await api.post(`/pipelines/${pipelineId}/runs/${runId}/ai/fix`);
    return response.data;
  } catch (error) {
    logger.error('AI fix generation failed', error);
    throw error;
  }
};

// ============================================
// WEBHOOKS
// ============================================














export const getWebhooks = async (pipelineId) => {
  try {
    const response = await api.get(`/pipelines/${pipelineId}/webhooks`);
    return response.data.webhooks || response.data || [];
  } catch (error) {
    logger.error('Failed to fetch webhooks', error);
    return [];
  }
};

export const createWebhook = async (
pipelineId,
webhook) =>
{
  try {
    const response = await api.post(`/pipelines/${pipelineId}/webhooks`, webhook);
    return response.data;
  } catch (error) {
    logger.error('Failed to create webhook', error);
    throw error;
  }
};

export const updateWebhook = async (
pipelineId,
webhookId,
webhook) =>
{
  try {
    const response = await api.patch(`/pipelines/${pipelineId}/webhooks/${webhookId}`, webhook);
    return response.data;
  } catch (error) {
    logger.error('Failed to update webhook', error);
    throw error;
  }
};

export const deleteWebhook = async (pipelineId, webhookId) => {
  try {
    await api.delete(`/pipelines/${pipelineId}/webhooks/${webhookId}`);
  } catch (error) {
    logger.error('Failed to delete webhook', error);
    throw error;
  }
};

export const testWebhook = async (pipelineId, webhookId) => {
  try {
    const response = await api.post(`/pipelines/${pipelineId}/webhooks/${webhookId}/test`);
    return response.data.success;
  } catch (error) {
    logger.error('Failed to test webhook', error);
    return false;
  }
};

export const getWebhookUrl = async (pipelineId) => {
  try {
    const response = await api.get(`/pipelines/${pipelineId}/webhook-url`);
    return response.data;
  } catch (error) {
    logger.error('Failed to get webhook URL', error);
    throw error;
  }
};

// ============================================
// GITHUB INTEGRATION
// ============================================

















export const getGitHubRepos = async () => {
  try {
    const response = await api.get('/pipelines/github/repos');
    return response.data.repositories || [];
  } catch (error) {
    logger.error('Failed to fetch GitHub repos', error);
    throw error;
  }
};

export const getGitHubBranches = async (owner, repo) => {
  try {
    const response = await api.get(`/pipelines/github/repos/${owner}/${repo}/branches`);
    return response.data.branches || [];
  } catch (error) {
    logger.error('Failed to fetch GitHub branches', error);
    throw error;
  }
};

export const createGitHubWebhook = async (
owner,
repo) =>
{
  try {
    const response = await api.post(`/pipelines/github/repos/${owner}/${repo}/webhook`);
    return response.data;
  } catch (error) {
    logger.error('Failed to create GitHub webhook', error);
    throw error;
  }
};

export const getGitHubPipelineFile = async (
owner,
repo,
ref) =>
{
  try {
    const params = ref ? { ref } : {};
    const response = await api.get(`/pipelines/github/repos/${owner}/${repo}/pipeline-file`, { params });
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch pipeline file', error);
    return { found: false };
  }
};

// ============================================
// WEBSOCKET SUBSCRIPTIONS
// ============================================

export const subscribeToLogs = (
pipelineId,
runId,
stageId,
onLog) =>
{
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsHost = import.meta.env.VITE_WS_URL || `${wsProtocol}//${window.location.host}`;
  const wsUrl = `${wsHost}/api/v1/pipelines/${pipelineId}/runs/${runId}/logs/ws?stage_id=${stageId}`;

  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onLog(data.message || data.log || event.data);
    } catch {
      onLog(event.data);
    }
  };

  return ws;
};

export const subscribeToPipelineStatus = (
pipelineId,
onStatus) =>
{
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsHost = import.meta.env.VITE_WS_URL || `${wsProtocol}//${window.location.host}`;
  const wsUrl = `${wsHost}/api/v1/pipelines/${pipelineId}/status/ws`;

  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onStatus(data);
    } catch {
      logger.error('Failed to parse pipeline status', event.data);
    }
  };

  return ws;
};

// ============================================
// APPROVALS
// ============================================


















export const getStageApprovals = async (
pipelineId,
runId,
stageId) =>
{
  try {
    const response = await api.get(
      `/pipelines/${pipelineId}/runs/${runId}/stages/${stageId}/approvals`
    );
    return response.data || [];
  } catch (error) {
    logger.error('Failed to fetch approvals', error);
    return [];
  }
};

export const approveStage = async (
pipelineId,
runId,
stageId,
comment) =>
{
  try {
    const response = await api.post(
      `/pipelines/${pipelineId}/runs/${runId}/stages/${stageId}/approve`,
      { comment }
    );
    return response.data;
  } catch (error) {
    logger.error('Failed to approve stage', error);
    throw error;
  }
};

export const rejectStage = async (
pipelineId,
runId,
stageId,
comment) =>
{
  try {
    const response = await api.post(
      `/pipelines/${pipelineId}/runs/${runId}/stages/${stageId}/reject`,
      { comment: comment || 'Deployment rejected' }
    );
    return response.data;
  } catch (error) {
    logger.error('Failed to reject stage', error);
    throw error;
  }
};















export const getPendingApprovals = async () => {
  try {
    const response = await api.get('/pipelines/approvals/pending');
    return response.data.pendingApprovals || [];
  } catch (error) {
    logger.error('Failed to fetch pending approvals', error);
    return [];
  }
};

// ============================================
// DEFAULT EXPORT
// ============================================

const pipelineAPI = {
  // Pipeline CRUD
  getPipelines,
  getPipeline,
  createPipeline,
  updatePipeline,
  deletePipeline,
  // Pipeline Runs
  getPipelineRuns,
  getPipelineRun,
  triggerPipeline,
  retryRun,
  cancelRun,
  // Logs
  getRunLogs,
  streamRunLogs,
  // YAML
  getPipelineYaml,
  updatePipelineYaml,
  // Variables
  getVariables,
  createVariable,
  updateVariable,
  deleteVariable,
  // Secrets
  getSecrets,
  createSecret,
  updateSecret,
  deleteSecret,
  // Triggers
  getTriggers,
  createTrigger,
  updateTrigger,
  deleteTrigger,
  // Statistics
  getPipelineStatistics,
  // AI
  aiChatPipeline,
  aiOptimizePipeline,
  aiAnalyzeFailure,
  aiGenerateFix,
  // Webhooks
  getWebhooks,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  testWebhook,
  getWebhookUrl,
  // GitHub
  getGitHubRepos,
  getGitHubBranches,
  createGitHubWebhook,
  getGitHubPipelineFile,
  // WebSocket
  subscribeToLogs,
  subscribeToPipelineStatus,
  // Approvals
  getStageApprovals,
  approveStage,
  rejectStage,
  getPendingApprovals
};

export default pipelineAPI;
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { helmApi } from '../../services/api';
import { logger } from '../../utils/logger';

import {
  CubeIcon,
  RocketLaunchIcon,
  ArrowUpTrayIcon,
  ArrowUturnLeftIcon,
  TrashIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  ClockIcon,
  SparklesIcon,
  DocumentIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  LightBulbIcon,
  WrenchScrewdriverIcon,
  ServerStackIcon,
  DocumentDuplicateIcon,
  BeakerIcon,
  MagnifyingGlassCircleIcon,
  HeartIcon,
  ShieldCheckIcon } from
'@heroicons/react/24/outline';

// Types
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";








// Default values template
const DEFAULT_VALUES = `# Default values for chart
replicaCount: 3

image:
  repository: nginx
  tag: stable
  pullPolicy: IfNotPresent

service:
  type: LoadBalancer
  port: 80

ingress:
  enabled: false
  className: ""
  annotations: {}
  hosts:
    - host: chart-example.local
      paths:
        - path: /
          pathType: ImplementationSpecific

resources:
  limits:
    cpu: 200m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80

nodeSelector: {}
tolerations: []
affinity: {}
`;

// Mock template files structure


// Template Tree Component

// Status Badge Component
function StatusBadge({ status }) {
  const isHealthy = status === 'deployed';
  const isFailed = status === 'failed';

  return (/*#__PURE__*/
    _jsxDEV("span", {
      className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
      isHealthy ?
      'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
      isFailed ?
      'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' :
      'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'}`, children: [


      isHealthy ? /*#__PURE__*/
      _jsxDEV(CheckCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false) :
      isFailed ? /*#__PURE__*/
      _jsxDEV(XCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false) : /*#__PURE__*/

      _jsxDEV(ClockIcon, { className: "h-3.5 w-3.5 animate-pulse" }, void 0, false),

      isHealthy ? 'Healthy' : isFailed ? 'Failed' : 'Pending'] }, void 0, true
    ));

}

// AI Insight Component
function AIInsightCard({ insight, onApplyFix }) {
  const iconConfig = {
    warning: { icon: ExclamationTriangleIcon, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20' },
    suggestion: { icon: LightBulbIcon, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10', border: 'border-purple-200 dark:border-purple-500/20' },
    info: { icon: SparklesIcon, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/20' }
  };

  const config = iconConfig[insight.type];
  const Icon = config.icon;

  return (/*#__PURE__*/
    _jsxDEV("div", { className: `p-2 rounded-lg ${config.bg} border ${config.border}`, children: /*#__PURE__*/
      _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
        _jsxDEV(Icon, { className: `h-3.5 w-3.5 ${config.color} flex-shrink-0 mt-0.5` }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-gray-700 dark:text-gray-300", children: insight.message }, void 0, false),
          insight.fix && onApplyFix && /*#__PURE__*/
          _jsxDEV("button", {
            onClick: onApplyFix,
            className: "mt-1.5 text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium", children:
            "Apply Fix" }, void 0, false

          )] }, void 0, true

        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Main Component
export default function HelmChartWorkspace() {
  const navigate = useNavigate();
  const { namespace, releaseName } = useParams();
  const [searchParams] = useSearchParams();
  const chartParam = searchParams.get('chart');
  const modeParam = searchParams.get('mode') || 'edit'; // 'install' | 'edit' | 'upgrade'

  // State
  const [activeTab, setActiveTab] = useState('values');
  const [selectedFile, setSelectedFile] = useState('values.yaml');
  const [valuesContent, setValuesContent] = useState(DEFAULT_VALUES);
  const [release, setRelease] = useState(null);
  const [history, setHistory] = useState([]);
  const [chartInfo, setChartInfo] = useState(null);
  const [, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [deploymentProgress, setDeploymentProgress] = useState(






    { show: false, message: '', stage: 'validating' });

  // Installation config state (for install mode only)
  const [installNamespace, setInstallNamespace] = useState('default');
  const [installReleaseName, setInstallReleaseName] = useState('');

  // Resources state
  const [manifest, setManifest] = useState('');
  const [loadingManifest, setLoadingManifest] = useState(false);

  // Test state
  const [testInProgress, setTestInProgress] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showTestModal, setShowTestModal] = useState(false);

  // Preview/dry-run state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewManifest, setPreviewManifest] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);

  // Health monitoring state
  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState(null);

  // AI analysis state
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [troubleshootData, setTroubleshootData] = useState(null);
  const [troubleshootLoading, setTroubleshootLoading] = useState(false);

  // Parse chart info from param or release
  useEffect(() => {
    if (chartParam) {
      const parts = chartParam.split('/');
      if (parts.length >= 2) {
        const chartName = parts[1];
        setChartInfo({
          repository: parts[0],
          name: chartName,
          version: searchParams.get('version') || 'latest',
          description: 'Helm chart'
        });
        // Set default release name for installation
        setInstallReleaseName(chartName);
      }
    }
  }, [chartParam, searchParams]);

  // Fetch release data if editing existing release
  const fetchRelease = useCallback(async () => {
    if (!namespace || !releaseName) return;

    logger.debug('[FetchRelease] Fetching release data for', { releaseName, namespace });
    setLoading(true);
    setError(null);
    try {
      const [releaseRes, valuesRes, historyRes] = await Promise.all([
      helmApi.getRelease(namespace, releaseName),
      helmApi.getReleaseValues(namespace, releaseName),
      helmApi.getReleaseHistory(namespace, releaseName)]
      );

      logger.debug('[FetchRelease] Release data', releaseRes.data);
      logger.debug('[FetchRelease] Values data', valuesRes.data);
      logger.debug('[FetchRelease] History data', historyRes.data);

      setRelease(releaseRes.data);
      setHistory(historyRes.data || []);

      // Set chart info from release
      setChartInfo({
        name: releaseRes.data.chart,
        version: releaseRes.data.chart_version,
        repository: 'installed',
        description: releaseRes.data.description
      });

      // Set values content from user_supplied or computed values
      const values = valuesRes.data?.user_supplied || valuesRes.data?.computed || {};
      if (Object.keys(values).length > 0) {
        const yaml = await import('js-yaml');
        const yamlString = yaml.dump(values, { indent: 2, lineWidth: -1 });
        logger.debug('[FetchRelease] Setting values content, length', yamlString.length);
        setValuesContent(yamlString);
      } else {
        logger.debug('[FetchRelease] No values found, keeping current content');
      }
    } catch (err) {
      logger.error('[FetchRelease] Failed to fetch release', err);
      setError('Failed to fetch release details');
    } finally {
      setLoading(false);
      logger.debug('[FetchRelease] Fetch completed');
    }
  }, [namespace, releaseName]);

  // Fetch manifest (all Kubernetes resources)
  const fetchManifest = useCallback(async () => {
    if (!namespace || !releaseName) return;

    setLoadingManifest(true);
    try {
      const res = await helmApi.getManifest(namespace, releaseName);
      setManifest(res.data.manifest || '');
    } catch (err) {
      logger.error('Failed to fetch manifest', err);
      setError('Failed to fetch manifest');
    } finally {
      setLoadingManifest(false);
    }
  }, [namespace, releaseName]);

  // Fetch health data
  const fetchHealth = useCallback(async () => {
    if (!namespace || !releaseName) return;

    setHealthLoading(true);
    setHealthError(null);
    try {
      const res = await helmApi.getReleaseHealth(namespace, releaseName);
      setHealthData(res.data);
    } catch (err) {
      logger.error('Failed to fetch health', err);
      setHealthError(err.response?.data?.detail || 'Failed to fetch health data');
    } finally {
      setHealthLoading(false);
    }
  }, [namespace, releaseName]);

  // AI Configuration Analysis
  const analyzeConfig = useCallback(async () => {
    if (!valuesContent) {
      setAiError('No configuration to analyze');
      return;
    }

    setAiLoading(true);
    setAiError(null);
    try {
      const res = await helmApi.analyzeConfig(
        valuesContent,
        chartInfo?.name,
        namespace || installNamespace
      );
      setAiAnalysis(res.data);
      // Auto-switch to AI tab to show results
      setActiveTab('ai');
    } catch (err) {
      logger.error('Failed to analyze config', err);
      setAiError(err.response?.data?.detail || 'Failed to analyze configuration');
    } finally {
      setAiLoading(false);
    }
  }, [valuesContent, chartInfo?.name, namespace, installNamespace]);

  // AI Troubleshooting
  const troubleshootRelease = useCallback(async () => {
    if (!namespace || !releaseName || !healthData) {
      setAiError('Health data required for troubleshooting');
      return;
    }

    setTroubleshootLoading(true);
    setAiError(null);
    try {
      const res = await helmApi.troubleshoot(
        releaseName,
        namespace,
        healthData,
        manifest || undefined
      );
      setTroubleshootData(res.data);
      setAiAnalysis(null); // Clear config analysis when showing troubleshooting
      // Auto-switch to AI tab to show results
      setActiveTab('ai');
    } catch (err) {
      logger.error('Failed to troubleshoot', err);
      setAiError(err.response?.data?.detail || 'Failed to troubleshoot release');
    } finally {
      setTroubleshootLoading(false);
    }
  }, [namespace, releaseName, healthData, manifest]);

  useEffect(() => {
    if (namespace && releaseName) {
      fetchRelease();
    }
  }, [fetchRelease, namespace, releaseName]);

  // Fetch chart default values when in install mode
  useEffect(() => {
    const fetchChartValues = async () => {
      if (modeParam !== 'install' || !chartInfo) return;

      logger.debug('[FetchChartValues] Fetching default values for chart', chartInfo);
      setLoading(true);
      try {
        const chartFullName = `${chartInfo.repository}/${chartInfo.name}`;
        logger.debug('[FetchChartValues] Requesting values for', chartFullName);

        const response = await helmApi.getChartValues(chartFullName);
        logger.debug('[FetchChartValues] Received values', response.data);

        if (response.data && Object.keys(response.data).length > 0) {
          const yaml = await import('js-yaml');
          const yamlString = yaml.dump(response.data, { indent: 2, lineWidth: -1 });
          logger.debug('[FetchChartValues] Setting values content, length', yamlString.length);
          setValuesContent(yamlString);
        } else {
          logger.debug('[FetchChartValues] No values returned, keeping default template');
        }
      } catch (err) {
        logger.error('[FetchChartValues] Failed to fetch chart values', err);
        // Keep the default values template if fetch fails
        logger.debug('[FetchChartValues] Using default values template due to error');
      } finally {
        setLoading(false);
      }
    };

    fetchChartValues();
  }, [modeParam, chartInfo]);

  // Handlers
  const handleInstall = async () => {
    logger.debug('[Deploy] Install button clicked');
    logger.debug('[Deploy] Chart Info', chartInfo);
    logger.debug('[Deploy] Namespace', installNamespace);
    logger.debug('[Deploy] Release Name', installReleaseName);

    if (!chartInfo) {
      logger.error('[Deploy] No chart info available');
      setError('No chart information available. Please go back and select a chart.');
      return;
    }

    if (!installReleaseName.trim()) {
      setError('Please enter a release name.');
      return;
    }

    // Show progress modal
    logger.debug('[Deploy] Showing progress modal - Validating');
    setDeploymentProgress({
      show: true,
      message: 'Validating YAML configuration...',
      stage: 'validating'
    });

    setSaving(true);
    setError(null);

    try {
      // Parse values YAML to object
      let valuesObj = {};
      try {
        const yaml = await import('js-yaml');
        valuesObj = yaml.load(valuesContent);
        logger.debug('[Deploy] YAML parsed successfully');
      } catch (yamlErr) {
        logger.error('[Deploy] YAML parse error', yamlErr);
        throw new Error('Invalid YAML syntax. Please fix the configuration and try again.');
      }

      // Update progress
      logger.debug('[Deploy] Showing progress modal - Deploying');
      setDeploymentProgress({
        show: true,
        message: `Installing ${chartInfo.name} to ${installNamespace} namespace...`,
        stage: 'deploying'
      });

      const installRequest = {
        release_name: installReleaseName,
        chart: `${chartInfo.repository}/${chartInfo.name}`,
        namespace: installNamespace,
        version: chartInfo.version,
        values: valuesObj
      };
      logger.debug('[Deploy] Sending install request', installRequest);

      const response = await helmApi.installRelease(installRequest);
      logger.debug('[Deploy] Install response', response);

      // Show success
      logger.debug('[Deploy] Installation successful');
      setDeploymentProgress({
        show: true,
        message: `Successfully installed ${chartInfo.name}!`,
        stage: 'success'
      });

      // Navigate after brief success display
      setTimeout(() => {
        navigate('/deploy/helm');
      }, 1500);
    } catch (err) {
      logger.error('[Deploy] Installation failed', err);
      logger.error('[Deploy] Error response', err.response);
      logger.error('[Deploy] Error data', err.response?.data);

      const errorMessage = err.response?.data?.detail || err.message || 'Failed to install chart';
      const clusterError = errorMessage.includes('cluster unreachable') ||
      errorMessage.includes('connection refused') ||
      errorMessage.includes('Kubernetes cluster unreachable');

      // Check for repository not found error
      const repoError = errorMessage.includes('repo') && errorMessage.includes('not found');
      const repoMatch = errorMessage.match(/repo ([a-zA-Z0-9-]+) not found/);
      const missingRepoName = repoMatch ? repoMatch[1] : chartInfo?.repository;

      logger.debug('[Deploy] Error message', errorMessage);
      logger.debug('[Deploy] Is cluster error', clusterError);
      logger.debug('[Deploy] Is repo error', repoError);
      logger.debug('[Deploy] Missing repo', missingRepoName);

      setDeploymentProgress({
        show: true,
        message: 'Installation failed',
        stage: 'error',
        error: clusterError ?
        'Kubernetes cluster is not running. Please start your cluster (Docker Desktop, minikube, etc.) and try again.' :
        repoError ?
        `The repository "${missingRepoName}" is not configured on your system. You need to add it before installing charts from this repository.` :
        errorMessage,
        isRepoError: repoError,
        missingRepo: missingRepoName
      });
      setError(errorMessage);
    } finally {
      setSaving(false);
      logger.debug('[Deploy] Install process completed');
    }
  };

  const handleUpgrade = async () => {
    if (!namespace || !releaseName) return;

    logger.debug('[Upgrade] Upgrade button clicked');
    logger.debug('[Upgrade] Release', { releaseName, namespace });

    // Show progress modal
    setDeploymentProgress({
      show: true,
      message: 'Validating YAML configuration...',
      stage: 'validating'
    });

    setSaving(true);
    setError(null);

    try {
      let valuesObj = {};
      try {
        const yaml = await import('js-yaml');
        valuesObj = yaml.load(valuesContent);
        logger.debug('[Upgrade] YAML parsed successfully');
      } catch (yamlErr) {
        logger.error('[Upgrade] YAML parse error', yamlErr);
        throw new Error('Invalid YAML syntax. Please fix the configuration and try again.');
      }

      // Update progress
      logger.debug('[Upgrade] Showing progress modal - Deploying');
      setDeploymentProgress({
        show: true,
        message: `Upgrading ${releaseName} in ${namespace} namespace...`,
        stage: 'deploying'
      });

      const upgradeRequest = {
        values: valuesObj,
        reuse_values: false
      };
      logger.debug('[Upgrade] Sending upgrade request', upgradeRequest);

      const response = await helmApi.upgradeRelease(namespace, releaseName, upgradeRequest);
      logger.debug('[Upgrade] Upgrade response', response);

      // Check if upgrade actually succeeded
      if (!response.data.success) {
        throw new Error(response.data.message || 'Upgrade failed');
      }

      // Show success
      logger.debug('[Upgrade] Upgrade successful');
      setDeploymentProgress({
        show: true,
        message: `Successfully upgraded ${releaseName}!`,
        stage: 'success'
      });

      // Refresh and close modal after success
      setTimeout(async () => {
        logger.debug('[Upgrade] Closing modal and refreshing data...');
        setDeploymentProgress({ show: false, message: '', stage: 'validating' });

        // Refetch release data and history
        logger.debug('[Upgrade] Fetching updated release data...');
        await fetchRelease();
        logger.debug('[Upgrade] Data refresh completed');
      }, 1500);
    } catch (err) {
      logger.error('[Upgrade] Upgrade failed', err);
      logger.error('[Upgrade] Error response', err.response);
      logger.error('[Upgrade] Error data', err.response?.data);

      const errorMessage = err.response?.data?.detail || err.message || 'Failed to upgrade release';
      const clusterError = errorMessage.includes('cluster unreachable') || errorMessage.includes('connection refused');

      logger.debug('[Upgrade] Error message', errorMessage);
      logger.debug('[Upgrade] Is cluster error', clusterError);

      setDeploymentProgress({
        show: true,
        message: 'Upgrade failed',
        stage: 'error',
        error: clusterError ?
        'Kubernetes cluster is not running. Please start your cluster (Docker Desktop, minikube, etc.) and try again.' :
        errorMessage
      });
      setError(errorMessage);
    } finally {
      setSaving(false);
      logger.debug('[Upgrade] Upgrade process completed');
    }
  };

  const handleTest = async () => {
    if (!namespace || !releaseName) return;

    setTestInProgress(true);
    setTestResult(null);
    setShowTestModal(true);

    try {
      const response = await helmApi.testRelease(namespace, releaseName);

      if (!response.data.success) {
        setTestResult({
          success: false,
          message: response.data.message || 'Tests failed',
          notes: response.data.notes
        });
      } else {
        setTestResult({
          success: true,
          message: response.data.message || 'All tests passed',
          notes: response.data.notes
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to run tests';
      setTestResult({
        success: false,
        message: errorMessage,
        notes: err.response?.data?.notes
      });
    } finally {
      setTestInProgress(false);
    }
  };

  const handlePreviewUpgrade = async () => {
    if (!namespace || !releaseName) return;

    setPreviewLoading(true);
    setPreviewError(null);
    setShowPreviewModal(true);
    setPreviewManifest('');

    try {
      // Parse YAML values
      let valuesObj = {};
      try {
        const yaml = await import('js-yaml');
        valuesObj = yaml.load(valuesContent);
      } catch (yamlErr) {
        throw new Error('Invalid YAML syntax. Please fix the configuration and try again.');
      }

      // Call upgrade with dry_run=true
      const upgradeRequest = {
        values: valuesObj,
        reuse_values: false,
        dry_run: true
      };

      const response = await helmApi.upgradeRelease(namespace, releaseName, upgradeRequest);

      if (!response.data.success) {
        setPreviewError(response.data.message || 'Preview failed');
      } else {
        setPreviewManifest(response.data.manifest || 'No manifest returned');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to preview changes';
      setPreviewError(errorMessage);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handlePreviewInstall = async () => {
    if (!installNamespace || !installReleaseName || !chartInfo) return;

    setPreviewLoading(true);
    setPreviewError(null);
    setShowPreviewModal(true);
    setPreviewManifest('');

    try {
      // Parse YAML values
      let valuesObj = {};
      try {
        const yaml = await import('js-yaml');
        valuesObj = yaml.load(valuesContent);
      } catch (yamlErr) {
        throw new Error('Invalid YAML syntax. Please fix the configuration and try again.');
      }

      // Call install with dry_run=true
      const installRequest = {
        release_name: installReleaseName,
        chart: `${chartInfo.repository}/${chartInfo.name}`,
        namespace: installNamespace,
        version: chartInfo.version !== 'latest' ? chartInfo.version : undefined,
        values: valuesObj,
        create_namespace: true,
        dry_run: true
      };

      const response = await helmApi.installRelease(installRequest);

      if (!response.data.success) {
        setPreviewError(response.data.message || 'Preview failed');
      } else {
        setPreviewManifest(response.data.manifest || 'No manifest returned');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to preview installation';
      setPreviewError(errorMessage);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleRollback = async (targetRevision) => {
    if (!namespace || !releaseName || !release) return;

    // If no target revision specified, rollback to previous
    const revision = targetRevision || release.revision - 1;

    if (revision < 1) return;

    // Confirm rollback
    const revisionInfo = history.find((h) => h.revision === revision);
    const confirmMessage = targetRevision ?
    `Are you sure you want to rollback to revision ${revision}?\n\nChart: ${revisionInfo?.chart} v${revisionInfo?.chart_version}\nDeployed: ${revisionInfo?.updated}` :
    `Are you sure you want to rollback to the previous revision?`;

    if (!confirm(confirmMessage)) return;

    setSaving(true);
    setError(null);
    try {
      await helmApi.rollbackRelease(namespace, releaseName, revision);
      await fetchRelease();
    } catch (err) {
      logger.error('Failed to rollback', err);
      setError('Failed to rollback release');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!namespace || !releaseName) return;
    if (!confirm(`Are you sure you want to delete release "${releaseName}"?`)) return;

    setSaving(true);
    setError(null);
    try {
      await helmApi.uninstallRelease(namespace, releaseName);
      navigate('/deploy/helm');
    } catch (err) {
      logger.error('Failed to delete', err);
      setError('Failed to delete release');
    } finally {
      setSaving(false);
    }
  };

  const isInstallMode = modeParam === 'install' || !namespace && !releaseName;

  // Different tabs for install vs edit mode
  const tabs = isInstallMode ?
  [
  { id: 'values', label: 'Configure', icon: DocumentTextIcon },
  { id: 'ai', label: 'AI Assistant', icon: SparklesIcon }] :

  [
  { id: 'values', label: 'Values', icon: DocumentTextIcon },
  { id: 'diff', label: 'Preview Changes', icon: CodeBracketIcon },
  { id: 'resources', label: 'Resources', icon: ServerStackIcon },
  { id: 'health', label: 'Health', icon: HeartIcon },
  { id: 'history', label: 'History', icon: ClockIcon },
  { id: 'ai', label: 'AI Review', icon: SparklesIcon }];


  // Tabs that use their own 3-column layout (hide default sidebars)
  const fullWidthTabs = ['diff'];
  const useFullWidth = fullWidthTabs.includes(activeTab);

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "flex flex-col h-[calc(100vh-6.5rem)] overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 flex-shrink-0", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            onClick: () => navigate('/deploy/helm'),
            className: "p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors", children: /*#__PURE__*/

            _jsxDEV(ArrowLeftIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg", children: /*#__PURE__*/
              _jsxDEV(CubeIcon, { className: "h-6 w-6 text-white" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h1", { className: "text-xl font-bold text-gray-900 dark:text-white", children:
                chartInfo ? `${chartInfo.repository}/${chartInfo.name}` : 'Helm Chart Workspace' }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children:
                isInstallMode ? 'Install new chart' : `Editing ${releaseName}` }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-2", children:
          isInstallMode ? /*#__PURE__*/
          _jsxDEV(_Fragment, { children: [/*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: handlePreviewInstall,
              disabled: saving || previewLoading,
              className: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 transition-all", children: [

              previewLoading ? /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-5 w-5 animate-spin" }, void 0, false) : /*#__PURE__*/_jsxDEV(MagnifyingGlassCircleIcon, { className: "h-5 w-5" }, void 0, false), "Preview"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: handleInstall,
              disabled: saving,
              className: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg disabled:opacity-50 transition-all", children: [

              saving ? /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-5 w-5 animate-spin" }, void 0, false) : /*#__PURE__*/_jsxDEV(RocketLaunchIcon, { className: "h-5 w-5" }, void 0, false), "Install"] }, void 0, true

            )] }, void 0, true
          ) : /*#__PURE__*/

          _jsxDEV(_Fragment, { children: [/*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: handlePreviewUpgrade,
              disabled: saving || previewLoading,
              className: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 transition-all", children: [

              previewLoading ? /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-5 w-5 animate-spin" }, void 0, false) : /*#__PURE__*/_jsxDEV(MagnifyingGlassCircleIcon, { className: "h-5 w-5" }, void 0, false), "Preview"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: handleUpgrade,
              disabled: saving,
              className: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-lg disabled:opacity-50 transition-all", children: [

              saving ? /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-5 w-5 animate-spin" }, void 0, false) : /*#__PURE__*/_jsxDEV(ArrowUpTrayIcon, { className: "h-5 w-5" }, void 0, false), "Upgrade"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: () => handleRollback(),
              disabled: saving || !release || release.revision <= 1,
              className: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 transition-all", children: [/*#__PURE__*/

              _jsxDEV(ArrowUturnLeftIcon, { className: "h-5 w-5" }, void 0, false), "Rollback"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: handleTest,
              disabled: saving || testInProgress,
              className: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 disabled:opacity-50 transition-all", children: [

              testInProgress ? /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-5 w-5 animate-spin" }, void 0, false) : /*#__PURE__*/_jsxDEV(BeakerIcon, { className: "h-5 w-5" }, void 0, false), "Test"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: handleDelete,
              disabled: saving,
              className: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 disabled:opacity-50 transition-all", children: [/*#__PURE__*/

              _jsxDEV(TrashIcon, { className: "h-5 w-5" }, void 0, false), "Delete"] }, void 0, true

            )] }, void 0, true
          ) }, void 0, false

        )] }, void 0, true
      ),


      error && /*#__PURE__*/
      _jsxDEV("div", { className: "mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: /*#__PURE__*/
        _jsxDEV("p", { className: "text-sm text-red-600 dark:text-red-400", children: error }, void 0, false) }, void 0, false
      ), /*#__PURE__*/



      _jsxDEV("div", { className: "flex items-center gap-2 px-6 py-3 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0", children:
        tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (/*#__PURE__*/
            _jsxDEV(motion.button, {

              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: () => setActiveTab(tab.id),
              className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive ?
              'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30' :
              'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`, children: [/*#__PURE__*/


              _jsxDEV(tab.icon, { className: "h-4 w-4" }, void 0, false),
              tab.label] }, tab.id, true
            ));

        }) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex-1 flex overflow-hidden", children: [

        !useFullWidth && /*#__PURE__*/
        _jsxDEV("div", { className: "w-64 flex flex-col border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "p-3 border-b border-gray-200 dark:border-slate-700 flex-shrink-0", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3", children: "Chart Info" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-2 text-xs", children: /*#__PURE__*/
              _jsxDEV("div", { className: "p-2 bg-gray-50 dark:bg-slate-900/50 rounded-lg", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex justify-between mb-1", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Name:" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-gray-900 dark:text-gray-300 font-medium", children: chartInfo?.name || 'N/A' }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex justify-between mb-1", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Version:" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-cyan-600 dark:text-cyan-400 font-medium", children: chartInfo?.version || 'N/A' }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex justify-between", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Repo:" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-gray-900 dark:text-gray-300 font-medium", children: chartInfo?.repository || 'N/A' }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "p-3 border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3", children: "Quick Actions" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                onClick: () => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.yaml,.yml';
                  input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setValuesContent(e.target?.result);
                      };
                      reader.readAsText(file);
                    }
                  };
                  input.click();
                },
                className: "w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg transition-colors", children: [/*#__PURE__*/

                _jsxDEV(CloudArrowUpIcon, { className: "h-4 w-4" }, void 0, false), "Import Values"] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                onClick: () => {
                  const blob = new Blob([valuesContent], { type: 'text/yaml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${chartInfo?.name || 'chart'}-values.yaml`;
                  a.click();
                  URL.revokeObjectURL(url);
                },
                className: "w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors", children: [/*#__PURE__*/

                _jsxDEV(ArrowPathIcon, { className: "h-4 w-4" }, void 0, false), "Export Values"] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                onClick: () => setValuesContent(DEFAULT_VALUES),
                className: "w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors", children: [/*#__PURE__*/

                _jsxDEV(ArrowPathIcon, { className: "h-4 w-4" }, void 0, false), "Reset to Default"] }, void 0, true

              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "flex-1 p-3", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3", children: "YAML Status" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-green-600 dark:text-green-400" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-xs font-medium text-green-700 dark:text-green-300", children: "Valid YAML" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-green-600 dark:text-green-400 mt-1", children: "No syntax errors detected" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/



        _jsxDEV("div", { className: "flex-1 flex flex-col overflow-hidden", children: /*#__PURE__*/
          _jsxDEV(AnimatePresence, { mode: "wait", children: [
            activeTab === 'values' && /*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "flex-1", children: /*#__PURE__*/

              _jsxDEV(Editor, {
                height: "100%",
                defaultLanguage: "yaml",
                value: valuesContent,
                onChange: (value) => setValuesContent(value || ''),
                theme: "vs-dark",
                options: {
                  minimap: { enabled: true },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                  fontLigatures: true,
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  renderLineHighlight: 'all',
                  padding: { top: 16, bottom: 16 }
                } }, void 0, false
              ) }, "values", false
            ),


            activeTab === 'rendered' && /*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "flex-1 flex overflow-hidden", children: [/*#__PURE__*/


              _jsxDEV("div", { className: "w-64 flex flex-col border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "p-3 border-b border-gray-200 dark:border-slate-700 flex-shrink-0", children: /*#__PURE__*/
                  _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Rendered Templates" }, void 0, false

                  ) }, void 0, false
                ), /*#__PURE__*/

                _jsxDEV("div", { className: "flex-1 overflow-y-auto min-h-0", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "p-3 space-y-1", children:
                    ['deployment.yaml', 'service.yaml', 'ingress.yaml', 'configmap.yaml', 'hpa.yaml', 'secret.yaml'].map((template) => /*#__PURE__*/
                    _jsxDEV(motion.button, {

                      whileHover: { x: 2 },
                      onClick: () => setSelectedFile(template),
                      className: `w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      selectedFile === template ?
                      'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400' :
                      'hover:bg-gray-100 dark:hover:bg-slate-700/50 text-gray-600 dark:text-gray-400'}`, children: [/*#__PURE__*/


                      _jsxDEV("div", { className: "flex items-center gap-2 min-w-0", children: [/*#__PURE__*/
                        _jsxDEV(DocumentIcon, { className: "h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("span", { className: "text-sm truncate", children: template }, void 0, false)] }, void 0, true
                      ),
                      template === 'deployment.yaml' && /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs text-gray-400", children: "2 docs" }, void 0, false),

                      template === 'hpa.yaml' && /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs text-purple-500", children: "AI" }, void 0, false)] }, template, true

                    )
                    ) }, void 0, false
                  ) }, void 0, false
                ), /*#__PURE__*/

                _jsxDEV("div", { className: "p-3 border-t border-gray-200 dark:border-slate-700 flex-shrink-0 space-y-2", children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer", children: [/*#__PURE__*/
                    _jsxDEV("input", { type: "checkbox", defaultChecked: true, className: "rounded" }, void 0, false), "Show empty manifests"] }, void 0, true

                  ), /*#__PURE__*/
                  _jsxDEV("label", { className: "flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer", children: [/*#__PURE__*/
                    _jsxDEV("input", { type: "checkbox", className: "rounded" }, void 0, false), "Collapse YAML sections"] }, void 0, true

                  ), /*#__PURE__*/
                  _jsxDEV("label", { className: "flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer", children: [/*#__PURE__*/
                    _jsxDEV("input", { type: "checkbox", className: "rounded" }, void 0, false), "Highlight changes"] }, void 0, true

                  )] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "flex-1 flex flex-col overflow-hidden", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex-shrink-0", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-sm font-semibold text-gray-700 dark:text-gray-300", children: ["FILE: ",
                    selectedFile || 'deployment.yaml'] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    className: "px-3 py-1 text-xs font-medium bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600", children:
                    "Copy YAML" }, void 0, false

                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV(Editor, {
                  height: "100%",
                  defaultLanguage: "yaml",
                  value: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-prod
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:stable
          ports:
            - containerPort: 80`,
                  theme: "vs-dark",
                  options: {
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                    fontLigatures: true,
                    smoothScrolling: true,
                    renderLineHighlight: 'none',
                    padding: { top: 16, bottom: 16 }
                  } }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "w-80 flex flex-col border-l border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "p-3 border-b border-gray-200 dark:border-slate-700 flex-shrink-0", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV(SparklesIcon, { className: "h-4 w-4 text-purple-500 dark:text-purple-400" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "AI Insights (Rendered Output)" }, void 0, false

                    )] }, void 0, true
                  ) }, void 0, false
                ), /*#__PURE__*/

                _jsxDEV("div", { className: "flex-1 overflow-y-auto p-3 space-y-2", children:
                  aiLoading ? /*#__PURE__*/
                  _jsxDEV("div", { className: "flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
                    _jsxDEV(motion.div, {
                      animate: { rotate: 360 },
                      transition: { duration: 1, repeat: Infinity, ease: 'linear' },
                      className: "mb-3", children: /*#__PURE__*/

                      _jsxDEV(SparklesIcon, { className: "h-6 w-6 text-purple-500" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm", children: "Analyzing rendered output..." }, void 0, false)] }, void 0, true
                  ) :
                  aiAnalysis?.issues && aiAnalysis.issues.length > 0 ?
                  aiAnalysis.issues.map((issue, idx) => /*#__PURE__*/
                  _jsxDEV(AIInsightCard, {

                    insight: {
                      type: issue.severity === 'critical' || issue.severity === 'high' ? 'warning' :
                      issue.severity === 'medium' ? 'suggestion' : 'info',
                      message: `[${issue.severity?.toUpperCase() || 'INFO'}] ${issue.issue || issue.description || issue.message}`,
                      fix: issue.fix || issue.suggestion || 'See AI tab for details'
                    },
                    onApplyFix: issue.auto_fixable ? () => {
                      logger.debug('Applying fix', issue.fix);
                    } : undefined }, idx, false
                  )
                  ) : /*#__PURE__*/

                  _jsxDEV("div", { className: "flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
                    _jsxDEV(SparklesIcon, { className: "h-8 w-8 mb-3 opacity-50" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-center", children: "Click \"Analyze Config\" to get AI insights on your rendered templates" }, void 0, false)] }, void 0, true
                  ) }, void 0, false

                ), /*#__PURE__*/

                _jsxDEV("div", { className: "p-3 border-t border-gray-200 dark:border-slate-700 flex-shrink-0", children: /*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    onClick: analyzeConfig,
                    disabled: aiLoading || !valuesContent,
                    className: "w-full px-3 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2", children: [/*#__PURE__*/

                    _jsxDEV(SparklesIcon, { className: "h-4 w-4" }, void 0, false),
                    aiLoading ? 'Analyzing...' : 'Analyze Config'] }, void 0, true
                  ) }, void 0, false
                )] }, void 0, true
              )] }, "rendered", true
            ),


            activeTab === 'diff' && /*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "flex-1 flex overflow-hidden", children: [/*#__PURE__*/


              _jsxDEV("div", { className: "w-64 flex flex-col border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "p-3 border-b border-gray-200 dark:border-slate-700 flex-shrink-0", children: /*#__PURE__*/
                  _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Diff Files" }, void 0, false

                  ) }, void 0, false
                ), /*#__PURE__*/

                _jsxDEV("div", { className: "flex-1 overflow-y-auto min-h-0", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "p-3 space-y-1", children:
                    [
                    { name: 'deployment.yaml', changes: 4, type: 'modified' },
                    { name: 'service.yaml', changes: 0, type: 'unchanged' },
                    { name: 'ingress.yaml', changes: 1, type: 'modified' },
                    { name: 'configmap.yaml', changes: 2, type: 'modified' },
                    { name: 'hpa.yaml', changes: 0, type: 'added' },
                    { name: 'pdb.yaml', changes: 0, type: 'added-ai' }].
                    map((file) => /*#__PURE__*/
                    _jsxDEV(motion.button, {

                      whileHover: { x: 2 },
                      onClick: () => setSelectedFile(file.name),
                      className: `w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      selectedFile === file.name ?
                      'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400' :
                      'hover:bg-gray-100 dark:hover:bg-slate-700/50 text-gray-600 dark:text-gray-400'}`, children: [/*#__PURE__*/


                      _jsxDEV("div", { className: "flex items-center gap-2 min-w-0", children: [/*#__PURE__*/
                        _jsxDEV(DocumentIcon, { className: `h-4 w-4 flex-shrink-0 ${
                          file.type === 'added' || file.type === 'added-ai' ? 'text-green-500' :
                          file.type === 'modified' ? 'text-amber-500' : 'text-gray-400'}` }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV("span", { className: "text-sm truncate", children: file.name }, void 0, false)] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center gap-1", children: [
                        file.type === 'added-ai' && /*#__PURE__*/
                        _jsxDEV("span", { className: "text-xs text-purple-500 mr-1", children: "AI" }, void 0, false),

                        file.changes > 0 ? /*#__PURE__*/
                        _jsxDEV("span", { className: "text-xs text-amber-600 dark:text-amber-400", children: file.changes }, void 0, false) :
                        file.type === 'unchanged' ? /*#__PURE__*/
                        _jsxDEV("span", { className: "text-xs text-gray-400", children: "—" }, void 0, false) : /*#__PURE__*/

                        _jsxDEV("span", { className: "text-xs text-green-600 dark:text-green-400", children: "new" }, void 0, false)] }, void 0, true

                      )] }, file.name, true
                    )
                    ) }, void 0, false
                  ) }, void 0, false
                ), /*#__PURE__*/

                _jsxDEV("div", { className: "p-3 border-t border-gray-200 dark:border-slate-700 flex-shrink-0 space-y-2", children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer", children: [/*#__PURE__*/
                    _jsxDEV("input", { type: "checkbox", defaultChecked: true, className: "rounded" }, void 0, false), "Show only changed files"] }, void 0, true

                  ), /*#__PURE__*/
                  _jsxDEV("label", { className: "flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer", children: [/*#__PURE__*/
                    _jsxDEV("input", { type: "checkbox", className: "rounded" }, void 0, false), "Group by resource"] }, void 0, true

                  ), /*#__PURE__*/
                  _jsxDEV("label", { className: "flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer", children: [/*#__PURE__*/
                    _jsxDEV("input", { type: "checkbox", className: "rounded" }, void 0, false), "Hide added/removed"] }, void 0, true

                  )] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "flex-1 flex flex-col overflow-hidden", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex-shrink-0", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-sm font-semibold text-gray-700 dark:text-gray-300", children: ["FILE: ",
                    selectedFile || 'deployment.yaml'] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-1 px-2 py-1 bg-gray-200 dark:bg-slate-700 rounded-lg", children: [/*#__PURE__*/
                      _jsxDEV("button", { className: "px-2 py-0.5 text-xs font-medium bg-white dark:bg-slate-800 rounded text-gray-700 dark:text-gray-300", children: "Unified" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("button", { className: "px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300", children: "Split" }, void 0, false

                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.05 },
                      whileTap: { scale: 0.95 },
                      className: "px-3 py-1 text-xs font-medium bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600", children:
                      "Copy Diff" }, void 0, false

                    )] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/

                _jsxDEV("div", { className: "flex-1 overflow-auto bg-slate-900 p-4", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "font-mono text-sm", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "text-gray-400 mb-4", children: [/*#__PURE__*/
                      _jsxDEV("div", { children: "--- BEFORE (running)" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { children: "+++ AFTER (new update)" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/

                    _jsxDEV("div", { className: "mb-4", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "text-cyan-400 mb-2", children: "@@ spec.replicas @@" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-red-400", children: "- replicas: 2" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-green-400", children: "+ replicas: 3" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/

                    _jsxDEV("div", { className: "mb-4", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "text-cyan-400 mb-2", children: "@@ container resources @@" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-gray-300", children: "            resources:" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-red-400", children: ["-              limits: ", '{}'] }, void 0, true), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-green-400", children: "+              limits:" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-green-400", children: "+                cpu: 200m" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-green-400", children: "+                memory: 256Mi" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/

                    _jsxDEV("div", { className: "mb-4", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "text-cyan-400 mb-2", children: "@@ livenessProbe @@" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-red-400", children: "- # livenessProbe missing" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-green-400", children: "+ livenessProbe:" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-green-400", children: ["+   httpGet: ", '{ path: "/", port: 80 }'] }, void 0, true), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-green-400", children: "+   initialDelaySeconds: 10" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-green-400", children: "+   periodSeconds: 10" }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  ) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "w-80 flex flex-col border-l border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "p-3 border-b border-gray-200 dark:border-slate-700 flex-shrink-0", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV(SparklesIcon, { className: "h-4 w-4 text-purple-500 dark:text-purple-400" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "AI Summary of Changes" }, void 0, false

                    )] }, void 0, true
                  ) }, void 0, false
                ), /*#__PURE__*/

                _jsxDEV("div", { className: "flex-1 overflow-y-auto p-3", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "p-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20", children: /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                        _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("p", { className: "text-xs text-gray-700 dark:text-gray-300", children: "Increased replicas from 2 → 3 to improve resilience" }, void 0, false

                        )] }, void 0, true
                      ) }, void 0, false
                    ), /*#__PURE__*/

                    _jsxDEV("div", { className: "p-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20", children: /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                        _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("p", { className: "text-xs text-gray-700 dark:text-gray-300", children: "Added CPU/Mem limits (200m / 256Mi) to prevent overuse" }, void 0, false

                        )] }, void 0, true
                      ) }, void 0, false
                    ), /*#__PURE__*/

                    _jsxDEV("div", { className: "p-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20", children: /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                        _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("p", { className: "text-xs text-gray-700 dark:text-gray-300", children: "Added missing livenessProbe for better health monitoring" }, void 0, false

                        )] }, void 0, true
                      ) }, void 0, false
                    ), /*#__PURE__*/

                    _jsxDEV("div", { className: "p-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20", children: /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                        _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("p", { className: "text-xs text-gray-700 dark:text-gray-300", children: "Added PodDisruptionBudget (recommended for HA)" }, void 0, false

                        )] }, void 0, true
                      ) }, void 0, false
                    ), /*#__PURE__*/

                    _jsxDEV("div", { className: "mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20", children: [/*#__PURE__*/
                      _jsxDEV("h4", { className: "text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2", children: "Risk Impact Assessment:" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "space-y-1.5 text-xs text-gray-600 dark:text-gray-400", children: [/*#__PURE__*/
                        _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                          _jsxDEV("span", { className: "text-gray-500", children: "•" }, void 0, false), /*#__PURE__*/
                          _jsxDEV("span", { children: "No breaking changes detected" }, void 0, false)] }, void 0, true
                        ), /*#__PURE__*/
                        _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                          _jsxDEV("span", { className: "text-gray-500", children: "•" }, void 0, false), /*#__PURE__*/
                          _jsxDEV("span", { children: "Deployment may restart pods during rollout" }, void 0, false)] }, void 0, true
                        ), /*#__PURE__*/
                        _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                          _jsxDEV("span", { className: "text-gray-500", children: "•" }, void 0, false), /*#__PURE__*/
                          _jsxDEV("span", { children: "Expected rollout duration: ~10 seconds" }, void 0, false)] }, void 0, true
                        )] }, void 0, true
                      )] }, void 0, true
                    )] }, void 0, true
                  ) }, void 0, false
                ), /*#__PURE__*/

                _jsxDEV("div", { className: "p-3 border-t border-gray-200 dark:border-slate-700 flex-shrink-0 space-y-2", children: [/*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    className: "w-full px-3 py-2 text-sm font-medium bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors", children:
                    "Explain Each Change" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    className: "w-full px-3 py-2 text-sm font-medium bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-colors", children:
                    "Suggest Optimal Config" }, void 0, false

                  )] }, void 0, true
                )] }, void 0, true
              )] }, "diff", true
            ),


            activeTab === 'history' && /*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "flex-1 overflow-auto p-6", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Release History" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: ["Current: Revision ",
                  release?.revision] }, void 0, true
                )] }, void 0, true
              ),
              history.length > 0 ? /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-2", children:
                history.map((rev, idx) => {
                  const isCurrent = rev.revision === release?.revision;
                  // Allow rollback to any past revision that was deployed or superseded
                  const canRollback = !isCurrent && (rev.status === 'deployed' || rev.status === 'superseded');

                  return (/*#__PURE__*/
                    _jsxDEV(motion.div, {

                      initial: { opacity: 0, x: -10 },
                      animate: { opacity: 1, x: 0 },
                      transition: { delay: idx * 0.05 },
                      className: `p-3 rounded-xl border transition-all ${
                      isCurrent ?
                      'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30 ring-2 ring-cyan-200 dark:ring-cyan-500/30' :
                      'bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800'}`, children: [/*#__PURE__*/


                      _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                          _jsxDEV("span", { className: `text-sm font-bold ${isCurrent ? 'text-cyan-700 dark:text-cyan-300' : 'text-gray-900 dark:text-white'}`, children: ["Revision ",
                            rev.revision] }, void 0, true
                          ),
                          isCurrent && /*#__PURE__*/
                          _jsxDEV("span", { className: "px-2 py-0.5 text-xs font-medium bg-cyan-600 text-white rounded-full", children: "Current" }, void 0, false

                          ), /*#__PURE__*/

                          _jsxDEV(StatusBadge, { status: rev.status }, void 0, false)] }, void 0, true
                        ), /*#__PURE__*/
                        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                          _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: rev.updated }, void 0, false),
                          canRollback && /*#__PURE__*/
                          _jsxDEV(motion.button, {
                            whileHover: { scale: 1.05 },
                            whileTap: { scale: 0.95 },
                            onClick: () => handleRollback(rev.revision),
                            disabled: saving,
                            className: "flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg transition-colors disabled:opacity-50", children: [/*#__PURE__*/

                            _jsxDEV(ArrowUturnLeftIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Rollback"] }, void 0, true

                          )] }, void 0, true

                        )] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "mt-1.5 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400", children: [/*#__PURE__*/
                        _jsxDEV("span", { children: ["Chart: ", rev.chart, " v", rev.chart_version] }, void 0, true),
                        rev.description && /*#__PURE__*/
                        _jsxDEV("span", { className: "text-gray-500 dark:text-gray-500 italic", children: rev.description }, void 0, false)] }, void 0, true

                      )] }, rev.revision, true
                    ));

                }) }, void 0, false
              ) : /*#__PURE__*/

              _jsxDEV("div", { className: "flex flex-col items-center justify-center py-12", children: [/*#__PURE__*/
                _jsxDEV(ClockIcon, { className: "h-12 w-12 text-gray-300 dark:text-slate-600 mb-4" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "No revision history available" }, void 0, false)] }, void 0, true
              )] }, "history", true

            ),


            activeTab === 'resources' && /*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "flex-1 overflow-auto p-6", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(ServerStackIcon, { className: "h-5 w-5 text-blue-500 dark:text-blue-400" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("h3", { className: "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Kubernetes Resources" }, void 0, false

                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: fetchManifest,
                  disabled: loadingManifest,
                  className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg transition-colors disabled:opacity-50", children: [/*#__PURE__*/

                  _jsxDEV(ArrowPathIcon, { className: `h-3.5 w-3.5 ${loadingManifest ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

                )] }, void 0, true
              ),
              loadingManifest ? /*#__PURE__*/
              _jsxDEV("div", { className: "flex flex-col items-center justify-center py-12", children: [/*#__PURE__*/
                _jsxDEV(ArrowPathIcon, { className: "h-12 w-12 text-gray-300 dark:text-slate-600 mb-4 animate-spin" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Loading resources..." }, void 0, false)] }, void 0, true
              ) :
              manifest ? /*#__PURE__*/
              _jsxDEV("div", { className: "bg-slate-900 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "bg-slate-800 px-4 py-2 border-b border-slate-700", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "text-xs font-mono text-slate-300", children: "manifest.yaml" }, void 0, false), /*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.05 },
                      whileTap: { scale: 0.95 },
                      onClick: () => {
                        navigator.clipboard.writeText(manifest);
                      },
                      className: "flex items-center gap-1 px-2 py-1 text-xs text-slate-300 hover:text-white transition-colors", children: [/*#__PURE__*/

                      _jsxDEV(DocumentDuplicateIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Copy"] }, void 0, true

                    )] }, void 0, true
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "p-4 overflow-auto max-h-[600px]", children: /*#__PURE__*/
                  _jsxDEV("pre", { className: "text-xs font-mono text-slate-100 whitespace-pre", children:
                    manifest }, void 0, false
                  ) }, void 0, false
                )] }, void 0, true
              ) : /*#__PURE__*/

              _jsxDEV("div", { className: "flex flex-col items-center justify-center py-12", children: [/*#__PURE__*/
                _jsxDEV(ServerStackIcon, { className: "h-12 w-12 text-gray-300 dark:text-slate-600 mb-4" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-3", children: "No resources loaded" }, void 0, false), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: fetchManifest,
                  className: "px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg transition-colors", children:
                  "Load Resources" }, void 0, false

                )] }, void 0, true
              )] }, "resources", true

            ),


            activeTab === 'health' && /*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "flex-1 overflow-auto p-6", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(HeartIcon, { className: "h-5 w-5 text-red-500 dark:text-red-400" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("h3", { className: "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Release Health Status" }, void 0, false

                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: fetchHealth,
                  disabled: healthLoading,
                  className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50", children: [/*#__PURE__*/

                  _jsxDEV(ArrowPathIcon, { className: `h-3.5 w-3.5 ${healthLoading ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

                )] }, void 0, true
              ),

              healthLoading ? /*#__PURE__*/
              _jsxDEV("div", { className: "flex flex-col items-center justify-center py-12", children: [/*#__PURE__*/
                _jsxDEV(ArrowPathIcon, { className: "h-12 w-12 text-gray-300 dark:text-slate-600 mb-4 animate-spin" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Loading health data..." }, void 0, false)] }, void 0, true
              ) :
              healthError ? /*#__PURE__*/
              _jsxDEV("div", { className: "flex flex-col items-center justify-center py-12", children: [/*#__PURE__*/
                _jsxDEV(XCircleIcon, { className: "h-12 w-12 text-red-300 dark:text-red-600 mb-4" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-red-600 dark:text-red-400 mb-3", children: healthError }, void 0, false), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: fetchHealth,
                  className: "px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors", children:
                  "Retry" }, void 0, false

                )] }, void 0, true
              ) :
              healthData ? /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

                _jsxDEV("div", { className: "grid grid-cols-3 gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: `p-4 rounded-xl border ${
                    healthData.healthy ?
                    'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' :
                    'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'}`, children: [/*#__PURE__*/

                    _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [
                      healthData.healthy ? /*#__PURE__*/
                      _jsxDEV(CheckCircleIcon, { className: "h-5 w-5 text-emerald-600 dark:text-emerald-400" }, void 0, false) : /*#__PURE__*/

                      _jsxDEV(XCircleIcon, { className: "h-5 w-5 text-red-600 dark:text-red-400" }, void 0, false), /*#__PURE__*/

                      _jsxDEV("span", { className: `text-xs font-semibold uppercase tracking-wider ${
                        healthData.healthy ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`, children:

                        healthData.healthy ? 'Healthy' : 'Unhealthy' }, void 0, false
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: [
                      healthData.ready_pods, "/", healthData.total_pods] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-600 dark:text-gray-400 mt-1", children: "Pods Ready" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { className: "p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
                      _jsxDEV(CubeIcon, { className: "h-5 w-5 text-blue-600 dark:text-blue-400" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400", children: "Total Pods" }, void 0, false

                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: healthData.total_pods }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-600 dark:text-gray-400 mt-1", children: "Running" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { className: "p-4 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
                      _jsxDEV(ClockIcon, { className: "h-5 w-5 text-purple-600 dark:text-purple-400" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400", children: "Events" }, void 0, false

                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: healthData.events?.length || 0 }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-600 dark:text-gray-400 mt-1", children: "Recent" }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                ),


                healthData.pods && healthData.pods.length > 0 && /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3", children: "Pod Details" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "space-y-3", children:
                    healthData.pods.map((pod, idx) => /*#__PURE__*/
                    _jsxDEV("div", {

                      className: `p-4 rounded-xl border ${
                      pod.ready ?
                      'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700' :
                      'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'}`, children: [/*#__PURE__*/


                      _jsxDEV("div", { className: "flex items-start justify-between mb-3", children: [/*#__PURE__*/
                        _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
                          _jsxDEV("div", { className: "flex items-center gap-2 mb-1", children: [
                            pod.ready ? /*#__PURE__*/
                            _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-emerald-500 flex-shrink-0" }, void 0, false) : /*#__PURE__*/

                            _jsxDEV(XCircleIcon, { className: "h-4 w-4 text-red-500 flex-shrink-0" }, void 0, false), /*#__PURE__*/

                            _jsxDEV("span", { className: "text-sm font-medium text-gray-900 dark:text-white truncate", children:
                              pod.name }, void 0, false
                            )] }, void 0, true
                          ), /*#__PURE__*/
                          _jsxDEV("div", { className: "flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400", children: [/*#__PURE__*/
                            _jsxDEV("span", { children: ["Phase: ", /*#__PURE__*/_jsxDEV("span", { className: "font-medium", children: pod.phase }, void 0, false)] }, void 0, true), /*#__PURE__*/
                            _jsxDEV("span", { children: ["Node: ", /*#__PURE__*/_jsxDEV("span", { className: "font-medium", children: pod.node || 'N/A' }, void 0, false)] }, void 0, true)] }, void 0, true
                          )] }, void 0, true
                        ), /*#__PURE__*/
                        _jsxDEV("span", { className: `px-2 py-0.5 rounded-full text-xs font-medium ${
                          pod.phase === 'Running' ?
                          'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                          pod.phase === 'Pending' ?
                          'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' :
                          'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'}`, children:

                          pod.phase }, void 0, false
                        )] }, void 0, true
                      ),


                      pod.containers && pod.containers.length > 0 && /*#__PURE__*/
                      _jsxDEV("div", { className: "space-y-2", children:
                        pod.containers.map((container, cIdx) => /*#__PURE__*/
                        _jsxDEV("div", {

                          className: "flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/

                          _jsxDEV("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [/*#__PURE__*/
                            _jsxDEV("div", { className: `w-2 h-2 rounded-full flex-shrink-0 ${
                              container.ready ? 'bg-emerald-500' : 'bg-red-500'}` }, void 0, false
                            ), /*#__PURE__*/
                            _jsxDEV("span", { className: "text-xs font-medium text-gray-900 dark:text-white truncate", children:
                              container.name }, void 0, false
                            )] }, void 0, true
                          ), /*#__PURE__*/
                          _jsxDEV("div", { className: "flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400", children: [/*#__PURE__*/
                            _jsxDEV("span", { children: ["State: ", /*#__PURE__*/_jsxDEV("span", { className: "font-medium", children: container.state }, void 0, false)] }, void 0, true), /*#__PURE__*/
                            _jsxDEV("span", { children: ["Restarts: ", /*#__PURE__*/_jsxDEV("span", { className: "font-medium", children: container.restartCount }, void 0, false)] }, void 0, true)] }, void 0, true
                          )] }, cIdx, true
                        )
                        ) }, void 0, false
                      )] }, idx, true

                    )
                    ) }, void 0, false
                  )] }, void 0, true
                ),



                healthData.events && healthData.events.length > 0 && /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3", children: "Recent Events" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "space-y-2 max-h-64 overflow-y-auto", children:
                    healthData.events.map((event, idx) => /*#__PURE__*/
                    _jsxDEV("div", {

                      className: `p-3 rounded-lg border ${
                      event.type === 'Warning' ?
                      'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' :
                      'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20'}`, children: /*#__PURE__*/


                      _jsxDEV("div", { className: "flex items-start gap-2", children: [
                        event.type === 'Warning' ? /*#__PURE__*/
                        _jsxDEV(ExclamationTriangleIcon, { className: "h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" }, void 0, false) : /*#__PURE__*/

                        _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/

                        _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
                          _jsxDEV("div", { className: "flex items-center gap-2 mb-1", children: [/*#__PURE__*/
                            _jsxDEV("span", { className: "text-xs font-semibold text-gray-900 dark:text-white", children:
                              event.reason }, void 0, false
                            ),
                            event.count > 1 && /*#__PURE__*/
                            _jsxDEV("span", { className: "px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-slate-600 text-xs font-medium text-gray-700 dark:text-gray-300", children: [
                              event.count, "x"] }, void 0, true
                            )] }, void 0, true

                          ), /*#__PURE__*/
                          _jsxDEV("p", { className: "text-xs text-gray-700 dark:text-gray-300 mb-1", children: event.message }, void 0, false), /*#__PURE__*/
                          _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: event.timestamp }, void 0, false)] }, void 0, true
                        )] }, void 0, true
                      ) }, idx, false
                    )
                    ) }, void 0, false
                  )] }, void 0, true
                ),


                healthData.error && /*#__PURE__*/
                _jsxDEV("div", { className: "p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                    _jsxDEV(XCircleIcon, { className: "h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm font-medium text-red-900 dark:text-red-300 mb-1", children: "Error" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-xs text-red-700 dark:text-red-400", children: healthData.error }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  ) }, void 0, false
                )] }, void 0, true

              ) : /*#__PURE__*/

              _jsxDEV("div", { className: "flex flex-col items-center justify-center py-12", children: [/*#__PURE__*/
                _jsxDEV(HeartIcon, { className: "h-12 w-12 text-gray-300 dark:text-slate-600 mb-4" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-3", children: "No health data loaded" }, void 0, false), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: fetchHealth,
                  className: "px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors", children:
                  "Load Health Status" }, void 0, false

                )] }, void 0, true
              )] }, "health", true

            ),


            activeTab === 'ai' && /*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "flex-1 overflow-auto p-6", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(SparklesIcon, { className: "h-5 w-5 text-purple-500 dark:text-purple-400" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("h3", { className: "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "AI-Powered Analysis" }, void 0, false

                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    onClick: analyzeConfig,
                    disabled: aiLoading || troubleshootLoading,
                    className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-500/20 dark:to-blue-500/20 border border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-medium hover:from-purple-200 hover:to-blue-200 dark:hover:from-purple-500/30 dark:hover:to-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed", children: [/*#__PURE__*/

                    _jsxDEV(WrenchScrewdriverIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Analyze Config"] }, void 0, true

                  ),
                  healthData && !healthData.healthy && /*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    onClick: troubleshootRelease,
                    disabled: aiLoading || troubleshootLoading,
                    className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-500/20 dark:to-orange-500/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium hover:from-red-200 hover:to-orange-200 dark:hover:from-red-500/30 dark:hover:to-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed", children: [/*#__PURE__*/

                    _jsxDEV(ExclamationTriangleIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Diagnose Issues"] }, void 0, true

                  )] }, void 0, true

                )] }, void 0, true
              ),


              (aiLoading || troubleshootLoading) && /*#__PURE__*/
              _jsxDEV("div", { className: "flex flex-col items-center justify-center py-12", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children:
                  aiLoading ? 'Analyzing configuration...' : 'Diagnosing issues...' }, void 0, false
                )] }, void 0, true
              ),



              !aiLoading && !troubleshootLoading && aiError && /*#__PURE__*/
              _jsxDEV("div", { className: "p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                  _jsxDEV(XCircleIcon, { className: "h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm font-medium text-red-900 dark:text-red-300 mb-1", children: "Analysis Error" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-red-700 dark:text-red-400", children: aiError }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                ) }, void 0, false
              ),



              !aiLoading && !troubleshootLoading && !aiError && aiAnalysis && /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/

                _jsxDEV("div", { className: "grid grid-cols-2 gap-3", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 border border-blue-200 dark:border-blue-500/20", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
                      _jsxDEV(ShieldCheckIcon, { className: "h-5 w-5 text-blue-600 dark:text-blue-400" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400", children: "Security Score" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "text-2xl font-bold text-blue-600 dark:text-blue-400", children: [
                      aiAnalysis.security_score, "/100"] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/20", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
                      _jsxDEV(CheckCircleIcon, { className: "h-5 w-5 text-green-600 dark:text-green-400" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400", children: "Production Ready" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children:
                      aiAnalysis.production_ready ? 'Yes' : 'No' }, void 0, false
                    )] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/


                _jsxDEV("div", { className: "p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-2", children: "Analysis" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { className: "text-sm text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none", children:
                    aiAnalysis.analysis }, void 0, false
                  )] }, void 0, true
                ),


                aiAnalysis.issues && aiAnalysis.issues.length > 0 && /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-3", children: "Issues Found" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { className: "space-y-2", children:
                    aiAnalysis.issues.map((issue, idx) => /*#__PURE__*/
                    _jsxDEV(AIInsightCard, {

                      insight: {
                        type: issue.severity === 'critical' || issue.severity === 'high' ? 'warning' :
                        issue.severity === 'medium' ? 'suggestion' : 'info',
                        message: `[${issue.severity.toUpperCase()}] ${issue.issue}`,
                        fix: issue.fix || 'See analysis for details'
                      },
                      onApplyFix: issue.auto_fixable ? () => {
                        logger.debug('Applying fix', issue.fix);
                      } : undefined }, idx, false
                    )
                    ) }, void 0, false
                  )] }, void 0, true
                ),



                aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-3", children: "Recommendations" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { className: "space-y-2", children:
                    aiAnalysis.recommendations.map((rec, idx) => /*#__PURE__*/
                    _jsxDEV("div", { className: "p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20", children: /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                        _jsxDEV(LightBulbIcon, { className: "h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                          _jsxDEV("div", { className: "flex items-center gap-2 mb-1", children: [/*#__PURE__*/
                            _jsxDEV("span", { className: "text-xs font-semibold text-blue-900 dark:text-blue-300", children: rec.title }, void 0, false), /*#__PURE__*/
                            _jsxDEV("span", { className: "text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400", children:
                              rec.priority }, void 0, false
                            )] }, void 0, true
                          ), /*#__PURE__*/
                          _jsxDEV("p", { className: "text-xs text-blue-700 dark:text-blue-400", children: rec.description }, void 0, false)] }, void 0, true
                        )] }, void 0, true
                      ) }, idx, false
                    )
                    ) }, void 0, false
                  )] }, void 0, true
                )] }, void 0, true

              ),



              !aiLoading && !troubleshootLoading && !aiError && troubleshootData && /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/

                _jsxDEV("div", { className: "flex items-center gap-2", children: /*#__PURE__*/
                  _jsxDEV("span", { className: `px-3 py-1 rounded-full text-xs font-semibold ${
                    troubleshootData.severity === 'critical' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' :
                    troubleshootData.severity === 'high' ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400' :
                    troubleshootData.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                    'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'}`, children: [

                    troubleshootData.severity?.toUpperCase() || 'UNKNOWN', " SEVERITY"] }, void 0, true
                  ) }, void 0, false
                ), /*#__PURE__*/


                _jsxDEV("div", { className: "p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-2", children: "Diagnosis" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { className: "text-sm text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none", children:
                    troubleshootData.diagnosis }, void 0, false
                  )] }, void 0, true
                ),


                troubleshootData.root_causes && troubleshootData.root_causes.length > 0 && /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-3", children: "Root Causes" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { className: "space-y-2", children:
                    troubleshootData.root_causes.map((cause, idx) => /*#__PURE__*/
                    _jsxDEV("div", { className: "p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20", children: /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                        _jsxDEV(ExclamationTriangleIcon, { className: "h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("p", { className: "text-xs text-red-700 dark:text-red-400 flex-1", children: cause }, void 0, false)] }, void 0, true
                      ) }, idx, false
                    )
                    ) }, void 0, false
                  )] }, void 0, true
                ),



                troubleshootData.fixes && troubleshootData.fixes.length > 0 && /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-3", children: "Recommended Fixes" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { className: "space-y-2", children:
                    troubleshootData.fixes.map((fix, idx) => /*#__PURE__*/
                    _jsxDEV("div", { className: "p-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20", children: /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                        _jsxDEV(WrenchScrewdriverIcon, { className: "h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                          _jsxDEV("div", { className: "flex items-center gap-2 mb-1", children: [/*#__PURE__*/
                            _jsxDEV("span", { className: "text-xs font-semibold text-green-900 dark:text-green-300", children:
                              fix.type || 'Fix' }, void 0, false
                            ),
                            fix.priority && /*#__PURE__*/
                            _jsxDEV("span", { className: "text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400", children:
                              fix.priority }, void 0, false
                            )] }, void 0, true

                          ), /*#__PURE__*/
                          _jsxDEV("p", { className: "text-xs text-green-700 dark:text-green-400", children: fix.description }, void 0, false)] }, void 0, true
                        )] }, void 0, true
                      ) }, idx, false
                    )
                    ) }, void 0, false
                  )] }, void 0, true
                )] }, void 0, true

              ),



              !aiLoading && !troubleshootLoading && !aiError && !aiAnalysis && !troubleshootData && /*#__PURE__*/
              _jsxDEV("div", { className: "flex flex-col items-center justify-center py-12", children: [/*#__PURE__*/
                _jsxDEV(SparklesIcon, { className: "h-16 w-16 text-purple-300 dark:text-purple-600 mb-4" }, void 0, false), /*#__PURE__*/
                _jsxDEV("h4", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: "No Analysis Yet" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md", children: "Click \"Analyze Config\" to get AI-powered insights on your Helm chart configuration, or \"Diagnose Issues\" to troubleshoot deployment problems." }, void 0, false

                )] }, void 0, true
              )] }, "ai", true

            )] }, void 0, true

          ) }, void 0, false
        ),


        !useFullWidth && /*#__PURE__*/
        _jsxDEV("div", { className: "w-72 flex flex-col border-l border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-y-auto", children: [

          isInstallMode ? /*#__PURE__*/
          _jsxDEV(_Fragment, { children: /*#__PURE__*/
            _jsxDEV("div", { className: "p-3 border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3", children: "Installation Config" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5", children: "Release Name" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("input", {
                    type: "text",
                    value: installReleaseName,
                    onChange: (e) => setInstallReleaseName(e.target.value),
                    placeholder: "my-release",
                    className: "w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500" }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: "Unique name for this deployment" }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5", children: "Namespace" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("input", {
                    type: "text",
                    value: installNamespace,
                    onChange: (e) => setInstallNamespace(e.target.value),
                    placeholder: "default",
                    className: "w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500" }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: "Kubernetes namespace" }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5", children: "Chart Details" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "space-y-1.5 text-xs p-2 bg-gray-50 dark:bg-slate-900/50 rounded-lg", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex justify-between", children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Chart:" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-gray-900 dark:text-gray-300 font-medium", children: chartInfo?.name }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "flex justify-between", children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Version:" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-cyan-600 dark:text-cyan-400 font-medium", children: chartInfo?.version }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "flex justify-between", children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Repo:" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-gray-900 dark:text-gray-300 font-medium", children: chartInfo?.repository }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  )] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            ) }, void 0, false
          ) : /*#__PURE__*/

          _jsxDEV("div", { className: "p-2 border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2", children: "Chart Metadata" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-1.5 text-xs", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex justify-between", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Chart Name:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-900 dark:text-gray-300", children: chartInfo?.name || 'N/A' }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex justify-between", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Version:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-cyan-600 dark:text-cyan-400", children: chartInfo?.version || 'N/A' }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex justify-between", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "App Version:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-900 dark:text-gray-300", children: release?.app_version || '1.25.3' }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex justify-between", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Maintainers:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-900 dark:text-gray-300", children: "Bitnami" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ),
            chartInfo?.description && /*#__PURE__*/
            _jsxDEV("p", { className: "mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed", children:
              chartInfo.description }, void 0, false
            )] }, void 0, true

          ),



          release && /*#__PURE__*/
          _jsxDEV("div", { className: "p-2 border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2", children: "Release Info" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-1.5 text-xs", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex justify-between", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Release:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-900 dark:text-gray-300", children: release.name }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex justify-between items-center", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Status:" }, void 0, false), /*#__PURE__*/
                _jsxDEV(StatusBadge, { status: release.status }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex justify-between", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Last Updated:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-900 dark:text-gray-300", children: release.updated || 'N/A' }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex justify-between", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Revision:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-cyan-600 dark:text-cyan-400", children: release.revision }, void 0, false)] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/



          _jsxDEV("div", { className: "p-2", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(SparklesIcon, { className: "h-4 w-4 text-purple-500 dark:text-purple-400" }, void 0, false), "AI Insights"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-1.5", children:
              aiLoading ? /*#__PURE__*/
              _jsxDEV("div", { className: "p-2 rounded-lg bg-gray-50 dark:bg-slate-700/50 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV(motion.div, {
                  animate: { rotate: 360 },
                  transition: { duration: 1, repeat: Infinity, ease: 'linear' }, children: /*#__PURE__*/

                  _jsxDEV(SparklesIcon, { className: "h-3 w-3" }, void 0, false) }, void 0, false
                ), "Analyzing configuration..."] }, void 0, true

              ) :
              aiAnalysis ? /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [
                aiAnalysis.issues?.slice(0, 2).map((issue, idx) => /*#__PURE__*/
                _jsxDEV("div", {

                  className: `p-2 rounded-lg text-xs ${
                  issue.severity === 'critical' || issue.severity === 'high' ?
                  'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                  issue.severity === 'medium' ?
                  'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                  'bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-400'}`, children: [/*#__PURE__*/


                  _jsxDEV("span", { className: "font-medium", children: [issue.severity?.toUpperCase(), ":"] }, void 0, true), " ", issue.description || issue.message] }, `issue-${idx}`, true
                )
                ),
                aiAnalysis.recommendations?.slice(0, 2).map((rec, idx) => /*#__PURE__*/
                _jsxDEV("div", {

                  className: "p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 text-xs text-cyan-600 dark:text-cyan-400", children: [/*#__PURE__*/

                  _jsxDEV("span", { className: "font-medium", children: "TIP:" }, void 0, false), " ", typeof rec === 'string' ? rec : rec.description || rec.message] }, `rec-${idx}`, true
                )
                )] }, void 0, true
              ) : /*#__PURE__*/

              _jsxDEV("div", { className: "p-2 rounded-lg bg-gray-50 dark:bg-slate-700/50 text-xs text-gray-500 dark:text-gray-400 text-center", children: "Click \"Analyze Config\" to get AI insights" }, void 0, false

              ) }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "mt-3", children: /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                onClick: analyzeConfig,
                disabled: aiLoading || !valuesContent,
                className: "w-full px-2 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1", children: [/*#__PURE__*/

                _jsxDEV(SparklesIcon, { className: "h-3 w-3" }, void 0, false),
                aiLoading ? 'Analyzing...' : 'Analyze Config'] }, void 0, true
              ) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        deploymentProgress.show && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
          onClick: () => {
            if (deploymentProgress.stage === 'error') {
              setDeploymentProgress({ show: false, message: '', stage: 'validating' });
            }
          }, children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.9, opacity: 0 },
            onClick: (e) => e.stopPropagation(),
            className: "bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 p-8 max-w-md w-full mx-4", children: /*#__PURE__*/

            _jsxDEV("div", { className: "flex flex-col items-center text-center", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "mb-6", children:
                deploymentProgress.stage === 'success' ? /*#__PURE__*/
                _jsxDEV(motion.div, {
                  initial: { scale: 0 },
                  animate: { scale: 1 },
                  transition: { type: 'spring', bounce: 0.5 },
                  className: "p-4 rounded-full bg-green-100 dark:bg-green-900/30", children: /*#__PURE__*/

                  _jsxDEV(CheckCircleIcon, { className: "h-12 w-12 text-green-600 dark:text-green-400" }, void 0, false) }, void 0, false
                ) :
                deploymentProgress.stage === 'error' ? /*#__PURE__*/
                _jsxDEV(motion.div, {
                  initial: { scale: 0 },
                  animate: { scale: 1 },
                  transition: { type: 'spring', bounce: 0.5 },
                  className: "p-4 rounded-full bg-red-100 dark:bg-red-900/30", children: /*#__PURE__*/

                  _jsxDEV(XCircleIcon, { className: "h-12 w-12 text-red-600 dark:text-red-400" }, void 0, false) }, void 0, false
                ) : /*#__PURE__*/

                _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
                  _jsxDEV(motion.div, {
                    animate: { rotate: 360 },
                    transition: { duration: 1, repeat: Infinity, ease: 'linear' },
                    className: "p-4 rounded-full bg-cyan-100 dark:bg-cyan-900/30", children: /*#__PURE__*/

                    _jsxDEV(RocketLaunchIcon, { className: "h-12 w-12 text-cyan-600 dark:text-cyan-400" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV(motion.div, {
                    animate: { scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] },
                    transition: { duration: 1.5, repeat: Infinity },
                    className: "absolute inset-0 rounded-full bg-cyan-400/30" }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false

              ), /*#__PURE__*/


              _jsxDEV("h3", { className: "text-xl font-bold text-gray-900 dark:text-white mb-2", children:
                deploymentProgress.message }, void 0, false
              ),


              deploymentProgress.error && /*#__PURE__*/
              _jsxDEV("div", { className: "mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 w-full", children: /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-red-700 dark:text-red-300 text-left", children:
                  deploymentProgress.error }, void 0, false
                ) }, void 0, false
              ),



              deploymentProgress.stage !== 'error' && deploymentProgress.stage !== 'success' && /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-2", children: [
                deploymentProgress.stage === 'validating' && 'Checking configuration syntax...',
                deploymentProgress.stage === 'deploying' && 'Applying changes to cluster...',
                deploymentProgress.stage === 'verifying' && 'Verifying deployment status...'] }, void 0, true
              ),



              deploymentProgress.stage !== 'error' && deploymentProgress.stage !== 'success' && /*#__PURE__*/
              _jsxDEV("div", { className: "w-full mt-6", children: /*#__PURE__*/
                _jsxDEV("div", { className: "h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /*#__PURE__*/
                  _jsxDEV(motion.div, {
                    initial: { width: '0%' },
                    animate: {
                      width: deploymentProgress.stage === 'validating' ? '33%' : deploymentProgress.stage === 'deploying' ? '66%' : '100%'
                    },
                    transition: { duration: 0.5 },
                    className: "h-full bg-gradient-to-r from-cyan-500 to-blue-600" }, void 0, false
                  ) }, void 0, false
                ) }, void 0, false
              ),



              deploymentProgress.stage === 'error' && /*#__PURE__*/
              _jsxDEV("div", { className: "flex flex-col gap-2 mt-6 w-full", children:
                deploymentProgress.isRepoError ? /*#__PURE__*/
                _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    onClick: () => {
                      setDeploymentProgress({ show: false, message: '', stage: 'validating' });
                      navigate('/deploy/helm/catalog');
                    },
                    className: "w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg transition-all", children: [/*#__PURE__*/

                    _jsxDEV(ServerStackIcon, { className: "h-4 w-4" }, void 0, false), "Add Repository"] }, void 0, true

                  ), /*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    onClick: () => setDeploymentProgress({ show: false, message: '', stage: 'validating' }),
                    className: "w-full px-6 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all", children:
                    "Close" }, void 0, false

                  )] }, void 0, true
                ) : /*#__PURE__*/

                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  onClick: () => setDeploymentProgress({ show: false, message: '', stage: 'validating' }),
                  className: "w-full px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg transition-all", children:
                  "Close" }, void 0, false

                ) }, void 0, false

              )] }, void 0, true

            ) }, void 0, false
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showTestModal && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
          onClick: () => setShowTestModal(false), children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.9, opacity: 0 },
            onClick: (e) => e.stopPropagation(),
            className: "bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto", children: /*#__PURE__*/

            _jsxDEV("div", { className: "flex flex-col", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center gap-4 mb-6", children: [/*#__PURE__*/
                _jsxDEV("div", { className: `p-3 rounded-full ${testResult?.success ? 'bg-green-100 dark:bg-green-900/30' : testInProgress ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-red-100 dark:bg-red-900/30'}`, children:
                  testInProgress ? /*#__PURE__*/
                  _jsxDEV(ArrowPathIcon, { className: "h-8 w-8 text-purple-600 dark:text-purple-400 animate-spin" }, void 0, false) :
                  testResult?.success ? /*#__PURE__*/
                  _jsxDEV(CheckCircleIcon, { className: "h-8 w-8 text-green-600 dark:text-green-400" }, void 0, false) : /*#__PURE__*/

                  _jsxDEV(XCircleIcon, { className: "h-8 w-8 text-red-600 dark:text-red-400" }, void 0, false) }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                  _jsxDEV("h3", { className: "text-xl font-bold text-gray-900 dark:text-white", children:
                    testInProgress ? 'Running Tests...' : 'Test Results' }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
                    releaseName, " in ", namespace] }, void 0, true
                  )] }, void 0, true
                )] }, void 0, true
              ),


              testResult && /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV("div", { className: `p-4 rounded-lg border mb-4 ${testResult.success ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`, children: /*#__PURE__*/
                  _jsxDEV("p", { className: `text-sm font-medium ${testResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`, children:
                    testResult.message }, void 0, false
                  ) }, void 0, false
                ),


                testResult.notes && /*#__PURE__*/
                _jsxDEV("div", { className: "mt-4", children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Test Output:" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { className: "bg-slate-900 rounded-lg p-4 overflow-x-auto", children: /*#__PURE__*/
                    _jsxDEV("pre", { className: "text-xs text-green-400 font-mono whitespace-pre-wrap", children:
                      testResult.notes }, void 0, false
                    ) }, void 0, false
                  )] }, void 0, true
                )] }, void 0, true

              ),


              testInProgress && /*#__PURE__*/
              _jsxDEV("div", { className: "text-center py-8", children: /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Running Helm tests... This may take a few minutes." }, void 0, false

                ) }, void 0, false
              ),



              !testInProgress && /*#__PURE__*/
              _jsxDEV("div", { className: "flex justify-end mt-6", children: /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: () => setShowTestModal(false),
                  className: "px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg transition-all", children:
                  "Close" }, void 0, false

                ) }, void 0, false
              )] }, void 0, true

            ) }, void 0, false
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showPreviewModal && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
          onClick: () => setShowPreviewModal(false), children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.9, opacity: 0 },
            onClick: (e) => e.stopPropagation(),
            className: "bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 p-8 max-w-6xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col", children: /*#__PURE__*/

            _jsxDEV("div", { className: "flex flex-col h-full", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center gap-4 mb-6 flex-shrink-0", children: [/*#__PURE__*/
                _jsxDEV("div", { className: `p-3 rounded-full ${previewError ? 'bg-red-100 dark:bg-red-900/30' : previewLoading ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'}`, children:
                  previewLoading ? /*#__PURE__*/
                  _jsxDEV(ArrowPathIcon, { className: "h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" }, void 0, false) :
                  previewError ? /*#__PURE__*/
                  _jsxDEV(XCircleIcon, { className: "h-8 w-8 text-red-600 dark:text-red-400" }, void 0, false) : /*#__PURE__*/

                  _jsxDEV(MagnifyingGlassCircleIcon, { className: "h-8 w-8 text-green-600 dark:text-green-400" }, void 0, false) }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                  _jsxDEV("h3", { className: "text-xl font-bold text-gray-900 dark:text-white", children:
                    previewLoading ? 'Generating Preview...' : 'Preview Changes' }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children:
                    isInstallMode ? `Installing ${installReleaseName} in ${installNamespace}` : `Upgrading ${releaseName} in ${namespace}` }, void 0, false
                  )] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "flex-1 overflow-hidden", children:
                previewLoading ? /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-center h-full", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "text-center", children: /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Running dry-run to preview changes..." }, void 0, false

                    ) }, void 0, false
                  ) }, void 0, false
                ) :
                previewError ? /*#__PURE__*/
                _jsxDEV("div", { className: "p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20", children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm font-medium text-red-700 dark:text-red-300 mb-2", children: "Preview Failed:" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-red-600 dark:text-red-400", children: previewError }, void 0, false)] }, void 0, true
                ) : /*#__PURE__*/

                _jsxDEV("div", { className: "h-full overflow-auto", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "mb-4", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
                      _jsxDEV("h4", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Generated Kubernetes Manifests" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV(motion.button, {
                        whileHover: { scale: 1.05 },
                        whileTap: { scale: 0.95 },
                        onClick: () => {
                          navigator.clipboard.writeText(previewManifest);
                        },
                        className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors", children: [/*#__PURE__*/

                        _jsxDEV(DocumentDuplicateIcon, { className: "h-4 w-4" }, void 0, false), "Copy"] }, void 0, true

                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mb-3", children: ["These resources will be created or updated when you proceed with the ",
                      isInstallMode ? 'installation' : 'upgrade', "."] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "bg-slate-900 rounded-lg p-4 overflow-auto max-h-[calc(85vh-16rem)]", children: /*#__PURE__*/
                    _jsxDEV("pre", { className: "text-xs text-green-400 font-mono whitespace-pre", children:
                      previewManifest }, void 0, false
                    ) }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false

              ),


              !previewLoading && /*#__PURE__*/
              _jsxDEV("div", { className: "flex justify-end gap-3 mt-6 flex-shrink-0", children: [/*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: () => setShowPreviewModal(false),
                  className: "px-6 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all", children:
                  "Close" }, void 0, false

                ),
                !previewError && /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: () => {
                    setShowPreviewModal(false);
                    if (isInstallMode) {
                      handleInstall();
                    } else {
                      handleUpgrade();
                    }
                  },
                  className: "px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg transition-all", children:

                  isInstallMode ? 'Proceed with Install' : 'Proceed with Upgrade' }, void 0, false
                )] }, void 0, true

              )] }, void 0, true

            ) }, void 0, false
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}
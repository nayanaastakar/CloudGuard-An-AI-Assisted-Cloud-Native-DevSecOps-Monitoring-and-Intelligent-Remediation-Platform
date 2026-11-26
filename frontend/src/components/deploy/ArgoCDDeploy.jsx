import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import { argocdApi } from '../../services/api';








import {
  ArrowPathRoundedSquareIcon,
  CodeBracketSquareIcon,
  CloudArrowUpIcon,
  CheckBadgeIcon,
  ClockIcon,
  PlusIcon,
  ArrowPathIcon,
  TrashIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUturnLeftIcon,
  EyeIcon,
  ServerStackIcon,
  LinkIcon,
  XMarkIcon,
  FolderIcon,
  RocketLaunchIcon,
  CubeIcon,
  ArrowDownTrayIcon } from
'@heroicons/react/24/outline';

// Import shared constants
import { containerVariants, itemVariants } from '../../utils/constants';
import { logger } from '../../utils/logger';

// Health status colors
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";const healthStatusColors = {
  Healthy: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/20',
  Progressing: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20',
  Degraded: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20',
  Suspended: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/20',
  Missing: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-500/20',
  Unknown: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-500/20'
};

// Sync status colors
const syncStatusColors = {
  Synced: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/20',
  OutOfSync: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/20',
  Unknown: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-500/20'
};

// Health status icons
const HealthIcon = ({ status }) => {
  switch (status) {
    case 'Healthy':
      return /*#__PURE__*/_jsxDEV(CheckCircleIcon, { className: "h-4 w-4" }, void 0, false);
    case 'Progressing':
      return /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false);
    case 'Degraded':
      return /*#__PURE__*/_jsxDEV(XCircleIcon, { className: "h-4 w-4" }, void 0, false);
    case 'Suspended':
      return /*#__PURE__*/_jsxDEV(ClockIcon, { className: "h-4 w-4" }, void 0, false);
    default:
      return /*#__PURE__*/_jsxDEV(ExclamationTriangleIcon, { className: "h-4 w-4" }, void 0, false);
  }
};

export default function ArgoCDDeploy() {
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configForm, setConfigForm] = useState({
    serverUrl: '',
    token: '',
    username: '',
    password: '',
    insecure: false,
    authMethod: 'token'
  });

  // Deployment state (for deploying ArgoCD itself)
  const [deploymentStatus, setDeploymentStatus] = useState(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployForm, setDeployForm] = useState({
    namespace: 'argocd',
    release_name: 'argocd',
    expose_type: 'ClusterIP',
    ha_enabled: false,
    insecure: true
  });
  const [deployResult, setDeployResult] = useState(



    null);

  // Application state
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedAppHistory, setSelectedAppHistory] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [syncing, setSyncing] = useState(null);
  const [refreshing, setRefreshing] = useState(null);
  const [selectedProject, setSelectedProject] = useState('');

  // Create application form
  const [createForm, setCreateForm] = useState({
    name: '',
    project: 'default',
    repoURL: '',
    path: '',
    targetRevision: 'HEAD',
    destServer: 'https://kubernetes.default.svc',
    destNamespace: 'default',
    autoSync: false,
    selfHeal: false,
    prune: false
  });

  // Check connection and deployment status on mount
  useEffect(() => {
    const initialize = async () => {
      await Promise.all([
      checkConnectionStatus(),
      checkDeploymentStatus()]
      );
    };
    initialize();
  }, []);

  // Auto-connect when ArgoCD is deployed but not connected
  useEffect(() => {
    logger.debug('[ArgoCDDeploy] Auto-connect check', {
      deployed: deploymentStatus?.deployed,
      connected: connectionStatus?.connected,
      serverUrl: deploymentStatus?.server_url
    });

    if (deploymentStatus?.deployed && !connectionStatus?.connected && deploymentStatus.server_url) {
      logger.debug('[ArgoCDDeploy] Conditions met - triggering auto-connect modal');
      // Try to auto-connect with the deployed ArgoCD
      const autoConnect = async () => {
        try {
          // Check if it's an internal cluster URL and convert to localhost
          let serverUrl = deploymentStatus.server_url || '';
          if (serverUrl.includes('.svc.cluster.local')) {
            // Internal cluster URL - use localhost with port-forward
            serverUrl = 'http://localhost:8080';
            logger.debug('[ArgoCDDeploy] Detected internal cluster URL, using localhost:8080 instead');
          }

          // Pre-fill the config form with detected values
          setConfigForm((prev) => ({
            ...prev,
            serverUrl: serverUrl,
            username: 'admin',
            authMethod: 'basic',
            insecure: false
          }));
          logger.debug('[ArgoCDDeploy] Config form pre-filled, showing modal');
          // Show the config modal to let user enter password
          setShowConfigModal(true);
        } catch (err) {
          logger.error('Auto-connect setup failed', err);
        }
      };
      autoConnect();
    } else {
      logger.debug('[ArgoCDDeploy] Auto-connect conditions NOT met');
    }
  }, [deploymentStatus, connectionStatus]);

  const checkConnectionStatus = async () => {
    try {
      const response = await argocdApi.getStatus();
      logger.debug('[ArgoCDDeploy] Connection status response', response.data);
      setConnectionStatus(response.data);
      if (response.data.connected) {
        loadApplications();
        loadProjects();
      }
    } catch (error) {
      logger.error('[ArgoCDDeploy] Failed to check connection status', error);
      setConnectionStatus({ connected: false, message: 'Unable to check status' });
    }
  };

  const checkDeploymentStatus = async () => {
    try {
      const response = await argocdApi.getDeploymentStatus();
      logger.debug('[ArgoCDDeploy] Deployment status response', response.data);
      setDeploymentStatus(response.data);
    } catch (error) {
      logger.error('[ArgoCDDeploy] Failed to check deployment status', error);
      setDeploymentStatus({ deployed: false });
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    setError(null);

    try {
      const response = await argocdApi.deployArgoCD(deployForm);
      if (response.data.success) {
        setShowDeployModal(false);
        setDeployResult({
          success: true,
          admin_password: response.data.admin_password,
          server_url: response.data.server_url
        });

        // Auto-configure connection after successful deployment
        if (response.data.server_url && response.data.admin_password) {
          try {
            const configResponse = await argocdApi.configure({
              serverUrl: response.data.server_url,
              username: 'admin',
              password: response.data.admin_password,
              insecure: deployForm.insecure
            });
            setConnectionStatus(configResponse.data);

            // Load applications and projects if connected
            if (configResponse.data.connected) {
              await Promise.all([
              loadApplications(),
              loadProjects()]
              );
            }
          } catch (configErr) {
            logger.warn('Auto-configuration failed, but deployment succeeded', configErr);
          }
        }

        // Refresh statuses
        await checkDeploymentStatus();
        await checkConnectionStatus();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Deployment failed';
      setError(errorMessage);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleUninstall = async () => {
    if (!confirm('Are you sure you want to uninstall ArgoCD? This will remove all applications and data.')) {
      return;
    }

    try {
      await argocdApi.uninstallArgoCD(deployForm.namespace, deployForm.release_name, true);
      setDeploymentStatus({ deployed: false });
      setConnectionStatus({ connected: false, message: 'ArgoCD uninstalled' });
      setApplications([]);
      setProjects([]);
    } catch (err) {
      logger.error('Failed to uninstall ArgoCD', err);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const config = {
        serverUrl: configForm.serverUrl,
        token: configForm.authMethod === 'token' ? configForm.token : undefined,
        username: configForm.authMethod === 'basic' ? configForm.username : undefined,
        password: configForm.authMethod === 'basic' ? configForm.password : undefined,
        insecure: configForm.insecure
      };

      const response = await argocdApi.configure(config);
      setConnectionStatus(response.data);

      if (response.data.connected) {
        setShowConfigModal(false);
        loadApplications();
        loadProjects();
      } else {
        setError(response.data.message || 'Failed to connect');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await argocdApi.disconnect();
      setConnectionStatus({ connected: false, message: 'Disconnected' });
      setApplications([]);
      setProjects([]);
    } catch (err) {
      logger.error('Failed to disconnect', err);
    }
  };

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Safety timeout - force loading to false after 35 seconds
    const timeoutId = setTimeout(() => {
      logger.warn('[ArgoCDDeploy] Loading timeout - forcing loading state to false');
      setLoading(false);
      setError('Request timed out. Please try again.');
    }, 35000);

    try {
      const response = await argocdApi.listApplications(selectedProject || undefined);
      clearTimeout(timeoutId);
      setApplications(response.data.applications);
      setError(null);
    } catch (err) {
      clearTimeout(timeoutId);
      logger.error('Failed to load applications', err);
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to load applications';
      setError(errorMessage);
      setApplications([]);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      const response = await argocdApi.listProjects();
      setProjects(response.data.projects);
    } catch (err) {
      logger.error('Failed to load projects', err);
    }
  };

  useEffect(() => {
    if (connectionStatus?.connected) {
      loadApplications();
    }
  }, [selectedProject, connectionStatus?.connected, loadApplications]);

  const handleViewApplication = async (name) => {
    try {
      const [appResponse, historyResponse] = await Promise.all([
      argocdApi.getApplication(name),
      argocdApi.getApplicationHistory(name)]
      );
      setSelectedApp(appResponse.data);
      setSelectedAppHistory(historyResponse.data.history);
      setShowDetailModal(true);
    } catch (err) {
      logger.error('Failed to load application', err);
    }
  };

  const handleSyncApplication = async (name) => {
    setSyncing(name);
    try {
      await argocdApi.syncApplication(name);
      await loadApplications();
    } catch (err) {
      logger.error('Failed to sync application', err);
    } finally {
      setSyncing(null);
    }
  };

  const handleRefreshApplication = async (name) => {
    setRefreshing(name);
    try {
      await argocdApi.refreshApplication(name);
      await loadApplications();
    } catch (err) {
      logger.error('Failed to refresh application', err);
    } finally {
      setRefreshing(null);
    }
  };

  const handleDeleteApplication = async (name) => {
    if (!confirm(`Are you sure you want to delete application "${name}"?`)) {
      return;
    }

    try {
      await argocdApi.deleteApplication(name);
      await loadApplications();
      setShowDetailModal(false);
    } catch (err) {
      logger.error('Failed to delete application', err);
    }
  };

  const handleRollback = async (name, revisionId) => {
    if (!confirm(`Rollback "${name}" to revision ${revisionId}?`)) {
      return;
    }

    try {
      await argocdApi.rollbackApplication(name, { id: revisionId });
      await loadApplications();
      if (selectedApp?.name === name) {
        handleViewApplication(name);
      }
    } catch (err) {
      logger.error('Failed to rollback application', err);
    }
  };

  const handleCreateApplication = async () => {
    try {
      await argocdApi.createApplication(createForm);
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        project: 'default',
        repoURL: '',
        path: '',
        targetRevision: 'HEAD',
        destServer: 'https://kubernetes.default.svc',
        destNamespace: 'default',
        autoSync: false,
        selfHeal: false,
        prune: false
      });
      await loadApplications();
    } catch (err) {
      logger.error('Failed to create application', err);
    }
  };

  // Not connected - show configuration options
  if (!connectionStatus?.connected) {
    return (/*#__PURE__*/
      _jsxDEV(motion.div, {
        variants: containerVariants,
        initial: "hidden",
        animate: "visible",
        className: "space-y-6", children: [


        deployResult?.success && /*#__PURE__*/
        _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
          _jsxDEV(GlassCard, { className: "p-6 border-2 border-green-500/30 bg-green-50/50 dark:bg-green-500/10", children: /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-start gap-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-2 rounded-xl bg-green-100 dark:bg-green-500/20", children: /*#__PURE__*/
                _jsxDEV(CheckCircleIcon, { className: "h-6 w-6 text-green-600 dark:text-green-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-lg font-semibold text-green-700 dark:text-green-400 mb-2", children: "ArgoCD Deployed Successfully!" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("div", { className: "space-y-2 text-sm", children: [
                  deployResult.server_url && /*#__PURE__*/
                  _jsxDEV("p", { className: "text-gray-600 dark:text-gray-400", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "font-medium", children: "Server URL:" }, void 0, false), " ", deployResult.server_url] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("p", { className: "text-gray-600 dark:text-gray-400", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "font-medium", children: "Username:" }, void 0, false), " admin"] }, void 0, true
                  ),
                  deployResult.admin_password && /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "font-medium text-gray-600 dark:text-gray-400", children: "Password:" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("code", { className: "px-2 py-1 bg-gray-100 dark:bg-slate-800 rounded text-xs", children:
                      deployResult.admin_password }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("button", {
                      onClick: () => navigator.clipboard.writeText(deployResult.admin_password),
                      className: "text-xs text-primary-600 hover:underline", children:
                      "Copy" }, void 0, false

                    )] }, void 0, true
                  )] }, void 0, true

                ), /*#__PURE__*/
                _jsxDEV("p", { className: "mt-3 text-xs text-amber-600 dark:text-amber-400", children: "Save these credentials - the password won't be shown again after you close this." }, void 0, false

                )] }, void 0, true
              )] }, void 0, true
            ) }, void 0, false
          ) }, void 0, false
        ), /*#__PURE__*/



        _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
          _jsxDEV(GlassCard, { className: "relative overflow-hidden", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-br from-primary-500/5 via-purple-500/5 to-pink-500/5" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "relative p-8 text-center", children: [/*#__PURE__*/
              _jsxDEV(motion.div, {
                initial: { scale: 0.8, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                transition: { duration: 0.5 },
                className: "inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 mb-6", children: /*#__PURE__*/

                _jsxDEV(ArrowPathRoundedSquareIcon, { className: "h-10 w-10 text-primary-600 dark:text-primary-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/

              _jsxDEV(motion.h2, {
                initial: { y: 20, opacity: 0 },
                animate: { y: 0, opacity: 1 },
                transition: { delay: 0.1 },
                className: "text-2xl font-bold text-gray-900 dark:text-white mb-3", children:
                "ArgoCD Integration" }, void 0, false

              ), /*#__PURE__*/

              _jsxDEV(motion.p, {
                initial: { y: 20, opacity: 0 },
                animate: { y: 0, opacity: 1 },
                transition: { delay: 0.2 },
                className: "text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-6", children:
                "Deploy a new ArgoCD instance or connect to an existing one to manage GitOps deployments." }, void 0, false

              ), /*#__PURE__*/


              _jsxDEV(motion.div, {
                initial: { y: 20, opacity: 0 },
                animate: { y: 0, opacity: 1 },
                transition: { delay: 0.3 },
                className: "flex flex-col sm:flex-row items-center justify-center gap-4", children: [/*#__PURE__*/

                _jsxDEV("button", {
                  onClick: () => setShowDeployModal(true),
                  className: "inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors", children: [/*#__PURE__*/

                  _jsxDEV(RocketLaunchIcon, { className: "h-5 w-5" }, void 0, false), "Deploy ArgoCD"] }, void 0, true

                ), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-400", children: "or" }, void 0, false), /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => setShowConfigModal(true),
                  className: "inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 font-medium transition-colors", children: [/*#__PURE__*/

                  _jsxDEV(LinkIcon, { className: "h-5 w-5" }, void 0, false), "Connect Existing"] }, void 0, true

                )] }, void 0, true
              ),


              deploymentStatus?.deployed && /*#__PURE__*/
              _jsxDEV(motion.div, {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                className: "mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-sm", children: [/*#__PURE__*/

                _jsxDEV(CubeIcon, { className: "h-4 w-4" }, void 0, false), "ArgoCD is deployed (v",
                deploymentStatus.app_version || deploymentStatus.chart_version, ")", /*#__PURE__*/
                _jsxDEV("span", { className: "mx-2", children: "•" }, void 0, false), /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => {
                    if (deploymentStatus.server_url) {
                      setConfigForm((prev) => ({
                        ...prev,
                        serverUrl: deploymentStatus.server_url,
                        authMethod: 'basic',
                        username: 'admin'
                      }));
                      setShowConfigModal(true);
                    }
                  },
                  className: "underline hover:no-underline", children:
                  "Connect" }, void 0, false

                )] }, void 0, true
              )] }, void 0, true

            )] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV(motion.div, { variants: itemVariants, children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4", children: "Features" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children:
            [
            {
              icon: CodeBracketSquareIcon,
              title: 'GitOps Workflows',
              description: 'Declarative continuous delivery with Git as the source of truth'
            },
            {
              icon: ArrowPathRoundedSquareIcon,
              title: 'Automated Sync',
              description: 'Automatic synchronization of application state with Git repository'
            },
            {
              icon: CheckBadgeIcon,
              title: 'Health Monitoring',
              description: 'Real-time health status and drift detection for all applications'
            },
            {
              icon: ClockIcon,
              title: 'Rollback & History',
              description: 'Easy rollback to any previous version with full deployment history'
            }].
            map((feature, index) => /*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.1 * index }, children: /*#__PURE__*/

              _jsxDEV(GlassCard, { className: "p-5 h-full", variant: "hover", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-start gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "p-2.5 rounded-xl bg-primary-100 dark:bg-primary-500/10 flex-shrink-0", children: /*#__PURE__*/
                    _jsxDEV(feature.icon, { className: "h-5 w-5 text-primary-600 dark:text-primary-400" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("h4", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-1", children:
                      feature.title }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children:
                      feature.description }, void 0, false
                    )] }, void 0, true
                  )] }, void 0, true
                ) }, void 0, false
              ) }, feature.title, false
            )
            ) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV(AnimatePresence, { children:
          showConfigModal && /*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50",
            onClick: () => setShowConfigModal(false), children: /*#__PURE__*/

            _jsxDEV(motion.div, {
              initial: { scale: 0.95, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              exit: { scale: 0.95, opacity: 0 },
              className: "w-full max-w-md",
              onClick: (e) => e.stopPropagation(), children: /*#__PURE__*/

              _jsxDEV(GlassCard, { className: "p-6", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-between mb-6", children: [/*#__PURE__*/
                  _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Connect to ArgoCD" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => setShowConfigModal(false),
                    className: "p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700", children: /*#__PURE__*/

                    _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) }, void 0, false
                  )] }, void 0, true
                ),

                error && /*#__PURE__*/
                _jsxDEV("div", { className: "mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-sm", children:
                  error }, void 0, false
                ), /*#__PURE__*/


                _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Server URL" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("input", {
                      type: "url",
                      value: configForm.serverUrl,
                      onChange: (e) => setConfigForm({ ...configForm, serverUrl: e.target.value }),
                      placeholder: "https://argocd.example.com",
                      className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Authentication Method" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "flex gap-4", children: [/*#__PURE__*/
                      _jsxDEV("label", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                        _jsxDEV("input", {
                          type: "radio",
                          value: "token",
                          checked: configForm.authMethod === 'token',
                          onChange: (e) => setConfigForm({ ...configForm, authMethod: e.target.value }),
                          className: "text-primary-600" }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "API Token" }, void 0, false)] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("label", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                        _jsxDEV("input", {
                          type: "radio",
                          value: "basic",
                          checked: configForm.authMethod === 'basic',
                          onChange: (e) => setConfigForm({ ...configForm, authMethod: e.target.value }),
                          className: "text-primary-600" }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Username/Password" }, void 0, false)] }, void 0, true
                      )] }, void 0, true
                    )] }, void 0, true
                  ),

                  configForm.authMethod === 'token' ? /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "API Token" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("input", {
                      type: "password",
                      value: configForm.token,
                      onChange: (e) => setConfigForm({ ...configForm, token: e.target.value }),
                      placeholder: "Enter API token",
                      className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" }, void 0, false
                    )] }, void 0, true
                  ) : /*#__PURE__*/

                  _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Username" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("input", {
                        type: "text",
                        value: configForm.username,
                        onChange: (e) => setConfigForm({ ...configForm, username: e.target.value }),
                        placeholder: "admin",
                        className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" }, void 0, false
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Password" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("input", {
                        type: "password",
                        value: configForm.password,
                        onChange: (e) => setConfigForm({ ...configForm, password: e.target.value }),
                        placeholder: "Enter password",
                        className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" }, void 0, false
                      )] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/


                  _jsxDEV("label", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("input", {
                      type: "checkbox",
                      checked: configForm.insecure,
                      onChange: (e) => setConfigForm({ ...configForm, insecure: e.target.checked }),
                      className: "rounded text-primary-600" }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Skip TLS verification (insecure)" }, void 0, false

                    )] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/

                _jsxDEV("div", { className: "flex gap-3 mt-6", children: [/*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => setShowConfigModal(false),
                    className: "flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700", children:
                    "Cancel" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: handleConnect,
                    disabled: isConnecting || !configForm.serverUrl,
                    className: "flex-1 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2", children:

                    isConnecting ? /*#__PURE__*/
                    _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                      _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Connecting..."] }, void 0, true

                    ) :

                    'Connect' }, void 0, false

                  )] }, void 0, true
                )] }, void 0, true
              ) }, void 0, false
            ) }, void 0, false
          ) }, void 0, false

        ), /*#__PURE__*/


        _jsxDEV(AnimatePresence, { children:
          showDeployModal && /*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50",
            onClick: () => setShowDeployModal(false), children: /*#__PURE__*/

            _jsxDEV(motion.div, {
              initial: { scale: 0.95, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              exit: { scale: 0.95, opacity: 0 },
              className: "w-full max-w-md",
              onClick: (e) => e.stopPropagation(), children: /*#__PURE__*/

              _jsxDEV(GlassCard, { className: "p-6", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-between mb-6", children: [/*#__PURE__*/
                  _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Deploy ArgoCD" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => setShowDeployModal(false),
                    className: "p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700", children: /*#__PURE__*/

                    _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) }, void 0, false
                  )] }, void 0, true
                ),

                error && /*#__PURE__*/
                _jsxDEV("div", { className: "mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-sm", children:
                  error }, void 0, false
                ), /*#__PURE__*/


                _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Namespace" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("input", {
                        type: "text",
                        value: deployForm.namespace,
                        onChange: (e) => setDeployForm({ ...deployForm, namespace: e.target.value }),
                        placeholder: "argocd",
                        className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white" }, void 0, false
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Release Name" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("input", {
                        type: "text",
                        value: deployForm.release_name,
                        onChange: (e) => setDeployForm({ ...deployForm, release_name: e.target.value }),
                        placeholder: "argocd",
                        className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white" }, void 0, false
                      )] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Service Type" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("select", {
                      value: deployForm.expose_type,
                      onChange: (e) => setDeployForm({ ...deployForm, expose_type: e.target.value }),
                      className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white", children: [/*#__PURE__*/

                      _jsxDEV("option", { value: "ClusterIP", children: "ClusterIP (Internal only)" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("option", { value: "LoadBalancer", children: "LoadBalancer (External IP)" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("option", { value: "NodePort", children: "NodePort" }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                      _jsxDEV("input", {
                        type: "checkbox",
                        checked: deployForm.ha_enabled,
                        onChange: (e) => setDeployForm({ ...deployForm, ha_enabled: e.target.checked }),
                        className: "rounded text-primary-600" }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Enable High Availability" }, void 0, false

                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("label", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                      _jsxDEV("input", {
                        type: "checkbox",
                        checked: deployForm.insecure,
                        onChange: (e) => setDeployForm({ ...deployForm, insecure: e.target.checked }),
                        className: "rounded text-primary-600" }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Disable TLS (for development)" }, void 0, false

                      )] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { className: "p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-sm text-blue-700 dark:text-blue-400", children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "font-medium mb-1", children: "What this will do:" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("ul", { className: "list-disc list-inside space-y-1 text-xs", children: [/*#__PURE__*/
                      _jsxDEV("li", { children: "Install ArgoCD via Helm chart" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("li", { children: ["Create namespace \"", deployForm.namespace, "\""] }, void 0, true), /*#__PURE__*/
                      _jsxDEV("li", { children: "Generate admin credentials" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("li", { children: "Auto-connect after deployment" }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/

                _jsxDEV("div", { className: "flex gap-3 mt-6", children: [/*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => setShowDeployModal(false),
                    className: "flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700", children:
                    "Cancel" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: handleDeploy,
                    disabled: isDeploying,
                    className: "flex-1 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2", children:

                    isDeploying ? /*#__PURE__*/
                    _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                      _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Deploying..."] }, void 0, true

                    ) : /*#__PURE__*/

                    _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                      _jsxDEV(ArrowDownTrayIcon, { className: "h-4 w-4" }, void 0, false), "Deploy"] }, void 0, true

                    ) }, void 0, false

                  )] }, void 0, true
                )] }, void 0, true
              ) }, void 0, false
            ) }, void 0, false
          ) }, void 0, false

        )] }, void 0, true
      ));

  }

  // Connected - show applications dashboard
  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      variants: containerVariants,
      initial: "hidden",
      animate: "visible",
      className: "space-y-6", children: [/*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV(GlassCard, { className: "p-4", children: /*#__PURE__*/
          _jsxDEV("div", { className: "flex flex-col sm:flex-row sm:items-center justify-start gap-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-2 rounded-xl bg-green-100 dark:bg-green-500/20", children: /*#__PURE__*/
                _jsxDEV(CheckCircleIcon, { className: "h-5 w-5 text-green-600 dark:text-green-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "ArgoCD Connected" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
                  connectionStatus.serverUrl, " • v", connectionStatus.version] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => loadApplications(),
                className: "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400",
                title: "Refresh", children: /*#__PURE__*/

                _jsxDEV(ArrowPathIcon, { className: `h-5 w-5 ${loading ? 'animate-spin' : ''}` }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => setShowCreateModal(true),
                className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700", children: [/*#__PURE__*/

                _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "New App"] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV("button", {
                onClick: handleDisconnect,
                className: "px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700", children:
                "Disconnect" }, void 0, false

              ),
              deploymentStatus?.deployed && /*#__PURE__*/
              _jsxDEV("button", {
                onClick: handleUninstall,
                className: "px-4 py-2 rounded-lg border border-red-300 dark:border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10",
                title: "Uninstall ArgoCD from cluster", children: /*#__PURE__*/

                _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
              )] }, void 0, true

            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false
      ),


      projects.length > 0 && /*#__PURE__*/
      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV(FolderIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false), /*#__PURE__*/
          _jsxDEV("select", {
            value: selectedProject,
            onChange: (e) => setSelectedProject(e.target.value),
            className: "px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm", children: [/*#__PURE__*/

            _jsxDEV("option", { value: "", children: "All Projects" }, void 0, false),
            projects.map((project) => /*#__PURE__*/
            _jsxDEV("option", { value: project.name, children:
              project.name }, project.name, false
            )
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
            applications.length, " application", applications.length !== 1 ? 's' : ''] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/



      _jsxDEV(motion.div, { variants: itemVariants, children:
        loading && applications.length === 0 ? /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-center py-12", children: /*#__PURE__*/
          _jsxDEV(ArrowPathIcon, { className: "h-8 w-8 text-gray-400 animate-spin" }, void 0, false) }, void 0, false
        ) :
        applications.length === 0 ? /*#__PURE__*/
        _jsxDEV(GlassCard, { className: "p-8 text-center", children: [/*#__PURE__*/
          _jsxDEV(CloudArrowUpIcon, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }, void 0, false), /*#__PURE__*/
          _jsxDEV("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "No Applications" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 mb-4", children: "Create your first ArgoCD application to get started" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => setShowCreateModal(true),
            className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700", children: [/*#__PURE__*/

            _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "Create Application"] }, void 0, true

          )] }, void 0, true
        ) : /*#__PURE__*/

        _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children:
          applications.map((app) => /*#__PURE__*/
          _jsxDEV(motion.div, {

            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 }, children: /*#__PURE__*/

            _jsxDEV(GlassCard, { className: "p-4 h-full", variant: "hover", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-start justify-between mb-3", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(ServerStackIcon, { className: "h-5 w-5 text-primary-600 dark:text-primary-400" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("h3", { className: "font-medium text-gray-900 dark:text-white truncate", children:
                    app.name }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-1", children: /*#__PURE__*/
                  _jsxDEV("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${healthStatusColors[app.healthStatus] || healthStatusColors.Unknown}`, children: [/*#__PURE__*/
                    _jsxDEV(HealthIcon, { status: app.healthStatus }, void 0, false),
                    app.healthStatus] }, void 0, true
                  ) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("div", { className: "space-y-2 text-sm mb-4", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2 text-gray-600 dark:text-gray-400", children: [/*#__PURE__*/
                  _jsxDEV(LinkIcon, { className: "h-4 w-4 flex-shrink-0" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "truncate", children: app.repoURL }, void 0, false)] }, void 0, true
                ),
                app.path && /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2 text-gray-600 dark:text-gray-400", children: [/*#__PURE__*/
                  _jsxDEV(FolderIcon, { className: "h-4 w-4 flex-shrink-0" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "truncate", children: app.path }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/

                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${syncStatusColors[app.syncStatus] || syncStatusColors.Unknown}`, children:
                    app.syncStatus }, void 0, false
                  ),
                  app.syncRevision && /*#__PURE__*/
                  _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400 truncate", children: ["@ ",
                    app.syncRevision.substring(0, 7)] }, void 0, true
                  )] }, void 0, true

                )] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-slate-700", children: [/*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => handleViewApplication(app.name),
                  className: "flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700", children: [/*#__PURE__*/

                  _jsxDEV(EyeIcon, { className: "h-4 w-4" }, void 0, false), "View"] }, void 0, true

                ), /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => handleSyncApplication(app.name),
                  disabled: syncing === app.name,
                  className: "flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 disabled:opacity-50", children: [/*#__PURE__*/

                  _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${syncing === app.name ? 'animate-spin' : ''}` }, void 0, false), "Sync"] }, void 0, true

                ), /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => handleRefreshApplication(app.name),
                  disabled: refreshing === app.name,
                  className: "p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50",
                  title: "Refresh", children: /*#__PURE__*/

                  _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${refreshing === app.name ? 'animate-spin' : ''}` }, void 0, false) }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            ) }, app.name, false
          )
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showCreateModal && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50",
          onClick: () => setShowCreateModal(false), children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            initial: { scale: 0.95, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.95, opacity: 0 },
            className: "w-full max-w-lg max-h-[90vh] overflow-y-auto",
            onClick: (e) => e.stopPropagation(), children: /*#__PURE__*/

            _jsxDEV(GlassCard, { className: "p-6", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between mb-6", children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Create Application" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => setShowCreateModal(false),
                  className: "p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700", children: /*#__PURE__*/

                  _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Application Name" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("input", {
                      type: "text",
                      value: createForm.name,
                      onChange: (e) => setCreateForm({ ...createForm, name: e.target.value }),
                      placeholder: "my-app",
                      className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white" }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Project" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("select", {
                      value: createForm.project,
                      onChange: (e) => setCreateForm({ ...createForm, project: e.target.value }),
                      className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white", children: [/*#__PURE__*/

                      _jsxDEV("option", { value: "default", children: "default" }, void 0, false),
                      projects.map((p) => /*#__PURE__*/
                      _jsxDEV("option", { value: p.name, children: p.name }, p.name, false)
                      )] }, void 0, true
                    )] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/

                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Repository URL" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("input", {
                    type: "url",
                    value: createForm.repoURL,
                    onChange: (e) => setCreateForm({ ...createForm, repoURL: e.target.value }),
                    placeholder: "https://github.com/org/repo",
                    className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white" }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/

                _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Path" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("input", {
                      type: "text",
                      value: createForm.path,
                      onChange: (e) => setCreateForm({ ...createForm, path: e.target.value }),
                      placeholder: "./manifests",
                      className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white" }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Target Revision" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("input", {
                      type: "text",
                      value: createForm.targetRevision,
                      onChange: (e) => setCreateForm({ ...createForm, targetRevision: e.target.value }),
                      placeholder: "HEAD",
                      className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white" }, void 0, false
                    )] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/

                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Destination Server" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("input", {
                    type: "text",
                    value: createForm.destServer,
                    onChange: (e) => setCreateForm({ ...createForm, destServer: e.target.value }),
                    placeholder: "https://kubernetes.default.svc",
                    className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white" }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/

                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Destination Namespace" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("input", {
                    type: "text",
                    value: createForm.destNamespace,
                    onChange: (e) => setCreateForm({ ...createForm, destNamespace: e.target.value }),
                    placeholder: "default",
                    className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white" }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/

                _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("input", {
                      type: "checkbox",
                      checked: createForm.autoSync,
                      onChange: (e) => setCreateForm({ ...createForm, autoSync: e.target.checked }),
                      className: "rounded text-primary-600" }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Enable Auto-Sync" }, void 0, false

                    )] }, void 0, true
                  ),
                  createForm.autoSync && /*#__PURE__*/
                  _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "flex items-center gap-2 ml-6", children: [/*#__PURE__*/
                      _jsxDEV("input", {
                        type: "checkbox",
                        checked: createForm.selfHeal,
                        onChange: (e) => setCreateForm({ ...createForm, selfHeal: e.target.checked }),
                        className: "rounded text-primary-600" }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Self Heal" }, void 0, false

                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("label", { className: "flex items-center gap-2 ml-6", children: [/*#__PURE__*/
                      _jsxDEV("input", {
                        type: "checkbox",
                        checked: createForm.prune,
                        onChange: (e) => setCreateForm({ ...createForm, prune: e.target.checked }),
                        className: "rounded text-primary-600" }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Prune Resources" }, void 0, false

                      )] }, void 0, true
                    )] }, void 0, true
                  )] }, void 0, true

                )] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("div", { className: "flex gap-3 mt-6", children: [/*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => setShowCreateModal(false),
                  className: "flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700", children:
                  "Cancel" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: handleCreateApplication,
                  disabled: !createForm.name || !createForm.repoURL,
                  className: "flex-1 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed", children:
                  "Create" }, void 0, false

                )] }, void 0, true
              )] }, void 0, true
            ) }, void 0, false
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showDetailModal && selectedApp && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50",
          onClick: () => setShowDetailModal(false), children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            initial: { scale: 0.95, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.95, opacity: 0 },
            className: "w-full max-w-2xl max-h-[90vh] overflow-y-auto",
            onClick: (e) => e.stopPropagation(), children: /*#__PURE__*/

            _jsxDEV(GlassCard, { className: "p-6", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between mb-6", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                  _jsxDEV(ServerStackIcon, { className: "h-6 w-6 text-primary-600 dark:text-primary-400" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children:
                    selectedApp.name }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => setShowDetailModal(false),
                  className: "p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700", children: /*#__PURE__*/

                  _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "flex items-center gap-4 mb-6", children: [/*#__PURE__*/
                _jsxDEV("span", { className: `inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${healthStatusColors[selectedApp.status.health.status] || healthStatusColors.Unknown}`, children: [/*#__PURE__*/
                  _jsxDEV(HealthIcon, { status: selectedApp.status.health.status }, void 0, false),
                  selectedApp.status.health.status] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("span", { className: `inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${syncStatusColors[selectedApp.status.sync.status] || syncStatusColors.Unknown}`, children:
                  selectedApp.status.sync.status }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "space-y-4 mb-6", children: /*#__PURE__*/
                _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Project" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children:
                      selectedApp.project }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Namespace" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children:
                      selectedApp.spec.destination.namespace }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "col-span-2", children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Repository" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white break-all", children:
                      selectedApp.spec.source.repoURL }, void 0, false
                    )] }, void 0, true
                  ),
                  selectedApp.spec.source.path && /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Path" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children:
                      selectedApp.spec.source.path }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Target Revision" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children:
                      selectedApp.spec.source.targetRevision }, void 0, false
                    )] }, void 0, true
                  )] }, void 0, true
                ) }, void 0, false
              ),


              selectedAppHistory.length > 0 && /*#__PURE__*/
              _jsxDEV("div", { className: "mb-6", children: [/*#__PURE__*/
                _jsxDEV("h4", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-3", children: "Revision History" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("div", { className: "space-y-2 max-h-48 overflow-y-auto", children:
                  selectedAppHistory.map((entry) => /*#__PURE__*/
                  _jsxDEV("div", {

                    className: "flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-800", children: [/*#__PURE__*/

                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: ["Revision ",
                        entry.id] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
                        entry.revision.substring(0, 7), " • ", entry.deployedAt || 'N/A'] }, void 0, true
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("button", {
                      onClick: () => handleRollback(selectedApp.name, entry.id),
                      className: "inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10", children: [/*#__PURE__*/

                      _jsxDEV(ArrowUturnLeftIcon, { className: "h-3 w-3" }, void 0, false), "Rollback"] }, void 0, true

                    )] }, entry.id, true
                  )
                  ) }, void 0, false
                )] }, void 0, true
              ),



              selectedApp.status.resources.length > 0 && /*#__PURE__*/
              _jsxDEV("div", { className: "mb-6", children: [/*#__PURE__*/
                _jsxDEV("h4", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-3", children: ["Resources (",
                  selectedApp.status.resources.length, ")"] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "space-y-1 max-h-48 overflow-y-auto", children:
                  selectedApp.status.resources.map((resource, idx) => /*#__PURE__*/
                  _jsxDEV("div", {

                    className: "flex items-center justify-between p-2 rounded text-sm", children: [/*#__PURE__*/

                    _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                      _jsxDEV(ChevronRightIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-gray-900 dark:text-white", children: [
                        resource.kind, "/", resource.name] }, void 0, true
                      ),
                      resource.namespace && /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs text-gray-500", children: ["(",
                        resource.namespace, ")"] }, void 0, true
                      )] }, void 0, true

                    ),
                    resource.health && /*#__PURE__*/
                    _jsxDEV("span", { className: `text-xs px-2 py-0.5 rounded ${healthStatusColors[resource.health] || ''}`, children:
                      resource.health }, void 0, false
                    )] }, idx, true

                  )
                  ) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/



              _jsxDEV("div", { className: "flex gap-3 pt-4 border-t border-gray-100 dark:border-slate-700", children: [/*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => handleSyncApplication(selectedApp.name),
                  disabled: syncing === selectedApp.name,
                  className: "flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50", children: [/*#__PURE__*/

                  _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${syncing === selectedApp.name ? 'animate-spin' : ''}` }, void 0, false), "Sync"] }, void 0, true

                ), /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => handleRefreshApplication(selectedApp.name),
                  disabled: refreshing === selectedApp.name,
                  className: "px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50", children: /*#__PURE__*/

                  _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${refreshing === selectedApp.name ? 'animate-spin' : ''}` }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => handleDeleteApplication(selectedApp.name),
                  className: "px-4 py-2 rounded-lg border border-red-300 dark:border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10", children: /*#__PURE__*/

                  _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            ) }, void 0, false
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}
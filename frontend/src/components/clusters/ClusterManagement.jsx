import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logger } from '../../utils/logger';
import {
  ServerStackIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  CloudIcon,
  XMarkIcon,
  KeyIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  SignalIcon,
  PencilSquareIcon,
  HeartIcon,
  ClockIcon,
  CpuChipIcon,
  CircleStackIcon } from
'@heroicons/react/24/outline';
import { clustersApi, ClusterTestResult } from '../../services/api';
import { useCluster } from '../../contexts/ClusterContext';
import { useAuth } from '../../contexts/AuthContext';
import GlassCard, { SectionHeader } from '../common/GlassCard';


// Import shared constants
import { containerVariants, itemVariants, scaleVariants } from '../../utils/constants';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
























// Modal variants (extends shared scaleVariants)
const modalVariants = {
  ...scaleVariants,
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', duration: 0.3 } }
};

export default function ClusterManagement() {
  const { clusters, setActiveCluster, refreshClusters } = useCluster();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [contexts, setContexts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    id: '',
    name: '',
    context: '',
    kubeconfig_path: '',
    kubeconfig_content: '',
    is_default: false,
    auth_type: 'kubeconfig',
    api_server: '',
    bearer_token: '',
    ca_cert: '',
    skip_tls_verify: false
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // New state for enhanced features
  const [testingCluster, setTestingCluster] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCluster, setEditingCluster] = useState(null);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadContexts();
  }, []);

  const loadContexts = async () => {
    try {
      const response = await clustersApi.getContexts();
      setContexts(response.data);
    } catch (err) {
      logger.error('Failed to load contexts', err);
    }
  };

  const handleSetActive = async (clusterId) => {
    try {
      setLoading(true);
      setError(null);
      await setActiveCluster(clusterId);
      setSuccess(`Switched to cluster: ${clusterId}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to switch cluster');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCluster = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const payload = {
        id: addForm.id.toLowerCase().replace(/\s+/g, '-'),
        name: addForm.name,
        is_default: addForm.is_default,
        auth_type: addForm.auth_type === 'kubeconfig_file' ? 'kubeconfig' : addForm.auth_type
      };

      if (addForm.auth_type === 'kubeconfig') {
        payload.context = addForm.context || undefined;
        payload.kubeconfig_path = addForm.kubeconfig_path || undefined;
      } else if (addForm.auth_type === 'kubeconfig_file') {
        payload.kubeconfig_content = addForm.kubeconfig_content;
        payload.context = addForm.context || undefined;
      } else {
        payload.api_server = addForm.api_server;
        payload.bearer_token = addForm.bearer_token;
        payload.ca_cert = addForm.ca_cert || undefined;
        payload.skip_tls_verify = addForm.skip_tls_verify;
      }

      await clustersApi.create(payload);

      setSuccess('Cluster added successfully');
      setShowAddModal(false);
      setAddForm({
        id: '',
        name: '',
        context: '',
        kubeconfig_path: '',
        kubeconfig_content: '',
        is_default: false,
        auth_type: 'kubeconfig',
        api_server: '',
        bearer_token: '',
        ca_cert: '',
        skip_tls_verify: false
      });
      await refreshClusters();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err;
      setError(error.response?.data?.detail || 'Failed to add cluster');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCluster = async (clusterId) => {
    if (!confirm(`Are you sure you want to delete cluster "${clusterId}"?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await clustersApi.delete(clusterId);
      setSuccess('Cluster deleted successfully');
      await refreshClusters();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err;
      setError(error.response?.data?.detail || 'Failed to delete cluster');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (clusterId) => {
    try {
      setTestingCluster(clusterId);
      setTestResult(null);
      const response = await clustersApi.testConnection(clusterId);
      setTestResult(response.data);
      if (response.data.success) {
        setSuccess(`Connection to ${clusterId} successful! Latency: ${response.data.latency_ms}ms`);
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err) {
      const error = err;
      setTestResult({
        success: false,
        cluster_id: clusterId,
        error: error.response?.data?.detail || 'Connection test failed',
        latency_ms: 0
      });
    } finally {
      setTestingCluster(null);
    }
  };

  const handleEditCluster = (cluster) => {
    setEditingCluster(cluster);
    setAddForm({
      id: cluster.id,
      name: cluster.name,
      context: cluster.context || '',
      kubeconfig_path: '',
      kubeconfig_content: '',
      is_default: cluster.is_default,
      auth_type: 'kubeconfig',
      api_server: '',
      bearer_token: '',
      ca_cert: '',
      skip_tls_verify: false
    });
    setShowEditModal(true);
  };

  const handleUpdateCluster = async (e) => {
    e.preventDefault();
    if (!editingCluster) return;

    try {
      setLoading(true);
      setError(null);

      const payload = {
        id: addForm.id.toLowerCase().replace(/\s+/g, '-'),
        name: addForm.name,
        is_default: addForm.is_default,
        auth_type: addForm.auth_type === 'kubeconfig_file' ? 'kubeconfig' : addForm.auth_type
      };

      if (addForm.auth_type === 'kubeconfig') {
        payload.context = addForm.context || undefined;
        payload.kubeconfig_path = addForm.kubeconfig_path || undefined;
      } else if (addForm.auth_type === 'kubeconfig_file') {
        payload.kubeconfig_content = addForm.kubeconfig_content;
        payload.context = addForm.context || undefined;
      } else {
        payload.api_server = addForm.api_server;
        payload.bearer_token = addForm.bearer_token;
        payload.ca_cert = addForm.ca_cert || undefined;
        payload.skip_tls_verify = addForm.skip_tls_verify;
      }

      await clustersApi.update(editingCluster.id, payload);

      setSuccess('Cluster updated successfully');
      setShowEditModal(false);
      setEditingCluster(null);
      setAddForm({
        id: '',
        name: '',
        context: '',
        kubeconfig_path: '',
        kubeconfig_content: '',
        is_default: false,
        auth_type: 'kubeconfig',
        api_server: '',
        bearer_token: '',
        ca_cert: '',
        skip_tls_verify: false
      });
      await refreshClusters();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err;
      setError(error.response?.data?.detail || 'Failed to update cluster');
    } finally {
      setLoading(false);
    }
  };

  const handleViewHealth = async (clusterId) => {
    try {
      setLoadingHealth(true);
      setShowHealthModal(true);
      const response = await clustersApi.getHealth(clusterId);
      setHealthData(response.data);
    } catch (err) {
      const error = err;
      setHealthData({
        cluster_id: clusterId,
        healthy: false,
        status: 'error',
        node_count: 0,
        ready_nodes: 0,
        total_pods: 0,
        running_pods: 0,
        namespaces: 0,
        warnings: [],
        error: error.response?.data?.detail || 'Failed to fetch health data',
        checked_at: new Date().toISOString()
      });
    } finally {
      setLoadingHealth(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-success-500';
      case 'disconnected':
        return 'text-warning-500';
      case 'error':
        return 'text-danger-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'connected':
        return 'bg-success-500/10';
      case 'disconnected':
        return 'bg-warning-500/10';
      case 'error':
        return 'bg-danger-500/10';
      default:
        return 'bg-gray-500/10';
    }
  };

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      variants: containerVariants,
      initial: "hidden",
      animate: "visible",
      className: "space-y-6", children: [/*#__PURE__*/


      _jsxDEV(motion.div, {
        variants: itemVariants,
        className: "sticky top-16 z-30 -mx-4 lg:-mx-8 px-4 lg:px-8 py-4 bg-gray-50/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30", children: /*#__PURE__*/
              _jsxDEV(ServerStackIcon, { className: "h-6 w-6 text-primary-600 dark:text-primary-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h1", { className: "text-xl font-semibold text-gray-800 dark:text-gray-100", children: "Cluster Management" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 text-sm", children: [
                clusters.length, " cluster", clusters.length !== 1 ? 's' : '', " configured"] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: () => refreshClusters(),
              disabled: loading,
              className: "inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white/90 dark:hover:bg-slate-800/90 disabled:opacity-50 transition-all", children: [/*#__PURE__*/

              _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

            ),
            isAdmin && /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: () => setShowAddModal(true),
              className: "inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 text-sm font-medium shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300", children: [/*#__PURE__*/

              _jsxDEV(PlusIcon, { className: "h-4 w-4 mr-2" }, void 0, false), "Add Cluster"] }, void 0, true

            )] }, void 0, true

          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children: [
        error && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          className: "bg-danger-500/10 backdrop-blur-sm border border-danger-500/20 rounded-xl p-4", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center", children: [/*#__PURE__*/
            _jsxDEV(ExclamationCircleIcon, { className: "h-5 w-5 text-danger-500 mr-2" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "text-danger-600 dark:text-danger-400 text-sm", children: error }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ),


        success && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          className: "bg-success-500/10 backdrop-blur-sm border border-success-500/20 rounded-xl p-4", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center", children: [/*#__PURE__*/
            _jsxDEV(CheckCircleIcon, { className: "h-5 w-5 text-success-500 mr-2" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "text-success-600 dark:text-success-400 text-sm", children: success }, void 0, false)] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true

      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [
        clusters.map((cluster, index) => /*#__PURE__*/
        _jsxDEV(motion.div, {

          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: index * 0.05 }, children: /*#__PURE__*/

          _jsxDEV(GlassCard, {
            hover: true,
            variant: cluster.is_active ? 'glow' : 'hover',
            className: `${cluster.is_active ? 'ring-2 ring-primary-500/50' : ''}`, children: [/*#__PURE__*/

            _jsxDEV("div", { className: "flex items-start justify-between", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center", children: [/*#__PURE__*/
                _jsxDEV("div", { className: `p-2.5 rounded-xl ${getStatusBg(cluster.status)}`, children: /*#__PURE__*/
                  _jsxDEV(ServerStackIcon, { className: `h-6 w-6 ${getStatusColor(cluster.status)}` }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "ml-3", children: [/*#__PURE__*/
                  _jsxDEV("h3", { className: "text-base font-semibold text-gray-900 dark:text-white", children:
                    cluster.name }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: cluster.id }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ),
              cluster.is_active && /*#__PURE__*/
              _jsxDEV("span", { className: "inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-medium bg-primary-500/10 text-primary-600 dark:text-primary-400", children: "Active" }, void 0, false

              )] }, void 0, true

            ), /*#__PURE__*/

            _jsxDEV("div", { className: "mt-4 space-y-2", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between text-xs", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Status" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: `font-medium capitalize ${getStatusColor(cluster.status)}`, children:
                  cluster.status }, void 0, false
                )] }, void 0, true
              ),

              cluster.version && /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between text-xs", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Version" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: cluster.version }, void 0, false)] }, void 0, true
              ),


              cluster.context && /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between text-xs", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Context" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white truncate max-w-[120px]", children:
                  cluster.context }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "flex items-center justify-between text-xs", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Nodes" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: cluster.node_count }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center justify-between text-xs", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Namespaces" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: cluster.namespace_count }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV(AnimatePresence, { children:
              testResult && testResult.cluster_id === cluster.id && /*#__PURE__*/
              _jsxDEV(motion.div, {
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: 'auto' },
                exit: { opacity: 0, height: 0 },
                className: `mt-3 p-2.5 rounded-xl text-xs ${
                testResult.success ?
                'bg-success-500/10 border border-success-500/20' :
                'bg-danger-500/10 border border-danger-500/20'}`, children: /*#__PURE__*/


                _jsxDEV("div", { className: "flex items-center gap-2", children: [
                  testResult.success ? /*#__PURE__*/
                  _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-success-500 flex-shrink-0" }, void 0, false) : /*#__PURE__*/

                  _jsxDEV(ExclamationCircleIcon, { className: "h-4 w-4 text-danger-500 flex-shrink-0" }, void 0, false), /*#__PURE__*/

                  _jsxDEV("div", { className: "flex-1 min-w-0", children:
                    testResult.success ? /*#__PURE__*/
                    _jsxDEV("div", { className: "space-y-0.5", children: [/*#__PURE__*/
                      _jsxDEV("p", { className: "text-success-600 dark:text-success-400 font-medium", children: "Connected" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children: [
                        testResult.version, " • ", testResult.latency_ms, "ms"] }, void 0, true
                      )] }, void 0, true
                    ) : /*#__PURE__*/

                    _jsxDEV("p", { className: "text-danger-600 dark:text-danger-400 truncate", children: testResult.error }, void 0, false) }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => setTestResult(null),
                    className: "text-gray-400 hover:text-gray-500", children: /*#__PURE__*/

                    _jsxDEV(XMarkIcon, { className: "h-3.5 w-3.5" }, void 0, false) }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false
              ) }, void 0, false

            ), /*#__PURE__*/


            _jsxDEV("div", { className: "mt-4 pt-4 border-t border-gray-200/50 dark:border-slate-700/50 space-y-3", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center justify-between", children:
                !cluster.is_active ? /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: () => handleSetActive(cluster.id),
                  disabled: loading,
                  className: "text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 disabled:opacity-50", children:
                  "Switch to this cluster" }, void 0, false

                ) : /*#__PURE__*/

                _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Currently active" }, void 0, false) }, void 0, false

              ), /*#__PURE__*/


              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  onClick: () => handleTestConnection(cluster.id),
                  disabled: testingCluster === cluster.id,
                  className: "flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100/50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-slate-600/50 disabled:opacity-50 transition-all",
                  title: "Test connection", children: [

                  testingCluster === cluster.id ? /*#__PURE__*/
                  _jsxDEV(ArrowPathIcon, { className: "h-3.5 w-3.5 animate-spin" }, void 0, false) : /*#__PURE__*/

                  _jsxDEV(SignalIcon, { className: "h-3.5 w-3.5" }, void 0, false), /*#__PURE__*/

                  _jsxDEV("span", { children: "Test" }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/

                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  onClick: () => handleViewHealth(cluster.id),
                  className: "flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100/50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-slate-600/50 transition-all",
                  title: "View health details", children: [/*#__PURE__*/

                  _jsxDEV(HeartIcon, { className: "h-3.5 w-3.5" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { children: "Health" }, void 0, false)] }, void 0, true
                ),

                isAdmin && /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  onClick: () => handleEditCluster(cluster),
                  className: "flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-100/50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-slate-600/50 transition-all",
                  title: "Edit cluster", children: [/*#__PURE__*/

                  _jsxDEV(PencilSquareIcon, { className: "h-3.5 w-3.5" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { children: "Edit" }, void 0, false)] }, void 0, true
                ),


                isAdmin && !cluster.is_default && /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  onClick: () => handleDeleteCluster(cluster.id),
                  disabled: loading || cluster.is_active,
                  className: "p-1.5 rounded-lg text-gray-400 hover:text-danger-500 hover:bg-danger-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all",
                  title: cluster.is_active ? 'Cannot delete active cluster' : 'Delete cluster', children: /*#__PURE__*/

                  _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                )] }, void 0, true

              )] }, void 0, true
            )] }, void 0, true
          ) }, cluster.id, false
        )
        ),

        clusters.length === 0 && /*#__PURE__*/
        _jsxDEV(motion.div, {
          variants: itemVariants,
          className: "col-span-full", children: /*#__PURE__*/

          _jsxDEV(GlassCard, { className: "flex flex-col items-center justify-center py-12", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-4 rounded-2xl bg-gray-500/10 mb-4", children: /*#__PURE__*/
              _jsxDEV(CloudIcon, { className: "h-10 w-10 text-gray-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("h3", { className: "text-base font-medium text-gray-900 dark:text-white", children: "No clusters configured" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: "Add a cluster to get started" }, void 0, false

            ),
            isAdmin && /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: () => setShowAddModal(true),
              className: "mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 text-sm font-medium shadow-lg shadow-primary-500/25", children: [/*#__PURE__*/

              _jsxDEV(PlusIcon, { className: "h-4 w-4 mr-2" }, void 0, false), "Add Cluster"] }, void 0, true

            )] }, void 0, true

          ) }, void 0, false
        )] }, void 0, true

      ),


      contexts.length > 0 && /*#__PURE__*/
      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV(GlassCard, { children: [/*#__PURE__*/
          _jsxDEV(SectionHeader, {
            title: "Available Kubeconfig Contexts",
            subtitle: "Contexts found in your kubeconfig file" }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "overflow-x-auto -mx-4 lg:-mx-6", children: /*#__PURE__*/
            _jsxDEV("table", { className: "min-w-full", children: [/*#__PURE__*/
              _jsxDEV("thead", { children: /*#__PURE__*/
                _jsxDEV("tr", { className: "border-b border-gray-200/50 dark:border-slate-700/50", children: [/*#__PURE__*/
                  _jsxDEV("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase", children: "Context Name" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase", children: "Cluster" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase", children: "User" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase", children: "Namespace" }, void 0, false

                  )] }, void 0, true
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("tbody", { className: "divide-y divide-gray-100/50 dark:divide-slate-700/30", children:
                contexts.map((ctx, index) => /*#__PURE__*/
                _jsxDEV(motion.tr, {

                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { delay: index * 0.05 },
                  className: "hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors", children: [/*#__PURE__*/

                  _jsxDEV("td", { className: "px-4 lg:px-6 py-3 text-sm font-medium text-gray-900 dark:text-white", children:
                    ctx.name }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("td", { className: "px-4 lg:px-6 py-3 text-sm text-gray-500 dark:text-gray-400", children: ctx.cluster }, void 0, false), /*#__PURE__*/
                  _jsxDEV("td", { className: "px-4 lg:px-6 py-3 text-sm text-gray-500 dark:text-gray-400", children: ctx.user }, void 0, false), /*#__PURE__*/
                  _jsxDEV("td", { className: "px-4 lg:px-6 py-3 text-sm text-gray-500 dark:text-gray-400", children:
                    ctx.namespace || 'default' }, void 0, false
                  )] }, ctx.name, true
                )
                ) }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/



      _jsxDEV(AnimatePresence, { children:
        showAddModal && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 z-50 overflow-y-auto", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex min-h-full items-center justify-center p-4", children: [/*#__PURE__*/
            _jsxDEV(motion.div, {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "fixed inset-0 bg-black/50 backdrop-blur-sm",
              onClick: () => setShowAddModal(false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV(motion.div, {
              variants: modalVariants,
              initial: "hidden",
              animate: "visible",
              exit: "exit",
              className: "relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-6 border border-white/20 dark:border-slate-700/50", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
                _jsxDEV("h2", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "Add New Cluster" }, void 0, false), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  onClick: () => setShowAddModal(false),
                  className: "p-1.5 rounded-lg hover:bg-gray-100/50 dark:hover:bg-slate-700/50 transition-colors", children: /*#__PURE__*/

                  _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("form", { onSubmit: handleAddCluster, className: "space-y-4", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Cluster ID *" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("input", {
                    type: "text",
                    value: addForm.id,
                    onChange: (e) => setAddForm({ ...addForm, id: e.target.value }),
                    className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all",
                    placeholder: "my-cluster",
                    required: true }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "mt-1 text-[10px] text-gray-500", children: "Unique identifier for this cluster" }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/

                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Display Name *" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("input", {
                    type: "text",
                    value: addForm.name,
                    onChange: (e) => setAddForm({ ...addForm, name: e.target.value }),
                    className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all",
                    placeholder: "My Production Cluster",
                    required: true }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/


                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Authentication Method" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "grid grid-cols-3 gap-2", children: [/*#__PURE__*/
                    _jsxDEV("button", {
                      type: "button",
                      onClick: () => setAddForm({ ...addForm, auth_type: 'kubeconfig' }),
                      className: `flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all ${
                      addForm.auth_type === 'kubeconfig' ?
                      'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400' :
                      'border-gray-200/50 dark:border-slate-600/50 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-slate-500'}`, children: [/*#__PURE__*/


                      _jsxDEV(DocumentTextIcon, { className: "h-5 w-5" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs font-medium", children: "Context" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("button", {
                      type: "button",
                      onClick: () => setAddForm({ ...addForm, auth_type: 'kubeconfig_file' }),
                      className: `flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all ${
                      addForm.auth_type === 'kubeconfig_file' ?
                      'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400' :
                      'border-gray-200/50 dark:border-slate-600/50 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-slate-500'}`, children: [/*#__PURE__*/


                      _jsxDEV(ArrowUpTrayIcon, { className: "h-5 w-5" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs font-medium", children: "Upload File" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("button", {
                      type: "button",
                      onClick: () => setAddForm({ ...addForm, auth_type: 'token' }),
                      className: `flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all ${
                      addForm.auth_type === 'token' ?
                      'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400' :
                      'border-gray-200/50 dark:border-slate-600/50 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-slate-500'}`, children: [/*#__PURE__*/


                      _jsxDEV(KeyIcon, { className: "h-5 w-5" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs font-medium", children: "Token" }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  )] }, void 0, true
                ),


                addForm.auth_type === 'kubeconfig' && /*#__PURE__*/
                _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Kubeconfig Context" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("select", {
                      value: addForm.context,
                      onChange: (e) => setAddForm({ ...addForm, context: e.target.value }),
                      className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all", children: [/*#__PURE__*/

                      _jsxDEV("option", { value: "", children: "Select a context..." }, void 0, false),
                      contexts.map((ctx) => /*#__PURE__*/
                      _jsxDEV("option", { value: ctx.name, children:
                        ctx.name }, ctx.name, false
                      )
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "mt-1 text-[10px] text-gray-500", children: "Select from available kubeconfig contexts" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Kubeconfig Path" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("input", {
                      type: "text",
                      value: addForm.kubeconfig_path,
                      onChange: (e) => setAddForm({ ...addForm, kubeconfig_path: e.target.value }),
                      className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all",
                      placeholder: "~/.kube/config" }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "mt-1 text-[10px] text-gray-500", children: "Leave empty to use default kubeconfig" }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                ),



                addForm.auth_type === 'kubeconfig_file' && /*#__PURE__*/
                _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Upload Kubeconfig File" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "relative", children: /*#__PURE__*/
                      _jsxDEV("input", {
                        type: "file",
                        accept: ".yaml,.yml,.config,*",
                        onChange: (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const content = event.target?.result;
                              setAddForm({ ...addForm, kubeconfig_content: content });
                            };
                            reader.readAsText(file);
                          }
                        },
                        className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary-500/10 file:text-primary-600 dark:file:text-primary-400 hover:file:bg-primary-500/20" }, void 0, false
                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "mt-1 text-[10px] text-gray-500", children: "Upload your kubeconfig file from your machine" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Or Paste Kubeconfig Content" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("textarea", {
                      value: addForm.kubeconfig_content,
                      onChange: (e) => setAddForm({ ...addForm, kubeconfig_content: e.target.value }),
                      className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all font-mono text-xs",
                      placeholder: "apiVersion: v1\r\nkind: Config\r\nclusters:\r\n- cluster:\r server: https://...",




                      rows: 6 }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "mt-1 text-[10px] text-gray-500", children: "Paste the full kubeconfig YAML content" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Context Name (Optional)" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("input", {
                      type: "text",
                      value: addForm.context,
                      onChange: (e) => setAddForm({ ...addForm, context: e.target.value }),
                      className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all",
                      placeholder: "my-cluster-context" }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "mt-1 text-[10px] text-gray-500", children: "Specify which context to use (leave empty for default)" }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                ),



                addForm.auth_type === 'token' && /*#__PURE__*/
                _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1", children: "API Server URL *" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("input", {
                      type: "text",
                      value: addForm.api_server,
                      onChange: (e) => setAddForm({ ...addForm, api_server: e.target.value }),
                      className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all",
                      placeholder: "https://kubernetes.example.com:6443",
                      required: addForm.auth_type === 'token' }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "mt-1 text-[10px] text-gray-500", children: "Kubernetes API server endpoint" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Bearer Token *" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("textarea", {
                      value: addForm.bearer_token,
                      onChange: (e) => setAddForm({ ...addForm, bearer_token: e.target.value }),
                      className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all font-mono",
                      placeholder: "eyJhbGciOiJSUzI1NiIsImtpZCI6...",
                      rows: 3,
                      required: addForm.auth_type === 'token' }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "mt-1 text-[10px] text-gray-500", children: "Service account token from the cluster" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1", children: "CA Certificate (Base64)" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("textarea", {
                      value: addForm.ca_cert,
                      onChange: (e) => setAddForm({ ...addForm, ca_cert: e.target.value }),
                      className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all font-mono",
                      placeholder: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS...",
                      rows: 2 }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "mt-1 text-[10px] text-gray-500", children: "Optional: Base64-encoded CA certificate" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { className: "flex items-center", children: [/*#__PURE__*/
                    _jsxDEV("input", {
                      type: "checkbox",
                      id: "skip_tls",
                      checked: addForm.skip_tls_verify,
                      onChange: (e) => setAddForm({ ...addForm, skip_tls_verify: e.target.checked }),
                      className: "h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("label", { htmlFor: "skip_tls", className: "ml-2 text-sm text-gray-700 dark:text-gray-300", children: ["Skip TLS verification ", /*#__PURE__*/
                      _jsxDEV("span", { className: "text-amber-500", children: "(not recommended)" }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/


                _jsxDEV("div", { className: "flex items-center", children: [/*#__PURE__*/
                  _jsxDEV("input", {
                    type: "checkbox",
                    id: "is_default",
                    checked: addForm.is_default,
                    onChange: (e) => setAddForm({ ...addForm, is_default: e.target.checked }),
                    className: "h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("label", { htmlFor: "is_default", className: "ml-2 text-sm text-gray-700 dark:text-gray-300", children: "Set as default cluster" }, void 0, false

                  )] }, void 0, true
                ), /*#__PURE__*/

                _jsxDEV("div", { className: "flex justify-end gap-3 pt-4", children: [/*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    type: "button",
                    onClick: () => setShowAddModal(false),
                    className: "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100/50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-200/50 dark:hover:bg-slate-600/50 transition-all", children:
                    "Cancel" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    type: "submit",
                    disabled: loading || !addForm.id || !addForm.name || addForm.auth_type === 'token' && (!addForm.api_server || !addForm.bearer_token) || addForm.auth_type === 'kubeconfig_file' && !addForm.kubeconfig_content,
                    className: "px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 shadow-lg shadow-primary-500/25 transition-all", children:

                    loading ? 'Adding...' : 'Add Cluster' }, void 0, false
                  )] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showEditModal && editingCluster && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 z-50 overflow-y-auto", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex min-h-full items-center justify-center p-4", children: [/*#__PURE__*/
            _jsxDEV(motion.div, {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "fixed inset-0 bg-black/50 backdrop-blur-sm",
              onClick: () => {setShowEditModal(false);setEditingCluster(null);} }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV(motion.div, {
              variants: modalVariants,
              initial: "hidden",
              animate: "visible",
              exit: "exit",
              className: "relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-6 border border-white/20 dark:border-slate-700/50", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
                _jsxDEV("h2", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "Edit Cluster" }, void 0, false), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  onClick: () => {setShowEditModal(false);setEditingCluster(null);},
                  className: "p-1.5 rounded-lg hover:bg-gray-100/50 dark:hover:bg-slate-700/50 transition-colors", children: /*#__PURE__*/

                  _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("form", { onSubmit: handleUpdateCluster, className: "space-y-4", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Cluster ID" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("input", {
                    type: "text",
                    value: addForm.id,
                    onChange: (e) => setAddForm({ ...addForm, id: e.target.value }),
                    className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all",
                    required: true }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/

                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Display Name" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("input", {
                    type: "text",
                    value: addForm.name,
                    onChange: (e) => setAddForm({ ...addForm, name: e.target.value }),
                    className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all",
                    required: true }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/

                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Context" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("select", {
                    value: addForm.context,
                    onChange: (e) => setAddForm({ ...addForm, context: e.target.value }),
                    className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all", children: [/*#__PURE__*/

                    _jsxDEV("option", { value: "", children: "Select a context..." }, void 0, false),
                    contexts.map((ctx) => /*#__PURE__*/
                    _jsxDEV("option", { value: ctx.name, children:
                      ctx.name }, ctx.name, false
                    )
                    )] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/

                _jsxDEV("div", { className: "flex items-center", children: [/*#__PURE__*/
                  _jsxDEV("input", {
                    type: "checkbox",
                    id: "edit_is_default",
                    checked: addForm.is_default,
                    onChange: (e) => setAddForm({ ...addForm, is_default: e.target.checked }),
                    className: "h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("label", { htmlFor: "edit_is_default", className: "ml-2 text-sm text-gray-700 dark:text-gray-300", children: "Set as default cluster" }, void 0, false

                  )] }, void 0, true
                ), /*#__PURE__*/

                _jsxDEV("div", { className: "flex justify-end gap-3 pt-4", children: [/*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    type: "button",
                    onClick: () => {setShowEditModal(false);setEditingCluster(null);},
                    className: "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100/50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-200/50 dark:hover:bg-slate-600/50 transition-all", children:
                    "Cancel" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    type: "submit",
                    disabled: loading || !addForm.id || !addForm.name,
                    className: "px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 shadow-lg shadow-primary-500/25 transition-all", children:

                    loading ? 'Updating...' : 'Update Cluster' }, void 0, false
                  )] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showHealthModal && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 z-50 overflow-y-auto", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex min-h-full items-center justify-center p-4", children: [/*#__PURE__*/
            _jsxDEV(motion.div, {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "fixed inset-0 bg-black/50 backdrop-blur-sm",
              onClick: () => {setShowHealthModal(false);setHealthData(null);} }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV(motion.div, {
              variants: modalVariants,
              initial: "hidden",
              animate: "visible",
              exit: "exit",
              className: "relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-white/20 dark:border-slate-700/50", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center justify-between mb-6", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: `p-2.5 rounded-xl ${healthData?.healthy ? 'bg-success-500/10' : 'bg-danger-500/10'}`, children: /*#__PURE__*/
                    _jsxDEV(HeartIcon, { className: `h-6 w-6 ${healthData?.healthy ? 'text-success-500' : 'text-danger-500'}` }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("h2", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "Cluster Health" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: healthData?.cluster_id }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  onClick: () => {setShowHealthModal(false);setHealthData(null);},
                  className: "p-1.5 rounded-lg hover:bg-gray-100/50 dark:hover:bg-slate-700/50 transition-colors", children: /*#__PURE__*/

                  _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ),

              loadingHealth ? /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-center py-12", children: /*#__PURE__*/
                _jsxDEV(ArrowPathIcon, { className: "h-8 w-8 text-primary-500 animate-spin" }, void 0, false) }, void 0, false
              ) :
              healthData ? /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

                _jsxDEV("div", { className: "flex items-center justify-center", children: /*#__PURE__*/
                  _jsxDEV("span", { className: `inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    healthData.healthy ?
                    'bg-success-500/10 text-success-600 dark:text-success-400' :
                    'bg-danger-500/10 text-danger-600 dark:text-danger-400'}`, children: [

                    healthData.healthy ? /*#__PURE__*/
                    _jsxDEV(CheckCircleIcon, { className: "h-5 w-5" }, void 0, false) : /*#__PURE__*/

                    _jsxDEV(ExclamationCircleIcon, { className: "h-5 w-5" }, void 0, false),

                    healthData.healthy ? 'Healthy' : 'Unhealthy'] }, void 0, true
                  ) }, void 0, false
                ), /*#__PURE__*/


                _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "p-4 rounded-xl bg-gray-50/50 dark:bg-slate-700/30 border border-gray-100/50 dark:border-slate-600/30", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
                      _jsxDEV(CpuChipIcon, { className: "h-4 w-4 text-primary-500" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400", children: "Nodes" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: [
                      healthData.ready_nodes, "/", healthData.node_count] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Ready" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { className: "p-4 rounded-xl bg-gray-50/50 dark:bg-slate-700/30 border border-gray-100/50 dark:border-slate-600/30", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
                      _jsxDEV(CircleStackIcon, { className: "h-4 w-4 text-secondary-500" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400", children: "Pods" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: [
                      healthData.running_pods, "/", healthData.total_pods] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Running" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { className: "p-4 rounded-xl bg-gray-50/50 dark:bg-slate-700/30 border border-gray-100/50 dark:border-slate-600/30", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
                      _jsxDEV(ServerStackIcon, { className: "h-4 w-4 text-accent-500" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400", children: "Namespaces" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children:
                      healthData.namespaces }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Total" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/

                  _jsxDEV("div", { className: "p-4 rounded-xl bg-gray-50/50 dark:bg-slate-700/30 border border-gray-100/50 dark:border-slate-600/30", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
                      _jsxDEV(ClockIcon, { className: "h-4 w-4 text-warning-500" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400", children: "Checked" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children:
                      new Date(healthData.checked_at).toLocaleTimeString() }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children:
                      new Date(healthData.checked_at).toLocaleDateString() }, void 0, false
                    )] }, void 0, true
                  )] }, void 0, true
                ),


                healthData.warnings && healthData.warnings.length > 0 && /*#__PURE__*/
                _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                  _jsxDEV("h3", { className: "text-sm font-medium text-gray-900 dark:text-white", children: "Warnings" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { className: "space-y-2", children:
                    healthData.warnings.map((warning, index) => /*#__PURE__*/
                    _jsxDEV("div", {

                      className: "flex items-start gap-2 p-3 rounded-xl bg-warning-500/10 border border-warning-500/20", children: [/*#__PURE__*/

                      _jsxDEV(ExclamationCircleIcon, { className: "h-4 w-4 text-warning-500 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-sm text-warning-600 dark:text-warning-400", children: warning }, void 0, false)] }, index, true
                    )
                    ) }, void 0, false
                  )] }, void 0, true
                ),



                healthData.error && /*#__PURE__*/
                _jsxDEV("div", { className: "p-3 rounded-xl bg-danger-500/10 border border-danger-500/20", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                    _jsxDEV(ExclamationCircleIcon, { className: "h-4 w-4 text-danger-500 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm text-danger-600 dark:text-danger-400", children: healthData.error }, void 0, false)] }, void 0, true
                  ) }, void 0, false
                ), /*#__PURE__*/



                _jsxDEV("div", { className: "flex justify-center pt-2", children: /*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    onClick: () => healthData && handleViewHealth(healthData.cluster_id),
                    disabled: loadingHealth,
                    className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100/50 dark:bg-slate-700/50 rounded-xl hover:bg-gray-200/50 dark:hover:bg-slate-600/50 disabled:opacity-50 transition-all", children: [/*#__PURE__*/

                    _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${loadingHealth ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

                  ) }, void 0, false
                )] }, void 0, true
              ) :
              null] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}
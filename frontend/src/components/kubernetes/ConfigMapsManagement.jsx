import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  FunnelIcon,
  XMarkIcon } from
'@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { kubernetesApi } from '../../services/api';
import { logger } from '../../utils/logger';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";


export default function ConfigMapsManagement() {
  const { hasRole } = useAuth();
  const [configMaps, setConfigMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [namespaceFilter, setNamespaceFilter] = useState('all');
  const [expandedConfigMap, setExpandedConfigMap] = useState(null);
  const [expandedConfigMapData, setExpandedConfigMapData] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [editData, setEditData] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: '',
    namespace: 'default',
    data: [{ key: '', value: '' }]
  });

  const canManageConfigMaps = hasRole('operator');

  // Fetch configmaps from K8s cluster
  const fetchConfigMaps = useCallback(async () => {
    try {
      setError(null);
      const response = await kubernetesApi.getConfigMaps(
        namespaceFilter !== 'all' ? namespaceFilter : undefined
      );
      setConfigMaps(response.data);
    } catch (err) {
      logger.error('Failed to fetch configmaps', err);
      setError('Failed to fetch ConfigMaps from cluster. Make sure you have a cluster connected.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [namespaceFilter]);

  useEffect(() => {
    fetchConfigMaps();
  }, [fetchConfigMaps]);

  // Get unique namespaces
  const namespaces = useMemo(() => {
    const ns = new Set(configMaps.map((c) => c.namespace));
    return ['all', ...Array.from(ns).sort()];
  }, [configMaps]);

  // Filter configmaps
  const filteredConfigMaps = useMemo(() => {
    return configMaps.filter((cm) => {
      const matchesSearch =
      cm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cm.namespace.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cm.data_keys.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesNamespace = namespaceFilter === 'all' || cm.namespace === namespaceFilter;
      return matchesSearch && matchesNamespace;
    });
  }, [configMaps, searchQuery, namespaceFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchConfigMaps();
  };

  const toggleExpand = async (cmKey, cm) => {
    if (expandedConfigMap === cmKey) {
      setExpandedConfigMap(null);
      setExpandedConfigMapData(null);
    } else {
      setExpandedConfigMap(cmKey);
      // Fetch full configmap data
      try {
        const response = await kubernetesApi.getConfigMap(cm.namespace, cm.name);
        setExpandedConfigMapData(response.data);
      } catch (err) {
        logger.error('Failed to fetch configmap details', err);
      }
    }
  };

  const copyToClipboard = async (value, key) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDelete = async (cm) => {
    try {
      await kubernetesApi.deleteConfigMap(cm.namespace, cm.name);
      setConfigMaps((prev) => prev.filter((c) => !(c.name === cm.name && c.namespace === cm.namespace)));
      setShowDeleteConfirm(null);
    } catch (err) {
      logger.error('Failed to delete configmap', err);
      setError('Failed to delete ConfigMap');
    }
  };

  const handleCreate = async () => {
    if (!createForm.name || !createForm.namespace) {
      setError('Name and namespace are required');
      return;
    }

    setIsSaving(true);
    try {
      const data = {};
      createForm.data.forEach((item) => {
        if (item.key) {
          data[item.key] = item.value;
        }
      });

      await kubernetesApi.createConfigMap({
        name: createForm.name,
        namespace: createForm.namespace,
        data
      });

      setShowCreateModal(false);
      setCreateForm({ name: '', namespace: 'default', data: [{ key: '', value: '' }] });
      await fetchConfigMaps();
    } catch (err) {
      logger.error('Failed to create configmap', err);
      setError('Failed to create ConfigMap');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async (cm) => {
    try {
      const response = await kubernetesApi.getConfigMap(cm.namespace, cm.name);
      setEditData(response.data);
      setShowEditModal(cm);
    } catch (err) {
      logger.error('Failed to fetch configmap for editing', err);
      setError('Failed to fetch ConfigMap data');
    }
  };

  const handleUpdate = async () => {
    if (!showEditModal || !editData) return;

    setIsSaving(true);
    try {
      await kubernetesApi.updateConfigMap(showEditModal.namespace, showEditModal.name, {
        data: editData.data
      });

      setShowEditModal(null);
      setEditData(null);
      await fetchConfigMaps();
    } catch (err) {
      logger.error('Failed to update configmap', err);
      setError('Failed to update ConfigMap');
    } finally {
      setIsSaving(false);
    }
  };

  const addDataField = () => {
    setCreateForm((prev) => ({
      ...prev,
      data: [...prev.data, { key: '', value: '' }]
    }));
  };

  const removeDataField = (index) => {
    setCreateForm((prev) => ({
      ...prev,
      data: prev.data.filter((_, i) => i !== index)
    }));
  };

  const updateDataField = (index, field, value) => {
    setCreateForm((prev) => ({
      ...prev,
      data: prev.data.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  if (loading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center h-64", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3 text-gray-400", children: [/*#__PURE__*/
          _jsxDEV(ArrowPathIcon, { className: "w-6 h-6 animate-spin" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { children: "Loading ConfigMaps from cluster..." }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ));

  }

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(DocumentDuplicateIcon, { className: "w-7 h-7 text-blue-500" }, void 0, false), "Kubernetes ConfigMaps"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 mt-1", children: "View and manage ConfigMaps from your Kubernetes cluster" }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            onClick: handleRefresh,
            disabled: isRefreshing,
            className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white transition-colors disabled:opacity-50", children: [/*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

          ),
          canManageConfigMaps && /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            onClick: () => setShowCreateModal(true),
            className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors", children: [/*#__PURE__*/

            _jsxDEV(PlusIcon, { className: "w-5 h-5" }, void 0, false), "Create ConfigMap"] }, void 0, true

          )] }, void 0, true

        )] }, void 0, true
      ),


      error && /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30", children: [/*#__PURE__*/

        _jsxDEV(ExclamationTriangleIcon, { className: "w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-red-400 font-medium", children: "Error" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-red-400/80 text-sm mt-1", children: error }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("button", { onClick: () => setError(null), className: "text-red-400 hover:text-red-300", children: /*#__PURE__*/
          _jsxDEV(XMarkIcon, { className: "w-5 h-5" }, void 0, false) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/



      _jsxDEV("div", { className: "flex flex-col sm:flex-row gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "relative flex-1", children: [/*#__PURE__*/
          _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("input", {
            type: "text",
            placeholder: "Search ConfigMaps by name, namespace, or key...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500" }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV(FunnelIcon, { className: "w-5 h-5 text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("select", {
            value: namespaceFilter,
            onChange: (e) => setNamespaceFilter(e.target.value),
            className: "px-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50", children:

            namespaces.map((ns) => /*#__PURE__*/
            _jsxDEV("option", { value: ns, children:
              ns === 'all' ? 'All Namespaces' : ns }, ns, false
            )
            ) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 text-sm", children: "Total ConfigMaps" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white mt-1", children: configMaps.length }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 text-sm", children: "Namespaces" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white mt-1", children: namespaces.length - 1 }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 text-sm", children: "Filtered Results" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-blue-500 mt-1", children: filteredConfigMaps.length }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 text-sm", children: "Total Keys" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white mt-1", children:
            configMaps.reduce((acc, c) => acc + c.data_count, 0) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "space-y-4", children: /*#__PURE__*/
        _jsxDEV(AnimatePresence, { mode: "popLayout", children:
          filteredConfigMaps.length === 0 ? /*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "text-center py-12 text-gray-400", children: [/*#__PURE__*/

            _jsxDEV(DocumentDuplicateIcon, { className: "w-12 h-12 mx-auto mb-4 opacity-50" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { children: configMaps.length === 0 ? 'No ConfigMaps found in the cluster' : 'No ConfigMaps match your filters' }, void 0, false)] }, void 0, true
          ) :

          filteredConfigMaps.map((cm) => {
            const cmKey = `${cm.namespace}/${cm.name}`;
            const isExpanded = expandedConfigMap === cmKey;

            return (/*#__PURE__*/
              _jsxDEV(motion.div, {

                layout: true,
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 },
                className: "p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors", children: [/*#__PURE__*/


                _jsxDEV("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "p-2 rounded-lg bg-blue-500/20", children: /*#__PURE__*/
                      _jsxDEV(DocumentDuplicateIcon, { className: "w-5 h-5 text-blue-500" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: cm.name }, void 0, false), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
                        cm.namespace, " • ", cm.data_count, " key", cm.data_count !== 1 ? 's' : '', " • ", cm.age] }, void 0, true
                      )] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.1 },
                      whileTap: { scale: 0.9 },
                      onClick: () => toggleExpand(cmKey, cm),
                      className: "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors",
                      title: isExpanded ? 'Hide data' : 'Show data', children:

                      isExpanded ? /*#__PURE__*/
                      _jsxDEV(EyeSlashIcon, { className: "w-4 h-4" }, void 0, false) : /*#__PURE__*/

                      _jsxDEV(EyeIcon, { className: "w-4 h-4" }, void 0, false) }, void 0, false

                    ),
                    canManageConfigMaps && /*#__PURE__*/
                    _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                      _jsxDEV(motion.button, {
                        whileHover: { scale: 1.1 },
                        whileTap: { scale: 0.9 },
                        onClick: () => handleEdit(cm),
                        className: "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors",
                        title: "Edit ConfigMap", children: /*#__PURE__*/

                        _jsxDEV(PencilIcon, { className: "w-4 h-4" }, void 0, false) }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV(motion.button, {
                        whileHover: { scale: 1.1 },
                        whileTap: { scale: 0.9 },
                        onClick: () => setShowDeleteConfirm(cm),
                        className: "p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors",
                        title: "Delete ConfigMap", children: /*#__PURE__*/

                        _jsxDEV(TrashIcon, { className: "w-4 h-4" }, void 0, false) }, void 0, false
                      )] }, void 0, true
                    )] }, void 0, true

                  )] }, void 0, true
                ), /*#__PURE__*/


                _jsxDEV(AnimatePresence, { children:
                  isExpanded && expandedConfigMapData && /*#__PURE__*/
                  _jsxDEV(motion.div, {
                    initial: { height: 0, opacity: 0 },
                    animate: { height: 'auto', opacity: 1 },
                    exit: { height: 0, opacity: 0 },
                    transition: { duration: 0.2 },
                    className: "overflow-hidden", children: /*#__PURE__*/

                    _jsxDEV("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3", children: [
                      Object.entries(expandedConfigMapData.data).length === 0 ? /*#__PURE__*/
                      _jsxDEV("p", { className: "text-gray-400 text-sm italic", children: "No data keys in this ConfigMap" }, void 0, false) :

                      Object.entries(expandedConfigMapData.data).map(([key, value]) => /*#__PURE__*/
                      _jsxDEV("div", {

                        className: "p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 space-y-2", children: [/*#__PURE__*/

                        _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                          _jsxDEV("code", { className: "text-sm text-blue-600 dark:text-blue-400 font-mono font-medium", children:
                            key }, void 0, false
                          ), /*#__PURE__*/
                          _jsxDEV(motion.button, {
                            whileHover: { scale: 1.1 },
                            whileTap: { scale: 0.9 },
                            onClick: () => copyToClipboard(value, `${cmKey}-${key}`),
                            className: "p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors",
                            title: "Copy value", children:

                            copiedKey === `${cmKey}-${key}` ? /*#__PURE__*/
                            _jsxDEV(CheckIcon, { className: "w-4 h-4 text-green-400" }, void 0, false) : /*#__PURE__*/

                            _jsxDEV(ClipboardDocumentIcon, { className: "w-4 h-4" }, void 0, false) }, void 0, false

                          )] }, void 0, true
                        ), /*#__PURE__*/
                        _jsxDEV("pre", { className: "text-xs text-gray-600 dark:text-gray-300 font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto max-h-40", children:
                          value }, void 0, false
                        )] }, key, true
                      )
                      ),

                      expandedConfigMapData.binary_data_keys.length > 0 && /*#__PURE__*/
                      _jsxDEV("div", { className: "pt-2", children: [/*#__PURE__*/
                        _jsxDEV("p", { className: "text-xs text-gray-500 mb-2", children: "Binary data keys (values not shown):" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("div", { className: "flex flex-wrap gap-2", children:
                          expandedConfigMapData.binary_data_keys.map((key) => /*#__PURE__*/
                          _jsxDEV("span", { className: "px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono", children:
                            key }, key, false
                          )
                          ) }, void 0, false
                        )] }, void 0, true
                      )] }, void 0, true

                    ) }, void 0, false
                  ) }, void 0, false

                ),


                Object.keys(cm.labels).length > 0 && /*#__PURE__*/
                _jsxDEV("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2", children: [
                  Object.entries(cm.labels).slice(0, 4).map(([k, v]) => /*#__PURE__*/
                  _jsxDEV("span", {

                    className: "px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 font-mono", children: [

                    k, "=", v] }, k, true
                  )
                  ),
                  Object.keys(cm.labels).length > 4 && /*#__PURE__*/
                  _jsxDEV("span", { className: "px-2 py-1 text-xs text-gray-500", children: ["+",
                    Object.keys(cm.labels).length - 4, " more"] }, void 0, true
                  )] }, void 0, true

                )] }, cmKey, true

              ));

          }) }, void 0, false

        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showDeleteConfirm && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4",
          onClick: () => setShowDeleteConfirm(null), children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.9, opacity: 0 },
            onClick: (e) => e.stopPropagation(),
            className: "bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "flex items-center gap-3 mb-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-3 rounded-full bg-red-500/20", children: /*#__PURE__*/
                _jsxDEV(ExclamationTriangleIcon, { className: "w-6 h-6 text-red-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("h3", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Delete ConfigMap" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-600 dark:text-gray-300 mb-2", children: ["Are you sure you want to delete ", /*#__PURE__*/
              _jsxDEV("span", { className: "font-mono text-red-500", children: showDeleteConfirm.name }, void 0, false), " from ", /*#__PURE__*/_jsxDEV("span", { className: "font-mono text-blue-500", children: showDeleteConfirm.namespace }, void 0, false), "?"] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 text-sm mb-6", children: "This action cannot be undone. Applications depending on this ConfigMap will fail." }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex justify-end gap-3", children: [/*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => setShowDeleteConfirm(null),
                className: "px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white transition-colors", children:
                "Cancel" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => handleDelete(showDeleteConfirm),
                className: "px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors", children:
                "Delete ConfigMap" }, void 0, false

              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showCreateModal && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4",
          onClick: () => setShowCreateModal(false), children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.9, opacity: 0 },
            onClick: (e) => e.stopPropagation(),
            className: "bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto", children: [/*#__PURE__*/

            _jsxDEV("h3", { className: "text-xl font-bold text-gray-900 dark:text-white mb-4", children: "Create ConfigMap" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "ConfigMap Name" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("input", {
                  type: "text",
                  placeholder: "my-configmap",
                  value: createForm.name,
                  onChange: (e) => setCreateForm((prev) => ({ ...prev, name: e.target.value })),
                  className: "w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Namespace" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("select", {
                  value: createForm.namespace,
                  onChange: (e) => setCreateForm((prev) => ({ ...prev, namespace: e.target.value })),
                  className: "w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50", children:

                  namespaces.filter((n) => n !== 'all').map((ns) => /*#__PURE__*/
                  _jsxDEV("option", { value: ns, children: ns }, ns, false)
                  ) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Data (Key-Value pairs)" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("div", { className: "space-y-2", children: [
                  createForm.data.map((item, index) => /*#__PURE__*/
                  _jsxDEV("div", { className: "flex gap-2", children: [/*#__PURE__*/
                    _jsxDEV("input", {
                      type: "text",
                      placeholder: "KEY",
                      value: item.key,
                      onChange: (e) => updateDataField(index, 'key', e.target.value),
                      className: "flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-sm" }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("textarea", {
                      placeholder: "Value",
                      value: item.value,
                      onChange: (e) => updateDataField(index, 'value', e.target.value),
                      rows: 1,
                      className: "flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-sm resize-y" }, void 0, false
                    ),
                    createForm.data.length > 1 && /*#__PURE__*/
                    _jsxDEV("button", {
                      onClick: () => removeDataField(index),
                      className: "p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400", children: /*#__PURE__*/

                      _jsxDEV(XMarkIcon, { className: "w-5 h-5" }, void 0, false) }, void 0, false
                    )] }, index, true

                  )
                  ), /*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: addDataField,
                    className: "flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400", children: [/*#__PURE__*/

                    _jsxDEV(PlusIcon, { className: "w-4 h-4" }, void 0, false), "Add Key-Value Pair"] }, void 0, true

                  )] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex justify-end gap-3 mt-6", children: [/*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => setShowCreateModal(false),
                className: "px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white transition-colors", children:
                "Cancel" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("button", {
                onClick: handleCreate,
                disabled: isSaving,
                className: "px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors disabled:opacity-50", children:

                isSaving ? 'Creating...' : 'Create ConfigMap' }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showEditModal && editData && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4",
          onClick: () => {setShowEditModal(null);setEditData(null);}, children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.9, opacity: 0 },
            onClick: (e) => e.stopPropagation(),
            className: "bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto", children: [/*#__PURE__*/

            _jsxDEV("h3", { className: "text-xl font-bold text-gray-900 dark:text-white mb-4", children: ["Edit ConfigMap: ", /*#__PURE__*/
              _jsxDEV("span", { className: "text-blue-500", children: showEditModal.name }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-4", children: ["Namespace: ",
              showEditModal.namespace] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-4", children: /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Data (Key-Value pairs)" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("div", { className: "space-y-3", children:
                  Object.entries(editData.data).map(([key, value]) => /*#__PURE__*/
                  _jsxDEV("div", { className: "space-y-1", children: [/*#__PURE__*/
                    _jsxDEV("label", { className: "text-xs text-gray-500 dark:text-gray-400 font-mono", children: key }, void 0, false), /*#__PURE__*/
                    _jsxDEV("textarea", {
                      value: value,
                      onChange: (e) => setEditData((prev) => prev ? {
                        ...prev,
                        data: { ...prev.data, [key]: e.target.value }
                      } : null),
                      rows: 3,
                      className: "w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-sm resize-y" }, void 0, false
                    )] }, key, true
                  )
                  ) }, void 0, false
                )] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex justify-end gap-3 mt-6", children: [/*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => {setShowEditModal(null);setEditData(null);},
                className: "px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white transition-colors", children:
                "Cancel" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("button", {
                onClick: handleUpdate,
                disabled: isSaving,
                className: "px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors disabled:opacity-50", children:

                isSaving ? 'Saving...' : 'Save Changes' }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}
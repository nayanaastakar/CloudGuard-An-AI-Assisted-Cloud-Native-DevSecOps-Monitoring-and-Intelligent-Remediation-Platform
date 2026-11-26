import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  KeyIcon,
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
  FunnelIcon } from
'@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { kubernetesApi } from '../../services/api';
import { logger } from '../../utils/logger';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";


export default function SecretsManagement() {
  const { hasRole } = useAuth();
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [namespaceFilter, setNamespaceFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expandedSecret, setExpandedSecret] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const canManageSecrets = hasRole('operator');

  // Fetch secrets from K8s cluster
  const fetchSecrets = useCallback(async () => {
    try {
      setError(null);
      const response = await kubernetesApi.getSecrets(
        namespaceFilter !== 'all' ? namespaceFilter : undefined
      );
      setSecrets(response.data);
    } catch (err) {
      logger.error('Failed to fetch secrets', err);
      setError('Failed to fetch secrets from cluster. Make sure you have a cluster connected.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [namespaceFilter]);

  useEffect(() => {
    fetchSecrets();
  }, [fetchSecrets]);

  // Get unique namespaces
  const namespaces = useMemo(() => {
    const ns = new Set(secrets.map((s) => s.namespace));
    return ['all', ...Array.from(ns).sort()];
  }, [secrets]);

  // Get unique types
  const secretTypes = useMemo(() => {
    const types = new Set(secrets.map((s) => s.type));
    return ['all', ...Array.from(types).sort()];
  }, [secrets]);

  // Filter secrets
  const filteredSecrets = useMemo(() => {
    return secrets.filter((secret) => {
      const matchesSearch =
      secret.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      secret.namespace.toLowerCase().includes(searchQuery.toLowerCase()) ||
      secret.data_keys.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesNamespace = namespaceFilter === 'all' || secret.namespace === namespaceFilter;
      const matchesType = typeFilter === 'all' || secret.type === typeFilter;
      return matchesSearch && matchesNamespace && matchesType;
    });
  }, [secrets, searchQuery, namespaceFilter, typeFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSecrets();
  };

  const toggleExpand = (secretKey) => {
    if (expandedSecret === secretKey) {
      setExpandedSecret(null);
    } else {
      setExpandedSecret(secretKey);
    }
  };

  const copyToClipboard = async (value, key) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDelete = async (secret) => {
    try {
      // In real implementation: await kubernetesApi.deleteSecret(secret.namespace, secret.name);
      setSecrets((prev) => prev.filter((s) => !(s.name === secret.name && s.namespace === secret.namespace)));
      setShowDeleteConfirm(null);
    } catch (err) {
      logger.error('Failed to delete secret', err);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'Opaque': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'kubernetes.io/tls': 'bg-green-500/20 text-green-400 border-green-500/30',
      'kubernetes.io/dockerconfigjson': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'kubernetes.io/service-account-token': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'kubernetes.io/basic-auth': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'kubernetes.io/ssh-auth': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getTypeDisplayName = (type) => {
    const names = {
      'Opaque': 'Opaque',
      'kubernetes.io/tls': 'TLS',
      'kubernetes.io/dockerconfigjson': 'Docker Registry',
      'kubernetes.io/service-account-token': 'Service Account',
      'kubernetes.io/basic-auth': 'Basic Auth',
      'kubernetes.io/ssh-auth': 'SSH Auth'
    };
    return names[type] || type;
  };

  if (loading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center h-64", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3 text-gray-400", children: [/*#__PURE__*/
          _jsxDEV(ArrowPathIcon, { className: "w-6 h-6 animate-spin" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { children: "Loading secrets from cluster..." }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ));

  }

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(KeyIcon, { className: "w-7 h-7 text-yellow-400" }, void 0, false), "Kubernetes Secrets"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-400 mt-1", children: "View and manage secrets from your Kubernetes cluster" }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            onClick: handleRefresh,
            disabled: isRefreshing,
            className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors disabled:opacity-50", children: [/*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

          ),
          canManageSecrets && /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            onClick: () => setShowCreateModal(true),
            className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-medium transition-colors", children: [/*#__PURE__*/

            _jsxDEV(PlusIcon, { className: "w-5 h-5" }, void 0, false), "Create Secret"] }, void 0, true

          )] }, void 0, true

        )] }, void 0, true
      ),


      error && /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30", children: [/*#__PURE__*/

        _jsxDEV(ExclamationTriangleIcon, { className: "w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-red-400 font-medium", children: "Error" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-red-400/80 text-sm mt-1", children: error }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/



      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30", children: [/*#__PURE__*/

        _jsxDEV(ExclamationTriangleIcon, { className: "w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-yellow-400 font-medium", children: "Security Notice" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-yellow-400/80 text-sm mt-1", children: "Secret values are sensitive. Access to secret data is logged for audit purposes. Secret values are base64 encoded in Kubernetes." }, void 0, false


          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex flex-col sm:flex-row gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "relative flex-1", children: [/*#__PURE__*/
          _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("input", {
            type: "text",
            placeholder: "Search secrets by name, namespace, or key...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500" }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(FunnelIcon, { className: "w-5 h-5 text-gray-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("select", {
              value: namespaceFilter,
              onChange: (e) => setNamespaceFilter(e.target.value),
              className: "px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50", children:

              namespaces.map((ns) => /*#__PURE__*/
              _jsxDEV("option", { value: ns, children:
                ns === 'all' ? 'All Namespaces' : ns }, ns, false
              )
              ) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("select", {
            value: typeFilter,
            onChange: (e) => setTypeFilter(e.target.value),
            className: "px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50", children:

            secretTypes.map((type) => /*#__PURE__*/
            _jsxDEV("option", { value: type, children:
              type === 'all' ? 'All Types' : getTypeDisplayName(type) }, type, false
            )
            ) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "p-4 rounded-lg bg-gray-800 border border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-400 text-sm", children: "Total Secrets" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-white mt-1", children: secrets.length }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "p-4 rounded-lg bg-gray-800 border border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-400 text-sm", children: "Namespaces" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-white mt-1", children: namespaces.length - 1 }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "p-4 rounded-lg bg-gray-800 border border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-400 text-sm", children: "TLS Certificates" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-green-400 mt-1", children:
            secrets.filter((s) => s.type === 'kubernetes.io/tls').length }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "p-4 rounded-lg bg-gray-800 border border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-400 text-sm", children: "Total Keys" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-white mt-1", children:
            secrets.reduce((acc, s) => acc + s.data_count, 0) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "space-y-4", children: /*#__PURE__*/
        _jsxDEV(AnimatePresence, { mode: "popLayout", children:
          filteredSecrets.length === 0 ? /*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "text-center py-12 text-gray-400", children: [/*#__PURE__*/

            _jsxDEV(KeyIcon, { className: "w-12 h-12 mx-auto mb-4 opacity-50" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { children: secrets.length === 0 ? 'No secrets found in the cluster' : 'No secrets match your filters' }, void 0, false)] }, void 0, true
          ) :

          filteredSecrets.map((secret) => {
            const secretKey = `${secret.namespace}/${secret.name}`;
            const isExpanded = expandedSecret === secretKey;

            return (/*#__PURE__*/
              _jsxDEV(motion.div, {

                layout: true,
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 },
                className: "p-4 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors", children: [/*#__PURE__*/


                _jsxDEV("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "p-2 rounded-lg bg-yellow-500/20", children: /*#__PURE__*/
                      _jsxDEV(KeyIcon, { className: "w-5 h-5 text-yellow-400" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("h3", { className: "text-lg font-semibold text-white", children: secret.name }, void 0, false), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm text-gray-400", children: [
                        secret.namespace, " • ", secret.data_count, " key", secret.data_count !== 1 ? 's' : '', " • ", secret.age] }, void 0, true
                      )] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: `px-3 py-1 text-xs rounded-full border ${getTypeColor(secret.type)}`, children:
                      getTypeDisplayName(secret.type) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.1 },
                      whileTap: { scale: 0.9 },
                      onClick: () => toggleExpand(secretKey),
                      className: "p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors",
                      title: isExpanded ? 'Hide keys' : 'Show keys', children:

                      isExpanded ? /*#__PURE__*/
                      _jsxDEV(EyeSlashIcon, { className: "w-4 h-4" }, void 0, false) : /*#__PURE__*/

                      _jsxDEV(EyeIcon, { className: "w-4 h-4" }, void 0, false) }, void 0, false

                    ),
                    canManageSecrets && /*#__PURE__*/
                    _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                      _jsxDEV(motion.button, {
                        whileHover: { scale: 1.1 },
                        whileTap: { scale: 0.9 },
                        className: "p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors",
                        title: "Edit secret", children: /*#__PURE__*/

                        _jsxDEV(PencilIcon, { className: "w-4 h-4" }, void 0, false) }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV(motion.button, {
                        whileHover: { scale: 1.1 },
                        whileTap: { scale: 0.9 },
                        onClick: () => setShowDeleteConfirm(secret),
                        className: "p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors",
                        title: "Delete secret", children: /*#__PURE__*/

                        _jsxDEV(TrashIcon, { className: "w-4 h-4" }, void 0, false) }, void 0, false
                      )] }, void 0, true
                    )] }, void 0, true

                  )] }, void 0, true
                ), /*#__PURE__*/


                _jsxDEV(AnimatePresence, { children:
                  isExpanded && /*#__PURE__*/
                  _jsxDEV(motion.div, {
                    initial: { height: 0, opacity: 0 },
                    animate: { height: 'auto', opacity: 1 },
                    exit: { height: 0, opacity: 0 },
                    transition: { duration: 0.2 },
                    className: "overflow-hidden", children: /*#__PURE__*/

                    _jsxDEV("div", { className: "mt-4 pt-4 border-t border-gray-700 space-y-2", children: [/*#__PURE__*/
                      _jsxDEV("p", { className: "text-xs text-gray-500 mb-3", children: "Data Keys (values are base64 encoded in Kubernetes):" }, void 0, false

                      ),
                      secret.data_keys.map((key) => /*#__PURE__*/
                      _jsxDEV("div", {

                        className: "flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-900/50", children: [/*#__PURE__*/

                        _jsxDEV("code", { className: "text-sm text-cyan-400 font-mono", children:
                          key }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV(motion.button, {
                          whileHover: { scale: 1.1 },
                          whileTap: { scale: 0.9 },
                          onClick: () => copyToClipboard(key, `${secretKey}-${key}`),
                          className: "p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors",
                          title: "Copy key name", children:

                          copiedKey === `${secretKey}-${key}` ? /*#__PURE__*/
                          _jsxDEV(CheckIcon, { className: "w-4 h-4 text-green-400" }, void 0, false) : /*#__PURE__*/

                          _jsxDEV(ClipboardDocumentIcon, { className: "w-4 h-4" }, void 0, false) }, void 0, false

                        )] }, key, true
                      )
                      )] }, void 0, true
                    ) }, void 0, false
                  ) }, void 0, false

                ),


                Object.keys(secret.labels).length > 0 && /*#__PURE__*/
                _jsxDEV("div", { className: "mt-4 pt-4 border-t border-gray-700 flex flex-wrap gap-2", children: [
                  Object.entries(secret.labels).slice(0, 4).map(([k, v]) => /*#__PURE__*/
                  _jsxDEV("span", {

                    className: "px-2 py-1 text-xs rounded bg-gray-700/50 text-gray-400 font-mono", children: [

                    k, "=", v] }, k, true
                  )
                  ),
                  Object.keys(secret.labels).length > 4 && /*#__PURE__*/
                  _jsxDEV("span", { className: "px-2 py-1 text-xs text-gray-500", children: ["+",
                    Object.keys(secret.labels).length - 4, " more"] }, void 0, true
                  )] }, void 0, true

                )] }, secretKey, true

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
            className: "bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "flex items-center gap-3 mb-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-3 rounded-full bg-red-500/20", children: /*#__PURE__*/
                _jsxDEV(ExclamationTriangleIcon, { className: "w-6 h-6 text-red-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("h3", { className: "text-xl font-bold text-white", children: "Delete Secret" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-300 mb-2", children: ["Are you sure you want to delete ", /*#__PURE__*/
              _jsxDEV("span", { className: "font-mono text-red-400", children: showDeleteConfirm.name }, void 0, false), " from ", /*#__PURE__*/_jsxDEV("span", { className: "font-mono text-yellow-400", children: showDeleteConfirm.namespace }, void 0, false), "?"] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-400 text-sm mb-6", children: "This action cannot be undone. Applications depending on this secret will fail." }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex justify-end gap-3", children: [/*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => setShowDeleteConfirm(null),
                className: "px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors", children:
                "Cancel" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => handleDelete(showDeleteConfirm),
                className: "px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors", children:
                "Delete Secret" }, void 0, false

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
            className: "bg-gray-800 rounded-xl p-6 max-w-2xl w-full border border-gray-700", children: [/*#__PURE__*/

            _jsxDEV("h3", { className: "text-xl font-bold text-white mb-4", children: "Create Secret" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Secret Name" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("input", {
                  type: "text",
                  placeholder: "my-secret",
                  className: "w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50" }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Namespace" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("select", { className: "w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50", children:
                    namespaces.filter((n) => n !== 'all').map((ns) => /*#__PURE__*/
                    _jsxDEV("option", { value: ns, children: ns }, ns, false)
                    ) }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Type" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("select", { className: "w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50", children: [/*#__PURE__*/
                    _jsxDEV("option", { value: "Opaque", children: "Opaque" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "kubernetes.io/tls", children: "TLS" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "kubernetes.io/dockerconfigjson", children: "Docker Registry" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "kubernetes.io/basic-auth", children: "Basic Auth" }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Data (Key-Value pairs)" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex gap-2", children: [/*#__PURE__*/
                    _jsxDEV("input", {
                      type: "text",
                      placeholder: "KEY",
                      className: "flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 font-mono text-sm" }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("input", {
                      type: "password",
                      placeholder: "Value",
                      className: "flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 font-mono text-sm" }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("button", { className: "flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300", children: [/*#__PURE__*/
                    _jsxDEV(PlusIcon, { className: "w-4 h-4" }, void 0, false), "Add Key-Value Pair"] }, void 0, true

                  )] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex justify-end gap-3 mt-6", children: [/*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => setShowCreateModal(false),
                className: "px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors", children:
                "Cancel" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("button", { className: "px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-medium transition-colors", children: "Create Secret" }, void 0, false

              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}
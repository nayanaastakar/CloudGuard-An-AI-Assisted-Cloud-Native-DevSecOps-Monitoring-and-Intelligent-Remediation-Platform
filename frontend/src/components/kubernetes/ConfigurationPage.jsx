import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { kubernetesApi } from '../../services/api';
import { logger } from '../../utils/logger';
import { useNamespace } from '../../contexts/NamespaceContext';
import { useAuth } from '../../contexts/AuthContext';

import {
  ArrowPathIcon,
  DocumentDuplicateIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon } from
'@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';

// Types
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";







// Stats Card
function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  index






}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
  };

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.05 },
      className: "p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
        _jsxDEV("div", { className: `p-2.5 rounded-xl ${colorClasses[color]}`, children: /*#__PURE__*/
          _jsxDEV(Icon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: value }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: title }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Modal Component
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (/*#__PURE__*/
    _jsxDEV(AnimatePresence, { children: /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
        onClick: onClose, children: /*#__PURE__*/

        _jsxDEV(motion.div, {
          initial: { scale: 0.95, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.95, opacity: 0 },
          className: "bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden",
          onClick: (e) => e.stopPropagation(), children: [/*#__PURE__*/

          _jsxDEV("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: title }, void 0, false), /*#__PURE__*/
            _jsxDEV("button", { onClick: onClose, className: "p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors", children: /*#__PURE__*/
              _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "p-6 overflow-y-auto max-h-[calc(90vh-80px)]", children:
            children }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ) }, void 0, false
    ));

}

// Secret Type Badge
function SecretTypeBadge({ type }) {
  const config = {
    'Opaque': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'Opaque' },
    'kubernetes.io/tls': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'TLS' },
    'kubernetes.io/dockerconfigjson': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', label: 'Docker' },
    'kubernetes.io/service-account-token': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', label: 'SA Token' },
    'kubernetes.io/basic-auth': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Basic Auth' },
    'kubernetes.io/ssh-auth': { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-400', label: 'SSH' }
  };
  const style = config[type] || { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-400', label: type };
  return (/*#__PURE__*/
    _jsxDEV("span", { className: `px-2.5 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`, children:
      style.label }, void 0, false
    ));

}

// ConfigMaps Table
function ConfigMapsTable({
  configMaps,
  loading,
  onEdit,
  onDelete





}) {
  const { hasRole } = useAuth();
  const canManage = hasRole('operator');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCM, setExpandedCM] = useState(null);
  const [cmData, setCmData] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const filteredCMs = configMaps.filter((cm) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return cm.name.toLowerCase().includes(query) || cm.namespace.toLowerCase().includes(query);
    }
    return true;
  });

  const toggleExpand = async (cm) => {
    const key = `${cm.namespace}/${cm.name}`;
    if (expandedCM === key) {
      setExpandedCM(null);
      setCmData(null);
    } else {
      setExpandedCM(key);
      setLoadingData(true);
      try {
        const response = await kubernetesApi.getConfigMap(cm.namespace, cm.name);
        setCmData(response.data);
      } catch (err) {
        logger.error('Failed to fetch configmap', err);
      } finally {
        setLoadingData(false);
      }
    }
  };

  const copyToClipboard = async (value, key) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 overflow-hidden", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "px-5 py-4 border-b border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30", children: /*#__PURE__*/
              _jsxDEV(DocumentDuplicateIcon, { className: "h-5 w-5 text-blue-600 dark:text-blue-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "ConfigMaps" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-full", children:
              filteredCMs.length }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
            _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              placeholder: "Search configmaps...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "pl-9 pr-4 py-2 text-sm bg-white/50 dark:bg-slate-900/50 border border-gray-200/50 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm" }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "divide-y divide-gray-100/50 dark:divide-slate-700/50", children:
        loading ? /*#__PURE__*/
        _jsxDEV("div", { className: "px-5 py-8 text-center", children: [/*#__PURE__*/
          _jsxDEV(ArrowPathIcon, { className: "h-5 w-5 animate-spin mx-auto text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "mt-2 text-sm text-gray-500", children: "Loading ConfigMaps..." }, void 0, false)] }, void 0, true
        ) :
        filteredCMs.length === 0 ? /*#__PURE__*/
        _jsxDEV("div", { className: "px-5 py-8 text-center text-gray-500", children: [/*#__PURE__*/
          _jsxDEV(DocumentDuplicateIcon, { className: "h-10 w-10 mx-auto mb-2 opacity-50" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { children: "No ConfigMaps found" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm mt-1", children: "Try adjusting your search or namespace filter" }, void 0, false)] }, void 0, true
        ) :

        filteredCMs.map((cm, index) => {
          const cmKey = `${cm.namespace}/${cm.name}`;
          const isExpanded = expandedCM === cmKey;

          return (/*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: index * 0.02 },
              className: "px-5 py-4 hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "p-2 rounded-lg bg-blue-500/10", children: /*#__PURE__*/
                    _jsxDEV(DocumentDuplicateIcon, { className: "h-4 w-4 text-blue-500" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "font-medium text-gray-900 dark:text-white", children: cm.name }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500", children: [cm.namespace, " • ", cm.data_count, " keys • ", cm.age] }, void 0, true)] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => toggleExpand(cm),
                    className: "p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors",
                    title: isExpanded ? 'Hide data' : 'View data', children:

                    isExpanded ? /*#__PURE__*/_jsxDEV(EyeSlashIcon, { className: "h-4 w-4" }, void 0, false) : /*#__PURE__*/_jsxDEV(EyeIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  ),
                  canManage && /*#__PURE__*/
                  _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                    _jsxDEV("button", {
                      onClick: () => onEdit(cm),
                      className: "p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors",
                      title: "Edit", children: /*#__PURE__*/

                      _jsxDEV(PencilIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("button", {
                      onClick: () => onDelete(cm.namespace, cm.name),
                      className: "p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors",
                      title: "Delete", children: /*#__PURE__*/

                      _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
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
                  className: "overflow-hidden", children: /*#__PURE__*/

                  _jsxDEV("div", { className: "mt-4 pt-4 border-t border-gray-200/50 dark:border-slate-700/50 space-y-3", children:
                    loadingData ? /*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2 text-gray-400", children: [/*#__PURE__*/
                      _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-sm", children: "Loading data..." }, void 0, false)] }, void 0, true
                    ) :
                    !cmData || Object.entries(cmData.data).length === 0 ? /*#__PURE__*/
                    _jsxDEV("p", { className: "text-gray-400 text-sm italic", children: "No data keys in this ConfigMap" }, void 0, false) :

                    Object.entries(cmData.data).map(([key, value]) => /*#__PURE__*/
                    _jsxDEV("div", { className: "p-3 rounded-lg bg-gray-50 dark:bg-slate-900/50", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
                        _jsxDEV("code", { className: "text-sm text-blue-600 dark:text-blue-400 font-mono font-medium", children: key }, void 0, false), /*#__PURE__*/
                        _jsxDEV("button", {
                          onClick: () => copyToClipboard(value, `${cmKey}-${key}`),
                          className: "p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors",
                          title: "Copy value", children:

                          copiedKey === `${cmKey}-${key}` ? /*#__PURE__*/
                          _jsxDEV(CheckIcon, { className: "w-4 h-4 text-green-400" }, void 0, false) : /*#__PURE__*/

                          _jsxDEV(ClipboardDocumentIcon, { className: "w-4 h-4" }, void 0, false) }, void 0, false

                        )] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("pre", { className: "text-xs text-gray-600 dark:text-gray-300 font-mono bg-gray-100 dark:bg-slate-800 p-2 rounded overflow-x-auto max-h-32", children:
                        value }, void 0, false
                      )] }, key, true
                    )
                    ) }, void 0, false

                  ) }, void 0, false
                ) }, void 0, false

              )] }, cmKey, true
            ));

        }) }, void 0, false

      )] }, void 0, true
    ));

}

// Secrets Table
function SecretsTable({
  secrets,
  loading,
  onEdit,
  onDelete





}) {
  const { hasRole } = useAuth();
  const canManage = hasRole('operator');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expandedSecret, setExpandedSecret] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const secretTypes = useMemo(() => {
    const types = new Set(secrets.map((s) => s.type));
    return ['all', ...Array.from(types).sort()];
  }, [secrets]);

  const filteredSecrets = secrets.filter((secret) => {
    if (typeFilter !== 'all' && secret.type !== typeFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return secret.name.toLowerCase().includes(query) || secret.namespace.toLowerCase().includes(query);
    }
    return true;
  });

  const toggleExpand = (secret) => {
    const key = `${secret.namespace}/${secret.name}`;
    setExpandedSecret(expandedSecret === key ? null : key);
  };

  const copyToClipboard = async (value, key) => {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 overflow-hidden", children: [/*#__PURE__*/


      _jsxDEV("div", { className: "px-5 py-3 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2 text-yellow-700 dark:text-yellow-400", children: [/*#__PURE__*/
          _jsxDEV(ExclamationTriangleIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "text-xs", children: "Secret values are sensitive. Access is logged for audit purposes." }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "px-5 py-4 border-b border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/30", children: /*#__PURE__*/
              _jsxDEV(KeyIcon, { className: "h-5 w-5 text-yellow-600 dark:text-yellow-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Secrets" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-full", children:
              filteredSecrets.length }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
              _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                placeholder: "Search secrets...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "pl-9 pr-4 py-2 text-sm bg-white/50 dark:bg-slate-900/50 border border-gray-200/50 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent backdrop-blur-sm" }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("select", {
              value: typeFilter,
              onChange: (e) => setTypeFilter(e.target.value),
              className: "text-sm bg-white/50 dark:bg-slate-900/50 border border-gray-200/50 dark:border-slate-700/50 rounded-xl px-3 py-2 focus:ring-2 focus:ring-yellow-500", children:

              secretTypes.map((type) => /*#__PURE__*/
              _jsxDEV("option", { value: type, children:
                type === 'all' ? 'All Types' : type.replace('kubernetes.io/', '') }, type, false
              )
              ) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "divide-y divide-gray-100/50 dark:divide-slate-700/50", children:
        loading ? /*#__PURE__*/
        _jsxDEV("div", { className: "px-5 py-8 text-center", children: [/*#__PURE__*/
          _jsxDEV(ArrowPathIcon, { className: "h-5 w-5 animate-spin mx-auto text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "mt-2 text-sm text-gray-500", children: "Loading Secrets..." }, void 0, false)] }, void 0, true
        ) :
        filteredSecrets.length === 0 ? /*#__PURE__*/
        _jsxDEV("div", { className: "px-5 py-8 text-center text-gray-500", children: [/*#__PURE__*/
          _jsxDEV(KeyIcon, { className: "h-10 w-10 mx-auto mb-2 opacity-50" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { children: "No Secrets found" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm mt-1", children: "Try adjusting your search or filters" }, void 0, false)] }, void 0, true
        ) :

        filteredSecrets.map((secret, index) => {
          const secretKey = `${secret.namespace}/${secret.name}`;
          const isExpanded = expandedSecret === secretKey;

          return (/*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: index * 0.02 },
              className: "px-5 py-4 hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "p-2 rounded-lg bg-yellow-500/10", children: /*#__PURE__*/
                    _jsxDEV(KeyIcon, { className: "h-4 w-4 text-yellow-500" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "font-medium text-gray-900 dark:text-white", children: secret.name }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500", children: [secret.namespace, " • ", secret.data_count, " keys • ", secret.age] }, void 0, true)] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(SecretTypeBadge, { type: secret.type }, void 0, false), /*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => toggleExpand(secret),
                    className: "p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors",
                    title: isExpanded ? 'Hide keys' : 'View keys', children:

                    isExpanded ? /*#__PURE__*/_jsxDEV(EyeSlashIcon, { className: "h-4 w-4" }, void 0, false) : /*#__PURE__*/_jsxDEV(EyeIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  ),
                  canManage && /*#__PURE__*/
                  _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                    _jsxDEV("button", {
                      onClick: () => onEdit(secret),
                      className: "p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors",
                      title: "Edit", children: /*#__PURE__*/

                      _jsxDEV(PencilIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("button", {
                      onClick: () => onDelete(secret.namespace, secret.name),
                      className: "p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors",
                      title: "Delete", children: /*#__PURE__*/

                      _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
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
                  className: "overflow-hidden", children: /*#__PURE__*/

                  _jsxDEV("div", { className: "mt-4 pt-4 border-t border-gray-200/50 dark:border-slate-700/50 space-y-2", children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 mb-3", children: "Data Keys (click to copy key name):" }, void 0, false),
                    secret.data_keys.length === 0 ? /*#__PURE__*/
                    _jsxDEV("p", { className: "text-gray-400 text-sm italic", children: "No data keys" }, void 0, false) :

                    secret.data_keys.map((key) => /*#__PURE__*/
                    _jsxDEV("div", {

                      className: "flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-900/50", children: [/*#__PURE__*/

                      _jsxDEV("code", { className: "text-sm text-yellow-600 dark:text-yellow-400 font-mono", children: key }, void 0, false), /*#__PURE__*/
                      _jsxDEV("button", {
                        onClick: () => copyToClipboard(key, `${secretKey}-${key}`),
                        className: "p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors", children:

                        copiedKey === `${secretKey}-${key}` ? /*#__PURE__*/
                        _jsxDEV(CheckIcon, { className: "w-4 h-4 text-green-400" }, void 0, false) : /*#__PURE__*/

                        _jsxDEV(ClipboardDocumentIcon, { className: "w-4 h-4" }, void 0, false) }, void 0, false

                      )] }, key, true
                    )
                    )] }, void 0, true

                  ) }, void 0, false
                ) }, void 0, false

              )] }, secretKey, true
            ));

        }) }, void 0, false

      )] }, void 0, true
    ));

}

// Delete Confirmation Modal
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  resourceType,
  resourceName,
  loading







}) {
  return (/*#__PURE__*/
    _jsxDEV(Modal, { isOpen: isOpen, onClose: onClose, title: `Delete ${resourceType}`, children: /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
        _jsxDEV("p", { className: "text-gray-700 dark:text-gray-300", children: ["Are you sure you want to delete ", /*#__PURE__*/
          _jsxDEV("span", { className: "font-semibold text-red-600", children: resourceName }, void 0, false), "?"] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("p", { className: "text-sm text-gray-500", children: "This action cannot be undone. Applications depending on this resource will fail." }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex justify-end gap-3 pt-4", children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: onClose,
            className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors", children:
            "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: onConfirm,
            disabled: loading,
            className: "px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 flex items-center gap-2", children: [

            loading && /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Delete"] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Create ConfigMap Modal
function CreateConfigMapModal({
  isOpen,
  onClose,
  onSuccess,
  namespaces





}) {
  const [formData, setFormData] = useState({
    name: '',
    namespace: 'default',
    data: [{ key: '', value: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Name is required');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = {};
      formData.data.forEach((item) => {
        if (item.key) data[item.key] = item.value;
      });

      await kubernetesApi.createConfigMap({
        name: formData.name,
        namespace: formData.namespace,
        data
      });
      onSuccess();
      onClose();
      setFormData({ name: '', namespace: 'default', data: [{ key: '', value: '' }] });
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to create ConfigMap';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addDataField = () => {
    setFormData((prev) => ({ ...prev, data: [...prev.data, { key: '', value: '' }] }));
  };

  const removeDataField = (index) => {
    setFormData((prev) => ({ ...prev, data: prev.data.filter((_, i) => i !== index) }));
  };

  return (/*#__PURE__*/
    _jsxDEV(Modal, { isOpen: isOpen, onClose: onClose, title: "Create ConfigMap", children: /*#__PURE__*/
      _jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        error && /*#__PURE__*/
        _jsxDEV("div", { className: "p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm", children:
          error }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Name" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              required: true,
              value: formData.name,
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              className: "w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500",
              placeholder: "my-configmap" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Namespace" }, void 0, false), /*#__PURE__*/
            _jsxDEV("select", {
              value: formData.namespace,
              onChange: (e) => setFormData({ ...formData, namespace: e.target.value }),
              className: "w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500", children:

              namespaces.map((ns) => /*#__PURE__*/
              _jsxDEV("option", { value: ns.name, children: ns.name }, ns.name, false)
              ) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Data (Key-Value Pairs)" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-2", children: [
            formData.data.map((item, index) => /*#__PURE__*/
            _jsxDEV("div", { className: "flex gap-2", children: [/*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                placeholder: "KEY",
                value: item.key,
                onChange: (e) => {
                  const newData = [...formData.data];
                  newData[index].key = e.target.value;
                  setFormData({ ...formData, data: newData });
                },
                className: "flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-mono" }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("textarea", {
                placeholder: "Value",
                value: item.value,
                onChange: (e) => {
                  const newData = [...formData.data];
                  newData[index].value = e.target.value;
                  setFormData({ ...formData, data: newData });
                },
                rows: 1,
                className: "flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-mono resize-y" }, void 0, false
              ),
              formData.data.length > 1 && /*#__PURE__*/
              _jsxDEV("button", { type: "button", onClick: () => removeDataField(index), className: "p-2 text-gray-400 hover:text-red-500", children: /*#__PURE__*/
                _jsxDEV(XMarkIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
              )] }, index, true

            )
            ), /*#__PURE__*/
            _jsxDEV("button", { type: "button", onClick: addDataField, className: "flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600", children: [/*#__PURE__*/
              _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "Add Key-Value"] }, void 0, true

            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl", children: "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", { type: "submit", disabled: loading, className: "px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2", children: [
            loading && /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Create ConfigMap"] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Edit ConfigMap Modal
function EditConfigMapModal({
  isOpen,
  onClose,
  onSuccess,
  configMap





}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && configMap) {
      setFetchLoading(true);
      setError(null);
      kubernetesApi.getConfigMap(configMap.namespace, configMap.name).
      then((res) => {
        setData(res.data.data || {});
      }).
      catch((err) => {
        const errorMessage = err.response?.data?.detail || err.message || 'Failed to load ConfigMap data';
        setError(errorMessage);
      }).
      finally(() => setFetchLoading(false));
    }
  }, [isOpen, configMap]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!configMap) return;
    setLoading(true);
    setError(null);

    try {
      await kubernetesApi.updateConfigMap(configMap.namespace, configMap.name, { data });
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to update ConfigMap';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateValue = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const addKey = () => {
    const newKey = `key_${Object.keys(data).length + 1}`;
    setData((prev) => ({ ...prev, [newKey]: '' }));
  };

  const removeKey = (key) => {
    setData((prev) => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  };

  if (!configMap) return null;

  return (/*#__PURE__*/
    _jsxDEV(Modal, { isOpen: isOpen, onClose: onClose, title: `Edit ConfigMap: ${configMap.name}`, children: /*#__PURE__*/
      _jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        error && /*#__PURE__*/
        _jsxDEV("div", { className: "p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm", children:
          error }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["Namespace: ", /*#__PURE__*/
          _jsxDEV("span", { className: "font-medium text-gray-700 dark:text-gray-300", children: configMap.namespace }, void 0, false)] }, void 0, true
        ),

        fetchLoading ? /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-center py-8", children: /*#__PURE__*/
          _jsxDEV(ArrowPathIcon, { className: "h-6 w-6 animate-spin text-gray-400" }, void 0, false) }, void 0, false
        ) : /*#__PURE__*/

        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Data (Key-Value Pairs)" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: [
            Object.entries(data).map(([key, value]) => /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-1", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                _jsxDEV("code", { className: "text-xs text-blue-600 dark:text-blue-400 font-mono", children: key }, void 0, false), /*#__PURE__*/
                _jsxDEV("button", { type: "button", onClick: () => removeKey(key), className: "text-xs text-red-500 hover:text-red-600", children: "Remove" }, void 0, false

                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("textarea", {
                value: value,
                onChange: (e) => updateValue(key, e.target.value),
                rows: 3,
                className: "w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-mono resize-y" }, void 0, false
              )] }, key, true
            )
            ),
            Object.keys(data).length === 0 && /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-400 text-sm italic", children: "No data keys" }, void 0, false)] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("button", { type: "button", onClick: addKey, className: "mt-3 flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600", children: [/*#__PURE__*/
            _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "Add Key"] }, void 0, true

          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl", children: "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", { type: "submit", disabled: loading || fetchLoading, className: "px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2", children: [
            loading && /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Save Changes"] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Create Secret Modal
function CreateSecretModal({
  isOpen,
  onClose,
  onSuccess,
  namespaces





}) {
  const [formData, setFormData] = useState({
    name: '',
    namespace: 'default',
    type: 'Opaque',
    data: [{ key: '', value: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Name is required');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = {};
      formData.data.forEach((item) => {
        if (item.key) data[item.key] = item.value;
      });

      await kubernetesApi.createSecret({
        name: formData.name,
        namespace: formData.namespace,
        type: formData.type,
        data
      });
      onSuccess();
      onClose();
      setFormData({ name: '', namespace: 'default', type: 'Opaque', data: [{ key: '', value: '' }] });
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to create Secret';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addDataField = () => {
    setFormData((prev) => ({ ...prev, data: [...prev.data, { key: '', value: '' }] }));
  };

  const removeDataField = (index) => {
    setFormData((prev) => ({ ...prev, data: prev.data.filter((_, i) => i !== index) }));
  };

  return (/*#__PURE__*/
    _jsxDEV(Modal, { isOpen: isOpen, onClose: onClose, title: "Create Secret", children: /*#__PURE__*/
      _jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        error && /*#__PURE__*/
        _jsxDEV("div", { className: "p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm", children:
          error }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Name" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              required: true,
              value: formData.name,
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              className: "w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-500",
              placeholder: "my-secret" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Namespace" }, void 0, false), /*#__PURE__*/
            _jsxDEV("select", {
              value: formData.namespace,
              onChange: (e) => setFormData({ ...formData, namespace: e.target.value }),
              className: "w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-500", children:

              namespaces.map((ns) => /*#__PURE__*/
              _jsxDEV("option", { value: ns.name, children: ns.name }, ns.name, false)
              ) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Type" }, void 0, false), /*#__PURE__*/
          _jsxDEV("select", {
            value: formData.type,
            onChange: (e) => setFormData({ ...formData, type: e.target.value }),
            className: "w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-500", children: [/*#__PURE__*/

            _jsxDEV("option", { value: "Opaque", children: "Opaque" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "kubernetes.io/tls", children: "TLS" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "kubernetes.io/dockerconfigjson", children: "Docker Registry" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "kubernetes.io/basic-auth", children: "Basic Auth" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Data (Key-Value Pairs)" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-2", children: [
            formData.data.map((item, index) => /*#__PURE__*/
            _jsxDEV("div", { className: "flex gap-2", children: [/*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                placeholder: "KEY",
                value: item.key,
                onChange: (e) => {
                  const newData = [...formData.data];
                  newData[index].key = e.target.value;
                  setFormData({ ...formData, data: newData });
                },
                className: "flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-mono" }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("textarea", {
                placeholder: "Value (plain text - auto encoded)",
                value: item.value,
                onChange: (e) => {
                  const newData = [...formData.data];
                  newData[index].value = e.target.value;
                  setFormData({ ...formData, data: newData });
                },
                rows: 1,
                className: "flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-mono resize-y" }, void 0, false
              ),
              formData.data.length > 1 && /*#__PURE__*/
              _jsxDEV("button", { type: "button", onClick: () => removeDataField(index), className: "p-2 text-gray-400 hover:text-red-500", children: /*#__PURE__*/
                _jsxDEV(XMarkIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
              )] }, index, true

            )
            ), /*#__PURE__*/
            _jsxDEV("button", { type: "button", onClick: addDataField, className: "flex items-center gap-1 text-sm text-yellow-500 hover:text-yellow-600", children: [/*#__PURE__*/
              _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "Add Key-Value"] }, void 0, true

            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl", children: "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", { type: "submit", disabled: loading, className: "px-4 py-2 bg-yellow-500 text-black rounded-xl hover:bg-yellow-600 disabled:opacity-50 flex items-center gap-2", children: [
            loading && /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Create Secret"] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Edit Secret Modal
function EditSecretModal({
  isOpen,
  onClose,
  onSuccess,
  secret





}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && secret) {
      setFetchLoading(true);
      setError(null);
      kubernetesApi.getSecret(secret.namespace, secret.name).
      then((res) => {
        setData(res.data.data || {});
      }).
      catch((err) => {
        const errorMessage = err.response?.data?.detail || err.message || 'Failed to load Secret data';
        setError(errorMessage);
      }).
      finally(() => setFetchLoading(false));
    }
  }, [isOpen, secret]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!secret) return;
    setLoading(true);
    setError(null);

    try {
      await kubernetesApi.updateSecret(secret.namespace, secret.name, { data });
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to update Secret';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateValue = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const addKey = () => {
    const newKey = `key_${Object.keys(data).length + 1}`;
    setData((prev) => ({ ...prev, [newKey]: '' }));
  };

  const removeKey = (key) => {
    setData((prev) => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  };

  if (!secret) return null;

  return (/*#__PURE__*/
    _jsxDEV(Modal, { isOpen: isOpen, onClose: onClose, title: `Edit Secret: ${secret.name}`, children: /*#__PURE__*/
      _jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl", children: /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2 text-yellow-700 dark:text-yellow-400", children: [/*#__PURE__*/
            _jsxDEV(ExclamationTriangleIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "text-xs", children: "Editing secret values. Changes will be base64 encoded automatically." }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ),

        error && /*#__PURE__*/
        _jsxDEV("div", { className: "p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm", children:
          error }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["Namespace: ", /*#__PURE__*/
          _jsxDEV("span", { className: "font-medium text-gray-700 dark:text-gray-300", children: secret.namespace }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "mx-2", children: "•" }, void 0, false), "Type: ", /*#__PURE__*/
          _jsxDEV("span", { className: "font-medium text-gray-700 dark:text-gray-300", children: secret.type }, void 0, false)] }, void 0, true
        ),

        fetchLoading ? /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-center py-8", children: /*#__PURE__*/
          _jsxDEV(ArrowPathIcon, { className: "h-6 w-6 animate-spin text-gray-400" }, void 0, false) }, void 0, false
        ) : /*#__PURE__*/

        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Data (Key-Value Pairs)" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: [
            Object.entries(data).map(([key, value]) => /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-1", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                _jsxDEV("code", { className: "text-xs text-yellow-600 dark:text-yellow-400 font-mono", children: key }, void 0, false), /*#__PURE__*/
                _jsxDEV("button", { type: "button", onClick: () => removeKey(key), className: "text-xs text-red-500 hover:text-red-600", children: "Remove" }, void 0, false

                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("textarea", {
                value: value,
                onChange: (e) => updateValue(key, e.target.value),
                rows: 2,
                className: "w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-mono resize-y",
                placeholder: "Enter plain text value (auto encoded)" }, void 0, false
              )] }, key, true
            )
            ),
            Object.keys(data).length === 0 && /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-400 text-sm italic", children: "No data keys" }, void 0, false)] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("button", { type: "button", onClick: addKey, className: "mt-3 flex items-center gap-1 text-sm text-yellow-500 hover:text-yellow-600", children: [/*#__PURE__*/
            _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "Add Key"] }, void 0, true

          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl", children: "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", { type: "submit", disabled: loading || fetchLoading, className: "px-4 py-2 bg-yellow-500 text-black rounded-xl hover:bg-yellow-600 disabled:opacity-50 flex items-center gap-2", children: [
            loading && /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Save Changes"] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Main Component


export default function ConfigurationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedNamespace } = useNamespace();
  const { hasRole } = useAuth();
  const canManage = hasRole('operator');

  const getInitialTab = () => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'secrets') return 'secrets';
    return 'configmaps';
  };

  const [configMaps, setConfigMaps] = useState([]);
  const [secrets, setSecrets] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(getInitialTab());

  // Modals
  const [showCreateConfigMapModal, setShowCreateConfigMapModal] = useState(false);
  const [showCreateSecretModal, setShowCreateSecretModal] = useState(false);
  const [editConfigMap, setEditConfigMap] = useState(null);
  const [editSecret, setEditSecret] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSearchParams({ tab }, { replace: true });
  }, [setSearchParams]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['configmaps', 'secrets'].includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams, activeTab]);

  useEffect(() => {
    loadData();
  }, [selectedNamespace]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const ns = selectedNamespace || undefined;
      const [configMapsRes, secretsRes, namespacesRes] = await Promise.all([
      kubernetesApi.getConfigMaps(ns),
      kubernetesApi.getSecrets(ns),
      kubernetesApi.getNamespaces()]
      );
      setConfigMaps(configMapsRes.data || []);
      setSecrets(secretsRes.data || []);
      setNamespaces(namespacesRes.data || []);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to load configuration data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleteLoading(true);
    try {
      if (deleteModal.type === 'ConfigMap') {
        await kubernetesApi.deleteConfigMap(deleteModal.namespace, deleteModal.name);
      } else {
        await kubernetesApi.deleteSecret(deleteModal.namespace, deleteModal.name);
      }
      loadData();
      setDeleteModal(null);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to delete resource';
      setError(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  const stats = {
    configMaps: configMaps.length,
    secrets: secrets.length,
    opaqueSecrets: secrets.filter((s) => s.type === 'Opaque').length,
    tlsSecrets: secrets.filter((s) => s.type === 'kubernetes.io/tls').length,
    totalKeys: configMaps.reduce((acc, cm) => acc + cm.data_count, 0) + secrets.reduce((acc, s) => acc + s.data_count, 0)
  };

  const tabs = [
  { id: 'configmaps', label: 'ConfigMaps', icon: DocumentDuplicateIcon, count: stats.configMaps },
  { id: 'secrets', label: 'Secrets', icon: KeyIcon, count: stats.secrets }];


  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV(PageHeader, {
        title: "Configuration",
        description: "Manage ConfigMaps and Secrets for your applications",
        icon: Cog6ToothIcon,
        iconColor: "blue",
        actions: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: loadData,
            disabled: loading,
            className: "flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50", children: [/*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${loading ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

          ),
          canManage && activeTab === 'configmaps' && /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => setShowCreateConfigMapModal(true),
            className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25", children: [/*#__PURE__*/

            _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "Create ConfigMap"] }, void 0, true

          ),

          canManage && activeTab === 'secrets' && /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => setShowCreateSecretModal(true),
            className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-xl text-sm font-medium shadow-lg shadow-yellow-500/25", children: [/*#__PURE__*/

            _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "Create Secret"] }, void 0, true

          )] }, void 0, true

        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [/*#__PURE__*/
        _jsxDEV(StatsCard, { title: "ConfigMaps", value: stats.configMaps, icon: DocumentDuplicateIcon, color: "blue", index: 0 }, void 0, false), /*#__PURE__*/
        _jsxDEV(StatsCard, { title: "Secrets", value: stats.secrets, icon: KeyIcon, color: "yellow", index: 1 }, void 0, false), /*#__PURE__*/
        _jsxDEV(StatsCard, { title: "TLS Certificates", value: stats.tlsSecrets, icon: KeyIcon, color: "green", index: 2 }, void 0, false), /*#__PURE__*/
        _jsxDEV(StatsCard, { title: "Total Keys", value: stats.totalKeys, icon: Cog6ToothIcon, color: "purple", index: 3 }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex gap-2 border-b border-gray-200 dark:border-slate-700 pb-4", children:
        tabs.map((tab) => /*#__PURE__*/
        _jsxDEV("button", {

          onClick: () => handleTabChange(tab.id),
          className: `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          activeTab === tab.id ?
          tab.id === 'configmaps' ?
          'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' :
          'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg shadow-yellow-500/25' :
          'bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200/50 dark:border-slate-700/50'}`, children: [/*#__PURE__*/


          _jsxDEV(tab.icon, { className: "h-4 w-4" }, void 0, false),
          tab.label, /*#__PURE__*/
          _jsxDEV("span", { className: `px-1.5 py-0.5 text-[10px] rounded-full ${
            activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-700'}`, children:

            tab.count }, void 0, false
          )] }, tab.id, true
        )
        ) }, void 0, false
      ),


      error && /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV(ExclamationTriangleIcon, { className: "h-5 w-5" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { children: error }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("button", { onClick: loadData, className: "mt-2 text-sm underline hover:no-underline", children: "Retry" }, void 0, false)] }, void 0, true
      ),



      activeTab === 'configmaps' && /*#__PURE__*/
      _jsxDEV(ConfigMapsTable, {
        configMaps: configMaps,
        loading: loading,
        onEdit: (cm) => setEditConfigMap(cm),
        onDelete: (namespace, name) => setDeleteModal({ isOpen: true, type: 'ConfigMap', namespace, name }) }, void 0, false
      ),

      activeTab === 'secrets' && /*#__PURE__*/
      _jsxDEV(SecretsTable, {
        secrets: secrets,
        loading: loading,
        onEdit: (secret) => setEditSecret(secret),
        onDelete: (namespace, name) => setDeleteModal({ isOpen: true, type: 'Secret', namespace, name }) }, void 0, false
      ), /*#__PURE__*/



      _jsxDEV(CreateConfigMapModal, {
        isOpen: showCreateConfigMapModal,
        onClose: () => setShowCreateConfigMapModal(false),
        onSuccess: loadData,
        namespaces: namespaces }, void 0, false
      ), /*#__PURE__*/

      _jsxDEV(CreateSecretModal, {
        isOpen: showCreateSecretModal,
        onClose: () => setShowCreateSecretModal(false),
        onSuccess: loadData,
        namespaces: namespaces }, void 0, false
      ), /*#__PURE__*/

      _jsxDEV(EditConfigMapModal, {
        isOpen: !!editConfigMap,
        onClose: () => setEditConfigMap(null),
        onSuccess: loadData,
        configMap: editConfigMap }, void 0, false
      ), /*#__PURE__*/

      _jsxDEV(EditSecretModal, {
        isOpen: !!editSecret,
        onClose: () => setEditSecret(null),
        onSuccess: loadData,
        secret: editSecret }, void 0, false
      ),

      deleteModal && /*#__PURE__*/
      _jsxDEV(DeleteConfirmModal, {
        isOpen: deleteModal.isOpen,
        onClose: () => setDeleteModal(null),
        onConfirm: handleDelete,
        resourceType: deleteModal.type,
        resourceName: `${deleteModal.namespace}/${deleteModal.name}`,
        loading: deleteLoading }, void 0, false
      )] }, void 0, true

    ));

}
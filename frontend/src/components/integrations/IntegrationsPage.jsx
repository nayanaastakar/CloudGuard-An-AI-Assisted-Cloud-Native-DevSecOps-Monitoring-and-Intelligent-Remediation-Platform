import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PuzzlePieceIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  PlusIcon,
  LinkIcon,
  ExclamationTriangleIcon,
  XMarkIcon } from
'@heroicons/react/24/outline';
import GlassCard from '../common/GlassCard';
import { settingsApi, Integration } from '../../services/api';
import { logger } from '../../utils/logger';

// Animation variants
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Integration icons (SVG paths)
const integrationIcons = {
  github: /*#__PURE__*/
  _jsxDEV("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-8 h-8", children: /*#__PURE__*/
    _jsxDEV("path", { d: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" }, void 0, false) }, void 0, false
  ),

  gitlab: /*#__PURE__*/
  _jsxDEV("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-8 h-8", children: /*#__PURE__*/
    _jsxDEV("path", { d: "M23.955 13.587l-1.342-4.135-2.664-8.189a.455.455 0 00-.867 0L16.418 9.45H7.582L4.918 1.263a.455.455 0 00-.867 0L1.386 9.452.044 13.587a.924.924 0 00.331 1.023L12 23.054l11.625-8.443a.92.92 0 00.33-1.024" }, void 0, false) }, void 0, false
  ),

  argocd: /*#__PURE__*/
  _jsxDEV("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-8 h-8", children: [/*#__PURE__*/
    _jsxDEV("circle", { cx: "12", cy: "12", r: "10", fill: "none", stroke: "currentColor", strokeWidth: "2" }, void 0, false), /*#__PURE__*/
    _jsxDEV("path", { d: "M12 6v12M6 12h12", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }, void 0, false)] }, void 0, true
  ),

  helm: /*#__PURE__*/
  _jsxDEV("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-8 h-8", children: /*#__PURE__*/
    _jsxDEV("path", { d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false) }, void 0, false
  ),

  prometheus: /*#__PURE__*/
  _jsxDEV("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-8 h-8", children: /*#__PURE__*/
    _jsxDEV("path", { d: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-4 4h8v2H8V9zm0 3h8v2H8v-2zm2 3h4v2h-4v-2z" }, void 0, false) }, void 0, false
  ),

  grafana: /*#__PURE__*/
  _jsxDEV("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-8 h-8", children: /*#__PURE__*/
    _jsxDEV("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" }, void 0, false) }, void 0, false
  ),

  loki: /*#__PURE__*/
  _jsxDEV("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-8 h-8", children: /*#__PURE__*/
    _jsxDEV("path", { d: "M12 2v20M2 12h20M5.64 5.64l12.72 12.72M18.36 5.64L5.64 18.36", stroke: "currentColor", strokeWidth: "2", fill: "none", strokeLinecap: "round" }, void 0, false) }, void 0, false
  ),

  slack: /*#__PURE__*/
  _jsxDEV("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-8 h-8", children: /*#__PURE__*/
    _jsxDEV("path", { d: "M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z" }, void 0, false) }, void 0, false
  ),

  aws: /*#__PURE__*/
  _jsxDEV("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-8 h-8", children: /*#__PURE__*/
    _jsxDEV("path", { d: "M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 01-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 01-.287-.375 6.18 6.18 0 01-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.296.072-.583.16-.863.279a2.06 2.06 0 01-.248.088.39.39 0 01-.127.024c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 01.224-.167 4.648 4.648 0 011.046-.368 5.37 5.37 0 011.214-.143c.926 0 1.604.21 2.04.636.428.415.647 1.046.647 1.891v2.49h.001z" }, void 0, false) }, void 0, false
  ),

  gcp: /*#__PURE__*/
  _jsxDEV("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-8 h-8", children: /*#__PURE__*/
    _jsxDEV("path", { d: "M12.19 2.38a9.344 9.344 0 00-9.234 6.893c.053-.02-.055.013 0 0-3.875 2.551-3.922 8.11-.247 10.941l.006-.007-.007.03a6.717 6.717 0 004.077 1.356h5.173l.03.03h5.192c6.687.053 9.376-8.605 3.835-12.35a9.37 9.37 0 00-8.824-6.893z" }, void 0, false) }, void 0, false
  ),

  azure: /*#__PURE__*/
  _jsxDEV("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-8 h-8", children: /*#__PURE__*/
    _jsxDEV("path", { d: "M5.483 21.3H24L14.025 4.013l-3.038 8.347 5.836 6.938L5.483 21.3zM13.23 2.7L6.105 8.677 0 19.253h5.505l7.725-16.553z" }, void 0, false) }, void 0, false
  ),

  jenkins: /*#__PURE__*/
  _jsxDEV("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-8 h-8", children: /*#__PURE__*/
    _jsxDEV("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" }, void 0, false) }, void 0, false
  )

};

// Category labels
const categoryLabels = {
  'source-control': 'Source Control',
  'ci-cd': 'CI/CD',
  monitoring: 'Monitoring',
  logging: 'Logging',
  cloud: 'Cloud Providers',
  notification: 'Notifications'
};

// Category colors
const categoryColors = {
  'source-control': 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10',
  'ci-cd': 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10',
  monitoring: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10',
  logging: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10',
  cloud: 'text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/10',
  notification: 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-500/10'
};

// Helper to format relative time
function formatRelativeTime(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hr ago`;
  return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
}

// Integration Card Component
function IntegrationCard({
  integration,
  onConfigure,
  onConnect,
  index





}) {
  const statusConfig = {
    connected: { icon: CheckCircleIcon, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/10' },
    disconnected: { icon: XCircleIcon, color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-slate-700' },
    error: { icon: ExclamationTriangleIcon, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-500/10' }
  };

  const status = statusConfig[integration.status];
  const StatusIcon = status.icon;
  const lastSync = formatRelativeTime(integration.last_sync);

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.05 }, children: /*#__PURE__*/

      _jsxDEV(GlassCard, { className: "p-4 h-full hover:shadow-lg transition-all duration-300", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-start justify-between mb-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: `p-3 rounded-xl ${categoryColors[integration.category]}`, children:
            integrationIcons[integration.icon || ''] || /*#__PURE__*/_jsxDEV(PuzzlePieceIcon, { className: "w-8 h-8" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: `flex items-center gap-1.5 px-2 py-1 rounded-full ${status.bg}`, children: [/*#__PURE__*/
            _jsxDEV(StatusIcon, { className: `h-3.5 w-3.5 ${status.color}` }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: `text-xs font-medium ${status.color}`, children:
              integration.status === 'connected' ? 'Connected' : integration.status === 'error' ? 'Error' : 'Not Connected' }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-1", children: integration.name }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mb-3", children: integration.description }, void 0, false), /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center justify-between", children: [
          lastSync && /*#__PURE__*/
          _jsxDEV("span", { className: "text-[10px] text-gray-400", children: ["Last sync: ", lastSync] }, void 0, true), /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-2 ml-auto", children:
            integration.status === 'connected' ? /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              onClick: onConfigure,
              className: "flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors", children: [/*#__PURE__*/

              _jsxDEV(Cog6ToothIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Configure"] }, void 0, true

            ) : /*#__PURE__*/

            _jsxDEV(motion.button, {
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              onClick: onConnect,
              className: "flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md transition-all", children: [/*#__PURE__*/

              _jsxDEV(LinkIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Connect"] }, void 0, true

            ) }, void 0, false

          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Configuration Modal Component
function ConfigurationModal({
  integration,
  onClose,
  onSave,
  onDisconnect





}) {
  const [endpoint, setEndpoint] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [autoSync, setAutoSync] = useState(integration.auto_sync);
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ endpoint, api_token: apiToken || undefined, auto_sync: autoSync });
      onClose();
    } catch (err) {
      logger.error('Failed to save configuration', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await onDisconnect();
      onClose();
    } catch (err) {
      logger.error('Failed to disconnect integration', err);
    } finally {
      setDisconnecting(false);
    }
  };

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: onClose }, void 0, false), /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.95, opacity: 0 },
        className: "relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center justify-between p-5 border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: `p-2 rounded-xl ${categoryColors[integration.category]}`, children:
              integrationIcons[integration.icon || ''] || /*#__PURE__*/_jsxDEV(PuzzlePieceIcon, { className: "w-6 h-6" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: integration.name }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-500", children: "Configuration" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: onClose,
            className: "p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400", children: /*#__PURE__*/

            _jsxDEV(XMarkIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "p-5 space-y-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block", children: "API Endpoint" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: endpoint,
              onChange: (e) => setEndpoint(e.target.value),
              placeholder: "https://api.example.com",
              className: "w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block", children: "API Token" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "password",
              value: apiToken,
              onChange: (e) => setApiToken(e.target.value),
              placeholder: "Enter API token (optional)",
              className: "w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("input", {
              type: "checkbox",
              id: "autoSync",
              className: "rounded",
              checked: autoSync,
              onChange: (e) => setAutoSync(e.target.checked) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("label", { htmlFor: "autoSync", className: "text-sm text-gray-700 dark:text-gray-300", children: "Enable auto-sync" }, void 0, false)] }, void 0, true
          ),
          integration.last_error && /*#__PURE__*/
          _jsxDEV("div", { className: "p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs", children: [/*#__PURE__*/
            _jsxDEV("strong", { children: "Last Error:" }, void 0, false), " ", integration.last_error] }, void 0, true
          )] }, void 0, true

        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center justify-between p-5 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 rounded-b-2xl", children: [/*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: handleDisconnect,
            disabled: disconnecting,
            className: "px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl disabled:opacity-50", children:

            disconnecting ? 'Disconnecting...' : 'Disconnect' }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: onClose,
              className: "px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl", children:
              "Cancel" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: handleSave,
              disabled: saving || !endpoint,
              className: "px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 disabled:opacity-50", children:

              saving ? 'Saving...' : 'Save Changes' }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      )] }, void 0, true
    ));

}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [configuring, setConfiguring] = useState(null);

  // Fetch integrations from API
  const fetchIntegrations = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const response = await settingsApi.listIntegrations();
      setIntegrations(response.data);
      setError(null);
    } catch (err) {
      logger.error('Failed to fetch integrations', err);
      setError(err.response?.data?.detail || 'Failed to load integrations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  // Handle connect integration
  const handleConnect = async (integration, data) => {
    await settingsApi.connectIntegration(integration.id, {
      endpoint: data.endpoint,
      api_token: data.api_token
    });
    await settingsApi.updateIntegration(integration.id, { auto_sync: data.auto_sync });
    await fetchIntegrations();
  };

  // Handle disconnect integration
  const handleDisconnect = async (integration) => {
    await settingsApi.disconnectIntegration(integration.id);
    await fetchIntegrations();
  };

  // Filter integrations
  const filteredIntegrations = selectedCategory === 'all' ?
  integrations :
  integrations.filter((i) => i.category === selectedCategory);

  // Get unique categories
  const categories = Array.from(new Set(integrations.map((i) => i.category)));

  // Stats
  const connectedCount = integrations.filter((i) => i.status === 'connected').length;
  const errorCount = integrations.filter((i) => i.status === 'error').length;

  if (loading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center h-64", children: /*#__PURE__*/
        _jsxDEV("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" }, void 0, false) }, void 0, false
      ));

  }

  if (error) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex flex-col items-center justify-center h-64 text-center", children: [/*#__PURE__*/
        _jsxDEV(ExclamationTriangleIcon, { className: "h-12 w-12 text-red-500 mb-4" }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: error }, void 0, false), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: () => fetchIntegrations(),
          className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600", children:
          "Retry" }, void 0, false

        )] }, void 0, true
      ));

  }

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      variants: containerVariants,
      initial: "hidden",
      animate: "visible",
      className: "space-y-6", children: [/*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600", children: /*#__PURE__*/
              _jsxDEV(PuzzlePieceIcon, { className: "h-6 w-6 text-white" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h1", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: "Integrations" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
                connectedCount, " connected ", errorCount > 0 && /*#__PURE__*/_jsxDEV("span", { className: "text-red-500", children: ["| ", errorCount, " with errors"] }, void 0, true)] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: () => fetchIntegrations(true),
              disabled: refreshing,
              className: "flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-sm font-medium", children: [/*#__PURE__*/

              _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${refreshing ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              className: "flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25", children: [/*#__PURE__*/

              _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "Add Integration"] }, void 0, true

            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2 flex-wrap", children: [/*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => setSelectedCategory('all'),
            className: `px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedCategory === 'all' ?
            'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400' :
            'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`, children: [

            "All (",
            integrations.length, ")"] }, void 0, true
          ),
          categories.map((category) => /*#__PURE__*/
          _jsxDEV(motion.button, {

            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => setSelectedCategory(category),
            className: `px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedCategory === category ?
            categoryColors[category] :
            'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`, children: [


            categoryLabels[category], " (", integrations.filter((i) => i.category === category).length, ")"] }, category, true
          )
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children:
          filteredIntegrations.map((integration, index) => /*#__PURE__*/
          _jsxDEV(IntegrationCard, {

            integration: integration,
            onConfigure: () => setConfiguring(integration),
            onConnect: () => setConfiguring(integration),
            index: index }, integration.id, false
          )
          ) }, void 0, false
        ) }, void 0, false
      ),

      filteredIntegrations.length === 0 && /*#__PURE__*/
      _jsxDEV("div", { className: "text-center py-12 text-gray-500 dark:text-gray-400", children: "No integrations found in this category." }, void 0, false

      ), /*#__PURE__*/



      _jsxDEV(AnimatePresence, { children:
        configuring && /*#__PURE__*/
        _jsxDEV(ConfigurationModal, {
          integration: configuring,
          onClose: () => setConfiguring(null),
          onSave: (data) => handleConnect(configuring, data),
          onDisconnect: () => handleDisconnect(configuring) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}
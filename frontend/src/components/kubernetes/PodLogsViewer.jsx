import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  ArrowPathIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  SignalSlashIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BellAlertIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  CommandLineIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  PauseIcon } from
'@heroicons/react/24/outline';
import { kubernetesApi } from '../../services/api';
import { logger } from '../../utils/logger';
import { useWebSocketLogs } from '../../hooks/useWebSocketLogs';


// Import shared constants

// Pod status type
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";

// Status configurations for non-running pods
const NON_RUNNING_STATUS_INFO = {
  Pending: {
    icon: ClockIcon,
    color: 'text-amber-500',
    gradient: 'from-amber-500 to-yellow-600',
    title: 'Pod is Pending',
    message: 'The pod is waiting to be scheduled or containers are being created. Logs will be available once the container starts running.'
  },
  Running: {
    icon: CheckCircleIcon,
    color: 'text-emerald-500',
    gradient: 'from-emerald-500 to-green-600',
    title: 'Pod is Running',
    message: 'The pod is running normally.'
  },
  Succeeded: {
    icon: CheckCircleIcon,
    color: 'text-blue-500',
    gradient: 'from-blue-500 to-indigo-600',
    title: 'Pod Completed',
    message: 'The pod has completed successfully. View the logs from when it was running.'
  },
  Failed: {
    icon: XCircleIcon,
    color: 'text-red-500',
    gradient: 'from-red-500 to-rose-600',
    title: 'Pod Failed',
    message: 'The pod has failed. Try viewing "Previous" logs to see the error output. Check pod events for more details.'
  },
  Unknown: {
    icon: InformationCircleIcon,
    color: 'text-gray-500',
    gradient: 'from-gray-500 to-slate-600',
    title: 'Unknown Status',
    message: 'The pod status is unknown. Logs may not be available.'
  }
};







// Check if pod can have logs
function canHaveLogs(status) {
  return status === 'Running' || status === 'Succeeded' || status === 'Failed';
}

// Get status info for non-running pods
function getStatusInfo(status) {
  return NON_RUNNING_STATUS_INFO[status];
}

export default function PodLogsViewer({ pod, onClose, defaultExpanded = false }) {
  const [logs, setLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContainer, setSelectedContainer] = useState(pod.containers[0] || '');
  const [tailLines, setTailLines] = useState(100);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [showPrevious, setShowPrevious] = useState(false);
  const [streamingMode, setStreamingMode] = useState(false);
  const [tryFetchAnyway, setTryFetchAnyway] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const logsEndRef = useRef(null);

  // Check if logs can be fetched based on pod status
  const podCanHaveLogs = canHaveLogs(pod.status);
  const statusInfo = getStatusInfo(pod.status);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // WebSocket streaming hook
  const {
    logs: wsLogs,
    connected: wsConnected,
    error: wsError,
    status: wsStatus,
    clearLogs: clearWsLogs
  } = useWebSocketLogs({
    namespace: pod.namespace,
    podName: pod.name,
    container: selectedContainer,
    tailLines,
    timestamps: showTimestamps,
    enabled: streamingMode
  });

  useEffect(() => {
    if (!streamingMode && (podCanHaveLogs || tryFetchAnyway)) {
      fetchLogs();
    } else if (!podCanHaveLogs && !tryFetchAnyway) {
      setLoading(false);
    }
  }, [selectedContainer, tailLines, showTimestamps, showPrevious, streamingMode, podCanHaveLogs, tryFetchAnyway]);

  useEffect(() => {
    let interval;
    if (autoRefresh && !streamingMode) {
      interval = setInterval(fetchLogs, 5000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, selectedContainer, tailLines, streamingMode]);

  // Auto-scroll when new logs arrive in streaming mode
  useEffect(() => {
    if (streamingMode && wsLogs.length > 0) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [wsLogs.length, streamingMode]);

  // Fetch pod events (useful for debugging pending/failed pods)
  useEffect(() => {
    async function fetchEvents() {
      setEventsLoading(true);
      try {
        const response = await kubernetesApi.getPodEvents(pod.namespace, pod.name);
        setEvents(response.data);
      } catch (err) {
        logger.error('Failed to fetch pod events', err);
      } finally {
        setEventsLoading(false);
      }
    }
    fetchEvents();
  }, [pod.namespace, pod.name]);

  async function fetchLogs() {
    setLoading(true);
    setError(null);
    try {
      const response = await kubernetesApi.getPodLogs(pod.namespace, pod.name, {
        container: selectedContainer || undefined,
        tailLines,
        timestamps: showTimestamps,
        previous: showPrevious
      });
      setLogs(response.data);
    } catch (err) {
      let errorMessage = 'Failed to fetch logs';
      if (err && typeof err === 'object') {
        const axiosErr = err;
        if (axiosErr.response?.data?.detail) {
          errorMessage = axiosErr.response.data.detail;
        } else if (axiosErr.message) {
          errorMessage = axiosErr.message;
        }
      }
      setError(errorMessage);
      logger.error('Failed to fetch logs', err);
    } finally {
      setLoading(false);
    }
  }

  function scrollToBottom() {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function downloadLogs() {
    const logsContent = streamingMode ? wsLogs.join('\n') : logs?.logs || '';
    if (!logsContent) return;
    const blob = new Blob([logsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pod.namespace}-${pod.name}-${selectedContainer}.log`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function getFilteredLogs() {
    if (streamingMode) {
      const logsText = wsLogs.join('\n');
      if (!searchTerm) return logsText;
      return wsLogs.
      filter((line) => line.toLowerCase().includes(searchTerm.toLowerCase())).
      join('\n');
    }
    if (!logs || !searchTerm) return logs?.logs || '';
    return logs.logs.
    split('\n').
    filter((line) => line.toLowerCase().includes(searchTerm.toLowerCase())).
    join('\n');
  }

  function highlightSearch(text) {
    // Escape HTML entities to prevent XSS
    const escapeHtml = (str) =>
    str.replace(/&/g, '&amp;').
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;').
    replace(/"/g, '&quot;').
    replace(/'/g, '&#039;');

    const escapedText = escapeHtml(text);
    if (!searchTerm) return escapedText;

    // Escape regex special characters in search term
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const safeSearchTerm = escapeRegex(escapeHtml(searchTerm));

    const regex = new RegExp(`(${safeSearchTerm})`, 'gi');
    return escapedText.replace(regex, '<mark class="bg-yellow-300 text-yellow-900 rounded px-0.5">$1</mark>');
  }

  function handleStreamingModeChange(enabled) {
    setStreamingMode(enabled);
    if (enabled) {
      setAutoRefresh(false);
      clearWsLogs();
    }
  }

  const filteredLogs = getFilteredLogs();
  const currentError = streamingMode ? wsError : error;
  const isLoading = streamingMode ? !wsConnected && wsStatus === 'connecting' : loading && !logs;

  const getStatusBadgeConfig = (status) => {
    const config = {
      Running: {
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-500/30'
      },
      Pending: {
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-500/30'
      },
      Succeeded: {
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-500/30'
      },
      Failed: {
        bg: 'bg-red-50 dark:bg-red-500/10',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-200 dark:border-red-500/30'
      },
      Unknown: {
        bg: 'bg-gray-50 dark:bg-gray-500/10',
        text: 'text-gray-700 dark:text-gray-400',
        border: 'border-gray-200 dark:border-gray-500/30'
      }
    };
    return config[status] || config.Unknown;
  };

  const statusBadgeConfig = getStatusBadgeConfig(pod.status);

  // Use React Portal to render panel at document.body level
  // Non-blocking slide-in panel from the right, positioned below main header
  return /*#__PURE__*/createPortal(/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      transition: { type: 'spring', damping: 25, stiffness: 200 },
      className: `fixed top-16 right-0 bottom-0 z-[9999] flex flex-col backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 shadow-2xl border-l border-white/20 dark:border-slate-700/50 ${
      isExpanded ? 'w-full left-0' : 'w-[55%] min-w-[600px]'}`, children: [/*#__PURE__*/



      _jsxDEV("div", { className: "flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700/50 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25", children: /*#__PURE__*/
            _jsxDEV(CommandLineIcon, { className: "h-5 w-5 text-white" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
              _jsxDEV("h2", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "Pod Logs" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadgeConfig.bg} ${statusBadgeConfig.text} ${statusBadgeConfig.border}`, children: [
                pod.status === 'Running' && /*#__PURE__*/_jsxDEV(CheckCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false),
                pod.status === 'Pending' && /*#__PURE__*/_jsxDEV(ClockIcon, { className: "h-3.5 w-3.5" }, void 0, false),
                pod.status === 'Failed' && /*#__PURE__*/_jsxDEV(XCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false),
                pod.status] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-mono", children: [
              pod.namespace, "/", pod.name] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/

          _jsxDEV(AnimatePresence, { children:
            streamingMode && /*#__PURE__*/
            _jsxDEV(motion.div, {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.9 },
              className: `flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
              wsConnected ?
              'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30' :
              wsStatus === 'connecting' ?
              'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30' :
              'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30'}`, children:


              wsConnected ? /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV("span", { className: "relative flex h-2 w-2", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500" }, void 0, false)] }, void 0, true
                ), "Live"] }, void 0, true

              ) :
              wsStatus === 'connecting' ? /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Connecting..."] }, void 0, true

              ) : /*#__PURE__*/

              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(SignalSlashIcon, { className: "h-4 w-4" }, void 0, false), "Disconnected"] }, void 0, true

              ) }, void 0, false

            ) }, void 0, false

          ), /*#__PURE__*/

          _jsxDEV(motion.button, {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            onClick: () => setIsExpanded(!isExpanded),
            className: "p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors",
            title: isExpanded ? 'Collapse panel' : 'Expand to full screen', children:

            isExpanded ? /*#__PURE__*/
            _jsxDEV(ArrowsPointingInIcon, { className: "h-5 w-5 text-gray-500 dark:text-gray-400" }, void 0, false) : /*#__PURE__*/

            _jsxDEV(ArrowsPointingOutIcon, { className: "h-5 w-5 text-gray-500 dark:text-gray-400" }, void 0, false) }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            onClick: onClose,
            className: "p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors", children: /*#__PURE__*/

            _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500 dark:text-gray-400" }, void 0, false) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex flex-wrap items-center gap-4 p-4 border-b border-gray-100 dark:border-slate-700/50 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV("label", { className: "text-sm font-medium text-gray-600 dark:text-gray-300", children: "Container:" }, void 0, false), /*#__PURE__*/
          _jsxDEV("select", {
            value: selectedContainer,
            onChange: (e) => setSelectedContainer(e.target.value),
            className: "px-3 py-2 bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all backdrop-blur-sm", children:

            pod.containers.map((c) => /*#__PURE__*/
            _jsxDEV("option", { value: c, children:
              c }, c, false
            )
            ) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV("label", { className: "text-sm font-medium text-gray-600 dark:text-gray-300", children: "Lines:" }, void 0, false), /*#__PURE__*/
          _jsxDEV("select", {
            value: tailLines,
            onChange: (e) => setTailLines(Number(e.target.value)),
            className: "px-3 py-2 bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all backdrop-blur-sm",
            disabled: streamingMode, children: [/*#__PURE__*/

            _jsxDEV("option", { value: 50, children: "50" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: 100, children: "100" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: 500, children: "500" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: 1000, children: "1000" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: 5000, children: "5000" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "flex items-center gap-2 flex-1 min-w-[200px]", children: [/*#__PURE__*/
          _jsxDEV(MagnifyingGlassIcon, { className: "h-5 w-5 text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("input", {
            type: "text",
            placeholder: "Search logs...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "flex-1 px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all backdrop-blur-sm" }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("label", { className: "flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer", children: [/*#__PURE__*/
          _jsxDEV("input", {
            type: "checkbox",
            checked: showTimestamps,
            onChange: (e) => setShowTimestamps(e.target.checked),
            className: "rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500",
            disabled: streamingMode }, void 0, false
          ), "Timestamps"] }, void 0, true

        ), /*#__PURE__*/

        _jsxDEV("label", { className: "flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer", children: [/*#__PURE__*/
          _jsxDEV("input", {
            type: "checkbox",
            checked: showPrevious,
            onChange: (e) => setShowPrevious(e.target.checked),
            className: "rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500",
            disabled: streamingMode }, void 0, false
          ), "Previous"] }, void 0, true

        ), /*#__PURE__*/


        _jsxDEV(motion.button, {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          onClick: () => handleStreamingModeChange(!streamingMode),
          className: `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          streamingMode ?
          'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25' :
          'bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-slate-700/80'}`, children:


          streamingMode ? /*#__PURE__*/
          _jsxDEV(_Fragment, { children: [/*#__PURE__*/
            _jsxDEV(PauseIcon, { className: "h-4 w-4" }, void 0, false), "Stop Stream"] }, void 0, true

          ) : /*#__PURE__*/

          _jsxDEV(_Fragment, { children: [/*#__PURE__*/
            _jsxDEV(PlayIcon, { className: "h-4 w-4" }, void 0, false), "Real-time"] }, void 0, true

          ) }, void 0, false

        ),


        !streamingMode && /*#__PURE__*/
        _jsxDEV("label", { className: "flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer", children: [/*#__PURE__*/
          _jsxDEV("input", {
            type: "checkbox",
            checked: autoRefresh,
            onChange: (e) => setAutoRefresh(e.target.checked),
            className: "rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500" }, void 0, false
          ), "Auto-refresh"] }, void 0, true

        ),



        !streamingMode && /*#__PURE__*/
        _jsxDEV(motion.button, {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          onClick: fetchLogs,
          disabled: loading,
          className: "flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all backdrop-blur-sm disabled:opacity-50", children: [/*#__PURE__*/

          _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${loading ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

        ),


        streamingMode && /*#__PURE__*/
        _jsxDEV(motion.button, {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          onClick: clearWsLogs,
          className: "flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all backdrop-blur-sm", children:
          "Clear" }, void 0, false

        ), /*#__PURE__*/


        _jsxDEV(motion.button, {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          onClick: downloadLogs,
          disabled: streamingMode ? wsLogs.length === 0 : !logs,
          className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50", children: [/*#__PURE__*/

          _jsxDEV(ArrowDownTrayIcon, { className: "h-4 w-4" }, void 0, false), "Download"] }, void 0, true

        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex-1 overflow-auto bg-gradient-to-b from-slate-900 to-slate-950", children: [

        !podCanHaveLogs && !tryFetchAnyway && !loading ? /*#__PURE__*/
        _jsxDEV("div", { className: "h-full overflow-auto p-6", children: /*#__PURE__*/
          _jsxDEV("div", { className: "max-w-2xl mx-auto py-8", children: [/*#__PURE__*/

            _jsxDEV(motion.div, {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              className: "text-center mb-8", children: [/*#__PURE__*/

              _jsxDEV("div", { className: `inline-flex p-4 rounded-2xl bg-gradient-to-br ${statusInfo.gradient} shadow-lg mb-4`, children: /*#__PURE__*/
                _jsxDEV(statusInfo.icon, { className: "h-10 w-10 text-white" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("h3", { className: "text-xl font-bold text-gray-100 mb-2", children: statusInfo.title }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-gray-400 text-sm max-w-md mx-auto", children: statusInfo.message }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-center gap-2 mt-4", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 text-sm", children: "Current Status:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${statusBadgeConfig.bg} ${statusBadgeConfig.text} ${statusBadgeConfig.border}`, children:
                  pod.status }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV(motion.div, {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.1 },
              className: "backdrop-blur-xl bg-slate-800/50 rounded-2xl border border-slate-700/50 p-5 mb-6", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl", children: /*#__PURE__*/
                  _jsxDEV(BellAlertIcon, { className: "h-4 w-4 text-white" }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("h4", { className: "text-sm font-semibold text-gray-200", children: "Pod Events" }, void 0, false),
                eventsLoading && /*#__PURE__*/
                _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 text-gray-400 animate-spin ml-2" }, void 0, false)] }, void 0, true

              ),
              events.length > 0 ? /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-2 max-h-64 overflow-y-auto", children:
                events.map((event, idx) => /*#__PURE__*/
                _jsxDEV(motion.div, {

                  initial: { opacity: 0, x: -10 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: idx * 0.05 },
                  className: `p-3 rounded-xl text-sm border ${
                  event.type === 'Warning' ?
                  'bg-amber-500/10 border-amber-500/30' :
                  'bg-slate-700/50 border-slate-600/50'}`, children: [/*#__PURE__*/


                  _jsxDEV("div", { className: "flex items-start justify-between gap-2 mb-1", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: `font-semibold ${
                      event.type === 'Warning' ? 'text-amber-400' : 'text-blue-400'}`, children:

                      event.reason }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-xs text-gray-500 whitespace-nowrap", children: [
                      event.count > 1 && `(${event.count}x) `,
                      event.last_timestamp && new Date(event.last_timestamp).toLocaleTimeString()] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-gray-300 text-xs", children: event.message }, void 0, false)] }, idx, true
                )
                ) }, void 0, false
              ) :
              eventsLoading ? /*#__PURE__*/
              _jsxDEV("p", { className: "text-gray-500 text-sm", children: "Loading events..." }, void 0, false) : /*#__PURE__*/

              _jsxDEV("p", { className: "text-gray-500 text-sm", children: "No events found for this pod." }, void 0, false)] }, void 0, true

            ), /*#__PURE__*/


            _jsxDEV(motion.div, {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.2 },
              className: "text-center space-y-4", children: [

              pod.status === 'Failed' && /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-blue-400", children: "Tip: Enable \"Previous\" checkbox to view logs from the container before it failed." }, void 0, false

              ), /*#__PURE__*/

              _jsxDEV(motion.button, {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                onClick: () => setTryFetchAnyway(true),
                className: "px-5 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white rounded-xl text-sm font-medium transition-all shadow-lg", children:
                "Try Fetching Logs Anyway" }, void 0, false

              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ) :
        isLoading ? /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-center h-full", children: /*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: "flex flex-col items-center gap-4", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "w-12 h-12 border-4 border-blue-800 rounded-full" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-400 font-medium", children:
              streamingMode ? 'Connecting to log stream...' : 'Loading logs...' }, void 0, false
            )] }, void 0, true
          ) }, void 0, false
        ) :
        currentError ? /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-center h-full", children: /*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: "text-center max-w-md p-6", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "inline-flex p-4 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/25 mb-4", children: /*#__PURE__*/
              _jsxDEV(ExclamationTriangleIcon, { className: "h-8 w-8 text-white" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-red-400 mb-4 font-medium", children: currentError }, void 0, false),
            !podCanHaveLogs && /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-500 text-sm", children: ["This is expected for pods in \"",
              pod.status, "\" state."] }, void 0, true
            )] }, void 0, true

          ) }, void 0, false
        ) :
        filteredLogs ? /*#__PURE__*/
        _jsxDEV("div", { className: "p-4", children: /*#__PURE__*/
          _jsxDEV("pre", {
            className: "text-sm text-gray-100 font-mono whitespace-pre-wrap break-all leading-relaxed",
            dangerouslySetInnerHTML: { __html: highlightSearch(filteredLogs) } }, void 0, false
          ) }, void 0, false
        ) : /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center justify-center h-full", children: /*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: "text-center", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "inline-flex p-4 rounded-2xl bg-slate-700/50 mb-4", children: /*#__PURE__*/
              _jsxDEV(DocumentTextIcon, { className: "h-8 w-8 text-gray-500" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-500", children: "No logs available" }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/

        _jsxDEV("div", { ref: logsEndRef }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex items-center justify-between p-4 border-t border-gray-100 dark:border-slate-700/50 backdrop-blur-xl bg-white/50 dark:bg-slate-800/50 text-sm", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-4", children: [
          streamingMode ? /*#__PURE__*/
          _jsxDEV("span", { className: "flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "relative flex h-2 w-2", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500" }, void 0, false)] }, void 0, true
            ),
            wsLogs.length, " lines streamed"] }, void 0, true
          ) :

          logs?.truncated && /*#__PURE__*/
          _jsxDEV("span", { className: "text-amber-600 dark:text-amber-400 font-medium", children: ["Logs truncated - showing last ",
            tailLines, " lines"] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1", children: [/*#__PURE__*/
            _jsxDEV("kbd", { className: "px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-xs", children: "Esc" }, void 0, false), "to close"] }, void 0, true

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV(motion.button, {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          onClick: scrollToBottom,
          className: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors", children:
          "Scroll to bottom" }, void 0, false

        )] }, void 0, true
      )] }, void 0, true
    ),
    document.body
  );
}
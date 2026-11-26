import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import 'xterm/css/xterm.css';
import {
  DocumentDuplicateIcon,
  ServerStackIcon,
  CpuChipIcon,
  ClockIcon,
  CalendarIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ArrowPathIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  StopIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ScaleIcon,
  TrashIcon,
  FunnelIcon,
  ChevronUpDownIcon,
  CodeBracketIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowUturnLeftIcon,
  CommandLineIcon,
  SignalIcon,
  SignalSlashIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon } from
'@heroicons/react/24/outline';
import { kubernetesApi } from '../../services/api';
import {
  useDeployments,
  usePods,
  useStatefulSets,
  useDaemonSets,
  useJobs,
  useCronJobs,
  useServices,
  useIngresses,
  useConfigMaps,
  useSecrets,
  usePVCs,
  useHPAs,
  useNamespaces,
  useInvalidateWorkloads } from
'../../hooks/useWorkloadsData';
import { useToast } from '../../contexts/ToastContext';
import { useNamespace } from '../../contexts/NamespaceContext';
import { logger } from '../../utils/logger';
import PageHeader from '../common/PageHeader';
import PodLogsViewer from './PodLogsViewer';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";









// Import shared constants

// Table row animation variant (extends shared patterns)
const tableRowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03 }
  })
};

// ==================== REUSABLE MODAL COMPONENTS ====================

// Reusable Scale Modal Component with React Portal











function ScaleModal({ isOpen, onClose, resourceName, resourceType, namespace, currentReplicas, onScale, isLoading }) {
  const [replicas, setReplicas] = useState(currentReplicas);

  useEffect(() => {
    setReplicas(currentReplicas);
  }, [currentReplicas, isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return /*#__PURE__*/createPortal(/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm",
      onClick: onClose, children: /*#__PURE__*/

      _jsxDEV(motion.div, {
        initial: { scale: 0.9, opacity: 0, y: 20 },
        animate: { scale: 1, opacity: 1, y: 0 },
        exit: { scale: 0.9, opacity: 0, y: 20 },
        transition: { type: 'spring', damping: 25, stiffness: 300 },
        onClick: (e) => e.stopPropagation(),
        className: "bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-3 mb-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30", children: /*#__PURE__*/
            _jsxDEV(ScaleIcon, { className: "h-6 w-6 text-primary-600 dark:text-primary-400" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: ["Scale ",
              resourceType] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
              resourceName, " in ", namespace] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "mb-6", children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3", children: "Number of Replicas" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-center gap-4", children: [/*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.1 },
              whileTap: { scale: 0.9 },
              onClick: () => setReplicas(Math.max(0, replicas - 1)),
              className: "p-3 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors", children: /*#__PURE__*/

              _jsxDEV(StopIcon, { className: "h-5 w-5 text-gray-600 dark:text-gray-300" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("input", {
              type: "number",
              min: "0",
              value: replicas,
              onChange: (e) => setReplicas(parseInt(e.target.value) || 0),
              className: "w-24 text-center text-2xl font-bold px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-0 transition-colors" }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.1 },
              whileTap: { scale: 0.9 },
              onClick: () => setReplicas(replicas + 1),
              className: "p-3 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors", children: /*#__PURE__*/

              _jsxDEV(PlayIcon, { className: "h-5 w-5 text-gray-600 dark:text-gray-300" }, void 0, false) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-center text-xs text-gray-500 dark:text-gray-400 mt-2", children: ["Current: ",
            currentReplicas, " → New: ", replicas] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex justify-end gap-3", children: [/*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: onClose,
            className: "px-4 py-2 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors", children:
            "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => onScale(replicas),
            disabled: isLoading || replicas === currentReplicas,
            className: "px-5 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed", children:

            isLoading ? /*#__PURE__*/
            _jsxDEV("span", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Scaling..."] }, void 0, true

            ) :

            'Scale' }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("p", { className: "text-center text-xs text-gray-400 dark:text-gray-500 mt-4", children: "Press Esc to cancel" }, void 0, false

        )] }, void 0, true
      ) }, void 0, false
    ),
    document.body
  );
}

// Rollback Modal Component with version history














function RollbackModal({ isOpen, onClose, deployment, onRollback, isLoading }) {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRevision, setSelectedRevision] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchRevisions();
    }
  }, [isOpen, deployment]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const fetchRevisions = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await kubernetesApi.executeKubectl({
        command: `rollout history deployment ${deployment.name} -n ${deployment.namespace}`
      });

      // Parse the rollout history output
      const lines = result.data.stdout?.split('\n') || [];
      const parsedRevisions = [];

      for (const line of lines) {
        // Match lines like "1         <none>" or "2         kubectl set image..."
        const match = line.match(/^\s*(\d+)\s+(.*)$/);
        if (match) {
          parsedRevisions.push({
            revision: parseInt(match[1], 10),
            changeReason: match[2].trim() || '<none>'
          });
        }
      }

      setRevisions(parsedRevisions.reverse()); // Show newest first
      if (parsedRevisions.length > 1) {
        setSelectedRevision(parsedRevisions[parsedRevisions.length - 2]?.revision); // Select previous revision by default
      }
    } catch (err) {
      setError('Failed to fetch revision history');
      logger.error('Failed to fetch revisions', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return /*#__PURE__*/createPortal(/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm",
      onClick: onClose, children: /*#__PURE__*/

      _jsxDEV(motion.div, {
        initial: { scale: 0.9, opacity: 0, y: 20 },
        animate: { scale: 1, opacity: 1, y: 0 },
        exit: { scale: 0.9, opacity: 0, y: 20 },
        transition: { type: 'spring', damping: 25, stiffness: 300 },
        onClick: (e) => e.stopPropagation(),
        className: "bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4 border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-3 mb-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30", children: /*#__PURE__*/
            _jsxDEV(ArrowUturnLeftIcon, { className: "h-6 w-6 text-purple-600 dark:text-purple-400" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: "Rollback Deployment" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
              deployment.name, " in ", deployment.namespace] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ),

        loading ? /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-center py-8", children: [/*#__PURE__*/
          _jsxDEV(ArrowPathIcon, { className: "h-6 w-6 animate-spin text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "ml-2 text-gray-500", children: "Loading revision history..." }, void 0, false)] }, void 0, true
        ) :
        error ? /*#__PURE__*/
        _jsxDEV("div", { className: "py-4 text-center text-danger-600 dark:text-danger-400", children:
          error }, void 0, false
        ) :
        revisions.length <= 1 ? /*#__PURE__*/
        _jsxDEV("div", { className: "py-4 text-center text-gray-500 dark:text-gray-400", children: "No previous revisions available for rollback" }, void 0, false

        ) : /*#__PURE__*/

        _jsxDEV(_Fragment, { children: [/*#__PURE__*/
          _jsxDEV("div", { className: "mb-4", children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Select Revision to Rollback" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "max-h-64 overflow-y-auto space-y-2 border border-gray-200 dark:border-slate-600 rounded-xl p-2", children:
              revisions.map((rev, idx) => /*#__PURE__*/
              _jsxDEV("button", {

                onClick: () => setSelectedRevision(rev.revision),
                disabled: idx === 0 // Can't rollback to current
                , className: `w-full text-left p-3 rounded-xl transition-all ${
                selectedRevision === rev.revision ?
                'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500' :
                idx === 0 ?
                'bg-gray-50 dark:bg-slate-700/50 opacity-50 cursor-not-allowed' :
                'bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 border-2 border-transparent'}`, children: [/*#__PURE__*/


                _jsxDEV("div", { className: "flex items-center justify-between", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "font-mono text-sm font-semibold text-gray-700 dark:text-gray-300", children: ["Rev ",
                      rev.revision] }, void 0, true
                    ),
                    idx === 0 && /*#__PURE__*/
                    _jsxDEV("span", { className: "px-2 py-0.5 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400", children: "Current" }, void 0, false

                    )] }, void 0, true

                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1 truncate font-mono", children:
                  rev.changeReason }, void 0, false
                )] }, rev.revision, true
              )
              ) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "flex justify-end gap-3", children: [/*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: onClose,
              className: "px-4 py-2 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors", children:
              "Cancel" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: () => selectedRevision && onRollback(selectedRevision),
              disabled: isLoading || !selectedRevision,
              className: "px-5 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed", children:

              isLoading ? /*#__PURE__*/
              _jsxDEV("span", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Rolling back..."] }, void 0, true

              ) :

              `Rollback to Rev ${selectedRevision}` }, void 0, false

            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("p", { className: "text-center text-xs text-gray-400 dark:text-gray-500 mt-4", children: "Press Esc to cancel" }, void 0, false

        )] }, void 0, true
      ) }, void 0, false
    ),
    document.body
  );
}

// Pod Exec Modal Component - Interactive Terminal with xterm.js






function PodExecModal({ isOpen, onClose, pod }) {
  const toast = useToast();
  const [selectedContainer, setSelectedContainer] = useState('');
  const [selectedShell, setSelectedShell] = useState('/bin/sh');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDistroless, setIsDistroless] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [debugImage, setDebugImage] = useState('busybox:latest');

  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const wsRef = useRef(null);
  const shellFailCountRef = useRef(0);

  const shells = ['/bin/bash', '/bin/sh', '/bin/ash', '/bin/zsh'];
  const debugImages = [
  { value: 'busybox:latest', label: 'BusyBox (minimal)' },
  { value: 'alpine:latest', label: 'Alpine (with apk)' },
  { value: 'nicolaka/netshoot:latest', label: 'Netshoot (network debug)' },
  { value: 'ubuntu:latest', label: 'Ubuntu (full)' }];


  // Initialize container selection and reset debug state
  useEffect(() => {
    if (isOpen && pod.containers && pod.containers.length > 0) {
      setSelectedContainer(pod.containers[0]);
      // Reset debug state when modal opens
      setIsDistroless(false);
      setDebugMode(false);
      shellFailCountRef.current = 0;
    }
  }, [isOpen, pod]);

  // Initialize xterm.js terminal
  useEffect(() => {
    if (!isOpen || !terminalRef.current) return;

    // Create terminal instance
    const terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e293b',
        foreground: '#e2e8f0',
        cursor: '#22c55e',
        cursorAccent: '#1e293b',
        selectionBackground: '#334155',
        black: '#1e293b',
        red: '#ef4444',
        green: '#22c55e',
        yellow: '#eab308',
        blue: '#7395AE',
        magenta: '#557A95',
        cyan: '#06b6d4',
        white: '#e2e8f0',
        brightBlack: '#475569',
        brightRed: '#f87171',
        brightGreen: '#4ade80',
        brightYellow: '#facc15',
        brightBlue: '#60a5fa',
        brightMagenta: '#c084fc',
        brightCyan: '#22d3ee',
        brightWhite: '#f8fafc'
      },
      allowTransparency: true,
      scrollback: 10000
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webLinksAddon);

    terminal.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = terminal;
    fitAddonRef.current = fitAddon;

    terminal.writeln('\x1b[1;32m┌──────────────────────────────────────────┐\x1b[0m');
    terminal.writeln('\x1b[1;32m│\x1b[0m  \x1b[1;36mKubeSight Pod Terminal\x1b[0m                   \x1b[1;32m│\x1b[0m');
    terminal.writeln('\x1b[1;32m└──────────────────────────────────────────┘\x1b[0m');
    terminal.writeln('');
    terminal.writeln(`\x1b[90mPod:\x1b[0m ${pod.name}`);
    terminal.writeln(`\x1b[90mNamespace:\x1b[0m ${pod.namespace}`);
    terminal.writeln('');
    terminal.writeln('\x1b[33mConnecting...\x1b[0m');

    // Handle window resize
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
        // Send resize to WebSocket
        if (wsRef.current?.readyState === WebSocket.OPEN && xtermRef.current) {
          wsRef.current.send(JSON.stringify({
            type: 'resize',
            cols: xtermRef.current.cols,
            rows: xtermRef.current.rows
          }));
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      terminal.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
    };
  }, [isOpen, pod.name, pod.namespace]);

  // Track if initial connection was made
  const hasConnectedRef = useRef(false);
  const connectionStatusRef = useRef(connectionStatus);
  connectionStatusRef.current = connectionStatus;

  // Connect WebSocket - stable function that doesn't change
  const connectWebSocket = useCallback(() => {
    if (!xtermRef.current || !selectedContainer) return;

    const terminal = xtermRef.current;

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setConnectionStatus('connecting');

    // Build WebSocket URL - use debug endpoint if debug mode is enabled
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    let wsUrl;

    if (debugMode) {
      wsUrl = `${protocol}//${window.location.host}/api/v1/ws/pods/${pod.namespace}/${pod.name}/debug?container=${selectedContainer}&image=${encodeURIComponent(debugImage)}&target_container=${selectedContainer}`;
      terminal.writeln('');
      terminal.writeln(`\x1b[1;35m🔧 Debug Mode\x1b[0m`);
      terminal.writeln(`\x1b[90mAttaching debug container (${debugImage}) to ${selectedContainer}...\x1b[0m`);
    } else {
      wsUrl = `${protocol}//${window.location.host}/api/v1/ws/pods/${pod.namespace}/${pod.name}/exec?container=${selectedContainer}&shell=${encodeURIComponent(selectedShell)}`;
      terminal.writeln('');
      terminal.writeln(`\x1b[90mConnecting to ${selectedContainer} with ${selectedShell}...\x1b[0m`);
    }

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    let inputHandler = null;
    let outputBuffer = '';

    ws.onopen = () => {
      setConnectionStatus('connected');
      terminal.writeln('\x1b[32m✓ Connected\x1b[0m');
      terminal.writeln('');

      // Send initial resize
      ws.send(JSON.stringify({
        type: 'resize',
        cols: terminal.cols,
        rows: terminal.rows
      }));

      // Handle terminal input only after connection
      inputHandler = terminal.onData((data) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'input', data }));
        }
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'output') {
          terminal.write(data.data);
          outputBuffer += data.data;

          // Detect shell not found errors (distroless container)
          if (!debugMode && (
          outputBuffer.includes('executable file not found') ||
          outputBuffer.includes('OCI runtime exec failed') ||
          outputBuffer.includes('no such file or directory') ||
          outputBuffer.includes('exit code 127')))
          {
            shellFailCountRef.current++;

            // If all shells have failed, this is likely a distroless container
            if (shellFailCountRef.current >= shells.length) {
              setIsDistroless(true);
              terminal.writeln('');
              terminal.writeln('\x1b[1;33m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m');
              terminal.writeln('\x1b[1;33m⚠  Distroless Container Detected\x1b[0m');
              terminal.writeln('\x1b[90m   This container has no shell or standard tools.\x1b[0m');
              terminal.writeln('\x1b[90m   Use the "Debug Container" mode to attach a debug pod.\x1b[0m');
              terminal.writeln('\x1b[1;33m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m');
              terminal.writeln('');
            }
          }
        } else if (data.type === 'status') {
          if (data.status === 'disconnected') {
            terminal.writeln('');
            terminal.writeln('\x1b[33m⚠ Session ended\x1b[0m');
            setConnectionStatus('disconnected');
          }
        } else if (data.type === 'error') {
          terminal.writeln('');
          terminal.writeln(`\x1b[31m✗ Error: ${data.error}\x1b[0m`);
          setConnectionStatus('error');
        }
      } catch {
        // Raw text output
        terminal.write(event.data);
      }
    };

    ws.onerror = () => {
      terminal.writeln('');
      terminal.writeln('\x1b[31m✗ Connection error\x1b[0m');
      setConnectionStatus('error');
    };

    ws.onclose = () => {
      // Only update to disconnected if not already in error state
      setConnectionStatus((prev) => prev === 'error' ? 'error' : 'disconnected');
    };

    return () => {
      if (inputHandler) {
        inputHandler.dispose();
      }
    };
  }, [selectedContainer, selectedShell, debugMode, debugImage, pod.namespace, pod.name, shells.length]);

  // Connect when modal opens and container is selected (only once per open)
  useEffect(() => {
    if (isOpen && selectedContainer && xtermRef.current && !hasConnectedRef.current) {
      hasConnectedRef.current = true;
      connectWebSocket();
    }

    // Reset when modal closes
    if (!isOpen) {
      hasConnectedRef.current = false;
    }
  }, [isOpen, selectedContainer, connectWebSocket]);

  // Reconnect when shell changes (user manually changes)
  const handleShellChange = (shell) => {
    setSelectedShell(shell);
    // Will reconnect in next effect
    setTimeout(() => {
      if (xtermRef.current) {
        connectWebSocket();
      }
    }, 100);
  };

  // Fit terminal when expanded state changes
  useEffect(() => {
    if (fitAddonRef.current) {
      setTimeout(() => {
        fitAddonRef.current?.fit();
      }, 300);
    }
  }, [isExpanded]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleContainerChange = (container) => {
    setSelectedContainer(container);
    // Reconnect with new container
    setTimeout(() => {
      if (xtermRef.current) {
        connectWebSocket();
      }
    }, 100);
  };

  const handleReconnect = () => {
    connectWebSocket();
  };

  const copyExecCommand = () => {
    const containerFlag = selectedContainer ? `-c ${selectedContainer}` : '';
    const cmd = `kubectl exec -it ${pod.name} -n ${pod.namespace} ${containerFlag} -- ${selectedShell}`;
    navigator.clipboard.writeText(cmd);
    toast.success('Command copied', 'Exec command copied to clipboard');
  };

  if (!isOpen) return null;

  return /*#__PURE__*/createPortal(/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      transition: { type: 'spring', damping: 25, stiffness: 200 },
      className: `fixed top-16 right-0 bottom-0 z-[9999] flex flex-col bg-slate-900 shadow-2xl border-l border-slate-700 ${
      isExpanded ? 'w-full left-0' : 'w-[55%] min-w-[600px]'}`, children: [/*#__PURE__*/



      _jsxDEV("div", { className: "flex items-center justify-between p-3 border-b border-slate-700 bg-slate-800", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-2 rounded-xl bg-green-900/30", children: /*#__PURE__*/
            _jsxDEV(CommandLineIcon, { className: "h-5 w-5 text-green-400" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV("h2", { className: "text-sm font-semibold text-gray-100", children: "Terminal" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: `flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                connectionStatus === 'connected' ? 'bg-green-900/50 text-green-400' :
                connectionStatus === 'connecting' ? 'bg-yellow-900/50 text-yellow-400' :
                connectionStatus === 'error' ? 'bg-red-900/50 text-red-400' :
                'bg-gray-700 text-gray-400'}`, children: [

                connectionStatus === 'connected' ? /*#__PURE__*/_jsxDEV(SignalIcon, { className: "h-3 w-3" }, void 0, false) : /*#__PURE__*/_jsxDEV(SignalSlashIcon, { className: "h-3 w-3" }, void 0, false),
                connectionStatus] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-400", children: pod.name }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2", children: [
          connectionStatus !== 'connected' && /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: handleReconnect,
            className: "px-3 py-1.5 text-xs font-medium rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors", children:
            "Reconnect" }, void 0, false

          ), /*#__PURE__*/

          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: copyExecCommand,
            className: "px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-700 text-gray-300 hover:bg-slate-600 transition-colors", children:
            "Copy Command" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => setIsExpanded(!isExpanded),
            className: "p-2 hover:bg-slate-700 rounded-xl",
            title: isExpanded ? 'Collapse' : 'Expand', children:

            isExpanded ? /*#__PURE__*/
            _jsxDEV(ArrowsPointingInIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false) : /*#__PURE__*/

            _jsxDEV(ArrowsPointingOutIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false) }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", { onClick: onClose, className: "p-2 hover:bg-slate-700 rounded-xl", children: /*#__PURE__*/
            _jsxDEV(XMarkIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex items-center gap-4 px-4 py-2 border-b border-slate-700 bg-slate-800/50 flex-wrap", children: [
        pod.containers && pod.containers.length > 1 && /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV("label", { className: "text-xs text-gray-400", children: "Container:" }, void 0, false), /*#__PURE__*/
          _jsxDEV("select", {
            value: selectedContainer,
            onChange: (e) => handleContainerChange(e.target.value),
            className: "px-2 py-1 text-xs rounded border border-slate-600 bg-slate-700 text-gray-100", children:

            pod.containers.map((c) => /*#__PURE__*/
            _jsxDEV("option", { value: c, children: c }, c, false)
            ) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/



        _jsxDEV("div", { className: "flex items-center gap-2", children: /*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => {
              setDebugMode(!debugMode);
              shellFailCountRef.current = 0;
              setIsDistroless(false);
              setTimeout(() => connectWebSocket(), 100);
            },
            className: `flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-xl transition-colors ${
            debugMode ?
            'bg-purple-600 text-white' :
            isDistroless ?
            'bg-yellow-600 text-white animate-pulse' :
            'bg-slate-700 text-gray-300 hover:bg-slate-600'}`, children: [/*#__PURE__*/


            _jsxDEV(WrenchScrewdriverIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Debug Container"] }, void 0, true

          ) }, void 0, false
        ),

        debugMode ? /*#__PURE__*/
        /* Debug Image Selector */
        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV("label", { className: "text-xs text-gray-400", children: "Image:" }, void 0, false), /*#__PURE__*/
          _jsxDEV("select", {
            value: debugImage,
            onChange: (e) => {
              setDebugImage(e.target.value);
              setTimeout(() => connectWebSocket(), 100);
            },
            className: "px-2 py-1 text-xs rounded border border-slate-600 bg-slate-700 text-gray-100", children:

            debugImages.map((img) => /*#__PURE__*/
            _jsxDEV("option", { value: img.value, children: img.label }, img.value, false)
            ) }, void 0, false
          )] }, void 0, true
        ) : /*#__PURE__*/

        /* Shell Selector */
        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV("label", { className: "text-xs text-gray-400", children: "Shell:" }, void 0, false), /*#__PURE__*/
          _jsxDEV("select", {
            value: selectedShell,
            onChange: (e) => handleShellChange(e.target.value),
            className: "px-2 py-1 text-xs rounded border border-slate-600 bg-slate-700 text-gray-100", children:

            shells.map((shell) => /*#__PURE__*/
            _jsxDEV("option", { value: shell, children: shell }, shell, false)
            ) }, void 0, false
          )] }, void 0, true
        ),



        isDistroless && !debugMode && /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-xl bg-yellow-900/50 text-yellow-400", children: [/*#__PURE__*/
          _jsxDEV(ExclamationTriangleIcon, { className: "h-3.5 w-3.5" }, void 0, false), "No shell available"] }, void 0, true

        )] }, void 0, true

      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex-1 p-2 overflow-hidden", children: /*#__PURE__*/
        _jsxDEV("div", {
          ref: terminalRef,
          className: "h-full w-full rounded-xl overflow-hidden",
          style: { backgroundColor: '#1e293b' } }, void 0, false
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "px-4 py-2 border-t border-slate-700 bg-slate-800/50 flex items-center justify-between", children: [/*#__PURE__*/
        _jsxDEV("p", { className: "text-xs text-gray-500", children:
          debugMode ? /*#__PURE__*/
          _jsxDEV(_Fragment, { children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-purple-400", children: "Debug Mode" }, void 0, false), " • Ephemeral container attached with process namespace sharing"] }, void 0, true
          ) : /*#__PURE__*/

          _jsxDEV(_Fragment, { children: "Press Esc to close • Ctrl+C to interrupt" }, void 0, false) }, void 0, false

        ),
        debugMode && /*#__PURE__*/
        _jsxDEV("span", { className: "text-xs text-purple-400 flex items-center gap-1", children: [/*#__PURE__*/
          _jsxDEV(WrenchScrewdriverIcon, { className: "h-3 w-3" }, void 0, false),
          debugImage] }, void 0, true
        )] }, void 0, true

      )] }, void 0, true
    ),
    document.body
  );
}







const workloadTabs = [
{ id: 'deployments', label: 'Deployments', icon: ServerStackIcon },
{ id: 'pods', label: 'Pods', icon: CubeIcon },
{ id: 'statefulsets', label: 'StatefulSets', icon: ServerStackIcon },
{ id: 'daemonsets', label: 'DaemonSets', icon: CpuChipIcon },
{ id: 'jobs', label: 'Jobs', icon: ClockIcon },
{ id: 'cronjobs', label: 'CronJobs', icon: CalendarIcon }];




// Auto-refresh interval options
const autoRefreshOptions = [
{ value: 0, label: 'Off' },
{ value: 15, label: '15s' },
{ value: 30, label: '30s' },
{ value: 60, label: '1m' }];


// Health indicators helper function
function getHealthIndicators(
workloadName,
workloadNamespace,
workloadLabels,
ageStr,
allPods)
{
  // Find pods belonging to this workload by matching labels or name prefix
  const workloadPods = allPods.filter((pod) => {
    if (pod.namespace !== workloadNamespace) return false;
    // Match by common label patterns or name prefix
    return (
      pod.name.startsWith(workloadName) ||
      workloadLabels?.app && pod.labels?.app === workloadLabels.app ||
      workloadLabels?.['app.kubernetes.io/name'] &&
      pod.labels?.['app.kubernetes.io/name'] === workloadLabels['app.kubernetes.io/name']);

  });

  if (workloadPods.length === 0) {
    return {
      maxRestarts: 0,
      hasOOMKilled: false,
      hasImagePullError: false,
      hasCrashLoop: false,
      hasProbeFailure: false,
      isRecent: false
    };
  }

  // Calculate max restarts
  const maxRestarts = Math.max(...workloadPods.map((p) => p.restarts || 0));

  // Check for specific failure indicators
  const hasImagePullError = workloadPods.some((p) => p.status === 'Pending' && !p.ready);
  const hasCrashLoop = workloadPods.some((p) => (p.restarts || 0) > 5);
  const hasProbeFailure = workloadPods.some((p) => p.status === 'Running' && !p.ready);

  // Check if workload is recent (< 10m)
  const isRecent = ageStr.includes('s') || ageStr.includes('m') && parseInt(ageStr) < 10;

  return {
    maxRestarts,
    hasOOMKilled: false,
    hasImagePullError,
    hasCrashLoop,
    hasProbeFailure,
    isRecent
  };
}

export default function KubernetesResourcesView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedNamespace, setSelectedNamespace } = useNamespace();

  // Map URL tab param to category and sub-tab
  const getInitialState = () => {
    const tabParam = searchParams.get('tab');
    const workloadTabs = ['deployments', 'pods', 'statefulsets', 'daemonsets', 'jobs', 'cronjobs'];
    const networkTabs = ['services', 'ingresses'];
    const configTabs = ['configmaps', 'secrets'];

    if (tabParam) {
      if (workloadTabs.includes(tabParam)) {
        return { category: 'workloads', workload: tabParam, network: 'services', config: 'configmaps' };
      }
      if (networkTabs.includes(tabParam)) {
        return { category: 'networking', workload: 'deployments', network: tabParam, config: 'configmaps' };
      }
      if (configTabs.includes(tabParam)) {
        return { category: 'config', workload: 'deployments', network: 'services', config: tabParam };
      }
      if (tabParam === 'storage' || tabParam === 'pvc' || tabParam === 'pvcs') {
        return { category: 'storage', workload: 'deployments', network: 'services', config: 'configmaps' };
      }
      if (tabParam === 'scaling' || tabParam === 'hpa' || tabParam === 'hpas') {
        return { category: 'scaling', workload: 'deployments', network: 'services', config: 'configmaps' };
      }
    }
    return { category: 'workloads', workload: 'deployments', network: 'services', config: 'configmaps' };
  };

  const initialState = getInitialState();
  const [activeCategory, setActiveCategory] = useState(initialState.category);
  const [activeWorkloadTab, setActiveWorkloadTab] = useState(initialState.workload);
  const [activeNetworkTab, setActiveNetworkTab] = useState(initialState.network);
  const [activeConfigTab, setActiveConfigTab] = useState(initialState.config);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(0);
  const autoRefreshTimerRef = useRef(null);

  // Sync URL when tab changes
  const updateUrlTab = useCallback((tab) => {
    setSearchParams({ tab }, { replace: true });
  }, [setSearchParams]);

  // Cache invalidation
  useInvalidateWorkloads();

  // Cached data hooks - only fetch when tab is active (enabled)
  const ns = selectedNamespace || undefined;

  // Namespaces
  const { data: namespaces = [] } = useNamespaces();

  // Workloads - use enabled flag to only fetch active tab
  const { data: deployments = [], isLoading: deploymentsLoading, refetch: refetchDeployments } =
  useDeployments(ns, activeCategory === 'workloads' && activeWorkloadTab === 'deployments');
  // Always fetch pods for health indicators across all workload tabs
  const { data: pods = [], isLoading: podsLoading, refetch: refetchPods } =
  usePods(ns, activeCategory === 'workloads');
  const { data: statefulSets = [], isLoading: statefulSetsLoading, refetch: refetchStatefulSets } =
  useStatefulSets(ns, activeCategory === 'workloads' && activeWorkloadTab === 'statefulsets');
  const { data: daemonSets = [], isLoading: daemonSetsLoading, refetch: refetchDaemonSets } =
  useDaemonSets(ns, activeCategory === 'workloads' && activeWorkloadTab === 'daemonsets');
  const { data: jobs = [], isLoading: jobsLoading, refetch: refetchJobs } =
  useJobs(ns, activeCategory === 'workloads' && activeWorkloadTab === 'jobs');
  const { data: cronJobs = [], isLoading: cronJobsLoading, refetch: refetchCronJobs } =
  useCronJobs(ns, activeCategory === 'workloads' && activeWorkloadTab === 'cronjobs');

  // Networking
  const { isLoading: servicesLoading, refetch: refetchServices } =
  useServices(ns, activeCategory === 'networking' && activeNetworkTab === 'services');
  const { isLoading: ingressesLoading, refetch: refetchIngresses } =
  useIngresses(ns, activeCategory === 'networking' && activeNetworkTab === 'ingresses');

  // Config
  const { isLoading: configMapsLoading, refetch: refetchConfigMaps } =
  useConfigMaps(ns, activeCategory === 'config' && activeConfigTab === 'configmaps');
  const { isLoading: secretsLoading, refetch: refetchSecrets } =
  useSecrets(ns, activeCategory === 'config' && activeConfigTab === 'secrets');

  // Storage
  const { isLoading: pvcsLoading, refetch: refetchPVCs } =
  usePVCs(ns, activeCategory === 'storage');

  // Scaling
  const { isLoading: hpasLoading, refetch: refetchHPAs } =
  useHPAs(ns, activeCategory === 'scaling');

  // Compute loading state based on active tab
  const loading = useMemo(() => {
    if (activeCategory === 'workloads') {
      switch (activeWorkloadTab) {
        case 'deployments':return deploymentsLoading;
        case 'pods':return podsLoading;
        case 'statefulsets':return statefulSetsLoading;
        case 'daemonsets':return daemonSetsLoading;
        case 'jobs':return jobsLoading;
        case 'cronjobs':return cronJobsLoading;
      }
    } else if (activeCategory === 'networking') {
      switch (activeNetworkTab) {
        case 'services':return servicesLoading;
        case 'ingresses':return ingressesLoading;
      }
    } else if (activeCategory === 'config') {
      switch (activeConfigTab) {
        case 'configmaps':return configMapsLoading;
        case 'secrets':return secretsLoading;
      }
    } else if (activeCategory === 'storage') {
      return pvcsLoading;
    } else if (activeCategory === 'scaling') {
      return hpasLoading;
    }
    return false;
  }, [activeCategory, activeWorkloadTab, activeNetworkTab, activeConfigTab,
  deploymentsLoading, podsLoading, statefulSetsLoading, daemonSetsLoading,
  jobsLoading, cronJobsLoading, servicesLoading, ingressesLoading,
  configMapsLoading, secretsLoading, pvcsLoading, hpasLoading]);

  // Sync with URL params when they change (e.g., from sidebar navigation)
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (!tabParam) return;

    const workloadTabsList = ['deployments', 'pods', 'statefulsets', 'daemonsets', 'jobs', 'cronjobs'];
    const networkTabsList = ['services', 'ingresses'];
    const configTabsList = ['configmaps', 'secrets'];

    if (workloadTabsList.includes(tabParam)) {
      setActiveCategory('workloads');
      setActiveWorkloadTab(tabParam);
    } else if (networkTabsList.includes(tabParam)) {
      setActiveCategory('networking');
      setActiveNetworkTab(tabParam);
    } else if (configTabsList.includes(tabParam)) {
      setActiveCategory('config');
      setActiveConfigTab(tabParam);
    } else if (tabParam === 'storage' || tabParam === 'pvc' || tabParam === 'pvcs') {
      setActiveCategory('storage');
    } else if (tabParam === 'scaling' || tabParam === 'hpa' || tabParam === 'hpas') {
      setActiveCategory('scaling');
    }
  }, [searchParams]);

  // Get current resource count based on active category and sub-tab

  // Refetch current tab data
  const fetchResourceData = useCallback(() => {
    if (activeCategory === 'workloads') {
      switch (activeWorkloadTab) {
        case 'deployments':refetchDeployments();break;
        case 'pods':refetchPods();break;
        case 'statefulsets':refetchStatefulSets();break;
        case 'daemonsets':refetchDaemonSets();break;
        case 'jobs':refetchJobs();break;
        case 'cronjobs':refetchCronJobs();break;
      }
    } else if (activeCategory === 'networking') {
      switch (activeNetworkTab) {
        case 'services':refetchServices();break;
        case 'ingresses':refetchIngresses();break;
      }
    } else if (activeCategory === 'config') {
      switch (activeConfigTab) {
        case 'configmaps':refetchConfigMaps();break;
        case 'secrets':refetchSecrets();break;
      }
    } else if (activeCategory === 'storage') {
      refetchPVCs();
    } else if (activeCategory === 'scaling') {
      refetchHPAs();
    }
  }, [activeCategory, activeWorkloadTab, activeNetworkTab, activeConfigTab,
  refetchDeployments, refetchPods, refetchStatefulSets, refetchDaemonSets,
  refetchJobs, refetchCronJobs, refetchServices, refetchIngresses,
  refetchConfigMaps, refetchSecrets, refetchPVCs, refetchHPAs]);

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefreshTimerRef.current) {
      clearInterval(autoRefreshTimerRef.current);
      autoRefreshTimerRef.current = null;
    }

    if (autoRefreshInterval > 0) {
      autoRefreshTimerRef.current = setInterval(() => {
        fetchResourceData();
      }, autoRefreshInterval * 1000);
    }

    return () => {
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
      }
    };
  }, [autoRefreshInterval, selectedNamespace, activeCategory, activeWorkloadTab, activeNetworkTab, activeConfigTab]);

  // Render workload content based on active tab
  function renderContent() {
    if (loading) {
      return /*#__PURE__*/_jsxDEV(TableSkeleton, {}, void 0, false);
    }

    switch (activeWorkloadTab) {
      case 'deployments':
        return /*#__PURE__*/_jsxDEV(DeploymentsTable, { data: deployments, searchQuery: searchQuery, onRefresh: fetchResourceData, pods: pods }, void 0, false);
      case 'pods':
        return /*#__PURE__*/_jsxDEV(PodsTable, { data: pods, searchQuery: searchQuery }, void 0, false);
      case 'statefulsets':
        return /*#__PURE__*/_jsxDEV(StatefulSetsTable, { data: statefulSets, searchQuery: searchQuery, onRefresh: fetchResourceData }, void 0, false);
      case 'daemonsets':
        return /*#__PURE__*/_jsxDEV(DaemonSetsTable, { data: daemonSets, searchQuery: searchQuery }, void 0, false);
      case 'jobs':
        return /*#__PURE__*/_jsxDEV(JobsTable, { data: jobs, searchQuery: searchQuery }, void 0, false);
      case 'cronjobs':
        return /*#__PURE__*/_jsxDEV(CronJobsTable, { data: cronJobs, searchQuery: searchQuery }, void 0, false);
      default:
        return /*#__PURE__*/_jsxDEV(DeploymentsTable, { data: deployments, searchQuery: searchQuery, onRefresh: fetchResourceData, pods: pods }, void 0, false);
    }
  }

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

      _jsxDEV(PageHeader, {
        title: "Workloads",
        description: "Manage deployments, pods, and other workload resources",
        icon: CubeIcon,
        iconColor: "primary",
        onRefresh: fetchResourceData,
        refreshing: loading,
        actions: /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-wrap items-center gap-3", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
            _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              placeholder: "Search resources...",
              className: "pl-10 pr-4 py-2 w-64 border border-gray-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
            _jsxDEV("select", {
              value: selectedNamespace,
              onChange: (e) => setSelectedNamespace(e.target.value),
              className: "appearance-none pl-4 pr-10 py-2 border border-gray-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer", children: [/*#__PURE__*/

              _jsxDEV("option", { value: "", children: "All Namespaces" }, void 0, false),
              namespaces.map((ns) => /*#__PURE__*/
              _jsxDEV("option", { value: ns.name, children:
                ns.name }, ns.name, false
              )
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "absolute inset-y-0 right-3 flex items-center pointer-events-none", children: /*#__PURE__*/
              _jsxDEV(ChevronDownIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600 p-1", children:
            autoRefreshOptions.map((option) => /*#__PURE__*/
            _jsxDEV("button", {

              onClick: () => setAutoRefreshInterval(option.value),
              className: `px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              autoRefreshInterval === option.value ?
              'bg-primary-600 text-white shadow-sm' :
              'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`, children:


              option.label }, option.value, false
            )
            ) }, void 0, false
          ),
          autoRefreshInterval > 0 && /*#__PURE__*/
          _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }, void 0, false), "Auto"] }, void 0, true

          )] }, void 0, true

        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex gap-2 border-b border-gray-200 dark:border-slate-700 pb-4", children:
        workloadTabs.map((tab) => {
          const Icon = tab.icon;
          return (/*#__PURE__*/
            _jsxDEV("button", {

              onClick: () => {
                setActiveWorkloadTab(tab.id);
                updateUrlTab(tab.id);
              },
              className: `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
              activeWorkloadTab === tab.id ?
              'bg-primary-600 text-white shadow-sm' :
              'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200'}`, children: [/*#__PURE__*/


              _jsxDEV(Icon, { className: "h-4 w-4" }, void 0, false),
              tab.label] }, tab.id, true
            ));

        }) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { mode: "wait", children: /*#__PURE__*/
        _jsxDEV(motion.div, {

          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          transition: { duration: 0.2 }, children:

          renderContent() }, activeWorkloadTab, false
        ) }, void 0, false
      )] }, void 0, true
    ));

}

// Table Skeleton Component
function TableSkeleton() {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "animate-pulse", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center gap-4 py-3 px-4 border-b border-gray-100 dark:border-slate-700", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "w-8 h-4 bg-gray-200 dark:bg-slate-600 rounded" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "w-32 h-4 bg-gray-200 dark:bg-slate-600 rounded" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "w-24 h-4 bg-gray-200 dark:bg-slate-600 rounded" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "w-16 h-4 bg-gray-200 dark:bg-slate-600 rounded" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex-1" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "w-20 h-4 bg-gray-200 dark:bg-slate-600 rounded" }, void 0, false)] }, void 0, true
      ),

      [1, 2, 3, 4, 5, 6].map((i) => /*#__PURE__*/
      _jsxDEV(motion.div, {

        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: i * 0.05 },
        className: "flex items-center gap-4 py-4 px-4 border-b border-gray-50 dark:border-slate-700/50", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "w-8 h-8 bg-gray-200 dark:bg-slate-600 rounded-xl" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex-1 space-y-2", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "h-4 bg-gray-200 dark:bg-slate-600 rounded w-1/3" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "h-3 bg-gray-100 dark:bg-slate-700 rounded w-1/4" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "w-16 h-6 bg-gray-200 dark:bg-slate-600 rounded-full" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "w-24 h-4 bg-gray-100 dark:bg-slate-700 rounded" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex gap-2", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "w-8 h-8 bg-gray-200 dark:bg-slate-600 rounded-xl" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "w-8 h-8 bg-gray-200 dark:bg-slate-600 rounded-xl" }, void 0, false)] }, void 0, true
        )] }, i, true
      )
      )] }, void 0, true
    ));

}

// Empty State Component with Enhanced Visuals
function EmptyState({ icon: Icon, title }) {
  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      className: "text-center py-16", children: [/*#__PURE__*/

      _jsxDEV(motion.div, {
        className: "w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center shadow-lg shadow-gray-200/50 dark:shadow-slate-900/50",
        animate: {
          y: [0, -5, 0]
        },
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }, children: /*#__PURE__*/

        _jsxDEV(Icon, { className: "h-10 w-10 text-gray-400 dark:text-gray-500" }, void 0, false) }, void 0, false
      ), /*#__PURE__*/
      _jsxDEV("h3", { className: "text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2", children: title }, void 0, false), /*#__PURE__*/
      _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto", children: "No resources match your current filters. Try adjusting your search or namespace selection." }, void 0, false

      )] }, void 0, true
    ));

}

// Status Filter Component


function StatusFilter({
  options,
  selected,
  onChange




}) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [/*#__PURE__*/
      _jsxDEV(FunnelIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
      _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Filter:" }, void 0, false), /*#__PURE__*/
      _jsxDEV("div", { className: "flex gap-1", children:
        options.map((option) => /*#__PURE__*/
        _jsxDEV("button", {

          onClick: () => onChange(option.value),
          className: `px-3 py-1 text-xs font-medium rounded-xl transition-all ${
          selected === option.value ?
          `${option.color} ring-1 ring-current` :
          'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`, children:


          option.label }, option.value, false
        )
        ) }, void 0, false
      )] }, void 0, true
    ));

}

// Sortable Header Component



function SortableHeader({
  label,
  sortKey,
  sortConfig,
  onSort,
  className = ''






}) {
  const isActive = sortConfig.key === sortKey;

  return (/*#__PURE__*/
    _jsxDEV("th", {
      className: `text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors select-none ${className}`,
      onClick: () => onSort(sortKey), children: /*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center gap-1", children: [
        label, /*#__PURE__*/
        _jsxDEV(ChevronUpDownIcon, { className: `h-4 w-4 transition-colors ${isActive ? 'text-primary-500' : 'text-gray-300 dark:text-gray-600'}` }, void 0, false),
        isActive && sortConfig.direction && /*#__PURE__*/
        _jsxDEV("span", { className: "text-xs text-primary-500", children:
          sortConfig.direction === 'asc' ? '↑' : '↓' }, void 0, false
        )] }, void 0, true

      ) }, void 0, false
    ));

}

// Sort helper function
function sortData(data, sortConfig) {
  if (!sortConfig.key || !sortConfig.direction) return data;

  return [...data].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    let comparison = 0;
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      comparison = aVal.localeCompare(bVal);
    } else if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal;
    } else {
      comparison = String(aVal).localeCompare(String(bVal));
    }

    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
}

// Simple YAML display - no syntax highlighting to avoid HTML escaping issues
// The YAML content is displayed with proper monospace styling

// YAML Panel Component (slide-in panel)
function YAMLModal({
  isOpen,
  onClose,
  resourceType,
  namespace,
  name,
  onRefresh







}) {
  const toast = useToast();
  const [yaml, setYaml] = useState('');
  const [originalYaml, setOriginalYaml] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [dryRunMode, setDryRunMode] = useState(false);
  const [saveResult, setSaveResult] = useState(null);

  const hasChanges = yaml !== originalYaml;

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        if (hasChanges && editMode) {
          if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
            onClose();
          }
        } else {
          onClose();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, hasChanges, editMode]);

  useEffect(() => {
    if (isOpen) {
      fetchYAML();
      setEditMode(false);
      setSaveResult(null);
    }
  }, [isOpen, resourceType, namespace, name]);

  async function fetchYAML() {
    setLoading(true);
    setError(null);
    setSaveResult(null);
    try {
      const result = await kubernetesApi.getResourceYAML({
        kind: resourceType,
        name: name,
        namespace: namespace
      });
      if (result.data.success) {
        setYaml(result.data.yaml_content);
        setOriginalYaml(result.data.yaml_content);
      } else {
        setError(result.data.error || 'Failed to fetch YAML');
      }
    } catch (err) {
      setError('Failed to fetch resource YAML');
      logger.error('Failed to fetch resource YAML', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaveResult(null);
    try {
      const result = await kubernetesApi.updateResourceYAML(yaml, namespace, dryRunMode);
      if (result.data.success) {
        setSaveResult({
          success: true,
          message: dryRunMode ?
          'Dry run successful - no changes applied' :
          result.data.message || 'Resource updated successfully'
        });
        if (!dryRunMode) {
          setOriginalYaml(yaml);
          toast.success(`${resourceType} ${name} updated successfully`);
          onRefresh?.();
        } else {
          toast.success('Dry run validation passed');
        }
      } else {
        const errorMsg = result.data.errors?.join('\n') || 'Failed to update resource';
        setSaveResult({ success: false, message: errorMsg });
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update resource';
      setSaveResult({ success: false, message: errorMsg });
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      logger.error('Failed to copy', err);
    }
  }

  function handleReset() {
    setYaml(originalYaml);
    setSaveResult(null);
    setError(null);
  }

  if (!isOpen) return null;

  const lines = yaml.split('\n');

  // Use React Portal to render slide-in panel at document.body level
  // Position below the main header (top-16 = 64px)
  return /*#__PURE__*/createPortal(/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      transition: { type: 'spring', damping: 25, stiffness: 200 },
      className: `fixed top-16 right-0 bottom-0 z-[9999] flex flex-col bg-white dark:bg-slate-800 shadow-2xl border-l border-gray-200 dark:border-slate-700 ${
      isExpanded ? 'w-full left-0' : 'w-[55%] min-w-[600px]'}`, children: [/*#__PURE__*/



      _jsxDEV("div", { className: "flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-gray-100 dark:border-slate-700", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30", children: /*#__PURE__*/
            _jsxDEV(CodeBracketIcon, { className: "h-5 w-5 text-primary-600 dark:text-primary-400" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: [
              editMode ? 'Edit' : 'View', " Resource YAML"] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
              resourceType, "/", name, " in ", namespace] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/

          _jsxDEV("button", {
            onClick: () => setEditMode(!editMode),
            className: `flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-colors ${
            editMode ?
            'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' :
            'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'}`, children: [/*#__PURE__*/


            _jsxDEV(PencilSquareIcon, { className: "h-4 w-4" }, void 0, false),
            editMode ? 'Editing' : 'Edit'] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: handleCopy,
            disabled: loading || !!error,
            className: "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50", children:

            copied ? /*#__PURE__*/
            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(CheckIcon, { className: "h-4 w-4 text-success-500" }, void 0, false), "Copied!"] }, void 0, true

            ) : /*#__PURE__*/

            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(ClipboardDocumentIcon, { className: "h-4 w-4" }, void 0, false), "Copy"] }, void 0, true

            ) }, void 0, false

          ), /*#__PURE__*/

          _jsxDEV("button", {
            onClick: () => setIsExpanded(!isExpanded),
            className: "p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors",
            title: isExpanded ? 'Collapse panel' : 'Expand to full screen', children:

            isExpanded ? /*#__PURE__*/
            _jsxDEV(ArrowsPointingInIcon, { className: "h-5 w-5" }, void 0, false) : /*#__PURE__*/

            _jsxDEV(ArrowsPointingOutIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: onClose,
            className: "p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors",
            title: "Close (Esc)", children: /*#__PURE__*/

            _jsxDEV(XMarkIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ),


      editMode && /*#__PURE__*/
      _jsxDEV("div", { className: "flex-shrink-0 flex items-center justify-between px-6 py-2 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: fetchYAML,
            disabled: loading,
            className: "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors disabled:opacity-50", children: [/*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: handleReset,
            disabled: !hasChanges,
            className: "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors disabled:opacity-50", children: [/*#__PURE__*/

            _jsxDEV(ArrowUturnLeftIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Reset"] }, void 0, true

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [
          hasChanges && /*#__PURE__*/
          _jsxDEV("span", { className: "flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400", children: [/*#__PURE__*/
            _jsxDEV(ExclamationTriangleIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Unsaved changes"] }, void 0, true

          ), /*#__PURE__*/

          _jsxDEV("label", { className: "flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300", children: [/*#__PURE__*/
            _jsxDEV("input", {
              type: "checkbox",
              checked: dryRunMode,
              onChange: (e) => setDryRunMode(e.target.checked),
              className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-3.5 w-3.5" }, void 0, false
            ), "Dry run"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: handleSave,
            disabled: saving || loading || !hasChanges && !dryRunMode,
            className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children:

            saving ? /*#__PURE__*/
            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: "h-3.5 w-3.5 animate-spin" }, void 0, false),
              dryRunMode ? 'Validating...' : 'Saving...'] }, void 0, true
            ) : /*#__PURE__*/

            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(CheckIcon, { className: "h-3.5 w-3.5" }, void 0, false),
              dryRunMode ? 'Validate' : 'Apply'] }, void 0, true
            ) }, void 0, false

          )] }, void 0, true
        )] }, void 0, true
      ),



      saveResult && /*#__PURE__*/
      _jsxDEV("div", { className: `mx-4 mt-2 p-2 rounded-xl text-xs ${
        saveResult.success ?
        'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 text-success-700 dark:text-success-400' :
        'bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-400'}`, children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-1.5 font-medium", children: [
          saveResult.success ? /*#__PURE__*/
          _jsxDEV(CheckIcon, { className: "h-3.5 w-3.5" }, void 0, false) : /*#__PURE__*/

          _jsxDEV(ExclamationTriangleIcon, { className: "h-3.5 w-3.5" }, void 0, false),

          saveResult.success ? 'Success' : 'Error'] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("p", { className: "mt-0.5 whitespace-pre-wrap", children: saveResult.message }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/



      _jsxDEV("div", { className: "flex-1 overflow-hidden p-4", children:
        loading ? /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-center h-full", children: /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3 text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
            _jsxDEV(ArrowPathIcon, { className: "h-5 w-5 animate-spin" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { children: "Loading YAML..." }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ) :
        error && !yaml ? /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-center h-full", children: /*#__PURE__*/
          _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-danger-500 dark:text-danger-400 font-medium", children: error }, void 0, false), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: fetchYAML,
              className: "mt-3 text-sm text-primary-500 hover:text-primary-600 transition-colors", children:
              "Try again" }, void 0, false

            )] }, void 0, true
          ) }, void 0, false
        ) :
        editMode ? /*#__PURE__*/
        _jsxDEV("textarea", {
          value: yaml,
          onChange: (e) => setYaml(e.target.value),
          className: "w-full h-full p-4 font-mono text-xs bg-gray-900 text-gray-100 rounded-xl border border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none leading-5",
          spellCheck: false,
          placeholder: "YAML content will appear here..." }, void 0, false
        ) : /*#__PURE__*/

        _jsxDEV("div", { className: "h-full bg-gray-50 dark:bg-slate-900 rounded-xl overflow-auto", children: /*#__PURE__*/
          _jsxDEV("pre", { className: "p-4 text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre leading-5", children:
            yaml }, void 0, false
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex-shrink-0 flex items-center justify-between px-6 py-2 border-t border-gray-100 dark:border-slate-700 text-xs text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
        _jsxDEV("span", { children: [lines.length, " lines"] }, void 0, true), /*#__PURE__*/
        _jsxDEV("span", { children: "Press Esc to close" }, void 0, false)] }, void 0, true
      )] }, void 0, true
    ),
    document.body
  );
}

// Deployment filter options
const deploymentFilterOptions = [
{ value: 'all', label: 'All', color: 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700' },
{ value: 'healthy', label: 'Healthy', color: 'text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/20' },
{ value: 'degraded', label: 'Degraded', color: 'text-warning-600 dark:text-warning-400 bg-warning-50 dark:bg-warning-900/20' }];


// Table Components
function DeploymentsTable({ data, searchQuery, onRefresh, pods }) {
  const toast = useToast();
  const [expandedRow, setExpandedRow] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [scaleModal, setScaleModal] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig] = useState({ key: null, direction: null });
  const [yamlModal, setYamlModal] = useState(null);
  const [rollbackModal, setRollbackModal] = useState(null);

  // Filter by search query
  const searchFiltered = data.filter((dep) =>
  dep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  dep.namespace.toLowerCase().includes(searchQuery.toLowerCase()) ||
  dep.image?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter by status
  const statusFiltered = useMemo(() => {
    if (statusFilter === 'all') return searchFiltered;
    if (statusFilter === 'healthy') return searchFiltered.filter((dep) => dep.ready_replicas === dep.replicas);
    if (statusFilter === 'degraded') return searchFiltered.filter((dep) => dep.ready_replicas !== dep.replicas);
    return searchFiltered;
  }, [searchFiltered, statusFilter]);

  // Sort data
  const sortedData = useMemo(() => sortData(statusFiltered, sortConfig), [statusFiltered, sortConfig]);


  const handleScale = async (dep, replicas) => {
    setActionLoading(`scale-${dep.namespace}-${dep.name}`);
    try {
      await kubernetesApi.scale(dep.namespace, dep.name, replicas);
      toast.success('Deployment scaled', `${dep.name} scaled to ${replicas} replicas`);
      onRefresh();
    } catch (error) {
      toast.error('Scale failed', `Failed to scale ${dep.name}`);
      logger.error('Failed to scale deployment', error);
    } finally {
      setActionLoading(null);
      setScaleModal(null);
    }
  };

  const handleRestart = async (dep) => {
    setActionLoading(`restart-${dep.namespace}-${dep.name}`);
    try {
      await kubernetesApi.restart(dep.namespace, dep.name);
      toast.success('Deployment restarted', `${dep.name} is restarting`);
      onRefresh();
    } catch (error) {
      toast.error('Restart failed', `Failed to restart ${dep.name}`);
      logger.error('Failed to restart deployment', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRollback = async (dep, revision) => {
    setActionLoading(`rollback-${dep.namespace}-${dep.name}`);
    try {
      await kubernetesApi.executeKubectl({
        command: `rollout undo deployment ${dep.name} -n ${dep.namespace} --to-revision=${revision}`
      });
      toast.success('Rollback initiated', `${dep.name} is rolling back to revision ${revision}`);
      onRefresh();
      setRollbackModal(null);
    } catch (error) {
      toast.error('Rollback failed', `Failed to rollback ${dep.name}`);
      logger.error('Failed to rollback deployment', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (data.length === 0) {
    return /*#__PURE__*/_jsxDEV(EmptyState, { icon: ServerStackIcon, title: searchQuery ? "No matching deployments" : "No deployments found" }, void 0, false);
  }

  return (/*#__PURE__*/
    _jsxDEV(_Fragment, { children: [/*#__PURE__*/

      _jsxDEV(StatusFilter, { options: deploymentFilterOptions, selected: statusFilter, onChange: setStatusFilter }, void 0, false),

      sortedData.length === 0 ? /*#__PURE__*/
      _jsxDEV(EmptyState, { icon: ServerStackIcon, title: "No deployments match filters" }, void 0, false) : /*#__PURE__*/

      _jsxDEV("div", { className: "overflow-x-auto rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
        _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
          _jsxDEV("thead", { children: /*#__PURE__*/
            _jsxDEV("tr", { className: "border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-8" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Name" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Namespace" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Ready" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Image" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Age" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Actions" }, void 0, false)] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700", children:
            sortedData.map((dep, index) => {
              const isExpanded = expandedRow === `${dep.namespace}-${dep.name}`;
              const rowKey = `${dep.namespace}-${dep.name}`;
              return (/*#__PURE__*/
                _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                  _jsxDEV(motion.tr, {

                    custom: index,
                    variants: tableRowVariants,
                    initial: "hidden",
                    animate: "visible",
                    className: `hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${isExpanded ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`, children: [/*#__PURE__*/

                    _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                      _jsxDEV(motion.button, {
                        whileHover: { scale: 1.1 },
                        whileTap: { scale: 0.9 },
                        onClick: () => setExpandedRow(isExpanded ? null : rowKey),
                        className: "p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors", children:

                        isExpanded ? /*#__PURE__*/
                        _jsxDEV(ChevronUpIcon, { className: "h-4 w-4 text-gray-500" }, void 0, false) : /*#__PURE__*/

                        _jsxDEV(ChevronDownIcon, { className: "h-4 w-4 text-gray-500" }, void 0, false) }, void 0, false

                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center gap-1.5", children: [/*#__PURE__*/
                        _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: dep.name }, void 0, false),
                        (() => {
                          const healthIndicators = getHealthIndicators(dep.name, dep.namespace, dep.labels, dep.age, pods);
                          return (/*#__PURE__*/
                            _jsxDEV(_Fragment, { children: [
                              healthIndicators.maxRestarts > 0 && /*#__PURE__*/
                              _jsxDEV("span", {
                                className: "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-semibold",
                                title: `${healthIndicators.maxRestarts} restarts`, children: [/*#__PURE__*/

                                _jsxDEV(ArrowPathIcon, { className: "h-2.5 w-2.5" }, void 0, false),
                                healthIndicators.maxRestarts] }, void 0, true
                              ),

                              healthIndicators.isRecent && /*#__PURE__*/
                              _jsxDEV("span", { className: "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-semibold", children: [/*#__PURE__*/
                                _jsxDEV(ClockIcon, { className: "h-2.5 w-2.5" }, void 0, false), "Recent"] }, void 0, true

                              )] }, void 0, true

                            ));

                        })()] }, void 0, true
                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                      _jsxDEV("span", { className: "px-2 py-1 rounded-xl text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300", children:
                        dep.namespace }, void 0, false
                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center gap-1.5", children: [/*#__PURE__*/
                        _jsxDEV("span", { className: `px-2.5 py-1 rounded-full text-xs font-semibold ${
                          dep.ready_replicas === dep.replicas ?
                          'bg-success-500/10 text-success-600 dark:text-success-400 ring-1 ring-success-500/20' :
                          'bg-warning-500/10 text-warning-600 dark:text-warning-400 ring-1 ring-warning-500/20'}`, children: [

                          dep.ready_replicas, "/", dep.replicas] }, void 0, true
                        ),
                        (() => {
                          const healthIndicators = getHealthIndicators(dep.name, dep.namespace, dep.labels, dep.age, pods);
                          return (/*#__PURE__*/
                            _jsxDEV(_Fragment, { children: [
                              healthIndicators.hasCrashLoop && /*#__PURE__*/
                              _jsxDEV("span", { title: "CrashLoopBackOff detected", className: "inline-flex p-0.5 rounded bg-red-100 dark:bg-red-500/10", children: /*#__PURE__*/
                                _jsxDEV(ExclamationTriangleIcon, { className: "h-3 w-3 text-red-600 dark:text-red-400" }, void 0, false) }, void 0, false
                              ),

                              healthIndicators.hasImagePullError && /*#__PURE__*/
                              _jsxDEV("span", { title: "ImagePullError detected", className: "inline-flex p-0.5 rounded bg-amber-100 dark:bg-amber-500/10", children: /*#__PURE__*/
                                _jsxDEV(DocumentDuplicateIcon, { className: "h-3 w-3 text-amber-600 dark:text-amber-400" }, void 0, false) }, void 0, false
                              ),

                              healthIndicators.hasProbeFailure && /*#__PURE__*/
                              _jsxDEV("span", { title: "Probe failure detected", className: "inline-flex p-0.5 rounded bg-orange-100 dark:bg-orange-500/10", children: /*#__PURE__*/
                                _jsxDEV(ExclamationTriangleIcon, { className: "h-3 w-3 text-orange-600 dark:text-orange-400" }, void 0, false) }, void 0, false
                              )] }, void 0, true

                            ));

                        })()] }, void 0, true
                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-400 text-sm truncate max-w-xs font-mono", children: dep.image?.split('/').pop() || '-' }, void 0, false), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4 text-gray-500 dark:text-gray-400 text-sm", children: dep.age }, void 0, false), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center justify-end gap-1", children: [/*#__PURE__*/
                        _jsxDEV(motion.button, {
                          whileHover: { scale: 1.05 },
                          whileTap: { scale: 0.95 },
                          onClick: () => setScaleModal({ dep, replicas: dep.replicas }),
                          className: "p-2 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors",
                          title: "Scale", children: /*#__PURE__*/

                          _jsxDEV(ScaleIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV(motion.button, {
                          whileHover: { scale: 1.05 },
                          whileTap: { scale: 0.95 },
                          onClick: () => handleRestart(dep),
                          disabled: actionLoading === `restart-${dep.namespace}-${dep.name}`,
                          className: "p-2 rounded-xl text-gray-500 hover:text-warning-600 hover:bg-warning-50 dark:hover:bg-warning-900/20 transition-colors disabled:opacity-50",
                          title: "Restart", children:

                          actionLoading === `restart-${dep.namespace}-${dep.name}` ? /*#__PURE__*/
                          _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false) : /*#__PURE__*/

                          _jsxDEV(ArrowPathIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false

                        ), /*#__PURE__*/
                        _jsxDEV(motion.button, {
                          whileHover: { scale: 1.05 },
                          whileTap: { scale: 0.95 },
                          onClick: () => setRollbackModal(dep),
                          disabled: actionLoading === `rollback-${dep.namespace}-${dep.name}`,
                          className: "p-2 rounded-xl text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors disabled:opacity-50",
                          title: "Rollback to specific revision", children:

                          actionLoading === `rollback-${dep.namespace}-${dep.name}` ? /*#__PURE__*/
                          _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false) : /*#__PURE__*/

                          _jsxDEV(ArrowUturnLeftIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false

                        ), /*#__PURE__*/
                        _jsxDEV(motion.button, {
                          whileHover: { scale: 1.05 },
                          whileTap: { scale: 0.95 },
                          onClick: () => setYamlModal({ namespace: dep.namespace, name: dep.name }),
                          className: "p-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors",
                          title: "View YAML", children: /*#__PURE__*/

                          _jsxDEV(CodeBracketIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                        )] }, void 0, true
                      ) }, void 0, false
                    )] }, rowKey, true
                  ), /*#__PURE__*/
                  _jsxDEV(AnimatePresence, { children:
                    isExpanded && /*#__PURE__*/
                    _jsxDEV(motion.tr, {

                      initial: { opacity: 0, height: 0 },
                      animate: { opacity: 1, height: 'auto' },
                      exit: { opacity: 0, height: 0 }, children: /*#__PURE__*/

                      _jsxDEV("td", { colSpan: 7, className: "p-0", children: /*#__PURE__*/
                        _jsxDEV("div", { className: "px-6 py-4 bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-700", children: /*#__PURE__*/
                          _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [/*#__PURE__*/
                            _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                              _jsxDEV("h4", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Full Image Path" }, void 0, false), /*#__PURE__*/
                              _jsxDEV("p", { className: "font-mono text-xs text-gray-700 dark:text-gray-300 break-all bg-gray-100 dark:bg-slate-700 p-2 rounded-xl", children:
                                dep.image || '-' }, void 0, false
                              )] }, void 0, true
                            ), /*#__PURE__*/
                            _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                              _jsxDEV("h4", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Labels" }, void 0, false), /*#__PURE__*/
                              _jsxDEV("div", { className: "flex flex-wrap gap-1", children: [
                                dep.labels && Object.keys(dep.labels).length > 0 ?
                                Object.entries(dep.labels).slice(0, 4).map(([key, value]) => /*#__PURE__*/
                                _jsxDEV("span", { className: "px-2 py-0.5 rounded text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-mono", children: [
                                  key.split('/').pop(), "=", value.length > 15 ? value.slice(0, 15) + '...' : value] }, key, true
                                )
                                ) : /*#__PURE__*/

                                _jsxDEV("span", { className: "text-sm text-gray-400", children: "No labels" }, void 0, false),

                                dep.labels && Object.keys(dep.labels).length > 4 && /*#__PURE__*/
                                _jsxDEV("span", { className: "px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-slate-700 text-gray-500", children: ["+",
                                  Object.keys(dep.labels).length - 4, " more"] }, void 0, true
                                )] }, void 0, true

                              )] }, void 0, true
                            ), /*#__PURE__*/
                            _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                              _jsxDEV("h4", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Replica Status" }, void 0, false), /*#__PURE__*/
                              _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
                                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                                  _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Desired:" }, void 0, false), /*#__PURE__*/
                                  _jsxDEV("span", { className: "text-sm font-semibold text-gray-700 dark:text-gray-300", children: dep.replicas }, void 0, false)] }, void 0, true
                                ), /*#__PURE__*/
                                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                                  _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Ready:" }, void 0, false), /*#__PURE__*/
                                  _jsxDEV("span", { className: `text-sm font-semibold ${dep.ready_replicas === dep.replicas ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400'}`, children:
                                    dep.ready_replicas }, void 0, false
                                  )] }, void 0, true
                                ), /*#__PURE__*/
                                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                                  _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Available:" }, void 0, false), /*#__PURE__*/
                                  _jsxDEV("span", { className: "text-sm font-semibold text-gray-700 dark:text-gray-300", children: dep.available_replicas ?? dep.ready_replicas }, void 0, false)] }, void 0, true
                                )] }, void 0, true
                              )] }, void 0, true
                            )] }, void 0, true
                          ) }, void 0, false
                        ) }, void 0, false
                      ) }, `${rowKey}-details`, false
                    ) }, void 0, false

                  )] }, void 0, true
                ));

            }) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ),



      scaleModal && /*#__PURE__*/
      _jsxDEV(ScaleModal, {
        isOpen: !!scaleModal,
        onClose: () => setScaleModal(null),
        resourceName: scaleModal.dep.name,
        resourceType: "Deployment",
        namespace: scaleModal.dep.namespace,
        currentReplicas: scaleModal.dep.replicas,
        onScale: async (replicas) => {
          await handleScale(scaleModal.dep, replicas);
        },
        isLoading: actionLoading !== null }, void 0, false
      ), /*#__PURE__*/



      _jsxDEV(AnimatePresence, { children:
        yamlModal && /*#__PURE__*/
        _jsxDEV(YAMLModal, {
          isOpen: !!yamlModal,
          onClose: () => setYamlModal(null),
          resourceType: "deployment",
          namespace: yamlModal.namespace,
          name: yamlModal.name,
          onRefresh: onRefresh }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        rollbackModal && /*#__PURE__*/
        _jsxDEV(RollbackModal, {
          isOpen: !!rollbackModal,
          onClose: () => setRollbackModal(null),
          deployment: rollbackModal,
          onRollback: async (revision) => {
            await handleRollback(rollbackModal, revision);
          },
          isLoading: actionLoading !== null }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}

// Pod filter options
const podFilterOptions = [
{ value: 'all', label: 'All', color: 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700' },
{ value: 'running', label: 'Running', color: 'text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/20' },
{ value: 'pending', label: 'Pending', color: 'text-warning-600 dark:text-warning-400 bg-warning-50 dark:bg-warning-900/20' },
{ value: 'failed', label: 'Failed', color: 'text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-900/20' }];


function PodsTable({ data, searchQuery, onRefresh }) {
  const toast = useToast();
  const [expandedRow, setExpandedRow] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig] = useState({ key: null, direction: null });
  const [yamlModal, setYamlModal] = useState(null);
  const [logsModal, setLogsModal] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [execModal, setExecModal] = useState(null);

  // Filter by search query
  const searchFiltered = data.filter((pod) =>
  pod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  pod.namespace.toLowerCase().includes(searchQuery.toLowerCase()) ||
  pod.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
  pod.node?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter by status
  const statusFiltered = useMemo(() => {
    if (statusFilter === 'all') return searchFiltered;
    if (statusFilter === 'running') return searchFiltered.filter((pod) => pod.status === 'Running');
    if (statusFilter === 'pending') return searchFiltered.filter((pod) => pod.status === 'Pending');
    if (statusFilter === 'failed') return searchFiltered.filter((pod) => !['Running', 'Pending'].includes(pod.status));
    return searchFiltered;
  }, [searchFiltered, statusFilter]);

  // Sort data
  const sortedData = useMemo(() => sortData(statusFiltered, sortConfig), [statusFiltered, sortConfig]);


  const handleDelete = async (pod) => {
    if (!confirm(`Are you sure you want to delete pod "${pod.name}"?`)) return;

    setDeleteLoading(`${pod.namespace}-${pod.name}`);
    try {
      await kubernetesApi.executeKubectl({
        command: `delete pod ${pod.name} -n ${pod.namespace}`
      });
      toast.success('Pod deleted', `${pod.name} has been deleted`);
    } catch (error) {
      toast.error('Delete failed', `Failed to delete ${pod.name}`);
      logger.error('Failed to delete pod', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (data.length === 0) {
    return /*#__PURE__*/_jsxDEV(EmptyState, { icon: CubeIcon, title: searchQuery ? "No matching pods" : "No pods found" }, void 0, false);
  }

  return (/*#__PURE__*/
    _jsxDEV(_Fragment, { children: [/*#__PURE__*/

      _jsxDEV(StatusFilter, { options: podFilterOptions, selected: statusFilter, onChange: setStatusFilter }, void 0, false),

      sortedData.length === 0 ? /*#__PURE__*/
      _jsxDEV(EmptyState, { icon: CubeIcon, title: "No pods match filters" }, void 0, false) : /*#__PURE__*/

      _jsxDEV("div", { className: "overflow-x-auto rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
        _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
          _jsxDEV("thead", { children: /*#__PURE__*/
            _jsxDEV("tr", { className: "border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-8" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Name" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Namespace" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Status" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Restarts" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Node" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Age" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Actions" }, void 0, false)] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700", children:
            sortedData.map((pod, index) => {
              const isExpanded = expandedRow === `${pod.namespace}-${pod.name}`;
              const rowKey = `${pod.namespace}-${pod.name}`;
              const isDeleting = deleteLoading === rowKey;
              return (/*#__PURE__*/
                _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                  _jsxDEV(motion.tr, {

                    custom: index,
                    variants: tableRowVariants,
                    initial: "hidden",
                    animate: "visible",
                    className: `hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${isExpanded ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`, children: [/*#__PURE__*/

                    _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                      _jsxDEV(motion.button, {
                        whileHover: { scale: 1.1 },
                        whileTap: { scale: 0.9 },
                        onClick: () => setExpandedRow(isExpanded ? null : rowKey),
                        className: "p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors", children:

                        isExpanded ? /*#__PURE__*/
                        _jsxDEV(ChevronUpIcon, { className: "h-4 w-4 text-gray-500" }, void 0, false) : /*#__PURE__*/

                        _jsxDEV(ChevronDownIcon, { className: "h-4 w-4 text-gray-500" }, void 0, false) }, void 0, false

                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4 font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs", children: pod.name }, void 0, false), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                      _jsxDEV("span", { className: "px-2 py-1 rounded-xl text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300", children:
                        pod.namespace }, void 0, false
                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                      _jsxDEV("span", {
                        className: `px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${
                        pod.status === 'Running' ?
                        'bg-success-500/10 text-success-600 dark:text-success-400 ring-success-500/20' :
                        pod.status === 'Pending' ?
                        'bg-warning-500/10 text-warning-600 dark:text-warning-400 ring-warning-500/20' :
                        'bg-danger-500/10 text-danger-600 dark:text-danger-400 ring-danger-500/20'}`, children:


                        pod.status }, void 0, false
                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-400", children: pod.restarts }, void 0, false), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4 text-gray-500 dark:text-gray-400 text-sm font-mono", children: pod.node || '-' }, void 0, false), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4 text-gray-500 dark:text-gray-400 text-sm", children: pod.age }, void 0, false), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center justify-end gap-1", children: [/*#__PURE__*/
                        _jsxDEV(motion.button, {
                          whileHover: { scale: 1.05 },
                          whileTap: { scale: 0.95 },
                          onClick: () => setLogsModal(pod),
                          className: "p-2 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors",
                          title: "View Logs", children: /*#__PURE__*/

                          _jsxDEV(DocumentTextIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV(motion.button, {
                          whileHover: { scale: 1.05 },
                          whileTap: { scale: 0.95 },
                          onClick: () => setExecModal(pod),
                          disabled: pod.status !== 'Running',
                          className: "p-2 rounded-xl text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                          title: pod.status === 'Running' ? 'Execute commands in pod' : 'Pod must be running to exec', children: /*#__PURE__*/

                          _jsxDEV(CommandLineIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV(motion.button, {
                          whileHover: { scale: 1.05 },
                          whileTap: { scale: 0.95 },
                          onClick: () => setYamlModal({ namespace: pod.namespace, name: pod.name }),
                          className: "p-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors",
                          title: "View YAML", children: /*#__PURE__*/

                          _jsxDEV(CodeBracketIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV(motion.button, {
                          whileHover: { scale: 1.05 },
                          whileTap: { scale: 0.95 },
                          onClick: () => handleDelete(pod),
                          disabled: isDeleting,
                          className: "p-2 rounded-xl text-gray-500 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors disabled:opacity-50",
                          title: "Delete", children:

                          isDeleting ? /*#__PURE__*/
                          _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false) : /*#__PURE__*/

                          _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false

                        )] }, void 0, true
                      ) }, void 0, false
                    )] }, rowKey, true
                  ), /*#__PURE__*/
                  _jsxDEV(AnimatePresence, { children:
                    isExpanded && /*#__PURE__*/
                    _jsxDEV(motion.tr, {

                      initial: { opacity: 0, height: 0 },
                      animate: { opacity: 1, height: 'auto' },
                      exit: { opacity: 0, height: 0 }, children: /*#__PURE__*/

                      _jsxDEV("td", { colSpan: 8, className: "p-0", children: /*#__PURE__*/
                        _jsxDEV("div", { className: "px-6 py-4 bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-700", children: /*#__PURE__*/
                          _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [/*#__PURE__*/
                            _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                              _jsxDEV("h4", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Pod IP" }, void 0, false), /*#__PURE__*/
                              _jsxDEV("p", { className: "font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded inline-block", children:
                                pod.ip || 'Not assigned' }, void 0, false
                              )] }, void 0, true
                            ), /*#__PURE__*/
                            _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                              _jsxDEV("h4", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: ["Containers (", pod.containers?.length || 0, ")"] }, void 0, true), /*#__PURE__*/
                              _jsxDEV("div", { className: "flex flex-wrap gap-1", children:
                                pod.containers && pod.containers.length > 0 ?
                                pod.containers.map((container, idx) => /*#__PURE__*/
                                _jsxDEV("span", { className: "px-2 py-0.5 rounded text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-mono", children:
                                  container }, idx, false
                                )
                                ) : /*#__PURE__*/

                                _jsxDEV("span", { className: "text-sm text-gray-400", children: "No containers" }, void 0, false) }, void 0, false

                              )] }, void 0, true
                            ), /*#__PURE__*/
                            _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                              _jsxDEV("h4", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Node" }, void 0, false), /*#__PURE__*/
                              _jsxDEV("p", { className: "font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded inline-block", children:
                                pod.node || 'Not scheduled' }, void 0, false
                              )] }, void 0, true
                            )] }, void 0, true
                          ) }, void 0, false
                        ) }, void 0, false
                      ) }, `${rowKey}-details`, false
                    ) }, void 0, false

                  )] }, void 0, true
                ));

            }) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/



      _jsxDEV(AnimatePresence, { children:
        yamlModal && /*#__PURE__*/
        _jsxDEV(YAMLModal, {
          isOpen: !!yamlModal,
          onClose: () => setYamlModal(null),
          resourceType: "pod",
          namespace: yamlModal.namespace,
          name: yamlModal.name,
          onRefresh: onRefresh }, void 0, false
        ) }, void 0, false

      ),


      logsModal && /*#__PURE__*/
      _jsxDEV(PodLogsViewer, { pod: logsModal, onClose: () => setLogsModal(null) }, void 0, false), /*#__PURE__*/



      _jsxDEV(AnimatePresence, { children:
        execModal && /*#__PURE__*/
        _jsxDEV(PodExecModal, {
          isOpen: !!execModal,
          onClose: () => setExecModal(null),
          pod: execModal }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}




// Secret Modal for viewing and editing secrets



// Filter options for StatefulSets
const statefulSetFilterOptions = [
{ value: 'all', label: 'All StatefulSets', color: 'gray' },
{ value: 'healthy', label: 'Healthy', color: 'success' },
{ value: 'degraded', label: 'Degraded', color: 'warning' }];


function StatefulSetsTable({ data, searchQuery, onRefresh }) {
  const toast = useToast();
  const [expandedRow, setExpandedRow] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [scaleModal, setScaleModal] = useState(null);
  const [yamlModal, setYamlModal] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Filter by search query
  const searchFiltered = data.filter((ss) =>
  ss.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  ss.namespace.toLowerCase().includes(searchQuery.toLowerCase()) ||
  ss.image?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter by status
  const statusFiltered = useMemo(() => {
    if (statusFilter === 'all') return searchFiltered;
    if (statusFilter === 'healthy') return searchFiltered.filter((ss) => ss.ready_replicas === ss.replicas);
    if (statusFilter === 'degraded') return searchFiltered.filter((ss) => ss.ready_replicas !== ss.replicas);
    return searchFiltered;
  }, [searchFiltered, statusFilter]);

  // Sort data
  const filteredData = useMemo(() => sortData(statusFiltered, sortConfig), [statusFiltered, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleScale = async (ss, replicas) => {
    setActionLoading(`scale-${ss.namespace}-${ss.name}`);
    try {
      await kubernetesApi.executeKubectl({
        command: `scale statefulset ${ss.name} --replicas=${replicas} -n ${ss.namespace}`
      });
      toast.success('StatefulSet scaled', `${ss.name} scaled to ${replicas} replicas`);
      onRefresh();
    } catch (error) {
      toast.error('Scale failed', `Failed to scale ${ss.name}`);
    } finally {
      setActionLoading(null);
      setScaleModal(null);
    }
  };

  const handleRestart = async (ss) => {
    setActionLoading(`restart-${ss.namespace}-${ss.name}`);
    try {
      await kubernetesApi.executeKubectl({
        command: `rollout restart statefulset ${ss.name} -n ${ss.namespace}`
      });
      toast.success('StatefulSet restarted', `${ss.name} is restarting`);
      onRefresh();
    } catch (error) {
      toast.error('Restart failed', `Failed to restart ${ss.name}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (data.length === 0) {
    return /*#__PURE__*/_jsxDEV(EmptyState, { icon: ServerStackIcon, title: searchQuery ? "No matching statefulsets" : "No statefulsets found" }, void 0, false);
  }

  return (/*#__PURE__*/
    _jsxDEV(_Fragment, { children: [/*#__PURE__*/

      _jsxDEV(StatusFilter, { options: statefulSetFilterOptions, selected: statusFilter, onChange: setStatusFilter }, void 0, false),

      filteredData.length === 0 ? /*#__PURE__*/
      _jsxDEV(EmptyState, { icon: ServerStackIcon, title: "No statefulsets match filters" }, void 0, false) : /*#__PURE__*/

      _jsxDEV("div", { className: "overflow-x-auto rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
        _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
          _jsxDEV("thead", { children: /*#__PURE__*/
            _jsxDEV("tr", { className: "border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-8" }, void 0, false), /*#__PURE__*/
              _jsxDEV(SortableHeader, { label: "Name", sortKey: "name", sortConfig: sortConfig, onSort: handleSort }, void 0, false), /*#__PURE__*/
              _jsxDEV(SortableHeader, { label: "Namespace", sortKey: "namespace", sortConfig: sortConfig, onSort: handleSort }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Ready" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Image" }, void 0, false), /*#__PURE__*/
              _jsxDEV(SortableHeader, { label: "Age", sortKey: "age", sortConfig: sortConfig, onSort: handleSort }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Actions" }, void 0, false)] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700", children:
            filteredData.map((ss, index) => {
              const isExpanded = expandedRow === `${ss.namespace}-${ss.name}`;
              const rowKey = `${ss.namespace}-${ss.name}`;
              return (/*#__PURE__*/
                _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                  _jsxDEV(motion.tr, {

                    custom: index,
                    variants: tableRowVariants,
                    initial: "hidden",
                    animate: "visible",
                    className: `hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${isExpanded ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`, children: [/*#__PURE__*/

                    _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                      _jsxDEV(motion.button, {
                        whileHover: { scale: 1.1 },
                        whileTap: { scale: 0.9 },
                        onClick: () => setExpandedRow(isExpanded ? null : rowKey),
                        className: "p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors", children:

                        isExpanded ? /*#__PURE__*/
                        _jsxDEV(ChevronUpIcon, { className: "h-4 w-4 text-gray-500" }, void 0, false) : /*#__PURE__*/

                        _jsxDEV(ChevronDownIcon, { className: "h-4 w-4 text-gray-500" }, void 0, false) }, void 0, false

                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4 font-medium text-gray-900 dark:text-gray-100", children: ss.name }, void 0, false), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                      _jsxDEV("span", { className: "px-2 py-1 rounded-xl text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300", children:
                        ss.namespace }, void 0, false
                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                      _jsxDEV("span", { className: `px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${
                        ss.ready_replicas === ss.replicas ?
                        'bg-success-500/10 text-success-600 dark:text-success-400 ring-success-500/20' :
                        'bg-warning-500/10 text-warning-600 dark:text-warning-400 ring-warning-500/20'}`, children: [

                        ss.ready_replicas, "/", ss.replicas] }, void 0, true
                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4 text-gray-500 dark:text-gray-400 text-sm truncate max-w-xs font-mono", children: ss.image?.split('/').pop() || '-' }, void 0, false), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4 text-gray-500 dark:text-gray-400 text-sm", children: ss.age }, void 0, false), /*#__PURE__*/
                    _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center justify-end gap-1", children: [/*#__PURE__*/
                        _jsxDEV(motion.button, {
                          whileHover: { scale: 1.05 },
                          whileTap: { scale: 0.95 },
                          onClick: () => setScaleModal({ ss, replicas: ss.replicas }),
                          className: "p-2 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors",
                          title: "Scale", children: /*#__PURE__*/

                          _jsxDEV(ScaleIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV(motion.button, {
                          whileHover: { scale: 1.05 },
                          whileTap: { scale: 0.95 },
                          onClick: () => handleRestart(ss),
                          disabled: actionLoading === `restart-${ss.namespace}-${ss.name}`,
                          className: "p-2 rounded-xl text-gray-500 hover:text-warning-600 hover:bg-warning-50 dark:hover:bg-warning-900/20 transition-colors disabled:opacity-50",
                          title: "Restart", children:

                          actionLoading === `restart-${ss.namespace}-${ss.name}` ? /*#__PURE__*/
                          _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false) : /*#__PURE__*/

                          _jsxDEV(ArrowPathIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false

                        ), /*#__PURE__*/
                        _jsxDEV(motion.button, {
                          whileHover: { scale: 1.05 },
                          whileTap: { scale: 0.95 },
                          onClick: () => setYamlModal({ namespace: ss.namespace, name: ss.name }),
                          className: "p-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors",
                          title: "View YAML", children: /*#__PURE__*/

                          _jsxDEV(CodeBracketIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                        )] }, void 0, true
                      ) }, void 0, false
                    )] }, rowKey, true
                  ), /*#__PURE__*/
                  _jsxDEV(AnimatePresence, { children:
                    isExpanded && /*#__PURE__*/
                    _jsxDEV(motion.tr, {

                      initial: { opacity: 0, height: 0 },
                      animate: { opacity: 1, height: 'auto' },
                      exit: { opacity: 0, height: 0 }, children: /*#__PURE__*/

                      _jsxDEV("td", { colSpan: 7, className: "p-0", children: /*#__PURE__*/
                        _jsxDEV("div", { className: "px-6 py-4 bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-700", children: /*#__PURE__*/
                          _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [/*#__PURE__*/
                            _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                              _jsxDEV("h4", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Full Image Path" }, void 0, false), /*#__PURE__*/
                              _jsxDEV("p", { className: "font-mono text-xs text-gray-700 dark:text-gray-300 break-all bg-gray-100 dark:bg-slate-700 p-2 rounded-xl", children:
                                ss.image || '-' }, void 0, false
                              )] }, void 0, true
                            ), /*#__PURE__*/
                            _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                              _jsxDEV("h4", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Labels" }, void 0, false), /*#__PURE__*/
                              _jsxDEV("div", { className: "flex flex-wrap gap-1", children: [
                                ss.labels && Object.keys(ss.labels).length > 0 ?
                                Object.entries(ss.labels).slice(0, 4).map(([key, value]) => /*#__PURE__*/
                                _jsxDEV("span", { className: "px-2 py-0.5 rounded text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-mono", children: [
                                  key.split('/').pop(), "=", String(value).length > 15 ? String(value).slice(0, 15) + '...' : value] }, key, true
                                )
                                ) : /*#__PURE__*/

                                _jsxDEV("span", { className: "text-sm text-gray-400", children: "No labels" }, void 0, false),

                                ss.labels && Object.keys(ss.labels).length > 4 && /*#__PURE__*/
                                _jsxDEV("span", { className: "px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-slate-700 text-gray-500", children: ["+",
                                  Object.keys(ss.labels).length - 4, " more"] }, void 0, true
                                )] }, void 0, true

                              )] }, void 0, true
                            ), /*#__PURE__*/
                            _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                              _jsxDEV("h4", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Replica Status" }, void 0, false), /*#__PURE__*/
                              _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
                                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                                  _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Replicas:" }, void 0, false), /*#__PURE__*/
                                  _jsxDEV("span", { className: "text-sm font-semibold text-gray-700 dark:text-gray-300", children: ss.replicas }, void 0, false)] }, void 0, true
                                ), /*#__PURE__*/
                                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                                  _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Ready:" }, void 0, false), /*#__PURE__*/
                                  _jsxDEV("span", { className: `text-sm font-semibold ${ss.ready_replicas === ss.replicas ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400'}`, children:
                                    ss.ready_replicas }, void 0, false
                                  )] }, void 0, true
                                ), /*#__PURE__*/
                                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                                  _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Service:" }, void 0, false), /*#__PURE__*/
                                  _jsxDEV("span", { className: "text-sm font-mono text-gray-700 dark:text-gray-300", children: [ss.name, "-headless"] }, void 0, true)] }, void 0, true
                                )] }, void 0, true
                              )] }, void 0, true
                            )] }, void 0, true
                          ) }, void 0, false
                        ) }, void 0, false
                      ) }, `${rowKey}-details`, false
                    ) }, void 0, false

                  )] }, void 0, true
                ));

            }) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ),



      scaleModal && /*#__PURE__*/
      _jsxDEV(ScaleModal, {
        isOpen: !!scaleModal,
        onClose: () => setScaleModal(null),
        resourceName: scaleModal.ss.name,
        resourceType: "StatefulSet",
        namespace: scaleModal.ss.namespace,
        currentReplicas: scaleModal.ss.replicas,
        onScale: async (replicas) => {
          await handleScale(scaleModal.ss, replicas);
        },
        isLoading: actionLoading !== null }, void 0, false
      ), /*#__PURE__*/



      _jsxDEV(AnimatePresence, { children:
        yamlModal && /*#__PURE__*/
        _jsxDEV(YAMLModal, {
          isOpen: !!yamlModal,
          onClose: () => setYamlModal(null),
          resourceType: "statefulset",
          namespace: yamlModal.namespace,
          name: yamlModal.name }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}

function DaemonSetsTable({ data, searchQuery, onRefresh }) {
  const [yamlModal, setYamlModal] = useState(null);

  const filteredData = data.filter((ds) =>
  ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  ds.namespace.toLowerCase().includes(searchQuery.toLowerCase()) ||
  ds.image?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredData.length === 0) {
    return /*#__PURE__*/_jsxDEV(EmptyState, { icon: CpuChipIcon, title: searchQuery ? "No matching daemonsets" : "No daemonsets found" }, void 0, false);
  }
  return (/*#__PURE__*/
    _jsxDEV(_Fragment, { children: [/*#__PURE__*/
      _jsxDEV("div", { className: "overflow-x-auto rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
        _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
          _jsxDEV("thead", { children: /*#__PURE__*/
            _jsxDEV("tr", { className: "border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Name" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Namespace" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Desired" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Ready" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Available" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Image" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Age" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Actions" }, void 0, false)] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700", children:
            filteredData.map((ds, index) => /*#__PURE__*/
            _jsxDEV(motion.tr, {

              custom: index,
              variants: tableRowVariants,
              initial: "hidden",
              animate: "visible",
              className: "hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors", children: [/*#__PURE__*/

              _jsxDEV("td", { className: "py-3 px-4 font-medium text-gray-900 dark:text-gray-100", children: ds.name }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("span", { className: "px-2 py-1 rounded-xl text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300", children:
                  ds.namespace }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-400", children: ds.desired }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("span", { className: `px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${
                  ds.ready === ds.desired ?
                  'bg-success-500/10 text-success-600 dark:text-success-400 ring-success-500/20' :
                  'bg-warning-500/10 text-warning-600 dark:text-warning-400 ring-warning-500/20'}`, children:

                  ds.ready }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-400", children: ds.available }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-gray-500 dark:text-gray-400 text-sm truncate max-w-xs font-mono", children: ds.image?.split('/').pop() || '-' }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-gray-500 dark:text-gray-400 text-sm", children: ds.age }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-end gap-1", children: [/*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => setYamlModal({ namespace: ds.namespace, name: ds.name }),
                    className: "p-1.5 rounded-xl text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors",
                    title: "View/Edit YAML", children: /*#__PURE__*/

                    _jsxDEV(PencilSquareIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    className: "p-2 rounded-xl text-gray-500 hover:text-warning-600 hover:bg-warning-50 dark:hover:bg-warning-900/20 transition-colors",
                    title: "Restart", children: /*#__PURE__*/

                    _jsxDEV(ArrowPathIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false
              )] }, `${ds.namespace}-${ds.name}`, true
            )
            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        yamlModal && /*#__PURE__*/
        _jsxDEV(YAMLModal, {
          isOpen: !!yamlModal,
          onClose: () => setYamlModal(null),
          resourceType: "daemonset",
          namespace: yamlModal.namespace,
          name: yamlModal.name,
          onRefresh: onRefresh }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}

function JobsTable({ data, searchQuery, onRefresh }) {
  const toast = useToast();
  const [yamlModal, setYamlModal] = useState(null);
  const [logsModal, setLogsModal] = useState(null);
  const [selectedPodForLogs, setSelectedPodForLogs] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loadingPods, setLoadingPods] = useState(false);

  const filteredData = data.filter((job) =>
  job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  job.namespace.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch pods for a job
  const fetchJobPods = async (job) => {
    setLoadingPods(true);
    try {
      const response = await kubernetesApi.getPods(job.namespace);
      // Filter pods that belong to this job using the job-name label
      const jobPods = response.data.filter((pod) =>
      pod.labels?.['job-name'] === job.name ||
      pod.labels?.['controller-uid'] === job.labels?.['controller-uid']
      );
      setLogsModal({ job, pods: jobPods });
      if (jobPods.length > 0) {
        setSelectedPodForLogs(jobPods[0]);
      }
    } catch (error) {
      logger.error('Failed to fetch job pods', error);
      toast.error('Failed to fetch pods for this job');
    } finally {
      setLoadingPods(false);
    }
  };

  // Handle delete
  const handleDelete = async (job) => {
    setDeleting(true);
    try {
      await kubernetesApi.deleteJob(job.namespace, job.name);
      toast.success(`Job ${job.name} deleted successfully`);
      setDeleteModal(null);
      onRefresh?.();
    } catch (error) {
      toast.error(`Failed to delete job: ${error.response?.data?.detail || error.message}`);
    } finally {
      setDeleting(false);
    }
  };

  if (filteredData.length === 0) {
    return /*#__PURE__*/_jsxDEV(EmptyState, { icon: ClockIcon, title: searchQuery ? "No matching jobs" : "No jobs found" }, void 0, false);
  }
  return (/*#__PURE__*/
    _jsxDEV(_Fragment, { children: [/*#__PURE__*/
      _jsxDEV("div", { className: "overflow-x-auto rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
        _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
          _jsxDEV("thead", { children: /*#__PURE__*/
            _jsxDEV("tr", { className: "border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Name" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Namespace" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Completions" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Succeeded" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Failed" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Duration" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Age" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Actions" }, void 0, false)] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700", children:
            filteredData.map((job, index) => /*#__PURE__*/
            _jsxDEV(motion.tr, {

              custom: index,
              variants: tableRowVariants,
              initial: "hidden",
              animate: "visible",
              className: "hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors", children: [/*#__PURE__*/

              _jsxDEV("td", { className: "py-3 px-4 font-medium text-gray-900 dark:text-gray-100", children: job.name }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("span", { className: "px-2 py-1 rounded-xl text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300", children:
                  job.namespace }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-400", children: job.completions ?? '-' }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("span", { className: "px-2.5 py-1 rounded-full text-xs font-semibold bg-success-500/10 text-success-600 dark:text-success-400 ring-1 ring-success-500/20", children:
                  job.succeeded }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children:
                job.failed > 0 ? /*#__PURE__*/
                _jsxDEV("span", { className: "px-2.5 py-1 rounded-full text-xs font-semibold bg-danger-500/10 text-danger-600 dark:text-danger-400 ring-1 ring-danger-500/20", children:
                  job.failed }, void 0, false
                ) : /*#__PURE__*/

                _jsxDEV("span", { className: "text-gray-400", children: "0" }, void 0, false) }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-gray-500 dark:text-gray-400 text-sm", children: job.duration || '-' }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-gray-500 dark:text-gray-400 text-sm", children: job.age }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-end gap-1", children: [/*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => setYamlModal({ namespace: job.namespace, name: job.name }),
                    className: "p-1.5 rounded-xl text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors",
                    title: "View/Edit YAML", children: /*#__PURE__*/

                    _jsxDEV(PencilSquareIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    onClick: () => fetchJobPods(job),
                    disabled: loadingPods,
                    className: "p-2 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors disabled:opacity-50",
                    title: "View Logs", children: /*#__PURE__*/

                    _jsxDEV(DocumentTextIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    onClick: () => setDeleteModal(job),
                    className: "p-2 rounded-xl text-gray-500 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors",
                    title: "Delete", children: /*#__PURE__*/

                    _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false
              )] }, `${job.namespace}-${job.name}`, true
            )
            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        yamlModal && /*#__PURE__*/
        _jsxDEV(YAMLModal, {
          isOpen: !!yamlModal,
          onClose: () => setYamlModal(null),
          resourceType: "job",
          namespace: yamlModal.namespace,
          name: yamlModal.name,
          onRefresh: onRefresh }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        logsModal && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm",
          onClick: () => {setLogsModal(null);setSelectedPodForLogs(null);}, children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            initial: { scale: 0.9, opacity: 0, y: 20 },
            animate: { scale: 1, opacity: 1, y: 0 },
            exit: { scale: 0.9, opacity: 0, y: 20 },
            transition: { type: 'spring', damping: 25, stiffness: 300 },
            onClick: (e) => e.stopPropagation(),
            className: "bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 border border-gray-200 dark:border-slate-700 max-h-[90vh] flex flex-col", children: [/*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30", children: /*#__PURE__*/
                  _jsxDEV(DocumentTextIcon, { className: "h-5 w-5 text-primary-600 dark:text-primary-400" }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: ["Job Logs: ",
                    logsModal.job.name] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["Namespace: ",
                    logsModal.job.namespace] }, void 0, true
                  )] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => {setLogsModal(null);setSelectedPodForLogs(null);},
                className: "p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors", children: /*#__PURE__*/

                _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "flex-1 overflow-hidden p-4", children:
              logsModal.pods.length === 0 ? /*#__PURE__*/
              _jsxDEV("div", { className: "text-center py-8", children: [/*#__PURE__*/
                _jsxDEV(CubeIcon, { className: "h-12 w-12 mx-auto text-gray-400 mb-3" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children: "No pods found for this job" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-400 dark:text-gray-500 mt-1", children: "The job may have been completed and its pods cleaned up" }, void 0, false

                )] }, void 0, true
              ) : /*#__PURE__*/

              _jsxDEV("div", { className: "space-y-4 h-full flex flex-col", children: [

                logsModal.pods.length > 1 && /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Select Pod:" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("select", {
                    value: selectedPodForLogs?.name || '',
                    onChange: (e) => {
                      const pod = logsModal.pods.find((p) => p.name === e.target.value);
                      setSelectedPodForLogs(pod || null);
                    },
                    className: "px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 text-sm", children:

                    logsModal.pods.map((pod) => /*#__PURE__*/
                    _jsxDEV("option", { value: pod.name, children: [
                      pod.name, " (", pod.status, ")"] }, pod.name, true
                    )
                    ) }, void 0, false
                  )] }, void 0, true
                ),



                selectedPodForLogs && /*#__PURE__*/
                _jsxDEV("div", { className: "flex-1 min-h-0", children: /*#__PURE__*/
                  _jsxDEV(PodLogsViewer, {
                    pod: selectedPodForLogs,
                    onClose: () => {setLogsModal(null);setSelectedPodForLogs(null);},
                    defaultExpanded: true }, void 0, false
                  ) }, void 0, false
                )] }, void 0, true

              ) }, void 0, false

            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        deleteModal && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm",
          onClick: () => !deleting && setDeleteModal(null), children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            initial: { scale: 0.9, opacity: 0, y: 20 },
            animate: { scale: 1, opacity: 1, y: 0 },
            exit: { scale: 0.9, opacity: 0, y: 20 },
            transition: { type: 'spring', damping: 25, stiffness: 300 },
            onClick: (e) => e.stopPropagation(),
            className: "bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "flex items-center gap-3 mb-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-2 rounded-xl bg-danger-100 dark:bg-danger-900/30", children: /*#__PURE__*/
                _jsxDEV(ExclamationTriangleIcon, { className: "h-6 w-6 text-danger-600 dark:text-danger-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: "Delete Job" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "This action cannot be undone" }, void 0, false

                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("p", { className: "text-gray-600 dark:text-gray-300 mb-6", children: ["Are you sure you want to delete ", /*#__PURE__*/
              _jsxDEV("span", { className: "font-semibold", children: deleteModal.name }, void 0, false), " in namespace", ' ', /*#__PURE__*/
              _jsxDEV("span", { className: "font-semibold", children: deleteModal.namespace }, void 0, false), "?"] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("div", { className: "flex justify-end gap-3", children: [/*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                onClick: () => setDeleteModal(null),
                disabled: deleting,
                className: "px-4 py-2 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50", children:
                "Cancel" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                onClick: () => handleDelete(deleteModal),
                disabled: deleting,
                className: "px-5 py-2 text-sm font-medium rounded-xl bg-danger-600 text-white hover:bg-danger-700 transition-all shadow-lg shadow-danger-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2", children: [

                deleting && /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Delete"] }, void 0, true

              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}

function CronJobsTable({ data, searchQuery, onRefresh }) {
  const [yamlModal, setYamlModal] = useState(null);

  const filteredData = data.filter((cj) =>
  cj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  cj.namespace.toLowerCase().includes(searchQuery.toLowerCase()) ||
  cj.schedule.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredData.length === 0) {
    return /*#__PURE__*/_jsxDEV(EmptyState, { icon: CalendarIcon, title: searchQuery ? "No matching cronjobs" : "No cronjobs found" }, void 0, false);
  }
  return (/*#__PURE__*/
    _jsxDEV(_Fragment, { children: [/*#__PURE__*/
      _jsxDEV("div", { className: "overflow-x-auto rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
        _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
          _jsxDEV("thead", { children: /*#__PURE__*/
            _jsxDEV("tr", { className: "border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Name" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Namespace" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Schedule" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Suspend" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Active" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Last Schedule" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Age" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Actions" }, void 0, false)] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700", children:
            filteredData.map((cj, index) => /*#__PURE__*/
            _jsxDEV(motion.tr, {

              custom: index,
              variants: tableRowVariants,
              initial: "hidden",
              animate: "visible",
              className: "hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors", children: [/*#__PURE__*/

              _jsxDEV("td", { className: "py-3 px-4 font-medium text-gray-900 dark:text-gray-100", children: cj.name }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("span", { className: "px-2 py-1 rounded-xl text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300", children:
                  cj.namespace }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("span", { className: "px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700 font-mono text-xs text-gray-600 dark:text-gray-300", children:
                  cj.schedule }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("span", { className: `px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${
                  cj.suspend ?
                  'bg-warning-500/10 text-warning-600 dark:text-warning-400 ring-warning-500/20' :
                  'bg-success-500/10 text-success-600 dark:text-success-400 ring-success-500/20'}`, children:

                  cj.suspend ? 'Yes' : 'No' }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-400", children: cj.active }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-gray-500 dark:text-gray-400 text-sm", children: cj.last_schedule || '-' }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-gray-500 dark:text-gray-400 text-sm", children: cj.age }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-end gap-1", children: [/*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => setYamlModal({ namespace: cj.namespace, name: cj.name }),
                    className: "p-1.5 rounded-xl text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors",
                    title: "View/Edit YAML", children: /*#__PURE__*/

                    _jsxDEV(PencilSquareIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    className: "p-2 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors",
                    title: "Trigger Now", children: /*#__PURE__*/

                    _jsxDEV(PlayIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    className: "p-2 rounded-xl text-gray-500 hover:text-warning-600 hover:bg-warning-50 dark:hover:bg-warning-900/20 transition-colors",
                    title: cj.suspend ? "Resume" : "Suspend", children:

                    cj.suspend ? /*#__PURE__*/_jsxDEV(PlayIcon, { className: "h-4 w-4" }, void 0, false) : /*#__PURE__*/_jsxDEV(StopIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false
              )] }, `${cj.namespace}-${cj.name}`, true
            )
            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        yamlModal && /*#__PURE__*/
        _jsxDEV(YAMLModal, {
          isOpen: !!yamlModal,
          onClose: () => setYamlModal(null),
          resourceType: "cronjob",
          namespace: yamlModal.namespace,
          name: yamlModal.name,
          onRefresh: onRefresh }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CircleStackIcon,
  FolderIcon,
  FolderOpenIcon,
  ChevronRightIcon,
  PlayIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  CodeBracketIcon,
  DocumentDuplicateIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CubeIcon,
  CloudArrowUpIcon,
  ArrowDownTrayIcon,
  TagIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  ListBulletIcon } from
'@heroicons/react/24/outline';
import GlassCard from '../common/GlassCard';

// Animation variants
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Types


























// Mock data for Helm charts
const mockChartTree = [
{
  name: 'bitnami',
  type: 'folder',
  children: [
  { name: 'nginx', type: 'chart', chart: { name: 'nginx', version: '15.4.4', appVersion: '1.25.3', description: 'NGINX Open Source for high-performance web serving', repo: 'bitnami' } },
  { name: 'postgresql', type: 'chart', chart: { name: 'postgresql', version: '13.2.24', appVersion: '16.1.0', description: 'PostgreSQL is an object-relational database', repo: 'bitnami' } },
  { name: 'redis', type: 'chart', chart: { name: 'redis', version: '18.4.0', appVersion: '7.2.3', description: 'Redis is an in-memory data structure store', repo: 'bitnami' } },
  { name: 'mongodb', type: 'chart', chart: { name: 'mongodb', version: '14.3.2', appVersion: '7.0.4', description: 'MongoDB is a document-oriented NoSQL database', repo: 'bitnami' } }]

},
{
  name: 'stable',
  type: 'folder',
  children: [
  { name: 'grafana', type: 'chart', chart: { name: 'grafana', version: '7.0.17', appVersion: '10.2.2', description: 'The leading observability platform', repo: 'stable' } },
  { name: 'prometheus', type: 'chart', chart: { name: 'prometheus', version: '25.8.2', appVersion: '2.48.0', description: 'Prometheus monitoring system', repo: 'stable' } }]

},
{
  name: 'local',
  type: 'folder',
  children: [
  { name: 'kubesight-api', type: 'chart', chart: { name: 'kubesight-api', version: '1.4.0', appVersion: '1.4.0', description: 'KubeSight API Server', repo: 'local' } },
  { name: 'kubesight-frontend', type: 'chart', chart: { name: 'kubesight-frontend', version: '1.4.0', appVersion: '1.4.0', description: 'KubeSight Frontend Application', repo: 'local' } }]

}];


const mockReleases = [
{ name: 'api-server', namespace: 'production', chart: 'kubesight-api', version: '1.4.0', status: 'deployed', revision: 5, updated: '2024-01-15T10:30:00Z' },
{ name: 'web-frontend', namespace: 'production', chart: 'kubesight-frontend', version: '1.4.0', status: 'deployed', revision: 3, updated: '2024-01-15T10:30:00Z' },
{ name: 'redis-cache', namespace: 'production', chart: 'redis', version: '18.4.0', status: 'deployed', revision: 2, updated: '2024-01-10T08:00:00Z' },
{ name: 'monitoring', namespace: 'monitoring', chart: 'prometheus', version: '25.8.2', status: 'deployed', revision: 1, updated: '2024-01-05T12:00:00Z' },
{ name: 'failed-release', namespace: 'staging', chart: 'nginx', version: '15.4.4', status: 'failed', revision: 1, updated: '2024-01-14T15:00:00Z' }];


const mockDefaultValues = `# Default values for nginx
replicaCount: 3

image:
  repository: nginx
  pullPolicy: IfNotPresent
  tag: "1.25.3"

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: "nginx"
  annotations:
    kubernetes.io/tls-acme: "true"
  hosts:
    - host: app.example.com
      paths:
        - path: /
          pathType: Prefix

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80

nodeSelector: {}
tolerations: []
affinity: {}
`;

// Chart Tree Component
function ChartTree({
  nodes,
  selectedChart,
  onSelectChart,
  level = 0





}) {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['bitnami', 'stable', 'local']));

  const toggleFolder = (name) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-0.5", children:
      nodes.map((node) => /*#__PURE__*/
      _jsxDEV("div", { children: [/*#__PURE__*/
        _jsxDEV(motion.button, {
          whileHover: { x: 2 },
          onClick: () => {
            if (node.type === 'folder') {
              toggleFolder(node.name);
            } else {
              onSelectChart(node);
            }
          },
          className: `w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
          selectedChart === node.name ?
          'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400' :
          'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'}`,

          style: { paddingLeft: `${level * 12 + 8}px` }, children: [

          node.type === 'folder' ? /*#__PURE__*/
          _jsxDEV(_Fragment, { children: [/*#__PURE__*/
            _jsxDEV(ChevronRightIcon, { className: `h-3 w-3 text-gray-400 transition-transform ${expandedFolders.has(node.name) ? 'rotate-90' : ''}` }, void 0, false),
            expandedFolders.has(node.name) ? /*#__PURE__*/
            _jsxDEV(FolderOpenIcon, { className: "h-4 w-4 text-amber-500" }, void 0, false) : /*#__PURE__*/

            _jsxDEV(FolderIcon, { className: "h-4 w-4 text-amber-500" }, void 0, false)] }, void 0, true

          ) : /*#__PURE__*/

          _jsxDEV(_Fragment, { children: [/*#__PURE__*/
            _jsxDEV("span", { className: "w-3" }, void 0, false), /*#__PURE__*/
            _jsxDEV(CircleStackIcon, { className: "h-4 w-4 text-blue-500" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("span", { className: "text-xs truncate", children: node.name }, void 0, false),
          node.chart && /*#__PURE__*/
          _jsxDEV("span", { className: "ml-auto text-xs text-gray-400", children: node.chart.version }, void 0, false)] }, void 0, true

        ),
        node.type === 'folder' && expandedFolders.has(node.name) && node.children && /*#__PURE__*/
        _jsxDEV(ChartTree, {
          nodes: node.children,
          selectedChart: selectedChart,
          onSelectChart: onSelectChart,
          level: level + 1 }, void 0, false
        )] }, node.name, true

      )
      ) }, void 0, false
    ));

}

// AI Values Analysis Component
function AIValuesAnalysis({ valuesContent }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(




    null);

  const analyzeValues = async () => {
    if (!valuesContent.trim()) return;

    setAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setAnalysis({
      riskLevel: 'low',
      issues: [
      { severity: 'info', message: 'Using recommended resource limits' },
      { severity: 'warning', message: 'Consider enabling PodDisruptionBudget for HA' },
      { severity: 'info', message: 'Autoscaling is properly configured' }],

      suggestions: [
      'Add PodDisruptionBudget for high availability',
      'Consider adding pod anti-affinity rules',
      'Review ingress TLS configuration'],

      optimizations: [
      'Right-size CPU requests based on usage patterns',
      'Enable horizontal pod autoscaling metrics']

    });
    setAnalyzing(false);
  };

  const riskColors = {
    low: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
    medium: 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
    high: 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20'
  };

  const severityIcons = {
    error: /*#__PURE__*/_jsxDEV(XCircleIcon, { className: "h-4 w-4 text-red-500" }, void 0, false),
    warning: /*#__PURE__*/_jsxDEV(ExclamationTriangleIcon, { className: "h-4 w-4 text-amber-500" }, void 0, false),
    info: /*#__PURE__*/_jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-blue-500" }, void 0, false)
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
      _jsxDEV(motion.button, {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        onClick: analyzeValues,
        disabled: analyzing || !valuesContent.trim(),
        className: "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-200/50 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 font-medium text-sm hover:from-purple-500/30 hover:to-blue-500/30 disabled:opacity-50 transition-all", children: [

        analyzing ? /*#__PURE__*/
        _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false) : /*#__PURE__*/

        _jsxDEV(SparklesIcon, { className: "h-4 w-4" }, void 0, false),

        analyzing ? 'Analyzing...' : 'AI Values Analysis'] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV(AnimatePresence, { children:
        analysis && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          className: "space-y-3", children: [/*#__PURE__*/


          _jsxDEV("div", { className: `p-3 rounded-xl border ${riskColors[analysis.riskLevel]}`, children: /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(SparklesIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs font-semibold uppercase", children: [
                analysis.riskLevel, " Risk"] }, void 0, true
              )] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase", children: "Analysis" }, void 0, false),
            analysis.issues.map((issue, idx) => /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-slate-800/50", children: [
              severityIcons[issue.severity], /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs text-gray-700 dark:text-gray-300", children: issue.message }, void 0, false)] }, idx, true
            )
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase", children: "Suggestions" }, void 0, false),
            analysis.suggestions.map((suggestion, idx) => /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-start gap-2 p-2 rounded-lg bg-purple-50 dark:bg-purple-500/5", children: [/*#__PURE__*/
              _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-purple-500 flex-shrink-0" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs text-gray-700 dark:text-gray-300", children: suggestion }, void 0, false)] }, idx, true
            )
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false

      )] }, void 0, true
    ));

}

// Status Badge Component
function ReleaseBadge({ status }) {
  const statusConfig = {
    deployed: { color: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', label: 'Deployed' },
    pending: { color: 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400', label: 'Pending' },
    failed: { color: 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400', label: 'Failed' },
    uninstalling: { color: 'bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400', label: 'Uninstalling' }
  };

  const config = statusConfig[status];
  return (/*#__PURE__*/
    _jsxDEV("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`, children:
      config.label }, void 0, false
    ));

}

export default function HelmDeployEnhanced() {
  const [valuesContent, setValuesContent] = useState(mockDefaultValues);
  const [selectedChart, setSelectedChart] = useState(null);
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [releaseName, setReleaseName] = useState('');
  const [namespace, setNamespace] = useState('default');
  const [activeEditorTab, setActiveEditorTab] = useState('values');
  const [activeLeftTab, setActiveLeftTab] = useState('charts');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState(null);

  const namespaces = ['default', 'production', 'staging', 'development', 'monitoring', 'kube-system'];

  const handleChartSelect = (node) => {
    if (node.type === 'chart' && node.chart) {
      setSelectedChart(node);
      setReleaseName(node.chart.name + '-release');
      addLog(`Selected chart: ${node.chart.name} v${node.chart.version}`);
    }
  };

  const handleReleaseSelect = (release) => {
    setSelectedRelease(release);
    setReleaseName(release.name);
    setNamespace(release.namespace);
    addLog(`Selected release: ${release.name} (rev ${release.revision})`);
  };

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleInstall = async (dryRun) => {
    if (!selectedChart) {
      addLog('Error: No chart selected');
      return;
    }

    setLoading(true);
    setResult(null);
    addLog(`Starting ${dryRun ? 'dry run' : 'installation'} of ${selectedChart.chart?.name}...`);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (dryRun) {
      addLog('Dry run completed successfully');
      addLog('Resources to be created: Deployment, Service, Ingress, ConfigMap');
      setResult({ success: true, message: 'Dry run completed - 4 resources would be created' });
    } else {
      addLog(`Installing ${selectedChart.chart?.name} as ${releaseName}...`);
      addLog('Creating resources...');
      addLog('Release installed successfully!');
      setResult({ success: true, message: `Release ${releaseName} installed successfully` });
    }

    setLoading(false);
  };

  const handleUpgrade = async () => {
    if (!selectedRelease) {
      addLog('Error: No release selected');
      return;
    }

    setLoading(true);
    setResult(null);
    addLog(`Upgrading release ${selectedRelease.name}...`);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    addLog('Upgrade completed successfully!');
    setResult({ success: true, message: `Release ${selectedRelease.name} upgraded to revision ${selectedRelease.revision + 1}` });

    setLoading(false);
  };

  const handleRollback = async () => {
    if (!selectedRelease) {
      addLog('Error: No release selected');
      return;
    }

    setLoading(true);
    setResult(null);
    addLog(`Rolling back release ${selectedRelease.name} to revision ${selectedRelease.revision - 1}...`);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    addLog('Rollback completed successfully!');
    setResult({ success: true, message: `Release ${selectedRelease.name} rolled back to revision ${selectedRelease.revision - 1}` });

    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(valuesContent);
    addLog('Values copied to clipboard');
  };

  const editorTabs = [
  { id: 'values', label: 'Values', icon: DocumentTextIcon },
  { id: 'chart', label: 'Chart Info', icon: BookOpenIcon },
  { id: 'templates', label: 'Templates', icon: ListBulletIcon },
  { id: 'ai', label: 'AI Review', icon: SparklesIcon }];


  const filteredReleases = mockReleases.filter((release) =>
  release.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  release.chart.toLowerCase().includes(searchQuery.toLowerCase()) ||
  release.namespace.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      variants: containerVariants,
      initial: "hidden",
      animate: "visible",
      className: `space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-50 dark:bg-slate-950 p-4' : ''}`, children: [/*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, className: "flex items-center justify-between", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20", children: /*#__PURE__*/
            _jsxDEV(CircleStackIcon, { className: "h-5 w-5 text-cyan-600 dark:text-cyan-400" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Helm Deploy" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500", children: "Install and manage Helm charts" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV(motion.button, {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          onClick: () => setIsFullscreen(!isFullscreen),
          className: "p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500", children:

          isFullscreen ? /*#__PURE__*/
          _jsxDEV(ArrowsPointingInIcon, { className: "h-5 w-5" }, void 0, false) : /*#__PURE__*/

          _jsxDEV(ArrowsPointingOutIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false

        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, className: "grid grid-cols-5 gap-4 h-[calc(100vh-280px)] min-h-[500px]", children: [/*#__PURE__*/

        _jsxDEV(GlassCard, { className: "col-span-1 overflow-hidden flex flex-col", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "p-2 border-b border-gray-200/50 dark:border-slate-700/50 flex items-center gap-1", children: [/*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => setActiveLeftTab('charts'),
              className: `flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeLeftTab === 'charts' ?
              'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400' :
              'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800'}`, children: [/*#__PURE__*/


              _jsxDEV(CubeIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Charts"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => setActiveLeftTab('releases'),
              className: `flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeLeftTab === 'releases' ?
              'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400' :
              'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800'}`, children: [/*#__PURE__*/


              _jsxDEV(CloudArrowUpIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Releases"] }, void 0, true

            )] }, void 0, true
          ),


          activeLeftTab === 'releases' && /*#__PURE__*/
          _jsxDEV("div", { className: "p-2 border-b border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
            _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
              _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" }, void 0, false), /*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                placeholder: "Search releases...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200/50 dark:border-slate-700/50 rounded-lg bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300 placeholder-gray-400" }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/



          _jsxDEV("div", { className: "flex-1 overflow-y-auto p-2", children:
            activeLeftTab === 'charts' ? /*#__PURE__*/
            _jsxDEV(ChartTree, {
              nodes: mockChartTree,
              selectedChart: selectedChart?.name || null,
              onSelectChart: handleChartSelect }, void 0, false
            ) : /*#__PURE__*/

            _jsxDEV("div", { className: "space-y-1", children:
              filteredReleases.map((release) => /*#__PURE__*/
              _jsxDEV(motion.button, {

                whileHover: { x: 2 },
                onClick: () => handleReleaseSelect(release),
                className: `w-full p-2 rounded-lg text-left transition-colors ${
                selectedRelease?.name === release.name ?
                'bg-primary-100 dark:bg-primary-500/20' :
                'hover:bg-gray-100 dark:hover:bg-slate-800'}`, children: [/*#__PURE__*/


                _jsxDEV("div", { className: "flex items-center justify-between mb-1", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-xs font-medium text-gray-900 dark:text-white truncate", children: release.name }, void 0, false), /*#__PURE__*/
                  _jsxDEV(ReleaseBadge, { status: release.status }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2 text-xs text-gray-500", children: [/*#__PURE__*/
                  _jsxDEV("span", { children: release.chart }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { children: "•" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { children: release.namespace }, void 0, false)] }, void 0, true
                )] }, release.name, true
              )
              ) }, void 0, false
            ) }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV(GlassCard, { className: "col-span-3 overflow-hidden flex flex-col", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "p-2 border-b border-gray-200/50 dark:border-slate-700/50 flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-1", children:
              editorTabs.map((tab) => /*#__PURE__*/
              _jsxDEV("button", {

                onClick: () => setActiveEditorTab(tab.id),
                className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeEditorTab === tab.id ?
                'bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400' :
                'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'}`, children: [/*#__PURE__*/


                _jsxDEV(tab.icon, { className: "h-3.5 w-3.5" }, void 0, false),
                tab.label] }, tab.id, true
              )
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-1", children: /*#__PURE__*/
              _jsxDEV("button", {
                onClick: copyToClipboard,
                className: "p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400",
                title: "Copy to clipboard", children: /*#__PURE__*/

                _jsxDEV(DocumentDuplicateIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
              ) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "flex-1 overflow-hidden", children: [
            activeEditorTab === 'values' && /*#__PURE__*/
            _jsxDEV("textarea", {
              value: valuesContent,
              onChange: (e) => setValuesContent(e.target.value),
              placeholder: "Enter your values.yaml content here...",
              className: "w-full h-full font-mono text-sm p-4 resize-none bg-slate-900 dark:bg-slate-950 text-slate-300 placeholder-slate-500 focus:outline-none",
              spellCheck: "false" }, void 0, false
            ),

            activeEditorTab === 'chart' && /*#__PURE__*/
            _jsxDEV("div", { className: "h-full p-4 overflow-auto", children:
              selectedChart?.chart ? /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-start gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20", children: /*#__PURE__*/
                    _jsxDEV(CircleStackIcon, { className: "h-8 w-8 text-blue-500" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: selectedChart.chart.name }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-500", children: selectedChart.chart.description }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50", children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 mb-1", children: "Chart Version" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1", children: [/*#__PURE__*/
                      _jsxDEV(TagIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false),
                      selectedChart.chart.version] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50", children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 mb-1", children: "App Version" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1", children: [/*#__PURE__*/
                      _jsxDEV(CubeIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false),
                      selectedChart.chart.appVersion] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50", children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 mb-1", children: "Repository" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1", children: [/*#__PURE__*/
                      _jsxDEV(FolderIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false),
                      selectedChart.chart.repo] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50", children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 mb-1", children: "Maintainers" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: "Bitnami Team" }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                )] }, void 0, true
              ) : /*#__PURE__*/

              _jsxDEV("div", { className: "h-full flex items-center justify-center text-gray-500", children: /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm", children: "Select a chart to view details" }, void 0, false) }, void 0, false
              ) }, void 0, false

            ),

            activeEditorTab === 'templates' && /*#__PURE__*/
            _jsxDEV("div", { className: "h-full p-4 overflow-auto", children: /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3", children: "Templates" }, void 0, false),
                ['deployment.yaml', 'service.yaml', 'ingress.yaml', 'configmap.yaml', 'secrets.yaml', 'hpa.yaml', 'pdb.yaml', 'serviceaccount.yaml'].map((template) => /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-700/50 cursor-pointer", children: [/*#__PURE__*/
                  _jsxDEV(DocumentTextIcon, { className: "h-4 w-4 text-blue-500" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-xs text-gray-700 dark:text-gray-300", children: template }, void 0, false)] }, template, true
                )
                )] }, void 0, true
              ) }, void 0, false
            ),

            activeEditorTab === 'ai' && /*#__PURE__*/
            _jsxDEV("div", { className: "h-full p-4 overflow-auto", children: /*#__PURE__*/
              _jsxDEV(AIValuesAnalysis, { valuesContent: valuesContent }, void 0, false) }, void 0, false
            )] }, void 0, true

          ), /*#__PURE__*/


          _jsxDEV("div", { className: "px-4 py-2 border-t border-gray-200/50 dark:border-slate-700/50 flex items-center justify-between text-xs text-gray-500", children: [/*#__PURE__*/
            _jsxDEV("span", { children: selectedChart?.chart?.name || selectedRelease?.chart || 'values.yaml' }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { children: [valuesContent.split('\n').length, " lines"] }, void 0, true)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV(GlassCard, { className: "col-span-1 overflow-hidden flex flex-col", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-3 border-b border-gray-200/50 dark:border-slate-700/50 flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(Cog6ToothIcon, { className: "h-4 w-4 text-gray-500" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "text-xs font-semibold text-gray-700 dark:text-gray-300", children: "Settings" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex-1 overflow-y-auto p-3 space-y-4", children: [/*#__PURE__*/

            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block", children: "Release Name" }, void 0, false), /*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                value: releaseName,
                onChange: (e) => setReleaseName(e.target.value),
                placeholder: "my-release",
                className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-700/50 rounded-xl bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300 placeholder-gray-400" }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block", children: "Namespace" }, void 0, false), /*#__PURE__*/
              _jsxDEV("select", {
                value: namespace,
                onChange: (e) => setNamespace(e.target.value),
                className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-700/50 rounded-xl bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300", children:

                namespaces.map((ns) => /*#__PURE__*/
                _jsxDEV("option", { value: ns, children: ns }, ns, false)
                ) }, void 0, false
              )] }, void 0, true
            ),


            selectedRelease && /*#__PURE__*/
            _jsxDEV("div", { className: "p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 space-y-2", children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase", children: "Release Info" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between text-xs", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500", children: "Revision" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: selectedRelease.revision }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between text-xs", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500", children: "Status" }, void 0, false), /*#__PURE__*/
                _jsxDEV(ReleaseBadge, { status: selectedRelease.status }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-1 text-xs text-gray-500", children: [/*#__PURE__*/
                _jsxDEV(ClockIcon, { className: "h-3 w-3" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { children: new Date(selectedRelease.updated).toLocaleDateString() }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/



            _jsxDEV("div", { className: "space-y-2", children:
              activeLeftTab === 'charts' ? /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: () => handleInstall(true),
                  disabled: loading || !selectedChart,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-slate-700/50 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-all", children: [/*#__PURE__*/

                  _jsxDEV(ArrowDownTrayIcon, { className: "h-4 w-4" }, void 0, false), "Dry Run"] }, void 0, true

                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: () => handleInstall(false),
                  disabled: loading || !selectedChart,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 transition-all", children: [

                  loading ? /*#__PURE__*/
                  _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false) : /*#__PURE__*/

                  _jsxDEV(PlayIcon, { className: "h-4 w-4" }, void 0, false),

                  loading ? 'Installing...' : 'Install'] }, void 0, true
                )] }, void 0, true
              ) : /*#__PURE__*/

              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: handleUpgrade,
                  disabled: loading || !selectedRelease,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 transition-all", children: [

                  loading ? /*#__PURE__*/
                  _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false) : /*#__PURE__*/

                  _jsxDEV(CloudArrowUpIcon, { className: "h-4 w-4" }, void 0, false),

                  loading ? 'Upgrading...' : 'Upgrade'] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: handleRollback,
                  disabled: loading || !selectedRelease || selectedRelease.revision <= 1,
                  className: "w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-slate-700/50 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-all", children: [/*#__PURE__*/

                  _jsxDEV(ArrowPathIcon, { className: "h-4 w-4" }, void 0, false), "Rollback"] }, void 0, true

                )] }, void 0, true
              ) }, void 0, false

            ), /*#__PURE__*/


            _jsxDEV(AnimatePresence, { children:
              result && /*#__PURE__*/
              _jsxDEV(motion.div, {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -10 },
                className: "pt-4 border-t border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/

                _jsxDEV("div", { className: `p-3 rounded-xl border ${result.success ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'}`, children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [
                    result.success ? /*#__PURE__*/
                    _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }, void 0, false) : /*#__PURE__*/

                    _jsxDEV(XCircleIcon, { className: "h-4 w-4 text-red-600 dark:text-red-400" }, void 0, false), /*#__PURE__*/

                    _jsxDEV("span", { className: `text-xs font-medium ${result.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`, children:
                      result.success ? 'Success' : 'Failed' }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: `text-xs mt-1 ${result.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`, children:
                    result.message }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false
              ) }, void 0, false

            ), /*#__PURE__*/


            _jsxDEV("div", { className: "pt-4 border-t border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
              _jsxDEV(AIValuesAnalysis, { valuesContent: valuesContent }, void 0, false) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV(GlassCard, { className: "overflow-hidden", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-3 border-b border-gray-200/50 dark:border-slate-700/50 flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(CodeBracketIcon, { className: "h-4 w-4 text-gray-500" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs font-semibold text-gray-700 dark:text-gray-300", children: "Helm Output" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => setLogs([]),
              className: "text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300", children:
              "Clear" }, void 0, false

            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "h-32 overflow-y-auto bg-slate-900 dark:bg-slate-950 p-3 font-mono text-xs", children:
            logs.length === 0 ? /*#__PURE__*/
            _jsxDEV("p", { className: "text-slate-500", children: "No logs yet..." }, void 0, false) :

            logs.map((log, idx) => /*#__PURE__*/
            _jsxDEV("p", { className: "text-slate-400", children: log }, idx, false)
            ) }, void 0, false

          )] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true
    ));

}
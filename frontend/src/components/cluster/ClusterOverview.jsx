import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ServerStackIcon,
  CpuChipIcon,
  CircleStackIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CloudIcon,
  SparklesIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  TagIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  BoltIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon } from
'@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid, SignalIcon as SignalSolid } from '@heroicons/react/24/solid';
import { useCluster } from '../../contexts/ClusterContext';
import { useClusterOverviewData } from '../../hooks/useClusterOverviewData';
import GlassCard from '../common/GlassCard';
import { chartColors } from '../../styles/design-system';

// Animation variants
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: { duration: 2, repeat: Infinity }
  }
};

// Compact Mini Chart for inline metrics
function MiniChart({ data, color }) {
  const colorMap = {
    blue: { stroke: chartColors.primary[0], bg: 'from-blue-500/20 to-blue-500/5' },
    purple: { stroke: chartColors.purple[0], bg: 'from-purple-500/20 to-purple-500/5' },
    green: { stroke: chartColors.success[0], bg: 'from-green-500/20 to-green-500/5' }
  };

  // Handle empty data gracefully
  if (!data || data.length === 0) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "w-20 h-10 flex items-center justify-center", children: /*#__PURE__*/
          _jsxDEV("span", { className: "text-[10px] text-gray-400", children: "No data" }, void 0, false) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "text-right", children: /*#__PURE__*/
          _jsxDEV("span", { className: "text-lg font-bold text-gray-400", children: "--%" }, void 0, false) }, void 0, false
        )] }, void 0, true
      ));

  }

  const maxValue = Math.max(...data, 100);
  const currentValue = data[data.length - 1] ?? 0;
  const previousValue = data[data.length - 2] ?? currentValue;
  const trend = currentValue - previousValue;

  const points = data.map((value, index) => {
    const x = data.length > 1 ? index / (data.length - 1) * 100 : 50;
    const y = 40 - value / maxValue * 36;
    return `${x},${y}`;
  }).join(' L');

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
      _jsxDEV("svg", { viewBox: "0 0 100 44", className: "w-20 h-10", preserveAspectRatio: "none", children: [/*#__PURE__*/
        _jsxDEV("defs", { children: /*#__PURE__*/
          _jsxDEV("linearGradient", { id: `mini-${color}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [/*#__PURE__*/
            _jsxDEV("stop", { offset: "0%", stopColor: colorMap[color].stroke, stopOpacity: "0.3" }, void 0, false), /*#__PURE__*/
            _jsxDEV("stop", { offset: "100%", stopColor: colorMap[color].stroke, stopOpacity: "0" }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("path", {
          d: `M0,40 L${points} L100,40 Z`,
          fill: `url(#mini-${color})` }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("path", {
          d: `M${points}`,
          fill: "none",
          stroke: colorMap[color].stroke,
          strokeWidth: "2",
          strokeLinecap: "round" }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("circle", { cx: "100", cy: 40 - currentValue / maxValue * 36, r: "3", fill: colorMap[color].stroke }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "text-right", children: [/*#__PURE__*/
        _jsxDEV("span", { className: "text-lg font-bold text-gray-900 dark:text-white", children: [currentValue, "%"] }, void 0, true),
        trend !== 0 && /*#__PURE__*/
        _jsxDEV("span", { className: `block text-[10px] font-medium ${trend > 0 ? 'text-red-500' : 'text-green-500'}`, children: [
          trend > 0 ? '+' : '', trend, "%"] }, void 0, true
        )] }, void 0, true

      )] }, void 0, true
    ));

}

// Alert Item Component
function AlertItem({ type, message, resource, time




}) {
  const config = type === 'error' ?
  { icon: ExclamationCircleIcon, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/20' } :
  { icon: ExclamationTriangleIcon, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20' };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: `flex items-start gap-2 p-2.5 rounded-lg ${config.bg} border ${config.border}`, children: [/*#__PURE__*/
      _jsxDEV(config.icon, { className: `h-4 w-4 ${config.color} flex-shrink-0 mt-0.5` }, void 0, false), /*#__PURE__*/
      _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
        _jsxDEV("p", { className: "text-xs font-medium text-gray-900 dark:text-white line-clamp-1", children: message }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2 mt-0.5", children: [/*#__PURE__*/
          _jsxDEV("span", { className: "text-[10px] text-gray-500 truncate font-mono", children: resource }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "text-[10px] text-gray-400 flex items-center gap-0.5", children: [/*#__PURE__*/
            _jsxDEV(ClockIcon, { className: "h-2.5 w-2.5" }, void 0, false), time] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      )] }, void 0, true
    ));

}

// AI Insight Card Component
function AIInsightCard({ title, description, impact, source, index






}) {
  const impactConfig = {
    high: { bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
    medium: { bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
    low: { bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' }
  };

  const sourceConfig = {
    optimization: { icon: BoltIcon, gradient: 'from-blue-500 to-cyan-400' },
    security: { icon: ShieldCheckIcon, gradient: 'from-emerald-500 to-green-400' },
    ai: { icon: SparklesIcon, gradient: 'from-purple-500 to-pink-400' }
  };

  const SourceIcon = sourceConfig[source].icon;
  const impactStyle = impactConfig[impact];

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, x: -10 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: index * 0.05 },
      className: "group flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-gray-200/50 dark:border-slate-700/50 hover:border-purple-300/50 dark:hover:border-purple-500/30 cursor-pointer transition-all", children: [/*#__PURE__*/

      _jsxDEV("div", { className: `p-2 rounded-lg bg-gradient-to-br ${sourceConfig[source].gradient}`, children: /*#__PURE__*/
        _jsxDEV(SourceIcon, { className: "h-3.5 w-3.5 text-white" }, void 0, false) }, void 0, false
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2 mb-0.5", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-xs font-semibold text-gray-900 dark:text-white truncate", children: title }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: `flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${impactStyle.bg} ${impactStyle.text}`, children: [/*#__PURE__*/
            _jsxDEV("span", { className: `w-1 h-1 rounded-full ${impactStyle.dot}` }, void 0, false),
            impact.toUpperCase()] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("p", { className: "text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1", children: description }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV(ChevronRightIcon, { className: "h-3.5 w-3.5 text-gray-300 dark:text-gray-600 flex-shrink-0" }, void 0, false)] }, void 0, true
    ));

}

// Security Score Ring Component
function SecurityScoreRing({ score, size = 80 }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = score / 100 * circumference;

  const getColor = () => {
    if (score >= 80) return { main: chartColors.success[0], label: 'Good' };
    if (score >= 60) return { main: '#F59E0B', label: 'Fair' };
    return { main: '#EF4444', label: 'Poor' };
  };

  const colorConfig = getColor();

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "relative flex flex-col items-center", style: { width: size, height: size + 16 }, children: [/*#__PURE__*/
      _jsxDEV("svg", { viewBox: `0 0 ${size} ${size}`, className: "transform -rotate-90", children: [/*#__PURE__*/
        _jsxDEV("circle", { cx: size / 2, cy: size / 2, r: radius, fill: "none", stroke: "currentColor", strokeWidth: "6", className: "text-gray-100 dark:text-slate-800" }, void 0, false), /*#__PURE__*/
        _jsxDEV(motion.circle, {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          fill: "none",
          stroke: colorConfig.main,
          strokeWidth: "6",
          strokeLinecap: "round",
          strokeDasharray: circumference,
          initial: { strokeDashoffset: circumference },
          animate: { strokeDashoffset: circumference - progress },
          transition: { duration: 1, ease: 'easeOut' } }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: /*#__PURE__*/
        _jsxDEV("span", { className: "text-xl font-bold text-gray-900 dark:text-white", children: score }, void 0, false) }, void 0, false
      ), /*#__PURE__*/
      _jsxDEV("span", { className: "text-[10px] font-semibold mt-1", style: { color: colorConfig.main }, children: colorConfig.label }, void 0, false)] }, void 0, true
    ));

}

// Summary Card Component
function SummaryCard({ title, value, subtitle, icon: Icon, gradient, loading, trend







}) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "relative overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-gray-200/50 dark:border-slate-700/50 p-4 hover:shadow-lg transition-shadow", children: [/*#__PURE__*/
      _jsxDEV("div", { className: `absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${gradient} opacity-10 blur-xl rounded-full transform translate-x-4 -translate-y-4` }, void 0, false), /*#__PURE__*/
      _jsxDEV("div", { className: "relative flex items-start justify-between", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-xs font-medium text-gray-500 dark:text-gray-400", children: title }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-baseline gap-2 mt-1", children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children:
              loading ? /*#__PURE__*/_jsxDEV("span", { className: "inline-block w-10 h-6 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" }, void 0, false) : value }, void 0, false
            ),
            trend && !loading && /*#__PURE__*/
            _jsxDEV("span", { className: `flex items-center text-[10px] font-semibold ${trend.positive ? 'text-emerald-500' : 'text-red-500'}`, children: [
              trend.positive ? /*#__PURE__*/_jsxDEV(ArrowTrendingUpIcon, { className: "h-3 w-3" }, void 0, false) : /*#__PURE__*/_jsxDEV(ArrowTrendingDownIcon, { className: "h-3 w-3" }, void 0, false),
              trend.value, "%"] }, void 0, true
            )] }, void 0, true

          ),
          subtitle && /*#__PURE__*/_jsxDEV("p", { className: "text-[10px] text-gray-400 dark:text-gray-500 mt-0.5", children: subtitle }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: `p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow-md`, children: /*#__PURE__*/
          _jsxDEV(Icon, { className: "h-4 w-4 text-white" }, void 0, false) }, void 0, false
        )] }, void 0, true
      )] }, void 0, true
    ));

}

// Quick Action Button Component
function QuickActionButton({ icon: Icon, label, description, href, gradient





}) {
  return (/*#__PURE__*/
    _jsxDEV(motion.button, {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      onClick: () => window.location.href = href,
      className: "group p-3 rounded-lg bg-white dark:bg-slate-800/80 border border-gray-200/50 dark:border-slate-700/50 hover:border-transparent hover:shadow-md transition-all text-left", children: [/*#__PURE__*/

      _jsxDEV("div", { className: `p-1.5 rounded-lg bg-gradient-to-br ${gradient} w-fit mb-2`, children: /*#__PURE__*/
        _jsxDEV(Icon, { className: "h-3.5 w-3.5 text-white" }, void 0, false) }, void 0, false
      ), /*#__PURE__*/
      _jsxDEV("p", { className: "text-xs font-semibold text-gray-900 dark:text-white", children: label }, void 0, false), /*#__PURE__*/
      _jsxDEV("p", { className: "text-[9px] text-gray-500 dark:text-gray-400 mt-0.5", children: description }, void 0, false)] }, void 0, true
    ));

}


export default function ClusterOverview() {
  const { clusters, activeCluster, setActiveCluster } = useCluster();
  const [selectedNamespace, setSelectedNamespace] = useState('all');

  // Use cached data hook - data is cached per cluster ID
  const {
    data,
    isLoading: loading,
    isRefetching: refreshing,
    error: queryError,
    hardReset
  } = useClusterOverviewData(activeCluster?.id);

  // Destructure cached data with fallbacks
  const clusterHealth = data?.clusterHealth ?? null;
  const namespacesData = data?.namespacesData ?? [];
  const events = data?.events ?? [];
  const securityPosture = data?.securityPosture ?? null;
  const aiInsights = data?.aiInsights ?? [];
  const cpuHistory = data?.cpuHistory ?? [];
  const memoryHistory = data?.memoryHistory ?? [];

  // Derive namespaces list from data
  const namespacesList = useMemo(() => {
    return ['all', ...namespacesData.map((ns) => ns.name)];
  }, [namespacesData]);

  // Convert query error to string
  const error = queryError ? queryError.message : null;

  // AI insights are loaded as part of the main data fetch now
  const aiLoading = loading;

  const handleRefresh = async () => {
    await hardReset();
  };

  const { warnings, errors: errorEvents } = useMemo(() => {
    const warningsList = [];
    const errorsList = [];

    events.forEach((event) => {
      const eventData = {
        message: event.message || event.reason || 'Unknown event',
        resource: `${event.involved_object?.kind || 'resource'}/${event.involved_object?.name || event.name}`,
        time: event.last_timestamp ? new Date(event.last_timestamp).toLocaleString() : 'Time unavailable'
      };

      if (event.type === 'Warning') {
        if (event.reason?.includes('BackOff') || event.reason?.includes('Failed') || event.reason?.includes('Error')) {
          errorsList.push({ type: 'error', ...eventData });
        } else {
          warningsList.push({ type: 'warning', ...eventData });
        }
      }
    });

    return { warnings: warningsList.slice(0, 4), errors: errorsList.slice(0, 4) };
  }, [events]);

  const summaryStats = useMemo(() => {
    const totalPods = namespacesData.reduce((acc, ns) => acc + ns.pods, 0);
    // Use correct property names from ClusterHealth type
    const totalNodes = clusterHealth?.ready_nodes || 0;
    const totalNodesCount = clusterHealth?.node_count || 0;

    return {
      nodes: totalNodesCount > 0 ? `${totalNodes}/${totalNodesCount}` : '-',
      nodesHealthy: totalNodes === totalNodesCount,
      pods: totalPods,
      namespaces: namespacesData.length,
      // Version comes from activeCluster (ClusterInfo), not clusterHealth
      version: activeCluster?.version || '-'
    };
  }, [clusterHealth, namespacesData, activeCluster]);

  const clusterStatus = useMemo(() => {
    if (loading) return { status: 'loading', label: 'Connecting...', color: 'text-gray-500' };
    if (error) return { status: 'error', label: 'Error', color: 'text-red-500' };
    if (clusterHealth?.healthy) return { status: 'healthy', label: 'Healthy', color: 'text-emerald-500' };
    return { status: 'warning', label: 'Warning', color: 'text-amber-500' };
  }, [loading, error, clusterHealth]);

  return (/*#__PURE__*/
    _jsxDEV(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "space-y-4 pb-6", children: [/*#__PURE__*/

      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-900 via-blue-900/80 to-purple-900/60", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2.5 rounded-xl bg-white/10", children: /*#__PURE__*/
              _jsxDEV(CloudIcon, { className: "h-6 w-6 text-white" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV("h1", { className: "text-xl font-bold text-white", children: "Cluster Overview" }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: `flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10`, children: [
                  clusterStatus.status === 'healthy' ? /*#__PURE__*/
                  _jsxDEV(motion.div, { variants: pulseVariants, animate: "pulse", children: /*#__PURE__*/
                    _jsxDEV(SignalSolid, { className: "h-2.5 w-2.5 text-emerald-400" }, void 0, false) }, void 0, false
                  ) :
                  clusterStatus.status === 'loading' ? /*#__PURE__*/
                  _jsxDEV(ArrowPathIcon, { className: "h-2.5 w-2.5 text-gray-400 animate-spin" }, void 0, false) : /*#__PURE__*/

                  _jsxDEV(ExclamationCircleIcon, { className: `h-2.5 w-2.5 ${clusterStatus.color}` }, void 0, false), /*#__PURE__*/

                  _jsxDEV("span", { className: `text-[10px] font-medium ${clusterStatus.status === 'healthy' ? 'text-emerald-400' : clusterStatus.color}`, children:
                    clusterStatus.label }, void 0, false
                  )] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-blue-200/80", children: "Real-time metrics & AI-powered insights" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV("select", {
              value: activeCluster?.id || '',
              onChange: (e) => {
                const cluster = clusters.find((c) => c.id === e.target.value);
                if (cluster) setActiveCluster(cluster.id);
              },
              className: "px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs font-medium text-white", children:

              clusters.map((cluster) => /*#__PURE__*/
              _jsxDEV("option", { value: cluster.id, className: "bg-slate-900", children: cluster.name }, cluster.id, false)
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("select", {
              value: selectedNamespace,
              onChange: (e) => setSelectedNamespace(e.target.value),
              className: "px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs font-medium text-white", children:

              namespacesList.map((ns) => /*#__PURE__*/
              _jsxDEV("option", { value: ns, className: "bg-slate-900", children: ns === 'all' ? 'All NS' : ns }, ns, false)
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: handleRefresh,
              disabled: refreshing,
              className: "p-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-50", children: /*#__PURE__*/

              _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 text-white ${refreshing ? 'animate-spin' : ''}` }, void 0, false) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        error && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, height: 0 },
          animate: { opacity: 1, height: 'auto' },
          exit: { opacity: 0, height: 0 },
          className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV(ExclamationTriangleIcon, { className: "h-5 w-5 text-red-500" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-red-700 dark:text-red-400 flex-1", children: error }, void 0, false), /*#__PURE__*/
            _jsxDEV("button", { onClick: handleRefresh, className: "px-3 py-1 bg-red-600 text-white text-xs rounded-lg", children: "Retry" }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV("div", { className: "grid grid-cols-2 lg:grid-cols-6 gap-3", children: [/*#__PURE__*/
          _jsxDEV(SummaryCard, { title: "Nodes", value: summaryStats.nodes, subtitle: summaryStats.nodesHealthy ? "All healthy" : "Issues", icon: ServerStackIcon, gradient: "from-blue-500 to-blue-600", loading: loading }, void 0, false), /*#__PURE__*/
          _jsxDEV(SummaryCard, { title: "Pods", value: summaryStats.pods, subtitle: "Running", icon: CubeIcon, gradient: "from-emerald-500 to-green-600", loading: loading, trend: { value: 5, positive: true } }, void 0, false), /*#__PURE__*/
          _jsxDEV(SummaryCard, { title: "Namespaces", value: summaryStats.namespaces, subtitle: "Active", icon: TagIcon, gradient: "from-purple-500 to-violet-600", loading: loading }, void 0, false), /*#__PURE__*/
          _jsxDEV(SummaryCard, { title: "Version", value: summaryStats.version, subtitle: "Cluster", icon: CloudIcon, gradient: "from-cyan-500 to-blue-600", loading: loading }, void 0, false), /*#__PURE__*/


          _jsxDEV("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-gray-200/50 dark:border-slate-700/50 p-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
              _jsxDEV(CpuChipIcon, { className: "h-4 w-4 text-blue-500" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400", children: "CPU" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(MiniChart, { data: cpuHistory, color: "blue" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "rounded-xl bg-white dark:bg-slate-900 border border-gray-200/50 dark:border-slate-700/50 p-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
              _jsxDEV(CircleStackIcon, { className: "h-4 w-4 text-purple-500" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400", children: "Memory" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(MiniChart, { data: memoryHistory, color: "purple" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV(GlassCard, { className: "p-4 bg-gradient-to-br from-purple-50/80 via-blue-50/50 to-transparent dark:from-purple-500/10 dark:via-blue-500/5 dark:to-transparent border-purple-200/50 dark:border-purple-500/20", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600", children: /*#__PURE__*/
                _jsxDEV(SparklesIcon, { className: "h-4 w-4 text-white" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: "AI Cluster Insights" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "px-1.5 py-0.5 text-[9px] font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full", children: "AI" }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-[10px] text-gray-500", children: "Intelligent recommendations for your cluster" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => window.location.href = '/optimization',
              className: "text-[10px] font-medium text-purple-600 dark:text-purple-400 hover:underline", children:
              "View All" }, void 0, false

            )] }, void 0, true
          ),

          aiLoading ? /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-center py-8", children: /*#__PURE__*/
            _jsxDEV(motion.div, { animate: { rotate: 360 }, transition: { duration: 2, repeat: Infinity, ease: 'linear' }, children: /*#__PURE__*/
              _jsxDEV(SparklesIcon, { className: "h-6 w-6 text-purple-500" }, void 0, false) }, void 0, false
            ) }, void 0, false
          ) :
          aiInsights.length === 0 ? /*#__PURE__*/
          _jsxDEV("div", { className: "text-center py-6", children: [/*#__PURE__*/
            _jsxDEV(CheckCircleSolid, { className: "h-8 w-8 text-emerald-500 mx-auto mb-1" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs font-medium text-gray-700 dark:text-gray-300", children: "Cluster Healthy" }, void 0, false)] }, void 0, true
          ) : /*#__PURE__*/

          _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2", children:
            aiInsights.map((insight, index) => /*#__PURE__*/
            _jsxDEV(AIInsightCard, { ...insight, index: index }, index, false)
            ) }, void 0, false
          )] }, void 0, true

        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [/*#__PURE__*/

          _jsxDEV(GlassCard, { className: "lg:col-span-2 p-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "p-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600", children: /*#__PURE__*/
                  _jsxDEV(ExclamationTriangleIcon, { className: "h-3.5 w-3.5 text-white" }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: "Cluster Events" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-[10px] text-gray-500", children: "Recent warnings & errors" }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ),
              errorEvents.length + warnings.length > 0 && /*#__PURE__*/
              _jsxDEV("span", { className: "px-2 py-0.5 text-[10px] font-bold bg-red-100 dark:bg-red-500/20 text-red-600 rounded-full", children:
                errorEvents.length + warnings.length }, void 0, false
              )] }, void 0, true

            ),

            loading ? /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-center py-8", children: /*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: "h-6 w-6 animate-spin text-amber-500" }, void 0, false) }, void 0, false
            ) :
            errorEvents.length === 0 && warnings.length === 0 ? /*#__PURE__*/
            _jsxDEV("div", { className: "text-center py-6", children: [/*#__PURE__*/
              _jsxDEV(CheckCircleSolid, { className: "h-8 w-8 text-emerald-500 mx-auto mb-1" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs font-medium text-gray-700 dark:text-gray-300", children: "All Clear" }, void 0, false)] }, void 0, true
            ) : /*#__PURE__*/

            _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto", children: [
              errorEvents.map((e, i) => /*#__PURE__*/_jsxDEV(AlertItem, { ...e }, `e-${i}`, false)),
              warnings.map((w, i) => /*#__PURE__*/_jsxDEV(AlertItem, { ...w }, `w-${i}`, false))] }, void 0, true
            )] }, void 0, true

          ), /*#__PURE__*/


          _jsxDEV(GlassCard, { className: "p-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600", children: /*#__PURE__*/
                  _jsxDEV(ShieldCheckIcon, { className: "h-3.5 w-3.5 text-white" }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: "Security" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-[10px] text-gray-500", children: "Cluster posture" }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("button", { onClick: () => window.location.href = '/security', className: "text-[10px] font-medium text-blue-600 hover:underline", children: "Details" }, void 0, false

              )] }, void 0, true
            ),

            securityPosture ? /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
              _jsxDEV(SecurityScoreRing, { score: securityPosture.security_score?.score || 0 }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "flex-1 space-y-2", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-xs text-gray-500", children: "Critical" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-xs font-bold text-red-600", children: securityPosture.security_score?.critical_issues || 0 }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-xs text-gray-500", children: "High" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-xs font-bold text-amber-600", children: securityPosture.security_score?.high_issues || 0 }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-xs text-gray-500", children: "Medium" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-xs font-bold text-yellow-600", children: securityPosture.security_score?.medium_issues || 0 }, void 0, false)] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            ) : /*#__PURE__*/

            _jsxDEV("div", { className: "text-center py-6", children: [/*#__PURE__*/
              _jsxDEV(ShieldCheckIcon, { className: "h-8 w-8 mx-auto text-gray-300 mb-1" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-[10px] text-gray-500", children: "No data" }, void 0, false)] }, void 0, true
            )] }, void 0, true

          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV(GlassCard, { className: "p-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2 mb-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600", children: /*#__PURE__*/
              _jsxDEV(RocketLaunchIcon, { className: "h-3.5 w-3.5 text-white" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: "Quick Actions" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2", children: [/*#__PURE__*/
            _jsxDEV(QuickActionButton, { icon: CubeIcon, label: "Deploy", description: "New workload", href: "/deploy/yaml", gradient: "from-blue-500 to-blue-600" }, void 0, false), /*#__PURE__*/
            _jsxDEV(QuickActionButton, { icon: ServerStackIcon, label: "Nodes", description: "View nodes", href: "/kubernetes/nodes", gradient: "from-emerald-500 to-green-600" }, void 0, false), /*#__PURE__*/
            _jsxDEV(QuickActionButton, { icon: TagIcon, label: "Namespaces", description: "Manage NS", href: "/namespaces", gradient: "from-purple-500 to-violet-600" }, void 0, false), /*#__PURE__*/
            _jsxDEV(QuickActionButton, { icon: ShieldCheckIcon, label: "Security", description: "Scan cluster", href: "/security", gradient: "from-red-500 to-rose-600" }, void 0, false), /*#__PURE__*/
            _jsxDEV(QuickActionButton, { icon: BoltIcon, label: "Optimize", description: "AI analysis", href: "/optimization", gradient: "from-amber-500 to-orange-600" }, void 0, false), /*#__PURE__*/
            _jsxDEV(QuickActionButton, { icon: LightBulbIcon, label: "Helm", description: "Charts", href: "/deploy/helm", gradient: "from-cyan-500 to-blue-600" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true
    ));

}
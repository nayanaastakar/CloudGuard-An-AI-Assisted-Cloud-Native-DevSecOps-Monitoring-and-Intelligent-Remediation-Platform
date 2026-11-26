import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ServerIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  CpuChipIcon,
  CircleStackIcon,
  CubeIcon,
  SparklesIcon,
  XMarkIcon,
  ExclamationTriangleIcon } from
'@heroicons/react/24/outline';
import GlassCard from '../common/GlassCard';
import useNodesData from '../../hooks/useNodesData';


// Import shared constants
import { containerVariants, itemVariants, COLOR_PALETTE } from '../../utils/constants';
import { chartColors } from '../../styles/design-system';

// Mini Sparkline Chart
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";function MiniSparkline({ data, color, height = 40 }) {
  const max = Math.max(...data, 100);
  const width = 100;

  const points = data.map((value, index) => {
    const x = index / (data.length - 1) * width;
    const y = height - value / max * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = color === 'blue' ? chartColors.primary[0] : chartColors.purple[0];

  return (/*#__PURE__*/
    _jsxDEV("svg", { viewBox: `0 0 ${width} ${height}`, className: "w-full", style: { height }, children: /*#__PURE__*/
      _jsxDEV("polyline", {
        points: points,
        fill: "none",
        stroke: strokeColor,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round" }, void 0, false
      ) }, void 0, false
    ));

}

// KPI Card Component - Uses shared COLOR_PALETTE
function KPICard({
  title,
  value,
  icon: Icon,
  color,
  index






}) {
  // Map to COLOR_PALETTE colors
  const colorMap = {
    blue: 'blue',
    green: 'green',
    red: 'red'
  };
  const colors = COLOR_PALETTE[colorMap[color]];

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.05 }, children: /*#__PURE__*/

      _jsxDEV(GlassCard, { className: "p-4", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: `p-2.5 rounded-xl ${colors.bg}`, children: /*#__PURE__*/
            _jsxDEV(Icon, { className: `h-5 w-5 ${colors.icon}` }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: value }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: title }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ) }, void 0, false
    ));

}

// Progress Bar Component
function ProgressBar({ value, color }) {
  const colorClass = {
    blue: value >= 90 ? 'bg-red-500' : value >= 70 ? 'bg-amber-500' : 'bg-blue-500',
    purple: value >= 90 ? 'bg-red-500' : value >= 70 ? 'bg-amber-500' : 'bg-purple-500',
    amber: value >= 90 ? 'bg-red-500' : value >= 70 ? 'bg-amber-500' : 'bg-amber-500'
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "h-1.5 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { width: 0 },
        animate: { width: `${Math.min(value, 100)}%` },
        transition: { duration: 0.5, ease: 'easeOut' },
        className: `h-full rounded-full ${colorClass[color]}` }, void 0, false
      ) }, void 0, false
    ));

}

// Node Row Component
function NodeRow({
  node,
  metrics,
  podCount,
  isSelected,
  onClick






}) {
  const isReady = node.status === 'Ready';
  const cpuPercent = metrics?.cpu_percent || 0;
  const memPercent = metrics?.memory_percent || 0;

  return (/*#__PURE__*/
    _jsxDEV(motion.tr, {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      onClick: onClick,
      className: `cursor-pointer transition-colors ${
      isSelected ?
      'bg-blue-50 dark:bg-blue-500/10' :
      'hover:bg-gray-50 dark:hover:bg-slate-800/50'}`, children: [/*#__PURE__*/


      _jsxDEV("td", { className: "px-4 py-3", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: `p-2 rounded-xl ${isReady ? 'bg-emerald-100 dark:bg-emerald-500/10' : 'bg-red-100 dark:bg-red-500/10'}`, children: /*#__PURE__*/
            _jsxDEV(ServerIcon, { className: `h-4 w-4 ${isReady ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}` }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: node.name }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: node.internal_ip }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/
      _jsxDEV("td", { className: "px-4 py-3", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-wrap gap-1", children:
          node.roles.map((role) => /*#__PURE__*/
          _jsxDEV("span", { className: "px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full", children:
            role }, role, false
          )
          ) }, void 0, false
        ) }, void 0, false
      ), /*#__PURE__*/
      _jsxDEV("td", { className: "px-4 py-3", children: /*#__PURE__*/
        _jsxDEV("div", { className: "w-24", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex justify-between text-xs mb-1", children: /*#__PURE__*/
            _jsxDEV("span", { className: "text-gray-500", children: [cpuPercent, "%"] }, void 0, true) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV(ProgressBar, { value: cpuPercent, color: "blue" }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/
      _jsxDEV("td", { className: "px-4 py-3", children: /*#__PURE__*/
        _jsxDEV("div", { className: "w-24", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex justify-between text-xs mb-1", children: /*#__PURE__*/
            _jsxDEV("span", { className: "text-gray-500", children: [memPercent, "%"] }, void 0, true) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV(ProgressBar, { value: memPercent, color: "purple" }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/
      _jsxDEV("td", { className: "px-4 py-3 text-sm text-gray-700 dark:text-gray-300", children:
        podCount }, void 0, false
      ), /*#__PURE__*/
      _jsxDEV("td", { className: "px-4 py-3", children: /*#__PURE__*/
        _jsxDEV("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
          isReady ?
          'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
          'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`, children: [

          isReady ? /*#__PURE__*/_jsxDEV(CheckCircleIcon, { className: "h-3 w-3" }, void 0, false) : /*#__PURE__*/_jsxDEV(XCircleIcon, { className: "h-3 w-3" }, void 0, false),
          node.status] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true
    ));

}

// Node Details Drawer
function NodeDrawer({
  node,
  metrics,
  pods,
  onClose





}) {
  const cpuHistory = useMemo(() => [45, 52, 48, 55, 62, 58, 65, 70, 67, 72, 68, metrics?.cpu_percent || 65], [metrics]);
  const memHistory = useMemo(() => [58, 60, 62, 64, 63, 65, 64, 62, 63, 61, 62, metrics?.memory_percent || 62], [metrics]);

  // Use real pods from props
  const runningPods = useMemo(() => pods.filter((p) => p.status === 'Running'), [pods]);

  // Generate AI tips based on real data
  const aiTips = useMemo(() => {
    const tips = [];

    const memPercent = metrics?.memory_percent || 0;
    const cpuPercent = metrics?.cpu_percent || 0;

    if (memPercent > 80) {
      tips.push({ title: 'High memory usage detected', desc: 'Consider adding node capacity or moving workloads', impact: 'high' });
    } else if (memPercent > 60) {
      tips.push({ title: 'Memory usage trending high', desc: 'Monitor for potential capacity issues', impact: 'medium' });
    }

    if (cpuPercent > 80) {
      tips.push({ title: 'High CPU utilization', desc: 'Consider scaling workloads or adding nodes', impact: 'high' });
    }

    if (pods.length > 50) {
      tips.push({ title: 'High pod density', desc: `${pods.length} pods running - consider distribution`, impact: 'medium' });
    }

    if (tips.length === 0) {
      tips.push({ title: 'Node is healthy', desc: 'No immediate optimization needed', impact: 'low' });
    }

    return tips;
  }, [metrics, pods]);

  const impactColors = {
    high: 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400',
    medium: 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
    low: 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
  };

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      transition: { type: 'spring', damping: 25, stiffness: 200 },
      className: "fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto", children: [/*#__PURE__*/


      _jsxDEV("div", { className: "sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 p-4 flex items-center justify-between", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: `p-2 rounded-xl ${node.status === 'Ready' ? 'bg-emerald-100 dark:bg-emerald-500/10' : 'bg-red-100 dark:bg-red-500/10'}`, children: /*#__PURE__*/
            _jsxDEV(ServerIcon, { className: `h-5 w-5 ${node.status === 'Ready' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}` }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: node.name }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: node.internal_ip }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: onClose,
          className: "p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors", children: /*#__PURE__*/

          _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "p-4 space-y-6", children: [/*#__PURE__*/

        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3", children: "Resource Capacity" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "grid grid-cols-2 gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
                _jsxDEV(CpuChipIcon, { className: "h-4 w-4 text-blue-500" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-xs text-gray-600 dark:text-gray-400", children: "CPU" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-lg font-bold text-gray-900 dark:text-white", children: node.capacity.cpu }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-500", children: [metrics?.cpu_percent || 0, "% used"] }, void 0, true)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
                _jsxDEV(CircleStackIcon, { className: "h-4 w-4 text-purple-500" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Memory" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-lg font-bold text-gray-900 dark:text-white", children: node.capacity.memory }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-500", children: [metrics?.memory_percent || 0, "% used"] }, void 0, true)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3", children: "Labels" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex flex-wrap gap-1.5 max-h-24 overflow-y-auto", children:
            Object.entries(node.labels).slice(0, 8).map(([key, value]) => /*#__PURE__*/
            _jsxDEV("span", {

              className: "px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-mono truncate max-w-full", children: [

              key.split('/').pop(), "=", value] }, key, true
            )
            ) }, void 0, false
          )] }, void 0, true
        ),


        node.taints.length > 0 && /*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3", children: "Taints" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex flex-wrap gap-1.5", children:
            node.taints.map((taint, idx) => /*#__PURE__*/
            _jsxDEV("span", {

              className: "px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-medium", children: [

              taint.key, ":", taint.effect] }, idx, true
            )
            ) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/



        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3", children: "Conditions" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-2", children:
            node.conditions.map((condition) => /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-slate-800/50", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: condition.type }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: `text-xs font-medium px-2 py-0.5 rounded-full ${
                condition.status === 'True' && condition.type === 'Ready' ?
                'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                condition.status === 'True' ?
                'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                'bg-gray-100 dark:bg-slate-700 text-gray-500'}`, children:

                condition.status }, void 0, false
              )] }, condition.type, true
            )
            ) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3", children: "Resource Trends (Last Hour)" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-xs text-gray-500", children: "CPU" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-sm font-medium text-blue-600 dark:text-blue-400", children: [cpuHistory[cpuHistory.length - 1], "%"] }, void 0, true)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV(MiniSparkline, { data: cpuHistory, color: "blue", height: 40 }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-xs text-gray-500", children: "Memory" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-sm font-medium text-purple-600 dark:text-purple-400", children: [memHistory[memHistory.length - 1], "%"] }, void 0, true)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV(MiniSparkline, { data: memHistory, color: "purple", height: 40 }, void 0, false)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3", children: ["Running Pods (",
            runningPods.length, ")"] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-2 max-h-48 overflow-y-auto", children:
            runningPods.length === 0 ? /*#__PURE__*/
            _jsxDEV("div", { className: "text-center py-4 text-sm text-gray-500", children: "No running pods on this node" }, void 0, false) :

            runningPods.map((pod, index) => /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-slate-800/50", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2 min-w-0", children: [/*#__PURE__*/
                _jsxDEV(CubeIcon, { className: "h-4 w-4 text-gray-400 flex-shrink-0" }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "min-w-0", children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white truncate", children: pod.name }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500", children: pod.namespace }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "text-right flex-shrink-0", children: /*#__PURE__*/
                _jsxDEV("span", { className: `text-xs px-1.5 py-0.5 rounded ${
                  pod.ready ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600' : 'bg-amber-100 dark:bg-amber-500/10 text-amber-600'}`, children:

                  pod.ready ? 'Ready' : 'Not Ready' }, void 0, false
                ) }, void 0, false
              )] }, pod.name || index, true
            )
            ) }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(SparklesIcon, { className: "h-4 w-4 text-purple-500" }, void 0, false), "AI Optimization Tips"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-2", children:
            aiTips.map((tip, index) => /*#__PURE__*/
            _jsxDEV("div", { className: "p-3 rounded-xl bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-500/5 dark:to-blue-500/5 border border-purple-200/30 dark:border-purple-500/20", children: /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-start justify-between gap-2", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: tip.title }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: tip.desc }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("span", { className: `text-[10px] font-medium px-1.5 py-0.5 rounded-full ${impactColors[tip.impact]}`, children:
                  tip.impact.toUpperCase() }, void 0, false
                )] }, void 0, true
              ) }, index, false
            )
            ) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      )] }, void 0, true
    ));

}


export default function NodesView() {
  const [selectedNode, setSelectedNode] = useState(null);

  // Use cached data hook - prevents refetching on navigation
  const { data, isLoading: loading, refresh } = useNodesData();

  // Destructure data from cache
  const nodes = data?.nodes ?? [];
  const metrics = data?.metrics ?? [];
  const nodePods = data?.nodePods ?? {};

  function getMetricsForNode(nodeName) {
    return metrics.find((m) => m.name === nodeName);
  }

  function getPodsForNode(nodeName) {
    return nodePods[nodeName]?.pods ?? [];
  }

  function getPodCountForNode(nodeName) {
    return nodePods[nodeName]?.count ?? 0;
  }

  const readyNodes = nodes.filter((n) => n.status === 'Ready').length;
  const unhealthyNodes = nodes.length - readyNodes;

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      variants: containerVariants,
      initial: "hidden",
      animate: "visible",
      className: "space-y-6", children: [/*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600", children: /*#__PURE__*/
              _jsxDEV(ServerIcon, { className: "h-6 w-6 text-white" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h1", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: "Nodes" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
                readyNodes, "/", nodes.length, " nodes ready"] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: refresh,
            disabled: loading,
            className: "flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50", children: [/*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${loading ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV("div", { className: "grid grid-cols-3 gap-4", children: [/*#__PURE__*/
          _jsxDEV(KPICard, { title: "Total Nodes", value: nodes.length, icon: ServerIcon, color: "blue", index: 0 }, void 0, false), /*#__PURE__*/
          _jsxDEV(KPICard, { title: "Healthy", value: readyNodes, icon: CheckCircleIcon, color: "green", index: 1 }, void 0, false), /*#__PURE__*/
          _jsxDEV(KPICard, { title: "Unhealthy", value: unhealthyNodes, icon: ExclamationTriangleIcon, color: "red", index: 2 }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV(GlassCard, { className: "overflow-hidden", children: /*#__PURE__*/
          _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
            _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
              _jsxDEV("thead", { children: /*#__PURE__*/
                _jsxDEV("tr", { className: "border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
                  _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Name" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Role" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "CPU" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Memory" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Pods" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Status" }, void 0, false)] }, void 0, true
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700/50", children:
                loading && nodes.length === 0 ? /*#__PURE__*/
                _jsxDEV("tr", { children: /*#__PURE__*/
                  _jsxDEV("td", { colSpan: 6, className: "px-4 py-12 text-center", children: [/*#__PURE__*/
                    _jsxDEV(ArrowPathIcon, { className: "h-8 w-8 mx-auto animate-spin text-blue-500" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "mt-3 text-sm text-gray-500", children: "Loading nodes..." }, void 0, false)] }, void 0, true
                  ) }, void 0, false
                ) :
                nodes.length === 0 ? /*#__PURE__*/
                _jsxDEV("tr", { children: /*#__PURE__*/
                  _jsxDEV("td", { colSpan: 6, className: "px-4 py-12 text-center", children: [/*#__PURE__*/
                    _jsxDEV(ServerIcon, { className: "h-8 w-8 mx-auto text-gray-400" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "mt-3 text-sm text-gray-500", children: "No nodes found" }, void 0, false)] }, void 0, true
                  ) }, void 0, false
                ) :

                nodes.map((node) => /*#__PURE__*/
                _jsxDEV(NodeRow, {

                  node: node,
                  metrics: getMetricsForNode(node.name),
                  podCount: getPodCountForNode(node.name),
                  isSelected: selectedNode?.name === node.name,
                  onClick: () => setSelectedNode(node) }, node.name, false
                )
                ) }, void 0, false

              )] }, void 0, true
            ) }, void 0, false
          ) }, void 0, false
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        selectedNode && /*#__PURE__*/
        _jsxDEV(_Fragment, { children: [/*#__PURE__*/

          _jsxDEV(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className: "fixed inset-0 bg-black/30 backdrop-blur-sm z-40",
            onClick: () => setSelectedNode(null) }, void 0, false
          ), /*#__PURE__*/

          _jsxDEV(NodeDrawer, {
            node: selectedNode,
            metrics: getMetricsForNode(selectedNode.name),
            pods: getPodsForNode(selectedNode.name),
            onClose: () => setSelectedNode(null) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false

      )] }, void 0, true
    ));

}
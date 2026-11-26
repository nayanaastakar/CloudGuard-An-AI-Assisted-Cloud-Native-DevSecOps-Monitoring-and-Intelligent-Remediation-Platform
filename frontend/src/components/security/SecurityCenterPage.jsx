import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  UserGroupIcon,
  LockClosedIcon,
  KeyIcon,
  BugAntIcon,
  CubeIcon,
  EyeIcon,
  ChevronRightIcon } from
'@heroicons/react/24/outline';
import GlassCard from '../common/GlassCard';

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

// Types




























// Security Score Gauge Component
function SecurityScoreGauge({ score }) {
  const getColor = (s) => {
    if (s >= 80) return { stroke: '#379683', bg: 'bg-success-100 dark:bg-success-500/10', text: 'text-success-700 dark:text-success-300' };
    if (s >= 60) return { stroke: '#F59E0B', bg: 'bg-amber-100 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' };
    return { stroke: '#EF4444', bg: 'bg-red-100 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-400' };
  };

  const color = getColor(score);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - score / 100 * circumference;

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "relative w-32 h-32", children: [/*#__PURE__*/
      _jsxDEV("svg", { className: "w-full h-full transform -rotate-90", children: [/*#__PURE__*/
        _jsxDEV("circle", {
          cx: "64",
          cy: "64",
          r: "45",
          stroke: "currentColor",
          strokeWidth: "10",
          fill: "none",
          className: "text-gray-200 dark:text-slate-700" }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV(motion.circle, {
          cx: "64",
          cy: "64",
          r: "45",
          stroke: color.stroke,
          strokeWidth: "10",
          fill: "none",
          strokeLinecap: "round",
          initial: { strokeDashoffset: circumference },
          animate: { strokeDashoffset },
          transition: { duration: 1, ease: 'easeOut' },
          style: { strokeDasharray: circumference } }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [/*#__PURE__*/
        _jsxDEV("span", { className: `text-3xl font-bold ${color.text}`, children: score }, void 0, false), /*#__PURE__*/
        _jsxDEV("span", { className: "text-xs text-gray-500", children: "Score" }, void 0, false)] }, void 0, true
      )] }, void 0, true
    ));

}

// KPI Card Component
function SecurityKPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
  index








}) {
  const colorClasses = {
    red: { bg: 'bg-red-100 dark:bg-red-500/10', icon: 'text-red-600 dark:text-red-400', value: 'text-red-600 dark:text-red-400' },
    amber: { bg: 'bg-amber-100 dark:bg-amber-500/10', icon: 'text-amber-600 dark:text-amber-400', value: 'text-amber-600 dark:text-amber-400' },
    green: { bg: 'bg-emerald-100 dark:bg-blue-500/10', icon: 'text-emerald-600 dark:text-blue-400', value: 'text-emerald-600 dark:text-blue-400' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-500/10', icon: 'text-blue-600 dark:text-violet-400', value: 'text-blue-600 dark:text-violet-400' },
    purple: { bg: 'bg-purple-100 dark:bg-violet-500/10', icon: 'text-purple-600 dark:text-violet-400', value: 'text-purple-600 dark:text-violet-400' }
  };

  const colors = colorClasses[color];

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.05 }, children: /*#__PURE__*/

      _jsxDEV(GlassCard, { className: "p-4 h-full", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-start justify-between", children: [/*#__PURE__*/
          _jsxDEV("div", { className: `p-2.5 rounded-xl ${colors.bg}`, children: /*#__PURE__*/
            _jsxDEV(Icon, { className: `h-5 w-5 ${colors.icon}` }, void 0, false) }, void 0, false
          ),
          trend && /*#__PURE__*/
          _jsxDEV("span", { className: `text-xs font-medium ${trend.direction === 'down' ? 'text-emerald-500' : 'text-red-500'}`, children: [
            trend.direction === 'down' ? '↓' : '↑', " ", Math.abs(trend.value), "%"] }, void 0, true
          )] }, void 0, true

        ), /*#__PURE__*/
        _jsxDEV("div", { className: "mt-3", children: [/*#__PURE__*/
          _jsxDEV("p", { className: `text-2xl font-bold ${colors.value}`, children: value }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: title }, void 0, false),
          subtitle && /*#__PURE__*/_jsxDEV("p", { className: "text-[10px] text-gray-400 mt-0.5", children: subtitle }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Severity Badge
function SeverityBadge({ severity }) {
  const config = {
    critical: { bg: 'bg-red-100 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-400' },
    high: { bg: 'bg-orange-100 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400' },
    medium: { bg: 'bg-amber-100 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
    low: { bg: 'bg-blue-100 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-violet-400' }
  };

  const { bg, text } = config[severity];

  return (/*#__PURE__*/
    _jsxDEV("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`, children:
      severity.toUpperCase() }, void 0, false
    ));

}

// Simple RBAC Visualization
function RBACVisualization({ nodes }) {
  const typeColors = {
    user: 'bg-blue-500',
    group: 'bg-purple-500',
    serviceAccount: 'bg-emerald-500',
    role: 'bg-amber-500',
    clusterRole: 'bg-red-500'
  };

  const typeIcons = {
    user: UserGroupIcon,
    group: UserGroupIcon,
    serviceAccount: KeyIcon,
    role: LockClosedIcon,
    clusterRole: ShieldCheckIcon
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-3", children:
      nodes.map((node, idx) => {
        const Icon = typeIcons[node.type];
        return (/*#__PURE__*/
          _jsxDEV(motion.div, {

            initial: { opacity: 0, x: -10 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: idx * 0.05 },
            className: "flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer", children: [/*#__PURE__*/

            _jsxDEV("div", { className: `p-2 rounded-lg ${typeColors[node.type]}/10`, children: /*#__PURE__*/
              _jsxDEV(Icon, { className: `h-4 w-4 ${typeColors[node.type].replace('bg-', 'text-')}` }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white truncate", children: node.name }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-xs text-gray-500 capitalize", children: node.type.replace(/([A-Z])/g, ' $1').trim() }, void 0, false),
                node.namespace && /*#__PURE__*/
                _jsxDEV("span", { className: "text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-gray-500", children:
                  node.namespace }, void 0, false
                )] }, void 0, true

              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-1", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-xs text-gray-400", children: [node.bindings.length, " bindings"] }, void 0, true), /*#__PURE__*/
              _jsxDEV(ChevronRightIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false)] }, void 0, true
            )] }, node.id, true
          ));

      }) }, void 0, false
    ));

}

// Image Vulnerability Chart
function ImageVulnerabilityChart({ images }) {
  const maxTotal = Math.max(...images.map((i) => i.critical + i.high + i.medium + i.low));

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-3", children:
      images.map((image, idx) => {
        const total = image.critical + image.high + image.medium + image.low;
        const criticalWidth = image.critical / maxTotal * 100;
        const highWidth = image.high / maxTotal * 100;
        const mediumWidth = image.medium / maxTotal * 100;
        const lowWidth = image.low / maxTotal * 100;

        return (/*#__PURE__*/
          _jsxDEV(motion.div, {

            initial: { opacity: 0, x: 10 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: idx * 0.05 },
            className: "p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white truncate max-w-[70%]", children: image.image }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs text-gray-400", children: [total, " issues"] }, void 0, true)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "h-2 flex rounded-full overflow-hidden bg-gray-200 dark:bg-slate-700", children: [
              image.critical > 0 && /*#__PURE__*/
              _jsxDEV(motion.div, {
                initial: { width: 0 },
                animate: { width: `${criticalWidth}%` },
                className: "bg-red-500",
                title: `${image.critical} critical` }, void 0, false
              ),

              image.high > 0 && /*#__PURE__*/
              _jsxDEV(motion.div, {
                initial: { width: 0 },
                animate: { width: `${highWidth}%` },
                className: "bg-orange-500",
                title: `${image.high} high` }, void 0, false
              ),

              image.medium > 0 && /*#__PURE__*/
              _jsxDEV(motion.div, {
                initial: { width: 0 },
                animate: { width: `${mediumWidth}%` },
                className: "bg-amber-500",
                title: `${image.medium} medium` }, void 0, false
              ),

              image.low > 0 && /*#__PURE__*/
              _jsxDEV(motion.div, {
                initial: { width: 0 },
                animate: { width: `${lowWidth}%` },
                className: "bg-blue-500",
                title: `${image.low} low` }, void 0, false
              )] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3 mt-2 text-[10px] text-gray-500", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "flex items-center gap-1", children: [/*#__PURE__*/_jsxDEV("span", { className: "w-2 h-2 rounded-full bg-red-500" }, void 0, false), " ", image.critical, " Critical"] }, void 0, true), /*#__PURE__*/
              _jsxDEV("span", { className: "flex items-center gap-1", children: [/*#__PURE__*/_jsxDEV("span", { className: "w-2 h-2 rounded-full bg-orange-500" }, void 0, false), " ", image.high, " High"] }, void 0, true), /*#__PURE__*/
              _jsxDEV("span", { className: "flex items-center gap-1", children: [/*#__PURE__*/_jsxDEV("span", { className: "w-2 h-2 rounded-full bg-amber-500" }, void 0, false), " ", image.medium, " Med"] }, void 0, true), /*#__PURE__*/
              _jsxDEV("span", { className: "flex items-center gap-1", children: [/*#__PURE__*/_jsxDEV("span", { className: "w-2 h-2 rounded-full bg-blue-500" }, void 0, false), " ", image.low, " Low"] }, void 0, true)] }, void 0, true
            )] }, image.image, true
          ));

      }) }, void 0, false
    ));

}

// AI Security Suggestion Component
function AISecuritySuggestion({
  title,
  description,
  priority,
  action,
  index






}) {
  const priorityColors = {
    critical: 'border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5',
    high: 'border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5',
    medium: 'border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5'
  };

  const badgeColors = {
    critical: 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400',
    high: 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
    medium: 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-violet-400'
  };

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.1 },
      className: `p-4 rounded-xl border ${priorityColors[priority]}`, children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex items-start justify-between gap-3", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-start gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20", children: /*#__PURE__*/
            _jsxDEV(SparklesIcon, { className: "h-4 w-4 text-purple-600 dark:text-violet-400" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: title }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: description }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("span", { className: `text-[10px] font-medium px-2 py-0.5 rounded-full ${badgeColors[priority]}`, children:
          priority.toUpperCase() }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV(motion.button, {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        className: "mt-3 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors", children:

        action }, void 0, false
      )] }, void 0, true
    ));

}

export default function SecurityCenterPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  // Mock data
  const [violations] = useState([
  { id: '1', title: 'Privileged container detected', description: 'Pod running with privileged: true', severity: 'critical', category: 'container', resource: 'monitoring/prometheus-0', namespace: 'monitoring', detected: '2h ago' },
  { id: '2', title: 'No network policy', description: 'Namespace has no network policies configured', severity: 'high', category: 'network', resource: 'production', namespace: 'production', detected: '1d ago' },
  { id: '3', title: 'Secret exposed in env', description: 'Database password visible in environment variables', severity: 'critical', category: 'secret', resource: 'api-server', namespace: 'production', detected: '4h ago' },
  { id: '4', title: 'Over-permissive RBAC', description: 'Service account has cluster-admin role', severity: 'high', category: 'rbac', resource: 'default/jenkins-sa', namespace: 'default', detected: '3d ago' },
  { id: '5', title: 'Missing resource limits', description: 'Container has no CPU/memory limits set', severity: 'medium', category: 'container', resource: 'worker-deployment', namespace: 'batch', detected: '5h ago' },
  { id: '6', title: 'Pod security policy violation', description: 'Host network access enabled', severity: 'high', category: 'compliance', resource: 'ingress-nginx', namespace: 'ingress', detected: '12h ago' }]
  );

  const [rbacNodes] = useState([
  { id: '1', type: 'serviceAccount', name: 'default', namespace: 'kube-system', bindings: ['cluster-admin'] },
  { id: '2', type: 'serviceAccount', name: 'jenkins-sa', namespace: 'default', bindings: ['edit', 'view'] },
  { id: '3', type: 'user', name: 'admin@example.com', bindings: ['cluster-admin'] },
  { id: '4', type: 'group', name: 'developers', bindings: ['edit'] },
  { id: '5', type: 'clusterRole', name: 'cluster-admin', bindings: ['*'] }]
  );

  const [imageVulnerabilities] = useState([
  { image: 'nginx:1.19', critical: 3, high: 12, medium: 25, low: 8, lastScanned: '2h ago' },
  { image: 'postgres:13', critical: 1, high: 5, medium: 18, low: 12, lastScanned: '4h ago' },
  { image: 'redis:6', critical: 0, high: 2, medium: 8, low: 15, lastScanned: '1h ago' },
  { image: 'node:16', critical: 5, high: 18, medium: 42, low: 23, lastScanned: '6h ago' }]
  );

  const [aiSuggestions] = useState([
  { title: 'Remove privileged containers', description: 'Drop CAP_SYS_ADMIN and use specific capabilities instead', priority: 'critical', action: 'Apply Fix' },
  { title: 'Enable Pod Security Standards', description: 'Enforce restricted PSS profile across production namespaces', priority: 'high', action: 'Configure' },
  { title: 'Implement network segmentation', description: 'Create network policies to isolate workloads by tier', priority: 'medium', action: 'Generate Policies' }]
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate stats
  const stats = useMemo(() => ({
    securityScore: 72,
    criticalViolations: violations.filter((v) => v.severity === 'critical').length,
    highViolations: violations.filter((v) => v.severity === 'high').length,
    privilegedPods: 3,
    totalVulnerabilities: imageVulnerabilities.reduce((acc, i) => acc + i.critical + i.high, 0)
  }), [violations, imageVulnerabilities]);

  // Filter violations
  const filteredViolations = violations.filter((v) => {
    const matchesSearch = !searchQuery || v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.resource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || v.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  if (loading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center h-96", children: /*#__PURE__*/
        _jsxDEV(ArrowPathIcon, { className: "h-8 w-8 animate-spin text-blue-500" }, void 0, false) }, void 0, false
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
            _jsxDEV("div", { className: "p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-orange-600", children: /*#__PURE__*/
              _jsxDEV(ShieldCheckIcon, { className: "h-6 w-6 text-white" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h1", { className: "text-xl font-semibold text-gray-900 dark:text-white", children: "Security Center" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Monitor and manage cluster security posture" }, void 0, false

              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            className: "flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25", children: [/*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: "h-4 w-4" }, void 0, false), "Scan Now"] }, void 0, true

          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV("div", { className: "grid grid-cols-2 lg:grid-cols-5 gap-4", children: [/*#__PURE__*/

          _jsxDEV(GlassCard, { className: "col-span-2 lg:col-span-1 p-4 flex flex-col items-center justify-center", children: [/*#__PURE__*/
            _jsxDEV(SecurityScoreGauge, { score: stats.securityScore }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500 mt-2", children: "Security Score" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV(SecurityKPICard, {
            title: "Critical Issues",
            value: stats.criticalViolations,
            icon: ShieldExclamationIcon,
            color: "red",
            trend: { value: 15, direction: 'down' },
            index: 1 }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV(SecurityKPICard, {
            title: "High Issues",
            value: stats.highViolations,
            icon: ExclamationTriangleIcon,
            color: "amber",
            index: 2 }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV(SecurityKPICard, {
            title: "Privileged Pods",
            value: stats.privilegedPods,
            icon: LockClosedIcon,
            color: "purple",
            index: 3 }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV(SecurityKPICard, {
            title: "Vulnerabilities",
            value: stats.totalVulnerabilities,
            subtitle: "Critical + High",
            icon: BugAntIcon,
            color: "blue",
            index: 4 }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [/*#__PURE__*/

          _jsxDEV(GlassCard, { className: "overflow-hidden", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-4 border-b border-gray-200/50 dark:border-slate-700/50 flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV(UserGroupIcon, { className: "h-5 w-5 text-purple-600 dark:text-violet-400" }, void 0, false), /*#__PURE__*/
                _jsxDEV("h2", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: "RBAC Overview" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("button", { className: "text-xs text-primary-600 dark:text-primary-400 hover:underline", children: "View Graph" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "p-4 max-h-80 overflow-y-auto", children: /*#__PURE__*/
              _jsxDEV(RBACVisualization, { nodes: rbacNodes }, void 0, false) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV(GlassCard, { className: "overflow-hidden", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-4 border-b border-gray-200/50 dark:border-slate-700/50 flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV(CubeIcon, { className: "h-5 w-5 text-blue-600 dark:text-violet-400" }, void 0, false), /*#__PURE__*/
                _jsxDEV("h2", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: "Image Vulnerabilities" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("button", { className: "text-xs text-primary-600 dark:text-primary-400 hover:underline", children: "Full Report" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "p-4 max-h-80 overflow-y-auto", children: /*#__PURE__*/
              _jsxDEV(ImageVulnerabilityChart, { images: imageVulnerabilities }, void 0, false) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV(GlassCard, { className: "overflow-hidden", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-4 border-b border-gray-200/50 dark:border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(ExclamationTriangleIcon, { className: "h-5 w-5 text-amber-600 dark:text-amber-400" }, void 0, false), /*#__PURE__*/
              _jsxDEV("h2", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: "Security Violations" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs px-2 py-0.5 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full", children:
                filteredViolations.length }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3 w-full sm:w-auto", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "relative flex-1 sm:w-64", children: [/*#__PURE__*/
                _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
                _jsxDEV("input", {
                  type: "text",
                  placeholder: "Search violations...",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  className: "w-full pl-10 pr-4 py-2 text-sm border border-gray-200/50 dark:border-slate-700/50 rounded-xl bg-white/80 dark:bg-slate-800/80" }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("select", {
                value: severityFilter,
                onChange: (e) => setSeverityFilter(e.target.value),
                className: "px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-700/50 rounded-xl bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300", children: [/*#__PURE__*/

                _jsxDEV("option", { value: "all", children: "All Severities" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "critical", children: "Critical" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "high", children: "High" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "medium", children: "Medium" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "low", children: "Low" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
            _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
              _jsxDEV("thead", { children: /*#__PURE__*/
                _jsxDEV("tr", { className: "border-b border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50", children: [/*#__PURE__*/
                  _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Violation" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Severity" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Category" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Resource" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Detected" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Actions" }, void 0, false)] }, void 0, true
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700/50", children:
                filteredViolations.map((violation) => /*#__PURE__*/
                _jsxDEV(motion.tr, {

                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: "hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors", children: [/*#__PURE__*/

                  _jsxDEV("td", { className: "px-4 py-3", children: /*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: violation.title }, void 0, false), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: violation.description }, void 0, false)] }, void 0, true
                    ) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("td", { className: "px-4 py-3", children: /*#__PURE__*/
                    _jsxDEV(SeverityBadge, { severity: violation.severity }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("td", { className: "px-4 py-3", children: /*#__PURE__*/
                    _jsxDEV("span", { className: "text-xs px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-lg capitalize", children:
                      violation.category }, void 0, false
                    ) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("td", { className: "px-4 py-3", children: /*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm text-gray-700 dark:text-gray-300 font-mono", children: violation.resource }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("td", { className: "px-4 py-3 text-sm text-gray-500 dark:text-gray-400", children:
                    violation.detected }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("td", { className: "px-4 py-3 text-right", children: /*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.1 },
                      whileTap: { scale: 0.9 },
                      className: "p-2 text-gray-400 hover:text-blue-600 dark:hover:text-violet-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20", children: /*#__PURE__*/

                      _jsxDEV(EyeIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                    ) }, void 0, false
                  )] }, violation.id, true
                )
                ) }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV(GlassCard, { className: "overflow-hidden", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-4 border-b border-gray-200/50 dark:border-slate-700/50 flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-1.5 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20", children: /*#__PURE__*/
              _jsxDEV(SparklesIcon, { className: "h-4 w-4 text-purple-600 dark:text-violet-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("h2", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: "AI Security Recommendations" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "p-4 grid grid-cols-1 lg:grid-cols-3 gap-4", children:
            aiSuggestions.map((suggestion, idx) => /*#__PURE__*/
            _jsxDEV(AISecuritySuggestion, { ...suggestion, index: idx }, idx, false)
            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true
    ));

}
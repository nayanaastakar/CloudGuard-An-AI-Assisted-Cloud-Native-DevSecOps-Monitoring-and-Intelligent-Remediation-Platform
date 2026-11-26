import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  SignalIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  BellAlertIcon,
  DocumentTextIcon,
  CpuChipIcon,
  CircleStackIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  Cog6ToothIcon,
  RocketLaunchIcon,
  ServerIcon } from
'@heroicons/react/24/outline';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart } from
'recharts';
import PageHeader from '../common/PageHeader';
import { kubernetesApi, aiApi } from '../../services/api';
import { prometheusApi } from '../../services/prometheusApi';
import { logger } from '../../utils/logger';
import { useWebSocketLogs } from '../../hooks/useWebSocketLogs';
import { chartColors } from '../../styles/design-system';



// Import shared constants
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
































// Helper to convert K8s event to Alert
function eventToAlert(event) {
  const severity = event.type === 'Warning' ?
  event.reason?.includes('Failed') || event.reason?.includes('Error') || event.reason?.includes('Kill') ? 'critical' : 'warning' : 'info';

  const isResolved = event.reason?.includes('Pulled') || event.reason?.includes('Started') ||
  event.reason?.includes('Created') || event.reason?.includes('Scheduled');

  return {
    id: event.name,
    title: `${event.reason}: ${event.involved_object?.name || 'Unknown'}`,
    severity,
    source: event.involved_object?.kind || 'Kubernetes',
    timestamp: event.last_timestamp || event.first_timestamp || 'Unknown',
    status: isResolved ? 'resolved' : 'firing',
    description: event.message,
    workloadName: event.involved_object?.name,
    namespace: event.namespace
  };
}

// Helper to convert K8s event to LogEntry
function eventToLog(event, index) {
  const level = event.type === 'Warning' ?
  event.reason?.includes('Failed') || event.reason?.includes('Error') ? 'error' : 'warn' : 'info';

  return {
    id: `${event.name}-${index}`,
    timestamp: event.last_timestamp || event.first_timestamp || new Date().toISOString(),
    level,
    source: event.involved_object?.name || 'Unknown',
    message: event.message,
    namespace: event.namespace
  };
}

// Helper to format timestamp
function formatTimestamp(timestamp) {
  if (!timestamp) return 'Unknown';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
  return date.toLocaleDateString();
}

// Mini Sparkline Component

// Chart data types










function getHttpStatus(error) {
  if (typeof error !== 'object' || error === null || !('response' in error)) return undefined;
  const response = error.response;
  if (typeof response !== 'object' || response === null || !('status' in response)) return undefined;
  return typeof response.status === 'number' ? response.status : undefined;
}

export default function MonitoringDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'metrics';
  const [alertFilter, setAlertFilter] = useState('all');
  const [logSearch, setLogSearch] = useState('');
  const [logLevel, setLogLevel] = useState('all');

  // Real data state
  const [metrics, setMetrics] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [metricsSourceStatus, setMetricsSourceStatus] = useState('unavailable');
  const [metricsTimestamp, setMetricsTimestamp] = useState(null);
  const [metricsCheckedAt, setMetricsCheckedAt] = useState(null);

  // Prometheus state
  const [, setPrometheusStatus] = useState(null);
  const [prometheusAvailable, setPrometheusAvailable] = useState(false);
  const [cpuChartData, setCpuChartData] = useState([]);
  const [memoryChartData, setMemoryChartData] = useState([]);
  const [prometheusAlerts, setPrometheusAlerts] = useState([]);

  // Chart controls (NEW)
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [selectedMetric, setSelectedMetric] = useState('cpu');

  // Pod Logs state (NEW)
  const [logSource, setLogSource] = useState('events');
  const [pods, setPods] = useState([]);
  const [selectedPod, setSelectedPod] = useState(null);
  const [selectedContainer, setSelectedContainer] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState('default');
  const [podLogsStreaming, setPodLogsStreaming] = useState(false);

  // AI Log Summary state (NEW)
  const [aiSummary, setAiSummary] = useState(




    null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [lastSummaryTime, setLastSummaryTime] = useState(null);

  // WebSocket logs hook (only enabled when viewing pod logs)
  const {
    logs: wsLogs,
    error: wsError,
    disconnect: wsDisconnect,
    clearLogs: wsClearLogs
  } = useWebSocketLogs({
    namespace: selectedNamespace,
    podName: selectedPod?.name || '',
    container: selectedContainer,
    tailLines: 500,
    timestamps: true,
    enabled: logSource === 'pods' && !!selectedPod && podLogsStreaming
  });

  // Check Prometheus status
  const checkPrometheusStatus = useCallback(async () => {
    try {
      const response = await prometheusApi.getStackStatus();
      setPrometheusStatus(response.data);
      setPrometheusAvailable(response.data.status === 'running');
      return response.data.status === 'running';
    } catch {
      setPrometheusAvailable(false);
      return false;
    }
  }, []);

  // Fetch Prometheus metrics for charts
  const fetchPrometheusData = useCallback(async () => {
    try {
      const now = new Date();

      // Calculate time range and step based on selection
      const timeRangeConfig = {
        '1h': { milliseconds: 60 * 60 * 1000, step: '60s' },
        '6h': { milliseconds: 6 * 60 * 60 * 1000, step: '5m' },
        '24h': { milliseconds: 24 * 60 * 60 * 1000, step: '15m' }
      };

      const config = timeRangeConfig[selectedTimeRange];
      const startTime = new Date(now.getTime() - config.milliseconds);

      // Query based on selected metric
      const query = selectedMetric === 'cpu' ?
      '100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)' :
      '(1 - (sum(node_memory_MemAvailable_bytes) / sum(node_memory_MemTotal_bytes))) * 100';

      // Fetch metric data and alerts in parallel
      const [metricRes, alertsRes] = await Promise.all([
      prometheusApi.queryRange({
        query,
        start: startTime.toISOString(),
        end: now.toISOString(),
        step: config.step
      }).catch(() => null),
      prometheusApi.getAlerts().catch(() => null)]
      );

      // Process metric data
      if (metricRes?.data?.result?.[0]?.values) {
        const data = metricRes.data.result[0].values.map((v) => ({
          timestamp: v.timestamp,
          time: new Date(v.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          [selectedMetric]: parseFloat(v.value)
        }));

        // Store in appropriate state based on metric type
        if (selectedMetric === 'cpu') {
          setCpuChartData(data);
        } else {
          setMemoryChartData(data);
        }
      }

      // Process Prometheus alerts
      if (alertsRes?.data?.alerts) {
        setPrometheusAlerts(alertsRes.data.alerts);
      }
    } catch (err) {
      logger.error('Failed to fetch Prometheus data', err);
    }
  }, [selectedTimeRange, selectedMetric]);

  // Fetch data from APIs
  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);else
      setLoading(true);
      setError(null);

      // Check Prometheus status first
      const promAvailable = await checkPrometheusStatus();

      // Fetch cluster metrics, events, and pods
      let metricsRequestError = null;
      const metricsRequest = kubernetesApi.getClusterMetrics().catch((requestError) => {
        metricsRequestError = requestError;
        return null;
      });
      const [metricsRes, eventsRes, podsRes] = await Promise.all([
      metricsRequest,
      kubernetesApi.getEvents(undefined, 100).catch(() => null),
      kubernetesApi.getPods().catch(() => null)]
      );

      setMetricsCheckedAt(new Date().toISOString());
      if (metricsRes?.data) {
        setMetricsSourceStatus('live');
        setMetricsTimestamp(metricsRes.data.timestamp);
      } else {
        setMetricsTimestamp(null);
        const statusCode = getHttpStatus(metricsRequestError);
        setMetricsSourceStatus(
          !metricsRequestError || statusCode === 503 ? 'unavailable' : 'error'
        );
      }

      if (!metricsRes || !podsRes) {
        setError('Kubernetes metrics or pod data is unavailable. No live resource metrics are being displayed.');
      }

      // Process metrics
      if (metricsRes?.data && podsRes?.data) {
        const m = metricsRes.data;
        const pods = podsRes.data;

        // Calculate pod restarts
        const totalRestarts = pods.reduce((sum, pod) => sum + (pod.restarts || 0), 0);
        const problematicPods = pods.filter((pod) => (pod.restarts || 0) > 3).length;
        const restartsStatus = problematicPods > 10 ? 'critical' : problematicPods > 3 ? 'warning' : 'healthy';

        // Calculate firing alerts (will be updated after events are processed)
        const firingAlertsCount = alerts.filter((a) => a.status === 'firing').length;

        const newMetrics = [
        {
          name: 'CPU Usage',
          value: Math.round(m.cpu_percent).toString(),
          unit: '%',
          change: 0,
          trend: m.nodes.map((n) => n.cpu_percent),
          status: m.cpu_percent > 85 ? 'critical' : m.cpu_percent > 70 ? 'warning' : 'healthy'
        },
        {
          name: 'Memory Usage',
          value: Math.round(m.memory_percent).toString(),
          unit: '%',
          change: 0,
          trend: m.nodes.map((n) => n.memory_percent),
          status: m.memory_percent > 85 ? 'critical' : m.memory_percent > 70 ? 'warning' : 'healthy'
        },
        {
          name: 'Pod Restarts',
          value: `${totalRestarts} total`,
          unit: `(${problematicPods} pods with issues)`,
          change: 0,
          trend: pods.slice(0, 9).map((p) => p.restarts || 0),
          status: restartsStatus
        },
        {
          name: 'Active Alerts',
          value: firingAlertsCount.toString(),
          unit: 'firing',
          change: 0,
          trend: Array(9).fill(firingAlertsCount),
          status: firingAlertsCount > 5 ? 'critical' : firingAlertsCount > 0 ? 'warning' : 'healthy',
          clickable: true,
          onClick: () => {
            setSearchParams({ tab: 'alerts' });
          }
        }];

        setMetrics(newMetrics);

        // Store pods for pod selector dropdown
        setPods(pods);
      }

      // Process events into alerts and logs
      if (eventsRes?.data) {
        const events = eventsRes.data;

        // Convert to alerts (filter Warning events)
        const newAlerts = events.
        filter((e) => e.type === 'Warning' || e.count > 1).
        slice(0, 20).
        map(eventToAlert);
        setAlerts(newAlerts);

        // Convert to logs (all events)
        const newLogs = events.slice(0, 50).map(eventToLog);
        setLogs(newLogs);
      }

      // Fetch Prometheus data if available
      if (promAvailable) {
        await fetchPrometheusData();
      }
    } catch (err) {
      logger.error('Failed to fetch monitoring data', err);
      setMetricsSourceStatus('error');
      setMetricsTimestamp(null);
      setMetricsCheckedAt(new Date().toISOString());
      setError('Failed to fetch monitoring data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [checkPrometheusStatus, fetchPrometheusData]);

  // Initial fetch and polling
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Fetch AI Summary
  const fetchAISummary = useCallback(async () => {
    try {
      setAiSummaryLoading(true);
      const response = await aiApi.summarizeLogs(undefined, 10);
      if (response.data && response.data.success) {
        setAiSummary({
          summary: response.data.summary,
          error_count: response.data.error_count,
          time_window: response.data.time_window,
          key_issues: response.data.key_issues
        });
        setLastSummaryTime(new Date());
      }
    } catch (error) {
      logger.error('Failed to fetch AI summary:', error);
    } finally {
      setAiSummaryLoading(false);
    }
  }, []);

  // Auto-refresh AI summary when Logs tab is active
  useEffect(() => {
    if (activeTab === 'logs' && logSource === 'events') {
      fetchAISummary();
      const interval = setInterval(fetchAISummary, 2 * 60 * 1000); // 2 minutes
      return () => clearInterval(interval);
    }
  }, [activeTab, logSource, fetchAISummary]);

  // Tab badge for alerts
  const firingAlerts = alerts.filter((a) => a.status === 'firing').length;
  const tabs = [
  { id: 'metrics', label: 'Metrics', icon: ChartBarIcon },
  { id: 'alerts', label: 'Alerts', icon: BellAlertIcon, badge: firingAlerts },
  { id: 'logs', label: 'Logs', icon: DocumentTextIcon }];


  const getMetricIcon = (name) => {
    if (name.includes('CPU')) return CpuChipIcon;
    if (name.includes('Memory') || name.includes('Disk')) return CircleStackIcon;
    if (name.includes('Network')) return GlobeAltIcon;
    return SignalIcon;
  };


  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'critical':return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' };
      case 'warning':return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' };
      case 'info':return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-violet-400', border: 'border-blue-200 dark:border-blue-800' };
      default:return { bg: 'bg-gray-100 dark:bg-slate-950/30', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-800' };
    }
  };

  const getLogLevelStyles = (level) => {
    switch (level) {
      case 'error':return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      case 'warn':return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
      case 'info':return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-violet-400';
      case 'debug':return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
      default:return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (alertFilter === 'all') return true;
    if (alertFilter === 'firing') return alert.status === 'firing';
    if (alertFilter === 'resolved') return alert.status === 'resolved';
    return true;
  });

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = logSearch === '' || log.message.toLowerCase().includes(logSearch.toLowerCase()) || log.source.toLowerCase().includes(logSearch.toLowerCase());
    const matchesLevel = logLevel === 'all' || log.level === logLevel;
    return matchesSearch && matchesLevel;
  });

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV(PageHeader, {
        title: "Monitoring & Logs",
        description: "Real-time metrics, alerts, and log aggregation",
        icon: SignalIcon,
        iconColor: "green",
        actions: /*#__PURE__*/
        _jsxDEV(motion.button, {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          onClick: () => fetchData(true),
          disabled: refreshing,
          className: "flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50", children: [/*#__PURE__*/

          _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${refreshing ? 'animate-spin' : ''}` }, void 0, false),
          refreshing ? 'Refreshing...' : 'Refresh'] }, void 0, true
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV("div", { className: "sticky top-[72px] z-10 -mx-4 lg:-mx-6 px-4 lg:px-6 py-3 bg-gradient-to-r from-slate-50/95 via-white/95 to-slate-50/95 dark:from-slate-900/95 dark:via-slate-900/95 dark:to-slate-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex gap-2", children:
          tabs.map((tab) => /*#__PURE__*/
          _jsxDEV("button", {

            onClick: () => setSearchParams({ tab: tab.id }),
            className: `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === tab.id ?
            'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25' :
            'bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200/50 dark:border-slate-700/50'}`, children: [/*#__PURE__*/


            _jsxDEV(tab.icon, { className: "h-4 w-4" }, void 0, false),
            tab.label,
            tab.badge && tab.badge > 0 && /*#__PURE__*/
            _jsxDEV("span", { className: `px-1.5 py-0.5 text-[10px] rounded-full ${
              activeTab === tab.id ? 'bg-white/20' : 'bg-red-500/20 text-red-600 dark:text-red-400'}`, children:

              tab.badge }, void 0, false
            )] }, tab.id, true

          )
          ) }, void 0, false
        ) }, void 0, false
      ),

      !loading && /*#__PURE__*/
      _jsxDEV("div", {
        role: "status",
        className: `rounded-lg border px-4 py-3 text-sm ${
        metricsSourceStatus === 'live' ?
        'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300' :
        metricsSourceStatus === 'error' ?
        'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300' :
        'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300'}`, children: [/*#__PURE__*/


        _jsxDEV("strong", { children: metricsSourceStatus.toUpperCase() }, void 0, false),
        ' · Source: Kubernetes Metrics API',
        metricsTimestamp && ` · Data timestamp: ${new Date(metricsTimestamp).toLocaleString()}`,
        metricsCheckedAt && ` · Checked: ${new Date(metricsCheckedAt).toLocaleString()}`,
        metricsSourceStatus === 'unavailable' && ' · No sample values are substituted.'] }, void 0, true
      ),



      loading && /*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center py-12", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-col items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV(ArrowPathIcon, { className: "h-8 w-8 text-green-500 animate-spin" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Loading monitoring data..." }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ),



      error && !loading && /*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center py-12", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-col items-center gap-3 text-center", children: [/*#__PURE__*/
          _jsxDEV(ExclamationTriangleIcon, { className: "h-8 w-8 text-amber-500" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: error }, void 0, false), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => fetchData(),
            className: "mt-2 px-4 py-2 text-sm font-medium rounded-lg bg-green-500 text-white hover:bg-green-600", children:
            "Retry" }, void 0, false

          )] }, void 0, true
        ) }, void 0, false
      ),



      !loading && !error && activeTab === 'metrics' && /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
          metrics.length === 0 ? /*#__PURE__*/
          _jsxDEV("div", { className: "col-span-full text-center py-8 text-gray-500 dark:text-gray-400", children: "No metrics available. Connect to a Kubernetes cluster to view metrics." }, void 0, false

          ) :
          null,
          metrics.map((metric, index) => {
            const Icon = getMetricIcon(metric.name);
            const isPositive = metric.change >= 0;
            return (/*#__PURE__*/
              _jsxDEV(motion.div, {

                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: index * 0.05 },
                onClick: metric.clickable ? metric.onClick : undefined,
                className: `p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 ${
                metric.clickable ? 'cursor-pointer hover:shadow-lg hover:scale-105 transition-all' : ''}`, children: [/*#__PURE__*/


                _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "p-1.5 rounded-lg bg-gray-100 dark:bg-slate-700", children: /*#__PURE__*/
                      _jsxDEV(Icon, { className: "h-4 w-4 text-gray-500" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400", children: metric.name }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: `w-2 h-2 rounded-full ${
                    metric.status === 'healthy' ? 'bg-green-500' : metric.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}` }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-end justify-between", children: /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: metric.value }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm text-gray-500 dark:text-gray-400 ml-1", children: metric.unit }, void 0, false)] }, void 0, true
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { className: `flex items-center gap-1 mt-2 text-xs ${
                  isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`, children: [

                  isPositive ? /*#__PURE__*/
                  _jsxDEV(ArrowTrendingUpIcon, { className: "h-3 w-3" }, void 0, false) : /*#__PURE__*/

                  _jsxDEV(ArrowTrendingDownIcon, { className: "h-3 w-3" }, void 0, false), /*#__PURE__*/

                  _jsxDEV("span", { children: [Math.abs(metric.change), "% vs last hour"] }, void 0, true)] }, void 0, true
                )] }, metric.name, true
              ));

          })] }, void 0, true
        ),


        !prometheusAvailable && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          className: "p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-2 rounded-lg bg-amber-500/20", children: /*#__PURE__*/
                _jsxDEV(RocketLaunchIcon, { className: "h-5 w-5 text-amber-500" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white", children: "Enable Advanced Monitoring" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Deploy Prometheus for detailed metrics, historical charts, and alerting" }, void 0, false

                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(Link, {
              to: "/monitoring/prometheus",
              className: "flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium", children: [/*#__PURE__*/

              _jsxDEV(Cog6ToothIcon, { className: "h-4 w-4" }, void 0, false), "Setup Prometheus"] }, void 0, true

            )] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/



        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "p-6 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: [/*#__PURE__*/


          _jsxDEV("div", { className: "flex items-center justify-between mb-4 flex-wrap gap-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: ["Cluster ",
                selectedMetric === 'cpu' ? 'CPU' : 'Memory', " Usage - Last ", selectedTimeRange] }, void 0, true
              ),
              prometheusAvailable && /*#__PURE__*/
              _jsxDEV("span", { className: "px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full", children: "Live from Prometheus" }, void 0, false

              )] }, void 0, true

            ), /*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV("select", {
                value: selectedTimeRange,
                onChange: (e) => setSelectedTimeRange(e.target.value),
                className: "px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent", children: [/*#__PURE__*/

                _jsxDEV("option", { value: "1h", children: "Last 1h" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "6h", children: "Last 6h" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "24h", children: "Last 24h" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("select", {
                value: selectedMetric,
                onChange: (e) => setSelectedMetric(e.target.value),
                className: "px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent", children: [/*#__PURE__*/

                _jsxDEV("option", { value: "cpu", children: "CPU" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "memory", children: "Memory" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ),


          prometheusAvailable && (selectedMetric === 'cpu' ? cpuChartData.length > 0 : memoryChartData.length > 0) ? /*#__PURE__*/
          _jsxDEV("div", { className: "h-64", children: /*#__PURE__*/
            _jsxDEV(ResponsiveContainer, { width: "100%", height: "100%", children: /*#__PURE__*/
              _jsxDEV(AreaChart, { data: selectedMetric === 'cpu' ? cpuChartData : memoryChartData, children: [/*#__PURE__*/
                _jsxDEV("defs", { children: /*#__PURE__*/
                  _jsxDEV("linearGradient", { id: "metricGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [/*#__PURE__*/
                    _jsxDEV("stop", { offset: "5%", stopColor: selectedMetric === 'cpu' ? chartColors.primary[0] : chartColors.success[0], stopOpacity: 0.3 }, void 0, false), /*#__PURE__*/
                    _jsxDEV("stop", { offset: "95%", stopColor: selectedMetric === 'cpu' ? chartColors.primary[0] : chartColors.success[0], stopOpacity: 0 }, void 0, false)] }, void 0, true
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV(CartesianGrid, { strokeDasharray: "3 3", stroke: "#5D5C61", opacity: 0.35 }, void 0, false), /*#__PURE__*/
                _jsxDEV(XAxis, {
                  dataKey: "time",
                  tick: { fill: '#B1A296', fontSize: 10 },
                  tickLine: { stroke: '#5D5C61' },
                  interval: "preserveStartEnd" }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV(YAxis, {
                  domain: [0, 100],
                  tick: { fill: '#B1A296', fontSize: 10 },
                  tickLine: { stroke: '#5D5C61' },
                  tickFormatter: (v) => `${v}%` }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV(Tooltip, {
                  contentStyle: {
                    backgroundColor: 'rgba(45, 44, 49, 0.97)',
                    border: '1px solid #5D5C61',
                    borderRadius: '8px',
                    fontSize: '12px'
                  },
                  labelStyle: { color: '#F7F4F1' },
                  formatter: (value) => [`${value.toFixed(1)}%`, selectedMetric === 'cpu' ? 'CPU' : 'Memory'] }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV(Area, {
                  type: "monotone",
                  dataKey: selectedMetric,
                  stroke: selectedMetric === 'cpu' ? chartColors.primary[0] : chartColors.success[0],
                  strokeWidth: 2,
                  fill: "url(#metricGradient)" }, void 0, false
                )] }, void 0, true
              ) }, void 0, false
            ) }, void 0, false
          ) : /*#__PURE__*/

          _jsxDEV("div", { className: "h-64 flex items-center justify-center text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-lg", children:
            prometheusAvailable ? 'Loading chart data...' : 'Deploy Prometheus for real-time charts' }, void 0, false
          )] }, void 0, true

        ),


        prometheusAvailable && prometheusAlerts.length > 0 && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: "Prometheus Alerts" }, void 0, false), /*#__PURE__*/
            _jsxDEV(Link, {
              to: "/monitoring/prometheus/alerts",
              className: "text-xs text-primary-500 hover:text-primary-600", children:
              "View All Alerts" }, void 0, false

            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-2", children:
            prometheusAlerts.slice(0, 5).map((alert, idx) => /*#__PURE__*/
            _jsxDEV("div", {

              className: `p-3 rounded-lg ${
              alert.labels.severity === 'critical' ?
              'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
              alert.labels.severity === 'warning' ?
              'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' :
              'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'}`, children: [/*#__PURE__*/


              _jsxDEV("div", { className: "flex items-center justify-between", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: `text-sm font-medium ${
                    alert.labels.severity === 'critical' ? 'text-red-700 dark:text-red-400' :
                    alert.labels.severity === 'warning' ? 'text-amber-700 dark:text-amber-400' :
                    'text-blue-700 dark:text-violet-400'}`, children:

                    alert.labels.alertname }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("span", { className: `px-2 py-0.5 text-xs rounded-full ${
                    alert.state === 'firing' ?
                    'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                    'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`, children:

                    alert.state }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false
              ),
              alert.annotations.summary && /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children:
                alert.annotations.summary }, void 0, false
              )] }, idx, true

            )
            ) }, void 0, false
          )] }, void 0, true
        ),



        prometheusAvailable && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20", children: [/*#__PURE__*/

          _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-3", children: "Prometheus Tools" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [/*#__PURE__*/
            _jsxDEV(Link, {
              to: "/monitoring/prometheus",
              className: "flex items-center gap-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-gray-200/50 dark:border-slate-700/50 transition-colors", children: [/*#__PURE__*/

              _jsxDEV(Cog6ToothIcon, { className: "h-5 w-5 text-purple-500" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Setup" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(Link, {
              to: "/monitoring/prometheus/explorer",
              className: "flex items-center gap-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-gray-200/50 dark:border-slate-700/50 transition-colors", children: [/*#__PURE__*/

              _jsxDEV(ChartBarIcon, { className: "h-5 w-5 text-blue-500" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Explorer" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(Link, {
              to: "/monitoring/prometheus/alerts",
              className: "flex items-center gap-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-gray-200/50 dark:border-slate-700/50 transition-colors", children: [/*#__PURE__*/

              _jsxDEV(BellAlertIcon, { className: "h-5 w-5 text-amber-500" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Alerts" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(Link, {
              to: "/monitoring/prometheus/targets",
              className: "flex items-center gap-2 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-gray-200/50 dark:border-slate-700/50 transition-colors", children: [/*#__PURE__*/

              _jsxDEV(ServerIcon, { className: "h-5 w-5 text-green-500" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Targets" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true

      ),



      !loading && !error && activeTab === 'alerts' && /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-3", children: /*#__PURE__*/
          _jsxDEV("div", { className: "flex gap-2", children:
            ['all', 'firing', 'resolved'].map((filter) => /*#__PURE__*/
            _jsxDEV("button", {

              onClick: () => setAlertFilter(filter),
              className: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
              alertFilter === filter ?
              'bg-green-500 text-white' :
              'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'}`, children: [


              filter,
              filter === 'firing' && /*#__PURE__*/
              _jsxDEV("span", { className: "ml-1.5 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]", children:
                alerts.filter((a) => a.status === 'firing').length }, void 0, false
              )] }, filter, true

            )
            ) }, void 0, false
          ) }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "space-y-3", children: [
          filteredAlerts.length === 0 && /*#__PURE__*/
          _jsxDEV("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
            _jsxDEV(CheckCircleIcon, { className: "h-12 w-12 mx-auto mb-3 text-green-500" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { children: "No alerts found. Your cluster is healthy!" }, void 0, false)] }, void 0, true
          ),

          filteredAlerts.map((alert, index) => {
            const styles = getSeverityStyles(alert.severity);
            return (/*#__PURE__*/
              _jsxDEV(motion.div, {

                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: index * 0.05 },
                className: `p-4 rounded-xl border ${styles.border} ${
                alert.status === 'resolved' ? 'opacity-60' : ''}`, children: [/*#__PURE__*/


                _jsxDEV("div", { className: "flex items-start justify-between", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-start gap-3", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: `p-2 rounded-lg ${styles.bg}`, children:
                      alert.severity === 'critical' ? /*#__PURE__*/
                      _jsxDEV(ExclamationTriangleIcon, { className: `h-5 w-5 ${styles.text}` }, void 0, false) :
                      alert.severity === 'warning' ? /*#__PURE__*/
                      _jsxDEV(ExclamationTriangleIcon, { className: `h-5 w-5 ${styles.text}` }, void 0, false) : /*#__PURE__*/

                      _jsxDEV(BellAlertIcon, { className: `h-5 w-5 ${styles.text}` }, void 0, false) }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white", children: alert.title }, void 0, false), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-0.5", children: alert.description }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center gap-3 mt-2 text-xs text-gray-400", children: [/*#__PURE__*/
                        _jsxDEV("span", { children: alert.source }, void 0, false), /*#__PURE__*/
                        _jsxDEV("span", { children: alert.timestamp }, void 0, false)] }, void 0, true
                      )] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
                      alert.status === 'firing' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                      alert.status === 'resolved' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                      'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`, children:

                      alert.status }, void 0, false
                    ),
                    alert.status === 'firing' && /*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.05 },
                      whileTap: { scale: 0.95 },
                      className: "px-3 py-1 text-xs font-medium rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600", children:
                      "Acknowledge" }, void 0, false

                    )] }, void 0, true

                  )] }, void 0, true
                ),


                alert.workloadName && /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
                  _jsxDEV(Link, {
                    to: `/kubernetes/workloads?search=${alert.workloadName}`,
                    className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-violet-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors", children: [/*#__PURE__*/

                    _jsxDEV("svg", { className: "h-3.5 w-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /*#__PURE__*/
                      _jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }, void 0, false) }, void 0, false
                    ), "View Workload"] }, void 0, true

                  ), /*#__PURE__*/

                  _jsxDEV("button", {
                    onClick: () => {
                      setSearchParams({ tab: 'logs' });
                      setLogSearch(alert.workloadName || '');
                    },
                    className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-violet-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors", children: [/*#__PURE__*/

                    _jsxDEV("svg", { className: "h-3.5 w-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /*#__PURE__*/
                      _jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }, void 0, false) }, void 0, false
                    ), "View Logs"] }, void 0, true

                  ), /*#__PURE__*/

                  _jsxDEV("button", {
                    onClick: () => setSearchParams({ tab: 'logs' }),
                    className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors", children: [/*#__PURE__*/

                    _jsxDEV("svg", { className: "h-3.5 w-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /*#__PURE__*/
                      _jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }, void 0, false) }, void 0, false
                    ), "View Events"] }, void 0, true

                  )] }, void 0, true
                )] }, alert.id, true

              ));

          })] }, void 0, true
        )] }, void 0, true
      ),



      !loading && !error && activeTab === 'logs' && /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-4 p-1 rounded-xl bg-gray-100 dark:bg-slate-800 w-fit", children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => {
              setLogSource('events');
              setPodLogsStreaming(false);
            },
            className: `px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            logSource === 'events' ?
            'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' :
            'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`, children: /*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(ClockIcon, { className: "h-4 w-4" }, void 0, false), "Events"] }, void 0, true

            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => setLogSource('pods'),
            className: `px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            logSource === 'pods' ?
            'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' :
            'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`, children: /*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(DocumentTextIcon, { className: "h-4 w-4" }, void 0, false), "Pod Logs"] }, void 0, true

            ) }, void 0, false
          )] }, void 0, true
        ),


        logSource === 'pods' && /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("select", {
            value: selectedNamespace,
            onChange: (e) => {
              setSelectedNamespace(e.target.value);
              setSelectedPod(null);
              setPodLogsStreaming(false);
            },
            className: "px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 focus:border-transparent", children: [/*#__PURE__*/

            _jsxDEV("option", { value: "", children: "All Namespaces" }, void 0, false),
            Array.from(new Set(pods.map((p) => p.namespace))).map((ns) => /*#__PURE__*/
            _jsxDEV("option", { value: ns, children: ns }, ns, false)
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("select", {
            value: selectedPod?.name || '',
            onChange: (e) => {
              const pod = pods.find((p) => p.name === e.target.value);
              setSelectedPod(pod || null);
              setSelectedContainer(pod?.containers?.[0] || '');
              setPodLogsStreaming(false);
              wsClearLogs();
            },
            className: "flex-1 px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 focus:border-transparent", children: [/*#__PURE__*/

            _jsxDEV("option", { value: "", children: "Select a pod..." }, void 0, false),
            pods.
            filter((p) => !selectedNamespace || p.namespace === selectedNamespace).
            map((pod) => /*#__PURE__*/
            _jsxDEV("option", { value: pod.name, children: [
              pod.name, " (", pod.namespace, ") - ", pod.status] }, `${pod.namespace}-${pod.name}`, true
            )
            )] }, void 0, true
          ),

          selectedPod && selectedPod.containers.length > 1 && /*#__PURE__*/
          _jsxDEV("select", {
            value: selectedContainer,
            onChange: (e) => {
              setSelectedContainer(e.target.value);
              setPodLogsStreaming(false);
              wsClearLogs();
            },
            className: "px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 focus:border-transparent", children:

            selectedPod.containers.map((container) => /*#__PURE__*/
            _jsxDEV("option", { value: container, children: container }, container, false)
            ) }, void 0, false
          ),


          selectedPod && /*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => {
              if (podLogsStreaming) {
                setPodLogsStreaming(false);
                wsDisconnect();
              } else {
                setPodLogsStreaming(true);
              }
            },
            className: `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            podLogsStreaming ?
            'bg-red-500 hover:bg-red-600 text-white' :
            'bg-green-500 hover:bg-green-600 text-white'}`, children: [


            podLogsStreaming ? 'Stop' : 'Start', " Streaming"] }, void 0, true
          )] }, void 0, true

        ),



        logSource === 'events' && /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "relative flex-1 max-w-md", children: [/*#__PURE__*/
            _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              placeholder: "Search logs...",
              value: logSearch,
              onChange: (e) => setLogSearch(e.target.value),
              className: "w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-green-500 focus:border-transparent" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex gap-2", children:
            ['all', 'error', 'warn', 'info', 'debug'].map((level) => /*#__PURE__*/
            _jsxDEV("button", {

              onClick: () => setLogLevel(level),
              className: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
              logLevel === level ?
              level === 'error' ? 'bg-red-500 text-white' :
              level === 'warn' ? 'bg-amber-500 text-white' :
              level === 'info' ? 'bg-blue-500 text-white' :
              level === 'debug' ? 'bg-gray-500 text-white' :
              'bg-green-500 text-white' :
              'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'}`, children:


              level }, level, false
            )
            ) }, void 0, false
          )] }, void 0, true
        ),



        logSource === 'events' && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          className: "p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-emerald-950/10 dark:to-slate-900/10 border border-purple-200 dark:border-purple-500/20", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
            _jsxDEV("svg", { className: "h-5 w-5 text-purple-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /*#__PURE__*/
              _jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "AI Log Summary - Last 10 Minutes" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: fetchAISummary,
              disabled: aiSummaryLoading,
              className: "ml-auto p-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors disabled:opacity-50",
              title: "Refresh summary", children: /*#__PURE__*/

              _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 text-purple-600 dark:text-violet-400 ${aiSummaryLoading ? 'animate-spin' : ''}` }, void 0, false) }, void 0, false
            )] }, void 0, true
          ),

          aiSummaryLoading ? /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2 py-4", children: [/*#__PURE__*/
            _jsxDEV(ArrowPathIcon, { className: "h-5 w-5 text-purple-500 animate-spin" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Analyzing logs..." }, void 0, false)] }, void 0, true
          ) :
          aiSummary ? /*#__PURE__*/
          _jsxDEV(_Fragment, { children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-line", children:
              aiSummary.summary }, void 0, false
            ),
            aiSummary.key_issues && aiSummary.key_issues.length > 0 && /*#__PURE__*/
            _jsxDEV("div", { className: "mt-3 pt-3 border-t border-purple-200 dark:border-purple-500/20", children: [/*#__PURE__*/
              _jsxDEV("h4", { className: "text-xs font-semibold text-purple-700 dark:text-violet-300 mb-2", children: "Key Issues:" }, void 0, false), /*#__PURE__*/
              _jsxDEV("ul", { className: "space-y-1", children:
                aiSummary.key_issues.map((issue, idx) => /*#__PURE__*/
                _jsxDEV("li", { className: "text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-purple-500 mt-0.5", children: "•" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { children: issue }, void 0, false)] }, idx, true
                )
                ) }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("div", { className: "flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
              _jsxDEV("span", { children: [aiSummary.error_count, " errors analyzed"] }, void 0, true),
              lastSummaryTime && /*#__PURE__*/
              _jsxDEV("span", { children: ["Updated: ", lastSummaryTime.toLocaleTimeString()] }, void 0, true)] }, void 0, true

            )] }, void 0, true
          ) : /*#__PURE__*/

          _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Click refresh to generate AI summary" }, void 0, false)] }, void 0, true

        ),



        logSource === 'events' && /*#__PURE__*/
        _jsxDEV("div", { className: "rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-700 overflow-hidden", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-3 bg-slate-800 dark:bg-slate-900 border-b border-slate-700 flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-xs font-medium text-slate-400", children: "Kubernetes Events" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "text-xs text-slate-500", children: [filteredLogs.length, " entries"] }, void 0, true)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "divide-y divide-slate-800 max-h-[600px] overflow-y-auto", children: [
            filteredLogs.length === 0 && /*#__PURE__*/
            _jsxDEV("div", { className: "text-center py-8 text-slate-400", children: [/*#__PURE__*/
              _jsxDEV(DocumentTextIcon, { className: "h-12 w-12 mx-auto mb-3 opacity-50" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { children: "No log entries found" }, void 0, false)] }, void 0, true
            ),

            filteredLogs.map((log) => /*#__PURE__*/
            _jsxDEV("div", { className: "px-4 py-2 hover:bg-slate-800/50 transition-colors font-mono text-xs", children: /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-start gap-3", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-slate-500 whitespace-nowrap", children: formatTimestamp(log.timestamp) }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: `px-1.5 py-0.5 rounded uppercase font-bold ${getLogLevelStyles(log.level)}`, children:
                  log.level }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("span", { className: "text-violet-400", children: ["[", log.source, "]"] }, void 0, true), /*#__PURE__*/
                _jsxDEV("span", { className: "text-slate-300 flex-1", children: log.message }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-slate-600", children: log.namespace }, void 0, false)] }, void 0, true
              ) }, log.id, false
            )
            )] }, void 0, true
          )] }, void 0, true
        ),



        logSource === 'pods' && /*#__PURE__*/
        _jsxDEV("div", { className: "rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-700 overflow-hidden", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-3 bg-slate-800 dark:bg-slate-900 border-b border-slate-700 flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-xs font-medium text-slate-400", children:
              selectedPod ? `${selectedPod.name} - ${selectedContainer || 'default'}` : 'Pod Logs' }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3", children: [
              podLogsStreaming && /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "h-2 w-2 rounded-full bg-green-500 animate-pulse" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-xs text-green-400", children: "Live" }, void 0, false)] }, void 0, true
              ),

              wsError && /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs text-red-400", children: wsError }, void 0, false), /*#__PURE__*/

              _jsxDEV("span", { className: "text-xs text-slate-500", children: [wsLogs.length, " lines"] }, void 0, true)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "p-4 font-mono text-xs max-h-[600px] overflow-y-auto bg-slate-950", children: [
            !selectedPod && /*#__PURE__*/
            _jsxDEV("div", { className: "text-center py-8 text-slate-400", children: [/*#__PURE__*/
              _jsxDEV(DocumentTextIcon, { className: "h-12 w-12 mx-auto mb-3 opacity-50" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { children: "Select a pod to view logs" }, void 0, false)] }, void 0, true
            ),

            selectedPod && wsLogs.length === 0 && !podLogsStreaming && /*#__PURE__*/
            _jsxDEV("div", { className: "text-center py-8 text-slate-400", children: [/*#__PURE__*/
              _jsxDEV(DocumentTextIcon, { className: "h-12 w-12 mx-auto mb-3 opacity-50" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { children: "Click \"Start Streaming\" to view logs" }, void 0, false)] }, void 0, true
            ),

            selectedPod && wsLogs.length === 0 && podLogsStreaming && /*#__PURE__*/
            _jsxDEV("div", { className: "text-center py-8 text-slate-400", children: [/*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: "h-12 w-12 mx-auto mb-3 opacity-50 animate-spin" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { children: "Waiting for logs..." }, void 0, false)] }, void 0, true
            ),

            wsLogs.map((logLine, idx) => /*#__PURE__*/
            _jsxDEV("div", { className: "py-0.5 text-slate-300 hover:bg-slate-800/30", children:
              logLine }, idx, false
            )
            )] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true

      )] }, void 0, true

    ));

}
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  PlayIcon,
  ClockIcon,
  ChartBarIcon,
  TableCellsIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon } from
'@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer } from
'recharts';
import GlassCard from '../common/GlassCard';
import { prometheusApi, getRelativeTime } from '../../services/prometheusApi';
import { chartColors } from '../../styles/design-system';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";


// Time range options
const TIME_RANGES = [
{ label: '15m', value: 15 * 60 },
{ label: '1h', value: 60 * 60 },
{ label: '3h', value: 3 * 60 * 60 },
{ label: '6h', value: 6 * 60 * 60 },
{ label: '12h', value: 12 * 60 * 60 },
{ label: '24h', value: 24 * 60 * 60 },
{ label: '2d', value: 2 * 24 * 60 * 60 },
{ label: '7d', value: 7 * 24 * 60 * 60 }];


// Common PromQL queries
const EXAMPLE_QUERIES = [
{ label: 'CPU Usage by Pod', query: 'sum(rate(container_cpu_usage_seconds_total{container!=""}[5m])) by (pod)' },
{ label: 'Memory Usage by Pod', query: 'sum(container_memory_usage_bytes{container!=""}) by (pod)' },
{ label: 'Node CPU Usage', query: '100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)' },
{ label: 'Node Memory Usage', query: '(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100' },
{ label: 'HTTP Request Rate', query: 'sum(rate(http_requests_total[5m])) by (method, status)' },
{ label: 'Pod Restart Count', query: 'sum(kube_pod_container_status_restarts_total) by (pod)' }];


// Color palette for chart lines
const COLORS = chartColors.series;






export default function MetricsExplorer() {
  const [query, setQuery] = useState('');
  const [timeRange, setTimeRange] = useState(TIME_RANGES[1].value); // Default 1h
  const [step, setStep] = useState('60s');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [viewMode, setViewMode] = useState('chart');
  const [stackStatus, setStackStatus] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [showMetricBrowser, setShowMetricBrowser] = useState(false);
  const [metricSearch, setMetricSearch] = useState('');

  // Check Prometheus status on mount
  useEffect(() => {
    checkPrometheusStatus();
    loadMetrics();
  }, []);

  const checkPrometheusStatus = async () => {
    try {
      const response = await prometheusApi.getStackStatus();
      setStackStatus(response.data.status);
    } catch {
      setStackStatus('not_installed');
    }
  };

  const loadMetrics = async () => {
    try {
      const response = await prometheusApi.getMetricMetadata();
      setMetrics(response.data.metrics);
    } catch {

      // Ignore error
    }};

  const executeQuery = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const now = new Date();
      const start = new Date(now.getTime() - timeRange * 1000);

      const response = await prometheusApi.queryRange({
        query: query.trim(),
        start: start.toISOString(),
        end: now.toISOString(),
        step
      });

      setResult(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Query execution failed';
      setResult({
        status: 'error',
        result_type: '',
        result: [],
        error: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }, [query, timeRange, step]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      executeQuery();
    }
  };

  const selectMetric = (metricName) => {
    setQuery(metricName);
    setShowMetricBrowser(false);
  };

  const selectExampleQuery = (exampleQuery) => {
    setQuery(exampleQuery);
  };

  // Transform query result to chart data
  const getChartData = () => {
    if (!result || result.result_type !== 'matrix' || result.result.length === 0) {
      return [];
    }

    // Get all unique timestamps
    const timestampSet = new Set();
    result.result.forEach((sample) => {
      sample.values?.forEach((v) => {
        timestampSet.add(v.timestamp);
      });
    });

    const timestamps = Array.from(timestampSet).sort((a, b) => a - b);

    // Build chart data
    return timestamps.map((ts) => {
      const dataPoint = {
        timestamp: ts,
        time: new Date(ts * 1000).toLocaleTimeString()
      };

      result.result.forEach((sample, idx) => {
        const label = getMetricLabel(sample, idx);
        const value = sample.values?.find((v) => v.timestamp === ts);
        dataPoint[label] = value ? parseFloat(value.value) : 0;
      });

      return dataPoint;
    });
  };

  // Get a label for a metric series
  const getMetricLabel = (sample, index) => {
    const labels = sample.metric;
    if (Object.keys(labels).length === 0) {
      return `series-${index}`;
    }

    // Try common label combinations
    const labelParts = [];
    ['pod', 'container', 'instance', 'job', 'namespace', 'method', 'status'].forEach((key) => {
      if (labels[key]) {
        labelParts.push(`${key}=${labels[key]}`);
      }
    });

    if (labelParts.length === 0) {
      // Use first available label
      const firstKey = Object.keys(labels).find((k) => k !== '__name__');
      if (firstKey) {
        labelParts.push(`${firstKey}=${labels[firstKey]}`);
      }
    }

    return labelParts.join(', ') || `series-${index}`;
  };

  // Filter metrics for browser
  const filteredMetrics = metrics.filter((m) =>
  m.metric_name.toLowerCase().includes(metricSearch.toLowerCase()) ||
  m.help.toLowerCase().includes(metricSearch.toLowerCase())
  );

  // If Prometheus is not installed, show message
  if (stackStatus === 'not_installed') {
    return (/*#__PURE__*/
      _jsxDEV(GlassCard, { children: /*#__PURE__*/
        _jsxDEV("div", { className: "p-8 text-center", children: [/*#__PURE__*/
          _jsxDEV(ExclamationTriangleIcon, { className: "w-12 h-12 text-amber-500 mx-auto mb-4" }, void 0, false), /*#__PURE__*/
          _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: "Prometheus Not Installed" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 mb-4", children: "Please deploy the Prometheus stack first to use the Metrics Explorer." }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("a", {
            href: "/monitoring/prometheus/setup",
            className: "inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700", children:
            "Deploy Prometheus" }, void 0, false

          )] }, void 0, true
        ) }, void 0, false
      ));

  }

  const chartData = getChartData();
  const seriesLabels = result?.result.map((sample, idx) => getMetricLabel(sample, idx)) || [];

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

      _jsxDEV(GlassCard, { children: /*#__PURE__*/
        _jsxDEV("div", { className: "p-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [/*#__PURE__*/
            _jsxDEV(MagnifyingGlassIcon, { className: "w-5 h-5 text-gray-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "PromQL Query" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
            _jsxDEV("textarea", {
              value: query,
              onChange: (e) => setQuery(e.target.value),
              onKeyDown: handleKeyDown,
              placeholder: "Enter PromQL query... (Ctrl+Enter to execute)",
              className: "w-full h-24 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none" }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => setShowMetricBrowser(!showMetricBrowser),
              className: "absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
              title: "Browse metrics", children: /*#__PURE__*/

              _jsxDEV(ChartBarIcon, { className: "w-5 h-5" }, void 0, false) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "flex flex-wrap items-center gap-4 mt-4", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(ClockIcon, { className: "w-4 h-4 text-gray-400" }, void 0, false), /*#__PURE__*/
              _jsxDEV("select", {
                value: timeRange,
                onChange: (e) => setTimeRange(parseInt(e.target.value)),
                className: "px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white", children:

                TIME_RANGES.map((range) => /*#__PURE__*/
                _jsxDEV("option", { value: range.value, children: ["Last ",
                  range.label] }, range.label, true
                )
                ) }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-sm text-gray-500", children: "Step:" }, void 0, false), /*#__PURE__*/
              _jsxDEV("select", {
                value: step,
                onChange: (e) => setStep(e.target.value),
                className: "px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white", children: [/*#__PURE__*/

                _jsxDEV("option", { value: "15s", children: "15s" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "30s", children: "30s" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "60s", children: "1m" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "300s", children: "5m" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center gap-1 p-1 bg-gray-100 dark:bg-slate-700 rounded-lg", children: [/*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => setViewMode('chart'),
                className: `p-1.5 rounded ${viewMode === 'chart' ? 'bg-white dark:bg-slate-600 shadow' : ''}`, children: /*#__PURE__*/

                _jsxDEV(ChartBarIcon, { className: "w-4 h-4" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => setViewMode('table'),
                className: `p-1.5 rounded ${viewMode === 'table' ? 'bg-white dark:bg-slate-600 shadow' : ''}`, children: /*#__PURE__*/

                _jsxDEV(TableCellsIcon, { className: "w-4 h-4" }, void 0, false) }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("div", { className: "flex-1" }, void 0, false), /*#__PURE__*/


            _jsxDEV("button", {
              onClick: executeQuery,
              disabled: loading || !query.trim(),
              className: "flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed", children: [

              loading ? /*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: "w-4 h-4 animate-spin" }, void 0, false) : /*#__PURE__*/

              _jsxDEV(PlayIcon, { className: "w-4 h-4" }, void 0, false),
              "Execute"] }, void 0, true

            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700", children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500 mb-2", children: "Example queries:" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "flex flex-wrap gap-2", children:
              EXAMPLE_QUERIES.map((eq) => /*#__PURE__*/
              _jsxDEV("button", {

                onClick: () => selectExampleQuery(eq.query),
                className: "px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-slate-600", children:

                eq.label }, eq.label, false
              )
              ) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ),


      showMetricBrowser && /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50",
        onClick: () => setShowMetricBrowser(false), children: /*#__PURE__*/

        _jsxDEV(motion.div, {
          initial: { scale: 0.95 },
          animate: { scale: 1 },
          className: "bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden",
          onClick: (e) => e.stopPropagation(), children: [/*#__PURE__*/

          _jsxDEV("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Metric Browser" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: metricSearch,
              onChange: (e) => setMetricSearch(e.target.value),
              placeholder: "Search metrics...",
              className: "w-full mt-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-sm",
              autoFocus: true }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "p-4 overflow-y-auto max-h-[60vh]", children:
            filteredMetrics.length === 0 ? /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-500 text-center py-4", children: "No metrics found" }, void 0, false) : /*#__PURE__*/

            _jsxDEV("div", { className: "space-y-2", children:
              filteredMetrics.slice(0, 100).map((metric) => /*#__PURE__*/
              _jsxDEV("button", {

                onClick: () => selectMetric(metric.metric_name),
                className: "w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700", children: [/*#__PURE__*/

                _jsxDEV("p", { className: "font-mono text-sm text-gray-900 dark:text-white", children:
                  metric.metric_name }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-500 mt-1 truncate", children: metric.help }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: `inline-block mt-1 px-2 py-0.5 text-xs rounded ${
                  metric.type === 'counter' ? 'bg-blue-100 text-blue-700' :
                  metric.type === 'gauge' ? 'bg-green-100 text-green-700' :
                  metric.type === 'histogram' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'}`, children:

                  metric.type }, void 0, false
                )] }, metric.metric_name, true
              )
              ) }, void 0, false
            ) }, void 0, false

          )] }, void 0, true
        ) }, void 0, false
      ),



      result && /*#__PURE__*/
      _jsxDEV(GlassCard, { children: /*#__PURE__*/
        _jsxDEV("div", { className: "p-4", children:
          result.status === 'error' ? /*#__PURE__*/
          _jsxDEV("div", { className: "p-4 bg-red-50 dark:bg-red-900/20 rounded-lg", children: /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
              _jsxDEV(ExclamationTriangleIcon, { className: "w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("p", { className: "font-medium text-red-800 dark:text-red-300", children: "Query Error" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-red-600 dark:text-red-400 mt-1", children: result.error }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ) }, void 0, false
          ) :
          result.result.length === 0 ? /*#__PURE__*/
          _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-center", children: [/*#__PURE__*/
            _jsxDEV(InformationCircleIcon, { className: "w-8 h-8 text-gray-400 mx-auto mb-2" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-500", children: "No data returned for this query" }, void 0, false)] }, void 0, true
          ) :
          viewMode === 'chart' ? /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
              _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white", children: [
                result.result.length, " series returned"] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs text-gray-500", children: [
                chartData.length, " data points"] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "h-80", children: /*#__PURE__*/
              _jsxDEV(ResponsiveContainer, { width: "100%", height: "100%", children: /*#__PURE__*/
                _jsxDEV(LineChart, { data: chartData, children: [/*#__PURE__*/
                  _jsxDEV(CartesianGrid, { strokeDasharray: "3 3", stroke: "#5D5C61", opacity: 0.35 }, void 0, false), /*#__PURE__*/
                  _jsxDEV(XAxis, {
                    dataKey: "time",
                    tick: { fill: '#B1A296', fontSize: 11 },
                    tickLine: { stroke: '#5D5C61' } }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV(YAxis, {
                    tick: { fill: '#B1A296', fontSize: 11 },
                    tickLine: { stroke: '#5D5C61' },
                    tickFormatter: (value) => {
                      if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}G`;
                      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                      return value.toFixed(2);
                    } }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV(Tooltip, {
                    contentStyle: {
                      backgroundColor: 'rgba(45, 44, 49, 0.97)',
                      border: '1px solid #5D5C61',
                      borderRadius: '8px'
                    },
                    labelStyle: { color: '#F7F4F1' },
                    itemStyle: { color: '#F7F4F1' } }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV(Legend, { wrapperStyle: { fontSize: '12px' } }, void 0, false),
                  seriesLabels.slice(0, 10).map((label, idx) => /*#__PURE__*/
                  _jsxDEV(Line, {

                    type: "monotone",
                    dataKey: label,
                    stroke: COLORS[idx % COLORS.length],
                    strokeWidth: 1.5,
                    dot: false,
                    activeDot: { r: 4 } }, label, false
                  )
                  )] }, void 0, true
                ) }, void 0, false
              ) }, void 0, false
            ),
            seriesLabels.length > 10 && /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500 mt-2 text-center", children: ["Showing first 10 of ",
              seriesLabels.length, " series"] }, void 0, true
            )] }, void 0, true

          ) : /*#__PURE__*/

          _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
            _jsxDEV("table", { className: "w-full text-sm", children: [/*#__PURE__*/
              _jsxDEV("thead", { children: /*#__PURE__*/
                _jsxDEV("tr", { className: "border-b border-gray-200 dark:border-gray-700", children: [/*#__PURE__*/
                  _jsxDEV("th", { className: "text-left py-2 px-3 font-medium text-gray-500", children: "Labels" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "text-right py-2 px-3 font-medium text-gray-500", children: "Value" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "text-right py-2 px-3 font-medium text-gray-500", children: "Timestamp" }, void 0, false)] }, void 0, true
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("tbody", { children:
                result.result.map((sample, idx) => {
                  const lastValue = sample.values?.[sample.values.length - 1] || sample.value;
                  return (/*#__PURE__*/
                    _jsxDEV("tr", { className: "border-b border-gray-100 dark:border-gray-800", children: [/*#__PURE__*/
                      _jsxDEV("td", { className: "py-2 px-3", children: /*#__PURE__*/
                        _jsxDEV("code", { className: "text-xs text-gray-600 dark:text-gray-300", children:
                          JSON.stringify(sample.metric) }, void 0, false
                        ) }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("td", { className: "text-right py-2 px-3 font-mono text-gray-900 dark:text-white", children:
                        lastValue ? parseFloat(lastValue.value).toFixed(4) : '-' }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("td", { className: "text-right py-2 px-3 text-gray-500", children:
                        lastValue ? getRelativeTime(new Date(lastValue.timestamp * 1000)) : '-' }, void 0, false
                      )] }, idx, true
                    ));

                }) }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          ) }, void 0, false

        ) }, void 0, false
      )] }, void 0, true

    ));

}
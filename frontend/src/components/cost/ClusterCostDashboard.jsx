import { useState, useEffect } from 'react';
import {
  CurrencyDollarIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ServerStackIcon,
  CubeIcon,
  FolderIcon,
  CalendarIcon } from
'@heroicons/react/24/outline';
import { chartColors } from '../../styles/design-system';

// Types
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";






































// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatCurrencyDecimal(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Mock data generator (in real implementation, this would come from backend)
function generateMockData() {
  const namespaces = [
  { namespace: 'production', cpu_cost: 450, memory_cost: 280, storage_cost: 120, total_cost: 850, pod_count: 45, trend: 5.2 },
  { namespace: 'staging', cpu_cost: 180, memory_cost: 95, storage_cost: 45, total_cost: 320, pod_count: 22, trend: -2.1 },
  { namespace: 'development', cpu_cost: 120, memory_cost: 65, storage_cost: 30, total_cost: 215, pod_count: 18, trend: 12.5 },
  { namespace: 'monitoring', cpu_cost: 85, memory_cost: 120, storage_cost: 200, total_cost: 405, pod_count: 8, trend: 0.5 },
  { namespace: 'logging', cpu_cost: 65, memory_cost: 180, storage_cost: 350, total_cost: 595, pod_count: 5, trend: 8.3 },
  { namespace: 'devtroncd', cpu_cost: 95, memory_cost: 75, storage_cost: 25, total_cost: 195, pod_count: 12, trend: -1.2 }];


  const nodes = [
  { name: 'node-1', instance_type: 'm5.xlarge', hourly_cost: 0.192, monthly_cost: 138.24, cpu_utilization: 72, memory_utilization: 65 },
  { name: 'node-2', instance_type: 'm5.xlarge', hourly_cost: 0.192, monthly_cost: 138.24, cpu_utilization: 58, memory_utilization: 71 },
  { name: 'node-3', instance_type: 'm5.2xlarge', hourly_cost: 0.384, monthly_cost: 276.48, cpu_utilization: 45, memory_utilization: 52 }];


  const anomalies = [
  { id: '1', resource: 'data-processor', namespace: 'production', type: 'spike', message: 'CPU usage increased 150% in the last 24h', estimated_impact: 120, detected_at: '2h ago' },
  { id: '2', resource: 'cache-redis', namespace: 'staging', type: 'waste', message: 'Resource is idle 85% of the time', estimated_impact: 45, detected_at: '1d ago' },
  { id: '3', resource: 'log-aggregator', namespace: 'logging', type: 'unusual', message: 'Storage growth 3x normal rate', estimated_impact: 80, detected_at: '4h ago' }];


  const summary = {
    total_monthly: 2580,
    total_daily: 86,
    compute_cost: 1580,
    storage_cost: 770,
    network_cost: 230,
    trend_monthly: 4.2,
    efficiency_score: 73
  };

  return { namespaces, nodes, anomalies, summary };
}

// Components
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue'







}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-start justify-between", children: [/*#__PURE__*/
        _jsxDEV("div", { className: `p-2.5 rounded-lg ${colorClasses[color]}`, children: /*#__PURE__*/
          _jsxDEV(Icon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
        ),
        trend !== undefined && /*#__PURE__*/
        _jsxDEV("div", { className: `flex items-center gap-1 text-sm font-medium ${trend >= 0 ? 'text-red-500' : 'text-green-500'}`, children: [
          trend >= 0 ? /*#__PURE__*/_jsxDEV(ArrowTrendingUpIcon, { className: "h-4 w-4" }, void 0, false) : /*#__PURE__*/_jsxDEV(ArrowTrendingDownIcon, { className: "h-4 w-4" }, void 0, false),
          Math.abs(trend), "%"] }, void 0, true
        )] }, void 0, true

      ), /*#__PURE__*/
      _jsxDEV("div", { className: "mt-4", children: [/*#__PURE__*/
        _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: value }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: title }, void 0, false),
        subtitle && /*#__PURE__*/_jsxDEV("p", { className: "text-xs text-gray-400 dark:text-gray-500 mt-0.5", children: subtitle }, void 0, false)] }, void 0, true
      )] }, void 0, true
    ));

}

function CostBreakdownChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm", children: [/*#__PURE__*/
      _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-4", children: "Cost Breakdown" }, void 0, false), /*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center gap-6", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "relative w-32 h-32", children: [/*#__PURE__*/
          _jsxDEV("svg", { viewBox: "0 0 36 36", className: "w-full h-full -rotate-90", children:
            data.reduce((acc, item, index) => {
              const percentage = item.value / total * 100;
              const previousPercentage = acc.offset;
              acc.elements.push(/*#__PURE__*/
                _jsxDEV("circle", {

                  cx: "18",
                  cy: "18",
                  r: "15.9155",
                  fill: "none",
                  stroke: item.color,
                  strokeWidth: "3",
                  strokeDasharray: `${percentage} ${100 - percentage}`,
                  strokeDashoffset: -previousPercentage,
                  className: "transition-all duration-500" }, index, false
                )
              );
              acc.offset += percentage;
              return acc;
            }, { elements: [], offset: 0 }).elements }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "absolute inset-0 flex items-center justify-center", children: /*#__PURE__*/
            _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-lg font-bold text-gray-900 dark:text-white", children: formatCurrency(total) }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-500", children: "Monthly" }, void 0, false)] }, void 0, true
            ) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "flex-1 space-y-3", children:
          data.map((item, index) => /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: item.color } }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: item.label }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: formatCurrency(item.value) }, void 0, false)] }, index, true
          )
          ) }, void 0, false
        )] }, void 0, true
      )] }, void 0, true
    ));

}

function NamespaceCostTable({ namespaces }) {
  const [sortBy, setSortBy] = useState('total_cost');
  const sorted = [...namespaces].sort((a, b) =>
  sortBy === 'total_cost' ? b.total_cost - a.total_cost : b.trend - a.trend
  );

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "px-5 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV(FolderIcon, { className: "h-5 w-5 text-primary-600" }, void 0, false), /*#__PURE__*/
          _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Cost by Namespace" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("select", {
          value: sortBy,
          onChange: (e) => setSortBy(e.target.value),
          className: "text-sm bg-gray-100 dark:bg-slate-700 border-0 rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-300", children: [/*#__PURE__*/

          _jsxDEV("option", { value: "total_cost", children: "Sort by Cost" }, void 0, false), /*#__PURE__*/
          _jsxDEV("option", { value: "trend", children: "Sort by Trend" }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
        _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
          _jsxDEV("thead", { children: /*#__PURE__*/
            _jsxDEV("tr", { className: "bg-gray-50 dark:bg-slate-900/50", children: [/*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Namespace" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "CPU" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Memory" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Storage" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Total" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Trend" }, void 0, false)] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700", children:
            sorted.map((ns) => /*#__PURE__*/
            _jsxDEV("tr", { className: "hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors", children: [/*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "w-2 h-2 rounded-full bg-primary-500" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "font-medium text-gray-900 dark:text-white", children: ns.namespace }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500", children: [ns.pod_count, " pods"] }, void 0, true)] }, void 0, true
                  )] }, void 0, true
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4 text-right text-sm text-gray-600 dark:text-gray-400", children: formatCurrency(ns.cpu_cost) }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4 text-right text-sm text-gray-600 dark:text-gray-400", children: formatCurrency(ns.memory_cost) }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4 text-right text-sm text-gray-600 dark:text-gray-400", children: formatCurrency(ns.storage_cost) }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4 text-right", children: /*#__PURE__*/
                _jsxDEV("span", { className: "font-semibold text-gray-900 dark:text-white", children: formatCurrency(ns.total_cost) }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4 text-right", children: /*#__PURE__*/
                _jsxDEV("span", { className: `inline-flex items-center gap-1 text-sm font-medium ${ns.trend >= 0 ? 'text-red-500' : 'text-green-500'}`, children: [
                  ns.trend >= 0 ? /*#__PURE__*/_jsxDEV(ArrowTrendingUpIcon, { className: "h-3.5 w-3.5" }, void 0, false) : /*#__PURE__*/_jsxDEV(ArrowTrendingDownIcon, { className: "h-3.5 w-3.5" }, void 0, false),
                  Math.abs(ns.trend), "%"] }, void 0, true
                ) }, void 0, false
              )] }, ns.namespace, true
            )
            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true
    ));

}

function NodeCostTable({ nodes }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "px-5 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-3", children: [/*#__PURE__*/
        _jsxDEV(ServerStackIcon, { className: "h-5 w-5 text-primary-600" }, void 0, false), /*#__PURE__*/
        _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Cost by Node" }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
        _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
          _jsxDEV("thead", { children: /*#__PURE__*/
            _jsxDEV("tr", { className: "bg-gray-50 dark:bg-slate-900/50", children: [/*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Node" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Instance Type" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Hourly" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Monthly" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Utilization" }, void 0, false)] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700", children:
            nodes.map((node) => /*#__PURE__*/
            _jsxDEV("tr", { className: "hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors", children: [/*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4", children: /*#__PURE__*/
                _jsxDEV("p", { className: "font-medium text-gray-900 dark:text-white", children: node.name }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4", children: /*#__PURE__*/
                _jsxDEV("span", { className: "px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded", children:
                  node.instance_type }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4 text-right text-sm text-gray-600 dark:text-gray-400", children: formatCurrencyDecimal(node.hourly_cost) }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4 text-right", children: /*#__PURE__*/
                _jsxDEV("span", { className: "font-semibold text-gray-900 dark:text-white", children: formatCurrency(node.monthly_cost) }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-center gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "w-12 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /*#__PURE__*/
                      _jsxDEV("div", {
                        className: "h-full bg-blue-500 rounded-full",
                        style: { width: `${node.cpu_utilization}%` } }, void 0, false
                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 mt-1", children: ["CPU ", node.cpu_utilization, "%"] }, void 0, true)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "w-12 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /*#__PURE__*/
                      _jsxDEV("div", {
                        className: "h-full bg-purple-500 rounded-full",
                        style: { width: `${node.memory_utilization}%` } }, void 0, false
                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 mt-1", children: ["Mem ", node.memory_utilization, "%"] }, void 0, true)] }, void 0, true
                  )] }, void 0, true
                ) }, void 0, false
              )] }, node.name, true
            )
            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true
    ));

}

function CostAnomalies({ anomalies }) {
  const typeConfig = {
    spike: { color: 'red', label: 'Cost Spike' },
    waste: { color: 'orange', label: 'Potential Waste' },
    unusual: { color: 'yellow', label: 'Unusual Activity' }
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "px-5 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-3", children: [/*#__PURE__*/
        _jsxDEV(ExclamationTriangleIcon, { className: "h-5 w-5 text-orange-500" }, void 0, false), /*#__PURE__*/
        _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Cost Anomalies" }, void 0, false), /*#__PURE__*/
        _jsxDEV("span", { className: "ml-auto px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full", children: [
          anomalies.length, " detected"] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "divide-y divide-gray-100 dark:divide-slate-700", children:
        anomalies.map((anomaly) => {
          const config = typeConfig[anomaly.type];
          return (/*#__PURE__*/
            _jsxDEV("div", { className: "px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors", children: /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-start justify-between gap-4", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2 mb-1", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: `px-2 py-0.5 text-xs font-medium rounded bg-${config.color}-100 text-${config.color}-700 dark:bg-${config.color}-900/30 dark:text-${config.color}-400`, children:
                      config.label }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-xs text-gray-500", children: anomaly.detected_at }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "font-medium text-gray-900 dark:text-white", children: anomaly.resource }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-0.5", children: anomaly.message }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-400 mt-1", children: ["Namespace: ", anomaly.namespace] }, void 0, true)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "text-right", children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm font-semibold text-red-600", children: ["+", formatCurrency(anomaly.estimated_impact)] }, void 0, true), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500", children: "Est. Impact/mo" }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ) }, anomaly.id, false
            ));

        }) }, void 0, false
      )] }, void 0, true
    ));

}

function DailyTrendChart() {
  // Mock daily data for the last 14 days
  const days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      cost: 75 + Math.random() * 30
    };
  });

  const maxCost = Math.max(...days.map((d) => d.cost));

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-5", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV(ChartBarIcon, { className: "h-5 w-5 text-primary-600" }, void 0, false), /*#__PURE__*/
          _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Daily Cost Trend" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV(CalendarIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "text-sm text-gray-500", children: "Last 14 days" }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "h-48 flex items-end justify-between gap-1", children:
        days.map((day, index) => /*#__PURE__*/
        _jsxDEV("div", { className: "flex-1 flex flex-col items-center gap-1", children: [/*#__PURE__*/
          _jsxDEV("div", {
            className: "w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t hover:from-primary-600 hover:to-primary-500 transition-colors cursor-pointer",
            style: { height: `${day.cost / maxCost * 100}%` },
            title: `${day.date}: ${formatCurrencyDecimal(day.cost)}` }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("span", { className: "text-xs text-gray-400 -rotate-45 origin-top-left whitespace-nowrap", children:
            index % 2 === 0 ? day.date : '' }, void 0, false
          )] }, index, true
        )
        ) }, void 0, false
      )] }, void 0, true
    ));

}

// Main Component
export default function ClusterCostDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setData(generateMockData());
    setLoading(false);
  };

  if (loading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center h-64", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3 text-gray-500", children: [/*#__PURE__*/
          _jsxDEV(ArrowPathIcon, { className: "h-5 w-5 animate-spin" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { children: "Loading cost data..." }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ));

  }

  if (!data) return null;

  const { namespaces, nodes, anomalies, summary } = data;

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Cluster Cost" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: "Monitor and optimize your Kubernetes infrastructure costs" }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center bg-gray-100 dark:bg-slate-700 rounded-lg p-1", children:
            ['7d', '30d', '90d'].map((range) => /*#__PURE__*/
            _jsxDEV("button", {

              onClick: () => setTimeRange(range),
              className: `px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeRange === range ?
              'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm' :
              'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`, children:


              range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days' }, range, false
            )
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: loadData,
            className: "p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors", children: /*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-5 gap-4", children: [/*#__PURE__*/
        _jsxDEV(StatCard, {
          title: "Monthly Cost",
          value: formatCurrency(summary.total_monthly),
          subtitle: "Estimated",
          icon: CurrencyDollarIcon,
          trend: summary.trend_monthly,
          color: "blue" }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV(StatCard, {
          title: "Daily Cost",
          value: formatCurrency(summary.total_daily),
          subtitle: "Average",
          icon: CalendarIcon,
          color: "purple" }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV(StatCard, {
          title: "Compute Cost",
          value: formatCurrency(summary.compute_cost),
          subtitle: "CPU + Memory",
          icon: CubeIcon,
          color: "orange" }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV(StatCard, {
          title: "Storage Cost",
          value: formatCurrency(summary.storage_cost),
          subtitle: "PVCs + Images",
          icon: FolderIcon,
          color: "green" }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV(StatCard, {
          title: "Efficiency Score",
          value: `${summary.efficiency_score}%`,
          subtitle: "Resource utilization",
          icon: ChartBarIcon,
          color: "blue" }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-3 gap-6", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "col-span-2", children: /*#__PURE__*/
          _jsxDEV(DailyTrendChart, {}, void 0, false) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV(CostBreakdownChart, {
          data: [
          { label: 'Compute', value: summary.compute_cost, color: chartColors.primary[0] },
          { label: 'Storage', value: summary.storage_cost, color: chartColors.success[0] },
          { label: 'Network', value: summary.network_cost, color: chartColors.purple[0] }] }, void 0, false

        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-2 gap-6", children: [/*#__PURE__*/
        _jsxDEV(NamespaceCostTable, { namespaces: namespaces }, void 0, false), /*#__PURE__*/
        _jsxDEV(CostAnomalies, { anomalies: anomalies }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV(NodeCostTable, { nodes: nodes }, void 0, false)] }, void 0, true
    ));

}
import { useState, useEffect } from 'react';
import { costApi } from '../../services/api';
import { logger } from '../../utils/logger';

import {
  CurrencyDollarIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  LightBulbIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon } from
'@heroicons/react/24/outline';

// Import shared constants and components
import { formatCurrency } from '../../utils/constants';
import { SeverityBadge } from '../common/StatusBadge';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

function CostBreakdownBar({ costs, total }) {
  const colors = {
    cpu: 'bg-blue-500',
    memory: 'bg-green-500',
    storage: 'bg-purple-500',
    network: 'bg-orange-500',
    gpu: 'bg-pink-500'
  };

  const segments = Object.entries(costs).
  filter(([key, value]) => key !== 'total' && value > 0).
  map(([key, value]) => ({
    key,
    value,
    percentage: total > 0 ? value / total * 100 : 0,
    color: colors[key] || 'bg-gray-500'
  }));

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "flex h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700", children:
        segments.map((seg) => /*#__PURE__*/
        _jsxDEV("div", {

          className: `${seg.color}`,
          style: { width: `${seg.percentage}%` },
          title: `${seg.key}: ${formatCurrency(seg.value)} (${seg.percentage.toFixed(1)}%)` }, seg.key, false
        )
        ) }, void 0, false
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "flex flex-wrap gap-3 text-xs", children:
        segments.map((seg) => /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-1", children: [/*#__PURE__*/
          _jsxDEV("div", { className: `h-2 w-2 rounded-full ${seg.color}` }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "text-gray-600 dark:text-gray-400 capitalize", children: seg.key }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: formatCurrency(seg.value) }, void 0, false)] }, seg.key, true
        )
        ) }, void 0, false
      )] }, void 0, true
    ));

}

export default function CostDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await costApi.getDashboard();
      setDashboardData(response.data);
    } catch (err) {
      logger.error('Failed to load cost dashboard', err);
      setError('Failed to load cost data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex justify-center items-center h-64", children: /*#__PURE__*/
        _jsxDEV(ArrowPathIcon, { className: "h-8 w-8 animate-spin text-gray-400" }, void 0, false) }, void 0, false
      ));

  }

  if (error) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg", children: [/*#__PURE__*/
        _jsxDEV("p", { children: error }, void 0, false), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: loadDashboard,
          className: "mt-2 text-sm underline hover:no-underline", children:
          "Retry" }, void 0, false

        )] }, void 0, true
      ));

  }

  if (!dashboardData) {
    return null;
  }

  const { summary, namespace_breakdown, recommendations, total_monthly_estimate, total_annual_estimate } = dashboardData;
  const totalSavings = recommendations.reduce((sum, r) => sum + r.estimated_savings, 0);

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Cost Dashboard" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: "Resource cost analysis and optimization recommendations" }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: loadDashboard,
          className: "p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: /*#__PURE__*/

          _jsxDEV(ArrowPathIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700", children: /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2 bg-green-100 dark:bg-green-900/30 rounded-lg", children: /*#__PURE__*/
              _jsxDEV(CurrencyDollarIcon, { className: "h-6 w-6 text-green-600 dark:text-green-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Hourly Cost" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xl font-bold text-gray-900 dark:text-white", children:
                formatCurrency(summary.total_cost.total) }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700", children: /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg", children: /*#__PURE__*/
              _jsxDEV(ChartBarIcon, { className: "h-6 w-6 text-blue-600 dark:text-blue-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Monthly Estimate" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xl font-bold text-gray-900 dark:text-white", children:
                formatCurrency(total_monthly_estimate) }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700", children: /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg", children: /*#__PURE__*/
              _jsxDEV(ArrowTrendingUpIcon, { className: "h-6 w-6 text-purple-600 dark:text-purple-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Annual Estimate" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xl font-bold text-gray-900 dark:text-white", children:
                formatCurrency(total_annual_estimate) }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700", children: /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg", children: /*#__PURE__*/
              _jsxDEV(LightBulbIcon, { className: "h-6 w-6 text-yellow-600 dark:text-yellow-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Potential Savings" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xl font-bold text-green-600 dark:text-green-400", children: [
                formatCurrency(totalSavings), "/mo"] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "sticky top-[72px] z-10 -mx-4 lg:-mx-6 px-4 lg:px-6 py-3 bg-gradient-to-r from-slate-50/95 via-white/95 to-slate-50/95 dark:from-slate-900/95 dark:via-slate-900/95 dark:to-slate-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
        _jsxDEV("nav", { className: "flex gap-2", children:
          ['overview', 'namespaces', 'recommendations'].map((tab) => /*#__PURE__*/
          _jsxDEV("button", {

            onClick: () => setActiveTab(tab),
            className: `px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
            activeTab === tab ?
            'bg-primary-600 text-white shadow-lg shadow-primary-600/25' :
            'text-gray-500 hover:text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`, children:


            tab }, tab, false
          )
          ) }, void 0, false
        ) }, void 0, false
      ),


      activeTab === 'overview' && /*#__PURE__*/
      _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "Cost Breakdown by Resource" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV(CostBreakdownBar, { costs: summary.total_cost, total: summary.total_cost.total }, void 0, false), /*#__PURE__*/

          _jsxDEV("div", { className: "mt-6 grid grid-cols-2 gap-4", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "CPU" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: [
                formatCurrency(summary.total_cost.cpu), "/hr"] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Memory" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: [
                formatCurrency(summary.total_cost.memory), "/hr"] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Storage" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: [
                formatCurrency(summary.total_cost.storage), "/hr"] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Network" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: [
                formatCurrency(summary.total_cost.network), "/hr"] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "Top Costly Pods" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-3", children:
            summary.top_costly_pods.slice(0, 5).map((pod, idx) => /*#__PURE__*/
            _jsxDEV("div", {

              className: "flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-b-0", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 w-5", children:
                  idx + 1 }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children:
                    pod.name }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children:
                    pod.namespace }, void 0, false
                  )] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("span", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: [
                formatCurrency(pod.costs.total), "/hr"] }, void 0, true
              )] }, `${pod.namespace}-${pod.name}`, true
            )
            ) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ),


      activeTab === 'namespaces' && /*#__PURE__*/
      _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden", children: /*#__PURE__*/
        _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
          _jsxDEV("thead", { className: "bg-gray-50 dark:bg-slate-700", children: /*#__PURE__*/
            _jsxDEV("tr", { children: [/*#__PURE__*/
              _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase", children: "Namespace" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("th", { className: "px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase", children: "Hourly Cost" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("th", { className: "px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase", children: "% of Total" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("th", { className: "px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase", children: "Pods" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase", children: "Breakdown" }, void 0, false

              )] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("tbody", { className: "divide-y divide-gray-200 dark:divide-slate-700", children:
            namespace_breakdown.map((ns) => /*#__PURE__*/
            _jsxDEV("tr", { className: "hover:bg-gray-50 dark:hover:bg-slate-700", children: [/*#__PURE__*/
              _jsxDEV("td", { className: "px-4 py-3", children: /*#__PURE__*/
                _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children:
                  ns.namespace }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-4 py-3 text-right", children: /*#__PURE__*/
                _jsxDEV("span", { className: "font-semibold text-gray-900 dark:text-white", children:
                  formatCurrency(ns.costs.total) }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-4 py-3 text-right", children: /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-600 dark:text-gray-400", children: [
                  ns.percentage_of_total.toFixed(1), "%"] }, void 0, true
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-4 py-3 text-right", children: /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-600 dark:text-gray-400", children:
                  ns.pod_count }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-4 py-3", children: /*#__PURE__*/
                _jsxDEV("div", { className: "w-48", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "flex h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-600", children: [/*#__PURE__*/
                    _jsxDEV("div", {
                      className: "bg-blue-500",
                      style: { width: `${ns.costs.total > 0 ? ns.costs.cpu / ns.costs.total * 100 : 0}%` },
                      title: `CPU: ${formatCurrency(ns.costs.cpu)}` }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("div", {
                      className: "bg-green-500",
                      style: { width: `${ns.costs.total > 0 ? ns.costs.memory / ns.costs.total * 100 : 0}%` },
                      title: `Memory: ${formatCurrency(ns.costs.memory)}` }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("div", {
                      className: "bg-purple-500",
                      style: { width: `${ns.costs.total > 0 ? ns.costs.storage / ns.costs.total * 100 : 0}%` },
                      title: `Storage: ${formatCurrency(ns.costs.storage)}` }, void 0, false
                    )] }, void 0, true
                  ) }, void 0, false
                ) }, void 0, false
              )] }, ns.namespace, true
            )
            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ),


      activeTab === 'recommendations' && /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-4", children:
        recommendations.length === 0 ? /*#__PURE__*/
        _jsxDEV("div", { className: "text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV(CheckCircleIcon, { className: "h-12 w-12 mx-auto text-green-500" }, void 0, false), /*#__PURE__*/
          _jsxDEV("h3", { className: "mt-4 text-lg font-medium text-gray-900 dark:text-white", children: "No Optimization Recommendations" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "mt-2 text-gray-500 dark:text-gray-400", children: "Your resources appear to be well-optimized." }, void 0, false

          )] }, void 0, true
        ) :

        recommendations.map((rec) => /*#__PURE__*/
        _jsxDEV("div", {

          className: "bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-start justify-between", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-start gap-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: `p-2 rounded-lg ${
                rec.severity === 'high' ? 'bg-red-100 dark:bg-red-900/30' :
                rec.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                'bg-blue-100 dark:bg-blue-900/30'}`, children:

                rec.severity === 'high' ? /*#__PURE__*/
                _jsxDEV(ExclamationTriangleIcon, { className: "h-6 w-6 text-red-600 dark:text-red-400" }, void 0, false) :
                rec.severity === 'medium' ? /*#__PURE__*/
                _jsxDEV(LightBulbIcon, { className: "h-6 w-6 text-yellow-600 dark:text-yellow-400" }, void 0, false) : /*#__PURE__*/

                _jsxDEV(InformationCircleIcon, { className: "h-6 w-6 text-blue-600 dark:text-blue-400" }, void 0, false) }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2 mb-1", children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "text-lg font-semibold text-gray-900 dark:text-white", children:
                    rec.title }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV(SeverityBadge, { severity: rec.severity }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-gray-600 dark:text-gray-400 text-sm", children:
                  rec.description }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "mt-3 flex items-center gap-4 text-sm", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: ["Resource: ", /*#__PURE__*/
                    _jsxDEV("span", { className: "font-medium", children: [rec.resource_type, "/", rec.resource_name] }, void 0, true)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: ["Namespace: ", /*#__PURE__*/
                    _jsxDEV("span", { className: "font-medium", children: rec.namespace }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "mt-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg", children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: "Recommended Action:" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400", children:
                    rec.action }, void 0, false
                  )] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "text-right", children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Current Cost" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: [
                formatCurrency(rec.current_cost), "/hr"] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "mt-2 p-2 bg-green-50 dark:bg-green-900/30 rounded", children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-green-600 dark:text-green-400", children: "Potential Savings" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-lg font-bold text-green-600 dark:text-green-400", children: [
                  formatCurrency(rec.estimated_savings), "/hr"] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-green-600 dark:text-green-400", children: ["(",
                  rec.percentage_savings.toFixed(1), "% reduction)"] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ) }, rec.id, false
        )
        ) }, void 0, false

      )] }, void 0, true

    ));

}
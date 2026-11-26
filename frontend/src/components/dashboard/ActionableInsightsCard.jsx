import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ShieldExclamationIcon,
  BoltIcon,
  CurrencyDollarIcon,
  ServerStackIcon,
  ChevronRightIcon,
  SparklesIcon,
  CheckCircleIcon,
  ChartBarIcon,
  ArrowRightIcon } from
'@heroicons/react/24/outline';

import GlassCard from '../common/GlassCard';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";






const severityConfig =




{
  critical: {
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-500/10',
    border: 'border-red-200 dark:border-red-500/30',
    icon: ExclamationCircleIcon
  },
  high: {
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/30',
    icon: ExclamationTriangleIcon
  },
  medium: {
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/30',
    icon: InformationCircleIcon
  },
  low: {
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-50 dark:bg-gray-500/10',
    border: 'border-gray-200 dark:border-gray-500/30',
    icon: InformationCircleIcon
  }
};

const categoryConfig =


{
  reliability: {
    icon: ServerStackIcon,
    label: 'Reliability'
  },
  security: {
    icon: ShieldExclamationIcon,
    label: 'Security'
  },
  performance: {
    icon: BoltIcon,
    label: 'Performance'
  },
  cost: {
    icon: CurrencyDollarIcon,
    label: 'Cost'
  },
  efficiency: {
    icon: ChartBarIcon,
    label: 'Resource Efficiency'
  }
};

// Generate deep links based on insight category and content
function getDeepLink(insight) {
  if (insight.category === 'security') {
    return '/security';
  }
  if (insight.category === 'cost') {
    return '/cost';
  }
  if (insight.category === 'efficiency') {
    return '/optimization';
  }
  if (insight.category === 'reliability' || insight.category === 'performance') {
    // If it's a pod issue, link to kubernetes page
    if (insight.title.toLowerCase().includes('pod')) {
      return '/kubernetes?filter=failed';
    }
    // If it's a deployment issue
    if (insight.title.toLowerCase().includes('deployment')) {
      return '/kubernetes?tab=deployments';
    }
    return '/kubernetes';
  }
  return '/kubernetes';
}

export default function ActionableInsightsCard({ insights, loading }) {
  // Show top 5 most severe insights
  const topInsights = insights.
  sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  }).
  slice(0, 5);

  if (loading) {
    return (/*#__PURE__*/
      _jsxDEV(GlassCard, { padding: "md", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-center py-8", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "ml-3 text-sm text-gray-500 dark:text-gray-400", children: "Analyzing cluster..." }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ));

  }

  if (topInsights.length === 0) {
    return (/*#__PURE__*/
      _jsxDEV(GlassCard, { padding: "md", className: "border-2 border-emerald-200 dark:border-emerald-500/20", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600", children: /*#__PURE__*/
            _jsxDEV(CheckCircleIcon, { className: "h-8 w-8 text-white" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2", children: "✨ No Critical Issues" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "Your cluster is healthy! All systems operational." }, void 0, false

            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ));

  }

  const criticalCount = insights.filter((i) => i.severity === 'critical').length;
  const highCount = insights.filter((i) => i.severity === 'high').length;

  return (/*#__PURE__*/
    _jsxDEV(GlassCard, {
      padding: "md",
      className: `border-2 ${
      criticalCount > 0 ?
      'border-red-300 dark:border-red-500/40 shadow-lg shadow-red-500/10' :
      highCount > 0 ?
      'border-amber-300 dark:border-amber-500/40 shadow-lg shadow-amber-500/10' :
      'border-blue-300 dark:border-blue-500/40'}`, children: [/*#__PURE__*/



      _jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV("div", { className: `p-1.5 rounded-lg ${
            criticalCount > 0 ?
            'bg-gradient-to-br from-red-500 to-red-600' :
            highCount > 0 ?
            'bg-gradient-to-br from-amber-500 to-amber-600' :
            'bg-gradient-to-br from-blue-500 to-blue-600'}`, children: /*#__PURE__*/

            _jsxDEV(SparklesIcon, { className: "h-4 w-4 text-white" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: /*#__PURE__*/
            _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5", children: ["AI Insights", /*#__PURE__*/

              _jsxDEV("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold", children: "LIVE" }, void 0, false

              )] }, void 0, true
            ) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "flex items-center gap-2 text-xs", children: [
          criticalCount > 0 && /*#__PURE__*/
          _jsxDEV("span", { className: "px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium", children: [
            criticalCount, " critical"] }, void 0, true
          ),

          highCount > 0 && /*#__PURE__*/
          _jsxDEV("span", { className: "px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-medium", children: [
            highCount, " high"] }, void 0, true
          ),

          criticalCount === 0 && highCount === 0 && /*#__PURE__*/
          _jsxDEV("span", { className: "px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1", children: [/*#__PURE__*/
            _jsxDEV(CheckCircleIcon, { className: "h-3 w-3" }, void 0, false), "All clear"] }, void 0, true

          )] }, void 0, true

        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-1 gap-2", children:
        topInsights.slice(0, 3).map((insight, index) => {
          const config = severityConfig[insight.severity];
          const SeverityIcon = config.icon;
          const categoryInfo = categoryConfig[insight.category];
          const CategoryIcon = categoryInfo.icon;
          const deepLink = getDeepLink(insight);

          return (/*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0, x: -10 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: index * 0.03 }, children: /*#__PURE__*/

              _jsxDEV(Link, {
                to: deepLink,
                className: `block p-2.5 rounded-lg border ${config.border} ${config.bg} hover:shadow-sm transition-all group`, children: /*#__PURE__*/

                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/

                  _jsxDEV("div", { className: `flex-shrink-0 p-1 rounded ${config.bg}`, children: /*#__PURE__*/
                    _jsxDEV(SeverityIcon, { className: `h-3.5 w-3.5 ${config.color}` }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/


                  _jsxDEV("div", { className: "flex-1 min-w-0 flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("p", { className: `text-xs font-medium ${config.color} truncate flex-1`, children:
                      insight.title }, void 0, false
                    ), /*#__PURE__*/


                    _jsxDEV("span", { className: "flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center gap-0.5", children: [/*#__PURE__*/
                      _jsxDEV(CategoryIcon, { className: "h-2.5 w-2.5" }, void 0, false),
                      categoryInfo.label.split(' ')[0]] }, void 0, true
                    ),

                    insight.auto_fixable && /*#__PURE__*/
                    _jsxDEV(SparklesIcon, { className: "h-3 w-3 text-purple-500 flex-shrink-0" }, void 0, false), /*#__PURE__*/


                    _jsxDEV(ChevronRightIcon, { className: "h-3 w-3 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                ) }, void 0, false
              ) }, insight.id, false
            ));

        }) }, void 0, false
      ),


      topInsights.length > 3 && /*#__PURE__*/
      _jsxDEV(Link, {
        to: "/optimization",
        className: "mt-2 flex items-center justify-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors", children: [/*#__PURE__*/

        _jsxDEV("span", { children: ["View all ", topInsights.length, " insights"] }, void 0, true), /*#__PURE__*/
        _jsxDEV(ArrowRightIcon, { className: "h-3 w-3" }, void 0, false)] }, void 0, true
      )] }, void 0, true

    ));

}
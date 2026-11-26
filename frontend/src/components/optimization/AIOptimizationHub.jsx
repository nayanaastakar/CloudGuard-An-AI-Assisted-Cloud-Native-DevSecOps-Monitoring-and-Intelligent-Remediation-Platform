import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  SparklesIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  BoltIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ExclamationCircleIcon } from
'@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';
import { optimizationApi } from '../../services/api';
import { logger } from '../../utils/logger';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";




const focusTabs = [
{ id: 'efficiency', label: 'Resource Efficiency', icon: ChartBarIcon, description: 'Right-size workloads' },
{ id: 'performance', label: 'Performance Risk', icon: ExclamationTriangleIcon, description: 'Prevent throttling & OOM' },
{ id: 'reliability', label: 'Reliability Risk', icon: ShieldCheckIcon, description: 'Improve stability' }];


const priorityColors = {
  high: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
  medium: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
};

export default function AIOptimizationHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFocus = searchParams.get('focus') || 'efficiency';

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [appliedActions, setAppliedActions] = useState(new Set());

  // Load dashboard data and AI analysis on mount
  useEffect(() => {
    loadData();
  }, []);

  // Re-analyze when focus area changes
  useEffect(() => {
    if (dashboardData) {
      analyzeWithAI(activeFocus);
    }
  }, [activeFocus]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // First get the optimization dashboard data
      const dashRes = await optimizationApi.getDashboard();
      setDashboardData(dashRes.data);

      // Then get AI analysis
      await analyzeWithAI(activeFocus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load optimization data');
    } finally {
      setLoading(false);
    }
  };

  const analyzeWithAI = async (focus) => {
    setAnalyzing(true);
    try {
      // Show progress message after 5 seconds
      const timeoutId = setTimeout(() => {
        logger.info('AI analysis taking longer than expected - may take 30-60 seconds');
      }, 5000);

      const res = await optimizationApi.getAIAnalysis({
        focus_area: focus
      });

      clearTimeout(timeoutId);

      if (res.data.success) {
        setAiAnalysis(res.data);
        setAppliedActions(new Set()); // Reset applied actions on new analysis
        logger.info('AI analysis completed successfully');
      } else {
        logger.warn('AI analysis returned unsuccessful response');
        setError('AI analysis failed - using cached or fallback data');
      }
    } catch (err) {
      logger.error('AI analysis error', err);
      // Show user-friendly error message but keep dashboard visible
      if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
        logger.warn('AI analysis timed out - this is normal for first-time analysis. Results will be cached for future use.');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFocusChange = (focus) => {
    setSearchParams({ focus });
  };

  const handleApplyAction = (index) => {
    // Mark action as applied (in real implementation, this would call backend)
    setAppliedActions((prev) => new Set([...prev, index]));
  };

  const handleRefresh = () => {
    loadData();
  };

  // Calculate stats
  const stats = {
    totalFindings: aiAnalysis?.key_findings?.length || 0,
    pendingActions: (aiAnalysis?.priority_actions?.length || 0) - appliedActions.size,
    appliedActions: appliedActions.size,
    efficiencyImprovement: aiAnalysis?.efficiency_improvement_percent || 0,
    estimatedImpact: aiAnalysis?.estimated_monthly_impact || 0
  };

  if (loading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
        _jsxDEV(PageHeader, {
          title: "AI Optimization Hub",
          description: "AI-powered recommendations to optimize your Kubernetes cluster",
          icon: SparklesIcon,
          iconColor: "purple",
          badge: { text: 'AI', color: 'purple' } }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex justify-center items-center h-64", children: /*#__PURE__*/
          _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
            _jsxDEV(ArrowPathIcon, { className: "h-8 w-8 animate-spin text-purple-500 mx-auto mb-3" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children: "Loading optimization data..." }, void 0, false)] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true
      ));

  }

  if (error && !dashboardData) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
        _jsxDEV(PageHeader, {
          title: "AI Optimization Hub",
          description: "AI-powered recommendations to optimize your Kubernetes cluster",
          icon: SparklesIcon,
          iconColor: "purple",
          badge: { text: 'AI', color: 'purple' } }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-6 rounded-xl text-center", children: [/*#__PURE__*/
          _jsxDEV(ExclamationCircleIcon, { className: "h-12 w-12 mx-auto mb-3" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "font-medium mb-2", children: "Failed to load optimization data" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm mb-4", children: error }, void 0, false), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: handleRefresh,
            className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors", children:
            "Try Again" }, void 0, false

          )] }, void 0, true
        )] }, void 0, true
      ));

  }

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV(PageHeader, {
        title: "AI Optimization Hub",
        description: "AI-powered recommendations to optimize your Kubernetes cluster",
        icon: SparklesIcon,
        iconColor: "purple",
        badge: { text: 'AI', color: 'purple' },
        actions: /*#__PURE__*/
        _jsxDEV("button", {
          onClick: handleRefresh,
          disabled: analyzing,
          className: "flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors", children: [/*#__PURE__*/

          _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${analyzing ? 'animate-spin' : ''}` }, void 0, false),
          analyzing ? 'Analyzing...' : 'Refresh Analysis'] }, void 0, true
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children:
        [
        { label: 'Key Findings', value: stats.totalFindings, icon: LightBulbIcon, color: 'purple' },
        { label: 'Pending Actions', value: stats.pendingActions, icon: ExclamationTriangleIcon, color: 'amber' },
        { label: 'Applied', value: stats.appliedActions, icon: CheckCircleIcon, color: 'green' },
        { label: 'Efficiency Opportunity', value: `${stats.efficiencyImprovement.toFixed(1)}%`, subtext: `~$${stats.estimatedImpact.toLocaleString()}/mo`, icon: ChartBarIcon, color: 'blue' }].
        map((stat, index) => /*#__PURE__*/
        _jsxDEV(motion.div, {

          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: index * 0.05 },
          className: "p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: `p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`, children: /*#__PURE__*/
              _jsxDEV(stat.icon, { className: `h-5 w-5 text-${stat.color}-500` }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: stat.label }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xl font-bold text-gray-900 dark:text-white", children: stat.value }, void 0, false),
              'subtext' in stat && /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-400 dark:text-gray-500", children: stat.subtext }, void 0, false)] }, void 0, true

            )] }, void 0, true
          ) }, stat.label, false
        )
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex gap-3 overflow-x-auto pb-2", children:
        focusTabs.map((tab) => /*#__PURE__*/
        _jsxDEV("button", {

          onClick: () => handleFocusChange(tab.id),
          disabled: analyzing,
          className: `flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
          activeFocus === tab.id ?
          'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' :
          'bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200/50 dark:border-slate-700/50'} disabled:opacity-50`, children: [/*#__PURE__*/


          _jsxDEV(tab.icon, { className: "h-5 w-5" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "text-left", children: [/*#__PURE__*/
            _jsxDEV("div", { children: tab.label }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: `text-xs ${activeFocus === tab.id ? 'text-purple-200' : 'text-gray-400'}`, children:
              tab.description }, void 0, false
            )] }, void 0, true
          )] }, tab.id, true
        )
        ) }, void 0, false
      ),


      analyzing ? /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "p-8 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 text-center", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "p-4 rounded-2xl bg-purple-100 dark:bg-purple-900/30 w-fit mx-auto mb-4", children: /*#__PURE__*/
          _jsxDEV(SparklesIcon, { className: "h-8 w-8 text-purple-500 animate-pulse" }, void 0, false) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "AI is analyzing your cluster..." }, void 0, false

        ), /*#__PURE__*/
        _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-2", children: ["Examining resource usage patterns and generating ",
          activeFocus, " recommendations"] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("p", { className: "text-xs text-purple-600 dark:text-purple-400", children: "⏱️ First analysis takes 30-60s • Future analyses are instant (10-min cache)" }, void 0, false

        )] }, void 0, true
      ) :
      aiAnalysis ? /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30", children: /*#__PURE__*/

          _jsxDEV("p", { className: "text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(ExclamationCircleIcon, { className: "h-4 w-4 flex-shrink-0" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { children: "Recommendations based on recent usage patterns. Always validate in staging before production. Cost estimates are approximate and not billing-accurate." }, void 0, false


            )] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
          className: "p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200/50 dark:border-purple-700/50", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-start gap-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-3 rounded-xl bg-purple-100 dark:bg-purple-900/50", children: /*#__PURE__*/
              _jsxDEV(SparklesIcon, { className: "h-6 w-6 text-purple-600 dark:text-purple-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-3", children: "AI Analysis Summary" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("div", { className: "prose prose-sm dark:prose-invert max-w-none", children: /*#__PURE__*/
                _jsxDEV(ReactMarkdown, {
                  components: {
                    h1: ({ node, ...props }) => /*#__PURE__*/_jsxDEV("h1", { className: "text-xl font-bold text-gray-900 dark:text-white mb-3 mt-4", ...props }, void 0, false),
                    h2: ({ node, ...props }) => /*#__PURE__*/_jsxDEV("h2", { className: "text-lg font-bold text-gray-900 dark:text-white mb-2 mt-4", ...props }, void 0, false),
                    h3: ({ node, ...props }) => /*#__PURE__*/_jsxDEV("h3", { className: "text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 mt-3", ...props }, void 0, false),
                    h4: ({ node, ...props }) => /*#__PURE__*/_jsxDEV("h4", { className: "text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 mt-2", ...props }, void 0, false),
                    p: ({ node, ...props }) => /*#__PURE__*/_jsxDEV("p", { className: "text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed", ...props }, void 0, false),
                    ul: ({ node, ...props }) => /*#__PURE__*/_jsxDEV("ul", { className: "list-disc list-inside space-y-1 mb-3 text-sm text-gray-700 dark:text-gray-300", ...props }, void 0, false),
                    ol: ({ node, ...props }) => /*#__PURE__*/_jsxDEV("ol", { className: "list-decimal list-inside space-y-1 mb-3 text-sm text-gray-700 dark:text-gray-300", ...props }, void 0, false),
                    li: ({ node, ...props }) => /*#__PURE__*/_jsxDEV("li", { className: "ml-2", ...props }, void 0, false),
                    strong: ({ node, ...props }) => /*#__PURE__*/_jsxDEV("strong", { className: "font-semibold text-gray-900 dark:text-white", ...props }, void 0, false),
                    em: ({ node, ...props }) => /*#__PURE__*/_jsxDEV("em", { className: "italic text-gray-800 dark:text-gray-200", ...props }, void 0, false),
                    code: ({ node, inline, ...props }) =>
                    inline ? /*#__PURE__*/
                    _jsxDEV("code", { className: "px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-purple-600 dark:text-purple-400 text-xs font-mono", ...props }, void 0, false) : /*#__PURE__*/

                    _jsxDEV("code", { className: "block p-3 rounded-lg bg-gray-900 dark:bg-gray-800 text-gray-100 text-xs font-mono overflow-x-auto mb-3", ...props }, void 0, false),

                    pre: ({ node, ...props }) => /*#__PURE__*/_jsxDEV("pre", { className: "mb-3", ...props }, void 0, false),
                    blockquote: ({ node, ...props }) => /*#__PURE__*/_jsxDEV("blockquote", { className: "border-l-4 border-purple-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-3", ...props }, void 0, false)
                  }, children:

                  aiAnalysis.analysis }, void 0, false
                ) }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ),


        aiAnalysis.key_findings && aiAnalysis.key_findings.length > 0 && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.2 },
          className: "p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-3 mb-4", children: [/*#__PURE__*/
            _jsxDEV(ChartBarIcon, { className: "h-5 w-5 text-blue-600" }, void 0, false), /*#__PURE__*/
            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Key Findings" }, void 0, false

            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-3", children:
            aiAnalysis.key_findings.map((finding, index) => /*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0, x: -10 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: index * 0.05 },
              className: "flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "p-1 rounded-full bg-blue-100 dark:bg-blue-900/30 mt-0.5", children: /*#__PURE__*/
                _jsxDEV(LightBulbIcon, { className: "h-4 w-4 text-blue-600 dark:text-blue-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-700 dark:text-gray-300 flex-1", children: finding }, void 0, false)] }, index, true
            )
            ) }, void 0, false
          )] }, void 0, true
        ),



        aiAnalysis.priority_actions && aiAnalysis.priority_actions.length > 0 && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.3 },
          className: "p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-3 mb-4", children: [/*#__PURE__*/
            _jsxDEV(BoltIcon, { className: "h-5 w-5 text-amber-600" }, void 0, false), /*#__PURE__*/
            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Priority Actions" }, void 0, false

            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-3", children:
            aiAnalysis.priority_actions.map((action, index) => {
              const isApplied = appliedActions.has(index);
              return (/*#__PURE__*/
                _jsxDEV(motion.div, {

                  initial: { opacity: 0, x: -10 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: index * 0.05 },
                  className: `flex items-start justify-between gap-4 p-4 rounded-xl border transition-all ${
                  isApplied ?
                  'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50' :
                  'bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600/50'}`, children: [/*#__PURE__*/


                  _jsxDEV("div", { className: "flex items-start gap-3 flex-1", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${
                      priorityColors[action.priority.toLowerCase()] || priorityColors.medium}`, children:

                      action.priority }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: `text-sm flex-1 ${
                      isApplied ?
                      'text-green-700 dark:text-green-400 line-through' :
                      'text-gray-700 dark:text-gray-300'}`, children:

                      action.action }, void 0, false
                    )] }, void 0, true
                  ),
                  !isApplied ? /*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    onClick: () => handleApplyAction(index),
                    className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium shadow-lg shadow-green-500/25 whitespace-nowrap", children: [/*#__PURE__*/

                    _jsxDEV(CheckCircleIcon, { className: "h-4 w-4" }, void 0, false), "Mark Done"] }, void 0, true

                  ) : /*#__PURE__*/

                  _jsxDEV("span", { className: "flex items-center gap-1.5 px-3 py-1.5 text-green-600 dark:text-green-400 text-sm font-medium", children: [/*#__PURE__*/
                    _jsxDEV(CheckCircleIcon, { className: "h-4 w-4" }, void 0, false), "Completed"] }, void 0, true

                  )] }, index, true

                ));

            }) }, void 0, false
          )] }, void 0, true
        ),



        aiAnalysis.estimated_monthly_impact > 0 && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.4 },
          className: "p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/50", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50", children: /*#__PURE__*/
                _jsxDEV(ArrowTrendingUpIcon, { className: "h-6 w-6 text-blue-600 dark:text-blue-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-lg font-semibold text-blue-800 dark:text-blue-300", children: "Resource Efficiency Impact" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-blue-600 dark:text-blue-400", children: "Potential waste reduction from right-sizing" }, void 0, false

                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "text-right", children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-3xl font-bold text-blue-600 dark:text-blue-400", children: ["~$",
                aiAnalysis.estimated_monthly_impact.toLocaleString()] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-blue-500 dark:text-blue-400", children: "per month (est., non-billing)" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true

      ) : /*#__PURE__*/

      _jsxDEV(motion.div, {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "p-8 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 text-center", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "p-4 rounded-2xl bg-gray-100 dark:bg-slate-700 w-fit mx-auto mb-4", children: /*#__PURE__*/
          _jsxDEV(SparklesIcon, { className: "h-8 w-8 text-gray-400" }, void 0, false) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "No AI Analysis Available" }, void 0, false

        ), /*#__PURE__*/
        _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-4", children: "Click \"Refresh Analysis\" to generate AI-powered optimization recommendations" }, void 0, false

        ), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: () => analyzeWithAI(activeFocus),
          className: "px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors", children:
          "Generate Analysis" }, void 0, false

        )] }, void 0, true
      )] }, void 0, true

    ));

}
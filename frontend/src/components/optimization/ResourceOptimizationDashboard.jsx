import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { optimizationApi, kubernetesApi } from '../../services/api';
import { logger } from '../../utils/logger';








import {
  ArrowPathIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  CpuChipIcon,
  CircleStackIcon,
  ArrowsPointingOutIcon,
  CubeIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  XMarkIcon,
  LightBulbIcon,
  BoltIcon,
  WrenchScrewdriverIcon,
  PlayIcon,
  EyeIcon } from
'@heroicons/react/24/outline';

// Import shared utilities
import { formatBytes, formatCurrency } from '../../utils/constants';

// Local utility for millicores formatting
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";function formatMillicores(m) {
  if (m >= 1000) return `${(m / 1000).toFixed(1)} cores`;
  return `${m}m`;
}

// Copy Button
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (/*#__PURE__*/
    _jsxDEV("button", { onClick: handleCopy, className: "p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded", title: "Copy", children:
      copied ? /*#__PURE__*/_jsxDEV(CheckIcon, { className: "h-4 w-4 text-green-500" }, void 0, false) : /*#__PURE__*/_jsxDEV(ClipboardDocumentIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false) }, void 0, false
    ));

}

// Action Button
function ActionButton({ command, label, onExecuted }) {
  const [status, setStatus] = useState('idle');

  const handleExecute = async () => {
    setStatus('loading');
    try {
      const res = await kubernetesApi.executeKubectl({ command });
      if (res.data.success) {
        setStatus('success');
        onExecuted?.();
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (/*#__PURE__*/
    _jsxDEV("button", {
      onClick: handleExecute,
      disabled: status === 'loading' || status === 'success',
      className: `px-3 py-1 text-xs font-medium rounded transition-colors ${
      status === 'success' ? 'bg-green-500 text-white' :
      status === 'error' ? 'bg-red-500 text-white' :
      'bg-primary-600 hover:bg-primary-700 text-white'} disabled:opacity-50`, children:


      status === 'loading' ? 'Applying...' : status === 'success' ? 'Done!' : status === 'error' ? 'Failed' : label }, void 0, false
    ));

}

// Severity Badge
function SeverityBadge({ severity }) {
  const colors = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    info: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  };
  return (/*#__PURE__*/
    _jsxDEV("span", { className: `px-2 py-0.5 text-xs font-medium rounded ${colors[severity] || colors.info}`, children:
      severity.toUpperCase() }, void 0, false
    ));

}

// Optimization Category Card
function CategoryCard({
  icon: Icon,
  title,
  count,
  status,
  onClick,
  active







}) {
  const statusColors = {
    good: 'border-green-500 bg-green-50 dark:bg-green-900/20',
    warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    critical: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    info: 'border-gray-300 bg-gray-50 dark:bg-slate-700 dark:border-slate-600'
  };

  const iconColors = {
    good: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    critical: 'text-red-600 dark:text-red-400',
    info: 'text-gray-600 dark:text-gray-400'
  };

  return (/*#__PURE__*/
    _jsxDEV("button", {
      onClick: onClick,
      className: `p-4 rounded-lg border-2 text-left transition-all ${
      active ? 'ring-2 ring-primary-500 border-primary-500' : statusColors[status]}`, children: /*#__PURE__*/


      _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
        _jsxDEV(Icon, { className: `h-6 w-6 ${iconColors[status]}` }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: title }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
            count, " ", count === 1 ? 'issue' : 'issues'] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// AI Analysis Panel Component
function AIAnalysisPanel({
  isOpen,
  onClose,
  analysis,
  loading,
  onRefresh






}) {
  if (!isOpen) return null;

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "fixed inset-0 z-50 overflow-hidden", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "absolute inset-0 bg-black/50", onClick: onClose }, void 0, false), /*#__PURE__*/
      _jsxDEV("div", { className: "absolute right-0 top-0 h-full w-full max-w-xl bg-white dark:bg-slate-800 shadow-xl overflow-y-auto", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4 flex items-center justify-between z-10", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30", children: /*#__PURE__*/
              _jsxDEV(SparklesIcon, { className: "h-5 w-5 text-purple-600 dark:text-purple-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "AI Analysis" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "AI-powered optimization insights" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV("button", {
              onClick: onRefresh,
              disabled: loading,
              className: "p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50", children: /*#__PURE__*/

              _jsxDEV(ArrowPathIcon, { className: `h-5 w-5 ${loading ? 'animate-spin' : ''}` }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: onClose,
              className: "p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: /*#__PURE__*/

              _jsxDEV(XMarkIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "p-4 space-y-4", children:
          loading ? /*#__PURE__*/
          _jsxDEV("div", { className: "flex flex-col items-center justify-center py-12", children: [/*#__PURE__*/
            _jsxDEV(SparklesIcon, { className: "h-12 w-12 text-purple-500 animate-pulse mb-4" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-600 dark:text-gray-400", children: "AI is analyzing your cluster..." }, void 0, false)] }, void 0, true
          ) :
          analysis ? /*#__PURE__*/
          _jsxDEV(_Fragment, { children: [/*#__PURE__*/

            _jsxDEV("div", { className: "p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200/50 dark:border-purple-700/50", children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-2", children: "Summary" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap", children:
                analysis.analysis }, void 0, false
              )] }, void 0, true
            ),


            analysis.key_findings && analysis.key_findings.length > 0 && /*#__PURE__*/
            _jsxDEV("div", { className: "p-4 rounded-xl bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2 mb-3", children: [/*#__PURE__*/
                _jsxDEV(LightBulbIcon, { className: "h-4 w-4 text-blue-600" }, void 0, false), /*#__PURE__*/
                _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: "Key Findings" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("ul", { className: "space-y-2", children:
                analysis.key_findings.map((finding, idx) => /*#__PURE__*/
                _jsxDEV("li", { className: "flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-blue-500 mt-1", children: "•" }, void 0, false),
                  finding] }, idx, true
                )
                ) }, void 0, false
              )] }, void 0, true
            ),



            analysis.priority_actions && analysis.priority_actions.length > 0 && /*#__PURE__*/
            _jsxDEV("div", { className: "p-4 rounded-xl bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2 mb-3", children: [/*#__PURE__*/
                _jsxDEV(BoltIcon, { className: "h-4 w-4 text-amber-600" }, void 0, false), /*#__PURE__*/
                _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: "Priority Actions" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-2", children:
                analysis.priority_actions.map((action, idx) => /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-slate-600/50", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: `px-1.5 py-0.5 text-[10px] font-medium rounded ${
                    action.priority.toLowerCase() === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    action.priority.toLowerCase() === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`, children:

                    action.priority }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-700 dark:text-gray-300 flex-1", children: action.action }, void 0, false)] }, idx, true
                )
                ) }, void 0, false
              )] }, void 0, true
            ),



            analysis.estimated_monthly_impact > 0 && /*#__PURE__*/
            _jsxDEV("div", { className: "p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/50", children: /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h3", { className: "text-sm font-semibold text-blue-800 dark:text-blue-300", children: "Efficiency Impact" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-blue-600 dark:text-blue-400", children: "per month (est.)" }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-2xl font-bold text-blue-600 dark:text-blue-400", children: ["~$",
                  analysis.estimated_monthly_impact.toLocaleString()] }, void 0, true
                )] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/



            _jsxDEV(Link, {
              to: "/optimization/ai",
              className: "block w-full p-3 text-center text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors", children:
              "Open AI Optimization Hub for detailed analysis →" }, void 0, false

            )] }, void 0, true
          ) : /*#__PURE__*/

          _jsxDEV("div", { className: "text-center py-12", children: [/*#__PURE__*/
            _jsxDEV(SparklesIcon, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: "No analysis available" }, void 0, false), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: onRefresh,
              className: "px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors", children:
              "Generate Analysis" }, void 0, false

            )] }, void 0, true
          ) }, void 0, false

        )] }, void 0, true
      )] }, void 0, true
    ));

}

// Apply Optimization Modal Component







function ApplyOptimizationModal({ isOpen, onClose, pod, onSuccess }) {
  const [mode, setMode] = useState('preview');
  const [loading, setLoading] = useState(false);
  const [previewResult, setPreviewResult] = useState(null);
  const [applyResult, setApplyResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && pod) {
      handlePreview();
    }
  }, [isOpen, pod]);

  if (!isOpen || !pod) return null;

  const container = pod.containers[0];
  if (!container) return null;

  const cpuRecommendation = container.cpu_recommendation_millicores ?
  `${container.cpu_recommendation_millicores}m` :
  undefined;
  const memoryRecommendation = container.memory_recommendation_bytes ?
  `${Math.ceil(container.memory_recommendation_bytes / (1024 * 1024))}Mi` :
  undefined;

  const handlePreview = async () => {
    setLoading(true);
    setError(null);
    try {
      const request = {
        namespace: pod.namespace,
        resource_kind: pod.owner_kind || 'Deployment',
        resource_name: pod.owner_name || pod.name,
        container_name: container.container_name,
        cpu_request: cpuRecommendation,
        memory_request: memoryRecommendation,
        dry_run: true
      };
      const res = await optimizationApi.previewOptimization(request);
      setPreviewResult(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to preview changes');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setLoading(true);
    setError(null);
    try {
      const request = {
        namespace: pod.namespace,
        resource_kind: pod.owner_kind || 'Deployment',
        resource_name: pod.owner_name || pod.name,
        container_name: container.container_name,
        cpu_request: cpuRecommendation,
        memory_request: memoryRecommendation,
        dry_run: false
      };
      const res = await optimizationApi.applyOptimization(request);
      setApplyResult(res.data);
      if (res.data.success) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply changes');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPreviewResult(null);
    setApplyResult(null);
    setError(null);
    setMode('preview');
    onClose();
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "fixed inset-0 z-50 overflow-hidden", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "absolute inset-0 bg-black/50", onClick: handleClose }, void 0, false), /*#__PURE__*/
      _jsxDEV("div", { className: "absolute inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2 rounded-lg bg-green-100 dark:bg-green-900/30", children: /*#__PURE__*/
              _jsxDEV(WrenchScrewdriverIcon, { className: "h-5 w-5 text-green-600 dark:text-green-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Apply Optimization" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: [
                pod.owner_name || pod.name, " / ", pod.namespace] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("button", { onClick: handleClose, className: "p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: /*#__PURE__*/
            _jsxDEV(XMarkIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "p-6 space-y-4 max-h-[60vh] overflow-y-auto", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50", children: [/*#__PURE__*/
              _jsxDEV("h4", { className: "text-sm font-medium text-red-800 dark:text-red-300 mb-2", children: "Current Values" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-1 text-sm", children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-red-700 dark:text-red-400", children: ["CPU Request: ", /*#__PURE__*/
                  _jsxDEV("span", { className: "font-mono", children: formatMillicores(pod.total_cpu_request_millicores) }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-red-700 dark:text-red-400", children: ["Memory Request: ", /*#__PURE__*/
                  _jsxDEV("span", { className: "font-mono", children: formatBytes(pod.total_memory_request_bytes) }, void 0, false)] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50", children: [/*#__PURE__*/
              _jsxDEV("h4", { className: "text-sm font-medium text-green-800 dark:text-green-300 mb-2", children: "Recommended Values" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-1 text-sm", children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-green-700 dark:text-green-400", children: ["CPU Request: ", /*#__PURE__*/
                  _jsxDEV("span", { className: "font-mono", children: cpuRecommendation || 'N/A' }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-green-700 dark:text-green-400", children: ["Memory Request: ", /*#__PURE__*/
                  _jsxDEV("span", { className: "font-mono", children: memoryRecommendation || 'N/A' }, void 0, false)] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50", children: /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-sm font-medium text-green-800 dark:text-green-300", children: "Estimated Monthly Savings" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-green-600 dark:text-green-400", children: "After applying this optimization" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children:
                formatCurrency(pod.potential_savings * 720) }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          ),


          loading && /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-center py-8", children: [/*#__PURE__*/
            _jsxDEV(ArrowPathIcon, { className: "h-6 w-6 animate-spin text-gray-400 mr-2" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "text-gray-600 dark:text-gray-400", children:
              mode === 'preview' ? 'Previewing changes...' : 'Applying changes...' }, void 0, false
            )] }, void 0, true
          ),


          error && /*#__PURE__*/
          _jsxDEV("div", { className: "p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50", children: /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-red-700 dark:text-red-400", children: error }, void 0, false) }, void 0, false
          ),


          previewResult && !applyResult && /*#__PURE__*/
          _jsxDEV("div", { className: "p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
              _jsxDEV(EyeIcon, { className: "h-4 w-4 text-blue-600" }, void 0, false), /*#__PURE__*/
              _jsxDEV("h4", { className: "text-sm font-medium text-blue-800 dark:text-blue-300", children: "Preview Result" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-blue-700 dark:text-blue-400", children: previewResult.message }, void 0, false),
            previewResult.changes_applied && Object.keys(previewResult.changes_applied).length > 0 && /*#__PURE__*/
            _jsxDEV("div", { className: "mt-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg", children: /*#__PURE__*/
              _jsxDEV("pre", { className: "text-xs text-blue-800 dark:text-blue-300 overflow-x-auto", children:
                JSON.stringify(previewResult.changes_applied, null, 2) }, void 0, false
              ) }, void 0, false
            )] }, void 0, true

          ),


          applyResult && /*#__PURE__*/
          _jsxDEV("div", { className: `p-4 rounded-xl border ${
            applyResult.success ?
            'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50' :
            'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50'}`, children: [/*#__PURE__*/

            _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [
              applyResult.success ? /*#__PURE__*/
              _jsxDEV(CheckCircleIcon, { className: "h-5 w-5 text-green-600" }, void 0, false) : /*#__PURE__*/

              _jsxDEV(XCircleIcon, { className: "h-5 w-5 text-red-600" }, void 0, false), /*#__PURE__*/

              _jsxDEV("h4", { className: `text-sm font-medium ${
                applyResult.success ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`, children:

                applyResult.success ? 'Successfully Applied!' : 'Failed to Apply' }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: `text-sm ${
              applyResult.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`, children:

              applyResult.message }, void 0, false
            )] }, void 0, true
          )] }, void 0, true

        ), /*#__PURE__*/


        _jsxDEV("div", { className: "px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-end gap-3", children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: handleClose,
            className: "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors", children:

            applyResult?.success ? 'Close' : 'Cancel' }, void 0, false
          ),
          !applyResult?.success && /*#__PURE__*/
          _jsxDEV("button", {
            onClick: handleApply,
            disabled: loading || !previewResult,
            className: "flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg shadow-lg shadow-green-500/25 disabled:opacity-50 transition-all", children: [/*#__PURE__*/

            _jsxDEV(PlayIcon, { className: "h-4 w-4" }, void 0, false), "Apply Changes"] }, void 0, true

          )] }, void 0, true

        )] }, void 0, true
      )] }, void 0, true
    ));

}

// Main Component
export default function ResourceOptimizationDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('compute');

  // AI Analysis state
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await optimizationApi.getDashboard();
      setDashboardData(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadAIAnalysis = async () => {
    setAiLoading(true);
    try {
      const res = await optimizationApi.getAIAnalysis({ focus_area: 'efficiency' });
      if (res.data.success) {
        setAiAnalysis(res.data);
      }
    } catch (err) {
      logger.error('Failed to load AI analysis', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleOpenAIPanel = () => {
    setShowAIPanel(true);
    if (!aiAnalysis) {
      loadAIAnalysis();
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
        _jsxDEV("button", { onClick: loadData, className: "mt-2 text-sm underline", children: "Retry" }, void 0, false)] }, void 0, true
      ));

  }

  if (!dashboardData) return null;

  const { summary, recommendations, idle_resources, top_wasteful_pods, top_underprovisioned_pods } = dashboardData;
  const totalMonthlySavings = summary.total_potential_savings * 720;

  // Categorize recommendations
  const computeIssues = recommendations.filter((r) => ['over_provisioned', 'under_provisioned', 'idle_resource'].includes(r.type));
  const deploymentIssues = recommendations.filter((r) => ['no_limits', 'no_requests'].includes(r.type));

  // Scaling issues: workloads at high utilization that may need HPA/VPA
  const scalingCandidates = top_underprovisioned_pods.length;

  // Storage optimization is not yet implemented in backend
  const storageIssueCount = 0;

  const categories = [
  { id: 'compute', icon: CpuChipIcon, title: 'Compute & Memory', count: computeIssues.length, status: computeIssues.length > 5 ? 'critical' : computeIssues.length > 0 ? 'warning' : 'good' },
  { id: 'scaling', icon: ArrowsPointingOutIcon, title: 'Scaling', count: scalingCandidates, status: scalingCandidates > 0 ? 'warning' : 'good' },
  { id: 'storage', icon: CircleStackIcon, title: 'Storage', count: storageIssueCount, status: 'info' },
  { id: 'deployment', icon: CubeIcon, title: 'Deployment', count: deploymentIssues.length, status: deploymentIssues.length > 5 ? 'critical' : deploymentIssues.length > 0 ? 'warning' : 'good' },
  { id: 'cost', icon: CurrencyDollarIcon, title: 'Cost', count: 0, status: totalMonthlySavings > 100 ? 'warning' : 'good' }];


  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Optimization" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Analyze and optimize your Kubernetes resources" }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: handleOpenAIPanel,
            className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/25 transition-all", children: [/*#__PURE__*/

            _jsxDEV(SparklesIcon, { className: "h-4 w-4" }, void 0, false), "AI Analysis"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: loadData,
            className: "p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: /*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-5 gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Pods Analyzed" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: summary.analyzed_pods }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Optimal" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-green-600", children: summary.optimal_pods }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Issues Found" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-orange-600", children:
            summary.over_provisioned_pods + summary.under_provisioned_pods + summary.idle_pods }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Efficiency" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-primary-600", children: [summary.cluster_efficiency_score.score.toFixed(0), "%"] }, void 0, true)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Potential Savings" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-green-600", children: [formatCurrency(totalMonthlySavings), "/mo"] }, void 0, true)] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-5 gap-4", children:
        categories.map((cat) => /*#__PURE__*/
        _jsxDEV(CategoryCard, {

          icon: cat.icon,
          title: cat.title,
          count: cat.count,
          status: cat.status,
          onClick: () => setActiveCategory(cat.id),
          active: activeCategory === cat.id }, cat.id, false
        )
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700", children: [
        activeCategory === 'compute' && /*#__PURE__*/
        _jsxDEV(ComputeOptimization, {
          idleResources: idle_resources,
          wastefulPods: top_wasteful_pods,
          underprovisionedPods: top_underprovisioned_pods,
          onRefresh: loadData }, void 0, false
        ),

        activeCategory === 'scaling' && /*#__PURE__*/
        _jsxDEV(ScalingOptimization, { pods: top_underprovisioned_pods }, void 0, false),

        activeCategory === 'storage' && /*#__PURE__*/
        _jsxDEV(StorageOptimization, {}, void 0, false),

        activeCategory === 'deployment' && /*#__PURE__*/
        _jsxDEV(DeploymentOptimization, { recommendations: deploymentIssues }, void 0, false),

        activeCategory === 'cost' && /*#__PURE__*/
        _jsxDEV(CostOptimization, {
          summary: summary,
          recommendations: recommendations,
          totalSavings: totalMonthlySavings }, void 0, false
        )] }, void 0, true

      ), /*#__PURE__*/


      _jsxDEV(AIAnalysisPanel, {
        isOpen: showAIPanel,
        onClose: () => setShowAIPanel(false),
        analysis: aiAnalysis,
        loading: aiLoading,
        onRefresh: loadAIAnalysis }, void 0, false
      )] }, void 0, true
    ));

}

// Compute Optimization Panel
function ComputeOptimization({
  idleResources,
  wastefulPods,
  underprovisionedPods,
  onRefresh





}) {
  const [tab, setTab] = useState('idle');

  return (/*#__PURE__*/
    _jsxDEV("div", { children: [/*#__PURE__*/
      _jsxDEV("div", { className: "px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center gap-4", children: [/*#__PURE__*/
        _jsxDEV(CpuChipIcon, { className: "h-5 w-5 text-primary-600" }, void 0, false), /*#__PURE__*/
        _jsxDEV("h2", { className: "font-semibold text-gray-900 dark:text-white", children: "Compute & Memory Optimization" }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "px-4 pt-3 flex gap-2 border-b border-gray-200 dark:border-slate-700", children:
        [
        { id: 'idle', label: 'Idle Resources', count: idleResources.length, color: 'text-orange-600' },
        { id: 'over', label: 'Over-Provisioned', count: wastefulPods.length, color: 'text-yellow-600' },
        { id: 'under', label: 'Under-Provisioned', count: underprovisionedPods.length, color: 'text-red-600' }].
        map((t) => /*#__PURE__*/
        _jsxDEV("button", {

          onClick: () => setTab(t.id),
          className: `px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
          tab === t.id ?
          'border-primary-500 text-primary-600' :
          'border-transparent text-gray-500 hover:text-gray-700'}`, children: [


          t.label, /*#__PURE__*/
          _jsxDEV("span", { className: `ml-2 px-1.5 py-0.5 text-xs rounded ${t.color} bg-opacity-10`, children:
            t.count }, void 0, false
          )] }, t.id, true
        )
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "p-4", children: [
        tab === 'idle' && /*#__PURE__*/_jsxDEV(IdleResourcesList, { resources: idleResources, onRefresh: onRefresh }, void 0, false),
        tab === 'over' && /*#__PURE__*/_jsxDEV(WastefulPodsList, { pods: wastefulPods, onRefresh: onRefresh }, void 0, false),
        tab === 'under' && /*#__PURE__*/_jsxDEV(UnderprovisionedPodsList, { pods: underprovisionedPods, onRefresh: onRefresh }, void 0, false)] }, void 0, true
      )] }, void 0, true
    ));

}

// Idle Resources List
function IdleResourcesList({ resources, onRefresh }) {
  if (resources.length === 0) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "text-center py-8 text-gray-500", children: [/*#__PURE__*/
        _jsxDEV(CheckCircleIcon, { className: "h-12 w-12 mx-auto mb-2 text-green-500" }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { children: "No idle resources detected" }, void 0, false)] }, void 0, true
      ));

  }

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-sm text-orange-700 dark:text-orange-400", children: [/*#__PURE__*/
        _jsxDEV(ExclamationTriangleIcon, { className: "h-4 w-4 inline mr-2" }, void 0, false), "These resources are using less than 5% of allocated capacity. Consider scaling down or removing."] }, void 0, true

      ), /*#__PURE__*/

      _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
        _jsxDEV("thead", { children: /*#__PURE__*/
          _jsxDEV("tr", { className: "text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "Resource" }, void 0, false), /*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "Namespace" }, void 0, false), /*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "CPU Usage" }, void 0, false), /*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "Memory Usage" }, void 0, false), /*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "Est. Savings" }, void 0, false), /*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "Action" }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700", children:
          resources.map((res) => {
            const scaleCmd = `scale ${res.owner_kind?.toLowerCase() || 'deployment'} ${res.owner_name || res.name} --replicas=0 -n ${res.namespace}`;
            const displayCmd = `kubectl ${scaleCmd}`;
            return (/*#__PURE__*/
              _jsxDEV("tr", { className: "text-sm", children: [/*#__PURE__*/
                _jsxDEV("td", { className: "py-3", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "font-medium text-gray-900 dark:text-white", children: res.owner_name || res.name }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { className: "text-xs text-gray-500", children: res.owner_kind || 'Pod' }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 text-gray-600 dark:text-gray-400", children: res.namespace }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-orange-600", children: [res.cpu_efficiency.score.toFixed(1), "%"] }, void 0, true), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-gray-400 text-xs ml-1", children: ["(",
                    formatMillicores(res.total_cpu_usage_millicores), "/", formatMillicores(res.total_cpu_request_millicores), ")"] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-orange-600", children: [res.memory_efficiency.score.toFixed(1), "%"] }, void 0, true), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-gray-400 text-xs ml-1", children: ["(",
                    formatBytes(res.total_memory_usage_bytes), "/", formatBytes(res.total_memory_request_bytes), ")"] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 text-green-600 font-medium", children: [
                  formatCurrency(res.current_hourly_cost * 720), "/mo"] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV(CopyButton, { text: displayCmd }, void 0, false), /*#__PURE__*/
                    _jsxDEV(ActionButton, { command: scaleCmd, label: "Scale Down", onExecuted: onRefresh }, void 0, false)] }, void 0, true
                  ) }, void 0, false
                )] }, res.name, true
              ));

          }) }, void 0, false
        )] }, void 0, true
      )] }, void 0, true
    ));

}

// Wasteful Pods List
function WastefulPodsList({ pods, onRefresh }) {
  const [selectedPod, setSelectedPod] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  if (pods.length === 0) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "text-center py-8 text-gray-500", children: [/*#__PURE__*/
        _jsxDEV(CheckCircleIcon, { className: "h-12 w-12 mx-auto mb-2 text-green-500" }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { children: "No over-provisioned resources detected" }, void 0, false)] }, void 0, true
      ));

  }

  const handleApplyClick = (pod) => {
    setSelectedPod(pod);
    setShowApplyModal(true);
  };

  const handleApplySuccess = () => {
    setShowApplyModal(false);
    setSelectedPod(null);
    onRefresh();
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-sm text-yellow-700 dark:text-yellow-400", children: [/*#__PURE__*/
        _jsxDEV(ExclamationTriangleIcon, { className: "h-4 w-4 inline mr-2" }, void 0, false), "These resources are using less than 30% of requested capacity. Right-size to reduce costs."] }, void 0, true

      ), /*#__PURE__*/

      _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
        _jsxDEV("thead", { children: /*#__PURE__*/
          _jsxDEV("tr", { className: "text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "Resource" }, void 0, false), /*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "Namespace" }, void 0, false), /*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "CPU Efficiency" }, void 0, false), /*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "Memory Efficiency" }, void 0, false), /*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "Recommendation" }, void 0, false), /*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "Savings" }, void 0, false), /*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "Action" }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700", children:
          pods.map((pod) => /*#__PURE__*/
          _jsxDEV("tr", { className: "text-sm", children: [/*#__PURE__*/
            _jsxDEV("td", { className: "py-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "font-medium text-gray-900 dark:text-white", children: pod.owner_name || pod.name }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "text-xs text-gray-500", children: pod.owner_kind || 'Pod' }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("td", { className: "py-3 text-gray-600 dark:text-gray-400", children: pod.namespace }, void 0, false), /*#__PURE__*/
            _jsxDEV("td", { className: "py-3", children: /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "w-16 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /*#__PURE__*/
                  _jsxDEV("div", {
                    className: "h-full bg-yellow-500",
                    style: { width: `${Math.min(pod.cpu_efficiency.score, 100)}%` } }, void 0, false
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("span", { className: "text-yellow-600", children: [pod.cpu_efficiency.score.toFixed(0), "%"] }, void 0, true)] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("td", { className: "py-3", children: /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "w-16 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /*#__PURE__*/
                  _jsxDEV("div", {
                    className: "h-full bg-yellow-500",
                    style: { width: `${Math.min(pod.memory_efficiency.score, 100)}%` } }, void 0, false
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("span", { className: "text-yellow-600", children: [pod.memory_efficiency.score.toFixed(0), "%"] }, void 0, true)] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("td", { className: "py-3 text-xs", children:
              pod.containers[0] && /*#__PURE__*/
              _jsxDEV("span", { className: "text-gray-600 dark:text-gray-400", children: ["CPU: ",
                formatMillicores(pod.total_cpu_request_millicores), " → ", formatMillicores(pod.containers[0].cpu_recommendation_millicores || 0), /*#__PURE__*/
                _jsxDEV("br", {}, void 0, false), "Mem: ",
                formatBytes(pod.total_memory_request_bytes), " → ", formatBytes(pod.containers[0].memory_recommendation_bytes || 0)] }, void 0, true
              ) }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("td", { className: "py-3 text-green-600 font-medium", children: [
              formatCurrency(pod.potential_savings * 720), "/mo"] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("td", { className: "py-3", children: /*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => handleApplyClick(pod),
                className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg shadow-sm transition-all", children: [/*#__PURE__*/

                _jsxDEV(WrenchScrewdriverIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Apply Fix"] }, void 0, true

              ) }, void 0, false
            )] }, pod.name, true
          )
          ) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV(ApplyOptimizationModal, {
        isOpen: showApplyModal,
        onClose: () => {
          setShowApplyModal(false);
          setSelectedPod(null);
        },
        pod: selectedPod,
        onSuccess: handleApplySuccess }, void 0, false
      )] }, void 0, true
    ));

}

// Underprovisioned Pods List
function UnderprovisionedPodsList({ pods, onRefresh }) {
  const [selectedPod, setSelectedPod] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  if (pods.length === 0) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "text-center py-8 text-gray-500", children: [/*#__PURE__*/
        _jsxDEV(CheckCircleIcon, { className: "h-12 w-12 mx-auto mb-2 text-green-500" }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { children: "No under-provisioned resources detected" }, void 0, false)] }, void 0, true
      ));

  }

  const handleApplyClick = (pod) => {
    setSelectedPod(pod);
    setShowApplyModal(true);
  };

  const handleApplySuccess = () => {
    setShowApplyModal(false);
    setSelectedPod(null);
    onRefresh();
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-sm text-red-700 dark:text-red-400", children: [/*#__PURE__*/
        _jsxDEV(ExclamationCircleIcon, { className: "h-4 w-4 inline mr-2" }, void 0, false), "These resources are at risk of throttling or OOM kills. Consider increasing limits."] }, void 0, true

      ), /*#__PURE__*/

      _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
        _jsxDEV("thead", { children: /*#__PURE__*/
          _jsxDEV("tr", { className: "text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "Resource" }, void 0, false), /*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "Namespace" }, void 0, false), /*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "CPU Usage" }, void 0, false), /*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "Memory Usage" }, void 0, false), /*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "Risk Level" }, void 0, false), /*#__PURE__*/
            _jsxDEV("th", { className: "pb-2 font-medium", children: "Action" }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700", children:
          pods.map((pod) => /*#__PURE__*/
          _jsxDEV("tr", { className: "text-sm", children: [/*#__PURE__*/
            _jsxDEV("td", { className: "py-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "font-medium text-gray-900 dark:text-white", children: pod.owner_name || pod.name }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "text-xs text-gray-500", children: pod.owner_kind || 'Pod' }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("td", { className: "py-3 text-gray-600 dark:text-gray-400", children: pod.namespace }, void 0, false), /*#__PURE__*/
            _jsxDEV("td", { className: "py-3", children: /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "w-16 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /*#__PURE__*/
                  _jsxDEV("div", {
                    className: "h-full bg-red-500",
                    style: { width: `${Math.min(pod.cpu_efficiency.score, 100)}%` } }, void 0, false
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("span", { className: "text-red-600", children: [pod.cpu_efficiency.score.toFixed(0), "%"] }, void 0, true)] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("td", { className: "py-3", children: /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "w-16 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /*#__PURE__*/
                  _jsxDEV("div", {
                    className: "h-full bg-red-500",
                    style: { width: `${Math.min(pod.memory_efficiency.score, 100)}%` } }, void 0, false
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("span", { className: "text-red-600", children: [pod.memory_efficiency.score.toFixed(0), "%"] }, void 0, true)] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("td", { className: "py-3", children: /*#__PURE__*/
              _jsxDEV(SeverityBadge, { severity: "high" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("td", { className: "py-3", children: /*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => handleApplyClick(pod),
                className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-sm transition-all", children: [/*#__PURE__*/

                _jsxDEV(WrenchScrewdriverIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Increase"] }, void 0, true

              ) }, void 0, false
            )] }, pod.name, true
          )
          ) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV(ApplyOptimizationModal, {
        isOpen: showApplyModal,
        onClose: () => {
          setShowApplyModal(false);
          setSelectedPod(null);
        },
        pod: selectedPod,
        onSuccess: handleApplySuccess }, void 0, false
      )] }, void 0, true
    ));

}

// Scaling Optimization Panel
function ScalingOptimization({ pods }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { children: [/*#__PURE__*/
      _jsxDEV("div", { className: "px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center gap-4", children: [/*#__PURE__*/
        _jsxDEV(ArrowsPointingOutIcon, { className: "h-5 w-5 text-primary-600" }, void 0, false), /*#__PURE__*/
        _jsxDEV("h2", { className: "font-semibold text-gray-900 dark:text-white", children: "Scaling Optimization" }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "p-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm text-blue-700 dark:text-blue-400", children: [/*#__PURE__*/
          _jsxDEV(SparklesIcon, { className: "h-4 w-4 inline mr-2" }, void 0, false), /*#__PURE__*/
          _jsxDEV("strong", { children: "AI Recommendation:" }, void 0, false), " Based on usage patterns, consider adding HPA to high-traffic deployments."] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "mt-4 space-y-4", children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-sm font-medium text-gray-900 dark:text-white", children: "Scaling Recommendations" }, void 0, false),

          pods.length > 0 ? /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-2", children:
            pods.slice(0, 5).map((pod) => /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("p", { className: "font-medium text-gray-900 dark:text-white", children: pod.owner_name || pod.name }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-500", children: pod.namespace }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "text-right", children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["CPU at ",
                  pod.cpu_efficiency.score.toFixed(0), "% capacity"] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-primary-600", children: "Consider HPA with minReplicas: 2" }, void 0, false)] }, void 0, true
              )] }, pod.name, true
            )
            ) }, void 0, false
          ) : /*#__PURE__*/

          _jsxDEV("div", { className: "text-center py-8 text-gray-500", children: [/*#__PURE__*/
            _jsxDEV(CheckCircleIcon, { className: "h-12 w-12 mx-auto mb-2 text-green-500" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { children: "No scaling issues detected" }, void 0, false)] }, void 0, true
          )] }, void 0, true

        )] }, void 0, true
      )] }, void 0, true
    ));

}

// Storage Optimization Panel
function StorageOptimization() {
  return (/*#__PURE__*/
    _jsxDEV("div", { children: [/*#__PURE__*/
      _jsxDEV("div", { className: "px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center gap-4", children: [/*#__PURE__*/
        _jsxDEV(CircleStackIcon, { className: "h-5 w-5 text-primary-600" }, void 0, false), /*#__PURE__*/
        _jsxDEV("h2", { className: "font-semibold text-gray-900 dark:text-white", children: "Storage Optimization" }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "p-4", children: /*#__PURE__*/
        _jsxDEV("div", { className: "text-center py-8 text-gray-500", children: [/*#__PURE__*/
          _jsxDEV(CircleStackIcon, { className: "h-12 w-12 mx-auto mb-2 text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { children: "Storage analysis coming soon" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-xs mt-1", children: "Will detect unused PVCs, over-allocated storage, and optimization opportunities" }, void 0, false)] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true
    ));

}

// Deployment Optimization Panel
function DeploymentOptimization({
  recommendations


}) {
  const noLimits = recommendations.filter((r) => r.type === 'no_limits');
  const noRequests = recommendations.filter((r) => r.type === 'no_requests');

  return (/*#__PURE__*/
    _jsxDEV("div", { children: [/*#__PURE__*/
      _jsxDEV("div", { className: "px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center gap-4", children: [/*#__PURE__*/
        _jsxDEV(CubeIcon, { className: "h-5 w-5 text-primary-600" }, void 0, false), /*#__PURE__*/
        _jsxDEV("h2", { className: "font-semibold text-gray-900 dark:text-white", children: "Deployment Optimization" }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "p-4 space-y-4", children: [

        noLimits.length > 0 && /*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(XCircleIcon, { className: "h-4 w-4 text-purple-600" }, void 0, false), "Missing Resource Limits (",
            noLimits.length, ")"] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-sm text-purple-700 dark:text-purple-400 mb-3", children: "These containers have no resource limits set, which can cause resource exhaustion." }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-2", children:
            noLimits.slice(0, 5).map((rec) => /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-sm", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: rec.resource_name }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 ml-2", children: ["/ ", rec.container_name] }, void 0, true), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-400 ml-2 text-xs", children: rec.namespace }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV(SeverityBadge, { severity: "medium" }, void 0, false)] }, rec.id, true
            )
            ) }, void 0, false
          )] }, void 0, true
        ),



        noRequests.length > 0 && /*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(XCircleIcon, { className: "h-4 w-4 text-blue-600" }, void 0, false), "Missing Resource Requests (",
            noRequests.length, ")"] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-400 mb-3", children: "These containers have no resource requests set, which can cause scheduling issues." }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-2", children:
            noRequests.slice(0, 5).map((rec) => /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-sm", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: rec.resource_name }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 ml-2", children: ["/ ", rec.container_name] }, void 0, true), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-400 ml-2 text-xs", children: rec.namespace }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV(SeverityBadge, { severity: "high" }, void 0, false)] }, rec.id, true
            )
            ) }, void 0, false
          )] }, void 0, true
        ),


        noLimits.length === 0 && noRequests.length === 0 && /*#__PURE__*/
        _jsxDEV("div", { className: "text-center py-8 text-gray-500", children: [/*#__PURE__*/
          _jsxDEV(CheckCircleIcon, { className: "h-12 w-12 mx-auto mb-2 text-green-500" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { children: "All deployments have proper resource configurations" }, void 0, false)] }, void 0, true
        )] }, void 0, true

      )] }, void 0, true
    ));

}

// Cost Optimization Panel
function CostOptimization({
  summary,
  recommendations,
  totalSavings




}) {
  const topSavings = [...recommendations].
  sort((a, b) => b.estimated_savings - a.estimated_savings).
  slice(0, 10);

  return (/*#__PURE__*/
    _jsxDEV("div", { children: [/*#__PURE__*/
      _jsxDEV("div", { className: "px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center gap-4", children: [/*#__PURE__*/
        _jsxDEV(CurrencyDollarIcon, { className: "h-5 w-5 text-primary-600" }, void 0, false), /*#__PURE__*/
        _jsxDEV("h2", { className: "font-semibold text-gray-900 dark:text-white", children: "Cost Optimization" }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "p-4 space-y-4", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4", children: /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-sm font-medium text-green-800 dark:text-green-300", children: "Total Potential Savings" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-green-600 dark:text-green-400", children: "If all recommendations are applied" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-3xl font-bold text-green-600", children: [formatCurrency(totalSavings), "/mo"] }, void 0, true)] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "grid grid-cols-3 gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700 rounded-lg p-3", children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Current Monthly Cost" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-lg font-bold text-gray-900 dark:text-white", children:
              formatCurrency(summary.total_current_hourly_cost * 720) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700 rounded-lg p-3", children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Idle Resource Cost" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-lg font-bold text-orange-600", children: [
              formatCurrency(summary.idle_pods * 30), " "] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700 rounded-lg p-3", children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Savings Percentage" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-lg font-bold text-green-600", children: [summary.total_savings_percentage.toFixed(0), "%"] }, void 0, true)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-sm font-medium text-gray-900 dark:text-white mb-3", children: "Top Savings Opportunities" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-2", children:
            topSavings.map((rec) => /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-sm", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-3", children: [
                rec.type === 'idle_resource' ? /*#__PURE__*/
                _jsxDEV(ArrowTrendingDownIcon, { className: "h-4 w-4 text-orange-500" }, void 0, false) : /*#__PURE__*/

                _jsxDEV(ArrowTrendingUpIcon, { className: "h-4 w-4 text-yellow-500" }, void 0, false), /*#__PURE__*/

                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "font-medium text-gray-900 dark:text-white", children: rec.resource_name }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500", children: [rec.namespace, " • ", rec.type.replace('_', ' ')] }, void 0, true)] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("span", { className: "font-bold text-green-600", children: [formatCurrency(rec.estimated_savings * 720), "/mo"] }, void 0, true)] }, rec.id, true
            )
            ) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      )] }, void 0, true
    ));

}
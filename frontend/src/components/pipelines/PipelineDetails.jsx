import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { pipelineLogger as logger } from '../../utils/logger';
import {
  ArrowLeftIcon,
  PlayIcon,
  PencilSquareIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  CommandLineIcon,
  UserCircleIcon,
  ExclamationTriangleIcon } from
'@heroicons/react/24/outline';
import usePipelineStore from '../../stores/pipelineStore';
import GlassCard from '../common/GlassCard';
import { DashboardSkeleton } from '../common/LoadingStates';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";







export default function PipelineDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedPipeline,
    runs,
    isLoading,
    error,
    fetchPipelineById,
    fetchRuns,
    triggerPipeline,
    clearError
  } = usePipelineStore();

  const [actionError, setActionError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPipelineById(id);
      fetchRuns(id);
    }
  }, [id, fetchPipelineById, fetchRuns]);

  // Auto-dismiss action error after 5 seconds
  useEffect(() => {
    if (actionError) {
      const timer = setTimeout(() => setActionError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [actionError]);

  const handleRun = async () => {
    if (!id || isRunning) return;
    try {
      setIsRunning(true);
      setActionError(null);
      const run = await triggerPipeline(id);
      navigate(`/pipelines/${id}/runs/${run.id}`);
    } catch (err) {
      setActionError(err.message || 'Failed to trigger pipeline');
      logger.error('Failed to trigger pipeline', err);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      success: {
        bg: 'bg-emerald-100 dark:bg-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-400',
        dot: 'bg-emerald-500',
        icon: /*#__PURE__*/_jsxDEV(CheckCircleIcon, { className: "h-4 w-4" }, void 0, false),
        gradient: 'from-emerald-500 to-emerald-600'
      },
      failed: {
        bg: 'bg-red-100 dark:bg-red-500/20',
        text: 'text-red-700 dark:text-red-400',
        dot: 'bg-red-500',
        icon: /*#__PURE__*/_jsxDEV(XCircleIcon, { className: "h-4 w-4" }, void 0, false),
        gradient: 'from-red-500 to-red-600'
      },
      running: {
        bg: 'bg-blue-100 dark:bg-blue-500/20',
        text: 'text-blue-700 dark:text-blue-400',
        dot: 'bg-blue-500 animate-pulse',
        icon: /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false),
        gradient: 'from-blue-500 to-blue-600'
      },
      pending: {
        bg: 'bg-amber-100 dark:bg-amber-500/20',
        text: 'text-amber-700 dark:text-amber-400',
        dot: 'bg-amber-500',
        icon: /*#__PURE__*/_jsxDEV(ClockIcon, { className: "h-4 w-4" }, void 0, false),
        gradient: 'from-amber-500 to-amber-600'
      }
    };
    return configs[status || 'pending'] || configs.pending;
  };

  const parseStagesFromYaml = () => {
    if (!selectedPipeline?.yaml) {
      return [
      { name: 'Build', status: 'pending' },
      { name: 'Test', status: 'pending' },
      { name: 'Deploy', status: 'pending' }];

    }

    try {
      const stagesMatch = selectedPipeline.yaml.match(/stages:\s*\n([\s\S]*?)(?=\n[a-z]|\n$|$)/i);
      if (stagesMatch) {
        const stagesText = stagesMatch[1];
        const stageNames = stagesText.match(/- name:\s*["']?([^"'\n]+)["']?/g);
        if (stageNames) {
          return stageNames.map((s) => ({
            name: s.replace(/- name:\s*["']?([^"'\n]+)["']?/, '$1').trim(),
            status: 'pending'
          }));
        }
      }
    } catch (e) {
      logger.error('Failed to parse stages', e);
    }

    return [
    { name: 'Build', status: 'pending' },
    { name: 'Test', status: 'pending' },
    { name: 'Deploy', status: 'pending' }];

  };

  const lastRun = runs.length > 0 ? runs[0] : null;
  const stages = lastRun?.stages || parseStagesFromYaml();
  const successRate = runs.length > 0 ?
  Math.round(runs.filter((r) => r.status === 'success').length / runs.length * 100) :
  0;

  const formatDuration = (duration) => {
    if (!duration || duration === '-') return '-';
    return duration;
  };

  const formatTrigger = (trigger) => {
    switch (trigger) {
      case 'push':return 'Git Push';
      case 'pull_request':return 'Pull Request';
      case 'manual':return 'Manual';
      case 'schedule':return 'Scheduled';
      default:return trigger || 'Manual';
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Never';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "p-6", children: /*#__PURE__*/
        _jsxDEV(DashboardSkeleton, {}, void 0, false) }, void 0, false
      ));

  }

  if (!selectedPipeline) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "h-full flex items-center justify-center p-6", children: /*#__PURE__*/
        _jsxDEV(GlassCard, { className: "text-center p-8", children: [/*#__PURE__*/
          _jsxDEV(RocketLaunchIcon, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children: "Pipeline not found" }, void 0, false), /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => navigate('/pipelines'),
            className: "mt-4 text-primary-600 hover:text-primary-700 font-medium", children:
            "Back to Pipelines" }, void 0, false

          )] }, void 0, true
        ) }, void 0, false
      ));

  }

  const statusConfig = getStatusConfig(selectedPipeline.status);

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "h-full flex flex-col overflow-hidden", children: [/*#__PURE__*/

      _jsxDEV(AnimatePresence, { children:
        (error || actionError) && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          className: "flex-shrink-0 px-6 py-3 bg-red-50 dark:bg-red-500/10 border-b border-red-200/50 dark:border-red-500/20", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2 text-red-700 dark:text-red-400", children: [/*#__PURE__*/
              _jsxDEV(ExclamationTriangleIcon, { className: "h-5 w-5" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-sm font-medium", children: error || actionError }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => {
                clearError();
                setActionError(null);
              },
              className: "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300", children: /*#__PURE__*/

              _jsxDEV(XCircleIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex-shrink-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-700/50 px-6 py-3", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              onClick: () => navigate('/pipelines'),
              className: "p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors", children: /*#__PURE__*/

              _jsxDEV(ArrowLeftIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: `p-1.5 rounded-lg bg-gradient-to-br ${statusConfig.gradient} text-white`, children: /*#__PURE__*/
                _jsxDEV(RocketLaunchIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("h1", { className: "text-lg font-bold text-gray-900 dark:text-white", children:
                selectedPipeline.name }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("span", { className: "px-2 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-xs font-mono text-gray-600 dark:text-gray-400", children:
                selectedPipeline.branch || 'main' }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`, children: [/*#__PURE__*/
                _jsxDEV("span", { className: `w-1.5 h-1.5 rounded-full ${statusConfig.dot}` }, void 0, false),
                selectedPipeline.status || 'pending'] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: isRunning ? 1 : 1.02 },
              whileTap: { scale: isRunning ? 1 : 0.98 },
              onClick: handleRun,
              disabled: isRunning,
              className: "flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed", children:

              isRunning ? /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(ArrowPathIcon, { className: "h-3.5 w-3.5 animate-spin" }, void 0, false), "Running..."] }, void 0, true

              ) : /*#__PURE__*/

              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(PlayIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Run"] }, void 0, true

              ) }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: () => navigate(`/pipelines/${id}/edit`),
              className: "flex items-center gap-1.5 px-3 py-1.5 text-gray-700 dark:text-gray-300 text-xs font-medium bg-white/50 dark:bg-slate-700/50 border border-gray-200/50 dark:border-slate-600/50 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all", children: [/*#__PURE__*/

              _jsxDEV(PencilSquareIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Edit"] }, void 0, true

            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex-shrink-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-b border-gray-100/50 dark:border-slate-700/50 px-6 py-3", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-between gap-6", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2 px-3 py-1.5 bg-white/60 dark:bg-slate-700/60 rounded-lg", children: [/*#__PURE__*/
              _jsxDEV(RocketLaunchIcon, { className: "h-4 w-4 text-primary-500" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: runs.length }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs text-gray-500", children: "runs" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2 px-3 py-1.5 bg-emerald-50/60 dark:bg-emerald-500/10 rounded-lg", children: [/*#__PURE__*/
              _jsxDEV(ChartBarIcon, { className: "h-4 w-4 text-emerald-500" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-sm font-semibold text-emerald-700 dark:text-emerald-400", children: [successRate, "%"] }, void 0, true), /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs text-emerald-600/70", children: "success" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2 px-3 py-1.5 bg-white/60 dark:bg-slate-700/60 rounded-lg", children: [/*#__PURE__*/
              _jsxDEV(ClockIcon, { className: "h-4 w-4 text-amber-500" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: selectedPipeline.duration || '-' }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs text-gray-500", children: "avg" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ),


          lastRun && /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Last run:" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusConfig(lastRun.status).bg} ${getStatusConfig(lastRun.status).text}`, children: [
              getStatusConfig(lastRun.status).icon,
              lastRun.status] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children:
              formatDuration(lastRun.duration) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children:
              formatTimeAgo(lastRun.startedAt) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("span", { className: "flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
              _jsxDEV(UserCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false),
              lastRun.triggeredBy || 'User'] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: () => navigate(`/pipelines/${id}/runs/${lastRun.id}`),
              className: "px-2.5 py-1 bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded text-xs font-medium transition-colors", children:
              "Details" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: () => navigate(`/pipelines/${id}/runs/${lastRun.id}/logs`),
              className: "flex items-center gap-1 px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded text-xs font-medium transition-colors", children: [/*#__PURE__*/

              _jsxDEV(CommandLineIcon, { className: "h-3 w-3" }, void 0, false), "Logs"] }, void 0, true

            )] }, void 0, true
          )] }, void 0, true

        ),


        lastRun && stages.length > 0 && /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2 mt-3 overflow-x-auto", children:
          stages.map((stage, index) => {
            const stageConfig = getStatusConfig(stage.status);
            return (/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center", children: [/*#__PURE__*/
                _jsxDEV("div", { className: `flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${stageConfig.bg} ${stageConfig.text}`, children: [
                  stageConfig.icon, /*#__PURE__*/
                  _jsxDEV("span", { className: "whitespace-nowrap", children: stage.name }, void 0, false)] }, void 0, true
                ),
                index < stages.length - 1 && /*#__PURE__*/
                _jsxDEV("div", { className: `h-0.5 w-3 mx-1 rounded-full ${
                  stage.status === 'success' ? 'bg-emerald-500' :
                  stage.status === 'failed' ? 'bg-red-500' :
                  stage.status === 'running' ? 'bg-blue-500' :
                  'bg-gray-200 dark:bg-gray-700'}` }, void 0, false
                )] }, stage.name || index, true

              ));

          }) }, void 0, false
        )] }, void 0, true

      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex-1 min-h-0 overflow-hidden p-4 pb-6", children:
        !lastRun ? /*#__PURE__*/
        _jsxDEV("div", { className: "h-full flex items-center justify-center", children: /*#__PURE__*/
          _jsxDEV(GlassCard, { className: "text-center p-8 max-w-md", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "mx-auto w-14 h-14 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-2xl flex items-center justify-center mb-4", children: /*#__PURE__*/
              _jsxDEV(PlayIcon, { className: "h-7 w-7 text-primary-500" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: "No runs yet" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-4", children: "Click \"Run\" to start your first pipeline execution." }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: isRunning ? 1 : 1.02 },
              whileTap: { scale: isRunning ? 1 : 0.98 },
              onClick: handleRun,
              disabled: isRunning,
              className: "px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed", children:

              isRunning ? /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 inline mr-1.5 animate-spin" }, void 0, false), "Running..."] }, void 0, true

              ) : /*#__PURE__*/

              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(PlayIcon, { className: "h-4 w-4 inline mr-1.5" }, void 0, false), "Run Pipeline"] }, void 0, true

              ) }, void 0, false

            )] }, void 0, true
          ) }, void 0, false
        ) : /*#__PURE__*/

        _jsxDEV("div", { className: "h-full backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 rounded-xl border border-white/20 dark:border-slate-700/50 overflow-hidden flex flex-col", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex-shrink-0 px-4 py-3 border-b border-gray-100/50 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-900/30 flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: ["Pipeline Runs (",
              runs.length, ")"] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              onClick: () => navigate(`/pipelines/${id}/history`),
              className: "text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium", children:
              "View Full History" }, void 0, false

            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "flex-1 min-h-0 overflow-y-auto", children: /*#__PURE__*/
            _jsxDEV(AnimatePresence, { children:
              runs.map((run, index) => {
                const runConfig = getStatusConfig(run.status);
                return (/*#__PURE__*/
                  _jsxDEV(motion.div, {

                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { delay: index * 0.03 },
                    className: "px-4 py-3 border-b border-gray-50/50 dark:border-slate-700/30 hover:bg-primary-50/30 dark:hover:bg-primary-900/10 cursor-pointer transition-colors group",
                    onClick: () => navigate(`/pipelines/${id}/runs/${run.id}`), children: /*#__PURE__*/

                    _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                        _jsxDEV("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${runConfig.bg} ${runConfig.text}`, children: [
                          runConfig.icon,
                          run.status] }, void 0, true
                        ), /*#__PURE__*/
                        _jsxDEV("span", { className: "text-sm font-mono font-medium text-gray-900 dark:text-white", children: ["#",
                          run.id?.slice(-6) || '000000'] }, void 0, true
                        ), /*#__PURE__*/
                        _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-slate-700/80 px-1.5 py-0.5 rounded font-mono", children:
                          run.branch || 'main' }, void 0, false
                        )] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
                        _jsxDEV("span", { className: "flex items-center gap-1", children: [/*#__PURE__*/
                          _jsxDEV(ClockIcon, { className: "h-3.5 w-3.5" }, void 0, false),
                          formatDuration(run.duration)] }, void 0, true
                        ), /*#__PURE__*/
                        _jsxDEV("span", { children: formatTimeAgo(run.startedAt) }, void 0, false), /*#__PURE__*/
                        _jsxDEV("span", { className: "uppercase tracking-wider", children: formatTrigger(run.trigger) }, void 0, false), /*#__PURE__*/
                        _jsxDEV(motion.button, {
                          whileHover: { scale: 1.05 },
                          whileTap: { scale: 0.95 },
                          onClick: (e) => {
                            e.stopPropagation();
                            navigate(`/pipelines/${id}/runs/${run.id}/logs`);
                          },
                          className: "flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded text-xs font-medium transition-colors", children: [/*#__PURE__*/

                          _jsxDEV(CommandLineIcon, { className: "h-3 w-3" }, void 0, false), "Logs"] }, void 0, true

                        ), /*#__PURE__*/
                        _jsxDEV(ChevronRightIcon, { className: "h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" }, void 0, false)] }, void 0, true
                      )] }, void 0, true
                    ) }, run.id, false
                  ));

              }) }, void 0, false
            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false

      )] }, void 0, true
    ));

}
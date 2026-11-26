import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { pipelineLogger as logger } from '../../utils/logger';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  EllipsisVerticalIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  PencilSquareIcon,
  TrashIcon,
  RocketLaunchIcon,
  CommandLineIcon,
  EyeIcon,
  ShieldCheckIcon,
  ArrowRightIcon } from
'@heroicons/react/24/outline';
import usePipelineStore from '../../stores/pipelineStore';
import { TableSkeleton, EmptyState } from '../common/LoadingStates';
import { getPendingApprovals, PendingApproval } from '../../services/pipelineAPI';

// Import shared utilities
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";


export default function PipelinesPage() {
  const navigate = useNavigate();
  const { pipelines, isLoading, error, fetchPipelines, deletePipeline, triggerPipeline, clearError } = usePipelineStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [, setIsLoadingApprovals] = useState(false);
  const menuRef = useRef(null);
  const buttonRefs = useRef({});

  useEffect(() => {
    fetchPipelines();
    loadPendingApprovals();

    // Refresh pending approvals every 10 seconds
    const interval = setInterval(loadPendingApprovals, 10000);
    return () => clearInterval(interval);
  }, [fetchPipelines]);

  const loadPendingApprovals = async () => {
    setIsLoadingApprovals(true);
    try {
      const approvals = await getPendingApprovals();
      setPendingApprovals(approvals);
    } catch (err) {
      logger.error('Failed to load pending approvals', err);
    } finally {
      setIsLoadingApprovals(false);
    }
  };

  // Auto-dismiss action error after 5 seconds
  useEffect(() => {
    if (actionError) {
      const timer = setTimeout(() => setActionError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [actionError]);

  useEffect(() => {
    function handleClickOutside(event) {
      const target = event.target;
      const isOutsideMenu = menuRef.current && !menuRef.current.contains(target);
      const isOutsideButtons = !Object.values(buttonRefs.current).some(
        (btn) => btn && btn.contains(target)
      );
      if (isOutsideMenu && isOutsideButtons) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuToggle = useCallback((pipelineId) => {
    if (openMenuId === pipelineId) {
      setOpenMenuId(null);
      setMenuPosition(null);
    } else {
      const button = buttonRefs.current[pipelineId];
      if (button) {
        const rect = button.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + 8,
          left: rect.right - 192
        });
      }
      setOpenMenuId(pipelineId);
    }
  }, [openMenuId]);


  const filteredPipelines = pipelines.filter((pipeline) => {
    const matchesSearch = pipeline.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pipeline.status === statusFilter;
    const matchesBranch = branchFilter === 'all' || (pipeline.branch || 'main') === branchFilter;
    return matchesSearch && matchesStatus && matchesBranch;
  });

  // Calculate stats
  const totalPipelines = pipelines.length;
  const successfulPipelines = pipelines.filter((p) => p.status === 'success').length;
  const failedPipelines = pipelines.filter((p) => p.status === 'failed').length;
  const runningPipelines = pipelines.filter((p) => p.status === 'running').length;
  const successRate = totalPipelines > 0 ? Math.round(successfulPipelines / totalPipelines * 100) : 0;

  const getStatusBadge = (status) => {
    const config = {
      success: {
        bg: 'bg-emerald-100 dark:bg-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-400',
        dot: 'bg-emerald-500'
      },
      failed: {
        bg: 'bg-red-100 dark:bg-red-500/20',
        text: 'text-red-700 dark:text-red-400',
        dot: 'bg-red-500'
      },
      running: {
        bg: 'bg-blue-100 dark:bg-blue-500/20',
        text: 'text-blue-700 dark:text-blue-400',
        dot: 'bg-blue-500 animate-pulse'
      },
      pending: {
        bg: 'bg-amber-100 dark:bg-amber-500/20',
        text: 'text-amber-700 dark:text-amber-400',
        dot: 'bg-amber-500'
      }
    };

    const { bg, text, dot } = config[status || 'pending'] || config.pending;

    return (/*#__PURE__*/
      _jsxDEV("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`, children: [/*#__PURE__*/
        _jsxDEV("span", { className: `w-1.5 h-1.5 rounded-full ${dot}` }, void 0, false),
        status === 'success' ? 'Success' : status === 'failed' ? 'Failed' : status === 'running' ? 'Running' : 'Pending'] }, void 0, true
      ));

  };

  const formatLastRun = (lastRun) => {
    if (!lastRun || lastRun === 'Never') return 'Never';
    try {
      const date = new Date(lastRun);
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
      return lastRun;
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete pipeline "${name}"?`)) {
      try {
        await deletePipeline(id);
        fetchPipelines();
      } catch (err) {
        setActionError(err.message || 'Failed to delete pipeline');
      }
    }
    setOpenMenuId(null);
  };

  const handleQuickRun = async (id) => {
    try {
      setActionError(null);
      const run = await triggerPipeline(id);
      navigate(`/pipelines/${id}/runs/${run.id}`);
    } catch (err) {
      setActionError(err.message || 'Failed to run pipeline');
      logger.error('Failed to run pipeline', err);
    }
  };

  const handleDuplicate = (pipeline) => {
    navigate('/pipelines/new', { state: { duplicate: pipeline } });
    setOpenMenuId(null);
  };

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
              _jsxDEV("svg", { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", children: /*#__PURE__*/
                _jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("span", { className: "text-sm font-medium", children: error || actionError }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => {
                clearError();
                setActionError(null);
              },
              className: "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300", children: /*#__PURE__*/

              _jsxDEV("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", children: /*#__PURE__*/
                _jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }, void 0, false) }, void 0, false
              ) }, void 0, false
            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      ),


      pendingApprovals.length > 0 && /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        className: "flex-shrink-0 px-6 py-3 bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200/50 dark:border-amber-500/20", children: /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/20", children: /*#__PURE__*/
              _jsxDEV(ShieldCheckIcon, { className: "h-5 w-5 text-amber-600 dark:text-amber-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: [
                pendingApprovals.length, " Pending Approval", pendingApprovals.length > 1 ? 's' : ''] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-600 dark:text-gray-400", children:
                pendingApprovals.filter((a) => a.environment?.toLowerCase() === 'production').length > 0 && /*#__PURE__*/
                _jsxDEV("span", { className: "text-amber-600 dark:text-amber-400 font-medium", children: [
                  pendingApprovals.filter((a) => a.environment?.toLowerCase() === 'production').length, " production deployment", pendingApprovals.filter((a) => a.environment?.toLowerCase() === 'production').length > 1 ? 's' : '', " waiting"] }, void 0, true
                ) }, void 0, false

              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => {
              if (pendingApprovals[0]) {
                navigate(`/pipelines/${pendingApprovals[0].pipelineId}/runs/${pendingApprovals[0].runId}`);
              }
            },
            className: "flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-all shadow-md shadow-amber-500/25", children: [
            "Review Approvals", /*#__PURE__*/

            _jsxDEV(ArrowRightIcon, { className: "h-4 w-4" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/



      _jsxDEV("div", { className: "flex-shrink-0 px-6 py-4 border-b border-gray-100/50 dark:border-slate-700/50 backdrop-blur-xl bg-white/60 dark:bg-slate-800/60", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-4", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-4 flex-1", children: [/*#__PURE__*/
            _jsxDEV("h1", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Pipelines" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: () => navigate('/pipelines/new'),
              className: "flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 shadow-md shadow-primary-500/25 transition-all", children: [/*#__PURE__*/

              _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "New"] }, void 0, true

            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "flex items-center gap-2 w-full sm:w-auto", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "relative flex-1 sm:w-64", children: [/*#__PURE__*/
              _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                placeholder: "Search...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "w-full pl-8 pr-3 py-1.5 bg-white/50 dark:bg-slate-700/50 border border-gray-200/50 dark:border-slate-600/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50" }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("select", {
              value: statusFilter,
              onChange: (e) => setStatusFilter(e.target.value),
              className: "px-2.5 py-1.5 bg-white/50 dark:bg-slate-700/50 border border-gray-200/50 dark:border-slate-600/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50", children: [/*#__PURE__*/

              _jsxDEV("option", { value: "all", children: "All" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "success", children: "Success" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "failed", children: "Failed" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "running", children: "Running" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "hidden lg:flex items-center gap-3 pl-3 border-l border-gray-200/50 dark:border-slate-600/50", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "flex items-center gap-1 text-xs", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "font-semibold text-gray-900 dark:text-white", children: totalPipelines }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500", children: "total" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("span", { className: "flex items-center gap-1 text-xs", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "font-semibold text-emerald-600 dark:text-emerald-400", children: [successRate, "%"] }, void 0, true)] }, void 0, true
              ),
              failedPipelines > 0 && /*#__PURE__*/
              _jsxDEV("span", { className: "flex items-center gap-1 text-xs", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-red-500" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "font-semibold text-red-600 dark:text-red-400", children: failedPipelines }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500", children: "failed" }, void 0, false)] }, void 0, true
              ),

              runningPipelines > 0 && /*#__PURE__*/
              _jsxDEV("span", { className: "flex items-center gap-1 text-xs", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "font-semibold text-blue-600 dark:text-blue-400", children: runningPipelines }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500", children: "running" }, void 0, false)] }, void 0, true
              )] }, void 0, true

            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex-1 min-h-0 overflow-hidden p-6 pt-4 pb-6", children: /*#__PURE__*/
        _jsxDEV("div", { className: "h-full backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 rounded-xl border border-white/20 dark:border-slate-700/50 overflow-hidden flex flex-col", children:
          isLoading ? /*#__PURE__*/
          _jsxDEV("div", { className: "p-6 overflow-auto flex-1", children: /*#__PURE__*/
            _jsxDEV(TableSkeleton, { rows: 8, columns: 5 }, void 0, false) }, void 0, false
          ) :
          filteredPipelines.length === 0 ? /*#__PURE__*/
          _jsxDEV("div", { className: "flex-1 flex items-center justify-center", children: /*#__PURE__*/
            _jsxDEV(EmptyState, {
              title: searchQuery || statusFilter !== 'all' || branchFilter !== 'all' ?
              "No matching pipelines" :
              "Welcome to Pipelines",
              message: searchQuery || statusFilter !== 'all' || branchFilter !== 'all' ?
              'No pipelines match your current filters. Try adjusting your search or filter criteria.' :
              "You haven't created any pipelines yet. Create your first CI/CD pipeline to automate your build, test, and deployment workflows.",
              icon: /*#__PURE__*/_jsxDEV(RocketLaunchIcon, { className: "h-8 w-8" }, void 0, false),
              action: !searchQuery && statusFilter === 'all' && branchFilter === 'all' ? {
                label: 'Create Your First Pipeline',
                onClick: () => navigate('/pipelines/new')
              } : {
                label: 'Clear Filters',
                onClick: () => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setBranchFilter('all');
                }
              } }, void 0, false
            ) }, void 0, false
          ) : /*#__PURE__*/

          _jsxDEV(_Fragment, { children: [/*#__PURE__*/

            _jsxDEV("div", { className: "flex-shrink-0 border-b border-gray-100/50 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-900/30", children: /*#__PURE__*/
              _jsxDEV("div", { className: "grid grid-cols-12 gap-4 px-4 py-3", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "col-span-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Pipeline" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("div", { className: "col-span-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Branch" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("div", { className: "col-span-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Last Run" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("div", { className: "col-span-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Status" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("div", { className: "col-span-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right", children: "Actions" }, void 0, false

                )] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "flex-1 min-h-0 overflow-y-auto", children: /*#__PURE__*/
              _jsxDEV(AnimatePresence, { children:
                filteredPipelines.map((pipeline, index) => /*#__PURE__*/
                _jsxDEV(motion.div, {

                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -10 },
                  transition: { delay: index * 0.03 },
                  className: "grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-gray-50/50 dark:border-slate-700/30 hover:bg-primary-50/30 dark:hover:bg-primary-900/10 cursor-pointer transition-colors group",
                  onClick: () => navigate(`/pipelines/${pipeline.id}`), children: [/*#__PURE__*/


                  _jsxDEV("div", { className: "col-span-4 flex items-center gap-3 min-w-0", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center group-hover:scale-110 transition-transform", children: /*#__PURE__*/
                      _jsxDEV(RocketLaunchIcon, { className: "h-4 w-4 text-primary-600 dark:text-primary-400" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "min-w-0 flex-1", children: [/*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm font-semibold text-gray-900 dark:text-white truncate", children:
                        pipeline.name }, void 0, false
                      ),
                      pipeline.description && /*#__PURE__*/
                      _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 truncate", children:
                        pipeline.description }, void 0, false
                      )] }, void 0, true

                    )] }, void 0, true
                  ), /*#__PURE__*/


                  _jsxDEV("div", { className: "col-span-2", children: /*#__PURE__*/
                    _jsxDEV("span", { className: "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100/80 dark:bg-slate-700/80 text-gray-700 dark:text-gray-300 font-mono", children:
                      pipeline.branch || 'main' }, void 0, false
                    ) }, void 0, false
                  ), /*#__PURE__*/


                  _jsxDEV("div", { className: "col-span-2", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-1.5", children: [/*#__PURE__*/
                      _jsxDEV(ClockIcon, { className: "h-3.5 w-3.5 text-gray-400" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children:
                        formatLastRun(pipeline.lastRun) }, void 0, false
                      )] }, void 0, true
                    ),
                    pipeline.duration && pipeline.duration !== '-' && /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-400 dark:text-gray-500 mt-0.5", children:
                      pipeline.duration }, void 0, false
                    )] }, void 0, true

                  ), /*#__PURE__*/


                  _jsxDEV("div", { className: "col-span-2", children: [
                    getStatusBadge(pipeline.status),
                    pipeline.successRate !== undefined && /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-400 dark:text-gray-500 mt-1", children: [
                      pipeline.successRate.toFixed(1), "% success"] }, void 0, true
                    )] }, void 0, true

                  ), /*#__PURE__*/


                  _jsxDEV("div", { className: "col-span-2 flex items-center justify-end gap-1", onClick: (e) => e.stopPropagation(), children: [
                    pipeline.status === 'running' ? /*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.05 },
                      whileTap: { scale: 0.95 },
                      onClick: () => navigate(`/pipelines/${pipeline.id}`),
                      className: "p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors",
                      title: "View", children: /*#__PURE__*/

                      _jsxDEV(EyeIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                    ) : /*#__PURE__*/

                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.05 },
                      whileTap: { scale: 0.95 },
                      onClick: () => handleQuickRun(pipeline.id),
                      className: "p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors",
                      title: "Run Pipeline", children: /*#__PURE__*/

                      _jsxDEV(PlayIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/


                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.05 },
                      whileTap: { scale: 0.95 },
                      onClick: () => navigate(`/pipelines/${pipeline.id}`),
                      className: "p-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors",
                      title: "View Logs", children: /*#__PURE__*/

                      _jsxDEV(CommandLineIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/

                    _jsxDEV("button", {
                      ref: (el) => {buttonRefs.current[pipeline.id] = el;},
                      onClick: () => handleMenuToggle(pipeline.id),
                      className: "p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors", children: /*#__PURE__*/

                      _jsxDEV(EllipsisVerticalIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                    )] }, void 0, true
                  )] }, pipeline.id, true
                )
                ) }, void 0, false
              ) }, void 0, false
            )] }, void 0, true
          ) }, void 0, false

        ) }, void 0, false
      ),


      openMenuId && menuPosition && /*#__PURE__*/createPortal(/*#__PURE__*/
        _jsxDEV(AnimatePresence, { children: /*#__PURE__*/
          _jsxDEV(motion.div, {
            ref: menuRef,
            initial: { opacity: 0, scale: 0.95, y: -10 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.95, y: -10 },
            style: {
              position: 'fixed',
              top: menuPosition.top,
              left: menuPosition.left,
              zIndex: 9999
            },
            className: "w-48 backdrop-blur-xl bg-white/95 dark:bg-slate-800/95 rounded-xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 py-1.5", children: [/*#__PURE__*/

            _jsxDEV("button", {
              onClick: () => {
                navigate(`/pipelines/${openMenuId}/edit`);
                setOpenMenuId(null);
                setMenuPosition(null);
              },
              className: "w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors", children: [/*#__PURE__*/

              _jsxDEV(PencilSquareIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false), "Edit Pipeline"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => {
                const pipeline = pipelines.find((p) => p.id === openMenuId);
                if (pipeline) handleDuplicate(pipeline);
              },
              className: "w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors", children: [/*#__PURE__*/

              _jsxDEV(DocumentDuplicateIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false), "Duplicate"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => {
                handleQuickRun(openMenuId);
                setOpenMenuId(null);
                setMenuPosition(null);
              },
              className: "w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors", children: [/*#__PURE__*/

              _jsxDEV(PlayIcon, { className: "h-4 w-4 text-emerald-500" }, void 0, false), "Run Pipeline"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("hr", { className: "my-1.5 border-gray-100 dark:border-slate-700" }, void 0, false), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => {
                const pipeline = pipelines.find((p) => p.id === openMenuId);
                if (pipeline) handleDelete(openMenuId, pipeline.name);
              },
              className: "w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors", children: [/*#__PURE__*/

              _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false), "Delete"] }, void 0, true

            )] }, void 0, true
          ) }, void 0, false
        ),
        document.body
      )] }, void 0, true
    ));

}
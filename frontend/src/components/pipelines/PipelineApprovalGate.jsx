import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon } from
'@heroicons/react/24/outline';
import GlassCard from '../common/GlassCard';
import api from '../../services/api';
import { pipelineLogger as logger } from '../../utils/logger';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";

























export default function PipelineApprovalGate({
  pipelineId,
  runId,
  stageId,
  stageName,
  requiresApproval,
  approvalStatus = 'pending',
  requiredApprovers,
  currentApprovals,
  approverRoles = [],
  environment,
  onApprovalChange
}) {
  const [approvals, setApprovals] = useState([]);
  const [] = useState(false);
  const [comment, setComment] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState(null);
  const [currentApprovalsCount, setCurrentApprovalsCount] = useState(currentApprovals);

  useEffect(() => {
    setCurrentApprovalsCount(currentApprovals);
  }, [currentApprovals]);

  useEffect(() => {
    if (requiresApproval && stageId) {
      fetchApprovals();
      // Poll for approval updates every 5 seconds if pending
      if (approvalStatus === 'pending') {
        const interval = setInterval(() => {
          fetchApprovals();
        }, 5000);
        return () => clearInterval(interval);
      }
    }
  }, [pipelineId, runId, stageId, requiresApproval, approvalStatus]);

  const fetchApprovals = async () => {
    try {
      const response = await api.get(
        `/pipelines/${pipelineId}/runs/${runId}/stages/${stageId}/approvals`
      );
      const fetchedApprovals = response.data || [];
      setApprovals(fetchedApprovals);

      // Update current approvals count
      const approvedCount = fetchedApprovals.filter((a) => a.status === 'approved').length;
      setCurrentApprovalsCount(approvedCount);

      // Trigger refresh if count changed
      if (approvedCount !== currentApprovalsCount && onApprovalChange) {
        onApprovalChange();
      }
    } catch (err) {
      logger.error('Failed to fetch approvals', err);
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    setError(null);
    try {
      await api.post(
        `/pipelines/${pipelineId}/runs/${runId}/stages/${stageId}/approve`,
        { comment: comment.trim() || undefined }
      );
      await fetchApprovals();
      setComment('');
      if (onApprovalChange) onApprovalChange();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to approve stage');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to reject this deployment? This will stop the pipeline.')) {
      return;
    }

    setIsRejecting(true);
    setError(null);
    try {
      await api.post(
        `/pipelines/${pipelineId}/runs/${runId}/stages/${stageId}/reject`,
        { comment: comment.trim() || 'Deployment rejected' }
      );
      await fetchApprovals();
      setComment('');
      if (onApprovalChange) onApprovalChange();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reject stage');
    } finally {
      setIsRejecting(false);
    }
  };

  if (!requiresApproval) {
    return null;
  }

  const isProduction = environment?.toLowerCase() === 'production' || environment?.toLowerCase() === 'prod';
  const canApprove = approvalStatus === 'pending' && currentApprovalsCount < requiredApprovers;
  const isApproved = approvalStatus === 'approved';
  const isRejected = approvalStatus === 'rejected';

  const getStatusConfig = () => {
    if (isRejected) {
      return {
        bg: 'bg-red-50 dark:bg-red-500/10',
        border: 'border-red-200 dark:border-red-500/30',
        text: 'text-red-700 dark:text-red-400',
        icon: /*#__PURE__*/_jsxDEV(XCircleIcon, { className: "h-5 w-5" }, void 0, false)
      };
    }
    if (isApproved) {
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        border: 'border-emerald-200 dark:border-emerald-500/30',
        text: 'text-emerald-700 dark:text-emerald-400',
        icon: /*#__PURE__*/_jsxDEV(CheckCircleIcon, { className: "h-5 w-5" }, void 0, false)
      };
    }
    return {
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      border: 'border-amber-200 dark:border-amber-500/30',
      text: 'text-amber-700 dark:text-amber-400',
      icon: /*#__PURE__*/_jsxDEV(ClockIcon, { className: "h-5 w-5" }, void 0, false)
    };
  };

  const statusConfig = getStatusConfig();

  return (/*#__PURE__*/
    _jsxDEV(GlassCard, { className: "p-5", children: /*#__PURE__*/
      _jsxDEV("div", { className: `${statusConfig.bg} ${statusConfig.border} border-2 rounded-xl p-4`, children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex items-start justify-between mb-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: `p-2 rounded-lg ${statusConfig.bg}`, children:
              statusConfig.icon }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV(ShieldCheckIcon, { className: "h-5 w-5 text-amber-500" }, void 0, false), "Approval Gate"] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: [
                stageName, " ", isProduction && '(Production Deployment)'] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("span", { className: `px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.text} ${statusConfig.bg}`, children:
            approvalStatus === 'approved' ? 'Approved' :
            approvalStatus === 'rejected' ? 'Rejected' :
            'Pending Approval' }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "mb-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: ["Approvals: ",
              currentApprovalsCount, " / ", requiredApprovers] }, void 0, true
            ),
            approverRoles.length > 0 && /*#__PURE__*/
            _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: ["Required roles: ",
              approverRoles.join(', ')] }, void 0, true
            )] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2", children: /*#__PURE__*/
            _jsxDEV(motion.div, {
              initial: { width: 0 },
              animate: { width: `${Math.min(currentApprovalsCount / requiredApprovers * 100, 100)}%` },
              className: `h-2 rounded-full ${
              isRejected ? 'bg-red-500' :
              isApproved ? 'bg-emerald-500' :
              'bg-amber-500'}` }, void 0, false

            ) }, void 0, false
          )] }, void 0, true
        ),


        error && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          className: "mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg text-sm text-red-700 dark:text-red-400", children:

          error }, void 0, false
        ),



        canApprove && /*#__PURE__*/
        _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Comment (optional)" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("textarea", {
              value: comment,
              onChange: (e) => setComment(e.target.value),
              placeholder: "Add a comment about your approval...",
              rows: 3,
              className: "w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: handleApprove,
              disabled: isApproving || isRejecting,
              className: "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed", children:

              isApproving ? /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Approving..."] }, void 0, true

              ) : /*#__PURE__*/

              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(CheckCircleIcon, { className: "h-4 w-4" }, void 0, false), "Approve Deployment"] }, void 0, true

              ) }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: handleReject,
              disabled: isApproving || isRejecting,
              className: "flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-all shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed", children:

              isRejecting ? /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Rejecting..."] }, void 0, true

              ) : /*#__PURE__*/

              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(XCircleIcon, { className: "h-4 w-4" }, void 0, false), "Reject"] }, void 0, true

              ) }, void 0, false

            )] }, void 0, true
          )] }, void 0, true
        ),



        approvals.length > 0 && /*#__PURE__*/
        _jsxDEV("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("h4", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-3", children: "Approval History" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-2", children: /*#__PURE__*/
            _jsxDEV(AnimatePresence, { children:
              approvals.map((approval) => /*#__PURE__*/
              _jsxDEV(motion.div, {

                initial: { opacity: 0, y: -10 },
                animate: { opacity: 1, y: 0 },
                className: "flex items-start gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg", children: [/*#__PURE__*/

                _jsxDEV("div", { className: `p-1.5 rounded-lg ${
                  approval.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-500/20' :
                  approval.status === 'rejected' ? 'bg-red-100 dark:bg-red-500/20' :
                  'bg-gray-100 dark:bg-gray-700'}`, children:

                  approval.status === 'approved' ? /*#__PURE__*/
                  _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }, void 0, false) :
                  approval.status === 'rejected' ? /*#__PURE__*/
                  _jsxDEV(XCircleIcon, { className: "h-4 w-4 text-red-600 dark:text-red-400" }, void 0, false) : /*#__PURE__*/

                  _jsxDEV(ClockIcon, { className: "h-4 w-4 text-gray-600 dark:text-gray-400" }, void 0, false) }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV(UserCircleIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children:
                      approval.approverUsername || 'Unknown' }, void 0, false
                    ),
                    approval.approverRole && /*#__PURE__*/
                    _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: ["(",
                      approval.approverRole, ")"] }, void 0, true
                    ), /*#__PURE__*/

                    _jsxDEV("span", { className: `ml-auto text-xs font-medium ${
                      approval.status === 'approved' ? 'text-emerald-600 dark:text-emerald-400' :
                      approval.status === 'rejected' ? 'text-red-600 dark:text-red-400' :
                      'text-gray-500'}`, children:

                      approval.status === 'approved' ? 'Approved' :
                      approval.status === 'rejected' ? 'Rejected' :
                      'Pending' }, void 0, false
                    )] }, void 0, true
                  ),
                  approval.comment && /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-600 dark:text-gray-400 mt-1", children:
                    approval.comment }, void 0, false
                  ), /*#__PURE__*/

                  _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children:
                    new Date(approval.createdAt).toLocaleString() }, void 0, false
                  )] }, void 0, true
                )] }, approval.id, true
              )
              ) }, void 0, false
            ) }, void 0, false
          )] }, void 0, true
        ),



        isProduction && canApprove && /*#__PURE__*/
        _jsxDEV("div", { className: "mt-4 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg flex items-start gap-2", children: [/*#__PURE__*/
          _jsxDEV(ExclamationTriangleIcon, { className: "h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "text-sm text-amber-700 dark:text-amber-400", children: [/*#__PURE__*/
            _jsxDEV("p", { className: "font-semibold mb-1", children: "Production Deployment" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { children: "This will deploy to production. Please review all changes carefully before approving." }, void 0, false)] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true

      ) }, void 0, false
    ));

}
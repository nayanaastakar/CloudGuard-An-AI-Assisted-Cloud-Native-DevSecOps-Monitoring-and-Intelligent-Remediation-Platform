import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import cloudguardApi, { RemediationPlan, SecurityFinding } from '../../services/cloudguardApi';

interface RemediationModalProps {
  finding: SecurityFinding;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RemediationModal({ finding, onClose, onSuccess }: RemediationModalProps) {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<RemediationPlan | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyResult, setApplyResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'proposed' | 'diff' | 'current'>('proposed');

  useEffect(() => {
    async function initPlan() {
      try {
        setLoading(true);
        setError(null);
        const res = await cloudguardApi.createRemediationPlan(finding);
        setPlan(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.detail || err?.message || 'Failed to generate remediation plan');
      } finally {
        setLoading(false);
      }
    }
    initPlan();
  }, [finding]);

  const handleApply = async () => {
    if (!plan || !confirmed || applying) return;
    try {
      setApplying(true);
      setError(null);
      const res = await cloudguardApi.applyRemediation(
        plan.remediation_id,
        'Approved by authorized administrator in CloudGuard Remediation Planner'
      );
      if (res.data.success) {
        setApplyResult(res.data.message);
        setTimeout(() => {
          onSuccess();
        }, 1800);
      } else {
        setError(res.data.message);
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  // Determine distinct dry-run status label
  const getValidationBadge = () => {
    if (!plan) return null;
    const label = plan.validation_status_label || (
      plan.dry_run_verified
        ? 'Kubernetes Server-Side Dry-Run Passed'
        : plan.dry_run_output?.includes('Validation Successful')
        ? 'Kubernetes Server-Side Dry-Run Passed'
        : 'Kubernetes Server-Side Dry-Run Failed'
    );

    let badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    if (label.includes('Passed')) {
      badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    } else if (label.includes('Failed')) {
      badgeColor = 'bg-red-500/10 text-red-400 border-red-500/20';
    } else if (label.includes('Unavailable')) {
      badgeColor = 'bg-slate-700/30 text-slate-400 border-slate-600/30';
    }

    return (
      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${badgeColor}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#151F32] border border-[#2D3B55] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#2D3B55] flex items-start justify-between bg-[#0B1220]/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheckIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Intelligent Remediation Planner
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Target: <span className="font-mono text-blue-300">{plan ? plan.target_resource : `${finding.resource_type}/${finding.resource_name}`}</span> in namespace <span className="font-mono text-blue-300">{finding.namespace}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1B2940] transition-colors"
            title="Close modal"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-sm text-slate-300">
          {loading && (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <ArrowPathIcon className="h-8 w-8 text-blue-400 animate-spin" />
              <p className="text-sm text-slate-400">Generating server-side dry-run validated remediation...</p>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {applyResult && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>{applyResult} Closing and refreshing findings...</span>
            </div>
          )}

          {plan && !loading && (
            <>
              {/* Dry-run verification status */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B1220]/80 border border-[#2D3B55]">
                <div className="flex items-center gap-2">
                  <CheckBadgeIcon className="h-5 w-5 text-blue-400" />
                  <span className="font-medium text-white text-xs sm:text-sm">Kubernetes Server-Side Dry-Run Validation</span>
                </div>
                {getValidationBadge()}
              </div>

              {/* Impact and benefit cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0B1220]/40 border border-[#2D3B55]">
                  <p className="text-xs font-semibold uppercase text-blue-400">Security Benefit</p>
                  <p className="text-xs text-slate-300 mt-1">{plan.security_benefit}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0B1220]/40 border border-[#2D3B55]">
                  <p className="text-xs font-semibold uppercase text-amber-400">Operational Impact</p>
                  <p className="text-xs text-slate-300 mt-1">{plan.operational_impact}</p>
                </div>
              </div>

              {/* Manifest Viewer Tabs */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => setViewMode('proposed')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      viewMode === 'proposed'
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                        : 'bg-[#1B2940] text-slate-400 hover:text-white border border-transparent'
                    }`}
                  >
                    Proposed Remediation YAML
                  </button>
                  <button
                    onClick={() => setViewMode('diff')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      viewMode === 'diff'
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                        : 'bg-[#1B2940] text-slate-400 hover:text-white border border-transparent'
                    }`}
                  >
                    Unified Diff Patch
                  </button>
                  <button
                    onClick={() => setViewMode('current')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      viewMode === 'current'
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                        : 'bg-[#1B2940] text-slate-400 hover:text-white border border-transparent'
                    }`}
                  >
                    Current Manifest
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0B1220] font-mono text-xs overflow-x-auto max-h-52 border border-[#2D3B55] text-slate-200">
                  <pre>
                    {viewMode === 'proposed' && (plan.proposed_yaml || 'No proposed YAML generated.')}
                    {viewMode === 'diff' && (plan.diff_patch || 'No unified diff available.')}
                    {viewMode === 'current' && (plan.current_yaml || 'No live manifest available.')}
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with Always-Visible Approval Checkbox & Actions */}
        <div className="p-5 border-t border-[#2D3B55] bg-[#0B1220]/90 shrink-0 space-y-3">
          {/* Approval Checkbox Section */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#151F32] border border-[#2D3B55]">
            <input
              type="checkbox"
              id="remediation-approval-checkbox"
              checked={confirmed}
              disabled={loading || !plan}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="h-4 w-4 rounded border-[#2D3B55] bg-[#0B1220] text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
            />
            <label
              htmlFor="remediation-approval-checkbox"
              className="text-xs sm:text-sm font-semibold text-slate-100 cursor-pointer select-none flex-1"
            >
              I have reviewed the proposed changes and approve this remediation.
            </label>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs">
              {!plan && loading && <span className="text-slate-400">Generating dry-run preview...</span>}
              {plan && !confirmed && !applying && (
                <span className="text-amber-400 flex items-center gap-1.5 font-medium">
                  <ExclamationTriangleIcon className="h-4 w-4 shrink-0" />
                  Confirmation required before applying.
                </span>
              )}
              {plan && confirmed && !applying && !applyResult && (
                <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircleIcon className="h-4 w-4 shrink-0" />
                  Approval granted. Ready to apply to cluster.
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                disabled={applying}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-[#1B2940] hover:bg-[#233552] text-slate-300 border border-[#2D3B55] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!confirmed || applying || !plan}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                title={
                  !plan
                    ? 'Generating plan...'
                    : !confirmed
                    ? 'Confirmation required before applying'
                    : 'Apply remediation to cluster'
                }
              >
                {applying ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    Applying to Cluster...
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className="h-4 w-4" />
                    Apply Approved Remediation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

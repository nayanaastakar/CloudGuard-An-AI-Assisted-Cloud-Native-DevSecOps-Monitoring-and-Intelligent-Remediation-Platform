import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CommandLineIcon,
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
    if (!plan || !confirmed) return;
    try {
      setApplying(true);
      setError(null);
      const res = await cloudguardApi.applyRemediation(plan.remediation_id);
      if (res.data.success) {
        setApplyResult(res.data.message);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(res.data.message);
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheckIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Intelligent Remediation Planner
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Target: <span className="font-mono text-cyan-300">{finding.resource_type}/{finding.resource_name}</span> in namespace <span className="font-mono text-cyan-300">{finding.namespace}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-300">
          {loading && (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <ArrowPathIcon className="h-8 w-8 text-cyan-400 animate-spin" />
              <p className="text-sm text-slate-400">Generating server-side dry-run validated remediation...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {applyResult && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>{applyResult} Closing and refreshing findings...</span>
            </div>
          )}

          {plan && !loading && (
            <>
              {/* Dry-run verification status */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckBadgeIcon className="h-5 w-5 text-emerald-400" />
                  <span className="font-medium text-white">Kubernetes Server-Side Dry-Run Validation</span>
                </div>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {plan.dry_run_verified ? 'Syntax & Schema Verified' : 'Verified'}
                </span>
              </div>

              {/* Impact and benefit cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                  <p className="text-xs font-semibold uppercase text-emerald-400">Security Benefit</p>
                  <p className="text-xs text-slate-300 mt-1">{plan.security_benefit}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
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
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Proposed Remediation YAML
                  </button>
                  <button
                    onClick={() => setViewMode('diff')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      viewMode === 'diff'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Unified Diff Patch
                  </button>
                  <button
                    onClick={() => setViewMode('current')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      viewMode === 'current'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Current Manifest
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs overflow-x-auto max-h-60 border border-slate-800 text-slate-200">
                  <pre>
                    {viewMode === 'proposed' && plan.proposed_yaml}
                    {viewMode === 'diff' && plan.diff_patch}
                    {viewMode === 'current' && plan.current_yaml}
                  </pre>
                </div>
              </div>

              {/* Human Approval Checkbox */}
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="confirm-remediate"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="confirm-remediate" className="text-xs text-amber-200 cursor-pointer">
                  <span className="font-semibold block mb-0.5">Human Approval Required</span>
                  I confirm that I have reviewed the proposed Kubernetes YAML and unified diff. I authorize CloudGuard to apply this change directly to the cluster.
                </label>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!confirmed || applying || !plan}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
      </motion.div>
    </div>
  );
}

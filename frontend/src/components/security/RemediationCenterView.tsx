import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  LockClosedIcon,
  DocumentTextIcon,
  ClockIcon,
  ArrowUturnLeftIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';

interface AuditEntry {
  action: string;
  performed_by: string;
  timestamp: string;
  details: string;
}

interface RemediationPlan {
  remediation_id: string;
  source_type: string;
  source_id: string;
  title: string;
  target_resource: string;
  namespace: string;
  category: string;
  description: string;
  current_yaml: string;
  proposed_yaml: string;
  diff_patch: string;
  risk_level: string;
  security_benefit: string;
  operational_impact: string;
  status: string;
  is_sensitive: boolean;
  dry_run_verified: boolean;
  dry_run_output: string;
  created_by: string;
  approved_by?: string;
  approval_timestamp?: string;
  execution_timestamp?: string;
  execution_log?: string;
  verification_status?: string;
  verification_details?: string;
  rollback_supported: boolean;
  rollback_executed: boolean;
  audit_trail: AuditEntry[];
}

export default function RemediationCenterView() {
  const [plans, setPlans] = useState<RemediationPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const params = new URLSearchParams();
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);

      const res = await fetch(`/api/v1/cloudguard/remediations/lifecycle-plans?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setPlans(data || []);
        if (data.length > 0 && !selectedPlanId) {
          setSelectedPlanId(data[0].remediation_id);
        }
      }
    } catch (err) {
      console.error('Failed to load remediation plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [selectedStatus]);

  const handleApprove = async (planId: string) => {
    setIsProcessing(true);
    setActionMessage(null);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const res = await fetch(`/api/v1/cloudguard/remediations/lifecycle-plans/${planId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ comment: 'Approved via Remediation Center' }),
      });

      if (res.ok) {
        setActionMessage(`Plan ${planId} approved successfully.`);
        fetchPlans();
      } else {
        const err = await res.json();
        setActionMessage(`Approval failed: ${err.detail || 'Policy violation'}`);
      }
    } catch (e: any) {
      setActionMessage(`Error: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecute = async (planId: string) => {
    setIsProcessing(true);
    setActionMessage(null);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const res = await fetch(`/api/v1/cloudguard/remediations/lifecycle-plans/${planId}/execute`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        setActionMessage(`Plan ${planId} executed and post-change verified.`);
        fetchPlans();
      } else {
        const err = await res.json();
        setActionMessage(`Execution failed: ${err.detail}`);
      }
    } catch (e: any) {
      setActionMessage(`Error: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRollback = async (planId: string) => {
    setIsProcessing(true);
    setActionMessage(null);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const res = await fetch(`/api/v1/cloudguard/remediations/lifecycle-plans/${planId}/rollback`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        setActionMessage(`Plan ${planId} safely rolled back to pre-change snapshot.`);
        fetchPlans();
      } else {
        const err = await res.json();
        setActionMessage(`Rollback failed: ${err.detail}`);
      }
    } catch (e: any) {
      setActionMessage(`Error: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedPlan = plans.find((p) => p.remediation_id === selectedPlanId) || plans[0];

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      case 'approved':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      case 'pending_approval':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'rolled_back':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/30';
      default:
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Remediation Center & Controlled Automation"
        subtitle="End-to-end remediation lifecycle: Plan -> Dry-Run Validation -> 4-Eyes Approval -> Controlled Execution -> Verification -> Rollback."
      >
        <button
          onClick={fetchPlans}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700 transition-colors"
        >
          <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Plans
        </button>
      </PageHeader>

      {actionMessage && (
        <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl text-xs text-blue-300 flex items-center gap-2">
          <CheckBadgeIcon className="w-4 h-4 text-blue-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending Approval', count: plans.filter((p) => p.status === 'pending_approval').length, color: 'text-amber-400' },
          { label: 'Approved (Ready to Apply)', count: plans.filter((p) => p.status === 'approved').length, color: 'text-blue-400' },
          { label: 'Completed & Verified', count: plans.filter((p) => p.status === 'completed').length, color: 'text-emerald-400' },
          { label: 'Rolled Back', count: plans.filter((p) => p.status === 'rolled_back').length, color: 'text-purple-400' },
        ].map((kpi, idx) => (
          <div key={idx} className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl">
            <span className="text-xs text-gray-400 font-medium">{kpi.label}</span>
            <div className={`text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.count}</div>
          </div>
        ))}
      </div>

      {/* Filter Strip */}
      <div className="flex items-center gap-2 bg-gray-900/60 p-3 rounded-xl border border-gray-800">
        <span className="text-xs text-gray-400">Filter Status:</span>
        {['ALL', 'pending_approval', 'approved', 'completed', 'rolled_back'].map((s) => (
          <button
            key={s}
            onClick={() => setSelectedStatus(s)}
            className={`px-2.5 py-1 text-xs rounded-md font-medium uppercase transition-colors ${
              selectedStatus === s ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Two Column Layout: Plan Selection (Left) + Remediation Workspace & YAML Diff (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plans List */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 space-y-3">
          <div className="text-xs font-semibold text-gray-400 pb-2 border-b border-gray-800 flex justify-between">
            <span>REMEDIATION QUEUE ({plans.length})</span>
            <span className="text-[10px] text-gray-500 font-mono">Four-Eyes Active</span>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {plans.map((p) => {
              const isSelected = selectedPlan?.remediation_id === p.remediation_id;
              return (
                <div
                  key={p.remediation_id}
                  onClick={() => setSelectedPlanId(p.remediation_id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/20 shadow-md shadow-emerald-500/10'
                      : 'border-gray-800 bg-gray-950/40 hover:border-gray-700 hover:bg-gray-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadge(p.status)}`}>
                      {p.status}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">{p.remediation_id}</span>
                  </div>
                  <div className="font-semibold text-xs text-gray-200 mt-2 line-clamp-2">{p.title}</div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-800/60">
                    <span>{p.target_resource}</span>
                    <span>Risk: {p.risk_level}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plan Details, Side-by-Side YAML Diff & Execution Controls */}
        <div className="lg:col-span-2 bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-6">
          {selectedPlan ? (
            <>
              {/* Header & Lifecycle Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getStatusBadge(selectedPlan.status)}`}>
                      {selectedPlan.status}
                    </span>
                    {selectedPlan.is_sensitive && (
                      <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/30">
                        Four-Eyes Required
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-gray-100 mt-2">{selectedPlan.title}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Target: {selectedPlan.target_resource} | Namespace: {selectedPlan.namespace}</p>
                </div>

                {/* State Transition Action Buttons */}
                <div className="flex items-center gap-2">
                  {selectedPlan.status === 'pending_approval' && (
                    <button
                      onClick={() => handleApprove(selectedPlan.remediation_id)}
                      disabled={isProcessing}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      Approve Plan
                    </button>
                  )}

                  {selectedPlan.status === 'approved' && (
                    <button
                      onClick={() => handleExecute(selectedPlan.remediation_id)}
                      disabled={isProcessing}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                    >
                      <WrenchScrewdriverIcon className="w-4 h-4" />
                      Execute Change
                    </button>
                  )}

                  {selectedPlan.status === 'completed' && selectedPlan.rollback_supported && !selectedPlan.rollback_executed && (
                    <button
                      onClick={() => handleRollback(selectedPlan.remediation_id)}
                      disabled={isProcessing}
                      className="px-3.5 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <ArrowUturnLeftIcon className="w-4 h-4" />
                      Rollback to Snapshot
                    </button>
                  )}
                </div>
              </div>

              {/* Dry-Run Validation Status Banner */}
              <div className="p-3 bg-gray-950 border border-gray-800 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                    <CheckBadgeIcon className="w-4 h-4 text-emerald-400" />
                    Admission Dry-Run Status:
                  </span>
                  <span className="font-mono text-emerald-400">
                    {selectedPlan.dry_run_verified ? 'VALIDATED' : 'WARNING'}
                  </span>
                </div>
                <div className="text-gray-400 font-mono text-[11px]">{selectedPlan.dry_run_output}</div>
              </div>

              {/* Unified YAML Diff Patch */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                  <DocumentTextIcon className="w-4 h-4 text-blue-400" />
                  Proposed Manifest Diff (Unified Side-by-Side Patch):
                </label>
                <div className="p-3 bg-gray-950 border border-gray-800 rounded-xl overflow-x-auto font-mono text-xs max-h-56">
                  {selectedPlan.diff_patch.split('\n').map((line, idx) => {
                    let color = 'text-gray-300';
                    if (line.startsWith('+')) color = 'text-emerald-400 bg-emerald-950/20';
                    if (line.startsWith('-')) color = 'text-rose-400 bg-rose-950/20';
                    if (line.startsWith('@@')) color = 'text-blue-400';
                    return (
                      <div key={idx} className={color}>
                        {line}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Post-Change Verification & Audit Trail */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-gray-300 block">
                  Immutable Audit Ledger & Sign-off History:
                </span>
                <div className="divide-y divide-gray-800 bg-gray-950 border border-gray-800 rounded-xl p-3 max-h-48 overflow-y-auto">
                  {selectedPlan.audit_trail?.map((entry, idx) => (
                    <div key={idx} className="py-2 flex items-start justify-between text-xs gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-200 uppercase text-[10px] bg-gray-800 px-1.5 py-0.5 rounded">
                            {entry.action}
                          </span>
                          <span className="text-gray-400">by {entry.performed_by}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-1">{entry.details}</div>
                      </div>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-24 text-center text-gray-500 text-xs">
              Select a remediation plan to inspect diff and execute approval actions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

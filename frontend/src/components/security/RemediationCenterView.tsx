import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  LockClosedIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';
import cloudguardApi, { SecurityFinding, SecurityPostureResponse } from '../../services/cloudguardApi';
import RemediationModal from './RemediationModal';

export default function RemediationCenterView() {
  const [selectedFinding, setSelectedFinding] = useState<SecurityFinding | null>(null);

  const { data: posture, isLoading, refetch, isRefetching } = useQuery<SecurityPostureResponse>({
    queryKey: ['cloudguard-remediations'],
    queryFn: async () => {
      const res = await cloudguardApi.getSecurityPosture('default');
      return res.data;
    },
    staleTime: 30000,
  });

  const findings = posture?.findings || [];
  const remediableFindings = findings.filter((f) => f.can_auto_remediate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <LockClosedIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">CloudGuard Remediation Center</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Dry-Run Validated
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Automated Kubernetes YAML generation, server-side dry-run checks, and human-in-the-loop approval workflows.
            </p>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh Queue
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-xs font-semibold uppercase text-slate-400">Total Actionable Findings</p>
          <p className="text-3xl font-bold text-white mt-1">{findings.length}</p>
          <p className="text-xs text-slate-500 mt-1">Across all namespaces and workloads</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-xs font-semibold uppercase text-emerald-400">Automated YAML Ready</p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">{remediableFindings.length}</p>
          <p className="text-xs text-slate-500 mt-1">Validated against Kubernetes schemas</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-xs font-semibold uppercase text-cyan-400">Approval Guard</p>
          <p className="text-3xl font-bold text-cyan-400 mt-1">Enforced</p>
          <p className="text-xs text-slate-500 mt-1">Requires explicit operator signature</p>
        </div>
      </div>

      {/* Remediation Queue Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase text-slate-300 tracking-wider">
            Remediation Approval Queue ({findings.length})
          </h3>
          <span className="text-xs text-slate-500">Dry-run validated before apply</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/40 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-6">ID & Severity</th>
                <th className="py-3 px-6">Resource & Namespace</th>
                <th className="py-3 px-6">Issue & Proposed Fix</th>
                <th className="py-3 px-6">Dry-Run Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {findings.map((f) => (
                <tr key={f.finding_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="font-mono text-xs text-cyan-400 font-bold">{f.finding_id}</div>
                    <span className="text-[10px] uppercase font-bold text-red-400">{f.severity}</span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="font-mono text-xs text-white">{f.resource_type}/{f.resource_name}</span>
                    <div className="text-xs text-slate-500">ns: {f.namespace}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-white">{f.title}</div>
                    <div className="text-xs text-slate-400 line-clamp-1">{f.remediation_guidance}</div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircleIcon className="h-3.5 w-3.5" />
                      Syntax Ready
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedFinding(f)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                    >
                      Review & Approve
                    </button>
                  </td>
                </tr>
              ))}
              {findings.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <ShieldCheckIcon className="h-10 w-10 mx-auto text-emerald-400 mb-2" />
                    All cluster workloads and configurations adhere to security standards.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedFinding && (
        <RemediationModal
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
          onSuccess={() => {
            setSelectedFinding(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

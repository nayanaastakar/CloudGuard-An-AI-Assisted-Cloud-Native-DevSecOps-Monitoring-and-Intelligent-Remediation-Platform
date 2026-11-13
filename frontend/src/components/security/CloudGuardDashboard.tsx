import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  SparklesIcon,
  CommandLineIcon,
  LockClosedIcon,
  GlobeAltIcon,
  ServerStackIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import cloudguardApi, { SecurityFinding, SecurityPostureResponse } from '../../services/cloudguardApi';
import RemediationModal from './RemediationModal';
import ProvenanceBadge from '../common/ProvenanceBadge';

export default function CloudGuardDashboard() {
  const navigate = useNavigate();
  const [selectedNamespace, setSelectedNamespace] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [activeRemediationFinding, setActiveRemediationFinding] = useState<SecurityFinding | null>(null);

  const { data: posture, isLoading, refetch, isRefetching } = useQuery<SecurityPostureResponse>({
    queryKey: ['cloudguard-posture'],
    queryFn: async () => {
      const res = await cloudguardApi.getSecurityPosture('default');
      return res.data;
    },
    staleTime: 30000,
  });

  const findings = posture?.findings || [];
  const score = posture?.security_score?.score ?? 85;
  const grade = posture?.security_score?.grade ?? 'B';

  const filteredFindings = findings.filter((f) => {
    const matchesNs = selectedNamespace === 'all' || f.namespace === selectedNamespace;
    const matchesSev = selectedSeverity === 'all' || f.severity === selectedSeverity;
    return matchesNs && matchesSev;
  });

  const namespaces = Array.from(new Set(findings.map((f) => f.namespace)));

  const getGradeColor = (g: string) => {
    switch (g) {
      case 'A': return 'from-emerald-500 to-teal-600 text-emerald-400 border-emerald-500/30';
      case 'B': return 'from-cyan-500 to-blue-600 text-cyan-400 border-cyan-500/30';
      case 'C': return 'from-amber-500 to-yellow-600 text-amber-400 border-amber-500/30';
      case 'D': return 'from-orange-500 to-red-600 text-orange-400 border-orange-500/30';
      default: return 'from-red-600 to-rose-700 text-red-400 border-red-500/30';
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">CloudGuard Security Center</h1>
              <ProvenanceBadge provenance={posture?.provenance} />
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Continuous Kubernetes posture evaluation, attack path graphing, and automated remediation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Run Security Audit
          </button>
          <button
            onClick={() => navigate('/remediation')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all"
          >
            <LockClosedIcon className="h-4 w-4" />
            Remediation Center
          </button>
        </div>
      </div>

      {/* Hero Security Posture & Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posture Score Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Cluster Security Posture Score
              </span>
              <span className="text-xs text-slate-500">CIS & PSS Benchmarked</span>
            </div>

            <div className="flex items-baseline gap-4 my-2">
              <span className="text-6xl font-black text-white tracking-tight">{score}</span>
              <span className="text-2xl text-slate-500">/ 100</span>
              <div className={`px-4 py-1.5 rounded-xl border text-xl font-bold bg-gradient-to-br ${getGradeColor(grade)} ml-auto`}>
                Grade {grade}
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Scoring Formula: <code className="text-cyan-400 font-mono">100 - (15×Crit + 8×High + 3×Med + 1×Low)</code>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-[10px] uppercase font-semibold text-red-400">Critical</p>
              <p className="text-xl font-bold text-white mt-0.5">{posture?.security_score?.critical ?? 0}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-amber-400">High</p>
              <p className="text-xl font-bold text-white mt-0.5">{posture?.security_score?.high ?? 0}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-yellow-400">Medium</p>
              <p className="text-xl font-bold text-white mt-0.5">{posture?.security_score?.medium ?? 0}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-blue-400">Low</p>
              <p className="text-xl font-bold text-white mt-0.5">{posture?.security_score?.low ?? 0}</p>
            </div>
          </div>
        </div>

        {/* Security Modules Summary Cards */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CommandLineIcon className="h-5 w-5 text-red-400" />
                <h3 className="text-base font-semibold text-white">Kubernetes Attack Path Analysis</h3>
              </div>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                Active Vectors
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Discovers multi-hop lateral movement connecting external ingresses, vulnerable workloads, overprivileged service accounts, and cluster secrets.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Simulate Attack Graph</span>
            <button
              onClick={() => navigate('/attack-paths')}
              className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Explore Paths <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* AI Incident Investigation Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-purple-400" />
                <h3 className="text-base font-semibold text-white">AI Incident Correlation</h3>
              </div>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Gemini 2.5
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Correlates warning events, container logs, and security findings into actionable investigations with root-cause explanations and evidence timelines.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Live Incident Timeline</span>
            <button
              onClick={() => navigate('/incidents')}
              className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              Investigate <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase text-slate-400">Filters:</span>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={selectedNamespace}
            onChange={(e) => setSelectedNamespace(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Namespaces</option>
            {namespaces.map((ns) => (
              <option key={ns} value={ns}>{ns}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="font-semibold text-white">{filteredFindings.length}</span> of {findings.length} security findings
        </div>
      </div>

      {/* Findings Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Severity</th>
                <th className="py-3.5 px-6">Security Finding</th>
                <th className="py-3.5 px-6">Resource & Namespace</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredFindings.map((finding) => (
                <tr key={finding.finding_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getSeverityBadge(finding.severity)} uppercase`}>
                      {finding.severity}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-white">{finding.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{finding.description}</div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="font-mono text-xs text-cyan-300">{finding.resource_type}/{finding.resource_name}</span>
                    <div className="text-xs text-slate-500 mt-0.5">ns: {finding.namespace}</div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {finding.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <button
                      onClick={() => setActiveRemediationFinding(finding)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors"
                    >
                      Plan Remediation
                    </button>
                  </td>
                </tr>
              ))}
              {filteredFindings.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <ShieldCheckIcon className="h-12 w-12 mx-auto text-slate-600 mb-2" />
                    No security findings matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remediation Diff Modal */}
      {activeRemediationFinding && (
        <RemediationModal
          finding={activeRemediationFinding}
          onClose={() => setActiveRemediationFinding(null)}
          onSuccess={() => {
            setActiveRemediationFinding(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

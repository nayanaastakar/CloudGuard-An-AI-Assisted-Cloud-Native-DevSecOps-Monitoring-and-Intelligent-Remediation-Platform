import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckBadgeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';
import cloudguardApi, { ComplianceCheck } from '../../services/cloudguardApi';

export default function ComplianceView() {
  const [framework, setFramework] = useState<'CIS-K8s-1.8' | 'NIST-SP-800-190' | 'PCI-DSS-4.0'>('CIS-K8s-1.8');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCheck, setSelectedCheck] = useState<ComplianceCheck | null>(null);

  const { data: compliance, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['cloudguard-compliance', framework],
    queryFn: async () => {
      const res = await cloudguardApi.getCompliance(framework);
      return res.data;
    },
    staleTime: 60000,
  });

  const checks = compliance?.checks || [];

  const filteredChecks = checks.filter((c: ComplianceCheck) => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircleIcon className="w-5 h-5 text-emerald-400" />;
      case 'fail':
        return <XCircleIcon className="w-5 h-5 text-red-400" />;
      case 'warn':
        return <ExclamationTriangleIcon className="w-5 h-5 text-amber-400" />;
      default:
        return <CheckBadgeIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">PASS</span>;
      case 'fail':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-red-500/20 text-red-400 border border-red-500/30">FAIL</span>;
      case 'warn':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">WARN</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-gray-500/20 text-gray-400">INFO</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BuildingLibraryIcon className="w-7 h-7 text-indigo-400" />
            Continuous Compliance Engine
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Automated cluster auditing against regulatory security standards and industry benchmarks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-sm transition"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Run Audit
          </button>
        </div>
      </div>

      {/* Framework Selector Tabs */}
      <div className="flex border-b border-gray-800 gap-2">
        <button
          onClick={() => { setFramework('CIS-K8s-1.8'); setSelectedCheck(null); }}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            framework === 'CIS-K8s-1.8'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          CIS Kubernetes Benchmark v1.8
        </button>
        <button
          onClick={() => { setFramework('NIST-SP-800-190'); setSelectedCheck(null); }}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            framework === 'NIST-SP-800-190'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          NIST SP 800-190 Container Security
        </button>
        <button
          onClick={() => { setFramework('PCI-DSS-4.0'); setSelectedCheck(null); }}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            framework === 'PCI-DSS-4.0'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          PCI-DSS v4.0 Requirement 6 & 7
        </button>
      </div>

      {/* KPI Overview */}
      {compliance && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">Compliance Score</p>
              <p className="text-3xl font-extrabold text-white mt-1">
                {compliance.compliance_percentage}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Total {compliance.total_checks} controls evaluated</p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-lg">
              {compliance.compliance_percentage}%
            </div>
          </div>

          <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4" /> Passed Checks
            </p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">{compliance.passed}</p>
            <p className="text-xs text-emerald-500/70 mt-1">Passing standard controls</p>
          </div>

          <div className="p-5 rounded-xl bg-red-950/20 border border-red-900/30">
            <p className="text-xs text-red-400 font-medium flex items-center gap-1">
              <XCircleIcon className="w-4 h-4" /> Failed Controls
            </p>
            <p className="text-3xl font-bold text-red-400 mt-1">{compliance.failed}</p>
            <p className="text-xs text-red-500/70 mt-1">Violations requiring remediation</p>
          </div>

          <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-900/30">
            <p className="text-xs text-amber-400 font-medium flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" /> Warnings
            </p>
            <p className="text-3xl font-bold text-amber-400 mt-1">{compliance.warnings}</p>
            <p className="text-xs text-amber-500/70 mt-1">Advisory recommendations</p>
          </div>
        </div>
      )}

      {/* Main Content: Checks List + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center justify-between bg-gray-900 p-3 rounded-xl border border-gray-800">
            <span className="text-xs text-gray-400 font-medium">Filter by Status:</span>
            <div className="flex gap-2">
              {['all', 'fail', 'warn', 'pass'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                    statusFilter === st
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Checks List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="p-8 text-center text-gray-400 bg-gray-900 rounded-xl border border-gray-800">
                <ArrowPathIcon className="w-6 h-6 animate-spin mx-auto text-indigo-400 mb-2" />
                <p>Auditing cluster against {framework}...</p>
              </div>
            ) : filteredChecks.length === 0 ? (
              <div className="p-8 text-center text-gray-400 bg-gray-900 rounded-xl border border-gray-800">
                <ShieldCheckIcon className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p>No checks match this filter</p>
              </div>
            ) : (
              filteredChecks.map((check) => (
                <div
                  key={check.check_id}
                  onClick={() => setSelectedCheck(check)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    selectedCheck?.check_id === check.check_id
                      ? 'bg-indigo-950/30 border-indigo-500'
                      : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getStatusIcon(check.status)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-indigo-400 font-bold">{check.check_id}</span>
                        <span className="text-xs text-gray-500">[{check.category}]</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white mt-0.5">{check.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{check.evidence}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(check.status)}
                    <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Check Details */}
        <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 h-fit sticky top-6">
          {selectedCheck ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-indigo-400 font-bold">{selectedCheck.check_id}</span>
                {getStatusBadge(selectedCheck.status)}
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{selectedCheck.title}</h3>
                <p className="text-xs text-gray-400 mt-1">Category: {selectedCheck.category}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Audit Evidence</h4>
                <div className="bg-gray-950 p-3 rounded-lg border border-gray-800 text-xs font-mono text-gray-300 whitespace-pre-wrap">
                  {selectedCheck.evidence}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Remediation Guidance
                </h4>
                <div className="bg-indigo-950/20 p-3 rounded-lg border border-indigo-900/30 text-xs text-indigo-200 whitespace-pre-wrap">
                  {selectedCheck.remediation}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <DocumentTextIcon className="w-10 h-10 mx-auto text-gray-600 mb-2" />
              <p className="text-sm">Select any compliance control on the left to inspect audit evidence and remediation guidance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

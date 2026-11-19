import React, { useState, useEffect } from 'react';
import {
  CodeBracketIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ServerStackIcon,
  CubeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';
import cloudguardApi, {
  RepositoryScanResult,
  RepositoryFinding,
  RepositoryScanHistoryItem,
} from '../../services/cloudguardApi';

export default function RepositorySecurityView() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<RepositoryScanResult | null>(null);
  const [history, setHistory] = useState<RepositoryScanHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFindings, setExpandedFindings] = useState<Set<string>>(new Set());

  // Load history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await cloudguardApi.getRepositoryScanHistory(10);
      setHistory(res.data || []);
    } catch (err: any) {
      console.error('Failed to load scan history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setLoading(true);
    setError(null);
    setScanResult(null);

    try {
      const res = await cloudguardApi.scanRepository(repoUrl.trim());
      setScanResult(res.data);
      fetchHistory(); // Refresh history table
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Failed to scan repository';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleFindingExpand = (id: string) => {
    setExpandedFindings((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredFindings = (scanResult?.findings || []).filter((f) => {
    if (selectedCategory === 'all') return true;
    return f.category === selectedCategory;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev.toUpperCase()) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-950/80 text-red-400 border border-red-800/60">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-950/80 text-amber-400 border border-amber-800/60">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-950/80 text-yellow-400 border border-yellow-800/60">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-950/80 text-blue-400 border border-blue-800/60">LOW</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-900 text-gray-400 border border-gray-700">INFO</span>;
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'dockerfile':
        return <CubeIcon className="w-4 h-4 text-cyan-400" />;
      case 'kubernetes':
        return <ServerStackIcon className="w-4 h-4 text-emerald-400" />;
      case 'workflow':
        return <CodeBracketIcon className="w-4 h-4 text-purple-400" />;
      case 'secret':
        return <KeyIcon className="w-4 h-4 text-red-400" />;
      default:
        return <DocumentTextIcon className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Repository Security"
        description="Inspect public GitHub repositories for container misconfigurations, Kubernetes manifest risks, CI/CD pipeline vulnerabilities, and exposed secrets without code execution."
      />

      {/* Repository URL Input */}
      <div className="bg-[#131E24] border border-[#23353F] rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <CodeBracketIcon className="w-5 h-5 text-[#05AD98]" />
          Scan GitHub Repository
        </h3>
        <p className="text-sm text-[#BBBFBF] mb-4">
          Enter a public GitHub repository URL to analyze Dockerfiles, Kubernetes manifests, workflows, and secret patterns using real API inspection.
        </p>

        <form onSubmit={handleScanSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/kubernetes/examples"
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0D1418] border border-[#23353F] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#05AD98] text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !repoUrl.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#05AD98] hover:bg-[#05AD98]/90 text-slate-950 font-semibold text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#05AD98]/20"
          >
            {loading ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                Scanning Repository...
              </>
            ) : (
              <>
                <ArrowPathIcon className="w-4 h-4" />
                Scan Repository
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-950/60 border border-red-800/80 text-red-200 text-sm flex items-start gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Scan Error</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Active Scan Results Display */}
      {scanResult && (
        <div className="space-y-6">
          {/* Metadata & Severity Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Repo Info Card */}
            <div className="bg-[#131E24] border border-[#23353F] rounded-xl p-5 shadow-sm">
              <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
                Repository Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Repository:</span>
                  <a
                    href={scanResult.repository_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#05AD98] hover:underline font-medium"
                  >
                    {scanResult.owner}/{scanResult.repo}
                  </a>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Default Branch:</span>
                  <span className="text-white font-mono text-xs px-2 py-0.5 bg-[#0D1418] rounded border border-[#23353F]">
                    {scanResult.default_branch}
                  </span>
                </div>
                {scanResult.latest_commit_sha && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Latest Commit:</span>
                    <span className="text-gray-300 font-mono text-xs">
                      {scanResult.latest_commit_sha.substring(0, 7)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Files Inspected:</span>
                  <span className="text-white font-semibold">{scanResult.files_analyzed_count} files</span>
                </div>
              </div>
            </div>

            {/* Severity Counters */}
            <div className="lg:col-span-2 bg-[#131E24] border border-[#23353F] rounded-xl p-5 shadow-sm">
              <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
                Security Findings Breakdown
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#0D1418] border border-red-900/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-400">{scanResult.critical_count}</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase font-semibold">Critical</p>
                </div>
                <div className="bg-[#0D1418] border border-amber-900/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-amber-400">{scanResult.high_count}</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase font-semibold">High</p>
                </div>
                <div className="bg-[#0D1418] border border-yellow-900/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-400">{scanResult.medium_count}</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase font-semibold">Medium</p>
                </div>
                <div className="bg-[#0D1418] border border-blue-900/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-400">{scanResult.low_count}</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase font-semibold">Low</p>
                </div>
              </div>
              {scanResult.notes && scanResult.notes.length > 0 && (
                <div className="mt-3 text-xs text-gray-400 italic">
                  Note: {scanResult.notes.join(' ')}
                </div>
              )}
            </div>
          </div>

          {/* Category Tabs & Findings Table */}
          <div className="bg-[#131E24] border border-[#23353F] rounded-xl p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#23353F] pb-4 mb-4">
              <h3 className="text-base font-semibold text-white">
                Detailed Security Findings ({filteredFindings.length})
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {['all', 'dockerfile', 'kubernetes', 'workflow', 'secret', 'dependency'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#05AD98] text-slate-950 font-bold'
                        : 'bg-[#0D1418] text-gray-300 hover:bg-[#182730] border border-[#23353F]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredFindings.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <CheckCircleIcon className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="text-base font-semibold text-white">No security findings in this category</p>
                <p className="text-sm mt-1">The inspected configuration files do not trigger risk indicators for {selectedCategory}.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFindings.map((finding) => {
                  const isExpanded = expandedFindings.has(finding.id);
                  return (
                    <div
                      key={finding.id}
                      className="border border-[#23353F] rounded-lg bg-[#0D1418] overflow-hidden"
                    >
                      <div
                        onClick={() => toggleFindingExpand(finding.id)}
                        className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#182730]/70 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {getCategoryIcon(finding.category)}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {getSeverityBadge(finding.severity)}
                              <span className="font-semibold text-white text-sm truncate">
                                {finding.title}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 font-mono truncate">
                              {finding.file_path} {finding.line_number ? `(line ${finding.line_number})` : ''}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 text-gray-400">
                          {isExpanded ? (
                            <ChevronDownIcon className="w-5 h-5" />
                          ) : (
                            <ChevronRightIcon className="w-5 h-5" />
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-4 border-t border-[#23353F] bg-[#10191F] text-sm space-y-3">
                          <div>
                            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                              Description
                            </span>
                            <p className="text-gray-300 mt-0.5">{finding.description}</p>
                          </div>
                          <div>
                            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                              Evidence / Context
                            </span>
                            <pre className="mt-1 p-2.5 rounded bg-[#0A0E11] text-xs font-mono text-cyan-300 overflow-x-auto border border-[#23353F]">
                              {finding.evidence}
                            </pre>
                          </div>
                          <div>
                            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                              Remediation Guidance
                            </span>
                            <div className="mt-1 p-3 rounded bg-emerald-950/30 border border-emerald-900/50 text-emerald-200 text-xs">
                              {finding.remediation}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Historical Repository Scans */}
      <div className="bg-[#131E24] border border-[#23353F] rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#23353F] pb-3 mb-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-[#05AD98]" />
            Scan History
          </h3>
          <button
            onClick={fetchHistory}
            disabled={loadingHistory}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowPathIcon className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
            Refresh History
          </button>
        </div>

        {history.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">
            No repositories have been scanned yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-[#0D1418] border-b border-[#23353F]">
                <tr>
                  <th className="py-2.5 px-3">Repository</th>
                  <th className="py-2.5 px-3">Scanned At</th>
                  <th className="py-2.5 px-3">Critical</th>
                  <th className="py-2.5 px-3">High</th>
                  <th className="py-2.5 px-3">Medium</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23353F]">
                {history.map((item) => (
                  <tr
                    key={item.analysis_id}
                    onClick={() => setRepoUrl(item.repository_url)}
                    className="hover:bg-[#182730] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-semibold text-white">
                      {item.owner}/{item.repo}
                    </td>
                    <td className="py-3 px-3 text-xs text-gray-400">
                      {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-red-400 font-bold">{item.critical_count}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-amber-400 font-bold">{item.high_count}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-yellow-400 font-bold">{item.medium_count}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-gray-200">
                      {item.total_findings}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

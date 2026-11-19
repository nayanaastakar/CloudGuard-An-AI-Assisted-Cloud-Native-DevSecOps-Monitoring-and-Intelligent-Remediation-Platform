import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ShieldCheckIcon,
  ArrowPathIcon,
  SparklesIcon,
  CommandLineIcon,
  LockClosedIcon,
  ArrowRightIcon,
  CodeBracketSquareIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
  LinkIcon,
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
  const [auditStatus, setAuditStatus] = useState<'idle' | 'running' | 'success' | 'partial' | 'error'>('idle');
  const [auditError, setAuditError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Custom GitHub Repository Integration state
  const [repoInputUrl, setRepoInputUrl] = useState('');
  const [connectedRepo, setConnectedRepo] = useState<{
    owner: string;
    repo: string;
    url: string;
    description?: string;
    defaultBranch?: string;
    stars?: number;
    connectedAt: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('cloudguard_connected_github_repo');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [repoValidating, setRepoValidating] = useState(false);
  const [repoError, setRepoError] = useState<string | null>(null);

  const handleConnectRepo = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setRepoError(null);
    // Strip query parameters and hash fragments (e.g., ?utm_source=... or #readme)
    const strippedUrl = repoInputUrl.trim().split('?')[0].split('#')[0].replace(/\/+$/, '');
    if (!strippedUrl) {
      setRepoError('Please paste a valid GitHub repository URL.');
      return;
    }

    // Match github.com/:owner/:repo
    const match = strippedUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git|\/)?$/);
    if (!match) {
      setRepoError('Invalid GitHub URL format. Example: https://github.com/username/repository');
      return;
    }

    const [, owner, rawRepo] = match;
    const repo = rawRepo.replace(/\.git$/, '');
    setRepoValidating(true);
    try {
      // Validate repository accessibility via GitHub API
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (res.status === 404) {
        setRepoError(`Repository '${owner}/${repo}' not found or is private.`);
        setRepoValidating(false);
        return;
      }
      if (!res.ok) {
        // Fallback for rate limiting or other API issues while validating format
        const fallbackData = {
          owner,
          repo,
          url: `https://github.com/${owner}/${repo}`,
          description: `Custom repository connected by user (${owner}/${repo})`,
          defaultBranch: 'main',
          connectedAt: new Date().toISOString(),
        };
        setConnectedRepo(fallbackData);
        localStorage.setItem('cloudguard_connected_github_repo', JSON.stringify(fallbackData));
        setRepoInputUrl('');
        setRepoValidating(false);
        return;
      }

      const data = await res.json();
      const repoData = {
        owner: data.owner?.login || owner,
        repo: data.name || repo,
        url: data.html_url || `https://github.com/${owner}/${repo}`,
        description: data.description || 'No description provided.',
        defaultBranch: data.default_branch || 'main',
        stars: data.stargazers_count,
        connectedAt: new Date().toISOString(),
      };
      setConnectedRepo(repoData);
      localStorage.setItem('cloudguard_connected_github_repo', JSON.stringify(repoData));
      setRepoInputUrl('');
    } catch (err: any) {
      setRepoError(`Connection error: ${err.message || 'Could not verify repository.'}`);
    } finally {
      setRepoValidating(false);
    }
  };

  const handleDisconnectRepo = () => {
    setConnectedRepo(null);
    localStorage.removeItem('cloudguard_connected_github_repo');
    setRepoError(null);
  };

  const { data: posture, isLoading, refetch, isError: postureLoadFailed, error: postureLoadError } = useQuery<SecurityPostureResponse>({
    queryKey: ['cloudguard-posture'],
    queryFn: async () => {
      const res = await cloudguardApi.getSecurityPosture('default');
      return res.data;
    },
    staleTime: 30000,
  });

  const auditMutation = useMutation({
    mutationFn: () => cloudguardApi.triggerSecurityAudit('default'),
    onMutate: () => {
      setAuditError(null);
      setAuditStatus('running');
    },
    onSuccess: (res) => {
      queryClient.setQueryData(['cloudguard-posture'], res.data);
      if (res.data.audit_status === 'unavailable') {
        setAuditError(res.data.error || Object.values(res.data.checks || {}).map((check) => check.error).filter(Boolean).join('; ') || 'Kubernetes data is unavailable.');
        setAuditStatus('error');
      } else {
        setAuditStatus(res.data.audit_status === 'partial' ? 'partial' : 'success');
      }
    },
    onError: (error: any) => {
      setAuditError(error?.response?.data?.detail || error?.message || 'Audit request failed.');
      setAuditStatus('error');
    },
  });

  const findings = posture?.findings || [];
  const score = posture?.security_score?.score;
  const grade = posture?.security_score?.grade;
  const scanError = auditError || posture?.error || (postureLoadFailed ? (postureLoadError as any)?.response?.data?.detail || (postureLoadError as Error)?.message : null);

  const filteredFindings = findings.filter((f) => {
    const matchesNs = selectedNamespace === 'all' || f.namespace === selectedNamespace;
    const matchesSev = selectedSeverity === 'all' || f.severity === selectedSeverity;
    return matchesNs && matchesSev;
  });

  const namespaces = Array.from(new Set(findings.map((f) => f.namespace)));

  const getGradeColor = (g: string) => {
    switch (g) {
      case 'A': return 'from-blue-600 to-violet-600 text-blue-300 border-blue-500/30';
      case 'B': return 'from-blue-600 to-violet-600 text-violet-300 border-violet-500/30';
      case 'C': return 'from-amber-500 to-yellow-600 text-amber-300 border-amber-500/30';
      case 'D': return 'from-orange-500 to-red-600 text-orange-300 border-orange-500/30';
      default: return 'from-red-600 to-rose-700 text-red-300 border-red-500/30';
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
        return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-700 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-500/25">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-100 tracking-tight">CloudGuard Security Center</h1>
              {posture?.provenance && <ProvenanceBadge provenance={posture.provenance} />}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Continuous Kubernetes posture evaluation, attack path graphing, and automated remediation.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Data source: {posture?.provenance?.source || 'not yet checked'}{posture?.audit_status ? ` · Audit ${posture.audit_status}` : ''}{posture?.audit_run_id ? ` · Run ${posture.audit_run_id}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={() => auditMutation.mutate()}
              disabled={auditMutation.isPending || isLoading}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-colors disabled:opacity-50 ${
                auditStatus === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : auditStatus === 'error'
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : auditStatus === 'partial'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-gray-200'
              }`}
            >
              <ArrowPathIcon className={`h-4 w-4 ${auditMutation.isPending ? 'animate-spin' : ''}`} />
              {auditMutation.isPending
                ? 'Running Audit…'
                : auditStatus === 'success'
                ? 'Audit Complete ✓'
                : auditStatus === 'error'
                ? 'Audit Failed ✗'
                : auditStatus === 'partial'
                ? 'Audit Partial'
                : 'Run Security Audit'}
            </button>
            {auditStatus === 'error' && (
              <span className="text-xs text-red-400">Audit failed — check backend logs</span>
            )}
            {scanError && <span role="alert" className="max-w-md text-right text-xs text-red-400">{scanError}</span>}
            {auditStatus === 'partial' && (
              <span role="status" className="max-w-md text-right text-xs text-amber-300">
                Partial audit: {Object.values(posture?.checks || {}).map((check) => check.error).filter(Boolean).join('; ') || 'some checks did not complete.'}
              </span>
            )}
          </div>
          <button
            onClick={() => navigate('/remediation')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-blue-500/25 transition-all"
          >
            <LockClosedIcon className="h-4 w-4" />
            Remediation Center
          </button>
        </div>
      </div>

      {/* Hero Security Posture & Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posture Score Card */}
        <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Cluster Security Posture Score
              </span>
              <span className="text-xs text-gray-500">CIS & PSS Benchmarked</span>
            </div>

            {score !== undefined && score !== null && grade ? <div className="flex items-baseline gap-4 my-2">
              <span className="text-6xl font-black text-white tracking-tight">{score}</span>
              <span className="text-2xl text-gray-500">/ 100</span>
              <div className={`px-4 py-1.5 rounded-xl border text-xl font-bold bg-gradient-to-br ${getGradeColor(grade)} ml-auto`}>
                Grade {grade}
              </div>
            </div> : <p className="my-5 text-lg font-semibold text-red-300">No posture score: cluster audit unavailable.</p>}

            <p className="text-xs text-gray-400 mt-2">
              Scoring Formula: <code className="text-blue-400 font-mono">100 - (15×Crit + 8×High + 3×Med + 1×Low)</code>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700 grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-[10px] uppercase font-semibold text-red-400">Critical</p>
              <p className="text-xl font-bold text-white mt-0.5">{posture?.security_score?.critical ?? '—'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-amber-400">High</p>
              <p className="text-xl font-bold text-white mt-0.5">{posture?.security_score?.high ?? '—'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-yellow-400">Medium</p>
              <p className="text-xl font-bold text-white mt-0.5">{posture?.security_score?.medium ?? '—'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-violet-400">Low</p>
              <p className="text-xl font-bold text-white mt-0.5">{posture?.security_score?.low ?? '—'}</p>
            </div>
          </div>
        </div>

        {/* Security Modules Summary Cards */}
        <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-lg flex flex-col justify-between">
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
            <p className="text-xs text-gray-400">
              Discovers multi-hop lateral movement connecting external ingresses, vulnerable workloads, overprivileged service accounts, and cluster secrets.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Simulate Attack Graph</span>
            <button
              onClick={() => navigate('/attack-paths')}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Explore Paths <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* AI Incident Investigation Card */}
        <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-violet-400" />
                <h3 className="text-base font-semibold text-white">AI Incident Correlation</h3>
              </div>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                Gemini 2.5
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Correlates warning events, container logs, and security findings into actionable investigations with root-cause explanations and evidence timelines.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Live Incident Timeline</span>
            <button
              onClick={() => navigate('/incidents')}
              className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              Investigate <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive GitHub Repository Integration Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-slate-700/80 shadow-xl transition-all">
        {connectedRepo ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4 min-w-0">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex-shrink-0 text-emerald-400">
                <CodeBracketSquareIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-white tracking-tight">{connectedRepo.owner}/{connectedRepo.repo}</h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircleIcon className="h-3 w-3" />
                    Connected
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    Branch: {connectedRepo.defaultBranch || 'main'}
                  </span>
                  {connectedRepo.stars !== undefined && (
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      ★ {connectedRepo.stars}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {connectedRepo.description || 'Configured project source repository for DevSecOps analysis.'}
                </p>
                <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                  Synced repository URL: <span className="text-slate-400 select-all">{connectedRepo.url}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap w-full md:w-auto justify-end">
              <a
                href={connectedRepo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-blue-700/20"
              >
                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                Open Repository
              </a>
              <button
                onClick={() => navigate('/github-repos')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-700"
              >
                <CodeBracketSquareIcon className="h-3.5 w-3.5" />
                Repo Details
              </button>
              <button
                onClick={handleDisconnectRepo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 text-xs font-medium transition-colors border border-red-800/40"
                title="Disconnect this repository"
              >
                <XCircleIcon className="h-3.5 w-3.5" />
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="flex items-start gap-4 max-w-xl">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 flex-shrink-0 text-blue-400">
                <LinkIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Connect GitHub Repository</h3>
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-800 text-slate-400 border border-slate-700 uppercase">
                    Configurable
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Connect your source code repository to associate workloads, scan Dockerfiles/manifests, and correlate security findings with commits.
                </p>
                {repoError && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 bg-red-950/50 p-2 rounded border border-red-800/50">
                    <XCircleIcon className="h-4 w-4 flex-shrink-0" />
                    {repoError}
                  </p>
                )}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleConnectRepo();
              }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto"
            >
              <input
                type="text"
                value={repoInputUrl}
                onChange={(e) => {
                  setRepoInputUrl(e.target.value);
                  if (repoError) setRepoError(null);
                }}
                placeholder="Paste GitHub repository URL (e.g. https://github.com/owner/repo)"
                className="w-full sm:w-80 md:w-96 px-3.5 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                disabled={repoValidating}
              />
              <button
                type="submit"
                disabled={repoValidating || !repoInputUrl.trim()}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors flex-shrink-0 shadow-lg shadow-blue-700/20"
              >
                {repoValidating ? (
                  <>
                    <ArrowPathIcon className="h-3.5 w-3.5 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-3.5 w-3.5" />
                    Connect Repository
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase text-gray-400">Filters:</span>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-primary-400"
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
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-primary-400"
          >
            <option value="all">All Namespaces</option>
            {namespaces.map((ns) => (
              <option key={ns} value={ns}>{ns}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-gray-400">
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
                    <span className="font-mono text-xs text-violet-300">{finding.resource_type}/{finding.resource_name}</span>
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
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/30 transition-colors"
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

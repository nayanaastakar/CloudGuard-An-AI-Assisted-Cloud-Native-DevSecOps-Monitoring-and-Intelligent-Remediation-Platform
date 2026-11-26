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
  LinkIcon } from
'@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import cloudguardApi, { SecurityFinding, SecurityPostureResponse } from '../../services/cloudguardApi';
import RemediationModal from './RemediationModal';
import ProvenanceBadge from '../common/ProvenanceBadge';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";

export default function CloudGuardDashboard() {
  const navigate = useNavigate();
  const [selectedNamespace, setSelectedNamespace] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [activeRemediationFinding, setActiveRemediationFinding] = useState(null);
  const [auditStatus, setAuditStatus] = useState('idle');
  const [auditError, setAuditError] = useState(null);
  const queryClient = useQueryClient();

  // Custom GitHub Repository Integration state
  const [repoInputUrl, setRepoInputUrl] = useState('');
  const [connectedRepo, setConnectedRepo] = useState(







    () => {
      try {
        const saved = localStorage.getItem('cloudguard_connected_github_repo');
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    });
  const [repoValidating, setRepoValidating] = useState(false);
  const [repoError, setRepoError] = useState(null);

  const handleConnectRepo = async (e) => {
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
          connectedAt: new Date().toISOString()
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
        connectedAt: new Date().toISOString()
      };
      setConnectedRepo(repoData);
      localStorage.setItem('cloudguard_connected_github_repo', JSON.stringify(repoData));
      setRepoInputUrl('');
    } catch (err) {
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

  const { data: posture, isLoading, refetch, isError: postureLoadFailed, error: postureLoadError } = useQuery({
    queryKey: ['cloudguard-posture'],
    queryFn: async () => {
      const res = await cloudguardApi.getSecurityPosture('default');
      return res.data;
    },
    staleTime: 30000
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
    onError: (error) => {
      setAuditError(error?.response?.data?.detail || error?.message || 'Audit request failed.');
      setAuditStatus('error');
    }
  });

  const findings = posture?.findings || [];
  const score = posture?.security_score?.score;
  const grade = posture?.security_score?.grade;
  const scanError = auditError || posture?.error || (postureLoadFailed ? postureLoadError?.response?.data?.detail || postureLoadError?.message : null);

  const filteredFindings = findings.filter((f) => {
    const matchesNs = selectedNamespace === 'all' || f.namespace === selectedNamespace;
    const matchesSev = selectedSeverity === 'all' || f.severity === selectedSeverity;
    return matchesNs && matchesSev;
  });

  const namespaces = Array.from(new Set(findings.map((f) => f.namespace)));

  const getGradeColor = (g) => {
    switch (g) {
      case 'A':return 'from-blue-600 to-violet-600 text-blue-300 border-blue-500/30';
      case 'B':return 'from-blue-600 to-violet-600 text-violet-300 border-violet-500/30';
      case 'C':return 'from-amber-500 to-yellow-600 text-amber-300 border-amber-500/30';
      case 'D':return 'from-orange-500 to-red-600 text-orange-300 border-orange-500/30';
      default:return 'from-red-600 to-rose-700 text-red-300 border-red-500/30';
    }
  };

  const getSeverityBadge = (sev) => {
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

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-700 shadow-xl", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-3.5 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-500/25", children: /*#__PURE__*/
            _jsxDEV(ShieldCheckIcon, { className: "h-8 w-8 text-white" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
              _jsxDEV("h1", { className: "text-2xl font-bold text-gray-100 tracking-tight", children: "CloudGuard Security Center" }, void 0, false),
              posture?.provenance && /*#__PURE__*/_jsxDEV(ProvenanceBadge, { provenance: posture.provenance }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-400 mt-1", children: "Continuous Kubernetes posture evaluation, attack path graphing, and automated remediation." }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500 mt-1", children: ["Data source: ",
              posture?.provenance?.source || 'not yet checked', posture?.audit_status ? ` · Audit ${posture.audit_status}` : '', posture?.audit_run_id ? ` · Run ${posture.audit_run_id}` : ''] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex flex-col items-end gap-1", children: [/*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => auditMutation.mutate(),
              disabled: auditMutation.isPending || isLoading,
              className: `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-colors disabled:opacity-50 ${
              auditStatus === 'success' ?
              'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
              auditStatus === 'error' ?
              'bg-red-500/10 border-red-500/30 text-red-400' :
              auditStatus === 'partial' ?
              'bg-amber-500/10 border-amber-500/30 text-amber-300' :
              'bg-slate-900 hover:bg-slate-800 border-slate-700 text-gray-200'}`, children: [/*#__PURE__*/


              _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${auditMutation.isPending ? 'animate-spin' : ''}` }, void 0, false),
              auditMutation.isPending ?
              'Running Audit…' :
              auditStatus === 'success' ?
              'Audit Complete ✓' :
              auditStatus === 'error' ?
              'Audit Failed ✗' :
              auditStatus === 'partial' ?
              'Audit Partial' :
              'Run Security Audit'] }, void 0, true
            ),
            auditStatus === 'error' && /*#__PURE__*/
            _jsxDEV("span", { className: "text-xs text-red-400", children: "Audit failed — check backend logs" }, void 0, false),

            scanError && /*#__PURE__*/_jsxDEV("span", { role: "alert", className: "max-w-md text-right text-xs text-red-400", children: scanError }, void 0, false),
            auditStatus === 'partial' && /*#__PURE__*/
            _jsxDEV("span", { role: "status", className: "max-w-md text-right text-xs text-amber-300", children: ["Partial audit: ",
              Object.values(posture?.checks || {}).map((check) => check.error).filter(Boolean).join('; ') || 'some checks did not complete.'] }, void 0, true
            )] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => navigate('/remediation'),
            className: "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-blue-500/25 transition-all", children: [/*#__PURE__*/

            _jsxDEV(LockClosedIcon, { className: "h-4 w-4" }, void 0, false), "Remediation Center"] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-lg flex flex-col justify-between relative overflow-hidden", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" }, void 0, false), /*#__PURE__*/

          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-xs font-semibold uppercase tracking-wider text-gray-400", children: "Cluster Security Posture Score" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs text-gray-500", children: "CIS & PSS Benchmarked" }, void 0, false)] }, void 0, true
            ),

            score !== undefined && score !== null && grade ? /*#__PURE__*/_jsxDEV("div", { className: "flex items-baseline gap-4 my-2", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-6xl font-black text-white tracking-tight", children: score }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-2xl text-gray-500", children: "/ 100" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: `px-4 py-1.5 rounded-xl border text-xl font-bold bg-gradient-to-br ${getGradeColor(grade)} ml-auto`, children: ["Grade ",
                grade] }, void 0, true
              )] }, void 0, true
            ) : /*#__PURE__*/_jsxDEV("p", { className: "my-5 text-lg font-semibold text-red-300", children: "No posture score: cluster audit unavailable." }, void 0, false), /*#__PURE__*/

            _jsxDEV("p", { className: "text-xs text-gray-400 mt-2", children: ["Scoring Formula: ", /*#__PURE__*/
              _jsxDEV("code", { className: "text-blue-400 font-mono", children: "100 - (3×Crit + 1.5×High + 0.5×Med + 0.2×Low)" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "mt-6 pt-4 border-t border-slate-700 grid grid-cols-4 gap-2 text-center", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-[10px] uppercase font-semibold text-red-400", children: "Critical" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xl font-bold text-white mt-0.5", children: posture?.security_score?.critical ?? '—' }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-[10px] uppercase font-semibold text-amber-400", children: "High" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xl font-bold text-white mt-0.5", children: posture?.security_score?.high ?? '—' }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-[10px] uppercase font-semibold text-yellow-400", children: "Medium" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xl font-bold text-white mt-0.5", children: posture?.security_score?.medium ?? '—' }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-[10px] uppercase font-semibold text-violet-400", children: "Low" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xl font-bold text-white mt-0.5", children: posture?.security_score?.low ?? '—' }, void 0, false)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-lg flex flex-col justify-between", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV(CommandLineIcon, { className: "h-5 w-5 text-red-400" }, void 0, false), /*#__PURE__*/
                _jsxDEV("h3", { className: "text-base font-semibold text-white", children: "Kubernetes Attack Path Analysis" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("span", { className: "px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20", children: "Active Vectors" }, void 0, false

              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-400", children: "Discovers multi-hop lateral movement connecting external ingresses, vulnerable workloads, overprivileged service accounts, and cluster secrets." }, void 0, false

            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "mt-6 pt-4 border-t border-slate-700 flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-sm font-medium text-gray-300", children: "Simulate Attack Graph" }, void 0, false), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => navigate('/attack-paths'),
              className: "flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors", children: [
              "Explore Paths ", /*#__PURE__*/
              _jsxDEV(ArrowRightIcon, { className: "h-3.5 w-3.5" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-lg flex flex-col justify-between", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV(SparklesIcon, { className: "h-5 w-5 text-violet-400" }, void 0, false), /*#__PURE__*/
                _jsxDEV("h3", { className: "text-base font-semibold text-white", children: "AI Incident Correlation" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("span", { className: "px-2 py-0.5 text-xs font-semibold rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20", children: "Gemini 2.5" }, void 0, false

              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-400", children: "Correlates warning events, container logs, and security findings into actionable investigations with root-cause explanations and evidence timelines." }, void 0, false

            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "mt-6 pt-4 border-t border-slate-700 flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-sm font-medium text-gray-300", children: "Live Incident Timeline" }, void 0, false), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => navigate('/incidents'),
              className: "flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors", children: [
              "Investigate ", /*#__PURE__*/
              _jsxDEV(ArrowRightIcon, { className: "h-3.5 w-3.5" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border border-slate-700/80 shadow-xl transition-all", children:
        connectedRepo ? /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-col md:flex-row items-start md:items-center justify-between gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-start sm:items-center gap-4 min-w-0", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex-shrink-0 text-emerald-400", children: /*#__PURE__*/
              _jsxDEV(CodeBracketSquareIcon, { className: "h-6 w-6" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "min-w-0", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2 flex-wrap", children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-sm font-bold text-white tracking-tight", children: [connectedRepo.owner, "/", connectedRepo.repo] }, void 0, true), /*#__PURE__*/
                _jsxDEV("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30", children: [/*#__PURE__*/
                  _jsxDEV(CheckCircleIcon, { className: "h-3 w-3" }, void 0, false), "Connected"] }, void 0, true

                ), /*#__PURE__*/
                _jsxDEV("span", { className: "px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700", children: ["Branch: ",
                  connectedRepo.defaultBranch || 'main'] }, void 0, true
                ),
                connectedRepo.stars !== undefined && /*#__PURE__*/
                _jsxDEV("span", { className: "px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20", children: ["★ ",
                  connectedRepo.stars] }, void 0, true
                )] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-slate-400 mt-1 line-clamp-1", children:
                connectedRepo.description || 'Configured project source repository for DevSecOps analysis.' }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "text-[11px] text-slate-500 mt-0.5 font-mono", children: ["Synced repository URL: ", /*#__PURE__*/
                _jsxDEV("span", { className: "text-slate-400 select-all", children: connectedRepo.url }, void 0, false)] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-2.5 flex-wrap sm:flex-nowrap w-full md:w-auto justify-end", children: [/*#__PURE__*/
            _jsxDEV("a", {
              href: connectedRepo.url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-blue-700/20", children: [/*#__PURE__*/

              _jsxDEV(ArrowTopRightOnSquareIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Open Repository"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => navigate('/github-repos'),
              className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-700", children: [/*#__PURE__*/

              _jsxDEV(CodeBracketSquareIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Repo Details"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: handleDisconnectRepo,
              className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 text-xs font-medium transition-colors border border-red-800/40",
              title: "Disconnect this repository", children: [/*#__PURE__*/

              _jsxDEV(XCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Disconnect"] }, void 0, true

            )] }, void 0, true
          )] }, void 0, true
        ) : /*#__PURE__*/

        _jsxDEV("div", { className: "flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-start gap-4 max-w-xl", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 flex-shrink-0 text-blue-400", children: /*#__PURE__*/
              _jsxDEV(LinkIcon, { className: "h-6 w-6" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-sm font-bold text-white", children: "Connect GitHub Repository" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-800 text-slate-400 border border-slate-700 uppercase", children: "Configurable" }, void 0, false

                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-slate-400 mt-1", children: "Connect your source code repository to associate workloads, scan Dockerfiles/manifests, and correlate security findings with commits." }, void 0, false

              ),
              repoError && /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-red-400 mt-2 flex items-center gap-1.5 bg-red-950/50 p-2 rounded border border-red-800/50", children: [/*#__PURE__*/
                _jsxDEV(XCircleIcon, { className: "h-4 w-4 flex-shrink-0" }, void 0, false),
                repoError] }, void 0, true
              )] }, void 0, true

            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("form", {
            onSubmit: (e) => {
              e.preventDefault();
              handleConnectRepo();
            },
            className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto", children: [/*#__PURE__*/

            _jsxDEV("input", {
              type: "text",
              value: repoInputUrl,
              onChange: (e) => {
                setRepoInputUrl(e.target.value);
                if (repoError) setRepoError(null);
              },
              placeholder: "Paste GitHub repository URL (e.g. https://github.com/owner/repo)",
              className: "w-full sm:w-80 md:w-96 px-3.5 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono",
              disabled: repoValidating }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("button", {
              type: "submit",
              disabled: repoValidating || !repoInputUrl.trim(),
              className: "flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors flex-shrink-0 shadow-lg shadow-blue-700/20", children:

              repoValidating ? /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(ArrowPathIcon, { className: "h-3.5 w-3.5 animate-spin" }, void 0, false), "Validating..."] }, void 0, true

              ) : /*#__PURE__*/

              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(LinkIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Connect Repository"] }, void 0, true

              ) }, void 0, false

            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-700", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("span", { className: "text-xs font-semibold uppercase text-gray-400", children: "Filters:" }, void 0, false), /*#__PURE__*/

          _jsxDEV("select", {
            value: selectedSeverity,
            onChange: (e) => setSelectedSeverity(e.target.value),
            className: "px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-primary-400", children: [/*#__PURE__*/

            _jsxDEV("option", { value: "all", children: "All Severities" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "critical", children: "Critical" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "high", children: "High" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "medium", children: "Medium" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "low", children: "Low" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("select", {
            value: selectedNamespace,
            onChange: (e) => setSelectedNamespace(e.target.value),
            className: "px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-primary-400", children: [/*#__PURE__*/

            _jsxDEV("option", { value: "all", children: "All Namespaces" }, void 0, false),
            namespaces.map((ns) => /*#__PURE__*/
            _jsxDEV("option", { value: ns, children: ns }, ns, false)
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "text-xs text-gray-400", children: ["Showing ", /*#__PURE__*/
          _jsxDEV("span", { className: "font-semibold text-white", children: filteredFindings.length }, void 0, false), " of ", findings.length, " security findings"] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl", children: /*#__PURE__*/
        _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
          _jsxDEV("table", { className: "w-full text-left text-sm", children: [/*#__PURE__*/
            _jsxDEV("thead", { className: "bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800", children: /*#__PURE__*/
              _jsxDEV("tr", { children: [/*#__PURE__*/
                _jsxDEV("th", { className: "py-3.5 px-6", children: "Severity" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-3.5 px-6", children: "Security Finding" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-3.5 px-6", children: "Resource & Namespace" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-3.5 px-6", children: "Category" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-3.5 px-6 text-right", children: "Actions" }, void 0, false)] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("tbody", { className: "divide-y divide-slate-800 text-slate-300", children: [
              filteredFindings.map((finding) => /*#__PURE__*/
              _jsxDEV("tr", { className: "hover:bg-slate-800/40 transition-colors", children: [/*#__PURE__*/
                _jsxDEV("td", { className: "py-4 px-6 whitespace-nowrap", children: /*#__PURE__*/
                  _jsxDEV("span", { className: `px-2.5 py-1 text-xs font-semibold rounded-full border ${getSeverityBadge(finding.severity)} uppercase`, children:
                    finding.severity }, void 0, false
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "py-4 px-6", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "font-semibold text-white", children: finding.title }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { className: "text-xs text-slate-400 mt-0.5 line-clamp-1", children: finding.description }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "py-4 px-6 whitespace-nowrap", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "font-mono text-xs text-violet-300", children: [finding.resource_type, "/", finding.resource_name] }, void 0, true), /*#__PURE__*/
                  _jsxDEV("div", { className: "text-xs text-slate-500 mt-0.5", children: ["ns: ", finding.namespace] }, void 0, true)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "py-4 px-6 whitespace-nowrap", children: /*#__PURE__*/
                  _jsxDEV("span", { className: "text-xs font-medium text-slate-400 uppercase tracking-wider", children:
                    finding.category.replace('_', ' ') }, void 0, false
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "py-4 px-6 text-right whitespace-nowrap", children: /*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => setActiveRemediationFinding(finding),
                    className: "px-3 py-1.5 text-xs font-semibold rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/30 transition-colors", children:
                    "Plan Remediation" }, void 0, false

                  ) }, void 0, false
                )] }, finding.finding_id, true
              )
              ),
              filteredFindings.length === 0 && /*#__PURE__*/
              _jsxDEV("tr", { children: /*#__PURE__*/
                _jsxDEV("td", { colSpan: 5, className: "py-12 text-center text-slate-500", children: [/*#__PURE__*/
                  _jsxDEV(ShieldCheckIcon, { className: "h-12 w-12 mx-auto text-slate-600 mb-2" }, void 0, false), "No security findings matching current filters."] }, void 0, true

                ) }, void 0, false
              )] }, void 0, true

            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false
      ),


      activeRemediationFinding && /*#__PURE__*/
      _jsxDEV(RemediationModal, {
        finding: activeRemediationFinding,
        onClose: () => setActiveRemediationFinding(null),
        onSuccess: () => {
          setActiveRemediationFinding(null);
          refetch();
        } }, void 0, false
      )] }, void 0, true

    ));

}
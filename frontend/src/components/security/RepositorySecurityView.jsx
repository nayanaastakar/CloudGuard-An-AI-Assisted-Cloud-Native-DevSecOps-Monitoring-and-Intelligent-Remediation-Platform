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
  KeyIcon } from
'@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';
import cloudguardApi, {
  RepositoryScanResult,
  RepositoryFinding,
  RepositoryScanHistoryItem } from
'../../services/cloudguardApi';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";

export default function RepositorySecurityView() {
  const [repoUrl, setRepoUrl] = useState(() => {
    try {
      const stored = localStorage.getItem('cloudguard_connected_github_repo');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.url || '';
      }
    } catch (e) {

      // Ignore storage errors
    }return '';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFindings, setExpandedFindings] = useState(new Set());

  // Load history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await cloudguardApi.getRepositoryScanHistory(10);
      setHistory(res.data || []);
    } catch (err) {
      console.error('Failed to load scan history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setLoading(true);
    setError(null);
    setScanResult(null);

    try {
      const res = await cloudguardApi.scanRepository(repoUrl.trim());
      setScanResult(res.data);
      fetchHistory(); // Refresh history table
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to scan repository';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleFindingExpand = (id) => {
    setExpandedFindings((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else
      next.add(id);
      return next;
    });
  };

  const filteredFindings = (scanResult?.findings || []).filter((f) => {
    if (selectedCategory === 'all') return true;
    return f.category === selectedCategory;
  });

  const getSeverityBadge = (sev) => {
    switch (sev.toUpperCase()) {
      case 'CRITICAL':
        return /*#__PURE__*/_jsxDEV("span", { className: "px-2 py-0.5 rounded text-xs font-bold bg-red-950/80 text-red-400 border border-red-800/60", children: "CRITICAL" }, void 0, false);
      case 'HIGH':
        return /*#__PURE__*/_jsxDEV("span", { className: "px-2 py-0.5 rounded text-xs font-bold bg-amber-950/80 text-amber-400 border border-amber-800/60", children: "HIGH" }, void 0, false);
      case 'MEDIUM':
        return /*#__PURE__*/_jsxDEV("span", { className: "px-2 py-0.5 rounded text-xs font-bold bg-yellow-950/80 text-yellow-400 border border-yellow-800/60", children: "MEDIUM" }, void 0, false);
      case 'LOW':
        return /*#__PURE__*/_jsxDEV("span", { className: "px-2 py-0.5 rounded text-xs font-bold bg-blue-950/80 text-blue-400 border border-blue-800/60", children: "LOW" }, void 0, false);
      default:
        return /*#__PURE__*/_jsxDEV("span", { className: "px-2 py-0.5 rounded text-xs font-bold bg-gray-900 text-gray-400 border border-gray-700", children: "INFO" }, void 0, false);
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'dockerfile':
        return /*#__PURE__*/_jsxDEV(CubeIcon, { className: "w-4 h-4 text-cyan-400" }, void 0, false);
      case 'kubernetes':
        return /*#__PURE__*/_jsxDEV(ServerStackIcon, { className: "w-4 h-4 text-emerald-400" }, void 0, false);
      case 'workflow':
        return /*#__PURE__*/_jsxDEV(CodeBracketIcon, { className: "w-4 h-4 text-purple-400" }, void 0, false);
      case 'secret':
        return /*#__PURE__*/_jsxDEV(KeyIcon, { className: "w-4 h-4 text-red-400" }, void 0, false);
      default:
        return /*#__PURE__*/_jsxDEV(DocumentTextIcon, { className: "w-4 h-4 text-yellow-400" }, void 0, false);
    }
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV(PageHeader, {
        title: "Repository Security",
        description: "Inspect public GitHub repositories for container misconfigurations, Kubernetes manifest risks, CI/CD pipeline vulnerabilities, and exposed secrets without code execution." }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "bg-[#131E24] border border-[#23353F] rounded-xl p-6 shadow-sm", children: [/*#__PURE__*/
        _jsxDEV("h3", { className: "text-lg font-semibold text-white mb-2 flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV(CodeBracketIcon, { className: "w-5 h-5 text-[#05AD98]" }, void 0, false), "Scan GitHub Repository"] }, void 0, true

        ), /*#__PURE__*/
        _jsxDEV("p", { className: "text-sm text-[#BBBFBF] mb-4", children: "Enter a public GitHub repository URL to analyze Dockerfiles, Kubernetes manifests, workflows, and secret patterns using real API inspection." }, void 0, false

        ), /*#__PURE__*/

        _jsxDEV("form", { onSubmit: handleScanSubmit, className: "flex flex-col sm:flex-row gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "relative flex-1", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400", children: /*#__PURE__*/
              _jsxDEV(MagnifyingGlassIcon, { className: "w-5 h-5" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: repoUrl,
              onChange: (e) => setRepoUrl(e.target.value),
              placeholder: "https://github.com/kubernetes/examples",
              disabled: loading,
              className: "w-full pl-10 pr-4 py-2.5 bg-[#0D1418] border border-[#23353F] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#05AD98] text-sm" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("button", {
            type: "submit",
            disabled: loading || !repoUrl.trim(),
            className: "inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#05AD98] hover:bg-[#05AD98]/90 text-slate-950 font-semibold text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#05AD98]/20", children:

            loading ? /*#__PURE__*/
            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: "w-4 h-4 animate-spin" }, void 0, false), "Scanning Repository..."] }, void 0, true

            ) : /*#__PURE__*/

            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: "w-4 h-4" }, void 0, false), "Scan Repository"] }, void 0, true

            ) }, void 0, false

          )] }, void 0, true
        ),

        error && /*#__PURE__*/
        _jsxDEV("div", { className: "mt-4 p-4 rounded-lg bg-red-950/60 border border-red-800/80 text-red-200 text-sm flex items-start gap-3", children: [/*#__PURE__*/
          _jsxDEV(ExclamationTriangleIcon, { className: "w-5 h-5 text-red-400 shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("p", { className: "font-semibold", children: "Scan Error" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "mt-0.5", children: error }, void 0, false)] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true

      ),


      scanResult && /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "bg-[#131E24] border border-[#23353F] rounded-xl p-5 shadow-sm", children: [/*#__PURE__*/
            _jsxDEV("h4", { className: "text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3", children: "Repository Information" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between text-sm", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-400", children: "Repository:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("a", {
                  href: scanResult.repository_url,
                  target: "_blank",
                  rel: "noreferrer",
                  className: "text-[#05AD98] hover:underline font-medium", children: [

                  scanResult.owner, "/", scanResult.repo] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between text-sm", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-400", children: "Default Branch:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-white font-mono text-xs px-2 py-0.5 bg-[#0D1418] rounded border border-[#23353F]", children:
                  scanResult.default_branch }, void 0, false
                )] }, void 0, true
              ),
              scanResult.latest_commit_sha && /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between text-sm", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-400", children: "Latest Commit:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-300 font-mono text-xs", children:
                  scanResult.latest_commit_sha.substring(0, 7) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center justify-between text-sm", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-400", children: "Files Inspected:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-white font-semibold", children: [scanResult.files_analyzed_count, " files"] }, void 0, true)] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "lg:col-span-2 bg-[#131E24] border border-[#23353F] rounded-xl p-5 shadow-sm", children: [/*#__PURE__*/
            _jsxDEV("h4", { className: "text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3", children: "Security Findings Breakdown" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "bg-[#0D1418] border border-red-900/50 rounded-lg p-3 text-center", children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-2xl font-bold text-red-400", children: scanResult.critical_count }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-400 mt-1 uppercase font-semibold", children: "Critical" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "bg-[#0D1418] border border-amber-900/50 rounded-lg p-3 text-center", children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-2xl font-bold text-amber-400", children: scanResult.high_count }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-400 mt-1 uppercase font-semibold", children: "High" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "bg-[#0D1418] border border-yellow-900/50 rounded-lg p-3 text-center", children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-2xl font-bold text-yellow-400", children: scanResult.medium_count }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-400 mt-1 uppercase font-semibold", children: "Medium" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "bg-[#0D1418] border border-blue-900/50 rounded-lg p-3 text-center", children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-2xl font-bold text-blue-400", children: scanResult.low_count }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-400 mt-1 uppercase font-semibold", children: "Low" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ),
            scanResult.notes && scanResult.notes.length > 0 && /*#__PURE__*/
            _jsxDEV("div", { className: "mt-3 text-xs text-gray-400 italic", children: ["Note: ",
              scanResult.notes.join(' ')] }, void 0, true
            )] }, void 0, true

          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "bg-[#131E24] border border-[#23353F] rounded-xl p-5 shadow-sm", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex flex-wrap items-center justify-between gap-3 border-b border-[#23353F] pb-4 mb-4", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-base font-semibold text-white", children: ["Detailed Security Findings (",
              filteredFindings.length, ")"] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex flex-wrap gap-2 text-xs", children:
              ['all', 'dockerfile', 'kubernetes', 'workflow', 'secret', 'dependency'].map((cat) => /*#__PURE__*/
              _jsxDEV("button", {

                onClick: () => setSelectedCategory(cat),
                className: `px-3 py-1.5 rounded-lg font-medium capitalize transition-colors ${
                selectedCategory === cat ?
                'bg-[#05AD98] text-slate-950 font-bold' :
                'bg-[#0D1418] text-gray-300 hover:bg-[#182730] border border-[#23353F]'}`, children:


                cat }, cat, false
              )
              ) }, void 0, false
            )] }, void 0, true
          ),

          filteredFindings.length === 0 ? /*#__PURE__*/
          _jsxDEV("div", { className: "py-12 text-center text-gray-400", children: [/*#__PURE__*/
            _jsxDEV(CheckCircleIcon, { className: "w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-base font-semibold text-white", children: "No security findings in this category" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm mt-1", children: ["The inspected configuration files do not trigger risk indicators for ", selectedCategory, "."] }, void 0, true)] }, void 0, true
          ) : /*#__PURE__*/

          _jsxDEV("div", { className: "space-y-3", children:
            filteredFindings.map((finding) => {
              const isExpanded = expandedFindings.has(finding.id);
              return (/*#__PURE__*/
                _jsxDEV("div", {

                  className: "border border-[#23353F] rounded-lg bg-[#0D1418] overflow-hidden", children: [/*#__PURE__*/

                  _jsxDEV("div", {
                    onClick: () => toggleFindingExpand(finding.id),
                    className: "p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#182730]/70 transition-colors", children: [/*#__PURE__*/

                    _jsxDEV("div", { className: "flex items-center gap-3 min-w-0", children: [
                      getCategoryIcon(finding.category), /*#__PURE__*/
                      _jsxDEV("div", { className: "min-w-0", children: [/*#__PURE__*/
                        _jsxDEV("div", { className: "flex items-center gap-2 flex-wrap", children: [
                          getSeverityBadge(finding.severity), /*#__PURE__*/
                          _jsxDEV("span", { className: "font-semibold text-white text-sm truncate", children:
                            finding.title }, void 0, false
                          )] }, void 0, true
                        ), /*#__PURE__*/
                        _jsxDEV("p", { className: "text-xs text-gray-400 mt-1 font-mono truncate", children: [
                          finding.file_path, " ", finding.line_number ? `(line ${finding.line_number})` : ''] }, void 0, true
                        )] }, void 0, true
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "shrink-0 text-gray-400", children:
                      isExpanded ? /*#__PURE__*/
                      _jsxDEV(ChevronDownIcon, { className: "w-5 h-5" }, void 0, false) : /*#__PURE__*/

                      _jsxDEV(ChevronRightIcon, { className: "w-5 h-5" }, void 0, false) }, void 0, false

                    )] }, void 0, true
                  ),

                  isExpanded && /*#__PURE__*/
                  _jsxDEV("div", { className: "p-4 border-t border-[#23353F] bg-[#10191F] text-sm space-y-3", children: [/*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs uppercase tracking-wider text-gray-400 font-semibold", children: "Description" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-gray-300 mt-0.5", children: finding.description }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs uppercase tracking-wider text-gray-400 font-semibold", children: "Evidence / Context" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("pre", { className: "mt-1 p-2.5 rounded bg-[#0A0E11] text-xs font-mono text-cyan-300 overflow-x-auto border border-[#23353F]", children:
                        finding.evidence }, void 0, false
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs uppercase tracking-wider text-emerald-400 font-semibold", children: "Remediation Guidance" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "mt-1 p-3 rounded bg-emerald-950/30 border border-emerald-900/50 text-emerald-200 text-xs", children:
                        finding.remediation }, void 0, false
                      )] }, void 0, true
                    )] }, void 0, true
                  )] }, finding.id, true

                ));

            }) }, void 0, false
          )] }, void 0, true

        )] }, void 0, true
      ), /*#__PURE__*/



      _jsxDEV("div", { className: "bg-[#131E24] border border-[#23353F] rounded-xl p-5 shadow-sm", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-between border-b border-[#23353F] pb-3 mb-4", children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-base font-semibold text-white flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(ClockIcon, { className: "w-5 h-5 text-[#05AD98]" }, void 0, false), "Scan History"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: fetchHistory,
            disabled: loadingHistory,
            className: "text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors", children: [/*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}` }, void 0, false), "Refresh History"] }, void 0, true

          )] }, void 0, true
        ),

        history.length === 0 ? /*#__PURE__*/
        _jsxDEV("p", { className: "text-sm text-gray-400 py-4 text-center", children: "No repositories have been scanned yet." }, void 0, false

        ) : /*#__PURE__*/

        _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
          _jsxDEV("table", { className: "w-full text-left text-sm text-gray-300", children: [/*#__PURE__*/
            _jsxDEV("thead", { className: "text-xs text-gray-400 uppercase bg-[#0D1418] border-b border-[#23353F]", children: /*#__PURE__*/
              _jsxDEV("tr", { children: [/*#__PURE__*/
                _jsxDEV("th", { className: "py-2.5 px-3", children: "Repository" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-2.5 px-3", children: "Scanned At" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-2.5 px-3", children: "Critical" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-2.5 px-3", children: "High" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-2.5 px-3", children: "Medium" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-2.5 px-3", children: "Total" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-2.5 px-3", children: "Status" }, void 0, false)] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("tbody", { className: "divide-y divide-[#23353F]", children:
              history.map((item) => /*#__PURE__*/
              _jsxDEV("tr", {

                onClick: () => setRepoUrl(item.repository_url),
                className: "hover:bg-[#182730] cursor-pointer transition-colors", children: [/*#__PURE__*/

                _jsxDEV("td", { className: "py-3 px-3 font-semibold text-white", children: [
                  item.owner, "/", item.repo] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-3 text-xs text-gray-400", children:
                  item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A' }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-3", children: /*#__PURE__*/
                  _jsxDEV("span", { className: "text-red-400 font-bold", children: item.critical_count }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-3", children: /*#__PURE__*/
                  _jsxDEV("span", { className: "text-amber-400 font-bold", children: item.high_count }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-3", children: /*#__PURE__*/
                  _jsxDEV("span", { className: "text-yellow-400 font-bold", children: item.medium_count }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-3 font-semibold text-gray-200", children:
                  item.total_findings }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-3", children: /*#__PURE__*/
                  _jsxDEV("span", { className: "text-xs px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40", children:
                    item.status }, void 0, false
                  ) }, void 0, false
                )] }, item.analysis_id, true
              )
              ) }, void 0, false
            )] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true

      )] }, void 0, true
    ));

}
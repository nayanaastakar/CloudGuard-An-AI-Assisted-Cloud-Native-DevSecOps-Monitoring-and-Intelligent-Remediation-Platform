import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CheckBadgeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon } from
'@heroicons/react/24/outline';
import cloudguardApi, { ComplianceCheck } from '../../services/cloudguardApi';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

export default function ComplianceView() {
  const [framework, setFramework] = useState('CIS-K8s-1.8');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCheck, setSelectedCheck] = useState(null);

  const { data: compliance, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['cloudguard-compliance', framework],
    queryFn: async () => {
      const res = await cloudguardApi.getCompliance(framework);
      return res.data;
    },
    staleTime: 60000
  });

  const checks = compliance?.checks || [];

  const filteredChecks = checks.filter((c) => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return /*#__PURE__*/_jsxDEV(CheckCircleIcon, { className: "w-5 h-5 text-blue-400" }, void 0, false);
      case 'fail':
        return /*#__PURE__*/_jsxDEV(XCircleIcon, { className: "w-5 h-5 text-red-400" }, void 0, false);
      case 'warn':
        return /*#__PURE__*/_jsxDEV(ExclamationTriangleIcon, { className: "w-5 h-5 text-amber-400" }, void 0, false);
      default:
        return /*#__PURE__*/_jsxDEV(CheckBadgeIcon, { className: "w-5 h-5 text-gray-400" }, void 0, false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pass':
        return /*#__PURE__*/_jsxDEV("span", { className: "px-2 py-0.5 text-xs font-semibold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30", children: "PASS" }, void 0, false);
      case 'fail':
        return /*#__PURE__*/_jsxDEV("span", { className: "px-2 py-0.5 text-xs font-semibold rounded bg-red-500/20 text-red-400 border border-red-500/30", children: "FAIL" }, void 0, false);
      case 'warn':
        return /*#__PURE__*/_jsxDEV("span", { className: "px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30", children: "WARN" }, void 0, false);
      default:
        return /*#__PURE__*/_jsxDEV("span", { className: "px-2 py-0.5 text-xs font-semibold rounded bg-gray-500/20 text-gray-400", children: "INFO" }, void 0, false);
    }
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "p-6 max-w-7xl mx-auto space-y-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(BuildingLibraryIcon, { className: "w-7 h-7 text-blue-400" }, void 0, false), "Continuous Compliance Engine"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-400 mt-1", children: "Automated cluster auditing against regulatory security standards and industry benchmarks." }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2", children: /*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => refetch(),
            disabled: isLoading || isFetching,
            className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-gray-200 border border-slate-700 text-sm transition", children: [/*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `w-4 h-4 ${isFetching ? 'animate-spin' : ''}` }, void 0, false), "Run Audit"] }, void 0, true

          ) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex border-b border-gray-800 gap-2", children: [/*#__PURE__*/
        _jsxDEV("button", {
          onClick: () => {setFramework('CIS-K8s-1.8');setSelectedCheck(null);},
          className: `px-4 py-2 text-sm font-medium border-b-2 transition ${
          framework === 'CIS-K8s-1.8' ?
          'border-indigo-500 text-blue-400 font-semibold' :
          'border-transparent text-gray-400 hover:text-gray-200'}`, children:

          "CIS Kubernetes Benchmark v1.8" }, void 0, false

        ), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: () => {setFramework('NIST-SP-800-190');setSelectedCheck(null);},
          className: `px-4 py-2 text-sm font-medium border-b-2 transition ${
          framework === 'NIST-SP-800-190' ?
          'border-indigo-500 text-blue-400 font-semibold' :
          'border-transparent text-gray-400 hover:text-gray-200'}`, children:

          "NIST SP 800-190 Container Security" }, void 0, false

        ), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: () => {setFramework('PCI-DSS-4.0');setSelectedCheck(null);},
          className: `px-4 py-2 text-sm font-medium border-b-2 transition ${
          framework === 'PCI-DSS-4.0' ?
          'border-indigo-500 text-blue-400 font-semibold' :
          'border-transparent text-gray-400 hover:text-gray-200'}`, children:

          "PCI-DSS v4.0 Requirement 6 & 7" }, void 0, false

        )] }, void 0, true
      ),


      compliance && /*#__PURE__*/
      _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "p-5 rounded-xl bg-slate-950 border border-gray-800 flex items-center justify-between", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-400 font-medium", children: "Compliance Score" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-3xl font-extrabold text-white mt-1", children: [
              compliance.compliance_percentage, "%"] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500 mt-1", children: ["Total ", compliance.total_checks, " controls evaluated"] }, void 0, true)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "w-16 h-16 rounded-full border-4 border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-lg", children: [
            compliance.compliance_percentage, "%"] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "p-5 rounded-xl bg-emerald-950/20 border border-emerald-900/30", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-blue-400 font-medium flex items-center gap-1", children: [/*#__PURE__*/
            _jsxDEV(CheckCircleIcon, { className: "w-4 h-4" }, void 0, false), " Passed Checks"] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-3xl font-bold text-blue-400 mt-1", children: compliance.passed }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-emerald-500/70 mt-1", children: "Passing standard controls" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "p-5 rounded-xl bg-red-950/20 border border-red-900/30", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-red-400 font-medium flex items-center gap-1", children: [/*#__PURE__*/
            _jsxDEV(XCircleIcon, { className: "w-4 h-4" }, void 0, false), " Failed Controls"] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-3xl font-bold text-red-400 mt-1", children: compliance.failed }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-red-500/70 mt-1", children: "Violations requiring remediation" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "p-5 rounded-xl bg-amber-950/20 border border-amber-900/30", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-amber-400 font-medium flex items-center gap-1", children: [/*#__PURE__*/
            _jsxDEV(ExclamationTriangleIcon, { className: "w-4 h-4" }, void 0, false), " Warnings"] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-3xl font-bold text-amber-400 mt-1", children: compliance.warnings }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-amber-500/70 mt-1", children: "Advisory recommendations" }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/



      _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "lg:col-span-2 space-y-4", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-gray-800", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-xs text-gray-400 font-medium", children: "Filter by Status:" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "flex gap-2", children:
              ['all', 'fail', 'warn', 'pass'].map((st) => /*#__PURE__*/
              _jsxDEV("button", {

                onClick: () => setStatusFilter(st),
                className: `px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                statusFilter === st ?
                'bg-indigo-600 text-white' :
                'bg-slate-900 text-gray-400 hover:text-gray-200'}`, children:


                st }, st, false
              )
              ) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "space-y-3", children:
            isLoading ? /*#__PURE__*/
            _jsxDEV("div", { className: "p-8 text-center text-gray-400 bg-slate-950 rounded-xl border border-gray-800", children: [/*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: "w-6 h-6 animate-spin mx-auto text-blue-400 mb-2" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { children: ["Auditing cluster against ", framework, "..."] }, void 0, true)] }, void 0, true
            ) :
            filteredChecks.length === 0 ? /*#__PURE__*/
            _jsxDEV("div", { className: "p-8 text-center text-gray-400 bg-slate-950 rounded-xl border border-gray-800", children: [/*#__PURE__*/
              _jsxDEV(ShieldCheckIcon, { className: "w-8 h-8 text-blue-400 mx-auto mb-2" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { children: "No checks match this filter" }, void 0, false)] }, void 0, true
            ) :

            filteredChecks.map((check) => /*#__PURE__*/
            _jsxDEV("div", {

              onClick: () => setSelectedCheck(check),
              className: `p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
              selectedCheck?.check_id === check.check_id ?
              'bg-indigo-950/30 border-indigo-500' :
              'bg-slate-950 border-gray-800 hover:border-slate-600'}`, children: [/*#__PURE__*/


              _jsxDEV("div", { className: "flex items-start gap-3", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "mt-0.5", children: getStatusIcon(check.status) }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "font-mono text-xs text-blue-400 font-bold", children: check.check_id }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-xs text-gray-500", children: ["[", check.category, "]"] }, void 0, true)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("h4", { className: "text-sm font-semibold text-white mt-0.5", children: check.title }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-400 mt-1 line-clamp-1", children: check.evidence }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-3", children: [
                getStatusBadge(check.status), /*#__PURE__*/
                _jsxDEV(ChevronRightIcon, { className: "w-4 h-4 text-gray-500" }, void 0, false)] }, void 0, true
              )] }, check.check_id, true
            )
            ) }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "bg-slate-950 p-5 rounded-xl border border-gray-800 h-fit sticky top-6", children:
          selectedCheck ? /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "font-mono text-xs text-blue-400 font-bold", children: selectedCheck.check_id }, void 0, false),
              getStatusBadge(selectedCheck.status)] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "text-base font-bold text-white", children: selectedCheck.title }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-400 mt-1", children: ["Category: ", selectedCheck.category] }, void 0, true)] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h4", { className: "text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1", children: "Audit Evidence" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "bg-gray-950 p-3 rounded-lg border border-gray-800 text-xs font-mono text-gray-300 whitespace-pre-wrap", children:
                selectedCheck.evidence }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h4", { className: "text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1", children: "Remediation Guidance" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("div", { className: "bg-indigo-950/20 p-3 rounded-lg border border-indigo-900/30 text-xs text-indigo-200 whitespace-pre-wrap", children:
                selectedCheck.remediation }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ) : /*#__PURE__*/

          _jsxDEV("div", { className: "text-center py-12 text-gray-500", children: [/*#__PURE__*/
            _jsxDEV(DocumentTextIcon, { className: "w-10 h-10 mx-auto text-gray-600 mb-2" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm", children: "Select any compliance control on the left to inspect audit evidence and remediation guidance." }, void 0, false)] }, void 0, true
          ) }, void 0, false

        )] }, void 0, true
      )] }, void 0, true
    ));

}
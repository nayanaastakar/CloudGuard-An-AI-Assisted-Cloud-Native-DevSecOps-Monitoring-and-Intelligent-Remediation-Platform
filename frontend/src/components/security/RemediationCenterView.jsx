import { useState, useEffect } from 'react';
import {
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  DocumentTextIcon,
  ArrowUturnLeftIcon } from
'@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";









































export default function RemediationCenterView() {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const params = new URLSearchParams();
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);

      const res = await fetch(`/api/v1/cloudguard/remediations/lifecycle-plans?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
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

  // Real-time event listener to refresh on remediation_update events
  useEffect(() => {
    const handleRemediationUpdateEvent = () => {
      fetchPlans();
    };

    window.addEventListener('cloudguard:remediation_update', handleRemediationUpdateEvent);
    return () => {
      window.removeEventListener('cloudguard:remediation_update', handleRemediationUpdateEvent);
    };
  }, [selectedStatus]);

  const handleApprove = async (planId) => {
    setIsProcessing(true);
    setActionMessage(null);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const res = await fetch(`/api/v1/cloudguard/remediations/lifecycle-plans/${planId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ comment: 'Approved via Remediation Center' })
      });

      if (res.ok) {
        setActionMessage(`Plan ${planId} approved successfully.`);
        fetchPlans();
      } else {
        const err = await res.json();
        setActionMessage(`Approval failed: ${err.detail || 'Policy violation'}`);
      }
    } catch (e) {
      setActionMessage(`Error: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecute = async (planId) => {
    setIsProcessing(true);
    setActionMessage(null);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const res = await fetch(`/api/v1/cloudguard/remediations/lifecycle-plans/${planId}/execute`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        setActionMessage(`Plan ${planId} executed and post-change verified.`);
        fetchPlans();
      } else {
        const err = await res.json();
        setActionMessage(`Execution failed: ${err.detail}`);
      }
    } catch (e) {
      setActionMessage(`Error: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRollback = async (planId) => {
    setIsProcessing(true);
    setActionMessage(null);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const res = await fetch(`/api/v1/cloudguard/remediations/lifecycle-plans/${planId}/rollback`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        setActionMessage(`Plan ${planId} safely rolled back to pre-change snapshot.`);
        fetchPlans();
      } else {
        const err = await res.json();
        setActionMessage(`Rollback failed: ${err.detail}`);
      }
    } catch (e) {
      setActionMessage(`Error: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedPlan = plans.find((p) => p.remediation_id === selectedPlanId) || plans[0];

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      case 'approved':
        return 'bg-blue-500/10 text-violet-400 border border-blue-500/30';
      case 'pending_approval':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'rolled_back':
        return 'bg-violet-500/10 text-violet-400 border border-violet-500/30';
      default:
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
    }
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV(PageHeader, {
        title: "Remediation Center & Controlled Automation",
        subtitle: "End-to-end remediation lifecycle: Plan -> Dry-Run Validation -> 4-Eyes Approval -> Controlled Execution -> Verification -> Rollback.", children: /*#__PURE__*/

        _jsxDEV("button", {
          onClick: fetchPlans,
          className: "flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-gray-200 hover:bg-slate-800 border border-slate-700 transition-colors", children: [/*#__PURE__*/

          _jsxDEV(ArrowPathIcon, { className: `w-4 h-4 ${isLoading ? 'animate-spin' : ''}` }, void 0, false), "Refresh Plans"] }, void 0, true

        ) }, void 0, false
      ),

      actionMessage && /*#__PURE__*/
      _jsxDEV("div", { className: "p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl text-xs text-violet-300 flex items-center gap-2", children: [/*#__PURE__*/
        _jsxDEV(CheckBadgeIcon, { className: "w-4 h-4 text-violet-400" }, void 0, false), /*#__PURE__*/
        _jsxDEV("span", { children: actionMessage }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/



      _jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children:
        [
        {
          label: 'Pending Approval / Validation',
          count: plans.filter((p) => p.status === 'pending_approval' || p.status === 'pending_validation').length,
          color: 'text-amber-400'
        },
        {
          label: 'Approved (Ready to Apply)',
          count: plans.filter((p) => p.status === 'approved').length,
          color: 'text-violet-400'
        },
        {
          label: 'Completed & Verified',
          count: plans.filter((p) => p.status === 'completed').length,
          color: 'text-blue-400'
        },
        {
          label: 'Rolled Back',
          count: plans.filter((p) => p.status === 'rolled_back').length,
          color: 'text-violet-400'
        }].
        map((kpi, idx) => /*#__PURE__*/
        _jsxDEV("div", { className: "p-4 bg-slate-950/60 border border-gray-800 rounded-xl", children: [/*#__PURE__*/
          _jsxDEV("span", { className: "text-xs text-gray-400 font-medium", children: kpi.label }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: `text-2xl font-bold mt-1 ${kpi.color}`, children: kpi.count }, void 0, false)] }, idx, true
        )
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex items-center gap-2 bg-slate-950/60 p-3 rounded-xl border border-gray-800", children: [/*#__PURE__*/
        _jsxDEV("span", { className: "text-xs text-gray-400", children: "Filter Status:" }, void 0, false),
        ['ALL', 'pending_approval', 'approved', 'completed', 'rolled_back'].map((s) => /*#__PURE__*/
        _jsxDEV("button", {

          onClick: () => setSelectedStatus(s),
          className: `px-2.5 py-1 text-xs rounded-md font-medium uppercase transition-colors ${
          selectedStatus === s ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-gray-400 hover:text-gray-200'}`, children:


          s.replace('_', ' ') }, s, false
        )
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "bg-slate-950/60 border border-gray-800 rounded-xl p-4 space-y-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "text-xs font-semibold text-gray-400 pb-2 border-b border-gray-800 flex justify-between", children: [/*#__PURE__*/
            _jsxDEV("span", { children: ["REMEDIATION QUEUE (", plans.length, ")"] }, void 0, true), /*#__PURE__*/
            _jsxDEV("span", { className: "text-[10px] text-gray-500 font-mono", children: "Four-Eyes Active" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "space-y-2.5 max-h-[620px] overflow-y-auto pr-1", children:
            plans.map((p) => {
              const isSelected = selectedPlan?.remediation_id === p.remediation_id;
              return (/*#__PURE__*/
                _jsxDEV("div", {

                  onClick: () => setSelectedPlanId(p.remediation_id),
                  className: `p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected ?
                  'border-emerald-500 bg-emerald-950/20 shadow-md shadow-emerald-500/10' :
                  'border-gray-800 bg-gray-950/40 hover:border-slate-600 hover:bg-slate-900/30'}`, children: [/*#__PURE__*/


                  _jsxDEV("div", { className: "flex items-center justify-between gap-2", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadge(p.status)}`, children:
                      p.status }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-[10px] text-gray-500 font-mono", children: p.remediation_id }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "font-semibold text-xs text-gray-200 mt-2 line-clamp-2", children: p.title }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center justify-between text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-800/60", children: [/*#__PURE__*/
                    _jsxDEV("span", { children: p.target_resource }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { children: ["Risk: ", p.risk_level] }, void 0, true)] }, void 0, true
                  )] }, p.remediation_id, true
                ));

            }) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "lg:col-span-2 bg-slate-950/60 border border-gray-800 rounded-xl p-6 space-y-6", children:
          selectedPlan ? /*#__PURE__*/
          _jsxDEV(_Fragment, { children: [/*#__PURE__*/

            _jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: `px-2 py-0.5 rounded text-xs font-bold uppercase ${getStatusBadge(selectedPlan.status)}`, children:
                    selectedPlan.status }, void 0, false
                  ),
                  selectedPlan.is_sensitive && /*#__PURE__*/
                  _jsxDEV("span", { className: "px-2 py-0.5 rounded text-xs font-bold uppercase bg-violet-500/10 text-violet-400 border border-violet-500/30", children: "Four-Eyes Required" }, void 0, false

                  ),

                  selectedPlan.provenance === 'demo' && /*#__PURE__*/
                  _jsxDEV("span", { className: "px-2 py-0.5 rounded text-xs font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30", children: "Sample Plan" }, void 0, false

                  )] }, void 0, true

                ), /*#__PURE__*/
                _jsxDEV("h2", { className: "text-lg font-bold text-gray-100 mt-2", children: selectedPlan.title }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-400 mt-0.5", children: ["Target: ", selectedPlan.target_resource, " | Namespace: ", selectedPlan.namespace] }, void 0, true)] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "flex items-center gap-2", children: [
                selectedPlan.status === 'pending_approval' && /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => handleApprove(selectedPlan.remediation_id),
                  disabled: isProcessing,
                  className: "px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-600/20", children: [/*#__PURE__*/

                  _jsxDEV(CheckCircleIcon, { className: "w-4 h-4" }, void 0, false), "Approve Plan"] }, void 0, true

                ),


                selectedPlan.status === 'approved' && /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => handleExecute(selectedPlan.remediation_id),
                  disabled: isProcessing,
                  className: "px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20", children: [/*#__PURE__*/

                  _jsxDEV(WrenchScrewdriverIcon, { className: "w-4 h-4" }, void 0, false), "Execute Change"] }, void 0, true

                ),


                selectedPlan.status === 'completed' && selectedPlan.rollback_supported && !selectedPlan.rollback_executed && /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => handleRollback(selectedPlan.remediation_id),
                  disabled: isProcessing,
                  className: "px-3.5 py-1.5 rounded-lg bg-purple-600/20 text-violet-300 hover:bg-purple-600/30 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5", children: [/*#__PURE__*/

                  _jsxDEV(ArrowUturnLeftIcon, { className: "w-4 h-4" }, void 0, false), "Rollback to Snapshot"] }, void 0, true

                )] }, void 0, true

              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "p-3 bg-gray-950 border border-gray-800 rounded-xl space-y-1 text-xs", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "font-semibold text-gray-300 flex items-center gap-1.5", children: [/*#__PURE__*/
                  _jsxDEV(CheckBadgeIcon, { className: "w-4 h-4 text-blue-400" }, void 0, false), "Admission Dry-Run Status:"] }, void 0, true

                ), /*#__PURE__*/
                _jsxDEV("span", { className: "font-mono text-blue-400", children:
                  selectedPlan.dry_run_verified ? 'VALIDATED' : 'WARNING' }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "text-gray-400 font-mono text-[11px]", children: selectedPlan.dry_run_output }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
              _jsxDEV("label", { className: "text-xs font-semibold text-gray-300 flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV(DocumentTextIcon, { className: "w-4 h-4 text-violet-400" }, void 0, false), "Proposed Manifest Diff (Unified Side-by-Side Patch):"] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV("div", { className: "p-3 bg-gray-950 border border-gray-800 rounded-xl overflow-x-auto font-mono text-xs max-h-56", children:
                selectedPlan.diff_patch.split('\n').map((line, idx) => {
                  let color = 'text-gray-300';
                  if (line.startsWith('+')) color = 'text-blue-400 bg-emerald-950/20';
                  if (line.startsWith('-')) color = 'text-rose-400 bg-rose-950/20';
                  if (line.startsWith('@@')) color = 'text-violet-400';
                  return (/*#__PURE__*/
                    _jsxDEV("div", { className: color, children:
                      line }, idx, false
                    ));

                }) }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-xs font-semibold text-gray-300 block", children: "Immutable Audit Ledger & Sign-off History:" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("div", { className: "divide-y divide-gray-800 bg-gray-950 border border-gray-800 rounded-xl p-3 max-h-48 overflow-y-auto", children:
                selectedPlan.audit_trail?.map((entry, idx) => /*#__PURE__*/
                _jsxDEV("div", { className: "py-2 flex items-start justify-between text-xs gap-3", children: [/*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "font-bold text-gray-200 uppercase text-[10px] bg-slate-900 px-1.5 py-0.5 rounded", children:
                        entry.action }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-gray-400", children: ["by ", entry.performed_by] }, void 0, true)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "text-[11px] text-gray-400 mt-1", children: entry.details }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-[10px] text-gray-500 whitespace-nowrap", children:
                    new Date(entry.timestamp).toLocaleTimeString() }, void 0, false
                  )] }, idx, true
                )
                ) }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ) : /*#__PURE__*/

          _jsxDEV("div", { className: "py-24 text-center text-gray-500 text-xs", children: "Select a remediation plan to inspect diff and execute approval actions." }, void 0, false

          ) }, void 0, false

        )] }, void 0, true
      )] }, void 0, true
    ));

}
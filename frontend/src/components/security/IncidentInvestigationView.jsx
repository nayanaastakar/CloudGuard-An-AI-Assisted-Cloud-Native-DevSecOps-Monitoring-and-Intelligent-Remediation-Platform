import { useState, useEffect } from 'react';
import {
  SparklesIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  DocumentMagnifyingGlassIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  LockClosedIcon } from
'@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';
import ProvenanceBadge from '../common/ProvenanceBadge';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";














































export default function IncidentInvestigationView() {
  const [investigations, setInvestigations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  // New Investigation form state
  const [newTargetType, setNewTargetType] = useState('workload');
  const [newTargetId, setNewTargetId] = useState('payment-api');
  const [userNotes, setUserNotes] = useState('');

  const fetchInvestigations = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const res = await fetch('/api/v1/cloudguard/investigations', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setInvestigations(data || []);
        if (data.length > 0 && !selectedId) {
          setSelectedId(data[0].investigation_id);
        }
      }
    } catch (err) {
      console.error('Failed to load investigations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestigations();
  }, []);

  const handleCreateInvestigation = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const res = await fetch('/api/v1/cloudguard/investigations/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          target_type: newTargetType,
          target_id: newTargetId,
          user_notes: userNotes
        })
      });

      if (res.ok) {
        const created = await res.json();
        setInvestigations((prev) => [created, ...prev]);
        setSelectedId(created.investigation_id);
        setShowNewModal(false);
        setUserNotes('');
      }
    } catch (err) {
      console.error('Failed to run AI investigation:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectedInv = investigations.find((i) => i.investigation_id === selectedId) || investigations[0];

  const getSeverityBadgeClass = (sev) => {
    switch (sev?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-400 border border-red-500/30';
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      default:
        return 'bg-blue-500/10 text-violet-400 border border-blue-500/30';
    }
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV(PageHeader, {
        title: "AI-Assisted Incident Investigation",
        subtitle: "Secure, evidence-driven AI security analyst correlating cluster signals, CVEs, and runtime threats.", children: /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => setShowNewModal(true),
            className: "flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/20", children: [/*#__PURE__*/

            _jsxDEV(PlusIcon, { className: "w-4 h-4" }, void 0, false), "New AI Investigation"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: fetchInvestigations,
            className: "flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-gray-200 hover:bg-slate-800 border border-slate-700 transition-colors", children: [/*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `w-4 h-4 ${isLoading ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "p-3 bg-purple-950/20 border border-violet-500/30 rounded-xl flex items-center justify-between text-xs text-violet-300", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV(LockClosedIcon, { className: "w-4 h-4 text-violet-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { children: [/*#__PURE__*/
            _jsxDEV("strong", { children: "AI Safety Boundary Active:" }, void 0, false), " Gemini operates in read-only analyst mode. Automated shell commands or destructive changes are strictly prohibited."] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("span", { className: "font-mono text-[11px] bg-purple-900/40 px-2 py-0.5 rounded border border-violet-500/30", children: "Analyst Mode" }, void 0, false

        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "bg-slate-950/60 border border-gray-800 rounded-xl p-4 space-y-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "text-xs font-semibold text-gray-400 pb-2 border-b border-gray-800 flex justify-between items-center", children: [/*#__PURE__*/
            _jsxDEV("span", { children: ["INVESTIGATION DOSSIERS (", investigations.length, ")"] }, void 0, true), /*#__PURE__*/
            _jsxDEV("span", { className: "text-[10px] text-gray-500 font-mono", children: "Evidence-Backed" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "space-y-2.5 max-h-[620px] overflow-y-auto pr-1", children:
            investigations.map((inv) => {
              const isSelected = selectedInv?.investigation_id === inv.investigation_id;
              const sev = inv.report?.severity_assessment || 'HIGH';
              return (/*#__PURE__*/
                _jsxDEV("div", {

                  onClick: () => setSelectedId(inv.investigation_id),
                  className: `p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected ?
                  'border-purple-500 bg-purple-950/20 shadow-md shadow-purple-500/10' :
                  'border-gray-800 bg-gray-950/40 hover:border-slate-600 hover:bg-slate-900/30'}`, children: [/*#__PURE__*/


                  _jsxDEV("div", { className: "flex items-center justify-between gap-2", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getSeverityBadgeClass(sev)}`, children:
                      sev }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-[10px] text-gray-500 font-mono", children: inv.investigation_id }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "font-semibold text-xs text-gray-200 mt-2 line-clamp-2", children:
                    inv.report?.title || `${inv.target_type}: ${inv.target_id}` }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center justify-between text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-800/60", children: [/*#__PURE__*/
                    _jsxDEV("span", { children: [inv.evidence_bundle?.total_items || 0, " evidence items"] }, void 0, true), /*#__PURE__*/
                    _jsxDEV("span", { children: new Date(inv.created_at).toLocaleTimeString() }, void 0, false)] }, void 0, true
                  )] }, inv.investigation_id, true
                ));

            }) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "lg:col-span-2 bg-slate-950/60 border border-gray-800 rounded-xl p-6 space-y-6", children:
          selectedInv && selectedInv.report ? /*#__PURE__*/
          _jsxDEV(_Fragment, { children: [/*#__PURE__*/

            _jsxDEV("div", { className: "space-y-2 pb-4 border-b border-gray-800", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                _jsxDEV("span", { className: `px-2.5 py-0.5 rounded text-xs font-bold uppercase ${getSeverityBadgeClass(selectedInv.report.severity_assessment)}`, children: [
                  selectedInv.report.severity_assessment, " Severity Assessment"] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("span", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(ProvenanceBadge, { state: selectedInv.provenance || 'demo' }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-xs text-violet-400 font-medium", children: ["Confidence: ",
                    (selectedInv.report.confidence * 100).toFixed(0), "%"] }, void 0, true
                  )] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("h2", { className: "text-lg font-bold text-gray-100", children: selectedInv.report.title }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-300 leading-relaxed bg-black/30 p-3 rounded-lg border border-gray-800", children:
                selectedInv.report.incident_summary }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-4 bg-emerald-950/10 border border-blue-500/20 rounded-xl space-y-2", children: [/*#__PURE__*/
                _jsxDEV("h4", { className: "text-xs font-bold text-blue-400 flex items-center gap-1.5", children: [/*#__PURE__*/
                  _jsxDEV(CheckCircleIcon, { className: "w-4 h-4" }, void 0, false), "Confirmed Facts (",
                  selectedInv.report.confirmed_facts?.length || 0, ")"] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("ul", { className: "text-xs text-gray-300 space-y-1.5 list-disc list-inside", children:
                  selectedInv.report.confirmed_facts?.map((fact, idx) => /*#__PURE__*/
                  _jsxDEV("li", { className: "leading-relaxed", children: fact }, idx, false)
                  ) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("div", { className: "p-4 bg-amber-950/10 border border-amber-500/20 rounded-xl space-y-2", children: [/*#__PURE__*/
                _jsxDEV("h4", { className: "text-xs font-bold text-amber-400 flex items-center gap-1.5", children: [/*#__PURE__*/
                  _jsxDEV(SparklesIcon, { className: "w-4 h-4" }, void 0, false), "AI Working Hypotheses (",
                  selectedInv.report.hypotheses?.length || 0, ")"] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("ul", { className: "text-xs text-gray-300 space-y-1.5 list-disc list-inside", children:
                  selectedInv.report.hypotheses?.map((hyp, idx) => /*#__PURE__*/
                  _jsxDEV("li", { className: "leading-relaxed", children: hyp }, idx, false)
                  ) }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between text-xs font-semibold text-gray-300", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "flex items-center gap-1.5", children: [/*#__PURE__*/
                  _jsxDEV(DocumentMagnifyingGlassIcon, { className: "w-4 h-4 text-violet-400" }, void 0, false), "Curated Evidence Bundle (",
                  selectedInv.evidence_bundle?.total_items || 0, " Records)"] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 font-mono text-[11px]", children: selectedInv.evidence_bundle?.bundle_id }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("div", { className: "space-y-2 max-h-48 overflow-y-auto pr-1", children:
                selectedInv.evidence_bundle?.items?.map((item) => /*#__PURE__*/
                _jsxDEV("div", { className: "p-2.5 bg-gray-950 border border-gray-800 rounded-lg text-xs space-y-1", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "font-mono text-violet-400 font-semibold", children: item.evidence_id }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "flex items-center gap-1", children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "text-[10px] text-gray-400 uppercase font-bold", children: item.source }, void 0, false), /*#__PURE__*/
                      _jsxDEV(ProvenanceBadge, { state: item.provenance }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "text-gray-300 text-[11px]", children: ["Asset: ", /*#__PURE__*/_jsxDEV("strong", { children: item.asset_reference }, void 0, false)] }, void 0, true), /*#__PURE__*/
                  _jsxDEV("pre", { className: "text-[10px] text-gray-500 font-mono truncate", children: JSON.stringify(item.details) }, void 0, false)] }, item.evidence_id, true
                )
                ) }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "p-4 bg-gray-950 border border-gray-800 rounded-xl space-y-3", children: [/*#__PURE__*/
              _jsxDEV("h4", { className: "text-xs font-bold text-gray-200 flex items-center gap-1.5", children: [/*#__PURE__*/
                _jsxDEV(WrenchScrewdriverIcon, { className: "w-4 h-4 text-violet-400" }, void 0, false), "Recommended Corrective & Investigation Steps (Requires Human Approval)"] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-xs", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-gray-400 block mb-1 font-semibold", children: "Remediation Steps:" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("ul", { className: "space-y-1 list-disc list-inside text-gray-300", children:
                    selectedInv.report.recommended_remediation?.map((rem, idx) => /*#__PURE__*/
                    _jsxDEV("li", { children: rem }, idx, false)
                    ) }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-gray-400 block mb-1 font-semibold", children: "Investigation Actions:" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("ul", { className: "space-y-1 list-disc list-inside text-gray-300", children:
                    selectedInv.report.recommended_investigation_steps?.map((step, idx) => /*#__PURE__*/
                    _jsxDEV("li", { children: step }, idx, false)
                    ) }, void 0, false
                  )] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ) : /*#__PURE__*/

          _jsxDEV("div", { className: "py-24 text-center text-gray-500 text-xs", children: "Select an investigation dossier to view evidence and structured AI report." }, void 0, false

          ) }, void 0, false

        )] }, void 0, true
      ),


      showNewModal && /*#__PURE__*/
      _jsxDEV("div", { className: "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4", children: /*#__PURE__*/
        _jsxDEV("div", { className: "bg-slate-950 border border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl", children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-base font-bold text-white flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(SparklesIcon, { className: "w-5 h-5 text-violet-400" }, void 0, false), "Launch New AI Investigation"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-gray-400", children: "Correlates telemetry across security graph, Trivy SBOM, and Falco runtime webhooks." }, void 0, false

          ), /*#__PURE__*/

          _jsxDEV("form", { onSubmit: handleCreateInvestigation, className: "space-y-4 text-xs", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "block text-gray-300 font-semibold mb-1", children: "Target Entity Type:" }, void 0, false), /*#__PURE__*/
              _jsxDEV("select", {
                value: newTargetType,
                onChange: (e) => setNewTargetType(e.target.value),
                className: "w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-purple-500", children: [/*#__PURE__*/

                _jsxDEV("option", { value: "workload", children: "Workload / Deployment" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "threat", children: "Runtime Threat Event" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "vulnerability", children: "Vulnerability / CVE" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "attack_path", children: "Attack Path" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "block text-gray-300 font-semibold mb-1", children: "Target Identifier / Resource:" }, void 0, false), /*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                value: newTargetId,
                onChange: (e) => setNewTargetId(e.target.value),
                placeholder: "e.g. payment-api or CVE-2024-21626",
                required: true,
                className: "w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-purple-500" }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "block text-gray-300 font-semibold mb-1", children: "Investigation Notes (Optional):" }, void 0, false), /*#__PURE__*/
              _jsxDEV("textarea", {
                value: userNotes,
                onChange: (e) => setUserNotes(e.target.value),
                rows: 3,
                placeholder: "Provide operator context or anomaly details...",
                className: "w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-purple-500" }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("div", { className: "flex items-center justify-end gap-3 pt-2", children: [/*#__PURE__*/
              _jsxDEV("button", {
                type: "button",
                onClick: () => setShowNewModal(false),
                className: "px-3 py-1.5 rounded-lg border border-slate-700 text-gray-300 hover:bg-slate-900", children:
                "Cancel" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("button", {
                type: "submit",
                disabled: isAnalyzing,
                className: "px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-2", children: [

                isAnalyzing && /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "w-4 h-4 animate-spin" }, void 0, false),
                isAnalyzing ? 'Analyzing with AI...' : 'Synthesize Dossier'] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true

    ));

}
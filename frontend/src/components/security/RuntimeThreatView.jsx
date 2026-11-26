import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  FireIcon,
  CheckBadgeIcon } from
'@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';
import ProvenanceBadge from '../common/ProvenanceBadge';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";






















export default function RuntimeThreatView() {
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState({
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
    INFO: 0
  });
  const [overallProvenance, setOverallProvenance] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState(null);

  const fetchThreats = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const params = new URLSearchParams();
      if (selectedSeverity !== 'ALL') params.append('severity', selectedSeverity);
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`/api/v1/cloudguard/runtime/events?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
        setSummary(data.summary || {});
        setOverallProvenance(data.provenance);
      }
    } catch (err) {
      console.error('Failed to load runtime threats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats();
  }, [selectedSeverity]);

  // Real-time event listener to refresh on runtime_threat events
  useEffect(() => {
    const handleRuntimeThreatEvent = () => {
      fetchThreats();
    };

    window.addEventListener('cloudguard:runtime_threat', handleRuntimeThreatEvent);
    return () => {
      window.removeEventListener('cloudguard:runtime_threat', handleRuntimeThreatEvent);
    };
  }, [selectedSeverity, searchTerm]);

  const handleSimulateWebhook = async () => {
    setIsSimulating(true);
    setSimulationStatus(null);
    try {
      const mockPayload = {
        rule: 'Terminal shell in container',
        priority: 'Critical',
        output: `Spawning interactive zsh process inside container cart-service-${Math.floor(Math.random() * 1000)}`,
        output_fields: {
          'k8s.pod.name': `cart-service-${Math.floor(Math.random() * 1000)}`,
          'container.name': 'cart-service',
          'k8s.ns.name': 'production',
          'proc.name': 'zsh'
        },
        tags: ['mitre_execution', 'live_webhook_sim']
      };

      const res = await fetch('/api/v1/cloudguard/runtime/falco/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockPayload)
      });

      if (res.ok) {
        const data = await res.json();
        setSimulationStatus(`Falco Webhook Processed: ${data.status} (ID: ${data.event_id || data.fingerprint})`);
        fetchThreats();
      } else {
        setSimulationStatus('Simulation failed to deliver to webhook endpoint.');
      }
    } catch (err) {
      setSimulationStatus(`Error sending webhook: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const getSeverityBadgeClass = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-400 border border-red-500/30';
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      case 'LOW':
        return 'bg-blue-500/10 text-violet-400 border border-blue-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/30';
    }
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV(PageHeader, {
        title: "Runtime Threat Detection",
        subtitle: "Live Falco and Falcosidekick runtime anomaly ingestion, deduplication, and MITRE ATT&CK correlation.", children: /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-3", children: [
          overallProvenance && /*#__PURE__*/_jsxDEV(ProvenanceBadge, { provenance: overallProvenance }, void 0, false), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: handleSimulateWebhook,
            disabled: isSimulating,
            className: "flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/40 transition-colors", children: [/*#__PURE__*/

            _jsxDEV(FireIcon, { className: "w-4 h-4" }, void 0, false),
            isSimulating ? 'Sending Webhook...' : 'Simulate Falco Alert'] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: fetchThreats,
            className: "flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-gray-200 hover:bg-slate-800 border border-slate-700 transition-colors", children: [/*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `w-4 h-4 ${isLoading ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

          )] }, void 0, true
        ) }, void 0, false
      ),

      simulationStatus && /*#__PURE__*/
      _jsxDEV("div", { className: "p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-xs text-violet-300 flex items-center gap-2", children: [/*#__PURE__*/
        _jsxDEV(CheckBadgeIcon, { className: "w-4 h-4 text-violet-400" }, void 0, false), /*#__PURE__*/
        _jsxDEV("span", { children: simulationStatus }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/



      _jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4", children:
        [
        { label: 'Critical Alerts', key: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
        { label: 'High Priority', key: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
        { label: 'Medium Anomaly', key: 'MEDIUM', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        { label: 'Low Severity', key: 'LOW', color: 'text-violet-400', bg: 'bg-blue-500/10 border-blue-500/20' },
        { label: 'Info Notices', key: 'INFO', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' }].
        map((item) => /*#__PURE__*/
        _jsxDEV("div", { className: `p-4 rounded-xl border ${item.bg} flex flex-col justify-between`, children: [/*#__PURE__*/
          _jsxDEV("span", { className: "text-xs font-medium text-gray-400", children: item.label }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: `text-2xl font-bold mt-1 ${item.color}`, children: summary[item.key] || 0 }, void 0, false)] }, item.key, true
        )
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-gray-800", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2 w-full md:w-auto", children: [/*#__PURE__*/
          _jsxDEV(FunnelIcon, { className: "w-4 h-4 text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "text-xs text-gray-400", children: "Severity:" }, void 0, false),
          ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => /*#__PURE__*/
          _jsxDEV("button", {

            onClick: () => setSelectedSeverity(sev),
            className: `px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
            selectedSeverity === sev ?
            'bg-blue-600 text-white' :
            'bg-slate-900 text-gray-400 hover:text-gray-200'}`, children:


            sev }, sev, false
          )
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "relative w-full md:w-72", children: [/*#__PURE__*/
          _jsxDEV(MagnifyingGlassIcon, { className: "w-4 h-4 text-gray-500 absolute left-3 top-2.5" }, void 0, false), /*#__PURE__*/
          _jsxDEV("input", {
            type: "text",
            placeholder: "Search rule, container, pod...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            onKeyDown: (e) => e.key === 'Enter' && fetchThreats(),
            className: "w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500" }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "bg-slate-950/60 border border-gray-800 rounded-xl overflow-hidden", children:
        events.length === 0 ? /*#__PURE__*/
        _jsxDEV("div", { className: "p-12 text-center text-gray-500 text-sm", children:
          isLoading ? 'Scanning for runtime threat alerts...' : 'No runtime threat events match the selected criteria.' }, void 0, false
        ) : /*#__PURE__*/

        _jsxDEV("div", { className: "divide-y divide-gray-800", children:
          events.map((evt) => /*#__PURE__*/
          _jsxDEV(motion.div, {

            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "p-4 hover:bg-slate-900/40 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center justify-between", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "space-y-1.5 max-w-2xl", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getSeverityBadgeClass(evt.severity)}`, children:
                  evt.severity }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("span", { className: "text-sm font-semibold text-gray-100", children: evt.rule }, void 0, false),
                evt.provenance && /*#__PURE__*/_jsxDEV(ProvenanceBadge, { provenance: evt.provenance }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-300 font-mono bg-black/30 p-2 rounded border border-gray-800/50", children:
                evt.output }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex flex-wrap items-center gap-3 text-[11px] text-gray-400", children: [
                evt.namespace && /*#__PURE__*/_jsxDEV("span", { children: ["Namespace: ", /*#__PURE__*/_jsxDEV("strong", { className: "text-gray-300", children: evt.namespace }, void 0, false)] }, void 0, true),
                evt.pod && /*#__PURE__*/_jsxDEV("span", { children: ["Pod: ", /*#__PURE__*/_jsxDEV("strong", { className: "text-gray-300", children: evt.pod }, void 0, false)] }, void 0, true),
                evt.container && /*#__PURE__*/_jsxDEV("span", { children: ["Container: ", /*#__PURE__*/_jsxDEV("strong", { className: "text-gray-300", children: evt.container }, void 0, false)] }, void 0, true),
                evt.mitre_attack && /*#__PURE__*/
                _jsxDEV("span", { className: "text-violet-400 font-medium bg-purple-900/20 px-2 py-0.5 rounded border border-purple-500/20", children:
                  evt.mitre_attack }, void 0, false
                )] }, void 0, true

              )] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("div", { className: "flex flex-col items-end text-right gap-1 min-w-[140px]", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-[11px] text-gray-500", children: new Date(evt.timestamp).toLocaleTimeString() }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-[10px] text-gray-600 font-mono", children: evt.id }, void 0, false)] }, void 0, true
            )] }, evt.id, true
          )
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}
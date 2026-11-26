import { useState, useEffect } from 'react';
import {
  CommandLineIcon,
  ArrowPathIcon } from
'@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';
import ProvenanceBadge from '../common/ProvenanceBadge';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";








export default function LogExplorerView() {
  const [query, setQuery] = useState('{app="payment-api"}');
  const [logs, setLogs] = useState([]);
  const [limit, setLimit] = useState(50);
  const [provenance, setProvenance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [servicesHealth, setServicesHealth] = useState({});

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const params = new URLSearchParams({
        query: query,
        limit: limit.toString()
      });

      const res = await fetch(`/api/v1/cloudguard/monitoring/logs?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setProvenance(data.provenance);
      }

      // Fetch monitoring status for health widgets
      const statusRes = await fetch('/api/v1/cloudguard/monitoring/status', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setServicesHealth(statusData.services || {});
      }
    } catch (err) {
      console.error('Failed to query Loki logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getLogLevelClass = (level) => {
    switch (level.toUpperCase()) {
      case 'ERROR':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'WARN':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'INFO':
        return 'text-violet-400 bg-blue-500/10 border-blue-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV(PageHeader, {
        title: "Log Aggregation & Loki Explorer",
        subtitle: "Explore centralized cluster and container stream logs via Grafana Loki with provenance tracking.", children: /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-3", children: [
          provenance && /*#__PURE__*/_jsxDEV(ProvenanceBadge, { provenance: provenance }, void 0, false), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: fetchLogs,
            className: "flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-gray-200 hover:bg-slate-800 border border-slate-700 transition-colors", children: [/*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `w-4 h-4 ${isLoading ? 'animate-spin' : ''}` }, void 0, false), "Run Query"] }, void 0, true

          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children:
        [
        { key: 'loki', title: 'Grafana Loki', role: 'Log Aggregator' },
        { key: 'prometheus', title: 'Prometheus', role: 'Metrics Engine' },
        { key: 'grafana', title: 'Grafana UI', role: 'Visualizer' },
        { key: 'opentelemetry', title: 'OpenTelemetry', role: 'OTLP Collector' }].
        map((svc) => {
          const detail = servicesHealth[svc.key] || {};
          const isLive = detail.provenance === 'live';
          return (/*#__PURE__*/
            _jsxDEV("div", { className: "p-3.5 bg-slate-950/60 border border-gray-800 rounded-xl flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("div", { className: "text-xs font-semibold text-gray-200", children: svc.title }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "text-[11px] text-gray-400", children: svc.role }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("span", {
                className: `px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                isLive ?
                'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`, children:


                detail.status || 'Active' }, void 0, false
              )] }, svc.key, true
            ));

        }) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "p-4 bg-slate-950/60 border border-gray-800 rounded-xl space-y-3", children: [/*#__PURE__*/
        _jsxDEV("label", { className: "text-xs font-semibold text-gray-300 flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV(CommandLineIcon, { className: "w-4 h-4 text-violet-400" }, void 0, false), "LogQL Query Expression:"] }, void 0, true

        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex gap-2", children: [/*#__PURE__*/
          _jsxDEV("input", {
            type: "text",
            value: query,
            onChange: (e) => setQuery(e.target.value),
            onKeyDown: (e) => e.key === 'Enter' && fetchLogs(),
            placeholder: "e.g. {app=\"payment-api\"} |= \"error\"",
            className: "flex-1 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500" }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("select", {
            value: limit,
            onChange: (e) => setLimit(Number(e.target.value)),
            className: "bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500", children: [/*#__PURE__*/

            _jsxDEV("option", { value: 25, children: "25 logs" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: 50, children: "50 logs" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: 100, children: "100 logs" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: fetchLogs,
            className: "px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors", children:
            "Execute" }, void 0, false

          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "bg-gray-950 border border-gray-800 rounded-xl overflow-hidden font-mono text-xs", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "bg-slate-950/80 px-4 py-2 border-b border-gray-800 flex items-center justify-between text-gray-400 text-[11px]", children: [/*#__PURE__*/
          _jsxDEV("span", { children: "STREAM / LOG OUTPUT" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { children: "TIMESTAMP (UTC)" }, void 0, false)] }, void 0, true
        ),
        logs.length === 0 ? /*#__PURE__*/
        _jsxDEV("div", { className: "p-10 text-center text-gray-500", children:
          isLoading ? 'Fetching Loki stream records...' : 'No logs returned for the current query.' }, void 0, false
        ) : /*#__PURE__*/

        _jsxDEV("div", { className: "divide-y divide-gray-900 max-h-[600px] overflow-y-auto", children:
          logs.map((log, idx) => /*#__PURE__*/
          _jsxDEV("div", { className: "p-3 hover:bg-slate-950/50 flex items-start justify-between gap-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "space-y-1", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV("span", { className: `px-1.5 py-0.5 rounded text-[9px] font-bold border ${getLogLevelClass(log.level)}`, children:
                  log.level }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-400 text-[11px] font-sans font-semibold", children: ["[", log.stream, "]"] }, void 0, true)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "text-gray-200", children: log.message }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "text-[10px] text-gray-500 whitespace-nowrap", children:
              new Date(log.timestamp).toLocaleTimeString() }, void 0, false
            )] }, idx, true
          )
          ) }, void 0, false
        )] }, void 0, true

      )] }, void 0, true
    ));

}
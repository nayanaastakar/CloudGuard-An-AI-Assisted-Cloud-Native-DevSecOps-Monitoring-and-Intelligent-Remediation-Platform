import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CommandLineIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  ServerIcon,
  SignalIcon,
} from '@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';
import ProvenanceBadge from '../common/ProvenanceBadge';

interface LogRecord {
  timestamp: string;
  level: string;
  stream: string;
  message: string;
}

export default function LogExplorerView() {
  const [query, setQuery] = useState<string>('{app="payment-api"}');
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const [limit, setLimit] = useState<number>(50);
  const [provenance, setProvenance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [servicesHealth, setServicesHealth] = useState<Record<string, any>>({});

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const params = new URLSearchParams({
        query: query,
        limit: limit.toString(),
      });

      const res = await fetch(`/api/v1/cloudguard/monitoring/logs?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setProvenance(data.provenance);
      }

      // Fetch monitoring status for health widgets
      const statusRes = await fetch('/api/v1/cloudguard/monitoring/status', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
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

  const getLogLevelClass = (level: string) => {
    switch (level.toUpperCase()) {
      case 'ERROR':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'WARN':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'INFO':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Log Aggregation & Loki Explorer"
        subtitle="Explore centralized cluster and container stream logs via Grafana Loki with provenance tracking."
      >
        <div className="flex items-center gap-3">
          {provenance && <ProvenanceBadge provenance={provenance} />}
          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700 transition-colors"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Run Query
          </button>
        </div>
      </PageHeader>

      {/* Integration Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { key: 'loki', title: 'Grafana Loki', role: 'Log Aggregator' },
          { key: 'prometheus', title: 'Prometheus', role: 'Metrics Engine' },
          { key: 'grafana', title: 'Grafana UI', role: 'Visualizer' },
          { key: 'opentelemetry', title: 'OpenTelemetry', role: 'OTLP Collector' },
        ].map((svc) => {
          const detail = servicesHealth[svc.key] || {};
          const isLive = detail.provenance === 'live';
          return (
            <div key={svc.key} className="p-3.5 bg-gray-900/60 border border-gray-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-200">{svc.title}</div>
                <div className="text-[11px] text-gray-400">{svc.role}</div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  isLive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                {detail.status || 'Active'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Query Bar */}
      <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl space-y-3">
        <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
          <CommandLineIcon className="w-4 h-4 text-blue-400" />
          LogQL Query Expression:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
            placeholder='e.g. {app="payment-api"} |= "error"'
            className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-100 placeholder-gray-600 focus:outline-none focus:border-blue-500"
          />
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value={25}>25 logs</option>
            <option value={50}>50 logs</option>
            <option value={100}>100 logs</option>
          </select>
          <button
            onClick={fetchLogs}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Execute
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden font-mono text-xs">
        <div className="bg-gray-900/80 px-4 py-2 border-b border-gray-800 flex items-center justify-between text-gray-400 text-[11px]">
          <span>STREAM / LOG OUTPUT</span>
          <span>TIMESTAMP (UTC)</span>
        </div>
        {logs.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            {isLoading ? 'Fetching Loki stream records...' : 'No logs returned for the current query.'}
          </div>
        ) : (
          <div className="divide-y divide-gray-900 max-h-[600px] overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx} className="p-3 hover:bg-gray-900/50 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${getLogLevelClass(log.level)}`}>
                      {log.level}
                    </span>
                    <span className="text-gray-400 text-[11px] font-sans font-semibold">[{log.stream}]</span>
                  </div>
                  <div className="text-gray-200">{log.message}</div>
                </div>
                <div className="text-[10px] text-gray-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

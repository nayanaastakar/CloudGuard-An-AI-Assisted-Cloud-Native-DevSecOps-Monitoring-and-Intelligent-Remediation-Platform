import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldExclamationIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  FireIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';
import ProvenanceBadge from '../common/ProvenanceBadge';

interface ThreatEvent {
  id: string;
  rule: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  output: string;
  timestamp: string;
  namespace?: string;
  pod?: string;
  container?: string;
  image?: string;
  mitre_attack?: string;
  hostname?: string;
  tags?: string[];
  provenance: {
    state: 'live' | 'stale' | 'demo' | 'unavailable';
    source: string;
    last_synced_at: string;
    is_fresh: boolean;
  };
}

export default function RuntimeThreatView() {
  const [events, setEvents] = useState<ThreatEvent[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
    INFO: 0,
  });
  const [overallProvenance, setOverallProvenance] = useState<any>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);

  const fetchThreats = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const params = new URLSearchParams();
      if (selectedSeverity !== 'ALL') params.append('severity', selectedSeverity);
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`/api/v1/cloudguard/runtime/events?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
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
          'proc.name': 'zsh',
        },
        tags: ['mitre_execution', 'live_webhook_sim'],
      };

      const res = await fetch('/api/v1/cloudguard/runtime/falco/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockPayload),
      });

      if (res.ok) {
        const data = await res.json();
        setSimulationStatus(`Falco Webhook Processed: ${data.status} (ID: ${data.event_id || data.fingerprint})`);
        fetchThreats();
      } else {
        setSimulationStatus('Simulation failed to deliver to webhook endpoint.');
      }
    } catch (err: any) {
      setSimulationStatus(`Error sending webhook: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const getSeverityBadgeClass = (sev: string) => {
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Runtime Threat Detection"
        subtitle="Live Falco and Falcosidekick runtime anomaly ingestion, deduplication, and MITRE ATT&CK correlation."
      >
        <div className="flex items-center gap-3">
          {overallProvenance && <ProvenanceBadge provenance={overallProvenance} />}
          <button
            onClick={handleSimulateWebhook}
            disabled={isSimulating}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/40 transition-colors"
          >
            <FireIcon className="w-4 h-4" />
            {isSimulating ? 'Sending Webhook...' : 'Simulate Falco Alert'}
          </button>
          <button
            onClick={fetchThreats}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#151F32] text-gray-200 hover:bg-gray-700 border border-[#2D3B55] transition-colors"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </PageHeader>

      {simulationStatus && (
        <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-xs text-violet-300 flex items-center gap-2">
          <CheckBadgeIcon className="w-4 h-4 text-violet-400" />
          <span>{simulationStatus}</span>
        </div>
      )}

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Critical Alerts', key: 'CRITICAL', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
          { label: 'High Priority', key: 'HIGH', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
          { label: 'Medium Anomaly', key: 'MEDIUM', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Low Severity', key: 'LOW', color: 'text-violet-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { label: 'Info Notices', key: 'INFO', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' },
        ].map((item) => (
          <div key={item.key} className={`p-4 rounded-xl border ${item.bg} flex flex-col justify-between`}>
            <span className="text-xs font-medium text-gray-400">{item.label}</span>
            <span className={`text-2xl font-bold mt-1 ${item.color}`}>{summary[item.key] || 0}</span>
          </div>
        ))}
      </div>

      {/* Controls: Filter & Search */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#0B1220]/60 p-3 rounded-xl border border-gray-800">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FunnelIcon className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400">Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                selectedSeverity === sev
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#151F32] text-gray-400 hover:text-gray-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search rule, container, pod..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchThreats()}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Events Table / Card Feed */}
      <div className="bg-[#0B1220]/60 border border-gray-800 rounded-xl overflow-hidden">
        {events.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            {isLoading ? 'Scanning for runtime threat alerts...' : 'No runtime threat events match the selected criteria.'}
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {events.map((evt) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-[#151F32]/40 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getSeverityBadgeClass(evt.severity)}`}>
                      {evt.severity}
                    </span>
                    <span className="text-sm font-semibold text-gray-100">{evt.rule}</span>
                    {evt.provenance && <ProvenanceBadge provenance={evt.provenance} />}
                  </div>
                  <p className="text-xs text-gray-300 font-mono bg-black/30 p-2 rounded border border-gray-800/50">
                    {evt.output}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
                    {evt.namespace && <span>Namespace: <strong className="text-gray-300">{evt.namespace}</strong></span>}
                    {evt.pod && <span>Pod: <strong className="text-gray-300">{evt.pod}</strong></span>}
                    {evt.container && <span>Container: <strong className="text-gray-300">{evt.container}</strong></span>}
                    {evt.mitre_attack && (
                      <span className="text-violet-400 font-medium bg-purple-900/20 px-2 py-0.5 rounded border border-purple-500/20">
                        {evt.mitre_attack}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end text-right gap-1 min-w-[140px]">
                  <span className="text-[11px] text-gray-500">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  <span className="text-[10px] text-gray-600 font-mono">{evt.id}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

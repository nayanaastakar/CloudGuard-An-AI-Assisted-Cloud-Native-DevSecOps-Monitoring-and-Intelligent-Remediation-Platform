import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ClockIcon,
  CpuChipIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import cloudguardApi, { SecurityIncident } from '../../services/cloudguardApi';

export default function IncidentInvestigationView() {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  const { data: incidents = [], isLoading, refetch, isRefetching } = useQuery<SecurityIncident[]>({
    queryKey: ['cloudguard-incidents'],
    queryFn: async () => {
      const res = await cloudguardApi.getIncidents('default');
      return res.data;
    },
    staleTime: 30000,
  });

  const selectedIncident = incidents.find((i) => i.incident_id === selectedIncidentId) || incidents[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/20">
            <SparklesIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">AI-Powered Incident Investigation</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                Gemini 2.5 Correlated
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Multi-signal correlation across Kubernetes events, container logs, and security findings with automated root-cause analysis.
            </p>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Run Investigation
        </button>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <ArrowPathIcon className="h-10 w-10 text-purple-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Correlating cluster signals and synthesizing incident timelines with AI...</p>
        </div>
      ) : incidents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
          <CheckBadgeIcon className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
          No active cluster anomalies or investigated incidents recorded.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Incident List */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
              Investigated Incidents ({incidents.length})
            </h3>
            {incidents.map((inc) => {
              const isSelected = selectedIncident?.incident_id === inc.incident_id;
              return (
                <div
                  key={inc.incident_id}
                  onClick={() => setSelectedIncidentId(inc.incident_id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-purple-500 shadow-lg shadow-purple-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-purple-400">{inc.incident_id}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
                      {inc.severity}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white line-clamp-1">{inc.title}</h4>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                    <span className="font-mono text-cyan-300">{inc.namespace}/{inc.resource_name}</span>
                    <span>•</span>
                    <span>Confidence: {Math.round(inc.confidence_score * 100)}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Incident Details & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {selectedIncident && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-purple-400 font-bold">{selectedIncident.incident_id}</span>
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
                      AI Confidence: {Math.round(selectedIncident.confidence_score * 100)}%
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-2">{selectedIncident.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">{selectedIncident.summary}</p>
                </div>

                {/* Root cause and blast radius */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                    <p className="text-xs font-semibold uppercase text-purple-400">Root Cause Analysis</p>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedIncident.root_cause}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                    <p className="text-xs font-semibold uppercase text-amber-400">Estimated Blast Radius</p>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedIncident.blast_radius}</p>
                  </div>
                </div>

                {/* Chronological Incident Timeline */}
                <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                    Chronological Correlated Timeline
                  </h4>
                  <div className="space-y-3">
                    {selectedIncident.timeline.map((ev, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <div className="p-1 rounded-full bg-purple-500/20 text-purple-400 shrink-0 mt-0.5">
                          <ClockIcon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{ev.type}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(ev.timestamp).toLocaleTimeString()}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 rounded text-slate-400">
                              {ev.component}
                            </span>
                          </div>
                          <p className="text-slate-400 mt-0.5">{ev.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Raw Evidence Drawer */}
                {selectedIncident.evidence && (
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                      Technical Evidence Snippet
                    </h4>
                    <pre className="p-3 rounded-lg bg-slate-950 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-40 border border-slate-800">
                      {selectedIncident.evidence.logs_snippet || 'No pod log snippet available.'}
                    </pre>
                  </div>
                )}

                {/* Recommendations */}
                <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-emerald-400 tracking-wider">
                    Corrective Remediation Steps
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedIncident.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <ShieldCheckIcon className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

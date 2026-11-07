import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  CommandLineIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  GlobeAltIcon,
  CubeTransparentIcon,
  KeyIcon,
  LockClosedIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import cloudguardApi, { AttackPath } from '../../services/cloudguardApi';

export default function AttackPathView() {
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);

  const { data: paths = [], isLoading, refetch, isRefetching } = useQuery<AttackPath[]>({
    queryKey: ['cloudguard-attack-paths'],
    queryFn: async () => {
      const res = await cloudguardApi.getAttackPaths('default');
      return res.data;
    },
    staleTime: 30000,
  });

  const selectedPath = paths.find((p) => p.path_id === selectedPathId) || paths[0];

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'entry_point': return GlobeAltIcon;
      case 'workload': return CubeTransparentIcon;
      case 'identity': return KeyIcon;
      default: return LockClosedIcon;
    }
  };

  const getNodeColor = (type: string, status: string) => {
    if (type === 'target') return 'border-red-500/50 bg-red-500/10 text-red-400';
    if (status === 'exposed') return 'border-amber-500/50 bg-amber-500/10 text-amber-400';
    if (status === 'overprivileged' || status === 'vulnerable') return 'border-purple-500/50 bg-purple-500/10 text-purple-400';
    return 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/20">
            <CommandLineIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Kubernetes Attack Path Analysis</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
                Predictive Lateral Movement
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Multi-hop graph modeling mapping public ingresses, vulnerable containers, and overprivileged service accounts.
            </p>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Recalculate Paths
        </button>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <ArrowPathIcon className="h-10 w-10 text-cyan-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Traversing cluster relationship graphs and analyzing lateral vectors...</p>
        </div>
      ) : paths.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
          <ShieldCheckIcon className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
          No high-risk multi-hop attack vectors detected in the current cluster topology.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Paths List */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
              Identified Attack Paths ({paths.length})
            </h3>
            {paths.map((p) => {
              const isSelected = (selectedPath?.path_id === p.path_id);
              return (
                <div
                  key={p.path_id}
                  onClick={() => setSelectedPathId(p.path_id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-cyan-400">{p.path_id}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
                      Risk: {p.risk_score}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white line-clamp-1">{p.title}</h4>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                    <span>{p.hop_count} Hops</span>
                    <span>•</span>
                    <span className="truncate">{p.entry_point}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Graph Details View */}
          <div className="lg:col-span-2 space-y-6">
            {selectedPath && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
                      Severity: {selectedPath.severity}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Risk Score: {selectedPath.risk_score} / 10.0</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-2">{selectedPath.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Simulated traversal vector from public entry point to target cluster compromise.
                  </p>
                </div>

                {/* Graph Chain Visualizer */}
                <div className="p-6 rounded-xl bg-slate-950/70 border border-slate-800">
                  <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-6">
                    Attack Path Traversal Chain
                  </h4>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {selectedPath.nodes.map((node, i) => {
                      const Icon = getNodeIcon(node.type);
                      return (
                        <div key={node.id} className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                          {/* Node Card */}
                          <div className={`p-4 rounded-xl border w-full md:w-44 text-center ${getNodeColor(node.type, node.status)}`}>
                            <Icon className="h-6 w-6 mx-auto mb-2 opacity-90" />
                            <div className="text-xs font-bold truncate text-white">{node.label}</div>
                            <div className="text-[10px] uppercase font-semibold mt-1 opacity-70">
                              {node.type.replace('_', ' ')}
                            </div>
                          </div>

                          {/* Arrow connector */}
                          {i < selectedPath.nodes.length - 1 && (
                            <div className="text-slate-500 flex flex-col items-center justify-center my-2 md:my-0">
                              <ArrowRightIcon className="h-5 w-5 text-cyan-400 animate-pulse hidden md:block" />
                              <span className="text-[9px] font-mono text-cyan-300 md:block mt-1">
                                {selectedPath.edges[i]?.vector || 'Vector'}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mitigations */}
                <div className="p-5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-semibold uppercase text-emerald-400 tracking-wider">
                    Recommended Security Mitigations
                  </h4>
                  <ul className="space-y-2">
                    {selectedPath.mitigations.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <ShieldCheckIcon className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{m}</span>
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

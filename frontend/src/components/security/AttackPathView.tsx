import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  CommandLineIcon,
  ShieldCheckIcon,
  ArrowDownIcon,
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
    if (status === 'overprivileged' || status === 'vulnerable') return 'border-[#05AD98]/50 bg-[#05AD98]/10 text-[#05AD98]';
    return 'border-[#05AD98]/50 bg-[#05AD98]/10 text-[#05AD98]';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#131E24] border border-[#2F424E] shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#05AD98] to-[#036B5E] shadow-lg shadow-[#05AD98]/20">
            <CommandLineIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Kubernetes Attack Path Analysis</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
                Predictive Lateral Movement
              </span>
            </div>
            <p className="text-sm text-[#BBBFBF] mt-1">
              Multi-hop graph modeling mapping public ingresses, vulnerable containers, and overprivileged service accounts.
            </p>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[#1A2830] hover:bg-[#223540] border border-[#2F424E] text-white transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Recalculate Paths
        </button>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <ArrowPathIcon className="h-10 w-10 text-[#05AD98] animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#BBBFBF]">Traversing cluster relationship graphs and analyzing lateral vectors...</p>
        </div>
      ) : paths.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#131E24] border border-[#2F424E] text-[#BBBFBF]">
          <ShieldCheckIcon className="h-12 w-12 text-[#05AD98] mx-auto mb-2" />
          No high-risk multi-hop attack vectors detected in the current cluster topology.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Paths List */}
          <div className="space-y-3 min-w-0">
            <h3 className="text-xs font-semibold uppercase text-[#BBBFBF] tracking-wider mb-2">
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
                      ? 'bg-[#1A2830] border-[#05AD98] shadow-lg shadow-[#05AD98]/15 ring-1 ring-[#05AD98]'
                      : 'bg-[#131E24] border-[#2F424E] hover:bg-[#1A2830] hover:border-[#878787]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-[#05AD98]">{p.path_id}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
                      Risk: {p.risk_score}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white line-clamp-1">{p.title}</h4>
                  <div className="flex items-center gap-2 mt-2 text-xs text-[#BBBFBF]">
                    <span>{p.hop_count} Hops</span>
                    <span>•</span>
                    <span className="truncate">{p.entry_point}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Graph Details View */}
          <div className="lg:col-span-2 space-y-6 min-w-0">
            {selectedPath && (
              <div className="p-6 rounded-2xl bg-[#131E24] border border-[#2F424E] shadow-xl space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
                      Severity: {selectedPath.severity}
                    </span>
                    <span className="text-xs text-[#BBBFBF] font-mono">Risk Score: {selectedPath.risk_score} / 10.0</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-2">{selectedPath.title}</h2>
                  <p className="text-xs text-[#BBBFBF] mt-1">
                    Simulated traversal vector from public entry point to target cluster compromise.
                  </p>
                </div>

                {/* Graph Chain Visualizer */}
                <div className="p-4 sm:p-6 rounded-xl bg-[#0D1418] border border-[#2F424E] min-w-0">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h4 className="text-xs font-semibold uppercase text-[#BBBFBF] tracking-wider">
                      Attack Path Traversal Chain
                    </h4>
                    <span className="text-[11px] text-[#BBBFBF] font-medium">
                      {selectedPath.nodes.length} Nodes • {selectedPath.hop_count} Hops
                    </span>
                  </div>

                  {/* Responsive Traversal Chain: 4 equal-sized cards distributed evenly in a grid, with connectors */}
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 lg:gap-0 w-full min-w-0">
                    {selectedPath.nodes.map((node, i) => {
                      const Icon = getNodeIcon(node.type);
                      const isLast = i === selectedPath.nodes.length - 1;
                      const edge = selectedPath.edges[i];

                      // Formats resource names cleanly: splits type/name into two distinct lines
                      const slashIndex = node.label.indexOf('/');
                      const kind = slashIndex !== -1 ? node.label.slice(0, slashIndex) : null;
                      const name = slashIndex !== -1 ? node.label.slice(slashIndex + 1) : node.label;

                      return (
                        <div
                          key={node.id}
                          className="flex flex-col lg:flex-row items-stretch lg:items-center flex-1 min-w-0"
                        >
                          {/* Node Card - Uniform dimension (w-full, fixed height 148px) with full text visibility */}
                          <div
                            className={`p-3 rounded-xl border w-full h-[148px] text-center flex flex-col items-center justify-between transition-all shadow-md ${getNodeColor(
                              node.type,
                              node.status
                            )}`}
                          >
                            {/* Icon Container */}
                            <div className="p-2 rounded-lg bg-black/30 shrink-0">
                              <Icon className="h-5 w-5 sm:h-6 sm:w-6 opacity-95" />
                            </div>

                            {/* Resource Label: Clearly segmented kind and name */}
                            <div className="flex flex-col items-center justify-center w-full px-1 my-auto">
                              {kind && (
                                <span className="text-[10px] text-slate-400 font-mono font-medium tracking-tight">
                                  {kind} /
                                </span>
                              )}
                              <span
                                className="text-xs sm:text-[13px] font-bold text-white tracking-tight leading-tight max-w-full text-center"
                                style={{
                                  overflowWrap: 'anywhere',
                                  wordBreak: 'break-word',
                                  whiteSpace: 'normal',
                                }}
                                title={node.label}
                              >
                                {name}
                              </span>
                            </div>

                            {/* Node Type Tag */}
                            <div className="text-[9px] uppercase font-bold tracking-wider py-0.5 px-2 rounded-md bg-black/25 opacity-80 shrink-0">
                              {node.type.replace('_', ' ')}
                            </div>
                          </div>

                          {/* Arrow connector with relationship vector label */}
                          {!isLast && (
                            <div className="flex flex-col items-center justify-center shrink-0 py-2 lg:py-0 px-1 text-center w-full lg:w-16">
                              {/* Horizontal arrow for desktop */}
                              <div className="hidden lg:flex flex-col items-center justify-center w-full">
                                <ArrowRightIcon className="h-4 w-4 text-[#05AD98] animate-pulse shrink-0" />
                                <span
                                  className="text-[9px] font-mono text-[#06C4AD] font-semibold tracking-tighter mt-1 text-center leading-tight max-w-[62px]"
                                  style={{
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word',
                                  }}
                                  title={edge?.vector || edge?.label || 'Vector'}
                                >
                                  {edge?.vector || edge?.label || 'Vector'}
                                </span>
                              </div>

                              {/* Vertical arrow for mobile/tablet */}
                              <div className="flex lg:hidden flex-col items-center justify-center">
                                <ArrowDownIcon className="h-4 w-4 text-[#05AD98] animate-pulse my-0.5" />
                                <span className="text-[10px] font-mono text-[#06C4AD] font-medium tracking-tight">
                                  {edge?.vector || edge?.label || 'Vector'}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mitigations */}
                <div className="p-5 rounded-xl bg-[#0D1418] border border-[#2F424E] space-y-3">
                  <h4 className="text-xs font-semibold uppercase text-[#05AD98] tracking-wider">
                    Recommended Security Mitigations
                  </h4>
                  <ul className="space-y-2">
                    {selectedPath.mitigations.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#BBBFBF]">
                        <ShieldCheckIcon className="h-4 w-4 text-[#05AD98] shrink-0 mt-0.5" />
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

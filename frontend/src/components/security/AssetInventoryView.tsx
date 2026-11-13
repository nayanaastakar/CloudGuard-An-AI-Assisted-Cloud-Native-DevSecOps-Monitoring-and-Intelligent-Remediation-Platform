import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ServerIcon,
  CircleStackIcon,
  FolderIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import cloudguardApi, { InfrastructureInventoryResponse } from '../../services/cloudguardApi';
import ProvenanceBadge from '../common/ProvenanceBadge';

export const AssetInventoryView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<InfrastructureInventoryResponse | null>(null);
  const [search, setSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'nodes' | 'namespaces' | 'workloads' | 'pods'>('workloads');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await cloudguardApi.getInfrastructureInventory();
      setData(res.data);
    } catch (e) {
      console.error('Failed to fetch infrastructure assets:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header with Provenance Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Cloud Infrastructure & Asset Discovery</h1>
            {data && <ProvenanceBadge provenance={data.provenance} />}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Continuous multi-tier discovery across clusters, nodes, namespaces, workloads, and container images.
          </p>
        </div>
        <button
          onClick={fetchInventory}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Synchronize Assets
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-950/60 text-purple-400 rounded-lg border border-purple-800/40">
            <ServerIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{data?.summary.total_nodes ?? '-'}</div>
            <div className="text-xs text-gray-400">Total Nodes</div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-950/60 text-blue-400 rounded-lg border border-blue-800/40">
            <FolderIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{data?.summary.total_namespaces ?? '-'}</div>
            <div className="text-xs text-gray-400">Namespaces</div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-950/60 text-emerald-400 rounded-lg border border-emerald-800/40">
            <CircleStackIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{data?.summary.total_workloads ?? '-'}</div>
            <div className="text-xs text-gray-400">Workloads</div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-cyan-950/60 text-cyan-400 rounded-lg border border-cyan-800/40">
            <CubeIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{data?.summary.total_pods ?? '-'}</div>
            <div className="text-xs text-gray-400">Running Pods</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-900/60 border border-gray-800 p-2 rounded-xl">
        <div className="flex items-center gap-1 w-full sm:w-auto">
          {(['workloads', 'nodes', 'namespaces', 'pods'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
          <input
            type="text"
            placeholder={`Filter ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-950 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Synchronizing infrastructure assets...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-950/80 text-gray-400 font-semibold border-b border-gray-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Asset ID / Name</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Namespace / Scope</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Details / Images</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono">
                {activeTab === 'workloads' &&
                  data?.workloads
                    .filter((w) => w.name.toLowerCase().includes(search.toLowerCase()))
                    .map((w) => (
                      <tr key={w.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 px-4 text-white font-medium">{w.name}</td>
                        <td className="py-3 px-4 text-emerald-400">{w.type}</td>
                        <td className="py-3 px-4 text-gray-400">{w.namespace}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded text-[10px]">
                            <CheckCircleIcon className="w-3 h-3" /> {w.available_replicas}/{w.replicas} Replicas
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-[11px] truncate max-w-xs">{w.images.join(', ')}</td>
                      </tr>
                    ))}

                {activeTab === 'nodes' &&
                  data?.nodes
                    .filter((n) => n.name.toLowerCase().includes(search.toLowerCase()))
                    .map((n) => (
                      <tr key={n.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 px-4 text-white font-medium">{n.name}</td>
                        <td className="py-3 px-4 text-purple-400">{n.type}</td>
                        <td className="py-3 px-4 text-gray-400">{n.roles.join(', ') || 'worker'}</td>
                        <td className="py-3 px-4 text-emerald-400">{n.status}</td>
                        <td className="py-3 px-4 text-gray-400">{n.kubelet_version} ({n.os_image})</td>
                      </tr>
                    ))}

                {activeTab === 'namespaces' &&
                  data?.namespaces
                    .filter((ns) => ns.name.toLowerCase().includes(search.toLowerCase()))
                    .map((ns) => (
                      <tr key={ns.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 px-4 text-white font-medium">{ns.name}</td>
                        <td className="py-3 px-4 text-blue-400">{ns.type}</td>
                        <td className="py-3 px-4 text-gray-400">Cluster Scoped</td>
                        <td className="py-3 px-4 text-emerald-400">{ns.status}</td>
                        <td className="py-3 px-4 text-gray-500">{ns.created_at || 'system'}</td>
                      </tr>
                    ))}

                {activeTab === 'pods' &&
                  data?.pods
                    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="py-3 px-4 text-white font-medium truncate max-w-xs">{p.name}</td>
                        <td className="py-3 px-4 text-cyan-400">{p.type}</td>
                        <td className="py-3 px-4 text-gray-400">{p.namespace}</td>
                        <td className="py-3 px-4 text-emerald-400">{p.status}</td>
                        <td className="py-3 px-4 text-gray-400">IP: {p.ip || 'Host'} | Node: {p.node_name}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetInventoryView;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShareIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ShieldExclamationIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  ServerStackIcon,
  KeyIcon,
  LockClosedIcon,
  GlobeAltIcon,
  CubeTransparentIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';
import ProvenanceBadge from '../common/ProvenanceBadge';

interface GraphNodeItem {
  node_id: string;
  entity_type: string;
  name: string;
  namespace?: string;
  criticality: string;
  provenance: string;
  properties?: Record<string, any>;
}

interface GraphEdgeItem {
  source: string;
  target: string;
  relationship: string;
  evidence: string;
  confidence: number;
  is_inferred: boolean;
}

export default function SecurityGraphView() {
  const [nodes, setNodes] = useState<GraphNodeItem[]>([]);
  const [edges, setEdges] = useState<GraphEdgeItem[]>([]);
  const [provenance, setProvenance] = useState<any>(null);
  const [selectedEntity, setSelectedEntity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<GraphNodeItem | null>(null);
  const [contextData, setContextData] = useState<any>(null);
  const [isContextLoading, setIsContextLoading] = useState<boolean>(false);

  const fetchGraph = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const params = new URLSearchParams();
      if (selectedEntity !== 'ALL') params.append('entity_type', selectedEntity);
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`/api/v1/cloudguard/graph/data?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        const data = await res.json();
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setProvenance(data.provenance);
        if (data.nodes && data.nodes.length > 0 && !selectedNode) {
          handleSelectNode(data.nodes[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load security graph:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectNode = async (node: GraphNodeItem) => {
    setSelectedNode(node);
    setIsContextLoading(true);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const res = await fetch(`/api/v1/cloudguard/graph/asset-context?asset_id=${encodeURIComponent(node.node_id)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setContextData(data);
      }
    } catch (err) {
      console.error('Failed to fetch asset context:', err);
    } finally {
      setIsContextLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, [selectedEntity]);

  const getNodeBadgeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case 'vulnerability':
        return 'bg-red-500/10 text-red-400 border border-red-500/30';
      case 'runtimeevent':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      case 'workload':
      case 'pod':
        return 'bg-blue-500/10 text-violet-400 border border-blue-500/30';
      case 'serviceaccount':
      case 'role':
        return 'bg-violet-500/10 text-violet-400 border border-violet-500/30';
      case 'networkendpoint':
      case 'exposedservice':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      default:
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Intelligence & Relationship Graph"
        subtitle="PostgreSQL unified security graph connecting infrastructure, workloads, identities, CVEs, and runtime events."
      >
        <div className="flex items-center gap-3">
          {provenance && <ProvenanceBadge provenance={provenance} />}
          <button
            onClick={fetchGraph}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#151F32] text-gray-200 hover:bg-gray-700 border border-[#2D3B55] transition-colors"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Graph
          </button>
        </div>
      </PageHeader>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#0B1220]/60 p-3 rounded-xl border border-gray-800">
        <div className="flex items-center gap-2 flex-wrap">
          <FunnelIcon className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400">Entity Type:</span>
          {['ALL', 'Workload', 'Pod', 'Container', 'Vulnerability', 'ServiceAccount', 'NetworkEndpoint', 'RuntimeEvent'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedEntity(t)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                selectedEntity === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#151F32] text-gray-400 hover:text-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search entity node..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchGraph()}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Two-Column Explorer: Nodes Grid (Left) + 360 Security Context Pane (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node Explorer List */}
        <div className="lg:col-span-2 bg-[#0B1220]/60 border border-gray-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-300 pb-2 border-b border-gray-800">
            <span>DISCOVERED GRAPH ENTITIES ({nodes.length})</span>
            <span className="text-gray-500 font-mono">EDGES: {edges.length}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[620px] overflow-y-auto pr-1">
            {nodes.map((n) => {
              const isSelected = selectedNode?.node_id === n.node_id;
              return (
                <div
                  key={n.node_id}
                  onClick={() => handleSelectNode(n)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/20 shadow-md shadow-blue-500/10'
                      : 'border-gray-800 bg-gray-950/40 hover:border-[#2D3B55] hover:bg-[#151F32]/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getNodeBadgeClass(n.entity_type)}`}>
                      {n.entity_type}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono truncate max-w-[120px]">
                      {n.namespace || 'global'}
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-gray-200 mt-2 truncate">{n.name}</div>
                  <div className="text-[11px] text-gray-500 font-mono truncate mt-0.5">{n.node_id}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 360 Security Context Pane */}
        <div className="bg-[#0B1220]/60 border border-gray-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-800">
            <InformationCircleIcon className="w-5 h-5 text-violet-400" />
            <h3 className="text-sm font-bold text-gray-200">Asset Security Context (360°)</h3>
          </div>

          {selectedNode ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-gray-400">Selected Asset:</span>
                <div className="font-bold text-base text-gray-100">{selectedNode.name}</div>
                <div className="text-[11px] text-gray-500 font-mono">{selectedNode.node_id}</div>
              </div>

              {isContextLoading ? (
                <div className="py-12 text-center text-gray-500">Traversing security graph...</div>
              ) : contextData ? (
                <>
                  {/* Related Vulnerabilities */}
                  <div>
                    <span className="text-gray-400 font-semibold block mb-1">
                      Associated Vulnerabilities ({contextData.vulnerabilities?.length || 0}):
                    </span>
                    {contextData.vulnerabilities?.length === 0 ? (
                      <p className="text-gray-500 text-[11px]">No direct CVEs attached to this entity node.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {contextData.vulnerabilities.map((v: any, idx: number) => (
                          <div key={idx} className="p-2 bg-red-950/20 border border-red-500/20 rounded-lg">
                            <div className="text-red-400 font-bold">{v.cve}</div>
                            <div className="text-[11px] text-gray-400 mt-0.5">{v.evidence}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Connected RBAC & Identities */}
                  <div>
                    <span className="text-gray-400 font-semibold block mb-1">
                      RBAC & Privileges ({contextData.rbac_permissions?.length || 0}):
                    </span>
                    {contextData.rbac_permissions?.length === 0 ? (
                      <p className="text-gray-500 text-[11px]">No overprivileged rolebindings detected.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {contextData.rbac_permissions.map((r: any, idx: number) => (
                          <div key={idx} className="p-2 bg-purple-950/20 border border-purple-500/20 rounded-lg">
                            <div className="text-violet-300 font-bold">{r.identity}</div>
                            <div className="text-[11px] text-gray-400 mt-0.5">{r.evidence}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Connected Assets */}
                  <div>
                    <span className="text-gray-400 font-semibold block mb-1">
                      Connected Topology Edges ({contextData.connected_assets?.length || 0}):
                    </span>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {contextData.connected_assets?.map((a: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-1.5 bg-gray-950/60 rounded text-[11px] border border-gray-800">
                          <span className="text-gray-300 font-medium">{a.asset}</span>
                          <span className="text-violet-400 font-mono text-[10px]">{a.rel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-500 text-xs">
              Select an entity node from the graph to inspect evidence and relationships.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

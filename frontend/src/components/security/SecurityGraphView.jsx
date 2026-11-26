import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  InformationCircleIcon } from
'@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';
import ProvenanceBadge from '../common/ProvenanceBadge';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";




















export default function SecurityGraphView() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [provenance, setProvenance] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [contextData, setContextData] = useState(null);
  const [isContextLoading, setIsContextLoading] = useState(false);

  const fetchGraph = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const params = new URLSearchParams();
      if (selectedEntity !== 'ALL') params.append('entity_type', selectedEntity);
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`/api/v1/cloudguard/graph/data?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
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

  const handleSelectNode = async (node) => {
    setSelectedNode(node);
    setIsContextLoading(true);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const res = await fetch(`/api/v1/cloudguard/graph/asset-context?asset_id=${encodeURIComponent(node.node_id)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
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

  const getNodeBadgeClass = (type) => {
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

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV(PageHeader, {
        title: "Security Intelligence & Relationship Graph",
        subtitle: "PostgreSQL unified security graph connecting infrastructure, workloads, identities, CVEs, and runtime events.", children: /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-3", children: [
          provenance && /*#__PURE__*/_jsxDEV(ProvenanceBadge, { provenance: provenance }, void 0, false), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: fetchGraph,
            className: "flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-gray-200 hover:bg-slate-800 border border-slate-700 transition-colors", children: [/*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `w-4 h-4 ${isLoading ? 'animate-spin' : ''}` }, void 0, false), "Refresh Graph"] }, void 0, true

          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-gray-800", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2 flex-wrap", children: [/*#__PURE__*/
          _jsxDEV(FunnelIcon, { className: "w-4 h-4 text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "text-xs text-gray-400", children: "Entity Type:" }, void 0, false),
          ['ALL', 'Workload', 'Pod', 'Container', 'Vulnerability', 'ServiceAccount', 'NetworkEndpoint', 'RuntimeEvent'].map((t) => /*#__PURE__*/
          _jsxDEV("button", {

            onClick: () => setSelectedEntity(t),
            className: `px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
            selectedEntity === t ?
            'bg-blue-600 text-white' :
            'bg-slate-900 text-gray-400 hover:text-gray-200'}`, children:


            t }, t, false
          )
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "relative w-full md:w-64", children: [/*#__PURE__*/
          _jsxDEV(MagnifyingGlassIcon, { className: "w-4 h-4 text-gray-500 absolute left-3 top-2.5" }, void 0, false), /*#__PURE__*/
          _jsxDEV("input", {
            type: "text",
            placeholder: "Search entity node...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            onKeyDown: (e) => e.key === 'Enter' && fetchGraph(),
            className: "w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500" }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "lg:col-span-2 bg-slate-950/60 border border-gray-800 rounded-xl p-4 space-y-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-between text-xs font-semibold text-gray-300 pb-2 border-b border-gray-800", children: [/*#__PURE__*/
            _jsxDEV("span", { children: ["DISCOVERED GRAPH ENTITIES (", nodes.length, ")"] }, void 0, true), /*#__PURE__*/
            _jsxDEV("span", { className: "text-gray-500 font-mono", children: ["EDGES: ", edges.length] }, void 0, true)] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[620px] overflow-y-auto pr-1", children:
            nodes.map((n) => {
              const isSelected = selectedNode?.node_id === n.node_id;
              return (/*#__PURE__*/
                _jsxDEV("div", {

                  onClick: () => handleSelectNode(n),
                  className: `p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected ?
                  'border-blue-500 bg-blue-950/20 shadow-md shadow-blue-500/10' :
                  'border-gray-800 bg-gray-950/40 hover:border-slate-600 hover:bg-slate-900/30'}`, children: [/*#__PURE__*/


                  _jsxDEV("div", { className: "flex items-center justify-between gap-2", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: `px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getNodeBadgeClass(n.entity_type)}`, children:
                      n.entity_type }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-[10px] text-gray-500 font-mono truncate max-w-[120px]", children:
                      n.namespace || 'global' }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "font-semibold text-sm text-gray-200 mt-2 truncate", children: n.name }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { className: "text-[11px] text-gray-500 font-mono truncate mt-0.5", children: n.node_id }, void 0, false)] }, n.node_id, true
                ));

            }) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "bg-slate-950/60 border border-gray-800 rounded-xl p-5 space-y-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2 pb-3 border-b border-gray-800", children: [/*#__PURE__*/
            _jsxDEV(InformationCircleIcon, { className: "w-5 h-5 text-violet-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("h3", { className: "text-sm font-bold text-gray-200", children: "Asset Security Context (360°)" }, void 0, false)] }, void 0, true
          ),

          selectedNode ? /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-4 text-xs", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-gray-400", children: "Selected Asset:" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "font-bold text-base text-gray-100", children: selectedNode.name }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "text-[11px] text-gray-500 font-mono", children: selectedNode.node_id }, void 0, false)] }, void 0, true
            ),

            isContextLoading ? /*#__PURE__*/
            _jsxDEV("div", { className: "py-12 text-center text-gray-500", children: "Traversing security graph..." }, void 0, false) :
            contextData ? /*#__PURE__*/
            _jsxDEV(_Fragment, { children: [/*#__PURE__*/

              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-400 font-semibold block mb-1", children: ["Associated Vulnerabilities (",
                  contextData.vulnerabilities?.length || 0, "):"] }, void 0, true
                ),
                contextData.vulnerabilities?.length === 0 ? /*#__PURE__*/
                _jsxDEV("p", { className: "text-gray-500 text-[11px]", children: "No direct CVEs attached to this entity node." }, void 0, false) : /*#__PURE__*/

                _jsxDEV("div", { className: "space-y-1.5", children:
                  contextData.vulnerabilities.map((v, idx) => /*#__PURE__*/
                  _jsxDEV("div", { className: "p-2 bg-red-950/20 border border-red-500/20 rounded-lg", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "text-red-400 font-bold", children: v.cve }, void 0, false), /*#__PURE__*/
                    _jsxDEV("div", { className: "text-[11px] text-gray-400 mt-0.5", children: v.evidence }, void 0, false)] }, idx, true
                  )
                  ) }, void 0, false
                )] }, void 0, true

              ), /*#__PURE__*/


              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-400 font-semibold block mb-1", children: ["RBAC & Privileges (",
                  contextData.rbac_permissions?.length || 0, "):"] }, void 0, true
                ),
                contextData.rbac_permissions?.length === 0 ? /*#__PURE__*/
                _jsxDEV("p", { className: "text-gray-500 text-[11px]", children: "No overprivileged rolebindings detected." }, void 0, false) : /*#__PURE__*/

                _jsxDEV("div", { className: "space-y-1.5", children:
                  contextData.rbac_permissions.map((r, idx) => /*#__PURE__*/
                  _jsxDEV("div", { className: "p-2 bg-purple-950/20 border border-purple-500/20 rounded-lg", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "text-violet-300 font-bold", children: r.identity }, void 0, false), /*#__PURE__*/
                    _jsxDEV("div", { className: "text-[11px] text-gray-400 mt-0.5", children: r.evidence }, void 0, false)] }, idx, true
                  )
                  ) }, void 0, false
                )] }, void 0, true

              ), /*#__PURE__*/


              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-400 font-semibold block mb-1", children: ["Connected Topology Edges (",
                  contextData.connected_assets?.length || 0, "):"] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "space-y-1 max-h-48 overflow-y-auto", children:
                  contextData.connected_assets?.map((a, idx) => /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center justify-between p-1.5 bg-gray-950/60 rounded text-[11px] border border-gray-800", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "text-gray-300 font-medium", children: a.asset }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-violet-400 font-mono text-[10px]", children: a.rel }, void 0, false)] }, idx, true
                  )
                  ) }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            ) :
            null] }, void 0, true
          ) : /*#__PURE__*/

          _jsxDEV("div", { className: "py-20 text-center text-gray-500 text-xs", children: "Select an entity node from the graph to inspect evidence and relationships." }, void 0, false

          )] }, void 0, true

        )] }, void 0, true
      )] }, void 0, true
    ));

}
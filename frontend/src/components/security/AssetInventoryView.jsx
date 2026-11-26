import React, { useState, useEffect } from 'react';
import {
  ServerIcon,
  CircleStackIcon,
  FolderIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon } from
'@heroicons/react/24/outline';
import cloudguardApi, { InfrastructureInventoryResponse } from '../../services/cloudguardApi';
import ProvenanceBadge from '../common/ProvenanceBadge';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

export const AssetInventoryView = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('workloads');

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

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "p-6 max-w-7xl mx-auto space-y-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("h1", { className: "text-2xl font-bold text-white tracking-tight", children: "Cloud Infrastructure & Asset Discovery" }, void 0, false),
            data && /*#__PURE__*/_jsxDEV(ProvenanceBadge, { provenance: data.provenance }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-400 mt-1", children: "Continuous multi-tier discovery across clusters, nodes, namespaces, workloads, and container images." }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: fetchInventory,
          disabled: loading,
          className: "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors", children: [/*#__PURE__*/

          _jsxDEV(ArrowPathIcon, { className: `w-4 h-4 ${loading ? 'animate-spin' : ''}` }, void 0, false), "Synchronize Assets"] }, void 0, true

        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "bg-slate-950 border border-gray-800 rounded-xl p-4 flex items-center gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-3 bg-purple-950/60 text-violet-400 rounded-lg border border-purple-800/40", children: /*#__PURE__*/
            _jsxDEV(ServerIcon, { className: "w-6 h-6" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("div", { className: "text-2xl font-bold text-white", children: data?.summary.total_nodes ?? '-' }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "text-xs text-gray-400", children: "Total Nodes" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "bg-slate-950 border border-gray-800 rounded-xl p-4 flex items-center gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-3 bg-blue-950/60 text-violet-400 rounded-lg border border-blue-800/40", children: /*#__PURE__*/
            _jsxDEV(FolderIcon, { className: "w-6 h-6" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("div", { className: "text-2xl font-bold text-white", children: data?.summary.total_namespaces ?? '-' }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "text-xs text-gray-400", children: "Namespaces" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "bg-slate-950 border border-gray-800 rounded-xl p-4 flex items-center gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-3 bg-emerald-950/60 text-blue-400 rounded-lg border border-emerald-800/40", children: /*#__PURE__*/
            _jsxDEV(CircleStackIcon, { className: "w-6 h-6" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("div", { className: "text-2xl font-bold text-white", children: data?.summary.total_workloads ?? '-' }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "text-xs text-gray-400", children: "Workloads" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "bg-slate-950 border border-gray-800 rounded-xl p-4 flex items-center gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-3 bg-cyan-950/60 text-violet-400 rounded-lg border border-cyan-800/40", children: /*#__PURE__*/
            _jsxDEV(CubeIcon, { className: "w-6 h-6" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("div", { className: "text-2xl font-bold text-white", children: data?.summary.total_pods ?? '-' }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "text-xs text-gray-400", children: "Running Pods" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/60 border border-gray-800 p-2 rounded-xl", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-1 w-full sm:w-auto", children:
          ['workloads', 'nodes', 'namespaces', 'pods'].map((tab) => /*#__PURE__*/
          _jsxDEV("button", {

            onClick: () => setActiveTab(tab),
            className: `px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
            activeTab === tab ?
            'bg-emerald-600/20 text-blue-400 border border-blue-500/30' :
            'text-gray-400 hover:text-white'}`, children:


            tab }, tab, false
          )
          ) }, void 0, false
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "relative w-full sm:w-64", children: [/*#__PURE__*/
          _jsxDEV(MagnifyingGlassIcon, { className: "w-4 h-4 absolute left-3 top-2.5 text-gray-500" }, void 0, false), /*#__PURE__*/
          _jsxDEV("input", {
            type: "text",
            placeholder: `Filter ${activeTab}...`,
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "w-full pl-9 pr-3 py-1.5 bg-gray-950 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "bg-slate-950 border border-gray-800 rounded-xl overflow-hidden shadow-sm", children:
        loading ? /*#__PURE__*/
        _jsxDEV("div", { className: "p-12 text-center text-gray-400 text-sm", children: "Synchronizing infrastructure assets..." }, void 0, false) : /*#__PURE__*/

        _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
          _jsxDEV("table", { className: "w-full text-left text-xs text-gray-300", children: [/*#__PURE__*/
            _jsxDEV("thead", { className: "bg-gray-950/80 text-gray-400 font-semibold border-b border-gray-800 uppercase tracking-wider text-[11px]", children: /*#__PURE__*/
              _jsxDEV("tr", { children: [/*#__PURE__*/
                _jsxDEV("th", { className: "py-3.5 px-4", children: "Asset ID / Name" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-3.5 px-4", children: "Type" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-3.5 px-4", children: "Namespace / Scope" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-3.5 px-4", children: "Status" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-3.5 px-4", children: "Details / Images" }, void 0, false)] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("tbody", { className: "divide-y divide-gray-800/60 font-mono", children: [
              activeTab === 'workloads' &&
              data?.workloads.
              filter((w) => w.name.toLowerCase().includes(search.toLowerCase())).
              map((w) => /*#__PURE__*/
              _jsxDEV("tr", { className: "hover:bg-slate-900/30 transition-colors", children: [/*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-white font-medium", children: w.name }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-blue-400", children: w.type }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-gray-400", children: w.namespace }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                  _jsxDEV("span", { className: "inline-flex items-center gap-1 text-blue-400 bg-emerald-950/50 px-2 py-0.5 rounded text-[10px]", children: [/*#__PURE__*/
                    _jsxDEV(CheckCircleIcon, { className: "w-3 h-3" }, void 0, false), " ", w.available_replicas, "/", w.replicas, " Replicas"] }, void 0, true
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-gray-400 text-[11px] truncate max-w-xs", children: w.images.join(', ') }, void 0, false)] }, w.id, true
              )
              ),

              activeTab === 'nodes' &&
              data?.nodes.
              filter((n) => n.name.toLowerCase().includes(search.toLowerCase())).
              map((n) => /*#__PURE__*/
              _jsxDEV("tr", { className: "hover:bg-slate-900/30 transition-colors", children: [/*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-white font-medium", children: n.name }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-violet-400", children: n.type }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-gray-400", children: n.roles.join(', ') || 'worker' }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-blue-400", children: n.status }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-gray-400", children: [n.kubelet_version, " (", n.os_image, ")"] }, void 0, true)] }, n.id, true
              )
              ),

              activeTab === 'namespaces' &&
              data?.namespaces.
              filter((ns) => ns.name.toLowerCase().includes(search.toLowerCase())).
              map((ns) => /*#__PURE__*/
              _jsxDEV("tr", { className: "hover:bg-slate-900/30 transition-colors", children: [/*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-white font-medium", children: ns.name }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-violet-400", children: ns.type }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-gray-400", children: "Cluster Scoped" }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-blue-400", children: ns.status }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-gray-500", children: ns.created_at || 'system' }, void 0, false)] }, ns.id, true
              )
              ),

              activeTab === 'pods' &&
              data?.pods.
              filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).
              map((p) => /*#__PURE__*/
              _jsxDEV("tr", { className: "hover:bg-slate-900/30 transition-colors", children: [/*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-white font-medium truncate max-w-xs", children: p.name }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-violet-400", children: p.type }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-gray-400", children: p.namespace }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-blue-400", children: p.status }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-3 px-4 text-gray-400", children: ["IP: ", p.ip || 'Host', " | Node: ", p.node_name] }, void 0, true)] }, p.id, true
              )
              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

};

export default AssetInventoryView;
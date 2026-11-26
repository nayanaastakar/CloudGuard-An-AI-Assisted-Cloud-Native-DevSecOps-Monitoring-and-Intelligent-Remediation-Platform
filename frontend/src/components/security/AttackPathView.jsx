import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CommandLineIcon,
  ShieldCheckIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  CubeTransparentIcon,
  KeyIcon,
  LockClosedIcon,
  ArrowPathIcon } from
'@heroicons/react/24/outline';
import cloudguardApi, { AttackPath } from '../../services/cloudguardApi';
import ProvenanceBadge from '../common/ProvenanceBadge';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

export default function AttackPathView() {
  const [selectedPathId, setSelectedPathId] = useState(null);

  const { data: paths = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['cloudguard-attack-paths'],
    queryFn: async () => {
      const res = await cloudguardApi.getAttackPaths('default');
      return res.data;
    },
    staleTime: 30000
  });

  const selectedPath = paths.find((p) => p.path_id === selectedPathId) || paths[0];
  const selectedPathProvenance = selectedPath?.provenance || 'demo';

  const getNodeIcon = (type) => {
    switch (type) {
      case 'entry_point':return GlobeAltIcon;
      case 'workload':return CubeTransparentIcon;
      case 'identity':return KeyIcon;
      default:return LockClosedIcon;
    }
  };

  const getNodeColor = (type, status) => {
    if (type === 'target') return 'border-red-500/50 bg-red-500/10 text-red-400';
    if (status === 'exposed') return 'border-amber-500/50 bg-amber-500/10 text-amber-400';
    if (status === 'overprivileged' || status === 'vulnerable') return 'border-primary-400/50 bg-primary-400/10 text-primary-300';
    return 'border-primary-400/50 bg-primary-400/10 text-primary-300';
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-3.5 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/20", children: /*#__PURE__*/
            _jsxDEV(CommandLineIcon, { className: "h-8 w-8 text-white" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV("h1", { className: "text-2xl font-bold text-white tracking-tight", children: "Kubernetes Attack Path Analysis" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/30", children: "Predictive Lateral Movement" }, void 0, false

              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-slate-300 mt-1", children: "Multi-hop graph modeling mapping public ingresses, vulnerable containers, and overprivileged service accounts." }, void 0, false

            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("button", {
          onClick: () => refetch(),
          disabled: isLoading || isRefetching,
          className: "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-colors disabled:opacity-50", children: [/*#__PURE__*/

          _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${isRefetching ? 'animate-spin' : ''}` }, void 0, false), "Recalculate Paths"] }, void 0, true

        )] }, void 0, true
      ),

      isLoading ? /*#__PURE__*/
      _jsxDEV("div", { className: "py-24 text-center", children: [/*#__PURE__*/
        _jsxDEV(ArrowPathIcon, { className: "h-10 w-10 text-primary-300 animate-spin mx-auto mb-3" }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { className: "text-sm text-slate-300", children: "Traversing cluster relationship graphs and analyzing lateral vectors..." }, void 0, false)] }, void 0, true
      ) :
      paths.length === 0 ? /*#__PURE__*/
      _jsxDEV("div", { className: "p-12 text-center rounded-2xl bg-slate-900 border border-slate-700 text-slate-300", children: [/*#__PURE__*/
        _jsxDEV(ShieldCheckIcon, { className: "h-12 w-12 text-primary-300 mx-auto mb-2" }, void 0, false), "No high-risk multi-hop attack vectors detected in the current cluster topology."] }, void 0, true

      ) : /*#__PURE__*/

      _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-start", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "space-y-3 min-w-0", children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-xs font-semibold uppercase text-slate-300 tracking-wider mb-2", children: ["Identified Attack Paths (",
            paths.length, ")"] }, void 0, true
          ),
          paths.map((p) => {
            const isSelected = selectedPath?.path_id === p.path_id;
            return (/*#__PURE__*/
              _jsxDEV("div", {

                onClick: () => setSelectedPathId(p.path_id),
                className: `p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected ?
                'bg-slate-800 border-primary-500 shadow-lg shadow-primary-500/15 ring-1 ring-primary-500' :
                'bg-slate-900 border-slate-700 hover:bg-slate-800 hover:border-slate-500'}`, children: [/*#__PURE__*/


                _jsxDEV("div", { className: "flex items-center justify-between mb-1.5", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-xs font-mono font-bold text-primary-300", children: p.path_id }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 uppercase", children: ["Risk: ",
                    p.risk_score] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("h4", { className: "text-sm font-semibold text-white line-clamp-1", children: p.title }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2 mt-2 text-xs text-slate-300", children: [/*#__PURE__*/
                  _jsxDEV("span", { children: [p.hop_count, " Hops"] }, void 0, true), /*#__PURE__*/
                  _jsxDEV("span", { children: "•" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "truncate", children: p.entry_point }, void 0, false)] }, void 0, true
                )] }, p.path_id, true
              ));

          })] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "lg:col-span-2 space-y-6 min-w-0", children:
          selectedPath && /*#__PURE__*/
          _jsxDEV("div", { className: "p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl space-y-6", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 uppercase", children: ["Severity: ",
                    selectedPath.severity] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV(ProvenanceBadge, { state: selectedPathProvenance }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("span", { className: "text-xs text-slate-300 font-mono", children: ["Risk Score: ", selectedPath.risk_score, " / 10.0"] }, void 0, true)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("h2", { className: "text-lg font-bold text-white mt-2", children: selectedPath.title }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-slate-300 mt-1", children:
                selectedPathProvenance === 'demo' ?
                'Sample traversal vector; not verified against a live cluster.' :
                'Potential traversal vector derived from cluster data; validate evidence before acting.' }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "p-4 sm:p-6 rounded-xl bg-slate-950 border border-slate-700 min-w-0", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between mb-4 sm:mb-6", children: [/*#__PURE__*/
                _jsxDEV("h4", { className: "text-xs font-semibold uppercase text-slate-300 tracking-wider", children: "Attack Path Traversal Chain" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("span", { className: "text-[11px] text-slate-300 font-medium", children: [
                  selectedPath.nodes.length, " Nodes • ", selectedPath.hop_count, " Hops"] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 lg:gap-0 w-full min-w-0", children:
                selectedPath.nodes.map((node, i) => {
                  const Icon = getNodeIcon(node.type);
                  const isLast = i === selectedPath.nodes.length - 1;
                  const edge = selectedPath.edges[i];

                  // Formats resource names cleanly: splits type/name into two distinct lines
                  const slashIndex = node.label.indexOf('/');
                  const kind = slashIndex !== -1 ? node.label.slice(0, slashIndex) : null;
                  const name = slashIndex !== -1 ? node.label.slice(slashIndex + 1) : node.label;

                  return (/*#__PURE__*/
                    _jsxDEV("div", {

                      className: "flex flex-col lg:flex-row items-stretch lg:items-center flex-1 min-w-0", children: [/*#__PURE__*/


                      _jsxDEV("div", {
                        className: `p-3 rounded-xl border w-full h-[148px] text-center flex flex-col items-center justify-between transition-all shadow-md ${getNodeColor(
                          node.type,
                          node.status
                        )}`, children: [/*#__PURE__*/


                        _jsxDEV("div", { className: "p-2 rounded-lg bg-black/30 shrink-0", children: /*#__PURE__*/
                          _jsxDEV(Icon, { className: "h-5 w-5 sm:h-6 sm:w-6 opacity-95" }, void 0, false) }, void 0, false
                        ), /*#__PURE__*/


                        _jsxDEV("div", { className: "flex flex-col items-center justify-center w-full px-1 my-auto", children: [
                          kind && /*#__PURE__*/
                          _jsxDEV("span", { className: "text-[10px] text-slate-400 font-mono font-medium tracking-tight", children: [
                            kind, " /"] }, void 0, true
                          ), /*#__PURE__*/

                          _jsxDEV("span", {
                            className: "text-xs sm:text-[13px] font-bold text-white tracking-tight leading-tight max-w-full text-center",
                            style: {
                              overflowWrap: 'anywhere',
                              wordBreak: 'break-word',
                              whiteSpace: 'normal'
                            },
                            title: node.label, children:

                            name }, void 0, false
                          )] }, void 0, true
                        ), /*#__PURE__*/


                        _jsxDEV("div", { className: "text-[9px] uppercase font-bold tracking-wider py-0.5 px-2 rounded-md bg-black/25 opacity-80 shrink-0", children:
                          node.type.replace('_', ' ') }, void 0, false
                        )] }, void 0, true
                      ),


                      !isLast && /*#__PURE__*/
                      _jsxDEV("div", { className: "flex flex-col items-center justify-center shrink-0 py-2 lg:py-0 px-1 text-center w-full lg:w-16", children: [/*#__PURE__*/

                        _jsxDEV("div", { className: "hidden lg:flex flex-col items-center justify-center w-full", children: [/*#__PURE__*/
                          _jsxDEV(ArrowRightIcon, { className: "h-4 w-4 text-primary-300 animate-pulse shrink-0" }, void 0, false), /*#__PURE__*/
                          _jsxDEV("span", {
                            className: "text-[9px] font-mono text-secondary-300 font-semibold tracking-tighter mt-1 text-center leading-tight max-w-[62px]",
                            style: {
                              whiteSpace: 'normal',
                              wordBreak: 'break-word'
                            },
                            title: edge?.vector || edge?.label || 'Vector', children:

                            edge?.vector || edge?.label || 'Vector' }, void 0, false
                          )] }, void 0, true
                        ), /*#__PURE__*/


                        _jsxDEV("div", { className: "flex lg:hidden flex-col items-center justify-center", children: [/*#__PURE__*/
                          _jsxDEV(ArrowDownIcon, { className: "h-4 w-4 text-primary-300 animate-pulse my-0.5" }, void 0, false), /*#__PURE__*/
                          _jsxDEV("span", { className: "text-[10px] font-mono text-secondary-300 font-medium tracking-tight", children:
                            edge?.vector || edge?.label || 'Vector' }, void 0, false
                          )] }, void 0, true
                        )] }, void 0, true
                      )] }, node.id, true

                    ));

                }) }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "p-5 rounded-xl bg-slate-950 border border-slate-700 space-y-3", children: [/*#__PURE__*/
              _jsxDEV("h4", { className: "text-xs font-semibold uppercase text-primary-300 tracking-wider", children: "Recommended Security Mitigations" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("ul", { className: "space-y-2", children:
                selectedPath.mitigations.map((m, idx) => /*#__PURE__*/
                _jsxDEV("li", { className: "flex items-start gap-2 text-xs text-slate-300", children: [/*#__PURE__*/
                  _jsxDEV(ShieldCheckIcon, { className: "h-4 w-4 text-primary-300 shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { children: m }, void 0, false)] }, idx, true
                )
                ) }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false

        )] }, void 0, true
      )] }, void 0, true

    ));

}
import React from 'react';
import { ProvenanceMetadata } from '../../services/cloudguardApi';
import { ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";









export const ProvenanceBadge = ({
  provenance,
  state: explicitState,
  source: explicitSource,
  label: explicitLabel,
  className = ''
}) => {
  const resolvedState = (explicitState || provenance?.state || 'demo').toLowerCase();
  const resolvedSource = explicitSource || provenance?.source;
  const errorMessage = provenance?.error_message;

  switch (resolvedState) {
    case 'live':
      return (/*#__PURE__*/
        _jsxDEV("span", {
          title: resolvedSource ? `Direct live stream from ${resolvedSource}` : 'Direct live stream',
          className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-blue-400 border border-emerald-500/40 pointer-events-none ${className}`, children: [/*#__PURE__*/

          _jsxDEV("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "font-semibold uppercase tracking-wider text-[10px]", children: explicitLabel || 'LIVE' }, void 0, false),
          resolvedSource && /*#__PURE__*/_jsxDEV("span", { className: "text-emerald-500/80", children: ["(", resolvedSource, ")"] }, void 0, true)] }, void 0, true
        ));


    case 'stale':
      return (/*#__PURE__*/
        _jsxDEV("span", {
          title: resolvedSource ? `Telemetry from ${resolvedSource} exceeds TTL` : 'Telemetry exceeds TTL',
          className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/80 text-amber-300 border border-amber-500/40 pointer-events-none ${className}`, children: [/*#__PURE__*/

          _jsxDEV(ExclamationTriangleIcon, { className: "w-3.5 h-3.5 text-amber-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "font-semibold uppercase tracking-wider text-[10px]", children: explicitLabel || 'STALE' }, void 0, false),
          resolvedSource && /*#__PURE__*/_jsxDEV("span", { className: "text-amber-500/80", children: ["(", resolvedSource, ")"] }, void 0, true)] }, void 0, true
        ));


    case 'unavailable':
      return (/*#__PURE__*/
        _jsxDEV("span", {
          title: errorMessage || 'Target system or scanner unreachable',
          className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-950/80 text-rose-300 border border-rose-500/40 pointer-events-none ${className}`, children: [/*#__PURE__*/

          _jsxDEV(XCircleIcon, { className: "w-3.5 h-3.5 text-rose-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "font-semibold uppercase tracking-wider text-[10px]", children: explicitLabel || 'UNAVAILABLE' }, void 0, false)] }, void 0, true
        ));


    case 'error':
      return (/*#__PURE__*/
        _jsxDEV("span", {
          title: errorMessage || 'The latest data collection attempt failed',
          className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-950/80 text-red-300 border border-red-500/40 pointer-events-none ${className}`, children: [/*#__PURE__*/

          _jsxDEV(XCircleIcon, { className: "w-3.5 h-3.5 text-red-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "font-semibold uppercase tracking-wider text-[10px]", children: explicitLabel || 'ERROR' }, void 0, false)] }, void 0, true
        ));


    case 'demo':
    default:
      return (/*#__PURE__*/
        _jsxDEV("span", {
          title: "Generated deterministic demo scenario (no active live connection)",
          className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-950/80 text-violet-300 border border-teal-500/40 pointer-events-none ${className}`, children: [/*#__PURE__*/

          _jsxDEV(InformationCircleIcon, { className: "w-3.5 h-3.5 text-violet-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "font-semibold uppercase tracking-wider text-[10px]", children: explicitLabel || 'DEMO / LAB' }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "text-violet-400/70 text-[10px]", children: "(Safe Fallback)" }, void 0, false)] }, void 0, true
        ));

  }
};

export default ProvenanceBadge;
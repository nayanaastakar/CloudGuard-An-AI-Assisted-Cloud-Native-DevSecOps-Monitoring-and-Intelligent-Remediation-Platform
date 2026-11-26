import React, { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  CubeIcon } from
'@heroicons/react/24/outline';
import cloudguardApi, { ScannerHealthResponse, SBOMResponse } from '../../services/cloudguardApi';
import ProvenanceBadge from '../common/ProvenanceBadge';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

export const ScannerHealthAndSBOMView = () => {
  const [scannerHealth, setScannerHealth] = useState(null);
  const [sbomData, setSbomData] = useState(null);
  const [targetImage, setTargetImage] = useState('nginx:latest');
  const [, setLoading] = useState(true);
  const [loadingSbom, setLoadingSbom] = useState(false);

  const loadHealth = async () => {
    try {
      setLoading(true);
      const res = await cloudguardApi.getScannerHealth();
      setScannerHealth(res.data);
    } catch (e) {
      console.error('Failed to query scanner health:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadSBOM = async () => {
    try {
      setLoadingSbom(true);
      const res = await cloudguardApi.getSBOMPackages(targetImage);
      setSbomData(res.data);
    } catch (e) {
      console.error('Failed to query SBOM:', e);
    } finally {
      setLoadingSbom(false);
    }
  };

  useEffect(() => {
    loadHealth();
    loadSBOM();
  }, []);

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "p-6 max-w-7xl mx-auto space-y-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h1", { className: "text-2xl font-bold text-white tracking-tight", children: "Scanner Health & SBOM Catalog" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-400 mt-1", children: "Auditing Trivy, Prowler, Kyverno, and Cosign toolchain status with Software Bill of Materials tracking." }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: () => {
            loadHealth();
            loadSBOM();
          },
          className: "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors", children: [/*#__PURE__*/

          _jsxDEV(ArrowPathIcon, { className: "w-4 h-4" }, void 0, false), " Refresh Toolchain"] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children:
        scannerHealth &&
        Object.entries(scannerHealth.scanners).map(([key, scanner]) => /*#__PURE__*/
        _jsxDEV("div", { className: "bg-slate-950 border border-gray-800 rounded-xl p-4 space-y-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-xs font-bold uppercase tracking-wider text-blue-400", children: key }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", {
              className: `inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              scanner.installed ?
              'bg-emerald-950 text-blue-400 border border-emerald-800' :
              'bg-blue-950 text-violet-300 border border-blue-800'}`, children: [


              scanner.installed ? /*#__PURE__*/_jsxDEV(CheckCircleIcon, { className: "w-3 h-3" }, void 0, false) : /*#__PURE__*/_jsxDEV(ExclamationCircleIcon, { className: "w-3 h-3" }, void 0, false),
              scanner.installed ? 'Installed' : 'Simulated'] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "text-sm font-semibold text-white", children: scanner.name }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "text-[11px] text-gray-400 font-mono truncate", title: scanner.path, children: ["Path: ",
            scanner.path] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex flex-wrap gap-1 pt-1", children:
            scanner.supported_capabilities.map((cap) => /*#__PURE__*/
            _jsxDEV("span", { className: "px-1.5 py-0.5 rounded bg-slate-900 text-[10px] text-gray-300 font-mono", children:
              cap }, cap, false
            )
            ) }, void 0, false
          )] }, key, true
        )
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "bg-slate-950 border border-gray-800 rounded-xl p-5 space-y-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2 bg-emerald-950 text-blue-400 rounded-lg border border-emerald-800/40", children: /*#__PURE__*/
              _jsxDEV(CubeIcon, { className: "w-5 h-5" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV("h2", { className: "text-base font-bold text-white", children: "Software Bill of Materials (SBOM)" }, void 0, false),
                sbomData && /*#__PURE__*/_jsxDEV(ProvenanceBadge, { provenance: sbomData.provenance }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-400", children: "Dependency tree, licensing, and vulnerability indicators." }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: targetImage,
              onChange: (e) => setTargetImage(e.target.value),
              placeholder: "e.g., redis:7-alpine",
              className: "px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-500 font-mono focus:border-blue-500" }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: loadSBOM,
              disabled: loadingSbom,
              className: "px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors", children:
              "Analyze" }, void 0, false

            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "border border-gray-800 rounded-lg overflow-hidden", children: /*#__PURE__*/
          _jsxDEV("table", { className: "w-full text-left text-xs text-gray-300 font-mono", children: [/*#__PURE__*/
            _jsxDEV("thead", { className: "bg-gray-950 text-gray-400 font-semibold border-b border-gray-800 uppercase text-[10px] tracking-wider", children: /*#__PURE__*/
              _jsxDEV("tr", { children: [/*#__PURE__*/
                _jsxDEV("th", { className: "py-2.5 px-4", children: "Package" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-2.5 px-4", children: "Version" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-2.5 px-4", children: "Type" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-2.5 px-4", children: "License" }, void 0, false), /*#__PURE__*/
                _jsxDEV("th", { className: "py-2.5 px-4", children: "Vulnerability Count" }, void 0, false)] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("tbody", { className: "divide-y divide-gray-800/60", children:
              sbomData?.packages.map((pkg, idx) => /*#__PURE__*/
              _jsxDEV("tr", { className: "hover:bg-slate-900/30 transition-colors", children: [/*#__PURE__*/
                _jsxDEV("td", { className: "py-2.5 px-4 text-white font-medium", children: pkg.name }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-2.5 px-4 text-blue-400", children: pkg.version }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-2.5 px-4 text-gray-400 uppercase", children: pkg.type }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-2.5 px-4 text-gray-300", children: pkg.license || 'Unknown' }, void 0, false), /*#__PURE__*/
                _jsxDEV("td", { className: "py-2.5 px-4", children:
                  pkg.critical ? /*#__PURE__*/
                  _jsxDEV("span", { className: "text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded text-[10px] font-bold", children: [
                    pkg.vulnerabilities, " (Critical)"] }, void 0, true
                  ) :
                  pkg.vulnerabilities > 0 ? /*#__PURE__*/
                  _jsxDEV("span", { className: "text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded text-[10px]", children: [
                    pkg.vulnerabilities, " CVEs"] }, void 0, true
                  ) : /*#__PURE__*/

                  _jsxDEV("span", { className: "text-blue-400 bg-emerald-950/60 px-2 py-0.5 rounded text-[10px]", children: "0 Clean" }, void 0, false

                  ) }, void 0, false

                )] }, idx, true
              )
              ) }, void 0, false
            )] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true
      )] }, void 0, true
    ));

};

export default ScannerHealthAndSBOMView;
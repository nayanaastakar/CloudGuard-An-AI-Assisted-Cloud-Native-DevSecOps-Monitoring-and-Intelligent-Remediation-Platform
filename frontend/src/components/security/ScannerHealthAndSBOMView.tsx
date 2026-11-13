import React, { useState, useEffect } from 'react';
import {
  WrenchScrewdriverIcon,
  DocumentMagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import cloudguardApi, { ScannerHealthResponse, SBOMResponse } from '../../services/cloudguardApi';
import ProvenanceBadge from '../common/ProvenanceBadge';

export const ScannerHealthAndSBOMView: React.FC = () => {
  const [scannerHealth, setScannerHealth] = useState<ScannerHealthResponse | null>(null);
  const [sbomData, setSbomData] = useState<SBOMResponse | null>(null);
  const [targetImage, setTargetImage] = useState<string>('nginx:latest');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSbom, setLoadingSbom] = useState<boolean>(false);

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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Scanner Health & SBOM Catalog</h1>
          <p className="text-sm text-gray-400 mt-1">
            Auditing Trivy, Prowler, Kyverno, and Cosign toolchain status with Software Bill of Materials tracking.
          </p>
        </div>
        <button
          onClick={() => {
            loadHealth();
            loadSBOM();
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4" /> Refresh Toolchain
        </button>
      </div>

      {/* Security Toolchain Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {scannerHealth &&
          Object.entries(scannerHealth.scanners).map(([key, scanner]) => (
            <div key={key} className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">{key}</span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    scanner.installed
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-blue-950 text-blue-300 border border-blue-800'
                  }`}
                >
                  {scanner.installed ? <CheckCircleIcon className="w-3 h-3" /> : <ExclamationCircleIcon className="w-3 h-3" />}
                  {scanner.installed ? 'Installed' : 'Simulated'}
                </span>
              </div>
              <div className="text-sm font-semibold text-white">{scanner.name}</div>
              <div className="text-[11px] text-gray-400 font-mono truncate" title={scanner.path}>
                Path: {scanner.path}
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {scanner.supported_capabilities.map((cap) => (
                  <span key={cap} className="px-1.5 py-0.5 rounded bg-gray-800 text-[10px] text-gray-300 font-mono">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* SBOM Explorer Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-800/40">
              <CubeIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Software Bill of Materials (SBOM)</h2>
                {sbomData && <ProvenanceBadge provenance={sbomData.provenance} />}
              </div>
              <p className="text-xs text-gray-400">Dependency tree, licensing, and vulnerability indicators.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={targetImage}
              onChange={(e) => setTargetImage(e.target.value)}
              placeholder="e.g., redis:7-alpine"
              className="px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-lg text-xs text-white placeholder-gray-500 font-mono focus:border-emerald-500"
            />
            <button
              onClick={loadSBOM}
              disabled={loadingSbom}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Analyze
            </button>
          </div>
        </div>

        {/* SBOM Packages Table */}
        <div className="border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs text-gray-300 font-mono">
            <thead className="bg-gray-950 text-gray-400 font-semibold border-b border-gray-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Package</th>
                <th className="py-2.5 px-4">Version</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">License</th>
                <th className="py-2.5 px-4">Vulnerability Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {sbomData?.packages.map((pkg, idx) => (
                <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                  <td className="py-2.5 px-4 text-white font-medium">{pkg.name}</td>
                  <td className="py-2.5 px-4 text-emerald-400">{pkg.version}</td>
                  <td className="py-2.5 px-4 text-gray-400 uppercase">{pkg.type}</td>
                  <td className="py-2.5 px-4 text-gray-300">{pkg.license || 'Unknown'}</td>
                  <td className="py-2.5 px-4">
                    {pkg.critical ? (
                      <span className="text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded text-[10px] font-bold">
                        {pkg.vulnerabilities} (Critical)
                      </span>
                    ) : pkg.vulnerabilities > 0 ? (
                      <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded text-[10px]">
                        {pkg.vulnerabilities} CVEs
                      </span>
                    ) : (
                      <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded text-[10px]">
                        0 Clean
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScannerHealthAndSBOMView;

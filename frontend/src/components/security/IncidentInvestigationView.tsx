import { useState, useEffect } from 'react';
import {
  SparklesIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  DocumentMagnifyingGlassIcon,
  WrenchScrewdriverIcon,
  PlusIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';
import ProvenanceBadge from '../common/ProvenanceBadge';

interface EvidenceItem {
  evidence_id: string;
  source: string;
  timestamp: string;
  asset_reference: string;
  severity: string;
  provenance: string;
  details: Record<string, any>;
}

interface StructuredReport {
  investigation_id: string;
  title: string;
  incident_summary: string;
  severity_assessment: string;
  confirmed_facts: string[];
  hypotheses: string[];
  supporting_evidence_ids: string[];
  affected_assets: string[];
  root_cause_possibilities: string[];
  attack_path_references: string[];
  risk_explanation: string;
  recommended_investigation_steps: string[];
  recommended_remediation: string[];
  confidence: number;
  uncertainty: string;
  missing_evidence: string[];
  provider_metadata: Record<string, any>;
}

interface InvestigationRecord {
  investigation_id: string;
  target_type: string;
  target_id: string;
  status: string;
  provenance: string;
  created_at: string;
  report: StructuredReport;
  evidence_bundle: {
    bundle_id: string;
    total_items: number;
    items: EvidenceItem[];
  };
}

export default function IncidentInvestigationView() {
  const [investigations, setInvestigations] = useState<InvestigationRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);

  // New Investigation form state
  const [newTargetType, setNewTargetType] = useState<string>('workload');
  const [newTargetId, setNewTargetId] = useState<string>('payment-api');
  const [userNotes, setUserNotes] = useState<string>('');

  const fetchInvestigations = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const res = await fetch('/api/v1/cloudguard/investigations', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setInvestigations(data || []);
        if (data.length > 0 && !selectedId) {
          setSelectedId(data[0].investigation_id);
        }
      }
    } catch (err) {
      console.error('Failed to load investigations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestigations();
  }, []);

  const handleCreateInvestigation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    try {
      const token = localStorage.getItem('cloudguard_token') || localStorage.getItem('access_token') || sessionStorage.getItem('token');
      const res = await fetch('/api/v1/cloudguard/investigations/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          target_type: newTargetType,
          target_id: newTargetId,
          user_notes: userNotes,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setInvestigations((prev) => [created, ...prev]);
        setSelectedId(created.investigation_id);
        setShowNewModal(false);
        setUserNotes('');
      }
    } catch (err) {
      console.error('Failed to run AI investigation:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectedInv = investigations.find((i) => i.investigation_id === selectedId) || investigations[0];

  const getSeverityBadgeClass = (sev: string) => {
    switch (sev?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-400 border border-red-500/30';
      case 'HIGH':
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
      default:
        return 'bg-blue-500/10 text-violet-400 border border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI-Assisted Incident Investigation"
        subtitle="Secure, evidence-driven AI security analyst correlating cluster signals, CVEs, and runtime threats."
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/20"
          >
            <PlusIcon className="w-4 h-4" />
            New AI Investigation
          </button>
          <button
            onClick={fetchInvestigations}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-gray-200 hover:bg-slate-800 border border-slate-700 transition-colors"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </PageHeader>

      {/* Safety Boundary Banner */}
      <div className="p-3 bg-purple-950/20 border border-violet-500/30 rounded-xl flex items-center justify-between text-xs text-violet-300">
        <div className="flex items-center gap-2">
          <LockClosedIcon className="w-4 h-4 text-violet-400" />
          <span>
            <strong>AI Safety Boundary Active:</strong> Gemini operates in read-only analyst mode. Automated shell commands or destructive changes are strictly prohibited.
          </span>
        </div>
        <span className="font-mono text-[11px] bg-purple-900/40 px-2 py-0.5 rounded border border-violet-500/30">
          Analyst Mode
        </span>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Investigation Dossier List (Left Column) */}
        <div className="bg-slate-950/60 border border-gray-800 rounded-xl p-4 space-y-3">
          <div className="text-xs font-semibold text-gray-400 pb-2 border-b border-gray-800 flex justify-between items-center">
            <span>INVESTIGATION DOSSIERS ({investigations.length})</span>
            <span className="text-[10px] text-gray-500 font-mono">Evidence-Backed</span>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {investigations.map((inv) => {
              const isSelected = selectedInv?.investigation_id === inv.investigation_id;
              const sev = inv.report?.severity_assessment || 'HIGH';
              return (
                <div
                  key={inv.investigation_id}
                  onClick={() => setSelectedId(inv.investigation_id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-950/20 shadow-md shadow-purple-500/10'
                      : 'border-gray-800 bg-gray-950/40 hover:border-slate-600 hover:bg-slate-900/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getSeverityBadgeClass(sev)}`}>
                      {sev}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">{inv.investigation_id}</span>
                  </div>
                  <div className="font-semibold text-xs text-gray-200 mt-2 line-clamp-2">
                    {inv.report?.title || `${inv.target_type}: ${inv.target_id}`}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2 pt-2 border-t border-gray-800/60">
                    <span>{inv.evidence_bundle?.total_items || 0} evidence items</span>
                    <span>{new Date(inv.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Investigation Workspace & Evidence Explorer (Right Columns) */}
        <div className="lg:col-span-2 bg-slate-950/60 border border-gray-800 rounded-xl p-6 space-y-6">
          {selectedInv && selectedInv.report ? (
            <>
              {/* Title & Metadata Strip */}
              <div className="space-y-2 pb-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${getSeverityBadgeClass(selectedInv.report.severity_assessment)}`}>
                    {selectedInv.report.severity_assessment} Severity Assessment
                  </span>
                  <span className="flex items-center gap-2">
                    <ProvenanceBadge state={selectedInv.provenance || 'demo'} />
                    <span className="text-xs text-violet-400 font-medium">
                      Confidence: {(selectedInv.report.confidence * 100).toFixed(0)}%
                    </span>
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-100">{selectedInv.report.title}</h2>
                <p className="text-xs text-gray-300 leading-relaxed bg-black/30 p-3 rounded-lg border border-gray-800">
                  {selectedInv.report.incident_summary}
                </p>
              </div>

              {/* Confirmed Facts vs Hypotheses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-950/10 border border-blue-500/20 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <CheckCircleIcon className="w-4 h-4" />
                    Confirmed Facts ({selectedInv.report.confirmed_facts?.length || 0})
                  </h4>
                  <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                    {selectedInv.report.confirmed_facts?.map((fact, idx) => (
                      <li key={idx} className="leading-relaxed">{fact}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-amber-950/10 border border-amber-500/20 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <SparklesIcon className="w-4 h-4" />
                    AI Working Hypotheses ({selectedInv.report.hypotheses?.length || 0})
                  </h4>
                  <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                    {selectedInv.report.hypotheses?.map((hyp, idx) => (
                      <li key={idx} className="leading-relaxed">{hyp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Curated Evidence Bundle Explorer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <DocumentMagnifyingGlassIcon className="w-4 h-4 text-violet-400" />
                    Curated Evidence Bundle ({selectedInv.evidence_bundle?.total_items || 0} Records)
                  </span>
                  <span className="text-gray-500 font-mono text-[11px]">{selectedInv.evidence_bundle?.bundle_id}</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedInv.evidence_bundle?.items?.map((item) => (
                    <div key={item.evidence_id} className="p-2.5 bg-gray-950 border border-gray-800 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-violet-400 font-semibold">{item.evidence_id}</span>
                        <span className="flex items-center gap-1">
                          <span className="text-[10px] text-gray-400 uppercase font-bold">{item.source}</span>
                          <ProvenanceBadge state={item.provenance} />
                        </span>
                      </div>
                      <div className="text-gray-300 text-[11px]">Asset: <strong>{item.asset_reference}</strong></div>
                      <pre className="text-[10px] text-gray-500 font-mono truncate">{JSON.stringify(item.details)}</pre>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations (Remediation & Next Steps) */}
              <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                  <WrenchScrewdriverIcon className="w-4 h-4 text-violet-400" />
                  Recommended Corrective & Investigation Steps (Requires Human Approval)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block mb-1 font-semibold">Remediation Steps:</span>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      {selectedInv.report.recommended_remediation?.map((rem, idx) => (
                        <li key={idx}>{rem}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1 font-semibold">Investigation Actions:</span>
                    <ul className="space-y-1 list-disc list-inside text-gray-300">
                      {selectedInv.report.recommended_investigation_steps?.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-24 text-center text-gray-500 text-xs">
              Select an investigation dossier to view evidence and structured AI report.
            </div>
          )}
        </div>
      </div>

      {/* New Investigation Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-violet-400" />
              Launch New AI Investigation
            </h3>
            <p className="text-xs text-gray-400">
              Correlates telemetry across security graph, Trivy SBOM, and Falco runtime webhooks.
            </p>

            <form onSubmit={handleCreateInvestigation} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Target Entity Type:</label>
                <select
                  value={newTargetType}
                  onChange={(e) => setNewTargetType(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="workload">Workload / Deployment</option>
                  <option value="threat">Runtime Threat Event</option>
                  <option value="vulnerability">Vulnerability / CVE</option>
                  <option value="attack_path">Attack Path</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Target Identifier / Resource:</label>
                <input
                  type="text"
                  value={newTargetId}
                  onChange={(e) => setNewTargetId(e.target.value)}
                  placeholder="e.g. payment-api or CVE-2024-21626"
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Investigation Notes (Optional):</label>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  rows={3}
                  placeholder="Provide operator context or anomaly details..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-gray-300 hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center gap-2"
                >
                  {isAnalyzing && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                  {isAnalyzing ? 'Analyzing with AI...' : 'Synthesize Dossier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

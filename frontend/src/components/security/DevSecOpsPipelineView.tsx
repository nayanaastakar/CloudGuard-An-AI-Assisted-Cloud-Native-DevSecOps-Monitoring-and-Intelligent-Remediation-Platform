import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CommandLineIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  KeyIcon,
  CodeBracketIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  ArrowPathIcon,
  FingerPrintIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline';
import ProvenanceBadge from '../common/ProvenanceBadge';

interface GatePolicy {
  id: string;
  name: string;
  description: string;
  blocking: boolean;
  severityThreshold: string;
}

interface PipelineStage {
  stage_name: string;
  tool: string;
  status: string;
  duration_seconds: number;
  summary: string;
  findings_count: number;
  provenance: string;
  details: any;
}

interface PipelineReport {
  pipeline_id: string;
  repository: string;
  branch: string;
  commit_sha: string;
  triggered_by: string;
  started_at: string;
  completed_at: string;
  overall_status: string;
  gate_decision?: string;
  gate_reasons?: string[];
  security_gate_passed: boolean;
  critical_findings: number;
  high_findings: number;
  medium_findings: number;
  stages: PipelineStage[];
  provenance: string;
}

export default function DevSecOpsPipelineView() {
  const [activeTab, setActiveTab] = useState<'pipelines' | 'gates' | 'secrets' | 'signatures' | 'ci_snippets'>('pipelines');
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [pipelines, setPipelines] = useState<PipelineReport[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<PipelineReport | null>(null);
  const [secretFindings, setSecretFindings] = useState<any[]>([]);
  const [secretProvenance, setSecretProvenance] = useState<string>('demo');
  const [signatureResult, setSignatureResult] = useState<any | null>(null);
  const [imageInput, setImageInput] = useState<string>('cloudguard/payment-api:v2.1.0');
  const [signerInput, setSignerInput] = useState<string>('security@cloudguard.io');
  const [loading, setLoading] = useState<boolean>(false);

  const [policies, setPolicies] = useState<GatePolicy[]>([
    {
      id: 'gate-1',
      name: 'Block Critical Vulnerabilities',
      description: 'Fails pipeline build if any Critical CVEs are identified in base container images.',
      blocking: true,
      severityThreshold: 'CRITICAL',
    },
    {
      id: 'gate-2',
      name: 'Enforce Pod Security Standards (Restricted)',
      description: 'Rejects manifests attempting to run containers with root privileges or hostPID/hostNetwork.',
      blocking: true,
      severityThreshold: 'HIGH',
    },
    {
      id: 'gate-3',
      name: 'Zero-Secret Leakage Gate (Gitleaks)',
      description: 'Blocks commits containing AWS credentials, Private Keys, or API tokens before merging.',
      blocking: true,
      severityThreshold: 'CRITICAL',
    },
    {
      id: 'gate-4',
      name: 'Mandatory Cosign Cryptographic Signature',
      description: 'Verifies container image is digitally signed by trusted CloudGuard release identity.',
      blocking: true,
      severityThreshold: 'HIGH',
    },
  ]);

  useEffect(() => {
    fetchPipelines();
    fetchSecrets();
    verifySignature(imageInput, signerInput);
  }, []);

  const fetchPipelines = async () => {
    try {
      const res = await fetch('/api/v1/cloudguard/devsecops/pipelines');
      if (res.ok) {
        const data = await res.json();
        setPipelines(data);
        if (data.length > 0 && !selectedPipeline) {
          setSelectedPipeline(data[0]);
        }
      }
    } catch (e) {
      console.error('Error fetching pipelines:', e);
    }
  };

  const fetchSecrets = async () => {
    try {
      const res = await fetch('/api/v1/cloudguard/devsecops/secrets/scan');
      if (res.ok) {
        const data = await res.json();
        setSecretFindings(data.findings || []);
        setSecretProvenance(typeof data.provenance === 'string' ? data.provenance : (data.provenance?.state || 'demo'));
      }
    } catch (e) {
      console.error('Error scanning secrets:', e);
    }
  };

  const verifySignature = async (image: string, signer: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/cloudguard/devsecops/signatures/verify?image=${encodeURIComponent(image)}&expected_signer=${encodeURIComponent(signer)}`);
      if (res.ok) {
        const data = await res.json();
        setSignatureResult(data);
      }
    } catch (e) {
      console.error('Error verifying signature:', e);
    } finally {
      setLoading(false);
    }
  };

  const togglePolicy = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, blocking: !p.blocking } : p))
    );
  };

  const handleTriggerPipeline = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/v1/cloudguard/devsecops/pipelines/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repository: 'cloudguard/microservices-backend',
          branch: 'feature/security-hardening',
        }),
      });
      if (res.ok) {
        const newPipe = await res.json();
        setPipelines((prev) => [newPipe, ...prev]);
        setSelectedPipeline(newPipe);
      }
    } catch (e) {
      console.error('Failed triggering pipeline:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  const githubActionsYaml = `name: CloudGuard DevSecOps Gate

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  cloudguard-security-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Gitleaks Secret Scanning
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

      - name: Trivy SBOM & Vulnerability Scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'cloudguard/payment-api:v2.1.0'
          format: 'table'
          exit-code: '1'
          severity: 'CRITICAL,HIGH'

      - name: Verify Cosign Signature
        run: |
          cosign verify --key cosign.pub cloudguard/payment-api:v2.1.0

      - name: CloudGuard Policy Gate Admission
        run: |
          curl -X POST "http://cloudguard-backend:8001/api/v1/cloudguard/devsecops/pipelines/trigger" \\
            -H "Authorization: Bearer \${{ secrets.CLOUDGUARD_API_TOKEN }}" \\
            -H "Content-Type: application/json" \\
            -d '{"repository": "cloudguard/payment-api", "branch": "\${{ github.ref_name }}", "commit_sha": "\${{ github.sha }}"}'
`;

  const copySnippet = () => {
    navigator.clipboard.writeText(githubActionsYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <CommandLineIcon className="w-7 h-7 text-blue-400" />
              DevSecOps CI/CD Security Pipeline
            </h1>
            <ProvenanceBadge state="live" label="Live Orchestrator" />
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Shift-left CI/CD automated gates, Gitleaks secret interception, SBOM package analysis, and Cosign digital signatures.
          </p>
        </div>
        <button
          onClick={handleTriggerPipeline}
          disabled={isSimulating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-lg shadow-indigo-600/30"
        >
          {isSimulating ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <PlayIcon className="w-4 h-4" />}
          Trigger Pipeline Audit
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-800 gap-2">
        <button
          onClick={() => setActiveTab('pipelines')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'pipelines'
              ? 'border-indigo-500 text-blue-400 font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          Pipeline Runs ({pipelines.length})
        </button>
        <button
          onClick={() => setActiveTab('gates')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'gates'
              ? 'border-indigo-500 text-blue-400 font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          Quality & Security Gates
        </button>
        <button
          onClick={() => setActiveTab('secrets')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'secrets'
              ? 'border-indigo-500 text-blue-400 font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          Secret Detection (Gitleaks)
        </button>
        <button
          onClick={() => setActiveTab('signatures')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'signatures'
              ? 'border-indigo-500 text-blue-400 font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          Supply Chain (Cosign)
        </button>
        <button
          onClick={() => setActiveTab('ci_snippets')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'ci_snippets'
              ? 'border-indigo-500 text-blue-400 font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          CI/CD Snippets
        </button>
      </div>

      {/* Tab: Pipeline Runs */}
      {activeTab === 'pipelines' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase text-gray-400 tracking-wider">Recent Executions</h2>
            {pipelines.map((pipe) => (
              <div
                key={pipe.pipeline_id}
                onClick={() => setSelectedPipeline(pipe)}
                className={`p-4 rounded-xl cursor-pointer border transition ${
                  selectedPipeline?.pipeline_id === pipe.pipeline_id
                    ? 'bg-[#1B2940] border-indigo-500'
                    : 'bg-[#0B1220] border-gray-800 hover:border-[#2D3B55]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-white">{pipe.pipeline_id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                      pipe.overall_status === 'PASSED'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {pipe.overall_status}
                  </span>
                </div>
                <p className="text-xs text-gray-300 font-medium truncate">{pipe.repository}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                  <span>Branch: {pipe.branch}</span>
                  <span className="font-mono text-gray-500">{pipe.commit_sha?.substring(0, 7)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline Details */}
          <div className="lg:col-span-2 space-y-4">
            {selectedPipeline ? (
              <div className="p-6 rounded-xl bg-[#0B1220] border border-gray-800 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold text-white">{selectedPipeline.pipeline_id}</h2>
                      <ProvenanceBadge state={selectedPipeline.provenance || 'demo'} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Repository: {selectedPipeline.repository} ({selectedPipeline.branch})
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded text-sm font-bold uppercase ${
                        selectedPipeline.overall_status === 'PASSED'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      Gate: {selectedPipeline.overall_status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Triggered by {selectedPipeline.triggered_by}</p>
                  </div>
                </div>

                {/* Gate Reasons if Blocked */}
                {selectedPipeline.gate_reasons && selectedPipeline.gate_reasons.length > 0 && (
                  <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/30">
                    <div className="flex items-center gap-2 text-red-400 text-sm font-semibold mb-2">
                      <ShieldExclamationIcon className="w-5 h-5" /> Security Policy Gate Decision Rationale
                    </div>
                    <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                      {selectedPipeline.gate_reasons.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Stages Timeline */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase text-gray-400 tracking-wider">Multi-Stage Inspection Flow</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedPipeline.stages?.map((stage, i) => (
                      <div key={i} className="p-4 rounded-lg bg-gray-950 border border-gray-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {stage.status === 'passed' ? (
                              <CheckCircleIcon className="w-5 h-5 text-blue-400" />
                            ) : (
                              <XCircleIcon className="w-5 h-5 text-red-400" />
                            )}
                            <span className="text-sm font-bold text-white">{stage.stage_name}</span>
                          </div>
                          <span className="text-xs font-mono text-gray-500">{stage.duration_seconds}s</span>
                        </div>
                        <p className="text-xs text-gray-400">{stage.summary}</p>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-900">
                          <span className="text-gray-500">Tool: {stage.tool}</span>
                          <ProvenanceBadge state={stage.provenance} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500 border border-dashed border-gray-800 rounded-xl">
                Select a pipeline execution report to inspect stage timelines and gate reasons.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Quality & Security Gates */}
      {activeTab === 'gates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="p-5 rounded-xl bg-[#0B1220] border border-gray-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      THRESHOLD: {policy.severityThreshold}
                    </span>
                    <button
                      onClick={() => togglePolicy(policy.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        policy.blocking
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-[#151F32] text-gray-400'
                      }`}
                    >
                      {policy.blocking ? 'Blocking' : 'Advisory Only'}
                    </button>
                  </div>
                  <h3 className="text-base font-semibold text-white">{policy.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">{policy.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
                  <span>Enforced at Pull Request stage</span>
                  <span className="text-blue-400 flex items-center gap-1">
                    <ShieldCheckIcon className="w-4 h-4" /> Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Secrets */}
      {activeTab === 'secrets' && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-[#0B1220] border border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyIcon className="w-5 h-5 text-amber-400" />
                Gitleaks Secret Detection Findings
              </h3>
              <ProvenanceBadge state={secretProvenance} />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Active pattern matcher intercepting 140+ credential types. All secret previews are automatically masked before presentation.
            </p>
            <div className="mt-4 space-y-3">
              {secretFindings.length > 0 ? (
                secretFindings.map((f, i) => (
                  <div key={i} className="p-4 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                          {f.severity || 'CRITICAL'}
                        </span>
                        <span className="text-sm font-bold text-white">{f.secret_type}</span>
                        <span className="text-xs font-mono text-gray-500">({f.rule_id})</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        File: <span className="text-blue-400">{f.file_path}</span>:{f.line_number}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Masked Token: <span className="font-mono text-amber-300">{f.secret_preview || f.redacted_preview}</span>
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded text-xs font-bold bg-red-950 text-red-300 border border-red-800">
                      BLOCKED
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 text-sm">
                  Zero unmasked credentials detected.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Signatures */}
      {activeTab === 'signatures' && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-[#0B1220] border border-gray-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FingerPrintIcon className="w-5 h-5 text-blue-400" />
              Cosign Digital Signature & Supply Chain Attestation
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Verifies container images against cryptographic signatures and OpenID Connect (OIDC) identities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs text-gray-400">Target Container Image</label>
                <input
                  type="text"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  className="w-full mt-1 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Expected OIDC Signer Identity</label>
                <input
                  type="text"
                  value={signerInput}
                  onChange={(e) => setSignerInput(e.target.value)}
                  className="w-full mt-1 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <button
              onClick={() => verifySignature(imageInput, signerInput)}
              disabled={loading}
              className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2"
            >
              {loading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <DocumentCheckIcon className="w-4 h-4" />}
              Verify Cryptographic Signature
            </button>

            {signatureResult && (
              <div className="mt-6 p-4 rounded-lg bg-gray-950 border border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {signatureResult.verified ? (
                      <CheckCircleIcon className="w-5 h-5 text-blue-400" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-sm font-bold text-white">
                      {signatureResult.verified ? 'Signature Cryptographically Verified' : 'Signature Verification Failed'}
                    </span>
                  </div>
                  <ProvenanceBadge state={signatureResult.provenance || 'demo'} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-400">
                  <div>
                    <span className="text-gray-500">Signer Identity:</span>
                    <p className="text-white font-mono mt-0.5">{signatureResult.signer || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Certificate Issuer:</span>
                    <p className="text-white font-mono mt-0.5">{signatureResult.certificate_issuer || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-500">Artifact Digest:</span>
                    <p className="text-gray-400 font-mono mt-0.5 truncate">{signatureResult.digest}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 pt-2 border-t border-gray-900">{signatureResult.verification_message}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: CI Snippets */}
      {activeTab === 'ci_snippets' && (
        <div className="p-5 rounded-xl bg-[#0B1220] border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold">
              <CodeBracketIcon className="w-5 h-5 text-blue-400" />
              GitHub Actions Workflow (.github/workflows/cloudguard.yml)
            </div>
            <button
              onClick={copySnippet}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151F32] hover:bg-gray-700 text-xs text-gray-200 border border-[#2D3B55] transition"
            >
              <ClipboardDocumentCheckIcon className="w-4 h-4 text-blue-400" />
              {copied ? 'Copied!' : 'Copy Workflow'}
            </button>
          </div>
          <pre className="bg-gray-950 p-4 rounded-lg border border-gray-800 font-mono text-xs text-gray-300 overflow-x-auto leading-relaxed">
            {githubActionsYaml}
          </pre>
        </div>
      )}
    </div>
  );
}

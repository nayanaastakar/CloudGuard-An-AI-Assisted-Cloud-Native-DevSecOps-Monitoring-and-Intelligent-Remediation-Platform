import { useState } from 'react';
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
} from '@heroicons/react/24/outline';

interface GatePolicy {
  id: string;
  name: string;
  description: string;
  blocking: boolean;
  severityThreshold: string;
}

export default function DevSecOpsPipelineView() {
  const [activeTab, setActiveTab] = useState<'gates' | 'secrets' | 'ci_snippets'>('gates');
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);

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
      name: 'Require Mandatory Resource Limits',
      description: 'Issues warning if CPU or Memory requests and limits are missing from deployment specs.',
      blocking: false,
      severityThreshold: 'MEDIUM',
    },
  ]);

  const togglePolicy = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, blocking: !p.blocking } : p))
    );
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationResult({
        timestamp: new Date().toISOString(),
        commit: '7fa4b12',
        branch: 'feature/auth-service',
        author: 'devsecops@cloudguard.io',
        passed: false,
        summary: 'Build rejected: 1 Critical CVE and 1 Hardcoded Secret detected in commit diff.',
        findings: [
          { tool: 'Gitleaks', rule: 'generic-api-key', file: 'config/dev.env:14', severity: 'CRITICAL', status: 'BLOCKED' },
          { tool: 'Trivy', cve: 'CVE-2023-44487', pkg: 'golang.org/x/net', severity: 'CRITICAL', status: 'BLOCKED' },
          { tool: 'Checkov', check: 'CKV_K8S_16', desc: 'Container should not run as root', severity: 'HIGH', status: 'BLOCKED' },
        ],
      });
    }, 1200);
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

      - name: Run Gitleaks Secret Detection
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

      - name: CloudGuard Pre-flight Posture & IaC Audit
        run: |
          curl -X POST "http://cloudguard-backend:8001/api/v1/cloudguard/posture/audit" \\
            -H "Authorization: Bearer \${{ secrets.CLOUGUARD_API_TOKEN }}" \\
            -H "Content-Type: application/json" \\
            -d '{"commit_sha": "\${{ github.sha }}", "blocking": true}'
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
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CommandLineIcon className="w-7 h-7 text-indigo-400" />
            DevSecOps Pipeline Security
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Shift-left CI/CD security gates, Gitleaks secret interception, and automated pull-request validation.
          </p>
        </div>
        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
        >
          {isSimulating ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <PlayIcon className="w-4 h-4" />}
          Simulate CI/CD Gate
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-800 gap-2">
        <button
          onClick={() => setActiveTab('gates')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'gates'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          Quality & Security Gates
        </button>
        <button
          onClick={() => setActiveTab('secrets')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'secrets'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          Secret Detection (Gitleaks)
        </button>
        <button
          onClick={() => setActiveTab('ci_snippets')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'ci_snippets'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          CI/CD Webhook & Pipeline Config
        </button>
      </div>

      {/* Simulation Result Banner */}
      {simulationResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-red-950/30 border border-red-900/40 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <XCircleIcon className="w-5 h-5" />
              <span>CI/CD PIPELINE REJECTED: Security Threshold Breached</span>
            </div>
            <span className="text-xs font-mono text-gray-400">Commit: {simulationResult.commit}</span>
          </div>
          <p className="text-xs text-gray-300">{simulationResult.summary}</p>
          <div className="space-y-2 mt-2">
            {simulationResult.findings.map((f: any, idx: number) => (
              <div key={idx} className="bg-gray-900/80 p-2.5 rounded-lg border border-red-900/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-indigo-400">[{f.tool}]</span>
                  <span className="text-gray-200">{f.rule || f.cve || f.check}</span>
                  <span className="text-gray-400">{f.file || f.pkg || f.desc}</span>
                </div>
                <span className="px-2 py-0.5 rounded font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  {f.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tab: Quality & Security Gates */}
      {activeTab === 'gates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="p-5 rounded-xl bg-gray-900 border border-gray-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      THRESHOLD: {policy.severityThreshold}
                    </span>
                    <button
                      onClick={() => togglePolicy(policy.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        policy.blocking
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-gray-800 text-gray-400'
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
                  <span className="text-emerald-400 flex items-center gap-1">
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
          <div className="p-5 rounded-xl bg-gray-900 border border-gray-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyIcon className="w-5 h-5 text-amber-400" />
              Gitleaks Secret Scanning Engine
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Active pattern matcher intercepting 140+ credential types including AWS keys, GitHub tokens, JWTs, and private SSH certificates.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 rounded-lg bg-gray-950 border border-gray-800">
                <span className="text-xs text-gray-500">Commits Scanned</span>
                <p className="text-xl font-bold text-white mt-1">1,429</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-950 border border-gray-800">
                <span className="text-xs text-gray-500">Leaks Prevented</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">18</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-950 border border-gray-800">
                <span className="text-xs text-gray-500">Allowed Suppressions</span>
                <p className="text-xl font-bold text-gray-300 mt-1">3</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: CI Snippets */}
      {activeTab === 'ci_snippets' && (
        <div className="p-5 rounded-xl bg-gray-900 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold">
              <CodeBracketIcon className="w-5 h-5 text-indigo-400" />
              GitHub Actions Workflow (.github/workflows/cloudguard.yml)
            </div>
            <button
              onClick={copySnippet}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-200 border border-gray-700 transition"
            >
              <ClipboardDocumentCheckIcon className="w-4 h-4 text-indigo-400" />
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

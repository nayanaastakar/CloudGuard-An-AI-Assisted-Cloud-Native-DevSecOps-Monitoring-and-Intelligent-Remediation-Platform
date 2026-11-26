import { useState, useEffect } from 'react';
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
  DocumentCheckIcon } from
'@heroicons/react/24/outline';
import ProvenanceBadge from '../common/ProvenanceBadge';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";







































export default function DevSecOpsPipelineView() {
  const [activeTab, setActiveTab] = useState('pipelines');
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [secretFindings, setSecretFindings] = useState([]);
  const [secretProvenance, setSecretProvenance] = useState('demo');
  const [signatureResult, setSignatureResult] = useState(null);
  const [imageInput, setImageInput] = useState('cloudguard/payment-api:v2.1.0');
  const [signerInput, setSignerInput] = useState('security@cloudguard.io');
  const [loading, setLoading] = useState(false);

  const [policies, setPolicies] = useState([
  {
    id: 'gate-1',
    name: 'Block Critical Vulnerabilities',
    description: 'Fails pipeline build if any Critical CVEs are identified in base container images.',
    blocking: true,
    severityThreshold: 'CRITICAL'
  },
  {
    id: 'gate-2',
    name: 'Enforce Pod Security Standards (Restricted)',
    description: 'Rejects manifests attempting to run containers with root privileges or hostPID/hostNetwork.',
    blocking: true,
    severityThreshold: 'HIGH'
  },
  {
    id: 'gate-3',
    name: 'Zero-Secret Leakage Gate (Gitleaks)',
    description: 'Blocks commits containing AWS credentials, Private Keys, or API tokens before merging.',
    blocking: true,
    severityThreshold: 'CRITICAL'
  },
  {
    id: 'gate-4',
    name: 'Mandatory Cosign Cryptographic Signature',
    description: 'Verifies container image is digitally signed by trusted CloudGuard release identity.',
    blocking: true,
    severityThreshold: 'HIGH'
  }]
  );

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
        setSecretProvenance(typeof data.provenance === 'string' ? data.provenance : data.provenance?.state || 'demo');
      }
    } catch (e) {
      console.error('Error scanning secrets:', e);
    }
  };

  const verifySignature = async (image, signer) => {
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

  const togglePolicy = (id) => {
    setPolicies((prev) =>
    prev.map((p) => p.id === id ? { ...p, blocking: !p.blocking } : p)
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
          branch: 'feature/security-hardening'
        })
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

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "p-6 max-w-7xl mx-auto space-y-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(CommandLineIcon, { className: "w-7 h-7 text-blue-400" }, void 0, false), "DevSecOps CI/CD Security Pipeline"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV(ProvenanceBadge, { state: "live", label: "Live Orchestrator" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-400 mt-1", children: "Shift-left CI/CD automated gates, Gitleaks secret interception, SBOM package analysis, and Cosign digital signatures." }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: handleTriggerPipeline,
          disabled: isSimulating,
          className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-lg shadow-indigo-600/30", children: [

          isSimulating ? /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "w-4 h-4 animate-spin" }, void 0, false) : /*#__PURE__*/_jsxDEV(PlayIcon, { className: "w-4 h-4" }, void 0, false), "Trigger Pipeline Audit"] }, void 0, true

        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex border-b border-gray-800 gap-2", children: [/*#__PURE__*/
        _jsxDEV("button", {
          onClick: () => setActiveTab('pipelines'),
          className: `px-4 py-2 text-sm font-medium border-b-2 transition ${
          activeTab === 'pipelines' ?
          'border-indigo-500 text-blue-400 font-semibold' :
          'border-transparent text-gray-400 hover:text-gray-200'}`, children: [

          "Pipeline Runs (",
          pipelines.length, ")"] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: () => setActiveTab('gates'),
          className: `px-4 py-2 text-sm font-medium border-b-2 transition ${
          activeTab === 'gates' ?
          'border-indigo-500 text-blue-400 font-semibold' :
          'border-transparent text-gray-400 hover:text-gray-200'}`, children:

          "Quality & Security Gates" }, void 0, false

        ), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: () => setActiveTab('secrets'),
          className: `px-4 py-2 text-sm font-medium border-b-2 transition ${
          activeTab === 'secrets' ?
          'border-indigo-500 text-blue-400 font-semibold' :
          'border-transparent text-gray-400 hover:text-gray-200'}`, children:

          "Secret Detection (Gitleaks)" }, void 0, false

        ), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: () => setActiveTab('signatures'),
          className: `px-4 py-2 text-sm font-medium border-b-2 transition ${
          activeTab === 'signatures' ?
          'border-indigo-500 text-blue-400 font-semibold' :
          'border-transparent text-gray-400 hover:text-gray-200'}`, children:

          "Supply Chain (Cosign)" }, void 0, false

        ), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: () => setActiveTab('ci_snippets'),
          className: `px-4 py-2 text-sm font-medium border-b-2 transition ${
          activeTab === 'ci_snippets' ?
          'border-indigo-500 text-blue-400 font-semibold' :
          'border-transparent text-gray-400 hover:text-gray-200'}`, children:

          "CI/CD Snippets" }, void 0, false

        )] }, void 0, true
      ),


      activeTab === 'pipelines' && /*#__PURE__*/
      _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
          _jsxDEV("h2", { className: "text-sm font-semibold uppercase text-gray-400 tracking-wider", children: "Recent Executions" }, void 0, false),
          pipelines.map((pipe) => /*#__PURE__*/
          _jsxDEV("div", {

            onClick: () => setSelectedPipeline(pipe),
            className: `p-4 rounded-xl cursor-pointer border transition ${
            selectedPipeline?.pipeline_id === pipe.pipeline_id ?
            'bg-slate-800 border-primary-500' :
            'bg-slate-950 border-gray-800 hover:border-slate-600'}`, children: [/*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "font-mono text-xs font-bold text-white", children: pipe.pipeline_id }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", {
                className: `px-2 py-0.5 rounded text-xs font-bold uppercase ${
                pipe.overall_status === 'PASSED' ?
                'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                'bg-red-500/20 text-red-400 border border-red-500/30'}`, children:


                pipe.overall_status }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-300 font-medium truncate", children: pipe.repository }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between mt-2 text-xs text-gray-400", children: [/*#__PURE__*/
              _jsxDEV("span", { children: ["Branch: ", pipe.branch] }, void 0, true), /*#__PURE__*/
              _jsxDEV("span", { className: "font-mono text-gray-500", children: pipe.commit_sha?.substring(0, 7) }, void 0, false)] }, void 0, true
            )] }, pipe.pipeline_id, true
          )
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "lg:col-span-2 space-y-4", children:
          selectedPipeline ? /*#__PURE__*/
          _jsxDEV("div", { className: "p-6 rounded-xl bg-slate-950 border border-gray-800 space-y-6", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between pb-4 border-b border-gray-800", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                  _jsxDEV("h2", { className: "text-lg font-bold text-white", children: selectedPipeline.pipeline_id }, void 0, false), /*#__PURE__*/
                  _jsxDEV(ProvenanceBadge, { state: selectedPipeline.provenance || 'demo' }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-400 mt-1", children: ["Repository: ",
                  selectedPipeline.repository, " (", selectedPipeline.branch, ")"] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "text-right", children: [/*#__PURE__*/
                _jsxDEV("span", {
                  className: `px-3 py-1 rounded text-sm font-bold uppercase ${
                  selectedPipeline.overall_status === 'PASSED' ?
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'}`, children: [

                  "Gate: ",
                  selectedPipeline.overall_status] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-500 mt-1", children: ["Triggered by ", selectedPipeline.triggered_by] }, void 0, true)] }, void 0, true
              )] }, void 0, true
            ),


            selectedPipeline.gate_reasons && selectedPipeline.gate_reasons.length > 0 && /*#__PURE__*/
            _jsxDEV("div", { className: "p-4 rounded-lg bg-red-950/40 border border-red-500/30", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2 text-red-400 text-sm font-semibold mb-2", children: [/*#__PURE__*/
                _jsxDEV(ShieldExclamationIcon, { className: "w-5 h-5" }, void 0, false), " Security Policy Gate Decision Rationale"] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("ul", { className: "list-disc list-inside text-xs text-gray-300 space-y-1", children:
                selectedPipeline.gate_reasons.map((r, idx) => /*#__PURE__*/
                _jsxDEV("li", { children: r }, idx, false)
                ) }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/



            _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "text-sm font-semibold uppercase text-gray-400 tracking-wider", children: "Multi-Stage Inspection Flow" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children:
                selectedPipeline.stages?.map((stage, i) => /*#__PURE__*/
                _jsxDEV("div", { className: "p-4 rounded-lg bg-gray-950 border border-gray-800 space-y-2", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2", children: [
                      stage.status === 'passed' ? /*#__PURE__*/
                      _jsxDEV(CheckCircleIcon, { className: "w-5 h-5 text-blue-400" }, void 0, false) : /*#__PURE__*/

                      _jsxDEV(XCircleIcon, { className: "w-5 h-5 text-red-400" }, void 0, false), /*#__PURE__*/

                      _jsxDEV("span", { className: "text-sm font-bold text-white", children: stage.stage_name }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-xs font-mono text-gray-500", children: [stage.duration_seconds, "s"] }, void 0, true)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-400", children: stage.summary }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center justify-between text-xs pt-2 border-t border-gray-900", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "text-gray-500", children: ["Tool: ", stage.tool] }, void 0, true), /*#__PURE__*/
                    _jsxDEV(ProvenanceBadge, { state: stage.provenance }, void 0, false)] }, void 0, true
                  )] }, i, true
                )
                ) }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ) : /*#__PURE__*/

          _jsxDEV("div", { className: "p-12 text-center text-gray-500 border border-dashed border-gray-800 rounded-xl", children: "Select a pipeline execution report to inspect stage timelines and gate reasons." }, void 0, false

          ) }, void 0, false

        )] }, void 0, true
      ),



      activeTab === 'gates' && /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-4", children: /*#__PURE__*/
        _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children:
          policies.map((policy) => /*#__PURE__*/
          _jsxDEV("div", {

            className: "p-5 rounded-xl bg-slate-950 border border-gray-800 flex flex-col justify-between", children: [/*#__PURE__*/

            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300", children: ["THRESHOLD: ",
                  policy.severityThreshold] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => togglePolicy(policy.id),
                  className: `px-3 py-1 rounded-full text-xs font-semibold transition ${
                  policy.blocking ?
                  'bg-red-500/20 text-red-400 border border-red-500/30' :
                  'bg-slate-900 text-gray-400'}`, children:


                  policy.blocking ? 'Blocking' : 'Advisory Only' }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("h3", { className: "text-base font-semibold text-white", children: policy.name }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-400 mt-1", children: policy.description }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500", children: [/*#__PURE__*/
              _jsxDEV("span", { children: "Enforced at Pull Request stage" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-blue-400 flex items-center gap-1", children: [/*#__PURE__*/
                _jsxDEV(ShieldCheckIcon, { className: "w-4 h-4" }, void 0, false), " Active"] }, void 0, true
              )] }, void 0, true
            )] }, policy.id, true
          )
          ) }, void 0, false
        ) }, void 0, false
      ),



      activeTab === 'secrets' && /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-4", children: /*#__PURE__*/
        _jsxDEV("div", { className: "p-5 rounded-xl bg-slate-950 border border-gray-800", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-base font-bold text-white flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(KeyIcon, { className: "w-5 h-5 text-amber-400" }, void 0, false), "Gitleaks Secret Detection Findings"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV(ProvenanceBadge, { state: secretProvenance }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-gray-400 mt-1", children: "Active pattern matcher intercepting 140+ credential types. All secret previews are automatically masked before presentation." }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "mt-4 space-y-3", children:
            secretFindings.length > 0 ?
            secretFindings.map((f, i) => /*#__PURE__*/
            _jsxDEV("div", { className: "p-4 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30", children:
                    f.severity || 'CRITICAL' }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-sm font-bold text-white", children: f.secret_type }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-xs font-mono text-gray-500", children: ["(", f.rule_id, ")"] }, void 0, true)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-400 mt-1", children: ["File: ", /*#__PURE__*/
                  _jsxDEV("span", { className: "text-blue-400", children: f.file_path }, void 0, false), ":", f.line_number] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-500 mt-1", children: ["Masked Token: ", /*#__PURE__*/
                  _jsxDEV("span", { className: "font-mono text-amber-300", children: f.secret_preview || f.redacted_preview }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("span", { className: "px-2.5 py-1 rounded text-xs font-bold bg-red-950 text-red-300 border border-red-800", children: "BLOCKED" }, void 0, false

              )] }, i, true
            )
            ) : /*#__PURE__*/

            _jsxDEV("div", { className: "text-center py-6 text-gray-500 text-sm", children: "Zero unmasked credentials detected." }, void 0, false

            ) }, void 0, false

          )] }, void 0, true
        ) }, void 0, false
      ),



      activeTab === 'signatures' && /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-4", children: /*#__PURE__*/
        _jsxDEV("div", { className: "p-5 rounded-xl bg-slate-950 border border-gray-800", children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-base font-bold text-white flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(FingerPrintIcon, { className: "w-5 h-5 text-blue-400" }, void 0, false), "Cosign Digital Signature & Supply Chain Attestation"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-gray-400 mt-1", children: "Verifies container images against cryptographic signatures and OpenID Connect (OIDC) identities." }, void 0, false

          ), /*#__PURE__*/

          _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "text-xs text-gray-400", children: "Target Container Image" }, void 0, false), /*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                value: imageInput,
                onChange: (e) => setImageInput(e.target.value),
                className: "w-full mt-1 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white" }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "text-xs text-gray-400", children: "Expected OIDC Signer Identity" }, void 0, false), /*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                value: signerInput,
                onChange: (e) => setSignerInput(e.target.value),
                className: "w-full mt-1 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white" }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("button", {
            onClick: () => verifySignature(imageInput, signerInput),
            disabled: loading,
            className: "mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2", children: [

            loading ? /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "w-4 h-4 animate-spin" }, void 0, false) : /*#__PURE__*/_jsxDEV(DocumentCheckIcon, { className: "w-4 h-4" }, void 0, false), "Verify Cryptographic Signature"] }, void 0, true

          ),

          signatureResult && /*#__PURE__*/
          _jsxDEV("div", { className: "mt-6 p-4 rounded-lg bg-gray-950 border border-gray-800 space-y-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [
                signatureResult.verified ? /*#__PURE__*/
                _jsxDEV(CheckCircleIcon, { className: "w-5 h-5 text-blue-400" }, void 0, false) : /*#__PURE__*/

                _jsxDEV(XCircleIcon, { className: "w-5 h-5 text-red-400" }, void 0, false), /*#__PURE__*/

                _jsxDEV("span", { className: "text-sm font-bold text-white", children:
                  signatureResult.verified ? 'Signature Cryptographically Verified' : 'Signature Verification Failed' }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV(ProvenanceBadge, { state: signatureResult.provenance || 'demo' }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-400", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500", children: "Signer Identity:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-white font-mono mt-0.5", children: signatureResult.signer || 'N/A' }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500", children: "Certificate Issuer:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-white font-mono mt-0.5", children: signatureResult.certificate_issuer || 'N/A' }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "md:col-span-2", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500", children: "Artifact Digest:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-gray-400 font-mono mt-0.5 truncate", children: signatureResult.digest }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-400 pt-2 border-t border-gray-900", children: signatureResult.verification_message }, void 0, false)] }, void 0, true
          )] }, void 0, true

        ) }, void 0, false
      ),



      activeTab === 'ci_snippets' && /*#__PURE__*/
      _jsxDEV("div", { className: "p-5 rounded-xl bg-slate-950 border border-gray-800 space-y-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2 text-white font-semibold", children: [/*#__PURE__*/
            _jsxDEV(CodeBracketIcon, { className: "w-5 h-5 text-blue-400" }, void 0, false), "GitHub Actions Workflow (.github/workflows/cloudguard.yml)"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: copySnippet,
            className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-gray-200 border border-slate-700 transition", children: [/*#__PURE__*/

            _jsxDEV(ClipboardDocumentCheckIcon, { className: "w-4 h-4 text-blue-400" }, void 0, false),
            copied ? 'Copied!' : 'Copy Workflow'] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("pre", { className: "bg-gray-950 p-4 rounded-lg border border-gray-800 font-mono text-xs text-gray-300 overflow-x-auto leading-relaxed", children:
          githubActionsYaml }, void 0, false
        )] }, void 0, true
      )] }, void 0, true

    ));

}
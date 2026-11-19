import {
  CodeBracketSquareIcon,
  ArrowTopRightOnSquareIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  CubeTransparentIcon,
  CommandLineIcon,
  SparklesIcon,
  StarIcon,
  ArrowPathIcon,
  ServerStackIcon,
  CheckCircleIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

const CLOUDGUARD_REPO = {
  name: 'CloudGuard',
  fullName: 'CloudGuard – An AI-Assisted Cloud-Native DevSecOps Monitoring and Intelligent Remediation Platform',
  url: 'https://github.com/nayanaastakar/CloudGuard-An-AI-Assisted-Cloud-Native-DevSecOps-Monitoring-and-Intelligent-Remediation-Platform',
  description:
    'An AI-powered Cloud-Native DevSecOps Platform engineered for automated Kubernetes security auditing, vulnerability intelligence, Falco runtime threat detection, 360° graph attack-path modeling, and LLM-assisted remediation generation.',
  readmeUrl:
    'https://github.com/nayanaastakar/CloudGuard-An-AI-Assisted-Cloud-Native-DevSecOps-Monitoring-and-Intelligent-Remediation-Platform#readme',
  language: 'Python / TypeScript',
  topics: ['kubernetes', 'devsecops', 'cloud-native', 'ai-remediation', 'falco', 'trivy', 'fastapi', 'react', 'security-posture'],
};

const architectureLayers = [
  {
    layer: 'Presentation & UI',
    components: 'React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Monaco Editor',
    description: 'Real-time DevSecOps operations console with interactive 360° attack graphs and remediation diff viewers.',
  },
  {
    layer: 'API & Orchestration Engine',
    components: 'FastAPI · Uvicorn · Pydantic V2 · Async SQLAlchemy 2.0 · Python 3.11',
    description: 'Asynchronous event bus, security audit engines, policy evaluators, and JWT RBAC authentication.',
  },
  {
    layer: 'Data & Telemetry Backbone',
    components: 'PostgreSQL 16 · Redis 7 (In-Memory PubSub & Caching) · Kubernetes API',
    description: 'Persistent audit records, live workload discovery, real-time caching, and rate limiting.',
  },
  {
    layer: 'Security Scanning & Intelligence',
    components: 'Aqua Trivy 0.58 · Falco Runtime Engine · Gitleaks · CIS K8s Benchmarks',
    description: 'Continuous container CVE scans, kernel-level runtime syscall inspection, and secrets detection.',
  },
  {
    layer: 'AI Investigation & Remediation',
    components: 'Google Gemini 2.5 Flash · Groq Llama 3.3 70B · OpenAI API Support',
    description: 'Evidence synthesis, root-cause correlation, and dry-run verified Kubernetes patch manifest generation.',
  },
];

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Explainable Security Posture Engine',
    description: 'Continuous Kubernetes audits across PSS, RBAC, and Network Policies using an evidence-backed scoring algorithm.',
    status: 'LIVE',
    statusColor: 'emerald',
  },
  {
    icon: SparklesIcon,
    title: 'AI-Assisted Incident Remediation',
    description: 'Synthesizes Kubernetes warning events and pod conditions into root-cause analyses with verifiable YAML diffs.',
    status: 'LIVE (Gemini)',
    statusColor: 'emerald',
  },
  {
    icon: ServerStackIcon,
    title: 'Live Workload & Asset Discovery',
    description: 'Discovers active nodes, namespaces, pods, deployments, services, and cluster secrets from the live cluster.',
    status: 'LIVE (K8s API)',
    statusColor: 'emerald',
  },
  {
    icon: CubeTransparentIcon,
    title: 'Container Vulnerability Intelligence',
    description: 'Integrated Aqua Trivy container scanning for image CVE detection, package SBOM analysis, and severity ranking.',
    status: 'INTEGRATED',
    statusColor: 'blue',
  },
  {
    icon: CommandLineIcon,
    title: 'Runtime Threat Detection',
    description: 'Kernel-level syscall inspection via Falco event receiver webhook for anomalous shell and privilege escalation alerts.',
    status: 'WEBHOOK READY',
    statusColor: 'amber',
  },
  {
    icon: CpuChipIcon,
    title: 'Attack Path & Graph Modeling',
    description: '360° graph analysis correlating public entry points, overprivileged service accounts, and cluster targets.',
    status: 'LIVE GRAPH',
    statusColor: 'emerald',
  },
];

const setupSteps = [
  {
    step: '1',
    title: 'Clone Repository',
    code: 'git clone https://github.com/nayanaastakar/CloudGuard-An-AI-Assisted-Cloud-Native-DevSecOps-Monitoring-and-Intelligent-Remediation-Platform.git\ncd CloudGuard-An-AI-Assisted-Cloud-Native-DevSecOps-Monitoring-and-Intelligent-Remediation-Platform',
  },
  {
    step: '2',
    title: 'Configure Environment',
    code: 'cp .env.example .env\n# Set POSTGRES_PASSWORD, SECRET_KEY, DEFAULT_ADMIN_PASSWORD, and GEMINI_API_KEY',
  },
  {
    step: '3',
    title: 'Launch with Docker Compose',
    code: 'docker compose up -d\n# Starts postgres:5433, redis:6380, backend:8001, and frontend:3001',
  },
  {
    step: '4',
    title: 'Access the Dashboard',
    code: 'http://localhost:3001  # Login: admin / admin123\nhttp://localhost:8001/docs  # Interactive Swagger API Documentation',
  },
];

export default function GitHubRepositoriesPage() {
  return (
    <div className="min-h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 md:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <CodeBracketSquareIcon className="h-7 w-7 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Project & Repository Architecture</h1>
            <p className="text-slate-400 text-sm">Source code, architectural design, documentation, and live execution reference</p>
          </div>
        </div>
        <a
          href={CLOUDGUARD_REPO.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-700/25 self-start sm:self-auto"
        >
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          View on GitHub
        </a>
      </div>

      {/* Main Repository Information Card */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/10 to-purple-600/20 border-b border-slate-700/60 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-white/10 rounded-xl p-3 flex-shrink-0">
              <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white" aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white">{CLOUDGUARD_REPO.name}</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Official Repository
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  v2.0.0 Architecture
                </span>
              </div>
              <p className="text-xs text-blue-300/80 mt-1 font-mono break-all">{CLOUDGUARD_REPO.url}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={CLOUDGUARD_REPO.readmeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-600/50"
            >
              <BookOpenIcon className="h-4 w-4 text-green-400" />
              README / Docs
            </a>
            <a
              href={`${CLOUDGUARD_REPO.url}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-600/50"
            >
              <ArrowPathIcon className="h-4 w-4 text-amber-400" />
              Issues
            </a>
          </div>
        </div>

        <div className="p-6">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">{CLOUDGUARD_REPO.description}</p>
          <div className="flex flex-wrap gap-2">
            {CLOUDGUARD_REPO.topics.map((topic) => (
              <span
                key={topic}
                className="px-2.5 py-1 text-xs rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono"
              >
                #{topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture Breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">System Architecture Layers</h3>
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl overflow-hidden divide-y divide-slate-700/50">
          {architectureLayers.map((arch) => (
            <div key={arch.layer} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="md:w-1/3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-blue-400" />
                  {arch.layer}
                </h4>
                <p className="text-xs text-slate-400 mt-1">{arch.description}</p>
              </div>
              <div className="md:w-2/3 bg-slate-950/60 rounded-xl px-4 py-2.5 border border-slate-800">
                <span className="text-xs font-mono text-violet-300">{arch.components}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features & Status */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Platform Capabilities & Telemetry State</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl flex flex-col justify-between hover:border-slate-600 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <feat.icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      feat.statusColor === 'emerald'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : feat.statusColor === 'blue'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {feat.status}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1.5">{feat.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Setup & Execution Guide */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Setup & Local Execution Instructions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {setupSteps.map((step) => (
            <div key={step.step} className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">
                  {step.step}
                </span>
                <h4 className="text-sm font-semibold text-white">{step.title}</h4>
              </div>
              <pre className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre">
                {step.code}
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StarIcon className="h-5 w-5 text-amber-400" />
            <h4 className="text-base font-bold text-white">CloudGuard Open Source Project</h4>
          </div>
          <p className="text-xs text-slate-300">
            Star the repository on GitHub to follow latest DevSecOps automations, Trivy scanners, and AI investigation pipelines.
          </p>
        </div>
        <a
          href={CLOUDGUARD_REPO.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-700/30 flex-shrink-0"
        >
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          Open on GitHub
        </a>
      </div>
    </div>
  );
}

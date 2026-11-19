<div align="center">

# CloudGuard

### An AI-Assisted Cloud-Native DevSecOps Monitoring and Intelligent Remediation Platform

**Secure, Analyse and Optimise Your Cloud-Native Infrastructure with Real-Time Intelligence.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-06B6D4.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5.svg?logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![CIS Benchmark](https://img.shields.io/badge/CIS%20K8s-v1.8-05AD98.svg)](#6-continuous-compliance-engine)
[![Gemini](https://img.shields.io/badge/AI%20Engine-Gemini%202.5-orange.svg)](#4-ai-powered-incident-correlation--investigation)

---

</div>

## Overview

**CloudGuard** is a cloud-native DevSecOps monitoring and intelligent remediation platform. Designed specifically for multi-tenant and production Kubernetes environments, CloudGuard continuously monitors cluster attack surfaces, models predictive multi-hop lateral movement chains, correlates cross-signal incidents with Google Gemini AI, validates remediation plans using server-side dry-runs, and enforces continuous regulatory compliance frameworks (CIS, NIST SP 800-190, PCI-DSS).

CloudGuard adopts a modern **Vichy design system** featuring high-contrast slate backgrounds (`#0D1418`, `#131E24`), vibrant teal accents (`#05AD98`), soft light grays (`#BBBFBF`), and crisp pure white typography (`#FFFFFF`).

---

## Complete Application Showcase & Screenshots

### 1. Security Center & Posture Overview
Real-time posture score evaluation against Pod Security Standards (PSS) with automated threat posture grades.
<p align="center">
  <img src="screenshots/01_security_center_posture.png" alt="Security Center Posture" width="95%" />
</p>

### 2. Multi-Hop Kubernetes Attack Path Analysis
Simulated kill-chain traversal identifying lateral movements from ingress endpoints through overprivileged service accounts to cluster secrets.
<p align="center">
  <img src="screenshots/06_attack_paths_analysis.png" alt="Kubernetes Attack Path Analysis" width="95%" />
</p>

### 3. Real-Time Observability & Monitoring Metrics
Cluster-wide resource metrics tracking CPU utilization, memory pressure, pod restart frequencies, and active firing alerts.
<p align="center">
  <img src="screenshots/14_monitoring_metrics.png" alt="Monitoring & Real-Time Metrics" width="95%" />
</p>

### 4. AI-Driven Log Summarization & Event Stream
Automated 10-minute AI log summarization powered by Gemini alongside live Kubernetes warning event streams.
<p align="center">
  <img src="screenshots/15_monitoring_logs_and_ai_summary.png" alt="AI Log Summary and Event Aggregation" width="95%" />
</p>

### 5. Multi-Signal Security Modules Gallery

#### Asset Inventory
Inventory across nodes, pods, namespaces, ingresses, and services with real-time classification.
<p align="center">
  <img src="screenshots/02_asset_inventory.png" alt="Asset Inventory" width="95%" />
</p>

#### Vulnerability Intelligence
Trivy container image scanning with contextual runtime risk calculation and CVSS scoring.
<p align="center">
  <img src="screenshots/03_vulnerability_management.png" alt="Vulnerability Intelligence" width="95%" />
</p>

#### Runtime Threats (Falco)
Kernel-level runtime behavioral anomaly and Falco threat detection streams.
<p align="center">
  <img src="screenshots/04_runtime_threats_falco.png" alt="Runtime Threats Falco" width="95%" />
</p>


Interactive topological graph modeling cluster relationships and blast radii.
<p align="center">
  <img src="screenshots/05_security_graph_360.png" alt="360 Security Graph" width="95%" />
</p>

#### AI Incident Investigation
Automated incident timeline generation, root cause analysis, and Gemini AI suggestions.
<p align="center">
  <img src="screenshots/07_ai_incident_investigation.png" alt="AI Incident Investigation" width="95%" />
</p>

#### Intelligent Remediation Center
Server-side dry-run verified YAML manifests with mandatory human-in-the-loop sign-off.
<p align="center">
  <img src="screenshots/08_remediation_center.png" alt="Intelligent Remediation Center" width="95%" />
</p>

#### Compliance Engine
CIS Kubernetes v1.8, NIST SP 800-190, and PCI-DSS continuous compliance audits.
<p align="center">
  <img src="screenshots/09_compliance_engine.png" alt="Compliance Engine" width="95%" />
</p>

#### DevSecOps Pipeline Security
Shift-left CI/CD gates and secret interception with Gitleaks pre-commit scanners.
<p align="center">
  <img src="screenshots/10_devsecops_pipeline.png" alt="DevSecOps Pipeline Security" width="95%" />
</p>

#### Scanner Health & SBOM
CycloneDX and SPDX Software Bill of Materials (SBOM) tracking across images.
<p align="center">
  <img src="screenshots/11_scanner_health_and_sbom.png" alt="Scanner Health & SBOM" width="95%" />
</p>

### 6. Cluster Administration & Workloads

#### Cluster Overview & Nodes
Node capacity, kubelet statuses, and cluster topology metrics.
<p align="center">
  <img src="screenshots/12_cluster_overview_and_nodes.png" alt="Cluster Overview & Nodes" width="95%" />
</p>

#### Workload Manager
Resource introspection across Pods, Deployments, and DaemonSets.
<p align="center">
  <img src="screenshots/13_kubernetes_workloads.png" alt="Workload Manager" width="95%" />
</p>

#### Loki Log Explorer
Multi-tenant log querying with logQL filter capabilities.
<p align="center">
  <img src="screenshots/16_loki_log_explorer.png" alt="Loki Log Explorer" width="95%" />
</p>

#### User Management
Role-Based Access Control (RBAC) user administration and permissions.
<p align="center">
  <img src="screenshots/17_user_management.png" alt="User Management" width="95%" />
</p>

#### Audit Logs
Comprehensive immutable audit trail of all administrative and operator actions.
<p align="center">
  <img src="screenshots/18_audit_logs.png" alt="Audit Logs" width="95%" />
</p>

#### Profile Settings
Operator credentials, API keys, and notification preferences.
<p align="center">
  <img src="screenshots/19_profile_settings.png" alt="Profile Settings" width="95%" />
</p>

---

## Core Capabilities & Architecture

```mermaid
flowchart TD
    subgraph Ingestion["1. Multi-Signal Security Telemetry"]
        K8s["Live Kubernetes API & PSS"]
        Trivy["Trivy Vulnerability Engine"]
        Logs["Pod Logs & K8s Warning Events"]
        Git["Gitleaks CI/CD Secret Gates"]
    end

    subgraph Intelligence["2. CloudGuard Security Brain"]
        Posture["Posture Engine (0-100 Score)"]
        AttackPath["Multi-Hop Attack Path Graph"]
        Gemini["AI Incident Correlator (Gemini 2.5)"]
        Compliance["Compliance Engine (CIS / NIST / PCI)"]
    end

    subgraph Remediation["3. Automated Remediation & DevSecOps"]
        Diff["Unified Diff Generator"]
        DryRun["Server-Side Dry-Run Validation"]
        HumanApproval["Human-in-the-Loop Sign-off"]
        Deploy["Live Cluster Patching"]
    end

    Ingestion --> Intelligence
    Intelligence --> Remediation
```

### 1. Intelligent Security Posture Engine
- Evaluates live cluster state against **Pod Security Standards (PSS)**, RBAC escalation vectors, and missing network policies.
- Explainable mathematical posture formula:
  $$\text{Score} = \max\left(0, 100 - (15 \times \text{Critical} + 8 \times \text{High} + 3 \times \text{Medium} + 1 \times \text{Low})\right)$$
- Color-coded ratings (A: 90–100, B: 75–89, C: 60–74, D: 40–59, F: <40).

### 2. Advanced Vulnerability Intelligence
- Trivy-backed container image vulnerability scanner with CVE severity breakdowns.
- Contextual risk calculation factoring runtime network exposure and container privilege:
  $$\text{Contextual Risk} = \text{CVSS} \times (1.0 + 0.3 \times \text{Exposed} + 0.4 \times \text{Privileged})$$
- Fixable-now filtering, CVE search, and one-click security exports.

### 3. Kubernetes Attack Path Analysis
- Multi-hop traversal visualizer mapping complete lateral kill-chains:
  $$\text{External Ingress / LB} \longrightarrow \text{Vulnerable Workload Pod} \longrightarrow \text{Mounted ServiceAccount} \longrightarrow \text{Over-privileged ClusterRole} \longrightarrow \text{Target Secrets / etcd}$$
- Pinpoints critical attack choke-points to neutralize multi-hop lateral movement vectors with minimal disruption.

### 4. AI-Powered Incident Correlation & Investigation
- Correlates Kubernetes Warning events (`CrashLoopBackOff`, `OOMKilled`, `ImagePullBackOff`, `FailedScheduling`) with live pod logs.
- Integrated **Gemini 2.5** investigation engine synthesizes root causes, blast radii, chronological failure sequences, and actionable remediation steps.

### 5. Intelligent Remediation Center with Server-Side Dry-Run
- Generates corrective YAML manifests that eliminate identified vulnerabilities while preserving original workload specs.
- Validates syntax and admission controller acceptance using Kubernetes server-side dry-run (`kubectl apply --dry-run=server`).
- Built-in unified diff viewer with mandatory human approval confirmation before patch execution.

### 6. Continuous Compliance Engine
- Automated compliance evaluation against industry security benchmarks:
  - **CIS Kubernetes Benchmark v1.8** (Control plane, worker node security, policies, RBAC).
  - **NIST SP 800-190** Application Container Security Guide.
  - **PCI-DSS v4.0** Requirements 6 and 7 (Container isolation and least-privilege access control).

### 7. DevSecOps CI/CD Integration
- Shift-left quality gates with automated secret interception (Gitleaks).
- Pre-configured GitHub Actions and GitLab CI pipeline workflows.
- Webhook trigger endpoint to block non-compliant PRs before deployment.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | React 18, TypeScript, Vite 6, TailwindCSS 3.4, Framer Motion, TanStack Query, Recharts, Heroicons |
| **Backend API** | Python 3.11, FastAPI, SQLAlchemy 2.0 (Async), Pydantic v2, Uvicorn |
| **Data & Cache** | PostgreSQL 16 (AsyncPG), Redis 7 (Aioredis) |
| **AI Engine** | Google Gemini 2.5 / Google Generative AI Python SDK |
| **Security Tooling** | Trivy, Gitleaks, Falco, CIS K8s Benchmarks |
| **Deployment** | Docker Compose, Multi-Stage Dockerfiles, Nginx Reverse Proxy |

---

## Project Structure

```
CloudGuard/
├── backend/                        # FastAPI Backend Application
│   ├── app/
│   │   ├── api/v1/endpoints/       # REST API Endpoints (CloudGuard, K8s, AI, Auth)
│   │   ├── core/                   # Configuration, Database, Security & Redis setup
│   │   ├── models/                 # SQLAlchemy ORM Models
│   │   ├── schemas/                # Pydantic Request/Response Schemas
│   │   └── services/               # Remediation Planner, Posture, Gemini AI services
│   ├── tests/                      # Pytest backend test suite (126 passing tests)
│   ├── Dockerfile                  # Production backend container definition
│   └── requirements.txt            # Python dependencies
├── frontend/                       # React 18 + TypeScript Frontend
│   ├── src/
│   │   ├── components/             # Security, Monitoring, Deploy, Kubernetes views
│   │   │   ├── common/             # DualSidebarLayout, Navigation, CommandPalette
│   │   │   ├── monitoring/         # MonitoringDashboard, LogExplorerView
│   │   │   └── security/           # AttackPathView, CloudGuardDashboard, RemediationModal
│   │   ├── contexts/               # AuthContext, ThemeContext, ClusterContext
│   │   ├── services/               # API clients (cloudguardApi, api, prometheusApi)
│   │   └── styles/                 # Vichy color tokens & TailwindCSS setup
│   ├── Dockerfile                  # Multi-stage production Nginx container
│   ├── package.json                # Frontend dependencies
│   └── tailwind.config.js          # Custom Vichy theme configuration
├── screenshots/                    # Complete application interface screenshots (19 pages)
├── docker-compose.yml              # Multi-container orchestration definition
├── .env.example                    # Environment configuration template
└── README.md                       # Comprehensive platform documentation
```

---

## Quick Start & Installation

CloudGuard runs with isolated ports, database instances, and network namespaces to prevent interference with other local services.

### Default Port Allocations

| Component | Container Name | Port Mapping | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Web UI** | `cloudguard-frontend` | `http://localhost:3001` | CloudGuard Web Application |
| **Backend API Engine** | `cloudguard-backend` | `http://localhost:8001` | FastAPI REST & WebSocket Endpoints |
| **PostgreSQL Database** | `cloudguard-postgres` | `localhost:5433` | Isolated DB: `cloudguard_db` |
| **Redis Cache** | `cloudguard-redis` | `localhost:6380` | High-performance cache & pub/sub |

### 1. Clone the Repository

```bash
git clone https://github.com/nayanaastakar/CloudGuard-An-AI-Assisted-Cloud-Native-DevSecOps-Monitoring-and-Intelligent-Remediation-Platform.git
cd CloudGuard-An-AI-Assisted-Cloud-Native-DevSecOps-Monitoring-and-Intelligent-Remediation-Platform
```

### 2. Configure Environment

```bash
cp .env.example .env
```
Edit `.env` and replace every `replace-with-...` value with a unique local secret. Generate URL-safe values with Python:
```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```
Use separate generated values for `SECRET_KEY`, `POSTGRES_PASSWORD`, `DEFAULT_ADMIN_PASSWORD`, and `FALCO_WEBHOOK_SECRET`. Keep `K8S_SKIP_TLS_VERIFY=false`; set it to `true` only for a trusted local development cluster with an incompatible certificate. Production startup rejects disabled Kubernetes TLS verification.
```env
# Google Gemini AI Key for intelligent incident correlation
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Launch via Docker Compose

```bash
# Build and start all 4 services in detached mode
docker compose up -d --build
```

### 4. Verify Service Health

```bash
# Check container status
docker compose ps

# Test Backend API health
curl http://localhost:8001/health

# Access the CloudGuard Web Dashboard
# Open http://localhost:3001 in your browser
```

---

## API Documentation

CloudGuard exposes comprehensive RESTful APIs mounted under `/api/v1/cloudguard`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/cloudguard/posture` | Live cluster posture score, risk grades, and security findings |
| `GET` | `/api/v1/cloudguard/vulnerabilities/scan` | Trivy container image scan with contextual risk scoring |
| `GET` | `/api/v1/cloudguard/attack-paths` | Predictive multi-hop attack graphs and mitigation choke-points |
| `GET` | `/api/v1/cloudguard/incidents` | Gemini 2.5 correlated security incidents and timeline |
| `POST`| `/api/v1/cloudguard/remediation/plan` | Generate corrective YAML with server-side dry-run validation |
| `POST`| `/api/v1/cloudguard/remediation/apply` | Apply human-approved remediation manifest to live cluster |
| `GET` | `/api/v1/cloudguard/compliance` | Benchmark evaluation for CIS K8s 1.8, NIST SP 800-190, PCI-DSS |
| `POST`| `/api/v1/ai/summarize-logs` | AI automated incident summary and error pattern extraction |

Interactive Swagger / OpenAPI documentation is accessible at `http://localhost:8001/docs`.

---

## Verification & Test Results

Run the backend and frontend tests from the current source tree:

```bash
cd backend && python -m pytest
cd frontend && npm test -- --run
```

Test results are specific to the source snapshot and environment in which they ran. Passing tests do not verify live-cluster RBAC, production secrets, or deployed integrations. See [Security-sensitive deployment configuration](docs/security-hardening.md) before configuring a deployment.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

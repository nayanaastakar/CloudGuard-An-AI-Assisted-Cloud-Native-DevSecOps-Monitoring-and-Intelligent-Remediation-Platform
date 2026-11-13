# CloudGuard Project Handover & Work-Done Report

**Official Project Title:**  
`CloudGuard: An AI-Assisted Cloud-Native DevSecOps Monitoring and Intelligent Remediation Platform`

**Handover Timestamp:** November 13, 2026  
**Archive Generated:** `D:\Projects\cloudguard\CloudGuard-Complete-Project.zip` (14.72 MB, 479 normalized files)

---

## 1. Project Overview

### Problem Statement
Modern cloud-native Kubernetes environments suffer from siloed security tooling: infrastructure inventory is isolated from vulnerability scanners, monitoring metrics do not feed runtime security events, and AI recommendations often lack grounded operational evidence or safety controls. Operators are overwhelmed by uncurated alert noise and lack automated, safe, and audited mechanisms to remediate verified cluster security findings without risking workload disruption.

### Project Objectives
1. **Unified Infrastructure & Asset Discovery:** Continuously discover and correlate multi-tier cluster entities (clusters, nodes, namespaces, workloads, pods, containers) with deterministic data provenance.
2. **Contextual Security Posture & Vulnerability Intelligence:** Integrate Trivy, Prowler, Kyverno, and Cosign into an explainable scoring formula prioritizing real exploitability over raw CVE counts.
3. **Multi-Source Observability & Threat Protection:** Correlate Prometheus metrics, Loki logs, and Falco/Falcosidekick runtime anomaly events with MITRE ATT&CK categorization.
4. **Graph-Driven Attack Path Traversal:** Graph relationships between entry points, pods, service accounts, and secrets to identify privilege escalation and lateral movement vectors.
5. **Safe AI Investigation:** Use Gemini LLM abstraction strictly with redacted, bounded evidence bundles, preventing prompt injection and enforcing structured fact-vs-hypothesis outputs.
6. **Controlled Remediation Lifecycle:** Execute reversible YAML remediation plans protected by automated admission dry-run, four-eyes dual reviewer approval, allowlisted commands, and an immutable audit trail.
7. **Shift-Left DevSecOps Pipeline:** Intercept secrets (Gitleaks) and verify supply-chain provenance (Cosign) at CI/CD pull request boundaries.

### Overall Architecture
```
                                +-----------------------------------+
                                |    CloudGuard Web UI (React/TS)    |
                                |       Port 3001 (Nginx Proxy)     |
                                +-----------------+-----------------+
                                                  |
                                                  v
                                +-----------------------------------+
                                |    CloudGuard Backend (FastAPI)   |
                                |            Port 8001              |
                                +-----+-------------+-------------+-+
                                      |             |             |
                                      v             v             v
+------------------------+  +---------+----+  +-----+-------+  +--+--------------------+
| External CLI Scanners  |  |  PostgreSQL  |  | Redis Cache |  | Live K8s Cluster API  |
| Trivy, Kyverno, Cosign |  |  Port 5433   |  |  Port 6380  |  | /home/cloudguard/.kube|
+------------------------+  +--------------+  +-------------+  +-----------------------+
```

### Technology Stack
- **Backend:** Python 3.11, FastAPI, SQLAlchemy 2.0 (asyncio), AsyncPG, Alembic, Pydantic v2, Google GenAI / Gemini SDK, PyTest.
- **Frontend:** React 18, TypeScript, Vite 6, Tailwind CSS, Heroicons, Framer Motion, TanStack Query v5.
- **Data & Cache:** PostgreSQL 16 (isolated on host port 5433), Redis 7 (isolated on host port 6380).
- **Tooling & Orchestration:** Trivy 0.58.0 (embedded in Docker), Kubectl, Helm 3, Docker Compose.

---

## 2. Existing Project Structure

```
D:\Projects\cloudguard\
├── backend\
│   ├── alembic\versions\           # 11 incremental migration scripts
│   ├── app\
│   │   ├── api\routes\             # API endpoints (cloudguard_routes.py, auth.py, kubernetes.py, etc.)
│   │   ├── core\                   # config.py, security.py, startup.py
│   │   ├── database\               # session.py (AsyncEngine, sessionmaker)
│   │   ├── models\                 # cloudguard_models.py (SQLAlchemy 2.0 models)
│   │   ├── schemas\                # Pydantic schemas (provenance.py, auth.py, etc.)
│   │   └── services\               # Domain services & engines (all 8 modules)
│   ├── tests\                      # 125 pytest test cases across 11 test modules
│   ├── Dockerfile                  # Multi-stage build with embedded Trivy 0.58.0, kubectl, helm
│   ├── entrypoint.sh               # Non-root migration & startup runner
│   └── requirements.txt            # Locked Python 3.11 dependencies
├── frontend\
│   ├── src\
│   │   ├── components\
│   │   │   ├── common\             # DualSidebarLayout, PageHeader, ProvenanceBadge
│   │   │   ├── security\           # CloudGuardDashboard, RemediationCenterView, AttackPathView, etc.
│   │   │   ├── monitoring\         # LogExplorerView, MonitoringDashboard
│   │   │   └── kubernetes\         # ClusterOverview, NodesView, WorkloadsView
│   │   ├── contexts\               # AuthContext, ThemeContext, ClusterContext
│   │   ├── services\               # api.ts, cloudguardApi.ts
│   │   └── App.tsx                 # Root router with Suspense & ProtectedRoute
│   ├── Dockerfile                  # Multi-stage build (Node.js 18 builder -> Nginx alpine)
│   ├── nginx.conf                  # Static file server with /api proxy pass to backend:8000
│   └── package.json                # Dependencies and build scripts
├── docker-compose.yml              # Complete 4-service isolated stack (3001, 8001, 5433, 6380)
├── .env.example                    # Clean environment configuration template (no secrets)
├── IMPLEMENTATION_STATUS.md        # Feature tracking matrix
└── PROJECT_PROGRESS.md             # Detailed engineering audit log
```

---

## 3. Completed Modules

### Module 1: Cloud Infrastructure & Asset Discovery
- **Functionality:** Real-time multi-tier discovery across clusters, nodes, namespaces, workloads (Deployments, StatefulSets, DaemonSets), pods, and containers with canonical data freshness tagging (`live`, `stale`, `demo`, `unavailable`).
- **Backend Services:** `app/services/asset_discovery_service.py`
- **API Endpoints:** `GET /api/v1/cloudguard/assets/inventory`
- **Frontend Components:** `AssetInventoryView.tsx`, `ProvenanceBadge.tsx`
- **Database Model:** `discovered_assets` (Migration: `007_provenance_and_assets.py`)
- **Tests:** `tests/test_provenance_and_scanners.py`
- **Known Limitations:** In offline clusters, falls back to deterministic demo topology.

### Module 2: Vulnerability & Security Posture Management
- **Functionality:** Contextual risk scoring formula:
  $$\text{Score} = 100 - (15 \times \text{Critical} + 8 \times \text{High} + 3 \times \text{Medium} + 1 \times \text{Low})$$
  Evaluates Pod Security Standards (HostPID, HostNetwork, privileged containers, writable root filesystems), RBAC bindings, and NetworkPolicy coverage. Orchestrates Trivy, Prowler, Kyverno, and Cosign.
- **Backend Services:** `app/services/security_posture_engine.py`, `app/services/scanner_orchestrator_service.py`, `app/services/vulnerability_intelligence_service.py`
- **API Endpoints:** `GET /api/v1/cloudguard/posture`, `GET /api/v1/cloudguard/scanners/health`, `GET /api/v1/cloudguard/sbom/packages`, `GET /api/v1/cloudguard/vulnerabilities/scan`
- **Frontend Components:** `CloudGuardDashboard.tsx`, `ScannerHealthAndSBOMView.tsx`, `VulnerabilityIntelligenceView.tsx`
- **Database Model:** `security_posture_history`, `security_findings`, `sbom_packages`
- **Tests:** `tests/test_security_service.py`, `tests/test_provenance_and_scanners.py`
- **Known Limitations:** Prowler and Kyverno currently run in simulated/demo fallback mode when local CLI binaries are not in container PATH. Trivy is live.

### Module 3: Cloud-Native Monitoring & Observability
- **Functionality:** Integrates Prometheus, Grafana, and Loki. Features cluster CPU/Memory time-series telemetry and LogQL stream querying with query boundary guards.
- **Backend Services:** `app/services/observability_service.py`
- **API Endpoints:** `GET /api/v1/cloudguard/monitoring/status`, `GET /api/v1/cloudguard/monitoring/metrics`, `GET /api/v1/cloudguard/monitoring/logs`
- **Frontend Components:** `LogExplorerView.tsx`, `MonitoringDashboard.tsx`
- **Tests:** `tests/test_observability_and_runtime.py`
- **Known Limitations:** Connects to live Prometheus/Loki endpoints if configured via environment variables; otherwise generates deterministic synthetic time-series and log entries.

### Module 4: Runtime Threat Detection & Protection
- **Functionality:** Webhook ingestion receiver for Falco and Falcosidekick. Implements in-memory ring-buffer deduplication, priority filtering, and MITRE ATT&CK taxonomy classification (e.g. Privilege Escalation, Defense Evasion, Execution).
- **Backend Services:** `app/services/runtime_threat_service.py`
- **API Endpoints:** `POST /api/v1/cloudguard/runtime/falco/webhook`, `GET /api/v1/cloudguard/runtime/events`
- **Frontend Components:** `RuntimeThreatView.tsx`
- **Database Model:** `runtime_threat_events`
- **Tests:** `tests/test_observability_and_runtime.py`
- **Known Limitations:** Webhook receiver is fully operational. In dev environments without eBPF driver, simulated test alerts can be generated via the UI.

### Module 5: Security Intelligence & Attack Path Analysis
- **Functionality:** PostgreSQL-backed security relationship graph. Uses cycle-safe bounded depth-first traversal to uncover lateral movement attack paths (e.g., Ingress -> Pod -> ServiceAccount -> Secret) with risk scoring and 360° asset context inspection.
- **Backend Services:** `app/services/security_graph_service.py`
- **API Endpoints:** `GET /api/v1/cloudguard/graph/data`, `GET /api/v1/cloudguard/graph/asset-context`, `GET /api/v1/cloudguard/graph/attack-paths`
- **Frontend Components:** `SecurityGraphView.tsx`, `AttackPathView.tsx`
- **Database Model:** `security_graph_nodes`, `security_graph_relationships` (Migration: `008_security_graph.py`)
- **Tests:** `tests/test_security_graph.py`
- **Known Limitations:** Edge rendering in UI uses interactive CSS cards; D3 canvas graph view can be enhanced in future iterations.

### Module 6: AI-Assisted Incident Investigation
- **Functionality:** Provider-agnostic AI investigation engine backed by Google Gemini API. Curates bounded evidence bundles, sanitizes credentials with regex secret redaction, neutralizes prompt injection attempts, and strictly validates structured Pydantic report outputs separating verified facts from probabilistic hypotheses.
- **Backend Services:** `app/services/ai_investigation_engine.py`, `app/services/ai_analysis_service.py`
- **API Endpoints:** `GET /api/v1/cloudguard/investigations`, `GET /api/v1/cloudguard/investigations/{id}`, `POST /api/v1/cloudguard/investigations/analyze`
- **Frontend Components:** `IncidentInvestigationView.tsx`
- **Database Model:** `ai_investigations`
- **Tests:** `tests/test_ai_investigation.py`
- **Known Limitations:** When no `GEMINI_API_KEY` is supplied, falls back seamlessly to deterministic rule-based synthesis.

### Module 7: Intelligent Remediation & Controlled Automation
- **Functionality:** Comprehensive 13-state remediation lifecycle:
  `draft` -> `dry_run_pending` -> `validated` / `validation_failed` -> `pending_approval` -> `approved` / `rejected` -> `executing` -> `completed` / `execution_failed` -> `verifying` -> `verified` -> `rolled_back`.
  Enforces server-side admission dry-run (`kubectl apply --dry-run=server`), four-eyes approval check (creator cannot approve sensitive plans), allowlisted command boundaries, post-change verification, and automated rollback to pre-change snapshots.
- **Backend Services:** `app/services/remediation_engine.py`
- **API Endpoints:** `GET /api/v1/cloudguard/remediations/lifecycle-plans`, `POST .../approve`, `POST .../reject`, `POST .../execute`, `POST .../rollback`
- **Frontend Components:** `RemediationCenterView.tsx`
- **Database Model:** `remediation_plans`, `remediation_audit_logs`
- **Tests:** `tests/test_remediation_lifecycle.py`
- **Known Limitations:** Cluster execution requires valid kubeconfig or in-cluster service account; in offline environments, simulated admission dry-run succeeds safely.

### Module 8: DevSecOps CI/CD Integration
- **Functionality:** Shift-left security pipeline orchestrator coordinating Gitleaks secret detection (with token masking), Trivy SBOM vulnerability scans, Kyverno IaC policy checks, and Cosign digital signature verification. Enforces automated blocking gates for pull requests.
- **Backend Services:** `app/services/devsecops_pipeline_service.py`
- **API Endpoints:** `GET /api/v1/cloudguard/devsecops/pipelines`, `POST /api/v1/cloudguard/devsecops/pipelines/trigger`, `GET /api/v1/cloudguard/devsecops/secrets/scan`, `GET /api/v1/cloudguard/devsecops/signatures/verify`
- **Frontend Components:** `DevSecOpsPipelineView.tsx`
- **Tests:** `tests/test_devsecops_pipeline.py`
- **Known Limitations:** Cosign signature verification checks local `cosign.pub` key when Cosign CLI is present, with deterministic fallback for test images.

---

## 4. Docker Implementation

All services run inside isolated Docker networks with strictly preserved ports:

| Service | Container Name | Image | Host Port | Container Port | Health Check |
|---|---|---|---|---|---|
| **Frontend** | `cloudguard-frontend` | `cloudguard-frontend:latest` | `3001` | `80` | Nginx HTTP |
| **Backend** | `cloudguard-backend` | `cloudguard-backend:latest` | `8001` | `8000` | `curl -f http://localhost:8000/health` |
| **PostgreSQL** | `cloudguard-postgres` | `postgres:16-alpine` | `5433` | `5432` | `pg_isready -U cloudguard -d cloudguard_db` |
| **Redis** | `cloudguard-redis` | `redis:7-alpine` | `6380` | `6379` | `redis-cli ping` |

### Startup & Build Commands
```powershell
Set-Location D:\Projects\cloudguard
docker compose up -d --build
docker compose ps
```

### Verified Running Status
All 4 containers are currently running, healthy, and isolated from KubeSight (which remains untouched on ports 3000, 8000, 5432, 6379).

---

## 5. Database & Migrations

- **Database Engine:** PostgreSQL 16 (AsyncPG driver)
- **Alembic Revisions Chain:**
  1. `001_initial_user_tables`: Users, roles, authentication.
  2. `002_add_oauth_fields_to_users`: GitHub/Google OAuth identities.
  3. `003_add_settings_tables`: System and integration settings.
  4. `004_add_agents_and_execution_mode`: Execution mode configuration.
  5. `005_add_test_results_and_coverage`: Test telemetry records.
  6. `006_add_managed_integration_fields`: External integration tokens.
  7. `078b9fb1e2f9_add_pipeline_incident_and_timeline_`: CI pipeline runs and incidents.
  8. `8dfcaf130a4a_add_pipeline_approval_system`: Multi-stage approval gates.
  9. `38db47245c05_add_user_permissions_table_and_use_`: Custom granular RBAC permissions.
  10. `007_provenance_and_assets`: Discovered assets and SBOM packages.
  11. `008_security_graph`: Security graph nodes and relationships.
- **Persistence:** Volume `cloudguard_pgdata` mounts to `/var/lib/postgresql/data`. Existing data is preserved without dropping or truncating tables.

---

## 6. AI Implementation (Gemini Engine)

- **Provider Abstraction:** Implemented in `ai_investigation_engine.py` and `ai_analysis_service.py` using `google-generativeai` with clean fallback.
- **Evidence Bundling:** Aggregates findings, pod events, container logs, and graph relationships into a strictly bounded context bundle (max 8,000 characters).
- **Secret Redaction:** Automatically scans and masks AWS keys, GitHub tokens, Bearer tokens, and RSA private keys before sending to LLM.
- **Prompt Injection Defense:** Scans input queries for delimiter escape attempts, system role overrides, and suspicious injection patterns.
- **Fact vs. Hypothesis:** Output JSON format strictly segregates verified findings (`findings: []`) from probabilistic reasoning (`hypothesis: ""` and `confidence_score: float`).

---

## 7. Security Implementation

- **Authentication:** JWT access tokens (60 min expiry) and refresh tokens (7 days expiry) signed with HS256. Password hashing via Argon2id / bcrypt.
- **RBAC:** Enforces 4 role levels: `admin`, `operator`, `developer`, `viewer`.
- **Data Provenance:** Every response carries provenance metadata (`live`, `stale`, `demo`, `unavailable`) with TTL tracking.
- **Four-Eyes Approval:** Sensitive remediation plans enforce strict separation of duties (creator cannot self-approve).
- **Audit Logging:** Every remediation status transition creates an immutable audit entry recording `action`, `performed_by`, `timestamp`, and `details`.

---

## 8. GitHub Repository Reuse Analysis

| Repository | Status in CloudGuard | Details |
|---|---|---|
| `aquasecurity/trivy` | **Integrated (Live)** | Binary embedded in backend container; SBOM & vulnerability parser operational. |
| `falcosecurity/falco` & `falcosidekick` | **Integrated (Live Webhook)** | Webhook receiver (`POST /runtime/falco/webhook`) and MITRE classifier live. |
| `prometheus/prometheus` & `grafana/loki` | **Integrated (Live Client)** | Metric collector & LogQL explorer connected with fallback. |
| `kyverno/kyverno` | **Integrated (IaC Rules)** | Admission policy checks (PSS Restricted) implemented in DevSecOps pipeline. |
| `sigstore/cosign` | **Integrated (Live Verification)** | Container signature verifier & OIDC identity validator integrated in Phase 8. |
| `prowler-cloud/prowler` | **Partially Integrated** | Health check & CIS benchmark schema supported; full scan runs in demo fallback. |
| `k8sgpt-ai/k8sgpt` | **Reference Architecture** | Investigation error analysis patterns referenced in AI investigation engine. |
| `deepfence/ThreatMapper` | **Reference Architecture** | Attack graph data schema referenced in `security_graph_service.py`. |
| `robusta-dev/robusta` | **Reference Architecture** | Automated remediation actions & trigger patterns referenced in `remediation_engine.py`. |
| `argoproj/argo-cd` & `hashicorp/terraform` | **Configured** | Deployment view stubs and configuration files present. |

---

## 9. Actual Testing Results

- **Backend PyTest Suite:** **125 passed, 0 failed, 0 skipped** (Verified on Python 3.11.9):
  - `test_ai_investigation.py`: 6 passed
  - `test_devsecops_pipeline.py`: 5 passed
  - `test_remediation_lifecycle.py`: 6 passed
  - `test_security_graph.py`: 8 passed
  - `test_provenance_and_scanners.py`: 8 passed
  - `test_observability_and_runtime.py`: 6 passed
  - Core API, Auth, K8s, Health: 86 passed
- **Frontend Production Build:** **2,942 modules transformed clean** (`vite build` in 21.60s with exit code 0).
- **Live Container API Verification:**
  - `GET /api/v1/cloudguard/remediations/lifecycle-plans` -> `200 OK`
  - `GET /api/v1/cloudguard/investigations` -> `200 OK`
  - `GET /api/v1/cloudguard/graph/data` -> `200 OK`
  - `GET /api/v1/cloudguard/runtime/events` -> `200 OK`
  - `GET /api/v1/cloudguard/posture` -> `200 OK` (Score: 59)
- **Trivy Scanner Verification:** Version 0.58.0 verified operational inside `cloudguard-backend` with downloaded vulnerability database.

---

## 10. Known Issues & Technical Debt

1. **Minikube Certificate Path Warning:** In Docker Desktop on Windows, the mounted `~/.kube/config` references local Windows file paths (`C:\Users\HP\.minikube\...`), causing K8s client init warnings in container logs when cluster is stopped. Safe demo fallback handles this cleanly.
2. **Local Prowler/Kyverno CLI Installation:** Prowler and Kyverno currently run in simulated fallback when invoked outside environments where their CLI binaries are installed.
3. **Chunk Size Warnings in Frontend:** Three chunks (`index.js`, `KubernetesResourcesView.js`, `vendor-charts.js`) exceed 600 kB after minification. Optimization via Rollup manual chunking is recommended in the next phase.

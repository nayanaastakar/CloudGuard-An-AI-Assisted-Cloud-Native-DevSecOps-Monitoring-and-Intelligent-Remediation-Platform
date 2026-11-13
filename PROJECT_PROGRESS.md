# Project Progress: CloudGuard

**Official Project Title:** CloudGuard: An AI-Assisted Cloud-Native DevSecOps Monitoring and Intelligent Remediation Platform  
**Target Ports:** Frontend: 3001 | Backend: 8001 | PostgreSQL: 5433 | Redis: 6380  
**Phases Completed:** Phases 1 through 8 (DevSecOps CI/CD Integration)

---

## Detailed Milestone Delivery Report

### 1. Phase 8 DevSecOps CI/CD Integration
- **Unified Toolchain Orchestrator:**
  - Implemented `DevSecOpsPipelineService` (`backend/app/services/devsecops_pipeline_service.py`) orchestrating:
    - Gitleaks secret detection with automated high-entropy credential masking.
    - Trivy container image scanning and Software Bill of Materials (SBOM) dependency evaluation.
    - Kyverno CLI IaC policy evaluation (PSS Restricted admission policies).
    - Cosign digital signature and OIDC identity verification.
  - Multi-stage gate evaluation blocking build/deployment upon critical secret leaks or unverified supply-chain artifacts.
- **REST Endpoints Registered:**
  - `GET /api/v1/cloudguard/devsecops/pipelines` (Execution history and stage results)
  - `GET /api/v1/cloudguard/devsecops/pipelines/{pipeline_id}` (Single execution inspection)
  - `POST /api/v1/cloudguard/devsecops/pipelines/trigger` (Trigger on-demand pipeline security evaluation)
  - `GET /api/v1/cloudguard/devsecops/secrets/scan` (Gitleaks scan with masked secrets)
  - `GET /api/v1/cloudguard/devsecops/signatures/verify` (Cosign signature validation)
- **Frontend Dashboard Screen:**
  - Updated `DevSecOpsPipelineView.tsx` with:
    - Live Pipeline Runs inspector and multi-stage timeline.
    - Security gate policy configuration with toggleable blocking thresholds.
    - Redacted Gitleaks credential viewer.
    - Interactive Cosign container signature and signer certificate inspector.
    - Copyable GitHub Actions workflow integration snippet.
- **Verification:**
  - **125 pytest tests passed** (including 5 DevSecOps pipeline tests).
  - Frontend production build passed cleanly (`vite build` in 14.19s).


### 2. Database & Alembic Migrations
- **Created Migration:** `backend/alembic/versions/007_provenance_and_assets.py` (Revises `38db47245c05`).
- **Tables Added:**
  - `discovered_assets`: Stores infrastructure nodes, namespaces, workloads, pods, provenance, and relationships.
  - `sbom_packages`: Stores SBOM dependency packages, licenses, and vulnerability metrics.

### 3. Test Suite Verification
- **Total Test Cases:** **94 passed, 0 failed, 0 skipped**.
- **Coverage Areas:**
  - Provenance assignment and TTL expiration.
  - Stale data detection.
  - Explicit live vs demo separation.
  - Unavailable system error handling.
  - Scanner health schema normalization.
  - Trivy vulnerability parsing.
  - SBOM extraction.
  - Asset inventory normalization.
  - All 86 existing API, authentication, RBAC, and Kubernetes route tests.

### 4. Frontend Production Build Verification
- **Command:** `npm run build` (`vite build`)
- **Status:** **Exit code 0** (completed in 14.94s).
- **Modules Transformed:** 2,939 modules.
- **Output:** Clean production bundle in `frontend/dist/`.


---

## Phase 5 Delivery Report: Security Intelligence and Attack Path Analysis

### 1. Security Graph Architecture & Storage
- **PostgreSQL Graph Schema:** Added `security_graph_nodes` and `security_graph_relationships` tables using incremental Alembic migration `008_security_graph.py` (down revision: `007_provenance_and_assets`).
- **Composite Unique Indexes:** Unique constraint `(source_node_id, target_node_id, relationship_type)` to enforce duplicate prevention and fast path traversal.
- **Node Entities Represented:** Clusters, Nodes, Namespaces, Workloads, Pods, Containers, Container Images, Vulnerabilities (CVEs), Service Accounts, Roles, Permissions, Network Endpoints, Exposed Services, and Runtime Threat Events.
- **Evidenced Relationship Types:**
  - `EXPOSES`: Ingress rule pointing to ClusterIP service.
  - `CONNECTS_TO`: Service selector mapping to workload pod template.
  - `BELONGS_TO`: ReplicaSet / Pod owner references.
  - `RUNS_ON`: Pod spec container definitions.
  - `USES`: Container referencing specific image digest or service account token.
  - `CONTAINS_VULNERABILITY`: Verified Trivy SBOM package CVE.
  - `HAS_PERMISSION_TO_ACCESS`: ClusterRoleBinding mapping service account to role.
  - `CAN_REACH`: Network connectivity or RBAC permission granting access to sensitive secrets.
  - `TRIGGERS`: Runtime Falco alert fired inside running container.

### 2. Multi-Hop Attack Path Analysis & Risk Scoring
- **Cycle-Protected Bounded Traversal:** `SecurityGraphEngine.compute_attack_paths` implements breadth-first search starting from external network endpoints with visited-node sets to prevent cycles and an explicit maximum depth (`max_depth=5` default).
- **Explainable Scoring Formula:**
  - Base Internet exposure: 3.5
  - Target Asset Criticality (e.g. cluster secrets, node root breakout): +2.5
  - Container execution flags (privileged/root): +1.5
  - Hop path chaining factor: `min(hop_count * 0.4, 1.8)`
  - Deterministic score clamped between 0.0 and 9.9.
  - Severity classification: CRITICAL (>= 8.5), HIGH (>= 7.0), MEDIUM (< 7.0).

### 3. API Endpoints Exposed
- `GET /api/v1/cloudguard/graph/data`: Graph nodes and edges with type filtering, search, and provenance.
- `GET /api/v1/cloudguard/graph/asset-context`: 360-degree security context for an individual asset.
- `GET /api/v1/cloudguard/graph/attack-paths`: Bounded attack path analysis results with hop evidence.

### 4. Frontend Screens
- **`SecurityGraphView.tsx` (`/graph`):** Interactive security graph viewer, entity type selector, search bar, and 360-degree security context drawer.
- **`AttackPathView.tsx` (`/attack-paths`):** Hop-by-hop visual flow of lateral movement with mitigations and investigation actions.

### 5. Verification
- **Backend Pytest Suite:** **108 passed, 0 failed, 0 skipped**.
- **Frontend Production Build:** **Exit code 0** (vite build completed in 19.47s, 2,942 modules transformed into `dist/`).
- **KubeSight Isolation:** Ports 3000, 8000, 5432, 6379 remain untouched.


---

## Phase 6 Delivery Report: AI-Assisted Incident Investigation

### 1. AI Architecture & Evidence Bundle Construction
- **Service Implemented:** `AIInvestigationEngine` in `backend/app/services/ai_investigation_engine.py`.
- **Evidence Bundle Extractor:** Dynamically aggregates records across Falco runtime webhooks, PostgreSQL security graph context, Trivy CVE vulnerability scans, and Kubernetes RBAC bindings.
- **Evidence Size & Normalization:** Evidence bundles are capped at 15 items to prevent prompt bloat and fit within the 8 GB laptop memory constraints.

### 2. Security Boundaries & Secret Redaction
- **Regex Redaction Engine:** Automatically detects and masks API tokens, bearer authorization headers, passwords, JWT strings (`ey...`), and private keys before passing them to the AI prompt context.
- **Prompt Injection Defense:** Strips instructions such as `ignore all previous instructions`, `bypass sandbox`, or `system: you are now`.
- **Analyst-Only Execution Boundary:** The AI model is strictly restricted to generating diagnostic assessments, hypotheses, and recommendations; it possesses zero execution privileges to run shell scripts, run `kubectl`, or mutate infrastructure.

### 3. Structured Pydantic Output Validation
- Enforces strict JSON responses parsed into `StructuredInvestigationReport`:
  - `investigation_id`, `title`, `incident_summary`, `severity_assessment`
  - `confirmed_facts` vs `hypotheses`
  - `supporting_evidence_ids` (strictly validated against evidence bundle IDs)
  - `affected_assets`, `root_cause_possibilities`, `attack_path_references`
  - `risk_explanation`, `recommended_investigation_steps`, `recommended_remediation`
  - `confidence`, `uncertainty`, `missing_evidence`, and `provider_metadata`
- Deterministic fallback synthesis handles API key absence, provider timeout, or quota exhaustion without application failure.

### 4. API Endpoints & Frontend Screen
- **Endpoints:**
  - `GET /api/v1/cloudguard/investigations`: Lists all completed and active dossiers.
  - `GET /api/v1/cloudguard/investigations/{id}`: Detailed investigation report and evidence bundle.
  - `POST /api/v1/cloudguard/investigations/analyze`: Triggers on-demand AI analysis.
- **Frontend Screen (`IncidentInvestigationView.tsx`):**
  - Enterprise investigation workspace displaying confirmed facts, working hypotheses, confidence scores, and corrective remediation steps.
  - Curated Evidence Bundle explorer inspecting original telemetry, sources, and provenance.
  - "New AI Investigation" modal allowing targeted analysis on workloads, threats, CVEs, or attack paths.

### 5. Verification Results
- **Backend Pytest Suite:** **114 passed, 0 failed, 0 skipped** (including 6 new tests in `backend/tests/test_ai_investigation.py`).
- **Frontend Build:** `vite build` completed in 9.77s with **0 errors**.
- **KubeSight Boundary:** Unaffected.


---

## Phase 7 Delivery Report: Intelligent Remediation & Controlled Automation

### 1. Remediation Architecture & Complete Lifecycle
- **Engine Implemented:** `RemediationEngine` in `backend/app/services/remediation_engine.py`.
- **Enforced Lifecycle Flow:**
  `Recommendation -> Plan Generation -> Admission Dry-Run Validation -> Four-Eyes Approval -> Controlled Execution -> Post-Change Verification -> Rollback (if required) -> Audit Logging`.
- **Lifecycle States:** `DRAFT`, `PENDING_VALIDATION`, `VALIDATION_FAILED`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `EXECUTING`, `EXECUTION_FAILED`, `VERIFYING`, `COMPLETED`, `ROLLBACK_REQUIRED`, `ROLLED_BACK`, `CANCELLED`.

### 2. Four-Eyes Policy & RBAC Security Controls
- **Self-Approval Prevention:** For sensitive operations (e.g. `is_sensitive=True`), the plan creator (`created_by`) is strictly prohibited from approving their own remediation plan. An independent second reviewer is mandated.
- **Action Allowlists & Forbidden Patterns:** Blocks dangerous destructive commands (`delete namespace`, `delete persistentvolume`, `drop database`, `rm -rf`).
- **Explicit Dry-Run Distinction:** If live Kubernetes admission dry-run (`kubectl apply --dry-run=server`) fails or the cluster is offline, validation is clearly flagged as `Local-Only Validation Succeeded (Cluster API Offline)` instead of masquerading as live cluster admission.

### 3. Verification & Reversible Rollback
- **Post-Change Verification:** Confirms container `runAsNonRoot=true`, `readOnlyRootFilesystem=true`, and zero admission violations before transitioning to `COMPLETED`.
- **Pre-Change Snapshot & Rollback:** Automatically captures pre-change manifests; rollback safely restores previous configurations with a recorded audit trail.

### 4. API Endpoints & Frontend Screen
- **Endpoints:**
  - `GET /api/v1/cloudguard/remediations/lifecycle-plans`: Lists remediation plans with status filtering.
  - `GET /api/v1/cloudguard/remediations/lifecycle-plans/{id}`: Detailed plan with YAML diff patch and audit entries.
  - `POST /api/v1/cloudguard/remediations/lifecycle-plans`: Creates new plan with dry-run validation.
  - `POST .../{id}/approve`: Approves plan with four-eyes enforcement.
  - `POST .../{id}/reject`: Rejects plan with rationale.
  - `POST .../{id}/execute`: Executes approved plan with post-change verification.
  - `POST .../{id}/rollback`: Rolls back to pre-change snapshot.
- **Frontend Screen (`RemediationCenterView.tsx`):**
  - KPI overview strip (pending, approved, completed, rolled back).
  - Side-by-side colorized unified YAML diff viewer.
  - Action buttons (`Approve Plan`, `Execute Change`, `Rollback to Snapshot`).
  - Immutable audit ledger tracking who performed each lifecycle state transition.

### 5. Verification Results
- **Backend Pytest Suite:** **120 passed, 0 failed, 0 skipped** (including 6 new tests in `backend/tests/test_remediation_lifecycle.py`).
- **Frontend Build:** `vite build` completed in 8.53s with **0 errors**.
- **KubeSight Boundary:** Unaffected.

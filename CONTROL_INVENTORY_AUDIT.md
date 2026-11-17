# CloudGuard Interactive Control & Navigation Audit Inventory

**Project:** CloudGuard: An AI-Assisted Cloud-Native DevSecOps Monitoring and Intelligent Remediation Platform  
**Audit Date:** November 16, 2026  
**Auditor:** DevSecOps Automated Quality Gate  

---

## 1. Sidebar Navigation Elements (Level-1 & Level-2)

| # | Sidebar Navigation Item | Target Route | Expected Highlight Behavior | Click Action | Test Coverage | Verification Result |
|---|---|---|---|---|---|---|
| 1 | **Security Posture** (`ShieldCheckIcon`) | `/` | Active blue gradient when path is `/` or `/security` | Navigates to CloudGuard Dashboard | `DualSidebarLayout.test.tsx` | **PASS** |
| 2 | **Asset Discovery** (`ServerStackIcon`, Badge: `Inv`) | `/assets` | Active blue gradient when path is `/assets` | Navigates to Multi-tier Asset Inventory | `DualSidebarLayout.test.tsx` | **PASS** |
| 3 | **Runtime Threat Detection** (`ShieldExclamationIcon`, Badge: `Falco`) | `/threats` | Active blue gradient when path is `/threats` or `/runtime` | Navigates to Falco Threat Monitor | `DualSidebarLayout.test.tsx` | **PASS** |
| 4 | **Security Graph** (`ServerStackIcon`, Badge: `360°`) | `/graph` | Active blue gradient when path is `/graph` or `/security-graph` | Navigates to 360° Relationship Graph | `DualSidebarLayout.test.tsx` | **PASS** |
| 5 | **Attack Path Analysis** (`ArrowsRightLeftIcon`, Badge: `Live`) | `/attack-paths` | Active blue gradient when path is `/attack-paths` | Navigates to Lateral Movement Graph | `DualSidebarLayout.test.tsx` | **PASS** |
| 6 | **AI Incident Investigation** (`SparklesIcon`, Badge: `AI`) | `/incidents` | Active blue gradient when path is `/incidents` | Navigates to AI Investigation Studio | `DualSidebarLayout.test.tsx` | **PASS** |
| 7 | **Vulnerability Intelligence** (`ShieldExclamationIcon`) | `/vulnerabilities` | Active blue gradient when path is `/vulnerabilities` | Navigates to Trivy CVE Explorer | `DualSidebarLayout.test.tsx` | **PASS** |
| 8 | **Scanner Health & SBOM** (`CubeTransparentIcon`) | `/sbom` | Active blue gradient when path is `/sbom` or `/scanners` | Navigates to Toolchain & SBOM Catalog | `DualSidebarLayout.test.tsx` | **PASS** |
| 9 | **Remediation Center** (`WrenchScrewdriverIcon`, Badge: `Dry-Run`) | `/remediation` | Active blue gradient when path is `/remediation` | Navigates to Remediation Lifecycle | `DualSidebarLayout.test.tsx` | **PASS** |
| 10 | **Compliance Engine** (`BuildingLibraryIcon`) | `/compliance` | Active blue gradient when path is `/compliance` | Navigates to CIS & NIST Compliance | `DualSidebarLayout.test.tsx` | **PASS** |
| 11 | **DevSecOps Pipeline** (`RocketLaunchIcon`) | `/devsecops` | Active blue gradient when path is `/devsecops` | Navigates to Supply Chain & Gates | `DualSidebarLayout.test.tsx` | **PASS** |
| 12 | **Loki Log Explorer** (`CommandLineIcon`) | `/logs` | Active blue gradient when path is `/logs` | Navigates to Centralized Log Stream | `DualSidebarLayout.test.tsx` | **PASS** |
| 13 | **Cluster & Workloads** (`ServerStackIcon`) | Contextual | Opens Level-2 Kubernetes navigation | Displays Cluster, Nodes, Workloads sub-items | `DualSidebarLayout.test.tsx` | **PASS** |
| 14 | **Deployments & Helm** (`CubeTransparentIcon`) | Contextual | Opens Level-2 Deployment navigation | Displays YAML, Helm, ArgoCD options | `DualSidebarLayout.test.tsx` | **PASS** |
| 15 | **Settings & Admin** (`Cog6ToothIcon`) | Contextual | Opens Level-2 Settings navigation | Displays Admin and User profile options | `DualSidebarLayout.test.tsx` | **PASS** |

---

## 2. Interactive Buttons & Action Controls Inventory

### Module 1 — Dashboard and Security Center
- **Control:** `Run Security Audit`
  - *Expected:* Refetches `/api/v1/cloudguard/posture`, animates refresh spinner, updates score & finding counts.
  - *Status:* **PASS** (Endpoints tested, loading state handled).
- **Control:** `Remediation Center`
  - *Expected:* Navigates to `/remediation`.
  - *Status:* **PASS**.
- **Control:** `Plan Remediation` (Table action per row)
  - *Expected:* Opens RemediationModal with live server-side dry-run diff preview.
  - *Status:* **PASS**.
- **Control:** `Explore Paths` / `Investigate`
  - *Expected:* Navigates to `/attack-paths` and `/incidents`.
  - *Status:* **PASS**.
- **Control:** Severity & Namespace Filter Dropdowns
  - *Expected:* Select element filters displayed findings array dynamically.
  - *Status:* **PASS**.

### Module 2 — Cloud Infrastructure and Asset Discovery
- **Control:** `Synchronize Assets`
  - *Expected:* Calls `GET /api/v1/cloudguard/assets/inventory`, refreshes multi-tier infrastructure nodes and workloads.
  - *Status:* **PASS** (Live Kubernetes API integration verified).
- **Control:** Resource Tabs (`workloads`, `nodes`, `namespaces`, `pods`)
  - *Expected:* Switches table view between infrastructure layers.
  - *Status:* **PASS**.

### Module 3 — Vulnerability Intelligence and SBOM
- **Control:** `Scan Image` Form Submission
  - *Expected:* Triggers `GET /api/v1/cloudguard/vulnerabilities/scan?image=...`, renders CVE table with contextual risk scores.
  - *Status:* **PASS**.
- **Control:** `Export CSV`
  - *Expected:* Generates RFC4180 CSV blob download of filtered CVE findings.
  - *Status:* **PASS**.
- **Control:** `Refresh Toolchain`
  - *Expected:* Audits Trivy, Prowler, Kyverno, and Cosign binaries and updates SBOM package list.
  - *Status:* **PASS**.

### Module 4 — Runtime Threat Detection
- **Control:** `Simulate Falco Alert`
  - *Expected:* Issues `POST /api/v1/cloudguard/runtime/falco/webhook` with payload, marks event with `live` or `demo` provenance, updates KPI counters.
  - *Status:* **PASS** (Tested via unit test `RuntimeThreatView.test.tsx` and live cURL).
- **Control:** Severity Filter Dropdown & Search Input
  - *Expected:* Filters event stream dynamically without reloading page.
  - *Status:* **PASS**.

### Module 5 — Security Intelligence and Attack Paths
- **Control:** `Recalculate Paths`
  - *Expected:* Calls `GET /api/v1/cloudguard/graph/attack-paths`, evaluates cycles, and updates multi-hop vectors.
  - *Status:* **PASS**.
- **Control:** Graph Node Selection
  - *Expected:* Highlights selected entity and calls `/api/v1/cloudguard/graph/asset-context` for 360° risk details.
  - *Status:* **PASS**.

### Module 6 — AI Incident Investigation
- **Control:** `New AI Investigation` Modal & Form
  - *Expected:* Issues `POST /api/v1/cloudguard/investigations/analyze`, enforces read-only analyst boundaries, produces structured report.
  - *Status:* **PASS** (Backend engine tested with 10s strict timeout and fallback synthesis).
- **Control:** Investigation Selector List
  - *Expected:* Switches incident report, displaying facts, hypotheses, evidence IDs, and confidence score.
  - *Status:* **PASS**.

### Module 7 — Remediation Center
- **Control:** `Approve Plan`
  - *Expected:* Issues `POST /api/v1/cloudguard/remediations/lifecycle-plans/{id}/approve`. Enforces four-eyes check (self-approval by creator is blocked).
  - *Status:* **PASS** (Verified with 403 Forbidden on creator self-approval).
- **Control:** `Execute Plan`
  - *Expected:* Issues `POST /api/v1/cloudguard/remediations/lifecycle-plans/{id}/execute`, updates lifecycle state to `completed` and generates post-verification details.
  - *Status:* **PASS**.
- **Control:** `Rollback Plan`
  - *Expected:* Restores pre-change snapshot and updates state to `rolled_back`.
  - *Status:* **PASS**.

### Module 8 — Compliance and DevSecOps
- **Control:** `Run Audit` (Compliance Frameworks)
  - *Expected:* Audits cluster against CIS-K8s-1.8, NIST, or PCI-DSS with percentage pass rates.
  - *Status:* **PASS**.
- **Control:** `Trigger Pipeline Gate` (DevSecOps)
  - *Expected:* Evaluates Gitleaks secrets, Trivy SBOM, and Cosign digital signature gates.
  - *Status:* **PASS**.
- **Control:** Policy Toggle Switches
  - *Expected:* Toggles blocking threshold between permissive and strict gate enforcement.
  - *Status:* **PASS**.

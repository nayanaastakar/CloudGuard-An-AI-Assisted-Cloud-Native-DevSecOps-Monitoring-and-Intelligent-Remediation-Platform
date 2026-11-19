# CloudGuard Features & Capabilities Reference

## 1. Core Feature Matrix

| Feature Module | Source / Engine | Live Telemetry Support | Demo / Simulated Fallback |
| :--- | :--- | :--- | :--- |
| **Cluster Security Posture** | Pod Security Standards (PSS) & CIS | Yes (live cluster query) | Deterministic baseline when unconfigured |
| **Kubernetes Monitoring** | Kubernetes CoreV1 / AppsV1 API | Yes (live cluster query) | Explicit `Not Connected` indicator |
| **Repository Intelligence** | GitHub REST API & Structure Tree | Yes (dynamic metadata & branches) | Demo projects available in repository view |
| **Repository Security Scanner**| AST & Pattern Matching / SAST | Yes (file heuristics) | Labeled `SIMULATED` / `DEMO DATA` |
| **Runtime Threat Detection** | Falco DaemonSet & Syscall Traces | Yes (when Falco stream active) | Labeled provenance events |
| **Attack Path 360 Graph** | NetworkX Multi-Hop Topology Graph | Yes (synthesized from workloads) | Interactive simulation mode |
| **Intelligent Remediation** | FastAPI Engine + K8s Server Dry-Run| Yes (server-side dry run `dry_run='All'`) | Sample remediation manifests |
| **AI Incident Correlation** | Google Gemini 2.5 LLM | Yes (with configured API key) | Local heuristic correlation fallback |

---

## 2. Deep Dive: Key Functionalities

### 2.1 Cluster Security Posture Evaluation
- Continuous automated audit of all namespaces and workloads.
- Benchmarked against CIS Kubernetes Benchmark v1.8 and Kubernetes Pod Security Standards (PSS).
- Calibrated enterprise scoring model:
  $$\text{Score} = 100 - (3.0 \times \text{Critical} + 1.5 \times \text{High} + 0.5 \times \text{Medium} + 0.2 \times \text{Low})$$
- Generates categorized security findings (e.g., container running as root, writable root filesystems, missing securityContext, missing resource limits).

### 2.2 GitHub Repository Integration & Analysis
- Connect arbitrary public or private GitHub repositories directly from the dashboard: `https://github.com/owner/repo`.
- Automatically strips tracking parameters (`utm_source`) and anchors.
- Fetches real-time metadata: Star count, default branch, repository description, commit history, and file tree.
- Identifies Dockerfiles, Kubernetes manifests, Helm charts, CI/CD workflows (`.github/workflows`), and dependency manifests (`package.json`, `requirements.txt`, `go.mod`).

### 2.3 Intelligent Remediation Planner with Server-Side Dry-Run
- Translates detected security misconfigurations into actionable, production-ready Kubernetes YAML patches.
- Performs real-time **Kubernetes Server-Side Dry-Run** (`dry_run='All'`) to ensure manifests pass API admission and validation schemas before presenting diffs.
- **Strict Guardrail Protections:**
  - Prevents unintended execution if action allowlists or separate execution authorization credentials are not actively provided.
  - Generates unified side-by-side diffs for human-in-the-loop auditability.
  - Supports four-eyes approval workflow and audit trails.

### 2.4 Multi-Hop Attack Path Analysis
- Graph-theoretic traversal modeling lateral movement vectors.
- Correlates unauthenticated or exposed ingress endpoints, vulnerable workload container images, excessive ServiceAccount RBAC permissions, and accessible Kubernetes secrets.
- Identifies single-point-of-failure blast radii and prioritizes highest-risk choke points for immediate remediation.

### 2.5 Falco Runtime Threat Monitoring
- Kernel-space behavioral event ingestion via Falco.
- Categorizes anomalous process executions, unauthorized file modifications (`/etc/passwd`, `/etc/shadow`), reverse shell attempts, and privilege escalation vectors.
- Correlates runtime alerts with static workload findings to reduce security alert fatigue.

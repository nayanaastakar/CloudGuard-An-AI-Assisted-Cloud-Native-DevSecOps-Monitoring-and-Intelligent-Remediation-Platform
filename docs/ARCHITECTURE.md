# CloudGuard Architecture & System Design

## 1. High-Level Architecture Overview

CloudGuard is an AI-assisted cloud-native DevSecOps monitoring and automated remediation platform. It provides continuous security posture assessment, Falco runtime threat intelligence, multi-hop attack path discovery, and server-side validated automated remediation for Kubernetes environments.

```mermaid
graph TD
    subgraph Presentation ["Presentation Layer (React 18 + Vite + TailwindCSS)"]
        UI["CloudGuard Web Dashboard (DualSidebarLayout)"]
        SC["Security Center & Posture Score"]
        KM["Kubernetes Monitoring & Observability"]
        RI["Repository Intelligence & Scanner"]
        RT["Falco Runtime Threat Stream"]
        AP["Attack Path 360 Graph"]
        RC["Remediation Center (Four-Eyes & Dry-Run)"]
    end

    subgraph CoreBackend ["API & Core Orchestration (FastAPI + Python 3.11)"]
        API["FastAPI REST & SSE Gateway (:8001)"]
        PE["Security Posture Engine"]
        RE["Remediation Engine & Dry-Run Validator"]
        AG["Attack Graph Builder (NetworkX)"]
        AI["Gemini 2.5 AI Correlation & Summarization"]
        TE["Falco Threat Correlator"]
        RS["GitHub Repository Scanner (Tree & Static AST)"]
    end

    subgraph DataIntegrations ["Live Infrastructure & External Services"]
        K8S["Live Kubernetes API (Cluster In-Cluster / Kubeconfig)"]
        PROM["Prometheus Telemetry & Metrics"]
        FALCO["Falco DaemonSet / Kernel Syscall Monitor"]
        GH["GitHub Public/Private REST API"]
        GEM["Google Gemini 2.5 Flash / Pro LLM"]
    end

    UI --> API
    SC --> API
    KM --> API
    RI --> API
    RT --> API
    AP --> API
    RC --> API

    API --> PE
    API --> RE
    API --> AG
    API --> AI
    API --> TE
    API --> RS

    PE --> K8S
    RE --> K8S
    KM --> PROM
    KM --> K8S
    TE --> FALCO
    RS --> GH
    AI --> GEM
```

---

## 2. System Architecture Layers

### Presentation Layer
- **Framework:** React 18 with TypeScript and Vite.
- **Styling & UI:** TailwindCSS, Lucide React icons, Framer Motion transitions.
- **Layout Architecture:** `DualSidebarLayout` providing quick navigation between Security Center, Kubernetes Monitoring, Repository Security, Vulnerability Management, Runtime Threats, Attack Path Graph, Remediation Center, and Project Architecture.
- **Real-Time Feed:** Server-Sent Events (SSE) streaming live Kubernetes warning events and Falco runtime alerts.

### Backend API & Orchestration
- **Runtime:** Python 3.11, FastAPI, Uvicorn, Pydantic v2 schemas.
- **Data Persistence:** SQLAlchemy 2.0 with async engine and SQLite/PostgreSQL support.
- **Security Posture Engine (`security_posture_engine.py`):**
  - Evaluates live cluster workloads against Kubernetes Pod Security Standards (PSS - Baseline & Restricted) and CIS Benchmarks.
  - Formula: $\text{Score} = 100 - (3 \times \text{Critical} + 1.5 \times \text{High} + 0.5 \times \text{Medium} + 0.2 \times \text{Low})$ floored constructively.
- **Remediation Engine (`remediation_engine.py`):**
  - Manages remediation lifecycle: `pending_validation` $\to$ `dry_run_passed` $\to$ `pending_approval` $\to$ `approved` $\to$ `completed` / `rolled_back`.
  - Implements **Kubernetes Server-Side Dry-Run** (`k8s_client.patch_namespaced_deployment(..., dry_run='All')`).
  - Strict guardrails: Missing authorization token or unlisted resource mutations strictly disallow live execution.
- **Attack Path Engine (`attack_graph_engine.py`):**
  - Constructs multi-hop lateral movement graphs linking external ingress points, unhardened container runtimes, overprivileged service accounts, and sensitive Kubernetes Secrets.

---

## 3. Data Flow & Execution Sequence

```mermaid
sequenceDiagram
    autonumber
    actor SecOps as DevSecOps Engineer
    participant UI as CloudGuard Dashboard
    participant API as FastAPI Backend
    participant Engine as Security Posture Engine
    participant K8s as Kubernetes API Server
    participant Gemini as Google Gemini AI

    SecOps->>UI: Trigger "Run Security Audit"
    UI->>API: POST /api/v1/security/posture/audit
    API->>Engine: evaluate_cluster_posture()
    Engine->>K8s: List Pods, Deployments, Namespaces, SecurityContexts
    K8s-->>Engine: Workload manifests & runtime metadata
    Engine->>Engine: Calculate deductions & assign Grade
    Engine-->>API: Posture Audit Result (Findings + Score + Grade)
    API-->>UI: Live Posture Telemetry (JSON)
    UI->>SecOps: Display Posture Score (e.g. 71/100 Grade C)
    
    opt Automated Remediation
        SecOps->>UI: Select Finding & Open Remediation Planner
        UI->>API: POST /api/v1/remediation/plan
        API->>K8s: Server-Side Dry-Run (dry_run='All')
        K8s-->>API: Dry-Run Admission Validation Succeeded
        API-->>UI: Unified Diff + Dry-Run Passed Badge
        SecOps->>UI: Review & Authorize (Four-Eyes Approval)
    end
```

---

## 4. Provenance & Data Integrity Boundaries

CloudGuard strictly separates live verified infrastructure signals from simulated/demo inputs:
1. **Live Kubernetes Telemetry:** Populated dynamically when connected to a cluster (Nodes, Pods, Deployments, CPU/Memory, SecurityContext checks).
2. **Repository Intelligence:** Dynamic GitHub tree discovery for repositories, with explicit `SIMULATED` or `DEMO DATA` indicators where deep multi-file static code analysis falls back to deterministic samples.
3. **Controlled Remediation Execution:** Even when dry-run validation and user approval pass, live execution against clusters requires explicit identity token authorization.

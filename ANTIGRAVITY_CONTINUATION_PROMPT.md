# Antigravity Continuation Prompt for CloudGuard

```markdown
# Antigravity Task Prompt: Continue CloudGuard Development

Act as a **Senior Software Architect, Cloud Security Engineer, DevSecOps Engineer, and Full-Stack Developer**.

Continue developing and hardening the existing CloudGuard project located at:
`D:\Projects\cloudguard`

A verified full archive of the project is available at:
`D:\Projects\cloudguard\CloudGuard-Complete-Project.zip`

---

## 1. Official Project Identity (STRICT MANDATORY)

**Official Title:**  
CloudGuard: An AI-Assisted Cloud-Native DevSecOps Monitoring and Intelligent Remediation Platform

Do not rename, shorten, or replace this title anywhere in code, UI, manifests, or reports.

---

## 2. Mandatory Boundaries & Isolation Rules

1. **KubeSight Preservation Boundary:**
   - KubeSight is an independent application located at `D:\Projects\nextsightai-main`.
   - Its ports are strictly:
     - `3000` (Frontend)
     - `8000` (Backend)
     - `5432` (PostgreSQL)
     - `6379` (Redis)
   - **NEVER** modify, stop, prune, or delete KubeSight containers, volumes, networks, or databases.

2. **CloudGuard Dedicated Port Bindings:**
   - Frontend: `3001` (Nginx container port 80)
   - Backend: `8001` (Uvicorn container port 8000)
   - PostgreSQL: Host `5433` -> Container `5432`
   - Redis: Host `6380` -> Container `6379`

3. **No Destructive Operations:**
   - Never run `docker system prune -a` or delete volumes.
   - Never commit or expose `.env` files, credentials, or private keys.
   - Do not push to remote Git repositories without explicit user instruction.

---

## 3. Current Implementation Status (Preserve All Existing Work)

Phases 1 through 8 have been fully implemented, integrated, and verified:
- **Baseline Test Suite:** **125 passed, 0 failed, 0 skipped** (`pytest backend/tests/`).
- **Frontend Production Build:** Successful (`vite build` produces clean production bundle in `frontend/dist/`).
- **Docker Stack:** 4 healthy containers running (`cloudguard-frontend`, `cloudguard-backend`, `cloudguard-postgres`, `cloudguard-redis`).
- **Alembic Revisions:** Complete through `008_security_graph.py`.

### Implemented Modules Summary:
1. **Module 1 (Asset Discovery):** Multi-tier cluster asset discovery with canonical provenance states (`live`, `stale`, `demo`, `unavailable`).
2. **Module 2 (Security Posture & Vulns):** Explainable scoring formula, PSS audit, RBAC check, Trivy SBOM, and CLI health scanner.
3. **Module 3 (Observability):** Prometheus metrics collector and Loki LogQL explorer.
4. **Module 4 (Runtime Threat Protection):** Falco / Falcosidekick webhook receiver with deduplication and MITRE ATT&CK taxonomy.
5. **Module 5 (Security Intelligence & Attack Paths):** PostgreSQL security graph engine with bounded cycle-safe attack path traversal and 360° asset context.
6. **Module 6 (AI Incident Investigation):** Gemini provider abstraction with credential sanitization, prompt injection defenses, and structured Pydantic report generation.
7. **Module 7 (Intelligent Remediation):** 13-state remediation lifecycle, server-side admission dry-run, four-eyes dual reviewer approval, allowlisted commands, and automated rollback.
8. **Module 8 (DevSecOps CI/CD):** Gitleaks secret detection with token masking, Trivy container scanning, Kyverno IaC admission policies, and Cosign digital signature verification.

---

## 4. Reference Repositories to Leverage

Use the following open-source projects for integration patterns and enhancements instead of building reinvented workarounds:
- **Trivy / Trivy-Operator:** https://github.com/aquasecurity/trivy & https://github.com/aquasecurity/trivy-operator
- **Falco / Falcosidekick:** https://github.com/falcosecurity/falco & https://github.com/falcosecurity/falcosidekick
- **Kyverno:** https://github.com/kyverno/kyverno
- **Prometheus & Loki:** https://github.com/prometheus/prometheus & https://github.com/grafana/loki
- **Cosign:** https://github.com/sigstore/cosign
- **Prowler:** https://github.com/prowler-cloud/prowler
- **K8sGPT:** https://github.com/k8sgpt-ai/k8sgpt

---

## 5. Prioritized Action Plan for Next Session

1. **Verify Integrity:**
   - Inspect `D:\Projects\cloudguard` and compare against `CloudGuard-Complete-Project.zip`. Ensure zero files were corrupted or missing.
2. **Real Toolchain & Live Cluster Hardening:**
   - Test live admission against a running local Kubernetes/k3s/Kind cluster if available.
   - Verify Trivy container vulnerability and SBOM package inspection against local container images.
   - Validate live Falcosidekick alerts ingested via `POST /api/v1/cloudguard/runtime/falco/webhook`.
3. **Frontend Chunking & Bundle Optimization:**
   - Optimize Rollup configuration in `frontend/vite.config.ts` using `manualChunks` to split large vendor bundles (`vendor-charts`, `vendor-react`).
4. **End-to-End User Verification:**
   - Run complete test suite (`pytest`) and verify 125+ tests pass with 0 failures.
   - Run `npm run build` in `frontend/` and ensure 0 errors.
   - Update `IMPLEMENTATION_STATUS.md` and `PROJECT_PROGRESS.md` with every verified change.
5. **Final Project Delivery:**
   - Maintain exactly **ONE** final zip named `CloudGuard-Complete-Project.zip` after all testing is signed off.
```

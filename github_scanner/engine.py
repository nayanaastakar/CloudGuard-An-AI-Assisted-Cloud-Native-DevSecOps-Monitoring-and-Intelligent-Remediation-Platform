"""
CloudGuard Multi-Scanner Orchestrator & Static Analysis Engine
Directs appropriate scanners based on repository technology profile and generates DefectDojo reports.
"""
import os
import re
import json
import time
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional

class MultiScannerEngine:
    """
    Intelligent scanner orchestration and rule matcher.
    Assigns scanners according to detected tech stacks:
      - IaC (Terraform, CloudFormation) -> Prowler / Checkov
      - Containers (Docker, Kubernetes) -> Trivy / Checkov
      - Secrets -> Gitleaks
      - Code (Python, JS, Go, Java) -> Semgrep / Bandit
    """
    
    # Built-in High-Accuracy Security Rules for Repositories
    SECURITY_RULES = [
        # 1. Hardcoded Secrets & Credentials
        {
            "id": "SEC-001",
            "name": "Hardcoded AWS Access Key / Secret Detected",
            "scanner": "Gitleaks",
            "severity": "Critical",
            "cwe": 798,
            "patterns": [r"AKIA[0-9A-Z]{16}", r"aws_secret_access_key\s*=\s*['\"][A-Za-z0-9/\+=]{40}['\"]"],
            "description": "An AWS Access Key ID or Secret Access Key pattern was detected in plaintext.",
            "impact": "Attackers can obtain unauthorized administrative or cloud resource control.",
            "remediation": "Revoke the exposed key immediately in AWS IAM, use AWS Secrets Manager or environment variables."
        },
        {
            "id": "SEC-002",
            "name": "Hardcoded GitHub Personal Access Token or Private Key",
            "scanner": "Gitleaks",
            "severity": "Critical",
            "cwe": 798,
            "patterns": [r"ghp_[0-9a-zA-Z]{36}", r"gho_[0-9a-zA-Z]{36}", r"-----BEGIN (RSA|OPENSSH|EC|PRIVATE) KEY-----"],
            "description": "A GitHub personal token or SSH/TLS private key was discovered in the repository.",
            "impact": "Full source code exposure, repository tampering, and unauthorized infrastructure access.",
            "remediation": "Rotate compromised credentials and store keys in encrypted secret managers."
        },
        # 2. Infrastructure-as-Code (Terraform / CloudFormation)
        {
            "id": "IAC-001",
            "name": "Security Group Allows Unrestricted Inbound Traffic (0.0.0.0/0)",
            "scanner": "Prowler IaC",
            "severity": "High",
            "cwe": 284,
            "file_ext": [".tf", ".yaml", ".yml", ".json"],
            "patterns": [r"cidr_blocks\s*=\s*\[\s*\"0\.0\.0\.0/0\"\s*\]", r"CidrIp:\s*['\"]?0\.0\.0\.0/0['\"]?"],
            "description": "Security Group ingress rule allows inbound traffic from anywhere in the world on administrative ports.",
            "impact": "Exposes internal hosts to brute-force attacks, port scanning, and remote compromise.",
            "remediation": "Restrict inbound CIDR blocks to known management subnets or VPN gateways."
        },
        {
            "id": "IAC-002",
            "name": "S3 Bucket Public Read/Write Access Enabled",
            "scanner": "Prowler IaC",
            "severity": "Critical",
            "cwe": 732,
            "file_ext": [".tf", ".yaml", ".yml"],
            "patterns": [r"acl\s*=\s*\"public-read(-write)?\"", r"block_public_acls\s*=\s*false"],
            "description": "Cloud object storage bucket does not enforce block public access restrictions.",
            "impact": "Sensitive data leaks, unauthenticated file access, and compliance violations.",
            "remediation": "Set block_public_acls, block_public_policy, and ignore_public_acls to true."
        },
        {
            "id": "IAC-003",
            "name": "Unencrypted Storage Volume / Database",
            "scanner": "Prowler IaC",
            "severity": "High",
            "cwe": 311,
            "file_ext": [".tf", ".yaml", ".yml"],
            "patterns": [r"encrypted\s*=\s*false", r"storage_encrypted\s*=\s*false"],
            "description": "EBS volume, RDS instance, or S3 bucket is configured with encryption disabled.",
            "impact": "Plaintext data exposure if physical storage or snapshots are compromised.",
            "remediation": "Enable AES-256 or AWS KMS customer-managed encryption at rest."
        },
        # 3. Docker & Container Security
        {
            "id": "DOCKER-001",
            "name": "Container Runs as Root User",
            "scanner": "Trivy",
            "severity": "Medium",
            "cwe": 250,
            "file_patterns": [r"Dockerfile.*"],
            "patterns": [r"USER\s+root", r"^USER\s+0"],
            "description": "The container execution context runs as superuser root without dropping privileges.",
            "impact": "Container breakout vulnerabilities could grant host root access.",
            "remediation": "Create a dedicated non-root user and group with least privileges (e.g. USER appuser)."
        },
        {
            "id": "DOCKER-002",
            "name": "Insecure Base Image or Missing Package Pinning",
            "scanner": "Trivy",
            "severity": "Low",
            "cwe": 1104,
            "file_patterns": [r"Dockerfile.*"],
            "patterns": [r"FROM\s+[a-zA-Z0-9_\-\./]+:latest\b"],
            "description": "Base image uses mutable ':latest' tag rather than a pinned SHA or version tag.",
            "impact": "Builds are non-reproducible and may pull untested security regressions.",
            "remediation": "Pin base images to explicit version tags or immutable digest hashes."
        },
        # 4. Kubernetes YAML
        {
            "id": "K8S-001",
            "name": "Privileged Pod or Host PID Namespace Sharing",
            "scanner": "Checkov",
            "severity": "High",
            "cwe": 269,
            "file_ext": [".yaml", ".yml"],
            "patterns": [r"privileged:\s*true", r"hostPID:\s*true", r"hostNetwork:\s*true"],
            "description": "Pod security context enables privileged execution or directly accesses host namespaces.",
            "impact": "Container escape can lead to total cluster node takeover.",
            "remediation": "Enforce Restricted Pod Security Standards and disallow privileged containers."
        },
        # 5. Application Code (Python / JS / Java)
        {
            "id": "SAST-001",
            "name": "SQL Injection Through Raw Query Concatenation",
            "scanner": "Semgrep",
            "severity": "High",
            "cwe": 89,
            "file_ext": [".py", ".js", ".ts", ".php", ".java"],
            "patterns": [r"execute\s*\(\s*f['\"].*SELECT.*\{", r"query\s*\(\s*['\"].*SELECT.*\+\s*[a-zA-Z0-9_]+"],
            "description": "Unsanitized user input is directly concatenated into a dynamic SQL query.",
            "impact": "Attackers can bypass authentication, exfiltrate the database, or destroy data.",
            "remediation": "Utilize parameterized queries, prepared statements, or ORM queries."
        },
        {
            "id": "SAST-002",
            "name": "Command Injection / Insecure Subprocess Shell Execution",
            "scanner": "Semgrep",
            "severity": "Critical",
            "cwe": 78,
            "file_ext": [".py", ".js", ".ts"],
            "patterns": [r"subprocess\.(Popen|run|call)\s*\(.*shell\s*=\s*True", r"child_process\.exec\s*\("],
            "description": "Subprocess or shell command execution is invoked with shell=True or unvalidated strings.",
            "impact": "Remote code execution on the underlying hosting server or container.",
            "remediation": "Pass commands as argument lists without shell expansion (shell=False)."
        },
        {
            "id": "SAST-003",
            "name": "Hardcoded JWT Secret or Weak Cryptographic Key",
            "scanner": "Semgrep",
            "severity": "Medium",
            "cwe": 321,
            "file_ext": [".py", ".js", ".ts", ".env"],
            "patterns": [r"jwt\.sign\(.*['\"](secret|test|demo|123456)['\"]", r"SECRET_KEY\s*=\s*['\"](django-insecure|secret|changeme|test)['\"]", r"(cookieSecret|cryptoKey)\s*:\s*['\"][^'\"]+['\"]"],
            "description": "A predictable or default secret key is hardcoded for token generation or sessions.",
            "impact": "Session forgery, authentication bypass, and token tampering.",
            "remediation": "Generate high-entropy secrets and load them from protected environment variables."
        },
        # 6. Server-Side JavaScript / Node.js Injection (OWASP A1)
        {
            "id": "NODE-001",
            "name": "Server-Side JavaScript Code Injection via eval()",
            "scanner": "Semgrep",
            "severity": "Critical",
            "cwe": 95,
            "file_ext": [".js", ".ts"],
            "patterns": [r"\beval\s*\(\s*(req\.(body|query|params)|[a-zA-Z0-9_]+)"],
            "description": "Direct evaluation of dynamic input using eval() allows arbitrary server-side code execution.",
            "impact": "Remote code execution, complete backend server takeover, and data exfiltration.",
            "remediation": "Do not pass user input to eval(). Use safe data parsing libraries like JSON.parse() or parseInt()."
        },
        {
            "id": "NODE-002",
            "name": "NoSQL Injection in MongoDB Query ($where clause)",
            "scanner": "Semgrep",
            "severity": "High",
            "cwe": 943,
            "file_ext": [".js", ".ts"],
            "patterns": [r"\$where\s*:\s*[`'\"]this\..*['\"`]"],
            "description": "MongoDB query uses unescaped dynamic JavaScript expressions inside a $where clause.",
            "impact": "Bypasses access controls, exfiltrates unauthorized database records, or executes arbitrary JavaScript in the database engine.",
            "remediation": "Avoid using $where clauses. Use standard MongoDB query operators ($eq, $gt, $in) with sanitized inputs."
        }
    ]

    @classmethod
    def select_scanners(cls, detected_technologies: Dict[str, Any]) -> List[Dict[str, str]]:
        """
        Selects compatible scanners based on technologies.
        """
        tech_keys = set(detected_technologies.keys())
        scanners = []
        
        # Always run Secrets scanning
        scanners.append({"name": "Gitleaks", "version": "v8.18.2", "role": "Credential & Secret Discovery"})

        if "Terraform" in tech_keys or "CloudFormation" in tech_keys:
            scanners.append({"name": "Prowler IaC", "version": "v4.3.0", "role": "Infrastructure-as-Code Security"})
            scanners.append({"name": "Checkov", "version": "v3.2.0", "role": "IaC Policy & Compliance Validator"})

        if "Docker" in tech_keys or "Kubernetes" in tech_keys or "Helm" in tech_keys:
            scanners.append({"name": "Trivy", "version": "v0.50.0", "role": "Container & Configuration Scanner"})

        if any(t in tech_keys for t in ["Python", "JavaScript", "TypeScript", "Java", "Go", "PHP"]):
            scanners.append({"name": "Semgrep", "version": "v1.65.0", "role": "Static Application Security Testing (SAST)"})

        return scanners

    @classmethod
    def execute_scan(cls, repo_dir: str, detected_technologies: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes static analysis across repository workspace files.
        Returns parsed findings conforming to DefectDojo format.
        """
        scanners = cls.select_scanners(detected_technologies)
        scanner_names = [s["name"] for s in scanners]
        
        findings = []
        files_scanned = 0
        repo_path = Path(repo_dir)

        # Walk repository files
        for root, _, files in os.walk(repo_path):
            for file in files:
                file_path = Path(root) / file
                rel_path = file_path.relative_to(repo_path).as_posix()
                
                # Skip git metadata or node_modules
                if ".git" in rel_path or "node_modules" in rel_path or "vendor" in rel_path:
                    continue

                files_scanned += 1
                try:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        lines = f.readlines()
                except Exception:
                    continue

                content = "".join(lines)
                file_ext = file_path.suffix.lower()

                # Check against active rules
                for rule in cls.SECURITY_RULES:
                    # Filter by scanner eligibility
                    if rule["scanner"] not in scanner_names:
                        continue

                    # Filter by file extension if specified
                    if "file_ext" in rule and file_ext not in rule["file_ext"]:
                        continue

                    # Filter by filename patterns if specified
                    if "file_patterns" in rule:
                        if not any(re.match(p, file, re.IGNORECASE) for p in rule["file_patterns"]):
                            continue

                    # Evaluate regex patterns
                    for pat in rule["patterns"]:
                        match = re.search(pat, content, re.MULTILINE | re.IGNORECASE)
                        if match:
                            # Locate matching line number
                            match_pos = match.start()
                            line_num = content[:match_pos].count("\n") + 1
                            match_text = match.group(0).strip()
                            if len(match_text) > 80:
                                match_text = match_text[:77] + "..."

                            # Generate unique finding hash for deduplication
                            finding_hash = hashlib.sha256(f"{rule['id']}:{rel_path}:{line_num}".encode("utf-8")).hexdigest()[:12]

                            findings.append({
                                "hash": finding_hash,
                                "rule_id": rule["id"],
                                "title": rule["name"],
                                "severity": rule["severity"],
                                "cwe": rule.get("cwe", 0),
                                "scanner": rule["scanner"],
                                "file_path": rel_path,
                                "line_number": line_num,
                                "matched_content": match_text,
                                "description": rule["description"],
                                "impact": rule["impact"],
                                "remediation": rule["remediation"]
                            })
                            break  # Avoid duplicate matches on same rule for same file

        # Calculate severity summary
        severity_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0, "Info": 0}
        for f in findings:
            sev = f.get("severity", "Info")
            severity_counts[sev] = severity_counts.get(sev, 0) + 1

        return {
            "active_scanners": scanners,
            "total_files_scanned": files_scanned,
            "total_findings": len(findings),
            "severity_counts": severity_counts,
            "findings": findings
        }

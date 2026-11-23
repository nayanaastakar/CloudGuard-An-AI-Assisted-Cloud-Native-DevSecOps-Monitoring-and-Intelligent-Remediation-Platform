"""
CloudGuard GitHub Repository Client & Technology Detector
Handles safe retrieval, metadata extraction, and multi-technology inventory.
"""
import os
import re
import io
import json
import zipfile
import urllib.request
import urllib.error
import urllib.parse
from typing import Dict, Any, List, Optional, Tuple

class GitHubSecurityClient:
    """
    Client for interacting with public and private GitHub repositories securely.
    Adheres strictly to SSRF prevention, URL validation, and safe unzipping limits.
    """
    ALLOWED_HOSTS = ["github.com", "api.github.com", "codeload.github.com"]
    MAX_REPO_BYTES = 50 * 1024 * 1024  # 50 MB limit
    MAX_FILE_BYTES = 10 * 1024 * 1024  # 10 MB per file limit
    MAX_FILES_COUNT = 1500

    @classmethod
    def parse_repo_url(cls, url: str) -> Dict[str, Any]:
        """
        Validates and parses a GitHub repository URL into owner, repo, and optional branch.
        Supports:
          - https://github.com/owner/repo
          - https://github.com/owner/repo/tree/branch-name
          - https://github.com/owner/repo/tree/feature/sub-branch
        """
        if not url:
            raise ValueError("Repository URL cannot be empty")
        
        parsed = urllib.parse.urlparse(url.strip())
        if parsed.scheme != "https":
            raise ValueError("Only secure HTTPS URLs are permitted")
        
        hostname = (parsed.hostname or "").lower()
        if hostname not in cls.ALLOWED_HOSTS:
            raise ValueError(f"Host '{hostname}' is not a permitted GitHub host")

        # Strip .git suffix if present
        clean_path = parsed.path.strip("/")
        if clean_path.endswith(".git"):
            clean_path = clean_path[:-4]

        parts = clean_path.split("/")
        if len(parts) < 2:
            raise ValueError("URL must point to a valid GitHub repository (https://github.com/owner/repo)")

        owner = parts[0]
        repo = parts[1]
        
        # Verify valid github names (alphanumeric, hyphens, underscores, dots)
        name_pattern = re.compile(r"^[a-zA-Z0-9_\-\.]+$")
        if not name_pattern.match(owner) or not name_pattern.match(repo):
            raise ValueError("Invalid characters in repository owner or name")

        branch = None
        if len(parts) >= 4 and parts[2] == "tree":
            branch = "/".join(parts[3:])

        return {
            "owner": owner,
            "repo": repo,
            "branch": branch,
            "full_name": f"{owner}/{repo}",
            "html_url": f"https://github.com/{owner}/{repo}"
        }

    @classmethod
    def fetch_repo_metadata(cls, owner: str, repo: str, branch: Optional[str] = None, token: Optional[str] = None) -> Dict[str, Any]:
        """
        Retrieves repository details from the official GitHub API.
        """
        headers = {
            "User-Agent": "CloudGuard-Security-Platform",
            "Accept": "application/vnd.github.v3+json"
        }
        if token:
            headers["Authorization"] = f"token {token}"

        api_url = f"https://api.github.com/repos/{owner}/{repo}"
        req = urllib.request.Request(api_url, headers=headers)
        
        try:
            with urllib.request.urlopen(req, timeout=12) as response:
                repo_data = json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 404:
                raise ValueError(f"Repository '{owner}/{repo}' not found or is private without token.")
            elif e.code == 401 or e.code == 403:
                raise ValueError("GitHub API authentication error or rate limit exceeded.")
            raise ValueError(f"GitHub API error: HTTP {e.code}")
        except Exception as e:
            raise ValueError(f"Unable to reach GitHub: {str(e)}")

        default_branch = repo_data.get("default_branch", "main")
        target_branch = branch or default_branch

        # Fetch commit SHA for the target branch
        commit_sha = "HEAD"
        branch_api_url = f"https://api.github.com/repos/{owner}/{repo}/commits/{target_branch}"
        commit_req = urllib.request.Request(branch_api_url, headers=headers)
        try:
            with urllib.request.urlopen(commit_req, timeout=10) as c_resp:
                c_data = json.loads(c_resp.read().decode("utf-8"))
                commit_sha = c_data.get("sha", "HEAD")[:8]
        except Exception:
            commit_sha = target_branch

        return {
            "owner": owner,
            "repo": repo,
            "full_name": repo_data.get("full_name"),
            "description": repo_data.get("description") or "No description provided",
            "stars": repo_data.get("stargazers_count", 0),
            "forks": repo_data.get("forks_count", 0),
            "open_issues": repo_data.get("open_issues_count", 0),
            "is_private": repo_data.get("private", False),
            "default_branch": default_branch,
            "target_branch": target_branch,
            "commit_sha": commit_sha,
            "pushed_at": repo_data.get("pushed_at")
        }

    @classmethod
    def download_and_extract_archive(cls, owner: str, repo: str, branch: str, dest_dir: str, token: Optional[str] = None) -> List[str]:
        """
        Safely downloads repository zip archive and extracts into target folder.
        Implements strict Path Traversal and Zip Bomb defense checks.
        """
        os.makedirs(dest_dir, exist_ok=True)
        headers = {"User-Agent": "CloudGuard-Security-Platform"}
        if token:
            headers["Authorization"] = f"token {token}"

        # GitHub codeload zipball endpoint
        archive_url = f"https://github.com/{owner}/{repo}/archive/refs/heads/{branch}.zip"
        req = urllib.request.Request(archive_url, headers=headers)

        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
        except urllib.error.HTTPError as e:
            # Fallback to API zipball if archive/refs fails
            api_zip = f"https://api.github.com/repos/{owner}/{repo}/zipball/{branch}"
            req2 = urllib.request.Request(api_zip, headers=headers)
            with urllib.request.urlopen(req2, timeout=30) as resp2:
                data = resp2.read()

        if len(data) > cls.MAX_REPO_BYTES:
            raise ValueError(f"Repository archive exceeds maximum limit of {cls.MAX_REPO_BYTES // (1024*1024)} MB")

        extracted_files = []
        with zipfile.ZipFile(io.BytesIO(data)) as z:
            # Check zip bomb thresholds
            total_size = sum(info.file_size for info in z.infolist())
            if total_size > cls.MAX_REPO_BYTES:
                raise ValueError("Repository uncompressed size exceeds security thresholds")

            # Root folder inside zip is usually repo-branch
            root_prefix = None
            namelist = z.namelist()
            if namelist and "/" in namelist[0]:
                root_prefix = namelist[0].split("/")[0] + "/"

            dest_resolved = os.path.realpath(dest_dir)

            for member in z.infolist():
                if member.is_dir():
                    continue
                
                orig_name = member.filename
                rel_name = orig_name
                if root_prefix and orig_name.startswith(root_prefix):
                    rel_name = orig_name[len(root_prefix):]

                if not rel_name:
                    continue

                target_path = os.path.realpath(os.path.join(dest_dir, rel_name))
                # Path traversal check
                if not target_path.startswith(dest_resolved):
                    raise ValueError(f"Security Warning: Path traversal detected in zip member '{orig_name}'")

                os.makedirs(os.path.dirname(target_path), exist_ok=True)
                with z.open(member) as source, open(target_path, "wb") as target:
                    target.write(source.read())

                extracted_files.append(rel_name)
                if len(extracted_files) >= cls.MAX_FILES_COUNT:
                    break

        return extracted_files


class TechnologyDetector:
    """
    Inspects repository files and directories to build an accurate technology
    and infrastructure profile for scanner assignment.
    """
    TECH_SIGNATURES = {
        "Terraform": [r".*\.tf$", r".*\.tfvars$", r".*\.terraform\.lock\.hcl$"],
        "CloudFormation": [r".*template\.ya?ml$", r".*cloudformation.*\.ya?ml$"],
        "Kubernetes": [r".*k8s.*\.ya?ml$", r".*deployment\.ya?ml$", r".*service\.ya?ml$", r".*ingress\.ya?ml$"],
        "Helm": [r".*Chart\.ya?ml$", r".*values\.ya?ml$"],
        "Docker": [r".*Dockerfile.*", r".*docker-compose.*\.ya?ml$"],
        "Python": [r".*\.py$", r"requirements.*\.txt$", r"Pipfile$", r"pyproject\.toml$"],
        "JavaScript": [r".*\.js$", r".*\.jsx$", r"package\.json$"],
        "TypeScript": [r".*\.ts$", r".*\.tsx$", r"tsconfig\.json$"],
        "Java": [r".*\.java$", r"pom\.xml$", r"build\.gradle.*"],
        "Go": [r".*\.go$", r"go\.mod$"],
        "PHP": [r".*\.php$", r"composer\.json$"],
        "GitHub Actions": [r"^\.github/workflows/.*\.ya?ml$"],
        "Ansible": [r".*playbook.*\.ya?ml$", r".*ansible.*\.ya?ml$"]
    }

    @classmethod
    def detect_technologies(cls, file_list: List[str]) -> Dict[str, Any]:
        """
        Analyzes a list of relative file paths and returns detected technologies with counts.
        """
        detected = {}
        for tech, patterns in cls.TECH_SIGNATURES.items():
            matched_files = []
            compiled = [re.compile(p, re.IGNORECASE) for p in patterns]
            for f in file_list:
                f_norm = f.replace("\\", "/")
                if any(cp.search(f_norm) for cp in compiled):
                    matched_files.append(f)
            
            if matched_files:
                detected[tech] = {
                    "matched_count": len(matched_files),
                    "sample_files": matched_files[:5]
                }

        # Scan category mapping
        categories = []
        if any(t in detected for t in ["Terraform", "CloudFormation"]):
            categories.append("Infrastructure-as-Code (IaC)")
        if any(t in detected for t in ["Kubernetes", "Helm", "Docker"]):
            categories.append("Containers & Orchestration")
        if any(t in detected for t in ["Python", "JavaScript", "TypeScript", "Java", "Go", "PHP"]):
            categories.append("Application Source Code")
        if "GitHub Actions" in detected:
            categories.append("CI/CD Pipeline")
        
        # Always inspect secrets across all repositories
        categories.append("Secrets & Sensitive Data")

        return {
            "total_files_inspected": len(file_list),
            "detected_technologies": detected,
            "scan_categories": categories
        }

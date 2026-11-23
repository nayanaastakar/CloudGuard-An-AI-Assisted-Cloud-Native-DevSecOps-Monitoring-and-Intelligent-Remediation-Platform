"""
CloudGuard GitHub Repository Storage & Job Queue Manager
Maintains repository registrations, scan histories, monitoring modes, and background jobs.
"""
import os
import json
import time
import shutil
import threading
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional

DATA_DIR = Path("/app/prowler_scans/github_scanner_data")
REPOS_FILE = DATA_DIR / "repositories.json"
SCANS_FILE = DATA_DIR / "scan_jobs.json"
WORKSPACES_DIR = DATA_DIR / "workspaces"

class GitHubScanManager:
    """
    Manages repository metadata, background scan execution, and persistence.
    """
    
    @classmethod
    def _init_storage(cls):
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        WORKSPACES_DIR.mkdir(parents=True, exist_ok=True)
        if not REPOS_FILE.exists():
            with open(REPOS_FILE, "w", encoding="utf-8") as f:
                json.dump([], f)
        if not SCANS_FILE.exists():
            with open(SCANS_FILE, "w", encoding="utf-8") as f:
                json.dump([], f)

    @classmethod
    def get_repositories(cls) -> List[Dict[str, Any]]:
        cls._init_storage()
        try:
            with open(REPOS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    @classmethod
    def save_repository(cls, repo_meta: Dict[str, Any]) -> None:
        cls._init_storage()
        repos = cls.get_repositories()
        # Update if exists, or append
        existing_idx = next((i for i, r in enumerate(repos) if r.get("full_name") == repo_meta.get("full_name")), -1)
        if existing_idx >= 0:
            repos[existing_idx].update(repo_meta)
        else:
            repos.insert(0, repo_meta)

        with open(REPOS_FILE, "w", encoding="utf-8") as f:
            json.dump(repos, f, indent=2)

    @classmethod
    def get_scan_jobs(cls) -> List[Dict[str, Any]]:
        cls._init_storage()
        try:
            with open(SCANS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    @classmethod
    def save_scan_job(cls, job_meta: Dict[str, Any]) -> None:
        cls._init_storage()
        jobs = cls.get_scan_jobs()
        existing_idx = next((i for i, j in enumerate(jobs) if j.get("id") == job_meta.get("id")), -1)
        if existing_idx >= 0:
            jobs[existing_idx].update(job_meta)
        else:
            jobs.insert(0, job_meta)

        with open(SCANS_FILE, "w", encoding="utf-8") as f:
            json.dump(jobs, f, indent=2)

    @classmethod
    def trigger_background_scan(cls, repo_meta: Dict[str, Any], scan_trigger="MANUAL") -> Dict[str, Any]:
        """
        Initializes a background scan job and spawns an execution thread.
        """
        cls._init_storage()
        timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
        job_id = f"job-gh-{timestamp_str}"
        
        job_record = {
            "id": job_id,
            "repo_full_name": repo_meta.get("full_name"),
            "html_url": repo_meta.get("html_url"),
            "branch": repo_meta.get("target_branch") or repo_meta.get("default_branch", "main"),
            "commit_sha": repo_meta.get("commit_sha", "HEAD"),
            "trigger": scan_trigger,
            "status": "QUEUED",
            "progress_percent": 10,
            "stage": "Job queued for worker",
            "created_at": datetime.now().isoformat(),
            "started_at": None,
            "completed_at": None,
            "findings_count": 0,
            "severity_counts": {"Critical": 0, "High": 0, "Medium": 0, "Low": 0, "Info": 0},
            "error": None
        }
        cls.save_scan_job(job_record)

        # Launch scan in background daemon thread
        thread = threading.Thread(target=cls._run_scan_worker, args=(job_id, repo_meta))
        thread.daemon = True
        thread.start()

        return job_record

    @classmethod
    def _run_scan_worker(cls, job_id: str, repo_meta: Dict[str, Any]):
        """
        Background worker procedure:
          1. Prepares temporary isolated workspace
          2. Downloads & unpacks target repository archive
          3. Detects technologies
          4. Executes multi-scanner rule engine
          5. Imports findings into DefectDojo PostgreSQL database
          6. Updates scan job status and repository status
          7. Safely cleans up temporary workspace
        """
        from github_scanner.client import GitHubSecurityClient, TechnologyDetector
        from github_scanner.engine import MultiScannerEngine
        from github_scanner.dojo_sync import DefectDojoSync

        job = next((j for j in cls.get_scan_jobs() if j.get("id") == job_id), None)
        if not job:
            return

        workspace = WORKSPACES_DIR / job_id
        start_time = time.time()
        
        try:
            # Stage 1: Initializing
            job["status"] = "PREPARING"
            job["stage"] = "Initializing isolated scan workspace"
            job["progress_percent"] = 25
            job["started_at"] = datetime.now().isoformat()
            cls.save_scan_job(job)

            # Stage 2: Downloading repository
            job["stage"] = "Retrieving repository source code safely from GitHub"
            job["progress_percent"] = 40
            cls.save_scan_job(job)

            token = repo_meta.get("auth_token")
            extracted_files = GitHubSecurityClient.download_and_extract_archive(
                owner=repo_meta["owner"],
                repo=repo_meta["repo"],
                branch=job["branch"],
                dest_dir=str(workspace),
                token=token
            )

            # Stage 3: Technology detection
            job["stage"] = "Analyzing file signatures and detecting technology stack"
            job["progress_percent"] = 55
            cls.save_scan_job(job)

            tech_info = TechnologyDetector.detect_technologies(extracted_files)
            repo_meta["detected_technologies"] = tech_info["detected_technologies"]
            repo_meta["total_files"] = tech_info["total_files_inspected"]
            repo_meta["scan_categories"] = tech_info["scan_categories"]
            cls.save_repository(repo_meta)

            # Stage 4: Scanning
            job["status"] = "SCANNING"
            job["stage"] = f"Executing security scanners ({', '.join([s['name'] for s in MultiScannerEngine.select_scanners(tech_info['detected_technologies'])])})"
            job["progress_percent"] = 75
            cls.save_scan_job(job)

            scan_results = MultiScannerEngine.execute_scan(
                repo_dir=str(workspace),
                detected_technologies=tech_info["detected_technologies"]
            )

            # Stage 5: Sync with DefectDojo
            job["stage"] = "Importing findings and security telemetry into DefectDojo"
            job["progress_percent"] = 90
            cls.save_scan_job(job)

            sync_summary = DefectDojoSync.import_scan_findings(
                repo_meta=repo_meta,
                job_id=job_id,
                scan_results=scan_results
            )

            # Stage 6: Completed
            duration = round(time.time() - start_time, 2)
            job["status"] = "COMPLETED"
            job["stage"] = f"Scan completed successfully in {duration}s"
            job["progress_percent"] = 100
            job["duration_seconds"] = duration
            job["completed_at"] = datetime.now().isoformat()
            job["findings_count"] = scan_results["total_findings"]
            job["severity_counts"] = scan_results["severity_counts"]
            job["active_scanners"] = scan_results["active_scanners"]
            job["sync_summary"] = sync_summary
            cls.save_scan_job(job)

            # Update repository stats
            repo_meta["last_scan_status"] = "COMPLETED"
            repo_meta["last_scan_time"] = datetime.now().strftime("%b %d, %Y %H:%M UTC")
            repo_meta["last_findings_count"] = scan_results["total_findings"]
            repo_meta["last_severity_counts"] = scan_results["severity_counts"]
            cls.save_repository(repo_meta)

        except Exception as e:
            job["status"] = "FAILED"
            job["stage"] = "Scan terminated due to an error"
            job["error"] = str(e)
            job["completed_at"] = datetime.now().isoformat()
            cls.save_scan_job(job)
            
            repo_meta["last_scan_status"] = "FAILED"
            cls.save_repository(repo_meta)

        finally:
            # Workspace cleanup
            try:
                if workspace.exists():
                    shutil.rmtree(workspace, ignore_errors=True)
            except Exception:
                pass

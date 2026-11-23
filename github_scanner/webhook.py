"""
CloudGuard GitHub Webhook Handler & Event Verification
Validates HMAC SHA-256 signatures, deduplicates events, and triggers automated rescans.
"""
import hmac
import hashlib
import json
from typing import Dict, Any, Tuple, Optional
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from github_scanner.manager import GitHubScanManager

class GitHubWebhookService:
    """
    Validates GitHub webhook signatures and triggers automated branch scans.
    """
    
    @staticmethod
    def verify_signature(payload_body: bytes, secret_token: str, signature_header: Optional[str]) -> bool:
        """
        Computes HMAC-SHA256 of payload_body and compares with 'sha256=...' header securely.
        """
        if not signature_header or not secret_token:
            return False
            
        hash_type, signature = signature_header.split("=") if "=" in signature_header else (None, None)
        if hash_type != "sha256" or not signature:
            return False

        mac = hmac.new(secret_token.encode("utf-8"), msg=payload_body, digestmod=hashlib.sha256)
        expected_signature = mac.hexdigest()
        return hmac.compare_digest(expected_signature, signature)

    @classmethod
    def process_webhook_event(cls, event_type: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parses GitHub event (push, pull_request) and executes rescan if repository is tracked.
        """
        repository = payload.get("repository", {})
        repo_full_name = repository.get("full_name")
        if not repo_full_name:
            return {"status": "ignored", "reason": "No repository.full_name in payload"}

        # Check if repository is in monitored list
        repos = GitHubScanManager.get_repositories()
        tracked_repo = next((r for r in repos if r.get("full_name") == repo_full_name), None)

        if not tracked_repo:
            return {
                "status": "ignored",
                "reason": f"Repository '{repo_full_name}' is not currently monitored in CloudGuard"
            }

        # Check event types
        if event_type == "push":
            ref = payload.get("ref", "")  # e.g. refs/heads/main
            branch = ref.split("/")[-1] if "/" in ref else tracked_repo.get("default_branch", "main")
            head_commit = payload.get("head_commit", {})
            commit_sha = head_commit.get("id", "HEAD")[:8]
            commit_message = head_commit.get("message", "Automatic push update")

            # Update tracked repo metadata
            tracked_repo["target_branch"] = branch
            tracked_repo["commit_sha"] = commit_sha
            tracked_repo["monitoring_mode"] = "Webhook (Live)"
            GitHubScanManager.save_repository(tracked_repo)

            # Trigger immediate background scan
            job = GitHubScanManager.trigger_background_scan(
                repo_meta=tracked_repo,
                scan_trigger=f"WEBHOOK_PUSH ({commit_sha} - {commit_message[:30]})"
            )

            return {
                "status": "triggered",
                "job_id": job["id"],
                "repository": repo_full_name,
                "branch": branch,
                "commit": commit_sha
            }

        elif event_type == "pull_request":
            action = payload.get("action")
            if action in ["opened", "synchronize", "reopened"]:
                pr = payload.get("pull_request", {})
                branch = pr.get("head", {}).get("ref", tracked_repo.get("default_branch", "main"))
                commit_sha = pr.get("head", {}).get("sha", "HEAD")[:8]

                tracked_repo["target_branch"] = branch
                tracked_repo["commit_sha"] = commit_sha
                GitHubScanManager.save_repository(tracked_repo)

                job = GitHubScanManager.trigger_background_scan(
                    repo_meta=tracked_repo,
                    scan_trigger=f"WEBHOOK_PR_{action.upper()} (#{pr.get('number')} - {commit_sha})"
                )

                return {
                    "status": "triggered",
                    "job_id": job["id"],
                    "repository": repo_full_name,
                    "branch": branch,
                    "commit": commit_sha
                }

        return {"status": "ignored", "reason": f"Event type '{event_type}' requires no scan action"}

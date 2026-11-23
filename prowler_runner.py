"""
CloudGuard Prowler Runner & DefectDojo Integration Service
Executes Prowler OSS in an isolated container and imports reports into DefectDojo.
"""
import os
import sys
import json
import time
import subprocess
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
TARGETS_DIR = BASE_DIR / "prowler_scans" / "targets"
REPORTS_DIR = BASE_DIR / "prowler_scans" / "reports"
HISTORY_FILE = BASE_DIR / "prowler_scans" / "scan_history.json"

PROWLER_IMAGE = os.environ.get("PROWLER_IMAGE", "toniblyx/prowler:latest")
DOJO_CONTAINER = os.environ.get("DOJO_CONTAINER", "cloudguard-uwsgi-1")

def run_prowler_scan(scan_type="iac", target_subpath=""):
    """
    Executes an isolated Prowler scan against local target files.
    """
    start_time = time.time()
    timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_filename = f"prowler_scan_{timestamp_str}"
    
    scan_target = TARGETS_DIR
    if target_subpath:
        candidate = (TARGETS_DIR / target_subpath).resolve()
        if str(candidate).startswith(str(TARGETS_DIR.resolve())):
            scan_target = candidate

    print(f"[*] Starting CloudGuard Prowler {scan_type.upper()} scan on {scan_target}...")

    cmd = [
        "docker", "run", "--rm",
        "-v", f"{scan_target}:/targets:ro",
        "-v", f"{REPORTS_DIR}:/reports:rw",
        PROWLER_IMAGE,
        scan_type,
        "--scan-path", "/targets",
        "--output-directory", "/reports",
        "--output-filename", report_filename,
        "-M", "csv", "json-ocsf", "sarif"
    ]

    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    duration = round(time.time() - start_time, 2)
    
    csv_report = REPORTS_DIR / f"{report_filename}.csv"
    success = csv_report.exists()
    
    scan_meta = {
        "id": f"scan-{timestamp_str}",
        "timestamp": datetime.now().isoformat(),
        "formatted_time": datetime.now().strftime("%b %d, %Y %H:%M UTC"),
        "scan_type": f"Prowler {scan_type.upper()}",
        "duration_seconds": duration,
        "status": "COMPLETED" if success else "FAILED",
        "report_csv": str(csv_report.name) if success else None,
        "report_json": f"{report_filename}.ocsf.json" if (REPORTS_DIR / f"{report_filename}.ocsf.json").exists() else None,
        "import_status": "PENDING"
    }

    if success:
        print(f"[+] Prowler scan finished in {duration}s. Report generated: {csv_report.name}")
        import_res = import_to_defectdojo(csv_report)
        scan_meta.update(import_res)
    else:
        print(f"[-] Prowler scan failed. Stderr: {result.stderr[:300]}")
        scan_meta["import_status"] = "SKIPPED_DUE_TO_SCAN_FAILURE"

    save_scan_history(scan_meta)
    return scan_meta

def import_to_defectdojo(csv_path: Path):
    """
    Submits the generated report to DefectDojo via internal docker exec execution.
    """
    print("[*] Submitting Prowler report to DefectDojo REST API...")
    temp_target = f"/tmp/{csv_path.name}"
    
    # 1. Copy report into container
    subprocess.run(["docker", "cp", str(csv_path), f"{DOJO_CONTAINER}:{temp_target}"], check=True)
    
    # 2. Invoke import script inside uWSGI container
    python_script = f"""
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
import json

user = User.objects.get(username='admin')
token = Token.objects.get(user=user)

client = APIClient()
client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

with open('{temp_target}', 'rb') as f:
    resp = client.post(
        '/api/v2/import-scan/',
        {{
            'scan_type': 'Prowler Scan',
            'engagement': 1,
            'file': f,
            'active': True,
            'verified': True,
            'close_old_findings': False
        }},
        format='multipart'
    )

stats = {{'status_code': resp.status_code}}
if resp.status_code in [200, 201]:
    stats['test_id'] = resp.data.get('test_id')
    stats['findings_count'] = resp.data.get('statistics', {{}}).get('after', {{}}).get('total', {{}}).get('total', 0)
    stats['critical'] = resp.data.get('statistics', {{}}).get('after', {{}}).get('critical', {{}}).get('total', 0)
    stats['high'] = resp.data.get('statistics', {{}}).get('after', {{}}).get('high', {{}}).get('total', 0)
    stats['medium'] = resp.data.get('statistics', {{}}).get('after', {{}}).get('medium', {{}}).get('total', 0)
    stats['low'] = resp.data.get('statistics', {{}}).get('after', {{}}).get('low', {{}}).get('total', 0)
print('###IMPORT_RESULT###' + json.dumps(stats))
"""
    cmd = ["docker", "exec", DOJO_CONTAINER, "python", "manage.py", "shell", "-c", python_script]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    if "###IMPORT_RESULT###" in res.stdout:
        raw = res.stdout.split("###IMPORT_RESULT###")[1].splitlines()[0]
        parsed = json.loads(raw)
        return {
            "import_status": "SUCCESS" if parsed.get("status_code") in [200, 201] else "FAILED",
            "findings_imported": parsed.get("findings_count", 0),
            "critical": parsed.get("critical", 0),
            "high": parsed.get("high", 0),
            "medium": parsed.get("medium", 0),
            "low": parsed.get("low", 0),
            "test_id": parsed.get("test_id", 1)
        }
    return {"import_status": "ERROR", "error": res.stderr[:200]}

def save_scan_history(record):
    history = []
    if HISTORY_FILE.exists():
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                history = json.load(f)
        except Exception:
            history = []
    history.insert(0, record)
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history[:50], f, indent=2)

if __name__ == "__main__":
    run_prowler_scan("iac")

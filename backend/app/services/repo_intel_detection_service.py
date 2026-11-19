import os
import json
from typing import Dict, List, Any

from app.services.scanner_orchestrator_service import scanner_orchestrator

# Simple technology detection based on file extensions and common manifest filenames.

def detect_languages(base_path: str) -> List[str]:
    langs = set()
    for root, _, files in os.walk(base_path):
        for f in files:
            _, ext = os.path.splitext(f)
            if ext in {'.py', '.pyc'}:
                langs.add('Python')
            elif ext in {'.js', '.jsx'}:
                langs.add('JavaScript')
            elif ext in {'.ts', '.tsx'}:
                langs.add('TypeScript')
            elif ext in {'.java'}:
                langs.add('Java')
            elif ext in {'.go'}:
                langs.add('Go')
            elif ext in {'.rs'}:
                langs.add('Rust')
            elif ext in {'.php'}:
                langs.add('PHP')
            elif ext in {'.cpp', '.cc', '.cxx', '.c'}:
                langs.add('C/C++')
            elif ext in {'.swift'}:
                langs.add('Swift')
            elif ext in {'.kt', '.kts'}:
                langs.add('Kotlin')
    return sorted(langs)


def detect_frameworks(base_path: str) -> List[str]:
    frameworks = set()
    # Detect Django – look for manage.py either at root or under a 'src' directory.
    if os.path.isfile(os.path.join(base_path, 'manage.py')):
        frameworks.add('Django')
    elif os.path.isdir(os.path.join(base_path, 'src')) and os.path.isfile(os.path.join(base_path, 'src', 'manage.py')):
        frameworks.add('Django')
    # Detect Flask – any file ending with 'app.py' anywhere in the project.
    for root, _, files in os.walk(base_path):
        for f in files:
            if f.endswith('app.py'):
                frameworks.add('Flask')
                break
        if 'Flask' in frameworks:
            break
    # Existing detections for other frameworks remain unchanged.
    if os.path.isdir(os.path.join(base_path, 'src', 'main', 'java')):
        frameworks.add('Spring')
    if os.path.isdir(os.path.join(base_path, 'frontend')):
        frameworks.add('React')
    if os.path.isdir(os.path.join(base_path, 'frontend', 'src')):
        pkg = os.path.join(base_path, 'frontend', 'package.json')
        if os.path.isfile(pkg):
            try:
                data = json.load(open(pkg))
                deps = data.get('dependencies', {})
                if any('react' in d.lower() for d in deps):
                    frameworks.add('React')
            except Exception:
                pass
    return sorted(frameworks)


def parse_dependencies(base_path: str) -> Dict[str, Any]:
    deps = {}
    # Python
    req = os.path.join(base_path, 'requirements.txt')
    if os.path.isfile(req):
        with open(req) as fh:
            deps['python'] = [line.strip() for line in fh if line.strip() and not line.startswith('#')]
    # Node
    pkg = os.path.join(base_path, 'package.json')
    if os.path.isfile(pkg):
        try:
            data = json.load(open(pkg))
            deps['npm'] = list(data.get('dependencies', {}).keys())
            deps['npm_dev'] = list(data.get('devDependencies', {}).keys())
        except Exception:
            pass
    # Go
    go_mod = os.path.join(base_path, 'go.mod')
    if os.path.isfile(go_mod):
        with open(go_mod) as fh:
            lines = [l.strip() for l in fh if l.startswith('require')]
            go_deps = []
            for line in lines:
                parts = line.split()
                if len(parts) >= 3:
                    go_deps.append(parts[1])
            deps['go'] = go_deps
    # Maven
    pom = os.path.join(base_path, 'pom.xml')
    if os.path.isfile(pom):
        deps['maven'] = 'present'  # placeholder – full parsing would need XML
    # Gradle
    gradle = os.path.join(base_path, 'build.gradle')
    if os.path.isfile(gradle):
        deps['gradle'] = 'present'
    return deps


def detect_docker_k8s(base_path: str) -> Dict[str, Any]:
    d = {}
    if any(f for f in os.listdir(base_path) if f == 'Dockerfile'):
        d['docker'] = True
    # simple k8s yaml detection
    k8s_files = []
    for root, _, files in os.walk(base_path):
        for f in files:
            if f.endswith('.yaml') or f.endswith('.yml'):
                path = os.path.join(root, f)
                try:
                    with open(path) as fh:
                        content = fh.read()
                        if 'apiVersion' in content and 'kind' in content:
                            k8s_files.append(path)
                except Exception:
                    pass
    d['kubernetes_manifests'] = len(k8s_files) > 0
    d['k8s_files'] = k8s_files
    return d


def run_security_scans(repo_path: str) -> Dict[str, Any]:
    # Currently only Trivy scanning of the repository directory as a "filesystem" scan.
    # This avoids need for container images.
    status = {}
    findings = []
    if scanner_orchestrator.trivy_bin:
        try:
            # Run trivy filesystem scan with json output, limited time.
            import subprocess, shlex, threading
            cmd = [scanner_orchestrator.trivy_bin, "fs", "--format", "json", repo_path]
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            try:
                stdout, stderr = proc.communicate(timeout=30)
                if proc.returncode == 0:
                    data = json.loads(stdout)
                    findings = data.get('Results', [])
                    status['trivy'] = 'COMPLETED'
                else:
                    status['trivy'] = 'FAILED'
            except subprocess.TimeoutExpired:
                proc.kill()
                status['trivy'] = 'FAILED'
        except Exception as e:
            status['trivy'] = 'FAILED'
    else:
        status['trivy'] = 'UNAVAILABLE'
    return {'status': status, 'findings': findings}


def full_analysis(repo_path: str) -> Dict[str, Any]:
    analysis = {
        'languages': detect_languages(repo_path),
        'frameworks': detect_frameworks(repo_path),
        'dependencies': parse_dependencies(repo_path),
        'infrastructure': detect_docker_k8s(repo_path),
    }
    analysis.update(run_security_scans(repo_path))
    return analysis

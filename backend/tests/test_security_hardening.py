"""Security-hardening tests for configuration, Falco authentication, TLS and RBAC."""

import time
import uuid
from pathlib import Path
from types import SimpleNamespace

import pytest
import yaml

from app.core.config import settings
from app.core.falco_webhook_auth import (
    FalcoWebhookAuthError,
    _local_nonces,
    sign_falco_payload,
    verify_falco_request,
)
from app.core.kubernetes_tls import apply_kubernetes_tls_policy
from app.core.startup import StartupValidator, run_startup_checks

ROOT = Path(__file__).resolve().parents[2]
TEST_SECRET = "unit-test-only-secret-0123456789abcdef0123456789"


@pytest.fixture(autouse=True)
def local_security_settings(monkeypatch):
    monkeypatch.setenv("ENVIRONMENT", "development")
    monkeypatch.delenv("ENV", raising=False)
    monkeypatch.setattr(settings, "DEBUG", True)
    monkeypatch.setattr(settings, "REDIS_ENABLED", False)
    monkeypatch.setattr(settings, "K8S_SKIP_TLS_VERIFY", False)
    monkeypatch.setattr(settings, "FALCO_WEBHOOK_SECRET", TEST_SECRET)
    _local_nonces.clear()


def test_production_rejects_missing_and_placeholder_secrets():
    class ProductionSettings:
        SECRET_KEY = "replace-with-at-least-32-random-characters"
        DEFAULT_ADMIN_PASSWORD = "replace-with-a-local-password"
        FALCO_WEBHOOK_SECRET = "replace-with-at-least-32-random-characters"
        DEBUG = False
        DEMO_MODE = False
        DATABASE_URL = "postgresql+asyncpg://user:pass@db:5432/cloudguard"
        USE_DATABASE_AUTH = True
        CORS_ORIGINS = ["https://cloudguard.example"]
        REDIS_ENABLED = True
        REDIS_URL = "redis://redis:6379/0"
        OAUTH_ENABLED = False

    validator = StartupValidator(ProductionSettings())
    assert validator.validate_all() is False
    failures = {result.name for result in validator.results if not result.passed}
    assert {"SECRET_KEY", "ADMIN_PASSWORD", "FALCO_WEBHOOK_SECRET", "FALCO_REPLAY_PROTECTION"} <= failures


def test_repeated_characters_are_not_accepted_as_high_entropy_secrets():
    class WeakSecretSettings:
        SECRET_KEY = "s" * 64
        DEFAULT_ADMIN_PASSWORD = "Strong+N7xQ4pL2vR9cT!"
        FALCO_WEBHOOK_SECRET = "Falco-Qx7Pz9Lm4Vt2N6-Wa8Rc3Yj5Hk1"
        DEBUG = False
        DEMO_MODE = False
        DATABASE_URL = "postgresql+asyncpg://user:pass@db:5432/cloudguard"
        USE_DATABASE_AUTH = True
        CORS_ORIGINS = ["https://cloudguard.example"]
        REDIS_ENABLED = True
        REDIS_URL = "rediss://:unit-test-redis-password@redis:6379/0"
        OAUTH_ENABLED = False

    validator = StartupValidator(WeakSecretSettings())
    assert validator.validate_all() is False
    secret_key_result = next(result for result in validator.results if result.name == "SECRET_KEY")
    assert not secret_key_result.passed


def test_development_startup_rejects_missing_mandatory_auth_secrets():
    class DevelopmentSettings:
        SECRET_KEY = ""
        DEFAULT_ADMIN_PASSWORD = ""
        FALCO_WEBHOOK_SECRET = ""
        DEBUG = True
        DEMO_MODE = False
        DATABASE_URL = ""
        USE_DATABASE_AUTH = False
        CORS_ORIGINS = ["http://localhost:3000"]
        REDIS_ENABLED = False
        REDIS_URL = ""
        OAUTH_ENABLED = False

    with pytest.raises(SystemExit):
        run_startup_checks(DevelopmentSettings(), block_on_failure=True)


def test_missing_admin_password_does_not_seed_empty_password_users(monkeypatch):
    from app.services.auth_service import AuthService

    monkeypatch.setattr(settings, "DEFAULT_ADMIN_PASSWORD", "")
    service = AuthService()
    service._initialize()
    assert service._users == {}


def test_kubernetes_tls_verification_is_default_and_development_opt_out_is_explicit(monkeypatch):
    configuration = SimpleNamespace(verify_ssl=False, assert_hostname=False)
    apply_kubernetes_tls_policy(configuration)
    assert configuration.verify_ssl is True
    assert configuration.assert_hostname is True

    monkeypatch.setattr(settings, "K8S_SKIP_TLS_VERIFY", True)
    apply_kubernetes_tls_policy(configuration)
    assert configuration.verify_ssl is False
    assert configuration.assert_hostname is False


def test_kubernetes_tls_opt_out_is_rejected_outside_debug_development(monkeypatch):
    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setattr(settings, "DEBUG", False)
    monkeypatch.setattr(settings, "K8S_SKIP_TLS_VERIFY", True)
    with pytest.raises(ValueError, match="cannot be disabled"):
        apply_kubernetes_tls_policy(SimpleNamespace())


@pytest.mark.asyncio
async def test_falco_signature_valid_invalid_and_replay(monkeypatch):
    timestamp = str(int(time.time()))
    nonce = uuid.uuid4().hex
    body = b'{"rule":"Terminal shell","output":"test event"}'
    signature = sign_falco_payload(TEST_SECRET, timestamp, nonce, body)

    await verify_falco_request(secret=TEST_SECRET, timestamp=timestamp, nonce=nonce, signature=signature, body=body)
    with pytest.raises(FalcoWebhookAuthError, match="already been used"):
        await verify_falco_request(secret=TEST_SECRET, timestamp=timestamp, nonce=nonce, signature=signature, body=body)

    with pytest.raises(FalcoWebhookAuthError, match="Invalid Falco webhook signature"):
        await verify_falco_request(
            secret=TEST_SECRET,
            timestamp=timestamp,
            nonce=uuid.uuid4().hex,
            signature="sha256=" + "0" * 64,
            body=body,
        )


@pytest.mark.asyncio
async def test_falco_stale_timestamp_and_missing_secret_are_rejected():
    body = b"{}"
    timestamp = str(int(time.time()) - 600)
    nonce = uuid.uuid4().hex
    signature = sign_falco_payload(TEST_SECRET, timestamp, nonce, body)
    with pytest.raises(FalcoWebhookAuthError, match="outside the allowed"):
        await verify_falco_request(secret=TEST_SECRET, timestamp=timestamp, nonce=nonce, signature=signature, body=body)
    with pytest.raises(FalcoWebhookAuthError, match="not configured"):
        await verify_falco_request(secret="", timestamp=timestamp, nonce=nonce, signature=signature, body=body)


def test_falco_webhook_rejects_unauthorized_and_accepts_valid_signature(test_client, monkeypatch):
    from app.api.routes import cloudguard_routes

    async def accepted(payload):
        return {"accepted": True, "rule": payload.rule}

    monkeypatch.setattr(cloudguard_routes.runtime_threat_service, "ingest_falco_event", accepted)
    monkeypatch.setattr(settings, "FALCO_WEBHOOK_SECRET", TEST_SECRET)
    body = b'{"rule":"Terminal shell","output":"signed test"}'
    denied = test_client.post("/api/v1/cloudguard/runtime/falco/webhook", content=body)
    assert denied.status_code == 401

    timestamp = str(int(time.time()))
    nonce = uuid.uuid4().hex
    signature = sign_falco_payload(TEST_SECRET, timestamp, nonce, body)
    accepted_response = test_client.post(
        "/api/v1/cloudguard/runtime/falco/webhook",
        content=body,
        headers={
            "X-CloudGuard-Timestamp": timestamp,
            "X-CloudGuard-Nonce": nonce,
            "X-CloudGuard-Signature": signature,
        },
    )
    assert accepted_response.status_code == 200
    assert accepted_response.json() == {"accepted": True, "rule": "Terminal shell"}


def test_signed_falco_event_is_live_and_replay_is_rejected(test_client, monkeypatch):
    monkeypatch.setattr(settings, "FALCO_WEBHOOK_SECRET", TEST_SECRET)
    monkeypatch.setattr(settings, "REDIS_ENABLED", False)
    timestamp = str(int(time.time()))
    nonce = uuid.uuid4().hex
    cluster_id = f"falco-test-{uuid.uuid4().hex[:8]}"
    body = (
        '{"rule":"CloudGuard controlled verification event","priority":"Warning",'
        f'"output":"test-only event {uuid.uuid4().hex}","cluster_id":"{cluster_id}",'
        '"output_fields":{"k8s.pod.name":"test-only-pod","k8s.ns.name":"test-only"}}'
    ).encode()
    signature = sign_falco_payload(TEST_SECRET, timestamp, nonce, body)
    headers = {
        "X-CloudGuard-Timestamp": timestamp,
        "X-CloudGuard-Nonce": nonce,
        "X-CloudGuard-Signature": signature,
    }

    response = test_client.post("/api/v1/cloudguard/runtime/falco/webhook", content=body, headers=headers)
    assert response.status_code == 200
    assert response.json()["provenance"] == "live"

    replay = test_client.post("/api/v1/cloudguard/runtime/falco/webhook", content=body, headers=headers)
    assert replay.status_code == 401
    assert "already been used" in replay.json()["detail"]


def test_kubernetes_monitoring_rbac_is_limited_to_read_only_discovery():
    documents = [doc for doc in yaml.safe_load_all((ROOT / "k8s/rbac.yaml").read_text()) if doc]
    monitor_account = next(doc for doc in documents if doc.get("kind") == "ServiceAccount")
    monitor_role = next(doc for doc in documents if doc.get("kind") == "ClusterRole")
    monitor_binding = next(doc for doc in documents if doc.get("kind") == "ClusterRoleBinding")
    expected_permissions = {
        ("", "nodes"),
        ("", "namespaces"),
        ("", "pods"),
        ("", "services"),
        ("", "endpoints"),
        ("", "events"),
        ("apps", "deployments"),
        ("discovery.k8s.io", "endpointslices"),
        ("metrics.k8s.io", "nodes"),
        ("metrics.k8s.io", "pods"),
    }
    configured_permissions = {
        (api_group, resource)
        for rule in monitor_role["rules"]
        for api_group in rule["apiGroups"]
        for resource in rule["resources"]
    }
    assert configured_permissions == expected_permissions
    assert monitor_account["metadata"]["name"] == "cloudguard-monitor"
    assert monitor_account["automountServiceAccountToken"] is True
    assert all(set(rule["verbs"]) == {"get", "list"} for rule in monitor_role["rules"])
    assert monitor_binding["roleRef"]["name"] == "cloudguard-monitor-readonly"
    assert monitor_binding["subjects"] == [{
        "kind": "ServiceAccount",
        "name": "cloudguard-monitor",
        "namespace": "cloudguard",
    }]
    assert not any(doc.get("kind") in {"Role", "RoleBinding"} for doc in documents)


def test_helm_monitoring_rbac_has_no_write_permissions():
    values = yaml.safe_load((ROOT / "charts/kubesight/values.yaml").read_text())
    rules = values["rbac"]["clusterRole"]["rules"]
    assert all(set(rule["verbs"]) <= {"get", "list", "watch"} for rule in rules)
    assert values["remediationRbac"]["enabled"] is False
    assert values["remediationRbac"]["rules"] == [
        {"apiGroups": ["apps"], "resources": ["deployments/scale"], "verbs": ["get", "patch"]}
    ]


def test_production_manifest_uses_external_credentials_and_readonly_account():
    documents = [doc for doc in yaml.safe_load_all((ROOT / "k8s/cloudguard-k8s.yaml").read_text()) if doc]
    assert not any(doc.get("kind") == "Secret" for doc in documents)
    deployment = next(doc for doc in documents if doc.get("kind") == "Deployment" and doc["metadata"]["name"] == "cloudguard-backend")
    assert deployment["spec"]["template"]["spec"]["serviceAccountName"] == "cloudguard-monitor"
    backend_container = deployment["spec"]["template"]["spec"]["containers"][0]
    assert backend_container["envFrom"] == [
        {"configMapRef": {"name": "cloudguard-config"}},
        {"secretRef": {"name": "cloudguard-secrets"}},
    ]
    backend_env = backend_container["env"]
    assert {"name": "K8S_IN_CLUSTER", "value": "true"} in backend_env
    secret_keys = {
        item["valueFrom"]["secretKeyRef"]["key"]
        for item in backend_env
        if item.get("valueFrom", {}).get("secretKeyRef")
    }
    assert secret_keys == {
        "SECRET_KEY",
        "DEFAULT_ADMIN_PASSWORD",
        "DATABASE_URL",
        "FALCO_WEBHOOK_SECRET",
        "REDIS_URL",
    }
    assert "CORS_ORIGINS" not in secret_keys


def test_cloudguard_services_select_existing_backend_and_frontend_pods():
    documents = [doc for doc in yaml.safe_load_all((ROOT / "k8s/cloudguard-k8s.yaml").read_text()) if doc]
    services = {doc["metadata"]["name"]: doc for doc in documents if doc.get("kind") == "Service"}
    assert services["backend"]["spec"]["selector"] == {"app": "backend"}
    assert services["frontend"]["spec"]["selector"] == {"app": "frontend"}
    assert "proxy_pass http://backend:8000/api/;" in (ROOT / "frontend/nginx.conf").read_text()


def test_compose_requires_credentials_and_binds_database_cache_to_loopback():
    compose = yaml.safe_load((ROOT / "docker-compose.yml").read_text())
    postgres = compose["services"]["postgres"]
    redis = compose["services"]["redis"]
    backend_environment = compose["services"]["backend"]["environment"]
    assert "${POSTGRES_PASSWORD:?" in postgres["environment"]["POSTGRES_PASSWORD"]
    assert any("${SECRET_KEY:?" in item for item in backend_environment)
    assert any("${DEFAULT_ADMIN_PASSWORD:?" in item for item in backend_environment)
    assert any("ENVIRONMENT=${ENVIRONMENT:-development}" in item for item in backend_environment)
    assert postgres["ports"][0].startswith("127.0.0.1:")
    assert redis["ports"][0].startswith("127.0.0.1:")


def test_env_example_uses_placeholders_instead_of_working_credentials():
    values = {}
    for line in (ROOT / ".env.example").read_text().splitlines():
        if "=" in line and not line.lstrip().startswith("#"):
            key, value = line.split("=", 1)
            values[key] = value
    for key in ("POSTGRES_PASSWORD", "SECRET_KEY", "DEFAULT_ADMIN_PASSWORD", "FALCO_WEBHOOK_SECRET"):
        assert values[key].startswith("replace-with-")
    assert "admin123" not in values["DEFAULT_ADMIN_PASSWORD"]

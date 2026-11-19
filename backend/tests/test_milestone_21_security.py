"""Focused regression tests for the Milestone 2.1 security fixes."""

import importlib
import copy
from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from app.core import kubernetes_client
from app.core.config import settings
from app.core.startup import StartupValidator, is_effective_production
from app.schemas.gitflow import DeploymentStatus, Environment
from app.services.argocd_service import ArgoCDService
from app.services.argocd_deployment_service import ArgoCDDeploymentService
from app.services.auth_service import AuthService
from app.services.auth_service_db import create_default_admin
from app.services.k8s_deployment_service import K8sDeploymentService
from app.services.remediation_planner_service import RemediationPlannerService, _remediation_store


def test_kubeconfig_insecure_flag_is_overridden_by_shared_policy(monkeypatch):
    configuration = SimpleNamespace(
        host="https://cluster.example",
        verify_ssl=False,
        assert_hostname=False,
        ssl_ca_cert="/tmp/cluster-ca.crt",
    )
    monkeypatch.setattr(kubernetes_client.config, "load_kube_config", lambda **kwargs: None)
    monkeypatch.setattr(
        kubernetes_client.client.Configuration,
        "get_default_copy",
        staticmethod(lambda: configuration),
    )
    monkeypatch.setattr(
        kubernetes_client.client.Configuration,
        "set_default",
        staticmethod(lambda value: None),
    )
    monkeypatch.setattr(settings, "K8S_SKIP_TLS_VERIFY", False)
    monkeypatch.setattr(settings, "DEBUG", False)

    loaded = kubernetes_client.load_kubernetes_configuration(in_cluster=False, config_file="test-kubeconfig")

    assert loaded.verify_ssl is True
    assert loaded.assert_hostname is True
    assert loaded.ssl_ca_cert == "/tmp/cluster-ca.crt"


def test_in_cluster_configuration_uses_service_account_credentials(monkeypatch):
    configuration = SimpleNamespace(
        host="https://kubernetes.default.svc",
        verify_ssl=True,
        assert_hostname=True,
        ssl_ca_cert="/var/run/secrets/kubernetes.io/serviceaccount/ca.crt",
    )
    loaded_in_cluster = []
    monkeypatch.setattr(kubernetes_client.config, "load_incluster_config", lambda: loaded_in_cluster.append(True))
    monkeypatch.setattr(
        kubernetes_client.client.Configuration,
        "get_default_copy",
        staticmethod(lambda: configuration),
    )
    monkeypatch.setattr(
        kubernetes_client.client.Configuration,
        "set_default",
        staticmethod(lambda value: None),
    )
    monkeypatch.setattr(settings, "K8S_SKIP_TLS_VERIFY", False)
    monkeypatch.setattr(settings, "DEBUG", False)

    loaded = kubernetes_client.load_kubernetes_configuration(in_cluster=True)

    assert loaded_in_cluster == [True]
    assert loaded is configuration
    assert loaded.verify_ssl is True
    assert loaded.assert_hostname is True


def test_production_environment_takes_precedence_when_debug_is_true(monkeypatch):
    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setattr(settings, "DEBUG", True)
    assert is_effective_production(settings) is True

    class InvalidProductionSettings:
        ENVIRONMENT = "production"
        DEBUG = True
        SECRET_KEY = ""
        DEFAULT_ADMIN_PASSWORD = ""
        FALCO_WEBHOOK_SECRET = ""
        DATABASE_URL = ""
        USE_DATABASE_AUTH = True
        REDIS_ENABLED = True
        REDIS_URL = "redis://redis:6379/0"
        CORS_ORIGINS = ["https://cloudguard.example"]
        OAUTH_ENABLED = False
        DEMO_MODE = False

    validator = StartupValidator(InvalidProductionSettings())
    assert validator.validate_all() is False
    assert any(result.name == "SECRET_KEY" and not result.passed for result in validator.results)


def test_settings_environment_activates_production_without_process_override(monkeypatch):
    monkeypatch.delenv("ENVIRONMENT", raising=False)
    monkeypatch.delenv("ENV", raising=False)
    configured = SimpleNamespace(ENVIRONMENT="production", DEBUG=True)
    assert is_effective_production(configured) is True


def test_predictable_long_production_password_is_rejected(monkeypatch):
    monkeypatch.setenv("ENVIRONMENT", "production")
    class PredictablePasswordSettings:
        ENVIRONMENT = "production"
        DEBUG = True
        SECRET_KEY = "yB7nQ4wX9mK2vP6aR3cT8zL5dF1hJ0sG"
        DEFAULT_ADMIN_PASSWORD = "admin123456789!"
        FALCO_WEBHOOK_SECRET = "Falco-Qx7Pz9Lm4Vt2N6-Wa8Rc3Yj5Hk1"
        DATABASE_URL = "postgresql+asyncpg://user:pass@db:5432/cloudguard"
        USE_DATABASE_AUTH = True
        REDIS_ENABLED = True
        REDIS_URL = "rediss://:strong-redis-password@redis:6379/0"
        CORS_ORIGINS = ["https://cloudguard.example"]
        OAUTH_ENABLED = False
        DEMO_MODE = False

    validator = StartupValidator(PredictablePasswordSettings())
    validator.validate_all()
    admin_result = next(result for result in validator.results if result.name == "ADMIN_PASSWORD")
    assert admin_result.passed is False
    assert "12 characters" in admin_result.message


def test_argocd_tls_verification_is_default_and_production_opt_out_rejected(monkeypatch):
    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setattr(settings, "DEBUG", True)
    assert ArgoCDService(server_url="https://argocd.example").insecure is False
    with pytest.raises(ValueError, match="cannot be disabled in production"):
        ArgoCDService(server_url="https://argocd.example", insecure=True)


@pytest.mark.asyncio
async def test_argocd_deployment_does_not_run_with_production_tls_opt_out(monkeypatch):
    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setattr(settings, "DEBUG", True)
    service = ArgoCDDeploymentService()
    monkeypatch.setattr(service, "_ensure_repo_added", AsyncMock(side_effect=AssertionError("must not deploy")))

    result = await service.deploy(insecure=True)

    assert result["success"] is False
    assert "cannot be disabled in production" in result["message"]


def test_in_memory_auth_seeds_only_the_configured_admin(monkeypatch):
    monkeypatch.setattr(settings, "DEFAULT_ADMIN_PASSWORD", "test-only-admin-passphrase")
    service = AuthService()
    service._initialize()
    assert [user["username"] for user in service._users.values()] == ["admin"]


@pytest.mark.asyncio
async def test_database_auth_seeds_only_admin_and_preserves_existing_users(monkeypatch):
    monkeypatch.setattr(settings, "DEFAULT_ADMIN_PASSWORD", "Test-only-Admin-Passphrase-9xQ")

    class FakeResult:
        def __init__(self, count):
            self.count = count

        def scalar(self):
            return self.count

    class FakeSession:
        def __init__(self, count):
            self.count = count
            self.added = []
            self.committed = False

        async def execute(self, statement):
            return FakeResult(self.count)

        def add(self, user):
            self.added.append(user)

        async def commit(self):
            self.committed = True

    empty_session = FakeSession(0)
    await create_default_admin(empty_session)
    assert len(empty_session.added) == 1
    assert empty_session.added[0].username == "admin"
    assert empty_session.committed is True

    existing_session = FakeSession(2)
    await create_default_admin(existing_session)
    assert existing_session.added == []
    assert existing_session.committed is False


@pytest.mark.asyncio
async def test_generic_remediation_is_unavailable_without_authorized_executor(monkeypatch):
    plan = {"remediation_id": "M21-TEST", "status": "pending", "proposed_yaml": "kind: Pod"}
    monkeypatch.setitem(_remediation_store, "M21-TEST", plan)
    monkeypatch.setattr(
        "app.services.remediation_planner_service.asyncio.create_subprocess_exec",
        AsyncMock(side_effect=AssertionError("kubectl must not run")),
    )

    result = await RemediationPlannerService().approve_and_apply("M21-TEST")

    assert result["success"] is False
    assert result["available"] is False
    assert plan["status"] == "pending"


@pytest.mark.asyncio
async def test_rollback_with_no_restorable_deployments_fails(monkeypatch):
    service = K8sDeploymentService()
    original = DeploymentStatus(
        id="rollback-source",
        release_id="release-1",
        environment=Environment.DEVELOPMENT,
        namespace="default",
        status="deployed",
        services=[{"name": "deployment-without-snapshot", "status": "deployed"}],
        started_at=datetime.now(timezone.utc),
        rollback_available=True,
    )
    service._deployments[original.id] = original
    apps = SimpleNamespace(read_namespaced_deployment=AsyncMock())
    deployment_module = importlib.import_module("app.services.k8s_deployment_service")
    monkeypatch.setattr(deployment_module.kubernetes_service, "_apps_v1", apps)

    result = await service.rollback(original.id)

    assert result.status == "rollback_failed"
    assert not any(item.get("status") == "rolled_back" for item in result.services)
    apps.read_namespaced_deployment.assert_not_awaited()


@pytest.mark.asyncio
async def test_rollback_fails_if_api_does_not_apply_the_target_image(monkeypatch):
    service = K8sDeploymentService()
    original = DeploymentStatus(
        id="rollback-unapplied",
        release_id="release-2",
        environment=Environment.DEVELOPMENT,
        namespace="default",
        status="deployed",
        services=[{"name": "api", "old_image": "api:v1", "new_image": "api:v2"}],
        started_at=datetime.now(timezone.utc),
        rollback_available=True,
    )
    service._deployments[original.id] = original
    deployment = SimpleNamespace(
        metadata=SimpleNamespace(annotations={}),
        spec=SimpleNamespace(
            replicas=1,
            template=SimpleNamespace(
                metadata=SimpleNamespace(annotations={}),
                spec=SimpleNamespace(containers=[SimpleNamespace(image="api:v2")]),
            ),
        ),
        status=SimpleNamespace(ready_replicas=1, updated_replicas=1, observed_generation=1),
    )
    apps = SimpleNamespace(
        read_namespaced_deployment=lambda *args, **kwargs: copy.deepcopy(deployment),
        replace_namespaced_deployment=lambda *args, **kwargs: None,
    )
    deployment_module = importlib.import_module("app.services.k8s_deployment_service")
    monkeypatch.setattr(deployment_module.kubernetes_service, "_apps_v1", apps)
    monkeypatch.setattr(service, "_wait_for_rollout", AsyncMock(return_value=True))

    result = await service.rollback(original.id)

    assert result.status == "rollback_failed"
    assert not any(item.get("status") == "rolled_back" for item in result.services)

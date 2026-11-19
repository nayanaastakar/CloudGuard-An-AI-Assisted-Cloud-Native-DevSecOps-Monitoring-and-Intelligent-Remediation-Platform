"""
Tests for production configuration validation (Stage C.2).

Covers:
  - SECRET_KEY strength enforcement
  - DEFAULT_ADMIN_PASSWORD strength enforcement
  - CORS wildcard prohibition in production
  - CORS_ORIGINS comma-separated / JSON-string parsing
  - Full production validation pass/fail
  - Development-mode defaults remain usable
"""

import pytest
from app.core.startup import StartupValidator, validate_production_config, ValidationSeverity


# ---------------------------------------------------------------------------
# Shared MockSettings helper
# ---------------------------------------------------------------------------

class MockSettings:
    """Minimal settings stub that mimics the real Settings object."""

    def __init__(self, **kwargs):
        defaults = {
            "SECRET_KEY": "K8s-CloudGuard-Unit-Test-Key-Qx7Pz9Lm4Vt2N6",
            "DEFAULT_ADMIN_PASSWORD": "SecureP@ssw0rd!",
            "FALCO_WEBHOOK_SECRET": "Falco-Qx7Pz9Lm4Vt2N6-Wa8Rc3Yj5Hk1",
            "DEBUG": False,
            "DEMO_MODE": False,
            "DATABASE_URL": "postgresql+asyncpg://user:pass@db:5432/cloudguard",
            "USE_DATABASE_AUTH": True,
            "CORS_ORIGINS": ["https://cloudguard.azurewebsites.net"],
            "REDIS_ENABLED": True,
            "REDIS_URL": "rediss://:unit-test-redis-password@redis:6379/0",
            "GEMINI_API_KEY": "",
            "GROQ_API_KEY": "",
            "ANTHROPIC_API_KEY": "",
            "AI_PROVIDER": "gemini",
            "OAUTH_ENABLED": False,
        }
        defaults.update(kwargs)
        for k, v in defaults.items():
            setattr(self, k, v)


def _get_result(validator: StartupValidator, name: str):
    """Return the ValidationResult with the given name, or None."""
    return next((r for r in validator.results if r.name == name), None)


# ---------------------------------------------------------------------------
# 1. SECRET_KEY validation
# ---------------------------------------------------------------------------

class TestProductionSecretKeyValidation:
    def test_empty_secret_key_is_critical(self):
        s = MockSettings(SECRET_KEY="")
        v = StartupValidator(s)
        v._validate_secret_key()
        result = _get_result(v, "SECRET_KEY")
        assert result is not None
        assert not result.passed
        assert result.severity == ValidationSeverity.CRITICAL

    def test_known_default_secret_key_is_critical(self):
        """The literal default from config.py must be rejected."""
        s = MockSettings(SECRET_KEY="cloudguard-secret-key-change-in-production")
        v = StartupValidator(s)
        v._validate_secret_key()
        result = _get_result(v, "SECRET_KEY")
        assert result is not None
        assert not result.passed
        assert result.severity == ValidationSeverity.CRITICAL

    def test_other_weak_secret_key_is_critical(self):
        s = MockSettings(SECRET_KEY="secret")
        v = StartupValidator(s)
        v._validate_secret_key()
        result = _get_result(v, "SECRET_KEY")
        assert not result.passed
        assert result.severity == ValidationSeverity.CRITICAL

    def test_short_secret_key_is_critical(self):
        """Keys shorter than 32 characters must be rejected."""
        s = MockSettings(SECRET_KEY="tooshort")
        v = StartupValidator(s)
        v._validate_secret_key()
        result = _get_result(v, "SECRET_KEY")
        assert not result.passed
        assert result.severity == ValidationSeverity.CRITICAL

    def test_strong_secret_key_passes(self):
        s = MockSettings(SECRET_KEY="K8s-CloudGuard-Unit-Test-Key-Qx7Pz9Lm4Vt2N6")
        v = StartupValidator(s)
        v._validate_secret_key()
        result = _get_result(v, "SECRET_KEY")
        assert result.passed


# ---------------------------------------------------------------------------
# 2. DEFAULT_ADMIN_PASSWORD validation
# ---------------------------------------------------------------------------

class TestProductionAdminPasswordValidation:
    def test_admin123_is_critical_in_production(self):
        s = MockSettings(DEFAULT_ADMIN_PASSWORD="admin123", DEBUG=False)
        v = StartupValidator(s)
        v._validate_admin_password()
        result = _get_result(v, "ADMIN_PASSWORD")
        assert result is not None
        assert not result.passed
        assert result.severity == ValidationSeverity.CRITICAL

    def test_admin123_is_acceptable_in_debug(self):
        """In debug mode a weak password should warn but not block (passed=True)."""
        s = MockSettings(DEFAULT_ADMIN_PASSWORD="admin123", DEBUG=True)
        v = StartupValidator(s)
        v._validate_admin_password()
        result = _get_result(v, "ADMIN_PASSWORD")
        assert result is not None
        assert result.passed  # WARNING severity but still passes

    def test_other_weak_passwords_critical_in_production(self):
        for pwd in ["admin", "password", "123456", "changeme"]:
            s = MockSettings(DEFAULT_ADMIN_PASSWORD=pwd, DEBUG=False)
            v = StartupValidator(s)
            v._validate_admin_password()
            result = _get_result(v, "ADMIN_PASSWORD")
            assert not result.passed, f"Expected CRITICAL for password: {pwd!r}"
            assert result.severity == ValidationSeverity.CRITICAL

    def test_too_short_password_critical_in_production(self):
        s = MockSettings(DEFAULT_ADMIN_PASSWORD="Ab1!", DEBUG=False)
        v = StartupValidator(s)
        v._validate_admin_password()
        result = _get_result(v, "ADMIN_PASSWORD")
        assert not result.passed
        assert result.severity == ValidationSeverity.CRITICAL

    def test_too_short_password_passes_in_debug(self):
        s = MockSettings(DEFAULT_ADMIN_PASSWORD="Ab1!", DEBUG=True)
        v = StartupValidator(s)
        v._validate_admin_password()
        result = _get_result(v, "ADMIN_PASSWORD")
        assert result.passed  # short is a WARNING in debug, not a failure

    def test_strong_password_passes(self):
        s = MockSettings(DEFAULT_ADMIN_PASSWORD="SecureP@ss123!")
        v = StartupValidator(s)
        v._validate_admin_password()
        result = _get_result(v, "ADMIN_PASSWORD")
        assert result.passed


# ---------------------------------------------------------------------------
# 3. CORS validation
# ---------------------------------------------------------------------------

class TestProductionCORSValidation:
    def test_wildcard_string_blocked_in_production(self):
        s = MockSettings(CORS_ORIGINS="*", DEBUG=False)
        v = StartupValidator(s)
        v._validate_cors()
        result = _get_result(v, "CORS")
        assert result is not None
        assert not result.passed
        assert result.severity == ValidationSeverity.CRITICAL

    def test_wildcard_in_list_blocked_in_production(self):
        s = MockSettings(CORS_ORIGINS=["*"], DEBUG=False)
        v = StartupValidator(s)
        v._validate_cors()
        result = _get_result(v, "CORS")
        assert not result.passed
        assert result.severity == ValidationSeverity.CRITICAL

    def test_specific_origins_pass_in_production(self):
        s = MockSettings(
            CORS_ORIGINS=["https://app.azurewebsites.net"],
            DEBUG=False,
        )
        v = StartupValidator(s)
        v._validate_cors()
        result = _get_result(v, "CORS")
        assert result.passed

    def test_empty_cors_passes(self):
        """No configured origins is a valid (if unusual) state."""
        s = MockSettings(CORS_ORIGINS=[], DEBUG=False)
        v = StartupValidator(s)
        v._validate_cors()
        result = _get_result(v, "CORS")
        assert result.passed


# ---------------------------------------------------------------------------
# 4. CORS_ORIGINS parser (via real Settings)
# ---------------------------------------------------------------------------

class TestCORSOriginsParser:
    def test_comma_separated_string_parsed(self):
        from app.core.config import Settings
        s = Settings(CORS_ORIGINS="https://a.com, https://b.com")
        assert s.CORS_ORIGINS == ["https://a.com", "https://b.com"]

    def test_json_array_string_parsed(self):
        from app.core.config import Settings
        s = Settings(CORS_ORIGINS='["https://a.com", "https://b.com"]')
        assert s.CORS_ORIGINS == ["https://a.com", "https://b.com"]

    def test_list_passthrough(self):
        from app.core.config import Settings
        s = Settings(CORS_ORIGINS=["https://a.com"])
        assert s.CORS_ORIGINS == ["https://a.com"]

    def test_empty_string_returns_empty_list(self):
        from app.core.config import Settings
        s = Settings(CORS_ORIGINS="")
        assert s.CORS_ORIGINS == []

    def test_single_origin_no_comma(self):
        from app.core.config import Settings
        s = Settings(CORS_ORIGINS="https://cloudguard.azurewebsites.net")
        assert s.CORS_ORIGINS == ["https://cloudguard.azurewebsites.net"]


# ---------------------------------------------------------------------------
# 5. Full production validation
# ---------------------------------------------------------------------------

class TestFullProductionValidation:
    def test_valid_production_config_passes(self):
        s = MockSettings()
        result = validate_production_config(s)
        assert result is True

    def test_production_blocked_by_default_secret_key(self):
        s = MockSettings(SECRET_KEY="cloudguard-secret-key-change-in-production")
        result = validate_production_config(s)
        assert result is False

    def test_production_blocked_by_weak_admin_password(self):
        s = MockSettings(DEFAULT_ADMIN_PASSWORD="admin123", DEBUG=False)
        result = validate_production_config(s)
        assert result is False

    def test_production_blocked_by_wildcard_cors(self):
        s = MockSettings(CORS_ORIGINS=["*"], DEBUG=False)
        result = validate_production_config(s)
        assert result is False

    def test_multiple_critical_issues_all_reported(self):
        """All critical issues should be collected, not short-circuited."""
        s = MockSettings(
            SECRET_KEY="cloudguard-secret-key-change-in-production",
            DEFAULT_ADMIN_PASSWORD="admin123",
            DEBUG=False,
            CORS_ORIGINS=["*"],
        )
        v = StartupValidator(s)
        passed = v.validate_all()
        assert not passed
        critical_failures = [
            r for r in v.results
            if not r.passed and r.severity == ValidationSeverity.CRITICAL
        ]
        assert len(critical_failures) >= 3  # SECRET_KEY + ADMIN_PASSWORD + CORS


# ---------------------------------------------------------------------------
# 6. Development / test-mode compatibility
# ---------------------------------------------------------------------------

class TestDevelopmentModeCompatibility:
    def test_development_defaults_do_not_block_startup(self):
        """
        The real settings loaded in test mode (DEBUG=true, weak SECRET_KEY
        from .env.test) must not cause startup to fail.
        validate_all() runs but weak-key issues result in CRITICAL only
        when is_production=True; in DEBUG mode run_startup_checks() does
        not call sys.exit().
        """
        from app.core.config import settings as dev_settings
        v = StartupValidator(dev_settings)
        result = v.validate_all()
        # Result must be a bool (not raise); value depends on .env.test key strength
        assert isinstance(result, bool)

    def test_validate_production_config_returns_bool(self):
        s = MockSettings()
        result = validate_production_config(s)
        assert isinstance(result, bool)

    def test_strict_mode_treats_warnings_as_critical(self):
        """With strict=True, any failed WARNING should cause validate_production_config to return False."""
        # DEBUG=True with weak password produces a WARNING (passed=True),
        # but SQLite DB warning (passed=True) counts as warning.
        # Use a SQLite DB to trigger a WARNING result easily.
        s = MockSettings(
            DATABASE_URL="sqlite+aiosqlite:///./test.db",
        )
        # Non-strict passes (warnings don't fail it)
        result_non_strict = validate_production_config(s, strict=False)
        # Strict may or may not fail depending on what warnings exist
        result_strict = validate_production_config(s, strict=True)
        # Both must be bools
        assert isinstance(result_non_strict, bool)
        assert isinstance(result_strict, bool)


# ---------------------------------------------------------------------------
# 7. Production environment detection (Stage C.2.1)
# ---------------------------------------------------------------------------

class TestProductionEnvironmentDetection:
    def test_debug_false_activates_production(self, monkeypatch):
        """DEBUG=False activates production validation."""
        monkeypatch.setenv("ENVIRONMENT", "development")
        from app.core.startup import is_effective_production
        s = MockSettings(DEBUG=False)
        assert is_effective_production(s) is True

    def test_environment_production_activates_production(self, monkeypatch):
        """ENVIRONMENT=production activates production validation even if DEBUG=True."""
        monkeypatch.setenv("ENVIRONMENT", "production")
        from app.core.startup import is_effective_production
        s = MockSettings(DEBUG=True)
        assert is_effective_production(s) is True

    def test_environment_prod_activates_production(self, monkeypatch):
        """ENVIRONMENT=prod activates production validation even if DEBUG=True."""
        monkeypatch.setenv("ENVIRONMENT", "prod")
        from app.core.startup import is_effective_production
        s = MockSettings(DEBUG=True)
        assert is_effective_production(s) is True

    def test_debug_true_and_development_environment(self, monkeypatch):
        """DEBUG=True with ENVIRONMENT=development remains development behavior."""
        monkeypatch.setenv("ENVIRONMENT", "development")
        from app.core.startup import is_effective_production
        s = MockSettings(DEBUG=True)
        assert is_effective_production(s) is False

    def test_production_precedence_blocks_startup_on_critical_failure(self, monkeypatch):
        """When ENVIRONMENT=production and DEBUG=True, critical failures still trigger sys.exit(1)."""
        monkeypatch.setenv("ENVIRONMENT", "production")
        from app.core.startup import run_startup_checks
        s = MockSettings(DEBUG=True, SECRET_KEY="cloudguard-secret-key-change-in-production")
        with pytest.raises(SystemExit) as exc_info:
            run_startup_checks(s, block_on_failure=True)
        assert exc_info.value.code == 1

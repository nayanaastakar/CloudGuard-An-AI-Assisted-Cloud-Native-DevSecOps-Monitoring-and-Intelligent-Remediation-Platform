"""
Production startup validation and initialization.
Validates configuration and performs security checks before the app starts.
"""

import logging
import math
import os
import re
import sys
from urllib.parse import urlsplit
from dataclasses import dataclass
from enum import Enum
from typing import List, Optional

logger = logging.getLogger(__name__)


class ValidationSeverity(Enum):
    """Severity level for validation issues."""
    CRITICAL = "critical"  # App should not start
    WARNING = "warning"    # App can start but issue should be fixed
    INFO = "info"          # Informational only


@dataclass
class ValidationResult:
    """Result of a single validation check."""
    name: str
    passed: bool
    severity: ValidationSeverity
    message: str
    recommendation: Optional[str] = None


class StartupValidator:
    """Validates application configuration for production readiness."""

    def __init__(self, settings):
        self.settings = settings
        self.results: List[ValidationResult] = []

    def validate_all(self) -> bool:
        """Run all validation checks. Returns True if no critical issues."""
        self._validate_secret_key()
        self._validate_admin_password()
        self._validate_webhook_and_kubernetes_security()
        self._validate_database()
        self._validate_cors()
        self._validate_debug_mode()
        self._validate_api_keys()
        self._validate_redis()
        self._validate_oauth()

        return self._report_results()

    def _add_result(
        self,
        name: str,
        passed: bool,
        severity: ValidationSeverity,
        message: str,
        recommendation: Optional[str] = None,
    ):
        self.results.append(
            ValidationResult(
                name=name,
                passed=passed,
                severity=severity,
                message=message,
                recommendation=recommendation,
            )
        )

    @staticmethod
    def _is_placeholder(value: str) -> bool:
        normalized = (value or "").strip().lower()
        markers = ("replace-with", "change-me", "change_in", "your_", "your-", "example", "generate-a")
        return any(marker in normalized for marker in markers)

    @staticmethod
    def _has_secret_entropy(value: str) -> bool:
        return StartupValidator._estimated_entropy_bits(value) >= 128 and not StartupValidator._has_predictable_pattern(value)

    @staticmethod
    def _has_password_entropy(value: str) -> bool:
        return StartupValidator._estimated_entropy_bits(value) >= 45 and not StartupValidator._has_predictable_pattern(value)

    @staticmethod
    def _estimated_entropy_bits(value: str) -> float:
        if not value:
            return 0.0
        frequencies = [value.count(char) / len(value) for char in set(value)]
        return -sum(frequency * math.log2(frequency) for frequency in frequencies) * len(value)

    @staticmethod
    def _has_predictable_pattern(value: str) -> bool:
        normalized = (value or "").lower()
        if any(pattern in normalized for pattern in ("qwerty", "asdfgh", "zxcvbn", "password", "admin")):
            return True

        # Reject long repeated substrings and ascending/descending alphanumeric runs.
        for period in range(1, min(8, len(normalized) // 2) + 1):
            if len(normalized) >= period * 4 and all(
                normalized[index] == normalized[index % period] for index in range(period, len(normalized))
            ):
                return True

        run_length = 1
        run_direction = 0
        for previous, current in zip(normalized, normalized[1:]):
            same_class = previous.isdigit() and current.isdigit() or previous.isalpha() and current.isalpha()
            delta = ord(current) - ord(previous)
            if same_class and abs(delta) == 1 and (run_direction in (0, delta)):
                run_length += 1
                run_direction = delta
                if run_length >= 5:
                    return True
            else:
                run_length = 1
                run_direction = 0
        return False

    def _validate_secret_key(self):
        """Ensure SECRET_KEY is properly configured."""
        secret_key = getattr(self.settings, "SECRET_KEY", "")

        # Check for default/weak keys
        weak_keys = [
            "your-secret-key-change-in-production",
            "cloudguard-secret-key-change-in-production",
            "secret",
            "changeme",
            "password",
            "123456",
        ]

        if not secret_key:
            self._add_result(
                "SECRET_KEY",
                False,
                ValidationSeverity.CRITICAL,
                "SECRET_KEY is not set",
                "Generate a secure key: python -c \"import secrets; print(secrets.token_urlsafe(64))\"",
            )
        elif (
            secret_key.lower() in weak_keys
            or len(secret_key) < 32
            or self._is_placeholder(secret_key)
            or not self._has_secret_entropy(secret_key)
        ):
            self._add_result(
                "SECRET_KEY",
                False,
                ValidationSeverity.CRITICAL,
                "SECRET_KEY is weak or default value",
                "Generate a secure key: python -c \"import secrets; print(secrets.token_urlsafe(64))\"",
            )
        else:
            self._add_result(
                "SECRET_KEY",
                True,
                ValidationSeverity.INFO,
                "SECRET_KEY is properly configured",
            )

    def _validate_admin_password(self):
        """Ensure default admin password is changed in production."""
        admin_password = getattr(self.settings, "DEFAULT_ADMIN_PASSWORD", "") or ""
        is_prod = is_effective_production(self.settings)

        # Check for default/weak passwords
        weak_passwords = [
            "admin123",
            "admin",
            "password",
            "123456",
            "changeme",
        ]

        if not admin_password:
            self._add_result(
                "ADMIN_PASSWORD",
                False,
                ValidationSeverity.CRITICAL,
                "DEFAULT_ADMIN_PASSWORD is not set",
                "Set a unique administrator password through the environment or deployment secret store",
            )
        elif self._is_placeholder(admin_password):
            self._add_result(
                "ADMIN_PASSWORD",
                False,
                ValidationSeverity.CRITICAL if is_prod else ValidationSeverity.WARNING,
                "DEFAULT_ADMIN_PASSWORD is a placeholder value",
                "Set a unique administrator password through the environment or deployment secret store",
            )
        elif admin_password.lower() in weak_passwords:
            if not is_prod:
                self._add_result(
                    "ADMIN_PASSWORD",
                    True,
                    ValidationSeverity.WARNING,
                    "Using default admin password (acceptable in DEBUG mode)",
                    "Set DEFAULT_ADMIN_PASSWORD env var for production",
                )
            else:
                self._add_result(
                    "ADMIN_PASSWORD",
                    False,
                    ValidationSeverity.CRITICAL,
                    "Using default/weak admin password in production",
                    "Generate secure password: python -c \"import secrets; print(secrets.token_urlsafe(16))\"",
                )
        elif len(admin_password) < (12 if is_prod else 8) or (
            is_prod and not self._has_password_entropy(admin_password)
        ):
            if not is_prod:
                self._add_result(
                    "ADMIN_PASSWORD",
                    True,
                    ValidationSeverity.WARNING,
                    "Admin password is shorter than 8 characters (acceptable in DEBUG mode)",
                    "Set a stronger DEFAULT_ADMIN_PASSWORD env var for production",
                )
            else:
                self._add_result(
                    "ADMIN_PASSWORD",
                    False,
                    ValidationSeverity.CRITICAL,
                    "Admin password must be at least 12 characters and resist predictable patterns",
                    "Generate secure password: python -c \"import secrets; print(secrets.token_urlsafe(16))\"",
                )
        else:
            self._add_result(
                "ADMIN_PASSWORD",
                True,
                ValidationSeverity.INFO,
                "Admin password is customized",
            )

    def _validate_webhook_and_kubernetes_security(self):
        """Require webhook authentication in production and reject insecure Kubernetes TLS."""
        is_prod = is_effective_production(self.settings)
        webhook_secret = getattr(self.settings, "FALCO_WEBHOOK_SECRET", "") or ""
        if (
            webhook_secret
            and (len(webhook_secret) < 32 or self._is_placeholder(webhook_secret) or not self._has_secret_entropy(webhook_secret))
        ) or (is_prod and not webhook_secret):
            self._add_result(
                "FALCO_WEBHOOK_SECRET",
                False,
                ValidationSeverity.CRITICAL,
                "FALCO_WEBHOOK_SECRET must contain at least 32 characters in production",
                "Configure a high-entropy secret in the deployment secret store",
            )
        else:
            self._add_result(
                "FALCO_WEBHOOK_SECRET",
                True,
                ValidationSeverity.INFO if webhook_secret else ValidationSeverity.WARNING,
                "Falco webhook authentication secret is configured" if webhook_secret else "Falco webhook endpoint is disabled until a secret is configured",
            )

        if getattr(self.settings, "K8S_SKIP_TLS_VERIFY", False) and is_prod:
            self._add_result(
                "K8S_SKIP_TLS_VERIFY",
                False,
                ValidationSeverity.CRITICAL,
                "Kubernetes TLS certificate verification cannot be disabled in production",
                "Set K8S_SKIP_TLS_VERIFY=false and configure the cluster CA certificate",
            )
        else:
            self._add_result(
                "K8S_SKIP_TLS_VERIFY",
                True,
                ValidationSeverity.INFO,
                "Kubernetes API TLS certificate verification is enabled",
            )
        redis_url = getattr(self.settings, "REDIS_URL", "") or ""
        parsed_redis_url = urlsplit(redis_url) if redis_url else None
        redis_secure = bool(parsed_redis_url and parsed_redis_url.scheme == "rediss" and parsed_redis_url.password)
        if is_prod and (not getattr(self.settings, "REDIS_ENABLED", True) or not redis_secure):
            self._add_result(
                "FALCO_REPLAY_PROTECTION",
                False,
                ValidationSeverity.CRITICAL,
                "Production replay protection requires enabled Redis over TLS with authentication",
                "Set REDIS_ENABLED=true and configure a private rediss:// URL with an ACL password",
            )

    def _validate_database(self):
        """Validate database configuration."""
        db_url = getattr(self.settings, "DATABASE_URL", "")
        use_db = getattr(self.settings, "USE_DATABASE_AUTH", False)

        if use_db:
            if not db_url:
                self._add_result(
                    "DATABASE",
                    False,
                    ValidationSeverity.CRITICAL,
                    "DATABASE_URL not set but USE_DATABASE_AUTH is enabled",
                    "Set DATABASE_URL environment variable",
                )
            elif "sqlite" in db_url.lower():
                self._add_result(
                    "DATABASE",
                    True,
                    ValidationSeverity.WARNING,
                    "Using SQLite database - not recommended for production",
                    "Use PostgreSQL for production deployments",
                )
            elif "localhost" in db_url or "127.0.0.1" in db_url:
                self._add_result(
                    "DATABASE",
                    True,
                    ValidationSeverity.WARNING,
                    "Database is configured to localhost",
                    "Ensure this is intentional for your deployment",
                )
            else:
                self._add_result(
                    "DATABASE",
                    True,
                    ValidationSeverity.INFO,
                    "Database is configured",
                )
        else:
            self._add_result(
                "DATABASE",
                True,
                ValidationSeverity.WARNING,
                "Using in-memory authentication (USE_DATABASE_AUTH=false)",
                "Enable database authentication for production",
            )

    def _validate_cors(self):
        """Validate CORS configuration."""
        cors_origins = getattr(self.settings, "CORS_ORIGINS", "")
        is_prod = is_effective_production(self.settings)

        has_wildcard = (cors_origins == "*") or (isinstance(cors_origins, (list, tuple, set)) and "*" in cors_origins)

        if has_wildcard and is_prod:
            self._add_result(
                "CORS",
                False,
                ValidationSeverity.CRITICAL,
                "CORS wildcard '*' is prohibited in production mode",
                "Restrict CORS_ORIGINS to specific domains (e.g., https://your-domain.azurewebsites.net)",
            )
        elif not cors_origins:
            self._add_result(
                "CORS",
                True,
                ValidationSeverity.INFO,
                "No CORS origins configured",
            )
        else:
            self._add_result(
                "CORS",
                True,
                ValidationSeverity.INFO,
                f"CORS configured with specific origins",
            )

    def _validate_debug_mode(self):
        """Validate debug mode is disabled for production."""
        debug = getattr(self.settings, "DEBUG", False)
        demo_mode = getattr(self.settings, "DEMO_MODE", False)

        if debug:
            self._add_result(
                "DEBUG_MODE",
                False,
                ValidationSeverity.WARNING,
                "DEBUG mode is enabled",
                "Set DEBUG=false for production",
            )
        else:
            self._add_result(
                "DEBUG_MODE",
                True,
                ValidationSeverity.INFO,
                "DEBUG mode is disabled",
            )

        if demo_mode:
            self._add_result(
                "DEMO_MODE",
                False,
                ValidationSeverity.WARNING,
                "DEMO_MODE is enabled - some security features may be relaxed",
                "Set DEMO_MODE=false for production",
            )

    def _validate_api_keys(self):
        """Validate API keys are set for enabled services."""
        gemini_key = getattr(self.settings, "GEMINI_API_KEY", "")
        anthropic_key = getattr(self.settings, "ANTHROPIC_API_KEY", "")
        github_token = getattr(self.settings, "GITHUB_TOKEN", "")

        if not gemini_key and not anthropic_key:
            self._add_result(
                "AI_PROVIDER",
                True,
                ValidationSeverity.INFO,
                "No AI provider API key configured - AI features disabled",
                "Set GEMINI_API_KEY or ANTHROPIC_API_KEY to enable AI features",
            )
        else:
            self._add_result(
                "AI_PROVIDER",
                True,
                ValidationSeverity.INFO,
                "AI provider configured",
            )

        if not github_token:
            self._add_result(
                "GITHUB",
                True,
                ValidationSeverity.INFO,
                "No GitHub token configured - GitHub integration disabled",
            )

    def _validate_redis(self):
        """Validate Redis configuration."""
        redis_url = getattr(self.settings, "REDIS_URL", "")
        use_redis = getattr(self.settings, "REDIS_ENABLED", getattr(self.settings, "USE_REDIS_CACHE", False))

        if use_redis and not redis_url:
            self._add_result(
                "REDIS",
                False,
                ValidationSeverity.WARNING,
                "REDIS_ENABLED is true but REDIS_URL is not set",
                "Set REDIS_URL or disable REDIS_ENABLED outside production",
            )
        elif use_redis:
            self._add_result(
                "REDIS",
                True,
                ValidationSeverity.INFO,
                "Redis cache is configured",
            )
        else:
            self._add_result(
                "REDIS",
                True,
                ValidationSeverity.INFO,
                "Using in-memory cache (Redis disabled)",
            )

    def _validate_oauth(self):
        """Validate OAuth configuration."""
        oauth_providers = []

        if getattr(self.settings, "GOOGLE_CLIENT_ID", ""):
            oauth_providers.append("Google")
        if getattr(self.settings, "GITHUB_CLIENT_ID", ""):
            oauth_providers.append("GitHub")
        if getattr(self.settings, "GITLAB_CLIENT_ID", ""):
            oauth_providers.append("GitLab")

        if oauth_providers:
            self._add_result(
                "OAUTH",
                True,
                ValidationSeverity.INFO,
                f"OAuth providers configured: {', '.join(oauth_providers)}",
            )
        else:
            self._add_result(
                "OAUTH",
                True,
                ValidationSeverity.INFO,
                "No OAuth providers configured",
            )

    def _report_results(self) -> bool:
        """Report validation results and return True if no critical issues."""
        critical_count = 0
        warning_count = 0

        logger.info("=" * 60)
        logger.info("STARTUP VALIDATION RESULTS")
        logger.info("=" * 60)

        for result in self.results:
            status = "PASS" if result.passed else "FAIL"
            icon = "+" if result.passed else "!" if result.severity == ValidationSeverity.WARNING else "X"

            if result.severity == ValidationSeverity.CRITICAL and not result.passed:
                critical_count += 1
                logger.error(f"[{icon}] {result.name}: {result.message}")
                if result.recommendation:
                    logger.error(f"    Recommendation: {result.recommendation}")
            elif result.severity == ValidationSeverity.WARNING and not result.passed:
                warning_count += 1
                logger.warning(f"[{icon}] {result.name}: {result.message}")
                if result.recommendation:
                    logger.warning(f"    Recommendation: {result.recommendation}")
            else:
                logger.info(f"[{icon}] {result.name}: {result.message}")

        logger.info("=" * 60)
        logger.info(
            f"Validation complete: {len(self.results)} checks, "
            f"{critical_count} critical, {warning_count} warnings"
        )
        logger.info("=" * 60)

        if critical_count > 0:
            logger.critical(
                f"STARTUP BLOCKED: {critical_count} critical issue(s) must be resolved"
            )
            return False

        return True


def validate_production_config(settings, strict: bool = False) -> bool:
    """
    Validate configuration for production.

    Args:
        settings: Application settings object
        strict: If True, treat warnings as critical

    Returns:
        True if validation passes, False otherwise
    """
    validator = StartupValidator(settings)
    passed = validator.validate_all()

    if strict:
        warnings = sum(
            1 for r in validator.results
            if not r.passed and r.severity == ValidationSeverity.WARNING
        )
        if warnings > 0:
            logger.error(f"Strict mode: {warnings} warning(s) treated as critical")
            return False

    return passed


def is_effective_production(settings=None) -> bool:
    """
    Check if production validation and security requirements apply.
    Production mode is active if:
      - ENVIRONMENT (or ENV) is 'production' or 'prod', OR
      - (ENVIRONMENT is not 'development'/'dev'/'local'/'test' AND DEBUG is False)
    """
    configured_environment = os.environ.get("ENVIRONMENT", os.environ.get("ENV"))
    if configured_environment is None and settings is not None:
        configured_environment = getattr(settings, "ENVIRONMENT", None)
    env_str = (configured_environment or "development").lower()
    if env_str in {"prod", "production"}:
        return True
    if env_str in {"development", "dev", "local", "test", "testing", "ci"}:
        return False
    if settings is not None:
        return not getattr(settings, "DEBUG", False)
    return False


def run_startup_checks(settings, block_on_failure: bool = True) -> bool:
    """
    Run all startup checks and optionally block if they fail.

    Args:
        settings: Application settings object
        block_on_failure: If True, exit the application on critical failures

    Returns:
        True if all checks pass
    """
    effective_prod = is_effective_production(settings)

    logger.info(f"Running startup checks (production={effective_prod})")

    # Validate once so startup behavior and reported diagnostics use the same results.
    validator = StartupValidator(settings)
    config_valid = validator.validate_all()
    mandatory_secret_failure = any(
        not result.passed and result.name in {"SECRET_KEY", "ADMIN_PASSWORD", "FALCO_WEBHOOK_SECRET"}
        for result in validator.results
    )
    if block_on_failure and (mandatory_secret_failure or (not config_valid and effective_prod)):
        logger.critical("Application startup blocked due to configuration issues")
        sys.exit(1)

    return config_valid


# =============================================================================
# Environment Detection
# =============================================================================

def get_environment() -> str:
    """Detect the current environment."""
    configured_environment = os.environ.get("ENVIRONMENT", os.environ.get("ENV"))
    if configured_environment is None:
        from app.core.config import settings

        configured_environment = settings.ENVIRONMENT
    env = configured_environment or "development"
    return env.lower()


def is_production() -> bool:
    """Check if running in production environment."""
    return get_environment() in ("production", "prod")


def is_development() -> bool:
    """Check if running in development environment."""
    return get_environment() in ("development", "dev", "local")


def is_testing() -> bool:
    """Check if running in test environment."""
    return get_environment() in ("test", "testing", "ci")

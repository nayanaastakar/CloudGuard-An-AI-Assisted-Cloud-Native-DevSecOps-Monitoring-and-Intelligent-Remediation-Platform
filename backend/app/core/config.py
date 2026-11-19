import json
import sys
from functools import lru_cache
from typing import Optional, Union

from pydantic import field_validator

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    from pydantic import BaseModel as BaseSettings
    SettingsConfigDict = None


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "CloudGuard"
    APP_TITLE: str = "CloudGuard – An AI-Assisted Cloud-Native DevSecOps Monitoring and Intelligent Remediation Platform"
    APP_TAGLINE: str = "Secure, Analyse and Optimise Your Cloud-Native Infrastructure."
    APP_VERSION: str = "2.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    API_PREFIX: str = "/api/v1"
    DEMO_MODE: bool = False  # Enable demo data when K8s is unavailable

    # Security
    # Supplied by the environment/.env. Production startup rejects an empty value.
    SECRET_KEY: str = ""
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    # Supplied by the environment/.env. Do not ship a default administrator password.
    DEFAULT_ADMIN_PASSWORD: str = ""

    # Database
    DATABASE_URL: str = ""
    USE_DATABASE_AUTH: bool = True  # Uses PostgreSQL for auth, security findings, and audits

    # Redis
    REDIS_URL: str = "redis://localhost:6380/0"
    REDIS_ENABLED: bool = True

    # OAuth Providers
    OAUTH_ENABLED: bool = True
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    GITLAB_CLIENT_ID: str = ""
    GITLAB_CLIENT_SECRET: str = ""
    GITLAB_URL: str = "https://gitlab.com"
    OAUTH_REDIRECT_BASE: str = "http://localhost:3000"  # Frontend URL for OAuth callback

    # Kubernetes
    K8S_CONFIG_PATH: Optional[str] = None
    K8S_IN_CLUSTER: bool = False
    K8S_HOST_OVERRIDE: Optional[str] = None  # Use 'host.docker.internal' for Docker Desktop
    # Development only: explicitly opt out of API server certificate verification.
    K8S_SKIP_TLS_VERIFY: bool = False

    # Falco/Falcosidekick must sign each webhook request with this shared secret.
    FALCO_WEBHOOK_SECRET: str = ""

    # Jenkins
    JENKINS_URL: str = "http://localhost:8080"
    JENKINS_USERNAME: str = ""
    JENKINS_TOKEN: str = ""

    # Helm
    HELM_AUTO_INIT: bool = False

    # AI Provider (groq, gemini, anthropic)
    AI_PROVIDER: str = "gemini"

    # Groq (FREE & FAST - recommended)
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    # Google Gemini
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.5-flash"

    # Anthropic Claude (paid alternative)
    ANTHROPIC_API_KEY: str = ""
    CLAUDE_MODEL: str = "claude-sonnet-4-20250514"

    # DevSecOps & Security Scanners
    TRIVY_ENABLED: bool = True
    TRIVY_TIMEOUT: int = 300
    GITLEAKS_ENABLED: bool = True

    # CORS
    CORS_ORIGINS: Union[list[str], str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://localhost:8000",
        "http://localhost:8001",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, list[str]]) -> list[str]:
        if isinstance(v, str):
            v_trimmed = v.strip()
            if not v_trimmed:
                return []
            if v_trimmed.startswith("[") and v_trimmed.endswith("]"):
                try:
                    parsed = json.loads(v_trimmed)
                    if isinstance(parsed, list):
                        return [str(item).strip() for item in parsed if str(item).strip()]
                except Exception:
                    pass
            # Split comma-separated string
            return [orig.strip() for orig in v_trimmed.split(",") if orig.strip()]
        elif isinstance(v, list):
            return [str(item).strip() for item in v if str(item).strip()]
        return []

    if SettingsConfigDict is not None:
        model_config = SettingsConfigDict(
            env_file=(".env.test" if "pytest" in sys.modules else ".env"),
            env_file_encoding="utf-8",
            extra="ignore",
            case_sensitive=True,
        )
    else:
        class Config:
            env_file = ".env"
            case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

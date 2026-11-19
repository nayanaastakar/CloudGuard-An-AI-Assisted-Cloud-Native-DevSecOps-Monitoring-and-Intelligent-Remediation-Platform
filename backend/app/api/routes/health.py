import asyncio
import logging
from datetime import datetime, timezone

from fastapi import APIRouter
from kubernetes.config.config_exception import ConfigException

from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/health")
@router.get("/healthz")
async def health_check():
    """Basic liveness and health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/ready")
async def readiness_check():
    """Readiness check - verifies core dependencies for CloudGuard operation."""
    checks = {"api": True, "kubernetes": False, "ai": False}
    check_details = {
        "api": {"status": "live"},
        "kubernetes": {"status": "unavailable", "source": "kubernetes-api"},
        "ai": {"status": "unavailable", "source": settings.AI_PROVIDER},
    }

    try:
        from app.services.kubernetes_service import kubernetes_service

        kubernetes_service._initialize()
        await asyncio.wait_for(
            asyncio.to_thread(
                kubernetes_service._core_v1.list_namespace,
                limit=1,
                _request_timeout=3,
            ),
            timeout=4,
        )
        checks["kubernetes"] = True
        check_details["kubernetes"] = {"status": "live", "source": "kubernetes-api"}
    except Exception as e:
        logger.debug(f"Kubernetes not ready: {type(e).__name__}")
        check_details["kubernetes"] = {
            "status": "unavailable" if isinstance(e, ConfigException) else "error",
            "source": "kubernetes-api",
            "error": str(e),
        }

    # AI provider readiness (Gemini, Anthropic, or Groq)
    if settings.GEMINI_API_KEY or settings.ANTHROPIC_API_KEY or settings.GROQ_API_KEY:
        checks["ai"] = True
        check_details["ai"] = {"status": "configured", "source": settings.AI_PROVIDER}

    all_healthy = all(checks.values())

    return {
        "ready": all_healthy,
        "checks": checks,
        "check_details": check_details,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/live")
async def liveness_check():
    """Liveness check - simple ping to verify the service is running."""
    return {"alive": True}


@router.get("/system/status")
async def system_status():
    """Get detailed system status including cache, database, and OAuth."""
    status = {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "components": {},
    }

    # Cache status
    try:
        from app.core.cache import cache_service
        cache_stats = await cache_service.get_stats()
        status["components"]["cache"] = {
            "type": "redis",
            "enabled": settings.REDIS_ENABLED,
            **cache_stats,
        }
    except Exception as e:
        status["components"]["cache"] = {"enabled": False, "error": str(e)}

    # Database status
    status["components"]["database"] = {
        "type": "postgresql",
        "enabled": settings.USE_DATABASE_AUTH,
        "url": settings.DATABASE_URL.split("@")[-1] if settings.USE_DATABASE_AUTH else None,
    }

    # OAuth status
    try:
        from app.services.oauth_service import oauth_service
        providers = oauth_service.get_enabled_providers()
        status["components"]["oauth"] = {
            "enabled": settings.OAUTH_ENABLED,
            "providers": providers,
        }
    except Exception:
        status["components"]["oauth"] = {"enabled": False, "providers": []}

    # AI status
    status["components"]["ai"] = {
        "provider": settings.AI_PROVIDER,
        "gemini_enabled": bool(settings.GEMINI_API_KEY),
        "anthropic_enabled": bool(settings.ANTHROPIC_API_KEY),
    }

    return status


@router.get("/cache/stats")
async def cache_stats():
    """Get Redis cache statistics."""
    try:
        from app.core.cache import cache_service
        return await cache_service.get_stats()
    except Exception as e:
        return {"error": str(e), "enabled": False}


@router.post("/cache/flush")
async def flush_cache():
    """Flush all cache entries. Admin use only."""
    try:
        from app.core.cache import cache_service
        success = await cache_service.flush()
        return {"flushed": success, "message": "Cache flushed successfully" if success else "No cache to flush"}
    except Exception as e:
        return {"error": str(e), "flushed": False}

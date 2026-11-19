"""HMAC authentication and replay protection for Falco event delivery."""

import asyncio
import hashlib
import hmac
import re
import time
from typing import Dict

from app.core.config import settings
from app.core.cache import get_redis
from app.core.startup import is_effective_production

WINDOW_SECONDS = 300
MAX_BODY_BYTES = 1_048_576
_nonce_lock = asyncio.Lock()
_local_nonces: Dict[str, float] = {}
_NONCE_RE = re.compile(r"^[A-Za-z0-9_-]{16,128}$")


class FalcoWebhookAuthError(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)


def sign_falco_payload(secret: str, timestamp: str, nonce: str, body: bytes) -> str:
    message = timestamp.encode("ascii") + b"." + nonce.encode("ascii") + b"." + body
    return "sha256=" + hmac.new(secret.encode("utf-8"), message, hashlib.sha256).hexdigest()


async def verify_falco_request(
    *, secret: str, timestamp: str, nonce: str, signature: str, body: bytes, now: float = None
) -> None:
    """Raise a typed auth error when signature, freshness, or nonce checks fail."""
    if not secret:
        raise FalcoWebhookAuthError(503, "Falco webhook authentication is not configured")
    if len(body) > MAX_BODY_BYTES:
        raise FalcoWebhookAuthError(413, "Falco webhook payload exceeds the 1 MiB limit")
    if not timestamp.isascii() or not timestamp.isdecimal() or len(timestamp) > 12 or not _NONCE_RE.fullmatch(nonce or ""):
        raise FalcoWebhookAuthError(401, "Missing or malformed webhook timestamp/nonce")

    current = time.time() if now is None else now
    request_time = int(timestamp)
    if abs(current - request_time) > WINDOW_SECONDS:
        raise FalcoWebhookAuthError(401, "Webhook timestamp is outside the allowed five-minute window")

    expected = sign_falco_payload(secret, timestamp, nonce, body)
    if not hmac.compare_digest(expected, signature or ""):
        raise FalcoWebhookAuthError(401, "Invalid Falco webhook signature")

    # Shared Redis nonce storage prevents replay across backend workers/replicas.
    if settings.REDIS_ENABLED:
        try:
            redis_client = await get_redis()
            if redis_client is not None:
                accepted = await redis_client.set(f"cloudguard:falco:nonce:{nonce}", "1", ex=WINDOW_SECONDS, nx=True)
                if not accepted:
                    raise FalcoWebhookAuthError(401, "Falco webhook nonce has already been used")
                return
        except FalcoWebhookAuthError:
            raise
        except Exception:
            pass

    if is_effective_production(settings):
        raise FalcoWebhookAuthError(503, "Replay protection is unavailable; Redis is required for production webhook delivery")

    # Single-process fallback is only for local development/test mode.
    async with _nonce_lock:
        expired = [key for key, expires in _local_nonces.items() if expires <= current]
        for key in expired:
            _local_nonces.pop(key, None)
        if nonce in _local_nonces:
            raise FalcoWebhookAuthError(401, "Falco webhook nonce has already been used")
        if len(_local_nonces) >= 10_000:
            oldest = min(_local_nonces, key=_local_nonces.get)
            _local_nonces.pop(oldest, None)
        _local_nonces[nonce] = current + WINDOW_SECONDS

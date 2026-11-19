"""TLS policy shared by Kubernetes API clients."""

from app.core.config import settings
from app.core.startup import is_effective_production


def apply_kubernetes_tls_policy(configuration, *, skip_tls_verify: bool = False):
    """Verify API certificates by default; permit an explicit development opt-out only."""
    skip = bool(skip_tls_verify or settings.K8S_SKIP_TLS_VERIFY)
    if skip and is_effective_production(settings):
        raise ValueError("Kubernetes TLS verification cannot be disabled outside DEBUG development mode")

    configuration.verify_ssl = not skip
    if skip:
        configuration.assert_hostname = False
        configuration.ssl_ca_cert = None
    else:
        configuration.assert_hostname = None
    return configuration

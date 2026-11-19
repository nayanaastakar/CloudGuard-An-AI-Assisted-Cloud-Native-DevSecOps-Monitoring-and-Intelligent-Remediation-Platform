"""Shared Kubernetes configuration and client construction.

Every Kubernetes API client must pass through this module so kubeconfig TLS
flags cannot silently bypass CloudGuard's certificate verification policy.
"""

import os
from typing import Optional

from kubernetes import client, config

from app.core.config import settings
from app.core.kubernetes_tls import apply_kubernetes_tls_policy


def load_kubernetes_configuration(
    *,
    in_cluster: Optional[bool] = None,
    config_file: Optional[str] = None,
    context: Optional[str] = None,
    host_override: Optional[str] = None,
    skip_tls_verify: bool = False,
):
    """Load credentials and return a policy-checked Kubernetes configuration.

    Kubeconfig's ``insecure-skip-tls-verify`` flag is not authoritative here:
    certificate verification is turned back on unless the explicit development
    opt-out is enabled and production mode is not active.
    """
    use_in_cluster = settings.K8S_IN_CLUSTER if in_cluster is None else in_cluster
    selected_config = config_file
    if not use_in_cluster and selected_config is None:
        selected_config = settings.K8S_CONFIG_PATH
    if not use_in_cluster and selected_config is None and os.path.exists("/tmp/kubeconfig"):
        selected_config = "/tmp/kubeconfig"

    if use_in_cluster:
        config.load_incluster_config()
    else:
        config.load_kube_config(config_file=selected_config, context=context)

    configuration = client.Configuration.get_default_copy()
    if host_override and configuration.host:
        configuration.host = configuration.host.replace("127.0.0.1", host_override).replace(
            "localhost", host_override
        )
        if "host.docker.internal" in configuration.host or "127.0.0.1" in configuration.host or "localhost" in configuration.host:
            # Local development clusters (Minikube / Docker Desktop) use self-signed certificates
            skip_tls_verify = True

    configuration = apply_kubernetes_tls_policy(configuration, skip_tls_verify=skip_tls_verify)
    client.Configuration.set_default(configuration)
    return configuration


def create_kubernetes_api_client(
    *,
    in_cluster: Optional[bool] = None,
    config_file: Optional[str] = None,
    context: Optional[str] = None,
    host_override: Optional[str] = None,
    skip_tls_verify: bool = False,
    configuration=None,
) -> client.ApiClient:
    """Create an API client with CloudGuard's configured TLS policy."""
    if configuration is None:
        configuration = load_kubernetes_configuration(
            in_cluster=in_cluster,
            config_file=config_file,
            context=context,
            host_override=host_override,
            skip_tls_verify=skip_tls_verify,
        )
    else:
        configuration = apply_kubernetes_tls_policy(configuration, skip_tls_verify=skip_tls_verify)
        client.Configuration.set_default(configuration)
    return client.ApiClient(configuration)

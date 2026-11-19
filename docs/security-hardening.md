# Security-sensitive deployment configuration

## Local Docker Compose

Copy `.env.example` to `.env`, then replace every `replace-with-...` value. Use separate URL-safe random values for `POSTGRES_PASSWORD`, `SECRET_KEY`, `DEFAULT_ADMIN_PASSWORD`, and `FALCO_WEBHOOK_SECRET`. Set the password embedded in `DATABASE_URL` to the same `POSTGRES_PASSWORD` value (URL-encoded if needed). A local generator is:

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Keep `K8S_SKIP_TLS_VERIFY=false` by default. A developer may explicitly set it to `true` only when `DEBUG=true` and using a trusted local cluster; the setting is rejected in production. For Docker Desktop host overrides, preserve the cluster CA and ensure the API certificate is valid for the override host.

## Kubernetes manifests and Helm

`k8s/cloudguard-k8s.yaml` references an externally created `cloudguard-secrets` Secret. Create it using a trusted secret manager or an approved local secret process. It must contain `SECRET_KEY`, `DEFAULT_ADMIN_PASSWORD`, `DATABASE_URL`, `REDIS_URL`, `CORS_ORIGINS`, and `FALCO_WEBHOOK_SECRET`. The manifest intentionally does not define credential values.

The Helm chart requires `backend.existingSecret` to reference a pre-created Secret with the same keys. Do not put secret values in `values.yaml`, command-line `--set` arguments, or source control. Production also requires an authenticated TLS Redis URL (`rediss://`) because nonce replay protection is shared across backend workers.

The CloudGuard monitoring service account is read-only. The optional, namespace-scoped `cloudguard-remediation` identity only permits `get` and `patch` on the `deployments/scale` subresource and is not attached to the backend. The current remediation executor applies arbitrary YAML and does not use that identity; do not grant it write permissions. A separate runner and explicit action allowlist are required before live remediation can be enabled.

## Falco webhook signature

Configure the same high-entropy `FALCO_WEBHOOK_SECRET` in CloudGuard and the external Falco/Falcosidekick HTTP sender. Send the exact raw JSON request body with these headers:

- `X-CloudGuard-Timestamp`: Unix epoch seconds.
- `X-CloudGuard-Nonce`: a unique random URL-safe value of 16–128 characters.
- `X-CloudGuard-Signature`: `sha256=` followed by the lowercase hex HMAC-SHA256 digest of `timestamp + "." + nonce + "." + raw_body` using the shared secret.

Requests outside the five-minute clock window, with invalid signatures, or with reused nonces are rejected. Production uses Redis `SET NX` with expiry for replay protection across workers and fails closed when Redis is unavailable. Configure the sender to generate headers for each delivery and synchronize clocks. Never place the signing secret in URLs or logs.

## Source-level scope

These settings and policies are verified in source and automated tests. They have not been applied to a live cluster or production deployment. Review rendered RBAC and the secret store configuration for the target environment before deployment.

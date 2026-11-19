# Quick Start

Get CloudGuard running locally with credentials you choose.

## Configure Local Credentials

1. Copy `.env.example` to `.env`.
2. Replace the placeholders for `POSTGRES_PASSWORD`, `SECRET_KEY`, and `DEFAULT_ADMIN_PASSWORD` with unique values. Set the database URL password to match `POSTGRES_PASSWORD`.
3. Keep `ENVIRONMENT=development` and `DEBUG=true` for local development. Leave `FALCO_WEBHOOK_SECRET` blank to keep Falco webhook ingestion disabled, or configure a separate random secret.
4. Start the services with `docker compose up`.

## First Login

1. Open **http://localhost:3001** in your browser.
2. Sign in as `admin` with the `DEFAULT_ADMIN_PASSWORD` configured in `.env`.
3. CloudGuard creates only the initial administrator when the database has no users. Create separate accounts for other people and roles after sign-in. Existing database users are preserved.

## Dashboard Overview

After logging in, you'll see the main dashboard with:

- **Cluster Health** - Overall status of your Kubernetes cluster
- **Resource Metrics** - CPU and memory utilization
- **Pod Status** - Running, pending, and failed pods
- **Recent Events** - Latest cluster events

## Connecting to Your Cluster

KubeSight automatically detects your Kubernetes configuration:

### Local Development
If you have `~/.kube/config`, KubeSight will use it automatically.

### In-Cluster Deployment
When deployed inside Kubernetes, KubeSight uses the service account credentials.

### Custom Configuration
Set the `K8S_CONFIG_PATH` environment variable:

```bash
K8S_CONFIG_PATH=/path/to/your/kubeconfig
```

## Key Features to Try

### 1. Kubernetes Resources
Navigate to **Kubernetes** to see:

- All pods across namespaces
- Deployments with scaling controls
- Services and endpoints
- Node status and metrics

### 2. Security Dashboard
Check your cluster's security posture:

- Security score (A-F grade)
- Vulnerability findings
- RBAC analysis
- Remediation recommendations

### 3. AI Assistant
Ask questions in natural language:

- "How many pods are running?"
- "What are the security issues?"
- "Show me high memory usage pods"

### 4. Pod Terminal
Execute commands inside pods:

1. Go to **Kubernetes > Pods**
2. Click on a pod
3. Click **Terminal** to open an interactive shell

## Next Steps

- [Configuration Guide](configuration.md) - Set up AI providers and customize settings
- [Kubernetes Features](../features/kubernetes.md) - Deep dive into K8s management
- [Security Dashboard](../features/security.md) - Understand security scanning

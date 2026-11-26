// Prometheus Stack Types

// Enums





// Resource Configuration







// Prometheus Config











// Notification Receivers
















































































// Main Stack Config











// Default config factory
export const getDefaultStackConfig = () => ({
  namespace: 'monitoring',
  release_name: 'prometheus-stack',
  prometheus: {
    retention: '15d',
    storage_size: '50Gi',
    storage_class: undefined,
    replicas: 1,
    resources: {
      cpu_request: '100m',
      cpu_limit: '1000m',
      memory_request: '256Mi',
      memory_limit: '2Gi'
    },
    external_labels: {},
    scrape_interval: '30s',
    evaluation_interval: '30s'
  },
  alertmanager: {
    enabled: true,
    replicas: 1,
    storage_size: '10Gi',
    storage_class: undefined,
    receivers: [],
    routes: []
  },
  grafana: {
    enabled: false, // Disabled by default - KubeSight has native dashboards
    admin_password: undefined,
    persistence_enabled: true,
    storage_size: '10Gi',
    storage_class: undefined,
    ingress_enabled: false,
    ingress_host: undefined,
    ingress_class: undefined
  },
  node_exporter: {
    enabled: true
  },
  kube_state_metrics: {
    enabled: true
  },
  additional_scrape_configs: []
});

// Stack Status





















// Query Types































// Alert Types






































// Silence Types
























// Target Types


















// ServiceMonitor Types































// Metric Metadata







// Response Types
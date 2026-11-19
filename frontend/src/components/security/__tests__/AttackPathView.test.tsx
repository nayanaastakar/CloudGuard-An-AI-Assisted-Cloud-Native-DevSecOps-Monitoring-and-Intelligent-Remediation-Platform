import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AttackPathView from '../AttackPathView';
import cloudguardApi, { AttackPath } from '../../../services/cloudguardApi';

// Mock API
vi.mock('../../../services/cloudguardApi', () => {
  return {
    default: {
      getAttackPaths: vi.fn(),
    },
  };
});

describe('AttackPathView Traversal Chain Responsive Audit', () => {
  const mockAttackPaths: AttackPath[] = [
    {
      path_id: 'AP-001',
      title: 'Lateral Movement from Ingress Gateway to Cluster Secrets',
      severity: 'high',
      risk_score: 7.8,
      entry_point: 'Ingress / External Traffic (Port 80/443)',
      target_resource: 'Cluster Secrets & ConfigMaps',
      hop_count: 3,
      nodes: [
        {
          id: 'node-1',
          label: 'Ingress/frontend-gw',
          type: 'entry_point',
          status: 'exposed',
          description: 'Public entry point into cluster.',
        },
        {
          id: 'node-2',
          label: 'Pod/frontend-service',
          type: 'workload',
          status: 'running',
          description: 'Microservice pod with automounted token.',
        },
        {
          id: 'node-3',
          label: 'ServiceAccount/default',
          type: 'identity',
          status: 'overprivileged',
          description: 'Standard service account with secret read access.',
        },
        {
          id: 'node-4',
          label: 'Secrets/db-credentials',
          type: 'target',
          status: 'critical_impact',
          description: 'Sensitive database connection secrets.',
        },
      ],
      edges: [
        {
          source: 'node-1',
          target: 'node-2',
          label: 'Ingress Forwarding',
          vector: 'Network Ingress',
        },
        {
          source: 'node-2',
          target: 'node-3',
          label: 'Token Extraction',
          vector: 'Container Escape / RCE',
        },
        {
          source: 'node-3',
          target: 'node-4',
          label: 'K8s API Read',
          vector: 'Unauthorized Read',
        },
      ],
      mitigations: [
        'Deploy NetworkPolicy restricting frontend pod egress to the internal API server.',
        'Set automountServiceAccountToken: false on pods that do not need Kubernetes API interaction.',
      ],
    },
  ];

  let queryClient: QueryClient;

  beforeEach(() => {
    vi.restoreAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AttackPathView />
      </QueryClientProvider>
    );
  };

  it('renders all four traversal chain nodes completely', async () => {
    vi.mocked(cloudguardApi.getAttackPaths).mockResolvedValueOnce({
      data: mockAttackPaths,
    } as any);

    renderComponent();

    // Verify traversal header
    await waitFor(() => {
      expect(screen.getByText('Attack Path Traversal Chain')).toBeInTheDocument();
    });
    expect(screen.getByText('DEMO / LAB')).toBeInTheDocument();
    expect(screen.getByText('Sample traversal vector; not verified against a live cluster.')).toBeInTheDocument();

    // Verify all 4 nodes are in document and visible
    expect(screen.getByText('frontend-gw')).toBeInTheDocument();
    expect(screen.getByText('frontend-service')).toBeInTheDocument();
    expect(screen.getByText('default')).toBeInTheDocument();
    expect(screen.getByText('db-credentials')).toBeInTheDocument();
    expect(screen.getByText('Ingress /')).toBeInTheDocument();
    expect(screen.getByText('Pod /')).toBeInTheDocument();
    expect(screen.getByText('ServiceAccount /')).toBeInTheDocument();
    expect(screen.getByText('Secrets /')).toBeInTheDocument();

    // Verify vector labels
    expect(screen.getAllByText('Network Ingress').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Container Escape / RCE').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Unauthorized Read').length).toBeGreaterThan(0);
  });
});

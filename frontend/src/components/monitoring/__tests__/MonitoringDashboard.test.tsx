import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MonitoringDashboard from '../MonitoringDashboard';
import { kubernetesApi } from '../../../services/api';
import { prometheusApi } from '../../../services/prometheusApi';

vi.mock('../../../services/api', () => ({
  kubernetesApi: {
    getClusterMetrics: vi.fn(),
    getEvents: vi.fn(),
    getPods: vi.fn(),
  },
  aiApi: { summarizeLogs: vi.fn() },
}));

vi.mock('../../../services/prometheusApi', () => ({
  prometheusApi: {
    getStackStatus: vi.fn(),
    queryRange: vi.fn(),
    getAlerts: vi.fn(),
  },
}));

vi.mock('../../../hooks/useWebSocketLogs', () => ({
  useWebSocketLogs: () => ({ logs: [], error: null, disconnect: vi.fn(), clearLogs: vi.fn() }),
}));

describe('MonitoringDashboard source status', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(kubernetesApi.getEvents).mockResolvedValue({ data: [] } as never);
    vi.mocked(kubernetesApi.getPods).mockResolvedValue({ data: [] } as never);
    vi.mocked(prometheusApi.getStackStatus).mockResolvedValue({ data: { status: 'stopped' } } as never);
  });

  const renderDashboard = () => render(
    <MemoryRouter>
      <MonitoringDashboard />
    </MemoryRouter>
  );

  it('shows the live Kubernetes source and metrics timestamp', async () => {
    vi.mocked(kubernetesApi.getClusterMetrics).mockResolvedValue({
      data: {
        timestamp: '2026-03-10T12:30:00Z',
        cpu_percent: 25,
        memory_percent: 40,
        nodes: [],
      },
    } as never);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('LIVE');
    });
    expect(screen.getByRole('status')).toHaveTextContent('Source: Kubernetes Metrics API');
    expect(screen.getByRole('status')).toHaveTextContent(new Date('2026-03-10T12:30:00Z').toLocaleString());
  });

  it('marks unavailable metrics without substituting sample values', async () => {
    vi.mocked(kubernetesApi.getClusterMetrics).mockRejectedValue({
      response: { status: 503 },
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('UNAVAILABLE');
    });
    expect(screen.getByRole('status')).toHaveTextContent('No sample values are substituted.');
  });

  it('distinguishes request failures from unavailable metrics', async () => {
    vi.mocked(kubernetesApi.getClusterMetrics).mockRejectedValue(new Error('network failure'));

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('ERROR');
    });
  });
});

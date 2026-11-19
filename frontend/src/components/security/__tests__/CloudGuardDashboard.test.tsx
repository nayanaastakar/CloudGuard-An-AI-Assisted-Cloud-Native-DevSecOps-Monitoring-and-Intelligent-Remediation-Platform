import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CloudGuardDashboard from '../CloudGuardDashboard';
import cloudguardApi from '../../../services/cloudguardApi';

vi.mock('../../../services/cloudguardApi', () => ({
  default: {
    getSecurityPosture: vi.fn(),
    triggerSecurityAudit: vi.fn(),
  },
}));

function renderDashboard() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter><CloudGuardDashboard /></MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('CloudGuardDashboard audit state', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows unavailable errors without presenting a perfect score', async () => {
    const unavailable = {
      cluster_id: 'default',
      audit_run_id: 'audit-offline',
      audit_status: 'unavailable',
      error: 'Kubernetes API returned HTTP 403: Forbidden',
      checks: { pods: { status: 'failed', error: 'Kubernetes API returned HTTP 403: Forbidden' } },
      provenance: { state: 'unavailable', source: 'kubernetes-security-audit', is_fresh: false, ttl_seconds: 30, last_synced_at: new Date().toISOString() },
      security_score: null,
      findings: [],
      workloads_audited: null,
      posture_summary: null,
    };
    vi.mocked(cloudguardApi.getSecurityPosture).mockResolvedValue({ data: unavailable } as any);
    vi.mocked(cloudguardApi.triggerSecurityAudit).mockResolvedValue({ data: unavailable } as any);

    renderDashboard();
    expect(await screen.findByText(/No posture score: cluster audit unavailable/i)).toBeInTheDocument();
    expect(screen.queryByText('85')).not.toBeInTheDocument();
    const auditButton = await screen.findByRole('button', { name: /Run Security Audit/i });
    await waitFor(() => expect(auditButton).toBeEnabled());
    fireEvent.click(auditButton);
    await waitFor(() => expect(cloudguardApi.triggerSecurityAudit).toHaveBeenCalledOnce());

    expect(await screen.findByRole('alert')).toHaveTextContent('Kubernetes API returned HTTP 403: Forbidden');
    expect(screen.getByText(/Data source: kubernetes-security-audit/)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: /Audit Failed/i })).toBeInTheDocument());
  });
});

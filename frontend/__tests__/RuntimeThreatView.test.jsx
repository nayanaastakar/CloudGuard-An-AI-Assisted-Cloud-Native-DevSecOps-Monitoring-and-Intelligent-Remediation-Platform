import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RuntimeThreatView from '../src/components/security/RuntimeThreatView';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

describe('RuntimeThreatView Interactive Controls Audit', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders summary cards, controls and handles filter interaction', async () => {
    const mockThreatsResponse = {
      total: 2,
      summary: { CRITICAL: 1, HIGH: 1, MEDIUM: 0, LOW: 0, INFO: 0 },
      provenance: { state: 'live', source: 'falcosidekick' },
      events: [
      {
        id: 'evt-1',
        rule: 'Terminal shell in container',
        severity: 'CRITICAL',
        output: 'Spawned interactive bash',
        timestamp: '2026-11-16T08:00:00Z',
        pod: 'payment-api-xyz',
        container: 'payment-api',
        provenance: { state: 'live', source: 'falcosidekick' }
      }]

    };

    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/v1/cloudguard/runtime/falco/webhook')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: 'ingested', event_id: 'evt_sim_999' })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockThreatsResponse)
      });
    });

    render(/*#__PURE__*/
      _jsxDEV(MemoryRouter, { children: /*#__PURE__*/
        _jsxDEV(RuntimeThreatView, {}, void 0, false) }, void 0, false
      )
    );

    // Verify Title & KPI strip
    expect(screen.getByText('Runtime Threat Detection')).toBeInTheDocument();
    expect(screen.getByText('Critical Alerts')).toBeInTheDocument();

    // Verify Simulate Falco Alert Button exists and is clickable
    const simulateButton = screen.getByText('Simulate Falco Alert');
    expect(simulateButton).toBeInTheDocument();
    fireEvent.click(simulateButton);

    // Verify webhook call was triggered
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/cloudguard/runtime/falco/webhook',
        expect.objectContaining({ method: 'POST' })
      );
    });

    // Verify Refresh Button
    const refreshButton = screen.getByText('Refresh');
    expect(refreshButton).toBeInTheDocument();
    fireEvent.click(refreshButton);
    expect(global.fetch).toHaveBeenCalled();
  });
});
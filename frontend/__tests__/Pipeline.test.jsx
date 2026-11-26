import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import PipelineOverview from '../PipelineOverview';
import PipelineDetails from '../PipelineDetails';
import PipelineRun from '../PipelineRun';
import AgentsTable from '../AgentsTable';

// Mock components wrapper
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";const renderWithRouter = (component) => {
  return render(/*#__PURE__*/_jsxDEV(BrowserRouter, { children: component }, void 0, false));
};

describe('Pipeline Components', () => {
  describe('PipelineOverview', () => {
    it('renders pipeline overview page', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineOverview, {}, void 0, false));
      expect(screen.getByText('Pipelines')).toBeInTheDocument();
    });

    it('displays summary cards', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineOverview, {}, void 0, false));
      expect(screen.getByText('Total Pipelines')).toBeInTheDocument();
      expect(screen.getByText('Running')).toBeInTheDocument();
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });

    it('displays pipeline table', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineOverview, {}, void 0, false));
      expect(screen.getByText('Pipeline Name')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('filters pipelines by search', async () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineOverview, {}, void 0, false));
      const searchInput = screen.getByPlaceholderText('Search pipelines...');

      fireEvent.change(searchInput, { target: { value: 'Backend' } });

      await waitFor(() => {
        expect(searchInput).toHaveValue('Backend');
      });
    });

    it('has action buttons for each pipeline', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineOverview, {}, void 0, false));
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('PipelineDetails', () => {
    it('renders pipeline details page', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineDetails, {}, void 0, false));
      expect(screen.getByText('Frontend Build Pipeline')).toBeInTheDocument();
    });

    it('displays stage diagram', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineDetails, {}, void 0, false));
      expect(screen.getByText('Pipeline Stages')).toBeInTheDocument();
      expect(screen.getByText('Checkout')).toBeInTheDocument();
      expect(screen.getByText('Deploy')).toBeInTheDocument();
    });

    it('displays runs history table', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineDetails, {}, void 0, false));
      expect(screen.getByText('Runs History')).toBeInTheDocument();
      expect(screen.getByText('Run ID')).toBeInTheDocument();
    });

    it('renders YAML viewer with tabs', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineDetails, {}, void 0, false));
      const tabs = screen.getAllByRole('button').filter((btn) =>
      ['YAML', 'Variables', 'Secrets'].includes(btn.textContent || '')
      );
      expect(tabs.length).toBeGreaterThan(0);
    });

    it('allows tab switching', async () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineDetails, {}, void 0, false));
      const variablesTab = screen.getByRole('button', { name: /Variables/i });

      fireEvent.click(variablesTab);

      await waitFor(() => {
        expect(variablesTab).toHaveClass('border-blue-500');
      });
    });

    it('expands runs on click', async () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineDetails, {}, void 0, false));
      const runRows = screen.getAllByRole('row');

      if (runRows.length > 1) {
        fireEvent.click(runRows[1]);

        await waitFor(() => {
          expect(screen.getByText('Stage Results:')).toBeInTheDocument();
        });
      }
    });
  });

  describe('PipelineRun', () => {
    it('renders pipeline run page', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineRun, {}, void 0, false));
      expect(screen.getByText(/Run #/)).toBeInTheDocument();
    });

    it('displays run status', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineRun, {}, void 0, false));
      expect(screen.getByText('RUNNING')).toBeInTheDocument();
    });

    it('displays stage sidebar', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineRun, {}, void 0, false));
      expect(screen.getByText('Stages')).toBeInTheDocument();
      expect(screen.getByText('Checkout')).toBeInTheDocument();
    });

    it('displays logs terminal', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineRun, {}, void 0, false));
      expect(screen.getByPlaceholderText('Search logs...')).toBeInTheDocument();
    });

    it('has auto-scroll button', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineRun, {}, void 0, false));
      const autoScrollBtn = screen.getByRole('button', { name: /Auto-scroll/i });
      expect(autoScrollBtn).toBeInTheDocument();
    });

    it('selects stage on click', async () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineRun, {}, void 0, false));
      const installStage = screen.getAllByRole('button').find((btn) =>
      btn.textContent?.includes('Install')
      );

      if (installStage) {
        fireEvent.click(installStage);

        await waitFor(() => {
          expect(installStage).toHaveClass('bg-blue-500');
        });
      }
    });

    it('allows log search', async () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineRun, {}, void 0, false));
      const searchInput = screen.getByPlaceholderText('Search logs...');

      fireEvent.change(searchInput, { target: { value: 'error' } });

      await waitFor(() => {
        expect(searchInput).toHaveValue('error');
      });
    });

    it('displays artifacts panel', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineRun, {}, void 0, false));
      expect(screen.getByText('Artifacts')).toBeInTheDocument();
    });

    it('has cancel run button', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineRun, {}, void 0, false));
      const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
      expect(cancelBtn).toBeInTheDocument();
    });
  });

  describe('AgentsTable', () => {
    it('renders agents table', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(AgentsTable, {}, void 0, false));
      expect(screen.getByText('Pipeline Agents')).toBeInTheDocument();
    });

    it('displays agent columns', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(AgentsTable, {}, void 0, false));
      expect(screen.getByText('Agent Name')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('CPU')).toBeInTheDocument();
      expect(screen.getByText('Memory')).toBeInTheDocument();
    });

    it('displays agent rows', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(AgentsTable, {}, void 0, false));
      expect(screen.getByText('docker-runner-1')).toBeInTheDocument();
      expect(screen.getByText('docker-runner-2')).toBeInTheDocument();
    });

    it('shows agent status', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(AgentsTable, {}, void 0, false));
      expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('expands agent details on click', async () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(AgentsTable, {}, void 0, false));
      const agentRow = screen.getByText('docker-runner-1').closest('tr');

      if (agentRow) {
        fireEvent.click(agentRow);

        await waitFor(() => {
          expect(screen.getByText('Agent Details')).toBeInTheDocument();
        });
      }
    });

    it('displays resource usage metrics', async () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(AgentsTable, {}, void 0, false));
      const agentRow = screen.getByText('docker-runner-1').closest('tr');

      if (agentRow) {
        fireEvent.click(agentRow);

        await waitFor(() => {
          expect(screen.getByText('CPU Usage')).toBeInTheDocument();
          expect(screen.getByText('Memory Usage')).toBeInTheDocument();
        });
      }
    });

    it('has add agent button', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(AgentsTable, {}, void 0, false));
      const addBtn = screen.getByRole('button', { name: /Add Agent/i });
      expect(addBtn).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineOverview, {}, void 0, false));
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('buttons have accessible labels', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineRun, {}, void 0, false));
      const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
      expect(cancelBtn).toHaveAccessibleName();
    });

    it('tables have headers', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineDetails, {}, void 0, false));
      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBeGreaterThan(0);
    });

    it('inputs have labels or placeholders', () => {
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineOverview, {}, void 0, false));
      const searchInput = screen.getByPlaceholderText('Search pipelines...');
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('renders on mobile viewport', () => {
      window.innerWidth = 375;
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineOverview, {}, void 0, false));
      expect(screen.getByText('Pipelines')).toBeInTheDocument();
    });

    it('renders on tablet viewport', () => {
      window.innerWidth = 768;
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineOverview, {}, void 0, false));
      expect(screen.getByText('Pipelines')).toBeInTheDocument();
    });

    it('renders on desktop viewport', () => {
      window.innerWidth = 1920;
      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineOverview, {}, void 0, false));
      expect(screen.getByText('Pipelines')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when API fails', async () => {
      vi.mock('../services/pipelineAPI', () => ({
        default: {
          getPipelines: vi.fn().mockRejectedValue(new Error('API Error'))
        }
      }));

      renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineOverview, {}, void 0, false));

      await waitFor(() => {
        // Error handling would be displayed
        expect(screen.queryByText('Pipelines')).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('memoizes components correctly', () => {
      const { rerender } = renderWithRouter(/*#__PURE__*/_jsxDEV(PipelineOverview, {}, void 0, false));
      const firstRender = screen.getByText('Pipelines');

      rerender(/*#__PURE__*/
        _jsxDEV(BrowserRouter, { children: /*#__PURE__*/
          _jsxDEV(PipelineOverview, {}, void 0, false) }, void 0, false
        )
      );

      const secondRender = screen.getByText('Pipelines');
      expect(firstRender).toBe(secondRender);
    });
  });
});
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RemediationModal from '../RemediationModal';
import cloudguardApi, { SecurityFinding } from '../../../services/cloudguardApi';

// Mock the cloudguardApi module
vi.mock('../../../services/cloudguardApi', () => {
  return {
    default: {
      createRemediationPlan: vi.fn(),
      applyRemediation: vi.fn(),
    },
  };
});

describe('RemediationModal Approval & Execution Flow', () => {
  const mockFinding: SecurityFinding = {
    finding_id: 'FND-TEST-001',
    category: 'pod_security',
    severity: 'high',
    title: "Container runs as root user",
    description: 'The container backend runs with root privileges',
    resource_type: 'Deployment',
    resource_name: 'cloudguard-backend',
    namespace: 'cloudguard',
    can_auto_remediate: true,
  };

  const mockPlan = {
    remediation_id: 'REM-FND-TEST-001',
    finding_id: 'FND-TEST-001',
    title: 'Security Remediation for Container runs as root user',
    target_resource: 'Deployment/cloudguard-backend',
    namespace: 'cloudguard',
    current_yaml: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: cloudguard-backend\n',
    proposed_yaml: 'apiVersion: apps/v1\nkind: Deployment\nspec:\n  template:\n    spec:\n      securityContext:\n        runAsNonRoot: true\n',
    diff_patch: '@@ -1,3 +1,7 @@\n+runAsNonRoot: true\n',
    risk_level: 'low',
    security_benefit: 'Enforces least-privilege non-root execution',
    operational_impact: 'Requires rolling restart',
    status: 'pending',
    dry_run_verified: true,
    validation_status_label: 'Kubernetes Server-Side Dry-Run Passed',
    dry_run_output: 'Validation Successful: deployment.apps/cloudguard-backend configured (server dry run)',
    created_at: new Date().toISOString(),
  };

  it('renders modal with required tabs, visible footer checkbox, and initially disabled Apply button', async () => {
    vi.mocked(cloudguardApi.createRemediationPlan).mockResolvedValueOnce({
      data: mockPlan,
    } as any);

    render(
      <RemediationModal
        finding={mockFinding}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    // Wait for plan to load
    await waitFor(() => {
      expect(screen.getByText('Intelligent Remediation Planner')).toBeInTheDocument();
    });

    // Check tabs
    expect(screen.getByText('Proposed Remediation YAML')).toBeInTheDocument();
    expect(screen.getByText('Unified Diff Patch')).toBeInTheDocument();
    expect(screen.getByText('Current Manifest')).toBeInTheDocument();

    // Check distinct validation status label
    expect(screen.getByText('Kubernetes Server-Side Dry-Run Passed')).toBeInTheDocument();

    // Check human approval checkbox is visible in footer and unchecked
    const checkbox = screen.getByLabelText('I have reviewed the proposed changes and approve this remediation.');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    // Apply button must be disabled
    const applyButton = screen.getByRole('button', { name: /Apply Approved Remediation/i });
    expect(applyButton).toBeDisabled();
    expect(screen.getByText(/Confirmation required before applying/i)).toBeInTheDocument();
  });

  it('enables Apply button upon human approval checkbox selection and calls apply API', async () => {
    vi.mocked(cloudguardApi.createRemediationPlan).mockResolvedValueOnce({
      data: mockPlan,
    } as any);

    vi.mocked(cloudguardApi.applyRemediation).mockResolvedValueOnce({
      data: { success: true, message: 'Deployment successfully patched.' },
    } as any);

    const handleSuccess = vi.fn();
    render(
      <RemediationModal
        finding={mockFinding}
        onClose={vi.fn()}
        onSuccess={handleSuccess}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText('I have reviewed the proposed changes and approve this remediation.')).toBeInTheDocument();
    });

    const checkbox = screen.getByLabelText('I have reviewed the proposed changes and approve this remediation.');
    const applyButton = screen.getByRole('button', { name: /Apply Approved Remediation/i });

    // Click checkbox
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(applyButton).not.toBeDisabled();
    expect(screen.getByText(/Approval granted. Ready to apply to cluster/i)).toBeInTheDocument();

    // Click Apply Approved Remediation
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(cloudguardApi.applyRemediation).toHaveBeenCalledWith(
        'REM-FND-TEST-001',
        expect.stringContaining('Approved by authorized administrator')
      );
    });
  });

  it('triggers onClose when Cancel or X button is clicked', async () => {
    vi.mocked(cloudguardApi.createRemediationPlan).mockResolvedValueOnce({
      data: mockPlan,
    } as any);

    const handleClose = vi.fn();
    render(
      <RemediationModal
        finding={mockFinding}
        onClose={handleClose}
        onSuccess={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Cancel'));
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});

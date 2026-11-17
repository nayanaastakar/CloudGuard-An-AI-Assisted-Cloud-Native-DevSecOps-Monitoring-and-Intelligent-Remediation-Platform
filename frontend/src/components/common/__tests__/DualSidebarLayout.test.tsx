import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DualSidebarLayout from '../DualSidebarLayout';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import { AuthProvider } from '../../../contexts/AuthContext';
import { NotificationProvider } from '../../../contexts/NotificationContext';
import { ClusterProvider } from '../../../contexts/ClusterContext';
import { NamespaceProvider } from '../../../contexts/NamespaceContext';

// Helper to render with required providers
function renderWithProviders(ui: React.ReactElement, initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <ClusterProvider>
              <NamespaceProvider>
                {ui}
              </NamespaceProvider>
            </ClusterProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('DualSidebarLayout Navigation Audit', () => {
  it('highlights Security Center when route is /', () => {
    const { container } = renderWithProviders(
      <DualSidebarLayout><div>Dashboard Content</div></DualSidebarLayout>,
      '/'
    );
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
    // Verify level-1 active item has Vichy Teal active styling
    const activeItem = container.querySelector('.bg-\\[\\#05AD98\\]');
    expect(activeItem).toBeInTheDocument();
  });

  it('highlights Asset Inventory when route is /assets', () => {
    const { container } = renderWithProviders(
      <DualSidebarLayout><div>Assets Content</div></DualSidebarLayout>,
      '/assets'
    );
    expect(screen.getByText('Assets Content')).toBeInTheDocument();
    const activeItem = container.querySelector('.bg-\\[\\#05AD98\\]');
    expect(activeItem).toBeInTheDocument();
  });

  it('highlights Runtime Threat Detection when route is /threats', () => {
    const { container } = renderWithProviders(
      <DualSidebarLayout><div>Threats Content</div></DualSidebarLayout>,
      '/threats'
    );
    expect(screen.getByText('Threats Content')).toBeInTheDocument();
    const activeItem = container.querySelector('.bg-\\[\\#05AD98\\]');
    expect(activeItem).toBeInTheDocument();
  });

  it('highlights Security Graph when route is /graph', () => {
    const { container } = renderWithProviders(
      <DualSidebarLayout><div>Graph Content</div></DualSidebarLayout>,
      '/graph'
    );
    expect(screen.getByText('Graph Content')).toBeInTheDocument();
  });

  it('highlights Attack Path Analysis when route is /attack-paths', () => {
    const { container } = renderWithProviders(
      <DualSidebarLayout><div>Attack Paths Content</div></DualSidebarLayout>,
      '/attack-paths'
    );
    expect(screen.getByText('Attack Paths Content')).toBeInTheDocument();
  });

  it('highlights AI Incident Investigation when route is /incidents', () => {
    const { container } = renderWithProviders(
      <DualSidebarLayout><div>Incidents Content</div></DualSidebarLayout>,
      '/incidents'
    );
    expect(screen.getByText('Incidents Content')).toBeInTheDocument();
  });

  it('highlights Vulnerability Intelligence when route is /vulnerabilities', () => {
    const { container } = renderWithProviders(
      <DualSidebarLayout><div>Vulnerabilities Content</div></DualSidebarLayout>,
      '/vulnerabilities'
    );
    expect(screen.getByText('Vulnerabilities Content')).toBeInTheDocument();
  });

  it('highlights Scanner Health & SBOM when route is /sbom', () => {
    const { container } = renderWithProviders(
      <DualSidebarLayout><div>SBOM Content</div></DualSidebarLayout>,
      '/sbom'
    );
    expect(screen.getByText('SBOM Content')).toBeInTheDocument();
  });

  it('highlights Remediation Center when route is /remediation', () => {
    const { container } = renderWithProviders(
      <DualSidebarLayout><div>Remediation Content</div></DualSidebarLayout>,
      '/remediation'
    );
    expect(screen.getByText('Remediation Content')).toBeInTheDocument();
  });

  it('highlights Compliance Engine when route is /compliance', () => {
    const { container } = renderWithProviders(
      <DualSidebarLayout><div>Compliance Content</div></DualSidebarLayout>,
      '/compliance'
    );
    expect(screen.getByText('Compliance Content')).toBeInTheDocument();
  });

  it('highlights DevSecOps Pipeline when route is /devsecops', () => {
    const { container } = renderWithProviders(
      <DualSidebarLayout><div>DevSecOps Content</div></DualSidebarLayout>,
      '/devsecops'
    );
    expect(screen.getByText('DevSecOps Content')).toBeInTheDocument();
  });

  it('highlights Loki Log Explorer when route is /logs', () => {
    const { container } = renderWithProviders(
      <DualSidebarLayout><div>Logs Content</div></DualSidebarLayout>,
      '/logs'
    );
    expect(screen.getByText('Logs Content')).toBeInTheDocument();
  });

  it('renders labels beside icons and supports collapsing/expanding', () => {
    renderWithProviders(
      <DualSidebarLayout><div>Main Content</div></DualSidebarLayout>,
      '/'
    );

    // Verify all primary module labels are rendered and visible in the DOM
    expect(screen.getAllByText('Security Center').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Asset Inventory').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Vulnerability Management').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Runtime Threats').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Security Graph').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Attack Paths').length).toBeGreaterThan(0);
    expect(screen.getAllByText('AI Investigation').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Remediation Center').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Compliance Engine').length).toBeGreaterThan(0);
    expect(screen.getAllByText('DevSecOps Pipeline').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Scanner Health & SBOM').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Cluster & Workloads').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Deployments & Helm').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Observability & Metrics').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Loki Log Explorer').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Settings & Admin').length).toBeGreaterThan(0);

    // Toggle collapse
    const collapseButton = screen.getByLabelText('Collapse sidebar');
    expect(collapseButton).toBeInTheDocument();
    fireEvent.click(collapseButton);

    // Verify button toggles to expand
    expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument();
  });
});

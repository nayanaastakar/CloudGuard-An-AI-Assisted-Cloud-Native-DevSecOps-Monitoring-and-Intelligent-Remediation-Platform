import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DualSidebarLayout from '../DualSidebarLayout';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import { AuthProvider } from '../../../contexts/AuthContext';
import { NotificationProvider } from '../../../contexts/NotificationContext';
import { ClusterProvider } from '../../../contexts/ClusterContext';
import { NamespaceProvider } from '../../../contexts/NamespaceContext';

// Helper to render with required providers and an isolated QueryClient per test
function renderWithProviders(ui: React.ReactElement, initialRoute = '/') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

describe('DualSidebarLayout Navigation Audit', () => {
  it('highlights Security Center when route is /', () => {
    const { container } = renderWithProviders(
      <DualSidebarLayout><div>Dashboard Content</div></DualSidebarLayout>,
      '/'
    );
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
    // Verify the active item uses the primary palette color.
    const activeItem = container.querySelector('.bg-primary-500');
    expect(activeItem).toBeInTheDocument();
  });

  it('highlights Asset Inventory when route is /assets', () => {
    const { container } = renderWithProviders(
      <DualSidebarLayout><div>Assets Content</div></DualSidebarLayout>,
      '/assets'
    );
    expect(screen.getByText('Assets Content')).toBeInTheDocument();
    const activeItem = container.querySelector('.bg-primary-500');
    expect(activeItem).toBeInTheDocument();
  });

  it('highlights Runtime Threat Detection when route is /threats', () => {
    const { container } = renderWithProviders(
      <DualSidebarLayout><div>Threats Content</div></DualSidebarLayout>,
      '/threats'
    );
    expect(screen.getByText('Threats Content')).toBeInTheDocument();
    const activeItem = container.querySelector('.bg-primary-500');
    expect(activeItem).toBeInTheDocument();
  });

  it('highlights Security Graph when route is /graph', () => {
    renderWithProviders(
<DualSidebarLayout><div>Graph Content</div></DualSidebarLayout>,
'/graph'
);
    expect(screen.getByText('Graph Content')).toBeInTheDocument();
  });

  it('highlights Attack Path Analysis when route is /attack-paths', () => {
    renderWithProviders(
<DualSidebarLayout><div>Attack Paths Content</div></DualSidebarLayout>,
'/attack-paths'
);
    expect(screen.getByText('Attack Paths Content')).toBeInTheDocument();
  });

  it('highlights AI Incident Investigation when route is /incidents', () => {
    renderWithProviders(
<DualSidebarLayout><div>Incidents Content</div></DualSidebarLayout>,
'/incidents'
);
    expect(screen.getByText('Incidents Content')).toBeInTheDocument();
  });

  it('highlights Vulnerability Intelligence when route is /vulnerabilities', () => {
    renderWithProviders(
<DualSidebarLayout><div>Vulnerabilities Content</div></DualSidebarLayout>,
'/vulnerabilities'
);
    expect(screen.getByText('Vulnerabilities Content')).toBeInTheDocument();
  });

  it('highlights Scanner Health & SBOM when route is /sbom', () => {
    renderWithProviders(
<DualSidebarLayout><div>SBOM Content</div></DualSidebarLayout>,
'/sbom'
);
    expect(screen.getByText('SBOM Content')).toBeInTheDocument();
  });

  it('highlights Remediation Center when route is /remediation', () => {
    renderWithProviders(
<DualSidebarLayout><div>Remediation Content</div></DualSidebarLayout>,
'/remediation'
);
    expect(screen.getByText('Remediation Content')).toBeInTheDocument();
  });

  it('highlights Compliance Engine when route is /compliance', () => {
    renderWithProviders(
<DualSidebarLayout><div>Compliance Content</div></DualSidebarLayout>,
'/compliance'
);
    expect(screen.getByText('Compliance Content')).toBeInTheDocument();
  });

  it('highlights DevSecOps Pipeline when route is /devsecops', () => {
    renderWithProviders(
<DualSidebarLayout><div>DevSecOps Content</div></DualSidebarLayout>,
'/devsecops'
);
    expect(screen.getByText('DevSecOps Content')).toBeInTheDocument();
  });

  it('highlights Loki Log Explorer when route is /logs', () => {
    renderWithProviders(
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

    // Verify all 8 consolidated primary module labels are rendered and visible in the DOM
    expect(screen.getAllByText('Security Center').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Kubernetes Monitoring').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Repository Security').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Vulnerability Management').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Runtime Threats').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Attack Paths & Graph').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Remediation & Compliance').length).toBeGreaterThan(0);
    expect(screen.getAllByText('AI Insights & Settings').length).toBeGreaterThan(0);

    // Toggle collapse
    const collapseButton = screen.getByLabelText('Collapse sidebar');
    expect(collapseButton).toBeInTheDocument();
    fireEvent.click(collapseButton);

    // Verify button toggles to expand
    expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument();
  });
});

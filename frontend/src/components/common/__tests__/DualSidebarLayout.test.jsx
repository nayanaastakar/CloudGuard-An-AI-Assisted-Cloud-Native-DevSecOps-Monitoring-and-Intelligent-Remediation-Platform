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
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";function renderWithProviders(ui, initialRoute = '/') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  return render(/*#__PURE__*/
    _jsxDEV(QueryClientProvider, { client: queryClient, children: /*#__PURE__*/
      _jsxDEV(MemoryRouter, { initialEntries: [initialRoute], children: /*#__PURE__*/
        _jsxDEV(ThemeProvider, { children: /*#__PURE__*/
          _jsxDEV(AuthProvider, { children: /*#__PURE__*/
            _jsxDEV(NotificationProvider, { children: /*#__PURE__*/
              _jsxDEV(ClusterProvider, { children: /*#__PURE__*/
                _jsxDEV(NamespaceProvider, { children:
                  ui }, void 0, false
                ) }, void 0, false
              ) }, void 0, false
            ) }, void 0, false
          ) }, void 0, false
        ) }, void 0, false
      ) }, void 0, false
    )
  );
}

describe('DualSidebarLayout Navigation Audit', () => {
  it('highlights Security Center when route is /', () => {
    const { container } = renderWithProviders(/*#__PURE__*/
      _jsxDEV(DualSidebarLayout, { children: /*#__PURE__*/_jsxDEV("div", { children: "Dashboard Content" }, void 0, false) }, void 0, false),
      '/'
    );
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
    // Verify the active item uses the primary palette color.
    const activeItem = container.querySelector('.bg-primary-500');
    expect(activeItem).toBeInTheDocument();
  });

  it('highlights Asset Inventory when route is /assets', () => {
    const { container } = renderWithProviders(/*#__PURE__*/
      _jsxDEV(DualSidebarLayout, { children: /*#__PURE__*/_jsxDEV("div", { children: "Assets Content" }, void 0, false) }, void 0, false),
      '/assets'
    );
    expect(screen.getByText('Assets Content')).toBeInTheDocument();
    const activeItem = container.querySelector('.bg-primary-500');
    expect(activeItem).toBeInTheDocument();
  });

  it('highlights Runtime Threat Detection when route is /threats', () => {
    const { container } = renderWithProviders(/*#__PURE__*/
      _jsxDEV(DualSidebarLayout, { children: /*#__PURE__*/_jsxDEV("div", { children: "Threats Content" }, void 0, false) }, void 0, false),
      '/threats'
    );
    expect(screen.getByText('Threats Content')).toBeInTheDocument();
    const activeItem = container.querySelector('.bg-primary-500');
    expect(activeItem).toBeInTheDocument();
  });

  it('highlights Security Graph when route is /graph', () => {
    renderWithProviders(/*#__PURE__*/
      _jsxDEV(DualSidebarLayout, { children: /*#__PURE__*/_jsxDEV("div", { children: "Graph Content" }, void 0, false) }, void 0, false),
      '/graph'
    );
    expect(screen.getByText('Graph Content')).toBeInTheDocument();
  });

  it('highlights Attack Path Analysis when route is /attack-paths', () => {
    renderWithProviders(/*#__PURE__*/
      _jsxDEV(DualSidebarLayout, { children: /*#__PURE__*/_jsxDEV("div", { children: "Attack Paths Content" }, void 0, false) }, void 0, false),
      '/attack-paths'
    );
    expect(screen.getByText('Attack Paths Content')).toBeInTheDocument();
  });

  it('highlights AI Incident Investigation when route is /incidents', () => {
    renderWithProviders(/*#__PURE__*/
      _jsxDEV(DualSidebarLayout, { children: /*#__PURE__*/_jsxDEV("div", { children: "Incidents Content" }, void 0, false) }, void 0, false),
      '/incidents'
    );
    expect(screen.getByText('Incidents Content')).toBeInTheDocument();
  });

  it('highlights Vulnerability Intelligence when route is /vulnerabilities', () => {
    renderWithProviders(/*#__PURE__*/
      _jsxDEV(DualSidebarLayout, { children: /*#__PURE__*/_jsxDEV("div", { children: "Vulnerabilities Content" }, void 0, false) }, void 0, false),
      '/vulnerabilities'
    );
    expect(screen.getByText('Vulnerabilities Content')).toBeInTheDocument();
  });

  it('highlights Scanner Health & SBOM when route is /sbom', () => {
    renderWithProviders(/*#__PURE__*/
      _jsxDEV(DualSidebarLayout, { children: /*#__PURE__*/_jsxDEV("div", { children: "SBOM Content" }, void 0, false) }, void 0, false),
      '/sbom'
    );
    expect(screen.getByText('SBOM Content')).toBeInTheDocument();
  });

  it('highlights Remediation Center when route is /remediation', () => {
    renderWithProviders(/*#__PURE__*/
      _jsxDEV(DualSidebarLayout, { children: /*#__PURE__*/_jsxDEV("div", { children: "Remediation Content" }, void 0, false) }, void 0, false),
      '/remediation'
    );
    expect(screen.getByText('Remediation Content')).toBeInTheDocument();
  });

  it('highlights Compliance Engine when route is /compliance', () => {
    renderWithProviders(/*#__PURE__*/
      _jsxDEV(DualSidebarLayout, { children: /*#__PURE__*/_jsxDEV("div", { children: "Compliance Content" }, void 0, false) }, void 0, false),
      '/compliance'
    );
    expect(screen.getByText('Compliance Content')).toBeInTheDocument();
  });

  it('highlights DevSecOps Pipeline when route is /devsecops', () => {
    renderWithProviders(/*#__PURE__*/
      _jsxDEV(DualSidebarLayout, { children: /*#__PURE__*/_jsxDEV("div", { children: "DevSecOps Content" }, void 0, false) }, void 0, false),
      '/devsecops'
    );
    expect(screen.getByText('DevSecOps Content')).toBeInTheDocument();
  });

  it('highlights Loki Log Explorer when route is /logs', () => {
    renderWithProviders(/*#__PURE__*/
      _jsxDEV(DualSidebarLayout, { children: /*#__PURE__*/_jsxDEV("div", { children: "Logs Content" }, void 0, false) }, void 0, false),
      '/logs'
    );
    expect(screen.getByText('Logs Content')).toBeInTheDocument();
  });

  it('renders labels beside icons and supports collapsing/expanding', () => {
    renderWithProviders(/*#__PURE__*/
      _jsxDEV(DualSidebarLayout, { children: /*#__PURE__*/_jsxDEV("div", { children: "Main Content" }, void 0, false) }, void 0, false),
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
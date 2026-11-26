import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { TerminalProvider } from './contexts/TerminalContext';
import { ClusterProvider } from './contexts/ClusterContext';
import { NamespaceProvider } from './contexts/NamespaceContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { NotificationProvider } from './contexts/NotificationContext';
import DualSidebarLayout from './components/common/DualSidebarLayout';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load heavy components
const Dashboard = /*#__PURE__*/lazy(() => import('./components/dashboard/Dashboard'));
const NodesView = /*#__PURE__*/lazy(() => import('./components/kubernetes/NodesView'));
const ClusterMetrics = /*#__PURE__*/lazy(() => import('./components/kubernetes/ClusterMetrics'));
const KubernetesResourcesView = /*#__PURE__*/lazy(() => import('./components/kubernetes/KubernetesResourcesView'));
const KubectlTerminal = /*#__PURE__*/lazy(() => import('./components/kubernetes/KubectlTerminal'));
const YAMLDeployEnhanced = /*#__PURE__*/lazy(() => import('./components/deploy/YAMLDeployEnhanced'));
const HelmDeploy = /*#__PURE__*/lazy(() => import('./components/deploy/HelmDeploy'));
const HelmDashboard = /*#__PURE__*/lazy(() => import('./components/helm/HelmDashboard'));
const HelmChartCatalog = /*#__PURE__*/lazy(() => import('./components/helm/HelmChartCatalog'));
const HelmChartWorkspace = /*#__PURE__*/lazy(() => import('./components/helm/HelmChartWorkspace'));
const ArgoCDDeploy = /*#__PURE__*/lazy(() => import('./components/deploy/ArgoCDDeploy'));
const ClusterManagement = /*#__PURE__*/lazy(() => import('./components/clusters/ClusterManagement'));
const SecurityDashboard = /*#__PURE__*/lazy(() => import('./components/security/SecurityDashboard'));
const CloudGuardDashboard = /*#__PURE__*/lazy(() => import('./components/security/CloudGuardDashboard'));
const AssetInventoryView = /*#__PURE__*/lazy(() => import('./components/security/AssetInventoryView'));
const ScannerHealthAndSBOMView = /*#__PURE__*/lazy(() => import('./components/security/ScannerHealthAndSBOMView'));
const AttackPathView = /*#__PURE__*/lazy(() => import('./components/security/AttackPathView'));
const SecurityGraphView = /*#__PURE__*/lazy(() => import('./components/security/SecurityGraphView'));
const IncidentInvestigationView = /*#__PURE__*/lazy(() => import('./components/security/IncidentInvestigationView'));
const RemediationCenterView = /*#__PURE__*/lazy(() => import('./components/security/RemediationCenterView'));
const VulnerabilityIntelligenceView = /*#__PURE__*/lazy(() => import('./components/security/VulnerabilityIntelligenceView'));
const ComplianceView = /*#__PURE__*/lazy(() => import('./components/security/ComplianceView'));
const DevSecOpsPipelineView = /*#__PURE__*/lazy(() => import('./components/security/DevSecOpsPipelineView'));
const RepositorySecurityView = /*#__PURE__*/lazy(() => import('./components/security/RepositorySecurityView'));
const RuntimeThreatView = /*#__PURE__*/lazy(() => import('./components/security/RuntimeThreatView'));
const LogExplorerView = /*#__PURE__*/lazy(() => import('./components/monitoring/LogExplorerView'));
const GitHubRepositoriesPage = /*#__PURE__*/lazy(() => import('./components/security/GitHubRepositoriesPage'));
// const ClusterCostDashboard = lazy(() => import('./components/cost/ClusterCostDashboard'));  // Excluded from v1.4.0
const EventLogs = /*#__PURE__*/lazy(() => import('./components/events/EventLogs'));
const NetworkingDashboard = /*#__PURE__*/lazy(() => import('./components/networking/NetworkingDashboard'));
const UserManagement = /*#__PURE__*/lazy(() => import('./components/admin/UserManagement'));
const AuditLogs = /*#__PURE__*/lazy(() => import('./components/admin/AuditLogs'));
const ApiKeysPage = /*#__PURE__*/lazy(() => import('./components/admin/ApiKeysPage'));
const ProfileSettings = /*#__PURE__*/lazy(() => import('./components/auth/ProfileSettings'));
const IntegrationPage = /*#__PURE__*/lazy(() => import('./components/integrations/IntegrationPage'));
const AboutPage = /*#__PURE__*/lazy(() => import('./components/about/AboutPage'));
const ClusterOverview = /*#__PURE__*/lazy(() => import('./components/cluster/ClusterOverview'));
const NamespacesPage = /*#__PURE__*/lazy(() => import('./components/namespaces/NamespacesPage'));
const AIOptimizationHub = /*#__PURE__*/lazy(() => import('./components/optimization/AIOptimizationHub'));
const StoragePage = /*#__PURE__*/lazy(() => import('./components/storage/StoragePage'));
const ConfigurationPage = /*#__PURE__*/lazy(() => import('./components/kubernetes/ConfigurationPage'));
const SettingsIntegrationsPage = /*#__PURE__*/lazy(() => import('./components/settings/IntegrationsPage'));
const SettingsPage = /*#__PURE__*/lazy(() => import('./components/settings/SettingsPage'));
const MonitoringDashboard = /*#__PURE__*/lazy(() => import('./components/monitoring/MonitoringDashboard'));
const PrometheusSetup = /*#__PURE__*/lazy(() => import('./components/prometheus/PrometheusSetup'));
const MetricsExplorer = /*#__PURE__*/lazy(() => import('./components/prometheus/MetricsExplorer'));
const AlertsView = /*#__PURE__*/lazy(() => import('./components/prometheus/AlertsView'));
const TargetsView = /*#__PURE__*/lazy(() => import('./components/prometheus/TargetsView'));
const AIChatPanel = /*#__PURE__*/lazy(() => import('./components/common/AIChatPanel').then((m) => ({ default: m.default })));

// Pipeline Module - Excluded from v1.4.0 release
// const PipelinesPage = lazy(() => import('./components/pipelines/PipelinesPage'));
// const PipelineEditor = lazy(() => import('./components/pipelines/PipelineEditor'));
// const PipelineDetails = lazy(() => import('./components/pipelines/PipelineDetails'));
// const PipelineRunDetail = lazy(() => import('./components/pipelines/PipelineRunDetail'));
// const PipelineRunHistory = lazy(() => import('./components/pipelines/PipelineRunHistory'));
// const PipelineLogs = lazy(() => import('./components/pipelines/PipelineLogs'));

import { AIChatTrigger } from './components/common/AIChatPanel';
import CommandPalette, { useCommandPalette } from './components/common/CommandPalette';

// Create QueryClient with default options for caching
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data stays fresh for 30 seconds by default
      staleTime: 30 * 1000,
      // Keep unused data in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry failed requests once
      retry: 1,
      // Don't refetch on window focus by default (reduces API calls)
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true
    }
  }
});

// Smooth scroll restoration
function ScrollToTop() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Don't scroll on first render (page load/reload)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Only scroll on navigation between routes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

// Loading fallback
function PageLoader() {
  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.15 },
      className: "flex items-center justify-center h-64", children: /*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center gap-3 text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
        _jsxDEV("svg", { className: "animate-spin h-5 w-5", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [/*#__PURE__*/
          _jsxDEV("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }, void 0, false), /*#__PURE__*/
          _jsxDEV("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("span", { children: "Loading..." }, void 0, false)] }, void 0, true
      ) }, void 0, false
    ));

}

// Page transition
function PageTransition({ children }) {
  const location = useLocation();

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {

      initial: { opacity: 0.8 },
      animate: { opacity: 1 },
      transition: { duration: 0.1 }, children:

      children }, location.pathname, false
    ));

}

function AppContent() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { isOpen: isCommandPaletteOpen, close: closeCommandPalette } = useCommandPalette();
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigate = (e) => {
      navigate(e.detail.path);
    };

    const handleOpenAiChat = () => {
      setIsChatOpen(true);
    };

    window.addEventListener('navigate', handleNavigate);
    window.addEventListener('open-ai-chat', handleOpenAiChat);

    return () => {
      window.removeEventListener('navigate', handleNavigate);
      window.removeEventListener('open-ai-chat', handleOpenAiChat);
    };
  }, [navigate]);

  return (/*#__PURE__*/
    _jsxDEV(_Fragment, { children: /*#__PURE__*/
      _jsxDEV(Routes, { children: [/*#__PURE__*/
        _jsxDEV(Route, { path: "/login", element: /*#__PURE__*/_jsxDEV(LoginPage, {}, void 0, false) }, void 0, false), /*#__PURE__*/
        _jsxDEV(Route, {
          path: "/*",
          element: /*#__PURE__*/
          _jsxDEV(ProtectedRoute, { children: [/*#__PURE__*/
            _jsxDEV(ScrollToTop, {}, void 0, false), /*#__PURE__*/
            _jsxDEV(DualSidebarLayout, { children: /*#__PURE__*/
              _jsxDEV(Suspense, { fallback: /*#__PURE__*/_jsxDEV(PageLoader, {}, void 0, false), children: /*#__PURE__*/
                _jsxDEV(PageTransition, { children: /*#__PURE__*/
                  _jsxDEV(Routes, { children: [/*#__PURE__*/

                    _jsxDEV(Route, { path: "/", element: /*#__PURE__*/_jsxDEV(CloudGuardDashboard, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/security", element: /*#__PURE__*/_jsxDEV(CloudGuardDashboard, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/assets", element: /*#__PURE__*/_jsxDEV(AssetInventoryView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/sbom", element: /*#__PURE__*/_jsxDEV(ScannerHealthAndSBOMView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/scanners", element: /*#__PURE__*/_jsxDEV(ScannerHealthAndSBOMView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/threats", element: /*#__PURE__*/_jsxDEV(RuntimeThreatView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/runtime", element: /*#__PURE__*/_jsxDEV(RuntimeThreatView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/attack-paths", element: /*#__PURE__*/_jsxDEV(AttackPathView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/graph", element: /*#__PURE__*/_jsxDEV(SecurityGraphView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/security-graph", element: /*#__PURE__*/_jsxDEV(SecurityGraphView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/incidents", element: /*#__PURE__*/_jsxDEV(IncidentInvestigationView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/remediation", element: /*#__PURE__*/_jsxDEV(RemediationCenterView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/vulnerabilities", element: /*#__PURE__*/_jsxDEV(VulnerabilityIntelligenceView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/compliance", element: /*#__PURE__*/_jsxDEV(ComplianceView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/devsecops", element: /*#__PURE__*/_jsxDEV(DevSecOpsPipelineView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/repository-security", element: /*#__PURE__*/_jsxDEV(RepositorySecurityView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/github-repos", element: /*#__PURE__*/_jsxDEV(GitHubRepositoriesPage, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/github", element: /*#__PURE__*/_jsxDEV(GitHubRepositoriesPage, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/overview", element: /*#__PURE__*/_jsxDEV(Dashboard, {}, void 0, false) }, void 0, false), /*#__PURE__*/


                    _jsxDEV(Route, { path: "/cluster-overview", element: /*#__PURE__*/_jsxDEV(ClusterOverview, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/kubernetes/nodes", element: /*#__PURE__*/_jsxDEV(NodesView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/namespaces", element: /*#__PURE__*/_jsxDEV(NamespacesPage, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/kubernetes/workloads", element: /*#__PURE__*/_jsxDEV(KubernetesResourcesView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/kubernetes/networking", element: /*#__PURE__*/_jsxDEV(NetworkingDashboard, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/kubernetes/storage", element: /*#__PURE__*/_jsxDEV(StoragePage, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/kubernetes/configuration", element: /*#__PURE__*/_jsxDEV(ConfigurationPage, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/kubernetes", element: /*#__PURE__*/_jsxDEV(Navigate, { to: "/kubernetes/workloads", replace: true }, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/networking", element: /*#__PURE__*/_jsxDEV(Navigate, { to: "/kubernetes/networking", replace: true }, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/storage", element: /*#__PURE__*/_jsxDEV(Navigate, { to: "/kubernetes/storage", replace: true }, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/kubernetes/metrics", element: /*#__PURE__*/_jsxDEV(ClusterMetrics, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/kubernetes/terminal", element: /*#__PURE__*/_jsxDEV(KubectlTerminal, {}, void 0, false) }, void 0, false), /*#__PURE__*/


                    _jsxDEV(Route, { path: "/deploy/yaml", element: /*#__PURE__*/_jsxDEV(YAMLDeployEnhanced, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/deploy/helm", element: /*#__PURE__*/_jsxDEV(HelmDashboard, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/deploy/helm/catalog", element: /*#__PURE__*/_jsxDEV(HelmChartCatalog, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/deploy/helm/workspace", element: /*#__PURE__*/_jsxDEV(HelmChartWorkspace, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/deploy/helm/workspace/:namespace/:releaseName", element: /*#__PURE__*/_jsxDEV(HelmChartWorkspace, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/deploy/helm/install", element: /*#__PURE__*/_jsxDEV(HelmDeploy, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/deploy/argocd", element: /*#__PURE__*/_jsxDEV(ArgoCDDeploy, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/deploy", element: /*#__PURE__*/_jsxDEV(Navigate, { to: "/deploy/yaml", replace: true }, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/gitops", element: /*#__PURE__*/_jsxDEV(Navigate, { to: "/deploy/argocd", replace: true }, void 0, false) }, void 0, false), /*#__PURE__*/















                    _jsxDEV(Route, { path: "/optimization", element: /*#__PURE__*/_jsxDEV(AIOptimizationHub, {}, void 0, false) }, void 0, false), /*#__PURE__*/


                    _jsxDEV(Route, { path: "/security", element: /*#__PURE__*/_jsxDEV(SecurityDashboard, {}, void 0, false) }, void 0, false), /*#__PURE__*/


                    _jsxDEV(Route, { path: "/monitoring", element: /*#__PURE__*/_jsxDEV(MonitoringDashboard, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/logs", element: /*#__PURE__*/_jsxDEV(LogExplorerView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/monitoring/logs", element: /*#__PURE__*/_jsxDEV(LogExplorerView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/monitoring/prometheus", element: /*#__PURE__*/_jsxDEV(PrometheusSetup, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/monitoring/prometheus/explorer", element: /*#__PURE__*/_jsxDEV(MetricsExplorer, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/monitoring/prometheus/alerts", element: /*#__PURE__*/_jsxDEV(AlertsView, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/monitoring/prometheus/targets", element: /*#__PURE__*/_jsxDEV(TargetsView, {}, void 0, false) }, void 0, false), /*#__PURE__*/





                    _jsxDEV(Route, { path: "/integrations", element: /*#__PURE__*/_jsxDEV(SettingsIntegrationsPage, {}, void 0, false) }, void 0, false), /*#__PURE__*/


                    _jsxDEV(Route, { path: "/settings", element: /*#__PURE__*/_jsxDEV(SettingsPage, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/profile", element: /*#__PURE__*/_jsxDEV(ProfileSettings, {}, void 0, false) }, void 0, false), /*#__PURE__*/


                    _jsxDEV(Route, { path: "/clusters", element: /*#__PURE__*/_jsxDEV(ClusterManagement, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/events", element: /*#__PURE__*/_jsxDEV(EventLogs, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/admin/users", element: /*#__PURE__*/_jsxDEV(UserManagement, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/admin/audit-logs", element: /*#__PURE__*/_jsxDEV(AuditLogs, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/admin/api-keys", element: /*#__PURE__*/_jsxDEV(ApiKeysPage, {}, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/admin/roles", element: /*#__PURE__*/_jsxDEV(Navigate, { to: "/admin/users", replace: true }, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/about", element: /*#__PURE__*/_jsxDEV(AboutPage, {}, void 0, false) }, void 0, false), /*#__PURE__*/


                    _jsxDEV(Route, { path: "/settings/integrations", element: /*#__PURE__*/_jsxDEV(Navigate, { to: "/integrations", replace: true }, void 0, false) }, void 0, false), /*#__PURE__*/
                    _jsxDEV(Route, { path: "/integrations/:type", element: /*#__PURE__*/_jsxDEV(IntegrationPage, {}, void 0, false) }, void 0, false)] }, void 0, true
                  ) }, void 0, false
                ) }, void 0, false
              ) }, void 0, false
            ), /*#__PURE__*/


            _jsxDEV(AnimatePresence, { children:
              isChatOpen && /*#__PURE__*/
              _jsxDEV(Suspense, { fallback: null, children: /*#__PURE__*/
                _jsxDEV(AIChatPanel, { onClose: () => setIsChatOpen(false) }, void 0, false) }, void 0, false
              ) }, void 0, false

            ),


            !isChatOpen && /*#__PURE__*/_jsxDEV(AIChatTrigger, { onClick: () => setIsChatOpen(true) }, void 0, false), /*#__PURE__*/


            _jsxDEV(CommandPalette, {
              isOpen: isCommandPaletteOpen,
              onClose: closeCommandPalette,
              onOpenAIChat: () => setIsChatOpen(true) }, void 0, false
            )] }, void 0, true
          ) }, void 0, false

        )] }, void 0, true
      ) }, void 0, false
    ));

}

function App() {
  return (/*#__PURE__*/
    _jsxDEV(QueryClientProvider, { client: queryClient, children: /*#__PURE__*/
      _jsxDEV(ThemeProvider, { children: /*#__PURE__*/
        _jsxDEV(AuthProvider, { children: /*#__PURE__*/
          _jsxDEV(ClusterProvider, { children: /*#__PURE__*/
            _jsxDEV(NamespaceProvider, { children: /*#__PURE__*/
              _jsxDEV(TerminalProvider, { children: /*#__PURE__*/
                _jsxDEV(ToastProvider, { children: /*#__PURE__*/
                  _jsxDEV(NotificationProvider, { children: /*#__PURE__*/
                    _jsxDEV(AppContent, {}, void 0, false) }, void 0, false
                  ) }, void 0, false
                ) }, void 0, false
              ) }, void 0, false
            ) }, void 0, false
          ) }, void 0, false
        ) }, void 0, false
      ) }, void 0, false
    ));

}

export default App;
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  LockClosedIcon,
  GlobeAltIcon } from
'@heroicons/react/24/outline';
import api from '../../services/api';
import { logger } from '../../utils/logger';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import GlassCard, { SectionHeader } from '../common/GlassCard';
import { Spinner, ProgressBar, CircularProgress, SecuritySkeleton, ConnectionError } from '../common/LoadingStates';
import { useCluster } from '../../contexts/ClusterContext';
import { useSecurityDashboard } from '../../hooks/useSecurityData';

// Import shared constants
import { containerVariants, itemVariants, scaleVariants } from '../../utils/constants';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";




























































































































































// Modal variants (uses shared scaleVariants as base)
const modalVariants = {
  ...scaleVariants,
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', duration: 0.3 } }
};

export default function SecurityDashboard() {
  const { activeCluster } = useCluster();

  // Use cached hook for main security data - cluster-aware caching
  const {
    dashboard: data,
    rbacSummary,
    networkPolicySummary,
    trendsSummary,
    isLoading: loading,
    isRefetching,
    error: queryError,
    refresh: refreshSecurityData
  } = useSecurityDashboard(activeCluster?.id);

  const [scanning, setScanning] = useState(false);
  const [, setError] = useState(null);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [imageScans, setImageScans] = useState([]);
  const [showImageScans, setShowImageScans] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);
  const [showAllFindings, setShowAllFindings] = useState(false);

  // Loading states are now handled by the useSecurityDashboard hook (isRefetching)

  // Detailed data for modals
  const [rbacDetail, setRbacDetail] = useState(null);
  const [networkPolicyDetail, setNetworkPolicyDetail] = useState(null);
  const [trendsDetail, setTrendsDetail] = useState(null);
  const [showRbacModal, setShowRbacModal] = useState(false);
  const [showNetPolModal, setShowNetPolModal] = useState(false);
  const [showTrendsModal, setShowTrendsModal] = useState(false);
  const [loadingRbacDetail, setLoadingRbacDetail] = useState(false);
  const [loadingNetPolDetail, setLoadingNetPolDetail] = useState(false);
  const [loadingTrendsDetail, setLoadingTrendsDetail] = useState(false);

  // AI Remediation state
  const [aiRemediation, setAiRemediation] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [loadingAiRemediation, setLoadingAiRemediation] = useState(null);
  const [, setAiError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [showInlineAi, setShowInlineAi] = useState(false);

  // Copy code to clipboard
  const copyToClipboard = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Custom code block component
  const CodeBlock = ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');
    const isInline = !match && !codeString.includes('\n') && codeString.length < 50;

    if (!isInline) {
      const language = match ? match[1] : 'bash';
      return (/*#__PURE__*/
        _jsxDEV("div", { className: "relative group my-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "absolute left-3 top-0 transform -translate-y-1/2 z-10", children: /*#__PURE__*/
            _jsxDEV("span", { className: "px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-md shadow-lg", children:
              language.toUpperCase() }, void 0, false
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "absolute right-2 top-2 z-10", children: /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => copyToClipboard(codeString),
              className: `p-2 rounded-lg transition-all duration-300 flex items-center gap-1.5 ${
              copiedCode === codeString ?
              'bg-success-500 text-white shadow-lg' :
              'bg-slate-700/80 hover:bg-primary-600 text-slate-300 hover:text-white'}`, children:


              copiedCode === codeString ? /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(ClipboardDocumentCheckIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-xs font-medium", children: "Copied!" }, void 0, false)] }, void 0, true
              ) : /*#__PURE__*/

              _jsxDEV(ClipboardDocumentIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false

            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV(SyntaxHighlighter, {
            style: oneDark,
            language: language,
            PreTag: "div",
            className: "rounded-xl !bg-slate-900 !mt-2 !pt-6 border border-slate-700/50",
            showLineNumbers: codeString.split('\n').length > 3,
            customStyle: {
              margin: 0,
              padding: '1.5rem 1rem 1rem 1rem',
              paddingRight: '4rem',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'
            }, ...
            props, children:

            codeString }, void 0, false
          )] }, void 0, true
        ));

    }

    return (/*#__PURE__*/
      _jsxDEV("code", { className: "bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-300 px-1.5 py-0.5 rounded-md text-sm font-mono", ...props, children:
        children }, void 0, false
      ));

  };

  const PreBlock = ({ children }) => /*#__PURE__*/_jsxDEV(_Fragment, { children: children }, void 0, false);

  const markdownComponents = {
    code: CodeBlock,
    pre: PreBlock,
    h1: ({ children }) => /*#__PURE__*/
    _jsxDEV("h1", { className: "text-xl font-bold mt-6 mb-3 pb-2 border-b border-primary-500/30", children: /*#__PURE__*/
      _jsxDEV("span", { className: "bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent", children:
        children }, void 0, false
      ) }, void 0, false
    ),

    h2: ({ children }) => /*#__PURE__*/
    _jsxDEV("h2", { className: "text-lg font-semibold mt-5 mb-3 flex items-center gap-2", children: [/*#__PURE__*/
      _jsxDEV("span", { className: "w-1 h-5 bg-gradient-to-b from-primary-500 to-primary-400 rounded-full" }, void 0, false), /*#__PURE__*/
      _jsxDEV("span", { className: "text-primary-700 dark:text-primary-400", children: children }, void 0, false)] }, void 0, true
    ),

    h3: ({ children }) => /*#__PURE__*/
    _jsxDEV("h3", { className: "text-base font-semibold mt-4 mb-2 text-warning-600 dark:text-warning-400 flex items-center gap-2", children: [/*#__PURE__*/
      _jsxDEV("span", { className: "w-2 h-2 bg-warning-500 rounded-full" }, void 0, false),
      children] }, void 0, true
    ),

    p: ({ children }) => /*#__PURE__*/
    _jsxDEV("p", { className: "text-slate-700 dark:text-slate-300 my-2 leading-relaxed", children: children }, void 0, false),

    ul: ({ children }) => /*#__PURE__*/
    _jsxDEV("ul", { className: "my-3 space-y-2 text-slate-700 dark:text-slate-300", children: children }, void 0, false),

    li: ({ children }) => /*#__PURE__*/
    _jsxDEV("li", { className: "flex items-start gap-2", children: [/*#__PURE__*/
      _jsxDEV("span", { className: "flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-primary-500" }, void 0, false), /*#__PURE__*/
      _jsxDEV("span", { children: children }, void 0, false)] }, void 0, true
    ),

    strong: ({ children }) => /*#__PURE__*/
    _jsxDEV("strong", { className: "font-semibold text-primary-700 dark:text-primary-300", children: children }, void 0, false),

    blockquote: ({ children }) => /*#__PURE__*/
    _jsxDEV("blockquote", { className: "relative my-4 pl-4 py-3 bg-primary-50 dark:bg-primary-900/20 rounded-r-lg border-l-4 border-primary-500", children: /*#__PURE__*/
      _jsxDEV("div", { className: "text-slate-600 dark:text-slate-300 italic", children: children }, void 0, false) }, void 0, false
    ),

    a: ({ href, children }) => /*#__PURE__*/
    _jsxDEV("a", { href: href, target: "_blank", rel: "noopener noreferrer", className: "text-primary-600 dark:text-primary-400 hover:underline", children:
      children }, void 0, false
    )

  };

  // API Functions
  const triggerScan = async () => {
    try {
      setScanning(true);
      await api.post('/security/scan');
      await refreshSecurityData();
    } catch (err) {
      logger.error('Error triggering scan', err);
      setError(err.response?.data?.detail || 'Failed to trigger security scan');
    } finally {
      setScanning(false);
    }
  };

  const fetchImageScans = async () => {
    try {
      setLoadingImages(true);
      const response = await api.get('/security/image-scans');
      setImageScans(response.data);
      setShowImageScans(true);
    } catch (err) {
      logger.error('Error fetching image scans', err);
      setError(err.response?.data?.detail || 'Failed to fetch image scans');
    } finally {
      setLoadingImages(false);
    }
  };

  const fetchRbacDetail = async () => {
    try {
      setLoadingRbacDetail(true);
      const response = await api.get('/security/rbac');
      setRbacDetail(response.data);
      setShowRbacModal(true);
    } catch (err) {
      logger.error('Error fetching RBAC details', err);
      setError(err.response?.data?.detail || 'Failed to fetch RBAC details');
    } finally {
      setLoadingRbacDetail(false);
    }
  };

  const fetchNetworkPolicyDetail = async () => {
    try {
      setLoadingNetPolDetail(true);
      const response = await api.get('/security/network-policies');
      setNetworkPolicyDetail(response.data);
      setShowNetPolModal(true);
    } catch (err) {
      logger.error('Error fetching network policy details', err);
      setError(err.response?.data?.detail || 'Failed to fetch network policy details');
    } finally {
      setLoadingNetPolDetail(false);
    }
  };

  const fetchTrendsDetail = async () => {
    try {
      setLoadingTrendsDetail(true);
      const response = await api.get('/security/trends?days=30');
      setTrendsDetail(response.data);
      setShowTrendsModal(true);
    } catch (err) {
      logger.error('Error fetching trends details', err);
      setError(err.response?.data?.detail || 'Failed to fetch trends details');
    } finally {
      setLoadingTrendsDetail(false);
    }
  };

  const fetchAiRemediation = async (finding) => {
    if (loadingAiRemediation) return;
    const loadingId = `finding-${finding.id}`;
    try {
      setShowAiModal(false);
      setAiRemediation(null);
      setLoadingAiRemediation(loadingId);
      setAiError(null);
      setShowInlineAi(true);

      const response = await api.post('/security/ai-remediate', {
        finding_type: finding.type,
        severity: finding.severity,
        title: finding.title,
        description: finding.description,
        resource_type: finding.resource_type,
        resource_name: finding.resource_name,
        namespace: finding.namespace,
        cve_id: finding.cve_id
      });
      setAiRemediation(response.data);
    } catch (err) {
      logger.error('Error fetching AI remediation', err);
      setAiError(err.response?.data?.detail || 'Failed to get AI remediation advice');
    } finally {
      setLoadingAiRemediation(null);
    }
  };

  const fetchAiRemediationForServiceAccount = async (sa) => {
    if (loadingAiRemediation) return;
    const loadingId = `sa-${sa.namespace}-${sa.name}`;
    try {
      setShowAiModal(false);
      setAiRemediation(null);
      setLoadingAiRemediation(loadingId);
      setAiError(null);

      const response = await api.post('/security/ai-remediate', {
        finding_type: 'rbac',
        severity: sa.risk_level,
        title: `Risky Service Account: ${sa.name}`,
        description: `Service account ${sa.name} in namespace ${sa.namespace} has security issues: ${sa.issues.join(', ')}`,
        resource_type: 'ServiceAccount',
        resource_name: sa.name,
        namespace: sa.namespace,
        additional_context: `Has cluster-admin: ${sa.has_cluster_admin}, Has secrets access: ${sa.has_secrets_access}, Has wildcard: ${sa.has_wildcard_permissions}. Bound roles: ${sa.bound_roles.join(', ')}`
      });
      setAiRemediation(response.data);
      setShowAiModal(true);
    } catch (err) {
      logger.error('Error fetching AI remediation', err);
      setAiError(err.response?.data?.detail || 'Failed to get AI remediation advice');
    } finally {
      setLoadingAiRemediation(null);
    }
  };

  const fetchAiRemediationForRoleBinding = async (rb) => {
    if (loadingAiRemediation) return;
    const loadingId = `rb-${rb.namespace || 'cluster'}-${rb.name}`;
    try {
      setShowAiModal(false);
      setAiRemediation(null);
      setLoadingAiRemediation(loadingId);
      setAiError(null);

      const response = await api.post('/security/ai-remediate', {
        finding_type: 'rbac',
        severity: rb.risk_level,
        title: `Risky Role Binding: ${rb.name}`,
        description: `${rb.binding_type} ${rb.name} binding ${rb.role_kind}/${rb.role_name} has security issues: ${rb.issues.join(', ')}`,
        resource_type: rb.binding_type,
        resource_name: rb.name,
        namespace: rb.namespace || 'cluster-wide',
        additional_context: `Is cluster-admin: ${rb.is_cluster_admin}, Grants secrets: ${rb.grants_secrets_access}, Grants wildcard: ${rb.grants_wildcard}. Subjects: ${rb.subjects.map((s) => `${s.kind}:${s.name}`).join(', ')}`
      });
      setAiRemediation(response.data);
      setShowAiModal(true);
    } catch (err) {
      logger.error('Error fetching AI remediation', err);
      setAiError(err.response?.data?.detail || 'Failed to get AI remediation advice');
    } finally {
      setLoadingAiRemediation(null);
    }
  };

  const fetchAiRemediationForNetworkPolicy = async (ns) => {
    if (loadingAiRemediation) return;
    const loadingId = `netpol-${ns.namespace}`;
    try {
      setShowAiModal(false);
      setAiRemediation(null);
      setLoadingAiRemediation(loadingId);
      setAiError(null);

      const response = await api.post('/security/ai-remediate', {
        finding_type: 'network_policy',
        severity: ns.status === 'unprotected' ? 'high' : 'medium',
        title: `Namespace lacks network policy: ${ns.namespace}`,
        description: `Namespace ${ns.namespace} has ${ns.policy_count} network policies. Status: ${ns.status}. ${ns.pods_uncovered.length} pods are not covered.`,
        resource_type: 'Namespace',
        resource_name: ns.namespace,
        namespace: ns.namespace,
        additional_context: `Default deny ingress: ${ns.has_default_deny_ingress}, Default deny egress: ${ns.has_default_deny_egress}. Uncovered pods: ${ns.pods_uncovered.slice(0, 5).join(', ')}${ns.pods_uncovered.length > 5 ? '...' : ''}`
      });
      setAiRemediation(response.data);
      setShowAiModal(true);
    } catch (err) {
      logger.error('Error fetching AI remediation', err);
      setAiError(err.response?.data?.detail || 'Failed to get AI remediation advice');
    } finally {
      setLoadingAiRemediation(null);
    }
  };

  const fetchAiRemediationForVulnerability = async (vuln, imageName) => {
    if (loadingAiRemediation) return;
    const loadingId = `vuln-${vuln.vulnerability_id}`;
    try {
      setShowAiModal(false);
      setAiRemediation(null);
      setLoadingAiRemediation(loadingId);
      setAiError(null);

      const response = await api.post('/security/ai-remediate', {
        finding_type: 'vulnerability',
        severity: vuln.severity,
        title: vuln.title || `Vulnerability in ${vuln.pkg_name}`,
        description: vuln.description || `${vuln.vulnerability_id} found in package ${vuln.pkg_name} version ${vuln.installed_version}`,
        resource_type: 'Container Image',
        resource_name: imageName,
        cve_id: vuln.vulnerability_id,
        additional_context: `Package: ${vuln.pkg_name}, Installed: ${vuln.installed_version}, Fixed in: ${vuln.fixed_version || 'No fix available'}${vuln.cvss_score ? `, CVSS: ${vuln.cvss_score}` : ''}`
      });
      setAiRemediation(response.data);
      setShowAiModal(true);
    } catch (err) {
      logger.error('Error fetching AI remediation', err);
      setAiError(err.response?.data?.detail || 'Failed to get AI remediation advice');
    } finally {
      setLoadingAiRemediation(null);
    }
  };

  // Helper functions
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A':return 'text-success-500';
      case 'B':return 'text-primary-500';
      case 'C':return 'text-warning-500';
      case 'D':return 'text-warning-600';
      case 'F':return 'text-danger-500';
      default:return 'text-gray-500';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'danger';
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical':return 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400';
      case 'high':return 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400';
      case 'medium':return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400';
      default:return 'bg-gray-100 text-gray-800 dark:bg-slate-950/30 dark:text-gray-400';
    }
  };

  // Generate plain English explanations for security findings
  const getPlainEnglishExplanation = (finding) => {
    const typeExplanations = {
      'vulnerability': {
        explanation: `This container image has a known security vulnerability (${finding.cve_id || 'CVE'}). Think of it like running software with a known bug that hackers can exploit to break into your system.`,
        businessImpact: 'Attackers could use this vulnerability to steal data, disrupt services, or gain unauthorized access to your applications.',
        complianceRisk: 'May violate PCI-DSS, SOC 2, HIPAA, and ISO 27001 requirements for vulnerability management.'
      },
      'misconfiguration': {
        explanation: 'This resource is configured in a way that creates security risks. It\'s like leaving a door unlocked or a window open in your house.',
        businessImpact: 'Increases the attack surface and makes it easier for malicious actors to compromise your infrastructure.',
        complianceRisk: 'May violate CIS Kubernetes Benchmarks and security configuration standards required by major compliance frameworks.'
      },
      'rbac': {
        explanation: 'This resource has excessive permissions that violate the principle of least privilege. It\'s like giving a janitor the master key to every office.',
        businessImpact: 'If compromised, attackers could gain elevated privileges and access sensitive resources they shouldn\'t have access to.',
        complianceRisk: 'Violates SOC 2, ISO 27001, and PCI-DSS requirements for access control and least privilege.'
      },
      'network_policy': {
        explanation: 'This workload lacks proper network segmentation. It\'s like having no doors or walls between rooms in a building.',
        businessImpact: 'Attackers who compromise one component can easily move laterally to access other services and data.',
        complianceRisk: 'May violate PCI-DSS network segmentation requirements and zero-trust architecture principles.'
      },
      'secrets': {
        explanation: 'Sensitive information (passwords, API keys, tokens) is exposed or improperly stored. It\'s like writing your password on a sticky note.',
        businessImpact: 'Exposed credentials can lead to data breaches, unauthorized access, and complete system compromise.',
        complianceRisk: 'Critical violation of SOC 2, HIPAA, PCI-DSS, and GDPR requirements for secrets management.'
      },
      'default': {
        explanation: 'This security issue could put your cluster and applications at risk. It represents a gap between your current configuration and security best practices.',
        businessImpact: 'May allow unauthorized access, data breaches, or service disruptions if exploited by malicious actors.',
        complianceRisk: 'Could violate security requirements in major compliance frameworks including SOC 2, ISO 27001, and industry-specific regulations.'
      }
    };

    const findingType = finding.type.toLowerCase();
    const matchedType = Object.keys(typeExplanations).find((key) => findingType.includes(key));
    return typeExplanations[matchedType || 'default'];
  };

  const getRiskBadgeColor = (level) => {
    switch (level.toLowerCase()) {
      case 'critical':return 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400';
      case 'high':return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400';
      case 'medium':return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400';
    }
  };

  // Debug logging - check console if page is blank
  logger.debug('[SecurityDashboard] Render state', {
    loading,
    isRefetching,
    queryError: queryError ? String(queryError) : null,
    hasData: !!data,
    dataContent: data
  });

  // Loading State
  if (loading) {
    logger.debug('[SecurityDashboard] Showing loading skeleton');
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "p-6", children: /*#__PURE__*/
        _jsxDEV(SecuritySkeleton, {}, void 0, false) }, void 0, false
      ));

  }

  // Error State - check for query error or missing/incomplete dashboard data
  if (data?.audit_status) {
    const auditUnavailable = data.audit_status === 'unavailable';
    const auditPartial = data.audit_status === 'partial';
    return (/*#__PURE__*/
      _jsxDEV("div", { role: auditUnavailable ? 'alert' : 'status', className: `m-6 rounded-xl border p-5 ${auditUnavailable ? 'border-rose-500/30 bg-rose-950/20 text-rose-200' : auditPartial ? 'border-amber-500/30 bg-amber-950/20 text-amber-100' : 'border-emerald-500/30 bg-emerald-950/20 text-emerald-100'}`, children: [/*#__PURE__*/
        _jsxDEV("h2", { className: "font-semibold", children: auditUnavailable ? 'Security audit unavailable' : auditPartial ? 'Security audit partially complete' : 'Security audit complete' }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { className: "mt-2 text-sm", children: data.error || data.provenance?.error_message || (auditPartial ? 'Some Kubernetes security checks could not be completed.' : auditUnavailable ? 'Kubernetes security checks could not be completed.' : 'All configured Kubernetes security checks completed.') }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { className: "mt-2 text-xs", children: ["Source: ", data.provenance?.source || 'Kubernetes API', " · ", auditUnavailable || auditPartial ? 'No complete security score is available.' : `Score: ${data.security_score?.score ?? '—'} (${data.security_score?.grade ?? '—'})`] }, void 0, true), /*#__PURE__*/
        _jsxDEV("p", { className: "mt-1 text-xs", children: ["Findings: ", data.audit_findings?.length ?? 0] }, void 0, true), /*#__PURE__*/
        _jsxDEV("ul", { className: "mt-3 space-y-1 text-xs", children:
          Object.entries(data.checks || {}).map(([name, check]) => /*#__PURE__*/_jsxDEV("li", { children: [name, ": ", check.status, check.error ? ` — ${check.error}` : ''] }, name, true)) }, void 0, false
        ),
        (data.audit_findings || []).length > 0 && /*#__PURE__*/_jsxDEV("ul", { className: "mt-3 space-y-1 text-sm", children: data.audit_findings?.map((finding) => /*#__PURE__*/_jsxDEV("li", { children: [finding.severity.toUpperCase(), ": ", finding.title, " — ", finding.resource_type, "/", finding.resource_name, " (", finding.namespace, ")"] }, finding.finding_id, true)) }, void 0, false), /*#__PURE__*/
        _jsxDEV("button", { onClick: refreshSecurityData, className: "mt-4 rounded-md border border-current/30 px-3 py-1.5 text-sm", children: "Retry audit" }, void 0, false)] }, void 0, true
      ));

  }
  if (queryError || !data?.security_score || !data.vulnerability_summary) {
    logger.debug('[SecurityDashboard] Showing error state - data invalid or error');
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "p-6", children: /*#__PURE__*/
        _jsxDEV(ConnectionError, {
          service: "Security API",
          onRetry: refreshSecurityData,
          retrying: loading || isRefetching }, void 0, false
        ) }, void 0, false
      ));

  }

  const {
    security_score,
    vulnerability_summary,
    top_findings = [],
    compliance_summary = { passed: 0, failed: 0, total: 0 },
    risky_namespaces = []
  } = data;
  const complianceRate = compliance_summary.total > 0 ? Math.round(compliance_summary.passed / compliance_summary.total * 100) : 0;

  // Filter and sort findings to show TOP 3 critical/high risks by default
  const sortedFindings = [...top_findings].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return (severityOrder[a.severity.toLowerCase()] || 99) - (
    severityOrder[b.severity.toLowerCase()] || 99);
  });

  // Show only top 3 critical/high findings unless "View All" is clicked
  const displayedFindings = showAllFindings ? sortedFindings : sortedFindings.slice(0, 3);
  const hasMoreFindings = sortedFindings.length > 3;

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      variants: containerVariants,
      initial: "hidden",
      animate: "visible",
      className: "space-y-6", children: [/*#__PURE__*/


      _jsxDEV(motion.div, {
        variants: itemVariants,
        className: "sticky top-16 z-30 -mx-4 lg:-mx-8 px-4 lg:px-8 py-4 bg-gray-50/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30", children: /*#__PURE__*/
              _jsxDEV(ShieldCheckIcon, { className: "h-6 w-6 text-primary-600 dark:text-primary-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h1", { className: "text-xl font-semibold text-gray-800 dark:text-gray-100", children: "Security" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 text-sm", children: "Cluster security analysis and compliance" }, void 0, false

              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: () => setShowHelp(true),
              className: "p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors", children: /*#__PURE__*/

              _jsxDEV(InformationCircleIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: triggerScan,
              disabled: scanning,
              className: "flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 disabled:opacity-50 transition-all duration-300", children: [/*#__PURE__*/

              _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${scanning ? 'animate-spin' : ''}` }, void 0, false),
              scanning ? 'Scanning...' : 'Scan Now'] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV(GlassCard, { variant: "gradient", padding: "lg", children: /*#__PURE__*/
          _jsxDEV("div", { className: "flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "flex items-center gap-8", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
                _jsxDEV(motion.div, {
                  initial: { scale: 0 },
                  animate: { scale: 1 },
                  transition: { type: 'spring', delay: 0.2 },
                  className: `text-7xl font-bold ${getGradeColor(security_score.grade)}`, children:

                  security_score.grade }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "text-sm text-gray-600 dark:text-gray-400 mt-2", children: "Grade" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "border-l border-gray-200 dark:border-slate-700 pl-8", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-baseline gap-2 mb-2", children: /*#__PURE__*/
                  _jsxDEV(CircularProgress, {
                    progress: security_score.score,
                    size: 80,
                    color: getScoreColor(security_score.score) }, void 0, false
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-3", children: [
                  security_score.total_findings, " security ", security_score.total_findings === 1 ? 'issue' : 'issues', " detected"] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
                  _jsxDEV(ClockIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { children: ["Scanned ", new Date(security_score.last_scan).toLocaleString()] }, void 0, true)] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 min-w-[200px]", children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-3", children: "Issues by Severity" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-between gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "w-2.5 h-2.5 rounded-full bg-danger-500" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Critical" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-lg font-bold text-danger-600 dark:text-danger-400", children: security_score.critical_issues }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-between gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "w-2.5 h-2.5 rounded-full bg-warning-500" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "High" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-lg font-bold text-warning-600 dark:text-warning-400", children: security_score.high_issues }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-between gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "w-2.5 h-2.5 rounded-full bg-yellow-500" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Medium" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-lg font-bold text-yellow-600 dark:text-yellow-400", children: security_score.medium_issues }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-between gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "w-2.5 h-2.5 rounded-full bg-primary-500" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Low" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-lg font-bold text-primary-600 dark:text-primary-400", children: security_score.low_issues }, void 0, false)] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "flex-shrink-0", children: [
              security_score.score < 70 && /*#__PURE__*/
              _jsxDEV("div", { className: "px-4 py-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-xl", children: /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-danger-700 dark:text-danger-400 font-medium", children: "Action needed: Critical security issues detected" }, void 0, false

                ) }, void 0, false
              ),

              security_score.score >= 70 && security_score.score < 90 && /*#__PURE__*/
              _jsxDEV("div", { className: "px-4 py-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-xl", children: /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-warning-700 dark:text-warning-400 font-medium", children: "Good progress: Address remaining issues" }, void 0, false

                ) }, void 0, false
              ),

              security_score.score >= 90 && /*#__PURE__*/
              _jsxDEV("div", { className: "px-4 py-3 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-xl", children: /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-success-700 dark:text-success-400 font-medium", children: "Excellent security posture!" }, void 0, false

                ) }, void 0, false
              )] }, void 0, true

            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [/*#__PURE__*/

        _jsxDEV(GlassCard, { hover: true, children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3 mb-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2.5 bg-danger-100 dark:bg-danger-900/30 rounded-xl", children: /*#__PURE__*/
              _jsxDEV(ExclamationTriangleIcon, { className: "h-5 w-5 text-danger-600 dark:text-danger-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Vulnerabilities" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "CVEs in container images" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex justify-between text-sm", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-gray-600 dark:text-gray-400", children: "Critical" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "font-semibold text-danger-600 dark:text-danger-400", children: vulnerability_summary.critical }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex justify-between text-sm", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-gray-600 dark:text-gray-400", children: "High" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "font-semibold text-warning-600 dark:text-warning-400", children: vulnerability_summary.high }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex justify-between text-sm", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-gray-600 dark:text-gray-400", children: "Medium" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "font-semibold text-yellow-600 dark:text-yellow-400", children: vulnerability_summary.medium }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex justify-between text-sm", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-gray-600 dark:text-gray-400", children: "Low" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "font-semibold text-primary-600 dark:text-primary-400", children: vulnerability_summary.low }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "pt-2 border-t border-gray-200 dark:border-slate-700", children: /*#__PURE__*/
              _jsxDEV("div", { className: "flex justify-between text-sm font-semibold", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-900 dark:text-white", children: "Total" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-900 dark:text-white", children: vulnerability_summary.total }, void 0, false)] }, void 0, true
              ) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV(GlassCard, { hover: true, children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3 mb-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2.5 bg-success-100 dark:bg-success-900/30 rounded-xl", children: /*#__PURE__*/
              _jsxDEV(CheckCircleIcon, { className: "h-5 w-5 text-success-600 dark:text-success-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Compliance" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "CIS Kubernetes Benchmark" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex justify-between text-sm mb-2", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-600 dark:text-gray-400", children: "Compliance Rate" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "font-semibold text-gray-900 dark:text-white", children: [complianceRate, "%"] }, void 0, true)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV(ProgressBar, {
                progress: complianceRate,
                color: complianceRate >= 80 ? 'success' : complianceRate >= 50 ? 'warning' : 'danger' }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex justify-between text-sm", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-success-600 dark:text-success-400", children: "Passed" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "font-semibold", children: compliance_summary.passed }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex justify-between text-sm", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-danger-600 dark:text-danger-400", children: "Failed" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "font-semibold", children: compliance_summary.failed }, void 0, false)] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV(GlassCard, { hover: true, children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3 mb-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2.5 bg-warning-100 dark:bg-warning-900/30 rounded-xl", children: /*#__PURE__*/
              _jsxDEV(ShieldExclamationIcon, { className: "h-5 w-5 text-warning-600 dark:text-warning-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Risky Namespaces" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Require attention" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-2", children:
            risky_namespaces.length > 0 ?
            risky_namespaces.slice(0, 4).map((ns, idx) => /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-sm", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-gray-900 dark:text-white font-mono text-xs", children: ns }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-danger-600 dark:text-danger-400 text-xs font-medium", children: "High Risk" }, void 0, false)] }, idx, true
            )
            ) : /*#__PURE__*/

            _jsxDEV("div", { className: "text-sm text-gray-600 dark:text-gray-400 text-center py-4", children: [/*#__PURE__*/
              _jsxDEV(ShieldCheckIcon, { className: "h-8 w-8 mx-auto mb-2 text-success-500" }, void 0, false), "No high-risk namespaces"] }, void 0, true

            ) }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: fetchImageScans,
            disabled: loadingImages,
            className: "mt-4 w-full text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium flex items-center justify-center gap-1", children: [/*#__PURE__*/

            _jsxDEV("span", { children: ["Images Scanned: ", /*#__PURE__*/_jsxDEV("span", { className: "font-semibold", children: data.total_images_scanned }, void 0, false)] }, void 0, true),
            loadingImages ? /*#__PURE__*/_jsxDEV(Spinner, { size: "sm" }, void 0, false) : /*#__PURE__*/_jsxDEV(InformationCircleIcon, { className: "h-4 w-4" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [/*#__PURE__*/

        _jsxDEV(GlassCard, { hover: true, children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl", children: /*#__PURE__*/
                _jsxDEV(LockClosedIcon, { className: "h-5 w-5 text-purple-600 dark:text-violet-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "RBAC Analysis" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("button", { onClick: refreshSecurityData, disabled: isRefetching, className: "text-gray-400 hover:text-gray-600", children: /*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${isRefetching ? 'animate-spin' : ''}` }, void 0, false) }, void 0, false
            )] }, void 0, true
          ),
          rbacSummary ? /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Risk Level" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: `px-2 py-1 text-xs font-semibold rounded-lg ${getRiskBadgeColor(rbacSummary.risk_level)}`, children:
                rbacSummary.risk_level.toUpperCase() }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "grid grid-cols-2 gap-2", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2 text-center", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "text-lg font-bold text-danger-600 dark:text-danger-400", children: rbacSummary.cluster_admin_bindings }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "text-xs text-gray-500", children: "Cluster Admin" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2 text-center", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "text-lg font-bold text-warning-600 dark:text-warning-400", children: rbacSummary.wildcard_permissions }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "text-xs text-gray-500", children: "Wildcards" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2 text-center", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "text-lg font-bold text-purple-600 dark:text-violet-400", children: rbacSummary.risky_service_accounts }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "text-xs text-gray-500", children: "Risky SAs" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2 text-center", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "text-lg font-bold text-gray-600 dark:text-gray-400", children: rbacSummary.total_service_accounts }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "text-xs text-gray-500", children: "Total SAs" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: fetchRbacDetail,
              disabled: loadingRbacDetail,
              className: "w-full px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-violet-300 text-sm font-medium rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center justify-center gap-2", children:

              loadingRbacDetail ? /*#__PURE__*/_jsxDEV(Spinner, { size: "sm" }, void 0, false) : /*#__PURE__*/_jsxDEV(_Fragment, { children: ["View Details ", /*#__PURE__*/_jsxDEV(ChevronDownIcon, { className: "h-4 w-4" }, void 0, false)] }, void 0, true) }, void 0, false
            )] }, void 0, true
          ) : /*#__PURE__*/

          _jsxDEV("div", { className: "text-center py-8 text-gray-500", children: "Click refresh to analyze" }, void 0, false)] }, void 0, true

        ), /*#__PURE__*/


        _jsxDEV(GlassCard, { hover: true, children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl", children: /*#__PURE__*/
                _jsxDEV(GlobeAltIcon, { className: "h-5 w-5 text-blue-600 dark:text-violet-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Network Policies" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("button", { onClick: refreshSecurityData, disabled: isRefetching, className: "text-gray-400 hover:text-gray-600", children: /*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${isRefetching ? 'animate-spin' : ''}` }, void 0, false) }, void 0, false
            )] }, void 0, true
          ),
          networkPolicySummary ? /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Coverage" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: `text-lg font-bold ${
                networkPolicySummary.coverage_percentage >= 80 ? 'text-success-600' :
                networkPolicySummary.coverage_percentage >= 50 ? 'text-warning-600' : 'text-danger-600'}`, children: [

                networkPolicySummary.coverage_percentage, "%"] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(ProgressBar, {
              progress: networkPolicySummary.coverage_percentage,
              color: networkPolicySummary.coverage_percentage >= 80 ? 'success' : networkPolicySummary.coverage_percentage >= 50 ? 'warning' : 'danger' }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "grid grid-cols-3 gap-2", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "text-center p-2 bg-success-50 dark:bg-success-900/20 rounded-lg", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "font-bold text-success-600", children: networkPolicySummary.protected_namespaces }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "text-xs text-gray-500", children: "Protected" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "text-center p-2 bg-warning-50 dark:bg-warning-900/20 rounded-lg", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "font-bold text-warning-600", children: networkPolicySummary.partial_namespaces }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "text-xs text-gray-500", children: "Partial" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "text-center p-2 bg-danger-50 dark:bg-danger-900/20 rounded-lg", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "font-bold text-danger-600", children: networkPolicySummary.unprotected_namespaces }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "text-xs text-gray-500", children: "Unprotected" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: fetchNetworkPolicyDetail,
              disabled: loadingNetPolDetail,
              className: "w-full px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-violet-300 text-sm font-medium rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2", children:

              loadingNetPolDetail ? /*#__PURE__*/_jsxDEV(Spinner, { size: "sm" }, void 0, false) : /*#__PURE__*/_jsxDEV(_Fragment, { children: ["View Details ", /*#__PURE__*/_jsxDEV(ChevronDownIcon, { className: "h-4 w-4" }, void 0, false)] }, void 0, true) }, void 0, false
            )] }, void 0, true
          ) : /*#__PURE__*/

          _jsxDEV("div", { className: "text-center py-8 text-gray-500", children: "Click refresh to analyze" }, void 0, false)] }, void 0, true

        ), /*#__PURE__*/


        _jsxDEV(GlassCard, { hover: true, children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl", children: /*#__PURE__*/
                _jsxDEV(ChartBarIcon, { className: "h-5 w-5 text-indigo-600 dark:text-blue-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Security Trends" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("button", { onClick: refreshSecurityData, disabled: isRefetching, className: "text-gray-400 hover:text-gray-600", children: /*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${isRefetching ? 'animate-spin' : ''}` }, void 0, false) }, void 0, false
            )] }, void 0, true
          ),
          trendsSummary ? /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Trend" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: `flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                trendsSummary.trend_direction === 'improving' ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' :
                trendsSummary.trend_direction === 'declining' ? 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400' :
                'bg-gray-100 text-gray-700 dark:bg-slate-950/30 dark:text-gray-400'}`, children: [

                trendsSummary.trend_direction === 'improving' ? '↑' : trendsSummary.trend_direction === 'declining' ? '↓' : '→', /*#__PURE__*/
                _jsxDEV("span", { className: "ml-1 capitalize", children: trendsSummary.trend_direction }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "grid grid-cols-2 gap-2", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2", children: [/*#__PURE__*/
                _jsxDEV("div", { className: `text-lg font-bold ${trendsSummary.score_change_7d >= 0 ? 'text-success-600' : 'text-danger-600'}`, children: [
                  trendsSummary.score_change_7d >= 0 ? '+' : '', trendsSummary.score_change_7d] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "text-xs text-gray-500", children: "7-Day Change" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2", children: [/*#__PURE__*/
                _jsxDEV("div", { className: `text-lg font-bold ${trendsSummary.score_change_30d >= 0 ? 'text-success-600' : 'text-danger-600'}`, children: [
                  trendsSummary.score_change_30d >= 0 ? '+' : '', trendsSummary.score_change_30d] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "text-xs text-gray-500", children: "30-Day Change" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "text-lg font-bold text-success-600", children: trendsSummary.vulnerabilities_fixed_7d }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "text-xs text-gray-500", children: "Fixed (7d)" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700/50 rounded-lg p-2", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "text-lg font-bold text-danger-600", children: trendsSummary.vulnerabilities_new_7d }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "text-xs text-gray-500", children: "New (7d)" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: fetchTrendsDetail,
              disabled: loadingTrendsDetail,
              className: "w-full px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-blue-300 text-sm font-medium rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors flex items-center justify-center gap-2", children:

              loadingTrendsDetail ? /*#__PURE__*/_jsxDEV(Spinner, { size: "sm" }, void 0, false) : /*#__PURE__*/_jsxDEV(_Fragment, { children: ["View History ", /*#__PURE__*/_jsxDEV(ChevronDownIcon, { className: "h-4 w-4" }, void 0, false)] }, void 0, true) }, void 0, false
            )] }, void 0, true
          ) : /*#__PURE__*/

          _jsxDEV("div", { className: "text-center py-8 text-gray-500", children: "Click refresh to load" }, void 0, false)] }, void 0, true

        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV(GlassCard, { padding: "none", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-4 lg:p-6 border-b border-gray-100/50 dark:border-slate-700/50", children: /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV(SectionHeader, {
                title: showAllFindings ? "All Security Findings" : "Top 3 Security Risks",
                subtitle: showAllFindings ?
                "All security issues sorted by severity" :
                "Most critical security issues requiring immediate attention" }, void 0, false
              ),
              hasMoreFindings && /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                onClick: () => setShowAllFindings(!showAllFindings),
                className: "px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all shadow-sm", children:

                showAllFindings ? 'Show Top 3' : `View All (${sortedFindings.length})` }, void 0, false
              )] }, void 0, true

            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "divide-y divide-gray-100/50 dark:divide-slate-700/50", children:
            displayedFindings.length > 0 ?
            displayedFindings.map((finding, index) => /*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: index * 0.05 },
              className: "p-4 lg:p-6 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer",
              onClick: () => setSelectedFinding(finding), children: /*#__PURE__*/

              _jsxDEV("div", { className: "flex items-start justify-between gap-4", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2 mb-2 flex-wrap", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: `px-2 py-1 text-xs font-semibold rounded-lg ${getSeverityColor(finding.severity)}`, children:
                      finding.severity.toUpperCase() }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-xs text-gray-600 dark:text-gray-400 uppercase", children: finding.type }, void 0, false),
                    finding.cve_id && /*#__PURE__*/
                    _jsxDEV("span", { className: "text-xs text-gray-600 dark:text-gray-400 font-mono", children: finding.cve_id }, void 0, false)] }, void 0, true

                  ), /*#__PURE__*/
                  _jsxDEV("h4", { className: "font-semibold text-gray-900 dark:text-white mb-1", children: finding.title }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2", children: finding.description }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
                    _jsxDEV("span", { children: ["Resource: ", /*#__PURE__*/_jsxDEV("span", { className: "font-mono", children: finding.resource_name }, void 0, false)] }, void 0, true), /*#__PURE__*/
                    _jsxDEV("span", { children: ["Namespace: ", /*#__PURE__*/_jsxDEV("span", { className: "font-mono", children: finding.namespace }, void 0, false)] }, void 0, true)] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.1 },
                  className: "text-primary-600 dark:text-primary-400 p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors", children: /*#__PURE__*/

                  _jsxDEV(InformationCircleIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ) }, finding.id, false
            )
            ) : /*#__PURE__*/

            _jsxDEV("div", { className: "p-8 text-center", children: [/*#__PURE__*/
              _jsxDEV(ShieldCheckIcon, { className: "h-12 w-12 mx-auto mb-3 text-success-500" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-gray-600 dark:text-gray-400", children: "No security findings detected. Your cluster is secure!" }, void 0, false)] }, void 0, true
            ) }, void 0, false

          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        selectedFinding && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4",
          onClick: () => {setSelectedFinding(null);setShowInlineAi(false);setAiRemediation(null);}, children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            variants: modalVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            className: "bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto",
            onClick: (e) => e.stopPropagation(), children: /*#__PURE__*/

            _jsxDEV("div", { className: "p-6", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-start justify-between mb-4", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: `px-2 py-1 text-xs font-semibold rounded-lg ${getSeverityColor(selectedFinding.severity)}`, children:
                      selectedFinding.severity.toUpperCase() }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-xs text-gray-600 dark:text-gray-400 uppercase", children: selectedFinding.type }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("h3", { className: "text-xl font-bold text-gray-900 dark:text-white", children: selectedFinding.title }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => {setSelectedFinding(null);setShowInlineAi(false);setAiRemediation(null);},
                  className: "p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors", children: /*#__PURE__*/

                  _jsxDEV(XCircleIcon, { className: "h-6 w-6 text-gray-500" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("div", { className: "space-y-4", children: [

                (() => {
                  const plainEnglish = getPlainEnglishExplanation(selectedFinding);
                  return (/*#__PURE__*/
                    _jsxDEV("div", { className: "p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900/20 dark:to-emerald-950/20 border-2 border-blue-200 dark:border-blue-500/20", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-start gap-3 mb-3", children: [/*#__PURE__*/
                        _jsxDEV("div", { className: "p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20", children: /*#__PURE__*/
                          _jsxDEV(InformationCircleIcon, { className: "h-5 w-5 text-blue-600 dark:text-violet-400" }, void 0, false) }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                          _jsxDEV("h4", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-2", children: "💡 What does this mean?" }, void 0, false

                          ), /*#__PURE__*/
                          _jsxDEV("p", { className: "text-sm text-gray-700 dark:text-gray-300 leading-relaxed", children:
                            plainEnglish.explanation }, void 0, false
                          )] }, void 0, true
                        )] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "space-y-2 mt-3 pt-3 border-t border-blue-200 dark:border-blue-500/20", children: [/*#__PURE__*/
                        _jsxDEV("div", { children: [/*#__PURE__*/
                          _jsxDEV("p", { className: "text-xs font-semibold text-red-700 dark:text-red-400 mb-1", children: "📊 Business Impact:" }, void 0, false), /*#__PURE__*/
                          _jsxDEV("p", { className: "text-xs text-gray-700 dark:text-gray-300 leading-relaxed", children:
                            plainEnglish.businessImpact }, void 0, false
                          )] }, void 0, true
                        ), /*#__PURE__*/
                        _jsxDEV("div", { children: [/*#__PURE__*/
                          _jsxDEV("p", { className: "text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1", children: "📋 Compliance Risk:" }, void 0, false), /*#__PURE__*/
                          _jsxDEV("p", { className: "text-xs text-gray-700 dark:text-gray-300 leading-relaxed", children:
                            plainEnglish.complianceRisk }, void 0, false
                          )] }, void 0, true
                        )] }, void 0, true
                      )] }, void 0, true
                    ));

                })(), /*#__PURE__*/

                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "Technical Details" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-gray-600 dark:text-gray-400", children: selectedFinding.description }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/

                _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3", children: [/*#__PURE__*/
                    _jsxDEV("h4", { className: "font-semibold text-gray-900 dark:text-white mb-1 text-sm", children: "Resource" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400 font-mono", children: selectedFinding.resource_name }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3", children: [/*#__PURE__*/
                    _jsxDEV("h4", { className: "font-semibold text-gray-900 dark:text-white mb-1 text-sm", children: "Namespace" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400 font-mono", children: selectedFinding.namespace }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3", children: [/*#__PURE__*/
                    _jsxDEV("h4", { className: "font-semibold text-gray-900 dark:text-white mb-1 text-sm", children: "Type" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400 font-mono", children: selectedFinding.resource_type }, void 0, false)] }, void 0, true
                  ),
                  selectedFinding.cve_id && /*#__PURE__*/
                  _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3", children: [/*#__PURE__*/
                    _jsxDEV("h4", { className: "font-semibold text-gray-900 dark:text-white mb-1 text-sm", children: "CVE ID" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400 font-mono", children: selectedFinding.cve_id }, void 0, false)] }, void 0, true
                  )] }, void 0, true

                ),

                selectedFinding.recommendation && /*#__PURE__*/
                _jsxDEV("div", { className: "bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4", children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "font-semibold text-primary-900 dark:text-primary-300 mb-2", children: "Recommendation" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-primary-800 dark:text-primary-400", children: selectedFinding.recommendation }, void 0, false)] }, void 0, true
                ),



                showInlineAi && /*#__PURE__*/
                _jsxDEV("div", { className: "mt-4", children:
                  loadingAiRemediation === `finding-${selectedFinding.id}` ? /*#__PURE__*/
                  _jsxDEV("div", { className: "bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-700 rounded-xl p-6", children: /*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                      _jsxDEV(Spinner, {}, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { children: [/*#__PURE__*/
                        _jsxDEV("h4", { className: "font-bold text-primary-700 dark:text-primary-300", children: "AI Analyzing..." }, void 0, false), /*#__PURE__*/
                        _jsxDEV("p", { className: "text-xs text-primary-600 dark:text-primary-400", children: "Generating remediation advice" }, void 0, false)] }, void 0, true
                      )] }, void 0, true
                    ) }, void 0, false
                  ) :
                  aiRemediation && /*#__PURE__*/
                  _jsxDEV("div", { className: "bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-700 rounded-xl p-6", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center justify-between mb-4 pb-4 border-b border-primary-200 dark:border-primary-700", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                        _jsxDEV("div", { className: "p-2 bg-primary-500 rounded-lg", children: /*#__PURE__*/
                          _jsxDEV("svg", { className: "h-5 w-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /*#__PURE__*/
                            _jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" }, void 0, false) }, void 0, false
                          ) }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV("div", { children: [/*#__PURE__*/
                          _jsxDEV("h4", { className: "font-bold text-primary-700 dark:text-primary-300", children: "AI-Powered Analysis" }, void 0, false), /*#__PURE__*/
                          _jsxDEV("p", { className: "text-xs text-primary-600 dark:text-primary-400", children: "Powered by Google Gemini" }, void 0, false)] }, void 0, true
                        )] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("button", {
                        onClick: () => {setShowInlineAi(false);setAiRemediation(null);},
                        className: "p-1.5 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-lg transition-colors", children: /*#__PURE__*/

                        _jsxDEV(XCircleIcon, { className: "h-5 w-5 text-primary-600 dark:text-primary-400" }, void 0, false) }, void 0, false
                      )] }, void 0, true
                    ),

                    aiRemediation.ai_powered && aiRemediation.remediation?.analysis && /*#__PURE__*/
                    _jsxDEV("div", { className: "prose prose-sm max-w-none max-h-[300px] overflow-y-auto", children: /*#__PURE__*/
                      _jsxDEV(ReactMarkdown, { components: markdownComponents, children:
                        aiRemediation.remediation.analysis }, void 0, false
                      ) }, void 0, false
                    ),


                    !aiRemediation.ai_powered && aiRemediation.remediation?.steps && /*#__PURE__*/
                    _jsxDEV("div", { className: "space-y-2 max-h-[300px] overflow-y-auto", children: [/*#__PURE__*/
                      _jsxDEV("h5", { className: "font-semibold text-gray-900 dark:text-white flex items-center gap-2", children: [/*#__PURE__*/
                        _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-success-500" }, void 0, false), "Remediation Steps"] }, void 0, true

                      ),
                      aiRemediation.remediation.steps.map((step, index) => /*#__PURE__*/
                      _jsxDEV("div", { className: "flex gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg", children: [/*#__PURE__*/
                        _jsxDEV("span", { className: "flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary-600 text-white text-xs font-semibold rounded-full", children:
                          index + 1 }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV("p", { className: "text-sm text-gray-700 dark:text-gray-300", children: step }, void 0, false)] }, index, true
                      )
                      )] }, void 0, true
                    ),


                    aiRemediation.note && /*#__PURE__*/
                    _jsxDEV("div", { className: "mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3", children: /*#__PURE__*/
                      _jsxDEV("p", { className: "text-xs text-blue-700 dark:text-violet-300 flex items-start gap-2", children: [/*#__PURE__*/
                        _jsxDEV(InformationCircleIcon, { className: "h-4 w-4 flex-shrink-0 mt-0.5" }, void 0, false),
                        aiRemediation.note] }, void 0, true
                      ) }, void 0, false
                    )] }, void 0, true

                  ) }, void 0, false

                ), /*#__PURE__*/


                _jsxDEV("div", { className: "flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "text-sm text-gray-600 dark:text-gray-400", children:
                    selectedFinding.can_auto_remediate ? /*#__PURE__*/
                    _jsxDEV("span", { className: "text-success-600 dark:text-success-400", children: "Auto-remediation available" }, void 0, false) : /*#__PURE__*/

                    _jsxDEV("span", { children: "Manual remediation required" }, void 0, false) }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex gap-2", children: [/*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.02 },
                      whileTap: { scale: 0.98 },
                      onClick: () => fetchAiRemediation(selectedFinding),
                      disabled: loadingAiRemediation === `finding-${selectedFinding.id}`,
                      className: "px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary-500/25", children:

                      loadingAiRemediation === `finding-${selectedFinding.id}` ? /*#__PURE__*/
                      _jsxDEV(_Fragment, { children: [/*#__PURE__*/_jsxDEV(Spinner, { size: "sm", color: "white" }, void 0, false), " Analyzing..."] }, void 0, true) : /*#__PURE__*/

                      _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                        _jsxDEV("svg", { className: "h-4 w-4", fill: "currentColor", viewBox: "0 0 24 24", children: /*#__PURE__*/
                          _jsxDEV("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" }, void 0, false) }, void 0, false
                        ), "Ask AI"] }, void 0, true

                      ) }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.02 },
                      whileTap: { scale: 0.98 },
                      onClick: () => {setSelectedFinding(null);setShowInlineAi(false);setAiRemediation(null);},
                      className: "px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-xl transition-colors", children:
                      "Close" }, void 0, false

                    )] }, void 0, true
                  )] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            ) }, void 0, false
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showHelp && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4",
          onClick: () => setShowHelp(false), children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            variants: modalVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            className: "bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto",
            onClick: (e) => e.stopPropagation(), children: /*#__PURE__*/

            _jsxDEV("div", { className: "p-6", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between mb-6", children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Security Dashboard Help" }, void 0, false), /*#__PURE__*/
                _jsxDEV("button", { onClick: () => setShowHelp(false), className: "p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: /*#__PURE__*/
                  _jsxDEV(XCircleIcon, { className: "h-6 w-6 text-gray-500" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-6 text-sm text-gray-600 dark:text-gray-400", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "Security Score" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { children: "Your cluster's overall security health rated from 0-100. Grade A (90-100) is excellent, F (below 50) needs immediate attention." }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "Vulnerabilities" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { children: "CVEs found in container images. Critical and High severity vulnerabilities should be addressed first." }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "RBAC Analysis" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { children: "Analyzes Role-Based Access Control for overly permissive access like cluster-admin bindings and wildcard permissions." }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "Network Policies" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { children: "Shows how many pods are protected by NetworkPolicies. Unprotected pods can communicate freely, which is a security risk." }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "AI Remediation" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { children: "Click \"Ask AI\" on any finding to get AI-powered remediation advice with specific commands and best practices." }, void 0, false)] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            ) }, void 0, false
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showImageScans && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4",
          onClick: () => setShowImageScans(false), children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            variants: modalVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            className: "bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto",
            onClick: (e) => e.stopPropagation(), children: /*#__PURE__*/

            _jsxDEV("div", { className: "p-6", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between mb-6", children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Container Image Scans" }, void 0, false), /*#__PURE__*/
                _jsxDEV("button", { onClick: () => setShowImageScans(false), className: "p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: /*#__PURE__*/
                  _jsxDEV(XCircleIcon, { className: "h-6 w-6 text-gray-500" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-4", children:
                imageScans.map((scan, idx) => /*#__PURE__*/
                _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4", children: [/*#__PURE__*/
                  _jsxDEV("div", {
                    className: "flex items-center justify-between cursor-pointer",
                    onClick: () => setExpandedImage(expandedImage === scan.image ? null : scan.image), children: [/*#__PURE__*/

                    _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                      _jsxDEV("h4", { className: "font-mono text-sm text-gray-900 dark:text-white truncate", children: scan.image }, void 0, false), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-xs text-gray-500 mt-1", children: ["Scanned: ",
                        new Date(scan.scan_time).toLocaleString()] }, void 0, true
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
                        _jsxDEV("div", { className: "text-lg font-bold text-danger-600", children: scan.vulnerabilities.critical }, void 0, false), /*#__PURE__*/
                        _jsxDEV("div", { className: "text-xs text-gray-500", children: "Critical" }, void 0, false)] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
                        _jsxDEV("div", { className: "text-lg font-bold text-warning-600", children: scan.vulnerabilities.high }, void 0, false), /*#__PURE__*/
                        _jsxDEV("div", { className: "text-xs text-gray-500", children: "High" }, void 0, false)] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
                        _jsxDEV("div", { className: "text-lg font-bold text-gray-600", children: scan.vulnerabilities.total }, void 0, false), /*#__PURE__*/
                        _jsxDEV("div", { className: "text-xs text-gray-500", children: "Total" }, void 0, false)] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV(ChevronDownIcon, { className: `h-5 w-5 transition-transform ${expandedImage === scan.image ? 'rotate-180' : ''}` }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV(AnimatePresence, { children:
                    expandedImage === scan.image && scan.vulnerability_details.length > 0 && /*#__PURE__*/
                    _jsxDEV(motion.div, {
                      initial: { height: 0, opacity: 0 },
                      animate: { height: 'auto', opacity: 1 },
                      exit: { height: 0, opacity: 0 },
                      className: "mt-4 overflow-hidden", children: /*#__PURE__*/

                      _jsxDEV("div", { className: "space-y-2 max-h-64 overflow-y-auto", children:
                        scan.vulnerability_details.slice(0, 10).map((vuln, vIdx) => /*#__PURE__*/
                        _jsxDEV("div", { className: "flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg text-sm", children: [/*#__PURE__*/
                          _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                              _jsxDEV("span", { className: `px-2 py-0.5 text-xs font-semibold rounded ${getSeverityColor(vuln.severity)}`, children:
                                vuln.severity }, void 0, false
                              ), /*#__PURE__*/
                              _jsxDEV("span", { className: "font-mono text-xs", children: vuln.vulnerability_id }, void 0, false)] }, void 0, true
                            ), /*#__PURE__*/
                            _jsxDEV("p", { className: "text-xs text-gray-500 mt-1", children: [
                              vuln.pkg_name, " ", vuln.installed_version, " → ", vuln.fixed_version || 'No fix'] }, void 0, true
                            )] }, void 0, true
                          ), /*#__PURE__*/
                          _jsxDEV("button", {
                            onClick: () => fetchAiRemediationForVulnerability(vuln, scan.image),
                            disabled: loadingAiRemediation === `vuln-${vuln.vulnerability_id}`,
                            className: "px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200", children:

                            loadingAiRemediation === `vuln-${vuln.vulnerability_id}` ? /*#__PURE__*/_jsxDEV(Spinner, { size: "sm" }, void 0, false) : 'Ask AI' }, void 0, false
                          )] }, vIdx, true
                        )
                        ) }, void 0, false
                      ) }, void 0, false
                    ) }, void 0, false

                  )] }, idx, true
                )
                ) }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showRbacModal && rbacDetail && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4",
          onClick: () => setShowRbacModal(false), children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            variants: modalVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            className: "bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto",
            onClick: (e) => e.stopPropagation(), children: /*#__PURE__*/

            _jsxDEV("div", { className: "p-6", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between mb-6", children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "RBAC Analysis Details" }, void 0, false), /*#__PURE__*/
                _jsxDEV("button", { onClick: () => setShowRbacModal(false), className: "p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: /*#__PURE__*/
                  _jsxDEV(XCircleIcon, { className: "h-6 w-6 text-gray-500" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ),

              rbacDetail.service_account_risks.length > 0 && /*#__PURE__*/
              _jsxDEV("div", { className: "mb-6", children: [/*#__PURE__*/
                _jsxDEV("h4", { className: "font-semibold text-gray-900 dark:text-white mb-3", children: "Risky Service Accounts" }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "space-y-2", children:
                  rbacDetail.service_account_risks.map((sa, idx) => /*#__PURE__*/
                  _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                      _jsxDEV("div", { children: [/*#__PURE__*/
                        _jsxDEV("span", { className: "font-mono text-sm text-gray-900 dark:text-white", children: sa.name }, void 0, false), /*#__PURE__*/
                        _jsxDEV("span", { className: "text-xs text-gray-500 ml-2", children: ["(", sa.namespace, ")"] }, void 0, true)] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                        _jsxDEV("span", { className: `px-2 py-1 text-xs font-semibold rounded ${getSeverityColor(sa.risk_level)}`, children:
                          sa.risk_level.toUpperCase() }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV("button", {
                          onClick: () => fetchAiRemediationForServiceAccount(sa),
                          disabled: loadingAiRemediation === `sa-${sa.namespace}-${sa.name}`,
                          className: "px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200", children:

                          loadingAiRemediation === `sa-${sa.namespace}-${sa.name}` ? /*#__PURE__*/_jsxDEV(Spinner, { size: "sm" }, void 0, false) : 'Ask AI' }, void 0, false
                        )] }, void 0, true
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "mt-2 text-xs text-gray-600 dark:text-gray-400", children:
                      sa.issues.join(' • ') }, void 0, false
                    )] }, idx, true
                  )
                  ) }, void 0, false
                )] }, void 0, true
              ),


              rbacDetail.role_binding_risks.length > 0 && /*#__PURE__*/
              _jsxDEV("div", { className: "mb-6", children: [/*#__PURE__*/
                _jsxDEV("h4", { className: "font-semibold text-gray-900 dark:text-white mb-3", children: "Risky Role Bindings" }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "space-y-2", children:
                  rbacDetail.role_binding_risks.map((rb, idx) => /*#__PURE__*/
                  _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                      _jsxDEV("div", { children: [/*#__PURE__*/
                        _jsxDEV("span", { className: "font-mono text-sm text-gray-900 dark:text-white", children: rb.name }, void 0, false), /*#__PURE__*/
                        _jsxDEV("span", { className: "text-xs text-gray-500 ml-2", children: ["(", rb.binding_type, ")"] }, void 0, true)] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                        _jsxDEV("span", { className: `px-2 py-1 text-xs font-semibold rounded ${getSeverityColor(rb.risk_level)}`, children:
                          rb.risk_level.toUpperCase() }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV("button", {
                          onClick: () => fetchAiRemediationForRoleBinding(rb),
                          disabled: loadingAiRemediation === `rb-${rb.namespace || 'cluster'}-${rb.name}`,
                          className: "px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200", children:

                          loadingAiRemediation === `rb-${rb.namespace || 'cluster'}-${rb.name}` ? /*#__PURE__*/_jsxDEV(Spinner, { size: "sm" }, void 0, false) : 'Ask AI' }, void 0, false
                        )] }, void 0, true
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "mt-2 text-xs text-gray-600 dark:text-gray-400", children:
                      rb.issues.join(' • ') }, void 0, false
                    )] }, idx, true
                  )
                  ) }, void 0, false
                )] }, void 0, true
              ),


              rbacDetail.recommendations.length > 0 && /*#__PURE__*/
              _jsxDEV("div", { className: "bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4", children: [/*#__PURE__*/
                _jsxDEV("h4", { className: "font-semibold text-primary-900 dark:text-primary-300 mb-2", children: "Recommendations" }, void 0, false), /*#__PURE__*/
                _jsxDEV("ul", { className: "space-y-1", children:
                  rbacDetail.recommendations.map((rec, idx) => /*#__PURE__*/
                  _jsxDEV("li", { className: "text-sm text-primary-800 dark:text-primary-400 flex items-start gap-2", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "text-primary-500", children: "•" }, void 0, false),
                    rec] }, idx, true
                  )
                  ) }, void 0, false
                )] }, void 0, true
              )] }, void 0, true

            ) }, void 0, false
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showNetPolModal && networkPolicyDetail && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4",
          onClick: () => setShowNetPolModal(false), children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            variants: modalVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            className: "bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto",
            onClick: (e) => e.stopPropagation(), children: /*#__PURE__*/

            _jsxDEV("div", { className: "p-6", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between mb-6", children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Network Policy Coverage" }, void 0, false), /*#__PURE__*/
                _jsxDEV("button", { onClick: () => setShowNetPolModal(false), className: "p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: /*#__PURE__*/
                  _jsxDEV(XCircleIcon, { className: "h-6 w-6 text-gray-500" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("div", { className: "space-y-3", children:
                networkPolicyDetail.namespaces.map((ns, idx) => /*#__PURE__*/
                _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "font-mono text-sm text-gray-900 dark:text-white", children: ns.namespace }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs text-gray-500 ml-2", children: ["(", ns.pods_covered, "/", ns.pods_total, " pods)"] }, void 0, true)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                      _jsxDEV("span", { className: `px-2 py-1 text-xs font-semibold rounded ${
                        ns.status === 'protected' ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' :
                        ns.status === 'partial' ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400' :
                        'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400'}`, children:

                        ns.status.toUpperCase() }, void 0, false
                      ),
                      ns.status !== 'protected' && /*#__PURE__*/
                      _jsxDEV("button", {
                        onClick: () => fetchAiRemediationForNetworkPolicy(ns),
                        disabled: loadingAiRemediation === `netpol-${ns.namespace}`,
                        className: "px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200", children:

                        loadingAiRemediation === `netpol-${ns.namespace}` ? /*#__PURE__*/_jsxDEV(Spinner, { size: "sm" }, void 0, false) : 'Ask AI' }, void 0, false
                      )] }, void 0, true

                    )] }, void 0, true
                  ),
                  ns.pods_uncovered.length > 0 && /*#__PURE__*/
                  _jsxDEV("div", { className: "mt-2 text-xs text-gray-600 dark:text-gray-400", children: ["Uncovered: ",
                    ns.pods_uncovered.slice(0, 3).join(', '), ns.pods_uncovered.length > 3 && `... (+${ns.pods_uncovered.length - 3})`] }, void 0, true
                  )] }, idx, true

                )
                ) }, void 0, false
              ),

              networkPolicyDetail.recommendations.length > 0 && /*#__PURE__*/
              _jsxDEV("div", { className: "mt-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4", children: [/*#__PURE__*/
                _jsxDEV("h4", { className: "font-semibold text-primary-900 dark:text-primary-300 mb-2", children: "Recommendations" }, void 0, false), /*#__PURE__*/
                _jsxDEV("ul", { className: "space-y-1", children:
                  networkPolicyDetail.recommendations.map((rec, idx) => /*#__PURE__*/
                  _jsxDEV("li", { className: "text-sm text-primary-800 dark:text-primary-400 flex items-start gap-2", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "text-primary-500", children: "•" }, void 0, false),
                    rec] }, idx, true
                  )
                  ) }, void 0, false
                )] }, void 0, true
              )] }, void 0, true

            ) }, void 0, false
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showTrendsModal && trendsDetail && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4",
          onClick: () => setShowTrendsModal(false), children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            variants: modalVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            className: "bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto",
            onClick: (e) => e.stopPropagation(), children: /*#__PURE__*/

            _jsxDEV("div", { className: "p-6", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between mb-6", children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Security Trends (30 Days)" }, void 0, false), /*#__PURE__*/
                _jsxDEV("button", { onClick: () => setShowTrendsModal(false), className: "p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: /*#__PURE__*/
                  _jsxDEV(XCircleIcon, { className: "h-6 w-6 text-gray-500" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
                _jsxDEV("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-slate-700", children: [/*#__PURE__*/
                  _jsxDEV("thead", { children: /*#__PURE__*/
                    _jsxDEV("tr", { children: [/*#__PURE__*/
                      _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase", children: "Date" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase", children: "Score" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase", children: "Critical" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase", children: "High" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase", children: "Total" }, void 0, false)] }, void 0, true
                    ) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700", children:
                    trendsDetail.trend_data.map((point, idx) => /*#__PURE__*/
                    _jsxDEV("tr", { className: "hover:bg-gray-50 dark:hover:bg-slate-700/50", children: [/*#__PURE__*/
                      _jsxDEV("td", { className: "px-4 py-3 text-sm text-gray-900 dark:text-white", children:
                        new Date(point.timestamp).toLocaleDateString() }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("td", { className: "px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white", children: point.security_score }, void 0, false), /*#__PURE__*/
                      _jsxDEV("td", { className: "px-4 py-3 text-sm text-danger-600 dark:text-danger-400", children: point.critical_count }, void 0, false), /*#__PURE__*/
                      _jsxDEV("td", { className: "px-4 py-3 text-sm text-warning-600 dark:text-warning-400", children: point.high_count }, void 0, false), /*#__PURE__*/
                      _jsxDEV("td", { className: "px-4 py-3 text-sm text-gray-600 dark:text-gray-400", children: point.total_vulnerabilities }, void 0, false)] }, idx, true
                    )
                    ) }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showAiModal && aiRemediation && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4",
          onClick: () => setShowAiModal(false), children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            variants: modalVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            className: "bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto",
            onClick: (e) => e.stopPropagation(), children: /*#__PURE__*/

            _jsxDEV("div", { className: "p-6", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-start justify-between mb-6", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-3 mb-2", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg", children: /*#__PURE__*/
                      _jsxDEV("svg", { className: "h-6 w-6 text-primary-600 dark:text-primary-400", fill: "currentColor", viewBox: "0 0 24 24", children: /*#__PURE__*/
                        _jsxDEV("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" }, void 0, false) }, void 0, false
                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("h3", { className: "text-xl font-bold text-gray-900 dark:text-white", children: [
                        aiRemediation.ai_powered ? 'AI-Powered' : 'Rule-Based', " Remediation"] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children:
                        aiRemediation.ai_powered ? 'Powered by Google Gemini' : 'Based on security best practices' }, void 0, false
                      )] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2 mt-2", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: `px-2 py-1 text-xs font-semibold rounded-lg ${getSeverityColor(aiRemediation.finding?.severity || 'medium')}`, children:
                      aiRemediation.finding?.severity?.toUpperCase() || 'UNKNOWN' }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm text-gray-500", children: aiRemediation.finding?.type }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("button", { onClick: () => setShowAiModal(false), className: "p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: /*#__PURE__*/
                  _jsxDEV(XCircleIcon, { className: "h-6 w-6 text-gray-500" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("div", { className: "space-y-6", children: [
                aiRemediation.finding?.title && /*#__PURE__*/
                _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4", children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "Finding" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-gray-700 dark:text-gray-300", children: aiRemediation.finding.title }, void 0, false),
                  aiRemediation.finding.resource && /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-500 mt-1 font-mono", children: ["Resource: ",
                    aiRemediation.finding.resource,
                    aiRemediation.finding.namespace && ` (${aiRemediation.finding.namespace})`] }, void 0, true
                  )] }, void 0, true

                ),


                aiRemediation.ai_powered && aiRemediation.remediation?.analysis && /*#__PURE__*/
                _jsxDEV("div", { className: "bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-700 rounded-xl p-6", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-3 mb-4 pb-4 border-b border-primary-200 dark:border-primary-700", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "p-2 bg-primary-500 rounded-lg", children: /*#__PURE__*/
                      _jsxDEV("svg", { className: "h-5 w-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /*#__PURE__*/
                        _jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" }, void 0, false) }, void 0, false
                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("h4", { className: "font-bold text-primary-700 dark:text-primary-300", children: "AI Analysis" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-xs text-primary-600 dark:text-primary-400", children: "Detailed remediation guidance" }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "prose prose-sm max-w-none", children: /*#__PURE__*/
                    _jsxDEV(ReactMarkdown, { components: markdownComponents, children:
                      aiRemediation.remediation.analysis }, void 0, false
                    ) }, void 0, false
                  )] }, void 0, true
                ),


                !aiRemediation.ai_powered && aiRemediation.remediation?.steps && /*#__PURE__*/
                _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "font-semibold text-gray-900 dark:text-white", children: "Remediation Steps" }, void 0, false),
                  aiRemediation.remediation.steps.map((step, index) => /*#__PURE__*/
                  _jsxDEV("div", { className: "flex gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary-600 text-white text-xs font-semibold rounded-full", children:
                      index + 1 }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-700 dark:text-gray-300", children: step }, void 0, false)] }, index, true
                  )
                  )] }, void 0, true
                ),


                aiRemediation.note && /*#__PURE__*/
                _jsxDEV("div", { className: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4", children: /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-blue-700 dark:text-violet-300 flex items-start gap-2", children: [/*#__PURE__*/
                    _jsxDEV(InformationCircleIcon, { className: "h-5 w-5 flex-shrink-0 mt-0.5" }, void 0, false),
                    aiRemediation.note] }, void 0, true
                  ) }, void 0, false
                )] }, void 0, true

              )] }, void 0, true
            ) }, void 0, false
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}
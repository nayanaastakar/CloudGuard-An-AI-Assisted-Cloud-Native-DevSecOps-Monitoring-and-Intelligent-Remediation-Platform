import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ServerStackIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  CloudIcon,
  ServerIcon,
  FolderIcon,
  CubeTransparentIcon,
  GlobeAltIcon,
  CircleStackIcon,
  DocumentTextIcon,
  CommandLineIcon,
  DocumentDuplicateIcon,
  UserCircleIcon,
  UserGroupIcon,
  KeyIcon,
  ShieldExclamationIcon,
  WrenchScrewdriverIcon,
  BuildingLibraryIcon,
  ArrowsRightLeftIcon,
  CodeBracketSquareIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useCluster } from '../../contexts/ClusterContext';
import { useCloudGuardEvents } from '../../hooks/useCloudGuardEvents';
import ClusterSwitcher from './ClusterSwitcher';
import NamespaceFilter from './NamespaceFilter';
import NotificationDropdown from './NotificationDropdown';

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface Level1Item {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'red' | 'purple' | 'amber';
}

interface Level2SubItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface Level2Group {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  items: Level2SubItem[];
}

interface Level2Config {
  title: string;
  items: (Level2SubItem | Level2Group)[];
}

interface LayoutProps {
  children: React.ReactNode;
}

// ============================================================
// NAVIGATION CONFIGURATION
// ============================================================

const level1Navigation: Level1Item[] = [
  { id: 'dashboard', name: 'Security Center', icon: ShieldCheckIcon, href: '/' },
  { id: 'monitoring', name: 'Kubernetes Monitoring', icon: ChartBarIcon, badge: 'Live', badgeColor: 'green', href: '/monitoring' },
  { id: 'repository-security', name: 'Repository Security', icon: RocketLaunchIcon, badge: 'Git', badgeColor: 'purple', href: '/repository-security' },
  { id: 'vulnerabilities', name: 'Vulnerability Management', icon: ShieldExclamationIcon, href: '/vulnerabilities' },
  { id: 'threats', name: 'Runtime Threats', icon: ShieldExclamationIcon, badge: 'Falco', badgeColor: 'red', href: '/threats' },
  { id: 'attack-paths', name: 'Attack Paths & Graph', icon: ArrowsRightLeftIcon, badge: '360°', badgeColor: 'purple', href: '/attack-paths' },
  { id: 'remediation', name: 'Remediation & Compliance', icon: WrenchScrewdriverIcon, badge: 'Dry-Run', badgeColor: 'green', href: '/remediation' },
  { id: 'github-repos', name: 'Project & Repository', icon: CodeBracketSquareIcon, badge: 'Docs', badgeColor: 'blue', href: '/github-repos' },
  { id: 'incidents', name: 'AI Insights & Settings', icon: Cog6ToothIcon, href: '/incidents' },
];

const level2Configurations: Record<string, Level2Config> = {
  monitoring: {
    title: 'Cluster Monitoring',
    items: [
      { name: 'Observability Dashboard', href: '/monitoring', icon: ChartBarIcon },
      { name: 'Cluster Overview', href: '/cluster-overview', icon: CloudIcon },
      { name: 'Nodes & Utilization', href: '/kubernetes/nodes', icon: ServerIcon },
      { name: 'Workloads & Pods', href: '/kubernetes/workloads', icon: CubeTransparentIcon },
      { name: 'Cluster Events', href: '/events', icon: DocumentTextIcon },
      { name: 'Loki Log Explorer', href: '/logs', icon: CommandLineIcon },
    ],
  },
  vulnerabilities: {
    title: 'Vulnerability Intelligence',
    items: [
      { name: 'Vulnerability Scans', href: '/vulnerabilities', icon: ShieldExclamationIcon },
      { name: 'Scanner Health & SBOM', href: '/sbom', icon: CubeTransparentIcon },
      { name: 'Asset Inventory', href: '/assets', icon: ServerStackIcon },
    ],
  },
  'attack-paths': {
    title: 'Attack Paths & Graph',
    items: [
      { name: 'Attack Path Analysis', href: '/attack-paths', icon: ArrowsRightLeftIcon },
      { name: '360° Security Graph', href: '/graph', icon: ServerStackIcon },
    ],
  },
  remediation: {
    title: 'Remediation & Compliance',
    items: [
      { name: 'Remediation Center', href: '/remediation', icon: WrenchScrewdriverIcon },
      { name: 'Compliance Engine', href: '/compliance', icon: BuildingLibraryIcon },
      { name: 'DevSecOps Gates', href: '/devsecops', icon: RocketLaunchIcon },
    ],
  },
  incidents: {
    title: 'AI Insights & Settings',
    items: [
      { name: 'AI Incident Investigation', href: '/incidents', icon: ShieldExclamationIcon },
      { name: 'Platform Settings', href: '/settings', icon: Cog6ToothIcon },
      { name: 'User Management', href: '/admin/users', icon: UserGroupIcon, badge: 'Admin' },
      { name: 'Audit Logs', href: '/admin/audit-logs', icon: DocumentTextIcon },
      { name: 'Profile Settings', href: '/profile', icon: UserCircleIcon },
    ],
  },
  'github-repos': {
    title: 'Project & Repository',
    items: [
      { name: 'Architecture & Docs', href: '/github-repos', icon: CodeBracketSquareIcon },
      { name: 'View on GitHub', href: 'https://github.com/nayanaastakar/CloudGuard-An-AI-Assisted-Cloud-Native-DevSecOps-Monitoring-and-Intelligent-Remediation-Platform', icon: GlobeAltIcon },
    ],
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function isGroup(item: Level2SubItem | Level2Group): item is Level2Group {
  return 'items' in item;
}

function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const parts = pathname.split('/').filter(Boolean);
  const breadcrumbs: { label: string; href: string }[] = [
    { label: 'Security Center', href: '/' },
  ];

  let currentPath = '';
  parts.forEach((part) => {
    currentPath += `/${part}`;
    const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
    breadcrumbs.push({ label, href: currentPath });
  });

  return breadcrumbs;
}

// ============================================================
// COMPONENTS
// ============================================================

// Level-1 Sidebar Item
function Level1NavItem({
  item,
  isActive,
  isCollapsed,
  onClick,
}: {
  item: Level1Item;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}) {
  const content = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={item.name}
      title={isCollapsed ? item.name : undefined}
      className={`relative flex items-center gap-3 ${
        isCollapsed ? 'justify-center w-11 h-11 px-0 mx-auto' : 'w-full h-11 px-3'
      } rounded-xl cursor-pointer transition-all duration-200 group ${
        isActive
          ? 'bg-primary-500 text-slate-950 shadow-lg shadow-primary-500/30 font-semibold'
          : 'text-slate-400 hover:bg-slate-800 hover:text-primary-300'
      }`}
    >
      <item.icon className="h-5 w-5 shrink-0" />

      {/* Navigation Label beside icon */}
      {!isCollapsed && (
        <span className="text-xs font-semibold truncate flex-1 tracking-tight text-left">
          {item.name}
        </span>
      )}

      {/* Status Badge */}
      {item.badge && (
        <span
          className={`${
            isCollapsed
              ? 'absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px]'
              : 'relative shrink-0 px-1.5 py-0.5 text-[10px]'
          } flex items-center justify-center font-bold rounded-full pointer-events-none ${
            item.badgeColor === 'red'
              ? 'bg-red-500 text-white'
              : item.badgeColor === 'purple'
              ? 'bg-violet-600 text-white'
              : item.badgeColor === 'amber'
              ? 'bg-amber-500 text-white'
              : 'bg-emerald-600 text-white'
          }`}
        >
          {item.badge}
        </span>
      )}

      {/* Tooltip on hover */}
      <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-950 border border-slate-700 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl pointer-events-none">
        {item.name}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-950" />
      </div>
    </motion.div>
  );

  if (item.href) {
    return (
      <Link to={item.href} aria-label={item.name} onClick={onClick} className="block w-full">
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className="block w-full">
      {content}
    </div>
  );
}

// Level-2 Collapsible Group
function Level2CollapsibleGroup({
  group,
  isExpanded,
  onToggle,
  activeHref,
}: {
  group: Level2Group;
  isExpanded: boolean;
  onToggle: () => void;
  activeHref: string;
}) {
  const hasActiveChild = group.items.some(
    (item) => item.href.split('?')[0] === activeHref.split('?')[0]
  );

  return (
    <div className="mb-1">
      <motion.button
        whileHover={{ x: 2 }}
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
          hasActiveChild
            ? 'text-primary-300 bg-primary-500/10'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <group.icon className="h-4 w-4" />
          <span>{group.name}</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRightIcon className="h-3.5 w-3.5" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pl-4 pr-1 py-1 space-y-1"
          >
            {group.items.map((subItem) => (
              <Level2SimpleItem
                key={subItem.href}
                item={subItem}
                activeHref={activeHref}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Level-2 Simple Item
function Level2SimpleItem({
  item,
  activeHref,
}: {
  item: Level2SubItem;
  activeHref: string;
}) {
  const isActive = activeHref.split('?')[0] === item.href.split('?')[0];

  return (
    <Link to={item.href} aria-label={item.name}>
      <motion.div
        whileHover={{ x: 2 }}
        className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors group mb-1 ${
          isActive
            ? 'bg-primary-500 text-slate-950 font-medium shadow-md shadow-primary-500/20'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <item.icon
            className={`h-4 w-4 flex-shrink-0 ${
              isActive ? 'text-white' : 'text-slate-300 group-hover:text-primary-300'
            }`}
          />
          <span className="truncate">{item.name}</span>
        </div>
        {item.badge && (
          <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-violet-600/30 text-violet-300 border border-violet-500/30">
            {item.badge}
          </span>
        )}
      </motion.div>
    </Link>
  );
}

// Breadcrumbs
function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav className="flex items-center space-x-1 text-xs">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRightIcon className="h-3.5 w-3.5 text-slate-500 mx-1 flex-shrink-0" />
          )}
          <Link
            to={item.href}
            className={`transition-colors truncate max-w-[150px] ${
              index === items.length - 1
                ? 'font-medium text-slate-200'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  );
}

// ============================================================
// MAIN LAYOUT COMPONENT
// ============================================================

export default function DualSidebarLayout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { activeCluster } = useCluster();

  // Single authenticated real-time WebSocket connection for cluster security events
  useCloudGuardEvents({ clusterId: activeCluster?.id || 'default' });

  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Workloads', 'Nodes']));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cloudguard_sidebar_collapsed');
      return saved === 'true';
    }
    return false;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cloudguard_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  // Determine active module from current path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '/security') {
      setActiveModule('dashboard');
    } else if (path.startsWith('/repository-security')) {
      setActiveModule('repository-security');
    } else if (path.startsWith('/threats') || path.startsWith('/runtime')) {
      setActiveModule('threats');
    } else if (path.startsWith('/attack-paths') || path.startsWith('/graph') || path.startsWith('/security-graph')) {
      setActiveModule('attack-paths');
    } else if (path.startsWith('/vulnerabilities') || path.startsWith('/sbom') || path.startsWith('/scanners') || path.startsWith('/assets')) {
      setActiveModule('vulnerabilities');
    } else if (path.startsWith('/remediation') || path.startsWith('/compliance') || path.startsWith('/devsecops')) {
      setActiveModule('remediation');
    } else if (
      path.startsWith('/monitoring') ||
      path.startsWith('/events') ||
      path.startsWith('/logs') ||
      path.startsWith('/cluster-overview') ||
      path.startsWith('/kubernetes') ||
      path.startsWith('/namespaces') ||
      path.startsWith('/networking') ||
      path.startsWith('/storage') ||
      path.startsWith('/nodes')
    ) {
      setActiveModule('monitoring');
    } else if (
      path.startsWith('/incidents') ||
      path.startsWith('/settings') ||
      path.startsWith('/profile') ||
      path.startsWith('/clusters') ||
      path.startsWith('/admin')
    ) {
      setActiveModule('incidents');
    }
  }, [location.pathname]);

  const level2Config = useMemo(() => {
    const config = level2Configurations[activeModule] || null;

    if (config && activeModule === 'settings' && user) {
      const isAdmin = user.role === 'admin';
      return {
        ...config,
        items: config.items.filter(item => {
          if (!isGroup(item) && item.href === '/admin/users') {
            return isAdmin;
          }
          return true;
        }),
      };
    }

    return config;
  }, [activeModule, user]);

  const breadcrumbs = useMemo(() => {
    return getBreadcrumbs(location.pathname);
  }, [location.pathname]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  const handleLevel1Click = (item: Level1Item) => {
    if (item.href) {
      navigate(item.href);
    } else {
      setActiveModule(item.id);
      const config = level2Configurations[item.id];
      if (config && config.items.length > 0) {
        const firstItem = config.items[0];
        if (isGroup(firstItem)) {
          navigate(firstItem.items[0].href);
        } else {
          navigate(firstItem.href);
        }
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim().toLowerCase();
    if (query.includes('rem') || query.includes('fix')) {
      navigate('/remediation');
    } else if (query.includes('vuln') || query.includes('cve')) {
      navigate('/vulnerabilities');
    } else if (query.includes('threat') || query.includes('falco')) {
      navigate('/threats');
    } else if (query.includes('attack') || query.includes('path')) {
      navigate('/attack-paths');
    } else if (query.includes('graph')) {
      navigate('/graph');
    } else if (query.includes('ai') || query.includes('incident')) {
      navigate('/incidents');
    } else if (query.includes('asset') || query.includes('inv')) {
      navigate('/assets');
    } else if (query.includes('comp') || query.includes('cis')) {
      navigate('/compliance');
    } else if (query.includes('pipe') || query.includes('devsec')) {
      navigate('/devsecops');
    } else if (query.includes('log') || query.includes('loki')) {
      navigate('/logs');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 transition-colors duration-300">
      {/* Subtle palette glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-secondary-500/5 rounded-full blur-3xl" />
      </div>

      {/* ============================================================ */}
      {/* LEVEL-1 SIDEBAR (Main Navigation) */}
      {/* ============================================================ */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 bottom-0 ${
          isSidebarCollapsed ? 'w-16' : 'w-60'
        } bg-slate-900 border-r border-slate-700 z-50 flex-col shadow-xl transition-all duration-300`}
      >
        {/* CloudGuard Logo & Collapse Toggle */}
        <div className={`h-16 flex items-center ${isSidebarCollapsed ? 'justify-center px-1' : 'justify-between px-3.5'} border-b border-slate-700`}>
          {!isSidebarCollapsed ? (
            <div
              className="flex items-center gap-3 cursor-pointer overflow-hidden min-w-0"
              onClick={() => navigate('/')}
              title="CloudGuard Security Center"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: 4 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30 shrink-0"
              >
                <ShieldCheckIcon className="h-5 w-5 text-white" />
              </motion.div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-white tracking-tight truncate">
                  CloudGuard
                </span>
                <span className="text-[10px] text-primary-300 font-semibold tracking-wider uppercase truncate">
                  DevSecOps 360°
                </span>
              </div>
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30 cursor-pointer shrink-0"
              onClick={toggleSidebar}
              title="Click to expand sidebar"
            >
              <ShieldCheckIcon className="h-5 w-5 text-white" />
            </div>
          )}

          {/* Sidebar Collapse Toggle Button */}
          {!isSidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-3 px-2 space-y-1.5 overflow-y-auto">
          {level1Navigation.map((item) => (
            <Level1NavItem
              key={item.id}
              item={item}
              isActive={activeModule === item.id}
              isCollapsed={isSidebarCollapsed}
              onClick={() => handleLevel1Click(item)}
            />
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-2 border-t border-slate-700">
          {user && (
            <div
              onClick={() => navigate('/profile')}
              title={`Logged in as ${user.username} (${user.role})`}
              className={`flex items-center gap-3 ${
                isSidebarCollapsed ? 'justify-center p-1' : 'px-2 py-2'
              } rounded-xl hover:bg-slate-800 cursor-pointer transition-colors`}
            >
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/25">
                  <span className="text-white font-bold text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success-500 rounded-full border-2 border-slate-900" />
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-semibold text-[#FFFFFF] truncate">
                    {user.username}
                  </span>
                  <span className="text-[10px] text-slate-300 capitalize truncate">
                    {user.role}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* LEVEL-2 SIDEBAR (Context Navigation) */}
      {/* ============================================================ */}
      <AnimatePresence>
        {level2Config && activeModule !== 'dashboard' && (
          <motion.aside
            initial={{ x: -240, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -240, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`hidden lg:flex fixed top-0 bottom-0 w-60 ${isSidebarCollapsed ? 'left-16' : 'left-60'} bg-slate-900/95 backdrop-blur-xl border-r border-slate-700 z-40 flex-col shadow-2xl`}
          >
            {/* Header */}
            <div className="h-16 px-4 flex items-center border-b border-slate-700">
              <h2 className="text-base font-semibold text-white">
                {level2Config.title}
              </h2>
            </div>

            {/* Context Panel - Cluster & Namespace */}
            {(activeModule === 'kubernetes' || activeModule === 'deploy') && (
              <div className="px-3 py-3 border-b border-slate-700 space-y-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-slate-300 uppercase tracking-wider">
                    Target Cluster
                  </label>
                  <ClusterSwitcher />
                </div>
                {activeModule === 'kubernetes' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-medium text-slate-300 uppercase tracking-wider">
                      Filter NS
                    </label>
                    <NamespaceFilter />
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 overflow-y-auto">
              {level2Config.items.map((item) => {
                if (isGroup(item)) {
                  return (
                    <Level2CollapsibleGroup
                      key={item.name}
                      group={item}
                      isExpanded={expandedGroups.has(item.name)}
                      onToggle={() => toggleGroup(item.name)}
                      activeHref={location.pathname + location.search}
                    />
                  );
                }
                return (
                  <Level2SimpleItem
                    key={item.href}
                    item={item}
                    activeHref={location.pathname + location.search}
                  />
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-slate-700">
              <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheckIcon className="h-4 w-4 text-primary-300" />
                  <span className="text-xs font-semibold text-slate-100">
                    AI-Assisted DevSecOps
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">
                  CloudGuard v2.0.0 Enterprise
                </p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* MAIN CONTENT AREA */}
      {/* ============================================================ */}
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 ml-0 ${
          isSidebarCollapsed ? (level2Config && activeModule !== 'dashboard' ? 'lg:ml-[304px]' : 'lg:ml-16') : (level2Config && activeModule !== 'dashboard' ? 'lg:ml-[480px]' : 'lg:ml-60')
        }`}
      >
        {/* ============================================================ */}
        {/* TOP HEADER */}
        {/* ============================================================ */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700 shadow-md">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600" />

          <div className="h-full px-4 lg:px-6 flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Bars3Icon className="h-5 w-5 text-slate-300" />
            </button>

            {/* Breadcrumbs */}
            <div className="hidden md:block">
              <Breadcrumbs items={breadcrumbs} />
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <motion.div
                animate={{ width: searchFocused ? 280 : 200 }}
                className="relative"
              >
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Quick search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-800 border border-slate-700 focus:border-primary-400 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20 transition-all"
                />
              </motion.div>
            </form>

            {/* Notifications */}
            <NotificationDropdown />

            {/* User Section */}
            {user && (
              <div className="flex items-center gap-2 pl-4 border-l border-slate-700">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-white">
                    {user.username}
                  </span>
                  <span className="text-xs text-slate-300 capitalize">
                    {user.role}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
                </motion.button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 flex flex-col p-4 lg:p-6 bg-slate-950">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* ============================================================ */}
      {/* MOBILE MENU OVERLAY */}
      {/* ============================================================ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-slate-900 z-50 lg:hidden overflow-y-auto border-r border-slate-700"
            >
              {/* Mobile Header */}
              <div className="h-16 px-4 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <ShieldCheckIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-white">
                    CloudGuard
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-800"
                  aria-label="Close navigation"
                >
                  <XMarkIcon className="h-5 w-5 text-slate-300" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="p-4 space-y-2">
                {level1Navigation.map((item) => {
                  const isActive = activeModule === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleLevel1Click(item);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-primary-500 text-slate-950'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium text-sm">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-primary-500/20 text-primary-300">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

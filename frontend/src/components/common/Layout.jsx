import { useState, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  ServerStackIcon,
  Bars3Icon,
  XMarkIcon,
  CpuChipIcon,
  ServerIcon,
  SunIcon,
  MoonIcon,
  ArrowLeftStartOnRectangleIcon,
  CloudIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  ArrowPathIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  UserCircleIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  Square3Stack3DIcon,
  ArrowsRightLeftIcon,
  DocumentTextIcon,
  CubeIcon,
  CircleStackIcon,
  ChatBubbleLeftRightIcon,
  CubeTransparentIcon,
  LinkIcon,
  FolderIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldExclamationIcon,
  PhotoIcon,
  LockClosedIcon,
  ScaleIcon,
  SignalIcon,
  BeakerIcon,
  Cog6ToothIcon } from
'@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import ClusterSwitcher from './ClusterSwitcher';
import NamespaceFilter from './NamespaceFilter';
import AccountSettingsModal from './AccountSettingsModal';
import PermissionsInfo from './PermissionsInfo';
import NotificationDropdown from './NotificationDropdown';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";




















// Navigation sections based on CloudGuard UI Framework - Updated Design Spec
const navigationSections = [
{
  title: 'OVERVIEW',
  items: [
  { name: 'Dashboard', href: '/', icon: HomeIcon }]

},
{
  title: 'KUBERNETES',
  items: [
  { name: 'Cluster Overview', href: '/cluster-overview', icon: CloudIcon },
  { name: 'Nodes', href: '/kubernetes/nodes', icon: ServerIcon },
  { name: 'Namespaces', href: '/namespaces', icon: FolderIcon },
  {
    name: 'Workloads',
    href: '/kubernetes',
    icon: CubeTransparentIcon,
    children: [
    { name: 'Deployments', href: '/kubernetes?tab=deployments', icon: ServerStackIcon },
    { name: 'StatefulSets', href: '/kubernetes?tab=statefulsets', icon: Square3Stack3DIcon },
    { name: 'DaemonSets', href: '/kubernetes?tab=daemonsets', icon: CpuChipIcon },
    { name: 'Pods', href: '/kubernetes?tab=pods', icon: CubeIcon, badge: 'live' },
    { name: 'Jobs', href: '/kubernetes?tab=jobs', icon: PlayIcon },
    { name: 'CronJobs', href: '/kubernetes?tab=cronjobs', icon: ClockIcon }]

  },
  {
    name: 'Networking',
    href: '/networking',
    icon: GlobeAltIcon,
    children: [
    { name: 'Services', href: '/networking?tab=services', icon: SignalIcon },
    { name: 'Ingress', href: '/networking?tab=ingress', icon: ArrowsRightLeftIcon },
    { name: 'Network Policies', href: '/networking?tab=policies', icon: ShieldCheckIcon }]

  },
  {
    name: 'Storage',
    href: '/storage',
    icon: CircleStackIcon,
    children: [
    { name: 'Persistent Volumes', href: '/storage?tab=pv', icon: CircleStackIcon },
    { name: 'PV Claims', href: '/storage?tab=pvc', icon: DocumentTextIcon },
    { name: 'Storage Classes', href: '/storage?tab=classes', icon: FolderIcon }]

  }]

},
{
  title: 'DEPLOY',
  items: [
  { name: 'GitOps', href: '/deploy', icon: RocketLaunchIcon },
  { name: 'Helm Releases', href: '/deploy?tab=helm', icon: CubeIcon }]

},
{
  title: 'PIPELINES',
  items: [
  { name: 'Pipeline Builder', href: '/pipelines/builder', icon: BeakerIcon, badge: 'New', badgeColor: 'blue' },
  { name: 'Templates', href: '/pipelines/templates', icon: DocumentTextIcon },
  { name: 'Runs', href: '/pipelines/runs', icon: PlayIcon, statusDot: true },
  { name: 'Approvals', href: '/pipelines/approvals', icon: CheckCircleIcon }]

},
{
  title: 'AI OPTIMIZER',
  items: [
  { name: 'Resource Optimizer', href: '/optimization?tab=resource', icon: CpuChipIcon, badge: 'AI', badgeColor: 'purple' },
  { name: 'Cost Optimizer', href: '/optimization?tab=cost', icon: CurrencyDollarIcon, badge: 'AI', badgeColor: 'purple' },
  { name: 'Scaling Advisor', href: '/optimization?tab=scaling', icon: ScaleIcon, badge: 'AI', badgeColor: 'purple' },
  { name: 'Security Advisor', href: '/optimization?tab=security', icon: ShieldCheckIcon, badge: 'AI', badgeColor: 'purple' },
  { name: 'AI ChatOps', href: '#ai-chat', icon: ChatBubbleLeftRightIcon, badge: 'Beta', badgeColor: 'blue' }]

},
{
  title: 'SECURITY CENTER',
  items: [
  { name: 'Security Dashboard', href: '/security', icon: ShieldExclamationIcon },
  { name: 'RBAC Analyzer', href: '/security?tab=rbac', icon: LockClosedIcon },
  { name: 'Image Scanning', href: '/security?tab=scanning', icon: PhotoIcon },
  { name: 'Policy Engine', href: '/security?tab=policies', icon: DocumentTextIcon }]

},
{
  title: 'MONITORING',
  items: [
  { name: 'Metrics Dashboard', href: '/monitoring', icon: SignalIcon },
  { name: 'Alerts', href: '/monitoring/alerts', icon: ShieldExclamationIcon, badge: '3', badgeColor: 'red' },
  { name: 'Events', href: '/events', icon: DocumentTextIcon },
  { name: 'Logs', href: '/monitoring/logs', icon: DocumentTextIcon }]

},
{
  title: 'COST ANALYZER',
  items: [
  { name: 'Cost Dashboard', href: '/cost', icon: CurrencyDollarIcon },
  { name: 'Reports', href: '/cost/reports', icon: DocumentTextIcon }]

},
{
  title: 'INTEGRATIONS',
  items: [
  { name: 'All Integrations', href: '/settings/integrations', icon: LinkIcon },
  { name: 'Prometheus', href: '/integrations/prometheus', icon: SignalIcon },
  { name: 'ArgoCD', href: '/integrations/argocd', icon: ArrowPathIcon }]

},
{
  title: 'SETTINGS',
  items: [
  { name: 'General Settings', href: '/settings', icon: Cog6ToothIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
  { name: 'Cluster Connections', href: '/clusters', icon: CloudIcon },
  { name: 'User Management', href: '/admin/users', icon: UserGroupIcon },
  { name: 'API Keys', href: '/admin/api-keys', icon: LockClosedIcon }]

}];


// Animation variants
const sidebarVariants = {
  hidden: { x: -280, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: {
    x: -280,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const childrenVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2 }
  }
};

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState(['Workloads']);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navRef = useRef(null);
  const mobileNavRef = useRef(null);

  const isAdmin = user?.role === 'admin';

  // Filter sections and items based on user role
  const filteredSections = navigationSections.map((section) => {
    if (section.title === 'SETTINGS') {
      return {
        ...section,
        items: section.items.filter((item) => {
          if (item.name === 'User Management') return isAdmin;
          return true;
        })
      };
    }
    return section;
  });

  const scrollToItem = useCallback((itemName, navElement) => {
    if (!navElement) return;
    setTimeout(() => {
      const itemElement = navElement.querySelector(`[data-nav-item="${itemName}"]`);
      if (itemElement) {
        itemElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }, []);

  const toggleExpand = (name, isMobile = false) => {
    const isExpanding = !expandedItems.includes(name);
    setExpandedItems((prev) =>
    prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
    if (isExpanding) {
      scrollToItem(name, isMobile ? mobileNavRef.current : navRef.current);
    }
  };

  const handleAIChatClick = () => {
    // Dispatch event to open AI chat
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
  };

  const isItemActive = (item) => {
    if (item.children) {
      return item.children.some((child) => {
        const childHref = child.href.split('?')[0];
        return location.pathname === childHref;
      });
    }
    const itemHref = item.href.split('?')[0];
    return location.pathname === itemHref || item.href === '/' && location.pathname === '/';
  };

  const renderNavItem = (item, _index, mobile = false, collapsed = false) => {
    const isActive = isItemActive(item);
    const isExpanded = expandedItems.includes(item.name);
    const hasChildren = item.children && item.children.length > 0;
    const isHovered = hoveredItem === item.name;

    // Handle AI Chat special case
    if (item.href === '#ai-chat') {
      if (collapsed && !mobile) {
        return (/*#__PURE__*/
          _jsxDEV("div", { className: "relative", children: /*#__PURE__*/
            _jsxDEV("button", {
              onClick: handleAIChatClick,
              onMouseEnter: () => setHoveredItem(item.name),
              onMouseLeave: () => setHoveredItem(null),
              className: "w-full relative flex items-center justify-center p-3 rounded-xl transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5", children: [/*#__PURE__*/

              _jsxDEV(item.icon, { className: "h-5 w-5" }, void 0, false), /*#__PURE__*/
              _jsxDEV(AnimatePresence, { children:
                isHovered && /*#__PURE__*/
                _jsxDEV(motion.div, {
                  initial: { opacity: 0, x: 10, scale: 0.95 },
                  animate: { opacity: 1, x: 0, scale: 1 },
                  exit: { opacity: 0, x: 10, scale: 0.95 },
                  className: "absolute left-full ml-3 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-lg whitespace-nowrap z-50 shadow-xl", children: /*#__PURE__*/

                  _jsxDEV("div", { className: "flex items-center gap-2", children: [
                    item.name,
                    item.badge && /*#__PURE__*/
                    _jsxDEV("span", { className: "px-1.5 py-0.5 text-[10px] rounded-full bg-blue-500/20 text-blue-400", children:
                      item.badge }, void 0, false
                    )] }, void 0, true

                  ) }, void 0, false
                ) }, void 0, false

              )] }, void 0, true
            ) }, item.name, false
          ));

      }
      return (/*#__PURE__*/
        _jsxDEV(motion.div, { whileHover: { x: 2 }, children: /*#__PURE__*/
          _jsxDEV("button", {
            onClick: handleAIChatClick,
            className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "p-1.5 rounded-lg bg-gray-100 dark:bg-slate-700/50", children: /*#__PURE__*/
              _jsxDEV(item.icon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("span", { className: "text-sm font-medium", children: item.name }, void 0, false),
            item.badge && /*#__PURE__*/
            _jsxDEV("span", { className: `ml-auto px-1.5 py-0.5 text-[10px] rounded-full font-semibold ${
              item.badgeColor === 'blue' ?
              'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
              'bg-primary-500/20 text-primary-600 dark:text-primary-400'}`, children:

              item.badge }, void 0, false
            )] }, void 0, true

          ) }, item.name, false
        ));

    }

    // Collapsed sidebar view
    if (collapsed && !mobile) {
      if (hasChildren) {
        return (/*#__PURE__*/
          _jsxDEV("div", { className: "relative", children: /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => {
                setSidebarCollapsed(false);
                if (!expandedItems.includes(item.name)) {
                  toggleExpand(item.name, false);
                }
              },
              onMouseEnter: () => setHoveredItem(item.name),
              onMouseLeave: () => setHoveredItem(null),
              className: `w-full relative flex items-center justify-center p-3 rounded-xl transition-all duration-200 group ${
              isActive ?
              'bg-gradient-to-r from-primary-500/20 to-primary-600/10 text-primary-600 dark:text-primary-400' :
              'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5'}`, children: [/*#__PURE__*/


              _jsxDEV(item.icon, { className: "h-5 w-5" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primary-500" }, void 0, false), /*#__PURE__*/
              _jsxDEV(AnimatePresence, { children:
                isHovered && /*#__PURE__*/
                _jsxDEV(motion.div, {
                  initial: { opacity: 0, x: 10, scale: 0.95 },
                  animate: { opacity: 1, x: 0, scale: 1 },
                  exit: { opacity: 0, x: 10, scale: 0.95 },
                  className: "absolute left-full ml-3 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-lg whitespace-nowrap z-50 shadow-xl", children: /*#__PURE__*/

                  _jsxDEV("div", { className: "flex items-center gap-2", children: [
                    item.name,
                    item.badge && /*#__PURE__*/
                    _jsxDEV("span", { className: `px-1.5 py-0.5 text-[10px] rounded-full ${
                      item.badgeColor === 'purple' ? 'bg-purple-500/20 text-purple-400' : 'bg-primary-500/20 text-primary-400'}`, children:

                      item.badge }, void 0, false
                    )] }, void 0, true

                  ) }, void 0, false
                ) }, void 0, false

              )] }, void 0, true
            ) }, item.name, false
          ));

      }

      return (/*#__PURE__*/
        _jsxDEV("div", { className: "relative", children: /*#__PURE__*/
          _jsxDEV(Link, {
            to: item.href,
            onMouseEnter: () => setHoveredItem(item.name),
            onMouseLeave: () => setHoveredItem(null),
            className: `relative flex items-center justify-center p-3 rounded-xl transition-all duration-200 group ${
            isActive ?
            'bg-gradient-to-r from-primary-500/20 to-primary-600/10 text-primary-600 dark:text-primary-400' :
            'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5'}`, children: [/*#__PURE__*/


            _jsxDEV(item.icon, { className: "h-5 w-5" }, void 0, false),
            item.statusDot && /*#__PURE__*/
            _jsxDEV("span", { className: "absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" }, void 0, false), /*#__PURE__*/

            _jsxDEV(AnimatePresence, { children:
              isHovered && /*#__PURE__*/
              _jsxDEV(motion.div, {
                initial: { opacity: 0, x: 10, scale: 0.95 },
                animate: { opacity: 1, x: 0, scale: 1 },
                exit: { opacity: 0, x: 10, scale: 0.95 },
                className: "absolute left-full ml-3 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-lg whitespace-nowrap z-50 shadow-xl", children: /*#__PURE__*/

                _jsxDEV("div", { className: "flex items-center gap-2", children: [
                  item.name,
                  item.badge && /*#__PURE__*/
                  _jsxDEV("span", { className: `px-1.5 py-0.5 text-[10px] rounded-full ${
                    item.badgeColor === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                    item.badgeColor === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-primary-500/20 text-primary-400'}`, children:

                    item.badge }, void 0, false
                  )] }, void 0, true

                ) }, void 0, false
              ) }, void 0, false

            )] }, void 0, true
          ) }, item.name, false
        ));

    }

    // Full sidebar view
    if (hasChildren) {
      return (/*#__PURE__*/
        _jsxDEV("div", { "data-nav-item": item.name, children: [/*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { x: 2 },
            onClick: () => toggleExpand(item.name, mobile),
            className: `w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
            isActive ?
            'bg-gradient-to-r from-primary-500/20 to-primary-600/10 text-primary-600 dark:text-primary-400 font-medium' :
            'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5'}`, children: [/*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: `p-1.5 rounded-lg transition-colors ${isActive ? 'bg-primary-500/20' : 'bg-gray-100 dark:bg-slate-700/50'}`, children: /*#__PURE__*/
                _jsxDEV(item.icon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("span", { className: "text-sm font-medium", children: item.name }, void 0, false),
              item.badge && /*#__PURE__*/
              _jsxDEV("span", { className: `px-1.5 py-0.5 text-[10px] rounded-full font-semibold ${
                item.badgeColor === 'purple' ?
                'bg-purple-500/20 text-purple-600 dark:text-purple-400' :
                'bg-primary-500/20 text-primary-600 dark:text-primary-400'}`, children:

                item.badge }, void 0, false
              )] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV(motion.div, {
              animate: { rotate: isExpanded ? 180 : 0 },
              transition: { duration: 0.2 }, children: /*#__PURE__*/

              _jsxDEV(ChevronDownIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV(AnimatePresence, { children:
            isExpanded && /*#__PURE__*/
            _jsxDEV(motion.div, {
              variants: childrenVariants,
              initial: "hidden",
              animate: "visible",
              exit: "exit",
              className: "ml-4 mt-1 space-y-0.5 overflow-hidden", children:

              item.children.map((child, childIndex) => {
                const childHref = child.href.split('?')[0];
                const childActive = location.pathname === childHref;
                return (/*#__PURE__*/
                  _jsxDEV(motion.div, {

                    initial: { opacity: 0, x: -10 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: childIndex * 0.03 }, children: /*#__PURE__*/

                    _jsxDEV(Link, {
                      to: child.href,
                      onClick: mobile ? () => setSidebarOpen(false) : undefined,
                      className: `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                      childActive ?
                      'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium border-l-2 border-primary-500' :
                      'text-gray-500 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-gray-200'}`, children: [/*#__PURE__*/


                      _jsxDEV(child.icon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "flex-1", children: child.name }, void 0, false),
                      child.badge && /*#__PURE__*/
                      _jsxDEV("span", { className: "px-1.5 py-0.5 text-[9px] rounded-full bg-green-500/20 text-green-600 dark:text-green-400 font-medium uppercase", children:
                        child.badge }, void 0, false
                      )] }, void 0, true

                    ) }, child.name, false
                  ));

              }) }, void 0, false
            ) }, void 0, false

          )] }, item.name, true
        ));

    }

    return (/*#__PURE__*/
      _jsxDEV(motion.div, { whileHover: { x: 2 }, children: /*#__PURE__*/
        _jsxDEV(Link, {
          to: item.href,
          onClick: mobile ? () => setSidebarOpen(false) : undefined,
          className: `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
          isActive ?
          'bg-gradient-to-r from-primary-500/20 to-primary-600/10 text-primary-600 dark:text-primary-400 font-medium' :
          'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5'}`, children: [/*#__PURE__*/


          _jsxDEV("div", { className: `relative p-1.5 rounded-lg transition-colors ${isActive ? 'bg-primary-500/20' : 'bg-gray-100 dark:bg-slate-700/50'}`, children: [/*#__PURE__*/
            _jsxDEV(item.icon, { className: "h-4 w-4" }, void 0, false),
            item.statusDot && /*#__PURE__*/
            _jsxDEV("span", { className: "absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 animate-pulse" }, void 0, false)] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("span", { className: "text-sm font-medium", children: item.name }, void 0, false),
          item.badge && /*#__PURE__*/
          _jsxDEV("span", { className: `ml-auto px-1.5 py-0.5 text-[10px] rounded-full font-semibold ${
            item.badgeColor === 'purple' ?
            'bg-purple-500/20 text-purple-600 dark:text-purple-400' :
            item.badgeColor === 'blue' ?
            'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
            'bg-primary-500/20 text-primary-600 dark:text-primary-400'}`, children:

            item.badge }, void 0, false
          )] }, void 0, true

        ) }, item.name, false
      ));

  };

  const renderNavSection = (section, mobile = false, collapsed = false) => {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "mb-6", children: [
        !collapsed && /*#__PURE__*/
        _jsxDEV("h3", { className: "px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500", children:
          section.title }, void 0, false
        ),

        collapsed && /*#__PURE__*/_jsxDEV("div", { className: "mb-2 border-t border-gray-200/50 dark:border-slate-700/50" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "space-y-1", children:
          section.items.map((item, index) => renderNavItem(item, index, mobile, collapsed)) }, void 0, false
        )] }, section.title, true
      ));

  };

  const sidebarWidth = sidebarCollapsed ? 'lg:w-20' : 'lg:w-72';
  const mainPadding = sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72';

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-[#0f172a] dark:via-[#111827] dark:to-[#0f172a] transition-colors", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "fixed inset-0 overflow-hidden pointer-events-none z-[-1]", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "absolute -top-40 -right-40 w-96 h-96 bg-primary-400/5 dark:bg-primary-500/5 rounded-full blur-3xl pointer-events-none" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "absolute -bottom-40 left-1/4 w-96 h-96 bg-purple-400/5 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "absolute top-1/2 right-1/4 w-64 h-64 bg-blue-400/5 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        sidebarOpen && /*#__PURE__*/
        _jsxDEV(_Fragment, { children: [/*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className: "fixed inset-0 z-50 lg:hidden bg-slate-950/60 backdrop-blur-sm",
            onClick: () => setSidebarOpen(false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV(motion.div, {
            variants: sidebarVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            className: "fixed inset-y-0 left-0 z-50 w-72 lg:hidden", children: /*#__PURE__*/

            _jsxDEV("div", { className: "flex flex-col h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 dark:border-slate-700/50", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "flex h-16 items-center justify-between px-4 border-b border-gray-100/50 dark:border-slate-800/50 flex-shrink-0", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30", children: /*#__PURE__*/
                    _jsxDEV(SparklesIcon, { className: "h-5 w-5 text-white" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent", children: "CloudGuard" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wider", children: "AI-Assisted DevSecOps Platform" }, void 0, false

                    )] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  onClick: () => setSidebarOpen(false),
                  className: "p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-slate-800/50", children: /*#__PURE__*/

                  _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500 dark:text-gray-400" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("nav", {
                ref: mobileNavRef,
                className: "flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth", children:

                filteredSections.map((section) => renderNavSection(section, true, false)) }, void 0, false
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "p-4 border-t border-gray-100/50 dark:border-slate-800/50 flex-shrink-0", children: /*#__PURE__*/
                _jsxDEV("div", { className: "p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 via-primary-500/10 to-purple-500/10 border border-primary-500/20", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
                    _jsxDEV(SparklesIcon, { className: "h-4 w-4 text-primary-500" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-xs font-semibold text-gray-700 dark:text-gray-300", children: "AI-Powered" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "text-[10px] text-gray-500 dark:text-gray-400 font-mono", children: "v1.4.0" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "flex items-center gap-1 text-[10px] text-green-600 dark:text-green-400", children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" }, void 0, false), "Connected"] }, void 0, true

                    )] }, void 0, true
                  )] }, void 0, true
                ) }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(motion.div, {
        className: `hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block ${sidebarWidth}`,
        animate: { width: sidebarCollapsed ? 80 : 288 },
        transition: { duration: 0.3, ease: 'easeInOut' }, children: /*#__PURE__*/

        _jsxDEV("div", { className: "flex flex-col h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-slate-800/50 shadow-xl transition-colors", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex h-16 items-center px-4 border-b border-gray-100/50 dark:border-slate-800/50 flex-shrink-0", children: /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3 flex-1", children: [/*#__PURE__*/
              _jsxDEV(motion.div, {
                className: "w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30 flex-shrink-0",
                whileHover: { scale: 1.05, rotate: 5 },
                transition: { type: 'spring', stiffness: 400 }, children: /*#__PURE__*/

                _jsxDEV(SparklesIcon, { className: "h-5 w-5 text-white" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV(AnimatePresence, { children:
                !sidebarCollapsed && /*#__PURE__*/
                _jsxDEV(motion.div, {
                  initial: { opacity: 0, width: 0 },
                  animate: { opacity: 1, width: 'auto' },
                  exit: { opacity: 0, width: 0 },
                  className: "overflow-hidden", children: [/*#__PURE__*/

                  _jsxDEV("span", { className: "text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap", children: "CloudGuard" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wider whitespace-nowrap", children: "AI-Assisted DevSecOps Platform" }, void 0, false

                  )] }, void 0, true
                ) }, void 0, false

              )] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV("nav", {
            ref: navRef,
            className: "flex-1 overflow-y-auto p-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth", children:

            filteredSections.map((section) => renderNavSection(section, false, sidebarCollapsed)) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "p-3 border-t border-gray-100/50 dark:border-slate-800/50 flex-shrink-0 space-y-2", children: [/*#__PURE__*/

            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: () => setSidebarCollapsed(!sidebarCollapsed),
              className: "w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-gray-100/50 dark:bg-slate-800/50 hover:bg-gray-200/50 dark:hover:bg-slate-700/50 text-gray-500 dark:text-gray-400 transition-colors", children:

              sidebarCollapsed ? /*#__PURE__*/
              _jsxDEV(ChevronRightIcon, { className: "h-4 w-4" }, void 0, false) : /*#__PURE__*/

              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(ChevronLeftIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-xs", children: "Collapse" }, void 0, false)] }, void 0, true
              ) }, void 0, false

            ), /*#__PURE__*/


            _jsxDEV(AnimatePresence, { children:
              !sidebarCollapsed && /*#__PURE__*/
              _jsxDEV(motion.div, {
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: 'auto' },
                exit: { opacity: 0, height: 0 },
                className: "overflow-hidden", children: /*#__PURE__*/

                _jsxDEV("div", { className: "p-3 rounded-2xl bg-gradient-to-br from-blue-500/10 via-primary-500/10 to-purple-500/10 border border-primary-500/20 backdrop-blur-sm", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                      _jsxDEV(SparklesIcon, { className: "h-4 w-4 text-primary-500" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs font-semibold text-gray-700 dark:text-gray-300", children: "AI-Powered" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { rotate: 180 },
                      transition: { duration: 0.3 },
                      className: "p-1 rounded-md hover:bg-white/50 dark:hover:bg-slate-700/50",
                      title: "Sync status", children: /*#__PURE__*/

                      _jsxDEV(ArrowPathIcon, { className: "h-3 w-3 text-gray-400" }, void 0, false) }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "text-[10px] text-gray-500 dark:text-gray-400 font-mono", children: "v1.4.0" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-500/10 text-[10px] text-green-600 dark:text-green-400 font-medium", children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" }, void 0, false), "Connected"] }, void 0, true

                    )] }, void 0, true
                  )] }, void 0, true
                ) }, void 0, false
              ) }, void 0, false

            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, {
        className: `${mainPadding} h-screen flex flex-col`,
        animate: { paddingLeft: sidebarCollapsed ? 80 : 288 },
        transition: { duration: 0.3, ease: 'easeInOut' },
        style: { paddingLeft: undefined }, children: [/*#__PURE__*/


        _jsxDEV("div", { className: "flex-shrink-0 z-40 h-16 relative", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-gray-200/30 dark:border-slate-700/30 shadow-lg shadow-gray-200/20 dark:shadow-slate-900/50" }, void 0, false), /*#__PURE__*/


          _jsxDEV("div", { className: "absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-primary-500 to-purple-600 opacity-80" }, void 0, false), /*#__PURE__*/


          _jsxDEV("div", { className: "relative h-full flex items-center px-4 lg:px-6", children: [/*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              className: "lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500/10 to-purple-500/10 hover:from-primary-500/20 hover:to-purple-500/20 border border-primary-500/20 transition-all duration-300",
              onClick: () => setSidebarOpen(true), children: [/*#__PURE__*/

              _jsxDEV(Bars3Icon, { className: "h-5 w-5 text-primary-600 dark:text-primary-400" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-sm font-semibold text-primary-600 dark:text-primary-400", children: "Menu" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("div", { className: "flex-1 flex justify-end items-center gap-3", children: [/*#__PURE__*/

              _jsxDEV(ClusterSwitcher, {}, void 0, false), /*#__PURE__*/


              _jsxDEV(NamespaceFilter, {}, void 0, false), /*#__PURE__*/


              _jsxDEV(NotificationDropdown, {}, void 0, false), /*#__PURE__*/


              _jsxDEV(motion.button, {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                onClick: toggleTheme,
                className: "relative p-2.5 rounded-xl bg-gray-100/80 dark:bg-slate-800/80 hover:bg-gray-200/80 dark:hover:bg-slate-700/80 transition-all duration-300 border border-gray-200/50 dark:border-slate-700/50 shadow-sm",
                title: theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode', children: /*#__PURE__*/

                _jsxDEV(AnimatePresence, { mode: "wait", children:
                  theme === 'light' ? /*#__PURE__*/
                  _jsxDEV(motion.div, {

                    initial: { rotate: -90, opacity: 0, scale: 0.5 },
                    animate: { rotate: 0, opacity: 1, scale: 1 },
                    exit: { rotate: 90, opacity: 0, scale: 0.5 },
                    transition: { duration: 0.2 }, children: /*#__PURE__*/

                    _jsxDEV(MoonIcon, { className: "h-5 w-5 text-slate-600" }, void 0, false) }, "moon", false
                  ) : /*#__PURE__*/

                  _jsxDEV(motion.div, {

                    initial: { rotate: 90, opacity: 0, scale: 0.5 },
                    animate: { rotate: 0, opacity: 1, scale: 1 },
                    exit: { rotate: -90, opacity: 0, scale: 0.5 },
                    transition: { duration: 0.2 }, children: /*#__PURE__*/

                    _jsxDEV(SunIcon, { className: "h-5 w-5 text-amber-500" }, void 0, false) }, "sun", false
                  ) }, void 0, false

                ) }, void 0, false
              ),


              user && /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-3 pl-3 border-l border-gray-200/50 dark:border-slate-700/50", children: [/*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => setShowAccountSettings(true),
                  className: "flex items-center gap-3 group", children: [/*#__PURE__*/

                  _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
                    _jsxDEV(motion.div, {
                      whileHover: { scale: 1.05 },
                      className: "w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30 cursor-pointer", children: /*#__PURE__*/

                      _jsxDEV("span", { className: "text-white font-bold text-sm", children:
                        user.username.charAt(0).toUpperCase() }, void 0, false
                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: "absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "hidden sm:block text-left", children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors", children:
                      user.username }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 capitalize flex items-center gap-1.5", children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-primary-500" }, void 0, false),
                      user.role, /*#__PURE__*/
                      _jsxDEV(PermissionsInfo, { iconOnly: true, buttonClassName: "ml-1" }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  onClick: () => setShowAccountSettings(true),
                  className: "p-2.5 rounded-xl bg-gray-100/50 dark:bg-slate-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400",
                  title: "Account settings", children: /*#__PURE__*/

                  _jsxDEV(UserCircleIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  onClick: logout,
                  className: "p-2.5 rounded-xl bg-gray-100/50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400",
                  title: "Sign out", children: /*#__PURE__*/

                  _jsxDEV(ArrowLeftStartOnRectangleIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
                )] }, void 0, true
              )] }, void 0, true

            )] }, void 0, true
          )] }, void 0, true
        ),



        location.pathname.includes('/pipelines/builder') || location.pathname.includes('/pipelines/new') || location.pathname.match(/\/pipelines\/[^/]+\/edit/) ? /*#__PURE__*/
        _jsxDEV("main", { className: "flex-1 min-h-0 overflow-hidden relative", children:
          children }, void 0, false
        ) : /*#__PURE__*/

        _jsxDEV("main", { className: "flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative main-scrollbar", children: /*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
            className: "p-4 lg:p-6", children:

            children }, void 0, false
          ) }, void 0, false
        )] }, void 0, true

      ), /*#__PURE__*/


      _jsxDEV(AccountSettingsModal, {
        isOpen: showAccountSettings,
        onClose: () => setShowAccountSettings(false) }, void 0, false
      )] }, void 0, true
    ));

}
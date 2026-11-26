import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
  CloudIcon,
  FolderIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
  LinkIcon } from
'@heroicons/react/24/outline';
import { argocdApi } from '../../services/api';
import { logger } from '../../utils/logger';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";


// Import shared constants

export default function GitOpsStatus() {
  const [applications, setApplications] = useState([]);
  const [argocdStatus, setArgocdStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [syncFilter, setSyncFilter] = useState('all');
  const [expandedApp, setExpandedApp] = useState(null);
  const [syncingApps, setSyncingApps] = useState(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch ArgoCD status and applications
  const fetchData = useCallback(async () => {
    try {
      setError(null);

      // First check ArgoCD connection status
      const statusResponse = await argocdApi.getStatus();
      setArgocdStatus(statusResponse.data);

      if (statusResponse.data.connected) {
        // Fetch applications
        const appsResponse = await argocdApi.listApplications(
          projectFilter !== 'all' ? projectFilter : undefined
        );
        setApplications(appsResponse.data.applications || []);
      }
    } catch (err) {
      logger.error('Failed to fetch ArgoCD data', err);
      setError('Failed to connect to ArgoCD. Please check your ArgoCD configuration in Deploy settings.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [projectFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get unique projects
  const projects = useMemo(() => {
    const projectSet = new Set(applications.map((a) => a.project));
    return ['all', ...Array.from(projectSet).sort()];
  }, [applications]);

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.namespace.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.repoURL.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProject = projectFilter === 'all' || app.project === projectFilter;
      const matchesSync = syncFilter === 'all' ||
      syncFilter === 'synced' && app.syncStatus === 'Synced' ||
      syncFilter === 'out_of_sync' && app.syncStatus === 'OutOfSync';
      return matchesSearch && matchesProject && matchesSync;
    });
  }, [applications, searchQuery, projectFilter, syncFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: applications.length,
      synced: applications.filter((a) => a.syncStatus === 'Synced').length,
      outOfSync: applications.filter((a) => a.syncStatus === 'OutOfSync').length,
      healthy: applications.filter((a) => a.healthStatus === 'Healthy').length,
      degraded: applications.filter((a) => a.healthStatus === 'Degraded').length,
      progressing: applications.filter((a) => a.healthStatus === 'Progressing').length
    };
  }, [applications]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
  };

  const handleSync = async (appName) => {
    setSyncingApps((prev) => new Set(prev).add(appName));
    try {
      await argocdApi.syncApplication(appName);
      // Refresh after sync
      await fetchData();
    } catch (err) {
      logger.error('Failed to sync application', err);
    } finally {
      setSyncingApps((prev) => {
        const next = new Set(prev);
        next.delete(appName);
        return next;
      });
    }
  };

  const getSyncStatusColor = (status) => {
    const colors = {
      'Synced': 'bg-green-500/20 text-green-400 border-green-500/30',
      'OutOfSync': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Unknown': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[status] || colors['Unknown'];
  };

  const getHealthStatusColor = (status) => {
    const colors = {
      'Healthy': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Degraded': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Progressing': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Suspended': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      'Missing': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Unknown': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[status] || colors['Unknown'];
  };

  const getSyncStatusIcon = (status) => {
    switch (status) {
      case 'Synced':
        return /*#__PURE__*/_jsxDEV(CheckCircleIcon, { className: "w-5 h-5 text-green-400" }, void 0, false);
      case 'OutOfSync':
        return /*#__PURE__*/_jsxDEV(ExclamationTriangleIcon, { className: "w-5 h-5 text-yellow-400" }, void 0, false);
      default:
        return /*#__PURE__*/_jsxDEV(ClockIcon, { className: "w-5 h-5 text-gray-400" }, void 0, false);
    }
  };

  const getHealthStatusIcon = (status) => {
    switch (status) {
      case 'Healthy':
        return /*#__PURE__*/_jsxDEV(CheckCircleIcon, { className: "w-4 h-4 text-green-400" }, void 0, false);
      case 'Degraded':
        return /*#__PURE__*/_jsxDEV(XCircleIcon, { className: "w-4 h-4 text-red-400" }, void 0, false);
      case 'Progressing':
        return /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "w-4 h-4 text-blue-400 animate-spin" }, void 0, false);
      default:
        return /*#__PURE__*/_jsxDEV(ClockIcon, { className: "w-4 h-4 text-gray-400" }, void 0, false);
    }
  };

  if (loading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center h-64", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3 text-gray-400", children: [/*#__PURE__*/
          _jsxDEV(ArrowPathIcon, { className: "w-6 h-6 animate-spin" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { children: "Loading ArgoCD applications..." }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ));

  }

  // Show connection required message if ArgoCD is not configured
  if (!argocdStatus?.connected) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(CloudIcon, { className: "w-7 h-7 text-orange-400" }, void 0, false), "GitOps Status"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-400 mt-1", children: "ArgoCD application sync and health status" }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "flex flex-col items-center justify-center py-16 px-8 rounded-xl bg-gray-800 border border-gray-700", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "p-4 rounded-full bg-orange-500/20 mb-4", children: /*#__PURE__*/
            _jsxDEV(LinkIcon, { className: "w-12 h-12 text-orange-400" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("h2", { className: "text-xl font-semibold text-white mb-2", children: "ArgoCD Not Connected" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-400 text-center max-w-md mb-6", children: "To view GitOps status, you need to configure and connect to your ArgoCD instance. Go to the Deploy page to set up ArgoCD integration." }, void 0, false


          ), /*#__PURE__*/
          _jsxDEV(Link, {
            to: "/deploy",
            className: "flex items-center gap-2 px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors", children: [/*#__PURE__*/

            _jsxDEV(CloudIcon, { className: "w-5 h-5" }, void 0, false), "Configure ArgoCD"] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ));

  }

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(CloudIcon, { className: "w-7 h-7 text-orange-400" }, void 0, false), "GitOps Status"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-400 mt-1", children: "ArgoCD application sync and health status" }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            onClick: handleRefresh,
            disabled: isRefreshing,
            className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors disabled:opacity-50", children: [/*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV(Link, {
            to: "/deploy",
            className: "flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors", children: [/*#__PURE__*/

            _jsxDEV(CloudIcon, { className: "w-5 h-5" }, void 0, false), "Manage ArgoCD"] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ),


      error && /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30", children: [/*#__PURE__*/

        _jsxDEV(ExclamationTriangleIcon, { className: "w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-red-400 font-medium", children: "Error" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-red-400/80 text-sm mt-1", children: error }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/



      _jsxDEV("div", { className: "flex items-center gap-4 p-4 rounded-lg bg-gray-800 border border-gray-700", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV("span", { className: "w-3 h-3 rounded-full bg-green-500 animate-pulse" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "text-green-400 font-medium", children: "Connected to ArgoCD" }, void 0, false)] }, void 0, true
        ),
        argocdStatus?.serverUrl && /*#__PURE__*/
        _jsxDEV("a", {
          href: argocdStatus.serverUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors", children: [/*#__PURE__*/

          _jsxDEV("span", { className: "font-mono", children: argocdStatus.serverUrl }, void 0, false), /*#__PURE__*/
          _jsxDEV(ArrowTopRightOnSquareIcon, { className: "w-4 h-4" }, void 0, false)] }, void 0, true
        )] }, void 0, true

      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "p-4 rounded-lg bg-gray-800 border border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-400 text-sm", children: "Total Apps" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-white mt-1", children: stats.total }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "p-4 rounded-lg bg-gray-800 border border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-400 text-sm", children: "Synced" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-green-400 mt-1", children: stats.synced }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "p-4 rounded-lg bg-gray-800 border border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-400 text-sm", children: "Out of Sync" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-yellow-400 mt-1", children: stats.outOfSync }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "p-4 rounded-lg bg-gray-800 border border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-400 text-sm", children: "Healthy" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-green-400 mt-1", children: stats.healthy }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "p-4 rounded-lg bg-gray-800 border border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-400 text-sm", children: "Degraded" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-red-400 mt-1", children: stats.degraded }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "p-4 rounded-lg bg-gray-800 border border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-400 text-sm", children: "Progressing" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-blue-400 mt-1", children: stats.progressing }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex flex-col sm:flex-row gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "relative flex-1", children: [/*#__PURE__*/
          _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("input", {
            type: "text",
            placeholder: "Search applications...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500" }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("select", {
          value: projectFilter,
          onChange: (e) => setProjectFilter(e.target.value),
          className: "px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50", children:

          projects.map((project) => /*#__PURE__*/
          _jsxDEV("option", { value: project, children:
            project === 'all' ? 'All Projects' : project }, project, false
          )
          ) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("select", {
          value: syncFilter,
          onChange: (e) => setSyncFilter(e.target.value),
          className: "px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50", children: [/*#__PURE__*/

          _jsxDEV("option", { value: "all", children: "All Status" }, void 0, false), /*#__PURE__*/
          _jsxDEV("option", { value: "synced", children: "Synced" }, void 0, false), /*#__PURE__*/
          _jsxDEV("option", { value: "out_of_sync", children: "Out of Sync" }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "space-y-4", children: /*#__PURE__*/
        _jsxDEV(AnimatePresence, { mode: "popLayout", children:
          filteredApplications.length === 0 ? /*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "text-center py-12 text-gray-400", children: [/*#__PURE__*/

            _jsxDEV(CloudIcon, { className: "w-12 h-12 mx-auto mb-4 opacity-50" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { children: applications.length === 0 ? 'No applications found in ArgoCD' : 'No applications match your filters' }, void 0, false)] }, void 0, true
          ) :

          filteredApplications.map((app) => {
            const isExpanded = expandedApp === app.name;
            const isSyncing = syncingApps.has(app.name);

            return (/*#__PURE__*/
              _jsxDEV(motion.div, {

                layout: true,
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 },
                className: "p-4 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors", children: [/*#__PURE__*/


                _jsxDEV("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-3", children: [
                    getSyncStatusIcon(app.syncStatus), /*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("h3", { className: "text-lg font-semibold text-white", children: app.name }, void 0, false), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm text-gray-400", children: [
                        app.namespace, " • ", app.project] }, void 0, true
                      )] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: `flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border ${getSyncStatusColor(app.syncStatus)}`, children:
                      app.syncStatus }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: `flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border ${getHealthStatusColor(app.healthStatus)}`, children: [
                      getHealthStatusIcon(app.healthStatus),
                      app.healthStatus] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.05 },
                      whileTap: { scale: 0.95 },
                      onClick: () => handleSync(app.name),
                      disabled: isSyncing,
                      className: "flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-sm transition-colors disabled:opacity-50", children: [/*#__PURE__*/

                      _jsxDEV(ArrowPathIcon, { className: `w-4 h-4 ${isSyncing ? 'animate-spin' : ''}` }, void 0, false),
                      isSyncing ? 'Syncing...' : 'Sync'] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV(motion.button, {
                      whileHover: { scale: 1.1 },
                      whileTap: { scale: 0.9 },
                      onClick: () => setExpandedApp(isExpanded ? null : app.name),
                      className: "p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors", children: /*#__PURE__*/

                      _jsxDEV(ChevronRightIcon, { className: `w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}` }, void 0, false) }, void 0, false
                    )] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/


                _jsxDEV(AnimatePresence, { children:
                  isExpanded && /*#__PURE__*/
                  _jsxDEV(motion.div, {
                    initial: { height: 0, opacity: 0 },
                    animate: { height: 'auto', opacity: 1 },
                    exit: { height: 0, opacity: 0 },
                    transition: { duration: 0.2 },
                    className: "overflow-hidden", children: [/*#__PURE__*/

                    _jsxDEV("div", { className: "mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
                        _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                          _jsxDEV(CodeBracketIcon, { className: "w-5 h-5 text-gray-400 mt-0.5" }, void 0, false), /*#__PURE__*/
                          _jsxDEV("div", { children: [/*#__PURE__*/
                            _jsxDEV("p", { className: "text-xs text-gray-500", children: "Repository" }, void 0, false), /*#__PURE__*/
                            _jsxDEV("a", {
                              href: app.repoURL,
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className: "text-sm text-cyan-400 hover:underline flex items-center gap-1", children: [

                              app.repoURL, /*#__PURE__*/
                              _jsxDEV(ArrowTopRightOnSquareIcon, { className: "w-3 h-3" }, void 0, false)] }, void 0, true
                            )] }, void 0, true
                          )] }, void 0, true
                        ), /*#__PURE__*/
                        _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                          _jsxDEV(FolderIcon, { className: "w-5 h-5 text-gray-400 mt-0.5" }, void 0, false), /*#__PURE__*/
                          _jsxDEV("div", { children: [/*#__PURE__*/
                            _jsxDEV("p", { className: "text-xs text-gray-500", children: "Path" }, void 0, false), /*#__PURE__*/
                            _jsxDEV("p", { className: "text-sm text-white font-mono", children: app.path || '/' }, void 0, false)] }, void 0, true
                          )] }, void 0, true
                        )] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
                        _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                          _jsxDEV(CloudIcon, { className: "w-5 h-5 text-gray-400 mt-0.5" }, void 0, false), /*#__PURE__*/
                          _jsxDEV("div", { children: [/*#__PURE__*/
                            _jsxDEV("p", { className: "text-xs text-gray-500", children: "Target Revision" }, void 0, false), /*#__PURE__*/
                            _jsxDEV("p", { className: "text-sm text-white font-mono", children: app.targetRevision }, void 0, false)] }, void 0, true
                          )] }, void 0, true
                        ), /*#__PURE__*/
                        _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                          _jsxDEV(CloudIcon, { className: "w-5 h-5 text-gray-400 mt-0.5" }, void 0, false), /*#__PURE__*/
                          _jsxDEV("div", { children: [/*#__PURE__*/
                            _jsxDEV("p", { className: "text-xs text-gray-500", children: "Destination" }, void 0, false), /*#__PURE__*/
                            _jsxDEV("p", { className: "text-sm text-white", children: [app.destNamespace, " @ ", app.destServer] }, void 0, true)] }, void 0, true
                          )] }, void 0, true
                        )] }, void 0, true
                      )] }, void 0, true
                    ),


                    app.syncRevision && /*#__PURE__*/
                    _jsxDEV("div", { className: "mt-4 flex items-center gap-4", children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs text-gray-500", children: "Current Revision:" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "px-2 py-1 text-xs rounded bg-gray-700 text-gray-300 font-mono", children:
                        app.syncRevision.substring(0, 8) }, void 0, false
                      )] }, void 0, true
                    )] }, void 0, true

                  ) }, void 0, false

                )] }, app.name, true
              ));

          }) }, void 0, false

        ) }, void 0, false
      )] }, void 0, true
    ));

}
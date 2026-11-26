import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { helmApi } from '../../services/api';
import { logger } from '../../utils/logger';
import { useToast } from '../../contexts/ToastContext';
import { useHelmReleases } from '../../hooks/useHelmData';

import {
  CubeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowPathIcon,
  EyeIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChevronDownIcon } from
'@heroicons/react/24/outline';

// Import shared utilities
import { formatAge } from '../../utils/constants';
import { StatusBadge } from '../common/StatusBadge';

// Helm-specific status label mapping
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";const helmStatusLabels = {
  deployed: 'Deployed',
  failed: 'Failed',
  'pending-install': 'Installing',
  'pending-upgrade': 'Upgrading',
  'pending-rollback': 'Rolling back',
  uninstalling: 'Uninstalling',
  superseded: 'Superseded',
  unknown: 'Unknown'
};

// Helper to map Helm status to standard status
function getHelmStatusType(status) {
  const statusMap = {
    deployed: 'deployed',
    failed: 'failed',
    'pending-install': 'pending',
    'pending-upgrade': 'progressing',
    'pending-rollback': 'warning',
    uninstalling: 'warning',
    superseded: 'unknown',
    unknown: 'unknown'
  };
  return statusMap[status] || 'unknown';
}

// Helm Status Badge using shared StatusBadge
function HelmStatusBadge({ status }) {
  return (/*#__PURE__*/
    _jsxDEV(StatusBadge, {
      status: getHelmStatusType(status),
      label: helmStatusLabels[status] || status,
      size: "sm",
      animate: status.startsWith('pending') || status === 'uninstalling' }, void 0, false
    ));

}

// Dropdown Component
function Dropdown({
  label,
  value,
  options,
  onChange





}) {
  const [isOpen, setIsOpen] = useState(false);

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
      _jsxDEV("label", { className: "text-sm text-gray-500 dark:text-gray-400 mb-1.5 block", children: label }, void 0, false), /*#__PURE__*/
      _jsxDEV("button", {
        onClick: () => setIsOpen(!isOpen),
        className: "flex items-center justify-between gap-3 px-4 py-2.5 min-w-[180px] text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-primary-500 transition-colors", children: [/*#__PURE__*/

        _jsxDEV("span", { className: "text-gray-900 dark:text-white", children: value }, void 0, false), /*#__PURE__*/
        _jsxDEV(ChevronDownIcon, { className: `h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}` }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV(AnimatePresence, { children:
        isOpen && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          className: "absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden", children:

          options.map((option) => /*#__PURE__*/
          _jsxDEV("button", {

            onClick: () => {
              onChange(option);
              setIsOpen(false);
            },
            className: `w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${
            option === value ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`, children:


            option }, option, false
          )
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}

// Main Component
export default function HelmDashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedNamespace, setSelectedNamespace] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Use cached hook for releases
  const { releases, isRefetching: loading, error, refresh } = useHelmReleases(selectedNamespace);

  // Extract unique namespaces from releases
  const namespaces = useMemo(() => {
    const uniqueNamespaces = new Set(['all', 'default']);
    releases.forEach((r) => uniqueNamespaces.add(r.namespace));
    return Array.from(uniqueNamespaces);
  }, [releases]);

  // Filter releases based on search and namespace
  const filteredReleases = releases.filter((release) => {
    const matchesSearch =
    release.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    release.chart.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNamespace = selectedNamespace === 'all' || release.namespace === selectedNamespace;
    return matchesSearch && matchesNamespace;
  });

  const handleRefresh = async () => {
    await refresh();
    toast.success('Refreshed', 'Helm releases updated');
  };

  const handleUpgrade = async (release) => {
    try {
      const response = await helmApi.upgradeRelease(release.namespace, release.name, {
        chart: release.chart,
        reuse_values: true
      });
      if (response.data.success) {
        toast.success('Upgrade Started', `Upgrading ${release.name}`);
        refresh();
      } else {
        toast.error('Upgrade Failed', response.data.message || `Failed to upgrade ${release.name}`);
      }
    } catch (err) {
      logger.error('Failed to upgrade release', err);
      const errorMessage = err.response?.data?.detail || err.message || `Failed to upgrade ${release.name}`;
      toast.error('Upgrade Failed', errorMessage);
    }
  };

  const handleDelete = async (release) => {
    if (!confirm(`Are you sure you want to delete release "${release.name}"?`)) return;
    try {
      const response = await helmApi.uninstallRelease(release.namespace, release.name);
      if (response.data.success) {
        toast.success('Deleted', `Release ${release.name} deleted`);
        refresh();
      } else {
        toast.error('Delete Failed', response.data.message || `Failed to delete ${release.name}`);
      }
    } catch (err) {
      logger.error('Failed to delete release', err);
      const errorMessage = err.response?.data?.detail || err.message || `Failed to delete ${release.name}`;
      toast.error('Delete Failed', errorMessage);
    }
  };


  // Calculate stats
  const stats = {
    total: filteredReleases.length,
    deployed: filteredReleases.filter((r) => r.status === 'deployed').length,
    failed: filteredReleases.filter((r) => r.status === 'failed').length,
    pending: filteredReleases.filter((r) => r.status.startsWith('pending')).length
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "flex flex-col h-[calc(100vh-6.5rem)] overflow-hidden bg-gray-50 dark:bg-slate-900", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex-shrink-0", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600", children: /*#__PURE__*/
            _jsxDEV(CubeIcon, { className: "h-6 w-6 text-white" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h1", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Helm Releases" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Manage and monitor your deployments" }, void 0, false

            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV(motion.button, {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          onClick: () => navigate('/deploy/helm/catalog'),
          className: "flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:shadow-lg transition-all", children: [/*#__PURE__*/

          _jsxDEV(PlusIcon, { className: "h-5 w-5" }, void 0, false), "Install Chart"] }, void 0, true

        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "px-6 py-4 grid grid-cols-4 gap-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex-shrink-0", children: [/*#__PURE__*/
        _jsxDEV(motion.div, {
          whileHover: { y: -2 },
          className: "p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-xs font-medium text-blue-600 dark:text-blue-400 uppercase", children: "Total" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1", children: stats.total }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(CubeIcon, { className: "h-8 w-8 text-blue-500 opacity-50" }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/

        _jsxDEV(motion.div, {
          whileHover: { y: -2 },
          className: "p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-xs font-medium text-green-600 dark:text-green-400 uppercase", children: "Deployed" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-2xl font-bold text-green-900 dark:text-green-100 mt-1", children: stats.deployed }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(CheckCircleIcon, { className: "h-8 w-8 text-green-500 opacity-50" }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/

        _jsxDEV(motion.div, {
          whileHover: { y: -2 },
          className: "p-4 rounded-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-xs font-medium text-red-600 dark:text-red-400 uppercase", children: "Failed" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-2xl font-bold text-red-900 dark:text-red-100 mt-1", children: stats.failed }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(XCircleIcon, { className: "h-8 w-8 text-red-500 opacity-50" }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/

        _jsxDEV(motion.div, {
          whileHover: { y: -2 },
          className: "p-4 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-xs font-medium text-amber-600 dark:text-amber-400 uppercase", children: "Pending" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-2xl font-bold text-amber-900 dark:text-amber-100 mt-1", children: stats.pending }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(ClockIcon, { className: "h-8 w-8 text-amber-500 opacity-50" }, void 0, false)] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "px-6 py-3 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700 flex-shrink-0", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex-1 relative", children: [/*#__PURE__*/
            _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              placeholder: "Search releases by name or chart...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV(Dropdown, {
            label: "",
            value: selectedNamespace,
            options: namespaces,
            onChange: setSelectedNamespace }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            onClick: handleRefresh,
            disabled: loading,
            className: "p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50", children: /*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `h-5 w-5 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}` }, void 0, false) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ),


      error && /*#__PURE__*/
      _jsxDEV("div", { className: "mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex-shrink-0", children: /*#__PURE__*/
        _jsxDEV("p", { className: "text-sm text-red-600 dark:text-red-400", children: error.message }, void 0, false) }, void 0, false
      ), /*#__PURE__*/



      _jsxDEV("div", { className: "flex-1 overflow-auto p-6", children:
        loading && filteredReleases.length === 0 ? /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-center h-full", children: /*#__PURE__*/
          _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
            _jsxDEV(ArrowPathIcon, { className: "h-12 w-12 text-gray-400 animate-spin mx-auto mb-4" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children: "Loading releases..." }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ) :
        filteredReleases.length === 0 ? /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-center h-full", children: /*#__PURE__*/
          _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
            _jsxDEV(CubeIcon, { className: "h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" }, void 0, false), /*#__PURE__*/
            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2", children: "No releases found" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-4", children:
              searchQuery ? 'Try adjusting your search' : 'Get started by installing a chart' }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              onClick: () => navigate('/deploy/helm/catalog'),
              className: "px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:shadow-lg transition-all", children:
              "Install Your First Chart" }, void 0, false

            )] }, void 0, true
          ) }, void 0, false
        ) : /*#__PURE__*/

        _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children:
          filteredReleases.map((release, index) => /*#__PURE__*/
          _jsxDEV(motion.div, {

            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: index * 0.05 },
            whileHover: { y: -4 },
            className: "bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-all", children: [/*#__PURE__*/


            _jsxDEV("div", { className: "flex items-start justify-between mb-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white truncate", children: release.name }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5", children: release.chart }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV(HelmStatusBadge, { status: release.status }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "space-y-2 mb-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between text-xs", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Namespace" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium", children:
                  release.namespace }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between text-xs", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Version" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-900 dark:text-white font-medium", children: release.chart_version }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between text-xs", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Updated" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-900 dark:text-white font-medium", children: formatAge(release.updated) }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                onClick: () => navigate(`/deploy/helm/workspace/${release.namespace}/${release.name}`),
                className: "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors", children: [/*#__PURE__*/

                _jsxDEV(EyeIcon, { className: "h-3.5 w-3.5" }, void 0, false), "View"] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                onClick: () => handleUpgrade(release),
                className: "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors", children: [/*#__PURE__*/

                _jsxDEV(ArrowUpTrayIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Upgrade"] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                onClick: () => handleDelete(release),
                className: "p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors",
                title: "Delete", children: /*#__PURE__*/

                _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
              )] }, void 0, true
            )] }, `${release.namespace}/${release.name}`, true
          )
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}
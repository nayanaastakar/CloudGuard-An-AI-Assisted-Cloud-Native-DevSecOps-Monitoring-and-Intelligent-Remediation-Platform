import { useState, useRef, useEffect } from 'react';
import { useCluster } from '../../contexts/ClusterContext';
import { logger } from '../../utils/logger';
import {
  ServerStackIcon,
  CheckIcon,
  ChevronDownIcon } from
'@heroicons/react/24/outline';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

export default function ClusterSwitcher() {
  const { clusters, activeCluster, loading, setActiveCluster } = useCluster();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClusterSwitch = async (clusterId) => {
    if (clusterId === activeCluster?.id) {
      setIsOpen(false);
      return;
    }

    try {
      setSwitching(true);
      await setActiveCluster(clusterId);
      setIsOpen(false);
      // Optionally refresh the page or trigger a global state refresh
      window.location.reload();
    } catch (error) {
      logger.error('Failed to switch cluster', error);
    } finally {
      setSwitching(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'disconnected':
        return 'bg-gray-400';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  if (loading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
        _jsxDEV(ServerStackIcon, { className: "h-5 w-5 animate-pulse" }, void 0, false), /*#__PURE__*/
        _jsxDEV("span", { children: "Loading..." }, void 0, false)] }, void 0, true
      ));

  }

  if (clusters.length === 0) {
    return null;
  }

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "relative", ref: dropdownRef, children: [/*#__PURE__*/
      _jsxDEV("button", {
        onClick: () => setIsOpen(!isOpen),
        disabled: switching,
        className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200", children: [/*#__PURE__*/

        _jsxDEV(ServerStackIcon, { className: "h-5 w-5" }, void 0, false), /*#__PURE__*/
        _jsxDEV("span", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV("span", {
            className: `h-2 w-2 rounded-full ${getStatusColor(activeCluster?.status || 'unknown')}` }, void 0, false
          ),
          activeCluster?.name || 'Select Cluster'] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV(ChevronDownIcon, {
          className: `h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}` }, void 0, false
        )] }, void 0, true
      ),

      isOpen && /*#__PURE__*/
      _jsxDEV("div", { className: "absolute top-full left-0 mt-1 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600 z-50", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "p-2 border-b border-gray-100 dark:border-slate-700", children: /*#__PURE__*/
          _jsxDEV("p", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2", children: "Kubernetes Clusters" }, void 0, false

          ) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "max-h-80 overflow-y-auto py-1", children:
          clusters.map((cluster) => /*#__PURE__*/
          _jsxDEV("button", {

            onClick: () => handleClusterSwitch(cluster.id),
            disabled: switching,
            className: `w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
            cluster.id === activeCluster?.id ?
            'bg-primary-50 dark:bg-primary-900/30' :
            ''}`, children: [/*#__PURE__*/


            _jsxDEV("span", {
              className: `h-2.5 w-2.5 rounded-full ${getStatusColor(cluster.status)}` }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex-1 text-left", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children:
                  cluster.name }, void 0, false
                ),
                cluster.is_default && /*#__PURE__*/
                _jsxDEV("span", { className: "text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300", children: "Default" }, void 0, false

                )] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV("div", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children: [
                cluster.version && /*#__PURE__*/
                _jsxDEV("span", { className: "mr-3", children: cluster.version }, void 0, false), /*#__PURE__*/

                _jsxDEV("span", { children: [cluster.node_count, " nodes"] }, void 0, true), /*#__PURE__*/
                _jsxDEV("span", { className: "mx-1", children: "•" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { children: [cluster.namespace_count, " namespaces"] }, void 0, true)] }, void 0, true
              )] }, void 0, true
            ),
            cluster.id === activeCluster?.id && /*#__PURE__*/
            _jsxDEV(CheckIcon, { className: "h-5 w-5 text-primary-600 dark:text-primary-400" }, void 0, false)] }, cluster.id, true

          )
          ) }, void 0, false
        )] }, void 0, true
      )] }, void 0, true

    ));

}
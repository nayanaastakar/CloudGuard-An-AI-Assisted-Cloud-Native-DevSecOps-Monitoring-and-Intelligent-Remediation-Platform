import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  CubeIcon,
  ServerStackIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  TagIcon } from
'@heroicons/react/24/outline';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";








































// No mock data - workload must be provided via props

const tabs = [
{ id: 'overview', label: 'Overview' },
{ id: 'pods', label: 'Pods' },
{ id: 'containers', label: 'Containers' },
{ id: 'events', label: 'Events' },
{ id: 'yaml', label: 'YAML' }];


export default function WorkloadDrawer({ workload, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState(['labels', 'conditions']);

  // Return empty drawer if no workload provided
  if (!workload) {
    return (/*#__PURE__*/
      _jsxDEV(AnimatePresence, { children:
        isOpen && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { x: '100%' },
          animate: { x: 0 },
          exit: { x: '100%' },
          transition: { type: 'spring', damping: 25, stiffness: 300 },
          className: "fixed right-0 top-0 h-screen w-[600px] max-w-full bg-white dark:bg-slate-800 shadow-2xl z-50 overflow-hidden", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
            _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Workload Details" }, void 0, false), /*#__PURE__*/
            _jsxDEV("button", { onClick: onClose, className: "p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: /*#__PURE__*/
              _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-center h-64 text-gray-500 dark:text-gray-400", children: "No workload selected" }, void 0, false

          )] }, void 0, true
        ) }, void 0, false

      ));

  }

  const toggleSection = (section) => {
    setExpandedSections((prev) =>
    prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'running':
      case 'succeeded':
      case 'true':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'degraded':
      case 'failed':
      case 'terminated':
      case 'false':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'progressing':
      case 'pending':
      case 'waiting':
        return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getResourcePercentage = (usage, limit) => {
    const parseValue = (val) => {
      if (val.endsWith('m')) return parseInt(val) / 1000;
      if (val.endsWith('Mi')) return parseInt(val);
      if (val.endsWith('Gi')) return parseInt(val) * 1024;
      return parseInt(val);
    };
    const usageVal = parseValue(usage);
    const limitVal = parseValue(limit);
    return Math.round(usageVal / limitVal * 100);
  };

  return (/*#__PURE__*/
    _jsxDEV(AnimatePresence, { children:
      isOpen && /*#__PURE__*/
      _jsxDEV(_Fragment, { children: [/*#__PURE__*/

        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 bg-black/30 backdrop-blur-sm z-50",
          onClick: onClose }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV(motion.div, {
          initial: { x: '100%' },
          animate: { x: 0 },
          exit: { x: '100%' },
          transition: { type: 'spring', damping: 25, stiffness: 200 },
          className: "fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-hidden flex flex-col", children: [/*#__PURE__*/


          _jsxDEV("div", { className: "flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30", children: /*#__PURE__*/
                _jsxDEV(ServerStackIcon, { className: "h-6 w-6 text-blue-600 dark:text-blue-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: workload.name }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
                  _jsxDEV("span", { children: workload.kind }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { children: "/" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { children: workload.namespace }, void 0, false)] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                className: "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400",
                title: "Refresh", children: /*#__PURE__*/

                _jsxDEV(ArrowPathIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                className: "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400",
                title: "Open in new tab", children: /*#__PURE__*/

                _jsxDEV(ArrowTopRightOnSquareIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                onClick: onClose,
                className: "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400", children: /*#__PURE__*/

                _jsxDEV(XMarkIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700", children: /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
                _jsxDEV("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(workload.status)}`, children: [
                  workload.status === 'Healthy' ? /*#__PURE__*/
                  _jsxDEV(CheckCircleIcon, { className: "h-4 w-4" }, void 0, false) : /*#__PURE__*/

                  _jsxDEV(ExclamationTriangleIcon, { className: "h-4 w-4" }, void 0, false),

                  workload.status] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
                  workload.replicas.ready, "/", workload.replicas.desired, " replicas ready"] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  className: "px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600", children:
                  "Scale" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  className: "px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500 text-white hover:bg-amber-600", children:
                  "Restart" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  className: "px-3 py-1.5 text-xs font-medium rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20", children:
                  "Delete" }, void 0, false

                )] }, void 0, true
              )] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "px-4 border-b border-gray-200 dark:border-slate-700", children: /*#__PURE__*/
            _jsxDEV("div", { className: "flex gap-1", children:
              tabs.map((tab) => /*#__PURE__*/
              _jsxDEV("button", {

                onClick: () => setActiveTab(tab.id),
                className: `px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id ?
                'border-blue-500 text-blue-600 dark:text-blue-400' :
                'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`, children:


                tab.label }, tab.id, false
              )
              ) }, void 0, false
            ) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
            activeTab === 'overview' && /*#__PURE__*/
            _jsxDEV(_Fragment, { children: [/*#__PURE__*/

              _jsxDEV("div", { className: "grid grid-cols-4 gap-3", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-center", children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: workload.replicas.ready }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Ready Pods" }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-center", children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: workload.containers.length }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Containers" }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-center", children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: workload.pods.reduce((acc, p) => acc + p.restarts, 0) }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Restarts" }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-center", children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: workload.age }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Age" }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden", children: [/*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => toggleSection('labels'),
                  className: "w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800", children: [/*#__PURE__*/

                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV(TagIcon, { className: "h-4 w-4 text-gray-500" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Labels" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "px-1.5 py-0.5 text-xs rounded bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400", children:
                      Object.keys(workload.labels).length }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV(ChevronDownIcon, { className: `h-4 w-4 text-gray-400 transition-transform ${expandedSections.includes('labels') ? 'rotate-180' : ''}` }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV(AnimatePresence, { children:
                  expandedSections.includes('labels') && /*#__PURE__*/
                  _jsxDEV(motion.div, {
                    initial: { height: 0, opacity: 0 },
                    animate: { height: 'auto', opacity: 1 },
                    exit: { height: 0, opacity: 0 },
                    className: "overflow-hidden", children: /*#__PURE__*/

                    _jsxDEV("div", { className: "p-3 flex flex-wrap gap-2", children:
                      Object.entries(workload.labels).map(([key, value]) => /*#__PURE__*/
                      _jsxDEV("span", { className: "inline-flex items-center px-2 py-1 text-xs rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300", children: [/*#__PURE__*/
                        _jsxDEV("span", { className: "font-medium", children: key }, void 0, false), /*#__PURE__*/
                        _jsxDEV("span", { className: "mx-1", children: "=" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("span", { children: value }, void 0, false)] }, key, true
                      )
                      ) }, void 0, false
                    ) }, void 0, false
                  ) }, void 0, false

                )] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden", children: [/*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => toggleSection('conditions'),
                  className: "w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800", children: [/*#__PURE__*/

                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-gray-500" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Conditions" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV(ChevronDownIcon, { className: `h-4 w-4 text-gray-400 transition-transform ${expandedSections.includes('conditions') ? 'rotate-180' : ''}` }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV(AnimatePresence, { children:
                  expandedSections.includes('conditions') && /*#__PURE__*/
                  _jsxDEV(motion.div, {
                    initial: { height: 0, opacity: 0 },
                    animate: { height: 'auto', opacity: 1 },
                    exit: { height: 0, opacity: 0 },
                    className: "overflow-hidden", children: /*#__PURE__*/

                    _jsxDEV("div", { className: "p-3 space-y-2", children:
                      workload.conditions.map((condition, index) => /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-start gap-3 p-2 rounded-lg bg-gray-50 dark:bg-slate-800/30", children: [/*#__PURE__*/
                        _jsxDEV("span", { className: `mt-0.5 px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(condition.status)}`, children:
                          condition.status }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
                          _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: condition.type }, void 0, false), /*#__PURE__*/
                          _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 truncate", children: condition.message }, void 0, false), /*#__PURE__*/
                          _jsxDEV("p", { className: "text-xs text-gray-400 dark:text-gray-500 mt-1", children: condition.lastTransition }, void 0, false)] }, void 0, true
                        )] }, index, true
                      )
                      ) }, void 0, false
                    ) }, void 0, false
                  ) }, void 0, false

                )] }, void 0, true
              )] }, void 0, true
            ),


            activeTab === 'pods' && /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-3", children:
              workload.pods.map((pod) => /*#__PURE__*/
              _jsxDEV("div", {

                className: "p-4 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer", children: [/*#__PURE__*/

                _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV(CubeIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: pod.name }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(pod.status)}`, children:
                    pod.status }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "grid grid-cols-4 gap-4 text-xs text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-gray-400 dark:text-gray-500", children: "IP" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "font-mono", children: pod.ip }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-gray-400 dark:text-gray-500", children: "Node" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { children: pod.node }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-gray-400 dark:text-gray-500", children: "Restarts" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { children: pod.restarts }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-gray-400 dark:text-gray-500", children: "Age" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { children: pod.age }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                )] }, pod.name, true
              )
              ) }, void 0, false
            ),


            activeTab === 'containers' && /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-4", children:
              workload.containers.map((container) => /*#__PURE__*/
              _jsxDEV("div", {

                className: "p-4 rounded-xl border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/

                _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV(CubeIcon, { className: "h-5 w-5 text-blue-500" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: container.name }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusColor(container.status)}`, children:
                    container.status }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mb-4 font-mono bg-gray-50 dark:bg-slate-800/50 p-2 rounded-lg truncate", children:
                  container.image }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center justify-between mb-1", children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "CPU" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs font-medium text-gray-700 dark:text-gray-300", children: [
                        container.cpu.usage, " / ", container.cpu.limit] }, void 0, true
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /*#__PURE__*/
                      _jsxDEV("div", {
                        className: "h-full bg-blue-500 rounded-full",
                        style: { width: `${getResourcePercentage(container.cpu.usage, container.cpu.limit)}%` } }, void 0, false
                      ) }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center justify-between mb-1", children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Memory" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs font-medium text-gray-700 dark:text-gray-300", children: [
                        container.memory.usage, " / ", container.memory.limit] }, void 0, true
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /*#__PURE__*/
                      _jsxDEV("div", {
                        className: "h-full bg-purple-500 rounded-full",
                        style: { width: `${getResourcePercentage(container.memory.usage, container.memory.limit)}%` } }, void 0, false
                      ) }, void 0, false
                    )] }, void 0, true
                  )] }, void 0, true
                )] }, container.name, true
              )
              ) }, void 0, false
            ),


            activeTab === 'events' && /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-2", children:
              workload.events.map((event, index) => /*#__PURE__*/
              _jsxDEV("div", {

                className: `p-3 rounded-xl border ${
                event.type === 'Warning' ?
                'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10' :
                'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50'}`, children: /*#__PURE__*/


                _jsxDEV("div", { className: "flex items-start gap-3", children: [
                  event.type === 'Warning' ? /*#__PURE__*/
                  _jsxDEV(ExclamationTriangleIcon, { className: "h-5 w-5 text-amber-500 flex-shrink-0" }, void 0, false) : /*#__PURE__*/

                  _jsxDEV(CheckCircleIcon, { className: "h-5 w-5 text-green-500 flex-shrink-0" }, void 0, false), /*#__PURE__*/

                  _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: event.reason }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs text-gray-400", children: event.time }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: event.message }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                ) }, index, false
              )
              ) }, void 0, false
            ),


            activeTab === 'yaml' && /*#__PURE__*/
            _jsxDEV("div", { className: "rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-700 overflow-hidden", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-3 bg-slate-800 dark:bg-slate-900 border-b border-slate-700 flex items-center justify-between", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-xs font-medium text-slate-400", children: "YAML Manifest" }, void 0, false), /*#__PURE__*/
                _jsxDEV("button", { className: "p-1.5 rounded-lg hover:bg-slate-700 text-slate-400", children: /*#__PURE__*/
                  _jsxDEV(DocumentDuplicateIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("pre", { className: "p-4 text-xs text-slate-300 overflow-x-auto font-mono", children:
                `apiVersion: apps/v1
kind: ${workload.kind}
metadata:
  name: ${workload.name}
  namespace: ${workload.namespace}
  labels:
${Object.entries(workload.labels).map(([k, v]) => `    ${k}: ${v}`).join('\n')}
spec:
  replicas: ${workload.replicas.desired}
  selector:
    matchLabels:
      app: ${workload.labels.app || workload.name}
  template:
    spec:
      containers:
${workload.containers.map((c) => `      - name: ${c.name}
        image: ${c.image}
        resources:
          requests:
            cpu: ${c.cpu.request}
            memory: ${c.memory.request}
          limits:
            cpu: ${c.cpu.limit}
            memory: ${c.memory.limit}`).join('\n')}` }, void 0, false
              )] }, void 0, true
            )] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false

    ));

}

export { WorkloadDrawer };
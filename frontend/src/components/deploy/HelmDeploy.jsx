import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import * as yaml from 'js-yaml';



import {
  CubeIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon,
  ArrowUpTrayIcon,
  ArrowUturnLeftIcon,
  DocumentTextIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CodeBracketIcon,
  SparklesIcon,
  CloudArrowUpIcon } from
'@heroicons/react/24/outline';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";


















export default function HelmDeploy() {
  // State
  const [activeTab, setActiveTab] = useState('values');
  const [chartSource, setChartSource] = useState('repository');
  const [searchQuery, setSearchQuery] = useState('');
  const [chartSearchResults, setChartSearchResults] = useState([]);
  const [selectedChart, setSelectedChart] = useState(null);
  const [valuesYaml, setValuesYaml] = useState(`# Default values for the chart
replicaCount: 2

image:
  repository: nginx
  tag: stable
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

resources:
  limits:
    cpu: 100m
    memory: 128Mi
  requests:
    cpu: 100m
    memory: 128Mi
`);
  const [renderedOutput, setRenderedOutput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchingCharts, setSearchingCharts] = useState(false);

  // Mock data for demonstration
  const mockCharts = [
  {
    name: 'nginx',
    version: '15.0.2',
    app_version: '1.25.1',
    repository: 'bitnami',
    description: 'Fast, reliable NGINX chart for web serving and reverse proxy'
  },
  {
    name: 'postgresql',
    version: '12.2.3',
    app_version: '15.2.0',
    repository: 'bitnami',
    description: 'PostgreSQL database chart with replication support'
  },
  {
    name: 'kube-prometheus-stack',
    version: '56.2.3',
    app_version: '0.72.0',
    repository: 'prometheus-community',
    description: 'Complete monitoring stack with Prometheus, Grafana, and Alert Manager'
  },
  {
    name: 'redis',
    version: '17.9.4',
    app_version: '7.0.11',
    repository: 'bitnami',
    description: 'Redis in-memory data structure store'
  },
  {
    name: 'mysql',
    version: '9.7.1',
    app_version: '8.0.32',
    repository: 'bitnami',
    description: 'MySQL relational database management system'
  }];


  const mockMetadata = {
    name: 'nginx',
    version: '15.0.2',
    appVersion: '1.23.1',
    description: 'NGINX Open Source is a web server that can be also used as a reverse proxy, load balancer, and HTTP cache',
    maintainers: 'Bitnami'
  };

  const mockReleaseHistory = [
  { version: 'v1.0.3', status: 'Success', time: '5h ago' },
  { version: 'v1.0.2', status: 'Failed', time: '1d ago' },
  { version: 'v1.0.1', status: 'Success', time: '3d ago' }];


  useEffect(() => {
    setChartSearchResults(mockCharts);
  }, []);

  useEffect(() => {
    // Parse YAML when it changes
    try {
      const parsed = yaml.loadAll(valuesYaml);
      setRenderedOutput(parsed);
    } catch (error) {
      setRenderedOutput([]);
    }
  }, [valuesYaml]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setChartSearchResults(mockCharts);
      return;
    }

    setSearchingCharts(true);
    // Simulate search
    setTimeout(() => {
      const filtered = mockCharts.filter((chart) =>
      chart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chart.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setChartSearchResults(filtered);
      setSearchingCharts(false);
    }, 500);
  };

  const handleInstall = async () => {
    if (!selectedChart) return;
    setLoading(true);
    // Simulate installation
    setTimeout(() => {
      setLoading(false);
      alert(`Installing ${selectedChart.name} v${selectedChart.version}`);
    }, 1500);
  };

  const handleUpgrade = async () => {
    if (!selectedChart) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Upgrading ${selectedChart.name}`);
    }, 1500);
  };

  const handleRollback = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Rolling back to previous version');
    }, 1500);
  };

  const tabs = [
  { id: 'values', name: 'Values.yaml', icon: DocumentTextIcon },
  { id: 'rendered', name: 'Rendered Templates', icon: EyeIcon },
  { id: 'diff', name: 'Diff', icon: CodeBracketIcon },
  { id: 'history', name: 'History', icon: ClockIcon }];


  const chartSourceTabs = [
  { id: 'repository', name: 'Repository' },
  { id: 'uploaded', name: 'Uploaded' },
  { id: 'private', name: 'Private' }];


  return (/*#__PURE__*/
    _jsxDEV("div", { className: "flex flex-col h-[calc(100vh-6rem)]", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-gray-50 to-white dark:from-slate-900 dark:to-slate-800", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md", children: /*#__PURE__*/
            _jsxDEV(CubeIcon, { className: "h-5 w-5 text-white" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Helm Deploy" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Manage and deploy Helm charts" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: handleInstall,
            disabled: !selectedChart || loading,
            className: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all", children: [/*#__PURE__*/

            _jsxDEV(RocketLaunchIcon, { className: "h-4 w-4" }, void 0, false), "Install"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: handleUpgrade,
            disabled: !selectedChart || loading,
            className: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all", children: [/*#__PURE__*/

            _jsxDEV(ArrowUpTrayIcon, { className: "h-4 w-4" }, void 0, false), "Upgrade"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: handleRollback,
            disabled: loading,
            className: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all", children: [/*#__PURE__*/

            _jsxDEV(ArrowUturnLeftIcon, { className: "h-4 w-4" }, void 0, false), "Rollback"] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800", children:
        tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (/*#__PURE__*/
            _jsxDEV(motion.button, {

              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: () => setActiveTab(tab.id),
              className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive ?
              'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md' :
              'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`, children: [/*#__PURE__*/


              _jsxDEV(tab.icon, { className: "h-4 w-4" }, void 0, false),
              tab.name] }, tab.id, true
            ));

        }) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex-1 flex overflow-hidden", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "w-80 flex flex-col border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "p-3 border-b border-gray-200 dark:border-slate-700", children: /*#__PURE__*/
            _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
              _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                placeholder: "Search charts...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                onKeyDown: (e) => e.key === 'Enter' && handleSearch(),
                className: "w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all" }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "flex items-center gap-1 px-3 py-2 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900", children:
            chartSourceTabs.map((tab) => {
              const isActive = chartSource === tab.id;
              return (/*#__PURE__*/
                _jsxDEV("button", {

                  onClick: () => setChartSource(tab.id),
                  className: `flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive ?
                  'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' :
                  'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`, children:


                  tab.name }, tab.id, false
                ));

            }) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "flex-1 overflow-y-auto p-3 space-y-2", children:
            searchingCharts ? /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-center py-12", children: /*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: "h-6 w-6 animate-spin text-primary-500" }, void 0, false) }, void 0, false
            ) :
            chartSearchResults.length === 0 ? /*#__PURE__*/
            _jsxDEV("div", { className: "text-center py-12", children: [/*#__PURE__*/
              _jsxDEV(MagnifyingGlassIcon, { className: "h-8 w-8 mx-auto text-gray-400 mb-2" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "No charts found" }, void 0, false)] }, void 0, true
            ) :

            chartSearchResults.map((chart, index) => /*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: index * 0.05 },
              onClick: () => setSelectedChart(chart),
              className: `p-3 rounded-lg cursor-pointer transition-all border ${
              selectedChart?.name === chart.name ?
              'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700 shadow-sm' :
              'bg-gray-50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800/50'}`, children: [/*#__PURE__*/


              _jsxDEV("div", { className: "flex items-start justify-between mb-2", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "p-1 rounded bg-gradient-to-br from-blue-500 to-purple-600", children: /*#__PURE__*/
                      _jsxDEV(CubeIcon, { className: "h-3 w-3 text-white" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: [
                      chart.repository, "/", chart.name] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400 ml-6", children: ["v",
                    chart.version] }, void 0, true
                  )] }, void 0, true
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-600 dark:text-gray-400 line-clamp-2", children:
                chart.description }, void 0, false
              )] }, `${chart.repository}-${chart.name}`, true
            )
            ) }, void 0, false

          ), /*#__PURE__*/


          _jsxDEV("div", { className: "p-3 border-t border-gray-200 dark:border-slate-700", children: /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              className: "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all", children: [/*#__PURE__*/

              _jsxDEV(CloudArrowUpIcon, { className: "h-4 w-4" }, void 0, false), "Upload Chart (.tgz)"] }, void 0, true

            ) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "flex-1 flex flex-col bg-[#1e1e1e]", children: /*#__PURE__*/
          _jsxDEV(AnimatePresence, { mode: "wait", children: [
            activeTab === 'values' && /*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "h-full", children: /*#__PURE__*/

              _jsxDEV(Editor, {
                height: "100%",
                defaultLanguage: "yaml",
                value: valuesYaml,
                onChange: (value) => setValuesYaml(value || ''),
                theme: "vs-dark",
                options: {
                  minimap: { enabled: true },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                  fontLigatures: true,
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  renderLineHighlight: 'all',
                  padding: { top: 16, bottom: 16 }
                } }, void 0, false
              ) }, "values", false
            ),


            activeTab === 'rendered' && /*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "h-full overflow-auto p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900", children:

              renderedOutput.length > 0 ? /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-4", children:
                renderedOutput.map((doc, idx) => /*#__PURE__*/
                _jsxDEV(motion.div, {

                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: idx * 0.1 },
                  className: "p-4 rounded-xl bg-slate-800/50 border border-slate-700", children: [/*#__PURE__*/

                  _jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm font-bold text-gray-200", children: ["Document ", idx + 1] }, void 0, true), /*#__PURE__*/
                    _jsxDEV("span", { className: "px-3 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white", children: "Rendered" }, void 0, false

                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("pre", { className: "text-xs text-gray-300 font-mono whitespace-pre-wrap overflow-x-auto bg-slate-900/80 p-3 rounded-lg border border-slate-700", children:
                    JSON.stringify(doc, null, 2) }, void 0, false
                  )] }, idx, true
                )
                ) }, void 0, false
              ) : /*#__PURE__*/

              _jsxDEV("div", { className: "flex flex-col items-center justify-center h-full", children: [/*#__PURE__*/
                _jsxDEV(EyeIcon, { className: "h-16 w-16 text-slate-600 mb-4" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-base font-bold text-gray-300", children: "No rendered output" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 mt-2", children: "Enter valid YAML in Values.yaml tab" }, void 0, false)] }, void 0, true
              ) }, "rendered", false

            ),


            activeTab === 'diff' && /*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-8", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 mb-6 border border-amber-500/20", children: /*#__PURE__*/
                _jsxDEV(CodeBracketIcon, { className: "h-16 w-16 text-amber-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("h3", { className: "text-xl font-semibold text-white mb-3", children: "Diff View" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-400 text-center max-w-md", children: "Compare your local values with deployed chart values" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("div", { className: "mt-6 flex items-center gap-3", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "px-4 py-2 rounded-lg bg-slate-800 border border-slate-700", children: /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs font-medium text-gray-300", children: "Side-by-side comparison" }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "px-4 py-2 rounded-lg bg-slate-800 border border-slate-700", children: /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs font-medium text-gray-300", children: "Line-by-line diff" }, void 0, false) }, void 0, false
                )] }, void 0, true
              )] }, "diff", true
            ),


            activeTab === 'history' && /*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              className: "h-full overflow-auto p-4 bg-gradient-to-br from-slate-900 to-slate-800", children: /*#__PURE__*/

              _jsxDEV("div", { className: "max-w-2xl mx-auto space-y-3", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [/*#__PURE__*/
                  _jsxDEV(ClockIcon, { className: "h-5 w-5 text-gray-400" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("h3", { className: "text-base font-semibold text-white", children: "Deployment History" }, void 0, false)] }, void 0, true
                ),
                mockReleaseHistory.map((release, idx) => /*#__PURE__*/
                _jsxDEV(motion.div, {

                  initial: { opacity: 0, x: -10 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: idx * 0.1 },
                  className: "flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-all", children: [/*#__PURE__*/

                  _jsxDEV("div", { className: "flex items-center gap-3", children: [
                    release.status === 'Success' && /*#__PURE__*/
                    _jsxDEV(CheckCircleIcon, { className: "h-5 w-5 text-green-400" }, void 0, false),

                    release.status === 'Failed' && /*#__PURE__*/
                    _jsxDEV(XCircleIcon, { className: "h-5 w-5 text-red-400" }, void 0, false),

                    release.status === 'Pending' && /*#__PURE__*/
                    _jsxDEV(ExclamationTriangleIcon, { className: "h-5 w-5 text-amber-400" }, void 0, false), /*#__PURE__*/

                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm font-semibold text-gray-200", children: release.version }, void 0, false), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-xs text-gray-500", children: release.time }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("span", { className: `px-3 py-1 text-xs font-medium rounded-lg ${
                    release.status === 'Success' ?
                    'bg-green-500/10 text-green-400 border border-green-500/20' :
                    release.status === 'Failed' ?
                    'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`, children:

                    release.status }, void 0, false
                  )] }, idx, true
                )
                )] }, void 0, true
              ) }, "history", false
            )] }, void 0, true

          ) }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "w-72 flex flex-col border-l border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "px-4 py-3 border-b border-gray-200 dark:border-slate-700", children: /*#__PURE__*/
            _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: "Chart Metadata" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children:
            selectedChart ? /*#__PURE__*/
            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-4 rounded-xl bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/10 dark:to-purple-900/10 border border-primary-200 dark:border-primary-800/30", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-3 mb-3", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-md", children: /*#__PURE__*/
                    _jsxDEV(CubeIcon, { className: "h-5 w-5 text-white" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                    _jsxDEV("h4", { className: "text-sm font-bold text-gray-900 dark:text-white", children: mockMetadata.name }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: ["v", mockMetadata.version] }, void 0, true)] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "space-y-2 text-xs", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "text-gray-600 dark:text-gray-400", children: "App Version:" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: mockMetadata.appVersion }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                    _jsxDEV("span", { className: "text-gray-600 dark:text-gray-400", children: "Maintainers:" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: mockMetadata.maintainers }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("h4", { className: "text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2", children: "Description" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-600 dark:text-gray-400 leading-relaxed", children:
                  mockMetadata.description }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("h4", { className: "text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(ClockIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Release History"] }, void 0, true

                ), /*#__PURE__*/
                _jsxDEV("div", { className: "space-y-2", children:
                  mockReleaseHistory.map((release, idx) => /*#__PURE__*/
                  _jsxDEV(motion.div, {

                    initial: { opacity: 0, x: -10 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: idx * 0.1 },
                    className: "flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/

                    _jsxDEV("div", { className: "flex items-center gap-2", children: [
                      release.status === 'Success' && /*#__PURE__*/
                      _jsxDEV(CheckCircleIcon, { className: "h-3.5 w-3.5 text-green-500" }, void 0, false),

                      release.status === 'Failed' && /*#__PURE__*/
                      _jsxDEV(XCircleIcon, { className: "h-3.5 w-3.5 text-red-500" }, void 0, false),

                      release.status === 'Pending' && /*#__PURE__*/
                      _jsxDEV(ArrowPathIcon, { className: "h-3.5 w-3.5 text-amber-500 animate-spin" }, void 0, false), /*#__PURE__*/

                      _jsxDEV("span", { className: "text-xs font-medium text-gray-900 dark:text-white", children:
                        release.version }, void 0, false
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children:
                      release.time }, void 0, false
                    )] }, idx, true
                  )
                  ) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/

              _jsxDEV("div", { className: "p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                  _jsxDEV(SparklesIcon, { className: "h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs font-semibold text-blue-900 dark:text-blue-200 mb-1", children: "AI Recommendations" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-[10px] text-blue-700 dark:text-blue-300", children: "Optimize resource limits for production workload" }, void 0, false

                    )] }, void 0, true
                  )] }, void 0, true
                ) }, void 0, false
              )] }, void 0, true
            ) : /*#__PURE__*/

            _jsxDEV("div", { className: "flex flex-col items-center justify-center h-full text-center", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-4 rounded-xl bg-gray-100 dark:bg-slate-900/50 mb-3", children: /*#__PURE__*/
                _jsxDEV(CubeIcon, { className: "h-8 w-8 text-gray-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: "Select a chart to view metadata" }, void 0, false

              )] }, void 0, true
            ) }, void 0, false

          )] }, void 0, true
        )] }, void 0, true
      )] }, void 0, true
    ));

}
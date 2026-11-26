import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowPathIcon, ChartBarIcon, CpuChipIcon, ServerStackIcon } from '@heroicons/react/24/outline';
import { kubernetesApi } from '../../services/api';
import GlassCard from '../common/GlassCard';


// Import shared constants
import { containerVariants, itemVariants } from '../../utils/constants';

// Progress bar component
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";function Progress({ value }) {
  const color = value >= 90 ? 'bg-red-500' : value >= 70 ? 'bg-amber-500' : 'bg-primary-500';
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "h-1.5 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { width: 0 },
        animate: { width: `${Math.min(value, 100)}%` },
        transition: { duration: 0.5, ease: 'easeOut' },
        className: `h-full rounded-full ${color}` }, void 0, false
      ) }, void 0, false
    ));

}

function parseMemoryToMi(mem) {
  if (!mem) return 0;
  const value = parseInt(mem);
  if (mem.includes('Gi')) return value * 1024;
  if (mem.includes('Mi')) return value;
  if (mem.includes('Ki')) return value / 1024;
  return value / (1024 * 1024);
}

function parseCpuToMillicores(cpu) {
  if (!cpu) return 0;
  return parseInt(cpu.replace('m', '')) || 0;
}

export default function ClusterMetrics() {
  const [clusterMetrics, setClusterMetrics] = useState(null);
  const [podMetrics, setPodMetrics] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedNamespace]);

  async function fetchData() {
    setLoading(true);
    try {
      const [metricsRes, podMetricsRes, nsRes] = await Promise.all([
      kubernetesApi.getClusterMetrics().catch(() => null),
      kubernetesApi.getPodMetrics(selectedNamespace || undefined).catch(() => ({ data: [] })),
      kubernetesApi.getNamespaces().catch(() => ({ data: [] }))]
      );
      if (metricsRes?.data) setClusterMetrics(metricsRes.data);
      setPodMetrics(podMetricsRes.data);
      setNamespaces(nsRes.data);
      setError(null);
    } catch {
      setError('Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }

  const topPodsByCpu = [...podMetrics].
  sort((a, b) => parseCpuToMillicores(b.total_cpu) - parseCpuToMillicores(a.total_cpu)).
  slice(0, 5);

  const topPodsByMemory = [...podMetrics].
  sort((a, b) => parseMemoryToMi(b.total_memory) - parseMemoryToMi(a.total_memory)).
  slice(0, 5);

  const namespaceStats = Object.entries(
    podMetrics.reduce((acc, pod) => {
      if (!acc[pod.namespace]) acc[pod.namespace] = { cpu: 0, memory: 0, pods: 0 };
      acc[pod.namespace].cpu += parseCpuToMillicores(pod.total_cpu);
      acc[pod.namespace].memory += parseMemoryToMi(pod.total_memory);
      acc[pod.namespace].pods += 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1].cpu - a[1].cpu).slice(0, 6);

  const maxCpu = topPodsByCpu[0] ? parseCpuToMillicores(topPodsByCpu[0].total_cpu) : 1;
  const maxMem = topPodsByMemory[0] ? parseMemoryToMi(topPodsByMemory[0].total_memory) : 1;

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      variants: containerVariants,
      initial: "hidden",
      animate: "visible",
      className: "space-y-6", children: [/*#__PURE__*/


      _jsxDEV(motion.div, {
        variants: itemVariants,
        className: "sticky top-16 z-30 -mx-4 lg:-mx-8 px-4 lg:px-8 py-4 bg-gray-50/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/

        _jsxDEV("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30", children: /*#__PURE__*/
              _jsxDEV(ChartBarIcon, { className: "h-6 w-6 text-primary-600 dark:text-primary-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h1", { className: "text-xl font-semibold text-gray-800 dark:text-gray-100", children: "Cluster Metrics" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 text-sm", children: "Resource usage and performance" }, void 0, false

              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
              _jsxDEV("select", {
                value: selectedNamespace,
                onChange: (e) => setSelectedNamespace(e.target.value),
                className: "appearance-none pl-4 pr-10 py-2.5 text-sm border border-gray-200/50 dark:border-slate-600/50 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 shadow-sm hover:border-primary-300 dark:hover:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer", children: [/*#__PURE__*/

                _jsxDEV("option", { value: "", children: "All namespaces" }, void 0, false),
                namespaces.map((ns) => /*#__PURE__*/
                _jsxDEV("option", { value: ns.name, children: ns.name }, ns.name, false)
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "absolute inset-y-0 right-3 flex items-center pointer-events-none", children: /*#__PURE__*/
                _jsxDEV("svg", { className: "h-4 w-4 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /*#__PURE__*/
                  _jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }, void 0, false) }, void 0, false
                ) }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: fetchData,
              disabled: loading,
              className: "flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 disabled:opacity-50", children: [/*#__PURE__*/

              _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${loading ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        error && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 }, children: /*#__PURE__*/

          _jsxDEV(GlassCard, { className: "border-amber-200 dark:border-amber-500/20 p-4", children: /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-amber-600 dark:text-amber-400", children: [
              error, ". Make sure metrics-server is installed."] }, void 0, true
            ) }, void 0, false
          ) }, void 0, false
        ) }, void 0, false

      ),


      clusterMetrics && /*#__PURE__*/
      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [/*#__PURE__*/
          _jsxDEV(GlassCard, { className: "p-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3 mb-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-2 rounded-xl bg-blue-100 dark:bg-blue-500/10", children: /*#__PURE__*/
                _jsxDEV(CpuChipIcon, { className: "h-5 w-5 text-blue-600 dark:text-blue-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "CPU" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-2xl font-semibold text-gray-900 dark:text-white mb-2", children: [clusterMetrics.cpu_percent, "%"] }, void 0, true), /*#__PURE__*/
            _jsxDEV(Progress, { value: clusterMetrics.cpu_percent }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-400 mt-2", children: [clusterMetrics.total_cpu_usage, " / ", clusterMetrics.total_cpu_capacity] }, void 0, true)] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV(GlassCard, { className: "p-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3 mb-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-2 rounded-xl bg-purple-100 dark:bg-purple-500/10", children: /*#__PURE__*/
                _jsxDEV(ChartBarIcon, { className: "h-5 w-5 text-purple-600 dark:text-purple-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Memory" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-2xl font-semibold text-gray-900 dark:text-white mb-2", children: [clusterMetrics.memory_percent, "%"] }, void 0, true), /*#__PURE__*/
            _jsxDEV(Progress, { value: clusterMetrics.memory_percent }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-400 mt-2", children: [clusterMetrics.total_memory_usage, " / ", clusterMetrics.total_memory_capacity] }, void 0, true)] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV(GlassCard, { className: "p-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3 mb-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-2 rounded-xl bg-green-100 dark:bg-green-500/10", children: /*#__PURE__*/
                _jsxDEV(ServerStackIcon, { className: "h-5 w-5 text-green-600 dark:text-green-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Nodes" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-2xl font-semibold text-gray-900 dark:text-white", children: clusterMetrics.nodes?.length || 0 }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV(GlassCard, { className: "p-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3 mb-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-2 rounded-xl bg-primary-100 dark:bg-primary-500/10", children: /*#__PURE__*/
                _jsxDEV("svg", { className: "h-5 w-5 text-primary-600 dark:text-primary-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /*#__PURE__*/
                  _jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" }, void 0, false) }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Pods" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-2xl font-semibold text-gray-900 dark:text-white", children: podMetrics.length }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/



      _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [/*#__PURE__*/

        _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
          _jsxDEV(GlassCard, { variant: "hover", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-1.5 rounded-lg bg-blue-100 dark:bg-blue-500/10", children: /*#__PURE__*/
                _jsxDEV(CpuChipIcon, { className: "h-4 w-4 text-blue-600 dark:text-blue-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("h2", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100", children: "Top CPU Consumers" }, void 0, false)] }, void 0, true
            ),
            topPodsByCpu.length === 0 ? /*#__PURE__*/
            _jsxDEV("div", { className: "text-center py-8", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-3 rounded-xl bg-gray-100 dark:bg-slate-800 w-fit mx-auto mb-3", children: /*#__PURE__*/
                _jsxDEV(CpuChipIcon, { className: "h-8 w-8 text-gray-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "No data available" }, void 0, false)] }, void 0, true
            ) : /*#__PURE__*/

            _jsxDEV("div", { className: "space-y-3", children:
              topPodsByCpu.map((pod, index) => {
                const cpu = parseCpuToMillicores(pod.total_cpu);
                return (/*#__PURE__*/
                  _jsxDEV(motion.div, {

                    initial: { opacity: 0, x: -10 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: index * 0.05 },
                    className: "p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50", children: [/*#__PURE__*/

                    _jsxDEV("div", { className: "flex items-center justify-between text-sm mb-2", children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "text-gray-700 dark:text-gray-300 truncate max-w-[70%] font-medium", title: pod.name, children:
                        pod.name }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400 font-mono text-xs bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg", children: [cpu, "m"] }, void 0, true)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV(Progress, { value: cpu / maxCpu * 100 }, void 0, false)] }, pod.name, true
                  ));

              }) }, void 0, false
            )] }, void 0, true

          ) }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
          _jsxDEV(GlassCard, { variant: "hover", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-1.5 rounded-lg bg-purple-100 dark:bg-purple-500/10", children: /*#__PURE__*/
                _jsxDEV(ChartBarIcon, { className: "h-4 w-4 text-purple-600 dark:text-purple-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("h2", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100", children: "Top Memory Consumers" }, void 0, false)] }, void 0, true
            ),
            topPodsByMemory.length === 0 ? /*#__PURE__*/
            _jsxDEV("div", { className: "text-center py-8", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-3 rounded-xl bg-gray-100 dark:bg-slate-800 w-fit mx-auto mb-3", children: /*#__PURE__*/
                _jsxDEV(ChartBarIcon, { className: "h-8 w-8 text-gray-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "No data available" }, void 0, false)] }, void 0, true
            ) : /*#__PURE__*/

            _jsxDEV("div", { className: "space-y-3", children:
              topPodsByMemory.map((pod, index) => {
                const mem = parseMemoryToMi(pod.total_memory);
                return (/*#__PURE__*/
                  _jsxDEV(motion.div, {

                    initial: { opacity: 0, x: -10 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: index * 0.05 },
                    className: "p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50", children: [/*#__PURE__*/

                    _jsxDEV("div", { className: "flex items-center justify-between text-sm mb-2", children: [/*#__PURE__*/
                      _jsxDEV("span", { className: "text-gray-700 dark:text-gray-300 truncate max-w-[70%] font-medium", title: pod.name, children:
                        pod.name }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400 font-mono text-xs bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg", children: [Math.round(mem), " Mi"] }, void 0, true)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV(Progress, { value: mem / maxMem * 100 }, void 0, false)] }, pod.name, true
                  ));

              }) }, void 0, false
            )] }, void 0, true

          ) }, void 0, false
        )] }, void 0, true
      ),


      namespaceStats.length > 0 && /*#__PURE__*/
      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV(GlassCard, { variant: "hover", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-1.5 rounded-lg bg-primary-100 dark:bg-primary-500/10", children: /*#__PURE__*/
              _jsxDEV("svg", { className: "h-4 w-4 text-primary-600 dark:text-primary-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /*#__PURE__*/
                _jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" }, void 0, false) }, void 0, false
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("h2", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100", children: "Resource Usage by Namespace" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
            _jsxDEV("table", { className: "w-full text-sm", children: [/*#__PURE__*/
              _jsxDEV("thead", { children: /*#__PURE__*/
                _jsxDEV("tr", { className: "text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-700", children: [/*#__PURE__*/
                  _jsxDEV("th", { className: "pb-3 font-semibold", children: "Namespace" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "pb-3 font-semibold text-right", children: "CPU" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "pb-3 font-semibold text-right", children: "Memory" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "pb-3 font-semibold text-right", children: "Pods" }, void 0, false)] }, void 0, true
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("tbody", { className: "divide-y divide-gray-50 dark:divide-slate-700/50", children:
                namespaceStats.map(([name, stats], index) => /*#__PURE__*/
                _jsxDEV(motion.tr, {

                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { delay: index * 0.05 },
                  className: "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors", children: [/*#__PURE__*/

                  _jsxDEV("td", { className: "py-3 font-medium", children: name }, void 0, false), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-3 text-right", children: /*#__PURE__*/
                    _jsxDEV("span", { className: "font-mono text-xs bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg", children: [stats.cpu, "m"] }, void 0, true) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-3 text-right", children: /*#__PURE__*/
                    _jsxDEV("span", { className: "font-mono text-xs bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg", children: [Math.round(stats.memory), " Mi"] }, void 0, true) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-3 text-right", children: /*#__PURE__*/
                    _jsxDEV("span", { className: "text-xs bg-primary-100 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-lg font-medium", children: stats.pods }, void 0, false) }, void 0, false
                  )] }, name, true
                )
                ) }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/



      _jsxDEV(AnimatePresence, { children:
        loading && !clusterMetrics && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "text-center py-12", children: [/*#__PURE__*/

          _jsxDEV(ArrowPathIcon, { className: "h-8 w-8 mx-auto animate-spin text-primary-500" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "mt-3 text-sm text-gray-500 dark:text-gray-400", children: "Loading metrics..." }, void 0, false)] }, void 0, true
        ) }, void 0, false

      ),


      !loading && !clusterMetrics && podMetrics.length === 0 && !error && /*#__PURE__*/
      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV(GlassCard, { className: "text-center py-12", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-3 rounded-xl bg-gray-100 dark:bg-slate-800 w-fit mx-auto mb-3", children: /*#__PURE__*/
            _jsxDEV(ChartBarIcon, { className: "h-8 w-8 text-gray-400" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "No metrics available. Install metrics-server." }, void 0, false)] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true

    ));

}
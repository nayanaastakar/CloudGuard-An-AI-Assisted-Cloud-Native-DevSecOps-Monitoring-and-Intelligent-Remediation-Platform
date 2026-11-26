import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ServerIcon,
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  GlobeAltIcon } from
'@heroicons/react/24/outline';
import { prometheusApi, getTargetHealthColor, getRelativeTime } from '../../services/prometheusApi';
import { logger } from '../../utils/logger';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";


const healthIcon = (health) => {
  switch (health.toLowerCase()) {
    case 'up':
      return /*#__PURE__*/_jsxDEV(CheckCircleIcon, { className: "h-5 w-5 text-green-500" }, void 0, false);
    case 'down':
      return /*#__PURE__*/_jsxDEV(XCircleIcon, { className: "h-5 w-5 text-red-500" }, void 0, false);
    default:
      return /*#__PURE__*/_jsxDEV(QuestionMarkCircleIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false);
  }
};

export default function TargetsView() {
  const [targetGroups, setTargetGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [healthFilter, setHealthFilter] = useState('all');
  const [expandedJobs, setExpandedJobs] = useState(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [downCount, setDownCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await prometheusApi.getTargets();
      const data = response.data;
      setTargetGroups(data.targets || []);
      setActiveCount(data.active_count || 0);
      setDownCount(data.down_count || 0);
      setError(null);

      // Auto-expand all jobs on first load
      if (expandedJobs.size === 0 && data.targets.length > 0) {
        setExpandedJobs(new Set(data.targets.map((t) => t.job)));
      }
    } catch (err) {
      logger.error('Failed to fetch targets', err);
      setError('Failed to load scrape targets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [expandedJobs.size]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const toggleJob = (jobName) => {
    setExpandedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobName)) {
        newSet.delete(jobName);
      } else {
        newSet.add(jobName);
      }
      return newSet;
    });
  };

  // Filter targets
  const filteredGroups = targetGroups.map((group) => {
    const filteredTargets = group.targets.filter((target) => {
      const matchesSearch = searchQuery === '' ||
      target.instance.toLowerCase().includes(searchQuery.toLowerCase()) ||
      target.job.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(target.labels).some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesHealth = healthFilter === 'all' || target.health === healthFilter;

      return matchesSearch && matchesHealth;
    });

    return {
      ...group,
      targets: filteredTargets,
      active_count: filteredTargets.filter((t) => t.health === 'up').length,
      down_count: filteredTargets.filter((t) => t.health === 'down').length
    };
  }).filter((group) => group.targets.length > 0);

  if (loading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center h-64", children: /*#__PURE__*/
        _jsxDEV(ArrowPathIcon, { className: "h-8 w-8 animate-spin text-purple-500" }, void 0, false) }, void 0, false
      ));

  }

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV(ServerIcon, { className: "h-7 w-7 text-purple-500" }, void 0, false), "Scrape Targets"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: "Monitor Prometheus scrape targets and their health status" }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: handleRefresh,
          disabled: refreshing,
          className: "flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50", children: [/*#__PURE__*/

          _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${refreshing ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-3 gap-4", children: [/*#__PURE__*/
        _jsxDEV(motion.div, {
          whileHover: { scale: 1.02 },
          className: "p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV(ServerIcon, { className: "h-8 w-8 text-purple-500" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-2xl font-bold text-purple-600 dark:text-purple-400", children:
                targetGroups.length }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Jobs" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/

        _jsxDEV(motion.div, {
          whileHover: { scale: 1.02 },
          className: "p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV(CheckCircleIcon, { className: "h-8 w-8 text-green-500" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: activeCount }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Targets Up" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/

        _jsxDEV(motion.div, {
          whileHover: { scale: 1.02 },
          className: "p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV(XCircleIcon, { className: "h-8 w-8 text-red-500" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-2xl font-bold text-red-600 dark:text-red-400", children: downCount }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Targets Down" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex flex-wrap items-center gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "relative flex-1 min-w-[200px]", children: [/*#__PURE__*/
          _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("input", {
            type: "text",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: "Search targets...",
            className: "w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400" }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV(FunnelIcon, { className: "h-5 w-5 text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("select", {
            value: healthFilter,
            onChange: (e) => setHealthFilter(e.target.value),
            className: "px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white text-sm", children: [/*#__PURE__*/

            _jsxDEV("option", { value: "all", children: "All Health" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "up", children: "Up" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "down", children: "Down" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "unknown", children: "Unknown" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ),

      error && /*#__PURE__*/
      _jsxDEV("div", { className: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400", children:
        error }, void 0, false
      ), /*#__PURE__*/



      _jsxDEV("div", { className: "space-y-4", children:
        filteredGroups.length === 0 ? /*#__PURE__*/
        _jsxDEV("div", { className: "text-center py-12", children: [/*#__PURE__*/
          _jsxDEV(ServerIcon, { className: "h-16 w-16 mx-auto text-gray-400 mb-4" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-lg font-medium text-gray-900 dark:text-white", children: "No Targets Found" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children:
            searchQuery || healthFilter !== 'all' ?
            'No targets match your filters' :
            'Prometheus is not scraping any targets' }, void 0, false
          )] }, void 0, true
        ) :

        filteredGroups.map((group) => /*#__PURE__*/
        _jsxDEV("div", {

          className: "border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden", children: [/*#__PURE__*/

          _jsxDEV("button", {
            onClick: () => toggleJob(group.job),
            className: "w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "flex items-center gap-3", children: [
              expandedJobs.has(group.job) ? /*#__PURE__*/
              _jsxDEV(ChevronDownIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) : /*#__PURE__*/

              _jsxDEV(ChevronRightIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false), /*#__PURE__*/

              _jsxDEV(ServerIcon, { className: "h-5 w-5 text-purple-500" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: group.job }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "flex items-center gap-1 px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full", children: [/*#__PURE__*/
                _jsxDEV(CheckCircleIcon, { className: "h-3 w-3" }, void 0, false),
                group.active_count, " up"] }, void 0, true
              ),
              group.down_count > 0 && /*#__PURE__*/
              _jsxDEV("span", { className: "flex items-center gap-1 px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full", children: [/*#__PURE__*/
                _jsxDEV(XCircleIcon, { className: "h-3 w-3" }, void 0, false),
                group.down_count, " down"] }, void 0, true
              )] }, void 0, true

            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV(AnimatePresence, { children:
            expandedJobs.has(group.job) && /*#__PURE__*/
            _jsxDEV(motion.div, {
              initial: { height: 0, opacity: 0 },
              animate: { height: 'auto', opacity: 1 },
              exit: { height: 0, opacity: 0 },
              className: "overflow-hidden", children: /*#__PURE__*/

              _jsxDEV("div", { className: "divide-y divide-gray-200 dark:divide-slate-700", children:
                group.targets.map((target, idx) => /*#__PURE__*/
                _jsxDEV(TargetRow, { target: target }, `${target.instance}-${idx}`, false)
                ) }, void 0, false
              ) }, void 0, false
            ) }, void 0, false

          )] }, group.job, true
        )
        ) }, void 0, false

      )] }, void 0, true
    ));

}





function TargetRow({ target }) {
  const [expanded, setExpanded] = useState(false);

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "bg-white dark:bg-slate-800", children: [/*#__PURE__*/
      _jsxDEV("div", {
        onClick: () => setExpanded(!expanded),
        className: `flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 ${
        target.health === 'down' ? 'bg-red-50/50 dark:bg-red-900/5' : ''}`, children: [/*#__PURE__*/


        _jsxDEV("div", { className: "flex items-center gap-3", children: [
          healthIcon(target.health), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: target.instance }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full ${getTargetHealthColor(target.health)}`, children:
                target.health }, void 0, false
              )] }, void 0, true
            ),
            target.last_error && /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-red-500 mt-0.5 flex items-center gap-1", children: [/*#__PURE__*/
              _jsxDEV(ExclamationTriangleIcon, { className: "h-4 w-4" }, void 0, false),
              target.last_error] }, void 0, true
            )] }, void 0, true

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400", children: [
          target.last_scrape && /*#__PURE__*/
          _jsxDEV("span", { className: "flex items-center gap-1", children: [/*#__PURE__*/
            _jsxDEV(ClockIcon, { className: "h-4 w-4" }, void 0, false),
            getRelativeTime(target.last_scrape)] }, void 0, true
          ),

          target.last_scrape_duration && /*#__PURE__*/
          _jsxDEV("span", { children: [(target.last_scrape_duration * 1000).toFixed(0), "ms"] }, void 0, true),

          expanded ? /*#__PURE__*/
          _jsxDEV(ChevronDownIcon, { className: "h-5 w-5" }, void 0, false) : /*#__PURE__*/

          _jsxDEV(ChevronRightIcon, { className: "h-5 w-5" }, void 0, false)] }, void 0, true

        )] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV(AnimatePresence, { children:
        expanded && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { height: 0, opacity: 0 },
          animate: { height: 'auto', opacity: 1 },
          exit: { height: 0, opacity: 0 },
          className: "overflow-hidden border-t border-gray-100 dark:border-slate-700", children: /*#__PURE__*/

          _jsxDEV("div", { className: "p-4 bg-gray-50/50 dark:bg-slate-900/30 space-y-3", children: [

            target.scrape_url && /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 mb-1", children: "Scrape URL" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV(GlobeAltIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
                _jsxDEV("code", { className: "text-sm text-gray-900 dark:text-white font-mono", children:
                  target.scrape_url }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/



            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 mb-2", children: "Labels" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "flex flex-wrap gap-2", children:
                Object.entries(target.labels).map(([key, value]) => /*#__PURE__*/
                _jsxDEV("span", {

                  className: "px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 rounded text-gray-700 dark:text-gray-300", children: [/*#__PURE__*/

                  _jsxDEV("span", { className: "text-purple-600 dark:text-purple-400", children: key }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-gray-400 mx-1", children: "=" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { children: value }, void 0, false)] }, key, true
                )
                ) }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "grid grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Last Scrape" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children:
                  target.last_scrape ? new Date(target.last_scrape).toLocaleString() : 'N/A' }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Scrape Duration" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children:
                  target.last_scrape_duration ?
                  `${(target.last_scrape_duration * 1000).toFixed(2)}ms` :
                  'N/A' }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}
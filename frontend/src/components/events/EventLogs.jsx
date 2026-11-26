import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { kubernetesApi } from '../../services/api';
import PageHeader from '../common/PageHeader';
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  CubeIcon,
  ServerIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
  DocumentTextIcon,
  PlayIcon,
  PauseIcon,
  BellAlertIcon } from
'@heroicons/react/24/outline';

// Import shared constants

// Types
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";




















// Severity configuration
const severityConfig = {
  Warning: {
    icon: ExclamationTriangleIcon,
    color: 'text-amber-500',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    border: 'border-amber-200/50 dark:border-amber-800/50'
  },
  Normal: {
    icon: InformationCircleIcon,
    color: 'text-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-200/50 dark:border-blue-800/50'
  },
  Error: {
    icon: ExclamationCircleIcon,
    color: 'text-red-500',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-200/50 dark:border-red-800/50'
  }
};

// Time formatting
function formatTimeAgo(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString();
}

// Event Card Component
function EventCard({
  event,
  isExpanded,
  onToggle,
  index





}) {
  const config = severityConfig[event.type] || severityConfig.Normal;
  const Icon = config.icon;

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.2, delay: index * 0.03 },
      className: `bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border ${config.border} shadow-sm overflow-hidden transition-all duration-200`, children: [/*#__PURE__*/

      _jsxDEV("div", {
        className: "px-4 py-3 cursor-pointer hover:bg-white/90 dark:hover:bg-slate-700/50 transition-colors",
        onClick: onToggle, children: /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-start gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: `p-2 rounded-xl ${config.bg}`, children: /*#__PURE__*/
            _jsxDEV(Icon, { className: `h-4 w-4 ${config.color}` }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2 mb-1", children: [/*#__PURE__*/
              _jsxDEV("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full ${config.bg} ${config.color}`, children:
                event.type }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs font-medium text-gray-700 dark:text-gray-300", children: event.reason }, void 0, false),
              event.count > 1 && /*#__PURE__*/
              _jsxDEV("span", { className: "px-1.5 py-0.5 text-xs bg-gray-100/80 dark:bg-slate-700/80 text-gray-600 dark:text-gray-400 rounded-full", children: ["x",
                event.count] }, void 0, true
              )] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-900 dark:text-white line-clamp-2", children: event.message }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "flex items-center gap-1", children: [/*#__PURE__*/
                _jsxDEV(CubeIcon, { className: "h-3.5 w-3.5" }, void 0, false),
                event.involved_object.kind, "/", event.involved_object.name] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("span", { className: "flex items-center gap-1", children: [/*#__PURE__*/
                _jsxDEV(ServerIcon, { className: "h-3.5 w-3.5" }, void 0, false),
                event.namespace] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("span", { className: "flex items-center gap-1", children: [/*#__PURE__*/
                _jsxDEV(ClockIcon, { className: "h-3.5 w-3.5" }, void 0, false),
                formatTimeAgo(event.last_timestamp)] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("button", { className: "p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors", children:
            isExpanded ? /*#__PURE__*/
            _jsxDEV(ChevronDownIcon, { className: "h-5 w-5" }, void 0, false) : /*#__PURE__*/

            _jsxDEV(ChevronRightIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false

          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        isExpanded && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { height: 0, opacity: 0 },
          animate: { height: 'auto', opacity: 1 },
          exit: { height: 0, opacity: 0 },
          transition: { duration: 0.2 },
          className: "overflow-hidden", children: /*#__PURE__*/

          _jsxDEV("div", { className: "px-4 py-3 border-t border-gray-100/50 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-900/50", children: /*#__PURE__*/
            _jsxDEV("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mb-1", children: "Full Message" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-gray-900 dark:text-white", children: event.message }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mb-1", children: "First Seen" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-gray-900 dark:text-white", children: formatTimestamp(event.first_timestamp) }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mb-1", children: "Last Seen" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-gray-900 dark:text-white", children: formatTimestamp(event.last_timestamp) }, void 0, false)] }, void 0, true
                ),
                event.source && /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mb-1", children: "Source" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-gray-900 dark:text-white", children: [
                    event.source.component,
                    event.source.host && ` (${event.source.host})`] }, void 0, true
                  )] }, void 0, true
                )] }, void 0, true

              )] }, void 0, true
            ) }, void 0, false
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}

// Filter Badge Component
function FilterBadge({
  label,
  onRemove



}) {
  return (/*#__PURE__*/
    _jsxDEV("span", { className: "inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full", children: [
      label, /*#__PURE__*/
      _jsxDEV("button", { onClick: onRemove, className: "hover:text-blue-900 dark:hover:text-blue-200 transition-colors", children: /*#__PURE__*/
        _jsxDEV(XMarkIcon, { className: "h-3 w-3" }, void 0, false) }, void 0, false
      )] }, void 0, true
    ));

}

// Stats Card Component
function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  index






}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    yellow: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    green: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
  };

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.1 },
      className: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-slate-700/50 shadow-sm", children: /*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
        _jsxDEV("div", { className: `p-2.5 rounded-xl ${colorClasses[color]}`, children: /*#__PURE__*/
          _jsxDEV(Icon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: value }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: title }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Main Component
export default function EventLogs() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [namespaceFilter, setNamespaceFilter] = useState('all');
  const [namespaces, setNamespaces] = useState([]);
  const [expandedEvents, setExpandedEvents] = useState(new Set());
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Load namespaces
  useEffect(() => {
    kubernetesApi.getNamespaces().then((res) => {
      if (res.data) {
        setNamespaces(res.data.map((ns) => ns.name));
      }
    });
  }, []);

  // Load events
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const namespace = namespaceFilter !== 'all' ? namespaceFilter : undefined;
      const res = await kubernetesApi.getEvents(namespace);

      if (res.data) {
        // Transform API response to our format
        const transformedEvents = res.data.map((event) => ({
          uid: event.name + event.namespace,
          name: event.name,
          namespace: event.namespace,
          type: event.type || 'Normal',
          reason: event.reason,
          message: event.message,
          count: event.count || 1,
          first_timestamp: event.first_timestamp || new Date().toISOString(),
          last_timestamp: event.last_timestamp || new Date().toISOString(),
          involved_object: event.involved_object || { kind: 'Unknown', name: 'Unknown' },
          source: event.source
        }));

        // Sort by last timestamp descending
        transformedEvents.sort((a, b) =>
        new Date(b.last_timestamp).getTime() - new Date(a.last_timestamp).getTime()
        );

        setEvents(transformedEvents);
      }
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [namespaceFilter]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(loadEvents, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadEvents]);

  // Filter events
  const filteredEvents = events.filter((event) => {
    if (typeFilter !== 'all' && event.type !== typeFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.message.toLowerCase().includes(query) ||
        event.reason.toLowerCase().includes(query) ||
        event.involved_object.name.toLowerCase().includes(query) ||
        event.namespace.toLowerCase().includes(query));

    }
    return true;
  });

  // Calculate stats
  const stats = {
    total: events.length,
    normal: events.filter((e) => e.type === 'Normal').length,
    warning: events.filter((e) => e.type === 'Warning').length,
    lastHour: events.filter((e) => {
      const hourAgo = new Date();
      hourAgo.setHours(hourAgo.getHours() - 1);
      return new Date(e.last_timestamp) > hourAgo;
    }).length
  };

  // Toggle event expansion
  const toggleEvent = (uid) => {
    setExpandedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) {
        next.delete(uid);
      } else {
        next.add(uid);
      }
      return next;
    });
  };

  // Clear filters
  const hasActiveFilters = typeFilter !== 'all' || namespaceFilter !== 'all' || searchQuery !== '';

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

      _jsxDEV(PageHeader, {
        title: "Event Logs",
        description: "Real-time Kubernetes cluster events and notifications",
        icon: BellAlertIcon,
        iconColor: "purple",
        actions: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => setAutoRefresh(!autoRefresh),
            className: `flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
            autoRefresh ?
            'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-green-500/25' :
            'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`, children:


            autoRefresh ? /*#__PURE__*/
            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(PauseIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { children: "Live" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "ml-1 h-2 w-2 rounded-full bg-white animate-pulse" }, void 0, false)] }, void 0, true
            ) : /*#__PURE__*/

            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(PlayIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { children: "Auto-refresh" }, void 0, false)] }, void 0, true
            ) }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: loadEvents,
            disabled: loading,
            className: "p-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-all disabled:opacity-50", children: /*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `h-5 w-5 ${loading ? 'animate-spin' : ''}` }, void 0, false) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-4 gap-4", children: [/*#__PURE__*/
        _jsxDEV(StatsCard, { title: "Total Events", value: stats.total, icon: DocumentTextIcon, color: "blue", index: 0 }, void 0, false), /*#__PURE__*/
        _jsxDEV(StatsCard, { title: "Normal", value: stats.normal, icon: InformationCircleIcon, color: "green", index: 1 }, void 0, false), /*#__PURE__*/
        _jsxDEV(StatsCard, { title: "Warnings", value: stats.warning, icon: ExclamationTriangleIcon, color: "yellow", index: 2 }, void 0, false), /*#__PURE__*/
        _jsxDEV(StatsCard, { title: "Last Hour", value: stats.lastHour, icon: ClockIcon, color: "blue", index: 3 }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, delay: 0.4 },
        className: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-slate-700/50 p-4 shadow-sm", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex-1 relative", children: [/*#__PURE__*/
            _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              placeholder: "Search events by message, reason, resource...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "w-full pl-10 pr-4 py-2.5 bg-gray-50/80 dark:bg-slate-900/50 border border-gray-200/50 dark:border-slate-700/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("select", {
            value: typeFilter,
            onChange: (e) => setTypeFilter(e.target.value),
            className: "px-4 py-2.5 bg-gray-50/80 dark:bg-slate-900/50 border border-gray-200/50 dark:border-slate-700/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all", children: [/*#__PURE__*/

            _jsxDEV("option", { value: "all", children: "All Types" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "Normal", children: "Normal" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "Warning", children: "Warning" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("select", {
            value: namespaceFilter,
            onChange: (e) => setNamespaceFilter(e.target.value),
            className: "px-4 py-2.5 bg-gray-50/80 dark:bg-slate-900/50 border border-gray-200/50 dark:border-slate-700/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all", children: [/*#__PURE__*/

            _jsxDEV("option", { value: "all", children: "All Namespaces" }, void 0, false),
            namespaces.map((ns) => /*#__PURE__*/
            _jsxDEV("option", { value: ns, children: ns }, ns, false)
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV(AnimatePresence, { children:
          hasActiveFilters && /*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: 'auto' },
            exit: { opacity: 0, height: 0 },
            className: "flex items-center gap-2 mt-3 pt-3 border-t border-gray-100/50 dark:border-slate-700/50", children: [/*#__PURE__*/

            _jsxDEV(FunnelIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "text-xs text-gray-500", children: "Active filters:" }, void 0, false),
            typeFilter !== 'all' && /*#__PURE__*/
            _jsxDEV(FilterBadge, { label: `Type: ${typeFilter}`, onRemove: () => setTypeFilter('all') }, void 0, false),

            namespaceFilter !== 'all' && /*#__PURE__*/
            _jsxDEV(FilterBadge, { label: `Namespace: ${namespaceFilter}`, onRemove: () => setNamespaceFilter('all') }, void 0, false),

            searchQuery && /*#__PURE__*/
            _jsxDEV(FilterBadge, { label: `Search: "${searchQuery}"`, onRemove: () => setSearchQuery('') }, void 0, false)] }, void 0, true

          ) }, void 0, false

        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex items-center justify-between text-sm text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
        _jsxDEV("span", { children: ["Showing ",
          filteredEvents.length, " of ", events.length, " events"] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("span", { children: ["Last updated: ", lastRefresh.toLocaleTimeString()] }, void 0, true)] }, void 0, true
      ),


      error ? /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-xl p-4 text-red-700 dark:text-red-400", children: [/*#__PURE__*/

        _jsxDEV("p", { children: error }, void 0, false), /*#__PURE__*/
        _jsxDEV("button", { onClick: loadEvents, className: "mt-2 text-sm underline hover:no-underline", children: "Retry" }, void 0, false

        )] }, void 0, true
      ) :
      loading && events.length === 0 ? /*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center h-64", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3 text-gray-500", children: [/*#__PURE__*/
          _jsxDEV(ArrowPathIcon, { className: "h-5 w-5 animate-spin" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { children: "Loading events..." }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ) :
      filteredEvents.length === 0 ? /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-slate-700/50 p-8 text-center", children: [/*#__PURE__*/

        _jsxDEV(DocumentTextIcon, { className: "h-12 w-12 text-gray-400 mx-auto mb-3" }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children: "No events found" }, void 0, false),
        hasActiveFilters && /*#__PURE__*/
        _jsxDEV("p", { className: "text-sm text-gray-400 mt-1", children: "Try adjusting your filters" }, void 0, false)] }, void 0, true

      ) : /*#__PURE__*/

      _jsxDEV("div", { className: "space-y-3", children:
        filteredEvents.map((event, index) => /*#__PURE__*/
        _jsxDEV(EventCard, {

          event: event,
          isExpanded: expandedEvents.has(event.uid),
          onToggle: () => toggleEvent(event.uid),
          index: index }, event.uid, false
        )
        ) }, void 0, false
      )] }, void 0, true

    ));

}
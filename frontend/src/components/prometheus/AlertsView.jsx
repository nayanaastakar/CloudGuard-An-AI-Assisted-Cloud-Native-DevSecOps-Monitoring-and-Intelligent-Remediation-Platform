import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellAlertIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  FireIcon,
  ClockIcon,
  XMarkIcon,
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  BellSlashIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon } from
'@heroicons/react/24/outline';
import { prometheusApi, getSeverityColor, getRelativeTime } from '../../services/prometheusApi';
import { logger } from '../../utils/logger';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";








const SilenceModal = ({ alert, onClose, onSilence }) => {
  const [duration, setDuration] = useState('2h');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const now = new Date();
    const durationMs = parseDurationToMs(duration);
    const endsAt = new Date(now.getTime() + durationMs);

    const silence = {
      matchers: Object.entries(alert.labels).map(([name, value]) => ({
        name,
        value,
        isRegex: false
      })),
      starts_at: now.toISOString(),
      ends_at: endsAt.toISOString(),
      created_by: 'KubeSight User',
      comment: comment || `Silenced from KubeSight at ${now.toLocaleString()}`
    };

    await onSilence(silence);
    setLoading(false);
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm", children: /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        className: "bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
          _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Silence Alert" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", { onClick: onClose, className: "p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700", children: /*#__PURE__*/
            _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Alert" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
              _jsxDEV("p", { className: "font-medium text-gray-900 dark:text-white", children:
                alert.labels.alertname }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children:
                alert.annotations.summary || alert.annotations.description }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Duration" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("select", {
              value: duration,
              onChange: (e) => setDuration(e.target.value),
              className: "w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white", children: [/*#__PURE__*/

              _jsxDEV("option", { value: "30m", children: "30 minutes" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "1h", children: "1 hour" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "2h", children: "2 hours" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "4h", children: "4 hours" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "8h", children: "8 hours" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "24h", children: "24 hours" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "7d", children: "7 days" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Comment" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("textarea", {
              value: comment,
              onChange: (e) => setComment(e.target.value),
              placeholder: "Reason for silencing...",
              rows: 3,
              className: "w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "flex gap-3 pt-2", children: [/*#__PURE__*/
            _jsxDEV("button", {
              onClick: onClose,
              className: "flex-1 px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700", children:
              "Cancel" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: handleSubmit,
              disabled: loading,
              className: "flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2", children: [

              loading && /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Silence"] }, void 0, true

            )] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

};

const parseDurationToMs = (duration) => {
  const match = duration.match(/^(\d+)(m|h|d)$/);
  if (!match) return 2 * 60 * 60 * 1000; // Default 2h
  const value = parseInt(match[1]);
  const unit = match[2];
  const multipliers = { m: 60000, h: 3600000, d: 86400000 };
  return value * (multipliers[unit] || 3600000);
};

const severityIcon = (severity) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return /*#__PURE__*/_jsxDEV(FireIcon, { className: "h-5 w-5 text-red-500" }, void 0, false);
    case 'warning':
      return /*#__PURE__*/_jsxDEV(ExclamationTriangleIcon, { className: "h-5 w-5 text-amber-500" }, void 0, false);
    default:
      return /*#__PURE__*/_jsxDEV(InformationCircleIcon, { className: "h-5 w-5 text-blue-500" }, void 0, false);
  }
};

export default function AlertsView() {
  const [alerts, setAlerts] = useState([]);
  const [ruleGroups, setRuleGroups] = useState([]);
  const [silences, setSilences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('alerts');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('firing');
  const [silenceModal, setSilenceModal] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [alertsRes, rulesRes, silencesRes] = await Promise.all([
      prometheusApi.getAlerts(),
      prometheusApi.getRules(),
      prometheusApi.getSilences()]
      );

      setAlerts(alertsRes.data.alerts || []);
      setRuleGroups(rulesRes.data.groups || []);
      setSilences(silencesRes.data.silences || []);
      setError(null);
    } catch (err) {
      logger.error('Failed to fetch alert data', err);
      setError('Failed to load alert data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSilence = async (silence) => {
    try {
      await prometheusApi.createSilence(silence);
      setSilenceModal(null);
      fetchData();
    } catch (err) {
      logger.error('Failed to create silence', err);
    }
  };

  const handleDeleteSilence = async (silenceId) => {
    try {
      await prometheusApi.deleteSilence(silenceId);
      fetchData();
    } catch (err) {
      logger.error('Failed to delete silence', err);
    }
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = searchQuery === '' ||
    alert.labels.alertname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.annotations.summary?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'all' ||
    alert.labels.severity?.toLowerCase() === severityFilter;

    const matchesState = stateFilter === 'all' ||
    alert.state === stateFilter;

    return matchesSearch && matchesSeverity && matchesState;
  });

  // Count alerts by severity
  const alertCounts = {
    critical: alerts.filter((a) => a.labels.severity === 'critical' && a.state === 'firing').length,
    warning: alerts.filter((a) => a.labels.severity === 'warning' && a.state === 'firing').length,
    info: alerts.filter((a) => a.labels.severity === 'info' && a.state === 'firing').length,
    pending: alerts.filter((a) => a.state === 'pending').length
  };

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
            _jsxDEV(BellAlertIcon, { className: "h-7 w-7 text-purple-500" }, void 0, false), "Alerts & Rules"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: "Monitor active alerts, manage rules, and configure silences" }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: handleRefresh,
          disabled: refreshing,
          className: "flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50", children: [/*#__PURE__*/

          _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${refreshing ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [/*#__PURE__*/
        _jsxDEV(motion.div, {
          whileHover: { scale: 1.02 },
          className: "p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV(FireIcon, { className: "h-8 w-8 text-red-500" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-2xl font-bold text-red-600 dark:text-red-400", children: alertCounts.critical }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Critical" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/

        _jsxDEV(motion.div, {
          whileHover: { scale: 1.02 },
          className: "p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV(ExclamationTriangleIcon, { className: "h-8 w-8 text-amber-500" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-2xl font-bold text-amber-600 dark:text-amber-400", children: alertCounts.warning }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Warning" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/

        _jsxDEV(motion.div, {
          whileHover: { scale: 1.02 },
          className: "p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV(InformationCircleIcon, { className: "h-8 w-8 text-blue-500" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-2xl font-bold text-blue-600 dark:text-blue-400", children: alertCounts.info }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Info" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/

        _jsxDEV(motion.div, {
          whileHover: { scale: 1.02 },
          className: "p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV(ClockIcon, { className: "h-8 w-8 text-purple-500" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-2xl font-bold text-purple-600 dark:text-purple-400", children: alertCounts.pending }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Pending" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex items-center gap-4 border-b border-gray-200 dark:border-slate-700", children:
        [
        { id: 'alerts', label: 'Active Alerts', icon: BellAlertIcon, count: filteredAlerts.length },
        { id: 'rules', label: 'Alert Rules', icon: ExclamationTriangleIcon, count: ruleGroups.reduce((acc, g) => acc + g.rules.length, 0) },
        { id: 'silences', label: 'Silences', icon: BellSlashIcon, count: silences.filter((s) => s.status?.state === 'active').length }].
        map((tab) => /*#__PURE__*/
        _jsxDEV("button", {

          onClick: () => setView(tab.id),
          className: `flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
          view === tab.id ?
          'border-purple-500 text-purple-600 dark:text-purple-400' :
          'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`, children: [/*#__PURE__*/


          _jsxDEV(tab.icon, { className: "h-5 w-5" }, void 0, false),
          tab.label, /*#__PURE__*/
          _jsxDEV("span", { className: `px-2 py-0.5 text-xs rounded-full ${
            view === tab.id ?
            'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
            'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'}`, children:

            tab.count }, void 0, false
          )] }, tab.id, true
        )
        ) }, void 0, false
      ),


      view === 'alerts' && /*#__PURE__*/
      _jsxDEV("div", { className: "flex flex-wrap items-center gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "relative flex-1 min-w-[200px]", children: [/*#__PURE__*/
          _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("input", {
            type: "text",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: "Search alerts...",
            className: "w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400" }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV(FunnelIcon, { className: "h-5 w-5 text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("select", {
            value: severityFilter,
            onChange: (e) => setSeverityFilter(e.target.value),
            className: "px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white text-sm", children: [/*#__PURE__*/

            _jsxDEV("option", { value: "all", children: "All Severities" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "critical", children: "Critical" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "warning", children: "Warning" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "info", children: "Info" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("select", {
            value: stateFilter,
            onChange: (e) => setStateFilter(e.target.value),
            className: "px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white text-sm", children: [/*#__PURE__*/

            _jsxDEV("option", { value: "all", children: "All States" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "firing", children: "Firing" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "pending", children: "Pending" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ),


      error && /*#__PURE__*/
      _jsxDEV("div", { className: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400", children:
        error }, void 0, false
      ),



      view === 'alerts' && /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-3", children: /*#__PURE__*/
        _jsxDEV(AnimatePresence, { mode: "popLayout", children:
          filteredAlerts.length === 0 ? /*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "text-center py-12", children: [/*#__PURE__*/

            _jsxDEV(CheckCircleIcon, { className: "h-16 w-16 mx-auto text-green-500 mb-4" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-lg font-medium text-gray-900 dark:text-white", children: "All Clear!" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children: "No active alerts matching your filters" }, void 0, false)] }, void 0, true
          ) :

          filteredAlerts.map((alert, index) => /*#__PURE__*/
          _jsxDEV(motion.div, {

            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: { delay: index * 0.05 },
            className: `p-4 rounded-xl border ${
            alert.state === 'firing' ?
            alert.labels.severity === 'critical' ?
            'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50' :
            'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50' :
            'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/50'}`, children: /*#__PURE__*/


            _jsxDEV("div", { className: "flex items-start justify-between", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-start gap-3", children: [
                severityIcon(alert.labels.severity || 'info'), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children:
                      alert.labels.alertname }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full ${
                      alert.state === 'firing' ?
                      'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                      'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`, children:

                      alert.state }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full ${getSeverityColor(alert.labels.severity || 'info')}`, children:
                      alert.labels.severity || 'info' }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children:
                    alert.annotations.summary || alert.annotations.description }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex flex-wrap items-center gap-2 mt-2", children: [
                    alert.labels.namespace && /*#__PURE__*/
                    _jsxDEV("span", { className: "px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-700 rounded text-gray-600 dark:text-gray-400", children: ["ns: ",
                      alert.labels.namespace] }, void 0, true
                    ),

                    alert.labels.pod && /*#__PURE__*/
                    _jsxDEV("span", { className: "px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-700 rounded text-gray-600 dark:text-gray-400", children: ["pod: ",
                      alert.labels.pod] }, void 0, true
                    ),

                    alert.labels.instance && /*#__PURE__*/
                    _jsxDEV("span", { className: "px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-700 rounded text-gray-600 dark:text-gray-400", children:
                      alert.labels.instance }, void 0, false
                    ),

                    alert.active_at && /*#__PURE__*/
                    _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: ["Active ",
                      getRelativeTime(alert.active_at)] }, void 0, true
                    )] }, void 0, true

                  )] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => setSilenceModal(alert),
                className: "flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300", children: [/*#__PURE__*/

                _jsxDEV(BellSlashIcon, { className: "h-4 w-4" }, void 0, false), "Silence"] }, void 0, true

              )] }, void 0, true
            ) }, alert.fingerprint || index, false
          )
          ) }, void 0, false

        ) }, void 0, false
      ),



      view === 'rules' && /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-4", children:
        ruleGroups.map((group) => /*#__PURE__*/
        _jsxDEV("div", { className: "border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden", children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => toggleGroup(group.name),
            className: "w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "flex items-center gap-3", children: [
              expandedGroups.has(group.name) ? /*#__PURE__*/
              _jsxDEV(ChevronDownIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) : /*#__PURE__*/

              _jsxDEV(ChevronRightIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false), /*#__PURE__*/

              _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: group.name }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full", children: [
                group.rules.length, " rules"] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: group.file }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV(AnimatePresence, { children:
            expandedGroups.has(group.name) && /*#__PURE__*/
            _jsxDEV(motion.div, {
              initial: { height: 0, opacity: 0 },
              animate: { height: 'auto', opacity: 1 },
              exit: { height: 0, opacity: 0 },
              className: "overflow-hidden", children: /*#__PURE__*/

              _jsxDEV("div", { className: "divide-y divide-gray-200 dark:divide-slate-700", children:
                group.rules.map((rule, idx) => /*#__PURE__*/
                _jsxDEV("div", { className: "p-4 bg-white dark:bg-slate-800", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-start justify-between", children: /*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                        _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white", children: rule.name }, void 0, false),
                        rule.state && /*#__PURE__*/
                        _jsxDEV("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full ${
                          rule.state === 'firing' ?
                          'bg-red-100 dark:bg-red-900/30 text-red-600' :
                          rule.state === 'pending' ?
                          'bg-amber-100 dark:bg-amber-900/30 text-amber-600' :
                          'bg-green-100 dark:bg-green-900/30 text-green-600'}`, children:

                          rule.state }, void 0, false
                        ),

                        rule.labels.severity && /*#__PURE__*/
                        _jsxDEV("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full ${getSeverityColor(rule.labels.severity)}`, children:
                          rule.labels.severity }, void 0, false
                        )] }, void 0, true

                      ), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children:
                        rule.annotations.summary || rule.annotations.description }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("code", { className: "block mt-2 p-2 bg-gray-50 dark:bg-slate-900/50 rounded text-xs text-gray-600 dark:text-gray-400 font-mono", children:
                        rule.query }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
                        _jsxDEV("span", { children: ["For: ", rule.duration] }, void 0, true),
                        rule.alerts.length > 0 && /*#__PURE__*/
                        _jsxDEV("span", { className: "text-red-500", children: [rule.alerts.length, " firing"] }, void 0, true)] }, void 0, true

                      )] }, void 0, true
                    ) }, void 0, false
                  ) }, idx, false
                )
                ) }, void 0, false
              ) }, void 0, false
            ) }, void 0, false

          )] }, group.name, true
        )
        ) }, void 0, false
      ),



      view === 'silences' && /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-3", children:
        silences.length === 0 ? /*#__PURE__*/
        _jsxDEV("div", { className: "text-center py-12", children: [/*#__PURE__*/
          _jsxDEV(BellSlashIcon, { className: "h-16 w-16 mx-auto text-gray-400 mb-4" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-lg font-medium text-gray-900 dark:text-white", children: "No Active Silences" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children: "Silence alerts from the Active Alerts tab" }, void 0, false)] }, void 0, true
        ) :

        silences.map((silence) => /*#__PURE__*/
        _jsxDEV(motion.div, {

          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: `p-4 rounded-xl border ${
          silence.status?.state === 'active' ?
          'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/50' :
          'bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700'}`, children: /*#__PURE__*/


          _jsxDEV("div", { className: "flex items-start justify-between", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV(BellSlashIcon, { className: "h-5 w-5 text-purple-500" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full ${
                  silence.status?.state === 'active' ?
                  'bg-purple-100 dark:bg-purple-900/30 text-purple-600' :
                  'bg-gray-100 dark:bg-slate-700 text-gray-600'}`, children:

                  silence.status?.state || 'unknown' }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-2", children:
                silence.comment }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex flex-wrap gap-2 mt-2", children:
                silence.matchers.map((m, idx) => /*#__PURE__*/
                _jsxDEV("span", { className: "px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-700 rounded text-gray-600 dark:text-gray-400", children: [
                  m.name, "=", m.value] }, idx, true
                )
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
                _jsxDEV("span", { children: ["By: ", silence.created_by] }, void 0, true), /*#__PURE__*/
                _jsxDEV("span", { children: ["Ends: ", new Date(silence.ends_at).toLocaleString()] }, void 0, true)] }, void 0, true
              )] }, void 0, true
            ),
            silence.status?.state === 'active' && /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => handleDeleteSilence(silence.id),
              className: "p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg", children: /*#__PURE__*/

              _jsxDEV(XMarkIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
            )] }, void 0, true

          ) }, silence.id, false
        )
        ) }, void 0, false

      ),



      silenceModal && /*#__PURE__*/
      _jsxDEV(SilenceModal, {
        alert: silenceModal,
        onClose: () => setSilenceModal(null),
        onSilence: handleSilence }, void 0, false
      )] }, void 0, true

    ));

}
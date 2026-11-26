import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logger } from '../../utils/logger';
import {
  Cog6ToothIcon,
  SwatchIcon,
  WrenchScrewdriverIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  BellIcon,
  EnvelopeIcon } from
'@heroicons/react/24/outline';
import GlassCard from '../common/GlassCard';
import { settingsApi, UserSettingsResponse } from '../../services/api';

// Import shared constants
import { containerVariants, itemVariants } from '../../utils/constants';

// Tab configuration - Simplified to avoid duplication with sidebar navigation
// Clusters -> /clusters, Users -> /admin/users, API Keys -> /admin/api-keys
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";const tabs = [
{ id: 'themes', label: 'Themes', icon: SwatchIcon },
{ id: 'general', label: 'General', icon: WrenchScrewdriverIcon }];


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('themes');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data states
  const [, setUserSettings] = useState(null);

  // Local settings state (for editing before save)
  const [theme, setTheme] = useState('system');
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    inApp: true,
    deployments: true,
    alerts: true,
    security: true
  });
  const [generalSettings, setGeneralSettings] = useState({
    defaultNamespace: 'default',
    autoRefresh: true,
    refreshInterval: 30,
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD'
  });

  // Fetch data based on active tab
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Only themes and general tabs remain - both use user settings
      const settingsRes = await settingsApi.getUserSettings();
      setUserSettings(settingsRes.data);
      setTheme(settingsRes.data.theme);
      setNotifications(settingsRes.data.notifications);
      setGeneralSettings({
        defaultNamespace: settingsRes.data.default_namespace,
        autoRefresh: settingsRes.data.auto_refresh,
        refreshInterval: settingsRes.data.refresh_interval_seconds,
        timezone: settingsRes.data.timezone,
        dateFormat: settingsRes.data.date_format
      });
    } catch (err) {
      logger.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Save settings
  const saveSettings = async () => {
    setSaving(true);
    try {
      await settingsApi.updateUserSettings({
        theme,
        notifications,
        default_namespace: generalSettings.defaultNamespace,
        auto_refresh: generalSettings.autoRefresh,
        refresh_interval_seconds: generalSettings.refreshInterval,
        timezone: generalSettings.timezone,
        date_format: generalSettings.dateFormat
      });
    } catch (err) {
      logger.error('Failed to save settings', err);
    } finally {
      setSaving(false);
    }
  };

  // Reset settings
  const resetSettings = async () => {
    if (!confirm('Are you sure you want to reset all settings to default values?')) return;
    try {
      const response = await settingsApi.resetUserSettings();
      setUserSettings(response.data);
      setTheme(response.data.theme);
      setNotifications(response.data.notifications);
      setGeneralSettings({
        defaultNamespace: response.data.default_namespace,
        autoRefresh: response.data.auto_refresh,
        refreshInterval: response.data.refresh_interval_seconds,
        timezone: response.data.timezone,
        dateFormat: response.data.date_format
      });
    } catch (err) {
      logger.error('Failed to reset settings', err);
    }
  };

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      variants: containerVariants,
      initial: "hidden",
      animate: "visible",
      className: "space-y-6", children: [/*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, className: "flex items-center justify-between", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-2 rounded-xl bg-gradient-to-br from-slate-500/20 to-gray-500/20", children: /*#__PURE__*/
            _jsxDEV(Cog6ToothIcon, { className: "h-5 w-5 text-slate-600 dark:text-slate-400" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Settings" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500", children: "Manage appearance and preferences" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ),
        (activeTab === 'themes' || activeTab === 'general') && /*#__PURE__*/
        _jsxDEV(motion.button, {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          onClick: saveSettings,
          disabled: saving,
          className: "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 disabled:opacity-50", children:

          saving ? 'Saving...' : 'Save Changes' }, void 0, false
        )] }, void 0, true

      ), /*#__PURE__*/


      _jsxDEV(motion.div, { variants: itemVariants, children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex gap-2 border-b border-gray-200 dark:border-slate-700 pb-4 overflow-x-auto", children:
          tabs.map((tab) => /*#__PURE__*/
          _jsxDEV("button", {

            onClick: () => setActiveTab(tab.id),
            className: `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === tab.id ?
            'bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg' :
            'bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200/50 dark:border-slate-700/50'}`, children: [/*#__PURE__*/


            _jsxDEV(tab.icon, { className: "h-4 w-4" }, void 0, false),
            tab.label] }, tab.id, true
          )
          ) }, void 0, false
        ) }, void 0, false
      ),


      loading && /*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center h-64", children: /*#__PURE__*/
        _jsxDEV("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" }, void 0, false) }, void 0, false
      ),



      !loading && /*#__PURE__*/
      _jsxDEV(AnimatePresence, { mode: "wait", children: [

        activeTab === 'themes' && /*#__PURE__*/
        _jsxDEV(motion.div, {

          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          className: "space-y-6", children: [/*#__PURE__*/

          _jsxDEV(GlassCard, { className: "p-6", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-4", children: "Appearance" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "grid grid-cols-3 gap-4", children:
              [
              { id: 'light', label: 'Light', icon: SunIcon },
              { id: 'dark', label: 'Dark', icon: MoonIcon },
              { id: 'system', label: 'System', icon: ComputerDesktopIcon }].
              map((option) => /*#__PURE__*/
              _jsxDEV("button", {

                onClick: () => setTheme(option.id),
                className: `p-4 rounded-xl border-2 transition-all ${
                theme === option.id ?
                'border-blue-500 bg-blue-50 dark:bg-blue-500/10' :
                'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`, children: [/*#__PURE__*/


                _jsxDEV(option.icon, { className: `h-6 w-6 mx-auto mb-2 ${theme === option.id ? 'text-blue-500' : 'text-gray-400'}` }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: `text-sm font-medium ${theme === option.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`, children:
                  option.label }, void 0, false
                )] }, option.id, true
              )
              ) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV(GlassCard, { className: "p-6", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-4", children: "Notifications" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                  _jsxDEV(EnvelopeIcon, { className: "h-5 w-5 text-gray-400" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: "Email Notifications" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500", children: "Receive updates via email" }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => setNotifications((prev) => ({ ...prev, email: !prev.email })),
                  className: `relative w-11 h-6 rounded-full transition-colors ${notifications.email ? 'bg-blue-500' : 'bg-gray-300 dark:bg-slate-600'}`, children: /*#__PURE__*/

                  _jsxDEV("span", { className: `absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notifications.email ? 'translate-x-5' : ''}` }, void 0, false) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                  _jsxDEV(BellIcon, { className: "h-5 w-5 text-gray-400" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: "In-App Notifications" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-xs text-gray-500", children: "Show notifications in the app" }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => setNotifications((prev) => ({ ...prev, inApp: !prev.inApp })),
                  className: `relative w-11 h-6 rounded-full transition-colors ${notifications.inApp ? 'bg-blue-500' : 'bg-gray-300 dark:bg-slate-600'}`, children: /*#__PURE__*/

                  _jsxDEV("span", { className: `absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notifications.inApp ? 'translate-x-5' : ''}` }, void 0, false) }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          )] }, "themes", true
        ),



        activeTab === 'general' && /*#__PURE__*/
        _jsxDEV(motion.div, {

          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          className: "space-y-6", children: [/*#__PURE__*/

          _jsxDEV(GlassCard, { className: "p-6", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-4", children: "Default Settings" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "grid grid-cols-2 gap-6", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("label", { className: "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1", children: "Default Namespace" }, void 0, false), /*#__PURE__*/
                _jsxDEV("select", {
                  value: generalSettings.defaultNamespace,
                  onChange: (e) => setGeneralSettings((prev) => ({ ...prev, defaultNamespace: e.target.value })),
                  className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-700/50 rounded-xl bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300", children: [/*#__PURE__*/

                  _jsxDEV("option", { value: "default", children: "default" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("option", { value: "production", children: "production" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("option", { value: "staging", children: "staging" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("option", { value: "development", children: "development" }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("label", { className: "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1", children: "Timezone" }, void 0, false), /*#__PURE__*/
                _jsxDEV("select", {
                  value: generalSettings.timezone,
                  onChange: (e) => setGeneralSettings((prev) => ({ ...prev, timezone: e.target.value })),
                  className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-700/50 rounded-xl bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300", children: [/*#__PURE__*/

                  _jsxDEV("optgroup", { label: "Universal", children: /*#__PURE__*/
                    _jsxDEV("option", { value: "UTC", children: "UTC (Coordinated Universal Time)" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("optgroup", { label: "Americas", children: [/*#__PURE__*/
                    _jsxDEV("option", { value: "America/New_York", children: "Eastern Time (US & Canada)" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "America/Chicago", children: "Central Time (US & Canada)" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "America/Denver", children: "Mountain Time (US & Canada)" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "America/Los_Angeles", children: "Pacific Time (US & Canada)" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "America/Anchorage", children: "Alaska" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Pacific/Honolulu", children: "Hawaii" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "America/Toronto", children: "Toronto" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "America/Mexico_City", children: "Mexico City" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "America/Sao_Paulo", children: "Sao Paulo" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "America/Buenos_Aires", children: "Buenos Aires" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("optgroup", { label: "Europe", children: [/*#__PURE__*/
                    _jsxDEV("option", { value: "Europe/London", children: "London" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Europe/Paris", children: "Paris" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Europe/Berlin", children: "Berlin" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Europe/Amsterdam", children: "Amsterdam" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Europe/Madrid", children: "Madrid" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Europe/Rome", children: "Rome" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Europe/Moscow", children: "Moscow" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("optgroup", { label: "Asia", children: [/*#__PURE__*/
                    _jsxDEV("option", { value: "Asia/Dubai", children: "Dubai" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Asia/Kolkata", children: "India (IST)" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Asia/Singapore", children: "Singapore" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Asia/Hong_Kong", children: "Hong Kong" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Asia/Shanghai", children: "China (CST)" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Asia/Tokyo", children: "Tokyo" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Asia/Seoul", children: "Seoul" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Asia/Bangkok", children: "Bangkok" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Asia/Jakarta", children: "Jakarta" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("optgroup", { label: "Pacific & Oceania", children: [/*#__PURE__*/
                    _jsxDEV("option", { value: "Australia/Sydney", children: "Sydney" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Australia/Melbourne", children: "Melbourne" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Australia/Perth", children: "Perth" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Pacific/Auckland", children: "Auckland" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("optgroup", { label: "Africa & Middle East", children: [/*#__PURE__*/
                    _jsxDEV("option", { value: "Africa/Cairo", children: "Cairo" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Africa/Johannesburg", children: "Johannesburg" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Africa/Lagos", children: "Lagos" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { value: "Asia/Jerusalem", children: "Jerusalem" }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("label", { className: "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1", children: "Date Format" }, void 0, false), /*#__PURE__*/
                _jsxDEV("select", {
                  value: generalSettings.dateFormat,
                  onChange: (e) => setGeneralSettings((prev) => ({ ...prev, dateFormat: e.target.value })),
                  className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-700/50 rounded-xl bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300", children: [/*#__PURE__*/

                  _jsxDEV("option", { value: "YYYY-MM-DD", children: "YYYY-MM-DD" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("option", { value: "DD/MM/YYYY", children: "DD/MM/YYYY" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("option", { value: "MM/DD/YYYY", children: "MM/DD/YYYY" }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("label", { className: "block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1", children: "Auto-Refresh Interval" }, void 0, false), /*#__PURE__*/
                _jsxDEV("select", {
                  value: generalSettings.refreshInterval,
                  onChange: (e) => setGeneralSettings((prev) => ({ ...prev, refreshInterval: parseInt(e.target.value) })),
                  className: "w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-slate-700/50 rounded-xl bg-white/80 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300", children: [/*#__PURE__*/

                  _jsxDEV("option", { value: "15", children: "15 seconds" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("option", { value: "30", children: "30 seconds" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("option", { value: "60", children: "1 minute" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("option", { value: "300", children: "5 minutes" }, void 0, false)] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV(GlassCard, { className: "p-6", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-4", children: "Data & Storage" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: "Clear Local Cache" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500", children: "Remove cached data and refresh from server" }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: () => {
                    localStorage.clear();
                    window.location.reload();
                  },
                  className: "px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800", children: [/*#__PURE__*/

                  _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 inline mr-1.5" }, void 0, false), "Clear Cache"] }, void 0, true

                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-500/5", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm font-medium text-red-600 dark:text-red-400", children: "Danger Zone" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-red-500 dark:text-red-400/80", children: "Reset all settings to default values" }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  onClick: resetSettings,
                  className: "px-4 py-2 text-sm font-medium rounded-xl border border-red-300 dark:border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10", children: [/*#__PURE__*/

                  _jsxDEV(ExclamationTriangleIcon, { className: "h-4 w-4 inline mr-1.5" }, void 0, false), "Reset Settings"] }, void 0, true

                )] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          )] }, "general", true
        )] }, void 0, true

      )] }, void 0, true







    ));

}
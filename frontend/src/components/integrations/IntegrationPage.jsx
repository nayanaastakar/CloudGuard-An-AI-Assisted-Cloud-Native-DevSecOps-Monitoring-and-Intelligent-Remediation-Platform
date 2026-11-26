import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LinkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  TrashIcon,
  XMarkIcon,
  ArrowLeftIcon } from
'@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';
import { settingsApi, Integration as ApiIntegration } from '../../services/api';
import { logger } from '../../utils/logger';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";










export default function IntegrationPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [integration, setIntegration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectForm, setConnectForm] = useState({ endpoint: '', apiToken: '' });

  const integrationName = type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Unknown';

  useEffect(() => {
    fetchIntegration();
  }, [type]);

  const fetchIntegration = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await settingsApi.listIntegrations();

      // Find the integration matching the type
      const found = response.data.find(
        (i) => i.name.toLowerCase() === type?.toLowerCase() || i.icon?.toLowerCase() === type?.toLowerCase()
      );

      if (found) {
        setIntegration({
          id: found.id,
          name: found.name,
          description: found.description || '',
          status: found.status,
          lastSync: found.last_sync ? new Date(found.last_sync).toLocaleString() : undefined
        });
      } else {
        setError(`Integration "${type}" not found`);
      }
    } catch (err) {
      logger.error('Failed to fetch integration', err);
      setError(err.response?.data?.detail || 'Failed to load integration');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    setConnectForm({ endpoint: '', apiToken: '' });
    setShowConnectModal(true);
  };

  const handleSubmitConnect = async () => {
    if (!integration || !connectForm.endpoint) return;

    try {
      setIsConnecting(true);
      await settingsApi.connectIntegration(integration.id, {
        endpoint: connectForm.endpoint,
        api_token: connectForm.apiToken || undefined
      });
      await fetchIntegration();
      setShowConnectModal(false);
    } catch (err) {
      logger.error('Failed to connect integration', err);
      setError(err.response?.data?.detail || 'Failed to connect integration');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!integration) return;

    try {
      setIsConnecting(true);
      await settingsApi.disconnectIntegration(integration.id);
      await fetchIntegration();
    } catch (err) {
      logger.error('Failed to disconnect integration', err);
      setError(err.response?.data?.detail || 'Failed to disconnect integration');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSync = async () => {
    if (!integration) return;

    try {
      setIsConnecting(true);
      await settingsApi.checkIntegrationStatus(integration.id);
      await fetchIntegration();
    } catch (err) {
      logger.error('Failed to sync integration', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return /*#__PURE__*/_jsxDEV(CheckCircleIcon, { className: "h-5 w-5 text-green-500" }, void 0, false);
      case 'error':
        return /*#__PURE__*/_jsxDEV(ExclamationCircleIcon, { className: "h-5 w-5 text-red-500" }, void 0, false);
      default:
        return /*#__PURE__*/_jsxDEV(ExclamationCircleIcon, { className: "h-5 w-5 text-gray-400" }, void 0, false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Error';
      default:
        return 'Disconnected';
    }
  };

  if (loading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center h-64", children: /*#__PURE__*/
        _jsxDEV(ArrowPathIcon, { className: "h-8 w-8 animate-spin text-blue-500" }, void 0, false) }, void 0, false
      ));

  }

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV(PageHeader, {
        title: `${integrationName} Integration`,
        description: `Manage your ${integrationName} connection and settings`,
        icon: LinkIcon,
        iconColor: "blue",
        actions: /*#__PURE__*/
        _jsxDEV("div", { className: "flex gap-2", children: [/*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => navigate('/integrations'),
            className: "flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium", children: [/*#__PURE__*/

            _jsxDEV(ArrowLeftIcon, { className: "h-4 w-4" }, void 0, false), "Back"] }, void 0, true

          ),
          integration?.status === 'disconnected' ? /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: handleConnect,
            disabled: isConnecting,
            className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50", children: [

            isConnecting ? /*#__PURE__*/
            _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false) : /*#__PURE__*/

            _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false),

            isConnecting ? 'Connecting...' : `Connect ${integrationName}`] }, void 0, true
          ) : /*#__PURE__*/

          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: handleSync,
            disabled: isConnecting,
            className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50", children: [/*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${isConnecting ? 'animate-spin' : ''}` }, void 0, false), "Sync Now"] }, void 0, true

          )] }, void 0, true

        ) }, void 0, false

      ),

      error && /*#__PURE__*/
      _jsxDEV("div", { className: "p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm", children:
        error }, void 0, false
      ), /*#__PURE__*/



      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-primary-500/5 to-purple-500/10 border border-blue-500/20", children: /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-start gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-3 rounded-xl bg-blue-500/20", children: /*#__PURE__*/
            _jsxDEV(LinkIcon, { className: "h-6 w-6 text-blue-500" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: [
              integrationName, " Integration"] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-4", children:
              integration?.description || `Connect your ${integrationName} account to enable CI/CD pipelines, automation, and GitOps workflows.` }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex flex-wrap gap-4 text-sm", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2 text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
                _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-green-500" }, void 0, false), "Auto sync"] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2 text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
                _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-green-500" }, void 0, false), "Webhook events"] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2 text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
                _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-green-500" }, void 0, false), "API integration"] }, void 0, true

              )] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ),


      integration && /*#__PURE__*/
      _jsxDEV("div", { children: [/*#__PURE__*/
        _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4", children: "Connection Status" }, void 0, false

        ), /*#__PURE__*/

        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          className: `p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border ${
          integration.status === 'error' ?
          'border-red-500/50' :
          integration.status === 'connected' ?
          'border-green-500/50' :
          'border-gray-200/50 dark:border-slate-700/50'}`, children: /*#__PURE__*/


          _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-2.5 rounded-xl bg-gray-100 dark:bg-slate-700", children: /*#__PURE__*/
                _jsxDEV(LinkIcon, { className: "h-5 w-5 text-gray-600 dark:text-gray-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white", children:
                  integration.name }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children:
                  integration.description }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [
                getStatusIcon(integration.status), /*#__PURE__*/
                _jsxDEV("span", { className: `text-sm font-medium ${
                  integration.status === 'connected' ?
                  'text-green-600 dark:text-green-400' :
                  integration.status === 'error' ?
                  'text-red-600 dark:text-red-400' :
                  'text-gray-500'}`, children:

                  getStatusText(integration.status) }, void 0, false
                )] }, void 0, true
              ),
              integration.lastSync && /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: ["Synced ",
                integration.lastSync] }, void 0, true
              ),

              integration.status !== 'disconnected' && /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-1", children: [/*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  onClick: handleSync,
                  disabled: isConnecting,
                  className: "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 disabled:opacity-50",
                  title: "Sync now", children: /*#__PURE__*/

                  _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${isConnecting ? 'animate-spin' : ''}` }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  className: "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500",
                  title: "Settings", children: /*#__PURE__*/

                  _jsxDEV(Cog6ToothIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  onClick: handleDisconnect,
                  disabled: isConnecting,
                  className: "p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 disabled:opacity-50",
                  title: "Disconnect", children: /*#__PURE__*/

                  _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                )] }, void 0, true
              )] }, void 0, true

            )] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/



      _jsxDEV("div", { children: [/*#__PURE__*/
        _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4", children: "Webhook Configuration" }, void 0, false

        ), /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: "p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white mb-1", children: "Webhook URL" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("code", { className: "text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded", children: [
                window.location.origin, "/api/webhooks/", type] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: () => navigator.clipboard.writeText(`${window.location.origin}/api/webhooks/${type}`),
              className: "px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg", children:
              "Copy URL" }, void 0, false

            )] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true
      ),


      showConnectModal && /*#__PURE__*/
      _jsxDEV("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", children: /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          className: "w-full max-w-md p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: ["Connect ",
              integrationName] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => setShowConnectModal(false),
              className: "p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700", children: /*#__PURE__*/

              _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-400" }, void 0, false) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Endpoint URL *" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("input", {
                type: "url",
                value: connectForm.endpoint,
                onChange: (e) => setConnectForm((f) => ({ ...f, endpoint: e.target.value })),
                placeholder: `https://api.${type?.toLowerCase()}.com`,
                className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm" }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "API Token (optional)" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("input", {
                type: "password",
                value: connectForm.apiToken,
                onChange: (e) => setConnectForm((f) => ({ ...f, apiToken: e.target.value })),
                placeholder: "Enter API token",
                className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm" }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "flex gap-3 mt-6", children: [/*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => setShowConnectModal(false),
              className: "flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 text-sm font-medium", children:
              "Cancel" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: handleSubmitConnect,
              disabled: !connectForm.endpoint || isConnecting,
              className: "flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium disabled:opacity-50", children:

              isConnecting ? 'Connecting...' : 'Connect' }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true

    ));

}
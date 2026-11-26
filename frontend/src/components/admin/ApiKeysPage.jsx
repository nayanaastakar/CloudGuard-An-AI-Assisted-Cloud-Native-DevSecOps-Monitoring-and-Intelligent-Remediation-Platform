import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  KeyIcon,
  PlusIcon,
  TrashIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon } from
'@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";












// API Keys are not yet implemented in the backend
// This page will show an empty state until the feature is available

export default function ApiKeysPage() {
  const [apiKeys] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState(new Set());
  const [copiedKey, setCopiedKey] = useState(null);

  const toggleKeyVisibility = (id) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToClipboard = (key, id) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (/*#__PURE__*/
          _jsxDEV("span", { className: "flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400", children: [/*#__PURE__*/
            _jsxDEV(CheckCircleIcon, { className: "h-3 w-3" }, void 0, false), "Active"] }, void 0, true

          ));

      case 'expired':
        return (/*#__PURE__*/
          _jsxDEV("span", { className: "flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400", children: [/*#__PURE__*/
            _jsxDEV(ExclamationTriangleIcon, { className: "h-3 w-3" }, void 0, false), "Expired"] }, void 0, true

          ));

      case 'revoked':
        return (/*#__PURE__*/
          _jsxDEV("span", { className: "flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400", children: [/*#__PURE__*/
            _jsxDEV(ExclamationTriangleIcon, { className: "h-3 w-3" }, void 0, false), "Revoked"] }, void 0, true

          ));

    }
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV(PageHeader, {
        title: "API Keys",
        description: "Manage API keys for programmatic access to KubeSight",
        icon: KeyIcon,
        iconColor: "purple",
        actions: /*#__PURE__*/
        _jsxDEV(motion.button, {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          onClick: () => setShowCreateModal(true),
          className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all", children: [/*#__PURE__*/

          _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "Create API Key"] }, void 0, true

        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50", children: /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-start gap-3", children: [/*#__PURE__*/
          _jsxDEV(ExclamationTriangleIcon, { className: "h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h4", { className: "font-medium text-amber-800 dark:text-amber-200 mb-1", children: "Security Notice" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-amber-700 dark:text-amber-300", children: "API keys provide programmatic access to your KubeSight account. Keep them secure and never share them publicly. Rotate keys regularly and revoke any that may have been compromised." }, void 0, false


            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
        _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100", children: "Your API Keys" }, void 0, false

        ),

        apiKeys.length === 0 ? /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: "p-8 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 text-center", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "p-4 rounded-2xl bg-gray-100 dark:bg-slate-700 w-fit mx-auto mb-4", children: /*#__PURE__*/
            _jsxDEV(KeyIcon, { className: "h-8 w-8 text-gray-400" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("h4", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "No API keys yet" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-4", children: "Create your first API key to start integrating with KubeSight" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => setShowCreateModal(true),
            className: "px-4 py-2 bg-purple-500 text-white rounded-xl text-sm font-medium", children:
            "Create API Key" }, void 0, false

          )] }, void 0, true
        ) : /*#__PURE__*/

        _jsxDEV("div", { className: "space-y-3", children:
          apiKeys.map((apiKey) => /*#__PURE__*/
          _jsxDEV(motion.div, {

            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            className: "p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "flex items-start justify-between mb-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/30", children: /*#__PURE__*/
                  _jsxDEV(KeyIcon, { className: "h-5 w-5 text-purple-600 dark:text-purple-400" }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white", children:
                    apiKey.name }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: ["Created on ",
                    apiKey.createdAt] }, void 0, true
                  )] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children:
                getStatusBadge(apiKey.status) }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-slate-700/50 mb-3", children: [/*#__PURE__*/
              _jsxDEV("code", { className: "flex-1 text-sm font-mono text-gray-700 dark:text-gray-300", children:
                visibleKeys.has(apiKey.id) ? apiKey.key : '••••••••••••••••••••••••' }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                onClick: () => toggleKeyVisibility(apiKey.id),
                className: "p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500",
                title: visibleKeys.has(apiKey.id) ? 'Hide key' : 'Show key', children:

                visibleKeys.has(apiKey.id) ? /*#__PURE__*/
                _jsxDEV(EyeSlashIcon, { className: "h-4 w-4" }, void 0, false) : /*#__PURE__*/

                _jsxDEV(EyeIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                onClick: () => copyToClipboard(apiKey.key, apiKey.id),
                className: "p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500",
                title: "Copy to clipboard", children:

                copiedKey === apiKey.id ? /*#__PURE__*/
                _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-green-500" }, void 0, false) : /*#__PURE__*/

                _jsxDEV(ClipboardDocumentIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false

              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex flex-wrap gap-1.5", children:
                apiKey.permissions.map((perm) => /*#__PURE__*/
                _jsxDEV("span", {

                  className: "px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400", children:

                  perm }, perm, false
                )
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400", children: [
                apiKey.lastUsed && /*#__PURE__*/_jsxDEV("span", { children: ["Last used: ", apiKey.lastUsed] }, void 0, true),
                apiKey.expiresAt && /*#__PURE__*/_jsxDEV("span", { children: ["Expires: ", apiKey.expiresAt] }, void 0, true), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  className: "p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500",
                  title: "Revoke key", children: /*#__PURE__*/

                  _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            )] }, apiKey.id, true
          )
          ) }, void 0, false
        )] }, void 0, true

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showCreateModal && /*#__PURE__*/
        _jsxDEV(_Fragment, { children: [/*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className: "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
            onClick: () => setShowCreateModal(false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { opacity: 0, scale: 0.95, y: 20 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.95, y: 20 },
            className: "fixed inset-0 z-50 flex items-center justify-center p-4",
            onClick: (e) => e.stopPropagation(), children: /*#__PURE__*/

            _jsxDEV("div", { className: "w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl", children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "Create New API Key" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Key Name" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("input", {
                    type: "text",
                    placeholder: "e.g., Production API Key",
                    className: "w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent" }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Expiration" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("select", { className: "w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent", children: [/*#__PURE__*/
                    _jsxDEV("option", { children: "Never" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { children: "30 days" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { children: "90 days" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("option", { children: "1 year" }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex gap-3 pt-4", children: [/*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    onClick: () => setShowCreateModal(false),
                    className: "flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium", children:
                    "Cancel" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV(motion.button, {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    onClick: () => setShowCreateModal(false),
                    className: "flex-1 px-4 py-2 rounded-xl bg-purple-500 text-white font-medium", children:
                    "Create Key" }, void 0, false

                  )] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false

      )] }, void 0, true
    ));

}
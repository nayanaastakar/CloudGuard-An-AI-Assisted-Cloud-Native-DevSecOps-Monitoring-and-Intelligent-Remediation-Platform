import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { helmApi } from '../../services/api';
import { logger } from '../../utils/logger';
import {
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ServerStackIcon } from
'@heroicons/react/24/outline';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";












export default function HelmRepositoryManager({ isOpen, onClose, onRepositoriesUpdated }) {
  const [repositories, setRepositories] = useState([
  { name: 'bitnami', url: 'https://charts.bitnami.com/bitnami' },
  { name: 'stable', url: 'https://charts.helm.sh/stable' },
  { name: 'prometheus-community', url: 'https://prometheus-community.github.io/helm-charts' },
  { name: 'jetstack', url: 'https://charts.jetstack.io' }]
  );
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch repositories
  const fetchRepositories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await helmApi.listRepositories();
      if (response.data?.repositories) {
        setRepositories(response.data.repositories);
      }
    } catch (err) {
      logger.error('Failed to fetch repositories', err);
      // Use mock data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRepositories();
    }
  }, [isOpen]);

  const handleAddRepository = async () => {
    if (!newRepoName.trim() || !newRepoUrl.trim()) {
      setError('Repository name and URL are required');
      return;
    }

    // Validate URL format
    try {
      new URL(newRepoUrl);
    } catch {
      setError('Invalid URL format');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await helmApi.addRepository(newRepoName.trim(), newRepoUrl.trim());
      setSuccess(`Repository "${newRepoName}" added successfully`);
      setNewRepoName('');
      setNewRepoUrl('');
      fetchRepositories();
      onRepositoriesUpdated?.();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      logger.error('Failed to add repository', err);
      setError('Failed to add repository. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRepository = async (name) => {
    if (!confirm(`Are you sure you want to remove repository "${name}"?`)) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await helmApi.removeRepository(name);
      setSuccess(`Repository "${name}" removed successfully`);
      fetchRepositories();
      onRepositoriesUpdated?.();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      logger.error('Failed to remove repository', err);
      setError(`Failed to remove repository "${name}"`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRepositories = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await helmApi.updateRepositories();
      setSuccess('All repositories updated successfully');
      fetchRepositories();
      onRepositoriesUpdated?.();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      logger.error('Failed to update repositories', err);
      setError('Failed to update repositories');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (/*#__PURE__*/
    _jsxDEV(AnimatePresence, { children: /*#__PURE__*/
      _jsxDEV("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm", children: /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
          transition: { duration: 0.2 },
          className: "w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden", children: [/*#__PURE__*/


          _jsxDEV("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600", children: /*#__PURE__*/
                _jsxDEV(ServerStackIcon, { className: "h-5 w-5 text-white" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("h2", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "Helm Repositories" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Manage chart repositories" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: onClose,
              className: "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors", children: /*#__PURE__*/

              _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500 dark:text-gray-400" }, void 0, false) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "p-6 max-h-[70vh] overflow-y-auto", children: [

            error && /*#__PURE__*/
            _jsxDEV(motion.div, {
              initial: { opacity: 0, y: -10 },
              animate: { opacity: 1, y: 0 },
              className: "mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2", children: [/*#__PURE__*/

              _jsxDEV(ExclamationCircleIcon, { className: "h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-red-600 dark:text-red-400", children: error }, void 0, false)] }, void 0, true
            ),


            success && /*#__PURE__*/
            _jsxDEV(motion.div, {
              initial: { opacity: 0, y: -10 },
              animate: { opacity: 1, y: 0 },
              className: "mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-2", children: [/*#__PURE__*/

              _jsxDEV(CheckCircleIcon, { className: "h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-green-600 dark:text-green-400", children: success }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/



            _jsxDEV("div", { className: "mb-6 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white mb-3", children: "Add New Repository" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 mb-3", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5", children: "Repository Name" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("input", {
                    type: "text",
                    value: newRepoName,
                    onChange: (e) => setNewRepoName(e.target.value),
                    placeholder: "e.g., bitnami",
                    className: "w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5", children: "Repository URL" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("input", {
                    type: "text",
                    value: newRepoUrl,
                    onChange: (e) => setNewRepoUrl(e.target.value),
                    placeholder: "https://charts.bitnami.com/bitnami",
                    className: "w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" }, void 0, false
                  )] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                onClick: handleAddRepository,
                disabled: loading || !newRepoName.trim() || !newRepoUrl.trim(),
                className: "w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all", children: [/*#__PURE__*/

                _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "Add Repository"] }, void 0, true

              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: ["Installed Repositories (",
                repositories.length, ")"] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                onClick: handleUpdateRepositories,
                disabled: loading,
                className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-500/20 disabled:opacity-50 transition-colors", children: [/*#__PURE__*/

                _jsxDEV(ArrowPathIcon, { className: `h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}` }, void 0, false), "Update All"] }, void 0, true

              )] }, void 0, true
            ),


            loading && repositories.length === 0 ? /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-center py-8", children: /*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: "h-8 w-8 text-gray-400 animate-spin" }, void 0, false) }, void 0, false
            ) :
            repositories.length === 0 ? /*#__PURE__*/
            _jsxDEV("div", { className: "text-center py-8", children: [/*#__PURE__*/
              _jsxDEV(ServerStackIcon, { className: "h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "No repositories configured" }, void 0, false)] }, void 0, true
            ) : /*#__PURE__*/

            _jsxDEV("div", { className: "space-y-2", children:
              repositories.map((repo, index) => /*#__PURE__*/
              _jsxDEV(motion.div, {

                initial: { opacity: 0, x: -10 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: index * 0.05 },
                className: "flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:border-cyan-300 dark:hover:border-cyan-700 transition-colors group", children: [/*#__PURE__*/

                _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2 mb-1", children: [/*#__PURE__*/
                    _jsxDEV("h4", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: repo.name }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "px-2 py-0.5 text-xs font-medium bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded", children: "Active" }, void 0, false

                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 truncate", children: repo.url }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.1 },
                  whileTap: { scale: 0.9 },
                  onClick: () => handleRemoveRepository(repo.name),
                  disabled: loading,
                  className: "ml-3 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 disabled:opacity-50 transition-all",
                  title: "Remove repository", children: /*#__PURE__*/

                  _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                )] }, repo.name, true
              )
              ) }, void 0, false
            ), /*#__PURE__*/



            _jsxDEV("div", { className: "mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800", children: [/*#__PURE__*/
              _jsxDEV("h4", { className: "text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2", children: "Popular Repositories" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-2 text-xs text-blue-800 dark:text-blue-400", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex justify-between", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "font-medium", children: "Bitnami:" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("code", { className: "text-xs bg-blue-100 dark:bg-blue-800/50 px-2 py-0.5 rounded", children: "https://charts.bitnami.com/bitnami" }, void 0, false

                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex justify-between", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "font-medium", children: "Jetstack:" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("code", { className: "text-xs bg-blue-100 dark:bg-blue-800/50 px-2 py-0.5 rounded", children: "https://charts.jetstack.io" }, void 0, false

                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex justify-between", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "font-medium", children: "Prometheus:" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("code", { className: "text-xs bg-blue-100 dark:bg-blue-800/50 px-2 py-0.5 rounded", children: "https://prometheus-community.github.io/helm-charts" }, void 0, false

                  )] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-slate-700", children: /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              onClick: onClose,
              className: "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors", children:
              "Close" }, void 0, false

            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ) }, void 0, false
    ));

}
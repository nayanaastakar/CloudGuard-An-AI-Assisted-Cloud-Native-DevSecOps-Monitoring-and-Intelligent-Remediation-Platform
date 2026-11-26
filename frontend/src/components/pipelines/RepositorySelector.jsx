import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  LockClosedIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  LinkIcon,
  ChevronRightIcon,
  StarIcon,
  BellIcon } from
'@heroicons/react/24/outline';
import GlassCard from '../common/GlassCard';
import { getGitHubRepos, getGitHubBranches, createGitHubWebhook } from '../../services/pipelineAPI';
import { pipelineLogger as logger } from '../../utils/logger';

// Types
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";


































// Animation variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export default function RepositorySelector({
  isOpen,
  onClose,
  onSelect,
  currentConfig
}) {
  // State
  const [step, setStep] = useState('provider');
  const [provider, setProvider] = useState('github');
  const [repositories, setRepositories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [webhookEnabled, setWebhookEnabled] = useState(true);
  const [manualUrl, setManualUrl] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (currentConfig) {
        setProvider(currentConfig.provider);
        setManualUrl(currentConfig.repository);
        setSelectedBranch(currentConfig.branch);
        setWebhookEnabled(currentConfig.webhookEnabled ?? true);
      } else {
        setStep('provider');
        setRepositories([]);
        setBranches([]);
        setSelectedRepo(null);
        setSelectedBranch('');
        setSearchQuery('');
        setError(null);
      }
    }
  }, [isOpen, currentConfig]);

  // Fetch repositories from GitHub
  const fetchRepositories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const repos = await getGitHubRepos();
      // Transform GitHub repos to match our Repository interface
      const transformedRepos = repos.map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || null,
        html_url: repo.url,
        clone_url: `https://github.com/${repo.full_name}.git`,
        ssh_url: `git@github.com:${repo.full_name}.git`,
        default_branch: repo.default_branch,
        private: repo.private,
        owner: repo.owner
      }));
      setRepositories(transformedRepos);
      setStep('repos');
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch repositories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch branches for selected repository
  const fetchBranches = useCallback(async (repo) => {
    setIsLoading(true);
    setError(null);
    try {
      const branchData = await getGitHubBranches(repo.owner, repo.name);
      // Transform to match our Branch interface
      const transformedBranches = branchData.map((branch) => ({
        name: branch.name,
        sha: '',
        protected: branch.protected
      }));
      setBranches(transformedBranches);
      setSelectedBranch(repo.default_branch);
      setStep('branches');
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch branches');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle provider selection
  const handleProviderSelect = async (selectedProvider) => {
    setProvider(selectedProvider);
    if (selectedProvider === 'manual') {
      setStep('config');
    } else if (selectedProvider === 'github') {
      await fetchRepositories();
    } else {
      setError(`${selectedProvider} integration coming soon`);
    }
  };

  // Handle repository selection
  const handleRepoSelect = async (repo) => {
    setSelectedRepo(repo);
    await fetchBranches(repo);
  };

  // Handle final confirmation
  const handleConfirm = async () => {
    if (provider === 'manual') {
      onSelect({
        repository: manualUrl,
        branch: selectedBranch || 'main',
        provider: 'manual',
        webhookEnabled: false
      });
      onClose();
      return;
    }

    if (!selectedRepo) return;

    // Create webhook if enabled
    let webhookSecret;
    let actualWebhookEnabled = webhookEnabled;
    if (webhookEnabled) {
      try {
        setIsLoading(true);
        const webhookData = await createGitHubWebhook(selectedRepo.owner, selectedRepo.name);
        webhookSecret = webhookData.secret;
      } catch (err) {
        // Webhook creation failed - notify user but allow proceeding
        const errorMessage = err.response?.data?.detail || err.message || 'Unknown error';
        const shouldProceed = window.confirm(
          `Webhook creation failed: ${errorMessage}\n\nYour pipeline will still be created, but automatic triggers won't work until you manually set up the webhook.\n\nDo you want to continue without webhook?`
        );
        if (!shouldProceed) {
          setIsLoading(false);
          return;
        }
        // Mark webhook as disabled since it failed
        actualWebhookEnabled = false;
        logger.warn('Webhook creation failed', err);
      } finally {
        setIsLoading(false);
      }
    }

    onSelect({
      repository: selectedRepo.clone_url,
      branch: selectedBranch,
      provider,
      repoFullName: selectedRepo.full_name,
      webhookEnabled: actualWebhookEnabled,
      webhookSecret
    });
    onClose();
  };

  // Filter repositories by search
  const filteredRepos = repositories.filter(
    (repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || (
    repo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  // Provider options
  const providers = [
  {
    id: 'github',
    name: 'GitHub',
    icon: /*#__PURE__*/
    _jsxDEV("svg", { className: "w-8 h-8", fill: "currentColor", viewBox: "0 0 24 24", children: /*#__PURE__*/
      _jsxDEV("path", { d: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" }, void 0, false) }, void 0, false
    ),

    color: 'from-gray-700 to-gray-900',
    available: true
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    icon: /*#__PURE__*/
    _jsxDEV("svg", { className: "w-8 h-8", fill: "currentColor", viewBox: "0 0 24 24", children: /*#__PURE__*/
      _jsxDEV("path", { d: "M23.955 13.587l-1.342-4.135-2.664-8.189a.455.455 0 00-.867 0L16.418 9.45H7.582L4.918 1.263a.455.455 0 00-.867 0L1.386 9.452.044 13.587a.924.924 0 00.331 1.023L12 23.054l11.625-8.443a.92.92 0 00.33-1.024" }, void 0, false) }, void 0, false
    ),

    color: 'from-orange-500 to-red-600',
    available: false
  },
  {
    id: 'bitbucket',
    name: 'Bitbucket',
    icon: /*#__PURE__*/
    _jsxDEV("svg", { className: "w-8 h-8", fill: "currentColor", viewBox: "0 0 24 24", children: /*#__PURE__*/
      _jsxDEV("path", { d: "M.778 1.213a.768.768 0 00-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 00.77-.646l3.27-20.03a.768.768 0 00-.768-.891L.778 1.213zM14.52 15.53H9.522l-1.35-7.063h7.68l-1.332 7.063z" }, void 0, false) }, void 0, false
    ),

    color: 'from-blue-500 to-blue-700',
    available: false
  },
  {
    id: 'manual',
    name: 'Manual URL',
    icon: /*#__PURE__*/_jsxDEV(LinkIcon, { className: "w-8 h-8" }, void 0, false),
    color: 'from-purple-500 to-indigo-600',
    available: true
  }];


  if (!isOpen) return null;

  return (/*#__PURE__*/
    _jsxDEV(AnimatePresence, { children: /*#__PURE__*/
      _jsxDEV(motion.div, {
        variants: overlayVariants,
        initial: "hidden",
        animate: "visible",
        exit: "hidden",
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
        onClick: onClose, children: /*#__PURE__*/

        _jsxDEV(motion.div, {
          variants: modalVariants,
          initial: "hidden",
          animate: "visible",
          exit: "exit",
          onClick: (e) => e.stopPropagation(),
          className: "w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl", children: /*#__PURE__*/

          _jsxDEV(GlassCard, { padding: "none", className: "overflow-hidden", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "px-6 py-4 border-b border-white/10 dark:border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25", children: /*#__PURE__*/
                    _jsxDEV(CodeBracketIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("div", { children: [/*#__PURE__*/
                    _jsxDEV("h2", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "Connect Repository" }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
                      step === 'provider' && 'Select your Git provider',
                      step === 'repos' && 'Choose a repository',
                      step === 'branches' && 'Select branch and configure',
                      step === 'config' && 'Configure repository'] }, void 0, true
                    )] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  onClick: onClose,
                  className: "p-2 rounded-xl hover:bg-white/10 transition-colors", children: /*#__PURE__*/

                  _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "flex items-center gap-2 mt-4", children:
                ['provider', 'repos', 'branches'].map((s, i) => /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center", children: [/*#__PURE__*/
                  _jsxDEV("div", {
                    className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step === s ?
                    'bg-gradient-to-r from-blue-500 to-purple-600 text-white' :
                    ['provider', 'repos', 'branches'].indexOf(step) > i ?
                    'bg-emerald-500 text-white' :
                    'bg-gray-200 dark:bg-slate-700 text-gray-500'}`, children:


                    ['provider', 'repos', 'branches'].indexOf(step) > i ? /*#__PURE__*/
                    _jsxDEV(CheckCircleIcon, { className: "h-5 w-5" }, void 0, false) :

                    i + 1 }, void 0, false

                  ),
                  i < 2 && /*#__PURE__*/
                  _jsxDEV("div", {
                    className: `w-12 h-1 mx-2 rounded-full ${
                    ['provider', 'repos', 'branches'].indexOf(step) > i ?
                    'bg-emerald-500' :
                    'bg-gray-200 dark:bg-slate-700'}` }, void 0, false

                  )] }, s, true

                )
                ) }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "p-6 overflow-y-auto max-h-[50vh]", children: [/*#__PURE__*/

              _jsxDEV(AnimatePresence, { children:
                error && /*#__PURE__*/
                _jsxDEV(motion.div, {
                  initial: { opacity: 0, y: -10 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -10 },
                  className: "mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-600 dark:text-red-400", children: [/*#__PURE__*/

                  _jsxDEV(ExclamationCircleIcon, { className: "h-5 w-5 flex-shrink-0" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-sm", children: error }, void 0, false), /*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => setError(null),
                    className: "ml-auto p-1 hover:bg-red-500/10 rounded-lg", children: /*#__PURE__*/

                    _jsxDEV(XMarkIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false

              ),


              isLoading && /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-center py-12", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex flex-col items-center gap-3", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("div", { className: "absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Loading..." }, void 0, false)] }, void 0, true
                ) }, void 0, false
              ),



              !isLoading && step === 'provider' && /*#__PURE__*/
              _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children:
                providers.map((p) => /*#__PURE__*/
                _jsxDEV(motion.button, {

                  variants: itemVariants,
                  whileHover: { scale: p.available ? 1.02 : 1 },
                  whileTap: { scale: p.available ? 0.98 : 1 },
                  onClick: () => p.available && handleProviderSelect(p.id),
                  disabled: !p.available,
                  className: `relative p-6 rounded-xl border transition-all text-left ${
                  p.available ?
                  'border-white/20 dark:border-slate-600 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer' :
                  'border-gray-200 dark:border-slate-700 opacity-50 cursor-not-allowed'} ${

                  provider === p.id ?
                  'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500' :
                  'bg-white/50 dark:bg-slate-800/50'}`, children: [/*#__PURE__*/


                  _jsxDEV("div", { className: `p-3 rounded-xl bg-gradient-to-br ${p.color} text-white w-fit mb-3`, children:
                    p.icon }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: p.name }, void 0, false),
                  !p.available && /*#__PURE__*/
                  _jsxDEV("span", { className: "absolute top-2 right-2 text-xs bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full", children: "Coming Soon" }, void 0, false

                  )] }, p.id, true

                )
                ) }, void 0, false
              ),



              !isLoading && step === 'repos' && /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/

                _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
                  _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("input", {
                    type: "text",
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    placeholder: "Search repositories...",
                    className: "w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/


                _jsxDEV("div", { className: "space-y-2 max-h-[300px] overflow-y-auto pr-2", children:
                  filteredRepos.length === 0 ? /*#__PURE__*/
                  _jsxDEV("div", { className: "text-center py-8 text-gray-500", children: [/*#__PURE__*/
                    _jsxDEV(FolderIcon, { className: "h-12 w-12 mx-auto mb-3 opacity-50" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("p", { children: "No repositories found" }, void 0, false)] }, void 0, true
                  ) :

                  filteredRepos.map((repo) => /*#__PURE__*/
                  _jsxDEV(motion.button, {

                    variants: itemVariants,
                    whileHover: { scale: 1.01 },
                    whileTap: { scale: 0.99 },
                    onClick: () => handleRepoSelect(repo),
                    className: `w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    selectedRepo?.id === repo.id ?
                    'bg-blue-500/10 border-blue-500' :
                    'bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-600 hover:border-blue-500/50'}`, children: [/*#__PURE__*/


                    _jsxDEV("div", { className: "p-2 rounded-lg bg-gray-100 dark:bg-slate-700", children:
                      repo.private ? /*#__PURE__*/
                      _jsxDEV(LockClosedIcon, { className: "h-5 w-5 text-amber-500" }, void 0, false) : /*#__PURE__*/

                      _jsxDEV(GlobeAltIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) }, void 0, false

                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                        _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white truncate", children:
                          repo.full_name }, void 0, false
                        ),
                        repo.private && /*#__PURE__*/
                        _jsxDEV("span", { className: "text-xs bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full", children: "Private" }, void 0, false

                        )] }, void 0, true

                      ),
                      repo.description && /*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 truncate mt-1", children:
                        repo.description }, void 0, false
                      ), /*#__PURE__*/

                      _jsxDEV("div", { className: "flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400", children: /*#__PURE__*/
                        _jsxDEV("span", { className: "flex items-center gap-1", children: [/*#__PURE__*/
                          _jsxDEV(CodeBracketIcon, { className: "h-3.5 w-3.5" }, void 0, false),
                          repo.default_branch] }, void 0, true
                        ) }, void 0, false
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV(ChevronRightIcon, { className: "h-5 w-5 text-gray-400 flex-shrink-0" }, void 0, false)] }, repo.id, true
                  )
                  ) }, void 0, false

                ), /*#__PURE__*/


                _jsxDEV("button", {
                  onClick: fetchRepositories,
                  className: "flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline", children: [/*#__PURE__*/

                  _jsxDEV(ArrowPathIcon, { className: "h-4 w-4" }, void 0, false), "Refresh repositories"] }, void 0, true

                )] }, void 0, true
              ),



              !isLoading && step === 'branches' && selectedRepo && /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

                _jsxDEV("div", { className: "p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "p-2 rounded-lg bg-blue-500/20", children: /*#__PURE__*/
                      _jsxDEV(CodeBracketIcon, { className: "h-5 w-5 text-blue-500" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white", children:
                        selectedRepo.full_name }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children:
                        selectedRepo.clone_url }, void 0, false
                      )] }, void 0, true
                    )] }, void 0, true
                  ) }, void 0, false
                ), /*#__PURE__*/


                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Select Branch" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto", children:
                    branches.map((branch) => /*#__PURE__*/
                    _jsxDEV(motion.button, {

                      whileHover: { scale: 1.02 },
                      whileTap: { scale: 0.98 },
                      onClick: () => setSelectedBranch(branch.name),
                      className: `p-3 rounded-xl border text-left transition-all ${
                      selectedBranch === branch.name ?
                      'bg-blue-500/10 border-blue-500' :
                      'bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-600 hover:border-blue-500/50'}`, children: /*#__PURE__*/


                      _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                        _jsxDEV(CodeBracketIcon, { className: "h-4 w-4 text-gray-500" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white truncate", children:
                          branch.name }, void 0, false
                        ),
                        branch.protected && /*#__PURE__*/
                        _jsxDEV(LockClosedIcon, { className: "h-3.5 w-3.5 text-amber-500" }, void 0, false),

                        branch.name === selectedRepo.default_branch && /*#__PURE__*/
                        _jsxDEV(StarIcon, { className: "h-3.5 w-3.5 text-yellow-500" }, void 0, false)] }, void 0, true

                      ) }, branch.name, false
                    )
                    ) }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/


                _jsxDEV("div", { className: "p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-600", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "p-2 rounded-lg bg-purple-500/20", children: /*#__PURE__*/
                        _jsxDEV(BellIcon, { className: "h-5 w-5 text-purple-500" }, void 0, false) }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("div", { children: [/*#__PURE__*/
                        _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white", children: "Auto-trigger on Push" }, void 0, false

                        ), /*#__PURE__*/
                        _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Create webhook to trigger pipeline on code push" }, void 0, false

                        )] }, void 0, true
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("label", { className: "relative inline-flex items-center cursor-pointer", children: [/*#__PURE__*/
                      _jsxDEV("input", {
                        type: "checkbox",
                        checked: webhookEnabled,
                        onChange: (e) => setWebhookEnabled(e.target.checked),
                        className: "sr-only peer" }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  ) }, void 0, false
                )] }, void 0, true
              ),



              !isLoading && step === 'config' && provider === 'manual' && /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Repository URL" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("input", {
                    type: "text",
                    value: manualUrl,
                    onChange: (e) => setManualUrl(e.target.value),
                    placeholder: "https://github.com/user/repo.git",
                    className: "w-full px-4 py-2.5 bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Branch" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("input", {
                    type: "text",
                    value: selectedBranch,
                    onChange: (e) => setSelectedBranch(e.target.value),
                    placeholder: "main",
                    className: "w-full px-4 py-2.5 bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" }, void 0, false
                  )] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true

            ), /*#__PURE__*/


            _jsxDEV("div", { className: "px-6 py-4 border-t border-white/10 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/50 flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                onClick: () => {
                  if (step === 'repos') setStep('provider');else
                  if (step === 'branches') setStep('repos');else
                  if (step === 'config') setStep('provider');else
                  onClose();
                },
                className: "px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors", children:

                step === 'provider' ? 'Cancel' : 'Back' }, void 0, false
              ),

              (step === 'branches' || step === 'config' && provider === 'manual') && /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                onClick: handleConfirm,
                disabled:
                step === 'branches' && !selectedBranch ||
                step === 'config' && !manualUrl,

                className: "flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed", children: [/*#__PURE__*/

                _jsxDEV(LinkIcon, { className: "h-4 w-4" }, void 0, false), "Connect Repository"] }, void 0, true

              )] }, void 0, true

            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false
      ) }, void 0, false
    ));

}
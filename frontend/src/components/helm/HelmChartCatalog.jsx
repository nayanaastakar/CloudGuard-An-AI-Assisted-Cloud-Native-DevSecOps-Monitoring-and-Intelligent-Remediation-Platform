import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { helmApi } from '../../services/api';
import { logger } from '../../utils/logger';
import HelmRepositoryManager from './HelmRepositoryManager';
import {
  CubeIcon,
  MagnifyingGlassIcon,
  RocketLaunchIcon,
  StarIcon,
  ArrowPathIcon,
  FunnelIcon,
  XMarkIcon,
  ServerStackIcon,
  ClockIcon } from
'@heroicons/react/24/outline';

// Mock popular charts data
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";const mockPopularCharts = [
{ name: 'nginx', repo: 'bitnami', description: 'NGINX Open Source is a web server', version: '15.1.0', downloads: '10M+', rating: 4.8 },
{ name: 'mysql', repo: 'bitnami', description: 'MySQL is a fast, reliable, scalable database', version: '9.12.1', downloads: '8M+', rating: 4.7 },
{ name: 'postgresql', repo: 'bitnami', description: 'PostgreSQL is an advanced database', version: '12.8.0', downloads: '7M+', rating: 4.9 },
{ name: 'redis', repo: 'bitnami', description: 'Redis is an in-memory data structure store', version: '18.0.3', downloads: '9M+', rating: 4.8 },
{ name: 'mongodb', repo: 'bitnami', description: 'MongoDB is a NoSQL database', version: '13.16.0', downloads: '6M+', rating: 4.6 },
{ name: 'apache', repo: 'bitnami', description: 'Apache HTTP Server', version: '10.1.2', downloads: '5M+', rating: 4.5 }];


const categories = ['All', 'Databases', 'Web Servers', 'Monitoring', 'CI/CD', 'Messaging', 'Storage'];
const repositories = ['All Repos', 'bitnami', 'stable', 'prometheus-community', 'jetstack'];

export default function HelmChartCatalog() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRepo, setSelectedRepo] = useState('All Repos');
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showRepoManager, setShowRepoManager] = useState(false);
  const [showVersionSelector, setShowVersionSelector] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);
  const [chartVersions, setChartVersions] = useState([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

  // Fetch charts on mount and when search changes
  useEffect(() => {
    // Start with mock data
    setCharts(mockPopularCharts);
    // Fetch real charts if search query exists
    if (searchQuery) {
      fetchCharts(searchQuery);
    }
  }, [searchQuery]);

  const fetchCharts = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await helmApi.searchCharts(query, selectedRepo !== 'All Repos' ? selectedRepo : undefined);
      if (response.data && Array.isArray(response.data)) {
        // Transform API response to match our chart format
        const transformedCharts = response.data.map((chart) => ({
          name: chart.name,
          repo: chart.repository || 'unknown',
          description: chart.description || 'No description available',
          version: chart.version || 'latest',
          downloads: chart.downloads || 'N/A',
          rating: chart.rating || 4.5
        }));
        setCharts(transformedCharts);
      }
    } catch (err) {
      logger.error('Failed to search charts', err);
      // Keep mock data on error
    } finally {
      setLoading(false);
    }
  };

  // Filter charts
  const filteredCharts = charts.filter((chart) => {
    const matchesSearch =
    chart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chart.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRepo = selectedRepo === 'All Repos' || chart.repo === selectedRepo;
    return matchesSearch && matchesRepo;
  });

  const handleInstallChart = async (chart) => {
    setSelectedChart(chart);
    // Pre-populate immediately with chart's current version so modal is never empty
    setChartVersions([{ version: chart.version, app_version: '', description: chart.description }]);
    setShowVersionSelector(true);
    setLoadingVersions(true);

    try {
      const response = await helmApi.getChartVersions(`${chart.repo}/${chart.name}`);
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setChartVersions(response.data);
      } else {
        // If no versions found, use the current version as safe fallback
        setChartVersions([{ version: chart.version, app_version: '', description: chart.description }]);
      }
    } catch (err) {
      logger.error('Failed to fetch chart versions', err);
      // Use current version as fallback
      setChartVersions([{ version: chart.version, app_version: '', description: chart.description }]);
    } finally {
      setLoadingVersions(false);
    }
  };

  const handleSelectVersion = (version) => {
    if (!selectedChart) return;
    setShowVersionSelector(false);
    navigate(`/deploy/helm/workspace?mode=install&chart=${selectedChart.repo}/${selectedChart.name}&version=${version}`);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Update repositories first
      await helmApi.updateRepositories();
      // Then search for popular charts
      if (searchQuery) {
        await fetchCharts(searchQuery);
      } else {
        // Reset to popular charts
        setCharts(mockPopularCharts);
      }
    } catch (err) {
      logger.error('Failed to refresh', err);
    } finally {
      setLoading(false);
    }
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "flex flex-col h-[calc(100vh-6.5rem)] overflow-hidden bg-gray-50 dark:bg-slate-900", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex-shrink-0", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600", children: /*#__PURE__*/
            _jsxDEV(CubeIcon, { className: "h-6 w-6 text-white" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h1", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Helm Chart Catalog" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Browse and install charts from your repositories" }, void 0, false

            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => setShowRepoManager(true),
            className: "flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors", children: [/*#__PURE__*/

            _jsxDEV(ServerStackIcon, { className: "h-5 w-5" }, void 0, false), "Manage Repos"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            onClick: handleRefresh,
            disabled: loading,
            className: "p-2.5 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50", children: /*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `h-5 w-5 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}` }, void 0, false) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "px-6 py-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex-shrink-0", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3 mb-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex-1 relative", children: [/*#__PURE__*/
            _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              placeholder: "Search charts by name or description...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => setShowFilters(!showFilters),
            className: `flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            showFilters ?
            'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30' :
            'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600'}`, children: [/*#__PURE__*/


            _jsxDEV(FunnelIcon, { className: "h-5 w-5" }, void 0, false), "Filters"] }, void 0, true

          )] }, void 0, true
        ),


        showFilters && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, height: 0 },
          animate: { opacity: 1, height: 'auto' },
          exit: { opacity: 0, height: 0 },
          className: "pt-3 border-t border-gray-200 dark:border-slate-700", children: /*#__PURE__*/

          _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block", children: "Category" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "flex flex-wrap gap-2", children:
                categories.map((category) => /*#__PURE__*/
                _jsxDEV("button", {

                  onClick: () => setSelectedCategory(category),
                  className: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedCategory === category ?
                  'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30' :
                  'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'}`, children:


                  category }, category, false
                )
                ) }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block", children: "Repository" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "flex flex-wrap gap-2", children:
                repositories.map((repo) => /*#__PURE__*/
                _jsxDEV("button", {

                  onClick: () => setSelectedRepo(repo),
                  className: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedRepo === repo ?
                  'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30' :
                  'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'}`, children:


                  repo }, repo, false
                )
                ) }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true

      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex-1 overflow-auto p-6", children:
        loading && filteredCharts.length === 0 ? /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-center h-full", children: /*#__PURE__*/
          _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
            _jsxDEV(ArrowPathIcon, { className: "h-12 w-12 text-gray-400 animate-spin mx-auto mb-4" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children: "Loading charts..." }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ) :
        filteredCharts.length === 0 ? /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-center h-full", children: /*#__PURE__*/
          _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
            _jsxDEV(CubeIcon, { className: "h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" }, void 0, false), /*#__PURE__*/
            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2", children: "No charts found" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mb-4", children: "Try adjusting your search or filters" }, void 0, false

            ),
            (searchQuery || selectedRepo !== 'All Repos') && /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.05 },
              whileTap: { scale: 0.95 },
              onClick: () => {
                setSearchQuery('');
                setSelectedRepo('All Repos');
                setSelectedCategory('All');
              },
              className: "px-4 py-2 text-sm font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-all", children:
              "Clear Filters" }, void 0, false

            )] }, void 0, true

          ) }, void 0, false
        ) : /*#__PURE__*/

        _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children:
          filteredCharts.map((chart, index) => /*#__PURE__*/
          _jsxDEV(motion.div, {

            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: index * 0.05 },
            whileHover: { y: -4 },
            className: "bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-all", children: [/*#__PURE__*/


            _jsxDEV("div", { className: "flex items-start justify-between mb-3", children: /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "p-2 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-200 dark:border-cyan-800", children: /*#__PURE__*/
                  _jsxDEV(CubeIcon, { className: "h-5 w-5 text-cyan-600 dark:text-cyan-400" }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
                  _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white truncate", children: chart.name }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 truncate", children: chart.repo }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/


            _jsxDEV("p", { className: "text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 min-h-[2.5rem]", children:
              chart.description }, void 0, false
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center gap-3 mb-3 text-xs", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-1 text-amber-500", children: [/*#__PURE__*/
                _jsxDEV(StarIcon, { className: "h-3.5 w-3.5 fill-amber-500" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "font-medium", children: chart.rating }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "text-gray-500 dark:text-gray-400", children: [
                chart.downloads, " downloads"] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: ["v",
                chart.version] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                onClick: () => handleInstallChart(chart),
                className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:shadow-lg transition-all", children: [/*#__PURE__*/

                _jsxDEV(RocketLaunchIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Install"] }, void 0, true

              )] }, void 0, true
            )] }, `${chart.repo}/${chart.name}`, true
          )
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV(HelmRepositoryManager, {
        isOpen: showRepoManager,
        onClose: () => setShowRepoManager(false),
        onRepositoriesUpdated: handleRefresh }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        showVersionSelector && selectedChart && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
          onClick: () => setShowVersionSelector(false), children: /*#__PURE__*/

          _jsxDEV(motion.div, {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.9, opacity: 0 },
            onClick: (e) => e.stopPropagation(),
            className: "bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col", children: [/*#__PURE__*/


            _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "p-2 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-200 dark:border-cyan-800", children: /*#__PURE__*/
                  _jsxDEV(CubeIcon, { className: "h-6 w-6 text-cyan-600 dark:text-cyan-400" }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("h3", { className: "text-lg font-bold text-gray-900 dark:text-white", children: "Select Version" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
                    selectedChart.repo, "/", selectedChart.name] }, void 0, true
                  )] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                onClick: () => setShowVersionSelector(false),
                className: "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors", children: /*#__PURE__*/

                _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500 dark:text-gray-400" }, void 0, false) }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "flex-1 overflow-auto", children:
              loadingVersions ? /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-center py-12", children: /*#__PURE__*/
                _jsxDEV(ArrowPathIcon, { className: "h-8 w-8 text-gray-400 animate-spin" }, void 0, false) }, void 0, false
              ) :
              chartVersions.length > 0 ? /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-2", children:
                chartVersions.map((version, idx) => /*#__PURE__*/
                _jsxDEV(motion.button, {

                  initial: { opacity: 0, x: -10 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: idx * 0.03 },
                  onClick: () => handleSelectVersion(version.version),
                  className: "w-full p-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-left group", children: /*#__PURE__*/

                  _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center gap-2 mb-1", children: [/*#__PURE__*/
                        _jsxDEV("span", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: ["v",
                          version.version] }, void 0, true
                        ),
                        idx === 0 && /*#__PURE__*/
                        _jsxDEV("span", { className: "px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full", children: "Latest" }, void 0, false

                        ),

                        version.app_version && /*#__PURE__*/
                        _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: ["App: ",
                          version.app_version] }, void 0, true
                        )] }, void 0, true

                      ),
                      version.description && /*#__PURE__*/
                      _jsxDEV("p", { className: "text-xs text-gray-600 dark:text-gray-400 line-clamp-1", children:
                        version.description }, void 0, false
                      )] }, void 0, true

                    ), /*#__PURE__*/
                    _jsxDEV(RocketLaunchIcon, { className: "h-5 w-5 text-gray-400 group-hover:text-cyan-500 transition-colors" }, void 0, false)] }, void 0, true
                  ) }, `${version.version}-${idx}`, false
                )
                ) }, void 0, false
              ) : /*#__PURE__*/

              _jsxDEV("div", { className: "flex flex-col items-center justify-center py-12", children: [/*#__PURE__*/
                _jsxDEV(ClockIcon, { className: "h-12 w-12 text-gray-300 dark:text-slate-600 mb-4" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "No versions available" }, void 0, false)] }, void 0, true
              ) }, void 0, false

            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}
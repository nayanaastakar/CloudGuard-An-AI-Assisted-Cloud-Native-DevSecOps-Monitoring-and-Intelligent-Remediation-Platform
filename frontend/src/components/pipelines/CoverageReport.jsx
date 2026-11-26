import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  FolderIcon,
  ExclamationTriangleIcon } from
'@heroicons/react/24/outline';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";















































export default function CoverageReport({ coverageData, coverageSummary, isLoading }) {
  const getCoverageColor = (coverage) => {
    if (coverage === undefined || coverage === null) return 'text-gray-400';
    if (coverage >= 80) return 'text-emerald-500';
    if (coverage >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getCoverageBg = (coverage) => {
    if (coverage === undefined || coverage === null) return 'bg-gray-300 dark:bg-gray-600';
    if (coverage >= 80) return 'bg-emerald-500';
    if (coverage >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getCoverageRingColor = (coverage) => {
    if (coverage === undefined || coverage === null) return 'stroke-gray-300 dark:stroke-gray-600';
    if (coverage >= 80) return 'stroke-emerald-500';
    if (coverage >= 60) return 'stroke-amber-500';
    return 'stroke-red-500';
  };

  const getChangeIcon = (change) => {
    if (!change || change === 0) return /*#__PURE__*/_jsxDEV(MinusIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false);
    if (change > 0) return /*#__PURE__*/_jsxDEV(ArrowTrendingUpIcon, { className: "h-4 w-4 text-emerald-500" }, void 0, false);
    return /*#__PURE__*/_jsxDEV(ArrowTrendingDownIcon, { className: "h-4 w-4 text-red-500" }, void 0, false);
  };

  const getChangeColor = (change) => {
    if (!change || change === 0) return 'text-gray-500';
    if (change > 0) return 'text-emerald-500';
    return 'text-red-500';
  };

  if (isLoading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center py-12", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-col items-center gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children: "Loading coverage data..." }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ));

  }

  // Use coverageData or fallback to coverageSummary
  const coverage = coverageData?.[0] || coverageSummary;

  if (!coverage) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex flex-col items-center justify-center py-12", children: [/*#__PURE__*/
        _jsxDEV(ChartBarIcon, { className: "h-12 w-12 text-gray-400 mb-4" }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 text-lg font-medium", children: "No coverage data available" }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { className: "text-gray-400 dark:text-gray-500 text-sm mt-1", children: "Coverage data will appear here after tests run" }, void 0, false

        )] }, void 0, true
      ));

  }

  const lineCoverage = coverage.lineCoverage;
  const branchCoverage = coverage.branchCoverage;
  const coverageChange = coverage.coverageChange;

  // Calculate circumference for circular progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const lineOffset = lineCoverage != null ? circumference - lineCoverage / 100 * circumference : circumference;
  const branchOffset = branchCoverage != null ? circumference - branchCoverage / 100 * circumference : circumference;

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [/*#__PURE__*/

        _jsxDEV(motion.div, {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          className: "backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-xl p-6 border border-white/20 dark:border-slate-700/50 flex flex-col items-center", children: [/*#__PURE__*/

          _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4", children: "Line Coverage" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "relative w-24 h-24", children: [/*#__PURE__*/
            _jsxDEV("svg", { className: "w-24 h-24 transform -rotate-90", children: [/*#__PURE__*/
              _jsxDEV("circle", {
                cx: "48",
                cy: "48",
                r: radius,
                className: "fill-none stroke-gray-200 dark:stroke-gray-700",
                strokeWidth: "8" }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("circle", {
                cx: "48",
                cy: "48",
                r: radius,
                className: `fill-none ${getCoverageRingColor(lineCoverage)} transition-all duration-1000`,
                strokeWidth: "8",
                strokeLinecap: "round",
                strokeDasharray: circumference,
                strokeDashoffset: lineOffset }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "absolute inset-0 flex items-center justify-center", children: /*#__PURE__*/
              _jsxDEV("span", { className: `text-xl font-bold ${getCoverageColor(lineCoverage)}`, children:
                lineCoverage != null ? `${lineCoverage.toFixed(1)}%` : '-' }, void 0, false
              ) }, void 0, false
            )] }, void 0, true
          ),
          coverageChange !== undefined && coverageChange !== null && /*#__PURE__*/
          _jsxDEV("div", { className: `flex items-center gap-1 mt-3 text-sm ${getChangeColor(coverageChange)}`, children: [
            getChangeIcon(coverageChange), /*#__PURE__*/
            _jsxDEV("span", { children: [coverageChange > 0 ? '+' : '', coverageChange.toFixed(1), "%"] }, void 0, true)] }, void 0, true
          )] }, void 0, true

        ), /*#__PURE__*/


        _jsxDEV(motion.div, {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.1 },
          className: "backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-xl p-6 border border-white/20 dark:border-slate-700/50 flex flex-col items-center", children: [/*#__PURE__*/

          _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4", children: "Branch Coverage" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "relative w-24 h-24", children: [/*#__PURE__*/
            _jsxDEV("svg", { className: "w-24 h-24 transform -rotate-90", children: [/*#__PURE__*/
              _jsxDEV("circle", {
                cx: "48",
                cy: "48",
                r: radius,
                className: "fill-none stroke-gray-200 dark:stroke-gray-700",
                strokeWidth: "8" }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("circle", {
                cx: "48",
                cy: "48",
                r: radius,
                className: `fill-none ${getCoverageRingColor(branchCoverage)} transition-all duration-1000`,
                strokeWidth: "8",
                strokeLinecap: "round",
                strokeDasharray: circumference,
                strokeDashoffset: branchOffset }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "absolute inset-0 flex items-center justify-center", children: /*#__PURE__*/
              _jsxDEV("span", { className: `text-xl font-bold ${getCoverageColor(branchCoverage)}`, children:
                branchCoverage != null ? `${branchCoverage.toFixed(1)}%` : '-' }, void 0, false
              ) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ),


        'totalLines' in coverage && coverage.totalLines !== undefined && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.2 },
          className: "backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-xl p-6 border border-white/20 dark:border-slate-700/50", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide", children: "Lines" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV(CodeBracketIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Total" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "font-semibold text-gray-900 dark:text-white", children:
                coverage.totalLines?.toLocaleString() }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Covered" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "font-semibold text-emerald-500", children:
                coverage.coveredLines?.toLocaleString() }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Missing" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "font-semibold text-red-500", children:
                coverage.missingLines?.toLocaleString() }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/



        _jsxDEV(motion.div, {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.3 },
          className: "backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-xl p-6 border border-white/20 dark:border-slate-700/50", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide", children: "Tool" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV(ChartBarIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "px-3 py-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg", children: /*#__PURE__*/
              _jsxDEV("span", { className: "text-sm font-medium text-blue-700 dark:text-blue-400 capitalize", children:
                coverage.coverageTool || 'Unknown' }, void 0, false
              ) }, void 0, false
            ),
            'statementCoverage' in coverage && coverage.statementCoverage !== undefined && /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Statements" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: `font-semibold ${getCoverageColor(coverage.statementCoverage)}`, children: [
                coverage.statementCoverage?.toFixed(1), "%"] }, void 0, true
              )] }, void 0, true
            ),

            'functionCoverage' in coverage && coverage.functionCoverage !== undefined && /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Functions" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: `font-semibold ${getCoverageColor(coverage.functionCoverage)}`, children: [
                coverage.functionCoverage?.toFixed(1), "%"] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ),


      coverageData?.[0]?.lowestCoverageFiles && coverageData[0].lowestCoverageFiles.length > 0 && /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.4 },
        className: "backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-xl border border-amber-200/50 dark:border-amber-500/30 overflow-hidden", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "px-4 py-3 bg-amber-50/50 dark:bg-amber-500/10 border-b border-amber-200/50 dark:border-amber-500/30 flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV(ExclamationTriangleIcon, { className: "h-5 w-5 text-amber-500" }, void 0, false), /*#__PURE__*/
          _jsxDEV("h3", { className: "font-semibold text-amber-700 dark:text-amber-400", children: "Files Needing Attention" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("span", { className: "text-xs text-amber-600 dark:text-amber-500", children: "(Lowest coverage)" }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "divide-y divide-gray-200/50 dark:divide-slate-700/50", children:
          coverageData[0].lowestCoverageFiles.slice(0, 10).map((file, index) => /*#__PURE__*/
          _jsxDEV("div", {

            className: "px-4 py-3 flex items-center gap-4 hover:bg-gray-50/50 dark:hover:bg-slate-700/30", children: [/*#__PURE__*/

            _jsxDEV(FolderIcon, { className: "h-5 w-5 text-gray-400 flex-shrink-0" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "flex-1 min-w-0", children: /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white truncate font-mono", children:
                file.file }, void 0, false
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "text-right", children: [/*#__PURE__*/
                _jsxDEV("div", { className: `text-sm font-semibold ${getCoverageColor(file.lineCoverage)}`, children: [
                  file.lineCoverage.toFixed(1), "%"] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: "lines" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "w-24", children: /*#__PURE__*/
                _jsxDEV("div", { className: "h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", children: /*#__PURE__*/
                  _jsxDEV("div", {
                    className: `h-full ${getCoverageBg(file.lineCoverage)} transition-all duration-500`,
                    style: { width: `${file.lineCoverage}%` } }, void 0, false
                  ) }, void 0, false
                ) }, void 0, false
              )] }, void 0, true
            )] }, file.file || index, true
          )
          ) }, void 0, false
        )] }, void 0, true
      ),



      coverageData?.[0] && (coverageData[0].reportUrl || coverageData[0].lcovUrl) && /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.5 },
        className: "backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 border border-white/20 dark:border-slate-700/50", children: /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
          _jsxDEV(DocumentTextIcon, { className: "h-5 w-5 text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Coverage Reports:" }, void 0, false

          ),
          coverageData[0].reportUrl && /*#__PURE__*/
          _jsxDEV("a", {
            href: coverageData[0].reportUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-sm text-blue-600 dark:text-blue-400 hover:underline", children:
            "HTML Report" }, void 0, false

          ),

          coverageData[0].lcovUrl && /*#__PURE__*/
          _jsxDEV("a", {
            href: coverageData[0].lcovUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-sm text-blue-600 dark:text-blue-400 hover:underline", children:
            "LCOV File" }, void 0, false

          )] }, void 0, true

        ) }, void 0, false
      )] }, void 0, true

    ));

}
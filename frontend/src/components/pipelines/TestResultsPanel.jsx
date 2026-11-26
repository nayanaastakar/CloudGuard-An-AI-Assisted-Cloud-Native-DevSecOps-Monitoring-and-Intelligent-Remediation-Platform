import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  MinusCircleIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BeakerIcon,
  ExclamationTriangleIcon } from
'@heroicons/react/24/outline';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";












































export default function TestResultsPanel({ testResults, testSummary, isLoading }) {
  const [expandedTests, setExpandedTests] = useState(new Set());
  const [showFailedOnly, setShowFailedOnly] = useState(false);

  const toggleTest = (testId) => {
    const newExpanded = new Set(expandedTests);
    if (newExpanded.has(testId)) {
      newExpanded.delete(testId);
    } else {
      newExpanded.add(testId);
    }
    setExpandedTests(newExpanded);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return /*#__PURE__*/_jsxDEV(CheckCircleIcon, { className: "h-5 w-5 text-emerald-500" }, void 0, false);
      case 'failed':
        return /*#__PURE__*/_jsxDEV(XCircleIcon, { className: "h-5 w-5 text-red-500" }, void 0, false);
      case 'skipped':
        return /*#__PURE__*/_jsxDEV(MinusCircleIcon, { className: "h-5 w-5 text-gray-400" }, void 0, false);
      case 'error':
        return /*#__PURE__*/_jsxDEV(ExclamationTriangleIcon, { className: "h-5 w-5 text-amber-500" }, void 0, false);
      default:
        return /*#__PURE__*/_jsxDEV(ClockIcon, { className: "h-5 w-5 text-gray-400" }, void 0, false);
    }
  };

  const getPassRateColor = (rate) => {
    if (rate >= 90) return 'text-emerald-500';
    if (rate >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  const getPassRateBg = (rate) => {
    if (rate >= 90) return 'bg-emerald-500';
    if (rate >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '-';
    if (seconds < 1) return `${Math.round(seconds * 1000)}ms`;
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  if (isLoading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center py-12", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-col items-center gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children: "Loading test results..." }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ));

  }

  // Use testSummary if testResults not available
  const summary = testResults?.[0] || testSummary;

  if (!summary) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex flex-col items-center justify-center py-12", children: [/*#__PURE__*/
        _jsxDEV(BeakerIcon, { className: "h-12 w-12 text-gray-400 mb-4" }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 text-lg font-medium", children: "No test results available" }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { className: "text-gray-400 dark:text-gray-500 text-sm mt-1", children: "Tests will appear here after the pipeline runs" }, void 0, false

        )] }, void 0, true
      ));

  }

  const passRate = summary.passRate || 0;
  const totalTests = summary.totalTests || 0;
  const passedTests = summary.passedTests || 0;
  const failedTests = summary.failedTests || 0;
  const skippedTests = summary.skippedTests || 0;
  const errorTests = summary.errorTests ?? 0;

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4", children: [/*#__PURE__*/

        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "col-span-2 md:col-span-1 backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 border border-white/20 dark:border-slate-700/50", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide", children: "Pass Rate" }, void 0, false), /*#__PURE__*/
            _jsxDEV(BeakerIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: `text-2xl font-bold ${getPassRateColor(passRate)}`, children: [
            passRate.toFixed(1), "%"] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", children: /*#__PURE__*/
            _jsxDEV("div", {
              className: `h-full ${getPassRateBg(passRate)} transition-all duration-500`,
              style: { width: `${passRate}%` } }, void 0, false
            ) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 },
          className: "backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 border border-white/20 dark:border-slate-700/50", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide", children: "Total" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "h-2 w-2 rounded-full bg-blue-500" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: totalTests }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.2 },
          className: "backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 border border-white/20 dark:border-slate-700/50", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide", children: "Passed" }, void 0, false), /*#__PURE__*/
            _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 text-emerald-500" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "text-2xl font-bold text-emerald-500", children: passedTests }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.3 },
          className: "backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 border border-white/20 dark:border-slate-700/50", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide", children: "Failed" }, void 0, false), /*#__PURE__*/
            _jsxDEV(XCircleIcon, { className: "h-4 w-4 text-red-500" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "text-2xl font-bold text-red-500", children: failedTests }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.4 },
          className: "backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-xl p-4 border border-white/20 dark:border-slate-700/50", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide", children: "Skipped" }, void 0, false), /*#__PURE__*/
            _jsxDEV(MinusCircleIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "text-2xl font-bold text-gray-500 dark:text-gray-400", children: skippedTests + errorTests }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ),


      testResults?.[0]?.testDetails && testResults[0].testDetails.length > 0 && /*#__PURE__*/
      _jsxDEV("div", { className: "backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-xl border border-white/20 dark:border-slate-700/50 overflow-hidden", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "px-4 py-3 border-b border-gray-200/50 dark:border-slate-700/50 flex items-center justify-between", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Test Details" }, void 0, false),
            summary.framework && /*#__PURE__*/
            _jsxDEV("span", { className: "px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium", children:
              summary.framework }, void 0, false
            ),

            'durationSeconds' in summary && typeof summary.durationSeconds === 'number' && summary.durationSeconds > 0 && /*#__PURE__*/
            _jsxDEV("span", { className: "flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
              _jsxDEV(ClockIcon, { className: "h-3.5 w-3.5" }, void 0, false),
              formatDuration(summary.durationSeconds)] }, void 0, true
            )] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("label", { className: "flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer", children: [/*#__PURE__*/
            _jsxDEV("input", {
              type: "checkbox",
              checked: showFailedOnly,
              onChange: (e) => setShowFailedOnly(e.target.checked),
              className: "rounded border-gray-300 dark:border-gray-600 text-red-500 focus:ring-red-500 focus:ring-offset-0" }, void 0, false
            ), "Show failed only"] }, void 0, true

          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "divide-y divide-gray-200/50 dark:divide-slate-700/50 max-h-96 overflow-y-auto", children:
          testResults[0].testDetails.
          filter((test) => !showFailedOnly || test.status === 'failed' || test.status === 'error').
          map((test, index) => /*#__PURE__*/
          _jsxDEV(motion.div, {

            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: index * 0.02 },
            className: "hover:bg-gray-50/50 dark:hover:bg-slate-700/30", children: [/*#__PURE__*/

            _jsxDEV("div", {
              className: "px-4 py-3 flex items-center gap-3 cursor-pointer",
              onClick: () => test.errorMessage && toggleTest(`${test.name}-${index}`), children: [

              getStatusIcon(test.status), /*#__PURE__*/
              _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white truncate", children:
                  test.name }, void 0, false
                ),
                test.file && /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 truncate", children:
                  test.file }, void 0, false
                )] }, void 0, true

              ),
              test.duration !== undefined && /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children:
                formatDuration(test.duration / 1000) }, void 0, false
              ),

              test.errorMessage && /*#__PURE__*/
              _jsxDEV("span", { className: "text-gray-400", children:
                expandedTests.has(`${test.name}-${index}`) ? /*#__PURE__*/
                _jsxDEV(ChevronDownIcon, { className: "h-4 w-4" }, void 0, false) : /*#__PURE__*/

                _jsxDEV(ChevronRightIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false

              )] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV(AnimatePresence, { children:
              test.errorMessage && expandedTests.has(`${test.name}-${index}`) && /*#__PURE__*/
              _jsxDEV(motion.div, {
                initial: { height: 0, opacity: 0 },
                animate: { height: 'auto', opacity: 1 },
                exit: { height: 0, opacity: 0 },
                className: "overflow-hidden", children: /*#__PURE__*/

                _jsxDEV("div", { className: "px-4 pb-3 pl-12", children: /*#__PURE__*/
                  _jsxDEV("pre", { className: "text-xs bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg p-3 text-red-700 dark:text-red-400 overflow-x-auto whitespace-pre-wrap", children:
                    test.errorMessage }, void 0, false
                  ) }, void 0, false
                ) }, void 0, false
              ) }, void 0, false

            )] }, `${test.name}-${index}`, true
          )
          ) }, void 0, false
        ),


        (testResults[0].reportUrl || testResults[0].junitXmlUrl) && /*#__PURE__*/
        _jsxDEV("div", { className: "px-4 py-3 border-t border-gray-200/50 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-900/30", children: /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Reports:" }, void 0, false),
            testResults[0].reportUrl && /*#__PURE__*/
            _jsxDEV("a", {
              href: testResults[0].reportUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-xs text-blue-600 dark:text-blue-400 hover:underline", children:
              "HTML Report" }, void 0, false

            ),

            testResults[0].junitXmlUrl && /*#__PURE__*/
            _jsxDEV("a", {
              href: testResults[0].junitXmlUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-xs text-blue-600 dark:text-blue-400 hover:underline", children:
              "JUnit XML" }, void 0, false

            )] }, void 0, true

          ) }, void 0, false
        )] }, void 0, true

      ),



      testResults?.[0]?.failedTestNames && testResults[0].failedTestNames.length > 0 && !testResults[0].testDetails?.length && /*#__PURE__*/
      _jsxDEV("div", { className: "backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 rounded-xl border border-red-200/50 dark:border-red-500/30 overflow-hidden", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "px-4 py-3 bg-red-50/50 dark:bg-red-500/10 border-b border-red-200/50 dark:border-red-500/30", children: /*#__PURE__*/
          _jsxDEV("h3", { className: "font-semibold text-red-700 dark:text-red-400 flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(XCircleIcon, { className: "h-5 w-5" }, void 0, false), "Failed Tests (",
            testResults[0].failedTestNames.length, ")"] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "p-4 space-y-2", children:
          testResults[0].failedTestNames.map((name, index) => /*#__PURE__*/
          _jsxDEV("div", {

            className: "flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300", children: [/*#__PURE__*/

            _jsxDEV(XCircleIcon, { className: "h-4 w-4 text-red-500 flex-shrink-0" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "font-mono truncate", children: name }, void 0, false)] }, index, true
          )
          ) }, void 0, false
        )] }, void 0, true
      )] }, void 0, true

    ));

}
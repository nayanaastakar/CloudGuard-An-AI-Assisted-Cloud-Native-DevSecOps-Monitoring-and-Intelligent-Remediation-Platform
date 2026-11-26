import { motion } from 'framer-motion';
import {
  InformationCircleIcon,
  SparklesIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  HeartIcon,
  GlobeAltIcon } from
'@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const features = [
{
  icon: ShieldCheckIcon,
  name: 'Security Posture & CIS Benchmarks',
  description: 'Continuous audit of Pod Security Standards, RBAC risks, and network policy default-deny coverage with explainable scoring.'
},
{
  icon: SparklesIcon,
  name: 'AI Incident Investigation',
  description: 'Autonomous correlation of Kubernetes events, container logs, and vulnerabilities with Gemini AI root-cause analysis.'
},
{
  icon: CodeBracketIcon,
  name: 'Attack Path Graph Analysis',
  description: 'Visual relationship modeling connecting public entry points, vulnerable workloads, overprivileged service accounts, and cluster secrets.'
},
{
  icon: RocketLaunchIcon,
  name: 'Intelligent Remediation Planner',
  description: 'Server-side dry-run validated corrective YAML manifests with side-by-side diffs and human-in-the-loop approval workflows.'
}];


const techStack = [
{ name: 'React', version: '18.x' },
{ name: 'TypeScript', version: '5.x' },
{ name: 'Tailwind CSS', version: '3.x' },
{ name: 'FastAPI', version: '0.109.x' },
{ name: 'Python', version: '3.11+' },
{ name: 'Trivy Scanner', version: '0.58.x' },
{ name: 'Google Gemini', version: '2.5 Flash' },
{ name: 'Kubernetes Client', version: '28.x' }];


export default function AboutPage() {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6 max-w-4xl mx-auto", children: [/*#__PURE__*/
      _jsxDEV(PageHeader, {
        title: "About CloudGuard",
        description: "An AI-Assisted Cloud-Native DevSecOps Monitoring and Intelligent Remediation Platform",
        icon: InformationCircleIcon,
        iconColor: "primary" }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 via-primary-500/10 to-purple-500/10 border border-primary-500/20", children: [/*#__PURE__*/


        _jsxDEV("div", { className: "absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }, void 0, false), /*#__PURE__*/

        _jsxDEV("div", { className: "relative flex items-start gap-6", children: [/*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { scale: 0.5, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { delay: 0.2, type: 'spring' },
            className: "p-4 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 shadow-xl shadow-cyan-500/30", children: /*#__PURE__*/

            _jsxDEV(ShieldCheckIcon, { className: "h-10 w-10 text-white" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
            _jsxDEV(motion.h2, {
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: 0.3 },
              className: "text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2", children:
              "CloudGuard" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV(motion.p, {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.4 },
              className: "text-gray-600 dark:text-gray-300 mb-4", children:
              "Secure, Analyse and Optimise Your Cloud-Native Infrastructure. A unified security-first platform designed to identify security weaknesses, analyze vulnerabilities, correlate incidents, investigate root causes, and recommend safe, validated remediation actions." }, void 0, false



            ), /*#__PURE__*/
            _jsxDEV(motion.div, {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.5 },
              className: "flex items-center gap-4", children: [/*#__PURE__*/

              _jsxDEV("span", { className: "px-3 py-1 text-sm font-medium rounded-full bg-primary-500/20 text-primary-600 dark:text-primary-400", children: "v2.0.0" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("span", { className: "flex items-center gap-1 text-sm text-green-600 dark:text-green-400", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }, void 0, false), "DevSecOps Enterprise Release"] }, void 0, true

              )] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { children: [/*#__PURE__*/
        _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4", children: "Key Features" }, void 0, false

        ), /*#__PURE__*/
        _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children:
          features.map((feature, index) => /*#__PURE__*/
          _jsxDEV(motion.div, {

            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: index * 0.1 },
            className: "p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/

            _jsxDEV("div", { className: "flex items-start gap-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30", children: /*#__PURE__*/
                _jsxDEV(feature.icon, { className: "h-5 w-5 text-primary-600 dark:text-primary-400" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white mb-1", children:
                  feature.name }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children:
                  feature.description }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            ) }, feature.name, false
          )
          ) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.4 },
        className: "p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [/*#__PURE__*/
          _jsxDEV(CodeBracketIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false), /*#__PURE__*/
          _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100", children: "Technology Stack" }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-wrap gap-2", children:
          techStack.map((tech) => /*#__PURE__*/
          _jsxDEV("span", {

            className: "px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-sm font-medium text-gray-700 dark:text-gray-300", children: [

            tech.name, " ", /*#__PURE__*/_jsxDEV("span", { className: "text-gray-400 dark:text-gray-500", children: tech.version }, void 0, false)] }, tech.name, true
          )
          ) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [/*#__PURE__*/
        _jsxDEV(motion.a, {
          href: "https://github.com/nexsight/nexsight-ai",
          target: "_blank",
          rel: "noopener noreferrer",
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.5 },
          whileHover: { scale: 1.02 },
          className: "flex items-center gap-4 p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 hover:border-primary-500/50 transition-colors", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "p-3 rounded-xl bg-gray-900 dark:bg-gray-700", children: /*#__PURE__*/
            _jsxDEV(CodeBracketIcon, { className: "h-6 w-6 text-white" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white", children: "GitHub Repository" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "View source code and contribute" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV(motion.a, {
          href: "https://docs.nexsight.ai",
          target: "_blank",
          rel: "noopener noreferrer",
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.5 },
          whileHover: { scale: 1.02 },
          className: "flex items-center gap-4 p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 hover:border-primary-500/50 transition-colors", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "p-3 rounded-xl bg-blue-500", children: /*#__PURE__*/
            _jsxDEV(GlobeAltIcon, { className: "h-6 w-6 text-white" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white", children: "Documentation" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Learn how to use CloudGuard" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV(motion.div, {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.6 },
        className: "text-center py-6", children: [/*#__PURE__*/

        _jsxDEV("p", { className: "flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400", children: ["Built with ", /*#__PURE__*/
          _jsxDEV(HeartIcon, { className: "h-4 w-4 text-red-500" }, void 0, false), " by the CloudGuard Team"] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("p", { className: "text-xs text-gray-400 dark:text-gray-500 mt-2", children: ["© ",
          new Date().getFullYear(), " CloudGuard. All rights reserved."] }, void 0, true
        )] }, void 0, true
      )] }, void 0, true
    ));

}
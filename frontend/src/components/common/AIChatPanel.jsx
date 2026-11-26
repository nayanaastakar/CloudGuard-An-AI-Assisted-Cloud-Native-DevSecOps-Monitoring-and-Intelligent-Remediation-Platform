import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  CommandLineIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  ArrowPathIcon,
  MinusIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ClipboardIcon,
  CheckIcon,
  ShieldExclamationIcon,
  ArrowsRightLeftIcon,
  WrenchScrewdriverIcon,
  DocumentMagnifyingGlassIcon,
  BuildingLibraryIcon,
  BugAntIcon,
  CircleStackIcon,
  CurrencyDollarIcon } from
'@heroicons/react/24/outline';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";












const quickActions = [
{ icon: ShieldCheckIcon, label: 'Cluster Posture', prompt: 'Audit Kubernetes cluster security posture and identify critical PSS misconfigurations' },
{ icon: ArrowsRightLeftIcon, label: 'Attack Paths', prompt: 'Analyze active attack paths and lateral movement risks from pods to cloud IAM or secrets' },
{ icon: BugAntIcon, label: 'Vulnerabilities', prompt: 'Summarize critical CVE vulnerabilities discovered by Trivy container image scans' },
{ icon: ShieldExclamationIcon, label: 'Falco Threats', prompt: 'Investigate recent Falco runtime security events, anomalies, and unauthorized shell executions' },
{ icon: WrenchScrewdriverIcon, label: 'Remediation', prompt: 'Generate an automated remediation plan with Kubernetes YAML diffs for top risks' },
{ icon: BuildingLibraryIcon, label: 'CIS Benchmark', prompt: 'Assess CIS Kubernetes benchmark compliance and generate an audit readiness report' },
{ icon: DocumentMagnifyingGlassIcon, label: 'Root Cause', prompt: 'Perform root cause analysis on failing pods, CrashLoopBackOff, and OOMKilled events' },
{ icon: CpuChipIcon, label: 'Resources & Limits', prompt: 'Analyze pod resource requests, limits, and cpu/memory starvation risks' },
{ icon: CommandLineIcon, label: 'Deployments', prompt: 'Check the rollout status, replica health, and degradation of recent deployments' },
{ icon: CurrencyDollarIcon, label: 'Cost Optimization', prompt: 'Identify overprovisioned workloads and idle resources to optimize cloud cluster costs' }];


const API_BASE = import.meta.env.VITE_API_URL ?? '';

// Code block component with copy functionality
function CodeBlock({ code, language, isDark, isMaximized }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "relative group my-2", children: [/*#__PURE__*/
      _jsxDEV("button", {
        onClick: handleCopy,
        className: "absolute right-2 top-2 p-1.5 rounded-md bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity z-10",
        title: "Copy code", children:

        copied ? /*#__PURE__*/
        _jsxDEV(CheckIcon, { className: "h-3.5 w-3.5 text-success-400" }, void 0, false) : /*#__PURE__*/

        _jsxDEV(ClipboardIcon, { className: "h-3.5 w-3.5" }, void 0, false) }, void 0, false

      ), /*#__PURE__*/
      _jsxDEV(SyntaxHighlighter, {
        language: language || 'text',
        style: isDark ? vscDarkPlus : vs,
        customStyle: {
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: isMaximized ? '0.8rem' : '0.7rem',
          padding: '0.75rem',
          maxHeight: isMaximized ? '500px' : '300px'
        },
        wrapLongLines: true, children:

        code }, void 0, false
      )] }, void 0, true
    ));

}

export default function AIChatPanel({ onClose }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [messages, setMessages] = useState([
  {
    id: '1',
    role: 'assistant',
    content: 'Hi! I\'m your CloudGuard DevSecOps AI assistant. How can I help you investigate incidents, audit security posture, or plan remediations today?',
    timestamp: new Date()
  }]
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Escape key to restore when maximized
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMaximized) {
        setIsMaximized(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMaximized]);

  useEffect(() => {
    inputRef.current?.focus();
    // Check AI health on mount
    checkAIHealth();
    // Detect dark mode
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches || document.documentElement.classList.contains('dark'));

    const handleDarkModeChange = (e) => {
      setIsDarkMode(e.matches || document.documentElement.classList.contains('dark'));
    };

    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
  }, []);

  const checkAIHealth = async () => {
    try {
      const token = localStorage.getItem("cloudguard_token");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE}/api/v1/ai/health`, { headers });
      const data = await response.json();
      setAiAvailable(data.status === 'available');
    } catch {
      setAiAvailable(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem("cloudguard_token");
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE}/api/v1/ai/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: userMessage.content })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorDetail = data.detail || data.message || 'AI service unavailable';
        throw new Error(typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail));
      }

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: err.message || 'Sorry, I\'m having trouble connecting to the AI service. Please check that the backend is running and GEMINI_API_KEY is configured.',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  // Minimized view
  if (isMinimized) {
    return (/*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "fixed right-4 bottom-4 z-50", children: /*#__PURE__*/

        _jsxDEV(motion.button, {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          onClick: () => setIsMinimized(false),
          className: "flex items-center gap-3 px-4 py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "p-1.5 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500", children: /*#__PURE__*/
            _jsxDEV(SparklesIcon, { className: "h-4 w-4 text-white" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: "CloudGuard AI" }, void 0, false), /*#__PURE__*/
          _jsxDEV(ArrowsPointingOutIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ));

  }

  return (/*#__PURE__*/
    _jsxDEV(_Fragment, { children: [/*#__PURE__*/

      _jsxDEV(AnimatePresence, { children:
        isMaximized && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.2 },
          onClick: () => setIsMaximized(false),
          className: "fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-40",
          "aria-hidden": "true" }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/

      _jsxDEV(motion.div, {
        layout: true,
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: {
          layout: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
          opacity: { duration: 0.2 },
          scale: { duration: 0.2 }
        },
        className: `fixed z-50 flex flex-col transition-shadow duration-300 ${
        isMaximized ?
        'inset-2 sm:inset-0 m-auto w-[calc(100vw-1rem)] sm:w-[85vw] max-w-5xl h-[calc(100dvh-1rem)] sm:h-[85vh] shadow-2xl' :
        'bottom-4 right-4 top-auto left-auto m-0 w-[calc(100vw-2rem)] sm:w-96 h-[460px] max-h-[85vh] shadow-2xl'}`, children: /*#__PURE__*/


        _jsxDEV("div", { className: "flex-1 min-h-0 flex flex-col bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex-shrink-0 flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-gray-100/50 dark:border-slate-700/50 bg-gradient-to-r from-primary-500/10 to-purple-500/10", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2.5", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-1.5 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 shadow-md shadow-primary-500/20", children: /*#__PURE__*/
                _jsxDEV(SparklesIcon, { className: "h-4 w-4 text-white" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: "CloudGuard AI" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: `w-1.5 h-1.5 rounded-full ${aiAvailable ? 'bg-success-500' : aiAvailable === false ? 'bg-danger-500' : 'bg-gray-400'}` }, void 0, false),
                  aiAvailable ? 'Online' : aiAvailable === false ? 'Offline' : 'Checking...'] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-1", children: [/*#__PURE__*/

              _jsxDEV(motion.button, {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                onClick: () => setIsMaximized(!isMaximized),
                className: "p-1.5 rounded-lg hover:bg-gray-100/50 dark:hover:bg-slate-700/50 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors",
                title: isMaximized ? "Restore" : "Maximize",
                "aria-label": isMaximized ? "Restore chat panel" : "Maximize chat panel", children:

                isMaximized ? /*#__PURE__*/
                _jsxDEV(ArrowsPointingInIcon, { className: "h-4 w-4" }, void 0, false) : /*#__PURE__*/

                _jsxDEV(ArrowsPointingOutIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false

              ), /*#__PURE__*/

              _jsxDEV(motion.button, {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                onClick: () => setIsMinimized(true),
                className: "p-1.5 rounded-lg hover:bg-gray-100/50 dark:hover:bg-slate-700/50 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors",
                title: "Minimize",
                "aria-label": "Minimize chat panel", children: /*#__PURE__*/

                _jsxDEV(MinusIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
              ), /*#__PURE__*/

              _jsxDEV(motion.button, {
                whileHover: { scale: 1.1 },
                whileTap: { scale: 0.9 },
                onClick: onClose,
                className: "p-1.5 rounded-lg hover:bg-gray-100/50 dark:hover:bg-slate-700/50 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors",
                title: "Close",
                "aria-label": "Close chat panel", children: /*#__PURE__*/

                _jsxDEV(XMarkIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 space-y-3 sm:space-y-4", children: [/*#__PURE__*/
            _jsxDEV(AnimatePresence, { children:
              messages.map((message) => /*#__PURE__*/
              _jsxDEV(motion.div, {

                initial: { opacity: 0, y: 8 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0 },
                className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`, children: /*#__PURE__*/

                _jsxDEV("div", {
                  className: `max-w-[85%] ${isMaximized ? 'sm:max-w-2xl lg:max-w-3xl' : ''} rounded-xl px-3.5 py-2.5 ${
                  message.role === 'user' ?
                  'bg-gradient-to-r from-primary-500 to-primary-600 text-white' :
                  'bg-gray-100/80 dark:bg-slate-700/80 text-gray-900 dark:text-gray-100'}`, children: [


                  message.role === 'user' ? /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs whitespace-pre-wrap leading-relaxed", children: message.content }, void 0, false) : /*#__PURE__*/

                  _jsxDEV("div", { className: "text-xs leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-headings:text-xs prose-headings:font-semibold prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-code:text-[10px] prose-code:bg-gray-200/50 dark:prose-code:bg-slate-600/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:my-2 prose-pre:p-0 prose-strong:font-semibold", children: /*#__PURE__*/
                    _jsxDEV(ReactMarkdown, {
                      components: {
                        code({ className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          const codeString = String(children).replace(/\n$/, '');
                          const isInline = !className || className === '';

                          return !isInline && match ? /*#__PURE__*/
                          _jsxDEV(CodeBlock, {
                            code: codeString,
                            language: match[1],
                            isDark: isDarkMode,
                            isMaximized: isMaximized }, void 0, false
                          ) : /*#__PURE__*/

                          _jsxDEV("code", { className: className, ...props, children:
                            children }, void 0, false
                          );

                        },
                        h1: ({ children }) => /*#__PURE__*/_jsxDEV("h1", { className: "text-xs font-bold mt-2 mb-1", children: children }, void 0, false),
                        h2: ({ children }) => /*#__PURE__*/_jsxDEV("h2", { className: "text-xs font-semibold mt-2 mb-1", children: children }, void 0, false),
                        h3: ({ children }) => /*#__PURE__*/_jsxDEV("h3", { className: "text-[11px] font-semibold mt-1.5 mb-0.5", children: children }, void 0, false),
                        p: ({ children }) => /*#__PURE__*/_jsxDEV("p", { className: "my-1 text-xs", children: children }, void 0, false),
                        ul: ({ children }) => /*#__PURE__*/_jsxDEV("ul", { className: "my-1 ml-3 list-disc text-xs space-y-0.5", children: children }, void 0, false),
                        ol: ({ children }) => /*#__PURE__*/_jsxDEV("ol", { className: "my-1 ml-3 list-decimal text-xs space-y-0.5", children: children }, void 0, false),
                        li: ({ children }) => /*#__PURE__*/_jsxDEV("li", { className: "text-xs", children: children }, void 0, false),
                        strong: ({ children }) => /*#__PURE__*/_jsxDEV("strong", { className: "font-semibold", children: children }, void 0, false),
                        a: ({ children, href }) => /*#__PURE__*/
                        _jsxDEV("a", {
                          href: href,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          className: "text-primary-500 hover:text-primary-600 underline", children:

                          children }, void 0, false
                        )

                      }, children:

                      message.content }, void 0, false
                    ) }, void 0, false
                  ), /*#__PURE__*/

                  _jsxDEV("p", { className: `text-[9px] mt-1 ${message.role === 'user' ? 'text-primary-200' : 'text-gray-400 dark:text-gray-500'}`, children:
                    message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, void 0, false
                  )] }, void 0, true
                ) }, message.id, false
              )
              ) }, void 0, false
            ),


            isLoading && /*#__PURE__*/
            _jsxDEV(motion.div, {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "flex justify-start", children: /*#__PURE__*/

              _jsxDEV("div", { className: "bg-gray-100/80 dark:bg-slate-700/80 rounded-xl px-3 py-2", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-1.5", children: [/*#__PURE__*/
                  _jsxDEV(ArrowPathIcon, { className: "h-3 w-3 animate-spin text-primary-500" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Thinking..." }, void 0, false)] }, void 0, true
                ) }, void 0, false
              ) }, void 0, false
            ), /*#__PURE__*/


            _jsxDEV("div", { ref: messagesEndRef }, void 0, false)] }, void 0, true
          ),


          messages.length === 1 && /*#__PURE__*/
          _jsxDEV("div", { className: "flex-shrink-0 px-3.5 py-2.5 sm:px-4 sm:py-3 border-t border-gray-100/50 dark:border-slate-700/50", children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-[10px] text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wider", children: "Quick actions:" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "grid grid-cols-2 gap-1.5", children:
              quickActions.map((action, index) => /*#__PURE__*/
              _jsxDEV(motion.button, {

                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                onClick: () => handleQuickAction(action.prompt),
                className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100/80 dark:bg-slate-700/50 text-[10px] text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-left", children: [/*#__PURE__*/

                _jsxDEV(action.icon, { className: "h-3 w-3 flex-shrink-0" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "truncate", children: action.label }, void 0, false)] }, index, true
              )
              ) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/



          _jsxDEV("form", { onSubmit: handleSubmit, className: "flex-shrink-0 p-3 sm:p-4 border-t border-gray-100/50 dark:border-slate-700/50", children: /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV("input", {
                ref: inputRef,
                type: "text",
                value: input,
                onChange: (e) => setInput(e.target.value),
                placeholder: "Ask anything...",
                className: "flex-1 px-3.5 py-2.5 rounded-xl bg-gray-100/80 dark:bg-slate-700/50 border border-gray-200/50 dark:border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xs sm:text-sm",
                disabled: isLoading }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV(motion.button, {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                type: "submit",
                disabled: !input.trim() || isLoading,
                className: "p-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all",
                title: "Send message",
                "aria-label": "Send message", children: /*#__PURE__*/

                _jsxDEV(PaperAirplaneIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true
    ));

}

// Floating trigger button component
export function AIChatTrigger({ onClick }) {
  return (/*#__PURE__*/
    _jsxDEV(motion.button, {
      initial: { scale: 0 },
      animate: { scale: 1 },
      whileHover: { scale: 1.1 },
      whileTap: { scale: 0.9 },
      onClick: onClick,
      className: "fixed right-4 bottom-4 p-3 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg shadow-primary-500/25 z-50", children: [/*#__PURE__*/

      _jsxDEV(ChatBubbleLeftRightIcon, { className: "h-5 w-5" }, void 0, false), /*#__PURE__*/
      _jsxDEV("span", { className: "absolute -top-1 -right-1 w-2.5 h-2.5 bg-success-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse" }, void 0, false)] }, void 0, true
    ));

}
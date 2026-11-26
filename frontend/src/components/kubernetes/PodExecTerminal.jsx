import { useState, useRef, useEffect } from 'react';
import {
  CommandLineIcon,
  XMarkIcon,
  PaperAirplaneIcon } from
'@heroicons/react/24/outline';
import { kubernetesApi } from '../../services/api';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";













export default function PodExecTerminal({ pod, onClose }) {
  const [selectedContainer, setSelectedContainer] = useState(pod.containers[0] || '');
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([
  {
    type: 'info',
    content: `Connected to pod: ${pod.namespace}/${pod.name}`,
    timestamp: new Date()
  },
  {
    type: 'info',
    content: 'Type a command and press Enter to execute. Common commands: ls, cat, env, ps aux',
    timestamp: new Date()
  }]
  );
  const [executing, setExecuting] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when new output is added
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  async function executeCommand() {
    if (!command.trim() || executing) return;

    const cmdParts = parseCommand(command);

    // Add command to history
    setHistory((prev) => [...prev, {
      type: 'input',
      content: `$ ${command}`,
      timestamp: new Date()
    }]);

    // Add to command history for up/down navigation
    setCommandHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);
    setCommand('');
    setExecuting(true);

    try {
      const response = await kubernetesApi.execPodCommand(
        pod.namespace,
        pod.name,
        cmdParts,
        selectedContainer || undefined
      );

      const result = response.data;

      if (result.stdout) {
        setHistory((prev) => [...prev, {
          type: 'output',
          content: result.stdout,
          timestamp: new Date()
        }]);
      }

      if (result.stderr) {
        setHistory((prev) => [...prev, {
          type: 'error',
          content: result.stderr,
          timestamp: new Date()
        }]);
      }

      if (result.exit_code !== 0) {
        setHistory((prev) => [...prev, {
          type: 'info',
          content: `Exit code: ${result.exit_code}`,
          timestamp: new Date()
        }]);
      }
    } catch (err) {
      let errorMessage = 'Failed to execute command';
      if (err && typeof err === 'object') {
        const axiosErr = err;
        if (axiosErr.response?.data?.detail) {
          errorMessage = axiosErr.response.data.detail;
        } else if (axiosErr.message) {
          errorMessage = axiosErr.message;
        }
      }
      setHistory((prev) => [...prev, {
        type: 'error',
        content: `Error: ${errorMessage}`,
        timestamp: new Date()
      }]);
    } finally {
      setExecuting(false);
      // Use setTimeout to ensure focus happens after React re-render
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }

  function parseCommand(cmd) {
    // Simple command parsing - split by spaces but respect quotes
    const parts = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    for (const char of cmd) {
      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = '';
      } else if (char === ' ' && !inQuotes) {
        if (current) {
          parts.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }
    if (current) {
      parts.push(current);
    }

    return parts;
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      executeCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ?
        commandHistory.length - 1 :
        Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCommand(commandHistory[newIndex]);
        }
      }
    }
  }

  function clearTerminal() {
    setHistory([{
      type: 'info',
      content: 'Terminal cleared',
      timestamp: new Date()
    }]);
  }

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: /*#__PURE__*/
      _jsxDEV("div", { className: "bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl h-[70vh] flex flex-col", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center justify-between p-4 border-b border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV(CommandLineIcon, { className: "h-6 w-6 text-green-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h2", { className: "text-lg font-semibold text-white", children: "Pod Terminal" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-400", children: [
                pod.namespace, "/", pod.name] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [

            pod.containers.length > 1 && /*#__PURE__*/
            _jsxDEV("select", {
              value: selectedContainer,
              onChange: (e) => setSelectedContainer(e.target.value),
              className: "px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white", children:

              pod.containers.map((c) => /*#__PURE__*/
              _jsxDEV("option", { value: c, children:
                c }, c, false
              )
              ) }, void 0, false
            ), /*#__PURE__*/

            _jsxDEV("button", {
              onClick: clearTerminal,
              className: "px-3 py-1.5 text-sm text-gray-400 hover:text-white", children:
              "Clear" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("button", { onClick: onClose, className: "p-2 hover:bg-gray-800 rounded-lg", children: /*#__PURE__*/
              _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-400" }, void 0, false) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", {
          ref: terminalRef,
          className: "flex-1 overflow-auto p-4 font-mono text-sm",
          onClick: () => inputRef.current?.focus(), children: [

          history.map((line, index) => /*#__PURE__*/
          _jsxDEV("div", {

            className: `whitespace-pre-wrap break-all ${
            line.type === 'input' ?
            'text-green-400' :
            line.type === 'error' ?
            'text-red-400' :
            line.type === 'info' ?
            'text-blue-400' :
            'text-gray-100'}`, children:


            line.content }, index, false
          )
          ),
          executing && /*#__PURE__*/
          _jsxDEV("div", { className: "text-yellow-400 animate-pulse", children: "Executing..." }, void 0, false)] }, void 0, true

        ), /*#__PURE__*/


        _jsxDEV("div", { className: "border-t border-gray-700 p-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-green-400 font-mono", children: "$" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              ref: inputRef,
              type: "text",
              value: command,
              onChange: (e) => setCommand(e.target.value),
              onKeyDown: handleKeyDown,
              placeholder: "Enter command...",
              disabled: executing,
              className: "flex-1 bg-transparent border-none outline-none text-white font-mono placeholder-gray-600",
              autoComplete: "off",
              spellCheck: false }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: executeCommand,
              disabled: executing || !command.trim(),
              className: "p-2 text-green-400 hover:bg-gray-800 rounded-lg disabled:opacity-50", children: /*#__PURE__*/

              _jsxDEV(PaperAirplaneIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-gray-500 mt-2", children: "Press Enter to execute. Use Up/Down arrows for command history." }, void 0, false

          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}
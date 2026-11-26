import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { kubernetesApi } from '../../services/api';
import { useTerminal } from '../../contexts/TerminalContext';
import {
  CommandLineIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ServerIcon } from
'@heroicons/react/24/outline';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";



const KUBECTL_QUICK_COMMANDS = [
{ label: 'Get Pods', command: 'get pods -A' },
{ label: 'Get Nodes', command: 'get nodes' },
{ label: 'Get Services', command: 'get svc -A' },
{ label: 'Get Deployments', command: 'get deployments -A' },
{ label: 'Get Namespaces', command: 'get namespaces' },
{ label: 'Get Events', command: 'get events -A --sort-by=.lastTimestamp' },
{ label: 'Cluster Info', command: 'cluster-info' },
{ label: 'Get ConfigMaps', command: 'get configmaps -A' },
{ label: 'Get Secrets', command: 'get secrets -A' },
{ label: 'Top Nodes', command: 'top nodes' },
{ label: 'Top Pods', command: 'top pods -A' },
{ label: 'API Resources', command: 'api-resources' }];


const SHELL_QUICK_COMMANDS = [
{ label: 'List Files', command: 'ls -la' },
{ label: 'Current Dir', command: 'pwd' },
{ label: 'Disk Usage', command: 'df -h' },
{ label: 'Memory Info', command: 'free -h' },
{ label: 'System Info', command: 'uname -a' },
{ label: 'Process List', command: 'ps aux | head -20' },
{ label: 'Network Info', command: 'ifconfig || ip addr' },
{ label: 'Environment', command: 'env | sort' },
{ label: 'Helm List', command: 'helm list -A' },
{ label: 'Docker PS', command: 'docker ps' },
{ label: 'Git Status', command: 'git status 2>/dev/null || echo "Not a git repo"' },
{ label: 'Curl Test', command: 'curl -s https://httpbin.org/get | head -10' }];


export default function KubectlTerminal() {
  const {
    state: { mode, history, commandHistory, workingDirectory },
    setMode,
    addHistoryEntry,
    addCommandToHistory,
    setWorkingDirectory,
    clearHistory
  } = useTerminal();

  const [command, setCommand] = useState('');
  const [executing, setExecuting] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const executeCommand = async (cmd) => {
    if (!cmd.trim() || executing) return;

    const trimmedCmd = cmd.trim();

    // Handle clear command
    if (trimmedCmd === 'clear') {
      clearHistory();
      setCommand('');
      return;
    }

    // Handle help command
    if (trimmedCmd === 'help') {
      const helpContent = mode === 'kubectl' ?
      `Available kubectl commands:
  get <resource>     - List resources (pods, nodes, svc, deployments, etc.)
  describe <resource> <name> - Show details of a resource
  logs <pod>         - Print pod logs
  explain <resource> - Documentation for a resource
  top nodes/pods     - Display resource usage
  api-resources      - List available API resources
  version            - Show kubectl version
  clear              - Clear terminal
  help               - Show this help

Note: Some dangerous commands are blocked for security.` :
      `Available shell commands:
  Any standard shell command is supported, including:
  ls, cat, pwd, cd, grep, find, curl, wget, etc.

  Special commands:
  clear              - Clear terminal
  help               - Show this help

  Installed tools available:
  kubectl, helm, docker, git, curl, wget, etc.

Note: Some dangerous commands are blocked for security.`;

      addHistoryEntry({
        type: 'input',
        content: mode === 'kubectl' ? `$ kubectl ${trimmedCmd}` : `$ ${trimmedCmd}`,
        timestamp: new Date()
      });
      addHistoryEntry({
        type: 'info',
        content: helpContent,
        timestamp: new Date()
      });
      setCommand('');
      return;
    }

    // Handle cd command in shell mode
    if (mode === 'shell' && trimmedCmd.startsWith('cd ')) {
      const newDir = trimmedCmd.substring(3).trim();
      setWorkingDirectory(newDir || '~');
      addHistoryEntry({
        type: 'input',
        content: `$ ${trimmedCmd}`,
        timestamp: new Date()
      });
      addHistoryEntry({
        type: 'info',
        content: `Changed directory to: ${newDir || '~'}`,
        timestamp: new Date()
      });
      setCommand('');
      return;
    }

    // Add to history display
    addHistoryEntry({
      type: 'input',
      content: mode === 'kubectl' ? `$ kubectl ${trimmedCmd}` : `$ ${trimmedCmd}`,
      timestamp: new Date()
    });

    // Add to command history for navigation
    addCommandToHistory(trimmedCmd);
    setHistoryIndex(-1);
    setCommand('');
    setExecuting(true);

    try {
      if (mode === 'kubectl') {
        const response = await kubernetesApi.executeKubectl({
          command: trimmedCmd,
          timeout: 60
        });

        if (response.data.success) {
          if (response.data.stdout) {
            addHistoryEntry({
              type: 'output',
              content: response.data.stdout,
              timestamp: new Date(),
              executionTime: response.data.execution_time
            });
          } else {
            addHistoryEntry({
              type: 'info',
              content: 'Command executed successfully (no output)',
              timestamp: new Date(),
              executionTime: response.data.execution_time
            });
          }
        } else {
          addHistoryEntry({
            type: 'error',
            content: response.data.stderr || 'Command failed',
            timestamp: new Date(),
            executionTime: response.data.execution_time
          });
        }
      } else {
        // Shell mode
        const response = await kubernetesApi.executeShell({
          command: trimmedCmd,
          timeout: 60,
          working_directory: workingDirectory
        });

        // Update working directory from response
        if (response.data.working_directory) {
          setWorkingDirectory(response.data.working_directory);
        }

        if (response.data.success) {
          if (response.data.stdout) {
            addHistoryEntry({
              type: 'output',
              content: response.data.stdout,
              timestamp: new Date(),
              executionTime: response.data.execution_time,
              workingDirectory: response.data.working_directory
            });
          } else {
            addHistoryEntry({
              type: 'info',
              content: 'Command executed successfully (no output)',
              timestamp: new Date(),
              executionTime: response.data.execution_time
            });
          }
        } else {
          addHistoryEntry({
            type: 'error',
            content: response.data.stderr || 'Command failed',
            timestamp: new Date(),
            executionTime: response.data.execution_time
          });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute command';
      addHistoryEntry({
        type: 'error',
        content: `Error: ${errorMessage}`,
        timestamp: new Date()
      });
    } finally {
      setExecuting(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(command);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      clearHistory();
    }
  };

  const handleClearTerminal = () => {
    clearHistory();
  };

  const runQuickCommand = (cmd) => {
    setCommand(cmd);
    executeCommand(cmd);
  };

  const toggleMode = (newMode) => {
    setMode(newMode);
    addHistoryEntry({
      type: 'info',
      content: `Switched to ${newMode === 'kubectl' ? 'Kubectl' : 'Shell'} mode`,
      timestamp: new Date()
    });
  };

  const quickCommands = mode === 'kubectl' ? KUBECTL_QUICK_COMMANDS : SHELL_QUICK_COMMANDS;

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h1", { className: "text-2xl font-semibold text-gray-900 dark:text-gray-100", children: "Terminal" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children:
            mode === 'kubectl' ?
            'Execute kubectl commands against your cluster' :
            'Execute shell commands on the backend server' }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "bg-gray-100 dark:bg-slate-700 rounded-lg p-1 flex", children: [/*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => toggleMode('kubectl'),
              className: `px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              mode === 'kubectl' ?
              'bg-white dark:bg-slate-600 text-primary-600 dark:text-primary-400 shadow-sm' :
              'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`, children: /*#__PURE__*/


              _jsxDEV("div", { className: "flex items-center gap-1.5", children: [/*#__PURE__*/
                _jsxDEV(ServerIcon, { className: "h-4 w-4" }, void 0, false), "Kubectl"] }, void 0, true

              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => toggleMode('shell'),
              className: `px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              mode === 'shell' ?
              'bg-white dark:bg-slate-600 text-primary-600 dark:text-primary-400 shadow-sm' :
              'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`, children: /*#__PURE__*/


              _jsxDEV("div", { className: "flex items-center gap-1.5", children: [/*#__PURE__*/
                _jsxDEV(CommandLineIcon, { className: "h-4 w-4" }, void 0, false), "Shell"] }, void 0, true

              ) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: handleClearTerminal,
            className: "inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors", children: [/*#__PURE__*/

            _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false), "Clear"] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-4", children: [/*#__PURE__*/
        _jsxDEV("h3", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-3", children: ["Quick Commands (",
          mode === 'kubectl' ? 'Kubectl' : 'Shell', ")"] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-wrap gap-2", children:
          quickCommands.map((qc) => /*#__PURE__*/
          _jsxDEV("button", {

            onClick: () => runQuickCommand(qc.command),
            disabled: executing,
            className: "px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50", children:

            qc.label }, qc.command, false
          )
          ) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "bg-gray-900 rounded-xl shadow-lg overflow-hidden", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(CommandLineIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "text-sm text-gray-300 font-mono", children:
              mode === 'kubectl' ? 'kubectl' : 'bash' }, void 0, false
            ),
            mode === 'shell' && /*#__PURE__*/
            _jsxDEV("span", { className: "text-xs text-gray-500 font-mono ml-2", children: ["(",
              workingDirectory, ")"] }, void 0, true
            )] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV("span", { className: `text-xs px-2 py-0.5 rounded ${
              mode === 'kubectl' ?
              'bg-blue-500/20 text-blue-400' :
              'bg-green-500/20 text-green-400'}`, children:

              mode === 'kubectl' ? 'K8s Mode' : 'Shell Mode' }, void 0, false
            ),
            executing && /*#__PURE__*/
            _jsxDEV("span", { className: "text-xs text-yellow-400 flex items-center gap-1", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "animate-spin h-3 w-3 border border-yellow-400 border-t-transparent rounded-full" }, void 0, false), "Executing..."] }, void 0, true

            )] }, void 0, true

          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", {
          ref: terminalRef,
          className: "h-[500px] overflow-y-auto p-4 font-mono text-sm",
          onClick: () => inputRef.current?.focus(), children: [

          history.map((entry, index) => /*#__PURE__*/
          _jsxDEV("div", { className: "mb-2", children: [
            entry.type === 'input' && /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-green-400 select-none", children: ">" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "text-white", children: entry.content }, void 0, false)] }, void 0, true
            ),

            entry.type === 'output' && /*#__PURE__*/
            _jsxDEV("div", { className: "pl-4", children: [/*#__PURE__*/
              _jsxDEV("pre", { className: "text-gray-300 whitespace-pre-wrap break-all", children: entry.content }, void 0, false),
              entry.executionTime !== undefined && /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-1 mt-1 text-xs text-gray-500", children: [/*#__PURE__*/
                _jsxDEV(ClockIcon, { className: "h-3 w-3" }, void 0, false),
                entry.executionTime, "s", /*#__PURE__*/
                _jsxDEV(CheckCircleIcon, { className: "h-3 w-3 text-green-500 ml-2" }, void 0, false)] }, void 0, true
              )] }, void 0, true

            ),

            entry.type === 'error' && /*#__PURE__*/
            _jsxDEV("div", { className: "pl-4", children: [/*#__PURE__*/
              _jsxDEV("pre", { className: "text-red-400 whitespace-pre-wrap break-all", children: entry.content }, void 0, false),
              entry.executionTime !== undefined && /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-1 mt-1 text-xs text-gray-500", children: [/*#__PURE__*/
                _jsxDEV(ClockIcon, { className: "h-3 w-3" }, void 0, false),
                entry.executionTime, "s", /*#__PURE__*/
                _jsxDEV(XCircleIcon, { className: "h-3 w-3 text-red-500 ml-2" }, void 0, false)] }, void 0, true
              )] }, void 0, true

            ),

            entry.type === 'info' && /*#__PURE__*/
            _jsxDEV("div", { className: "pl-4", children: /*#__PURE__*/
              _jsxDEV("pre", { className: "text-blue-400 whitespace-pre-wrap", children: entry.content }, void 0, false) }, void 0, false
            )] }, index, true

          )
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV("span", { className: "text-green-400 select-none", children: ">" }, void 0, false),
            mode === 'kubectl' && /*#__PURE__*/_jsxDEV("span", { className: "text-gray-500", children: "kubectl" }, void 0, false),
            mode === 'shell' && /*#__PURE__*/_jsxDEV("span", { className: "text-gray-500", children: [workingDirectory, "$"] }, void 0, true), /*#__PURE__*/
            _jsxDEV("input", {
              ref: inputRef,
              type: "text",
              value: command,
              onChange: (e) => setCommand(e.target.value),
              onKeyDown: handleKeyDown,
              disabled: executing,
              className: "flex-1 bg-transparent text-white outline-none font-mono",
              placeholder: executing ? 'Executing...' : 'Enter command...',
              autoComplete: "off",
              spellCheck: "false" }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: `border rounded-xl p-4 ${
        mode === 'kubectl' ?
        'bg-warning-50 dark:bg-warning-500/10 border-warning-200 dark:border-warning-500/30' :
        'bg-primary-50 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/30'}`, children: [/*#__PURE__*/

        _jsxDEV("h3", { className: `text-sm font-medium mb-2 ${
          mode === 'kubectl' ? 'text-warning-800 dark:text-warning-300' : 'text-primary-800 dark:text-primary-300'}`, children:
          "Tips & Shortcuts" }, void 0, false

        ), /*#__PURE__*/
        _jsxDEV("ul", { className: `text-sm space-y-1 ${
          mode === 'kubectl' ? 'text-warning-700 dark:text-warning-400' : 'text-primary-700 dark:text-primary-400'}`, children: [/*#__PURE__*/

          _jsxDEV("li", { children: ["- Press ", /*#__PURE__*/_jsxDEV("kbd", { className: `px-1.5 py-0.5 rounded text-xs font-mono ${
              mode === 'kubectl' ? 'bg-warning-100 dark:bg-warning-500/20' : 'bg-primary-100 dark:bg-primary-500/20'}`, children:
              "Enter" }, void 0, false), " to execute command"] }, void 0, true), /*#__PURE__*/
          _jsxDEV("li", { children: ["- Press ", /*#__PURE__*/_jsxDEV("kbd", { className: `px-1.5 py-0.5 rounded text-xs font-mono ${
              mode === 'kubectl' ? 'bg-warning-100 dark:bg-warning-500/20' : 'bg-primary-100 dark:bg-primary-500/20'}`, children:
              "Up/Down" }, void 0, false), " arrows to navigate command history"] }, void 0, true), /*#__PURE__*/
          _jsxDEV("li", { children: ["- Press ", /*#__PURE__*/_jsxDEV("kbd", { className: `px-1.5 py-0.5 rounded text-xs font-mono ${
              mode === 'kubectl' ? 'bg-warning-100 dark:bg-warning-500/20' : 'bg-primary-100 dark:bg-primary-500/20'}`, children:
              "Ctrl+L" }, void 0, false), " to clear terminal"] }, void 0, true), /*#__PURE__*/
          _jsxDEV("li", { children: ["- Type ", /*#__PURE__*/_jsxDEV("code", { className: `px-1.5 py-0.5 rounded text-xs font-mono ${
              mode === 'kubectl' ? 'bg-warning-100 dark:bg-warning-500/20' : 'bg-primary-100 dark:bg-primary-500/20'}`, children:
              "help" }, void 0, false), " for available commands"] }, void 0, true),
          mode === 'kubectl' ? /*#__PURE__*/
          _jsxDEV("li", { children: "- Commands like delete --all, drain, etc. are blocked for safety" }, void 0, false) : /*#__PURE__*/

          _jsxDEV("li", { children: "- Dangerous commands like rm -rf /, sudo su, etc. are blocked for safety" }, void 0, false)] }, void 0, true

        )] }, void 0, true
      )] }, void 0, true
    ));

}
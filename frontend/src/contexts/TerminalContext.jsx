import { createContext, useContext, useState, ReactNode } from 'react';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";




























const defaultState = {
  mode: 'kubectl',
  history: [
  {
    type: 'info',
    content: 'Welcome to CloudGuard Terminal. Use the toggle to switch between kubectl and shell modes.',
    timestamp: new Date()
  },
  {
    type: 'info',
    content: 'Type "help" for available commands.',
    timestamp: new Date()
  }],

  commandHistory: [],
  workingDirectory: '~'
};

const TerminalContext = /*#__PURE__*/createContext(undefined);

export function TerminalProvider({ children }) {
  const [state, setState] = useState(defaultState);

  const setMode = (mode) => {
    setState((prev) => ({ ...prev, mode }));
  };

  const addHistoryEntry = (entry) => {
    setState((prev) => ({
      ...prev,
      history: [...prev.history, entry]
    }));
  };

  const addCommandToHistory = (command) => {
    setState((prev) => ({
      ...prev,
      commandHistory: [...prev.commandHistory, command]
    }));
  };

  const setWorkingDirectory = (dir) => {
    setState((prev) => ({ ...prev, workingDirectory: dir }));
  };

  const clearHistory = () => {
    setState((prev) => ({
      ...prev,
      history: [{
        type: 'info',
        content: 'Terminal cleared',
        timestamp: new Date()
      }]
    }));
  };

  const setHistory = (history) => {
    setState((prev) => ({ ...prev, history }));
  };

  return (/*#__PURE__*/
    _jsxDEV(TerminalContext.Provider, {
      value: {
        state,
        setMode,
        addHistoryEntry,
        addCommandToHistory,
        setWorkingDirectory,
        clearHistory,
        setHistory
      }, children:

      children }, void 0, false
    ));

}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
}
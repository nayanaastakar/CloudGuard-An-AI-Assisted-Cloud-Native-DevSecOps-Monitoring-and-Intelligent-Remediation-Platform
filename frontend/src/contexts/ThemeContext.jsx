import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";









const ThemeContext = /*#__PURE__*/createContext(undefined);

function getInitialTheme() {
  // Check localStorage first
  const stored = localStorage.getItem('cloudguard-theme') || localStorage.getItem('CloudGuard-theme');
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  // Then check system preference
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    // Remove both classes first to ensure clean state
    root.classList.remove('light', 'dark');
    // Add the current theme class
    root.classList.add(theme);
    // Persist to localStorage
    localStorage.setItem('cloudguard-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prevTheme) => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
  }, []);

  return (/*#__PURE__*/
    _jsxDEV(ThemeContext.Provider, { value: { theme, toggleTheme, setTheme }, children:
      children }, void 0, false
    ));

}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
import { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";














/**
 * Error Boundary component that catches JavaScript errors anywhere in the child component tree.
 * Prevents the entire app from crashing and displays a fallback UI instead.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (/*#__PURE__*/
        _jsxDEV("div", { className: "min-h-[200px] flex items-center justify-center p-6", children: /*#__PURE__*/
          _jsxDEV("div", { className: "text-center max-w-md", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30", children: /*#__PURE__*/
              _jsxDEV(ExclamationTriangleIcon, { className: "h-6 w-6 text-red-600 dark:text-red-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("h3", { className: "mt-4 text-lg font-semibold text-gray-900 dark:text-white", children: "Something went wrong" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("p", { className: "mt-2 text-sm text-gray-500 dark:text-gray-400", children: "An unexpected error occurred. Please try again or contact support if the problem persists." }, void 0, false

            ),

            this.props.showDetails && this.state.error && /*#__PURE__*/
            _jsxDEV("details", { className: "mt-4 text-left", children: [/*#__PURE__*/
              _jsxDEV("summary", { className: "cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300", children: "Error details" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("pre", { className: "mt-2 p-3 bg-gray-100 dark:bg-slate-900 rounded-lg text-xs text-red-600 dark:text-red-400 overflow-auto max-h-40", children: [
                this.state.error.toString(),
                this.state.errorInfo?.componentStack] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("button", {
              onClick: this.handleReset,
              className: "mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors", children: [/*#__PURE__*/

              _jsxDEV(ArrowPathIcon, { className: "h-4 w-4" }, void 0, false), "Try again"] }, void 0, true

            )] }, void 0, true
          ) }, void 0, false
        ));

    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap any component with an error boundary
 */
export function withErrorBoundary(
WrappedComponent,
errorBoundaryProps)
{
  return function WithErrorBoundary(props) {
    return (/*#__PURE__*/
      _jsxDEV(ErrorBoundary, { ...errorBoundaryProps, children: /*#__PURE__*/
        _jsxDEV(WrappedComponent, { ...props }, void 0, false) }, void 0, false
      ));

  };
}

/**
 * Page-level error boundary with more prominent styling
 */
export function PageErrorBoundary({ children }) {
  return (/*#__PURE__*/
    _jsxDEV(ErrorBoundary, {
      showDetails: import.meta.env.DEV,
      fallback: /*#__PURE__*/
      _jsxDEV("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-6", children: /*#__PURE__*/
        _jsxDEV("div", { className: "text-center max-w-lg", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30", children: /*#__PURE__*/
            _jsxDEV(ExclamationTriangleIcon, { className: "h-8 w-8 text-red-600 dark:text-red-400" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("h2", { className: "mt-6 text-2xl font-bold text-gray-900 dark:text-white", children: "Page Error" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "mt-3 text-gray-500 dark:text-gray-400", children: "This page encountered an error and couldn't be displayed. Please try refreshing the page or navigate to a different section." }, void 0, false


          ), /*#__PURE__*/
          _jsxDEV("div", { className: "mt-6 flex justify-center gap-4", children: [/*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => window.location.reload(),
              className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors", children: [/*#__PURE__*/

              _jsxDEV(ArrowPathIcon, { className: "h-4 w-4" }, void 0, false), "Refresh Page"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("a", {
              href: "/",
              className: "inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-lg transition-colors", children:
              "Go to Dashboard" }, void 0, false

            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), children:


      children }, void 0, false
    ));

}

export default ErrorBoundary;
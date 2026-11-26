import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon } from
'@heroicons/react/24/outline';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";





















const ToastContext = /*#__PURE__*/createContext(undefined);

const toastIcons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon
};

const toastStyles = {
  success: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800',
  error: 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800',
  warning: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800',
  info: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
};

const iconStyles = {
  success: 'text-success-500 dark:text-success-400',
  error: 'text-danger-500 dark:text-danger-400',
  warning: 'text-warning-500 dark:text-warning-400',
  info: 'text-primary-500 dark:text-primary-400'
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toast) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast = { ...toast, id };
      setToasts((prev) => [...prev, newToast]);

      // Auto-remove after duration
      const duration = toast.duration ?? 4000;
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title, message) => addToast({ type: 'success', title, message }),
    [addToast]
  );

  const error = useCallback(
    (title, message) => addToast({ type: 'error', title, message, duration: 6000 }),
    [addToast]
  );

  const warning = useCallback(
    (title, message) => addToast({ type: 'warning', title, message }),
    [addToast]
  );

  const info = useCallback(
    (title, message) => addToast({ type: 'info', title, message }),
    [addToast]
  );

  return (/*#__PURE__*/
    _jsxDEV(ToastContext.Provider, { value: { toasts, addToast, removeToast, success, error, warning, info }, children: [
      children, /*#__PURE__*/
      _jsxDEV(ToastContainer, { toasts: toasts, removeToast: removeToast }, void 0, false)] }, void 0, true
    ));

}

function ToastContainer({ toasts, removeToast }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none", children: /*#__PURE__*/
      _jsxDEV(AnimatePresence, { mode: "popLayout", children:
        toasts.map((toast) => /*#__PURE__*/
        _jsxDEV(ToastItem, { toast: toast, onRemove: () => removeToast(toast.id) }, toast.id, false)
        ) }, void 0, false
      ) }, void 0, false
    ));

}

function ToastItem({ toast, onRemove }) {
  const Icon = toastIcons[toast.type];

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      layout: true,
      initial: { opacity: 0, y: 20, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, x: 100, scale: 0.95 },
      transition: { duration: 0.2 },
      className: `pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm min-w-[320px] max-w-md ${toastStyles[toast.type]}`, children: [/*#__PURE__*/

      _jsxDEV(Icon, { className: `h-5 w-5 flex-shrink-0 mt-0.5 ${iconStyles[toast.type]}` }, void 0, false), /*#__PURE__*/
      _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
        _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-gray-100", children: toast.title }, void 0, false),
        toast.message && /*#__PURE__*/
        _jsxDEV("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-400", children: toast.message }, void 0, false)] }, void 0, true

      ), /*#__PURE__*/
      _jsxDEV("button", {
        onClick: onRemove,
        className: "flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors", children: /*#__PURE__*/

        _jsxDEV(XMarkIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
      )] }, void 0, true
    ));

}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
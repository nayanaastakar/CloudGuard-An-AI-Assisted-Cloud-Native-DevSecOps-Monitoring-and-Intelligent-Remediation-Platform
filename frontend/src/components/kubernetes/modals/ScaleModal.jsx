import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  ScaleIcon,
  ArrowPathIcon,
  PlayIcon,
  StopIcon } from
'@heroicons/react/24/outline';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";












export function ScaleModal({
  isOpen,
  onClose,
  resourceName,
  resourceType,
  namespace,
  currentReplicas,
  onScale,
  isLoading
}) {
  const [replicas, setReplicas] = useState(currentReplicas);

  useEffect(() => {
    setReplicas(currentReplicas);
  }, [currentReplicas, isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return /*#__PURE__*/createPortal(/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm",
      onClick: onClose, children: /*#__PURE__*/

      _jsxDEV(motion.div, {
        initial: { scale: 0.9, opacity: 0, y: 20 },
        animate: { scale: 1, opacity: 1, y: 0 },
        exit: { scale: 0.9, opacity: 0, y: 20 },
        transition: { type: 'spring', damping: 25, stiffness: 300 },
        onClick: (e) => e.stopPropagation(),
        className: "bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-3 mb-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30", children: /*#__PURE__*/
            _jsxDEV(ScaleIcon, { className: "h-6 w-6 text-primary-600 dark:text-primary-400" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: ["Scale ",
              resourceType] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
              resourceName, " in ", namespace] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "mb-6", children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3", children: "Number of Replicas" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-center gap-4", children: [/*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.1 },
              whileTap: { scale: 0.9 },
              onClick: () => setReplicas(Math.max(0, replicas - 1)),
              className: "p-3 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors", children: /*#__PURE__*/

              _jsxDEV(StopIcon, { className: "h-5 w-5 text-gray-600 dark:text-gray-300" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("input", {
              type: "number",
              min: "0",
              value: replicas,
              onChange: (e) => setReplicas(parseInt(e.target.value) || 0),
              className: "w-24 text-center text-2xl font-bold px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-0 transition-colors" }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV(motion.button, {
              whileHover: { scale: 1.1 },
              whileTap: { scale: 0.9 },
              onClick: () => setReplicas(replicas + 1),
              className: "p-3 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors", children: /*#__PURE__*/

              _jsxDEV(PlayIcon, { className: "h-5 w-5 text-gray-600 dark:text-gray-300" }, void 0, false) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-center text-xs text-gray-500 dark:text-gray-400 mt-2", children: ["Current: ",
            currentReplicas, " → New: ", replicas] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex justify-end gap-3", children: [/*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: onClose,
            className: "px-4 py-2 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors", children:
            "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => onScale(replicas),
            disabled: isLoading || replicas === currentReplicas,
            className: "px-5 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed", children:

            isLoading ? /*#__PURE__*/
            _jsxDEV("span", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Scaling..."] }, void 0, true

            ) :

            'Scale' }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("p", { className: "text-center text-xs text-gray-400 dark:text-gray-500 mt-4", children: "Press Esc to cancel" }, void 0, false

        )] }, void 0, true
      ) }, void 0, false
    ),
    document.body
  );
}
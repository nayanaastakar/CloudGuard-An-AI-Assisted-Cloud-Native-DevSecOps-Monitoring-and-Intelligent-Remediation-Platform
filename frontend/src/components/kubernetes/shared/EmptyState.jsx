import { motion } from 'framer-motion';
import { CubeIcon } from '@heroicons/react/24/outline';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";






export function EmptyState({ icon: Icon, title }) {
  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      className: "text-center py-16", children: [/*#__PURE__*/

      _jsxDEV(motion.div, {
        className: "w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center shadow-lg shadow-gray-200/50 dark:shadow-slate-900/50",
        animate: {
          y: [0, -5, 0]
        },
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }, children: /*#__PURE__*/

        _jsxDEV(Icon, { className: "h-10 w-10 text-gray-400 dark:text-gray-500" }, void 0, false) }, void 0, false
      ), /*#__PURE__*/
      _jsxDEV("h3", { className: "text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2", children: title }, void 0, false), /*#__PURE__*/
      _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto", children: "No resources match your current filters. Try adjusting your search or namespace selection." }, void 0, false

      )] }, void 0, true
    ));

}
import { motion } from 'framer-motion';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

export function TableSkeleton() {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "animate-pulse", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center gap-4 py-3 px-4 border-b border-gray-100 dark:border-slate-700", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "w-8 h-4 bg-gray-200 dark:bg-slate-600 rounded" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "w-32 h-4 bg-gray-200 dark:bg-slate-600 rounded" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "w-24 h-4 bg-gray-200 dark:bg-slate-600 rounded" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "w-16 h-4 bg-gray-200 dark:bg-slate-600 rounded" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex-1" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "w-20 h-4 bg-gray-200 dark:bg-slate-600 rounded" }, void 0, false)] }, void 0, true
      ),

      [1, 2, 3, 4, 5, 6].map((i) => /*#__PURE__*/
      _jsxDEV(motion.div, {

        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: i * 0.05 },
        className: "flex items-center gap-4 py-4 px-4 border-b border-gray-50 dark:border-slate-700/50", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "w-8 h-8 bg-gray-200 dark:bg-slate-600 rounded-xl" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex-1 space-y-2", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "h-4 bg-gray-200 dark:bg-slate-600 rounded w-1/3" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "h-3 bg-gray-100 dark:bg-slate-700 rounded w-1/4" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "w-16 h-6 bg-gray-200 dark:bg-slate-600 rounded-full" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "w-24 h-4 bg-gray-100 dark:bg-slate-700 rounded" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex gap-2", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "w-8 h-8 bg-gray-200 dark:bg-slate-600 rounded-xl" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "w-8 h-8 bg-gray-200 dark:bg-slate-600 rounded-xl" }, void 0, false)] }, void 0, true
        )] }, i, true
      )
      )] }, void 0, true
    ));

}
import { motion } from 'framer-motion';

// Spinner variants
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";




const spinnerSizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
};

const spinnerColors = {
  primary: 'border-primary-500',
  white: 'border-white',
  gray: 'border-gray-400'
};

export function Spinner({ size = 'md', color = 'primary' }) {
  return (/*#__PURE__*/
    _jsxDEV("div", {
      className: `${spinnerSizes[size]} border-2 border-t-transparent rounded-full animate-spin ${spinnerColors[color]}` }, void 0, false
    ));

}

// Pulse dot loading
export function PulseDots() {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "flex items-center gap-1", children:
      [0, 1, 2].map((i) => /*#__PURE__*/
      _jsxDEV(motion.div, {

        className: "w-2 h-2 bg-primary-500 rounded-full",
        animate: {
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        },
        transition: {
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2
        } }, i, false
      )
      ) }, void 0, false
    ));

}

// Shimmer effect loading bar
export function ShimmerBar({ className = '' }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: `relative overflow-hidden bg-gray-200 dark:bg-slate-700 rounded-lg ${className}`, children: /*#__PURE__*/
      _jsxDEV(motion.div, {
        className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent",
        animate: { x: ['-100%', '100%'] },
        transition: { duration: 1.5, repeat: Infinity, ease: 'linear' } }, void 0, false
      ) }, void 0, false
    ));

}

// Full page loading screen
export function PageLoader() {
  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800", children: /*#__PURE__*/

      _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
        _jsxDEV(motion.div, {
          className: "w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-2xl shadow-primary-500/30",
          animate: {
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }, children: /*#__PURE__*/

          _jsxDEV("span", { className: "text-white font-bold text-2xl", children: "K" }, void 0, false) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV(motion.h2, {
          className: "text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent",
          animate: { opacity: [0.5, 1, 0.5] },
          transition: { duration: 2, repeat: Infinity }, children:
          "Loading CloudGuard..." }, void 0, false

        ), /*#__PURE__*/
        _jsxDEV("div", { className: "mt-4 flex justify-center", children: /*#__PURE__*/
          _jsxDEV(PulseDots, {}, void 0, false) }, void 0, false
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Card skeleton with animation
export function CardSkeleton({ rows = 3 }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "backdrop-blur-xl rounded-2xl border shadow-glass dark:shadow-glass-dark bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 p-6 space-y-4", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-6 w-32" }, void 0, false), /*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-8 w-8 rounded-lg" }, void 0, false)] }, void 0, true
      ),
      Array.from({ length: rows }).map((_, i) => /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-4 w-full" }, void 0, false), /*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-4 w-3/4" }, void 0, false)] }, i, true
      )
      )] }, void 0, true
    ));

}

// Table skeleton
export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "backdrop-blur-xl rounded-2xl border shadow-glass dark:shadow-glass-dark bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 overflow-hidden", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "px-6 py-4 border-b border-gray-100/50 dark:border-slate-700/50 flex gap-4", children:
        Array.from({ length: columns }).map((_, i) => /*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-4 flex-1" }, i, false)
        ) }, void 0, false
      ),

      Array.from({ length: rows }).map((_, rowIndex) => /*#__PURE__*/
      _jsxDEV("div", {

        className: "px-6 py-4 border-b border-gray-50/50 dark:border-slate-700/30 flex gap-4 last:border-0", children:

        Array.from({ length: columns }).map((_, colIndex) => /*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-4 flex-1" }, colIndex, false)
        ) }, rowIndex, false
      )
      )] }, void 0, true
    ));

}

// Dashboard skeleton for full page loading
export function DashboardSkeleton() {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-8 animate-pulse", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
          _jsxDEV(ShimmerBar, { className: "h-8 w-64" }, void 0, false), /*#__PURE__*/
          _jsxDEV(ShimmerBar, { className: "h-4 w-48" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-10 w-40 rounded-xl" }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children:
        [1, 2, 3, 4].map((i) => /*#__PURE__*/
        _jsxDEV("div", {

          className: "backdrop-blur-xl rounded-2xl border shadow-glass dark:shadow-glass-dark bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50 p-6", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-start justify-between", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "space-y-3 flex-1", children: [/*#__PURE__*/
              _jsxDEV(ShimmerBar, { className: "h-4 w-24" }, void 0, false), /*#__PURE__*/
              _jsxDEV(ShimmerBar, { className: "h-8 w-16" }, void 0, false), /*#__PURE__*/
              _jsxDEV(ShimmerBar, { className: "h-3 w-32" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV(ShimmerBar, { className: "h-12 w-12 rounded-xl" }, void 0, false)] }, void 0, true
          ) }, i, false
        )
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [/*#__PURE__*/
        _jsxDEV(CardSkeleton, { rows: 4 }, void 0, false), /*#__PURE__*/
        _jsxDEV(CardSkeleton, { rows: 4 }, void 0, false)] }, void 0, true
      )] }, void 0, true
    ));

}

// Inline loading for buttons





export function ButtonLoader({ loading, children }) {
  if (loading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
        _jsxDEV(Spinner, { size: "sm", color: "white" }, void 0, false), /*#__PURE__*/
        _jsxDEV("span", { children: "Loading..." }, void 0, false)] }, void 0, true
      ));

  }
  return /*#__PURE__*/_jsxDEV(_Fragment, { children: children }, void 0, false);
}

// Progress bar







const progressColors = {
  primary: 'from-primary-500 to-primary-600',
  success: 'from-success-500 to-success-600',
  warning: 'from-warning-500 to-warning-600',
  danger: 'from-danger-500 to-danger-600'
};

const progressSizes = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3'
};

export function ProgressBar({ progress, showLabel = false, color = 'primary', size = 'md' }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "w-full", children: [
      showLabel && /*#__PURE__*/
      _jsxDEV("div", { className: "flex justify-between mb-1", children: [/*#__PURE__*/
        _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Progress" }, void 0, false), /*#__PURE__*/
        _jsxDEV("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: [Math.round(progress), "%"] }, void 0, true)] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: `w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden ${progressSizes[size]}`, children: /*#__PURE__*/
        _jsxDEV(motion.div, {
          className: `h-full bg-gradient-to-r ${progressColors[color]} rounded-full`,
          initial: { width: 0 },
          animate: { width: `${progress}%` },
          transition: { duration: 0.5, ease: 'easeOut' } }, void 0, false
        ) }, void 0, false
      )] }, void 0, true
    ));

}

// Circular progress







export function CircularProgress({ progress, size = 60, strokeWidth = 6, color = 'primary' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress / 100 * circumference;

  const colorClasses = {
    primary: 'text-primary-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    danger: 'text-danger-500'
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "relative inline-flex items-center justify-center", children: [/*#__PURE__*/
      _jsxDEV("svg", { width: size, height: size, className: "-rotate-90", children: [/*#__PURE__*/
        _jsxDEV("circle", {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          stroke: "currentColor",
          strokeWidth: strokeWidth,
          fill: "none",
          className: "text-gray-200 dark:text-slate-700" }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV(motion.circle, {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          stroke: "currentColor",
          strokeWidth: strokeWidth,
          fill: "none",
          strokeLinecap: "round",
          className: colorClasses[color],
          initial: { strokeDashoffset: circumference },
          animate: { strokeDashoffset },
          transition: { duration: 0.5 },
          style: { strokeDasharray: circumference } }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV("span", { className: "absolute text-sm font-semibold text-gray-900 dark:text-white", children: [
        Math.round(progress), "%"] }, void 0, true
      )] }, void 0, true
    ));

}

// ============================================
// SPECIFIC SKELETONS
// ============================================

// User table skeleton
export function UserTableSkeleton() {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "px-6 py-4 bg-gray-50 dark:bg-slate-700 flex gap-6", children: [/*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-4 w-24" }, void 0, false), /*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-4 w-16" }, void 0, false), /*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-4 w-16" }, void 0, false), /*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-4 w-20" }, void 0, false), /*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-4 w-20 ml-auto" }, void 0, false)] }, void 0, true
      ),

      [1, 2, 3, 4, 5].map((i) => /*#__PURE__*/
      _jsxDEV("div", { className: "px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 flex items-center gap-6", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3 flex-1", children: [/*#__PURE__*/
          _jsxDEV(ShimmerBar, { className: "h-10 w-10 rounded-full" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsxDEV(ShimmerBar, { className: "h-4 w-32" }, void 0, false), /*#__PURE__*/
            _jsxDEV(ShimmerBar, { className: "h-3 w-40" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-6 w-20 rounded-full" }, void 0, false), /*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-6 w-16" }, void 0, false), /*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-4 w-28" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex gap-1", children: [/*#__PURE__*/
          _jsxDEV(ShimmerBar, { className: "h-8 w-8 rounded-lg" }, void 0, false), /*#__PURE__*/
          _jsxDEV(ShimmerBar, { className: "h-8 w-8 rounded-lg" }, void 0, false), /*#__PURE__*/
          _jsxDEV(ShimmerBar, { className: "h-8 w-8 rounded-lg" }, void 0, false)] }, void 0, true
        )] }, i, true
      )
      )] }, void 0, true
    ));

}

// Kubernetes resources skeleton
export function ResourceTableSkeleton() {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center gap-4", children: [/*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-9 w-64 rounded-lg" }, void 0, false), /*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-9 w-40 rounded-lg" }, void 0, false), /*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-9 w-32 rounded-lg ml-auto" }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "divide-y divide-gray-100 dark:divide-slate-700/50", children:
        [1, 2, 3, 4, 5, 6].map((i) => /*#__PURE__*/
        _jsxDEV("div", { className: "px-4 py-3 flex items-center gap-4", children: [/*#__PURE__*/
          _jsxDEV(ShimmerBar, { className: "h-4 w-4 rounded" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "flex-1 grid grid-cols-5 gap-4", children: [/*#__PURE__*/
            _jsxDEV(ShimmerBar, { className: "h-4" }, void 0, false), /*#__PURE__*/
            _jsxDEV(ShimmerBar, { className: "h-4" }, void 0, false), /*#__PURE__*/
            _jsxDEV(ShimmerBar, { className: "h-6 w-20 rounded-full" }, void 0, false), /*#__PURE__*/
            _jsxDEV(ShimmerBar, { className: "h-4" }, void 0, false), /*#__PURE__*/
            _jsxDEV(ShimmerBar, { className: "h-4 w-24" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV(ShimmerBar, { className: "h-8 w-8 rounded-lg" }, void 0, false)] }, i, true
        )
        ) }, void 0, false
      )] }, void 0, true
    ));

}

// Security dashboard skeleton
export function SecuritySkeleton() {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-8", children: [/*#__PURE__*/
          _jsxDEV(ShimmerBar, { className: "h-32 w-32 rounded-full" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "flex-1 space-y-4", children: [/*#__PURE__*/
            _jsxDEV(ShimmerBar, { className: "h-6 w-48" }, void 0, false), /*#__PURE__*/
            _jsxDEV(ShimmerBar, { className: "h-4 w-full max-w-md" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "flex gap-3", children: [/*#__PURE__*/
              _jsxDEV(ShimmerBar, { className: "h-8 w-24 rounded-lg" }, void 0, false), /*#__PURE__*/
              _jsxDEV(ShimmerBar, { className: "h-8 w-24 rounded-lg" }, void 0, false), /*#__PURE__*/
              _jsxDEV(ShimmerBar, { className: "h-8 w-24 rounded-lg" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children:
        [1, 2, 3, 4].map((i) => /*#__PURE__*/
        _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4", children: [/*#__PURE__*/
          _jsxDEV(ShimmerBar, { className: "h-4 w-20 mb-3" }, void 0, false), /*#__PURE__*/
          _jsxDEV(ShimmerBar, { className: "h-8 w-12 mb-2" }, void 0, false), /*#__PURE__*/
          _jsxDEV(ShimmerBar, { className: "h-2 w-full rounded-full" }, void 0, false)] }, i, true
        )
        ) }, void 0, false
      )] }, void 0, true
    ));

}

// Cluster card skeleton
export function ClusterCardSkeleton() {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-start justify-between mb-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV(ShimmerBar, { className: "h-12 w-12 rounded-xl" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-2", children: [/*#__PURE__*/
            _jsxDEV(ShimmerBar, { className: "h-5 w-32" }, void 0, false), /*#__PURE__*/
            _jsxDEV(ShimmerBar, { className: "h-3 w-48" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-6 w-20 rounded-full" }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "grid grid-cols-3 gap-4 mb-4", children:
        [1, 2, 3].map((i) => /*#__PURE__*/
        _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
          _jsxDEV(ShimmerBar, { className: "h-6 w-10 mx-auto mb-1" }, void 0, false), /*#__PURE__*/
          _jsxDEV(ShimmerBar, { className: "h-3 w-16 mx-auto" }, void 0, false)] }, i, true
        )
        ) }, void 0, false
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "flex gap-2", children: [/*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-9 flex-1 rounded-lg" }, void 0, false), /*#__PURE__*/
        _jsxDEV(ShimmerBar, { className: "h-9 w-9 rounded-lg" }, void 0, false)] }, void 0, true
      )] }, void 0, true
    ));

}

// ============================================
// ACTIONABLE ERROR STATES
// ============================================














export function ErrorState({
  title,
  message,
  details,
  type = 'error',
  actions = [],
  icon
}) {
  const styles = {
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      iconColor: 'text-red-600 dark:text-red-400',
      title: 'text-red-800 dark:text-red-200',
      message: 'text-red-700 dark:text-red-300',
      details: 'text-red-600/80 dark:text-red-400/80'
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/40',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      title: 'text-yellow-800 dark:text-yellow-200',
      message: 'text-yellow-700 dark:text-yellow-300',
      details: 'text-yellow-600/80 dark:text-yellow-400/80'
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
      title: 'text-blue-800 dark:text-blue-200',
      message: 'text-blue-700 dark:text-blue-300',
      details: 'text-blue-600/80 dark:text-blue-400/80'
    }
  };

  const s = styles[type];

  const defaultIcons = {
    error: /*#__PURE__*/
    _jsxDEV("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /*#__PURE__*/
      _jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }, void 0, false) }, void 0, false
    ),

    warning: /*#__PURE__*/
    _jsxDEV("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /*#__PURE__*/
      _jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }, void 0, false) }, void 0, false
    ),

    info: /*#__PURE__*/
    _jsxDEV("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /*#__PURE__*/
      _jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }, void 0, false) }, void 0, false
    )

  };

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      className: `rounded-xl border p-4 ${s.bg} ${s.border}`, children: /*#__PURE__*/

      _jsxDEV("div", { className: "flex gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: `flex-shrink-0 p-2 rounded-lg ${s.iconBg} ${s.iconColor}`, children:
          icon || defaultIcons[type] }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex-1 min-w-0", children: [
          title && /*#__PURE__*/
          _jsxDEV("h4", { className: `font-semibold mb-1 ${s.title}`, children: title }, void 0, false), /*#__PURE__*/

          _jsxDEV("p", { className: `text-sm ${s.message}`, children: message }, void 0, false),
          details && /*#__PURE__*/
          _jsxDEV("p", { className: `text-xs mt-2 font-mono ${s.details}`, children: details }, void 0, false),

          actions.length > 0 && /*#__PURE__*/
          _jsxDEV("div", { className: "flex flex-wrap gap-2 mt-3", children:
            actions.map((action, i) => /*#__PURE__*/
            _jsxDEV("button", {

              onClick: action.onClick,
              className: `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              action.variant === 'primary' ?
              'bg-primary-600 hover:bg-primary-700 text-white' :
              'bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-600'}`, children:


              action.label }, i, false
            )
            ) }, void 0, false
          )] }, void 0, true

        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Connection error with retry






export function ConnectionError({ service, onRetry, retrying = false }) {
  return (/*#__PURE__*/
    _jsxDEV(ErrorState, {
      title: `Unable to connect to ${service}`,
      message: "The service is not responding. This could be due to network issues or the service being down.",
      type: "error",
      actions: [
      {
        label: retrying ? 'Retrying...' : 'Retry Connection',
        onClick: onRetry,
        variant: 'primary'
      },
      {
        label: 'View Status',
        onClick: () => window.open('/health', '_blank')
      }],

      icon: /*#__PURE__*/
      _jsxDEV("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /*#__PURE__*/
        _jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" }, void 0, false) }, void 0, false
      ) }, void 0, false

    ));

}

// Permission denied





export function PermissionDenied({ resource, requiredRole }) {
  return (/*#__PURE__*/
    _jsxDEV(ErrorState, {
      title: "Access Denied",
      message: `You don't have permission to access ${resource}.${requiredRole ? ` Required role: ${requiredRole}` : ''}`,
      type: "warning",
      icon: /*#__PURE__*/
      _jsxDEV("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /*#__PURE__*/
        _jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }, void 0, false) }, void 0, false
      ) }, void 0, false

    ));

}

// Empty state with action










export function EmptyState({ title, message, icon, action }) {
  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      className: "flex flex-col items-center justify-center py-12 px-4 text-center", children: [

      icon && /*#__PURE__*/
      _jsxDEV("div", { className: "w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-400 dark:text-gray-500 mb-4", children:
        icon }, void 0, false
      ), /*#__PURE__*/

      _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: title }, void 0, false), /*#__PURE__*/
      _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-4", children: message }, void 0, false),
      action && /*#__PURE__*/
      _jsxDEV("button", {
        onClick: action.onClick,
        className: "px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors", children:

        action.label }, void 0, false
      )] }, void 0, true

    ));

}

// Inline error for forms




export function InlineError({ message }) {
  return (/*#__PURE__*/
    _jsxDEV(motion.p, {
      initial: { opacity: 0, y: -5 },
      animate: { opacity: 1, y: 0 },
      className: "text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1", children: [/*#__PURE__*/

      _jsxDEV("svg", { className: "h-3 w-3", fill: "currentColor", viewBox: "0 0 20 20", children: /*#__PURE__*/
        _jsxDEV("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }, void 0, false) }, void 0, false
      ),
      message] }, void 0, true
    ));

}
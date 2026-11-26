import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";









const paddingClasses = {
  none: '',
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4'
};

const variantClasses = {
  default: 'bg-white/70 dark:bg-slate-800/70 border-white/20 dark:border-slate-700/50',
  hover: 'bg-white/70 dark:bg-slate-800/70 border-white/20 dark:border-slate-700/50 hover:bg-white/90 dark:hover:bg-slate-800/90 hover:shadow-lg',
  glow: 'bg-white/70 dark:bg-slate-800/70 border-primary-500/20 shadow-inner-glow',
  gradient: 'bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-800/60 border-white/30 dark:border-slate-600/30'
};

export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  padding = 'sm',
  hover = false,
  ...motionProps
}) {
  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      whileHover: hover ? { y: -2, transition: { duration: 0.2 } } : undefined,
      className: `
        backdrop-blur-xl rounded-xl border shadow-glass dark:shadow-glass-dark
        transition-all duration-300
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${className}
      `, ...
      motionProps, children:

      children }, void 0, false
    ));

}

// Stat Card for metrics display









const colorClasses = {
  primary: {
    bg: 'bg-primary-500/10',
    text: 'text-primary-600 dark:text-primary-400',
    icon: 'text-primary-500'
  },
  success: {
    bg: 'bg-success-500/10',
    text: 'text-success-600 dark:text-success-400',
    icon: 'text-success-500'
  },
  warning: {
    bg: 'bg-warning-500/10',
    text: 'text-warning-600 dark:text-warning-400',
    icon: 'text-warning-500'
  },
  danger: {
    bg: 'bg-danger-500/10',
    text: 'text-danger-600 dark:text-danger-400',
    icon: 'text-danger-500'
  }
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'primary'
}) {
  const colors = colorClasses[color];

  return (/*#__PURE__*/
    _jsxDEV(GlassCard, { hover: true, variant: "hover", className: "group", children: /*#__PURE__*/
      _jsxDEV("div", { className: "flex items-start justify-between", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-1", children:
            title }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("p", { className: `text-2xl lg:text-3xl font-bold ${colors.text}`, children:
            value }, void 0, false
          ),
          subtitle && /*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-gray-400 dark:text-gray-500 mt-1", children:
            subtitle }, void 0, false
          ),

          trend && /*#__PURE__*/
          _jsxDEV("div", { className: `flex items-center gap-1 mt-2 text-sm ${trend.isPositive ? 'text-success-500' : 'text-danger-500'}`, children: [/*#__PURE__*/
            _jsxDEV("svg", {
              className: `w-4 h-4 ${trend.isPositive ? '' : 'rotate-180'}`,
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor", children: /*#__PURE__*/

              _jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 10l7-7m0 0l7 7m-7-7v18" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("span", { children: [Math.abs(trend.value), "%"] }, void 0, true)] }, void 0, true
          )] }, void 0, true

        ),
        Icon && /*#__PURE__*/
        _jsxDEV("div", { className: `p-3 rounded-xl ${colors.bg} group-hover:scale-110 transition-transform duration-300`, children: /*#__PURE__*/
          _jsxDEV(Icon, { className: `h-6 w-6 ${colors.icon}` }, void 0, false) }, void 0, false
        )] }, void 0, true

      ) }, void 0, false
    ));

}

// Section Header






export function SectionHeader({ title, subtitle, action }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "flex items-center justify-between mb-6", children: [/*#__PURE__*/
      _jsxDEV("div", { children: [/*#__PURE__*/
        _jsxDEV("h2", { className: "text-xl lg:text-2xl font-bold text-gray-900 dark:text-white", children:
          title }, void 0, false
        ),
        subtitle && /*#__PURE__*/
        _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children:
          subtitle }, void 0, false
        )] }, void 0, true

      ),
      action] }, void 0, true
    ));

}

// Skeleton loader for cards
export function GlassCardSkeleton({ className = '' }) {
  return (/*#__PURE__*/
    _jsxDEV("div", {
      className: `
        backdrop-blur-xl rounded-2xl border shadow-glass dark:shadow-glass-dark
        bg-white/50 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50
        animate-pulse p-4 lg:p-6
        ${className}
      `, children: /*#__PURE__*/

      _jsxDEV("div", { className: "flex items-start justify-between", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex-1 space-y-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "h-4 bg-gray-200 dark:bg-slate-700 rounded w-24" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "h-8 bg-gray-200 dark:bg-slate-700 rounded w-16" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "h-3 bg-gray-200 dark:bg-slate-700 rounded w-32" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-xl" }, void 0, false)] }, void 0, true
      ) }, void 0, false
    ));

}
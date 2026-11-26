import { motion } from 'framer-motion';
import { ArrowPathIcon } from '@heroicons/react/24/outline';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

















const colorClasses = {
  primary: {
    bg: 'bg-primary-100 dark:bg-primary-900/30',
    icon: 'text-primary-600 dark:text-primary-400',
    badge: 'bg-primary-500/20 text-primary-600 dark:text-primary-400'
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    icon: 'text-green-600 dark:text-green-400',
    badge: 'bg-green-500/20 text-green-600 dark:text-green-400'
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    icon: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    icon: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    icon: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    icon: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-500/20 text-red-600 dark:text-red-400'
  }
};

export default function PageHeader({
  title,
  description,
  subtitle,
  icon: Icon,
  iconColor = 'primary',
  actions,
  onRefresh,
  refreshing = false,
  badge,
  children
}) {
  const colors = colorClasses[iconColor] || colorClasses.primary;
  const subText = description || subtitle;

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      className: "sticky top-0 z-20 -mx-4 lg:-mx-6 px-4 lg:px-6 py-4 bg-gradient-to-r from-slate-50/95 via-white/95 to-slate-50/95 dark:from-slate-900/95 dark:via-slate-900/95 dark:to-slate-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center gap-3", children: [
        Icon && /*#__PURE__*/
        _jsxDEV("div", { className: `p-2.5 rounded-xl ${colors.bg}`, children: /*#__PURE__*/
          _jsxDEV(Icon, { className: `h-6 w-6 ${colors.icon}` }, void 0, false) }, void 0, false
        ), /*#__PURE__*/

        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV("h1", { className: "text-xl font-semibold text-gray-800 dark:text-gray-100", children:
              title }, void 0, false
            ),
            badge && /*#__PURE__*/
            _jsxDEV("span", { className: `px-2 py-0.5 text-xs font-semibold rounded-full ${
              colorClasses[badge.color || 'primary'].badge}`, children:

              badge.text }, void 0, false
            )] }, void 0, true

          ),
          subText && /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 text-sm mt-0.5", children:
            subText }, void 0, false
          )] }, void 0, true

        )] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center gap-3", children: [
        actions,
        children,
        onRefresh && /*#__PURE__*/
        _jsxDEV(motion.button, {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          onClick: onRefresh,
          disabled: refreshing,
          className: "flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50", children: [/*#__PURE__*/

          _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${refreshing ? 'animate-spin' : ''}` }, void 0, false),
          refreshing ? 'Refreshing...' : 'Refresh'] }, void 0, true
        )] }, void 0, true

      )] }, void 0, true
    ));

}

// Export a simpler stat card component for use across pages












export function StatCard({ title, value, icon: Icon, color = 'primary', trend, subtitle }) {
  const colors = colorClasses[color];

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 shadow-sm", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center gap-3 mb-3", children: [/*#__PURE__*/
        _jsxDEV("div", { className: `p-2 rounded-xl ${colors.bg}`, children: /*#__PURE__*/
          _jsxDEV(Icon, { className: `h-5 w-5 ${colors.icon}` }, void 0, false) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("p", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children:
          title }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV("div", { className: "flex items-end justify-between", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-semibold text-gray-900 dark:text-white", children: value }, void 0, false),
          subtitle && /*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5", children: subtitle }, void 0, false)] }, void 0, true

        ),
        trend && /*#__PURE__*/
        _jsxDEV("div", { className: `flex items-center gap-1 text-xs font-medium ${
          trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`, children: /*#__PURE__*/

          _jsxDEV("span", { children: [trend.isPositive ? '+' : '', trend.value, "%"] }, void 0, true) }, void 0, false
        )] }, void 0, true

      )] }, void 0, true
    ));

}

// Export a section header component






export function SectionHeader({ title, icon: Icon, action }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
      _jsxDEV("h2", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2", children: [
        Icon && /*#__PURE__*/_jsxDEV(Icon, { className: "h-4 w-4 text-gray-500" }, void 0, false),
        title] }, void 0, true
      ),
      action] }, void 0, true
    ));

}

// Export an empty state component







export function EmptyState({ title, description, icon: Icon, action }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "flex flex-col items-center justify-center py-12 px-4", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "p-4 rounded-2xl bg-gray-100 dark:bg-slate-800 mb-4", children: /*#__PURE__*/
        _jsxDEV(Icon, { className: "h-8 w-8 text-gray-400 dark:text-gray-500" }, void 0, false) }, void 0, false
      ), /*#__PURE__*/
      _jsxDEV("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100 mb-1", children: title }, void 0, false), /*#__PURE__*/
      _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-4", children: description }, void 0, false),
      action] }, void 0, true
    ));

}
import {
  ExclamationTriangleIcon,
  LightBulbIcon,
  SparklesIcon } from
'@heroicons/react/24/outline';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";







const iconConfig = {
  warning: {
    icon: ExclamationTriangleIcon,
    color: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/20'
  },
  suggestion: {
    icon: LightBulbIcon,
    color: 'text-purple-500 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    border: 'border-purple-200 dark:border-purple-500/20'
  },
  info: {
    icon: SparklesIcon,
    color: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/20'
  }
};

export function AIInsightCard({ insight, onApplyFix }) {
  const config = iconConfig[insight.type];
  const Icon = config.icon;

  return (/*#__PURE__*/
    _jsxDEV("div", { className: `p-2 rounded-lg ${config.bg} border ${config.border}`, children: /*#__PURE__*/
      _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
        _jsxDEV(Icon, { className: `h-3.5 w-3.5 ${config.color} flex-shrink-0 mt-0.5` }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-gray-700 dark:text-gray-300", children: insight.message }, void 0, false),
          insight.fix && onApplyFix && /*#__PURE__*/
          _jsxDEV("button", {
            onClick: onApplyFix,
            className: "mt-1.5 text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium", children:
            "Apply Fix" }, void 0, false

          )] }, void 0, true

        )] }, void 0, true
      ) }, void 0, false
    ));

}
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon } from
'@heroicons/react/24/outline';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";





export function StatusBadge({ status }) {
  const isHealthy = status === 'deployed';
  const isFailed = status === 'failed';

  return (/*#__PURE__*/
    _jsxDEV("span", {
      className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
      isHealthy ?
      'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
      isFailed ?
      'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' :
      'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'}`, children: [


      isHealthy ? /*#__PURE__*/
      _jsxDEV(CheckCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false) :
      isFailed ? /*#__PURE__*/
      _jsxDEV(XCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false) : /*#__PURE__*/

      _jsxDEV(ClockIcon, { className: "h-3.5 w-3.5 animate-pulse" }, void 0, false),

      isHealthy ? 'Healthy' : isFailed ? 'Failed' : 'Pending'] }, void 0, true
    ));

}
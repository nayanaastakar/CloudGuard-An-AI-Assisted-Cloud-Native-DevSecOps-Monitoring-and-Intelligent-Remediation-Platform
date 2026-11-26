import { FunnelIcon } from '@heroicons/react/24/outline';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";









export function StatusFilter({ options, selected, onChange }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [/*#__PURE__*/
      _jsxDEV(FunnelIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
      _jsxDEV("span", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Filter:" }, void 0, false), /*#__PURE__*/
      _jsxDEV("div", { className: "flex gap-1", children:
        options.map((option) => /*#__PURE__*/
        _jsxDEV("button", {

          onClick: () => onChange(option.value),
          className: `px-3 py-1 text-xs font-medium rounded-xl transition-all ${
          selected === option.value ?
          `${option.color} ring-1 ring-current` :
          'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`, children:


          option.label }, option.value, false
        )
        ) }, void 0, false
      )] }, void 0, true
    ));

}
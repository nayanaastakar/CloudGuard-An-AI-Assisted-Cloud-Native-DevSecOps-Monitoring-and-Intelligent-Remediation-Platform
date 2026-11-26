import { ChevronUpDownIcon } from '@heroicons/react/24/outline';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";












export function SortableHeader({
  label,
  sortKey,
  sortConfig,
  onSort,
  className = ''
}) {
  const isActive = sortConfig.key === sortKey;

  return (/*#__PURE__*/
    _jsxDEV("th", {
      className: `text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors select-none ${className}`,
      onClick: () => onSort(sortKey), children: /*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center gap-1", children: [
        label, /*#__PURE__*/
        _jsxDEV(ChevronUpDownIcon, { className: `h-4 w-4 transition-colors ${isActive ? 'text-primary-500' : 'text-gray-300 dark:text-gray-600'}` }, void 0, false),
        isActive && sortConfig.direction && /*#__PURE__*/
        _jsxDEV("span", { className: "text-xs text-primary-500", children:
          sortConfig.direction === 'asc' ? '↑' : '↓' }, void 0, false
        )] }, void 0, true

      ) }, void 0, false
    ));

}

// Sort helper function
export function sortData(data, sortConfig) {
  if (!sortConfig.key || !sortConfig.direction) return data;

  return [...data].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    let comparison = 0;
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      comparison = aVal.localeCompare(bVal);
    } else if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal;
    } else {
      comparison = String(aVal).localeCompare(String(bVal));
    }

    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
}
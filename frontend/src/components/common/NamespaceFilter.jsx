import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderIcon, ChevronDownIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNamespace } from '../../contexts/NamespaceContext';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

export default function NamespaceFilter() {
  const { namespaces, selectedNamespace, loading, setSelectedNamespace } = useNamespace();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Display value for the button
  const displayValue = selectedNamespace || 'All Namespaces';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Include "All Namespaces" option at the beginning
  const allNamespaces = ['All Namespaces', ...namespaces];

  const filteredNamespaces = allNamespaces.filter((ns) =>
  ns.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (namespace) => {
    // Convert "All Namespaces" to empty string for API calls
    const nsValue = namespace === 'All Namespaces' ? '' : namespace;
    setSelectedNamespace(nsValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "relative", ref: dropdownRef, children: [/*#__PURE__*/
      _jsxDEV(motion.button, {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        onClick: () => setIsOpen(!isOpen),
        className: "flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100/80 dark:bg-slate-800/80 border border-gray-200/50 dark:border-slate-700/50 hover:bg-gray-200/80 dark:hover:bg-slate-700/80 transition-colors w-full", children: [/*#__PURE__*/

        _jsxDEV(FolderIcon, { className: "h-4 w-4 text-purple-500" }, void 0, false), /*#__PURE__*/
        _jsxDEV("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate", children:
          loading ? 'Loading...' : displayValue }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV(ChevronDownIcon, { className: `h-4 w-4 text-gray-400 transition-transform ml-auto ${isOpen ? 'rotate-180' : ''}` }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV(AnimatePresence, { children:
        isOpen && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 10, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 10, scale: 0.95 },
          transition: { duration: 0.15 },
          className: "absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 overflow-hidden z-50", children: [/*#__PURE__*/


          _jsxDEV("div", { className: "p-2 border-b border-gray-100 dark:border-slate-700", children: /*#__PURE__*/
            _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
              _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                placeholder: "Search namespaces...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-slate-700 border-0 focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder-gray-400",
                autoFocus: true }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "max-h-64 overflow-y-auto p-2", children:
            loading ? /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-center py-4", children: /*#__PURE__*/
              _jsxDEV("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500" }, void 0, false) }, void 0, false
            ) :
            filteredNamespaces.length === 0 ? /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 text-center py-4", children: "No namespaces found" }, void 0, false

            ) :

            filteredNamespaces.map((namespace) => {
              const isSelected = namespace === 'All Namespaces' ?
              selectedNamespace === '' :
              namespace === selectedNamespace;

              return (/*#__PURE__*/
                _jsxDEV("button", {

                  onClick: () => handleSelect(namespace),
                  className: `w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  isSelected ?
                  'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                  'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'}`, children: [/*#__PURE__*/


                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV(FolderIcon, { className: `h-4 w-4 ${
                      isSelected ? 'text-purple-500' : 'text-gray-400'}` }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: namespace === 'All Namespaces' ? 'font-medium' : '', children:
                      namespace }, void 0, false
                    )] }, void 0, true
                  ),
                  isSelected && /*#__PURE__*/
                  _jsxDEV(CheckIcon, { className: "h-4 w-4 text-purple-500" }, void 0, false)] }, namespace, true

                ));

            }) }, void 0, false

          )] }, void 0, true
        ) }, void 0, false

      )] }, void 0, true
    ));

}
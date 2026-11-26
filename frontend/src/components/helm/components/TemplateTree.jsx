import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderIcon,
  DocumentIcon,
  ChevronRightIcon,
  ChevronDownIcon } from
'@heroicons/react/24/outline';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";









export function TemplateTree({
  files,
  selectedFile,
  onSelectFile,
  level = 0
}) {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['templates']));

  const toggleFolder = (name) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-0.5", children:
      files.map((file) => /*#__PURE__*/
      _jsxDEV("div", { children: [/*#__PURE__*/
        _jsxDEV(motion.button, {
          whileHover: { x: 2 },
          onClick: () => {
            if (file.type === 'folder') {
              toggleFolder(file.name);
            } else {
              onSelectFile(file.name);
            }
          },
          className: `w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
          selectedFile === file.name ?
          'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400' :
          'hover:bg-gray-100 dark:hover:bg-slate-700/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`,

          style: { paddingLeft: `${level * 12 + 8}px` }, children: [

          file.type === 'folder' ? /*#__PURE__*/
          _jsxDEV(_Fragment, { children: [
            expandedFolders.has(file.name) ? /*#__PURE__*/
            _jsxDEV(ChevronDownIcon, { className: "h-3 w-3 text-gray-400 dark:text-gray-500" }, void 0, false) : /*#__PURE__*/

            _jsxDEV(ChevronRightIcon, { className: "h-3 w-3 text-gray-400 dark:text-gray-500" }, void 0, false), /*#__PURE__*/

            _jsxDEV(FolderIcon, { className: "h-4 w-4 text-amber-500 dark:text-amber-400" }, void 0, false)] }, void 0, true
          ) : /*#__PURE__*/

          _jsxDEV(_Fragment, { children: [/*#__PURE__*/
            _jsxDEV("span", { className: "w-3" }, void 0, false), /*#__PURE__*/
            _jsxDEV(DocumentIcon, { className: "h-4 w-4 text-blue-500 dark:text-blue-400" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("span", { className: "text-xs truncate", children: file.name }, void 0, false)] }, void 0, true
        ),
        file.type === 'folder' && expandedFolders.has(file.name) && file.children && /*#__PURE__*/
        _jsxDEV(TemplateTree, {
          files: file.children,
          selectedFile: selectedFile,
          onSelectFile: onSelectFile,
          level: level + 1 }, void 0, false
        )] }, file.name, true

      )
      ) }, void 0, false
    ));

}
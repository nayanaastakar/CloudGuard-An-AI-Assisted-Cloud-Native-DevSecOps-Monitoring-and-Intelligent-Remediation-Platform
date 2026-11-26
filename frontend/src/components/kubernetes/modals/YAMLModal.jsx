import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ArrowPathIcon,
  XMarkIcon,
  CodeBracketIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowUturnLeftIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon } from
'@heroicons/react/24/outline';
import { kubernetesApi } from '../../../services/api';
import { useToast } from '../../../contexts/ToastContext';
import { logger } from '../../../utils/logger';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";










export function YAMLModal({
  isOpen,
  onClose,
  resourceType,
  namespace,
  name,
  onRefresh
}) {
  const toast = useToast();
  const [yaml, setYaml] = useState('');
  const [originalYaml, setOriginalYaml] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [dryRunMode, setDryRunMode] = useState(false);
  const [saveResult, setSaveResult] = useState(null);

  const hasChanges = yaml !== originalYaml;

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        if (hasChanges && editMode) {
          if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
            onClose();
          }
        } else {
          onClose();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, hasChanges, editMode]);

  useEffect(() => {
    if (isOpen) {
      fetchYAML();
      setEditMode(false);
      setSaveResult(null);
    }
  }, [isOpen, resourceType, namespace, name]);

  async function fetchYAML() {
    setLoading(true);
    setError(null);
    setSaveResult(null);
    try {
      const result = await kubernetesApi.getResourceYAML({
        kind: resourceType,
        name: name,
        namespace: namespace
      });
      if (result.data.success) {
        setYaml(result.data.yaml_content);
        setOriginalYaml(result.data.yaml_content);
      } else {
        setError(result.data.error || 'Failed to fetch YAML');
      }
    } catch (err) {
      setError('Failed to fetch resource YAML');
      logger.error('Failed to fetch resource YAML', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaveResult(null);
    try {
      const result = await kubernetesApi.updateResourceYAML(yaml, namespace, dryRunMode);
      if (result.data.success) {
        setSaveResult({
          success: true,
          message: dryRunMode ?
          'Dry run successful - no changes applied' :
          result.data.message || 'Resource updated successfully'
        });
        if (!dryRunMode) {
          setOriginalYaml(yaml);
          toast.success(`${resourceType} ${name} updated successfully`);
          onRefresh?.();
        } else {
          toast.success('Dry run validation passed');
        }
      } else {
        const errorMsg = result.data.errors?.join('\n') || 'Failed to update resource';
        setSaveResult({ success: false, message: errorMsg });
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update resource';
      setSaveResult({ success: false, message: errorMsg });
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      logger.error('Failed to copy to clipboard', err);
    }
  }

  function handleReset() {
    setYaml(originalYaml);
    setSaveResult(null);
    setError(null);
  }

  if (!isOpen) return null;

  const lines = yaml.split('\n');

  return /*#__PURE__*/createPortal(/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      transition: { type: 'spring', damping: 25, stiffness: 200 },
      className: `fixed top-16 right-0 bottom-0 z-[9999] flex flex-col bg-white dark:bg-slate-800 shadow-2xl border-l border-gray-200 dark:border-slate-700 ${
      isExpanded ? 'w-full left-0' : 'w-[55%] min-w-[600px]'}`, children: [/*#__PURE__*/



      _jsxDEV("div", { className: "flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-gray-100 dark:border-slate-700", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30", children: /*#__PURE__*/
            _jsxDEV(CodeBracketIcon, { className: "h-5 w-5 text-primary-600 dark:text-primary-400" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: [
              editMode ? 'Edit' : 'View', " Resource YAML"] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
              resourceType, "/", name, " in ", namespace] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => setEditMode(!editMode),
            className: `flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-colors ${
            editMode ?
            'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' :
            'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'}`, children: [/*#__PURE__*/


            _jsxDEV(PencilSquareIcon, { className: "h-4 w-4" }, void 0, false),
            editMode ? 'Editing' : 'Edit'] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: handleCopy,
            disabled: loading || !!error,
            className: "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50", children:

            copied ? /*#__PURE__*/
            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(CheckIcon, { className: "h-4 w-4 text-success-500" }, void 0, false), "Copied!"] }, void 0, true

            ) : /*#__PURE__*/

            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(ClipboardDocumentIcon, { className: "h-4 w-4" }, void 0, false), "Copy"] }, void 0, true

            ) }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => setIsExpanded(!isExpanded),
            className: "p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors",
            title: isExpanded ? 'Collapse panel' : 'Expand to full screen', children:

            isExpanded ? /*#__PURE__*/
            _jsxDEV(ArrowsPointingInIcon, { className: "h-5 w-5" }, void 0, false) : /*#__PURE__*/

            _jsxDEV(ArrowsPointingOutIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: onClose,
            className: "p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors",
            title: "Close (Esc)", children: /*#__PURE__*/

            _jsxDEV(XMarkIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ),


      editMode && /*#__PURE__*/
      _jsxDEV("div", { className: "flex-shrink-0 flex items-center justify-between px-6 py-2 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: fetchYAML,
            disabled: loading,
            className: "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors disabled:opacity-50", children: [/*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: handleReset,
            disabled: !hasChanges,
            className: "flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors disabled:opacity-50", children: [/*#__PURE__*/

            _jsxDEV(ArrowUturnLeftIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Reset"] }, void 0, true

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [
          hasChanges && /*#__PURE__*/
          _jsxDEV("span", { className: "flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400", children: [/*#__PURE__*/
            _jsxDEV(ExclamationTriangleIcon, { className: "h-3.5 w-3.5" }, void 0, false), "Unsaved changes"] }, void 0, true

          ), /*#__PURE__*/

          _jsxDEV("label", { className: "flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300", children: [/*#__PURE__*/
            _jsxDEV("input", {
              type: "checkbox",
              checked: dryRunMode,
              onChange: (e) => setDryRunMode(e.target.checked),
              className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-3.5 w-3.5" }, void 0, false
            ), "Dry run"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: handleSave,
            disabled: saving || loading || !hasChanges && !dryRunMode,
            className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children:

            saving ? /*#__PURE__*/
            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: "h-3.5 w-3.5 animate-spin" }, void 0, false),
              dryRunMode ? 'Validating...' : 'Saving...'] }, void 0, true
            ) : /*#__PURE__*/

            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(CheckIcon, { className: "h-3.5 w-3.5" }, void 0, false),
              dryRunMode ? 'Validate' : 'Apply'] }, void 0, true
            ) }, void 0, false

          )] }, void 0, true
        )] }, void 0, true
      ),



      saveResult && /*#__PURE__*/
      _jsxDEV("div", { className: `mx-4 mt-2 p-2 rounded-xl text-xs ${
        saveResult.success ?
        'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 text-success-700 dark:text-success-400' :
        'bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-400'}`, children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-1.5 font-medium", children: [
          saveResult.success ? /*#__PURE__*/
          _jsxDEV(CheckIcon, { className: "h-3.5 w-3.5" }, void 0, false) : /*#__PURE__*/

          _jsxDEV(ExclamationTriangleIcon, { className: "h-3.5 w-3.5" }, void 0, false),

          saveResult.success ? 'Success' : 'Error'] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("p", { className: "mt-0.5 whitespace-pre-wrap", children: saveResult.message }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/



      _jsxDEV("div", { className: "flex-1 overflow-hidden p-4", children:
        loading ? /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-center h-full", children: /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3 text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
            _jsxDEV(ArrowPathIcon, { className: "h-5 w-5 animate-spin" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { children: "Loading YAML..." }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ) :
        error && !yaml ? /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-center h-full", children: /*#__PURE__*/
          _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-danger-500 dark:text-danger-400 font-medium", children: error }, void 0, false), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: fetchYAML,
              className: "mt-3 text-sm text-primary-500 hover:text-primary-600 transition-colors", children:
              "Try again" }, void 0, false

            )] }, void 0, true
          ) }, void 0, false
        ) :
        editMode ? /*#__PURE__*/
        _jsxDEV("textarea", {
          value: yaml,
          onChange: (e) => setYaml(e.target.value),
          className: "w-full h-full p-4 font-mono text-xs bg-gray-900 text-gray-100 rounded-xl border border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none leading-5",
          spellCheck: false,
          placeholder: "YAML content will appear here..." }, void 0, false
        ) : /*#__PURE__*/

        _jsxDEV("div", { className: "h-full bg-gray-50 dark:bg-slate-900 rounded-xl overflow-auto", children: /*#__PURE__*/
          _jsxDEV("pre", { className: "p-4 text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre leading-5", children:
            yaml }, void 0, false
          ) }, void 0, false
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex-shrink-0 flex items-center justify-between px-6 py-2 border-t border-gray-100 dark:border-slate-700 text-xs text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
        _jsxDEV("span", { children: [lines.length, " lines"] }, void 0, true), /*#__PURE__*/
        _jsxDEV("span", { children: "Press Esc to close" }, void 0, false)] }, void 0, true
      )] }, void 0, true
    ),
    document.body
  );
}
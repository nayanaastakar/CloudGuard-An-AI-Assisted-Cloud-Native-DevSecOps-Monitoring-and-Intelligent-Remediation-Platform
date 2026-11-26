import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentIcon,
  DocumentDuplicateIcon } from
'@heroicons/react/24/outline';
import { kubernetesApi } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";










export default function ResourceYAMLEditor({
  isOpen,
  onClose,
  resourceKind,
  resourceName,
  namespace,
  onSaved
}) {
  const [yamlContent, setYamlContent] = useState('');
  const [originalYaml, setOriginalYaml] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveResult, setSaveResult] = useState(null);
  const [dryRunMode, setDryRunMode] = useState(false);
  const toast = useToast();

  // Load YAML when modal opens
  const loadYaml = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSaveResult(null);

    try {
      const response = await kubernetesApi.getResourceYAML({
        kind: resourceKind,
        name: resourceName,
        namespace
      });

      if (response.data.success) {
        setYamlContent(response.data.yaml_content);
        setOriginalYaml(response.data.yaml_content);
        setHasChanges(false);
      } else {
        setError(response.data.error || 'Failed to load resource YAML');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resource YAML');
    } finally {
      setLoading(false);
    }
  }, [resourceKind, resourceName, namespace]);

  useEffect(() => {
    if (isOpen) {
      loadYaml();
    }
  }, [isOpen, loadYaml]);

  // Track changes
  useEffect(() => {
    setHasChanges(yamlContent !== originalYaml);
  }, [yamlContent, originalYaml]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveResult(null);

    try {
      const response = await kubernetesApi.updateResourceYAML(yamlContent, namespace, dryRunMode);

      if (response.data.success) {
        setSaveResult({
          success: true,
          message: dryRunMode ?
          'Dry run successful - no changes applied' :
          response.data.message || 'Resource updated successfully'
        });

        if (!dryRunMode) {
          setOriginalYaml(yamlContent);
          setHasChanges(false);
          toast.success(`${resourceKind} ${resourceName} updated successfully`);
          onSaved?.();
        } else {
          toast.success('Dry run validation passed');
        }
      } else {
        const errorMsg = response.data.errors?.join('\n') || 'Failed to update resource';
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
  };

  const handleReset = () => {
    setYamlContent(originalYaml);
    setError(null);
    setSaveResult(null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yamlContent);
      toast.success('YAML copied to clipboard');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = /*#__PURE__*/
  _jsxDEV(AnimatePresence, { children: /*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm",
      onClick: (e) => e.target === e.currentTarget && handleClose(), children: /*#__PURE__*/

      _jsxDEV(motion.div, {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.95, opacity: 0 },
        transition: { duration: 0.2 },
        className: "bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col", children: [/*#__PURE__*/


        _jsxDEV("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg", children: /*#__PURE__*/
              _jsxDEV(DocumentTextIcon, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: ["Edit ",
                resourceKind] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
                namespace ? `${namespace}/` : '', resourceName] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: handleClose,
            className: "p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors", children: /*#__PURE__*/

            _jsxDEV(XMarkIcon, { className: "w-5 h-5" }, void 0, false) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("button", {
              onClick: loadYaml,
              disabled: loading,
              className: "flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50", children: [/*#__PURE__*/

              _jsxDEV(ArrowPathIcon, { className: `w-4 h-4 ${loading ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: handleCopy,
              className: "flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors", children: [/*#__PURE__*/

              _jsxDEV(ClipboardDocumentIcon, { className: "w-4 h-4" }, void 0, false), "Copy"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: handleReset,
              disabled: !hasChanges,
              className: "flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50", children: [/*#__PURE__*/

              _jsxDEV(DocumentDuplicateIcon, { className: "w-4 h-4" }, void 0, false), "Reset"] }, void 0, true

            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [
            hasChanges && /*#__PURE__*/
            _jsxDEV("span", { className: "text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1", children: [/*#__PURE__*/
              _jsxDEV(ExclamationTriangleIcon, { className: "w-4 h-4" }, void 0, false), "Unsaved changes"] }, void 0, true

            ), /*#__PURE__*/

            _jsxDEV("label", { className: "flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300", children: [/*#__PURE__*/
              _jsxDEV("input", {
                type: "checkbox",
                checked: dryRunMode,
                onChange: (e) => setDryRunMode(e.target.checked),
                className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500" }, void 0, false
              ), "Dry run"] }, void 0, true

            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "flex-1 overflow-hidden p-4", children:
          loading ? /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-center h-full", children: /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3 text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: "w-5 h-5 animate-spin" }, void 0, false), "Loading YAML..."] }, void 0, true

            ) }, void 0, false
          ) :
          error && !yamlContent ? /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-center h-full", children: /*#__PURE__*/
            _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
              _jsxDEV(ExclamationTriangleIcon, { className: "w-12 h-12 text-red-500 mx-auto mb-3" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-red-600 dark:text-red-400", children: error }, void 0, false), /*#__PURE__*/
              _jsxDEV("button", {
                onClick: loadYaml,
                className: "mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children:
                "Retry" }, void 0, false

              )] }, void 0, true
            ) }, void 0, false
          ) : /*#__PURE__*/

          _jsxDEV("textarea", {
            value: yamlContent,
            onChange: (e) => setYamlContent(e.target.value),
            className: "w-full h-full min-h-[400px] p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none",
            spellCheck: false,
            placeholder: "YAML content will appear here..." }, void 0, false
          ) }, void 0, false

        ),


        saveResult && /*#__PURE__*/
        _jsxDEV("div", { className: `mx-6 mb-4 p-3 rounded-lg ${
          saveResult.success ?
          'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
          'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`, children: [/*#__PURE__*/

          _jsxDEV("div", { className: `flex items-center gap-2 text-sm ${
            saveResult.success ?
            'text-green-700 dark:text-green-400' :
            'text-red-700 dark:text-red-400'}`, children: [

            saveResult.success ? /*#__PURE__*/
            _jsxDEV(CheckIcon, { className: "w-4 h-4" }, void 0, false) : /*#__PURE__*/

            _jsxDEV(ExclamationTriangleIcon, { className: "w-4 h-4" }, void 0, false), /*#__PURE__*/

            _jsxDEV("span", { className: "font-medium", children: saveResult.success ? 'Success' : 'Error' }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("p", { className: `mt-1 text-sm whitespace-pre-wrap ${
            saveResult.success ?
            'text-green-600 dark:text-green-300' :
            'text-red-600 dark:text-red-300'}`, children:

            saveResult.message }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/



        _jsxDEV("div", { className: "flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700", children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: handleClose,
            className: "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors", children:
            "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: handleSave,
            disabled: saving || loading || !hasChanges && !dryRunMode,
            className: "flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children:

            saving ? /*#__PURE__*/
            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: "w-4 h-4 animate-spin" }, void 0, false),
              dryRunMode ? 'Validating...' : 'Saving...'] }, void 0, true
            ) : /*#__PURE__*/

            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(CheckIcon, { className: "w-4 h-4" }, void 0, false),
              dryRunMode ? 'Validate' : 'Apply Changes'] }, void 0, true
            ) }, void 0, false

          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ) }, void 0, false
  );


  return /*#__PURE__*/createPortal(modalContent, document.body);
}
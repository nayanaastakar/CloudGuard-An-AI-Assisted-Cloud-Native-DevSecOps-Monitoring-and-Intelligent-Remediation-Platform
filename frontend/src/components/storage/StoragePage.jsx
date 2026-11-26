import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CircleStackIcon,
  DocumentTextIcon,
  FolderIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentIcon } from
'@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';
import { kubernetesApi } from '../../services/api';
import { logger } from '../../utils/logger';
import { useNamespace } from '../../contexts/NamespaceContext';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";


// Modal component
function Modal({ isOpen, onClose, title, children, size = 'md'





}) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (/*#__PURE__*/
    _jsxDEV(AnimatePresence, { children: /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm",
        onClick: onClose, children: /*#__PURE__*/

        _jsxDEV(motion.div, {
          initial: { scale: 0.95, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.95, opacity: 0 },
          onClick: (e) => e.stopPropagation(),
          className: `w-full ${sizeClasses[size]} bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden`, children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: title }, void 0, false), /*#__PURE__*/
            _jsxDEV("button", { onClick: onClose, className: "p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700", children: /*#__PURE__*/
              _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "p-6 max-h-[70vh] overflow-y-auto", children: children }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ) }, void 0, false
    ));

}

// Create PV Modal
function CreatePVModal({ isOpen, onClose, onCreated



}) {
  const [formData, setFormData] = useState({
    name: '',
    capacity: '10Gi',
    access_modes: ['ReadWriteOnce'],
    reclaim_policy: 'Retain',
    storage_class_name: '',
    volume_mode: 'Filesystem',
    host_path: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await kubernetesApi.createPV(formData);
      onCreated();
      onClose();
      setFormData({ name: '', capacity: '10Gi', access_modes: ['ReadWriteOnce'], reclaim_policy: 'Retain', storage_class_name: '', volume_mode: 'Filesystem', host_path: '' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create PV';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (/*#__PURE__*/
    _jsxDEV(Modal, { isOpen: isOpen, onClose: onClose, title: "Create Persistent Volume", size: "lg", children: /*#__PURE__*/
      _jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        error && /*#__PURE__*/
        _jsxDEV("div", { className: "p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm", children:
          error }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Name *" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: formData.name,
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              required: true,
              className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white",
              placeholder: "my-pv" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Capacity *" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: formData.capacity,
              onChange: (e) => setFormData({ ...formData, capacity: e.target.value }),
              required: true,
              className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white",
              placeholder: "10Gi" }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Access Mode" }, void 0, false), /*#__PURE__*/
            _jsxDEV("select", {
              value: formData.access_modes[0],
              onChange: (e) => setFormData({ ...formData, access_modes: [e.target.value] }),
              className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white", children: [/*#__PURE__*/

              _jsxDEV("option", { value: "ReadWriteOnce", children: "ReadWriteOnce" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "ReadOnlyMany", children: "ReadOnlyMany" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "ReadWriteMany", children: "ReadWriteMany" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Reclaim Policy" }, void 0, false), /*#__PURE__*/
            _jsxDEV("select", {
              value: formData.reclaim_policy,
              onChange: (e) => setFormData({ ...formData, reclaim_policy: e.target.value }),
              className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white", children: [/*#__PURE__*/

              _jsxDEV("option", { value: "Retain", children: "Retain" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "Delete", children: "Delete" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "Recycle", children: "Recycle" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Storage Class" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: formData.storage_class_name || '',
              onChange: (e) => setFormData({ ...formData, storage_class_name: e.target.value }),
              className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white",
              placeholder: "standard" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Host Path" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: formData.host_path || '',
              onChange: (e) => setFormData({ ...formData, host_path: e.target.value }),
              className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white",
              placeholder: "/mnt/data" }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex justify-end gap-3 pt-4", children: [/*#__PURE__*/
          _jsxDEV("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            type: "submit",
            disabled: loading,
            className: "px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50", children:

            loading ? 'Creating...' : 'Create PV' }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Create PVC Modal
function CreatePVCModal({ isOpen, onClose, onCreated, namespaces




}) {
  const [formData, setFormData] = useState({
    name: '',
    namespace: 'default',
    storage_class_name: '',
    access_modes: ['ReadWriteOnce'],
    storage: '10Gi',
    volume_mode: 'Filesystem'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await kubernetesApi.createPVC(formData);
      onCreated();
      onClose();
      setFormData({ name: '', namespace: 'default', storage_class_name: '', access_modes: ['ReadWriteOnce'], storage: '10Gi', volume_mode: 'Filesystem' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create PVC';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (/*#__PURE__*/
    _jsxDEV(Modal, { isOpen: isOpen, onClose: onClose, title: "Create Persistent Volume Claim", size: "lg", children: /*#__PURE__*/
      _jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        error && /*#__PURE__*/
        _jsxDEV("div", { className: "p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm", children:
          error }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Name *" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: formData.name,
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              required: true,
              className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white",
              placeholder: "my-pvc" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Namespace *" }, void 0, false), /*#__PURE__*/
            _jsxDEV("select", {
              value: formData.namespace,
              onChange: (e) => setFormData({ ...formData, namespace: e.target.value }),
              className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white", children:

              namespaces.map((ns) => /*#__PURE__*/
              _jsxDEV("option", { value: ns, children: ns }, ns, false)
              ) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Storage Size *" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: formData.storage,
              onChange: (e) => setFormData({ ...formData, storage: e.target.value }),
              required: true,
              className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white",
              placeholder: "10Gi" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Storage Class" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: formData.storage_class_name || '',
              onChange: (e) => setFormData({ ...formData, storage_class_name: e.target.value }),
              className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white",
              placeholder: "standard" }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Access Mode" }, void 0, false), /*#__PURE__*/
            _jsxDEV("select", {
              value: formData.access_modes[0],
              onChange: (e) => setFormData({ ...formData, access_modes: [e.target.value] }),
              className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white", children: [/*#__PURE__*/

              _jsxDEV("option", { value: "ReadWriteOnce", children: "ReadWriteOnce" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "ReadOnlyMany", children: "ReadOnlyMany" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "ReadWriteMany", children: "ReadWriteMany" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Volume Mode" }, void 0, false), /*#__PURE__*/
            _jsxDEV("select", {
              value: formData.volume_mode,
              onChange: (e) => setFormData({ ...formData, volume_mode: e.target.value }),
              className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white", children: [/*#__PURE__*/

              _jsxDEV("option", { value: "Filesystem", children: "Filesystem" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "Block", children: "Block" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex justify-end gap-3 pt-4", children: [/*#__PURE__*/
          _jsxDEV("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            type: "submit",
            disabled: loading,
            className: "px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50", children:

            loading ? 'Creating...' : 'Create PVC' }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Create StorageClass Modal
function CreateStorageClassModal({ isOpen, onClose, onCreated



}) {
  const [formData, setFormData] = useState({
    name: '',
    provisioner: 'kubernetes.io/no-provisioner',
    reclaim_policy: 'Delete',
    volume_binding_mode: 'WaitForFirstConsumer',
    allow_volume_expansion: true,
    is_default: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await kubernetesApi.createStorageClass(formData);
      onCreated();
      onClose();
      setFormData({ name: '', provisioner: 'kubernetes.io/no-provisioner', reclaim_policy: 'Delete', volume_binding_mode: 'WaitForFirstConsumer', allow_volume_expansion: true, is_default: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create StorageClass';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (/*#__PURE__*/
    _jsxDEV(Modal, { isOpen: isOpen, onClose: onClose, title: "Create Storage Class", size: "lg", children: /*#__PURE__*/
      _jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        error && /*#__PURE__*/
        _jsxDEV("div", { className: "p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm", children:
          error }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Name *" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: formData.name,
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              required: true,
              className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white",
              placeholder: "my-storage-class" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Provisioner *" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: formData.provisioner,
              onChange: (e) => setFormData({ ...formData, provisioner: e.target.value }),
              required: true,
              className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white",
              placeholder: "kubernetes.io/gce-pd" }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Reclaim Policy" }, void 0, false), /*#__PURE__*/
            _jsxDEV("select", {
              value: formData.reclaim_policy,
              onChange: (e) => setFormData({ ...formData, reclaim_policy: e.target.value }),
              className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white", children: [/*#__PURE__*/

              _jsxDEV("option", { value: "Delete", children: "Delete" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "Retain", children: "Retain" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Volume Binding Mode" }, void 0, false), /*#__PURE__*/
            _jsxDEV("select", {
              value: formData.volume_binding_mode,
              onChange: (e) => setFormData({ ...formData, volume_binding_mode: e.target.value }),
              className: "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white", children: [/*#__PURE__*/

              _jsxDEV("option", { value: "WaitForFirstConsumer", children: "WaitForFirstConsumer" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "Immediate", children: "Immediate" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-6", children: [/*#__PURE__*/
          _jsxDEV("label", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV("input", {
              type: "checkbox",
              checked: formData.allow_volume_expansion,
              onChange: (e) => setFormData({ ...formData, allow_volume_expansion: e.target.checked }),
              className: "rounded border-gray-300 text-amber-500 focus:ring-amber-500" }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Allow Volume Expansion" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("label", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV("input", {
              type: "checkbox",
              checked: formData.is_default,
              onChange: (e) => setFormData({ ...formData, is_default: e.target.checked }),
              className: "rounded border-gray-300 text-amber-500 focus:ring-amber-500" }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Set as Default" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex justify-end gap-3 pt-4", children: [/*#__PURE__*/
          _jsxDEV("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            type: "submit",
            disabled: loading,
            className: "px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50", children:

            loading ? 'Creating...' : 'Create StorageClass' }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Delete Confirmation Modal
function DeleteConfirmModal({ isOpen, onClose, onConfirm, resourceType, resourceName, loading






}) {
  return (/*#__PURE__*/
    _jsxDEV(Modal, { isOpen: isOpen, onClose: onClose, title: `Delete ${resourceType}`, size: "sm", children: /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20", children: [/*#__PURE__*/
          _jsxDEV(ExclamationTriangleIcon, { className: "h-6 w-6 text-red-500" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-red-600 dark:text-red-400", children: ["Are you sure you want to delete ", /*#__PURE__*/
            _jsxDEV("span", { className: "font-semibold", children: resourceName }, void 0, false), "? This action cannot be undone."] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex justify-end gap-3", children: [/*#__PURE__*/
          _jsxDEV("button", { onClick: onClose, className: "px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: onConfirm,
            disabled: loading,
            className: "px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50", children:

            loading ? 'Deleting...' : 'Delete' }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// YAML Viewer Modal
function YAMLViewerModal({ isOpen, onClose, resourceType, resourceName, namespace





}) {
  const [yaml, setYaml] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      kubernetesApi.getResourceYAML({ kind: resourceType, name: resourceName, namespace }).
      then((res) => setYaml(res.data.yaml_content || 'No YAML content available')).
      catch(() => setYaml('Failed to load YAML')).
      finally(() => setLoading(false));
    }
  }, [isOpen, resourceType, resourceName, namespace]);

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (/*#__PURE__*/
    _jsxDEV(Modal, { isOpen: isOpen, onClose: onClose, title: `${resourceType}: ${resourceName}`, size: "xl", children: /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex justify-end", children: /*#__PURE__*/
          _jsxDEV("button", {
            onClick: handleCopy,
            className: "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700", children: [/*#__PURE__*/

            _jsxDEV(ClipboardDocumentIcon, { className: "h-4 w-4" }, void 0, false),
            copied ? 'Copied!' : 'Copy'] }, void 0, true
          ) }, void 0, false
        ),
        loading ? /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-center h-64", children: /*#__PURE__*/
          _jsxDEV(ArrowPathIcon, { className: "h-6 w-6 animate-spin text-gray-400" }, void 0, false) }, void 0, false
        ) : /*#__PURE__*/

        _jsxDEV("pre", { className: "p-4 rounded-lg bg-gray-900 text-gray-100 text-sm overflow-auto max-h-[60vh] font-mono", children:
          yaml }, void 0, false
        )] }, void 0, true

      ) }, void 0, false
    ));

}

// Tab definitions
const tabs = [
{ id: 'pv', label: 'Persistent Volumes', icon: CircleStackIcon },
{ id: 'pvc', label: 'PV Claims', icon: DocumentTextIcon },
{ id: 'classes', label: 'Storage Classes', icon: FolderIcon }];


export default function StoragePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedNamespace } = useNamespace();
  const activeTab = searchParams.get('tab') || 'pv';
  const [search, setSearch] = useState('');

  // Data states
  const [pvs, setPVs] = useState([]);
  const [pvcs, setPVCs] = useState([]);
  const [storageClasses, setStorageClasses] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreatePV, setShowCreatePV] = useState(false);
  const [showCreatePVC, setShowCreatePVC] = useState(false);
  const [showCreateSC, setShowCreateSC] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [yamlModal, setYamlModal] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const ns = selectedNamespace || undefined;
      const [pvsRes, pvcsRes, scsRes, nsRes] = await Promise.all([
      kubernetesApi.getPVs(),
      kubernetesApi.getPVCs(ns),
      kubernetesApi.getStorageClasses(),
      kubernetesApi.getNamespaces()]
      );
      setPVs(pvsRes.data);
      setPVCs(pvcsRes.data);
      setStorageClasses(scsRes.data);
      setNamespaces(nsRes.data.map((ns) => ns.name));
    } catch (error) {
      logger.error('Error fetching storage data', error);
    } finally {
      setLoading(false);
    }
  }, [selectedNamespace]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered data
  const filteredPVs = pvs.filter((pv) =>
  pv.name.toLowerCase().includes(search.toLowerCase()) ||
  pv.storage_class && pv.storage_class.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPVCs = pvcs.filter((pvc) =>
  pvc.name.toLowerCase().includes(search.toLowerCase()) ||
  pvc.namespace.toLowerCase().includes(search.toLowerCase()) ||
  pvc.storage_class && pvc.storage_class.toLowerCase().includes(search.toLowerCase())
  );
  const filteredSCs = storageClasses.filter((sc) =>
  sc.name.toLowerCase().includes(search.toLowerCase()) ||
  sc.provisioner.toLowerCase().includes(search.toLowerCase())
  );

  // Delete handlers
  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleteLoading(true);
    try {
      if (deleteModal.type === 'PersistentVolume') {
        await kubernetesApi.deletePV(deleteModal.name);
      } else if (deleteModal.type === 'PersistentVolumeClaim') {
        await kubernetesApi.deletePVC(deleteModal.namespace, deleteModal.name);
      } else if (deleteModal.type === 'StorageClass') {
        await kubernetesApi.deleteStorageClass(deleteModal.name);
      }
      fetchData();
      setDeleteModal(null);
    } catch (error) {
      logger.error('Delete failed', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Bound':
      case 'Available':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'Pending':
      case 'Released':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
      case 'Failed':
      case 'Lost':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    }
  };

  // Calculate storage stats
  const parseCapacity = (cap) => {
    const match = cap.match(/^(\d+)(Gi|Mi|Ti|G|M|T)?$/);
    if (!match) return 0;
    const value = parseInt(match[1]);
    const unit = match[2] || 'Gi';
    switch (unit) {
      case 'Ti':case 'T':return value * 1024;
      case 'Gi':case 'G':return value;
      case 'Mi':case 'M':return value / 1024;
      default:return value;
    }
  };

  const totalStorage = {
    total: pvs.reduce((acc, pv) => acc + parseCapacity(pv.capacity), 0),
    used: pvs.filter((pv) => pv.status === 'Bound').reduce((acc, pv) => acc + parseCapacity(pv.capacity), 0),
    available: pvs.filter((pv) => pv.status === 'Available').reduce((acc, pv) => acc + parseCapacity(pv.capacity), 0)
  };

  // Get create button based on tab
  const getCreateButton = () => {
    switch (activeTab) {
      case 'pv':
        return (/*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => setShowCreatePV(true),
            className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-amber-500/25", children: [/*#__PURE__*/

            _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "Create PV"] }, void 0, true

          ));

      case 'pvc':
        return (/*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => setShowCreatePVC(true),
            className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-amber-500/25", children: [/*#__PURE__*/

            _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "Create PVC"] }, void 0, true

          ));

      case 'classes':
        return (/*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => setShowCreateSC(true),
            className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-amber-500/25", children: [/*#__PURE__*/

            _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "Create StorageClass"] }, void 0, true

          ));

      default:
        return null;
    }
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV(PageHeader, {
        title: "Storage",
        description: "Manage persistent volumes, claims, and storage classes",
        icon: CircleStackIcon,
        iconColor: "amber",
        actions: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: fetchData,
            className: "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500", children: /*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `h-5 w-5 ${loading ? 'animate-spin' : ''}` }, void 0, false) }, void 0, false
          ),
          getCreateButton()] }, void 0, true
        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children:
        [
        { label: 'Total Storage', value: `${totalStorage.total}Gi`, color: 'blue', icon: CircleStackIcon },
        { label: 'Used', value: `${totalStorage.used}Gi`, color: 'purple', icon: CheckCircleIcon },
        { label: 'Available', value: `${totalStorage.available}Gi`, color: 'green', icon: FolderIcon }].
        map((stat, index) => /*#__PURE__*/
        _jsxDEV(motion.div, {

          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: index * 0.05 },
          className: "p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: `p-2 rounded-lg ${stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' : stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-green-100 dark:bg-green-900/30'}`, children: /*#__PURE__*/
              _jsxDEV(stat.icon, { className: `h-5 w-5 ${stat.color === 'blue' ? 'text-blue-500' : stat.color === 'purple' ? 'text-purple-500' : 'text-green-500'}` }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: stat.label }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xl font-bold text-gray-900 dark:text-white", children: stat.value }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ) }, stat.label, false
        )
        ) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex gap-2", children:
          tabs.map((tab) => {
            const count = tab.id === 'pv' ? pvs.length : tab.id === 'pvc' ? pvcs.length : storageClasses.length;
            return (/*#__PURE__*/
              _jsxDEV("button", {

                onClick: () => setSearchParams({ tab: tab.id }),
                className: `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id ?
                'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25' :
                'bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200/50 dark:border-slate-700/50'}`, children: [/*#__PURE__*/


                _jsxDEV(tab.icon, { className: "h-4 w-4" }, void 0, false),
                tab.label, /*#__PURE__*/
                _jsxDEV("span", { className: `px-1.5 py-0.5 text-[10px] rounded-full ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'}`, children:

                  count }, void 0, false
                )] }, tab.id, true
              ));

          }) }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
          _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("input", {
            type: "text",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search...",
            className: "pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm w-64" }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ),


      loading && /*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center py-12", children: /*#__PURE__*/
        _jsxDEV(ArrowPathIcon, { className: "h-8 w-8 animate-spin text-amber-500" }, void 0, false) }, void 0, false
      ),



      !loading && activeTab === 'pv' && /*#__PURE__*/
      _jsxDEV("div", { className: "overflow-x-auto rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
        _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
          _jsxDEV("thead", { children: /*#__PURE__*/
            _jsxDEV("tr", { className: "text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Name" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Capacity" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Access Modes" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Reclaim Policy" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Status" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Claim" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Storage Class" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Age" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Actions" }, void 0, false)] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700", children:
            filteredPVs.length === 0 ? /*#__PURE__*/
            _jsxDEV("tr", { children: /*#__PURE__*/
              _jsxDEV("td", { colSpan: 9, className: "py-8 text-center text-gray-500", children: "No persistent volumes found" }, void 0, false) }, void 0, false
            ) :

            filteredPVs.map((pv) => /*#__PURE__*/
            _jsxDEV("tr", { className: "hover:bg-gray-50 dark:hover:bg-slate-800/50", children: [/*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(CircleStackIcon, { className: "h-4 w-4 text-amber-500" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: pv.name }, void 0, false)] }, void 0, true
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-sm text-gray-600 dark:text-gray-400", children: pv.capacity }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("span", { className: "px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400", children:
                  pv.access_modes[0] }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-sm text-gray-600 dark:text-gray-400", children: pv.reclaim_policy }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(pv.status)}`, children:
                  pv.status }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-sm text-gray-600 dark:text-gray-400", children: pv.claim || '-' }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-sm text-gray-600 dark:text-gray-400", children: pv.storage_class || '-' }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-sm text-gray-600 dark:text-gray-400", children: pv.age }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-1", children: [/*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => setYamlModal({ type: 'PersistentVolume', name: pv.name }),
                    className: "p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400", children: /*#__PURE__*/

                    _jsxDEV(EyeIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => setDeleteModal({ type: 'PersistentVolume', name: pv.name }),
                    className: "p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500", children: /*#__PURE__*/

                    _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false
              )] }, pv.name, true
            )
            ) }, void 0, false

          )] }, void 0, true
        ) }, void 0, false
      ),



      !loading && activeTab === 'pvc' && /*#__PURE__*/
      _jsxDEV("div", { className: "overflow-x-auto rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
        _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
          _jsxDEV("thead", { children: /*#__PURE__*/
            _jsxDEV("tr", { className: "text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Name" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Namespace" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Status" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Volume" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Capacity" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Access Modes" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Storage Class" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Age" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Actions" }, void 0, false)] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700", children:
            filteredPVCs.length === 0 ? /*#__PURE__*/
            _jsxDEV("tr", { children: /*#__PURE__*/
              _jsxDEV("td", { colSpan: 9, className: "py-8 text-center text-gray-500", children: "No persistent volume claims found" }, void 0, false) }, void 0, false
            ) :

            filteredPVCs.map((pvc) => /*#__PURE__*/
            _jsxDEV("tr", { className: "hover:bg-gray-50 dark:hover:bg-slate-800/50", children: [/*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(DocumentTextIcon, { className: "h-4 w-4 text-amber-500" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: pvc.name }, void 0, false)] }, void 0, true
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("span", { className: "px-2 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", children:
                  pvc.namespace }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(pvc.status)}`, children:
                  pvc.status }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-sm text-gray-600 dark:text-gray-400", children: pvc.volume || '-' }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-sm text-gray-600 dark:text-gray-400", children: pvc.capacity || '-' }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("span", { className: "px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400", children:
                  pvc.access_modes[0] }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-sm text-gray-600 dark:text-gray-400", children: pvc.storage_class || '-' }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-sm text-gray-600 dark:text-gray-400", children: pvc.age }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-1", children: [/*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => setYamlModal({ type: 'PersistentVolumeClaim', name: pvc.name, namespace: pvc.namespace }),
                    className: "p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400", children: /*#__PURE__*/

                    _jsxDEV(EyeIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => setDeleteModal({ type: 'PersistentVolumeClaim', name: pvc.name, namespace: pvc.namespace }),
                    className: "p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500", children: /*#__PURE__*/

                    _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false
              )] }, `${pvc.namespace}/${pvc.name}`, true
            )
            ) }, void 0, false

          )] }, void 0, true
        ) }, void 0, false
      ),



      !loading && activeTab === 'classes' && /*#__PURE__*/
      _jsxDEV("div", { className: "overflow-x-auto rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
        _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
          _jsxDEV("thead", { children: /*#__PURE__*/
            _jsxDEV("tr", { className: "text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Name" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Provisioner" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Reclaim Policy" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Volume Binding Mode" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Volume Expansion" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Default" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Age" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "py-3 px-4", children: "Actions" }, void 0, false)] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700", children:
            filteredSCs.length === 0 ? /*#__PURE__*/
            _jsxDEV("tr", { children: /*#__PURE__*/
              _jsxDEV("td", { colSpan: 8, className: "py-8 text-center text-gray-500", children: "No storage classes found" }, void 0, false) }, void 0, false
            ) :

            filteredSCs.map((sc) => /*#__PURE__*/
            _jsxDEV("tr", { className: "hover:bg-gray-50 dark:hover:bg-slate-800/50", children: [/*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(FolderIcon, { className: "h-4 w-4 text-amber-500" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: sc.name }, void 0, false)] }, void 0, true
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-sm font-mono text-gray-600 dark:text-gray-400", children: sc.provisioner }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-sm text-gray-600 dark:text-gray-400", children: sc.reclaim_policy }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-sm text-gray-600 dark:text-gray-400", children: sc.volume_binding_mode }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("span", { className: `px-2 py-0.5 text-xs font-medium rounded-full ${sc.allow_volume_expansion ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'}`, children:
                  sc.allow_volume_expansion ? 'Allowed' : 'Not Allowed' }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children:
                sc.is_default ? /*#__PURE__*/
                _jsxDEV("span", { className: "px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", children: "Default" }, void 0, false

                ) : /*#__PURE__*/

                _jsxDEV("span", { className: "text-gray-400", children: "-" }, void 0, false) }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4 text-sm text-gray-600 dark:text-gray-400", children: sc.age }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-1", children: [/*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => setYamlModal({ type: 'StorageClass', name: sc.name }),
                    className: "p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400", children: /*#__PURE__*/

                    _jsxDEV(EyeIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => setDeleteModal({ type: 'StorageClass', name: sc.name }),
                    className: "p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500", children: /*#__PURE__*/

                    _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false
              )] }, sc.name, true
            )
            ) }, void 0, false

          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/



      _jsxDEV(CreatePVModal, {
        isOpen: showCreatePV,
        onClose: () => setShowCreatePV(false),
        onCreated: fetchData }, void 0, false
      ), /*#__PURE__*/
      _jsxDEV(CreatePVCModal, {
        isOpen: showCreatePVC,
        onClose: () => setShowCreatePVC(false),
        onCreated: fetchData,
        namespaces: namespaces }, void 0, false
      ), /*#__PURE__*/
      _jsxDEV(CreateStorageClassModal, {
        isOpen: showCreateSC,
        onClose: () => setShowCreateSC(false),
        onCreated: fetchData }, void 0, false
      ),

      deleteModal && /*#__PURE__*/
      _jsxDEV(DeleteConfirmModal, {
        isOpen: !!deleteModal,
        onClose: () => setDeleteModal(null),
        onConfirm: handleDelete,
        resourceType: deleteModal.type,
        resourceName: deleteModal.name,
        loading: deleteLoading }, void 0, false
      ),


      yamlModal && /*#__PURE__*/
      _jsxDEV(YAMLViewerModal, {
        isOpen: !!yamlModal,
        onClose: () => setYamlModal(null),
        resourceType: yamlModal.type,
        resourceName: yamlModal.name,
        namespace: yamlModal.namespace }, void 0, false
      )] }, void 0, true

    ));

}
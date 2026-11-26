import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  TrashIcon,
  XMarkIcon,
  ChartBarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  KeyIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  ClockIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  Squares2X2Icon,
  ListBulletIcon,
  EyeIcon } from
'@heroicons/react/24/outline';
import { kubernetesApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";


// Compact Modal Component
function Modal({ isOpen, onClose, title, children




}) {
  if (!isOpen) return null;

  return (/*#__PURE__*/
    _jsxDEV(AnimatePresence, { children: /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
        onClick: onClose, children: /*#__PURE__*/

        _jsxDEV(motion.div, {
          initial: { scale: 0.95, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.95, opacity: 0 },
          className: "bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200/50 dark:border-slate-700/50",
          onClick: (e) => e.stopPropagation(), children: [/*#__PURE__*/

          _jsxDEV("div", { className: "px-5 py-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("h2", { className: "text-base font-semibold text-gray-900 dark:text-white", children: title }, void 0, false), /*#__PURE__*/
            _jsxDEV("button", { onClick: onClose, className: "p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: /*#__PURE__*/
              _jsxDEV(XMarkIcon, { className: "h-4 w-4 text-gray-500" }, void 0, false) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "p-5", children: children }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ) }, void 0, false
    ));

}

// Create Namespace Modal
function CreateNamespaceModal({ isOpen, onClose, onSuccess



}) {
  const [name, setName] = useState('');
  const [labels, setLabels] = useState([{ key: '', value: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {setError('Name is required');return;}

    const nameRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;
    if (!nameRegex.test(name)) {
      setError('Name must be lowercase, start/end with alphanumeric, and can contain hyphens (max 63 chars)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const labelsObj = {};
      labels.forEach((l) => {if (l.key) labelsObj[l.key] = l.value;});

      await kubernetesApi.createNamespace({
        name,
        labels: Object.keys(labelsObj).length > 0 ? labelsObj : undefined
      });
      onSuccess();
      onClose();
      setName('');
      setLabels([{ key: '', value: '' }]);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to create namespace');
    } finally {
      setLoading(false);
    }
  };

  return (/*#__PURE__*/
    _jsxDEV(Modal, { isOpen: isOpen, onClose: onClose, title: "Create Namespace", children: /*#__PURE__*/
      _jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        error && /*#__PURE__*/
        _jsxDEV("div", { className: "p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2", children: [/*#__PURE__*/
          _jsxDEV(ExclamationCircleIcon, { className: "h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-red-700 dark:text-red-400", children: error }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5", children: "Name" }, void 0, false), /*#__PURE__*/
          _jsxDEV("input", {
            type: "text",
            required: true,
            value: name,
            onChange: (e) => setName(e.target.value.toLowerCase()),
            className: "w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm",
            placeholder: "my-namespace" }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("p", { className: "mt-1 text-xs text-gray-500 flex items-center gap-1", children: [/*#__PURE__*/
            _jsxDEV(InformationCircleIcon, { className: "h-3 w-3" }, void 0, false), "Lowercase alphanumeric with hyphens"] }, void 0, true

          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5", children: ["Labels ", /*#__PURE__*/
            _jsxDEV("span", { className: "text-gray-400 font-normal", children: "(Optional)" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-2", children: [
            labels.map((label, index) => /*#__PURE__*/
            _jsxDEV("div", { className: "flex gap-2", children: [/*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                placeholder: "Key",
                value: label.key,
                onChange: (e) => {
                  const newLabels = [...labels];
                  newLabels[index].key = e.target.value;
                  setLabels(newLabels);
                },
                className: "flex-1 px-2.5 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm" }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                placeholder: "Value",
                value: label.value,
                onChange: (e) => {
                  const newLabels = [...labels];
                  newLabels[index].value = e.target.value;
                  setLabels(newLabels);
                },
                className: "flex-1 px-2.5 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm" }, void 0, false
              ),
              labels.length > 1 && /*#__PURE__*/
              _jsxDEV("button", { type: "button", onClick: () => setLabels((prev) => prev.filter((_, i) => i !== index)), className: "p-2 text-gray-400 hover:text-red-500", children: /*#__PURE__*/
                _jsxDEV(XMarkIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
              )] }, index, true

            )
            ), /*#__PURE__*/
            _jsxDEV("button", { type: "button", onClick: () => setLabels((prev) => [...prev, { key: '', value: '' }]), className: "flex items-center gap-1 text-xs text-purple-500 hover:text-purple-600 font-medium", children: [/*#__PURE__*/
              _jsxDEV(PlusIcon, { className: "h-3 w-3" }, void 0, false), " Add Label"] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("button", { type: "button", onClick: onClose, className: "px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", { type: "submit", disabled: loading, className: "px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2 text-sm font-medium", children: [
            loading && /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-3.5 w-3.5 animate-spin" }, void 0, false), "Create"] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Delete Confirmation Modal
function DeleteConfirmModal({ isOpen, onClose, onConfirm, namespaceName, loading





}) {
  const [confirmText, setConfirmText] = useState('');

  return (/*#__PURE__*/
    _jsxDEV(Modal, { isOpen: isOpen, onClose: onClose, title: "Delete Namespace", children: /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
            _jsxDEV(ExclamationTriangleIcon, { className: "h-5 w-5 text-red-500 flex-shrink-0" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "font-medium text-red-700 dark:text-red-400 text-sm", children: "This action cannot be undone" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-red-600 dark:text-red-300 mt-1", children: ["All resources in ", /*#__PURE__*/
                _jsxDEV("code", { className: "font-mono bg-red-100 dark:bg-red-900/50 px-1 rounded", children: namespaceName }, void 0, false), " will be permanently deleted."] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/

        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5", children: ["Type ", /*#__PURE__*/
            _jsxDEV("code", { className: "text-red-500", children: namespaceName }, void 0, false), " to confirm"] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("input", {
            type: "text",
            value: confirmText,
            onChange: (e) => setConfirmText(e.target.value),
            className: "w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-red-500 text-sm",
            placeholder: "Enter namespace name" }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex justify-end gap-2 pt-3", children: [/*#__PURE__*/
          _jsxDEV("button", { onClick: onClose, className: "px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: onConfirm,
            disabled: loading || confirmText !== namespaceName,
            className: "px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium", children: [

            loading && /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-3.5 w-3.5 animate-spin" }, void 0, false), "Delete"] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Compact Namespace Details Drawer
function NamespaceDrawer({ namespace, onClose, onDelete, canManage, isProtected





}) {
  const resources = [
  { label: 'Pods', value: namespace.pods, icon: CubeIcon, color: 'blue' },
  { label: 'Deployments', value: namespace.deployments, icon: ServerStackIcon, color: 'purple' },
  { label: 'Services', value: namespace.services, icon: ChartBarIcon, color: 'green' },
  { label: 'ConfigMaps', value: namespace.configmaps, icon: Cog6ToothIcon, color: 'amber' },
  { label: 'Secrets', value: namespace.secrets, icon: KeyIcon, color: 'red' }];


  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
      className: "bg-white dark:bg-slate-800 rounded-xl border border-gray-200/50 dark:border-slate-700/50 overflow-hidden h-fit", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2.5", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2 rounded-lg bg-purple-500/20", children: /*#__PURE__*/
              _jsxDEV(FolderIcon, { className: "h-5 w-5 text-purple-500" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: namespace.name }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-1.5 mt-0.5", children: [/*#__PURE__*/
                _jsxDEV("span", { className: `inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full ${
                  namespace.status === 'Active' ?
                  'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`, children: [/*#__PURE__*/

                  _jsxDEV("span", { className: `w-1 h-1 rounded-full ${namespace.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}` }, void 0, false),
                  namespace.status] }, void 0, true
                ),
                isProtected && /*#__PURE__*/
                _jsxDEV("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", children: [/*#__PURE__*/
                  _jsxDEV(ShieldCheckIcon, { className: "h-2.5 w-2.5" }, void 0, false), " System"] }, void 0, true
                )] }, void 0, true

              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("button", { onClick: onClose, className: "p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: /*#__PURE__*/
            _jsxDEV(XMarkIcon, { className: "h-4 w-4 text-gray-500" }, void 0, false) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "p-4 space-y-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
          _jsxDEV(ClockIcon, { className: "h-3.5 w-3.5" }, void 0, false), /*#__PURE__*/
          _jsxDEV("span", { children: ["Age: ", namespace.age] }, void 0, true)] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "grid grid-cols-2 gap-2", children:
          resources.map((item) => /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-between p-2.5 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(item.icon, { className: `h-3.5 w-3.5 ${
                item.color === 'blue' ? 'text-blue-500' :
                item.color === 'purple' ? 'text-purple-500' :
                item.color === 'green' ? 'text-green-500' :
                item.color === 'amber' ? 'text-amber-500' : 'text-red-500'}` }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs text-gray-600 dark:text-gray-400", children: item.label }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("span", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: item.value }, void 0, false)] }, item.label, true
          )
          ) }, void 0, false
        ),

        Object.keys(namespace.labels).length > 0 && /*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h4", { className: "text-xs font-medium text-gray-500 dark:text-gray-400 mb-2", children: "Labels" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "flex flex-wrap gap-1", children:
            Object.entries(namespace.labels).map(([key, value]) => /*#__PURE__*/
            _jsxDEV("span", { className: "px-1.5 py-0.5 text-[10px] rounded bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400", children: [
              key.split('/').pop(), ": ", value] }, key, true
            )
            ) }, void 0, false
          )] }, void 0, true
        ),


        canManage && !isProtected && /*#__PURE__*/
        _jsxDEV("button", {
          onClick: onDelete,
          className: "w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-sm font-medium", children: [/*#__PURE__*/

          _jsxDEV(TrashIcon, { className: "h-3.5 w-3.5" }, void 0, false), " Delete"] }, void 0, true
        )] }, void 0, true

      )] }, void 0, true
    ));

}

// Main Component
export default function NamespacesPage() {
  const { hasRole } = useAuth();
  const canManage = hasRole('operator');

  const [namespaces, setNamespaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNamespace, setSelectedNamespace] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');

  const protectedNamespaces = ['default', 'kube-system', 'kube-public', 'kube-node-lease'];

  const loadNamespaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await kubernetesApi.getNamespacesWithDetails();
      const uniqueNamespaces = Array.from(
        new Map((response.data || []).map((ns) => [ns.name, ns])).values()
      );
      setNamespaces(uniqueNamespaces);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load namespaces');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {loadNamespaces();}, [loadNamespaces]);

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleteLoading(true);
    try {
      await kubernetesApi.deleteNamespace(deleteModal.name);
      loadNamespaces();
      setDeleteModal(null);
      setSelectedNamespace(null);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to delete namespace');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredNamespaces = useMemo(() => {
    return namespaces.filter((ns) => {
      const matchesSearch = ns.name.toLowerCase().includes(searchQuery.toLowerCase());
      const isSystem = protectedNamespaces.includes(ns.name);
      const matchesFilter = filterStatus === 'all' ||
      filterStatus === 'active' && ns.status === 'Active' ||
      filterStatus === 'system' && isSystem ||
      filterStatus === 'user' && !isSystem;
      return matchesSearch && matchesFilter;
    });
  }, [namespaces, searchQuery, filterStatus]);

  const stats = useMemo(() => ({
    total: namespaces.length,
    active: namespaces.filter((ns) => ns.status === 'Active').length,
    system: namespaces.filter((ns) => protectedNamespaces.includes(ns.name)).length,
    user: namespaces.filter((ns) => !protectedNamespaces.includes(ns.name)).length,
    pods: namespaces.reduce((acc, ns) => acc + ns.pods, 0),
    deployments: namespaces.reduce((acc, ns) => acc + ns.deployments, 0),
    services: namespaces.reduce((acc, ns) => acc + ns.services, 0)
  }), [namespaces]);

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-transparent border border-purple-500/20 dark:border-purple-500/10", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "p-2.5 rounded-xl bg-purple-500/20", children: /*#__PURE__*/
            _jsxDEV(FolderIcon, { className: "h-6 w-6 text-purple-500" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h1", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Namespaces" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Manage Kubernetes namespace isolation" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "flex items-center gap-3 flex-wrap", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-4 px-3 py-2 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-gray-200/50 dark:border-slate-700/50", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-lg font-bold text-gray-900 dark:text-white", children: loading ? '-' : stats.total }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-[10px] text-gray-500 uppercase", children: "Total" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "w-px h-8 bg-gray-200 dark:bg-slate-700" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-lg font-bold text-green-600", children: loading ? '-' : stats.active }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-[10px] text-gray-500 uppercase", children: "Active" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "w-px h-8 bg-gray-200 dark:bg-slate-700" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-lg font-bold text-blue-600", children: loading ? '-' : stats.pods }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-[10px] text-gray-500 uppercase", children: "Pods" }, void 0, false)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "w-px h-8 bg-gray-200 dark:bg-slate-700" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-lg font-bold text-purple-600", children: loading ? '-' : stats.deployments }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-[10px] text-gray-500 uppercase", children: "Deploys" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV("button", {
              onClick: loadNamespaces,
              disabled: loading,
              className: "p-2 bg-white/60 dark:bg-slate-800/60 border border-gray-200/50 dark:border-slate-700/50 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50", children: /*#__PURE__*/

              _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}` }, void 0, false) }, void 0, false
            ),
            canManage && /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => setShowCreateModal(true),
              className: "flex items-center gap-1.5 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium shadow-sm", children: [/*#__PURE__*/

              _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: "hidden sm:inline", children: "Create" }, void 0, false)] }, void 0, true
            )] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ),


      error && /*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: [/*#__PURE__*/
        _jsxDEV(ExclamationTriangleIcon, { className: "h-4 w-4 text-red-500" }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { className: "text-sm text-red-700 dark:text-red-400 flex-1", children: error }, void 0, false), /*#__PURE__*/
        _jsxDEV("button", { onClick: () => setError(null), className: "p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded", children: /*#__PURE__*/
          _jsxDEV(XMarkIcon, { className: "h-3.5 w-3.5 text-red-500" }, void 0, false) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/



      _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "relative flex-1", children: [/*#__PURE__*/
          _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
          _jsxDEV("input", {
            type: "text",
            placeholder: "Search namespaces...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-purple-500" }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center gap-1 p-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg", children:
          ['all', 'active', 'system', 'user'].map((filter) => /*#__PURE__*/
          _jsxDEV("button", {

            onClick: () => setFilterStatus(filter),
            className: `px-2.5 py-1 text-xs font-medium rounded transition-colors ${
            filterStatus === filter ?
            'bg-purple-500 text-white' :
            'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`, children:


            filter.charAt(0).toUpperCase() + filter.slice(1) }, filter, false
          )
          ) }, void 0, false
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-1", children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => setViewMode('grid'),
            className: `p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-gray-700'}`, children: /*#__PURE__*/

            _jsxDEV(Squares2X2Icon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => setViewMode('table'),
            className: `p-1.5 rounded transition-colors ${viewMode === 'table' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-gray-700'}`, children: /*#__PURE__*/

            _jsxDEV(ListBulletIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ),


      loading && namespaces.length === 0 && /*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center py-12", children: /*#__PURE__*/
        _jsxDEV(ArrowPathIcon, { className: "h-6 w-6 animate-spin text-purple-500" }, void 0, false) }, void 0, false
      ),



      !loading && /*#__PURE__*/
      _jsxDEV("div", { className: "flex gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: `flex-1 min-w-0 ${selectedNamespace ? 'lg:w-2/3' : 'w-full'}`, children:
          filteredNamespaces.length === 0 ? /*#__PURE__*/
          _jsxDEV("div", { className: "text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
            _jsxDEV(FolderIcon, { className: "h-10 w-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 text-sm", children:
              searchQuery ? 'No matches found' : 'No namespaces' }, void 0, false
            )] }, void 0, true
          ) :
          viewMode === 'grid' ? /*#__PURE__*/
          _jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3", children:
            filteredNamespaces.map((ns) => {
              const isProtected = protectedNamespaces.includes(ns.name);
              const isSelected = selectedNamespace?.name === ns.name;

              return (/*#__PURE__*/
                _jsxDEV(motion.div, {

                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  onClick: () => setSelectedNamespace(isSelected ? null : ns),
                  className: `relative p-3 rounded-lg bg-white dark:bg-slate-800 border cursor-pointer transition-all group ${
                  isSelected ?
                  'border-purple-500 ring-1 ring-purple-500/20' :
                  'border-gray-200 dark:border-slate-700 hover:border-purple-400'}`, children: [/*#__PURE__*/



                  _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: `p-1.5 rounded-lg ${isProtected ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`, children: /*#__PURE__*/
                      _jsxDEV(FolderIcon, { className: `h-4 w-4 ${isProtected ? 'text-blue-500' : 'text-purple-500'}` }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "flex-1 min-w-0", children: /*#__PURE__*/
                      _jsxDEV("h3", { className: "font-medium text-sm text-gray-900 dark:text-white truncate", children: ns.name }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-1", children: [/*#__PURE__*/
                      _jsxDEV("span", { className: `w-1.5 h-1.5 rounded-full ${ns.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}` }, void 0, false),
                      isProtected && /*#__PURE__*/_jsxDEV(ShieldCheckIcon, { className: "h-3 w-3 text-blue-500" }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/


                  _jsxDEV("div", { className: "flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-700/50 rounded px-2 py-1.5", children: [/*#__PURE__*/
                    _jsxDEV("span", { children: [/*#__PURE__*/_jsxDEV("b", { className: "text-gray-900 dark:text-white", children: ns.pods }, void 0, false), " pods"] }, void 0, true), /*#__PURE__*/
                    _jsxDEV("span", { children: [/*#__PURE__*/_jsxDEV("b", { className: "text-gray-900 dark:text-white", children: ns.deployments }, void 0, false), " deploy"] }, void 0, true), /*#__PURE__*/
                    _jsxDEV("span", { children: [/*#__PURE__*/_jsxDEV("b", { className: "text-gray-900 dark:text-white", children: ns.services }, void 0, false), " svc"] }, void 0, true), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-gray-400", children: ns.age }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/


                  _jsxDEV("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity", children:
                    canManage && !isProtected && /*#__PURE__*/
                    _jsxDEV("button", {
                      onClick: (e) => {e.stopPropagation();setDeleteModal({ isOpen: true, name: ns.name });},
                      className: "p-1 rounded bg-white dark:bg-slate-700 shadow-sm text-gray-400 hover:text-red-500", children: /*#__PURE__*/

                      _jsxDEV(TrashIcon, { className: "h-3 w-3" }, void 0, false) }, void 0, false
                    ) }, void 0, false

                  )] }, ns.name, true
                ));

            }) }, void 0, false
          ) : /*#__PURE__*/

          /* Table View */
          _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden", children: /*#__PURE__*/
            _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
              _jsxDEV("table", { className: "w-full text-sm", children: [/*#__PURE__*/
                _jsxDEV("thead", { children: /*#__PURE__*/
                  _jsxDEV("tr", { className: "border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50", children: [/*#__PURE__*/
                    _jsxDEV("th", { className: "text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase", children: "Name" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("th", { className: "text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase", children: "Status" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("th", { className: "text-center px-3 py-2 text-xs font-medium text-gray-500 uppercase", children: "Pods" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("th", { className: "text-center px-3 py-2 text-xs font-medium text-gray-500 uppercase", children: "Deploy" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("th", { className: "text-center px-3 py-2 text-xs font-medium text-gray-500 uppercase", children: "Svc" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("th", { className: "text-center px-3 py-2 text-xs font-medium text-gray-500 uppercase", children: "CM" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("th", { className: "text-center px-3 py-2 text-xs font-medium text-gray-500 uppercase", children: "Sec" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("th", { className: "text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase", children: "Age" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("th", { className: "px-3 py-2" }, void 0, false)] }, void 0, true
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("tbody", { className: "divide-y divide-gray-100 dark:divide-slate-700/50", children:
                  filteredNamespaces.map((ns) => {
                    const isProtected = protectedNamespaces.includes(ns.name);
                    const isSelected = selectedNamespace?.name === ns.name;

                    return (/*#__PURE__*/
                      _jsxDEV("tr", {

                        onClick: () => setSelectedNamespace(isSelected ? null : ns),
                        className: `cursor-pointer transition-colors ${isSelected ? 'bg-purple-50 dark:bg-purple-900/20' : 'hover:bg-gray-50 dark:hover:bg-slate-700/30'}`, children: [/*#__PURE__*/

                        _jsxDEV("td", { className: "px-3 py-2", children: /*#__PURE__*/
                          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                            _jsxDEV(FolderIcon, { className: `h-4 w-4 ${isProtected ? 'text-blue-500' : 'text-purple-500'}` }, void 0, false), /*#__PURE__*/
                            _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: ns.name }, void 0, false),
                            isProtected && /*#__PURE__*/_jsxDEV(ShieldCheckIcon, { className: "h-3 w-3 text-blue-500" }, void 0, false)] }, void 0, true
                          ) }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV("td", { className: "px-3 py-2", children: /*#__PURE__*/
                          _jsxDEV("span", { className: `inline-flex items-center gap-1 px-1.5 py-0.5 text-xs rounded-full ${
                            ns.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`, children: [/*#__PURE__*/

                            _jsxDEV("span", { className: `w-1 h-1 rounded-full ${ns.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}` }, void 0, false),
                            ns.status] }, void 0, true
                          ) }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV("td", { className: "px-3 py-2 text-center font-medium", children: ns.pods }, void 0, false), /*#__PURE__*/
                        _jsxDEV("td", { className: "px-3 py-2 text-center font-medium", children: ns.deployments }, void 0, false), /*#__PURE__*/
                        _jsxDEV("td", { className: "px-3 py-2 text-center font-medium", children: ns.services }, void 0, false), /*#__PURE__*/
                        _jsxDEV("td", { className: "px-3 py-2 text-center font-medium", children: ns.configmaps }, void 0, false), /*#__PURE__*/
                        _jsxDEV("td", { className: "px-3 py-2 text-center font-medium", children: ns.secrets }, void 0, false), /*#__PURE__*/
                        _jsxDEV("td", { className: "px-3 py-2 text-gray-500", children: ns.age }, void 0, false), /*#__PURE__*/
                        _jsxDEV("td", { className: "px-3 py-2", children: /*#__PURE__*/
                          _jsxDEV("div", { className: "flex items-center gap-1 justify-end", children: [/*#__PURE__*/
                            _jsxDEV("button", {
                              onClick: (e) => {e.stopPropagation();setSelectedNamespace(ns);},
                              className: "p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-purple-500", children: /*#__PURE__*/

                              _jsxDEV(EyeIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                            ),
                            canManage && !isProtected && /*#__PURE__*/
                            _jsxDEV("button", {
                              onClick: (e) => {e.stopPropagation();setDeleteModal({ isOpen: true, name: ns.name });},
                              className: "p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500", children: /*#__PURE__*/

                              _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                            )] }, void 0, true

                          ) }, void 0, false
                        )] }, ns.name, true
                      ));

                  }) }, void 0, false
                )] }, void 0, true
              ) }, void 0, false
            ) }, void 0, false
          ) }, void 0, false

        ), /*#__PURE__*/


        _jsxDEV(AnimatePresence, { children:
          selectedNamespace && /*#__PURE__*/
          _jsxDEV("div", { className: "hidden lg:block w-72 flex-shrink-0", children: /*#__PURE__*/
            _jsxDEV(NamespaceDrawer, {
              namespace: selectedNamespace,
              onClose: () => setSelectedNamespace(null),
              onDelete: () => setDeleteModal({ isOpen: true, name: selectedNamespace.name }),
              canManage: canManage,
              isProtected: protectedNamespaces.includes(selectedNamespace.name) }, void 0, false
            ) }, void 0, false
          ) }, void 0, false

        )] }, void 0, true
      ), /*#__PURE__*/



      _jsxDEV(CreateNamespaceModal, { isOpen: showCreateModal, onClose: () => setShowCreateModal(false), onSuccess: loadNamespaces }, void 0, false),
      deleteModal && /*#__PURE__*/
      _jsxDEV(DeleteConfirmModal, {
        isOpen: deleteModal.isOpen,
        onClose: () => setDeleteModal(null),
        onConfirm: handleDelete,
        namespaceName: deleteModal.name,
        loading: deleteLoading }, void 0, false
      )] }, void 0, true

    ));

}
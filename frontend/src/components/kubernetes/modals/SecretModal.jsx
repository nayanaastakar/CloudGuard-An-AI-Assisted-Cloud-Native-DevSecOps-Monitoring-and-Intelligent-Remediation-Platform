import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  KeyIcon,
  XMarkIcon,
  ArrowPathIcon,
  CheckIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon } from
'@heroicons/react/24/outline';
import { kubernetesApi } from '../../../services/api';
import { useToast } from '../../../contexts/ToastContext';
import { logger } from '../../../utils/logger';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";










export function SecretModal({
  secret,
  mode,
  namespaces,
  onClose,
  onSaved
}) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [secretDetail, setSecretDetail] = useState(null);
  const [editData, setEditData] = useState({});
  const [showValues, setShowValues] = useState({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [createForm, setCreateForm] = useState({
    name: '',
    namespace: namespaces[0]?.name || 'default',
    type: 'Opaque'
  });

  useEffect(() => {
    if (mode !== 'create' && secret) {
      loadSecretDetail();
    }
  }, [secret, mode]);

  const loadSecretDetail = async () => {
    if (!secret) return;
    setLoading(true);
    try {
      const response = await kubernetesApi.getSecret(secret.namespace, secret.name);
      setSecretDetail(response.data);
      setEditData({ ...response.data.data });
    } catch (err) {
      toast.error('Failed to load secret details');
      logger.error('Failed to load secret details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (mode === 'create') {
        await kubernetesApi.createSecret({
          name: createForm.name,
          namespace: createForm.namespace,
          type: createForm.type,
          data: editData
        });
        toast.success('Secret created successfully');
      } else if (mode === 'edit' && secret) {
        await kubernetesApi.updateSecret(secret.namespace, secret.name, {
          data: editData
        });
        toast.success('Secret updated successfully');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(`Failed to ${mode === 'create' ? 'create' : 'update'} secret`);
      logger.error(`Failed to ${mode === 'create' ? 'create' : 'update'} secret`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddKey = () => {
    if (newKey && !editData[newKey]) {
      setEditData({ ...editData, [newKey]: newValue });
      setNewKey('');
      setNewValue('');
    }
  };

  const handleRemoveKey = (key) => {
    const newData = { ...editData };
    delete newData[key];
    setEditData(newData);
  };

  const toggleShowValue = (key) => {
    setShowValues({ ...showValues, [key]: !showValues[key] });
  };

  const isEditable = mode === 'edit' || mode === 'create';

  return /*#__PURE__*/createPortal(/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
      onClick: onClose, children: /*#__PURE__*/

      _jsxDEV(motion.div, {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.95, opacity: 0 },
        className: "bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden",
        onClick: (e) => e.stopPropagation(), children: [/*#__PURE__*/


        _jsxDEV("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl", children: /*#__PURE__*/
              _jsxDEV(KeyIcon, { className: "h-5 w-5 text-purple-600 dark:text-purple-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children:
                mode === 'create' ? 'Create Secret' : mode === 'edit' ? 'Edit Secret' : 'View Secret' }, void 0, false
              ),
              secret && /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
                secret.namespace, "/", secret.name] }, void 0, true
              )] }, void 0, true

            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: onClose,
            className: "p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700", children: /*#__PURE__*/

            _jsxDEV(XMarkIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "p-6 overflow-y-auto max-h-[60vh]", children: [
          loading && /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-center py-12", children: /*#__PURE__*/
            _jsxDEV(ArrowPathIcon, { className: "h-8 w-8 animate-spin text-gray-400" }, void 0, false) }, void 0, false
          ),


          !loading && mode === 'create' && /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-4 mb-6", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Name" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("input", {
                  type: "text",
                  value: createForm.name,
                  onChange: (e) => setCreateForm({ ...createForm, name: e.target.value }),
                  className: "w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500",
                  placeholder: "my-secret" }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Namespace" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("select", {
                  value: createForm.namespace,
                  onChange: (e) => setCreateForm({ ...createForm, namespace: e.target.value }),
                  className: "w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500", children:

                  namespaces.map((ns) => /*#__PURE__*/
                  _jsxDEV("option", { value: ns.name, children: ns.name }, ns.name, false)
                  ) }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Type" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("select", {
                value: createForm.type,
                onChange: (e) => setCreateForm({ ...createForm, type: e.target.value }),
                className: "w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500", children: [/*#__PURE__*/

                _jsxDEV("option", { value: "Opaque", children: "Opaque" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "kubernetes.io/tls", children: "kubernetes.io/tls" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "kubernetes.io/dockerconfigjson", children: "kubernetes.io/dockerconfigjson" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "kubernetes.io/basic-auth", children: "kubernetes.io/basic-auth" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "kubernetes.io/ssh-auth", children: "kubernetes.io/ssh-auth" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ),


          !loading && (mode === 'view' || mode === 'edit') && secretDetail && /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-4 mb-6", children: /*#__PURE__*/
            _jsxDEV("div", { className: "grid grid-cols-3 gap-4 text-sm", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Type:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "ml-2 text-gray-900 dark:text-white", children: secretDetail.type }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Created:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "ml-2 text-gray-900 dark:text-white", children:
                  secretDetail.created_at ? new Date(secretDetail.created_at).toLocaleString() : 'N/A' }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400", children: "Keys:" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "ml-2 text-gray-900 dark:text-white", children: Object.keys(editData).length }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ) }, void 0, false
          ),


          !loading && /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("h4", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Data" }, void 0, false),
              isEditable && /*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => setShowValues(Object.keys(editData).reduce((acc, k) => ({ ...acc, [k]: true }), {})),
                className: "text-xs text-primary-600 dark:text-primary-400 hover:underline", children:
                "Show all values" }, void 0, false

              )] }, void 0, true

            ),

            Object.entries(editData).map(([key, value]) => /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-xl", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2 mb-1", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: key }, void 0, false), /*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => toggleShowValue(key),
                    className: "p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300", children:

                    showValues[key] ? /*#__PURE__*/
                    _jsxDEV(EyeSlashIcon, { className: "h-4 w-4" }, void 0, false) : /*#__PURE__*/

                    _jsxDEV(EyeIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false

                  )] }, void 0, true
                ),
                isEditable ? /*#__PURE__*/
                _jsxDEV("textarea", {
                  value: value,
                  onChange: (e) => setEditData({ ...editData, [key]: e.target.value }),
                  className: "w-full px-2 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-mono",
                  rows: showValues[key] ? 3 : 1,
                  style: { WebkitTextSecurity: showValues[key] ? 'none' : 'disc' } }, void 0, false
                ) : /*#__PURE__*/

                _jsxDEV("div", {
                  className: "text-sm text-gray-600 dark:text-gray-400 font-mono break-all",
                  style: { WebkitTextSecurity: showValues[key] ? 'none' : 'disc' }, children:

                  value || '(empty)' }, void 0, false
                )] }, void 0, true

              ),
              isEditable && /*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => handleRemoveKey(key),
                className: "p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400", children: /*#__PURE__*/

                _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
              )] }, key, true

            )
            ),

            Object.keys(editData).length === 0 && /*#__PURE__*/
            _jsxDEV("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "No data keys" }, void 0, false

            ),


            isEditable && /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-end gap-2 p-3 bg-gray-50 dark:bg-slate-700 rounded-xl", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                _jsxDEV("label", { className: "block text-xs text-gray-500 dark:text-gray-400 mb-1", children: "Key" }, void 0, false), /*#__PURE__*/
                _jsxDEV("input", {
                  type: "text",
                  value: newKey,
                  onChange: (e) => setNewKey(e.target.value),
                  className: "w-full px-2 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white",
                  placeholder: "new-key" }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                _jsxDEV("label", { className: "block text-xs text-gray-500 dark:text-gray-400 mb-1", children: "Value" }, void 0, false), /*#__PURE__*/
                _jsxDEV("input", {
                  type: "text",
                  value: newValue,
                  onChange: (e) => setNewValue(e.target.value),
                  className: "w-full px-2 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white",
                  placeholder: "value" }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("button", {
                onClick: handleAddKey,
                disabled: !newKey,
                className: "px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded disabled:opacity-50", children: /*#__PURE__*/

                _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
              )] }, void 0, true
            )] }, void 0, true

          )] }, void 0, true

        ), /*#__PURE__*/


        _jsxDEV("div", { className: "flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900", children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: onClose,
            className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors", children:

            isEditable ? 'Cancel' : 'Close' }, void 0, false
          ),
          isEditable && /*#__PURE__*/
          _jsxDEV("button", {
            onClick: handleSave,
            disabled: loading || mode === 'create' && !createForm.name,
            className: "flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors disabled:opacity-50", children:

            loading ? /*#__PURE__*/
            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Saving..."] }, void 0, true

            ) : /*#__PURE__*/

            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(CheckIcon, { className: "h-4 w-4" }, void 0, false),
              mode === 'create' ? 'Create' : 'Save Changes'] }, void 0, true
            ) }, void 0, false

          )] }, void 0, true

        )] }, void 0, true
      ) }, void 0, false
    ),
    document.body
  );
}
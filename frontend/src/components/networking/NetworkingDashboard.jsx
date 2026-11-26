import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { kubernetesApi } from '../../services/api';
import { useNamespace } from '../../contexts/NamespaceContext';

import {
  ArrowPathIcon,
  GlobeAltIcon,
  ServerStackIcon,
  ArrowsRightLeftIcon,
  MagnifyingGlassIcon,
  LinkIcon,
  CloudIcon,
  ComputerDesktopIcon,
  CubeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon } from
'@heroicons/react/24/outline';
import PageHeader from '../common/PageHeader';

// Import shared constants

// Types
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";








// Service Type Badge
function ServiceTypeBadge({ type }) {
  const config = {
    ClusterIP: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
    NodePort: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
    LoadBalancer: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
    ExternalName: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400' }
  };
  const style = config[type] || config.ClusterIP;
  return (/*#__PURE__*/
    _jsxDEV("span", { className: `px-2.5 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`, children:
      type }, void 0, false
    ));

}

// Stats Card
function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  index






}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
  };

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.05 },
      className: "p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
        _jsxDEV("div", { className: `p-2.5 rounded-xl ${colorClasses[color]}`, children: /*#__PURE__*/
          _jsxDEV(Icon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: value }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: title }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Modal Component
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (/*#__PURE__*/
    _jsxDEV(AnimatePresence, { children: /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
        onClick: onClose, children: /*#__PURE__*/

        _jsxDEV(motion.div, {
          initial: { scale: 0.95, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.95, opacity: 0 },
          className: "bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden",
          onClick: (e) => e.stopPropagation(), children: [/*#__PURE__*/

          _jsxDEV("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between", children: [/*#__PURE__*/
            _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: title }, void 0, false), /*#__PURE__*/
            _jsxDEV("button", { onClick: onClose, className: "p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors", children: /*#__PURE__*/
              _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "p-6 overflow-y-auto max-h-[calc(90vh-80px)]", children:
            children }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      ) }, void 0, false
    ));

}

// Create Service Modal
function CreateServiceModal({
  isOpen,
  onClose,
  onSuccess,
  namespaces





}) {
  const [formData, setFormData] = useState({
    name: '',
    namespace: 'default',
    type: 'ClusterIP',
    selector: {},
    ports: [{ port: 80, target_port: 80, protocol: 'TCP' }],
    labels: {}
  });
  const [selectorInput, setSelectorInput] = useState('app=');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Parse selector from string
      const selector = {};
      selectorInput.split(',').forEach((pair) => {
        const [key, value] = pair.trim().split('=');
        if (key && value) selector[key] = value;
      });

      await kubernetesApi.createService({ ...formData, selector });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  const addPort = () => {
    setFormData({
      ...formData,
      ports: [...formData.ports, { port: 80, target_port: 80, protocol: 'TCP' }]
    });
  };

  const removePort = (index) => {
    setFormData({
      ...formData,
      ports: formData.ports.filter((_, i) => i !== index)
    });
  };

  const updatePort = (index, field, value) => {
    const newPorts = [...formData.ports];
    newPorts[index] = { ...newPorts[index], [field]: value };
    setFormData({ ...formData, ports: newPorts });
  };

  return (/*#__PURE__*/
    _jsxDEV(Modal, { isOpen: isOpen, onClose: onClose, title: "Create Service", children: /*#__PURE__*/
      _jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        error && /*#__PURE__*/
        _jsxDEV("div", { className: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400", children:
          error }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Name" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              required: true,
              value: formData.name,
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              className: "w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500",
              placeholder: "my-service" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Namespace" }, void 0, false), /*#__PURE__*/
            _jsxDEV("select", {
              value: formData.namespace,
              onChange: (e) => setFormData({ ...formData, namespace: e.target.value }),
              className: "w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500", children:

              namespaces.map((ns) => /*#__PURE__*/
              _jsxDEV("option", { value: ns.name, children: ns.name }, ns.name, false)
              ) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Type" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "flex gap-3", children:
            ['ClusterIP', 'NodePort', 'LoadBalancer'].map((type) => /*#__PURE__*/
            _jsxDEV("button", {

              type: "button",
              onClick: () => setFormData({ ...formData, type }),
              className: `px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              formData.type === type ?
              'bg-blue-500 text-white' :
              'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'}`, children:


              type }, type, false
            )
            ) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Selector" }, void 0, false), /*#__PURE__*/
          _jsxDEV("input", {
            type: "text",
            value: selectorInput,
            onChange: (e) => setSelectorInput(e.target.value),
            className: "w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500",
            placeholder: "app=my-app,tier=frontend" }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("p", { className: "mt-1 text-xs text-gray-500", children: "Comma-separated key=value pairs" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: "Ports" }, void 0, false), /*#__PURE__*/
            _jsxDEV("button", {
              type: "button",
              onClick: addPort,
              className: "text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1", children: [/*#__PURE__*/

              _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), " Add Port"] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "space-y-3", children:
            formData.ports.map((port, index) => /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                _jsxDEV("label", { className: "text-xs text-gray-500 mb-1 block", children: "Port" }, void 0, false), /*#__PURE__*/
                _jsxDEV("input", {
                  type: "number",
                  value: port.port,
                  onChange: (e) => updatePort(index, 'port', parseInt(e.target.value)),
                  className: "w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm" }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                _jsxDEV("label", { className: "text-xs text-gray-500 mb-1 block", children: "Target Port" }, void 0, false), /*#__PURE__*/
                _jsxDEV("input", {
                  type: "number",
                  value: port.target_port,
                  onChange: (e) => updatePort(index, 'target_port', parseInt(e.target.value)),
                  className: "w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm" }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                _jsxDEV("label", { className: "text-xs text-gray-500 mb-1 block", children: "Protocol" }, void 0, false), /*#__PURE__*/
                _jsxDEV("select", {
                  value: port.protocol,
                  onChange: (e) => updatePort(index, 'protocol', e.target.value),
                  className: "w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm", children: [/*#__PURE__*/

                  _jsxDEV("option", { value: "TCP", children: "TCP" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("option", { value: "UDP", children: "UDP" }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ),
              formData.ports.length > 1 && /*#__PURE__*/
              _jsxDEV("button", {
                type: "button",
                onClick: () => removePort(index),
                className: "mt-5 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg", children: /*#__PURE__*/

                _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
              )] }, index, true

            )
            ) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("button", {
            type: "button",
            onClick: onClose,
            className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors", children:
            "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            type: "submit",
            disabled: loading,
            className: "px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2", children: [

            loading && /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Create Service"] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Create Ingress Modal
function CreateIngressModal({
  isOpen,
  onClose,
  onSuccess,
  namespaces,
  services






}) {
  const [formData, setFormData] = useState({
    name: '',
    namespace: 'default',
    ingress_class_name: 'nginx',
    rules: [{ host: '', paths: [{ path: '/', path_type: 'Prefix', service_name: '', service_port: 80 }] }],
    tls: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await kubernetesApi.createIngress(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ingress');
    } finally {
      setLoading(false);
    }
  };

  const updateRule = (ruleIndex, field, value) => {
    const newRules = [...formData.rules];
    newRules[ruleIndex] = { ...newRules[ruleIndex], [field]: value };
    setFormData({ ...formData, rules: newRules });
  };

  const updatePath = (ruleIndex, pathIndex, field, value) => {
    const newRules = [...formData.rules];
    const newPaths = [...newRules[ruleIndex].paths];
    newPaths[pathIndex] = { ...newPaths[pathIndex], [field]: value };
    newRules[ruleIndex] = { ...newRules[ruleIndex], paths: newPaths };
    setFormData({ ...formData, rules: newRules });
  };

  const filteredServices = services.filter((s) => s.namespace === formData.namespace);

  return (/*#__PURE__*/
    _jsxDEV(Modal, { isOpen: isOpen, onClose: onClose, title: "Create Ingress", children: /*#__PURE__*/
      _jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        error && /*#__PURE__*/
        _jsxDEV("div", { className: "p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400", children:
          error }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Name" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              required: true,
              value: formData.name,
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              className: "w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500",
              placeholder: "my-ingress" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Namespace" }, void 0, false), /*#__PURE__*/
            _jsxDEV("select", {
              value: formData.namespace,
              onChange: (e) => setFormData({ ...formData, namespace: e.target.value }),
              className: "w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500", children:

              namespaces.map((ns) => /*#__PURE__*/
              _jsxDEV("option", { value: ns.name, children: ns.name }, ns.name, false)
              ) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Ingress Class" }, void 0, false), /*#__PURE__*/
          _jsxDEV("input", {
            type: "text",
            value: formData.ingress_class_name || '',
            onChange: (e) => setFormData({ ...formData, ingress_class_name: e.target.value }),
            className: "w-full px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500",
            placeholder: "nginx" }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Rules" }, void 0, false),
          formData.rules.map((rule, ruleIndex) => /*#__PURE__*/
          _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl space-y-4 mb-3", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "text-xs text-gray-500 mb-1 block", children: "Host" }, void 0, false), /*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                value: rule.host || '',
                onChange: (e) => updateRule(ruleIndex, 'host', e.target.value),
                className: "w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm",
                placeholder: "example.com" }, void 0, false
              )] }, void 0, true
            ),
            rule.paths.map((path, pathIndex) => /*#__PURE__*/
            _jsxDEV("div", { className: "grid grid-cols-4 gap-3", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("label", { className: "text-xs text-gray-500 mb-1 block", children: "Path" }, void 0, false), /*#__PURE__*/
                _jsxDEV("input", {
                  type: "text",
                  value: path.path,
                  onChange: (e) => updatePath(ruleIndex, pathIndex, 'path', e.target.value),
                  className: "w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm" }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("label", { className: "text-xs text-gray-500 mb-1 block", children: "Path Type" }, void 0, false), /*#__PURE__*/
                _jsxDEV("select", {
                  value: path.path_type,
                  onChange: (e) => updatePath(ruleIndex, pathIndex, 'path_type', e.target.value),
                  className: "w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm", children: [/*#__PURE__*/

                  _jsxDEV("option", { value: "Prefix", children: "Prefix" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("option", { value: "Exact", children: "Exact" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("option", { value: "ImplementationSpecific", children: "ImplementationSpecific" }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("label", { className: "text-xs text-gray-500 mb-1 block", children: "Service" }, void 0, false), /*#__PURE__*/
                _jsxDEV("select", {
                  value: path.service_name,
                  onChange: (e) => updatePath(ruleIndex, pathIndex, 'service_name', e.target.value),
                  className: "w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm", children: [/*#__PURE__*/

                  _jsxDEV("option", { value: "", children: "Select service" }, void 0, false),
                  filteredServices.map((svc) => /*#__PURE__*/
                  _jsxDEV("option", { value: svc.name, children: svc.name }, svc.name, false)
                  )] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("label", { className: "text-xs text-gray-500 mb-1 block", children: "Port" }, void 0, false), /*#__PURE__*/
                _jsxDEV("input", {
                  type: "number",
                  value: path.service_port,
                  onChange: (e) => updatePath(ruleIndex, pathIndex, 'service_port', parseInt(e.target.value)),
                  className: "w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm" }, void 0, false
                )] }, void 0, true
              )] }, pathIndex, true
            )
            )] }, ruleIndex, true
          )
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("button", {
            type: "button",
            onClick: onClose,
            className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors", children:
            "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            type: "submit",
            disabled: loading,
            className: "px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2", children: [

            loading && /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Create Ingress"] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Delete Confirmation Modal
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  resourceType,
  resourceName,
  loading







}) {
  return (/*#__PURE__*/
    _jsxDEV(Modal, { isOpen: isOpen, onClose: onClose, title: `Delete ${resourceType}`, children: /*#__PURE__*/
      _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
        _jsxDEV("p", { className: "text-gray-700 dark:text-gray-300", children: ["Are you sure you want to delete ", /*#__PURE__*/
          _jsxDEV("span", { className: "font-semibold text-red-600", children: resourceName }, void 0, false), "?"] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("p", { className: "text-sm text-gray-500", children: "This action cannot be undone." }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex justify-end gap-3 pt-4", children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: onClose,
            className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors", children:
            "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: onConfirm,
            disabled: loading,
            className: "px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 flex items-center gap-2", children: [

            loading && /*#__PURE__*/_jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Delete"] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Services Table
function ServicesTable({
  services,
  loading,
  onDelete,
  onViewYAML






}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredServices = services.filter((svc) => {
    if (typeFilter !== 'all' && svc.type !== typeFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        svc.name.toLowerCase().includes(query) ||
        svc.namespace.toLowerCase().includes(query));

    }
    return true;
  });

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 overflow-hidden", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "px-5 py-4 border-b border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30", children: /*#__PURE__*/
              _jsxDEV(ServerStackIcon, { className: "h-5 w-5 text-blue-600 dark:text-blue-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Services" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-full", children:
              filteredServices.length }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
              _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                placeholder: "Search services...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "pl-9 pr-4 py-2 text-sm bg-white/50 dark:bg-slate-900/50 border border-gray-200/50 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm" }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("select", {
              value: typeFilter,
              onChange: (e) => setTypeFilter(e.target.value),
              className: "text-sm bg-white/50 dark:bg-slate-900/50 border border-gray-200/50 dark:border-slate-700/50 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500", children: [/*#__PURE__*/

              _jsxDEV("option", { value: "all", children: "All Types" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "ClusterIP", children: "ClusterIP" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "NodePort", children: "NodePort" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "LoadBalancer", children: "LoadBalancer" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "ExternalName", children: "ExternalName" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
        _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
          _jsxDEV("thead", { children: /*#__PURE__*/
            _jsxDEV("tr", { className: "bg-gray-50/50 dark:bg-slate-900/50", children: [/*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Name" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Namespace" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Type" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Cluster IP" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "External IP" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Ports" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Actions" }, void 0, false)] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("tbody", { className: "divide-y divide-gray-100/50 dark:divide-slate-700/50", children:
            loading ? /*#__PURE__*/
            _jsxDEV("tr", { children: /*#__PURE__*/
              _jsxDEV("td", { colSpan: 7, className: "px-5 py-8 text-center", children: /*#__PURE__*/
                _jsxDEV(ArrowPathIcon, { className: "h-5 w-5 animate-spin mx-auto text-gray-400" }, void 0, false) }, void 0, false
              ) }, void 0, false
            ) :
            filteredServices.length === 0 ? /*#__PURE__*/
            _jsxDEV("tr", { children: /*#__PURE__*/
              _jsxDEV("td", { colSpan: 7, className: "px-5 py-8 text-center text-gray-500", children: "No services found" }, void 0, false

              ) }, void 0, false
            ) :

            filteredServices.map((svc, index) => /*#__PURE__*/
            _jsxDEV(motion.tr, {

              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: index * 0.02 },
              className: "hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors", children: [/*#__PURE__*/

              _jsxDEV("td", { className: "px-5 py-4", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(CubeIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: svc.name }, void 0, false)] }, void 0, true
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4 text-sm text-gray-600 dark:text-gray-400", children: svc.namespace }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4", children: /*#__PURE__*/
                _jsxDEV(ServiceTypeBadge, { type: svc.type }, void 0, false) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4", children: /*#__PURE__*/
                _jsxDEV("code", { className: "text-xs bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300", children:
                  svc.cluster_ip || '-' }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4", children:
                svc.external_ip ? /*#__PURE__*/
                _jsxDEV("code", { className: "text-xs bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg text-green-700 dark:text-green-400", children:
                  svc.external_ip }, void 0, false
                ) : /*#__PURE__*/

                _jsxDEV("span", { className: "text-gray-400", children: "-" }, void 0, false) }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex flex-wrap gap-1", children:
                  svc.ports?.map((port, idx) => /*#__PURE__*/
                  _jsxDEV("span", {

                    className: "text-xs bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg text-gray-600 dark:text-gray-400", children: [

                    port.port, "/", port.protocol,
                    port.nodePort && `:${port.nodePort}`] }, idx, true
                  )
                  ) }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4 text-right", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-end gap-2", children: [/*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => onViewYAML(svc.namespace, svc.name, 'Service'),
                    className: "p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors",
                    title: "View YAML", children: /*#__PURE__*/

                    _jsxDEV(DocumentTextIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => onDelete(svc.namespace, svc.name),
                    className: "p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors",
                    title: "Delete", children: /*#__PURE__*/

                    _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false
              )] }, `${svc.namespace}/${svc.name}`, true
            )
            ) }, void 0, false

          )] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true
    ));

}

// Ingresses Table
function IngressesTable({
  ingresses,
  loading,
  onDelete,
  onViewYAML





}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIngresses = ingresses.filter((ing) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        ing.name.toLowerCase().includes(query) ||
        ing.namespace.toLowerCase().includes(query) ||
        ing.hosts?.some((h) => h.toLowerCase().includes(query)));

    }
    return true;
  });

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 overflow-hidden", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "px-5 py-4 border-b border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30", children: /*#__PURE__*/
              _jsxDEV(GlobeAltIcon, { className: "h-5 w-5 text-purple-600 dark:text-purple-400" }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Ingresses" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded-full", children:
              filteredIngresses.length }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
            _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              placeholder: "Search ingresses...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "pl-9 pr-4 py-2 text-sm bg-white/50 dark:bg-slate-900/50 border border-gray-200/50 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm" }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
        _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
          _jsxDEV("thead", { children: /*#__PURE__*/
            _jsxDEV("tr", { className: "bg-gray-50/50 dark:bg-slate-900/50", children: [/*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Name" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Namespace" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Class" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Hosts" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Address" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "TLS" }, void 0, false), /*#__PURE__*/
              _jsxDEV("th", { className: "px-5 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Actions" }, void 0, false)] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("tbody", { className: "divide-y divide-gray-100/50 dark:divide-slate-700/50", children:
            loading ? /*#__PURE__*/
            _jsxDEV("tr", { children: /*#__PURE__*/
              _jsxDEV("td", { colSpan: 7, className: "px-5 py-8 text-center", children: /*#__PURE__*/
                _jsxDEV(ArrowPathIcon, { className: "h-5 w-5 animate-spin mx-auto text-gray-400" }, void 0, false) }, void 0, false
              ) }, void 0, false
            ) :
            filteredIngresses.length === 0 ? /*#__PURE__*/
            _jsxDEV("tr", { children: /*#__PURE__*/
              _jsxDEV("td", { colSpan: 7, className: "px-5 py-8 text-center text-gray-500", children: "No ingresses found" }, void 0, false

              ) }, void 0, false
            ) :

            filteredIngresses.map((ing, index) => /*#__PURE__*/
            _jsxDEV(motion.tr, {

              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: index * 0.02 },
              className: "hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors", children: [/*#__PURE__*/

              _jsxDEV("td", { className: "px-5 py-4", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(GlobeAltIcon, { className: "h-4 w-4 text-gray-400" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: ing.name }, void 0, false)] }, void 0, true
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4 text-sm text-gray-600 dark:text-gray-400", children: ing.namespace }, void 0, false), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4", children: /*#__PURE__*/
                _jsxDEV("span", { className: "px-2.5 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full", children:
                  ing.class_name || 'default' }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex flex-wrap gap-1", children:
                  ing.hosts?.map((host, idx) => /*#__PURE__*/
                  _jsxDEV("a", {

                    href: `https://${host}`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-lg text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors", children: [/*#__PURE__*/

                    _jsxDEV(LinkIcon, { className: "h-3 w-3" }, void 0, false),
                    host] }, idx, true
                  )
                  ) }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4", children:
                ing.address ? /*#__PURE__*/
                _jsxDEV("code", { className: "text-xs bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300", children:
                  ing.address }, void 0, false
                ) : /*#__PURE__*/

                _jsxDEV("span", { className: "text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-lg", children: "Pending" }, void 0, false) }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4 text-center", children:
                ing.tls && ing.tls.length > 0 ? /*#__PURE__*/
                _jsxDEV(CheckCircleIcon, { className: "h-5 w-5 text-green-500 mx-auto" }, void 0, false) : /*#__PURE__*/

                _jsxDEV(ExclamationCircleIcon, { className: "h-5 w-5 text-amber-500 mx-auto" }, void 0, false) }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("td", { className: "px-5 py-4 text-right", children: /*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center justify-end gap-2", children: [/*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => onViewYAML(ing.namespace, ing.name, 'Ingress'),
                    className: "p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors",
                    title: "View YAML", children: /*#__PURE__*/

                    _jsxDEV(DocumentTextIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("button", {
                    onClick: () => onDelete(ing.namespace, ing.name),
                    className: "p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors",
                    title: "Delete", children: /*#__PURE__*/

                    _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false
              )] }, `${ing.namespace}/${ing.name}`, true
            )
            ) }, void 0, false

          )] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true
    ));

}

// Network Topology Visual
function NetworkTopology({ services, ingresses }) {
  const lbServices = services.filter((s) => s.type === 'LoadBalancer');

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 p-6", children: [/*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center gap-3 mb-6", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "p-2 rounded-xl bg-green-100 dark:bg-green-900/30", children: /*#__PURE__*/
          _jsxDEV(ArrowsRightLeftIcon, { className: "h-5 w-5 text-green-600 dark:text-green-400" }, void 0, false) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Network Topology" }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "relative py-8", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex justify-center mb-8", children: /*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            className: "flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/25", children: [/*#__PURE__*/

            _jsxDEV(CloudIcon, { className: "h-5 w-5 text-white" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "text-sm font-medium text-white", children: "Internet" }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "absolute left-1/2 top-24 w-px h-8 bg-gradient-to-b from-blue-500 to-purple-500" }, void 0, false),


        ingresses.length > 0 && /*#__PURE__*/
        _jsxDEV(_Fragment, { children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex justify-center mb-8", children: /*#__PURE__*/
            _jsxDEV(motion.div, {
              initial: { scale: 0.9, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              transition: { delay: 0.1 },
              className: "flex items-center gap-4 px-6 py-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-800", children: [/*#__PURE__*/

              _jsxDEV(GlobeAltIcon, { className: "h-5 w-5 text-purple-600 dark:text-purple-400" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-sm font-medium text-purple-700 dark:text-purple-400", children: "Ingress Controller" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-purple-600 dark:text-purple-500", children: [ingresses.length, " ingress rules"] }, void 0, true)] }, void 0, true
              )] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "absolute left-1/2 top-44 w-px h-8 bg-gradient-to-b from-purple-500 to-green-500" }, void 0, false)] }, void 0, true
        ),



        lbServices.length > 0 && /*#__PURE__*/
        _jsxDEV("div", { className: "flex justify-center gap-3 mb-8 flex-wrap", children: [
          lbServices.slice(0, 4).map((svc, index) => /*#__PURE__*/
          _jsxDEV(motion.div, {

            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { delay: 0.2 + index * 0.05 },
            className: "flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-800", children: [/*#__PURE__*/

            _jsxDEV(ServerStackIcon, { className: "h-4 w-4 text-green-600 dark:text-green-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "text-xs font-medium text-green-700 dark:text-green-400", children: svc.name }, void 0, false)] }, svc.name, true
          )
          ),
          lbServices.length > 4 && /*#__PURE__*/
          _jsxDEV("span", { className: "text-xs text-gray-500 self-center", children: ["+", lbServices.length - 4, " more"] }, void 0, true)] }, void 0, true

        ), /*#__PURE__*/



        _jsxDEV("div", { className: "flex justify-center", children: /*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { delay: 0.3 },
            className: "flex items-center gap-4 px-6 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600", children: [/*#__PURE__*/

            _jsxDEV(CubeIcon, { className: "h-5 w-5 text-gray-600 dark:text-gray-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Cluster Services" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-500", children: [services.length, " services"] }, void 0, true)] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "absolute left-1/2 bottom-20 w-px h-8 bg-gradient-to-b from-gray-400 to-orange-500" }, void 0, false), /*#__PURE__*/


        _jsxDEV("div", { className: "flex justify-center mt-8", children: /*#__PURE__*/
          _jsxDEV(motion.div, {
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { delay: 0.4 },
            className: "flex items-center gap-4 px-6 py-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl border border-orange-200 dark:border-orange-800", children: [/*#__PURE__*/

            _jsxDEV(ComputerDesktopIcon, { className: "h-5 w-5 text-orange-600 dark:text-orange-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-sm font-medium text-orange-700 dark:text-orange-400", children: "Pods" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-orange-600 dark:text-orange-500", children: "Application workloads" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true
      )] }, void 0, true
    ));

}

// YAML Viewer Modal
function YAMLViewerModal({
  isOpen,
  onClose,
  yaml,
  resourceName,
  loading






}) {
  return (/*#__PURE__*/
    _jsxDEV(Modal, { isOpen: isOpen, onClose: onClose, title: `YAML: ${resourceName}`, children:
      loading ? /*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center py-12", children: /*#__PURE__*/
        _jsxDEV(ArrowPathIcon, { className: "h-8 w-8 animate-spin text-gray-400" }, void 0, false) }, void 0, false
      ) : /*#__PURE__*/

      _jsxDEV("pre", { className: "bg-gray-900 text-gray-100 p-4 rounded-xl text-sm overflow-x-auto font-mono max-h-[60vh] overflow-y-auto", children:
        yaml }, void 0, false
      ) }, void 0, false

    ));

}

// Main Component


export default function NetworkingDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedNamespace } = useNamespace();

  // Get initial tab from URL
  const getInitialTab = () => {
    const tabParam = searchParams.get('tab');
    const validTabs = ['services', 'ingresses', 'topology'];
    if (tabParam && validTabs.includes(tabParam)) {
      return tabParam;
    }
    return 'services';
  };

  const [services, setServices] = useState([]);
  const [ingresses, setIngresses] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(getInitialTab());

  // Modals
  const [showCreateServiceModal, setShowCreateServiceModal] = useState(false);
  const [showCreateIngressModal, setShowCreateIngressModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [yamlModal, setYamlModal] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Sync URL when tab changes
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSearchParams({ tab }, { replace: true });
  }, [setSearchParams]);

  // Sync with URL params when they change
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const validTabs = ['services', 'ingresses', 'topology'];
    if (tabParam && validTabs.includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams, activeTab]);

  useEffect(() => {
    loadData();
  }, [selectedNamespace]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const ns = selectedNamespace || undefined;
      const [servicesRes, ingressesRes, namespacesRes] = await Promise.all([
      kubernetesApi.getServices(ns),
      kubernetesApi.getIngresses(ns),
      kubernetesApi.getNamespaces()]
      );
      setServices(servicesRes.data || []);
      setIngresses(ingressesRes.data || []);
      setNamespaces(namespacesRes.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load networking data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleteLoading(true);
    try {
      if (deleteModal.type === 'Service') {
        await kubernetesApi.deleteService(deleteModal.namespace, deleteModal.name);
      } else {
        await kubernetesApi.deleteIngress(deleteModal.namespace, deleteModal.name);
      }
      loadData();
      setDeleteModal(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resource');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewYAML = async (namespace, name, kind) => {
    setYamlModal({ isOpen: true, yaml: '', name: `${kind}/${name}`, loading: true });
    try {
      const res = await kubernetesApi.getResourceYAML({ kind, name, namespace });
      setYamlModal({ isOpen: true, yaml: res.data.yaml_content, name: `${kind}/${name}`, loading: false });
    } catch (err) {
      setYamlModal({ isOpen: true, yaml: `Error: ${err instanceof Error ? err.message : 'Failed to fetch YAML'}`, name: `${kind}/${name}`, loading: false });
    }
  };

  // Calculate stats
  const stats = {
    services: services.length,
    ingresses: ingresses.length,
    loadBalancers: services.filter((s) => s.type === 'LoadBalancer').length,
    clusterIPs: services.filter((s) => s.type === 'ClusterIP').length,
    nodePort: services.filter((s) => s.type === 'NodePort').length,
    externalName: services.filter((s) => s.type === 'ExternalName').length
  };

  const tabs = [
  { id: 'services', label: 'Services', icon: ServerStackIcon, count: stats.services },
  { id: 'ingresses', label: 'Ingresses', icon: GlobeAltIcon, count: stats.ingresses },
  { id: 'topology', label: 'Topology', icon: ArrowsRightLeftIcon }];


  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV(PageHeader, {
        title: "Networking",
        description: "Manage services, ingresses, and network policies",
        icon: GlobeAltIcon,
        iconColor: "blue",
        actions: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: loadData,
            disabled: loading,
            className: "flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50", children: [/*#__PURE__*/

            _jsxDEV(ArrowPathIcon, { className: `h-4 w-4 ${loading ? 'animate-spin' : ''}` }, void 0, false), "Refresh"] }, void 0, true

          ),
          activeTab === 'services' && /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => setShowCreateServiceModal(true),
            className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25", children: [/*#__PURE__*/

            _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "Create Service"] }, void 0, true

          ),

          activeTab === 'ingresses' && /*#__PURE__*/
          _jsxDEV(motion.button, {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            onClick: () => setShowCreateIngressModal(true),
            className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-purple-500/25", children: [/*#__PURE__*/

            _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "Create Ingress"] }, void 0, true

          )] }, void 0, true

        ) }, void 0, false

      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [/*#__PURE__*/
        _jsxDEV(StatsCard, { title: "Services", value: stats.services, icon: ServerStackIcon, color: "blue", index: 0 }, void 0, false), /*#__PURE__*/
        _jsxDEV(StatsCard, { title: "Ingresses", value: stats.ingresses, icon: GlobeAltIcon, color: "purple", index: 1 }, void 0, false), /*#__PURE__*/
        _jsxDEV(StatsCard, { title: "Load Balancers", value: stats.loadBalancers, icon: CloudIcon, color: "green", index: 2 }, void 0, false), /*#__PURE__*/
        _jsxDEV(StatsCard, { title: "NodePorts", value: stats.nodePort, icon: ArrowsRightLeftIcon, color: "orange", index: 3 }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "sticky top-[72px] z-10 -mx-4 lg:-mx-6 px-4 lg:px-6 py-3 bg-gradient-to-r from-slate-50/95 via-white/95 to-slate-50/95 dark:from-slate-900/95 dark:via-slate-900/95 dark:to-slate-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-700/50", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex gap-2", children:
          tabs.map((tab) => /*#__PURE__*/
          _jsxDEV("button", {

            onClick: () => handleTabChange(tab.id),
            className: `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeTab === tab.id ?
            'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' :
            'bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200/50 dark:border-slate-700/50'}`, children: [/*#__PURE__*/


            _jsxDEV(tab.icon, { className: "h-4 w-4" }, void 0, false),
            tab.label,
            tab.count !== undefined && /*#__PURE__*/
            _jsxDEV("span", { className: `px-1.5 py-0.5 text-[10px] rounded-full ${
              activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-700'}`, children:

              tab.count }, void 0, false
            )] }, tab.id, true

          )
          ) }, void 0, false
        ) }, void 0, false
      ),


      error && /*#__PURE__*/
      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400", children: [/*#__PURE__*/

        _jsxDEV("p", { children: error }, void 0, false), /*#__PURE__*/
        _jsxDEV("button", { onClick: loadData, className: "mt-2 text-sm underline hover:no-underline", children: "Retry" }, void 0, false

        )] }, void 0, true
      ),



      activeTab === 'services' && /*#__PURE__*/
      _jsxDEV(ServicesTable, {
        services: services,
        loading: loading,
        onRefresh: loadData,
        onDelete: (namespace, name) => setDeleteModal({ isOpen: true, type: 'Service', namespace, name }),
        onViewYAML: handleViewYAML }, void 0, false
      ),

      activeTab === 'ingresses' && /*#__PURE__*/
      _jsxDEV(IngressesTable, {
        ingresses: ingresses,
        loading: loading,
        onDelete: (namespace, name) => setDeleteModal({ isOpen: true, type: 'Ingress', namespace, name }),
        onViewYAML: handleViewYAML }, void 0, false
      ),

      activeTab === 'topology' && /*#__PURE__*/
      _jsxDEV(NetworkTopology, { services: services, ingresses: ingresses }, void 0, false), /*#__PURE__*/



      _jsxDEV(CreateServiceModal, {
        isOpen: showCreateServiceModal,
        onClose: () => setShowCreateServiceModal(false),
        onSuccess: loadData,
        namespaces: namespaces }, void 0, false
      ), /*#__PURE__*/

      _jsxDEV(CreateIngressModal, {
        isOpen: showCreateIngressModal,
        onClose: () => setShowCreateIngressModal(false),
        onSuccess: loadData,
        namespaces: namespaces,
        services: services }, void 0, false
      ),

      deleteModal && /*#__PURE__*/
      _jsxDEV(DeleteConfirmModal, {
        isOpen: deleteModal.isOpen,
        onClose: () => setDeleteModal(null),
        onConfirm: handleDelete,
        resourceType: deleteModal.type,
        resourceName: `${deleteModal.namespace}/${deleteModal.name}`,
        loading: deleteLoading }, void 0, false
      ),


      yamlModal && /*#__PURE__*/
      _jsxDEV(YAMLViewerModal, {
        isOpen: yamlModal.isOpen,
        onClose: () => setYamlModal(null),
        yaml: yamlModal.yaml,
        resourceName: yamlModal.name,
        loading: yamlModal.loading }, void 0, false
      )] }, void 0, true

    ));

}
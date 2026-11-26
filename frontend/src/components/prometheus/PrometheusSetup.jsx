import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ServerIcon,
  BellIcon,
  ChartBarIcon,
  CpuChipIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PlayIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon } from
'@heroicons/react/24/outline';
import GlassCard from '../common/GlassCard';
import { prometheusApi } from '../../services/prometheusApi';





import { getDefaultStackConfig } from '../../types/prometheus';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";






// Step 1: Namespace & Release Configuration
function NamespaceStep({ config, setConfig }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV("div", { children: [/*#__PURE__*/
        _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Namespace" }, void 0, false

        ), /*#__PURE__*/
        _jsxDEV("input", {
          type: "text",
          value: config.namespace,
          onChange: (e) => setConfig({ ...config, namespace: e.target.value }),
          className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          placeholder: "monitoring" }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("p", { className: "mt-1 text-xs text-gray-500", children: "Namespace where Prometheus stack will be deployed" }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { children: [/*#__PURE__*/
        _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Release Name" }, void 0, false

        ), /*#__PURE__*/
        _jsxDEV("input", {
          type: "text",
          value: config.release_name,
          onChange: (e) => setConfig({ ...config, release_name: e.target.value }),
          className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          placeholder: "prometheus-stack" }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("p", { className: "mt-1 text-xs text-gray-500", children: "Helm release name for the stack" }, void 0, false)] }, void 0, true
      )] }, void 0, true
    ));

}

// Step 2: Prometheus Configuration
function PrometheusStep({ config, setConfig }) {
  const retentionOptions = ['7d', '15d', '30d', '60d', '90d'];
  const storageOptions = ['10Gi', '25Gi', '50Gi', '100Gi', '200Gi', '500Gi'];

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Data Retention" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("select", {
            value: config.prometheus.retention,
            onChange: (e) => setConfig({
              ...config,
              prometheus: { ...config.prometheus, retention: e.target.value }
            }),
            className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500", children:

            retentionOptions.map((opt) => /*#__PURE__*/
            _jsxDEV("option", { value: opt, children: opt }, opt, false)
            ) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Storage Size" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("select", {
            value: config.prometheus.storage_size,
            onChange: (e) => setConfig({
              ...config,
              prometheus: { ...config.prometheus, storage_size: e.target.value }
            }),
            className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500", children:

            storageOptions.map((opt) => /*#__PURE__*/
            _jsxDEV("option", { value: opt, children: opt }, opt, false)
            ) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { children: [/*#__PURE__*/
        _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Storage Class (optional)" }, void 0, false

        ), /*#__PURE__*/
        _jsxDEV("input", {
          type: "text",
          value: config.prometheus.storage_class || '',
          onChange: (e) => setConfig({
            ...config,
            prometheus: { ...config.prometheus, storage_class: e.target.value || undefined }
          }),
          className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500",
          placeholder: "default (uses cluster default)" }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Replicas" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("select", {
            value: config.prometheus.replicas,
            onChange: (e) => setConfig({
              ...config,
              prometheus: { ...config.prometheus, replicas: parseInt(e.target.value) }
            }),
            className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500", children: [/*#__PURE__*/

            _jsxDEV("option", { value: 1, children: "1 (Single)" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: 2, children: "2 (HA)" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: 3, children: "3 (HA)" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Scrape Interval" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("select", {
            value: config.prometheus.scrape_interval,
            onChange: (e) => setConfig({
              ...config,
              prometheus: { ...config.prometheus, scrape_interval: e.target.value }
            }),
            className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500", children: [/*#__PURE__*/

            _jsxDEV("option", { value: "15s", children: "15s" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "30s", children: "30s" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "60s", children: "60s" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [/*#__PURE__*/
        _jsxDEV("h4", { className: "text-sm font-medium text-blue-800 dark:text-blue-300 mb-2", children: "Resource Limits" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-xs text-gray-600 dark:text-gray-400 mb-1", children: "CPU Request" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: config.prometheus.resources.cpu_request,
              onChange: (e) => setConfig({
                ...config,
                prometheus: {
                  ...config.prometheus,
                  resources: { ...config.prometheus.resources, cpu_request: e.target.value }
                }
              }),
              className: "w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-xs text-gray-600 dark:text-gray-400 mb-1", children: "Memory Request" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: config.prometheus.resources.memory_request,
              onChange: (e) => setConfig({
                ...config,
                prometheus: {
                  ...config.prometheus,
                  resources: { ...config.prometheus.resources, memory_request: e.target.value }
                }
              }),
              className: "w-full px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800" }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      )] }, void 0, true
    ));

}

// Step 3: Alertmanager Configuration
function AlertmanagerStep({ config, setConfig }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white", children: "Enable Alertmanager" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500", children: "Handle and route alerts to notification channels" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("label", { className: "relative inline-flex items-center cursor-pointer", children: [/*#__PURE__*/
          _jsxDEV("input", {
            type: "checkbox",
            checked: config.alertmanager.enabled,
            onChange: (e) => setConfig({
              ...config,
              alertmanager: { ...config.alertmanager, enabled: e.target.checked }
            }),
            className: "sr-only peer" }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600" }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ),

      config.alertmanager.enabled && /*#__PURE__*/
      _jsxDEV(_Fragment, { children: [/*#__PURE__*/
        _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Replicas" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("select", {
              value: config.alertmanager.replicas,
              onChange: (e) => setConfig({
                ...config,
                alertmanager: { ...config.alertmanager, replicas: parseInt(e.target.value) }
              }),
              className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500", children: [/*#__PURE__*/

              _jsxDEV("option", { value: 1, children: "1" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: 2, children: "2" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: 3, children: "3" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Storage Size" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("select", {
              value: config.alertmanager.storage_size,
              onChange: (e) => setConfig({
                ...config,
                alertmanager: { ...config.alertmanager, storage_size: e.target.value }
              }),
              className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500", children: [/*#__PURE__*/

              _jsxDEV("option", { value: "5Gi", children: "5Gi" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "10Gi", children: "10Gi" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "20Gi", children: "20Gi" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg", children: /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
            _jsxDEV(ExclamationTriangleIcon, { className: "w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { children: /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-amber-800 dark:text-amber-300", children: "Notification receivers (Slack, Email, PagerDuty) can be configured after deployment through the Alert Rules Manager." }, void 0, false

              ) }, void 0, false
            )] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true
      )] }, void 0, true

    ));

}

// Step 4: Grafana Configuration
function GrafanaStep({ config, setConfig }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white", children: "Enable Grafana" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500", children: "Visualization and dashboards for metrics" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("label", { className: "relative inline-flex items-center cursor-pointer", children: [/*#__PURE__*/
          _jsxDEV("input", {
            type: "checkbox",
            checked: config.grafana.enabled,
            onChange: (e) => setConfig({
              ...config,
              grafana: { ...config.grafana, enabled: e.target.checked }
            }),
            className: "sr-only peer" }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600" }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ),

      config.grafana.enabled && /*#__PURE__*/
      _jsxDEV(_Fragment, { children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Admin Password (optional)" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("input", {
            type: "password",
            value: config.grafana.admin_password || '',
            onChange: (e) => setConfig({
              ...config,
              grafana: { ...config.grafana, admin_password: e.target.value || undefined }
            }),
            className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500",
            placeholder: "Auto-generated if empty" }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white", children: "Enable Persistence" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-500", children: "Store dashboards and settings" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("label", { className: "relative inline-flex items-center cursor-pointer", children: [/*#__PURE__*/
            _jsxDEV("input", {
              type: "checkbox",
              checked: config.grafana.persistence_enabled,
              onChange: (e) => setConfig({
                ...config,
                grafana: { ...config.grafana, persistence_enabled: e.target.checked }
              }),
              className: "sr-only peer" }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ),

        config.grafana.persistence_enabled && /*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Storage Size" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("select", {
            value: config.grafana.storage_size,
            onChange: (e) => setConfig({
              ...config,
              grafana: { ...config.grafana, storage_size: e.target.value }
            }),
            className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500", children: [/*#__PURE__*/

            _jsxDEV("option", { value: "5Gi", children: "5Gi" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "10Gi", children: "10Gi" }, void 0, false), /*#__PURE__*/
            _jsxDEV("option", { value: "20Gi", children: "20Gi" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white", children: "Enable Ingress" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-500", children: "Expose Grafana externally" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("label", { className: "relative inline-flex items-center cursor-pointer", children: [/*#__PURE__*/
            _jsxDEV("input", {
              type: "checkbox",
              checked: config.grafana.ingress_enabled,
              onChange: (e) => setConfig({
                ...config,
                grafana: { ...config.grafana, ingress_enabled: e.target.checked }
              }),
              className: "sr-only peer" }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ),

        config.grafana.ingress_enabled && /*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Ingress Host" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("input", {
            type: "text",
            value: config.grafana.ingress_host || '',
            onChange: (e) => setConfig({
              ...config,
              grafana: { ...config.grafana, ingress_host: e.target.value || undefined }
            }),
            className: "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500",
            placeholder: "grafana.example.com" }, void 0, false
          )] }, void 0, true
        )] }, void 0, true

      )] }, void 0, true

    ));

}

// Step 5: Exporters Configuration
function ExportersStep({ config, setConfig }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white", children: "Node Exporter" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500", children: "Collect hardware and OS metrics from nodes" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("label", { className: "relative inline-flex items-center cursor-pointer", children: [/*#__PURE__*/
          _jsxDEV("input", {
            type: "checkbox",
            checked: config.node_exporter.enabled,
            onChange: (e) => setConfig({
              ...config,
              node_exporter: { enabled: e.target.checked }
            }),
            className: "sr-only peer" }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h4", { className: "font-medium text-gray-900 dark:text-white", children: "kube-state-metrics" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500", children: "Collect Kubernetes object state metrics" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("label", { className: "relative inline-flex items-center cursor-pointer", children: [/*#__PURE__*/
          _jsxDEV("input", {
            type: "checkbox",
            checked: config.kube_state_metrics.enabled,
            onChange: (e) => setConfig({
              ...config,
              kube_state_metrics: { enabled: e.target.checked }
            }),
            className: "sr-only peer" }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [/*#__PURE__*/
        _jsxDEV("h4", { className: "text-sm font-medium text-blue-800 dark:text-blue-300 mb-2", children: "What you'll get:" }, void 0, false), /*#__PURE__*/
        _jsxDEV("ul", { className: "text-sm text-blue-700 dark:text-blue-400 space-y-1", children: [
          config.node_exporter.enabled && /*#__PURE__*/
          _jsxDEV("li", { children: "- CPU, Memory, Disk, Network metrics per node" }, void 0, false),

          config.kube_state_metrics.enabled && /*#__PURE__*/
          _jsxDEV("li", { children: "- Deployment, Pod, Service, Node state metrics" }, void 0, false), /*#__PURE__*/

          _jsxDEV("li", { children: "- Container CPU/Memory metrics (from kubelet)" }, void 0, false), /*#__PURE__*/
          _jsxDEV("li", { children: "- Kubernetes API server metrics" }, void 0, false)] }, void 0, true
        )] }, void 0, true
      )] }, void 0, true
    ));

}

// Step 6: Review & Deploy
function ReviewStep({ config }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
          _jsxDEV("h4", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "Namespace" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: config.namespace }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
          _jsxDEV("h4", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "Release Name" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: config.release_name }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
        _jsxDEV("h4", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-2", children: "Prometheus" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "grid grid-cols-3 gap-2 text-sm", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/_jsxDEV("span", { className: "text-gray-500", children: "Retention:" }, void 0, false), " ", config.prometheus.retention] }, void 0, true), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/_jsxDEV("span", { className: "text-gray-500", children: "Storage:" }, void 0, false), " ", config.prometheus.storage_size] }, void 0, true), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/_jsxDEV("span", { className: "text-gray-500", children: "Replicas:" }, void 0, false), " ", config.prometheus.replicas] }, void 0, true)] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "grid grid-cols-3 gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: `p-4 rounded-lg ${config.alertmanager.enabled ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-slate-700/50'}`, children: /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2", children: [
            config.alertmanager.enabled ? /*#__PURE__*/
            _jsxDEV(CheckCircleIcon, { className: "w-5 h-5 text-green-500" }, void 0, false) : /*#__PURE__*/

            _jsxDEV(XCircleIcon, { className: "w-5 h-5 text-gray-400" }, void 0, false), /*#__PURE__*/

            _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: "Alertmanager" }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("div", { className: `p-4 rounded-lg ${config.grafana.enabled ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-slate-700/50'}`, children: /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2", children: [
            config.grafana.enabled ? /*#__PURE__*/
            _jsxDEV(CheckCircleIcon, { className: "w-5 h-5 text-green-500" }, void 0, false) : /*#__PURE__*/

            _jsxDEV(XCircleIcon, { className: "w-5 h-5 text-gray-400" }, void 0, false), /*#__PURE__*/

            _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: "Grafana" }, void 0, false)] }, void 0, true
          ) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("div", { className: `p-4 rounded-lg ${config.node_exporter.enabled ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-slate-700/50'}`, children: /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2", children: [
            config.node_exporter.enabled ? /*#__PURE__*/
            _jsxDEV(CheckCircleIcon, { className: "w-5 h-5 text-green-500" }, void 0, false) : /*#__PURE__*/

            _jsxDEV(XCircleIcon, { className: "w-5 h-5 text-gray-400" }, void 0, false), /*#__PURE__*/

            _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: "Node Exporter" }, void 0, false)] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-start gap-2", children: [/*#__PURE__*/
          _jsxDEV(ExclamationTriangleIcon, { className: "w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { children: /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-amber-800 dark:text-amber-300", children: "Deployment may take 5-10 minutes. The stack will be installed via Helm and pods will need time to start." }, void 0, false

            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true
    ));

}

// Main Component
export default function PrometheusSetup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState(getDefaultStackConfig());
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState(null);
  const [deployResult, setDeployResult] = useState(null);

  const steps = [
  { id: 'namespace', title: 'Namespace', icon: ServerIcon },
  { id: 'prometheus', title: 'Prometheus', icon: ChartBarIcon },
  { id: 'alertmanager', title: 'Alertmanager', icon: BellIcon },
  { id: 'grafana', title: 'Grafana', icon: ChartBarIcon },
  { id: 'exporters', title: 'Exporters', icon: CpuChipIcon },
  { id: 'review', title: 'Review', icon: Cog6ToothIcon }];


  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await prometheusApi.getStackStatus();
      setStatus(response.data);
    } catch (err) {
      // Stack not installed is expected
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async () => {
    setDeploying(true);
    setError(null);
    setDeployResult(null);

    try {
      const response = await prometheusApi.deployStack(config);
      setDeployResult({ success: response.data.success, message: response.data.message });
      if (response.data.success) {
        setStatus(response.data.status || null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Deployment failed';
      setError(errorMessage);
      setDeployResult({ success: false, message: errorMessage });
    } finally {
      setDeploying(false);
    }
  };

  const getStatusColor = (stackStatus) => {
    switch (stackStatus) {
      case 'running':
        return 'text-green-500 bg-green-500/10';
      case 'degraded':
        return 'text-amber-500 bg-amber-500/10';
      case 'failed':
        return 'text-red-500 bg-red-500/10';
      case 'installing':
      case 'upgrading':
        return 'text-blue-500 bg-blue-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  if (loading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center h-64", children: /*#__PURE__*/
        _jsxDEV("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" }, void 0, false) }, void 0, false
      ));

  }

  // If stack is already installed, show status
  if (status && status.status !== 'not_installed') {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "space-y-6", children: /*#__PURE__*/
        _jsxDEV(GlassCard, { children: /*#__PURE__*/
          _jsxDEV("div", { className: "p-6", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between mb-6", children: [/*#__PURE__*/
              _jsxDEV("h2", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "Prometheus Stack Status" }, void 0, false), /*#__PURE__*/
              _jsxDEV("span", { className: `px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status.status)}`, children:
                status.status }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Namespace" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "font-semibold text-gray-900 dark:text-white", children: status.namespace }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Release" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "font-semibold text-gray-900 dark:text-white", children: status.release_name }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Version" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "font-semibold text-gray-900 dark:text-white", children: status.version || 'N/A' }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Components" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "font-semibold text-gray-900 dark:text-white", children: status.components.length }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/

            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "Components" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-2", children:
              status.components.map((component) => /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-3", children: [
                  component.ready ? /*#__PURE__*/
                  _jsxDEV(CheckCircleIcon, { className: "w-5 h-5 text-green-500" }, void 0, false) : /*#__PURE__*/

                  _jsxDEV(XCircleIcon, { className: "w-5 h-5 text-red-500" }, void 0, false), /*#__PURE__*/

                  _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white", children: component.name }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("span", { className: "text-sm text-gray-500", children: [
                  component.ready_replicas, "/", component.replicas, " ready"] }, void 0, true
                )] }, component.name, true
              )
              ) }, void 0, false
            ),

            status.prometheus_url && /*#__PURE__*/
            _jsxDEV("div", { className: "mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [/*#__PURE__*/
              _jsxDEV("h4", { className: "text-sm font-medium text-blue-800 dark:text-blue-300 mb-2", children: "Access URLs (Internal)" }, void 0, false), /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-1 text-sm text-blue-700 dark:text-blue-400", children: [/*#__PURE__*/
                _jsxDEV("p", { children: ["Prometheus: ", status.prometheus_url] }, void 0, true),
                status.alertmanager_url && /*#__PURE__*/_jsxDEV("p", { children: ["Alertmanager: ", status.alertmanager_url] }, void 0, true),
                status.grafana_url && /*#__PURE__*/_jsxDEV("p", { children: ["Grafana: ", status.grafana_url] }, void 0, true)] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true

          ) }, void 0, false
        ) }, void 0, false
      ));

  }

  // Show setup wizard
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: /*#__PURE__*/
      _jsxDEV(GlassCard, { children: /*#__PURE__*/
        _jsxDEV("div", { className: "p-6", children: [/*#__PURE__*/
          _jsxDEV("h2", { className: "text-xl font-bold text-gray-900 dark:text-white mb-2", children: "Deploy Prometheus Stack" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 mb-6", children: "Deploy a complete monitoring stack with Prometheus, Alertmanager, Grafana, and exporters." }, void 0, false

          ), /*#__PURE__*/


          _jsxDEV("div", { className: "flex items-center justify-between mb-8", children:
            steps.map((step, index) => /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center", children: [/*#__PURE__*/
              _jsxDEV("button", {
                onClick: () => setCurrentStep(index),
                className: `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                currentStep === index ?
                'bg-primary-600 text-white' :
                currentStep > index ?
                'bg-green-500/10 text-green-500' :
                'bg-gray-100 dark:bg-slate-700 text-gray-500'}`, children: [/*#__PURE__*/


                _jsxDEV(step.icon, { className: "w-5 h-5" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "hidden md:inline text-sm font-medium", children: step.title }, void 0, false)] }, void 0, true
              ),
              index < steps.length - 1 && /*#__PURE__*/
              _jsxDEV("div", { className: `w-8 h-0.5 mx-2 ${currentStep > index ? 'bg-green-500' : 'bg-gray-300 dark:bg-slate-600'}` }, void 0, false)] }, step.id, true

            )
            ) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV(AnimatePresence, { mode: "wait", children: /*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -20 },
              transition: { duration: 0.2 },
              className: "min-h-[300px]", children: [

              currentStep === 0 && /*#__PURE__*/_jsxDEV(NamespaceStep, { config: config, setConfig: setConfig }, void 0, false),
              currentStep === 1 && /*#__PURE__*/_jsxDEV(PrometheusStep, { config: config, setConfig: setConfig }, void 0, false),
              currentStep === 2 && /*#__PURE__*/_jsxDEV(AlertmanagerStep, { config: config, setConfig: setConfig }, void 0, false),
              currentStep === 3 && /*#__PURE__*/_jsxDEV(GrafanaStep, { config: config, setConfig: setConfig }, void 0, false),
              currentStep === 4 && /*#__PURE__*/_jsxDEV(ExportersStep, { config: config, setConfig: setConfig }, void 0, false),
              currentStep === 5 && /*#__PURE__*/_jsxDEV(ReviewStep, { config: config }, void 0, false)] }, currentStep, true
            ) }, void 0, false
          ),


          error && /*#__PURE__*/
          _jsxDEV("div", { className: "mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg", children: /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-red-600 dark:text-red-400", children: error }, void 0, false) }, void 0, false
          ),


          deployResult && /*#__PURE__*/
          _jsxDEV("div", { className: `mt-4 p-4 rounded-lg ${deployResult.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`, children: /*#__PURE__*/
            _jsxDEV("p", { className: `text-sm ${deployResult.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`, children:
              deployResult.message }, void 0, false
            ) }, void 0, false
          ), /*#__PURE__*/



          _jsxDEV("div", { className: "flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700", children: [/*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => setCurrentStep(Math.max(0, currentStep - 1)),
              disabled: currentStep === 0,
              className: "flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed", children: [/*#__PURE__*/

              _jsxDEV(ArrowLeftIcon, { className: "w-4 h-4" }, void 0, false), "Back"] }, void 0, true

            ),

            currentStep < steps.length - 1 ? /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => setCurrentStep(currentStep + 1),
              className: "flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors", children: [
              "Next", /*#__PURE__*/

              _jsxDEV(ArrowRightIcon, { className: "w-4 h-4" }, void 0, false)] }, void 0, true
            ) : /*#__PURE__*/

            _jsxDEV("button", {
              onClick: handleDeploy,
              disabled: deploying,
              className: "flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children:

              deploying ? /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" }, void 0, false), "Deploying..."] }, void 0, true

              ) : /*#__PURE__*/

              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(PlayIcon, { className: "w-4 h-4" }, void 0, false), "Deploy Stack"] }, void 0, true

              ) }, void 0, false

            )] }, void 0, true

          )] }, void 0, true
        ) }, void 0, false
      ) }, void 0, false
    ));

}
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ExclamationTriangleIcon,
  PlusIcon,
  FunnelIcon } from
'@heroicons/react/24/outline';
import { incidentsApi } from '../../services/api';
import { logger } from '../../utils/logger';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";


export default function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchIncidents();
  }, [statusFilter, severityFilter]);

  async function fetchIncidents() {
    setLoading(true);
    try {
      const res = await incidentsApi.list({
        status: statusFilter || undefined,
        severity: severityFilter || undefined
      });
      setIncidents(res.data);
    } catch (error) {
      logger.error('Failed to fetch incidents', error);
    } finally {
      setLoading(false);
    }
  }

  async function createIncident(data) {
    try {
      await incidentsApi.create(data);
      setShowCreateModal(false);
      fetchIncidents();
    } catch (error) {
      logger.error('Failed to create incident', error);
    }
  }

  const severityColors = {
    critical: 'bg-danger-50 dark:bg-danger-500/20 text-danger-600 dark:text-danger-400 border-danger-200 dark:border-danger-500/30',
    high: 'bg-warning-50 dark:bg-warning-500/20 text-warning-600 dark:text-warning-400 border-warning-200 dark:border-warning-500/30',
    medium: 'bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-500/30',
    low: 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
  };

  const statusColors = {
    open: 'bg-danger-50 dark:bg-danger-500/20 text-danger-600 dark:text-danger-400',
    investigating: 'bg-warning-50 dark:bg-warning-500/20 text-warning-600 dark:text-warning-400',
    identified: 'bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400',
    monitoring: 'bg-success-50 dark:bg-success-500/20 text-success-600 dark:text-success-400',
    resolved: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
        _jsxDEV("h1", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: "Incidents" }, void 0, false), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: () => setShowCreateModal(true),
          className: "btn-primary flex items-center gap-2", children: [/*#__PURE__*/

          _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "New Incident"] }, void 0, true

        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "card flex flex-wrap items-center gap-4", children: [/*#__PURE__*/
        _jsxDEV(FunnelIcon, { className: "h-5 w-5 text-gray-400" }, void 0, false), /*#__PURE__*/
        _jsxDEV("select", {
          value: statusFilter,
          onChange: (e) => setStatusFilter(e.target.value),
          className: "px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100", children: [/*#__PURE__*/

          _jsxDEV("option", { value: "", children: "All Statuses" }, void 0, false), /*#__PURE__*/
          _jsxDEV("option", { value: "open", children: "Open" }, void 0, false), /*#__PURE__*/
          _jsxDEV("option", { value: "investigating", children: "Investigating" }, void 0, false), /*#__PURE__*/
          _jsxDEV("option", { value: "identified", children: "Identified" }, void 0, false), /*#__PURE__*/
          _jsxDEV("option", { value: "monitoring", children: "Monitoring" }, void 0, false), /*#__PURE__*/
          _jsxDEV("option", { value: "resolved", children: "Resolved" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("select", {
          value: severityFilter,
          onChange: (e) => setSeverityFilter(e.target.value),
          className: "px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100", children: [/*#__PURE__*/

          _jsxDEV("option", { value: "", children: "All Severities" }, void 0, false), /*#__PURE__*/
          _jsxDEV("option", { value: "critical", children: "Critical" }, void 0, false), /*#__PURE__*/
          _jsxDEV("option", { value: "high", children: "High" }, void 0, false), /*#__PURE__*/
          _jsxDEV("option", { value: "medium", children: "Medium" }, void 0, false), /*#__PURE__*/
          _jsxDEV("option", { value: "low", children: "Low" }, void 0, false)] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "card", children:
        loading ? /*#__PURE__*/
        _jsxDEV("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "Loading..." }, void 0, false) :
        incidents.length === 0 ? /*#__PURE__*/
        _jsxDEV("div", { className: "text-center py-12", children: [/*#__PURE__*/
          _jsxDEV(ExclamationTriangleIcon, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children: "No incidents found" }, void 0, false)] }, void 0, true
        ) : /*#__PURE__*/

        _jsxDEV("div", { className: "space-y-3", children:
          incidents.map((incident) => /*#__PURE__*/
          _jsxDEV(Link, {

            to: `/incidents/${incident.id}`,
            className: "block p-4 rounded-lg border border-gray-100 dark:border-slate-600 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-sm dark:hover:bg-slate-700/50 transition-all", children: /*#__PURE__*/

            _jsxDEV("div", { className: "flex items-start justify-between gap-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-3 mb-2", children: [/*#__PURE__*/
                  _jsxDEV("span", {
                    className: `px-2 py-1 rounded text-xs font-medium border ${severityColors[incident.severity]}`, children:

                    incident.severity.toUpperCase() }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("span", {
                    className: `px-2 py-1 rounded-full text-xs font-medium ${statusColors[incident.status]}`, children:

                    incident.status }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-gray-100", children: incident.title }, void 0, false),
                incident.description && /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2", children: incident.description }, void 0, false), /*#__PURE__*/

                _jsxDEV("div", { className: "flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400", children: [
                  incident.namespace && /*#__PURE__*/_jsxDEV("span", { children: ["Namespace: ", incident.namespace] }, void 0, true),
                  incident.affected_services.length > 0 && /*#__PURE__*/
                  _jsxDEV("span", { children: [incident.affected_services.length, " service(s) affected"] }, void 0, true), /*#__PURE__*/

                  _jsxDEV("span", { children: new Date(incident.created_at).toLocaleString() }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ),
              incident.ai_analysis && /*#__PURE__*/
              _jsxDEV("span", { className: "px-2 py-1 bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded text-xs font-medium", children: "AI Analyzed" }, void 0, false

              )] }, void 0, true

            ) }, incident.id, false
          )
          ) }, void 0, false
        ) }, void 0, false

      ),


      showCreateModal && /*#__PURE__*/
      _jsxDEV(CreateIncidentModal, {
        onClose: () => setShowCreateModal(false),
        onCreate: createIncident }, void 0, false
      )] }, void 0, true

    ));

}






function CreateIncidentModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    namespace: '',
    affected_services: ''
  });

  function handleSubmit(e) {
    e.preventDefault();
    onCreate({
      ...formData,
      affected_services: formData.affected_services.
      split(',').
      map((s) => s.trim()).
      filter(Boolean)
    });
  }

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", children: /*#__PURE__*/
      _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg p-6", children: [/*#__PURE__*/
        _jsxDEV("h2", { className: "text-xl font-bold text-gray-900 dark:text-gray-100 mb-4", children: "Create Incident" }, void 0, false), /*#__PURE__*/
        _jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Title" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              required: true,
              value: formData.title,
              onChange: (e) => setFormData({ ...formData, title: e.target.value }),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100",
              placeholder: "Brief description of the incident" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Description" }, void 0, false), /*#__PURE__*/
            _jsxDEV("textarea", {
              value: formData.description,
              onChange: (e) => setFormData({ ...formData, description: e.target.value }),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100",
              rows: 3,
              placeholder: "Detailed description..." }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Severity" }, void 0, false), /*#__PURE__*/
              _jsxDEV("select", {
                value: formData.severity,
                onChange: (e) => setFormData({ ...formData, severity: e.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100", children: [/*#__PURE__*/

                _jsxDEV("option", { value: "critical", children: "Critical" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "high", children: "High" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "medium", children: "Medium" }, void 0, false), /*#__PURE__*/
                _jsxDEV("option", { value: "low", children: "Low" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Namespace" }, void 0, false), /*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                value: formData.namespace,
                onChange: (e) => setFormData({ ...formData, namespace: e.target.value }),
                className: "w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100",
                placeholder: "e.g., production" }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Affected Services (comma-separated)" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: formData.affected_services,
              onChange: (e) => setFormData({ ...formData, affected_services: e.target.value }),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100",
              placeholder: "api-gateway, user-service" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex justify-end gap-3 pt-4", children: [/*#__PURE__*/
            _jsxDEV("button", { type: "button", onClick: onClose, className: "btn-secondary", children: "Cancel" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("button", { type: "submit", className: "btn-primary", children: "Create Incident" }, void 0, false

            )] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}
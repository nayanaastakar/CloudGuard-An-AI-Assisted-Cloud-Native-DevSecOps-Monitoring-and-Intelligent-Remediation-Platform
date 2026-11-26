import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  WrenchScrewdriverIcon,
  ArrowPathIcon,
  ArrowsUpDownIcon,
  RocketLaunchIcon,
  ArrowUturnLeftIcon,
  ClockIcon } from
'@heroicons/react/24/outline';
import { selfServiceApi, kubernetesApi } from '../../services/api';
import { logger } from '../../utils/logger';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";


export default function SelfServicePortal() {
  const [, setCatalog] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState(


    null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [catalogRes, deploymentsRes, actionsRes] = await Promise.all([
      selfServiceApi.getCatalog().catch(() => ({ data: [] })),
      kubernetesApi.getDeployments().catch(() => ({ data: [] })),
      selfServiceApi.listActions().catch(() => ({ data: [] }))]
      );

      setCatalog(catalogRes.data);
      setDeployments(deploymentsRes.data);
      setActions(actionsRes.data);
    } catch (error) {
      logger.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  }

  async function executeAction(type, service, params) {
    try {
      await selfServiceApi.createAction({
        action_type: type,
        target_service: service.name,
        target_namespace: service.namespace,
        target_environment: service.environment,
        parameters: params,
        reason: `Self-service ${type} action`
      });
      setActionModal(null);
      await fetchData();
    } catch (error) {
      logger.error('Action failed', error);
    }
  }

  const quickActions = [
  { type: 'scale', icon: ArrowsUpDownIcon, label: 'Scale', color: 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/20' },
  { type: 'restart', icon: ArrowPathIcon, label: 'Restart', color: 'text-warning-600 dark:text-warning-400 bg-warning-50 dark:bg-warning-500/20' },
  { type: 'rollback', icon: ArrowUturnLeftIcon, label: 'Rollback', color: 'text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-500/20' }];


  const statusColors = {
    pending: 'bg-warning-50 dark:bg-warning-500/20 text-warning-600 dark:text-warning-400',
    approved: 'bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400',
    running: 'bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400',
    completed: 'bg-success-50 dark:bg-success-500/20 text-success-600 dark:text-success-400',
    failed: 'bg-danger-50 dark:bg-danger-500/20 text-danger-600 dark:text-danger-400',
    rejected: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
        _jsxDEV("h1", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: "Developer Self-Service" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex gap-3", children: /*#__PURE__*/
          _jsxDEV(Link, { to: "/releases", className: "btn-primary flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(RocketLaunchIcon, { className: "h-4 w-4" }, void 0, false), "Manage Releases"] }, void 0, true

          ) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Services" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: deployments.length }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Pending Actions" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-warning-600", children:
            actions.filter((a) => a.status === 'pending').length }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Completed Today" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-success-600", children:
            actions.filter((a) => a.status === 'completed').length }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Failed Actions" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-danger-600", children:
            actions.filter((a) => a.status === 'failed').length }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "lg:col-span-2", children: /*#__PURE__*/
          _jsxDEV("div", { className: "card", children: [/*#__PURE__*/
            _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(WrenchScrewdriverIcon, { className: "h-5 w-5" }, void 0, false), "Service Catalog"] }, void 0, true

            ),
            loading ? /*#__PURE__*/
            _jsxDEV("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "Loading..." }, void 0, false) :
            deployments.length === 0 ? /*#__PURE__*/
            _jsxDEV("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "No services found" }, void 0, false) : /*#__PURE__*/

            _jsxDEV("div", { className: "space-y-3", children:
              deployments.map((dep) => {
                const service = {
                  name: dep.name,
                  namespace: dep.namespace,
                  environment: 'default',
                  current_version: dep.image?.split(':').pop() || 'latest',
                  allowed_actions: ['scale', 'restart', 'rollback'],
                  health_status: dep.ready_replicas === dep.replicas ? 'healthy' : 'degraded'
                };

                return (/*#__PURE__*/
                  _jsxDEV("div", {

                    className: "p-4 border border-gray-100 dark:border-slate-600 rounded-lg hover:border-primary-200 dark:hover:border-primary-700 transition-colors", children: /*#__PURE__*/

                    _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                      _jsxDEV("div", { children: [/*#__PURE__*/
                        _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                          _jsxDEV("h3", { className: "font-medium text-gray-900 dark:text-gray-100", children: dep.name }, void 0, false), /*#__PURE__*/
                          _jsxDEV("span", {
                            className: `px-2 py-0.5 rounded-full text-xs font-medium ${
                            service.health_status === 'healthy' ?
                            'bg-success-50 dark:bg-success-500/20 text-success-600 dark:text-success-400' :
                            'bg-warning-50 dark:bg-warning-500/20 text-warning-600 dark:text-warning-400'}`, children:


                            service.health_status }, void 0, false
                          )] }, void 0, true
                        ), /*#__PURE__*/
                        _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: [
                          dep.namespace, " • ", dep.ready_replicas, "/", dep.replicas, " replicas •", ' ',
                          service.current_version] }, void 0, true
                        )] }, void 0, true
                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "flex gap-2", children:
                        quickActions.map((action) => /*#__PURE__*/
                        _jsxDEV("button", {

                          onClick: () => setActionModal({ type: action.type, service }),
                          className: `p-2 rounded-lg ${action.color} hover:opacity-80 transition-opacity`,
                          title: action.label, children: /*#__PURE__*/

                          _jsxDEV(action.icon, { className: "h-4 w-4" }, void 0, false) }, action.type, false
                        )
                        ) }, void 0, false
                      )] }, void 0, true
                    ) }, `${dep.namespace}-${dep.name}`, false
                  ));

              }) }, void 0, false
            )] }, void 0, true

          ) }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "card", children: [/*#__PURE__*/
          _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(ClockIcon, { className: "h-5 w-5" }, void 0, false), "Recent Actions"] }, void 0, true

          ),
          actions.length === 0 ? /*#__PURE__*/
          _jsxDEV("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "No actions yet" }, void 0, false) : /*#__PURE__*/

          _jsxDEV("div", { className: "space-y-3", children:
            actions.slice(0, 10).map((action) => /*#__PURE__*/
            _jsxDEV("div", { className: "p-3 border border-gray-100 dark:border-slate-600 rounded-lg", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-start justify-between", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "font-medium text-gray-900 dark:text-gray-100 capitalize", children:
                    action.action_type.replace('_', ' ') }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: action.target_service }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("span", { className: `px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[action.status]}`, children:
                  action.status }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-400 dark:text-gray-500 mt-2", children:
                new Date(action.created_at).toLocaleString() }, void 0, false
              )] }, action.id, true
            )
            ) }, void 0, false
          )] }, void 0, true

        )] }, void 0, true
      ),


      actionModal && /*#__PURE__*/
      _jsxDEV(ActionModal, {
        type: actionModal.type,
        service: actionModal.service,
        onClose: () => setActionModal(null),
        onExecute: (params) => executeAction(actionModal.type, actionModal.service, params) }, void 0, false
      )] }, void 0, true

    ));

}








function ActionModal({ type, service, onClose, onExecute }) {
  const [params, setParams] = useState({});
  const [reason, setReason] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onExecute({ ...params, reason });
  }

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", children: /*#__PURE__*/
      _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6", children: [/*#__PURE__*/
        _jsxDEV("h2", { className: "text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 capitalize", children: [
          type.replace('_', ' '), " ", service.name] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          type === 'scale' && /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Target Replicas" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("input", {
              type: "number",
              min: "0",
              max: "100",
              required: true,
              value: params.replicas || 1,
              onChange: (e) => setParams({ ...params, replicas: parseInt(e.target.value) }),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100" }, void 0, false
            )] }, void 0, true
          ),


          type === 'rollback' && /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Target Version (optional)" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: params.version || '',
              onChange: (e) => setParams({ ...params, version: e.target.value }),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100",
              placeholder: "Leave empty for previous version" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Reason" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("textarea", {
              required: true,
              minLength: 10,
              value: reason,
              onChange: (e) => setReason(e.target.value),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100",
              rows: 3,
              placeholder: "Explain why you're performing this action..." }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "flex justify-end gap-3 pt-4", children: [/*#__PURE__*/
            _jsxDEV("button", { type: "button", onClick: onClose, className: "btn-secondary", children: "Cancel" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("button", { type: "submit", className: "btn-primary", children: "Execute" }, void 0, false

            )] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}
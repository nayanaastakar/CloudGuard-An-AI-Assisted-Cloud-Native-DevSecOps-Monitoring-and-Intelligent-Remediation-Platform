import { useEffect, useState } from 'react';
import {
  ServerStackIcon,
  CubeIcon,
  ArrowPathIcon,
  ArrowsUpDownIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CommandLineIcon,
  ClockIcon } from
'@heroicons/react/24/outline';
import { kubernetesApi } from '../../services/api';
import { logger } from '../../utils/logger';

import PodLogsViewer from '../kubernetes/PodLogsViewer';
import PodExecTerminal from '../kubernetes/PodExecTerminal';
import DeploymentRollbackModal from '../kubernetes/DeploymentRollbackModal';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";



export default function KubernetesView() {
  const [health, setHealth] = useState(null);
  const [namespaces, setNamespaces] = useState([]);
  const [pods, setPods] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedPodForLogs, setSelectedPodForLogs] = useState(null);
  const [selectedPodForExec, setSelectedPodForExec] = useState(null);
  const [selectedDeploymentForRollback, setSelectedDeploymentForRollback] = useState(null);
  const [activeTab, setActiveTab] = useState('pods');

  useEffect(() => {
    fetchData();
  }, [selectedNamespace]);

  async function fetchData() {
    setLoading(true);
    try {
      const [healthRes, nsRes, podsRes, depsRes, eventsRes] = await Promise.all([
      kubernetesApi.getHealth().catch(() => null),
      kubernetesApi.getNamespaces().catch(() => ({ data: [] })),
      kubernetesApi.getPods(selectedNamespace || undefined).catch(() => ({ data: [] })),
      kubernetesApi.getDeployments(selectedNamespace || undefined).catch(() => ({ data: [] })),
      kubernetesApi.getEvents(selectedNamespace || undefined, 50).catch(() => ({ data: [] }))]
      );

      if (healthRes?.data) setHealth(healthRes.data);
      setNamespaces(nsRes.data);
      setPods(podsRes.data);
      setDeployments(depsRes.data);
      setEvents(eventsRes.data);
    } catch (error) {
      logger.error('Failed to fetch K8s data', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleScale(namespace, deployment, replicas) {
    setActionLoading(`scale-${deployment}`);
    try {
      await kubernetesApi.scale(namespace, deployment, replicas);
      await fetchData();
    } catch (error) {
      logger.error('Scale failed', error);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRestart(namespace, deployment) {
    setActionLoading(`restart-${deployment}`);
    try {
      await kubernetesApi.restart(namespace, deployment);
      await fetchData();
    } catch (error) {
      logger.error('Restart failed', error);
    } finally {
      setActionLoading(null);
    }
  }

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
        _jsxDEV("h1", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: "Kubernetes Cluster" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex gap-3", children: [/*#__PURE__*/
          _jsxDEV("select", {
            value: selectedNamespace,
            onChange: (e) => setSelectedNamespace(e.target.value),
            className: "px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100", children: [/*#__PURE__*/

            _jsxDEV("option", { value: "", children: "All Namespaces" }, void 0, false),
            namespaces.map((ns) => /*#__PURE__*/
            _jsxDEV("option", { value: ns.name, children:
              ns.name }, ns.name, false
            )
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("button", { onClick: fetchData, className: "btn-secondary flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(ArrowPathIcon, { className: "h-4 w-4" }, void 0, false), "Refresh"] }, void 0, true

          )] }, void 0, true
        )] }, void 0, true
      ),


      health && /*#__PURE__*/
      _jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Status" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: `text-lg font-bold ${health.healthy ? 'text-success-600' : 'text-danger-600'}`, children:
            health.healthy ? 'Healthy' : 'Degraded' }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Nodes" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-lg font-bold text-gray-900 dark:text-gray-100", children: [
            health.ready_nodes, "/", health.node_count] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Pods" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-lg font-bold text-gray-900 dark:text-gray-100", children: [
            health.running_pods, "/", health.total_pods] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Namespaces" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-lg font-bold text-gray-900 dark:text-gray-100", children: health.namespaces }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Warnings" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: `text-lg font-bold ${health.warnings.length > 0 ? 'text-warning-600' : 'text-gray-900 dark:text-gray-100'}`, children:
            health.warnings.length }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/



      _jsxDEV("div", { className: "card", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex border-b border-gray-200 dark:border-slate-600 mb-4", children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => setActiveTab('pods'),
            className: `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pods' ?
            'border-primary-500 text-primary-600 dark:text-primary-400' :
            'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'}`, children: [/*#__PURE__*/


            _jsxDEV(CubeIcon, { className: "h-4 w-4" }, void 0, false), "Pods (",
            pods.length, ")"] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => setActiveTab('deployments'),
            className: `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'deployments' ?
            'border-primary-500 text-primary-600 dark:text-primary-400' :
            'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'}`, children: [/*#__PURE__*/


            _jsxDEV(ServerStackIcon, { className: "h-4 w-4" }, void 0, false), "Deployments (",
            deployments.length, ")"] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => setActiveTab('events'),
            className: `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'events' ?
            'border-primary-500 text-primary-600 dark:text-primary-400' :
            'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'}`, children: [/*#__PURE__*/


            _jsxDEV(ExclamationTriangleIcon, { className: "h-4 w-4" }, void 0, false), "Events (",
            events.length, ")"] }, void 0, true
          )] }, void 0, true
        ),


        loading ? /*#__PURE__*/
        _jsxDEV("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "Loading..." }, void 0, false) : /*#__PURE__*/

        _jsxDEV(_Fragment, { children: [

          activeTab === 'pods' && (
          pods.length === 0 ? /*#__PURE__*/
          _jsxDEV("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "No pods found" }, void 0, false) : /*#__PURE__*/

          _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
            _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
              _jsxDEV("thead", { children: /*#__PURE__*/
                _jsxDEV("tr", { className: "border-b border-gray-100 dark:border-slate-600", children: [/*#__PURE__*/
                  _jsxDEV("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400", children: "Name" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400", children: "Namespace" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400", children: "Status" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400", children: "Restarts" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400", children: "Node" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400", children: "Age" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400", children: "Actions" }, void 0, false)] }, void 0, true
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("tbody", { children:
                pods.map((pod) => /*#__PURE__*/
                _jsxDEV("tr", { className: "border-b border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50", children: [/*#__PURE__*/
                  _jsxDEV("td", { className: "py-3 px-4 font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs", children: pod.name }, void 0, false), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-300", children: pod.namespace }, void 0, false), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                    _jsxDEV("span", {
                      className: `px-2 py-1 rounded-full text-xs font-medium ${
                      pod.status === 'Running' ?
                      'bg-success-50 dark:bg-success-500/20 text-success-600 dark:text-success-400' :
                      pod.status === 'Pending' ?
                      'bg-warning-50 dark:bg-warning-500/20 text-warning-600 dark:text-warning-400' :
                      'bg-danger-50 dark:bg-danger-500/20 text-danger-600 dark:text-danger-400'}`, children:


                      pod.status }, void 0, false
                    ) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-300", children: pod.restarts }, void 0, false), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-300 text-sm", children: pod.node || '-' }, void 0, false), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-300", children: pod.age }, void 0, false), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-3 px-4 text-right", children: /*#__PURE__*/
                    _jsxDEV("div", { className: "flex justify-end gap-1", children: [/*#__PURE__*/
                      _jsxDEV("button", {
                        onClick: () => setSelectedPodForLogs(pod),
                        className: "p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400",
                        title: "View Logs", children: /*#__PURE__*/

                        _jsxDEV(DocumentTextIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("button", {
                        onClick: () => setSelectedPodForExec(pod),
                        disabled: pod.status !== 'Running',
                        className: `p-1 ${
                        pod.status === 'Running' ?
                        'text-gray-400 hover:text-green-600 dark:hover:text-green-400' :
                        'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`,

                        title: pod.status === 'Running' ? 'Exec Terminal' : `Cannot exec: Pod is ${pod.status}`, children: /*#__PURE__*/

                        _jsxDEV(CommandLineIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                      )] }, void 0, true
                    ) }, void 0, false
                  )] }, `${pod.namespace}-${pod.name}`, true
                )
                ) }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          )),




          activeTab === 'deployments' && (
          deployments.length === 0 ? /*#__PURE__*/
          _jsxDEV("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "No deployments found" }, void 0, false) : /*#__PURE__*/

          _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
            _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
              _jsxDEV("thead", { children: /*#__PURE__*/
                _jsxDEV("tr", { className: "border-b border-gray-100 dark:border-slate-600", children: [/*#__PURE__*/
                  _jsxDEV("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400", children: "Name" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400", children: "Namespace" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400", children: "Replicas" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400", children: "Image" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400", children: "Age" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("th", { className: "text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400", children: "Actions" }, void 0, false)] }, void 0, true
                ) }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("tbody", { children:
                deployments.map((dep) => /*#__PURE__*/
                _jsxDEV("tr", { className: "border-b border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50", children: [/*#__PURE__*/
                  _jsxDEV("td", { className: "py-3 px-4 font-medium text-gray-900 dark:text-gray-100", children: dep.name }, void 0, false), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-300", children: dep.namespace }, void 0, false), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-3 px-4", children: /*#__PURE__*/
                    _jsxDEV("span", {
                      className: `${
                      dep.ready_replicas === dep.replicas ? 'text-success-600' : 'text-warning-600'}`, children: [


                      dep.ready_replicas, "/", dep.replicas] }, void 0, true
                    ) }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-300 text-sm truncate max-w-xs", children:
                    dep.image?.split('/').pop() || '-' }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-3 px-4 text-gray-600 dark:text-gray-300", children: dep.age }, void 0, false), /*#__PURE__*/
                  _jsxDEV("td", { className: "py-3 px-4 text-right", children: /*#__PURE__*/
                    _jsxDEV("div", { className: "flex justify-end gap-2", children: [/*#__PURE__*/
                      _jsxDEV("button", {
                        onClick: () => handleScale(dep.namespace, dep.name, dep.replicas + 1),
                        disabled: actionLoading === `scale-${dep.name}`,
                        className: "p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400",
                        title: "Scale Up", children: /*#__PURE__*/

                        _jsxDEV(ArrowsUpDownIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("button", {
                        onClick: () => handleRestart(dep.namespace, dep.name),
                        disabled: actionLoading === `restart-${dep.name}`,
                        className: "p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400",
                        title: "Restart", children: /*#__PURE__*/

                        _jsxDEV(ArrowPathIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("button", {
                        onClick: () => setSelectedDeploymentForRollback(dep),
                        className: "p-1 text-gray-400 hover:text-warning-600 dark:hover:text-warning-400",
                        title: "Rollback", children: /*#__PURE__*/

                        _jsxDEV(ClockIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
                      )] }, void 0, true
                    ) }, void 0, false
                  )] }, `${dep.namespace}-${dep.name}`, true
                )
                ) }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          )),




          activeTab === 'events' && (
          events.length === 0 ? /*#__PURE__*/
          _jsxDEV("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "No recent events" }, void 0, false) : /*#__PURE__*/

          _jsxDEV("div", { className: "space-y-2 max-h-[500px] overflow-y-auto", children:
            events.map((event, index) => /*#__PURE__*/
            _jsxDEV("div", {

              className: `p-3 rounded-lg border ${
              event.type === 'Warning' ?
              'border-warning-200 dark:border-warning-500/30 bg-warning-50 dark:bg-warning-500/10' :
              'border-gray-100 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50'}`, children: /*#__PURE__*/


              _jsxDEV("div", { className: "flex items-start justify-between", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: event.reason }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-300 mt-1", children: event.message }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: [
                    event.involved_object.kind, "/", event.involved_object.name, " in ", event.namespace] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: ["x", event.count] }, void 0, true)] }, void 0, true
              ) }, `${event.name}-${index}`, false
            )
            ) }, void 0, false
          ))] }, void 0, true


        )] }, void 0, true

      ),


      selectedPodForLogs && /*#__PURE__*/
      _jsxDEV(PodLogsViewer, {
        pod: selectedPodForLogs,
        onClose: () => setSelectedPodForLogs(null) }, void 0, false
      ),



      selectedPodForExec && /*#__PURE__*/
      _jsxDEV(PodExecTerminal, {
        pod: selectedPodForExec,
        onClose: () => setSelectedPodForExec(null) }, void 0, false
      ),



      selectedDeploymentForRollback && /*#__PURE__*/
      _jsxDEV(DeploymentRollbackModal, {
        deployment: selectedDeploymentForRollback,
        onClose: () => setSelectedDeploymentForRollback(null),
        onRollbackComplete: fetchData }, void 0, false
      )] }, void 0, true

    ));

}
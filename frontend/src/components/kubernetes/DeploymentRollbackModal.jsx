import { useState, useEffect } from 'react';
import {
  ArrowPathIcon,
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon } from
'@heroicons/react/24/outline';
import { kubernetesApi, DeploymentRevision } from '../../services/api';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";








export default function DeploymentRollbackModal({
  deployment,
  onClose,
  onRollbackComplete
}) {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRevision, setSelectedRevision] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [rollbackResult, setRollbackResult] = useState(null);

  useEffect(() => {
    fetchRevisions();
  }, [deployment]);

  async function fetchRevisions() {
    setLoading(true);
    setError(null);
    try {
      const response = await kubernetesApi.getDeploymentRevisions(
        deployment.namespace,
        deployment.name
      );
      setRevisions(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch revisions';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleRollback() {
    if (selectedRevision === null) return;

    setRolling(true);
    setRollbackResult(null);
    try {
      await kubernetesApi.rollbackDeployment(
        deployment.namespace,
        deployment.name,
        selectedRevision
      );
      setRollbackResult({
        success: true,
        message: `Successfully initiated rollback to revision ${selectedRevision}`
      });
      setTimeout(() => {
        onRollbackComplete();
        onClose();
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Rollback failed';
      setRollbackResult({
        success: false,
        message: errorMessage
      });
    } finally {
      setRolling(false);
    }
  }

  const currentRevision = revisions.find((r) => r.replicas > 0 && r.ready_replicas > 0);

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: /*#__PURE__*/
      _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV(ArrowPathIcon, { className: "h-6 w-6 text-primary-600 dark:text-primary-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: "Rollback Deployment" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
                deployment.namespace, "/", deployment.name] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: onClose,
            className: "p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg", children: /*#__PURE__*/

            _jsxDEV(XMarkIcon, { className: "h-5 w-5 text-gray-500 dark:text-gray-400" }, void 0, false) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "flex-1 overflow-auto p-4", children: [
          loading ? /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-center h-40", children: /*#__PURE__*/
            _jsxDEV("div", { className: "text-gray-500 dark:text-gray-400", children: "Loading revisions..." }, void 0, false) }, void 0, false
          ) :
          error ? /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-center h-40", children: /*#__PURE__*/
            _jsxDEV("div", { className: "text-red-500", children: error }, void 0, false) }, void 0, false
          ) :
          revisions.length === 0 ? /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-center h-40", children: /*#__PURE__*/
            _jsxDEV("div", { className: "text-gray-500 dark:text-gray-400", children: "No revision history available" }, void 0, false) }, void 0, false
          ) : /*#__PURE__*/

          _jsxDEV("div", { className: "space-y-3", children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-300 mb-4", children: "Select a revision to rollback to. The current active revision is highlighted." }, void 0, false

            ),
            revisions.map((revision) => {
              const isCurrent = currentRevision?.revision === revision.revision;
              const isSelected = selectedRevision === revision.revision;

              return (/*#__PURE__*/
                _jsxDEV("button", {

                  onClick: () => !isCurrent && setSelectedRevision(revision.revision),
                  disabled: isCurrent,
                  className: `w-full text-left p-4 rounded-lg border transition-all ${
                  isCurrent ?
                  'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 cursor-not-allowed' :
                  isSelected ?
                  'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700 ring-2 ring-primary-500' :
                  'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'}`, children: [/*#__PURE__*/


                  _jsxDEV("div", { className: "flex items-start justify-between", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                        _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: ["Revision ",
                          revision.revision] }, void 0, true
                        ),
                        isCurrent && /*#__PURE__*/
                        _jsxDEV("span", { className: "px-2 py-0.5 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs rounded-full", children: "Current" }, void 0, false

                        )] }, void 0, true

                      ),
                      revision.image && /*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1 font-mono truncate", children:
                        revision.image }, void 0, false
                      ),

                      revision.change_cause && /*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children:
                        revision.change_cause }, void 0, false
                      )] }, void 0, true

                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
                      _jsxDEV(ClockIcon, { className: "h-4 w-4" }, void 0, false),
                      revision.age] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "mt-2 text-xs text-gray-500 dark:text-gray-400", children: ["Replicas: ",
                    revision.ready_replicas, "/", revision.replicas] }, void 0, true
                  )] }, revision.revision, true
                ));

            })] }, void 0, true
          ),



          rollbackResult && /*#__PURE__*/
          _jsxDEV("div", {
            className: `mt-4 p-4 rounded-lg flex items-center gap-3 ${
            rollbackResult.success ?
            'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
            'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`, children: [


            rollbackResult.success ? /*#__PURE__*/
            _jsxDEV(CheckCircleIcon, { className: "h-5 w-5" }, void 0, false) : /*#__PURE__*/

            _jsxDEV(ExclamationTriangleIcon, { className: "h-5 w-5" }, void 0, false),

            rollbackResult.message] }, void 0, true
          )] }, void 0, true

        ), /*#__PURE__*/


        _jsxDEV("div", { className: "flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: onClose,
            className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors", children:
            "Cancel" }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: handleRollback,
            disabled: selectedRevision === null || rolling,
            className: "px-4 py-2 bg-warning-500 hover:bg-warning-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2", children:

            rolling ? /*#__PURE__*/
            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: "h-4 w-4 animate-spin" }, void 0, false), "Rolling back..."] }, void 0, true

            ) : /*#__PURE__*/

            _jsxDEV(_Fragment, { children: [/*#__PURE__*/
              _jsxDEV(ArrowPathIcon, { className: "h-4 w-4" }, void 0, false), "Rollback to Revision ",
              selectedRevision] }, void 0, true
            ) }, void 0, false

          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}
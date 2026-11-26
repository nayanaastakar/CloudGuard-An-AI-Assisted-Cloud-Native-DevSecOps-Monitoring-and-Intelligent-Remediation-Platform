import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RocketLaunchIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  TagIcon,
  ArrowLeftIcon } from
'@heroicons/react/24/outline';
import { gitflowApi, kubernetesApi } from '../../services/api';
import { logger } from '../../utils/logger';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";


export default function ReleaseManager() {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [deployModal, setDeployModal] = useState(null);

  useEffect(() => {
    fetchReleases();
  }, []);

  async function fetchReleases() {
    setLoading(true);
    try {
      const res = await gitflowApi.listReleases(undefined, 50);
      setReleases(res.data.releases);
    } catch (error) {
      logger.error('Failed to fetch releases', error);
    } finally {
      setLoading(false);
    }
  }

  async function createRelease(version, changelog) {
    try {
      await gitflowApi.createRelease(version, 'develop', changelog);
      setShowCreateModal(false);
      await fetchReleases();
    } catch (error) {
      logger.error('Failed to create release', error);
    }
  }

  async function approveRelease(id) {
    try {
      await gitflowApi.approveRelease(id, 'self-service');
      await fetchReleases();
    } catch (error) {
      logger.error('Failed to approve release', error);
    }
  }

  async function finishRelease(id) {
    try {
      await gitflowApi.finishRelease(id);
      await fetchReleases();
    } catch (error) {
      logger.error('Failed to finish release', error);
    }
  }

  async function deployRelease(release, environment, namespace) {
    try {
      await kubernetesApi.deploy(release.id, environment, namespace, []);
      setDeployModal(null);
      await fetchReleases();
    } catch (error) {
      logger.error('Failed to deploy release', error);
    }
  }

  const statusColors = {
    draft: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    pending_approval: 'bg-warning-50 dark:bg-warning-500/20 text-warning-600 dark:text-warning-400',
    approved: 'bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400',
    deploying: 'bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400',
    deployed: 'bg-success-50 dark:bg-success-500/20 text-success-600 dark:text-success-400',
    rolled_back: 'bg-warning-50 dark:bg-warning-500/20 text-warning-600 dark:text-warning-400',
    failed: 'bg-danger-50 dark:bg-danger-500/20 text-danger-600 dark:text-danger-400'
  };

  const statusIcons = {
    draft: ClockIcon,
    pending_approval: ClockIcon,
    approved: CheckCircleIcon,
    deploying: ArrowPathIcon,
    deployed: CheckCircleIcon,
    rolled_back: ArrowPathIcon,
    failed: XCircleIcon
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV(Link, {
            to: "/selfservice",
            className: "flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-2", children: [/*#__PURE__*/

            _jsxDEV(ArrowLeftIcon, { className: "h-4 w-4" }, void 0, false), "Back to Self-Service"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("h1", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: "Release Manager" }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: () => setShowCreateModal(true),
          className: "btn-primary flex items-center gap-2", children: [/*#__PURE__*/

          _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "New Release"] }, void 0, true

        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Total Releases" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: releases.length }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Draft" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-gray-600 dark:text-gray-300", children:
            releases.filter((r) => r.status === 'draft').length }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Pending Approval" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-warning-600", children:
            releases.filter((r) => r.status === 'pending_approval').length }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Deployed" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-success-600", children:
            releases.filter((r) => r.status === 'deployed').length }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Failed" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-danger-600", children:
            releases.filter((r) => r.status === 'failed').length }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "card", children: [/*#__PURE__*/
        _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV(TagIcon, { className: "h-5 w-5" }, void 0, false), "Releases"] }, void 0, true

        ),
        loading ? /*#__PURE__*/
        _jsxDEV("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "Loading..." }, void 0, false) :
        releases.length === 0 ? /*#__PURE__*/
        _jsxDEV("div", { className: "text-center py-12", children: [/*#__PURE__*/
          _jsxDEV(RocketLaunchIcon, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children: "No releases found" }, void 0, false), /*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => setShowCreateModal(true),
            className: "mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium", children:
            "Create your first release" }, void 0, false

          )] }, void 0, true
        ) : /*#__PURE__*/

        _jsxDEV("div", { className: "space-y-4", children:
          releases.map((release) => {
            const StatusIcon = statusIcons[release.status];
            return (/*#__PURE__*/
              _jsxDEV("div", {

                className: "p-4 border border-gray-100 dark:border-slate-600 rounded-lg hover:border-primary-200 dark:hover:border-primary-700 transition-colors", children: /*#__PURE__*/

                _jsxDEV("div", { className: "flex items-start justify-between", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                      _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-gray-100 text-lg", children: ["v", release.version] }, void 0, true), /*#__PURE__*/
                      _jsxDEV("span", { className: `px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[release.status]}`, children: [/*#__PURE__*/
                        _jsxDEV(StatusIcon, { className: "h-3 w-3" }, void 0, false),
                        release.status.replace('_', ' ')] }, void 0, true
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: ["Branch: ",
                      release.release_branch, " • ", release.commits.length, " commits"] }, void 0, true
                    ),
                    release.created_by && /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["Created by: ", release.created_by] }, void 0, true), /*#__PURE__*/

                    _jsxDEV("p", { className: "text-xs text-gray-400 dark:text-gray-500 mt-2", children: ["Created: ",
                      new Date(release.created_at).toLocaleString()] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "flex gap-2", children: [
                    release.status === 'draft' && /*#__PURE__*/
                    _jsxDEV("button", {
                      onClick: () => approveRelease(release.id),
                      className: "btn-secondary text-sm", children:
                      "Approve" }, void 0, false

                    ),

                    release.status === 'approved' && /*#__PURE__*/
                    _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                      _jsxDEV("button", {
                        onClick: () => setDeployModal(release),
                        className: "btn-primary text-sm flex items-center gap-1", children: [/*#__PURE__*/

                        _jsxDEV(RocketLaunchIcon, { className: "h-4 w-4" }, void 0, false), "Deploy"] }, void 0, true

                      ), /*#__PURE__*/
                      _jsxDEV("button", {
                        onClick: () => finishRelease(release.id),
                        className: "btn-secondary text-sm", children:
                        "Finish" }, void 0, false

                      )] }, void 0, true
                    ), /*#__PURE__*/

                    _jsxDEV("button", {
                      onClick: () => setSelectedRelease(release),
                      className: "btn-secondary text-sm", children:
                      "Details" }, void 0, false

                    )] }, void 0, true
                  )] }, void 0, true
                ) }, release.id, false
              ));

          }) }, void 0, false
        )] }, void 0, true

      ),


      showCreateModal && /*#__PURE__*/
      _jsxDEV(CreateReleaseModal, {
        onClose: () => setShowCreateModal(false),
        onCreate: createRelease }, void 0, false
      ),



      selectedRelease && /*#__PURE__*/
      _jsxDEV(ReleaseDetailsModal, {
        release: selectedRelease,
        onClose: () => setSelectedRelease(null) }, void 0, false
      ),



      deployModal && /*#__PURE__*/
      _jsxDEV(DeployModal, {
        release: deployModal,
        onClose: () => setDeployModal(null),
        onDeploy: deployRelease }, void 0, false
      )] }, void 0, true

    ));

}

function CreateReleaseModal({
  onClose,
  onCreate



}) {
  const [version, setVersion] = useState('');
  const [changelog, setChangelog] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onCreate(version, changelog || undefined);
  }

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", children: /*#__PURE__*/
      _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6", children: [/*#__PURE__*/
        _jsxDEV("h2", { className: "text-xl font-bold text-gray-900 dark:text-gray-100 mb-4", children: "Create New Release" }, void 0, false), /*#__PURE__*/
        _jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Version" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              required: true,
              pattern: "^\\d+\\.\\d+\\.\\d+(-[a-zA-Z0-9]+)?$",
              value: version,
              onChange: (e) => setVersion(e.target.value),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100",
              placeholder: "1.0.0" }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-1", children: "Format: major.minor.patch (e.g., 1.0.0)" }, void 0, false)] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Changelog (optional)" }, void 0, false), /*#__PURE__*/
            _jsxDEV("textarea", {
              value: changelog,
              onChange: (e) => setChangelog(e.target.value),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100",
              rows: 4,
              placeholder: "What's new in this release..." }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex justify-end gap-3 pt-4", children: [/*#__PURE__*/
            _jsxDEV("button", { type: "button", onClick: onClose, className: "btn-secondary", children: "Cancel" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("button", { type: "submit", className: "btn-primary", children: "Create Release" }, void 0, false

            )] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

function ReleaseDetailsModal({
  release,
  onClose



}) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", children: /*#__PURE__*/
      _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
          _jsxDEV("h2", { className: "text-xl font-bold text-gray-900 dark:text-gray-100", children: ["Release v", release.version] }, void 0, true), /*#__PURE__*/
          _jsxDEV("button", { onClick: onClose, className: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200", children: /*#__PURE__*/
            _jsxDEV(XCircleIcon, { className: "h-6 w-6" }, void 0, false) }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/

        _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "font-medium text-gray-900 dark:text-gray-100 mb-2", children: "Details" }, void 0, false), /*#__PURE__*/
            _jsxDEV("dl", { className: "grid grid-cols-2 gap-2 text-sm", children: [/*#__PURE__*/
              _jsxDEV("dt", { className: "text-gray-500 dark:text-gray-400", children: "Status" }, void 0, false), /*#__PURE__*/
              _jsxDEV("dd", { className: "font-medium text-gray-900 dark:text-gray-100 capitalize", children: release.status.replace('_', ' ') }, void 0, false), /*#__PURE__*/
              _jsxDEV("dt", { className: "text-gray-500 dark:text-gray-400", children: "Branch" }, void 0, false), /*#__PURE__*/
              _jsxDEV("dd", { className: "font-medium text-gray-900 dark:text-gray-100", children: release.release_branch }, void 0, false), /*#__PURE__*/
              _jsxDEV("dt", { className: "text-gray-500 dark:text-gray-400", children: "Source" }, void 0, false), /*#__PURE__*/
              _jsxDEV("dd", { className: "font-medium text-gray-900 dark:text-gray-100", children: release.source_branch }, void 0, false), /*#__PURE__*/
              _jsxDEV("dt", { className: "text-gray-500 dark:text-gray-400", children: "Target" }, void 0, false), /*#__PURE__*/
              _jsxDEV("dd", { className: "font-medium text-gray-900 dark:text-gray-100", children: release.target_branch }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ),

          release.changelog && /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "font-medium text-gray-900 dark:text-gray-100 mb-2", children: "Changelog" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "bg-gray-50 dark:bg-slate-700 p-4 rounded-lg text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap", children:
              release.changelog }, void 0, false
            )] }, void 0, true
          ),


          release.commits.length > 0 && /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "font-medium text-gray-900 dark:text-gray-100 mb-2", children: ["Commits (", release.commits.length, ")"] }, void 0, true), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-2 max-h-60 overflow-y-auto", children:
              release.commits.map((commit, i) => /*#__PURE__*/
              _jsxDEV("div", { className: "p-2 bg-gray-50 dark:bg-slate-700 rounded text-sm", children: [/*#__PURE__*/
                _jsxDEV("code", { className: "text-primary-600 dark:text-primary-400", children: commit.sha }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "mx-2 text-gray-900 dark:text-gray-100", children: "-" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-900 dark:text-gray-100", children: commit.message }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-500 dark:text-gray-400 ml-2", children: ["by ", commit.author] }, void 0, true)] }, i, true
              )
              ) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true

        ), /*#__PURE__*/

        _jsxDEV("div", { className: "flex justify-end pt-4 mt-4 border-t border-gray-100 dark:border-slate-600", children: /*#__PURE__*/
          _jsxDEV("button", { onClick: onClose, className: "btn-secondary", children: "Close" }, void 0, false

          ) }, void 0, false
        )] }, void 0, true
      ) }, void 0, false
    ));

}

function DeployModal({
  release,
  onClose,
  onDeploy




}) {
  const [environment, setEnvironment] = useState('staging');
  const [namespace, setNamespace] = useState('default');

  function handleSubmit(e) {
    e.preventDefault();
    onDeploy(release, environment, namespace);
  }

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", children: /*#__PURE__*/
      _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6", children: [/*#__PURE__*/
        _jsxDEV("h2", { className: "text-xl font-bold text-gray-900 dark:text-gray-100 mb-4", children: ["Deploy v", release.version] }, void 0, true), /*#__PURE__*/
        _jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4", children: [/*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Environment" }, void 0, false), /*#__PURE__*/
            _jsxDEV("select", {
              value: environment,
              onChange: (e) => setEnvironment(e.target.value),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100", children: [/*#__PURE__*/

              _jsxDEV("option", { value: "development", children: "Development" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "staging", children: "Staging" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "uat", children: "UAT" }, void 0, false), /*#__PURE__*/
              _jsxDEV("option", { value: "production", children: "Production" }, void 0, false)] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Namespace" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              required: true,
              value: namespace,
              onChange: (e) => setNamespace(e.target.value),
              className: "w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100" }, void 0, false
            )] }, void 0, true
          ),
          environment === 'production' && /*#__PURE__*/
          _jsxDEV("div", { className: "p-3 bg-warning-50 dark:bg-warning-500/20 border border-warning-200 dark:border-warning-500/30 rounded-lg", children: /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-warning-800 dark:text-warning-300 font-medium", children: "Warning: You are deploying to production. This action requires approval." }, void 0, false

            ) }, void 0, false
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "flex justify-end gap-3 pt-4", children: [/*#__PURE__*/
            _jsxDEV("button", { type: "button", onClick: onClose, className: "btn-secondary", children: "Cancel" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("button", { type: "submit", className: "btn-primary flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(RocketLaunchIcon, { className: "h-4 w-4" }, void 0, false), "Deploy"] }, void 0, true

            )] }, void 0, true
          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}
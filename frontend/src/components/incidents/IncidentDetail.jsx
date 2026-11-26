import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon } from
'@heroicons/react/24/outline';
import { incidentsApi } from '../../services/api';
import { logger } from '../../utils/logger';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";


export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) fetchIncident();
  }, [id]);

  async function fetchIncident() {
    try {
      const res = await incidentsApi.get(id);
      setIncident(res.data);
    } catch (error) {
      logger.error('Failed to fetch incident', error);
    } finally {
      setLoading(false);
    }
  }

  async function runAnalysis() {
    if (!incident) return;
    setAnalyzing(true);
    try {
      const res = await incidentsApi.analyze(incident.id, {
        include_k8s_context: true
      });
      setAnalysis(res.data);
      await fetchIncident();
    } catch (error) {
      logger.error('Analysis failed', error);
    } finally {
      setAnalyzing(false);
    }
  }

  async function updateStatus(status) {
    if (!incident) return;
    setUpdating(true);
    try {
      await incidentsApi.update(incident.id, { status });
      await fetchIncident();
    } catch (error) {
      logger.error('Update failed', error);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center h-64", children: /*#__PURE__*/
        _jsxDEV("div", { className: "text-gray-500 dark:text-gray-400", children: "Loading..." }, void 0, false) }, void 0, false
      ));

  }

  if (!incident) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "text-center py-12", children: [/*#__PURE__*/
        _jsxDEV(ExclamationTriangleIcon, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children: "Incident not found" }, void 0, false)] }, void 0, true
      ));

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

      _jsxDEV("div", { className: "flex items-start justify-between", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("button", {
            onClick: () => navigate('/incidents'),
            className: "flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4", children: [/*#__PURE__*/

            _jsxDEV(ArrowLeftIcon, { className: "h-4 w-4" }, void 0, false), "Back to Incidents"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-3 mb-2", children: [/*#__PURE__*/
            _jsxDEV("span", { className: `px-2 py-1 rounded text-xs font-medium border ${severityColors[incident.severity]}`, children:
              incident.severity.toUpperCase() }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${statusColors[incident.status]}`, children:
              incident.status }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("h1", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: incident.title }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex gap-3", children: /*#__PURE__*/
          _jsxDEV("button", {
            onClick: runAnalysis,
            disabled: analyzing,
            className: "btn-primary flex items-center gap-2", children: [/*#__PURE__*/

            _jsxDEV(SparklesIcon, { className: "h-4 w-4" }, void 0, false),
            analyzing ? 'Analyzing...' : 'AI Analysis'] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/

      _jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "lg:col-span-2 space-y-6", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "card", children: [/*#__PURE__*/
            _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3", children: "Description" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-gray-600 dark:text-gray-300", children: incident.description || 'No description provided.' }, void 0, false)] }, void 0, true
          ),


          (incident.ai_analysis || analysis) && /*#__PURE__*/
          _jsxDEV("div", { className: "card border-primary-200 dark:border-primary-500/30 bg-primary-50/30 dark:bg-primary-500/10", children: [/*#__PURE__*/
            _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(SparklesIcon, { className: "h-5 w-5 text-primary-600 dark:text-primary-400" }, void 0, false), "AI Analysis"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "prose prose-sm max-w-none", children: /*#__PURE__*/
              _jsxDEV("p", { className: "text-gray-700 dark:text-gray-300 whitespace-pre-wrap", children:
                analysis?.analysis || incident.ai_analysis }, void 0, false
              ) }, void 0, false
            ),

            (analysis?.root_cause_hypothesis || incident.ai_recommendations.length > 0) && /*#__PURE__*/
            _jsxDEV("div", { className: "mt-4 pt-4 border-t border-primary-200 dark:border-primary-500/30", children: [
              analysis?.root_cause_hypothesis && /*#__PURE__*/
              _jsxDEV("div", { className: "mb-4", children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "font-medium text-gray-900 dark:text-gray-100 mb-2", children: "Root Cause Hypothesis" }, void 0, false), /*#__PURE__*/
                _jsxDEV("p", { className: "text-gray-700 dark:text-gray-300", children: analysis.root_cause_hypothesis }, void 0, false)] }, void 0, true
              ),


              (analysis?.recommendations || incident.ai_recommendations).length > 0 && /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "font-medium text-gray-900 dark:text-gray-100 mb-2", children: "Recommendations" }, void 0, false), /*#__PURE__*/
                _jsxDEV("ul", { className: "space-y-2", children:
                  (analysis?.recommendations || incident.ai_recommendations).map((rec, i) => /*#__PURE__*/
                  _jsxDEV("li", { className: "flex items-start gap-2 text-gray-700 dark:text-gray-300", children: [/*#__PURE__*/
                    _jsxDEV(CheckCircleIcon, { className: "h-5 w-5 text-success-500 flex-shrink-0 mt-0.5" }, void 0, false),
                    rec] }, i, true
                  )
                  ) }, void 0, false
                )] }, void 0, true
              ),


              analysis?.confidence_score !== undefined && /*#__PURE__*/
              _jsxDEV("div", { className: "mt-4 pt-4 border-t border-primary-200 dark:border-primary-500/30", children: /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["Confidence Score: ",
                  Math.round(analysis.confidence_score * 100), "%"] }, void 0, true
                ) }, void 0, false
              )] }, void 0, true

            )] }, void 0, true

          ), /*#__PURE__*/



          _jsxDEV("div", { className: "card", children: [/*#__PURE__*/
            _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(ClockIcon, { className: "h-5 w-5" }, void 0, false), "Incident Timeline"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-4", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex gap-4", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "w-2 h-2 mt-2 rounded-full bg-danger-500" }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Incident Created" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: new Date(incident.created_at).toLocaleString() }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ),
              incident.resolved_at && /*#__PURE__*/
              _jsxDEV("div", { className: "flex gap-4", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "w-2 h-2 mt-2 rounded-full bg-success-500" }, void 0, false), /*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Incident Resolved" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: new Date(incident.resolved_at).toLocaleString() }, void 0, false)] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true

            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/


        _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "card", children: [/*#__PURE__*/
            _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3", children: "Update Status" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "grid grid-cols-2 gap-2", children:
              ['investigating', 'identified', 'monitoring', 'resolved'].map((status) => /*#__PURE__*/
              _jsxDEV("button", {

                onClick: () => updateStatus(status),
                disabled: updating || incident.status === status,
                className: `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                incident.status === status ?
                'bg-primary-100 dark:bg-primary-500/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-500/50' :
                'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`, children:


                status }, status, false
              )
              ) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "card", children: [/*#__PURE__*/
            _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3", children: "Details" }, void 0, false), /*#__PURE__*/
            _jsxDEV("dl", { className: "space-y-3", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("dt", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Namespace" }, void 0, false), /*#__PURE__*/
                _jsxDEV("dd", { className: "font-medium text-gray-900 dark:text-gray-100", children: incident.namespace || 'N/A' }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("dt", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Source" }, void 0, false), /*#__PURE__*/
                _jsxDEV("dd", { className: "font-medium text-gray-900 dark:text-gray-100", children: incident.source || 'Manual' }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("dt", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Assigned To" }, void 0, false), /*#__PURE__*/
                _jsxDEV("dd", { className: "font-medium text-gray-900 dark:text-gray-100", children: incident.assigned_to || 'Unassigned' }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("dt", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Created" }, void 0, false), /*#__PURE__*/
                _jsxDEV("dd", { className: "font-medium text-gray-900 dark:text-gray-100", children:
                  new Date(incident.created_at).toLocaleString() }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("dt", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Last Updated" }, void 0, false), /*#__PURE__*/
                _jsxDEV("dd", { className: "font-medium text-gray-900 dark:text-gray-100", children:
                  new Date(incident.updated_at).toLocaleString() }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ),


          incident.affected_services.length > 0 && /*#__PURE__*/
          _jsxDEV("div", { className: "card", children: [/*#__PURE__*/
            _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3", children: "Affected Services" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "flex flex-wrap gap-2", children:
              incident.affected_services.map((service) => /*#__PURE__*/
              _jsxDEV("span", {

                className: "px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm", children:

                service }, service, false
              )
              ) }, void 0, false
            )] }, void 0, true
          ),



          incident.tags.length > 0 && /*#__PURE__*/
          _jsxDEV("div", { className: "card", children: [/*#__PURE__*/
            _jsxDEV("h2", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3", children: "Tags" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "flex flex-wrap gap-2", children:
              incident.tags.map((tag) => /*#__PURE__*/
              _jsxDEV("span", {

                className: "px-2 py-1 bg-primary-50 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 rounded text-sm", children:

                tag }, tag, false
              )
              ) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true

        )] }, void 0, true
      )] }, void 0, true
    ));

}
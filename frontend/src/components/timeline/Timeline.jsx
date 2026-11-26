import { useEffect, useState } from 'react';
import { logger } from '../../utils/logger';
import {
  ClockIcon,
  RocketLaunchIcon,
  CogIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ServerStackIcon,
  FunnelIcon } from
'@heroicons/react/24/outline';
import { timelineApi } from '../../services/api';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";


const eventIcons = {
  deployment: RocketLaunchIcon,
  config_change: CogIcon,
  scale_event: ServerStackIcon,
  build: CogIcon,
  incident: ExclamationTriangleIcon,
  rollback: ArrowPathIcon,
  feature_flag: CogIcon,
  infrastructure: ServerStackIcon
};

const eventColors = {
  deployment: 'bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-500/30',
  config_change: 'bg-warning-50 dark:bg-warning-500/20 text-warning-600 dark:text-warning-400 border-warning-200 dark:border-warning-500/30',
  scale_event: 'bg-success-50 dark:bg-success-500/20 text-success-600 dark:text-success-400 border-success-200 dark:border-success-500/30',
  build: 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600',
  incident: 'bg-danger-50 dark:bg-danger-500/20 text-danger-600 dark:text-danger-400 border-danger-200 dark:border-danger-500/30',
  rollback: 'bg-warning-50 dark:bg-warning-500/20 text-warning-600 dark:text-warning-400 border-warning-200 dark:border-warning-500/30',
  feature_flag: 'bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-500/30',
  infrastructure: 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
};

export default function Timeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    sources: [],
    types: []
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  async function fetchData() {
    setLoading(true);
    try {
      const [eventsRes, statsRes] = await Promise.all([
      timelineApi.list({
        sources: filters.sources.length > 0 ? filters.sources : undefined,
        event_types: filters.types.length > 0 ? filters.types : undefined,
        limit: 100
      }),
      timelineApi.getStats(24)]
      );

      setEvents(eventsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      logger.error('Failed to fetch timeline', error);
    } finally {
      setLoading(false);
    }
  }

  function groupEventsByDate(events) {
    const groups = {};

    events.forEach((event) => {
      const date = new Date(event.event_timestamp).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
    });

    return groups;
  }

  const groupedEvents = groupEventsByDate(events);

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
        _jsxDEV("h1", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: "Change Timeline" }, void 0, false), /*#__PURE__*/
        _jsxDEV("button", { onClick: fetchData, className: "btn-secondary flex items-center gap-2", children: [/*#__PURE__*/
          _jsxDEV(ArrowPathIcon, { className: "h-4 w-4" }, void 0, false), "Refresh"] }, void 0, true

        )] }, void 0, true
      ),


      stats && /*#__PURE__*/
      _jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Total Events (24h)" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: stats.total_events || 0 }, void 0, false)] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Deployments" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-primary-600", children:
            stats.by_type?.deployment || 0 }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Config Changes" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-warning-600", children:
            stats.by_type?.config_change || 0 }, void 0, false
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "card text-center", children: [/*#__PURE__*/
          _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Incidents" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-2xl font-bold text-danger-600", children:
            stats.by_type?.incident || 0 }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ), /*#__PURE__*/



      _jsxDEV("div", { className: "card flex flex-wrap items-center gap-4", children: [/*#__PURE__*/
        _jsxDEV(FunnelIcon, { className: "h-5 w-5 text-gray-400" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-wrap gap-2", children:
          ['kubernetes', 'jenkins', 'github', 'manual'].map((source) => /*#__PURE__*/
          _jsxDEV("button", {

            onClick: () =>
            setFilters((prev) => ({
              ...prev,
              sources: prev.sources.includes(source) ?
              prev.sources.filter((s) => s !== source) :
              [...prev.sources, source]
            })),

            className: `px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filters.sources.includes(source) ?
            'bg-primary-100 dark:bg-primary-500/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-500/50' :
            'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`, children:


            source }, source, false
          )
          ) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "border-l border-gray-200 dark:border-slate-600 h-6 mx-2" }, void 0, false), /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-wrap gap-2", children:
          ['deployment', 'config_change', 'incident', 'rollback'].map((type) => /*#__PURE__*/
          _jsxDEV("button", {

            onClick: () =>
            setFilters((prev) => ({
              ...prev,
              types: prev.types.includes(type) ?
              prev.types.filter((t) => t !== type) :
              [...prev.types, type]
            })),

            className: `px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filters.types.includes(type) ?
            'bg-primary-100 dark:bg-primary-500/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-500/50' :
            'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`, children:


            type.replace('_', ' ') }, type, false
          )
          ) }, void 0, false
        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "card", children:
        loading ? /*#__PURE__*/
        _jsxDEV("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "Loading..." }, void 0, false) :
        events.length === 0 ? /*#__PURE__*/
        _jsxDEV("div", { className: "text-center py-12", children: [/*#__PURE__*/
          _jsxDEV(ClockIcon, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children: "No events found" }, void 0, false)] }, void 0, true
        ) : /*#__PURE__*/

        _jsxDEV("div", { className: "space-y-8", children:
          Object.entries(groupedEvents).map(([date, dateEvents]) => /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4", children: date }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { className: "space-y-4", children:
              dateEvents.map((event) => {
                const Icon = eventIcons[event.event_type] || ClockIcon;
                const colorClass = eventColors[event.event_type] || 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300';

                return (/*#__PURE__*/
                  _jsxDEV("div", { className: "flex gap-4", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex flex-col items-center", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: `p-2 rounded-lg border ${colorClass}`, children: /*#__PURE__*/
                        _jsxDEV(Icon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "w-0.5 h-full bg-gray-200 dark:bg-slate-600 mt-2" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "flex-1 pb-4", children: /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-start justify-between", children: [/*#__PURE__*/
                        _jsxDEV("div", { children: [/*#__PURE__*/
                          _jsxDEV("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: event.title }, void 0, false),
                          event.description && /*#__PURE__*/
                          _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-300 mt-1", children: event.description }, void 0, false), /*#__PURE__*/

                          _jsxDEV("div", { className: "flex flex-wrap gap-2 mt-2", children: [/*#__PURE__*/
                            _jsxDEV("span", { className: "text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded", children:
                              event.source }, void 0, false
                            ), /*#__PURE__*/
                            _jsxDEV("span", { className: "text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded", children:
                              event.event_type.replace('_', ' ') }, void 0, false
                            ),
                            event.namespace && /*#__PURE__*/
                            _jsxDEV("span", { className: "text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded", children:
                              event.namespace }, void 0, false
                            ),

                            event.service_name && /*#__PURE__*/
                            _jsxDEV("span", { className: "text-xs px-2 py-1 bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded", children:
                              event.service_name }, void 0, false
                            )] }, void 0, true

                          )] }, void 0, true
                        ), /*#__PURE__*/
                        _jsxDEV("span", { className: "text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap", children:
                          new Date(event.event_timestamp).toLocaleTimeString() }, void 0, false
                        )] }, void 0, true
                      ) }, void 0, false
                    )] }, event.id, true
                  ));

              }) }, void 0, false
            )] }, date, true
          )
          ) }, void 0, false
        ) }, void 0, false

      )] }, void 0, true
    ));

}
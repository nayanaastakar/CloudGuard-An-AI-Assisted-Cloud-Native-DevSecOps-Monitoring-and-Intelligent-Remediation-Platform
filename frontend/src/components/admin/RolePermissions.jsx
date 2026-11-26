import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  InformationCircleIcon } from
'@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import PermissionsInfo from '../common/PermissionsInfo';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";


const ROLE_COLORS = {
  admin: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', badge: 'bg-red-500' },
  developer: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', badge: 'bg-blue-500' },
  operator: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', badge: 'bg-yellow-500' },
  viewer: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30', badge: 'bg-gray-500' }
};

const ROLE_DESCRIPTIONS = {
  admin: 'Full system access with all permissions',
  developer: 'Deploy and manage applications',
  operator: 'Day-to-day operations and monitoring',
  viewer: 'Read-only access to view resources'
};

export default function RolePermissions() {
  const { user, hasRole } = useAuth();
  const currentRole = user?.role || 'viewer';
  const roles = ['admin', 'developer', 'operator', 'viewer'];

  if (!hasRole('admin')) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "p-6", children: /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center max-w-lg mx-auto", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4", children: /*#__PURE__*/
            _jsxDEV(ShieldCheckIcon, { className: "h-8 w-8 text-white" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("h2", { className: "text-xl font-semibold text-white mb-2", children: "View Your Permissions" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "text-slate-400 mb-6", children: "Click the info icon next to your role in the header to view your current permissions." }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("span", { className: `px-3 py-1.5 rounded-full text-sm font-medium capitalize ${ROLE_COLORS[currentRole].bg} ${ROLE_COLORS[currentRole].text} border ${ROLE_COLORS[currentRole].border}`, children:
              currentRole }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV(PermissionsInfo, { buttonClassName: "text-cyan-400 hover:text-cyan-300" }, void 0, false)] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ));

  }

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "p-6 space-y-6", children: [/*#__PURE__*/

      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "flex items-center justify-between", children: [/*#__PURE__*/

        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h1", { className: "text-2xl font-bold text-white flex items-center gap-3", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center", children: /*#__PURE__*/
              _jsxDEV(ShieldCheckIcon, { className: "h-5 w-5 text-white" }, void 0, false) }, void 0, false
            ), "Roles & Permissions"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-slate-400 mt-1 ml-13", children: "Role-based access control overview" }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV(PermissionsInfo, { buttonClassName: "px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors" }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1 },
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children:

        roles.map((role, index) => {
          const colors = ROLE_COLORS[role];
          const isCurrentRole = user?.role === role;

          return (/*#__PURE__*/
            _jsxDEV(motion.div, {

              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: 0.1 + index * 0.05 },
              className: `relative rounded-xl border p-4 transition-all hover:border-cyan-500/50 ${
              isCurrentRole ?
              'bg-cyan-500/10 border-cyan-500/30' :
              'bg-slate-800/50 border-slate-700'}`, children: [


              isCurrentRole && /*#__PURE__*/
              _jsxDEV("span", { className: "absolute -top-2 -right-2 px-2 py-0.5 bg-cyan-500 text-white text-[10px] font-medium rounded-full", children: "You" }, void 0, false

              ), /*#__PURE__*/

              _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
                _jsxDEV("span", { className: `w-3 h-3 rounded-full ${colors.badge}` }, void 0, false), /*#__PURE__*/
                _jsxDEV("h3", { className: `font-semibold capitalize ${colors.text}`, children: role }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-slate-600 text-xs", children: ["(", 4 - index, ")"] }, void 0, true)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-slate-400", children: ROLE_DESCRIPTIONS[role] }, void 0, false)] }, role, true
            ));

        }) }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.3 },
        className: "bg-slate-800/30 border border-slate-700/50 rounded-xl p-4", children: /*#__PURE__*/

        _jsxDEV("div", { className: "flex items-start gap-3", children: [/*#__PURE__*/
          _jsxDEV(InformationCircleIcon, { className: "w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "text-sm", children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-slate-300 mb-2", children: [/*#__PURE__*/
              _jsxDEV("strong", { children: "Role Hierarchy:" }, void 0, false), " Higher-level roles inherit all permissions from lower-level roles."] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-slate-400", children: ["Click the ", /*#__PURE__*/
              _jsxDEV(PermissionsInfo, { iconOnly: true, buttonClassName: "inline mx-1" }, void 0, false), " icon next to your role in the header to view detailed permission breakdown for your current role."] }, void 0, true

            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true
    ));

}
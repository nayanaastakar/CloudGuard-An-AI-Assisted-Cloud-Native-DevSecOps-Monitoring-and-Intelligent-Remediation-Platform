import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  ShieldCheckIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon,
  ServerStackIcon,
  CloudIcon,
  CommandLineIcon,
  ChartBarIcon,
  CogIcon } from
'@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";


// Simplified permission categories
const PERMISSION_SUMMARY = [
{
  name: 'Kubernetes',
  icon: ServerStackIcon,
  permissions: ['View', 'Create', 'Edit', 'Delete', 'Exec', 'Logs']
},
{
  name: 'GitOps',
  icon: CloudIcon,
  permissions: ['View', 'Sync', 'Create', 'Delete', 'Rollback']
},
{
  name: 'Helm',
  icon: CommandLineIcon,
  permissions: ['View', 'Install', 'Upgrade', 'Uninstall']
},
{
  name: 'Security',
  icon: ShieldCheckIcon,
  permissions: ['View', 'Scan', 'Configure']
},
{
  name: 'Monitoring',
  icon: ChartBarIcon,
  permissions: ['View', 'Alerts']
},
{
  name: 'Admin',
  icon: CogIcon,
  permissions: ['Users', 'Roles', 'Clusters', 'Settings']
}];


const ROLE_ACCESS = {
  admin: {
    Kubernetes: [true, true, true, true, true, true],
    GitOps: [true, true, true, true, true],
    Helm: [true, true, true, true],
    Security: [true, true, true],
    Monitoring: [true, true],
    Admin: [true, true, true, true]
  },
  developer: {
    Kubernetes: [true, true, true, true, true, true],
    GitOps: [true, true, true, false, true],
    Helm: [true, true, true, false],
    Security: [true, true, false],
    Monitoring: [true, false],
    Admin: [false, false, false, false]
  },
  operator: {
    Kubernetes: [true, false, true, false, true, true],
    GitOps: [true, true, false, false, true],
    Helm: [true, false, true, false],
    Security: [true, false, false],
    Monitoring: [true, true],
    Admin: [false, false, false, false]
  },
  viewer: {
    Kubernetes: [true, false, false, false, false, true],
    GitOps: [true, false, false, false, false],
    Helm: [true, false, false, false],
    Security: [true, false, false],
    Monitoring: [true, false],
    Admin: [false, false, false, false]
  }
};

const ROLE_COLORS = {
  admin: 'bg-red-500',
  developer: 'bg-blue-500',
  operator: 'bg-yellow-500',
  viewer: 'bg-gray-500'
};

const ROLE_LABELS = {
  admin: 'Administrator',
  developer: 'Developer',
  operator: 'Operator',
  viewer: 'Viewer'
};






export default function PermissionsInfo({ buttonClassName = '', iconOnly = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const currentRole = user?.role || 'viewer';

  return (/*#__PURE__*/
    _jsxDEV(_Fragment, { children: [/*#__PURE__*/

      _jsxDEV("button", {
        onClick: () => setIsOpen(true),
        className: `inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors ${buttonClassName}`,
        title: "View role permissions", children: [/*#__PURE__*/

        _jsxDEV(InformationCircleIcon, { className: "w-4 h-4" }, void 0, false),
        !iconOnly && /*#__PURE__*/_jsxDEV("span", { className: "text-xs", children: "Permissions" }, void 0, false)] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV(Transition, { appear: true, show: isOpen, as: Fragment, children: /*#__PURE__*/
        _jsxDEV(Dialog, { as: "div", className: "relative z-50", onClose: () => setIsOpen(false), children: [/*#__PURE__*/
          _jsxDEV(Transition.Child, {
            as: Fragment,
            enter: "ease-out duration-300",
            enterFrom: "opacity-0",
            enterTo: "opacity-100",
            leave: "ease-in duration-200",
            leaveFrom: "opacity-100",
            leaveTo: "opacity-0", children: /*#__PURE__*/

            _jsxDEV("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/

          _jsxDEV("div", { className: "fixed inset-0 overflow-y-auto", children: /*#__PURE__*/
            _jsxDEV("div", { className: "flex min-h-full items-center justify-center p-4", children: /*#__PURE__*/
              _jsxDEV(Transition.Child, {
                as: Fragment,
                enter: "ease-out duration-300",
                enterFrom: "opacity-0 scale-95",
                enterTo: "opacity-100 scale-100",
                leave: "ease-in duration-200",
                leaveFrom: "opacity-100 scale-100",
                leaveTo: "opacity-0 scale-95", children: /*#__PURE__*/

                _jsxDEV(Dialog.Panel, { className: "w-full max-w-2xl transform overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-xl transition-all", children: [/*#__PURE__*/

                  _jsxDEV("div", { className: "flex items-center justify-between px-6 py-4 border-b border-slate-700", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center", children: /*#__PURE__*/
                        _jsxDEV(ShieldCheckIcon, { className: "w-5 h-5 text-white" }, void 0, false) }, void 0, false
                      ), /*#__PURE__*/
                      _jsxDEV("div", { children: [/*#__PURE__*/
                        _jsxDEV(Dialog.Title, { className: "text-lg font-semibold text-white", children: "Role Permissions" }, void 0, false

                        ), /*#__PURE__*/
                        _jsxDEV("p", { className: "text-xs text-slate-400", children: ["Your role: ", /*#__PURE__*/
                          _jsxDEV("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs ${ROLE_COLORS[currentRole]}`, children:
                            ROLE_LABELS[currentRole] }, void 0, false
                          )] }, void 0, true
                        )] }, void 0, true
                      )] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("button", {
                      onClick: () => setIsOpen(false),
                      className: "p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors", children: /*#__PURE__*/

                      _jsxDEV(XMarkIcon, { className: "w-5 h-5" }, void 0, false) }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/


                  _jsxDEV("div", { className: "p-4 max-h-[60vh] overflow-y-auto", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "space-y-3", children:
                      PERMISSION_SUMMARY.map((category) => /*#__PURE__*/
                      _jsxDEV("div", {

                        className: "bg-slate-800/50 rounded-xl p-3 border border-slate-700/50", children: [/*#__PURE__*/

                        _jsxDEV("div", { className: "flex items-center gap-2 mb-2", children: [/*#__PURE__*/
                          _jsxDEV(category.icon, { className: "w-4 h-4 text-cyan-400" }, void 0, false), /*#__PURE__*/
                          _jsxDEV("span", { className: "text-sm font-medium text-white", children: category.name }, void 0, false)] }, void 0, true
                        ), /*#__PURE__*/
                        _jsxDEV("div", { className: "flex flex-wrap gap-1.5", children:
                          category.permissions.map((perm, idx) => {
                            const hasAccess = ROLE_ACCESS[currentRole][category.name][idx];
                            return (/*#__PURE__*/
                              _jsxDEV("span", {

                                className: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                                hasAccess ?
                                'bg-green-500/20 text-green-400 border border-green-500/30' :
                                'bg-slate-700/50 text-slate-500 border border-slate-600/30'}`, children: [


                                hasAccess ? /*#__PURE__*/
                                _jsxDEV(CheckIcon, { className: "w-3 h-3" }, void 0, false) : /*#__PURE__*/

                                _jsxDEV(XMarkIcon, { className: "w-3 h-3" }, void 0, false),

                                perm] }, perm, true
                              ));

                          }) }, void 0, false
                        )] }, category.name, true
                      )
                      ) }, void 0, false
                    ), /*#__PURE__*/


                    _jsxDEV("div", { className: "mt-4 pt-4 border-t border-slate-700", children: [/*#__PURE__*/
                      _jsxDEV("p", { className: "text-xs text-slate-500 mb-2", children: "Role Hierarchy:" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center gap-2 flex-wrap", children:
                        ['admin', 'developer', 'operator', 'viewer'].map((role, idx) => /*#__PURE__*/
                        _jsxDEV("div", {

                          className: `flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs ${
                          role === currentRole ?
                          'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' :
                          'bg-slate-800 text-slate-400'}`, children: [/*#__PURE__*/


                          _jsxDEV("span", { className: `w-2 h-2 rounded-full ${ROLE_COLORS[role]}` }, void 0, false), /*#__PURE__*/
                          _jsxDEV("span", { children: ROLE_LABELS[role] }, void 0, false), /*#__PURE__*/
                          _jsxDEV("span", { className: "text-slate-600", children: ["(", 4 - idx, ")"] }, void 0, true)] }, role, true
                        )
                        ) }, void 0, false
                      )] }, void 0, true
                    )] }, void 0, true
                  )] }, void 0, true
                ) }, void 0, false
              ) }, void 0, false
            ) }, void 0, false
          )] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true
    ));

}

// Inline tooltip version for headers
export function PermissionsTooltip() {
  const { user } = useAuth();
  const currentRole = user?.role || 'viewer';

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "inline-flex items-center gap-2", children: [/*#__PURE__*/
      _jsxDEV("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[currentRole]} text-white`, children: [/*#__PURE__*/
        _jsxDEV(ShieldCheckIcon, { className: "w-3 h-3" }, void 0, false),
        ROLE_LABELS[currentRole]] }, void 0, true
      ), /*#__PURE__*/
      _jsxDEV(PermissionsInfo, { iconOnly: true }, void 0, false)] }, void 0, true
    ));

}
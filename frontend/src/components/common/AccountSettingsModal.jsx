import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  UserCircleIcon,
  KeyIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
  EnvelopeIcon,
  IdentificationIcon,
  ArrowRightOnRectangleIcon } from
'@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";







const ROLE_DETAILS = {
  admin: { label: 'Administrator', color: 'red' },
  developer: { label: 'Developer', color: 'blue' },
  operator: { label: 'Operator', color: 'yellow' },
  viewer: { label: 'Viewer', color: 'gray' }
};

export default function AccountSettingsModal({ isOpen, onClose }) {
  const { user, logout, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const passwordRequirements = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Number', test: (p) => /\d/.test(p) },
  { label: 'Special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) }];


  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    const failedRequirement = passwordRequirements.find((req) => !req.test(newPassword));
    if (failedRequirement) {
      setPasswordError(`Password requirement not met: ${failedRequirement.label}`);
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to change password';
      setPasswordError(errorMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const getRoleColor = (role) => {
    switch (ROLE_DETAILS[role]?.color) {
      case 'red':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'blue':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getRoleBorderColor = (role) => {
    switch (role) {
      case 'admin':return 'border-red-500';
      case 'developer':return 'border-blue-500';
      case 'operator':return 'border-yellow-500';
      default:return 'border-gray-500';
    }
  };

  if (!user) return null;

  return (/*#__PURE__*/
    _jsxDEV(AnimatePresence, { children:
      isOpen && /*#__PURE__*/
      _jsxDEV(_Fragment, { children: [/*#__PURE__*/

        _jsxDEV(motion.div, {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
          onClick: onClose }, void 0, false
        ), /*#__PURE__*/


        _jsxDEV(motion.div, {
          initial: { opacity: 0, scale: 0.95, y: -20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: -20 },
          transition: { type: 'spring', damping: 25, stiffness: 300 },
          className: "fixed inset-0 z-50 flex items-center justify-center p-4",
          onClick: (e) => e.stopPropagation(), children: /*#__PURE__*/

          _jsxDEV("div", { className: "w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white dark:bg-slate-800 rounded-2xl shadow-2xl", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "relative px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
                _jsxDEV("div", { className: `w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg border-4 ${getRoleBorderColor(user.role)}`, children: /*#__PURE__*/
                  _jsxDEV("span", { className: "text-white font-bold text-xl", children:
                    user.username.charAt(0).toUpperCase() }, void 0, false
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV("h2", { className: "text-xl font-bold text-gray-900 dark:text-white", children:
                      user.full_name || user.username }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("span", { className: `px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`, children:
                      ROLE_DETAILS[user.role]?.label }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["@", user.username] }, void 0, true)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: onClose,
                  className: "p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors", children: /*#__PURE__*/

                  _jsxDEV(XMarkIcon, { className: "h-6 w-6" }, void 0, false) }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "flex gap-1 mt-4", children: [/*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => setActiveTab('profile'),
                  className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'profile' ?
                  'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm' :
                  'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`, children: [/*#__PURE__*/


                  _jsxDEV(UserCircleIcon, { className: "h-4 w-4" }, void 0, false), "Profile"] }, void 0, true

                ), /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: () => setActiveTab('security'),
                  className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'security' ?
                  'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm' :
                  'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`, children: [/*#__PURE__*/


                  _jsxDEV(ShieldCheckIcon, { className: "h-4 w-4" }, void 0, false), "Security"] }, void 0, true

                )] }, void 0, true
              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "p-6 overflow-y-auto max-h-[calc(90vh-200px)]", children: [

              activeTab === 'profile' && /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

                _jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1", children: [/*#__PURE__*/
                      _jsxDEV(IdentificationIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs uppercase tracking-wide font-medium", children: "User ID" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm font-mono text-gray-900 dark:text-white truncate", children:
                      user.id }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1", children: [/*#__PURE__*/
                      _jsxDEV(EnvelopeIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs uppercase tracking-wide font-medium", children: "Email" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-900 dark:text-white", children:
                      user.email || 'Not provided' }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1", children: [/*#__PURE__*/
                      _jsxDEV(ClockIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs uppercase tracking-wide font-medium", children: "Member Since" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-900 dark:text-white", children:
                      user.created_at ?
                      new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }) :
                      'Unknown' }, void 0, false
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1", children: [/*#__PURE__*/
                      _jsxDEV(ClockIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("span", { className: "text-xs uppercase tracking-wide font-medium", children: "Last Login" }, void 0, false)] }, void 0, true
                    ), /*#__PURE__*/
                    _jsxDEV("p", { className: "text-sm text-gray-900 dark:text-white", children:
                      user.last_login ?
                      new Date(user.last_login).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) :
                      'Just now' }, void 0, false
                    )] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/


                _jsxDEV("div", { className: "p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl border border-primary-200 dark:border-primary-800", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-2 text-primary-700 dark:text-primary-300 mb-2", children: [/*#__PURE__*/
                    _jsxDEV(KeyIcon, { className: "h-5 w-5" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "font-medium", children: "Your Permissions" }, void 0, false)] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-300", children:
                    user.role === 'admin' ?
                    'Full system access with all permissions.' :
                    user.role === 'developer' ?
                    'Deploy and manage applications, Kubernetes resources, and GitOps.' :
                    user.role === 'operator' ?
                    'Monitor systems, view logs, and perform operational tasks.' :
                    'Read-only access to view resources and dashboards.' }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/


                _jsxDEV("div", { className: "flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800", children: [/*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center gap-3", children: [/*#__PURE__*/
                    _jsxDEV("div", { className: "w-3 h-3 bg-green-500 rounded-full animate-pulse" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("p", { className: "font-medium text-green-800 dark:text-green-200", children: "Account Active" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm text-green-600 dark:text-green-300", children: "Your account is in good standing" }, void 0, false)] }, void 0, true
                    )] }, void 0, true
                  ), /*#__PURE__*/
                  _jsxDEV(CheckCircleIcon, { className: "h-8 w-8 text-green-500" }, void 0, false)] }, void 0, true
                )] }, void 0, true
              ),



              activeTab === 'security' && /*#__PURE__*/
              _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

                _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl", children: [/*#__PURE__*/
                  _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV(KeyIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false), "Change Password"] }, void 0, true

                  ),

                  passwordSuccess && /*#__PURE__*/
                  _jsxDEV("div", { className: "mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800", children: /*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                      _jsxDEV(CheckCircleIcon, { className: "h-5 w-5 text-green-500" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm font-medium text-green-800 dark:text-green-200", children: "Password changed successfully!" }, void 0, false

                      )] }, void 0, true
                    ) }, void 0, false
                  ),


                  passwordError && /*#__PURE__*/
                  _jsxDEV("div", { className: "mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800", children: /*#__PURE__*/
                    _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                      _jsxDEV(ExclamationCircleIcon, { className: "h-5 w-5 text-red-500" }, void 0, false), /*#__PURE__*/
                      _jsxDEV("p", { className: "text-sm font-medium text-red-800 dark:text-red-200", children:
                        passwordError }, void 0, false
                      )] }, void 0, true
                    ) }, void 0, false
                  ), /*#__PURE__*/


                  _jsxDEV("form", { onSubmit: handlePasswordChange, className: "space-y-4", children: [/*#__PURE__*/

                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Current Password" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
                        _jsxDEV("input", {
                          type: showCurrentPassword ? 'text' : 'password',
                          required: true,
                          value: currentPassword,
                          onChange: (e) => setCurrentPassword(e.target.value),
                          className: "w-full px-4 py-2.5 pr-12 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                          placeholder: "Enter current password" }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV("button", {
                          type: "button",
                          onClick: () => setShowCurrentPassword(!showCurrentPassword),
                          className: "absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600", children:

                          showCurrentPassword ? /*#__PURE__*/_jsxDEV(EyeSlashIcon, { className: "h-5 w-5" }, void 0, false) : /*#__PURE__*/_jsxDEV(EyeIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
                        )] }, void 0, true
                      )] }, void 0, true
                    ), /*#__PURE__*/


                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "New Password" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
                        _jsxDEV("input", {
                          type: showNewPassword ? 'text' : 'password',
                          required: true,
                          value: newPassword,
                          onChange: (e) => setNewPassword(e.target.value),
                          className: "w-full px-4 py-2.5 pr-12 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                          placeholder: "Enter new password" }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV("button", {
                          type: "button",
                          onClick: () => setShowNewPassword(!showNewPassword),
                          className: "absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600", children:

                          showNewPassword ? /*#__PURE__*/_jsxDEV(EyeSlashIcon, { className: "h-5 w-5" }, void 0, false) : /*#__PURE__*/_jsxDEV(EyeIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
                        )] }, void 0, true
                      )] }, void 0, true
                    ),


                    newPassword && /*#__PURE__*/
                    _jsxDEV("div", { className: "p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600", children: [/*#__PURE__*/
                      _jsxDEV("p", { className: "text-xs font-medium text-gray-600 dark:text-gray-400 mb-2", children: "Password Requirements:" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "grid grid-cols-2 gap-1", children:
                        passwordRequirements.map((req) => {
                          const passed = req.test(newPassword);
                          return (/*#__PURE__*/
                            _jsxDEV("div", {

                              className: `text-xs flex items-center gap-1 ${
                              passed ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`, children: [


                              passed ? /*#__PURE__*/
                              _jsxDEV(CheckCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false) : /*#__PURE__*/

                              _jsxDEV("span", { className: "w-3.5 h-3.5 rounded-full border border-current" }, void 0, false),

                              req.label] }, req.label, true
                            ));

                        }) }, void 0, false
                      )] }, void 0, true
                    ), /*#__PURE__*/



                    _jsxDEV("div", { children: [/*#__PURE__*/
                      _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Confirm New Password" }, void 0, false

                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
                        _jsxDEV("input", {
                          type: showConfirmPassword ? 'text' : 'password',
                          required: true,
                          value: confirmPassword,
                          onChange: (e) => setConfirmPassword(e.target.value),
                          className: `w-full px-4 py-2.5 pr-12 border rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          confirmPassword && confirmPassword !== newPassword ?
                          'border-red-300 dark:border-red-600' :
                          'border-gray-300 dark:border-slate-600'}`,

                          placeholder: "Confirm new password" }, void 0, false
                        ), /*#__PURE__*/
                        _jsxDEV("button", {
                          type: "button",
                          onClick: () => setShowConfirmPassword(!showConfirmPassword),
                          className: "absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600", children:

                          showConfirmPassword ? /*#__PURE__*/_jsxDEV(EyeSlashIcon, { className: "h-5 w-5" }, void 0, false) : /*#__PURE__*/_jsxDEV(EyeIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
                        )] }, void 0, true
                      ),
                      confirmPassword && confirmPassword !== newPassword && /*#__PURE__*/
                      _jsxDEV("p", { className: "mt-1 text-xs text-red-600 dark:text-red-400", children: "Passwords do not match" }, void 0, false

                      )] }, void 0, true

                    ), /*#__PURE__*/

                    _jsxDEV("button", {
                      type: "submit",
                      disabled: passwordLoading || confirmPassword !== '' && confirmPassword !== newPassword,
                      className: "w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children:

                      passwordLoading ? 'Changing Password...' : 'Change Password' }, void 0, false
                    )] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/


                _jsxDEV("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800", children: [/*#__PURE__*/
                  _jsxDEV("h3", { className: "text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV(ShieldCheckIcon, { className: "h-4 w-4" }, void 0, false), "Security Tips"] }, void 0, true

                  ), /*#__PURE__*/
                  _jsxDEV("ul", { className: "space-y-1 text-xs text-blue-700 dark:text-blue-300", children: [/*#__PURE__*/
                    _jsxDEV("li", { children: "Use a unique password that you don't use elsewhere" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("li", { children: "Change your password regularly for better security" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("li", { children: "Never share your login credentials with others" }, void 0, false)] }, void 0, true
                  )] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true

            ), /*#__PURE__*/


            _jsxDEV("div", { className: "px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50", children: /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
                _jsxDEV("button", {
                  onClick: handleLogout,
                  className: "flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors", children: [/*#__PURE__*/

                  _jsxDEV(ArrowRightOnRectangleIcon, { className: "h-5 w-5" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("span", { className: "font-medium", children: "Sign Out" }, void 0, false)] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("button", {
                  onClick: onClose,
                  className: "px-6 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors", children:
                  "Close" }, void 0, false

                )] }, void 0, true
              ) }, void 0, false
            )] }, void 0, true
          ) }, void 0, false
        )] }, void 0, true
      ) }, void 0, false

    ));

}
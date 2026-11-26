import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircleIcon,
  KeyIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon } from
'@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../common/PageHeader';

// Animation variants
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ProfileSettings() {
  const { user, changePassword } = useAuth();
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
  { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Contains a number', test: (p) => /\d/.test(p) },
  { label: 'Contains special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) }];


  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    // Validate password requirements
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'developer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'operator':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      variants: containerVariants,
      initial: "hidden",
      animate: "visible",
      className: "space-y-6", children: [/*#__PURE__*/


      _jsxDEV(PageHeader, {
        title: "Account Settings",
        description: "Manage your profile and security settings",
        icon: UserCircleIcon,
        iconColor: "blue" }, void 0, false
      ), /*#__PURE__*/


      _jsxDEV(motion.div, {
        variants: itemVariants,
        className: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-slate-700/50 p-1.5 inline-flex gap-1", children: [/*#__PURE__*/

        _jsxDEV(motion.button, {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          onClick: () => setActiveTab('profile'),
          className: `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
          activeTab === 'profile' ?
          'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' :
          'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-slate-700/50'}`, children: [/*#__PURE__*/


          _jsxDEV(UserCircleIcon, { className: "h-4 w-4" }, void 0, false), "Profile"] }, void 0, true

        ), /*#__PURE__*/
        _jsxDEV(motion.button, {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          onClick: () => setActiveTab('security'),
          className: `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
          activeTab === 'security' ?
          'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' :
          'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-slate-700/50'}`, children: [/*#__PURE__*/


          _jsxDEV(ShieldCheckIcon, { className: "h-4 w-4" }, void 0, false), "Security"] }, void 0, true

        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { mode: "wait", children: [
        activeTab === 'profile' && user && /*#__PURE__*/
        _jsxDEV(motion.div, {

          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: { duration: 0.2 },
          className: "space-y-6", children: [/*#__PURE__*/


          _jsxDEV(motion.div, {
            variants: itemVariants,
            className: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-slate-700/50 p-6", children: [/*#__PURE__*/

            _jsxDEV("div", { className: "flex items-start gap-6", children: [/*#__PURE__*/

              _jsxDEV("div", { className: "w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg", children: /*#__PURE__*/
                _jsxDEV("span", { className: "text-white font-bold text-3xl", children:
                  user.username.charAt(0).toUpperCase() }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "flex items-center gap-3 mb-2", children: [/*#__PURE__*/
                  _jsxDEV("h2", { className: "text-xl font-bold text-gray-900 dark:text-white", children:
                    user.full_name || user.username }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("span", {
                    className: `px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleColor(
                      user.role
                    )}`, children:

                    user.role }, void 0, false
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children: ["@", user.username] }, void 0, true),
                user.email && /*#__PURE__*/
                _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 text-sm mt-1", children: user.email }, void 0, false)] }, void 0, true

              )] }, void 0, true
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200/50 dark:border-slate-700/50", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide", children: "Status" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("p", { className: "mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1", children: [/*#__PURE__*/
                  _jsxDEV("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }, void 0, false), "Active"] }, void 0, true

                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide", children: "Role Level" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("p", { className: "mt-1 text-sm font-medium text-gray-900 dark:text-white", children:
                  user.role === 'admin' ?
                  '4 (Highest)' :
                  user.role === 'developer' ?
                  '3' :
                  user.role === 'operator' ?
                  '2' :
                  '1' }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide", children: "Member Since" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("p", { className: "mt-1 text-sm font-medium text-gray-900 dark:text-white", children:
                  user.created_at ?
                  new Date(user.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric'
                  }) :
                  'N/A' }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide", children: "Last Login" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("p", { className: "mt-1 text-sm font-medium text-gray-900 dark:text-white", children:
                  user.last_login ?
                  new Date(user.last_login).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) :
                  'Just now' }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV(motion.div, {
            variants: itemVariants,
            className: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-slate-700/50 p-6", children: [/*#__PURE__*/

            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(KeyIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false), "Your Permissions"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-4", children: ["Based on your ", /*#__PURE__*/
              _jsxDEV("span", { className: "font-medium capitalize", children: user.role }, void 0, false), " role, you have access to:"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
              user.role === 'admin' && /*#__PURE__*/
              _jsxDEV(PermissionItem, { label: "Full System Access", description: "All permissions granted" }, void 0, false),

              (user.role === 'admin' || user.role === 'developer') && /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(PermissionItem, { label: "Kubernetes Management", description: "Create, edit, delete resources" }, void 0, false), /*#__PURE__*/
                _jsxDEV(PermissionItem, { label: "GitOps Deployments", description: "Sync and manage ArgoCD apps" }, void 0, false), /*#__PURE__*/
                _jsxDEV(PermissionItem, { label: "Helm Operations", description: "Install and manage charts" }, void 0, false)] }, void 0, true
              ),

              user.role === 'operator' && /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(PermissionItem, { label: "View & Monitor", description: "Access dashboards and metrics" }, void 0, false), /*#__PURE__*/
                _jsxDEV(PermissionItem, { label: "Operations", description: "Scale, restart, exec into pods" }, void 0, false), /*#__PURE__*/
                _jsxDEV(PermissionItem, { label: "Alert Management", description: "Configure and manage alerts" }, void 0, false)] }, void 0, true
              ),

              user.role === 'viewer' && /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(PermissionItem, { label: "View Resources", description: "Read-only access to all resources" }, void 0, false), /*#__PURE__*/
                _jsxDEV(PermissionItem, { label: "View Logs", description: "Access container logs" }, void 0, false), /*#__PURE__*/
                _jsxDEV(PermissionItem, { label: "View Metrics", description: "Access monitoring dashboards" }, void 0, false)] }, void 0, true
              )] }, void 0, true

            )] }, void 0, true
          )] }, "profile", true
        ),



        activeTab === 'security' && /*#__PURE__*/
        _jsxDEV(motion.div, {

          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: { duration: 0.2 },
          className: "space-y-6", children: [/*#__PURE__*/


          _jsxDEV(motion.div, {
            variants: itemVariants,
            className: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-slate-700/50 p-6", children: [/*#__PURE__*/

            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(KeyIcon, { className: "h-5 w-5 text-gray-500" }, void 0, false), "Change Password"] }, void 0, true

            ), /*#__PURE__*/


            _jsxDEV(AnimatePresence, { children:
              passwordSuccess && /*#__PURE__*/
              _jsxDEV(motion.div, {
                initial: { opacity: 0, y: -10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -10 },
                className: "mb-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-900/30 backdrop-blur-sm p-4 border border-emerald-200/50 dark:border-emerald-800/50", children: /*#__PURE__*/

                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(CheckCircleIcon, { className: "h-5 w-5 text-emerald-500" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm font-medium text-emerald-800 dark:text-emerald-200", children: "Password changed successfully!" }, void 0, false

                  )] }, void 0, true
                ) }, void 0, false
              ) }, void 0, false

            ), /*#__PURE__*/


            _jsxDEV(AnimatePresence, { children:
              passwordError && /*#__PURE__*/
              _jsxDEV(motion.div, {
                initial: { opacity: 0, y: -10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -10 },
                className: "mb-4 rounded-xl bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm p-4 border border-red-200/50 dark:border-red-800/50", children: /*#__PURE__*/

                _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(ExclamationCircleIcon, { className: "h-5 w-5 text-red-500" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm font-medium text-red-800 dark:text-red-200", children:
                    passwordError }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false
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
                    className: "w-full px-4 py-2.5 pr-12 border border-gray-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                    placeholder: "Enter current password" }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("button", {
                    type: "button",
                    onClick: () => setShowCurrentPassword(!showCurrentPassword),
                    className: "absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors", children:

                    showCurrentPassword ? /*#__PURE__*/
                    _jsxDEV(EyeSlashIcon, { className: "h-5 w-5" }, void 0, false) : /*#__PURE__*/

                    _jsxDEV(EyeIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false

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
                    className: "w-full px-4 py-2.5 pr-12 border border-gray-200/50 dark:border-slate-600/50 rounded-xl bg-white/50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                    placeholder: "Enter new password" }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("button", {
                    type: "button",
                    onClick: () => setShowNewPassword(!showNewPassword),
                    className: "absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors", children:

                    showNewPassword ? /*#__PURE__*/
                    _jsxDEV(EyeSlashIcon, { className: "h-5 w-5" }, void 0, false) : /*#__PURE__*/

                    _jsxDEV(EyeIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false

                  )] }, void 0, true
                )] }, void 0, true
              ), /*#__PURE__*/


              _jsxDEV(AnimatePresence, { children:
                newPassword && /*#__PURE__*/
                _jsxDEV(motion.div, {
                  initial: { opacity: 0, height: 0 },
                  animate: { opacity: 1, height: 'auto' },
                  exit: { opacity: 0, height: 0 },
                  className: "p-3 bg-gray-50/80 dark:bg-slate-700/50 backdrop-blur-sm rounded-xl", children: [/*#__PURE__*/

                  _jsxDEV("p", { className: "text-xs font-medium text-gray-600 dark:text-gray-400 mb-2", children: "Password Requirements:" }, void 0, false

                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-1", children:
                    passwordRequirements.map((req) => {
                      const passed = req.test(newPassword);
                      return (/*#__PURE__*/
                        _jsxDEV("div", {

                          className: `text-xs flex items-center gap-1 transition-colors ${
                          passed ?
                          'text-emerald-600 dark:text-emerald-400' :
                          'text-gray-500 dark:text-gray-400'}`, children: [


                          passed ? /*#__PURE__*/
                          _jsxDEV(CheckCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false) : /*#__PURE__*/

                          _jsxDEV("span", { className: "w-3.5 h-3.5 rounded-full border border-current" }, void 0, false),

                          req.label] }, req.label, true
                        ));

                    }) }, void 0, false
                  )] }, void 0, true
                ) }, void 0, false

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
                    className: `w-full px-4 py-2.5 pr-12 border rounded-xl bg-white/50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    confirmPassword && confirmPassword !== newPassword ?
                    'border-red-300/50 dark:border-red-600/50' :
                    'border-gray-200/50 dark:border-slate-600/50'}`,

                    placeholder: "Confirm new password" }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("button", {
                    type: "button",
                    onClick: () => setShowConfirmPassword(!showConfirmPassword),
                    className: "absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors", children:

                    showConfirmPassword ? /*#__PURE__*/
                    _jsxDEV(EyeSlashIcon, { className: "h-5 w-5" }, void 0, false) : /*#__PURE__*/

                    _jsxDEV(EyeIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false

                  )] }, void 0, true
                ),
                confirmPassword && confirmPassword !== newPassword && /*#__PURE__*/
                _jsxDEV("p", { className: "mt-1 text-xs text-red-600 dark:text-red-400", children: "Passwords do not match" }, void 0, false

                )] }, void 0, true

              ), /*#__PURE__*/

              _jsxDEV("div", { className: "pt-4", children: /*#__PURE__*/
                _jsxDEV(motion.button, {
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                  type: "submit",
                  disabled: passwordLoading || confirmPassword !== '' && confirmPassword !== newPassword,
                  className: "px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed", children:

                  passwordLoading ? 'Changing Password...' : 'Change Password' }, void 0, false
                ) }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV(motion.div, {
            variants: itemVariants,
            className: "bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-sm rounded-xl border border-blue-200/50 dark:border-blue-800/50 p-6", children: [/*#__PURE__*/

            _jsxDEV("h3", { className: "text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(ShieldCheckIcon, { className: "h-5 w-5" }, void 0, false), "Security Tips"] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("ul", { className: "space-y-2 text-sm text-blue-700 dark:text-blue-300", children: [/*#__PURE__*/
              _jsxDEV("li", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 mt-0.5 flex-shrink-0" }, void 0, false), "Use a unique password that you don't use elsewhere"] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV("li", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 mt-0.5 flex-shrink-0" }, void 0, false), "Avoid using personal information in your password"] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV("li", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 mt-0.5 flex-shrink-0" }, void 0, false), "Consider using a password manager for secure storage"] }, void 0, true

              ), /*#__PURE__*/
              _jsxDEV("li", { className: "flex items-start gap-2", children: [/*#__PURE__*/
                _jsxDEV(CheckCircleIcon, { className: "h-4 w-4 mt-0.5 flex-shrink-0" }, void 0, false), "Change your password regularly for better security"] }, void 0, true

              )] }, void 0, true
            )] }, void 0, true
          )] }, "security", true
        )] }, void 0, true

      )] }, void 0, true
    ));

}

function PermissionItem({ label, description }) {
  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      className: "flex items-start gap-2 p-3 bg-gray-50/80 dark:bg-slate-700/50 backdrop-blur-sm rounded-xl", children: [/*#__PURE__*/

      _jsxDEV(CheckCircleIcon, { className: "h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" }, void 0, false), /*#__PURE__*/
      _jsxDEV("div", { children: [/*#__PURE__*/
        _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white", children: label }, void 0, false), /*#__PURE__*/
        _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: description }, void 0, false)] }, void 0, true
      )] }, void 0, true
    ));

}
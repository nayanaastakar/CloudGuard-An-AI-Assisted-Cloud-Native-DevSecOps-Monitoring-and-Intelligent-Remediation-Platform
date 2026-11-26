import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  XMarkIcon,
  RocketLaunchIcon,
  ShieldExclamationIcon,
  ServerStackIcon,
  UserIcon,
  CogIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  BellAlertIcon } from
'@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import { useNotifications } from '../../contexts/NotificationContext';import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";

const categoryIcons = {
  deployment: RocketLaunchIcon,
  security: ShieldExclamationIcon,
  cluster: ServerStackIcon,
  user: UserIcon,
  system: CogIcon,
  gitops: ArrowPathIcon
};

const typeColors = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'text-blue-500',
    border: 'border-blue-200 dark:border-blue-800'
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    icon: 'text-green-500',
    border: 'border-green-200 dark:border-green-800'
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    icon: 'text-yellow-500',
    border: 'border-yellow-200 dark:border-yellow-800'
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: 'text-red-500',
    border: 'border-red-200 dark:border-red-800'
  },
  alert: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    icon: 'text-orange-500',
    border: 'border-orange-200 dark:border-orange-800'
  }
};

const typeIcons = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  error: ExclamationCircleIcon,
  alert: BellAlertIcon
};

function formatTimeAgo(date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function NotificationItem({
  notification,
  onMarkRead,
  onRemove,
  onClick





}) {
  const CategoryIcon = categoryIcons[notification.category];
  const TypeIcon = typeIcons[notification.type];
  const colors = typeColors[notification.type];

  return (/*#__PURE__*/
    _jsxDEV(motion.div, {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, x: 50 },
      className: `relative p-3 rounded-lg border ${colors.border} ${colors.bg} ${
      !notification.read ? 'ring-2 ring-primary-500/20' : ''} cursor-pointer hover:shadow-md transition-shadow`,

      onClick: onClick, children: /*#__PURE__*/

      _jsxDEV("div", { className: "flex items-start gap-3", children: [/*#__PURE__*/
        _jsxDEV("div", { className: `p-1.5 rounded-lg ${colors.bg}`, children: /*#__PURE__*/
          _jsxDEV(TypeIcon, { className: `h-4 w-4 ${colors.icon}` }, void 0, false) }, void 0, false
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex-1 min-w-0", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV("p", { className: "text-sm font-medium text-gray-900 dark:text-white truncate", children:
              notification.title }, void 0, false
            ),
            !notification.read && /*#__PURE__*/
            _jsxDEV("span", { className: "w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" }, void 0, false)] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2", children:
            notification.message }, void 0, false
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-2 mt-1.5", children: [/*#__PURE__*/
            _jsxDEV(CategoryIcon, { className: "h-3 w-3 text-gray-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-500 capitalize", children:
              notification.category }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("span", { className: "text-xs text-gray-400", children: "·" }, void 0, false), /*#__PURE__*/
            _jsxDEV("span", { className: "text-xs text-gray-500 dark:text-gray-500", children:
              formatTimeAgo(notification.timestamp) }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("div", { className: "flex items-center gap-1", children: [
          !notification.read && /*#__PURE__*/
          _jsxDEV("button", {
            onClick: (e) => {
              e.stopPropagation();
              onMarkRead();
            },
            className: "p-1 text-gray-400 hover:text-green-500 rounded transition-colors",
            title: "Mark as read", children: /*#__PURE__*/

            _jsxDEV(CheckIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
          ), /*#__PURE__*/

          _jsxDEV("button", {
            onClick: (e) => {
              e.stopPropagation();
              onRemove();
            },
            className: "p-1 text-gray-400 hover:text-red-500 rounded transition-colors",
            title: "Remove", children: /*#__PURE__*/

            _jsxDEV(XMarkIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
          )] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } =
  useNotifications();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
    setIsOpen(false);
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "relative", ref: dropdownRef, children: [/*#__PURE__*/

      _jsxDEV(motion.button, {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        onClick: () => setIsOpen(!isOpen),
        className: "relative p-2.5 rounded-xl bg-gray-100/50 dark:bg-slate-700/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 border border-transparent hover:border-primary-200 dark:hover:border-primary-900/50", children: [

        unreadCount > 0 ? /*#__PURE__*/
        _jsxDEV(BellIconSolid, { className: "h-5 w-5" }, void 0, false) : /*#__PURE__*/

        _jsxDEV(BellIcon, { className: "h-5 w-5" }, void 0, false),

        unreadCount > 0 && /*#__PURE__*/
        _jsxDEV(motion.span, {
          initial: { scale: 0 },
          animate: { scale: 1 },
          className: "absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center", children:

          unreadCount > 9 ? '9+' : unreadCount }, void 0, false
        )] }, void 0, true

      ), /*#__PURE__*/


      _jsxDEV(AnimatePresence, { children:
        isOpen && /*#__PURE__*/
        _jsxDEV(motion.div, {
          initial: { opacity: 0, y: 10, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 10, scale: 0.95 },
          transition: { duration: 0.15 },
          className: "absolute right-0 mt-2 w-96 max-h-[500px] bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden z-50", children: [/*#__PURE__*/


          _jsxDEV("div", { className: "flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
              _jsxDEV(BellIcon, { className: "h-5 w-5 text-gray-600 dark:text-gray-400" }, void 0, false), /*#__PURE__*/
              _jsxDEV("h3", { className: "font-semibold text-gray-900 dark:text-white", children: "Notifications" }, void 0, false),
              unreadCount > 0 && /*#__PURE__*/
              _jsxDEV("span", { className: "px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full", children: [
                unreadCount, " new"] }, void 0, true
              )] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center gap-1", children: [
              unreadCount > 0 && /*#__PURE__*/
              _jsxDEV("button", {
                onClick: markAllAsRead,
                className: "p-1.5 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors",
                title: "Mark all as read", children: /*#__PURE__*/

                _jsxDEV(CheckIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
              ),

              notifications.length > 0 && /*#__PURE__*/
              _jsxDEV("button", {
                onClick: clearAll,
                className: "p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors",
                title: "Clear all", children: /*#__PURE__*/

                _jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false
              )] }, void 0, true

            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "overflow-y-auto max-h-[400px] p-2 space-y-2", children:
            notifications.length === 0 ? /*#__PURE__*/
            _jsxDEV("div", { className: "py-12 text-center", children: [/*#__PURE__*/
              _jsxDEV(BellIcon, { className: "h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "mt-3 text-sm text-gray-500 dark:text-gray-400", children: "No notifications" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-400 dark:text-gray-500", children: "You're all caught up!" }, void 0, false

              )] }, void 0, true
            ) : /*#__PURE__*/

            _jsxDEV(AnimatePresence, { children:
              notifications.map((notification) => /*#__PURE__*/
              _jsxDEV(NotificationItem, {

                notification: notification,
                onMarkRead: () => markAsRead(notification.id),
                onRemove: () => removeNotification(notification.id),
                onClick: () => handleNotificationClick(notification) }, notification.id, false
              )
              ) }, void 0, false
            ) }, void 0, false

          ),


          notifications.length > 0 && /*#__PURE__*/
          _jsxDEV("div", { className: "px-4 py-2 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900", children: /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => {
                navigate('/admin/audit-logs');
                setIsOpen(false);
              },
              className: "w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:underline", children:
              "View all activity" }, void 0, false

            ) }, void 0, false
          )] }, void 0, true

        ) }, void 0, false

      )] }, void 0, true
    ));

}
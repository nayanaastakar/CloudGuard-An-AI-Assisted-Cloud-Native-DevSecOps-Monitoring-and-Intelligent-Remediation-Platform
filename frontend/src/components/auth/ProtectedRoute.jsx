import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";







export default function ProtectedRoute({ children, minRole }) {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900", children: /*#__PURE__*/
        _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "mt-4 text-gray-600 dark:text-gray-400", children: "Loading..." }, void 0, false)] }, void 0, true
        ) }, void 0, false
      ));

  }

  if (!isAuthenticated) {
    return /*#__PURE__*/_jsxDEV(Navigate, { to: "/login", state: { from: location }, replace: true }, void 0, false);
  }

  if (minRole && !hasRole(minRole)) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900", children: /*#__PURE__*/
        _jsxDEV("div", { className: "text-center", children: [/*#__PURE__*/
          _jsxDEV("h1", { className: "text-2xl font-bold text-red-600", children: "Access Denied" }, void 0, false), /*#__PURE__*/
          _jsxDEV("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "You do not have permission to access this page." }, void 0, false

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-500", children: ["Required role: ",
            minRole] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ));

  }

  return /*#__PURE__*/_jsxDEV(_Fragment, { children: children }, void 0, false);
}
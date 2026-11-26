import { useState, useEffect, useCallback } from 'react';
import { logger } from '../../utils/logger';
import {
  UserIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  EyeIcon,
  ClockIcon,
  EnvelopeIcon,
  IdentificationIcon,
  AdjustmentsHorizontalIcon } from
'@heroicons/react/24/outline';
import { authApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import PermissionsInfo from '../common/PermissionsInfo';
import { UserTableSkeleton, ConnectionError, EmptyState, PermissionDenied } from '../common/LoadingStates';import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";

















// Matrix permission structure for visual grid display
// Each category has actions mapped to permission keys
const PERMISSION_MATRIX = {
  columns: [
  { key: 'view', label: 'View', icon: 'eye' },
  { key: 'create', label: 'Create', icon: 'plus' },
  { key: 'edit', label: 'Edit', icon: 'pencil' },
  { key: 'delete', label: 'Delete', icon: 'trash' },
  { key: 'execute', label: 'Execute', icon: 'terminal' },
  { key: 'special', label: 'Special', icon: 'star' }],

  rows: [
  {
    category: 'Kubernetes',
    prefix: 'k8s',
    color: 'blue',
    permissions: {
      view: 'k8s.view',
      create: 'k8s.create',
      edit: 'k8s.edit',
      delete: 'k8s.delete',
      execute: 'k8s.exec',
      special: 'k8s.logs' // View Logs
    },
    specialLabel: 'Logs'
  },
  {
    category: 'GitOps (ArgoCD)',
    prefix: 'argocd',
    color: 'orange',
    permissions: {
      view: 'argocd.view',
      create: 'argocd.create',
      edit: 'argocd.sync', // Sync is like edit
      delete: 'argocd.delete',
      execute: null,
      special: 'argocd.rollback'
    },
    specialLabel: 'Rollback'
  },
  {
    category: 'Helm',
    prefix: 'helm',
    color: 'purple',
    permissions: {
      view: 'helm.view',
      create: 'helm.install',
      edit: 'helm.upgrade',
      delete: 'helm.uninstall',
      execute: null,
      special: null
    },
    specialLabel: null
  },
  {
    category: 'Security',
    prefix: 'security',
    color: 'red',
    permissions: {
      view: 'security.view',
      create: null,
      edit: 'security.config',
      delete: null,
      execute: 'security.scan',
      special: null
    },
    specialLabel: null
  },
  {
    category: 'Admin',
    prefix: 'admin',
    color: 'gray',
    permissions: {
      view: 'admin.audit', // Audit logs is view
      create: 'admin.users',
      edit: 'admin.roles',
      delete: null,
      execute: null,
      special: 'admin.clusters'
    },
    specialLabel: 'Clusters'
  }]

};

// Flatten for legacy compatibility
const PERMISSION_CATEGORIES = [
{
  name: 'Kubernetes',
  permissions: [
  { key: 'k8s.view', label: 'View Resources' },
  { key: 'k8s.create', label: 'Create Resources' },
  { key: 'k8s.edit', label: 'Edit Resources' },
  { key: 'k8s.delete', label: 'Delete Resources' },
  { key: 'k8s.exec', label: 'Execute Commands' },
  { key: 'k8s.logs', label: 'View Logs' }]

},
{
  name: 'GitOps',
  permissions: [
  { key: 'argocd.view', label: 'View Apps' },
  { key: 'argocd.sync', label: 'Sync Apps' },
  { key: 'argocd.create', label: 'Create Apps' },
  { key: 'argocd.delete', label: 'Delete Apps' },
  { key: 'argocd.rollback', label: 'Rollback' }]

},
{
  name: 'Helm',
  permissions: [
  { key: 'helm.view', label: 'View Releases' },
  { key: 'helm.install', label: 'Install' },
  { key: 'helm.upgrade', label: 'Upgrade' },
  { key: 'helm.uninstall', label: 'Uninstall' }]

},
{
  name: 'Security',
  permissions: [
  { key: 'security.view', label: 'View Scans' },
  { key: 'security.scan', label: 'Run Scans' },
  { key: 'security.config', label: 'Configure' }]

},
{
  name: 'Admin',
  permissions: [
  { key: 'admin.users', label: 'User Management' },
  { key: 'admin.roles', label: 'Role Management' },
  { key: 'admin.clusters', label: 'Cluster Management' },
  { key: 'admin.audit', label: 'Audit Logs' }]

}];


// Default role permissions
const DEFAULT_ROLE_PERMISSIONS = {
  admin: ['*'],
  developer: [
  'k8s.view', 'k8s.create', 'k8s.edit', 'k8s.delete', 'k8s.exec', 'k8s.logs',
  'argocd.view', 'argocd.sync', 'argocd.create', 'argocd.rollback',
  'helm.view', 'helm.install', 'helm.upgrade',
  'security.view', 'security.scan'],

  operator: [
  'k8s.view', 'k8s.edit', 'k8s.exec', 'k8s.logs',
  'argocd.view', 'argocd.sync', 'argocd.rollback',
  'helm.view', 'helm.upgrade',
  'security.view'],

  viewer: ['k8s.view', 'k8s.logs', 'argocd.view', 'helm.view', 'security.view']
};

const ROLES = [
{ value: 'admin', label: 'Admin', color: 'red', description: 'Full system access' },
{ value: 'developer', label: 'Developer', color: 'blue', description: 'Deploy and manage applications' },
{ value: 'operator', label: 'Operator', color: 'yellow', description: 'Monitor and operate systems' },
{ value: 'viewer', label: 'Viewer', color: 'gray', description: 'Read-only access' }];


export default function UserManagement() {
  const { user: currentUser, hasRole } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    role: 'viewer'
  });
  const [editForm, setEditForm] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Custom permissions state
  const [userPermissions, setUserPermissions] = useState([]);
  const [useCustomPermissions, setUseCustomPermissions] = useState(false);

  // Create user with permissions state
  const [createUseCustomPermissions, setCreateUseCustomPermissions] = useState(false);
  const [createUserPermissions, setCreateUserPermissions] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authApi.listUsers();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      logger.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      const response = await authApi.createUser(createForm);
      const newUserId = response.data.id;

      // If custom permissions are enabled, set them after user creation
      if (createUseCustomPermissions && createUserPermissions.length > 0) {
        try {
          await authApi.setUserPermissions(newUserId, {
            use_custom_permissions: true,
            permissions: createUserPermissions
          });
          toast.success('User Created', `${createForm.username} created with custom permissions`);
        } catch {
          toast.warning('Partial Success', `${createForm.username} created, but failed to set permissions`);
        }
      } else {
        toast.success('User Created', `${createForm.username} has been created successfully`);
      }

      setShowCreateModal(false);
      setCreateForm({
        username: '',
        email: '',
        full_name: '',
        password: '',
        role: 'viewer'
      });
      setCreateUseCustomPermissions(false);
      setCreateUserPermissions([]);
      fetchUsers();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create user';
      setFormError(errorMsg);
      toast.error('Creation Failed', errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setFormError(null);
    setFormLoading(true);
    const username = selectedUser.username;

    try {
      await authApi.updateUser(selectedUser.id, editForm);
      setShowEditModal(false);
      setSelectedUser(null);
      setEditForm({});
      toast.success('User Updated', `${username}'s profile has been updated`);
      fetchUsers();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update user';
      setFormError(errorMsg);
      toast.error('Update Failed', errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setFormError(null);
    setFormLoading(true);
    const username = selectedUser.username;

    try {
      await authApi.deleteUser(selectedUser.id);
      setShowDeleteModal(false);
      setSelectedUser(null);
      toast.success('User Deleted', `${username} has been removed`);
      fetchUsers();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete user';
      setFormError(errorMsg);
      toast.error('Deletion Failed', errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setFormError(null);
    setFormLoading(true);
    const username = selectedUser.username;

    try {
      await authApi.resetUserPassword(selectedUser.id, { new_password: newPassword });
      setShowResetPasswordModal(false);
      setSelectedUser(null);
      setNewPassword('');
      toast.success('Password Reset', `${username}'s password has been reset`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to reset password';
      setFormError(errorMsg);
      toast.error('Reset Failed', errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;

    setFormLoading(true);
    setFormError(null);
    const username = selectedUser.username;

    try {
      await authApi.setUserPermissions(selectedUser.id, {
        use_custom_permissions: useCustomPermissions,
        permissions: useCustomPermissions ? userPermissions : []
      });

      if (useCustomPermissions) {
        toast.success('Permissions Updated', `Custom permissions saved for ${username}`);
      } else {
        toast.info('Permissions Reset', `${username} now uses role-based permissions`);
      }

      // Refresh users list to get updated permissions
      await fetchUsers();

      setShowPermissionsModal(false);
      setSelectedUser(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save permissions';
      setFormError(errorMsg);
      toast.error('Save Failed', errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      email: user.email || '',
      full_name: user.full_name || '',
      role: user.role,
      is_active: user.is_active
    });
    setFormError(null);
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setFormError(null);
    setShowDeleteModal(true);
  };

  const openResetPasswordModal = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setFormError(null);
    setShowResetPasswordModal(true);
  };

  const openProfileModal = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const openPermissionsModal = async (user) => {
    setSelectedUser(user);
    setFormError(null);
    setFormLoading(true);

    try {
      // Fetch user permissions from API
      const response = await authApi.getUserPermissions(user.id);
      setUseCustomPermissions(response.data.use_custom_permissions);
      setUserPermissions(response.data.permissions);
      setShowPermissionsModal(true);
    } catch (err) {
      // Fall back to local data if API fails
      const hasCustom = user.use_custom_permissions || false;
      setUseCustomPermissions(hasCustom);
      setUserPermissions(
        hasCustom && user.custom_permissions ?
        user.custom_permissions :
        DEFAULT_ROLE_PERMISSIONS[user.role] || []
      );
      setShowPermissionsModal(true);
    } finally {
      setFormLoading(false);
    }
  };

  const togglePermission = (permission) => {
    setUserPermissions((prev) =>
    prev.includes(permission) ?
    prev.filter((p) => p !== permission) :
    [...prev, permission]
    );
  };

  const toggleCreatePermission = (permission) => {
    setCreateUserPermissions((prev) =>
    prev.includes(permission) ?
    prev.filter((p) => p !== permission) :
    [...prev, permission]
    );
  };

  const getRoleColor = (role) => {
    const roleConfig = ROLES.find((r) => r.value === role);
    switch (roleConfig?.color) {
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
      case 'admin':
        return 'border-red-500';
      case 'developer':
        return 'border-blue-500';
      case 'operator':
        return 'border-yellow-500';
      default:
        return 'border-gray-500';
    }
  };

  if (!hasRole('admin')) {
    return (/*#__PURE__*/
      _jsxDEV("div", { className: "p-6", children: /*#__PURE__*/
        _jsxDEV(PermissionDenied, {
          resource: "User Management",
          requiredRole: "Administrator" }, void 0, false
        ) }, void 0, false
      ));

  }

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "p-6 space-y-6", children: [

      currentUser && /*#__PURE__*/
      _jsxDEV("div", { className: "bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-blue-500/10 dark:from-primary-900/30 dark:via-purple-900/30 dark:to-blue-900/30 rounded-xl border border-primary-200 dark:border-primary-800/50 p-4 shadow-sm", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-col sm:flex-row sm:items-center gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 via-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-primary-500/30", children: /*#__PURE__*/
              _jsxDEV("span", { className: "text-2xl font-bold text-white", children:
                currentUser.username.charAt(0).toUpperCase() }, void 0, false
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV("h2", { className: "text-lg font-bold text-gray-900 dark:text-white", children:
                  currentUser.full_name || currentUser.username }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("span", { className: "px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 uppercase", children:
                  currentUser.role }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("span", { className: "px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300", children: "Logged In" }, void 0, false

                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["@", currentUser.username] }, void 0, true),
              currentUser.email && /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5", children: [/*#__PURE__*/
                _jsxDEV(EnvelopeIcon, { className: "h-3.5 w-3.5" }, void 0, false),
                currentUser.email] }, void 0, true
              )] }, void 0, true

            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "sm:ml-auto flex flex-wrap gap-2", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "px-3 py-1.5 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "User ID" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm font-mono text-gray-700 dark:text-gray-300", children: [currentUser.id.slice(0, 8), "..."] }, void 0, true)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "px-3 py-1.5 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Permissions" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children:
                currentUser.role === 'admin' ? 'Full Access' : currentUser.use_custom_permissions ? 'Custom' : 'Role-based' }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "px-3 py-1.5 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Total Users" }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm font-bold text-primary-600 dark:text-primary-400", children: users.length }, void 0, false)] }, void 0, true
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ), /*#__PURE__*/



      _jsxDEV("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [/*#__PURE__*/
        _jsxDEV("div", { children: [/*#__PURE__*/
          _jsxDEV("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(UserIcon, { className: "h-7 w-7 text-primary-600" }, void 0, false), "User Management"] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400 mt-1", children: "Manage users, roles, and permissions" }, void 0, false

          )] }, void 0, true
        ), /*#__PURE__*/
        _jsxDEV("button", {
          onClick: () => {
            setFormError(null);
            setShowCreateModal(true);
          },
          className: "inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors shadow-sm", children: [/*#__PURE__*/

          _jsxDEV(PlusIcon, { className: "h-5 w-5 mr-2" }, void 0, false), "Add User"] }, void 0, true

        )] }, void 0, true
      ), /*#__PURE__*/


      _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4", children: /*#__PURE__*/
        _jsxDEV("div", { className: "flex flex-col sm:flex-row gap-4", children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex-1 relative", children: [/*#__PURE__*/
            _jsxDEV(MagnifyingGlassIcon, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" }, void 0, false), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              placeholder: "Search users...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("select", {
            value: selectedRole,
            onChange: (e) => setSelectedRole(e.target.value),
            className: "px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent", children: [/*#__PURE__*/

            _jsxDEV("option", { value: "all", children: "All Roles" }, void 0, false),
            ROLES.map((role) => /*#__PURE__*/
            _jsxDEV("option", { value: role.value, children:
              role.label }, role.value, false
            )
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ),


      error && /*#__PURE__*/
      _jsxDEV(ConnectionError, {
        service: "User Management API",
        onRetry: fetchUsers,
        retrying: loading }, void 0, false
      ),



      loading ? /*#__PURE__*/
      _jsxDEV(UserTableSkeleton, {}, void 0, false) : /*#__PURE__*/

      _jsxDEV("div", { className: "bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden", children:
        filteredUsers.length === 0 ? /*#__PURE__*/
        _jsxDEV(EmptyState, {
          title: "No users found",
          message: searchQuery || selectedRole !== 'all' ?
          "Try adjusting your search or filter criteria" :
          "Get started by creating the first user",

          icon: /*#__PURE__*/_jsxDEV(UserIcon, { className: "h-8 w-8" }, void 0, false),
          action: searchQuery || selectedRole !== 'all' ? {
            label: 'Clear Filters',
            onClick: () => {
              setSearchQuery('');
              setSelectedRole('all');
            }
          } : {
            label: 'Add User',
            onClick: () => setShowCreateModal(true)
          } }, void 0, false
        ) : /*#__PURE__*/

        _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
          _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
            _jsxDEV("thead", { className: "bg-gray-50 dark:bg-slate-700", children: /*#__PURE__*/
              _jsxDEV("tr", { children: [/*#__PURE__*/
                _jsxDEV("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "User" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: /*#__PURE__*/
                  _jsxDEV("span", { className: "flex items-center gap-1.5", children: ["Role", /*#__PURE__*/

                    _jsxDEV(PermissionsInfo, { iconOnly: true, buttonClassName: "text-gray-400 hover:text-primary-500" }, void 0, false)] }, void 0, true
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Status" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Last Login" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Actions" }, void 0, false

                )] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("tbody", { className: "divide-y divide-gray-200 dark:divide-slate-700", children:
              filteredUsers.map((user) => /*#__PURE__*/
              _jsxDEV("tr", { className: "hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors", children: [/*#__PURE__*/
                _jsxDEV("td", { className: "px-6 py-4 whitespace-nowrap", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center", children: [/*#__PURE__*/
                    _jsxDEV("button", {
                      onClick: () => openProfileModal(user),
                      className: "h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center hover:ring-2 hover:ring-primary-500 transition-all", children: /*#__PURE__*/

                      _jsxDEV("span", { className: "text-primary-600 dark:text-primary-400 font-medium", children:
                        user.username.charAt(0).toUpperCase() }, void 0, false
                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("div", { className: "ml-4", children: [/*#__PURE__*/
                      _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                        _jsxDEV("button", {
                          onClick: () => openProfileModal(user),
                          className: "text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400", children:

                          user.username }, void 0, false
                        ),
                        user.id === currentUser?.id && /*#__PURE__*/
                        _jsxDEV("span", { className: "text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-2 py-0.5 rounded", children: "You" }, void 0, false

                        ),

                        user.use_custom_permissions && /*#__PURE__*/
                        _jsxDEV("span", { className: "text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded", children: "Custom" }, void 0, false

                        )] }, void 0, true

                      ), /*#__PURE__*/
                      _jsxDEV("div", { className: "text-sm text-gray-500 dark:text-gray-400", children:
                        user.email || user.full_name || 'No email' }, void 0, false
                      )] }, void 0, true
                    )] }, void 0, true
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "px-6 py-4 whitespace-nowrap", children: /*#__PURE__*/
                  _jsxDEV("span", {
                    className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                      user.role
                    )}`, children:

                    ROLES.find((r) => r.value === user.role)?.label || user.role }, void 0, false
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "px-6 py-4 whitespace-nowrap", children:
                  user.is_active ? /*#__PURE__*/
                  _jsxDEV("span", { className: "inline-flex items-center gap-1 text-green-600 dark:text-green-400", children: [/*#__PURE__*/
                    _jsxDEV(CheckCircleIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm", children: "Active" }, void 0, false)] }, void 0, true
                  ) : /*#__PURE__*/

                  _jsxDEV("span", { className: "inline-flex items-center gap-1 text-red-600 dark:text-red-400", children: [/*#__PURE__*/
                    _jsxDEV(XCircleIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
                    _jsxDEV("span", { className: "text-sm", children: "Inactive" }, void 0, false)] }, void 0, true
                  ) }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400", children:
                  user.last_login ?
                  new Date(user.last_login).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) :
                  'Never' }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("td", { className: "px-6 py-4 whitespace-nowrap text-right", children: /*#__PURE__*/
                  _jsxDEV("div", { className: "flex items-center justify-end gap-1", children: [/*#__PURE__*/
                    _jsxDEV("button", {
                      onClick: () => openProfileModal(user),
                      className: "p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors",
                      title: "View profile", children: /*#__PURE__*/

                      _jsxDEV(EyeIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("button", {
                      onClick: () => openPermissionsModal(user),
                      className: "p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors",
                      title: "Manage permissions", children: /*#__PURE__*/

                      _jsxDEV(AdjustmentsHorizontalIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("button", {
                      onClick: () => openEditModal(user),
                      className: "p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors",
                      title: "Edit user", children: /*#__PURE__*/

                      _jsxDEV(PencilSquareIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("button", {
                      onClick: () => openResetPasswordModal(user),
                      disabled: user.id === currentUser?.id,
                      className: "p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                      title: "Reset password", children: /*#__PURE__*/

                      _jsxDEV(KeyIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("button", {
                      onClick: () => openDeleteModal(user),
                      disabled: user.id === currentUser?.id,
                      className: "p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                      title: "Delete user", children: /*#__PURE__*/

                      _jsxDEV(TrashIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
                    )] }, void 0, true
                  ) }, void 0, false
                )] }, user.id, true
              )
              ) }, void 0, false
            )] }, void 0, true
          ) }, void 0, false
        ) }, void 0, false

      ),



      showProfileModal && selectedUser && /*#__PURE__*/
      _jsxDEV(Modal, { title: "User Profile", onClose: () => setShowProfileModal(false), size: "lg", children: /*#__PURE__*/
        _jsxDEV("div", { className: "space-y-6", children: [/*#__PURE__*/

          _jsxDEV("div", { className: "flex items-center gap-4 p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl", children: [/*#__PURE__*/
            _jsxDEV("div", { className: `w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg border-4 ${getRoleBorderColor(selectedUser.role)}`, children: /*#__PURE__*/
              _jsxDEV("span", { className: "text-white font-bold text-2xl", children:
                selectedUser.username.charAt(0).toUpperCase() }, void 0, false
              ) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                _jsxDEV("h3", { className: "text-xl font-bold text-gray-900 dark:text-white", children:
                  selectedUser.full_name || selectedUser.username }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("span", { className: `px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`, children:
                  ROLES.find((r) => r.value === selectedUser.role)?.label }, void 0, false
                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-gray-500 dark:text-gray-400", children: ["@", selectedUser.username] }, void 0, true)] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "text-right", children:
              selectedUser.is_active ? /*#__PURE__*/
              _jsxDEV("span", { className: "inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse" }, void 0, false), "Active"] }, void 0, true

              ) : /*#__PURE__*/

              _jsxDEV("span", { className: "inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "w-2 h-2 bg-red-500 rounded-full" }, void 0, false), "Inactive"] }, void 0, true

              ) }, void 0, false

            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1", children: [/*#__PURE__*/
                _jsxDEV(IdentificationIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-xs uppercase tracking-wide font-medium", children: "User ID" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm font-mono text-gray-900 dark:text-white truncate", children:
                selectedUser.id }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1", children: [/*#__PURE__*/
                _jsxDEV(EnvelopeIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-xs uppercase tracking-wide font-medium", children: "Email" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-900 dark:text-white", children:
                selectedUser.email || 'Not provided' }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1", children: [/*#__PURE__*/
                _jsxDEV(ClockIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-xs uppercase tracking-wide font-medium", children: "Member Since" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-900 dark:text-white", children:
                selectedUser.created_at ?
                new Date(selectedUser.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }) :
                'Unknown' }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1", children: [/*#__PURE__*/
                _jsxDEV(ClockIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-xs uppercase tracking-wide font-medium", children: "Last Login" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-sm text-gray-900 dark:text-white", children:
                selectedUser.last_login ?
                new Date(selectedUser.last_login).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) :
                'Never' }, void 0, false
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between mb-3", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-2 text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
                _jsxDEV(ShieldCheckIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { className: "text-xs uppercase tracking-wide font-medium", children: "Permissions" }, void 0, false)] }, void 0, true
              ),
              selectedUser.use_custom_permissions && /*#__PURE__*/
              _jsxDEV("span", { className: "text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded", children: "Custom Permissions" }, void 0, false

              )] }, void 0, true

            ), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-gray-600 dark:text-gray-300 mb-2", children:
              selectedUser.role === 'admin' ?
              'Full system access with all permissions' :
              `${(selectedUser.custom_permissions || DEFAULT_ROLE_PERMISSIONS[selectedUser.role] || []).length} permissions granted` }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => {
                setShowProfileModal(false);
                openPermissionsModal(selectedUser);
              },
              className: "text-sm text-primary-600 dark:text-primary-400 hover:underline", children:
              "View & Edit Permissions" }, void 0, false

            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => {
                setShowProfileModal(false);
                openEditModal(selectedUser);
              },
              className: "px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors", children:
              "Edit Profile" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => setShowProfileModal(false),
              className: "px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors", children:
              "Close" }, void 0, false

            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ),



      showPermissionsModal && selectedUser && /*#__PURE__*/
      _jsxDEV(Modal, {
        title: `Permission Matrix: ${selectedUser.username}`,
        onClose: () => setShowPermissionsModal(false),
        size: "xl", children: /*#__PURE__*/

        _jsxDEV("div", { className: "space-y-4", children: [
          formError && /*#__PURE__*/_jsxDEV(ErrorAlert, { message: formError }, void 0, false), /*#__PURE__*/


          _jsxDEV("div", { className: "flex items-center gap-3 p-3 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg", children: [/*#__PURE__*/
            _jsxDEV("div", { className: `w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center`, children: /*#__PURE__*/
              _jsxDEV("span", { className: "text-white font-bold", children: selectedUser.username.charAt(0).toUpperCase() }, void 0, false) }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("div", { className: "flex-1", children: [/*#__PURE__*/
              _jsxDEV("p", { className: "font-medium text-gray-900 dark:text-white", children: selectedUser.full_name || selectedUser.username }, void 0, false), /*#__PURE__*/
              _jsxDEV("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: ["Role: ", /*#__PURE__*/
                _jsxDEV("span", { className: `font-medium px-1.5 py-0.5 rounded ${getRoleColor(selectedUser.role)}`, children:
                  ROLES.find((r) => r.value === selectedUser.role)?.label }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-slate-600", children: /*#__PURE__*/
            _jsxDEV("label", { className: "flex items-center justify-between cursor-pointer", children: [/*#__PURE__*/
              _jsxDEV("div", { children: [/*#__PURE__*/
                _jsxDEV("p", { className: "font-medium text-gray-900 dark:text-white flex items-center gap-2", children: [/*#__PURE__*/
                  _jsxDEV(AdjustmentsHorizontalIcon, { className: "h-5 w-5 text-purple-500" }, void 0, false), "Enable Custom Permissions"] }, void 0, true

                ), /*#__PURE__*/
                _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-1", children: "Override role defaults and assign granular permissions per category" }, void 0, false

                )] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
                _jsxDEV("input", {
                  type: "checkbox",
                  checked: useCustomPermissions,
                  onChange: (e) => {
                    setUseCustomPermissions(e.target.checked);
                    if (!e.target.checked) {
                      setUserPermissions(DEFAULT_ROLE_PERMISSIONS[selectedUser.role] || []);
                    }
                  },
                  className: "sr-only" }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("div", { className: `w-14 h-7 rounded-full transition-colors ${useCustomPermissions ? 'bg-purple-600' : 'bg-gray-300 dark:bg-slate-600'}`, children: /*#__PURE__*/
                  _jsxDEV("div", { className: `w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform ${useCustomPermissions ? 'translate-x-7' : 'translate-x-0.5'} mt-0.5` }, void 0, false) }, void 0, false
                )] }, void 0, true
              )] }, void 0, true
            ) }, void 0, false
          ),

          !useCustomPermissions && /*#__PURE__*/
          _jsxDEV("div", { className: "p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-2", children: [/*#__PURE__*/
            _jsxDEV(ShieldCheckIcon, { className: "h-5 w-5 text-blue-500 flex-shrink-0" }, void 0, false), /*#__PURE__*/
            _jsxDEV("p", { className: "text-sm text-blue-700 dark:text-blue-300", children: ["Using default ", /*#__PURE__*/
              _jsxDEV("span", { className: "font-semibold", children: ROLES.find((r) => r.value === selectedUser.role)?.label }, void 0, false), " role permissions. Enable custom permissions above to modify individual access."] }, void 0, true

            )] }, void 0, true
          ), /*#__PURE__*/



          _jsxDEV("div", { className: "border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "overflow-x-auto", children: /*#__PURE__*/
              _jsxDEV("table", { className: "w-full", children: [/*#__PURE__*/
                _jsxDEV("thead", { children: /*#__PURE__*/
                  _jsxDEV("tr", { className: "bg-gray-100 dark:bg-slate-700", children: [/*#__PURE__*/
                    _jsxDEV("th", { className: "px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-r border-gray-200 dark:border-slate-600 sticky left-0 bg-gray-100 dark:bg-slate-700 z-10 min-w-[140px]", children: "Category" }, void 0, false

                    ),
                    PERMISSION_MATRIX.columns.map((col) => /*#__PURE__*/
                    _jsxDEV("th", {

                      className: "px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-slate-600 min-w-[80px]", children: /*#__PURE__*/

                      _jsxDEV("div", { className: "flex flex-col items-center gap-1", children: [
                        col.key === 'view' && /*#__PURE__*/_jsxDEV(EyeIcon, { className: "h-4 w-4" }, void 0, false),
                        col.key === 'create' && /*#__PURE__*/_jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false),
                        col.key === 'edit' && /*#__PURE__*/_jsxDEV(PencilSquareIcon, { className: "h-4 w-4" }, void 0, false),
                        col.key === 'delete' && /*#__PURE__*/_jsxDEV(TrashIcon, { className: "h-4 w-4" }, void 0, false),
                        col.key === 'execute' && /*#__PURE__*/_jsxDEV(KeyIcon, { className: "h-4 w-4" }, void 0, false),
                        col.key === 'special' && /*#__PURE__*/_jsxDEV(ShieldCheckIcon, { className: "h-4 w-4" }, void 0, false), /*#__PURE__*/
                        _jsxDEV("span", { children: col.label }, void 0, false)] }, void 0, true
                      ) }, col.key, false
                    )
                    ), /*#__PURE__*/
                    _jsxDEV("th", { className: "px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-slate-600 min-w-[60px]", children: "All" }, void 0, false

                    )] }, void 0, true
                  ) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("tbody", { children:
                  PERMISSION_MATRIX.rows.map((row, rowIndex) => {
                    const rowPermKeys = Object.values(row.permissions).filter(Boolean);
                    const allRowChecked = rowPermKeys.every((p) => userPermissions.includes('*') || userPermissions.includes(p));
                    const someRowChecked = rowPermKeys.some((p) => userPermissions.includes('*') || userPermissions.includes(p));

                    return (/*#__PURE__*/
                      _jsxDEV("tr", {

                        className: `${rowIndex % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-800/50'} hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors`, children: [/*#__PURE__*/

                        _jsxDEV("td", { className: `px-4 py-3 border-r border-gray-200 dark:border-slate-600 sticky left-0 z-10 ${rowIndex % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-800/50'}`, children: /*#__PURE__*/
                          _jsxDEV("div", { className: "flex items-center gap-2", children: [/*#__PURE__*/
                            _jsxDEV("div", { className: `w-3 h-3 rounded-full bg-${row.color}-500`, style: {
                                backgroundColor: row.color === 'blue' ? '#7395AE' :
                                row.color === 'orange' ? '#F59E0B' :
                                row.color === 'purple' ? '#557A95' :
                                row.color === 'red' ? '#EF4444' : '#5D5C61'
                              } }, void 0, false), /*#__PURE__*/
                            _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white text-sm", children:
                              row.category }, void 0, false
                            )] }, void 0, true
                          ) }, void 0, false
                        ),
                        PERMISSION_MATRIX.columns.map((col) => {
                          const permKey = row.permissions[col.key];
                          const isChecked = permKey ? userPermissions.includes('*') || userPermissions.includes(permKey) : false;
                          const isDisabled = !useCustomPermissions || userPermissions.includes('*') || !permKey;
                          const tooltipLabel = col.key === 'special' && row.specialLabel ? row.specialLabel : null;

                          return (/*#__PURE__*/
                            _jsxDEV("td", { className: "px-3 py-3 text-center border-gray-200 dark:border-slate-600", children:
                              permKey ? /*#__PURE__*/
                              _jsxDEV("div", { className: "flex flex-col items-center", children: [/*#__PURE__*/
                                _jsxDEV("label", { className: `relative inline-flex items-center ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`, children: [/*#__PURE__*/
                                  _jsxDEV("input", {
                                    type: "checkbox",
                                    checked: isChecked,
                                    disabled: isDisabled,
                                    onChange: () => permKey && togglePermission(permKey),
                                    className: "sr-only" }, void 0, false
                                  ), /*#__PURE__*/
                                  _jsxDEV("div", { className: `w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                                    isChecked ?
                                    'bg-green-500 text-white shadow-sm' :
                                    'bg-gray-200 dark:bg-slate-600 text-gray-400 dark:text-slate-400'} ${
                                    isDisabled ? 'opacity-50' : 'hover:scale-110'}`, children:
                                    isChecked ? /*#__PURE__*/
                                    _jsxDEV(CheckCircleIcon, { className: "h-4 w-4" }, void 0, false) : /*#__PURE__*/

                                    _jsxDEV(XCircleIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false

                                  )] }, void 0, true
                                ),
                                tooltipLabel && /*#__PURE__*/
                                _jsxDEV("span", { className: "text-[10px] text-gray-400 dark:text-gray-500 mt-0.5", children: tooltipLabel }, void 0, false)] }, void 0, true

                              ) : /*#__PURE__*/

                              _jsxDEV("span", { className: "text-gray-300 dark:text-slate-600", children: "—" }, void 0, false) }, col.key, false

                            ));

                        }), /*#__PURE__*/
                        _jsxDEV("td", { className: "px-3 py-3 text-center border-gray-200 dark:border-slate-600", children: /*#__PURE__*/
                          _jsxDEV("label", { className: `relative inline-flex items-center ${!useCustomPermissions ? 'cursor-not-allowed' : 'cursor-pointer'}`, children: [/*#__PURE__*/
                            _jsxDEV("input", {
                              type: "checkbox",
                              checked: allRowChecked,
                              disabled: !useCustomPermissions || userPermissions.includes('*'),
                              onChange: () => {
                                if (allRowChecked) {
                                  setUserPermissions((prev) => prev.filter((p) => !rowPermKeys.includes(p)));
                                } else {
                                  setUserPermissions((prev) => [...new Set([...prev, ...rowPermKeys])]);
                                }
                              },
                              className: "sr-only" }, void 0, false
                            ), /*#__PURE__*/
                            _jsxDEV("div", { className: `w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                              allRowChecked ?
                              'bg-purple-500 text-white shadow-sm' :
                              someRowChecked ?
                              'bg-purple-200 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300' :
                              'bg-gray-200 dark:bg-slate-600 text-gray-400'} ${
                              !useCustomPermissions ? 'opacity-50' : 'hover:scale-110'}`, children:
                              allRowChecked ? /*#__PURE__*/
                              _jsxDEV(CheckCircleIcon, { className: "h-4 w-4" }, void 0, false) :
                              someRowChecked ? /*#__PURE__*/
                              _jsxDEV("div", { className: "w-2 h-2 bg-current rounded-sm" }, void 0, false) : /*#__PURE__*/

                              _jsxDEV(XCircleIcon, { className: "h-4 w-4" }, void 0, false) }, void 0, false

                            )] }, void 0, true
                          ) }, void 0, false
                        )] }, row.category, true
                      ));

                  }) }, void 0, false
                )] }, void 0, true
              ) }, void 0, false
            ), /*#__PURE__*/


            _jsxDEV("div", { className: "px-4 py-2 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-200 dark:border-slate-600 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400", children: [/*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-1.5", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "w-4 h-4 rounded bg-green-500 flex items-center justify-center", children: /*#__PURE__*/
                  _jsxDEV(CheckCircleIcon, { className: "h-3 w-3 text-white" }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("span", { children: "Granted" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-1.5", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "w-4 h-4 rounded bg-gray-200 dark:bg-slate-600 flex items-center justify-center", children: /*#__PURE__*/
                  _jsxDEV(XCircleIcon, { className: "h-3 w-3 text-gray-400" }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("span", { children: "Denied" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-1.5", children: [/*#__PURE__*/
                _jsxDEV("span", { className: "text-gray-300 dark:text-slate-600", children: "—" }, void 0, false), /*#__PURE__*/
                _jsxDEV("span", { children: "N/A" }, void 0, false)] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("div", { className: "flex items-center gap-1.5", children: [/*#__PURE__*/
                _jsxDEV("div", { className: "w-4 h-4 rounded bg-purple-500 flex items-center justify-center", children: /*#__PURE__*/
                  _jsxDEV(CheckCircleIcon, { className: "h-3 w-3 text-white" }, void 0, false) }, void 0, false
                ), /*#__PURE__*/
                _jsxDEV("span", { children: "Row All" }, void 0, false)] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true
          ),


          useCustomPermissions && /*#__PURE__*/
          _jsxDEV("div", { className: "flex flex-wrap gap-2 pt-2", children: [/*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => {
                const allPerms = PERMISSION_CATEGORIES.flatMap((c) => c.permissions.map((p) => p.key));
                setUserPermissions(allPerms);
              },
              className: "text-xs px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors font-medium", children:
              "Grant All" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => setUserPermissions([]),
              className: "text-xs px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium", children:
              "Revoke All" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => setUserPermissions(DEFAULT_ROLE_PERMISSIONS[selectedUser.role] || []),
              className: "text-xs px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors font-medium", children: [
              "Reset to ",
              ROLES.find((r) => r.value === selectedUser.role)?.label, " Default"] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => {
                // Grant view-only permissions
                const viewPerms = PERMISSION_MATRIX.rows.
                map((r) => r.permissions.view).
                filter(Boolean);
                setUserPermissions(viewPerms);
              },
              className: "text-xs px-3 py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-medium", children:
              "View Only" }, void 0, false

            )] }, void 0, true
          ), /*#__PURE__*/



          _jsxDEV("div", { className: "p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg", children: /*#__PURE__*/
            _jsxDEV("div", { className: "flex items-center justify-between", children: [/*#__PURE__*/
              _jsxDEV("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
                useCustomPermissions ? 'Custom' : 'Role-based', " permissions:"] }, void 0, true
              ), /*#__PURE__*/
              _jsxDEV("span", { className: "text-sm font-semibold text-gray-900 dark:text-white", children:
                userPermissions.includes('*') ? 'Full Access' : `${userPermissions.length} permissions` }, void 0, false
              )] }, void 0, true
            ) }, void 0, false
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
            _jsxDEV("button", {
              onClick: () => setShowPermissionsModal(false),
              disabled: formLoading,
              className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50", children:
              "Cancel" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: handleSavePermissions,
              disabled: formLoading,
              className: "px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2", children:

              formLoading ? /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV("svg", { className: "animate-spin h-4 w-4", viewBox: "0 0 24 24", children: [/*#__PURE__*/
                  _jsxDEV("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }, void 0, false)] }, void 0, true
                ), "Saving..."] }, void 0, true

              ) : /*#__PURE__*/

              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(ShieldCheckIcon, { className: "h-4 w-4" }, void 0, false), "Save Permissions"] }, void 0, true

              ) }, void 0, false

            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ),



      showCreateModal && /*#__PURE__*/
      _jsxDEV(Modal, { title: "Create New User", onClose: () => setShowCreateModal(false), size: "xl", children: /*#__PURE__*/
        _jsxDEV("form", { onSubmit: handleCreateUser, className: "space-y-4", children: [
          formError && /*#__PURE__*/_jsxDEV(ErrorAlert, { message: formError }, void 0, false), /*#__PURE__*/


          _jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [/*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Username *" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                required: true,
                minLength: 3,
                value: createForm.username,
                onChange: (e) => setCreateForm({ ...createForm, username: e.target.value }),
                className: "w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                placeholder: "Enter username" }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Email" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("input", {
                type: "email",
                value: createForm.email,
                onChange: (e) => setCreateForm({ ...createForm, email: e.target.value }),
                className: "w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                placeholder: "Enter email" }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Full Name" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("input", {
                type: "text",
                value: createForm.full_name,
                onChange: (e) => setCreateForm({ ...createForm, full_name: e.target.value }),
                className: "w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                placeholder: "Enter full name" }, void 0, false
              )] }, void 0, true
            ), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Password *" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("input", {
                type: "password",
                required: true,
                minLength: 8,
                value: createForm.password,
                onChange: (e) => setCreateForm({ ...createForm, password: e.target.value }),
                className: "w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                placeholder: "Enter password" }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("p", { className: "mt-1 text-xs text-gray-500 dark:text-gray-400", children: "Min 8 chars, uppercase, lowercase, digit, special char" }, void 0, false

              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Role *" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("select", {
              value: createForm.role,
              onChange: (e) => {
                const newRole = e.target.value;
                setCreateForm({ ...createForm, role: newRole });
                // Reset custom permissions when role changes
                if (!createUseCustomPermissions) {
                  setCreateUserPermissions(DEFAULT_ROLE_PERMISSIONS[newRole] || []);
                }
              },
              className: "w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent", children:

              ROLES.map((role) => /*#__PURE__*/
              _jsxDEV("option", { value: role.value, children: [
                role.label, " - ", role.description] }, role.value, true
              )
              ) }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/


          _jsxDEV("div", { className: "border-t border-gray-200 dark:border-slate-700 pt-4", children: [/*#__PURE__*/
            _jsxDEV("div", { className: "p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-slate-600 mb-4", children: /*#__PURE__*/
              _jsxDEV("label", { className: "flex items-center justify-between cursor-pointer", children: [/*#__PURE__*/
                _jsxDEV("div", { children: [/*#__PURE__*/
                  _jsxDEV("p", { className: "font-medium text-gray-900 dark:text-white flex items-center gap-2", children: [/*#__PURE__*/
                    _jsxDEV(AdjustmentsHorizontalIcon, { className: "h-5 w-5 text-purple-500" }, void 0, false), "Set Custom Permissions"] }, void 0, true

                  ), /*#__PURE__*/
                  _jsxDEV("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-0.5", children: ["Override default ",
                    ROLES.find((r) => r.value === createForm.role)?.label, " role permissions"] }, void 0, true
                  )] }, void 0, true
                ), /*#__PURE__*/
                _jsxDEV("div", { className: "relative", children: [/*#__PURE__*/
                  _jsxDEV("input", {
                    type: "checkbox",
                    checked: createUseCustomPermissions,
                    onChange: (e) => {
                      setCreateUseCustomPermissions(e.target.checked);
                      if (!e.target.checked) {
                        setCreateUserPermissions([]);
                      } else {
                        setCreateUserPermissions(DEFAULT_ROLE_PERMISSIONS[createForm.role] || []);
                      }
                    },
                    className: "sr-only" }, void 0, false
                  ), /*#__PURE__*/
                  _jsxDEV("div", { className: `w-12 h-6 rounded-full transition-colors ${createUseCustomPermissions ? 'bg-purple-600' : 'bg-gray-300 dark:bg-slate-600'}`, children: /*#__PURE__*/
                    _jsxDEV("div", { className: `w-5 h-5 bg-white rounded-full shadow transform transition-transform ${createUseCustomPermissions ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5` }, void 0, false) }, void 0, false
                  )] }, void 0, true
                )] }, void 0, true
              ) }, void 0, false
            ),

            createUseCustomPermissions && /*#__PURE__*/
            _jsxDEV(_Fragment, { children: [/*#__PURE__*/

              _jsxDEV("div", { className: "border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden", children: /*#__PURE__*/
                _jsxDEV("div", { className: "overflow-x-auto max-h-64", children: /*#__PURE__*/
                  _jsxDEV("table", { className: "w-full text-sm", children: [/*#__PURE__*/
                    _jsxDEV("thead", { className: "sticky top-0", children: /*#__PURE__*/
                      _jsxDEV("tr", { className: "bg-gray-100 dark:bg-slate-700", children: [/*#__PURE__*/
                        _jsxDEV("th", { className: "px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase border-b border-r border-gray-200 dark:border-slate-600 sticky left-0 bg-gray-100 dark:bg-slate-700 z-10", children: "Category" }, void 0, false

                        ),
                        PERMISSION_MATRIX.columns.map((col) => /*#__PURE__*/
                        _jsxDEV("th", { className: "px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase border-b border-gray-200 dark:border-slate-600 min-w-[60px]", children:
                          col.label }, col.key, false
                        )
                        ), /*#__PURE__*/
                        _jsxDEV("th", { className: "px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase border-b border-gray-200 dark:border-slate-600", children: "All" }, void 0, false

                        )] }, void 0, true
                      ) }, void 0, false
                    ), /*#__PURE__*/
                    _jsxDEV("tbody", { children:
                      PERMISSION_MATRIX.rows.map((row, rowIndex) => {
                        const rowPermKeys = Object.values(row.permissions).filter(Boolean);
                        const allRowChecked = rowPermKeys.every((p) => createUserPermissions.includes(p));
                        const someRowChecked = rowPermKeys.some((p) => createUserPermissions.includes(p));

                        return (/*#__PURE__*/
                          _jsxDEV("tr", { className: `${rowIndex % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-800/50'}`, children: [/*#__PURE__*/
                            _jsxDEV("td", { className: `px-3 py-2 border-r border-gray-200 dark:border-slate-600 sticky left-0 z-10 ${rowIndex % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-800/50'}`, children: /*#__PURE__*/
                              _jsxDEV("div", { className: "flex items-center gap-1.5", children: [/*#__PURE__*/
                                _jsxDEV("div", { className: "w-2 h-2 rounded-full", style: {
                                    backgroundColor: row.color === 'blue' ? '#7395AE' :
                                    row.color === 'orange' ? '#F59E0B' :
                                    row.color === 'purple' ? '#557A95' :
                                    row.color === 'red' ? '#EF4444' : '#5D5C61'
                                  } }, void 0, false), /*#__PURE__*/
                                _jsxDEV("span", { className: "font-medium text-gray-900 dark:text-white text-xs whitespace-nowrap", children:
                                  row.category }, void 0, false
                                )] }, void 0, true
                              ) }, void 0, false
                            ),
                            PERMISSION_MATRIX.columns.map((col) => {
                              const permKey = row.permissions[col.key];
                              const isChecked = permKey ? createUserPermissions.includes(permKey) : false;

                              return (/*#__PURE__*/
                                _jsxDEV("td", { className: "px-2 py-2 text-center", children:
                                  permKey ? /*#__PURE__*/
                                  _jsxDEV("label", { className: "cursor-pointer inline-flex", children: [/*#__PURE__*/
                                    _jsxDEV("input", {
                                      type: "checkbox",
                                      checked: isChecked,
                                      onChange: () => permKey && toggleCreatePermission(permKey),
                                      className: "sr-only" }, void 0, false
                                    ), /*#__PURE__*/
                                    _jsxDEV("div", { className: `w-5 h-5 rounded flex items-center justify-center transition-all ${
                                      isChecked ?
                                      'bg-green-500 text-white' :
                                      'bg-gray-200 dark:bg-slate-600 text-gray-400'} hover:scale-110`, children:

                                      isChecked ? /*#__PURE__*/
                                      _jsxDEV(CheckCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false) : /*#__PURE__*/

                                      _jsxDEV(XCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false) }, void 0, false

                                    )] }, void 0, true
                                  ) : /*#__PURE__*/

                                  _jsxDEV("span", { className: "text-gray-300 dark:text-slate-600 text-xs", children: "—" }, void 0, false) }, col.key, false

                                ));

                            }), /*#__PURE__*/
                            _jsxDEV("td", { className: "px-2 py-2 text-center", children: /*#__PURE__*/
                              _jsxDEV("label", { className: "cursor-pointer inline-flex", children: [/*#__PURE__*/
                                _jsxDEV("input", {
                                  type: "checkbox",
                                  checked: allRowChecked,
                                  onChange: () => {
                                    if (allRowChecked) {
                                      setCreateUserPermissions((prev) => prev.filter((p) => !rowPermKeys.includes(p)));
                                    } else {
                                      setCreateUserPermissions((prev) => [...new Set([...prev, ...rowPermKeys])]);
                                    }
                                  },
                                  className: "sr-only" }, void 0, false
                                ), /*#__PURE__*/
                                _jsxDEV("div", { className: `w-5 h-5 rounded flex items-center justify-center transition-all ${
                                  allRowChecked ?
                                  'bg-purple-500 text-white' :
                                  someRowChecked ?
                                  'bg-purple-200 dark:bg-purple-900/50 text-purple-600' :
                                  'bg-gray-200 dark:bg-slate-600 text-gray-400'} hover:scale-110`, children:

                                  allRowChecked ? /*#__PURE__*/
                                  _jsxDEV(CheckCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false) :
                                  someRowChecked ? /*#__PURE__*/
                                  _jsxDEV("div", { className: "w-1.5 h-1.5 bg-current rounded-sm" }, void 0, false) : /*#__PURE__*/

                                  _jsxDEV(XCircleIcon, { className: "h-3.5 w-3.5" }, void 0, false) }, void 0, false

                                )] }, void 0, true
                              ) }, void 0, false
                            )] }, row.category, true
                          ));

                      }) }, void 0, false
                    )] }, void 0, true
                  ) }, void 0, false
                ) }, void 0, false
              ), /*#__PURE__*/


              _jsxDEV("div", { className: "flex flex-wrap gap-2 mt-3", children: [/*#__PURE__*/
                _jsxDEV("button", {
                  type: "button",
                  onClick: () => {
                    const allPerms = PERMISSION_CATEGORIES.flatMap((c) => c.permissions.map((p) => p.key));
                    setCreateUserPermissions(allPerms);
                  },
                  className: "text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50", children:
                  "Grant All" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("button", {
                  type: "button",
                  onClick: () => setCreateUserPermissions([]),
                  className: "text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50", children:
                  "Revoke All" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("button", {
                  type: "button",
                  onClick: () => setCreateUserPermissions(DEFAULT_ROLE_PERMISSIONS[createForm.role] || []),
                  className: "text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50", children:
                  "Role Default" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("button", {
                  type: "button",
                  onClick: () => {
                    const viewPerms = PERMISSION_MATRIX.rows.map((r) => r.permissions.view).filter(Boolean);
                    setCreateUserPermissions(viewPerms);
                  },
                  className: "text-xs px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-slate-600", children:
                  "View Only" }, void 0, false

                ), /*#__PURE__*/
                _jsxDEV("span", { className: "ml-auto text-xs text-gray-500 dark:text-gray-400 self-center", children: [
                  createUserPermissions.length, " permissions selected"] }, void 0, true
                )] }, void 0, true
              )] }, void 0, true
            )] }, void 0, true

          ), /*#__PURE__*/

          _jsxDEV("div", { className: "flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700", children: [/*#__PURE__*/
            _jsxDEV("button", {
              type: "button",
              onClick: () => {
                setShowCreateModal(false);
                setCreateUseCustomPermissions(false);
                setCreateUserPermissions([]);
              },
              className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors", children:
              "Cancel" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("button", {
              type: "submit",
              disabled: formLoading,
              className: "px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2", children:

              formLoading ? /*#__PURE__*/
              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV("svg", { className: "animate-spin h-4 w-4", viewBox: "0 0 24 24", children: [/*#__PURE__*/
                  _jsxDEV("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }, void 0, false), /*#__PURE__*/
                  _jsxDEV("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }, void 0, false)] }, void 0, true
                ), "Creating..."] }, void 0, true

              ) : /*#__PURE__*/

              _jsxDEV(_Fragment, { children: [/*#__PURE__*/
                _jsxDEV(PlusIcon, { className: "h-4 w-4" }, void 0, false), "Create User"] }, void 0, true

              ) }, void 0, false

            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ),



      showEditModal && selectedUser && /*#__PURE__*/
      _jsxDEV(Modal, { title: `Edit User: ${selectedUser.username}`, onClose: () => setShowEditModal(false), children: /*#__PURE__*/
        _jsxDEV("form", { onSubmit: handleEditUser, className: "space-y-4", children: [
          formError && /*#__PURE__*/_jsxDEV(ErrorAlert, { message: formError }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Email" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("input", {
              type: "email",
              value: editForm.email || '',
              onChange: (e) => setEditForm({ ...editForm, email: e.target.value }),
              className: "w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent",
              placeholder: "Enter email" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Full Name" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("input", {
              type: "text",
              value: editForm.full_name || '',
              onChange: (e) => setEditForm({ ...editForm, full_name: e.target.value }),
              className: "w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent",
              placeholder: "Enter full name" }, void 0, false
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Role" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("select", {
              value: editForm.role || selectedUser.role,
              onChange: (e) => setEditForm({ ...editForm, role: e.target.value }),
              disabled: selectedUser.id === currentUser?.id,
              className: "w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50", children:

              ROLES.map((role) => /*#__PURE__*/
              _jsxDEV("option", { value: role.value, children:
                role.label }, role.value, false
              )
              ) }, void 0, false
            ),
            selectedUser.id === currentUser?.id && /*#__PURE__*/
            _jsxDEV("p", { className: "mt-1 text-xs text-yellow-600 dark:text-yellow-400", children: "You cannot change your own role" }, void 0, false

            )] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "flex items-center gap-2 cursor-pointer", children: [/*#__PURE__*/
              _jsxDEV("input", {
                type: "checkbox",
                checked: editForm.is_active ?? selectedUser.is_active,
                onChange: (e) => setEditForm({ ...editForm, is_active: e.target.checked }),
                disabled: selectedUser.id === currentUser?.id,
                className: "h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-slate-600 rounded disabled:opacity-50" }, void 0, false
              ), /*#__PURE__*/
              _jsxDEV("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Active Account" }, void 0, false

              )] }, void 0, true
            ),
            selectedUser.id === currentUser?.id && /*#__PURE__*/
            _jsxDEV("p", { className: "mt-1 text-xs text-yellow-600 dark:text-yellow-400", children: "You cannot deactivate your own account" }, void 0, false

            )] }, void 0, true

          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex justify-end gap-3 pt-4", children: [/*#__PURE__*/
            _jsxDEV("button", {
              type: "button",
              onClick: () => setShowEditModal(false),
              className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors", children:
              "Cancel" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("button", {
              type: "submit",
              disabled: formLoading,
              className: "px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50", children:

              formLoading ? 'Saving...' : 'Save Changes' }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ),



      showDeleteModal && selectedUser && /*#__PURE__*/
      _jsxDEV(Modal, { title: "Delete User", onClose: () => setShowDeleteModal(false), children: /*#__PURE__*/
        _jsxDEV("div", { className: "space-y-4", children: [
          formError && /*#__PURE__*/_jsxDEV(ErrorAlert, { message: formError }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg", children: [/*#__PURE__*/
            _jsxDEV(ExclamationTriangleIcon, { className: "h-10 w-10 text-red-500 flex-shrink-0" }, void 0, false), /*#__PURE__*/
            _jsxDEV("div", { children: [/*#__PURE__*/
              _jsxDEV("p", { className: "text-red-800 dark:text-red-200 font-medium", children: "Are you sure you want to delete this user?" }, void 0, false

              ), /*#__PURE__*/
              _jsxDEV("p", { className: "text-red-600 dark:text-red-300 text-sm mt-1", children: ["User ", /*#__PURE__*/
                _jsxDEV("span", { className: "font-semibold", children: selectedUser.username }, void 0, false), " will be permanently deleted. This action cannot be undone."] }, void 0, true

              )] }, void 0, true
            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex justify-end gap-3 pt-4", children: [/*#__PURE__*/
            _jsxDEV("button", {
              type: "button",
              onClick: () => setShowDeleteModal(false),
              className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors", children:
              "Cancel" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: handleDeleteUser,
              disabled: formLoading,
              className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50", children:

              formLoading ? 'Deleting...' : 'Delete User' }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      ),



      showResetPasswordModal && selectedUser && /*#__PURE__*/
      _jsxDEV(Modal, { title: `Reset Password: ${selectedUser.username}`, onClose: () => setShowResetPasswordModal(false), children: /*#__PURE__*/
        _jsxDEV("form", { onSubmit: handleResetPassword, className: "space-y-4", children: [
          formError && /*#__PURE__*/_jsxDEV(ErrorAlert, { message: formError }, void 0, false), /*#__PURE__*/
          _jsxDEV("div", { children: [/*#__PURE__*/
            _jsxDEV("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "New Password *" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("input", {
              type: "password",
              required: true,
              minLength: 8,
              value: newPassword,
              onChange: (e) => setNewPassword(e.target.value),
              className: "w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent",
              placeholder: "Enter new password" }, void 0, false
            ), /*#__PURE__*/
            _jsxDEV("p", { className: "mt-1 text-xs text-gray-500 dark:text-gray-400", children: "Min 8 chars, uppercase, lowercase, digit, special char (!@#$%^&*)" }, void 0, false

            )] }, void 0, true
          ), /*#__PURE__*/
          _jsxDEV("div", { className: "flex justify-end gap-3 pt-4", children: [/*#__PURE__*/
            _jsxDEV("button", {
              type: "button",
              onClick: () => setShowResetPasswordModal(false),
              className: "px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors", children:
              "Cancel" }, void 0, false

            ), /*#__PURE__*/
            _jsxDEV("button", {
              type: "submit",
              disabled: formLoading,
              className: "px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50", children:

              formLoading ? 'Resetting...' : 'Reset Password' }, void 0, false
            )] }, void 0, true
          )] }, void 0, true
        ) }, void 0, false
      )] }, void 0, true

    ));

}

// Reusable Modal Component
function Modal({
  title,
  children,
  onClose,
  size = 'md'





}) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (/*#__PURE__*/
    _jsxDEV("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: /*#__PURE__*/
      _jsxDEV("div", { className: "flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0", children: [/*#__PURE__*/

        _jsxDEV("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-slate-900 dark:bg-opacity-75 transition-opacity", onClick: onClose }, void 0, false), /*#__PURE__*/


        _jsxDEV("div", { className: `relative inline-block w-full ${sizeClasses[size]} p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-800 shadow-xl rounded-2xl`, children: [/*#__PURE__*/
          _jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [/*#__PURE__*/
            _jsxDEV("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: title }, void 0, false), /*#__PURE__*/
            _jsxDEV("button", {
              onClick: onClose,
              className: "p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700", children: /*#__PURE__*/

              _jsxDEV(XMarkIcon, { className: "h-5 w-5" }, void 0, false) }, void 0, false
            )] }, void 0, true
          ),
          children] }, void 0, true
        )] }, void 0, true
      ) }, void 0, false
    ));

}

// Error Alert Component
function ErrorAlert({ message }) {
  return (/*#__PURE__*/
    _jsxDEV("div", { className: "rounded-lg bg-red-50 dark:bg-red-900/30 p-3 border border-red-200 dark:border-red-800", children: /*#__PURE__*/
      _jsxDEV("p", { className: "text-sm text-red-700 dark:text-red-300", children: message }, void 0, false) }, void 0, false
    ));

}
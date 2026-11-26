/**
 * StatusBadge Component
 * A unified status badge component that provides consistent styling across
 * all status displays in the application.
 */

import React from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  QuestionMarkCircleIcon,
  MinusCircleIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  SignalIcon,
  SignalSlashIcon } from
'@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolidIcon,
  XCircleIcon as XCircleSolidIcon,
  ExclamationTriangleIcon as ExclamationTriangleSolidIcon } from
'@heroicons/react/24/solid';
import { getStatusConfig, getSeverityConfig } from '../../utils/constants';

// =============================================================================
// TYPES
// =============================================================================
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";





































// =============================================================================
// ICON MAPPING
// =============================================================================

const statusIcons = {
  // Success states
  success: CheckCircleIcon,
  running: PlayIcon,
  healthy: CheckCircleIcon,
  deployed: CheckCircleIcon,
  active: CheckCircleIcon,
  connected: SignalIcon,
  synced: CheckCircleIcon,

  // Warning states
  warning: ExclamationTriangleIcon,
  pending: ClockIcon,
  progressing: ArrowPathIcon,
  degraded: ExclamationTriangleIcon,
  installing: ClockIcon,
  upgrading: ArrowPathIcon,

  // Error states
  error: XCircleIcon,
  failed: XCircleIcon,
  critical: XCircleIcon,
  disconnected: SignalSlashIcon,
  terminated: StopIcon,

  // Neutral states
  info: QuestionMarkCircleIcon,
  unknown: QuestionMarkCircleIcon,
  default: MinusCircleIcon,
  paused: PauseIcon,
  stopped: StopIcon
};

const solidIcons = {
  success: CheckCircleSolidIcon,
  running: CheckCircleSolidIcon,
  healthy: CheckCircleSolidIcon,
  deployed: CheckCircleSolidIcon,
  error: XCircleSolidIcon,
  failed: XCircleSolidIcon,
  critical: XCircleSolidIcon,
  warning: ExclamationTriangleSolidIcon
};

// =============================================================================
// SIZE CONFIGURATIONS
// =============================================================================

const sizeConfig = {
  xs: {
    badge: 'px-1.5 py-0.5 text-[10px] gap-1',
    icon: 'h-3 w-3',
    dot: 'h-1.5 w-1.5'
  },
  sm: {
    badge: 'px-2 py-0.5 text-xs gap-1',
    icon: 'h-3.5 w-3.5',
    dot: 'h-2 w-2'
  },
  md: {
    badge: 'px-2.5 py-1 text-xs gap-1.5',
    icon: 'h-4 w-4',
    dot: 'h-2 w-2'
  },
  lg: {
    badge: 'px-3 py-1.5 text-sm gap-2',
    icon: 'h-5 w-5',
    dot: 'h-2.5 w-2.5'
  }
};

// =============================================================================
// STATUS BADGE COMPONENT
// =============================================================================

/**
 * StatusBadge - Displays status with consistent styling
 *
 * @example
 * // Basic usage
 * <StatusBadge status="running" />
 *
 * // With custom label
 * <StatusBadge status="deployed" label="Live" />
 *
 * // Different sizes
 * <StatusBadge status="pending" size="lg" />
 *
 * // Outline variant
 * <StatusBadge status="failed" variant="outline" />
 *
 * // Dot variant (minimal)
 * <StatusBadge status="healthy" variant="dot" />
 */
export function StatusBadge({
  status,
  label,
  size = 'sm',
  variant = 'filled',
  showIcon = true,
  animate = true,
  solid = false,
  className = ''
}) {
  const normalizedStatus = status.toLowerCase().replace(/[_-]/g, '');
  const config = getStatusConfig(status);
  const sizes = sizeConfig[size];

  // Determine if this is an animated state
  const isAnimatedState =
  animate &&
  ['pending', 'progressing', 'installing', 'upgrading'].includes(normalizedStatus);

  // Get the appropriate icon
  const IconComponent =
  solid && solidIcons[normalizedStatus] ||
  statusIcons[normalizedStatus] ||
  statusIcons.default;

  // Build class strings based on variant
  let variantClasses = '';
  switch (variant) {
    case 'filled':
      variantClasses = `${config.bgColor} ${config.darkBgColor} ${config.textColor} ${config.darkTextColor}`;
      break;
    case 'outline':
      variantClasses = `bg-transparent border ${config.borderColor} ${config.textColor} ${config.darkTextColor}`;
      break;
    case 'dot':
      variantClasses = 'bg-transparent text-gray-700 dark:text-gray-300';
      break;
  }

  const displayLabel = label || config.label;

  return (/*#__PURE__*/
    _jsxDEV("span", {
      className: `
        inline-flex items-center font-medium rounded-full
        ${sizes.badge}
        ${variantClasses}
        ${className}
      `, children: [

      variant === 'dot' ? /*#__PURE__*/
      _jsxDEV("span", {
        className: `
            ${sizes.dot} rounded-full
            ${config.bgColor.replace('-100', '-500')}
            ${isAnimatedState ? 'animate-pulse' : ''}
          ` }, void 0, false
      ) :
      showIcon ? /*#__PURE__*/
      _jsxDEV(IconComponent, {
        className: `
            ${sizes.icon}
            ${isAnimatedState ? 'animate-spin' : ''}
          ` }, void 0, false
      ) :
      null,
      displayLabel] }, void 0, true
    ));

}

// =============================================================================
// SEVERITY BADGE COMPONENT
// =============================================================================

/**
 * SeverityBadge - Displays severity levels with consistent styling
 *
 * @example
 * <SeverityBadge severity="critical" />
 * <SeverityBadge severity="high" />
 * <SeverityBadge severity="medium" />
 * <SeverityBadge severity="low" />
 */
export function SeverityBadge({
  severity,
  label,
  size = 'sm',
  variant = 'filled',
  showIcon = true,
  className = ''
}) {
  const config = getSeverityConfig(severity);
  const sizes = sizeConfig[size];

  // Severity icons
  const severityIcons = {
    critical: XCircleIcon,
    high: ExclamationTriangleIcon,
    medium: ExclamationTriangleIcon,
    low: QuestionMarkCircleIcon,
    info: QuestionMarkCircleIcon
  };

  const IconComponent = severityIcons[severity.toLowerCase()] || QuestionMarkCircleIcon;

  // Build class strings based on variant
  let variantClasses = '';
  switch (variant) {
    case 'filled':
      variantClasses = `${config.bgColor} ${config.darkBgColor} ${config.textColor} ${config.darkTextColor}`;
      break;
    case 'outline':
      variantClasses = `bg-transparent border ${config.borderColor} ${config.textColor} ${config.darkTextColor}`;
      break;
    case 'dot':
      variantClasses = 'bg-transparent text-gray-700 dark:text-gray-300';
      break;
  }

  const displayLabel = label || severity.toUpperCase();

  return (/*#__PURE__*/
    _jsxDEV("span", {
      className: `
        inline-flex items-center font-medium rounded-full
        ${sizes.badge}
        ${variantClasses}
        ${className}
      `, children: [

      variant === 'dot' ? /*#__PURE__*/
      _jsxDEV("span", {
        className: `
            ${sizes.dot} rounded-full
            ${config.bgColor.replace('-100', '-500')}
          ` }, void 0, false
      ) :
      showIcon ? /*#__PURE__*/
      _jsxDEV(IconComponent, { className: sizes.icon }, void 0, false) :
      null,
      displayLabel] }, void 0, true
    ));

}

// =============================================================================
// HEALTH INDICATOR COMPONENT
// =============================================================================








/**
 * HealthIndicator - Simple healthy/unhealthy indicator
 *
 * @example
 * <HealthIndicator healthy={true} />
 * <HealthIndicator healthy={false} showLabel />
 */
export function HealthIndicator({
  healthy,
  size = 'sm',
  showLabel = false,
  className = ''
}) {
  const sizes = sizeConfig[size];
  const status = healthy ? 'healthy' : 'unhealthy';
  const config = getStatusConfig(status);

  return (/*#__PURE__*/
    _jsxDEV("span", {
      className: `
        inline-flex items-center gap-1.5
        ${showLabel ? config.textColor + ' ' + config.darkTextColor : ''}
        ${className}
      `, children: [/*#__PURE__*/

      _jsxDEV("span", {
        className: `
          ${sizes.dot} rounded-full
          ${healthy ? 'bg-emerald-500' : 'bg-red-500'}
        ` }, void 0, false
      ),
      showLabel && /*#__PURE__*/
      _jsxDEV("span", { className: `text-${size === 'xs' ? '[10px]' : 'xs'} font-medium`, children:
        healthy ? 'Healthy' : 'Unhealthy' }, void 0, false
      )] }, void 0, true

    ));

}

// =============================================================================
// CONNECTION STATUS COMPONENT
// =============================================================================








/**
 * ConnectionStatus - Shows connection status indicator
 *
 * @example
 * <ConnectionStatus connected={true} showLabel />
 */
export function ConnectionStatus({
  connected,
  size = 'sm',
  showLabel = true,
  className = ''
}) {
  return (/*#__PURE__*/
    _jsxDEV(StatusBadge, {
      status: connected ? 'connected' : 'disconnected',
      size: size,
      showIcon: showLabel,
      variant: showLabel ? 'filled' : 'dot',
      className: className }, void 0, false
    ));

}

// =============================================================================
// SYNC STATUS COMPONENT (for ArgoCD, GitOps)
// =============================================================================







/**
 * SyncStatus - Shows sync status for GitOps resources
 *
 * @example
 * <SyncStatus status="Synced" />
 * <SyncStatus status="OutOfSync" />
 */
export function SyncStatus({ status, size = 'sm', className = '' }) {
  const statusMap = {
    synced: 'synced',
    outofsync: 'warning',
    unknown: 'unknown'
  };

  const normalizedStatus = status.toLowerCase().replace(/[_-]/g, '');
  const mappedStatus = statusMap[normalizedStatus] || 'unknown';

  const labels = {
    synced: 'Synced',
    outofsync: 'Out of Sync',
    unknown: 'Unknown'
  };

  return (/*#__PURE__*/
    _jsxDEV(StatusBadge, {
      status: mappedStatus,
      label: labels[normalizedStatus] || status,
      size: size,
      className: className }, void 0, false
    ));

}

// =============================================================================
// EXPORT ALL
// =============================================================================

export default StatusBadge;
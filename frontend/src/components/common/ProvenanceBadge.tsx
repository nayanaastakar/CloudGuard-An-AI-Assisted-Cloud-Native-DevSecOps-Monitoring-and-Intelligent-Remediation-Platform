import React from 'react';
import { ProvenanceMetadata } from '../../services/cloudguardApi';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ProvenanceBadgeProps {
  provenance?: ProvenanceMetadata | { state?: string; source?: string; is_fresh?: boolean; error_message?: string };
  state?: string;
  source?: string;
  label?: string;
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  provenance,
  state: explicitState,
  source: explicitSource,
  label: explicitLabel,
  className = '',
}) => {
  const resolvedState = (explicitState || provenance?.state || 'demo').toLowerCase();
  const resolvedSource = explicitSource || provenance?.source;
  const isFresh = provenance?.is_fresh ?? true;
  const errorMessage = provenance?.error_message;

  switch (resolvedState) {
    case 'live':
      return (
        <span
          title={resolvedSource ? `Direct live stream from ${resolvedSource}` : 'Direct live stream'}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-blue-400 border border-emerald-500/40 pointer-events-none ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">{explicitLabel || 'LIVE'}</span>
          {resolvedSource && <span className="text-emerald-500/80">({resolvedSource})</span>}
        </span>
      );

    case 'stale':
      return (
        <span
          title={resolvedSource ? `Telemetry from ${resolvedSource} exceeds TTL` : 'Telemetry exceeds TTL'}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/80 text-amber-300 border border-amber-500/40 pointer-events-none ${className}`}
        >
          <ExclamationTriangleIcon className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">{explicitLabel || 'STALE'}</span>
          {resolvedSource && <span className="text-amber-500/80">({resolvedSource})</span>}
        </span>
      );

    case 'unavailable':
      return (
        <span
          title={errorMessage || 'Target system or scanner unreachable'}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-950/80 text-rose-300 border border-rose-500/40 pointer-events-none ${className}`}
        >
          <XCircleIcon className="w-3.5 h-3.5 text-rose-400" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">{explicitLabel || 'UNAVAILABLE'}</span>
        </span>
      );

    case 'demo':
    default:
      return (
        <span
          title="Generated deterministic demo scenario (no active live connection)"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-950/80 text-violet-300 border border-teal-500/40 pointer-events-none ${className}`}
        >
          <InformationCircleIcon className="w-3.5 h-3.5 text-violet-400" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">{explicitLabel || 'DEMO / LAB'}</span>
          <span className="text-violet-400/70 text-[10px]">(Safe Fallback)</span>
        </span>
      );
  }
};

export default ProvenanceBadge;

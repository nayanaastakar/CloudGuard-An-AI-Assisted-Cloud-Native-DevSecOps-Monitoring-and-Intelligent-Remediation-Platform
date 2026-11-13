import React from 'react';
import { ProvenanceMetadata } from '../../services/cloudguardApi';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ProvenanceBadgeProps {
  provenance?: ProvenanceMetadata;
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({ provenance, className = '' }) => {
  if (!provenance) {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-800 text-gray-300 border border-gray-700 ${className}`}>
        <InformationCircleIcon className="w-3.5 h-3.5 text-gray-400" />
        Unknown Provenance
      </span>
    );
  }

  const { state, source, is_fresh, error_message } = provenance;

  switch (state) {
    case 'live':
      return (
        <span
          title={`Direct live stream from ${source}`}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">LIVE</span>
          <span className="text-emerald-500/80">({source})</span>
        </span>
      );

    case 'stale':
      return (
        <span
          title={`Telemetry from ${source} exceeds TTL`}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-950/80 text-amber-300 border border-amber-500/40 ${className}`}
        >
          <ExclamationTriangleIcon className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">STALE</span>
          <span className="text-amber-500/80">({source})</span>
        </span>
      );

    case 'unavailable':
      return (
        <span
          title={error_message || 'Target system or scanner unreachable'}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-950/80 text-rose-300 border border-rose-500/40 ${className}`}
        >
          <XCircleIcon className="w-3.5 h-3.5 text-rose-400" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">UNAVAILABLE</span>
        </span>
      );

    case 'demo':
    default:
      return (
        <span
          title="Generated deterministic demo scenario (no active live connection)"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-950/80 text-blue-300 border border-blue-500/40 ${className}`}
        >
          <InformationCircleIcon className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">DEMO / LAB</span>
          <span className="text-blue-400/70 text-[10px]">(Safe Fallback)</span>
        </span>
      );
  }
};

export default ProvenanceBadge;

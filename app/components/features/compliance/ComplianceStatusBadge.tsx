/**
 * @file ComplianceStatusBadge.tsx
 * @description Badge component for compliance status display
 * @module components/features/compliance
 */

'use client';

import type { MonitoredTransaction } from '@/types/compliance.types';

interface ComplianceStatusBadgeProps {
  status: MonitoredTransaction['complianceStatus'];
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  COMPLIANT: {
    label: 'Compliant',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  FLAGGED: {
    label: 'Flagged',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  CLEARED: {
    label: 'Cleared',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  ESCALATED: {
    label: 'Escalated',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
};

export default function ComplianceStatusBadge({ status, size = 'md' }: ComplianceStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-medium
        ${config.bg} ${config.text} ${config.border}
        ${sizeClasses[size]}
      `}
    >
      {config.label}
    </span>
  );
}

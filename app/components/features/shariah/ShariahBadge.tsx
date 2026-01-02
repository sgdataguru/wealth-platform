/**
 * @file ShariahBadge.tsx
 * @description Badge component displaying Shariah compliance status
 * @module components/features/shariah
 */

'use client';

import type { ShariahStatus } from '@/types/compliance.types';

interface ShariahBadgeProps {
  status: ShariahStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusConfig = {
  COMPLIANT: {
    label: 'Shariah Compliant',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    icon: '✓',
  },
  NON_COMPLIANT: {
    label: 'Non-Compliant',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    icon: '✕',
  },
  PENDING_REVIEW: {
    label: 'Pending Review',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    icon: '⏳',
  },
  NOT_APPLICABLE: {
    label: 'N/A',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-200',
    icon: '—',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
};

export default function ShariahBadge({ 
  status, 
  size = 'md', 
  showIcon = true 
}: ShariahBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${sizeClasses[size]}
      `}
      role="status"
      aria-label={`Shariah compliance status: ${config.label}`}
    >
      {showIcon && <span aria-hidden="true">{config.icon}</span>}
      {config.label}
    </span>
  );
}

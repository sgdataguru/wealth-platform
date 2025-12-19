/**
 * @file StatusPill.tsx
 * @description Status indicator component for follow-ups and leads
 */

import type { FollowUpStatus, LeadStatus } from '@/types';

interface StatusPillProps {
  status: FollowUpStatus | LeadStatus;
  className?: string;
}

const followUpStatusConfig: Record<FollowUpStatus, { label: string; color: string; bgColor: string }> = {
  new: {
    label: 'New',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
  },
  completed: {
    label: 'Completed',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
  },
  blocked: {
    label: 'Blocked',
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200',
  },
};

const leadStatusConfig: Record<LeadStatus, { label: string; color: string; bgColor: string }> = {
  new: {
    label: 'New',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  contacted: {
    label: 'Contacted',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50 border-indigo-200',
  },
  engaged: {
    label: 'Engaged',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200',
  },
  qualified: {
    label: 'Qualified',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-200',
  },
  converted: {
    label: 'Converted',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
  },
  inactive: {
    label: 'Inactive',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50 border-gray-200',
  },
};

export default function StatusPill({ status, className = '' }: StatusPillProps) {
  // Check if it's a follow-up status or lead status
  const config = followUpStatusConfig[status as FollowUpStatus] || leadStatusConfig[status as LeadStatus];

  if (!config) {
    return null;
  }

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        border ${config.bgColor} ${config.color}
        ${className}
      `}
    >
      {config.label}
    </span>
  );
}

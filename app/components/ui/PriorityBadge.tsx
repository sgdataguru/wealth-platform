/**
 * @file PriorityBadge.tsx
 * @description Priority indicator component for follow-ups
 */

import type { FollowUpPriority } from '@/types';

interface PriorityBadgeProps {
  priority: FollowUpPriority;
  className?: string;
}

const priorityConfig: Record<FollowUpPriority, { label: string; color: string }> = {
  critical: {
    label: 'Critical',
    color: 'text-red-600 bg-red-50',
  },
  high: {
    label: 'High',
    color: 'text-orange-600 bg-orange-50',
  },
  medium: {
    label: 'Medium',
    color: 'text-yellow-600 bg-yellow-50',
  },
  low: {
    label: 'Low',
    color: 'text-gray-600 bg-gray-50',
  },
};

export default function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
        ${config.color}
        ${className}
      `}
    >
      {config.label}
    </span>
  );
}

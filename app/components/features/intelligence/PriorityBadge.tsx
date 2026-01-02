/**
 * @file PriorityBadge.tsx
 * @description Priority badge for liquidity signals
 */

import type { Priority } from '@/types';

const PRIORITY_STYLES: Record<Priority, string> = {
  CRITICAL: 'bg-red-500/15 text-red-400 border-red-500/30',
  HIGH: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  MEDIUM: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  LOW: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${PRIORITY_STYLES[priority]}`}
    >
      {priority}
    </span>
  );
}

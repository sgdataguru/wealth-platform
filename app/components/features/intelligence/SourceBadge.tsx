/**
 * @file SourceBadge.tsx
 * @description Source attribution badge
 */

import type { SourceType } from '@/types';

const SOURCE_LABELS: Record<SourceType, string> = {
  REGULATORY: 'Regulatory',
  FINOVA: 'Finova',
  IPO: 'IPO Watch',
  MARKET: 'Market',
};

export default function SourceBadge({ source }: { source: SourceType }) {
  return (
    <span className="rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.08)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)]">
      {SOURCE_LABELS[source] ?? source}
    </span>
  );
}

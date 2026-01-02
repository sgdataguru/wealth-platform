/**
 * @file SignalCard.tsx
 * @description Signal card for intelligence dashboard
 */

import type { LiquiditySignal, SourceType } from '@/types';
import { calculateTimeline } from '@/lib/utils/signals';
import Card from '@/app/components/ui/Card';
import PriorityBadge from './PriorityBadge';
import SourceBadge from './SourceBadge';

const PRIORITY_BORDER: Record<LiquiditySignal['priority'], string> = {
  CRITICAL: 'border-l-red-500',
  HIGH: 'border-l-amber-500',
  MEDIUM: 'border-l-sky-500',
  LOW: 'border-l-emerald-500',
};

const formatRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const uniqueSources = (trace: LiquiditySignal['sourceTrace']) => {
  const sources = new Set<SourceType>();
  for (const entry of trace ?? []) {
    sources.add(entry.source);
  }
  return Array.from(sources.values());
};

export default function SignalCard({ signal }: { signal: LiquiditySignal }) {
  const { bucket, daysAgo } = calculateTimeline(signal.detectedAt);
  const sources = uniqueSources(signal.sourceTrace);

  return (
    <Card
      hover
      className={`border-l-4 ${PRIORITY_BORDER[signal.priority]} bg-[var(--bg-card)]`}
      padding="md"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority={signal.priority} />
            <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              {bucket === 'ALL' ? 'All Time' : `${bucket.replace('_DAY', '')} Day`}
            </span>
          </div>
          <span className="text-xs text-[var(--text-muted)]">{formatRelativeTime(signal.detectedAt)}</span>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            {signal.title}
          </h3>
          {signal.description && (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {signal.description.length > 180 ? `${signal.description.slice(0, 180)}...` : signal.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {sources.map((source) => (
              <SourceBadge key={source} source={source} />
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
            <span className="uppercase tracking-[0.2em] text-[var(--text-muted)]">Confidence</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {signal.confidence !== null ? `${Math.round((signal.confidence ?? 0) * 100)}%` : '—'}
            </span>
            <span className="text-[var(--text-muted)]">·</span>
            <span className="text-[var(--text-muted)]">{daysAgo}d</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

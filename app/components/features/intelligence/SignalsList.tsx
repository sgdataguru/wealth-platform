'use client';

/**
 * @file SignalsList.tsx
 * @description Signals list with polling
 */

import { useMemo } from 'react';
import Button from '@/app/components/ui/Button';
import SignalCard from './SignalCard';
import FilterBar from './FilterBar';
import { useSignalFilters } from '@/app/hooks/useSignalFilters';
import { useSignals } from '@/app/hooks/useSignals';

const formatTimestamp = (value: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleString();
};

export default function SignalsList() {
  const { filters } = useSignalFilters();
  const { data, isLoading, isRefreshing, error, lastUpdated, refresh } = useSignals(filters);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-32 animate-pulse rounded-2xl border border-[var(--header-border)] bg-[var(--bg-card)]"
            />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-2xl border border-[rgba(220,53,69,0.25)] bg-[rgba(220,53,69,0.08)] p-6 text-sm text-red-200">
          {error}
        </div>
      );
    }

    if (!data.length) {
      return (
        <div className="rounded-2xl border border-[var(--header-border)] bg-[var(--bg-card)] p-8 text-center text-sm text-[var(--text-secondary)]">
          No signals match your filters yet.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {data.map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>
    );
  }, [data, error, isLoading]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-playfair)]">
            Early Liquidity Signals
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Multi-source intelligence with real-time prioritization and compliance-first sourcing.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => refresh()}
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <FilterBar />

      <div className="max-h-[620px] overflow-y-auto pr-1">
        {content}
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>Last updated: {formatTimestamp(lastUpdated)}</span>
        <span>Polling every 15 seconds (paused when tab hidden)</span>
      </div>
    </section>
  );
}

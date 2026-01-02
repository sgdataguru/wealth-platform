'use client';

/**
 * @file FilterBar.tsx
 * @description Filter bar for intelligence signals
 */

import { useEffect, useMemo, useState } from 'react';
import type { Priority, SourceType, TimelineFilter } from '@/types';
import { useSignalFilters } from '@/app/hooks/useSignalFilters';

const TIMELINE_OPTIONS: { label: string; value: TimelineFilter }[] = [
  { label: 'All', value: 'ALL' },
  { label: '30D', value: '30_DAY' },
  { label: '60D', value: '60_DAY' },
  { label: '90D', value: '90_DAY' },
];

const PRIORITY_OPTIONS: Priority[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const SOURCE_OPTIONS: SourceType[] = ['REGULATORY', 'FINOVA', 'IPO', 'MARKET'];

const toggleItem = <T,>(items: T[], item: T) =>
  items.includes(item) ? items.filter((value) => value !== item) : [...items, item];

export default function FilterBar() {
  const { filters, setFilters } = useSignalFilters();
  const [searchValue, setSearchValue] = useState(filters.q);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue !== filters.q) {
        setFilters({ q: searchValue, page: 1 });
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [filters.q, searchValue, setFilters]);

  const sortLabel = useMemo(() => {
    if (filters.sortBy === 'priority') return 'Priority';
    if (filters.sortBy === 'confidence') return 'Confidence';
    return 'Detected at';
  }, [filters.sortBy]);

  return (
    <div className="rounded-2xl border border-[var(--header-border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-sm)]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Search
            </label>
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search signals, issuers, filings..."
              className="mt-2 w-full rounded-full border border-[var(--header-border)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary-accent)] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-[var(--header-border)] bg-[var(--bg-secondary)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Sort: {sortLabel}
            </div>
            <select
              value={`${filters.sortBy}:${filters.sortOrder}`}
              onChange={(event) => {
                const [sortBy, sortOrder] = event.target.value.split(':');
                setFilters({ sortBy: sortBy as 'detectedAt' | 'priority' | 'confidence', sortOrder: sortOrder as 'asc' | 'desc' });
              }}
              className="rounded-full border border-[var(--header-border)] bg-[var(--bg-secondary)] px-4 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--primary-accent)] focus:outline-none"
            >
              <option value="detectedAt:desc">Latest detected</option>
              <option value="detectedAt:asc">Oldest detected</option>
              <option value="priority:desc">Highest priority</option>
              <option value="priority:asc">Lowest priority</option>
              <option value="confidence:desc">Highest confidence</option>
              <option value="confidence:asc">Lowest confidence</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {TIMELINE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilters({ timeline: option.value, page: 1 })}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all ${
                filters.timeline === option.value
                  ? 'bg-[var(--primary-accent)] text-[var(--primary-deep-blue)] shadow-[0_6px_20px_rgba(201,162,39,0.4)]'
                  : 'border border-[var(--header-border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Priority</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRIORITY_OPTIONS.map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFilters({ priority: toggleItem(filters.priority, priority), page: 1 })}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${
                    filters.priority.includes(priority)
                      ? 'bg-[rgba(201,162,39,0.2)] text-[var(--text-primary)] border border-[rgba(201,162,39,0.4)]'
                      : 'border border-[var(--header-border)] text-[var(--text-secondary)]'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Source</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SOURCE_OPTIONS.map((source) => (
                <button
                  key={source}
                  type="button"
                  onClick={() => setFilters({ source: toggleItem(filters.source, source), page: 1 })}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${
                    filters.source.includes(source)
                      ? 'bg-[rgba(30,58,95,0.25)] text-[var(--text-primary)] border border-[rgba(30,58,95,0.4)]'
                      : 'border border-[var(--header-border)] text-[var(--text-secondary)]'
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @file lib/utils/signals.ts
 * @description Utilities for liquidity signals
 */

import type { Priority, RawSignal, SourceTrace, SourceType, TimelineFilter } from '@/types';

const PRIORITY_THRESHOLDS = {
  critical: 0.85,
  high: 0.7,
  medium: 0.5,
};

const SOURCE_PRIORITY: Record<SourceType, number> = {
  REGULATORY: 4,
  FINOVA: 3,
  IPO: 2,
  MARKET: 1,
  PRIVATE_CIRCLE: 1,
  REGISTRY: 1,
  NEWS_API: 1,
};

export const derivePriority = (relevanceScore?: number | null): Priority => {
  if (relevanceScore === null || relevanceScore === undefined) return 'LOW';
  if (relevanceScore >= PRIORITY_THRESHOLDS.critical) return 'CRITICAL';
  if (relevanceScore >= PRIORITY_THRESHOLDS.high) return 'HIGH';
  if (relevanceScore >= PRIORITY_THRESHOLDS.medium) return 'MEDIUM';
  return 'LOW';
};

export const calculateTimeline = (detectedAt: string | Date) => {
  const date = detectedAt instanceof Date ? detectedAt : new Date(detectedAt);
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let bucket: TimelineFilter = 'ALL';
  if (daysAgo <= 30) bucket = '30_DAY';
  else if (daysAgo <= 60) bucket = '60_DAY';
  else if (daysAgo <= 90) bucket = '90_DAY';

  return { bucket, daysAgo };
};

export const buildSearchQuery = (query: string) => {
  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.replace(/[^a-z0-9_-]/g, ''))
    .filter(Boolean);

  if (!terms.length) return '';
  return terms.map((term) => `${term}:*`).join(' & ');
};

export const createSignalSignature = (signal: RawSignal) => {
  const baseTitle = signal.title?.toLowerCase().trim() ?? '';
  const normalizedTitle = baseTitle.replace(/[^a-z0-9]+/g, ' ').trim();
  const prospectKey = signal.prospectId ?? 'unassigned';
  return `${prospectKey}::${normalizedTitle}`;
};

const mergeSourceTrace = (existing: SourceTrace[], incoming: SourceTrace) => {
  const bySource = new Map(existing.map((entry) => [entry.source, entry]));
  if (!bySource.has(incoming.source)) {
    bySource.set(incoming.source, incoming);
  }
  return Array.from(bySource.values());
};

const getHighestPrioritySource = (trace: SourceTrace[]) => {
  return trace.reduce<SourceType | null>((current, entry) => {
    if (!current) return entry.source;
    return SOURCE_PRIORITY[entry.source] > SOURCE_PRIORITY[current] ? entry.source : current;
  }, null);
};

export const resolveConflicts = (signals: RawSignal[], source: SourceType) => {
  const now = new Date().toISOString();
  const seen = new Map<string, RawSignal>();
  let conflicts = 0;

  for (const signal of signals) {
    const signature = createSignalSignature(signal);
    const current = seen.get(signature);
    if (!current) {
      seen.set(signature, {
        ...signal,
        sourceTrace: signal.sourceTrace ?? [{ source, ingestedAt: now }],
      });
      continue;
    }

    conflicts += 1;
    const incomingTrace: SourceTrace = { source, ingestedAt: now };
    const currentTrace = current.sourceTrace ?? [];
    const mergedTrace = mergeSourceTrace(currentTrace, incomingTrace);
    const currentBest = getHighestPrioritySource(currentTrace) ?? source;

    if (SOURCE_PRIORITY[source] > SOURCE_PRIORITY[currentBest]) {
      seen.set(signature, {
        ...signal,
        sourceTrace: mergedTrace,
      });
    } else {
      seen.set(signature, {
        ...current,
        sourceTrace: mergedTrace,
      });
    }
  }

  return { resolved: Array.from(seen.values()), conflicts };
};

export const SOURCE_PRIORITY_MAP = SOURCE_PRIORITY;

// TODO: Add unit tests for conflict resolution, timeline bucketing, and search query building.

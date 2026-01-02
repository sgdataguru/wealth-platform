'use client';

/**
 * @file app/hooks/useSignalFilters.ts
 * @description Sync intelligence filters with URL query params
 */

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Priority, SourceType, TimelineFilter } from '@/types';

export type SignalSortBy = 'detectedAt' | 'priority' | 'confidence';
export type SortOrder = 'asc' | 'desc';

export interface SignalFiltersState {
  q: string;
  timeline: TimelineFilter;
  priority: Priority[];
  source: SourceType[];
  sortBy: SignalSortBy;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}

const DEFAULT_FILTERS: SignalFiltersState = {
  q: '',
  timeline: 'ALL',
  priority: [],
  source: [],
  sortBy: 'detectedAt',
  sortOrder: 'desc',
  page: 1,
  limit: 20,
};

const parseList = (value: string | null) =>
  value?.split(',').map((item) => item.trim()).filter(Boolean) ?? [];

export const useSignalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo<SignalFiltersState>(() => {
    const q = searchParams.get('q') ?? DEFAULT_FILTERS.q;
    const timeline = (searchParams.get('timeline') ?? DEFAULT_FILTERS.timeline) as TimelineFilter;
    const priority = parseList(searchParams.get('priority')) as Priority[];
    const source = parseList(searchParams.get('source')) as SourceType[];
    const sortBy = (searchParams.get('sortBy') ?? DEFAULT_FILTERS.sortBy) as SignalSortBy;
    const sortOrder = (searchParams.get('sortOrder') ?? DEFAULT_FILTERS.sortOrder) as SortOrder;
    const page = Number(searchParams.get('page') ?? DEFAULT_FILTERS.page);
    const limit = Number(searchParams.get('limit') ?? DEFAULT_FILTERS.limit);

    return {
      q,
      timeline,
      priority,
      source,
      sortBy,
      sortOrder,
      page: Number.isNaN(page) ? DEFAULT_FILTERS.page : page,
      limit: Number.isNaN(limit) ? DEFAULT_FILTERS.limit : limit,
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (next: Partial<SignalFiltersState>) => {
      const params = new URLSearchParams(searchParams.toString());
      const merged = { ...filters, ...next, page: next.page ?? 1 };

      const setParam = (key: string, value: string | number | null) => {
        if (value === null || value === '' || value === undefined) {
          params.delete(key);
          return;
        }
        params.set(key, String(value));
      };

      setParam('q', merged.q || null);
      setParam('timeline', merged.timeline === 'ALL' ? null : merged.timeline);
      setParam('priority', merged.priority.length ? merged.priority.join(',') : null);
      setParam('source', merged.source.length ? merged.source.join(',') : null);
      setParam('sortBy', merged.sortBy !== DEFAULT_FILTERS.sortBy ? merged.sortBy : null);
      setParam('sortOrder', merged.sortOrder !== DEFAULT_FILTERS.sortOrder ? merged.sortOrder : null);
      setParam('page', merged.page > 1 ? merged.page : null);
      setParam('limit', merged.limit !== DEFAULT_FILTERS.limit ? merged.limit : null);

      const nextQuery = params.toString();
      router.replace(nextQuery ? `/intelligence?${nextQuery}` : '/intelligence');
    },
    [filters, router, searchParams]
  );

  return { filters, setFilters };
};

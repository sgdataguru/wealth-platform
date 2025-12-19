/**
 * @file app/hooks/useProspects.ts
 * @description Hook for fetching and managing prospects data
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Prospect, ProspectFilters, ProspectSortOption } from '@/types';

interface UseProspectsOptions {
  filters?: ProspectFilters;
  sortBy?: ProspectSortOption;
  pageSize?: number;
  autoFetch?: boolean;
}

interface UseProspectsReturn {
  prospects: Prospect[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useProspects(options: UseProspectsOptions = {}): UseProspectsReturn {
  const {
    filters,
    sortBy = 'score',
    pageSize = 20,
    autoFetch = true,
  } = options;

  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchProspects = useCallback(async (pageNum: number, append = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query string
      const params = new URLSearchParams();
      params.append('page', pageNum.toString());
      params.append('pageSize', pageSize.toString());
      params.append('sort', sortBy);

      if (filters?.signalTypes && filters.signalTypes.length > 0) {
        params.append('signalTypes', filters.signalTypes.join(','));
      }
      if (filters?.minScore !== undefined) {
        params.append('minScore', filters.minScore.toString());
      }
      if (filters?.maxScore !== undefined) {
        params.append('maxScore', filters.maxScore.toString());
      }
      if (filters?.cities && filters.cities.length > 0) {
        params.append('cities', filters.cities.join(','));
      }
      if (filters?.sectors && filters.sectors.length > 0) {
        params.append('sectors', filters.sectors.join(','));
      }

      const response = await fetch(`/api/prospects?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        if (append) {
          setProspects(prev => [...prev, ...data.data.prospects]);
        } else {
          setProspects(data.data.prospects);
        }
        setHasMore(data.data.metadata.hasMore);
        setTotal(data.data.metadata.total);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch prospects');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching prospects:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortBy, pageSize]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchProspects(nextPage, true);
  }, [hasMore, isLoading, page, fetchProspects]);

  const refresh = useCallback(async () => {
    setPage(1);
    await fetchProspects(1, false);
  }, [fetchProspects]);

  useEffect(() => {
    if (autoFetch) {
      setPage(1);
      fetchProspects(1, false);
    }
  }, [autoFetch, fetchProspects]);

  return {
    prospects,
    isLoading,
    error,
    hasMore,
    total,
    loadMore,
    refresh,
  };
}

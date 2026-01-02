'use client';

/**
 * @file app/hooks/useSignals.ts
 * @description Fetch and poll intelligence signals
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LiquiditySignal } from '@/types';
import type { SignalFiltersState } from './useSignalFilters';
import { getStoredAuth } from '@/lib/auth/session';

interface SignalsResponse {
  success: boolean;
  data: LiquiditySignal[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  meta: { lastUpdated: string };
}

export const useSignals = (filters: SignalFiltersState) => {
  const [data, setData] = useState<LiquiditySignal[]>([]);
  const [pagination, setPagination] = useState<SignalsResponse['pagination']>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.timeline !== 'ALL') params.set('timeline', filters.timeline);
    if (filters.priority.length) params.set('priority', filters.priority.join(','));
    if (filters.source.length) params.set('source', filters.source.join(','));
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
    params.set('page', String(filters.page));
    params.set('limit', String(filters.limit));
    return params.toString();
  }, [filters]);

  const fetchSignals = useCallback(
    async (isRefresh = false) => {
      setError(null);
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const session = getStoredAuth();
        const headers: HeadersInit = {};
        if (session?.user?.id) {
          headers['x-rm-id'] = session.user.id;
        }

        const response = await fetch(`/api/intelligence/signals?${queryString}`, {
          headers: Object.keys(headers).length ? headers : undefined,
        });

        if (!response.ok) {
          const message = response.status === 401 ? 'Authentication required.' : 'Failed to load signals.';
          setError(message);
          return;
        }

        const payload = (await response.json()) as SignalsResponse;
        setData(payload.data ?? []);
        setPagination(payload.pagination);
        setLastUpdated(payload.meta?.lastUpdated ?? null);
      } catch {
        setError('Failed to load signals.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [queryString]
  );

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        if (refreshInterval.current) clearInterval(refreshInterval.current);
        refreshInterval.current = null;
      } else if (!refreshInterval.current) {
        refreshInterval.current = setInterval(() => fetchSignals(true), 15000);
      }
    };

    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (refreshInterval.current) clearInterval(refreshInterval.current);
    };
  }, [fetchSignals]);

  return {
    data,
    pagination,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    refresh: () => fetchSignals(true),
  };
};

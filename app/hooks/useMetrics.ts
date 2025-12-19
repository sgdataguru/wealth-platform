/**
 * @file useMetrics.ts
 * @description Custom hook for dashboard metrics
 */

'use client';

import { useState, useEffect } from 'react';
import type { EnhancedDashboardMetrics, ApiResponse } from '@/types';

interface UseMetricsOptions {
  rmId?: string;
}

export function useMetrics(options: UseMetricsOptions = {}) {
  const [metrics, setMetrics] = useState<EnhancedDashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (options.rmId) params.append('rmId', options.rmId);

        const response = await fetch(`/api/metrics?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }

        const data: ApiResponse<EnhancedDashboardMetrics> = await response.json();
        
        if (data.success && data.data) {
          setMetrics(data.data);
          setLastUpdated(new Date());
        } else {
          throw new Error(data.error?.message || 'Failed to fetch metrics');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetrics();
  }, [options.rmId]);

  const refresh = async () => {
    setIsLoading(true);
    // Re-fetch will be triggered by useEffect
  };

  return {
    metrics,
    isLoading,
    error,
    lastUpdated,
    refresh,
  };
}

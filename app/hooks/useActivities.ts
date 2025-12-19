/**
 * @file useActivities.ts
 * @description Custom hook for activity feed data
 */

'use client';

import { useState, useEffect } from 'react';
import type { Activity, PaginatedResponse } from '@/types';

interface UseActivitiesOptions {
  userId?: string;
  limit?: number;
  offset?: number;
}

export function useActivities(options: UseActivitiesOptions = {}) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  });

  useEffect(() => {
    async function fetchActivities() {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (options.userId) params.append('userId', options.userId);
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.offset) params.append('offset', options.offset.toString());

        const response = await fetch(`/api/activities?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }

        const data: PaginatedResponse<Activity> = await response.json();
        
        if (data.success) {
          setActivities(data.data);
          setPagination(data.pagination);
        } else {
          throw new Error('Failed to fetch activities');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivities();
  }, [options.userId, options.limit, options.offset]);

  const refresh = async () => {
    setIsLoading(true);
  };

  return {
    activities,
    isLoading,
    error,
    pagination,
    refresh,
  };
}

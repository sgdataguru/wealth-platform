/**
 * @file useFollowUps.ts
 * @description Custom hook for follow-up data management
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { FollowUp, PaginatedResponse } from '@/types';

interface UseFollowUpsOptions {
  rmId?: string;
  leadId?: string;
  status?: string;
  priority?: string;
  overdue?: boolean;
  limit?: number;
  offset?: number;
}

export function useFollowUps(options: UseFollowUpsOptions = {}) {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  });

  const fetchFollowUps = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.rmId) params.append('rmId', options.rmId);
      if (options.leadId) params.append('leadId', options.leadId);
      if (options.status) params.append('status', options.status);
      if (options.priority) params.append('priority', options.priority);
      if (options.overdue !== undefined) params.append('overdue', options.overdue.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.offset) params.append('offset', options.offset.toString());

      const response = await fetch(`/api/followups?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch follow-ups');
      }

      const data: PaginatedResponse<FollowUp> = await response.json();
      
      if (data.success) {
        setFollowUps(data.data);
        setPagination(data.pagination);
      } else {
        throw new Error('Failed to fetch follow-ups');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [options.rmId, options.leadId, options.status, options.priority, options.overdue, options.limit, options.offset]);

  useEffect(() => {
    fetchFollowUps();
  }, [fetchFollowUps]);

  const markComplete = async (id: string) => {
    // In a real app, this would call PATCH /api/followups/:id
    // For now, just update local state
    setFollowUps(prev => 
      prev.map(fu => 
        fu.id === id 
          ? { ...fu, status: 'completed' as const, completedAt: new Date() }
          : fu
      )
    );
  };

  const refresh = () => {
    fetchFollowUps();
  };

  return {
    followUps,
    isLoading,
    error,
    pagination,
    markComplete,
    refresh,
  };
}

/**
 * @file useLeads.ts
 * @description Custom hook for lead data management
 */

'use client';

import { useState, useEffect } from 'react';
import type { Lead, PaginatedResponse } from '@/types';

interface UseLeadsOptions {
  rmId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export function useLeads(options: UseLeadsOptions = {}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false,
  });

  useEffect(() => {
    async function fetchLeads() {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (options.rmId) params.append('rmId', options.rmId);
        if (options.status) params.append('status', options.status);
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.offset) params.append('offset', options.offset.toString());

        const response = await fetch(`/api/leads?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch leads');
        }

        const data: PaginatedResponse<Lead> = await response.json();
        
        if (data.success) {
          setLeads(data.data);
          setPagination(data.pagination);
        } else {
          throw new Error('Failed to fetch leads');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeads();
  }, [options.rmId, options.status, options.limit, options.offset]);

  const refresh = async () => {
    setIsLoading(true);
    // Trigger re-fetch by updating a dependency
  };

  return {
    leads,
    isLoading,
    error,
    pagination,
    refresh,
  };
}

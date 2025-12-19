/**
 * @file hooks/useSuggestions.ts
 * @description Custom hook for fetching and managing engagement suggestions
 */

'use client';

import { useEffect, useState } from 'react';
import { useSuggestionStore } from '@/store/suggestion-store';
import type { EngagementSuggestion, SuggestionFilters } from '@/types';

interface UseSuggestionsOptions {
  filters?: SuggestionFilters;
  autoFetch?: boolean;
}

export function useSuggestions(options: UseSuggestionsOptions = {}) {
  const { filters, autoFetch = true } = options;
  
  const {
    suggestions,
    isLoading,
    error,
    setSuggestions,
    setLoading,
    setError,
  } = useSuggestionStore();
  
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  
  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      if (filters?.status && filters.status.length > 0) {
        params.append('status', filters.status[0]);
      }
      
      if (filters?.priority && filters.priority.length > 0) {
        params.append('priority', filters.priority[0]);
      }
      
      const response = await fetch(`/api/suggestions?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        // Convert date strings to Date objects
        const suggestionsWithDates = data.data.suggestions.map((s: EngagementSuggestion) => ({
          ...s,
          generatedAt: new Date(s.generatedAt),
          expiresAt: s.expiresAt ? new Date(s.expiresAt) : undefined,
          viewedAt: s.viewedAt ? new Date(s.viewedAt) : undefined,
          actionedAt: s.actionedAt ? new Date(s.actionedAt) : undefined,
          snoozedUntil: s.snoozedUntil ? new Date(s.snoozedUntil) : undefined,
          dismissedAt: s.dismissedAt ? new Date(s.dismissedAt) : undefined,
          contactedAt: s.contactedAt ? new Date(s.contactedAt) : undefined,
          signal: {
            ...s.signal,
            detectedAt: new Date(s.signal.detectedAt),
          },
        }));
        
        setSuggestions(suggestionsWithDates);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch suggestions');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching suggestions:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };
  
  useEffect(() => {
    if (autoFetch) {
      fetchSuggestions();
    }
  }, [autoFetch, refetchTrigger, JSON.stringify(filters)]);
  
  return {
    suggestions,
    isLoading,
    error,
    refetch,
  };
}

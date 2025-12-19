/**
 * @file app/hooks/useSuggestedActions.ts
 * @description Hook for fetching AI-suggested actions for prospects
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SuggestedAction } from '@/types';

interface UseSuggestedActionsReturn {
  actions: SuggestedAction[];
  isLoading: boolean;
  error: string | null;
  reasoning: string;
  refreshActions: () => Promise<void>;
}

export function useSuggestedActions(prospectId: string | null): UseSuggestedActionsReturn {
  const [actions, setActions] = useState<SuggestedAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState('');

  const fetchActions = useCallback(async () => {
    if (!prospectId) {
      setActions([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/prospects/${prospectId}/actions`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setActions(data.data.actions);
        setReasoning(data.data.reasoning);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch suggested actions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching suggested actions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [prospectId]);

  const refreshActions = useCallback(async () => {
    await fetchActions();
  }, [fetchActions]);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  return {
    actions,
    isLoading,
    error,
    reasoning,
    refreshActions,
  };
}

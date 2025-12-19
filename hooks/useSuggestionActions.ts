/**
 * @file hooks/useSuggestionActions.ts
 * @description Custom hook for handling suggestion actions
 */

'use client';

import { useState } from 'react';
import { useSuggestionStore } from '@/store/suggestion-store';
import type { SnoozeDuration } from '@/types';

export function useSuggestionActions() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { updateSuggestion } = useSuggestionStore();
  
  const performAction = async (
    suggestionId: string,
    action: 'view' | 'contact' | 'snooze' | 'dismiss',
    data?: Record<string, unknown>
  ) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch(`/api/suggestions/${suggestionId}/actions`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, data }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${action} suggestion`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Update local store with the changes
        updateSuggestion(suggestionId, result.data);
        return true;
      } else {
        throw new Error(result.error?.message || `Failed to ${action} suggestion`);
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const markAsViewed = async (suggestionId: string) => {
    return performAction(suggestionId, 'view');
  };
  
  const markAsContacted = async (suggestionId: string, outcome?: string) => {
    return performAction(suggestionId, 'contact', { outcome });
  };
  
  const snoozeSuggestion = async (suggestionId: string, duration: SnoozeDuration) => {
    return performAction(suggestionId, 'snooze', { duration });
  };
  
  const dismissSuggestion = async (suggestionId: string, reason?: string) => {
    return performAction(suggestionId, 'dismiss', { reason });
  };
  
  return {
    isProcessing,
    markAsViewed,
    markAsContacted,
    snoozeSuggestion,
    dismissSuggestion,
  };
}

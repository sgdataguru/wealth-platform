/**
 * @file suggestion-store.ts
 * @description Zustand store for engagement suggestions state management
 * @module store/suggestion-store
 */

import { create } from 'zustand';
import type {
  EngagementSuggestion,
  SuggestionFilters,
  SnoozeDuration,
} from '@/types';

interface SuggestionState {
  // Data
  suggestions: EngagementSuggestion[];
  isLoading: boolean;
  error: string | null;
  
  // Filters
  filters: SuggestionFilters;
  
  // UI State
  selectedSuggestionId: string | null;
  newSuggestionsCount: number;
  
  // Actions
  setSuggestions: (suggestions: EngagementSuggestion[]) => void;
  addSuggestion: (suggestion: EngagementSuggestion) => void;
  updateSuggestion: (id: string, updates: Partial<EngagementSuggestion>) => void;
  removeSuggestion: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Filter Actions
  setFilters: (filters: SuggestionFilters) => void;
  resetFilters: () => void;
  
  // UI Actions
  setSelectedSuggestion: (id: string | null) => void;
  incrementNewCount: () => void;
  clearNewCount: () => void;
  
  // Suggestion Actions
  markAsViewed: (id: string) => void;
  markAsContacted: (id: string, outcome?: string) => void;
  snoozeSuggestion: (id: string, duration: SnoozeDuration) => void;
  dismissSuggestion: (id: string, reason?: string) => void;
}

const initialFilters: SuggestionFilters = {
  priority: undefined,
  category: undefined,
  status: undefined,
  dateRange: undefined,
};

export const useSuggestionStore = create<SuggestionState>((set, get) => ({
  // Initial state
  suggestions: [],
  isLoading: false,
  error: null,
  filters: initialFilters,
  selectedSuggestionId: null,
  newSuggestionsCount: 0,
  
  // Data actions
  setSuggestions: (suggestions) => set({ suggestions, isLoading: false }),
  
  addSuggestion: (suggestion) => {
    set((state) => ({
      suggestions: [suggestion, ...state.suggestions],
      newSuggestionsCount: state.newSuggestionsCount + 1,
    }));
  },
  
  updateSuggestion: (id, updates) => {
    set((state) => ({
      suggestions: state.suggestions.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  },
  
  removeSuggestion: (id) => {
    set((state) => ({
      suggestions: state.suggestions.filter((s) => s.id !== id),
    }));
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  // Filter actions
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: initialFilters }),
  
  // UI actions
  setSelectedSuggestion: (id) => set({ selectedSuggestionId: id }),
  incrementNewCount: () => set((state) => ({ newSuggestionsCount: state.newSuggestionsCount + 1 })),
  clearNewCount: () => set({ newSuggestionsCount: 0 }),
  
  // Suggestion actions
  markAsViewed: (id) => {
    get().updateSuggestion(id, {
      status: 'viewed',
      viewedAt: new Date(),
    });
  },
  
  markAsContacted: (id, outcome) => {
    get().updateSuggestion(id, {
      status: 'contacted',
      contactedAt: new Date(),
      actionedAt: new Date(),
      outcome,
    });
  },
  
  snoozeSuggestion: (id, duration) => {
    const durationMap: Record<SnoozeDuration, number> = {
      '1d': 1,
      '3d': 3,
      '7d': 7,
    };
    
    const days = durationMap[duration];
    const snoozedUntil = new Date();
    snoozedUntil.setDate(snoozedUntil.getDate() + days);
    
    get().updateSuggestion(id, {
      status: 'snoozed',
      snoozedUntil,
    });
  },
  
  dismissSuggestion: (id, reason) => {
    get().updateSuggestion(id, {
      status: 'dismissed',
      dismissedAt: new Date(),
      dismissReason: reason,
    });
  },
}));

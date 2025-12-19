/**
 * @file filter-store.ts
 * @description Zustand store for filter state management
 * @module store/filter-store
 */

import { create } from 'zustand';
import type { FilterState, FilterType, FilterOptions, AppliedFilters } from '@/types/filter.types';

const STORAGE_KEY = 'uhnw_filters';

const initialFilters: AppliedFilters = {
  cities: [],
  sectors: [],
  network_ids: [],
  cluster_ids: [],
};

/**
 * Filter store using Zustand
 */
export const useFilterStore = create<FilterState>((set, get) => ({
  // Initial state
  appliedFilters: initialFilters,
  filterOptions: null,
  isFilterPanelOpen: false,
  isLoadingOptions: false,
  isApplyingFilters: false,
  searchQueries: {
    cities: '',
    sectors: '',
    networks: '',
    clusters: '',
  },
  filteredCount: 0,

  // Filter management actions
  setFilter: (filterType: FilterType, values: string[]) => {
    set((state) => ({
      appliedFilters: {
        ...state.appliedFilters,
        [filterType]: values,
      },
    }));
    get().saveFiltersToStorage();
  },

  addFilterValue: (filterType: FilterType, value: string) => {
    set((state) => {
      const currentValues = state.appliedFilters[filterType];
      if (currentValues.includes(value)) {
        return state;
      }
      return {
        appliedFilters: {
          ...state.appliedFilters,
          [filterType]: [...currentValues, value],
        },
      };
    });
    get().saveFiltersToStorage();
  },

  removeFilterValue: (filterType: FilterType, value: string) => {
    set((state) => ({
      appliedFilters: {
        ...state.appliedFilters,
        [filterType]: state.appliedFilters[filterType].filter((v) => v !== value),
      },
    }));
    get().saveFiltersToStorage();
  },

  clearFilter: (filterType: FilterType) => {
    set((state) => ({
      appliedFilters: {
        ...state.appliedFilters,
        [filterType]: [],
      },
    }));
    get().saveFiltersToStorage();
  },

  clearAllFilters: () => {
    set({ appliedFilters: initialFilters });
    get().saveFiltersToStorage();
  },

  // UI actions
  toggleFilterPanel: () => {
    set((state) => ({ isFilterPanelOpen: !state.isFilterPanelOpen }));
  },

  setFilterPanelOpen: (open: boolean) => {
    set({ isFilterPanelOpen: open });
  },

  // Search actions
  setSearchQuery: (filterType: keyof FilterState['searchQueries'], query: string) => {
    set((state) => ({
      searchQueries: {
        ...state.searchQueries,
        [filterType]: query,
      },
    }));
  },

  // Data actions
  loadFilterOptions: async () => {
    set({ isLoadingOptions: true });
    try {
      const response = await fetch('/api/filters/options');
      const data = await response.json();
      
      if (data.success) {
        set({ filterOptions: data.data, isLoadingOptions: false });
      } else {
        console.error('Failed to load filter options:', data.error);
        set({ isLoadingOptions: false });
      }
    } catch (error) {
      console.error('Error loading filter options:', error);
      set({ isLoadingOptions: false });
    }
  },

  setFilterOptions: (options: FilterOptions) => {
    set({ filterOptions: options });
  },

  setFilteredCount: (count: number) => {
    set({ filteredCount: count });
  },

  // Persistence actions
  saveFiltersToUrl: () => {
    const { appliedFilters } = get();
    const params = new URLSearchParams();

    Object.entries(appliedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        values.forEach((value: string) => {
          params.append(key, value);
        });
      }
    });

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  },

  loadFiltersFromUrl: (searchParams: URLSearchParams) => {
    const filters: AppliedFilters = {
      cities: searchParams.getAll('cities'),
      sectors: searchParams.getAll('sectors'),
      network_ids: searchParams.getAll('network_ids'),
      cluster_ids: searchParams.getAll('cluster_ids'),
    };
    set({ appliedFilters: filters });
  },

  saveFiltersToStorage: () => {
    const { appliedFilters } = get();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appliedFilters));
    } catch (error) {
      console.error('Error saving filters to storage:', error);
    }
  },

  loadFiltersFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const filters = JSON.parse(stored);
        set({ appliedFilters: filters });
      }
    } catch (error) {
      console.error('Error loading filters from storage:', error);
    }
  },
}));

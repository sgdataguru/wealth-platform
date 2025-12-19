/**
 * @file filter.types.ts
 * @description Type definitions for prospect filtering functionality
 * @module types/filter
 */

/**
 * Filter type categories
 */
export type FilterType = 'cities' | 'sectors' | 'network_ids' | 'cluster_ids';

/**
 * Network represents a professional network or association
 */
export interface Network {
  id: string;
  name: string;
  description: string;
  member_count: number;
  created_at: Date;
}

/**
 * Cluster represents a behavioral or wealth-based segment
 */
export interface Cluster {
  id: string;
  name: string;
  description: string;
  criteria: Record<string, unknown>;
  member_count: number;
  created_at: Date;
}

/**
 * Available filter options for each filter type
 */
export interface FilterOptions {
  cities: string[];
  sectors: string[];
  networks: Network[];
  clusters: Cluster[];
}

/**
 * Currently applied filters
 */
export interface AppliedFilters {
  cities: string[];
  sectors: string[];
  network_ids: string[];
  cluster_ids: string[];
}

/**
 * Filter state for the store
 */
export interface FilterState {
  // Filter data
  appliedFilters: AppliedFilters;
  filterOptions: FilterOptions | null;
  
  // UI state
  isFilterPanelOpen: boolean;
  isLoadingOptions: boolean;
  isApplyingFilters: boolean;
  
  // Search state for each filter type
  searchQueries: {
    cities: string;
    sectors: string;
    networks: string;
    clusters: string;
  };
  
  // Results
  filteredCount: number;
  
  // Actions - Filter management
  setFilter: (filterType: FilterType, values: string[]) => void;
  addFilterValue: (filterType: FilterType, value: string) => void;
  removeFilterValue: (filterType: FilterType, value: string) => void;
  clearFilter: (filterType: FilterType) => void;
  clearAllFilters: () => void;
  
  // Actions - UI
  toggleFilterPanel: () => void;
  setFilterPanelOpen: (open: boolean) => void;
  
  // Actions - Search
  setSearchQuery: (filterType: keyof FilterState['searchQueries'], query: string) => void;
  
  // Actions - Data
  loadFilterOptions: () => Promise<void>;
  setFilterOptions: (options: FilterOptions) => void;
  setFilteredCount: (count: number) => void;
  
  // Actions - Persistence
  saveFiltersToUrl: () => void;
  loadFiltersFromUrl: (searchParams: URLSearchParams) => void;
  saveFiltersToStorage: () => void;
  loadFiltersFromStorage: () => void;
}

/**
 * Client with filter fields
 */
export interface FilterableClient {
  id: string;
  name: string;
  company: string;
  city: string;
  sector: string;
  network_id: string | null;
  cluster_tags: string[];
}

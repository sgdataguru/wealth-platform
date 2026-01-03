/**
 * @file FilterPanel.tsx
 * @description Main filter panel component with all filter sections
 * @component
 */

'use client';

import React, { useEffect } from 'react';
import { useFilterStore } from '@/store/filter-store';
import { FilterSection } from './FilterSection';

export interface FilterPanelProps {
  className?: string;
}

/**
 * Main filter panel with all filter types
 */
export function FilterPanel({ className = '' }: FilterPanelProps) {
  const {
    appliedFilters,
    filterOptions,
    isLoadingOptions,
    searchQueries,
    loadFilterOptions,
    addFilterValue,
    removeFilterValue,
    clearAllFilters,
    setSearchQuery,
  } = useFilterStore();

  // Load filter options on mount
  useEffect(() => {
    if (!filterOptions) {
      loadFilterOptions();
    }
  }, [filterOptions, loadFilterOptions]);

  const handleFilterChange = (
    filterType: 'cities' | 'sectors' | 'network_ids' | 'cluster_ids' | 'prospect_types' | 'segments' | 'tiers',
    value: string,
    checked: boolean
  ) => {
    if (checked) {
      addFilterValue(filterType, value);
    } else {
      removeFilterValue(filterType, value);
    }
  };

  if (isLoadingOptions) {
    return (
      <div className={`bg-white border-r border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const hasFilters =
    appliedFilters.cities.length > 0 ||
    appliedFilters.sectors.length > 0 ||
    appliedFilters.network_ids.length > 0 ||
    appliedFilters.cluster_ids.length > 0 ||
    appliedFilters.segments.length > 0 ||
    appliedFilters.tiers.length > 0;

  return (
    <div className={`bg-white border-r border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
            Filters
          </h2>
          {hasFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-[#2A2447] hover:text-[#1A1332] font-medium transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {/* City Filter */}
        <FilterSection
          title="City"
          options={filterOptions?.cities || []}
          selected={appliedFilters.cities}
          searchQuery={searchQueries.cities}
          onSearchChange={(query) => setSearchQuery('cities', query)}
          onChange={(value, checked) => handleFilterChange('cities', value, checked)}
        />

        {/* Sector Filter */}
        <FilterSection
          title="Sector"
          options={filterOptions?.sectors || []}
          selected={appliedFilters.sectors}
          searchQuery={searchQueries.sectors}
          onSearchChange={(query) => setSearchQuery('sectors', query)}
          onChange={(value, checked) => handleFilterChange('sectors', value, checked)}
        />

        {/* Network Filter */}
        <FilterSection
          title="Network"
          options={filterOptions?.networks.map((n) => n.name) || []}
          selected={appliedFilters.network_ids}
          searchQuery={searchQueries.networks}
          onSearchChange={(query) => setSearchQuery('networks', query)}
          onChange={(value, checked) => {
            // Find the network ID from the name
            const network = filterOptions?.networks.find((n) => n.name === value);
            if (network) {
              handleFilterChange('network_ids', network.id, checked);
            }
          }}
        />

        {/* Cluster Filter */}
        <FilterSection
          title="Cluster"
          options={filterOptions?.clusters.map((c) => c.name) || []}
          selected={appliedFilters.cluster_ids}
          searchQuery={searchQueries.clusters}
          onSearchChange={(query) => setSearchQuery('clusters', query)}
          onChange={(value, checked) => {
            // Find the cluster ID from the name
            const cluster = filterOptions?.clusters.find((c) => c.name === value);
            if (cluster) {
              handleFilterChange('cluster_ids', cluster.id, checked);
            }
          }}
        />

        {/* Prospect Type Filter */}
        <FilterSection
          title="Prospect Type"
          options={filterOptions?.prospectTypes || []}
          selected={appliedFilters.prospect_types}
          searchQuery={searchQueries.prospectTypes}
          onSearchChange={(query) => setSearchQuery('prospectTypes', query)}
          onChange={(value, checked) => handleFilterChange('prospect_types', value, checked)}
        />

        {/* Segment Filter */}
        <FilterSection
          title="Segment"
          options={filterOptions?.segments || []}
          selected={appliedFilters.segments}
          searchQuery={searchQueries.segments}
          onSearchChange={(query) => setSearchQuery('segments', query)}
          onChange={(value, checked) => handleFilterChange('segments', value, checked)}
        />

        {/* Client Tier Filter */}
        <FilterSection
          title="Client Tier"
          options={filterOptions?.tiers || []}
          selected={appliedFilters.tiers}
          searchQuery={searchQueries.tiers}
          onSearchChange={(query) => setSearchQuery('tiers', query)}
          onChange={(value, checked) => handleFilterChange('tiers', value, checked)}
        />
      </div>
    </div>
  );
}

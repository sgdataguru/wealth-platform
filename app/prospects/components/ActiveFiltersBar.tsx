/**
 * @file ActiveFiltersBar.tsx
 * @description Bar showing active filters with pills and clear all button
 * @component
 */

'use client';

import React from 'react';
import { FilterPill } from './FilterPill';
import type { AppliedFilters } from '@/types/filter.types';

export interface ActiveFiltersBarProps {
  filters: AppliedFilters;
  onRemoveFilter: (filterType: keyof AppliedFilters, value: string) => void;
  onClearAll: () => void;
  resultCount: number;
}

/**
 * Active filters bar with pills and result count
 */
export function ActiveFiltersBar({
  filters,
  onRemoveFilter,
  onClearAll,
  resultCount,
}: ActiveFiltersBarProps) {
  const hasFilters =
    filters.cities.length > 0 ||
    filters.sectors.length > 0 ||
    filters.network_ids.length > 0 ||
    filters.cluster_ids.length > 0;

  if (!hasFilters) {
    return null;
  }

  const totalFilters =
    filters.cities.length +
    filters.sectors.length +
    filters.network_ids.length +
    filters.cluster_ids.length;

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Result count */}
        <div className="text-sm text-[#5A6C7D] font-medium">
          {resultCount} {resultCount === 1 ? 'prospect' : 'prospects'} found
        </div>

        {/* Divider */}
        {hasFilters && <div className="w-px h-6 bg-gray-300" />}

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {filters.cities.map((city) => (
            <FilterPill
              key={`city-${city}`}
              label={city}
              onRemove={() => onRemoveFilter('cities', city)}
            />
          ))}
          
          {filters.sectors.map((sector) => (
            <FilterPill
              key={`sector-${sector}`}
              label={sector}
              onRemove={() => onRemoveFilter('sectors', sector)}
            />
          ))}
          
          {filters.network_ids.map((networkId) => (
            <FilterPill
              key={`network-${networkId}`}
              label={networkId}
              onRemove={() => onRemoveFilter('network_ids', networkId)}
            />
          ))}
          
          {filters.cluster_ids.map((clusterId) => (
            <FilterPill
              key={`cluster-${clusterId}`}
              label={clusterId}
              onRemove={() => onRemoveFilter('cluster_ids', clusterId)}
            />
          ))}
        </div>

        {/* Clear all button */}
        {totalFilters > 1 && (
          <>
            <div className="w-px h-6 bg-gray-300" />
            <button
              onClick={onClearAll}
              className="text-sm text-[#5A6C7D] hover:text-[#2A2447] font-medium transition-colors"
            >
              Clear all ({totalFilters})
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * @file FilterSection.tsx
 * @description Reusable filter section component with search and checkboxes
 * @component
 */

'use client';

import React, { useMemo } from 'react';
import { SearchInput } from '@/app/components/ui/SearchInput';
import { Checkbox } from '@/app/components/ui/Checkbox';

export interface FilterSectionProps {
  title: string;
  options: string[];
  selected: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onChange: (value: string, checked: boolean) => void;
  className?: string;
}

/**
 * Reusable filter section with search and multi-select
 */
export function FilterSection({
  title,
  options,
  selected,
  searchQuery,
  onSearchChange,
  onChange,
  className = '',
}: FilterSectionProps) {
  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((option) =>
      option.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  const selectedCount = selected.length;

  return (
    <div className={`border-b border-gray-200 pb-4 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#1A1A2E] uppercase tracking-wide">
          {title}
        </h3>
        {selectedCount > 0 && (
          <span className="px-2 py-0.5 bg-[#2A2447] text-white text-xs font-semibold rounded-full">
            {selectedCount}
          </span>
        )}
      </div>

      {/* Search Input */}
      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={`Search ${title.toLowerCase()}...`}
        className="mb-3"
      />

      {/* Options List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredOptions.length === 0 ? (
          <div className="text-sm text-[#8E99A4] py-2">
            No {title.toLowerCase()} found
          </div>
        ) : (
          filteredOptions.map((option) => (
            <Checkbox
              key={option}
              label={option}
              checked={selected.includes(option)}
              onChange={(checked) => onChange(option, checked)}
            />
          ))
        )}
      </div>
    </div>
  );
}

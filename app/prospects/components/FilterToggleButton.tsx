/**
 * @file FilterToggleButton.tsx
 * @description Floating action button to toggle filter panel on mobile
 * @component
 */

'use client';

import React from 'react';

export interface FilterToggleButtonProps {
  onClick: () => void;
  filterCount: number;
}

/**
 * Floating action button for mobile filter toggle
 */
export function FilterToggleButton({ onClick, filterCount }: FilterToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 md:hidden
                 bg-[#1E3A5F] text-white
                 rounded-full shadow-lg
                 w-14 h-14 flex items-center justify-center
                 hover:bg-[#0A1628] transition-all duration-200
                 hover:scale-110 active:scale-95"
      aria-label="Toggle filters"
    >
      {/* Filter Icon */}
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
        />
      </svg>
      
      {/* Badge showing active filter count */}
      {filterCount > 0 && (
        <span className="absolute -top-1 -right-1
                       bg-[#C9A227] text-[#0A1628]
                       rounded-full w-6 h-6
                       flex items-center justify-center
                       text-xs font-bold">
          {filterCount}
        </span>
      )}
    </button>
  );
}

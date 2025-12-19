/**
 * @file FilterPill.tsx
 * @description Individual filter pill component with remove button
 * @component
 */

'use client';

import React from 'react';

export interface FilterPillProps {
  label: string;
  onRemove: () => void;
  className?: string;
}

/**
 * Filter pill component showing an active filter
 */
export function FilterPill({ label, onRemove, className = '' }: FilterPillProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5
                  bg-[#EBF4FF] text-[#1E3A5F] text-sm font-medium
                  border border-[#C9D6E8] rounded-full
                  transition-all duration-200
                  hover:bg-[#D6E9FF] hover:shadow-sm
                  ${className}`}
    >
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="hover:text-[#DC3545] transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

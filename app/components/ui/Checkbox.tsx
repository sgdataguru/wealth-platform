/**
 * @file Checkbox.tsx
 * @description Custom checkbox component with premium styling
 * @component
 */

'use client';

import React from 'react';

export interface CheckboxProps {
  id?: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Checkbox component with custom styling for filters
 */
export function Checkbox({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-2 cursor-pointer group ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="w-4 h-4 rounded border-2 border-gray-300 text-[#1E3A5F] 
                   focus:ring-2 focus:ring-[#1E3A5F] focus:ring-opacity-30
                   checked:bg-[#1E3A5F] checked:border-[#1E3A5F]
                   transition-all duration-200 cursor-pointer
                   disabled:cursor-not-allowed disabled:opacity-50"
      />
      <span className="text-sm text-[#1A1A2E] group-hover:text-[#1E3A5F] transition-colors">
        {label}
      </span>
    </label>
  );
}

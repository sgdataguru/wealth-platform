'use client'

import React from 'react'

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
}

export default function ShariahToggle({ checked, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-gray-700">Shariah-Only</label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5"
        aria-label="Shariah Only Toggle"
      />
    </div>
  )
}

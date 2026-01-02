/**
 * @file AuthoritySelector.tsx
 * @description Selector component for GCC regulatory authorities
 * @module components/features/compliance
 */

'use client';

import type { RegulatoryAuthority } from '@/types/compliance.types';

interface AuthoritySelectorProps {
  selected: RegulatoryAuthority | null;
  onChange: (authority: RegulatoryAuthority) => void;
}

const authorities = [
  { id: 'SAMA' as const, name: 'SAMA', fullName: 'Saudi Arabian Monetary Authority', flag: '🇸🇦' },
  { id: 'DIFC' as const, name: 'DIFC', fullName: 'Dubai International Financial Centre', flag: '🇦🇪' },
  { id: 'ADGM' as const, name: 'ADGM', fullName: 'Abu Dhabi Global Market', flag: '🇦🇪' },
  { id: 'CMA_SAUDI' as const, name: 'CMA', fullName: 'Capital Market Authority (Saudi)', flag: '🇸🇦' },
  { id: 'CBO' as const, name: 'CBO', fullName: 'Central Bank of Oman', flag: '🇴🇲' },
  { id: 'CBK' as const, name: 'CBK', fullName: 'Central Bank of Kuwait', flag: '🇰🇼' },
];

export default function AuthoritySelector({ selected, onChange }: AuthoritySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {authorities.map((authority) => (
        <button
          key={authority.id}
          onClick={() => onChange(authority.id)}
          className={`
            px-4 py-2 rounded-lg border-2 transition-all
            flex items-center gap-2
            ${
              selected === authority.id
                ? 'border-[#007B7A] bg-[#007B7A]/10 text-[#007B7A] font-semibold'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }
          `}
          title={authority.fullName}
        >
          <span className="text-xl">{authority.flag}</span>
          <span className="text-sm">{authority.name}</span>
        </button>
      ))}
    </div>
  );
}

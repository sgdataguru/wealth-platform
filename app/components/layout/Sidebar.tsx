/**
 * @file Sidebar.tsx
 * @description Navigation sidebar with filters
 */

'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import { useUserRole } from '@/app/hooks/useUserRole';

interface SidebarProps {
  activePage?: string;
}

export default function Sidebar({ activePage = 'home' }: SidebarProps) {
  const { role } = useUserRole();
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');

  // Role-aware navigation items
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      href: role === 'executive' ? '/executive' : '/rm'
    },
    { id: 'prospects', label: 'Prospects', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', href: '/prospects' },
    { id: 'signals', label: 'Signals', icon: 'M13 10V3L4 14h7v7l9-11h-7z', href: '/signals' },
    { id: 'network', label: 'Network', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9', href: '/network' },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      href: role === 'executive' ? '/executive/analytics' : '/rm/analytics'
    },
    {
      id: 'ai-insights',
      label: 'AI Insights',
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      href: role === 'executive' ? '/executive/ai-insights' : '/rm/ai-insights'
    },
    {
      id: 'compliance',
      label: 'Compliance',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      href: '/compliance'
    },
  ];

  const cities = ['All', 'Dubai', 'Abu Dhabi', 'Riyadh', 'Doha', 'Jeddah'];
  const sectors = ['All', 'Technology', 'Finance', 'Healthcare', 'Real Estate', 'Manufacturing'];

  return (
    <aside className="w-72 bg-[var(--surface-card)] border-r border-[var(--header-border)] flex flex-col h-[calc(100vh-80px)] sticky top-20 backdrop-blur-md shadow-[var(--shadow-lg)]">
      {/* Navigation */}
      <nav className="p-5 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${activePage === item.id
                ? 'bg-[rgba(212,175,55,0.1)] text-[var(--text-primary)] border border-[rgba(212,175,55,0.35)] shadow-[var(--shadow-md)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--control-surface)] hover:text-[var(--text-primary)]'
              }
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="font-medium">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-5 border-t border-[rgba(217,180,114,0.25)]" />

      {/* Filters */}
      <div className="p-5 flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
          Filters
        </h3>

        {/* City Filter */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            City
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--input-surface)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[rgba(217,180,114,0.55)] transition-colors"
          >
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Sector Filter */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Sector
          </label>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--input-surface)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[rgba(217,180,114,0.55)] transition-colors"
          >
            {sectors.map((sector) => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>

        {/* Apply Button */}
        <Button variant="primary" size="sm" className="w-full shadow-[var(--shadow-md)]">
          Apply Filters
        </Button>
      </div>
    </aside>
  );
}

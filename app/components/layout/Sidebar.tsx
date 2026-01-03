/**
 * @file Sidebar.tsx
 * @description Navigation sidebar with premium Heroicons 2
 */

'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import { useUserRole } from '@/app/hooks/useUserRole';
import { NavigationIcons } from '@/app/components/icons';
import type { NavigationIconName } from '@/app/components/icons';

interface SidebarProps {
  activePage?: string;
}

export default function Sidebar({ activePage = 'home' }: SidebarProps) {
  const { role } = useUserRole();
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');

  // Role-aware navigation items with premium icons
  const navItems: Array<{
    id: string;
    label: string;
    iconName: NavigationIconName;
    href: string;
  }> = [
    {
      id: 'home',
      label: 'Home',
      iconName: 'Home',
      href: role === 'executive' ? '/executive' : '/rm'
    },
    { id: 'prospects', label: 'Prospects', iconName: 'Prospects', href: '/prospects' },
    { id: 'signals', label: 'Signals', iconName: 'Signals', href: '/signals' },
    { id: 'network', label: 'Network', iconName: 'Network', href: '/network' },
    {
      id: 'analytics',
      label: 'Analytics',
      iconName: 'Analytics',
      href: role === 'executive' ? '/executive/analytics' : '/rm/analytics'
    },
    {
      id: 'ai-insights',
      label: 'AI Insights',
      iconName: 'AIInsights',
      href: role === 'executive' ? '/executive/ai-insights' : '/rm/ai-insights'
    },
    {
      id: 'compliance',
      label: 'Compliance',
      iconName: 'Compliance',
      href: '/compliance'
    },
    {
      id: 'deep-dive',
      label: 'Deep Dive',
      iconName: 'DeepDive',
      href: '/deep-dive'
    },
  ];

  const cities = ['All', 'Dubai', 'Abu Dhabi', 'Riyadh', 'Doha', 'Jeddah'];
  const sectors = ['All', 'Technology', 'Finance', 'Healthcare', 'Real Estate', 'Manufacturing'];

  return (
    <aside className="w-72 bg-[var(--surface-card)] border-r border-[var(--header-border)] flex flex-col h-[calc(100vh-80px)] sticky top-20 backdrop-blur-md shadow-[var(--shadow-lg)]">
      {/* Navigation */}
      <nav className="p-5 space-y-2">
        {navItems.map((item) => {
          const Icon = NavigationIcons[item.iconName];
          return (
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
              <Icon className="w-5 h-5" strokeWidth={1.8} />
              <span className="font-medium">{item.label}</span>
            </a>
          );
        })}
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

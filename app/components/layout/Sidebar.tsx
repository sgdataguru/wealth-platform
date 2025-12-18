/**
 * @file Sidebar.tsx
 * @description Navigation sidebar with filters
 */

'use client';

import { useState } from 'react';
import Button from '../ui/Button';

interface SidebarProps {
  activePage?: string;
}

const navItems = [
  { id: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'prospects', label: 'Prospects', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'signals', label: 'Signals', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: 'graph', label: 'Graph', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id: 'analytics', label: 'Analytics', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
];

const cities = ['All', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'];
const sectors = ['All', 'Technology', 'Finance', 'Healthcare', 'Real Estate', 'Manufacturing'];

export default function Sidebar({ activePage = 'home' }: SidebarProps) {
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-64px)] sticky top-16">
      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${activePage === item.id
                ? 'bg-[#0A1628] text-white'
                : 'text-[#5A6C7D] hover:bg-[#F8F9FA] hover:text-[#1A1A2E]'
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
      <div className="mx-4 border-t border-gray-200" />

      {/* Filters */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider mb-4">
          Filters
        </h3>

        {/* City Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#5A6C7D] mb-2">
            City
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-3 py-2 bg-[#F8F9FA] border border-gray-200 rounded-lg text-[#1A1A2E] focus:outline-none focus:border-[#1E3A5F] transition-colors"
          >
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Sector Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#5A6C7D] mb-2">
            Sector
          </label>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full px-3 py-2 bg-[#F8F9FA] border border-gray-200 rounded-lg text-[#1A1A2E] focus:outline-none focus:border-[#1E3A5F] transition-colors"
          >
            {sectors.map((sector) => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>

        {/* Apply Button */}
        <Button variant="primary" size="sm" className="w-full">
          Apply Filters
        </Button>
      </div>
    </aside>
  );
}

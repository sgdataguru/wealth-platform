/**
 * @file page.tsx
 * @description Prospects page with enhanced score display and filtering
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Header, Sidebar } from '../components/layout';
import { EnhancedProspectCard } from '../components/features';
import { FilterPanel } from './components/FilterPanel';
import { ActiveFiltersBar } from './components/ActiveFiltersBar';
import { FilterToggleButton } from './components/FilterToggleButton';
import { Sheet } from '../components/ui/Sheet';
import { useFilterStore } from '@/store/filter-store';
import type { Prospect } from '@/types';

// Mock data for demonstration
const mockProspects: Prospect[] = [
  {
    id: '1',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    initials: 'RK',
    title: 'Director',
    company: 'Tech Innovations Pvt Ltd',
    location: 'Mumbai',
    sector: 'Technology',
    network: 'TiE',
    email: 'rajesh@techinnovations.com',
    phone: '+91 98765 43210',
    leadScore: 92,
    scoreCategory: 'excellent',
    scoreBreakdown: [],
    signals: [
      {
        id: 's1',
        type: 'ipo',
        severity: 'critical',
        title: 'IPO Filing',
        description: 'Company filed DRHP with SEBI for public listing',
        source: 'Exchange Data',
        createdAt: new Date('2024-12-15'),
        isActioned: false,
        confidence: 0.95,
      },
      {
        id: 's2',
        type: 'funding',
        severity: 'high',
        title: 'Series C Funding',
        description: 'Raised $50M from Sequoia Capital',
        source: 'PrivateCircle',
        createdAt: new Date('2024-12-10'),
        isActioned: true,
        confidence: 0.9,
      },
      {
        id: 's3',
        type: 'board',
        severity: 'medium',
        title: 'Board Change',
        description: 'Appointed new independent director',
        source: 'Zauba Corp',
        createdAt: new Date('2024-11-28'),
        isActioned: true,
        confidence: 0.8,
      },
    ],
    lastContacted: new Date('2024-12-14'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: '2',
    firstName: 'Anita',
    lastName: 'Patel',
    initials: 'AP',
    title: 'CEO',
    company: 'FinServ Holdings Ltd',
    location: 'Delhi',
    sector: 'Finance',
    network: 'YPO',
    email: 'anita@finservholdings.com',
    phone: '+91 98765 43211',
    leadScore: 87,
    scoreCategory: 'good',
    scoreBreakdown: [],
    signals: [
      {
        id: 's4',
        type: 'acquisition',
        severity: 'high',
        title: 'Acquisition Talks',
        description: 'In advanced discussions with PE firms for acquisition',
        source: 'VCCircle',
        createdAt: new Date('2024-12-12'),
        isActioned: false,
        confidence: 0.85,
      },
      {
        id: 's5',
        type: 'corporate_action',
        severity: 'medium',
        title: 'Corporate Restructuring',
        description: 'Announced corporate restructuring plan',
        source: 'NewsAPI',
        createdAt: new Date('2024-12-05'),
        isActioned: true,
        confidence: 0.75,
      },
    ],
    lastContacted: new Date('2024-12-10'),
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-12-12'),
  },
  {
    id: '3',
    firstName: 'Vikram',
    lastName: 'Singh',
    initials: 'VS',
    title: 'Founder & CEO',
    company: 'GreenEnergy Solutions',
    location: 'Bangalore',
    sector: 'Clean Energy',
    network: 'EO',
    email: 'vikram@greenenergy.com',
    phone: '+91 98765 43212',
    leadScore: 72,
    scoreCategory: 'good',
    scoreBreakdown: [],
    signals: [
      {
        id: 's6',
        type: 'funding',
        severity: 'medium',
        title: 'Series B Funding',
        description: 'Raised $30M in Series B round',
        source: 'PrivateCircle',
        createdAt: new Date('2024-11-20'),
        isActioned: false,
        confidence: 0.9,
      },
    ],
    lastContacted: new Date('2024-11-15'),
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-11-20'),
  },
  {
    id: '4',
    firstName: 'Priya',
    lastName: 'Sharma',
    initials: 'PS',
    title: 'Managing Director',
    company: 'Retail Dynamics India',
    location: 'Mumbai',
    sector: 'Retail',
    network: 'TiE',
    email: 'priya@retaildynamics.com',
    phone: '+91 98765 43213',
    leadScore: 45,
    scoreCategory: 'fair',
    scoreBreakdown: [],
    signals: [
      {
        id: 's7',
        type: 'director_change',
        severity: 'low',
        title: 'Director Resignation',
        description: 'CFO resigned from board',
        source: 'Zauba Corp',
        createdAt: new Date('2024-10-15'),
        isActioned: true,
        confidence: 0.7,
      },
    ],
    lastContacted: null,
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-10-15'),
  },
];

export default function ProspectsPage() {
  const {
    appliedFilters,
    removeFilterValue,
    clearAllFilters,
    setFilteredCount,
  } = useFilterStore();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleCall = (prospect: Prospect) => {
    console.log('Calling:', prospect.firstName, prospect.lastName);
  };
  
  const handleEmail = (prospect: Prospect) => {
    console.log('Emailing:', prospect.firstName, prospect.lastName);
  };

  // Filter prospects based on applied filters
  const filteredProspects = useMemo(() => {
    let filtered = mockProspects;

    // Apply city filter
    if (appliedFilters.cities.length > 0) {
      filtered = filtered.filter((p) =>
        appliedFilters.cities.includes(p.location)
      );
    }

    // Apply sector filter
    if (appliedFilters.sectors.length > 0) {
      filtered = filtered.filter((p) =>
        appliedFilters.sectors.includes(p.sector)
      );
    }

    // Apply network filter (simplified - in real app, check network_id)
    if (appliedFilters.network_ids.length > 0) {
      filtered = filtered.filter((p) =>
        appliedFilters.network_ids.some(id => p.network.includes(id))
      );
    }

    // For clusters, we'd need cluster_tags on prospects
    // Simplified implementation for demo

    return filtered;
  }, [appliedFilters]);

  // Update filtered count
  useEffect(() => {
    setFilteredCount(filteredProspects.length);
  }, [filteredProspects.length, setFilteredCount]);

  // Calculate total active filters
  const totalFilters =
    appliedFilters.cities.length +
    appliedFilters.sectors.length +
    appliedFilters.network_ids.length +
    appliedFilters.cluster_ids.length;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header userName="John Smith" userInitials="JS" />
      
      <div className="flex">
        <Sidebar activePage="prospects" />
        
        {/* Desktop Filter Panel */}
        <div className="hidden lg:block w-80 sticky top-0 h-screen overflow-y-auto">
          <FilterPanel />
        </div>
        
        <main className="flex-1 flex flex-col">
          {/* Active Filters Bar */}
          <ActiveFiltersBar
            filters={appliedFilters}
            onRemoveFilter={removeFilterValue}
            onClearAll={clearAllFilters}
            resultCount={filteredProspects.length}
          />
          
          <div className="p-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                My Prospects
              </h1>
              <p className="text-[#5A6C7D] mt-1">
                View and manage your prospect pipeline with enhanced lead scores
              </p>
            </div>
            
            {/* Prospects Grid */}
            {filteredProspects.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No prospects found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                {filteredProspects.map((prospect) => (
                  <EnhancedProspectCard
                    key={prospect.id}
                    prospect={prospect}
                    onCall={() => handleCall(prospect)}
                    onEmail={() => handleEmail(prospect)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Filter Toggle Button */}
      <FilterToggleButton
        onClick={() => setIsMobileFilterOpen(true)}
        filterCount={totalFilters}
      />

      {/* Mobile Filter Sheet */}
      <Sheet
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Filters"
        footer={
          <button
            onClick={() => setIsMobileFilterOpen(false)}
            className="w-full bg-[#2A2447] text-white py-3 rounded-lg
                     hover:bg-[#1A1332] transition-colors font-medium"
          >
            Apply Filters
          </button>
        }
      >
        <div className="h-full overflow-y-auto">
          <FilterPanel className="border-none" />
        </div>
      </Sheet>
    </div>
  );
}

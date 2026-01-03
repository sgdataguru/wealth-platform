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
    firstName: 'Ahmad',
    lastName: 'Al Maktoum',
    initials: 'AA',
    title: 'Director',
    company: 'Tech Innovations DMCC',
    location: 'Dubai',
    sector: 'Technology',
    network: 'TiE',
    email: 'ahmad@techinnovations.ae',
    phone: '+971 50 123 4567',
    leadScore: 92,
    scoreCategory: 'excellent',
    scoreBreakdown: [],
    signals: [
      {
        id: 's1',
        type: 'ipo',
        severity: 'critical',
        title: 'IPO Filing',
        description: 'Company filed prospectus with DFSA for public listing',
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
    prospectType: 'Family Office',
    clientTier: 'UHNW',
    segment: 'Founder-led',
    totalWealth: 85000000,
    walletShare: 18,
  },
  {
    id: '2',
    firstName: 'Hessa',
    lastName: 'Al Nahyan',
    initials: 'HA',
    title: 'CEO',
    company: 'FinServ Holdings Ltd',
    location: 'Abu Dhabi',
    sector: 'Finance',
    network: 'YPO',
    email: 'hessa@finservholdings.ae',
    phone: '+971 50 234 5678',
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
    prospectType: 'Private Equity Fund',
    clientTier: 'UHNW',
    segment: 'PE-backed',
    totalWealth: 120000000,
    walletShare: 25,
  },
  {
    id: '3',
    firstName: 'Ali',
    lastName: 'Al Saud',
    initials: 'AA',
    title: 'Founder & CEO',
    company: 'GreenEnergy Solutions',
    location: 'Riyadh',
    sector: 'Clean Energy',
    network: 'EO',
    email: 'ali@greenenergy.sa',
    phone: '+966 50 345 6789',
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
    prospectType: 'Sovereign Wealth Fund (SWF)',
    clientTier: 'HNW',
    segment: 'Founder-led',
    totalWealth: 42000000,
    walletShare: 12,
  },
  {
    id: '4',
    firstName: 'Latifa',
    lastName: 'Al Qasimi',
    initials: 'LA',
    title: 'Managing Director',
    company: 'Retail Dynamics Gulf',
    location: 'Dubai',
    sector: 'Retail',
    network: 'TiE',
    email: 'latifa@retaildynamics.ae',
    phone: '+971 50 456 7890',
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
    prospectType: 'Pension Fund',
    clientTier: 'Emerging',
    segment: 'Founder-led',
    totalWealth: 8500000,
    walletShare: 8,
  },
  {
    id: '5',
    firstName: 'Khalid',
    lastName: 'Al Thani',
    initials: 'KT',
    title: 'Chairman',
    company: 'Gulf Investment Partners',
    location: 'Doha',
    sector: 'Finance',
    network: 'YPO',
    email: 'khalid@gulfpartners.qa',
    phone: '+974 50 567 8901',
    leadScore: 88,
    scoreCategory: 'excellent',
    scoreBreakdown: [],
    signals: [
      {
        id: 's8',
        type: 'acquisition',
        severity: 'high',
        title: 'Major Acquisition',
        description: 'Acquired regional competitor for $200M',
        source: 'Bloomberg Gulf',
        createdAt: new Date('2024-12-18'),
        isActioned: false,
        confidence: 0.92,
      },
    ],
    lastContacted: new Date('2024-12-16'),
    createdAt: new Date('2024-05-12'),
    updatedAt: new Date('2024-12-18'),
    prospectType: 'Family Office',
    clientTier: 'UHNW',
    segment: 'Family Office',
    totalWealth: 250000000,
    walletShare: 32,
  },
  {
    id: '6',
    firstName: 'Amal',
    lastName: 'Al Sabah',
    initials: 'AS',
    title: 'CFO',
    company: 'Healthcare Ventures MENA',
    location: 'Abu Dhabi',
    sector: 'Healthcare',
    network: 'EO',
    email: 'amal@healthcareventures.ae',
    phone: '+971 50 678 9012',
    leadScore: 79,
    scoreCategory: 'good',
    scoreBreakdown: [],
    signals: [
      {
        id: 's9',
        type: 'funding',
        severity: 'medium',
        title: 'Series A Funding',
        description: 'Secured $25M in Series A',
        source: 'PrivateCircle',
        createdAt: new Date('2024-12-01'),
        isActioned: true,
        confidence: 0.88,
      },
    ],
    lastContacted: new Date('2024-12-08'),
    createdAt: new Date('2024-06-20'),
    updatedAt: new Date('2024-12-01'),
    prospectType: 'Private Equity Fund',
    clientTier: 'HNW',
    segment: 'PE-backed',
    totalWealth: 38000000,
    walletShare: 15,
  },
  {
    id: '7',
    firstName: 'Hamad',
    lastName: 'Al Mansouri',
    initials: 'HM',
    title: 'CEO',
    company: 'Real Estate Development Co',
    location: 'Dubai',
    sector: 'Real Estate',
    network: 'TiE',
    email: 'hamad@realestate.ae',
    phone: '+971 50 789 0123',
    leadScore: 65,
    scoreCategory: 'good',
    scoreBreakdown: [],
    signals: [
      {
        id: 's10',
        type: 'corporate_action',
        severity: 'medium',
        title: 'New Project Launch',
        description: 'Announced $500M mixed-use development',
        source: 'Gulf News',
        createdAt: new Date('2024-11-25'),
        isActioned: false,
        confidence: 0.85,
      },
    ],
    lastContacted: new Date('2024-11-20'),
    createdAt: new Date('2024-07-15'),
    updatedAt: new Date('2024-11-25'),
    prospectType: 'Sovereign Wealth Fund (SWF)',
    clientTier: 'HNW',
    segment: 'Founder-led',
    totalWealth: 55000000,
    walletShare: 22,
  },
  {
    id: '8',
    firstName: 'Reem',
    lastName: 'Al Otaiba',
    initials: 'RO',
    title: 'Managing Partner',
    company: 'Manufacturing Solutions Gulf',
    location: 'Abu Dhabi',
    sector: 'Manufacturing',
    network: 'YPO',
    email: 'reem@manufacturing.ae',
    phone: '+971 50 890 1234',
    leadScore: 82,
    scoreCategory: 'good',
    scoreBreakdown: [],
    signals: [
      {
        id: 's11',
        type: 'board',
        severity: 'medium',
        title: 'Board Expansion',
        description: 'Added three independent board members',
        source: 'Zauba Corp',
        createdAt: new Date('2024-12-10'),
        isActioned: true,
        confidence: 0.8,
      },
    ],
    lastContacted: new Date('2024-12-05'),
    createdAt: new Date('2024-08-01'),
    updatedAt: new Date('2024-12-10'),
    prospectType: 'Family Office',
    clientTier: 'UHNW',
    segment: 'Family Office',
    totalWealth: 180000000,
    walletShare: 28,
  },
  {
    id: '9',
    firstName: 'Rashid',
    lastName: 'Al Falasi',
    initials: 'RF',
    title: 'Founder',
    company: 'Tech Startups Accelerator',
    location: 'Dubai',
    sector: 'Technology',
    network: 'EO',
    email: 'rashid@techaccelerator.ae',
    phone: '+971 50 901 2345',
    leadScore: 91,
    scoreCategory: 'excellent',
    scoreBreakdown: [],
    signals: [
      {
        id: 's12',
        type: 'ipo',
        severity: 'critical',
        title: 'IPO Preparation',
        description: 'Hired IPO advisors for 2025 listing',
        source: 'NewsAPI',
        createdAt: new Date('2024-12-20'),
        isActioned: false,
        confidence: 0.9,
      },
    ],
    lastContacted: new Date('2024-12-18'),
    createdAt: new Date('2024-09-10'),
    updatedAt: new Date('2024-12-20'),
    prospectType: 'Private Equity Fund',
    clientTier: 'HNW',
    segment: 'PE-backed',
    totalWealth: 48000000,
    walletShare: 20,
  },
  {
    id: '10',
    firstName: 'Salama',
    lastName: 'Al Ketbi',
    initials: 'SK',
    title: 'Director',
    company: 'Sustainable Energy Group',
    location: 'Abu Dhabi',
    sector: 'Clean Energy',
    network: 'TiE',
    email: 'salama@sustainable.ae',
    phone: '+971 50 012 3456',
    leadScore: 76,
    scoreCategory: 'good',
    scoreBreakdown: [],
    signals: [
      {
        id: 's13',
        type: 'funding',
        severity: 'high',
        title: 'Government Grant',
        description: 'Received $40M government sustainability grant',
        source: 'NewsAPI',
        createdAt: new Date('2024-12-12'),
        isActioned: false,
        confidence: 0.95,
      },
    ],
    lastContacted: new Date('2024-12-09'),
    createdAt: new Date('2024-10-05'),
    updatedAt: new Date('2024-12-12'),
    prospectType: 'Sovereign Wealth Fund (SWF)',
    clientTier: 'HNW',
    segment: 'Founder-led',
    totalWealth: 35000000,
    walletShare: 14,
  },
  {
    id: '11',
    firstName: 'Faisal',
    lastName: 'Al Rashid',
    initials: 'FR',
    title: 'Executive Chairman',
    company: 'Luxury Retail Holdings',
    location: 'Riyadh',
    sector: 'Retail',
    network: 'YPO',
    email: 'faisal@luxuryretail.sa',
    phone: '+966 50 123 4567',
    leadScore: 68,
    scoreCategory: 'good',
    scoreBreakdown: [],
    signals: [
      {
        id: 's14',
        type: 'acquisition',
        severity: 'medium',
        title: 'Store Expansion',
        description: 'Acquired 15 retail locations in GCC',
        source: 'Arabian Business',
        createdAt: new Date('2024-11-30'),
        isActioned: true,
        confidence: 0.82,
      },
    ],
    lastContacted: new Date('2024-11-28'),
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-30'),
    prospectType: 'Family Office',
    clientTier: 'UHNW',
    segment: 'Family Office',
    totalWealth: 95000000,
    walletShare: 19,
  },
  {
    id: '12',
    firstName: 'Noor',
    lastName: 'Al Mazrouei',
    initials: 'NM',
    title: 'President',
    company: 'Financial Services International',
    location: 'Dubai',
    sector: 'Finance',
    network: 'EO',
    email: 'noor@financial.ae',
    phone: '+971 50 234 5678',
    leadScore: 85,
    scoreCategory: 'good',
    scoreBreakdown: [],
    signals: [
      {
        id: 's15',
        type: 'director_change',
        severity: 'medium',
        title: 'C-Suite Appointment',
        description: 'Appointed new CTO from Silicon Valley',
        source: 'NewsAPI',
        createdAt: new Date('2024-12-15'),
        isActioned: false,
        confidence: 0.87,
      },
    ],
    lastContacted: new Date('2024-12-13'),
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-12-15'),
    prospectType: 'Pension Fund',
    clientTier: 'HNW',
    segment: 'PE-backed',
    totalWealth: 52000000,
    walletShare: 16,
  },
  {
    id: '13',
    firstName: 'Salem',
    lastName: 'Al Fahim',
    initials: 'SF',
    title: 'CEO',
    company: 'Logistics & Transport Solutions',
    location: 'Abu Dhabi',
    sector: 'Transportation',
    network: 'TiE',
    email: 'salem@logistics.ae',
    phone: '+971 50 345 6789',
    leadScore: 58,
    scoreCategory: 'fair',
    scoreBreakdown: [],
    signals: [
      {
        id: 's16',
        type: 'corporate_action',
        severity: 'low',
        title: 'Fleet Expansion',
        description: 'Expanded fleet by 25% with electric vehicles',
        source: 'Arabian Business',
        createdAt: new Date('2024-11-10'),
        isActioned: true,
        confidence: 0.75,
      },
    ],
    lastContacted: new Date('2024-11-05'),
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-11-10'),
    prospectType: 'Private Equity Fund',
    clientTier: 'Emerging',
    segment: 'PE-backed',
    totalWealth: 12000000,
    walletShare: 10,
  },
  {
    id: '14',
    firstName: 'Abdullah',
    lastName: 'Al Suwaidi',
    initials: 'AS',
    title: 'Managing Director',
    company: 'Investment Banking Group',
    location: 'Doha',
    sector: 'Finance',
    network: 'YPO',
    email: 'abdullah@investmentbanking.qa',
    phone: '+974 50 456 7890',
    leadScore: 93,
    scoreCategory: 'excellent',
    scoreBreakdown: [],
    signals: [
      {
        id: 's17',
        type: 'ipo',
        severity: 'critical',
        title: 'Major IPO Advisory',
        description: 'Leading $2B IPO for regional conglomerate',
        source: 'Zawya',
        createdAt: new Date('2024-12-22'),
        isActioned: false,
        confidence: 0.96,
      },
      {
        id: 's18',
        type: 'board',
        severity: 'high',
        title: 'Board Appointment',
        description: 'Appointed to board of Qatar Financial Centre',
        source: 'NewsAPI',
        createdAt: new Date('2024-12-18'),
        isActioned: false,
        confidence: 0.92,
      },
    ],
    lastContacted: new Date('2024-12-20'),
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-22'),
    prospectType: 'Sovereign Wealth Fund (SWF)',
    clientTier: 'UHNW',
    segment: 'Family Office',
    totalWealth: 320000000,
    walletShare: 35,
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

    // Apply prospect type filter
    if (appliedFilters.prospect_types && appliedFilters.prospect_types.length > 0) {
      filtered = filtered.filter((p) => p.prospectType && appliedFilters.prospect_types.includes(p.prospectType));
    }

    // Apply segment filter
    if (appliedFilters.segments && appliedFilters.segments.length > 0) {
      filtered = filtered.filter((p) => p.segment && appliedFilters.segments.includes(p.segment));
    }

    // Apply tier filter
    if (appliedFilters.tiers && appliedFilters.tiers.length > 0) {
      filtered = filtered.filter((p) => p.clientTier && appliedFilters.tiers.includes(p.clientTier));
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

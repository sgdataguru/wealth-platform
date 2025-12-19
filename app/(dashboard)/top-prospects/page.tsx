/**
 * @file app/(dashboard)/top-prospects/page.tsx
 * @description Top Prospects page with actions and filtering
 */

'use client';

import { useState } from 'react';
import { Header, Sidebar } from '@/app/components/layout';
import ProspectCardWithActions from '@/app/components/features/ProspectCardWithActions';
import { Card, Button } from '@/app/components/ui';
import { useProspects } from '@/app/hooks/useProspects';
import { useProspectActions } from '@/app/hooks/useProspectActions';
import type { SuggestedAction, Prospect, ProspectFilters, SignalType } from '@/types';

const signalTypeOptions: { value: SignalType; label: string }[] = [
  { value: 'ipo', label: 'IPO' },
  { value: 'funding', label: 'Funding' },
  { value: 'acquisition', label: 'Acquisition' },
  { value: 'merger', label: 'Merger' },
  { value: 'board', label: 'Board Changes' },
];

export default function TopProspectsPage() {
  const [filters, setFilters] = useState<ProspectFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  const { prospects, isLoading, error, hasMore, total, loadMore, refresh } = useProspects({
    filters,
    sortBy: 'score',
    pageSize: 20,
  });
  
  const { createAction, isCreating } = useProspectActions();

  const handleActionClick = async (prospect: Prospect, action: SuggestedAction) => {
    console.log('Action clicked:', action.type, 'for', prospect.firstName, prospect.lastName);
    
    // Handle action based on type
    const success = await createAction(prospect.id, {
      actionType: action.type,
      description: action.description,
    });
    
    if (success) {
      alert(`Action "${action.label}" scheduled successfully!`);
      refresh();
    } else {
      alert('Failed to create action. Please try again.');
    }
  };

  const handleCall = (prospect: Prospect) => {
    console.log('Calling:', prospect.firstName, prospect.lastName);
    alert(`Calling ${prospect.firstName} ${prospect.lastName}...`);
  };

  const handleEmail = (prospect: Prospect) => {
    console.log('Emailing:', prospect.firstName, prospect.lastName);
    alert(`Opening email to ${prospect.firstName} ${prospect.lastName}...`);
  };

  const toggleSignalFilter = (signalType: SignalType) => {
    setFilters(prev => {
      const current = prev.signalTypes || [];
      const updated = current.includes(signalType)
        ? current.filter(t => t !== signalType)
        : [...current, signalType];
      return { ...prev, signalTypes: updated };
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const activeFilterCount = 
    (filters.signalTypes?.length || 0) +
    (filters.minScore ? 1 : 0) +
    (filters.cities?.length || 0) +
    (filters.sectors?.length || 0);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header userName="John Smith" userInitials="JS" />
      
      <div className="flex">
        <Sidebar activePage="prospects" />
        
        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                  Top Prospects
                </h1>
                <p className="text-[#5A6C7D] mt-1">
                  Prioritized prospects with AI-suggested actions
                </p>
              </div>
              <Button
                variant={showFilters ? 'primary' : 'secondary'}
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-[#C9A227] text-white px-2 py-0.5 rounded-full text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                  Total Prospects
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-[#1A1A2E]">
                    {total}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    +12%
                  </span>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                  Avg Lead Score
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-[#1A1A2E]">
                    {prospects.length > 0 
                      ? Math.round(prospects.reduce((sum, p) => sum + p.leadScore, 0) / prospects.length)
                      : 0}
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    Excellent
                  </span>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                  Actions Pending
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-[#1A1A2E]">
                    {prospects.filter(p => !p.lastContacted).length}
                  </span>
                  <span className="text-sm font-medium text-[#C9A227]">
                    Due today
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card padding="lg" className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1A1A2E]">Filters</h3>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                {/* Signal Type Filter */}
                <div>
                  <label className="text-sm font-semibold text-[#5A6C7D] mb-2 block">
                    Signal Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {signalTypeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => toggleSignalFilter(option.value)}
                        className={`
                          px-4 py-2 rounded-lg text-sm font-medium transition-all
                          ${filters.signalTypes?.includes(option.value)
                            ? 'bg-[#1E3A5F] text-white'
                            : 'bg-white border border-gray-300 text-[#5A6C7D] hover:border-[#1E3A5F]'
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Score Range Filter */}
                <div>
                  <label className="text-sm font-semibold text-[#5A6C7D] mb-2 block">
                    Minimum Lead Score
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={filters.minScore || 0}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      minScore: parseInt(e.target.value) 
                    }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-[#8E99A4] mt-1">
                    <span>0</span>
                    <span className="font-semibold text-[#1A1A2E]">
                      {filters.minScore || 0}+
                    </span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card padding="lg" className="mb-8 bg-red-50 border-red-200">
              <p className="text-red-800">{error}</p>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && prospects.length === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded"></div>
                </Card>
              ))}
            </div>
          )}

          {/* Prospects Grid */}
          {!isLoading && prospects.length === 0 ? (
            <Card padding="lg" className="text-center">
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
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                {prospects.map((prospect) => (
                  <ProspectCardWithActions
                    key={prospect.id}
                    prospect={prospect}
                    onCall={() => handleCall(prospect)}
                    onEmail={() => handleEmail(prospect)}
                    onActionClick={(action) => handleActionClick(prospect, action)}
                    showActions={true}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-8 text-center">
                  <Button
                    variant="secondary"
                    onClick={loadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Load More Prospects'}
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/**
 * @file page.tsx
 * @description Early Liquidity Signals page
 * @module app/(dashboard)/signals
 */

'use client';

import { useState } from 'react';
import { Header, Sidebar } from '@/app/components/layout';
import SignalList from '@/app/components/features/signals/SignalList';
import { Card, Button } from '@/app/components/ui';
import { AddIntelligenceModal } from '@/app/components/features/intelligence';

export default function SignalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header userName="John Smith" userInitials="JS" />
      
      <div className="flex">
        <Sidebar activePage="signals" />
        
        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                  Early Liquidity Signals
                </h1>
                <p className="text-[#5A6C7D] mt-1">
                  30-90 day advance intelligence on UHNW liquidity events
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setIsModalOpen(true)}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                Add Intelligence
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                  Active Signals
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-[#1A1A2E]">24</span>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                  Critical
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-[#DC3545]">3</span>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                  This Week
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-[#1A1A2E]">12</span>
                  <span className="text-sm font-medium text-green-600">+5</span>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                  Unactioned
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-[#E85D54]">8</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Signals List */}
          <SignalList />
        </main>
      </div>

      {/* Add Intelligence Modal */}
      <AddIntelligenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // In production, this would refresh the signals list
          alert('Intelligence added! The signals list would refresh here.');
        }}
      />
    </div>
  );
}

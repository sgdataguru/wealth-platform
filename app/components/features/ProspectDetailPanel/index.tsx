/**
 * @file ProspectDetailPanel.tsx
 * @description Main prospect detail panel component with slide-in animation
 */

'use client';

import { useEffect } from 'react';
import { usePanelStore } from '@/store/panel-store';
import { useProspectDetail } from '@/app/hooks/useProspectDetail';
import { useProspectActions } from '@/app/hooks/useProspectActions';
import type { Prospect } from '@/types';

// Sub-components
import ProspectProfile from './ProspectProfile';
import LeadScoreBreakdown from './LeadScoreBreakdown';
import SignalsSection from './SignalsSection';
import MetricsGrid from './MetricsGrid';
import RelationshipContext from './RelationshipContext';
import ActivityTimeline from './ActivityTimeline';
import ActionButtonsFooter from './ActionButtonsFooter';

interface ProspectDetailPanelProps {
  prospect: Prospect;
}

export default function ProspectDetailPanel({ prospect }: ProspectDetailPanelProps) {
  const { isPanelOpen, closePanel } = usePanelStore();
  const {
    extendedMetrics,
    relatedConnections,
    recentActivity,
    isLoading,
    error,
  } = useProspectDetail(prospect.id);

  const {
    handleCall,
    handleEmail,
    handleAddNote,
    isSubmitting,
  } = useProspectActions(prospect);

  // Handle ESC key to close panel
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPanelOpen) {
        closePanel();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isPanelOpen, closePanel]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPanelOpen]);

  if (!isPanelOpen) {
    return null;
  }

  const handleNoteClick = () => {
    const note = prompt('Enter your note:');
    if (note) {
      handleAddNote(note);
    }
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isPanelOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closePanel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-screen bg-white shadow-2xl z-50 overflow-hidden
          transition-transform duration-300 ease-in-out
          w-full md:w-[480px] lg:w-[520px]
          ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
      >
        {/* Panel Header */}
        <div className="sticky top-0 bg-[#0A1628] text-white px-8 py-6 z-10">
          <div className="flex items-center justify-between">
            <h2 id="panel-title" className="text-xl font-semibold">
              Prospect Details
            </h2>
            <button
              onClick={closePanel}
              className="p-2 hover:bg-[#1E3A5F] rounded transition-colors"
              aria-label="Close panel"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Panel Content */}
        <div className="h-[calc(100vh-88px)] overflow-y-auto px-8 py-6 space-y-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A227]" />
            </div>
          )}

          {error && (
            <div className="bg-[#F8D7DA] border border-[#DC3545] text-[#DC3545] rounded-lg p-4">
              <p className="text-sm">Failed to load prospect details. Please try again.</p>
            </div>
          )}

          {!isLoading && !error && (
            <>
              <ProspectProfile prospect={prospect} />
              <LeadScoreBreakdown prospect={prospect} />
              <SignalsSection signals={prospect.signals} />
              <MetricsGrid metrics={extendedMetrics} />
              <RelationshipContext connections={relatedConnections} />
              <ActivityTimeline activities={recentActivity} />
              <ActionButtonsFooter
                onCall={handleCall}
                onEmail={handleEmail}
                onAddNote={handleNoteClick}
                isSubmitting={isSubmitting}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

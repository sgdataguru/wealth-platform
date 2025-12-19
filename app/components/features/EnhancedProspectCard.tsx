/**
 * @file EnhancedProspectCard.tsx
 * @description Enhanced prospect card with detailed score display and modal
 */

'use client';

import { useState } from 'react';
import type { Prospect, LeadScore } from '@/types';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import ScoreBadge from '../ui/ScoreBadge';
import SignalBadge from '../ui/SignalBadge';
import Button from '../ui/Button';
import { ScoreExplanation, ScoreDetailModal } from './score-details';
import { calculateLeadScore } from '@/lib/scoring/calculate-score';

interface EnhancedProspectCardProps {
  prospect: Prospect;
  onCall?: () => void;
  onEmail?: () => void;
}

export default function EnhancedProspectCard({
  prospect,
  onCall,
  onEmail,
}: EnhancedProspectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const recentSignals = prospect.signals.slice(0, 3);
  
  // Calculate lead score with enhanced data
  const leadScore: LeadScore = calculateLeadScore(
    prospect.id,
    prospect.signals,
    undefined // No previous score for now
  );
  
  const handleRecalculate = async () => {
    // In a real app, this would call an API endpoint
    console.log('Recalculating score for', prospect.id);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  };
  
  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-lg transition-all duration-300"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left: Avatar and Info */}
          <div className="flex items-start gap-4">
            <Avatar initials={prospect.initials} size="lg" />
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A2E]">
                {prospect.firstName} {prospect.lastName}
              </h3>
              <p className="text-sm text-[#5A6C7D]">{prospect.title}</p>
              <p className="text-sm text-[#5A6C7D]">{prospect.company}</p>
            </div>
          </div>
          
          {/* Right: Enhanced Score Badge */}
          <ScoreBadge
            score={leadScore.score}
            category={leadScore.score_category}
            trend={leadScore.trend}
            size="md"
          />
        </div>
        
        {/* Meta Info */}
        <div className="mt-4 flex items-center gap-4 text-sm text-[#5A6C7D]">
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {prospect.location}
          </span>
          <span>|</span>
          <span>{prospect.sector}</span>
          <span>|</span>
          <span>{prospect.network}</span>
        </div>
        
        {/* Active Signals */}
        {recentSignals.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider mb-2">
              Active Signals
            </p>
            <div className="flex flex-wrap gap-2">
              {recentSignals.map((signal) => (
                <SignalBadge
                  key={signal.id}
                  severity={signal.severity}
                  label={signal.title}
                  timestamp={new Date(signal.createdAt).toLocaleDateString()}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Score Explanation */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider mb-2">
            Score Summary
          </p>
          <ScoreExplanation explanation={leadScore.explanation} compact />
          <button
            className="mt-2 text-sm font-medium text-[#C9A227] hover:text-[#D4AF37] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
          >
            View Details →
          </button>
        </div>
        
        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-[#8E99A4]">
            Last contacted:{' '}
            {prospect.lastContacted
              ? new Date(prospect.lastContacted).toLocaleDateString()
              : 'Never'}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCall?.();
              }}
            >
              Call
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEmail?.();
              }}
            >
              Email
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Score Detail Modal */}
      <ScoreDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prospect={prospect}
        score={leadScore}
        onRecalculate={handleRecalculate}
      />
    </>
  );
}

/**
 * @file LeadScoreBreakdown.tsx
 * @description Lead score display with expandable factor breakdown
 */

'use client';

import { useState } from 'react';
import LeadScore from '@/app/components/ui/LeadScore';
import type { Prospect } from '@/types';

interface LeadScoreBreakdownProps {
  prospect: Prospect;
}

export default function LeadScoreBreakdown({ prospect }: LeadScoreBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const totalPoints = prospect.scoreBreakdown.reduce((sum, item) => sum + item.points, 0);

  return (
    <div className="border-b border-[#E5E4E2] pb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1A1A2E]">Lead Score</h3>
        <LeadScore 
          score={prospect.leadScore} 
          category={prospect.scoreCategory}
          size="lg"
        />
      </div>

      {/* Expandable Breakdown */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-[#2A2447] hover:text-[#E85D54] transition-colors mb-3"
      >
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {isExpanded ? 'Hide' : 'View'} Score Breakdown
      </button>

      {isExpanded && (
        <div className="space-y-3">
          {prospect.scoreBreakdown.map((factor, index) => (
            <div key={index} className="bg-[#F8F9FA] rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#1A1A2E]">{factor.label}</span>
                <span className="text-sm font-bold text-[#E85D54]">+{factor.points} pts</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-[#E5E4E2] rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-[#E85D54] to-[#F06E66] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(factor.points / totalPoints) * 100}%` }}
                />
              </div>
              
              <p className="text-xs text-[#5A6C7D]">{factor.description}</p>
            </div>
          ))}
          
          {/* Total */}
          <div className="pt-3 border-t border-[#E5E4E2]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#1A1A2E]">Total Score</span>
              <span className="text-2xl font-bold text-[#1A1A2E]">{prospect.leadScore}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

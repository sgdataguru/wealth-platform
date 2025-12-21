/**
 * @file ScoreDetailModal.tsx
 * @description Modal showing detailed score breakdown
 */

'use client';

import { useState } from 'react';
import type { Prospect, LeadScore } from '@/types';
import Modal from '../../ui/Modal';
import ScoreBadge from '../../ui/ScoreBadge';
import Button from '../../ui/Button';
import FactorCard from './FactorCard';
import ScoreExplanation from './ScoreExplanation';

interface ScoreDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: Prospect;
  score: LeadScore;
  onRecalculate?: () => void;
}

export default function ScoreDetailModal({
  isOpen,
  onClose,
  prospect,
  score,
  onRecalculate,
}: ScoreDetailModalProps) {
  const [isRecalculating, setIsRecalculating] = useState(false);
  
  const handleRecalculate = async () => {
    setIsRecalculating(true);
    await onRecalculate?.();
    setTimeout(() => setIsRecalculating(false), 1000);
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lead Score Breakdown"
      size="xl"
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-6 pb-6 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-[#1A1A2E] mb-1">
              {prospect.firstName} {prospect.lastName}
            </h3>
            <p className="text-[#5A6C7D]">{prospect.company}</p>
            <p className="text-sm text-[#8E99A4] mt-2">
              Last calculated:{' '}
              {new Date(score.calculated_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <ScoreBadge
              score={score.score}
              category={score.score_category}
              trend={score.trend}
              size="lg"
            />
          </div>
        </div>
        
        {/* AI Explanation */}
        <div>
          <h4 className="text-lg font-semibold text-[#1A1A2E] mb-3">
            Why This Score?
          </h4>
          <ScoreExplanation explanation={score.explanation} />
        </div>
        
        {/* Contributing Factors */}
        <div>
          <h4 className="text-lg font-semibold text-[#1A1A2E] mb-3">
            Contributing Factors ({score.factors.length})
          </h4>
          <div className="space-y-3">
            {score.factors.map((factor) => (
              <FactorCard key={factor.signal_id} factor={factor} />
            ))}
          </div>
          
          {score.factors.length === 0 && (
            <div className="text-center py-8 text-[#8E99A4]">
              <p>No signals detected for this prospect yet.</p>
            </div>
          )}
        </div>
        
        {/* Score Composition Visualization */}
        {score.factors.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-[#1A1A2E] mb-3">
              Score Composition
            </h4>
            <div className="bg-[#F8F9FA] rounded-lg p-6">
              <div className="space-y-3">
                {score.factors
                  .sort((a, b) => b.points_contributed - a.points_contributed)
                  .map((factor) => {
                    const percentage = (
                      (factor.points_contributed / score.score) *
                      100
                    ).toFixed(1);
                    return (
                      <div key={factor.signal_id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#1A1A2E] font-medium">
                            {factor.signal_type.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-[#5A6C7D]">
                            {percentage}% of total
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-[#2A2447] to-[#E85D54]"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleRecalculate}
            disabled={isRecalculating}
          >
            {isRecalculating ? 'Recalculating...' : '🔄 Recalculate Score'}
          </Button>
          
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary">
              Schedule Follow-up
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

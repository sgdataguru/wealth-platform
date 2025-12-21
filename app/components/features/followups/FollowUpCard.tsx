/**
 * @file FollowUpCard.tsx
 * @description Card component for displaying follow-up tasks
 */

'use client';

import { Card } from '@/app/components/ui';
import StatusPill from '@/app/components/ui/StatusPill';
import PriorityBadge from '@/app/components/ui/PriorityBadge';
import type { FollowUp } from '@/types';

interface FollowUpCardProps {
  followUp: FollowUp;
  onClick?: () => void;
  onComplete?: (id: string) => void;
}

export default function FollowUpCard({ followUp, onClick, onComplete }: FollowUpCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const isOverdue = () => {
    if (followUp.status === 'completed') return false;
    return new Date(followUp.dueDate) < new Date();
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onComplete) {
      onComplete(followUp.id);
    }
  };

  return (
    <Card 
      padding="md" 
      hover={true}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title and Status */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-[#1A1A2E]">{followUp.title}</h3>
            <StatusPill status={followUp.status} />
          </div>
          
          {/* Description */}
          <p className="text-sm text-[#5A6C7D] mb-3">{followUp.description}</p>
          
          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-[#8E99A4]">
            <PriorityBadge priority={followUp.priority} />
            
            <span className={isOverdue() ? 'text-red-600 font-medium' : ''}>
              Due: {formatDate(followUp.dueDate)}
            </span>
            
            {followUp.completedAt && (
              <span>
                Completed: {formatDate(followUp.completedAt)}
              </span>
            )}
          </div>
          
          {followUp.notes && (
            <div className="mt-2 text-xs text-[#8E99A4] italic">
              Note: {followUp.notes}
            </div>
          )}
        </div>

        {/* Action Button */}
        {followUp.status !== 'completed' && (
          <button
            onClick={handleComplete}
            className="flex-shrink-0 px-3 py-1.5 text-sm font-medium text-white bg-[#2A2447] rounded hover:bg-[#1A1332] transition-colors"
          >
            Mark Complete
          </button>
        )}
      </div>
    </Card>
  );
}

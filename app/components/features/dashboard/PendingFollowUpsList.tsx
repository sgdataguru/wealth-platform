/**
 * @file PendingFollowUpsList.tsx
 * @description List of pending and overdue follow-ups
 */

'use client';

import { Card } from '@/app/components/ui';
import StatusPill from '@/app/components/ui/StatusPill';
import PriorityBadge from '@/app/components/ui/PriorityBadge';
import type { FollowUp } from '@/types';

interface PendingFollowUpsListProps {
  followUps: FollowUp[];
  onFollowUpClick?: (followUp: FollowUp) => void;
  onMarkComplete?: (id: string) => void;
}

export default function PendingFollowUpsList({ 
  followUps, 
  onFollowUpClick,
  onMarkComplete 
}: PendingFollowUpsListProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (followUp: FollowUp) => {
    if (followUp.status === 'completed') return false;
    return new Date(followUp.dueDate) < new Date();
  };

  const overdueCount = followUps.filter(isOverdue).length;

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
          Pending Follow-ups
        </h2>
        {overdueCount > 0 && (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            {overdueCount} overdue
          </span>
        )}
      </div>

      {followUps.length === 0 ? (
        <div className="text-center py-8 text-[#8E99A4]">
          <p>No pending follow-ups</p>
          <p className="text-sm mt-1">You&apos;re all caught up! 🎉</p>
        </div>
      ) : (
        <div className="space-y-3">
          {followUps.map((followUp) => (
            <div
              key={followUp.id}
              onClick={() => onFollowUpClick?.(followUp)}
              className={`
                p-4 rounded-lg border cursor-pointer transition-colors
                ${isOverdue(followUp) 
                  ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                  : 'bg-[#F8F9FA] border-gray-200 hover:bg-gray-100'
                }
              `}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-[#1A1A2E] truncate">
                      {followUp.title}
                    </h3>
                    <StatusPill status={followUp.status} />
                  </div>
                  
                  <p className="text-sm text-[#5A6C7D] mb-2 line-clamp-1">
                    {followUp.description}
                  </p>
                  
                  <div className="flex items-center gap-3 text-xs">
                    <PriorityBadge priority={followUp.priority} />
                    <span className={isOverdue(followUp) ? 'text-red-600 font-medium' : 'text-[#8E99A4]'}>
                      Due: {formatDate(followUp.dueDate)}
                    </span>
                  </div>
                </div>

                {onMarkComplete && followUp.status !== 'completed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkComplete(followUp.id);
                    }}
                    className="flex-shrink-0 px-3 py-1 text-xs font-medium text-white bg-[#2A2447] rounded hover:bg-[#1A1332] transition-colors"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

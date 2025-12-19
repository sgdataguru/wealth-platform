/**
 * @file ActivityFeed.tsx
 * @description Recent activity feed component
 */

'use client';

import { Card } from '@/app/components/ui';
import type { Activity } from '@/types';

interface ActivityFeedProps {
  activities: Activity[];
  limit?: number;
}

const activityTypeIcons: Record<string, string> = {
  signal_viewed: '👁️',
  signal_actioned: '⚡',
  lead_created: '➕',
  lead_contacted: '📞',
  follow_up_created: '📋',
  follow_up_completed: '✅',
  follow_up_updated: '📝',
  lead_converted: '🎉',
  intelligence_added: '💡',
  note_added: '📌',
};

const activityTypeColors: Record<string, string> = {
  signal_viewed: 'bg-blue-500',
  signal_actioned: 'bg-yellow-500',
  lead_created: 'bg-green-500',
  lead_contacted: 'bg-purple-500',
  follow_up_created: 'bg-indigo-500',
  follow_up_completed: 'bg-green-600',
  follow_up_updated: 'bg-blue-600',
  lead_converted: 'bg-[#C9A227]',
  intelligence_added: 'bg-orange-500',
  note_added: 'bg-gray-500',
};

export default function ActivityFeed({ activities, limit = 10 }: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, limit);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes < 1 ? 'Just now' : `${minutes}m ago`;
    }
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Card padding="lg">
      <h2 className="text-xl font-semibold text-[#1A1A2E] mb-6 font-[family-name:var(--font-playfair)]">
        Recent Activity
      </h2>
      
      {displayedActivities.length === 0 ? (
        <div className="text-center py-8 text-[#8E99A4]">
          <p>No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              {/* Icon */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0
                ${activityTypeColors[activity.actionType] || 'bg-gray-400'}
              `}>
                <span className="text-sm">
                  {activityTypeIcons[activity.actionType] || '•'}
                </span>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#1A1A2E]">
                  {activity.description}
                </p>
                <span className="text-xs text-[#8E99A4] mt-1 block">
                  {formatTimeAgo(activity.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

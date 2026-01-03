/**
 * @file ActivityTimeline.tsx
 * @description Recent engagement and activity history with premium Heroicons
 */

'use client';

import type { EngagementEvent } from '@/types';
import { FeatureIcons } from '@/app/components/icons';

interface ActivityTimelineProps {
  activities: EngagementEvent[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <FeatureIcons.Call className="w-4 h-4" strokeWidth={2} />;
      case 'email':
        return <FeatureIcons.Email className="w-4 h-4" strokeWidth={2} />;
      case 'meeting':
        return <FeatureIcons.Meeting className="w-4 h-4" strokeWidth={2} />;
      case 'note':
        return <FeatureIcons.Document className="w-4 h-4" strokeWidth={2} />;
      case 'signal':
        return <FeatureIcons.Warning className="w-4 h-4" strokeWidth={2} />;
      default:
        return null;
    }
  };

  if (activities.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-[#E5E4E2] pb-6">
      <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            {/* Timeline Icon */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#2A2447] text-white flex items-center justify-center flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              {activity.id !== activities[activities.length - 1].id && (
                <div className="w-0.5 h-full bg-[#E5E4E2] mt-2" />
              )}
            </div>

            {/* Activity Content */}
            <div className="flex-1 pb-4">
              <p className="text-sm font-medium text-[#1A1A2E] mb-1">
                {activity.description}
              </p>
              {activity.outcome && (
                <p className="text-xs text-[#5A6C7D] mb-2">
                  {activity.outcome}
                </p>
              )}
              <span className="text-xs text-[#8E99A4]">
                {formatDate(activity.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

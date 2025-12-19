/**
 * @file ActivityTimeline.tsx
 * @description Recent engagement and activity history
 */

'use client';

import type { EngagementEvent } from '@/types';

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
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'email':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'meeting':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'note':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'signal':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
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
              <div className="w-8 h-8 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center flex-shrink-0">
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

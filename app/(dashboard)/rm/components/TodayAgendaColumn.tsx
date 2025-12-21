/**
 * @file app/(dashboard)/rm/components/TodayAgendaColumn.tsx
 * @description Today's meetings and life events column
 */

'use client';

import { ColumnWrapper } from './DashboardGrid';
import ScheduleItemCard from './ScheduleItemCard';
import LifeEventCard from './LifeEventCard';
import type { AgendaItem, LifeEvent } from '@/types/dashboard.types';

interface TodayAgendaColumnProps {
  meetings: AgendaItem[];
  lifeEvents: LifeEvent[];
  isLoading?: boolean;
}

export default function TodayAgendaColumn({
  meetings,
  lifeEvents,
  isLoading,
}: TodayAgendaColumnProps) {
  if (isLoading) {
    return (
      <ColumnWrapper title="Today's Agenda" icon="📅">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </ColumnWrapper>
    );
  }

  return (
    <ColumnWrapper
      title="Today's Agenda"
      icon="📅"
      badge={meetings.length + lifeEvents.length}
    >
      {/* Meetings Section */}
      {meetings.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-gray-600 uppercase mb-2 px-1">
            Meetings
          </h3>
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <ScheduleItemCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </div>
      )}

      {/* Life Events Section */}
      {lifeEvents.length > 0 && (
        <div className={meetings.length > 0 ? 'mt-6' : ''}>
          <h3 className="text-xs font-bold text-gray-600 uppercase mb-2 px-1">
            Life Events
          </h3>
          <div className="space-y-3">
            {lifeEvents.map((event) => (
              <LifeEventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {meetings.length === 0 && lifeEvents.length === 0 && (
        <div className="bg-white rounded-lg p-6 text-center">
          <div className="text-4xl mb-2">📭</div>
          <p className="text-gray-700 font-semibold text-sm">No agenda items</p>
          <p className="text-gray-500 text-xs mt-1">
            Your calendar is clear for today.
          </p>
        </div>
      )}
    </ColumnWrapper>
  );
}

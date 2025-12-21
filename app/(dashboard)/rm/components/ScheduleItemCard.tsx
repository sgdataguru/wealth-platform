/**
 * @file app/(dashboard)/rm/components/ScheduleItemCard.tsx
 * @description Individual meeting/schedule card
 */

'use client';

import type { AgendaItem } from '@/types/dashboard.types';

interface ScheduleItemCardProps {
  meeting: AgendaItem;
}

export default function ScheduleItemCard({ meeting }: ScheduleItemCardProps) {
  const statusConfig = {
    pending: { bg: 'bg-gray-100', text: 'text-gray-700', icon: '⏳' },
    ready: { bg: 'bg-green-100', text: 'text-green-700', icon: '✅' },
    in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '▶️' },
    completed: { bg: 'bg-gray-100', text: 'text-gray-500', icon: '✓' },
  };

  const config = statusConfig[meeting.status];

  const handleJoinMeeting = () => {
    if (meeting.meetingLink) {
      window.open(meeting.meetingLink, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Time and Status */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#1A1332]">{meeting.time}</span>
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${config.bg} ${config.text}`}>
            {config.icon} {meeting.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        {meeting.duration && (
          <span className="text-xs text-gray-500">{meeting.duration}m</span>
        )}
      </div>

      {/* Meeting Title */}
      <h3 className="font-semibold text-[#1A1A2E] text-sm mb-1">
        {meeting.title}
      </h3>

      {/* Client Name */}
      <p className="text-xs text-gray-600 mb-2">
        with <span className="font-semibold">{meeting.clientName}</span>
      </p>

      {/* Location */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">
          {meeting.location.includes('Zoom') || meeting.location.includes('zoom') ? '💻' : 
           meeting.location.includes('Office') ? '🏢' : 
           '📍'}
        </span>
        <span className="text-xs text-gray-600">{meeting.location}</span>
      </div>

      {/* AI Context Note */}
      {meeting.aiContextNote && (
        <div className="mb-3 p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
          <p className="text-xs font-semibold text-purple-900 mb-1">
            🤖 AI Context
          </p>
          <p className="text-xs text-purple-800 leading-relaxed">
            {meeting.aiContextNote}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {meeting.meetingLink && (
          <button
            onClick={handleJoinMeeting}
            className="flex-1 px-3 py-1.5 bg-[#E85D54] text-white text-xs font-semibold rounded hover:bg-[#d54d44] transition-colors"
          >
            Join Meeting
          </button>
        )}
        <button className="px-3 py-1.5 bg-white text-[#1A1332] text-xs font-semibold rounded border border-[#1A1332] hover:bg-gray-50 transition-colors">
          View Context
        </button>
      </div>
    </div>
  );
}

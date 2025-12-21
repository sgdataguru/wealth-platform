/**
 * @file app/(dashboard)/rm/components/LifeEventCard.tsx
 * @description Individual life event card (birthdays, anniversaries, etc.)
 */

'use client';

import type { LifeEvent } from '@/types/dashboard.types';

interface LifeEventCardProps {
  event: LifeEvent;
}

export default function LifeEventCard({ event }: LifeEventCardProps) {
  const eventConfig = {
    birthday: { icon: '🎂', color: 'text-pink-600', bg: 'bg-pink-50' },
    anniversary: { icon: '💍', color: 'text-purple-600', bg: 'bg-purple-50' },
    graduation: { icon: '🎓', color: 'text-blue-600', bg: 'bg-blue-50' },
    achievement: { icon: '🏆', color: 'text-amber-600', bg: 'bg-amber-50' },
  };

  const config = eventConfig[event.type];

  const isToday = () => {
    const today = new Date();
    const eventDate = new Date(event.date);
    return (
      today.getDate() === eventDate.getDate() &&
      today.getMonth() === eventDate.getMonth() &&
      today.getFullYear() === eventDate.getFullYear()
    );
  };

  const getDaysUntil = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntil();

  return (
    <div className={`rounded-lg border border-gray-200 shadow-sm ${config.bg} p-4 hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{config.icon}</span>
        <div className="flex-1">
          <h3 className={`font-bold text-sm ${config.color}`}>
            {event.title}
          </h3>
          <p className="text-xs font-semibold text-gray-700 mt-0.5">
            {event.clientName}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {isToday() ? (
              <span className="font-bold text-green-600">Today!</span>
            ) : daysUntil === 0 ? (
              'Today'
            ) : daysUntil === 1 ? (
              'Tomorrow'
            ) : daysUntil > 0 ? (
              `in ${daysUntil} days`
            ) : (
              new Date(event.date).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
              })
            )}
          </p>
        </div>
      </div>

      {/* Suggestion */}
      {event.suggestion && (
        <div className="mb-3 p-2 bg-white rounded border border-gray-200">
          <p className="text-xs text-gray-700 leading-relaxed">
            💡 {event.suggestion}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {!event.hasGiftSent ? (
          <>
            <button className="flex-1 px-3 py-1.5 bg-[#E85D54] text-white text-xs font-semibold rounded hover:bg-[#d54d44] transition-colors">
              Send Gift
            </button>
            <button className="px-3 py-1.5 bg-white text-gray-700 text-xs font-semibold rounded border border-gray-300 hover:bg-gray-50 transition-colors">
              Send Note
            </button>
          </>
        ) : (
          <span className="flex-1 text-center px-3 py-1.5 bg-green-100 text-green-800 text-xs font-semibold rounded">
            ✓ Gift Sent
          </span>
        )}
      </div>
    </div>
  );
}

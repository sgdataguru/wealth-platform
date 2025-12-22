/**
 * @file app/components/features/SuggestedActions.tsx
 * @description Component to display and handle suggested actions for prospects
 */

'use client';

import type { SuggestedAction } from '@/types';

interface SuggestedActionsProps {
  actions: SuggestedAction[];
  onActionClick: (action: SuggestedAction) => void;
  maxActions?: number;
  className?: string;
}

export default function SuggestedActions({
  actions,
  onActionClick,
  maxActions = 3,
  className = '',
}: SuggestedActionsProps) {
  const displayActions = actions.slice(0, maxActions);

  if (displayActions.length === 0) {
    return null;
  }

  const getPriorityColor = (priority: SuggestedAction['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-300 bg-red-50';
      case 'medium':
        return 'border-amber-300 bg-amber-50';
      case 'low':
        return 'border-blue-300 bg-blue-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getActionIcon = (type: SuggestedAction['type']) => {
    switch (type) {
      case 'call':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'email':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'meeting':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'note':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <div className={className}>
      <p className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider mb-2">
        Suggested Actions
      </p>
      <div className="space-y-2">
        {displayActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onActionClick(action)}
            className={`
              w-full text-left p-3 rounded-lg border transition-all
              hover:shadow-md hover:scale-[1.02]
              ${getPriorityColor(action.priority)}
            `}
          >
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-[#1A1A2E]">
                {getActionIcon(action.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-[#1A1A2E]">
                    {action.label}
                  </p>
                  <span className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${action.priority === 'high' ? 'bg-red-200 text-red-800' : 
                      action.priority === 'medium' ? 'bg-amber-200 text-amber-800' : 
                      'bg-blue-200 text-blue-800'}
                  `}>
                    {action.priority}
                  </span>
                </div>
                <p className="text-xs text-[#5A6C7D] line-clamp-2">
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

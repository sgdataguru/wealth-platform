/**
 * @file app/(dashboard)/rm/components/AIEngagementColumn.tsx
 * @description AI-driven engagement suggestions column
 */

'use client';

import { ColumnWrapper } from './DashboardGrid';
import AIAdviceCard from './AIAdviceCard';
import type { Suggestion } from '@/types/dashboard.types';

interface AIEngagementColumnProps {
  suggestions: Suggestion[];
  isLoading?: boolean;
  onAction?: (suggestionId: string, action: string) => void;
}

export default function AIEngagementColumn({
  suggestions,
  isLoading,
  onAction,
}: AIEngagementColumnProps) {
  if (isLoading) {
    return (
      <ColumnWrapper title="AI Engagement" icon="🤖">
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
      title="AI Engagement"
      icon="🤖"
      badge={suggestions.filter(s => s.priority === 'high').length}
    >
      {suggestions.length === 0 ? (
        <div className="bg-white rounded-lg p-6 text-center">
          <p className="text-gray-500 text-sm">
            No suggestions available at this time.
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Check back later for new opportunities.
          </p>
        </div>
      ) : (
        suggestions.map((suggestion) => (
          <AIAdviceCard
            key={suggestion.id}
            suggestion={suggestion}
            onAction={onAction}
          />
        ))
      )}
    </ColumnWrapper>
  );
}

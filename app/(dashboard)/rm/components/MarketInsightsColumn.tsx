/**
 * @file app/(dashboard)/rm/components/MarketInsightsColumn.tsx
 * @description Market insights and opportunities column
 */

'use client';

import { ColumnWrapper } from './DashboardGrid';
import MarketInsightCard from './MarketInsightCard';
import type { MarketInsight } from '@/types/dashboard.types';

interface MarketInsightsColumnProps {
  insights: MarketInsight[];
  isLoading?: boolean;
}

export default function MarketInsightsColumn({
  insights,
  isLoading,
}: MarketInsightsColumnProps) {
  if (isLoading) {
    return (
      <ColumnWrapper title="Market Insights" icon="📈">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
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

  const relevantCount = insights.filter(i => i.isClientRelevant).length;

  return (
    <ColumnWrapper
      title="Market Insights"
      icon="📈"
      badge={relevantCount > 0 ? relevantCount : undefined}
    >
      {insights.length === 0 ? (
        <div className="bg-white rounded-lg p-6 text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-700 font-semibold text-sm">No insights available</p>
          <p className="text-gray-500 text-xs mt-1">
            Market data will refresh during trading hours.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {insights.map((insight) => (
              <MarketInsightCard key={insight.id} insight={insight} />
            ))}
          </div>
          
          {/* Last Updated Timestamp */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Last updated: {new Date(insights[0]?.lastUpdated || new Date()).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </>
      )}
    </ColumnWrapper>
  );
}

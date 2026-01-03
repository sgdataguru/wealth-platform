/**
 * @file app/(dashboard)/rm/components/MarketInsightCard.tsx
 * @description Individual market insight card for asset classes
 */

'use client';

import type { MarketInsight } from '@/types/dashboard.types';

interface MarketInsightCardProps {
  insight: MarketInsight;
}

export default function MarketInsightCard({ insight }: MarketInsightCardProps) {
  const assetClassConfig = {
    middle_east_equities: {
      icon: '📊',
      label: 'Middle East Equities',
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    currency: {
      icon: '💱',
      label: 'Currency (USD)',
      color: 'text-green-700',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    commodities: {
      icon: '🪙',
      label: 'Commodities (Gold)',
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    real_estate: {
      icon: '🏢',
      label: 'Real Estate',
      color: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
    },
  };

  const config = assetClassConfig[insight.assetClass];

  const getChangeDisplay = () => {
    const absChange = Math.abs(insight.change);
    const arrow = insight.changeDirection === 'up' ? '↑' : 
                  insight.changeDirection === 'down' ? '↓' : '→';
    const colorClass = insight.changeDirection === 'up' ? 'text-green-600' : 
                       insight.changeDirection === 'down' ? 'text-red-600' : 
                       'text-gray-600';
    
    return (
      <span className={`font-bold ${colorClass}`}>
        {arrow} {absChange.toFixed(1)}%
      </span>
    );
  };

  return (
    <div className={`rounded-lg border ${config.border} shadow-sm ${config.bg} p-4 hover:shadow-md transition-shadow`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <h3 className={`text-xs font-bold ${config.color} uppercase tracking-wide`}>
              {config.label}
            </h3>
            <div className="text-sm font-bold text-gray-900 mt-1">
              {getChangeDisplay()}
            </div>
          </div>
        </div>
        {insight.isClientRelevant && (
          <span className="px-2 py-1 bg-[#E85D54] text-white text-xs font-bold rounded">
            {insight.affectedClients} clients
          </span>
        )}
      </div>

      {/* Headline */}
      <h4 className="font-semibold text-sm text-[#1A1A2E] mb-2 leading-snug">
        {insight.headline}
      </h4>

      {/* Context */}
      <p className="text-xs text-gray-700 leading-relaxed mb-3">
        {insight.context}
      </p>

      {/* Portfolio Suggestion */}
      <div className="p-3 bg-white border border-gray-200 rounded">
        <p className="text-xs font-semibold text-gray-800 mb-1">
          💡 Portfolio Suggestion
        </p>
        <p className="text-xs text-gray-700 leading-relaxed">
          {insight.portfolioSuggestion}
        </p>
      </div>
    </div>
  );
}

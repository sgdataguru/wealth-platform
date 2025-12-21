/**
 * @file app/(dashboard)/rm/components/AIAdviceCard.tsx
 * @description Individual AI suggestion card with priority and actions
 */

'use client';

import type { Suggestion } from '@/types/dashboard.types';

interface AIAdviceCardProps {
  suggestion: Suggestion;
  onAction?: (suggestionId: string, action: string) => void;
}

export default function AIAdviceCard({ suggestion, onAction }: AIAdviceCardProps) {
  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    low: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const priorityLabels = {
    high: 'HIGH PRIORITY',
    medium: 'MEDIUM',
    low: 'LOW',
  };

  const typeIcons = {
    liquidity_event: '💰',
    yield_mismatch: '📈',
    portfolio_gap: '📊',
    client_engagement: '🤝',
    life_event: '🎉',
    risk_alert: '⚠️',
  };

  const handleAction = (action: string) => {
    if (onAction) {
      onAction(suggestion.id, action);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header with Priority Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{typeIcons[suggestion.type]}</span>
          <div>
            <h3 className="font-semibold text-[#1A1A2E] text-sm">
              {suggestion.clientName}
            </h3>
            <p className="text-xs text-gray-500">
              {new Date(suggestion.createdAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-bold border ${priorityColors[suggestion.priority]}`}
        >
          {priorityLabels[suggestion.priority]}
        </span>
      </div>

      {/* Client Context */}
      <div className="mb-3">
        <p className="text-sm text-gray-700 leading-relaxed">
          {suggestion.clientContext}
        </p>
      </div>

      {/* Suggested Action */}
      <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
        <p className="text-xs font-semibold text-blue-900 mb-1">
          Suggested Action
        </p>
        <p className="text-sm text-blue-800">
          {suggestion.suggestedAction}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {suggestion.actionButtons.map((button, index) => (
          <button
            key={index}
            onClick={() => handleAction(button.action)}
            className={`
              px-3 py-1.5 rounded text-xs font-semibold transition-colors
              ${button.variant === 'primary'
                ? 'bg-[#E85D54] text-white hover:bg-[#d54d44]'
                : button.variant === 'secondary'
                ? 'bg-white text-[#1A1332] border border-[#1A1332] hover:bg-gray-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }
            `}
          >
            {button.label}
          </button>
        ))}
      </div>

      {/* Reasoning (collapsible) */}
      <details className="mt-3">
        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
          Why this suggestion?
        </summary>
        <p className="text-xs text-gray-600 mt-2 pl-3 border-l-2 border-gray-200">
          {suggestion.reasoning}
        </p>
      </details>
    </div>
  );
}

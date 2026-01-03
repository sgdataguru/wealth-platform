/**
 * @file IntentViewer.tsx
 * @description Display parsed JSON intent from NLP
 * @module components/features/deep-dive
 */

'use client';

import Card from '@/app/components/ui/Card';
import type { Intent } from '@/types/deep-dive.types';

interface IntentViewerProps {
  intent: Intent | null;
}

export default function IntentViewer({ intent }: IntentViewerProps) {
  if (!intent) {
    return (
      <Card className="h-full">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
          🎯 Parsed Intent (JSON)
        </h2>
        <div className="flex items-center justify-center h-64 text-[var(--text-muted)]">
          <p>Enter a prompt to see the parsed intent</p>
        </div>
      </Card>
    );
  }

  const jsonString = JSON.stringify(intent, null, 2);

  const getRiskLevelColor = (level?: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-600 font-bold';
      case 'HIGH':
        return 'text-orange-600 font-semibold';
      case 'MEDIUM':
        return 'text-yellow-600';
      case 'LOW':
        return 'text-green-600';
      default:
        return 'text-[var(--text-muted)]';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
        🎯 Parsed Intent (JSON)
      </h2>

      {/* Visual Summary */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--header-border)]">
          <p className="text-xs text-[var(--text-muted)] mb-1">Authority</p>
          <p className="text-sm font-semibold text-[#007B7A]">{intent.authority}</p>
        </div>
        <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--header-border)]">
          <p className="text-xs text-[var(--text-muted)] mb-1">Report Type</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {intent.reportType.replace('_', ' ')}
          </p>
        </div>
        <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--header-border)]">
          <p className="text-xs text-[var(--text-muted)] mb-1">Risk Level</p>
          <p className={`text-sm font-semibold ${getRiskLevelColor(intent.riskLevel)}`}>
            {intent.riskLevel || 'All Levels'}
          </p>
        </div>
        <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--header-border)]">
          <p className="text-xs text-[var(--text-muted)] mb-1">Output</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{intent.outputFormat}</p>
        </div>
      </div>

      {/* JSON Display */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-[#0A1628] rounded-lg p-4 border border-[#007B7A]/20">
          <pre 
            className="text-sm text-[#C9A84A] font-mono leading-relaxed overflow-x-auto"
            aria-label="JSON intent structure"
          >
            <code>{jsonString}</code>
          </pre>
        </div>
      </div>

      {/* Filters Badge */}
      {intent.filters && Object.keys(intent.filters).length > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--header-border)]">
          <p className="text-xs text-[var(--text-muted)] mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {intent.filters.urgentOnly && (
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded border border-red-200">
                🚨 Urgent Only
              </span>
            )}
            {intent.filters.overdueOnly && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded border border-orange-200">
                ⏰ Overdue Only
              </span>
            )}
            {intent.filters.flaggedOnly && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded border border-yellow-200">
                🚩 Flagged Only
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

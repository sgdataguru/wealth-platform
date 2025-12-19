/**
 * @file SignalsSection.tsx
 * @description Active signals display with severity-based sorting
 */

'use client';

import SignalBadge from '@/app/components/ui/SignalBadge';
import type { Signal } from '@/types';

interface SignalsSectionProps {
  signals: Signal[];
}

export default function SignalsSection({ signals }: SignalsSectionProps) {
  // Sort by severity: critical > high > medium > low
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedSignals = [...signals].sort((a, b) => 
    severityOrder[a.severity] - severityOrder[b.severity]
  );

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  if (signals.length === 0) {
    return (
      <div className="border-b border-[#E5E4E2] pb-6">
        <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Active Signals</h3>
        <p className="text-sm text-[#8E99A4] text-center py-8">
          No active signals detected
        </p>
      </div>
    );
  }

  return (
    <div className="border-b border-[#E5E4E2] pb-6">
      <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">
        Active Signals ({signals.length})
      </h3>

      <div className="space-y-3">
        {sortedSignals.map((signal) => (
          <div
            key={signal.id}
            className="bg-[#F8F9FA] rounded-lg p-3 hover:bg-[#EFF1F3] transition-colors"
          >
            <div className="flex items-start gap-3">
              <SignalBadge severity={signal.severity} label={signal.type} compact />
              
              <div className="flex-1">
                <h4 className="text-sm font-medium text-[#1A1A2E] mb-1">
                  {signal.title}
                </h4>
                <p className="text-xs text-[#5A6C7D] mb-2">
                  {signal.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-[#8E99A4]">
                  <span>Source: {signal.source}</span>
                  <span>{formatTimeAgo(signal.createdAt)}</span>
                </div>
                
                {signal.isActioned && (
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-[#28A745]">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Actioned
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

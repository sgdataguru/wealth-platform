/**
 * @file MetricsGrid.tsx
 * @description Key financial and relationship metrics display
 */

'use client';

import type { ExtendedMetrics } from '@/types';
import { formatAEDToUSD, formatMillionsAsUSD } from '@/lib/utils/currency';

interface MetricsGridProps {
  metrics: ExtendedMetrics | null;
}

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  if (!metrics) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    // If number likely represents absolute AED (large number), convert from AED
    if (Math.abs(amount) >= 1_000_000) {
      return formatAEDToUSD(amount);
    }
    // otherwise treat as millions
    return formatMillionsAsUSD(amount);
  };

  const metricsData = [
    {
      label: 'AUM',
      value: formatCurrency(metrics.aum),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Wallet Share',
      value: `${metrics.walletShare}%`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: 'Relationship Strength',
      value: metrics.relationshipStrength,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: 'Lifetime Value',
      value: formatCurrency(metrics.lifetimeValue),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      label: 'Last Interaction',
      value: `${metrics.lastInteractionDays}d ago`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Follow-ups Scheduled',
      value: metrics.upcomingFollowUps,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="border-b border-[#E5E4E2] pb-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-[#1A1A2E]">Key Metrics</h3>
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500 border border-gray-200">
          POC
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metricsData.map((metric, index) => (
          <div
            key={index}
            className="bg-[#F8F9FA] rounded-lg p-4 hover:bg-[#EFF1F3] transition-colors"
          >
            <div className="flex items-center gap-2 mb-2 text-[#5A6C7D]">
              {metric.icon}
              <span className="text-xs font-medium uppercase tracking-wider">
                {metric.label}
              </span>
            </div>
            <div className="text-2xl font-bold text-[#1A1A2E]">
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[10px] text-gray-400 italic">
        * Internally calculated; can be customized.
      </p>
    </div>
  );
}

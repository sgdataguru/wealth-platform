/**
 * @file MetricsGrid.tsx
 * @description Key financial and relationship metrics with premium Heroicons
 */

'use client';

import type { ExtendedMetrics } from '@/types';
import { formatCroreAmount, formatCurrencyAmount, type SupportedCurrency } from '@/lib/utils/currency';
import { FeatureIcons } from '@/app/components/icons';

interface MetricsGridProps {
  metrics: ExtendedMetrics | null;
}

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  if (!metrics) {
    return null;
  }

  const resolvedCurrency: SupportedCurrency =
    metrics.aumCurrency === 'AED' || metrics.aumCurrency === 'INR'
      ? metrics.aumCurrency
      : 'USD';

  const formatCurrency = (amount: number) => {
    if (Math.abs(amount) >= 1_000_000) {
      return formatCurrencyAmount(amount, { currency: resolvedCurrency });
    }
    return formatCroreAmount(amount, resolvedCurrency);
  };

  const metricsData = [
    {
      label: 'AUM',
      value: formatCurrency(metrics.aum),
      icon: <FeatureIcons.Currency className="w-5 h-5" strokeWidth={2} />,
    },
    {
      label: 'Wallet Share',
      value: `${metrics.walletShare}%`,
      icon: <FeatureIcons.Portfolio className="w-5 h-5" strokeWidth={2} />,
    },
    {
      label: 'Relationship Strength',
      value: metrics.relationshipStrength,
      icon: <FeatureIcons.Success className="w-5 h-5" strokeWidth={2} />,
    },
    {
      label: 'Lifetime Value',
      value: formatCurrency(metrics.lifetimeValue),
      icon: <FeatureIcons.Growth className="w-5 h-5" strokeWidth={2} />,
    },
    {
      label: 'Last Interaction',
      value: `${metrics.lastInteractionDays}d ago`,
      icon: <FeatureIcons.Time className="w-5 h-5" strokeWidth={2} />,
    },
    {
      label: 'Follow-ups Scheduled',
      value: metrics.upcomingFollowUps,
      icon: <FeatureIcons.Calendar className="w-5 h-5" strokeWidth={2} />,
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

/**
 * @file ComplianceMetricsGrid.tsx
 * @description Grid of key compliance metrics
 * @module components/features/compliance
 */

'use client';

import Card from '@/app/components/ui/Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: string;
  color: string;
}

function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {change.isPositive ? '↗' : '↘'} {Math.abs(change.value)}%
            </p>
          )}
        </div>
        <span className={`text-4xl p-3 rounded-lg ${color}`}>{icon}</span>
      </div>
    </Card>
  );
}

export default function ComplianceMetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Active Alerts"
        value={23}
        change={{ value: 12, isPositive: false }}
        icon="🔔"
        color="bg-amber-50 text-amber-700"
      />
      <MetricCard
        title="Pending Reports"
        value={4}
        change={{ value: 2, isPositive: true }}
        icon="📄"
        color="bg-blue-50 text-blue-700"
      />
      <MetricCard
        title="Compliance Score"
        value="78%"
        change={{ value: 5, isPositive: true }}
        icon="📊"
        color="bg-emerald-50 text-emerald-700"
      />
      <MetricCard
        title="Cross-Border Txns"
        value={87}
        icon="🌍"
        color="bg-purple-50 text-purple-700"
      />
    </div>
  );
}

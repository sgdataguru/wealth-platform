/**
 * @file app/(dashboard)/rm/components/RMMetricsBar.tsx
 * @description RM Metrics Bar for Morning Cockpit Dashboard
 */

'use client';

import type { RMDashboardMetrics } from '@/types/dashboard.types';

interface RMMetricsBarProps {
  metrics: RMDashboardMetrics | null;
  isLoading?: boolean;
}

export default function RMMetricsBar({ metrics, isLoading }: RMMetricsBarProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="bg-gradient-to-r from-[#1A1332] to-[#2A2447] rounded-lg shadow-md p-6 mb-8">
      {/* Greeting Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          {metrics.greeting}, {metrics.rmName}
        </h2>
        <p className="text-gray-300 text-sm mt-1">
          Your Morning Cockpit · Updated {new Date(metrics.lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {/* Total AUM */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Total AUM
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {metrics.totalAUM}
            </span>
            <span className={`text-xs font-semibold ${
              metrics.aumChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {metrics.aumChange >= 0 ? '↑' : '↓'} {Math.abs(metrics.aumChange)}%
            </span>
          </div>
        </div>

        {/* Net New Money */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Net New Money
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {metrics.netNewMoney}
            </span>
            <span className={`text-xs font-semibold ${
              metrics.netNewMoneyChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {metrics.netNewMoneyChange >= 0 ? '↑' : '↓'} {Math.abs(metrics.netNewMoneyChange)}%
            </span>
          </div>
        </div>

        {/* My Clients */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            My Clients
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {metrics.totalClients}
            </span>
            {metrics.atRiskClients > 0 && (
              <span className="text-xs font-semibold text-orange-400">
                {metrics.atRiskClients} at risk
              </span>
            )}
          </div>
        </div>

        {/* Urgent Alerts */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Urgent Alerts
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {metrics.criticalAlerts + metrics.warningAlerts}
            </span>
            <div className="flex gap-2 text-xs font-semibold">
              {metrics.criticalAlerts > 0 && (
                <span className="text-red-400">
                  {metrics.criticalAlerts} critical
                </span>
              )}
              {metrics.warningAlerts > 0 && (
                <span className="text-amber-400">
                  {metrics.warningAlerts} warning
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Today&apos;s Meetings */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Today&apos;s Meetings
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {metrics.meetingsToday}
            </span>
            <span className="text-xs font-semibold text-blue-400">
              scheduled
            </span>
          </div>
        </div>

        {/* Follow-ups Due */}
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Follow-ups Due
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {metrics.followUpsDue}
            </span>
            <span className="text-xs font-semibold text-purple-400">
              pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

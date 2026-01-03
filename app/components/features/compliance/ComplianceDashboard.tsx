/**
 * @file ComplianceDashboard.tsx
 * @description Main compliance dashboard with KPIs and overview
 * @module components/features/compliance
 */

'use client';

import { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { mockComplianceDashboardMetrics, mockComplianceAlerts } from '@/lib/mock-data/compliance-mock-data';

export default function ComplianceDashboard() {
  const metrics = mockComplianceDashboardMetrics;
  const recentAlerts = mockComplianceAlerts.slice(0, 5);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);

  const handleScan = async () => {
    setIsScanning(true);
    // Simulate scanning process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsScanning(false);
    setLastScanTime(new Date());
    alert('Compliance scan completed successfully! All clients reviewed.');
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Compliance Overview</h2>
            {lastScanTime && (
              <p className="text-sm text-slate-600">
                Last scan: {lastScanTime.toLocaleString()}
              </p>
            )}
          </div>
          <Button onClick={handleScan} disabled={isScanning}>
            {isScanning ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scanning...
              </>
            ) : (
              <>
                🔍 Scan All Clients
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Clients"
          value={metrics.totalClients}
          subtitle="Under management"
          icon="👥"
          color="bg-blue-50 text-blue-700"
        />
        <MetricCard
          title="Compliant Clients"
          value={`${metrics.compliantClients} (${Math.round((metrics.compliantClients / metrics.totalClients) * 100)}%)`}
          subtitle="Meeting all requirements"
          icon="✅"
          color="bg-emerald-50 text-emerald-700"
        />
        <MetricCard
          title="Active Alerts"
          value={metrics.activeAlerts}
          subtitle="Requiring attention"
          icon="🔔"
          color="bg-amber-50 text-amber-700"
          urgent={metrics.activeAlerts > 20}
        />
        <MetricCard
          title="Overall Score"
          value={`${metrics.overallComplianceScore}%`}
          subtitle={`Trend: ${metrics.trendDirection === 'UP' ? '↗' : metrics.trendDirection === 'DOWN' ? '↘' : '→'}`}
          icon="📊"
          color="bg-indigo-50 text-indigo-700"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending Reports</p>
              <p className="text-2xl font-bold text-slate-900">{metrics.pendingReports}</p>
            </div>
            <span className="text-3xl">📄</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Flagged Transactions</p>
              <p className="text-2xl font-bold text-slate-900">{metrics.flaggedTransactions}</p>
            </div>
            <span className="text-3xl">⚠️</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Cross-Border Transactions</p>
              <p className="text-2xl font-bold text-slate-900">{metrics.crossBorderTransactions}</p>
            </div>
            <span className="text-3xl">🌍</span>
          </div>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Alerts</h2>
        <div className="space-y-3">
          {recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <span className="text-2xl">
                {alert.severity === 'CRITICAL' ? '🔴' : alert.severity === 'HIGH' ? '🟠' : alert.severity === 'MEDIUM' ? '🟡' : '🟢'}
              </span>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{alert.title}</p>
                <p className="text-sm text-slate-600">{alert.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                    alert.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                    alert.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs text-slate-500">
                    {alert.authority || 'General'}
                  </span>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                alert.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                alert.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {alert.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  color: string;
  urgent?: boolean;
}

function MetricCard({ title, value, subtitle, icon, color, urgent }: MetricCardProps) {
  return (
    <Card className={`p-6 ${urgent ? 'ring-2 ring-red-500' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <span className={`text-4xl p-3 rounded-lg ${color}`}>{icon}</span>
      </div>
    </Card>
  );
}

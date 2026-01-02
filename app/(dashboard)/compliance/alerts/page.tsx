/**
 * @file page.tsx
 * @description Compliance alerts management page
 * @module app/(dashboard)/compliance/alerts
 */

'use client';

import Card from '@/app/components/ui/Card';
import ComplianceAlertPanel from '@/app/components/features/compliance/ComplianceAlertPanel';
import { mockComplianceAlerts } from '@/lib/mock-data/compliance-mock-data';

export default function AlertsPage() {
  const criticalCount = mockComplianceAlerts.filter((a) => a.severity === 'CRITICAL').length;
  const activeCount = mockComplianceAlerts.filter((a) => a.status === 'ACTIVE').length;
  const overdueCount = mockComplianceAlerts.filter((a) => 
    a.dueDate && new Date(a.dueDate) < new Date() && a.status === 'ACTIVE'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Compliance Alerts
        </h1>
        <p className="text-slate-600">
          Manage and track compliance alerts across all portfolios
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-red-500">
          <p className="text-sm text-slate-600 mb-1">Critical Alerts</p>
          <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500">
          <p className="text-sm text-slate-600 mb-1">Active Alerts</p>
          <p className="text-3xl font-bold text-blue-600">{activeCount}</p>
        </Card>
        <Card className="p-4 border-l-4 border-amber-500">
          <p className="text-sm text-slate-600 mb-1">Overdue Alerts</p>
          <p className="text-3xl font-bold text-amber-600">{overdueCount}</p>
        </Card>
      </div>

      {/* Alerts Panel */}
      <ComplianceAlertPanel />
    </div>
  );
}

/**
 * @file page.tsx
 * @description Live transaction monitoring page
 * @module app/(dashboard)/compliance/monitoring
 */

'use client';

import Card from '@/app/components/ui/Card';
import LiveTransactionStream from '@/app/components/features/compliance/LiveTransactionStream';
import MonitoredTransactionsTable from '@/app/components/features/compliance/MonitoredTransactionsTable';
import ComplianceMetricsGrid from '@/app/components/features/compliance/ComplianceMetricsGrid';

export default function MonitoringPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Real-Time Transaction Monitoring
        </h1>
        <p className="text-slate-600">
          Monitor transactions in real-time for compliance with AML/KYC regulations
        </p>
      </div>

      {/* Metrics */}
      <div className="mb-6">
        <ComplianceMetricsGrid />
      </div>

      {/* Live Stream */}
      <div className="mb-6">
        <LiveTransactionStream />
      </div>

      {/* Transactions Table */}
      <MonitoredTransactionsTable />
    </div>
  );
}

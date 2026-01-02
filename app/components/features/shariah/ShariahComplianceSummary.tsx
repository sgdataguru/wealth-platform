/**
 * @file ShariahComplianceSummary.tsx
 * @description Summary widget for Shariah compliance status
 * @module components/features/shariah
 */

'use client';

import Card from '@/app/components/ui/Card';
import { mockProductShariahInfo, mockShariahDriftAlerts } from '@/lib/mock-data/compliance-mock-data';

export default function ShariahComplianceSummary() {
  const products = mockProductShariahInfo;
  const alerts = mockShariahDriftAlerts;

  const compliantCount = products.filter((p) => p.shariahStatus === 'COMPLIANT').length;
  const nonCompliantCount = products.filter((p) => p.shariahStatus === 'NON_COMPLIANT').length;
  const pendingCount = products.filter((p) => p.shariahStatus === 'PENDING_REVIEW').length;
  const activeAlerts = alerts.filter((a) => a.status === 'PENDING').length;

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Shariah Compliance Summary
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-emerald-50 rounded-lg">
          <p className="text-3xl font-bold text-emerald-700">{compliantCount}</p>
          <p className="text-sm text-slate-600 mt-1">Compliant Products</p>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-3xl font-bold text-red-700">{nonCompliantCount}</p>
          <p className="text-sm text-slate-600 mt-1">Non-Compliant</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Pending Review</span>
          <span className="text-sm font-semibold text-slate-900">{pendingCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Active Alerts</span>
          <span className={`text-sm font-semibold ${activeAlerts > 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {activeAlerts}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Compliance Rate</span>
          <span className="text-sm font-semibold text-emerald-600">
            {products.length > 0 ? Math.round((compliantCount / products.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {activeAlerts > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm font-medium text-amber-900">
              ⚠️ {activeAlerts} portfolio{activeAlerts > 1 ? 's' : ''} require{activeAlerts === 1 ? 's' : ''} attention
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Review drift alerts to maintain Shariah compliance
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}

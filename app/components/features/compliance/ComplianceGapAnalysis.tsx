/**
 * @file ComplianceGapAnalysis.tsx
 * @description Gap analysis component for identifying compliance deficiencies
 * @module components/features/compliance
 */

'use client';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { mockComplianceGapSummary } from '@/lib/mock-data/compliance-mock-data';

export default function ComplianceGapAnalysis() {
  const gapSummary = mockComplianceGapSummary;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-slate-600 mb-1">Total Clients</p>
          <p className="text-3xl font-bold text-slate-900">{gapSummary.totalClients}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-600 mb-1">Clients with Gaps</p>
          <p className="text-3xl font-bold text-red-600">{gapSummary.clientsWithGaps}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-600 mb-1">Total Gaps</p>
          <p className="text-3xl font-bold text-amber-600">{gapSummary.totalGaps}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-600 mb-1">Gap Rate</p>
          <p className="text-3xl font-bold text-slate-900">
            {Math.round((gapSummary.clientsWithGaps / gapSummary.totalClients) * 100)}%
          </p>
        </Card>
      </div>

      {/* Gaps by Category */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Gaps by Category</h2>
        <div className="space-y-3">
          {Object.entries(gapSummary.gapsByCategory).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm font-medium text-slate-900 min-w-[120px]">
                  {category}
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-[#007B7A] h-full flex items-center justify-end px-2"
                    style={{ width: `${(count / gapSummary.totalGaps) * 100}%` }}
                  >
                    {count > 0 && (
                      <span className="text-xs text-white font-medium">{count}</span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-sm text-slate-600 ml-3">
                {Math.round((count / gapSummary.totalGaps) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Gaps by Severity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Gaps by Severity</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(gapSummary.gapsBySeverity).map(([severity, count]) => {
            const colors = {
              CRITICAL: 'bg-red-50 text-red-700 border-red-200',
              HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
              MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
              LOW: 'bg-slate-50 text-slate-700 border-slate-200',
            };
            return (
              <div
                key={severity}
                className={`p-4 rounded-lg border ${colors[severity as keyof typeof colors]}`}
              >
                <p className="text-xs font-medium mb-1">{severity}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Critical Gaps */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Critical Gaps Requiring Immediate Attention</h2>
          <Button size="sm">Bulk Assign</Button>
        </div>
        <div className="space-y-3">
          {gapSummary.criticalGaps.map((gap, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border-2 border-red-200 bg-red-50"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{gap.clientName}</h3>
                  <p className="text-sm text-slate-700">{gap.requirementName}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                  {gap.daysOverdue} days overdue
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                <span>Category: {gap.category}</span>
                <span>•</span>
                <span>Severity: {gap.severity}</span>
              </div>
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="text-sm text-slate-700">
                  <strong>Recommendation:</strong> {gap.recommendation}
                </p>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="secondary">
                  Assign to Officer
                </Button>
                <Button size="sm" variant="ghost">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

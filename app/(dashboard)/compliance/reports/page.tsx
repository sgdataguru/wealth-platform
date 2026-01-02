/**
 * @file page.tsx
 * @description Compliance Reports page
 * @module app/(dashboard)/compliance/reports
 */

'use client';

import { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import AuthoritySelector from '@/app/components/features/compliance/AuthoritySelector';
import ReportConfigForm from '@/app/components/features/compliance/ReportConfigForm';
import { mockRegulatoryReports } from '@/lib/mock-data/compliance-mock-data';
import type { RegulatoryAuthority, RegulatoryReport } from '@/types/compliance.types';

export default function ReportsPage() {
  const [selectedAuthority, setSelectedAuthority] = useState<RegulatoryAuthority | null>(null);
  const [showNewReportForm, setShowNewReportForm] = useState(false);

  const filteredReports = selectedAuthority
    ? mockRegulatoryReports.filter((r) => r.authority === selectedAuthority)
    : mockRegulatoryReports;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-slate-900">Regulatory Reports</h1>
          <Button onClick={() => setShowNewReportForm(!showNewReportForm)}>
            {showNewReportForm ? 'View Reports' : '+ Generate New Report'}
          </Button>
        </div>
        <p className="text-slate-600">
          Generate and manage compliance reports for GCC regulatory authorities
        </p>
      </div>

      {showNewReportForm ? (
        <ReportConfigForm />
      ) : (
        <>
          {/* Authority Filter */}
          <Card className="p-6 mb-6">
            <h2 className="text-sm font-medium text-slate-700 mb-3">Filter by Authority</h2>
            <AuthoritySelector
              selected={selectedAuthority}
              onChange={setSelectedAuthority}
            />
            {selectedAuthority && (
              <button
                onClick={() => setSelectedAuthority(null)}
                className="mt-3 text-sm text-slate-600 hover:text-slate-900"
              >
                Clear filter
              </button>
            )}
          </Card>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
            {filteredReports.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-slate-500">No reports found for selected authority</p>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ReportCard({ report }: { report: RegulatoryReport }) {
  const statusColors = {
    DRAFT: 'bg-slate-100 text-slate-700',
    PENDING_REVIEW: 'bg-amber-100 text-amber-700',
    APPROVED: 'bg-emerald-100 text-emerald-700',
    SUBMITTED: 'bg-blue-100 text-blue-700',
    ACKNOWLEDGED: 'bg-purple-100 text-purple-700',
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-900">
              {report.authority} - {report.reportType.replace(/_/g, ' ')}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
              {report.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            Period: {new Date(report.reportingPeriod.startDate).toLocaleDateString()} -{' '}
            {new Date(report.reportingPeriod.endDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost">View</Button>
          {report.exportUrl && (
            <Button size="sm" variant="secondary">Export</Button>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
        <div>
          <p className="text-xs text-slate-600">Total Transactions</p>
          <p className="text-lg font-semibold text-slate-900">{report.summary.totalTransactions}</p>
        </div>
        <div>
          <p className="text-xs text-slate-600">Total Volume</p>
          <p className="text-lg font-semibold text-slate-900">
            ${(report.summary.totalVolume / 1000000).toFixed(1)}M
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-600">Flagged</p>
          <p className="text-lg font-semibold text-red-600">{report.summary.flaggedTransactions}</p>
        </div>
        <div>
          <p className="text-xs text-slate-600">Cross-Border</p>
          <p className="text-lg font-semibold text-amber-600">{report.summary.crossBorderCount}</p>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-600 border-t border-slate-200 pt-3">
        <div>
          <span className="font-medium">Generated:</span>{' '}
          {new Date(report.generatedAt).toLocaleString()}
        </div>
        <div>
          <span className="font-medium">Format:</span> {report.exportFormat}
        </div>
        {report.approvedAt && (
          <div>
            <span className="font-medium">Approved:</span>{' '}
            {new Date(report.approvedAt).toLocaleString()}
          </div>
        )}
        {report.submittedAt && (
          <div>
            <span className="font-medium">Submitted:</span>{' '}
            {new Date(report.submittedAt).toLocaleString()}
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * @file AmlReportTemplate.tsx
 * @description AML Report template with authority-specific branding
 * @module components/features/deep-dive/templates
 */

'use client';

import type { ReportData, ReportFinding } from '@/types/deep-dive.types';

interface AmlReportTemplateProps {
  report: ReportData;
}

export default function AmlReportTemplate({ report }: AmlReportTemplateProps) {
  const getSeverityColor = (severity: ReportFinding['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getStatusColor = (status: ReportFinding['status']) => {
    switch (status) {
      case 'OPEN':
        return 'bg-red-50 text-red-700';
      case 'UNDER_REVIEW':
        return 'bg-blue-50 text-blue-700';
      case 'RESOLVED':
        return 'bg-green-50 text-green-700';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header with Authority Branding */}
      <div className="bg-gradient-to-r from-[#031926] to-[#007B7A] text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{report.title}</h1>
            <p className="text-sm opacity-90">Report Period: {report.period}</p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-xs opacity-75">Authority</p>
              <p className="text-xl font-bold">{report.authority}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">📊 Executive Summary</h2>
        <p className="text-gray-700 leading-relaxed">{report.summary}</p>
      </div>

      {/* Key Statistics */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📈 Key Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-600 font-medium mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-blue-900">
              {report.statistics.totalTransactions.toLocaleString()}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-xs text-red-600 font-medium mb-1">Flagged for Review</p>
            <p className="text-2xl font-bold text-red-900">
              {report.statistics.flaggedCount.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-xs text-green-600 font-medium mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-green-900">
              {formatCurrency(report.statistics.totalAmount)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-600 font-medium mb-1">Critical Cases</p>
            <p className="text-2xl font-bold text-purple-900">
              {report.statistics.riskDistribution.critical}
            </p>
          </div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Risk Distribution</h2>
        <div className="space-y-3">
          {Object.entries(report.statistics.riskDistribution).map(([level, count]) => {
            const percentage = (count / report.statistics.flaggedCount) * 100;
            return (
              <div key={level}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 capitalize">{level}</span>
                  <span className="text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      level === 'critical' ? 'bg-red-500' :
                      level === 'high' ? 'bg-orange-500' :
                      level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Findings */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">🔍 Key Findings</h2>
        <div className="space-y-4">
          {report.findings.map((finding) => (
            <div 
              key={finding.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded border ${getSeverityColor(finding.severity)}`}>
                    {finding.severity}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(finding.status)}`}>
                    {finding.status.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-xs text-gray-500">ID: {finding.id}</span>
              </div>
              <p className="text-gray-800 mb-3 leading-relaxed">{finding.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>👥 {finding.clientCount} clients affected</span>
                {finding.amount && <span>💰 {formatCurrency(finding.amount)}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>Report ID: {report.id}</p>
          <p>Generated for: {report.authority} Regulatory Authority</p>
        </div>
      </div>
    </div>
  );
}

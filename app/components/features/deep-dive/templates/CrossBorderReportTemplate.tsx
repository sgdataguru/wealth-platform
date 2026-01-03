/**
 * @file CrossBorderReportTemplate.tsx
 * @description Cross-Border Transaction Report template
 * @module components/features/deep-dive/templates
 */

'use client';

import type { ReportData, ReportFinding } from '@/types/deep-dive.types';

interface CrossBorderReportTemplateProps {
  report: ReportData;
}

export default function CrossBorderReportTemplate({ report }: CrossBorderReportTemplateProps) {
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
      {/* Header - Blue gradient for Cross-Border */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#007B7A] text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🌍</span>
              <h1 className="text-2xl font-bold">{report.title}</h1>
            </div>
            <p className="text-sm opacity-90">Analysis Period: {report.period}</p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-xs opacity-75">Jurisdiction</p>
              <p className="text-xl font-bold">{report.authority}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-6 bg-blue-50/50 border-b border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>📋</span> Executive Overview
        </h2>
        <p className="text-gray-700 leading-relaxed">{report.summary}</p>
      </div>

      {/* Transaction Flow Statistics */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📊</span> Transaction Flow Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-medium mb-1">Cross-Border Transactions</p>
            <p className="text-2xl font-bold text-blue-900">
              {report.statistics.totalTransactions.toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-700 font-medium mb-1">Requires Review</p>
            <p className="text-2xl font-bold text-amber-900">
              {report.statistics.flaggedCount.toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
            <p className="text-xs text-emerald-700 font-medium mb-1">Total Flow Value</p>
            <p className="text-2xl font-bold text-emerald-900">
              ${(report.statistics.totalAmount / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
            <p className="text-xs text-red-700 font-medium mb-1">High Risk</p>
            <p className="text-2xl font-bold text-red-900">
              {report.statistics.riskDistribution.high + report.statistics.riskDistribution.critical}
            </p>
          </div>
        </div>
      </div>

      {/* Corridor Risk Analysis */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>🚨</span> Corridor Risk Assessment
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Risk Level Breakdown</h3>
            <div className="space-y-2">
              {Object.entries(report.statistics.riskDistribution).map(([level, count]) => (
                <div key={level} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{level}</span>
                  <span className={`text-sm font-bold px-2 py-1 rounded ${
                    level === 'critical' ? 'bg-red-100 text-red-800' :
                    level === 'high' ? 'bg-orange-100 text-orange-800' :
                    level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Compliance Rate</h3>
            <div className="flex items-center justify-center h-24">
              <div className="text-center">
                <p className="text-4xl font-bold text-[#007B7A]">
                  {((1 - report.statistics.flaggedCount / report.statistics.totalTransactions) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Meeting Requirements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Findings */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>🔍</span> Detailed Findings
        </h2>
        <div className="space-y-4">
          {report.findings.map((finding, index) => (
            <div 
              key={finding.id}
              className="border-l-4 border-blue-500 bg-white rounded-r-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded border ${getSeverityColor(finding.severity)}`}>
                    {finding.severity} RISK
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-mono">{finding.id}</span>
              </div>
              <p className="text-gray-800 mb-3 leading-relaxed">{finding.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">
                  <span className="font-semibold">{finding.clientCount}</span> transactions
                </span>
                {finding.amount && (
                  <span className="text-gray-600">
                    Volume: <span className="font-semibold">{formatCurrency(finding.amount)}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p className="font-mono">{report.id}</p>
          <p className="font-medium">{report.authority} Cross-Border Monitoring</p>
        </div>
      </div>
    </div>
  );
}

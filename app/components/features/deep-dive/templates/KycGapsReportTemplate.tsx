/**
 * @file KycGapsReportTemplate.tsx
 * @description KYC Compliance Gaps Report template
 * @module components/features/deep-dive/templates
 */

'use client';

import type { ReportData, ReportFinding } from '@/types/deep-dive.types';

interface KycGapsReportTemplateProps {
  report: ReportData;
}

export default function KycGapsReportTemplate({ report }: KycGapsReportTemplateProps) {
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

  const getPriorityIcon = (severity: ReportFinding['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return '🚨';
      case 'HIGH':
        return '⚠️';
      case 'MEDIUM':
        return '⚡';
      case 'LOW':
        return '📌';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header - Amber/Gold gradient for KYC */}
      <div className="bg-gradient-to-r from-[#C9A84A] to-[#D4AF37] text-[#0A1628] p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📋</span>
              <h1 className="text-2xl font-bold">{report.title}</h1>
            </div>
            <p className="text-sm opacity-80">Review Period: {report.period}</p>
          </div>
          <div className="text-right">
            <div className="bg-[#0A1628]/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-xs opacity-75">Authority</p>
              <p className="text-xl font-bold">{report.authority}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="p-6 bg-amber-50/30 border-b border-amber-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>📄</span> Compliance Status Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">{report.summary}</p>
      </div>

      {/* KYC Metrics Dashboard */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📊</span> KYC Compliance Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-700 font-medium mb-1">Clients Reviewed</p>
            <p className="text-2xl font-bold text-purple-900">
              {report.statistics.totalTransactions.toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
            <p className="text-xs text-red-700 font-medium mb-1">Gaps Identified</p>
            <p className="text-2xl font-bold text-red-900">
              {report.statistics.flaggedCount.toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-700 font-medium mb-1">Action Required</p>
            <p className="text-2xl font-bold text-amber-900">
              {report.statistics.riskDistribution.high + report.statistics.riskDistribution.critical}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 font-medium mb-1">Compliance Rate</p>
            <p className="text-2xl font-bold text-green-900">
              {((1 - report.statistics.flaggedCount / report.statistics.totalTransactions) * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>⚡</span> Gap Priority Distribution
        </h2>
        <div className="space-y-3">
          {Object.entries(report.statistics.riskDistribution)
            .sort((a, b) => b[1] - a[1])
            .map(([level, count]) => {
              const percentage = (count / report.statistics.flaggedCount) * 100;
              return (
                <div key={level} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {level === 'critical' ? '🚨' : 
                         level === 'high' ? '⚠️' : 
                         level === 'medium' ? '⚡' : '📌'}
                      </span>
                      <span className="font-semibold text-gray-700 capitalize">{level} Priority</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {count} cases ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
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

      {/* Identified Gaps */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>🔍</span> Identified Compliance Gaps
        </h2>
        <div className="space-y-4">
          {report.findings.map((finding) => (
            <div 
              key={finding.id}
              className="bg-white border-2 border-amber-200 rounded-lg p-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getPriorityIcon(finding.severity)}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getSeverityColor(finding.severity)}`}>
                    {finding.severity} PRIORITY
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                  {finding.id}
                </span>
              </div>
              
              <div className="mb-3">
                <p className="text-gray-800 font-medium leading-relaxed mb-2">{finding.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-600">
                    <span>👥</span>
                    <span className="font-semibold">{finding.clientCount}</span> clients affected
                  </span>
                </div>
                <div className={`text-xs font-semibold px-3 py-1 rounded ${
                  finding.status === 'OPEN' ? 'bg-red-100 text-red-700' :
                  finding.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {finding.status.replace('_', ' ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-6 bg-amber-50 border-t border-amber-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span>💡</span> Recommended Actions
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#C9A84A] font-bold">•</span>
            <span>Prioritize critical and high-priority gaps for immediate remediation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#C9A84A] font-bold">•</span>
            <span>Implement automated reminders for document renewal deadlines</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#C9A84A] font-bold">•</span>
            <span>Conduct enhanced due diligence for clients with multiple gaps</span>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p className="font-mono">{report.id}</p>
          <p className="font-medium">{report.authority} KYC Compliance Review</p>
        </div>
      </div>
    </div>
  );
}

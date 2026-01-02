/**
 * @file ReportConfigForm.tsx
 * @description Form component for configuring regulatory report generation
 * @module components/features/compliance
 */

'use client';

import { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import type { RegulatoryAuthority, ReportType } from '@/types/compliance.types';

interface ReportConfig {
  authority: RegulatoryAuthority | '';
  reportType: ReportType | '';
  startDate: string;
  endDate: string;
  includeAuditTrail: boolean;
  exportFormat: 'PDF' | 'EXCEL' | 'XML' | 'JSON';
}

export default function ReportConfigForm() {
  const [config, setConfig] = useState<ReportConfig>({
    authority: '',
    reportType: '',
    startDate: '',
    endDate: '',
    includeAuditTrail: true,
    exportFormat: 'PDF',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
    alert('Report generated successfully!');
  };

  const isValid = config.authority && config.reportType && config.startDate && config.endDate;

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Generate Regulatory Report</h2>

      <div className="space-y-4">
        {/* Authority Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Regulatory Authority *
          </label>
          <select
            value={config.authority}
            onChange={(e) => setConfig({ ...config, authority: e.target.value as RegulatoryAuthority })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Select Authority</option>
            <option value="SAMA">SAMA - Saudi Arabia</option>
            <option value="DIFC">DIFC - Dubai</option>
            <option value="ADGM">ADGM - Abu Dhabi</option>
            <option value="CMA_SAUDI">CMA - Saudi Arabia</option>
            <option value="CBO">CBO - Oman</option>
            <option value="CBK">CBK - Kuwait</option>
          </select>
        </div>

        {/* Report Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Report Type *
          </label>
          <select
            value={config.reportType}
            onChange={(e) => setConfig({ ...config, reportType: e.target.value as ReportType })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Select Report Type</option>
            <option value="AML_MONITORING">AML Monitoring Report</option>
            <option value="CTF_MONITORING">CTF Monitoring Report</option>
            <option value="SUSPICIOUS_ACTIVITY">Suspicious Activity Report (SAR)</option>
            <option value="CROSS_BORDER">Cross-Border Transactions</option>
            <option value="LARGE_TRANSACTION">Large Transaction Report</option>
            <option value="CLIENT_DUE_DILIGENCE">Client Due Diligence (CDD)</option>
            <option value="CAPITAL_ADEQUACY">Capital Adequacy Report</option>
            <option value="MARKET_CONDUCT">Market Conduct Report</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              value={config.startDate}
              onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              End Date *
            </label>
            <input
              type="date"
              value={config.endDate}
              onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Quick Date Presets */}
        <div>
          <p className="text-xs text-slate-600 mb-2">Quick Select:</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - 1);
                setConfig({
                  ...config,
                  startDate: start.toISOString().split('T')[0],
                  endDate: end.toISOString().split('T')[0],
                });
              }}
            >
              Last Month
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - 3);
                setConfig({
                  ...config,
                  startDate: start.toISOString().split('T')[0],
                  endDate: end.toISOString().split('T')[0],
                });
              }}
            >
              Last Quarter
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const end = new Date();
                const start = new Date();
                start.setFullYear(start.getFullYear() - 1);
                setConfig({
                  ...config,
                  startDate: start.toISOString().split('T')[0],
                  endDate: end.toISOString().split('T')[0],
                });
              }}
            >
              Last Year
            </Button>
          </div>
        </div>

        {/* Export Format */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Export Format
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['PDF', 'EXCEL', 'XML', 'JSON'].map((format) => (
              <button
                key={format}
                onClick={() => setConfig({ ...config, exportFormat: format as any })}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  config.exportFormat === format
                    ? 'border-[#007B7A] bg-[#007B7A]/10 text-[#007B7A]'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.includeAuditTrail}
              onChange={(e) => setConfig({ ...config, includeAuditTrail: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">Include Audit Trail</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleGenerate}
            disabled={!isValid || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setConfig({
                authority: '',
                reportType: '',
                startDate: '',
                endDate: '',
                includeAuditTrail: true,
                exportFormat: 'PDF',
              });
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}

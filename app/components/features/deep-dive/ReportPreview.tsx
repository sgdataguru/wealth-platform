/**
 * @file ReportPreview.tsx
 * @description Report preview panel with template rendering and export options
 * @module components/features/deep-dive
 */

'use client';

import { useState } from 'react';
import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import AmlReportTemplate from './templates/AmlReportTemplate';
import CrossBorderReportTemplate from './templates/CrossBorderReportTemplate';
import KycGapsReportTemplate from './templates/KycGapsReportTemplate';
import type { ReportData, OutputFormat } from '@/types/deep-dive.types';

interface ReportPreviewProps {
  report: ReportData | null;
  lastUpdated: Date | null;
}

export default function ReportPreview({ report, lastUpdated }: ReportPreviewProps) {
  const [exportFormat, setExportFormat] = useState<OutputFormat>('PDF');
  const [showExportToast, setShowExportToast] = useState(false);

  const handleExport = (format: OutputFormat) => {
    setExportFormat(format);
    setShowExportToast(true);
    
    // Simulate export action
    setTimeout(() => {
      setShowExportToast(false);
    }, 3000);
  };

  const handleCopyJson = async () => {
    if (!report) return;
    
    try {
      const jsonString = JSON.stringify(report, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setExportFormat('JSON');
      setShowExportToast(true);
      setTimeout(() => setShowExportToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  if (!report) {
    return (
      <Card className="h-full">
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
          📄 Report Preview
        </h2>
        <div className="flex flex-col items-center justify-center h-96 text-[var(--text-muted)]">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-center">Select a prompt to generate a report preview</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col" padding="none">
      {/* Header with Export Controls */}
      <div className="p-6 border-b border-[var(--header-border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            📄 Report Preview
          </h2>
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <span className="animate-pulse">🔄</span>
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleExport('PDF')}
            leftIcon={<span>📄</span>}
            aria-label="Export as PDF (demo)"
          >
            Export PDF
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleExport('EXCEL')}
            leftIcon={<span>📊</span>}
            aria-label="Export as Excel (demo)"
          >
            Export Excel
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyJson}
            leftIcon={<span>📋</span>}
            aria-label="Copy JSON to clipboard"
          >
            Copy JSON
          </Button>
        </div>

        {/* Export Toast */}
        {showExportToast && (
          <div 
            className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 animate-slide-up"
            role="alert"
          >
            <span className="font-semibold">✅ Demo Export:</span> {exportFormat} format copied to clipboard
          </div>
        )}
      </div>

      {/* Report Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {report.reportType === 'AML' && <AmlReportTemplate report={report} />}
        {report.reportType === 'CROSS_BORDER' && <CrossBorderReportTemplate report={report} />}
        {report.reportType === 'KYC_GAPS' && <KycGapsReportTemplate report={report} />}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-[var(--header-border)] bg-[var(--bg-secondary)]">
        <p className="text-xs text-[var(--text-muted)] flex items-center gap-2">
          <span>ℹ️</span>
          <span>This is a demo preview. All data is mock and auto-refreshes every 5 seconds.</span>
        </p>
      </div>
    </Card>
  );
}

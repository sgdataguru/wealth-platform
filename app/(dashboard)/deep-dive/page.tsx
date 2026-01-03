/**
 * @file page.tsx
 * @description NLP Reports Deep-Dive Demo Page
 * @module app/(dashboard)/deep-dive
 */

'use client';

import { useState, useEffect } from 'react';
import NlpPromptPanel from '@/app/components/features/deep-dive/NlpPromptPanel';
import IntentViewer from '@/app/components/features/deep-dive/IntentViewer';
import SqlPreview from '@/app/components/features/deep-dive/SqlPreview';
import ReportPreview from '@/app/components/features/deep-dive/ReportPreview';
import { parseNlpIntent, generateSqlPreview } from '@/lib/deep-dive/nlp-parser';
import { generateMockReportData } from '@/lib/deep-dive/mock-data';
import type { Intent, ReportData } from '@/types/deep-dive.types';
import { Header, Sidebar } from '@/app/components/layout';

export default function DeepDivePage() {
  const [prompt, setPrompt] = useState('');
  const [intent, setIntent] = useState<Intent | null>(null);
  const [sqlQuery, setSqlQuery] = useState<string | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Handle prompt changes and parse intent
  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
    
    if (newPrompt.trim()) {
      const parsedIntent = parseNlpIntent(newPrompt);
      setIntent(parsedIntent);
      
      const sql = generateSqlPreview(parsedIntent);
      setSqlQuery(sql);
      
      const reportData = generateMockReportData(parsedIntent);
      setReport(reportData);
      setLastUpdated(new Date());
    } else {
      setIntent(null);
      setSqlQuery(null);
      setReport(null);
      setLastUpdated(null);
    }
  };

  // Auto-refresh report data every 5 seconds
  useEffect(() => {
    if (!intent) return;

    const intervalId = setInterval(() => {
      const updatedReport = generateMockReportData(intent);
      setReport(updatedReport);
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(intervalId);
  }, [intent]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header />
      <div className="flex">
        <Sidebar activePage="deep-dive" />
        <main className="flex-1 p-4 md:p-6 bg-[var(--bg-secondary)]">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
            NLP Reports – Deep Dive
          </h1>
          <span className="px-3 py-1 bg-[#C9A84A] text-[#0A1628] text-xs font-bold rounded-full">
            DEMO
          </span>
        </div>
        <p className="text-[var(--text-secondary)] text-sm md:text-base">
          End-to-end NLP-to-report pipeline simulation for GCC regulatory compliance
        </p>
      </div>

      {/* Flow Indicator */}
      <div className="mb-6 bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--header-border)]">
        <div className="flex items-center justify-center gap-2 md:gap-4 text-xs md:text-sm text-[var(--text-muted)] flex-wrap">
          <span className={`font-semibold ${prompt ? 'text-[#007B7A]' : ''}`}>
            📝 NLP Input
          </span>
          <span>→</span>
          <span className={`font-semibold ${intent ? 'text-[#007B7A]' : ''}`}>
            🎯 JSON Intent
          </span>
          <span>→</span>
          <span className={`font-semibold ${sqlQuery ? 'text-[#007B7A]' : ''}`}>
            💾 SQL Filter
          </span>
          <span>→</span>
          <span className={`font-semibold ${report ? 'text-[#007B7A]' : ''}`}>
            📊 Report Data
          </span>
          <span>→</span>
          <span className={`font-semibold ${report ? 'text-[#007B7A]' : ''}`}>
            📄 HTML Template
          </span>
          <span>→</span>
          <span className="font-semibold">💾 Export</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Left Panel - NLP Input */}
        <div className="lg:col-span-3">
          <div className="h-[600px] md:h-[700px]">
            <NlpPromptPanel 
              onPromptChange={handlePromptChange}
              currentPrompt={prompt}
            />
          </div>
        </div>

        {/* Middle Panels - Intent & SQL */}
        <div className="lg:col-span-3 space-y-4 md:space-y-6">
          <div className="h-[350px]">
            <IntentViewer intent={intent} />
          </div>
          <div className="h-[320px] md:h-[320px]">
            <SqlPreview sqlQuery={sqlQuery} />
          </div>
        </div>

        {/* Right Panel - Report Preview */}
        <div className="lg:col-span-6">
          <div className="h-[700px] md:h-[700px]">
            <ReportPreview report={report} lastUpdated={lastUpdated} />
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="mt-6 bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--header-border)]">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">
              How to Use This Demo:
            </h3>
            <ul className="text-sm text-[var(--text-secondary)] space-y-1">
              <li>• Select a pre-configured demo phrase or type your own natural language query</li>
              <li>• Watch the flow: NLP text → JSON intent → SQL query → Report generation</li>
              <li>• Report data auto-refreshes every 5 seconds with randomized statistics</li>
              <li>• Different authorities (SAMA, DIFC, ADGM, etc.) generate authority-specific templates</li>
              <li>• Export buttons demonstrate PDF/Excel/JSON download capabilities (clipboard copy)</li>
              <li>• Fully offline - no backend, database, or API calls</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Accessibility Live Region */}
      <div 
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {lastUpdated && `Report updated at ${lastUpdated.toLocaleTimeString()}`}
      </div>
        </main>
      </div>
    </div>
  );
}

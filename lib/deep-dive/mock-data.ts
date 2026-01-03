/**
 * @file mock-data.ts
 * @description Mock data generator for NLP Reports Deep-Dive demo
 * @module lib/deep-dive
 */

import type { ReportData, ReportFinding, Intent, DemoPhrase } from '@/types/deep-dive.types';

/**
 * Demo phrases for quick selection (GCC-centric)
 */
export const DEMO_PHRASES: DemoPhrase[] = [
  {
    id: '1',
    text: 'Generate SAMA AML flagged transactions report for Q4 2025 as PDF',
    category: 'AML',
    authority: 'SAMA',
  },
  {
    id: '2',
    text: 'DIFC cross-border corridors report for December, high risk only',
    category: 'CROSS_BORDER',
    authority: 'DIFC',
  },
  {
    id: '3',
    text: 'ADGM KYC gaps summary, overdue clients, Excel format',
    category: 'KYC_GAPS',
    authority: 'ADGM',
  },
  {
    id: '4',
    text: 'List flagged AML alerts for CMA for last month',
    category: 'AML',
    authority: 'CMA',
  },
  {
    id: '5',
    text: 'Show cross-border breaches for CBK (Kuwait), urgent cases only',
    category: 'CROSS_BORDER',
    authority: 'CBK',
  },
  {
    id: '6',
    text: 'Aggregate KYC incomplete docs for DIFC, JSON export',
    category: 'KYC_GAPS',
    authority: 'DIFC',
  },
  {
    id: '7',
    text: 'CBO suspicious transaction analysis (AML), risk rating HIGH',
    category: 'AML',
    authority: 'CBO',
  },
  {
    id: '8',
    text: 'SAMA AML monitoring, download as PDF',
    category: 'AML',
    authority: 'SAMA',
  },
  {
    id: '9',
    text: 'ADGM client accreditation gaps for Q1, Excel',
    category: 'KYC_GAPS',
    authority: 'ADGM',
  },
  {
    id: '10',
    text: 'GCC region AML and cross-border risk dashboard, top severity',
    category: 'AML',
    authority: 'SAMA',
  },
];

/**
 * Generate mock report data based on intent
 * Re-randomizes statistics on each call for live refresh effect
 */
export function generateMockReportData(intent: Intent): ReportData {
  const { authority, reportType, dateRange } = intent;
  
  const baseStats = {
    totalTransactions: Math.floor(Math.random() * 5000) + 1000,
    flaggedCount: Math.floor(Math.random() * 500) + 50,
    totalAmount: Math.floor(Math.random() * 50000000) + 10000000,
    riskDistribution: {
      low: Math.floor(Math.random() * 100) + 20,
      medium: Math.floor(Math.random() * 80) + 30,
      high: Math.floor(Math.random() * 50) + 15,
      critical: Math.floor(Math.random() * 20) + 5,
    },
  };
  
  const report: ReportData = {
    id: `RPT-${Date.now()}`,
    title: getReportTitle(reportType, authority),
    authority,
    reportType,
    period: `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`,
    summary: getReportSummary(reportType, authority, baseStats),
    findings: generateFindings(reportType, authority),
    statistics: baseStats,
    updatedAt: new Date(),
  };
  
  return report;
}

function getReportTitle(reportType: string, authority: string): string {
  const titles = {
    AML: `Anti-Money Laundering Compliance Report - ${authority}`,
    CROSS_BORDER: `Cross-Border Transaction Analysis - ${authority}`,
    KYC_GAPS: `KYC Compliance Gap Analysis - ${authority}`,
  };
  
  return titles[reportType as keyof typeof titles] || 'Compliance Report';
}

function getReportSummary(reportType: string, authority: string, stats: ReportData['statistics']): string {
  const summaries = {
    AML: `This report provides a comprehensive analysis of AML compliance for ${authority} jurisdiction. 
    A total of ${stats.totalTransactions} transactions were analyzed, with ${stats.flaggedCount} requiring further review. 
    The aggregate transaction value under scrutiny amounts to $${(stats.totalAmount / 1000000).toFixed(1)}M.`,
    
    CROSS_BORDER: `Cross-border transaction analysis for ${authority} regulatory framework. 
    ${stats.totalTransactions} international transactions processed, identifying ${stats.flaggedCount} cases requiring compliance verification. 
    Total cross-border flow: $${(stats.totalAmount / 1000000).toFixed(1)}M.`,
    
    KYC_GAPS: `KYC compliance status review for ${authority} jurisdiction. 
    ${stats.totalTransactions} client profiles assessed, revealing ${stats.flaggedCount} incomplete or overdue documentation cases. 
    Immediate attention required for ${stats.riskDistribution.critical + stats.riskDistribution.high} high-priority clients.`,
  };
  
  return summaries[reportType as keyof typeof summaries] || 'Compliance analysis report';
}

function generateFindings(reportType: string, authority: string): ReportFinding[] {
  const findingCount = Math.floor(Math.random() * 3) + 3; // 3-5 findings
  const findings: ReportFinding[] = [];
  
  for (let i = 0; i < findingCount; i++) {
    findings.push({
      id: `F-${i + 1}`,
      severity: getRandomSeverity(),
      description: getFindingDescription(reportType, authority, i),
      clientCount: Math.floor(Math.random() * 50) + 5,
      amount: Math.floor(Math.random() * 5000000) + 100000,
      status: getRandomStatus(),
    });
  }
  
  return findings;
}

function getFindingDescription(reportType: string, authority: string, index: number): string {
  const descriptions = {
    AML: [
      `Multiple large cash deposits detected from high-risk jurisdictions under ${authority} monitoring`,
      `Unusual transaction patterns involving shell companies in sanctioned territories`,
      `Rapid movement of funds across multiple accounts flagged by ${authority} screening`,
      `Structuring activities detected below reporting threshold`,
      `Suspicious wire transfers to cryptocurrency exchanges`,
    ],
    CROSS_BORDER: [
      `Cross-border payments to non-cooperative jurisdictions exceeding ${authority} limits`,
      `Inconsistent documentation for large international transfers`,
      `Frequent transactions with high-risk correspondent banks`,
      `Unusual trade finance activities requiring enhanced due diligence`,
      `Cross-border fund flows inconsistent with client profile`,
    ],
    KYC_GAPS: [
      `Expired identity documents not renewed within ${authority} grace period`,
      `Missing beneficial ownership declarations for corporate entities`,
      `Incomplete source of wealth documentation for UHNW clients`,
      `Overdue periodic reviews for high-risk client segments`,
      `Insufficient proof of address for new account openings`,
    ],
  };
  
  const typeDescriptions = descriptions[reportType as keyof typeof descriptions] || descriptions.AML;
  return typeDescriptions[index % typeDescriptions.length];
}

function getRandomSeverity(): ReportFinding['severity'] {
  const severities: ReportFinding['severity'][] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const weights = [0.3, 0.4, 0.2, 0.1]; // More low/medium, fewer critical
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random < cumulative) return severities[i];
  }
  
  return 'MEDIUM';
}

function getRandomStatus(): ReportFinding['status'] {
  const statuses: ReportFinding['status'][] = ['OPEN', 'UNDER_REVIEW', 'RESOLVED'];
  const weights = [0.4, 0.4, 0.2];
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random < cumulative) return statuses[i];
  }
  
  return 'OPEN';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

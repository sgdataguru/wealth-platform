/**
 * @file deep-dive.types.ts
 * @description Type definitions for NLP Reports Deep-Dive feature
 * @module types/deep-dive
 */

export type GCCAuthority = 
  | 'SAMA'    // Saudi Arabia Monetary Authority
  | 'DIFC'    // Dubai International Financial Centre
  | 'ADGM'    // Abu Dhabi Global Market
  | 'CMA'     // Capital Market Authority (Saudi)
  | 'CBK'     // Central Bank of Kuwait
  | 'CBO';    // Central Bank of Oman

export type ReportType = 'AML' | 'CROSS_BORDER' | 'KYC_GAPS';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type OutputFormat = 'PDF' | 'EXCEL' | 'JSON';

export interface Intent {
  authority: GCCAuthority;
  reportType: ReportType;
  riskLevel?: RiskLevel;
  dateRange: {
    start: string;
    end: string;
  };
  outputFormat: OutputFormat;
  filters?: {
    urgentOnly?: boolean;
    overdueOnly?: boolean;
    flaggedOnly?: boolean;
  };
}

export interface ReportData {
  id: string;
  title: string;
  authority: GCCAuthority;
  reportType: ReportType;
  period: string;
  summary: string;
  findings: ReportFinding[];
  statistics: ReportStatistics;
  updatedAt: Date;
}

export interface ReportFinding {
  id: string;
  severity: RiskLevel;
  description: string;
  clientCount: number;
  amount?: number;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED';
}

export interface ReportStatistics {
  totalTransactions: number;
  flaggedCount: number;
  totalAmount: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface DemoPhrase {
  id: string;
  text: string;
  category: ReportType;
  authority: GCCAuthority;
}

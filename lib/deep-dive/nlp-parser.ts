/**
 * @file nlp-parser.ts
 * @description Deterministic NLP parser for demo phrases (offline, no AI)
 * @module lib/deep-dive
 */

import type { Intent, GCCAuthority, ReportType, RiskLevel, OutputFormat } from '@/types/deep-dive.types';

/**
 * Parse natural language text into structured Intent
 * Uses deterministic string matching for demo purposes
 */
export function parseNlpIntent(text: string): Intent {
  const lowerText = text.toLowerCase();
  
  // Detect authority
  const authority = detectAuthority(lowerText);
  
  // Detect report type
  const reportType = detectReportType(lowerText);
  
  // Detect risk level
  const riskLevel = detectRiskLevel(lowerText);
  
  // Detect date range
  const dateRange = detectDateRange(lowerText);
  
  // Detect output format
  const outputFormat = detectOutputFormat(lowerText);
  
  // Detect filters
  const filters = detectFilters(lowerText);
  
  const hasFilters = Object.keys(filters).length > 0;
  
  return {
    authority,
    reportType,
    riskLevel,
    dateRange,
    outputFormat,
    ...(hasFilters ? { filters } : {}),
  };
}

function detectAuthority(text: string): GCCAuthority {
  if (text.includes('sama')) return 'SAMA';
  if (text.includes('difc')) return 'DIFC';
  if (text.includes('adgm')) return 'ADGM';
  if (text.includes('cma')) return 'CMA';
  if (text.includes('cbk') || text.includes('kuwait')) return 'CBK';
  if (text.includes('cbo') || text.includes('oman')) return 'CBO';
  
  // Default to SAMA if no authority specified
  return 'SAMA';
}

function detectReportType(text: string): ReportType {
  if (text.includes('aml') || text.includes('anti-money') || text.includes('suspicious') || text.includes('flagged')) {
    return 'AML';
  }
  if (text.includes('cross-border') || text.includes('corridor') || text.includes('breach')) {
    return 'CROSS_BORDER';
  }
  if (text.includes('kyc') || text.includes('gap') || text.includes('incomplete') || text.includes('accreditation') || text.includes('overdue')) {
    return 'KYC_GAPS';
  }
  
  // Default to AML
  return 'AML';
}

function detectRiskLevel(text: string): RiskLevel | undefined {
  if (text.includes('critical') || text.includes('urgent')) return 'CRITICAL';
  if (text.includes('high')) return 'HIGH';
  if (text.includes('medium')) return 'MEDIUM';
  if (text.includes('low')) return 'LOW';
  
  return undefined;
}

function detectDateRange(text: string): { start: string; end: string } {
  const now = new Date();
  
  // Q4 2025
  if (text.includes('q4 2025')) {
    return {
      start: '2025-10-01',
      end: '2025-12-31',
    };
  }
  
  // Q1
  if (text.includes('q1')) {
    const year = now.getFullYear();
    return {
      start: `${year}-01-01`,
      end: `${year}-03-31`,
    };
  }
  
  // December / last month
  if (text.includes('december') || text.includes('last month')) {
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const year = lastMonth.getFullYear();
    const month = String(lastMonth.getMonth() + 1).padStart(2, '0');
    const lastDay = new Date(year, lastMonth.getMonth() + 1, 0).getDate();
    
    return {
      start: `${year}-${month}-01`,
      end: `${year}-${month}-${lastDay}`,
    };
  }
  
  // Default: Last 30 days
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return {
    start: thirtyDaysAgo.toISOString().split('T')[0],
    end: now.toISOString().split('T')[0],
  };
}

function detectOutputFormat(text: string): OutputFormat {
  if (text.includes('pdf')) return 'PDF';
  if (text.includes('excel') || text.includes('xlsx')) return 'EXCEL';
  if (text.includes('json')) return 'JSON';
  
  // Default to PDF
  return 'PDF';
}

function detectFilters(text: string): { urgentOnly?: boolean; overdueOnly?: boolean; flaggedOnly?: boolean } {
  const filters: { urgentOnly?: boolean; overdueOnly?: boolean; flaggedOnly?: boolean } = {};
  
  if (text.includes('urgent')) {
    filters.urgentOnly = true;
  }
  
  if (text.includes('overdue')) {
    filters.overdueOnly = true;
  }
  
  if (text.includes('flagged')) {
    filters.flaggedOnly = true;
  }
  
  return filters;
}

/**
 * Generate SQL preview based on Intent
 */
export function generateSqlPreview(intent: Intent): string {
  const { authority, reportType, riskLevel, dateRange, filters } = intent;
  
  let sql = 'SELECT\n';
  
  // Select columns based on report type
  if (reportType === 'AML') {
    sql += '  t.transaction_id,\n';
    sql += '  t.client_id,\n';
    sql += '  t.amount,\n';
    sql += '  t.currency,\n';
    sql += '  t.risk_score,\n';
    sql += '  t.flagged_reason,\n';
    sql += '  t.transaction_date\n';
    sql += 'FROM aml_transactions t\n';
  } else if (reportType === 'CROSS_BORDER') {
    sql += '  cb.transaction_id,\n';
    sql += '  cb.source_country,\n';
    sql += '  cb.destination_country,\n';
    sql += '  cb.amount,\n';
    sql += '  cb.risk_level,\n';
    sql += '  cb.compliance_status\n';
    sql += 'FROM cross_border_transactions cb\n';
  } else if (reportType === 'KYC_GAPS') {
    sql += '  c.client_id,\n';
    sql += '  c.client_name,\n';
    sql += '  k.missing_documents,\n';
    sql += '  k.last_review_date,\n';
    sql += '  k.days_overdue,\n';
    sql += '  k.priority\n';
    sql += 'FROM kyc_compliance k\n';
    sql += 'JOIN clients c ON k.client_id = c.client_id\n';
  }
  
  // WHERE clause
  const conditions: string[] = [];
  conditions.push(`regulatory_authority = '${authority}'`);
  conditions.push(`date BETWEEN '${dateRange.start}' AND '${dateRange.end}'`);
  
  if (riskLevel) {
    conditions.push(`risk_level = '${riskLevel}'`);
  }
  
  if (filters?.urgentOnly) {
    conditions.push(`priority = 'URGENT'`);
  }
  
  if (filters?.overdueOnly) {
    conditions.push(`days_overdue > 0`);
  }
  
  if (filters?.flaggedOnly) {
    conditions.push(`is_flagged = true`);
  }
  
  sql += 'WHERE\n  ' + conditions.join(' AND\n  ');
  
  sql += '\nORDER BY\n';
  if (reportType === 'AML') {
    sql += '  t.risk_score DESC,\n  t.transaction_date DESC';
  } else if (reportType === 'CROSS_BORDER') {
    sql += '  cb.risk_level DESC,\n  cb.amount DESC';
  } else {
    sql += '  k.days_overdue DESC,\n  k.priority DESC';
  }
  
  sql += '\nLIMIT 1000;';
  
  return sql;
}

/**
 * @file compliance.types.ts
 * @description Type definitions for compliance features
 * @module types/compliance
 */

// ============================================
// SHARIAH COMPLIANCE TYPES (Plan 28)
// ============================================

export type ShariahStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING_REVIEW' | 'NOT_APPLICABLE';

export interface ShariahPreference {
  requiresShariahCompliance: boolean;
  preferenceLevel: 'STRICT' | 'PREFERRED' | 'NO_PREFERENCE';
  certificationAuthority?: string;
  notes?: string;
}

export interface ProductShariahInfo {
  productId: string;
  shariahStatus: ShariahStatus;
  certifiedBy?: string;
  certificationDate?: Date;
  certificationExpiry?: Date;
  certificateUrl?: string;
  screeningCriteria?: ShariahScreeningCriteria;
  lastScreenedAt?: Date;
  updatedBy: string;
  updatedAt: Date;
}

export interface ShariahScreeningCriteria {
  prohibitedActivitiesCheck: boolean;
  debtToAssetRatio?: number;
  interestIncomeRatio?: number;
  receivablesRatio?: number;
  screeningNotes?: string;
}

export interface ShariahDriftAlert {
  id: string;
  clientId: string;
  portfolioId: string;
  alertType: 'NEW_NON_COMPLIANT' | 'STATUS_CHANGED' | 'CERTIFICATION_EXPIRED';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  affectedHoldings: {
    productId: string;
    productName: string;
    holdingValue: number;
    holdingPercentage: number;
    reason: string;
  }[];
  status: 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED';
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolutionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// GCC REGULATORY COMPLIANCE TYPES (Plan 29)
// ============================================

export type RegulatoryAuthority = 'SAMA' | 'DIFC' | 'ADGM' | 'CMA_SAUDI' | 'CBO' | 'CBK';

export interface RegulatoryConfig {
  authority: RegulatoryAuthority;
  jurisdiction: string;
  reportingFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  mandatoryFields: string[];
  thresholds: ComplianceThresholds;
  enabled: boolean;
}

export interface ComplianceThresholds {
  singleTransactionLimit: number;
  dailyTransactionLimit: number;
  monthlyTransactionLimit: number;
  crossBorderReportingThreshold: number;
  rapidTransactionCount: number;
  rapidTransactionTimeframe: number;
  unusualPatternDeviation: number;
}

export interface MonitoredTransaction {
  id: string;
  clientId: string;
  portfolioId: string;
  transactionType: 'BUY' | 'SELL' | 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  currency: string;
  isCrossBorder: boolean;
  sourceJurisdiction?: string;
  destinationJurisdiction?: string;
  complianceStatus: 'COMPLIANT' | 'FLAGGED' | 'UNDER_REVIEW' | 'CLEARED' | 'ESCALATED';
  flagReasons: string[];
  clientRiskRating: 'LOW' | 'MEDIUM' | 'HIGH';
  enhancedDueDiligence: boolean;
  politicallyExposed: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  transactionDate: Date;
  monitoredAt: Date;
  updatedAt: Date;
}

export type ReportType = 
  | 'AML_MONITORING'
  | 'CTF_MONITORING'
  | 'SUSPICIOUS_ACTIVITY'
  | 'CROSS_BORDER'
  | 'LARGE_TRANSACTION'
  | 'CLIENT_DUE_DILIGENCE'
  | 'CAPITAL_ADEQUACY'
  | 'MARKET_CONDUCT'
  | 'CUSTOM';

export interface RegulatoryReport {
  id: string;
  authority: RegulatoryAuthority;
  reportType: ReportType;
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
  };
  summary: ReportSummary;
  transactions: MonitoredTransaction[];
  suspiciousActivities: SuspiciousActivity[];
  crossBorderTransactions: CrossBorderTransaction[];
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'SUBMITTED' | 'ACKNOWLEDGED';
  generatedBy: string;
  generatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  submittedAt?: Date;
  exportFormat: 'PDF' | 'EXCEL' | 'XML' | 'JSON';
  exportUrl?: string;
  auditTrailId: string;
}

export interface ReportSummary {
  totalTransactions: number;
  totalVolume: number;
  flaggedTransactions: number;
  suspiciousActivities: number;
  crossBorderCount: number;
  highRiskClients: number;
  pepClients: number;
}

export interface SuspiciousActivity {
  id: string;
  transactionIds: string[];
  clientId: string;
  alertType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  indicators: string[];
  investigationStatus: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED';
  assignedTo?: string;
  findings?: string;
  actionTaken?: string;
  detectedAt: Date;
  investigatedAt?: Date;
  resolvedAt?: Date;
}

export interface CrossBorderTransaction {
  transactionId: string;
  sender: {
    name: string;
    jurisdiction: string;
    bankDetails: string;
  };
  recipient: {
    name: string;
    jurisdiction: string;
    bankDetails: string;
  };
  amount: number;
  currency: string;
  purpose: string;
  supportingDocuments: string[];
  requiredDisclosures: string[];
  disclosuresMet: boolean;
  approvalRequired: boolean;
  approvedBy?: string;
  transactionDate: Date;
  reportedAt: Date;
}

export interface ComplianceAlert {
  id: string;
  alertType: 'THRESHOLD_EXCEEDED' | 'SUSPICIOUS_PATTERN' | 'CROSS_BORDER_FLAGGED' | 'MISSING_DOCUMENTATION' | 'REGULATORY_DEADLINE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  relatedEntityType: 'TRANSACTION' | 'CLIENT' | 'PORTFOLIO' | 'REPORT';
  relatedEntityId: string;
  authority?: RegulatoryAuthority;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'FALSE_POSITIVE';
  assignedTo?: string;
  resolutionNotes?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  triggeredAt: Date;
  acknowledgedAt?: Date;
  dueDate?: Date;
}

// ============================================
// COMPLIANCE TAB TYPES (Plan 34)
// ============================================

export type Jurisdiction = 'SAUDI_ARABIA' | 'UAE' | 'KUWAIT' | 'QATAR' | 'BAHRAIN' | 'OMAN';
export type ComplianceAuthority = 'SAMA' | 'DIFC' | 'ADGM' | 'CMA' | 'CBO' | 'CBK' | 'QFMA';
export type ComplianceCategory = 'AML' | 'KYC' | 'CROSS_BORDER' | 'SHARIAH' | 'REPORTING' | 'LICENSING';
export type ComplianceSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ComplianceTerm {
  id: string;
  name: string;
  description: string;
  jurisdiction: Jurisdiction;
  authority: ComplianceAuthority;
  effectiveDate: Date;
  expiryDate?: Date;
  mandatory: boolean;
  category: ComplianceCategory;
  severity: ComplianceSeverity;
  version: string;
  documentationIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientComplianceStatus {
  clientId: string;
  clientName: string;
  overallScore: number; // 0-100
  requirements: ComplianceRequirement[];
  missingCount: number;
  upcomingDeadlines: ComplianceDeadline[];
  lastReviewDate: Date;
  nextReviewDate: Date;
  assignedOfficer?: string;
}

export interface ComplianceRequirement {
  id: string;
  termId: string;
  termName: string;
  category: ComplianceCategory;
  status: 'MET' | 'PENDING' | 'OVERDUE' | 'NOT_APPLICABLE';
  dueDate?: Date;
  completedDate?: Date;
  evidence: ComplianceEvidence[];
  notes?: string;
}

export interface ComplianceEvidence {
  id: string;
  requirementId: string;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: Date;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface ComplianceDeadline {
  requirementId: string;
  requirementName: string;
  dueDate: Date;
  severity: ComplianceSeverity;
  daysRemaining: number;
  status: 'UPCOMING' | 'DUE_SOON' | 'OVERDUE';
}

export interface ComplianceGapSummary {
  totalClients: number;
  clientsWithGaps: number;
  totalGaps: number;
  gapsByCategory: Record<ComplianceCategory, number>;
  gapsBySeverity: Record<ComplianceSeverity, number>;
  criticalGaps: ComplianceGapDetail[];
}

export interface ComplianceGapDetail {
  clientId: string;
  clientName: string;
  requirementId: string;
  requirementName: string;
  category: ComplianceCategory;
  severity: ComplianceSeverity;
  daysOverdue?: number;
  recommendation: string;
}

export interface ComplianceMatrixCell {
  clientId: string;
  requirementId: string;
  status: ComplianceRequirement['status'];
  dueDate?: Date;
  score: number; // 0-100
}

// ============================================
// UTILITY TYPES
// ============================================

export interface ComplianceFilters {
  jurisdictions: Jurisdiction[];
  authorities: ComplianceAuthority[];
  categories: ComplianceCategory[];
  severities: ComplianceSeverity[];
  statuses: ComplianceRequirement['status'][];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
}

export interface ComplianceDashboardMetrics {
  totalClients: number;
  compliantClients: number;
  activeAlerts: number;
  pendingReports: number;
  flaggedTransactions: number;
  crossBorderTransactions: number;
  overallComplianceScore: number;
  trendDirection: 'UP' | 'DOWN' | 'STABLE';
}

# [29] GCC Regulatory Compliance - Implementation Plan

## Project Context

**Technical Stack**: Next.js 15 (App Router), React 18, TypeScript, TailwindCSS
**Backend**: Supabase (PostgreSQL), Edge Functions
**Infrastructure**: Vercel (FE), Supabase Cloud
**Design System**: Kairos Capital Premium Wealth Aesthetic
**Target Market**: GCC (Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman)

---

## User Story

**As a** Compliance Officer,
**I want** the platform to generate reports and alerts aligned with GCC-specific regulations (SAMA, DIFC, ADGM, CMA),
**So that** the firm maintains full compliance with Middle Eastern authorities and avoids penalties.

---

## Pre-conditions

- User authenticated with Compliance Officer or Executive role
- Client transaction data available in database
- KYC/AML data captured during client onboarding
- Cross-border transaction metadata available
- Audit trail system operational
- Report generation infrastructure in place

---

## Business Requirements

| Requirement | Success Metric |
|-------------|----------------|
| Pre-built regulatory reporting templates | 100% of GCC authorities covered (SAMA, DIFC, ADGM, CMA) |
| Real-time transaction monitoring | Suspicious transactions flagged within 5 minutes |
| Cross-border transaction flagging | 100% of cross-border transactions identified and logged |
| Audit trail completeness | All regulatory reports include full audit trail |
| On-premises deployment support | Platform deployable on client infrastructure |
| Report accuracy | Zero regulatory findings in external audits |

---

## Technical Specifications

### Integration Points

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **Supabase Database** | Transaction and compliance data | PostgreSQL with audit triggers |
| **Supabase Realtime** | Live transaction monitoring | WebSocket subscriptions |
| **PDF Generation** | Regulatory report exports | Puppeteer/React-PDF |
| **Notification API** | Compliance alerts | `/api/notifications` |
| **Audit Log Service** | Compliance audit trail | Immutable append-only logs |

### GCC Regulatory Authorities

| Authority | Jurisdiction | Key Requirements |
|-----------|--------------|------------------|
| **SAMA** | Saudi Arabia | Capital adequacy, AML/CTF, Fintech sandbox compliance |
| **DIFC** | Dubai (UAE) | DFSA regulations, data protection, conduct rules |
| **ADGM** | Abu Dhabi (UAE) | FSRA regulations, market conduct, AML |
| **CMA (Saudi)** | Saudi Arabia | Capital market activities, insider trading prevention |
| **CBO** | Oman | Banking supervision, insurance regulations |
| **CBK** | Kuwait | Banking law compliance, Basel III standards |

### Security Requirements

- [x] RBAC: Only Compliance Officers and Executives access reports
- [x] Audit logging for all report generation and exports
- [x] Encryption at rest for sensitive compliance data
- [x] Air-gapped on-premises deployment option
- [x] Data residency compliance (GCC-only data storage)
- [x] Immutable audit trails (append-only, tamper-proof)

### Data Model

```typescript
// Regulatory Authority Configuration
type RegulatoryAuthority = 'SAMA' | 'DIFC' | 'ADGM' | 'CMA_SAUDI' | 'CBO' | 'CBK';

interface RegulatoryConfig {
  authority: RegulatoryAuthority;
  jurisdiction: string;
  reportingFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  mandatoryFields: string[];
  thresholds: ComplianceThresholds;
  enabled: boolean;
}

interface ComplianceThresholds {
  // AML/KYC Thresholds
  singleTransactionLimit: number;        // e.g., SAR 20,000 for SAMA
  dailyTransactionLimit: number;
  monthlyTransactionLimit: number;
  
  // Cross-border Thresholds
  crossBorderReportingThreshold: number; // e.g., USD 10,000
  
  // Suspicious Activity Indicators
  rapidTransactionCount: number;         // Number of transactions in short period
  rapidTransactionTimeframe: number;     // Timeframe in minutes
  unusualPatternDeviation: number;       // % deviation from normal behavior
}

// Transaction Monitoring
interface MonitoredTransaction {
  id: string;
  clientId: string;
  portfolioId: string;
  
  // Transaction Details
  transactionType: 'BUY' | 'SELL' | 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  currency: string;
  
  // Cross-border Identification
  isCrossBorder: boolean;
  sourceJurisdiction?: string;
  destinationJurisdiction?: string;
  
  // Compliance Status
  complianceStatus: 'COMPLIANT' | 'FLAGGED' | 'UNDER_REVIEW' | 'CLEARED' | 'ESCALATED';
  flagReasons: string[];
  
  // AML/KYC Context
  clientRiskRating: 'LOW' | 'MEDIUM' | 'HIGH';
  enhancedDueDiligence: boolean;
  politicallyExposed: boolean;
  
  // Audit Trail
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  
  // Timestamps
  transactionDate: Date;
  monitoredAt: Date;
  updatedAt: Date;
}

// Regulatory Report
interface RegulatoryReport {
  id: string;
  
  // Report Metadata
  authority: RegulatoryAuthority;
  reportType: ReportType;
  reportingPeriod: {
    startDate: Date;
    endDate: Date;
  };
  
  // Report Content
  summary: ReportSummary;
  transactions: MonitoredTransaction[];
  suspiciousActivities: SuspiciousActivity[];
  crossBorderTransactions: CrossBorderTransaction[];
  
  // Submission
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'SUBMITTED' | 'ACKNOWLEDGED';
  generatedBy: string;
  generatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  submittedAt?: Date;
  
  // Export
  exportFormat: 'PDF' | 'EXCEL' | 'XML' | 'JSON';
  exportUrl?: string;
  
  // Audit
  auditTrailId: string;
}

type ReportType = 
  | 'AML_MONITORING'           // Anti-Money Laundering
  | 'CTF_MONITORING'           // Counter-Terrorism Financing
  | 'SUSPICIOUS_ACTIVITY'      // SAR - Suspicious Activity Report
  | 'CROSS_BORDER'             // Cross-border transaction report
  | 'LARGE_TRANSACTION'        // Large cash transaction report
  | 'CLIENT_DUE_DILIGENCE'     // CDD/EDD reports
  | 'CAPITAL_ADEQUACY'         // Capital requirements report
  | 'MARKET_CONDUCT'           // Trading conduct report
  | 'CUSTOM';                  // Authority-specific reports

interface ReportSummary {
  totalTransactions: number;
  totalVolume: number;
  flaggedTransactions: number;
  suspiciousActivities: number;
  crossBorderCount: number;
  highRiskClients: number;
  pepClients: number;                    // Politically Exposed Persons
}

// Suspicious Activity
interface SuspiciousActivity {
  id: string;
  transactionIds: string[];
  clientId: string;
  
  // Alert Details
  alertType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  indicators: string[];
  
  // Investigation
  investigationStatus: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED';
  assignedTo?: string;
  findings?: string;
  actionTaken?: string;
  
  // Timeline
  detectedAt: Date;
  investigatedAt?: Date;
  resolvedAt?: Date;
}

// Cross-border Transaction
interface CrossBorderTransaction {
  transactionId: string;
  
  // Parties
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
  
  // Transaction
  amount: number;
  currency: string;
  purpose: string;
  supportingDocuments: string[];
  
  // Compliance
  requiredDisclosures: string[];
  disclosuresMet: boolean;
  approvalRequired: boolean;
  approvedBy?: string;
  
  // Timestamps
  transactionDate: Date;
  reportedAt: Date;
}

// Compliance Alert
interface ComplianceAlert {
  id: string;
  
  // Alert Details
  alertType: 'THRESHOLD_EXCEEDED' | 'SUSPICIOUS_PATTERN' | 'CROSS_BORDER_FLAGGED' | 'MISSING_DOCUMENTATION' | 'REGULATORY_DEADLINE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  
  // Context
  relatedEntityType: 'TRANSACTION' | 'CLIENT' | 'PORTFOLIO' | 'REPORT';
  relatedEntityId: string;
  authority?: RegulatoryAuthority;
  
  // Status
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'FALSE_POSITIVE';
  assignedTo?: string;
  
  // Resolution
  resolutionNotes?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  
  // Timestamps
  triggeredAt: Date;
  acknowledgedAt?: Date;
  dueDate?: Date;
}
```

---

## Design Specifications

### Visual Layout & Components

```
[Compliance Dashboard]
├── Header: "GCC Regulatory Compliance"
├── Authority Selector (SAMA, DIFC, ADGM, CMA tabs)
├── Metrics Grid
│   ├── Active Alerts Count
│   ├── Pending Reports Count
│   ├── Flagged Transactions (Today)
│   └── Cross-border Transactions (This Month)
├── Quick Actions
│   ├── Generate Report
│   ├── View Alerts
│   └── Monitor Live Transactions
└── Recent Activity Timeline

[Report Generation Page]
├── Report Configuration Form
│   ├── Authority Selection
│   ├── Report Type Selection
│   ├── Date Range Picker
│   └── Export Format Selection
├── Preview Panel (if draft exists)
├── Action Buttons
│   ├── Generate Draft
│   ├── Review & Approve
│   ├── Export
│   └── Submit to Authority
└── Audit Trail Viewer

[Transaction Monitoring Page]
├── Real-time Transaction Stream (Live updates)
├── Filter Bar
│   ├── Risk Level Filter
│   ├── Transaction Type Filter
│   ├── Cross-border Toggle
│   └── Date Range
├── Transaction Table
│   ├── Transaction ID
│   ├── Client Name
│   ├── Amount & Currency
│   ├── Risk Indicators
│   ├── Compliance Status Badge
│   └── Action Menu (Flag, Review, Clear)
└── Flagged Transactions Summary

[Alerts & Notifications Page]
├── Alert Priority Tabs (Critical, High, Medium, Low)
├── Alert Cards
│   ├── Alert Icon & Type
│   ├── Title & Description
│   ├── Related Entity Link
│   ├── Due Date
│   ├── Assignment Status
│   └── Action Buttons (Acknowledge, Investigate, Resolve)
└── Alert History Log

[Report Templates Library]
├── Template Cards by Authority
│   ├── SAMA Templates
│   │   ├── AML Monitoring Report
│   │   ├── Large Transaction Report
│   │   └── Suspicious Activity Report (SAR)
│   ├── DIFC Templates
│   │   ├── DFSA Client Money Report
│   │   ├── Market Conduct Report
│   │   └── AML/CTF Annual Return
│   ├── ADGM Templates
│   │   ├── FSRA Regulatory Return
│   │   ├── Client Asset Report
│   │   └── Compliance Monitoring Report
│   └── CMA Templates
│       ├── Capital Market Activity Report
│       ├── Insider Trading Prevention Report
│       └── Disclosure Report
```

### Component Hierarchy

```tsx
<ComplianceDashboardLayout>
  <Header>
    <PageTitle>GCC Regulatory Compliance</PageTitle>
    <AuthoritySelector />                           {/* Client Component */}
  </Header>
  
  {/* Dashboard Overview */}
  <ComplianceDashboard>
    <ComplianceMetricsGrid />                       {/* Server Component */}
    <ComplianceAlertsWidget />                      {/* Client Component - Real-time */}
    <RecentActivityTimeline />                      {/* Server Component */}
  </ComplianceDashboard>
  
  {/* Report Generation */}
  <ReportGenerationPage>
    <ReportConfigForm />                            {/* Client Component */}
    <ReportPreviewPanel />                          {/* Client Component */}
    <ReportAuditTrail />                            {/* Server Component */}
  </ReportGenerationPage>
  
  {/* Transaction Monitoring */}
  <TransactionMonitoringPage>
    <LiveTransactionStream />                       {/* Client Component - WebSocket */}
    <TransactionFilterBar />                        {/* Client Component */}
    <MonitoredTransactionsTable />                  {/* Client Component - Paginated */}
  </TransactionMonitoringPage>
  
  {/* Alerts Management */}
  <ComplianceAlertsPage>
    <AlertPriorityTabs />                           {/* Client Component */}
    <AlertCardList />                               {/* Client Component */}
    <AlertDetailPanel />                            {/* Client Component */}
  </ComplianceAlertsPage>
  
  {/* Report Templates */}
  <ReportTemplatesLibrary>
    <TemplateCardGrid />                            {/* Server Component */}
    <TemplatePreview />                             {/* Client Component */}
  </ReportTemplatesLibrary>
</ComplianceDashboardLayout>
```

### Design System Compliance (Kairos Capital + GCC Regulatory)

```css
/* Compliance-Specific Colors */
--compliance-critical: #DC3545;       /* Red - Critical alerts */
--compliance-high: #FF6600;           /* Orange - High priority */
--compliance-medium: #FFB74D;         /* Amber - Medium priority */
--compliance-low: #64748b;            /* Gray - Low priority */
--compliance-compliant: #28A745;      /* Green - Compliant status */
--compliance-flagged: #FF9500;        /* Orange - Flagged */
--compliance-pending: #6366F1;        /* Indigo - Pending review */

/* Authority Brand Colors (Subtle accents) */
--authority-sama: #006C35;            /* Saudi green */
--authority-difc: #0066B2;            /* DIFC blue */
--authority-adgm: #1B365D;            /* ADGM navy */
--authority-cma: #00703C;             /* CMA green */

/* Alert Severity Badges */
.alert-critical {
  background: #FEE2E2;
  color: #991B1B;
  border: 1px solid #DC3545;
}

.alert-high {
  background: #FED7AA;
  color: #9A3412;
  border: 1px solid #FF6600;
}

.alert-medium {
  background: #FEF3C7;
  color: #92400E;
  border: 1px solid #FFB74D;
}

/* Compliance Status Badges */
.status-compliant {
  background: #D4EDDA;
  color: #155724;
  border: 1px solid #28A745;
}

.status-flagged {
  background: #FFF3CD;
  color: #856404;
  border: 1px solid #FFB74D;
}

.status-under-review {
  background: #E0E7FF;
  color: #3730A3;
  border: 1px solid #6366F1;
}

/* Live Transaction Monitoring Indicator */
.live-indicator {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Responsive Behavior

| Breakpoint | Layout Changes |
|------------|----------------|
| Mobile (< 768px) | Single column, collapsed filters, simplified table |
| Tablet (768px - 1023px) | Two-column metrics, expandable filters |
| Desktop (1024px+) | Full grid layout, expanded filters, split-screen report preview |

---

## Technical Architecture

### Component Structure

```
app/
├── (dashboard)/
│   └── compliance/
│       ├── page.tsx                              # Dashboard overview
│       ├── reports/
│       │   ├── page.tsx                          # Report list
│       │   ├── generate/page.tsx                 # Report generation
│       │   └── [reportId]/page.tsx               # Report detail
│       ├── monitoring/
│       │   └── page.tsx                          # Live transaction monitoring
│       ├── alerts/
│       │   ├── page.tsx                          # Alerts list
│       │   └── [alertId]/page.tsx                # Alert detail
│       └── templates/
│           └── page.tsx                          # Report templates library
├── components/
│   └── features/
│       └── compliance/
│           ├── ComplianceMetricsGrid.tsx
│           ├── ComplianceAlertsWidget.tsx
│           ├── ReportConfigForm.tsx
│           ├── ReportPreviewPanel.tsx
│           ├── LiveTransactionStream.tsx
│           ├── MonitoredTransactionsTable.tsx
│           ├── TransactionFilterBar.tsx
│           ├── AlertCard.tsx
│           ├── AlertDetailPanel.tsx
│           ├── ReportTemplateCard.tsx
│           ├── AuthoritySelector.tsx
│           ├── ComplianceStatusBadge.tsx
│           └── AuditTrailViewer.tsx
├── api/
│   └── compliance/
│       ├── reports/
│       │   ├── route.ts                          # GET/POST: List/create reports
│       │   ├── [reportId]/
│       │   │   ├── route.ts                      # GET/PUT: Report detail
│       │   │   ├── export/route.ts               # POST: Export report
│       │   │   └── submit/route.ts               # POST: Submit to authority
│       │   └── generate/route.ts                 # POST: Generate report
│       ├── monitoring/
│       │   ├── route.ts                          # GET: List monitored transactions
│       │   ├── flag/route.ts                     # POST: Flag transaction
│       │   └── clear/route.ts                    # POST: Clear transaction
│       ├── alerts/
│       │   ├── route.ts                          # GET: List alerts
│       │   ├── [alertId]/
│       │   │   ├── route.ts                      # GET/PUT: Alert detail
│       │   │   ├── acknowledge/route.ts          # POST: Acknowledge alert
│       │   │   └── resolve/route.ts              # POST: Resolve alert
│       │   └── stats/route.ts                    # GET: Alert statistics
│       ├── templates/
│       │   └── route.ts                          # GET: List templates
│       └── thresholds/
│           └── route.ts                          # GET/PUT: Compliance thresholds
├── hooks/
│   ├── useComplianceReports.ts
│   ├── useTransactionMonitoring.ts
│   ├── useComplianceAlerts.ts
│   ├── useReportGeneration.ts
│   └── useLiveTransactions.ts                    # WebSocket hook
```

### State Management Architecture

```typescript
// Global Compliance Store (Zustand)
interface ComplianceStore {
  // Selected Authority
  selectedAuthority: RegulatoryAuthority | null;
  setSelectedAuthority: (authority: RegulatoryAuthority) => void;
  
  // Alert State
  activeAlerts: ComplianceAlert[];
  alertCount: number;
  refreshAlerts: () => Promise<void>;
  
  // Live Monitoring
  isMonitoringEnabled: boolean;
  toggleMonitoring: () => void;
  
  // Filters
  filters: {
    dateRange: [Date, Date];
    riskLevel: string[];
    complianceStatus: string[];
    transactionType: string[];
  };
  updateFilters: (filters: Partial<ComplianceStore['filters']>) => void;
}

// Report Generation Hook
function useReportGeneration() {
  const [config, setConfig] = useState<ReportConfig | null>(null);
  const [preview, setPreview] = useState<ReportPreview | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateReport = async (config: ReportConfig) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/compliance/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await response.json();
      setPreview(data.preview);
      return data;
    } finally {
      setIsGenerating(false);
    }
  };
  
  return { config, setConfig, preview, generateReport, isGenerating };
}

// Live Transaction Monitoring Hook (WebSocket)
function useLiveTransactions() {
  const [transactions, setTransactions] = useState<MonitoredTransaction[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/compliance/monitor`);
    
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    
    ws.onmessage = (event) => {
      const transaction = JSON.parse(event.data);
      setTransactions((prev) => [transaction, ...prev].slice(0, 100)); // Keep last 100
    };
    
    return () => ws.close();
  }, []);
  
  return { transactions, isConnected };
}
```

### API Schema

```typescript
// GET /api/compliance/reports?authority=SAMA&status=DRAFT
interface GetReportsRequest {
  authority?: RegulatoryAuthority;
  status?: RegulatoryReport['status'];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

interface GetReportsResponse {
  success: boolean;
  data: RegulatoryReport[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// POST /api/compliance/reports/generate
interface GenerateReportRequest {
  authority: RegulatoryAuthority;
  reportType: ReportType;
  reportingPeriod: {
    startDate: string;
    endDate: string;
  };
  includeAuditTrail: boolean;
}

interface GenerateReportResponse {
  success: boolean;
  data: {
    reportId: string;
    preview: ReportPreview;
    estimatedCompletionTime: number; // seconds
  };
}

// POST /api/compliance/reports/[reportId]/export
interface ExportReportRequest {
  format: 'PDF' | 'EXCEL' | 'XML' | 'JSON';
}

interface ExportReportResponse {
  success: boolean;
  data: {
    exportUrl: string;
    expiresAt: string;
  };
}

// GET /api/compliance/monitoring?riskLevel=HIGH&flagged=true
interface GetMonitoredTransactionsRequest {
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  complianceStatus?: MonitoredTransaction['complianceStatus'];
  flagged?: boolean;
  crossBorder?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

interface GetMonitoredTransactionsResponse {
  success: boolean;
  data: MonitoredTransaction[];
  summary: {
    total: number;
    flagged: number;
    crossBorder: number;
    averageRisk: number;
  };
  pagination: PaginationMeta;
}

// POST /api/compliance/monitoring/flag
interface FlagTransactionRequest {
  transactionId: string;
  reasons: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  notes?: string;
}

// GET /api/compliance/alerts?severity=CRITICAL&status=ACTIVE
interface GetAlertsRequest {
  severity?: ComplianceAlert['severity'];
  status?: ComplianceAlert['status'];
  authority?: RegulatoryAuthority;
  page?: number;
  limit?: number;
}

interface GetAlertsResponse {
  success: boolean;
  data: ComplianceAlert[];
  stats: {
    total: number;
    critical: number;
    high: number;
    overdue: number;
  };
  pagination: PaginationMeta;
}

// POST /api/compliance/alerts/[alertId]/resolve
interface ResolveAlertRequest {
  resolution: 'RESOLVED' | 'FALSE_POSITIVE';
  notes: string;
  actionTaken?: string;
}
```

### Database Schema

```sql
-- Regulatory configuration
CREATE TABLE regulatory_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  authority VARCHAR(20) NOT NULL UNIQUE,
  jurisdiction VARCHAR(100) NOT NULL,
  reporting_frequency VARCHAR(20) NOT NULL,
  mandatory_fields JSONB NOT NULL DEFAULT '[]',
  thresholds JSONB NOT NULL,
  enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monitored transactions
CREATE TABLE monitored_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id),
  portfolio_id UUID NOT NULL,
  
  -- Transaction details
  transaction_type VARCHAR(20) NOT NULL,
  amount DECIMAL(20, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  
  -- Cross-border
  is_cross_border BOOLEAN DEFAULT false,
  source_jurisdiction VARCHAR(100),
  destination_jurisdiction VARCHAR(100),
  
  -- Compliance
  compliance_status VARCHAR(20) NOT NULL DEFAULT 'COMPLIANT',
  flag_reasons TEXT[],
  client_risk_rating VARCHAR(10),
  enhanced_due_diligence BOOLEAN DEFAULT false,
  politically_exposed BOOLEAN DEFAULT false,
  
  -- Review
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  
  -- Timestamps
  transaction_date TIMESTAMPTZ NOT NULL,
  monitored_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_monitored_txn_client (client_id),
  INDEX idx_monitored_txn_status (compliance_status),
  INDEX idx_monitored_txn_date (transaction_date DESC),
  INDEX idx_monitored_txn_cross_border (is_cross_border) WHERE is_cross_border = true
);

-- Regulatory reports
CREATE TABLE regulatory_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Metadata
  authority VARCHAR(20) NOT NULL,
  report_type VARCHAR(30) NOT NULL,
  reporting_period_start DATE NOT NULL,
  reporting_period_end DATE NOT NULL,
  
  -- Content (stored as JSONB for flexibility)
  summary JSONB NOT NULL,
  transactions JSONB NOT NULL DEFAULT '[]',
  suspicious_activities JSONB NOT NULL DEFAULT '[]',
  cross_border_transactions JSONB NOT NULL DEFAULT '[]',
  
  -- Submission
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  generated_by UUID NOT NULL REFERENCES users(id),
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  
  -- Export
  export_format VARCHAR(10),
  export_url TEXT,
  
  -- Audit
  audit_trail_id UUID,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_reports_authority (authority),
  INDEX idx_reports_status (status),
  INDEX idx_reports_period (reporting_period_start, reporting_period_end),
  INDEX idx_reports_generated (generated_at DESC)
);

-- Suspicious activities
CREATE TABLE suspicious_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id),
  
  -- Alert
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(10) NOT NULL,
  description TEXT NOT NULL,
  indicators TEXT[],
  
  -- Related transactions
  transaction_ids UUID[],
  
  -- Investigation
  investigation_status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
  assigned_to UUID REFERENCES users(id),
  findings TEXT,
  action_taken TEXT,
  
  -- Timeline
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  investigated_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  
  -- Indexes
  INDEX idx_suspicious_client (client_id),
  INDEX idx_suspicious_status (investigation_status),
  INDEX idx_suspicious_severity (severity),
  INDEX idx_suspicious_detected (detected_at DESC)
);

-- Compliance alerts
CREATE TABLE compliance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Alert details
  alert_type VARCHAR(30) NOT NULL,
  severity VARCHAR(10) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  
  -- Context
  related_entity_type VARCHAR(20) NOT NULL,
  related_entity_id UUID NOT NULL,
  authority VARCHAR(20),
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  assigned_to UUID REFERENCES users(id),
  
  -- Resolution
  resolution_notes TEXT,
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  
  -- Timeline
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  
  -- Indexes
  INDEX idx_alerts_status (status),
  INDEX idx_alerts_severity (severity),
  INDEX idx_alerts_triggered (triggered_at DESC),
  INDEX idx_alerts_due (due_date) WHERE status = 'ACTIVE'
);

-- Report templates
CREATE TABLE report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  authority VARCHAR(20) NOT NULL,
  report_type VARCHAR(30) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_structure JSONB NOT NULL,
  required_fields JSONB NOT NULL DEFAULT '[]',
  version VARCHAR(10) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(authority, report_type, version)
);

-- Audit trail (immutable, append-only)
CREATE TABLE compliance_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Action
  action_type VARCHAR(50) NOT NULL,
  entity_type VARCHAR(20) NOT NULL,
  entity_id UUID NOT NULL,
  
  -- User context
  performed_by UUID NOT NULL REFERENCES users(id),
  ip_address INET,
  user_agent TEXT,
  
  -- Changes
  previous_state JSONB,
  new_state JSONB,
  metadata JSONB,
  
  -- Timestamp (immutable)
  performed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- No updates or deletes allowed
  INDEX idx_audit_entity (entity_type, entity_id),
  INDEX idx_audit_user (performed_by),
  INDEX idx_audit_time (performed_at DESC)
);

-- Prevent updates/deletes on audit trail
CREATE RULE no_update_audit_trail AS ON UPDATE TO compliance_audit_trail DO INSTEAD NOTHING;
CREATE RULE no_delete_audit_trail AS ON DELETE TO compliance_audit_trail DO INSTEAD NOTHING;

-- Real-time monitoring function (triggered on transaction insert/update)
CREATE OR REPLACE FUNCTION check_transaction_compliance()
RETURNS TRIGGER AS $$
DECLARE
  config RECORD;
  alert_needed BOOLEAN := false;
  alert_reasons TEXT[];
BEGIN
  -- Get regulatory config
  SELECT * INTO config FROM regulatory_configs WHERE enabled = true LIMIT 1;
  
  -- Check thresholds
  IF NEW.amount > (config.thresholds->>'singleTransactionLimit')::DECIMAL THEN
    alert_needed := true;
    alert_reasons := array_append(alert_reasons, 'Single transaction limit exceeded');
  END IF;
  
  IF NEW.is_cross_border = true THEN
    alert_needed := true;
    alert_reasons := array_append(alert_reasons, 'Cross-border transaction detected');
  END IF;
  
  IF NEW.client_risk_rating = 'HIGH' THEN
    alert_needed := true;
    alert_reasons := array_append(alert_reasons, 'High-risk client transaction');
  END IF;
  
  -- Create alert if needed
  IF alert_needed THEN
    INSERT INTO compliance_alerts (
      alert_type,
      severity,
      title,
      description,
      related_entity_type,
      related_entity_id,
      status
    ) VALUES (
      'THRESHOLD_EXCEEDED',
      CASE WHEN NEW.client_risk_rating = 'HIGH' THEN 'CRITICAL' ELSE 'HIGH' END,
      'Transaction Requires Review',
      array_to_string(alert_reasons, '; '),
      'TRANSACTION',
      NEW.id,
      'ACTIVE'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_transaction_compliance
AFTER INSERT OR UPDATE ON monitored_transactions
FOR EACH ROW
EXECUTE FUNCTION check_transaction_compliance();
```

---

## Implementation Requirements

### Core Components

| Component | Type | Purpose |
|-----------|------|---------|
| `ComplianceMetricsGrid.tsx` | Server | Dashboard metrics display |
| `ComplianceAlertsWidget.tsx` | Client | Real-time alerts widget |
| `ReportConfigForm.tsx` | Client | Report generation configuration |
| `ReportPreviewPanel.tsx` | Client | Report preview before export |
| `LiveTransactionStream.tsx` | Client | Real-time transaction monitoring (WebSocket) |
| `MonitoredTransactionsTable.tsx` | Client | Paginated transaction table |
| `TransactionFilterBar.tsx` | Client | Advanced filtering interface |
| `AlertCard.tsx` | Client | Individual alert card |
| `AlertDetailPanel.tsx` | Client | Detailed alert view |
| `ReportTemplateCard.tsx` | Server | Template card display |
| `AuthoritySelector.tsx` | Client | Regulatory authority selector |
| `ComplianceStatusBadge.tsx` | Server | Status badge component |
| `AuditTrailViewer.tsx` | Server | Audit trail display |

### Custom Hooks

| Hook | Purpose |
|------|---------|
| `useComplianceReports()` | Fetch and manage reports |
| `useTransactionMonitoring()` | Monitor transactions with filters |
| `useComplianceAlerts()` | Manage compliance alerts |
| `useReportGeneration()` | Generate and preview reports |
| `useLiveTransactions()` | WebSocket connection for real-time monitoring |
| `useAuditTrail()` | Fetch audit trail for entities |

### Utility Functions

| Function | Location | Purpose |
|----------|----------|---------|
| `generateReportPDF()` | `lib/utils/report-generator.ts` | Generate PDF reports |
| `exportToExcel()` | `lib/utils/report-exporter.ts` | Export to Excel format |
| `calculateComplianceScore()` | `lib/utils/compliance-calculator.ts` | Calculate compliance metrics |
| `detectSuspiciousPattern()` | `lib/utils/pattern-detection.ts` | ML-based pattern detection |
| `formatRegulatoryData()` | `lib/utils/data-formatter.ts` | Format data per authority requirements |
| `validateReportCompleteness()` | `lib/validators/report-validator.ts` | Validate report before submission |

---

## Acceptance Criteria

### Functional Requirements

| ID | Criterion | Status |
|----|-----------|--------|
| 29.1 | Pre-built templates for SAMA, DIFC, ADGM, CMA | ⬜ |
| 29.2 | Real-time transaction monitoring with WebSocket | ⬜ |
| 29.3 | Automatic flagging based on AML/KYC thresholds | ⬜ |
| 29.4 | Cross-border transaction identification (100%) | ⬜ |
| 29.5 | Alert generation within 5 minutes of threshold breach | ⬜ |
| 29.6 | Report generation and export in multiple formats | ⬜ |
| 29.7 | Immutable audit trail for all compliance actions | ⬜ |
| 29.8 | On-premises deployment compatibility | ⬜ |

### Non-Functional Requirements

| Requirement | Target | Status |
|-------------|--------|--------|
| Real-time monitoring latency | < 5 seconds | ⬜ |
| Report generation time | < 30 seconds (standard reports) | ⬜ |
| Alert notification delivery | < 1 minute | ⬜ |
| System uptime | 99.9% | ⬜ |
| Data retention | 7 years (regulatory requirement) | ⬜ |
| WCAG 2.1 AA | Full compliance | ⬜ |
| Data encryption | At rest and in transit | ⬜ |

---

## Modified Files

```
app/
├── (dashboard)/
│   └── compliance/
│       ├── page.tsx ⬜
│       ├── layout.tsx ⬜
│       ├── reports/
│       │   ├── page.tsx ⬜
│       │   ├── generate/page.tsx ⬜
│       │   └── [reportId]/page.tsx ⬜
│       ├── monitoring/
│       │   └── page.tsx ⬜
│       ├── alerts/
│       │   ├── page.tsx ⬜
│       │   └── [alertId]/page.tsx ⬜
│       └── templates/
│           └── page.tsx ⬜
├── components/
│   └── features/
│       └── compliance/
│           ├── ComplianceMetricsGrid.tsx ⬜
│           ├── ComplianceAlertsWidget.tsx ⬜
│           ├── ReportConfigForm.tsx ⬜
│           ├── ReportPreviewPanel.tsx ⬜
│           ├── LiveTransactionStream.tsx ⬜
│           ├── MonitoredTransactionsTable.tsx ⬜
│           ├── TransactionFilterBar.tsx ⬜
│           ├── AlertCard.tsx ⬜
│           ├── AlertDetailPanel.tsx ⬜
│           ├── ReportTemplateCard.tsx ⬜
│           ├── AuthoritySelector.tsx ⬜
│           ├── ComplianceStatusBadge.tsx ⬜
│           └── AuditTrailViewer.tsx ⬜
├── api/
│   └── compliance/
│       ├── reports/
│       │   ├── route.ts ⬜
│       │   ├── [reportId]/
│       │   │   ├── route.ts ⬜
│       │   │   ├── export/route.ts ⬜
│       │   │   └── submit/route.ts ⬜
│       │   └── generate/route.ts ⬜
│       ├── monitoring/
│       │   ├── route.ts ⬜
│       │   ├── flag/route.ts ⬜
│       │   └── clear/route.ts ⬜
│       ├── alerts/
│       │   ├── route.ts ⬜
│       │   ├── [alertId]/
│       │   │   ├── route.ts ⬜
│       │   │   ├── acknowledge/route.ts ⬜
│       │   │   └── resolve/route.ts ⬜
│       │   └── stats/route.ts ⬜
│       ├── templates/
│       │   └── route.ts ⬜
│       └── thresholds/
│           └── route.ts ⬜

hooks/
├── useComplianceReports.ts ⬜
├── useTransactionMonitoring.ts ⬜
├── useComplianceAlerts.ts ⬜
├── useReportGeneration.ts ⬜
└── useLiveTransactions.ts ⬜

lib/
├── utils/
│   ├── report-generator.ts ⬜
│   ├── report-exporter.ts ⬜
│   ├── compliance-calculator.ts ⬜
│   ├── pattern-detection.ts ⬜
│   └── data-formatter.ts ⬜
└── validators/
    └── report-validator.ts ⬜

types/
└── compliance.types.ts ⬜

store/
└── compliance-store.ts ⬜

backend/
└── database/
    └── migrations/
        └── 0008_add_gcc_compliance.sql ⬜
```

---

## Implementation Status

**OVERALL STATUS**: ⬜ NOT STARTED

### Phase 1: Foundation & Data Model ⬜

- [ ] Database migration for compliance tables
- [ ] Type definitions in `types/compliance.types.ts`
- [ ] Compliance store with Zustand
- [ ] Utility functions for calculations

### Phase 2: Report Templates & Generation ⬜

- [ ] Seed report templates for all authorities
- [ ] Report template cards and library page
- [ ] Report configuration form
- [ ] Report generation API and preview logic

### Phase 3: Transaction Monitoring ⬜

- [ ] Real-time monitoring database trigger
- [ ] WebSocket server for live transactions
- [ ] Live transaction stream component
- [ ] Transaction filtering and flagging

### Phase 4: Alerts & Notifications ⬜

- [ ] Alert generation logic
- [ ] Alert cards and detail panels
- [ ] Alert acknowledgment and resolution flow
- [ ] Alert statistics and metrics

### Phase 5: Export & Submission ⬜

- [ ] PDF generation (Puppeteer/React-PDF)
- [ ] Excel export functionality
- [ ] XML/JSON export formats
- [ ] Submission workflow to authorities

### Phase 6: Audit Trail & Compliance ⬜

- [ ] Immutable audit trail implementation
- [ ] Audit trail viewer component
- [ ] Data retention policies
- [ ] On-premises deployment configuration

### Phase 7: Polish & Testing ⬜

- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

---

## Dependencies

### Internal Dependencies

| Dependency | Purpose | Status |
|------------|---------|--------|
| Client/Transaction data | Monitoring source data | ✅ Available |
| KYC/AML data | Risk assessment | ✅ Available |
| User roles (Compliance Officer) | Access control | ✅ Available |
| Notification system | Alert delivery | ✅ Available |
| Audit logging infrastructure | Compliance trails | ⚠️ Needs enhancement |

### External Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `puppeteer` | ^21.x | PDF generation |
| `@react-pdf/renderer` | ^3.x | React-based PDF rendering |
| `exceljs` | ^4.x | Excel export |
| `ws` | ^8.x | WebSocket server |
| `xml2js` | ^0.6.x | XML export/import |

---

## Risk Assessment

### Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Real-time monitoring scalability | High | Medium | Load balancing, message queues |
| Report generation timeout | Medium | Medium | Async processing, background jobs |
| WebSocket connection stability | Medium | Low | Reconnection logic, fallback to polling |
| PDF generation performance | Medium | Medium | Caching, CDN for static templates |

### Business Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Regulatory requirements change | Critical | Medium | Flexible template system, version control |
| False positive alerts | Medium | High | Tunable thresholds, ML-based refinement |
| Audit trail tampering | Critical | Low | Immutable database design, blockchain option |

### Compliance Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Missed suspicious activity | Critical | Low | Multiple detection layers, manual review |
| Incomplete audit trail | Critical | Low | Database constraints, automated testing |
| Data residency violations | Critical | Low | GCC-only deployment, geo-fencing |

---

## Testing Strategy

### Unit Tests (Jest)

```typescript
describe('Compliance Utilities', () => {
  describe('calculateComplianceScore', () => {
    it('returns 100 for fully compliant client', () => {
      const score = calculateComplianceScore(fullyCompliantClient);
      expect(score).toBe(100);
    });
    
    it('returns lower score for flagged transactions', () => {
      const score = calculateComplianceScore(clientWithFlaggedTxns);
      expect(score).toBeLessThan(100);
    });
  });
  
  describe('detectSuspiciousPattern', () => {
    it('flags rapid transaction pattern', () => {
      const result = detectSuspiciousPattern(rapidTransactions);
      expect(result.isSuspicious).toBe(true);
      expect(result.indicators).toContain('rapid_transactions');
    });
    
    it('flags unusual amount pattern', () => {
      const result = detectSuspiciousPattern(unusualAmounts);
      expect(result.isSuspicious).toBe(true);
    });
  });
});

describe('ReportConfigForm', () => {
  it('renders authority selection', () => {
    render(<ReportConfigForm />);
    expect(screen.getByText('SAMA')).toBeInTheDocument();
    expect(screen.getByText('DIFC')).toBeInTheDocument();
  });
  
  it('validates required fields', async () => {
    render(<ReportConfigForm />);
    await userEvent.click(screen.getByText('Generate'));
    expect(screen.getByText('Report type is required')).toBeVisible();
  });
  
  it('generates report on valid submission', async () => {
    const onGenerate = jest.fn();
    render(<ReportConfigForm onGenerate={onGenerate} />);
    
    await userEvent.selectOptions(screen.getByLabelText('Authority'), 'SAMA');
    await userEvent.selectOptions(screen.getByLabelText('Report Type'), 'AML_MONITORING');
    await userEvent.click(screen.getByText('Generate'));
    
    expect(onGenerate).toHaveBeenCalled();
  });
});
```

### Integration Tests (React Testing Library)

```typescript
describe('Transaction Monitoring Integration', () => {
  it('displays live transactions via WebSocket', async () => {
    const mockWs = createMockWebSocket();
    render(<LiveTransactionStream />);
    
    // Simulate incoming transaction
    mockWs.sendMessage({
      id: '123',
      amount: 50000,
      complianceStatus: 'FLAGGED',
    });
    
    await waitFor(() => {
      expect(screen.getByText('50000')).toBeVisible();
      expect(screen.getByText('FLAGGED')).toBeVisible();
    });
  });
  
  it('allows flagging transaction', async () => {
    render(<MonitoredTransactionsTable transactions={mockTransactions} />);
    
    await userEvent.click(screen.getAllByText('Flag')[0]);
    await userEvent.type(screen.getByLabelText('Reason'), 'Suspicious pattern');
    await userEvent.click(screen.getByText('Submit'));
    
    expect(await screen.findByText('Transaction flagged')).toBeVisible();
  });
});

describe('Report Generation Flow', () => {
  it('generates and exports report', async () => {
    render(<ReportGenerationPage />);
    
    // Configure report
    await userEvent.selectOptions(screen.getByLabelText('Authority'), 'SAMA');
    await userEvent.selectOptions(screen.getByLabelText('Report Type'), 'AML_MONITORING');
    await userEvent.click(screen.getByText('Last Month'));
    
    // Generate
    await userEvent.click(screen.getByText('Generate Report'));
    
    // Wait for preview
    await waitFor(() => {
      expect(screen.getByText('Report Preview')).toBeVisible();
    });
    
    // Export
    await userEvent.selectOptions(screen.getByLabelText('Format'), 'PDF');
    await userEvent.click(screen.getByText('Export'));
    
    expect(await screen.findByText('Report exported successfully')).toBeVisible();
  });
});
```

### E2E Tests (Playwright)

```typescript
test.describe('GCC Regulatory Compliance', () => {
  test('compliance officer monitors live transactions', async ({ page }) => {
    await page.goto('/compliance/monitoring');
    
    // Verify live indicator
    await expect(page.locator('[data-testid="live-indicator"]')).toBeVisible();
    
    // Wait for transaction to appear
    await expect(page.locator('[data-testid="transaction-row"]').first()).toBeVisible({ timeout: 10000 });
    
    // Flag transaction
    await page.locator('[data-testid="flag-button"]').first().click();
    await page.fill('[data-testid="flag-reason"]', 'Exceeds daily limit');
    await page.selectOption('[data-testid="severity"]', 'HIGH');
    await page.click('text=Submit Flag');
    
    // Verify alert created
    await page.goto('/compliance/alerts');
    await expect(page.locator('text=Exceeds daily limit')).toBeVisible();
  });
  
  test('generate SAMA AML report', async ({ page }) => {
    await page.goto('/compliance/reports/generate');
    
    // Configure report
    await page.selectOption('[data-testid="authority-select"]', 'SAMA');
    await page.selectOption('[data-testid="report-type"]', 'AML_MONITORING');
    await page.click('text=Last Quarter');
    
    // Generate
    await page.click('text=Generate Report');
    
    // Wait for generation
    await expect(page.locator('text=Report Preview')).toBeVisible({ timeout: 30000 });
    
    // Verify content
    await expect(page.locator('text=Summary')).toBeVisible();
    await expect(page.locator('text=Flagged Transactions')).toBeVisible();
    
    // Export as PDF
    await page.selectOption('[data-testid="export-format"]', 'PDF');
    await page.click('text=Export');
    
    // Verify download
    const download = await page.waitForEvent('download');
    expect(download.suggestedFilename()).toContain('SAMA_AML_Monitoring');
  });
  
  test('resolve compliance alert', async ({ page }) => {
    await page.goto('/compliance/alerts');
    
    // Filter by critical
    await page.click('text=Critical');
    
    // Open alert
    await page.locator('[data-testid="alert-card"]').first().click();
    
    // Review details
    await expect(page.locator('[data-testid="alert-description"]')).toBeVisible();
    
    // Acknowledge
    await page.click('text=Acknowledge');
    await expect(page.locator('text=Acknowledged')).toBeVisible();
    
    // Resolve
    await page.fill('[data-testid="resolution-notes"]', 'Verified with client, transaction legitimate');
    await page.selectOption('[data-testid="resolution-type"]', 'RESOLVED');
    await page.click('text=Resolve Alert');
    
    // Verify resolved
    await expect(page.locator('text=Alert resolved successfully')).toBeVisible();
  });
});
```

---

## Performance Considerations

### Real-Time Monitoring

- WebSocket connection pooling
- Message batching (buffer 100ms)
- Client-side transaction deduplication
- Graceful degradation to polling if WebSocket fails

### Report Generation

- Async processing with BullMQ job queue
- Caching of template structures
- Incremental rendering for large reports
- CDN caching for exported reports

### Database Optimization

- Partitioning monitored_transactions by month
- Materialized views for compliance metrics
- Indexes on all filter columns
- Read replicas for reporting queries

### Caching Strategy

- Regulatory configs cached (1 hour TTL)
- Report templates cached indefinitely
- Alert counts cached (5 minutes TTL)
- Compliance thresholds cached (1 hour TTL)

---

## Deployment Plan

### Development Phase

- [ ] Feature branch: `feature/29-gcc-regulatory-compliance`
- [ ] Database migration applied to dev
- [ ] Seed report templates and test data
- [ ] WebSocket server configured

### Staging Phase

- [ ] Migration applied to staging
- [ ] UAT with compliance team
- [ ] Performance testing (load testing WebSocket)
- [ ] Report accuracy validation

### Production Phase

- [ ] Feature flag: `GCC_COMPLIANCE_ENABLED`
- [ ] Gradual rollout (compliance officers first)
- [ ] Real-time monitoring enabled with alerts
- [ ] On-premises deployment package prepared

---

## Monitoring & Analytics

### Performance Metrics

| Metric | Target | Tracking |
|--------|--------|----------|
| WebSocket connection uptime | > 99.5% | WebSocket server logs |
| Real-time monitoring latency | < 5 seconds | Custom timing |
| Report generation time | < 30 seconds | Background job metrics |
| Alert notification delivery | < 1 minute | Notification logs |

### Business Metrics

| Metric | Purpose |
|--------|---------|
| Reports generated per authority | Authority coverage |
| Flagged transactions per day | Monitoring effectiveness |
| Alerts resolved within SLA | Compliance team efficiency |
| False positive rate | Alert accuracy |
| Average report generation time | System performance |

### Compliance Metrics

| Metric | Purpose |
|--------|---------|
| Audit trail completeness | Regulatory compliance |
| Data retention compliance | 7-year retention policy |
| Cross-border transaction coverage | 100% identification rate |
| Suspicious activity detection rate | AML effectiveness |

---

## Documentation Requirements

### Technical Documentation

- [ ] API endpoint documentation (OpenAPI/Swagger)
- [ ] WebSocket protocol documentation
- [ ] Report template structure guide
- [ ] Database schema documentation
- [ ] On-premises deployment guide

### User Documentation

- [ ] Compliance dashboard user guide
- [ ] Report generation step-by-step
- [ ] Transaction monitoring guide
- [ ] Alert resolution workflow
- [ ] Authority-specific reporting requirements

### Compliance Documentation

- [ ] Regulatory mapping (SAMA/DIFC/ADGM/CMA requirements)
- [ ] Audit trail access procedures
- [ ] Data retention policy documentation
- [ ] Incident response procedures

---

## Post-Launch Review

### Success Criteria

- [ ] All GCC authorities covered with templates
- [ ] Real-time monitoring operational with < 5s latency
- [ ] Zero missed regulatory reporting deadlines
- [ ] Compliance officer satisfaction score > 4.5/5
- [ ] Audit trail 100% complete for all actions

### Retrospective Items

- [ ] Additional authority integrations (e.g., QFMA Qatar)
- [ ] ML-based suspicious activity detection enhancement
- [ ] Mobile app for compliance alerts
- [ ] Blockchain-based audit trail (tamper-proof)
- [ ] Integration with external regulatory submission portals

---

**Status**: ⬜ NOT STARTED  
**Priority**: CRITICAL (Regulatory requirement)  
**Estimated Effort**: 3-4 sprints  
**Owner**: Development Team + Compliance SME  
**Last Updated**: 2026-01-02

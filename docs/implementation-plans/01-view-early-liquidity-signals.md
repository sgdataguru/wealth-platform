# 01 - View Early Liquidity Signals - Implementation Plan

## Project Context

**Technical Stack**: Next.js 15 (App Router), React 18, TypeScript, TailwindCSS, Radix UI
**Backend**: Supabase (PostgreSQL), Neo4j Aura (Graph DB), Vercel AI SDK
**Infrastructure**: Vercel (Frontend), Supabase (Backend), Neo4j Aura (Graph)
**External APIs**: PrivateCircle, Zauba, IPO Data, NewsAPI

---

## User Story

**As a** Relationship Manager handling UHNW clients,  
**I want** to view early liquidity signals detected from multiple data sources,  
**So that** I can gain a first-mover advantage and engage with clients before opportunities become obvious in the market.

---

## Pre-conditions

- Supabase database is configured with authentication and RLS policies
- RM user is authenticated and has valid session
- Signal detection backend services are operational and ingesting data
- Data pipelines from PrivateCircle, Zauba, IPO sources are active
- Neo4j graph database has relationship data for clients and prospects
- Minimum viable dataset of UHNW prospects (100CR+ wealth) is loaded
- Real-time subscription infrastructure is configured

---

## Business Requirements

### BR-1: First-Mover Advantage
**Requirement**: Enable RMs to identify liquidity events 30-90 days before they become market-obvious  
**Success Metric**: Average engagement lead time > 30 days before public announcements  
**KPI**: 70% of high-value signals acted upon within 48 hours

### BR-2: Signal Quality & Relevance
**Requirement**: Display only high-quality, actionable signals for 100CR+ individuals  
**Success Metric**: Signal accuracy rate > 85% (confirmed vs. false positives)  
**KPI**: RM satisfaction score > 4.2/5 for signal relevance

### BR-3: Real-Time Intelligence
**Requirement**: Signals updated in near real-time as new data is ingested  
**Success Metric**: Signal appearance latency < 5 minutes from data ingestion  
**KPI**: 95% of signals visible within 5 minutes of detection

### BR-4: Multi-Source Aggregation
**Requirement**: Aggregate signals from 4+ distinct data sources  
**Success Metric**: All configured sources contributing signals within 24 hours  
**KPI**: Zero source failures > 2 hours without alert

---

## Technical Specifications

### Integration Points

#### Authentication
- **Supabase Auth**: Row-level security for RM-specific data
- **Session Management**: JWT tokens with 1-hour expiry
- **Authorization**: Role-based access (RM role required)

#### Data Sources
- **PrivateCircle API**: VC/PE funding rounds, early exits
- **Zauba (MCA/ROC)**: Corporate filings, director changes, acquisitions
- **IPO Data APIs**: Pre-IPO signals, DRHP filings, merchant banker appointments
- **NewsAPI/RSS**: Market intelligence, company mentions

#### Real-Time Infrastructure
- **Supabase Realtime**: PostgreSQL change data capture
- **WebSocket Connection**: Automatic reconnection with exponential backoff
- **Optimistic Updates**: Local state updates before server confirmation

#### Graph Database
- **Neo4j Cypher Queries**: Relationship traversal for prospect connections
- **Client-Prospect Linking**: Match signals to RM's portfolio
- **Relevance Scoring**: Graph distance + signal strength

### Security Requirements

- **Row-Level Security (RLS)**: RMs only see signals for their assigned clients/prospects
- **API Key Management**: External API keys stored in environment variables
- **Data Encryption**: All PII encrypted at rest (AES-256) and in transit (TLS 1.3)
- **Audit Logging**: All signal views logged with timestamp and user ID
- **Rate Limiting**: API endpoints limited to 100 req/min per RM
- **Input Sanitization**: All filter inputs validated and sanitized

### Data Formats

#### Signal Response Schema
\`\`\`typescript
interface LiquiditySignal {
  id: string;
  type: SignalType;
  source: DataSource;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  timeline: '30_DAY' | '60_DAY' | '90_DAY';
  detectedAt: string; // ISO 8601
  estimatedEventDate: string | null;
  prospect: {
    id: string;
    name: string;
    estimatedWealth: number; // in crores
    currentRelationship: 'CLIENT' | 'PROSPECT' | 'LEAD';
    assignedRM: string;
  };
  eventDetails: {
    company?: string;
    eventType: string;
    description: string;
    estimatedLiquidity?: number; // in crores
    confidence: number; // 0-100
  };
  metadata: {
    rawData: Record<string, any>;
    dataSourceTimestamp: string;
    processingTimestamp: string;
  };
}

type SignalType = 
  | 'IPO_FILING'
  | 'FUNDING_ROUND'
  | 'ACQUISITION'
  | 'MERGER'
  | 'EARLY_EXIT'
  | 'DIRECTOR_CHANGE'
  | 'CORPORATE_ACTION'
  | 'MARGIN_PLEDGE_CHANGE';

type DataSource = 
  | 'PRIVATE_CIRCLE'
  | 'ZAUBA'
  | 'IPO_EXCHANGE'
  | 'NEWS_API'
  | 'MANUAL_INTELLIGENCE';
\`\`\`

#### API Endpoints Schema
\`\`\`typescript
// GET /api/signals
interface GetSignalsRequest {
  rmId?: string;
  timeline?: '30_DAY' | '60_DAY' | '90_DAY' | 'ALL';
  source?: DataSource[];
  priority?: string[];
  limit?: number;
  offset?: number;
  sortBy?: 'detectedAt' | 'priority' | 'estimatedEventDate';
  sortOrder?: 'asc' | 'desc';
}

interface GetSignalsResponse {
  success: boolean;
  data: LiquiditySignal[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  metadata: {
    lastUpdated: string;
    activeSourceCount: number;
  };
}

// GET /api/signals/recent
interface GetRecentSignalsResponse {
  success: boolean;
  data: LiquiditySignal[];
  count: number;
}
\`\`\`

---

## Design Specifications

### Visual Layout & Components

#### Main Layout Structure
\`\`\`
[Header - Sticky]
├── Kairos Capital Logo
├── Navigation: Dashboard | Signals | Clients | Insights
├── Search Bar (Global)
└── User Menu (Avatar + Dropdown)

[Page Header]
├── Title: "Early Liquidity Signals"
├── Subtitle: "30-90 day advance intelligence"
└── Quick Stats: [Active Signals: 24] [Critical: 3] [This Week: 12]

[Filter Bar - Horizontal]
├── Timeline Filter: [All | 30-Day | 60-Day | 90-Day]
├── Priority Filter: [All | Critical | High | Medium]
├── Source Filter: [Multi-select dropdown]
└── [Clear Filters] [Export]

[Main Content Area - 2 Column Layout]
├── Signal List (Left - 60%)
│   ├── SignalCard (repeated)
│   ├── Pagination Controls
│   └── "Load More" (Infinite Scroll)
│
└── Details Panel (Right - 40%)
    ├── Selected Signal Details
    ├── Prospect Information
    ├── Action Buttons
    └── Related Signals

[Footer]
└── Last Updated: "2 minutes ago" | Data Sources: 4 Active
\`\`\`

#### Component Hierarchy
\`\`\`tsx
<DashboardLayout>
  <Header />
  <SignalsPage>
    <PageHeader>
      <Title />
      <QuickStats />
    </PageHeader>
    
    <FilterBar>
      <TimelineFilter />
      <PriorityFilter />
      <SourceFilter />
      <ClearFiltersButton />
    </FilterBar>
    
    <SplitLayout>
      <SignalList>
        <SignalCard /> {/* Repeated */}
        <InfiniteScrollTrigger />
      </SignalList>
      
      <DetailsPanel>
        <SignalDetails />
        <ProspectCard />
        <ActionButtons />
        <RelatedSignals />
      </DetailsPanel>
    </SplitLayout>
  </SignalsPage>
  <Footer />
</DashboardLayout>
\`\`\`

### Design System Compliance

#### Color Palette (Kairos Capital Premium Theme)

\`\`\`css
/* Primary Colors */
--primary-deep-blue: #0A1628;        /* Backgrounds, headers */
--primary-royal-blue: #1E3A5F;       /* Interactive elements */
--primary-accent: #C9A227;           /* Gold - CTAs, highlights */
--primary-gold: #D4AF37;             /* Premium accents */

/* Signal Priority Colors */
--signal-critical: #DC3545;          /* Critical signals */
--signal-high: #FFC107;              /* High priority */
--signal-medium: #17A2B8;            /* Medium priority */
--signal-low: #6C757D;               /* Low priority */

/* Status Colors */
--status-new: #C9A227;               /* New/unread signals */
--status-viewed: #5A6C7D;            /* Viewed signals */
--status-actioned: #28A745;          /* Actioned signals */

/* Background & Surface */
--bg-primary: #FFFFFF;               /* Main background */
--bg-secondary: #F8F9FA;             /* Card backgrounds */
--bg-dark: #0A1628;                  /* Dark sections */
--bg-card: #FFFFFF;                  /* Elevated cards */
--bg-overlay: rgba(10, 22, 40, 0.95);/* Modals */

/* Text Colors */
--text-primary: #1A1A2E;             /* Primary text */
--text-secondary: #5A6C7D;           /* Secondary text */
--text-light: #FFFFFF;               /* Light text */
--text-accent: #C9A227;              /* Accented text */
--text-muted: #8E99A4;               /* Muted text */
\`\`\`

#### Typography Scale

\`\`\`css
/* Font Families */
--font-heading: 'Playfair Display', Georgia, serif;
--font-body: 'Inter', 'Helvetica Neue', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;      /* 12px - timestamps, labels */
--text-sm: 0.875rem;     /* 14px - metadata, captions */
--text-base: 1rem;       /* 16px - body text */
--text-lg: 1.125rem;     /* 18px - card titles */
--text-xl: 1.25rem;      /* 20px - section headers */
--text-2xl: 1.5rem;      /* 24px - page titles */
--text-3xl: 1.875rem;    /* 30px - hero text */

/* Font Weights */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
\`\`\`

---

## Implementation Status

**OVERALL STATUS**: ⬜ NOT STARTED

### Phase 1: Foundation & Setup (Week 1)
- [ ] Create signals page route structure
- [ ] Define TypeScript interfaces for signals
- [ ] Set up Supabase tables and RLS policies
- [ ] Configure API routes
- [ ] Create base UI components (SignalBadge, Skeleton)
- [ ] Set up Zustand store
- [ ] Configure real-time subscriptions

### Phase 2: Core Implementation (Week 2)
- [ ] Implement SignalList component
- [ ] Implement SignalCard component
- [ ] Implement FilterBar with all filters
- [ ] Implement data fetching hooks
- [ ] Implement infinite scroll
- [ ] Connect to Supabase API
- [ ] Add loading and error states

### Phase 3: Enhanced Features (Week 3)
- [ ] Implement SignalDetails panel
- [ ] Add real-time signal updates
- [ ] Implement filter persistence (URL + localStorage)
- [ ] Add QuickStats component
- [ ] Implement mark as read functionality
- [ ] Add keyboard shortcuts
- [ ] Optimize performance (memoization, virtualization)

### Phase 4: Polish & Testing (Week 4)
- [ ] Responsive design refinements (mobile/tablet)
- [ ] Accessibility audit and fixes
- [ ] Add empty states and error messages
- [ ] Implement toast notifications
- [ ] Write unit tests (Jest)
- [ ] Write integration tests (React Testing Library)
- [ ] Write E2E tests (Playwright)
- [ ] Performance optimization
- [ ] Documentation

---

**Document Status**: ✅ Complete and Ready for Implementation
**Last Updated**: 2025-12-19
**Next Review**: After Phase 1 completion

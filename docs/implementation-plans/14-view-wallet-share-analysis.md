# [14] View Wallet Share Analysis - Implementation Plan

## Project Context

**Technical Stack**: Next.js 15 (App Router), React 18, TypeScript, TailwindCSS
**Backend**: Supabase (PostgreSQL), Edge Functions
**Infrastructure**: Vercel (FE), Supabase Cloud
**Design System**: Kairos Capital Premium Wealth Aesthetic

---

## User Story

**As a** Relationship Manager,
**I want** to see wallet share analysis for high-value clients,
**So that** I can identify opportunities to deepen relationships and capture more of their investable assets.

---

## Pre-conditions

- User authenticated with RM or Executive role
- Client/Prospect data available with AUM figures
- External wealth estimates available (from intelligence signals or manual input)
- Lead scoring system operational (Story 02)
- Dashboard layout components available

---

## Business Requirements

| Requirement | Success Metric |
|-------------|----------------|
| Display wallet share for each high-value client | 100% of clients with $10M+ AUM show wallet share |
| Visualize current share vs. opportunity gap | Clear visual distinction between captured and held-away |
| Calculate Total Wealth = AUM + External Investments | Accurate aggregation within ±5% of manual calculation |
| Segment comparison (Family Offices, SWFs, CXOs) | Filter and compare across 3+ segments |
| Highlight low share / high potential clients | Clients with <30% share and $50M+ potential flagged |
| Track wallet share trends over time | Historical data for 12+ months |
| Integrate with lead scoring for prioritization | Combined wallet + lead score ranking |

---

## Technical Specifications

### Integration Points

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **Supabase Database** | Store wallet share calculations | PostgreSQL with time-series |
| **Lead Scoring API** | Combine with lead scores | Internal API `/api/leads/score` |
| **Intelligence Signals** | External wealth indicators | Story 10 integration |
| **Charting Library** | Visualizations | Recharts or Chart.js |

### Security Requirements

- [x] RBAC: RM sees only assigned clients
- [x] Executive role sees all clients
- [x] Sensitive wealth data encrypted at rest
- [x] Audit logging for data access
- [ ] Data export restrictions for compliance

### Data Model

```typescript
interface WalletShareData {
  clientId: string;
  clientName: string;
  segment: ClientSegment;
  
  // Core Metrics
  aum: number;                    // Assets Under Management (captured)
  externalWealth: number;         // Estimated held-away assets
  totalWealth: number;            // AUM + External
  walletShare: number;            // AUM / Total Wealth (0-1)
  
  // Opportunity Analysis
  opportunityGap: number;         // External wealth in USD
  opportunityScore: number;       // 0-100 based on potential
  
  // Lead Integration
  leadScore: number;              // From lead scoring system
  combinedPriority: number;       // Weighted score
  
  // Trends
  walletShareHistory: WalletShareSnapshot[];
  trend: 'increasing' | 'stable' | 'decreasing';
  
  // Metadata
  lastUpdated: Date;
  dataConfidence: 'high' | 'medium' | 'low';
}

type ClientSegment = 'FAMILY_OFFICE' | 'SWF' | 'CXO' | 'UHNW_INDIVIDUAL' | 'INSTITUTION';

interface WalletShareSnapshot {
  date: Date;
  walletShare: number;
  aum: number;
  totalWealth: number;
}
```

---

## Design Specifications

### Visual Layout & Components

```
[Wallet Share Analysis Page]
├── Header (Sticky)
│   ├── Page Title: "Wallet Share Analysis"
│   ├── Segment Selector (Dropdown/Tabs)
│   └── Export Button (CSV/PDF)
│
├── Summary Cards (Grid: 4 columns desktop)
│   ├── Total Clients Analyzed
│   ├── Average Wallet Share (%)
│   ├── Total Opportunity Gap ($)
│   └── High Priority Count
│
├── FilterBar
│   ├── Segment Filter (Multi-select)
│   ├── Wallet Share Range (Slider: 0-100%)
│   ├── AUM Range (Min-Max)
│   └── Sort By (Opportunity, Share, Lead Score)
│
├── Main Content (2 columns desktop)
│   ├── Left: Client List / Table
│   │   ├── ClientWalletCard (Repeated)
│   │   │   ├── Client Name + Segment Badge
│   │   │   ├── Wallet Share Gauge (Donut/Progress)
│   │   │   ├── AUM vs Total Wealth Bar
│   │   │   ├── Opportunity Gap (Highlighted)
│   │   │   ├── Lead Score Badge
│   │   │   └── Trend Indicator (Arrow)
│   │   └── Pagination
│   │
│   └── Right: Visualizations Panel (Sticky)
│       ├── Segment Comparison Chart (Bar)
│       ├── Wallet Share Distribution (Histogram)
│       └── Trend Line Chart (Selected Client)
│
└── Detail Drawer (Slide-in on client select)
    ├── Full Wallet Share History
    ├── Wealth Breakdown Pie Chart
    ├── Data Sources Attribution
    └── Action Buttons (Contact, Add Note)
```

### Component Hierarchy

```tsx
<DashboardLayout>
  <WalletSharePage>                           {/* Server Component */}
    <WalletShareHeader />                     {/* Server Component */}
    <SummaryCards metrics={summaryMetrics} /> {/* Server Component */}
    <WalletShareFilterBar />                  {/* Client Component */}
    <WalletShareContent>                      {/* Client Component */}
      <ClientWalletList>                      {/* Client Component */}
        <ClientWalletCard />                  {/* Server Component */}
      </ClientWalletList>
      <VisualizationsPanel>                   {/* Client Component */}
        <SegmentComparisonChart />
        <WalletDistributionChart />
        <TrendLineChart />
      </VisualizationsPanel>
    </WalletShareContent>
    <ClientDetailDrawer />                    {/* Client Component */}
  </WalletSharePage>
</DashboardLayout>
```

### Design System Compliance (Kairos Capital)

```css
/* Primary Colors */
--primary-ink: #031926;
--primary-teal: #007B7A;
--primary-cerulean: #00B3C6;
--primary-gold: #C9A84A;

/* Wallet Share Specific */
--wallet-captured: #007B7A;         /* Teal - captured AUM */
--wallet-opportunity: #C9A84A;      /* Gold - opportunity gap */
--wallet-low: #DC3545;              /* Red - low share warning */
--wallet-high: #28A745;             /* Green - high share success */

/* Gauge Colors */
--gauge-background: #E9ECEC;
--gauge-fill-low: #DC3545;          /* 0-30% */
--gauge-fill-medium: #FFB74D;       /* 30-60% */
--gauge-fill-high: #28A745;         /* 60-100% */

/* Card Styling */
.wallet-card {
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(3, 25, 38, 0.08);
  border-left: 4px solid var(--primary-teal);
}

.wallet-card.high-opportunity {
  border-left-color: var(--primary-gold);
  background: linear-gradient(135deg, #FFFFFF 0%, #FFF9E6 100%);
}
```

### Responsive Behavior

| Breakpoint | Layout Changes |
|------------|----------------|
| Mobile (< 768px) | Single column, collapsible visualizations |
| Tablet (768px - 1023px) | Stacked cards, side panel hidden |
| Desktop (1024px+) | 2-column with sticky visualization panel |
| Large Desktop (1440px+) | 3-column with expanded charts |

---

## Technical Architecture

### Component Structure

```
app/
├── (dashboard)/
│   └── wallet-share/
│       ├── page.tsx                          # Server Component entry
│       ├── loading.tsx                       # Loading skeleton
│       └── error.tsx                         # Error boundary
├── components/
│   └── features/
│       └── wallet-share/
│           ├── WalletShareHeader.tsx         # Page header
│           ├── SummaryCards.tsx              # Metric cards
│           ├── WalletShareFilterBar.tsx      # Client: Filters
│           ├── ClientWalletList.tsx          # Client: List container
│           ├── ClientWalletCard.tsx          # Server: Individual card
│           ├── WalletGauge.tsx               # Server: Donut/gauge
│           ├── OpportunityBar.tsx            # Server: Stacked bar
│           ├── SegmentComparisonChart.tsx    # Client: Bar chart
│           ├── WalletDistributionChart.tsx   # Client: Histogram
│           ├── TrendLineChart.tsx            # Client: Line chart
│           └── ClientDetailDrawer.tsx        # Client: Detail panel
├── api/
│   └── wallet-share/
│       ├── route.ts                          # GET: Fetch wallet data
│       ├── [clientId]/
│       │   └── route.ts                      # GET: Single client detail
│       └── summary/
│           └── route.ts                      # GET: Summary metrics
```

### State Management Architecture

```typescript
// URL-synced filter state for shareability
interface WalletShareFilterState {
  segments: ClientSegment[];          // Multi-select filter
  walletShareMin: number;             // 0-100
  walletShareMax: number;             // 0-100
  aumMin: number;                     // In millions
  aumMax: number;                     // In millions
  sortBy: 'opportunity' | 'walletShare' | 'leadScore' | 'aum';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

// Client list state
interface WalletShareListState {
  clients: WalletShareData[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  selectedClientId: string | null;
}

// Summary metrics state
interface WalletShareSummary {
  totalClients: number;
  averageWalletShare: number;
  totalOpportunityGap: number;
  highPriorityCount: number;
  segmentBreakdown: Record<ClientSegment, SegmentMetrics>;
}

interface SegmentMetrics {
  count: number;
  avgWalletShare: number;
  totalAum: number;
  totalOpportunity: number;
}
```

### API Schema

```typescript
// GET /api/wallet-share
interface WalletShareRequest {
  segments?: ClientSegment[];
  walletShareMin?: number;
  walletShareMax?: number;
  aumMin?: number;
  aumMax?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface WalletShareResponse {
  success: boolean;
  data: WalletShareData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
  summary: WalletShareSummary;
}

// GET /api/wallet-share/:clientId
interface ClientWalletDetailResponse {
  success: boolean;
  data: {
    ...WalletShareData;
    wealthBreakdown: WealthBreakdown[];
    dataSources: DataSource[];
    recentActivities: Activity[];
  };
}

interface WealthBreakdown {
  category: string;           // 'Equities', 'Real Estate', 'Private Equity', etc.
  amount: number;
  isCapture: boolean;         // true = with us, false = held-away
}

interface DataSource {
  source: string;
  confidence: number;
  lastUpdated: Date;
}

// GET /api/wallet-share/summary
interface SummaryResponse {
  success: boolean;
  data: WalletShareSummary;
}
```

### Database Schema

```sql
-- wallet_share_snapshots table (time-series)
CREATE TABLE wallet_share_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id),
  snapshot_date DATE NOT NULL,
  
  -- Core Metrics
  aum DECIMAL(18,2) NOT NULL,
  external_wealth DECIMAL(18,2) NOT NULL DEFAULT 0,
  total_wealth DECIMAL(18,2) GENERATED ALWAYS AS (aum + external_wealth) STORED,
  wallet_share DECIMAL(5,4) GENERATED ALWAYS AS (
    CASE WHEN (aum + external_wealth) > 0 
         THEN aum / (aum + external_wealth) 
         ELSE 0 
    END
  ) STORED,
  
  -- Confidence & Source
  data_confidence VARCHAR(10) CHECK (data_confidence IN ('high', 'medium', 'low')),
  source_trace JSONB DEFAULT '[]',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(client_id, snapshot_date)
);

-- Indexes for performance
CREATE INDEX idx_wallet_snapshots_client ON wallet_share_snapshots(client_id);
CREATE INDEX idx_wallet_snapshots_date ON wallet_share_snapshots(snapshot_date DESC);
CREATE INDEX idx_wallet_snapshots_share ON wallet_share_snapshots(wallet_share);

-- View for latest wallet share per client
CREATE VIEW v_latest_wallet_share AS
SELECT DISTINCT ON (client_id) *
FROM wallet_share_snapshots
ORDER BY client_id, snapshot_date DESC;

-- Clients table extension (if not exists)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS segment VARCHAR(20) 
  CHECK (segment IN ('FAMILY_OFFICE', 'SWF', 'CXO', 'UHNW_INDIVIDUAL', 'INSTITUTION'));
```

---

## Implementation Requirements

### Core Components

| Component | Type | Purpose |
|-----------|------|---------|
| `SummaryCards.tsx` | Server | Display 4 key metrics at page top |
| `WalletShareFilterBar.tsx` | Client | Segment, range, and sort filters |
| `ClientWalletCard.tsx` | Server | Individual client wallet summary |
| `WalletGauge.tsx` | Server | Donut chart showing wallet share % |
| `OpportunityBar.tsx` | Server | Stacked bar: AUM vs Opportunity |
| `SegmentComparisonChart.tsx` | Client | Compare segments via Recharts |
| `TrendLineChart.tsx` | Client | Historical wallet share trend |
| `ClientDetailDrawer.tsx` | Client | Slide-in panel with full details |

### Custom Hooks

| Hook | Purpose |
|------|---------|
| `useWalletShare()` | Fetch and cache wallet share data with SWR |
| `useWalletFilters()` | URL-synced filter state management |
| `useWalletSummary()` | Fetch summary metrics |
| `useClientDetail()` | Fetch individual client detail |

### Utility Functions

| Function | Location | Purpose |
|----------|----------|---------|
| `formatCurrency()` | `lib/utils/formatters.ts` | Format USD with M/B suffixes |
| `calculateOpportunityScore()` | `lib/utils/wallet.ts` | Score based on gap + growth potential |
| `deriveWalletTrend()` | `lib/utils/wallet.ts` | Analyze historical trend direction |
| `combineWithLeadScore()` | `lib/utils/wallet.ts` | Weighted priority calculation |
| `getSegmentColor()` | `lib/utils/wallet.ts` | Consistent segment color mapping |

---

## Acceptance Criteria

### Functional Requirements

| ID | Criterion | Status |
|----|-----------|--------|
| 14.1 | Dashboard shows estimated wallet share for each high-value client | ⬜ |
| 14.2 | Visual indicator of current share vs. potential opportunity | ⬜ |
| 14.3 | Calculated based on Total Wealth (AUM + external) | ⬜ |
| 14.4 | Comparison across client segments | ⬜ |
| 14.5 | Highlights clients with low share but high potential | ⬜ |
| 14.6 | Wallet share trends trackable over time (USD M/B) | ⬜ |
| 14.7 | Integrates with lead scoring for prioritization | ⬜ |

### Non-Functional Requirements

| Requirement | Target | Status |
|-------------|--------|--------|
| Initial page load | < 2 seconds | ⬜ |
| Chart render time | < 500ms | ⬜ |
| Filter response | < 200ms | ⬜ |
| Bundle size increase | < 80KB (charting) | ⬜ |
| WCAG 2.1 AA | Full compliance | ⬜ |
| Mobile responsiveness | Full support | ⬜ |

---

## Modified Files

```
app/
├── (dashboard)/
│   └── wallet-share/
│       ├── page.tsx                          ⬜
│       ├── loading.tsx                       ⬜
│       └── error.tsx                         ⬜
├── components/
│   └── features/
│       └── wallet-share/
│           ├── WalletShareHeader.tsx         ⬜
│           ├── SummaryCards.tsx              ⬜
│           ├── WalletShareFilterBar.tsx      ⬜
│           ├── ClientWalletList.tsx          ⬜
│           ├── ClientWalletCard.tsx          ⬜
│           ├── WalletGauge.tsx               ⬜
│           ├── OpportunityBar.tsx            ⬜
│           ├── SegmentComparisonChart.tsx    ⬜
│           ├── WalletDistributionChart.tsx   ⬜
│           ├── TrendLineChart.tsx            ⬜
│           └── ClientDetailDrawer.tsx        ⬜
├── api/
│   └── wallet-share/
│       ├── route.ts                          ⬜
│       ├── [clientId]/
│       │   └── route.ts                      ⬜
│       └── summary/
│           └── route.ts                      ⬜
├── hooks/
│   ├── useWalletShare.ts                     ⬜
│   ├── useWalletFilters.ts                   ⬜
│   └── useClientDetail.ts                    ⬜

lib/
└── utils/
    └── wallet.ts                             ⬜

types/
└── wallet.types.ts                           ⬜

backend/
└── database/
    └── migrations/
        └── 0005_create_wallet_share.sql      ⬜
```

---

## Implementation Status

**OVERALL STATUS**: ⬜ NOT STARTED

### Phase 1: Foundation & Setup ⬜

- [ ] Database migration for wallet_share_snapshots
- [ ] Type definitions in `types/wallet.types.ts`
- [ ] Utility functions in `lib/utils/wallet.ts`
- [ ] API route stubs

### Phase 2: Core Implementation ⬜

- [ ] Wallet Share API with filtering and pagination
- [ ] Summary metrics endpoint
- [ ] SummaryCards component
- [ ] ClientWalletCard with WalletGauge
- [ ] FilterBar with URL sync

### Phase 3: Visualizations ⬜

- [ ] Recharts integration
- [ ] SegmentComparisonChart
- [ ] WalletDistributionChart
- [ ] TrendLineChart
- [ ] OpportunityBar component

### Phase 4: Enhanced Features ⬜

- [ ] ClientDetailDrawer with full history
- [ ] Lead score integration
- [ ] Export functionality (CSV/PDF)
- [ ] Real-time updates (optional)

### Phase 5: Polish & Testing ⬜

- [ ] Loading skeletons
- [ ] Error states
- [ ] Accessibility audit
- [ ] Unit tests
- [ ] E2E tests

---

## Dependencies

### Internal Dependencies

| Dependency | Purpose | Status |
|------------|---------|--------|
| Client/Prospect data | Base client information | ✅ Available |
| Lead Scoring (Story 02) | Combined priority calculation | 🔄 In Progress |
| Intelligence Signals (Story 10) | External wealth indicators | ✅ Complete |
| Dashboard Layout | Page structure | ✅ Available |

### External Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `recharts` | ^2.x | Charts and visualizations |
| `@radix-ui/react-slider` | ^1.x | Range slider for filters |
| `@radix-ui/react-dialog` | ^1.x | Detail drawer |
| `date-fns` | ^3.x | Date formatting for trends |

---

## Risk Assessment

### Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Charting library bundle size | Medium | High | Dynamic import, tree shaking |
| External wealth data accuracy | High | Medium | Show confidence indicators |
| Complex filter combinations | Medium | Medium | URL state management, validation |
| Performance with large client lists | Medium | Low | Virtualization, pagination |

### Business Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Inaccurate wallet share calculations | High | Medium | Multiple data sources, confidence scores |
| Data privacy concerns | High | Low | RBAC, audit logging, encryption |
| User confusion with metrics | Medium | Medium | Tooltips, contextual help |

---

## Testing Strategy

### Unit Tests (Jest)

```typescript
describe('Wallet Share Utilities', () => {
  describe('calculateOpportunityScore', () => {
    it('returns high score for large opportunity gap', () => {
      const score = calculateOpportunityScore({
        walletShare: 0.2,
        opportunityGap: 100_000_000,
        trend: 'increasing'
      });
      expect(score).toBeGreaterThan(80);
    });
    
    it('returns low score for high wallet share', () => {
      const score = calculateOpportunityScore({
        walletShare: 0.9,
        opportunityGap: 10_000_000,
        trend: 'stable'
      });
      expect(score).toBeLessThan(30);
    });
  });
  
  describe('deriveWalletTrend', () => {
    it('identifies increasing trend correctly', () => {
      const history = [
        { date: new Date('2025-01'), walletShare: 0.2 },
        { date: new Date('2025-06'), walletShare: 0.3 },
        { date: new Date('2025-12'), walletShare: 0.4 },
      ];
      expect(deriveWalletTrend(history)).toBe('increasing');
    });
  });
});

describe('ClientWalletCard', () => {
  it('renders wallet share gauge correctly', () => {
    render(<ClientWalletCard client={mockClient} />);
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '45');
  });
  
  it('highlights high opportunity clients', () => {
    const highOpportunityClient = { ...mockClient, walletShare: 0.15 };
    render(<ClientWalletCard client={highOpportunityClient} />);
    expect(screen.getByTestId('wallet-card')).toHaveClass('high-opportunity');
  });
});
```

### Integration Tests (React Testing Library)

```typescript
describe('WalletSharePage Integration', () => {
  it('loads and displays wallet share data', async () => {
    render(<WalletSharePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Family Office Alpha')).toBeInTheDocument();
      expect(screen.getByText('$1.2B Total Wealth')).toBeInTheDocument();
    });
  });
  
  it('filters by segment correctly', async () => {
    render(<WalletSharePage />);
    
    await userEvent.click(screen.getByRole('button', { name: /segment/i }));
    await userEvent.click(screen.getByRole('option', { name: 'Family Office' }));
    
    await waitFor(() => {
      expect(screen.getAllByTestId('wallet-card')).toHaveLength(3);
    });
  });
  
  it('opens detail drawer on client click', async () => {
    render(<WalletSharePage />);
    
    await userEvent.click(screen.getByText('Family Office Alpha'));
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Wallet Share History')).toBeInTheDocument();
    });
  });
});
```

### E2E Tests (Playwright)

```typescript
test.describe('Wallet Share Analysis', () => {
  test('complete analysis workflow', async ({ page }) => {
    await page.goto('/wallet-share');
    
    // Verify summary cards loaded
    await expect(page.locator('[data-testid="summary-cards"]')).toBeVisible();
    await expect(page.locator('text=Average Wallet Share')).toBeVisible();
    
    // Filter by low wallet share
    await page.fill('[data-testid="share-max-input"]', '30');
    await page.click('[data-testid="apply-filters"]');
    
    // Verify filtered results
    const cards = page.locator('[data-testid="wallet-card"]');
    await expect(cards).toHaveCount(5);
    
    // Open client detail
    await cards.first().click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Verify trend chart
    await expect(page.locator('[data-testid="trend-chart"]')).toBeVisible();
  });
  
  test('export wallet share report', async ({ page }) => {
    await page.goto('/wallet-share');
    
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="export-csv"]');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toContain('wallet-share');
  });
});
```

---

## Performance Considerations

### Bundle Optimization

- Dynamic import for Recharts (lazy load charts)
- Tree shake unused chart components
- Server Components for static elements (cards, gauges)

### Runtime Performance

- Virtualized client list for 100+ clients
- Memoized chart calculations
- Debounced filter inputs (300ms)
- Stale-while-revalidate caching

### Database Performance

- Indexed queries on wallet_share, client_id, snapshot_date
- Materialized view for latest snapshots
- Pagination with cursor-based approach

---

## Deployment Plan

### Development Phase

- [ ] Feature branch: `feature/14-wallet-share-analysis`
- [ ] Database migration applied to dev
- [ ] Seed data for testing
- [ ] Component Storybook stories

### Staging Phase

- [ ] Migration applied to staging
- [ ] UAT with RM stakeholders
- [ ] Performance benchmarking
- [ ] Accessibility audit

### Production Phase

- [ ] Feature flag: `WALLET_SHARE_ENABLED`
- [ ] Canary release to 10% of users
- [ ] Monitor error rates and performance
- [ ] Gradual rollout over 1 week

---

## Monitoring & Analytics

### Performance Metrics

| Metric | Target | Tracking |
|--------|--------|----------|
| Page load time | < 2s | Vercel Analytics |
| Chart render time | < 500ms | Custom timing |
| API response time | < 200ms (p95) | Supabase Dashboard |

### Business Metrics

| Metric | Purpose |
|--------|---------|
| Page views per RM | Feature adoption |
| Filter usage patterns | UX optimization |
| Client detail views | Engagement depth |
| Export downloads | Report utility |

### Error Tracking

- Client-side errors via Sentry
- API errors logged to Supabase
- Alert threshold: >1% error rate

---

## Documentation Requirements

### Technical Documentation

- [ ] API endpoint documentation (OpenAPI)
- [ ] Component Storybook stories
- [ ] Database schema documentation
- [ ] Calculation methodology guide

### User Documentation

- [ ] Feature overview guide
- [ ] Interpreting wallet share metrics
- [ ] Best practices for identifying opportunities
- [ ] FAQ

---

## Post-Launch Review

### Success Criteria

- [ ] 80% of RMs access wallet share within first week
- [ ] Average session time > 3 minutes
- [ ] < 1% error rate
- [ ] Positive qualitative feedback

### Retrospective Items

- [ ] Chart performance on low-end devices
- [ ] Data accuracy feedback from RMs
- [ ] Missing filter/sort options
- [ ] Mobile UX improvements

---

**Status**: ⬜ NOT STARTED  
**Priority**: HIGH  
**Estimated Effort**: 3-4 sprints  
**Owner**: Development Team  
**Last Updated**: 2025-12-31

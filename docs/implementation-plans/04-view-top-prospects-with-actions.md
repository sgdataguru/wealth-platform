# [Story 04] View Top Prospects with Suggested Actions - Implementation Plan

## Project Context
**Technical Stack**: Next.js 15 (App Router), React 18, TypeScript, TailwindCSS, Radix UI + Custom Components
**Backend**: Supabase (PostgreSQL), Neo4j Aura (Graph DB)
**Infrastructure**: Vercel (Frontend), Supabase Cloud, OpenAI GPT-4 (AI suggestions)

## User Story

As a **Relationship Manager**, I want **to see a prioritized list of top prospects with suggested actions**, so that **I can quickly identify which clients to engage with and what action to take**.

## Pre-conditions

- User is authenticated as a Relationship Manager
- User has access to the dashboard route group `(dashboard)/`
- Client data exists in Supabase with associated signals
- Lead scoring system is operational (from Story #2)
- Early liquidity signals are being captured (from Story #1)
- Real-time data sync is configured for dynamic updates

## Business Requirements

- **BR-1**: Display top 20 prospects ranked by lead score (weighted combination of signal strength, recency, and relationship proximity)
  - **Success Metric**: RMs can identify their top 3 priority clients within 5 seconds of page load
  
- **BR-2**: Show actionable suggestions for each prospect based on signal type and client context
  - **Success Metric**: 70% of suggested actions are acted upon within 48 hours
  
- **BR-3**: Enable quick drill-down to detailed prospect view without losing context
  - **Success Metric**: Average time to decision (view → action) < 2 minutes
  
- **BR-4**: Automatically refresh list as new signals are detected (real-time or near-real-time)
  - **Success Metric**: New high-priority signals appear within 5 minutes of detection

## Technical Specifications

### Integration Points
- **Authentication**: Supabase Auth (JWT-based session)
- **Database**: Supabase PostgreSQL (clients, signals, activities tables)
- **Graph Database**: Neo4j Aura (relationship paths, influence mapping)
- **AI Suggestions**: OpenAI GPT-4 (action recommendation engine)
- **Real-time Updates**: Supabase Realtime Subscriptions (on signals table)
- **Data Formats**: 
  ```typescript
  // API Response Format
  interface ProspectListResponse {
    success: boolean;
    data: {
      prospects: Prospect[];
      metadata: {
        lastUpdated: string;
        totalCount: number;
        rmId: string;
      };
    };
    error?: ApiError;
  }
  ```

### Security Requirements
- **JWT Authentication**: Verify user session on all API calls
- **Row-Level Security (RLS)**: RMs can only see their assigned clients
- **Action Logging**: Track all suggested actions and outcomes for audit
- **Rate Limiting**: Max 100 requests/minute per RM for real-time updates
- **Data Sanitization**: Sanitize all user inputs for manual actions

## Design Specifications

### Visual Layout & Components

**Main Layout Structure**:
```
[Header with RM Profile & Global Actions]
    
[Page Title: "Top Prospects"]
├── Filter Bar (Signal Type, Date Range, Score Threshold)
└── Stats Cards (3-column grid)
    ├── Total Prospects (with trend indicator)
    ├── Avg Lead Score (with distribution chart)
    └── Actions Pending (with due date breakdown)

[Prospects Grid - 2 columns on desktop, 1 on mobile]
├── Prospect Card #1 (Highest Score)
│   ├── Header: Name, Company, Lead Score Badge
│   ├── Signal Summary: Type, Recency, Source
│   ├── Suggested Actions (max 3)
│   └── Quick Actions: View Detail | Schedule Call | Log Note
├── Prospect Card #2
├── Prospect Card #3
└── ... (up to 20 cards with infinite scroll)

[Floating Action Button: + Add Manual Intelligence]
```

**Component Hierarchy**:
```tsx
<DashboardLayout>
  <Header />
  <PageHeader title="Top Prospects" />
  
  <ProspectsView>
    <FilterBar 
      filters={['signalType', 'dateRange', 'scoreThreshold']}
      onFilterChange={handleFilterChange}
    />
    
    <StatsCards 
      totalProspects={count}
      avgScore={avgScore}
      pendingActions={pendingCount}
    />
    
    <ProspectsGrid>
      {prospects.map(prospect => (
        <ProspectCard 
          key={prospect.id}
          prospect={prospect}
          suggestedActions={actions}
          onActionClick={handleActionClick}
          onCardClick={handleViewDetail}
        />
      ))}
    </ProspectsGrid>
    
    <LoadMoreTrigger onIntersect={loadMore} />
  </ProspectsView>
  
  <FloatingActionButton onClick={openAddIntelligenceModal} />
</DashboardLayout>
```

### Design System Compliance

**Color Palette** (from Kairos Capital aesthetic):

```css
/* Primary Colors */
--primary-deep-blue: #0A1628;      /* Background for cards on dark sections */
--primary-royal-blue: #1E3A5F;     /* Accent for CTAs and highlights */
--primary-accent: #C9A227;          /* Gold for lead score badges */
--primary-gold: #D4AF37;            /* Premium accents */

/* Background & Surface */
--bg-primary: #FFFFFF;              /* Main page background */
--bg-secondary: #F8F9FA;            /* Card backgrounds */
--bg-card: #FFFFFF;                 /* Prospect card surface */

/* Text Colors */
--text-primary: #1A1A2E;            /* Headings and primary text */
--text-secondary: #5A6C7D;          /* Supporting text */
--text-accent: #C9A227;             /* Lead score numbers */

/* Semantic Colors */
--success: #28A745;                 /* Positive signals (funding, IPO) */
--warning: #FFC107;                 /* Medium priority signals */
--error: #DC3545;                   /* High urgency actions */
--info: #17A2B8;                    /* Informational badges */
```

**Typography Scale**:

```css
/* Font Families */
--font-heading: 'Playfair Display', 'Georgia', serif;  /* Page titles */
--font-body: 'Inter', 'Helvetica Neue', sans-serif;    /* Body text */

/* Type Scale */
--text-xs: 0.75rem;    /* 12px - Badge labels */
--text-sm: 0.875rem;   /* 14px - Card metadata */
--text-base: 1rem;     /* 16px - Card content */
--text-lg: 1.125rem;   /* 18px - Prospect names */
--text-xl: 1.25rem;    /* 20px - Section headings */
--text-2xl: 1.5rem;    /* 24px - Page title */

/* Font Weights */
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Responsive Behavior

**Breakpoints**:
```css
/* Mobile: < 768px */
.prospects-grid-mobile {
  @apply flex flex-col space-y-4 px-4;
}

/* Tablet: 768px - 1023px */
.prospects-grid-tablet {
  @apply grid grid-cols-2 gap-4 px-6;
}

/* Desktop: 1024px+ */
.prospects-grid-desktop {
  @apply grid grid-cols-2 gap-6 px-8 max-w-7xl mx-auto;
}

/* Large Desktop: 1440px+ */
.prospects-grid-xl {
  @apply grid grid-cols-3 gap-6 px-12 max-w-[1600px] mx-auto;
}
```

**Layout Adaptations**:
- **Mobile**: Single column, stacked cards, collapsed filters in drawer
- **Tablet**: 2-column grid, visible filters, sticky header
- **Desktop**: 2-3 column grid, fixed sidebar filters, all actions visible
- **Large Desktop**: 3-column grid, expanded card details

### Interaction Patterns

**Prospect Card States**:
```typescript
interface CardStates {
  default: 'bg-white border border-gray-200 shadow-sm';
  hover: 'bg-white border-royal-blue shadow-md transform -translate-y-1 scale-[1.02]';
  active: 'bg-slate-50 border-royal-blue shadow-lg';
  selected: 'bg-blue-50 border-2 border-royal-blue shadow-md';
  loading: 'bg-white border-gray-200 opacity-60 cursor-wait';
}
```

**Action Button States**:
```typescript
interface ActionButtonStates {
  primary: 'bg-gradient-to-r from-gold to-primary-gold text-slate-900 font-semibold';
  secondary: 'border-2 border-royal-blue text-royal-blue bg-transparent';
  ghost: 'text-slate-700 hover:bg-slate-100';
  disabled: 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50';
  loading: 'bg-royal-blue text-white cursor-wait animate-pulse';
}
```

**Lead Score Badge Design**:
```tsx
// Score ranges with color coding
interface ScoreBadge {
  '90-100': 'bg-emerald-100 text-emerald-800 border-emerald-300'; // Hot lead
  '75-89': 'bg-amber-100 text-amber-800 border-amber-300';        // Warm lead
  '60-74': 'bg-blue-100 text-blue-800 border-blue-300';           // Qualified
  '0-59': 'bg-slate-100 text-slate-600 border-slate-300';         // Watch
}
```

## Technical Architecture

### Component Structure
```
app/(dashboard)/
├── page.tsx                          # Top Prospects page (entry point)
├── components/
│   ├── ProspectsView.tsx             # Main container component
│   ├── ProspectCard.tsx              # Individual prospect card (from Story #3)
│   ├── FilterBar.tsx                 # Filter controls
│   ├── StatsCards.tsx                # Summary statistics
│   ├── SuggestedActions.tsx          # Action recommendation display
│   ├── LoadMoreTrigger.tsx           # Infinite scroll trigger
│   └── hooks/
│       ├── useProspects.ts           # Data fetching and filtering
│       ├── useProspectsRealtime.ts   # Real-time updates via Supabase
│       ├── useSuggestedActions.ts    # AI-generated action suggestions
│       └── useProspectActions.ts     # Handle user actions (call, note, etc.)
└── lib/
    ├── api/prospects-api.ts          # API client for prospects
    └── utils/
        ├── score-utils.ts            # Lead score calculations
        └── action-generator.ts       # AI action suggestion logic
```

### State Management Architecture

**Global Store (Zustand)**:
```typescript
interface ProspectsStore {
  // Data State
  prospects: Prospect[];
  selectedProspect: Prospect | null;
  filters: ProspectFilters;
  sortBy: SortOption;
  
  // UI State
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  
  // Pagination
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  
  // Actions
  loadProspects: (filters?: ProspectFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  selectProspect: (prospect: Prospect | null) => void;
  updateFilters: (filters: Partial<ProspectFilters>) => void;
  refreshProspects: () => Promise<void>;
}
```

**Local Component State**:
```typescript
interface ProspectsViewState {
  // Real-time Updates
  realtimeEnabled: boolean;
  lastUpdateTime: Date;
  
  // Interaction State
  expandedCardId: string | null;
  selectedActionId: string | null;
  
  // Modal State
  isDetailModalOpen: boolean;
  isActionModalOpen: boolean;
}
```

### API Integration Schema

**Endpoints**:
```typescript
// GET /api/prospects
interface GetProspectsRequest {
  rmId: string;
  filters?: {
    signalTypes?: SignalType[];
    dateRange?: { start: Date; end: Date };
    minScore?: number;
    maxScore?: number;
  };
  sort?: 'score' | 'recent' | 'signal-strength';
  page?: number;
  pageSize?: number;
}

interface GetProspectsResponse {
  success: boolean;
  data: {
    prospects: Prospect[];
    metadata: {
      total: number;
      page: number;
      pageSize: number;
      hasMore: boolean;
    };
  };
}

// GET /api/prospects/[id]/actions
interface GetSuggestedActionsRequest {
  prospectId: string;
  context?: {
    signalType: string;
    recentInteractions: string[];
  };
}

interface GetSuggestedActionsResponse {
  success: boolean;
  data: {
    actions: SuggestedAction[];
    reasoning: string; // AI explanation
  };
}

// POST /api/prospects/[id]/actions
interface CreateActionRequest {
  prospectId: string;
  actionType: 'call' | 'meeting' | 'email' | 'note';
  description: string;
  scheduledDate?: Date;
  metadata?: Record<string, any>;
}
```

**Type Definitions**:
```typescript
interface Prospect {
  id: string;
  clientId: string;
  name: string;
  company: string;
  role?: string;
  estimatedWealth: number;
  
  // Lead Scoring
  leadScore: number;
  scoreComponents: {
    signalStrength: number;
    recency: number;
    relationshipProximity: number;
    walletPotential: number;
  };
  
  // Latest Signal
  latestSignal: {
    type: SignalType;
    source: string;
    detectedAt: Date;
    description: string;
    confidence: number;
  };
  
  // Relationship Context
  relationshipPath?: {
    length: number;
    intermediaries: string[];
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
}

interface SuggestedAction {
  id: string;
  type: 'call' | 'meeting' | 'email' | 'review-portfolio' | 'custom';
  label: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  estimatedImpact: 'high' | 'medium' | 'low';
  suggestedBy: 'ai' | 'rule-based' | 'manual';
  metadata?: {
    talking_points?: string[];
    context_notes?: string[];
    best_time?: string;
  };
}

type SignalType = 'ipo' | 'funding' | 'merger' | 'acquisition' | 'secondary-sale' | 'dividend' | 'exit';
```

## Implementation Requirements

### Core Components

1. **ProspectsView.tsx** - Main container with filtering and stats
   - Server Component for initial data fetch
   - Client boundary for interactive filters
   - Real-time subscription to signals table
   - Infinite scroll implementation

2. **ProspectCard.tsx** - Reusable card component (extend from Story #3)
   - Lead score badge with color coding
   - Signal type indicator
   - Suggested actions display (top 3)
   - Quick action buttons (hover state)
   - Click handler for detail view

3. **FilterBar.tsx** - Advanced filtering interface
   - Signal type multi-select
   - Date range picker
   - Score range slider
   - Sort dropdown (score, recency, signal strength)
   - Clear filters button

4. **SuggestedActions.tsx** - Action recommendation display
   - Priority-based ordering
   - AI reasoning tooltip
   - One-click action execution
   - Track action completion

5. **StatsCards.tsx** - Summary statistics dashboard
   - Total prospects with trend indicator
   - Average lead score with distribution
   - Pending actions with due dates
   - Real-time update animations

### Custom Hooks

1. **useProspects()** - Data fetching and state management
   ```typescript
   function useProspects(filters?: ProspectFilters) {
     const [prospects, setProspects] = useState<Prospect[]>([]);
     const [isLoading, setIsLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [hasMore, setHasMore] = useState(true);
     
     // Initial fetch
     useEffect(() => {
       loadProspects();
     }, [filters]);
     
     return { prospects, isLoading, error, hasMore, loadMore, refresh };
   }
   ```

2. **useProspectsRealtime()** - Real-time updates via Supabase
   ```typescript
   function useProspectsRealtime(rmId: string) {
     useEffect(() => {
       const subscription = supabase
         .channel('signals')
         .on('postgres_changes', 
           { event: '*', schema: 'public', table: 'signals' },
           (payload) => handleRealtimeUpdate(payload)
         )
         .subscribe();
       
       return () => subscription.unsubscribe();
     }, [rmId]);
   }
   ```

3. **useSuggestedActions()** - AI-generated action suggestions
   ```typescript
   function useSuggestedActions(prospectId: string) {
     const [actions, setActions] = useState<SuggestedAction[]>([]);
     const [isLoading, setIsLoading] = useState(true);
     
     // Fetch AI suggestions
     useEffect(() => {
       fetchActions(prospectId);
     }, [prospectId]);
     
     return { actions, isLoading, refreshActions };
   }
   ```

4. **useProspectActions()** - Handle user actions
   ```typescript
   function useProspectActions() {
     const scheduleCall = async (prospectId: string) => { /* ... */ };
     const logNote = async (prospectId: string, note: string) => { /* ... */ };
     const markActionComplete = async (actionId: string) => { /* ... */ };
     
     return { scheduleCall, logNote, markActionComplete };
   }
   ```

### Utility Functions

1. **score-utils.ts** - Lead score calculations
   ```typescript
   export function calculateLeadScore(components: ScoreComponents): number;
   export function getScoreBadgeColor(score: number): string;
   export function getScoreTrend(current: number, previous: number): 'up' | 'down' | 'stable';
   ```

2. **action-generator.ts** - AI action suggestion logic
   ```typescript
   export async function generateActions(
     prospect: Prospect,
     signal: Signal
   ): Promise<SuggestedAction[]>;
   
   export function prioritizeActions(actions: SuggestedAction[]): SuggestedAction[];
   ```

3. **formatters.ts** - Data formatting
   ```typescript
   export function formatLeadScore(score: number): string;
   export function formatSignalType(type: SignalType): string;
   export function formatRelativeTime(date: Date): string;
   export function formatWealth(amount: number): string;
   ```

## Acceptance Criteria

### Functional Requirements

#### 1. Prospect Display & Ranking
- ✅ **AC 1.1**: Main panel displays top 20 prospects ranked by lead score in descending order
- ✅ **AC 1.2**: Each prospect card shows name, company, role, estimated wealth, and lead score badge
- ✅ **AC 1.3**: Latest signal information is visible (type, source, recency indicator)
- ✅ **AC 1.4**: Score badge uses color coding (90-100: green, 75-89: amber, 60-74: blue, <60: gray)

#### 2. Suggested Actions
- ✅ **AC 2.1**: Each prospect card displays top 3 suggested actions based on signal context
- ✅ **AC 2.2**: Actions include type (call, meeting, email, etc.), description, and priority indicator
- ✅ **AC 2.3**: AI reasoning is available via tooltip or expandable section
- ✅ **AC 2.4**: Actions are clickable and trigger appropriate workflow (schedule modal, email composer, etc.)

#### 3. Navigation & Drill-Down
- ✅ **AC 3.1**: Clicking prospect card navigates to detailed client view (`/clients/[id]`)
- ✅ **AC 3.2**: Quick action buttons (call, note) available on card hover
- ✅ **AC 3.3**: Back navigation preserves filter and scroll state
- ✅ **AC 3.4**: Breadcrumb navigation shows current location

#### 4. Dynamic Updates
- ✅ **AC 4.1**: List refreshes automatically when new signals are detected (within 5 minutes)
- ✅ **AC 4.2**: Visual indicator (badge, animation) shows new/updated prospects since last view
- ✅ **AC 4.3**: Manual refresh button available with loading state
- ✅ **AC 4.4**: Real-time updates don't disrupt user's current interaction

#### 5. Filtering & Sorting
- ✅ **AC 5.1**: Filter by signal type (IPO, Funding, M&A, etc.)
- ✅ **AC 5.2**: Filter by date range (last 7 days, 30 days, 90 days, custom)
- ✅ **AC 5.3**: Filter by lead score threshold (minimum score slider)
- ✅ **AC 5.4**: Sort by score, recency, or signal strength
- ✅ **AC 5.5**: Active filters are visually indicated with clear/reset option

### Non-Functional Requirements

#### Performance
- ✅ **NFR-1**: Initial page load < 2 seconds (with top 20 prospects)
- ✅ **NFR-2**: Card interaction response < 200ms
- ✅ **NFR-3**: Real-time update latency < 5 seconds from signal detection
- ✅ **NFR-4**: Infinite scroll triggers at 80% scroll depth, loads next 20 prospects
- ✅ **NFR-5**: Bundle size increase < 75KB (with code splitting)

#### Accessibility
- ✅ **NFR-6**: WCAG 2.1 AA compliance (color contrast, focus states)
- ✅ **NFR-7**: Full keyboard navigation support (Tab, Enter, Arrow keys)
- ✅ **NFR-8**: Screen reader compatibility (ARIA labels, semantic HTML)
- ✅ **NFR-9**: Focus trapping in modals and drawers

#### Security
- ✅ **NFR-10**: Row-Level Security enforced (RMs see only their clients)
- ✅ **NFR-11**: Action logging with audit trail (who, what, when)
- ✅ **NFR-12**: Rate limiting on API endpoints (100 req/min per RM)
- ✅ **NFR-13**: Input sanitization on all user-provided data

#### Usability
- ✅ **NFR-14**: Mobile-responsive design (single column on <768px)
- ✅ **NFR-15**: Optimistic UI updates (action feedback before API confirmation)
- ✅ **NFR-16**: Error states with actionable messages
- ✅ **NFR-17**: Loading skeletons for perceived performance

## Modified Files

```
app/(dashboard)/
├── page.tsx ⬜                          # Top Prospects page (NEW)
├── components/
│   ├── ProspectsView.tsx ⬜              # Main view container (NEW)
│   ├── ProspectCard.tsx 🔄              # Extend from Story #3
│   ├── FilterBar.tsx ⬜                  # Filter controls (NEW)
│   ├── StatsCards.tsx ⬜                 # Summary stats (NEW)
│   ├── SuggestedActions.tsx ⬜           # Action display (NEW)
│   ├── LoadMoreTrigger.tsx ⬜            # Infinite scroll (NEW)
│   └── hooks/
│       ├── useProspects.ts ⬜            # Data fetching (NEW)
│       ├── useProspectsRealtime.ts ⬜   # Real-time updates (NEW)
│       ├── useSuggestedActions.ts ⬜    # AI actions (NEW)
│       └── useProspectActions.ts ⬜     # User actions (NEW)
│
├── api/
│   ├── prospects/
│   │   ├── route.ts ⬜                   # GET prospects list (NEW)
│   │   └── [id]/
│   │       └── actions/route.ts ⬜      # GET/POST actions (NEW)
│   └── realtime/
│       └── subscribe.ts ⬜               # SSE endpoint (NEW)
│
├── lib/
│   ├── api/
│   │   └── prospects-api.ts ⬜           # API client (NEW)
│   └── utils/
│       ├── score-utils.ts ⬜             # Score calculations (NEW)
│       ├── action-generator.ts ⬜        # AI action logic (NEW)
│       └── formatters.ts 🔄             # Extend with prospect formatters
│
├── types/
│   └── index.ts 🔄                      # Add Prospect, SuggestedAction types
│
└── store/
    └── prospects-store.ts ⬜             # Zustand store (NEW)
```

**Legend**:
- ⬜ = New file to create
- 🔄 = Existing file to modify

## Implementation Status

**OVERALL STATUS**: ⬜ NOT STARTED

### Phase 1: Foundation & Setup (Estimated: 2-3 days)
- ⬜ Set up project structure and routing (`app/(dashboard)/page.tsx`)
- ⬜ Define TypeScript types (`Prospect`, `SuggestedAction`, `ProspectFilters`)
- ⬜ Create API routes (`/api/prospects`, `/api/prospects/[id]/actions`)
- ⬜ Set up Supabase tables and RLS policies
- ⬜ Configure Zustand store for prospects state
- ⬜ Create base UI components (FilterBar, StatsCards, LoadMoreTrigger)

### Phase 2: Core Implementation (Estimated: 4-5 days)
- ⬜ Implement ProspectsView container component (Server Component)
- ⬜ Extend ProspectCard component with suggested actions display
- ⬜ Build `useProspects()` hook for data fetching
- ⬜ Implement `useSuggestedActions()` hook with AI integration
- ⬜ Add filtering logic (signal type, date range, score threshold)
- ⬜ Implement sorting (score, recency, signal strength)
- ⬜ Create action handlers (schedule call, log note, etc.)
- ⬜ Build infinite scroll mechanism with LoadMoreTrigger

### Phase 3: Real-Time & Enhanced Features (Estimated: 3-4 days)
- ⬜ Implement Supabase Realtime subscriptions (`useProspectsRealtime`)
- ⬜ Add real-time update indicators (badges, animations)
- ⬜ Build AI action generator service (OpenAI integration)
- ⬜ Implement action priority algorithm
- ⬜ Add optimistic UI updates for user actions
- ⬜ Create manual refresh functionality
- ⬜ Implement state persistence (filters, scroll position)

### Phase 4: Polish & Testing (Estimated: 2-3 days)
- ⬜ Implement responsive design (mobile, tablet, desktop)
- ⬜ Add accessibility features (keyboard nav, ARIA labels)
- ⬜ Implement error handling and loading states
- ⬜ Add skeleton loaders for perceived performance
- ⬜ Performance optimization (memoization, code splitting)
- ⬜ Write unit tests (hooks, utilities)
- ⬜ Write integration tests (component interactions)
- ⬜ E2E tests (complete user workflow)

**Total Estimated Time**: 11-15 days

## Dependencies

### Internal Dependencies (Blockers)
- **Story #1**: Early liquidity signals detection system (must be operational)
- **Story #2**: Lead scoring system with explainability (required for ranking)
- **Story #3**: ProspectCard component (base component to extend)
- **Authentication system**: Supabase Auth with RLS configured
- **Design system**: UI components (Button, Card, Badge, etc.)

### External Dependencies
- **Supabase**: Database tables and RLS policies configured
- **Neo4j Aura**: Relationship graph data available
- **OpenAI API**: GPT-4 access for action suggestions
- **Vercel**: Deployment environment set up

### Optional Dependencies (Can Work Around)
- **Fireflies.ai**: Meeting intelligence (enhances action context)
- **OneDrive**: Voice notes storage (enriches prospect context)

## Risk Assessment

### Technical Risks

#### 1. Real-Time Update Performance
- **Impact**: High (affects core user experience)
- **Probability**: Medium
- **Mitigation**: 
  - Use Supabase Realtime with connection pooling
  - Implement debouncing for rapid updates
  - Add client-side caching with SWR
- **Contingency**: 
  - Fall back to polling every 30 seconds
  - Manual refresh button as alternative

#### 2. AI Action Generation Latency
- **Impact**: Medium (affects perceived intelligence)
- **Probability**: Medium
- **Mitigation**:
  - Pre-generate actions for top prospects via background job
  - Cache AI responses for 1 hour
  - Show loading skeleton while fetching
- **Contingency**:
  - Rule-based action suggestions as fallback
  - Display generic actions immediately, replace with AI suggestions

#### 3. Infinite Scroll Performance with Large Datasets
- **Impact**: Medium (affects usability for RMs with many clients)
- **Probability**: Low
- **Mitigation**:
  - Implement virtual scrolling (react-window)
  - Server-side pagination with efficient indexes
  - Limit to top 100 prospects with "View All" option
- **Contingency**:
  - Traditional pagination as fallback
  - "Load More" button instead of infinite scroll

### Business Risks

#### 1. Low Adoption of Suggested Actions
- **Impact**: High (core value proposition)
- **Probability**: Medium
- **Mitigation**:
  - A/B test different action formats
  - Collect feedback on action relevance
  - Iterate on AI prompts based on RM feedback
- **Contingency**:
  - Allow RMs to customize action templates
  - Provide manual action creation workflow

#### 2. Data Quality Issues (Missing Signals)
- **Impact**: High (leads to incomplete rankings)
- **Probability**: Medium
- **Mitigation**:
  - Multi-source data aggregation
  - Manual intelligence input option
  - Data validation rules
- **Contingency**:
  - Clearly indicate data confidence levels
  - Allow RMs to flag data issues

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

```typescript
// 1. Lead Score Calculation
describe('calculateLeadScore', () => {
  it('should calculate correct weighted score', () => {
    const components = {
      signalStrength: 85,
      recency: 90,
      relationshipProximity: 70,
      walletPotential: 95
    };
    const score = calculateLeadScore(components);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
  
  it('should return 0 for missing components', () => {
    const score = calculateLeadScore({});
    expect(score).toBe(0);
  });
});

// 2. useProspects Hook
describe('useProspects', () => {
  it('should fetch prospects on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useProspects());
    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.prospects).toHaveLength(20);
    expect(result.current.isLoading).toBe(false);
  });
  
  it('should filter prospects by signal type', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      useProspects({ signalTypes: ['ipo', 'funding'] })
    );
    await waitForNextUpdate();
    expect(result.current.prospects.every(p => 
      ['ipo', 'funding'].includes(p.latestSignal.type)
    )).toBe(true);
  });
});

// 3. ProspectCard Component
describe('ProspectCard', () => {
  it('should render prospect information correctly', () => {
    const prospect = mockProspect({ leadScore: 92 });
    render(<ProspectCard prospect={prospect} />);
    
    expect(screen.getByText(prospect.name)).toBeInTheDocument();
    expect(screen.getByText('92')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /schedule call/i })).toBeInTheDocument();
  });
  
  it('should call onCardClick when clicked', () => {
    const handleClick = jest.fn();
    const prospect = mockProspect();
    render(<ProspectCard prospect={prospect} onCardClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('article'));
    expect(handleClick).toHaveBeenCalledWith(prospect);
  });
});
```

### Integration Tests

```typescript
describe('Prospects View Integration', () => {
  it('should display filtered and sorted prospects', async () => {
    render(<ProspectsView />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(20);
    });
    
    // Apply filter
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);
    fireEvent.click(screen.getByText('IPO'));
    
    // Verify filtered results
    await waitFor(() => {
      const cards = screen.getAllByRole('article');
      expect(cards.length).toBeLessThanOrEqual(20);
    });
  });
  
  it('should load more prospects on scroll', async () => {
    render(<ProspectsView />);
    
    // Initial load
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(20);
    });
    
    // Scroll to trigger load more
    const trigger = screen.getByTestId('load-more-trigger');
    fireEvent.scroll(trigger);
    
    // Verify more prospects loaded
    await waitFor(() => {
      expect(screen.getAllByRole('article').length).toBeGreaterThan(20);
    });
  });
  
  it('should update real-time when new signal arrives', async () => {
    render(<ProspectsView />);
    
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(20);
    });
    
    // Simulate real-time update
    act(() => {
      emitRealtimeEvent({
        type: 'INSERT',
        table: 'signals',
        record: mockSignal({ clientId: 'test-123' })
      });
    });
    
    // Verify new prospect appears
    await waitFor(() => {
      expect(screen.getByTestId('new-prospect-badge')).toBeInTheDocument();
    });
  });
});
```

### E2E Tests (Playwright)

```typescript
test.describe('Top Prospects Workflow', () => {
  test('RM can view and interact with top prospects', async ({ page }) => {
    // Login as RM
    await page.goto('/login');
    await page.fill('[name="email"]', 'rm@kairoscapital.mu');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to prospects page (dashboard home)
    await page.waitForURL('**/dashboard');
    await expect(page.locator('h1')).toContainText('Top Prospects');
    
    // Verify prospects are displayed
    const cards = page.locator('[data-testid="prospect-card"]');
    await expect(cards).toHaveCount(20);
    
    // Verify lead scores are visible
    const firstCard = cards.first();
    await expect(firstCard.locator('[data-testid="lead-score"]')).toBeVisible();
    
    // Click on suggested action
    await firstCard.locator('button:has-text("Schedule Call")').click();
    
    // Verify action modal opens
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Schedule Call');
    
    // Complete action
    await page.fill('[name="date"]', '2025-12-25');
    await page.fill('[name="notes"]', 'Discuss IPO liquidity event');
    await page.click('button:has-text("Schedule")');
    
    // Verify success message
    await expect(page.locator('.toast-success')).toContainText('Call scheduled successfully');
  });
  
  test('RM can filter prospects by signal type', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Open filter menu
    await page.click('button:has-text("Filters")');
    
    // Select IPO filter
    await page.click('label:has-text("IPO")');
    await page.click('button:has-text("Apply")');
    
    // Verify filtered results
    const cards = page.locator('[data-testid="prospect-card"]');
    const firstCard = cards.first();
    await expect(firstCard.locator('[data-testid="signal-type"]')).toContainText('IPO');
    
    // Verify filter badge is shown
    await expect(page.locator('[data-testid="active-filter"]')).toContainText('IPO');
  });
  
  test('RM can drill down to prospect detail', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click on first prospect card
    const firstCard = page.locator('[data-testid="prospect-card"]').first();
    const prospectName = await firstCard.locator('h3').textContent();
    await firstCard.click();
    
    // Verify navigation to detail page
    await page.waitForURL('**/clients/*');
    await expect(page.locator('h1')).toContainText(prospectName);
    
    // Verify back button returns to prospects list
    await page.click('button:has-text("Back")');
    await page.waitForURL('**/dashboard');
    await expect(page.locator('h1')).toContainText('Top Prospects');
  });
});
```

## Performance Considerations

### Bundle Optimization
- **Code splitting**: Dynamic imports for heavy components (Chart, Graph)
  ```typescript
  const RelationshipGraph = dynamic(() => import('./RelationshipGraph'), {
    loading: () => <GraphSkeleton />,
    ssr: false
  });
  ```
- **Tree shaking**: Import only used Radix UI components
- **Asset optimization**: Compress images, use WebP format
- **Font loading**: Preload Playfair Display and Inter fonts

### Runtime Performance
- **Memoization**: Use `React.memo()` for ProspectCard to prevent unnecessary re-renders
  ```typescript
  export const ProspectCard = memo(function ProspectCard({ prospect }: Props) {
    // Component logic
  });
  ```
- **Virtualization**: Implement virtual scrolling for 100+ prospects
- **Debouncing**: Debounce filter inputs (300ms delay)
- **Optimistic updates**: Update UI immediately, sync with server in background

### Caching Strategy
- **API response caching**: SWR with 5-minute cache for prospects list
  ```typescript
  const { data, error } = useSWR(
    `/api/prospects?filters=${JSON.stringify(filters)}`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  );
  ```
- **Client-side state**: Persist filters and scroll position in sessionStorage
- **CDN caching**: Static assets cached with 1-year TTL
- **Database caching**: Redis cache for frequent queries (lead scores)

### Performance Budget
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Initial Load (FCP) | < 1.5s | TBD | ⬜ |
| Time to Interactive (TTI) | < 2.5s | TBD | ⬜ |
| Largest Contentful Paint (LCP) | < 2.0s | TBD | ⬜ |
| First Input Delay (FID) | < 100ms | TBD | ⬜ |
| Cumulative Layout Shift (CLS) | < 0.1 | TBD | ⬜ |
| Bundle Size (JS) | < 200KB | TBD | ⬜ |
| API Response Time (p95) | < 500ms | TBD | ⬜ |

## Deployment Plan

### Development Phase (Week 1-2)
1. **Environment Setup**
   - Create feature branch: `feature/story-04-top-prospects`
   - Set up local Supabase instance
   - Configure environment variables
   - Enable feature flag: `ENABLE_TOP_PROSPECTS=true`

2. **Iterative Development**
   - Daily commits with descriptive messages
   - Code reviews via GitHub PRs
   - Unit tests written alongside components
   - Integration tests added for user flows

3. **Local Testing**
   - Test with mock data (20-100 prospects)
   - Verify real-time updates with Supabase Studio
   - Performance profiling with React DevTools
   - Accessibility audit with axe-core

### Staging Phase (Week 3)
1. **Staging Deployment**
   - Merge to `staging` branch
   - Deploy to Vercel staging environment
   - Run automated test suite (Jest, Playwright)
   - Performance testing with Lighthouse CI

2. **User Acceptance Testing**
   - Invite 3-5 RMs for beta testing
   - Collect feedback via in-app survey
   - Monitor error rates with Sentry
   - Review analytics (Mixpanel/GA4)

3. **Bug Fixes & Refinements**
   - Address critical bugs (P0)
   - Optimize based on performance metrics
   - Improve based on user feedback
   - Update documentation

### Production Phase (Week 4)
1. **Pre-Launch Checks**
   - ✅ All tests passing (100% of critical paths)
   - ✅ Performance budget met (Core Web Vitals)
   - ✅ Security audit completed (no high-severity issues)
   - ✅ Documentation updated (README, API docs)
   - ✅ Rollback plan prepared

2. **Gradual Rollout**
   - **Phase 1** (Day 1-2): Enable for 10% of RMs (3-4 users)
   - **Phase 2** (Day 3-4): Enable for 50% of RMs (15-17 users)
   - **Phase 3** (Day 5-7): Enable for 100% of RMs (30-35 users)
   - Monitor key metrics at each phase

3. **Monitoring & Support**
   - Real-time error monitoring (Sentry alerts)
   - Performance monitoring (Vercel Analytics)
   - User behavior tracking (Mixpanel)
   - Support channel (Slack #rm-support)

4. **Rollback Procedures**
   - **Trigger**: Error rate > 5% OR performance degradation > 20%
   - **Action**: Disable feature flag `ENABLE_TOP_PROSPECTS=false`
   - **Timeline**: Rollback within 15 minutes of detection
   - **Communication**: Notify RMs via email and in-app banner

## Monitoring & Analytics

### Performance Metrics (Vercel Analytics + Datadog)
| Metric | Target | Alert Threshold | Dashboard |
|--------|--------|-----------------|-----------|
| Page Load Time (P95) | < 2.0s | > 3.0s | Real-time |
| API Response Time (P95) | < 500ms | > 1.0s | Real-time |
| Real-time Update Latency | < 5s | > 10s | Hourly |
| Error Rate | < 1% | > 5% | Real-time |
| Uptime | 99.9% | < 99.5% | 24/7 |

### Business Metrics (Mixpanel)
| Metric | Target | Measurement Period | Owner |
|--------|--------|-------------------|-------|
| Daily Active RMs | 80% (24/30) | Daily | Product Manager |
| Prospects Viewed per Session | Avg 15 | Weekly | Product Manager |
| Actions Taken per Week | Avg 10 per RM | Weekly | Business Lead |
| Action Completion Rate | 70% | Monthly | Business Lead |
| Time to First Action | < 2 min | Per session | UX Lead |
| Filter Usage Rate | 60% | Weekly | Product Manager |

### User Engagement Tracking
```typescript
// Track key user interactions
analytics.track('Prospect Viewed', {
  prospectId: prospect.id,
  leadScore: prospect.leadScore,
  signalType: prospect.latestSignal.type,
  rmId: user.id,
  source: 'top_prospects_page'
});

analytics.track('Action Taken', {
  actionType: action.type,
  prospectId: prospect.id,
  suggestedBy: action.suggestedBy, // 'ai' | 'rule-based' | 'manual'
  priority: action.priority,
  rmId: user.id
});

analytics.track('Filter Applied', {
  filterType: filter.type,
  filterValue: filter.value,
  resultsCount: filteredProspects.length,
  rmId: user.id
});
```

### Error Tracking (Sentry)
- **Critical Errors**: API failures, authentication issues, data corruption
- **Warnings**: Real-time connection drops, slow queries, cache misses
- **Breadcrumbs**: User actions leading to errors (for debugging)
- **Release Tracking**: Tag errors by deployment version

## Documentation Requirements

### Technical Documentation

1. **API Documentation** (`/docs/api/prospects.md`)
   ```markdown
   # Prospects API
   
   ## GET /api/prospects
   Fetch paginated list of prospects for authenticated RM.
   
   ### Request
   ```json
   {
     "filters": {
       "signalTypes": ["ipo", "funding"],
       "minScore": 75,
       "dateRange": { "start": "2025-12-01", "end": "2025-12-31" }
     },
     "sort": "score",
     "page": 1,
     "pageSize": 20
   }
   ```
   
   ### Response
   [Full API spec with examples]
   ```

2. **Component Documentation** (`/app/components/README.md`)
   - ProspectCard props and usage examples
   - FilterBar configuration options
   - SuggestedActions customization
   - Hook usage patterns

3. **Architecture Decision Records** (`/docs/adr/004-top-prospects-implementation.md`)
   - Why Server Components for initial render?
   - Why Supabase Realtime over WebSockets?
   - Why infinite scroll over traditional pagination?

### User Documentation

1. **Feature Guide** (`/docs/user-guides/top-prospects.md`)
   - How to interpret lead scores
   - Understanding suggested actions
   - Using filters effectively
   - Best practices for follow-ups

2. **Training Materials**
   - Video walkthrough (5-minute demo)
   - Quick reference card (PDF)
   - FAQ document

3. **Release Notes** (`CHANGELOG.md`)
   ```markdown
   ## [1.4.0] - 2025-12-20
   
   ### Added
   - Top Prospects page with AI-suggested actions
   - Real-time prospect updates
   - Advanced filtering (signal type, date, score)
   - Infinite scroll for large prospect lists
   
   ### Changed
   - Improved ProspectCard design with action buttons
   - Enhanced lead score badge with color coding
   
   ### Fixed
   - Real-time update latency issue
   ```

## Post-Launch Review

### Success Criteria (30 Days Post-Launch)

#### User Adoption
- ✅ **Target**: 80% of RMs use Top Prospects page daily (24/30 RMs)
- ✅ **Measurement**: Mixpanel daily active users
- ✅ **Current**: TBD

#### Performance
- ✅ **Target**: P95 load time < 2.0 seconds
- ✅ **Measurement**: Vercel Analytics
- ✅ **Current**: TBD

#### Business Impact
- ✅ **Target**: 70% of suggested actions are acted upon within 48 hours
- ✅ **Measurement**: Action completion tracking in database
- ✅ **Current**: TBD

#### User Satisfaction
- ✅ **Target**: NPS score > 40 for this feature
- ✅ **Measurement**: In-app survey
- ✅ **Current**: TBD

### Retrospective Items (To Be Completed Post-Launch)

#### What Went Well
- [ ] TBD - Document successes after launch

#### What Could Be Improved
- [ ] TBD - Document challenges and learnings

#### Action Items for Future Stories
- [ ] TBD - Process improvements for next iteration

### Future Enhancements (Backlog)

#### Phase 2 Features (Post-MVP)
- [ ] Custom action templates per RM (personalization)
- [ ] Bulk actions (schedule calls for multiple prospects)
- [ ] AI chatbot integration (ask questions about prospects)
- [ ] Export to CRM (sync with external systems)
- [ ] Mobile app support (iOS/Android)

#### Advanced Analytics
- [ ] Conversion funnel analysis (prospect → client)
- [ ] Action effectiveness scoring (which actions convert best)
- [ ] RM performance benchmarking
- [ ] Predictive modeling (churn risk, upsell probability)

#### Workflow Automation
- [ ] Auto-schedule calls based on RM availability
- [ ] Auto-generate meeting agendas from signals
- [ ] Automated follow-up reminders
- [ ] Smart email templates with signal context

---

## Implementation Checklist

Before starting development:
- [ ] Read and understand all related user stories (1, 2, 3)
- [ ] Review design system guidelines
- [ ] Set up development environment
- [ ] Confirm database schema is ready
- [ ] Verify API authentication is working
- [ ] Review performance budget targets

During development:
- [ ] Follow TypeScript strict mode
- [ ] Write tests alongside components (TDD approach)
- [ ] Use design system components (no custom styling)
- [ ] Implement accessibility from the start
- [ ] Add meaningful commit messages
- [ ] Request code reviews early and often

Before deployment:
- [ ] All acceptance criteria met
- [ ] Test suite passing (100% critical paths)
- [ ] Performance budget met (Lighthouse score > 90)
- [ ] Accessibility audit passed (axe-core)
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Rollback plan documented
- [ ] Stakeholder approval obtained

---

**Plan Version**: 1.0.0  
**Created**: 2025-12-19  
**Author**: Implementation Planning AI  
**Status**: Ready for Development  
**Estimated Effort**: 11-15 days (1 developer)

**Next Steps**:
1. Review this plan with Product Manager and Tech Lead
2. Create development branch: `feature/story-04-top-prospects`
3. Break down Phase 1 tasks into GitHub Issues
4. Schedule kick-off meeting with development team
5. Begin implementation following Phase 1 → Phase 4 sequence

# [02] View Lead Scores with Explanations - Implementation Planning

## Project Context
**Technical Stack**: Next.js 15 (App Router), React 18, TypeScript, TailwindCSS, Radix UI
**Backend**: Supabase (PostgreSQL), Neo4j Aura (Graph DB)
**AI/LLM**: OpenAI GPT-4 / Vercel AI SDK
**Infrastructure**: Vercel (Frontend), Supabase (Backend), Neo4j Aura (Graph)

## User Story

As a Relationship Manager, I want to see lead scores for each prospect with clear explanations of why the score was assigned, so that I can prioritize the right clients and understand the reasoning behind each recommendation.

## Pre-conditions

- User is authenticated as a Relationship Manager
- Client/prospect data exists in Supabase database
- Liquidity signals are being tracked and aggregated (Story #1 dependency)
- Signal detection system is operational and feeding data
- Graph database contains relationship and entity connections

## Business Requirements

- Display numerical lead scores (0-100 scale) for each prospect
- Provide clear, human-readable explanations for each score
- Show contributing signals and their individual weights
- Enable RMs to understand score composition at a glance
- Help RMs prioritize which clients to engage and when
- Success Metric: 90% of RMs report understanding score reasoning without additional clarification
- Success Metric: Average time to identify top 5 prospects < 30 seconds

## Technical Specifications

### Integration Points
- **Authentication**: Supabase Auth (JWT-based)
- **Database**: Supabase PostgreSQL for client data, scores, and signals
- **Graph Database**: Neo4j for relationship mapping and signal connections
- **AI/LLM**: OpenAI GPT-4 for natural language explanations
- **Caching**: Next.js built-in caching + Redis (future enhancement)

### Security Requirements
- JWT authentication for all API routes
- Row-level security (RLS) in Supabase - RMs see only their assigned clients
- API rate limiting for score calculations
- Audit logging for score access and changes
- Encryption of sensitive client data at rest and in transit

### Data Schema

```typescript
// Supabase PostgreSQL Schema
interface Client {
  id: string; // UUID
  name: string;
  company: string;
  estimated_wealth: number;
  rm_id: string; // Assigned RM
  created_at: Date;
  updated_at: Date;
}

interface LeadScore {
  id: string;
  client_id: string;
  score: number; // 0-100
  score_category: 'HOT' | 'WARM' | 'COLD'; // >80, 50-80, <50
  calculated_at: Date;
  expires_at: Date; // Scores valid for 24 hours
  factors: ScoreFactor[];
  explanation: string; // AI-generated summary
}

interface ScoreFactor {
  signal_id: string;
  signal_type: 'IPO' | 'M&A' | 'FUNDING' | 'BOARD_CHANGE' | 'MEDIA_MENTION';
  signal_description: string;
  weight: number; // 0-1 (normalized contribution)
  points_contributed: number; // Actual points added to score
  recency_days: number; // How recent is this signal
  confidence: number; // 0-1 (signal reliability)
  source: string; // Where signal originated
}

interface LiquiditySignal {
  id: string;
  client_id: string;
  type: string;
  description: string;
  detected_at: Date;
  strength: number; // 0-100
  confidence: number; // 0-1
  source: string;
  metadata: Record<string, any>;
}
```

## Design Specifications

### Visual Layout & Components

**Main Layout Structure**:
```
[Header - Fixed]
├── Logo + Navigation
└── RM Profile Menu

[Main Content Area]
├── Filters Bar (Sticky)
│   ├── Score Range Slider (0-100)
│   ├── Category Pills (HOT/WARM/COLD)
│   └── Sort Dropdown (Score, Recent Activity, Name)
│
└── Clients Grid (Responsive)
    ├── ClientCard (Premium Card Style)
    │   ├── [Client Header]
    │   │   ├── Avatar + Name
    │   │   ├── Company + Wealth
    │   │   └── Lead Score Badge
    │   │
    │   ├── [Score Visualization]
    │   │   ├── Circular Progress (Score/100)
    │   │   ├── Category Label (HOT/WARM/COLD)
    │   │   └── Score Trend Icon (↑↓→)
    │   │
    │   ├── [Score Explanation]
    │   │   ├── AI Summary (2-3 lines)
    │   │   └── "View Details" Link
    │   │
    │   └── [Quick Actions]
    │       ├── Schedule Call Button
    │       └── View Full Profile Link
    │
    └── [Pagination/Infinite Scroll]

[Score Detail Modal - On Click]
├── [Header]
│   ├── Client Name + Company
│   ├── Score Badge (Large)
│   └── Last Calculated Time
│
├── [Score Breakdown]
│   ├── Contributing Factors List
│   │   └── FactorCard (per signal)
│   │       ├── Signal Icon + Type
│   │       ├── Description
│   │       ├── Points Contributed (visual bar)
│   │       ├── Weight % of total
│   │       ├── Recency (X days ago)
│   │       └── Confidence Indicator
│   │
│   └── Score Composition Chart (Donut/Bar)
│
├── [AI Explanation]
│   └── Natural language summary with reasoning
│
└── [Actions]
    ├── Recalculate Score Button
    ├── Export Details Button
    └── Schedule Follow-up Button
```

**Component Hierarchy**:
```tsx
<DashboardLayout>
  <Header />
  
  <MainContent>
    <FiltersBar>
      <ScoreRangeSlider />
      <CategoryPills />
      <SortDropdown />
    </FiltersBar>
    
    <ClientsGrid>
      {clients.map(client => (
        <ClientCard 
          client={client}
          score={scores[client.id]}
          onCardClick={openScoreDetail}
        >
          <ClientHeader />
          <ScoreVisualization />
          <ScoreExplanation />
          <QuickActions />
        </ClientCard>
      ))}
    </ClientsGrid>
    
    <ScoreDetailModal 
      isOpen={modalOpen}
      client={selectedClient}
      score={selectedScore}
    >
      <ScoreBreakdown />
      <AIExplanation />
      <ActionButtons />
    </ScoreDetailModal>
  </MainContent>
</DashboardLayout>
```

### Design System Compliance

**Color Palette (Premium Wealth Management)**:
```css
/* Lead Score Categories */
--score-hot: #DC3545;          /* Red - urgent, high priority */
--score-hot-bg: #FFF5F5;       /* Light red background */
--score-warm: #FFC107;         /* Amber - medium priority */
--score-warm-bg: #FFFBF0;      /* Light amber background */
--score-cold: #6C757D;         /* Gray - low priority */
--score-cold-bg: #F8F9FA;      /* Light gray background */

/* Primary Wealth Colors */
--primary-deep-blue: #0A1628;
--primary-royal-blue: #1E3A5F;
--primary-accent: #C9A227;      /* Gold accent for premium feel */
--primary-gold: #D4AF37;

/* Background & Surface */
--bg-primary: #FFFFFF;
--bg-secondary: #F8F9FA;
--bg-card: #FFFFFF;
--bg-overlay: rgba(10, 22, 40, 0.95);

/* Text Colors */
--text-primary: #1A1A2E;
--text-secondary: #5A6C7D;
--text-accent: #C9A227;
--text-muted: #8E99A4;
```

**Typography Scale**:
```css
/* Font Families */
--font-heading: 'Playfair Display', Georgia, serif;
--font-body: 'Inter', 'Helvetica Neue', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Lead Score Typography */
.score-large {
  font-family: var(--font-heading);
  font-size: 3rem;      /* 48px */
  font-weight: 700;
  line-height: 1.2;
}

.score-badge {
  font-family: var(--font-mono);
  font-size: 1.5rem;    /* 24px */
  font-weight: 600;
}

.score-explanation {
  font-family: var(--font-body);
  font-size: 0.875rem;  /* 14px */
  line-height: 1.6;
  color: var(--text-secondary);
}

.factor-label {
  font-family: var(--font-body);
  font-size: 0.75rem;   /* 12px */
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### Responsive Behavior

**Breakpoints**:
```css
/* Mobile (< 768px) */
.clients-grid-mobile {
  @apply flex flex-col space-y-4 px-4;
}

.client-card-mobile {
  @apply w-full;
}

/* Tablet (768px - 1023px) */
.clients-grid-tablet {
  @apply grid grid-cols-2 gap-4 px-6;
}

/* Desktop (1024px+) */
.clients-grid-desktop {
  @apply grid grid-cols-3 gap-6 px-8;
}

/* Large Desktop (1440px+) */
.clients-grid-xl {
  @apply grid grid-cols-4 gap-8 px-12;
}
```

**Layout Adaptations**:
```typescript
// Mobile: Stack vertically, hide some details
// Tablet: 2-column grid, abbreviated explanations
// Desktop: 3-column grid, full explanations visible
// XL: 4-column grid, enhanced visualizations

interface ResponsiveConfig {
  mobile: {
    columns: 1;
    showFullExplanation: false;
    cardHeight: 'auto';
  };
  tablet: {
    columns: 2;
    showFullExplanation: false;
    cardHeight: 320;
  };
  desktop: {
    columns: 3;
    showFullExplanation: true;
    cardHeight: 360;
  };
  xl: {
    columns: 4;
    showFullExplanation: true;
    cardHeight: 380;
  };
}
```

### Interaction Patterns

**Score Badge States**:
```typescript
interface ScoreBadgeStates {
  hot: {
    background: 'bg-red-50 border-red-500';
    text: 'text-red-700';
    icon: '🔥';
    glow: 'shadow-red-500/20';
  };
  warm: {
    background: 'bg-amber-50 border-amber-500';
    text: 'text-amber-700';
    icon: '⚡';
    glow: 'shadow-amber-500/20';
  };
  cold: {
    background: 'bg-gray-50 border-gray-400';
    text: 'text-gray-700';
    icon: '❄️';
    glow: 'shadow-gray-500/10';
  };
}
```

**Card Hover Effects**:
```css
.client-card {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: var(--primary-accent);
  }
}

.score-badge {
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}
```

## Technical Architecture

### Component Structure
```
app/
├── (dashboard)/
│   ├── clients/
│   │   ├── page.tsx                    # Main clients list with scores
│   │   ├── [id]/page.tsx               # Individual client detail
│   │   └── components/
│   │       ├── ClientCard.tsx          # Client card with score
│   │       ├── ScoreBadge.tsx          # Score visualization badge
│   │       ├── ScoreExplanation.tsx    # AI explanation display
│   │       ├── ScoreDetailModal.tsx    # Full score breakdown modal
│   │       ├── ScoreBreakdown.tsx      # Factor contributions
│   │       ├── FactorCard.tsx          # Individual signal factor
│   │       ├── FiltersBar.tsx          # Filter/sort controls
│   │       └── hooks/
│   │           ├── useClientScores.ts  # Fetch scores data
│   │           ├── useScoreDetail.ts   # Detailed score logic
│   │           ├── useScoreFilters.ts  # Filter state management
│   │           └── useScoreExplanation.ts # AI explanation fetching
│   │
│   └── layout.tsx
│
├── api/
│   ├── scores/
│   │   ├── route.ts                    # GET all scores, POST calculate
│   │   ├── [clientId]/route.ts         # GET client score
│   │   ├── [clientId]/explain/route.ts # GET AI explanation
│   │   └── recalculate/route.ts        # POST force recalculation
│   │
│   └── clients/
│       └── [id]/route.ts               # Client CRUD operations
│
├── components/
│   └── ui/
│       ├── LeadScore.tsx               # Base score component (exists)
│       ├── Card.tsx                    # Base card component (exists)
│       ├── Badge.tsx                   # Badge component
│       ├── Modal.tsx                   # Modal component
│       ├── Progress.tsx                # Progress bar/circle
│       └── Tooltip.tsx                 # Tooltip component
│
├── lib/
│   ├── scoring/
│   │   ├── calculate-score.ts          # Core scoring algorithm
│   │   ├── score-factors.ts            # Factor definitions & weights
│   │   ├── score-utils.ts              # Utility functions
│   │   └── score-cache.ts              # Caching logic
│   │
│   ├── ai/
│   │   └── explain-score.ts            # AI explanation generation
│   │
│   └── supabase/
│       ├── client.ts                   # Supabase client
│       └── queries.ts                  # Database queries
│
└── types/
    └── score.types.ts                  # Score-related TypeScript types
```

### State Management Architecture

**Global Store Interface** (Zustand):
```typescript
interface ScoreStore {
  // Cached Scores
  scores: Map<string, LeadScore>;
  
  // UI State
  selectedClient: string | null;
  isDetailModalOpen: boolean;
  isCalculating: boolean;
  
  // Filters
  filters: {
    scoreRange: [number, number];
    categories: ('HOT' | 'WARM' | 'COLD')[];
    sortBy: 'score' | 'name' | 'recency';
    sortOrder: 'asc' | 'desc';
  };
  
  // Actions
  setScore: (clientId: string, score: LeadScore) => void;
  openDetailModal: (clientId: string) => void;
  closeDetailModal: () => void;
  updateFilters: (filters: Partial<ScoreFilters>) => void;
  recalculateScore: (clientId: string) => Promise<void>;
}
```

**Local Component State**:
```typescript
// ClientCard component state
interface ClientCardState {
  isHovered: boolean;
  showFullExplanation: boolean;
  isLoadingScore: boolean;
}

// ScoreDetailModal component state
interface ScoreDetailState {
  isLoadingExplanation: boolean;
  selectedFactorId: string | null;
  explanationExpanded: boolean;
}
```

### API Integration Schema

**API Endpoints**:
```typescript
// GET /api/scores - Get all scores for RM's clients
interface GetScoresRequest {
  rm_id?: string;
  category?: 'HOT' | 'WARM' | 'COLD';
  min_score?: number;
  max_score?: number;
  limit?: number;
  offset?: number;
}

interface GetScoresResponse {
  success: boolean;
  data: {
    scores: LeadScore[];
    total: number;
    has_more: boolean;
  };
}

// GET /api/scores/[clientId] - Get specific client score
interface GetScoreResponse {
  success: boolean;
  data: {
    score: LeadScore;
    history: ScoreHistory[];
  };
}

// GET /api/scores/[clientId]/explain - Get AI explanation
interface GetExplanationRequest {
  clientId: string;
  language?: 'en' | 'hi' | 'mr'; // English, Hindi, Marathi
}

interface GetExplanationResponse {
  success: boolean;
  data: {
    explanation: string;
    key_factors: string[];
    recommendation: string;
    next_steps: string[];
  };
}

// POST /api/scores/recalculate - Force score recalculation
interface RecalculateScoreRequest {
  client_id: string;
  force?: boolean; // Bypass cache
}

interface RecalculateScoreResponse {
  success: boolean;
  data: {
    score: LeadScore;
    calculation_time_ms: number;
  };
}
```

### Scoring Algorithm

**Core Scoring Logic**:
```typescript
/**
 * Calculate lead score based on liquidity signals
 * Score = Σ(Signal Strength × Weight × Recency Factor × Confidence)
 */
interface ScoringWeights {
  IPO_FILING: 0.30;        // 30% weight
  M&A_RUMOR: 0.25;         // 25% weight
  FUNDING_ROUND: 0.20;     // 20% weight
  BOARD_CHANGE: 0.15;      // 15% weight
  MEDIA_MENTION: 0.10;     // 10% weight
}

/**
 * Recency decay factor
 * Signals lose value over time
 */
function calculateRecencyFactor(daysOld: number): number {
  // Linear decay over 90 days
  // Day 0 = 1.0, Day 90 = 0.1
  const maxDays = 90;
  const minFactor = 0.1;
  
  if (daysOld === 0) return 1.0;
  if (daysOld >= maxDays) return minFactor;
  
  return 1.0 - ((1.0 - minFactor) * (daysOld / maxDays));
}

/**
 * Main score calculation
 */
async function calculateLeadScore(clientId: string): Promise<LeadScore> {
  // 1. Fetch all signals for client
  const signals = await fetchClientSignals(clientId);
  
  // 2. Calculate individual contributions
  const factors: ScoreFactor[] = signals.map(signal => {
    const weight = SCORING_WEIGHTS[signal.type];
    const recencyFactor = calculateRecencyFactor(
      daysSince(signal.detected_at)
    );
    
    const contribution = 
      signal.strength * 
      weight * 
      recencyFactor * 
      signal.confidence;
    
    return {
      signal_id: signal.id,
      signal_type: signal.type,
      signal_description: signal.description,
      weight,
      points_contributed: contribution * 100, // Convert to 0-100 scale
      recency_days: daysSince(signal.detected_at),
      confidence: signal.confidence,
      source: signal.source,
    };
  });
  
  // 3. Sum total score
  const totalScore = factors.reduce(
    (sum, factor) => sum + factor.points_contributed,
    0
  );
  
  // 4. Normalize to 0-100 range
  const normalizedScore = Math.min(100, Math.max(0, totalScore));
  
  // 5. Determine category
  const category = 
    normalizedScore >= 80 ? 'HOT' :
    normalizedScore >= 50 ? 'WARM' :
    'COLD';
  
  // 6. Generate AI explanation
  const explanation = await generateScoreExplanation(
    clientId,
    normalizedScore,
    factors
  );
  
  return {
    id: generateUUID(),
    client_id: clientId,
    score: normalizedScore,
    score_category: category,
    calculated_at: new Date(),
    expires_at: addHours(new Date(), 24),
    factors,
    explanation,
  };
}
```

## Implementation Requirements

### Core Components

1. **ClientCard.tsx** - Premium card displaying client with score
2. **ScoreBadge.tsx** - Circular progress badge for score visualization
3. **ScoreExplanation.tsx** - AI-generated explanation display
4. **ScoreDetailModal.tsx** - Full breakdown modal with all factors
5. **ScoreBreakdown.tsx** - Visual breakdown of score composition
6. **FactorCard.tsx** - Individual signal contribution card
7. **FiltersBar.tsx** - Score range, category, and sort controls

### Custom Hooks

1. **useClientScores()** - Fetch and cache scores for multiple clients
2. **useScoreDetail()** - Detailed score data with history
3. **useScoreFilters()** - Filter and sort state management
4. **useScoreExplanation()** - AI explanation fetching with caching
5. **useScoreCalculation()** - Trigger score recalculation

### Utility Functions

1. **calculate-score.ts** - Core scoring algorithm implementation
2. **score-factors.ts** - Signal weights and factor definitions
3. **score-utils.ts** - Normalization, categorization helpers
4. **explain-score.ts** - AI explanation generation with OpenAI
5. **score-cache.ts** - Caching and invalidation logic

### API Routes

1. **/api/scores/route.ts** - List scores with filtering
2. **/api/scores/[clientId]/route.ts** - Get specific score
3. **/api/scores/[clientId]/explain/route.ts** - Get AI explanation
4. **/api/scores/recalculate/route.ts** - Force recalculation

## Acceptance Criteria

### Functional Requirements

#### 1. Score Display
- ✅ Each client card displays a prominent lead score (0-100)
- ✅ Score is categorized as HOT (≥80), WARM (50-79), or COLD (<50)
- ✅ Category uses distinct colors (red, amber, gray)
- ✅ Score includes visual indicator (circular progress or badge)
- ✅ Score shows last calculated time

#### 2. Score Explanation
- ✅ Each score has a brief AI-generated explanation (2-3 sentences)
- ✅ Explanation summarizes key contributing factors
- ✅ "View Details" link opens full breakdown modal
- ✅ Explanation is generated in RM's preferred language (EN/HI/MR)

#### 3. Score Breakdown
- ✅ Detail modal shows all contributing signals
- ✅ Each factor displays:
  - Signal type and description
  - Points contributed to total
  - Weight percentage
  - Recency (days old)
  - Confidence level
- ✅ Visual chart shows factor composition (donut or bar chart)
- ✅ Total score calculation is transparent and verifiable

#### 4. Filtering & Sorting
- ✅ Filter by score range (0-100 slider)
- ✅ Filter by category (HOT/WARM/COLD pills)
- ✅ Sort by score (high to low, low to high)
- ✅ Sort by recent activity
- ✅ Sort by client name (A-Z, Z-A)

#### 5. Real-time Updates
- ✅ Scores refresh automatically when new signals detected
- ✅ Score cache expires after 24 hours
- ✅ Manual recalculation available via button
- ✅ Loading states during calculation

### Non-Functional Requirements

#### Performance
- Initial page load < 2 seconds
- Score calculation < 500ms per client
- AI explanation generation < 2 seconds
- Smooth animations at 60fps
- Support for 500+ clients without performance degradation

#### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation for all interactive elements
- Screen reader announcements for score changes
- Color-blind friendly color palette
- Focus indicators on all focusable elements

#### Security
- Row-level security: RMs see only assigned clients
- API authentication via JWT
- Input sanitization for all user inputs
- Rate limiting on score calculation endpoints
- Audit log for score access

#### Scalability
- Horizontal scaling support for API routes
- Score caching to reduce database load
- Lazy loading for client lists (pagination/infinite scroll)
- Efficient database queries with proper indexes

## Modified Files

```
app/
├── (dashboard)/
│   ├── clients/
│   │   ├── page.tsx ⬜ MODIFIED
│   │   └── components/
│   │       ├── ClientCard.tsx ⬜ NEW
│   │       ├── ScoreBadge.tsx ⬜ NEW
│   │       ├── ScoreExplanation.tsx ⬜ NEW
│   │       ├── ScoreDetailModal.tsx ⬜ NEW
│   │       ├── ScoreBreakdown.tsx ⬜ NEW
│   │       ├── FactorCard.tsx ⬜ NEW
│   │       ├── FiltersBar.tsx ⬜ NEW
│   │       └── hooks/
│   │           ├── useClientScores.ts ⬜ NEW
│   │           ├── useScoreDetail.ts ⬜ NEW
│   │           ├── useScoreFilters.ts ⬜ NEW
│   │           └── useScoreExplanation.ts ⬜ NEW
│   │
│   └── api/
│       ├── scores/
│       │   ├── route.ts ⬜ NEW
│       │   ├── [clientId]/route.ts ⬜ NEW
│       │   ├── [clientId]/explain/route.ts ⬜ NEW
│       │   └── recalculate/route.ts ⬜ NEW
│       │
│       └── clients/
│           └── [id]/route.ts ⬜ MODIFIED
│
├── components/
│   └── ui/
│       ├── Badge.tsx ⬜ NEW
│       ├── Modal.tsx ⬜ NEW
│       ├── Progress.tsx ⬜ NEW
│       └── Tooltip.tsx ⬜ NEW
│
├── lib/
│   ├── scoring/
│   │   ├── calculate-score.ts ⬜ NEW
│   │   ├── score-factors.ts ⬜ NEW
│   │   ├── score-utils.ts ⬜ NEW
│   │   └── score-cache.ts ⬜ NEW
│   │
│   ├── ai/
│   │   └── explain-score.ts ⬜ NEW
│   │
│   └── supabase/
│       └── queries.ts ⬜ MODIFIED
│
└── types/
    └── score.types.ts ⬜ NEW

Database Migrations:
├── supabase/
│   └── migrations/
│       ├── 002_create_lead_scores_table.sql ⬜ NEW
│       ├── 003_create_score_factors_table.sql ⬜ NEW
│       └── 004_create_score_indexes.sql ⬜ NEW
```

## Implementation Status

**OVERALL STATUS: ⬜ NOT STARTED**

### Phase 1: Foundation & Setup ⬜ NOT STARTED
- [ ] Database schema design and migration
- [ ] TypeScript types and interfaces
- [ ] Base UI components (Badge, Modal, Progress)
- [ ] Scoring algorithm core logic
- [ ] API route structure

**Estimated Time: 2 days**

### Phase 2: Core Scoring Engine ⬜ NOT STARTED
- [ ] Implement score calculation algorithm
- [ ] Signal weight configuration
- [ ] Recency decay function
- [ ] Score normalization and categorization
- [ ] Score caching layer
- [ ] API endpoints for score CRUD

**Estimated Time: 3 days**

### Phase 3: UI Components ⬜ NOT STARTED
- [ ] ClientCard component with score display
- [ ] ScoreBadge circular progress component
- [ ] ScoreExplanation display component
- [ ] FiltersBar with score range slider
- [ ] Category pills (HOT/WARM/COLD)
- [ ] Sort dropdown implementation

**Estimated Time: 3 days**

### Phase 4: Score Detail & Explanation ⬜ NOT STARTED
- [ ] ScoreDetailModal implementation
- [ ] ScoreBreakdown with factor visualization
- [ ] FactorCard for individual signals
- [ ] Donut/bar chart for composition
- [ ] AI explanation integration with OpenAI
- [ ] Language selection (EN/HI/MR)

**Estimated Time: 4 days**

### Phase 5: Interactivity & State Management ⬜ NOT STARTED
- [ ] useClientScores hook with caching
- [ ] useScoreDetail hook with history
- [ ] useScoreFilters hook
- [ ] useScoreExplanation hook
- [ ] Manual recalculation flow
- [ ] Real-time score updates

**Estimated Time: 2 days**

### Phase 6: Polish & Testing ⬜ NOT STARTED
- [ ] Responsive design refinements
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Loading and error states
- [ ] Animation polish
- [ ] Unit tests for scoring logic
- [ ] Integration tests for API routes
- [ ] E2E tests for user flows

**Estimated Time: 3 days**

**Total Estimated Time: 17 days (3.5 weeks)**

## Dependencies

### Internal Dependencies
- ✅ Authentication system (Supabase Auth)
- ⚠️ **Story #1**: Liquidity signal detection (REQUIRED)
- ⚠️ Client data structure and API
- ✅ Design system components (Button, Card, Avatar)
- ✅ Next.js App Router and API routes

### External Dependencies
- OpenAI GPT-4 API for explanations
- Supabase PostgreSQL database
- Neo4j Aura (for future graph-based scoring enhancements)
- Recharts or Tremor for data visualization

## Risk Assessment

### Technical Risks

#### 1. Scoring Algorithm Accuracy
- **Impact**: High
- **Probability**: Medium
- **Mitigation**: 
  - Start with rule-based weights, validate with RM feedback
  - A/B test different weight configurations
  - Implement score history to track changes
- **Contingency**: Manual score override capability for RMs

#### 2. AI Explanation Quality
- **Impact**: Medium
- **Probability**: Medium
- **Mitigation**:
  - Use structured prompts with examples
  - Implement fallback to template-based explanations
  - Cache explanations to reduce API costs
- **Contingency**: Show factor list without AI summary if API fails

#### 3. Performance at Scale
- **Impact**: High
- **Probability**: Low
- **Mitigation**:
  - Implement aggressive caching (24-hour TTL)
  - Use database indexes on score queries
  - Lazy load client cards (pagination)
- **Contingency**: Reduce client list size, implement pagination

#### 4. Real-time Score Updates
- **Impact**: Medium
- **Probability**: Medium
- **Mitigation**:
  - Use Supabase real-time subscriptions
  - Implement optimistic UI updates
  - Background score recalculation jobs
- **Contingency**: Manual refresh button, scheduled batch updates

### Business Risks

#### 1. RM Trust in Scores
- **Impact**: High
- **Probability**: Medium
- **Mitigation**:
  - Extreme transparency in score composition
  - Allow RMs to provide feedback on scores
  - Show historical score trends
- **Contingency**: Education sessions, documentation, helpdesk

#### 2. Over-reliance on Scores
- **Impact**: Medium
- **Probability**: Low
- **Mitigation**:
  - Emphasize scores as guidance, not absolute truth
  - Encourage RM judgment and context
  - Show confidence intervals
- **Contingency**: Add disclaimers, training materials

## Testing Strategy

### Unit Tests (Jest)

```typescript
describe('calculateLeadScore', () => {
  it('should calculate correct score for single signal', () => {
    const signal = {
      type: 'IPO_FILING',
      strength: 80,
      confidence: 0.9,
      detected_at: new Date(),
    };
    
    const score = calculateLeadScore('client-123', [signal]);
    
    expect(score.score).toBeGreaterThan(20);
    expect(score.factors).toHaveLength(1);
  });
  
  it('should apply recency decay correctly', () => {
    const recentSignal = createSignal({ daysOld: 0 });
    const oldSignal = createSignal({ daysOld: 90 });
    
    const recentFactor = calculateRecencyFactor(0);
    const oldFactor = calculateRecencyFactor(90);
    
    expect(recentFactor).toBe(1.0);
    expect(oldFactor).toBe(0.1);
  });
  
  it('should categorize scores correctly', () => {
    expect(getScoreCategory(85)).toBe('HOT');
    expect(getScoreCategory(65)).toBe('WARM');
    expect(getScoreCategory(35)).toBe('COLD');
  });
  
  it('should normalize scores to 0-100 range', () => {
    const overScore = normalizeScore(150);
    const underScore = normalizeScore(-20);
    const validScore = normalizeScore(65);
    
    expect(overScore).toBe(100);
    expect(underScore).toBe(0);
    expect(validScore).toBe(65);
  });
});

describe('ScoreBadge Component', () => {
  it('should render correct category colors', () => {
    const { container: hot } = render(<ScoreBadge score={85} />);
    const { container: warm } = render(<ScoreBadge score={65} />);
    const { container: cold } = render(<ScoreBadge score={35} />);
    
    expect(hot.querySelector('.score-badge')).toHaveClass('bg-red-50');
    expect(warm.querySelector('.score-badge')).toHaveClass('bg-amber-50');
    expect(cold.querySelector('.score-badge')).toHaveClass('bg-gray-50');
  });
  
  it('should display score value correctly', () => {
    const { getByText } = render(<ScoreBadge score={75} />);
    expect(getByText('75')).toBeInTheDocument();
  });
});
```

### Integration Tests (React Testing Library)

```typescript
describe('Client Score Display Integration', () => {
  it('should load and display client scores', async () => {
    const mockScores = [
      { client_id: '1', score: 85, category: 'HOT' },
      { client_id: '2', score: 65, category: 'WARM' },
    ];
    
    mockAPI('/api/scores', { data: { scores: mockScores } });
    
    const { findByText } = render(<ClientsPage />);
    
    expect(await findByText('85')).toBeInTheDocument();
    expect(await findByText('65')).toBeInTheDocument();
  });
  
  it('should open detail modal on card click', async () => {
    const { getByTestId, findByRole } = render(<ClientsPage />);
    
    const clientCard = getByTestId('client-card-1');
    fireEvent.click(clientCard);
    
    const modal = await findByRole('dialog');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveTextContent('Score Breakdown');
  });
  
  it('should filter clients by score range', async () => {
    const { getByRole, queryByText } = render(<ClientsPage />);
    
    const slider = getByRole('slider');
    fireEvent.change(slider, { target: { value: [80, 100] } });
    
    await waitFor(() => {
      expect(queryByText('Client A')).toBeInTheDocument(); // Score 85
      expect(queryByText('Client B')).not.toBeInTheDocument(); // Score 65
    });
  });
});
```

### E2E Tests (Playwright)

```typescript
test.describe('Lead Score Feature E2E', () => {
  test('should display scores for all clients', async ({ page }) => {
    await page.goto('/clients');
    await page.waitForSelector('[data-testid="client-card"]');
    
    const scoreBadges = await page.locator('.score-badge').count();
    expect(scoreBadges).toBeGreaterThan(0);
  });
  
  test('should show score explanation on hover', async ({ page }) => {
    await page.goto('/clients');
    
    const firstCard = page.locator('[data-testid="client-card"]').first();
    await firstCard.hover();
    
    await expect(page.locator('.score-explanation')).toBeVisible();
  });
  
  test('should complete score detail workflow', async ({ page }) => {
    await page.goto('/clients');
    
    // Click on first client card
    await page.locator('[data-testid="client-card"]').first().click();
    
    // Modal should open
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Check for breakdown elements
    await expect(page.locator('.score-breakdown')).toBeVisible();
    await expect(page.locator('.factor-card')).toHaveCount(3);
    
    // Check for AI explanation
    await expect(page.locator('.ai-explanation')).toBeVisible();
    
    // Close modal
    await page.locator('[aria-label="Close"]').click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });
  
  test('should recalculate score on demand', async ({ page }) => {
    await page.goto('/clients');
    await page.locator('[data-testid="client-card"]').first().click();
    
    const initialScore = await page.locator('.score-large').textContent();
    
    await page.locator('button:has-text("Recalculate")').click();
    await page.waitForSelector('.loading-spinner', { state: 'hidden' });
    
    const newScore = await page.locator('.score-large').textContent();
    expect(newScore).toBeDefined();
  });
});
```

## Performance Considerations

### Bundle Optimization
- **Code Splitting**: Lazy load ScoreDetailModal (only when opened)
- **Tree Shaking**: Import only used Recharts components
- **Asset Optimization**: SVG icons for score categories
- **Dynamic Imports**: Load AI explanation component on demand

```typescript
// Lazy load heavy components
const ScoreDetailModal = dynamic(
  () => import('./components/ScoreDetailModal'),
  { loading: () => <ModalSkeleton /> }
);

const ScoreChart = dynamic(
  () => import('./components/ScoreChart'),
  { ssr: false }
);
```

### Runtime Performance

**Memoization**:
```typescript
// Memoize expensive score calculations
const scoredClients = useMemo(() => {
  return clients.map(client => ({
    ...client,
    score: scores.get(client.id),
  })).sort((a, b) => b.score?.score - a.score?.score);
}, [clients, scores]);

// Memoize filter function
const filteredClients = useMemo(() => {
  return applyFilters(scoredClients, filters);
}, [scoredClients, filters]);
```

**Virtualization**:
```typescript
// Use react-window for large lists
import { FixedSizeGrid } from 'react-window';

<FixedSizeGrid
  columnCount={3}
  rowCount={Math.ceil(clients.length / 3)}
  columnWidth={400}
  rowHeight={360}
  width={1200}
  height={800}
>
  {({ columnIndex, rowIndex, style }) => (
    <div style={style}>
      <ClientCard client={clients[rowIndex * 3 + columnIndex]} />
    </div>
  )}
</FixedSizeGrid>
```

**Debouncing**:
```typescript
// Debounce score range slider
const debouncedScoreRange = useDebounce(scoreRange, 300);

useEffect(() => {
  updateFilters({ scoreRange: debouncedScoreRange });
}, [debouncedScoreRange]);
```

### Caching Strategy

**Client-Side Cache**:
```typescript
// React Query for API caching
const { data: scores } = useQuery({
  queryKey: ['scores', filters],
  queryFn: () => fetchScores(filters),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
});
```

**Server-Side Cache**:
```typescript
// Next.js route cache with Supabase
export async function GET(request: Request) {
  const scores = await supabase
    .from('lead_scores')
    .select('*')
    .gt('expires_at', new Date().toISOString());
  
  return Response.json(scores, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
```

**Redis Cache** (Future):
```typescript
// Cache scores in Redis for 24 hours
await redis.setex(
  `score:${clientId}`,
  24 * 60 * 60,
  JSON.stringify(score)
);
```

## Deployment Plan

### Development Phase
- Feature branch: `feature/02-lead-scores`
- Feature flag: `ENABLE_LEAD_SCORES` (default: false in dev)
- Database migration: Run on dev environment first
- Seed data: Generate 100 test clients with scores

**Checklist**:
- [ ] Create feature branch
- [ ] Run database migrations on dev
- [ ] Implement core scoring engine
- [ ] Build UI components
- [ ] Write unit tests
- [ ] Manual testing in dev environment

### Staging Phase
- Deploy to staging environment
- Enable feature flag for internal testing
- Populate with production-like data (anonymized)
- Conduct UAT with 2-3 RMs

**Checklist**:
- [ ] Deploy to staging
- [ ] Run database migrations on staging
- [ ] Import anonymized client data
- [ ] UAT with RMs (2-3 users)
- [ ] Collect feedback and iterate
- [ ] Performance testing (load testing)
- [ ] Accessibility audit

### Production Phase
- Gradual rollout with feature flag
- Monitor performance metrics
- Track RM adoption and feedback

**Rollout Strategy**:
1. **Pilot (Week 1)**: Enable for 3-5 RMs (10-15% of users)
2. **Expanded (Week 2)**: Enable for 10-15 RMs (40-50% of users)
3. **Full Launch (Week 3)**: Enable for all RMs (100% of users)

**Checklist**:
- [ ] Deploy to production
- [ ] Run database migrations on production
- [ ] Enable feature flag for pilot group
- [ ] Monitor error rates and performance
- [ ] Collect pilot user feedback
- [ ] Expand to 50% of users
- [ ] Monitor for 48 hours
- [ ] Full rollout to 100% of users

### Rollback Plan
- Feature flag can disable instantly
- Database migrations are reversible
- Cache invalidation to remove stale scores
- Fallback to simple signal list without scores

```typescript
// Feature flag check in code
if (!featureFlags.ENABLE_LEAD_SCORES) {
  return <LegacyClientList />;
}

return <ClientsWithScores />;
```

## Monitoring & Analytics

### Performance Metrics
```typescript
// Tracked via Vercel Analytics / DataDog
interface PerformanceMetrics {
  // Core Web Vitals
  LCP: number; // Largest Contentful Paint (target: < 2.5s)
  FID: number; // First Input Delay (target: < 100ms)
  CLS: number; // Cumulative Layout Shift (target: < 0.1)
  
  // Custom Metrics
  scoreCalculationTime: number; // Target: < 500ms
  aiExplanationTime: number; // Target: < 2s
  pageLoadTime: number; // Target: < 2s
  clientCardRenderTime: number; // Target: < 100ms
}
```

**Monitoring Tools**:
- Vercel Analytics for Next.js performance
- Supabase Dashboard for database query performance
- OpenAI Dashboard for API usage and latency
- Custom instrumentation for score calculation timing

### Business Metrics
```typescript
interface BusinessMetrics {
  // Adoption Metrics
  activeUsers: number; // RMs using feature
  scoresViewed: number; // Total score views
  modalOpensPerUser: number; // Engagement depth
  
  // Effectiveness Metrics
  highScoreEngagements: number; // Engagements with HOT leads
  conversionRate: number; // HOT leads → closed deals
  avgTimeToEngage: number; // Time from high score → contact
  
  // User Satisfaction
  feedbackScore: number; // 1-5 rating
  featureUsageFrequency: number; // Uses per week
  
  // Score Accuracy
  rmScoreAgreement: number; // % of RMs agreeing with score
  falsePositives: number; // High scores that didn't convert
  falseNegatives: number; // Missed opportunities
}
```

### Technical Metrics
```typescript
interface TechnicalMetrics {
  // API Performance
  avgApiResponseTime: Record<string, number>;
  apiErrorRate: Record<string, number>;
  apiRequestCount: Record<string, number>;
  
  // Caching Efficiency
  cacheHitRate: number; // Target: > 70%
  cacheMissRate: number;
  cacheInvalidations: number;
  
  // Database Performance
  avgQueryTime: number; // Target: < 100ms
  slowQueries: number; // Queries > 500ms
  connectionPoolUtilization: number;
  
  // AI/LLM Usage
  openaiApiCalls: number;
  openaiApiCost: number; // USD
  openaiApiLatency: number; // Target: < 2s
  openaiApiErrors: number;
}
```

### Alerting Rules
```yaml
alerts:
  # Critical Alerts (PagerDuty)
  - name: HighErrorRate
    condition: errorRate > 5%
    severity: critical
    notify: oncall-engineer
  
  - name: ScoreCalculationTimeout
    condition: scoreCalculationTime > 5s
    severity: critical
    notify: oncall-engineer
  
  # Warning Alerts (Slack)
  - name: SlowApiResponse
    condition: apiResponseTime > 1s
    severity: warning
    notify: dev-channel
  
  - name: LowCacheHitRate
    condition: cacheHitRate < 50%
    severity: warning
    notify: dev-channel
  
  - name: HighOpenAICost
    condition: dailyOpenAICost > $50
    severity: warning
    notify: product-team
```

### Dashboards

**Operations Dashboard** (Grafana/Vercel):
- Real-time error rate and response times
- Active users and concurrent sessions
- API endpoint performance breakdown
- Database connection pool status

**Business Dashboard** (Internal Analytics):
- Daily active RMs using scores
- Score distribution (HOT/WARM/COLD)
- Top clients by score
- Engagement rate by score category
- Conversion funnel (View → Detail → Engage)

**AI Dashboard** (OpenAI/Custom):
- Daily explanation requests
- Average explanation generation time
- Token usage and cost
- Error rate and retry attempts

## Documentation Requirements

### Technical Documentation

**1. Architecture Decision Records (ADRs)**:
```markdown
# ADR-002: Lead Score Calculation Algorithm

## Status
Accepted

## Context
Need to calculate lead scores based on multiple liquidity signals with varying relevance and recency.

## Decision
Use weighted sum algorithm with recency decay:
- Each signal type has predefined weight
- Recency factor decays linearly over 90 days
- Confidence multiplier adjusts for signal reliability
- Final score normalized to 0-100 range

## Consequences
- Simple and explainable to RMs
- Easy to adjust weights based on feedback
- Can be calculated server-side efficiently
- May need ML model in future for better accuracy
```

**2. API Documentation** (OpenAPI/Swagger):
```yaml
openapi: 3.0.0
paths:
  /api/scores:
    get:
      summary: Get lead scores for all clients
      parameters:
        - name: rm_id
          schema:
            type: string
        - name: category
          schema:
            type: string
            enum: [HOT, WARM, COLD]
      responses:
        200:
          description: List of lead scores
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LeadScoreList'
```

**3. Database Schema Documentation**:
```sql
-- Lead Scores Table
-- Stores calculated lead scores for clients
-- Scores expire after 24 hours and need recalculation

CREATE TABLE lead_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  score_category VARCHAR(10) CHECK (score_category IN ('HOT', 'WARM', 'COLD')),
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lead_scores_client_id ON lead_scores(client_id);
CREATE INDEX idx_lead_scores_category ON lead_scores(score_category);
CREATE INDEX idx_lead_scores_expires_at ON lead_scores(expires_at);
```

### User Documentation

**1. Feature Guide for RMs**:
```markdown
# Understanding Lead Scores

## What are Lead Scores?

Lead scores help you prioritize which clients to engage based on their likelihood of having liquidity events. Scores range from 0-100, with higher scores indicating stronger signals.

## Score Categories

- 🔥 **HOT (80-100)**: Strong liquidity signals detected. Immediate action recommended.
- ⚡ **WARM (50-79)**: Moderate signals. Plan engagement within 1-2 weeks.
- ❄️ **COLD (0-49)**: Weak or no recent signals. Monitor periodically.

## How Scores are Calculated

Scores are based on:
1. **Signal Type**: IPO filings (30%), M&A rumors (25%), funding rounds (20%), etc.
2. **Recency**: Recent signals contribute more to the score
3. **Confidence**: Reliability of the signal source
4. **Strength**: How significant the liquidity event is

## Using the Score Breakdown

Click "View Details" on any client card to see:
- All contributing signals
- Points each signal contributed
- Why the score is what it is
- Recommended next steps

## Best Practices

✅ Review HOT leads daily
✅ Use explanations to prepare talking points
✅ Combine score with your personal knowledge
❌ Don't rely solely on scores - use your judgment
❌ Don't ignore COLD leads with special circumstances
```

**2. FAQ Document**:
```markdown
# Lead Scores FAQ

## General Questions

**Q: How often are scores updated?**
A: Scores are recalculated automatically every 24 hours or when new signals are detected.

**Q: Can I manually recalculate a score?**
A: Yes, click "Recalculate" in the score detail modal.

**Q: Why did my client's score drop?**
A: Scores can drop when signals become older (recency decay) or when no new signals are detected.

## Technical Questions

**Q: What if the explanation doesn't make sense?**
A: Contact support with the client ID and we'll review the calculation.

**Q: Can I adjust score weights for my clients?**
A: Not currently, but this is on the roadmap (custom scoring per RM).

**Q: Are scores visible to clients?**
A: No, scores are internal to RMs only.

## Troubleshooting

**Q: Score is not displaying**
A: Try refreshing the page. If issue persists, contact support.

**Q: Detail modal won't open**
A: Check your browser console for errors or try a different browser.
```

### Code Documentation

**Component Documentation**:
```typescript
/**
 * ClientCard Component
 * 
 * Displays a client with their lead score in a premium card layout.
 * Follows the Kairos Capital design aesthetic with gold accents.
 * 
 * @component
 * @category Dashboard/Clients
 * 
 * @example
 * <ClientCard 
 *   client={client}
 *   score={leadScore}
 *   onCardClick={(id) => openDetailModal(id)}
 * />
 * 
 * @param {ClientCardProps} props - Component props
 * @param {Client} props.client - Client data object
 * @param {LeadScore} props.score - Lead score object
 * @param {Function} props.onCardClick - Callback when card is clicked
 * 
 * @returns {JSX.Element} Rendered client card with score
 * 
 * @see {@link Client} for client data structure
 * @see {@link LeadScore} for score data structure
 */
```

## Post-Launch Review

### Success Criteria

**Week 1 (Pilot Phase)**:
- [ ] Zero critical bugs reported
- [ ] < 2 second average page load time
- [ ] 80% of pilot RMs actively use feature
- [ ] 4+ star average satisfaction rating

**Week 4 (Full Launch)**:
- [ ] 90% of RMs have viewed scores at least once
- [ ] 70% of HOT leads engaged within 48 hours
- [ ] 5% increase in conversion rate for scored leads
- [ ] 4.5+ star average satisfaction rating

**Month 3 (Maturity)**:
- [ ] Consistent daily active usage by 80%+ of RMs
- [ ] 10% increase in overall AUM from scored leads
- [ ] Reduced time-to-engage by 40%
- [ ] Score accuracy validated by RM feedback

### Key Metrics to Track

**Adoption Metrics**:
- Daily/Weekly/Monthly active users
- Feature usage frequency per RM
- Score detail modal open rate
- Score explanation read rate

**Effectiveness Metrics**:
- Conversion rate by score category
- Time-to-engage by score category
- Revenue generated from scored leads
- AUM increase from HOT/WARM leads

**Quality Metrics**:
- RM satisfaction score (1-5)
- Reported false positives/negatives
- Score explanation clarity rating
- Support tickets related to scores

### Retrospective Items

**What Went Well**:
- [ ] Document successful patterns
- [ ] Identify reusable components
- [ ] Note effective collaboration approaches

**What Could Be Improved**:
- [ ] Technical challenges encountered
- [ ] Process bottlenecks identified
- [ ] Communication gaps

**Action Items**:
- [ ] Technical debt to address
- [ ] Future enhancements to prioritize
- [ ] Process improvements for next story

### Future Enhancements

**Short-term (1-3 months)**:
- [ ] Score trending (show score changes over time)
- [ ] Custom score weights per RM
- [ ] Push notifications for score threshold breaches
- [ ] Export score reports to PDF

**Medium-term (3-6 months)**:
- [ ] Machine learning-based score prediction
- [ ] Historical score accuracy tracking
- [ ] Score comparison across RMs (benchmarking)
- [ ] Integration with CRM for automatic sync

**Long-term (6-12 months)**:
- [ ] Predictive scoring (forecast future scores)
- [ ] Automated engagement recommendations
- [ ] Multi-language explanations (Hindi, Marathi)
- [ ] Voice-activated score queries

---

## Appendix

### Glossary

- **Lead Score**: Numerical rating (0-100) indicating likelihood of liquidity event
- **Score Category**: Classification of score (HOT/WARM/COLD)
- **Score Factor**: Individual signal contributing to total score
- **Recency Decay**: Reduction in signal value over time
- **Confidence**: Reliability metric for signal source
- **Weight**: Relative importance of signal type in score calculation

### References

- [Kairos Capital Design System](https://kairoscapital.mu/)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Supabase PostgreSQL](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [WCAG 2.1 AA Standards](https://www.w3.org/WAI/WCAG21/quickref/)

### Contact

- **Product Owner**: [Name]
- **Tech Lead**: [Name]
- **Design Lead**: [Name]
- **QA Lead**: [Name]

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-19  
**Next Review**: 2025-01-05

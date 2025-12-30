# 09 - Receive Proactive Engagement Suggestions - Implementation Plan

## Project Context

**Technical Stack**: Next.js 15 (App Router), React 18, TypeScript, TailwindCSS
**AI/LLM**: OpenAI GPT-4 for generating personalized suggestions
**Backend**: Supabase (PostgreSQL), Supabase Realtime
**Notifications**: In-app notifications, Email (optional)
**Infrastructure**: Vercel (Frontend), Supabase (Backend), OpenAI (AI Processing)

---

## User Story

**As a** Relationship Manager,
**I want** to receive proactive suggestions for client engagement based on detected signals,
**so that** I can reach out early to understand context and initiate meaningful conversations around investments or asset movement.

---

## Pre-conditions

- Supabase database with `clients`, `signals`, and `suggestions` tables
- User is authenticated as an RM
- Signal detection system is operational
- OpenAI API configured for generating suggestions
- RM has assigned clients with detected signals

---

## Business Requirements

- **Timely Suggestions**: RM receives suggestions within hours of signal detection
  - *Success Metric*: 95% of suggestions generated within 2 hours of signal detection
  
- **Actionable Recommendations**: Each suggestion includes client name, context, and specific action
  - *Success Metric*: 80%+ of RMs find suggestions actionable (survey feedback)
  
- **Contextual Relevance**: Suggestions are personalized based on client profile and signal type
  - *Success Metric*: 70%+ of suggestions lead to client contact within 48 hours
  
- **Non-Intrusive Delivery**: Suggestions appear in dashboard without interrupting workflow
  - *Success Metric*: <5% of notifications marked as "not useful"
  
- **Easy Access to Context**: One-click navigation to full client profile
  - *Success Metric*: 90%+ of suggestions clicked through to client detail

---

## Technical Specifications

### Integration Points

- **OpenAI GPT-4**: Generate personalized engagement suggestions
- **Supabase Realtime**: Push new suggestions to dashboard
- **Supabase Functions (Edge Functions)**: Background suggestion generation
- **Email Service (optional)**: Postmark/SendGrid for email notifications

### Security Requirements

- RLS ensures RMs only see suggestions for their own clients
- Suggestion content encrypted at rest
- Rate limiting on suggestion generation (prevent spam)
- No PII exposed in external API calls

### Data Flow

```
Signal Detected → Trigger Evaluation → Suggestion Generator (OpenAI) → 
Store Suggestion → Realtime Notification → RM Dashboard → 
User Action (View/Dismiss/Snooze)
```

---

## Design Specifications

### Visual Layout & Components

**Dashboard Suggestions Section**:

```
┌─────────────────────────────────────────────────────────────┐
│  Engagement Suggestions                     [View All (12)]  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 🔔 NEW  |  2 hours ago                      [×] Dismiss ││
│  │                                                          ││
│  │ Rajesh Sharma - TechCorp IPO Filing                     ││
│  │                                                          ││
│  │ TechCorp filed for IPO yesterday. Rajesh (35% stake)    ││
│  │ may realize ₹298Cr in 60-90 days.                       ││
│  │                                                          ││
│  │ 💡 Suggested Action:                                    ││
│  │ Call Rajesh to discuss tax-efficient exit strategies    ││
│  │ and post-liquidity wealth management plan.              ││
│  │                                                          ││
│  │ [View Full Profile]  [Mark as Contacted]  [Snooze 1d]  ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 📊 TRENDING  |  5 hours ago                 [×] Dismiss ││
│  │                                                          ││
│  │ Amit Patel - Series C Funding Announced                 ││
│  │                                                          ││
│  │ E-Commerce Solutions raised ₹350Cr Series C. Amit is    ││
│  │ Founder/Promoter.                                        ││
│  │                                                          ││
│  │ 💡 Suggested Action:                                    ││
│  │ Congratulate Amit and explore opportunities for         ││
│  │ diversifying wealth beyond the company.                  ││
│  │                                                          ││
│  │ [View Full Profile]  [Mark as Contacted]  [Snooze 1d]  ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Component Hierarchy**:

```tsx
<DashboardPage>
  <SuggestionsSection>
    <SectionHeader>
      <Title />
      <ViewAllButton />
    </SectionHeader>
    <SuggestionsList>
      <SuggestionCard>
        <SuggestionHeader />
        <ClientContext />
        <SignalSummary />
        <RecommendedAction />
        <ActionButtons>
          <ViewProfileButton />
          <MarkContactedButton />
          <SnoozeButton />
          <DismissButton />
        </ActionButtons>
      </SuggestionCard>
    </SuggestionsList>
  </SuggestionsSection>
</DashboardPage>
```

### Design System Compliance

**Color Palette**:

```css
/* Suggestion Card States */
--suggestion-new: #EFF6FF;           /* Light blue bg - new */
--suggestion-trending: #FFF7ED;      /* Light orange bg - trending */
--suggestion-urgent: #FEF2F2;        /* Light red bg - urgent */
--suggestion-default: #FFFFFF;       /* White bg - normal */

/* Priority Badges */
--priority-critical: #DC3545;        /* Red */
--priority-high: #FF8C00;            /* Orange */
--priority-medium: #FFC107;          /* Amber */
--priority-low: #28A745;             /* Green */

/* Action States */
--action-contacted: #28A745;         /* Green */
--action-snoozed: #FFC107;           /* Amber */
--action-dismissed: #6C757D;         /* Gray */
```

**Typography**:

```css
/* Suggestion Card Typography */
--suggestion-title-size: 1.125rem;   /* 18px */
--suggestion-title-weight: 600;
--suggestion-body-size: 0.875rem;    /* 14px */
--suggestion-action-size: 1rem;      /* 16px */
--suggestion-action-weight: 500;
```

### Responsive Behavior

**Desktop (1024px+)**:

- 2-column suggestion grid
- Full suggestion text visible
- All action buttons inline

**Tablet (768px - 1023px)**:

- 1-column layout
- Truncate long suggestion text
- Stacked action buttons

**Mobile (<768px)**:

- Full-width cards
- Collapsible suggestion details
- Bottom sheet for actions

### Interaction Patterns

**Suggestion Card States**:

```typescript
interface SuggestionCardStates {
  new: 'bg-blue-50 border-blue-300';
  trending: 'bg-orange-50 border-orange-300';
  urgent: 'bg-red-50 border-red-300';
  default: 'bg-white border-gray-200';
  snoozed: 'opacity-60 bg-gray-50';
  dismissed: 'opacity-40 line-through';
}
```

**Action Behaviors**:

```typescript
interface ActionBehaviors {
  viewProfile: 'Navigate to client detail page';
  markContacted: 'Update status, hide suggestion, log activity';
  snooze: 'Hide for specified duration (1d, 3d, 7d)';
  dismiss: 'Hide permanently, log as not useful';
}
```

---

## Technical Architecture

### Component Structure

```
app/(dashboard)/
├── page.tsx                          # Dashboard with suggestions
└── suggestions/
    ├── page.tsx                      # All suggestions view
    └── components/
        ├── SuggestionCard.tsx        # Individual suggestion
        ├── SuggestionsList.tsx       # List container
        ├── SuggestionsSection.tsx    # Dashboard section
        ├── SuggestionFilters.tsx     # Filter by priority/type
        ├── SuggestionActions.tsx     # Action buttons
        └── hooks/
            ├── useSuggestions.ts     # Fetch suggestions
            ├── useSuggestionActions.ts  # Handle actions
            └── useRealtimeSuggestions.ts # Realtime updates

app/api/
└── suggestions/
    ├── route.ts                      # GET, POST suggestions
    ├── generate/
    │   └── route.ts                  # Trigger generation
    └── [id]/
        ├── route.ts                  # GET, PATCH, DELETE
        └── actions/
            └── route.ts              # Mark contacted, snooze, dismiss

services/
├── suggestionService.ts              # Suggestion business logic
└── suggestionGenerator.ts            # AI-powered generation

lib/
├── openai/
│   └── suggestion-prompts.ts         # OpenAI prompts
└── utils/
    └── suggestion-helpers.ts         # Utility functions

types/
└── suggestion.ts                     # Suggestion type definitions
```

### State Management Architecture

**Suggestion State Interface**:

```typescript
interface SuggestionState {
  // Data
  suggestions: Suggestion[];
  isLoading: boolean;
  error: string | null;
  
  // Filters
  filters: SuggestionFilters;
  
  // UI State
  selectedSuggestionId: string | null;
  newSuggestionsCount: number;
  
  // Realtime
  lastUpdate: Date | null;
}

interface Suggestion {
  id: string;
  rmId: string;
  clientId: string;
  signalId: string;
  
  // Content
  title: string;
  context: string;
  recommendedAction: string;
  
  // Metadata
  priority: SuggestionPriority;
  category: SuggestionCategory;
  generatedAt: Date;
  expiresAt?: Date;
  
  // Client Info
  client: {
    id: string;
    name: string;
    company: string;
    estimatedWealth: number;
    leadScore: number;
  };
  
  // Signal Info
  signal: {
    id: string;
    type: SignalType;
    severity: SignalSeverity;
    detectedAt: Date;
    timeline: string;
  };
  
  // Status
  status: SuggestionStatus;
  viewedAt?: Date;
  actionedAt?: Date;
  snoozedUntil?: Date;
  dismissedAt?: Date;
  
  // Engagement
  contactedAt?: Date;
  outcome?: string;
}

type SuggestionPriority = 
  | 'critical'    // Act within 24 hours
  | 'high'        // Act within 3 days
  | 'medium'      // Act within 1 week
  | 'low';        // Monitor

type SuggestionCategory = 
  | 'liquidity_event'
  | 'relationship_opportunity'
  | 'risk_alert'
  | 'cross_sell'
  | 'retention';

type SuggestionStatus = 
  | 'new'
  | 'viewed'
  | 'contacted'
  | 'snoozed'
  | 'dismissed';

interface SuggestionFilters {
  priority?: SuggestionPriority[];
  category?: SuggestionCategory[];
  status?: SuggestionStatus[];
  dateRange?: DateRange;
}
```

**Suggestion Actions**:

```typescript
interface SuggestionActions {
  // Data Loading
  loadSuggestions: (filters?: SuggestionFilters) => Promise<void>;
  refreshSuggestions: () => Promise<void>;
  
  // Suggestion Actions
  viewSuggestion: (id: string) => Promise<void>;
  markContacted: (id: string, outcome?: string) => Promise<void>;
  snoozeSuggestion: (id: string, duration: SnoozeDuration) => Promise<void>;
  dismissSuggestion: (id: string, reason?: string) => Promise<void>;
  
  // Filtering
  updateFilters: (filters: Partial<SuggestionFilters>) => void;
  resetFilters: () => void;
  
  // Realtime
  subscribeToUpdates: () => void;
  unsubscribeFromUpdates: () => void;
}

type SnoozeDuration = '1d' | '3d' | '7d';
```

### API Integration Schema

**Suggestions API** (`/api/suggestions/route.ts`):

```typescript
// GET Request
interface GetSuggestionsRequest {
  rmId: string;
  filters?: SuggestionFilters;
  limit?: number;
  offset?: number;
}

// Response
interface SuggestionsResponse {
  success: boolean;
  data: {
    suggestions: Suggestion[];
    total: number;
    newCount: number;
  };
}

// POST Request (Manual Trigger)
interface GenerateSuggestionRequest {
  signalId: string;
  clientId: string;
}
```

**Suggestion Actions API** (`/api/suggestions/[id]/actions/route.ts`):

```typescript
// PATCH Request
interface SuggestionActionRequest {
  action: 'view' | 'contact' | 'snooze' | 'dismiss';
  data?: {
    outcome?: string;        // For 'contact'
    duration?: string;       // For 'snooze'
    reason?: string;         // For 'dismiss'
  };
}

// Response
interface SuggestionActionResponse {
  success: boolean;
  data: Suggestion;
}
```

**Generate Suggestion API** (`/api/suggestions/generate/route.ts`):

```typescript
// POST Request
interface GenerateSuggestionRequest {
  signalId: string;
  clientId: string;
  rmId: string;
}

// Response
interface GenerateSuggestionResponse {
  success: boolean;
  data: Suggestion;
}
```

---

## Implementation Requirements

### Core Components

#### 1. `SuggestionCard.tsx` - Individual suggestion display

- Shows client name, signal context, and recommended action
- Priority badge (critical/high/medium/low)
- Action buttons (view profile, mark contacted, snooze, dismiss)
- Relative timestamp ("2 hours ago")

#### 2. `SuggestionsList.tsx` - List of suggestions

- Displays suggestions sorted by priority and recency
- Filters by status (new, viewed, contacted)
- Pagination for >10 suggestions
- Empty state when no suggestions

#### 3. `SuggestionsSection.tsx` - Dashboard widget

- Shows top 3 most important suggestions
- "View All" link to full suggestions page
- Real-time badge showing new count
- Collapsible section

#### 4. `SuggestionActions.tsx` - Action button group

- Mark as contacted (with optional outcome note)
- Snooze with duration selector (1d, 3d, 7d)
- Dismiss with optional reason
- View full client profile

### Custom Hooks

#### `useSuggestions()` - Fetch and manage suggestions

```typescript
export function useSuggestions(
  rmId: string,
  filters?: SuggestionFilters
) {
  return useQuery({
    queryKey: ['suggestions', rmId, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        rmId,
        ...filters
      });
      
      const response = await fetch(`/api/suggestions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      
      const data = await response.json();
      return data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
```

#### `useRealtimeSuggestions()` - Real-time updates

```typescript
export function useRealtimeSuggestions(rmId: string) {
  const [newCount, setNewCount] = useState(0);
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const channel = supabase
      .channel('suggestions-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'suggestions',
        filter: `rm_id=eq.${rmId}`
      }, (payload) => {
        setNewCount(prev => prev + 1);
        queryClient.invalidateQueries(['suggestions', rmId]);
        
        // Show toast notification
        toast.info('New engagement suggestion received');
      })
      .subscribe();
    
    return () => {
      channel.unsubscribe();
    };
  }, [rmId]);
  
  return { newCount, clearNewCount: () => setNewCount(0) };
}
```

#### `useSuggestionActions()` - Handle suggestion actions

```typescript
export function useSuggestionActions() {
  const queryClient = useQueryClient();
  
  const markContacted = useMutation({
    mutationFn: async ({ id, outcome }: { id: string; outcome?: string }) => {
      const response = await fetch(`/api/suggestions/${id}/actions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'contact', data: { outcome } })
      });
      
      if (!response.ok) throw new Error('Failed to mark as contacted');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['suggestions']);
      toast.success('Marked as contacted');
    }
  });
  
  const snoozeSuggestion = useMutation({
    mutationFn: async ({ id, duration }: { id: string; duration: SnoozeDuration }) => {
      const response = await fetch(`/api/suggestions/${id}/actions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'snooze', data: { duration } })
      });
      
      if (!response.ok) throw new Error('Failed to snooze');
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['suggestions']);
      toast.success(`Snoozed for ${variables.duration}`);
    }
  });
  
  const dismissSuggestion = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const response = await fetch(`/api/suggestions/${id}/actions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss', data: { reason } })
      });
      
      if (!response.ok) throw new Error('Failed to dismiss');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['suggestions']);
      toast.success('Suggestion dismissed');
    }
  });
  
  return { markContacted, snoozeSuggestion, dismissSuggestion };
}
```

### Service Functions

#### `services/suggestionGenerator.ts` - AI-powered suggestion generation

```typescript
export async function generateEngagementSuggestion(
  signal: Signal,
  client: Client,
  rm: User
): Promise<Suggestion> {
  // Build context for OpenAI
  const context = buildSuggestionContext(signal, client, rm);
  
  // Generate suggestion using OpenAI
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: SUGGESTION_SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: buildSuggestionPrompt(context)
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });
  
  const generatedContent = completion.choices[0].message.content;
  const parsed = parseSuggestionContent(generatedContent);
  
  // Determine priority based on signal severity and client value
  const priority = calculateSuggestionPriority(signal, client);
  
  // Create suggestion object
  const suggestion: Suggestion = {
    id: generateId(),
    rmId: rm.id,
    clientId: client.id,
    signalId: signal.id,
    
    title: parsed.title,
    context: parsed.context,
    recommendedAction: parsed.recommendedAction,
    
    priority,
    category: categorizeSignal(signal.type),
    generatedAt: new Date(),
    expiresAt: calculateExpiryDate(signal.expectedTimeline),
    
    client: {
      id: client.id,
      name: client.name,
      company: client.company,
      estimatedWealth: client.estimatedWealth,
      leadScore: client.leadScore
    },
    
    signal: {
      id: signal.id,
      type: signal.type,
      severity: signal.severity,
      detectedAt: signal.detectedAt,
      timeline: signal.expectedTimeline
    },
    
    status: 'new'
  };
  
  return suggestion;
}

function calculateSuggestionPriority(
  signal: Signal,
  client: Client
): SuggestionPriority {
  // Critical: High-value client + urgent signal
  if (client.leadScore >= 80 && signal.severity === 'critical') {
    return 'critical';
  }
  
  // High: High-value client or urgent signal
  if (client.leadScore >= 70 || signal.severity === 'high') {
    return 'high';
  }
  
  // Medium: Moderate client + moderate signal
  if (client.leadScore >= 50 && signal.severity === 'medium') {
    return 'medium';
  }
  
  // Low: Everything else
  return 'low';
}
```

#### `lib/openai/suggestion-prompts.ts` - OpenAI prompts

```typescript
export const SUGGESTION_SYSTEM_PROMPT = `
You are an AI assistant for Relationship Managers at Kairos Capital.
Your role is to generate proactive engagement suggestions when liquidity signals are detected.

Each suggestion should include:
1. A concise title (client name + signal type)
2. Context about the signal and its impact on the client
3. A specific, actionable recommendation for the RM

Guidelines:
- Be professional and wealth-focused
- Suggest timely outreach (before competitors)
- Focus on adding value, not just selling
- Reference specific numbers (wealth, stake %, timeline)
- Recommend meaningful conversations about tax planning, diversification, or wealth management

Output format (JSON):
{
  "title": "Client Name - Signal Type",
  "context": "2-3 sentences explaining the signal and impact",
  "recommendedAction": "Specific action the RM should take"
}
`;

export function buildSuggestionPrompt(context: SuggestionContext): string {
  return `
Generate an engagement suggestion for the following scenario:

**Client**: ${context.clientName}
- Company: ${context.company}
- Designation: ${context.designation}
- Estimated Wealth: ₹${formatCurrency(context.estimatedWealth)}
- Lead Score: ${context.leadScore}/100

**Signal Detected**:
- Type: ${context.signalType}
- Details: ${context.signalDetails}
- Expected Timeline: ${context.timeline}
- Potential Liquidity Amount: ${context.liquidityAmount ? '₹' + formatCurrency(context.liquidityAmount) : 'N/A'}

**RM Context**:
- Last Contact: ${context.lastContactedAt ? formatRelativeTime(context.lastContactedAt) : 'Never'}
- Products Held: ${context.productsHeld.join(', ')}
- Products Missing: ${context.productsMissing.join(', ')}

Generate a personalized engagement suggestion that helps the RM initiate a timely, value-adding conversation.
`;
}
```

#### `services/suggestionService.ts` - Background suggestion generation

```typescript
export async function processNewSignal(signal: Signal): Promise<void> {
  // Get affected client
  const client = await getClientById(signal.clientId);
  if (!client) return;
  
  // Get assigned RM
  const rm = await getUserById(client.assignedRmId);
  if (!rm) return;
  
  // Check if suggestion already exists for this signal
  const existingSuggestion = await getSuggestionBySignalId(signal.id);
  if (existingSuggestion) return;
  
  // Generate AI-powered suggestion
  const suggestion = await generateEngagementSuggestion(signal, client, rm);
  
  // Save to database
  await saveSuggestion(suggestion);
  
  // (Optional) Send email notification if critical
  if (suggestion.priority === 'critical') {
    await sendSuggestionEmail(rm.email, suggestion);
  }
}
```

---

## Acceptance Criteria

### Functional Requirements

#### Core Feature Functionality

✅ **AC 1.1**: System generates engagement suggestions when signals detected

- Background process monitors new signals
- Suggestions generated within 2 hours of signal detection
- AI-powered personalization based on client context

✅ **AC 1.2**: Suggestions include client name, signal context, and action

- Title shows client name and signal type
- Context explains signal and impact (2-3 sentences)
- Recommended action is specific and actionable

✅ **AC 1.3**: Suggestions appear as notifications or dedicated section

- Dashboard widget shows top 3 suggestions
- Full suggestions page lists all suggestions
- Real-time toast notification when new suggestion arrives
- Badge shows count of new suggestions

✅ **AC 1.4**: Each suggestion links to prospect detail

- "View Full Profile" button navigates to client detail page
- Client context preserved (signal highlighted)
- One-click access to full client information

✅ **AC 1.5**: Suggestions are timely (delivered when signal is fresh)

- Generated within 2 hours of signal detection
- Prioritized by urgency (critical → high → medium → low)
- Expire after expected timeline passes
- RMs can snooze if not ready to act

### Non-Functional Requirements

#### Performance

- ⚡ Suggestion generation completes in <5 seconds
- ⚡ Dashboard loads suggestions in <500ms
- ⚡ Realtime notification appears within 10 seconds

#### Accessibility

- ♿ Keyboard navigation for all actions
- ♿ Screen reader announces new suggestions
- ♿ High contrast for priority badges
- ♿ WCAG AA compliance

#### Security

- 🔒 RLS ensures RMs only see their own suggestions
- 🔒 No PII sent to OpenAI (use IDs, resolve names server-side)
- 🔒 Rate limiting on AI generation (prevent abuse)

---

## Modified Files

### New Files

```
app/
├── api/
│   └── suggestions/
│       ├── route.ts                ⬜ NEW - GET, POST suggestions
│       ├── generate/
│       │   └── route.ts            ⬜ NEW - AI suggestion generation
│       └── [id]/
│           ├── route.ts            ⬜ NEW - GET, PATCH, DELETE
│           └── actions/
│               └── route.ts        ⬜ NEW - Action handlers

app/(dashboard)/
└── suggestions/
    ├── page.tsx                    ⬜ NEW - All suggestions page
    └── components/
        ├── SuggestionCard.tsx      ⬜ NEW - Individual suggestion
        ├── SuggestionsList.tsx     ⬜ NEW - List container
        ├── SuggestionsSection.tsx  ⬜ NEW - Dashboard widget
        ├── SuggestionFilters.tsx   ⬜ NEW - Filter controls
        ├── SuggestionActions.tsx   ⬜ NEW - Action buttons
        └── hooks/
            ├── useSuggestions.ts   ⬜ NEW - Fetch suggestions
            ├── useSuggestionActions.ts ⬜ NEW - Action handlers
            └── useRealtimeSuggestions.ts ⬜ NEW - Realtime updates

services/
├── suggestionService.ts            ⬜ NEW - Business logic
└── suggestionGenerator.ts          ⬜ NEW - AI generation

lib/
├── openai/
│   └── suggestion-prompts.ts       ⬜ NEW - OpenAI prompts
└── utils/
    └── suggestion-helpers.ts       ⬜ NEW - Utility functions

types/
└── suggestion.ts                   ⬜ NEW - Type definitions

supabase/
└── migrations/
    └── create_suggestions_table.sql ⬜ NEW - Database schema
```

### Modified Files

```
app/(dashboard)/
└── page.tsx                        ✏️ MODIFY - Add suggestions section

lib/openai/
└── client.ts                       ✏️ MODIFY - Add suggestion methods

types/
└── index.ts                        ✏️ MODIFY - Export suggestion types
```

---

## Database Schema

### Suggestions Table

```sql
CREATE TABLE suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rm_id UUID REFERENCES auth.users(id) NOT NULL,
  client_id UUID REFERENCES clients(id) NOT NULL,
  signal_id UUID REFERENCES signals(id),
  
  -- Content
  title VARCHAR(500) NOT NULL,
  context TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  
  -- Metadata
  priority VARCHAR(20) NOT NULL,
  category VARCHAR(50) NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  -- Status
  status VARCHAR(20) DEFAULT 'new',
  viewed_at TIMESTAMPTZ,
  actioned_at TIMESTAMPTZ,
  snoozed_until TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  
  -- Engagement
  contacted_at TIMESTAMPTZ,
  outcome TEXT,
  dismiss_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_suggestions_rm ON suggestions(rm_id);
CREATE INDEX idx_suggestions_client ON suggestions(client_id);
CREATE INDEX idx_suggestions_status ON suggestions(status);
CREATE INDEX idx_suggestions_priority ON suggestions(priority);
CREATE INDEX idx_suggestions_generated_at ON suggestions(generated_at DESC);

-- RLS Policies
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RMs can view their own suggestions"
  ON suggestions FOR SELECT
  USING (rm_id = auth.uid());

CREATE POLICY "RMs can update their own suggestions"
  ON suggestions FOR UPDATE
  USING (rm_id = auth.uid());
```

---

## Implementation Status

**OVERALL STATUS**: ⬜ NOT STARTED

### Phase 1: Foundation & Setup

- ⬜ Create database migration for suggestions table
- ⬜ Set up type definitions
- ⬜ Configure OpenAI prompts
- ⬜ Create API route structure

### Phase 2: AI Generation

- ⬜ Build suggestionGenerator with OpenAI
- ⬜ Implement /api/suggestions/generate endpoint
- ⬜ Create background trigger for new signals
- ⬜ Test AI suggestion quality

### Phase 3: UI Components

- ⬜ Build SuggestionCard component
- ⬜ Create SuggestionsList
- ⬜ Add SuggestionsSection to dashboard
- ⬜ Implement action buttons

### Phase 4: Actions & State Management

- ⬜ Build useSuggestions hook
- ⬜ Implement useSuggestionActions
- ⬜ Create action API endpoints
- ⬜ Add activity logging

### Phase 5: Realtime & Polish

- ⬜ Set up Supabase Realtime subscriptions
- ⬜ Implement useRealtimeSuggestions
- ⬜ Add toast notifications
- ⬜ Build all suggestions page
- ⬜ Add filters
- ⬜ Performance optimization

---

## Dependencies

### Internal Dependencies

- ✅ Signals detection system
- ✅ Client database
- ✅ Supabase authentication
- ⬜ Design system components
- ⬜ Activity tracking

### External Dependencies

- OpenAI API (GPT-4)
- Supabase Realtime
- React Query
- React Hot Toast (notifications)

### NPM Packages

```bash
npm install openai react-hot-toast date-fns
```

---

## Risk Assessment

### Technical Risks

#### **Risk 1: AI Generation Quality**

- **Impact**: High - Poor suggestions hurt credibility
- **Mitigation**:
  - Extensive prompt engineering
  - Test with real scenarios
  - A/B test different prompts
  - Collect RM feedback
- **Contingency**: Template-based suggestions as fallback

#### **Risk 2: OpenAI API Latency/Costs**

- **Impact**: Medium - Slow generation or high costs
- **Mitigation**:
  - Cache similar suggestions
  - Batch process non-urgent signals
  - Set monthly budget caps
  - Monitor token usage
- **Contingency**: Use GPT-3.5-turbo for lower priority

#### **Risk 3: Realtime Notification Overload**

- **Impact**: Medium - Too many notifications annoy RMs
- **Mitigation**:
  - Only notify for critical/high priority
  - Batch notifications (max 1 per hour)
  - User preference for notification frequency
- **Contingency**: Email digest instead of real-time

### Business Risks

#### **Risk 1: Low Engagement**

- **Impact**: High - RMs ignore suggestions
- **Mitigation**:
  - Focus on quality over quantity
  - Personalize based on RM feedback
  - Show success stories
  - Track engagement metrics
- **Contingency**: Simplify to basic signal alerts

---

## Testing Strategy

### Unit Tests (Jest)

**Test File**: `services/suggestionGenerator.test.ts`

```typescript
describe('suggestionGenerator', () => {
  it('should generate suggestion for IPO signal', async () => {
    const signal = mockSignal({ type: 'ipo_filing', severity: 'high' });
    const client = mockClient({ leadScore: 85, estimatedWealth: 15000000000 });
    const rm = mockUser();
    
    const suggestion = await generateEngagementSuggestion(signal, client, rm);
    
    expect(suggestion.title).toContain(client.name);
    expect(suggestion.title).toContain('IPO');
    expect(suggestion.context).toBeTruthy();
    expect(suggestion.recommendedAction).toBeTruthy();
    expect(suggestion.priority).toBe('critical');
  });
  
  it('should calculate priority correctly', () => {
    const highValueHighSeverity = calculateSuggestionPriority(
      mockSignal({ severity: 'critical' }),
      mockClient({ leadScore: 90 })
    );
    expect(highValueHighSeverity).toBe('critical');
    
    const lowValueLowSeverity = calculateSuggestionPriority(
      mockSignal({ severity: 'low' }),
      mockClient({ leadScore: 40 })
    );
    expect(lowValueLowSeverity).toBe('low');
  });
});
```

### Integration Tests

**Test File**: `app/(dashboard)/suggestions/page.integration.test.tsx`

```typescript
describe('Suggestions Page', () => {
  it('should load and display suggestions', async () => {
    mockAPI('/api/suggestions', {
      data: {
        suggestions: [
          mockSuggestion({ priority: 'critical' }),
          mockSuggestion({ priority: 'high' })
        ],
        total: 2,
        newCount: 1
      }
    });
    
    const { getByText } = render(<SuggestionsPage />);
    
    await waitFor(() => {
      expect(getByText(/IPO Filing/i)).toBeInTheDocument();
      expect(getByText(/Series C/i)).toBeInTheDocument();
    });
  });
  
  it('should mark suggestion as contacted', async () => {
    const { getByTestId } = render(<SuggestionCard suggestion={mockSuggestion()} />);
    
    fireEvent.click(getByTestId('mark-contacted-button'));
    
    await waitFor(() => {
      expect(mockAPI).toHaveBeenCalledWith('/api/suggestions/123/actions', {
        method: 'PATCH',
        body: expect.objectContaining({ action: 'contact' })
      });
    });
  });
});
```

### E2E Tests (Playwright)

**Test File**: `e2e/suggestions-workflow.spec.ts`

```typescript
test.describe('Engagement Suggestions', () => {
  test('complete suggestion workflow', async ({ page }) => {
    await page.goto('/dashboard');
    
    // New suggestion appears
    await expect(page.locator('[data-testid="new-suggestion-badge"]')).toContainText('1');
    
    // Click on suggestion
    await page.click('[data-testid="suggestion-card"]');
    
    // Details visible
    await expect(page.locator('text=Recommended Action')).toBeVisible();
    
    // Mark as contacted
    await page.click('[data-testid="mark-contacted-button"]');
    
    // Optional outcome note
    await page.fill('[data-testid="outcome-input"]', 'Called and scheduled meeting');
    await page.click('[data-testid="submit-outcome"]');
    
    // Suggestion removed from list
    await expect(page.locator('[data-testid="suggestion-card"]')).toHaveCount(0);
  });
  
  test('snooze suggestion', async ({ page }) => {
    await page.goto('/suggestions');
    
    // Open snooze menu
    await page.click('[data-testid="snooze-button"]');
    
    // Select duration
    await page.click('text=3 days');
    
    // Suggestion marked as snoozed
    await expect(page.locator('[data-testid="suggestion-card"]')).toHaveClass(/snoozed/);
  });
});
```

---

## Performance Considerations

### Bundle Optimization

- **Code splitting**: Lazy load suggestions page
- **Tree shaking**: Import only used components

### Runtime Performance

- **Memoization**: Cache AI responses for similar signals
- **Debouncing**: Throttle realtime updates
- **Pagination**: Load 10 suggestions at a time

### Caching Strategy

- **Query caching**: Cache suggestions for 2 minutes
- **AI caching**: Store generated suggestions for similar scenarios
- **Realtime optimization**: Batch updates (max 1/10 seconds)

---

## Deployment Plan

### Development Phase

1. **Feature branch**: `feature/09-engagement-suggestions`
2. **Environment**: Development with test OpenAI key
3. **Testing**: Validate AI suggestion quality
4. **Code review**: PR with sample suggestions

### Staging Phase

1. **Deploy to staging**: With real signal data
2. **UAT**: 3-5 RMs test suggestions
3. **AI Quality Review**: Ensure suggestions are actionable
4. **Performance test**: Generate 50+ suggestions

### Production Phase

1. **Feature flag**: Enable for 20% of RMs (canary)
2. **Monitor metrics**:
   - Suggestion generation time
   - Engagement rate (contacted %)
   - OpenAI costs
3. **Gradual rollout**: 20% → 50% → 100% over 2 weeks
4. **Rollback plan**: Feature flag disable

---

## Monitoring & Analytics

### Performance Metrics

- **Generation Time**: Average time to generate suggestion
- **API Latency**: OpenAI response time
- **Suggestion Load Time**: Time to display on dashboard

### Business Metrics

- **Engagement Rate**: % of suggestions acted upon
- **Time to Action**: Hours from generation to contact
- **Suggestion Quality**: RM feedback score
- **Conversion Rate**: Suggestions leading to deals

### Technical Metrics

- **OpenAI Token Usage**: Tokens per suggestion
- **Cost Per Suggestion**: Total OpenAI cost
- **Error Rate**: Failed generations / total

---

## Documentation Requirements

### Technical Documentation

- **AI Prompt Engineering Guide**: How suggestions are generated
- **Suggestion Categories**: Definition of each category
- **Priority Calculation**: Algorithm explanation

### User Documentation

- **Suggestions Guide**: "How to Use Engagement Suggestions"
- **Best Practices**: "Making the Most of AI Suggestions"
- **FAQ**: Common questions about accuracy, timing

---

## Post-Launch Review

### Success Criteria

- ✅ 70%+ of suggestions acted upon within 48 hours
- ✅ Suggestion generation time <5 seconds
- ✅ RM satisfaction score >4.0/5.0
- ✅ OpenAI costs <$200/month for 30 RMs

### Retrospective Items

- **Lessons Learned**: AI prompt optimization, notification fatigue
- **Process Improvements**: Better quality testing
- **Technical Debt**: Refactor prompt templates

### Future Enhancements

- **Learning from Feedback**: RMs rate suggestion quality
- **Outcome Tracking**: Track which suggestions led to conversions
- **Multi-language**: Support Hindi/Marathi suggestions
- **Batch Insights**: Weekly digest of top suggestions

---

## Sign-off

**Created by**: AI Implementation Planner
**Date**: 2025-12-19
**Version**: 1.0
**Status**: Ready for Review

**Approval Required From**:

- [ ] Product Manager (business requirements)
- [ ] Tech Lead (architecture review)
- [ ] AI/ML Team (prompt quality validation)
- [ ] RM Representatives (suggestion relevance)

---

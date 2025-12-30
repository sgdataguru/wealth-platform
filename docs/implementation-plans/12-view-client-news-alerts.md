# 12 - View Client-Specific News Alerts - Implementation Plan

## Project Context

**Technical Stack**: Next.js 15 (App Router), React 18, TypeScript, TailwindCSS
**News APIs**: NewsAPI, custom RSS aggregators, web scraping services
**AI/LLM**: OpenAI GPT-4 for news summarization and relevance scoring
**Backend**: Supabase (PostgreSQL), Supabase Edge Functions for news polling
**Infrastructure**: Vercel (Frontend), Supabase (Backend), External News APIs

---

## User Story

**As a** Relationship Manager,
**I want** to see news alerts filtered specifically for my prospects and target clients,
**so that** I stay informed about relevant developments without manually monitoring news channels.

---

## Pre-conditions

- Supabase database with `clients` and `news_articles` tables
- User is authenticated as an RM
- RM has assigned clients in the system
- NewsAPI or similar news aggregation service configured
- Background job for polling news feeds operational

---

## Business Requirements

- **Client-Specific News**: Only show news mentioning RM's clients, not generic market news
  - *Success Metric*: 90%+ of news items are relevant to assigned clients
  
- **Real-Time Updates**: News feed updated throughout the day
  - *Success Metric*: New news appears within 4 hours of publication
  
  - **High-Value Focus**: Prioritize news for $100 Million+ UHNW individuals
  - *Success Metric*: News for top 20% clients appears first
  
- **Actionable Information**: Each news item linked to affected clients
  - *Success Metric*: 95%+ of news items correctly linked to clients
  
- **Effortless Monitoring**: Replace manual news channel monitoring
  - *Success Metric*: RMs spend 50% less time on manual news monitoring

---

## Technical Specifications

### Integration Points

- **NewsAPI**: Primary news aggregation service
- **RSS Feeds**: Business newspapers (Economic Times, Business Standard, Mint)
- **Web Scraping**: PrivateCircle, VCCircle for VC/PE news
- **OpenAI GPT-4**: Summarization and relevance scoring
- **Supabase Edge Functions**: Background news polling (cron job)

### Security Requirements

- News content stored encrypted at rest
- NewsAPI key secured in environment variables
- Rate limiting on news API calls
- RLS ensures RMs only see news for their clients

### Data Flow

```
Background Job (Every 4 hours) → Fetch News from APIs →
Name Entity Recognition (NER) → Match to Clients →
AI Summarization → Store in Database →
Realtime Push to RM Dashboard
```

---

## Design Specifications

### Visual Layout & Components

**News Feed Page**:

```
┌─────────────────────────────────────────────────────────────┐
│  Client News Feed                     [Filter ▼] [Mark All] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 🔴 NEW  |  2 hours ago                      [×] Dismiss ││
│  │                                                          ││
│  │ TechCorp India Raises $50M Series C Funding              ││
│  │ Economic Times | 19 Dec 2025, 10:30 AM                  ││
│  │                                                          ││
│  │ TechCorp India, a fintech unicorn, has raised $50M in   ││
│  │ Series C funding led by Tiger Global...                 ││
│  │                                                          ││
│  │ 👤 Related Clients:                                      ││
│  │ • Rajesh Sharma (CEO, 35% stake)                         ││
│  │ • Vikram Singh (Investor)                                ││
│  │                                                          ││
│  │ [Read Full Article →]  [View Rajesh's Profile]          ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 📰 READ  |  1 day ago                        [×] Dismiss ││
│  │                                                          ││
│  │ E-Commerce Solutions Plans IPO for Q2 2025              ││
│  │ Business Standard | 18 Dec 2025, 3:15 PM                ││
│  │                                                          ││
│  │ E-Commerce Solutions is planning to file for IPO...     ││
│  │                                                          ││
│  │ 👤 Related Clients:                                      ││
│  │ • Amit Patel (Founder, 42% stake)                        ││
│  │                                                          ││
│  │ [Read Full Article →]  [View Amit's Profile]            ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Component Hierarchy**:

```tsx
<NewsFeedPage>
  <PageHeader>
    <Title />
    <FilterDropdown />
    <MarkAllReadButton />
  </PageHeader>
  <NewsFeedList>
    <NewsCard>
      <NewsHeader />
      <NewsContent />
      <NewsSummary />
      <RelatedClients>
        <ClientChip />
      </RelatedClients>
      <NewsActions>
        <ReadArticleButton />
        <ViewClientButton />
        <DismissButton />
      </NewsActions>
    </NewsCard>
  </NewsFeedList>
  <LoadMoreButton />
</NewsFeedPage>
```

### Design System Compliance

**Color Palette**:

```css
/* News Card States */
--news-new: #EFF6FF;              /* Light blue - unread */
--news-read: #FFFFFF;             /* White - read */
--news-priority: #FFF7ED;         /* Light orange - high priority */

/* Priority Levels */
--priority-high: #DC3545;         /* Red - critical news */
--priority-medium: #FFC107;       /* Amber - important */
--priority-low: #6C757D;          /* Gray - informational */
```

**Typography**:

```css
/* News Card Typography */
--news-title-size: 1.125rem;      /* 18px */
--news-title-weight: 600;
--news-source-size: 0.75rem;      /* 12px */
--news-summary-size: 0.875rem;    /* 14px */
```

### Responsive Behavior

**Desktop (1024px+)**:

- News cards in single column, full width
- Right sidebar for filters (optional)
- 5 news items per page

**Tablet (768px - 1023px)**:

- Full-width cards
- Collapsible filters
- 5 news items per page

**Mobile (<768px)**:

- Compact card layout
- Swipe to dismiss
- 3 news items per initial load

### Interaction Patterns

**News Card States**:

```typescript
interface NewsCardStates {
  new: 'bg-blue-50 border-blue-300 font-semibold';
  read: 'bg-white border-gray-200 opacity-70';
  priority: 'bg-orange-50 border-orange-300';
  dismissed: 'hidden';
}
```

**Action Behaviors**:

```typescript
interface NewsActions {
  readArticle: 'Open external link in new tab, mark as read';
  viewClient: 'Navigate to client detail page';
  dismiss: 'Hide news item, mark as dismissed';
  markAllRead: 'Mark all visible news as read';
}
```

---

## Technical Architecture

### Component Structure

```
app/(dashboard)/
└── news/
    ├── page.tsx                      # News feed page
    └── components/
        ├── NewsCard.tsx              # Individual news item
        ├── NewsFeedList.tsx          # List container
        ├── NewsFilters.tsx           # Filter controls
        ├── RelatedClients.tsx        # Client chips
        ├── NewsSummary.tsx           # AI summary
        └── hooks/
            ├── useNews.ts            # Fetch news
            ├── useNewsActions.ts     # Mark read, dismiss
            └── useRealtimeNews.ts    # Realtime updates

app/api/
└── news/
    ├── route.ts                      # GET news feed
    ├── fetch/
    │   └── route.ts                  # POST trigger news fetch (cron)
    └── [id]/
        ├── route.ts                  # GET, DELETE news
        └── actions/
            └── route.ts              # PATCH mark read, dismiss

services/
├── newsService.ts                    # Business logic
├── newsAggregator.ts                 # Fetch from multiple sources
└── newsProcessor.ts                  # NER, client matching, summarization

lib/
├── newsapi/
│   └── client.ts                     # NewsAPI integration
├── openai/
│   └── news-prompts.ts               # Summarization prompts
└── utils/
    ├── entity-recognition.ts         # Name entity recognition
    └── news-helpers.ts               # Utility functions

types/
└── news.ts                           # Type definitions

supabase/
└── functions/
    └── fetch-news/                   # Edge Function for cron
        └── index.ts
```

### State Management Architecture

**News State Interface**:

```typescript
interface NewsState {
  // Data
  newsArticles: NewsArticle[];
  isLoading: boolean;
  error: string | null;
  
  // Filters
  filters: NewsFilters;
  
  // UI State
  selectedArticleId: string | null;
  newArticlesCount: number;
  
  // Pagination
  hasMore: boolean;
  offset: number;
}

interface NewsArticle {
  id: string;
  
  // Content
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: Date;
  
  // Client Linking
  linkedClientIds: string[];
  linkedClients: Array<{
    id: string;
    name: string;
    company: string;
    relationship: string;  // e.g., "CEO", "Investor", "Board Member"
  }>;
  
  // Priority
  priority: NewsPriority;
  
  // AI Analysis
  aiSummary?: string;
  relevanceScore: number;  // 0-100
  suggestedAction?: string;
  
  // Status
  isRead: boolean;
  isDismissed: boolean;
  readAt?: Date;
  dismissedAt?: Date;
  
  createdAt: Date;
}

type NewsPriority = 'high' | 'medium' | 'low';

interface NewsFilters {
  priority?: NewsPriority[];
  status?: ('new' | 'read')[];
  clientIds?: string[];
  dateRange?: DateRange;
  sources?: string[];
}
```

**News Actions**:

```typescript
interface NewsActions {
  // Data Loading
  loadNews: (filters?: NewsFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  refreshNews: () => Promise<void>;
  
  // Article Actions
  markAsRead: (articleId: string) => Promise<void>;
  dismissArticle: (articleId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  
  // Filtering
  updateFilters: (filters: Partial<NewsFilters>) => void;
  resetFilters: () => void;
  
  // Realtime
  subscribeToUpdates: () => void;
  unsubscribeFromUpdates: () => void;
}
```

### API Integration Schema

**News API** (`/api/news/route.ts`):

```typescript
// GET Request
interface GetNewsRequest {
  rmId: string;
  filters?: NewsFilters;
  limit?: number;
  offset?: number;
}

// Response
interface NewsResponse {
  success: boolean;
  data: {
    articles: NewsArticle[];
    total: number;
    newCount: number;
    hasMore: boolean;
  };
}
```

**News Fetch API** (`/api/news/fetch/route.ts`):

```typescript
// POST Request (Triggered by cron)
interface FetchNewsRequest {
  clientIds?: string[];  // Optional: specific clients
  sources?: string[];    // Optional: specific sources
}

// Response
interface FetchNewsResponse {
  success: boolean;
  data: {
    articlesFound: number;
    articlesStored: number;
    clientsMatched: number;
  };
}
```

---

## Implementation Requirements

### Core Components

#### 1. `NewsCard.tsx` - Individual news item

- Display headline, source, date
- AI-generated summary
- Related clients with relationship labels
- Read/dismiss actions
- External link to full article

#### 2. `NewsFeedList.tsx` - News list container

- Displays news sorted by priority and recency
- Infinite scroll or pagination
- Empty state when no news
- Loading skeleton

#### 3. `NewsFilters.tsx` - Filter controls

- Filter by priority (high/medium/low)
- Filter by status (new/read)
- Filter by client
- Filter by source
- Date range selector

#### 4. `RelatedClients.tsx` - Client chips

- Show linked clients with avatars
- Click to navigate to client profile
- Show relationship type (CEO, Investor, etc.)

### Custom Hooks

#### `useNews()` - Fetch news with filters

```typescript
export function useNews(
  rmId: string,
  filters?: NewsFilters
) {
  return useQuery({
    queryKey: ['news', rmId, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        rmId,
        ...filters,
        limit: '10',
        offset: '0'
      });
      
      const response = await fetch(`/api/news?${params}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      
      const data = await response.json();
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
  });
}
```

#### `useRealtimeNews()` - Realtime news updates

```typescript
export function useRealtimeNews(rmId: string) {
  const [newCount, setNewCount] = useState(0);
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const channel = supabase
      .channel('news-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'news_articles',
        filter: `linked_client_ids.cs.{${getClientIds(rmId)}}`
      }, (payload) => {
        setNewCount(prev => prev + 1);
        queryClient.invalidateQueries(['news', rmId]);
        
        toast.info('New client news available');
      })
      .subscribe();
    
    return () => {
      channel.unsubscribe();
    };
  }, [rmId]);
  
  return { newCount, clearNewCount: () => setNewCount(0) };
}
```

#### `useNewsActions()` - News actions

```typescript
export function useNewsActions() {
  const queryClient = useQueryClient();
  
  const markAsRead = useMutation({
    mutationFn: async (articleId: string) => {
      const response = await fetch(`/api/news/${articleId}/actions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'read' })
      });
      
      if (!response.ok) throw new Error('Failed to mark as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['news']);
    }
  });
  
  const dismissArticle = useMutation({
    mutationFn: async (articleId: string) => {
      const response = await fetch(`/api/news/${articleId}/actions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss' })
      });
      
      if (!response.ok) throw new Error('Failed to dismiss');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['news']);
      toast.success('Article dismissed');
    }
  });
  
  return { markAsRead, dismissArticle };
}
```

### Service Functions

#### `services/newsAggregator.ts` - Fetch from multiple sources

```typescript
export async function fetchNewsFromSources(
  clientNames: string[],
  companies: string[],
  since: Date
): Promise<RawNewsArticle[]> {
  const newsArticles: RawNewsArticle[] = [];
  
  // Fetch from NewsAPI
  const newsApiArticles = await fetchFromNewsAPI(clientNames, companies, since);
  newsArticles.push(...newsApiArticles);
  
  // Fetch from RSS feeds (ET, BS, Mint)
  const rssArticles = await fetchFromRSSFeeds(clientNames, companies, since);
  newsArticles.push(...rssArticles);
  
  // Fetch from PrivateCircle (VC/PE news)
  const vcArticles = await fetchFromPrivateCircle(companies, since);
  newsArticles.push(...vcArticles);
  
  // De-duplicate
  const unique = deduplicateArticles(newsArticles);
  
  return unique;
}

async function fetchFromNewsAPI(
  keywords: string[],
  companies: string[],
  since: Date
): Promise<RawNewsArticle[]> {
  const query = [
    ...keywords.map(k => `"${k}"`),
    ...companies.map(c => `"${c}"`)
  ].join(' OR ');
  
  const response = await fetch(
    `https://newsapi.org/v2/everything?` +
    `q=${encodeURIComponent(query)}&` +
    `from=${since.toISOString()}&` +
    `sortBy=publishedAt&` +
    `language=en&` +
    `apiKey=${process.env.NEWSAPI_KEY}`
  );
  
  if (!response.ok) throw new Error('NewsAPI request failed');
  
  const data = await response.json();
  return data.articles.map(transformNewsAPIArticle);
}
```

#### `services/newsProcessor.ts` - Process and match news to clients

```typescript
export async function processNewsArticle(
  article: RawNewsArticle,
  clients: Client[]
): Promise<ProcessedNewsArticle | null> {
  // Extract named entities from article
  const entities = await extractNamedEntities(article.title + ' ' + article.description);
  
  // Match entities to clients
  const matchedClients = matchEntitiesToClients(entities, clients);
  
  if (matchedClients.length === 0) {
    return null; // Not relevant to any clients
  }
  
  // Generate AI summary
  const aiSummary = await generateNewsSummary(article);
  
  // Calculate relevance score
  const relevanceScore = calculateRelevanceScore(article, matchedClients);
  
  // Determine priority
  const priority = determinePriority(matchedClients, relevanceScore);
  
  // Generate suggested action (optional)
  const suggestedAction = await generateSuggestedAction(article, matchedClients);
  
  return {
    ...article,
    linkedClientIds: matchedClients.map(c => c.id),
    linkedClients: matchedClients.map(c => ({
      id: c.id,
      name: c.name,
      company: c.company,
      relationship: determineRelationship(c, article)
    })),
    aiSummary,
    relevanceScore,
    priority,
    suggestedAction
  };
}

async function extractNamedEntities(text: string): Promise<string[]> {
  // Option 1: Use OpenAI for NER
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'Extract person names and company names from the text. Return as JSON array.'
      },
      { role: 'user', content: text }
    ],
    temperature: 0.3
  });
  
  const entities = JSON.parse(completion.choices[0].message.content);
  return entities;
  
  // Option 2: Simple keyword matching (fallback)
  // return simpleKeywordMatching(text);
}

function matchEntitiesToClients(
  entities: string[],
  clients: Client[]
): Client[] {
  const matched: Client[] = [];
  
  for (const client of clients) {
    // Check if client name appears
    if (entities.some(e => e.toLowerCase().includes(client.name.toLowerCase()))) {
      matched.push(client);
      continue;
    }
    
    // Check if company name appears
    if (entities.some(e => e.toLowerCase().includes(client.company.toLowerCase()))) {
      matched.push(client);
    }
  }
  
  return matched;
}

function calculateRelevanceScore(
  article: RawNewsArticle,
  clients: Client[]
): number {
  let score = 50; // Base score
  
  // Boost for high-value clients
  const avgWealth = clients.reduce((sum, c) => sum + c.estimatedWealth, 0) / clients.length;
  if (avgWealth > 50_000_000_000) score += 20; // ₹500Cr+
  else if (avgWealth > 20_000_000_000) score += 10; // ₹200Cr+
  
  // Boost for multiple mentions
  const mentionCount = countMentions(article.title + article.description, clients);
  score += Math.min(mentionCount * 5, 20);
  
  // Penalize for generic/common words
  if (isGenericArticle(article)) score -= 20;
  
  return Math.max(0, Math.min(100, score));
}
```

#### `lib/openai/news-prompts.ts` - News summarization

```typescript
export async function generateNewsSummary(
  article: RawNewsArticle
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `Summarize news articles for wealth managers in 2-3 sentences.
        Focus on: what happened, who is involved, and potential wealth/investment implications.`
      },
      {
        role: 'user',
        content: `Title: ${article.title}\n\nContent: ${article.description}`
      }
    ],
    temperature: 0.7,
    max_tokens: 150
  });
  
  return completion.choices[0].message.content;
}
```

---

## Background Job (Supabase Edge Function)

### `supabase/functions/fetch-news/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    // Get all active clients
    const { data: clients } = await supabase
      .from('clients')
      .select('id, name, company, estimated_wealth')
      .gte('estimated_wealth', 10_000_000_000); // $100 Million+
    
    if (!clients || clients.length === 0) {
      return new Response(JSON.stringify({ message: 'No clients found' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Fetch news from last 24 hours
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const clientNames = clients.map(c => c.name);
    const companies = clients.map(c => c.company);
    
    const rawArticles = await fetchNewsFromSources(clientNames, companies, since);
    
    let articlesStored = 0;
    let clientsMatched = 0;
    
    for (const rawArticle of rawArticles) {
      const processed = await processNewsArticle(rawArticle, clients);
      
      if (processed && processed.linkedClientIds.length > 0) {
        // Store in database
        await supabase.from('news_articles').insert({
          title: processed.title,
          summary: processed.summary,
          url: processed.url,
          source: processed.source,
          published_at: processed.publishedAt,
          linked_client_ids: processed.linkedClientIds,
          priority: processed.priority,
          ai_summary: processed.aiSummary,
          relevance_score: processed.relevanceScore,
          suggested_action: processed.suggestedAction,
          is_read: false,
          is_dismissed: false
        });
        
        articlesStored++;
        clientsMatched += processed.linkedClientIds.length;
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        articlesFound: rawArticles.length,
        articlesStored,
        clientsMatched
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

**Cron Setup** (in Supabase):

```sql
-- Schedule to run every 4 hours
SELECT cron.schedule(
  'fetch-news',
  '0 */4 * * *',  -- Every 4 hours
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/fetch-news',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  ) as request_id;
  $$
);
```

---

## Acceptance Criteria

### Functional Requirements

#### Core Feature Functionality

✅ **AC 1.1**: News feed displays articles relevant to tracked prospects

- News feed page shows client-specific news
- Each article mentions at least one RM's client
- Generic market news is filtered out

✅ **AC 1.2**: News filtered based on TAM client list

- Only news for $100 Million+ UHNW clients
- Focused on RM's assigned clients
- Covers top prospect list

✅ **AC 1.3**: Each news item shows required details

- Headline (clear and readable)
- Source (Economic Times, Business Standard, etc.)
- Publication date and time
- Linked prospect names with relationship labels

✅ **AC 1.4**: News updated in near real-time

- Background job runs every 4 hours
- New articles appear within 4 hours of publication
- Realtime push notifications for critical news

✅ **AC 1.5**: RM can click through to read full article

- "Read Full Article" button opens external link in new tab
- Link opens correctly without errors
- Mark as read when clicked

✅ **AC 1.6**: News is client-specific, not generic

- Entity recognition matches client/company names
- Relevance score filters out low-quality matches
- AI validates relevance before storing

### Non-Functional Requirements

#### Performance

- ⚡ News feed loads in <1 second
- ⚡ Background news fetch completes in <2 minutes
- ⚡ News API rate limits respected

#### Accessibility

- ♿ Keyboard navigation
- ♿ Screen reader compatible
- ♿ WCAG AA compliance

#### Security

- 🔒 RLS limits news to RM's clients
- 🔒 NewsAPI key secured
- 🔒 External links sanitized

---

## Modified Files

### New Files

```
app/
├── api/
│   └── news/
│       ├── route.ts                ⬜ NEW - GET news feed
│       ├── fetch/
│       │   └── route.ts            ⬜ NEW - POST trigger fetch
│       └── [id]/
│           ├── route.ts            ⬜ NEW - GET, DELETE
│           └── actions/
│               └── route.ts        ⬜ NEW - PATCH mark read/dismiss

app/(dashboard)/
└── news/
    ├── page.tsx                    ⬜ NEW - News feed page
    └── components/
        ├── NewsCard.tsx            ⬜ NEW - News item card
        ├── NewsFeedList.tsx        ⬜ NEW - List container
        ├── NewsFilters.tsx         ⬜ NEW - Filter controls
        ├── RelatedClients.tsx      ⬜ NEW - Client chips
        ├── NewsSummary.tsx         ⬜ NEW - AI summary
        └── hooks/
            ├── useNews.ts          ⬜ NEW - Fetch news
            ├── useNewsActions.ts   ⬜ NEW - Actions
            └── useRealtimeNews.ts  ⬜ NEW - Realtime updates

services/
├── newsService.ts                  ⬜ NEW - Business logic
├── newsAggregator.ts               ⬜ NEW - Multi-source fetching
└── newsProcessor.ts                ⬜ NEW - NER, matching, AI

lib/
├── newsapi/
│   └── client.ts                   ⬜ NEW - NewsAPI integration
├── openai/
│   └── news-prompts.ts             ⬜ NEW - Summarization
└── utils/
    ├── entity-recognition.ts       ⬜ NEW - NER
    └── news-helpers.ts             ⬜ NEW - Utilities

types/
└── news.ts                         ⬜ NEW - Type definitions

supabase/
├── functions/
│   └── fetch-news/
│       └── index.ts                ⬜ NEW - Edge Function
└── migrations/
    └── create_news_table.sql       ⬜ NEW - Database schema
```

### Modified Files

```
app/(dashboard)/
└── page.tsx                        ✏️ MODIFY - Add news widget

types/
└── index.ts                        ✏️ MODIFY - Export news types
```

---

## Database Schema

### News Articles Table

```sql
CREATE TABLE news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  title VARCHAR(500) NOT NULL,
  summary TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  source VARCHAR(255) NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  
  -- Client Linking
  linked_client_ids UUID[] DEFAULT '{}',
  
  -- Priority \u0026 Relevance
  priority VARCHAR(20) DEFAULT 'low',
  relevance_score INTEGER DEFAULT 50,
  
  -- AI Analysis
  ai_summary TEXT,
  suggested_action TEXT,
  
  -- Status (per RM - handled via join table or JSON)
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_news_published_at ON news_articles(published_at DESC);
CREATE INDEX idx_news_linked_clients ON news_articles USING GIN(linked_client_ids);
CREATE INDEX idx_news_priority ON news_articles(priority);
CREATE INDEX idx_news_status ON news_articles(is_read, is_dismissed);

-- RLS Policies
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RMs can view news for their clients"
  ON news_articles FOR SELECT
  USING (
    linked_client_ids && (
      SELECT ARRAY_AGG(id) FROM clients WHERE assigned_rm_id = auth.uid()
    )
  );
```

---

## Implementation Status

**OVERALL STATUS**: ⬜ NOT STARTED

### Phase 1: Foundation & Setup

- ⬜ Create database migration
- ⬜ Set up NewsAPI account
- ⬜ Create type definitions
- ⬜ Set up API route structure

### Phase 2: News Aggregation

- ⬜ Build newsAggregator service
- ⬜ Implement NewsAPI integration
- ⬜ Add RSS feed parsing
- ⬜ Test multi-source fetching

### Phase 3: News Processing

- ⬜ Implement entity recognition
- ⬜ Build client matching logic
- ⬜ Add AI summarization
- ⬜ Calculate relevance scores

### Phase 4: Background Job

- ⬜ Create Supabase Edge Function
- ⬜ Set up cron schedule (every 4 hours)
- ⬜ Test background processing
- ⬜ Monitor and optimize

### Phase 5: UI Components

- ⬜ Build NewsCard component
- ⬜ Create NewsFeedList
- ⬜ Add NewsFilters
- ⬜ Implement news actions
- ⬜ Add realtime updates

---

## Dependencies

### Internal Dependencies

- ✅ Clients table
- ✅ Supabase authentication
- ⬜ Design system components
- ⬜ Activity tracking

### External Dependencies

- NewsAPI subscription
- OpenAI API (summarization)
- Supabase Edge Functions
- pg_cron (Supabase)

### NPM Packages

```bash
npm install @supabase/supabase-js date-fns
```

---

## Risk Assessment

### Technical Risks

#### **Risk 1: News API Rate Limits**

- **Impact**: High - Exceed free tier limits
- **Mitigation**:
  - Cache news articles (don't re-fetch)
  - Limit to top 1000 clients
  - Use RSS feeds as backup
  - Monitor API usage
- **Contingency**: Paid NewsAPI plan or alternative sources

#### **Risk 2: Entity Recognition Accuracy**

- **Impact**: High - Wrong client matches
- **Mitigation**:
  - Combine keyword matching + AI NER
  - Require minimum relevance score
  - Allow manual correction by RMs
  - A/B test different NER methods
- **Contingency**: Simple keyword matching fallback

#### **Risk 3: Background Job Performance**

- **Impact**: Medium - Slow news processing
- **Mitigation**:
  - Batch processing (50 articles at a time)
  - Parallel processing where possible
  - Set timeout limits
  - Monitor execution time
- **Contingency**: Increase frequency, reduce batch size

### Business Risks

#### **Risk 1: Information Overload**

- **Impact**: Medium - Too many news items
- **Mitigation**:
  - Smart filtering (high relevance only)
  - Prioritize by client value
  - Allow granular filters
  - Digest mode (daily summary)
- **Contingency**: Show top 10 only by default

---

## Testing Strategy

### Unit Tests (Jest)

```typescript
describe('newsProcessor', () => {
  it('should match client names to news articles', () => {
    const article = mockArticle({ title: 'Rajesh Sharma raises funds' });
    const clients = [mockClient({ name: 'Rajesh Sharma' })];
    
    const matched = matchEntitiesToClients(['Rajesh Sharma'], clients);
    
    expect(matched.length).toBe(1);
    expect(matched[0].name).toBe('Rajesh Sharma');
  });
  
  it('should calculate relevance score correctly', () => {
    const article = mockArticle();
    const highValueClient = mockClient({ estimatedWealth: 60_000_000_000 });
    
    const score = calculateRelevanceScore(article, [highValueClient]);
    
    expect(score).toBeGreaterThan(70);
  });
});
```

### E2E Tests (Playwright)

```typescript
test.describe('Client News Feed', () => {
  test('view client news feed', async ({ page }) => {
    await page.goto('/news');
    
    // News cards visible
    await expect(page.locator('[data-testid="news-card"]').first()).toBeVisible();
    
    // Click read article
    await page.click('[data-testid="read-article-button"]');
    
    // New tab opens (check page count changed)
  });
});
```

---

## Post-Launch Review

### Success Criteria

- ✅ 90%+ news relevance accuracy
- ✅ News updates within 4 hours
- ✅ 70%+ RM engagement with news feed weekly
- ✅ 50% reduction in manual news monitoring time

---

## Sign-off

**Created by**: AI Implementation Planner
**Date**: 2025-12-19
**Version**: 1.0
**Status**: Ready for Review

---

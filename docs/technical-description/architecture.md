# UHNW Liquidity Intelligence Platform

## Technical Architecture Document

**Version:** 1.0.0  
**Created:** 2025-12-17  
**Status:** Draft

---

## 1. Application Overview

### Purpose

A web application designed for Relationship Managers (RMs) handling Ultra High Net Worth (UHNW) clients. The platform helps identify early liquidity signals before they become obvious in the market, enabling proactive client engagement and first-mover advantage.

### Architecture Pattern

Next.js 15 App Router with Server-First Architecture, leveraging Server Components for data fetching and Client Components for interactivity.

### Key Capabilities

- 🔍 **Early Signal Detection** - Aggregate liquidity signals from multiple data sources
- 📊 **Lead Scoring** - Explainable scoring based on signal strength and relevance
- 🔗 **Relationship Mapping** - Graph-based visualization of entity relationships
- 🤖 **AI Chatbot** - Natural language queries against the intelligence database
- 📈 **Activity Tracking** - Dashboard metrics for leads and follow-ups

---

## 2. Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Next.js 15 | Server components, App Router, built-in API routes, streaming |
| **Language** | TypeScript 5.x | Type safety, better developer experience, reduced runtime errors |
| **Styling** | Tailwind CSS 3.x | Utility-first, design system support, premium aesthetic |
| **UI Components** | Radix UI + Custom | Accessible primitives with Nuvama-inspired styling |
| **Database** | Supabase (PostgreSQL) | Real-time subscriptions, auth, row-level security |
| **Graph Database** | Neo4j Aura | Relationship mapping between entities, liquidity events |
| **State Management** | Server Components + Zustand | Minimal client state, server-first data fetching |
| **Authentication** | Supabase Auth | Built-in, secure, role-based access |
| **AI/LLM** | OpenAI GPT-4 / Vercel AI SDK | Chatbot, lead score explanations |
| **Data Ingestion** | Node.js Workers | ETL from PrivateCircle, Zauba, IPO data sources |
| **Charts** | Recharts / Tremor | Data visualization for metrics and graphs |
| **Forms** | React Hook Form + Zod | Type-safe form validation |

---

## 3. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    Next.js App (Browser)                         │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │   │
│  │  │Dashboard │  │Prospects │  │ Signals  │  │    AI Chatbot    │ │   │
│  │  │   Page   │  │   Page   │  │   Page   │  │   (Floating)     │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           SERVER LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                   Next.js API Routes                             │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐  │   │
│  │  │/api/       │  │/api/       │  │/api/       │  │/api/      │  │   │
│  │  │prospects   │  │signals     │  │chat        │  │metrics    │  │   │
│  │  └────────────┘  └────────────┘  └────────────┘  └───────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                   Service Layer                                  │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐  │   │
│  │  │ Prospect   │  │  Signal    │  │   Chat     │  │  Graph    │  │   │
│  │  │  Service   │  │  Service   │  │  Service   │  │  Service  │  │   │
│  │  └────────────┘  └────────────┘  └────────────┘  └───────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │    Supabase      │  │     Neo4j        │  │     OpenAI API       │  │
│  │   (PostgreSQL)   │  │  (Graph DB)      │  │     (LLM)            │  │
│  │                  │  │                  │  │                      │  │
│  │ • Users          │  │ • Persons        │  │ • Chat completions   │  │
│  │ • Prospects      │  │ • Companies      │  │ • Lead explanations  │  │
│  │ • Signals        │  │ • Sectors        │  │                      │  │
│  │ • Activities     │  │ • Events         │  │                      │  │
│  │ • Lead Scores    │  │ • Relationships  │  │                      │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL DATA SOURCES                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────────┐│
│  │PrivateCircle│  │   Zauba   │  │  IPO Data  │  │ Market Intelligence││
│  │  (VC/PE)    │  │ (Company) │  │ (Exchange) │  │    (Promoters)     ││
│  └────────────┘  └────────────┘  └────────────┘  └────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Project Folder Structure

```
uhnw/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth route group (public)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/                  # Main app route group (protected)
│   │   ├── page.tsx                  # Dashboard home
│   │   ├── prospects/
│   │   │   ├── page.tsx              # Prospects list with filters
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Prospect detail view
│   │   ├── signals/
│   │   │   └── page.tsx              # Liquidity signals feed
│   │   ├── graph/
│   │   │   └── page.tsx              # Relationship graph explorer
│   │   ├── analytics/
│   │   │   └── page.tsx              # Metrics dashboard
│   │   └── layout.tsx                # Dashboard shell layout
│   │
│   ├── api/                          # API routes
│   │   ├── prospects/
│   │   │   ├── route.ts              # GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       └── route.ts          # GET, PATCH, DELETE
│   │   ├── signals/
│   │   │   ├── route.ts              # GET signals
│   │   │   └── recent/
│   │   │       └── route.ts          # GET recent signals
│   │   ├── chat/
│   │   │   └── route.ts              # POST chat message (streaming)
│   │   ├── graph/
│   │   │   └── route.ts              # GET graph data
│   │   ├── metrics/
│   │   │   └── route.ts              # GET dashboard metrics
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts          # Supabase auth callback
│   │
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Global styles + CSS variables
│   ├── loading.tsx                   # Global loading UI
│   ├── error.tsx                     # Global error boundary
│   └── not-found.tsx                 # 404 page
│
├── components/                       # React components
│   ├── ui/                           # Base UI primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Dialog.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Tooltip.tsx
│   │   └── index.ts                  # Barrel export
│   │
│   ├── layout/                       # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   └── PageHeader.tsx
│   │
│   └── features/                     # Feature-specific components
│       ├── prospects/
│       │   ├── ProspectCard.tsx
│       │   ├── ProspectList.tsx
│       │   ├── ProspectDetail.tsx
│       │   └── ProspectFilters.tsx
│       ├── signals/
│       │   ├── SignalCard.tsx
│       │   ├── SignalList.tsx
│       │   ├── SignalTimeline.tsx
│       │   └── SignalBadge.tsx
│       ├── lead-score/
│       │   ├── LeadScoreCard.tsx
│       │   ├── LeadScoreExplanation.tsx
│       │   └── ScoreIndicator.tsx
│       ├── graph/
│       │   ├── RelationshipGraph.tsx
│       │   ├── GraphNode.tsx
│       │   └── GraphControls.tsx
│       ├── chat/
│       │   ├── ChatBot.tsx
│       │   ├── ChatInput.tsx
│       │   ├── ChatMessage.tsx
│       │   └── ChatSuggestions.tsx
│       ├── dashboard/
│       │   ├── MetricsCard.tsx
│       │   ├── ActivityFeed.tsx
│       │   ├── QuickActions.tsx
│       │   └── TopProspects.tsx
│       └── filters/
│           ├── FilterPanel.tsx
│           ├── CityFilter.tsx
│           ├── SectorFilter.tsx
│           └── NetworkFilter.tsx
│
├── hooks/                            # Custom React hooks
│   ├── useProspects.ts
│   ├── useSignals.ts
│   ├── useChat.ts
│   ├── useGraph.ts
│   ├── useMetrics.ts
│   ├── useFilters.ts
│   └── useDebounce.ts
│
├── lib/                              # Utilities and configurations
│   ├── utils.ts                      # General utilities
│   ├── cn.ts                         # Class name helper (clsx + twMerge)
│   ├── supabase/
│   │   ├── client.ts                 # Browser client
│   │   ├── server.ts                 # Server client
│   │   └── middleware.ts             # Auth middleware
│   ├── neo4j/
│   │   ├── client.ts                 # Neo4j driver
│   │   └── queries.ts                # Cypher query templates
│   ├── openai/
│   │   └── client.ts                 # OpenAI client config
│   └── validators/
│       ├── prospect.ts               # Zod schemas
│       └── signal.ts
│
├── services/                         # Business logic layer
│   ├── prospectService.ts
│   ├── signalService.ts
│   ├── chatService.ts
│   ├── graphService.ts
│   ├── metricsService.ts
│   └── leadScoringService.ts
│
├── types/                            # TypeScript definitions
│   ├── prospect.ts
│   ├── signal.ts
│   ├── graph.ts
│   ├── chat.ts
│   ├── metrics.ts
│   ├── api.ts
│   └── index.ts                      # Barrel export
│
├── constants/                        # Application constants
│   ├── index.ts
│   ├── signalTypes.ts
│   ├── sectors.ts
│   └── cities.ts
│
├── styles/                           # Additional styles
│   └── design-tokens.css             # CSS custom properties
│
├── docs/                             # Documentation
│   ├── stories/                      # User stories
│   └── technical-description/        # Technical specs
│
├── public/                           # Static assets
│   ├── logo.svg
│   ├── favicon.ico
│   └── images/
│
├── .github/
│   ├── instructions/                 # AI coding guidelines
│   └── prompts/                      # Reusable prompts
│
├── .env.local                        # Environment variables (git ignored)
├── .env.example                      # Environment template
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json
```

---

## 5. Data Models

### 5.1 Core Types

```typescript
// types/prospect.ts

/**
 * Represents a prospect/potential client in the system
 * @interface Prospect
 */
export interface Prospect {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company: string;
  designation?: string;
  sector: Sector;
  city: string;
  network?: string;
  cluster?: string;
  leadScore: number;
  leadScoreExplanation: LeadScoreExplanation;
  status: ProspectStatus;
  assignedRmId?: string;
  lastContactedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ProspectStatus = 
  | 'new' 
  | 'contacted' 
  | 'engaged' 
  | 'qualified' 
  | 'converted' 
  | 'inactive';

export interface LeadScoreExplanation {
  score: number;
  factors: LeadScoreFactor[];
  generatedAt: Date;
}

export interface LeadScoreFactor {
  signal: string;
  weight: number;
  description: string;
}
```

```typescript
// types/signal.ts

/**
 * Represents a liquidity signal event
 * @interface Signal
 */
export interface Signal {
  id: string;
  type: SignalType;
  source: DataSource;
  severity: SignalSeverity;
  title: string;
  description: string;
  metadata: Record<string, unknown>;
  prospectId?: string;
  companyId?: string;
  detectedAt: Date;
  expiresAt?: Date;
  isRead: boolean;
  isActioned: boolean;
  createdAt: Date;
}

export type SignalType =
  | 'margin_change'
  | 'corporate_action'
  | 'acquisition'
  | 'early_exit'
  | 'ipo_filing'
  | 'funding_round'
  | 'promoter_activity'
  | 'regulatory_disclosure';

export type DataSource =
  | 'private_circle'
  | 'zauba'
  | 'exchange_data'
  | 'market_intelligence'
  | 'public_disclosure'
  | 'internal';

export type SignalSeverity = 'low' | 'medium' | 'high' | 'critical';
```

```typescript
// types/graph.ts

/**
 * Graph node representing an entity
 * @interface GraphNode
 */
export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  properties: Record<string, unknown>;
}

export type NodeType = 
  | 'person' 
  | 'company' 
  | 'sector' 
  | 'event' 
  | 'fund';

/**
 * Graph edge representing a relationship
 * @interface GraphEdge
 */
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: RelationType;
  properties?: Record<string, unknown>;
}

export type RelationType =
  | 'promoter_of'
  | 'investor_in'
  | 'director_of'
  | 'works_at'
  | 'belongs_to_sector'
  | 'triggered_by';

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
```

```typescript
// types/chat.ts

/**
 * Chat message in the AI chatbot
 * @interface ChatMessage
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    sources?: string[];
    confidence?: number;
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
```

```typescript
// types/metrics.ts

/**
 * Dashboard metrics for RM activity tracking
 * @interface DashboardMetrics
 */
export interface DashboardMetrics {
  totalLeads: number;
  newLeadsToday: number;
  signalsDetected: number;
  signalsActioned: number;
  followUpsPending: number;
  conversionRate: number;
  periodComparison: MetricComparison;
}

export interface MetricComparison {
  period: 'day' | 'week' | 'month';
  previousValue: number;
  currentValue: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}
```

```typescript
// types/api.ts

/**
 * Standard API response wrapper
 * @interface ApiResponse
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiMeta {
  total?: number;
  page?: number;
  pageSize?: number;
  hasMore?: boolean;
}

/**
 * Paginated list response
 * @interface PaginatedResponse
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: ApiMeta & {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}
```

### 5.2 Database Schema (Supabase/PostgreSQL)

```sql
-- Prospects table
CREATE TABLE prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255) NOT NULL,
  designation VARCHAR(255),
  sector VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  network VARCHAR(100),
  cluster VARCHAR(100),
  lead_score INTEGER DEFAULT 0,
  lead_score_explanation JSONB,
  status VARCHAR(50) DEFAULT 'new',
  assigned_rm_id UUID REFERENCES auth.users(id),
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Signals table
CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(100) NOT NULL,
  source VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  metadata JSONB,
  prospect_id UUID REFERENCES prospects(id),
  company_id VARCHAR(100),
  detected_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  is_read BOOLEAN DEFAULT FALSE,
  is_actioned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities table (for tracking RM actions)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  prospect_id UUID REFERENCES prospects(id),
  signal_id UUID REFERENCES signals(id),
  action_type VARCHAR(100) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat sessions table
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_prospects_sector ON prospects(sector);
CREATE INDEX idx_prospects_city ON prospects(city);
CREATE INDEX idx_prospects_lead_score ON prospects(lead_score DESC);
CREATE INDEX idx_signals_type ON signals(type);
CREATE INDEX idx_signals_detected_at ON signals(detected_at DESC);
CREATE INDEX idx_signals_prospect ON signals(prospect_id);
```

### 5.3 Graph Schema (Neo4j)

```cypher
// Node labels and properties

// Person node
(:Person {
  id: string,
  name: string,
  designation: string,
  netWorth: number,
  prospectId: string  // Link to Supabase
})

// Company node
(:Company {
  id: string,
  name: string,
  cin: string,
  sector: string,
  founded: date,
  valuation: number
})

// Sector node
(:Sector {
  id: string,
  name: string,
  category: string
})

// LiquidityEvent node
(:LiquidityEvent {
  id: string,
  type: string,
  amount: number,
  date: date,
  source: string,
  signalId: string  // Link to Supabase signal
})

// Relationships
(:Person)-[:PROMOTER_OF]->(:Company)
(:Person)-[:DIRECTOR_OF]->(:Company)
(:Person)-[:INVESTOR_IN {amount: number, date: date}]->(:Company)
(:Company)-[:BELONGS_TO]->(:Sector)
(:LiquidityEvent)-[:AFFECTS]->(:Person)
(:LiquidityEvent)-[:INVOLVES]->(:Company)
```

---

## 6. API Endpoint Specification

### 6.1 Prospects API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/prospects` | List prospects with filters | ✅ |
| `GET` | `/api/prospects/:id` | Get prospect by ID | ✅ |
| `POST` | `/api/prospects` | Create new prospect | ✅ |
| `PATCH` | `/api/prospects/:id` | Update prospect | ✅ |
| `DELETE` | `/api/prospects/:id` | Delete prospect | ✅ |

**GET /api/prospects - Query Parameters:**

```typescript
interface ProspectQueryParams {
  page?: number;          // Default: 1
  pageSize?: number;      // Default: 20, Max: 100
  sector?: string;        // Filter by sector
  city?: string;          // Filter by city
  network?: string;       // Filter by network
  cluster?: string;       // Filter by cluster
  status?: ProspectStatus;
  minLeadScore?: number;
  sortBy?: 'leadScore' | 'name' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;        // Full-text search
}
```

**Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1234",
      "name": "Rajesh Kumar",
      "company": "Tech Innovations Pvt Ltd",
      "sector": "Technology",
      "city": "Mumbai",
      "leadScore": 85,
      "leadScoreExplanation": {
        "score": 85,
        "factors": [
          { "signal": "IPO Filing", "weight": 40, "description": "Company filed DRHP" },
          { "signal": "Funding Round", "weight": 30, "description": "Series C at $50M" }
        ]
      },
      "status": "new"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "pageSize": 20,
    "hasMore": true
  }
}
```

### 6.2 Signals API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/signals` | List all signals | ✅ |
| `GET` | `/api/signals/recent` | Get recent signals (last 24h) | ✅ |
| `GET` | `/api/signals/:id` | Get signal details | ✅ |
| `PATCH` | `/api/signals/:id/read` | Mark signal as read | ✅ |
| `PATCH` | `/api/signals/:id/action` | Mark signal as actioned | ✅ |

### 6.3 Chat API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/chat` | Send message (streaming) | ✅ |
| `GET` | `/api/chat/history` | Get chat history | ✅ |
| `DELETE` | `/api/chat/history` | Clear chat history | ✅ |

**POST /api/chat - Request:**

```json
{
  "message": "Which clients may experience liquidity events in the next 30 days?",
  "sessionId": "uuid-session"
}
```

**Response (Server-Sent Events):**

```
data: {"type": "start"}
data: {"type": "text", "content": "Based on my analysis, "}
data: {"type": "text", "content": "I found 5 prospects..."}
data: {"type": "sources", "sources": ["PrivateCircle", "Zauba"]}
data: {"type": "end"}
```

### 6.4 Graph API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/graph` | Get full graph data | ✅ |
| `GET` | `/api/graph/prospect/:id` | Get graph centered on prospect | ✅ |
| `GET` | `/api/graph/company/:id` | Get graph centered on company | ✅ |

### 6.5 Metrics API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/metrics` | Get dashboard metrics | ✅ |
| `GET` | `/api/metrics/activity` | Get activity log | ✅ |

---

## 7. Component Hierarchy

```
RootLayout (app/layout.tsx)
│
├── AuthLayout (app/(auth)/layout.tsx)
│   ├── LoginPage
│   │   ├── LoginForm
│   │   └── OAuthButtons
│   └── ForgotPasswordPage
│
└── DashboardLayout (app/(dashboard)/layout.tsx)
    ├── Header
    │   ├── Logo
    │   ├── SearchBar
    │   ├── NotificationBell
    │   └── UserMenu
    │       ├── Avatar
    │       └── Dropdown
    │
    ├── Sidebar
    │   ├── Navigation
    │   │   └── NavItem (× n)
    │   ├── FilterPanel
    │   │   ├── CityFilter
    │   │   ├── SectorFilter
    │   │   ├── NetworkFilter
    │   │   └── ClusterFilter
    │   └── QuickMetrics
    │
    ├── MainContent
    │   │
    │   ├── DashboardPage (page.tsx)
    │   │   ├── PageHeader
    │   │   ├── MetricsGrid
    │   │   │   └── MetricsCard (× 4)
    │   │   ├── TopProspects
    │   │   │   └── ProspectCard (× 5)
    │   │   ├── RecentSignals
    │   │   │   └── SignalCard (× 5)
    │   │   └── ActivityFeed
    │   │
    │   ├── ProspectsPage (prospects/page.tsx)
    │   │   ├── PageHeader
    │   │   │   └── ActionButtons
    │   │   ├── ProspectFilters (mobile)
    │   │   └── ProspectList
    │   │       └── ProspectCard (× n)
    │   │           ├── Avatar
    │   │           ├── LeadScoreIndicator
    │   │           ├── SignalBadges
    │   │           └── ActionButtons
    │   │
    │   ├── ProspectDetailPage (prospects/[id]/page.tsx)
    │   │   ├── ProspectHeader
    │   │   │   ├── Avatar
    │   │   │   ├── ContactInfo
    │   │   │   └── ActionButtons
    │   │   ├── LeadScoreCard
    │   │   │   ├── ScoreIndicator
    │   │   │   └── LeadScoreExplanation
    │   │   ├── SignalTimeline
    │   │   │   └── SignalCard (× n)
    │   │   ├── RelationshipGraph (mini)
    │   │   └── SuggestedActions
    │   │
    │   ├── SignalsPage (signals/page.tsx)
    │   │   ├── PageHeader
    │   │   ├── SignalFilters
    │   │   └── SignalList
    │   │       └── SignalCard (× n)
    │   │
    │   ├── GraphPage (graph/page.tsx)
    │   │   ├── GraphControls
    │   │   │   ├── ZoomControls
    │   │   │   ├── FilterControls
    │   │   │   └── LayoutToggle
    │   │   ├── RelationshipGraph (full)
    │   │   │   └── GraphNode (× n)
    │   │   └── NodeDetailPanel
    │   │
    │   └── AnalyticsPage (analytics/page.tsx)
    │       ├── PageHeader
    │       ├── DateRangePicker
    │       └── ChartsGrid
    │           ├── LeadTrendChart
    │           ├── SignalDistributionChart
    │           └── ConversionFunnel
    │
    └── ChatBot (floating, always visible)
        ├── ChatToggle
        └── ChatPanel
            ├── ChatHeader
            ├── ChatMessages
            │   └── ChatMessage (× n)
            ├── ChatSuggestions
            └── ChatInput
```

---

## 8. Environment Variables

```bash
# .env.example

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="UHNW Intelligence Platform"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Neo4j
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your-password

# OpenAI
OPENAI_API_KEY=sk-your-api-key
OPENAI_MODEL=gpt-4-turbo-preview

# Data Sources (API keys for external data)
PRIVATE_CIRCLE_API_KEY=your-key
ZAUBA_API_KEY=your-key

# Feature Flags
NEXT_PUBLIC_ENABLE_CHATBOT=true
NEXT_PUBLIC_ENABLE_GRAPH=true
```

---

## 9. Security Considerations

### Authentication & Authorization
- Supabase Auth with Row Level Security (RLS)
- Role-based access control (RM, Admin, Viewer)
- JWT token validation on all API routes
- Session refresh with secure httpOnly cookies

### Data Protection
- All data encrypted at rest (Supabase)
- TLS 1.3 for data in transit
- PII masking in logs
- GDPR-compliant data handling

### API Security
- Rate limiting (100 req/min per user)
- Input validation with Zod schemas
- CORS restricted to approved origins
- SQL injection prevention via parameterized queries

---

## 10. Performance Targets

| Metric | Target |
|--------|--------|
| Time to First Byte (TTFB) | < 200ms |
| Largest Contentful Paint (LCP) | < 2.5s |
| First Input Delay (FID) | < 100ms |
| Cumulative Layout Shift (CLS) | < 0.1 |
| API Response Time (p95) | < 500ms |
| Chat Response Start | < 1s |

---

## 11. Next Steps

1. [ ] Set up Next.js project with TypeScript
2. [ ] Configure Supabase project and database schema
3. [ ] Set up Neo4j Aura instance
4. [ ] Implement authentication flow
5. [ ] Build core UI components with Tailwind
6. [ ] Implement Dashboard page (Story 1, 4, 7)
7. [ ] Implement Prospects list and detail (Story 2, 3, 5)
8. [ ] Implement Signals feed (Story 1, 9)
9. [ ] Implement Relationship Graph (Story 8)
10. [ ] Implement AI Chatbot (Story 6)
11. [ ] Connect data sources for ingestion (Story 10)
12. [ ] Testing and QA
13. [ ] Deploy to Vercel

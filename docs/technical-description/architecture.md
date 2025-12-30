# UHNW Liquidity Intelligence Platform

## Technical Architecture Document

**Version:** 2.0.0  
**Created:** 2025-12-17  
**Updated:** 2025-12-19  
**Status:** Draft

---

## 1. Application Overview

### Purpose

A web application designed exclusively for **Relationship Managers (RMs)** handling Ultra High Net Worth (UHNW) clients (₹100Cr+ wealth). The platform helps identify early liquidity signals 30-90 days before they become obvious in the market, enabling proactive client engagement and first-mover advantage.

### Target Market

- **Organization:** Kairos Capital (30-35 RMs)
- **Total Addressable Market:** ~4,400 UHNW individuals in India
- **Client Threshold:** ₹100 Crore+ estimated wealth

### Architecture Pattern

Next.js 15 App Router with Server-First Architecture, leveraging Server Components for data fetching and Client Components for interactivity.

### Key Capabilities

| Category | Capabilities |
|----------|-------------|
| **Signal Detection** | Early liquidity signals (IPO, M&A, Funding), 30-90 day advance detection, multi-source aggregation |
| **Client Intelligence** | Lead scoring with explainability, wallet share analysis, cross-sell opportunities |
| **Relationship Mapping** | Graph-based entity visualization, warm intro path discovery, influencer network mapping |
| **AI Assistant** | Multilingual chatbot (English, Hindi, Marathi), natural language queries, trend analysis |
| **Productivity** | Fireflies.ai meeting integration, voice notes with auto-transcription, automated follow-up creation |
| **Risk Management** | Portfolio concentration alerts, client retention monitoring, churn prediction |

---

## 2. User Stories Coverage

### Core Intelligence (Stories 1-10)

| Story | Feature | Priority |
|-------|---------|----------|
| 1 | Early Liquidity Signals (30-90 days) | P0 |
| 2 | Lead Scores with Explainability | P0 |
| 3 | Filter Prospects by Criteria | P0 |
| 4 | View Top Prospects with Actions | P0 |
| 5 | Prospect Detail Panel | P0 |
| 6 | AI Chatbot (Multilingual) | P0 |
| 7 | Track Leads and Follow-ups | P0 |
| 8 | Relationship Graph Visualization | P1 |
| 9 | Proactive Engagement Suggestions | P1 |
| 10 | Aggregate Data from Multiple Sources | P0 |

### Growth & Revenue (Stories 11-17)

| Story | Feature | Priority |
|-------|---------|----------|
| 11 | Add Liquidity Events Manually | P1 |
| 12 | Client-Specific News Alerts | P1 |
| 13 | Firm-Wide AUM Dashboard | P2 |
| 14 | Wallet Share Analysis | P1 |
| 15 | Revenue Growth by Product Mix | P2 |
| 16 | Alternate Investment Penetration | P2 |
| 17 | Credit & Capital Solutions | P1 |

### Analytics & Insights (Stories 18-20)

| Story | Feature | Priority |
|-------|---------|----------|
| 18 | Conversion/Churn Metrics | P2 |
| 19 | AI-Driven Trend Insights | P1 |
| 20 | Influencer Network Mapping | P2 |

### Productivity & Risk (Stories 21-25)

| Story | Feature | Priority |
|-------|---------|----------|
| 21 | Fireflies.ai → OneDrive → Follow-ups | P1 |
| 22 | Client Retention Metrics | P1 |
| 23 | RM Productivity Scorecard | P2 |
| 24 | Risk Concentration Alerts | P1 |
| 25 | Cross-Sell Opportunity Tracker | P1 |

---

## 3. Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Next.js 15 | Server components, App Router, built-in API routes, streaming |
| **Language** | TypeScript 5.x | Type safety, better developer experience, reduced runtime errors |
| **Styling** | Tailwind CSS 3.x | Utility-first, design system support, Kairos Capital aesthetic |
| **UI Components** | Radix UI + Custom | Accessible primitives with premium styling |
| **Database** | Supabase (PostgreSQL) | Real-time subscriptions, auth, row-level security |
| **Graph Database** | Neo4j Aura | Relationship mapping between entities, liquidity events, intro paths |
| **State Management** | Server Components + Zustand | Minimal client state, server-first data fetching |
| **Authentication** | Supabase Auth | Built-in, secure, role-based access |
| **AI/LLM** | OpenAI GPT-4 / Vercel AI SDK | Chatbot, lead score explanations, trend analysis |
| **Speech-to-Text** | OpenAI Whisper / Azure Speech | Voice note transcription (multilingual) |
| **Meeting Integration** | Fireflies.ai API + OneDrive | Auto-capture meeting transcripts, extract follow-ups |
| **News/Data** | NewsAPI, PrivateCircle, Zauba | Real-time client mentions, company data |
| **Charts** | Recharts / Tremor | Data visualization for metrics and graphs |
| **Forms** | React Hook Form + Zod | Type-safe form validation |

---

## 4. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      Next.js App (Browser)                             │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐ │  │
│  │  │Dashboard │ │ Clients  │ │ Signals  │ │Analytics │ │  AI Chatbot │ │  │
│  │  │  (Home)  │ │   List   │ │   Feed   │ │  Views   │ │ (Floating)  │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────────┘ │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐ │  │
│  │  │ Client   │ │ Wallet   │ │Cross-Sell│ │  Risk    │ │Voice Notes  │ │  │
│  │  │ Detail   │ │  Share   │ │   Opps   │ │ Alerts   │ │ & Memos     │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────────┘ │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐ │  │
│  │  │ Network  │ │  News    │ │  Credit  │ │ Health   │ │   My Perf   │ │  │
│  │  │   Map    │ │   Feed   │ │   Opps   │ │ Monitor  │ │ Dashboard   │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SERVER LAYER                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                       Next.js API Routes                               │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │  │
│  │  │/api/       │ │/api/       │ │/api/       │ │/api/               │  │  │
│  │  │clients     │ │signals     │ │chat        │ │metrics             │  │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────────────┘  │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │  │
│  │  │/api/       │ │/api/       │ │/api/       │ │/api/               │  │  │
│  │  │wallet-share│ │cross-sell  │ │voice-notes │ │fireflies-webhook   │  │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────────────┘  │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │  │
│  │  │/api/       │ │/api/       │ │/api/       │ │/api/               │  │  │
│  │  │news        │ │graph       │ │risk-alerts │ │intelligence        │  │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         Service Layer                                  │  │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────┐ │  │
│  │  │ Client    │ │ Signal    │ │   Chat    │ │  Graph    │ │ News    │ │  │
│  │  │ Service   │ │ Service   │ │  Service  │ │ Service   │ │ Service │ │  │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └─────────┘ │  │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────┐ │  │
│  │  │ Wallet    │ │Cross-Sell │ │   Risk    │ │  Voice    │ │Fireflies│ │  │
│  │  │ Service   │ │  Service  │ │  Service  │ │ Service   │ │ Service │ │  │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └─────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌───────────┐  │
│  │   Supabase     │  │     Neo4j      │  │   OpenAI API   │  │ OneDrive  │  │
│  │  (PostgreSQL)  │  │   (Graph DB)   │  │     (LLM)      │  │  (Files)  │  │
│  │                │  │                │  │                │  │           │  │
│  │ • Users/RMs    │  │ • Persons      │  │ • Chat         │  │ • Meeting │  │
│  │ • Clients      │  │ • Companies    │  │ • Transcribe   │  │   Notes   │  │
│  │ • Signals      │  │ • Networks     │  │ • Analyze      │  │ • Voice   │  │
│  │ • Activities   │  │ • Intro Paths  │  │ • Explain      │  │   Memos   │  │
│  │ • Follow-ups   │  │ • Influence    │  │ • Extract      │  │           │  │
│  │ • Voice Notes  │  │ • Events       │  │   Action Items │  │           │  │
│  │ • Wallet Data  │  │ • Referrals    │  │                │  │           │  │
│  │ • Risk Alerts  │  │                │  │                │  │           │  │
│  └────────────────┘  └────────────────┘  └────────────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL INTEGRATIONS                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌───────────┐  │
│  │PrivateCircle│ │   Zauba   │ │  IPO Data  │ │ NewsAPI /  │ │Fireflies  │  │
│  │  (VC/PE)    │ │ (MCA/ROC) │ │ (Exchange) │ │ RSS Feeds  │ │   .ai     │  │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘ └───────────┘  │
│  ┌────────────┐ ┌────────────┐ ┌────────────────────────────────────────┐   │
│  │ Microsoft  │ │   Azure    │ │              Meeting Platforms         │   │
│  │   Graph    │ │  Speech    │ │    Zoom  |  Google Meet  |  Teams      │   │
│  │ (OneDrive) │ │ (Whisper)  │ │                                        │   │
│  └────────────┘ └────────────┘ └────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Project Folder Structure

```
uhnw/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth route group (public)
│   │   ├── login/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/                  # Main app route group (protected)
│   │   ├── page.tsx                  # RM Dashboard (Home)
│   │   │
│   │   ├── clients/                  # My Clients
│   │   │   ├── page.tsx              # Client list with filters
│   │   │   └── [id]/page.tsx         # Client detail view
│   │   │
│   │   ├── signals/page.tsx          # My Active Signals
│   │   ├── news/page.tsx             # My Client News Feed
│   │   │
│   │   ├── wallet-share/page.tsx     # Wallet Share Analysis
│   │   ├── cross-sell/page.tsx       # Cross-Sell Opportunities
│   │   ├── credit/page.tsx           # Credit Opportunities
│   │   │
│   │   ├── network/page.tsx          # My Network Map
│   │   ├── insights/page.tsx         # AI Trend Insights
│   │   │
│   │   ├── risk/page.tsx             # Portfolio Risk Alerts
│   │   ├── health/page.tsx           # Client Health Monitor
│   │   │
│   │   ├── voice-notes/page.tsx      # Voice Notes & Memos
│   │   ├── performance/page.tsx      # My Performance Dashboard
│   │   │
│   │   └── layout.tsx                # Dashboard shell layout
│   │
│   ├── api/                          # API routes
│   │   ├── clients/
│   │   │   ├── route.ts              # GET (list), POST (create)
│   │   │   └── [id]/route.ts         # GET, PATCH, DELETE
│   │   │
│   │   ├── signals/
│   │   │   ├── route.ts              # GET signals
│   │   │   └── recent/route.ts       # GET recent signals
│   │   │
│   │   ├── chat/route.ts             # POST chat message (streaming)
│   │   │
│   │   ├── graph/
│   │   │   ├── route.ts              # GET full graph
│   │   │   └── intro-paths/route.ts  # GET warm intro paths
│   │   │
│   │   ├── wallet-share/
│   │   │   ├── route.ts              # GET wallet analysis
│   │   │   └── [clientId]/route.ts   # GET client wallet share
│   │   │
│   │   ├── cross-sell/route.ts       # GET cross-sell opportunities
│   │   ├── credit/route.ts           # GET credit opportunities
│   │   │
│   │   ├── news/route.ts             # GET client news
│   │   ├── insights/route.ts         # GET AI trend insights
│   │   │
│   │   ├── risk-alerts/route.ts      # GET risk alerts
│   │   ├── client-health/route.ts    # GET client health metrics
│   │   │
│   │   ├── voice-notes/
│   │   │   ├── route.ts              # GET, POST voice notes
│   │   │   └── transcribe/route.ts   # POST transcription
│   │   │
│   │   ├── intelligence/route.ts     # POST manual intelligence
│   │   │
│   │   ├── follow-ups/
│   │   │   ├── route.ts              # GET, POST follow-ups
│   │   │   └── [id]/route.ts         # PATCH, DELETE
│   │   │
│   │   ├── fireflies/
│   │   │   └── webhook/route.ts      # POST webhook from Fireflies
│   │   │
│   │   ├── metrics/
│   │   │   ├── route.ts              # GET dashboard metrics
│   │   │   └── performance/route.ts  # GET RM performance
│   │   │
│   │   └── auth/callback/route.ts    # Supabase auth callback
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
│   │   ├── LeadScore.tsx
│   │   ├── SignalBadge.tsx
│   │   └── index.ts
│   │
│   ├── layout/                       # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   └── PageHeader.tsx
│   │
│   └── features/                     # Feature-specific components
│       ├── clients/
│       │   ├── ClientCard.tsx
│       │   ├── ClientList.tsx
│       │   ├── ClientDetail.tsx
│       │   ├── ClientFilters.tsx
│       │   └── WalletShareCard.tsx
│       │
│       ├── signals/
│       │   ├── SignalCard.tsx
│       │   ├── SignalList.tsx
│       │   ├── SignalTimeline.tsx
│       │   └── AddIntelligenceModal.tsx
│       │
│       ├── lead-score/
│       │   ├── LeadScoreCard.tsx
│       │   ├── LeadScoreExplanation.tsx
│       │   └── ScoreIndicator.tsx
│       │
│       ├── graph/
│       │   ├── NetworkMap.tsx
│       │   ├── GraphNode.tsx
│       │   ├── IntroPathCard.tsx
│       │   └── GraphControls.tsx
│       │
│       ├── chat/
│       │   ├── AIChatbot.tsx
│       │   ├── ChatInput.tsx
│       │   ├── ChatMessage.tsx
│       │   ├── LanguageSelector.tsx
│       │   └── ChatSuggestions.tsx
│       │
│       ├── dashboard/
│       │   ├── MetricsCard.tsx
│       │   ├── ActivityFeed.tsx
│       │   ├── QuickActions.tsx
│       │   ├── TopClients.tsx
│       │   └── ActiveSignals.tsx
│       │
│       ├── wallet/
│       │   ├── WalletShareAnalysis.tsx
│       │   ├── OpportunityList.tsx
│       │   └── SegmentTable.tsx
│       │
│       ├── cross-sell/
│       │   ├── CrossSellOpportunities.tsx
│       │   ├── ProductMixChart.tsx
│       │   └── RecommendationCard.tsx
│       │
│       ├── credit/
│       │   ├── CreditOpportunities.tsx
│       │   └── CreditCard.tsx
│       │
│       ├── news/
│       │   ├── NewsFeed.tsx
│       │   └── NewsCard.tsx
│       │
│       ├── insights/
│       │   ├── AIInsights.tsx
│       │   ├── TrendChart.tsx
│       │   └── PatternCard.tsx
│       │
│       ├── risk/
│       │   ├── RiskAlerts.tsx
│       │   ├── ConcentrationCard.tsx
│       │   └── AlertCard.tsx
│       │
│       ├── health/
│       │   ├── ClientHealthMonitor.tsx
│       │   ├── AtRiskClients.tsx
│       │   └── RetentionMetrics.tsx
│       │
│       ├── voice-notes/
│       │   ├── VoiceRecorder.tsx
│       │   ├── VoiceNotesList.tsx
│       │   ├── TranscriptionView.tsx
│       │   └── LanguageSelector.tsx
│       │
│       ├── follow-ups/
│       │   ├── FollowUpList.tsx
│       │   ├── FollowUpCard.tsx
│       │   └── CreateFollowUpModal.tsx
│       │
│       └── performance/
│           ├── PerformanceDashboard.tsx
│           ├── ActivityMetrics.tsx
│           ├── TargetProgress.tsx
│           └── TaskList.tsx
│
├── hooks/                            # Custom React hooks
│   ├── useClients.ts
│   ├── useSignals.ts
│   ├── useChat.ts
│   ├── useGraph.ts
│   ├── useWalletShare.ts
│   ├── useCrossSell.ts
│   ├── useNews.ts
│   ├── useRiskAlerts.ts
│   ├── useVoiceNotes.ts
│   ├── useFollowUps.ts
│   ├── useMetrics.ts
│   ├── useFilters.ts
│   └── useDebounce.ts
│
├── lib/                              # Utilities and configurations
│   ├── utils.ts
│   ├── cn.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── neo4j/
│   │   ├── client.ts
│   │   └── queries.ts
│   ├── openai/
│   │   ├── client.ts
│   │   └── prompts.ts
│   ├── fireflies/
│   │   ├── client.ts
│   │   └── parser.ts
│   ├── onedrive/
│   │   └── client.ts
│   └── validators/
│       ├── client.ts
│       ├── signal.ts
│       └── follow-up.ts
│
├── services/                         # Business logic layer
│   ├── clientService.ts
│   ├── signalService.ts
│   ├── chatService.ts
│   ├── graphService.ts
│   ├── walletShareService.ts
│   ├── crossSellService.ts
│   ├── creditService.ts
│   ├── newsService.ts
│   ├── riskAlertService.ts
│   ├── voiceNoteService.ts
│   ├── firefliesService.ts
│   ├── followUpService.ts
│   ├── metricsService.ts
│   └── leadScoringService.ts
│
├── types/                            # TypeScript definitions
│   ├── client.ts
│   ├── signal.ts
│   ├── graph.ts
│   ├── chat.ts
│   ├── wallet.ts
│   ├── cross-sell.ts
│   ├── news.ts
│   ├── risk.ts
│   ├── voice-note.ts
│   ├── follow-up.ts
│   ├── metrics.ts
│   ├── api.ts
│   └── index.ts
│
├── constants/                        # Application constants
│   ├── index.ts
│   ├── signalTypes.ts
│   ├── sectors.ts
│   ├── cities.ts
│   ├── products.ts
│   └── riskThresholds.ts
│
├── styles/
│   └── design-tokens.css
│
├── docs/
│   ├── stories/
│   ├── wireframes/
│   └── technical-description/
│
└── public/
    ├── logo.svg
    ├── favicon.ico
    └── images/
```

---

## 6. Data Models

### 6.1 Core Types

```typescript
// types/client.ts

/**
 * Represents an RM's client/prospect
 */
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company: string;
  designation?: string;
  sector: Sector;
  city: string;
  network?: string;
  
  // Wealth & Wallet
  estimatedWealth: number;          // Total estimated wealth
  rmWalletShare: number;            // RM's current share
  walletSharePercent: number;       // Percentage held
  opportunityGap: number;           // Potential additional capture
  
  // Products
  productsHeld: Product[];
  productsMissing: Product[];
  
  // Lead Score
  leadScore: number;
  leadScoreExplanation: LeadScoreExplanation;
  
  // Status
  status: ClientStatus;
  riskScore: number;                // Churn risk (0-100)
  healthStatus: 'healthy' | 'at-risk' | 'critical';
  
  // RM Assignment
  assignedRmId: string;
  lastContactedAt?: Date;
  nextFollowUpAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export type ClientStatus = 
  | 'new' 
  | 'contacted' 
  | 'engaged' 
  | 'qualified' 
  | 'converted' 
  | 'inactive';

export type Product = 
  | 'wealth_management'
  | 'broking'
  | 'pms'
  | 'alternates'
  | 'credit_line'
  | 'insurance'
  | 'family_office';

export interface LeadScoreExplanation {
  score: number;
  factors: LeadScoreFactor[];
  recommendation: string;        // e.g., "Act within 48hrs"
  generatedAt: Date;
}

export interface LeadScoreFactor {
  signal: string;
  weight: number;
  description: string;
  source: DataSource;
}
```

```typescript
// types/signal.ts

/**
 * Represents a liquidity signal event
 */
export interface Signal {
  id: string;
  type: SignalType;
  source: DataSource;
  severity: SignalSeverity;
  title: string;
  description: string;
  metadata: Record<string, unknown>;
  
  // Timing
  expectedTimeline: '30_days' | '30_60_days' | '60_90_days' | '3_6_months' | '6_plus_months';
  detectedAt: Date;
  expiresAt?: Date;
  
  // Associations
  clientId?: string;
  companyId?: string;
  
  // RM Actions
  isRead: boolean;
  isActioned: boolean;
  actionedAt?: Date;
  actionNotes?: string;
  
  createdAt: Date;
}

export type SignalType =
  | 'ipo_filing'
  | 'acquisition'
  | 'funding_round'
  | 'secondary_sale'
  | 'promoter_activity'
  | 'board_change'
  | 'regulatory_disclosure'
  | 'stake_sale'
  | 'margin_change'
  | 'corporate_action'
  | 'manual_intelligence';       // RM-added

export type DataSource =
  | 'private_circle'
  | 'zauba'
  | 'exchange_data'
  | 'market_intelligence'
  | 'public_disclosure'
  | 'news_api'
  | 'rm_input'
  | 'fireflies';

export type SignalSeverity = 'low' | 'medium' | 'high' | 'critical';
```

```typescript
// types/wallet.ts

/**
 * Wallet share analysis for a client
 */
export interface WalletShareAnalysis {
  clientId: string;
  estimatedTotalWealth: number;
  currentShare: number;
  sharePercent: number;
  opportunityGap: number;
  realisticCapturePercent: number;
  
  // Products breakdown
  productBreakdown: ProductShare[];
  missingProducts: Product[];
  
  // Recommendations
  topOpportunities: WalletOpportunity[];
}

export interface ProductShare {
  product: Product;
  amount: number;
  percent: number;
}

export interface WalletOpportunity {
  product: Product;
  estimatedRevenue: number;
  trigger: string;              // e.g., "IPO filing"
  timing: string;               // e.g., "Within 30 days"
  priority: 'high' | 'medium' | 'low';
}
```

```typescript
// types/voice-note.ts

/**
 * Voice note with auto-transcription
 */
export interface VoiceNote {
  id: string;
  rmId: string;
  
  // Audio
  audioUrl: string;
  duration: number;             // seconds
  language: 'en' | 'hi' | 'mr';
  
  // Transcription
  transcript: string;
  transcriptStatus: 'pending' | 'processing' | 'completed' | 'failed';
  
  // Auto-linking
  linkedClientIds: string[];    // Auto-detected from transcript
  detectedTopics: string[];     // e.g., ['IPO', 'PMS', 'family office']
  
  // Metadata
  title?: string;
  source: 'app_recording' | 'fireflies' | 'upload';
  
  createdAt: Date;
  updatedAt: Date;
}
```

```typescript
// types/follow-up.ts

/**
 * Follow-up task for RM
 */
export interface FollowUp {
  id: string;
  rmId: string;
  clientId: string;
  
  // Task details
  title: string;
  description?: string;
  type: FollowUpType;
  priority: 'high' | 'medium' | 'low';
  
  // Timing
  dueDate: Date;
  reminderAt?: Date;
  
  // Source
  source: FollowUpSource;
  sourceId?: string;            // Voice note ID, Fireflies meeting ID, etc.
  sourceContext?: string;       // Relevant transcript snippet
  
  // Status
  status: 'pending' | 'completed' | 'snoozed' | 'cancelled';
  completedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export type FollowUpType = 
  | 'call'
  | 'email'
  | 'meeting'
  | 'send_document'
  | 'proposal'
  | 'other';

export type FollowUpSource = 
  | 'manual'
  | 'fireflies_extraction'
  | 'voice_note_extraction'
  | 'signal_trigger'
  | 'ai_suggestion';
```

```typescript
// types/risk.ts

/**
 * Portfolio risk alert
 */
export interface RiskAlert {
  id: string;
  clientId: string;
  
  type: RiskAlertType;
  severity: 'critical' | 'warning' | 'info';
  
  title: string;
  description: string;
  
  // Specifics
  currentValue: number;
  threshold: number;
  exposure: number;
  
  // Recommendation
  suggestedAction: string;
  
  // Status
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  
  createdAt: Date;
}

export type RiskAlertType = 
  | 'sector_concentration'
  | 'single_stock_exposure'
  | 'illiquidity_risk'
  | 'credit_utilization'
  | 'margin_warning';
```

```typescript
// types/news.ts

/**
 * Client-related news article
 */
export interface NewsArticle {
  id: string;
  
  // Content
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: Date;
  
  // Client linking
  linkedClientIds: string[];
  
  // Priority
  priority: 'high' | 'relevant' | 'informational';
  
  // AI Analysis
  aiSummary?: string;
  suggestedAction?: string;
  
  // Status
  isRead: boolean;
  isDismissed: boolean;
  
  createdAt: Date;
}
```

### 6.2 Database Schema (Supabase/PostgreSQL)

```sql
-- Clients table (renamed from prospects)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255) NOT NULL,
  designation VARCHAR(255),
  sector VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  network VARCHAR(100),
  
  -- Wealth & Wallet
  estimated_wealth DECIMAL(15,2) DEFAULT 0,
  rm_wallet_share DECIMAL(15,2) DEFAULT 0,
  wallet_share_percent DECIMAL(5,2) DEFAULT 0,
  opportunity_gap DECIMAL(15,2) DEFAULT 0,
  
  -- Products
  products_held TEXT[] DEFAULT '{}',
  products_missing TEXT[] DEFAULT '{}',
  
  -- Lead Score
  lead_score INTEGER DEFAULT 0,
  lead_score_explanation JSONB,
  
  -- Status
  status VARCHAR(50) DEFAULT 'new',
  risk_score INTEGER DEFAULT 0,
  health_status VARCHAR(20) DEFAULT 'healthy',
  
  -- RM Assignment
  assigned_rm_id UUID REFERENCES auth.users(id),
  last_contacted_at TIMESTAMPTZ,
  next_follow_up_at TIMESTAMPTZ,
  
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
  
  expected_timeline VARCHAR(50),
  detected_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  
  client_id UUID REFERENCES clients(id),
  company_id VARCHAR(100),
  
  is_read BOOLEAN DEFAULT FALSE,
  is_actioned BOOLEAN DEFAULT FALSE,
  actioned_at TIMESTAMPTZ,
  action_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voice notes table
CREATE TABLE voice_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rm_id UUID REFERENCES auth.users(id) NOT NULL,
  
  audio_url TEXT NOT NULL,
  duration INTEGER NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  
  transcript TEXT,
  transcript_status VARCHAR(20) DEFAULT 'pending',
  
  linked_client_ids UUID[] DEFAULT '{}',
  detected_topics TEXT[] DEFAULT '{}',
  
  title VARCHAR(255),
  source VARCHAR(50) DEFAULT 'app_recording',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Follow-ups table
CREATE TABLE follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rm_id UUID REFERENCES auth.users(id) NOT NULL,
  client_id UUID REFERENCES clients(id) NOT NULL,
  
  title VARCHAR(500) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  
  due_date TIMESTAMPTZ NOT NULL,
  reminder_at TIMESTAMPTZ,
  
  source VARCHAR(50) DEFAULT 'manual',
  source_id VARCHAR(255),
  source_context TEXT,
  
  status VARCHAR(20) DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risk alerts table
CREATE TABLE risk_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) NOT NULL,
  
  type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  
  title VARCHAR(500) NOT NULL,
  description TEXT,
  
  current_value DECIMAL(15,2),
  threshold DECIMAL(15,2),
  exposure DECIMAL(15,2),
  
  suggested_action TEXT,
  
  status VARCHAR(20) DEFAULT 'active',
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- News articles table
CREATE TABLE news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  url TEXT NOT NULL,
  source VARCHAR(255),
  published_at TIMESTAMPTZ NOT NULL,
  
  linked_client_ids UUID[] DEFAULT '{}',
  
  priority VARCHAR(20) DEFAULT 'informational',
  
  ai_summary TEXT,
  suggested_action TEXT,
  
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities table (for tracking RM actions)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  client_id UUID REFERENCES clients(id),
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
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RM Performance metrics table
CREATE TABLE rm_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rm_id UUID REFERENCES auth.users(id) NOT NULL,
  
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  total_aum DECIMAL(15,2),
  revenue_mtd DECIMAL(15,2),
  
  calls_made INTEGER DEFAULT 0,
  meetings_held INTEGER DEFAULT 0,
  follow_ups_completed INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  
  retention_rate DECIMAL(5,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_clients_sector ON clients(sector);
CREATE INDEX idx_clients_city ON clients(city);
CREATE INDEX idx_clients_lead_score ON clients(lead_score DESC);
CREATE INDEX idx_clients_assigned_rm ON clients(assigned_rm_id);
CREATE INDEX idx_clients_health ON clients(health_status);

CREATE INDEX idx_signals_type ON signals(type);
CREATE INDEX idx_signals_severity ON signals(severity);
CREATE INDEX idx_signals_detected_at ON signals(detected_at DESC);
CREATE INDEX idx_signals_client ON signals(client_id);

CREATE INDEX idx_follow_ups_rm ON follow_ups(rm_id);
CREATE INDEX idx_follow_ups_due ON follow_ups(due_date);
CREATE INDEX idx_follow_ups_status ON follow_ups(status);

CREATE INDEX idx_risk_alerts_client ON risk_alerts(client_id);
CREATE INDEX idx_risk_alerts_status ON risk_alerts(status);

CREATE INDEX idx_voice_notes_rm ON voice_notes(rm_id);
CREATE INDEX idx_news_priority ON news_articles(priority);
```

### 6.3 Graph Schema (Neo4j)

```cypher
// Node labels and properties

// Person node
(:Person {
  id: string,
  name: string,
  designation: string,
  netWorth: number,
  clientId: string,           // Link to Supabase
  isClient: boolean,
  isInfluencer: boolean
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

// Network/Club node (TiE, YPO, etc.)
(:Network {
  id: string,
  name: string,
  type: string,               // 'industry_body', 'club', 'alumni'
  memberCount: number
})

// LiquidityEvent node
(:LiquidityEvent {
  id: string,
  type: string,
  amount: number,
  date: date,
  source: string,
  signalId: string
})

// RM node
(:RM {
  id: string,
  name: string,
  email: string
})

// Relationships
(:Person)-[:PROMOTER_OF {stake: number}]->(:Company)
(:Person)-[:DIRECTOR_OF]->(:Company)
(:Person)-[:INVESTOR_IN {amount: number, date: date}]->(:Company)
(:Person)-[:MEMBER_OF {since: date}]->(:Network)
(:Person)-[:KNOWS {strength: number}]->(:Person)

(:Company)-[:BELONGS_TO_SECTOR]->(:Sector)

(:LiquidityEvent)-[:AFFECTS]->(:Person)
(:LiquidityEvent)-[:INVOLVES]->(:Company)

(:RM)-[:MANAGES]->(:Person)
(:RM)-[:CONNECTED_TO {via: string}]->(:Person)  // Warm intro paths
```

---

## 7. Fireflies.ai Integration Flow

### Workflow Diagram

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   RM Meeting     │     │  Fireflies.ai    │     │    OneDrive      │
│ (Zoom/Teams/Meet)│────▶│  Auto-Records    │────▶│  Sync Folder     │
└──────────────────┘     └──────────────────┘     └────────┬─────────┘
                                                           │
                                                           ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  RM Follow-up    │◀────│  UHNW Platform   │◀────│  OneDrive        │
│     Queue        │     │  AI Processing   │     │  Webhook/Poll    │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

### Processing Steps

1. **Meeting Capture**
   - Fireflies.ai bot joins meeting automatically
   - Records audio, generates transcript
   - Pushes to OneDrive: `UHNW-Meetings/[RM-Name]/[Date]/`

2. **Platform Ingestion**
   - OneDrive webhook or polling detects new files
   - Platform fetches transcript.txt and summary.json

3. **AI Processing**
   - Extract client names from conversation
   - Match against RM's client database
   - Identify action items (commitments, requests, follow-ups)
   - Extract topics discussed
   - Assess sentiment

4. **Follow-up Creation**
   - Auto-create tasks with due dates
   - Link to client profiles
   - Include transcript context
   - Set priority based on client score + urgency

5. **RM Review**
   - New follow-ups appear in dashboard
   - RM can edit, snooze, or complete
   - System learns from corrections

---

## 8. API Endpoint Specification

### 8.1 Clients API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/clients` | List RM's clients with filters |
| `GET` | `/api/clients/:id` | Get client by ID |
| `POST` | `/api/clients` | Create new client |
| `PATCH` | `/api/clients/:id` | Update client |
| `DELETE` | `/api/clients/:id` | Delete client |

### 8.2 Signals API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/signals` | List all signals |
| `GET` | `/api/signals/recent` | Get recent signals (last 24h) |
| `PATCH` | `/api/signals/:id/read` | Mark signal as read |
| `PATCH` | `/api/signals/:id/action` | Mark signal as actioned |

### 8.3 Intelligence API (Manual Input)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/intelligence` | RM adds manual intelligence |

### 8.4 Chat API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Send message (streaming, multilingual) |
| `GET` | `/api/chat/history` | Get chat history |

### 8.5 Wallet Share API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/wallet-share` | Get RM's wallet share summary |
| `GET` | `/api/wallet-share/:clientId` | Get client wallet analysis |

### 8.6 Cross-Sell API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cross-sell` | Get cross-sell opportunities |
| `GET` | `/api/cross-sell/recommendations` | Get AI recommendations |

### 8.7 Voice Notes API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/voice-notes` | List RM's voice notes |
| `POST` | `/api/voice-notes` | Upload new voice note |
| `POST` | `/api/voice-notes/transcribe` | Transcribe audio |
| `DELETE` | `/api/voice-notes/:id` | Delete voice note |

### 8.8 Follow-ups API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/follow-ups` | List RM's follow-ups |
| `POST` | `/api/follow-ups` | Create follow-up |
| `PATCH` | `/api/follow-ups/:id` | Update follow-up |
| `PATCH` | `/api/follow-ups/:id/complete` | Mark complete |

### 8.9 Fireflies Webhook

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/fireflies/webhook` | Receive Fireflies notification |

### 8.10 Risk Alerts API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/risk-alerts` | Get active risk alerts |
| `PATCH` | `/api/risk-alerts/:id/acknowledge` | Acknowledge alert |
| `PATCH` | `/api/risk-alerts/:id/resolve` | Resolve alert |

### 8.11 News API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/news` | Get client news feed |
| `PATCH` | `/api/news/:id/read` | Mark as read |
| `PATCH` | `/api/news/:id/dismiss` | Dismiss article |

### 8.12 Metrics API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/metrics` | Get dashboard metrics |
| `GET` | `/api/metrics/performance` | Get RM performance data |

---

## 9. Design System Reference

Based on **Kairos Capital** inspired premium aesthetic:

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Primary Navy | `#0A1628` | Headers, sidebars, trust |
| Royal Blue | `#1E3A5F` | Interactive elements |
| Gold Accent | `#C9A227` | CTAs, highlights, high scores |
| Background | `#FFFFFF` | Main content |
| Secondary BG | `#F8F9FA` | Cards, sections |
| Text Primary | `#1A1A2E` | Headings, body |
| Text Muted | `#5A6C7D` | Secondary text |
| Success | `#28A745` | Positive indicators |
| Warning | `#FFC107` | Caution states |
| Error/Critical | `#DC3545` | Urgent actions, alerts |

### Signal Severity Colors

| Severity | Background | Border | Usage |
|----------|------------|--------|-------|
| Critical | `#F8D7DA` | `#DC3545` | Act within 24-48 hours |
| High | `#FFE5CC` | `#FF8C00` | Act within 1 week |
| Medium | `#FFF3CD` | `#FFC107` | Act within 2 weeks |
| Low | `#D4EDDA` | `#28A745` | Monitor / Informational |

### Lead Score Tiers

| Score | Label | Color | Action |
|-------|-------|-------|--------|
| 90-100 | Excellent | Gold gradient | Act Now |
| 70-89 | Good | Royal Blue | High Priority |
| 50-69 | Fair | Slate | Nurture |
| 0-49 | Low | Gray | Watch List |

---

## 10. Environment Variables

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

# Azure Speech (for multilingual transcription)
AZURE_SPEECH_KEY=your-key
AZURE_SPEECH_REGION=your-region

# Microsoft Graph (OneDrive)
MICROSOFT_CLIENT_ID=your-client-id
MICROSOFT_CLIENT_SECRET=your-client-secret
MICROSOFT_TENANT_ID=your-tenant-id
ONEDRIVE_FOLDER_PATH=/UHNW-Meetings

# Fireflies.ai
FIREFLIES_API_KEY=your-api-key
FIREFLIES_WEBHOOK_SECRET=your-webhook-secret

# Data Sources
PRIVATE_CIRCLE_API_KEY=your-key
ZAUBA_API_KEY=your-key
NEWS_API_KEY=your-key

# Feature Flags
NEXT_PUBLIC_ENABLE_CHATBOT=true
NEXT_PUBLIC_ENABLE_VOICE_NOTES=true
NEXT_PUBLIC_ENABLE_FIREFLIES=true
NEXT_PUBLIC_ENABLE_NEWS_FEED=true
```

---

## 11. Security Considerations

### Authentication & Authorization
- Supabase Auth with Row Level Security (RLS)
- Role-based access control (RM, Admin)
- JWT token validation on all API routes
- Session refresh with secure httpOnly cookies

### Data Protection
- All data encrypted at rest (Supabase)
- TLS 1.3 for data in transit
- PII masking in logs
- GDPR-compliant data handling
- Meeting recordings stored with encryption

### API Security
- Rate limiting (100 req/min per user)
- Input validation with Zod schemas
- CORS restricted to approved origins
- Webhook signature verification (Fireflies)

---

## 12. Performance Targets

| Metric | Target |
|--------|--------|
| Time to First Byte (TTFB) | < 200ms |
| Largest Contentful Paint (LCP) | < 2.5s |
| First Input Delay (FID) | < 100ms |
| API Response Time (p95) | < 500ms |
| Chat Response Start | < 1s |
| Voice Transcription Start | < 3s |
| Follow-up Extraction | < 30s after transcript available |

---

## 13. Implementation Roadmap

### Phase 1: Core Platform (Weeks 1-4)
- [ ] Project setup with Next.js 15
- [ ] Supabase database schema
- [ ] Authentication flow
- [ ] Dashboard page (Story 1, 4, 7)
- [ ] Client list and detail (Story 2, 3, 5)
- [ ] Signals feed (Story 1, 9)

### Phase 2: Intelligence Features (Weeks 5-8)
- [ ] Lead scoring with explanations (Story 2)
- [ ] AI Chatbot with multilingual support (Story 6)
- [ ] Manual intelligence input (Story 11)
- [ ] News feed integration (Story 12)
- [ ] Data source connectors (Story 10)

### Phase 3: Growth Features (Weeks 9-12)
- [ ] Wallet share analysis (Story 14)
- [ ] Cross-sell opportunities (Story 25)
- [ ] Credit opportunities (Story 17)
- [ ] Relationship graph (Story 8)
- [ ] Network mapping (Story 20)

### Phase 4: Productivity & Risk (Weeks 13-16)
- [ ] Voice notes with transcription (Story 21)
- [ ] Fireflies.ai integration (Story 21)
- [ ] Auto follow-up creation (Story 21)
- [ ] Risk concentration alerts (Story 24)
- [ ] Client health monitoring (Story 22)
- [ ] AI trend insights (Story 19)

### Phase 5: Analytics & Polish (Weeks 17-20)
- [ ] RM performance dashboard (Story 23)
- [ ] Conversion/churn metrics (Story 18)
- [ ] Mobile optimization
- [ ] Testing and QA
- [ ] Production deployment

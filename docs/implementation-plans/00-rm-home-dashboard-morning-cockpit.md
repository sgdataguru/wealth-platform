# [00] RM Home Dashboard - "The Morning Cockpit" - Implementation Plan

## Project Context
**Technical Stack**: Next.js 15 (App Router), React 18, TypeScript 5, TailwindCSS 3, Zustand
**Backend**: Supabase (PostgreSQL, Realtime), Mock APIs (MVP)
**Infrastructure**: Vercel (Frontend), Supabase Cloud
**Design System**: Kairos Capital Aesthetic (Premium UHNW)

---

## User Story

**As a** Senior Relationship Manager managing complex Indian UHNW family portfolios,  
**I want** a 4-column dashboard that combines AI-driven engagement suggestions with immediate compliance alerts, daily scheduling, and hyper-localized market intelligence,  
**So that** I can instantly prioritize my day, mitigate risks, and propose relevant investment opportunities (Equity, Commodities, Real Estate) before the client asks.

---

## Pre-conditions

- ✅ Next.js 15 project initialized with App Router
- ✅ TailwindCSS configured with custom design tokens
- ✅ TypeScript configured with strict mode
- ✅ Design system colors and typography defined in global CSS
- ✅ Authentication system in place (user context available)
- ⬜ User profile with RM details and client portfolio mapping
- ⬜ Mock data services for MVP (suggestions, alerts, calendar, market data)
- ⬜ Zustand stores initialized for state management
- ⬜ Base layout components (Header, Sidebar) implemented

---

## Business Requirements

### BR-1: Accelerate Morning Workflow
**Metric**: Reduce time-to-first-action from 15 minutes to < 2 minutes
**Success Criteria**: 80% of RMs take action within 10 seconds of dashboard load

### BR-2: Increase Proactive Client Engagement
**Metric**: Increase proactive client touches by 40%
**Success Criteria**: > 40% suggestion acceptance rate (AI suggestions → actions taken)

### BR-3: Reduce Compliance Violations
**Metric**: Zero missed KYC renewals or margin calls
**Success Criteria**: 100% alert visibility and < 2 hour resolution time

### BR-4: Improve Client Satisfaction
**Metric**: Increase NPS by 15 points
**Success Criteria**: RMs reference context notes in 90% of meetings

---

## Technical Specifications

### Integration Points
- **Authentication**: User context from existing auth system (Supabase Auth)
- **Data Sources**: 
  - Internal Mock API for AI suggestions
  - Internal Mock API for alerts and compliance data
  - Internal Mock API for calendar/agenda data
  - External Market Data API (Alpha Vantage/Yahoo Finance for MVP)
- **Real-time Updates**: Supabase Realtime for alert notifications
- **State Management**: Zustand for client-side state
- **API Format**: RESTful JSON APIs

### Security Requirements
- Row-Level Security (RLS) in Supabase: RMs only see their client data
- JWT authentication on all API endpoints
- Input sanitization for all user-editable fields
- No PII in client-side logs
- HTTPS only for all communications

### API Endpoints

```typescript
// Column 1: AI Engagement Suggestions
GET /api/suggestions/next-best-actions
Response: { suggestions: Suggestion[], updatedAt: string }

// Column 2: Immediate Actions & Alerts
GET /api/alerts/critical
Response: { alerts: Alert[], urgentCount: number }

// Column 3: Today's Agenda
GET /api/calendar/today
Response: { meetings: Meeting[], lifeEvents: LifeEvent[] }

// Column 4: Market Insights
GET /api/market/insights
Response: { insights: MarketInsight[], lastRefresh: string }

// User Preferences
GET /api/user/preferences
PUT /api/user/preferences
Body: { columnOrder: number[], expandedSections: string[] }
```

---

## Implementation Plan

This implementation plan has been extracted to a separate task management document for detailed tracking.

Please refer to `/Users/maheshkumarpaik/.gemini/antigravity/brain/70074b2e-7031-4a5d-a1a5-777db846ab0f/task.md` for the complete phase-by-phase breakdown.

---

## Status

**CURRENT STATUS:** ⬜ Planning Phase
**NEXT MILESTONE:** Phase 1 - Foundation & Setup

---


# User Story 00: RM Home Dashboard - "The Morning Cockpit"

**Priority:** P0 (Core Feature)  
**Epic:** Dashboard & Home Experience  
**Story Points:** 13  
**Status:** [~] In Progress  

---

## Story

**As a** Senior Relationship Manager managing complex Indian UHNW family portfolios,  
**I want** a 4-column dashboard that combines AI-driven engagement suggestions with immediate compliance alerts, daily scheduling, and hyper-localized market intelligence,  
**So that** I can instantly prioritize my day, mitigate risks, and propose relevant investment opportunities (Equity, Commodities, Real Estate) before the client asks.

---

## Acceptance Criteria

### AC-1: Dashboard Layout Structure
**Given** I am a logged-in Relationship Manager  
**When** I land on the home dashboard  
**Then** I should see a 4-column grid layout that is:
- Fully visible on desktop screens (1920x1080 minimum)
- Each column has equal width (25% of viewport)
- Columns are labeled: "AI Engagement", "Immediate Actions", "Today's Agenda", "Market Insights"
- Each column header has a distinct icon/color identifier
- Layout is responsive (stacks on tablet/mobile)

**Acceptance:**
- [ ] 4-column grid renders correctly on desktop
- [ ] Column headers are clearly labeled
- [ ] Visual hierarchy is maintained (headers → content)
- [ ] Responsive breakpoints: mobile (1 col), tablet (2 cols), desktop (4 cols)

---

### AC-2: Column 1 - AI Engagement Suggestions (Next Best Action Engine)

**Given** I am viewing the dashboard  
**When** I look at Column 1 "AI Engagement Suggestions"  
**Then** I should see:
- A prioritized list of 3-5 AI-generated action items
- Each item displays:
  - **Insight Type** (e.g., "Liquidity Event Detected", "Yield Mismatch", "Portfolio Gap")
  - **Client Context** (family name, specific numbers like "$50 Million from startup exit")
  - **Suggested Action** (clickable CTA like "Draft Proposal", "Call Client", "Schedule Meeting")
  - **Priority Badge** (High/Medium/Low with color coding)
- Items are sorted by priority and recency
- Each suggestion has an action button that opens relevant workflow

**Mock Data Example:**
```
Priority: HIGH
Insight: "Liquidity Event Detected"
Context: "The Malhotra Family just received $50 Million from their startup exit."
Suggested Action: "Propose 'Tax-Free Bonds' or 'Structured Notes'"
[Draft Proposal Button] [Call Client Button]

Priority: MEDIUM
Insight: "Yield Mismatch"
  Context: "Mr. Verma's portfolio is holding 40% in low-yield savings."
Suggested Action: "Suggest re-allocation to Nifty 50 Index Fund"
[Call Client Button]
```

**Acceptance:**
- [ ] AI suggestions are displayed in priority order
- [ ] Each suggestion shows insight type, context, and action
- [ ] Action buttons are functional and open relevant workflows
- [ ] Priority badges are color-coded (Red=High, Orange=Medium, Gray=Low)
- [ ] Maximum 5 suggestions shown at once
- [ ] "View All Suggestions" link available

---

### AC-3: Column 2 - Immediate Actions & Alerts (Risk & Compliance Zone)

**Given** I am viewing the dashboard  
**When** I look at Column 2 "Immediate Actions & Alerts"  
**Then** I should see:
- Critical alerts with red indicator (🔴)
- Warning alerts with yellow indicator (🟡)
- Each alert displays:
  - **Alert Type** (e.g., "KYC Refresh Overdue", "Margin Warning", "Document Signing")
  - **Client/Entity Name**
  - **Specific Details** (e.g., "Portfolio collateral at 105%")
  - **Action Required** (clickable link or button)
- Alerts are time-sensitive and sorted by urgency
- Count badge shows total urgent items

**Mock Data Example:**
```
🔴 CRITICAL: KYC Refresh Overdue
Client: The Singhania Family Trust
Action: Request Aadhaar/PAN update
[Request Documents]

🔴 CRITICAL: Margin Call Warning
Client: Rajesh Gupta
Details: Portfolio collateral at 105%. Nifty correction risk.
[View Portfolio] [Alert Client]

🟡 WARNING: Document Signing Pending
Client: Chatterjee Family
Details: Term Sheet for Worli Sea Face Property
[Send Reminder]
```

**Acceptance:**
- [ ] Critical alerts (🔴) appear at the top
- [ ] Warning alerts (🟡) appear below critical
- [ ] Each alert has clear client name and action required
- [ ] Action buttons open relevant detail panels or workflows
- [ ] Alert count badge shows in header (e.g., "URGENT (3)")
- [ ] Alerts can be dismissed/acknowledged
- [ ] Dismissed alerts move to "Resolved" section

---

### AC-4: Column 3 - Today's Agenda & Context (Concierge View)

**Given** I am viewing the dashboard  
**When** I look at Column 3 "Today's Agenda"  
**Then** I should see:
- Today's date prominently displayed
- Chronological list of scheduled meetings/calls
- Each agenda item shows:
  - **Time** (e.g., "10:00 AM")
  - **Meeting Title** (e.g., "Coffee with Mrs. Nair")
  - **Location** (e.g., "The Ritz-Carlton, Riyadh")
  - **AI Context Note** (e.g., "Her granddaughter just got admission to ISB")
  - **Status Indicator** (e.g., "Portfolio Report Ready")
  - **Quick Actions** ([View Report], [Send Gift], etc.)
- Section for "Significant Life Events" (birthdays, graduations, anniversaries)
- Integration with calendar (Outlook/Google)

**Mock Data Example:**
```
📅 TODAY: Saturday, December 21, 2025

TODAY'S SCHEDULE

10:00 AM - Coffee with Mrs. Nair
Location: The Ritz-Carlton, Riyadh
💡 Context: Her granddaughter just got admission to an Executive MBA program in Doha. 
   Send congratulations.
[Send Gift & Message]

02:30 PM - Portfolio Review: The Chatterjee Group
Status: Performance Report generated [View PDF]
[Prep Notes] [Join Call]

---

SIGNIFICANT LIFE EVENTS

�� TODAY: Client A's 60th Birthday
   Family Office account holder
[Schedule Gift & Message]

📚 NEXT WEEK: Client B's daughter graduates Harvard
[Request Gift - Email Client]
```

**Acceptance:**
- [ ] Today's date is displayed at top
- [ ] Meetings are shown in chronological order
- [ ] Each meeting has time, title, location
- [ ] AI context notes are displayed (derived from CRM or previous interactions)
- [ ] Status indicators show prep status (e.g., "Report Ready")
- [ ] Quick action buttons are functional
- [ ] Life events section shows upcoming birthdays/milestones
- [ ] Calendar sync works (read-only)

---

### AC-5: Column 4 - Market Insights & Opportunities (Indian Macro View)

**Given** I am viewing the dashboard  
**When** I look at Column 4 "Market Insights"  
**Then** I should see:
- Real-time or near-real-time market data
- Asset class-specific updates relevant to UHNW portfolios:
  - **Indian Equities** (Nifty 50, Sensex, sector performance)
  - **Currency** (USD/INR, hedging alerts)
  - **Commodities** (Gold, Silver - important for Indian clients)
  - **Real Estate** (Mumbai/Delhi commercial yields)
- Each insight shows:
  - **Asset Class Icon**
  - **Headline** (e.g., "Nifty 50 down -1.2%")
  - **Context** (e.g., "Banking Sector weakness")
  - **Actionable Suggestion** (e.g., "Hedge recommendation for clients with US tuition")
- Data is refreshed every 15 minutes during market hours

**Mock Data Example:**
```
MARKET INSIGHTS

🇮🇳 Indian Equities
Nifty 50: 21,450 (-1.2%)
Banking Sector testing support levels. HDFC Bank down -2.3%.
→ Consider defensive plays for risk-averse clients

📉 Currency Alert
USD/INR: 83.50 (↑ 0.45%)
Rupee depreciation detected. 
→ Hedge recommendation for clients with US tuition payments

✨ Commodities
Gold: $62,500/10g (+2.0%)
Wedding Season Demand surge.
→ Good time to pitch Sovereign Gold Bonds?

🏢 Real Estate
Dubai - Downtown Commercial Yields: 8.0% (Stable)
Prime office space showing resilience.
→ Opportunity for clients seeking passive income
```

**Acceptance:**
- [ ] Market data is displayed for 4 key asset classes
- [ ] Each insight has icon, headline, context, suggestion
- [ ] Data is refreshed every 15 minutes during market hours
- [ ] Actionable suggestions are client-relevant
- [ ] Historical comparison shown (e.g., "+2.0%")
- [ ] Links to detailed market analysis reports
- [ ] Currency alerts highlight USD/INR volatility
- [ ] Real estate data specific to Dubai/Riyadh/Doha

---

### AC-6: Performance & User Experience

**Given** I am using the dashboard  
**When** the page loads or refreshes  
**Then** it should:
- Load all 4 columns within 2 seconds
- Show skeleton loaders during data fetch
- Handle API failures gracefully (show error state, retry button)
- Support infinite scroll or "Load More" for long lists
- Be keyboard navigable (tab through actions)
- Be screen reader friendly (ARIA labels)

**Acceptance:**
- [ ] Initial page load < 2 seconds
- [ ] Skeleton loaders for each column during fetch
- [ ] Error states display with retry option
- [ ] Keyboard navigation works (tab, enter)
- [ ] Screen reader announces column headings and alerts
- [ ] Mobile responsive (1 column stacked view)

---

### AC-7: Data Refresh & Real-Time Updates

**Given** I am viewing the dashboard  
**When** new data becomes available (new alert, meeting update, market change)  
**Then** the dashboard should:
- Show a notification badge (e.g., "3 new alerts")
- Auto-refresh Column 2 (Alerts) every 5 minutes
- Auto-refresh Column 4 (Market Data) every 15 minutes
- Allow manual refresh via a button
- Preserve scroll position after refresh

**Acceptance:**
- [ ] Notification badge shows new items count
- [ ] Alerts column auto-refreshes every 5 minutes
- [ ] Market data column auto-refreshes every 15 minutes
- [ ] Manual refresh button in header
- [ ] Scroll position is preserved
- [ ] Optimistic UI updates (instant feedback)

---

### AC-8: User Personalization

**Given** I am a logged-in RM with specific client portfolio  
**When** I view the dashboard  
**Then** the data should be:
- Personalized to my client book (only my clients' alerts/suggestions)
- Show my name and avatar in header
- Display my AUM and key metrics at top
- Allow me to customize column order (drag-and-drop)
- Save my preferences (column order, expanded/collapsed sections)

**Acceptance:**
- [ ] Data is filtered to my client portfolio
- [ ] My name/avatar shown in header
- [ ] My AUM metrics displayed at top
- [ ] Column order can be customized (drag-and-drop)
- [ ] Preferences are saved to user profile
- [ ] Reset to default layout option available

---

## Visual Wireframe (Text-Based)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  🏦 UHNW Intelligence Platform          Search Clients, Assets, Notes...   🔔 │
│  John Smith, RM                         [+ Quick Action]                        │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Total AUM: $2.45 Billion USD    Net New Money (YTD): +$150 Million           │
│  [+1.2% MTD]                      At-Risk Clients: 3 Clients require outreach │
│                                                                          URGENT (3)
│                                                                          FYI (5) │
├───────────────────┬──────────────────┬──────────────────┬─────────────────────┤
│                   │                  │                  │                     │
│  AI ENGAGEMENT    │  IMMEDIATE       │  TODAY'S         │  PORTFOLIO INSIGHTS │
│  SUGGESTIONS      │  ACTIONS &       │  AGENDA &        │  & OPPORTUNITIES    │
│  (Next Best       │  ALERTS          │  CONTEXT         │                     │
│  Actions)         │  (Red Zone)      │  (Concierge)     │                     │
│                   │                  │                  │                     │
├───────────────────┼──────────────────┼──────────────────┼─────────────────────┤
│                   │                  │                  │                     │
│ 🎯 Proactive      │ 🔴 Margin Call   │ 📅 TODAY:        │ Top Portfolio       │
│    Advice:        │    Warning:      │ Dec 21, 2025     │ Impacters           │
│                   │                  │                  │                     │
│ 10:00 AM - Coffee │ Client X portf.  │ TODAY'S SCHEDULE │ 1. Tech Sector      │
│ with Helena       │ sits at collat.  │                  │    Sell-off -3%     │
│ Berlinati         │ requirement.     │ 1. 10:00 AM -    │    Affects Sato     │
│ Family Office     │ [VIEW DETAILS]   │    Coffee with   │    Family & Mitssa  │
│                   │                  │    Helena        │    most harrad      │
│ [GENERATE DRAFT]  │ 🛑 AML/KYC Block │    Berlinati     │                     │
│ [LOG CLIENT CALL] │                  │    Family Office │ [View Impact] [View │
│                   │ The Chen Family  │                  │  Impact Report]  >  │
│ 🤝 Client         │ Foundation trans │ [Status: Portf.  │                     │
│    Engagement     │ action flagged   │  Report Ready /  │ ───────────────     │
│                   │ pending docs.    │  Missing Updated │                     │
│ 1. Today is       │ [RESOLVE NOW]    │  Trust Deed      │ Watchlist           │
│    Client A's     │                  │                  │ Opportunities       │
│    60 Birthday    │ 🟡 Client Y has  │ SIGNIFICANT      │                     │
│    Family Office  │    $10M Private  │ LIFE EVENTS      │ 1. Client D asked   │
│                   │    Equity cap.   │                  │    for yield. Ten-  │
│ [Schedule Gift &  │    call due in   │ 1. 10:00 AM -    │    year treasury    │
│  Message]         │    48 hours.     │    Call with     │    crossed 4.58.    │
│                   │                  │    Sato Fato     │                     │
│ ⚠️ Compliance     │ 📄 Document      │    Family Office │ [Draft Bond         │
│    Reminder       │    Expiry:       │                  │  Proposal]       >  │
│                   │                  │ [Status: Prep    │                     │
│ 1. Passport       │ Passport for     │  Pack Complete]  │                     │
│    Client A'B     │ Beneficiary Z    │                  │                     │
│    daugher z      │ expires in 30    │ SIGNIFICANT      │                     │
│    iagrites       │ days             │ LIFE EVENTS      │                     │
│                   │ [REQUEST DOC]    │                  │                     │
│ [REQUEST GIFT -   │                  │ 1. TODAY: Client │                     │
│  MAIL CLIENT      │                  │    A's 60        │                     │
│  Harvard]         │                  │    Birthday      │                     │
│                   │                  │                  │                     │
│                   │                  │ NEXT WEEK:       │                     │
│                   │                  │ Client B's       │                     │
│                   │                  │ daughter         │                     │
│                   │                  │ graduates        │                     │
│                   │                  │ Harvard          │                     │
│                   │                  │                  │                     │
└───────────────────┴──────────────────┴──────────────────┴─────────────────────┘
│                                                                                 │
│  ▶ Quick Views        LIVE FX RATES:  USD/SGD 1.35  USD/CHF 89                │
│                       0.92                                                      │
│                       SYSTEM STATUS: ✅ All Systems Operational                │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Enhanced Visual Wireframe (Detailed)

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║  🏦 UHNW INTELLIGENCE PLATFORM          🔍 Search Clients, Assets, Notes... ║
║  Global Header                          [+ Quick Action]  🔔 Notifications   ║
║  John Smith, Senior RM                                                  (8)   ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                                ║
║  💰 Total AUM: $2.45 Billion USD   📈 Net New Money (YTD): +$150 Million     ║
║     [+1.2% MTD]                    ⚠️  At-Risk Clients: 3 require outreach   ║
║                                                                                ║
║                                                      🔴 URGENT (3)  🔵 FYI (5) ║
╠═══════════════════╦═══════════════════╦═══════════════════╦══════════════════╣
║                   ║                   ║                   ║                  ║
║  🎯 AI            ║  🚨 IMMEDIATE     ║  📅 TODAY'S       ║  📊 PORTFOLIO    ║
║  ENGAGEMENT       ║  ACTION & ALERTS  ║  AGENDA &         ║  INSIGHTS &      ║
║  SUGGESTIONS      ║  (The "Red Zone") ║  CONTEXT          ║  OPPORTUNITIES   ║
║  (Next Best       ║                   ║  (The "Concierge")║                  ║
║  Actions Engine)  ║                   ║                   ║                  ║
║                   ║                   ║                   ║                  ║
╠═══════════════════╬═══════════════════╬═══════════════════╬══════════════════╣
║                   ║                   ║                   ║                  ║
║ ┌───────────────┐ ║ ┌───────────────┐ ║ 📆 SATURDAY,      ║ ┌──────────────┐ ║
║ │ 🎯 PROACTIVE  │ ║ │ 🔴 CRITICAL   │ ║ DECEMBER 21, 2025 ║ │ TOP PORTFOLIO│ ║
║ │    ADVICE:    │ ║ │               │ ║                   ║ │  IMPACTERS   │ ║
║ │ PRIORITY: HIGH│ ║ │ Margin Call   │ ║ TODAY'S SCHEDULE  ║ │              │ ║
║ └───────────────┘ ║ │ Warning:      │ ║                   ║ └──────────────┘ ║
║                   ║ │               │ ║ ⏰ 10:00 AM -     ║                  ║
║ Liquidity Event   ║ │ Client X      │ ║ Coffee with       ║ 1. 📉 Tech      ║
║ Detected          ║ │ portfolio sits│ ║ Helena Berlinati  ║    Sector       ║
║                   ║ │ at collateral │ ║ Family Office     ║    Sell-off -3% ║
║ 👤 The Malhotra   ║ │ requirement.  │ ║                   ║    Affects the  ║
║    Family just    ║ │ Nifty         │ ║ 📍 The Oberoi,    ║    Sato Family  ║
║    received $50Million ║ │ correction    │ ║    New Delhi      ║    & mitssa most║
║    from their     ║ │ risk.         │ ║                   ║    harrard      ║
║    startup exit.  ║ │               │ ║ 💡 Context:       ║                  ║
║                   ║ │ [VIEW PORTF.] │ ║    Her            ║ [View Impact]   ║
║ 💡 Suggested:     ║ │ [ALERT CLIENT]│ ║    granddaughter  ║ [View Impact    ║
║    Propose 'Tax-  ║ └───────────────┘ ║    just got       ║  Report]     >  ║
║    Free Bonds' or ║                   ║    admission to   ║                  ║
║    'Structured    ║ ┌───────────────┐ ║    ISB Hyderabad. ║ ──────────────   ║
║    Notes'         ║ │ 🛑 CRITICAL   │ ║    Send congrats! ║                  ║
║                   ║ │               │ ║                   ║ WATCHLIST        ║
║ [DRAFT PROPOSAL]  ║ │ AML/KYC Block │ ║ [SEND GIFT &      ║ OPPORTUNITIES    ║
║ [CALL CLIENT] >   ║ │               │ ║  MESSAGE]         ║                  ║
║                   ║ │ The Chen      │ ║                   ║ 1. 💡 Client D  ║
║ ─────────────────║ │ Family Found. │ ║ ⏰ 02:30 PM -     ║    asked for    ║
║                   ║ │ transaction   │ ║ Portfolio Review: ║    yield. Ten-  ║
║ ┌───────────────┐ ║ │ flagged -     │ ║ The Chatterjee    ║    year treasury║
║ │ 🤝 CLIENT     │ ║ │ pending docs. │ ║ Group             ║    crossed 4.58.║
║ │    ENGAGEMENT │ ║ │               │ ║                   ║                  ║
║ │ PRIORITY: MED │ ║ │ [RESOLVE NOW] │ ║ ✅ Status:        ║ [DRAFT BOND     ║
║ └───────────────┘ ║ └───────────────┘ ║    Performance    ║  PROPOSAL]   >  ║
║                   ║                   ║    Report         ║                  ║
║ 1. Today is       ║ ┌───────────────┐ ║    generated      ║                  ║
║    Client A's     ║ │ 🟡 WARNING    │ ║                   ║                  ║
║    60th Birthday  ║ │               │ ║ [VIEW PDF]        ║                  ║
║    Family Office  ║ │ Client Y has  │ ║ [PREP NOTES]      ║                  ║
║    account holder ║ │ $10M Private  │ ║ [JOIN CALL]       ║                  ║
║                   ║ │ Equity        │ ║                   ║                  ║
║ [SCHEDULE GIFT &  ║ │ capital call  │ ║ ─────────────────║                  ║
║  MESSAGE]         ║ │ due in 48 hrs.│ ║                   ║                  ║
║                   ║ │               │ ║ 🎉 SIGNIFICANT    ║                  ║
║ ─────────────────║ │ [VIEW DETAILS]│ ║    LIFE EVENTS    ║                  ║
║                   ║ └───────────────┘ ║                   ║                  ║
║ ┌───────────────┐ ║                   ║ 🎂 TODAY:         ║                  ║
║ │ ⚠️  COMPLIANCE│ ║ ┌───────────────┐ ║    Client A's     ║                  ║
║ │    REMINDER   │ ║ │ 📄 DOCUMENT   │ ║    60th Birthday  ║                  ║
║ │ PRIORITY: MED │ ║ │    EXPIRY     │ ║    Family Office  ║                  ║
║ └───────────────┘ ║ │               │ ║                   ║                  ║
║                   ║ │ Passport for  │ ║ [SCHEDULE GIFT &  ║                  ║
║ 1. Passport       ║ │ Beneficiary Z │ ║  MESSAGE]         ║                  ║
║    Client A'B     ║ │ expires in    │ ║                   ║                  ║
║    daughter z     ║ │ 30 days       ║ ║ 📚 NEXT WEEK:     ║                  ║
║    iagriates      ║ │               │ ║    Client B's     ║                  ║
║                   ║ │ [REQUEST DOC] │ ║    daughter       ║                  ║
║ [REQUEST GIFT -   ║ └───────────────┘ ║    graduates      ║                  ║
║  EMAIL CLIENT     ║                   ║    Harvard        ║                  ║
║  Harvard]         ║                   ║                   ║                  ║
║                   ║                   ║ [REQUEST GIFT -   ║                  ║
║                   ║                   ║  EMAIL CLIENT]    ║                  ║
║                   ║                   ║                   ║                  ║
╠═══════════════════╩═══════════════════╩═══════════════════╩══════════════════╣
║                                                                                ║
║  ▶ Quick Views     LIVE FX RATES: 0.92 USD/SGD 1.35  USD/CHF 89   🌟         ║
║                    SYSTEM STATUS: ✅ All Systems Operational                  ║
║                                                                                ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

## Technical Implementation Notes

### Component Structure

```typescript
// Main dashboard container
app/page.tsx (or app/dashboard/page.tsx)

// Column components
components/dashboard/
  ├── AIEngagementColumn.tsx      // Column 1
  ├── ImmediateActionsColumn.tsx  // Column 2
  ├── TodayAgendaColumn.tsx       // Column 3
  └── MarketInsightsColumn.tsx    // Column 4

// Card components for each insight type
components/dashboard/cards/
  ├── AIAdviceCard.tsx
  ├── ClientEngagementCard.tsx
  ├── ComplianceReminderCard.tsx
  ├── CriticalAlertCard.tsx
  ├── WarningAlertCard.tsx
  ├── ScheduleItemCard.tsx
  ├── LifeEventCard.tsx
  ├── MarketInsightCard.tsx
  └── PortfolioImpactCard.tsx
```

### Data Sources

| Column | API Endpoint | Refresh Frequency |
|--------|-------------|-------------------|
| AI Engagement | `/api/suggestions/next-best-actions` | On load, manual |
| Immediate Actions | `/api/alerts/critical` | Every 5 minutes |
| Today's Agenda | `/api/calendar/today` | On load, manual |
| Market Insights | `/api/market/insights` | Every 15 minutes |

### State Management

```typescript
// Using Zustand for client state
store/
  ├── dashboard-store.ts          // Overall dashboard state
  ├── suggestion-store.ts         // AI suggestions state
  ├── alert-store.ts              // Alerts state
  └── market-store.ts             // Market data state
```

---

## Dependencies & Integration

### External APIs
- **Nifty/Sensex Data:** NSE API or equivalent
- **Currency Rates:** RBI API or Forex provider
- **Calendar:** Microsoft Graph API (Outlook) or Google Calendar API
- **CRM Data:** Internal Kairos Capital CRM system

### Internal Systems
- **Supabase:** Client data, portfolio holdings, alerts
- **Neo4j:** Relationship graph for warm intro paths
- **AI/ML Service:** Lead scoring, suggestion engine

---

## Design System References

### Colors (Kairos Capital Aesthetic)
- **Primary Deep Blue:** `#0A1628`
- **Primary Royal Blue:** `#1E3A5F`
- **Primary Gold Accent:** `#C9A227`
- **Critical Red:** `#DC3545`
- **Warning Yellow:** `#FFC107`
- **Success Green:** `#28A745`

### Typography
- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)
- **Monospace (numbers):** JetBrains Mono

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to First Action | < 10 seconds | Time from login to first CTA click |
| Daily Active Usage | > 80% of RMs | Login + 1 action per day |
| Alert Resolution Time | < 2 hours | Critical alert → action taken |
| Suggestion Acceptance Rate | > 40% | AI suggestion → action initiated |
| Page Load Time | < 2 seconds | Initial render of all 4 columns |

---

## Future Enhancements (Out of Scope for MVP)

- [ ] Voice input for quick notes
- [ ] WhatsApp integration for client outreach
- [ ] Predictive analytics (churn prediction)
- [ ] Multi-language support (Hindi, Marathi)
- [ ] Mobile app (iOS/Android)
- [ ] Dark mode toggle

---

## Related Stories

- **Story 09:** Receive Proactive Engagement Suggestions (AI Engagement Column)
- **Story 07:** Track Leads and Follow-ups (Today's Agenda Column)
- **Story 19:** View AI-Driven Trend Insights (Market Insights Column)
- **Story 24:** View Risk Concentration Alerts (Immediate Actions Column)

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2025-12-21 | Product Team | Initial draft |

---

**Status:** [~] Ready for Implementation  
**Next Steps:** Create implementation plan and assign to frontend team

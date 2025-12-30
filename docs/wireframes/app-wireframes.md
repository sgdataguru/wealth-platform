# UHNW Liquidity Intelligence Platform - Wireframes

## Primary Persona: Relationship Manager (RM)

The platform is designed exclusively for **Relationship Managers** handling Ultra High Net Worth (UHNW) clients. All views are optimized to help RMs:
- Detect early liquidity signals before competitors
- Prioritize client outreach based on lead scores
- Deepen relationships through timely, contextual engagement
- Track personal performance and client retention

---

## Design System Reference

Based on the **Kairos Capital** inspired premium aesthetic:

| Token | Value | Usage |
|-------|-------|-------|
| Primary Navy | #0A1628 | Headers, sidebars |
| Royal Blue | #1E3A5F | Interactive elements |
| Gold Accent | #C9A227 | CTAs, highlights, high scores |
| Background | #FFFFFF | Main content |
| Secondary BG | #F8F9FA | Cards, sections |
| Text Primary | #1A1A2E | Headings, body |
| Text Muted | #5A6C7D | Secondary text |

---

## 1. RM Dashboard (Home)

```
+-------------------------------------------------------------------------+
|  HEADER BAR                                                             |
|  +--------+                               +---+ +---+ +--------+        |
|  | UHNW   |   [Search prospects...]       |Bell| |Cog| |John v |        |
|  +--------+                               +---+ +---+ +--------+        |
+-------------------------------------------------------------------------+
|         |                                                               |
| SIDEBAR |  Good morning, John                              Dec 17, 2025 |
|         |  Here's your daily intelligence summary                       |
| +-----+ |                                                               |
| |Home | |  +------------+ +------------+ +------------+ +------------+  |
| +-----+ |  | MY         | | NEW        | | ACTIVE     | | FOLLOW     |  |
| +-----+ |  | CLIENTS    | | SIGNALS    | | OPPS       | | UPS        |  |
| |Pros-| |  |            | | TODAY      | |            | |            |  |
| |pects| |  |    127     | |    12      | |    23      | |    8       |  |
| +-----+ |  | ₹680 Cr AUM| |  ↑ 3 new   | | ₹4.2 Cr    | | Due today  |  |
| +-----+ |  +------------+ +------------+ +------------+ +------------+  |
| |Sig- | |                                                               |
| |nals | |  +---------------------------+ +---------------------------+  |
| +-----+ |  |   MY TOP PROSPECTS        | |    MY ACTIVE SIGNALS      |  |
| +-----+ |  |   (By Lead Score)         | |                           |  |
| |Graph| |  | +-------------------------+| | +-----------------------+ |  |
| +-----+ |  | | RK  Rajesh Kumar   92  || | | CRITICAL: IPO Filing  | |  |
| +-----+ |  | |     Tech Innovations   || | | Rajesh Kumar          | |  |
| |Ana- | |  | |     Mumbai | Tech      || | | 2 hours ago [Action]  | |  |
| |lytics|  | |     [Call] [Email]      || | +-----------------------+ |  |
| +-----+ |  | +-------------------------+| | +-----------------------+ |  |
|         |  | | AP  Anita Patel    87  || | | HIGH: Funding Round   | |  |
| FILTERS |  | |     FinServ Holdings   || | | Anita Patel           | |  |
|         |  | |     Delhi | Finance    || | | 5 hours ago [Action]  | |  |
| +-----+ |  | |     [Call] [Email]      || | +-----------------------+ |  |
| |City | |  | +-------------------------+| | +-----------------------+ |  |
| | All | |  |                           | | | MEDIUM: Board Change  | |  |
| +-----+ |  |    [View All My Clients]  | | | Deepak Sharma         | |  |
| +-----+ |  +---------------------------+ | | Yesterday             | |  |
| |Sector|                                 | +-----------------------+ |  |
| | All | |                                |                           |  |
| +-----+ |                                |    [View All Signals]     |  |
|         |                                +---------------------------+  |
| +-----+ |                                                               |
| |Score| |  +-----------------------------------------------------------+|
| |Range| |  |              MY ACTIVITY FEED                             ||
| +-----+ |  | - You marked Rajesh Kumar as "Contacted" - 2h ago         ||
|         |  | - New signal detected for Anita Patel - 3h ago            ||
| [Apply] |  | - Follow-up reminder: Vikram Rao - Due today              ||
|         |  | - Voice note added for Deepak Sharma - Yesterday          ||
|         |  +-----------------------------------------------------------+|
+---------+---------------------------------------------------------------+
|                                                    +-------------------+ |
|                                                    | 🤖 AI Assistant   | |
|                                                    +-------------------+ |
+-------------------------------------------------------------------------+
```

---

## 2. Prospect Card Component

```
+-----------------------------------------------------------------------+
|                                                                       |
|  +------+                                          +---------------+  |
|  |      |                                          | LEAD SCORE    |  |
|  |  RK  |  Rajesh Kumar                            |               |  |
|  |      |  Director                                |      92       |  |
|  +------+  Tech Innovations Pvt Ltd                | ============  |  |
|   Avatar                                           |  Excellent    |  |
|   (Navy)                                           +---------------+  |
|                                                                       |
|  Location: Mumbai  |  Sector: Technology  |  Network: TiE            |
|  Est. Wealth: ₹450 Cr  |  My Share: ₹45 Cr (10%)                     |
|                                                                       |
|  ACTIVE SIGNALS:                                                      |
|  +-------------+  +-------------+  +-------------+                    |
|  | CRIT: IPO   |  | HIGH: Fund  |  | MED: Board  |                    |
|  | Filing      |  | Round       |  | Change      |                    |
|  | 2 days ago  |  | 1 week ago  |  | 2 weeks ago |                    |
|  +-------------+  +-------------+  +-------------+                    |
|                                                                       |
|  Last contact: 3 days ago  |  Next: Follow-up due tomorrow           |
|                                                                       |
|  [📞 Call]  [✉️ Email]  [🎙️ Voice Note]  [📋 View Details]            |
+-----------------------------------------------------------------------+
```

---

## 3. Prospect Detail Page

```
+-------------------------------------------------------------------------+
| [← Back to My Clients]                                                  |
+-------------------------------------------------------------------------+
|                                                                         |
|  +--------+   Rajesh Kumar                              [⭐ Priority]   |
|  |        |   Director, Tech Innovations Pvt Ltd                        |
|  |   RK   |   Mumbai | Technology | TiE Network                         |
|  |        |   rajesh@techinnovations.com | +91 98765 43210              |
|  +--------+                                                             |
|             [📞 Call]  [✉️ Email]  [🎙️ Voice Note]  [📅 Schedule]        |
|                                                                         |
+-------------------------------------------------------------------------+
|                                                                         |
|  +-----------------------+  +---------------------------------------+   |
|  |    LEAD SCORE         |  |     WHY THIS SCORE?                   |   |
|  |                       |  |                                       |   |
|  |    +-------------+    |  |  Score Breakdown:                     |   |
|  |    |     92      |    |  |                                       |   |
|  |    | EXCELLENT   |    |  |  [====] IPO Filing           +40      |   |
|  |    +-------------+    |  |         Company filed DRHP with SEBI  |   |
|  |                       |  |                                       |   |
|  |  ==================   |  |  [=== ] Series C Funding     +30      |   |
|  |                       |  |         Raised $50M from Sequoia      |   |
|  |  Top 5% in your book  |  |                                       |   |
|  |                       |  |  [==  ] Network Strength     +15      |   |
|  |  🔥 Act within 48hrs  |  |         12 UHNW connections in TiE    |   |
|  +-----------------------+  |                                       |   |
|                             |  [=   ] Sector Growth        +7       |   |
|                             |         Tech sector up 24% YoY        |   |
|                             +---------------------------------------+   |
|                                                                         |
+-------------------------------------------------------------------------+
|  MY WALLET SHARE                                                        |
+-------------------------------------------------------------------------+
|  +-------------------------------------------------------------------+  |
|  |  Est. Total Wealth: ₹450 Cr                                       |  |
|  |  My Current Share:  ₹45 Cr (10%)  [===========                 ]  |  |
|  |  Opportunity Gap:   ₹180 Cr (40% realistic capture)               |  |
|  |                                                                   |  |
|  |  Products Held: Wealth Management                                 |  |
|  |  Products Missing: PMS, Alternates, Credit Line                   |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
+-------------------------------------------------------------------------+
|  SIGNAL TIMELINE                                                        |
+-------------------------------------------------------------------------+
|                                                                         |
|  Dec 15  o------------------------------------------------------        |
|          |                                                              |
|          |  [CRITICAL] IPO Filing Detected                 [NEW]       |
|          |  Tech Innovations filed DRHP with SEBI                       |
|          |  Expected listing: Q1 2026 | Est. value: ₹2,000 Cr          |
|          |  Source: Exchange Data                                       |
|          |  [✓ Mark Actioned] [📞 Call Now] [📋 Create Task]            |
|                                                                         |
|  Dec 10  o------------------------------------------------------        |
|          |                                                              |
|          |  [HIGH] Funding Round Announced                              |
|          |  Series C at $50M valuation from Sequoia                     |
|          |  Source: PrivateCircle                                       |
|          |  [✓ Actioned] - Called on Dec 11                            |
|                                                                         |
|  Nov 28  o------------------------------------------------------        |
|          |                                                              |
|          |  [MEDIUM] Board Member Addition                              |
|          |  New independent director: Former SEBI member                |
|          |  Source: Zauba Corp                                          |
|          |  [✓ Actioned]                                               |
|                                                                         |
+-------------------------------------------------------------------------+
|  RELATIONSHIP CONNECTIONS                               [Expand Graph]  |
+-------------------------------------------------------------------------+
|                                                                         |
|                        +---------------+                                |
|                        | Tech Innov.   |                                |
|           +------------+---------------+------------+                   |
|           |                    |                    |                   |
|      +---------+         +---------+         +---------+                |
|      | Rajesh  |         | Sequoia |         |  SEBI   |                |
|      |  Kumar  |         |  India  |         | Filing  |                |
|      +---------+         +---------+         +---------+                |
|           |                                                             |
|      +---------+                                                        |
|      |Your TiE |  <-- Warm intro path available                        |
|      |Contact  |                                                        |
|      +---------+                                                        |
|                                                                         |
+-------------------------------------------------------------------------+
|  SUGGESTED ACTIONS FOR YOU                                              |
+-------------------------------------------------------------------------+
|                                                                         |
|  1. 📞 Schedule call within 48 hours                         [Do Now]  |
|     IPO filings typically have 3-month window                           |
|                                                                         |
|  2. 📊 Prepare portfolio presentation for tech sector        [Prepare] |
|     Highlight similar successful exits you've handled                   |
|                                                                         |
|  3. �� Request intro via your TiE contact (Amit Shah)        [Request] |
|     Warm introduction increases response rate by 3x                     |
|                                                                         |
|  4. 💳 Discuss credit facility for IPO bridge financing      [Propose] |
|     Current utilization 92% - likely needs increase                     |
|                                                                         |
+-------------------------------------------------------------------------+
|  MY NOTES & VOICE MEMOS                                                 |
+-------------------------------------------------------------------------+
|  +-------------------------------------------------------------------+  |
|  | 📝 Dec 11 - Called about Series C, very receptive to PMS         |  |
|  | 🎙️ Dec 5 - Meeting notes [▶ 2:34] - Discussed family office      |  |
|  | 📝 Nov 20 - Initial outreach, scheduled follow-up                 |  |
|  |                                              [+ Add Note]          |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

## 4. AI Chatbot (RM's Personal Assistant)

```
Collapsed State (Bottom Right):
                                    +---------------+
                                    | 🤖 Ask AI     |
                                    +---------------+

Expanded State:
+-------------------------------------------+
|  🤖 Your AI Assistant            [-] [X]  |
+-------------------------------------------+
|                                           |
|  +-------------------------------------+  |
|  | Hello John! I can help you find     |  |
|  | opportunities, prep for calls, and  |  |
|  | answer questions about your clients.|  |
|  |                                     |  |
|  | What would you like to know?        |  |
|  +-------------------------------------+  |
|                                           |
|       +-------------------------------+   |
|       | Which of my clients might     |   |
|       | have liquidity events in the  |   |
|       | next 30 days?                 |   |
|       +-------------------------------+   |
|                                           |
|  +-------------------------------------+  |
|  | Based on your book, I found 5       |  |
|  | clients with upcoming signals:      |  |
|  |                                     |  |
|  | 1. Rajesh Kumar (Score: 92)         |  |
|  |    IPO filing - likely 30-45 days   |  |
|  |    [View] [Call Now]                |  |
|  |                                     |  |
|  | 2. Anita Patel (Score: 87)          |  |
|  |    Acquisition talks - 2-4 weeks    |  |
|  |    [View] [Call Now]                |  |
|  |                                     |  |
|  | 3. Deepak Sharma (Score: 78)        |  |
|  |    Secondary sale signals           |  |
|  |    [View] [Call Now]                |  |
|  |                                     |  |
|  | 💡 Tip: Prioritize Rajesh - IPO     |  |
|  | windows close fast!                 |  |
|  +-------------------------------------+  |
|                                           |
+-------------------------------------------+
| QUICK ACTIONS                             |
| +-------------+ +------------+ +--------+ |
| |My signals   | |Follow-ups  | |Prep    | |
| |today        | |due         | |for call| |
| +-------------+ +------------+ +--------+ |
+-------------------------------------------+
| 🌐 [EN] [हिं] [मर]    Type...     [Send]  |
+-------------------------------------------+
```

---

## 5. Signal Badges (Priority Coding)

```
CRITICAL (Red) - Act within 24-48 hours
+---------------------+
| 🔴 IPO Filing       |  Background: #F8D7DA
|    2 days ago       |  Border: #DC3545
+---------------------+  Text: #721C24

HIGH (Orange) - Act within 1 week
+---------------------+
| 🟠 Acquisition      |  Background: #FFE5CC
|    5 days ago       |  Border: #FF8C00
+---------------------+  Text: #8B4513

MEDIUM (Yellow) - Act within 2 weeks
+---------------------+
| 🟡 Funding Round    |  Background: #FFF3CD
|    1 week ago       |  Border: #FFC107
+---------------------+  Text: #856404

LOW (Green) - Monitor / Informational
+---------------------+
| 🟢 Board Change     |  Background: #D4EDDA
|    2 weeks ago      |  Border: #28A745
+---------------------+  Text: #155724
```

---

## 6. Lead Score Indicator

```
EXCELLENT (90-100) - Top Priority
+------------------+
|       92         |   Circle: Gold gradient
|  =============== |   Bar: #C9A227 to #D4AF37
|    Excellent     |   Label: "Top 5% - Act Now"
+------------------+

GOOD (70-89) - High Priority
+------------------+
|       78         |   Circle: Royal Blue
|  ===========     |   Bar: #1E3A5F
|      Good        |   Label: "Strong prospect"
+------------------+

FAIR (50-69) - Standard Priority
+------------------+
|       58         |   Circle: Slate
|  ========        |   Bar: #5A6C7D
|      Fair        |   Label: "Nurture"
+------------------+

LOW (0-49) - Monitor
+------------------+
|       35         |   Circle: Gray
|  =====           |   Bar: #8E99A4
|       Low        |   Label: "Watch list"
+------------------+
```

---

## 7. Mobile Dashboard (RM on the go)

```
+-------------------------+
| [=]  UHNW    [Bell] [U] |
+-------------------------+
|                         |
| Good morning, John      |
| You have 12 new signals |
|                         |
| +---------+ +---------+ |
| |   127   | |   12    | |
| |My Clients| |Signals  | |
| |₹680Cr AUM| | Today   | |
| +---------+ +---------+ |
| +---------+ +---------+ |
| |   23    | |    8    | |
| |  Opps   | |Follow-up| |
| |₹4.2 Cr  | |Due today| |
| +---------+ +---------+ |
|                         |
| 🔥 URGENT ACTIONS       |
| +---------------------+ |
| | 🔴 Rajesh Kumar     | |
| |    IPO Filing - 92  | |
| |    [Call] [Details] | |
| +---------------------+ |
| +---------------------+ |
| | �� Anita Patel      | |
| |    Acquisition - 87 | |
| |    [Call] [Details] | |
| +---------------------+ |
|                         |
| [View All Signals]      |
|                         |
| TODAY'S FOLLOW-UPS      |
| +---------------------+ |
| | Vikram Rao          | |
| | Scheduled: 2:00 PM  | |
| | [Join Call] [Notes] | |
| +---------------------+ |
|                         |
+-------------------------+
| [Home][Clients][+][🤖]  |
+-------------------------+
```

---

## 8. Button Styles

```
PRIMARY (Gold Gradient) - Main Actions
+---------------------------+
|      📞 Call Now          |  Background: #C9A227 -> #D4AF37
|                           |  Color: #1A1A2E
+---------------------------+  Hover: Gold glow effect

SECONDARY (Navy Outline) - Secondary Actions
+---------------------------+
|      View Details         |  Background: transparent
|                           |  Border: 2px solid #1E3A5F
+---------------------------+  Color: #1E3A5F

GHOST (Minimal) - Tertiary Actions
+---------------------------+
|      See more →           |  Background: transparent
|                           |  Color: #1E3A5F
+---------------------------+  Hover: Underline

URGENT (Red) - Time-Sensitive
+---------------------------+
|     🔥 Act Now            |  Background: #DC3545
|                           |  Color: #FFFFFF
+---------------------------+  Pulse animation
```

---

## 9. Add Liquidity Event Modal (RM Input)

```
+---------------------------------------------------+
|  Add Intelligence                           [X]   |
+---------------------------------------------------+
|                                                   |
|  I discovered something about a client/prospect   |
|                                                   |
|  CLIENT/PROSPECT *                                |
|  +---------------------------------------------+  |
|  | [Search your clients...]                [v] |  |
|  +---------------------------------------------+  |
|                                                   |
|  WHAT DID YOU LEARN? *                            |
|  +---------------------------------------------+  |
|  | Select event type...                    [v] |  |
|  +---------------------------------------------+  |
|  | ○ IPO / Public Listing planned              |  |
|  | ○ Acquisition / M&A discussions             |  |
|  | ○ Funding Round expected                    |  |
|  | ○ Stake Sale / Exit planned                 |  |
|  | ○ Significant wealth event                  |  |
|  | ○ Other liquidity signal                    |  |
|  +---------------------------------------------+  |
|                                                   |
|  WHEN IS IT EXPECTED? *                           |
|  +---------------------------------------------+  |
|  | ○ Within 30 days                            |  |
|  | ○ 30-60 days                                |  |
|  | ○ 60-90 days                                |  |
|  | ○ 3-6 months                                |  |
|  | ○ 6+ months                                 |  |
|  +---------------------------------------------+  |
|                                                   |
|  HOW DID YOU LEARN THIS? *                        |
|  +---------------------------------------------+  |
|  | ○ Client told me directly                   |  |
|  | ○ Industry contact / referral               |  |
|  | ○ News / media report                       |  |
|  | ○ Observed behavior / pattern               |  |
|  +---------------------------------------------+  |
|                                                   |
|  NOTES (Optional)                                 |
|  +---------------------------------------------+  |
|  | Add context that might help...              |  |
|  +---------------------------------------------+  |
|                                                   |
|  💡 Your intelligence helps improve signals for   |
|     everyone and earns you discovery credits!     |
|                                                   |
|  +-------------------+  +---------------------+   |
|  |      Cancel       |  |  Save Intelligence  |   |
|  +-------------------+  +---------------------+   |
+---------------------------------------------------+
```

---

## 10. My Client News Feed

```
+---------------------------------------------------+
|  📰 News About My Clients              [Settings] |
+---------------------------------------------------+
|  Monitoring your 127 clients for relevant news    |
|                                                   |
|  [All] [High Priority] [Unread]                   |
+---------------------------------------------------+
|                                                   |
|  🔴 HIGH PRIORITY - Today                         |
|                                                   |
|  +-----------------------------------------------+|
|  | Rajesh Kumar mentioned in Economic Times      ||
|  | "Tech Innovations eyes $500M IPO in Q1 2026"  ||
|  | 2 hours ago                                   ||
|  |                                               ||
|  | 💡 This confirms the IPO signal. Great time   ||
|  | to reach out and discuss wealth planning.     ||
|  |                                               ||
|  | [Read Full] [📞 Call Rajesh] [Dismiss]        ||
|  +-----------------------------------------------+|
|                                                   |
|  🟠 RELEVANT - Today                              |
|                                                   |
|  +-----------------------------------------------+|
|  | Anita Patel quoted in Business Standard       ||
|  | "FinServ Holdings in acquisition talks"       ||
|  | 5 hours ago                                   ||
|  |                                               ||
|  | [Read Full] [📞 Call Anita] [Dismiss]         ||
|  +-----------------------------------------------+|
|                                                   |
|  🟢 INFORMATIONAL - Yesterday                     |
|                                                   |
|  +-----------------------------------------------+|
|  | Deepak Sharma featured in Mint                ||
|  | "Rising entrepreneurs to watch in 2026"       ||
|  | Yesterday                                     ||
|  |                                               ||
|  | [Read Full] [View Profile]                    ||
|  +-----------------------------------------------+|
|                                                   |
|  +-----------------------------------------------+|
|  |              [Load More News]                 ||
|  +-----------------------------------------------+|
|                                                   |
+---------------------------------------------------+
```

---

## 11. My Wallet Share & Opportunities

```
+-------------------------------------------------------------------------+
|  💰 My Wallet Share Analysis                                            |
+-------------------------------------------------------------------------+
|                                                                         |
|  +---------------------------+  +-----------------------------------+   |
|  |  MY TOTAL SHARE           |  |  BIGGEST OPPORTUNITIES            |   |
|  |                           |  |  (In Your Book)                   |   |
|  |  Current: ₹680 Cr         |  |                                   |   |
|  |  +-------------------+    |  |  +-------------------------------+|   |
|  |  |████████           |    |  |  | 1. Rajesh Kumar               ||   |
|  |  +-------------------+    |  |  |    Gap: ₹180 Cr (40%)         ||   |
|  |  Share: 18% of client     |  |  |    Trigger: IPO filing        ||   |
|  |  wealth                   |  |  |    [View] [Create Proposal]   ||   |
|  |                           |  |  +-------------------------------+|   |
|  |  Potential: ₹1,200 Cr     |  |  | 2. Anita Patel                ||   |
|  |  Gap: ₹520 Cr             |  |  |    Gap: ₹128 Cr (55%)         ||   |
|  |                           |  |  |    Trigger: Acquisition        ||   |
|  |  ↑ ₹45 Cr this quarter    |  |  |    [View] [Create Proposal]   ||   |
|  +---------------------------+  |  +-------------------------------+|   |
|                                 |  | 3. Vikram Rao                 ||   |
|                                 |  |    Gap: ₹95 Cr (62%)          ||   |
|                                 |  |    Trigger: Funding round     ||   |
|                                 |  |    [View] [Create Proposal]   ||   |
|                                 |  +-------------------------------+|   |
|                                 +-----------------------------------+   |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |  MY WALLET SHARE BY CLIENT SEGMENT                                |  |
|  |                                                                   |  |
|  |  Segment        | Clients | My Share | Gap        | Action       |  |
|  |  ---------------|---------|----------|------------|--------------|  |
|  |  1000+ Cr       |      3  |   12%    | ₹264 Cr   | Deepen ●●●   |  |
|  |  500-1000 Cr    |      8  |   15%    | ₹340 Cr   | Grow   ●●●   |  |
|  |  250-500 Cr     |     28  |   18%    | ₹294 Cr   | Expand ●●    |  |
|  |  100-250 Cr     |     88  |   22%    | ₹312 Cr   | Maintain ●   |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

## 12. My Product Mix & Cross-Sell

```
+-------------------------------------------------------------------------+
|  📊 Product Opportunities in My Book                                    |
+-------------------------------------------------------------------------+
|                                                                         |
|  +-----------------------------------+ +-----------------------------+  |
|  |  MY CLIENTS BY PRODUCT            | |  CROSS-SELL OPPORTUNITIES  |  |
|  |                                   | |                             |  |
|  |  Wealth Mgmt   ████████████ 127  | |  +-------------------------+|  |
|  |  Broking       ████████      89  | |  | PMS Opportunities       ||  |
|  |  PMS           ████          34  | |  | 45 clients don't have   ||  |
|  |  Alternates    ██            18  | |  | Est. revenue: ₹2.1 Cr   ||  |
|  |  Credit        █              8  | |  | [View List]             ||  |
|  |                                   | |  +-------------------------+|  |
|  +-----------------------------------+ |  +-------------------------+|  |
|                                        |  | Alternates Opps         ||  |
|                                        |  | 62 clients eligible     ||  |
|                                        |  | Est. revenue: ₹3.4 Cr   ||  |
|                                        |  | [View List]             ||  |
|                                        |  +-------------------------+|  |
|                                        |  +-------------------------+|  |
|                                        |  | Credit Line Opps        ||  |
|                                        |  | 23 clients need it      ||  |
|                                        |  | Est. revenue: ₹1.8 Cr   ||  |
|                                        |  | [View List]             ||  |
|                                        |  +-------------------------+|  |
|                                        +-----------------------------+  |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |  🔥 TOP CROSS-SELL MATCHES (AI-Recommended)                       |  |
|  +-------------------------------------------------------------------+  |
|  |                                                                   |  |
|  |  +-------------------------------------------------------------+ |  |
|  |  | Rajesh Kumar                              Score: 92         | |  |
|  |  | Current: Wealth Management only                              | |  |
|  |  | Recommended: PMS + PE Fund (IPO liquidity match)             | |  |
|  |  | Est. Revenue: ₹2.1 Cr | Best timing: Within 30 days          | |  |
|  |  | [Create Proposal] [📞 Call]                                  | |  |
|  |  +-------------------------------------------------------------+ |  |
|  |                                                                   |  |
|  |  +-------------------------------------------------------------+ |  |
|  |  | Anita Patel                               Score: 87         | |  |
|  |  | Current: Wealth + Broking                                    | |  |
|  |  | Recommended: Alternates + LAS (high equity concentration)    | |  |
|  |  | Est. Revenue: ₹1.5 Cr | Best timing: Q1 rebalancing          | |  |
|  |  | [Create Proposal] [📞 Call]                                  | |  |
|  |  +-------------------------------------------------------------+ |  |
|  |                                                                   |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

## 13. AI Trend Insights (For Your Book)

```
+-------------------------------------------------------------------------+
|  🤖 AI Insights for Your Book                         [Refresh] [📅]    |
+-------------------------------------------------------------------------+
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |  💡 INSIGHT: Hot Opportunity Window                               |  |
|  |                                                                   |  |
|  |  "3 of your clients have IPO-related signals right now. This is   |  |
|  |  unusual - typically you see 1 per quarter. The tech sector IPO   |  |
|  |  window is open. Prioritize outreach to Rajesh, Anita, and Deepak |  |
|  |  this week for best results."                                     |  |
|  |                                                                   |  |
|  |  [📞 Call Rajesh] [📞 Call Anita] [📞 Call Deepak]                |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
|  +-----------------------------------+ +-----------------------------+  |
|  |  YOUR SIGNAL TREND                | |  YOUR TOP SECTORS           |  |
|  |                                   | |                             |  |
|  |  Signals in your book             | |  Tech      ████████ 45%    |  |
|  |    15 ─            ●              | |  Finance   █████    28%    |  |
|  |    10 ─      ●────●               | |  Healthcare████     15%    |  |
|  |     5 ─  ●──●                     | |  Real Est  ██        8%    |  |
|  |     0 ─ ●                         | |  Others    █         4%    |  |
|  |        ──────────────             | |                             |  |
|  |        W1  W2  W3  W4             | |  💡 Tech is hot - focus     |  |
|  +-----------------------------------+ |  your energy here           |  |
|                                        +-----------------------------+  |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |  🎯 PATTERNS IN YOUR BOOK                                         |  |
|  |                                                                   |  |
|  |  +----------------------------+ +----------------------------+    |  |
|  |  | Pattern: Tech IPO Wave    | | Pattern: Rebalancing Need  |    |  |
|  |  | 3 clients showing signals | | 8 clients over-concentrated|    |  |
|  |  | Window: 30-45 days        | | in single stocks           |    |  |
|  |  | Action: Call this week    | | Action: Review portfolios  |    |  |
|  |  | [View Clients]            | | [View Clients]             |    |  |
|  |  +----------------------------+ +----------------------------+    |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

## 14. My Network & Referral Paths

```
+-------------------------------------------------------------------------+
|  🤝 My Network Map                                   [Filter] [Expand]  |
+-------------------------------------------------------------------------+
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |                                                                   |  |
|  |                           [YOU]                                   |  |
|  |                             ●                                     |  |
|  |                            /|\                                    |  |
|  |                           / | \                                   |  |
|  |                          /  |  \                                  |  |
|  |            [Amit Shah]●─●   |   ●─●[Meera Iyer]                   |  |
|  |               Client   TiE  |   Client   Finance                  |  |
|  |               (85)     Hub  |   (82)     Circle                   |  |
|  |                |            |                |                    |  |
|  |         ●──────●──────●     |         ●──────●──────●             |  |
|  |       Rajesh  Deepak        |       Suresh  Prakash               |  |
|  |       Kumar   Sharma        |       Gupta   Joshi                 |  |
|  |       (92)    (78)          |       (72)    (68)                  |  |
|  |                             |                                     |  |
|  |                       [PROSPECT]                                  |  |
|  |                       Vikram Rao                                  |  |
|  |                           ●                                       |  |
|  |                                                                   |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
|  LEGEND: ● Your Client ● Prospect ─ Strong Connection ─── Weak         |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |  WARM INTRO PATHS (To prospects you want)                         |  |
|  +-------------------------------------------------------------------+  |
|  |                                                                   |  |
|  |  Target: Vikram Rao (Est. wealth: ₹280 Cr)                       |  |
|  |                                                                   |  |
|  |  Path 1: You → Amit Shah → TiE Hub → Vikram                      |  |
|  |          Strength: Strong | Your ask: Intro at TiE event         |  |
|  |          [Request Introduction from Amit]                         |  |
|  |                                                                   |  |
|  |  Path 2: You → Rajesh Kumar → Tech Founders → Vikram             |  |
|  |          Strength: Medium | Your ask: Co-founder connection      |  |
|  |          [Request Introduction from Rajesh]                       |  |
|  |                                                                   |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

## 15. Voice Notes & Client Memos

```
+---------------------------------------------------+
|  🎙️ My Voice Notes                       [History]|
+---------------------------------------------------+
|                                                   |
|  +---------------------------------------------+  |
|  |                                             |  |
|  |           🎙️                                |  |
|  |      Tap to record a note                   |  |
|  |                                             |  |
|  |         +-------------+                     |  |
|  |         |    ◉ REC    |                     |  |
|  |         +-------------+                     |  |
|  |                                             |  |
|  |  Language: [English v] [हिंदी] [मराठी]      |  |
|  +---------------------------------------------+  |
|                                                   |
|  MY RECENT NOTES                                  |
|                                                   |
|  +---------------------------------------------+  |
|  | 📝 Meeting - Rajesh Kumar         [▶ 2:34] |  |
|  | Today, 11:30 AM                             |  |
|  | "Discussed IPO timeline. Very interested    |  |
|  | in PMS for post-IPO wealth. Wife also       |  |
|  | wants to discuss family office setup..."    |  |
|  |                                             |  |
|  | Auto-linked: Rajesh Kumar ✓                 |  |
|  | [Edit] [Share with Team] [Delete]           |  |
|  +---------------------------------------------+  |
|                                                   |
|  +---------------------------------------------+  |
|  | 📝 Call - Anita Patel             [▶ 1:45] |  |
|  | Yesterday, 3:15 PM                          |  |
|  | "Acquisition talks progressing. Legal due   |  |
|  | diligence in 2 weeks. She's concerned about |  |
|  | capital gains tax planning..."              |  |
|  |                                             |  |
|  | Auto-linked: Anita Patel ✓                  |  |
|  | [Edit] [Share with Team] [Delete]           |  |
|  +---------------------------------------------+  |
|                                                   |
+---------------------------------------------------+

Recording State:
+---------------------------------------------------+
|  🔴 RECORDING...                          01:24   |
+---------------------------------------------------+
|                                                   |
|       ▁▂▃▅▆▇█▇▆▅▃▂▁▂▃▅▆▇█▇▆▅▃▂▁                  |
|                                                   |
|  +---------------------------------------------+  |
|  |              ⏹️ Stop                         |  |
|  +---------------------------------------------+  |
|                                                   |
|  LIVE TRANSCRIPTION:                              |
|  "Just finished meeting with Rajesh Kumar. He     |
|  mentioned the IPO is on track for Q1. He's       |
|  interested in our PMS product and wants to..."   |
|                                                   |
|  DETECTED: Rajesh Kumar ✓ | IPO ✓ | PMS ✓        |
+---------------------------------------------------+
```

---

## 16. My Client Retention & Risk View

```
+-------------------------------------------------------------------------+
|  ⚠️ My Client Health Monitor                                            |
+-------------------------------------------------------------------------+
|                                                                         |
|  +-------------------+ +-------------------+ +-------------------+       |
|  |  MY RETENTION     | |  AT-RISK          | |  HAPPY CLIENTS   |       |
|  |                   | |  CLIENTS          | |                   |       |
|  |     98.4%         | |       4           | |      123         |       |
|  |  ↑ vs team avg    | |  Need attention   | |  Green status    |       |
|  +-------------------+ +-------------------+ +-------------------+       |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |  ⚠️ MY AT-RISK CLIENTS (Action Needed)                            |  |
|  +-------------------------------------------------------------------+  |
|  |                                                                   |  |
|  |  +-------------------------------------------------------------+ |  |
|  |  | 🔴 Suresh Gupta                    Risk: ████████░░ 85%     | |  |
|  |  | AUM: ₹180 Cr | Last contact: 90 days ago                    | |  |
|  |  | Issues: No engagement, portfolio down 12%                    | |  |
|  |  | 💡 Call today - he may be talking to competitors            | |  |
|  |  | [📞 Call Now] [📅 Schedule] [View History]                  | |  |
|  |  +-------------------------------------------------------------+ |  |
|  |                                                                   |  |
|  |  +-------------------------------------------------------------+ |  |
|  |  | 🟠 Meera Iyer                      Risk: ███████░░░ 72%     | |  |
|  |  | AUM: ₹145 Cr | Last contact: 45 days ago                    | |  |
|  |  | Issues: Competitor approach reported, slow response          | |  |
|  |  | 💡 Schedule face-to-face meeting this week                  | |  |
|  |  | [📞 Call Now] [📅 Schedule] [View History]                  | |  |
|  |  +-------------------------------------------------------------+ |  |
|  |                                                                   |  |
|  |  +-------------------------------------------------------------+ |  |
|  |  | 🟡 Prakash Joshi                   Risk: ██████░░░░ 68%     | |  |
|  |  | AUM: ₹210 Cr | Last contact: 30 days ago                    | |  |
|  |  | Issues: Service complaint pending, market concerns           | |  |
|  |  | 💡 Resolve complaint first, then discuss portfolio          | |  |
|  |  | [📞 Call Now] [📅 Schedule] [View History]                  | |  |
|  |  +-------------------------------------------------------------+ |  |
|  |                                                                   |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

## 17. My Portfolio Risk Alerts

```
+-------------------------------------------------------------------------+
|  🚨 Portfolio Alerts in My Book                      [Settings] [📅]    |
+-------------------------------------------------------------------------+
|                                                                         |
|  +-------------------+ +-------------------+ +-------------------+       |
|  |  ACTIVE ALERTS    | |  CRITICAL         | |  RESOLVED        |       |
|  |                   | |                   | |  THIS MONTH      |       |
|  |      12           | |       3           | |      8           |       |
|  |   In my book      | |  Act today        | |  Good job! 👍    |       |
|  +-------------------+ +-------------------+ +-------------------+       |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |  🔴 CRITICAL - Act Today                                          |  |
|  +-------------------------------------------------------------------+  |
|  |                                                                   |  |
|  |  +-------------------------------------------------------------+ |  |
|  |  | Sector Concentration - Rajesh Kumar                          | |  |
|  |  | Technology: 78% of portfolio (Limit: 50%)                    | |  |
|  |  | Risk: ₹350 Cr exposed to tech downturn                       | |  |
|  |  |                                                              | |  |
|  |  | 💡 Good timing: With IPO coming, discuss diversification    | |  |
|  |  |    of proceeds into other sectors                            | |  |
|  |  |                                                              | |  |
|  |  | [📞 Call to Discuss] [Create Rebalancing Plan]              | |  |
|  |  +-------------------------------------------------------------+ |  |
|  |                                                                   |  |
|  |  +-------------------------------------------------------------+ |  |
|  |  | Single Stock Exposure - Anita Patel                          | |  |
|  |  | HDFC Bank: 35% of portfolio (Limit: 25%)                     | |  |
|  |  | Risk: Regulatory concern + concentration risk                | |  |
|  |  |                                                              | |  |
|  |  | 💡 With acquisition proceeds, perfect time to diversify     | |  |
|  |  |                                                              | |  |
|  |  | [📞 Call to Discuss] [Create Trade Proposal]                | |  |
|  |  +-------------------------------------------------------------+ |  |
|  |                                                                   |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

## 18. My Credit & Capital Opportunities

```
+-------------------------------------------------------------------------+
|  💳 Credit Opportunities in My Book                                     |
+-------------------------------------------------------------------------+
|                                                                         |
|  +-------------------+ +-------------------+ +-------------------+       |
|  |  MY CLIENTS WITH  | |  AVG UTILIZATION  | |  NEW OPPS        |       |
|  |  CREDIT LINES     | |                   | |  IDENTIFIED      |       |
|  |      18           | |     68%           | |       5          |       |
|  |   ₹245 Cr total   | |  ↑ 5% this month  | |  ₹85 Cr potential|       |
|  +-------------------+ +-------------------+ +-------------------+       |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |  💡 CREDIT OPPORTUNITIES (Based on Signals)                       |  |
|  +-------------------------------------------------------------------+  |
|  |                                                                   |  |
|  |  +-------------------------------------------------------------+ |  |
|  |  | 🔴 Rajesh Kumar - IPO Bridge Financing                       | |  |
|  |  | Current: ₹25 Cr | Utilization: 92%                          | |  |
|  |  | Signal: IPO filing - will need funds for promoter lock-in   | |  |
|  |  | Opportunity: Increase to ₹50 Cr bridge facility              | |  |
|  |  | Your revenue: ~₹25 L/year                                    | |  |
|  |  | [📞 Call to Propose] [Create Facility Proposal]              | |  |
|  |  +-------------------------------------------------------------+ |  |
|  |                                                                   |  |
|  |  +-------------------------------------------------------------+ |  |
|  |  | 🟠 Vikram Rao - Margin Enhancement                           | |  |
|  |  | Current: ₹15 Cr | Utilization: 78%                          | |  |
|  |  | Signal: Margin call last week, needs liquidity               | |  |
|  |  | Opportunity: LAS facility + portfolio restructure            | |  |
|  |  | Your revenue: ~₹18 L/year                                    | |  |
|  |  | [📞 Call to Propose] [Create Facility Proposal]              | |  |
|  |  +-------------------------------------------------------------+ |  |
|  |                                                                   |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

## 19. My Performance Dashboard

```
+-------------------------------------------------------------------------+
|  📈 My Performance                                   [This Month v]     |
+-------------------------------------------------------------------------+
|                                                                         |
|  +-------------------+ +-------------------+ +-------------------+       |
|  |  MY AUM           | |  MY REVENUE       | |  MY GROWTH        |       |
|  |                   | |  (MTD)            | |  (YTD)            |       |
|  |    ₹680 Cr        | |    ₹4.2 Cr        | |     +18%          |       |
|  |   Rank: #4 of 35  | |  ↑ 12% vs target  | |  vs 12% team avg  |       |
|  +-------------------+ +-------------------+ +-------------------+       |
|                                                                         |
|  +-----------------------------------+ +-----------------------------+  |
|  |  MY ACTIVITY THIS MONTH           | |  MY TARGETS                 |  |
|  |                                   | |                             |  |
|  |  Calls Made      ████████  45    | |  AUM Growth    ███████ 78%  |  |
|  |  Target: 50                      | |  Target: ₹720 Cr            |  |
|  |                                   | |                             |  |
|  |  Meetings        ██████    18    | |  New Clients   █████   62%  |  |
|  |  Target: 25                      | |  Target: 8 | Actual: 5      |  |
|  |                                   | |                             |  |
|  |  Follow-ups      ████████  42    | |  Revenue       ████████ 84% |  |
|  |  Target: 40  ✓                   | |  Target: ₹5 Cr              |  |
|  |                                   | |                             |  |
|  |  Conversions     ████       5    | |  Retention     █████████92% |  |
|  |  Target: 6                       | |  Target: 98%                |  |
|  +-----------------------------------+ +-----------------------------+  |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |  📅 MY UPCOMING TASKS                                             |  |
|  +-------------------------------------------------------------------+  |
|  |                                                                   |  |
|  |  TODAY                                                            |  |
|  |  • 10:00 AM - Call Rajesh Kumar re: IPO planning                 |  |
|  |  • 2:00 PM - Meeting with Anita Patel (scheduled)                |  |
|  |  • Follow up with Suresh Gupta (90 days overdue!)                |  |
|  |                                                                   |  |
|  |  THIS WEEK                                                        |  |
|  |  • Review Deepak Sharma portfolio concentration                   |  |
|  |  • Prepare proposal for Vikram Rao credit facility               |  |
|  |  • 3 new client meetings scheduled                                |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

## 20. Simplified Sidebar (RM-Focused)

```
+-------------+
|             |
|  +-------+  |
|  | UHNW  |  |
|  | [You] |  |
|  +-------+  |
|             |
|  MY DAY     |
|  +-------+  |
|  |🏠 Home|  | <-- Dashboard
|  +-------+  |
|  +-------+  |
|  |📊 Perf|  | <-- My Performance
|  +-------+  |
|             |
|  CLIENTS    |
|  +-------+  |
|  |👥 All |  | <-- My Clients List
|  +-------+  |
|  +-------+  |
|  |🔔 Sig-|  | <-- Active Signals
|  |  nals |  |
|  +-------+  |
|  +-------+  |
|  |📰 News|  | <-- Client News
|  +-------+  |
|             |
|  GROW       |
|  +-------+  |
|  |💰Wallet|  | <-- Wallet Share
|  +-------+  |
|  +-------+  |
|  |🎯 Cross|  | <-- Cross-Sell Opps
|  |  Sell  |  |
|  +-------+  |
|  +-------+  |
|  |💳Credit|  | <-- Credit Opps
|  +-------+  |
|             |
|  INSIGHTS   |
|  +-------+  |
|  |🤝 Net- |  | <-- My Network
|  |  work  |  |
|  +-------+  |
|  +-------+  |
|  |🤖 AI  |  | <-- AI Insights
|  +-------+  |
|             |
|  MONITOR    |
|  +-------+  |
|  |⚠️ Risk |  | <-- Portfolio Risk
|  +-------+  |
|  +-------+  |
|  |❤️ Health|  | <-- Client Health
|  +-------+  |
|             |
|  CAPTURE    |
|  +-------+  |
|  |+ Add  |  | <-- Add Intelligence
|  +-------+  |
|  +-------+  |
|  |🎙️ Voice|  | <-- Voice Notes
|  +-------+  |
|             |
+-------------+
```

---

## Summary

### Primary Persona: Relationship Manager (RM)

All wireframes are designed from the RM's perspective:
- **"My Clients"** instead of "All Clients"
- **"My Signals"** instead of firm-wide signals  
- **Personal performance** dashboards
- **Actionable insights** specific to their book
- **AI assistant** that knows their portfolio

### Key Design Principles:

1. **Personal Context** - Everything is "My" - my clients, my signals, my opportunities
2. **Actionable** - Every screen has clear next actions (Call, Email, Propose)
3. **Timely** - Urgency indicators drive behavior (Act within 48hrs)
4. **Contextual AI** - Assistant knows the RM's book and provides relevant suggestions
5. **Mobile-First** - RMs are often on the go, mobile experience is critical

### Color Usage:
- Navy (#0A1628) - Headers, trust
- Gold (#C9A227) - High scores, CTAs, wins
- Red (#DC3545) - Critical actions, urgency
- Green (#28A745) - Success, healthy status
- White (#FFFFFF) - Clean backgrounds

### Typography:
- Playfair Display - Headings (elegant, premium)
- Inter - Body text (clean, readable)

---

## Wireframe Coverage by User Story

| Story | Wireframe Section |
|-------|-------------------|
| 1. Early Liquidity Signals | 1. RM Dashboard, 5. Signal Badges |
| 2. Lead Scores | 6. Lead Score Indicator, 2. Prospect Card |
| 3. Filter Prospects | 1. Dashboard (Sidebar Filters) |
| 4. Top Prospects | 1. Dashboard, 2. Prospect Card |
| 5. Prospect Detail | 3. Prospect Detail Page |
| 6. AI Chatbot | 4. AI Chatbot (RM Assistant) |
| 7. Track Leads | 1. Dashboard, 19. My Performance |
| 8. Relationship Graph | 3. Prospect Detail, 14. My Network |
| 9. Engagement Suggestions | 3. Suggested Actions |
| 10. Aggregate Data | All signal displays show sources |
| 11. Add Liquidity Events | 9. Add Intelligence Modal |
| 12. Client News Alerts | 10. My Client News Feed |
| 14. Wallet Share Analysis | 11. My Wallet Share |
| 17. Credit/Capital | 18. My Credit Opportunities |
| 19. AI Trend Insights | 13. AI Insights for Your Book |
| 20. Influencer Mapping | 14. My Network Map |
| 21. Voice Notes | 15. Voice Notes & Memos |
| 22. Retention Metrics | 16. My Client Health Monitor |
| 24. Risk Alerts | 17. My Portfolio Risk Alerts |
| 25. Cross-Sell | 12. My Product Mix & Cross-Sell |

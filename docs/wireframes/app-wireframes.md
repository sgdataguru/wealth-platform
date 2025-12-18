# UHNW Liquidity Intelligence Platform - Wireframes

## Design System Reference

Based on the **Nuvama Wealth** inspired premium aesthetic:

| Token | Value | Usage |
|-------|-------|-------|
| Primary Navy | #0A1628 | Headers, sidebars |
| Royal Blue | #1E3A5F | Interactive elements |
| Gold Accent | #C9A227 | CTAs, highlights |
| Background | #FFFFFF | Main content |
| Secondary BG | #F8F9FA | Cards, sections |
| Text Primary | #1A1A2E | Headings, body |
| Text Muted | #5A6C7D | Secondary text |

---

## 1. Dashboard Layout

```
+-------------------------------------------------------------------------+
|  HEADER BAR                                                             |
|  +--------+                               +---+ +---+ +--------+        |
|  | UHNW   |   [Search prospects...]       |Bell| |Cog| |Avatar v|       |
|  +--------+                               +---+ +---+ +--------+        |
+-------------------------------------------------------------------------+
|         |                                                               |
| SIDEBAR |  Good morning, John                              Dec 17, 2025 |
|         |  Here is your daily intelligence summary                      |
| +-----+ |                                                               |
| |Home | |  +------------+ +------------+ +------------+ +------------+  |
| +-----+ |  | TOTAL      | | NEW        | | SIGNALS    | | FOLLOW     |  |
| +-----+ |  | LEADS      | | TODAY      | | DETECTED   | | UPS        |  |
| |Pros-| |  |            | |            | |            | |            |  |
| |pects| |  |   1,247    | |    23      | |    156     | |    18      |  |
| +-----+ |  |  +12%      | |  +5        | |  +8%       | |  Due today |  |
| +-----+ |  +------------+ +------------+ +------------+ +------------+  |
| |Sig- | |                                                               |
| |nals | |  +---------------------------+ +---------------------------+  |
| +-----+ |  |     TOP PROSPECTS         | |    RECENT SIGNALS         |  |
| +-----+ |  |     (By Lead Score)       | |                           |  |
| |Graph| |  | +-------------------------+| | +-----------------------+ |  |
| +-----+ |  | | RK  Rajesh Kumar   92  || | | HIGH: IPO Filing      | |  |
| +-----+ |  | |     Tech Innovations   || | | Tech Innovations      | |  |
| |Ana- | |  | |     Mumbai | Tech      || | | 2 hours ago           | |  |
| |lytics|  | +-------------------------+| | +-----------------------+ |  |
| +-----+ |  | +-------------------------+| | +-----------------------+ |  |
|         |  | | AP  Anita Patel    87  || | | MEDIUM: Funding       | |  |
| FILTERS |  | |     FinServ Holdings   || | | GreenEnergy Ltd       | |  |
|         |  | |     Delhi | Finance    || | | 5 hours ago           | |  |
| +-----+ |  | +-------------------------+| | +-----------------------+ |  |
| |City | |  |                           | |                           |  |
| | All | |  |    [View All Prospects]   | |    [View All Signals]    |  |
| +-----+ |  +---------------------------+ +---------------------------+  |
| +-----+ |                                                               |
| |Sector|  +-----------------------------------------------------------+ |
| | All | |  |              ACTIVITY FEED                               | |
| +-----+ |  | - You marked Rajesh Kumar as "Contacted" - 2h ago        | |
|         |  | - New signal for Anita Patel portfolio - 3h ago          | |
| [Apply] |  | - Follow-up reminder: Vikram Rao - Due tomorrow          | |
|         |  +-----------------------------------------------------------+ |
+---------+---------------------------------------------------------------+
|                                                    +-------------------+ |
|                                                    |  AI Chat Button   | |
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
|                                                                       |
|  ACTIVE SIGNALS:                                                      |
|  +-------------+  +-------------+  +-------------+                    |
|  | RED: IPO    |  | YLW: Fund   |  | GRN: Board  |                    |
|  | Filing      |  | Round       |  | Change      |                    |
|  | 2 days ago  |  | 1 week ago  |  | 2 weeks ago |                    |
|  +-------------+  +-------------+  +-------------+                    |
|                                                                       |
|  Last contacted: 3 days ago         [Call]  [Email]                   |
+-----------------------------------------------------------------------+
```

---

## 3. Prospect Detail Page

```
+-------------------------------------------------------------------------+
| [Back to Prospects]                                                     |
+-------------------------------------------------------------------------+
|                                                                         |
|  +--------+   Rajesh Kumar                                              |
|  |        |   Director, Tech Innovations Pvt Ltd                        |
|  |   RK   |   Mumbai | Technology | TiE Network                         |
|  |        |   rajesh@techinnovations.com | +91 98765 43210              |
|  +--------+                                                             |
|             [Call]  [Email]  [Add Note]                                 |
|                                                                         |
+-------------------------------------------------------------------------+
|                                                                         |
|  +-----------------------+  +---------------------------------------+   |
|  |    LEAD SCORE         |  |     SCORE EXPLANATION                 |   |
|  |                       |  |                                       |   |
|  |    +-------------+    |  |  Why this score?                      |   |
|  |    |     92      |    |  |                                       |   |
|  |    | EXCELLENT   |    |  |  [====] IPO Filing           +40      |   |
|  |    +-------------+    |  |         Company filed DRHP            |   |
|  |                       |  |                                       |   |
|  |  ==================   |  |  [=== ] Series C Funding     +30      |   |
|  |                       |  |         Raised $50M from Sequoia      |   |
|  |  Top 5% of prospects  |  |                                       |   |
|  +-----------------------+  |  [==  ] Network Strength     +15      |   |
|                             |         12 UHNW connections           |   |
|                             |                                       |   |
|                             |  [=   ] Sector Growth        +7       |   |
|                             |         24% YoY growth                |   |
|                             +---------------------------------------+   |
|                                                                         |
+-------------------------------------------------------------------------+
|  SIGNAL TIMELINE                                                        |
+-------------------------------------------------------------------------+
|                                                                         |
|  Dec 15  o------------------------------------------------------        |
|          |                                                              |
|          |  [RED] IPO Filing Detected                                   |
|          |  Tech Innovations filed DRHP with SEBI                       |
|          |  Source: Exchange Data                                       |
|          |  [View Details] [Mark Actioned]                              |
|                                                                         |
|  Dec 10  o------------------------------------------------------        |
|          |                                                              |
|          |  [YELLOW] Funding Round Announced                            |
|          |  Series C at $50M valuation                                  |
|          |  Source: PrivateCircle                                       |
|          |  [Actioned]                                                  |
|                                                                         |
|  Nov 28  o------------------------------------------------------        |
|          |                                                              |
|          |  [GREEN] Board Member Addition                               |
|          |  New independent director appointed                          |
|          |  Source: Zauba Corp                                          |
|                                                                         |
+-------------------------------------------------------------------------+
|  RELATIONSHIP GRAPH (Mini)                              [Expand]        |
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
|                                                                         |
+-------------------------------------------------------------------------+
|  SUGGESTED ACTIONS                                                      |
+-------------------------------------------------------------------------+
|                                                                         |
|  * Schedule introductory call within 48 hours                           |
|    IPO filings typically close quickly                                  |
|                                                                         |
|  * Prepare portfolio presentation for tech sector                       |
|    Highlight similar successful exits                                   |
|                                                                         |
|  * Leverage TiE Network connection through Amit Shah                    |
|    Warm introduction opportunity                                        |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

## 4. AI Chatbot (Floating)

```
Collapsed:
                                    +-------+
                                    |  AI   |
                                    | Chat  |
                                    +-------+

Expanded:
+-------------------------------------------+
|  AI Intelligence Assistant       [-] [X]  |
+-------------------------------------------+
|                                           |
|  +-------------------------------------+  |
|  | [Bot] Hello! I can help you find    |  |
|  | prospects, analyze signals, and      |  |
|  | answer questions about your UHNW    |  |
|  | client base. What would you like    |  |
|  | to know?                            |  |
|  +-------------------------------------+  |
|                                           |
|       +-------------------------------+   |
|       | [User] Which prospects in     |   |
|       | Mumbai might have liquidity   |   |
|       | events in the next 30 days?   |   |
|       +-------------------------------+   |
|                                           |
|  +-------------------------------------+  |
|  | [Bot] Based on current signals,     |  |
|  | I found 5 prospects in Mumbai:      |  |
|  |                                     |  |
|  | 1. Rajesh Kumar (Score: 92)         |  |
|  |    IPO filing detected              |  |
|  |    [View Profile]                   |  |
|  |                                     |  |
|  | 2. Deepak Sharma (Score: 78)        |  |
|  |    Acquisition talks in progress    |  |
|  |    [View Profile]                   |  |
|  |                                     |  |
|  | Sources: PrivateCircle, Exchange    |  |
|  +-------------------------------------+  |
|                                           |
+-------------------------------------------+
| QUICK QUESTIONS                           |
| +-------------+ +------------+ +--------+ |
| |Top signals  | |Follow-ups  | |IPO     | |
| |today        | |pending     | |pipeline| |
| +-------------+ +------------+ +--------+ |
+-------------------------------------------+
| [Attach]  Type your question...   [Send]  |
+-------------------------------------------+
```

---

## 5. Signal Badges (Color Coding)

```
CRITICAL (Red)
+---------------------+
| [*] IPO Filing      |  Background: #F8D7DA
|                     |  Border: #DC3545
+---------------------+  Text: #721C24

HIGH (Orange)  
+---------------------+
| [*] Acquisition     |  Background: #FFE5CC
|                     |  Border: #FF8C00
+---------------------+  Text: #8B4513

MEDIUM (Yellow)
+---------------------+
| [*] Funding Round   |  Background: #FFF3CD
|                     |  Border: #FFC107
+---------------------+  Text: #856404

LOW (Green)
+---------------------+
| [*] Board Change    |  Background: #D4EDDA
|                     |  Border: #28A745
+---------------------+  Text: #155724
```

---

## 6. Lead Score Indicator

```
EXCELLENT (90-100)
+------------------+
|       92         |   Circle: Gold gradient
|  =============== |   Bar: #C9A227 to #D4AF37
|    Excellent     |
+------------------+

GOOD (70-89)
+------------------+
|       78         |   Circle: Royal Blue
|  ===========     |   Bar: #1E3A5F
|      Good        |
+------------------+

FAIR (50-69)
+------------------+
|       58         |   Circle: Slate
|  ========        |   Bar: #5A6C7D
|      Fair        |
+------------------+

LOW (0-49)
+------------------+
|       35         |   Circle: Gray
|  =====           |   Bar: #8E99A4
|       Low        |
+------------------+
```

---

## 7. Mobile Dashboard

```
+-------------------------+
| [=]  UHNW    [Bell] [U] |
+-------------------------+
|                         |
| Good morning, John      |
| Dec 17, 2025            |
|                         |
| +---------+ +---------+ |
| | 1,247   | |   23    | |
| | Leads   | | Today   | |
| +---------+ +---------+ |
| +---------+ +---------+ |
| |  156    | |   18    | |
| | Signals | | Follow  | |
| +---------+ +---------+ |
|                         |
| TOP PROSPECTS           |
| +---------------------+ |
| | RK Rajesh Kumar  92 | |
| |    Tech Innovations | |
| |    [IPO] [Fund]     | |
| +---------------------+ |
| +---------------------+ |
| | AP Anita Patel   87 | |
| |    FinServ Holdings | |
| |    [Acquisition]    | |
| +---------------------+ |
|                         |
| [View All Prospects]    |
|                         |
| RECENT SIGNALS          |
| +---------------------+ |
| | [!] IPO Filing      | |
| | Tech Innovations    | |
| | 2 hours ago         | |
| +---------------------+ |
|                         |
+-------------------------+
| [Home] [Pros] [Sig] [+] |
+-------------------------+
         +-----+
         | AI  |  <-- Floating
         +-----+
```

---

## 8. Button Styles

```
PRIMARY (Gold Gradient)
+---------------------------+
|      Send Email           |  Background: #C9A227 -> #D4AF37
|                           |  Color: #1A1A2E
+---------------------------+  Hover: Gold glow effect

SECONDARY (Navy Outline)
+---------------------------+
|        Call               |  Background: transparent
|                           |  Border: 2px solid #1E3A5F
+---------------------------+  Color: #1E3A5F

GHOST (Minimal)
+---------------------------+
|    View Details ->        |  Background: transparent
|                           |  Color: #1E3A5F
+---------------------------+  Hover: Underline
```

---

## Summary

Key Design Principles:

1. **Trust & Credibility** - Deep navy headers, clean layouts
2. **Exclusivity** - Gold accents used sparingly for CTAs
3. **Clarity** - Clear information hierarchy
4. **Premium Feel** - Generous whitespace, subtle shadows

Color Usage:
- Navy (#0A1628) - Header, sidebar
- Gold (#C9A227) - Primary buttons, high scores, accents
- White (#FFFFFF) - Main backgrounds
- Semantic colors for signals (Red, Orange, Yellow, Green)

Typography:
- Playfair Display - Headings (elegant, serif)
- Inter - Body text (clean, readable)

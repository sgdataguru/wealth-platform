# Technical Evaluation – Q&A (Code-Based)

**Generated:** 2025-12-27  
**Reviewer:** Senior Full-Stack Architect  
**Repository:** sgdataguru/uhnw

---

## 0) Repo Snapshot

**Repo Name:** `uhnw` (UHNW Liquidity Intelligence Platform)

**Tech Stack Detected:**

- **Frontend:** Next.js 16.0.10 (App Router), React 19.2.1, TypeScript 5
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand 5.0.9
- **Validation:** Zod 4.2.1, React Hook Form 7.68.0
- **Testing:** Playwright 1.57.0
- **Linting:** ESLint 9 (Next.js config)

**Primary Runtime:** Node.js (version not specified in package.json)  
**Package Manager:** npm (evidenced by `package-lock.json`)

**Key Folders:**

```
/Users/maheshkumarpaik/uhnw/
├── app/                    # Next.js App Router (pages, API routes, components)
├── lib/                    # Business logic (auth, scoring, mock-data, validators)
├── types/                  # TypeScript type definitions
├── store/                  # Zustand state stores
├── infra/                  # Terraform infrastructure code (AWS)
├── docs/                   # Documentation (architecture, stories, wireframes)
├── tests/                  # Playwright E2E tests
├── DevOps/                 # CI/CD pipeline configs
└── public/                 # Static assets
```

**Notable Absence:** No database ORM (Prisma, Drizzle, TypeORM) or schema files found.

---

## 1) Architecture & Code Organization

### Q: How is the code structured?

**A:** The codebase follows Next.js 14+ App Router conventions with clear separation of concerns:

- **`app/`**: Contains all routes, layouts, and API endpoints
  - `app/(dashboard)/rm/` - RM dashboard pages
  - `app/(dashboard)/executive/` - Executive dashboard pages
  - `app/api/` - 23 API route handlers (signals, prospects, metrics, etc.)
  - `app/components/` - Shared UI components (layout, features, ui primitives)
  - `app/hooks/` - Custom React hooks

- **`lib/`**: Business logic and utilities
  - `lib/auth/` - Authentication logic (session management, mock users)
  - `lib/scoring/` - Lead scoring algorithm (`calculate-score.ts`, `score-utils.ts`)
  - `lib/mock-data/` - Mock data generators for all entities
  - `lib/validators/` - Zod schemas for form validation

- **`types/`**: Centralized TypeScript definitions (`index.ts` - 910 lines)

- **`store/`**: Zustand stores for client-side state (panel state, etc.)

### Q: Where is domain logic vs UI logic?

**A:**

- **Domain Logic:** `lib/scoring/calculate-score.ts` (lead scoring algorithm), `lib/auth/mock-auth.ts` (authentication rules)
- **UI Logic:** `app/components/` (React components), `app/hooks/` (UI state hooks like `useRMMetrics`, `useLoginNotification`)
- **API Layer:** `app/api/` (route handlers that bridge UI and domain logic)

**Issue:** Domain logic is minimal - most "business logic" is hardcoded in mock data files rather than implemented as reusable services.

### Q: How are shared UI components organized?

**A:** Components are organized in `app/components/` with three sub-folders:

- `app/components/ui/` - Primitive components (Button, Card, Input, etc.)
- `app/components/layout/` - Layout components (Header, Sidebar)
- `app/components/features/` - Feature-specific components (ProspectDetailPanel, FloatingChatbot)

**File References:**

- `app/components/ui/Button.tsx`
- `app/components/layout/Sidebar.tsx`
- `app/components/features/ProspectDetailPanel/index.tsx`

---

## 2) Frontend (Next.js App Router)

### Q: What are the key dashboard routes and pages?

**A:** The application has two primary dashboards:

**RM Dashboard:**

- `/rm` - Main RM cockpit (`app/(dashboard)/rm/page.tsx`)
- `/rm/analytics` - RM analytics page (`app/(dashboard)/rm/analytics/page.tsx`)
- `/rm/ai-insights` - AI insights page (`app/(dashboard)/rm/ai-insights/page.tsx`)
- `/rm/morning-cockpit` - Morning briefing (`app/(dashboard)/rm/morning-cockpit/page.tsx`)

**Executive Dashboard:**

- `/executive` - Main executive dashboard (`app/(dashboard)/executive/page.tsx`)
- `/executive/analytics` - Executive analytics (`app/(dashboard)/executive/analytics/page.tsx`)
- `/executive/ai-insights` - AI insights (`app/(dashboard)/executive/ai-insights/page.tsx`)

**Shared Routes:**

- `/login` - Login page (`app/login/page.tsx`)
- `/prospects` - Prospects list (`app/prospects/page.tsx`)
- `/signals` - Signals feed (referenced in Sidebar, page not found in repo)
- `/network` - Network graph (referenced in Sidebar, page not found in repo)

**Missing Pages:** `/signals` and `/network` are referenced in `app/components/layout/Sidebar.tsx` (lines 30-31) but do not exist in the codebase.

### Q: How is state managed (hooks/context/query libs)?

**A:**

- **Global State:** Zustand (`store/panel-store.ts` for prospect detail panel visibility)
- **Server State:** No React Query/SWR - direct `fetch()` calls in components
- **Local State:** React `useState` hooks
- **Custom Hooks:**
  - `app/hooks/useRMMetrics.ts` - Fetches RM metrics
  - `app/hooks/useLoginNotification.ts` - Login notification timer
  - `app/hooks/useRoleGuard.ts` - Role-based access control

**Issue:** No centralized data fetching library. Each component makes its own API calls, leading to potential duplication and no caching strategy.

### Q: How are loading/error states handled?

**A:**

- **Loading States:** Implemented via local `isLoading` state in components (e.g., `app/(dashboard)/rm/page.tsx` line 59)
- **Error Boundaries:** Not found in repo
- **Error Handling:** Try-catch blocks in API routes return JSON error responses (e.g., `app/api/signals/route.ts` lines 73-85)

**Pattern Found:**

```typescript
const { metrics, isLoading } = useRMMetrics();
if (isLoading) return <div>Loading...</div>;
```

**Missing:** Global error boundary, toast notifications for API errors, retry logic.

### Q: How is styling done (Tailwind, component library)?

**A:**

- **Tailwind CSS 4** configured via `postcss.config.mjs`
- **Custom Design Tokens:** Defined in CSS variables (colors like `--text-primary`, `--surface-card`)
- **Component Library:** Custom-built components in `app/components/ui/` (no external library like shadcn/ui or MUI)
- **Fonts:** Playfair Display (serif) for headings, system fonts for body text

**File References:**

- `postcss.config.mjs`
- `app/components/ui/Button.tsx` (custom button with variant system)
- `app/components/ui/Card.tsx` (custom card component)

---

## 3) Backend / API Layer

### Q: What API routes exist and what do they do?

**A:** 23 API routes found in `app/api/`:

| Route | Method | Purpose | File |
|-------|--------|---------|------|
| `/api/health` | GET | Health check | `app/api/health/route.ts` |
| `/api/signals` | GET | List liquidity signals (filtered, paginated) | `app/api/signals/route.ts` |
| `/api/signals/recent` | GET | Recent signals | `app/api/signals/recent/route.ts` |
| `/api/signals/[id]/action` | POST | Mark signal as actioned | `app/api/signals/[id]/action/route.ts` |
| `/api/signals/[id]/read` | POST | Mark signal as read | `app/api/signals/[id]/read/route.ts` |
| `/api/prospects` | GET | List prospects (filtered, paginated) | `app/api/prospects/route.ts` |
| `/api/prospects/[id]/actions` | GET | Get suggested actions for prospect | `app/api/prospects/[id]/actions/route.ts` |
| `/api/suggestions` | GET | Get engagement suggestions | `app/api/suggestions/route.ts` |
| `/api/suggestions/[id]/actions` | POST | Action on suggestion | `app/api/suggestions/[id]/actions/route.ts` |
| `/api/leads` | GET | Get leads | `app/api/leads/route.ts` |
| `/api/followups` | GET | Get follow-ups | `app/api/followups/route.ts` |
| `/api/activities` | GET | Get activity feed | `app/api/activities/route.ts` |
| `/api/metrics` | GET | Get dashboard metrics | `app/api/metrics/route.ts` |
| `/api/metrics/trends` | GET | Get trend data | `app/api/metrics/trends/route.ts` |
| `/api/graph` | GET | Get network graph | `app/api/graph/route.ts` |
| `/api/graph/intro-paths` | GET | Get introduction paths | `app/api/graph/intro-paths/route.ts` |
| `/api/intelligence` | POST | Submit manual intelligence | `app/api/intelligence/route.ts` |
| `/api/filters/options` | GET | Get filter options | `app/api/filters/options/route.ts` |
| `/api/data-sources/status` | GET | Data source health | `app/api/data-sources/status/route.ts` |
| `/api/data-sources/metrics` | GET | Ingestion metrics | `app/api/data-sources/metrics/route.ts` |
| `/api/data-sources/conflicts` | GET/POST | Data conflicts | `app/api/data-sources/conflicts/route.ts` |
| `/api/data-sources/audit-logs` | GET | Audit logs | `app/api/data-sources/audit-logs/route.ts` |

**All routes return mock data** - no database queries.

### Q: Is there an internal service layer? Where?

**A:** **Not found in repo.** API routes directly return mock data from `lib/mock-data/` or inline mock arrays. There is no service layer abstraction.

**Example:** `app/api/prospects/route.ts` lines 10-207 define mock data inline, then filter/paginate it directly in the route handler.

**Recommendation:** Create `lib/services/` directory with:

- `lib/services/signal-service.ts`
- `lib/services/prospect-service.ts`
- `lib/services/scoring-service.ts`

### Q: How are validation and error handling implemented?

**A:**

- **Validation:** Zod schemas exist (`lib/validators/intelligence.ts`) but are not consistently used in API routes
- **Error Handling:** Try-catch blocks with generic error responses (e.g., `app/api/signals/route.ts` lines 73-85)
- **No Middleware:** No centralized error handling middleware

**Example Error Response:**

```typescript
{
  success: false,
  error: {
    code: 'FETCH_FAILED',
    message: 'Failed to fetch signals'
  }
}
```

**Missing:** Input validation middleware, structured error codes, request logging.

---

## 4) Data Layer (DB + ORM + Models)

### Q: What database is used and how is schema defined?

**A:** **No database is currently used.** All data is mocked in-memory.

**Evidence:**

- No Prisma schema file (`prisma/schema.prisma` not found)
- No database connection code
- `docker-compose.yml` includes PostgreSQL, but it's not connected to the Next.js app
- `.env.example` references Supabase, but no Supabase client code exists

**Planned Infrastructure (Not Implemented):**

- `docker-compose.yml` defines PostgreSQL on port 5432
- `infra/main.tf` provisions AWS RDS (not referenced in app code)

### Q: What are the core entities (clients, signals, scoring)?

**A:** Core entities are defined as TypeScript types in `types/index.ts`:

| Entity | Type Definition | Mock Data Location |
|--------|----------------|-------------------|
| Signal | `Signal` (lines 49-65) | `app/api/signals/mock-data.ts` |
| Prospect | `Prospect` (lines 110-133) | `app/api/prospects/route.ts` (inline) |
| LeadScore | `LeadScore` (lines 96-107) | Generated by `lib/scoring/calculate-score.ts` |
| EngagementSuggestion | `EngagementSuggestion` (lines 379-411) | `lib/mock-data/` |
| LiquidityTrigger | `LiquidityTrigger` (lines 729-750) | Not found in repo |

**Relationships:**

- Prospect → Signal[] (one-to-many)
- Prospect → LeadScore (one-to-one, calculated)
- Signal → DataSource (enum reference)

**Missing:** No foreign key constraints, no database migrations, no referential integrity.

### Q: Are migrations included? How are they run?

**A:** **Not found in repo.** No migration files or migration runner scripts exist.

**Recommendation:** Implement Prisma with:

```bash
npx prisma init
npx prisma migrate dev --name init
```

---

## 5) Authentication & Authorization

### Q: How is auth implemented?

**A:** **Client-side only, no server-side session.**

**Implementation:** `lib/auth/session.ts`

- Stores auth state in `localStorage` or `sessionStorage`
- Storage key: `'nuvama_auth'`
- No JWT, no server-side validation
- Mock users defined in `lib/auth/mock-users.ts`

**Login Flow:**

1. User submits email/password (`app/login/page.tsx`)
2. Mock auth checks credentials (`lib/auth/mock-auth.ts`)
3. Session stored in browser storage (`lib/auth/session.ts` lines 37-47)
4. Redirect to role-based dashboard

**File References:**

- `lib/auth/session.ts` (localStorage management)
- `lib/auth/mock-auth.ts` (credential validation)
- `lib/auth/mock-users.ts` (user database)

### Q: How is RBAC handled (RM vs Admin vs Executive)?

**A:** Role-based routing via client-side guards:

**Role Guard Hook:** `app/hooks/useRoleGuard.ts`

- Checks `user.role` from localStorage
- Redirects unauthorized users to their default dashboard

**Layout Guards:**

- `app/(dashboard)/rm/layout.tsx` (line 15): Enforces RM role
- `app/(dashboard)/executive/layout.tsx` (line 15): Enforces Executive role

**Route Mapping:** `lib/auth/session.ts` lines 10-14

```typescript
const ROLE_ROUTES: Record<UserRole, string> = {
  rm: '/rm',
  executive: '/executive',
  admin: '/rm',
};
```

**Issue:** All authorization is client-side. API routes have no auth checks.

### Q: What are the security gaps?

**A:** **Critical security issues identified:**

1. **No Server-Side Auth:** API routes are completely open (no middleware checks)
   - Example: `/api/prospects` returns all data without checking user role
   - Any user can call any API endpoint

2. **Client-Side Only:** Auth state stored in localStorage can be manipulated
   - No JWT signature verification
   - No session expiration enforcement

3. **No CSRF Protection:** No CSRF tokens for POST requests

4. **No Rate Limiting:** API routes have no rate limiting

5. **Secrets in Client:** `.env.example` suggests API keys might be exposed via `NEXT_PUBLIC_` prefix

**Recommendation:** Implement NextAuth.js or Supabase Auth with server-side session validation.

---

## 6) Liquidity Signals (Feature Deep Dive)

### Q: Where are signals ingested, stored, and served?

**A:**

- **Ingestion:** Not implemented. Mock data only.
- **Storage:** In-memory mock array (`app/api/signals/mock-data.ts`)
- **Served:** Via `/api/signals` endpoint (`app/api/signals/route.ts`)

**Mock Data Source:** `app/api/signals/mock-data.ts` contains ~20 hardcoded signals.

**Planned Architecture (Not Implemented):**

- `docker-compose.yml` includes Kafka for event streaming
- `docs/architecture/data-flows.md` describes Kafka → Spark → RDS pipeline
- `infra/main.tf` provisions AWS MSK (Kafka)

**Gap:** No actual data ingestion pipeline exists.

### Q: How are signals scored (recency/relevance/confidence)?

**A:** Scoring logic exists in `lib/scoring/calculate-score.ts`:

**Formula:**

```
Score = Σ(SeverityScore × Weight × RecencyFactor × Confidence)
```

**Components:**

- **SeverityScore:** `critical=100, high=75, medium=50, low=25` (line 51-56)
- **Weight:** Signal type weights (e.g., IPO=0.30, M&A=0.25) (lines 18-33)
- **RecencyFactor:** Time decay function in `lib/scoring/score-utils.ts`
- **Confidence:** Data source reliability (0.0-1.0)

**File References:**

- `lib/scoring/calculate-score.ts` (main algorithm)
- `lib/scoring/score-utils.ts` (helper functions)

**Issue:** Scoring is calculated on-demand in memory, not persisted.

### Q: How is near real-time achieved (SSE/Websocket/cron)?

**A:** **Not implemented.** No real-time updates exist.

**Evidence:**

- No WebSocket server code
- No Server-Sent Events (SSE) endpoints
- No polling mechanism in frontend

**Planned (Not Implemented):**

- `docs/architecture/data-flows.md` mentions "Real-Time Alert Flow (Hot Path)"
- `docker-compose.yml` includes Kafka for streaming

**Recommendation:** Implement SSE endpoint at `/api/signals/stream` or use Supabase Realtime.

### Q: What's missing to meet acceptance criteria?

**A:** Based on user stories in `docs/stories/`:

**Missing:**

1. ✗ Real data ingestion from external APIs (PrivateCircle, Zauba, NSE)
2. ✗ Database persistence (signals stored in-memory only)
3. ✗ Real-time updates (no SSE/WebSocket)
4. ✗ Signal deduplication logic
5. ✗ Confidence scoring based on source reliability
6. ✓ Filtering by timeline/priority/source (implemented in API)
7. ✓ UI for viewing signals (implemented)

**Completion:** ~30% (UI only, no backend)

---

## 7) Lead Scoring (Feature Deep Dive)

### Q: How is lead score calculated and persisted?

**A:**

- **Calculation:** `lib/scoring/calculate-score.ts` (lines 38-111)
- **Persistence:** **Not persisted.** Calculated on-demand.

**Algorithm:**

```typescript
export function calculateLeadScore(
  clientId: string,
  signals: Signal[],
  previousScore?: number
): LeadScore {
  const factors = signals.map(signal => {
    const weight = SCORING_WEIGHTS[signal.type];
    const recencyFactor = calculateRecencyFactor(getDaysSince(signal.createdAt));
    const confidence = signal.confidence || 0.8;
    const severityScore = { critical: 100, high: 75, medium: 50, low: 25 }[signal.severity];
    
    return severityScore * weight * recencyFactor * confidence;
  });
  
  const totalScore = factors.reduce((sum, f) => sum + f, 0);
  return normalizeScore(totalScore); // 0-100
}
```

**File Reference:** `lib/scoring/calculate-score.ts`

### Q: Is scoring batch or realtime? What triggers it?

**A:** **Neither.** Scoring is calculated on-demand when prospects are fetched.

**Current Flow:**

1. Frontend calls `/api/prospects`
2. API returns mock prospects with pre-calculated `leadScore` field
3. No recalculation happens

**Issue:** Scores are static in mock data, not dynamically calculated.

**Recommendation:**

- Implement background job to recalculate scores daily
- Use BullMQ (Redis-based queue) or AWS Lambda cron

### Q: How is explainability handled (why score = X)?

**A:** Partially implemented:

**Explainability Features:**

- `LeadScore.explanation` field (string) - AI-generated summary (`lib/scoring/calculate-score.ts` lines 88-92)
- `LeadScore.factors` array - Breakdown of each signal's contribution (`types/index.ts` lines 84-93)
- `Prospect.scoreBreakdown` array - UI-friendly breakdown (`types/index.ts` lines 77-81)

**Example Explanation:**

```
"Score of 92 indicates high-priority prospect with strong liquidity signals. 
Key factors: ipo, funding, acquisition. Recent signals suggest potential liquidity events."
```

**Missing:** No UI component to display factor breakdown (exists in types but not rendered).

---

## 8) Integrations & Third-Party APIs

### Q: What integrations exist (News, Exchange, PrivateCircle, Zauba, etc.)?

**A:** **Not found in repo.** All integrations are mocked.

**Planned Integrations (from `types/index.ts` lines 26-40):**

- PrivateCircle (VC/PE data)
- Zauba Corp (MCA filings)
- Exchange Data (NSE/BSE)
- VCCircle (funding news)
- NewsAPI (business news)
- Securities and Exchange Board of India (SEBI)

**Mock Data:** `lib/mock-data/data-sources-mock.ts` simulates API responses.

**Missing:**

- No API client code
- No webhook handlers
- No data transformation logic

**Recommendation:** Create `lib/integrations/` with:

- `lib/integrations/privatecircle-client.ts`
- `lib/integrations/zauba-client.ts`
- `lib/integrations/nse-client.ts`

### Q: How are secrets managed?

**A:**

- **Environment Variables:** `.env.example` defines required secrets
- **Client-Side Exposure Risk:** Some vars use `NEXT_PUBLIC_` prefix (exposed to browser)
- **No Secret Manager:** No AWS Secrets Manager or Vault integration

**File Reference:** `.env.example`

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...  # Server-side only
OPENAI_API_KEY=...
```

**Issue:** No runtime secret rotation, no encryption at rest.

### Q: How are retries/rate limits handled?

**A:** **Not implemented.**

**Evidence:**

- No retry logic in mock API calls
- No rate limiting middleware
- No exponential backoff

**Recommendation:** Use `axios-retry` or `p-retry` for API calls.

---

## 9) Observability, Reliability, and Performance

### Q: Logging/monitoring approach?

**A:**

- **Logging:** `console.error()` in API routes (e.g., `app/api/signals/route.ts` line 74)
- **Monitoring:** Not implemented
- **APM:** Not found

**Missing:**

- Structured logging (Winston, Pino)
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics, New Relic)

**Recommendation:** Add Sentry for error tracking:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Q: Background jobs/queues?

**A:** **Not found in repo.**

**Planned (Not Implemented):**

- `docker-compose.yml` includes Redis (not used)
- `docs/architecture/data-flows.md` mentions batch jobs

**Recommendation:** Implement BullMQ for:

- Daily score recalculation
- Email notifications
- Data sync jobs

### Q: Performance risks and mitigation?

**A:**

**Risks Identified:**

1. **N+1 Queries (Future):** When DB is added, prospect → signals relationship will cause N+1
   - **Mitigation:** Use Prisma `include` or DataLoader

2. **No Pagination Limits:** API routes accept arbitrary `pageSize` values
   - **Example:** `/api/prospects?pageSize=999999` would return all data
   - **Mitigation:** Cap `pageSize` at 100

3. **No Caching:** Every API call recalculates mock data
   - **Mitigation:** Add Redis caching with 5-minute TTL

4. **Large Bundle Size:** No code splitting beyond Next.js defaults
   - **Current:** Not measured
   - **Mitigation:** Use `next/dynamic` for heavy components

5. **No CDN:** Static assets served from Next.js server
   - **Mitigation:** Deploy to Vercel (automatic CDN) or use CloudFront

**File References:**

- `app/api/prospects/route.ts` (line 215): No max pageSize validation

---

## 10) Deployment & Environments

### Q: How is the app deployed (Docker, Vercel, ECS, etc.)?

**A:** Multiple deployment targets configured:

**1. Render.com (Primary):**

- Config: `render.yaml`
- Build: `npm install && npm run build`
- Start: `npm run start`
- Health Check: `/api/health`

**2. Docker (Local Dev):**

- Config: `docker-compose.yml`
- Services: Kafka, Zookeeper, PostgreSQL
- **Issue:** Next.js app not containerized

**3. AWS (Planned, Not Deployed):**

- Infrastructure: `infra/main.tf` (Terraform)
- Resources: VPC, S3, KMS, MSK, EMR
- **Issue:** No ECS/Fargate config for app deployment

**File References:**

- `render.yaml` (Render.com config)
- `docker-compose.yml` (local services)
- `infra/main.tf` (AWS infrastructure)

### Q: What envs exist (dev/stage/prod)?

**A:** **Not clearly defined.**

**Evidence:**

- `infra/variables.tf` has `environment` variable (default not set)
- No environment-specific configs in repo
- `.env.example` suggests single environment

**Recommendation:** Create:

- `.env.development`
- `.env.staging`
- `.env.production`

### Q: Missing operational runbooks?

**A:** **Yes, critical runbooks missing:**

**Not Found:**

- Deployment runbook (how to deploy to production)
- Rollback procedure
- Database backup/restore
- Incident response playbook
- On-call rotation

**Recommendation:** Create `docs/operations/` with:

- `docs/operations/deployment.md`
- `docs/operations/rollback.md`
- `docs/operations/monitoring.md`

---

## 11) Testing & Quality

### Q: What tests exist (unit/integration/e2e)?

**A:**

**E2E Tests (Playwright):**

- `tests/auth-role.spec.ts` (60 lines) - Tests login, role-based routing, logout
- `tests/notification.spec.ts` (158 lines) - Tests login notification system

**Test Coverage:**

- ✓ Authentication flow
- ✓ Role-based access control
- ✓ Notification timing
- ✗ API endpoints (no tests)
- ✗ Scoring algorithm (no tests)
- ✗ UI components (no tests)

**File References:**

- `playwright.config.ts` (test config)
- `tests/auth-role.spec.ts`
- `tests/notification.spec.ts`

**Missing:**

- Unit tests (Jest/Vitest)
- API integration tests
- Component tests (React Testing Library)

### Q: Linting/formatting?

**A:**

- **Linting:** ESLint 9 with Next.js config (`eslint.config.mjs`)
- **Formatting:** Not found (no Prettier config)
- **Type Checking:** TypeScript 5 (strict mode not verified)

**File Reference:** `eslint.config.mjs`

**Missing:**

- Prettier configuration
- Pre-commit hooks (Husky)
- Type coverage reporting

### Q: Coverage gaps?

**A:**

**Critical Gaps:**

1. **No Unit Tests:** Scoring algorithm untested
2. **No API Tests:** All 23 endpoints untested
3. **No Component Tests:** UI components untested
4. **No Performance Tests:** Load testing not done

**Recommendation:**

```bash
# Add testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D msw # Mock Service Worker for API mocking

# Add test scripts to package.json
"test": "vitest",
"test:coverage": "vitest --coverage"
```

---

## 12) Risk Register (Code-Based)

| Risk | Evidence (file/path) | Impact | Fix Recommendation | Priority |
|------|---------------------|--------|-------------------|----------|
| **No Server-Side Auth** | `lib/auth/session.ts` (localStorage only) | CRITICAL | Implement NextAuth.js or Supabase Auth | P0 |
| **Open API Endpoints** | All routes in `app/api/` have no auth checks | CRITICAL | Add middleware to validate JWT on every request | P0 |
| **No Database** | No Prisma schema, all data in-memory | HIGH | Implement Prisma + PostgreSQL, migrate mock data | P0 |
| **No Real-Time Updates** | No WebSocket/SSE code | HIGH | Implement SSE endpoint `/api/signals/stream` | P1 |
| **No Data Ingestion** | No API client code in `lib/integrations/` | HIGH | Build connectors for PrivateCircle, Zauba, NSE | P1 |
| **No Error Tracking** | Only `console.error()` in API routes | MEDIUM | Add Sentry for error monitoring | P1 |
| **No Rate Limiting** | API routes accept unlimited requests | MEDIUM | Add `express-rate-limit` or Vercel rate limiting | P2 |
| **No Caching** | Every request recalculates mock data | MEDIUM | Add Redis caching layer | P2 |
| **Missing Pages** | `/signals` and `/network` referenced but not found | MEDIUM | Implement missing pages or remove from Sidebar | P2 |
| **No Input Validation** | API routes don't validate query params | MEDIUM | Add Zod validation to all API routes | P2 |
| **No Unit Tests** | Scoring algorithm untested | MEDIUM | Add Vitest + test coverage for `lib/scoring/` | P2 |
| **No Migrations** | No database migration strategy | LOW | Set up Prisma migrations | P3 |
| **No Monitoring** | No APM or performance tracking | LOW | Add Vercel Analytics or New Relic | P3 |

---

## 13) Actionable Recommendations (Next 2 Weeks)

### **Week 1: Critical Security & Infrastructure**

**Priority 0 (Days 1-3):**

1. **Implement Server-Side Auth**
   - Install NextAuth.js: `npm install next-auth`
   - Create `/api/auth/[...nextauth]/route.ts`
   - Add JWT validation middleware to all API routes
   - **File to Create:** `app/api/auth/[...nextauth]/route.ts`

2. **Set Up Database**
   - Install Prisma: `npm install prisma @prisma/client`
   - Initialize schema: `npx prisma init`
   - Define models: Signal, Prospect, User, LeadScore
   - Run first migration: `npx prisma migrate dev --name init`
   - **Files to Create:** `prisma/schema.prisma`, `prisma/migrations/`

3. **Migrate Mock Data to DB**
   - Create seed script: `prisma/seed.ts`
   - Populate database with current mock data
   - Update API routes to query Prisma instead of mock arrays
   - **Files to Modify:** All routes in `app/api/`

**Priority 1 (Days 4-7):**
4. **Add Input Validation**

- Create Zod schemas for all API inputs
- Add validation middleware
- **File to Create:** `lib/validators/api-schemas.ts`

1. **Implement Error Tracking**
   - Install Sentry: `npx @sentry/wizard@latest -i nextjs`
   - Configure error boundaries
   - Add structured logging
   - **Files to Create:** `sentry.client.config.ts`, `sentry.server.config.ts`

2. **Add Rate Limiting**
   - Install: `npm install @upstash/ratelimit @upstash/redis`
   - Create rate limit middleware
   - Apply to all API routes
   - **File to Create:** `lib/middleware/rate-limit.ts`

### **Week 2: Core Features & Testing**

**Priority 2 (Days 8-10):**
7. **Implement Real-Time Signals**

- Create SSE endpoint: `/api/signals/stream`
- Add EventSource client in frontend
- **Files to Create:** `app/api/signals/stream/route.ts`, `app/hooks/useSignalStream.ts`

1. **Build First Integration (PrivateCircle)**
   - Create API client with retry logic
   - Add webhook handler for incoming data
   - Implement data transformation
   - **Files to Create:** `lib/integrations/privatecircle-client.ts`, `app/api/webhooks/privatecircle/route.ts`

2. **Add Unit Tests**
   - Install Vitest: `npm install -D vitest @vitest/ui`
   - Write tests for scoring algorithm
   - Add test script to `package.json`
   - **Files to Create:** `lib/scoring/calculate-score.test.ts`, `vitest.config.ts`

**Priority 3 (Days 11-14):**
10. **Implement Missing Pages**
    - Create `/signals` page
    - Create `/network` page (network graph visualization)
    - **Files to Create:** `app/signals/page.tsx`, `app/network/page.tsx`

1. **Add Caching Layer**
    - Install Redis client: `npm install ioredis`
    - Add cache middleware for GET endpoints
    - Set 5-minute TTL for prospect/signal lists
    - **File to Create:** `lib/cache/redis-client.ts`

2. **Set Up CI/CD**
    - Create GitHub Actions workflow for tests
    - Add Playwright tests to CI
    - Add type checking step
    - **File to Create:** `.github/workflows/ci.yml`

### **Immediate Quick Wins (Can be done in parallel):**

- Add `maxPageSize` validation to all paginated endpoints (1 hour)
- Create `.env.development` and `.env.production` (30 minutes)
- Add Prettier config and format codebase (1 hour)
- Create `docs/operations/deployment.md` runbook (2 hours)

---

**End of Technical Evaluation**

**Next Steps:**

1. Review this document with stakeholders
2. Prioritize recommendations based on business impact
3. Create JIRA tickets for Week 1 tasks
4. Schedule architecture review meeting

**Questions/Clarifications:**

- What is the target launch date for production?
- Are there budget constraints for third-party services (Sentry, Upstash)?
- Should we prioritize real-time features or data integrations first?

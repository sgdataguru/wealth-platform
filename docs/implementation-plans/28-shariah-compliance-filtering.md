# [28] Shariah Compliance Filtering - Implementation Plan

## Project Context

**Technical Stack**: Next.js 15 (App Router), React 18, TypeScript, TailwindCSS
**Backend**: Supabase (PostgreSQL), Edge Functions
**Infrastructure**: Vercel (FE), Supabase Cloud
**Design System**: Kairos Capital Premium Wealth Aesthetic
**Target Market**: GCC (Saudi Arabia, UAE, Kuwait, Qatar, Bahrain, Oman)

---

## User Story

**As a** Relationship Manager,
**I want** to filter prospects and investment products based on Shariah compliance status,
**So that** I can provide religiously aligned advice to clients requiring Shariah-compliant (Halal) portfolios.

---

## Pre-conditions

- User authenticated with RM or Executive role
- Client and Prospect data available in database
- Investment product catalog exists
- Portfolio holdings data available for drift detection
- Notification system operational (for alerts)

---

## Business Requirements

| Requirement | Success Metric |
|-------------|----------------|
| Shariah status on client/prospect profiles | 100% of profiles have compliance status field |
| Investment products tagged with certification | All products have Shariah tag (Compliant/Non-Compliant/Pending) |
| Global "Shariah-Only" toggle on dashboard | Toggle persists across session, filters all views |
| Automated portfolio drift alerts | Alerts generated within 1 hour of non-compliant holding detected |
| GCC market compliance | Terminology matches Islamic finance standards |

---

## Technical Specifications

### Integration Points

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **Supabase Database** | Store compliance status | PostgreSQL with enum types |
| **Supabase Realtime** | Portfolio drift detection | Subscription triggers |
| **Notification API** | Alert delivery | `/api/notifications` |
| **Product Catalog API** | Investment product data | `/api/products` |

### Terminology Standards (Islamic Finance)

| Term | Usage |
|------|-------|
| **Shariah Filter** | UI toggle label |
| **Shariah Compliant** | Status for halal investments |
| **Halal** | Alternative term (interchangeable) |
| **Non-Compliant** | Status for non-halal investments |
| **Sukuk** | Islamic bonds (always compliant) |
| **Shariah Board** | Certification authority reference |

### Security Requirements

- [x] RBAC: All RMs can view Shariah status
- [x] Only admins can modify product Shariah certification
- [x] Audit logging for status changes
- [x] Data residency considerations for GCC

### Data Model

```typescript
// Shariah Compliance Status
type ShariahStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING_REVIEW' | 'NOT_APPLICABLE';

// Client/Prospect Shariah Preference
interface ShariahPreference {
  requiresShariahCompliance: boolean;
  preferenceLevel: 'STRICT' | 'PREFERRED' | 'NO_PREFERENCE';
  certificationAuthority?: string;
  notes?: string;
}

// Investment Product Shariah Info
interface ProductShariahInfo {
  productId: string;
  shariahStatus: ShariahStatus;
  certifiedBy?: string;
  certificationDate?: Date;
  certificationExpiry?: Date;
  certificateUrl?: string;
  screeningCriteria?: ShariahScreeningCriteria;
  lastScreenedAt?: Date;
  updatedBy: string;
  updatedAt: Date;
}

interface ShariahScreeningCriteria {
  prohibitedActivitiesCheck: boolean;
  debtToAssetRatio?: number;
  interestIncomeRatio?: number;
  receivablesRatio?: number;
  screeningNotes?: string;
}

// Portfolio Drift Alert
interface ShariahDriftAlert {
  id: string;
  clientId: string;
  portfolioId: string;
  alertType: 'NEW_NON_COMPLIANT' | 'STATUS_CHANGED' | 'CERTIFICATION_EXPIRED';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  affectedHoldings: {
    productId: string;
    productName: string;
    holdingValue: number;
    holdingPercentage: number;
    reason: string;
  }[];
  status: 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED';
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolutionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Design Specifications

### Component Hierarchy

```tsx
<DashboardLayout>
  <Header>
    <ShariahToggle />
  </Header>
  <ClientProfile>
    <ShariahPreferenceCard />
  </ClientProfile>
  <ProductList>
    <ProductCard>
      <ShariahBadge status={product.shariahStatus} />
    </ProductCard>
  </ProductList>
  <NotificationPanel>
    <ShariahDriftAlert />
  </NotificationPanel>
  <DashboardWidgets>
    <ShariahComplianceSummary />
  </DashboardWidgets>
</DashboardLayout>
```

### Design System Compliance

```css
--shariah-compliant: #28A745;
--shariah-non-compliant: #DC3545;
--shariah-pending: #FFB74D;
--shariah-accent: #007B7A;
```

---

## Technical Architecture

### Component Structure

```
app/
├── components/
│   ├── ShariahToggle.tsx
│   └── features/shariah/
│       ├── ShariahPreferenceCard.tsx
│       ├── ShariahBadge.tsx
│       ├── ShariahDriftAlert.tsx
│       ├── ShariahComplianceSummary.tsx
│       └── ProductShariahEditor.tsx
├── api/shariah/
│   ├── route.ts
│   ├── products/route.ts
│   ├── alerts/route.ts
│   └── check-portfolio/route.ts
├── hooks/
│   └── useShariah.ts
```

### Database Schema

```sql
CREATE TABLE product_shariah_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  shariah_status VARCHAR(20) NOT NULL DEFAULT 'PENDING_REVIEW',
  certified_by VARCHAR(255),
  certification_date DATE,
  certification_expiry DATE,
  certificate_url TEXT,
  screening_criteria JSONB,
  last_screened_at TIMESTAMPTZ,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id)
);

CREATE TABLE shariah_drift_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id),
  portfolio_id UUID NOT NULL,
  alert_type VARCHAR(30) NOT NULL,
  severity VARCHAR(10) NOT NULL,
  affected_holdings JSONB NOT NULL DEFAULT '[]',
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  acknowledged_by UUID REFERENCES users(id),
  acknowledged_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_shariah_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  is_filter_enabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Acceptance Criteria

| ID | Criterion | Status |
|----|-----------|--------|
| 28.1 | Client/prospect profiles include Shariah Filter status | ⬜ |
| 28.2 | Investment products tagged with Shariah certification | ⬜ |
| 28.3 | RM can toggle "Shariah-Only" view on dashboard | ⬜ |
| 28.4 | Toggle filters all opportunities/products/prospects | ⬜ |
| 28.5 | Automated alerts for portfolio drift | ⬜ |
| 28.6 | Alert includes non-compliant holdings detail | ⬜ |
| 28.7 | Terminology matches Islamic finance standards | ⬜ |

---

## Implementation Status

**OVERALL STATUS**: ⬜ NOT STARTED (ShariahToggle component exists)

### Phases

- [ ] Phase 1: Foundation & Data Model
- [ ] Phase 2: Global Toggle Enhancement
- [ ] Phase 3: Profile Integration
- [ ] Phase 4: Product Tagging
- [ ] Phase 5: Portfolio Drift Detection
- [ ] Phase 6: Dashboard Integration
- [ ] Phase 7: Polish & Testing

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Filter missing in some views | High | Medium | Centralized hook |
| Incorrect Shariah classification | High | Medium | Manual certification |
| Serving non-compliant to Shariah clients | Critical | Low | Multiple validation layers |

---

**Status**: ⬜ NOT STARTED  
**Priority**: HIGH (GCC market requirement)  
**Estimated Effort**: 2-3 sprints  
**Owner**: Development Team  
**Last Updated**: 2026-01-01

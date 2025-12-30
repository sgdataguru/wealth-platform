# Prospect Detail Panel Component

A comprehensive side panel component for displaying detailed prospect information in the UHNW Liquidity Intelligence Platform.

## Quick Start

```tsx
import { ProspectDetailPanel } from '@/app/components/features';
import { usePanelStore } from '@/store/panel-store';

function Dashboard() {
  const { openPanel, selectedProspectId } = usePanelStore();
  const selectedProspect = prospects.find(p => p.id === selectedProspectId);

  return (
    <div>
      {/* Trigger */}
      <button onClick={() => openPanel(prospect.id)}>
        View Details
      </button>

      {/* Panel */}
      {selectedProspect && (
        <ProspectDetailPanel prospect={selectedProspect} />
      )}
    </div>
  );
}
```

## Features

- ✅ Slide-in animation from right
- ✅ Backdrop overlay with click-to-close
- ✅ ESC key handler
- ✅ Prospect profile with contact info
- ✅ Lead score breakdown (expandable)
- ✅ Active signals (severity-sorted)
- ✅ Key metrics grid (6 metrics)
- ✅ Relationship connections
- ✅ Activity timeline
- ✅ Action buttons (Call, Email, Note)
- ✅ Loading and error states
- ✅ Responsive design

## Components

```
ProspectDetailPanel/
├── index.tsx                  # Main container
├── ProspectProfile.tsx        # Profile section
├── LeadScoreBreakdown.tsx     # Score display
├── SignalsSection.tsx         # Signals list
├── MetricsGrid.tsx            # Metrics display
├── RelationshipContext.tsx    # Connections
├── ActivityTimeline.tsx       # Engagement history
└── ActionButtonsFooter.tsx    # CTA buttons
```

## Hooks

### `useProspectDetail(prospectId)`
Fetches prospect detail data.

```tsx
const {
  extendedMetrics,
  relatedConnections,
  recentActivity,
  isLoading,
  error,
  refreshData
} = useProspectDetail(prospectId);
```

### `useProspectActions(prospect)`
Manages action handlers.

```tsx
const {
  handleCall,
  handleEmail,
  handleAddNote,
  handleScheduleFollowUp,
  isSubmitting
} = useProspectActions(prospect);
```

## Store

### `usePanelStore()`
Global panel state management.

```tsx
const {
  selectedProspectId,
  isPanelOpen,
  openPanel,
  closePanel,
  setLoading
} = usePanelStore();
```

## Styling

Follows Kairos Capital design system:
- Navy header: `#0A1628`
- Gold accents: `#C9A227`
- White surface: `#FFFFFF`
- Consistent spacing: 8px grid

## Responsive

- **Desktop (1280px+)**: 520px wide side panel
- **Tablet (768-1279px)**: 480px wide side panel
- **Mobile (<768px)**: Full-screen overlay

## Accessibility

- Keyboard navigation (Tab, ESC)
- ARIA attributes (`role="dialog"`, `aria-modal`)
- Focus trap when open
- Screen reader support

## Type Definitions

```typescript
interface ExtendedMetrics {
  aum: number;
  aumCurrency: string;
  walletShare: number;
  relationshipStrength: number;
  lifetimeValue: number;
  lastInteractionDays: number;
  upcomingFollowUps: number;
}

interface Connection {
  id: string;
  name: string;
  relationship: string;
  strength: number;
  canIntroduce: boolean;
  company?: string;
}

interface EngagementEvent {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'signal';
  description: string;
  timestamp: Date;
  outcome?: string;
}
```

## API Integration (Production)

```typescript
// Current: Mock data in useProspectDetail hook
// Production: Replace with API calls

GET /api/prospects/[id]/detail
GET /api/prospects/[id]/metrics
GET /api/prospects/[id]/connections
GET /api/prospects/[id]/activity
POST /api/prospects/[id]/actions
```

## Testing

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Run tests (when implemented)
npm test
```

## Documentation

See [docs/features/prospect-detail-panel.md](../../docs/features/prospect-detail-panel.md) for detailed documentation.

## Screenshots

1. **Dashboard**: Main view before opening panel
2. **Panel Open**: Shows profile, score, and signals
3. **Panel Scrolled**: Shows metrics, connections, and actions

## License

Proprietary - UHNW Liquidity Intelligence Platform

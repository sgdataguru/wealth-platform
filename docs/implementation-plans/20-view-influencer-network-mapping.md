# [20] View Influencer Network Mapping - Implementation Plan

## Project Context

**Technical Stack**: Next.js 15 (App Router), React 18, TypeScript, TailwindCSS
**Backend**: Supabase (PostgreSQL), Edge Functions
**Graph Visualization**: React Flow / D3.js / Cytoscape.js
**Infrastructure**: Vercel (FE), Supabase Cloud
**Design System**: Kairos Capital Premium Wealth Aesthetic

---

## User Story

**As a** Relationship Manager,
**I want** to see a visual network map of influencers and their connections,
**So that** I can identify referral paths and leverage existing relationships for new client acquisition.

---

## Pre-conditions

- User authenticated with RM or Executive role
- Client and Prospect data available in database
- Relationship/connection data exists between entities
- Activity/conversation history tracked per contact
- Prospect list feature operational (for integration)

---

## Business Requirements

| Requirement | Success Metric |
|-------------|----------------|
| Visual network graph of relationships | Interactive graph renders within 2s for 500+ nodes |
| Display connections between clients, prospects, and influencers | All entity types represented with distinct visuals |
| Highlight referral paths to target prospects | Shortest path algorithm identifies routes in <500ms |
| Interactive visualization (zoom, pan, click) | Smooth 60fps interaction on modern browsers |
| Show relationship strength and connection type | Edge thickness/color indicates strength |
| Conversation history in node details | Last 10 touchpoints visible within node panel |
| Integration with prospect list | Click-through to prospect detail from graph |

---

## Technical Specifications

### Integration Points

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **Supabase Database** | Store graph data (nodes + edges) | PostgreSQL with graph queries |
| **React Flow** | Primary graph visualization | Force-directed layout |
| **Prospect API** | Link to prospect details | `/api/prospects/:id` |
| **Activities API** | Conversation history | `/api/activities` |

### Graph Database Considerations

**Option A: PostgreSQL with Recursive CTEs** (Recommended for MVP)
- Use adjacency list model for relationships
- Recursive queries for path finding
- Simpler infrastructure, Supabase compatible

**Option B: Neo4j/Memgraph** (Future Scale)
- Native graph database
- Cypher query language
- Better performance for deep graph traversals

### Security Requirements

- [x] RBAC: RM sees only their network + shared influencers
- [x] Executive sees full organizational network
- [x] PII protection for contact details
- [x] Audit logging for graph access
- [ ] Rate limiting for expensive graph queries

### Data Model

```typescript
// Node Types
type NodeType = 'CLIENT' | 'PROSPECT' | 'INFLUENCER' | 'CENTER_OF_INFLUENCE';

interface NetworkNode {
  id: string;
  type: NodeType;
  
  // Display
  name: string;
  title?: string;
  organization?: string;
  avatarUrl?: string;
  
  // Metrics
  aum?: number;                     // For clients
  leadScore?: number;               // For prospects
  influenceScore?: number;          // For influencers (0-100)
  connectionCount: number;
  
  // Status
  isActive: boolean;
  lastContactDate?: Date;
  assignedRmId?: string;
  
  // Position (for saved layouts)
  position?: { x: number; y: number };
}

// Edge Types
type RelationshipType = 
  | 'FAMILY'
  | 'BUSINESS_PARTNER'
  | 'COLLEAGUE'
  | 'FRIEND'
  | 'ADVISOR'
  | 'BOARD_MEMBER'
  | 'INVESTOR'
  | 'REFERRED_BY'
  | 'MUTUAL_CONTACT';

interface NetworkEdge {
  id: string;
  sourceId: string;
  targetId: string;
  
  // Relationship
  type: RelationshipType;
  strength: number;                 // 1-10 scale
  bidirectional: boolean;
  
  // Metadata
  establishedDate?: Date;
  lastInteractionDate?: Date;
  notes?: string;
  
  // Visual
  isReferralPath?: boolean;         // Highlighted when showing paths
}

// Graph Response
interface NetworkGraphData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  metadata: {
    totalNodes: number;
    totalEdges: number;
    centerNodeId?: string;
    maxDepth: number;
  };
}

// Node Detail (expanded view)
interface NodeDetail extends NetworkNode {
  contactInfo: {
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  conversationHistory: ConversationTouchpoint[];
  upcomingActivities: Activity[];
  referralPaths: ReferralPath[];
}

interface ConversationTouchpoint {
  id: string;
  date: Date;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'MESSAGE' | 'EVENT';
  summary: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  rmId: string;
  rmName: string;
}

interface ReferralPath {
  targetProspectId: string;
  targetProspectName: string;
  path: string[];                   // Array of node IDs in order
  pathLength: number;
  strength: number;                 // Weakest link in path
}
```

---

## Design Specifications

### Visual Layout & Components

```
[Network Mapping Page]
├── Header (Sticky)
│   ├── Page Title: "Influencer Network"
│   ├── Search Input (Find person in graph)
│   └── View Controls (Reset, Fullscreen, Export)
│
├── Toolbar (Sticky below header)
│   ├── Filter Toggles
│   │   ├── Show: Clients | Prospects | Influencers
│   │   └── Relationship Types (Multi-select)
│   ├── Layout Controls
│   │   ├── Layout Type (Force | Hierarchical | Radial)
│   │   └── Zoom Slider
│   └── Path Finder
│       ├── "From" Node Selector
│       ├── "To" Node Selector
│       └── "Find Path" Button
│
├── Main Graph Canvas (Flex: 70% width)
│   ├── Interactive Graph Visualization
│   │   ├── Nodes (Colored by type, sized by importance)
│   │   ├── Edges (Colored by type, thickness by strength)
│   │   └── Labels (Name, on hover: full details)
│   ├── Minimap (Bottom-right corner)
│   └── Legend (Bottom-left corner)
│
├── Detail Panel (Flex: 30% width, collapsible)
│   ├── Selected Node Header
│   │   ├── Avatar + Name + Type Badge
│   │   ├── Organization + Title
│   │   └── Quick Actions (Call, Email, View Profile)
│   ├── Connection Stats
│   │   ├── Total Connections
│   │   ├── Strongest Relationships
│   │   └── Influence Score
│   ├── Conversation History (Scrollable)
│   │   ├── TouchpointCard (Repeated)
│   │   │   ├── Date + Type Icon
│   │   │   ├── Summary
│   │   │   └── RM Name
│   │   └── "View All" Link
│   ├── Referral Paths to Prospects
│   │   └── PathCard (Shows route to target)
│   └── Related Prospects Section
│       └── Mini prospect cards with connection info
│
└── Mobile: Full-screen graph with bottom sheet for details
```

### Component Hierarchy

```tsx
<DashboardLayout>
  <NetworkPage>                                   {/* Server Component */}
    <NetworkHeader />                             {/* Server Component */}
    <NetworkToolbar />                            {/* Client Component */}
    <NetworkContent>                              {/* Client Component */}
      <GraphCanvas>                               {/* Client Component */}
        <ReactFlowProvider>
          <ReactFlow nodes={nodes} edges={edges}>
            <NetworkNode />                       {/* Custom node component */}
            <NetworkEdge />                       {/* Custom edge component */}
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
      </GraphCanvas>
      <NodeDetailPanel>                           {/* Client Component */}
        <NodeHeader />
        <ConnectionStats />
        <ConversationHistory />
        <ReferralPaths />
        <RelatedProspects />
      </NodeDetailPanel>
    </NetworkContent>
  </NetworkPage>
</DashboardLayout>
```

### Design System Compliance (Kairos Capital)

```css
/* Primary Colors */
--primary-ink: #031926;
--primary-teal: #007B7A;
--primary-cerulean: #00B3C6;
--primary-gold: #C9A84A;

/* Node Colors by Type */
--node-client: #007B7A;             /* Teal - existing clients */
--node-prospect: #C9A84A;           /* Gold - target prospects */
--node-influencer: #00B3C6;         /* Cerulean - influencers */
--node-coi: #6B7280;                /* Gray - centers of influence */

/* Edge Colors by Relationship */
--edge-family: #DC3545;             /* Red - strong family ties */
--edge-business: #007B7A;           /* Teal - business relationships */
--edge-social: #00B3C6;             /* Cerulean - social connections */
--edge-referral: #C9A84A;           /* Gold - referral paths */

/* Edge Strength (Opacity/Thickness) */
--edge-strong: 3px;                 /* Strength 8-10 */
--edge-medium: 2px;                 /* Strength 4-7 */
--edge-weak: 1px;                   /* Strength 1-3 */

/* Node Sizes */
--node-large: 64px;                 /* High influence/AUM */
--node-medium: 48px;                /* Medium importance */
--node-small: 32px;                 /* Standard nodes */

/* Interaction States */
--node-selected: 0 0 0 4px rgba(0, 179, 198, 0.5);
--node-hover: 0 0 0 2px rgba(201, 168, 74, 0.5);
--path-highlight: #C9A84A;          /* Gold for referral paths */
```

### Responsive Behavior

| Breakpoint | Layout Changes |
|------------|----------------|
| Mobile (< 768px) | Full-screen graph, bottom sheet for details |
| Tablet (768px - 1023px) | 60/40 split, collapsible panel |
| Desktop (1024px+) | 70/30 split with persistent panel |
| Large Desktop (1440px+) | Enhanced graph with more visible labels |

---

## Technical Architecture

### Component Structure

```
app/
├── (dashboard)/
│   └── network/
│       ├── page.tsx                              # Server Component entry
│       ├── loading.tsx                           # Graph skeleton
│       └── error.tsx                             # Error boundary
├── components/
│   └── features/
│       └── network/
│           ├── NetworkHeader.tsx                 # Page header
│           ├── NetworkToolbar.tsx                # Client: Filters + controls
│           ├── GraphCanvas.tsx                   # Client: React Flow wrapper
│           ├── NetworkNode.tsx                   # Custom node renderer
│           ├── NetworkEdge.tsx                   # Custom edge renderer
│           ├── NodeDetailPanel.tsx               # Client: Detail sidebar
│           ├── ConversationHistory.tsx           # Touchpoint list
│           ├── ReferralPathCard.tsx              # Path visualization
│           ├── PathFinder.tsx                    # Client: Path search UI
│           └── GraphLegend.tsx                   # Node/edge legend
├── api/
│   └── graph/
│       ├── route.ts                              # GET: Fetch graph data
│       ├── node/
│       │   └── [nodeId]/
│       │       └── route.ts                      # GET: Node details
│       └── path/
│           └── route.ts                          # GET: Find paths
```

### State Management Architecture

```typescript
// Graph state (Zustand store)
interface NetworkGraphState {
  // Data
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  selectedNodeId: string | null;
  highlightedPathNodes: string[];
  highlightedPathEdges: string[];
  
  // Filters
  filters: {
    nodeTypes: NodeType[];
    relationshipTypes: RelationshipType[];
    minStrength: number;
    showOnlyMyNetwork: boolean;
  };
  
  // UI State
  isDetailPanelOpen: boolean;
  layoutType: 'force' | 'hierarchical' | 'radial';
  zoomLevel: number;
  
  // Actions
  setSelectedNode: (nodeId: string | null) => void;
  highlightPath: (nodeIds: string[], edgeIds: string[]) => void;
  clearHighlight: () => void;
  updateFilters: (filters: Partial<NetworkFilters>) => void;
  setLayoutType: (type: LayoutType) => void;
}

// Path finder state
interface PathFinderState {
  fromNodeId: string | null;
  toNodeId: string | null;
  foundPaths: ReferralPath[];
  isSearching: boolean;
}
```

### API Schema

```typescript
// GET /api/graph?depth=2&centerId=xxx&types=CLIENT,PROSPECT
interface GraphRequest {
  centerId?: string;                // Node to center graph on
  depth?: number;                   // How many hops from center (default: 2)
  nodeTypes?: NodeType[];           // Filter by node type
  relationshipTypes?: RelationshipType[];
  minStrength?: number;             // Minimum relationship strength
  limit?: number;                   // Max nodes to return
}

interface GraphResponse {
  success: boolean;
  data: NetworkGraphData;
}

// GET /api/graph/node/:nodeId
interface NodeDetailResponse {
  success: boolean;
  data: NodeDetail;
}

// GET /api/graph/path?from=xxx&to=yyy&maxHops=4
interface PathRequest {
  fromNodeId: string;
  toNodeId: string;
  maxHops?: number;                 // Default: 4
}

interface PathResponse {
  success: boolean;
  data: {
    paths: ReferralPath[];
    searchedNodes: number;
  };
}
```

### Database Schema

```sql
-- network_nodes table
CREATE TABLE network_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('CLIENT', 'PROSPECT', 'INFLUENCER', 'CENTER_OF_INFLUENCE')),
  
  -- Identity
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  organization VARCHAR(255),
  avatar_url TEXT,
  
  -- Metrics
  aum DECIMAL(18,2),
  lead_score INTEGER,
  influence_score INTEGER CHECK (influence_score >= 0 AND influence_score <= 100),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_contact_date TIMESTAMPTZ,
  assigned_rm_id UUID REFERENCES users(id),
  
  -- External References
  prospect_id UUID REFERENCES prospects(id),
  client_id UUID REFERENCES clients(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- network_edges table (relationships)
CREATE TABLE network_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES network_nodes(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES network_nodes(id) ON DELETE CASCADE,
  
  -- Relationship
  type VARCHAR(30) NOT NULL CHECK (type IN (
    'FAMILY', 'BUSINESS_PARTNER', 'COLLEAGUE', 'FRIEND', 
    'ADVISOR', 'BOARD_MEMBER', 'INVESTOR', 'REFERRED_BY', 'MUTUAL_CONTACT'
  )),
  strength INTEGER NOT NULL CHECK (strength >= 1 AND strength <= 10),
  bidirectional BOOLEAN DEFAULT true,
  
  -- Metadata
  established_date DATE,
  last_interaction_date TIMESTAMPTZ,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate edges
  UNIQUE(source_id, target_id, type)
);

-- Indexes for graph queries
CREATE INDEX idx_nodes_type ON network_nodes(type);
CREATE INDEX idx_nodes_rm ON network_nodes(assigned_rm_id);
CREATE INDEX idx_edges_source ON network_edges(source_id);
CREATE INDEX idx_edges_target ON network_edges(target_id);
CREATE INDEX idx_edges_strength ON network_edges(strength DESC);

-- Recursive CTE function for path finding
CREATE OR REPLACE FUNCTION find_paths(
  start_node UUID,
  end_node UUID,
  max_hops INTEGER DEFAULT 4
)
RETURNS TABLE (
  path UUID[],
  path_length INTEGER,
  min_strength INTEGER
)
LANGUAGE SQL AS $$
  WITH RECURSIVE paths AS (
    -- Base case: start from source
    SELECT 
      ARRAY[source_id, target_id] AS path,
      1 AS depth,
      strength AS min_strength
    FROM network_edges
    WHERE source_id = start_node
    
    UNION ALL
    
    -- Recursive case: extend paths
    SELECT 
      p.path || e.target_id,
      p.depth + 1,
      LEAST(p.min_strength, e.strength)
    FROM paths p
    JOIN network_edges e ON e.source_id = p.path[array_length(p.path, 1)]
    WHERE 
      NOT e.target_id = ANY(p.path)  -- Avoid cycles
      AND p.depth < max_hops
  )
  SELECT 
    path,
    array_length(path, 1) - 1 AS path_length,
    min_strength
  FROM paths
  WHERE path[array_length(path, 1)] = end_node
  ORDER BY path_length, min_strength DESC
  LIMIT 5;
$$;
```

---

## Implementation Requirements

### Core Components

| Component | Type | Purpose |
|-----------|------|---------|
| `GraphCanvas.tsx` | Client | React Flow container with interactivity |
| `NetworkNode.tsx` | Client | Custom node with avatar, name, type badge |
| `NetworkEdge.tsx` | Client | Custom edge with strength visualization |
| `NodeDetailPanel.tsx` | Client | Sidebar with full node information |
| `ConversationHistory.tsx` | Client | Scrollable touchpoint list |
| `PathFinder.tsx` | Client | UI for finding referral paths |
| `NetworkToolbar.tsx` | Client | Filters and layout controls |
| `GraphLegend.tsx` | Server | Node/edge type legend |

### Custom Hooks

| Hook | Purpose |
|------|---------|
| `useNetworkGraph()` | Fetch and cache graph data |
| `useNodeDetail()` | Fetch individual node details on selection |
| `useFindPath()` | Execute path-finding queries |
| `useGraphLayout()` | Manage layout calculations |
| `useGraphZoom()` | Zoom and pan controls |

### Utility Functions

| Function | Location | Purpose |
|----------|----------|---------|
| `layoutGraph()` | `lib/utils/graph.ts` | Apply force/hierarchical layout |
| `findShortestPath()` | `lib/utils/graph.ts` | Client-side Dijkstra's |
| `filterNodes()` | `lib/utils/graph.ts` | Apply node type filters |
| `calculateNodeSize()` | `lib/utils/graph.ts` | Size based on importance |
| `getEdgeColor()` | `lib/utils/graph.ts` | Color based on relationship type |
| `getEdgeWidth()` | `lib/utils/graph.ts` | Width based on strength |

---

## Acceptance Criteria

### Functional Requirements

| ID | Criterion | Status |
|----|-----------|--------|
| 20.1 | Visual network graph showing influencer relationships | ⬜ |
| 20.2 | Displays connections between clients, prospects, and COIs | ⬜ |
| 20.3 | Highlights potential referral paths to target prospects | ⬜ |
| 20.4 | Interactive visualization (zoom, pan, click to explore) | ⬜ |
| 20.5 | Shows relationship strength and connection type | ⬜ |
| 20.6 | Conversation history visible within node details | ⬜ |
| 20.7 | Integrates with prospect list for connection opportunities | ⬜ |

### Non-Functional Requirements

| Requirement | Target | Status |
|-------------|--------|--------|
| Initial graph load | < 2s for 500 nodes | ⬜ |
| Interaction framerate | 60fps on modern browsers | ⬜ |
| Path finding | < 500ms for 4-hop search | ⬜ |
| Bundle size increase | < 150KB (React Flow) | ⬜ |
| WCAG 2.1 AA | Keyboard navigation, screen reader labels | ⬜ |
| Mobile support | Touch gestures for zoom/pan | ⬜ |

---

## Modified Files

```
app/
├── (dashboard)/
│   └── network/
│       ├── page.tsx                              ⬜
│       ├── loading.tsx                           ⬜
│       └── error.tsx                             ⬜
├── components/
│   └── features/
│       └── network/
│           ├── NetworkHeader.tsx                 ⬜
│           ├── NetworkToolbar.tsx                ⬜
│           ├── GraphCanvas.tsx                   ⬜
│           ├── NetworkNode.tsx                   ⬜
│           ├── NetworkEdge.tsx                   ⬜
│           ├── NodeDetailPanel.tsx               ⬜
│           ├── ConversationHistory.tsx           ⬜
│           ├── ReferralPathCard.tsx              ⬜
│           ├── PathFinder.tsx                    ⬜
│           └── GraphLegend.tsx                   ⬜
├── api/
│   └── graph/
│       ├── route.ts                              ⬜
│       ├── node/
│       │   └── [nodeId]/
│       │       └── route.ts                      ⬜
│       └── path/
│           └── route.ts                          ⬜
├── hooks/
│   ├── useNetworkGraph.ts                        ⬜
│   ├── useNodeDetail.ts                          ⬜
│   └── useFindPath.ts                            ⬜

lib/
└── utils/
    └── graph.ts                                  ⬜

types/
└── graph.ts                                      ⬜

store/
└── network-store.ts                              ⬜

backend/
└── database/
    └── migrations/
        └── 0006_create_network_graph.sql         ⬜
```

---

## Implementation Status

**OVERALL STATUS**: ⬜ NOT STARTED

### Phase 1: Foundation & Setup ⬜

- [ ] Database migration for network_nodes and network_edges
- [ ] Type definitions in `types/graph.ts`
- [ ] Install React Flow (`@xyflow/react`)
- [ ] Basic graph API route

### Phase 2: Core Graph Visualization ⬜

- [ ] GraphCanvas with React Flow integration
- [ ] Custom NetworkNode component
- [ ] Custom NetworkEdge component
- [ ] Force-directed layout implementation
- [ ] Zoom, pan, and minimap controls

### Phase 3: Interactivity & Details ⬜

- [ ] Node click to select
- [ ] NodeDetailPanel with basic info
- [ ] ConversationHistory component
- [ ] Node search functionality
- [ ] Filter by node type and relationship

### Phase 4: Path Finding ⬜

- [ ] PathFinder UI component
- [ ] Backend path-finding function
- [ ] Path highlighting in graph
- [ ] ReferralPathCard component

### Phase 5: Polish & Integration ⬜

- [ ] Prospect list integration
- [ ] Export graph as image
- [ ] Mobile responsive layout
- [ ] Accessibility improvements
- [ ] Performance optimization

### Phase 6: Testing ⬜

- [ ] Unit tests for graph utilities
- [ ] Integration tests for API
- [ ] E2E tests for user flows
- [ ] Performance benchmarks

---

## Dependencies

### Internal Dependencies

| Dependency | Purpose | Status |
|------------|---------|--------|
| Prospect data | Link nodes to prospect profiles | ✅ Available |
| Client data | Link nodes to client profiles | ✅ Available |
| Activities API | Fetch conversation history | ✅ Available |
| User/RM data | Assign nodes to RMs | ✅ Available |

### External Dependencies

| Dependency | Version | Purpose | Bundle Size |
|------------|---------|---------|-------------|
| `@xyflow/react` | ^12.x | Graph visualization | ~120KB |
| `dagre` | ^0.8.x | Hierarchical layout | ~30KB |
| `elkjs` | ^0.9.x | Advanced layouts (optional) | ~150KB |
| `d3-force` | ^3.x | Force simulation (built into React Flow) | Included |

---

## Risk Assessment

### Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Performance with large graphs | High | Medium | Virtualization, level-of-detail, pagination |
| React Flow learning curve | Medium | Medium | Well-documented, team training |
| Path-finding complexity | Medium | Low | PostgreSQL recursive CTE, limit max hops |
| Mobile touch interactions | Medium | Medium | React Flow supports touch, test thoroughly |
| Bundle size impact | Medium | High | Dynamic import, code splitting |

### Business Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Incomplete relationship data | High | High | Manual entry UI, import from CRM |
| Stale conversation history | Medium | Medium | Real-time sync with activities |
| User confusion with complex graphs | Medium | Medium | Guided tour, clear legend, search |

---

## Testing Strategy

### Unit Tests (Jest)

```typescript
describe('Graph Utilities', () => {
  describe('calculateNodeSize', () => {
    it('returns large size for high-AUM clients', () => {
      const node = { type: 'CLIENT', aum: 100_000_000 };
      expect(calculateNodeSize(node)).toBe(64);
    });
    
    it('returns medium size for prospects with high lead score', () => {
      const node = { type: 'PROSPECT', leadScore: 85 };
      expect(calculateNodeSize(node)).toBe(48);
    });
  });
  
  describe('getEdgeColor', () => {
    it('returns family color for FAMILY relationship', () => {
      expect(getEdgeColor('FAMILY')).toBe('#DC3545');
    });
  });
  
  describe('filterNodes', () => {
    it('filters by node type correctly', () => {
      const nodes = [
        { id: '1', type: 'CLIENT' },
        { id: '2', type: 'PROSPECT' },
        { id: '3', type: 'INFLUENCER' },
      ];
      const filtered = filterNodes(nodes, { nodeTypes: ['CLIENT', 'PROSPECT'] });
      expect(filtered).toHaveLength(2);
    });
  });
});
```

### Integration Tests (React Testing Library)

```typescript
describe('GraphCanvas', () => {
  it('renders nodes and edges correctly', async () => {
    render(<GraphCanvas nodes={mockNodes} edges={mockEdges} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('node-1')).toBeInTheDocument();
      expect(screen.getByTestId('edge-1-2')).toBeInTheDocument();
    });
  });
  
  it('opens detail panel on node click', async () => {
    render(<NetworkPage />);
    
    await userEvent.click(screen.getByTestId('node-1'));
    
    expect(screen.getByTestId('detail-panel')).toBeVisible();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
  });
  
  it('highlights path when found', async () => {
    render(<NetworkPage />);
    
    // Open path finder
    await userEvent.click(screen.getByText('Find Path'));
    
    // Select from and to nodes
    await userEvent.click(screen.getByLabelText('From'));
    await userEvent.click(screen.getByText('Client A'));
    await userEvent.click(screen.getByLabelText('To'));
    await userEvent.click(screen.getByText('Prospect X'));
    
    // Find path
    await userEvent.click(screen.getByText('Find'));
    
    await waitFor(() => {
      expect(screen.getByTestId('edge-highlighted')).toHaveClass('path-highlight');
    });
  });
});
```

### E2E Tests (Playwright)

```typescript
test.describe('Influencer Network Mapping', () => {
  test('explore network and find referral path', async ({ page }) => {
    await page.goto('/network');
    
    // Wait for graph to load
    await expect(page.locator('[data-testid="graph-canvas"]')).toBeVisible();
    await expect(page.locator('[data-testid="node"]')).toHaveCount.greaterThan(5);
    
    // Click on a node
    await page.click('[data-testid="node-client-1"]');
    
    // Verify detail panel opens
    await expect(page.locator('[data-testid="detail-panel"]')).toBeVisible();
    await expect(page.locator('text=Conversation History')).toBeVisible();
    
    // Use path finder
    await page.click('text=Find Path');
    await page.selectOption('[data-testid="from-select"]', 'node-1');
    await page.selectOption('[data-testid="to-select"]', 'node-target');
    await page.click('[data-testid="find-path-btn"]');
    
    // Verify path is highlighted
    await expect(page.locator('.path-highlight')).toHaveCount.greaterThan(0);
  });
  
  test('filter nodes by type', async ({ page }) => {
    await page.goto('/network');
    
    // Count initial nodes
    const initialCount = await page.locator('[data-testid="node"]').count();
    
    // Filter to only show clients
    await page.click('[data-testid="filter-prospects"]'); // Uncheck prospects
    await page.click('[data-testid="filter-influencers"]'); // Uncheck influencers
    
    // Verify fewer nodes
    const filteredCount = await page.locator('[data-testid="node"]').count();
    expect(filteredCount).toBeLessThan(initialCount);
  });
  
  test('zoom and pan interactions', async ({ page }) => {
    await page.goto('/network');
    
    // Get initial viewport
    const canvas = page.locator('[data-testid="graph-canvas"]');
    
    // Zoom in using controls
    await page.click('[data-testid="zoom-in"]');
    await page.click('[data-testid="zoom-in"]');
    
    // Verify zoom level changed
    await expect(page.locator('[data-testid="zoom-level"]')).toHaveText('150%');
    
    // Reset view
    await page.click('[data-testid="reset-view"]');
    await expect(page.locator('[data-testid="zoom-level"]')).toHaveText('100%');
  });
});
```

---

## Performance Considerations

### Graph Rendering

- **Level of Detail**: Hide labels at low zoom, show on hover
- **Virtualization**: Only render visible nodes (React Flow handles this)
- **Edge Bundling**: Group parallel edges to reduce clutter
- **Lazy Loading**: Load node details on demand

### Data Fetching

- **Pagination**: Limit initial graph to 100-200 nodes
- **Depth-Limited Queries**: Start with 2-hop depth, expand on demand
- **Caching**: SWR for graph data with revalidation
- **Incremental Loading**: Add nodes as user explores

### Bundle Optimization

- Dynamic import React Flow
- Tree shake unused layout algorithms
- Server Components for static elements

---

## Deployment Plan

### Development Phase

- [ ] Feature branch: `feature/20-network-mapping`
- [ ] Database migration applied to dev
- [ ] Seed network data for testing
- [ ] Component Storybook stories

### Staging Phase

- [ ] Migration applied to staging
- [ ] Performance benchmarks with realistic data
- [ ] UAT with RM stakeholders
- [ ] Cross-browser testing

### Production Phase

- [ ] Feature flag: `NETWORK_MAPPING_ENABLED`
- [ ] Canary release to 10% of users
- [ ] Monitor performance and errors
- [ ] Gradual rollout over 2 weeks

---

## Monitoring & Analytics

### Performance Metrics

| Metric | Target | Tracking |
|--------|--------|----------|
| Graph load time | < 2s | Custom timing |
| Frame rate during interaction | 60fps | Performance API |
| Path search latency | < 500ms | API timing |

### Business Metrics

| Metric | Purpose |
|--------|---------|
| Graph views per RM | Feature adoption |
| Path searches | Referral discovery usage |
| Node detail views | Engagement depth |
| Prospect link clicks | Conversion to prospect actions |

---

## Documentation Requirements

### Technical Documentation

- [ ] React Flow integration guide
- [ ] Graph API documentation
- [ ] Custom node/edge component guide
- [ ] Performance tuning tips

### User Documentation

- [ ] Network mapping user guide
- [ ] Finding referral paths tutorial
- [ ] Understanding relationship strength
- [ ] Best practices for network building

---

## Post-Launch Review

### Success Criteria

- [ ] 70% of RMs access network within first month
- [ ] Path finder used at least once by 50% of RMs
- [ ] < 2s graph load time maintained
- [ ] Positive qualitative feedback on usability

### Retrospective Items

- [ ] Graph performance with growing data
- [ ] Relationship data quality
- [ ] Missing relationship types
- [ ] Mobile UX improvements

---

**Status**: ⬜ NOT STARTED  
**Priority**: MEDIUM-HIGH  
**Estimated Effort**: 4-5 sprints  
**Owner**: Development Team  
**Last Updated**: 2026-01-01

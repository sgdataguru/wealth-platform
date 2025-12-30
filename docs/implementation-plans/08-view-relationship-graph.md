# 08 - View Relationship Graph Between Entities - Implementation Plan

## Project Context

**Technical Stack**: Next.js 15 (App Router), React 18, TypeScript, TailwindCSS
**Graph Database**: Neo4j Aura
**Visualization**: React Flow / D3.js / Cytoscape.js
**Backend**: Supabase (PostgreSQL) + Neo4j (Graph DB)
**Infrastructure**: Vercel (Frontend), Neo4j Aura (Graph Database)

---

## User Story

**As a** Relationship Manager,
**I want** to visualize the relationships between individuals, companies, sectors, and liquidity events,
**so that** I can understand how changes in one entity may impact others in my client network.

---

## Pre-conditions

- Neo4j database is set up with relationship data
- User is authenticated as an RM
- RM has clients with relationship data in the graph
- Demo/seed data is available for showcasing
- Graph query service is implemented

---

## Business Requirements

- **Visual Relationship Mapping**: RMs can see connections between people, companies, and events
  - *Success Metric*: Graph loads in <3 seconds, displays 50+ nodes smoothly
  
- **Impact Analysis**: Understand how changes ripple through the network
  - *Success Metric*: Trace paths between any two entities in <1 second
  
- **Warm Intro Discovery**: Find connection paths to reach target prospects
  - *Success Metric*: 90%+ of intro paths are accurate and actionable
  
- **Interactive Exploration**: Click, zoom, pan, and filter the graph
  - *Success Metric*: All interactions respond in <200ms
  
- **Lead Scoring Intelligence**: Graph data powers lead scoring algorithms
  - *Success Metric*: Lead scores update within 5 minutes of graph changes

---

## Technical Specifications

### Integration Points

- **Neo4j Cypher**: Graph database queries for relationship traversal
- **React Flow**: Interactive graph visualization library
- **Supabase**: Metadata and user preferences
- **OpenAI (optional)**: Natural language graph queries

### Security Requirements

- RLS at Supabase level for user data
- Neo4j queries scoped to RM's network only
- No PII exposed in graph node labels (use IDs)
- Encrypted connections to Neo4j Aura

### Data Flow

```
User Interaction → Graph Service → Neo4j Query → 
Result Processing → Graph Layout Algorithm → 
React Flow Rendering → Interactive Display
```

---

## Design Specifications

### Visual Layout & Components

**Network Map Page Layout**:

```
┌─────────────────────────────────────────────────────────────┐
│  Network Map                               [Controls] [Help] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────┐                                               │
│  │ Filters   │  ┌─────────────────────────────────────────┐ │
│  │           │  │                                         │ │
│  │ □ People  │  │      [Interactive Graph Canvas]         │ │
│  │ ■ Companies│ │                                         │ │
│  │ □ Events  │  │         ○ ─── ○ ─── ○                  │ │
│  │ □ Networks│  │         │     │     │                  │ │
│  │           │  │         ○ ─── ○ ─── ○                  │ │
│  │ Sectors:  │  │                                         │ │
│  │ □ Fintech │  │                                         │ │
│  │ □ E-comm  │  │                                         │ │
│  │           │  │                                         │ │
│  └───────────┘  └─────────────────────────────────────────┘ │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Selected Node Details                                  │  │
│  │ Name: Rajesh Sharma | Company: TechCorp | Wealth: ₹150Cr│
│  │ Connections: 12 people, 5 companies                    │  │
│  │ [View Profile] [Find Intro Path]                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Component Hierarchy**:

```tsx
<NetworkMapPage>
  <PageHeader />
  <NetworkMapLayout>
    <FilterSidebar>
      <EntityTypeFilters />
      <SectorFilters />
      <RelationshipFilters />
    </FilterSidebar>
    <GraphCanvas>
      <NetworkGraph>
        <GraphNode />
        <GraphEdge />
      </NetworkGraph>
      <GraphControls>
        <ZoomControls />
        <LayoutSelector />
        <SearchBox />
      </GraphControls>
    </GraphCanvas>
    <NodeDetailsPanel />
  </NetworkMapLayout>
</NetworkMapPage>
```

### Design System Compliance

**Color Palette**:

```css
/* Node Colors by Type */
--node-person: #1E3A5F;          /* Royal blue - people */
--node-company: #C9A227;         /* Gold - companies */
--node-event: #DC3545;           /* Red - liquidity events */
--node-network: #28A745;         /* Green - clubs/orgs */

/* Edge Colors by Relationship */
--edge-promoter: #0A1628;        /* Dark navy */
--edge-investor: #C9A227;        /* Gold */
--edge-director: #5A6C7D;        /* Slate */
--edge-knows: #E1E5EB;           /* Light gray */

/* Node States */
--node-default: #FFFFFF;
--node-hover: #F8F9FA;
--node-selected: #C9A227;        /* Gold border */
--node-path: #28A745;            /* Green - in intro path */
```

**Typography**:

```css
/* Graph Node Labels */
--node-label-size: 0.75rem;      /* 12px */
--node-label-weight: 600;

/* Edge Labels */
--edge-label-size: 0.625rem;     /* 10px */
--edge-label-weight: 400;
```

### Responsive Behavior

**Desktop (1024px+)**:

- Full-width graph canvas
- Left sidebar for filters (300px)
- Bottom panel for node details

**Tablet (768px - 1023px)**:

- Collapsible sidebar
- Full-width graph
- Floating detail panel

**Mobile (<768px)**:

- Graph takes full screen
- Filters in drawer (slide from left)
- Detail panel in modal

### Interaction Patterns

**Node States**:

```typescript
interface NodeStates {
  default: 'border-2 border-gray-300 bg-white';
  hover: 'border-blue-500 bg-blue-50 cursor-pointer shadow-lg';
  selected: 'border-4 border-gold ring-4 ring-gold/20';
  inPath: 'border-green-500 bg-green-50';
  dimmed: 'opacity-30';
}
```

**Graph Interactions**:

```typescript
interface GraphInteractions {
  nodeClick: 'Show details, highlight connections';
  nodeDoubleClick: 'Navigate to entity detail page';
  nodeRightClick: 'Context menu (Find intro, View profile)';
  edgeClick: 'Show relationship details';
  canvasDrag: 'Pan/move graph';
  canvasZoom: 'Zoom in/out (scroll or pinch)';
}
```

---

## Technical Architecture

### Component Structure

```
app/(dashboard)/
├── network/
│   ├── page.tsx                      # Main network map page
│   └── components/
│       ├── NetworkGraph.tsx          # Main graph component
│       ├── GraphNode.tsx             # Individual node
│       ├── GraphEdge.tsx             # Individual edge
│       ├── GraphControls.tsx         # Zoom, layout controls
│       ├── FilterSidebar.tsx         # Filter panel
│       ├── NodeDetailsPanel.tsx      # Selected node info
│       ├── IntroPathFinder.tsx       # Find warm intro paths
│       ├── GraphLegend.tsx           # Legend for node/edge types
│       └── hooks/
│           ├── useGraphData.ts       # Fetch graph data
│           ├── useGraphLayout.ts     # Layout algorithms
│           ├── useNodeSelection.ts   # Node selection state
│           └── useIntroPath.ts       # Intro path finding
```

### State Management Architecture

**Graph State Interface**:

```typescript
interface GraphState {
  // Data
  nodes: GraphNode[];
  edges: GraphEdge[];
  isLoading: boolean;
  error: string | null;
  
  // Selection
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  highlightedNodeIds: string[];
  
  // Filters
  filters: GraphFilters;
  
  // Layout
  layout: GraphLayout;
  viewport: Viewport;
  
  // Intro Path
  introPath: IntroPath | null;
  isCalculatingPath: boolean;
}

interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  properties: Record<string, any>;
  position?: { x: number; y: number };
  metadata?: {
    clientId?: string;
    companyId?: string;
    eventId?: string;
  };
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label: string;
  properties: Record<string, any>;
}

type NodeType = 
  | 'person' 
  | 'company' 
  | 'liquidity_event' 
  | 'network' 
  | 'rm';

type EdgeType = 
  | 'promoter_of'
  | 'director_of'
  | 'investor_in'
  | 'member_of'
  | 'knows'
  | 'affects'
  | 'involves'
  | 'manages';

interface IntroPath {
  sourceId: string;
  targetId: string;
  path: GraphNode[];
  relationships: GraphEdge[];
  strength: number;        // 0-100
  hops: number;
}

interface GraphFilters {
  nodeTypes: NodeType[];
  sectors: string[];
  relationshipTypes: EdgeType[];
  minWealth?: number;
  onlyClients: boolean;
}

type GraphLayout = 
  | 'force-directed'
  | 'hierarchical'
  | 'circular'
  | 'dagre';
```

**Graph Actions**:

```typescript
interface GraphActions {
  // Data Loading
  loadGraph: (filters?: GraphFilters) => Promise<void>;
  refreshGraph: () => Promise<void>;
  
  // Node Selection
  selectNode: (nodeId: string | null) => void;
  highlightConnections: (nodeId: string) => void;
  clearSelection: () => void;
  
  // Filtering
  updateFilters: (filters: Partial<GraphFilters>) => void;
  resetFilters: () => void;
  
  // Layout
  changeLayout: (layout: GraphLayout) => void;
  fitToView: () => void;
  
  // Intro Path
  findIntroPath: (targetId: string) => Promise<void>;
  clearIntroPath: () => void;
}
```

### API Integration Schema

**Graph API** (`/api/graph/route.ts`):

```typescript
// GET Request
interface GetGraphRequest {
  rmId: string;
  filters?: GraphFilters;
  depth?: number;         // Max relationship hops (default: 2)
}

// Response
interface GraphResponse {
  success: boolean;
  data: {
    nodes: GraphNode[];
    edges: GraphEdge[];
    stats: {
      totalNodes: number;
      totalEdges: number;
      nodeTypeCounts: Record<NodeType, number>;
    };
  };
}
```

**Intro Path API** (`/api/graph/intro-paths/route.ts`):

```typescript
// POST Request
interface FindIntroPathRequest {
  rmId: string;
  targetPersonId: string;
  maxHops?: number;       // Default: 3
  preferredTypes?: EdgeType[];
}

// Response
interface IntroPathResponse {
  success: boolean;
  data: {
    paths: IntroPath[];   // Multiple paths, sorted by strength
    recommended: IntroPath; // Best path
  };
}
```

---

## Implementation Requirements

### Core Components

#### 1. `NetworkGraph.tsx` - Main graph visualization

- React Flow canvas with custom nodes/edges
- Pan, zoom, drag interactions
- Node/edge styling based on type
- Auto-layout on data load

#### 2. `GraphNode.tsx` - Custom node component

- Display name, icon, and metadata
- Type-based styling (person/company/event)
- Hover effects and selection states
- Context menu on right-click

#### 3. `GraphControls.tsx` - Interaction controls

- Zoom in/out buttons
- Fit to view button
- Layout algorithm selector
- Search box to find nodes

#### 4. `IntroPathFinder.tsx` - Warm intro discovery

- Input: Target person
- Calculate shortest path from RM
- Display path visually on graph
- Show connection strength score

#### 5. `FilterSidebar.tsx` - Graph filtering

- Toggle node types (people/companies/events)
- Filter by sector
- Filter by relationship type
- Wealth threshold slider

### Custom Hooks

#### `useGraphData()` - Fetch and transform graph data

```typescript
export function useGraphData(rmId: string, filters?: GraphFilters) {
  return useQuery({
    queryKey: ['graph', rmId, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        rmId,
        ...filters
      });
      
      const response = await fetch(`/api/graph?${params}`);
      if (!response.ok) throw new Error('Failed to fetch graph');
      
      const data = await response.json();
      return data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
```

#### `useGraphLayout()` - Apply layout algorithms

```typescript
export function useGraphLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  layout: GraphLayout
) {
  return useMemo(() => {
    switch (layout) {
      case 'force-directed':
        return applyForceDirectedLayout(nodes, edges);
      case 'hierarchical':
        return applyHierarchicalLayout(nodes, edges);
      case 'circular':
        return applyCircularLayout(nodes, edges);
      case 'dagre':
        return applyDagreLayout(nodes, edges);
      default:
        return nodes;
    }
  }, [nodes, edges, layout]);
}
```

#### `useIntroPath()` - Find warm intro paths

```typescript
export function useIntroPath(rmId: string) {
  const [path, setPath] = useState<IntroPath | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const findPath = async (targetPersonId: string) => {
    setIsCalculating(true);
    try {
      const response = await fetch('/api/graph/intro-paths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rmId, targetPersonId })
      });
      
      const data = await response.json();
      setPath(data.data.recommended);
    } catch (error) {
      console.error('Failed to find intro path:', error);
    } finally {
      setIsCalculating(false);
    }
  };
  
  return { path, isCalculating, findPath, clearPath: () => setPath(null) };
}
```

### Service Functions

#### `services/graphService.ts` - Neo4j queries

```typescript
export async function fetchGraphForRM(
  rmId: string,
  filters?: GraphFilters,
  depth: number = 2
): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
  const session = neo4jDriver.session();
  
  try {
    const query = `
      MATCH (rm:RM {id: $rmId})
      MATCH path = (rm)-[*1..${depth}]-(node)
      WHERE 
        (node:Person OR node:Company OR node:LiquidityEvent OR node:Network)
        ${buildFiltersClause(filters)}
      WITH DISTINCT node, collect(relationships(path)) as rels
      RETURN node, rels
    `;
    
    const result = await session.run(query, { rmId });
    
    const nodes = extractNodes(result);
    const edges = extractEdges(result);
    
    return { nodes, edges };
  } finally {
    await session.close();
  }
}

export async function findIntroductionPath(
  rmId: string,
  targetPersonId: string,
  maxHops: number = 3
): Promise<IntroPath[]> {
  const session = neo4jDriver.session();
  
  try {
    const query = `
      MATCH (rm:RM {id: $rmId})
      MATCH (target:Person {id: $targetPersonId})
      MATCH path = shortestPath((rm)-[:KNOWS|CONNECTED_TO*1..${maxHops}]-(target))
      WITH path, 
           reduce(strength = 100, rel in relationships(path) | 
             strength * coalesce(rel.strength, 0.5)
           ) as pathStrength
      RETURN path, pathStrength, length(path) as hops
      ORDER BY hops ASC, pathStrength DESC
      LIMIT 5
    `;
    
    const result = await session.run(query, { rmId, targetPersonId });
    
    return result.records.map(record => ({
      sourceId: rmId,
      targetId: targetPersonId,
      path: extractPathNodes(record.get('path')),
      relationships: extractPathRelationships(record.get('path')),
      strength: record.get('pathStrength'),
      hops: record.get('hops')
    }));
  } finally {
    await session.close();
  }
}
```

#### `lib/utils/graph-helpers.ts` - Graph utilities

```typescript
export function transformNeo4jNodes(neo4jNodes: any[]): GraphNode[] {
  return neo4jNodes.map(node => ({
    id: node.identity.toString(),
    type: determineNodeType(node.labels),
    label: node.properties.name || 'Unknown',
    properties: node.properties,
    metadata: extractMetadata(node)
  }));
}

export function transformNeo4jEdges(neo4jRels: any[]): GraphEdge[] {
  return neo4jRels.map(rel => ({
    id: rel.identity.toString(),
    source: rel.start.toString(),
    target: rel.end.toString(),
    type: rel.type.toLowerCase() as EdgeType,
    label: formatEdgeLabel(rel.type),
    properties: rel.properties
  }));
}

export function calculateConnectionStrength(
  path: IntroPath
): number {
  // Shorter paths = higher strength
  // Known relationships > generic "knows"
  const hopPenalty = Math.pow(0.8, path.hops - 1);
  const relationshipBonus = path.relationships.reduce((acc, rel) => {
    if (rel.type === 'promoter_of') return acc * 1.2;
    if (rel.type === 'director_of') return acc * 1.15;
    if (rel.type === 'investor_in') return acc * 1.1;
    return acc;
  }, 1);
  
  return Math.min(100, hopPenalty * relationshipBonus * 100);
}
```

---

## Demo / Seed Data

### Sample Graph Data (Neo4j Cypher)

```cypher
// Create RMs
CREATE (rm1:RM {
  id: 'rm-001',
  name: 'Priya Mehta',
  email: 'priya.mehta@kairoscapital.mu'
})

// Create People (UHNW Clients)
CREATE (p1:Person {
  id: 'person-001',
  name: 'Rajesh Sharma',
  designation: 'CEO',
  netWorth: 15000000000,
  isClient: true,
  isInfluencer: true
})

CREATE (p2:Person {
  id: 'person-002',
  name: 'Amit Patel',
  designation: 'Founder',
  netWorth: 8500000000,
  isClient: true,
  isInfluencer: false
})

CREATE (p3:Person {
  id: 'person-003',
  name: 'Sneha Kapoor',
  designation: 'CFO',
  netWorth: 3200000000,
  isClient: false,
  isInfluencer: true
})

CREATE (p4:Person {
  id: 'person-004',
  name: 'Vikram Singh',
  designation: 'Angel Investor',
  netWorth: 12000000000,
  isClient: true,
  isInfluencer: true
})

CREATE (p5:Person {
  id: 'person-005',
  name: 'Neha Reddy',
  designation: 'Co-Founder',
  netWorth: 5500000000,
  isClient: false,
  isInfluencer: false
})

// Create Companies
CREATE (c1:Company {
  id: 'company-001',
  name: 'TechCorp India',
  cin: 'U72900DL2015PTC123456',
  sector: 'Fintech',
  founded: date('2015-03-15'),
  valuation: 45000000000
})

CREATE (c2:Company {
  id: 'company-002',
  name: 'E-Commerce Solutions',
  cin: 'U52100MH2018PTC234567',
  sector: 'E-commerce',
  founded: date('2018-06-20'),
  valuation: 25000000000
})

CREATE (c3:Company {
  id: 'company-003',
  name: 'GreenEnergy Ventures',
  cin: 'U40109KA2020PTC345678',
  sector: 'Renewable Energy',
  founded: date('2020-01-10'),
  valuation: 18000000000
})

CREATE (c4:Company {
  id: 'company-004',
  name: 'HealthTech Innovations',
  cin: 'U85100TN2019PTC456789',
  sector: 'Healthcare',
  founded: date('2019-09-05'),
  valuation: 12000000000
})

// Create Networks/Clubs
CREATE (n1:Network {
  id: 'network-001',
  name: 'TiE Dubai',
  type: 'industry_body',
  memberCount: 450
})

CREATE (n2:Network {
  id: 'network-002',
  name: 'YPO India',
  type: 'club',
  memberCount: 280
})

// Create Liquidity Events
CREATE (e1:LiquidityEvent {
  id: 'event-001',
  type: 'ipo_filing',
  amount: 8500000000,
  date: date('2025-02-15'),
  source: 'SEBI Filing'
})

CREATE (e2:LiquidityEvent {
  id: 'event-002',
  type: 'series_c_funding',
  amount: 3500000000,
  date: date('2025-01-10'),
  source: 'Private Circle'
})

CREATE (e3:LiquidityEvent {
  id: 'event-003',
  type: 'acquisition',
  amount: 15000000000,
  date: date('2025-03-01'),
  source: 'Market Intelligence'
})

// Create Relationships

// RM manages clients
CREATE (rm1)-[:MANAGES]->(p1)
CREATE (rm1)-[:MANAGES]->(p2)
CREATE (rm1)-[:MANAGES]->(p4)

// Promoter relationships
CREATE (p1)-[:PROMOTER_OF {stake: 35.5}]->(c1)
CREATE (p2)-[:PROMOTER_OF {stake: 42.0}]->(c2)
CREATE (p4)-[:PROMOTER_OF {stake: 28.0}]->(c3)

// Director relationships
CREATE (p1)-[:DIRECTOR_OF]->(c1)
CREATE (p3)-[:DIRECTOR_OF]->(c1)
CREATE (p2)-[:DIRECTOR_OF]->(c2)
CREATE (p5)-[:DIRECTOR_OF]->(c2)

// Investor relationships
CREATE (p4)-[:INVESTOR_IN {amount: 2500000000, date: date('2022-05-15')}]->(c1)
CREATE (p4)-[:INVESTOR_IN {amount: 1800000000, date: date('2023-03-20')}]->(c4)
CREATE (p1)-[:INVESTOR_IN {amount: 3000000000, date: date('2021-11-10')}]->(c3)

// Network memberships
CREATE (p1)-[:MEMBER_OF {since: date('2018-01-01')}]->(n1)
CREATE (p2)-[:MEMBER_OF {since: date('2020-06-15')}]->(n1)
CREATE (p4)-[:MEMBER_OF {since: date('2019-03-10')}]->(n1)
CREATE (p1)-[:MEMBER_OF {since: date('2017-09-20')}]->(n2)
CREATE (p3)-[:MEMBER_OF {since: date('2021-02-15')}]->(n2)

// Personal connections (knows)
CREATE (p1)-[:KNOWS {strength: 0.9}]->(p2)
CREATE (p1)-[:KNOWS {strength: 0.85}]->(p3)
CREATE (p2)-[:KNOWS {strength: 0.7}]->(p4)
CREATE (p3)-[:KNOWS {strength: 0.8}]->(p4)
CREATE (p4)-[:KNOWS {strength: 0.75}]->(p5)
CREATE (p1)-[:KNOWS {strength: 0.6}]->(p5)

// RM connections (warm intro paths)
CREATE (rm1)-[:CONNECTED_TO {via: 'Client relationship'}]->(p1)
CREATE (rm1)-[:CONNECTED_TO {via: 'Client relationship'}]->(p2)
CREATE (rm1)-[:CONNECTED_TO {via: 'Client relationship'}]->(p4)

// Liquidity events
CREATE (e1)-[:AFFECTS]->(p1)
CREATE (e1)-[:INVOLVES]->(c1)

CREATE (e2)-[:AFFECTS]->(p2)
CREATE (e2)-[:INVOLVES]->(c2)

CREATE (e3)-[:AFFECTS]->(p4)
CREATE (e3)-[:INVOLVES]->(c3)
```

### Sample API Response

**GET `/api/graph?rmId=rm-001`**:

```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "rm-001",
        "type": "rm",
        "label": "Priya Mehta",
        "properties": {
          "name": "Priya Mehta",
          "email": "priya.mehta@kairoscapital.mu"
        }
      },
      {
        "id": "person-001",
        "type": "person",
        "label": "Rajesh Sharma",
        "properties": {
          "name": "Rajesh Sharma",
          "designation": "CEO",
          "netWorth": 15000000000,
          "isClient": true,
          "isInfluencer": true
        },
        "metadata": {
          "clientId": "client-001"
        }
      },
      {
        "id": "company-001",
        "type": "company",
        "label": "TechCorp India",
        "properties": {
          "name": "TechCorp India",
          "sector": "Fintech",
          "valuation": 45000000000
        }
      },
      {
        "id": "event-001",
        "type": "liquidity_event",
        "label": "IPO Filing",
        "properties": {
          "type": "ipo_filing",
          "amount": 8500000000,
          "date": "2025-02-15"
        }
      }
    ],
    "edges": [
      {
        "id": "edge-001",
        "source": "rm-001",
        "target": "person-001",
        "type": "manages",
        "label": "Manages"
      },
      {
        "id": "edge-002",
        "source": "person-001",
        "target": "company-001",
        "type": "promoter_of",
        "label": "Promoter (35.5%)",
        "properties": {
          "stake": 35.5
        }
      },
      {
        "id": "edge-003",
        "source": "event-001",
        "target": "person-001",
        "type": "affects",
        "label": "Affects"
      }
    ],
    "stats": {
      "totalNodes": 15,
      "totalEdges": 24,
      "nodeTypeCounts": {
        "person": 5,
        "company": 4,
        "liquidity_event": 3,
        "network": 2,
        "rm": 1
      }
    }
  }
}
```

### Demo Scenario: Warm Intro Path

**Scenario**: RM wants introduction to Sneha Kapoor (person-003) who is NOT a client.

**POST `/api/graph/intro-paths`**:

```json
{
  "rmId": "rm-001",
  "targetPersonId": "person-003"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "paths": [
      {
        "sourceId": "rm-001",
        "targetId": "person-003",
        "path": [
          {
            "id": "rm-001",
            "type": "rm",
            "label": "Priya Mehta (You)"
          },
          {
            "id": "person-001",
            "type": "person",
            "label": "Rajesh Sharma"
          },
          {
            "id": "person-003",
            "type": "person",
            "label": "Sneha Kapoor"
          }
        ],
        "relationships": [
          {
            "type": "manages",
            "label": "You manage Rajesh"
          },
          {
            "type": "knows",
            "label": "Rajesh knows Sneha",
            "properties": {
              "strength": 0.85,
              "context": "Both are members of YPO India"
            }
          }
        ],
        "strength": 85,
        "hops": 2
      }
    ],
    "recommended": {
      "sourceId": "rm-001",
      "targetId": "person-003",
      "path": [...],
      "relationships": [...],
      "strength": 85,
      "hops": 2,
      "suggestion": "Ask Rajesh Sharma to introduce you to Sneha Kapoor. They know each other through YPO India."
    }
  }
}
```

---

## Acceptance Criteria

### Functional Requirements

#### Core Feature Functionality

✅ **AC 1.1**: Graph visualization shows connections between entities

- Displays people, companies, networks, and events as nodes
- Shows relationships as labeled edges
- Different colors/icons for different entity types

✅ **AC 1.2**: Liquidity events mapped to affected entities

- Events connected to impacted people and companies
- Visual distinction for event nodes (red color)
- Hover shows event details (type, amount, date)

✅ **AC 1.3**: Trace impact across companies and individuals

- Click on event node to highlight affected entities
- Show path from event → company → promoter → network
- Understand ripple effects of liquidity events

✅ **AC 1.4**: Graph is interactive (zoom, pan, click)

- Zoom in/out with mouse wheel or buttons
- Pan by dragging canvas
- Click nodes to select and show details
- Right-click for context menu

✅ **AC 1.5**: Relationships clearly labeled

- Edge labels show relationship type ("Promoter of", "Investor in")
- Labels show additional context (stake %, investment amount)
- Hover on edge shows full relationship details

### Non-Functional Requirements

#### Performance

- ⚡ Graph loads in <3 seconds (50+ nodes)
- ⚡ Layout calculation completes in <1 second
- ⚡ Node interactions respond in <200ms
- ⚡ Intro path calculation <1 second

#### Accessibility

- ♿ Keyboard navigation (Tab, Arrow keys)
- ♿ Screen reader announces selected nodes
- ♿ High contrast mode for nodes/edges
- ♿ Zoom in/out with keyboard shortcuts

#### Security

- 🔒 Neo4j queries scoped to RM's network
- 🔒 No unauthorized access to other RMs' graphs
- 🔒 PII masked in node labels

---

## Modified Files

### New Files

```
app/
├── api/
│   └── graph/
│       ├── route.ts                ⬜ NEW - Get graph data
│       ├── intro-paths/
│       │   └── route.ts            ⬜ NEW - Find warm intro paths
│       └── seed-data/
│           └── route.ts            ⬜ NEW - Load demo data (dev only)

app/(dashboard)/
└── network/
    ├── page.tsx                    ⬜ NEW - Network map page
    └── components/
        ├── NetworkGraph.tsx        ⬜ NEW - Main graph component
        ├── GraphNode.tsx           ⬜ NEW - Custom node
        ├── GraphEdge.tsx           ⬜ NEW - Custom edge
        ├── GraphControls.tsx       ⬜ NEW - Zoom/layout controls
        ├── FilterSidebar.tsx       ⬜ NEW - Graph filters
        ├── NodeDetailsPanel.tsx    ⬜ NEW - Selected node info
        ├── IntroPathFinder.tsx     ⬜ NEW - Find warm intros
        ├── GraphLegend.tsx         ⬜ NEW - Legend
        └── hooks/
            ├── useGraphData.ts     ⬜ NEW - Fetch graph data
            ├── useGraphLayout.ts   ⬜ NEW - Layout algorithms
            ├── useNodeSelection.ts ⬜ NEW - Selection state
            └── useIntroPath.ts     ⬜ NEW - Intro path finding

services/
└── graphService.ts                 ⬜ NEW - Neo4j queries

lib/
├── neo4j/
│   └── graph-queries.ts            ⬜ NEW - Cypher queries
└── utils/
    └── graph-helpers.ts            ⬜ NEW - Graph utilities

types/
└── graph.ts                        ⬜ NEW - Graph type definitions

scripts/
└── seed-graph-data.ts              ⬜ NEW - Seed demo data
```

### Modified Files

```
app/(dashboard)/
└── layout.tsx                      ✏️ MODIFY - Add network nav link

lib/neo4j/
└── client.ts                       ✏️ MODIFY - Add graph query methods

types/
└── index.ts                        ✏️ MODIFY - Export graph types
```

---

## Implementation Status

**OVERALL STATUS**: ⬜ NOT STARTED

### Phase 1: Foundation & Setup

- ⬜ Set up React Flow library
- ⬜ Create graph type definitions
- ⬜ Set up Neo4j client and queries
- ⬜ Create seed data script

### Phase 2: Data Layer

- ⬜ Build graphService with Neo4j queries
- ⬜ Implement /api/graph endpoint
- ⬜ Create useGraphData hook
- ⬜ Seed demo data to Neo4j

### Phase 3: Visualization

- ⬜ Build NetworkGraph component
- ⬜ Create custom GraphNode component
- ⬜ Create custom GraphEdge component
- ⬜ Add layout algorithms (force-directed, hierarchical)

### Phase 4: Interactions

- ⬜ Implement node selection
- ⬜ Add zoom/pan controls
- ⬜ Build NodeDetailsPanel
- ⬜ Add FilterSidebar

### Phase 5: Advanced Features

- ⬜ Implement IntroPathFinder
- ⬜ Add /api/graph/intro-paths endpoint
- ⬜ Highlight paths on graph
- ⬜ Add context menus
- ⬜ Performance optimization
- ⬜ Mobile responsive design

---

## Dependencies

### Internal Dependencies

- ✅ Neo4j database setup
- ✅ Supabase authentication
- ⬜ Design system components
- ⬜ Graph seed data

### External Dependencies

- React Flow (graph visualization)
- D3.js (layout algorithms - optional)
- Neo4j JavaScript Driver
- Date-fns (date formatting)

### NPM Packages

```bash
npm install reactflow neo4j-driver dagre
npm install @types/dagre --save-dev
```

---

## Risk Assessment

### Technical Risks

#### **Risk 1: Graph Performance with Large Networks**

- **Impact**: High - Slow rendering with 100+ nodes
- **Mitigation**:
  - Limit initial load to 50 nodes
  - Lazy load nodes on demand (click to expand)
  - Use React Flow's built-in virtualization
  - Debounce layout calculations
- **Contingency**: Simplified list view fallback

#### **Risk 2: Neo4j Query Performance**

- **Impact**: Medium - Slow queries for deep traversals
- **Mitigation**:
  - Limit depth to 2-3 hops
  - Add indexes on frequently queried properties
  - Cache query results (10 min)
  - Use LIMIT clause
- **Contingency**: Pre-calculate common queries, store in PostgreSQL

#### **Risk 3: Layout Algorithm Complexity**

- **Impact**: Medium - Poor layout for certain graph structures
- **Mitigation**:
  - Provide multiple layout options
  - Allow manual node positioning (drag)
  - Use proven libraries (Dagre, D3 force)
- **Contingency**: Simple circular layout as fallback

### Business Risks

#### **Risk 1: Data Quality Issues**

- **Impact**: High - Inaccurate intro paths hurt credibility
- **Mitigation**:
  - Validate relationship data before seeding
  - Allow RMs to flag incorrect connections
  - Regular data audits
- **Contingency**: Show confidence score with intro paths

---

## Testing Strategy

### Unit Tests (Jest)

**Test File**: `services/graphService.test.ts`

```typescript
describe('graphService', () => {
  it('should fetch graph for RM', async () => {
    const { nodes, edges } = await fetchGraphForRM('rm-001');
    
    expect(nodes.length).toBeGreaterThan(0);
    expect(edges.length).toBeGreaterThan(0);
    expect(nodes.some(n => n.type === 'person')).toBe(true);
  });
  
  it('should find intro path between RM and target', async () => {
    const paths = await findIntroductionPath('rm-001', 'person-003');
    
    expect(paths.length).toBeGreaterThan(0);
    expect(paths[0].hops).toBeLessThanOrEqual(3);
    expect(paths[0].strength).toBeGreaterThan(0);
  });
  
  it('should apply filters to graph query', async () => {
    const filters: GraphFilters = {
      nodeTypes: ['person', 'company'],
      sectors: ['Fintech'],
      onlyClients: true
    };
    
    const { nodes } = await fetchGraphForRM('rm-001', filters);
    
    expect(nodes.every(n => 
      n.type === 'person' || n.type === 'company'
    )).toBe(true);
  });
});
```

**Test File**: `lib/utils/graph-helpers.test.ts`

```typescript
describe('graph-helpers', () => {
  it('should transform Neo4j nodes correctly', () => {
    const neo4jNodes = [
      {
        identity: neo4j.int(1),
        labels: ['Person'],
        properties: { name: 'Rajesh' }
      }
    ];
    
    const transformed = transformNeo4jNodes(neo4jNodes);
    
    expect(transformed[0].id).toBe('1');
    expect(transformed[0].type).toBe('person');
    expect(transformed[0].label).toBe('Rajesh');
  });
  
  it('should calculate connection strength correctly', () => {
    const path: IntroPath = {
      sourceId: 'rm-001',
      targetId: 'person-003',
      path: [{...}, {...}],
      relationships: [
        { type: 'manages', ... },
        { type: 'promoter_of', ... }
      ],
      hops: 2,
      strength: 0
    };
    
    const strength = calculateConnectionStrength(path);
    
    expect(strength).toBeGreaterThan(50);
    expect(strength).toBeLessThanOrEqual(100);
  });
});
```

### Integration Tests

**Test File**: `app/(dashboard)/network/page.integration.test.tsx`

```typescript
describe('Network Map Page', () => {
  it('should load and display graph', async () => {
    mockAPI('/api/graph', sampleGraphData);
    
    const { container } = render(<NetworkMapPage />);
    
    await waitFor(() => {
      expect(container.querySelector('.react-flow')).toBeInTheDocument();
    });
    
    // Check nodes rendered
    const nodes = container.querySelectorAll('.react-flow__node');
    expect(nodes.length).toBeGreaterThan(5);
  });
  
  it('should select node and show details', async () => {
    const { getByTestId } = render(<NetworkMapPage />);
    
    // Click on a node
    const node = getByTestId('graph-node-person-001');
    fireEvent.click(node);
    
    // Details panel should appear
    await waitFor(() => {
      expect(getByTestId('node-details-panel')).toBeVisible();
      expect(getByText('Rajesh Sharma')).toBeInTheDocument();
    });
  });
  
  it('should find and highlight intro path', async () => {
    mockAPI('/api/graph/intro-paths', sampleIntroPathData);
    
    const { getByTestId, getByText } = render(<NetworkMapPage />);
    
    // Open intro path finder
    fireEvent.click(getByTestId('find-intro-button'));
    
    // Select target person
    fireEvent.click(getByText('Sneha Kapoor'));
    
    // Wait for path to be highlighted
    await waitFor(() => {
      const highlightedNodes = document.querySelectorAll('.node-in-path');
      expect(highlightedNodes.length).toBe(3); // RM → Rajesh → Sneha
    });
  });
});
```

### E2E Tests (Playwright)

**Test File**: `e2e/network-graph.spec.ts`

```typescript
test.describe('Network Graph Visualization', () => {
  test('complete graph exploration workflow', async ({ page }) => {
    await page.goto('/network');
    
    // Wait for graph to load
    await expect(page.locator('.react-flow')).toBeVisible();
    
    // Check nodes are visible
    const nodes = await page.locator('.react-flow__node').count();
    expect(nodes).toBeGreaterThan(5);
    
    // Click on a person node
    await page.click('[data-testid="graph-node-person-001"]');
    
    // Details panel should show
    await expect(page.locator('[data-testid="node-details-panel"]')).toBeVisible();
    await expect(page.locator('text=Rajesh Sharma')).toBeVisible();
    
    // Zoom in
    await page.click('[data-testid="zoom-in-button"]');
    await page.waitForTimeout(500);
    
    // Pan the graph
    await page.mouse.move(300, 300);
    await page.mouse.down();
    await page.mouse.move(400, 400);
    await page.mouse.up();
    
    // Apply filter
    await page.click('[data-testid="filter-companies"]');
    await page.waitForTimeout(1000);
    
    // Verify company nodes are hidden
    const companyNodes = await page.locator('[data-node-type="company"]').count();
    expect(companyNodes).toBe(0);
  });
  
  test('warm intro path discovery', async ({ page }) => {
    await page.goto('/network');
    
    // Open intro path finder
    await page.click('[data-testid="intro-path-button"]');
    
    // Search for target person
    await page.fill('[data-testid="target-person-search"]', 'Sneha');
    await page.click('text=Sneha Kapoor');
    
    // Wait for path calculation
    await expect(page.locator('[data-testid="intro-path-result"]')).toBeVisible();
    
    // Verify path details
    await expect(page.locator('text=2 hops')).toBeVisible();
    await expect(page.locator('text=Strength: 85%')).toBeVisible();
    
    // Path should be highlighted on graph
    const highlightedNodes = await page.locator('.node-in-path').count();
    expect(highlightedNodes).toBe(3);
  });
});
```

---

## Performance Considerations

### Bundle Optimization

- **Code splitting**: Lazy load React Flow

  ```typescript
  const NetworkGraph = lazy(() => import('./components/NetworkGraph'));
  ```

- **Tree shaking**: Import only used React Flow components
- **Web workers**: Run layout algorithms in background thread

### Runtime Performance

- **Memoization**: Cache layout calculations

  ```typescript
  const layoutedNodes = useMemo(() => 
    applyLayout(nodes, edges, layout), 
    [nodes, edges, layout]
  );
  ```

- **Throttling**: Throttle pan/zoom events (60fps)
- **Virtualization**: Only render visible nodes (React Flow built-in)

### Caching Strategy

- **Query caching**: Cache graph data for 10 minutes
- **Layout caching**: Save user's preferred layout
- **Neo4j caching**: Index frequently queried properties

---

## Deployment Plan

### Development Phase

1. **Feature branch**: `feature/08-relationship-graph`
2. **Seed demo data**: Load sample data to Neo4j
3. **Testing**: Visual validation with demo data
4. **Code review**: PR with screenshots

### Staging Phase

1. **Deploy to staging**: With demo data loaded
2. **Demo**: Showcase to product team and RMs
3. **Performance test**: Test with 100+ node graphs
4. **Data validation**: Verify intro paths are accurate

### Production Phase

1. **Deploy to production**: Merge to `main`
2. **Monitor metrics**: Graph load times, query performance
3. **Gradual rollout**: Enable for all RMs
4. **Feedback loop**: Collect RM feedback on accuracy

---

## Monitoring & Analytics

### Performance Metrics

- **Graph Load Time**: p50, p95, p99
- **Neo4j Query Time**: Average, max
- **Layout Calculation Time**: Average
- **Interaction Latency**: Node click, zoom, pan

### Business Metrics

- **Graph Usage**: % of RMs using network map weekly
- **Intro Path Requests**: # of intro paths found
- **Intro Path Success**: % of intros that led to meetings
- **Filter Usage**: Most used filters

### Technical Metrics

- **Neo4j Connection Uptime**: % time connected
- **Query Error Rate**: Failed queries / total
- **Cache Hit Rate**: Cached vs fresh queries

---

## Documentation Requirements

### Technical Documentation

- **Neo4j Setup Guide**: How to seed demo data
- **Graph Query Patterns**: Common Cypher queries
- **Layout Algorithms**: Explanation of each layout
- **Troubleshooting**: Common graph issues

### User Documentation

- **Network Map Guide**: "How to Use the Relationship Graph"
- **Finding Warm Intros**: "Discover Connection Paths"
- **Graph Legend**: "Understanding Node Colors and Relationships"
- **FAQ**: Common questions

---

## Post-Launch Review

### Success Criteria

- ✅ Graph loads in <3 seconds for 50+ nodes
- ✅ 60%+ of RMs use network map at least once per week
- ✅ Intro path accuracy >90% (based on RM feedback)
- ✅ User satisfaction score >4.0/5.0

### Retrospective Items

- **Lessons Learned**: Neo4j query optimization, layout challenges
- **Process Improvements**: Better demo data creation
- **Technical Debt**: Refactor layout algorithms for better performance

### Future Enhancements

- **3D Graph View**: For complex networks
- **Timeline View**: See network evolution over time
- **AI-Powered Insights**: Automatic pattern detection
- **Export Graph**: Download as image or PDF
- **Collaborative Annotations**: RMs can add notes to relationships

---

## Sign-off

**Created by**: AI Implementation Planner
**Date**: 2025-12-19
**Version**: 1.0
**Status**: Ready for Review

**Approval Required From**:

- [ ] Product Manager (business requirements)
- [ ] Tech Lead (architecture review)
- [ ] Data Team (Neo4j setup and demo data)
- [ ] RM Representatives (warm intro accuracy validation)

---

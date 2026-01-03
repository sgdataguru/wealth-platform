/**
 * @file types/graph.ts
 * @description Type definitions for relationship graph visualization
 * @module types/graph
 */

// Node types in the graph
export type NodeType = 
  | 'person' 
  | 'company' 
  | 'liquidity_event' 
  | 'network' 
  | 'rm'
  | 'family_office'
  | 'holding_company'
  | 'advisor';

// Edge/Relationship types
export type EdgeType = 
  | 'promoter_of'
  | 'director_of'
  | 'investor_in'
  | 'member_of'
  | 'knows'
  | 'affects'
  | 'involves'
  | 'manages'
  | 'connected_to'
  | 'advises'
  | 'controls'
  | 'family_of';

// Graph layout algorithm types
export type GraphLayout = 
  | 'force-directed'
  | 'circular'
  | 'radial';

// Graph node representation
export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  properties: Record<string, unknown>;
  position?: { x: number; y: number };
  metadata?: {
    clientId?: string;
    companyId?: string;
    eventId?: string;
    networkId?: string;
  };
  conversations?: ConversationHistory[]; // Conversation history for person nodes
}

// Conversation history for relationship context
export interface ConversationHistory {
  id: string;
  date: string;
  type: 'meeting' | 'call' | 'email' | 'event';
  summary: string;
  outcome?: string;
  nextSteps?: string;
}

// Graph edge/relationship representation
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label: string;
  properties?: Record<string, unknown>;
  strength?: 'primary' | 'secondary'; // Connection strength for visual distinction
}

// Warm introduction path
export interface IntroPath {
  sourceId: string;
  targetId: string;
  path: GraphNode[];
  relationships: GraphEdge[];
  strength: number;        // 0-100
  hops: number;
  suggestion?: string;
}

// Graph filters
export interface GraphFilters {
  nodeTypes: NodeType[];
  sectors?: string[];
  relationshipTypes?: EdgeType[];
  minWealth?: number;
  onlyClients?: boolean;
}

// Viewport state for graph canvas
export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

// Complete graph state
export interface GraphState {
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

// API Request/Response types
export interface GetGraphRequest {
  rmId: string;
  filters?: GraphFilters;
  depth?: number;
}

export interface GraphResponse {
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

export interface FindIntroPathRequest {
  rmId: string;
  targetPersonId: string;
  maxHops?: number;
  preferredTypes?: EdgeType[];
}

export interface IntroPathResponse {
  success: boolean;
  data: {
    paths: IntroPath[];
    recommended: IntroPath;
  };
}

// Node styling configuration
export interface NodeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  radius: number;
  icon?: string;
}

// Edge styling configuration
export interface EdgeStyle {
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
}

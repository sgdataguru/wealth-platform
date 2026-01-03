/**
 * @file lib/utils/graph-helpers.ts
 * @description Utility functions for graph operations and layout
 */

import type { GraphNode, GraphEdge, NodeStyle, EdgeStyle, NodeType, EdgeType } from '@/types/graph';
import { formatAEDAmount, formatMillionsAsUSD } from './currency';

/**
 * Get style configuration for node based on type
 */
export function getNodeStyle(nodeType: NodeType): NodeStyle {
  const styles: Record<NodeType, NodeStyle> = {
    person: {
      fill: '#1E3A5F',      // Royal blue
      stroke: '#0A1628',    // Deep navy
      strokeWidth: 2,
      radius: 32,
      icon: 'person'
    },
    company: {
      fill: '#C9A227',      // Gold
      stroke: '#A68519',    // Darker gold
      strokeWidth: 2,
      radius: 36,
      icon: 'company'
    },
    liquidity_event: {
      fill: '#DC3545',      // Red
      stroke: '#C82333',    // Darker red
      strokeWidth: 2,
      radius: 28,
      icon: 'event'
    },
    network: {
      fill: '#28A745',      // Green
      stroke: '#218838',    // Darker green
      strokeWidth: 2,
      radius: 30,
      icon: 'network'
    },
    rm: {
      fill: '#0A1628',      // Deep navy
      stroke: '#C9A227',    // Gold border
      strokeWidth: 3,
      radius: 40,
      icon: 'rm'
    }
  };

  return styles[nodeType];
}

/**
 * Get style configuration for edge based on type
 */
export function getEdgeStyle(edgeType: EdgeType): EdgeStyle {
  const styles: Record<EdgeType, EdgeStyle> = {
    manages: {
      stroke: '#0A1628',      // Dark navy - strong connection
      strokeWidth: 3
    },
    promoter_of: {
      stroke: '#C9A227',      // Gold - ownership
      strokeWidth: 2.5
    },
    director_of: {
      stroke: '#5A6C7D',      // Slate - formal role
      strokeWidth: 2
    },
    investor_in: {
      stroke: '#C9A227',      // Gold - financial
      strokeWidth: 2,
      strokeDasharray: '5,3'
    },
    member_of: {
      stroke: '#8E99A4',      // Muted - association
      strokeWidth: 1.5
    },
    knows: {
      stroke: '#E1E5EB',      // Light gray - personal
      strokeWidth: 1.5
    },
    affects: {
      stroke: '#DC3545',      // Red - impact
      strokeWidth: 2,
      strokeDasharray: '8,4'
    },
    involves: {
      stroke: '#DC3545',      // Red - involvement
      strokeWidth: 2
    },
    connected_to: {
      stroke: '#1E3A5F',      // Royal blue
      strokeWidth: 2
    }
  };

  return styles[edgeType];
}

/**
 * Apply force-directed layout algorithm to nodes
 */
export function applyForceDirectedLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  width: number,
  height: number
): GraphNode[] {
  // Simple force-directed simulation
  const iterations = 50;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Initialize positions randomly in a circle
  const positioned = nodes.map((node, idx) => {
    const angle = (idx / nodes.length) * 2 * Math.PI;
    const radius = Math.min(width, height) * 0.3;
    
    return {
      ...node,
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    };
  });

  // Build adjacency list
  const adjacency = new Map<string, string[]>();
  edges.forEach(edge => {
    if (!adjacency.has(edge.source)) adjacency.set(edge.source, []);
    if (!adjacency.has(edge.target)) adjacency.set(edge.target, []);
    adjacency.get(edge.source)!.push(edge.target);
    adjacency.get(edge.target)!.push(edge.source);
  });

  // Simulate forces
  for (let iter = 0; iter < iterations; iter++) {
    const forces = new Map<string, { x: number; y: number }>();
    
    // Initialize forces
    positioned.forEach(node => {
      forces.set(node.id, { x: 0, y: 0 });
    });

    // Repulsion between all nodes
    for (let i = 0; i < positioned.length; i++) {
      for (let j = i + 1; j < positioned.length; j++) {
        const nodeA = positioned[i];
        const nodeB = positioned[j];
        
        const dx = nodeB.position!.x - nodeA.position!.x;
        const dy = nodeB.position!.y - nodeA.position!.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        
        const repulsion = 1000 / (distance * distance);
        const fx = (dx / distance) * repulsion;
        const fy = (dy / distance) * repulsion;
        
        const forceA = forces.get(nodeA.id)!;
        const forceB = forces.get(nodeB.id)!;
        
        forceA.x -= fx;
        forceA.y -= fy;
        forceB.x += fx;
        forceB.y += fy;
      }
    }

    // Attraction between connected nodes
    edges.forEach(edge => {
      const sourceNode = positioned.find(n => n.id === edge.source);
      const targetNode = positioned.find(n => n.id === edge.target);
      
      if (!sourceNode || !targetNode) return;
      
      const dx = targetNode.position!.x - sourceNode.position!.x;
      const dy = targetNode.position!.y - sourceNode.position!.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      
      const attraction = distance / 200;
      const fx = (dx / distance) * attraction;
      const fy = (dy / distance) * attraction;
      
      const forceSource = forces.get(sourceNode.id)!;
      const forceTarget = forces.get(targetNode.id)!;
      
      forceSource.x += fx;
      forceSource.y += fy;
      forceTarget.x -= fx;
      forceTarget.y -= fy;
    });

    // Apply forces
    positioned.forEach(node => {
      const force = forces.get(node.id)!;
      const damping = 0.5;
      
      node.position!.x += force.x * damping;
      node.position!.y += force.y * damping;
      
      // Keep within bounds with margin
      const margin = 100;
      node.position!.x = Math.max(margin, Math.min(width - margin, node.position!.x));
      node.position!.y = Math.max(margin, Math.min(height - margin, node.position!.y));
    });
  }

  return positioned;
}

/**
 * Apply circular layout algorithm
 */
export function applyCircularLayout(
  nodes: GraphNode[],
  width: number,
  height: number
): GraphNode[] {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;

  return nodes.map((node, idx) => {
    const angle = (idx / nodes.length) * 2 * Math.PI - Math.PI / 2;
    
    return {
      ...node,
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    };
  });
}

/**
 * Apply radial layout with RM at center
 */
export function applyRadialLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  width: number,
  height: number
): GraphNode[] {
  const centerX = width / 2;
  const centerY = height / 2;

  // Find RM node
  const rmNode = nodes.find(n => n.type === 'rm');
  if (!rmNode) return applyCircularLayout(nodes, width, height);

  // Calculate distances from RM (BFS)
  const distances = new Map<string, number>();
  distances.set(rmNode.id, 0);

  const queue = [rmNode.id];
  const adjacency = new Map<string, string[]>();
  
  edges.forEach(edge => {
    if (!adjacency.has(edge.source)) adjacency.set(edge.source, []);
    if (!adjacency.has(edge.target)) adjacency.set(edge.target, []);
    adjacency.get(edge.source)!.push(edge.target);
    adjacency.get(edge.target)!.push(edge.source);
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentDist = distances.get(current)!;
    
    const neighbors = adjacency.get(current) || [];
    neighbors.forEach(neighbor => {
      if (!distances.has(neighbor)) {
        distances.set(neighbor, currentDist + 1);
        queue.push(neighbor);
      }
    });
  }

  // Group nodes by distance
  const layers = new Map<number, string[]>();
  nodes.forEach(node => {
    const dist = distances.get(node.id) ?? 99;
    if (!layers.has(dist)) layers.set(dist, []);
    layers.get(dist)!.push(node.id);
  });

  // Position nodes in concentric circles
  return nodes.map(node => {
    if (node.id === rmNode.id) {
      return { ...node, position: { x: centerX, y: centerY } };
    }

    const dist = distances.get(node.id) ?? 99;
    const layer = layers.get(dist)!;
    const idx = layer.indexOf(node.id);
    const radius = Math.min(width, height) * 0.15 * dist;
    const angle = (idx / layer.length) * 2 * Math.PI - Math.PI / 2;

    return {
      ...node,
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    };
  });
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  // Heuristic: if amount looks like a raw AED value (>= 1,000,000), treat as AED
  if (Math.abs(amount) >= 1_000_000) {
    return formatAEDAmount(amount);
  }

  // Otherwise assume the number is in millions (e.g., 450 => $450 Million)
  return formatMillionsAsUSD(amount);
}

/**
 * Get icon path for node type
 */
export function getNodeIcon(nodeType: NodeType): string {
  const icons: Record<NodeType, string> = {
    person: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    company: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    liquidity_event: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    network: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    rm: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  };

  return icons[nodeType];
}

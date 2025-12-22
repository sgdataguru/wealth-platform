/**
 * @file app/api/graph/intro-paths/route.ts
 * @description API endpoint for finding warm introduction paths
 */

import { NextResponse } from 'next/server';
import { mockNodes, mockEdges } from '@/lib/mock-data/graphData';
import type { GraphEdge, IntroPath } from '@/types/graph';

/**
 * Breadth-first search to find shortest paths between two nodes
 */
function findPaths(
  sourceId: string,
  targetId: string,
  maxHops: number = 3
): IntroPath[] {
  // Build adjacency list for the graph
  const adjacencyList = new Map<string, Array<{ nodeId: string; edge: GraphEdge }>>();
  
  for (const edge of mockEdges) {
    if (!adjacencyList.has(edge.source)) {
      adjacencyList.set(edge.source, []);
    }
    if (!adjacencyList.has(edge.target)) {
      adjacencyList.set(edge.target, []);
    }
    
    adjacencyList.get(edge.source)!.push({ nodeId: edge.target, edge });
    adjacencyList.get(edge.target)!.push({ nodeId: edge.source, edge });
  }

  // BFS to find shortest paths
  const queue: Array<{
    nodeId: string;
    path: string[];
    edges: GraphEdge[];
  }> = [{ nodeId: sourceId, path: [sourceId], edges: [] }];
  
  const visited = new Set<string>();
  const foundPaths: Array<{ path: string[]; edges: GraphEdge[] }> = [];

  while (queue.length > 0 && foundPaths.length < 5) {
    const current = queue.shift()!;
    
    if (current.path.length > maxHops + 1) continue;
    
    if (current.nodeId === targetId) {
      foundPaths.push({
        path: current.path,
        edges: current.edges
      });
      continue;
    }

    if (visited.has(current.nodeId)) continue;
    visited.add(current.nodeId);

    const neighbors = adjacencyList.get(current.nodeId) || [];
    for (const { nodeId, edge } of neighbors) {
      if (!current.path.includes(nodeId)) {
        queue.push({
          nodeId,
          path: [...current.path, nodeId],
          edges: [...current.edges, edge]
        });
      }
    }
  }

  // Convert to IntroPath objects
  return foundPaths.map(({ path, edges }) => {
    const pathNodes = path.map(id => mockNodes.find(n => n.id === id)!);
    const strength = calculatePathStrength(edges, path.length - 1);

    return {
      sourceId,
      targetId,
      path: pathNodes,
      relationships: edges,
      strength,
      hops: path.length - 1
    };
  });
}

/**
 * Calculate connection strength based on path characteristics
 */
function calculatePathStrength(edges: GraphEdge[], hops: number): number {
  // Shorter paths = higher strength
  const hopPenalty = Math.pow(0.8, hops - 1);
  
  // Stronger relationship types get bonus
  const relationshipBonus = edges.reduce((acc, edge) => {
    if (edge.type === 'manages') return acc * 1.3;
    if (edge.type === 'promoter_of') return acc * 1.2;
    if (edge.type === 'director_of') return acc * 1.15;
    if (edge.type === 'investor_in') return acc * 1.1;
    if (edge.type === 'member_of') return acc * 1.05;
    const strength = edge.properties?.strength;
    if (typeof strength === 'number') return acc * strength;
    return acc;
  }, 1);

  return Math.min(100, Math.round(hopPenalty * relationshipBonus * 100));
}

/**
 * Generate human-readable suggestion for intro path
 */
function generateSuggestion(path: IntroPath): string {
  if (path.hops === 1) {
    return `You have a direct connection to ${path.path[1].label}.`;
  }
  
  const intermediates = path.path.slice(1, -1).map(n => n.label).join(', ');
  const target = path.path[path.path.length - 1].label;
  
  return `Ask ${intermediates} to introduce you to ${target}.`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rmId = 'rm-001', targetPersonId, maxHops = 3 } = body;

    // Validate target exists
    const targetNode = mockNodes.find(n => n.id === targetPersonId);
    if (!targetNode) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'TARGET_NOT_FOUND',
            message: 'Target person not found'
          }
        },
        { status: 404 }
      );
    }

    // Find paths
    const paths = findPaths(rmId, targetPersonId, maxHops);

    if (paths.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NO_PATH_FOUND',
            message: 'No connection path found'
          }
        },
        { status: 404 }
      );
    }

    // Sort by strength (descending) and hops (ascending)
    paths.sort((a, b) => {
      if (a.hops !== b.hops) return a.hops - b.hops;
      return b.strength - a.strength;
    });

    const recommended = paths[0];
    recommended.suggestion = generateSuggestion(recommended);

    return NextResponse.json({
      success: true,
      data: {
        paths,
        recommended
      }
    });
  } catch (error) {
    console.error('Error finding intro path:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CALCULATION_ERROR',
          message: 'Failed to calculate intro paths'
        }
      },
      { status: 500 }
    );
  }
}

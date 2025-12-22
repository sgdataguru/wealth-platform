/**
 * @file app/api/graph/route.ts
 * @description API endpoint for fetching relationship graph data
 */

import { NextResponse } from 'next/server';
import { mockNodes, mockEdges } from '@/lib/mock-data/graphData';
import type { NodeType } from '@/types/graph';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filters from query params
    const filterNodeTypes = searchParams.get('nodeTypes');
    const filterSectors = searchParams.get('sectors');
    const filterOnlyClients = searchParams.get('onlyClients');

    let filteredNodes = [...mockNodes];
    let filteredEdges = [...mockEdges];

    // Apply node type filter
    if (filterNodeTypes) {
      const types = filterNodeTypes.split(',') as NodeType[];
      filteredNodes = filteredNodes.filter(node => 
        node.type === 'rm' || types.includes(node.type)
      );
    }

    // Apply sector filter
    if (filterSectors && filterSectors !== 'All') {
      const sectors = filterSectors.split(',');
      filteredNodes = filteredNodes.filter(node =>
        node.type === 'rm' ||
        (() => {
          const sector = typeof node.properties.sector === 'string' ? node.properties.sector : null;
          return !sector || sectors.includes(sector);
        })()
      );
    }

    // Apply clients only filter
    if (filterOnlyClients === 'true') {
      filteredNodes = filteredNodes.filter(node => 
        node.type === 'rm' ||
        node.type !== 'person' ||
        node.properties.isClient === true
      );
    }

    // Filter edges to only include those connecting remaining nodes
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    filteredEdges = filteredEdges.filter(edge => 
      nodeIds.has(edge.source) && nodeIds.has(edge.target)
    );

    // Calculate stats
    const stats = {
      totalNodes: filteredNodes.length,
      totalEdges: filteredEdges.length,
      nodeTypeCounts: filteredNodes.reduce((acc, node) => {
        acc[node.type] = (acc[node.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return NextResponse.json({
      success: true,
      data: {
        nodes: filteredNodes,
        edges: filteredEdges,
        stats
      }
    });
  } catch (error) {
    console.error('Error fetching graph data:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch graph data'
        }
      },
      { status: 500 }
    );
  }
}

/**
 * @file app/(dashboard)/network/page.tsx
 * @description Network map page with interactive relationship graph
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import NetworkGraph from './components/NetworkGraph';
import GraphControls from './components/GraphControls';
import GraphLegend from './components/GraphLegend';
import FilterSidebar from './components/FilterSidebar';
import NodeDetailsPanel from './components/NodeDetailsPanel';
import IntroPathFinder from './components/IntroPathFinder';
import Header from '@/app/components/layout/Header';
import Sidebar from '@/app/components/layout/Sidebar';
import type {
  GraphNode,
  GraphEdge,
  GraphFilters,
  GraphLayout,
  Viewport,
  IntroPath
} from '@/types/graph';
import {
  applyForceDirectedLayout,
  applyCircularLayout,
  applyRadialLayout
} from '@/lib/utils/graph-helpers';

export default function NetworkPage() {
  // State
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);

  const [filters, setFilters] = useState<GraphFilters>({
    nodeTypes: [],
    sectors: [],
    onlyClients: false
  });

  const [layout, setLayout] = useState<GraphLayout>('force-directed');
  const [viewport, setViewport] = useState<Viewport>({
    x: 0,
    y: 0,
    zoom: 1
  });

  const [introPath, setIntroPath] = useState<IntroPath | null>(null);
  const [isCalculatingPath, setIsCalculatingPath] = useState(false);

  const [stats, setStats] = useState({
    totalNodes: 0,
    totalEdges: 0,
    nodeTypeCounts: {} as Record<string, number>
  });

  // Canvas dimensions - account for sidebar
  const canvasWidth = typeof window !== 'undefined' ? window.innerWidth - 256 - 256 : 1200;
  const canvasHeight = typeof window !== 'undefined' ? window.innerHeight - 64 : 800;

  // Fetch graph data
  useEffect(() => {
    async function fetchGraphData() {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          rmId: 'rm-001',
          ...(filters.nodeTypes.length > 0 && { nodeTypes: filters.nodeTypes.join(',') }),
          ...(filters.sectors && filters.sectors.length > 0 && { sectors: filters.sectors.join(',') }),
          ...(filters.onlyClients && { onlyClients: 'true' })
        });

        const response = await fetch(`/api/graph?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch graph data');
        }

        const data = await response.json();
        if (data.success) {
          setNodes(data.data.nodes);
          setEdges(data.data.edges);
          setStats(data.data.stats);
        } else {
          throw new Error(data.error?.message || 'Unknown error');
        }
      } catch (err) {
        console.error('Error fetching graph:', err);
        setError(err instanceof Error ? err.message : 'Failed to load graph');
      } finally {
        setIsLoading(false);
      }
    }

    fetchGraphData();
  }, [filters]);

  // Apply layout algorithm
  const layoutedNodes = useMemo(() => {
    if (nodes.length === 0) return [];

    switch (layout) {
      case 'force-directed':
        return applyForceDirectedLayout(nodes, edges, canvasWidth, canvasHeight);
      case 'radial':
        return applyRadialLayout(nodes, edges, canvasWidth, canvasHeight);
      case 'circular':
        return applyCircularLayout(nodes, canvasWidth, canvasHeight);
      default:
        return applyForceDirectedLayout(nodes, edges, canvasWidth, canvasHeight);
    }
  }, [nodes, edges, layout, canvasWidth, canvasHeight]);

  // Reset viewport when layout changes
  useEffect(() => {
    setViewport({
      x: 0,
      y: 0,
      zoom: 1
    });
  }, [layout]);

  // Handle node click
  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);

    // Highlight connected nodes
    const connectedIds = new Set<string>([nodeId]);
    edges.forEach(edge => {
      if (edge.source === nodeId) connectedIds.add(edge.target);
      if (edge.target === nodeId) connectedIds.add(edge.source);
    });

    setHighlightedNodeIds(Array.from(connectedIds));
  }, [edges]);

  // Handle node double click (navigate to detail page)
  const handleNodeDoubleClick = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node?.type === 'person' && node.metadata?.clientId) {
      window.location.href = `/prospects/${node.metadata.clientId}`;
    }
  }, [nodes]);

  // Handle finding intro path
  const handleFindIntro = useCallback(async (targetId: string) => {
    setIsCalculatingPath(true);
    setIntroPath(null);

    try {
      const response = await fetch('/api/graph/intro-paths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rmId: 'rm-001',
          targetPersonId: targetId,
          maxHops: 3
        })
      });

      const data = await response.json();
      if (data.success) {
        setIntroPath(data.data.recommended);

        // Highlight path nodes
        const pathNodeIds = data.data.recommended.path.map((n: GraphNode) => n.id);
        setHighlightedNodeIds(pathNodeIds);
      } else {
        alert(data.error?.message || 'Failed to find intro path');
      }
    } catch (err) {
      console.error('Error finding intro path:', err);
      alert('Failed to calculate intro path');
    } finally {
      setIsCalculatingPath(false);
    }
  }, []);

  // Handle clearing intro path
  const handleClearPath = useCallback(() => {
    setIntroPath(null);
    setHighlightedNodeIds([]);
  }, []);

  // Handle closing node details
  const handleCloseDetails = useCallback(() => {
    setSelectedNodeId(null);
    setHighlightedNodeIds([]);
  }, []);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setViewport(prev => ({
      ...prev,
      zoom: Math.min(3, prev.zoom + 0.2)
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setViewport(prev => ({
      ...prev,
      zoom: Math.max(0.3, prev.zoom - 0.2)
    }));
  }, []);

  const handleResetView = useCallback(() => {
    setViewport({ x: 0, y: 0, zoom: 1 });
  }, []);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: Partial<GraphFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Get selected node
  const selectedNode = useMemo(() => {
    return selectedNodeId ? nodes.find(n => n.id === selectedNodeId) || null : null;
  }, [selectedNodeId, nodes]);

  // Get people for intro finder
  const people = useMemo(() => {
    return layoutedNodes.filter(n => n.type === 'person');
  }, [layoutedNodes]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex h-[calc(100vh-64px)]">
          <Sidebar activePage="network" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#0A1628]"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <Sidebar activePage="network" />

        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          stats={stats}
        />

        {/* Main Graph Area */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A5F] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading relationship graph...</p>
              </div>
            </div>
          ) : (
            <>
              <NetworkGraph
                nodes={layoutedNodes}
                edges={edges}
                selectedNodeId={selectedNodeId}
                highlightedNodeIds={highlightedNodeIds}
                onNodeClick={handleNodeClick}
                onNodeDoubleClick={handleNodeDoubleClick}
                viewport={viewport}
                onViewportChange={setViewport}
                width={canvasWidth}
                height={canvasHeight}
              />

              {/* Overlay Components */}
              <IntroPathFinder
                people={people}
                introPath={introPath}
                isCalculating={isCalculatingPath}
                onFindPath={handleFindIntro}
                onClearPath={handleClearPath}
              />

              <GraphControls
                layout={layout}
                onLayoutChange={setLayout}
                viewport={viewport}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetView={handleResetView}
              />

              <GraphLegend />

              {selectedNode && !introPath && (
                <NodeDetailsPanel
                  node={selectedNode}
                  onClose={handleCloseDetails}
                  onFindIntro={handleFindIntro}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

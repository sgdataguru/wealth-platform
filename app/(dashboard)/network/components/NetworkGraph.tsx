/**
 * @file app/(dashboard)/network/components/NetworkGraph.tsx
 * @description Main SVG-based graph visualization component
 */

'use client';

import { useState, useRef } from 'react';
import type { GraphNode, GraphEdge, Viewport } from '@/types/graph';
import { getNodeStyle, getEdgeStyle, getNodeIcon } from '@/lib/utils/graph-helpers';

interface NetworkGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  highlightedNodeIds: string[];
  onNodeClick: (nodeId: string) => void;
  onNodeDoubleClick?: (nodeId: string) => void;
  viewport: Viewport;
  onViewportChange: (viewport: Viewport) => void;
  width: number;
  height: number;
}

export default function NetworkGraph({
  nodes,
  edges,
  selectedNodeId,
  highlightedNodeIds,
  onNodeClick,
  onNodeDoubleClick,
  viewport,
  onViewportChange,
  width,
  height
}: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Handle mouse down for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as Element).classList.contains('canvas-bg')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
    }
  };

  // Handle mouse move for panning
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      onViewportChange({
        ...viewport,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle wheel for zooming
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newZoom = Math.max(0.3, Math.min(3, viewport.zoom + delta));
    
    // Zoom towards mouse cursor
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const zoomRatio = newZoom / viewport.zoom;
      const newX = mouseX - (mouseX - viewport.x) * zoomRatio;
      const newY = mouseY - (mouseY - viewport.y) * zoomRatio;
      
      onViewportChange({
        x: newX,
        y: newY,
        zoom: newZoom
      });
    }
  };

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="border border-gray-200 bg-white cursor-move"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <rect
        className="canvas-bg"
        width={width}
        height={height}
        fill="#FFFFFF"
      />
      
      <g transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.zoom})`}>
        {/* Render edges */}
        <g className="edges">
          {edges.map(edge => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            
            if (!sourceNode?.position || !targetNode?.position) return null;
            
            const style = getEdgeStyle(edge.type);
            const isHighlighted = highlightedNodeIds.includes(edge.source) && 
                                 highlightedNodeIds.includes(edge.target);
            
            return (
              <g key={edge.id} className="edge">
                <line
                  x1={sourceNode.position.x}
                  y1={sourceNode.position.y}
                  x2={targetNode.position.x}
                  y2={targetNode.position.y}
                  stroke={isHighlighted ? '#28A745' : style.stroke}
                  strokeWidth={isHighlighted ? style.strokeWidth * 1.5 : style.strokeWidth}
                  strokeDasharray={style.strokeDasharray}
                  opacity={isHighlighted ? 1 : 0.6}
                />
                {/* Edge label */}
                <text
                  x={(sourceNode.position.x + targetNode.position.x) / 2}
                  y={(sourceNode.position.y + targetNode.position.y) / 2}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#5A6C7D"
                  opacity={hoveredNodeId === edge.source || hoveredNodeId === edge.target ? 1 : 0}
                  className="pointer-events-none"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Render nodes */}
        <g className="nodes">
          {nodes.map(node => {
            if (!node.position) return null;
            
            const style = getNodeStyle(node.type);
            const isSelected = selectedNodeId === node.id;
            const isHighlighted = highlightedNodeIds.includes(node.id);
            const isHovered = hoveredNodeId === node.id;
            
            const radius = style.radius;
            const fillColor = isSelected ? '#E85D54' : style.fill;
            const strokeColor = isSelected ? '#E85D54' : style.stroke;
            const strokeWidth = isSelected ? 4 : style.strokeWidth;
            
            return (
              <g
                key={node.id}
                className="node cursor-pointer"
                transform={`translate(${node.position.x}, ${node.position.y})`}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onNodeClick(node.id);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onNodeDoubleClick?.(node.id);
                }}
              >
                {/* Node circle */}
                <circle
                  r={radius}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  opacity={isHighlighted || isSelected || isHovered ? 1 : 0.9}
                  className="transition-all"
                />
                
                {/* Node icon */}
                <g transform={`translate(-12, -12)`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d={getNodeIcon(node.type)}
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </g>

                {/* Node label */}
                <text
                  y={radius + 16}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="#1A1A2E"
                  className="pointer-events-none"
                >
                  {node.label}
                </text>
                
                {/* Node sublabel (designation/role) */}
                {node.properties.designation && (
                  <text
                    y={radius + 30}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#5A6C7D"
                    className="pointer-events-none"
                  >
                    {node.properties.designation}
                  </text>
                )}

                {/* Selection ring */}
                {isSelected && (
                  <circle
                    r={radius + 6}
                    fill="none"
                    stroke="#E85D54"
                    strokeWidth="2"
                    opacity="0.3"
                  />
                )}

                {/* Hover ring */}
                {isHovered && !isSelected && (
                  <circle
                    r={radius + 4}
                    fill="none"
                    stroke="#2A2447"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                )}
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
}

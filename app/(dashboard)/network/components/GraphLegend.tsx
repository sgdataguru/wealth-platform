/**
 * @file app/(dashboard)/network/components/GraphLegend.tsx
 * @description Legend explaining node and edge types in the graph
 */

'use client';

import { getNodeStyle, getEdgeStyle } from '@/lib/utils/graph-helpers';
import type { NodeType, EdgeType } from '@/types/graph';

export default function GraphLegend() {
  const nodeTypes: Array<{ type: NodeType; label: string }> = [
    { type: 'rm', label: 'Relationship Manager' },
    { type: 'person', label: 'People (Clients/Prospects)' },
    { type: 'company', label: 'Companies' },
    { type: 'liquidity_event', label: 'Liquidity Events' },
    { type: 'network', label: 'Networks/Clubs' }
  ];

  const edgeTypes: Array<{ type: EdgeType; label: string }> = [
    { type: 'manages', label: 'Manages' },
    { type: 'promoter_of', label: 'Promoter' },
    { type: 'director_of', label: 'Director' },
    { type: 'investor_in', label: 'Investor' },
    { type: 'member_of', label: 'Member' },
    { type: 'knows', label: 'Knows' },
    { type: 'affects', label: 'Affects' },
    { type: 'involves', label: 'Involves' }
  ];

  return (
    <div className="absolute bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-sm p-4 max-w-xs">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Legend</h3>
      
      {/* Node Types */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Node Types</h4>
        <div className="space-y-2">
          {nodeTypes.map(({ type, label }) => {
            const style = getNodeStyle(type);
            return (
              <div key={type} className="flex items-center gap-2">
                <svg width="20" height="20">
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill={style.fill}
                    stroke={style.stroke}
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="text-xs text-gray-700">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edge Types */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Relationships</h4>
        <div className="space-y-2">
          {edgeTypes.map(({ type, label }) => {
            const style = getEdgeStyle(type);
            return (
              <div key={type} className="flex items-center gap-2">
                <svg width="30" height="10">
                  <line
                    x1="0"
                    y1="5"
                    x2="30"
                    y2="5"
                    stroke={style.stroke}
                    strokeWidth={style.strokeWidth}
                    strokeDasharray={style.strokeDasharray}
                  />
                </svg>
                <span className="text-xs text-gray-700">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

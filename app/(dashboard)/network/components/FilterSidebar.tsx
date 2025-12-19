/**
 * @file app/(dashboard)/network/components/FilterSidebar.tsx
 * @description Sidebar with filters for the graph visualization
 */

'use client';

import type { GraphFilters, NodeType } from '@/types/graph';

interface FilterSidebarProps {
  filters: GraphFilters;
  onFiltersChange: (filters: Partial<GraphFilters>) => void;
  stats: {
    totalNodes: number;
    totalEdges: number;
    nodeTypeCounts: Record<string, number>;
  };
}

export default function FilterSidebar({ filters, onFiltersChange, stats }: FilterSidebarProps) {
  const nodeTypeOptions: Array<{ value: NodeType; label: string }> = [
    { value: 'person', label: 'People' },
    { value: 'company', label: 'Companies' },
    { value: 'liquidity_event', label: 'Liquidity Events' },
    { value: 'network', label: 'Networks' }
  ];

  const sectorOptions = [
    'All',
    'Fintech',
    'E-commerce',
    'Renewable Energy',
    'Healthcare',
    'Technology'
  ];

  const toggleNodeType = (type: NodeType) => {
    const current = filters.nodeTypes || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    
    onFiltersChange({ nodeTypes: updated });
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      {/* Stats */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Graph Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Nodes</span>
            <span className="font-semibold text-gray-900">{stats.totalNodes}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Edges</span>
            <span className="font-semibold text-gray-900">{stats.totalEdges}</span>
          </div>
        </div>
      </div>

      {/* Node Type Filters */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Node Types</h3>
        <div className="space-y-2">
          {nodeTypeOptions.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.nodeTypes.length === 0 || filters.nodeTypes.includes(value)}
                onChange={() => toggleNodeType(value)}
                className="w-4 h-4 text-[#1E3A5F] border-gray-300 rounded focus:ring-[#1E3A5F]"
              />
              <span className="text-sm text-gray-700">{label}</span>
              <span className="ml-auto text-xs text-gray-500">
                ({stats.nodeTypeCounts[value] || 0})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sector Filter */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Sector</h3>
        <select
          value={filters.sectors?.[0] || 'All'}
          onChange={(e) => {
            const sector = e.target.value;
            onFiltersChange({
              sectors: sector === 'All' ? [] : [sector]
            });
          }}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#1E3A5F]"
        >
          {sectorOptions.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>
      </div>

      {/* Clients Only Filter */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onlyClients || false}
            onChange={(e) => onFiltersChange({ onlyClients: e.target.checked })}
            className="w-4 h-4 text-[#1E3A5F] border-gray-300 rounded focus:ring-[#1E3A5F]"
          />
          <span className="text-sm text-gray-700">Show Clients Only</span>
        </label>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => onFiltersChange({
          nodeTypes: [],
          sectors: [],
          onlyClients: false
        })}
        className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
}

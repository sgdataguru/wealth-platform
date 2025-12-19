/**
 * @file app/(dashboard)/network/components/GraphControls.tsx
 * @description Controls for graph zoom, pan, and layout selection
 */

'use client';

import type { GraphLayout, Viewport } from '@/types/graph';

interface GraphControlsProps {
  layout: GraphLayout;
  onLayoutChange: (layout: GraphLayout) => void;
  viewport: Viewport;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

export default function GraphControls({
  layout,
  onLayoutChange,
  viewport,
  onZoomIn,
  onZoomOut,
  onResetView
}: GraphControlsProps) {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2">
      {/* Zoom Controls */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <button
          onClick={onZoomIn}
          className="p-2 hover:bg-gray-50 border-b border-gray-200 rounded-t-lg transition-colors"
          title="Zoom In"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        
        <div className="px-3 py-2 text-xs font-medium text-gray-600 border-b border-gray-200">
          {Math.round(viewport.zoom * 100)}%
        </div>
        
        <button
          onClick={onZoomOut}
          className="p-2 hover:bg-gray-50 border-b border-gray-200 transition-colors"
          title="Zoom Out"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        
        <button
          onClick={onResetView}
          className="p-2 hover:bg-gray-50 rounded-b-lg transition-colors"
          title="Reset View"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      {/* Layout Selector */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-2">
        <div className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">Layout</div>
        
        <button
          onClick={() => onLayoutChange('force-directed')}
          className={`w-full px-3 py-2 text-sm rounded transition-colors mb-1 ${
            layout === 'force-directed'
              ? 'bg-[#0A1628] text-white'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Force
        </button>
        
        <button
          onClick={() => onLayoutChange('radial')}
          className={`w-full px-3 py-2 text-sm rounded transition-colors mb-1 ${
            layout === 'radial'
              ? 'bg-[#0A1628] text-white'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Radial
        </button>
        
        <button
          onClick={() => onLayoutChange('circular')}
          className={`w-full px-3 py-2 text-sm rounded transition-colors ${
            layout === 'circular'
              ? 'bg-[#0A1628] text-white'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Circular
        </button>
      </div>
    </div>
  );
}

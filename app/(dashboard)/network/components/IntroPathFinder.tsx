/**
 * @file app/(dashboard)/network/components/IntroPathFinder.tsx
 * @description Component for finding warm introduction paths
 */

'use client';

import { useState } from 'react';
import type { GraphNode, IntroPath } from '@/types/graph';

interface IntroPathFinderProps {
  people: GraphNode[];
  introPath: IntroPath | null;
  isCalculating: boolean;
  onFindPath: (targetId: string) => void;
  onClearPath: () => void;
}

export default function IntroPathFinder({
  people,
  introPath,
  isCalculating,
  onFindPath,
  onClearPath
}: IntroPathFinderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter people (non-clients only)
  const prospects = people.filter(p => 
    p.type === 'person' && 
    !p.properties.isClient &&
    p.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPerson = (personId: string) => {
    onFindPath(personId);
    setSearchQuery('');
    setIsOpen(false);
  };

  return (
    <div className="absolute top-4 left-4 w-80">
      {/* Trigger Button */}
      {!introPath && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#2A2447]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Find Warm Intro</span>
          </div>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {/* Dropdown Panel */}
      {isOpen && !introPath && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Target Person</h3>
          
          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prospects..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#2A2447] mb-3"
          />

          {/* People List */}
          <div className="max-h-60 overflow-y-auto space-y-1">
            {prospects.length > 0 ? (
              prospects.map(person => (
                <button
                  key={person.id}
                  onClick={() => handleSelectPerson(person.id)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">{person.label}</div>
                  <div className="text-xs text-gray-500">{person.properties.designation}</div>
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                {searchQuery ? 'No prospects found' : 'No prospects available'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Path Result */}
      {introPath && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Warm Intro Path</h3>
            <button
              onClick={onClearPath}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Path Strength */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">Connection Strength</span>
              <span className="font-semibold text-gray-900">{introPath.strength}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#28A745] h-2 rounded-full transition-all"
                style={{ width: `${introPath.strength}%` }}
              />
            </div>
          </div>

          {/* Path Nodes */}
          <div className="space-y-2 mb-3">
            {introPath.path.map((node, idx) => (
              <div key={node.id}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                    idx === 0 ? 'bg-[#1A1332] text-white' : 
                    idx === introPath.path.length - 1 ? 'bg-[#DC3545] text-white' :
                    'bg-[#2A2447] text-white'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{node.label}</div>
                    <div className="text-xs text-gray-500">
                      {node.properties.designation || node.properties.role}
                    </div>
                  </div>
                </div>
                
                {idx < introPath.path.length - 1 && (
                  <div className="ml-4 pl-4 border-l-2 border-gray-200 py-1">
                    <div className="text-xs text-gray-500">
                      {introPath.relationships[idx]?.label}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Suggestion */}
          {introPath.suggestion && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-2">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-blue-800">{introPath.suggestion}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isCalculating && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2A2447]"></div>
            <span className="text-sm text-gray-600">Finding path...</span>
          </div>
        </div>
      )}
    </div>
  );
}

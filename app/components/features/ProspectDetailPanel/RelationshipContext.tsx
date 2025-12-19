/**
 * @file RelationshipContext.tsx
 * @description Network connections and warm intro opportunities
 */

'use client';

import type { Connection } from '@/types';

interface RelationshipContextProps {
  connections: Connection[];
}

export default function RelationshipContext({ connections }: RelationshipContextProps) {
  if (connections.length === 0) {
    return null;
  }

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-[#28A745]';
    if (strength >= 60) return 'text-[#FFC107]';
    return 'text-[#8E99A4]';
  };

  return (
    <div className="border-b border-[#E5E4E2] pb-6">
      <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">
        Key Connections ({connections.length})
      </h3>

      <div className="space-y-3">
        {connections.map((connection) => (
          <div
            key={connection.id}
            className="bg-[#F8F9FA] rounded-lg p-3 hover:bg-[#EFF1F3] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-[#1A1A2E]">
                  {connection.name}
                </h4>
                <p className="text-xs text-[#5A6C7D] mt-1">
                  {connection.relationship}
                  {connection.company && ` • ${connection.company}`}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${getStrengthColor(connection.strength)}`}>
                  {connection.strength}
                </span>
                
                {connection.canIntroduce && (
                  <span className="px-2 py-1 bg-[#D4EDDA] text-[#28A745] text-xs font-medium rounded">
                    Warm Intro
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * @file app/(dashboard)/network/components/NodeDetailsPanel.tsx
 * @description Panel showing details of selected graph node
 */

'use client';

import type { GraphNode } from '@/types/graph';
import { formatCurrency } from '@/lib/utils/graph-helpers';

interface NodeDetailsPanelProps {
  node: GraphNode | null;
  onClose: () => void;
  onFindIntro?: (nodeId: string) => void;
}

export default function NodeDetailsPanel({ node, onClose, onFindIntro }: NodeDetailsPanelProps) {
  if (!node) return null;

  const renderNodeDetails = () => {
    switch (node.type) {
      case 'person':
        return (
          <>
            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium text-gray-500">Designation</span>
                <p className="text-sm text-gray-900">{node.properties.designation || 'N/A'}</p>
              </div>
              
              {node.properties.netWorth && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Net Worth</span>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(node.properties.netWorth)}
                  </p>
                </div>
              )}
              
              {node.properties.sector && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Sector</span>
                  <p className="text-sm text-gray-900">{node.properties.sector}</p>
                </div>
              )}
              
              <div>
                <span className="text-xs font-medium text-gray-500">Status</span>
                <div className="flex gap-2 mt-1">
                  {node.properties.isClient && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Client
                    </span>
                  )}
                  {node.properties.isInfluencer && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Influencer
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!node.properties.isClient && onFindIntro && (
              <button
                onClick={() => onFindIntro(node.id)}
                className="mt-4 w-full px-4 py-2 bg-[#E85D54] text-white text-sm font-medium rounded hover:bg-[#C73E36] transition-colors"
              >
                Find Intro Path
              </button>
            )}
          </>
        );

      case 'company':
        return (
          <div className="space-y-2">
            <div>
              <span className="text-xs font-medium text-gray-500">CIN</span>
              <p className="text-sm text-gray-900 font-mono">{node.properties.cin || 'N/A'}</p>
            </div>
            
            {node.properties.sector && (
              <div>
                <span className="text-xs font-medium text-gray-500">Sector</span>
                <p className="text-sm text-gray-900">{node.properties.sector}</p>
              </div>
            )}
            
            {node.properties.valuation && (
              <div>
                <span className="text-xs font-medium text-gray-500">Valuation</span>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(node.properties.valuation)}
                </p>
              </div>
            )}
            
            {node.properties.founded && (
              <div>
                <span className="text-xs font-medium text-gray-500">Founded</span>
                <p className="text-sm text-gray-900">{node.properties.founded}</p>
              </div>
            )}
          </div>
        );

      case 'liquidity_event':
        return (
          <div className="space-y-2">
            <div>
              <span className="text-xs font-medium text-gray-500">Type</span>
              <p className="text-sm text-gray-900 capitalize">
                {node.properties.type?.replace(/_/g, ' ') || 'N/A'}
              </p>
            </div>
            
            {node.properties.amount && (
              <div>
                <span className="text-xs font-medium text-gray-500">Amount</span>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(node.properties.amount)}
                </p>
              </div>
            )}
            
            {node.properties.date && (
              <div>
                <span className="text-xs font-medium text-gray-500">Date</span>
                <p className="text-sm text-gray-900">{node.properties.date}</p>
              </div>
            )}
            
            {node.properties.source && (
              <div>
                <span className="text-xs font-medium text-gray-500">Source</span>
                <p className="text-sm text-gray-900">{node.properties.source}</p>
              </div>
            )}
          </div>
        );

      case 'network':
        return (
          <div className="space-y-2">
            <div>
              <span className="text-xs font-medium text-gray-500">Type</span>
              <p className="text-sm text-gray-900 capitalize">
                {node.properties.type?.replace(/_/g, ' ') || 'N/A'}
              </p>
            </div>
            
            {node.properties.memberCount && (
              <div>
                <span className="text-xs font-medium text-gray-500">Members</span>
                <p className="text-sm text-gray-900">{node.properties.memberCount}</p>
              </div>
            )}
          </div>
        );

      case 'rm':
        return (
          <div className="space-y-2">
            {node.properties.email && (
              <div>
                <span className="text-xs font-medium text-gray-500">Email</span>
                <p className="text-sm text-gray-900">{node.properties.email}</p>
              </div>
            )}
            
            {node.properties.role && (
              <div>
                <span className="text-xs font-medium text-gray-500">Role</span>
                <p className="text-sm text-gray-900">{node.properties.role}</p>
              </div>
            )}
          </div>
        );

      default:
        return <p className="text-sm text-gray-500">No details available</p>;
    }
  };

  return (
    <div className="absolute bottom-4 right-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{node.label}</h3>
          <span className="text-xs font-medium text-gray-500 uppercase">
            {node.type.replace(/_/g, ' ')}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Details */}
      <div className="p-4">
        {renderNodeDetails()}
      </div>
    </div>
  );
}

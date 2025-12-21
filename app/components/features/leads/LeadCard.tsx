/**
 * @file LeadCard.tsx
 * @description Card component for displaying lead information
 */

'use client';

import { Card } from '@/app/components/ui';
import StatusPill from '@/app/components/ui/StatusPill';
import type { Lead } from '@/types';

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
}

export default function LeadCard({ lead, onClick }: LeadCardProps) {
  const initials = `${lead.firstName.charAt(0)}${lead.lastName.charAt(0)}`.toUpperCase();

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  return (
    <Card 
      padding="md" 
      hover={true}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Avatar and Info */}
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-[#1A1332] text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {initials}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-[#1A1A2E] truncate">
                {lead.firstName} {lead.lastName}
              </h3>
              <StatusPill status={lead.status} />
            </div>
            
            <p className="text-sm text-[#5A6C7D] truncate">{lead.title}</p>
            <p className="text-sm text-[#5A6C7D] truncate">{lead.company}</p>
            
            <div className="flex items-center gap-4 mt-2 text-xs text-[#8E99A4]">
              <span>{lead.location}</span>
              <span>•</span>
              <span>{lead.sector}</span>
            </div>
            
            <div className="mt-2 text-xs text-[#8E99A4]">
              Last contacted: {formatDate(lead.lastContacted)}
            </div>
          </div>
        </div>

        {/* Lead Score */}
        <div className="flex flex-col items-end flex-shrink-0">
          <div className={`text-2xl font-bold ${
            lead.leadScore >= 90 ? 'text-[#E85D54]' : 
            lead.leadScore >= 70 ? 'text-[#2A2447]' : 
            'text-[#5A6C7D]'
          }`}>
            {lead.leadScore}
          </div>
          <span className="text-xs text-[#8E99A4] mt-1">Lead Score</span>
          
          {/* Active Signals Count */}
          {lead.signals && lead.signals.length > 0 && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#FFC107] bg-opacity-10 text-[#FFC107]">
                {lead.signals.length} {lead.signals.length === 1 ? 'signal' : 'signals'}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

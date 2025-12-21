/**
 * @file SignalCard.tsx
 * @description Individual signal card component
 * @module components/features/signals
 */

'use client';

import { SignalBadge } from '@/app/components/ui';
import type { Signal } from '@/types';

interface SignalCardProps {
  signal: Signal;
  onClick?: (signal: Signal) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAsActioned?: (id: string) => void;
}

function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diff = now.getTime() - dateObj.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getSignalTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    ipo: 'IPO Filing',
    funding: 'Funding Round',
    acquisition: 'Acquisition',
    merger: 'Merger',
    board: 'Board Change',
    director_change: 'Director Change',
    corporate_action: 'Corporate Action',
    margin_pledge: 'Margin/Pledge',
    early_exit: 'Early Exit',
  };
  return labels[type] || type;
}

export default function SignalCard({
  signal,
  onClick,
  onMarkAsRead,
  onMarkAsActioned,
}: SignalCardProps) {
  const handleClick = () => {
    if (!signal.isRead && onMarkAsRead) {
      onMarkAsRead(signal.id);
    }
    onClick?.(signal);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMarkAsActioned) {
      onMarkAsActioned(signal.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        p-5 bg-white rounded-lg border transition-all cursor-pointer
        ${signal.isRead ? 'border-[#E1E5EB]' : 'border-[#E85D54] border-l-4'}
        hover:shadow-md hover:-translate-y-0.5
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header with badge and time */}
          <div className="flex items-center gap-3 mb-2">
            <SignalBadge severity={signal.severity} label={getSignalTypeLabel(signal.type)} compact />
            {signal.source === 'Manual Intelligence' && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-[#E85D54] text-white rounded">
                MANUAL
              </span>
            )}
            <span className="text-xs text-[#8E99A4]">
              {formatTimeAgo(signal.createdAt)}
            </span>
            {!signal.isRead && (
              <span className="px-2 py-0.5 text-xs font-medium bg-[#E85D54] text-white rounded">
                NEW
              </span>
            )}
          </div>

          {/* Title and description */}
          <h3 className="text-base font-semibold text-[#1A1A2E] mb-1">
            {signal.title}
          </h3>
          <p className="text-sm text-[#5A6C7D] mb-3 line-clamp-2">
            {signal.description}
          </p>

          {/* Metadata row */}
          <div className="flex items-center gap-4 text-xs text-[#8E99A4]">
            <span className="flex items-center gap-1">
              <span className="font-medium">Source:</span> {signal.source}
            </span>
            {signal.prospectName && (
              <span className="flex items-center gap-1">
                <span className="font-medium">Prospect:</span> {signal.prospectName}
              </span>
            )}
            {signal.estimatedLiquidity && (
              <span className="flex items-center gap-1">
                <span className="font-medium">Est. Liquidity:</span> ₹{signal.estimatedLiquidity}Cr
              </span>
            )}
            {signal.confidence && (
              <span className="flex items-center gap-1">
                <span className="font-medium">Confidence:</span> {signal.confidence}%
              </span>
            )}
          </div>
        </div>

        {/* Action button */}
        {!signal.isActioned && (
          <button
            onClick={handleActionClick}
            className="
              px-4 py-2 text-sm font-medium
              bg-[#2A2447] text-white rounded
              hover:bg-[#1A1332] transition-colors
              whitespace-nowrap
            "
          >
            Mark Actioned
          </button>
        )}
        {signal.isActioned && (
          <span className="px-4 py-2 text-sm font-medium text-[#28A745] border border-[#28A745] rounded whitespace-nowrap">
            ✓ Actioned
          </span>
        )}
      </div>
    </div>
  );
}

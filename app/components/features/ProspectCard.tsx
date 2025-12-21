/**
 * @file ProspectCard.tsx
 * @description Prospect card displaying client info, lead score, and signals
 */

import type { Prospect } from '@/types';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import LeadScore from '../ui/LeadScore';
import SignalBadge from '../ui/SignalBadge';
import Button from '../ui/Button';

interface ProspectCardProps {
  prospect: Prospect;
  onCall?: () => void;
  onEmail?: () => void;
  onClick?: () => void;
}

export default function ProspectCard({
  prospect,
  onCall,
  onEmail,
  onClick,
}: ProspectCardProps) {
  const recentSignals = prospect.signals.slice(0, 3);

  return (
    <Card className="cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between gap-4">
        {/* Left: Avatar and Info */}
        <div className="flex items-start gap-4">
          <Avatar initials={prospect.initials} size="lg" />
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A2E]">
              {prospect.firstName} {prospect.lastName}
            </h3>
            <p className="text-sm text-[#5A6C7D]">{prospect.title}</p>
            <p className="text-sm text-[#5A6C7D]">{prospect.company}</p>
          </div>
        </div>

        {/* Right: Lead Score */}
        <LeadScore
          score={prospect.leadScore}
          category={prospect.scoreCategory}
          size="md"
        />
      </div>

      {/* Meta Info */}
      <div className="mt-4 flex items-center gap-4 text-sm text-[#5A6C7D]">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {prospect.location}
        </span>
        <span>|</span>
        <span>{prospect.sector}</span>
        <span>|</span>
        <span>{prospect.network}</span>
      </div>

      {/* Wallet Share (if available) */}
      {prospect.estWealth && prospect.myShare && (
        <div className="mt-4 p-3 bg-gradient-to-r from-[#1A1332]/5 to-[#2A2447]/5 rounded-lg border border-[#2A2447]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                Est. Wealth
              </p>
              <p className="text-lg font-bold text-[#1A1A2E] mt-1">
                {prospect.estWealth}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                My Share
              </p>
              <p className="text-lg font-bold text-[#E85D54] mt-1">
                {prospect.myShare}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                % Share
              </p>
              <p className="text-lg font-bold text-[#2A2447] mt-1">
                {prospect.sharePercentage}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Signals */}
      {recentSignals.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider mb-2">
            Active Signals
          </p>
          <div className="flex flex-wrap gap-2">
            {recentSignals.map((signal) => (
              <SignalBadge
                key={signal.id}
                severity={signal.severity}
                label={signal.title}
                timestamp={new Date(signal.createdAt).toLocaleDateString()}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-[#8E99A4]">
          Last contacted: {prospect.lastContacted
            ? new Date(prospect.lastContacted).toLocaleDateString()
            : 'Never'}
        </span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onCall?.();
            }}
          >
            Call
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEmail?.();
            }}
          >
            Email
          </Button>
        </div>
      </div>
    </Card>
  );
}

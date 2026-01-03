/**
 * @file SignalCard.tsx
 * @description Individual signal card component
 * @module components/features/signals
 */

'use client';

import { SignalBadge } from '@/app/components/ui';
import { formatCroreAmount } from '@/lib/utils/currency';
import type { DataSource, Signal } from '@/types';

const SOURCE_DETAILS: Record<
  DataSource,
  { label: string; tier: string; icon: string; bg: string; ring: string; text: string; description: string }
> = {
  'Exchange Data': {
    label: 'Exchange Data',
    tier: 'Exchange — verified',
    icon: '🏛️',
    bg: 'bg-[#EEF5FF]',
    ring: 'ring-[#A5C4FF]',
    text: 'text-[#1A1A2E]',
    description: 'Filed via exchange feed; reconciled against symbol master.',
  },
  PrivateCircle: {
    label: 'PrivateCircle',
    tier: 'Data partner — curated',
    icon: '🛰️',
    bg: 'bg-[#F5F0FF]',
    ring: 'ring-[#C3B3FF]',
    text: 'text-[#2A2447]',
    description: 'Privately sourced event with human curation and enrichment.',
  },
  'Zauba Corp': {
    label: 'Zauba Corp',
    tier: 'Filings — corroborated',
    icon: '📑',
    bg: 'bg-[#FFF6EB]',
    ring: 'ring-[#F6C28B]',
    text: 'text-[#5A3B10]',
    description: 'Company filings matched to entity metadata.',
  },
  VCCircle: {
    label: 'VCCircle',
    tier: 'Media — curated',
    icon: '📰',
    bg: 'bg-[#F0F7F4]',
    ring: 'ring-[#A4D4C3]',
    text: 'text-[#1C4B35]',
    description: 'Vetted editorial coverage with corroboration checks.',
  },
  NewsAPI: {
    label: 'NewsAPI',
    tier: 'News — aggregated',
    icon: '🌐',
    bg: 'bg-[#F4F6F8]',
    ring: 'ring-[#CBD2D9]',
    text: 'text-[#243B53]',
    description: 'Aggregated signals scored for relevance and confidence.',
  },
  'Manual Intelligence': {
    label: 'RM Intelligence',
    tier: 'Manual — RM note',
    icon: '✍️',
    bg: 'bg-[#FFF0F0]',
    ring: 'ring-[#F4A4A4]',
    text: 'text-[#8B1E1E]',
    description: 'Relationship manager captured intelligence with context.',
  },
  'Bloomberg Gulf': {
    label: 'Bloomberg Gulf',
    tier: 'Media — verified',
    icon: '📺',
    bg: 'bg-[#E9F5FF]',
    ring: 'ring-[#A6D4FF]',
    text: 'text-[#12344D]',
    description: 'Broadcast coverage cross-checked with primary filings.',
  },
  'DFM Archive': {
    label: 'DFM Archive',
    tier: 'Exchange — archival',
    icon: '🗄️',
    bg: 'bg-[#F5FBF5]',
    ring: 'ring-[#B8E2B8]',
    text: 'text-[#1F3A1F]',
    description: 'Historic clearing records aligned to trading activity.',
  },
  'IPO Central': {
    label: 'IPO Central',
    tier: 'Filings — curated',
    icon: '🧭',
    bg: 'bg-[#FFF7ED]',
    ring: 'ring-[#F8CF9C]',
    text: 'text-[#5B3D16]',
    description: 'IPO intelligence validated against exchange disclosures.',
  },
  'Dubai Financial Services Authority': {
    label: 'DFSA',
    tier: 'Regulator — official',
    icon: '🏦',
    bg: 'bg-[#EDF4FF]',
    ring: 'ring-[#B4CBFF]',
    text: 'text-[#1E2A3D]',
    description: 'Regulatory notices and orders from DFSA repository.',
  },
  'Gulf News': {
    label: 'Gulf News',
    tier: 'Media — trusted',
    icon: '📰',
    bg: 'bg-[#F4F6F8]',
    ring: 'ring-[#CBD2D9]',
    text: 'text-[#243B53]',
    description: 'Editorial reporting validated against multiple sources.',
  },
  'Arabian Business': {
    label: 'Arabian Business',
    tier: 'Media — trusted',
    icon: '🗞️',
    bg: 'bg-[#F6F2ED]',
    ring: 'ring-[#D7C6B3]',
    text: 'text-[#3D2F22]',
    description: 'Business news corroborated with market disclosures.',
  },
  'Saxo Bank': {
    label: 'Saxo Bank',
    tier: 'Broker — insights',
    icon: '📈',
    bg: 'bg-[#F1F7FF]',
    ring: 'ring-[#B9D8FF]',
    text: 'text-[#173354]',
    description: 'Brokerage research feeds mapped to client holdings.',
  },
  'Argaam': {
    label: 'Argaam',
    tier: 'GCC Markets — verified',
    icon: '📊',
    bg: 'bg-[#E8F5E9]',
    ring: 'ring-[#A5D6A7]',
    text: 'text-[#1B5E20]',
    description: 'Leading Saudi & GCC financial data provider with real-time market intelligence.',
  },
  'Zawya': {
    label: 'Zawya',
    tier: 'LSEG — curated',
    icon: '🏛️',
    bg: 'bg-[#E3F2FD]',
    ring: 'ring-[#90CAF9]',
    text: 'text-[#0D47A1]',
    description: 'LSEG (London Stock Exchange Group) MENA business intelligence platform.',
  },
  'Tadawul': {
    label: 'Tadawul',
    tier: 'Exchange — official',
    icon: '🏦',
    bg: 'bg-[#F3E5F5]',
    ring: 'ring-[#CE93D8]',
    text: 'text-[#4A148C]',
    description: 'Saudi Stock Exchange official filings and market data.',
  },
  'ADX': {
    label: 'ADX',
    tier: 'Exchange — official',
    icon: '📈',
    bg: 'bg-[#E1F5FE]',
    ring: 'ring-[#81D4FA]',
    text: 'text-[#01579B]',
    description: 'Abu Dhabi Securities Exchange official market data.',
  },
  'DFM': {
    label: 'DFM',
    tier: 'Exchange — official',
    icon: '💹',
    bg: 'bg-[#FFF3E0]',
    ring: 'ring-[#FFCC80]',
    text: 'text-[#E65100]',
    description: 'Dubai Financial Market official exchange data.',
  },
  'SWFI': {
    label: 'SWFI',
    tier: 'Intelligence — institutional',
    icon: '🌐',
    bg: 'bg-[#E8EAF6]',
    ring: 'ring-[#9FA8DA]',
    text: 'text-[#1A237E]',
    description: 'Sovereign Wealth Fund Institute tracking high-value institutional deals.',
  },
  'CMA Saudi Arabia': {
    label: 'CMA',
    tier: 'Regulator — official',
    icon: '⚖️',
    bg: 'bg-[#EFEBE9]',
    ring: 'ring-[#BCAAA4]',
    text: 'text-[#3E2723]',
    description: 'Capital Market Authority of Saudi Arabia regulatory filings.',
  },
  'SAMA': {
    label: 'SAMA',
    tier: 'Central Bank — official',
    icon: '🏛️',
    bg: 'bg-[#E0F2F1]',
    ring: 'ring-[#80CBC4]',
    text: 'text-[#004D40]',
    description: 'Saudi Arabian Monetary Authority official banking & financial data.',
  },
  'ADGM': {
    label: 'ADGM',
    tier: 'Financial Center — official',
    icon: '🏢',
    bg: 'bg-[#F1F8E9]',
    ring: 'ring-[#C5E1A5]',
    text: 'text-[#33691E]',
    description: 'Abu Dhabi Global Market regulatory filings and corporate records.',
  },
  'DIFC': {
    label: 'DIFC',
    tier: 'Financial Center — official',
    icon: '🏙️',
    bg: 'bg-[#FCE4EC]',
    ring: 'ring-[#F48FB1]',
    text: 'text-[#880E4F]',
    description: 'Dubai International Financial Centre regulatory and corporate intelligence.',
  },
};

function formatTooltipDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

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
    liquidity: 'Liquidity Event',
    wealth_creation: 'Wealth Creation',
    real_estate: 'Real Estate',
    healthcare: 'Healthcare',
    energy: 'Energy Sector',
    logistics: 'Logistics',
    consumer: 'Consumer',
    financial_services: 'Financial Services',
    family_office_rotation: 'Family Office Rotation',
    ipo_approval: 'IPO Approval',
    strategic_stake_sale: 'Strategic Stake Sale',
  };
  return labels[type] || type;
}

export default function SignalCard({
  signal,
  onClick,
  onMarkAsRead,
  onMarkAsActioned,
}: SignalCardProps) {
  const sourceDetail = SOURCE_DETAILS[signal.source];

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
            {sourceDetail && (
              <div className="relative group">
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full ring-1 ${sourceDetail.bg} ${sourceDetail.ring}`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-base">
                    {sourceDetail.icon}
                  </span>
                  <div className="leading-tight">
                    <div className={`text-xs font-semibold ${sourceDetail.text}`}>{sourceDetail.label}</div>
                    <div className="text-[11px] text-[#5A6C7D]">{sourceDetail.tier}</div>
                  </div>
                </div>
                <div className="absolute z-20 mt-2 hidden w-64 rounded-lg bg-[#1A1A2E] px-3 py-2 text-xs text-white shadow-lg group-hover:flex">
                  <div className="space-y-1">
                    <div className="font-semibold">Provenance</div>
                    <div className="flex items-center justify-between text-[11px] text-white/80">
                      <span>Ingested</span>
                      <span>{formatTooltipDate(signal.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-white/80">
                      <span>Confidence</span>
                      <span>{signal.confidence ? `${signal.confidence}%` : 'Not rated'}</span>
                    </div>
                    <p className="text-[11px] text-white/70">{sourceDetail.description}</p>
                  </div>
                </div>
              </div>
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
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#8E99A4]">
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
                <span className="font-medium">Est. Liquidity:</span> {formatCroreAmount(signal.estimatedLiquidity)}
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

/**
 * @file FactorCard.tsx
 * @description Display individual score factor contribution
 */

'use client';

import type { ScoreFactor, SignalType } from '@/types';

interface FactorCardProps {
  factor: ScoreFactor;
}

export default function FactorCard({ factor }: FactorCardProps) {
  const percentage = (factor.weight * 100).toFixed(0);
  const contribution = factor.points_contributed.toFixed(1);
  
  // Get signal type color
  const signalColors: Record<SignalType, string> = {
    ipo: 'bg-purple-100 text-purple-700',
    funding: 'bg-blue-100 text-blue-700',
    acquisition: 'bg-green-100 text-green-700',
    merger: 'bg-teal-100 text-teal-700',
    board: 'bg-orange-100 text-orange-700',
    director_change: 'bg-amber-100 text-amber-700',
    corporate_action: 'bg-indigo-100 text-indigo-700',
    buyback: 'bg-emerald-100 text-emerald-700',
    open_offer: 'bg-lime-100 text-lime-700',
    stock_split: 'bg-sky-100 text-sky-700',
    demerger: 'bg-rose-100 text-rose-700',
    rights_call: 'bg-yellow-100 text-yellow-700',
    margin_pledge: 'bg-pink-100 text-pink-700',
    early_exit: 'bg-cyan-100 text-cyan-700',
  };
  
  const colorClass = signalColors[factor.signal_type] || 'bg-gray-100 text-gray-700';
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Signal type badge */}
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colorClass}`}>
            {factor.signal_type.toUpperCase().replace('_', ' ')}
          </span>
          
          {/* Description */}
          <p className="text-sm text-[#1A1A2E] mt-2 font-medium">
            {factor.signal_description}
          </p>
          
          {/* Metadata */}
          <div className="flex items-center gap-4 mt-3 text-xs text-[#8E99A4]">
            <span>📅 {factor.recency_days} days ago</span>
            <span>•</span>
            <span>📊 {(factor.confidence * 100).toFixed(0)}% confidence</span>
            <span>•</span>
            <span>📍 {factor.source}</span>
          </div>
        </div>
        
        {/* Points contributed */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-2xl font-bold text-[#E85D54]">
            +{contribution}
          </span>
          <span className="text-xs text-[#8E99A4]">
            {percentage}% weight
          </span>
        </div>
      </div>
      
      {/* Contribution bar */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-[#E85D54] to-[#F06E66] transition-all duration-500"
          style={{ width: `${Math.min(100, factor.points_contributed)}%` }}
        />
      </div>
    </div>
  );
}

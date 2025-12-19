/**
 * @file ScoreBadge.tsx
 * @description Enhanced score badge with circular progress and category
 */

'use client';

import type { ScoreCategory, ScoreTrend } from '@/types';
import {
  getScoreCategoryColor,
  getTrendIcon,
  getTrendColor,
} from '@/lib/scoring/score-utils';

interface ScoreBadgeProps {
  score: number;
  category: ScoreCategory;
  trend?: ScoreTrend;
  size?: 'sm' | 'md' | 'lg';
  showTrend?: boolean;
}

export default function ScoreBadge({
  score,
  category,
  trend = 'stable',
  size = 'md',
  showTrend = true,
}: ScoreBadgeProps) {
  const colors = getScoreCategoryColor(category);
  const trendColor = getTrendColor(trend);
  const trendIcon = getTrendIcon(trend);
  
  const sizes = {
    sm: {
      container: 'w-16 h-16',
      stroke: '4',
      text: 'text-lg',
      label: 'text-xs',
      trend: 'text-sm',
    },
    md: {
      container: 'w-24 h-24',
      stroke: '6',
      text: 'text-2xl',
      label: 'text-sm',
      trend: 'text-base',
    },
    lg: {
      container: 'w-32 h-32',
      stroke: '8',
      text: 'text-3xl',
      label: 'text-base',
      trend: 'text-lg',
    },
  };
  
  const sizeConfig = sizes[size];
  const radius = size === 'sm' ? 28 : size === 'md' ? 42 : 56;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${sizeConfig.container} relative`}>
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={sizeConfig.stroke}
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={sizeConfig.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className={`${colors.text} transition-all duration-500`}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${sizeConfig.text} font-bold ${colors.text}`}>
            {score}
          </span>
        </div>
      </div>
      
      {/* Category label and trend */}
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${colors.bg} ${colors.border} border`}>
          <span className="text-sm">{colors.icon}</span>
          <span className={`${sizeConfig.label} font-semibold ${colors.text}`}>
            {category}
          </span>
        </span>
        
        {showTrend && trend !== 'stable' && (
          <span className={`${sizeConfig.trend} font-bold ${trendColor}`}>
            {trendIcon}
          </span>
        )}
      </div>
    </div>
  );
}

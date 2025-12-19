/**
 * @file MetricsCard.tsx
 * @description Metric display card for dashboard
 */

'use client';

import { Card } from '@/app/components/ui';
import { ReactNode } from 'react';

interface MetricsCardProps {
  label: string;
  value: string | number;
  change?: number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

export default function MetricsCard({ 
  label, 
  value, 
  change, 
  subtitle,
  icon,
  trend,
  onClick 
}: MetricsCardProps) {
  const getTrendColor = () => {
    if (!trend || trend === 'neutral') return 'text-[#8E99A4]';
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = () => {
    if (!trend || trend === 'neutral') return '→';
    return trend === 'up' ? '↑' : '↓';
  };

  return (
    <Card 
      padding="md" 
      hover={!!onClick}
      onClick={onClick}
      className={onClick ? 'cursor-pointer' : ''}
    >
      <div className="flex flex-col">
        {/* Label */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
            {label}
          </span>
          {icon && <div className="text-[#5A6C7D]">{icon}</div>}
        </div>
        
        {/* Value */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl font-bold text-[#1A1A2E]">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          
          {change !== undefined && (
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {getTrendIcon()} {change > 0 ? '+' : ''}{change}%
            </span>
          )}
        </div>
        
        {/* Subtitle */}
        {subtitle && (
          <span className="text-xs text-[#8E99A4] mt-2">
            {subtitle}
          </span>
        )}
      </div>
    </Card>
  );
}

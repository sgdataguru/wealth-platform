/**
 * @file LeadScore.tsx
 * @description Lead score indicator with visual progress bar
 */

import type { LeadScoreCategory } from '@/types';

interface LeadScoreProps {
  score: number;
  category: LeadScoreCategory;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function LeadScore({
  score,
  category,
  size = 'md',
  showLabel = true,
}: LeadScoreProps) {
  const categoryStyles = {
    excellent: {
      color: 'from-[#C9A227] to-[#D4AF37]',
      textColor: 'text-[#C9A227]',
      bgColor: 'bg-gradient-to-r from-[#C9A227] to-[#D4AF37]',
      label: 'Excellent',
    },
    good: {
      color: 'from-[#1E3A5F] to-[#2C4A6F]',
      textColor: 'text-[#1E3A5F]',
      bgColor: 'bg-[#1E3A5F]',
      label: 'Good',
    },
    fair: {
      color: 'from-[#5A6C7D] to-[#6A7C8D]',
      textColor: 'text-[#5A6C7D]',
      bgColor: 'bg-[#5A6C7D]',
      label: 'Fair',
    },
    low: {
      color: 'from-[#8E99A4] to-[#9EAAB4]',
      textColor: 'text-[#8E99A4]',
      bgColor: 'bg-[#8E99A4]',
      label: 'Low',
    },
  };

  const sizeStyles = {
    sm: {
      container: 'w-16',
      score: 'text-lg',
      bar: 'h-1',
      label: 'text-xs',
    },
    md: {
      container: 'w-24',
      score: 'text-2xl',
      bar: 'h-1.5',
      label: 'text-sm',
    },
    lg: {
      container: 'w-32',
      score: 'text-3xl',
      bar: 'h-2',
      label: 'text-base',
    },
  };

  const styles = categoryStyles[category];
  const sizes = sizeStyles[size];

  return (
    <div className={`${sizes.container} flex flex-col items-center gap-1`}>
      <span className={`${sizes.score} font-bold ${styles.textColor}`}>
        {score}
      </span>
      <div className={`w-full bg-gray-200 rounded-full ${sizes.bar}`}>
        <div
          className={`${sizes.bar} rounded-full ${styles.bgColor} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      {showLabel && (
        <span className={`${sizes.label} font-medium ${styles.textColor}`}>
          {styles.label}
        </span>
      )}
    </div>
  );
}

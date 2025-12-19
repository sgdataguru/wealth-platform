/**
 * @file score-utils.ts
 * @description Utility functions for lead score calculations
 */

import type { ScoreCategory, ScoreTrend } from '@/types';

/**
 * Categorize score into HOT/WARM/COLD
 */
export function getScoreCategory(score: number): ScoreCategory {
  if (score >= 80) return 'HOT';
  if (score >= 50) return 'WARM';
  return 'COLD';
}

/**
 * Get color for score category
 */
export function getScoreCategoryColor(category: ScoreCategory): {
  bg: string;
  text: string;
  border: string;
  icon: string;
} {
  switch (category) {
    case 'HOT':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-500',
        icon: '🔥',
      };
    case 'WARM':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-500',
        icon: '⚡',
      };
    case 'COLD':
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-400',
        icon: '❄️',
      };
  }
}

/**
 * Calculate score trend based on previous score
 */
export function getScoreTrend(
  currentScore: number,
  previousScore?: number
): ScoreTrend {
  if (!previousScore) return 'stable';
  
  const diff = currentScore - previousScore;
  if (diff > 5) return 'up';
  if (diff < -5) return 'down';
  return 'stable';
}

/**
 * Get trend icon
 */
export function getTrendIcon(trend: ScoreTrend): string {
  switch (trend) {
    case 'up':
      return '↑';
    case 'down':
      return '↓';
    case 'stable':
      return '→';
  }
}

/**
 * Get trend color class
 */
export function getTrendColor(trend: ScoreTrend): string {
  switch (trend) {
    case 'up':
      return 'text-green-600';
    case 'down':
      return 'text-red-600';
    case 'stable':
      return 'text-gray-600';
  }
}

/**
 * Normalize score to 0-100 range
 */
export function normalizeScore(score: number): number {
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Calculate recency factor for signal
 * Signals lose value over time
 */
export function calculateRecencyFactor(daysOld: number): number {
  const maxDays = 90;
  const minFactor = 0.1;
  
  if (daysOld === 0) return 1.0;
  if (daysOld >= maxDays) return minFactor;
  
  return 1.0 - ((1.0 - minFactor) * (daysOld / maxDays));
}

/**
 * Format score for display
 */
export function formatScore(score: number): string {
  return score.toFixed(0);
}

/**
 * Get days since date
 */
export function getDaysSince(date: Date): number {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * @file calculate-score.ts
 * @description Core scoring algorithm for lead scores
 */

import type { Signal, LeadScore, ScoreFactor, SignalType } from '@/types';
import {
  getScoreCategory,
  getScoreTrend,
  normalizeScore,
  calculateRecencyFactor,
  getDaysSince,
} from './score-utils';

/**
 * Scoring weights for different signal types
 * Total should sum to 1.0
 */
export const SCORING_WEIGHTS: Record<SignalType, number> = {
  ipo: 0.30, // 30% weight - highest priority
  funding: 0.20, // 20% weight
  acquisition: 0.25, // 25% weight
  merger: 0.25, // 25% weight
  board: 0.10, // 10% weight
  director_change: 0.08, // 8% weight
  corporate_action: 0.12, // 12% weight
  margin_pledge: 0.15, // 15% weight
  early_exit: 0.22, // 22% weight
};

/**
 * Calculate lead score based on signals
 */
export function calculateLeadScore(
  clientId: string,
  signals: Signal[],
  previousScore?: number
): LeadScore {
  // Calculate individual factor contributions
  const factors: ScoreFactor[] = signals.map((signal) => {
    const weight = SCORING_WEIGHTS[signal.type] || 0.1;
    const daysOld = getDaysSince(signal.createdAt);
    const recencyFactor = calculateRecencyFactor(daysOld);
    const confidence = signal.confidence || 0.8;
    
    // Base strength from signal severity
    const severityScore = {
      critical: 100,
      high: 75,
      medium: 50,
      low: 25,
    }[signal.severity];
    
    // Calculate contribution
    const contribution =
      severityScore * weight * recencyFactor * confidence;
    
    return {
      signal_id: signal.id,
      signal_type: signal.type,
      signal_description: signal.description,
      weight,
      points_contributed: contribution,
      recency_days: daysOld,
      confidence,
      source: signal.source,
    };
  });
  
  // Sum total score
  const totalScore = factors.reduce(
    (sum, factor) => sum + factor.points_contributed,
    0
  );
  
  // Normalize to 0-100 range
  const normalizedScore = normalizeScore(totalScore);
  
  // Determine category and trend
  const category = getScoreCategory(normalizedScore);
  const trend = getScoreTrend(normalizedScore, previousScore);
  
  // Generate basic explanation
  const explanation = generateScoreExplanation(
    normalizedScore,
    category,
    factors
  );
  
  // Calculate expiration (24 hours from now)
  const calculatedAt = new Date();
  const expiresAt = new Date(calculatedAt);
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  return {
    id: `score_${clientId}_${Date.now()}`,
    client_id: clientId,
    score: normalizedScore,
    score_category: category,
    trend,
    calculated_at: calculatedAt,
    expires_at: expiresAt,
    factors,
    explanation,
    previous_score: previousScore,
  };
}

/**
 * Generate basic explanation for score
 */
function generateScoreExplanation(
  score: number,
  category: string,
  factors: ScoreFactor[]
): string {
  const topFactors = factors
    .sort((a, b) => b.points_contributed - a.points_contributed)
    .slice(0, 3);
  
  const factorNames = topFactors
    .map((f) => f.signal_type.replace('_', ' '))
    .join(', ');
  
  const categoryText = {
    HOT: 'high-priority prospect with strong liquidity signals',
    WARM: 'promising prospect with moderate signals',
    COLD: 'prospect with limited recent activity',
  }[category];
  
  if (topFactors.length === 0) {
    return `Score of ${score} indicates ${categoryText}. No significant signals detected recently.`;
  }
  
  return `Score of ${score} indicates ${categoryText}. Key factors: ${factorNames}. Recent signals suggest potential liquidity events.`;
}

/**
 * Recalculate score for a client
 */
export function recalculateScore(
  clientId: string,
  signals: Signal[],
  currentScore?: LeadScore
): LeadScore {
  const previousScore = currentScore?.score;
  return calculateLeadScore(clientId, signals, previousScore);
}

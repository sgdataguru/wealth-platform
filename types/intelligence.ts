export interface SourceTrace {
  source: 'FINOVA' | 'MARKET' | 'REGULATORY' | 'IPO' | 'PRIVATE_CIRCLE' | 'ZAUBA' | 'NEWS_API'
  receivedAt: string // ISO date
  rawId?: string
}

export interface RawSignal {
  id: string
  title: string
  description?: string
  relevanceScore?: number
  detectedAt: string // ISO date
  sourceTrace: SourceTrace[]
}

export interface NormalizedSignal {
  id: string
  canonicalTitle: string
  summary: string
  aggregatedScore: number
  detectedAt: string
  provenance: SourceTrace[]
  resolvedFrom?: string // source that won conflict resolution
}

export type SignalType = 
  | 'IPO_FILING'
  | 'FUNDING_ROUND'
  | 'ACQUISITION'
  | 'MERGER'
  | 'EARLY_EXIT'
  | 'DIRECTOR_CHANGE'
  | 'CORPORATE_ACTION'
  | 'MARGIN_PLEDGE_CHANGE'

export type SignalPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
export type SignalTimeline = '30_DAY' | '60_DAY' | '90_DAY' | 'ALL'

export interface LiquiditySignal {
  id: string
  type: SignalType
  source: SourceTrace['source']
  priority: SignalPriority
  timeline: SignalTimeline
  detectedAt: string // ISO
  estimatedEventDate?: string
  prospect?: {
    id: string
    name: string
    estimatedWealth?: number
  }
  eventDetails: {
    company?: string
    eventType: string
    description: string
    estimatedLiquidity?: number
    confidence: number
  }
  sources: SourceTrace[]
}

export interface SignalsFilter {
  timeline?: SignalTimeline
  priority?: SignalPriority[]
  source?: SourceTrace['source'][]
  q?: string
  sortBy?: 'detectedAt' | 'priority' | 'confidence'
  sortOrder?: 'asc' | 'desc'
}
/**
 * @file types/intelligence.ts
 * @description Type definitions for manual intelligence/liquidity events
 */

import type { SignalType, SignalSeverity, SignalTimeline } from './index';

export type SourceType = 'REGULATORY' | 'FINOVA' | 'IPO' | 'MARKET';

export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type TimelineFilter = 'ALL' | '30_DAY' | '60_DAY' | '90_DAY';

export interface SourceTraceEntry {
  source: SourceType;
  ingestedAt: string;
  detail?: string;
}

export interface RawSignal {
  title: string;
  description?: string;
  relevanceScore?: number;
  detectedAt?: string;
  prospectId?: string | null;
  sourceTrace?: SourceTraceEntry[];
  metadata?: Record<string, unknown>;
}

export interface LiquiditySignal {
  id: string;
  title: string;
  description?: string | null;
  relevanceScore: number | null;
  detectedAt: string;
  sourceTrace: SourceTraceEntry[];
  prospectId?: string | null;
  priority: Priority;
  confidence: number | null;
}

// Information source for manual intelligence
export type InformationSource = 
  | 'client_conversation'
  | 'network_contact'
  | 'industry_event'
  | 'news_mention'
  | 'public_filing'
  | 'other';

// Manual intelligence form data structure
export interface IntelligenceFormData {
  clientId: string;
  eventType: SignalType;
  eventDetails: string;
  expectedTimeline: SignalTimeline;
  estimatedAmount?: number;
  informationSource: InformationSource;
  additionalNotes?: string;
  severity: SignalSeverity;
}

// Response from creating manual intelligence
export interface CreateIntelligenceResponse {
  success: boolean;
  data?: {
    signalId: string;
    leadScoreUpdated: boolean;
    newLeadScore?: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

// Client search result
export interface ClientSearchResult {
  id: string;
  name: string;
  company: string;
  leadScore: number;
  scoreCategory: string;
}

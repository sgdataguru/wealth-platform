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

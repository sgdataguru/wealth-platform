/**
 * @file types/index.ts
 * @description Type definitions for UHNW Liquidity Intelligence Platform
 */

// Signal severity levels
export type SignalSeverity = 'critical' | 'high' | 'medium' | 'low';

// Signal types
export type SignalType = 
  | 'ipo'
  | 'funding'
  | 'acquisition'
  | 'merger'
  | 'board'
  | 'director_change'
  | 'corporate_action'
  | 'margin_pledge'
  | 'early_exit';

// Data sources for signals
export type DataSource = 
  | 'PrivateCircle'
  | 'Zauba Corp'
  | 'Exchange Data'
  | 'VCCircle'
  | 'NewsAPI'
  | 'Manual Intelligence';

// Timeline categories for signals
export type SignalTimeline = '30_days' | '30_60_days' | '60_90_days' | '3_6_months' | '6_plus_months';

// Signal type definitions
export interface Signal {
  id: string;
  type: SignalType;
  severity: SignalSeverity;
  title: string;
  description: string;
  source: DataSource;
  createdAt: Date;
  isActioned: boolean;
  isRead?: boolean;
  expectedTimeline?: SignalTimeline;
  metadata?: Record<string, unknown>;
  prospectId?: string;
  prospectName?: string;
  estimatedLiquidity?: number;
  confidence?: number;
}

// Lead score category
export type LeadScoreCategory = 'excellent' | 'good' | 'fair' | 'low';

// Lead score breakdown item
export interface ScoreBreakdown {
  label: string;
  points: number;
  description: string;
}

// Prospect type
export interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  title: string;
  company: string;
  location: string;
  sector: string;
  network: string;
  email: string;
  phone: string;
  leadScore: number;
  scoreCategory: LeadScoreCategory;
  scoreBreakdown: ScoreBreakdown[];
  signals: Signal[];
  lastContacted: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard metrics
export interface DashboardMetrics {
  totalLeads: number;
  leadsGrowth: string;
  newToday: number;
  newTodayChange: number;
  signalsDetected: number;
  signalsGrowth: string;
  followUps: number;
  followUpsDueToday: boolean;
}

// Activity feed item
export interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  type: 'contact' | 'signal' | 'reminder' | 'note';
}

// Chat message
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  links?: { label: string; href: string }[];
}

// Filter options
export interface FilterOptions {
  city: string;
  sector: string;
  scoreRange: [number, number];
  signalTypes: string[];
}

// Signal filter options
export interface SignalFilterOptions {
  timeline?: SignalTimeline | 'all';
  priority?: SignalSeverity[];
  source?: DataSource[];
  isActioned?: boolean;
  sortBy?: 'detectedAt' | 'priority' | 'timeline';
  sortOrder?: 'asc' | 'desc';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

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
  | 'buyback'
  | 'open_offer'
  | 'stock_split'
  | 'demerger'
  | 'rights_call'
  | 'margin_pledge'
  | 'early_exit'
  | 'liquidity'
  | 'wealth_creation'
  | 'real_estate'
  | 'healthcare'
  | 'energy'
  | 'logistics'
  | 'consumer'
  | 'financial_services'
  | 'family_office_rotation'
  | 'ipo_approval'
  | 'strategic_stake_sale';

// Data sources for signals
export type DataSource =
  | 'PrivateCircle'
  | 'Zauba Corp'
  | 'Exchange Data'
  | 'VCCircle'
  | 'NewsAPI'
  | 'Manual Intelligence'
  | 'Bloomberg Gulf'
  | 'DFM Archive'
  | 'IPO Central'
  | 'Dubai Financial Services Authority'
  | 'Gulf News'
  | 'Arabian Business'
  | 'Saxo Bank'
  | 'Argaam'
  | 'Zawya'
  | 'Tadawul'
  | 'ADX'
  | 'DFM'
  | 'SWFI'
  | 'CMA Saudi Arabia'
  | 'SAMA'
  | 'ADGM'
  | 'DIFC';

// Timeline categories for signals
export type SignalTimeline = '30_days' | '30_60_days' | '60_90_days' | '3_6_months' | '6_plus_months';

// Re-export intelligence types
export type {
  InformationSource,
  IntelligenceFormData,
  CreateIntelligenceResponse,
  ClientSearchResult,
  SourceType,
  Priority,
  TimelineFilter,
  SourceTrace,
  RawSignal,
  LiquiditySignal,
} from './intelligence';

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

// Score category for HOT/WARM/COLD classification
export type ScoreCategory = 'HOT' | 'WARM' | 'COLD';

// Client tier classifications for Middle East market
export type ClientTier = 'UHNW' | 'HNW' | 'Emerging';

// Score trend indicator
export type ScoreTrend = 'up' | 'down' | 'stable';

// Lead score breakdown item
export interface ScoreBreakdown {
  label: string;
  points: number;
  description: string;
}

// Score factor with detailed signal contribution
export interface ScoreFactor {
  signal_id: string;
  signal_type: SignalType;
  signal_description: string;
  weight: number; // 0-1 (normalized contribution)
  points_contributed: number; // Actual points added to score
  recency_days: number; // How recent is this signal
  confidence: number; // 0-1 (signal reliability)
  source: DataSource;
}

// Enhanced lead score with explanation
export interface LeadScore {
  id: string;
  client_id: string;
  score: number; // 0-100
  score_category: ScoreCategory; // HOT/WARM/COLD
  trend: ScoreTrend; // up/down/stable
  calculated_at: Date;
  expires_at: Date; // Scores valid for 24 hours
  factors: ScoreFactor[];
  explanation: string; // AI-generated summary
  previous_score?: number; // For trend calculation
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
  // RM-specific fields
  estWealth?: string;
  myShare?: string;
  sharePercentage?: number;
  prospectType?: string;
  // Middle East specific segmentation
  clientTier?: ClientTier; // UHNW, HNW, or Emerging
  segment?: string; // Family Office, PE-backed, Founder-led
  // GCC & Compliance fields
  jurisdiction?: string; // e.g., ADGM, DIFC, SAMA, CMA
  shariahStatus?: 'halal' | 'haram' | 'restricted' | 'unknown';
  complianceTags?: string[]; // e.g., ['sanction-checked', 'kyc-updated']
  // External asset aggregation for Wallet Share intelligence
  externalAssets?: number; // held-away assets in USD
  totalWealth?: number; // aggregated total wealth (USD)
  walletShare?: number; // percentage of Total Wealth that is AUM (0-100)
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
  // RM-specific metrics
  myClients?: number;
  myClientsAum?: string;
  activeOpps?: number;
  activeOppsValue?: string;
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

// Lead status types
export type LeadStatus = 'new' | 'contacted' | 'engaged' | 'qualified' | 'converted' | 'inactive';

// Lead source types
export type LeadSource = 'signal' | 'referral' | 'event' | 'manual' | 'imported';

// Lead type definition
export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  title: string;
  location: string;
  sector: string;
  network?: string;
  status: LeadStatus;
  source: LeadSource;
  assignedRmId: string;
  leadScore: number;
  signals: Signal[];
  lastContacted: Date | null;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Follow-up status types
export type FollowUpStatus = 'new' | 'in_progress' | 'completed' | 'blocked';

// Follow-up priority types
export type FollowUpPriority = 'critical' | 'high' | 'medium' | 'low';

// Follow-up type definition
export interface FollowUp {
  id: string;
  leadId: string;
  lead?: Lead;
  rmId: string;
  title: string;
  description: string;
  status: FollowUpStatus;
  priority: FollowUpPriority;
  dueDate: Date;
  completedAt: Date | null;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Activity type definitions
export type ActivityType =
  | 'signal_viewed'
  | 'signal_actioned'
  | 'lead_created'
  | 'lead_contacted'
  | 'follow_up_created'
  | 'follow_up_completed'
  | 'follow_up_updated'
  | 'lead_converted'
  | 'intelligence_added'
  | 'note_added';

// Activity definition
export interface Activity {
  id: string;
  userId: string;
  actionType: ActivityType;
  description: string;
  leadId?: string;
  signalId?: string;
  followUpId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// Trend period types
export type TrendPeriod = 'daily' | 'weekly' | 'monthly';

// Date range interface
export interface DateRange {
  start: Date;
  end: Date;
}

// Trend data point
export interface TrendData {
  date: Date;
  leadsCreated: number;
  signalsGenerated: number;
  followUpsCompleted: number;
  leadsContacted: number;
  conversions: number;
}

// Enhanced dashboard metrics with follow-up tracking
export interface EnhancedDashboardMetrics extends DashboardMetrics {
  // Lead metrics
  leadsThisWeek: number;
  leadsChange: number; // % change from previous period

  // Signal metrics  
  signalsThisWeek: number;

  // Follow-up metrics
  totalFollowUps: number;
  completedFollowUps: number;
  pendingFollowUps: number;
  overdueFollowUps: number;
  followUpCompletionRate: number; // %

  // Conversion metrics
  conversions: number;
  conversionRate: number; // %

  // Activity metrics
  totalActivities: number;
  activitiesToday: number;
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

// ============================================
// ENGAGEMENT SUGGESTIONS
// ============================================

// Suggestion priority levels
export type SuggestionPriority =
  | 'critical'    // Act within 24 hours
  | 'high'        // Act within 3 days
  | 'medium'      // Act within 1 week
  | 'low';        // Monitor

// Suggestion categories
export type SuggestionCategory =
  | 'liquidity_event'
  | 'relationship_opportunity'
  | 'risk_alert'
  | 'cross_sell'
  | 'retention';

// Suggestion status
export type SuggestionStatus =
  | 'new'
  | 'viewed'
  | 'contacted'
  | 'snoozed'
  | 'dismissed';

// Snooze duration options
export type SnoozeDuration = '1d' | '3d' | '7d';

// Client info embedded in suggestion
export interface SuggestionClient {
  id: string;
  name: string;
  company: string;
  estimatedWealth: number;
  leadScore: number;
}

// Signal info embedded in suggestion
export interface SuggestionSignal {
  id: string;
  type: SignalType;
  severity: SignalSeverity;
  detectedAt: Date;
  timeline: string;
}

// Engagement suggestion
export interface EngagementSuggestion {
  id: string;
  rmId: string;
  clientId: string;
  signalId: string;

  // Content
  title: string;
  context: string;
  recommendedAction: string;

  // Metadata
  priority: SuggestionPriority;
  category: SuggestionCategory;
  generatedAt: Date;
  expiresAt?: Date;

  // Client & Signal Info
  client: SuggestionClient;
  signal: SuggestionSignal;

  // Status
  status: SuggestionStatus;
  viewedAt?: Date;
  actionedAt?: Date;
  snoozedUntil?: Date;
  dismissedAt?: Date;

  // Engagement
  contactedAt?: Date;
  outcome?: string;
  dismissReason?: string;
}

// Suggestion filters
export interface SuggestionFilters {
  priority?: SuggestionPriority[];
  category?: SuggestionCategory[];
  status?: SuggestionStatus[];
  dateRange?: { start: Date; end: Date };
}

// ============================================
// PROSPECT ACTIONS & FILTERING
// ============================================

// Suggested action types
export type SuggestedActionType = 'call' | 'meeting' | 'email' | 'review-portfolio' | 'custom' | 'note';

// Suggested action priority
export type SuggestedActionPriority = 'high' | 'medium' | 'low';

// Suggested action estimated impact
export type SuggestedActionImpact = 'high' | 'medium' | 'low';

// Who suggested the action
export type ActionSuggestor = 'ai' | 'rule-based' | 'manual';

// Suggested action for prospects
export interface SuggestedAction {
  id: string;
  type: SuggestedActionType;
  label: string;
  description: string;
  priority: SuggestedActionPriority;
  reasoning: string;
  estimatedImpact: SuggestedActionImpact;
  suggestedBy: ActionSuggestor;
  metadata?: {
    talking_points?: string[];
    context_notes?: string[];
    best_time?: string;
  };
}

// Prospect filter options
export interface ProspectFilters {
  signalTypes?: SignalType[];
  dateRange?: { start: Date; end: Date };
  minScore?: number;
  maxScore?: number;
  cities?: string[];
  sectors?: string[];
}

// Prospect sort options
export type ProspectSortOption = 'score' | 'recent' | 'signal-strength';

// Suggested actions API response
export interface SuggestedActionsResponse {
  success: boolean;
  data: {
    actions: SuggestedAction[];
    reasoning: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

// Prospects API response
export interface ProspectsResponse {
  success: boolean;
  data: {
    prospects: Prospect[];
    metadata: {
      total: number;
      page: number;
      pageSize: number;
      hasMore: boolean;
      lastUpdated: string;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

// ============================================
// PROSPECT DETAIL PANEL
// ============================================

// Extended metrics for prospect detail view
export interface ExtendedMetrics {
  aum: number;
  aumCurrency: string;
  walletShare: number;
  relationshipStrength: number;
  lifetimeValue: number;
  lastInteractionDays: number;
  upcomingFollowUps: number;
}

// Connection/relationship information
export interface Connection {
  id: string;
  name: string;
  relationship: string;
  strength: number;
  canIntroduce: boolean;
  company?: string;
}

// Engagement event types
export type EngagementEventType = 'call' | 'email' | 'meeting' | 'note' | 'signal';

// Engagement event for activity timeline
export interface EngagementEvent {
  id: string;
  type: EngagementEventType;
  description: string;
  timestamp: Date;
  outcome?: string;
}

// ============================================
// ROLE-BASED DASHBOARD SYSTEM
// ============================================

// User roles
export type UserRole = 'rm' | 'executive' | 'admin';

// User profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rmId?: string; // For RMs
  territories?: string[]; // For executives
  teamIds?: string[]; // For executives
  photoUrl?: string;
}

// RM-specific metrics
export interface RMMetrics extends DashboardMetrics {
  // Personal performance
  myClients: number;
  myClientsAum: string;
  myClientsAumGrowth: number; // percentage
  activeOpps: number;
  activeOppsValue: string;
  lastMonthRevenue: string;
  conversionRate: number; // percentage
  avgClientValue: string;

  // Activity metrics
  callsMadeThisWeek: number;
  emailsSentThisWeek: number;
  meetingsScheduled: number;
}

// Executive metrics
export interface ExecutiveMetrics {
  // Firm-wide performance
  totalAum: string;
  aumGrowth: number; // percentage MoM
  aumGrowthYoy: number; // percentage YoY
  netNewMoney: string;
  operatingMargin: number; // percentage
  roe: number; // percentage

  // Team metrics
  totalRMs: number;
  aumPerRM: string;
  revenuePerRM: string;
  avgRMProductivity: number; // score 0-100

  // Client metrics
  totalClients: number;
  hniClients: number;
  uhniClients: number;
  clientRetentionRate: number; // percentage
  clientAcquisitionCost: string;

  // Trend data
  topPerformingRMs: RMPerformance[];
  underperformingRMs: RMPerformance[];
  regionalBreakdown: RegionalMetrics[];
  productMix: ProductMixData[];
  aumTrend: TrendPoint[];
}

// RM performance data
export interface RMPerformance {
  rmId: string;
  rmName: string;
  aum: number;
  growth: number; // percentage
  clientCount: number;
  revenue: number;
  rank: number;
  photoUrl?: string;
}

// Regional metrics
export interface RegionalMetrics {
  region: string;
  aum: string;
  growth: number;
  rmCount: number;
  clientCount: number;
}

// Product mix data
export interface ProductMixData {
  product: string;
  percentage: number;
  value: string;
  color?: string;
}

// Trend point for charts
export interface TrendPoint {
  date: string;
  value: number;
  label?: string;
}

// Pipeline stage for RM
export interface PipelineStage {
  stage: string;
  count: number;
  value: string | number;
  color: string;
}

// RM Task Assignment System
export type RMTaskType = 'followup' | 'proposal' | 'review' | 'risk_assessment' | 'cross_sell' | 'prospect_call';
export type RMTaskPriority = 'high' | 'medium' | 'low';
export type RMTaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface RMTask {
  id: string;
  assignedTo: string; // RM ID
  assignedToName: string; // RM Name for display
  assignedBy: string; // Executive ID
  assignedByName: string; // Executive Name for display
  prospectId?: string;
  prospectName?: string;
  taskType: RMTaskType;
  priority: RMTaskPriority;
  dueDate: Date;
  status: RMTaskStatus;
  title: string;
  notes: string;
  createdAt: Date;
  completedAt?: Date;
}

// Executive alerts
export type ExecutiveAlertType = 'budget_overrun' | 'compliance_risk' | 'client_churn' | 'rm_underperformance' | 'high_value_opportunity';
export type ExecutiveAlertSeverity = 'critical' | 'warning' | 'info';

export interface ExecutiveAlert {
  id: string;
  type: ExecutiveAlertType;
  severity: ExecutiveAlertSeverity;
  title: string;
  description: string;
  actionRequired: boolean;
  relatedRMIds?: string[];
  relatedProspectIds?: string[];
  createdAt: Date;
  resolvedAt?: Date;
}

// ============================================
// ENHANCED EXECUTIVE DASHBOARD - KAIROS
// ============================================

// Kairos Capital Product Categories
export type KairosCapitalProduct =
  | 'PMS'
  | 'Equities'
  | 'Fixed Income'
  | 'Structured Products'
  | 'Alternative Investments'
  | 'Mutual Funds'
  | 'Insurance'
  | 'Commodities'
  | 'Currency'
  | 'Real Estate';

// Liquidity Event Types
export type LiquidityEventType =
  | 'lock_in_expiry'
  | 'bond_maturity'
  | 'mutual_fund_redemption'
  | 'property_sale'
  | 'business_exit'
  | 'dividend_payout'
  | 'esop_vesting'
  | 'ipo_listing'
  | 'acquisition_exit';

// Liquidity Trigger Status
export type LiquidityTriggerStatus =
  | 'upcoming'
  | 'engaged'
  | 'proposal_sent'
  | 'closed'
  | 'missed';

// Liquidity Urgency Levels
export type LiquidityUrgency = 'high' | 'medium' | 'early';

// Liquidity Trigger Event
export interface LiquidityTrigger {
  id: string;
  clientId: string;
  clientName: string;
  clientCode: string;
  eventType: LiquidityEventType;
  amount: number;
  eventDate: Date;
  daysUntilEvent: number;
  dataSource: string;
  probability: number; // 0-100
  confidenceLevel: 'high' | 'medium' | 'low';
  urgency?: LiquidityUrgency; // Urgency level for UI display
  recommendedActions: string[];
  recommendedProducts: KairosCapitalProduct[];
  assignedRM: string;
  assignedRMName: string;
  status: LiquidityTriggerStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Timeline Filter for Liquidity Triggers
export type LiquidityTimelineFilter = '0-30' | '31-90' | '91-180' | '181-365' | 'all';

// Enhanced Lead Score with Ranking
export interface EnhancedLeadScore {
  leadId: string;
  rank: number; // 1-based ranking
  totalLeads: number; // Total leads in system
  overallScore: number; // 0-100
  breakdown: {
    financialProfile: number; // 0-30
    engagementLevel: number; // 0-25
    propensityToConvert: number; // 0-20
    revenuePotential: number; // 0-15
    strategicValue: number; // 0-10
  };
  tier: 'gold' | 'silver' | 'bronze' | 'standard';
  lastCalculated: Date;
}

// Product Mix by Client
export interface ClientProductMix {
  clientId: string;
  clientName: string;
  clientCode: string;
  totalAUM: number;
  region: string;
  assignedRM: string;
  assignedRMEmail?: string;
  products: {
    category: KairosCapitalProduct;
    aum: number;
    percentage: number;
    lastUpdated: Date;
  }[];
  lastReviewDate: Date;
}

// Prospective Product for Leads
export interface ProspectiveProductMix {
  leadId: string;
  leadName: string;
  estimatedNetWorth: number;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  recommendedProducts: {
    category: KairosCapitalProduct;
    recommendationScore: number; // 0-100
    expectedAllocation: number; // Amount
    probability: number; // 0-100
    rationale: string;
  }[];
  totalExpectedAUM: number;
  assignedRM: string;
}

// AUM Source/Flow Data
export interface AUMFlowSource {
  source: string;
  amount: number;
  percentage: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  topContributors: {
    name: string;
    amount: number;
  }[];
}

// Drill-Down Modal View Type
export type DrillDownView =
  | 'product_mix_by_client'
  | 'aum_sources'
  | 'target_vs_actual'
  | 'rm_performance'
  | 'lead_details'
  | 'client_list'
  | 'closure_timeline'
  | 'churn_analysis';

// Drill-Down Modal Data
export interface DrillDownModalData {
  view: DrillDownView;
  title: string;
  subtitle?: string;
  data: unknown; // Flexible data structure based on view type
  exportable: boolean;
  tabs?: string[];
  dataSource?: string;
}

// RM Performance Detail
export interface RMPerformanceDetail extends RMPerformance {
  targetAUM: number;
  achievementRate: number; // percentage
  leadsAssigned: number;
  leadsConverted: number;
  conversionRate: number; // percentage
  avgLeadTimeToClose: number; // days
  churnRate: number; // percentage
  region: string;
  productsOffered: KairosCapitalProduct[];
}

// Churn Score Data
export interface ChurnScore {
  clientId: string;
  clientName: string;
  score: number; // 0-100 (higher = higher risk)
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  factors: {
    factor: string;
    weight: number;
    contribution: number;
  }[];
  recommendedActions: string[];
  assignedRM: string;
  lastUpdated: Date;
}

// Middle East Region Cities
export const MIDDLE_EAST_CITIES = [
  'Dubai',
  'Abu Dhabi',
  'Riyadh',
  'Jeddah',
  'Doha',
  'Kuwait City',
  'Manama',
  'Muscat',
  'Sharjah',
  'Al Ain',
  'Dammam',
  'Mecca',
  'Medina',
  'Ras Al Khaimah',
  'Fujairah'
] as const;

export type MiddleEastCity = typeof MIDDLE_EAST_CITIES[number];

// Enhanced Executive Metrics with new fields
export interface EnhancedExecutiveMetrics extends ExecutiveMetrics {
  // New metrics from client feedback
  targetAUM: string;
  aumPerRM: string;
  totalLeads: number;
  targetLeadsPerQuarter: number;
  totalUHNWClients: number;
  avgLeadTimeToClosurePerRM: number; // days
  avgChurnScore: number; // 0-100

  // Drill-down data
  aumFlowSources?: AUMFlowSource[];
  clientProductMix?: ClientProductMix[];
  prospectiveProducts?: ProspectiveProductMix[];
  liquidityTriggers?: LiquidityTrigger[];
  rmPerformanceDetails?: RMPerformanceDetail[];
  churnScores?: ChurnScore[];
}

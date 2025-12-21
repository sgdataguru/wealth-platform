/**
 * @file types/dashboard.types.ts
 * @description Type definitions for RM Home Dashboard - "Morning Cockpit"
 * @module types/dashboard
 */

// ============================================
// AI ENGAGEMENT SUGGESTIONS
// ============================================

export type SuggestionType =
  | 'liquidity_event'
  | 'yield_mismatch'
  | 'portfolio_gap'
  | 'client_engagement'
  | 'life_event'
  | 'risk_alert';

export type SuggestionPriority = 'high' | 'medium' | 'low';

export interface ActionButton {
  label: string;
  action: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface Suggestion {
  id: string;
  type: SuggestionType;
  priority: SuggestionPriority;
  clientName: string;
  clientId: string;
  clientContext: string;
  suggestedAction: string;
  reasoning: string;
  actionButtons: ActionButton[];
  createdAt: Date;
  expiresAt?: Date;
}

// ============================================
// IMMEDIATE ACTIONS & ALERTS
// ============================================

export type AlertSeverity = 'critical' | 'warning';

export type AlertType =
  | 'kyc_overdue'
  | 'margin_call'
  | 'document_signing'
  | 'document_expiry'
  | 'aml_block'
  | 'compliance_review'
  | 'portfolio_rebalance';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  type: AlertType;
  title: string;
  clientName: string;
  clientId: string;
  details: string;
  actionRequired: string;
  dueDate?: Date;
  createdAt: Date;
  isDismissed?: boolean;
  dismissedAt?: Date;
  isAcknowledged?: boolean;
  acknowledgedAt?: Date;
}

// ============================================
// TODAY'S AGENDA & CONTEXT
// ============================================

export type MeetingStatus = 'pending' | 'ready' | 'in_progress' | 'completed';

export interface AgendaItem {
  id: string;
  time: string; // Format: "09:30 AM"
  title: string;
  clientName: string;
  clientId: string;
  location: string; // "Zoom", "Office", "Client Site"
  aiContextNote?: string;
  status: MeetingStatus;
  duration?: number; // in minutes
  meetingLink?: string;
}

export type LifeEventType = 'birthday' | 'anniversary' | 'graduation' | 'achievement';

export interface LifeEvent {
  id: string;
  type: LifeEventType;
  clientName: string;
  clientId: string;
  title: string;
  date: Date;
  suggestion?: string;
  hasGiftSent?: boolean;
}

// ============================================
// MARKET INSIGHTS & OPPORTUNITIES
// ============================================

export type AssetClass =
  | 'indian_equities'
  | 'currency'
  | 'commodities'
  | 'real_estate';

export interface MarketInsight {
  id: string;
  assetClass: AssetClass;
  headline: string;
  context: string;
  portfolioSuggestion: string;
  change: number; // percentage change
  changeDirection: 'up' | 'down' | 'neutral';
  lastUpdated: Date;
  isClientRelevant?: boolean;
  affectedClients?: number;
}

// ============================================
// RM METRICS BAR
// ============================================

export interface RMDashboardMetrics {
  rmName: string;
  greeting: string; // "Good morning", "Good afternoon", "Good evening"
  
  // Portfolio metrics
  totalAUM: string;
  aumChange: number; // percentage
  netNewMoney: string;
  netNewMoneyChange: number;
  
  // Client metrics
  totalClients: number;
  atRiskClients: number;
  
  // Alert counts
  criticalAlerts: number;
  warningAlerts: number;
  
  // Activity metrics
  meetingsToday: number;
  followUpsDue: number;
  
  // Updated timestamp
  lastUpdated: Date;
}

// ============================================
// DASHBOARD STATE
// ============================================

export interface DashboardData {
  metrics: RMDashboardMetrics;
  suggestions: Suggestion[];
  alerts: Alert[];
  agenda: AgendaItem[];
  lifeEvents: LifeEvent[];
  marketInsights: MarketInsight[];
}

export interface DashboardState extends DashboardData {
  isLoading: boolean;
  error: string | null;
  lastRefresh: Date | null;
}

// ============================================
// USER PREFERENCES
// ============================================

export type ColumnId = 'suggestions' | 'alerts' | 'agenda' | 'market';

export interface ColumnPreference {
  id: ColumnId;
  order: number;
  isVisible: boolean;
  isExpanded: boolean;
}

export interface DashboardPreferences {
  columnOrder: ColumnPreference[];
  autoRefreshEnabled: boolean;
  refreshInterval: number; // in seconds
  notificationsEnabled: boolean;
  compactMode: boolean;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface SuggestionsResponse {
  success: boolean;
  data?: {
    suggestions: Suggestion[];
    total: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface AlertsResponse {
  success: boolean;
  data?: {
    alerts: Alert[];
    urgentCount: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface AgendaResponse {
  success: boolean;
  data?: {
    meetings: AgendaItem[];
    lifeEvents: LifeEvent[];
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface MarketInsightsResponse {
  success: boolean;
  data?: {
    insights: MarketInsight[];
    lastRefresh: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface DashboardMetricsResponse {
  success: boolean;
  data?: RMDashboardMetrics;
  error?: {
    code: string;
    message: string;
  };
}

// ============================================
// ACTION TYPES
// ============================================

export type DashboardActionType =
  | 'suggestion_viewed'
  | 'suggestion_actioned'
  | 'alert_dismissed'
  | 'alert_acknowledged'
  | 'meeting_joined'
  | 'gift_sent'
  | 'context_viewed';

export interface DashboardAction {
  type: DashboardActionType;
  itemId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

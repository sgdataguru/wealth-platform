/**
 * @file types/index.ts
 * @description Type definitions for UHNW Liquidity Intelligence Platform
 */

// Signal severity levels
export type SignalSeverity = 'critical' | 'high' | 'medium' | 'low';

// Signal type definitions
export interface Signal {
  id: string;
  type: string;
  severity: SignalSeverity;
  title: string;
  description: string;
  source: string;
  createdAt: Date;
  isActioned: boolean;
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

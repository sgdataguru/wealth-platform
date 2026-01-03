/**
 * @file lib/mock-data/dashboard-mock-data.ts
 * @description Mock data for RM Home Dashboard - "Morning Cockpit"
 */

import type {
  Suggestion,
  Alert,
  AgendaItem,
  LifeEvent,
  MarketInsight,
  RMDashboardMetrics,
} from '@/types/dashboard.types';

// ============================================
// HELPER FUNCTIONS
// ============================================

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getTimeString(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
}

// ============================================
// MOCK RM METRICS
// ============================================

export const mockRMMetrics: RMDashboardMetrics = {
  rmName: 'Priya Sharma',
  greeting: getGreeting(),
  totalAUM: '$2,450 Million',
  aumChange: 12.5,
  netNewMoney: '$180 Million',
  netNewMoneyChange: 8.3,
  totalClients: 42,
  atRiskClients: 3,
  criticalAlerts: 2,
  warningAlerts: 5,
  meetingsToday: 4,
  followUpsDue: 7,
  lastUpdated: new Date(),
};

// ============================================
// MOCK AI SUGGESTIONS
// ============================================

export const mockSuggestions: Suggestion[] = [
  {
    id: 'sug-001',
    type: 'liquidity_event',
    priority: 'high',
    clientName: 'Ahmad Al Maktoum',
    clientId: 'client-001',
    clientContext: 'IPO filing next month, estimated $450 Million liquidity event',
    suggestedAction: 'Schedule wealth planning discussion for post-IPO asset allocation',
    reasoning: 'Client\'s company filed DRHP yesterday. Lock-in expires in 6 months, creating significant liquidity event opportunity.',
    actionButtons: [
      { label: 'Draft Proposal', action: 'draft_proposal', variant: 'primary' },
      { label: 'Call Client', action: 'call_client', variant: 'secondary' },
      { label: 'Schedule Meeting', action: 'schedule_meeting', variant: 'secondary' },
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 'sug-002',
    type: 'yield_mismatch',
    priority: 'high',
    clientName: 'Hessa Al Nahyan',
    clientId: 'client-002',
    clientContext: '$85 Million in savings account yielding 3.5%, missing 5% FD opportunity',
    suggestedAction: 'Propose ladder FD structure to optimize yield while maintaining liquidity',
    reasoning: 'Client has significant idle cash. Market FD rates at 7.5% represent $3.4 Million/year additional income opportunity.',
    actionButtons: [
      { label: 'Create FD Proposal', action: 'create_fd_proposal', variant: 'primary' },
      { label: 'Send Email', action: 'send_email', variant: 'secondary' },
    ],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: 'sug-003',
    type: 'portfolio_gap',
    priority: 'medium',
    clientName: 'Khalid Al Thani',
    clientId: 'client-003',
    clientContext: 'Zero gold allocation in $300 Million portfolio, high AED cash exposure',
    suggestedAction: 'Propose 5% gold allocation via Gold ETFs for portfolio diversification',
    reasoning: 'Portfolio heavily concentrated in equities (75%) and real estate (25%). Gold can provide currency hedge and diversification.',
    actionButtons: [
      { label: 'Build Portfolio', action: 'build_portfolio', variant: 'primary' },
      { label: 'View Analysis', action: 'view_analysis', variant: 'secondary' },
    ],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 'sug-004',
    type: 'client_engagement',
    priority: 'medium',
    clientName: 'Hamad Al Mansouri',
    clientId: 'client-004',
    clientContext: 'No contact in 45 days, portfolio review pending',
    suggestedAction: 'Schedule quarterly review call to discuss market outlook and portfolio performance',
    reasoning: 'Last interaction was 6 weeks ago. Regular touch-base maintains relationship strength and prevents churn.',
    actionButtons: [
      { label: 'Schedule Call', action: 'schedule_call', variant: 'primary' },
      { label: 'Send Update', action: 'send_update', variant: 'secondary' },
    ],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
  {
    id: 'sug-005',
    type: 'life_event',
    priority: 'low',
    clientName: 'Latifa Al Qasimi',
    clientId: 'client-005',
    clientContext: 'Daughter graduating from Stanford next month',
    suggestedAction: 'Send congratulations note and discuss education funding for younger son',
    reasoning: 'Life events create natural engagement opportunities. Younger son is 14, college funding planning is timely.',
    actionButtons: [
      { label: 'Send Note', action: 'send_note', variant: 'primary' },
      { label: 'Plan Follow-up', action: 'plan_followup', variant: 'secondary' },
    ],
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
  },
];

// ============================================
// MOCK ALERTS
// ============================================

export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    severity: 'critical',
    type: 'kyc_overdue',
    title: 'KYC Renewal Overdue',
    clientName: 'Ravi Shankar',
    clientId: 'client-006',
    details: 'KYC documents expired 5 days ago. Account restrictions will apply in 10 days.',
    actionRequired: 'Contact client immediately to schedule KYC renewal appointment',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isDismissed: false,
    isAcknowledged: false,
  },
  {
    id: 'alert-002',
    severity: 'critical',
    type: 'margin_call',
    title: 'Margin Call Alert',
    clientName: 'Deepak Agarwal',
    clientId: 'client-007',
    details: 'Portfolio margin below minimum requirement. Current: 35%, Required: 40%',
    actionRequired: 'Client must add $12 Million collateral or liquidate positions by EOD',
    dueDate: new Date(Date.now() + 8 * 60 * 60 * 1000), // End of today
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isDismissed: false,
    isAcknowledged: false,
  },
  {
    id: 'alert-003',
    severity: 'warning',
    type: 'document_signing',
    title: 'Investment Proposal Pending Signature',
    clientName: 'Kavita Deshmukh',
    clientId: 'client-008',
    details: 'Real estate investment proposal sent 7 days ago, awaiting e-signature',
    actionRequired: 'Follow up on $50 Million real estate deal before opportunity expires',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isDismissed: false,
    isAcknowledged: false,
  },
  {
    id: 'alert-004',
    severity: 'warning',
    type: 'document_expiry',
    title: 'Power of Attorney Expiring Soon',
    clientName: 'Amit Kapoor',
    clientId: 'client-009',
    details: 'Trading authorization expires in 15 days',
    actionRequired: 'Send renewal documents to client',
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isDismissed: false,
    isAcknowledged: false,
  },
  {
    id: 'alert-005',
    severity: 'warning',
    type: 'aml_block',
    title: 'AML Review Required',
    clientName: 'Nisha Gupta',
    clientId: 'client-010',
    details: 'Large cash deposit ($2 Million) flagged for enhanced due diligence',
    actionRequired: 'Submit source of funds documentation to compliance',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    isDismissed: false,
    isAcknowledged: false,
  },
  {
    id: 'alert-006',
    severity: 'warning',
    type: 'compliance_review',
    title: 'Quarterly Portfolio Review Due',
    clientName: 'Rohit Verma',
    clientId: 'client-011',
    details: 'Mandatory portfolio suitability review due by month-end',
    actionRequired: 'Schedule review meeting and prepare risk assessment',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isDismissed: false,
    isAcknowledged: false,
  },
  {
    id: 'alert-007',
    severity: 'warning',
    type: 'portfolio_rebalance',
    title: 'Portfolio Drift Alert',
    clientName: 'Anjali Mehta',
    clientId: 'client-012',
    details: 'Equity allocation 85% vs target 70% due to market gains',
    actionRequired: 'Propose rebalancing to restore target allocation',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isDismissed: false,
    isAcknowledged: false,
  },
];

// ============================================
// MOCK AGENDA ITEMS
// ============================================

export const mockAgendaItems: AgendaItem[] = [
  {
    id: 'agenda-001',
    time: getTimeString(9, 30),
    title: 'Portfolio Review Meeting',
    clientName: 'Ahmad Al Maktoum',
    clientId: 'client-001',
    location: 'Zoom',
    aiContextNote: 'Discuss IPO liquidity planning. Client concerned about tax optimization. Prepared 3 allocation scenarios.',
    status: 'ready',
    duration: 60,
    meetingLink: 'https://zoom.us/j/123456789',
  },
  {
    id: 'agenda-002',
    time: getTimeString(11, 0),
    title: 'New Client Onboarding',
    clientName: 'Pradeep Singh',
    clientId: 'client-013',
    location: 'Office - Conference Room A',
    aiContextNote: 'First meeting. Referred by Khalid Al Thani. Tech entrepreneur, recent exit. Focus on wealth preservation.',
    status: 'pending',
    duration: 90,
  },
  {
    id: 'agenda-003',
    time: getTimeString(14, 30),
    title: 'Real Estate Investment Discussion',
    clientName: 'Kavita Deshmukh',
    clientId: 'client-008',
    location: 'Client Site - Dubai Waterfront',
    aiContextNote: 'Follow-up on $50 Million Dubai property opportunity. Bring updated valuation report and rental yield analysis.',
    status: 'pending',
    duration: 45,
  },
  {
    id: 'agenda-004',
    time: getTimeString(16, 0),
    title: 'Quarterly Performance Review',
    clientName: 'Hamad Al Mansouri',
    clientId: 'client-004',
    location: 'Zoom',
    aiContextNote: 'Q4 portfolio review. Portfolio up 18% YTD. Client interested in private credit opportunities.',
    status: 'pending',
    duration: 45,
    meetingLink: 'https://zoom.us/j/987654321',
  },
];

// ============================================
// MOCK LIFE EVENTS
// ============================================

export const mockLifeEvents: LifeEvent[] = [
  {
    id: 'life-001',
    type: 'birthday',
    clientName: 'Hessa Al Nahyan',
    clientId: 'client-002',
    title: 'Birthday - 55th',
    date: new Date(),
    suggestion: 'Send premium gift hamper and schedule retirement planning discussion',
    hasGiftSent: false,
  },
  {
    id: 'life-002',
    type: 'anniversary',
    clientName: 'Khalid Al Thani',
    clientId: 'client-003',
    title: '25th Wedding Anniversary',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    suggestion: 'Send congratulations card and consider estate planning review',
    hasGiftSent: false,
  },
  {
    id: 'life-003',
    type: 'graduation',
    clientName: 'Latifa Al Qasimi',
    clientId: 'client-005',
    title: 'Daughter\'s MBA Graduation',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    suggestion: 'Send congratulations note and discuss succession planning',
    hasGiftSent: false,
  },
];

// ============================================
// MOCK MARKET INSIGHTS
// ============================================

export const mockMarketInsights: MarketInsight[] = [
  {
    id: 'market-001',
    assetClass: 'middle_east_equities',
    headline: 'DFM General Index Surges on Strong Regional Growth',
    context: 'Index gains 2.3% this week driven by banking and real estate sector strength. Foreign inflows reach $12,000 Million in December.',
    portfolioSuggestion: '3 of your clients are underweight equities vs. their target allocation. Consider selective rebalancing.',
    change: 2.3,
    changeDirection: 'up',
    lastUpdated: new Date(),
    isClientRelevant: true,
    affectedClients: 3,
  },
  {
    id: 'market-002',
    assetClass: 'currency',
    headline: 'USD/AED Remains Stable at Peg',
    context: 'Dirham maintains stability at 3.67 AED per USD. Regional currency hedging strategies remain favorable for international portfolios.',
    portfolioSuggestion: 'Clients with multi-currency exposure benefit from stable AED peg. Consider regional diversification.',
    change: 0.0,
    changeDirection: 'neutral',
    lastUpdated: new Date(),
    isClientRelevant: true,
    affectedClients: 12,
  },
  {
    id: 'market-003',
    assetClass: 'commodities',
    headline: 'Gold Prices Rally 1.5% on Global Uncertainty',
    context: 'Gold at $62,500/10g as geopolitical tensions drive safe-haven demand. Silver outperforms with 2.1% gain.',
    portfolioSuggestion: 'Clients seeking portfolio diversification can add 5-10% gold allocation via SGBs or Digital Gold.',
    change: 1.5,
    changeDirection: 'up',
    lastUpdated: new Date(),
    isClientRelevant: true,
    affectedClients: 8,
  },
  {
    id: 'market-004',
    assetClass: 'real_estate',
    headline: 'Dubai Prime Real Estate Yields Compress to 3.2%',
    context: 'Luxury residential segment sees strong demand. Capital values up 8% YoY but rental yields declining.',
    portfolioSuggestion: '2 clients considering Dubai property purchases. Recommend focus on appreciation over yield.',
    change: 8.0,
    changeDirection: 'up',
    lastUpdated: new Date(),
    isClientRelevant: true,
    affectedClients: 2,
  },
];

// ============================================
// MOCK API FUNCTIONS
// ============================================

export async function fetchRMMetrics(): Promise<RMDashboardMetrics> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockRMMetrics;
}

export async function fetchSuggestions(): Promise<Suggestion[]> {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockSuggestions;
}

export async function fetchAlerts(): Promise<Alert[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockAlerts;
}

export async function fetchAgenda(): Promise<{ meetings: AgendaItem[]; lifeEvents: LifeEvent[] }> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    meetings: mockAgendaItems,
    lifeEvents: mockLifeEvents,
  };
}

export async function fetchMarketInsights(): Promise<MarketInsight[]> {
  await new Promise(resolve => setTimeout(resolve, 700));
  return mockMarketInsights;
}

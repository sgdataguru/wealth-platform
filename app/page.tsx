/**
 * @file page.tsx
 * @description Main dashboard page for UHNW Liquidity Intelligence Platform
 */

import { Header, Sidebar } from './components/layout';
import { ProspectCard, AIChatbot } from './components/features';
import { Card, Button, SignalBadge } from './components/ui';
import type { Prospect, Signal, ActivityItem, DashboardMetrics } from '@/types';

// Mock data for demonstration
const mockMetrics: DashboardMetrics = {
  totalLeads: 1247,
  leadsGrowth: '+12%',
  newToday: 23,
  newTodayChange: 5,
  signalsDetected: 156,
  signalsGrowth: '+8%',
  followUps: 18,
  followUpsDueToday: true,
};

const mockProspects: Prospect[] = [
  {
    id: '1',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    initials: 'RK',
    title: 'Director',
    company: 'Tech Innovations Pvt Ltd',
    location: 'Mumbai',
    sector: 'Technology',
    network: 'TiE',
    email: 'rajesh@techinnovations.com',
    phone: '+91 98765 43210',
    leadScore: 92,
    scoreCategory: 'excellent',
    scoreBreakdown: [
      { label: 'IPO Filing', points: 40, description: 'Company filed DRHP' },
      { label: 'Series C Funding', points: 30, description: 'Raised $50M from Sequoia' },
      { label: 'Network Strength', points: 15, description: '12 UHNW connections' },
      { label: 'Sector Growth', points: 7, description: '24% YoY growth' },
    ],
    signals: [
      { id: 's1', type: 'ipo', severity: 'critical', title: 'IPO Filing', description: 'Filed DRHP with SEBI', source: 'Exchange Data', createdAt: new Date('2024-12-15'), isActioned: false },
      { id: 's2', type: 'funding', severity: 'medium', title: 'Funding Round', description: 'Series C at $50M', source: 'PrivateCircle', createdAt: new Date('2024-12-10'), isActioned: true },
      { id: 's3', type: 'board', severity: 'low', title: 'Board Change', description: 'New independent director', source: 'Zauba Corp', createdAt: new Date('2024-11-28'), isActioned: true },
    ],
    lastContacted: new Date('2024-12-14'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: '2',
    firstName: 'Anita',
    lastName: 'Patel',
    initials: 'AP',
    title: 'CEO',
    company: 'FinServ Holdings Ltd',
    location: 'Delhi',
    sector: 'Finance',
    network: 'YPO',
    email: 'anita@finservholdings.com',
    phone: '+91 98765 43211',
    leadScore: 87,
    scoreCategory: 'good',
    scoreBreakdown: [
      { label: 'Acquisition Talks', points: 35, description: 'In talks with PE firms' },
      { label: 'Revenue Growth', points: 25, description: '35% YoY' },
      { label: 'Network Strength', points: 20, description: '8 UHNW connections' },
      { label: 'Market Position', points: 7, description: 'Top 10 in sector' },
    ],
    signals: [
      { id: 's4', type: 'acquisition', severity: 'high', title: 'Acquisition', description: 'PE firm discussions', source: 'VCCircle', createdAt: new Date('2024-12-12'), isActioned: false },
    ],
    lastContacted: new Date('2024-12-10'),
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-12-12'),
  },
];

const mockRecentSignals: Signal[] = [
  { id: 'rs1', type: 'ipo', severity: 'critical', title: 'IPO Filing', description: 'Tech Innovations', source: 'Exchange Data', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), isActioned: false },
  { id: 'rs2', type: 'funding', severity: 'medium', title: 'Funding Round', description: 'GreenEnergy Ltd', source: 'PrivateCircle', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), isActioned: false },
  { id: 'rs3', type: 'acquisition', severity: 'high', title: 'Acquisition', description: 'FinServ Holdings', source: 'VCCircle', createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), isActioned: false },
];

const mockActivityFeed: ActivityItem[] = [
  { id: 'a1', message: 'You marked Rajesh Kumar as "Contacted"', timestamp: '2h ago', type: 'contact' },
  { id: 'a2', message: 'New signal for Anita Patel portfolio', timestamp: '3h ago', type: 'signal' },
  { id: 'a3', message: 'Follow-up reminder: Vikram Rao - Due tomorrow', timestamp: '5h ago', type: 'reminder' },
];

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
}

export default function Dashboard() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header userName="John Smith" userInitials="JS" />
      
      <div className="flex">
        <Sidebar activePage="home" />
        
        <main className="flex-1 p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                  Good morning, John
                </h1>
                <p className="text-[#5A6C7D] mt-1">
                  Here is your daily intelligence summary
                </p>
              </div>
              <span className="text-[#8E99A4]">{currentDate}</span>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                  Total Leads
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-[#1A1A2E]">
                    {mockMetrics.totalLeads.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {mockMetrics.leadsGrowth}
                  </span>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                  New Today
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-[#1A1A2E]">
                    {mockMetrics.newToday}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    +{mockMetrics.newTodayChange}
                  </span>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                  Signals Detected
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-[#1A1A2E]">
                    {mockMetrics.signalsDetected}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {mockMetrics.signalsGrowth}
                  </span>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                  Follow Ups
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-[#1A1A2E]">
                    {mockMetrics.followUps}
                  </span>
                  <span className="text-sm font-medium text-[#C9A227]">
                    Due today
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Prospects */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                  Top Prospects
                </h2>
                <span className="text-sm text-[#5A6C7D]">By Lead Score</span>
              </div>
              
              <div className="space-y-4">
                {mockProspects.map((prospect) => (
                  <div
                    key={prospect.id}
                    className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-lg hover:bg-[#EFF1F3] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#0A1628] text-white flex items-center justify-center font-semibold text-sm">
                        {prospect.initials}
                      </div>
                      <div>
                        <p className="font-medium text-[#1A1A2E]">
                          {prospect.firstName} {prospect.lastName}
                        </p>
                        <p className="text-sm text-[#5A6C7D]">{prospect.company}</p>
                        <p className="text-xs text-[#8E99A4]">
                          {prospect.location} | {prospect.sector}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${
                        prospect.leadScore >= 90 ? 'text-[#C9A227]' : 
                        prospect.leadScore >= 70 ? 'text-[#1E3A5F]' : 'text-[#5A6C7D]'
                      }`}>
                        {prospect.leadScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="ghost" className="w-full mt-4">
                View All Prospects →
              </Button>
            </Card>

            {/* Recent Signals */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                  Recent Signals
                </h2>
              </div>
              
              <div className="space-y-4">
                {mockRecentSignals.map((signal) => (
                  <div
                    key={signal.id}
                    className="flex items-start gap-4 p-4 bg-[#F8F9FA] rounded-lg"
                  >
                    <SignalBadge severity={signal.severity} label={signal.title} compact />
                    <div className="flex-1">
                      <p className="font-medium text-[#1A1A2E]">{signal.description}</p>
                      <p className="text-sm text-[#8E99A4]">
                        {formatTimeAgo(signal.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="ghost" className="w-full mt-4">
                <a href="/signals" className="block w-full">View All Signals →</a>
              </Button>
            </Card>
          </div>

          {/* Activity Feed */}
          <Card padding="lg">
            <h2 className="text-xl font-semibold text-[#1A1A2E] mb-6 font-[family-name:var(--font-playfair)]">
              Activity Feed
            </h2>
            
            <div className="space-y-3">
              {mockActivityFeed.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'contact' ? 'bg-[#28A745]' :
                    activity.type === 'signal' ? 'bg-[#FFC107]' :
                    'bg-[#17A2B8]'
                  }`} />
                  <span className="text-[#1A1A2E]">{activity.message}</span>
                  <span className="text-sm text-[#8E99A4] ml-auto">
                    {activity.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}

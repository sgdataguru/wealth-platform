/**
 * @file app/(dashboard)/rm/page.tsx
 * @description Relationship Manager Dashboard
 */

'use client';

import { Header, Sidebar } from '@/app/components/layout';
import RMHeroMetrics from './components/RMHeroMetrics';
import MyPipeline from './components/MyPipeline';
import { Card } from '@/app/components/ui';
import { ProspectDetailPanel } from '@/app/components/features';
import { usePanelStore } from '@/store/panel-store';
import { useRMMetrics } from '@/app/hooks/useRMMetrics';
import { useLoginNotification } from '@/app/hooks/useLoginNotification';
import SuggestionsSection from '@/app/components/suggestions/SuggestionsSection';
import FloatingChatbot from '@/app/components/features/FloatingChatbot';
import DashboardGrid from './components/DashboardGrid';
import AIEngagementColumn from './components/AIEngagementColumn';
import ImmediateActionsColumn from './components/ImmediateActionsColumn';
import TodayAgendaColumn from './components/TodayAgendaColumn';
import MarketInsightsColumn from './components/MarketInsightsColumn';
import { useDashboardData } from '@/app/hooks/useDashboardData';
import type { Prospect } from '@/types';

// Mock prospects for RM's book
const mockRMProspects: Prospect[] = [
    {
        id: '1',
        firstName: 'Faisal',
        lastName: 'Al-Nuaimi',
        initials: 'FA',
        title: 'Director',
        company: 'Harbor Tech Solutions DMCC',
        location: 'Dubai',
        sector: 'Technology',
        network: 'DIFC FinTech Circle',
        email: 'faisal@harbortech.ae',
        phone: '+971 50 321 4567',
        leadScore: 92,
        scoreCategory: 'excellent',
        scoreBreakdown: [
            { label: 'IPO Prospectus', points: 40, description: 'Company filed prospectus with SCA' },
            { label: 'Series C Funding', points: 30, description: 'Raised $65M led by Mubadala Capital' },
        ],
        signals: [
            { id: 's1', type: 'ipo', severity: 'critical', title: 'IPO Filing', description: 'Filed prospectus with UAE SCA', source: 'Exchange Data', createdAt: new Date('2024-12-15'), isActioned: false },
        ],
        lastContacted: new Date('2024-12-14'),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-15'),
        estWealth: 'AED 450M',
        myShare: 'AED 180M',
        sharePercentage: 40,
    },
];

export default function RMDashboard() {
    const { metrics, isLoading } = useRMMetrics();
    const { selectedProspectId } = usePanelStore();
    const selectedProspect = mockRMProspects.find(p => p.id === selectedProspectId);
    
    // Login notification hook - shows notification 15 seconds after dashboard loads
    const {
        showNotification,
        message: notificationMessage,
        dismissNotification,
    } = useLoginNotification('rm');

    // Dashboard data for action grid
    const {
        suggestions,
        alerts,
        agenda,
        lifeEvents,
        marketInsights,
        isLoading: dashboardLoading,
    } = useDashboardData();

    // Action handlers
    // TODO: Implement proper business logic with API calls
    const handleSuggestionAction = (suggestionId: string, action: string) => {
        console.log('Suggestion action:', { suggestionId, action });
        // TODO: Call API to record action and update suggestion state
    };

    const handleAlertDismiss = (alertId: string) => {
        console.log('Alert dismissed:', alertId);
        // TODO: Call API to dismiss alert
    };

    const handleAlertAcknowledge = (alertId: string) => {
        console.log('Alert acknowledged:', alertId);
        // TODO: Call API to acknowledge alert
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <Header 
                showNotification={showNotification}
                notificationMessage={notificationMessage}
                onNotificationDismiss={dismissNotification}
            />

            <div className="flex">
                <Sidebar activePage="rm-dashboard" />

                <main className="flex-1 p-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                            Morning Faisal, Welcome to Cockpit
                        </h1>
                        <p className="text-[#5A6C7D] mt-1">
                            Below are your triggers. There are 7 Actions for the day. If you have any questions, happy to chat. Have a Great Day.
                        </p>
                    </div>

                    {/* Hero Metrics */}
                    <RMHeroMetrics metrics={metrics} isLoading={isLoading} />

                    {/* My Pipeline */}
                    <MyPipeline />

                    {/* Visual Pipeline & Action Dashboard Grid */}
                    <div className="mb-8">
                        <DashboardGrid>
                            {/* Column 1: AI Engagement Suggestions (Prospects - Liquidity Events) */}
                            <AIEngagementColumn
                                suggestions={suggestions}
                                isLoading={dashboardLoading}
                                onAction={handleSuggestionAction}
                            />

                            {/* Column 2: Immediate Actions (Critical & Warning Alerts) */}
                            <ImmediateActionsColumn
                                alerts={alerts}
                                isLoading={dashboardLoading}
                                onDismiss={handleAlertDismiss}
                                onAcknowledge={handleAlertAcknowledge}
                            />

                            {/* Column 3: Today's Agenda (Meetings & Life Events) */}
                            <TodayAgendaColumn
                                meetings={agenda}
                                lifeEvents={lifeEvents}
                                isLoading={dashboardLoading}
                            />

                            {/* Column 4: Market Insights (Asset Class Updates & Opportunities) */}
                            <MarketInsightsColumn
                                insights={marketInsights}
                                isLoading={dashboardLoading}
                            />
                        </DashboardGrid>
                    </div>

                    {/* Engagement Suggestions */}
                    <div className="mb-8">
                        <SuggestionsSection limit={3} />
                    </div>

                    {/* Recent Activity */}
                    <Card padding="lg">
                        <h2 className="text-xl font-semibold text-[#1A1A2E] mb-6 font-[family-name:var(--font-playfair)]">
                            This Week&apos;s Activity
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                                    Calls Made
                                </span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-[#1A1A2E]">
                                        {metrics?.callsMadeThisWeek || 0}
                                    </span>
                                    <span className="text-sm text-[#28A745]">+3 vs last week</span>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                                    Emails Sent
                                </span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-[#1A1A2E]">
                                        {metrics?.emailsSentThisWeek || 0}
                                    </span>
                                    <span className="text-sm text-[#28A745]">+2 vs last week</span>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                                    Meetings Scheduled
                                </span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-[#1A1A2E]">
                                        {metrics?.meetingsScheduled || 0}
                                    </span>
                                    <span className="text-sm text-[#5A6C7D]">this week</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </main>
            </div>

            {/* Prospect Detail Panel */}
            {selectedProspect && <ProspectDetailPanel prospect={selectedProspect} />}

            {/* Floating AI Chatbot */}
            <FloatingChatbot userRole="rm" />
        </div>
    );
}

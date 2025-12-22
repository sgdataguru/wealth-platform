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
import SuggestionsSection from '@/app/components/suggestions/SuggestionsSection';
import FloatingChatbot from '@/app/components/features/FloatingChatbot';
import type { Prospect } from '@/types';

// Mock prospects for RM's book
const mockRMProspects: Prospect[] = [
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
        ],
        signals: [
            { id: 's1', type: 'ipo', severity: 'critical', title: 'IPO Filing', description: 'Filed DRHP with SEBI', source: 'Exchange Data', createdAt: new Date('2024-12-15'), isActioned: false },
        ],
        lastContacted: new Date('2024-12-14'),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-15'),
        estWealth: '₹450 Cr',
        myShare: '₹180 Cr',
        sharePercentage: 40,
    },
];

export default function RMDashboard() {
    const { metrics, isLoading } = useRMMetrics();
    const { selectedProspectId } = usePanelStore();
    const selectedProspect = mockRMProspects.find(p => p.id === selectedProspectId);

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <Header />

            <div className="flex">
                <Sidebar activePage="rm-dashboard" />

                <main className="flex-1 p-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                            Your Dashboard
                        </h1>
                        <p className="text-[#5A6C7D] mt-1">
                            Individual performance and active opportunities
                        </p>
                    </div>

                    {/* Hero Metrics */}
                    <RMHeroMetrics metrics={metrics} isLoading={isLoading} />

                    {/* My Pipeline */}
                    <MyPipeline />

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

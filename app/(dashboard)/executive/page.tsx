/**
 * @file app/(dashboard)/executive/page.tsx
 * @description Executive Dashboard for MDs/CXOs
 */

'use client';

import { Header, Sidebar } from '@/app/components/layout';
import EnhancedExecutiveHeroMetrics from './components/EnhancedExecutiveHeroMetrics';
import TeamLeaderboard from './components/TeamLeaderboard';
import ProductMixByClient from './components/ProductMixByClient';
import ProspectiveProductsByLead from './components/ProspectiveProductsByLead';
import AUMTrendChart from './components/AUMTrendChart';
import RegionalBreakdown from './components/RegionalBreakdown';
import ExecutiveActionCenter from './components/ExecutiveActionCenter';
import LiquidityTriggersPanel from './components/LiquidityTriggersPanel';
import FloatingChatbot from '@/app/components/features/FloatingChatbot';
import { useEnhancedExecutiveMetrics } from '@/app/hooks/useEnhancedExecutiveMetrics';
import { useLoginNotification } from '@/app/hooks/useLoginNotification';
import type { RMTask } from '@/types';

// Mock recent RM tasks
const mockRMTasks: RMTask[] = [
    {
        id: 'task-1',
        assignedTo: 'rm-001',
        assignedToName: 'Maha Al-Suwaidi',
        assignedBy: 'exec-001',
        assignedByName: 'Omar Al-Fadl',
        prospectId: 'p-123',
        prospectName: 'GulfTech Innovations LLC',
        taskType: 'followup',
        priority: 'high',
        dueDate: new Date('2024-12-22'),
        status: 'in_progress',
        title: 'Follow up on IPO filing opportunity',
        notes: 'Client filed prospectus with SCA, arrange meeting to discuss wealth management strategy',
        createdAt: new Date('2024-12-18'),
    },
    {
        id: 'task-2',
        assignedTo: 'rm-002',
        assignedToName: 'Yousef Al-Omari',
        assignedBy: 'exec-001',
        assignedByName: 'Omar Al-Fadl',
        taskType: 'proposal',
        priority: 'high',
        dueDate: new Date('2024-12-20'),
        status: 'pending',
        title: 'Prepare proposal for HNI family office',
        notes: 'Family looking to consolidate AED 450M assets',
        createdAt: new Date('2024-12-19'),
    },
    {
        id: 'task-3',
        assignedTo: 'rm-003',
        assignedToName: 'Laila Al-Farsi',
        assignedBy: 'exec-001',
        assignedByName: 'Omar Al-Fadl',
        taskType: 'review',
        priority: 'medium',
        dueDate: new Date('2024-12-15'),
        status: 'overdue',
        title: 'Quarterly portfolio review for top client',
        notes: 'Review needed for AED 280M portfolio',
        createdAt: new Date('2024-12-10'),
    },
    {
        id: 'task-4',
        assignedTo: 'rm-001',
        assignedToName: 'Maha Al-Suwaidi',
        assignedBy: 'exec-001',
        assignedByName: 'Omar Al-Fadl',
        taskType: 'cross_sell',
        priority: 'medium',
        dueDate: new Date('2024-12-25'),
        status: 'pending',
        title: 'Cross-sell Alternative Investments',
        notes: 'Client has high risk appetite, introduce PE/VC opportunities',
        createdAt: new Date('2024-12-19'),
    },
    {
        id: 'task-5',
        assignedTo: 'rm-004',
        assignedToName: 'Khalid Al-Mansouri',
        assignedBy: 'exec-001',
        assignedByName: 'Omar Al-Fadl',
        taskType: 'prospect_call',
        priority: 'low',
        dueDate: new Date('2024-12-28'),
        status: 'completed',
        title: 'Initial call with referred prospect',
        notes: 'Warm intro from existing client',
        createdAt: new Date('2024-12-16'),
        completedAt: new Date('2024-12-18'),
    },
];

export default function ExecutiveDashboard() {
    const { metrics, isLoading, liquidityTriggers } = useEnhancedExecutiveMetrics();
    
    // Login notification hook - shows notification 15 seconds after dashboard loads
    const {
        showNotification,
        message: notificationMessage,
        dismissNotification,
    } = useLoginNotification('executive');

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <Header 
                showNotification={showNotification}
                notificationMessage={notificationMessage}
                onNotificationDismiss={dismissNotification}
            />

            <div className="flex">
                <Sidebar activePage="executive-dashboard" />

                <main className="flex-1 p-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                            Managing Director - Artificial Intelligence Hub
                        </h1>
                        <p className="text-[#5A6C7D] mt-1">
                            Omar Al-Fadl • Gulf Region Performance & Strategic Insights
                        </p>
                    </div>

                    {/* Enhanced Hero Metrics - 10 Clickable Cards */}
                    <EnhancedExecutiveHeroMetrics metrics={metrics} isLoading={isLoading} />

                    {/* Liquidity Triggers Panel - Priority Position */}
                    <div className="mb-8">
                        <LiquidityTriggersPanel triggers={liquidityTriggers || []} isLoading={isLoading} />
                    </div>

                    {/* AUM Trend - Full Width */}
                    <div className="mb-8">
                        <AUMTrendChart data={metrics?.aumTrend} isLoading={isLoading} />
                    </div>

                    {/* Product Mix Components - Side by Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <ProductMixByClient isLoading={isLoading} />
                        <ProspectiveProductsByLead isLoading={isLoading} />
                    </div>

                    {/* Action Center */}
                    <div className="mb-8">
                        <ExecutiveActionCenter recentTasks={mockRMTasks} />
                    </div>

                    {/* Team Performance & Regional Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <TeamLeaderboard topRMs={metrics?.topPerformingRMs} isLoading={isLoading} />
                        <RegionalBreakdown regions={metrics?.regionalBreakdown} isLoading={isLoading} />
                    </div>
                </main>
            </div>

            {/* Floating AI Chatbot */}
            <FloatingChatbot userRole="executive" />
        </div>
    );
}

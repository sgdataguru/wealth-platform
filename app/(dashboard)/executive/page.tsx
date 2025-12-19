/**
 * @file app/(dashboard)/executive/page.tsx
 * @description Executive Dashboard for MDs/CXOs
 */

'use client';

import { Header, Sidebar } from '@/app/components/layout';
import ExecutiveHeroMetrics from './components/ExecutiveHeroMetrics';
import TeamLeaderboard from './components/TeamLeaderboard';
import ProductMixChart from './components/ProductMixChart';
import AUMTrendChart from './components/AUMTrendChart';
import RegionalBreakdown from './components/RegionalBreakdown';
import ExecutiveActionCenter from './components/ExecutiveActionCenter';
import { useExecutiveMetrics } from '@/app/hooks/useExecutiveMetrics';
import type { RMTask } from '@/types';

// Mock recent RM tasks
const mockRMTasks: RMTask[] = [
    {
        id: 'task-1',
        assignedTo: 'rm-001',
        assignedToName: 'Priya Sharma',
        assignedBy: 'exec-001',
        assignedByName: 'Ashish Kehair',
        prospectId: 'p-123',
        prospectName: 'Tech Innovations Pvt Ltd',
        taskType: 'followup',
        priority: 'high',
        dueDate: new Date('2024-12-22'),
        status: 'in_progress',
        title: 'Follow up on IPO filing opportunity',
        notes: 'Client filed DRHP, arrange meeting to discuss wealth management strategy',
        createdAt: new Date('2024-12-18'),
    },
    {
        id: 'task-2',
        assignedTo: 'rm-002',
        assignedToName: 'Vikram Singh',
        assignedBy: 'exec-001',
        assignedByName: 'Ashish Kehair',
        taskType: 'proposal',
        priority: 'high',
        dueDate: new Date('2024-12-20'),
        status: 'pending',
        title: 'Prepare proposal for HNI family office',
        notes: 'Family looking to consolidate ₹450 Cr assets',
        createdAt: new Date('2024-12-19'),
    },
    {
        id: 'task-3',
        assignedTo: 'rm-003',
        assignedToName: 'Anita Patel',
        assignedBy: 'exec-001',
        assignedByName: 'Ashish Kehair',
        taskType: 'review',
        priority: 'medium',
        dueDate: new Date('2024-12-15'),
        status: 'overdue',
        title: 'Quarterly portfolio review for top client',
        notes: 'Review needed for ₹280 Cr portfolio',
        createdAt: new Date('2024-12-10'),
    },
    {
        id: 'task-4',
        assignedTo: 'rm-001',
        assignedToName: 'Priya Sharma',
        assignedBy: 'exec-001',
        assignedByName: 'Ashish Kehair',
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
        assignedToName: 'Rajesh Kumar',
        assignedBy: 'exec-001',
        assignedByName: 'Ashish Kehair',
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
    const { metrics, isLoading } = useExecutiveMetrics();

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <Header />

            <div className="flex">
                <Sidebar activePage="executive-dashboard" />

                <main className="flex-1 p-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                            Executive Dashboard
                        </h1>
                        <p className="text-[#5A6C7D] mt-1">
                            Firm-wide performance and strategic insights
                        </p>
                    </div>

                    {/* Hero Metrics */}
                    <ExecutiveHeroMetrics metrics={metrics} isLoading={isLoading} />

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <AUMTrendChart data={metrics?.aumTrend} isLoading={isLoading} />
                        <ProductMixChart data={metrics?.productMix} isLoading={isLoading} />
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
        </div>
    );
}

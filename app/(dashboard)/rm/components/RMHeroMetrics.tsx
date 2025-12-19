/**
 * @file app/(dashboard)/rm/components/RMHeroMetrics.tsx
 * @description Hero metrics cards for RM dashboard
 */

'use client';

import { Card } from '@/app/components/ui';
import type { RMMetrics } from '@/types';

interface RMHeroMetricsProps {
    metrics: RMMetrics | null;
    isLoading: boolean;
}

export default function RMHeroMetrics({ metrics, isLoading }: RMHeroMetricsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 rounded"></div>
                    </Card>
                ))}
            </div>
        );
    }

    if (!metrics) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* My Clients AUM */}
            <Card>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                        My Clients AUM
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-[#C9A227]">
                            {metrics.myClientsAum}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                        <span className={`text-sm font-medium ${metrics.myClientsAumGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {metrics.myClientsAumGrowth >= 0 ? '↑' : '↓'} {Math.abs(metrics.myClientsAumGrowth)}%
                        </span>
                        <span className="text-xs text-[#8E99A4]">vs last month</span>
                    </div>
                </div>
            </Card>

            {/* Active Opportunities */}
            <Card>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                        Active Opportunities
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-[#1A1A2E]">
                            {metrics.activeOpps}
                        </span>
                    </div>
                    <span className="text-sm text-[#5A6C7D] mt-2">
                        Value: {metrics.activeOppsValue}
                    </span>
                </div>
            </Card>

            {/* Follow-ups Due */}
            <Card>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                        Follow-ups Due
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-[#1A1A2E]">
                            {metrics.followUps}
                        </span>
                        {metrics.followUpsDueToday && (
                            <span className="px-2 py-1 bg-[#FFC107] text-white text-xs rounded-full font-medium">
                                TODAY
                            </span>
                        )}
                    </div>
                    <span className="text-sm text-[#5A6C7D] mt-2">
                        {metrics.followUpsDueToday ? 'Action required' : 'On track'}
                    </span>
                </div>
            </Card>

            {/* Conversion Rate */}
            <Card>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                        Conversion Rate
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-[#1A1A2E]">
                            {metrics.conversionRate}%
                        </span>
                    </div>
                    <span className="text-sm text-[#28A745] mt-2">
                        Above avg (22%)
                    </span>
                </div>
            </Card>
        </div>
    );
}

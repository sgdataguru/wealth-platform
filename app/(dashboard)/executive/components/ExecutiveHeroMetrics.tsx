/**
 * @file app/(dashboard)/executive/components/ExecutiveHeroMetrics.tsx
 * @description Hero metrics for executive dashboard
 */

'use client';

import { Card } from '@/app/components/ui';
import type { ExecutiveMetrics } from '@/types';
import { buildDisplayChange } from '@/lib/utils/currency';

interface ExecutiveHeroMetricsProps {
    metrics: ExecutiveMetrics | null;
    isLoading: boolean;
}

export default function ExecutiveHeroMetrics({ metrics, isLoading }: ExecutiveHeroMetricsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <div className="h-28 bg-gray-200 rounded"></div>
                    </Card>
                ))}
            </div>
        );
    }

    if (!metrics) return null;

    const aumMonthlyChange = buildDisplayChange(metrics.totalAum, metrics.aumGrowth);
    const aumYoyChange = buildDisplayChange(metrics.totalAum, metrics.aumGrowthYoy);
    const formatPercent = (value: number) => Math.abs(value).toFixed(1).replace(/\.0$/, '');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Firm AUM */}
            <Card className="bg-gradient-to-br from-[#1A1332] to-[#2A2447]">
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Firm AUM
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-[#E85D54]">
                            {metrics.totalAum}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`text-sm font-medium ${metrics.aumGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {aumMonthlyChange.direction === 'up' ? '↑' : '↓'} {aumMonthlyChange.formattedChange} ({formatPercent(metrics.aumGrowth)}%) Monthly Change
                        </span>
                        <span className="text-xs text-gray-400">|</span>
                        <span className={`text-sm ${metrics.aumGrowthYoy >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {aumYoyChange.direction === 'up' ? '↑' : '↓'} {aumYoyChange.formattedChange} ({formatPercent(metrics.aumGrowthYoy)}%) YoY Change
                        </span>
                    </div>
                </div>
            </Card>

            {/* Operating Margin */}
            <Card>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                        Operating Margin
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-[#1A1A2E]">
                            {metrics.operatingMargin}%
                        </span>
                    </div>
                    <span className="text-sm text-[#28A745] mt-2">
                        Above target (32%)
                    </span>
                </div>
            </Card>

            {/* ROE */}
            <Card>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                        Return on Equity
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-[#1A1A2E]">
                            {metrics.roe}%
                        </span>
                    </div>
                    <span className="text-sm text-[#5A6C7D] mt-2">
                        Industry leading
                    </span>
                </div>
            </Card>

            {/* Client Retention */}
            <Card>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                        Client Retention
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-[#1A1A2E]">
                            {metrics.clientRetentionRate}%
                        </span>
                    </div>
                    <div className="text-sm text-[#5A6C7D] mt-2">
                        {metrics.uhniClients.toLocaleString()} UHNI clients
                    </div>
                </div>
            </Card>

            {/* Additional row of metrics */}
            <Card>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                        Total RMs
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-[#1A1A2E]">
                            {metrics.totalRMs.toLocaleString()}
                        </span>
                    </div>
                    <span className="text-sm text-[#5A6C7D] mt-2">
                        Avg productivity: {metrics.avgRMProductivity}/100
                    </span>
                </div>
            </Card>

            <Card>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                        AUM per RM
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-[#1A1A2E]">
                            {metrics.aumPerRM}
                        </span>
                    </div>
                    <span className="text-sm text-[#5A6C7D] mt-2">
                        Revenue: {metrics.revenuePerRM}/RM
                    </span>
                </div>
            </Card>

            <Card>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                        Net Inflow
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-[#28A745]">
                            {metrics.netNewMoney}
                        </span>
                    </div>
                    <span className="text-sm text-[#5A6C7D] mt-2">
                        Quarter-to-date
                    </span>
                </div>
            </Card>

            <Card>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                        Total Clients
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-[#1A1A2E]">
                            {(metrics.totalClients / 1000).toFixed(0)}K
                        </span>
                    </div>
                    <div className="flex gap-2 text-xs text-[#5A6C7D] mt-2">
                        <span>HNI: {(metrics.hniClients / 1000).toFixed(0)}K</span>
                        <span>|</span>
                        <span>UHNI: {metrics.uhniClients.toLocaleString()}</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}

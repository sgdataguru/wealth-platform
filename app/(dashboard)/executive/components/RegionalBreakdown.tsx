/**
 * @file app/(dashboard)/executive/components/RegionalBreakdown.tsx
 * @description Regional performance breakdown
 */

'use client';

import { Card } from '@/app/components/ui';
import type { RegionalMetrics } from '@/types';

interface RegionalBreakdownProps {
    regions?: RegionalMetrics[];
    isLoading: boolean;
}

export default function RegionalBreakdown({ regions, isLoading }: RegionalBreakdownProps) {
    if (isLoading) {
        return (
            <Card padding="lg" className="animate-pulse">
                <div className="h-96 bg-gray-200 rounded"></div>
            </Card>
        );
    }

    if (!regions || regions.length === 0) return null;

    const totalAUM = regions.reduce((sum, r) => sum + parseFloat(r.aum.replace(/[₹,\sCrLKk]/g, '')), 0);

    return (
        <Card padding="lg">
            <h3 className="text-xl font-semibold text-[#1A1A2E] mb-6 font-[family-name:var(--font-playfair)]">
                Regional Breakdown
            </h3>

            <div className="space-y-4">
                {regions.map((region) => (
                    <div key={region.region} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <span className="font-semibold text-[#1A1A2E]">{region.region}</span>
                                <span className={`text-sm font-medium ${region.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {region.growth >= 0 ? '↑' : '↓'} {Math.abs(region.growth)}%
                                </span>
                            </div>
                            <span className="font-bold text-[#1A1A2E]">{region.aum}</span>
                        </div>

                        {/* Progress bar */}
                        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#2A2447] to-[#E85D54] transition-all"
                                style={{
                                    width: `${(parseFloat(region.aum.replace(/[₹,\sCrLKk]/g, '')) / totalAUM) * 100}%`,
                                }}
                            />
                        </div>

                        {/* Details */}
                        <div className="flex justify-between text-xs text-[#5A6C7D]">
                            <span>{region.rmCount} RMs</span>
                            <span>{region.clientCount.toLocaleString()} clients</span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

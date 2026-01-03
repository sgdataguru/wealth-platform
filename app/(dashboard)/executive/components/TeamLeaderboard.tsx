/**
 * @file app/(dashboard)/executive/components/TeamLeaderboard.tsx
 * @description Top performing RMs leaderboard
 */

'use client';

import { Card } from '@/app/components/ui';
import { formatCroreToUSD } from '@/lib/utils/currency';
import type { RMPerformance } from '@/types';

interface TeamLeaderboardProps {
    topRMs?: RMPerformance[];
    isLoading: boolean;
}

export default function TeamLeaderboard({ topRMs, isLoading }: TeamLeaderboardProps) {
    if (isLoading) {
        return (
            <Card padding="lg" className="animate-pulse">
                <div className="h-96 bg-gray-200 rounded"></div>
            </Card>
        );
    }

    if (!topRMs || topRMs.length === 0) return null;

    return (
        <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                    Top Performing RMs
                </h3>
                <span className="text-sm text-[#5A6C7D]">This Quarter</span>
            </div>

            <div className="space-y-4">
                {topRMs.map((rm, index) => (
                    <div
                        key={rm.rmId}
                        className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#E85D54] transition-colors"
                    >
                        {/* Rank Badge */}
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${index === 0
                                    ? 'bg-[#E85D54]'
                                    : index === 1
                                        ? 'bg-[#F06E66]'
                                        : index === 2
                                            ? 'bg-[#8E99A4]'
                                            : 'bg-[#5A6C7D]'
                                }`}
                        >
                            {rm.rank}
                        </div>

                        {/* RM Info */}
                        <div className="flex-1">
                            <p className="font-semibold text-[#1A1A2E]">{rm.rmName}</p>
                            <p className="text-sm text-[#5A6C7D]">
                                {rm.clientCount} clients
                            </p>
                        </div>

                        {/* Metrics */}
                        <div className="text-right">
                            <p className="font-bold text-[#1A1A2E]">{formatCroreToUSD(rm.aum)} AUM</p>
                            <p className={`text-sm font-medium ${rm.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {rm.growth >= 0 ? '↑' : '↓'} {Math.abs(rm.growth)}%
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                            Avg Growth
                        </span>
                        <p className="text-2xl font-bold text-[#1A1A2E] mt-1">
                            {formatCroreToUSD(topRMs.reduce((sum, rm) => sum + rm.aum, 0))}
                        </p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                            Total AUM
                        </span>
                        <p className="text-xl font-bold text-[#1A1A2E] mt-1">
                            ${topRMs.reduce((sum, rm) => sum + rm.aum, 0)}M
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

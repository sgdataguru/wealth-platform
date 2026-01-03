/**
 * @file app/(dashboard)/rm/analytics/components/WinLossAnalysis.tsx
 * @description Win/Loss breakdown with reasons
 */

'use client';

import { Card } from '@/app/components/ui';

const winLossData = {
    won: {
        count: 5,
        totalValue: 'AED 245M',
        reasons: [
            { reason: 'Strong relationship', percentage: 40 },
            { reason: 'Competitive pricing', percentage: 30 },
            { reason: 'Quick responsiveness', percentage: 20 },
            { reason: 'Product fit', percentage: 10 },
        ],
    },
    lost: {
        count: 8,
        totalValue: 'AED 180M',
        reasons: [
            { reason: 'Price too high', percentage: 38 },
            { reason: 'Lost to competitor', percentage: 25 },
            { reason: 'Timing not right', percentage: 18 },
            { reason: 'No decision made', percentage: 13 },
            { reason: 'Other', percentage: 6 },
        ],
    },
};

export default function WinLossAnalysis() {
    const totalDeals = winLossData.won.count + winLossData.lost.count;
    const winRate = ((winLossData.won.count / totalDeals) * 100).toFixed(0);

    return (
        <Card padding="lg">
            <h3 className="text-xl font-semibold text-[#1A1A2E] mb-6 font-[family-name:var(--font-playfair)]">
                Win/Loss Analysis
            </h3>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-[#E8F5E9] rounded-lg border border-[#28A745]">
                    <p className="text-xs text-[#28A745] font-semibold">WON</p>
                    <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{winLossData.won.count}</p>
                    <p className="text-sm text-[#5A6C7D] mt-1">{winLossData.won.totalValue}</p>
                    <p className="text-xs text-[#28A745] mt-2">Win Rate: {winRate}%</p>
                </div>

                <div className="p-4 bg-[#FFF3F3] rounded-lg border border-[#DC3545]">
                    <p className="text-xs text-[#DC3545] font-semibold">LOST</p>
                    <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{winLossData.lost.count}</p>
                    <p className="text-sm text-[#5A6C7D] mt-1">{winLossData.lost.totalValue}</p>
                    <p className="text-xs text-[#DC3545] mt-2">Loss Rate: {100 - Number(winRate)}%</p>
                </div>
            </div>

            {/* Won Reasons */}
            <div className="mb-6">
                <h4 className="font-semibold text-[#28A745] mb-3 flex items-center gap-2">
                    <span>✓</span>
                    <span>Why You Win</span>
                </h4>
                <div className="space-y-2">
                    {winLossData.won.reasons.map((item) => (
                        <div key={item.reason} className="flex items-center gap-3">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-[#1A1A2E]">{item.reason}</span>
                                    <span className="text-sm font-semibold text-[#28A745]">{item.percentage}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#28A745] transition-all"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lost Reasons */}
            <div>
                <h4 className="font-semibold text-[#DC3545] mb-3 flex items-center gap-2">
                    <span>✗</span>
                    <span>Why You Lose</span>
                </h4>
                <div className="space-y-2">
                    {winLossData.lost.reasons.map((item) => (
                        <div key={item.reason} className="flex items-center gap-3">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-[#1A1A2E]">{item.reason}</span>
                                    <span className="text-sm font-semibold text-[#DC3545]">{item.percentage}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#DC3545] transition-all"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Items */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-[#1A1A2E] mb-2 text-sm">🎯 Action Items</h4>
                <ul className="space-y-1 text-xs text-[#5A6C7D]">
                    <li>• Leverage &quot;strong relationships&quot; - ask for referrals from wins</li>
                    <li>• Address pricing objections earlier in process (38% of losses)</li>
                    <li>• Study competitor offerings to better position vs alternatives</li>
                </ul>
            </div>
        </Card>
    );
}

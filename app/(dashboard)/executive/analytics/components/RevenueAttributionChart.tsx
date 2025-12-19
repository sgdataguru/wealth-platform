/**
 * @file app/(dashboard)/executive/analytics/components/RevenueAttributionChart.tsx
 * @description Revenue breakdown by source
 */

'use client';

import { Card } from '@/app/components/ui';

const revenueData = [
    { source: 'Referrals', revenue: 450, percentage: 35, color: '#28A745' },
    { source: 'Events', revenue: 320, percentage: 25, color: '#C9A227' },
    { source: 'Digital Marketing', revenue: 256, percentage: 20, color: '#1E3A5F' },
    { source: 'Partnerships', revenue: 192, percentage: 15, color: '#5A6C7D' },
    { source: 'Direct', revenue: 64, percentage: 5, color: '#8E99A4' },
];

export default function RevenueAttributionChart() {
    return (
        <Card padding="lg">
            <h3 className="text-xl font-semibold text-[#1A1A2E] mb-6 font-[family-name:var(--font-playfair)]">
                Revenue Attribution
            </h3>

            {/* Stacked Bar */}
            <div className="mb-6">
                <div className="h-16 flex rounded-lg overflow-hidden">
                    {revenueData.map((item) => (
                        <div
                            key={item.source}
                            className="flex flex-col items-center justify-center text-white font-semibold transition-all hover:opacity-80 cursor-pointer"
                            style={{
                                width: `${item.percentage}%`,
                                backgroundColor: item.color,
                            }}
                            title={`${item.source}: ₹${item.revenue}Cr (${item.percentage}%)`}
                        >
                            {item.percentage >= 15 && (
                                <span className="text-xs">{item.percentage}%</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend & Details */}
            <div className="space-y-3">
                {revenueData.map((item) => (
                    <div key={item.source} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-medium text-[#1A1A2E]">{item.source}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-[#5A6C7D]">{item.percentage}%</span>
                            <span className="text-sm font-semibold text-[#1A1A2E] min-w-[80px] text-right">
                                ₹{item.revenue} Cr
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-[#8E99A4] uppercase mb-1">Total Revenue</p>
                        <p className="text-2xl font-bold text-[#1A1A2E]">₹1,282 Cr</p>
                    </div>
                    <div>
                        <p className="text-xs text-[#8E99A4] uppercase mb-1">Best ROI Channel</p>
                        <p className="text-2xl font-bold text-[#28A745]">Referrals</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

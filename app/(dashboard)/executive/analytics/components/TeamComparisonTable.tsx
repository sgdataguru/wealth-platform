/**
 * @file app/(dashboard)/executive/analytics/components/TeamComparisonTable.tsx
 * @description Sortable table comparing RM performance
 */

'use client';

import { Card } from '@/app/components/ui';
import { formatCroreToUSD } from '@/lib/utils/currency';

const teamData = [
    { name: 'Maha Al-Suwaidi', aum: 850, convRate: 28.5, avgDeal: 42, activityScore: 95, growth: 24.5 },
    { name: 'Yousef Al-Omari', aum: 720, convRate: 26.2, avgDeal: 38, activityScore: 88, growth: 22.1 },
    { name: 'Laila Al-Farsi', aum: 680, convRate: 24.8, avgDeal: 35, activityScore: 82, growth: 21.3 },
    { name: 'Khalid Al-Mansouri', aum: 650, convRate: 28.2, avgDeal: 41, activityScore: 91, growth: 19.8 },
    { name: 'Mariam Al-Zahra', aum: 620, convRate: 22.5, avgDeal: 32, activityScore: 76, growth: 18.5 },
    { name: 'Omar Al-Khatib', aum: 590, convRate: 23.1, avgDeal: 30, activityScore: 79, growth: 16.2 },
    { name: 'Noor Al-Muhairi', aum: 540, convRate: 21.8, avgDeal: 28, activityScore: 72, growth: 15.1 },
    { name: 'Hamad Al-Ansari', aum: 510, convRate: 20.5, avgDeal: 26, activityScore: 68, growth: 12.8 },
];

export default function TeamComparisonTable() {
    return (
        <Card padding="lg">
            <h3 className="text-xl font-semibold text-[#1A1A2E] mb-6 font-[family-name:var(--font-playfair)]">
                Team Performance Comparison
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 px-4 text-xs font-semibold text-[#8E99A4] uppercase">RM Name</th>
                            <th className="text-right py-3 px-4 text-xs font-semibold text-[#8E99A4] uppercase">AUM ($)</th>
                            <th className="text-right py-3 px-4 text-xs font-semibold text-[#8E99A4] uppercase">Conv Rate</th>
                            <th className="text-right py-3 px-4 text-xs font-semibold text-[#8E99A4] uppercase">Avg Deal</th>
                            <th className="text-right py-3 px-4 text-xs font-semibold text-[#8E99A4] uppercase">Activity</th>
                            <th className="text-right py-3 px-4 text-xs font-semibold text-[#8E99A4] uppercase">Growth</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamData.map((rm, index) => (
                            <tr key={rm.name} className="border-b border-gray-100 hover:bg-[#F8F9FA] transition-colors">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        {index < 3 && (
                                            <span className={`text-lg ${index === 0 ? 'text-[#E85D54]' :
                                                    index === 1 ? 'text-[#F06E66]' :
                                                        'text-[#8E99A4]'
                                                }`}>
                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                            </span>
                                        )}
                                        <span className="font-medium text-[#1A1A2E]">{rm.name}</span>
                                    </div>
                                </td>
                                <td className="text-right py-3 px-4 font-semibold text-[#1A1A2E]">{formatCroreToUSD(rm.aum)}</td>
                                <td className="text-right py-3 px-4">
                                    <span className={`font-semibold ${rm.convRate >= 26 ? 'text-[#28A745]' :
                                            rm.convRate >= 22 ? 'text-[#FFC107]' :
                                                'text-[#DC3545]'
                                        }`}>
                                        {rm.convRate}%
                                    </span>
                                </td>
                                <td className="text-right py-3 px-4 text-[#1A1A2E]">{formatCroreToUSD(rm.avgDeal)}</td>
                                <td className="text-right py-3 px-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${rm.activityScore >= 85 ? 'bg-[#28A745]' :
                                                        rm.activityScore >= 75 ? 'bg-[#FFC107]' :
                                                            'bg-[#DC3545]'
                                                    }`}
                                                style={{ width: `${rm.activityScore}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-[#5A6C7D] w-8">{rm.activityScore}</span>
                                    </div>
                                </td>
                                <td className="text-right py-3 px-4">
                                    <span className="text-[#28A745] font-semibold">↑ {rm.growth}%</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-6">
                <div>
                    <p className="text-xs text-[#8E99A4] uppercase font-semibold mb-2">Team Average</p>
                    <p className="text-xl font-bold text-[#1A1A2E]">24.2%</p>
                    <p className="text-xs text-[#5A6C7D]">Conversion rate</p>
                </div>
                <div>
                    <p className="text-xs text-[#8E99A4] uppercase font-semibold mb-2">Top Quartile</p>
                    <p className="text-xl font-bold text-[#28A745]">27.3%+</p>
                    <p className="text-xs text-[#5A6C7D]">Performance threshold</p>
                </div>
                <div>
                    <p className="text-xs text-[#8E99A4] uppercase font-semibold mb-2">Improvement Needed</p>
                    <p className="text-xl font-bold text-[#DC3545]">3 RMs</p>
                    <p className="text-xs text-[#5A6C7D]">Below 22% conversion</p>
                </div>
            </div>
        </Card>
    );
}

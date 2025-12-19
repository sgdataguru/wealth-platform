/**
 * @file app/(dashboard)/rm/analytics/components/ConversionFunnel.tsx
 * @description Visual funnel showing conversion rates at each stage
 */

'use client';

import { Card } from '@/app/components/ui';

const funnelStages = [
    { stage: 'Prospecting', count: 47, percentage: 100, color: '#8E99A4' },
    { stage: 'Contacted', count: 32, percentage: 68, color: '#5A6C7D', conversionFromPrev: 68 },
    { stage: 'Qualified', count: 20, percentage: 43, color: '#1E3A5F', conversionFromPrev: 63 },
    { stage: 'Proposal', count: 12, percentage: 26, color: '#C9A227', conversionFromPrev: 60 },
    { stage: 'Closing', count: 8, percentage: 17, color: '#B8911F', conversionFromPrev: 67 },
    { stage: 'Won', count: 5, percentage: 11, color: '#28A745', conversionFromPrev: 63 },
];

export default function ConversionFunnel() {
    return (
        <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                        Conversion Funnel
                    </h3>
                    <p className="text-sm text-[#5A6C7D] mt-1">Last 90 days performance</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-[#8E99A4]">Overall Conversion</p>
                    <p className="text-2xl font-bold text-[#28A745]">10.6%</p>
                </div>
            </div>

            {/* Funnel Visualization */}
            <div className="space-y-3">
                {funnelStages.map((stage, index) => (
                    <div key={stage.stage}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-[#1A1A2E]">{stage.stage}</span>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold text-[#1A1A2E]">{stage.count} prospects</span>
                                {stage.conversionFromPrev && (
                                    <span className="text-xs text-[#5A6C7D]">
                                        {stage.conversionFromPrev}% from prev
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="h-12 rounded-lg overflow-hidden bg-gray-100">
                                <div
                                    className="h-full transition-all duration-500 flex items-center justify-center text-white font-semibold"
                                    style={{
                                        width: `${stage.percentage}%`,
                                        backgroundColor: stage.color,
                                    }}
                                >
                                    {stage.percentage >= 20 && `${stage.percentage}%`}
                                </div>
                            </div>
                        </div>

                        {/* Drop-off indicator */}
                        {index < funnelStages.length - 1 && stage.conversionFromPrev && stage.conversionFromPrev < 50 && (
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-[#DC3545]">⚠️ High drop-off ({100 - stage.conversionFromPrev}%)</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Insights */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-[#1A1A2E] mb-3">💡 Key Insights</h4>
                <ul className="space-y-2 text-sm text-[#5A6C7D]">
                    <li className="flex items-start gap-2">
                        <span className="text-[#28A745] mt-1">✓</span>
                        <span>Strong conversion from Closing to Won (63%) - your closing skills are excellent</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-[#FFC107] mt-1">→</span>
                        <span>Contacted to Qualified stage has room for improvement (63% vs team avg 70%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-[#1E3A5F] mt-1">📊</span>
                        <span>Top performers convert 75%+ from Contacted to Qualified - review their qualification criteria</span>
                    </li>
                </ul>
            </div>
        </Card>
    );
}

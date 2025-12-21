/**
 * @file app/(dashboard)/rm/analytics/components/LeadSourceChart.tsx
 * @description Lead source performance comparison
 */

'use client';

import { Card } from '@/app/components/ui';

const leadSources = [
    { source: 'Referrals', count: 15, conversionRate: 40, avgDealSize: '₹380 Cr', roi: 'High', color: '#28A745' },
    { source: 'Events', count: 6, conversionRate: 33, avgDealSize: '₹410 Cr', roi: 'High', color: '#E85D54' },
    { source: 'LinkedIn', count: 8, conversionRate: 25, avgDealSize: '₹220 Cr', roi: 'Medium', color: '#2A2447' },
    { source: 'Cold Outreach', count: 12, conversionRate: 8, avgDealSize: '₹150 Cr', roi: 'Low', color: '#8E99A4' },
    { source: 'Website', count: 6, conversionRate: 17, avgDealSize: '₹190 Cr', roi: 'Medium', color: '#5A6C7D' },
];

export default function LeadSourceChart() {
    const maxConversion = Math.max(...leadSources.map(s => s.conversionRate));

    return (
        <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                        Lead Source Performance
                    </h3>
                    <p className="text-sm text-[#5A6C7D] mt-1">Focus on what works best</p>
                </div>
            </div>

            <div className="space-y-4">
                {leadSources.map((source) => (
                    <div key={source.source} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: source.color }}
                                />
                                <span className="font-semibold text-[#1A1A2E]">{source.source}</span>
                                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${source.roi === 'High' ? 'bg-green-100 text-green-700' :
                                        source.roi === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {source.roi} ROI
                                </span>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                                <div className="text-right">
                                    <p className="text-xs text-[#8E99A4]">Count</p>
                                    <p className="font-semibold text-[#1A1A2E]">{source.count}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-[#8E99A4]">Conv Rate</p>
                                    <p className="font-semibold text-[#1A1A2E]">{source.conversionRate}%</p>
                                </div>
                                <div className="text-right min-w-[80px]">
                                    <p className="text-xs text-[#8E99A4]">Avg Deal</p>
                                    <p className="font-semibold text-[#1A1A2E]">{source.avgDealSize}</p>
                                </div>
                            </div>
                        </div>

                        {/* Conversion bar */}
                        <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full transition-all rounded-full"
                                style={{
                                    width: `${(source.conversionRate / maxConversion) * 100}%`,
                                    backgroundColor: source.color,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recommendations */}
            <div className="mt-6 pt-6 border-t border-gray-200 bg-[#F8F9FA] -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
                <h4 className="font-semibold text-[#1A1A2E] mb-3 flex items-center gap-2">
                    <span>💡</span>
                    <span>Recommendations</span>
                </h4>
                <ul className="space-y-2 text-sm text-[#5A6C7D]">
                    <li className="flex items-start gap-2">
                        <span className="text-[#28A745] font-bold">1.</span>
                        <span><strong>Double down on referrals:</strong> 40% conversion rate with high deal sizes. Ask satisfied clients for introductions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-[#E85D54] font-bold">2.</span>
                        <span><strong>Prioritize events:</strong> Second-best conversion (33%) and highest average deal size (₹410 Cr).</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-[#DC3545] font-bold">3.</span>
                        <span><strong>Reduce cold outreach:</strong> Only 8% conversion. Consider reallocating time to warmer channels.</span>
                    </li>
                </ul>
            </div>
        </Card>
    );
}

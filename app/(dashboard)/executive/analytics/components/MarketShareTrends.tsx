/**
 * @file app/(dashboard)/executive/analytics/components/MarketShareTrends.tsx
 * @description Market share trends over time
 */

'use client';

import { Card } from '@/app/components/ui';

const marketShareData = [
    { city: 'Mumbai', current: 18.5, growth: 1.2, target: 22, color: '#E85D54' },
    { city: 'Delhi NCR', current: 14.2, growth: 0.8, target: 18, color: '#2A2447' },
    { city: 'Bangalore', current: 12.8, growth: 2.1, target: 15, color: '#28A745' },
    { city: 'Pune', current: 8.5, growth: 1.5, target: 12, color: '#5A6C7D' },
    { city: 'Chennai', current: 6.2, growth: 0.6, target: 8, color: '#8E99A4' },
];

export default function MarketShareTrends() {
    return (
        <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                        Market Share by City
                    </h3>
                    <p className="text-sm text-[#5A6C7D] mt-1">HNI/UHNI segment only</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-[#8E99A4]">Overall Market Share</p>
                    <p className="text-2xl font-bold text-[#E85D54]">12.8%</p>
                </div>
            </div>

            <div className="space-y-5">
                {marketShareData.map((city) => (
                    <div key={city.city}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-[#1A1A2E]">{city.city}</span>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="text-right">
                                    <span className="text-xs text-[#8E99A4]">Current: </span>
                                    <span className="font-semibold text-[#1A1A2E]">{city.current}%</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-[#8E99A4]">Target: </span>
                                    <span className="text-[#5A6C7D]">{city.target}%</span>
                                </div>
                                <span className={`text-xs font-medium ${city.growth >= 1.5 ? 'text-[#28A745]' : 'text-[#FFC107]'}`}>
                                    ↑ {city.growth}%
                                </span>
                            </div>
                        </div>

                        {/* Progress to target */}
                        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full transition-all rounded-full"
                                style={{
                                    width: `${(city.current / city.target) * 100}%`,
                                    backgroundColor: city.color,
                                }}
                            />
                            {/* Target marker */}
                            <div
                                className="absolute top-0 h-full w-0.5 bg-gray-400"
                                style={{ left: '100%' }}
                            />
                        </div>

                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-[#5A6C7D]">
                                Progress: {((city.current / city.target) * 100).toFixed(0)}% of target
                            </span>
                            <span className="text-xs text-[#5A6C7D]">
                                Gap: {(city.target - city.current).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-[#1A1A2E] mb-3">📊 Strategic Insights</h4>
                <ul className="space-y-2 text-sm text-[#5A6C7D]">
                    <li className="flex items-start gap-2">
                        <span className="text-[#28A745]">✓</span>
                        <span>Bangalore showing strongest growth (+2.1%) - increase marketing investment</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-[#E85D54]">→</span>
                        <span>Mumbai at 18.5% - closest to market leadership (top player: 22%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-[#2A2447]">📈</span>
                        <span>Chennai underperforming - consider hiring additional senior RMs</span>
                    </li>
                </ul>
            </div>
        </Card>
    );
}

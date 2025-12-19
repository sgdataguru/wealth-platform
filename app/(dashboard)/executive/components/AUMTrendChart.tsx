/**
 * @file app/(dashboard)/executive/components/AUMTrendChart.tsx
 * @description AUM growth trend line chart
 */

'use client';

import { Card } from '@/app/components/ui';
import type { TrendPoint } from '@/types';

interface AUMTrendChartProps {
    data?: TrendPoint[];
    isLoading: boolean;
}

export default function AUMTrendChart({ data, isLoading }: AUMTrendChartProps) {
    if (isLoading) {
        return (
            <Card padding="lg" className="animate-pulse">
                <div className="h-96 bg-gray-200 rounded"></div>
            </Card>
        );
    }

    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;

    return (
        <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                    AUM Growth Trend
                </h3>
                <span className="text-sm text-[#28A745] font-medium">
                    ↑ {(((data[data.length - 1].value - data[0].value) / data[0].value) * 100).toFixed(1)}% YoY
                </span>
            </div>

            {/* Simple Line Chart (SVG) */}
            <div className="relative" style={{ height: '280px' }}>
                <svg className="w-full h-full" viewBox="0 0 800 280" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map((i) => (
                        <line
                            key={i}
                            x1="0"
                            y1={i * 70}
                            x2="800"
                            y2={i * 70}
                            stroke="#E5E7EB"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Trend line */}
                    <polyline
                        fill="none"
                        stroke="#C9A227"
                        strokeWidth="3"
                        points={data
                            .map((point, index) => {
                                const x = (index / (data.length - 1)) * 800;
                                const y = 280 - ((point.value - minValue) / range) * 260 - 10;
                                return `${x},${y}`;
                            })
                            .join(' ')}
                    />

                    {/* Area fill */}
                    <polygon
                        fill="url(#areaGradient)"
                        points={
                            data
                                .map((point, index) => {
                                    const x = (index / (data.length - 1)) * 800;
                                    const y = 280 - ((point.value - minValue) / range) * 260 - 10;
                                    return `${x},${y}`;
                                })
                                .join(' ') +
                            ` 800,280 0,280`
                        }
                    />

                    {/* Gradient definition */}
                    <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#C9A227" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#C9A227" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>

                    {/* Data points */}
                    {data.map((point, index) => {
                        const x = (index / (data.length - 1)) * 800;
                        const y = 280 - ((point.value - minValue) / range) * 260 - 10;
                        return (
                            <circle
                                key={index}
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#C9A227"
                                className="hover:r-6 transition-all cursor-pointer"
                            />
                        );
                    })}
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between mt-2 px-2">
                    {data.map((point, index) => (
                        <span key={index} className="text-xs text-[#8E99A4]">
                            {point.date}
                        </span>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                            Current
                        </span>
                        <p className="text-xl font-bold text-[#1A1A2E] mt-1">
                            ₹{data[data.length - 1].value} L Cr
                        </p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                            Growth
                        </span>
                        <p className="text-xl font-bold text-[#28A745] mt-1">
                            ₹{(data[data.length - 1].value - data[0].value).toFixed(1)} L Cr
                        </p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                            Avg Monthly
                        </span>
                        <p className="text-xl font-bold text-[#1A1A2E] mt-1">
                            +₹{((data[data.length - 1].value - data[0].value) / 12).toFixed(2)} L Cr
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

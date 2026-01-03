/**
 * @file app/(dashboard)/executive/components/AUMTrendChart.tsx
 * @description Enhanced AUM growth trend with interactivity
 */

'use client';

import { useState } from 'react';
import { Card } from '@/app/components/ui';
import { formatLakhCroreAmount } from '@/lib/utils/currency';
import type { TrendPoint } from '@/types';

interface AUMTrendChartProps {
    data?: TrendPoint[];
    isLoading: boolean;
}

export default function AUMTrendChart({ data, isLoading }: AUMTrendChartProps) {
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

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
                <div>
                    <h3 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                        AUM Growth Trend
                    </h3>
                    <p className="text-sm text-[#5A6C7D] mt-1">
                        Click data points for detailed breakdown
                    </p>
                </div>
                <span className="text-sm text-[#28A745] font-medium">
                    ↑ {(((data[data.length - 1].value - data[0].value) / data[0].value) * 100).toFixed(1)}% YoY
                </span>
            </div>

            {/* Enhanced Line Chart with Tooltips */}
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
                        stroke="#E85D54"
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
                            <stop offset="0%" stopColor="#E85D54" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#E85D54" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>

                    {/* Interactive Data points */}
                    {data.map((point, index) => {
                        const x = (index / (data.length - 1)) * 800;
                        const y = 280 - ((point.value - minValue) / range) * 260 - 10;
                        const isHovered = hoveredPoint === index;

                        return (
                            <g key={index}>
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={isHovered ? 8 : 5}
                                    fill={isHovered ? '#D64D44' : '#E85D54'}
                                    className="transition-all cursor-pointer"
                                    onMouseEnter={() => setHoveredPoint(index)}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                    style={{ filter: isHovered ? 'drop-shadow(0 0 6px rgba(232, 93, 84, 0.6))' : 'none' }}
                                />
                                {/* Tooltip on hover */}
                                {isHovered && (
                                    <g>
                                        <rect
                                            x={x - 60}
                                            y={y - 65}
                                            width="120"
                                            height="55"
                                            fill="white"
                                            stroke="#E85D54"
                                            strokeWidth="2"
                                            rx="4"
                                            filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                                        />
                                        <text
                                            x={x}
                                            y={y - 45}
                                            textAnchor="middle"
                                            fontSize="12"
                                            fontWeight="600"
                                            fill="#1A1A2E"
                                        >
                                            {point.date}
                                        </text>
                                        <text
                                            x={x}
                                            y={y - 28}
                                            textAnchor="middle"
                                            fontSize="16"
                                            fontWeight="700"
                                            fill="#E85D54"
                                        >
                                            {formatLakhCroreAmount(point.value)}
                                        </text>
                                        {index > 0 && (
                                            <text
                                                x={x}
                                                y={y - 12}
                                                textAnchor="middle"
                                                fontSize="10"
                                                fill={data[index].value >= data[index - 1].value ? '#28A745' : '#DC3545'}
                                            >
                                                {data[index].value >= data[index - 1].value ? '↑' : '↓'}
                                                {Math.abs(((data[index].value - data[index - 1].value) / data[index - 1].value) * 100).toFixed(1)}% MoM
                                            </text>
                                        )}
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between mt-2 px-2">
                    {data.map((point, index) => (
                        <span
                            key={index}
                            className={`text-xs transition-colors ${hoveredPoint === index ? 'text-[#E85D54] font-semibold' : 'text-[#8E99A4]'}`}
                        >
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
                            {formatLakhCroreAmount(data[data.length - 1].value)}
                        </p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                            Growth
                        </span>
                        <p className="text-xl font-bold text-[#28A745] mt-1">
                            {formatLakhCroreAmount(data[data.length - 1].value - data[0].value)}
                        </p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                            Avg Monthly
                        </span>
                        <p className="text-xl font-bold text-[#1A1A2E] mt-1">
                            +{formatLakhCroreAmount((data[data.length - 1].value - data[0].value) / 12)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Data Source Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-[#8E99A4]">
                    📊 Data Source: Kairos Capital CRM + Portfolio Management System | Updated: Real-time
                </p>
            </div>
        </Card>
    );
}

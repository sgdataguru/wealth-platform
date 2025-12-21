/**
 * @file app/(dashboard)/executive/components/ProductMixChart.tsx
 * @description Product portfolio composition chart
 */

'use client';

import { Card } from '@/app/components/ui';
import type { ProductMixData } from '@/types';

interface ProductMixChartProps {
    data?: ProductMixData[];
    isLoading: boolean;
}

export default function ProductMixChart({ data, isLoading }: ProductMixChartProps) {
    if (isLoading) {
        return (
            <Card padding="lg" className="animate-pulse">
                <div className="h-96 bg-gray-200 rounded"></div>
            </Card>
        );
    }

    if (!data || data.length === 0) return null;

    return (
        <Card padding="lg">
            <h3 className="text-xl font-semibold text-[#1A1A2E] mb-6 font-[family-name:var(--font-playfair)]">
                Product Mix
            </h3>

            {/* Stacked Bar Chart */}
            <div className="mb-6">
                <div className="h-12 flex rounded-lg overflow-hidden">
                    {data.map((product) => (
                        <div
                            key={product.product}
                            className="flex items-center justify-center text-xs font-semibold text-white transition-all hover:opacity-80"
                            style={{
                                width: `${product.percentage}%`,
                                backgroundColor: product.color,
                            }}
                            title={`${product.product}: ${product.percentage}%`}
                        >
                            {product.percentage >= 10 && `${product.percentage}%`}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
                {data.map((product) => (
                    <div key={product.product} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: product.color }}
                            />
                            <span className="text-sm font-medium text-[#1A1A2E]">
                                {product.product}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-[#5A6C7D]">{product.percentage}%</span>
                            <span className="text-sm font-semibold text-[#1A1A2E] min-w-[80px] text-right">
                                {product.value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

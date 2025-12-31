/**
 * @file app/(dashboard)/rm/components/MyPipeline.tsx
 * @description Pipeline visualization for RM dashboard
 */

'use client';

import { Card } from '@/app/components/ui';
import type { PipelineStage } from '@/types';
import { formatCroreToUSD } from '@/lib/utils/currency';

const mockPipelineData: PipelineStage[] = [
    { stage: 'Prospecting', count: 12, value: 54, color: '#8E99A4' },
    { stage: 'Contacted', count: 8, value: 42, color: '#5A6C7D' },
    { stage: 'Qualified', count: 5, value: 28, color: '#2A2447' },
    { stage: 'Proposal', count: 3, value: 18, color: '#E85D54' },
    { stage: 'Closing', count: 2, value: 12, color: '#28A745' },
];

export default function MyPipeline() {
    const totalOpportunities = mockPipelineData.reduce((sum, stage) => sum + stage.count, 0);

    return (
        <Card padding="lg" className="mb-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                        My Pipeline
                    </h2>
                    <p className="text-sm text-[#5A6C7D] mt-1">
                        {totalOpportunities} opportunities across all stages
                    </p>
                </div>
            </div>

            {/* Pipeline Stages */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {mockPipelineData.map((stage) => (
                    <div
                        key={stage.stage}
                        className="relative"
                    >
                        {/* Stage Card */}
                        <div
                            className="rounded-lg p-4 border-2 transition-all hover:shadow-md cursor-pointer"
                            style={{ borderColor: stage.color }}
                        >
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: stage.color }}>
                                        {stage.stage}
                                    </span>
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                        style={{ backgroundColor: stage.color }}
                                    >
                                        {stage.count}
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-[#1A1A2E]">
                                    {formatCroreToUSD(Number(stage.value))}
                                </span>
                            </div>
                        </div>

                        {/* Connector Arrow */}
                        {stage.stage !== 'Closing' && (
                            <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                                <svg className="w-4 h-4 text-[#8E99A4]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pipeline Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                            Total Pipeline Value
                        </span>
                        <p className="text-2xl font-bold text-[#1A1A2E] mt-1">
                            {formatCroreToUSD(154)}
                        </p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                            Weighted Pipeline
                        </span>
                        <p className="text-2xl font-bold text-[#1A1A2E] mt-1">
                            {formatCroreToUSD(42)}
                        </p>
                        <p className="text-xs text-[#5A6C7D] mt-1">Based on stage probability</p>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                            Expected Close
                        </span>
                        <p className="text-2xl font-bold text-[#28A745] mt-1">
                            {formatCroreToUSD(18)}
                        </p>
                        <p className="text-xs text-[#5A6C7D] mt-1">This quarter</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

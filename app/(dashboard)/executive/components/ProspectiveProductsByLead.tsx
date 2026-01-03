/**
 * @file ProspectiveProductsByLead.tsx
 * @description Recommended product mix for active leads/prospects
 */

'use client';

import { useState } from 'react';
import type { ProspectiveProductMix } from '@/types';

interface ProspectiveProductsByLeadProps {
    data?: ProspectiveProductMix[];
    isLoading?: boolean;
}

// Mock data for prospects
const MOCK_PROSPECTIVE_PRODUCTS: ProspectiveProductMix[] = [
    {
        leadId: 'L001',
        leadName: 'Hamad Al-Ansari',
        estimatedNetWorth: 950000000,
        riskProfile: 'aggressive',
        recommendedProducts: [
            {
                category: 'Alternative Investments',
                recommendationScore: 92,
                expectedAllocation: 380000000,
                probability: 85,
                rationale: 'High net worth individual with aggressive risk appetite, strong PE/VC track record'
            },
            {
                category: 'PMS',
                recommendationScore: 88,
                expectedAllocation: 285000000,
                probability: 90,
                rationale: 'Seeking active portfolio management with customization'
            },
            {
                category: 'Equities',
                recommendationScore: 75,
                expectedAllocation: 190000000,
                probability: 80,
                rationale: 'Direct equity exposure for high-growth sectors'
            },
        ],
        totalExpectedAUM: 855000000,
        assignedRM: 'Maha Al-Suwaidi',
    },
    {
        leadId: 'L002',
        leadName: 'Tariq Al-Hakim',
        estimatedNetWorth: 420000000,
        riskProfile: 'moderate',
        recommendedProducts: [
            {
                category: 'PMS',
                recommendationScore: 90,
                expectedAllocation: 168000000,
                probability: 85,
                rationale: 'Balanced portfolio approach with professional management'
            },
            {
                category: 'Fixed Income',
                recommendationScore: 85,
                expectedAllocation: 126000000,
                probability: 90,
                rationale: 'Stable income generation requirement identified'
            },
            {
                category: 'Mutual Funds',
                recommendationScore: 78,
                expectedAllocation: 84000000,
                probability: 75,
                rationale: 'Diversification through professionally managed funds'
            },
        ],
        totalExpectedAUM: 378000000,
        assignedRM: 'Laila Al-Farsi',
    },
];

export default function ProspectiveProductsByLead({ data = MOCK_PROSPECTIVE_PRODUCTS, isLoading }: ProspectiveProductsByLeadProps) {
    const [sortBy, setSortBy] = useState<'score' | 'aum'>('score');

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                    <div className="h-32 bg-gray-200 rounded" />
                </div>
            </div>
        );
    }

    const getRiskProfileColor = (profile: string): string => {
        switch (profile) {
            case 'aggressive': return 'bg-red-100 text-red-700';
            case 'moderate': return 'bg-yellow-100 text-yellow-700';
            case 'conservative': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getProbabilityColor = (probability: number): string => {
        if (probability >= 80) return 'text-green-600';
        if (probability >= 60) return 'text-yellow-600';
        return 'text-orange-600';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                            Prospective Products by Lead
                        </h3>
                        <p className="text-sm text-[#5A6C7D] mt-1">
                            AI-driven product recommendations for {data.length} active prospects
                        </p>
                    </div>
                </div>

                {/* Sort */}
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'score' | 'aum')}
                    className="px-4 py-2 bg-[#F8F9FA] border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E85D54]"
                >
                    <option value="score">Sort by Recommendation Score</option>
                    <option value="aum">Sort by Expected AUM</option>
                </select>
            </div>

            {/* Prospects List */}
            <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
                {data.map((prospect) => (
                    <div key={prospect.leadId} className="border border-gray-200 rounded-lg p-5">
                        {/* Prospect Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h4 className="font-semibold text-[#1A1A2E]">{prospect.leadName}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskProfileColor(prospect.riskProfile)}`}>
                                        {prospect.riskProfile.toUpperCase()}
                                    </span>
                                    <span className="text-sm text-[#5A6C7D]">
                                        RM: {prospect.assignedRM}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-[#8E99A4]">Est. Net Worth</p>
                                <p className="text-lg font-bold text-[#1A1A2E]">
                                    AED {(prospect.estimatedNetWorth / 10000000).toFixed(2)}M
                                </p>
                                <p className="text-xs text-[#E85D54] font-medium mt-1">
                                    Target: AED {(prospect.totalExpectedAUM / 10000000).toFixed(2)}M
                                </p>
                            </div>
                        </div>

                        {/* Recommended Products */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold text-[#8E99A4] uppercase">Recommended Products</p>
                            {prospect.recommendedProducts
                                .sort((a, b) => sortBy === 'score' ? b.recommendationScore - a.recommendationScore : b.expectedAllocation - a.expectedAllocation)
                                .map((product, idx) => (
                                    <div key={idx} className="bg-[#F8F9FA] p-4 rounded-lg">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h5 className="font-semibold text-[#1A1A2E]">{product.category}</h5>
                                                    <span className="px-2 py-0.5 bg-[#E85D54] text-white rounded text-xs font-bold">
                                                        Score: {product.recommendationScore}
                                                    </span>
                                                    <span className={`text-xs font-medium ${getProbabilityColor(product.probability)}`}>
                                                        {product.probability}% probability
                                                    </span>
                                                </div>
                                                <p className="text-sm text-[#5A6C7D] mt-1">{product.rationale}</p>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="text-sm font-bold text-[#1A1A2E]">
                                                    AED {(product.expectedAllocation / 10000000).toFixed(2)}M
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

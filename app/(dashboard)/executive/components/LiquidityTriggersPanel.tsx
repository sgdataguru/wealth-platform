/**
 * @file LiquidityTriggersPanel.tsx
 * @description Liquidity event forecast panel for 0-365 day timeline
 */

'use client';

import { useState } from 'react';
import type { LiquidityTrigger, LiquidityTimelineFilter } from '@/types';

interface LiquidityTriggersPanelProps {
    triggers: LiquidityTrigger[];
    isLoading?: boolean;
}

export default function LiquidityTriggersPanel({ triggers, isLoading }: LiquidityTriggersPanelProps) {
    const [timelineFilter, setTimelineFilter] = useState<LiquidityTimelineFilter>('0-30');

    // Filter triggers by timeline
    const filteredTriggers = triggers.filter(trigger => {
        if (timelineFilter === 'all') return true;

        const days = trigger.daysUntilEvent;
        switch (timelineFilter) {
            case '0-30': return days >= 0 && days <= 30;
            case '31-90': return days >= 31 && days <= 90;
            case '91-180': return days >= 91 && days <= 180;
            case '181-365': return days >= 181 && days <= 365;
            default: return true;
        }
    });

    // Calculate summary stats
    const totalInPlay = filteredTriggers.reduce((sum, t) => sum + t.amount, 0);

    const handleExport = () => {
        // Export to CSV
        const csvData = filteredTriggers.map(t => ({
            Client: t.clientName,
            'Client Code': t.clientCode,
            Event: t.eventType.replace(/_/g, ' ').toUpperCase(),
            Amount: `₹${(t.amount / 10000000).toFixed(2)} Cr`,
            Date: new Date(t.eventDate).toLocaleDateString(),
            'Days Until': t.daysUntilEvent,
            Probability: `${t.probability}%`,
            Source: t.dataSource,
            RM: t.assignedRMName,
            Status: t.status
        }));

        const csv = [
            Object.keys(csvData[0]).join(','),
            ...csvData.map(row => Object.values(row).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `liquidity-triggers-${timelineFilter}.csv`;
        a.click();
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                    <div className="space-y-3">
                        <div className="h-20 bg-gray-200 rounded" />
                        <div className="h-20 bg-gray-200 rounded" />
                        <div className="h-20 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                            🔥 Liquidity Triggers & Actions
                        </h3>
                        <p className="text-sm text-[#5A6C7D] mt-1">
                            Next 12 months • {filteredTriggers.length} events • ₹{(totalInPlay / 10000000).toFixed(2)} Cr in play
                        </p>
                    </div>

                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-[#E85D54] text-white rounded-lg hover:bg-[#D64D44] transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export Data
                    </button>
                </div>

                {/* Timeline Filters */}
                <div className="flex gap-2">
                    {[
                        { value: '0-30', label: '0-30 days' },
                        { value: '31-90', label: '31-90 days' },
                        { value: '91-180', label: '91-180 days' },
                        { value: '181-365', label: '181-365 days' },
                        { value: 'all', label: 'All' }
                    ].map(filter => (
                        <button
                            key={filter.value}
                            onClick={() => setTimelineFilter(filter.value as LiquidityTimelineFilter)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timelineFilter === filter.value
                                    ? 'bg-[#E85D54] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Triggers List */}
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                        RED — High Urgency / High Impact (Immediate RM Action)
                    </p>
                    <div className="space-y-3">
                        <div className="border border-gray-200 rounded-lg p-5 hover:border-[#E85D54] transition-colors cursor-pointer">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-[#1A1A2E]">
                                    Nectar Lifesciences Ltd <span className="text-gray-500 text-sm">(#NSE:NECLIFE)</span>
                                </h4>
                                <p className="text-sm text-[#5A6C7D]">Mapped UHNW: Ramesh Gupta (#HC001)</p>
                                <p className="text-sm text-[#5A6C7D]">
                                    Buyback — Record Date Liquidity <span className="font-semibold text-[#E85D54]">| IMPORTANT SIGNAL</span>
                                </p>
                            </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-5 hover:border-[#E85D54] transition-colors cursor-pointer">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-[#1A1A2E]">
                                    VLS Finance Ltd <span className="text-gray-500 text-sm">(#NSE:VLSFINANCE)</span>
                                </h4>
                                <p className="text-sm text-[#5A6C7D]">Mapped UHNW: Sanjay Malhotra (#HC128)</p>
                                <p className="text-sm text-[#5A6C7D]">
                                    Buyback — Tender Window Live <span className="font-semibold text-[#E85D54]">| IMPORTANT SIGNAL</span>
                                </p>
                            </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-5 hover:border-[#E85D54] transition-colors cursor-pointer">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-[#1A1A2E]">
                                    Covidh Technologies Ltd <span className="text-gray-500 text-sm">(#NSE:COVIDH)</span>
                                </h4>
                                <p className="text-sm text-[#5A6C7D]">Mapped UHNW: Ramesh Gupta (#HC001)</p>
                                <p className="text-sm text-[#5A6C7D]">Open Offer — Tender Window Live</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-yellow-700">
                        YELLOW — Medium Urgency / Watch Closely
                    </p>
                    <div className="space-y-3">
                        <div className="border border-gray-200 rounded-lg p-5 hover:border-[#E85D54] transition-colors cursor-pointer">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-[#1A1A2E]">
                                    Aurobindo Pharma Ltd <span className="text-gray-500 text-sm">(#NSE:AUROPHARMA)</span>
                                </h4>
                                <p className="text-sm text-[#5A6C7D]">Mapped UHNW: Megha Iyer (#HC084)</p>
                                <p className="text-sm text-[#5A6C7D]">Block Deal — Promoter Stake Sale</p>
                            </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-5 hover:border-[#E85D54] transition-colors cursor-pointer">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-[#1A1A2E]">
                                    Glenmark Life Sciences <span className="text-gray-500 text-sm">(#NSE:GLENMARKL)</span>
                                </h4>
                                <p className="text-sm text-[#5A6C7D]">Mapped UHNW: Rohit Khanna (#HC142)</p>
                                <p className="text-sm text-[#5A6C7D]">Demergers — Board Resolution Expected</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                        GREEN — Early Signal / Opportunity Radar
                    </p>
                    <div className="space-y-3">
                        <div className="border border-gray-200 rounded-lg p-5 hover:border-[#E85D54] transition-colors cursor-pointer">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-[#1A1A2E]">
                                    CMS Info Systems <span className="text-gray-500 text-sm">(#NSE:CMSINFO)</span>
                                </h4>
                                <p className="text-sm text-[#5A6C7D]">Mapped UHNW: Neelam Chopra (#HC109)</p>
                                <p className="text-sm text-[#5A6C7D]">ESOP Vesting — 6 Month Window</p>
                            </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-5 hover:border-[#E85D54] transition-colors cursor-pointer">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-[#1A1A2E]">
                                    L&T Technology Services <span className="text-gray-500 text-sm">(#NSE:LTTS)</span>
                                </h4>
                                <p className="text-sm text-[#5A6C7D]">Mapped UHNW: Harish Batra (#HC062)</p>
                                <p className="text-sm text-[#5A6C7D]">Dividend Signal — Capital Allocation Review</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

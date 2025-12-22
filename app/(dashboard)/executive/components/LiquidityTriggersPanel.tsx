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
    const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);

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

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'lock_in_expiry':
                return '🔓';
            case 'bond_maturity':
                return '💰';
            case 'ipo_listing':
                return '📈';
            case 'esop_vesting':
                return '💼';
            default:
                return '📊';
        }
    };

    const getConfidenceBadge = (level: string) => {
        const colors = {
            high: 'bg-green-100 text-green-700',
            medium: 'bg-yellow-100 text-yellow-700',
            low: 'bg-gray-100 text-gray-700'
        };
        return colors[level as keyof typeof colors] || colors.medium;
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
                {filteredTriggers.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No liquidity triggers for this timeline</p>
                    </div>
                ) : (
                    filteredTriggers.slice(0, 10).map(trigger => (
                        <div
                            key={trigger.id}
                            className="border border-gray-200 rounded-lg p-5 hover:border-[#E85D54] transition-colors cursor-pointer"
                            onClick={() => setSelectedTrigger(selectedTrigger === trigger.id ? null : trigger.id)}
                        >
                            {/* Header Row */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3 flex-1">
                                    <span className="text-2xl">{getEventIcon(trigger.eventType)}</span>
                                    <div>
                                        <h4 className="font-semibold text-[#1A1A2E]">
                                            {trigger.clientName} <span className="text-gray-500 text-sm">({trigger.clientCode})</span>
                                        </h4>
                                        <p className="text-sm text-[#5A6C7D] capitalize">
                                            {trigger.eventType.replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-lg font-bold text-[#E85D54]">
                                        ₹{(trigger.amount / 10000000).toFixed(2)} Cr
                                    </p>
                                    <p className="text-sm text-[#5A6C7D]">
                                        {new Date(trigger.eventDate).toLocaleDateString()} ({trigger.daysUntilEvent}d)
                                    </p>
                                </div>
                            </div>

                            {/* Metadata Row */}
                            <div className="flex items-center gap-4 mb-3 flex-wrap">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceBadge(trigger.confidenceLevel)}`}>
                                    {trigger.confidenceLevel.toUpperCase()} - {trigger.probability}%
                                </span>
                                <span className="text-xs text-gray-600">
                                    📊 {trigger.dataSource}
                                </span>
                                <span className="text-xs text-gray-600">
                                    👤 RM: {trigger.assignedRMName}
                                </span>
                            </div>

                            {/* Expandable Details */}
                            {selectedTrigger === trigger.id && (
                                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                                    <div>
                                        <h5 className="text-sm font-semibold text-[#1A1A2E] mb-2">Recommended Actions:</h5>
                                        <ul className="list-disc list-inside space-y-1">
                                            {trigger.recommendedActions.map((action, idx) => (
                                                <li key={idx} className="text-sm text-[#5A6C7D]">{action}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h5 className="text-sm font-semibold text-[#1A1A2E] mb-2">Recommended Products:</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {trigger.recommendedProducts.map((product, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-[#F8F9FA] text-[#1A1A2E] rounded-full text-xs font-medium"
                                                >
                                                    {product}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}

                {filteredTriggers.length > 10 && (
                    <div className="text-center pt-4">
                        <button className="text-sm text-[#E85D54] font-medium hover:underline">
                            View All {filteredTriggers.length} Triggers →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

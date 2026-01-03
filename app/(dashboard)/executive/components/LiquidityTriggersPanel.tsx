/**
 * @file LiquidityTriggersPanel.tsx
 * @description Liquidity event forecast panel for 0-365 day timeline
 */

'use client';

import { useState } from 'react';
import type { LiquidityTrigger, LiquidityTimelineFilter, LiquidityUrgency } from '@/types';

// Urgency configuration with symbols and labels
const URGENCY_CONFIG = {
    high: {
        symbol: '🔴',
        label: 'High Urgency / High Impact',
        description: 'Immediate RM Action Required',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-700'
    },
    medium: {
        symbol: '🟡',
        label: 'Medium Urgency',
        description: 'Monitor Closely',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-700'
    },
    early: {
        symbol: '🟢',
        label: 'Early Signal',
        description: 'Opportunity Radar',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-700'
    }
} as const;

interface LiquidityTriggersPanelProps {
    triggers: LiquidityTrigger[];
    isLoading?: boolean;
}

// Helper function to determine urgency from days until event
function determineUrgency(daysUntil: number): LiquidityUrgency {
    if (daysUntil <= 30) return 'high';
    if (daysUntil <= 90) return 'medium';
    return 'early';
}

// Liquidity Card Component
interface LiquidityCardProps {
    trigger: LiquidityTrigger;
    onAssignRM: (trigger: LiquidityTrigger) => void;
}

function LiquidityCard({ trigger, onAssignRM }: LiquidityCardProps) {
    const urgency = trigger.urgency || determineUrgency(trigger.daysUntilEvent);
    const config = URGENCY_CONFIG[urgency];
    
    return (
        <div className="border border-gray-200 rounded-lg p-5 hover:border-[#E85D54] transition-colors cursor-pointer bg-white">
            <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                        {/* Urgency Symbol with tooltip */}
                        <div className="flex items-center gap-2">
                            <span 
                                className="text-2xl leading-none" 
                                role="img" 
                                aria-label={`${config.label}: ${config.description}`}
                                title={`${config.label}: ${config.description}`}
                            >
                                {config.symbol}
                            </span>
                            <span className={`text-xs font-semibold uppercase tracking-wide ${config.textColor}`}>
                                {config.label}
                            </span>
                        </div>
                        
                        <h4 className="font-semibold text-[#1A1A2E]">
                            {trigger.clientName} <span className="text-gray-500 text-sm">({trigger.clientCode})</span>
                        </h4>
                        <p className="text-sm text-[#5A6C7D]">
                            Mapped UHNW: {trigger.assignedRMName} (#{trigger.assignedRM})
                        </p>
                        <p className="text-sm text-[#5A6C7D]">
                            {trigger.eventType.replace(/_/g, ' ').toUpperCase()}
                            {trigger.probability >= 80 && (
                                <span className="font-semibold text-[#E85D54]"> | IMPORTANT SIGNAL</span>
                            )}
                        </p>
                    </div>
                    
                    {/* Assign to RM Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAssignRM(trigger);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#0A1628] transition-colors text-sm font-medium whitespace-nowrap"
                        aria-label="Assign to RM"
                        title="Assign to Relationship Manager"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Assign RM
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function LiquidityTriggersPanel({ triggers, isLoading }: LiquidityTriggersPanelProps) {
    const [timelineFilter, setTimelineFilter] = useState<LiquidityTimelineFilter>('0-30');

    // Handle RM assignment
    const handleAssignRM = (trigger: LiquidityTrigger) => {
        // TODO: Implement RM assignment modal/flow
        console.log('Assign RM for trigger:', trigger.id, trigger.clientName);
        alert(`Assign RM feature: Opening assignment dialog for ${trigger.clientName}`);
    };

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

    // Group triggers by urgency
    const groupedTriggers = {
        high: filteredTriggers.filter(t => (t.urgency || determineUrgency(t.daysUntilEvent)) === 'high'),
        medium: filteredTriggers.filter(t => (t.urgency || determineUrgency(t.daysUntilEvent)) === 'medium'),
        early: filteredTriggers.filter(t => (t.urgency || determineUrgency(t.daysUntilEvent)) === 'early')
    };

    const handleExport = () => {
        // Export to CSV
        const csvData = filteredTriggers.map(t => ({
            Client: t.clientName,
            'Client Code': t.clientCode,
            Event: t.eventType.replace(/_/g, ' ').toUpperCase(),
            Amount: `AED ${(t.amount / 10000000).toFixed(2)}M`,
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
                            Next 12 months • {filteredTriggers.length} events • AED {(totalInPlay / 10000000).toFixed(2)}M in play
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
                {/* High Urgency Section */}
                {groupedTriggers.high.length > 0 && (
                    <div className={`space-y-3 rounded-lg border ${URGENCY_CONFIG.high.borderColor} ${URGENCY_CONFIG.high.bgColor} p-4`}>
                        <div className="flex items-center gap-2">
                            <span 
                                className="text-2xl leading-none" 
                                role="img" 
                                aria-label={`${URGENCY_CONFIG.high.label}: ${URGENCY_CONFIG.high.description}`}
                                title={`${URGENCY_CONFIG.high.label}: ${URGENCY_CONFIG.high.description}`}
                            >
                                {URGENCY_CONFIG.high.symbol}
                            </span>
                            <p className={`text-xs font-semibold uppercase tracking-wide ${URGENCY_CONFIG.high.textColor}`}>
                                {URGENCY_CONFIG.high.label} — {URGENCY_CONFIG.high.description}
                            </p>
                        </div>
                        <div className="space-y-3">
                            {groupedTriggers.high.map(trigger => (
                                <LiquidityCard key={trigger.id} trigger={trigger} onAssignRM={handleAssignRM} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Medium Urgency Section */}
                {groupedTriggers.medium.length > 0 && (
                    <div className={`space-y-3 rounded-lg border ${URGENCY_CONFIG.medium.borderColor} ${URGENCY_CONFIG.medium.bgColor} p-4`}>
                        <div className="flex items-center gap-2">
                            <span 
                                className="text-2xl leading-none" 
                                role="img" 
                                aria-label={`${URGENCY_CONFIG.medium.label}: ${URGENCY_CONFIG.medium.description}`}
                                title={`${URGENCY_CONFIG.medium.label}: ${URGENCY_CONFIG.medium.description}`}
                            >
                                {URGENCY_CONFIG.medium.symbol}
                            </span>
                            <p className={`text-xs font-semibold uppercase tracking-wide ${URGENCY_CONFIG.medium.textColor}`}>
                                {URGENCY_CONFIG.medium.label} — {URGENCY_CONFIG.medium.description}
                            </p>
                        </div>
                        <div className="space-y-3">
                            {groupedTriggers.medium.map(trigger => (
                                <LiquidityCard key={trigger.id} trigger={trigger} onAssignRM={handleAssignRM} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Early Signal Section */}
                {groupedTriggers.early.length > 0 && (
                    <div className={`space-y-3 rounded-lg border ${URGENCY_CONFIG.early.borderColor} ${URGENCY_CONFIG.early.bgColor} p-4`}>
                        <div className="flex items-center gap-2">
                            <span 
                                className="text-2xl leading-none" 
                                role="img" 
                                aria-label={`${URGENCY_CONFIG.early.label}: ${URGENCY_CONFIG.early.description}`}
                                title={`${URGENCY_CONFIG.early.label}: ${URGENCY_CONFIG.early.description}`}
                            >
                                {URGENCY_CONFIG.early.symbol}
                            </span>
                            <p className={`text-xs font-semibold uppercase tracking-wide ${URGENCY_CONFIG.early.textColor}`}>
                                {URGENCY_CONFIG.early.label} — {URGENCY_CONFIG.early.description}
                            </p>
                        </div>
                        <div className="space-y-3">
                            {groupedTriggers.early.map(trigger => (
                                <LiquidityCard key={trigger.id} trigger={trigger} onAssignRM={handleAssignRM} />
                            ))}
                        </div>
                    </div>
                )}

                {filteredTriggers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No liquidity triggers found for the selected time period.
                    </div>
                )}
            </div>
        </div>
    );
}

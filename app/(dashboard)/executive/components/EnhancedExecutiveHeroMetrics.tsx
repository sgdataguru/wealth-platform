/**
 * @file app/(dashboard)/executive/components/EnhancedExecutiveHeroMetrics.tsx
 * @description Enhanced hero metrics with drill-down capabilities
 */

'use client';

import { useState } from 'react';
import { Card } from '@/app/components/ui';
import DrillDownModal from '@/app/components/ui/DrillDownModal';
import type { EnhancedExecutiveMetrics, DrillDownView } from '@/types';

interface EnhancedExecutiveHeroMetricsProps {
    metrics: EnhancedExecutiveMetrics | null;
    isLoading: boolean;
}

export default function EnhancedExecutiveHeroMetrics({ metrics, isLoading }: EnhancedExecutiveHeroMetricsProps) {
    const [activeModal, setActiveModal] = useState<DrillDownView | null>(null);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <div className="h-28 bg-gray-200 rounded"></div>
                    </Card>
                ))}
            </div>
        );
    }

    if (!metrics) return null;

    const metricCards = [
        {
            id: 'current-aum',
            title: 'Current AUM',
            value: metrics.totalAum,
            subtitle: `${metrics.aumGrowth >= 0 ? '↑' : '↓'} ${metrics.aumGrowth}% MoM`,
            color: 'coral',
            drillDown: 'product_mix_by_client' as DrillDownView,
        },
        {
            id: 'net-new-aum',
            title: 'Net New AUM',
            value: metrics.netNewMoney,
            subtitle: 'This quarter',
            color: 'green',
            drillDown: 'aum_sources' as DrillDownView,
        },
        {
            id: 'target-aum',
            title: 'Target AUM',
            value: metrics.targetAUM,
            subtitle: `Achievement: ${((parseFloat(metrics.totalAum.replace(/[^0-9.]/g, '')) / parseFloat(metrics.targetAUM.replace(/[^0-9.]/g, ''))) * 100).toFixed(1)}%`,
            color: 'blue',
            drillDown: 'target_vs_actual' as DrillDownView,
        },
        {
            id: 'aum-per-rm',
            title: 'AUM per RM',
            value: metrics.aumPerRM,
            subtitle: `${metrics.totalRMs} RMs`,
            color: 'default',
            drillDown: 'rm_performance' as DrillDownView,
        },
        {
            id: 'total-leads',
            title: 'Total Leads',
            value: metrics.totalLeads.toLocaleString(),
            subtitle: 'Pipeline prospects',
            color: 'default',
            drillDown: 'lead_details' as DrillDownView,
        },
        {
            id: 'target-leads',
            title: 'Target Leads/Q',
            value: metrics.targetLeadsPerQuarter.toLocaleString(),
            subtitle: 'Current Q progress',
            color: 'default',
            drillDown: 'lead_details' as DrillDownView,
        },
        {
            id: 'lead-score',
            title: 'Lead Score',
            value: `1 / ${metrics.totalLeads}`,
            subtitle: 'Top lead ranking',
            color: 'gold',
            drillDown: 'lead_details' as DrillDownView,
        },
        {
            id: 'uhnw-clients',
            title: 'Total UHNW Clients',
            value: metrics.totalUHNWClients.toLocaleString(),
            subtitle: `Retention: ${metrics.clientRetentionRate}%`,
            color: 'default',
            drillDown: 'client_list' as DrillDownView,
        },
        {
            id: 'lead-time',
            title: 'Avg Lead Time',
            value: `${metrics.avgLeadTimeToClosurePerRM}d`,
            subtitle: 'Time to closure',
            color: 'default',
            drillDown: 'closure_timeline' as DrillDownView,
        },
        {
            id: 'churn-score',
            title: 'Avg Churn Score',
            value: `${metrics.avgChurnScore.toFixed(1)}`,
            subtitle: getChurnRiskLabel(metrics.avgChurnScore),
            color: getChurnColor(metrics.avgChurnScore),
            drillDown: 'churn_analysis' as DrillDownView,
        },
    ];

    function getChurnRiskLabel(score: number): string {
        if (score <= 10) return 'Low risk';
        if (score <= 25) return 'Medium risk';
        if (score <= 50) return 'High risk';
        return 'Critical risk';
    }

    function getChurnColor(score: number): 'green' | 'yellow' | 'orange' | 'red' {
        if (score <= 10) return 'green';
        if (score <= 25) return 'yellow';
        if (score <= 50) return 'orange';
        return 'red';
    }

    function getColorClasses(color: string): string {
        switch (color) {
            case 'coral':
                return 'bg-gradient-to-br from-[#E85D54] to-[#F06E66] text-white';
            case 'green':
                return 'bg-gradient-to-br from-[#28A745] to-[#34CE57] text-white';
            case 'blue':
                return 'bg-gradient-to-br from-[#1A1332] to-[#2A2447] text-white';
            case 'gold':
                return 'bg-gradient-to-br from-[#D4AF37] to-[#E5C448] text-[#1A1A2E]';
            case 'yellow':
                return 'border-2 border-yellow-500 text-yellow-700';
            case 'orange':
                return 'border-2 border-orange-500 text-orange-700';
            case 'red':
                return 'border-2 border-red-500 text-red-700';
            default:
                return 'bg-white text-[#1A1A2E] border border-gray-200';
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {metricCards.map((metric) => (
                    <Card
                        key={metric.id}
                        className={`cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-xl ${getColorClasses(metric.color)}`}
                        onClick={() => setActiveModal(metric.drillDown)}
                    >
                        <div className="flex flex-col">
                            <span className={`text-xs font-semibold uppercase tracking-wider ${metric.color === 'default' ? 'text-[#8E99A4]' : 'opacity-90'}`}>
                                {metric.title}
                            </span>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-3xl font-bold">
                                    {metric.value}
                                </span>
                            </div>
                            <span className={`text-sm mt-2 ${metric.color === 'default' ? 'text-[#5A6C7D]' : 'opacity-90'}`}>
                                {metric.subtitle}
                            </span>
                            <div className="mt-3 flex items-center gap-2 opacity-70">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="text-xs">Click for details</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Drill-down Modal */}
            {activeModal && (
                <DrillDownModal
                    isOpen={true}
                    onClose={() => setActiveModal(null)}
                    view={activeModal}
                    title={getModalTitle(activeModal)}
                    subtitle={getModalSubtitle(activeModal)}
                    dataSource="Nuvama CRM + Portfolio Management System"
                >
                    {renderModalContent(activeModal)}
                </DrillDownModal>
            )}
        </>
    );
}

function getModalTitle(view: DrillDownView): string {
    switch (view) {
        case 'product_mix_by_client': return 'Product Mix by Client';
        case 'aum_sources': return 'Net New AUM Sources';
        case 'target_vs_actual': return 'Target vs Actual AUM';
        case 'rm_performance': return 'RM Performance Details';
        case 'lead_details': return 'Lead Pipeline Details';
        case 'client_list': return 'UHNW Client List';
        case 'closure_timeline': return 'Lead Time to Closure Analysis';
        case 'churn_analysis': return 'Churn Risk Analysis';
        default: return 'Details';
    }
}

function getModalSubtitle(view: DrillDownView): string {
    switch (view) {
        case 'product_mix_by_client': return 'Current portfolio allocation across UHNW clients';
        case 'aum_sources': return 'Where net new AUM is flowing from';
        case 'target_vs_actual': return 'Progress towards annual AUM targets';
        case 'rm_performance': return 'Individual RM metrics and performance';
        case 'lead_details': return 'Complete lead pipeline breakdown';
        case 'client_list': return 'All UHNW clients with key metrics';
        case 'closure_timeline': return 'Average time from lead to closure per RM';
        case 'churn_analysis': return 'Client churn risk factors and mitigation';
        default: return '';
    }
}

function renderModalContent(view: DrillDownView) {
    // Simplified placeholder content - in real implementation, these would fetch actual data
    return (
        <div className="space-y-4">
            <div className="bg-[#F8F9FA] p-6 rounded-lg">
                <p className="text-[#5A6C7D]">
                    Detailed data view for <strong>{getModalTitle(view)}</strong> would appear here.
                </p>
                <p className="text-sm text-[#8E99A4] mt-2">
                    In production, this would show interactive tables, charts, and filterable data specific to this metric.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-[#8E99A4] uppercase">Sample Metric 1</p>
                    <p className="text-2xl font-bold text-[#1A1A2E] mt-1">24.5%</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-[#8E99A4] uppercase">Sample Metric 2</p>
                    <p className="text-2xl font-bold text-[#1A1A2E] mt-1">₹340 Cr</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-[#8E99A4] uppercase">Sample Metric 3</p>
                    <p className="text-2xl font-bold text-[#1A1A2E] mt-1">156</p>
                </div>
            </div>
        </div>
    );
}

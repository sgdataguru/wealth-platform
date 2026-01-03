/**
 * @file hooks/useRMMetrics.ts
 * @description Hook for RM-specific metrics (mock data for POC)
 */

'use client';

import { useState, useEffect } from 'react';
import type { RMMetrics } from '@/types';
import { formatCroreToUSD } from '@/lib/utils/currency';

const MOCK_RM_METRICS: RMMetrics = {
    // Base metrics
    totalLeads: 47,
    leadsGrowth: '+8%',
    newToday: 3,
    newTodayChange: 2,
    signalsDetected: 12,
    signalsGrowth: '+15%',
    followUps: 8,
    followUpsDueToday: true,

    // RM-specific
    myClients: 47,
    myClientsAum: formatCroreToUSD(120),
    myClientsAumGrowth: 12.5,
    activeOpps: 8,
    activeOppsValue: formatCroreToUSD(42),
    lastMonthRevenue: '$1.85M',
    conversionRate: 28.5,
    avgClientValue: '$5.2M',

    // Activity
    callsMadeThisWeek: 23,
    emailsSentThisWeek: 15,
    meetingsScheduled: 6,
};

export function useRMMetrics(rmId?: string) {
    const [metrics, setMetrics] = useState<RMMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setMetrics(MOCK_RM_METRICS);
            setIsLoading(false);
        }, 500);
    }, [rmId]);

    const refreshMetrics = () => {
        setIsLoading(true);
        setTimeout(() => {
            setMetrics(MOCK_RM_METRICS);
            setIsLoading(false);
        }, 500);
    };

    return {
        metrics,
        isLoading,
        refreshMetrics,
    };
}

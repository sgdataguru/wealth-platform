/**
 * @file hooks/useExecutiveMetrics.ts
 * @description Hook for Executive-specific metrics (mock data for POC)
 */

'use client';

import { useState, useEffect } from 'react';
import type { ExecutiveMetrics } from '@/types';

const MOCK_EXECUTIVE_METRICS: ExecutiveMetrics = {
    // Firm-wide performance
    totalAum: '₹4.6 L Cr',
    aumGrowth: 2.8,
    aumGrowthYoy: 19.2,
    netNewMoney: '₹12,450 Cr',
    operatingMargin: 34.0,
    roe: 31.5,

    // Team metrics
    totalRMs: 1247,
    aumPerRM: '₹3.7 Cr',
    revenuePerRM: '₹23.2 L',
    avgRMProductivity: 78,

    // Client metrics
    totalClients: 134000,
    hniClients: 128500,
    uhniClients: 5500,
    clientRetentionRate: 94.5,
    clientAcquisitionCost: '₹2.8 L',

    // Top performers
    topPerformingRMs: [
        { rmId: 'RM-001', rmName: 'Priya Sharma', aum: 850, growth: 24.5, clientCount: 65, revenue: 42, rank: 1 },
        { rmId: 'RM-002', rmName: 'Vikram Singh', aum: 720, growth: 22.1, clientCount: 58, revenue: 38, rank: 2 },
        { rmId: 'RM-003', rmName: 'Anita Patel', aum: 680, growth: 21.3, clientCount: 52, revenue: 36, rank: 3 },
        { rmId: 'RM-004', rmName: 'Rajesh Kumar', aum: 650, growth: 19.8, clientCount: 47, revenue: 34, rank: 4 },
        { rmId: 'RM-005', rmName: 'Meera Reddy', aum: 620, growth: 18.5, clientCount: 45, revenue: 32, rank: 5 },
    ],

    underperformingRMs: [
        { rmId: 'RM-100', rmName: 'Amit Joshi', aum: 120, growth: -2.5, clientCount: 18, revenue: 8, rank: 1243 },
        { rmId: 'RM-101', rmName: 'Kavita Nair', aum: 135, growth: 1.2, clientCount: 22, revenue: 9, rank: 1244 },
    ],

    // Regional breakdown
    regionalBreakdown: [
        { region: 'Mumbai', aum: '₹1.2 L Cr', growth: 18.5, rmCount: 385, clientCount: 42000 },
        { region: 'Delhi NCR', aum: '₹95,000 Cr', growth: 17.2, rmCount: 298, clientCount: 35000 },
        { region: 'Bangalore', aum: '₹82,000 Cr', growth: 22.8, rmCount: 245, clientCount: 28000 },
        { region: 'Pune', aum: '₹48,000 Cr', growth: 15.3, rmCount: 142, clientCount: 15000 },
        { region: 'Chennai', aum: '₹35,000 Cr', growth: 14.1, rmCount: 98, clientCount: 10000 },
        { region: 'Others', aum: '₹18,000 Cr', growth: 12.5, rmCount: 79, clientCount: 4000 },
    ],

    // Product mix
    productMix: [
        { product: 'Equity PMS', percentage: 35, value: '₹1.61 L Cr', color: '#2A2447' },
        { product: 'Mutual Funds', percentage: 28, value: '₹1.29 L Cr', color: '#E85D54' },
        { product: 'Fixed Income', percentage: 18, value: '₹82,800 Cr', color: '#5A6C7D' },
        { product: 'Alternative Investments', percentage: 12, value: '₹55,200 Cr', color: '#8E99A4' },
        { product: 'Others', percentage: 7, value: '₹32,200 Cr', color: '#F06E66' },
    ],

    // AUM trend (last 12 months)
    aumTrend: [
        { date: 'Jan', value: 3.8 },
        { date: 'Feb', value: 3.9 },
        { date: 'Mar', value: 4.0 },
        { date: 'Apr', value: 4.1 },
        { date: 'May', value: 4.15 },
        { date: 'Jun', value: 4.2 },
        { date: 'Jul', value: 4.3 },
        { date: 'Aug', value: 4.35 },
        { date: 'Sep', value: 4.4 },
        { date: 'Oct', value: 4.5 },
        { date: 'Nov', value: 4.55 },
        { date: 'Dec', value: 4.6 },
    ],
};

export function useExecutiveMetrics() {
    const [metrics, setMetrics] = useState<ExecutiveMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setIsLoading(true);
        setTimeout(() => {
            setMetrics(MOCK_EXECUTIVE_METRICS);
            setIsLoading(false);
        }, 600);
    }, []);

    const refreshMetrics = () => {
        setIsLoading(true);
        setTimeout(() => {
            setMetrics(MOCK_EXECUTIVE_METRICS);
            setIsLoading(false);
        }, 600);
    };

    return {
        metrics,
        isLoading,
        refreshMetrics,
    };
}

/**
 * @file hooks/useEnhancedExecutiveMetrics.ts
 * @description Hook for Enhanced Executive metrics with liquidity triggers
 */

'use client';

import { useState, useEffect } from 'react';
import type { EnhancedExecutiveMetrics, LiquidityTrigger } from '@/types';

// Mock liquidity triggers
const MOCK_LIQUIDITY_TRIGGERS: LiquidityTrigger[] = [
    {
        id: 'LT-001',
        clientId: 'HC001',
        clientName: 'Ramesh Gupta',
        clientCode: '#HC001',
        eventType: 'lock_in_expiry',
        amount: 450000000,
        eventDate: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
        daysUntilEvent: 26,
        urgency: 'high',
        dataSource: 'Company IPO Lock-in Tracker',
        probability: 85,
        confidenceLevel: 'high',
        recommendedActions: [
            'Schedule portfolio review meeting',
            'Prepare diversification proposals',
            'Present Structured Products and Alternative Investment options'
        ],
        recommendedProducts: ['Structured Products', 'Alternative Investments', 'PMS'],
        assignedRM: 'RM-001',
        assignedRMName: 'Priya Sharma',
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'LT-002',
        clientId: 'HC045',
        clientName: 'Meera Kapoor',
        clientCode: '#HC045',
        eventType: 'bond_maturity',
        amount: 280000000,
        eventDate: new Date(Date.now() + 62 * 24 * 60 * 60 * 1000),
        daysUntilEvent: 62,
        urgency: 'medium',
        dataSource: 'Fixed Income Portfolio Tracker',
        probability: 95,
        confidenceLevel: 'high',
        recommendedActions: [
            'Propose PMS allocation',
            'Present high-yield corporate FD options'
        ],
        recommendedProducts: ['PMS', 'Fixed Income', 'Structured Products'],
        assignedRM: 'RM-002',
        assignedRMName: 'Vikram Singh',
        status: 'engaged',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'LT-003',
        clientId: 'HC128',
        clientName: 'Sanjay Malhotra',
        clientCode: '#HC128',
        eventType: 'esop_vesting',
        amount: 620000000,
        eventDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        daysUntilEvent: 15,
        urgency: 'high',
        dataSource: 'Corporate Action Alerts',
        probability: 92,
        confidenceLevel: 'high',
        recommendedActions: [
            'Immediate meeting for tax optimization',
            'Discuss equity portfolio diversification'
        ],
        recommendedProducts: ['Alternative Investments', 'Real Estate', 'PMS'],
        assignedRM: 'RM-001',
        assignedRMName: 'Priya Sharma',
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'LT-004',
        clientId: 'HC084',
        clientName: 'Megha Iyer',
        clientCode: '#HC084',
        eventType: 'dividend_payout',
        amount: 180000000,
        eventDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
        daysUntilEvent: 75,
        urgency: 'medium',
        dataSource: 'Dividend Tracker',
        probability: 88,
        confidenceLevel: 'high',
        recommendedActions: [
            'Discuss reinvestment strategies',
            'Present tax-efficient investment options'
        ],
        recommendedProducts: ['Mutual Funds', 'PMS', 'Fixed Income'],
        assignedRM: 'RM-003',
        assignedRMName: 'Anita Patel',
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'LT-005',
        clientId: 'HC109',
        clientName: 'Neelam Chopra',
        clientCode: '#HC109',
        eventType: 'business_exit',
        amount: 350000000,
        eventDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        daysUntilEvent: 180,
        urgency: 'early',
        dataSource: 'M&A Intelligence',
        probability: 72,
        confidenceLevel: 'medium',
        recommendedActions: [
            'Build relationship',
            'Understand wealth management goals',
            'Present Nuvama wealth suite'
        ],
        recommendedProducts: ['PMS', 'Alternative Investments', 'Real Estate'],
        assignedRM: 'RM-002',
        assignedRMName: 'Vikram Singh',
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'LT-006',
        clientId: 'HC062',
        clientName: 'Harish Batra',
        clientCode: '#HC062',
        eventType: 'ipo_listing',
        amount: 520000000,
        eventDate: new Date(Date.now() + 220 * 24 * 60 * 60 * 1000),
        daysUntilEvent: 220,
        urgency: 'early',
        dataSource: 'IPO Pipeline Tracker',
        probability: 68,
        confidenceLevel: 'medium',
        recommendedActions: [
            'Monitor IPO progress',
            'Prepare post-listing wealth plan',
            'Discuss diversification early'
        ],
        recommendedProducts: ['PMS', 'Alternative Investments', 'Structured Products'],
        assignedRM: 'RM-001',
        assignedRMName: 'Priya Sharma',
        status: 'upcoming',
        createdAt: new Date(),
        updatedAt: new Date()
    },
];

const MOCK_ENHANCED_METRICS: EnhancedExecutiveMetrics = {
    // Existing metrics
    totalAum: '₹4.6 L Cr',
    aumGrowth: 2.8,
    aumGrowthYoy: 19.2,
    netNewMoney: '₹12,450 Cr',
    operatingMargin: 34.0,
    roe: 31.5,
    totalRMs: 1247,
    revenuePerRM: '₹23.2 L',
    avgRMProductivity: 78,
    totalClients: 134000,
    hniClients: 128500,
    uhniClients: 5500,
    clientRetentionRate: 94.5,
    clientAcquisitionCost: '₹2.8 L',

    // New metrics from client feedback
    targetAUM: '₹5.2 L Cr',
    aumPerRM: '₹3.7 Cr',
    totalLeads: 4400,
    targetLeadsPerQuarter: 1200,
    totalUHNWClients: 5500,
    avgLeadTimeToClosurePerRM: 45,
    avgChurnScore: 12.5,

    // Trend data
    topPerformingRMs: [
        { rmId: 'RM-001', rmName: 'Priya Sharma', aum: 850, growth: 24.5, clientCount: 65, revenue: 42, rank: 1 },
        { rmId: 'RM-002', rmName: 'Vikram Singh', aum: 720, growth: 22.1, clientCount: 58, revenue: 38, rank: 2 },
        { rmId: 'RM-003', rmName: 'Anita Patel', aum: 680, growth: 21.3, clientCount: 52, revenue: 36, rank: 3 },
    ],

    underperformingRMs: [],

    // Regional breakdown (Northern focus)
    regionalBreakdown: [
        { region: 'Delhi NCR', aum: '₹95,000 Cr', growth: 17.2, rmCount: 298, clientCount: 35000 },
        { region: 'Jaipur', aum: '₹28,000 Cr', growth: 15.8, rmCount: 85, clientCount: 12500 },
        { region: 'Chandigarh', aum: '₹18,500 Cr', growth: 14.2, rmCount: 58, clientCount: 8200 },
        { region: 'Lucknow', aum: '₹12,000 Cr', growth: 12.8, rmCount: 42, clientCount: 5800 },
    ],

    productMix: [
        { product: 'PMS', percentage: 35, value: '₹1.61 L Cr', color: '#2A2447' },
        { product: 'Mutual Funds', percentage: 28, value: '₹1.29 L Cr', color: '#E85D54' },
        { product: 'Fixed Income', percentage: 18, value: '₹82,800 Cr', color: '#5A6C7D' },
        { product: 'Alternative Investments', percentage: 12, value: '₹55,200 Cr', color: '#8E99A4' },
        { product: 'Equities', percentage: 7, value: '₹32,200 Cr', color: '#F06E66' },
    ],

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

    // Enhanced data
    liquidityTriggers: MOCK_LIQUIDITY_TRIGGERS,
};

export function useEnhancedExecutiveMetrics() {
    const [metrics, setMetrics] = useState<EnhancedExecutiveMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setMetrics(MOCK_ENHANCED_METRICS);
            setIsLoading(false);
        }, 600);
    }, []);

    const refreshMetrics = () => {
        setIsLoading(true);
        setTimeout(() => {
            setMetrics(MOCK_ENHANCED_METRICS);
            setIsLoading(false);
        }, 600);
    };

    return {
        metrics,
        isLoading,
        refreshMetrics,
        liquidityTriggers: MOCK_LIQUIDITY_TRIGGERS,
    };
}

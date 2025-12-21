/**
 * @file ProductMixByClient.tsx
 * @description Product allocation across current UHNW clients
 */

'use client';

import { useState } from 'react';
import type { ClientProductMix, NuvamaProduct } from '@/types';

interface ProductMixByClientProps {
    data?: ClientProductMix[];
    isLoading?: boolean;
}

// Mock data for current clients
const MOCK_CLIENT_PRODUCT_MIX: ClientProductMix[] = [
    {
        clientId: 'C001',
        clientName: 'Ramesh Gupta',
        clientCode: '#HC001',
        totalAUM: 450000000,
        region: 'Delhi NCR',
        assignedRM: 'Priya Sharma',
        products: [
            { category: 'PMS', aum: 180000000, percentage: 40, lastUpdated: new Date() },
            { category: 'Equities', aum: 112500000, percentage: 25, lastUpdated: new Date() },
            { category: 'Alternative Investments', aum: 90000000, percentage: 20, lastUpdated: new Date() },
            { category: 'Fixed Income', aum: 67500000, percentage: 15, lastUpdated: new Date() },
        ],
        lastReviewDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
        clientId: 'C002',
        clientName: 'Meera Kapoor',
        clientCode: '#HC045',
        totalAUM: 320000000,
        region: 'Delhi NCR',
        assignedRM: 'Vikram Singh',
        products: [
            { category: 'Fixed Income', aum: 128000000, percentage: 40, lastUpdated: new Date() },
            { category: 'PMS', aum: 96000000, percentage: 30, lastUpdated: new Date() },
            { category: 'Mutual Funds', aum: 64000000, percentage: 20, lastUpdated: new Date() },
            { category: 'Insurance', aum: 32000000, percentage: 10, lastUpdated: new Date() },
        ],
        lastReviewDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
        clientId: 'C003',
        clientName: 'Sanjay Malhotra',
        clientCode: '#HC128',
        totalAUM: 850000000,
        region: 'Jaipur',
        assignedRM: 'Priya Sharma',
        products: [
            { category: 'Equities', aum: 340000000, percentage: 40, lastUpdated: new Date() },
            { category: 'Alternative Investments', aum: 255000000, percentage: 30, lastUpdated: new Date() },
            { category: 'Real Estate', aum: 170000000, percentage: 20, lastUpdated: new Date() },
            { category: 'PMS', aum: 85000000, percentage: 10, lastUpdated: new Date() },
        ],
        lastReviewDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    },
];

export default function ProductMixByClient({ data = MOCK_CLIENT_PRODUCT_MIX, isLoading }: ProductMixByClientProps) {
    const [sortBy, setSortBy] = useState<'aum' | 'name'>('aum');
    const [filterRegion, setFilterRegion] = useState<string>('all');

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                    <div className="h-32 bg-gray-200 rounded" />
                    <div className="h-32 bg-gray-200 rounded" />
                </div>
            </div>
        );
    }

    const filteredData = filterRegion === 'all'
        ? data
        : data.filter(c => c.region === filterRegion);

    const sortedData = [...filteredData].sort((a, b) => {
        if (sortBy === 'aum') return b.totalAUM - a.totalAUM;
        return a.clientName.localeCompare(b.clientName);
    });

    const regions = ['all', ...Array.from(new Set(data.map(c => c.region)))];

    const getProductColor = (product: NuvamaProduct): string => {
        const colors: Record<NuvamaProduct, string> = {
            'PMS': '#2A2447',
            'Equities': '#E85D54',
            'Fixed Income': '#5A6C7D',
            'Structured Products': '#8E99A4',
            'Alternative Investments': '#F06E66',
            'Mutual Funds': '#1A1332',
            'Insurance': '#3A3557',
            'Commodities': '#D4AF37',
            'Currency': '#A68519',
            'Real Estate': '#C9A227',
        };
        return colors[product] || '#5A6C7D';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                            Product Mix by Client
                        </h3>
                        <p className="text-sm text-[#5A6C7D] mt-1">
                            Current portfolio allocation across {sortedData.length} UHNW clients
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'aum' | 'name')}
                        className="px-4 py-2 bg-[#F8F9FA] border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E85D54]"
                    >
                        <option value="aum">Sort by AUM</option>
                        <option value="name">Sort by Name</option>
                    </select>

                    <select
                        value={filterRegion}
                        onChange={(e) => setFilterRegion(e.target.value)}
                        className="px-4 py-2 bg-[#F8F9FA] border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E85D54]"
                    >
                        {regions.map(region => (
                            <option key={region} value={region}>
                                {region === 'all' ? 'All Regions' : region}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Client List */}
            <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
                {sortedData.map((client) => (
                    <div key={client.clientId} className="border border-gray-200 rounded-lg p-5 hover:border-[#E85D54] transition-colors">
                        {/* Client Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h4 className="font-semibold text-[#1A1A2E]">
                                    {client.clientName} <span className="text-gray-500 text-sm">({client.clientCode})</span>
                                </h4>
                                <p className="text-sm text-[#5A6C7D]">
                                    {client.region} • RM: {client.assignedRM}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-[#E85D54]">
                                    ₹{(client.totalAUM / 10000000).toFixed(2)} Cr
                                </p>
                                <p className="text-xs text-[#8E99A4]">
                                    Last review: {Math.floor((Date.now() - client.lastReviewDate.getTime()) / (1000 * 60 * 60 * 24))}d ago
                                </p>
                            </div>
                        </div>

                        {/* Product Breakdown */}
                        <div className="space-y-3">
                            {client.products.map((product, idx) => (
                                <div key={idx}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-[#1A1A2E]">{product.category}</span>
                                        <span className="text-sm text-[#5A6C7D]">
                                            ₹{(product.aum / 10000000).toFixed(2)} Cr ({product.percentage}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all"
                                            style={{
                                                width: `${product.percentage}%`,
                                                backgroundColor: getProductColor(product.category),
                                            }}
                                        />
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

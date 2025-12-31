/**
 * @file ProductMixByClient.tsx
 * @description Product allocation across current UHNW clients
 */

'use client';

import { useState } from 'react';
import type { ClientProductMix, KairosCapitalProduct } from '@/types';

interface ProductMixByClientProps {
    data?: ClientProductMix[];
    isLoading?: boolean;
}

const RENDER_REFERENCE_TIMESTAMP = Date.now();

// Mock data for current clients
const MOCK_CLIENT_PRODUCT_MIX: ClientProductMix[] = [
    {
        clientId: 'C001',
        clientName: 'Ramesh Gupta',
        clientCode: '#HC001',
        totalAUM: 450000000,
        region: 'Dubai',
        assignedRM: 'Priya Sharma',
        assignedRMEmail: 'priya.sharma@kairoscapital.mu',
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
        region: 'Abu Dhabi',
        assignedRM: 'Vikram Singh',
        assignedRMEmail: 'vikram.singh@kairoscapital.mu',
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
        assignedRMEmail: 'priya.sharma@kairoscapital.mu',
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

    const getProductColor = (product: KairosCapitalProduct): string => {
        const colors: Record<KairosCapitalProduct, string> = {
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
                                    {client.assignedRMEmail ? (
                                        <a
                                            href={`mailto:${client.assignedRMEmail}?subject=Product%20Recommendation%20for%20${encodeURIComponent(client.clientName)}&body=Hi%20${client.assignedRM.split(' ')[0]},%0A%0AI%20noticed%20an%20opportunity%20for%20${encodeURIComponent(client.clientName)}...`}
                                            className="inline-flex items-center justify-center ml-2 text-gray-400 hover:text-[#E85D54] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E85D54] focus:ring-offset-2 rounded"
                                            title="Send email recommendation"
                                            aria-label={`Send email recommendation to ${client.assignedRM}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                            </svg>
                                        </a>
                                    ) : (
                                        <span
                                            className="inline-flex items-center justify-center ml-2 text-gray-300 cursor-not-allowed"
                                            title="Email not available"
                                            aria-label="Email not available"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                            </svg>
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-[#E85D54]">
                                    ₹{(client.totalAUM / 10000000).toFixed(2)} Cr
                                </p>
                                <p className="text-xs text-[#8E99A4]">
                                    Last review: {Math.floor((RENDER_REFERENCE_TIMESTAMP - client.lastReviewDate.getTime()) / (1000 * 60 * 60 * 24))}d ago
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

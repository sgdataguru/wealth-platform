/**
 * @file ClientReportsPanel.tsx
 * @description AI-generated client reports for Executive dashboard
 */

'use client';

import { Card } from '@/app/components/ui';
import { useState } from 'react';

interface ClientReport {
    id: string;
    clientName: string;
    clientCode: string;
    netWorth: string;
    reportType: 'portfolio' | 'performance' | 'risk' | 'opportunities';
    generatedAt: string; // ISO date string
    summary: string;
    keyMetrics: {
        label: string;
        value: string;
        trend?: 'up' | 'down' | 'stable';
    }[];
    aiInsights: string[];
    recommendations: string[];
}

const mockExecutiveReports: ClientReport[] = [
    {
        id: 'rep-1',
        clientName: 'Rajesh Kumar',
        clientCode: 'UHNW-001',
        netWorth: '₹450 Cr',
        reportType: 'portfolio',
        generatedAt: '2024-12-21T09:00:00',
        summary: 'Comprehensive portfolio analysis reveals strong diversification across 7 asset classes with 18.2% YTD returns. AI identifies opportunity to increase alternative investments allocation from current 12% to optimal 22% based on risk profile and market conditions.',
        keyMetrics: [
            { label: 'Total AUM', value: '₹450 Cr', trend: 'up' },
            { label: 'YTD Returns', value: '+18.2%', trend: 'up' },
            { label: 'Risk Score', value: '6.4/10', trend: 'stable' },
            { label: 'Diversification', value: '7 Assets', trend: 'up' }
        ],
        aiInsights: [
            'Portfolio concentration in technology sector (34%) exceeds optimal threshold - recommend rebalancing',
            'Alternative investments allocation (12%) below peer average (18%) for similar wealth bracket',
            'Fixed income exposure (28%) well-positioned for current interest rate environment',
            'ESOP holdings (₹85 Cr) approaching lock-in expiry in 45 days - liquidity event planning required'
        ],
        recommendations: [
            'Increase alternative investments to 22% through PE/VC fund allocations',
            'Reduce technology sector exposure from 34% to 25% over next quarter',
            'Prepare ESOP liquidation strategy - estimated ₹85 Cr liquidity event',
            'Consider structured products for 8-10% allocation to enhance returns'
        ]
    },
    {
        id: 'rep-2',
        clientName: 'Priya Sharma',
        clientCode: 'UHNW-002',
        netWorth: '₹680 Cr',
        reportType: 'performance',
        generatedAt: '2024-12-21T09:00:00',
        summary: 'Outstanding performance metrics with 24.5% annual returns, significantly outperforming benchmark (Nifty 50: +12.3%). AI analysis attributes success to strategic alternative investments allocation (28%) and timely sector rotation. Client satisfaction score: 9.4/10.',
        keyMetrics: [
            { label: 'Annual Returns', value: '+24.5%', trend: 'up' },
            { label: 'vs Benchmark', value: '+12.2%', trend: 'up' },
            { label: 'Sharpe Ratio', value: '1.82', trend: 'up' },
            { label: 'Satisfaction', value: '9.4/10', trend: 'stable' }
        ],
        aiInsights: [
            'Top quartile performance driven by 28% alternative investments allocation',
            'Sector rotation strategy generated 8.4% alpha over benchmark',
            'Client engagement level: Excellent (92% response rate, avg 3.2 touchpoints/month)',
            'Referral probability: 89% based on satisfaction scores and network analysis'
        ],
        recommendations: [
            'Maintain current alternative investments allocation (28%)',
            'Request warm introductions to 3 UHNW connections in client network',
            'Prepare case study for marketing materials (with client permission)',
            'Schedule quarterly review meeting to discuss tax optimization strategies'
        ]
    },
    {
        id: 'rep-3',
        clientName: 'Vikram Singh',
        clientCode: 'UHNW-003',
        netWorth: '₹320 Cr',
        reportType: 'risk',
        generatedAt: '2024-12-21T09:00:00',
        summary: 'Risk analysis identifies moderate concentration risk in real estate sector (42% of portfolio). AI recommends gradual rebalancing over 6 months. Overall portfolio risk score: 7.2/10 (Aggressive). Client age: 52 years - suggest transition to moderate risk profile.',
        keyMetrics: [
            { label: 'Risk Score', value: '7.2/10', trend: 'up' },
            { label: 'Concentration', value: '42% RE', trend: 'down' },
            { label: 'Volatility', value: '18.4%', trend: 'up' },
            { label: 'Liquidity', value: '65%', trend: 'stable' }
        ],
        aiInsights: [
            'Real estate concentration (42%) creates sector-specific risk exposure',
            'Portfolio volatility (18.4%) higher than age-appropriate benchmark (12-14%)',
            'Liquidity ratio (65%) adequate for near-term needs',
            'Client approaching retirement age (52) - risk profile adjustment recommended'
        ],
        recommendations: [
            'Reduce real estate exposure from 42% to 30% over 6 months',
            'Increase fixed income allocation from 18% to 28%',
            'Implement systematic rebalancing strategy',
            'Schedule risk profile reassessment meeting'
        ]
    },
    {
        id: 'rep-4',
        clientName: 'Anita Patel',
        clientCode: 'UHNW-004',
        netWorth: '₹540 Cr',
        reportType: 'opportunities',
        generatedAt: '2024-12-21T09:00:00',
        summary: 'AI identifies 4 high-probability cross-sell opportunities based on portfolio gaps, investment behavior, and peer analysis. Estimated additional revenue: ₹65 Cr. Client shows strong propensity for structured products and international investments.',
        keyMetrics: [
            { label: 'Cross-Sell Score', value: '8.7/10', trend: 'up' },
            { label: 'Wallet Share', value: '42%', trend: 'stable' },
            { label: 'Opportunity Gap', value: '₹312 Cr', trend: 'up' },
            { label: 'Engagement', value: '88%', trend: 'up' }
        ],
        aiInsights: [
            'Current wallet share (42%) below optimal threshold (60-70%)',
            'Portfolio lacks international exposure - client peer group average: 15%',
            'No structured products despite aggressive risk profile',
            'Recent LinkedIn activity shows interest in ESG investments'
        ],
        recommendations: [
            'Introduce international investment opportunities (target: 12-15% allocation)',
            'Present structured product proposals focusing on equity-linked notes',
            'Develop ESG investment strategy aligned with client values',
            'Target wallet share increase from 42% to 55% over 12 months'
        ]
    }
];

type ReportType = ClientReport['reportType'];

export default function ClientReportsPanel() {
    const [selectedReport, setSelectedReport] = useState<ClientReport | null>(null);
    const [reportFilter, setReportFilter] = useState<ReportType | 'all'>('all');
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedReportType, setSelectedReportType] = useState<ReportType>('portfolio');
    const [isGenerating, setIsGenerating] = useState(false);

    // Mock client list
    const clients = [
        { id: 'UHNW-001', name: 'Rajesh Kumar', netWorth: '₹450 Cr' },
        { id: 'UHNW-002', name: 'Priya Sharma', netWorth: '₹680 Cr' },
        { id: 'UHNW-003', name: 'Vikram Singh', netWorth: '₹320 Cr' },
        { id: 'UHNW-004', name: 'Anita Patel', netWorth: '₹540 Cr' },
        { id: 'UHNW-005', name: 'Sanjay Gupta', netWorth: '₹890 Cr' },
        { id: 'UHNW-006', name: 'Neha Kapoor', netWorth: '₹275 Cr' }
    ];

    const handleGenerateReport = () => {
        if (!selectedClient) {
            alert('Please select a client');
            return;
        }

        setIsGenerating(true);
        
        // Simulate AI report generation
        setTimeout(() => {
            setIsGenerating(false);
            setShowGenerateModal(false);
            const clientName = clients.find(c => c.id === selectedClient)?.name;
            alert(`✅ ${selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} report generated successfully for ${clientName}!\n\nThe report will appear in the list below.`);
            setSelectedClient('');
            setSelectedReportType('portfolio');
        }, 2000);
    };

    const reportTypes: { id: ReportType | 'all'; label: string; icon: string }[] = [
        { id: 'all', label: 'All Reports', icon: '📊' },
        { id: 'portfolio', label: 'Portfolio', icon: '💼' },
        { id: 'performance', label: 'Performance', icon: '📈' },
        { id: 'risk', label: 'Risk', icon: '⚠️' },
        { id: 'opportunities', label: 'Opportunities', icon: '💎' }
    ];

    const filteredReports = reportFilter === 'all'
        ? mockExecutiveReports
        : mockExecutiveReports.filter(r => r.reportType === reportFilter);

    const getReportTypeColor = (type: ReportType | 'all') => {
        switch (type) {
            case 'portfolio': return 'bg-[#1A1332] text-white';
            case 'performance': return 'bg-[#28A745] text-white';
            case 'risk': return 'bg-[#DC3545] text-white';
            case 'opportunities': return 'bg-[#E85D54] text-white';
            default: return 'bg-[#5A6C7D] text-white';
        }
    };

    const getTrendIcon = (trend?: string) => {
        switch (trend) {
            case 'up': return '↑';
            case 'down': return '↓';
            case 'stable': return '→';
            default: return '';
        }
    };

    const getTrendColor = (trend?: string) => {
        switch (trend) {
            case 'up': return 'text-[#28A745]';
            case 'down': return 'text-[#DC3545]';
            case 'stable': return 'text-[#5A6C7D]';
            default: return 'text-[#5A6C7D]';
        }
    };

    return (
        <Card padding="lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                         AI-Generated Client Reports
                    </h3>
                    <p className="text-sm text-[#5A6C7D] mt-1">
                        Automated comprehensive reports for UHNW clients (&gt;?100 Cr)  Generated daily
                    </p>
                </div>
                <button 
                    onClick={() => setShowGenerateModal(true)}
                    className="px-4 py-2 bg-[#E85D54] text-white rounded-lg text-sm font-medium hover:bg-[#D14D44] transition-colors"
                >
                    Generate New Report
                </button>
            </div>

            {/* Report Type Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {reportTypes.map(type => (
                    <button
                        key={type.id}
                        onClick={() => setReportFilter(type.id)}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${reportFilter === type.id
                                ? 'bg-[#1A1332] text-white shadow-md'
                                : 'bg-[#F8F9FA] text-[#5A6C7D] hover:bg-[#E5E4E2]'
                            }
                        `}
                    >
                        <span className="mr-2">{type.icon}</span>
                        {type.label}
                    </button>
                ))}
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {filteredReports.map(report => (
                    <div
                        key={report.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        onClick={() => setSelectedReport(report)}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h4 className="font-semibold text-[#1A1A2E] mb-1">
                                    {report.clientName}
                                </h4>
                                <p className="text-xs text-[#8E99A4]">
                                    {report.clientCode} • Net Worth: {report.netWorth}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getReportTypeColor(report.reportType)}`}>
                                {report.reportType.toUpperCase()}
                            </span>
                        </div>

                        <p className="text-sm text-[#5A6C7D] mb-3 line-clamp-2">
                            {report.summary}
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                            {report.keyMetrics.slice(0, 4).map((metric, idx) => (
                                <div key={idx} className="bg-[#F8F9FA] p-2 rounded">
                                    <p className="text-xs text-[#8E99A4]">{metric.label}</p>
                                    <p className={`text-sm font-semibold ${getTrendColor(metric.trend)}`}>
                                        {metric.value} {getTrendIcon(metric.trend)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <button className="mt-3 text-sm text-[#E85D54] font-medium hover:underline">
                            View Full Report →
                        </button>
                    </div>
                ))}
            </div>

            {/* Detailed Report Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                                    {selectedReport.clientName} - {selectedReport.reportType.charAt(0).toUpperCase() + selectedReport.reportType.slice(1)} Report
                                </h3>
                                <p className="text-sm text-[#5A6C7D] mt-1">
                                    {selectedReport.clientCode} • Generated: {selectedReport.generatedAt || 'Today'}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="text-[#5A6C7D] hover:text-[#1A1A2E] text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Summary */}
                            <div>
                                <h4 className="font-semibold text-[#1A1A2E] mb-2">Executive Summary</h4>
                                <p className="text-sm text-[#5A6C7D] leading-relaxed">
                                    {selectedReport.summary}
                                </p>
                            </div>

                            {/* Key Metrics */}
                            <div>
                                <h4 className="font-semibold text-[#1A1A2E] mb-3">Key Metrics</h4>
                                <div className="grid grid-cols-4 gap-4">
                                    {selectedReport.keyMetrics.map((metric, idx) => (
                                        <div key={idx} className="bg-[#F8F9FA] p-4 rounded-lg">
                                            <p className="text-xs text-[#8E99A4] mb-1">{metric.label}</p>
                                            <p className={`text-xl font-bold ${getTrendColor(metric.trend)}`}>
                                                {metric.value}
                                            </p>
                                            {metric.trend && (
                                                <p className={`text-sm ${getTrendColor(metric.trend)}`}>
                                                    {getTrendIcon(metric.trend)} {metric.trend}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* AI Insights */}
                            <div>
                                <h4 className="font-semibold text-[#1A1A2E] mb-3">🤖 AI Insights</h4>
                                <ul className="space-y-2">
                                    {selectedReport.aiInsights.map((insight, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-[#5A6C7D]">
                                            <span className="text-[#E85D54] mt-1">•</span>
                                            <span>{insight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Recommendations */}
                            <div>
                                <h4 className="font-semibold text-[#1A1A2E] mb-3">💡 Recommendations</h4>
                                <ul className="space-y-2">
                                    {selectedReport.recommendations.map((rec, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-[#1A1A2E]">
                                            <span className="text-[#28A745] mt-1">✓</span>
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button className="px-6 py-3 bg-[#E85D54] text-white rounded-lg font-medium hover:bg-[#D14D44] transition-colors">
                                    Assign to RM
                                </button>
                                <button className="px-6 py-3 bg-[#1A1332] text-white rounded-lg font-medium hover:bg-[#2A2447] transition-colors">
                                    Export PDF
                                </button>
                                <button className="px-6 py-3 border border-gray-300 text-[#5A6C7D] rounded-lg font-medium hover:bg-[#F8F9FA] transition-colors">
                                    Email to Client
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Stats */}
            <div className="pt-6 border-t border-gray-200">
                <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-[#1A1A2E]">{mockExecutiveReports.length}</p>
                        <p className="text-xs text-[#8E99A4] mt-1">Reports Generated</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-[#E85D54]">₹1,990 Cr</p>
                        <p className="text-xs text-[#8E99A4] mt-1">Total AUM Covered</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-[#28A745]">+19.8%</p>
                        <p className="text-xs text-[#8E99A4] mt-1">Avg Returns</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-[#1A1332]">12</p>
                        <p className="text-xs text-[#8E99A4] mt-1">Action Items</p>
                    </div>
                </div>
            </div>
            {/* Generate Report Modal */}
            {showGenerateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                                Generate New Report
                            </h3>
                            <button onClick={() => setShowGenerateModal(false)} className="text-[#5A6C7D] hover:text-[#1A1A2E] text-2xl"></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">Select Client</label>
                                <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E85D54]">
                                    <option value="">Choose a client...</option>
                                    {clients.map(client => (<option key={client.id} value={client.id}>{client.name} ({client.netWorth})</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1A1A2E] mb-2">Report Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {reportTypes.filter(t => t.id !== 'all').map(type => (
                                        <button key={type.id} onClick={() => setSelectedReportType(type.id)} className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${selectedReportType === type.id ? 'bg-[#E85D54] text-white border-[#E85D54]' : 'bg-white text-[#5A6C7D] border-gray-300 hover:border-[#E85D54]'}`}>
                                            <div className="text-2xl mb-1">{type.icon}</div>{type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button onClick={handleGenerateReport} disabled={isGenerating || !selectedClient} className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${isGenerating || !selectedClient ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#E85D54] text-white hover:bg-[#D14D44]'}`}>
                                    {isGenerating ? (<span className="flex items-center justify-center gap-2"><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Generating...</span>) : (' Generate Report')}
                                </button>
                                <button onClick={() => setShowGenerateModal(false)} disabled={isGenerating} className="px-6 py-3 border border-gray-300 text-[#5A6C7D] rounded-lg font-medium hover:bg-[#F8F9FA] transition-colors disabled:opacity-50">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </Card>
    );
}

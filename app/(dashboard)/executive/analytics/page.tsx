/**
 * @file app/(dashboard)/executive/analytics/page.tsx
 * @description Executive Analytics - Strategic firm-wide insights
 */

'use client';

import { Header, Sidebar } from '@/app/components/layout';
import { Card } from '@/app/components/ui';
import TeamComparisonTable from './components/TeamComparisonTable';
import RevenueAttributionChart from './components/RevenueAttributionChart';
import MarketShareTrends from './components/MarketShareTrends';


export default function ExecutiveAnalyticsPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <Header />

            <div className="flex">
                <Sidebar activePage="executive-analytics" />

                <main className="flex-1 p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                            Analytics
                        </h1>
                        <p className="text-[#5A6C7D] mt-1">
                            Strategic insights for firm-wide performance management
                        </p>
                    </div>

                    {/* Key Performance Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                                    Firm Conversion Rate
                                </span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-[#1A1A2E]">24.2%</span>
                                    <span className="text-sm text-[#28A745]">↑ 2.1%</span>
                                </div>
                                <span className="text-xs text-[#5A6C7D] mt-2">YoY improvement</span>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                                    Cost Per Acquisition
                                </span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-[#1A1A2E]">₹12L</span>
                                </div>
                                <span className="text-xs text-[#28A745] mt-2">↓ ₹3L vs last quarter</span>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                                    Avg Client LTV
                                </span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-[#1A1A2E]">₹45 Cr</span>
                                </div>
                                <span className="text-xs text-[#5A6C7D] mt-2">Over 5 years</span>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                                    Market Share (Mumbai)
                                </span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-[#E85D54]">18.5%</span>
                                </div>
                                <span className="text-xs text-[#28A745] mt-2">↑ 1.2% vs last year</span>
                            </div>
                        </Card>
                    </div>

                    {/* Market Share Trends */}
                    <div className="mb-8">
                        <MarketShareTrends />
                    </div>

                    {/* Revenue Attribution & Team Comparison */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <RevenueAttributionChart />
                        <Card padding="lg">
                            <h3 className="text-xl font-semibold text-[#1A1A2E] mb-6 font-[family-name:var(--font-playfair)]">
                                Product Penetration
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-[#1A1A2E]">Multi-Product Clients</span>
                                        <span className="text-sm font-semibold text-[#1A1A2E]">68%</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#E85D54] to-[#F06E66]" style={{ width: '68%' }} />
                                    </div>
                                    <p className="text-xs text-[#28A745] mt-1">↑ 5% vs last quarter</p>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-[#1A1A2E]">Average Products per Client</span>
                                        <span className="text-sm font-semibold text-[#1A1A2E]">2.4</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#2A2447] to-[#5A6C7D]" style={{ width: '48%' }} />
                                    </div>
                                    <p className="text-xs text-[#5A6C7D] mt-1">Target: 3.0 products</p>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <h4 className="font-semibold text-[#1A1A2E] mb-3 text-sm">Top Cross-Sell Combinations</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#5A6C7D]">PMS + Mutual Funds</span>
                                            <span className="font-semibold text-[#1A1A2E]">45%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#5A6C7D]">PMS + Alternative Inv</span>
                                            <span className="font-semibold text-[#1A1A2E]">32%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#5A6C7D]">Fixed Income + PMS</span>
                                            <span className="font-semibold text-[#1A1A2E]">28%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Team Comparison Table */}
                    <div className="mb-8">
                        <TeamComparisonTable />
                    </div>



                    {/* Risk Indicators */}
                    <Card padding="lg">
                        <h3 className="text-xl font-semibold text-[#1A1A2E] mb-6 font-[family-name:var(--font-playfair)]">
                            Risk Indicators
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="border-l-4 border-[#28A745] pl-4">
                                <p className="text-xs text-[#8E99A4] uppercase font-semibold mb-2">Client Concentration</p>
                                <p className="text-2xl font-bold text-[#28A745]">Low Risk</p>
                                <p className="text-sm text-[#5A6C7D] mt-2">Top 10 clients: 22% of AUM</p>
                                <p className="text-xs text-[#5A6C7D] mt-1">Well-diversified portfolio</p>
                            </div>

                            <div className="border-l-4 border-[#FFC107] pl-4">
                                <p className="text-xs text-[#8E99A4] uppercase font-semibold mb-2">RM Turnover Risk</p>
                                <p className="text-2xl font-bold text-[#FFC107]">Medium</p>
                                <p className="text-sm text-[#5A6C7D] mt-2">12-month turnover: 8%</p>
                                <p className="text-xs text-[#5A6C7D] mt-1">Industry avg: 6%</p>
                            </div>

                            <div className="border-l-4 border-[#28A745] pl-4">
                                <p className="text-xs text-[#8E99A4] uppercase font-semibold mb-2">Pipeline Coverage</p>
                                <p className="text-2xl font-bold text-[#28A745]">Healthy</p>
                                <p className="text-sm text-[#5A6C7D] mt-2">3.2x quarterly target</p>
                                <p className="text-xs text-[#5A6C7D] mt-1">Adequate coverage</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="font-semibold text-[#1A1A2E] mb-3">🎯 Strategic Actions</h4>
                            <ul className="space-y-2 text-sm text-[#5A6C7D]">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#28A745]">✓</span>
                                    <span>Client concentration is healthy - no immediate action needed</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#FFC107]">→</span>
                                    <span>Monitor RM satisfaction scores - consider retention bonuses for top performers</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#2A2447]">📊</span>
                                    <span>Pipeline coverage strong - maintain current lead generation investment</span>
                                </li>
                            </ul>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
}

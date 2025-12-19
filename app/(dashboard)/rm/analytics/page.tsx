/**
 * @file app/(dashboard)/rm/analytics/page.tsx
 * @description RM Analytics - Tactical insights for lead conversion
 */

'use client';

import { Header, Sidebar } from '@/app/components/layout';
import { Card } from '@/app/components/ui';
import ConversionFunnel from './components/ConversionFunnel';
import ActivityDashboard from './components/ActivityDashboard';
import LeadSourceChart from './components/LeadSourceChart';
import WinLossAnalysis from './components/WinLossAnalysis';

export default function RMAnalyticsPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <Header />

            <div className="flex">
                <Sidebar activePage="rm-analytics" />

                <main className="flex-1 p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                            Analytics
                        </h1>
                        <p className="text-[#5A6C7D] mt-1">
                            Tactical insights to optimize your lead conversion
                        </p>
                    </div>

                    {/* Key Metrics Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                                    Conversion Rate
                                </span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-[#1A1A2E]">28.5%</span>
                                    <span className="text-sm text-[#28A745]">↑ 3.2%</span>
                                </div>
                                <span className="text-xs text-[#5A6C7D] mt-2">Above team avg (24%)</span>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                                    Avg Time to Close
                                </span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-[#1A1A2E]">42</span>
                                    <span className="text-sm text-[#5A6C7D]">days</span>
                                </div>
                                <span className="text-xs text-[#28A745] mt-2">↓ 6 days vs last month</span>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                                    Response Rate
                                </span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-[#1A1A2E]">64%</span>
                                </div>
                                <span className="text-xs text-[#5A6C7D] mt-2">Emails & calls combined</span>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[#8E99A4] uppercase tracking-wider">
                                    Best Lead Source
                                </span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-xl font-bold text-[#C9A227]">Referrals</span>
                                </div>
                                <span className="text-xs text-[#5A6C7D] mt-2">40% conversion rate</span>
                            </div>
                        </Card>
                    </div>

                    {/* Conversion Funnel */}
                    <div className="mb-8">
                        <ConversionFunnel />
                    </div>

                    {/* Activity Dashboard & Win/Loss */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <ActivityDashboard />
                        <WinLossAnalysis />
                    </div>

                    {/* Lead Source Performance */}
                    <div className="mb-8">
                        <LeadSourceChart />
                    </div>

                    {/* Pipeline Health Alerts */}
                    <Card padding="lg">
                        <h3 className="text-xl font-semibold text-[#1A1A2E] mb-4 font-[family-name:var(--font-playfair)]">
                            Pipeline Health Alerts
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-4 bg-[#FFF4E6] border border-[#FFC107] rounded-lg">
                                <span className="text-2xl">⚠️</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-[#1A1A2E]">3 High-Value Deals Stale</p>
                                    <p className="text-sm text-[#5A6C7D] mt-1">
                                        No activity in 14+ days. Total value: ₹85 Cr
                                    </p>
                                    <button className="text-sm text-[#C9A227] font-medium mt-2 hover:underline">
                                        Review Now →
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-[#E8F5E9] border border-[#28A745] rounded-lg">
                                <span className="text-2xl">🔥</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-[#1A1A2E]">5 Hot Opportunities</p>
                                    <p className="text-sm text-[#5A6C7D] mt-1">
                                        Recent signals detected, high engagement scores
                                    </p>
                                    <button className="text-sm text-[#28A745] font-medium mt-2 hover:underline">
                                        View Prospects →
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-[#FFF3F3] border border-[#DC3545] rounded-lg">
                                <span className="text-2xl">⏰</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-[#1A1A2E]">2 Proposals Expiring Soon</p>
                                    <p className="text-sm text-[#5A6C7D] mt-1">
                                        Valid until end of week. Follow up required.
                                    </p>
                                    <button className="text-sm text-[#DC3545] font-medium mt-2 hover:underline">
                                        Take Action →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
}

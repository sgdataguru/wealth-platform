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
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Header />

            <div className="flex">
                <Sidebar activePage="executive-analytics" />

                <main className="flex-1 p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-playfair)]">
                            Analytics
                        </h1>
                        <p className="text-[var(--text-secondary)] mt-1">
                            Strategic insights for firm-wide performance management
                        </p>
                    </div>

                    {/* Key Performance Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                                    Firm Conversion Rate
                                </span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-[var(--text-primary)]">24.2%</span>
                                    <span className="text-sm text-[var(--success)]">↑ 2.1%</span>
                                </div>
                                <span className="text-xs text-[var(--text-secondary)] mt-2">YoY improvement</span>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                                    Cost Per Acquisition
                                </span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-[var(--text-primary)]">$1.2 Million</span>
                                </div>
                                <span className="text-xs text-[var(--success)] mt-2">↓ $300K</span>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                                    Avg Client LTV
                                </span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-[var(--text-primary)]">$450 Million</span>
                                </div>
                                <span className="text-xs text-[var(--text-secondary)] mt-2">Over 5 years</span>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                                    Market Share (Dubai)
                                </span>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-3xl font-bold text-[var(--accent-coral)]">18.5%</span>
                                </div>
                                <span className="text-xs text-[var(--success)] mt-2">↑ 1.2% vs last year</span>
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
                            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6 font-[family-name:var(--font-playfair)]">
                                Product Penetration
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-[var(--text-primary)]">Multi-Product Clients</span>
                                        <span className="text-sm font-semibold text-[var(--text-primary)]">68%</span>
                                    </div>
                                    <div className="h-3 bg-[var(--bg-dark)] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[var(--accent-coral)] to-[var(--accent-coral-light)]" style={{ width: '68%' }} />
                                    </div>
                                    <p className="text-xs text-[var(--success)] mt-1">↑ 5% vs last quarter</p>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-[var(--text-primary)]">Average Products per Client</span>
                                        <span className="text-sm font-semibold text-[var(--text-primary)]">2.4</span>
                                    </div>
                                    <div className="h-3 bg-[var(--bg-dark)] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[var(--obsidian-800)] to-[var(--text-secondary)]" style={{ width: '48%' }} />
                                    </div>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">Target: 3.0 products</p>
                                </div>

                                <div className="pt-4 border-t border-[var(--header-border)]">
                                    <h4 className="font-semibold text-[var(--text-primary)] mb-3 text-sm">Top Cross-Sell Combinations</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[var(--text-secondary)]">PMS + Mutual Funds</span>
                                            <span className="font-semibold text-[var(--text-primary)]">45%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[var(--text-secondary)]">PMS + Alternative Inv</span>
                                            <span className="font-semibold text-[var(--text-primary)]">32%</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[var(--text-secondary)]">Fixed Income + PMS</span>
                                            <span className="font-semibold text-[var(--text-primary)]">28%</span>
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
                        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6 font-[family-name:var(--font-playfair)]">
                            Risk Indicators
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="border-l-4 border-[var(--success)] pl-4">
                                <p className="text-xs text-[var(--text-muted)] uppercase font-semibold mb-2">Client Concentration</p>
                                <p className="text-2xl font-bold text-[var(--success)]">Low Risk</p>
                                <p className="text-sm text-[var(--text-secondary)] mt-2">Top 10 clients: 22% of AUM</p>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">Well-diversified portfolio</p>
                            </div>

                            <div className="border-l-4 border-[var(--warning)] pl-4">
                                <p className="text-xs text-[var(--text-muted)] uppercase font-semibold mb-2">RM Turnover Risk</p>
                                <p className="text-2xl font-bold text-[var(--warning)]">Medium</p>
                                <p className="text-sm text-[var(--text-secondary)] mt-2">12-month turnover: 8%</p>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">Industry avg: 6%</p>
                            </div>

                            <div className="border-l-4 border-[var(--success)] pl-4">
                                <p className="text-xs text-[var(--text-muted)] uppercase font-semibold mb-2">Pipeline Coverage</p>
                                <p className="text-2xl font-bold text-[var(--success)]">Healthy</p>
                                <p className="text-sm text-[var(--text-secondary)] mt-2">3.2x quarterly target</p>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">Adequate coverage</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-[var(--header-border)]">
                            <h4 className="font-semibold text-[var(--text-primary)] mb-3">🎯 Strategic Actions</h4>
                            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--success)]">✓</span>
                                    <span>Client concentration is healthy - no immediate action needed</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--warning)]">→</span>
                                    <span>Monitor RM satisfaction scores - consider retention bonuses for top performers</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--text-primary)]">📊</span>
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

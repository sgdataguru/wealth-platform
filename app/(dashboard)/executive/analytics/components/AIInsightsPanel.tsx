/**
 * @file AIInsightsPanel.tsx
 * @description AI-powered insights panel for Executive dashboard
 */

'use client';

import { Card } from '@/app/components/ui';
import { useState } from 'react';

interface AIInsight {
    id: string;
    category: 'opportunity' | 'risk' | 'trend' | 'recommendation';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    confidence: number; // 0-100
    actionable: boolean;
    suggestedAction?: string;
    actionBy?: string; // New field for action owner/date
    dataPoints: string[];
    generatedAt: string; // ISO date string
}

const mockExecutiveInsights: AIInsight[] = [
    {
        id: 'ai-1',
        category: 'opportunity',
        title: 'Untapped UHNW Segment in Delhi NCR',
        description: 'AI analysis reveals 47 UHNW individuals (>$100 Million net worth) in Delhi NCR with recent liquidity events who are not currently engaged with any major wealth management firm. Average wealth: $285 Million.',
        impact: 'high',
        confidence: 87,
        actionable: true,
        suggestedAction: 'Deploy 3 senior RMs to Delhi NCR with targeted outreach campaign. Estimated potential AUM capture: $1,340 Million over 6 months.',
        actionBy: 'Jan 15, 2025',
        dataPoints: [
            '47 UHNW prospects identified',
            'Avg net worth: ₹285 Cr',
            'Recent IPO exits: 23 individuals',
            'M&A exits: 18 individuals',
            'Series C+ funding: 6 individuals'
        ],
        generatedAt: '2024-12-21T08:30:00'
    },
    {
        id: 'ai-2',
        category: 'risk',
        title: 'Client Churn Risk Pattern Detected',
        description: 'Machine learning model identifies 12 UHNW clients showing early churn signals based on engagement patterns, product utilization, and communication frequency. Combined AUM at risk: $890 Million.',
        impact: 'high',
        confidence: 92,
        actionable: true,
        suggestedAction: 'Immediate executive-level intervention required. Schedule face-to-face meetings with top 5 at-risk clients within 7 days. Assign dedicated relationship managers.',
        dataPoints: [
            '12 clients with churn signals',
            'AUM at risk: $890 Million',
            'Avg engagement drop: 64%',
            'Product utilization down 42%',
            'Last contact: 45+ days avg'
        ],
        generatedAt: '2024-12-21T09:15:00'
    },
    {
        id: 'ai-3',
        category: 'trend',
        title: 'Alternative Investments Demand Surge',
        description: 'Cross-client analysis shows 68% of UHNW clients (>$100 Million) are actively seeking alternative investment opportunities, particularly in PE/VC funds and structured products. Current penetration: only 23%.',
        impact: 'high',
        confidence: 89,
        actionable: true,
        suggestedAction: 'Launch dedicated Alternative Investments desk. Partner with 3-5 top PE/VC firms. Target: Increase alt-inv penetration from 23% to 45% in Q1 2025.',
        dataPoints: [
            '68% clients seeking alt-investments',
            'Current penetration: 23%',
            'Potential revenue: $180 Million annually',
            'Competitor penetration: 41%',
            'Client age group: 35-52 years'
        ],
        generatedAt: '2024-12-21T07:45:00'
    },
    {
        id: 'ai-4',
        category: 'recommendation',
        title: 'RM Performance Optimization',
        description: 'AI analysis of top-performing RMs reveals key success patterns: 3.2x more client touchpoints, 2.1x higher voice note usage, and 85% faster response times. Bottom quartile RMs show inverse patterns.',
        impact: 'medium',
        confidence: 91,
        actionable: true,
        suggestedAction: 'Implement mandatory RM training program focusing on: (1) Daily client touchpoints, (2) Voice note adoption, (3) Response time SLAs. Expected conversion rate improvement: +8-12%.',
        dataPoints: [
            'Top RMs: 3.2x more touchpoints',
            'Voice note usage: 2.1x higher',
            'Response time: 85% faster',
            'Conversion rate gap: 18%',
            'Training ROI: 340% in 6 months'
        ],
        generatedAt: '2024-12-21T06:20:00'
    },
    {
        id: 'ai-5',
        category: 'opportunity',
        title: 'Cross-Sell Opportunity: PMS to Structured Products',
        description: 'Predictive model identifies 34 PMS clients with high propensity for structured products based on risk profile, portfolio composition, and investment behavior. Estimated additional revenue: ₹45 Cr.',
        impact: 'medium',
        confidence: 84,
        actionable: true,
        suggestedAction: 'Create personalized structured product proposals for identified 34 clients. Assign to top 3 RMs with highest structured product conversion rates.',
        actionBy: 'TBD',
        dataPoints: [
            '34 high-propensity clients',
            'Avg PMS holding: $120 Million',
            'Risk appetite: Aggressive',
            'Expected allocation: 15-20%',
            'Estimated revenue: $45 Million'
        ],
        generatedAt: '2024-12-21T10:00:00'
    },
    {
        id: 'ai-6',
        category: 'trend',
        title: 'Regional Shift: Mumbai to Bangalore Migration',
        description: 'Geospatial analysis reveals 18% of Mumbai-based UHNW tech entrepreneurs are relocating to Bangalore. Current Bangalore RM capacity insufficient to handle influx.',
        impact: 'medium',
        confidence: 78,
        actionable: true,
        suggestedAction: 'Expand Bangalore team by 2 senior RMs. Establish dedicated tech entrepreneur desk. Maintain Mumbai relationships through hybrid model.',
        dataPoints: [
            '18% Mumbai→Bangalore migration',
            'Tech entrepreneur segment',
            'Avg wealth: $340 Million',
            'Current Bangalore capacity: 65%',
            'Projected growth: 35% in 12 months'
        ],
        generatedAt: '2024-12-20T16:30:00'
    }
];

export default function AIInsightsPanel() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
    const [insights, setInsights] = useState<AIInsight[]>(mockExecutiveInsights);

    const categories = [
        { id: 'all', label: 'All Insights', icon: '🤖' },
        { id: 'opportunity', label: 'Opportunities', icon: '💎' },
        { id: 'risk', label: 'Risks', icon: '⚠️' },
        { id: 'trend', label: 'Trends', icon: '📈' },
        { id: 'recommendation', label: 'Recommendations', icon: '💡' },
        { id: 'action_items', label: 'Action Items', icon: '⚡' }
    ];

    const filteredInsights = selectedCategory === 'all'
        ? insights
        : selectedCategory === 'action_items'
            ? insights.filter(i => i.actionable || i.actionBy)
            : insights.filter(i => i.category === selectedCategory);

    const handleMoveToRisk = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setInsights(prev => prev.map(insight =>
            insight.id === id
                ? { ...insight, category: 'risk', title: `[Risk] ${insight.title}`, description: `Moved from Opportunity: ${insight.description}` }
                : insight
        ));
        // Optional: Show toast here
    };

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'high': return 'text-[#DC3545] bg-[#FFF3F3] border-[#DC3545]';
            case 'medium': return 'text-[#FFC107] bg-[#FFF4E6] border-[#FFC107]';
            case 'low': return 'text-[#28A745] bg-[#E8F5E9] border-[#28A745]';
            default: return 'text-[#5A6C7D] bg-[#F8F9FA] border-[#5A6C7D]';
        }
    };

    const getCategoryIcon = (category: string) => {
        const cat = categories.find(c => c.id === category);
        return cat?.icon || '🤖';
    };

    return (
        <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                        AI-Powered Strategic Insights
                    </h3>
                    <p className="text-sm text-[#5A6C7D] mt-1">
                        Machine learning analysis of firm-wide data • Updated every 6 hours
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#8E99A4]">
                    <div className="w-2 h-2 bg-[#28A745] rounded-full animate-pulse" />
                    <span>Live Analysis</span>
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${selectedCategory === cat.id
                                ? 'bg-[#1A1332] text-white shadow-md'
                                : 'bg-[#F8F9FA] text-[#5A6C7D] hover:bg-[#E5E4E2]'
                            }
                        `}
                    >
                        <span className="mr-2">{cat.icon}</span>
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Insights List */}
            <div className="space-y-4">
                {filteredInsights.map(insight => (
                    <div
                        key={insight.id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="p-4 bg-white">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3 flex-1">
                                    <span className="text-2xl">{getCategoryIcon(insight.category)}</span>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-[#1A1A2E] mb-1">
                                            {insight.title}
                                        </h4>
                                        <p className="text-sm text-[#5A6C7D] leading-relaxed">
                                            {insight.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 ml-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getImpactColor(insight.impact)}`}>
                                        {insight.impact.toUpperCase()} IMPACT
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-[#5A6C7D]">
                                        <span>Confidence:</span>
                                        <span className="font-semibold text-[#1A1A2E]">{insight.confidence}%</span>
                                    </div>
                                    {insight.actionBy && (
                                        <div className="flex items-center gap-1 text-xs font-medium text-[#E85D54] bg-[#FFF3F3] px-2 py-0.5 rounded">
                                            <span>Action By:</span>
                                            <span>{insight.actionBy}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Expandable Details */}
                            {expandedInsight === insight.id && (
                                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                                    {/* Data Points */}
                                    <div>
                                        <h5 className="text-xs font-semibold text-[#8E99A4] uppercase mb-2">
                                            Key Data Points
                                        </h5>
                                        <ul className="space-y-1">
                                            {insight.dataPoints.map((point, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-[#5A6C7D]">
                                                    <span className="text-[#E85D54] mt-1">•</span>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Suggested Action */}
                                    {insight.suggestedAction && (
                                        <div className="bg-[#F8F9FA] p-4 rounded-lg">
                                            <h5 className="text-xs font-semibold text-[#8E99A4] uppercase mb-2">
                                                💡 Recommended Action
                                            </h5>
                                            <p className="text-sm text-[#1A1A2E] leading-relaxed">
                                                {insight.suggestedAction}
                                            </p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button className="px-4 py-2 bg-[#E85D54] text-white rounded-lg text-sm font-medium hover:bg-[#D14D44] transition-colors">
                                            Assign to RM
                                        </button>
                                        <button className="px-4 py-2 bg-[#1A1332] text-white rounded-lg text-sm font-medium hover:bg-[#2A2447] transition-colors">
                                            Create Task
                                        </button>
                                        <button className="px-4 py-2 border border-gray-300 text-[#5A6C7D] rounded-lg text-sm font-medium hover:bg-[#F8F9FA] transition-colors">
                                            Export Report
                                        </button>
                                        {insight.category === 'opportunity' && (
                                            <button
                                                onClick={(e) => handleMoveToRisk(insight.id, e)}
                                                className="px-4 py-2 border border-[#DC3545] text-[#DC3545] rounded-lg text-sm font-medium hover:bg-[#FFF3F3] transition-colors flex items-center gap-2"
                                            >
                                                <span>⚠️</span> Move to Risk
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Toggle Button */}
                            <button
                                onClick={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
                                className="mt-3 text-sm text-[#E85D54] font-medium hover:underline"
                            >
                                {expandedInsight === insight.id ? '↑ Show Less' : '↓ View Details & Actions'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-[#1A1A2E]">{mockExecutiveInsights.length}</p>
                        <p className="text-xs text-[#8E99A4] mt-1">Total Insights</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-[#DC3545]">
                            {mockExecutiveInsights.filter(i => i.impact === 'high').length}
                        </p>
                        <p className="text-xs text-[#8E99A4] mt-1">High Impact</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-[#28A745]">
                            {mockExecutiveInsights.filter(i => i.actionable).length}
                        </p>
                        <p className="text-xs text-[#8E99A4] mt-1">Actionable</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-[#E85D54]">89%</p>
                        <p className="text-xs text-[#8E99A4] mt-1">Avg Confidence</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

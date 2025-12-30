/**
 * @file AIInsightsPanel.tsx
 * @description AI-powered insights panel for RM dashboard
 */

'use client';

import { Card } from '@/app/components/ui';
import { useState } from 'react';

interface AIInsight {
    id: string;
    category: 'client' | 'engagement' | 'conversion' | 'timing';
    title: string;
    description: string;
    priority: 'urgent' | 'high' | 'medium';
    confidence: number;
    actionable: boolean;
    suggestedAction?: string;
    clientName?: string;
    estimatedValue?: string;
    dataPoints: string[];
}

const mockRMInsights: AIInsight[] = [
    {
        id: 'rm-1',
        category: 'client',
        title: 'Rajesh Kumar - High Conversion Probability',
        description: 'AI model predicts 87% probability of conversion within 14 days based on engagement patterns, signal strength (IPO filing), and communication frequency. Estimated wallet capture: $180 Million.',
        priority: 'urgent',
        confidence: 87,
        actionable: true,
        clientName: 'Rajesh Kumar',
        estimatedValue: '$180 Million',
        suggestedAction: 'Schedule in-person meeting within 48 hours. Prepare customized PMS proposal focusing on post-IPO wealth management. Highlight tax optimization strategies.',
        dataPoints: [
            'IPO filing detected 12 days ago',
            'Email open rate: 92%',
            'Last meeting: 6 days ago',
            'Engagement score: 94/100',
            'Similar client conversions: 8/9'
        ]
    },
    {
        id: 'rm-2',
        category: 'timing',
        title: 'Optimal Contact Time: Priya Sharma',
        description: 'Historical analysis shows Priya Sharma has 3.2x higher response rate when contacted between 2-4 PM on Tuesdays or Thursdays. Last successful engagement: Thursday 3:15 PM.',
        priority: 'high',
        confidence: 91,
        actionable: true,
        clientName: 'Priya Sharma',
        estimatedValue: '$240 Million',
        suggestedAction: 'Schedule call for this Thursday at 3:00 PM. Discuss alternative investment opportunities - client showed 78% interest in PE/VC funds during last interaction.',
        dataPoints: [
            'Best day: Tuesday/Thursday',
            'Best time: 2-4 PM',
            'Response rate: 3.2x higher',
            'Avg call duration: 18 mins',
            'Preferred channel: Phone call'
        ]
    },
    {
        id: 'rm-3',
        category: 'engagement',
        title: 'Re-engagement Opportunity: Ankit Verma',
        description: 'Client engagement dropped 68% in last 30 days. AI detects early churn signals. However, recent LinkedIn activity shows interest in structured products - potential re-engagement angle.',
        priority: 'urgent',
        confidence: 84,
        actionable: true,
        clientName: 'Ankit Verma',
        estimatedValue: '$95 Million',
        suggestedAction: 'Send personalized email about new structured product offerings within 24 hours. Follow up with voice note explaining tax benefits. Schedule coffee meeting.',
        dataPoints: [
            'Engagement drop: 68%',
            'Last contact: 32 days ago',
            'LinkedIn activity: Structured products',
            'Churn risk: 72%',
            'Recovery probability: 61%'
        ]
    },
    {
        id: 'rm-4',
        category: 'conversion',
        title: 'Cross-Sell Opportunity: Vikram Singh',
        description: 'Client currently holds only PMS ($120 Million). AI analysis of portfolio composition, risk appetite, and investment behavior suggests 89% propensity for alternative investments.',
        priority: 'high',
        confidence: 89,
        actionable: true,
        clientName: 'Vikram Singh',
        estimatedValue: '$25 Million additional',
        suggestedAction: 'Prepare alternative investment proposal. Focus on PE/VC funds and real estate opportunities. Expected allocation: 15-20% of current PMS holding.',
        dataPoints: [
            'Current PMS: $120 Million',
            'Risk appetite: Aggressive',
            'Age: 42 years',
            'Alt-inv propensity: 89%',
            'Expected allocation: $18-24 Million'
        ]
    },
    {
        id: 'rm-5',
        category: 'client',
        title: 'New Signal: Neha Kapoor - Series C Funding',
        description: 'AI detected Series C funding announcement ($75M) for client\'s company. Historical data shows 76% of similar clients seek wealth management within 45 days post-funding.',
        priority: 'urgent',
        confidence: 92,
        actionable: true,
        clientName: 'Neha Kapoor',
        estimatedValue: '$140 Million',
        suggestedAction: 'Immediate outreach required. Congratulate on funding. Offer complimentary wealth planning session. Prepare ESOP liquidation strategy presentation.',
        dataPoints: [
            'Series C: $75M raised',
            'Funding date: 3 days ago',
            'ESOP value: ~$45 Million',
            'Conversion window: 45 days',
            'Similar client success: 76%'
        ]
    },
    {
        id: 'rm-6',
        category: 'engagement',
        title: 'Voice Note Effectiveness Analysis',
        description: 'Your voice notes have 2.8x higher engagement rate compared to emails. Clients respond 65% faster to voice messages. Top performing time: Morning (8-10 AM).',
        priority: 'medium',
        confidence: 94,
        actionable: true,
        suggestedAction: 'Increase voice note usage for high-priority prospects. Send morning voice notes (8-10 AM) for best results. Keep duration under 90 seconds.',
        dataPoints: [
            'Voice note engagement: 2.8x vs email',
            'Response time: 65% faster',
            'Best time: 8-10 AM',
            'Optimal duration: 60-90 sec',
            'Conversion lift: +23%'
        ]
    },
    {
        id: 'rm-7',
        category: 'timing',
        title: 'Pipeline Velocity Alert',
        description: 'Your average deal velocity is 42 days (6 days faster than team average). AI identifies 3 deals in pipeline that are moving slower than expected - intervention may accelerate closure.',
        priority: 'high',
        confidence: 86,
        actionable: true,
        suggestedAction: 'Review 3 slow-moving deals: (1) Amit Shah - stuck at proposal stage, (2) Ritu Malhotra - awaiting decision, (3) Karan Mehta - pricing concerns. Schedule follow-ups.',
        dataPoints: [
            'Your avg velocity: 42 days',
            'Team average: 48 days',
            'Slow deals: 3 identified',
            'Potential acceleration: 8-12 days',
            'Revenue at stake: $85 Million'
        ]
    },
    {
        id: 'rm-8',
        category: 'client',
        title: 'Referral Opportunity: Sanjay Gupta Network',
        description: 'Client Sanjay Gupta is connected to 12 UHNW individuals (>$100 Million) in his network. Relationship strength: High. Referral probability: 73% based on satisfaction scores.',
        priority: 'medium',
        confidence: 81,
        actionable: true,
        clientName: 'Sanjay Gupta',
        estimatedValue: '$340 Million potential',
        suggestedAction: 'Request warm introductions during next meeting. Offer referral incentive program. Focus on 3 highest-value connections first.',
        dataPoints: [
            'UHNW connections: 12',
            'Avg net worth: $285 Million',
            'Relationship strength: High',
            'Referral probability: 73%',
            'Client satisfaction: 9.2/10'
        ]
    }
];

export default function AIInsightsPanel() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

    const categories = [
        { id: 'all', label: 'All Insights', icon: '🤖' },
        { id: 'client', label: 'Client Insights', icon: '👤' },
        { id: 'engagement', label: 'Engagement', icon: '💬' },
        { id: 'conversion', label: 'Conversion', icon: '🎯' },
        { id: 'timing', label: 'Timing', icon: '⏰' }
    ];

    const filteredInsights = selectedCategory === 'all'
        ? mockRMInsights
        : mockRMInsights.filter(i => i.category === selectedCategory);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'text-[#DC3545] bg-[#FFF3F3] border-[#DC3545]';
            case 'high': return 'text-[#FFC107] bg-[#FFF4E6] border-[#FFC107]';
            case 'medium': return 'text-[#28A745] bg-[#E8F5E9] border-[#28A745]';
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
                        🤖 AI-Powered Tactical Insights
                    </h3>
                    <p className="text-sm text-[#5A6C7D] mt-1">
                        Personalized recommendations to optimize your conversion rate • Updated hourly
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
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-[#1A1A2E]">
                                                {insight.title}
                                            </h4>
                                            {insight.estimatedValue && (
                                                <span className="text-xs font-semibold text-[#E85D54] bg-[#FFF3F3] px-2 py-1 rounded">
                                                    {insight.estimatedValue}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-[#5A6C7D] leading-relaxed">
                                            {insight.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 ml-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(insight.priority)}`}>
                                        {insight.priority.toUpperCase()}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-[#5A6C7D]">
                                        <span>Confidence:</span>
                                        <span className="font-semibold text-[#1A1A2E]">{insight.confidence}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Expandable Details */}
                            {expandedInsight === insight.id && (
                                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                                    {/* Data Points */}
                                    <div>
                                        <h5 className="text-xs font-semibold text-[#8E99A4] uppercase mb-2">
                                            📊 Key Data Points
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
                                            Take Action
                                        </button>
                                        <button className="px-4 py-2 bg-[#1A1332] text-white rounded-lg text-sm font-medium hover:bg-[#2A2447] transition-colors">
                                            Create Follow-up
                                        </button>
                                        <button className="px-4 py-2 border border-gray-300 text-[#5A6C7D] rounded-lg text-sm font-medium hover:bg-[#F8F9FA] transition-colors">
                                            Send Voice Note
                                        </button>
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
                        <p className="text-2xl font-bold text-[#1A1A2E]">{mockRMInsights.length}</p>
                        <p className="text-xs text-[#8E99A4] mt-1">Active Insights</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-[#DC3545]">
                            {mockRMInsights.filter(i => i.priority === 'urgent').length}
                        </p>
                        <p className="text-xs text-[#8E99A4] mt-1">Urgent</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-[#28A745]">
                            {mockRMInsights.filter(i => i.actionable).length}
                        </p>
                        <p className="text-xs text-[#8E99A4] mt-1">Actionable</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-[#E85D54]">87%</p>
                        <p className="text-xs text-[#8E99A4] mt-1">Avg Confidence</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

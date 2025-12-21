/**
 * @file app/(dashboard)/executive/ai-insights/page.tsx
 * @description Executive AI Insights - Central hub for AI-generated intelligence
 */

'use client';

import { Header, Sidebar } from '@/app/components/layout';
import AIInsightsPanel from '../analytics/components/AIInsightsPanel';
import ClientReportsPanel from '../analytics/components/ClientReportsPanel';
import VoiceToTextPanel from '../analytics/components/VoiceToTextPanel';

export default function ExecutiveAIInsightsPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <Header />

            <div className="flex">
                <Sidebar activePage="ai-insights" />

                <main className="flex-1 p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                            AI Insights
                        </h1>
                        <p className="text-[#5A6C7D] mt-1">
                            Artificial intelligence powered strategic insights and reporting
                        </p>
                    </div>

                    {/* AI Insights Section */}
                    <div className="mb-8">
                        <AIInsightsPanel />
                    </div>

                    {/* Client Reports Section */}
                    <div className="mb-8">
                        <ClientReportsPanel />
                    </div>

                    {/* Voice-to-Text Intelligence */}
                    <div className="mb-8">
                        <VoiceToTextPanel />
                    </div>
                </main>
            </div>
        </div>
    );
}

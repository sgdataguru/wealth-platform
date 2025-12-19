/**
 * @file app/(dashboard)/rm/analytics/components/ActivityDashboard.tsx
 * @description Activity effectiveness metrics
 */

'use client';

import { Card } from '@/app/components/ui';

export default function ActivityDashboard() {
    return (
        <Card padding="lg">
            <h3 className="text-xl font-semibold text-[#1A1A2E] mb-6 font-[family-name:var(--font-playfair)]">
                Activity Effectiveness
            </h3>

            <div className="space-y-6">
                {/* Calls */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#1A1A2E]">📞 Calls</span>
                        <span className="text-sm font-semibold text-[#1A1A2E]">89 made</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-[#F8F9FA] rounded-lg">
                            <p className="text-xs text-[#8E99A4]">Contact Rate</p>
                            <p className="text-xl font-bold text-[#1A1A2E]">68%</p>
                            <p className="text-xs text-[#28A745] mt-1">↑ 5% vs last month</p>
                        </div>
                        <div className="p-3 bg-[#F8F9FA] rounded-lg">
                            <p className="text-xs text-[#8E99A4]">Avg Duration</p>
                            <p className="text-xl font-bold text-[#1A1A2E]">12m</p>
                            <p className="text-xs text-[#5A6C7D] mt-1">Industry avg: 9m</p>
                        </div>
                    </div>
                </div>

                {/* Emails */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#1A1A2E]">✉️ Emails</span>
                        <span className="text-sm font-semibold text-[#1A1A2E]">142 sent</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="p-3 bg-[#F8F9FA] rounded-lg">
                            <p className="text-xs text-[#8E99A4]">Open Rate</p>
                            <p className="text-lg font-bold text-[#1A1A2E]">72%</p>
                        </div>
                        <div className="p-3 bg-[#F8F9FA] rounded-lg">
                            <p className="text-xs text-[#8E99A4]">Reply Rate</p>
                            <p className="text-lg font-bold text-[#1A1A2E]">38%</p>
                        </div>
                        <div className="p-3 bg-[#F8F9FA] rounded-lg">
                            <p className="text-xs text-[#8E99A4]">Click Rate</p>
                            <p className="text-lg font-bold text-[#1A1A2E]">24%</p>
                        </div>
                    </div>
                </div>

                {/* Meetings */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#1A1A2E]">🤝 Meetings</span>
                        <span className="text-sm font-semibold text-[#1A1A2E]">23 scheduled</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-[#F8F9FA] rounded-lg">
                            <p className="text-xs text-[#8E99A4]">Show-up Rate</p>
                            <p className="text-xl font-bold text-[#1A1A2E]">87%</p>
                            <p className="text-xs text-[#28A745] mt-1">Excellent</p>
                        </div>
                        <div className="p-3 bg-[#F8F9FA] rounded-lg">
                            <p className="text-xs text-[#8E99A4]">To Proposal</p>
                            <p className="text-xl font-bold text-[#1A1A2E]">52%</p>
                            <p className="text-xs text-[#5A6C7D] mt-1">12 proposals</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Best Practices */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-[#1A1A2E] mb-3 text-sm">🎯 What's Working</h4>
                <div className="space-y-2 text-xs text-[#5A6C7D]">
                    <p className="flex items-start gap-2">
                        <span className="text-[#28A745]">✓</span>
                        <span>Your email open rates (72%) are 18% above team average</span>
                    </p>
                    <p className="flex items-start gap-2">
                        <span className="text-[#28A745]">✓</span>
                        <span>Meeting show-up rate excellent - keep using calendar reminders</span>
                    </p>
                    <p className="flex items-start gap-2">
                        <span className="text-[#FFC107]">→</span>
                        <span>Try calling between 10-11am for higher contact rates (industry data)</span>
                    </p>
                </div>
            </div>
        </Card>
    );
}

/**
 * @file app/(dashboard)/executive/components/ExecutiveActionCenter.tsx
 * @description Quick action widget for assigning tasks to RMs
 */

'use client';

import { useState } from 'react';
import { Card } from '@/app/components/ui';
import type { RMTask } from '@/types';

interface ExecutiveActionCenterProps {
    recentTasks: RMTask[];
}

export default function ExecutiveActionCenter({ recentTasks }: ExecutiveActionCenterProps) {
    const [showAssignModal, setShowAssignModal] = useState(false);

    const pendingTasks = recentTasks.filter(t => t.status === 'pending').length;
    const inProgressTasks = recentTasks.filter(t => t.status === 'in_progress').length;
    const overdueTasks = recentTasks.filter(t => t.status === 'overdue').length;

    return (
        <>
            <Card padding="lg">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                        Action Center
                    </h3>
                    <button
                        onClick={() => setShowAssignModal(true)}
                        className="px-4 py-2 bg-[#E85D54] text-white rounded-lg hover:bg-[#D64D44] transition-colors font-medium"
                    >
                        + Assign Task to RM
                    </button>
                </div>

                {/* Task Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-[#FFF4E6] rounded-lg">
                        <p className="text-2xl font-bold text-[#FFC107]">{pendingTasks}</p>
                        <p className="text-sm text-[#5A6C7D] mt-1">Pending</p>
                    </div>
                    <div className="text-center p-4 bg-[#E3F2FD] rounded-lg">
                        <p className="text-2xl font-bold text-[#2A2447]">{inProgressTasks}</p>
                        <p className="text-sm text-[#5A6C7D] mt-1">In Progress</p>
                    </div>
                    <div className="text-center p-4 bg-[#FFEBEE] rounded-lg">
                        <p className="text-2xl font-bold text-[#DC3545]">{overdueTasks}</p>
                        <p className="text-sm text-[#5A6C7D] mt-1">Overdue</p>
                    </div>
                </div>

                {/* Recent Assignments */}
                <div>
                    <h4 className="font-semibold text-[#1A1A2E] mb-4">Recent Assignments</h4>
                    <div className="space-y-3">
                        {recentTasks.slice(0, 5).map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#E85D54] transition-colors">
                                <div className="flex-1">
                                    <p className="font-medium text-[#1A1A2E]">{task.title}</p>
                                    <p className="text-sm text-[#5A6C7D] mt-1">
                                        Assigned to: {task.assignedToName}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${task.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                task.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${task.priority === 'high' ? 'bg-red-50 text-red-600' :
                                            task.priority === 'medium' ? 'bg-orange-50 text-orange-600' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        {task.priority}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Assign Task Modal (Simplified for POC) */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAssignModal(false)}>
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6 font-[family-name:var(--font-playfair)]">
                            Assign Task to RM
                        </h2>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                                    Select RM
                                </label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E85D54]">
                                    <option>Maha Al-Suwaidi</option>
                                    <option>Yousef Al-Omari</option>
                                    <option>Laila Al-Farsi</option>
                                    <option>Khalid Al-Mansouri</option>
                                    <option>Mariam Al-Zahra</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                                    Task Type
                                </label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E85D54]">
                                    <option value="followup">Follow-up Call</option>
                                    <option value="proposal">Prepare Proposal</option>
                                    <option value="review">Client Review</option>
                                    <option value="risk_assessment">Risk Assessment</option>
                                    <option value="cross_sell">Cross-sell Opportunity</option>
                                    <option value="prospect_call">Prospect Call</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                                    Priority
                                </label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E85D54]">
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E85D54]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                                    Notes
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Add context or instructions..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E85D54]"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // TODO: Send task assignment
                                    alert('Task assigned successfully! (POC demo)');
                                    setShowAssignModal(false);
                                }}
                                className="px-6 py-2 bg-[#E85D54] text-white rounded-lg hover:bg-[#D64D44] transition-colors"
                            >
                                Assign Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

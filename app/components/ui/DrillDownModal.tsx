/**
 * @file DrillDownModal.tsx
 * @description Reusable modal component for detailed data views
 */

'use client';

import { useState } from 'react';
import type { DrillDownView } from '@/types';

interface DrillDownModalProps {
    isOpen: boolean;
    onClose: () => void;
    view: DrillDownView;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    tabs?: string[];
    exportable?: boolean;
    dataSource?: string;
    onExport?: () => void;
}

export default function DrillDownModal({
    isOpen,
    onClose,
    view,
    title,
    subtitle,
    children,
    tabs,
    exportable = true,
    dataSource,
    onExport,
}: DrillDownModalProps) {
    const [activeTab, setActiveTab] = useState(0);

    if (!isOpen) return null;

    const handleExport = () => {
        if (onExport) {
            onExport();
        } else {
            // Default export behavior - will implement CSV/Excel export
            console.log(`Exporting ${view} data...`);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] mx-4 flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
                                {title}
                            </h2>
                            {subtitle && (
                                <p className="text-sm text-[#5A6C7D] mt-1">{subtitle}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {exportable && (
                                <button
                                    onClick={handleExport}
                                    className="px-4 py-2 bg-[#E85D54] text-white rounded-lg hover:bg-[#D64D44] transition-colors flex items-center gap-2 text-sm font-medium"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Export Data
                                </button>
                            )}

                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    {tabs && tabs.length > 0 && (
                        <div className="flex gap-4 mt-4 border-b border-gray-200">
                            {tabs.map((tab, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab(index)}
                                    className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === index
                                            ? 'text-[#E85D54]'
                                            : 'text-[#5A6C7D] hover:text-[#1A1A2E]'
                                        }`}
                                >
                                    {tab}
                                    {activeTab === index && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E85D54]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {children}
                </div>

                {/* Footer */}
                {dataSource && (
                    <div className="px-8 py-4 border-t border-gray-200 bg-gray-50">
                        <p className="text-xs text-[#8E99A4]">
                            Data Source: {dataSource}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

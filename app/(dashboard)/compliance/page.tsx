/**
 * @file page.tsx
 * @description Main Compliance Dashboard page
 * @module app/(dashboard)/compliance
 */

'use client';

import { useState } from 'react';
import Card from '@/app/components/ui/Card';
import ComplianceDashboard from '@/app/components/features/compliance/ComplianceDashboard';
import ComplianceTermsLibrary from '@/app/components/features/compliance/ComplianceTermsLibrary';
import ClientComplianceMatrix from '@/app/components/features/compliance/ClientComplianceMatrix';
import ComplianceGapAnalysis from '@/app/components/features/compliance/ComplianceGapAnalysis';
import ComplianceAlertPanel from '@/app/components/features/compliance/ComplianceAlertPanel';
import { Header, Sidebar } from '@/app/components/layout';

type TabType = 'dashboard' | 'terms' | 'matrix' | 'gaps' | 'alerts';

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: '📊' },
    { id: 'terms' as TabType, label: 'Compliance Terms', icon: '📋' },
    { id: 'matrix' as TabType, label: 'Client Matrix', icon: '🔲' },
    { id: 'gaps' as TabType, label: 'Gap Analysis', icon: '🔍' },
    { id: 'alerts' as TabType, label: 'Alerts', icon: '🔔' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header />
      <div className="flex">
        <Sidebar activePage="compliance" />
        <main className="flex-1 p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          GCC Regulatory Compliance
        </h1>
        <p className="text-slate-600">
          Comprehensive compliance management for UHNW clients across GCC jurisdictions
        </p>
      </div>

      {/* Tab Navigation */}
      <Card className="mb-6">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'border-b-2 border-[#007B7A] text-[#007B7A]'
                    : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Tab Content */}
      <div className="transition-opacity duration-200">
        {activeTab === 'dashboard' && <ComplianceDashboard />}
        {activeTab === 'terms' && <ComplianceTermsLibrary />}
        {activeTab === 'matrix' && <ClientComplianceMatrix />}
        {activeTab === 'gaps' && <ComplianceGapAnalysis />}
        {activeTab === 'alerts' && <ComplianceAlertPanel />}
      </div>
        </main>
      </div>
    </div>
  );
}

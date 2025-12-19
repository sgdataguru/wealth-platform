/**
 * @file app/(dashboard)/leads-followups/page.tsx
 * @description Leads and Follow-ups tracking page
 */

'use client';

import { useState } from 'react';
import { Header, Sidebar } from '@/app/components/layout';
import { Card, Button } from '@/app/components/ui';
import LeadCard from '@/app/components/features/leads/LeadCard';
import FollowUpCard from '@/app/components/features/followups/FollowUpCard';
import MetricsCard from '@/app/components/features/dashboard/MetricsCard';
import PendingFollowUpsList from '@/app/components/features/dashboard/PendingFollowUpsList';
import ActivityFeed from '@/app/components/features/dashboard/ActivityFeed';
import { useLeads } from '@/app/hooks/useLeads';
import { useFollowUps } from '@/app/hooks/useFollowUps';
import { useMetrics } from '@/app/hooks/useMetrics';
import { useActivities } from '@/app/hooks/useActivities';

export default function LeadsFollowupsPage() {
  const [activeTab, setActiveTab] = useState<'leads' | 'followups'>('leads');
  
  // Fetch data using custom hooks
  const { leads, isLoading: leadsLoading } = useLeads({ rmId: 'rm-1', limit: 20 });
  const { followUps, isLoading: followUpsLoading, markComplete } = useFollowUps({ rmId: 'rm-1' });
  const { metrics, isLoading: metricsLoading } = useMetrics({ rmId: 'rm-1' });
  const { activities, isLoading: activitiesLoading } = useActivities({ userId: 'rm-1', limit: 10 });

  // Filter for pending follow-ups
  const pendingFollowUps = followUps.filter(fu => fu.status !== 'completed');

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header userName="John Smith" userInitials="JS" />
      
      <div className="flex">
        <Sidebar activePage="leads" />
        
        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
              Leads & Follow-ups
            </h1>
            <p className="text-[#5A6C7D] mt-1">
              Track your leads and manage all follow-up activities
            </p>
          </div>

          {/* Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsLoading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <Card key={i} padding="md">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                  </Card>
                ))}
              </>
            ) : metrics ? (
              <>
                <MetricsCard
                  label="Total Leads"
                  value={metrics.totalLeads}
                  change={metrics.leadsChange}
                  trend={metrics.leadsChange > 0 ? 'up' : metrics.leadsChange < 0 ? 'down' : 'neutral'}
                  subtitle={`${metrics.leadsThisWeek} this week`}
                />
                <MetricsCard
                  label="Follow-ups"
                  value={`${metrics.completedFollowUps} / ${metrics.totalFollowUps}`}
                  subtitle={`${metrics.followUpCompletionRate.toFixed(1)}% completion rate`}
                />
                <MetricsCard
                  label="Pending"
                  value={metrics.pendingFollowUps}
                  subtitle={metrics.overdueFollowUps > 0 ? `${metrics.overdueFollowUps} overdue` : 'All on track'}
                />
                <MetricsCard
                  label="Conversions"
                  value={metrics.conversions}
                  change={metrics.conversionRate}
                  subtitle={`${metrics.conversionRate.toFixed(1)}% conversion rate`}
                />
              </>
            ) : null}
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('leads')}
                className={`pb-4 px-1 font-medium transition-colors ${
                  activeTab === 'leads'
                    ? 'text-[#1E3A5F] border-b-2 border-[#1E3A5F]'
                    : 'text-[#8E99A4] hover:text-[#5A6C7D]'
                }`}
              >
                Leads ({leads.length})
              </button>
              <button
                onClick={() => setActiveTab('followups')}
                className={`pb-4 px-1 font-medium transition-colors ${
                  activeTab === 'followups'
                    ? 'text-[#1E3A5F] border-b-2 border-[#1E3A5F]'
                    : 'text-[#8E99A4] hover:text-[#5A6C7D]'
                }`}
              >
                Follow-ups ({followUps.length})
              </button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {activeTab === 'leads' ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[#1A1A2E]">
                      All Leads
                    </h2>
                    <Button variant="primary" size="sm">
                      + Add Lead
                    </Button>
                  </div>
                  
                  {leadsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Card key={i} padding="md">
                          <div className="animate-pulse">
                            <div className="h-16 bg-gray-200 rounded"></div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : leads.length === 0 ? (
                    <Card padding="lg">
                      <div className="text-center py-8 text-[#8E99A4]">
                        <p>No leads found</p>
                      </div>
                    </Card>
                  ) : (
                    leads.map(lead => (
                      <LeadCard 
                        key={lead.id} 
                        lead={lead}
                        onClick={() => console.log('View lead:', lead.id)}
                      />
                    ))
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[#1A1A2E]">
                      All Follow-ups
                    </h2>
                    <Button variant="primary" size="sm">
                      + Add Follow-up
                    </Button>
                  </div>
                  
                  {followUpsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Card key={i} padding="md">
                          <div className="animate-pulse">
                            <div className="h-20 bg-gray-200 rounded"></div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : followUps.length === 0 ? (
                    <Card padding="lg">
                      <div className="text-center py-8 text-[#8E99A4]">
                        <p>No follow-ups found</p>
                      </div>
                    </Card>
                  ) : (
                    followUps.map(followUp => (
                      <FollowUpCard 
                        key={followUp.id} 
                        followUp={followUp}
                        onClick={() => console.log('View follow-up:', followUp.id)}
                        onComplete={markComplete}
                      />
                    ))
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pending Follow-ups */}
              <PendingFollowUpsList
                followUps={pendingFollowUps}
                onFollowUpClick={(fu) => {
                  setActiveTab('followups');
                  console.log('Navigate to:', fu.id);
                }}
                onMarkComplete={markComplete}
              />

              {/* Activity Feed */}
              {!activitiesLoading && activities.length > 0 && (
                <ActivityFeed activities={activities} limit={5} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

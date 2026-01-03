/**
 * @file app/(dashboard)/rm/morning-cockpit/page.tsx
 * @description RM Home Dashboard - "The Morning Cockpit"
 * Main landing page for Relationship Managers
 */

'use client';

import { Header, Sidebar } from '@/app/components/layout';
import RMMetricsBar from '../components/RMMetricsBar';
import DashboardGrid from '../components/DashboardGrid';
import AIEngagementColumn from '../components/AIEngagementColumn';
import ImmediateActionsColumn from '../components/ImmediateActionsColumn';
import TodayAgendaColumn from '../components/TodayAgendaColumn';
import MarketInsightsColumn from '../components/MarketInsightsColumn';
import { useDashboardData } from '@/app/hooks/useDashboardData';

export default function MorningCockpitPage() {
  const {
    metrics,
    suggestions,
    alerts,
    agenda,
    lifeEvents,
    marketInsights,
    isLoading,
    error,
    refresh,
  } = useDashboardData();

  // Action handlers
  const handleSuggestionAction = (suggestionId: string, action: string) => {
    console.log('Suggestion action:', { suggestionId, action });
    // TODO: Implement action handlers
    // Examples: draft_proposal, call_client, schedule_meeting
  };

  const handleAlertDismiss = (alertId: string) => {
    console.log('Alert dismissed:', alertId);
    // TODO: Implement alert dismissal with API call
  };

  const handleAlertAcknowledge = (alertId: string) => {
    console.log('Alert acknowledged:', alertId);
    // TODO: Implement alert acknowledgment with API call
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header />

      <div className="flex">
        <Sidebar activePage="rm-dashboard" />

        <main className="flex-1 p-8">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]">
              Morning Faisal, Welcome to Cockpit
            </h1>
            <p className="text-[#5A6C7D] mt-1">
              Below are your triggers. There are {alerts.length} Immediate Actions. If you have any questions, happy to chat. Have a Great Flight ✈️
            </p>

            {/* Refresh Button */}
            <button
              onClick={refresh}
              disabled={isLoading}
              className="mt-3 px-4 py-2 bg-white text-[#1A1332] text-sm font-semibold rounded border border-[#1A1332] hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isLoading ? '🔄 Refreshing...' : '🔄 Refresh Data'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                <strong>Error:</strong> {error}
              </p>
              <button
                onClick={refresh}
                className="mt-2 text-red-700 text-sm font-semibold hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* RM Metrics Bar */}
          <RMMetricsBar metrics={metrics} isLoading={isLoading} />

          {/* 4-Column Dashboard Grid */}
          <DashboardGrid>
            {/* Column 1: AI Engagement Suggestions */}
            <AIEngagementColumn
              suggestions={suggestions}
              isLoading={isLoading}
              onAction={handleSuggestionAction}
            />

            {/* Column 2: Immediate Actions & Alerts */}
            <ImmediateActionsColumn
              alerts={alerts}
              isLoading={isLoading}
              onDismiss={handleAlertDismiss}
              onAcknowledge={handleAlertAcknowledge}
            />

            {/* Column 3: Today's Agenda & Life Events */}
            <TodayAgendaColumn
              meetings={agenda}
              lifeEvents={lifeEvents}
              isLoading={isLoading}
            />

            {/* Column 4: Market Insights & Opportunities */}
            <MarketInsightsColumn
              insights={marketInsights}
              isLoading={isLoading}
            />
          </DashboardGrid>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Morning Cockpit · Powered by AI · Auto-refreshes every 5 minutes
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

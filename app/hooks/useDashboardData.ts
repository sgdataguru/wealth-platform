/**
 * @file app/hooks/useDashboardData.ts
 * @description Main data orchestration hook for Morning Cockpit dashboard
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DashboardData } from '@/types/dashboard.types';
import {
  fetchRMMetrics,
  fetchSuggestions,
  fetchAlerts,
  fetchAgenda,
  fetchMarketInsights,
} from '@/lib/mock-data/dashboard-mock-data';

interface UseDashboardDataReturn extends DashboardData {
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDashboardData(): UseDashboardDataReturn {
  const [data, setData] = useState<DashboardData>({
    metrics: {
      rmName: '',
      greeting: '',
      totalAUM: '',
      aumChange: 0,
      netNewMoney: '',
      netNewMoneyChange: 0,
      totalClients: 0,
      atRiskClients: 0,
      criticalAlerts: 0,
      warningAlerts: 0,
      meetingsToday: 0,
      followUpsDue: 0,
      lastUpdated: new Date(),
    },
    suggestions: [],
    alerts: [],
    agenda: [],
    lifeEvents: [],
    marketInsights: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all data in parallel for better performance
      const [metrics, suggestions, alerts, agendaData, marketInsights] = await Promise.all([
        fetchRMMetrics(),
        fetchSuggestions(),
        fetchAlerts(),
        fetchAgenda(),
        fetchMarketInsights(),
      ]);

      setData({
        metrics,
        suggestions,
        alerts,
        agenda: agendaData.meetings,
        lifeEvents: agendaData.lifeEvents,
        marketInsights,
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [loadData]);

  return {
    ...data,
    isLoading,
    error,
    refresh: loadData,
  };
}

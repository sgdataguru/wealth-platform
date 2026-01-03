/**
 * @file useProspectDetail.ts
 * @description Hook for fetching and managing prospect detail data
 */

'use client';

import { useState, useEffect } from 'react';
import type { Prospect, ExtendedMetrics, EngagementEvent, Connection } from '@/types';

interface ProspectDetailState {
  prospect: Prospect | null;
  extendedMetrics: ExtendedMetrics | null;
  relatedConnections: Connection[];
  recentActivity: EngagementEvent[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
}

export function useProspectDetail(prospectId: string | null) {
  const [state, setState] = useState<ProspectDetailState>({
    prospect: null,
    extendedMetrics: null,
    relatedConnections: [],
    recentActivity: [],
    isLoading: false,
    isRefreshing: false,
    error: null,
  });

  useEffect(() => {
    if (!prospectId) {
      return;
    }

    loadProspectDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prospectId]);

  const loadProspectDetail = async () => {
    if (!prospectId) return;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // For MVP, we'll use mock data
      // In production, this would be parallel API calls:
      // const [detail, metrics, connections, activity] = await Promise.all([...])
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data - in production this comes from API
      const mockMetrics: ExtendedMetrics = {
        aum: 25000000,
        aumCurrency: 'USD',
        walletShare: 35,
        relationshipStrength: 78,
        lifetimeValue: 1250000,
        lastInteractionDays: 5,
        upcomingFollowUps: 2,
      };

      const mockConnections: Connection[] = [
        {
          id: 'c1',
          name: 'Hassan Al-Rashid',
          relationship: 'Board Member',
          strength: 85,
          canIntroduce: true,
          company: 'NextGen Ventures',
        },
        {
          id: 'c2',
          name: 'Maha Al-Suwaidi',
          relationship: 'Co-founder',
          strength: 90,
          canIntroduce: true,
          company: 'Harbor Tech Solutions',
        },
      ];

      const mockActivity: EngagementEvent[] = [
        {
          id: 'e1',
          type: 'call',
          description: 'Discussed IPO timeline and expectations',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          outcome: 'Positive - interested in wealth planning',
        },
        {
          id: 'e2',
          type: 'email',
          description: 'Sent portfolio options and fee structure',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'e3',
          type: 'signal',
          description: 'New signal detected: IPO Filing',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      ];

      // Note: In production, prospect data would come from API
      // For now, we'll use null and the component will handle it
      setState({
        prospect: null, // Will be filled from parent component's data
        extendedMetrics: mockMetrics,
        relatedConnections: mockConnections,
        recentActivity: mockActivity,
        isLoading: false,
        isRefreshing: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to load prospect detail:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isRefreshing: false,
        error: error as Error,
      }));
    }
  };

  const refreshData = async () => {
    if (!prospectId) return;
    
    setState(prev => ({ ...prev, isRefreshing: true }));
    await loadProspectDetail();
  };

  return {
    ...state,
    refreshData,
  };
}

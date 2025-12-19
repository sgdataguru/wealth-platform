/**
 * @file app/api/metrics/route.ts
 * @description API routes for dashboard metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import type { EnhancedDashboardMetrics, ApiResponse } from '@/types';

/**
 * GET /api/metrics - Get dashboard metrics for an RM
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rmId = searchParams.get('rmId') || 'rm-1';

    // In a real app, these would be calculated from database queries
    // For now, using mock data
    const metrics: EnhancedDashboardMetrics = {
      // Existing metrics from DashboardMetrics
      totalLeads: 1247,
      leadsGrowth: '+12%',
      newToday: 23,
      newTodayChange: 5,
      signalsDetected: 156,
      signalsGrowth: '+8%',
      followUps: 18,
      followUpsDueToday: true,

      // Enhanced metrics
      leadsThisWeek: 47,
      leadsChange: 12.5, // % change

      signalsThisWeek: 34,

      totalFollowUps: 45,
      completedFollowUps: 23,
      pendingFollowUps: 18,
      overdueFollowUps: 4,
      followUpCompletionRate: 51.1, // 23/45 * 100

      conversions: 15,
      conversionRate: 1.2, // 15/1247 * 100

      totalActivities: 342,
      activitiesToday: 28,
    };

    const response: ApiResponse<EnhancedDashboardMetrics> = {
      success: true,
      data: metrics,
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch metrics',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

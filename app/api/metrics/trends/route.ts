/**
 * @file app/api/metrics/trends/route.ts
 * @description API routes for trend data
 */

import { NextRequest, NextResponse } from 'next/server';
import type { TrendData, ApiResponse } from '@/types';

/**
 * GET /api/metrics/trends - Get trend data for charts
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rmId = searchParams.get('rmId') || 'rm-1';
    const period = searchParams.get('period') || 'daily';
    const days = parseInt(searchParams.get('days') || '7');

    // Generate mock trend data for the last N days
    const trendData: TrendData[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      trendData.push({
        date,
        leadsCreated: Math.floor(Math.random() * 10) + 2,
        signalsGenerated: Math.floor(Math.random() * 15) + 5,
        followUpsCompleted: Math.floor(Math.random() * 8) + 1,
        leadsContacted: Math.floor(Math.random() * 12) + 3,
        conversions: Math.floor(Math.random() * 3),
      });
    }

    const response: ApiResponse<TrendData[]> = {
      success: true,
      data: trendData,
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch trends',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

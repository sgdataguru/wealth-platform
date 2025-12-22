/**
 * @file app/api/signals/recent/route.ts
 * @description API route for fetching recent signals (last 24 hours)
 */

import { NextResponse } from 'next/server';
import type { ApiResponse, Signal } from '@/types';
import { mockSignals } from '../mock-data';

export async function GET() {
  try {
    // Filter for signals within last 24 hours
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentSignals = mockSignals.filter(
      signal => signal.createdAt.getTime() > twentyFourHoursAgo
    );
    
    // Sort by most recent first
    recentSignals.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const response: ApiResponse<Signal[]> = {
      success: true,
      data: recentSignals,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching recent signals:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch recent signals',
        },
      },
      { status: 500 }
    );
  }
}

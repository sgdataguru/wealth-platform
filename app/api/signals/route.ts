/**
 * @file app/api/signals/route.ts
 * @description API route for listing liquidity signals
 */

import { NextRequest, NextResponse } from 'next/server';
import type { PaginatedResponse, Signal, SignalSeverity, DataSource, SignalTimeline } from '@/types';
import { mockSignals } from './mock-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const timeline = searchParams.get('timeline') as SignalTimeline | 'all' | null;
    const priority = searchParams.get('priority')?.split(',') as SignalSeverity[] | undefined;
    const source = searchParams.get('source')?.split(',') as DataSource[] | undefined;
    const isActioned = searchParams.get('isActioned') === 'true' ? true : 
                       searchParams.get('isActioned') === 'false' ? false : undefined;
    const sortBy = (searchParams.get('sortBy') || 'detectedAt') as 'detectedAt' | 'priority' | 'timeline';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    // Filter signals
    let filteredSignals = [...mockSignals];
    
    if (timeline && timeline !== 'all') {
      filteredSignals = filteredSignals.filter(s => s.expectedTimeline === timeline);
    }
    
    if (priority && priority.length > 0) {
      filteredSignals = filteredSignals.filter(s => priority.includes(s.severity));
    }
    
    if (source && source.length > 0) {
      filteredSignals = filteredSignals.filter(s => source.includes(s.source));
    }
    
    if (isActioned !== undefined) {
      filteredSignals = filteredSignals.filter(s => s.isActioned === isActioned);
    }
    
    // Sort signals
    filteredSignals.sort((a, b) => {
      if (sortBy === 'detectedAt') {
        const comparison = b.createdAt.getTime() - a.createdAt.getTime();
        return sortOrder === 'asc' ? -comparison : comparison;
      } else if (sortBy === 'priority') {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const comparison = priorityOrder[a.severity] - priorityOrder[b.severity];
        return sortOrder === 'asc' ? comparison : -comparison;
      }
      return 0;
    });
    
    // Paginate
    const total = filteredSignals.length;
    const paginatedSignals = filteredSignals.slice(offset, offset + limit);
    
    const response: PaginatedResponse<Signal> = {
      success: true,
      data: paginatedSignals,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching signals:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch signals',
        },
      },
      { status: 500 }
    );
  }
}

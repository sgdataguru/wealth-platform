/**
 * @file app/api/activities/route.ts
 * @description API routes for activity tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import type { Activity, ApiResponse, PaginatedResponse } from '@/types';

// Mock data for demonstration
const mockActivities: Activity[] = [
  {
    id: 'act-1',
    userId: 'rm-1',
    actionType: 'lead_contacted',
    description: 'Called Rajesh Kumar regarding IPO liquidity options',
    leadId: 'lead-1',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 'act-2',
    userId: 'rm-1',
    actionType: 'signal_viewed',
    description: 'Viewed new funding signal for FinServ Holdings',
    signalId: 's4',
    leadId: 'lead-2',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    id: 'act-3',
    userId: 'rm-1',
    actionType: 'follow_up_completed',
    description: 'Completed follow-up: Send investment proposal to Vikram',
    followUpId: 'fu-3',
    leadId: 'lead-3',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: 'act-4',
    userId: 'rm-1',
    actionType: 'follow_up_created',
    description: 'Created new follow-up for Rajesh Kumar',
    followUpId: 'fu-4',
    leadId: 'lead-1',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    id: 'act-5',
    userId: 'rm-1',
    actionType: 'signal_actioned',
    description: 'Actioned IPO signal for Tech Innovations',
    signalId: 's1',
    leadId: 'lead-1',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
];

/**
 * GET /api/activities - Get activity feed
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'rm-1';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Filter activities by user
    const filteredActivities = mockActivities.filter(
      activity => activity.userId === userId
    );

    // Sort by createdAt descending (most recent first)
    filteredActivities.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Paginate
    const paginatedActivities = filteredActivities.slice(offset, offset + limit);

    const response: PaginatedResponse<Activity> = {
      success: true,
      data: paginatedActivities,
      pagination: {
        total: filteredActivities.length,
        limit,
        offset,
        hasMore: offset + limit < filteredActivities.length,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch activities',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * POST /api/activities - Create a new activity
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.actionType || !body.description) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields: actionType, description',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Create new activity
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      userId: body.userId || 'rm-1',
      actionType: body.actionType,
      description: body.description,
      leadId: body.leadId,
      signalId: body.signalId,
      followUpId: body.followUpId,
      metadata: body.metadata,
      createdAt: new Date(),
    };

    // In a real app, save to database
    mockActivities.unshift(newActivity);

    const response: ApiResponse<Activity> = {
      success: true,
      data: newActivity,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to create activity',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

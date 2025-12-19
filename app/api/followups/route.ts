/**
 * @file app/api/followups/route.ts
 * @description API routes for follow-up management
 */

import { NextRequest, NextResponse } from 'next/server';
import type { FollowUp, ApiResponse, PaginatedResponse } from '@/types';

// Mock data for demonstration
const mockFollowUps: FollowUp[] = [
  {
    id: 'fu-1',
    leadId: 'lead-1',
    rmId: 'rm-1',
    title: 'Follow up on IPO discussions',
    description: 'Discuss wealth management strategies post-IPO',
    status: 'in_progress',
    priority: 'critical',
    dueDate: new Date('2024-12-20'),
    completedAt: null,
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: 'fu-2',
    leadId: 'lead-2',
    rmId: 'rm-1',
    title: 'Schedule meeting with Anita',
    description: 'Present portfolio diversification options',
    status: 'new',
    priority: 'high',
    dueDate: new Date('2024-12-18'),
    completedAt: null,
    createdAt: new Date('2024-12-12'),
    updatedAt: new Date('2024-12-12'),
  },
  {
    id: 'fu-3',
    leadId: 'lead-3',
    rmId: 'rm-1',
    title: 'Send investment proposal',
    description: 'Follow up on green energy investment opportunities',
    status: 'completed',
    priority: 'medium',
    dueDate: new Date('2024-12-10'),
    completedAt: new Date('2024-12-09'),
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-09'),
  },
  {
    id: 'fu-4',
    leadId: 'lead-1',
    rmId: 'rm-1',
    title: 'Review portfolio allocation',
    description: 'Quarterly review with Rajesh',
    status: 'new',
    priority: 'high',
    dueDate: new Date('2024-12-19'),
    completedAt: null,
    createdAt: new Date('2024-12-14'),
    updatedAt: new Date('2024-12-14'),
  },
  {
    id: 'fu-5',
    leadId: 'lead-2',
    rmId: 'rm-1',
    title: 'Blocked: Awaiting client response',
    description: 'Waiting for documents from Anita',
    status: 'blocked',
    priority: 'medium',
    dueDate: new Date('2024-12-16'),
    completedAt: null,
    notes: 'Sent reminder email on 12/14',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-14'),
  },
];

/**
 * GET /api/followups - Get all follow-ups with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rmId = searchParams.get('rmId') || 'rm-1';
    const leadId = searchParams.get('leadId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const overdue = searchParams.get('overdue') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Filter follow-ups
    let filteredFollowUps = mockFollowUps.filter(fu => fu.rmId === rmId);
    
    if (leadId) {
      filteredFollowUps = filteredFollowUps.filter(fu => fu.leadId === leadId);
    }
    
    if (status) {
      filteredFollowUps = filteredFollowUps.filter(fu => fu.status === status);
    }
    
    if (priority) {
      filteredFollowUps = filteredFollowUps.filter(fu => fu.priority === priority);
    }
    
    if (overdue) {
      const now = new Date();
      filteredFollowUps = filteredFollowUps.filter(
        fu => fu.status !== 'completed' && new Date(fu.dueDate) < now
      );
    }

    // Sort by due date (earliest first)
    filteredFollowUps.sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

    // Paginate
    const paginatedFollowUps = filteredFollowUps.slice(offset, offset + limit);

    const response: PaginatedResponse<FollowUp> = {
      success: true,
      data: paginatedFollowUps,
      pagination: {
        total: filteredFollowUps.length,
        limit,
        offset,
        hasMore: offset + limit < filteredFollowUps.length,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to fetch follow-ups',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * POST /api/followups - Create a new follow-up
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.leadId || !body.title || !body.dueDate) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields: leadId, title, dueDate',
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Create new follow-up
    const newFollowUp: FollowUp = {
      id: `fu-${Date.now()}`,
      leadId: body.leadId,
      rmId: body.rmId || 'rm-1',
      title: body.title,
      description: body.description || '',
      status: body.status || 'new',
      priority: body.priority || 'medium',
      dueDate: new Date(body.dueDate),
      completedAt: null,
      notes: body.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In a real app, save to database
    mockFollowUps.push(newFollowUp);

    const response: ApiResponse<FollowUp> = {
      success: true,
      data: newFollowUp,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to create follow-up',
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

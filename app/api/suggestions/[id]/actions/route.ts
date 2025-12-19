/**
 * @file app/api/suggestions/[id]/actions/route.ts
 * @description API route for handling suggestion actions (contact, snooze, dismiss)
 */

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, EngagementSuggestion } from '@/types';

/**
 * PATCH /api/suggestions/[id]/actions
 * Handle suggestion actions
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, data } = body;
    
    // Validate action
    const validActions = ['view', 'contact', 'snooze', 'dismiss'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ACTION',
            message: `Invalid action: ${action}. Must be one of: ${validActions.join(', ')}`,
          },
        },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would update the database
    // For now, we'll return a mock updated suggestion
    const now = new Date();
    const mockUpdatedSuggestion: Partial<EngagementSuggestion> = {
      id,
    };
    
    switch (action) {
      case 'view':
        mockUpdatedSuggestion.status = 'viewed';
        mockUpdatedSuggestion.viewedAt = now;
        break;
        
      case 'contact':
        mockUpdatedSuggestion.status = 'contacted';
        mockUpdatedSuggestion.contactedAt = now;
        mockUpdatedSuggestion.actionedAt = now;
        if (data?.outcome) {
          mockUpdatedSuggestion.outcome = data.outcome;
        }
        break;
        
      case 'snooze':
        const duration = data?.duration || '1d';
        const durationMap: Record<string, number> = {
          '1d': 1,
          '3d': 3,
          '7d': 7,
        };
        const days = durationMap[duration] || 1;
        const snoozedUntil = new Date();
        snoozedUntil.setDate(snoozedUntil.getDate() + days);
        
        mockUpdatedSuggestion.status = 'snoozed';
        mockUpdatedSuggestion.snoozedUntil = snoozedUntil;
        break;
        
      case 'dismiss':
        mockUpdatedSuggestion.status = 'dismissed';
        mockUpdatedSuggestion.dismissedAt = now;
        if (data?.reason) {
          mockUpdatedSuggestion.dismissReason = data.reason;
        }
        break;
    }
    
    const response: ApiResponse<Partial<EngagementSuggestion>> = {
      success: true,
      data: mockUpdatedSuggestion,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating suggestion:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: 'Failed to update suggestion',
        },
      },
      { status: 500 }
    );
  }
}

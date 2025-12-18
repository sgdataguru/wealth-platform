/**
 * @file app/api/signals/[id]/action/route.ts
 * @description API route for marking a signal as actioned
 */

import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // In production, this would update the database
    // For now, we return a success response
    const response: ApiResponse<{ id: string; isActioned: boolean }> = {
      success: true,
      data: {
        id,
        isActioned: true,
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error marking signal as actioned:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: 'Failed to mark signal as actioned',
        },
      },
      { status: 500 }
    );
  }
}

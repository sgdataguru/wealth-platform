/**
 * @file app/api/signals/[id]/read/route.ts
 * @description API route for marking a signal as read
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
    const response: ApiResponse<{ id: string; isRead: boolean }> = {
      success: true,
      data: {
        id,
        isRead: true,
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error marking signal as read:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: 'Failed to mark signal as read',
        },
      },
      { status: 500 }
    );
  }
}

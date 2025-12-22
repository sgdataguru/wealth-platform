/**
 * @file app/api/data-sources/audit-logs/route.ts
 * @description API endpoint to fetch audit logs
 */

import { NextResponse } from 'next/server';
import { mockAuditLogs, getAuditLogsBySource } from '@/lib/mock-data/data-sources-mock';

/**
 * GET /api/data-sources/audit-logs
 * Returns audit logs with optional filtering
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceId = searchParams.get('sourceId');
    const limit = searchParams.get('limit');
    const action = searchParams.get('action');
    const status = searchParams.get('status');

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let logs = mockAuditLogs;

    // Filter by source if provided
    if (sourceId) {
      logs = getAuditLogsBySource(sourceId);
    }

    // Filter by action
    if (action && action !== 'all') {
      logs = logs.filter((log) => log.action === action);
    }

    // Filter by status
    if (status && status !== 'all') {
      logs = logs.filter((log) => log.status === status);
    }

    // Sort by timestamp (newest first)
    logs = logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply limit
    if (limit) {
      logs = logs.slice(0, parseInt(limit, 10));
    }

    return NextResponse.json({
      success: true,
      data: {
        logs,
        summary: {
          total: mockAuditLogs.length,
          success: mockAuditLogs.filter((l) => l.status === 'success').length,
          failure: mockAuditLogs.filter((l) => l.status === 'failure').length,
          partial: mockAuditLogs.filter((l) => l.status === 'partial').length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch audit logs',
        },
      },
      { status: 500 }
    );
  }
}

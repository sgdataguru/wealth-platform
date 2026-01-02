/**
 * @file app/api/intelligence/aggregated/route.ts
 * @description Aggregated liquidity intelligence signals by prospect
 */

import { NextRequest, NextResponse } from 'next/server';
import { derivePriority } from '@/lib/utils/signals';
import { fetchProspectIdsForRm, fetchSupabase, getAuthenticatedUserId } from '../utils';

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const prospectIds = await fetchProspectIdsForRm(userId);

    if (!prospectIds.length) {
      return NextResponse.json({ success: true, data: [] });
    }

    const query = new URLSearchParams({
      select: 'id,title,description,relevance_score,detected_at,source_trace,prospect_id',
      prospect_id: `in.(${prospectIds.join(',')})`,
      order: 'detected_at.desc,relevance_score.desc',
      limit: '500',
    });

    const response = await fetchSupabase('intelligence_signals', { method: 'GET', query });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch aggregated signals.' },
        { status: 500 }
      );
    }

    const data = (await response.json()) as Array<Record<string, unknown>>;

    const grouped = new Map<string, {
      prospectId: string;
      totalSignals: number;
      latestDetectedAt: string | null;
      topSignals: Array<Record<string, unknown>>;
    }>();

    for (const signal of data ?? []) {
      const prospectId = signal.prospect_id as string;
      const group = grouped.get(prospectId) ?? {
        prospectId,
        totalSignals: 0,
        latestDetectedAt: null,
        topSignals: [],
      };

      group.totalSignals += 1;
      if (!group.latestDetectedAt || (signal.detected_at as string) > group.latestDetectedAt) {
        group.latestDetectedAt = signal.detected_at as string;
      }

      if (group.topSignals.length < 3) {
        const relevanceScore = (signal.relevance_score as number | null) ?? null;
        group.topSignals.push({
          id: signal.id,
          title: signal.title,
          description: signal.description,
          detectedAt: signal.detected_at,
          priority: derivePriority(relevanceScore),
          confidence: relevanceScore,
          sourceTrace: Array.isArray(signal.source_trace) ? signal.source_trace : [],
        });
      }

      grouped.set(prospectId, group);
    }

    return NextResponse.json({
      success: true,
      data: Array.from(grouped.values()),
    });
  } catch (error) {
    console.error('Aggregated API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch aggregated signals.' },
      { status: 500 }
    );
  }
}

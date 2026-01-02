/**
 * @file app/api/intelligence/signals/route.ts
 * @description Fetch liquidity intelligence signals
 */

import { NextRequest, NextResponse } from 'next/server';
import type { LiquiditySignal, Priority, SourceType, TimelineFilter } from '@/types';
import { buildSearchQuery, derivePriority } from '@/lib/utils/signals';
import { fetchProspectIdsForRm, fetchSupabase, getAuthenticatedUserId } from '../utils';

const PRIORITY_RANGES: Record<Priority, { min: number; max?: number }> = {
  CRITICAL: { min: 0.85 },
  HIGH: { min: 0.7, max: 0.85 },
  MEDIUM: { min: 0.5, max: 0.7 },
  LOW: { min: 0, max: 0.5 },
};

const buildPriorityFilter = (priorities: Priority[]) => {
  const clauses = priorities.map((priority) => {
    const range = PRIORITY_RANGES[priority];
    if (range.max !== undefined) {
      return `and(relevance_score.gte.${range.min},relevance_score.lt.${range.max})`;
    }
    return `relevance_score.gte.${range.min}`;
  });

  return clauses.length ? `or(${clauses.join(',')})` : '';
};

const buildSourceFilter = (sources: SourceType[]) => {
  if (!sources.length) return '';
  const clauses = sources.map((source) => `source_trace.cs.${JSON.stringify([{ source }])}`);
  return `or(${clauses.join(',')})`;
};

const parseArrayParam = (value: string | null) => {
  if (!value) return [];
  return value.split(',').map((item) => item.trim()).filter(Boolean);
};

const parseContentRange = (range: string | null) => {
  if (!range) return 0;
  const parts = range.split('/');
  if (parts.length !== 2) return 0;
  return Number(parts[1] ?? 0);
};

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const q = searchParams.get('q') ?? '';
    const timeline = (searchParams.get('timeline') ?? 'ALL') as TimelineFilter;
    const priorityFilters = parseArrayParam(searchParams.get('priority')) as Priority[];
    const sourceFilters = parseArrayParam(searchParams.get('source')) as SourceType[];
    const sortBy = searchParams.get('sortBy') ?? 'detectedAt';
    const sortOrder = searchParams.get('sortOrder') ?? 'desc';
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 20)));

    const prospectIds = await fetchProspectIdsForRm(userId);
    if (!prospectIds.length) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        meta: { lastUpdated: new Date().toISOString() },
      });
    }

    const query = new URLSearchParams();
    query.set('select', 'id,title,description,relevance_score,detected_at,source_trace,prospect_id');
    query.set('prospect_id', `in.(${prospectIds.join(',')})`);

    if (q.trim()) {
      const searchQuery = buildSearchQuery(q);
      if (searchQuery) {
        query.set('search_vector', `fts.${searchQuery}`);
      }
    }

    if (timeline !== 'ALL') {
      const days = timeline === '30_DAY' ? 30 : timeline === '60_DAY' ? 60 : 90;
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      query.set('detected_at', `gte.${cutoff}`);
    }

    const andFilters = [] as string[];
    const priorityFilter = buildPriorityFilter(priorityFilters);
    if (priorityFilter) andFilters.push(priorityFilter);
    const sourceFilter = buildSourceFilter(sourceFilters);
    if (sourceFilter) andFilters.push(sourceFilter);
    if (andFilters.length) {
      query.set('and', `(${andFilters.join(',')})`);
    }

    if (sortBy === 'priority' || sortBy === 'confidence') {
      query.set('order', `relevance_score.${sortOrder}`);
    } else {
      query.set('order', `detected_at.${sortOrder}`);
    }

    query.set('limit', String(limit));
    query.set('offset', String((page - 1) * limit));

    const response = await fetchSupabase('intelligence_signals', {
      method: 'GET',
      query,
      headers: {
        Prefer: 'count=exact',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch signals.' },
        { status: 500 }
      );
    }

    const data = (await response.json()) as Array<Record<string, unknown>>;
    const total = parseContentRange(response.headers.get('content-range'));

    const mapped = data.map((row) => {
      const relevanceScore = (row.relevance_score as number | null) ?? null;
      const priority = derivePriority(relevanceScore);
      return {
        id: row.id as string,
        title: row.title as string,
        description: row.description as string | null,
        relevanceScore,
        detectedAt: row.detected_at as string,
        sourceTrace: Array.isArray(row.source_trace) ? row.source_trace : [],
        prospectId: row.prospect_id as string | null,
        priority,
        confidence: relevanceScore,
      } satisfies LiquiditySignal;
    });

    const totalPages = total ? Math.ceil(total / limit) : 0;

    return NextResponse.json({
      success: true,
      data: mapped,
      pagination: { page, limit, total, totalPages },
      meta: { lastUpdated: new Date().toISOString() },
    });
  } catch (error) {
    console.error('Signals API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch signals.' },
      { status: 500 }
    );
  }
}

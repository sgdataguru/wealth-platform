/**
 * @file app/api/intelligence/ingest/route.ts
 * @description Ingest intelligence signals with conflict resolution
 */

import { NextRequest, NextResponse } from 'next/server';
import type { RawSignal, SourceTrace, SourceType } from '@/types';
import { createSignalSignature, resolveConflicts, SOURCE_PRIORITY_MAP } from '@/lib/utils/signals';
import { fetchSupabase, getAuthenticatedUserId } from '../utils';

const normalizeRawSignal = (signal: RawSignal) => ({
  title: signal.title,
  description: signal.description ?? null,
  relevanceScore: signal.relevanceScore ?? 0.5,
  detectedAt: signal.detectedAt ?? new Date().toISOString(),
  prospectId: signal.prospectId ?? null,
  sourceTrace: signal.sourceTrace ?? [],
  metadata: signal.metadata ?? {},
});

const fetchExistingBatch = async (batchId: string, source: SourceType) => {
  const query = new URLSearchParams({
    select: 'id',
    batch_id: `eq.${batchId}`,
    source: `eq.${source}`,
    limit: '1',
  });
  const response = await fetchSupabase('intelligence_ingestion_audit', { method: 'GET', query });
  if (!response.ok) {
    throw new Error('Failed to validate ingestion batch.');
  }
  const data = (await response.json()) as Array<{ id: string }>;
  return data[0] ?? null;
};

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const signals = Array.isArray(body?.signals) ? (body.signals as RawSignal[]) : [];
    const source = body?.source as SourceType | undefined;
    const batchId = body?.batchId ?? crypto.randomUUID();

    if (!signals.length || !source) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload.' },
        { status: 400 }
      );
    }

    const existingBatch = await fetchExistingBatch(batchId, source);
    if (existingBatch) {
      return NextResponse.json({
        success: true,
        processed: 0,
        conflicts: 0,
        errors: [],
      });
    }

    const normalized = signals.map(normalizeRawSignal);
    const { resolved, conflicts: internalConflicts } = resolveConflicts(normalized, source);

    const prospectIds = resolved.map((signal) => signal.prospectId).filter(Boolean) as string[];
    let existingSignals: Array<Record<string, unknown>> = [];

    if (prospectIds.length) {
      const query = new URLSearchParams({
        select: 'id,title,description,relevance_score,detected_at,source_trace,prospect_id',
        prospect_id: `in.(${prospectIds.join(',')})`,
      });
      const response = await fetchSupabase('intelligence_signals', { method: 'GET', query });
      if (!response.ok) {
        return NextResponse.json(
          { success: false, error: 'Failed to check existing signals.' },
          { status: 500 }
        );
      }
      existingSignals = (await response.json()) as Array<Record<string, unknown>>;
    }

    const existingMap = new Map(
      existingSignals.map((row) => {
        const signature = createSignalSignature({
          title: row.title as string,
          prospectId: (row.prospect_id as string | null) ?? null,
        });
        return [signature, row];
      })
    );

    const inserts = [] as Array<Record<string, unknown>>;
    const updates = [] as Array<{ id: string; payload: Record<string, unknown> }>;
    let conflicts = internalConflicts;

    const now = new Date().toISOString();

    for (const signal of resolved) {
      const signature = createSignalSignature(signal);
      const existing = existingMap.get(signature);
      const incomingTrace: SourceTrace = { source, ingestedAt: now };
      const mergedTrace = [
        ...(Array.isArray(signal.sourceTrace) ? signal.sourceTrace : []),
        incomingTrace,
      ];

      if (!existing) {
        inserts.push({
          title: signal.title,
          description: signal.description,
          relevance_score: signal.relevanceScore,
          detected_at: signal.detectedAt,
          source_trace: mergedTrace,
          prospect_id: signal.prospectId,
        });
        continue;
      }

      conflicts += 1;
      const existingTrace = Array.isArray(existing.source_trace) ? existing.source_trace : [];
      const mergedSources = Array.from(
        new Map(
          [...existingTrace, ...mergedTrace].map((entry: SourceTrace) => [entry.source, entry])
        ).values()
      );

      const existingPrimary = existingTrace.reduce<SourceType | null>((current, entry: SourceTrace) => {
        if (!current) return entry.source;
        return SOURCE_PRIORITY_MAP[entry.source] > SOURCE_PRIORITY_MAP[current] ? entry.source : current;
      }, null);

      if (!existingPrimary || SOURCE_PRIORITY_MAP[source] > SOURCE_PRIORITY_MAP[existingPrimary]) {
        updates.push({
          id: existing.id as string,
          payload: {
            title: signal.title,
            description: signal.description,
            relevance_score: signal.relevanceScore,
            detected_at: signal.detectedAt,
            source_trace: mergedSources,
            updated_at: now,
          },
        });
      } else {
        updates.push({
          id: existing.id as string,
          payload: {
            source_trace: mergedSources,
            updated_at: now,
          },
        });
      }
    }

    const errors: string[] = [];

    if (inserts.length) {
      const response = await fetchSupabase('intelligence_signals', {
        method: 'POST',
        body: inserts,
      });
      if (!response.ok) {
        errors.push('Failed to insert new signals.');
      }
    }

    for (const update of updates) {
      const query = new URLSearchParams({ id: `eq.${update.id}` });
      const response = await fetchSupabase('intelligence_signals', {
        method: 'PATCH',
        body: update.payload,
        query,
      });
      if (!response.ok) {
        errors.push(`Failed to update signal ${update.id}.`);
      }
    }

    await fetchSupabase('intelligence_ingestion_audit', {
      method: 'POST',
      body: {
        batch_id: batchId,
        source,
        processed: inserts.length + updates.length,
        conflicts,
        errors: errors.length ? errors : null,
      },
    });

    return NextResponse.json({
      success: errors.length === 0,
      processed: inserts.length + updates.length,
      conflicts,
      errors,
    });
  } catch (error) {
    console.error('Ingest API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to ingest signals.' },
      { status: 500 }
    );
  }
}

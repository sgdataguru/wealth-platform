/**
 * @file app/api/intelligence/utils.ts
 * @description Shared helpers for intelligence API routes
 */

import 'server-only';
import type { NextRequest } from 'next/server';
import { supabaseAdminFetch, supabaseAuthFetch } from '@/lib/supabase/server';

const DEV_ALLOW_HEADER = 'x-rm-id';

export const getAuthenticatedUserId = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  const devRmId = request.headers.get(DEV_ALLOW_HEADER);

  if (!authHeader && devRmId && process.env.NODE_ENV !== 'production') {
    return devRmId;
  }

  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return null;

  const response = await supabaseAuthFetch(token);
  if (!response.ok) return null;

  const payload = (await response.json()) as { id?: string };
  return payload?.id ?? null;
};

export const fetchProspectIdsForRm = async (rmId: string) => {
  const query = new URLSearchParams({ select: 'id', rm_id: `eq.${rmId}` });
  const response = await supabaseAdminFetch('prospects', { method: 'GET', query });
  if (!response.ok) {
    throw new Error('Failed to resolve prospects for RM.');
  }
  const data = (await response.json()) as Array<{ id: string }>;
  return data.map((item) => item.id);
};

export const fetchSupabase = async (
  path: string,
  options: Parameters<typeof supabaseAdminFetch>[1] & { query?: URLSearchParams } = {}
) => {
  return supabaseAdminFetch(path, options);
};

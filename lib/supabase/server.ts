/**
 * @file lib/supabase/server.ts
 * @description Supabase server fetch helpers (service role key)
 */

import 'server-only';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
  );
}

export const getSupabaseServerConfig = () => ({
  url: supabaseUrl,
  serviceRoleKey,
});

export const supabaseAdminFetch = async (
  path: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
    query?: URLSearchParams;
    prefer?: string;
  } = {}
) => {
  const { method = 'GET', headers = {}, body, query, prefer } = options;
  const url = new URL(`${supabaseUrl}/rest/v1/${path}`);
  if (query) {
    query.forEach((value, key) => url.searchParams.set(key, value));
  }

  return fetch(url.toString(), {
    method,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: prefer ?? 'return=representation',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
};

export const supabaseAuthFetch = async (token: string) => {
  return fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

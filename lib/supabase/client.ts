/**
 * @file lib/supabase/client.ts
 * @description Supabase browser client (anon key only)
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  );
}

export const getSupabaseClientConfig = () => ({
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
});

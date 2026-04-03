import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Chave pública do Supabase: o painel pode indicar
 * `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (novo) ou `NEXT_PUBLIC_SUPABASE_ANON_KEY` (legacy JWT).
 */
export function getSupabasePublicEnv(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

/**
 * Cliente Supabase para browser ou Route Handlers / Server Components.
 */
export function createSupabaseClient(): SupabaseClient {
  const env = getSupabasePublicEnv();
  if (!env) {
    throw new Error(
      "Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY (ou NEXT_PUBLIC_SUPABASE_ANON_KEY) em .env.local"
    );
  }
  return createClient(env.url, env.key);
}

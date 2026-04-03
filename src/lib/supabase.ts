import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function envTrim(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v && v.length > 0 ? v : undefined;
}

/**
 * Resolve URL e chave públicas do Supabase.
 *
 * **Cliente (browser):** só `NEXT_PUBLIC_*` existe no bundle.
 * **Servidor (Route Handlers, RSC):** aceita também nomes sem prefixo (útil na Vercel
 * se as variáveis `NEXT_PUBLIC_*` não estiverem disponíveis no runtime).
 */
export function getSupabasePublicEnv(): { url: string; key: string } | null {
  const onServer = typeof window === "undefined";

  const url =
    envTrim("NEXT_PUBLIC_SUPABASE_URL") ??
    (onServer ? envTrim("SUPABASE_URL") : undefined);

  const key =
    envTrim("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY") ??
    envTrim("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
    (onServer
      ? envTrim("SUPABASE_PUBLISHABLE_DEFAULT_KEY") ??
        envTrim("SUPABASE_ANON_KEY")
      : undefined);

  if (!url || !key) return null;
  return { url, key };
}

/** Para diagnóstico em `/api/health` (não expõe valores). */
export function getSupabaseEnvPresence(): Record<string, boolean> {
  return {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(envTrim("NEXT_PUBLIC_SUPABASE_URL")),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: Boolean(
      envTrim("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY")
    ),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(
      envTrim("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    ),
    SUPABASE_URL: Boolean(envTrim("SUPABASE_URL")),
    SUPABASE_PUBLISHABLE_DEFAULT_KEY: Boolean(
      envTrim("SUPABASE_PUBLISHABLE_DEFAULT_KEY")
    ),
    SUPABASE_ANON_KEY: Boolean(envTrim("SUPABASE_ANON_KEY")),
  };
}

/**
 * Cliente Supabase para browser ou Route Handlers / Server Components.
 */
export function createSupabaseClient(): SupabaseClient {
  const env = getSupabasePublicEnv();
  if (!env) {
    throw new Error(
      "Supabase: define NEXT_PUBLIC_SUPABASE_URL + chave publishable/anon em .env.local, ou no servidor SUPABASE_URL + SUPABASE_PUBLISHABLE_DEFAULT_KEY / SUPABASE_ANON_KEY"
    );
  }
  return createClient(env.url, env.key);
}

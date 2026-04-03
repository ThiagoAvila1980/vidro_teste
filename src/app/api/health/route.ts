import { NextResponse } from "next/server";
import {
  createSupabaseClient,
  getSupabaseEnvPresence,
  getSupabasePublicEnv,
} from "@/lib/supabase";

/** Garante que o health não usa output estático com env vazio do build. */
export const dynamic = "force-dynamic";

/**
 * Verifica ligação ao Supabase com uma leitura mínima em `public.users` (REQ-1).
 */
export async function GET() {
  if (!getSupabasePublicEnv()) {
    return NextResponse.json(
      {
        ok: false,
        error: "Variáveis Supabase em falta",
        env_presence: getSupabaseEnvPresence(),
        hint: "Na Vercel → Environment Variables, marca Production e define URL + chave. Nomes aceites: NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY (recomendado), ou no servidor SUPABASE_URL + SUPABASE_PUBLISHABLE_DEFAULT_KEY (ou SUPABASE_ANON_KEY). Guarda e faz Redeploy.",
      },
      { status: 500 }
    );
  }

  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro desconhecido";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

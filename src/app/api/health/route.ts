import { NextResponse } from "next/server";
import { createSupabaseClient, getSupabasePublicEnv } from "@/lib/supabase";

/**
 * Verifica ligação ao Supabase com uma leitura mínima em `public.users` (REQ-1).
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();
  if (!url || !key) {
    return NextResponse.json(
      {
        ok: false,
        error: "Variáveis Supabase em falta",
        detail: {
          NEXT_PUBLIC_SUPABASE_URL_defined: Boolean(url),
          chave_publica_defined: Boolean(key),
        },
        hint: "Vercel → Settings → Environment Variables: define NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY (ou NEXT_PUBLIC_SUPABASE_ANON_KEY) para o ambiente Production. Guarda e faz Redeploy — variáveis novas só entram após novo deploy.",
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

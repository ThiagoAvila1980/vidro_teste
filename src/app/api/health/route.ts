import { NextResponse } from "next/server";
import { createSupabaseClient, getSupabasePublicEnv } from "@/lib/supabase";

/**
 * Verifica ligação ao Supabase com uma leitura mínima em `public.users` (REQ-1).
 */
export async function GET() {
  if (!getSupabasePublicEnv()) {
    return NextResponse.json(
      { ok: false, error: "Variáveis Supabase em falta" },
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

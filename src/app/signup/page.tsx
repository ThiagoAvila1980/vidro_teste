import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-semibold text-slate-900">Criar conta</h1>
      <p className="mt-2 text-slate-600">Em breve — registo com Supabase.</p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        ← Voltar ao início
      </Link>
    </div>
  );
}

import Link from "next/link";

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-blue-800"
          >
            Conecta
          </Link>
          <nav>
            <ul className="flex gap-2 sm:gap-4">
              <li>
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  Criar Conta
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto px-6 py-16 text-center sm:py-20">
          <div className="mx-auto max-w-[700px]">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Bem-vindo ao Conecta
            </h1>
            <p className="mt-4 text-lg text-slate-600 sm:text-xl">
              Conectar vidraceiros com clientes que precisam de serviços
            </p>
            <p className="mt-6 text-base leading-relaxed text-slate-700">
              A plataforma que simplifica a conexão entre profissionais qualificados e
              clientes em busca de serviços de vidraçaria. Sem burocracia, sem
              intermediação manual, sem inadimplência.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex min-h-12 min-w-[140px] items-center justify-center rounded-lg bg-blue-600 px-8 text-sm font-semibold text-white shadow transition hover:bg-blue-700 hover:shadow-md"
              >
                Fazer Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex min-h-12 min-w-[140px] items-center justify-center rounded-lg border border-slate-300 bg-slate-100 px-8 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-200"
              >
                Criar Conta
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full bg-blue-50 py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              Como Funciona
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mb-4 text-4xl" aria-hidden>
                  👤
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Para Clientes
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Descreva o serviço que precisa e receba propostas de profissionais
                  qualificados. Pague com segurança.
                </p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mb-4 text-4xl" aria-hidden>
                  🔧
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Para Profissionais
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Receba ofertas de trabalho qualificadas, aceite as que se encaixam na
                  sua agenda e ganhe com segurança.
                </p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:col-span-2 lg:col-span-1">
                <div className="mb-4 text-4xl" aria-hidden>
                  📊
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Para Gestores
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Visualize pedidos, filtre profissionais, distribua trabalho e gerencie
                  comissões automaticamente.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto bg-slate-900 px-6 py-10 text-center text-sm text-slate-300">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-4 flex flex-wrap justify-center gap-6">
            <a href="#" className="hover:text-white">
              Termos de Serviço
            </a>
            <a href="#" className="hover:text-white">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-white">
              Contato
            </a>
          </div>
          <p>© {year} Conecta. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}

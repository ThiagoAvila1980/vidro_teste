This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## BrainGrid: hooks Git e convenção de commits

Depois de clonar, ativa os hooks (uma vez por repositório local):

```bash
git config core.hooksPath .githooks
```

Ou: `npm run hooks:install`

### Rodapé opcional na mensagem de commit

Se incluíres `BG-TASK` (e `BG-REQ`), o hook **post-commit** chama `braingrid task update` para sincronizar o estado da tarefa no BrainGrid.

```text
feat(scope): descrição curta

BG-REQ: REQ-1
BG-TASK: TASK-42
BG-TASK-STATUS: COMPLETED
```

- **BG-REQ**: ID do requisito (ex.: `REQ-1`). Obrigatório quando usas `BG-TASK`.
- **BG-TASK**: ID da tarefa no BrainGrid (vê `braingrid task list -r REQ-1`).
- **BG-TASK-STATUS**: `PLANNED` | `IN_PROGRESS` | `COMPLETED` | `CANCELLED`. Se omitido, assume-se **COMPLETED**.

O hook **commit-msg** rejeita o commit se `BG-TASK` existir sem `BG-REQ` ou se o status for inválido.

### Variáveis de ambiente

| Variável | Efeito |
|----------|--------|
| `BRAINGRID_HOOK_DISABLE=1` | Não chama a CLI (CI, clones sem credenciais). |
| `BRAINGRID_HOOK_DRY_RUN=1` | Só imprime o comando `braingrid` que seria executado. |

Requisitos: `node` e `braingrid` no `PATH`. Falhas da CLI **não** desfazem o commit.

## Supabase (REQ-1)

1. Copia `.env.example` para `.env.local` e preenche `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (como no Connect do Supabase). Se ainda usares a chave **anon** legacy (JWT), podes usar `NEXT_PUBLIC_SUPABASE_ANON_KEY` em alternativa.
2. No SQL Editor do Supabase, executa o ficheiro `supabase/migrations/20260403000000_req1_scaffolding.sql` (tabelas de scaffolding + RLS permissivo para desenvolvimento).
3. Confirma a ligação: `GET /api/health` deve devolver `{"ok":true}` com o servidor a correr.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying [`src/app/page.tsx`](src/app/page.tsx). The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) with Inter for the landing.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

1. Importa o repositório [ThiagoAvila1980/vidro_teste](https://github.com/ThiagoAvila1980/vidro_teste) na [Vercel](https://vercel.com/new).
2. **Root Directory:** deixa **vazio** (raiz — onde estão `package.json` e `next.config.ts`).
3. **Production branch:** normalmente `main`, com o código que inclui `src/app/`.
4. **Environment Variables (Production):** as mesmas do Supabase que em `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`).
5. Após o deploy **Ready**, abre **Visit** e testa `/` e `/api/health`.

Se aparecer **404**, segue o guia [docs/vercel-troubleshooting.md](docs/vercel-troubleshooting.md).

Documentação geral: [Next.js on Vercel](https://nextjs.org/docs/app/building-your-application/deploying).

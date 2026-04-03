# Vercel: 404 “This page could not be found” (Next.js Conecta)

Este projeto usa App Router em `src/app/` (`/`, `/login`, `/signup`, `/api/health`). Um deploy correto **não** deve devolver 404 na raiz.

## 1. Confirmar URL e deployment

1. Na Vercel: **Deployments** → abre o deployment mais recente com estado **Ready**.
2. Usa **Visit** desse deployment (evita URLs antigas ou outro projeto).
3. Na **mesma** origem, testa:
   - `https://<teu-projeto>.vercel.app/`
   - `https://<teu-projeto>.vercel.app/api/health` (deve responder JSON, ex. `{"ok":true}` se o Supabase estiver configurado em produção).

Se **ambos** derem 404, o problema costuma ser **Root Directory**, **branch** ou **build**.

## 2. Root Directory e build

**Settings → General:**

| Campo | Valor esperado |
|--------|----------------|
| **Root Directory** | **Vazio** (raiz do repositório). Não uses `src`, `app` nem subpastas — `package.json` e `next.config.ts` estão na raiz. |
| **Framework Preset** | Next.js |
| **Build Command** | `next build` ou vazio (default) |
| **Output Directory** | **Vazio** (não uses `out` sem `output: 'export'` no Next) |
| **Install Command** | `npm install` ou vazio (default) |

Alterações aqui exigem **Redeploy**.

## 3. Branch e GitHub

**Settings → Git:**

- **Production Branch** deve ser o branch onde está o código completo (ex.: `main`).
- No GitHub, confirma que esse branch contém `src/app/page.tsx` e `package.json` na raiz.

Se a produção aponta para um branch **sem** o Next.js atual, o 404 é esperado.

## 4. Build Logs

No deployment em questão:

1. Abre **Building** / **Build Logs**.
2. Confirma **Build Completed** sem erros.
3. Se o build **falhar**, corrige o erro indicado (dependências, TypeScript, variáveis em falta no build, etc.) e faz novo deploy.

## 5. Domínio personalizado

**Settings → Domains:** o domínio deve estar **Valid**. DNS incorreto pode apontar para outro projeto ou deployment antigo.

## Verificação local antes de submeter

Na raiz do repo:

```bash
npm run build
```

No fim do build, a secção **Route (app)** deve listar pelo menos `/` e `/api/health`. Se falhar localmente, a Vercel também falhará ou servirá conteúdo errado.

## Variáveis em produção

Para `/api/health` devolver `{"ok":true}` na Vercel, define em **Settings → Environment Variables** (Production):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (ou `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

Sem isto, `/` pode funcionar mas `/api/health` devolve erro (não costuma ser 404 na raiz).

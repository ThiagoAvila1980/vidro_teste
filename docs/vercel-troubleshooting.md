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

Se `/api/health` responder `{"ok":false,"error":"Variáveis Supabase em falta"}`, o servidor na Vercel **não vê** URL ou chave. Isto é quase sempre configuração no painel, não bug do código.

### Passos na Vercel

1. **Settings → Environment Variables**
2. Adiciona **exatamente** estes nomes (respeita `NEXT_PUBLIC_` no início):
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://<ref>.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` = `sb_publishable_...` (como no Connect do Supabase)  
     **ou** `NEXT_PUBLIC_SUPABASE_ANON_KEY` = chave JWT `eyJ...` (aba legacy)
3. Em cada variável, marca **Production** (e **Preview** se quiseres previews com Supabase).
4. **Guarda**.
5. **Obrigatório:** **Deployments** → menu **⋯** do último deploy → **Redeploy** (ou faz um push vazio). Variáveis novas ou alteradas **só entram no próximo build**.

### Erros frequentes

- Chave guardada como `SUPABASE_ANON_KEY` **sem** o prefixo `NEXT_PUBLIC_` → o Next não expõe ao bundle/runtime esperado para este cliente.
- Variáveis só em **Development** ou **Preview**, mas estás a testar **Production** (`vidro-teste.vercel.app`).
- Esqueceste o **Redeploy** depois de adicionar variáveis.

O JSON de erro pode incluir `detail` com `NEXT_PUBLIC_SUPABASE_URL_defined` e `chave_publica_defined` para veres o que falta.

Sem variáveis corretas, `/` pode funcionar mas `/api/health` devolve 500 com essa mensagem.

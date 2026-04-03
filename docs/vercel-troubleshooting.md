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
2. Adiciona **exatamente** estes nomes (respeita maiúsculas e underscores):
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://<ref>.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` = `sb_publishable_...` (como no Connect do Supabase)  
     **ou** `NEXT_PUBLIC_SUPABASE_ANON_KEY` = chave JWT `eyJ...` (aba legacy)
3. Em **cada** variável, abre as opções de ambiente e marca **Production** (checkbox). Sem isto, `*.vercel.app` de produção não recebe a variável.
4. **Save** (guardar cada variável ou o conjunto).
5. **Obrigatório:** **Deployments** → **⋯** → **Redeploy** no último deployment. Sem novo deploy, o runtime continua sem as variáveis novas.

### Se `NEXT_PUBLIC_*` continuar tudo `false` em `env_presence`

O `/api/health` também aceita variáveis **só para servidor** (não vão para o browser):

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_DEFAULT_KEY` **ou** `SUPABASE_ANON_KEY`

Define-as na Vercel para **Production** e faz **Redeploy**. Útil se houver alguma anomalia com `NEXT_PUBLIC_*` no runtime.

### Erros frequentes

- **Production** não marcado nas variáveis → produção vê tudo `false` em `env_presence`.
- Nome errado (espaço, minúsculas, `SUPABASE_URL` sem `NEXT_PUBLIC_` quando só usas opção A no cliente — no servidor a opção B resolve o health).
- Variáveis só em **Preview**, mas testas **`vidro-teste.vercel.app`** (produção).
- **Redeploy** em falta após guardar variáveis.

O JSON de erro inclui `env_presence` com `true`/`false` por nome (sem expor valores).

Sem variáveis corretas, `/` pode funcionar mas `/api/health` devolve 500 com essa mensagem.

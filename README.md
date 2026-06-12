# Jornada Backend 🚀

Mapa de evolução gamificado para aprender backend de forma prática.
30 min/dia · 6 fases · ErexHost como laboratório.

## Rodar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

Os arquivos finais ficam em `dist/`.

## Login com GitHub + progresso na nuvem (opcional)

Sem configurar nada, o app funciona com `localStorage`. Para sincronizar o
progresso entre dispositivos via login com GitHub:

### 1. Criar o projeto no Supabase

1. Crie uma conta em [supabase.com](https://supabase.com) e um projeto novo (plano free)
2. No **SQL Editor**, cole e execute o conteúdo de [`supabase/schema.sql`](supabase/schema.sql)
3. Em **Settings → API**, anote a `Project URL` e a `anon public key`

### 2. Criar o OAuth App no GitHub

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
2. **Homepage URL:** a URL do seu site (ex.: `https://seu-app.vercel.app`)
3. **Authorization callback URL:** `https://SEU-PROJETO.supabase.co/auth/v1/callback`
   (o Supabase mostra essa URL exata em **Authentication → Providers → GitHub**)
4. Anote o `Client ID` e gere um `Client Secret`

### 3. Conectar os dois

No Supabase: **Authentication → Providers → GitHub** → ativar e colar
`Client ID` + `Client Secret`.
Em **Authentication → URL Configuration**, adicione a URL do site (e
`http://localhost:5173` para testar localmente) em **Redirect URLs**.

> 🔒 O Client Secret fica **só no painel do Supabase** — nunca no código.
> A anon key é pública por design; quem protege os dados é o RLS
> (cada usuário só lê/escreve a própria linha).

### 4. Variáveis de ambiente

Local: copie `.env.example` para `.env` e preencha.
Na Vercel: **Settings → Environment Variables** com as mesmas duas chaves.

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Deploy na Vercel

1. Importe o repositório em [vercel.com/new](https://vercel.com/new) (framework: Vite, detectado automático)
2. Adicione as duas variáveis de ambiente acima
3. Deploy — e atualize a Homepage URL do OAuth App com a URL final

## Fases

1. ⚡ JavaScript prático no Node (semanas 1–5)
2. 🛡️ TypeScript (semanas 6–9)
3. 🌐 Node, Express e API REST (semanas 10–15)
4. 💎 SQL na prática (semanas 16–17)
5. 🌿 Git e Deploy de verdade (semanas 18–20)
6. 🐋 Docker por dentro (semanas 21–23)

Progresso salvo no navegador (localStorage).

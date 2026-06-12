# Jornada Backend 🚀

Mapa de evolução gamificado para aprender backend de forma prática.
30 min/dia · 6 fases · ErexHost como laboratório.

## Arquitetura

- **Frontend:** React + Vite (esta pasta) — funciona sozinho com `localStorage`
- **Backend (opcional):** [`server/`](server/) — Express + PostgreSQL próprio,
  com login via GitHub OAuth e progresso sincronizado por usuário

## Rodar localmente

```bash
# frontend (funciona sozinho, progresso no localStorage)
npm install
npm run dev

# backend (opcional — habilita login GitHub + sync no PostgreSQL)
cd server
cp .env.example .env   # preencher DATABASE_URL e chaves do GitHub
npm install
npm run migrate        # cria as tabelas no banco
npm start              # http://localhost:3000 (o vite dev faz proxy de /api)
```

## Build de produção

```bash
npm run build
```

Os arquivos finais ficam em `dist/` — em produção o próprio Express os serve.

## Login com GitHub + progresso no banco próprio

Sem backend configurado, o app funciona 100% com `localStorage`.
Com backend, cada usuário loga com GitHub e o progresso vai para o PostgreSQL.

### 1. Criar o OAuth App no GitHub

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
2. **Homepage URL:** a URL pública do site (ex.: `https://curso.seudominio.com`)
3. **Authorization callback URL:** `https://curso.seudominio.com/api/auth/github/callback`
   (para testar local: crie um segundo OAuth App com `http://localhost:3000/api/auth/github/callback`)
4. Anote o `Client ID` e gere um `Client Secret`

### 2. Variáveis de ambiente

Copie [`server/.env.example`](server/.env.example) para `server/.env` e preencha:

```
DATABASE_URL=postgresql://usuario:senha@host:5432/banco?sslmode=no-verify
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
APP_URL=https://curso.seudominio.com
NODE_ENV=production
```

> 🔒 O `.env` está no `.gitignore` e **nunca** entra no repositório.
> O Client Secret e a senha do banco vivem só no servidor. No banco,
> cada usuário só acessa a própria linha (toda query filtra por `user_id`
> da sessão), e as sessões são salvas **hasheadas**.

### 3. Como funciona a sessão

- Login → cookie `sessao` HttpOnly + Secure + SameSite=Lax, válido por 30 dias
- O token é opaco e só o hash SHA-256 vai para o banco (tabela `sessoes`)
- F5 não desloga; logout apaga a sessão do banco

## Deploy na sua host (Docker)

```bash
docker build -t jornada-backend .
docker run -d --name jornada -p 3000:3000 --env-file server/.env jornada-backend
```

Aponte o NGINX (proxy reverso + TLS) para a porta 3000 e use a URL pública
no `APP_URL` e no OAuth App do GitHub.

## Fases

1. ⚡ JavaScript prático no Node (semanas 1–5)
2. 🛡️ TypeScript (semanas 6–9)
3. 🌐 Node, Express e API REST (semanas 10–15)
4. 💎 SQL na prática (semanas 16–17)
5. 🌿 Git e Deploy de verdade (semanas 18–20)
6. 🐋 Docker por dentro (semanas 21–23)

Progresso salvo no navegador (localStorage).

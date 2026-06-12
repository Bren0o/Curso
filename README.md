# Jornada Backend 🚀

Mapa de evolução gamificado para aprender backend de forma prática.
30 min/dia · 6 fases · ErexHost como laboratório.

## Arquitetura

- **Frontend:** React + Vite (esta pasta) — funciona sozinho com `localStorage`
- **Backend (opcional):** [`server/`](server/) — Express + PostgreSQL próprio,
  com contas (e-mail + senha) e progresso sincronizado por usuário

## Rodar localmente

```bash
# frontend (funciona sozinho, progresso no localStorage)
npm install
npm run dev

# backend (opcional — habilita contas + sync no PostgreSQL)
cd server
cp .env.example .env   # preencher só a DATABASE_URL
npm install
npm run migrate        # cria as tabelas no banco
npm start              # http://localhost:3000 (o vite dev faz proxy de /api)
```

## Build de produção

```bash
npm run build
```

Os arquivos finais ficam em `dist/` — em produção o próprio Express os serve.

## Contas + progresso no banco próprio

Sem backend configurado, o app funciona 100% com `localStorage`.
Com backend, há dois jeitos de logar (podem coexistir):

- **E-mail + senha** — sempre ativo, só precisa da `DATABASE_URL`
- **Entrar com GitHub** — opcional; o botão só aparece se
  `GITHUB_CLIENT_ID` e `GITHUB_CLIENT_SECRET` estiverem configurados

### Variáveis de ambiente

Copie [`server/.env.example`](server/.env.example) para `server/.env`:

```
DATABASE_URL=postgresql://usuario:senha@host:5432/banco?sslmode=no-verify
NODE_ENV=production

# opcionais (habilitam o botão GitHub):
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

### Habilitar o login com GitHub

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
2. **Homepage URL:** `https://curso.erex.app`
3. **Authorization callback URL:** `https://curso.erex.app/api/auth/github/callback`
4. **Register application** → copie o `Client ID`
5. **Generate a new client secret** → copie o secret (só aparece uma vez)
6. Coloque os dois nas variáveis de ambiente e reinicie

O Client ID/Secret identificam o **app**, não o usuário — configura uma vez
e qualquer pessoa pode logar com a própria conta GitHub. A URL pública é
detectada automaticamente da requisição; trocando de domínio, basta
atualizar o callback no OAuth App.

> 🔒 O `.env` está no `.gitignore` e **nunca** entra no repositório.
> A senha do banco vive só no servidor.

### Segurança

- Senhas com **bcrypt** (custo 12, salt único) — nunca em texto puro
- Mensagem genérica no login (não revela se o e-mail existe)
- Bloqueio após 5 tentativas erradas (15 min, por IP e por conta)
- Sessão: cookie `sessao` HttpOnly + Secure + SameSite=Lax, 30 dias;
  token opaco, só o hash SHA-256 vai para o banco — F5 não desloga
- Cada usuário só acessa a própria linha (toda query filtra por `user_id`)

## Deploy na sua host (Docker)

```bash
docker build -t jornada-backend .
docker run -d --name jornada -p 3000:3000 --env-file server/.env jornada-backend
```

Aponte o NGINX (proxy reverso + TLS) para a porta 3000. Trocar de domínio
não exige nenhuma reconfiguração.

## Fases

1. ⚡ JavaScript prático no Node (semanas 1–5)
2. 🛡️ TypeScript (semanas 6–9)
3. 🌐 Node, Express e API REST (semanas 10–15)
4. 💎 SQL na prática (semanas 16–17)
5. 🌿 Git e Deploy de verdade (semanas 18–20)
6. 🐋 Docker por dentro (semanas 21–23)

Progresso salvo no navegador (localStorage).

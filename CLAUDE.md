# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

"Jornada Backend" — mapa de estudos gamificado (página única em React) para o plano pessoal de aprendizado de backend do Breno. O progresso é salvo em `localStorage` (chave `jornada-backend-breno-v1`) e, opcionalmente, sincronizado em um backend próprio (`server/` — Express + PostgreSQL no RDS pessoal do Breno, contas com e-mail+senha). Deploy na host própria (curso.erex.app) via Docker com auto-deploy por webhook a cada push na `main`. O dono NÃO quer depender de serviços externos nem de variáveis de ambiente além da `DATABASE_URL`.

**Restrição do dono:** NÃO editar o cronograma dos cursos (`FASES`, `NIVEIS`, `FORA_DO_MAPA` em App.jsx) sem pedido explícito.

## Comandos

```bash
npm install        # instalar dependências do frontend
npm run dev        # dev server Vite (proxy de /api para localhost:3000)
npm run build      # build de produção → dist/
npm run preview    # servir o build localmente

cd server
npm install        # dependências do backend
npm run migrate    # aplica server/schema.sql no banco (DATABASE_URL do .env)
npm start          # backend na porta 3000 (serve também o dist/ em produção)
```

Não há testes nem linter configurados.

## Arquitetura

- App de **um único componente**: praticamente todo o código vive em [src/App.jsx](src/App.jsx). [src/main.jsx](src/main.jsx) só monta o React, e [index.html](index.html) é o entry do Vite.
- **Dados estáticos no topo de App.jsx**: as constantes `FASES` (fases/missões com XP), `NIVEIS` (faixas de XP → nome do nível) e `FORA_DO_MAPA` definem todo o conteúdo. Para alterar conteúdo do mapa, edite essas constantes — o resto da UI deriva delas (`XP_TOTAL` é calculado por reduce).
- **Estilos inline** via o objeto `st` no final de App.jsx (estética "terminal âmbar/CRT"), mais um pequeno bloco `<style>` para keyframes e hovers. Não há Tailwind nem CSS externo.
- **Persistência**: `salvar()` grava `{ feitas, hora }` no localStorage a cada interação e, se logado, faz `PUT /api/progresso`; falha de gravação mostra aviso (`erroSave`). Ao mudar a estrutura dos dados salvos, versione a `STORAGE_KEY` e migre o schema SQL.
- **Backend (opcional)**: [server/index.js](server/index.js) — Express único com contas próprias (registro/login com e-mail+senha, bcrypt custo 12, mensagem genérica no login, bloqueio em memória após 5 falhas/15min por IP e por conta), sessões opacas de 30 dias (cookie HttpOnly+Secure+SameSite=Lax; só o hash SHA-256 vai para a tabela `sessoes`), API de progresso (toda query filtra por `user_id` da sessão) e serve o `dist/`. Schema em [server/schema.sql](server/schema.sql), aplicado via `npm run migrate`. O frontend detecta o backend em runtime ([src/api.js](src/api.js) → `GET /api/me`): sem backend, roda só com localStorage e esconde o card de conta. Ao logar, progresso local e do servidor são mesclados por união (nunca se perde missão marcada).
- **Segredos**: `DATABASE_URL` (RDS pessoal) vive só em `server/.env` (gitignored; modelo em [server/.env.example](server/.env.example)). NUNCA commitar connection strings ou secrets — confira o staged antes de todo commit.

## Convenções

- Código, comentários e nomes de variáveis em **português** (pt-BR).
- IDs de missão seguem o padrão `f<fase>m<n>` (ex.: `f3m4`) e são as chaves do progresso salvo — não renomeie IDs existentes sem migração, ou o progresso do usuário se perde.

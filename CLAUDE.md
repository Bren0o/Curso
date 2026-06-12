# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

"Jornada Backend" — mapa de estudos gamificado (página única em React) para o plano pessoal de aprendizado de backend do Breno. O progresso é salvo em `localStorage` (chave `jornada-backend-breno-v1`) e, opcionalmente, sincronizado na nuvem via Supabase (login com GitHub).

**Restrição do dono:** NÃO editar o cronograma dos cursos (`FASES`, `NIVEIS`, `FORA_DO_MAPA` em App.jsx) sem pedido explícito.

## Comandos

```bash
npm install        # instalar dependências
npm run dev        # servidor de desenvolvimento (Vite)
npm run build      # build de produção → dist/
npm run preview    # servir o build localmente
```

Não há testes nem linter configurados.

## Arquitetura

- App de **um único componente**: praticamente todo o código vive em [src/App.jsx](src/App.jsx). [src/main.jsx](src/main.jsx) só monta o React, e [index.html](index.html) é o entry do Vite.
- **Dados estáticos no topo de App.jsx**: as constantes `FASES` (fases/missões com XP), `NIVEIS` (faixas de XP → nome do nível) e `FORA_DO_MAPA` definem todo o conteúdo. Para alterar conteúdo do mapa, edite essas constantes — o resto da UI deriva delas (`XP_TOTAL` é calculado por reduce).
- **Estilos inline** via o objeto `st` no final de App.jsx (estética "terminal âmbar/CRT"), mais um pequeno bloco `<style>` para keyframes e hovers. Não há Tailwind nem CSS externo.
- **Persistência**: `salvar()` grava `{ feitas, hora }` no localStorage a cada interação e, se logado, faz upsert na tabela `progresso` do Supabase; falha de gravação mostra aviso (`erroSave`). Ao mudar a estrutura dos dados salvos, versione a `STORAGE_KEY` e migre o schema SQL.
- **Auth/nuvem (opcional)**: [src/supabase.js](src/supabase.js) cria o client a partir de `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` — sem as env vars, exporta `null` e o app roda só com localStorage. Schema + políticas RLS em [supabase/schema.sql](supabase/schema.sql) (uma linha por usuário, RLS por `auth.uid()`). Ao logar, o progresso local e o da nuvem são mesclados por união (nunca se perde missão marcada). Segredos nunca vão para o código: `.env` está no `.gitignore`; use `.env.example` como modelo.

## Convenções

- Código, comentários e nomes de variáveis em **português** (pt-BR).
- IDs de missão seguem o padrão `f<fase>m<n>` (ex.: `f3m4`) e são as chaves do progresso salvo — não renomeie IDs existentes sem migração, ou o progresso do usuário se perde.

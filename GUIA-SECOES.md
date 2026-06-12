# 🗺️ Guia de Seções — Curso Otávio Miranda (JS/TS do básico ao avançado)

> **Regra de bolso:** se a aula menciona React, Next, HTML, CSS, DOM, navegador,
> Webpack, Netlify ou styled-components → **PULAR**.
>
> Fatia útil do curso: **~55–60h** das 146h totais.

---

## ⚡ FASE 1 — JavaScript prático no Node

### Fazer

- [ ] Instalação: Node, VSCode e Chrome no **Windows** (pular a aula de Ubuntu)
- [ ] JS básico: console.log, variáveis, let/const, tipos primitivos, operadores
- [ ] Strings, numbers, objeto Math (+ exercícios)
- [ ] Arrays (básico), funções (introdução), objetos (básico)
- [ ] Lógica: operadores de comparação e lógicos, short-circuit, if/else, ternário, switch, Date
- [ ] Estruturas de repetição: for, for in, for of, while, break/continue
- [ ] Exercícios com lógica de programação 01, 02 e 03
- [ ] try/catch/throw, setInterval e setTimeout
- [ ] Funções a fundo: parâmetros, retorno, escopo, closures, callbacks, IIFE, factory, construtoras, recursivas
- [ ] Arrays a fundo: splice, concat, filter, map, reduce, forEach
- [ ] Objetos a fundo: getters/setters, prototypes, herança
- [ ] Exercício: Validando um CPF (algoritmo — ótimo treino)
- [ ] Classes: criação, herança, métodos estáticos, validando CPF com classe
- [ ] Promises, async/await, Fetch API e Axios
- [ ] ✅ CHECKPOINT (fim da semana 2): função que filtra pares e soma, sozinho

### Pular dentro da fase

alert/confirm/prompt (Navegador) · DOM e árvore do DOM · Exercícios com NodeList
(Browser) · Criando uma Lista de tarefas · Modelo HTML e CSS · Validando um
formulário · XMLHttpRequest se quiser (Fetch basta)

### Pular seções inteiras

- ❌ Babel / Webpack / core-js / ES6 modules com webpack
- ❌ Expressões Regulares (sob demanda, depois)

---

## 🛡️ FASE 2 — TypeScript

### Fazer

- [ ] Instalação: TypeScript, ts-node, ESLint, Prettier, tsconfig.json
- [ ] Todos os tipos: annotations, any, void, object, array, tuple, null/undefined, never, enum, unknown
- [ ] Union types, tipos literais, type alias, intersection
- [ ] Funções como tipo, structural typing, type assertions
- [ ] POO: classes, modificadores de acesso, herança, super, getters/setters, estáticos, abstratas
- [ ] Interfaces, declaration merging, type guards, keyof/typeof
- [ ] Generics completo + utility types
- [ ] Exercício da Votação
- [ ] 🏆 Âncora: achar 5 padrões aprendidos no código do ErexHost

### Pular dentro da fase

Configuração do Webpack #1 e #2 · Exercício validando formulário (HTML) ·
Decorators (bloco inteiro) · Namespaces

---

## 🌐 FASE 3 — Node, Express e API REST

### Fazer

- [ ] Seção Node: módulos, NPM, FS (ler/escrever arquivos)
- [ ] Express completo: intro, nodemon, params/query/body, Router, controllers, middlewares
- [ ] MongoDB: servidor, conexão, primeiro model, sessions e flash messages
- [ ] Projeto de contatos: login, criar usuários, CRUD completo
- [ ] Seção API REST: MariaDB + Docker + Insomnia, estrutura, Sequelize
- [ ] CRUD de usuários, JWT (geração + middleware), correções de segurança
- [ ] Rotas e CRUD de alunos, upload de arquivos, arquivos estáticos
- [ ] 🏆 MISSÃO-OURO: reescrever GET /api/containers/:id do ErexHost do zero
- [ ] ⏸️ "Deploy da nossa API" → **guardar para a Fase 5**

### Pular dentro da fase

Express Views aprofundado se enrolar (EJS é só template) · Helmet no localhost
(o próprio curso manda evitar)

### Bônus opcionais (pós-Fase 3, se sobrar fôlego)

- ⭐ Seção SOLID (princípios com carrinho de compras)
- ⭐ Seção Jest (testes — conversa com o loop de testes do ErexHost)

---

## 💎 FASE 4 — SQL na prática

### Fazer

- [ ] Diagramas ER: entidades, relacionamentos (1:1, 1:N, N:N)
- [ ] MySQL via Docker Compose + instalação do DBeaver
- [ ] Tabelas: users, roles, users_roles, profiles, datetime
- [ ] INSERT, SELECT, alias, WHERE, BETWEEN, IN, LIKE, ORDER, LIMIT/OFFSET
- [ ] DELETE, UPDATE, INNER/LEFT/RIGHT JOIN, JOINs múltiplos
- [ ] GROUP BY + funções de agregação + "Uma consulta real" + exercícios
- [ ] 🏆 QUERY FINAL: users + containers + teams no erexhost.db (cópia!), sozinho

### Pular seção inteira

- ❌ Knex (query builder — Sequelize já cobriu ORM)

---

## 🌿 FASE 5 — Git e Deploy de verdade

### Fazer

- [ ] Criar servidor (💡 usar o Lightsail que você já paga em vez do Google Cloud)
- [ ] Chaves SSH no Windows (pular a aula da versão Linux)
- [ ] Git no servidor + envio de arquivos
- [ ] Node + PM2 no servidor (sim, aquele PM2 dos 197 restarts)
- [ ] NGINX como proxy reverso
- [ ] Seção de comandos Linux/Unix: sudo, ls, cd, cp/mv/mkdir/rm, nano, jobs/kill
- [ ] "Deploy da nossa API" (guardado da Fase 3)
- [ ] 🏆 MISSÃO-OURO: mapear o deploy real do ErexHost e apontar 1 melhoria

### Pular

Deploy do React com NGINX · tudo de Netlify · deploy NextJS/Strapi/Heroku ·
webhooks da Netlify

---

## 🐋 FASE 6 — Docker por dentro

O curso não ensina Docker a fundo (só usa de passagem). Esta fase é externa:

- [ ] Conceitos: imagem vs container, layers, volumes, networks (Docker Essencial — TechEduca)
- [ ] Prática: docker ps, logs, exec, inspect nos containers do ErexHost
- [ ] 🏆 MISSÃO-OURO: dissecar linha por linha um Dockerfile gerado pelo painel

---

## ❌ Seções que NÃO se abrem (nem por curiosidade)

HTML e CSS · Landing Page · React (todas as 3 seções) · React Router ·
Redux/Saga/Persist · Pomodoro com React · Design Patterns (pós-jornada) ·
NextJS + Strapi · Storybook · extras de jogo da velha

---

**Regras:** 30 min/dia · timer corta · dia perdido não se repõe · o código digitado é a anotação.

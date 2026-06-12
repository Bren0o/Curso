// Guia de seções do curso por fase — referência de estudo, NÃO altera o cronograma.
// Versão completa com checkboxes: GUIA-SECOES.md na raiz do repositório.

export const REGRA_DE_BOLSO =
  "Regra de bolso: aula que menciona React, Next, HTML, CSS, DOM, navegador, Webpack, Netlify ou styled-components → pular. Fatia útil: ~55–60h das 146h.";

export const GUIA = {
  f1: {
    fazer: [
      "Instalação: Node, VSCode e Chrome no Windows (pular a aula de Ubuntu)",
      "JS básico: console.log, variáveis, let/const, tipos, operadores",
      "Strings, numbers, objeto Math (+ exercícios)",
      "Arrays, funções e objetos (básico)",
      "Lógica: comparação, lógicos, short-circuit, if/else, ternário, switch, Date",
      "Repetição: for, for in, for of, while, break/continue",
      "Exercícios com lógica de programação 01, 02 e 03",
      "try/catch/throw, setInterval e setTimeout",
      "Funções a fundo: escopo, closures, callbacks, IIFE, factory, construtoras, recursivas",
      "Arrays a fundo: splice, concat, filter, map, reduce, forEach",
      "Objetos a fundo: getters/setters, prototypes, herança",
      "Exercício: validando um CPF (algoritmo — ótimo treino)",
      "Classes: criação, herança, métodos estáticos, CPF com classe",
      "Promises, async/await, Fetch API e Axios",
    ],
    pular: [
      "alert/confirm/prompt (navegador), DOM, exercícios com NodeList, Lista de tarefas, modelo HTML/CSS, validando formulário",
      "Seções inteiras: Babel/Webpack/core-js · Expressões Regulares (sob demanda, depois)",
    ],
  },
  f2: {
    fazer: [
      "Instalação: TypeScript, ts-node, ESLint, Prettier, tsconfig.json",
      "Todos os tipos: annotations, any, void, object, array, tuple, null/undefined, never, enum, unknown",
      "Union types, tipos literais, type alias, intersection",
      "Funções como tipo, structural typing, type assertions",
      "POO: classes, modificadores de acesso, herança, super, getters/setters, estáticos, abstratas",
      "Interfaces, declaration merging, type guards, keyof/typeof",
      "Generics completo + utility types",
      "Exercício da Votação",
    ],
    pular: [
      "Configuração do Webpack #1 e #2 · exercício validando formulário (HTML)",
      "Decorators (bloco inteiro) · Namespaces — avançado demais agora",
    ],
  },
  f3: {
    fazer: [
      "Seção Node: módulos, NPM, FS (ler/escrever arquivos)",
      "Express completo: intro, nodemon, params/query/body, Router, controllers, middlewares",
      "MongoDB: servidor, conexão, primeiro model, sessions e flash messages",
      "Projeto de contatos: login, criar usuários, CRUD completo",
      "Seção API REST: MariaDB + Docker + Insomnia, estrutura, Sequelize",
      "CRUD de usuários, JWT (geração + middleware), correções de segurança",
      "Rotas e CRUD de alunos, upload de arquivos, arquivos estáticos",
      "⏸️ \"Deploy da nossa API\" → guardar para a Fase 5",
      "⭐ Bônus se sobrar fôlego: seções SOLID e Jest",
    ],
    pular: [
      "Express Views aprofundado (EJS é só template) · Helmet no localhost (o próprio curso manda evitar)",
    ],
  },
  f4: {
    fazer: [
      "Diagramas ER: entidades, relacionamentos (1:1, 1:N, N:N)",
      "MySQL via Docker Compose + instalação do DBeaver",
      "Tabelas: users, roles, users_roles, profiles, datetime",
      "INSERT, SELECT, alias, WHERE, BETWEEN, IN, LIKE, ORDER, LIMIT/OFFSET",
      "DELETE, UPDATE, INNER/LEFT/RIGHT JOIN, JOINs múltiplos",
      "GROUP BY + funções de agregação + \"Uma consulta real\" + exercícios",
    ],
    pular: ["Seção inteira de Knex (query builder — Sequelize já cobriu ORM)"],
  },
  f5: {
    fazer: [
      "Criar servidor (💡 use o Lightsail que você já paga em vez do Google Cloud)",
      "Chaves SSH no Windows (pular a aula da versão Linux)",
      "Git no servidor + envio de arquivos",
      "Node + PM2 no servidor (sim, aquele PM2 dos 197 restarts)",
      "NGINX como proxy reverso",
      "Comandos Linux/Unix: sudo, ls, cd, cp/mv/mkdir/rm, nano, jobs/kill",
      "\"Deploy da nossa API\" (guardado da Fase 3)",
    ],
    pular: [
      "Deploy do React com NGINX · tudo de Netlify · deploy NextJS/Strapi/Heroku · webhooks da Netlify",
    ],
  },
  f6: {
    fazer: [
      "O curso só usa Docker de passagem — esta fase é externa: Docker Essencial (TechEduca) + prática nos containers do ErexHost",
    ],
    pular: ["Aulas de Docker do curso que aparecerem no meio de outras seções (já cobertas aqui)"],
  },
};

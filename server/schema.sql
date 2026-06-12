-- Jornada Backend — schema do banco próprio (PostgreSQL)
-- Aplicar com: npm run migrate (dentro de server/) — idempotente, não destrói dados

create table if not exists usuarios (
  id         bigserial primary key,
  email      text unique,            -- null para contas criadas via GitHub
  username   text not null,
  senha_hash text,                   -- null para contas criadas via GitHub
  github_id  bigint,                 -- null para contas de e-mail+senha
  criado_em  timestamptz not null default now()
);

-- Migração de bancos criados em versões anteriores (e-mail obrigatório)
alter table usuarios add column if not exists github_id bigint;
alter table usuarios alter column email drop not null;
alter table usuarios alter column senha_hash drop not null;
create unique index if not exists usuarios_github_id_key on usuarios (github_id);

-- Sessões opacas: o token vive só no cookie HttpOnly do usuário;
-- aqui guardamos apenas o hash (vazamento do banco não vaza sessões).
create table if not exists sessoes (
  token_hash text primary key,
  user_id    bigint not null references usuarios (id) on delete cascade,
  criada_em  timestamptz not null default now(),
  expira_em  timestamptz not null
);

create table if not exists progresso (
  user_id    bigint primary key references usuarios (id) on delete cascade,
  feitas     jsonb not null default '{}'::jsonb,
  hora       text  not null default '20:00',
  updated_at timestamptz not null default now()
);

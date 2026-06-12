-- Jornada Backend — schema do banco próprio (PostgreSQL)
-- Aplicar com: npm run migrate (dentro de server/)

create table if not exists usuarios (
  id         bigserial primary key,
  email      text not null unique,
  username   text not null,
  senha_hash text not null,
  criado_em  timestamptz not null default now()
);

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

-- Jornada Backend — tabela de progresso por usuário
-- Cole este arquivo inteiro no SQL Editor do Supabase e execute.

create table public.progresso (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  feitas     jsonb not null default '{}'::jsonb,
  hora       text  not null default '20:00',
  updated_at timestamptz not null default now()
);

-- RLS: cada usuário só enxerga e altera a PRÓPRIA linha.
alter table public.progresso enable row level security;

create policy "ler proprio progresso"
  on public.progresso for select
  using (auth.uid() = user_id);

create policy "criar proprio progresso"
  on public.progresso for insert
  with check (auth.uid() = user_id);

create policy "atualizar proprio progresso"
  on public.progresso for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "apagar proprio progresso"
  on public.progresso for delete
  using (auth.uid() = user_id);

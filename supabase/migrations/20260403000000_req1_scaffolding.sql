-- REQ-1: tabelas de scaffolding (ajustar políticas em requisitos futuros de auth)
-- Executar no SQL Editor do Supabase ou via supabase db push

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.professionals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.managers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.professionals enable row level security;
alter table public.managers enable row level security;
alter table public.service_requests enable row level security;

-- Políticas permissivas para desenvolvimento (substituir em requisitos de auth)
drop policy if exists "scaffold_select_users" on public.users;
create policy "scaffold_select_users"
  on public.users for select
  to anon, authenticated
  using (true);

drop policy if exists "scaffold_select_professionals" on public.professionals;
create policy "scaffold_select_professionals"
  on public.professionals for select
  to anon, authenticated
  using (true);

drop policy if exists "scaffold_select_managers" on public.managers;
create policy "scaffold_select_managers"
  on public.managers for select
  to anon, authenticated
  using (true);

drop policy if exists "scaffold_select_service_requests" on public.service_requests;
create policy "scaffold_select_service_requests"
  on public.service_requests for select
  to anon, authenticated
  using (true);

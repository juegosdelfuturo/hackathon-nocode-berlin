-- ── ACTUALIZACIÓN DE TABLAS: Ejecuta esto en el SQL Editor de Supabase ──

-- 1. Añadir los nuevos campos a la tabla perfiles
create table if not exists profiles (
  id uuid primary key,
  surname text,
  work_position text,
  privacy_accepted boolean default false
);

alter table profiles 
add column if not exists surname text,
add column if not exists work_position text,
add column if not exists privacy_accepted boolean default false;

-- 2. Crear la tabla de partners (empresas que pagan el SaaS)
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  email text not null unique,
  subscription_tier text check (subscription_tier in ('none', 'monthly', 'annual')) default 'none',
  subscription_status text check (subscription_status in ('active', 'inactive', 'past_due')) default 'inactive',
  stripe_customer_id text,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- Solo los administradores pueden leer/escribir en partners
alter table partners enable row level security;

create policy "Admin only on partners" on partners
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

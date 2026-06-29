-- ========================================================
-- SECURITY HARDENING MIGRATION
-- Fixes: RLS policies on partners and profiles tables
-- Creates: admins table for server-side admin role checking
-- ========================================================

-- 1. Create admins table (server-side admin role registry)
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz default now()
);

-- Insert root admin
insert into admins (email) values ('pedro@team-nexio.com')
on conflict (email) do nothing;

-- Enable RLS on admins table
alter table admins enable row level security;

-- Nobody can read/write admins table via the anon/authenticated roles
-- Only service_role (used by Supabase itself) can touch it
create policy "No public access to admins" on admins
  for all
  using (false);


-- 2. Fix partners table RLS
-- Drop the insecure existing policy first
drop policy if exists "Admin only on partners" on partners;

-- Partners can only read their OWN row
create policy "Partners read own record" on partners
  for select
  using (auth.jwt() ->> 'email' = email);

-- Only service_role (admin actions) can insert/update/delete
-- Since we have no backend, we allow anon inserts for the signup flow only
create policy "Allow signup insert" on partners
  for insert
  with check (true);

create policy "Partners update own record" on partners
  for update
  using (auth.jwt() ->> 'email' = email);


-- 3. Fix profiles table RLS
alter table profiles enable row level security;

-- Drop any existing permissive policies
drop policy if exists "Public read profiles" on profiles;
drop policy if exists "Allow all" on profiles;

-- Only authenticated users (approved partners) can read profiles
create policy "Authenticated partners can read profiles" on profiles
  for select
  using (auth.role() = 'authenticated');

-- Nobody can insert/update/delete profiles via client (admin only via service_role)
create policy "No public write to profiles" on profiles
  for insert
  with check (false);

create policy "No public update to profiles" on profiles
  for update
  using (false);

create policy "No public delete from profiles" on profiles
  for delete
  using (false);

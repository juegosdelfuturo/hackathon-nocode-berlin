-- Enable pgcrypto if not already
create extension if not exists pgcrypto schema extensions;

-- Add password_hash column to admins table if not exists
alter table admins add column if not exists password_hash text;

-- Set hashed password for root admin (Pluravita_8)
update admins 
set password_hash = extensions.crypt('Pluravita_8', extensions.gen_salt('bf'))
where email = 'pedro@team-nexio.com';

-- Create RPC: verify admin credentials against admins table (no Supabase Auth required)
create or replace function verify_admin_login(p_email text, p_password text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  stored_hash text;
begin
  select password_hash into stored_hash
  from admins
  where email = lower(p_email);
  
  if not found or stored_hash is null then
    return false;
  end if;
  
  return stored_hash = extensions.crypt(p_password, stored_hash);
end;
$$;

-- Grant execute permission to anon and authenticated roles
grant execute on function verify_admin_login(text, text) to anon, authenticated;

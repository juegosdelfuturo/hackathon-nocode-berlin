-- Ensure pedro is in the admins table with the correct password hash
insert into admins (email, password_hash)
values (
  'pedro@team-nexio.com', 
  extensions.crypt('Pluravita_8', extensions.gen_salt('bf'))
)
on conflict (email) do update
set password_hash = extensions.crypt('Pluravita_8', extensions.gen_salt('bf'));

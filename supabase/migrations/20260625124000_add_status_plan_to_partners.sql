alter table partners 
add column if not exists status text default 'PENDING',
add column if not exists plan text default 'none';

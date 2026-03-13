create table leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  linkedin text not null,
  work_position text not null
);

alter table leads enable row level security;

create policy "Allow public inserts" on leads for insert with check (true);

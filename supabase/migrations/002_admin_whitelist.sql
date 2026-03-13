-- Admin whitelist: only emails in this table may access /admin
-- Google OAuth will be the sole login method.

create table if not exists public.admin_whitelist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

alter table public.admin_whitelist enable row level security;

-- Authenticated users can check if their own email is whitelisted
create policy "Users can check own whitelist status"
  on public.admin_whitelist for select
  to authenticated
  using (email = auth.jwt() ->> 'email');

-- Seed the first whitelisted admin
insert into public.admin_whitelist (email) values ('joseph.ronselli@gmail.com');

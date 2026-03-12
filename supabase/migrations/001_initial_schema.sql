-- Diamond Showdown — Full Schema Migration
-- Run this in your Supabase SQL Editor to create all tables.
-- Based on tournament-schema-context.md (MVP table set)

-- ============================================================
-- 1) tournaments
-- ============================================================
create table if not exists public.tournaments (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  event_date    date,
  location_name text,
  location_address text,
  registration_open  timestamptz,
  registration_close timestamptz,
  draft_datetime     timestamptz,
  max_players   int,
  entry_fee     numeric(10,2),
  status        text not null default 'draft'
                  check (status in ('draft','open','closed','completed','cancelled')),
  rules_text    text,
  -- public-site visibility toggles (admin settings)
  standings_visible   boolean not null default false,
  bracket_published   boolean not null default false,
  scores_live         boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- 2) players
-- ============================================================
create table if not exists public.players (
  id              uuid primary key default gen_random_uuid(),
  first_name      text not null,
  last_name       text not null,
  email           text not null unique,
  phone           text,
  city            text,
  state           text,
  skill_rating    int,
  preferred_position text,
  throws          text,
  bats            text,
  shirt_size      text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- 3) registrations
-- ============================================================
create table if not exists public.registrations (
  id                    uuid primary key default gen_random_uuid(),
  tournament_id         uuid not null references public.tournaments(id) on delete cascade,
  player_id             uuid not null references public.players(id) on delete cascade,
  registration_status   text not null default 'pending'
                          check (registration_status in (
                            'pending','confirmed','waitlisted','cancelled','refunded','checked_in','no_show'
                          )),
  payment_status        text not null default 'unpaid'
                          check (payment_status in ('unpaid','pending','paid','refunded')),
  paid_amount           numeric(10,2),
  draft_eligible        boolean not null default true,
  check_in_status       text check (check_in_status in ('not_arrived','checked_in','no_show')),
  emergency_contact_name  text,
  emergency_contact_phone text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (tournament_id, player_id)
);

-- ============================================================
-- 4) payments
-- ============================================================
create table if not exists public.payments (
  id                          uuid primary key default gen_random_uuid(),
  registration_id             uuid not null references public.registrations(id) on delete cascade,
  provider                    text not null default 'square',
  provider_payment_intent_id  text,
  provider_checkout_session_id text,
  amount                      numeric(10,2) not null,
  currency                    text not null default 'USD',
  status                      text not null default 'pending'
                                check (status in ('pending','paid','failed','refunded')),
  paid_at                     timestamptz,
  refunded_at                 timestamptz,
  raw_payload_json            jsonb,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

-- ============================================================
-- 5) waivers
-- ============================================================
create table if not exists public.waivers (
  id                uuid primary key default gen_random_uuid(),
  registration_id   uuid not null unique references public.registrations(id) on delete cascade,
  waiver_version    text,
  accepted          boolean not null default false,
  accepted_at       timestamptz,
  ip_address        text,
  user_agent        text,
  signature_name    text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- 6) teams
-- ============================================================
create table if not exists public.teams (
  id                    uuid primary key default gen_random_uuid(),
  tournament_id         uuid not null references public.tournaments(id) on delete cascade,
  name                  text not null,
  seed                  int,
  coach_assignment_type text,
  coach_name            text,
  color                 text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ============================================================
-- 7) team_players
-- ============================================================
create table if not exists public.team_players (
  id                uuid primary key default gen_random_uuid(),
  tournament_id     uuid not null references public.tournaments(id) on delete cascade,
  team_id           uuid not null references public.teams(id) on delete cascade,
  registration_id   uuid not null unique references public.registrations(id) on delete cascade,
  draft_pick_number int,
  is_captain        boolean not null default false,
  is_locked         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- 8) fields
-- ============================================================
create table if not exists public.fields (
  id            uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  name          text not null,
  sort_order    int not null default 0,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- 9) games
-- ============================================================
create table if not exists public.games (
  id               uuid primary key default gen_random_uuid(),
  tournament_id    uuid not null references public.tournaments(id) on delete cascade,
  game_type        text not null default 'pool'
                     check (game_type in ('pool','bracket','championship','consolation')),
  round_name       text,
  game_number      int,
  field_id         uuid references public.fields(id) on delete set null,
  home_team_id     uuid references public.teams(id) on delete set null,
  away_team_id     uuid references public.teams(id) on delete set null,
  winner_team_id   uuid references public.teams(id) on delete set null,
  loser_team_id    uuid references public.teams(id) on delete set null,
  start_time       timestamptz,
  end_time         timestamptz,
  home_score       int,
  away_score       int,
  status           text not null default 'scheduled'
                     check (status in ('scheduled','in_progress','final','cancelled','forfeit')),
  bracket_position text,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ============================================================
-- 10) admins
-- ============================================================
create table if not exists public.admins (
  id          uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,  -- links to Supabase auth.users if using auth
  first_name  text not null,
  last_name   text not null,
  email       text not null unique,
  phone       text,
  role        text not null default 'admin'
                check (role in ('super_admin','admin','scorekeeper','check_in','viewer')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- 11) tournament_admins
-- ============================================================
create table if not exists public.tournament_admins (
  id               uuid primary key default gen_random_uuid(),
  tournament_id    uuid not null references public.tournaments(id) on delete cascade,
  admin_id         uuid not null references public.admins(id) on delete cascade,
  permission_level text not null default 'admin'
                     check (permission_level in ('owner','admin','scorekeeper','viewer')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (tournament_id, admin_id)
);

-- ============================================================
-- 12) announcements
-- ============================================================
create table if not exists public.announcements (
  id                  uuid primary key default gen_random_uuid(),
  tournament_id       uuid not null references public.tournaments(id) on delete cascade,
  title               text not null,
  body                text,
  audience            text not null default 'all'
                        check (audience in ('all','players','coaches','admins')),
  published_at        timestamptz,
  created_by_admin_id uuid references public.admins(id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ============================================================
-- 13) score_audit_log
-- ============================================================
create table if not exists public.score_audit_log (
  id                   uuid primary key default gen_random_uuid(),
  game_id              uuid not null references public.games(id) on delete cascade,
  changed_by_admin_id  uuid references public.admins(id) on delete set null,
  previous_home_score  int,
  previous_away_score  int,
  new_home_score       int,
  new_away_score       int,
  change_reason        text,
  created_at           timestamptz not null default now()
);

-- ============================================================
-- Indexes for common queries
-- ============================================================
create index if not exists idx_registrations_tournament on public.registrations(tournament_id);
create index if not exists idx_registrations_player on public.registrations(player_id);
create index if not exists idx_team_players_team on public.team_players(team_id);
create index if not exists idx_team_players_tournament on public.team_players(tournament_id);
create index if not exists idx_games_tournament on public.games(tournament_id);
create index if not exists idx_games_field on public.games(field_id);
create index if not exists idx_games_status on public.games(status);
create index if not exists idx_payments_registration on public.payments(registration_id);
create index if not exists idx_announcements_tournament on public.announcements(tournament_id);
create index if not exists idx_score_audit_game on public.score_audit_log(game_id);
create index if not exists idx_players_email on public.players(email);

-- ============================================================
-- Auto-update updated_at triggers
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply to all tables with updated_at
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'tournaments','players','registrations','payments','waivers',
    'teams','team_players','fields','games','admins','tournament_admins','announcements'
  ]
  loop
    execute format(
      'create or replace trigger trg_%s_updated_at
         before update on public.%I
         for each row execute function public.set_updated_at()',
      tbl, tbl
    );
  end loop;
end;
$$;

-- ============================================================
-- Row Level Security (RLS) — enable on all tables
-- Policies should be customized per your auth setup.
-- For now, the service role key bypasses RLS.
-- ============================================================
alter table public.tournaments enable row level security;
alter table public.players enable row level security;
alter table public.registrations enable row level security;
alter table public.payments enable row level security;
alter table public.waivers enable row level security;
alter table public.teams enable row level security;
alter table public.team_players enable row level security;
alter table public.fields enable row level security;
alter table public.games enable row level security;
alter table public.admins enable row level security;
alter table public.tournament_admins enable row level security;
alter table public.announcements enable row level security;
alter table public.score_audit_log enable row level security;

-- Public read access for published tournament data
create policy "Public can view open tournaments"
  on public.tournaments for select
  using (status in ('open','closed','completed'));

create policy "Public can view teams"
  on public.teams for select using (true);

create policy "Public can view games"
  on public.games for select using (true);

create policy "Public can view fields"
  on public.fields for select using (true);

create policy "Public can view published announcements"
  on public.announcements for select
  using (published_at is not null);

-- Admin full access (via service role) is automatic.
-- Add auth-based admin policies as needed.

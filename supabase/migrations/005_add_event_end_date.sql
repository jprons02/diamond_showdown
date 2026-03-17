alter table public.tournaments
  add column if not exists event_end_date date;

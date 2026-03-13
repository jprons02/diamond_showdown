-- Add min_players to tournaments table
alter table public.tournaments
  add column if not exists min_players int;

-- Add bracket_format to tournaments table
alter table public.tournaments
  add column if not exists bracket_format text
    check (bracket_format in (
      'single_elimination',
      'double_elimination',
      'pool_to_bracket',
      'custom'
    ));

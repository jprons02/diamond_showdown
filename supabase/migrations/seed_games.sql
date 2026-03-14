-- ============================================================
-- 8-Team Pool Play Seed — Diamond Showdown Spring Classic 2026
-- Tournament: e5821611-79b6-4349-ab23-56ee14f4d151
--
-- WHAT THIS DOES
-- 1. Adds 5 extra teams (to bring total to 8)
-- 2. Wipes all existing games for this tournament
-- 3. Inserts 12 pool play games (all final) — two groups of 4
-- 4. After running: go to Admin → Games & Scores and click
--    "Generate Bracket" to auto-seed & build QF/SF/Championship
--
-- BRACKET SHAPE (8 teams, no byes)
--   Quarterfinals (4 games) → Semifinals (2 games) → Championship
--   Seed 1 (Blue Jays)  vs Seed 8 (Red Hawks)
--   Seed 2 (Tigers)     vs Seed 7 (Grizzlies)
--   Seed 3 (Cardinals)  vs Seed 6 (Timber Wolves)
--   Seed 4 (Golden Eagles) vs Seed 5 (Falcons)
--
-- PROJECTED STANDINGS (wins → run diff → runs scored)
--   1. Blue Jays      3W-0L  RD +17
--   2. Tigers         3W-0L  RD +14
--   3. Cardinals      2W-1L  RD +12
--   4. Golden Eagles  2W-1L  RD  +5
--   5. Falcons        1W-2L  RD  -3
--   6. Timber Wolves  1W-2L  RD  -8
--   7. Grizzlies      0W-3L  RD -14
--   8. Red Hawks      0W-3L  RD -23
--
-- TO GET 4 COLUMNS (like /bracket page simulation):
--   Run seed_games_16teams.sql instead — needs 16 teams & ~24 games
-- ============================================================

-- ── 1. Add 5 extra teams ─────────────────────────────────────
insert into public.teams (id, tournament_id, name, color) values
  ('d4000001-0000-0000-0000-000000000004', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Timber Wolves',  '#22c55e'),
  ('d4000001-0000-0000-0000-000000000005', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Golden Eagles',  '#f59e0b'),
  ('d4000001-0000-0000-0000-000000000006', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Falcons',        '#8b5cf6'),
  ('d4000001-0000-0000-0000-000000000007', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Grizzlies',      '#6b7280'),
  ('d4000001-0000-0000-0000-000000000008', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Red Hawks',      '#ef4444')
on conflict do nothing;

-- ── 2. Wipe existing games ───────────────────────────────────
delete from public.games
where tournament_id = 'e5821611-79b6-4349-ab23-56ee14f4d151';

-- ── 3. Pool play games (all final) ───────────────────────────
--
-- Group A: Blue Jays (001), Timber Wolves (004), Golden Eagles (005), Grizzlies (007)
-- Group B: Cardinals (002), Tigers (003), Falcons (006), Red Hawks (008)
--
--   Each team plays the other 3 in their group (6 games per group = 12 total)

insert into public.games (
  id, tournament_id, game_type, round_name, game_number,
  field_id, home_team_id, away_team_id, winner_team_id, loser_team_id,
  start_time, home_score, away_score, status
) values

-- ── Group A · Round 1 (9:00 AM) ─────────────────────────────

-- G1: Blue Jays 11 vs Timber Wolves 3  →  Blue Jays win
( 'e5000001-0000-0000-0000-000000000001', 'e5821611-79b6-4349-ab23-56ee14f4d151',
  'pool', 'Pool Play', 1,
  'c3000001-0000-0000-0000-000000000001',
  'd4000001-0000-0000-0000-000000000001', 'd4000001-0000-0000-0000-000000000004',
  'd4000001-0000-0000-0000-000000000001', 'd4000001-0000-0000-0000-000000000004',
  '2026-04-18 09:00:00-05', 11, 3, 'final' ),

-- G2: Golden Eagles 8 vs Grizzlies 4  →  Golden Eagles win
( 'e5000001-0000-0000-0000-000000000002', 'e5821611-79b6-4349-ab23-56ee14f4d151',
  'pool', 'Pool Play', 2,
  'c3000001-0000-0000-0000-000000000002',
  'd4000001-0000-0000-0000-000000000005', 'd4000001-0000-0000-0000-000000000007',
  'd4000001-0000-0000-0000-000000000005', 'd4000001-0000-0000-0000-000000000007',
  '2026-04-18 09:00:00-05', 8, 4, 'final' ),

-- ── Group B · Round 1 (9:00 AM) ─────────────────────────────

-- G7: Cardinals 9 vs Falcons 3  →  Cardinals win
( 'e5000001-0000-0000-0000-000000000007', 'e5821611-79b6-4349-ab23-56ee14f4d151',
  'pool', 'Pool Play', 3,
  'c3000001-0000-0000-0000-000000000003',
  'd4000001-0000-0000-0000-000000000002', 'd4000001-0000-0000-0000-000000000006',
  'd4000001-0000-0000-0000-000000000002', 'd4000001-0000-0000-0000-000000000006',
  '2026-04-18 09:00:00-05', 9, 3, 'final' ),

-- G8: Tigers 12 vs Red Hawks 2  →  Tigers win
( 'e5000001-0000-0000-0000-000000000008', 'e5821611-79b6-4349-ab23-56ee14f4d151',
  'pool', 'Pool Play', 4,
  'c3000001-0000-0000-0000-000000000001',
  'd4000001-0000-0000-0000-000000000003', 'd4000001-0000-0000-0000-000000000008',
  'd4000001-0000-0000-0000-000000000003', 'd4000001-0000-0000-0000-000000000008',
  '2026-04-18 09:00:00-05', 12, 2, 'final' ),

-- ── Group A · Round 2 (11:00 AM) ────────────────────────────

-- G3: Blue Jays 7 vs Golden Eagles 5  →  Blue Jays win
( 'e5000001-0000-0000-0000-000000000003', 'e5821611-79b6-4349-ab23-56ee14f4d151',
  'pool', 'Pool Play', 5,
  'c3000001-0000-0000-0000-000000000001',
  'd4000001-0000-0000-0000-000000000001', 'd4000001-0000-0000-0000-000000000005',
  'd4000001-0000-0000-0000-000000000001', 'd4000001-0000-0000-0000-000000000005',
  '2026-04-18 11:00:00-05', 7, 5, 'final' ),

-- G4: Timber Wolves 8 vs Grizzlies 5  →  Timber Wolves win
( 'e5000001-0000-0000-0000-000000000004', 'e5821611-79b6-4349-ab23-56ee14f4d151',
  'pool', 'Pool Play', 6,
  'c3000001-0000-0000-0000-000000000002',
  'd4000001-0000-0000-0000-000000000004', 'd4000001-0000-0000-0000-000000000007',
  'd4000001-0000-0000-0000-000000000004', 'd4000001-0000-0000-0000-000000000007',
  '2026-04-18 11:00:00-05', 8, 5, 'final' ),

-- ── Group B · Round 2 (11:00 AM) ────────────────────────────

-- G9: Tigers 8 vs Cardinals 6  →  Tigers win
( 'e5000001-0000-0000-0000-000000000009', 'e5821611-79b6-4349-ab23-56ee14f4d151',
  'pool', 'Pool Play', 7,
  'c3000001-0000-0000-0000-000000000003',
  'd4000001-0000-0000-0000-000000000003', 'd4000001-0000-0000-0000-000000000002',
  'd4000001-0000-0000-0000-000000000003', 'd4000001-0000-0000-0000-000000000002',
  '2026-04-18 11:00:00-05', 8, 6, 'final' ),

-- G10: Falcons 9 vs Red Hawks 4  →  Falcons win
( 'e5000001-0000-0000-0000-000000000010', 'e5821611-79b6-4349-ab23-56ee14f4d151',
  'pool', 'Pool Play', 8,
  'c3000001-0000-0000-0000-000000000001',
  'd4000001-0000-0000-0000-000000000006', 'd4000001-0000-0000-0000-000000000008',
  'd4000001-0000-0000-0000-000000000006', 'd4000001-0000-0000-0000-000000000008',
  '2026-04-18 11:00:00-05', 9, 4, 'final' ),

-- ── Group A · Round 3 (1:00 PM) ─────────────────────────────

-- G5: Blue Jays 9 vs Grizzlies 2  →  Blue Jays win
( 'e5000001-0000-0000-0000-000000000005', 'e5821611-79b6-4349-ab23-56ee14f4d151',
  'pool', 'Pool Play', 9,
  'c3000001-0000-0000-0000-000000000001',
  'd4000001-0000-0000-0000-000000000001', 'd4000001-0000-0000-0000-000000000007',
  'd4000001-0000-0000-0000-000000000001', 'd4000001-0000-0000-0000-000000000007',
  '2026-04-18 13:00:00-05', 9, 2, 'final' ),

-- G6: Golden Eagles 7 vs Timber Wolves 4  →  Golden Eagles win
( 'e5000001-0000-0000-0000-000000000006', 'e5821611-79b6-4349-ab23-56ee14f4d151',
  'pool', 'Pool Play', 10,
  'c3000001-0000-0000-0000-000000000002',
  'd4000001-0000-0000-0000-000000000005', 'd4000001-0000-0000-0000-000000000004',
  'd4000001-0000-0000-0000-000000000005', 'd4000001-0000-0000-0000-000000000004',
  '2026-04-18 13:00:00-05', 7, 4, 'final' ),

-- ── Group B · Round 3 (1:00 PM) ─────────────────────────────

-- G11: Cardinals 11 vs Red Hawks 3  →  Cardinals win
( 'e5000001-0000-0000-0000-000000000011', 'e5821611-79b6-4349-ab23-56ee14f4d151',
  'pool', 'Pool Play', 11,
  'c3000001-0000-0000-0000-000000000003',
  'd4000001-0000-0000-0000-000000000002', 'd4000001-0000-0000-0000-000000000008',
  'd4000001-0000-0000-0000-000000000002', 'd4000001-0000-0000-0000-000000000008',
  '2026-04-18 13:00:00-05', 11, 3, 'final' ),

-- G12: Tigers 7 vs Falcons 5  →  Tigers win
( 'e5000001-0000-0000-0000-000000000012', 'e5821611-79b6-4349-ab23-56ee14f4d151',
  'pool', 'Pool Play', 12,
  'c3000001-0000-0000-0000-000000000001',
  'd4000001-0000-0000-0000-000000000003', 'd4000001-0000-0000-0000-000000000006',
  'd4000001-0000-0000-0000-000000000003', 'd4000001-0000-0000-0000-000000000006',
  '2026-04-18 13:00:00-05', 7, 5, 'final' );

-- Tournament: e5821611-79b6-4349-ab23-56ee14f4d151
--
-- Teams:
--   Blue Jays  → d4000001-0000-0000-0000-000000000001  (seed 1)
--   Cardinals  → d4000001-0000-0000-0000-000000000002  (seed 2)
--   Tigers     → d4000001-0000-0000-0000-000000000003  (seed 3)
--
-- Fields:
--   Diamond 1  → c3000001-0000-0000-0000-000000000001
--   Diamond 2  → c3000001-0000-0000-0000-000000000002
--   Diamond 3  → c3000001-0000-0000-0000-000000000003
--
-- Pool play round-robin results (all final):
--   Game 1 — Blue Jays   8  Cardinals 5   (Blue Jays win  +3 RD)
--   Game 2 — Cardinals   7  Tigers    4   (Cardinals win  +3 RD)
--   Game 3 — Blue Jays   6  Tigers    3   (Blue Jays win  +3 RD)
--
-- Standings after pool play:
--   1. Blue Jays   2-0  +6 RD  14 RS  → Seed #1 (bye in 4-team bracket)
--   2. Cardinals   1-1   0 RD  12 RS  → Seed #2
--   3. Tigers      0-2  -6 RD   7 RS  → Seed #3
--
-- After running this file, go to Admin → Games & Scores and
-- click "Generate Bracket" to auto-seed and build bracket games.
-- ============================================================

-- ── Wipe existing games for this tournament ─────────────────
delete from public.games
where tournament_id = 'e5821611-79b6-4349-ab23-56ee14f4d151';

-- ── Pool play (all final, with correct winner/loser) ─────────
insert into public.games (
  id,
  tournament_id,
  game_type,
  round_name,
  game_number,
  field_id,
  home_team_id,
  away_team_id,
  winner_team_id,
  loser_team_id,
  start_time,
  home_score,
  away_score,
  status
) values

  -- Game 1: Blue Jays (home) vs Cardinals — Blue Jays win 8-5
  (
    'e5000001-0000-0000-0000-000000000001',
    'e5821611-79b6-4349-ab23-56ee14f4d151',
    'pool',
    'Pool Play',
    1,
    'c3000001-0000-0000-0000-000000000001', -- Diamond 1
    'd4000001-0000-0000-0000-000000000001', -- Blue Jays
    'd4000001-0000-0000-0000-000000000002', -- Cardinals
    'd4000001-0000-0000-0000-000000000001', -- winner: Blue Jays
    'd4000001-0000-0000-0000-000000000002', -- loser:  Cardinals
    '2026-04-18 09:00:00-05',
    8, 5,
    'final'
  ),

  -- Game 2: Cardinals (home) vs Tigers — Cardinals win 7-4
  (
    'e5000001-0000-0000-0000-000000000002',
    'e5821611-79b6-4349-ab23-56ee14f4d151',
    'pool',
    'Pool Play',
    2,
    'c3000001-0000-0000-0000-000000000002', -- Diamond 2
    'd4000001-0000-0000-0000-000000000002', -- Cardinals
    'd4000001-0000-0000-0000-000000000003', -- Tigers
    'd4000001-0000-0000-0000-000000000002', -- winner: Cardinals
    'd4000001-0000-0000-0000-000000000003', -- loser:  Tigers
    '2026-04-18 09:00:00-05',
    7, 4,
    'final'
  ),

  -- Game 3: Blue Jays (home) vs Tigers — Blue Jays win 6-3
  (
    'e5000001-0000-0000-0000-000000000003',
    'e5821611-79b6-4349-ab23-56ee14f4d151',
    'pool',
    'Pool Play',
    3,
    'c3000001-0000-0000-0000-000000000003', -- Diamond 3
    'd4000001-0000-0000-0000-000000000001', -- Blue Jays
    'd4000001-0000-0000-0000-000000000003', -- Tigers
    'd4000001-0000-0000-0000-000000000001', -- winner: Blue Jays
    'd4000001-0000-0000-0000-000000000003', -- loser:  Tigers
    '2026-04-18 11:00:00-05',
    6, 3,
    'final'
  );

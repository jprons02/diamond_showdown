-- ============================================================
-- Mock seed data for tournament e5821611-79b6-4349-ab23-56ee14f4d151
-- Run this in Supabase SQL Editor (service role / unrestricted)
-- ============================================================

-- Update the tournament to have full details
update public.tournaments set
  name             = 'Diamond Showdown Spring Classic 2026',
  slug             = 'spring-classic-2026',
  event_date       = '2026-04-18',
  location_name    = 'Riverside Sports Complex',
  location_address = '4200 Riverside Dr, Orlando, FL 32806',
  registration_open  = '2026-03-01 08:00:00-05',
  registration_close = '2026-04-10 23:59:00-05',
  draft_datetime     = '2026-04-12 14:00:00-05',
  min_players      = 70,
  max_players      = 100,
  entry_fee        = 65.00,
  status           = 'open',
  standings_visible  = true,
  scores_live        = true,
  rules_text       = '7-inning games, 10-run mercy after 5 innings, no leadoffs, arc pitch required.'
where id = 'e5821611-79b6-4349-ab23-56ee14f4d151';

-- ============================================================
-- PLAYERS (21 players — 3 teams of 7)
-- ============================================================
insert into public.players (id, first_name, last_name, email, phone, city, state, skill_rating, preferred_position, throws, bats, shirt_size) values
  ('a1000001-0000-0000-0000-000000000001', 'Marcus',   'Rivera',    'marcus.rivera@email.com',    '407-555-0101', 'Orlando',   'FL', 8, 'Shortstop',    'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000002', 'Derek',    'Thompson',  'derek.thompson@email.com',   '407-555-0102', 'Orlando',   'FL', 7, 'First Base',   'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000003', 'James',    'Mitchell',  'james.mitchell@email.com',   '407-555-0103', 'Kissimmee', 'FL', 9, 'Pitcher',      'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000004', 'Carlos',   'Mendez',    'carlos.mendez@email.com',    '407-555-0104', 'Orlando',   'FL', 6, 'Left Field',   'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000005', 'Tyler',    'Brooks',    'tyler.brooks@email.com',     '407-555-0105', 'Sanford',   'FL', 7, 'Third Base',   'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000006', 'Anthony',  'Moore',     'anthony.moore@email.com',    '407-555-0106', 'Orlando',   'FL', 8, 'Catcher',      'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000007', 'Kevin',    'Harris',    'kevin.harris@email.com',     '407-555-0107', 'Oviedo',    'FL', 6, 'Right Field',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000008', 'Jason',    'Carter',    'jason.carter@email.com',     '321-555-0108', 'Orlando',   'FL', 7, 'Second Base',  'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000009', 'Brandon',  'Lee',       'brandon.lee@email.com',      '321-555-0109', 'Winter Park','FL', 9, 'Shortstop',   'Right', 'Both',  'M'),
  ('a1000001-0000-0000-0000-000000000010', 'Mike',     'Johnson',   'mike.johnson@email.com',     '321-555-0110', 'Orlando',   'FL', 6, 'Left Center',  'Left',  'Left',  'XXL'),
  ('a1000001-0000-0000-0000-000000000011', 'Chris',    'Williams',  'chris.williams@email.com',   '321-555-0111', 'Maitland',  'FL', 8, 'First Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000012', 'David',    'Wilson',    'david.wilson@email.com',     '321-555-0112', 'Longwood',  'FL', 7, 'Right Center', 'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000013', 'Ryan',     'Taylor',    'ryan.taylor@email.com',      '321-555-0113', 'Ocoee',     'FL', 8, 'Third Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000014', 'Jordan',   'Anderson',  'jordan.anderson@email.com',  '321-555-0114', 'Orlando',   'FL', 7, 'Catcher',      'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000015', 'Nathan',   'Thomas',    'nathan.thomas@email.com',    '321-555-0115', 'Apopka',    'FL', 6, 'Left Field',   'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000016', 'Eric',     'Jackson',   'eric.jackson@email.com',     '386-555-0116', 'Deltona',   'FL', 9, 'Pitcher',      'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000017', 'Matt',     'White',     'matt.white@email.com',       '386-555-0117', 'Deland',    'FL', 7, 'Second Base',  'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000018', 'Andrew',   'Martin',    'andrew.martin@email.com',    '386-555-0118', 'Sanford',   'FL', 8, 'Shortstop',    'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000019', 'Josh',     'Garcia',    'josh.garcia@email.com',      '386-555-0119', 'Orlando',   'FL', 6, 'Right Field',  'Left',  'Left',  'M'),
  ('a1000001-0000-0000-0000-000000000020', 'Steven',   'Martinez',  'steven.martinez@email.com',  '386-555-0120', 'Kissimmee', 'FL', 7, 'Left Center',  'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000021', 'Daniel',   'Robinson',  'daniel.robinson@email.com',  '386-555-0121', 'Orlando',   'FL', 8, 'First Base',   'Right', 'Right', 'XL')
on conflict (email) do nothing;

-- ============================================================
-- REGISTRATIONS
-- ============================================================
insert into public.registrations (id, tournament_id, player_id, registration_status, payment_status, paid_amount, draft_eligible, check_in_status) values
  ('b2000001-0000-0000-0000-000000000001', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000001', 'confirmed', 'paid',   65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000002', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000002', 'confirmed', 'paid',   65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000003', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000003', 'confirmed', 'paid',   65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000004', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000004', 'confirmed', 'paid',   65.00, true, 'not_arrived'),
  ('b2000001-0000-0000-0000-000000000005', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000005', 'confirmed', 'paid',   65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000006', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000006', 'confirmed', 'paid',   65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000007', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000007', 'confirmed', 'paid',   65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000008', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000008', 'confirmed', 'paid',   65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000009', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000009', 'confirmed', 'paid',   65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000010', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000010', 'confirmed', 'paid',   65.00, true, 'not_arrived'),
  ('b2000001-0000-0000-0000-000000000011', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000011', 'confirmed', 'paid',   65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000012', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000012', 'confirmed', 'paid',   65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000013', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000013', 'confirmed', 'paid',   65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000014', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000014', 'confirmed', 'paid',   65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000015', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000015', 'confirmed', 'paid',   65.00, true, 'not_arrived'),
  ('b2000001-0000-0000-0000-000000000016', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000016', 'confirmed', 'paid',   65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000017', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000017', 'confirmed', 'paid',   65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000018', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000018', 'confirmed', 'paid',   65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000019', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000019', 'pending',   'unpaid', null,  true, null),
  ('b2000001-0000-0000-0000-000000000020', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000020', 'pending',   'unpaid', null,  true, null),
  ('b2000001-0000-0000-0000-000000000021', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000021', 'waitlisted','pending', null,  true, null)
on conflict (tournament_id, player_id) do nothing;

-- ============================================================
-- WAIVERS (for confirmed/paid players)
-- ============================================================
insert into public.waivers (registration_id, waiver_version, accepted, accepted_at, signature_name) values
  ('b2000001-0000-0000-0000-000000000001', 'v1.0', true, '2026-03-05 10:00:00-05', 'Marcus Rivera'),
  ('b2000001-0000-0000-0000-000000000002', 'v1.0', true, '2026-03-06 11:30:00-05', 'Derek Thompson'),
  ('b2000001-0000-0000-0000-000000000003', 'v1.0', true, '2026-03-06 14:00:00-05', 'James Mitchell'),
  ('b2000001-0000-0000-0000-000000000004', 'v1.0', true, '2026-03-07 09:15:00-05', 'Carlos Mendez'),
  ('b2000001-0000-0000-0000-000000000005', 'v1.0', true, '2026-03-08 16:00:00-05', 'Tyler Brooks'),
  ('b2000001-0000-0000-0000-000000000006', 'v1.0', true, '2026-03-09 10:45:00-05', 'Anthony Moore'),
  ('b2000001-0000-0000-0000-000000000007', 'v1.0', false, null, null),
  ('b2000001-0000-0000-0000-000000000008', 'v1.0', true, '2026-03-10 12:00:00-05', 'Jason Carter'),
  ('b2000001-0000-0000-0000-000000000009', 'v1.0', true, '2026-03-10 13:30:00-05', 'Brandon Lee'),
  ('b2000001-0000-0000-0000-000000000010', 'v1.0', true, '2026-03-11 08:00:00-05', 'Mike Johnson'),
  ('b2000001-0000-0000-0000-000000000011', 'v1.0', true, '2026-03-11 09:00:00-05', 'Chris Williams'),
  ('b2000001-0000-0000-0000-000000000012', 'v1.0', true, '2026-03-11 10:00:00-05', 'David Wilson'),
  ('b2000001-0000-0000-0000-000000000013', 'v1.0', true, '2026-03-11 11:00:00-05', 'Ryan Taylor'),
  ('b2000001-0000-0000-0000-000000000014', 'v1.0', false, null, null),
  ('b2000001-0000-0000-0000-000000000015', 'v1.0', true, '2026-03-12 09:00:00-05', 'Nathan Thomas'),
  ('b2000001-0000-0000-0000-000000000016', 'v1.0', true, '2026-03-12 10:00:00-05', 'Eric Jackson'),
  ('b2000001-0000-0000-0000-000000000017', 'v1.0', true, '2026-03-12 10:30:00-05', 'Matt White'),
  ('b2000001-0000-0000-0000-000000000018', 'v1.0', true, '2026-03-12 11:00:00-05', 'Andrew Martin')
on conflict (registration_id) do nothing;

-- ============================================================
-- FIELDS
-- ============================================================
insert into public.fields (id, tournament_id, name, sort_order, notes) values
  ('c3000001-0000-0000-0000-000000000001', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Diamond 1', 1, 'Main field — championship games'),
  ('c3000001-0000-0000-0000-000000000002', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Diamond 2', 2, null),
  ('c3000001-0000-0000-0000-000000000003', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Diamond 3', 3, 'Behind the concession stand')
on conflict do nothing;

-- ============================================================
-- TEAMS
-- ============================================================
insert into public.teams (id, tournament_id, name, seed, color, coach_name) values
  ('d4000001-0000-0000-0000-000000000001', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Blue Jays',  1, '#1D9BF0', 'Coach Rivera'),
  ('d4000001-0000-0000-0000-000000000002', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Cardinals',  2, '#E03131', 'Coach Carter'),
  ('d4000001-0000-0000-0000-000000000003', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Tigers',     3, '#F08C00', 'Coach Jackson')
on conflict do nothing;

-- ============================================================
-- TEAM PLAYERS
-- Player 1–7  → Blue Jays
-- Player 8–14 → Cardinals
-- Player 15–21 → Tigers
-- ============================================================
insert into public.team_players (tournament_id, team_id, registration_id, draft_pick_number, is_captain) values
  -- Blue Jays
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000001', 1,  true),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000002', 4,  false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000003', 7,  false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000004', 10, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000005', 13, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000006', 16, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000007', 19, false),
  -- Cardinals
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000008', 2,  true),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000009', 5,  false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000010', 8,  false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000011', 11, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000012', 14, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000013', 17, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000014', 20, false),
  -- Tigers
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000015', 3,  true),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000016', 6,  false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000017', 9,  false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000018', 12, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000019', 15, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000020', 18, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000021', 21, false)
on conflict (registration_id) do nothing;

-- ============================================================
-- GAMES (pool play round-robin + bracket)
-- ============================================================
insert into public.games (id, tournament_id, game_type, round_name, game_number, field_id, home_team_id, away_team_id, winner_team_id, loser_team_id, start_time, home_score, away_score, status) values
  -- Pool play
  ('e5000001-0000-0000-0000-000000000001', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'pool', 'Pool Play', 1,
    'c3000001-0000-0000-0000-000000000001',
    'd4000001-0000-0000-0000-000000000001', -- Blue Jays (home)
    'd4000001-0000-0000-0000-000000000002', -- Cardinals (away)
    'd4000001-0000-0000-0000-000000000001', -- Blue Jays won
    'd4000001-0000-0000-0000-000000000002',
    '2026-04-18 09:00:00-05', 8, 5, 'final'),

  ('e5000001-0000-0000-0000-000000000002', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'pool', 'Pool Play', 2,
    'c3000001-0000-0000-0000-000000000002',
    'd4000001-0000-0000-0000-000000000003', -- Tigers (home)
    'd4000001-0000-0000-0000-000000000002', -- Cardinals (away)
    'd4000001-0000-0000-0000-000000000002', -- Cardinals won
    'd4000001-0000-0000-0000-000000000003',
    '2026-04-18 09:00:00-05', 4, 7, 'final'),

  ('e5000001-0000-0000-0000-000000000003', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'pool', 'Pool Play', 3,
    'c3000001-0000-0000-0000-000000000001',
    'd4000001-0000-0000-0000-000000000001', -- Blue Jays (home)
    'd4000001-0000-0000-0000-000000000003', -- Tigers (away)
    null, null,
    '2026-04-18 11:00:00-05', 3, 3, 'in_progress'),

  -- Bracket
  ('e5000001-0000-0000-0000-000000000004', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'bracket', 'Semifinals', 4,
    'c3000001-0000-0000-0000-000000000001',
    null, null, null, null,
    '2026-04-18 13:00:00-05', null, null, 'scheduled'),

  ('e5000001-0000-0000-0000-000000000005', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'championship', 'Championship', 5,
    'c3000001-0000-0000-0000-000000000001',
    null, null, null, null,
    '2026-04-18 15:30:00-05', null, null, 'scheduled')
on conflict do nothing;

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
insert into public.announcements (tournament_id, title, body, audience, published_at) values
  ('e5821611-79b6-4349-ab23-56ee14f4d151',
    'Welcome to Spring Classic 2026!',
    'We are excited to have you all here today! Check-in is open at the main tent near Diamond 1. Please have your ID ready. Good luck to all teams!',
    'all',
    '2026-04-18 07:30:00-05'),
  ('e5821611-79b6-4349-ab23-56ee14f4d151',
    'Game 3 Delay — Diamond 1',
    'Game 3 on Diamond 1 has been delayed by 20 minutes due to field prep. New start time is 11:20 AM. All other games remain on schedule.',
    'all',
    '2026-04-18 10:45:00-05'),
  ('e5821611-79b6-4349-ab23-56ee14f4d151',
    'Bracket Posted After Pool Play',
    'The semifinals bracket will be posted at the main tent and on this site as soon as all pool play games are final. Estimated bracket start: 1:00 PM.',
    'all',
    '2026-04-18 10:00:00-05')
on conflict do nothing;

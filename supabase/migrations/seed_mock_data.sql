-- ============================================================
-- FULL MOCK DATA — Diamond Showdown Spring Classic 2026
-- Tournament: e5821611-79b6-4349-ab23-56ee14f4d151
-- Run this in Supabase SQL Editor (service role / unrestricted)
--
-- WHAT THIS CREATES:
--   • 1 Tournament (upsert)
--   • 100 Players
--   • 100 Registrations (all confirmed / paid)
--   • 100 Waivers (95 accepted, 5 pending)
--   • 5 Fields (Diamond 1–5)
--   • 10 Teams of 10 players each (snake draft)
--   • 100 Team-player assignments
--   • 20 Pool Play games (all final) — 2 pools of 5
--   • 4 Announcements
--
-- POOLS & SCHEDULE (round-robin within each pool):
--   Pool A: Blue Jays, Cardinals, Tigers, Timber Wolves, Golden Eagles
--   Pool B: Falcons, Grizzlies, Red Hawks, Mustangs, Panthers
--   5 time-slots × 4 games each = 20 games, all final
--
-- STANDINGS AFTER POOL PLAY:
--   Pool A                        Pool B
--   1. Blue Jays      4-0  +21   1. Falcons      4-0  +20
--   2. Cardinals       3-1  +11   2. Grizzlies    3-1   +7
--   3. Tigers          2-2   -3   3. Red Hawks    2-2   -2
--   4. Timber Wolves   1-3  -15   4. Mustangs     1-3   -8
--   5. Golden Eagles   0-4  -14   5. Panthers     0-4  -17
--
-- After running: go to Admin → Games & Scores and click
-- "Generate Bracket" to auto-seed & build QF/SF/Championship.
-- ============================================================

-- ── 0. CLEAN SLATE ──────────────────────────────────────────
-- Delete all data for this tournament so the file is idempotent.
delete from public.score_audit_log
  where game_id in (select id from public.games where tournament_id = 'e5821611-79b6-4349-ab23-56ee14f4d151');
delete from public.games
  where tournament_id = 'e5821611-79b6-4349-ab23-56ee14f4d151';
delete from public.team_players
  where tournament_id = 'e5821611-79b6-4349-ab23-56ee14f4d151';
delete from public.announcements
  where tournament_id = 'e5821611-79b6-4349-ab23-56ee14f4d151';
delete from public.waivers
  where registration_id in (select id from public.registrations where tournament_id = 'e5821611-79b6-4349-ab23-56ee14f4d151');
delete from public.payments
  where registration_id in (select id from public.registrations where tournament_id = 'e5821611-79b6-4349-ab23-56ee14f4d151');
delete from public.registrations
  where tournament_id = 'e5821611-79b6-4349-ab23-56ee14f4d151';
delete from public.teams
  where tournament_id = 'e5821611-79b6-4349-ab23-56ee14f4d151';
delete from public.fields
  where tournament_id = 'e5821611-79b6-4349-ab23-56ee14f4d151';

-- ── 1. TOURNAMENT ───────────────────────────────────────────
insert into public.tournaments (
  id, name, slug, event_date, location_name, location_address,
  registration_open, registration_close, draft_datetime,
  min_players, max_players, entry_fee, status, bracket_format,
  standings_visible, bracket_published, scores_live, rules_text
) values (
  'e5821611-79b6-4349-ab23-56ee14f4d151',
  'Diamond Showdown Spring Classic 2026',
  'spring-classic-2026',
  '2026-04-18',
  'Riverside Sports Complex',
  '4200 Riverside Dr, Orlando, FL 32806',
  '2026-03-01 08:00:00-05',
  '2026-04-10 23:59:00-05',
  '2026-04-12 14:00:00-05',
  70, 100, 65.00,
  'open',
  'pool_to_bracket',
  true, false, true,
  '7-inning games, 10-run mercy after 5 innings, no leadoffs, arc pitch required.'
) on conflict (id) do update set
  name               = excluded.name,
  slug               = excluded.slug,
  event_date         = excluded.event_date,
  location_name      = excluded.location_name,
  location_address   = excluded.location_address,
  registration_open  = excluded.registration_open,
  registration_close = excluded.registration_close,
  draft_datetime     = excluded.draft_datetime,
  min_players        = excluded.min_players,
  max_players        = excluded.max_players,
  entry_fee          = excluded.entry_fee,
  status             = excluded.status,
  bracket_format     = excluded.bracket_format,
  standings_visible  = excluded.standings_visible,
  bracket_published  = excluded.bracket_published,
  scores_live        = excluded.scores_live,
  rules_text         = excluded.rules_text;

-- ============================================================
-- 2. PLAYERS (100)
-- ============================================================
insert into public.players (id, first_name, last_name, email, phone, city, state, skill_rating, preferred_position, throws, bats, shirt_size) values
  -- 1–10
  ('a1000001-0000-0000-0000-000000000001', 'Marcus',    'Rivera',      'marcus.rivera@email.com',      '407-555-0101', 'Orlando',          'FL', 8,  'Shortstop',    'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000002', 'Derek',     'Thompson',    'derek.thompson@email.com',     '407-555-0102', 'Orlando',          'FL', 7,  'First Base',   'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000003', 'James',     'Mitchell',    'james.mitchell@email.com',     '407-555-0103', 'Kissimmee',        'FL', 9,  'Pitcher',      'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000004', 'Carlos',    'Mendez',      'carlos.mendez@email.com',      '407-555-0104', 'Orlando',          'FL', 6,  'Left Field',   'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000005', 'Tyler',     'Brooks',      'tyler.brooks@email.com',       '407-555-0105', 'Sanford',          'FL', 7,  'Third Base',   'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000006', 'Anthony',   'Moore',       'anthony.moore@email.com',      '407-555-0106', 'Orlando',          'FL', 8,  'Catcher',      'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000007', 'Kevin',     'Harris',      'kevin.harris@email.com',       '407-555-0107', 'Oviedo',           'FL', 6,  'Right Field',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000008', 'Jason',     'Carter',      'jason.carter@email.com',       '321-555-0108', 'Orlando',          'FL', 7,  'Second Base',  'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000009', 'Brandon',   'Lee',         'brandon.lee@email.com',        '321-555-0109', 'Winter Park',      'FL', 9,  'Shortstop',    'Right', 'Both',  'M'),
  ('a1000001-0000-0000-0000-000000000010', 'Mike',      'Johnson',     'mike.johnson@email.com',       '321-555-0110', 'Orlando',          'FL', 6,  'Left Center',  'Left',  'Left',  'XXL'),
  -- 11–20
  ('a1000001-0000-0000-0000-000000000011', 'Chris',     'Williams',    'chris.williams@email.com',     '321-555-0111', 'Maitland',         'FL', 8,  'First Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000012', 'David',     'Wilson',      'david.wilson@email.com',       '321-555-0112', 'Longwood',         'FL', 7,  'Right Center', 'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000013', 'Ryan',      'Taylor',      'ryan.taylor@email.com',        '321-555-0113', 'Ocoee',            'FL', 8,  'Third Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000014', 'Jordan',    'Anderson',    'jordan.anderson@email.com',    '321-555-0114', 'Orlando',          'FL', 7,  'Catcher',      'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000015', 'Nathan',    'Thomas',      'nathan.thomas@email.com',      '321-555-0115', 'Apopka',           'FL', 6,  'Left Field',   'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000016', 'Eric',      'Jackson',     'eric.jackson@email.com',       '386-555-0116', 'Deltona',          'FL', 9,  'Pitcher',      'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000017', 'Matt',      'White',       'matt.white@email.com',         '386-555-0117', 'Deland',           'FL', 7,  'Second Base',  'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000018', 'Andrew',    'Martin',      'andrew.martin@email.com',      '386-555-0118', 'Sanford',          'FL', 8,  'Shortstop',    'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000019', 'Josh',      'Garcia',      'josh.garcia@email.com',        '386-555-0119', 'Orlando',          'FL', 6,  'Right Field',  'Left',  'Left',  'M'),
  ('a1000001-0000-0000-0000-000000000020', 'Steven',    'Martinez',    'steven.martinez@email.com',    '386-555-0120', 'Kissimmee',        'FL', 7,  'Left Center',  'Right', 'Right', 'L'),
  -- 21–30
  ('a1000001-0000-0000-0000-000000000021', 'Daniel',    'Robinson',    'daniel.robinson@email.com',    '386-555-0121', 'Orlando',          'FL', 8,  'First Base',   'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000022', 'Alex',      'Reyes',       'alex.reyes@email.com',         '407-555-0122', 'Winter Park',      'FL', 7,  'Pitcher',      'Left',  'Left',  'M'),
  ('a1000001-0000-0000-0000-000000000023', 'Brian',     'Foster',      'brian.foster@email.com',       '407-555-0123', 'Clermont',         'FL', 6,  'Catcher',      'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000024', 'Corey',     'Sanders',     'corey.sanders@email.com',      '407-555-0124', 'Lake Mary',        'FL', 7,  'Third Base',   'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000025', 'Dustin',    'Palmer',      'dustin.palmer@email.com',      '407-555-0125', 'Orlando',          'FL', 8,  'Left Field',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000026', 'Ethan',     'Cooper',      'ethan.cooper@email.com',       '407-555-0126', 'Altamonte Springs','FL', 6,  'Second Base',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000027', 'Frank',     'Morales',     'frank.morales@email.com',      '407-555-0127', 'Casselberry',      'FL', 7,  'Right Field',  'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000028', 'Greg',      'Nguyen',      'greg.nguyen@email.com',        '407-555-0128', 'Orlando',          'FL', 8,  'Shortstop',    'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000029', 'Hector',    'Ramirez',     'hector.ramirez@email.com',     '407-555-0129', 'Winter Springs',   'FL', 7,  'Left Center',  'Right', 'Both',  'L'),
  ('a1000001-0000-0000-0000-000000000030', 'Ian',       'Scott',       'ian.scott@email.com',          '407-555-0130', 'Winter Garden',    'FL', 6,  'Right Center', 'Right', 'Right', 'XL'),
  -- 31–40
  ('a1000001-0000-0000-0000-000000000031', 'Jake',      'Patterson',   'jake.patterson@email.com',     '321-555-0131', 'Windermere',       'FL', 8,  'Pitcher',      'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000032', 'Kyle',      'Bennett',     'kyle.bennett@email.com',       '321-555-0132', 'St. Cloud',        'FL', 7,  'First Base',   'Left',  'Left',  'M'),
  ('a1000001-0000-0000-0000-000000000033', 'Leo',       'Vasquez',     'leo.vasquez@email.com',        '321-555-0133', 'Orlando',          'FL', 6,  'Catcher',      'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000034', 'Manuel',    'Ortiz',       'manuel.ortiz@email.com',       '321-555-0134', 'Kissimmee',        'FL', 8,  'Third Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000035', 'Nick',      'Campbell',    'nick.campbell@email.com',      '321-555-0135', 'Sanford',          'FL', 7,  'Second Base',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000036', 'Omar',      'Diaz',        'omar.diaz@email.com',          '321-555-0136', 'Oviedo',           'FL', 6,  'Left Field',   'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000037', 'Patrick',   'Sullivan',    'patrick.sullivan@email.com',   '321-555-0137', 'Maitland',         'FL', 7,  'Right Field',  'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000038', 'Quincy',    'Adams',       'quincy.adams@email.com',       '321-555-0138', 'Orlando',          'FL', 8,  'Shortstop',    'Right', 'Both',  'M'),
  ('a1000001-0000-0000-0000-000000000039', 'Roberto',   'Cruz',        'roberto.cruz@email.com',       '321-555-0139', 'Longwood',         'FL', 7,  'Left Center',  'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000040', 'Sam',       'Griffin',     'sam.griffin@email.com',         '321-555-0140', 'Apopka',           'FL', 6,  'Right Center', 'Right', 'Right', 'XL'),
  -- 41–50
  ('a1000001-0000-0000-0000-000000000041', 'Tony',      'Delgado',     'tony.delgado@email.com',       '386-555-0141', 'Deltona',          'FL', 7,  'Pitcher',      'Left',  'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000042', 'Victor',    'Espinoza',    'victor.espinoza@email.com',    '386-555-0142', 'Deland',           'FL', 6,  'First Base',   'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000043', 'Wesley',    'King',        'wesley.king@email.com',        '386-555-0143', 'Daytona Beach',    'FL', 8,  'Catcher',      'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000044', 'Xavier',    'Torres',      'xavier.torres@email.com',      '386-555-0144', 'Orlando',          'FL', 7,  'Third Base',   'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000045', 'Yohan',     'Park',        'yohan.park@email.com',         '386-555-0145', 'Winter Park',      'FL', 6,  'Second Base',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000046', 'Zach',      'Morgan',      'zach.morgan@email.com',        '386-555-0146', 'Clermont',         'FL', 7,  'Left Field',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000047', 'Aaron',     'Phillips',    'aaron.phillips@email.com',     '386-555-0147', 'Lake Mary',        'FL', 8,  'Right Field',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000048', 'Ben',       'Walker',      'ben.walker@email.com',         '386-555-0148', 'Altamonte Springs','FL', 6,  'Shortstop',    'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000049', 'Calvin',    'Hayes',       'calvin.hayes@email.com',       '386-555-0149', 'Casselberry',      'FL', 7,  'Left Center',  'Right', 'Left',  'XL'),
  ('a1000001-0000-0000-0000-000000000050', 'Darnell',   'Washington',  'darnell.washington@email.com', '386-555-0150', 'Orlando',          'FL', 8,  'Right Center', 'Right', 'Right', 'L'),
  -- 51–60
  ('a1000001-0000-0000-0000-000000000051', 'Eli',       'Turner',      'eli.turner@email.com',         '407-555-0151', 'Winter Springs',   'FL', 8,  'Pitcher',      'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000052', 'Fernando',  'Lopez',       'fernando.lopez@email.com',     '407-555-0152', 'Winter Garden',    'FL', 7,  'First Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000053', 'Garrett',   'Price',       'garrett.price@email.com',      '407-555-0153', 'Windermere',       'FL', 6,  'Catcher',      'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000054', 'Hank',      'Morrison',    'hank.morrison@email.com',      '407-555-0154', 'St. Cloud',        'FL', 7,  'Third Base',   'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000055', 'Isaac',     'Flores',      'isaac.flores@email.com',       '407-555-0155', 'Orlando',          'FL', 8,  'Second Base',  'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000056', 'Jerome',    'Barnes',      'jerome.barnes@email.com',      '407-555-0156', 'Kissimmee',        'FL', 6,  'Left Field',   'Left',  'Left',  'M'),
  ('a1000001-0000-0000-0000-000000000057', 'Keith',     'Henderson',   'keith.henderson@email.com',    '407-555-0157', 'Sanford',          'FL', 7,  'Right Field',  'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000058', 'Liam',      'O''Brien',    'liam.obrien@email.com',        '407-555-0158', 'Oviedo',           'FL', 8,  'Shortstop',    'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000059', 'Mason',     'Hart',        'mason.hart@email.com',         '407-555-0159', 'Maitland',         'FL', 7,  'Left Center',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000060', 'Nolan',     'Reed',        'nolan.reed@email.com',         '407-555-0160', 'Orlando',          'FL', 6,  'Right Center', 'Right', 'Right', 'L'),
  -- 61–70
  ('a1000001-0000-0000-0000-000000000061', 'Oscar',     'Gutierrez',   'oscar.gutierrez@email.com',    '321-555-0161', 'Longwood',         'FL', 7,  'Pitcher',      'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000062', 'Pete',      'Russo',       'pete.russo@email.com',         '321-555-0162', 'Apopka',           'FL', 8,  'First Base',   'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000063', 'Reggie',    'Coleman',     'reggie.coleman@email.com',     '321-555-0163', 'Deltona',          'FL', 6,  'Catcher',      'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000064', 'Sean',      'Murphy',      'sean.murphy@email.com',        '321-555-0164', 'Deland',           'FL', 7,  'Third Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000065', 'Terrance',  'Bell',        'terrance.bell@email.com',      '321-555-0165', 'Daytona Beach',    'FL', 8,  'Second Base',  'Right', 'Both',  'M'),
  ('a1000001-0000-0000-0000-000000000066', 'Ulysses',   'Ward',        'ulysses.ward@email.com',       '321-555-0166', 'Orlando',          'FL', 6,  'Left Field',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000067', 'Vince',     'Romano',      'vince.romano@email.com',       '321-555-0167', 'Winter Park',      'FL', 7,  'Right Field',  'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000068', 'Wayne',     'Fischer',     'wayne.fischer@email.com',      '321-555-0168', 'Clermont',         'FL', 8,  'Shortstop',    'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000069', 'Bryce',     'Chapman',     'bryce.chapman@email.com',      '321-555-0169', 'Lake Mary',        'FL', 6,  'Left Center',  'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000070', 'Damien',    'Simmons',     'damien.simmons@email.com',     '321-555-0170', 'Altamonte Springs','FL', 7,  'Right Center', 'Right', 'Right', 'XL'),
  -- 71–80
  ('a1000001-0000-0000-0000-000000000071', 'Andre',     'Butler',      'andre.butler@email.com',       '386-555-0171', 'Casselberry',      'FL', 8,  'Pitcher',      'Left',  'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000072', 'Blake',     'Owens',       'blake.owens@email.com',        '386-555-0172', 'Winter Springs',   'FL', 7,  'First Base',   'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000073', 'Caleb',     'Stone',       'caleb.stone@email.com',        '386-555-0173', 'Winter Garden',    'FL', 6,  'Catcher',      'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000074', 'Dillon',    'Marsh',       'dillon.marsh@email.com',       '386-555-0174', 'Windermere',       'FL', 7,  'Third Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000075', 'Evan',      'Webb',        'evan.webb@email.com',          '386-555-0175', 'St. Cloud',        'FL', 8,  'Second Base',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000076', 'Felix',     'Santos',      'felix.santos@email.com',       '386-555-0176', 'Orlando',          'FL', 6,  'Left Field',   'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000077', 'Grant',     'Douglas',     'grant.douglas@email.com',      '386-555-0177', 'Kissimmee',        'FL', 7,  'Right Field',  'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000078', 'Hugo',      'Perez',       'hugo.perez@email.com',         '386-555-0178', 'Sanford',          'FL', 8,  'Shortstop',    'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000079', 'Isaiah',    'Brown',       'isaiah.brown@email.com',       '386-555-0179', 'Oviedo',           'FL', 7,  'Left Center',  'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000080', 'Jaylen',    'Ross',        'jaylen.ross@email.com',        '386-555-0180', 'Maitland',         'FL', 6,  'Right Center', 'Right', 'Right', 'XL'),
  -- 81–90
  ('a1000001-0000-0000-0000-000000000081', 'Kendrick',  'Long',        'kendrick.long@email.com',      '689-555-0181', 'Orlando',          'FL', 7,  'Pitcher',      'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000082', 'Lance',     'Hawkins',     'lance.hawkins@email.com',      '689-555-0182', 'Longwood',         'FL', 8,  'First Base',   'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000083', 'Miguel',    'Castillo',    'miguel.castillo@email.com',    '689-555-0183', 'Apopka',           'FL', 6,  'Catcher',      'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000084', 'Noah',      'Kim',         'noah.kim@email.com',           '689-555-0184', 'Deltona',          'FL', 7,  'Third Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000085', 'Owen',      'Fitzgerald',  'owen.fitzgerald@email.com',    '689-555-0185', 'Deland',           'FL', 8,  'Second Base',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000086', 'Preston',   'Cole',        'preston.cole@email.com',       '689-555-0186', 'Daytona Beach',    'FL', 6,  'Left Field',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000087', 'Ramon',     'Santiago',    'ramon.santiago@email.com',     '689-555-0187', 'Orlando',          'FL', 7,  'Right Field',  'Right', 'Both',  'XL'),
  ('a1000001-0000-0000-0000-000000000088', 'Shawn',     'Barrett',     'shawn.barrett@email.com',      '689-555-0188', 'Winter Park',      'FL', 8,  'Shortstop',    'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000089', 'Travis',    'Perry',       'travis.perry@email.com',       '689-555-0189', 'Clermont',         'FL', 7,  'Left Center',  'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000090', 'Uriel',     'Medina',      'uriel.medina@email.com',       '689-555-0190', 'Lake Mary',        'FL', 6,  'Right Center', 'Right', 'Right', 'XL'),
  -- 91–100
  ('a1000001-0000-0000-0000-000000000091', 'Wendell',   'Todd',        'wendell.todd@email.com',       '407-555-0191', 'Altamonte Springs','FL', 7,  'Pitcher',      'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000092', 'Xander',    'Drake',       'xander.drake@email.com',       '407-555-0192', 'Casselberry',      'FL', 8,  'First Base',   'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000093', 'Yusuf',     'Ali',         'yusuf.ali@email.com',          '407-555-0193', 'Winter Springs',   'FL', 6,  'Catcher',      'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000094', 'Zion',      'Maxwell',     'zion.maxwell@email.com',       '407-555-0194', 'Winter Garden',    'FL', 7,  'Third Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000095', 'Adrian',    'Wolfe',       'adrian.wolfe@email.com',       '407-555-0195', 'Windermere',       'FL', 8,  'Second Base',  'Left',  'Left',  'M'),
  ('a1000001-0000-0000-0000-000000000096', 'Brock',     'Lawson',      'brock.lawson@email.com',       '407-555-0196', 'St. Cloud',        'FL', 6,  'Left Field',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000097', 'Cedric',    'Hunt',        'cedric.hunt@email.com',        '407-555-0197', 'Orlando',          'FL', 7,  'Right Field',  'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000098', 'Dante',     'Powell',      'dante.powell@email.com',       '321-555-0198', 'Kissimmee',        'FL', 8,  'Shortstop',    'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000099', 'Emilio',    'Vargas',      'emilio.vargas@email.com',      '321-555-0199', 'Sanford',          'FL', 7,  'Left Center',  'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000100', 'Finn',      'Gallagher',   'finn.gallagher@email.com',     '321-555-0200', 'Oviedo',           'FL', 6,  'Right Center', 'Right', 'Right', 'XL')
on conflict (email) do nothing;

-- ============================================================
-- 3. REGISTRATIONS (100 — all confirmed / paid)
--    Players 1–88: checked_in   |   Players 89–100: not_arrived
-- ============================================================
insert into public.registrations (id, tournament_id, player_id, registration_status, payment_status, paid_amount, draft_eligible, check_in_status) values
  ('b2000001-0000-0000-0000-000000000001', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000001', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000002', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000002', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000003', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000003', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000004', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000004', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000005', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000005', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000006', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000006', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000007', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000007', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000008', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000008', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000009', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000009', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000010', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000010', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000011', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000011', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000012', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000012', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000013', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000013', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000014', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000014', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000015', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000015', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000016', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000016', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000017', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000017', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000018', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000018', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000019', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000019', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000020', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000020', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000021', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000021', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000022', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000022', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000023', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000023', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000024', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000024', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000025', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000025', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000026', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000026', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000027', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000027', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000028', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000028', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000029', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000029', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000030', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000030', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000031', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000031', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000032', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000032', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000033', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000033', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000034', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000034', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000035', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000035', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000036', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000036', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000037', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000037', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000038', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000038', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000039', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000039', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000040', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000040', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000041', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000041', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000042', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000042', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000043', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000043', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000044', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000044', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000045', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000045', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000046', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000046', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000047', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000047', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000048', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000048', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000049', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000049', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000050', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000050', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000051', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000051', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000052', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000052', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000053', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000053', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000054', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000054', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000055', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000055', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000056', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000056', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000057', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000057', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000058', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000058', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000059', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000059', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000060', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000060', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000061', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000061', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000062', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000062', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000063', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000063', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000064', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000064', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000065', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000065', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000066', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000066', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000067', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000067', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000068', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000068', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000069', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000069', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000070', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000070', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000071', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000071', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000072', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000072', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000073', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000073', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000074', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000074', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000075', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000075', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000076', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000076', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000077', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000077', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000078', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000078', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000079', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000079', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000080', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000080', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000081', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000081', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000082', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000082', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000083', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000083', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000084', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000084', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000085', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000085', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000086', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000086', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000087', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000087', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  ('b2000001-0000-0000-0000-000000000088', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000088', 'confirmed', 'paid', 65.00, true, 'checked_in'),
  -- Players 89–100: not yet arrived
  ('b2000001-0000-0000-0000-000000000089', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000089', 'confirmed', 'paid', 65.00, true, 'not_arrived'),
  ('b2000001-0000-0000-0000-000000000090', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000090', 'confirmed', 'paid', 65.00, true, 'not_arrived'),
  ('b2000001-0000-0000-0000-000000000091', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000091', 'confirmed', 'paid', 65.00, true, 'not_arrived'),
  ('b2000001-0000-0000-0000-000000000092', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000092', 'confirmed', 'paid', 65.00, true, 'not_arrived'),
  ('b2000001-0000-0000-0000-000000000093', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000093', 'confirmed', 'paid', 65.00, true, 'not_arrived'),
  ('b2000001-0000-0000-0000-000000000094', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000094', 'confirmed', 'paid', 65.00, true, 'not_arrived'),
  ('b2000001-0000-0000-0000-000000000095', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000095', 'confirmed', 'paid', 65.00, true, 'not_arrived'),
  ('b2000001-0000-0000-0000-000000000096', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000096', 'confirmed', 'paid', 65.00, true, 'not_arrived'),
  ('b2000001-0000-0000-0000-000000000097', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000097', 'confirmed', 'paid', 65.00, true, 'not_arrived'),
  ('b2000001-0000-0000-0000-000000000098', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000098', 'confirmed', 'paid', 65.00, true, 'not_arrived'),
  ('b2000001-0000-0000-0000-000000000099', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000099', 'confirmed', 'paid', 65.00, true, 'not_arrived'),
  ('b2000001-0000-0000-0000-000000000100', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'a1000001-0000-0000-0000-000000000100', 'confirmed', 'paid', 65.00, true, 'not_arrived')
on conflict (tournament_id, player_id) do nothing;

-- ============================================================
-- 4. WAIVERS (95 accepted, 5 pending)
-- ============================================================
insert into public.waivers (registration_id, waiver_version, accepted, accepted_at, signature_name) values
  ('b2000001-0000-0000-0000-000000000001', 'v1.0', true, '2026-03-05 10:00:00-05', 'Marcus Rivera'),
  ('b2000001-0000-0000-0000-000000000002', 'v1.0', true, '2026-03-05 11:15:00-05', 'Derek Thompson'),
  ('b2000001-0000-0000-0000-000000000003', 'v1.0', true, '2026-03-05 14:00:00-05', 'James Mitchell'),
  ('b2000001-0000-0000-0000-000000000004', 'v1.0', true, '2026-03-06 09:30:00-05', 'Carlos Mendez'),
  ('b2000001-0000-0000-0000-000000000005', 'v1.0', true, '2026-03-06 10:00:00-05', 'Tyler Brooks'),
  ('b2000001-0000-0000-0000-000000000006', 'v1.0', true, '2026-03-06 11:45:00-05', 'Anthony Moore'),
  ('b2000001-0000-0000-0000-000000000007', 'v1.0', true, '2026-03-06 14:00:00-05', 'Kevin Harris'),
  ('b2000001-0000-0000-0000-000000000008', 'v1.0', true, '2026-03-07 08:30:00-05', 'Jason Carter'),
  ('b2000001-0000-0000-0000-000000000009', 'v1.0', true, '2026-03-07 09:00:00-05', 'Brandon Lee'),
  ('b2000001-0000-0000-0000-000000000010', 'v1.0', true, '2026-03-07 10:15:00-05', 'Mike Johnson'),
  ('b2000001-0000-0000-0000-000000000011', 'v1.0', true, '2026-03-07 11:00:00-05', 'Chris Williams'),
  ('b2000001-0000-0000-0000-000000000012', 'v1.0', true, '2026-03-07 12:30:00-05', 'David Wilson'),
  ('b2000001-0000-0000-0000-000000000013', 'v1.0', true, '2026-03-07 14:00:00-05', 'Ryan Taylor'),
  ('b2000001-0000-0000-0000-000000000014', 'v1.0', true, '2026-03-08 08:00:00-05', 'Jordan Anderson'),
  ('b2000001-0000-0000-0000-000000000015', 'v1.0', true, '2026-03-08 09:00:00-05', 'Nathan Thomas'),
  ('b2000001-0000-0000-0000-000000000016', 'v1.0', true, '2026-03-08 10:30:00-05', 'Eric Jackson'),
  ('b2000001-0000-0000-0000-000000000017', 'v1.0', true, '2026-03-08 11:00:00-05', 'Matt White'),
  ('b2000001-0000-0000-0000-000000000018', 'v1.0', true, '2026-03-08 12:00:00-05', 'Andrew Martin'),
  ('b2000001-0000-0000-0000-000000000019', 'v1.0', true, '2026-03-08 14:30:00-05', 'Josh Garcia'),
  ('b2000001-0000-0000-0000-000000000020', 'v1.0', true, '2026-03-09 08:00:00-05', 'Steven Martinez'),
  ('b2000001-0000-0000-0000-000000000021', 'v1.0', true, '2026-03-09 09:00:00-05', 'Daniel Robinson'),
  ('b2000001-0000-0000-0000-000000000022', 'v1.0', true, '2026-03-09 10:00:00-05', 'Alex Reyes'),
  ('b2000001-0000-0000-0000-000000000023', 'v1.0', true, '2026-03-09 11:00:00-05', 'Brian Foster'),
  ('b2000001-0000-0000-0000-000000000024', 'v1.0', true, '2026-03-09 12:00:00-05', 'Corey Sanders'),
  ('b2000001-0000-0000-0000-000000000025', 'v1.0', true, '2026-03-09 14:00:00-05', 'Dustin Palmer'),
  ('b2000001-0000-0000-0000-000000000026', 'v1.0', true, '2026-03-10 08:00:00-05', 'Ethan Cooper'),
  ('b2000001-0000-0000-0000-000000000027', 'v1.0', true, '2026-03-10 08:30:00-05', 'Frank Morales'),
  ('b2000001-0000-0000-0000-000000000028', 'v1.0', true, '2026-03-10 09:00:00-05', 'Greg Nguyen'),
  ('b2000001-0000-0000-0000-000000000029', 'v1.0', true, '2026-03-10 09:30:00-05', 'Hector Ramirez'),
  ('b2000001-0000-0000-0000-000000000030', 'v1.0', true, '2026-03-10 10:00:00-05', 'Ian Scott'),
  ('b2000001-0000-0000-0000-000000000031', 'v1.0', true, '2026-03-10 10:30:00-05', 'Jake Patterson'),
  ('b2000001-0000-0000-0000-000000000032', 'v1.0', true, '2026-03-10 11:00:00-05', 'Kyle Bennett'),
  ('b2000001-0000-0000-0000-000000000033', 'v1.0', true, '2026-03-10 11:30:00-05', 'Leo Vasquez'),
  ('b2000001-0000-0000-0000-000000000034', 'v1.0', true, '2026-03-10 12:00:00-05', 'Manuel Ortiz'),
  ('b2000001-0000-0000-0000-000000000035', 'v1.0', true, '2026-03-10 14:00:00-05', 'Nick Campbell'),
  ('b2000001-0000-0000-0000-000000000036', 'v1.0', true, '2026-03-11 08:00:00-05', 'Omar Diaz'),
  ('b2000001-0000-0000-0000-000000000037', 'v1.0', true, '2026-03-11 08:30:00-05', 'Patrick Sullivan'),
  ('b2000001-0000-0000-0000-000000000038', 'v1.0', true, '2026-03-11 09:00:00-05', 'Quincy Adams'),
  ('b2000001-0000-0000-0000-000000000039', 'v1.0', true, '2026-03-11 09:30:00-05', 'Roberto Cruz'),
  ('b2000001-0000-0000-0000-000000000040', 'v1.0', true, '2026-03-11 10:00:00-05', 'Sam Griffin'),
  ('b2000001-0000-0000-0000-000000000041', 'v1.0', true, '2026-03-11 10:30:00-05', 'Tony Delgado'),
  ('b2000001-0000-0000-0000-000000000042', 'v1.0', true, '2026-03-11 11:00:00-05', 'Victor Espinoza'),
  ('b2000001-0000-0000-0000-000000000043', 'v1.0', true, '2026-03-11 11:30:00-05', 'Wesley King'),
  ('b2000001-0000-0000-0000-000000000044', 'v1.0', true, '2026-03-11 12:00:00-05', 'Xavier Torres'),
  ('b2000001-0000-0000-0000-000000000045', 'v1.0', true, '2026-03-11 14:00:00-05', 'Yohan Park'),
  ('b2000001-0000-0000-0000-000000000046', 'v1.0', true, '2026-03-12 08:00:00-05', 'Zach Morgan'),
  ('b2000001-0000-0000-0000-000000000047', 'v1.0', true, '2026-03-12 08:30:00-05', 'Aaron Phillips'),
  ('b2000001-0000-0000-0000-000000000048', 'v1.0', true, '2026-03-12 09:00:00-05', 'Ben Walker'),
  ('b2000001-0000-0000-0000-000000000049', 'v1.0', true, '2026-03-12 09:30:00-05', 'Calvin Hayes'),
  ('b2000001-0000-0000-0000-000000000050', 'v1.0', true, '2026-03-12 10:00:00-05', 'Darnell Washington'),
  ('b2000001-0000-0000-0000-000000000051', 'v1.0', true, '2026-03-12 10:30:00-05', 'Eli Turner'),
  ('b2000001-0000-0000-0000-000000000052', 'v1.0', true, '2026-03-12 11:00:00-05', 'Fernando Lopez'),
  ('b2000001-0000-0000-0000-000000000053', 'v1.0', true, '2026-03-12 11:30:00-05', 'Garrett Price'),
  ('b2000001-0000-0000-0000-000000000054', 'v1.0', true, '2026-03-12 12:00:00-05', 'Hank Morrison'),
  ('b2000001-0000-0000-0000-000000000055', 'v1.0', true, '2026-03-12 14:00:00-05', 'Isaac Flores'),
  ('b2000001-0000-0000-0000-000000000056', 'v1.0', true, '2026-03-13 08:00:00-05', 'Jerome Barnes'),
  ('b2000001-0000-0000-0000-000000000057', 'v1.0', true, '2026-03-13 08:30:00-05', 'Keith Henderson'),
  ('b2000001-0000-0000-0000-000000000058', 'v1.0', true, '2026-03-13 09:00:00-05', 'Liam O''Brien'),
  ('b2000001-0000-0000-0000-000000000059', 'v1.0', true, '2026-03-13 09:30:00-05', 'Mason Hart'),
  ('b2000001-0000-0000-0000-000000000060', 'v1.0', true, '2026-03-13 10:00:00-05', 'Nolan Reed'),
  ('b2000001-0000-0000-0000-000000000061', 'v1.0', true, '2026-03-13 10:30:00-05', 'Oscar Gutierrez'),
  ('b2000001-0000-0000-0000-000000000062', 'v1.0', true, '2026-03-13 11:00:00-05', 'Pete Russo'),
  ('b2000001-0000-0000-0000-000000000063', 'v1.0', true, '2026-03-13 11:30:00-05', 'Reggie Coleman'),
  ('b2000001-0000-0000-0000-000000000064', 'v1.0', true, '2026-03-13 12:00:00-05', 'Sean Murphy'),
  ('b2000001-0000-0000-0000-000000000065', 'v1.0', true, '2026-03-13 14:00:00-05', 'Terrance Bell'),
  ('b2000001-0000-0000-0000-000000000066', 'v1.0', true, '2026-03-14 08:00:00-05', 'Ulysses Ward'),
  ('b2000001-0000-0000-0000-000000000067', 'v1.0', true, '2026-03-14 08:30:00-05', 'Vince Romano'),
  ('b2000001-0000-0000-0000-000000000068', 'v1.0', true, '2026-03-14 09:00:00-05', 'Wayne Fischer'),
  ('b2000001-0000-0000-0000-000000000069', 'v1.0', true, '2026-03-14 09:30:00-05', 'Bryce Chapman'),
  ('b2000001-0000-0000-0000-000000000070', 'v1.0', true, '2026-03-14 10:00:00-05', 'Damien Simmons'),
  ('b2000001-0000-0000-0000-000000000071', 'v1.0', true, '2026-03-14 10:30:00-05', 'Andre Butler'),
  ('b2000001-0000-0000-0000-000000000072', 'v1.0', true, '2026-03-14 11:00:00-05', 'Blake Owens'),
  ('b2000001-0000-0000-0000-000000000073', 'v1.0', true, '2026-03-14 11:30:00-05', 'Caleb Stone'),
  ('b2000001-0000-0000-0000-000000000074', 'v1.0', true, '2026-03-14 12:00:00-05', 'Dillon Marsh'),
  ('b2000001-0000-0000-0000-000000000075', 'v1.0', true, '2026-03-14 14:00:00-05', 'Evan Webb'),
  ('b2000001-0000-0000-0000-000000000076', 'v1.0', true, '2026-03-15 08:00:00-05', 'Felix Santos'),
  ('b2000001-0000-0000-0000-000000000077', 'v1.0', true, '2026-03-15 08:30:00-05', 'Grant Douglas'),
  ('b2000001-0000-0000-0000-000000000078', 'v1.0', true, '2026-03-15 09:00:00-05', 'Hugo Perez'),
  ('b2000001-0000-0000-0000-000000000079', 'v1.0', true, '2026-03-15 09:30:00-05', 'Isaiah Brown'),
  ('b2000001-0000-0000-0000-000000000080', 'v1.0', true, '2026-03-15 10:00:00-05', 'Jaylen Ross'),
  ('b2000001-0000-0000-0000-000000000081', 'v1.0', true, '2026-03-15 10:30:00-05', 'Kendrick Long'),
  ('b2000001-0000-0000-0000-000000000082', 'v1.0', true, '2026-03-15 11:00:00-05', 'Lance Hawkins'),
  ('b2000001-0000-0000-0000-000000000083', 'v1.0', true, '2026-03-15 11:30:00-05', 'Miguel Castillo'),
  ('b2000001-0000-0000-0000-000000000084', 'v1.0', true, '2026-03-15 12:00:00-05', 'Noah Kim'),
  ('b2000001-0000-0000-0000-000000000085', 'v1.0', true, '2026-03-15 14:00:00-05', 'Owen Fitzgerald'),
  ('b2000001-0000-0000-0000-000000000086', 'v1.0', true, '2026-03-16 08:00:00-05', 'Preston Cole'),
  ('b2000001-0000-0000-0000-000000000087', 'v1.0', true, '2026-03-16 08:30:00-05', 'Ramon Santiago'),
  ('b2000001-0000-0000-0000-000000000088', 'v1.0', true, '2026-03-16 09:00:00-05', 'Shawn Barrett'),
  ('b2000001-0000-0000-0000-000000000089', 'v1.0', true, '2026-03-16 09:30:00-05', 'Travis Perry'),
  ('b2000001-0000-0000-0000-000000000090', 'v1.0', true, '2026-03-16 10:00:00-05', 'Uriel Medina'),
  ('b2000001-0000-0000-0000-000000000091', 'v1.0', true, '2026-03-16 10:30:00-05', 'Wendell Todd'),
  ('b2000001-0000-0000-0000-000000000092', 'v1.0', true, '2026-03-16 11:00:00-05', 'Xander Drake'),
  ('b2000001-0000-0000-0000-000000000093', 'v1.0', true, '2026-03-16 11:30:00-05', 'Yusuf Ali'),
  ('b2000001-0000-0000-0000-000000000094', 'v1.0', true, '2026-03-16 12:00:00-05', 'Zion Maxwell'),
  ('b2000001-0000-0000-0000-000000000095', 'v1.0', true, '2026-03-16 14:00:00-05', 'Adrian Wolfe'),
  -- 5 waivers not yet accepted
  ('b2000001-0000-0000-0000-000000000096', 'v1.0', false, null, null),
  ('b2000001-0000-0000-0000-000000000097', 'v1.0', false, null, null),
  ('b2000001-0000-0000-0000-000000000098', 'v1.0', false, null, null),
  ('b2000001-0000-0000-0000-000000000099', 'v1.0', false, null, null),
  ('b2000001-0000-0000-0000-000000000100', 'v1.0', false, null, null)
on conflict (registration_id) do nothing;

-- ============================================================
-- 5. FIELDS (5 diamonds)
-- ============================================================
insert into public.fields (id, tournament_id, name, sort_order, notes) values
  ('c3000001-0000-0000-0000-000000000001', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Diamond 1', 1, 'Main field — championship games'),
  ('c3000001-0000-0000-0000-000000000002', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Diamond 2', 2, null),
  ('c3000001-0000-0000-0000-000000000003', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Diamond 3', 3, 'Behind the concession stand'),
  ('c3000001-0000-0000-0000-000000000004', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Diamond 4', 4, null),
  ('c3000001-0000-0000-0000-000000000005', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Diamond 5', 5, 'Warm-up / overflow field')
on conflict do nothing;

-- ============================================================
-- 6. TEAMS (10)
-- ============================================================
insert into public.teams (id, tournament_id, name, color, coach_name) values
  ('d4000001-0000-0000-0000-000000000001', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Blue Jays',      '#1D9BF0', 'Coach Summers'),
  ('d4000001-0000-0000-0000-000000000002', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Cardinals',       '#E03131', 'Coach Winters'),
  ('d4000001-0000-0000-0000-000000000003', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Tigers',          '#F08C00', 'Coach Price'),
  ('d4000001-0000-0000-0000-000000000004', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Timber Wolves',   '#22c55e', 'Coach Stone'),
  ('d4000001-0000-0000-0000-000000000005', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Golden Eagles',   '#f59e0b', 'Coach Bell'),
  ('d4000001-0000-0000-0000-000000000006', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Falcons',         '#8b5cf6', 'Coach Wells'),
  ('d4000001-0000-0000-0000-000000000007', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Grizzlies',       '#6b7280', 'Coach Fox'),
  ('d4000001-0000-0000-0000-000000000008', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Red Hawks',       '#ef4444', 'Coach Steele'),
  ('d4000001-0000-0000-0000-000000000009', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Mustangs',        '#0ea5e9', 'Coach Black'),
  ('d4000001-0000-0000-0000-000000000010', 'e5821611-79b6-4349-ab23-56ee14f4d151', 'Panthers',        '#14b8a6', 'Coach Ray')
on conflict do nothing;

-- ============================================================
-- 7. TEAM PLAYERS (100 — snake draft, 10 rounds × 10 teams)
--
-- Snake order:
--   Odd rounds  (1,3,5,7,9): Team 1→2→3→…→10
--   Even rounds (2,4,6,8,10): Team 10→9→8→…→1
--
-- Team 1  (Blue Jays):      picks  1, 20, 21, 40, 41, 60, 61, 80, 81, 100
-- Team 2  (Cardinals):       picks  2, 19, 22, 39, 42, 59, 62, 79, 82,  99
-- Team 3  (Tigers):          picks  3, 18, 23, 38, 43, 58, 63, 78, 83,  98
-- Team 4  (Timber Wolves):   picks  4, 17, 24, 37, 44, 57, 64, 77, 84,  97
-- Team 5  (Golden Eagles):   picks  5, 16, 25, 36, 45, 56, 65, 76, 85,  96
-- Team 6  (Falcons):         picks  6, 15, 26, 35, 46, 55, 66, 75, 86,  95
-- Team 7  (Grizzlies):       picks  7, 14, 27, 34, 47, 54, 67, 74, 87,  94
-- Team 8  (Red Hawks):       picks  8, 13, 28, 33, 48, 53, 68, 73, 88,  93
-- Team 9  (Mustangs):        picks  9, 12, 29, 32, 49, 52, 69, 72, 89,  92
-- Team 10 (Panthers):        picks 10, 11, 30, 31, 50, 51, 70, 71, 90,  91
-- ============================================================
insert into public.team_players (tournament_id, team_id, registration_id, draft_pick_number, is_captain) values
  -- Team 1 · Blue Jays
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000001',   1, true),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000020',  20, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000021',  21, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000040',  40, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000041',  41, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000060',  60, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000061',  61, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000080',  80, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000081',  81, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000100', 100, false),
  -- Team 2 · Cardinals
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000002',   2, true),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000019',  19, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000022',  22, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000039',  39, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000042',  42, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000059',  59, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000062',  62, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000079',  79, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000082',  82, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000099',  99, false),
  -- Team 3 · Tigers
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000003',   3, true),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000018',  18, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000023',  23, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000038',  38, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000043',  43, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000058',  58, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000063',  63, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000078',  78, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000083',  83, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000098',  98, false),
  -- Team 4 · Timber Wolves
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000004', 'b2000001-0000-0000-0000-000000000004',   4, true),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000004', 'b2000001-0000-0000-0000-000000000017',  17, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000004', 'b2000001-0000-0000-0000-000000000024',  24, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000004', 'b2000001-0000-0000-0000-000000000037',  37, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000004', 'b2000001-0000-0000-0000-000000000044',  44, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000004', 'b2000001-0000-0000-0000-000000000057',  57, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000004', 'b2000001-0000-0000-0000-000000000064',  64, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000004', 'b2000001-0000-0000-0000-000000000077',  77, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000004', 'b2000001-0000-0000-0000-000000000084',  84, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000004', 'b2000001-0000-0000-0000-000000000097',  97, false),
  -- Team 5 · Golden Eagles
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000005', 'b2000001-0000-0000-0000-000000000005',   5, true),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000005', 'b2000001-0000-0000-0000-000000000016',  16, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000005', 'b2000001-0000-0000-0000-000000000025',  25, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000005', 'b2000001-0000-0000-0000-000000000036',  36, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000005', 'b2000001-0000-0000-0000-000000000045',  45, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000005', 'b2000001-0000-0000-0000-000000000056',  56, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000005', 'b2000001-0000-0000-0000-000000000065',  65, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000005', 'b2000001-0000-0000-0000-000000000076',  76, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000005', 'b2000001-0000-0000-0000-000000000085',  85, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000005', 'b2000001-0000-0000-0000-000000000096',  96, false),
  -- Team 6 · Falcons
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000006', 'b2000001-0000-0000-0000-000000000006',   6, true),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000006', 'b2000001-0000-0000-0000-000000000015',  15, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000006', 'b2000001-0000-0000-0000-000000000026',  26, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000006', 'b2000001-0000-0000-0000-000000000035',  35, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000006', 'b2000001-0000-0000-0000-000000000046',  46, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000006', 'b2000001-0000-0000-0000-000000000055',  55, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000006', 'b2000001-0000-0000-0000-000000000066',  66, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000006', 'b2000001-0000-0000-0000-000000000075',  75, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000006', 'b2000001-0000-0000-0000-000000000086',  86, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000006', 'b2000001-0000-0000-0000-000000000095',  95, false),
  -- Team 7 · Grizzlies
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000007', 'b2000001-0000-0000-0000-000000000007',   7, true),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000007', 'b2000001-0000-0000-0000-000000000014',  14, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000007', 'b2000001-0000-0000-0000-000000000027',  27, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000007', 'b2000001-0000-0000-0000-000000000034',  34, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000007', 'b2000001-0000-0000-0000-000000000047',  47, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000007', 'b2000001-0000-0000-0000-000000000054',  54, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000007', 'b2000001-0000-0000-0000-000000000067',  67, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000007', 'b2000001-0000-0000-0000-000000000074',  74, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000007', 'b2000001-0000-0000-0000-000000000087',  87, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000007', 'b2000001-0000-0000-0000-000000000094',  94, false),
  -- Team 8 · Red Hawks
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000008', 'b2000001-0000-0000-0000-000000000008',   8, true),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000008', 'b2000001-0000-0000-0000-000000000013',  13, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000008', 'b2000001-0000-0000-0000-000000000028',  28, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000008', 'b2000001-0000-0000-0000-000000000033',  33, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000008', 'b2000001-0000-0000-0000-000000000048',  48, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000008', 'b2000001-0000-0000-0000-000000000053',  53, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000008', 'b2000001-0000-0000-0000-000000000068',  68, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000008', 'b2000001-0000-0000-0000-000000000073',  73, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000008', 'b2000001-0000-0000-0000-000000000088',  88, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000008', 'b2000001-0000-0000-0000-000000000093',  93, false),
  -- Team 9 · Mustangs
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000009', 'b2000001-0000-0000-0000-000000000009',   9, true),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000009', 'b2000001-0000-0000-0000-000000000012',  12, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000009', 'b2000001-0000-0000-0000-000000000029',  29, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000009', 'b2000001-0000-0000-0000-000000000032',  32, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000009', 'b2000001-0000-0000-0000-000000000049',  49, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000009', 'b2000001-0000-0000-0000-000000000052',  52, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000009', 'b2000001-0000-0000-0000-000000000069',  69, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000009', 'b2000001-0000-0000-0000-000000000072',  72, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000009', 'b2000001-0000-0000-0000-000000000089',  89, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000009', 'b2000001-0000-0000-0000-000000000092',  92, false),
  -- Team 10 · Panthers
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000010', 'b2000001-0000-0000-0000-000000000010',  10, true),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000010', 'b2000001-0000-0000-0000-000000000011',  11, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000010', 'b2000001-0000-0000-0000-000000000030',  30, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000010', 'b2000001-0000-0000-0000-000000000031',  31, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000010', 'b2000001-0000-0000-0000-000000000050',  50, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000010', 'b2000001-0000-0000-0000-000000000051',  51, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000010', 'b2000001-0000-0000-0000-000000000070',  70, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000010', 'b2000001-0000-0000-0000-000000000071',  71, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000010', 'b2000001-0000-0000-0000-000000000090',  90, false),
  ('e5821611-79b6-4349-ab23-56ee14f4d151', 'd4000001-0000-0000-0000-000000000010', 'b2000001-0000-0000-0000-000000000091',  91, false)
on conflict (registration_id) do nothing;

-- ============================================================
-- 8. GAMES — 20 Pool Play (all final)
--
-- Pool A: Blue Jays(001), Cardinals(002), Tigers(003),
--         Timber Wolves(004), Golden Eagles(005)
-- Pool B: Falcons(006), Grizzlies(007), Red Hawks(008),
--         Mustangs(009), Panthers(010)
--
-- 5 time-slots: 9:00, 10:30, 12:00, 1:30, 3:00
-- 4 fields used per slot (D1-D4)
-- ============================================================
insert into public.games (
  id, tournament_id, game_type, round_name, game_number,
  field_id, home_team_id, away_team_id, winner_team_id, loser_team_id,
  start_time, home_score, away_score, status
) values

-- ── Time Slot 1 · 9:00 AM ──────────────────────────────────

-- G1: Pool A — Blue Jays 9, Cardinals 5 → Blue Jays win
('e5000001-0000-0000-0000-000000000001', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 1,
 'c3000001-0000-0000-0000-000000000001',
 'd4000001-0000-0000-0000-000000000001', 'd4000001-0000-0000-0000-000000000002',
 'd4000001-0000-0000-0000-000000000001', 'd4000001-0000-0000-0000-000000000002',
 '2026-04-18 09:00:00-05', 9, 5, 'final'),

-- G2: Pool A — Tigers 7, Timber Wolves 6 → Tigers win
('e5000001-0000-0000-0000-000000000002', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 2,
 'c3000001-0000-0000-0000-000000000002',
 'd4000001-0000-0000-0000-000000000003', 'd4000001-0000-0000-0000-000000000004',
 'd4000001-0000-0000-0000-000000000003', 'd4000001-0000-0000-0000-000000000004',
 '2026-04-18 09:00:00-05', 7, 6, 'final'),

-- G3: Pool B — Falcons 10, Grizzlies 5 → Falcons win
('e5000001-0000-0000-0000-000000000003', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 3,
 'c3000001-0000-0000-0000-000000000003',
 'd4000001-0000-0000-0000-000000000006', 'd4000001-0000-0000-0000-000000000007',
 'd4000001-0000-0000-0000-000000000006', 'd4000001-0000-0000-0000-000000000007',
 '2026-04-18 09:00:00-05', 10, 5, 'final'),

-- G4: Pool B — Red Hawks 6, Mustangs 5 → Red Hawks win
('e5000001-0000-0000-0000-000000000004', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 4,
 'c3000001-0000-0000-0000-000000000004',
 'd4000001-0000-0000-0000-000000000008', 'd4000001-0000-0000-0000-000000000009',
 'd4000001-0000-0000-0000-000000000008', 'd4000001-0000-0000-0000-000000000009',
 '2026-04-18 09:00:00-05', 6, 5, 'final'),

-- ── Time Slot 2 · 10:30 AM ─────────────────────────────────

-- G5: Pool A — Blue Jays 7, Golden Eagles 3 → Blue Jays win
('e5000001-0000-0000-0000-000000000005', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 5,
 'c3000001-0000-0000-0000-000000000001',
 'd4000001-0000-0000-0000-000000000001', 'd4000001-0000-0000-0000-000000000005',
 'd4000001-0000-0000-0000-000000000001', 'd4000001-0000-0000-0000-000000000005',
 '2026-04-18 10:30:00-05', 7, 3, 'final'),

-- G6: Pool A — Cardinals 8, Tigers 5 → Cardinals win
('e5000001-0000-0000-0000-000000000006', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 6,
 'c3000001-0000-0000-0000-000000000002',
 'd4000001-0000-0000-0000-000000000002', 'd4000001-0000-0000-0000-000000000003',
 'd4000001-0000-0000-0000-000000000002', 'd4000001-0000-0000-0000-000000000003',
 '2026-04-18 10:30:00-05', 8, 5, 'final'),

-- G7: Pool B — Falcons 9, Panthers 2 → Falcons win
('e5000001-0000-0000-0000-000000000007', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 7,
 'c3000001-0000-0000-0000-000000000003',
 'd4000001-0000-0000-0000-000000000006', 'd4000001-0000-0000-0000-000000000010',
 'd4000001-0000-0000-0000-000000000006', 'd4000001-0000-0000-0000-000000000010',
 '2026-04-18 10:30:00-05', 9, 2, 'final'),

-- G8: Pool B — Grizzlies 7, Red Hawks 5 → Grizzlies win
('e5000001-0000-0000-0000-000000000008', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 8,
 'c3000001-0000-0000-0000-000000000004',
 'd4000001-0000-0000-0000-000000000007', 'd4000001-0000-0000-0000-000000000008',
 'd4000001-0000-0000-0000-000000000007', 'd4000001-0000-0000-0000-000000000008',
 '2026-04-18 10:30:00-05', 7, 5, 'final'),

-- ── Time Slot 3 · 12:00 PM ─────────────────────────────────

-- G9: Pool A — Blue Jays 8, Tigers 4 → Blue Jays win
('e5000001-0000-0000-0000-000000000009', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 9,
 'c3000001-0000-0000-0000-000000000001',
 'd4000001-0000-0000-0000-000000000001', 'd4000001-0000-0000-0000-000000000003',
 'd4000001-0000-0000-0000-000000000001', 'd4000001-0000-0000-0000-000000000003',
 '2026-04-18 12:00:00-05', 8, 4, 'final'),

-- G10: Pool A — Timber Wolves 6, Golden Eagles 4 → Timber Wolves win
('e5000001-0000-0000-0000-000000000010', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 10,
 'c3000001-0000-0000-0000-000000000002',
 'd4000001-0000-0000-0000-000000000004', 'd4000001-0000-0000-0000-000000000005',
 'd4000001-0000-0000-0000-000000000004', 'd4000001-0000-0000-0000-000000000005',
 '2026-04-18 12:00:00-05', 6, 4, 'final'),

-- G11: Pool B — Falcons 8, Red Hawks 4 → Falcons win
('e5000001-0000-0000-0000-000000000011', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 11,
 'c3000001-0000-0000-0000-000000000003',
 'd4000001-0000-0000-0000-000000000006', 'd4000001-0000-0000-0000-000000000008',
 'd4000001-0000-0000-0000-000000000006', 'd4000001-0000-0000-0000-000000000008',
 '2026-04-18 12:00:00-05', 8, 4, 'final'),

-- G12: Pool B — Mustangs 8, Panthers 6 → Mustangs win
('e5000001-0000-0000-0000-000000000012', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 12,
 'c3000001-0000-0000-0000-000000000004',
 'd4000001-0000-0000-0000-000000000009', 'd4000001-0000-0000-0000-000000000010',
 'd4000001-0000-0000-0000-000000000009', 'd4000001-0000-0000-0000-000000000010',
 '2026-04-18 12:00:00-05', 8, 6, 'final'),

-- ── Time Slot 4 · 1:30 PM ──────────────────────────────────

-- G13: Pool A — Blue Jays 11, Timber Wolves 2 → Blue Jays win
('e5000001-0000-0000-0000-000000000013', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 13,
 'c3000001-0000-0000-0000-000000000001',
 'd4000001-0000-0000-0000-000000000001', 'd4000001-0000-0000-0000-000000000004',
 'd4000001-0000-0000-0000-000000000001', 'd4000001-0000-0000-0000-000000000004',
 '2026-04-18 13:30:00-05', 11, 2, 'final'),

-- G14: Pool A — Cardinals 9, Golden Eagles 4 → Cardinals win
('e5000001-0000-0000-0000-000000000014', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 14,
 'c3000001-0000-0000-0000-000000000002',
 'd4000001-0000-0000-0000-000000000002', 'd4000001-0000-0000-0000-000000000005',
 'd4000001-0000-0000-0000-000000000002', 'd4000001-0000-0000-0000-000000000005',
 '2026-04-18 13:30:00-05', 9, 4, 'final'),

-- G15: Pool B — Falcons 7, Mustangs 3 → Falcons win
('e5000001-0000-0000-0000-000000000015', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 15,
 'c3000001-0000-0000-0000-000000000003',
 'd4000001-0000-0000-0000-000000000006', 'd4000001-0000-0000-0000-000000000009',
 'd4000001-0000-0000-0000-000000000006', 'd4000001-0000-0000-0000-000000000009',
 '2026-04-18 13:30:00-05', 7, 3, 'final'),

-- G16: Pool B — Grizzlies 8, Panthers 3 → Grizzlies win
('e5000001-0000-0000-0000-000000000016', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 16,
 'c3000001-0000-0000-0000-000000000004',
 'd4000001-0000-0000-0000-000000000007', 'd4000001-0000-0000-0000-000000000010',
 'd4000001-0000-0000-0000-000000000007', 'd4000001-0000-0000-0000-000000000010',
 '2026-04-18 13:30:00-05', 8, 3, 'final'),

-- ── Time Slot 5 · 3:00 PM ──────────────────────────────────

-- G17: Pool A — Tigers 8, Golden Eagles 5 → Tigers win
('e5000001-0000-0000-0000-000000000017', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 17,
 'c3000001-0000-0000-0000-000000000001',
 'd4000001-0000-0000-0000-000000000003', 'd4000001-0000-0000-0000-000000000005',
 'd4000001-0000-0000-0000-000000000003', 'd4000001-0000-0000-0000-000000000005',
 '2026-04-18 15:00:00-05', 8, 5, 'final'),

-- G18: Pool A — Cardinals 10, Timber Wolves 3 → Cardinals win
('e5000001-0000-0000-0000-000000000018', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 18,
 'c3000001-0000-0000-0000-000000000002',
 'd4000001-0000-0000-0000-000000000002', 'd4000001-0000-0000-0000-000000000004',
 'd4000001-0000-0000-0000-000000000002', 'd4000001-0000-0000-0000-000000000004',
 '2026-04-18 15:00:00-05', 10, 3, 'final'),

-- G19: Pool B — Red Hawks 7, Panthers 4 → Red Hawks win
('e5000001-0000-0000-0000-000000000019', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 19,
 'c3000001-0000-0000-0000-000000000003',
 'd4000001-0000-0000-0000-000000000008', 'd4000001-0000-0000-0000-000000000010',
 'd4000001-0000-0000-0000-000000000008', 'd4000001-0000-0000-0000-000000000010',
 '2026-04-18 15:00:00-05', 7, 4, 'final'),

-- G20: Pool B — Grizzlies 9, Mustangs 4 → Grizzlies win
('e5000001-0000-0000-0000-000000000020', 'e5821611-79b6-4349-ab23-56ee14f4d151',
 'pool', 'Pool Play', 20,
 'c3000001-0000-0000-0000-000000000004',
 'd4000001-0000-0000-0000-000000000007', 'd4000001-0000-0000-0000-000000000009',
 'd4000001-0000-0000-0000-000000000007', 'd4000001-0000-0000-0000-000000000009',
 '2026-04-18 15:00:00-05', 9, 4, 'final');

-- ============================================================
-- 9. ANNOUNCEMENTS
-- ============================================================
insert into public.announcements (tournament_id, title, body, audience, published_at) values
  ('e5821611-79b6-4349-ab23-56ee14f4d151',
   'Welcome to Spring Classic 2026!',
   'We are excited to have you all here today! Check-in is open at the main tent near Diamond 1. Please have your ID ready. Good luck to all 10 teams!',
   'all',
   '2026-04-18 07:30:00-05'),
  ('e5821611-79b6-4349-ab23-56ee14f4d151',
   'Pool Play Schedule — 2 Pools of 5',
   'Pool A: Blue Jays, Cardinals, Tigers, Timber Wolves, Golden Eagles. Pool B: Falcons, Grizzlies, Red Hawks, Mustangs, Panthers. Round-robin within each pool — 4 games per team. Good luck!',
   'all',
   '2026-04-18 08:00:00-05'),
  ('e5821611-79b6-4349-ab23-56ee14f4d151',
   'Concessions Open',
   'The concession stand behind Diamond 3 is now open! Hot dogs, burgers, drinks, and snacks available all day. Teams get a 10% discount with their wristband.',
   'all',
   '2026-04-18 08:45:00-05'),
  ('e5821611-79b6-4349-ab23-56ee14f4d151',
   'Bracket Coming After Pool Play',
   'All 20 pool play games are now final! The quarterfinals bracket will be posted shortly. Top 4 from each pool advance. Estimated bracket start: 5:00 PM on Diamond 1.',
   'all',
   '2026-04-18 16:30:00-05')
on conflict do nothing;

-- ============================================================
-- QUICK REFERENCE
-- ============================================================
-- Tournament: e5821611-79b6-4349-ab23-56ee14f4d151
--
-- Teams (10):
--   d4..001  Blue Jays      #1D9BF0      Pool A
--   d4..002  Cardinals      #E03131      Pool A
--   d4..003  Tigers         #F08C00      Pool A
--   d4..004  Timber Wolves  #22c55e      Pool A
--   d4..005  Golden Eagles  #f59e0b      Pool A
--   d4..006  Falcons        #8b5cf6      Pool B
--   d4..007  Grizzlies      #6b7280      Pool B
--   d4..008  Red Hawks      #ef4444      Pool B
--   d4..009  Mustangs       #0ea5e9      Pool B
--   d4..010  Panthers       #14b8a6      Pool B
--
-- Fields (5):
--   c3..001  Diamond 1 (main/championship)
--   c3..002  Diamond 2
--   c3..003  Diamond 3
--   c3..004  Diamond 4
--   c3..005  Diamond 5 (warm-up/overflow)
--
-- Pool A Standings:
--   1. Blue Jays      4-0  RS 35  RA 14  RD +21
--   2. Cardinals       3-1  RS 32  RA 21  RD +11
--   3. Tigers          2-2  RS 24  RA 27  RD  -3
--   4. Timber Wolves   1-3  RS 17  RA 32  RD -15
--   5. Golden Eagles   0-4  RS 16  RA 30  RD -14
--
-- Pool B Standings:
--   1. Falcons         4-0  RS 34  RA 14  RD +20
--   2. Grizzlies       3-1  RS 29  RA 22  RD  +7
--   3. Red Hawks       2-2  RS 22  RA 24  RD  -2
--   4. Mustangs        1-3  RS 20  RA 28  RD  -8
--   5. Panthers        0-4  RS 15  RA 32  RD -17
--
-- Projected Bracket Seeding (top 4 per pool, cross-seeded):
--   QF1: #1 Blue Jays   vs  #8 Mustangs
--   QF2: #2 Falcons      vs  #7 Timber Wolves
--   QF3: #3 Cardinals     vs  #6 Red Hawks
--   QF4: #4 Grizzlies    vs  #5 Tigers
--
-- After running → Admin → Games & Scores → "Generate Bracket"
-- ============================================================

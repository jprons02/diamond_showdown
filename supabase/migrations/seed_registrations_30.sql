-- ============================================================
-- REGISTRATIONS SEED — 30 registrations
-- Tournament: 073f7a54-505b-4634-9936-80a7fe23909a
-- Run this in Supabase SQL Editor (service role / unrestricted)
--
-- WHAT THIS CREATES:
--   • 30 Players (on conflict do nothing — safe alongside other seeds)
--   • 30 Registrations with a realistic status mix
--
-- STATUS BREAKDOWN:
--   Reg  1–20   confirmed / paid           draft_eligible: true
--   Reg 21–23   confirmed / paid           draft_eligible: false
--   Reg 24–26   pending   / unpaid         draft_eligible: true
--   Reg 27–28   waitlisted / unpaid        draft_eligible: true
--   Reg    29   cancelled  / unpaid        draft_eligible: false
--   Reg    30   confirmed  / refunded      draft_eligible: false
-- ============================================================

-- ── 0. CLEAN SLATE ──────────────────────────────────────────
delete from public.registrations
  where tournament_id = '073f7a54-505b-4634-9936-80a7fe23909a';

-- ── 1. PLAYERS (30) ─────────────────────────────────────────
insert into public.players (id, first_name, last_name, email, phone, city, state, skill_rating, preferred_position, throws, bats, shirt_size) values
  ('a1000001-0000-0000-0000-000000000001', 'Marcus',   'Rivera',    'marcus.rivera@email.com',    '407-555-0101', 'Orlando',           'FL', 8, 'Shortstop',    'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000002', 'Derek',    'Thompson',  'derek.thompson@email.com',   '407-555-0102', 'Orlando',           'FL', 7, 'First Base',   'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000003', 'James',    'Mitchell',  'james.mitchell@email.com',   '407-555-0103', 'Kissimmee',         'FL', 9, 'Pitcher',      'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000004', 'Carlos',   'Mendez',    'carlos.mendez@email.com',    '407-555-0104', 'Orlando',           'FL', 6, 'Left Field',   'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000005', 'Tyler',    'Brooks',    'tyler.brooks@email.com',     '407-555-0105', 'Sanford',           'FL', 7, 'Third Base',   'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000006', 'Anthony',  'Moore',     'anthony.moore@email.com',    '407-555-0106', 'Orlando',           'FL', 8, 'Catcher',      'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000007', 'Kevin',    'Harris',    'kevin.harris@email.com',     '407-555-0107', 'Oviedo',            'FL', 6, 'Right Field',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000008', 'Jason',    'Carter',    'jason.carter@email.com',     '321-555-0108', 'Orlando',           'FL', 7, 'Second Base',  'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000009', 'Brandon',  'Lee',       'brandon.lee@email.com',      '321-555-0109', 'Winter Park',       'FL', 9, 'Shortstop',    'Right', 'Both',  'M'),
  ('a1000001-0000-0000-0000-000000000010', 'Mike',     'Johnson',   'mike.johnson@email.com',     '321-555-0110', 'Orlando',           'FL', 6, 'Left Center',  'Left',  'Left',  'XXL'),
  ('a1000001-0000-0000-0000-000000000011', 'Chris',    'Williams',  'chris.williams@email.com',   '321-555-0111', 'Maitland',          'FL', 8, 'First Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000012', 'David',    'Wilson',    'david.wilson@email.com',     '321-555-0112', 'Longwood',          'FL', 7, 'Right Center', 'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000013', 'Ryan',     'Taylor',    'ryan.taylor@email.com',      '321-555-0113', 'Ocoee',             'FL', 8, 'Third Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000014', 'Jordan',   'Anderson',  'jordan.anderson@email.com',  '321-555-0114', 'Orlando',           'FL', 7, 'Catcher',      'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000015', 'Nathan',   'Thomas',    'nathan.thomas@email.com',    '321-555-0115', 'Apopka',            'FL', 6, 'Left Field',   'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000016', 'Eric',     'Jackson',   'eric.jackson@email.com',     '386-555-0116', 'Deltona',           'FL', 9, 'Pitcher',      'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000017', 'Matt',     'White',     'matt.white@email.com',       '386-555-0117', 'Deland',            'FL', 7, 'Second Base',  'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000018', 'Andrew',   'Martin',    'andrew.martin@email.com',    '386-555-0118', 'Sanford',           'FL', 8, 'Shortstop',    'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000019', 'Josh',     'Garcia',    'josh.garcia@email.com',      '386-555-0119', 'Orlando',           'FL', 6, 'Right Field',  'Left',  'Left',  'M'),
  ('a1000001-0000-0000-0000-000000000020', 'Steven',   'Martinez',  'steven.martinez@email.com',  '386-555-0120', 'Kissimmee',         'FL', 7, 'Left Center',  'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000021', 'Daniel',   'Robinson',  'daniel.robinson@email.com',  '386-555-0121', 'Orlando',           'FL', 8, 'First Base',   'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000022', 'Alex',     'Reyes',     'alex.reyes@email.com',       '407-555-0122', 'Winter Park',       'FL', 7, 'Pitcher',      'Left',  'Left',  'M'),
  ('a1000001-0000-0000-0000-000000000023', 'Brian',    'Foster',    'brian.foster@email.com',     '407-555-0123', 'Clermont',          'FL', 6, 'Catcher',      'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000024', 'Corey',    'Sanders',   'corey.sanders@email.com',    '407-555-0124', 'Lake Mary',         'FL', 7, 'Third Base',   'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000025', 'Dustin',   'Palmer',    'dustin.palmer@email.com',    '407-555-0125', 'Orlando',           'FL', 8, 'Left Field',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000026', 'Ethan',    'Cooper',    'ethan.cooper@email.com',     '407-555-0126', 'Altamonte Springs', 'FL', 6, 'Second Base',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000027', 'Frank',    'Morales',   'frank.morales@email.com',    '407-555-0127', 'Casselberry',       'FL', 7, 'Right Field',  'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000028', 'Greg',     'Nguyen',    'greg.nguyen@email.com',      '407-555-0128', 'Orlando',           'FL', 8, 'Shortstop',    'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000029', 'Hector',   'Ramirez',   'hector.ramirez@email.com',   '407-555-0129', 'Winter Springs',    'FL', 7, 'Left Center',  'Right', 'Both',  'L'),
  ('a1000001-0000-0000-0000-000000000030', 'Ian',      'Scott',     'ian.scott@email.com',        '407-555-0130', 'Winter Garden',     'FL', 6, 'Right Center', 'Right', 'Right', 'XL')
on conflict (email) do nothing;

-- ── 2. REGISTRATIONS (30) ───────────────────────────────────
insert into public.registrations (id, tournament_id, player_id, registration_status, payment_status, paid_amount, draft_eligible, check_in_status) values
  -- ── confirmed / paid / draft_eligible: true (1–20) ───────
  ('c4000001-0000-0000-0000-000000000001', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000001', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000002', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000002', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000003', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000003', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000004', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000004', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000005', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000005', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000006', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000006', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000007', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000007', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000008', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000008', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000009', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000009', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000010', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000010', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000011', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000011', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000012', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000012', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000013', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000013', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000014', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000014', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000015', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000015', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000016', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000016', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000017', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000017', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000018', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000018', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000019', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000019', 'confirmed', 'paid',    65.00, true,  null),
  ('c4000001-0000-0000-0000-000000000020', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000020', 'confirmed', 'paid',    65.00, true,  null),
  -- ── confirmed / paid / draft_eligible: false (21–23) ─────
  ('c4000001-0000-0000-0000-000000000021', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000021', 'confirmed', 'paid',    65.00, false, null),
  ('c4000001-0000-0000-0000-000000000022', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000022', 'confirmed', 'paid',    65.00, false, null),
  ('c4000001-0000-0000-0000-000000000023', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000023', 'confirmed', 'paid',    65.00, false, null),
  -- ── pending / unpaid (24–26) ─────────────────────────────
  ('c4000001-0000-0000-0000-000000000024', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000024', 'pending',   'unpaid',  null,  true,  null),
  ('c4000001-0000-0000-0000-000000000025', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000025', 'pending',   'unpaid',  null,  true,  null),
  ('c4000001-0000-0000-0000-000000000026', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000026', 'pending',   'unpaid',  null,  true,  null),
  -- ── waitlisted / unpaid (27–28) ──────────────────────────
  ('c4000001-0000-0000-0000-000000000027', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000027', 'waitlisted','unpaid',  null,  true,  null),
  ('c4000001-0000-0000-0000-000000000028', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000028', 'waitlisted','unpaid',  null,  true,  null),
  -- ── cancelled / unpaid (29) ──────────────────────────────
  ('c4000001-0000-0000-0000-000000000029', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000029', 'cancelled', 'unpaid',  null,  false, null),
  -- ── confirmed / refunded (30) ────────────────────────────
  ('c4000001-0000-0000-0000-000000000030', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000030', 'confirmed', 'refunded',65.00, false, null)
on conflict (tournament_id, player_id) do nothing;

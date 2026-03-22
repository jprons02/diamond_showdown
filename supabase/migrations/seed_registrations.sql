-- ============================================================
-- REGISTRATIONS SEED — 100 registrations
-- Tournament: 073f7a54-505b-4634-9936-80a7fe23909a
-- Run this in Supabase SQL Editor (service role / unrestricted)
--
-- WHAT THIS CREATES:
--   • 100 Players (on conflict do nothing — safe alongside seed_mock_data.sql)
--   • 100 Registrations with a realistic status mix
--
-- STATUS BREAKDOWN:
--   Reg   1–55   confirmed / paid           draft_eligible: true
--   Reg  56–60   confirmed / paid           draft_eligible: false (opted out)
--   Reg  61–78   pending   / unpaid         draft_eligible: true
--   Reg  79–86   confirmed / pending        draft_eligible: true
--   Reg  87–92   waitlisted / unpaid        draft_eligible: true
--   Reg  93–96   cancelled  / unpaid        draft_eligible: false
--   Reg  97–100  confirmed  / refunded      draft_eligible: false
-- ============================================================

-- ── 0. CLEAN SLATE ──────────────────────────────────────────
delete from public.registrations
  where tournament_id = '073f7a54-505b-4634-9936-80a7fe23909a';

-- ── 1. PLAYERS (100) ────────────────────────────────────────
-- Same player IDs / emails as seed_mock_data.sql.
-- on conflict (email) do nothing makes this safe to run in any order.
insert into public.players (id, first_name, last_name, email, phone, city, state, skill_rating, preferred_position, throws, bats, shirt_size) values
  -- 1–10
  ('a1000001-0000-0000-0000-000000000001', 'Marcus',    'Rivera',      'marcus.rivera@email.com',      '407-555-0101', 'Orlando',           'FL', 8, 'Shortstop',    'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000002', 'Derek',     'Thompson',    'derek.thompson@email.com',     '407-555-0102', 'Orlando',           'FL', 7, 'First Base',   'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000003', 'James',     'Mitchell',    'james.mitchell@email.com',     '407-555-0103', 'Kissimmee',         'FL', 9, 'Pitcher',      'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000004', 'Carlos',    'Mendez',      'carlos.mendez@email.com',      '407-555-0104', 'Orlando',           'FL', 6, 'Left Field',   'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000005', 'Tyler',     'Brooks',      'tyler.brooks@email.com',       '407-555-0105', 'Sanford',           'FL', 7, 'Third Base',   'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000006', 'Anthony',   'Moore',       'anthony.moore@email.com',      '407-555-0106', 'Orlando',           'FL', 8, 'Catcher',      'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000007', 'Kevin',     'Harris',      'kevin.harris@email.com',       '407-555-0107', 'Oviedo',            'FL', 6, 'Right Field',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000008', 'Jason',     'Carter',      'jason.carter@email.com',       '321-555-0108', 'Orlando',           'FL', 7, 'Second Base',  'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000009', 'Brandon',   'Lee',         'brandon.lee@email.com',        '321-555-0109', 'Winter Park',       'FL', 9, 'Shortstop',    'Right', 'Both',  'M'),
  ('a1000001-0000-0000-0000-000000000010', 'Mike',      'Johnson',     'mike.johnson@email.com',       '321-555-0110', 'Orlando',           'FL', 6, 'Left Center',  'Left',  'Left',  'XXL'),
  -- 11–20
  ('a1000001-0000-0000-0000-000000000011', 'Chris',     'Williams',    'chris.williams@email.com',     '321-555-0111', 'Maitland',          'FL', 8, 'First Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000012', 'David',     'Wilson',      'david.wilson@email.com',       '321-555-0112', 'Longwood',          'FL', 7, 'Right Center', 'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000013', 'Ryan',      'Taylor',      'ryan.taylor@email.com',        '321-555-0113', 'Ocoee',             'FL', 8, 'Third Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000014', 'Jordan',    'Anderson',    'jordan.anderson@email.com',    '321-555-0114', 'Orlando',           'FL', 7, 'Catcher',      'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000015', 'Nathan',    'Thomas',      'nathan.thomas@email.com',      '321-555-0115', 'Apopka',            'FL', 6, 'Left Field',   'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000016', 'Eric',      'Jackson',     'eric.jackson@email.com',       '386-555-0116', 'Deltona',           'FL', 9, 'Pitcher',      'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000017', 'Matt',      'White',       'matt.white@email.com',         '386-555-0117', 'Deland',            'FL', 7, 'Second Base',  'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000018', 'Andrew',    'Martin',      'andrew.martin@email.com',      '386-555-0118', 'Sanford',           'FL', 8, 'Shortstop',    'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000019', 'Josh',      'Garcia',      'josh.garcia@email.com',        '386-555-0119', 'Orlando',           'FL', 6, 'Right Field',  'Left',  'Left',  'M'),
  ('a1000001-0000-0000-0000-000000000020', 'Steven',    'Martinez',    'steven.martinez@email.com',    '386-555-0120', 'Kissimmee',         'FL', 7, 'Left Center',  'Right', 'Right', 'L'),
  -- 21–30
  ('a1000001-0000-0000-0000-000000000021', 'Daniel',    'Robinson',    'daniel.robinson@email.com',    '386-555-0121', 'Orlando',           'FL', 8, 'First Base',   'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000022', 'Alex',      'Reyes',       'alex.reyes@email.com',         '407-555-0122', 'Winter Park',       'FL', 7, 'Pitcher',      'Left',  'Left',  'M'),
  ('a1000001-0000-0000-0000-000000000023', 'Brian',     'Foster',      'brian.foster@email.com',       '407-555-0123', 'Clermont',          'FL', 6, 'Catcher',      'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000024', 'Corey',     'Sanders',     'corey.sanders@email.com',      '407-555-0124', 'Lake Mary',         'FL', 7, 'Third Base',   'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000025', 'Dustin',    'Palmer',      'dustin.palmer@email.com',      '407-555-0125', 'Orlando',           'FL', 8, 'Left Field',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000026', 'Ethan',     'Cooper',      'ethan.cooper@email.com',       '407-555-0126', 'Altamonte Springs', 'FL', 6, 'Second Base',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000027', 'Frank',     'Morales',     'frank.morales@email.com',      '407-555-0127', 'Casselberry',       'FL', 7, 'Right Field',  'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000028', 'Greg',      'Nguyen',      'greg.nguyen@email.com',        '407-555-0128', 'Orlando',           'FL', 8, 'Shortstop',    'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000029', 'Hector',    'Ramirez',     'hector.ramirez@email.com',     '407-555-0129', 'Winter Springs',    'FL', 7, 'Left Center',  'Right', 'Both',  'L'),
  ('a1000001-0000-0000-0000-000000000030', 'Ian',       'Scott',       'ian.scott@email.com',          '407-555-0130', 'Winter Garden',     'FL', 6, 'Right Center', 'Right', 'Right', 'XL'),
  -- 31–40
  ('a1000001-0000-0000-0000-000000000031', 'Jake',      'Patterson',   'jake.patterson@email.com',     '321-555-0131', 'Windermere',        'FL', 8, 'Pitcher',      'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000032', 'Kyle',      'Bennett',     'kyle.bennett@email.com',       '321-555-0132', 'St. Cloud',         'FL', 7, 'First Base',   'Left',  'Left',  'M'),
  ('a1000001-0000-0000-0000-000000000033', 'Leo',       'Vasquez',     'leo.vasquez@email.com',        '321-555-0133', 'Orlando',           'FL', 6, 'Catcher',      'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000034', 'Manuel',    'Ortiz',       'manuel.ortiz@email.com',       '321-555-0134', 'Kissimmee',         'FL', 8, 'Third Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000035', 'Nick',      'Campbell',    'nick.campbell@email.com',      '321-555-0135', 'Sanford',           'FL', 7, 'Second Base',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000036', 'Omar',      'Diaz',        'omar.diaz@email.com',          '321-555-0136', 'Oviedo',            'FL', 6, 'Left Field',   'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000037', 'Patrick',   'Sullivan',    'patrick.sullivan@email.com',   '321-555-0137', 'Maitland',          'FL', 7, 'Right Field',  'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000038', 'Quincy',    'Adams',       'quincy.adams@email.com',       '321-555-0138', 'Orlando',           'FL', 8, 'Shortstop',    'Right', 'Both',  'M'),
  ('a1000001-0000-0000-0000-000000000039', 'Roberto',   'Cruz',        'roberto.cruz@email.com',       '321-555-0139', 'Longwood',          'FL', 7, 'Left Center',  'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000040', 'Sam',       'Griffin',     'sam.griffin@email.com',        '321-555-0140', 'Apopka',            'FL', 6, 'Right Center', 'Right', 'Right', 'XL'),
  -- 41–50
  ('a1000001-0000-0000-0000-000000000041', 'Tony',      'Delgado',     'tony.delgado@email.com',       '386-555-0141', 'Deltona',           'FL', 7, 'Pitcher',      'Left',  'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000042', 'Victor',    'Espinoza',    'victor.espinoza@email.com',    '386-555-0142', 'Deland',            'FL', 6, 'First Base',   'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000043', 'Wesley',    'King',        'wesley.king@email.com',        '386-555-0143', 'Daytona Beach',     'FL', 8, 'Catcher',      'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000044', 'Xavier',    'Torres',      'xavier.torres@email.com',      '386-555-0144', 'Orlando',           'FL', 7, 'Third Base',   'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000045', 'Yohan',     'Park',        'yohan.park@email.com',         '386-555-0145', 'Winter Park',       'FL', 6, 'Second Base',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000046', 'Zach',      'Morgan',      'zach.morgan@email.com',        '386-555-0146', 'Clermont',          'FL', 7, 'Left Field',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000047', 'Aaron',     'Phillips',    'aaron.phillips@email.com',     '386-555-0147', 'Lake Mary',         'FL', 8, 'Right Field',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000048', 'Ben',       'Walker',      'ben.walker@email.com',         '386-555-0148', 'Altamonte Springs', 'FL', 6, 'Shortstop',    'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000049', 'Calvin',    'Hayes',       'calvin.hayes@email.com',       '386-555-0149', 'Casselberry',       'FL', 7, 'Left Center',  'Right', 'Left',  'XL'),
  ('a1000001-0000-0000-0000-000000000050', 'Darnell',   'Washington',  'darnell.washington@email.com', '386-555-0150', 'Orlando',           'FL', 8, 'Right Center', 'Right', 'Right', 'L'),
  -- 51–60
  ('a1000001-0000-0000-0000-000000000051', 'Eli',       'Turner',      'eli.turner@email.com',         '407-555-0151', 'Winter Springs',    'FL', 8, 'Pitcher',      'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000052', 'Fernando',  'Lopez',       'fernando.lopez@email.com',     '407-555-0152', 'Winter Garden',     'FL', 7, 'First Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000053', 'Garrett',   'Price',       'garrett.price@email.com',      '407-555-0153', 'Windermere',        'FL', 6, 'Catcher',      'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000054', 'Hank',      'Morrison',    'hank.morrison@email.com',      '407-555-0154', 'St. Cloud',         'FL', 7, 'Third Base',   'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000055', 'Isaac',     'Flores',      'isaac.flores@email.com',       '407-555-0155', 'Orlando',           'FL', 8, 'Second Base',  'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000056', 'Jerome',    'Barnes',      'jerome.barnes@email.com',      '407-555-0156', 'Kissimmee',         'FL', 6, 'Left Field',   'Left',  'Left',  'M'),
  ('a1000001-0000-0000-0000-000000000057', 'Keith',     'Henderson',   'keith.henderson@email.com',    '407-555-0157', 'Sanford',           'FL', 7, 'Right Field',  'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000058', 'Liam',      'O''Brien',    'liam.obrien@email.com',        '407-555-0158', 'Oviedo',            'FL', 8, 'Shortstop',    'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000059', 'Mason',     'Hart',        'mason.hart@email.com',         '407-555-0159', 'Maitland',          'FL', 7, 'Left Center',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000060', 'Nolan',     'Reed',        'nolan.reed@email.com',         '407-555-0160', 'Orlando',           'FL', 6, 'Right Center', 'Right', 'Right', 'L'),
  -- 61–70
  ('a1000001-0000-0000-0000-000000000061', 'Oscar',     'Gutierrez',   'oscar.gutierrez@email.com',    '321-555-0161', 'Longwood',          'FL', 7, 'Pitcher',      'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000062', 'Pete',      'Russo',       'pete.russo@email.com',         '321-555-0162', 'Apopka',            'FL', 8, 'First Base',   'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000063', 'Reggie',    'Coleman',     'reggie.coleman@email.com',     '321-555-0163', 'Deltona',           'FL', 6, 'Catcher',      'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000064', 'Sean',      'Murphy',      'sean.murphy@email.com',        '321-555-0164', 'Deland',            'FL', 7, 'Third Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000065', 'Terrance',  'Bell',        'terrance.bell@email.com',      '321-555-0165', 'Daytona Beach',     'FL', 8, 'Second Base',  'Right', 'Both',  'M'),
  ('a1000001-0000-0000-0000-000000000066', 'Ulysses',   'Ward',        'ulysses.ward@email.com',       '321-555-0166', 'Orlando',           'FL', 6, 'Left Field',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000067', 'Vince',     'Romano',      'vince.romano@email.com',       '321-555-0167', 'Winter Park',       'FL', 7, 'Right Field',  'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000068', 'Wayne',     'Fischer',     'wayne.fischer@email.com',      '321-555-0168', 'Clermont',          'FL', 8, 'Shortstop',    'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000069', 'Bryce',     'Chapman',     'bryce.chapman@email.com',      '321-555-0169', 'Lake Mary',         'FL', 6, 'Left Center',  'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000070', 'Damien',    'Simmons',     'damien.simmons@email.com',     '321-555-0170', 'Altamonte Springs', 'FL', 7, 'Right Center', 'Right', 'Right', 'XL'),
  -- 71–80
  ('a1000001-0000-0000-0000-000000000071', 'Andre',     'Butler',      'andre.butler@email.com',       '386-555-0171', 'Casselberry',       'FL', 8, 'Pitcher',      'Left',  'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000072', 'Blake',     'Owens',       'blake.owens@email.com',        '386-555-0172', 'Winter Springs',    'FL', 7, 'First Base',   'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000073', 'Caleb',     'Stone',       'caleb.stone@email.com',        '386-555-0173', 'Winter Garden',     'FL', 6, 'Catcher',      'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000074', 'Dillon',    'Marsh',       'dillon.marsh@email.com',       '386-555-0174', 'Windermere',        'FL', 7, 'Third Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000075', 'Evan',      'Webb',        'evan.webb@email.com',          '386-555-0175', 'St. Cloud',         'FL', 8, 'Second Base',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000076', 'Felix',     'Santos',      'felix.santos@email.com',       '386-555-0176', 'Orlando',           'FL', 6, 'Left Field',   'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000077', 'Grant',     'Douglas',     'grant.douglas@email.com',      '386-555-0177', 'Kissimmee',         'FL', 7, 'Right Field',  'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000078', 'Hugo',      'Perez',       'hugo.perez@email.com',         '386-555-0178', 'Sanford',           'FL', 8, 'Shortstop',    'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000079', 'Isaiah',    'Brown',       'isaiah.brown@email.com',       '386-555-0179', 'Oviedo',            'FL', 7, 'Left Center',  'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000080', 'Jaylen',    'Ross',        'jaylen.ross@email.com',        '386-555-0180', 'Maitland',          'FL', 6, 'Right Center', 'Right', 'Right', 'XL'),
  -- 81–90
  ('a1000001-0000-0000-0000-000000000081', 'Kendrick',  'Long',        'kendrick.long@email.com',      '689-555-0181', 'Orlando',           'FL', 7, 'Pitcher',      'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000082', 'Lance',     'Hawkins',     'lance.hawkins@email.com',      '689-555-0182', 'Longwood',          'FL', 8, 'First Base',   'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000083', 'Miguel',    'Castillo',    'miguel.castillo@email.com',    '689-555-0183', 'Apopka',            'FL', 6, 'Catcher',      'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000084', 'Noah',      'Kim',         'noah.kim@email.com',           '689-555-0184', 'Deltona',           'FL', 7, 'Third Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000085', 'Owen',      'Fitzgerald',  'owen.fitzgerald@email.com',    '689-555-0185', 'Deland',            'FL', 8, 'Second Base',  'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000086', 'Preston',   'Cole',        'preston.cole@email.com',       '689-555-0186', 'Daytona Beach',     'FL', 6, 'Left Field',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000087', 'Ramon',     'Santiago',    'ramon.santiago@email.com',     '689-555-0187', 'Orlando',           'FL', 7, 'Right Field',  'Right', 'Both',  'XL'),
  ('a1000001-0000-0000-0000-000000000088', 'Shawn',     'Barrett',     'shawn.barrett@email.com',      '689-555-0188', 'Winter Park',       'FL', 8, 'Shortstop',    'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000089', 'Travis',    'Perry',       'travis.perry@email.com',       '689-555-0189', 'Clermont',          'FL', 7, 'Left Center',  'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000090', 'Uriel',     'Medina',      'uriel.medina@email.com',       '689-555-0190', 'Lake Mary',         'FL', 6, 'Right Center', 'Right', 'Right', 'XL'),
  -- 91–100
  ('a1000001-0000-0000-0000-000000000091', 'Wendell',   'Todd',        'wendell.todd@email.com',       '407-555-0191', 'Altamonte Springs', 'FL', 7, 'Pitcher',      'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000092', 'Xander',    'Drake',       'xander.drake@email.com',       '407-555-0192', 'Casselberry',       'FL', 8, 'First Base',   'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000093', 'Yusuf',     'Ali',         'yusuf.ali@email.com',          '407-555-0193', 'Winter Springs',    'FL', 6, 'Catcher',      'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000094', 'Zion',      'Maxwell',     'zion.maxwell@email.com',       '407-555-0194', 'Winter Garden',     'FL', 7, 'Third Base',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000095', 'Adrian',    'Wolfe',       'adrian.wolfe@email.com',       '407-555-0195', 'Windermere',        'FL', 8, 'Second Base',  'Left',  'Left',  'M'),
  ('a1000001-0000-0000-0000-000000000096', 'Brock',     'Lawson',      'brock.lawson@email.com',       '407-555-0196', 'St. Cloud',         'FL', 6, 'Left Field',   'Right', 'Right', 'L'),
  ('a1000001-0000-0000-0000-000000000097', 'Cedric',    'Hunt',        'cedric.hunt@email.com',        '407-555-0197', 'Orlando',           'FL', 7, 'Right Field',  'Right', 'Right', 'XL'),
  ('a1000001-0000-0000-0000-000000000098', 'Dante',     'Powell',      'dante.powell@email.com',       '321-555-0198', 'Kissimmee',         'FL', 8, 'Shortstop',    'Right', 'Right', 'M'),
  ('a1000001-0000-0000-0000-000000000099', 'Emilio',    'Vargas',      'emilio.vargas@email.com',      '321-555-0199', 'Sanford',           'FL', 7, 'Left Center',  'Right', 'Left',  'L'),
  ('a1000001-0000-0000-0000-000000000100', 'Finn',      'Gallagher',   'finn.gallagher@email.com',     '321-555-0200', 'Oviedo',            'FL', 6, 'Right Center', 'Right', 'Right', 'XL')
on conflict (email) do nothing;

-- ── 2. REGISTRATIONS (100) ──────────────────────────────────
insert into public.registrations (id, tournament_id, player_id, registration_status, payment_status, paid_amount, draft_eligible, check_in_status) values
  -- ── confirmed / paid / draft_eligible: true (1–55) ───────
  ('c3000001-0000-0000-0000-000000000001', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000001', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000002', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000002', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000003', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000003', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000004', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000004', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000005', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000005', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000006', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000006', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000007', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000007', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000008', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000008', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000009', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000009', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000010', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000010', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000011', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000011', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000012', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000012', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000013', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000013', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000014', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000014', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000015', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000015', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000016', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000016', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000017', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000017', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000018', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000018', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000019', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000019', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000020', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000020', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000021', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000021', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000022', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000022', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000023', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000023', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000024', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000024', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000025', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000025', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000026', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000026', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000027', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000027', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000028', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000028', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000029', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000029', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000030', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000030', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000031', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000031', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000032', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000032', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000033', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000033', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000034', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000034', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000035', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000035', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000036', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000036', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000037', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000037', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000038', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000038', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000039', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000039', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000040', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000040', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000041', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000041', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000042', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000042', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000043', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000043', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000044', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000044', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000045', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000045', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000046', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000046', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000047', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000047', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000048', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000048', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000049', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000049', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000050', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000050', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000051', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000051', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000052', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000052', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000053', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000053', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000054', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000054', 'confirmed', 'paid',    65.00, true,  null),
  ('c3000001-0000-0000-0000-000000000055', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000055', 'confirmed', 'paid',    65.00, true,  null),
  -- ── confirmed / paid / draft_eligible: false (56–60) ─────
  ('c3000001-0000-0000-0000-000000000056', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000056', 'confirmed', 'paid',    65.00, false, null),
  ('c3000001-0000-0000-0000-000000000057', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000057', 'confirmed', 'paid',    65.00, false, null),
  ('c3000001-0000-0000-0000-000000000058', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000058', 'confirmed', 'paid',    65.00, false, null),
  ('c3000001-0000-0000-0000-000000000059', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000059', 'confirmed', 'paid',    65.00, false, null),
  ('c3000001-0000-0000-0000-000000000060', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000060', 'confirmed', 'paid',    65.00, false, null),
  -- ── pending / unpaid (61–78) ─────────────────────────────
  ('c3000001-0000-0000-0000-000000000061', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000061', 'pending',   'unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000062', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000062', 'pending',   'unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000063', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000063', 'pending',   'unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000064', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000064', 'pending',   'unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000065', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000065', 'pending',   'unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000066', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000066', 'pending',   'unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000067', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000067', 'pending',   'unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000068', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000068', 'pending',   'unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000069', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000069', 'pending',   'unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000070', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000070', 'pending',   'unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000071', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000071', 'pending',   'unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000072', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000072', 'pending',   'unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000073', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000073', 'pending',   'unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000074', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000074', 'pending',   'unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000075', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000075', 'pending',   'unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000076', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000076', 'pending',   'unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000077', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000077', 'pending',   'unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000078', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000078', 'pending',   'unpaid',  null,  true,  null),
  -- ── confirmed / payment pending (79–86) ──────────────────
  ('c3000001-0000-0000-0000-000000000079', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000079', 'confirmed', 'pending', null,  true,  null),
  ('c3000001-0000-0000-0000-000000000080', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000080', 'confirmed', 'pending', null,  true,  null),
  ('c3000001-0000-0000-0000-000000000081', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000081', 'confirmed', 'pending', null,  true,  null),
  ('c3000001-0000-0000-0000-000000000082', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000082', 'confirmed', 'pending', null,  true,  null),
  ('c3000001-0000-0000-0000-000000000083', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000083', 'confirmed', 'pending', null,  true,  null),
  ('c3000001-0000-0000-0000-000000000084', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000084', 'confirmed', 'pending', null,  true,  null),
  ('c3000001-0000-0000-0000-000000000085', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000085', 'confirmed', 'pending', null,  true,  null),
  ('c3000001-0000-0000-0000-000000000086', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000086', 'confirmed', 'pending', null,  true,  null),
  -- ── waitlisted / unpaid (87–92) ──────────────────────────
  ('c3000001-0000-0000-0000-000000000087', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000087', 'waitlisted','unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000088', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000088', 'waitlisted','unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000089', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000089', 'waitlisted','unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000090', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000090', 'waitlisted','unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000091', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000091', 'waitlisted','unpaid',  null,  true,  null),
  ('c3000001-0000-0000-0000-000000000092', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000092', 'waitlisted','unpaid',  null,  true,  null),
  -- ── cancelled / unpaid (93–96) ───────────────────────────
  ('c3000001-0000-0000-0000-000000000093', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000093', 'cancelled', 'unpaid',  null,  false, null),
  ('c3000001-0000-0000-0000-000000000094', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000094', 'cancelled', 'unpaid',  null,  false, null),
  ('c3000001-0000-0000-0000-000000000095', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000095', 'cancelled', 'unpaid',  null,  false, null),
  ('c3000001-0000-0000-0000-000000000096', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000096', 'cancelled', 'unpaid',  null,  false, null),
  -- ── confirmed / refunded (97–100) ────────────────────────
  ('c3000001-0000-0000-0000-000000000097', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000097', 'confirmed', 'refunded',65.00, false, null),
  ('c3000001-0000-0000-0000-000000000098', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000098', 'confirmed', 'refunded',65.00, false, null),
  ('c3000001-0000-0000-0000-000000000099', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000099', 'confirmed', 'refunded',65.00, false, null),
  ('c3000001-0000-0000-0000-000000000100', '073f7a54-505b-4634-9936-80a7fe23909a', 'a1000001-0000-0000-0000-000000000100', 'confirmed', 'refunded',65.00, false, null)
on conflict (tournament_id, player_id) do nothing;

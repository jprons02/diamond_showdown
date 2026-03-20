# Tournament Admin Side — Practical Uses and Features

The admin side should be treated as the tournament control center, not just a score-entry screen. The biggest win is making sure the admin can run the event quickly from a phone or tablet without needing spreadsheets or manual bracket math.

## Core Areas the Admin Side Should Handle

### 1. Tournament Setup

This is where admins create the tournament, set the date, registration limits, divisions if any, game format, inning and run rules, seeding rules, tiebreakers, and bracket type.

Admins should also be able to define:

- how many teams advance
- whether the event is pool play into bracket play
- straight elimination
- double elimination
- a custom tournament structure

### 2. Team and Roster Management

Admins should be able to:

- view all registered teams
- edit team names
- assign captains
- approve registrations
- mark payment status
- fix roster issues

This is also where they can move players if somebody entered something wrong or a captain registered twice.

### 3. Schedule and Field Management

Admins should be able to assign games to fields and time slots, move games if there is a delay, and see the full game board by field.

On tournament day, this becomes one of the most important screens.

### 4. Score Entry and Game Completion

Score entry should be fast.

Admins should be able to enter:

- Team A score
- Team B score
- final status
- optional notes

Once a game is marked final, the system should automatically update standings, seedings, and bracket progression.

There should also be an **undo** or **reopen game** option in case someone enters the wrong score.

### 5. Standings and Bracket Generation

This is one of the main reasons for having an admin system.

The system should automatically calculate:

- pool standings
- run differential if used
- head-to-head
- points allowed
- any other tournament tiebreaker rules

Admins should also be able to override a seed manually if needed, because real tournaments always have edge cases.

### 6. Check-In and Attendance

Admins should be able to mark teams as checked in when they arrive.

This helps avoid confusion, especially if a team no-shows or is late. You could also show roster completeness here if you require a minimum number of players.

### 7. Communication Tools

Very useful in real life.

Admins should be able to send updates to captains by email or SMS, such as:

- game time changed
- field changed
- rain delay
- bracket posted
- championship game starting

Even if SMS is not built on day one, the system should be designed so it can support it later.

### 8. Payments and Registration Verification

Admins should be able to see:

- who has paid
- who still owes
- refunds if needed
- whether a team is fully confirmed

This avoids showing unpaid teams in final scheduling unless approved.

> **Current implementation:** Player payments are processed via **Square** (Web Payments SDK). Payment records track provider, amount, currency, and raw payload for debugging.

### 9. Waivers and Documents

If waivers are required, admins should be able to see which players or teams completed them.

This could be simple at first, such as a checkbox per team confirming waiver collected.

### 10. Audit and Correction Tools

Very important.

If an admin changes a score or reseeds a bracket, that action should be logged. You do not want mystery changes during the event. Even a simple history log helps.

## Suggested Admin Structure

A practical admin structure could look like this:

### Dashboard

- today’s tournament status
- games in progress and upcoming
- teams checked in
- alerts or unresolved issues

### Tournaments

- create or edit tournament
- rules and format
- fields and schedule

### Teams

- registrations
- captains
- rosters
- payment status

### Games

- game list
- score entry
- results
- field assignments

### Standings and Bracket

- live standings
- generated bracket
- manual override tools

### Messages

- announcements to captains
- delay notices
- bracket-ready notice

### Reports

- registrations
- payments
- final results
- participation history

## Practical Uses People Often Forget

### Player History

This is where admin can see whether a player has participated before.

If a player record is tied by email and possibly phone number, admin could see:

- prior tournaments played
- prior team names
- no-show history
- waiver history

### Day-Of Issue Handling

Admins will likely need to:

- merge duplicate players
- swap a player to another team
- mark forfeits
- disqualify a team if necessary
- add a late team
- remove a dropped team

### Public Site Control

Admin may need toggles for:

- registration open or closed
- standings visible or hidden
- bracket published or unpublished
- scores live or hidden until verified

That last one is useful if staff enter scores but only an admin can officially publish them.

## Role Types

It would be smart to support different admin roles, not just one all-powerful admin.

### Super Admin

- manages tournaments
- manages rules
- manages admin users

### Tournament Admin

- manages a specific tournament

### Scorekeeper

- enters scores only

### Check-In Staff

- manages arrivals
- may also handle waivers

This keeps things safer than giving everyone full access.

## Recommended Real-World Workflow

> **Admin access control:** Only whitelisted emails (stored in `admin_whitelist`) may log in. Authentication uses Google OAuth through Supabase.

If you want the system to feel professional, the admin side should be built around these real tournament workflows:

1. Before the event: registration, payments, setup
2. During the event: check-in, schedule, score entry, bracket updates
3. After the event: final standings, winner archive, history and reporting

## Main Value of the Admin Side

The most valuable thing is making score entry automatically ripple into standings and brackets without manual work.

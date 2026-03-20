# Slow-Pitch Softball Tournament App — Database Schema Context

This document defines the recommended database schema for the softball tournament app.

The app supports:

- repeated tournaments over time
- player registration and payment
- draft-based team assignment
- pool play and tournament bracket games
- admin scoring and tournament management
- optional coaches, announcements, and audit logs

---

## Core Modeling Rules

1. **A player is a reusable person profile across time.**
   - A player can register for many tournaments.
   - The `players` table should not store tournament-specific team assignment.

2. **A registration is a player entering one specific tournament.**
   - `registrations` is the join between `players` and `tournaments`.
   - This is where tournament-specific status and registration details live.

3. **Teams belong to one tournament only.**
   - A team is created for a specific tournament.
   - Players are assigned to teams after the draft through `team_players`.

4. **Games are matchups between teams within one tournament.**
   - One row in `games` = one scheduled or completed game.
   - A team appears in many `games` rows across pool play and bracket play.

5. **Returning-player detection should be based on email.**
   - On registration submit, normalize the email and attempt to find an existing `players` row.
   - If found, reuse that `player.id`.
   - If not found, create a new `players` row.
   - Then create a new `registrations` row for the current tournament.

---

# Table Definitions

## 1) `tournaments`

Represents a single event, such as "Spring Classic 2026".

### Purpose

- Top-level table for each tournament
- Most tournament-specific records point back to this table with `tournament_id`

### Fields

- `id` — primary key
- `name` — display name of tournament
- `slug` — unique URL-safe identifier
- `event_date` — primary date of event
- `location_name` — venue name
- `location_address` — venue address
- `registration_open` — when registration opens
- `registration_close` — when registration closes
- `draft_datetime` — when the draft happens
- `min_players` — optional minimum player count
- `max_players` — registration cap
- `entry_fee` — cost to enter
- `status` — e.g. `draft`, `open`, `closed`, `completed`, `cancelled`
- `bracket_format` — e.g. `single_elimination`, `double_elimination`, `pool_to_bracket`, `custom`
- `rules_text` — optional tournament rules copy
- `event_end_date` — optional end date for multi-day events
- `standings_visible` — boolean, controls whether pool standings are shown publicly
- `bracket_published` — boolean, controls whether the bracket is visible publicly
- `scores_live` — boolean, controls whether live scores are shown on public pages
- `created_at`
- `updated_at`

### Relationships

- one tournament has many `registrations`
- one tournament has many `teams`
- one tournament has many `games`
- one tournament has many `fields`
- one tournament has many `announcements`
- one tournament has many `tournament_admins`
- one tournament has many `tournament_coaches`

---

## 2) `players`

Represents a reusable person profile across all tournaments.

### Purpose

- One row per real person
- Used to detect returning players across tournaments

### Fields

- `id` — primary key
- `first_name`
- `last_name`
- `email` — should be unique; normalize to lowercase before lookup/save
- `phone`
- `city`
- `state`
- `skill_rating` — optional general/default skill indicator
- `preferred_position` — optional general/default position
- `throws`
- `bats`
- `shirt_size`
- `notes`
- `created_at`
- `updated_at`

### Relationships

- one player has many `registrations`

### Notes

- Do **not** store `team_id` directly on `players`
- A player may play for different teams in different tournaments

---

## 3) `registrations`

Represents one player entering one tournament.

### Purpose

- Join table between `players` and `tournaments`
- Stores tournament-specific registration state

### Fields

- `id` — primary key
- `tournament_id` — foreign key to `tournaments.id`
- `player_id` — foreign key to `players.id`
- `registration_status` — e.g. `pending`, `confirmed`, `waitlisted`, `cancelled`, `refunded`, `checked_in`, `no_show`
- `payment_status` — e.g. `unpaid`, `pending`, `paid`, `refunded`
- `paid_amount`
- `draft_eligible` — boolean
- `check_in_status` — optional event-day check-in state
- `emergency_contact_name`
- `emergency_contact_phone`
- `created_at`
- `updated_at`

### Relationships

- belongs to one `tournament`
- belongs to one `player`
- one registration may have one `payment` record in MVP, or more if expanded later
- one registration may have one `waiver`
- one registration may become one `team_players` roster assignment

### Constraints

- unique `(tournament_id, player_id)`
  - prevents the same player from registering twice for the same tournament

### Notes

- The registration form should effectively do:
  1. normalize email
  2. find/create `players` row
  3. create `registrations` row for current tournament

---

## 4) `payments`

Stores payment information tied to a registration.

### Purpose

- Payment/audit history
- Keeps payment details separate from general registration state

### Fields

- `id` — primary key
- `registration_id` — foreign key to `registrations.id`
- `provider` — e.g. `square`
- `provider_payment_intent_id`
- `provider_checkout_session_id`
- `amount`
- `currency`
- `status` — e.g. `pending`, `paid`, `failed`, `refunded`
- `paid_at`
- `refunded_at`
- `raw_payload_json` — raw provider payload if desired
- `created_at`
- `updated_at`

### Relationships

- belongs to one `registration`

### Notes

- Keeping this separate allows easier refunds, retries, and audit trails

---

## 5) `waivers`

Stores legal waiver acceptance for a registration.

### Purpose

- Tracks proof of waiver acceptance
- Better than only storing a boolean on `registrations`

### Fields

- `id` — primary key
- `registration_id` — foreign key to `registrations.id`
- `waiver_version`
- `accepted` — boolean
- `accepted_at`
- `ip_address`
- `user_agent`
- `signature_name`
- `created_at`
- `updated_at`

### Relationships

- belongs to one `registration`

### Constraints

- `registration_id` should be unique if only one waiver record per registration is allowed

---

## 6) `teams`

Represents a tournament-specific team.

### Purpose

- Drafted teams for one tournament
- A fresh set of teams is created for each tournament

### Fields

- `id` — primary key
- `tournament_id` — foreign key to `tournaments.id`
- `name`
- `seed`
- `coach_assignment_type`
- `coach_name` — optional simple version; can be replaced by join tables for coach records
- `color`
- `created_at`
- `updated_at`

### Relationships

- belongs to one `tournament`
- one team has many `team_players`
- one team appears in many `games` as home team
- one team appears in many `games` as away team
- one team may appear in many `games` as winner
- one team may appear in many `games` as loser
- one team may have many `team_coaches`

---

## 7) `team_players`

Represents a drafted roster spot: one registration assigned to one team.

### Purpose

- Stores post-draft team assignment
- Connects a tournament registration to a tournament team

### Fields

- `id` — primary key
- `tournament_id` — foreign key to `tournaments.id`
- `team_id` — foreign key to `teams.id`
- `registration_id` — foreign key to `registrations.id`
- `draft_pick_number`
- `is_captain`
- `is_locked`
- `created_at`
- `updated_at`

### Relationships

- belongs to one `tournament`
- belongs to one `team`
- belongs to one `registration`

### Constraints

- `registration_id` unique
  - one registration can only be assigned to one team once

### Notes

- This is where the draft result lives
- Prefer `registration_id` over storing redundant `player_id` here

---

## 8) `fields`

Represents playable diamonds/fields for one tournament.

### Purpose

- Supports scheduling games across one or more fields

### Fields

- `id` — primary key
- `tournament_id` — foreign key to `tournaments.id`
- `name` — e.g. `Field 1`, `Diamond A`
- `sort_order`
- `notes`
- `created_at`
- `updated_at`

### Relationships

- belongs to one `tournament`
- one field has many `games`

---

## 9) `games`

Represents one scheduled or completed game between two teams.

### Purpose

- Stores pool play, bracket games, championship, consolation, etc.
- One row = one matchup

### Fields

- `id` — primary key
- `tournament_id` — foreign key to `tournaments.id`
- `game_type` — e.g. `pool`, `bracket`, `championship`, `consolation`
- `round_name` — e.g. `Pool Round 1`, `Semifinal`, `Championship`
- `game_number` — optional display/order number
- `field_id` — foreign key to `fields.id`
- `home_team_id` — foreign key to `teams.id`
- `away_team_id` — foreign key to `teams.id`
- `winner_team_id` — foreign key to `teams.id`, nullable until final
- `loser_team_id` — foreign key to `teams.id`, nullable until final
- `start_time`
- `end_time`
- `home_score`
- `away_score`
- `status` — e.g. `scheduled`, `in_progress`, `final`, `cancelled`, `forfeit`
- `bracket_position` — optional label/slot metadata
- `notes`
- `created_at`
- `updated_at`

### Relationships

- belongs to one `tournament`
- belongs to one `field` optionally
- references one home `team`
- references one away `team`
- references one winner `team` optionally
- references one loser `team` optionally
- one game has many `score_audit_log` rows

### Notes

- Teams will have multiple games in the same tournament
- Standings are usually derived from game results, not stored directly on this table
- This table should not connect directly to `registrations`

---

## 10) `admins`

Represents users who can manage tournaments.

### Purpose

- Tournament operators, scorekeepers, owners, etc.

### Fields

- `id` — primary key
- `auth_user_id` — optional link to Supabase `auth.users` for OAuth login
- `first_name`
- `last_name`
- `email` — unique
- `phone`
- `role` — e.g. `super_admin`, `admin`, `scorekeeper`, `check_in`, `viewer`
- `created_at`
- `updated_at`

### Relationships

- one admin has many `tournament_admins`
- one admin may create many `announcements`
- one admin may create many `score_audit_log` rows

---

## 11) `tournament_admins`

Join table assigning admins to tournaments.

### Purpose

- Supports one admin managing multiple tournaments
- Supports multiple admins on one tournament

### Fields

- `id` — primary key
- `tournament_id` — foreign key to `tournaments.id`
- `admin_id` — foreign key to `admins.id`
- `permission_level` — e.g. `owner`, `admin`, `scorekeeper`, `viewer`
- `created_at`
- `updated_at`

### Relationships

- belongs to one `tournament`
- belongs to one `admin`

### Constraints

- unique `(tournament_id, admin_id)`

---

## 12) `coaches`

Represents reusable coach records.

### Purpose

- Coaches may appear in multiple tournaments over time

### Fields

- `id` — primary key
- `first_name`
- `last_name`
- `email`
- `phone`
- `notes`
- `created_at`
- `updated_at`

### Relationships

- one coach has many `tournament_coaches`
- one coach has many `team_coaches`

---

## 13) `tournament_coaches`

Join table assigning coaches to a tournament.

### Purpose

- Registers coaches as available participants for one event

### Fields

- `id` — primary key
- `tournament_id` — foreign key to `tournaments.id`
- `coach_id` — foreign key to `coaches.id`
- `created_at`
- `updated_at`

### Relationships

- belongs to one `tournament`
- belongs to one `coach`

### Constraints

- unique `(tournament_id, coach_id)`

---

## 14) `team_coaches`

Join table assigning coaches to teams.

### Purpose

- Attaches one or more coaches to a tournament team

### Fields

- `id` — primary key
- `team_id` — foreign key to `teams.id`
- `coach_id` — foreign key to `coaches.id`
- `is_head_coach`
- `created_at`
- `updated_at`

### Relationships

- belongs to one `team`
- belongs to one `coach`

### Constraints

- unique `(team_id, coach_id)`

---

## 15) `announcements`

Represents updates posted for a tournament.

### Purpose

- Broadcast event messages, schedule notes, weather updates, etc.

### Fields

- `id` — primary key
- `tournament_id` — foreign key to `tournaments.id`
- `title`
- `body`
- `audience` — e.g. `all`, `players`, `coaches`, `admins`
- `published_at`
- `created_by_admin_id` — foreign key to `admins.id`
- `created_at`
- `updated_at`

### Relationships

- belongs to one `tournament`
- belongs to one `admin` as creator

---

## 16) `admin_whitelist`

Controls which email addresses are allowed to access the admin area.

### Purpose

- Only emails in this table may log in to `/admin`
- Google OAuth is the sole login method; on callback the app checks this table

### Fields

- `id` — primary key
- `email` — unique, the whitelisted email address
- `created_at`

### Notes

- Row-level security is enabled; authenticated users can only check their own email
- Seed data is inserted via migration

---

## 17) `score_audit_log`

Tracks score edits for accountability.

### Purpose

- Keeps a record of who changed game scores and when

### Fields

- `id` — primary key
- `game_id` — foreign key to `games.id`
- `changed_by_admin_id` — foreign key to `admins.id`
- `previous_home_score`
- `previous_away_score`
- `new_home_score`
- `new_away_score`
- `change_reason`
- `created_at`

### Relationships

- belongs to one `game`
- belongs to one `admin`

---

# Relationship Summary

## Core relationships

- `registrations.tournament_id -> tournaments.id`
- `registrations.player_id -> players.id`
- `payments.registration_id -> registrations.id`
- `waivers.registration_id -> registrations.id`
- `teams.tournament_id -> tournaments.id`
- `team_players.tournament_id -> tournaments.id`
- `team_players.team_id -> teams.id`
- `team_players.registration_id -> registrations.id`
- `fields.tournament_id -> tournaments.id`
- `games.tournament_id -> tournaments.id`
- `games.field_id -> fields.id`
- `games.home_team_id -> teams.id`
- `games.away_team_id -> teams.id`
- `games.winner_team_id -> teams.id`
- `games.loser_team_id -> teams.id`
- `tournament_admins.tournament_id -> tournaments.id`
- `tournament_admins.admin_id -> admins.id`
- `tournament_coaches.tournament_id -> tournaments.id`
- `tournament_coaches.coach_id -> coaches.id`
- `team_coaches.team_id -> teams.id`
- `team_coaches.coach_id -> coaches.id`
- `announcements.tournament_id -> tournaments.id`
- `announcements.created_by_admin_id -> admins.id`
- `score_audit_log.game_id -> games.id`
- `score_audit_log.changed_by_admin_id -> admins.id`

---

# Simplified Mental Model

```text
players
   |
   v
registrations --------> tournaments
   |                        |
   |                        +---- teams ----< team_players
   |                        |
   |                        +---- games
   |                        |
   |                        +---- fields
   |                        |
   |                        +---- announcements
   |
   +---- payments
   |
   +---- waivers

admins ----< tournament_admins >---- tournaments
admins ----< score_audit_log >---- games

admin_whitelist (standalone — gate for admin login)

coaches ----< tournament_coaches >---- tournaments
coaches ----< team_coaches >---- teams
```

---

# Recommended MVP Table Set

For the first build, these are the most important tables:

- `tournaments`
- `players`
- `registrations`
- `payments`
- `waivers`
- `teams`
- `team_players`
- `fields`
- `games`
- `admins`
- `admin_whitelist`
- `tournament_admins`
- `announcements`
- `score_audit_log`

Optional later additions:

- `coaches`
- `tournament_coaches`
- `team_coaches`

---

# Recommended Registration Flow

1. Player submits registration form
2. Normalize email to lowercase and trim whitespace
3. Lookup `players` by email
4. If player exists, reuse `players.id`
5. If player does not exist, create new `players` row
6. Create `registrations` row for current tournament
7. Create/update `payments` row after provider callback/webhook
8. Create `waivers` row when waiver is accepted
9. After draft, create `team_players` row linking registration to team

---

# Environment Guidance

Use separate databases per environment:

- dev database
- production database

Do **not** create separate table names like:

- `players_dev`
- `players_prod`

Instead, use the same schema/table names in each environment and switch via environment variables.

---

# Important Design Decisions

- Use `email` on `players` to detect returning players
- Use `registrations` as the per-tournament join and event-specific state
- Use `team_players` to store draft/team assignment
- Do not connect `games` directly to `registrations`
- Do not store `team_id` directly on `players`
- One game row = one matchup between two teams
- One team can appear in many game rows within a tournament

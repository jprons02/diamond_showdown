# Tournament Lifecycle — Step by Step

This document describes the full end-to-end flow for running a tournament in Diamond Showdown, from creation through completion. It covers what is currently built, what is manual, and what is planned.

---

## Phase 1 — Setup (Admin)

### 1. Create the Tournament

Admin creates a tournament record with:

- Name, slug, event date (and optional event end date for multi-day events), location
- Registration open/close window
- Draft datetime
- Min/max players, entry fee
- Bracket format (`single_elimination`, `double_elimination`, `pool_to_bracket`, `custom`)
- Visibility toggles (`standings_visible`, `bracket_published`, `scores_live`)
- Status starts as `draft` — not visible for registration yet

### 2. Create Fields

Admin creates the physical fields/diamonds that games will be played on (e.g. "Field 1", "Diamond A").
These are used when scheduling games.

### 3. Open Registration

Admin sets tournament `status` to `open`.
This makes the tournament visible and accepting registrations on the public-facing site.

> **Admin Access:** Only email addresses listed in the `admin_whitelist` table may log in to `/admin`. Authentication uses Google OAuth via Supabase; on callback, the app verifies the email against `admin_whitelist` before granting access.

---

## Phase 2 — Registration (Players)

### 4. Players Register

Players submit the public registration form.
The app:

1. Normalizes email (lowercase, trimmed)
2. Finds or creates a `players` row (returning player detection)
3. Creates a `registrations` row for this tournament
4. Collects payment via Square and creates/updates a `payments` row
5. Records waiver acceptance in a `waivers` row

### 5. Admin Manages Registrations

Admin reviews registrations and can:

- Confirm payment status
- Handle waitlisted players
- Mark `draft_eligible` (controls who appears in the draft pool)
- Cancel or refund registrations as needed

### 6. Close Registration

Admin sets tournament `status` to `closed` when the registration window ends.

---

## Phase 3 — Draft Prep (Admin)

### 7. Create Teams

Admin manually creates teams for the tournament:

- Sets team name, color, seed
- Assigns a coach name (simple text field — full coach profiles are a future feature)

> **Coach profiles:** The schema supports full `coaches`, `tournament_coaches`, and `team_coaches` tables, but the current admin UI uses a simple `coach_name` text field on each team. Full coach management is a planned addition.

### 8. Run the Draft

Admin (or a future draft tool) assigns confirmed, draft-eligible registrations to teams by creating `team_players` rows.
Each row stores:

- Which registration → which team
- Draft pick number
- Whether the player is team captain
- Lock status

---

## Phase 4 — Scheduling (Admin)

### 9. Create Pool Play Games (Manual)

Admin manually creates game rows for pool play. Each game requires:

- Home team / Away team
- Field assignment
- Start time
- Game type (`pool`)
- Round name (e.g. "Pool Round 1")
- Optional game number

> **There is no auto-schedule generator.** All games are created manually via the admin Games & Scores page.

---

## Phase 5 — Tournament Day

### 10. Player Check-In

Admin marks players as they arrive using the Check-In admin page.
Check-in status options: `not_arrived` → `checked_in` or `no_show`.
This also updates the registration's `registration_status` field.

### 11. Games Are Played

Admin marks a game as `in_progress` when it starts, then enters scores when it ends.
Score entry:

- Records `home_score` and `away_score`
- Sets game `status` to `final`
- Automatically writes a `score_audit_log` row (who changed it, previous scores, notes)
- Sets `winner_team_id` and `loser_team_id`

Admins can **reopen** a final game to correct a score if needed.

### 12. Standings (Planned)

Standings are derived from `games` results — they are **not stored** in a separate table.
A standings calculation would query all `final` pool games for the tournament and compute:

- Wins / Losses
- Run differential
- Runs scored / allowed
- Head-to-head (for tiebreakers)

> **Not yet built.** Standings must be computed from game results at query time.

---

## Phase 6 — Bracket

### 13. Generate Bracket

After all pool games are complete, the admin generates bracket games from the Games & Scores admin page.

The system seeds teams by:

1. Wins (descending)
2. Run differential (descending)
3. Runs scored (descending)

Bracket matchups are created using standard seeding (1 vs N, 2 vs N−1, etc.) with automatic bye handling for non-power-of-2 team counts.

> **Currently supports single-elimination bracket generation.** Double elimination, consolation brackets, and advanced tiebreakers (head-to-head) are planned.

If bracket games already exist, the admin is warned before re-generating (existing bracket games are replaced).

### 14. Publish Bracket

Admin toggles `bracket_published = true` on the tournament.
This makes the bracket visible on the public tournament page.

### 15. Play Bracket Games

Same score entry flow as pool play. Bracket games progress until a champion is determined.

---

## Phase 7 — Wrap-Up (Admin)

### 16. Publish Standings

Admin toggles `standings_visible = true` to show standings on the public site.

### 17. Complete the Tournament

Admin sets tournament `status` to `completed`.

---

## Visibility Toggles (on `tournaments`)

These three flags control what the public site shows, independently of tournament status:

| Field               | Effect                           |
| ------------------- | -------------------------------- |
| `scores_live`       | Show live scores on public pages |
| `standings_visible` | Show pool standings tab publicly |
| `bracket_published` | Show bracket tab publicly        |

---

## What Is Built vs. Planned

| Feature                            | Status                     |
| ---------------------------------- | -------------------------- |
| Tournament CRUD                    | ✅ Built                   |
| Fields management                  | ✅ Built                   |
| Player registration + payment      | ✅ Built (Square)          |
| Waiver collection                  | ✅ Built                   |
| Admin registration management      | ✅ Built                   |
| Teams + roster management          | ✅ Built                   |
| Draft / `team_players` assignment  | ✅ Built (basic)           |
| Manual game scheduling             | ✅ Built                   |
| Score entry + audit log            | ✅ Built                   |
| Check-in                           | ✅ Built                   |
| Announcements                      | ✅ Built                   |
| Bracket format field on tournament | ✅ Built                   |
| Admin whitelist + Google OAuth     | ✅ Built                   |
| Visibility toggles (settings)      | ✅ Built                   |
| Bracket generation (single-elim)   | ✅ Built (basic)           |
| Public bracket view                | ✅ Built                   |
| Public draft board view            | ✅ Built                   |
| Standings calculation              | 🔲 Planned                 |
| Double-elim / consolation brackets | 🔲 Planned                 |
| Full coach profiles                | 🔲 Planned (schema exists) |
| Auto-schedule generator            | 🔲 Planned                 |
| Admin role/permission UI           | 🔲 Planned (schema exists) |

---

## Key Design Rules

- **`players`** is a reusable person record across all tournaments (identified by email)
- **`registrations`** is the per-tournament join — all tournament-specific state lives here
- **`team_players`** stores draft results — do not put `team_id` on `players`
- **`games`** does not connect directly to `registrations`
- **One `games` row = one matchup** — a team appears in many rows across pool + bracket
- **Standings are derived** from game results at query time, never stored directly
- **Separate databases** for dev and production — same schema, different environment variables

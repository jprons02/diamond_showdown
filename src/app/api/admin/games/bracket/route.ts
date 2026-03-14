import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// ─── Helpers ────────────────────────────────────────────────

function nextPowerOf2(n: number): number {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

function getRoundLabel(roundIdx: number, totalRounds: number): string {
  const fromEnd = totalRounds - roundIdx;
  if (fromEnd === 1) return "Championship";
  if (fromEnd === 2) return "Semifinals";
  if (fromEnd === 3) return "Quarterfinals";
  if (fromEnd === 4) return "Round of 16";
  return `Round ${roundIdx + 1}`;
}

/** Standard single-elimination seeding: 1vN, 2v(N-1), … for a bracket of `size` slots. */
function buildR1Matchups(
  teams: { id: string }[],
  bracketSize: number,
): Array<{ home: { id: string } | null; away: { id: string } | null }> {
  const n = teams.length;
  const matchups: Array<{
    home: { id: string } | null;
    away: { id: string } | null;
  }> = [];
  for (let i = 0; i < bracketSize / 2; i++) {
    const topIdx = i;
    const botIdx = bracketSize - 1 - i;
    matchups.push({
      home: topIdx < n ? teams[topIdx] : null,
      away: botIdx < n ? teams[botIdx] : null,
    });
  }
  return matchups;
}

// ─── POST /api/admin/games/bracket ──────────────────────────

/**
 * Generates bracket games for a tournament.
 *
 * Steps:
 *  1. Validate all pool games are final/forfeit/cancelled.
 *  2. Compute standings: wins → run differential → runs scored.
 *     Note: "Priority seeding" tiebreaker rules (head-to-head, etc.) are TBD.
 *  3. Re-seed teams and persist new seeds.
 *  4. Delete any existing bracket/championship games.
 *  5. Insert Round 1 games (real matchups) + TBD placeholders for later rounds.
 */
export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();
  const { tournament_id } = body as { tournament_id?: string };

  if (!tournament_id) {
    return NextResponse.json(
      { error: "tournament_id is required" },
      { status: 400 },
    );
  }

  // 1. Fetch pool games
  const { data: poolGames, error: pgErr } = await supabase
    .from("games")
    .select("*")
    .eq("tournament_id", tournament_id)
    .eq("game_type", "pool");

  if (pgErr)
    return NextResponse.json({ error: pgErr.message }, { status: 500 });

  const incomplete = (poolGames ?? []).filter(
    (g) =>
      g.status !== "final" &&
      g.status !== "forfeit" &&
      g.status !== "cancelled",
  );

  if (incomplete.length > 0) {
    return NextResponse.json(
      {
        error: "Not all pool games are final",
        incomplete_count: incomplete.length,
      },
      { status: 422 },
    );
  }

  // 2. Fetch teams
  const { data: teams, error: teamsErr } = await supabase
    .from("teams")
    .select("id, name, seed")
    .eq("tournament_id", tournament_id)
    .order("seed", { ascending: true });

  if (teamsErr)
    return NextResponse.json({ error: teamsErr.message }, { status: 500 });

  if (!teams || teams.length < 2) {
    return NextResponse.json(
      { error: "Need at least 2 teams to generate a bracket" },
      { status: 422 },
    );
  }

  // 3. Compute standings from pool games
  //    Seeding priority: wins DESC → run differential DESC → runs scored DESC
  //    NOTE: Additional "priority seeding" tiebreaker rules (e.g. head-to-head) are TBD.
  const stats = new Map<
    string,
    { wins: number; losses: number; runDiff: number; runsScored: number }
  >();
  for (const t of teams) {
    stats.set(t.id, { wins: 0, losses: 0, runDiff: 0, runsScored: 0 });
  }

  for (const g of poolGames ?? []) {
    if (!g.home_team_id || !g.away_team_id || g.status === "cancelled")
      continue;

    const home = stats.get(g.home_team_id);
    const away = stats.get(g.away_team_id);
    if (!home || !away) continue;

    const hs = g.home_score ?? 0;
    const as_ = g.away_score ?? 0;
    home.runsScored += hs;
    away.runsScored += as_;
    home.runDiff += hs - as_;
    away.runDiff += as_ - hs;

    if (g.winner_team_id === g.home_team_id) {
      home.wins++;
      away.losses++;
    } else if (g.winner_team_id === g.away_team_id) {
      away.wins++;
      home.losses++;
    }
  }

  // Sort and assign seeds
  const seededTeams = [...teams].sort((a, b) => {
    const sa = stats.get(a.id)!;
    const sb = stats.get(b.id)!;
    if (sb.wins !== sa.wins) return sb.wins - sa.wins;
    if (sb.runDiff !== sa.runDiff) return sb.runDiff - sa.runDiff;
    return sb.runsScored - sa.runsScored;
  });

  // Persist new seeds
  for (let i = 0; i < seededTeams.length; i++) {
    await supabase
      .from("teams")
      .update({ seed: i + 1 })
      .eq("id", seededTeams[i].id);
  }

  // 4. Delete existing bracket/championship games
  await supabase
    .from("games")
    .delete()
    .eq("tournament_id", tournament_id)
    .in("game_type", ["bracket", "championship"]);

  // 5. Build and insert bracket games
  const n = seededTeams.length;
  const bracketSize = nextPowerOf2(n);
  const totalRounds = Math.log2(bracketSize);
  const byes = bracketSize - n; // top `byes` seeds skip Round 1
  const byeTeams = seededTeams.slice(0, byes);

  const gamesToInsert: Record<string, unknown>[] = [];
  let gameNumber = 1;

  for (let round = 0; round < totalRounds; round++) {
    const label = getRoundLabel(round, totalRounds);
    const isFinalRound = round === totalRounds - 1;
    const slotsInRound = bracketSize / Math.pow(2, round + 1);

    if (round === 0) {
      // Round 1: create only real matchups (skip bye slots)
      const matchups = buildR1Matchups(seededTeams, bracketSize);
      let slotNum = 0;
      for (const m of matchups) {
        slotNum++;
        if (m.home === null || m.away === null) continue; // bye — skip
        gamesToInsert.push({
          tournament_id,
          game_type: "bracket",
          round_name: label,
          game_number: gameNumber++,
          home_team_id: m.home.id,
          away_team_id: m.away.id,
          status: "scheduled",
          bracket_position: `r1_g${slotNum}`,
        });
      }
    } else {
      // Later rounds: TBD placeholders, with bye teams placed in Round 2 home slots
      for (let slot = 0; slot < slotsInRound; slot++) {
        const byeTeam =
          round === 1 && slot < byeTeams.length ? byeTeams[slot] : null;
        gamesToInsert.push({
          tournament_id,
          game_type: isFinalRound ? "championship" : "bracket",
          round_name: label,
          game_number: gameNumber++,
          home_team_id: byeTeam?.id ?? null,
          away_team_id: null,
          status: "scheduled",
          bracket_position: `r${round + 1}_g${slot + 1}`,
        });
      }
    }
  }

  const { data: createdGames, error: insertErr } = await supabase
    .from("games")
    .insert(gamesToInsert)
    .select();

  if (insertErr)
    return NextResponse.json({ error: insertErr.message }, { status: 500 });

  // Return seedings summary + created games
  const seedings = seededTeams.map((t, i) => {
    const s = stats.get(t.id)!;
    return {
      team_id: t.id,
      team_name: t.name,
      seed: i + 1,
      wins: s.wins,
      losses: s.losses,
      run_differential: s.runDiff,
      runs_scored: s.runsScored,
    };
  });

  return NextResponse.json({ seedings, games: createdGames }, { status: 201 });
}

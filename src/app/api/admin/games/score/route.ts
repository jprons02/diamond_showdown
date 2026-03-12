import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/** POST /api/admin/games/score — enter or update a game score and auto-audit */
export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();
  const { game_id, home_score, away_score, notes, admin_id } = body;

  if (!game_id || home_score == null || away_score == null) {
    return NextResponse.json(
      { error: "game_id, home_score, and away_score are required" },
      { status: 400 },
    );
  }

  // Fetch current game to log previous scores
  const { data: game, error: fetchErr } = await supabase
    .from("games")
    .select("*")
    .eq("id", game_id)
    .single();

  if (fetchErr || !game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  // Write audit log if scores are being changed
  if (game.home_score !== null || game.away_score !== null) {
    await supabase.from("score_audit_log").insert({
      game_id,
      changed_by_admin_id: admin_id || null,
      previous_home_score: game.home_score,
      previous_away_score: game.away_score,
      new_home_score: home_score,
      new_away_score: away_score,
      change_reason: notes || null,
    });
  }

  // Determine winner/loser
  const winner_team_id =
    home_score > away_score
      ? game.home_team_id
      : home_score < away_score
        ? game.away_team_id
        : null;
  const loser_team_id =
    home_score > away_score
      ? game.away_team_id
      : home_score < away_score
        ? game.home_team_id
        : null;

  const { data: updated, error: updateErr } = await supabase
    .from("games")
    .update({
      home_score,
      away_score,
      status: "final",
      winner_team_id,
      loser_team_id,
      notes: notes || game.notes,
    })
    .eq("id", game_id)
    .select()
    .single();

  if (updateErr)
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  return NextResponse.json(updated);
}

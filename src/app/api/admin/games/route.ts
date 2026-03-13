import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/** GET /api/admin/games?tournament_id=... */
export async function GET(req: NextRequest) {
  const supabase = createServiceClient();
  const tournamentId = req.nextUrl.searchParams.get("tournament_id");

  let query = supabase
    .from("games")
    .select(
      "*, home_team:teams!games_home_team_id_fkey(*), away_team:teams!games_away_team_id_fkey(*), field:fields(*)",
    )
    .order("game_number", { ascending: true });

  if (tournamentId) {
    query = query.eq("tournament_id", tournamentId);
  }

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** POST /api/admin/games — create a game */
export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();

  if (!body.tournament_id) {
    return NextResponse.json(
      { error: "tournament_id is required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("games")
    .insert(body)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

/** PATCH /api/admin/games — update a game */
export async function PATCH(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("games")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

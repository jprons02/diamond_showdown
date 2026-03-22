import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/** POST /api/admin/team-players — assign a player to a team */
export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();
  const { tournament_id, team_id, registration_id, draft_pick_number } = body;

  if (!tournament_id || !team_id || !registration_id)
    return NextResponse.json(
      { error: "tournament_id, team_id, and registration_id are required" },
      { status: 400 },
    );

  const { data, error } = await supabase
    .from("team_players")
    .insert({ tournament_id, team_id, registration_id, draft_pick_number })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** PATCH /api/admin/team-players — update a team_player row (e.g. toggle captain) */
export async function PATCH(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("team_players")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** DELETE /api/admin/team-players?id=... */
export async function DELETE(req: NextRequest) {
  const supabase = createServiceClient();
  const id = req.nextUrl.searchParams.get("id");

  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase.from("team_players").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

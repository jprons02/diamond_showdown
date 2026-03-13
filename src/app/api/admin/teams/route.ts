import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/** GET /api/admin/teams?tournament_id=...&include_players=true */
export async function GET(req: NextRequest) {
  const tournament_id = req.nextUrl.searchParams.get("tournament_id");
  const includePlayers =
    req.nextUrl.searchParams.get("include_players") === "true";

  if (!tournament_id)
    return NextResponse.json(
      { error: "tournament_id is required" },
      { status: 400 },
    );

  const supabase = createServiceClient();
  const selectStr = includePlayers
    ? "*, team_players(*, registration:registrations(*, player:players(*)))"
    : "*";

  const { data, error } = await supabase
    .from("teams")
    .select(selectStr)
    .eq("tournament_id", tournament_id)
    .order("seed", { ascending: true });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** POST /api/admin/teams */
export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();

  if (!body.tournament_id || !body.name)
    return NextResponse.json(
      { error: "tournament_id and name are required" },
      { status: 400 },
    );

  const { data, error } = await supabase
    .from("teams")
    .insert(body)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

/** PATCH /api/admin/teams */
export async function PATCH(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("teams")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** DELETE /api/admin/teams?id=... */
export async function DELETE(req: NextRequest) {
  const supabase = createServiceClient();
  const id = req.nextUrl.searchParams.get("id");

  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase.from("teams").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

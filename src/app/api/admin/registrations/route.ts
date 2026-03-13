import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/** GET /api/admin/registrations?tournament_id=... */
export async function GET(req: NextRequest) {
  const supabase = createServiceClient();
  const tournamentId = req.nextUrl.searchParams.get("tournament_id");

  let query = supabase
    .from("registrations")
    .select("*, player:players(*), waiver:waivers(*)")
    .order("created_at", { ascending: false });

  if (tournamentId) {
    query = query.eq("tournament_id", tournamentId);
  }

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** PATCH /api/admin/registrations — update a registration */
export async function PATCH(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("registrations")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

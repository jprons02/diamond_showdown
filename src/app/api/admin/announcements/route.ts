import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/** GET /api/admin/announcements?tournament_id=... */
export async function GET(req: NextRequest) {
  const tournament_id = req.nextUrl.searchParams.get("tournament_id");
  if (!tournament_id)
    return NextResponse.json(
      { error: "tournament_id is required" },
      { status: 400 },
    );

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("tournament_id", tournament_id)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** POST /api/admin/announcements */
export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();

  if (!body.tournament_id || !body.title)
    return NextResponse.json(
      { error: "tournament_id and title are required" },
      { status: 400 },
    );

  const { data, error } = await supabase
    .from("announcements")
    .insert({ ...body, published_at: new Date().toISOString() })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

/** PATCH /api/admin/announcements */
export async function PATCH(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("announcements")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** DELETE /api/admin/announcements?id=... */
export async function DELETE(req: NextRequest) {
  const supabase = createServiceClient();
  const id = req.nextUrl.searchParams.get("id");

  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

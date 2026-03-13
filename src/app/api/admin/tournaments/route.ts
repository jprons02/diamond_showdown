import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/** GET /api/admin/tournaments — list all tournaments */
export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("tournaments")
    .select("*")
    .order("event_date", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** POST /api/admin/tournaments — create a tournament */
export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();

  if (!body.name || !body.slug) {
    return NextResponse.json(
      { error: "name and slug are required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("tournaments")
    .insert(body)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

/** PATCH /api/admin/tournaments — update a tournament (expects { id, ...fields }) */
export async function PATCH(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("tournaments")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** DELETE /api/admin/tournaments?id=... */
export async function DELETE(req: NextRequest) {
  const supabase = createServiceClient();
  const id = req.nextUrl.searchParams.get("id");

  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase.from("tournaments").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

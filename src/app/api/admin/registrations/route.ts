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

/** PATCH /api/admin/registrations — update one or many registrations
 *  Single:  { id, ...fields }
 *  Batch:   { batch: [{ id, ...fields }, ...] }
 */
export async function PATCH(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();

  // --- batch mode ---
  if (Array.isArray(body.batch)) {
    const ALLOWED_FIELDS = [
      "registration_status",
      "payment_status",
      "paid_amount",
      "draft_eligible",
      "check_in_status",
    ];
    const results = await Promise.all(
      body.batch.map(async (item: Record<string, unknown>) => {
        const { id, ...raw } = item;
        if (!id) return { id, error: "id is required" };
        const updates: Record<string, unknown> = {};
        for (const key of ALLOWED_FIELDS) {
          if (key in raw) updates[key] = raw[key];
        }
        const { error } = await supabase
          .from("registrations")
          .update(updates)
          .eq("id", id as string);
        return { id, error: error?.message ?? null };
      }),
    );
    const failed = results.filter((r) => r.error);
    if (failed.length)
      return NextResponse.json({ errors: failed }, { status: 207 });
    return NextResponse.json({ ok: true });
  }

  // --- single mode (unchanged) ---
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

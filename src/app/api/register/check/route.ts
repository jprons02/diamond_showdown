import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const email = searchParams.get("email")?.toLowerCase().trim();
  const tournamentSlug = searchParams.get("tournamentSlug");

  if (!email || !tournamentSlug) {
    return NextResponse.json({ error: "Missing parameters." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("id")
    .eq("slug", tournamentSlug)
    .single();

  if (!tournament) {
    return NextResponse.json({ registered: false });
  }

  const { data: existingReg } = await supabase
    .from("registrations")
    .select("id, players!inner(email)")
    .eq("tournament_id", tournament.id)
    .eq("players.email", email)
    .not("registration_status", "in", '("cancelled","refunded")')
    .maybeSingle();

  return NextResponse.json({ registered: !!existingReg });
}

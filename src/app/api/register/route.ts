import { NextRequest, NextResponse } from "next/server";
import { SquareClient, SquareEnvironment, SquareError } from "square";
import { randomUUID } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";

const isProd = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "production";
const isSandbox = !isProd;

const client = new SquareClient({
  token: isProd
    ? process.env.SQUARE_PRODUCTION_ACCESS_TOKEN
    : process.env.SQUARE_SANDBOX_ACCESS_TOKEN,
  environment: isProd
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playerData, paymentToken, tournamentSlug } = body as {
      playerData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        jerseySize: string;
        position1: string;
        position2: string;
        position3: string;
        notes: string;
      };
      paymentToken: string;
      tournamentSlug: string;
    };

    if (!paymentToken) {
      return NextResponse.json(
        { error: "Payment token is required." },
        { status: 400 },
      );
    }

    if (!playerData?.firstName || !playerData?.email) {
      return NextResponse.json(
        { error: "Player data is incomplete." },
        { status: 400 },
      );
    }

    if (!tournamentSlug) {
      return NextResponse.json(
        { error: "Tournament is required." },
        { status: 400 },
      );
    }

    const { position1, position2, position3 } = playerData;
    if (!position1 || !position2 || !position3) {
      return NextResponse.json(
        { error: "All three position preferences are required." },
        { status: 400 },
      );
    }
    if (
      position1 === position2 ||
      position1 === position3 ||
      position2 === position3
    ) {
      return NextResponse.json(
        { error: "Position preferences must all be different." },
        { status: 400 },
      );
    }

    const supabase = createServiceClient();
    const email = playerData.email.toLowerCase().trim();

    // ── 1. Look up tournament ──────────────────────────────────
    const { data: tournament, error: tournamentError } = await supabase
      .from("tournaments")
      .select("id, entry_fee, status, max_players, registration_close")
      .eq("slug", tournamentSlug)
      .single();

    if (tournamentError || !tournament) {
      return NextResponse.json(
        { error: "Tournament not found." },
        { status: 404 },
      );
    }

    if (tournament.status !== "open") {
      return NextResponse.json(
        { error: "Registration is not currently open for this tournament." },
        { status: 400 },
      );
    }

    // ── 1b. Capacity check ─────────────────────────────────────
    if (tournament.max_players != null) {
      const { count } = await supabase
        .from("registrations")
        .select("id", { count: "exact", head: true })
        .eq("tournament_id", tournament.id)
        .not("registration_status", "in", '("cancelled","refunded")');

      if (count != null && count >= tournament.max_players) {
        return NextResponse.json(
          {
            error: "This tournament has reached maximum capacity.",
            code: "CAPACITY_FULL",
          },
          { status: 400 },
        );
      }
    }

    // ── 1c. Registration window check ──────────────────────────
    if (tournament.registration_close) {
      const closeDate = new Date(tournament.registration_close);
      if (new Date() > closeDate) {
        return NextResponse.json(
          {
            error: "The registration window for this tournament has closed.",
            code: "REGISTRATION_CLOSED",
          },
          { status: 400 },
        );
      }
    }

    // ── 2. Duplicate-registration check (before charging) ──────
    const { data: existingPlayer } = await supabase
      .from("players")
      .select("id")
      .eq("email", email)
      .single();

    if (existingPlayer) {
      const { data: existingReg } = await supabase
        .from("registrations")
        .select("id")
        .eq("tournament_id", tournament.id)
        .eq("player_id", existingPlayer.id)
        .not("registration_status", "in", '("cancelled","refunded")')
        .single();

      if (existingReg) {
        return NextResponse.json(
          { error: "This email is already registered for this tournament." },
          { status: 409 },
        );
      }
    }

    // ── 3. Charge the card via Square ──────────────────────────
    const entryFee = tournament.entry_fee ?? 50;

    const isTestBypass =
      paymentToken === "TEST_TOKEN_BYPASS" &&
      process.env.NODE_ENV !== "production";

    let payment: { id?: string; receiptUrl?: string; status?: string };

    if (isTestBypass) {
      // Dev/test mode — skip Square entirely
      payment = {
        id: `TEST_${randomUUID()}`,
        receiptUrl: undefined,
        status: "COMPLETED",
      };
    } else {
      const feeCents = BigInt(Math.round(entryFee * 100));

      const response = await client.payments.create({
        sourceId: paymentToken,
        idempotencyKey: randomUUID(),
        amountMoney: {
          amount: feeCents,
          currency: "USD",
        },
        buyerEmailAddress: email,
        note: `Diamond Showdown Registration — ${playerData.firstName} ${playerData.lastName}`,
      });

      payment = response.payment ?? {};

      if (payment?.status !== "COMPLETED") {
        return NextResponse.json(
          { error: "Payment did not complete. Please try again." },
          { status: 402 },
        );
      }
    }

    // ── 4. Upsert player record ────────────────────────────────
    const { data: player, error: playerError } = await supabase
      .from("players")
      .upsert(
        {
          first_name: playerData.firstName.trim(),
          last_name: playerData.lastName.trim(),
          email,
          phone: playerData.phone.trim() || null,
          shirt_size: playerData.jerseySize || null,
          preferred_position: `${position1}, ${position2}, ${position3}`,
          notes: playerData.notes.trim() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" },
      )
      .select("id")
      .single();

    if (playerError || !player) {
      console.error("Failed to upsert player:", playerError);
      return NextResponse.json(
        {
          error:
            "Failed to save player record. Your payment was processed — please contact support.",
          paymentId: payment.id,
        },
        { status: 500 },
      );
    }

    // ── 5. Create registration ─────────────────────────────────
    const { data: registration, error: regError } = await supabase
      .from("registrations")
      .insert({
        tournament_id: tournament.id,
        player_id: player.id,
        registration_status: "confirmed",
        payment_status: "paid",
        paid_amount: isTestBypass ? 0 : entryFee,
        draft_eligible: true,
      })
      .select("id")
      .single();

    if (regError || !registration) {
      console.error("Failed to create registration:", regError);
      return NextResponse.json(
        {
          error:
            "Failed to create registration. Your payment was processed — please contact support.",
          paymentId: payment.id,
        },
        { status: 500 },
      );
    }

    // ── 6. Create payment record ───────────────────────────────
    const { error: paymentDbError } = await supabase.from("payments").insert({
      registration_id: registration.id,
      provider: "square",
      provider_payment_intent_id: payment.id,
      amount: entryFee,
      currency: "USD",
      status: "paid",
      paid_at: new Date().toISOString(),
      raw_payload_json: {
        squarePaymentId: payment.id,
        receiptUrl: payment.receiptUrl,
      },
    });

    if (paymentDbError) {
      // Non-fatal — registration is already saved
      console.error("Failed to record payment in DB:", paymentDbError);
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      receiptUrl: payment.receiptUrl
        ? isSandbox
          ? payment.receiptUrl.replace("squareup.com", "squareupsandbox.com")
          : payment.receiptUrl
        : null,
    });
  } catch (error: unknown) {
    if (error instanceof SquareError) {
      const messages = error.errors
        ?.map(
          (e: { detail?: string; category: string }) => e.detail ?? e.category,
        )
        .filter(Boolean)
        .join("; ");
      console.error("Square API error:", error.errors);
      return NextResponse.json(
        { error: messages ?? "Payment processing failed." },
        { status: error.statusCode ?? 500 },
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}

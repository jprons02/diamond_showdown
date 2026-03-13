import { NextRequest, NextResponse } from "next/server";
import { SquareClient, SquareEnvironment, SquareError } from "square";
import { randomUUID } from "crypto";

const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
});

// Registration fee in cents — must match brand.tournament.freeAgentFee ($50.00)
const REGISTRATION_FEE_CENTS = BigInt(5000);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playerData, paymentToken } = body as {
      playerData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        position1: string;
        position2: string;
        position3: string;
        notes: string;
      };
      paymentToken: string;
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

    // Charge the card via Square Payments API
    const response = await client.payments.create({
      sourceId: paymentToken,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: REGISTRATION_FEE_CENTS,
        currency: "USD",
      },
      buyerEmailAddress: playerData.email,
      note: `Diamond Showdown Registration — ${playerData.firstName} ${playerData.lastName}`,
    });

    const payment = response.payment;

    // Validate payment completed successfully
    if (payment?.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Payment did not complete. Please try again." },
        { status: 402 },
      );
    }

    // TODO: Persist registration + payment confirmation to your database
    // TODO: Send confirmation email to playerData.email
    console.log("Registration complete:", {
      paymentId: payment.id,
      receiptUrl: payment.receiptUrl,
      player: `${playerData.firstName} ${playerData.lastName}`,
      email: playerData.email,
    });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      receiptUrl: payment.receiptUrl ?? null,
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

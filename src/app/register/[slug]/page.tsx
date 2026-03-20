"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { brand } from "@/lib/brand";
import HeroBackground from "@/components/HeroBackground";
import SquarePaymentForm from "@/components/SquarePaymentForm";
import {
  CheckCircleIcon,
  ArrowLeftIcon,
  ReceiptPercentIcon,
  CalendarDaysIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import {
  Input,
  Select,
  SelectItem,
  Textarea,
  Button,
  Spinner,
} from "@heroui/react";
import { createClient } from "@/lib/supabase/client";
import type { Tournament } from "@/lib/types/database";

interface PlayerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jerseySize: string;
  position1: string;
  position2: string;
  position3: string;
  notes: string;
}

const positions = [
  "Pitcher",
  "Catcher",
  "First Base",
  "Second Base",
  "Shortstop",
  "Third Base",
  "Left Field",
  "Left Center",
  "Right Center",
  "Right Field",
];

const EMPTY_PLAYER: PlayerFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  jerseySize: "",
  position1: "",
  position2: "",
  position3: "",
  notes: "",
};

const jerseySizes = ["S", "M", "L", "XL", "2XL", "3XL"];

export default function RegisterSlugPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [blockedReason, setBlockedReason] = useState<string | null>(null);

  // "info" → filling out player info
  // "payment" → Square card form
  // "success" → payment confirmed
  const [step, setStep] = useState<"info" | "payment" | "success">("info");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const [playerData, setPlayerData] = useState<PlayerFormData>(EMPTY_PLAYER);
  const [positionError, setPositionError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("tournaments")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(async ({ data, error }) => {
        if (error || !data) {
          setNotFoundState(true);
          setLoading(false);
          return;
        }

        const t = data as Tournament;
        setTournament(t);

        // Check capacity first
        if (t.max_players != null) {
          const { count } = await supabase
            .from("registrations")
            .select("id", { count: "exact", head: true })
            .eq("tournament_id", t.id)
            .not("registration_status", "in", '("cancelled","refunded")');

          if (count != null && count >= t.max_players) {
            setBlockedReason("This tournament has reached maximum capacity.");
            setLoading(false);
            return;
          }
        }

        // Then check registration window
        if (t.registration_close) {
          const closeDate = new Date(t.registration_close);
          if (new Date() > closeDate) {
            setBlockedReason(
              "The registration window for this tournament has closed.",
            );
            setLoading(false);
            return;
          }
        }

        setLoading(false);
      });
  }, [slug]);

  if (notFoundState) {
    notFound();
  }

  const entryFee = tournament?.entry_fee
    ? `$${Number(tournament.entry_fee).toFixed(0)}`
    : brand.tournament.freeAgentFee;

  // Step 1 → Step 2: validate form fields, check for duplicate email, then advance to payment
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    setEmailError(null);

    const { position1, position2, position3 } = playerData;
    const selected = [position1, position2, position3];
    const unique = new Set(selected.filter(Boolean));

    if (selected.some((p) => !p)) {
      setPositionError("Please select all three position preferences.");
      return;
    }
    if (unique.size < 3) {
      setPositionError(
        "Your three position preferences must all be different.",
      );
      return;
    }

    setPositionError(null);

    // Check for duplicate registration before advancing to payment
    setCheckingEmail(true);
    try {
      const res = await fetch(
        `/api/register/check?email=${encodeURIComponent(playerData.email)}&tournamentSlug=${encodeURIComponent(slug)}`,
      );
      const data = await res.json();
      if (data.registered) {
        setEmailError("This email is already registered for this tournament.");
        return;
      }
    } catch {
      // If the check fails for any reason, allow through — the API will catch it
    } finally {
      setCheckingEmail(false);
    }

    setStep("payment");
  };

  // Step 2: receive Square payment token, charge card, submit registration
  const handlePaymentToken = async (token: string) => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerData,
          paymentToken: token,
          tournamentSlug: slug,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setPaymentError(
          data.error ??
            "Payment failed. Please check your card details and try again.",
        );
        return;
      }

      setPaymentId(data.paymentId ?? null);
      setReceiptUrl(data.receiptUrl ?? null);
      setStep("success");
    } catch {
      setPaymentError(
        "Network error. Please check your connection and try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setStep("info");
    setPlayerData(EMPTY_PLAYER);
    setPaymentError(null);
    setEmailError(null);
    setReceiptUrl(null);
    setPaymentId(null);
    setIsProcessing(false);
  };

  /*
  const inputClassNames = {
    label: "text-sm font-medium !text-gray-300",
    inputWrapper:
      "bg-white/5 border-white/10 rounded-xl data-[focus=true]:border-brand-teal/50 data-[hover=true]:bg-white/8 !border",
    input: "text-white placeholder:text-gray-500 text-sm",
  };
  const selectClassNames = {
    label: "text-xs font-medium !text-gray-400",
    trigger:
      "bg-white/5 border-white/10 rounded-xl data-[focus=true]:border-brand-teal/50 data-[hover=true]:bg-white/8",
    value: "text-white text-sm",
    popoverContent: "bg-brand-charcoal border border-white/10",
    listboxWrapper: "max-h-44",
    listbox: "text-white",
    selectorIcon: "text-gray-400 shrink-0",
  };
  */

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-dark">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  const tournamentName = tournament?.name ?? brand.name;

  // ---- BLOCKED SCREEN (capacity full or registration closed) ----
  if (blockedReason) {
    return (
      <div className="bg-gradient-dark min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <CalendarDaysIcon className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Registration Unavailable
          </h1>
          <p className="text-gray-400 mb-6">{blockedReason}</p>
          <Button
            as={Link}
            href="/register"
            color="primary"
            size="lg"
            className="font-semibold shadow-lg shadow-brand-teal/25"
          >
            Browse Tournaments
          </Button>
        </div>
      </div>
    );
  }

  // ---- SUCCESS SCREEN ----
  if (step === "success") {
    return (
      <div className="bg-gradient-dark min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-brand-teal/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-10 h-10 text-brand-teal" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            You&apos;re Registered!
          </h1>
          <p className="text-gray-400 mb-3">
            Payment confirmed for{" "}
            <span className="text-white font-medium">
              {playerData.firstName} {playerData.lastName}
            </span>
            . A confirmation has been sent to{" "}
            <span className="text-brand-teal">{playerData.email}</span>.
          </p>
          {paymentId && (
            <p className="text-xs text-gray-600 mb-6">
              Payment ID:{" "}
              <span className="font-mono text-gray-500">{paymentId}</span>
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {receiptUrl && (
              <Button
                as="a"
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="bordered"
                size="lg"
                startContent={<ReceiptPercentIcon className="w-6 h-6" />}
                className="text-brand-teal border-brand-teal/40"
              >
                View Receipt
              </Button>
            )}
            <Button
              as={Link}
              href={`/tournament/${slug}`}
              color="primary"
              size="lg"
              className="font-semibold shadow-lg shadow-brand-teal/25"
            >
              View Tournament Details
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <HeroBackground
        imageSrc="/Register.jpg"
        imageAlt="Softball player on the field"
        overlayOpacity="bg-black/60"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center h-[460px] sm:h-[520px] flex flex-col items-center justify-center">
          <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-4 animate-slide-up">
            Sign Up
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight animate-slide-up-delay">
            Register for
            <span className="text-gradient-animated"> {tournamentName}</span>
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto animate-slide-up-delay-2">
            Register as a player to enter the draft. Coaches will build their
            teams — all you have to do is show up and play.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 animate-slide-up-delay-2">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-gray-200">
              <CalendarDaysIcon className="w-4 h-4 text-brand-teal" />
              {tournament?.event_date
                ? tournament.event_end_date &&
                  tournament.event_end_date !== tournament.event_date
                  ? (() => {
                      const s = new Date(tournament.event_date);
                      const e = new Date(tournament.event_end_date);
                      if (
                        s.getUTCMonth() === e.getUTCMonth() &&
                        s.getUTCFullYear() === e.getUTCFullYear()
                      ) {
                        return `${s.toLocaleDateString("en-US", { month: "long", day: "numeric" })}–${e.getUTCDate()}, ${e.getUTCFullYear()}`;
                      }
                      return `${s.toLocaleDateString("en-US", { month: "long", day: "numeric" })} – ${e.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
                    })()
                  : new Date(tournament.event_date).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )
                : "Date TBD"}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm text-gray-200">
              <MapPinIcon className="w-4 h-4 text-brand-teal" />
              {tournament?.location_name || "Location TBD"}
            </span>
          </div>
        </div>
      </HeroBackground>

      <section className="pb-16 sm:pb-24 bg-gradient-dark">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step indicator */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                  step === "info"
                    ? "bg-brand-teal text-brand-dark border-brand-teal"
                    : "bg-brand-teal/20 text-brand-teal border-brand-teal/40"
                }`}
              >
                {step === "payment" ? "✓" : "1"}
              </div>
              <span
                className={`text-sm font-medium ${step === "info" ? "text-white" : "text-gray-500"}`}
              >
                Your Info
              </span>
            </div>
            <div className="h-px w-8 bg-white/10" />
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                  step === "payment"
                    ? "bg-brand-teal text-brand-dark border-brand-teal"
                    : "bg-white/5 text-gray-600 border-white/10"
                }`}
              >
                2
              </div>
              <span
                className={`text-sm font-medium ${step === "payment" ? "text-white" : "text-gray-600"}`}
              >
                Payment
              </span>
            </div>
          </div>

          {/* ---- STEP 1: Player info ---- */}
          {step === "info" && (
            <>
              {/* Pricing Info */}
              <div className="mb-8 p-4 rounded-xl bg-brand-teal/5 border border-brand-teal/20 text-center">
                <p className="text-sm text-gray-300">
                  Player registration fee:{" "}
                  <span className="text-brand-teal font-bold text-lg">
                    {entryFee}
                  </span>
                  <span className="text-gray-500 ml-2">
                    (you&apos;ll be drafted onto a team)
                  </span>
                </p>
              </div>

              {/* Player Form */}
              <form
                onSubmit={handleInfoSubmit}
                className="p-6 sm:p-8 rounded-2xl bg-brand-surface/50 border border-white/5 space-y-5"
              >
                <h2 className="text-xl font-bold text-white mb-4">
                  Player Registration
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="First Name"
                    variant="bordered"
                    isRequired
                    value={playerData.firstName}
                    onValueChange={(val) =>
                      setPlayerData({ ...playerData, firstName: val })
                    }
                  />
                  <Input
                    label="Last Name"
                    variant="bordered"
                    isRequired
                    value={playerData.lastName}
                    onValueChange={(val) =>
                      setPlayerData({ ...playerData, lastName: val })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Email"
                    variant="bordered"
                    type="email"
                    isRequired
                    isInvalid={!!emailError}
                    value={playerData.email}
                    onValueChange={(val) => {
                      setEmailError(null);
                      setPlayerData({ ...playerData, email: val });
                    }}
                  />
                  <Input
                    label="Phone"
                    variant="bordered"
                    type="tel"
                    isRequired
                    value={playerData.phone}
                    onValueChange={(val) =>
                      setPlayerData({ ...playerData, phone: val })
                    }
                  />
                  {/* Jersey Size */}
                  <Select
                    label="Jersey Size"
                    variant="bordered"
                    isRequired
                    selectedKeys={
                      playerData.jerseySize ? [playerData.jerseySize] : []
                    }
                    onSelectionChange={(keys) => {
                      const val = Array.from(keys)[0] as string;
                      setPlayerData((prev) => ({ ...prev, jerseySize: val }));
                    }}
                  >
                    {jerseySizes.map((size) => (
                      <SelectItem key={size}>{size}</SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Position Preferences */}
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-2">
                    Position Preferences
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Select your top 3 positions in order of preference. Each
                    must be unique.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Select
                      label="1st Choice"
                      variant="bordered"
                      isRequired
                      selectedKeys={
                        playerData.position1 ? [playerData.position1] : []
                      }
                      disabledKeys={[
                        playerData.position2,
                        playerData.position3,
                      ].filter(Boolean)}
                      onSelectionChange={(keys) => {
                        const val = Array.from(keys)[0] as string;
                        setPositionError(null);
                        setPlayerData((prev) => ({
                          ...prev,
                          position1: val,
                          position2:
                            prev.position2 === val ? "" : prev.position2,
                          position3:
                            prev.position3 === val ? "" : prev.position3,
                        }));
                      }}
                      scrollShadowProps={{ hideScrollBar: false }}
                    >
                      {positions.map((pos) => (
                        <SelectItem key={pos}>{pos}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="2nd Choice"
                      variant="bordered"
                      isRequired
                      selectedKeys={
                        playerData.position2 ? [playerData.position2] : []
                      }
                      disabledKeys={[
                        playerData.position1,
                        playerData.position3,
                      ].filter(Boolean)}
                      onSelectionChange={(keys) => {
                        const val = Array.from(keys)[0] as string;
                        setPositionError(null);
                        setPlayerData((prev) => ({
                          ...prev,
                          position2: val,
                          position3:
                            prev.position3 === val ? "" : prev.position3,
                        }));
                      }}
                      scrollShadowProps={{ hideScrollBar: false }}
                    >
                      {positions.map((pos) => (
                        <SelectItem key={pos}>{pos}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="3rd Choice"
                      variant="bordered"
                      isRequired
                      selectedKeys={
                        playerData.position3 ? [playerData.position3] : []
                      }
                      disabledKeys={[
                        playerData.position1,
                        playerData.position2,
                      ].filter(Boolean)}
                      onSelectionChange={(keys) => {
                        const val = Array.from(keys)[0] as string;
                        setPositionError(null);
                        setPlayerData((prev) => ({
                          ...prev,
                          position3: val,
                        }));
                      }}
                      scrollShadowProps={{ hideScrollBar: false }}
                    >
                      {positions.map((pos) => (
                        <SelectItem key={pos}>{pos}</SelectItem>
                      ))}
                    </Select>
                  </div>
                  {positionError && (
                    <p className="mt-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                      {positionError}
                    </p>
                  )}
                </div>

                <Textarea
                  label="Additional Notes"
                  variant="bordered"
                  minRows={3}
                  placeholder="Anything else we should know?"
                  value={playerData.notes}
                  onValueChange={(val) =>
                    setPlayerData({ ...playerData, notes: val })
                  }
                />
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  fullWidth
                  isLoading={checkingEmail}
                  className="font-semibold"
                >
                  {checkingEmail ? "Checking…" : "Continue to Payment →"}
                </Button>
                {emailError && (
                  <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                    {emailError}
                  </p>
                )}
              </form>
            </>
          )}

          {/* ---- STEP 2: Payment ---- */}
          {step === "payment" && (
            <div className="p-6 sm:p-8 rounded-2xl bg-brand-surface/50 border border-white/5 space-y-6">
              {/* Review summary */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Payment</h2>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Registering{" "}
                    <span className="text-white font-medium">
                      {playerData.firstName} {playerData.lastName}
                    </span>
                  </p>
                </div>
                <Button
                  variant="light"
                  onPress={() => {
                    setStep("info");
                    setPaymentError(null);
                  }}
                  startContent={<ArrowLeftIcon className="w-4 h-4" />}
                  className="text-gray-400"
                >
                  Edit info
                </Button>
              </div>

              {/* Registered details mini-summary */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 p-4 rounded-xl bg-white/5 border border-white/5 text-sm">
                <div>
                  <span className="text-gray-500">Email</span>
                  <p className="text-white truncate">{playerData.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">Phone</span>
                  <p className="text-white">{playerData.phone}</p>
                </div>
                <div>
                  <span className="text-gray-500">Jersey size</span>
                  <p className="text-white">{playerData.jerseySize}</p>
                </div>
                <div>
                  <span className="text-gray-500">1st position</span>
                  <p className="text-white">{playerData.position1}</p>
                </div>
                <div>
                  <span className="text-gray-500">2nd / 3rd</span>
                  <p className="text-white">
                    {playerData.position2} / {playerData.position3}
                  </p>
                </div>
              </div>

              {/* Square card form */}
              <SquarePaymentForm
                amount={entryFee}
                onPaymentToken={handlePaymentToken}
                isProcessing={isProcessing}
              />

              {/* Top-level payment error (from API) */}
              {paymentError && (
                <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                  {paymentError}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

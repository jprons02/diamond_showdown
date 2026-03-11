"use client";

import { useState } from "react";
import { brand } from "@/lib/brand";
import HeroBackground from "@/components/HeroBackground";
import SquarePaymentForm from "@/components/SquarePaymentForm";
import {
  CheckCircleIcon,
  ArrowLeftIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/outline";

interface PlayerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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
  "Utility / Any",
];

const EMPTY_PLAYER: PlayerFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  position1: "",
  position2: "",
  position3: "",
  notes: "",
};

export default function RegisterPage() {
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

  // Step 1 → Step 2: validate form fields and advance to payment
  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

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
        body: JSON.stringify({ playerData, paymentToken: token }),
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
    setReceiptUrl(null);
    setPaymentId(null);
    setIsProcessing(false);
  };

  const inputStyles =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/50 transition-colors";
  const labelStyles = "block text-sm font-medium text-gray-300 mb-2";
  const selectStyles =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/50 transition-colors appearance-none";

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
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-brand-teal border border-brand-teal/40 rounded-xl hover:bg-brand-teal/10 transition-colors"
              >
                <ReceiptRefundIcon className="w-4 h-4" />
                View Receipt
              </a>
            )}
            <button
              onClick={resetForm}
              className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-gradient-brand rounded-xl shadow-lg shadow-brand-teal/25 hover:shadow-brand-teal/40 hover:scale-105 transition-all duration-300"
            >
              Register Another Player
            </button>
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
            <span className="text-gradient-animated"> {brand.name}</span>
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto animate-slide-up-delay-2">
            Register as a player to enter the draft. Coaches will build their
            teams — all you have to do is show up and play.
          </p>
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
                    {brand.tournament.freeAgentFee}
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
                <h2 className="text-xl font-bold text-white mb-2">
                  Player Registration
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstName" className={labelStyles}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      value={playerData.firstName}
                      onChange={(e) =>
                        setPlayerData({
                          ...playerData,
                          firstName: e.target.value,
                        })
                      }
                      className={inputStyles}
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelStyles}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      required
                      value={playerData.lastName}
                      onChange={(e) =>
                        setPlayerData({
                          ...playerData,
                          lastName: e.target.value,
                        })
                      }
                      className={inputStyles}
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className={labelStyles}>
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={playerData.email}
                      onChange={(e) =>
                        setPlayerData({ ...playerData, email: e.target.value })
                      }
                      className={inputStyles}
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelStyles}>
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={playerData.phone}
                      onChange={(e) =>
                        setPlayerData({ ...playerData, phone: e.target.value })
                      }
                      className={inputStyles}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Position Preferences */}
                <div>
                  <p className={labelStyles}>Position Preferences *</p>
                  <p className="text-xs text-gray-500 mb-3">
                    Select your top 3 positions in order of preference. Each
                    must be unique.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="position1"
                        className="block text-xs font-medium text-gray-400 mb-1.5"
                      >
                        1st Choice
                      </label>
                      <select
                        id="position1"
                        required
                        value={playerData.position1}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPositionError(null);
                          setPlayerData((prev) => ({
                            ...prev,
                            position1: val,
                            // clear downstream conflicts
                            position2: prev.position2 === val ? "" : prev.position2,
                            position3: prev.position3 === val ? "" : prev.position3,
                          }));
                        }}
                        className={selectStyles}
                      >
                        <option value="" disabled>
                          Select...
                        </option>
                        {positions.map((pos) => (
                          <option
                            key={pos}
                            value={pos}
                            className="bg-brand-dark"
                          >
                            {pos}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="position2"
                        className="block text-xs font-medium text-gray-400 mb-1.5"
                      >
                        2nd Choice
                      </label>
                      <select
                        id="position2"
                        required
                        value={playerData.position2}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPositionError(null);
                          setPlayerData((prev) => ({
                            ...prev,
                            position2: val,
                            // clear downstream conflict
                            position3: prev.position3 === val ? "" : prev.position3,
                          }));
                        }}
                        className={selectStyles}
                      >
                        <option value="" disabled>
                          Select...
                        </option>
                        {positions
                          .filter((pos) => pos !== playerData.position1)
                          .map((pos) => (
                            <option
                              key={pos}
                              value={pos}
                              className="bg-brand-dark"
                            >
                              {pos}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="position3"
                        className="block text-xs font-medium text-gray-400 mb-1.5"
                      >
                        3rd Choice
                      </label>
                      <select
                        id="position3"
                        required
                        value={playerData.position3}
                        onChange={(e) => {
                          setPositionError(null);
                          setPlayerData((prev) => ({
                            ...prev,
                            position3: e.target.value,
                          }));
                        }}
                        className={selectStyles}
                      >
                        <option value="" disabled>
                          Select...
                        </option>
                        {positions
                          .filter(
                            (pos) =>
                              pos !== playerData.position1 &&
                              pos !== playerData.position2,
                          )
                          .map((pos) => (
                            <option
                              key={pos}
                              value={pos}
                              className="bg-brand-dark"
                            >
                              {pos}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  {positionError && (
                    <p className="mt-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                      {positionError}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="notes" className={labelStyles}>
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={playerData.notes}
                    onChange={(e) =>
                      setPlayerData({ ...playerData, notes: e.target.value })
                    }
                    className={`${inputStyles} resize-none`}
                    placeholder="Anything else we should know?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-brand rounded-xl shadow-lg shadow-brand-teal/25 hover:shadow-brand-teal/40 hover:scale-[1.02] transition-all duration-300"
                >
                  Continue to Payment →
                </button>
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
                <button
                  type="button"
                  onClick={() => {
                    setStep("info");
                    setPaymentError(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Edit info
                </button>
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
                amount={brand.tournament.freeAgentFee}
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

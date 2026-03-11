"use client";

import { useEffect, useRef, useState } from "react";
import { LockClosedIcon } from "@heroicons/react/24/outline";

// ---------------------------------------------------------------------------
// Square Web Payments SDK type shims
// ---------------------------------------------------------------------------
interface SquareTokenizeResult {
  status: "OK" | "Cancel" | "Error";
  token?: string;
  errors?: Array<{ detail: string; field?: string }>;
}

interface SquareCard {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<SquareTokenizeResult>;
  destroy: () => Promise<void>;
}

interface SquarePayments {
  card: (options?: Record<string, unknown>) => Promise<SquareCard>;
}

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => Promise<SquarePayments>;
    };
  }
}

// ---------------------------------------------------------------------------

interface Props {
  amount: string;
  onPaymentToken: (token: string) => Promise<void>;
  isProcessing: boolean;
}

export default function SquarePaymentForm({
  amount,
  onPaymentToken,
  isProcessing,
}: Props) {
  const [sdkReady, setSdkReady] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<SquareCard | null>(null);
  const initializedRef = useRef(false);

  const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID!;
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!;
  // Sandbox App IDs always start with "sandbox-", so no extra env var needed
  const isSandbox = appId?.startsWith("sandbox-") ?? true;

  const initCard = async () => {
    if (initializedRef.current || !window.Square) return;
    initializedRef.current = true;

    try {
      const payments = await window.Square.payments(appId, locationId);
      const card = await payments.card({
        style: {
          ".input-container": {
            borderColor: "rgba(255,255,255,0.10)",
            borderRadius: "0.75rem",
          },
          ".input-container.is-focus": {
            borderColor: "rgba(14,211,207,0.5)",
          },
          input: { color: "#ffffff", fontSize: "14px" },
          "input::placeholder": { color: "#6b7280" },
          ".message-text": { color: "#f87171" },
          ".message-icon": { color: "#f87171" },
        },
      });
      await card.attach("#sq-card-container");
      cardRef.current = card;
      setCardReady(true);
    } catch (e) {
      console.error("Square card init error:", e);
      setError(
        "Failed to initialize the payment form. Please refresh and try again.",
      );
    }
  };

  // Load (or reuse) the Square Web Payments SDK script
  useEffect(() => {
    const scriptSrc = isSandbox
      ? "https://sandbox.web.squarecdn.com/v1/square.js"
      : "https://web.squarecdn.com/v1/square.js";

    if (window.Square) {
      setSdkReady(true);
      initCard();
      return;
    }

    // Avoid duplicate script injection
    if (document.querySelector(`script[src="${scriptSrc}"]`)) {
      return;
    }

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.onload = () => {
      setSdkReady(true);
      initCard();
    };
    script.onerror = () =>
      setError("Failed to load payment library. Please refresh.");
    document.head.appendChild(script);

    return () => {
      if (cardRef.current) {
        cardRef.current.destroy();
        cardRef.current = null;
        initializedRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePayClick = async () => {
    if (!cardRef.current || isProcessing) return;
    setError(null);

    try {
      const result = await cardRef.current.tokenize();
      if (result.status === "OK" && result.token) {
        await onPaymentToken(result.token);
      } else {
        const detail =
          result.errors?.map((e) => e.detail).join(", ") ??
          "Card details are invalid. Please check and try again.";
        setError(detail);
      }
    } catch (e) {
      console.error("Tokenize error:", e);
      setError(
        "An error occurred while processing your card. Please try again.",
      );
    }
  };

  const showSpinner = !sdkReady || (!cardReady && !error);

  return (
    <div className="space-y-5">
      {/* Amount banner */}
      <div className="p-4 rounded-xl bg-brand-teal/5 border border-brand-teal/20 text-center">
        <p className="text-sm text-gray-300">
          Total due today:{" "}
          <span className="text-brand-teal font-bold text-lg">{amount}</span>
        </p>
      </div>

      {/* Loading skeleton */}
      {showSpinner && (
        <div className="flex items-center justify-center py-8 gap-3">
          <div className="w-5 h-5 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Loading payment form…</span>
        </div>
      )}

      {/* Square card widget mount point */}
      <div
        id="sq-card-container"
        className={cardReady ? "sq-card-wrapper" : "hidden"}
      />

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Pay button */}
      <button
        type="button"
        onClick={handlePayClick}
        disabled={!cardReady || isProcessing || !!error}
        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-brand rounded-xl shadow-lg shadow-brand-teal/25 hover:shadow-brand-teal/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing payment…
          </>
        ) : (
          <>
            <LockClosedIcon className="w-4 h-4" />
            Pay {amount} &amp; Register
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        Payments securely processed by{" "}
        <span className="text-gray-400">Square</span>. Your card information is
        never stored on our servers.
      </p>
    </div>
  );
}

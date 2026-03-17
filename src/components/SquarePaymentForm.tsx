"use client";

import { useEffect, useRef, useState } from "react";
import { LockClosedIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { Button, Spinner } from "@heroui/react";

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

  const isProd = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "production";
  const appId = isProd
    ? process.env.NEXT_PUBLIC_SQUARE_PRODUCTION_APPLICATION_ID!
    : process.env.NEXT_PUBLIC_SQUARE_SANDBOX_APPLICATION_ID!;
  const locationId = isProd
    ? process.env.NEXT_PUBLIC_SQUARE_PRODUCTION_LOCATION_ID!
    : process.env.NEXT_PUBLIC_SQUARE_SANDBOX_LOCATION_ID!;
  const isSandbox = !isProd;

  const initCard = async () => {
    if (initializedRef.current || !window.Square) return;
    initializedRef.current = true;

    try {
      const payments = await window.Square.payments(appId, locationId);
      const card = await payments.card({
        style: {
          ".input-container": {
            borderColor: "rgba(255,255,255,0.10)",
            borderRadius: "12px",
          },
          ".input-container.is-focus": {
            borderColor: "rgba(14,211,207,0.5)",
          },
          ".input-container.is-error": {
            borderColor: "rgba(248,113,113,0.5)",
          },
          input: {
            color: "#1a1a2e",
            fontSize: "14px",
          },
          "input::placeholder": { color: "#9ca3af" },
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
          <Spinner size="sm" color="primary" />
          <span className="text-gray-400 text-sm">Loading payment form…</span>
        </div>
      )}

      {/* Square card widget mount point */}
      <div className="space-y-1.5">
        {cardReady && (
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-300">
            <CreditCardIcon className="w-4 h-4 text-gray-400" />
            Card Details
          </label>
        )}
        <div
          id="sq-card-container"
          className={cardReady ? "sq-card-wrapper" : "hidden"}
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Pay button */}
      <Button
        color="primary"
        size="lg"
        fullWidth
        isLoading={isProcessing}
        isDisabled={!cardReady || !!error}
        onPress={handlePayClick}
        startContent={
          !isProcessing ? <LockClosedIcon className="w-4 h-4" /> : undefined
        }
        className="font-semibold"
      >
        {isProcessing ? "Processing payment…" : `Pay ${amount} & Register`}
      </Button>

      <p className="text-center text-xs text-gray-500">
        Payments securely processed by{" "}
        <span className="text-gray-400">Square</span>. Your card information is
        never stored on our servers.
      </p>
    </div>
  );
}

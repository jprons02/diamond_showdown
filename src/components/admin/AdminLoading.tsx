"use client";

import { Skeleton, Spinner } from "@heroui/react";

/* ─── Card skeleton (dashboard stat cards, etc.) ────────────── */
export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-brand-surface border border-white/5 p-5 space-y-3"
        >
          <Skeleton className="w-20 h-3 rounded-lg bg-white/5" />
          <Skeleton className="w-16 h-8 rounded-lg bg-white/5" />
          <Skeleton className="w-24 h-3 rounded-lg bg-white/5" />
        </div>
      ))}
    </div>
  );
}

/* ─── Row skeleton (list items — games, announcements, etc.) ── */
export function RowSkeleton({
  count = 3,
  height = "h-20",
}: {
  count?: number;
  height?: string;
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`rounded-2xl bg-brand-surface border border-white/5 p-5 flex items-center gap-4 ${height}`}
        >
          <Skeleton className="w-8 h-8 rounded-xl bg-white/5 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-2/5 h-3 rounded-lg bg-white/5" />
            <Skeleton className="w-3/5 h-3 rounded-lg bg-white/5" />
          </div>
          <Skeleton className="w-16 h-6 rounded-full bg-white/5 shrink-0" />
        </div>
      ))}
    </div>
  );
}

/* ─── Table skeleton (registrations, etc.) ────────────────── */
export function TableSkeleton({
  rows = 5,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="rounded-2xl bg-brand-surface border border-white/5 overflow-hidden">
      <div className="px-5 py-3 border-b border-white/5 flex gap-6">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 rounded-lg bg-white/5 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="px-5 py-3.5 border-b border-white/5 last:border-0 flex gap-6"
        >
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-3 rounded-lg bg-white/5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Inline spinner (save/action buttons) ────────────────── */
export function SaveSpinner({ className }: { className?: string }) {
  return (
    <Spinner
      size="sm"
      color="current"
      classNames={{ wrapper: className ?? "w-4 h-4" }}
    />
  );
}

/* ─── Full-section overlay spinner ────────────────────────── */
export function PageSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Spinner size="lg" color="primary" />
      {label && <p className="text-sm text-gray-400">{label}</p>}
    </div>
  );
}

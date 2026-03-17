import type { Metadata } from "next";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { brand } from "@/lib/brand";
import FloatingDiamonds from "@/components/FloatingDiamonds";
import {
  CalendarDaysIcon,
  MapPinIcon,
  UserGroupIcon,
  TrophyIcon,
  LockClosedIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import type { Tournament } from "@/lib/types/database";

export const metadata: Metadata = {
  title: "Tournaments",
  description: `Browse available ${brand.name} tournaments and view brackets, drafts, rules, and more.`,
};

export const revalidate = 0;

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  open: {
    label: "Registration Open",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
  closed: {
    label: "Registration Closed",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  completed: {
    label: "Completed",
    color: "text-gray-400",
    bg: "bg-white/5 border-white/10",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "TBD";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateRange(start: string | null, end: string | null): string {
  if (!start) return "TBD";
  const s = new Date(start);
  if (!end || end === start) return formatDate(start);
  const e = new Date(end);
  // Same month & year: "June 20–22, 2026"
  if (
    s.getUTCMonth() === e.getUTCMonth() &&
    s.getUTCFullYear() === e.getUTCFullYear()
  ) {
    return `${s.toLocaleDateString("en-US", { month: "long", day: "numeric" })}–${e.getUTCDate()}, ${e.getUTCFullYear()}`;
  }
  // Different months: "May 31 – June 1, 2026"
  return `${s.toLocaleDateString("en-US", { month: "long", day: "numeric" })} – ${e.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
}

function TournamentCard({ tournament }: { tournament: Tournament }) {
  const status = statusConfig[tournament.status] ?? statusConfig.closed;

  return (
    <Link
      href={`/tournament/${tournament.slug}`}
      className="group relative block rounded-2xl border border-white/5 bg-brand-surface/50 p-6 sm:p-8 transition-all duration-500 hover:border-brand-teal/30 hover:bg-brand-surface hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-teal/10"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-brand-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        {/* Status badge */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.color}`}
          >
            {tournament.status === "open" && (
              <CheckBadgeIcon className="w-3.5 h-3.5" />
            )}
            {tournament.status === "closed" && (
              <LockClosedIcon className="w-3.5 h-3.5" />
            )}
            {tournament.status === "completed" && (
              <TrophyIcon className="w-3.5 h-3.5" />
            )}
            {status.label}
          </span>
          <ChevronRightIcon className="w-5 h-5 text-gray-600 group-hover:text-brand-teal group-hover:translate-x-1 transition-all duration-300" />
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-brand-teal transition-colors duration-300">
          {tournament.name}
        </h2>

        {/* Info grid */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <CalendarDaysIcon className="w-4.5 h-4.5 text-brand-teal flex-shrink-0" />
            <span>
              {formatDateRange(
                tournament.event_date,
                tournament.event_end_date,
              )}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <MapPinIcon className="w-4.5 h-4.5 text-brand-teal flex-shrink-0" />
            <span>{tournament.location_name || "Location TBD"}</span>
          </div>
          {tournament.max_players && (
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <UserGroupIcon className="w-4.5 h-4.5 text-brand-teal flex-shrink-0" />
              <span>Up to {tournament.max_players} players</span>
            </div>
          )}
          {tournament.entry_fee != null && (
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <TrophyIcon className="w-4.5 h-4.5 text-brand-teal flex-shrink-0" />
              <span>${Number(tournament.entry_fee).toFixed(0)} entry fee</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function TournamentListPage() {
  const supabase = createServiceClient();
  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("*")
    .neq("status", "draft")
    .order("event_date", { ascending: false });

  const list = (tournaments ?? []) as Tournament[];

  return (
    <div className="min-h-screen bg-gradient-dark">
      <section className="relative pt-28 pb-24 sm:pt-36 sm:pb-32 overflow-hidden">
        <FloatingDiamonds />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-3 animate-fade-in">
              {brand.name}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 animate-slide-up">
              Select a{" "}
              <span className="text-gradient-animated">Tournament</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto animate-slide-up-delay">
              Choose a tournament below to view brackets, draft results, game
              schedules, rules, and announcements.
            </p>
          </div>

          {list.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {list.map((t) => (
                <TournamentCard key={t.id} tournament={t} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                <TrophyIcon className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                No Tournaments Yet
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                There are no published tournaments at this time. Check back soon
                — new events are added regularly!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

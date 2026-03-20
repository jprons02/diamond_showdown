import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { brand } from "@/lib/brand";
import FloatingDiamonds from "@/components/FloatingDiamonds";
import {
  CalendarDaysIcon,
  MapPinIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import type { Tournament } from "@/lib/types/database";

export const metadata = {
  title: "Register",
  description: `Choose a tournament and register for ${brand.name}.`,
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "TBD";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function RegisterPage() {
  const supabase = createServiceClient();
  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("*")
    .eq("status", "open")
    .order("event_date", { ascending: true });

  const now = new Date();
  const allOpen = (tournaments ?? []) as Tournament[];

  // Filter out tournaments whose registration window has closed
  const withinWindow = allOpen.filter((t) => {
    if (!t.registration_close) return true;
    return new Date(t.registration_close) > now;
  });

  // Get registration counts for capacity checks
  const listWithCapacity = await Promise.all(
    withinWindow.map(async (t) => {
      if (t.max_players == null) return { ...t, isFull: false };
      const { count } = await supabase
        .from("registrations")
        .select("id", { count: "exact", head: true })
        .eq("tournament_id", t.id)
        .not("registration_status", "in", '("cancelled","refunded")');
      return { ...t, isFull: count != null && count >= t.max_players };
    }),
  );

  const list = listWithCapacity;

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Hero */}
      <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 overflow-hidden">
        <FloatingDiamonds />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-3 animate-fade-in">
            Sign Up
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 animate-slide-up">
            Choose a <span className="text-gradient-animated">Tournament</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto animate-slide-up-delay">
            Select the tournament you&apos;d like to register for to get
            started.
          </p>
        </div>
      </section>

      {/* Tournament cards */}
      <section className="relative pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {list.length > 0 ? (
            <div className="space-y-4">
              {list.map((t) =>
                t.isFull ? (
                  <div
                    key={t.id}
                    className="relative block rounded-2xl border border-white/5 bg-brand-surface/30 p-6 sm:p-8 opacity-60 cursor-not-allowed"
                  >
                    <div className="relative flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h2 className="text-xl font-bold text-white">
                            {t.name}
                          </h2>
                          <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-400 uppercase tracking-wide">
                            Full
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                          <span className="inline-flex items-center gap-2 text-sm text-gray-400">
                            <CalendarDaysIcon className="w-4 h-4 text-brand-teal flex-shrink-0" />
                            {formatDate(t.event_date)}
                          </span>
                          <span className="inline-flex items-center gap-2 text-sm text-gray-400">
                            <MapPinIcon className="w-4 h-4 text-brand-teal flex-shrink-0" />
                            {t.location_name || "Location TBD"}
                          </span>
                          {t.entry_fee != null && (
                            <span className="inline-flex items-center gap-2 text-sm text-gray-400">
                              <TrophyIcon className="w-4 h-4 text-brand-teal flex-shrink-0" />
                              ${Number(t.entry_fee).toFixed(0)} entry
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={t.id}
                    href={`/register/${t.slug}`}
                    className="group relative block rounded-2xl border border-white/5 bg-brand-surface/50 p-6 sm:p-8 transition-all duration-500 hover:border-brand-teal/30 hover:bg-brand-surface hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-teal/10"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-brand-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-bold text-white mb-3 group-hover:text-brand-teal transition-colors">
                          {t.name}
                        </h2>
                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                          <span className="inline-flex items-center gap-2 text-sm text-gray-400">
                            <CalendarDaysIcon className="w-4 h-4 text-brand-teal flex-shrink-0" />
                            {formatDate(t.event_date)}
                          </span>
                          <span className="inline-flex items-center gap-2 text-sm text-gray-400">
                            <MapPinIcon className="w-4 h-4 text-brand-teal flex-shrink-0" />
                            {t.location_name || "Location TBD"}
                          </span>
                          {t.entry_fee != null && (
                            <span className="inline-flex items-center gap-2 text-sm text-gray-400">
                              <TrophyIcon className="w-4 h-4 text-brand-teal flex-shrink-0" />
                              ${Number(t.entry_fee).toFixed(0)} entry
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-gray-600 group-hover:text-brand-teal group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                    </div>
                  </Link>
                ),
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                <TrophyIcon className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                No Open Tournaments
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                There are no tournaments accepting registrations right now.
                Check back soon — new events are added regularly!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

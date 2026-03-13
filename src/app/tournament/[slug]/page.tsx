import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  CalendarDaysIcon,
  MapPinIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import type {
  Tournament,
  Team,
  GameWithJoins,
  Announcement,
} from "@/lib/types/database";
import TournamentTabs from "./TournamentTabs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("tournaments")
    .select("name")
    .eq("slug", slug)
    .single();

  return {
    title: data?.name ?? "Tournament",
  };
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "TBD";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch tournament
  const { data: tournament } = await supabase
    .from("tournaments")
    .select("*")
    .eq("slug", slug)
    .neq("status", "draft")
    .single();

  if (!tournament) notFound();

  const t = tournament as Tournament;

  // Fetch related data in parallel
  const [teamsRes, gamesRes, announcementsRes] = await Promise.all([
    supabase
      .from("teams")
      .select("*")
      .eq("tournament_id", t.id)
      .order("seed", { ascending: true }),
    supabase
      .from("games")
      .select(
        "*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*), field:fields!field_id(*)",
      )
      .eq("tournament_id", t.id)
      .order("start_time", { ascending: true }),
    supabase
      .from("announcements")
      .select("*")
      .eq("tournament_id", t.id)
      .order("published_at", { ascending: false }),
  ]);

  const teams = (teamsRes.data ?? []) as Team[];
  const games = (gamesRes.data ?? []) as GameWithJoins[];
  const announcements = (announcementsRes.data ?? []) as Announcement[];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Tournament Header */}
      <section className="pt-28 pb-8 sm:pt-36 sm:pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {t.name}
          </h1>

          {/* Quick info pills */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="w-4.5 h-4.5 text-brand-teal" />
              <span>{formatDate(t.event_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-4.5 h-4.5 text-brand-teal" />
              <span>{t.location_name || "Location TBD"}</span>
            </div>
            {t.max_players && (
              <div className="flex items-center gap-2">
                <UserGroupIcon className="w-4.5 h-4.5 text-brand-teal" />
                <span>Up to {t.max_players} players</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tabs Navigation + Content */}
      <section className="pb-24">
        <TournamentTabs
          tournament={t}
          teams={teams}
          games={games}
          announcements={announcements}
        />
      </section>
    </div>
  );
}

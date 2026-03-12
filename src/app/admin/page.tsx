"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Tournament, Game } from "@/lib/types/database";
import {
  TrophyIcon,
  UserGroupIcon,
  PlayIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface DashboardStats {
  totalTournaments: number;
  activeTournament: Tournament | null;
  totalRegistrations: number;
  paidRegistrations: number;
  checkedIn: number;
  gamesScheduled: number;
  gamesInProgress: number;
  gamesCompleted: number;
  upcomingGames: Game[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadDashboard() {
      try {
        const { data: tournaments } = await supabase
          .from("tournaments")
          .select("*")
          .order("event_date", { ascending: false });

        const activeTournament =
          tournaments?.find(
            (t) => t.status === "open" || t.status === "closed",
          ) ?? null;

        let totalRegistrations = 0;
        let paidRegistrations = 0;
        let checkedIn = 0;
        let gamesScheduled = 0;
        let gamesInProgress = 0;
        let gamesCompleted = 0;
        let upcomingGames: Game[] = [];

        if (activeTournament) {
          const { count: regCount } = await supabase
            .from("registrations")
            .select("*", { count: "exact", head: true })
            .eq("tournament_id", activeTournament.id);
          totalRegistrations = regCount ?? 0;

          const { count: paidCount } = await supabase
            .from("registrations")
            .select("*", { count: "exact", head: true })
            .eq("tournament_id", activeTournament.id)
            .eq("payment_status", "paid");
          paidRegistrations = paidCount ?? 0;

          const { count: checkInCount } = await supabase
            .from("registrations")
            .select("*", { count: "exact", head: true })
            .eq("tournament_id", activeTournament.id)
            .eq("check_in_status", "checked_in");
          checkedIn = checkInCount ?? 0;

          const { data: games } = await supabase
            .from("games")
            .select("*")
            .eq("tournament_id", activeTournament.id);

          if (games) {
            gamesScheduled = games.filter(
              (g) => g.status === "scheduled",
            ).length;
            gamesInProgress = games.filter(
              (g) => g.status === "in_progress",
            ).length;
            gamesCompleted = games.filter((g) => g.status === "final").length;
            upcomingGames = games
              .filter(
                (g) => g.status === "scheduled" || g.status === "in_progress",
              )
              .sort((a, b) =>
                (a.start_time ?? "").localeCompare(b.start_time ?? ""),
              )
              .slice(0, 5);
          }
        }

        setStats({
          totalTournaments: tournaments?.length ?? 0,
          activeTournament,
          totalRegistrations,
          paidRegistrations,
          checkedIn,
          gamesScheduled,
          gamesInProgress,
          gamesCompleted,
          upcomingGames,
        });
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [supabase]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-brand-surface animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Registrations",
      value: stats?.totalRegistrations ?? 0,
      sub: `${stats?.paidRegistrations ?? 0} paid`,
      icon: ClipboardDocumentCheckIcon,
      href: "/admin/registrations",
      color: "text-brand-teal",
      bg: "bg-brand-teal/10",
    },
    {
      label: "Checked In",
      value: stats?.checkedIn ?? 0,
      sub: `of ${stats?.totalRegistrations ?? 0}`,
      icon: UserGroupIcon,
      href: "/admin/check-in",
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: "Games",
      value:
        (stats?.gamesScheduled ?? 0) +
        (stats?.gamesInProgress ?? 0) +
        (stats?.gamesCompleted ?? 0),
      sub: `${stats?.gamesInProgress ?? 0} in progress`,
      icon: PlayIcon,
      href: "/admin/games",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      label: "Tournaments",
      value: stats?.totalTournaments ?? 0,
      sub: stats?.activeTournament
        ? stats.activeTournament.name
        : "None active",
      icon: TrophyIcon,
      href: "/admin/tournaments",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          {stats?.activeTournament
            ? `Active: ${stats.activeTournament.name}`
            : "No active tournament — create one to get started."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group relative rounded-2xl bg-brand-surface border border-white/5 p-5 hover:border-white/10 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${card.bg}`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <ArrowRightIcon className="absolute bottom-4 right-4 w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-brand-surface border border-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            {[
              {
                label: "Enter Scores",
                href: "/admin/games",
                desc: "Fast score entry for current games",
              },
              {
                label: "Manage Check-In",
                href: "/admin/check-in",
                desc: "Mark teams as arrived",
              },
              {
                label: "Post Announcement",
                href: "/admin/announcements",
                desc: "Send update to players",
              },
              {
                label: "View Registrations",
                href: "/admin/registrations",
                desc: "Review and approve sign-ups",
              },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-brand-teal transition-colors">
                    {action.label}
                  </p>
                  <p className="text-xs text-gray-500">{action.desc}</p>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-gray-600 group-hover:text-brand-teal transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-brand-surface border border-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Upcoming Games
          </h2>
          {stats?.upcomingGames && stats.upcomingGames.length > 0 ? (
            <div className="space-y-3">
              {stats.upcomingGames.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <div>
                    <p className="text-sm text-white">
                      Game #{game.game_number ?? "—"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {game.round_name ?? game.game_type} •{" "}
                      {game.start_time
                        ? new Date(game.start_time).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "TBD"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      game.status === "in_progress"
                        ? "bg-amber-400/10 text-amber-400"
                        : "bg-white/5 text-gray-400"
                    }`}
                  >
                    {game.status === "in_progress" ? "Live" : "Scheduled"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ExclamationTriangleIcon className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-sm text-gray-500">No upcoming games</p>
              <p className="text-xs text-gray-600 mt-1">
                Schedule games from the Games &amp; Scores page
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

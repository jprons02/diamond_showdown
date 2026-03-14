"use client";

import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { Chip } from "@heroui/react";
import type { Tournament, GameWithJoins } from "@/lib/types/database";

interface GamesTabProps {
  tournament: Tournament;
  games: GameWithJoins[];
}

const statusStyle: Record<
  string,
  {
    label: string;
    color: "default" | "primary" | "success" | "warning" | "danger";
  }
> = {
  scheduled: { label: "Scheduled", color: "default" },
  in_progress: { label: "Live", color: "warning" },
  final: { label: "Final", color: "success" },
  cancelled: { label: "Cancelled", color: "danger" },
  forfeit: { label: "Forfeit", color: "danger" },
};

function formatGameTime(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

export default function GamesTab({ tournament, games }: GamesTabProps) {
  if (games.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
          <CalendarDaysIcon className="w-8 h-8 text-gray-600" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          No Games Scheduled
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          The game schedule will be posted here once matchups are set.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-3">
        {games.map((game) => {
          const st = statusStyle[game.status] ?? statusStyle.scheduled;
          const dt = formatGameTime(game.start_time);
          const homeWon = game.winner_team_id === game.home_team_id;
          const awayWon = game.winner_team_id === game.away_team_id;

          return (
            <div
              key={game.id}
              className="rounded-xl border border-white/5 bg-brand-surface/50 p-4 sm:p-5 hover:border-brand-teal/20 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Teams + Score */}
                <div className="flex-1 min-w-0">
                  {/* Game meta */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {game.round_name && (
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {game.round_name}
                      </span>
                    )}
                    {game.game_number && (
                      <span className="text-xs text-gray-600">
                        Game #{game.game_number}
                      </span>
                    )}
                    <Chip size="sm" variant="flat" color={st.color}>
                      {st.label}
                    </Chip>
                  </div>

                  {/* Matchup */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-semibold truncate ${homeWon ? "text-brand-teal" : "text-white"}`}
                      >
                        {game.home_team?.name ?? "TBD"}
                        {game.home_team?.seed && (
                          <span className="text-xs text-gray-500 ml-1.5">
                            ({game.home_team.seed})
                          </span>
                        )}
                      </div>
                    </div>

                    {game.status === "final" ||
                    game.status === "in_progress" ? (
                      <div className="flex items-center gap-1.5 text-base font-bold tabular-nums">
                        <span
                          className={
                            homeWon ? "text-brand-teal" : "text-gray-400"
                          }
                        >
                          {game.home_score ?? 0}
                        </span>
                        <span className="text-gray-600">-</span>
                        <span
                          className={
                            awayWon ? "text-brand-teal" : "text-gray-400"
                          }
                        >
                          {game.away_score ?? 0}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-600 font-medium">
                        vs
                      </span>
                    )}

                    <div className="flex-1 min-w-0 text-right">
                      <div
                        className={`text-sm font-semibold truncate ${awayWon ? "text-brand-teal" : "text-white"}`}
                      >
                        {game.away_team?.name ?? "TBD"}
                        {game.away_team?.seed && (
                          <span className="text-xs text-gray-500 ml-1.5">
                            ({game.away_team.seed})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time / Field info */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 text-xs text-gray-500 flex-shrink-0">
                  {dt && (
                    <>
                      <div className="flex items-center gap-1">
                        <CalendarDaysIcon className="w-3.5 h-3.5" />
                        <span>{dt.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5" />
                        <span>{dt.time}</span>
                      </div>
                    </>
                  )}
                  {game.field && (
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      <span>{game.field.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

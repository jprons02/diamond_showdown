"use client";

import { TrophyIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { Chip } from "@heroui/react";
import type { Tournament, Team, GameWithJoins } from "@/lib/types/database";

interface BracketTabProps {
  tournament: Tournament;
  teams: Team[];
  games: GameWithJoins[];
}

function MatchupCard({ game }: { game: GameWithJoins }) {
  const homeWon =
    game.status === "final" && game.winner_team_id === game.home_team_id;
  const awayWon =
    game.status === "final" && game.winner_team_id === game.away_team_id;

  return (
    <div className="rounded-xl border border-white/10 bg-brand-surface/60 overflow-hidden hover:border-brand-teal/30 transition-all duration-300">
      {/* Home team */}
      <div
        className={`flex items-center justify-between px-3 py-2.5 border-b border-white/5 ${homeWon ? "bg-brand-teal/10" : ""}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {game.home_team?.seed && (
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-bold flex-shrink-0 ${homeWon ? "bg-brand-teal/20 text-brand-teal" : "bg-white/5 text-gray-500"}`}
            >
              {game.home_team.seed}
            </span>
          )}
          <span
            className={`text-sm font-medium truncate ${homeWon ? "text-white" : "text-gray-400"}`}
          >
            {game.home_team?.name ?? "TBD"}
          </span>
          {homeWon && (
            <ChevronRightIcon className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
          )}
        </div>
        <span
          className={`text-sm font-bold tabular-nums flex-shrink-0 ${homeWon ? "text-brand-teal" : "text-gray-500"}`}
        >
          {game.home_score ?? "-"}
        </span>
      </div>

      {/* Away team */}
      <div
        className={`flex items-center justify-between px-3 py-2.5 ${awayWon ? "bg-brand-teal/10" : ""}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {game.away_team?.seed && (
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-bold flex-shrink-0 ${awayWon ? "bg-brand-teal/20 text-brand-teal" : "bg-white/5 text-gray-500"}`}
            >
              {game.away_team.seed}
            </span>
          )}
          <span
            className={`text-sm font-medium truncate ${awayWon ? "text-white" : "text-gray-400"}`}
          >
            {game.away_team?.name ?? "TBD"}
          </span>
          {awayWon && (
            <ChevronRightIcon className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
          )}
        </div>
        <span
          className={`text-sm font-bold tabular-nums flex-shrink-0 ${awayWon ? "text-brand-teal" : "text-gray-500"}`}
        >
          {game.away_score ?? "-"}
        </span>
      </div>
    </div>
  );
}

export default function BracketTab({
  tournament,
  teams,
  games,
}: BracketTabProps) {
  const bracketGames = games.filter(
    (g) => g.game_type === "bracket" || g.game_type === "championship",
  );

  if (!tournament.bracket_published || bracketGames.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
          <TrophyIcon className="w-8 h-8 text-gray-600" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          Bracket Not Yet Published
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          The tournament bracket will appear here once it has been published by
          the organizers. Check back closer to the event!
        </p>
      </div>
    );
  }

  // Group bracket games by round
  const roundMap = new Map<string, GameWithJoins[]>();
  for (const game of bracketGames) {
    const round = game.round_name ?? "Round";
    if (!roundMap.has(round)) roundMap.set(round, []);
    roundMap.get(round)!.push(game);
  }

  const rounds = Array.from(roundMap.entries());

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Desktop: horizontal bracket */}
      <div
        className="hidden lg:grid gap-6"
        style={{
          gridTemplateColumns: `repeat(${rounds.length}, minmax(220px, 1fr))`,
        }}
      >
        {rounds.map(([roundName, roundGames]) => {
          const isFinal = roundName.toLowerCase().includes("championship");
          return (
            <div key={roundName} className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <h2
                  className={`text-xs font-bold uppercase tracking-widest ${isFinal ? "text-brand-teal" : "text-gray-500"}`}
                >
                  {roundName}
                </h2>
              </div>
              <div className="flex flex-col justify-around flex-1 gap-4">
                {roundGames.map((g) => (
                  <MatchupCard key={g.id} game={g} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: stacked */}
      <div className="lg:hidden space-y-10">
        {rounds.map(([roundName, roundGames]) => (
          <div key={roundName}>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                {roundName}
              </h2>
              <Chip size="sm" variant="flat" className="ml-auto">
                {roundGames.length} {roundGames.length === 1 ? "game" : "games"}
              </Chip>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roundGames.map((g) => (
                <MatchupCard key={g.id} game={g} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { TrophyIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon, StarIcon } from "@heroicons/react/24/solid";
import { Chip } from "@heroui/react";
import { brand } from "@/lib/brand";
import type { Tournament, Team, GameWithJoins } from "@/lib/types/database";

interface BracketTabProps {
  tournament: Tournament;
  teams: Team[];
  games: GameWithJoins[];
}

function MatchupCard({
  game,
  isFinal,
}: {
  game: GameWithJoins;
  isFinal?: boolean;
}) {
  const homeWon =
    game.status === "final" && game.winner_team_id === game.home_team_id;
  const awayWon =
    game.status === "final" && game.winner_team_id === game.away_team_id;

  // If exactly one slot is filled the empty slot is a bye; both empty = TBD.
  const hasHome = !!game.home_team;
  const hasAway = !!game.away_team;
  const homeBye = !hasHome && hasAway;
  const awayBye = !hasAway && hasHome;

  const slots = [
    {
      team: game.home_team,
      score: game.home_score,
      won: homeWon,
      isBye: homeBye,
      border: "border-b border-white/5",
    },
    {
      team: game.away_team,
      score: game.away_score,
      won: awayWon,
      isBye: awayBye,
      border: "",
    },
  ];

  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 overflow-hidden ${
        isFinal
          ? "border-brand-teal/50 glow-teal bg-brand-surface/80"
          : "border-white/10 bg-brand-surface/60 hover:border-brand-teal/30"
      }`}
    >
      {slots.map(({ team, score, won, isBye, border }, i) => {
        if (isBye) {
          return (
            <div
              key={i}
              className={`flex items-center px-3 py-2.5 gap-2 ${border}`}
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-white/20 italic">
                BYE
              </span>
            </div>
          );
        }

        return (
          <div
            key={i}
            className={`flex items-center justify-between px-3 py-2.5 gap-2 ${border} ${won ? "bg-brand-teal/10" : ""}`}
          >
            {/* Seed + Name */}
            <div className="flex items-center gap-2 min-w-0">
              {team?.seed != null && (
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-bold flex-shrink-0 ${
                    won
                      ? "bg-brand-teal/20 text-brand-teal"
                      : "bg-white/5 text-gray-500"
                  }`}
                >
                  {team.seed}
                </span>
              )}
              <span
                className={`text-sm font-medium truncate ${
                  won ? "text-white" : team ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {team?.name ?? "TBD"}
              </span>
              {won && (
                <ChevronRightIcon className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
              )}
            </div>

            {/* Score */}
            <span
              className={`text-sm font-bold tabular-nums flex-shrink-0 ${
                won ? "text-brand-teal" : "text-gray-500"
              }`}
            >
              {score ?? "-"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ChampionBanner({ team }: { team: Team }) {
  return (
    <div className="relative flex flex-col items-center gap-4 py-8 animate-slide-up">
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 bg-brand-teal/20 blur-[100px] rounded-full animate-pulse-glow" />
      </div>

      <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-brand shadow-lg shadow-brand-teal/30">
        <TrophyIcon className="w-10 h-10 text-white" />
      </div>

      <div className="text-center relative">
        <Chip
          color="primary"
          variant="flat"
          startContent={<StarIcon className="w-3.5 h-3.5" />}
          className="mb-3"
          size="sm"
        >
          Champion
        </Chip>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
          {team.name}
        </h3>
        {team.seed && (
          <p className="text-gray-400 text-sm">
            #{team.seed} Seed · {brand.tournament.date}
          </p>
        )}
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

  // Determine champion from the completed championship game
  const championshipGame = bracketGames.find(
    (g) =>
      g.game_type === "championship" && g.status === "final" && g.winner_team,
  );
  const champion = championshipGame?.winner_team ?? null;

  return (
    <div className="pb-20">
      {/* Champion banner */}
      {champion && (
        <section className="pb-6">
          <ChampionBanner team={champion} />
        </section>
      )}

      {/* Bracket grid */}
      <section className="relative overflow-x-auto">
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
                    {isFinal && (
                      <SparklesIcon className="w-4 h-4 text-brand-teal" />
                    )}
                    <h2
                      className={`text-xs font-bold uppercase tracking-widest ${isFinal ? "text-brand-teal" : "text-gray-500"}`}
                    >
                      {roundName}
                    </h2>
                  </div>
                  <div className="flex flex-col justify-around flex-1 gap-4">
                    {roundGames.map((g) => (
                      <MatchupCard key={g.id} game={g} isFinal={isFinal} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: stacked */}
          <div className="lg:hidden space-y-10">
            {rounds.map(([roundName, roundGames]) => {
              const isFinal = roundName.toLowerCase().includes("championship");
              return (
                <div key={roundName}>
                  <div className="flex items-center gap-2 mb-4">
                    {isFinal && (
                      <SparklesIcon className="w-4 h-4 text-brand-teal" />
                    )}
                    <h2
                      className={`text-xs font-bold uppercase tracking-widest ${isFinal ? "text-brand-teal" : "text-gray-500"}`}
                    >
                      {roundName}
                    </h2>
                    <Chip size="sm" variant="flat" className="ml-auto">
                      {roundGames.length}{" "}
                      {roundGames.length === 1 ? "game" : "games"}
                    </Chip>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {roundGames.map((g) => (
                      <MatchupCard key={g.id} game={g} isFinal={isFinal} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bracket legend */}
      <section>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/5 bg-brand-surface/50 p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
              Bracket Info
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-teal mt-1.5 flex-shrink-0" />
                <span>
                  <strong className="text-white">Format:</strong>{" "}
                  {tournament.bracket_format?.replace(/_/g, " ") ??
                    brand.tournament.format}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-teal mt-1.5 flex-shrink-0" />
                <span>
                  <strong className="text-white">Teams:</strong> {teams.length}{" "}
                  team{teams.length !== 1 ? "s" : ""} competing
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-teal mt-1.5 flex-shrink-0" />
                <span>
                  <strong className="text-white">Seeding:</strong> Teams are
                  seeded based on draft order and skill rating
                </span>
              </li>
              {tournament.event_date && (
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-teal mt-1.5 flex-shrink-0" />
                  <span>
                    <strong className="text-white">Date:</strong>{" "}
                    {new Date(tournament.event_date).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    )}
                    {tournament.location_name
                      ? ` · ${tournament.location_name}`
                      : ""}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

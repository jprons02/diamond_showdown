"use client";

import { useState, useMemo, useEffect } from "react";
import { brand } from "@/lib/brand";
import FloatingDiamonds from "@/components/FloatingDiamonds";
import {
  TrophyIcon,
  StarIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { ArrowPathIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Button, Chip, Tooltip } from "@heroui/react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Team {
  seed: number;
  name: string;
  record?: string;
}

interface MatchupResult {
  team1: Team;
  team2: Team;
  score1: number;
  score2: number;
  winner: 1 | 2;
}

/* ------------------------------------------------------------------ */
/*  Simulated team pool (16 teams)                                     */
/* ------------------------------------------------------------------ */

const TEAM_POOL: Team[] = [
  { seed: 1, name: "Diamond Crushers" },
  { seed: 2, name: "Dugout Kings" },
  { seed: 3, name: "Grand Slammers" },
  { seed: 4, name: "Iron Bats" },
  { seed: 5, name: "The Long Balls" },
  { seed: 6, name: "Foul Territory" },
  { seed: 7, name: "Double Plays" },
  { seed: 8, name: "Base Stealers" },
  { seed: 9, name: "Curveball City" },
  { seed: 10, name: "Hit Squad" },
  { seed: 11, name: "Backstop Boyz" },
  { seed: 12, name: "Clutch Hitters" },
  { seed: 13, name: "Walk-Off Warriors" },
  { seed: 14, name: "Outfield Outlaws" },
  { seed: 15, name: "Pinch Runners" },
  { seed: 16, name: "Bench Mob" },
];

/* ------------------------------------------------------------------ */
/*  Simulation helpers                                                 */
/* ------------------------------------------------------------------ */

function simulateScore(): [number, number] {
  // Generate a realistic softball score — higher seed is slightly favored
  const a = Math.floor(Math.random() * 12) + 1;
  let b = Math.floor(Math.random() * 12) + 1;
  if (a === b) b += 1; // no ties
  return [a, b];
}

function simulateRound(teams: Team[]): {
  results: MatchupResult[];
  winners: Team[];
} {
  const results: MatchupResult[] = [];
  const winners: Team[] = [];

  for (let i = 0; i < teams.length; i += 2) {
    const t1 = teams[i];
    const t2 = teams[i + 1];
    let [s1, s2] = simulateScore();

    // Slight bias toward higher seed (lower number)
    if (t1.seed < t2.seed && Math.random() < 0.55) {
      if (s1 < s2) [s1, s2] = [s2, s1];
    } else if (t2.seed < t1.seed && Math.random() < 0.55) {
      if (s2 < s1) [s1, s2] = [s2, s1];
    }

    if (s1 === s2) s1 += 1;

    const winner: 1 | 2 = s1 > s2 ? 1 : 2;
    results.push({ team1: t1, team2: t2, score1: s1, score2: s2, winner });
    winners.push(winner === 1 ? t1 : t2);
  }

  return { results, winners };
}

function simulateBracket(teams: Team[]) {
  const rounds: MatchupResult[][] = [];
  let current = [...teams];

  while (current.length > 1) {
    const { results, winners } = simulateRound(current);
    rounds.push(results);
    current = winners;
  }

  return { rounds, champion: current[0] };
}

/* ------------------------------------------------------------------ */
/*  Round labels                                                       */
/* ------------------------------------------------------------------ */

function roundLabel(roundIndex: number, totalRounds: number) {
  const remaining = totalRounds - roundIndex;
  if (remaining === 1) return "Championship";
  if (remaining === 2) return "Semifinals";
  if (remaining === 3) return "Quarterfinals";
  return `Round ${roundIndex + 1}`;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function MatchupCard({
  matchup,
  isFinal,
}: {
  matchup: MatchupResult;
  isFinal?: boolean;
}) {
  const w = matchup.winner;

  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 overflow-hidden ${
        isFinal
          ? "border-brand-teal/50 glow-teal bg-brand-surface/80"
          : "border-white/10 bg-brand-surface/60 hover:border-brand-teal/30"
      }`}
    >
      {/* Team rows */}
      {[1, 2].map((slot) => {
        const team = slot === 1 ? matchup.team1 : matchup.team2;
        const score = slot === 1 ? matchup.score1 : matchup.score2;
        const isWinner = w === slot;

        return (
          <div
            key={slot}
            className={`flex items-center justify-between px-3 py-2.5 gap-2 ${
              slot === 1 ? "border-b border-white/5" : ""
            } ${isWinner ? "bg-brand-teal/10" : ""}`}
          >
            {/* Seed + Name */}
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-bold flex-shrink-0 ${
                  isWinner
                    ? "bg-brand-teal/20 text-brand-teal"
                    : "bg-white/5 text-gray-500"
                }`}
              >
                {team.seed}
              </span>
              <span
                className={`text-sm font-medium truncate ${
                  isWinner ? "text-white" : "text-gray-400"
                }`}
              >
                {team.name}
              </span>
              {isWinner && (
                <ChevronRightIcon className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
              )}
            </div>

            {/* Score */}
            <span
              className={`text-sm font-bold tabular-nums flex-shrink-0 ${
                isWinner ? "text-brand-teal" : "text-gray-500"
              }`}
            >
              {score}
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
        <p className="text-gray-400 text-sm">
          #{team.seed} Seed · {brand.tournament.date}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function BracketPage() {
  const [simKey, setSimKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Only simulate on the client to avoid hydration mismatch from Math.random()
  const bracket = useMemo(
    () => (mounted ? simulateBracket(TEAM_POOL) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [simKey, mounted],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const rounds = bracket?.rounds ?? [];
  const champion = bracket?.champion;
  const totalRounds = rounds.length;

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Hero header */}
      <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 overflow-hidden">
        <FloatingDiamonds />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-teal font-semibold text-sm uppercase tracking-widest mb-3 animate-fade-in">
            {brand.tournament.format} · {brand.tournament.maxTeams} Teams
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 animate-slide-up">
            Tournament <span className="text-gradient-animated">Bracket</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto mb-8 animate-slide-up-delay">
            Check out a simulated bracket preview for {brand.name} {brand.year}.
            Hit re-simulate to generate a brand-new bracket!
          </p>
          <Tooltip content="Generate a new random bracket" color="primary">
            <Button
              color="primary"
              variant="shadow"
              size="lg"
              className="font-semibold bg-gradient-brand text-white"
              startContent={<ArrowPathIcon className="w-5 h-5" />}
              onPress={() => setSimKey((k) => k + 1)}
            >
              Re-Simulate
            </Button>
          </Tooltip>
        </div>
      </section>

      {/* Champion Banner */}
      {champion && (
        <section className="pb-6">
          <ChampionBanner team={champion} />
        </section>
      )}

      {/* Bracket grid */}
      {rounds.length > 0 && (
        <section className="relative pb-24 overflow-x-auto">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop: horizontal bracket */}
            <div
              className="hidden lg:grid gap-6"
              style={{
                gridTemplateColumns: `repeat(${totalRounds}, minmax(220px, 1fr))`,
              }}
            >
              {rounds.map((round, rIdx) => {
                const label = roundLabel(rIdx, totalRounds);
                const isFinal = rIdx === totalRounds - 1;

                return (
                  <div key={rIdx} className="flex flex-col">
                    {/* Round header */}
                    <div className="flex items-center gap-2 mb-4">
                      {isFinal && (
                        <SparklesIcon className="w-4 h-4 text-brand-teal" />
                      )}
                      <h2
                        className={`text-xs font-bold uppercase tracking-widest ${
                          isFinal ? "text-brand-teal" : "text-gray-500"
                        }`}
                      >
                        {label}
                      </h2>
                    </div>

                    {/* Matchups — vertically centered relative to their bracket position */}
                    <div className="flex flex-col justify-around flex-1 gap-4">
                      {round.map((m, mIdx) => (
                        <MatchupCard key={mIdx} matchup={m} isFinal={isFinal} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile / Tablet: stacked rounds */}
            <div className="lg:hidden space-y-10">
              {rounds.map((round, rIdx) => {
                const label = roundLabel(rIdx, totalRounds);
                const isFinal = rIdx === totalRounds - 1;

                return (
                  <div key={rIdx}>
                    <div className="flex items-center gap-2 mb-4">
                      {isFinal && (
                        <SparklesIcon className="w-4 h-4 text-brand-teal" />
                      )}
                      <h2
                        className={`text-xs font-bold uppercase tracking-widest ${
                          isFinal ? "text-brand-teal" : "text-gray-500"
                        }`}
                      >
                        {label}
                      </h2>
                      <Chip size="sm" variant="flat" className="ml-auto">
                        {round.length} {round.length === 1 ? "game" : "games"}
                      </Chip>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {round.map((m, mIdx) => (
                        <MatchupCard key={mIdx} matchup={m} isFinal={isFinal} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Bracket legend */}
      <section className="pb-20">
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
                  {brand.tournament.format} with {brand.tournament.maxTeams}{" "}
                  teams
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-teal mt-1.5 flex-shrink-0" />
                <span>
                  <strong className="text-white">Seeding:</strong> Teams are
                  seeded 1–{brand.tournament.maxTeams} based on draft order and
                  skill rating
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-teal mt-1.5 flex-shrink-0" />
                <span>
                  <strong className="text-white">Simulation:</strong> Scores are
                  randomly generated with a slight advantage to higher-seeded
                  teams
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-teal mt-1.5 flex-shrink-0" />
                <span>
                  <strong className="text-white">Dates:</strong>{" "}
                  {brand.tournament.date} · {brand.tournament.location}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import type React from "react";
import {
  TableCellsIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import type { Tournament, Team } from "@/lib/types/database";

// ─── Exported type so page.tsx / TournamentTabs can share it ─────────
export type DraftPick = {
  id: string;
  team_id: string;
  draft_pick_number: number;
  is_captain: boolean;
  registration: {
    player: {
      first_name: string;
      last_name: string;
      preferred_position: string | null;
    } | null;
  } | null;
};

// ─── Position abbreviation map ────────────────────────────────────────
const POS_ABBR: Record<string, string> = {
  Pitcher: "P",
  Catcher: "C",
  "First Base": "1B",
  "Second Base": "2B",
  Shortstop: "SS",
  "Third Base": "3B",
  "Left Field": "LF",
  "Left Center Field": "LCF",
  "Right Center Field": "RCF",
  "Right Field": "RF",
  Utility: "UTIL",
};

function abbrPos(pos: string | null | undefined): string | null {
  if (!pos) return null;
  return POS_ABBR[pos] ?? pos;
}

// ─── Position colour helper (inline styles — avoids Tailwind purge issues) ───
function posStyle(pos: string | null | undefined): React.CSSProperties {
  if (pos === "P") return { backgroundColor: "rgba(239,68,68,0.3)" };
  if (pos) return { backgroundColor: "rgba(14,211,207,0.25)" };
  return { backgroundColor: "rgba(255,255,255,0.05)" };
}

// ─── Props ───────────────────────────────────────────────────────────
interface DraftTabProps {
  tournament: Tournament;
  teams: Team[];
  draftPicks: DraftPick[];
}

// ─── Empty state ─────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
        <TableCellsIcon className="w-8 h-8 text-gray-600" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">
        Draft Not Yet Available
      </h2>
      <p className="text-gray-400 max-w-md mx-auto">
        The draft results will be posted here once teams have been formed and
        picks have been recorded.
      </p>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────
export default function DraftTab({
  tournament,
  teams,
  draftPicks,
}: DraftTabProps) {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const colHeaderRefs = useRef<(HTMLTableCellElement | null)[]>([]);

  // Scroll selected team into centre view (or back to start for "All Teams")
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (selectedTeam === null) {
      container.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    const th = colHeaderRefs.current[selectedTeam];
    if (!th || !container) return;
    const containerLeft = container.getBoundingClientRect().left;
    const thLeft = th.getBoundingClientRect().left;
    const thWidth = th.offsetWidth;
    const containerWidth = container.clientWidth;
    const scrollTarget =
      container.scrollLeft +
      (thLeft - containerLeft) -
      containerWidth / 2 +
      thWidth / 2;
    container.scrollTo({ left: scrollTarget, behavior: "smooth" });
  }, [selectedTeam]);

  if (teams.length === 0 || draftPicks.length === 0) return <EmptyState />;

  const numTeams = teams.length;
  const teamColMap = new Map(teams.map((t, idx) => [t.id, idx]));

  const maxPick = Math.max(...draftPicks.map((p) => p.draft_pick_number));
  const numRounds = Math.ceil(maxPick / numTeams);

  // Build grid[roundIdx][colIdx] = pick
  const grid: (DraftPick | null)[][] = Array.from({ length: numRounds }, () =>
    Array<DraftPick | null>(numTeams).fill(null),
  );
  for (const pick of draftPicks) {
    const roundIdx = Math.floor((pick.draft_pick_number - 1) / numTeams);
    const colIdx = teamColMap.get(pick.team_id);
    if (colIdx === undefined || roundIdx >= numRounds) continue;
    grid[roundIdx][colIdx] = pick;
  }

  const totalPicks = draftPicks.length;

  return (
    <div>
      {/* Sub-header */}
      <div className="border-b border-white/5 bg-brand-surface/40 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircleIcon className="w-4 h-4 text-brand-teal" />
            <span className="text-xs font-semibold text-brand-teal uppercase tracking-widest">
              Draft Complete
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Snake draft &middot; {numTeams} teams &middot; {numRounds} rounds
            &middot; {totalPicks} total picks
          </p>
        </div>
      </div>

      {/* Board */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Team filter chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setSelectedTeam(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedTeam === null
                ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/25"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            All Teams
          </button>
          {teams.map((team, idx) => (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(selectedTeam === idx ? null : idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedTeam === idx
                  ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/25"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {team.name}
            </button>
          ))}
        </div>

        {/* Scrollable grid */}
        <div
          className="overflow-x-auto rounded-2xl border border-white/5 bg-brand-surface/30"
          ref={scrollContainerRef}
        >
          <table
            className="w-full border-collapse"
            style={{ minWidth: `${numTeams * 120 + 48}px` }}
          >
            <thead>
              <tr>
                <th className="sticky left-0 z-20 bg-brand-surface/90 backdrop-blur-md px-3 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-r border-white/5 w-12 text-center">
                  Rd
                </th>
                {teams.map((team, idx) => (
                  <th
                    key={team.id}
                    ref={(el) => {
                      colHeaderRefs.current[idx] = el;
                    }}
                    onClick={() =>
                      setSelectedTeam(selectedTeam === idx ? null : idx)
                    }
                    className={`px-2 py-3 text-[11px] font-bold uppercase tracking-wider border-b border-white/5 text-center cursor-pointer transition-colors ${
                      selectedTeam === idx
                        ? "text-brand-teal bg-brand-teal/5"
                        : selectedTeam !== null
                          ? "text-gray-600"
                          : "text-gray-400"
                    } hover:text-brand-teal`}
                  >
                    {team.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.map((row, roundIdx) => (
                <tr key={roundIdx}>
                  {/* Round + direction */}
                  <td className="sticky left-0 z-10 bg-brand-surface/90 backdrop-blur-md px-2 py-1 border-r border-white/5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs font-bold text-gray-500">
                        {roundIdx + 1}
                      </span>
                      {roundIdx % 2 === 0 ? (
                        <ChevronRightIcon className="w-3 h-3 text-gray-600" />
                      ) : (
                        <ChevronLeftIcon className="w-3 h-3 text-gray-600" />
                      )}
                    </div>
                  </td>

                  {row.map((pick, colIdx) => {
                    const dimmed =
                      selectedTeam !== null && selectedTeam !== colIdx;
                    const highlighted =
                      selectedTeam !== null && selectedTeam === colIdx;
                    const pos = abbrPos(
                      pick?.registration?.player?.preferred_position,
                    );
                    const name = pick?.registration?.player
                      ? `${pick.registration.player.first_name} ${pick.registration.player.last_name}`
                      : null;

                    return (
                      <td
                        key={colIdx}
                        className={`px-1 py-1 border-b border-white/[0.03] transition-opacity duration-200 ${
                          dimmed ? "opacity-20" : ""
                        }`}
                      >
                        {pick && name && (
                          <div
                            className={`rounded-lg px-2 py-2 border border-black/20 text-center ${
                              highlighted
                                ? "ring-2 ring-white ring-offset-1 ring-offset-brand-dark"
                                : ""
                            }`}
                            style={posStyle(pos)}
                          >
                            <div className="flex items-center justify-center gap-1 leading-none mb-0.5">
                              {pos && (
                                <span className="text-xs font-bold text-white/80">
                                  {pos}
                                </span>
                              )}
                              <span className="text-[10px] text-white/50">
                                #{pick.draft_pick_number}
                              </span>
                              {pick.is_captain && (
                                <StarIcon className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                              )}
                            </div>
                            <div className="text-xs font-bold text-white leading-tight truncate">
                              {name}
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Snake draft note */}
        <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-400">Snake Draft:</span>{" "}
            The pick order reverses each round. Round 1 goes picks 1→{numTeams},
            Round 2 goes {numTeams}→1, and so on. This helps balance competitive
            fairness across all teams.
          </p>
        </div>
      </div>
    </div>
  );
}

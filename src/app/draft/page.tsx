"use client";

import { useState, useRef, useEffect } from "react";
import { brand } from "@/lib/brand";
import {
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

/* ─── Position color map ─── */
const posColors: Record<string, string> = {
  P: "bg-red-500",
  C: "bg-orange-500",
  "1B": "bg-yellow-500",
  "2B": "bg-emerald-500",
  SS: "bg-cyan-500",
  "3B": "bg-blue-500",
  LF: "bg-violet-500",
  LCF: "bg-purple-500",
  RCF: "bg-fuchsia-500",
  RF: "bg-pink-500",
  UTIL: "bg-slate-500",
};

const posLabels = Object.keys(posColors);

/* ─── Teams ─── */
const teams = [
  "Diamond Dogs",
  "Sluggers",
  "Fireballs",
  "Thunder",
  "Vipers",
  "Renegades",
  "Aces",
  "Mustangs",
  "Outlaws",
  "Titans",
];

/* ─── Player type ─── */
interface Pick {
  name: string;
  pos: string;
}

/* ─── Snake draft picks: 15 rounds × 10 teams ─── */
const draftPicks: Pick[][] = [
  // Round 1 (1→10)
  [
    { name: "Marcus Rivera", pos: "P" },
    { name: "Jake Thompson", pos: "SS" },
    { name: "Derek Lawson", pos: "P" },
    { name: "Chris Morales", pos: "LCF" },
    { name: "Tyler Briggs", pos: "1B" },
    { name: "Nate Harper", pos: "3B" },
    { name: "Caleb Dunn", pos: "C" },
    { name: "Jordan Vega", pos: "SS" },
    { name: "Ryan Kimura", pos: "P" },
    { name: "Luis Estrada", pos: "RCF" },
  ],
  // Round 2 (10→1)
  [
    { name: "Brandon Cole", pos: "LF" },
    { name: "Eli Marsh", pos: "2B" },
    { name: "Gavin Price", pos: "RF" },
    { name: "Sean O'Brien", pos: "1B" },
    { name: "Will Tran", pos: "C" },
    { name: "Andre Mitchell", pos: "P" },
    { name: "Jason Fuller", pos: "LCF" },
    { name: "Troy Nguyen", pos: "3B" },
    { name: "Dylan Shaw", pos: "LF" },
    { name: "Matt Reeves", pos: "2B" },
  ],
  // Round 3 (1→10)
  [
    { name: "Ian Cross", pos: "3B" },
    { name: "Victor Ramos", pos: "RF" },
    { name: "Shane Walker", pos: "C" },
    { name: "Alex Whitfield", pos: "SS" },
    { name: "Omar Davis", pos: "P" },
    { name: "Ben Larson", pos: "RCF" },
    { name: "Kyle Fischer", pos: "2B" },
    { name: "Aaron Beck", pos: "LF" },
    { name: "Dante Howard", pos: "1B" },
    { name: "Mason Pierce", pos: "3B" },
  ],
  // Round 4 (10→1)
  [
    { name: "Tony Salazar", pos: "RF" },
    { name: "Jared Flynn", pos: "1B" },
    { name: "Corey Young", pos: "LF" },
    { name: "Greg Palmer", pos: "2B" },
    { name: "Luke Bennett", pos: "3B" },
    { name: "Sam Wolfe", pos: "RF" },
    { name: "Dean Morrow", pos: "1B" },
    { name: "Patrick Hale", pos: "P" },
    { name: "Jesse Grant", pos: "LCF" },
    { name: "Colin Reyes", pos: "SS" },
  ],
  // Round 5 (1→10)
  [
    { name: "Bryce Keller", pos: "C" },
    { name: "Zach Pittman", pos: "LF" },
    { name: "Trent Orozco", pos: "SS" },
    { name: "Noah Garrison", pos: "RF" },
    { name: "Kevin Steele", pos: "2B" },
    { name: "Adam Poole", pos: "1B" },
    { name: "Eric Rojas", pos: "3B" },
    { name: "Ray Dalton", pos: "C" },
    { name: "Cameron Boyd", pos: "LF" },
    { name: "Blake Hubbard", pos: "P" },
  ],
  // Round 6 (10→1)
  [
    { name: "Trevor Stein", pos: "2B" },
    { name: "Austin Crane", pos: "RCF" },
    { name: "Darren Knox", pos: "3B" },
    { name: "Logan Pace", pos: "P" },
    { name: "Hector Solis", pos: "LF" },
    { name: "Ivan Torres", pos: "SS" },
    { name: "Wade Conner", pos: "RF" },
    { name: "Beau Harmon", pos: "2B" },
    { name: "Miles Barton", pos: "RF" },
    { name: "Chase Avery", pos: "C" },
  ],
  // Round 7 (1→10)
  [
    { name: "Reggie Chen", pos: "LCF" },
    { name: "Danny Frost", pos: "P" },
    { name: "Keith Osborne", pos: "1B" },
    { name: "Philip Doyle", pos: "C" },
    { name: "Russ Kemp", pos: "RF" },
    { name: "Ty Navarro", pos: "LF" },
    { name: "Cody Bates", pos: "SS" },
    { name: "Martin Gould", pos: "RCF" },
    { name: "Brian Yates", pos: "2B" },
    { name: "Steve Lowe", pos: "1B" },
  ],
  // Round 8 (10→1)
  [
    { name: "Wayne Buckley", pos: "SS" },
    { name: "Hugo Medina", pos: "3B" },
    { name: "Frank Gill", pos: "RF" },
    { name: "Vince Pratt", pos: "LF" },
    { name: "Scott Mack", pos: "1B" },
    { name: "Pete Randall", pos: "C" },
    { name: "Leo Sparks", pos: "P" },
    { name: "Ricky Norris", pos: "RF" },
    { name: "Juan Peña", pos: "3B" },
    { name: "Ken Mercer", pos: "LCF" },
  ],
  // Round 9 (1→10)
  [
    { name: "Seth Holden", pos: "LF" },
    { name: "Drew Combs", pos: "C" },
    { name: "Alan Brock", pos: "2B" },
    { name: "Neil Archer", pos: "3B" },
    { name: "George Huff", pos: "RCF" },
    { name: "Liam Cooke", pos: "2B" },
    { name: "Ross Wiley", pos: "LF" },
    { name: "Carl Hensley", pos: "1B" },
    { name: "Toby Stark", pos: "SS" },
    { name: "Felix Quinn", pos: "RF" },
  ],
  // Round 10 (10→1)
  [
    { name: "Max Sheldon", pos: "1B" },
    { name: "Owen Weeks", pos: "SS" },
    { name: "Grant Petty", pos: "P" },
    { name: "Roy Cannon", pos: "UTIL" },
    { name: "Harry Payne", pos: "C" },
    { name: "Mitch Graves", pos: "3B" },
    { name: "Dale Vaughn", pos: "RF" },
    { name: "Todd Padilla", pos: "LF" },
    { name: "Jeff Mosley", pos: "P" },
    { name: "Alec Horn", pos: "2B" },
  ],
  // Round 11 (1→10)
  [
    { name: "Rick Dunlap", pos: "P" },
    { name: "Dustin Foley", pos: "UTIL" },
    { name: "Clark Booker", pos: "LCF" },
    { name: "Byron Reed", pos: "LF" },
    { name: "Walt Ingram", pos: "SS" },
    { name: "Glenn Shaffer", pos: "UTIL" },
    { name: "Neal Trujillo", pos: "C" },
    { name: "Art Serrano", pos: "3B" },
    { name: "Hugh Skinner", pos: "RF" },
    { name: "Lloyd Castro", pos: "LF" },
  ],
  // Round 12 (10→1)
  [
    { name: "Saul Roberson", pos: "UTIL" },
    { name: "Otis Hartley", pos: "RF" },
    { name: "Kurt Maynard", pos: "2B" },
    { name: "Virgil Stokes", pos: "C" },
    { name: "Clint Barker", pos: "UTIL" },
    { name: "Boyd Lambert", pos: "LCF" },
    { name: "Gus Hampton", pos: "UTIL" },
    { name: "Ira Hendrix", pos: "SS" },
    { name: "Lyle Blackwell", pos: "UTIL" },
    { name: "Ned Villarreal", pos: "3B" },
  ],
  // Round 13 (1→10)
  [
    { name: "Rex Donovan", pos: "3B" },
    { name: "Perry Hogan", pos: "UTIL" },
    { name: "Willis Lang", pos: "UTIL" },
    { name: "Doyle Garrett", pos: "RF" },
    { name: "Rufus Lynch", pos: "UTIL" },
    { name: "Ned Hodge", pos: "P" },
    { name: "Homer Stein", pos: "UTIL" },
    { name: "Murray Fox", pos: "UTIL" },
    { name: "Dewey Phelps", pos: "C" },
    { name: "Cecil Greer", pos: "UTIL" },
  ],
  // Round 14 (10→1)
  [
    { name: "Abel Cardenas", pos: "UTIL" },
    { name: "Amos Waller", pos: "LF" },
    { name: "Wilbur Day", pos: "UTIL" },
    { name: "Elmer Mays", pos: "UTIL" },
    { name: "Sterling Webb", pos: "P" },
    { name: "Earl Branch", pos: "UTIL" },
    { name: "Miles Vance", pos: "UTIL" },
    { name: "Luther Craig", pos: "RCF" },
    { name: "Boyd Mathis", pos: "UTIL" },
    { name: "Roscoe Strong", pos: "P" },
  ],
  // Round 15 (1→10)
  [
    { name: "Harvey Simon", pos: "UTIL" },
    { name: "Floyd Wagner", pos: "UTIL" },
    { name: "Chester Gibbs", pos: "UTIL" },
    { name: "Archie Burns", pos: "UTIL" },
    { name: "Vernon Rice", pos: "UTIL" },
    { name: "Horace Riley", pos: "UTIL" },
    { name: "Sherman Moss", pos: "UTIL" },
    { name: "Jasper Love", pos: "UTIL" },
    { name: "Wilfred Stone", pos: "UTIL" },
    { name: "Grover Hart", pos: "UTIL" },
  ],
];

/**
 * Get the actual team-column index for a given round/pick in a snake draft.
 * Odd rounds (0-indexed) go L→R, even rounds go R→L.
 */
function snakeIndex(round: number, pick: number, teamCount: number): number {
  return round % 2 === 0 ? pick : teamCount - 1 - pick;
}

export default function DraftPage() {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const colHeaderRefs = useRef<(HTMLTableCellElement | null)[]>([]);

  useEffect(() => {
    if (selectedTeam === null) return;
    const th = colHeaderRefs.current[selectedTeam];
    const container = scrollContainerRef.current;
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

  /* Build a grid: grid[round][teamCol] = Pick */
  const grid: (Pick | null)[][] = draftPicks.map((roundPicks, roundIdx) => {
    const row: (Pick | null)[] = Array(teams.length).fill(null);
    roundPicks.forEach((pick, pickIdx) => {
      const col = snakeIndex(roundIdx, pickIdx, teams.length);
      row[col] = pick;
    });
    return row;
  });

  const overallPick = (round: number, col: number): number => {
    if (round % 2 === 0) {
      return round * teams.length + col + 1;
    }
    return round * teams.length + (teams.length - col);
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <div className="border-b border-white/5 bg-brand-surface/60 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircleIcon className="w-5 h-5 text-brand-teal" />
                <span className="text-xs font-semibold text-brand-teal uppercase tracking-widest">
                  Draft Complete
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {brand.name} — {brand.year} Player Draft
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Snake draft &middot; {teams.length} teams &middot;{" "}
                {draftPicks.length} rounds &middot;{" "}
                {draftPicks.length * teams.length} total picks
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2">
              {posLabels.map((pos) => (
                <span
                  key={pos}
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold text-white ${posColors[pos]}`}
                >
                  {pos}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Draft Board */}
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
              key={team}
              onClick={() => setSelectedTeam(selectedTeam === idx ? null : idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedTeam === idx
                  ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/25"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {team}
            </button>
          ))}
        </div>

        {/* Scrollable grid */}
        <div
          className="overflow-x-auto rounded-2xl border border-white/5 bg-brand-surface/30"
          ref={scrollContainerRef}
        >
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-20 bg-brand-surface/90 backdrop-blur-md px-3 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-r border-white/5 w-12 text-center">
                  Rd
                </th>
                {teams.map((team, idx) => (
                  <th
                    key={team}
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
                    {team}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.map((row, roundIdx) => (
                <tr key={roundIdx}>
                  {/* Round number + direction arrow */}
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
                    return (
                      <td
                        key={colIdx}
                        className={`px-1 py-1 border-b border-white/[0.03] transition-opacity duration-200 ${
                          dimmed ? "opacity-20" : ""
                        }`}
                      >
                        {pick && (
                          <div
                            className={`rounded-lg px-2 py-2 border border-black/20 text-center ${
                              posColors[pick.pos]
                            } ${
                              highlighted
                                ? "ring-2 ring-white ring-offset-1 ring-offset-brand-dark"
                                : ""
                            }`}
                          >
                            <div className="text-xs font-bold text-white/80 leading-none mb-0.5">
                              {pick.pos}{" "}
                              <span className="text-white/50 font-normal">
                                #{overallPick(roundIdx, colIdx)}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-white leading-tight truncate">
                              {pick.name}
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

        {/* Snake draft explanation */}
        <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-400">Snake Draft:</span>{" "}
            The pick order reverses each round. Round 1 goes picks 1→10, Round 2
            goes 10→1, and so on. This helps balance competitive fairness across
            all teams.
          </p>
        </div>
      </div>
    </div>
  );
}

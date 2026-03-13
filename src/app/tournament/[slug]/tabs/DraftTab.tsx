"use client";

import { TableCellsIcon } from "@heroicons/react/24/outline";
import type { Tournament, Team } from "@/lib/types/database";

interface DraftTabProps {
  tournament: Tournament;
  teams: Team[];
}

export default function DraftTab({ tournament, teams }: DraftTabProps) {
  if (teams.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
          <TableCellsIcon className="w-8 h-8 text-gray-600" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          Draft Not Yet Available
        </h2>
        <p className="text-gray-400 max-w-md mx-auto">
          The draft results will be posted here once teams have been formed.
          Stay tuned!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team, idx) => (
          <div
            key={team.id}
            className="rounded-2xl border border-white/5 bg-brand-surface/50 p-5 hover:border-brand-teal/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              {team.seed && (
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-brand-teal/10 text-brand-teal font-bold text-sm">
                  #{team.seed}
                </span>
              )}
              <div>
                <h3 className="text-base font-bold text-white">{team.name}</h3>
                {team.coach_name && (
                  <p className="text-xs text-gray-500">
                    Coach: {team.coach_name}
                  </p>
                )}
              </div>
              {team.color && (
                <span
                  className="ml-auto w-4 h-4 rounded-full border border-white/10 flex-shrink-0"
                  style={{ backgroundColor: team.color }}
                />
              )}
            </div>

            <p className="text-xs text-gray-500">
              Full roster details coming soon.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

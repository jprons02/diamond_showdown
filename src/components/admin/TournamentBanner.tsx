"use client";

import { usePathname } from "next/navigation";
import { useTournament } from "@/components/admin/TournamentContext";
import { TrophyIcon } from "@heroicons/react/24/outline";

export default function TournamentBanner() {
  const { selected, loading } = useTournament();
  const pathname = usePathname();

  // Hide on the Tournaments page — it lists all tournaments, not one specific one
  if (pathname === "/admin/tournaments") return null;

  if (loading || !selected) return null;

  const statusColors: Record<string, string> = {
    draft: "bg-gray-500/10 text-gray-400",
    open: "bg-emerald-400/10 text-emerald-400",
    closed: "bg-amber-400/10 text-amber-400",
    completed: "bg-brand-teal/10 text-brand-teal",
    cancelled: "bg-red-400/10 text-red-400",
  };

  return (
    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
      <TrophyIcon className="w-4 h-4 text-brand-teal shrink-0" />
      <span className="text-sm font-medium text-white truncate">
        {selected.name}
      </span>
      <span
        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColors[selected.status] ?? "bg-white/5 text-gray-400"}`}
      >
        {selected.status}
      </span>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  Tournament,
  RegistrationWithPlayer,
  CheckInStatus,
} from "@/lib/types/database";
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const CHECK_IN_COLORS: Record<string, string> = {
  checked_in: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  not_arrived: "bg-white/5 text-gray-400 border-white/5",
  no_show: "bg-red-400/10 text-red-400 border-red-400/20",
};

export default function CheckInPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>("");
  const [registrations, setRegistrations] = useState<RegistrationWithPlayer[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("tournaments")
        .select("*")
        .order("event_date", { ascending: false });
      const list = data ?? [];
      setTournaments(list);
      if (list.length > 0) {
        const active = list.find(
          (t) => t.status === "open" || t.status === "closed",
        );
        setSelectedTournamentId(active?.id ?? list[0].id);
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  const loadRegistrations = useCallback(async () => {
    if (!selectedTournamentId) return;
    setLoading(true);
    const { data } = await supabase
      .from("registrations")
      .select("*, player:players(*)")
      .eq("tournament_id", selectedTournamentId)
      .in("registration_status", ["confirmed", "checked_in", "no_show"])
      .order("created_at", { ascending: true });
    setRegistrations((data as RegistrationWithPlayer[]) ?? []);
    setLoading(false);
  }, [supabase, selectedTournamentId]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  async function setCheckIn(regId: string, status: CheckInStatus) {
    const updates: Record<string, unknown> = { check_in_status: status };
    if (status === "checked_in") {
      updates.registration_status = "checked_in";
    } else if (status === "no_show") {
      updates.registration_status = "no_show";
    }
    await supabase.from("registrations").update(updates).eq("id", regId);
    loadRegistrations();
  }

  const filtered = registrations.filter((r) => {
    if (!search) return true;
    const player = r.player;
    return `${player?.first_name} ${player?.last_name} ${player?.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const checkedInCount = registrations.filter(
    (r) => r.check_in_status === "checked_in",
  ).length;
  const totalConfirmed = registrations.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Check-In</h1>
        <p className="text-gray-400 text-sm mt-1">
          Mark players as arrived on tournament day
        </p>
      </div>

      {/* Tournament selector + stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <select
          className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-teal/50"
          value={selectedTournamentId}
          onChange={(e) => setSelectedTournamentId(e.target.value)}
        >
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
            <span className="text-2xl font-bold text-emerald-400">
              {checkedInCount}
            </span>
            <span className="text-xs text-gray-400 ml-1">
              / {totalConfirmed} checked in
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-teal/50"
          placeholder="Search player name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Check-in list */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-brand-surface animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-brand-surface border border-white/5 p-12 text-center">
          <p className="text-gray-400">
            No confirmed registrations to check in
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((reg) => {
            const player = reg.player;
            const status = reg.check_in_status ?? "not_arrived";
            return (
              <div
                key={reg.id}
                className={`rounded-xl border p-4 flex items-center justify-between transition-all ${CHECK_IN_COLORS[status]}`}
              >
                <div className="flex items-center gap-3">
                  {status === "checked_in" ? (
                    <CheckCircleIcon className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : status === "no_show" ? (
                    <XCircleIcon className="w-6 h-6 text-red-400 shrink-0" />
                  ) : (
                    <ClockIcon className="w-6 h-6 text-gray-500 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">
                      {player?.first_name} {player?.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{player?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {status !== "checked_in" && (
                    <button
                      onClick={() => setCheckIn(reg.id, "checked_in")}
                      className="text-xs px-3 py-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 transition-colors font-medium"
                    >
                      Check In
                    </button>
                  )}
                  {status === "checked_in" && (
                    <button
                      onClick={() => setCheckIn(reg.id, "not_arrived")}
                      className="text-xs px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Undo
                    </button>
                  )}
                  {status !== "no_show" && (
                    <button
                      onClick={() => setCheckIn(reg.id, "no_show")}
                      className="text-xs px-3 py-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      No Show
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

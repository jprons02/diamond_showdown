"use client";

import { useEffect, useState, useCallback } from "react";
import type {
  RegistrationWithPlayer,
  CheckInStatus,
} from "@/lib/types/database";
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Input, Button } from "@heroui/react";
import { useTournament } from "@/components/admin/TournamentContext";
import { RowSkeleton, SaveSpinner } from "@/components/admin/AdminLoading";

const CHECK_IN_COLORS: Record<string, string> = {
  checked_in: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  not_arrived: "bg-white/5 text-gray-400 border-white/5",
  no_show: "bg-red-400/10 text-red-400 border-red-400/20",
};

export default function CheckInPage() {
  const { selectedId: selectedTournamentId } = useTournament();
  const [registrations, setRegistrations] = useState<RegistrationWithPlayer[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionRegId, setActionRegId] = useState<string | null>(null);

  const loadRegistrations = useCallback(async () => {
    if (!selectedTournamentId) return;
    setLoading(true);
    const res = await fetch(
      `/api/admin/registrations?tournament_id=${selectedTournamentId}`,
    );
    const data = await res.json();
    const all: RegistrationWithPlayer[] = Array.isArray(data) ? data : [];
    setRegistrations(
      all.filter((r) =>
        ["confirmed", "checked_in", "no_show"].includes(r.registration_status),
      ),
    );
    setLoading(false);
  }, [selectedTournamentId]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  async function setCheckIn(regId: string, status: CheckInStatus) {
    setActionRegId(regId);
    const updates: Record<string, unknown> = { check_in_status: status };
    if (status === "checked_in") {
      updates.registration_status = "checked_in";
    } else if (status === "no_show") {
      updates.registration_status = "no_show";
    }
    await fetch("/api/admin/registrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: regId, ...updates }),
    });
    setActionRegId(null);
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

      {/* Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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
      <Input
        variant="bordered"
        placeholder="Search player name or email…"
        value={search}
        onValueChange={setSearch}
        startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />}
      />

      {/* Check-in list */}
      {loading ? (
        <RowSkeleton count={6} height="h-16" />
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
                    <Button
                      size="sm"
                      color="success"
                      variant="flat"
                      isLoading={actionRegId === reg.id}
                      onPress={() => setCheckIn(reg.id, "checked_in")}
                    >
                      Check In
                    </Button>
                  )}
                  {status === "checked_in" && (
                    <Button
                      size="sm"
                      variant="light"
                      isLoading={actionRegId === reg.id}
                      onPress={() => setCheckIn(reg.id, "not_arrived")}
                    >
                      Undo
                    </Button>
                  )}
                  {status !== "no_show" && (
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      isLoading={actionRegId === reg.id}
                      onPress={() => setCheckIn(reg.id, "no_show")}
                    >
                      No Show
                    </Button>
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

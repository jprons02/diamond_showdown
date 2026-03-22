"use client";

import type { CheckInStatus } from "@/lib/types/database";
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Input, Button } from "@heroui/react";
import { useTournament } from "@/components/admin/TournamentContext";
import { RowSkeleton } from "@/components/admin/AdminLoading";
import { useCheckIn } from "@/hooks/admin/useCheckIn";
import { CHECK_IN_COLORS } from "@/lib/constants/statusColors";

export default function CheckInPage() {
  const { selectedId: selectedTournamentId } = useTournament();
  const {
    filtered,
    loading,
    search,
    setSearch,
    actionId,
    setCheckIn,
    checkedInCount,
    totalConfirmed,
  } = useCheckIn(selectedTournamentId ?? "");

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
      {!selectedTournamentId ? (
        <div className="rounded-2xl bg-brand-surface border border-white/5 p-12 text-center">
          <p className="text-gray-400">
            Select a tournament to manage check-in
          </p>
        </div>
      ) : loading ? (
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
                      isLoading={actionId === reg.id}
                      onPress={() => setCheckIn(reg.id, "checked_in")}
                    >
                      Check In
                    </Button>
                  )}
                  {status === "checked_in" && (
                    <Button
                      size="sm"
                      variant="light"
                      isLoading={actionId === reg.id}
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
                      isLoading={actionId === reg.id}
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

"use client";

import { Button, Input } from "@heroui/react";
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { DialogShell } from "@/components/admin/DialogShell";
import { useCheckIn } from "@/hooks/admin/useCheckIn";

export function CheckInDialog({
  tournamentId,
  onClose,
  onDataChange,
}: {
  tournamentId: string;
  onClose: () => void;
  onDataChange: () => void;
}) {
  const {
    filtered,
    loading,
    search,
    setSearch,
    actionId,
    setCheckIn: baseCheckIn,
    checkedInCount,
    totalConfirmed,
  } = useCheckIn(tournamentId);

  async function handleCheckIn(
    regId: string,
    status: "checked_in" | "not_arrived" | "no_show",
  ) {
    await baseCheckIn(regId, status);
    onDataChange();
  }

  return (
    <DialogShell
      title="Player Check-In"
      onClose={onClose}
      fullPageHref="/admin/check-in"
      wide
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
            <span className="text-lg font-bold text-emerald-400">
              {checkedInCount}
            </span>
            <span className="text-xs text-gray-400 ml-1">
              / {totalConfirmed}
            </span>
          </div>
          <Input
            size="sm"
            variant="bordered"
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
            startContent={
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
            }
            className="flex-1"
          />
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-500">
            No confirmed registrations to check in.
          </p>
        ) : (
          <div className="space-y-2 max-h-[55vh] overflow-y-auto">
            {filtered.map((reg) => {
              const player = reg.player;
              const status = reg.check_in_status ?? "not_arrived";
              return (
                <div
                  key={reg.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    status === "checked_in"
                      ? "bg-emerald-400/10 border-emerald-400/20"
                      : status === "no_show"
                        ? "bg-red-400/10 border-red-400/20"
                        : "bg-white/[0.02] border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {status === "checked_in" ? (
                      <CheckCircleIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : status === "no_show" ? (
                      <XCircleIcon className="w-5 h-5 text-red-400 shrink-0" />
                    ) : (
                      <ClockIcon className="w-5 h-5 text-gray-500 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm text-white font-medium">
                        {player?.first_name} {player?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{player?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {status !== "checked_in" && (
                      <Button
                        size="sm"
                        color="success"
                        variant="flat"
                        isLoading={actionId === reg.id}
                        onPress={() => handleCheckIn(reg.id, "checked_in")}
                      >
                        Check In
                      </Button>
                    )}
                    {status === "checked_in" && (
                      <Button
                        size="sm"
                        variant="light"
                        isLoading={actionId === reg.id}
                        onPress={() => handleCheckIn(reg.id, "not_arrived")}
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
                        onPress={() => handleCheckIn(reg.id, "no_show")}
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
    </DialogShell>
  );
}

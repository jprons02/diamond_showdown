"use client";

import { Button, Input } from "@heroui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { DialogShell } from "@/components/admin/DialogShell";
import { useRegistrations } from "@/hooks/admin/useRegistrations";
import {
  REG_STATUS_COLORS,
  PAY_STATUS_COLORS,
} from "@/lib/constants/statusColors";
import type { RegistrationStatus, PaymentStatus } from "@/lib/types/database";

export function RegistrationsDialog({
  tournamentId,
  onClose,
  onDataChange,
}: {
  tournamentId: string;
  onClose: () => void;
  onDataChange: () => void;
}) {
  const {
    registrations,
    filtered,
    loading,
    search,
    setSearch,
    paidCount,
    eligibleCount,
    updateField: baseUpdate,
  } = useRegistrations(tournamentId);

  async function updateField(
    id: string,
    field: string,
    value: string | boolean,
  ) {
    await baseUpdate(id, field, value);
    onDataChange();
  }

  return (
    <DialogShell
      title="Manage Registrations"
      onClose={onClose}
      fullPageHref="/admin/registrations"
      wide
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>
            <strong className="text-white">{registrations.length}</strong>{" "}
            registered
          </span>
          <span>
            <strong className="text-emerald-400">{paidCount}</strong> paid
          </span>
          <span>
            <strong className="text-brand-teal">{eligibleCount}</strong>{" "}
            draft-eligible
          </span>
        </div>

        <Input
          size="sm"
          variant="bordered"
          placeholder="Search by name or email..."
          value={search}
          onValueChange={setSearch}
          startContent={
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
          }
        />

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No registrations found.</p>
        ) : (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {filtered.map((reg) => {
              const player = reg.player;
              return (
                <div
                  key={reg.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white font-medium truncate">
                      {player?.first_name} {player?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {player?.email}
                    </p>
                  </div>
                  <select
                    value={reg.registration_status}
                    onChange={(e) =>
                      updateField(reg.id, "registration_status", e.target.value)
                    }
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer shrink-0 ${REG_STATUS_COLORS[reg.registration_status as RegistrationStatus] ?? ""}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="waitlisted">Waitlisted</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select
                    value={reg.payment_status}
                    onChange={(e) =>
                      updateField(reg.id, "payment_status", e.target.value)
                    }
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer shrink-0 ${PAY_STATUS_COLORS[reg.payment_status as PaymentStatus] ?? ""}`}
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  <Button
                    size="sm"
                    variant={reg.draft_eligible ? "flat" : "bordered"}
                    color={reg.draft_eligible ? "success" : "default"}
                    className="shrink-0 text-xs"
                    onPress={() =>
                      updateField(reg.id, "draft_eligible", !reg.draft_eligible)
                    }
                  >
                    {reg.draft_eligible ? "Eligible" : "Not Eligible"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DialogShell>
  );
}
